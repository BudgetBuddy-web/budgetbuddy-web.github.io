# 🚀 Role-Based Implementation Guide
**Step-by-Step Guide to Add Admin/User Roles to BudgetBuddy**

**Estimated Time:** 12-17 hours  
**Difficulty:** Intermediate  
**Goal:** Make BudgetBuddy compliant with 3IA Role-Based requirements

---

## 📋 PHASE 1: DATABASE & BACKEND (5-6 hours)

### Step 1.1: Update User Model (30 minutes)

**File:** `server/models/User.model.js`

**Add role field after email:**

```javascript
email: {
  type: String,
  required: [true, 'Email is required'],
  unique: true,
  lowercase: true,
  trim: true,
  match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
},
// ✅ ADD THIS NEW FIELD
role: {
  type: String,
  enum: ['admin', 'user'],
  default: 'user',
  required: true
},
password: {
  type: String,
  minlength: [6, 'Password must be at least 6 characters'],
  select: false
},
```

**Update registration to include role in response:**

Find the line that returns user data in `server/controllers/auth.controller.js` (around line 63):

```javascript
user: {
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,  // ✅ ADD THIS LINE
  savingsGoal: user.savingsGoal,
  allTimeGoal: user.allTimeGoal,
  profilePic: user.profilePic,
  assistantPersonality: user.assistantPersonality,
  theme: user.theme
}
```

**Do the same for login, googleAuth, and getMe endpoints!**

---

### Step 1.2: Create Admin Middleware (30 minutes)

**File:** `server/middleware/auth.middleware.js`

**Add this after the existing `protect` middleware:**

```javascript
/**
 * Require Admin Role
 * Middleware to check if user has admin role
 */
exports.requireAdmin = async (req, res, next) => {
  try {
    // User should already be authenticated via protect middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, please login first'
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking admin privileges',
      error: error.message
    });
  }
};

/**
 * Check Own Resource or Admin
 * Allows users to access their own resources or admins to access any
 */
exports.checkOwnershipOrAdmin = async (req, res, next) => {
  try {
    const resourceUserId = req.params.userId || req.body.userId;
    
    // Admin can access anything
    if (req.user.role === 'admin') {
      return next();
    }
    
    // User can only access their own resources
    if (req.user._id.toString() !== resourceUserId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own data.'
      });
    }
    
    next();
  } catch (error) {
    console.error('Ownership check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking resource ownership',
      error: error.message
    });
  }
};
```

---

### Step 1.3: Create Admin Controller (1.5 hours)

**Create new file:** `server/controllers/admin.controller.js`

```javascript
/**
 * Admin Controller
 * Handles admin-only operations like user management
 */

const User = require('../models/User.model');
const Transaction = require('../models/Transaction.model');

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (admin only)
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    
    // Get transaction counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const transactionCount = await Transaction.countDocuments({ userId: user._id });
        return {
          ...user.toObject(),
          transactionCount
        };
      })
    );

    res.json({
      success: true,
      data: {
        users: usersWithStats,
        count: usersWithStats.length
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get single user by ID (admin only)
 * @access  Private/Admin
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const transactions = await Transaction.find({ userId: user._id });

    res.json({
      success: true,
      data: {
        user: user.toObject(),
        transactions,
        transactionCount: transactions.length
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/admin/users
 * @desc    Create new user (admin only)
 * @access  Private/Admin
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, savingsGoal, allTimeGoal } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      savingsGoal: savingsGoal || 5000,
      allTimeGoal: allTimeGoal || 20000
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          savingsGoal: user.savingsGoal,
          allTimeGoal: user.allTimeGoal
        }
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update user (admin only)
 * @access  Private/Admin
 */
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, savingsGoal, allTimeGoal, theme, assistantPersonality } = req.body;

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (savingsGoal !== undefined) user.savingsGoal = savingsGoal;
    if (allTimeGoal !== undefined) user.allTimeGoal = allTimeGoal;
    if (theme) user.theme = theme;
    if (assistantPersonality) user.assistantPersonality = assistantPersonality;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          savingsGoal: user.savingsGoal,
          allTimeGoal: user.allTimeGoal,
          theme: user.theme,
          assistantPersonality: user.assistantPersonality
        }
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user (admin only)
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account as admin. Use account deletion in settings.'
      });
    }

    // Delete user's transactions first
    await Transaction.deleteMany({ userId: user._id });

    // Delete user
    await user.deleteOne();

    res.json({
      success: true,
      message: 'User and associated transactions deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/transactions
 * @desc    Get all transactions from all users (admin only)
 * @access  Private/Admin
 */
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({})
      .populate('userId', 'name email')
      .sort({ date: -1 });

    res.json({
      success: true,
      data: {
        transactions,
        count: transactions.length
      }
    });
  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message
    });
  }
};

/**
 * @route   GET /api/admin/stats
 * @desc    Get system statistics (admin only)
 * @access  Private/Admin
 */
exports.getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    const totalIncome = await Transaction.aggregate([
      { $match: { type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalExpenses = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Recent activity (last 10 transactions)
    const recentActivity = await Transaction.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalTransactions,
        totalIncome: totalIncome[0]?.total || 0,
        totalExpenses: totalExpenses[0]?.total || 0,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching system statistics',
      error: error.message
    });
  }
};

module.exports = exports;
```

---

### Step 1.4: Create Admin Routes (30 minutes)

**Create new file:** `server/routes/admin.routes.js`

```javascript
/**
 * Admin Routes
 * Routes for admin-only operations
 */

const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/auth.middleware');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllTransactions,
  getSystemStats
} = require('../controllers/admin.controller');

// All routes require authentication AND admin role
router.use(protect);
router.use(requireAdmin);

// User management routes
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Transaction management routes
router.get('/transactions', getAllTransactions);

// System statistics
router.get('/stats', getSystemStats);

module.exports = router;
```

---

### Step 1.5: Register Admin Routes (15 minutes)

**File:** `server/server.js`

**Add admin routes after existing routes:**

```javascript
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const transactionRoutes = require('./routes/transaction.routes');
const reportRoutes = require('./routes/report.routes');
const adminRoutes = require('./routes/admin.routes'); // ✅ ADD THIS

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes); // ✅ ADD THIS
```

---

### Step 1.6: Add Password Change (1 hour)

**File:** `server/controllers/user.controller.js`

**Add this new function:**

```javascript
/**
 * @route   PUT /api/users/change-password
 * @desc    Change user password
 * @access  Private
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change password for Google OAuth users'
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
};
```

**File:** `server/routes/user.routes.js`

**Add the route:**

```javascript
const {
  updateProfile,
  updateBudget,
  deleteAccount,
  changePassword // ✅ ADD THIS
} = require('../controllers/user.controller');

router.put('/profile', protect, updateProfile);
router.put('/budget', protect, updateBudget);
router.delete('/', protect, deleteAccount);
router.put('/change-password', protect, changePassword); // ✅ ADD THIS
```

---

### Step 1.7: Create Migration Script (30 minutes)

**Create new file:** `server/utils/addRolesToUsers.js`

```javascript
/**
 * Migration Script: Add role field to existing users
 * Run once to update database
 */

const mongoose = require('mongoose');
const User = require('../models/User.model');
require('dotenv').config();

const addRolesToUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    // Update all users without a role field
    const result = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'user' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} users with 'user' role`);

    // Promote first user to admin (or specify email)
    const adminEmail = 'your-email@example.com'; // ✅ CHANGE THIS
    const admin = await User.findOneAndUpdate(
      { email: adminEmail },
      { $set: { role: 'admin' } },
      { new: true }
    );

    if (admin) {
      console.log(`✅ Promoted ${admin.email} to admin`);
    } else {
      console.log(`⚠️ No user found with email ${adminEmail}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

addRolesToUsers();
```

**Run the migration:**
```bash
cd server
node utils/addRolesToUsers.js
```

---

## 📋 PHASE 2: FRONTEND (6-8 hours)

### Step 2.1: Update API Service (30 minutes)

**File:** `client/src/services/api.js`

**Add admin API endpoints:**

```javascript
// Admin APIs
export const adminAPI = {
  // Users
  getAllUsers: () => axios.get('/admin/users'),
  getUserById: (id) => axios.get(`/admin/users/${id}`),
  createUser: (userData) => axios.post('/admin/users', userData),
  updateUser: (id, userData) => axios.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => axios.delete(`/admin/users/${id}`),
  
  // Transactions
  getAllTransactions: () => axios.get('/admin/transactions'),
  
  // Stats
  getSystemStats: () => axios.get('/admin/stats')
};

// User APIs
export const userAPI = {
  updateProfile: (data) => axios.put('/users/profile', data),
  updateBudget: (data) => axios.put('/users/budget', data),
  deleteAccount: () => axios.delete('/users'),
  changePassword: (data) => axios.put('/users/change-password', data) // ✅ ADD THIS
};
```

---

### Step 2.2: Create Admin Dashboard (2 hours)

**Create new file:** `client/src/pages/AdminDashboard.js`

```javascript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (user?.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      navigate('/dashboard');
      return;
    }

    loadStats();
  }, [user, navigate]);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getSystemStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Load stats error:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, transactions, and system settings</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats?.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💳</div>
          <div className="stat-info">
            <h3>{stats?.totalTransactions || 0}</h3>
            <p>Total Transactions</p>
          </div>
        </div>

        <div className="stat-card income">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>₹{stats?.totalIncome?.toFixed(2) || '0.00'}</h3>
            <p>Total Income</p>
          </div>
        </div>

        <div className="stat-card expense">
          <div className="stat-icon">💸</div>
          <div className="stat-info">
            <h3>₹{stats?.totalExpenses?.toFixed(2) || '0.00'}</h3>
            <p>Total Expenses</p>
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/admin/users')}
        >
          👥 Manage Users
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/admin/transactions')}
        >
          💳 View All Transactions
        </button>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {stats?.recentActivity?.map((transaction) => (
            <div key={transaction._id} className="activity-item">
              <div className="activity-user">
                <strong>{transaction.userId?.name}</strong>
                <span>{transaction.userId?.email}</span>
              </div>
              <div className="activity-details">
                <span className={`type ${transaction.type}`}>
                  {transaction.type}
                </span>
                <span className="category">{transaction.category}</span>
                <span className={`amount ${transaction.type}`}>
                  ₹{transaction.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
```

**Create CSS file:** `client/src/pages/AdminDashboard.css`

```css
.admin-dashboard {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 32px;
}

.dashboard-header h1 {
  font-size: 2rem;
  margin-bottom: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 3rem;
}

.stat-info h3 {
  font-size: 2rem;
  margin: 0;
  color: #333;
}

.stat-info p {
  margin: 4px 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

.stat-card.income .stat-info h3 {
  color: #10b981;
}

.stat-card.expense .stat-info h3 {
  color: #ef4444;
}

.admin-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.admin-actions .btn {
  padding: 12px 24px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.recent-activity {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recent-activity h2 {
  margin-bottom: 20px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.activity-user {
  display: flex;
  flex-direction: column;
}

.activity-user strong {
  font-size: 0.95rem;
}

.activity-user span {
  font-size: 0.85rem;
  color: #6b7280;
}

.activity-details {
  display: flex;
  gap: 12px;
  align-items: center;
}

.type {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: capitalize;
}

.type.income {
  background: #d1fae5;
  color: #065f46;
}

.type.expense {
  background: #fee2e2;
  color: #991b1b;
}

.amount {
  font-weight: 600;
  font-size: 1.1rem;
}

.amount.income {
  color: #10b981;
}

.amount.expense {
  color: #ef4444;
}
```

---

### Step 2.3: Create User Management Page (3 hours)

**Due to length constraints, I'll provide the structure:**

**Create file:** `client/src/pages/UserManagement.js`

This page should have:
- Table of all users
- Add User button/modal
- Edit User button/modal
- Delete User button with confirmation
- Search/filter functionality
- Role change dropdown

---

### Step 2.4: Update Navigation (30 minutes)

**File:** `client/src/components/Layout.js`

**Add admin menu items:**

```javascript
{user?.role === 'admin' && (
  <li>
    <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
      <span className="nav-icon">⚙️</span>
      <span className="nav-text">Admin</span>
    </Link>
  </li>
)}
```

---

### Step 2.5: Add Role-Based Routing (1 hour)

**File:** `client/src/App.js`

**Add admin routes:**

```javascript
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';

// Inside Routes
<Route 
  path="/admin" 
  element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />} 
/>
<Route 
  path="/admin/users" 
  element={user?.role === 'admin' ? <UserManagement /> : <Navigate to="/dashboard" />} 
/>
```

---

### Step 2.6: Add Password Change UI (1 hour)

**File:** `client/src/pages/Settings.js`

**Add a new section:**

```javascript
<div className="settings-section">
  <h2 className="section-title">Change Password</h2>
  <form onSubmit={handlePasswordChange}>
    <div className="form-group">
      <label>Current Password</label>
      <input 
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
    </div>
    <div className="form-group">
      <label>New Password</label>
      <input 
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        minLength={6}
        required
      />
    </div>
    <div className="form-group">
      <label>Confirm New Password</label>
      <input 
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
    </div>
    <button type="submit" className="btn btn-primary">
      Change Password
    </button>
  </form>
</div>
```

---

## 📋 PHASE 3: BOOTSTRAP INTEGRATION (2-3 hours)

### Step 3.1: Install Bootstrap (5 minutes)

```bash
cd client
npm install bootstrap react-bootstrap
```

### Step 3.2: Import Bootstrap (5 minutes)

**File:** `client/src/index.js`

```javascript
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
```

### Step 3.3: Convert Components (2-3 hours)

**Convert key components to use Bootstrap classes:**

- Use `<Container>`, `<Row>`, `<Col>` for layout
- Use Bootstrap cards: `<Card>`
- Use Bootstrap buttons: `<Button variant="primary">`
- Use Bootstrap forms: `<Form>`, `<Form.Group>`, `<Form.Control>`
- Use Bootstrap tables: `<Table striped bordered hover>`
- Use Bootstrap navbar: Keep custom or convert

**Keep custom styles for:**
- Live2D assistant (unique feature)
- Theme colors (override Bootstrap with your purple gradient)
- Animations

---

## ✅ TESTING CHECKLIST

After implementation:

### Backend Tests:
- [ ] User registration creates user with 'user' role
- [ ] Admin can access `/api/admin/*` endpoints
- [ ] Normal user gets 403 on `/api/admin/*` endpoints
- [ ] Admin can view all users
- [ ] Admin can create/update/delete users
- [ ] Admin can view all transactions
- [ ] Password change works for all users

### Frontend Tests:
- [ ] Admin login redirects to `/admin`
- [ ] User login redirects to `/dashboard`
- [ ] Admin sees "Admin" menu item
- [ ] User doesn't see "Admin" menu item
- [ ] Admin can access User Management page
- [ ] User gets redirected from admin pages
- [ ] Password change form works
- [ ] Bootstrap styles applied correctly

---

## 📝 FINAL STEPS

1. **Test Everything** (2 hours)
2. **Update Documentation** (1 hour)
   - Update README with admin credentials
   - Document role-based features
   - Add screenshots of admin dashboard
3. **Deploy** (30 minutes)
   - Rebuild frontend: `cd client && npm run build`
   - Push to GitHub
4. **Create Demo Video** (optional, 30 minutes)

---

## 🎯 TOTAL ESTIMATED TIME

- Phase 1 (Backend): 5-6 hours
- Phase 2 (Frontend): 6-8 hours
- Phase 3 (Bootstrap): 2-3 hours
- Testing & Documentation: 3 hours

**Total: 16-20 hours** (more realistic estimate)

---

**Good luck! 🚀**

Once you complete these steps, your BudgetBuddy will fully comply with 3IA Role-Based requirements and be ready for A+ grade!
