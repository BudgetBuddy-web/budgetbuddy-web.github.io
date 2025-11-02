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
        const totalIncome = await Transaction.aggregate([
          { $match: { userId: user._id, type: 'income' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalExpenses = await Transaction.aggregate([
          { $match: { userId: user._id, type: 'expense' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        return {
          ...user.toObject(),
          transactionCount,
          totalIncome: totalIncome[0]?.total || 0,
          totalExpenses: totalExpenses[0]?.total || 0
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

    const transactions = await Transaction.find({ userId: user._id }).sort({ date: -1 });

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

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

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
          allTimeGoal: user.allTimeGoal,
          profilePic: user.profilePic,
          theme: user.theme,
          assistantPersonality: user.assistantPersonality
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
    user.updatedAt = Date.now();

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
          assistantPersonality: user.assistantPersonality,
          profilePic: user.profilePic
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
    const deletedTransactions = await Transaction.deleteMany({ userId: user._id });

    // Delete user
    await user.deleteOne();

    res.json({
      success: true,
      message: `User and ${deletedTransactions.deletedCount} associated transactions deleted successfully`
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
 * @route   DELETE /api/admin/transactions/:id
 * @desc    Delete any transaction (admin only)
 * @access  Private/Admin
 */
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    await transaction.deleteOne();

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting transaction',
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
    const adminCount = await User.countDocuments({ role: 'admin' });
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

    // Category breakdown
    const categoryStats = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        adminCount,
        normalUserCount: totalUsers - adminCount,
        totalTransactions,
        totalIncome: totalIncome[0]?.total || 0,
        totalExpenses: totalExpenses[0]?.total || 0,
        netBalance: (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0),
        recentActivity,
        categoryStats
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

/**
 * @route   GET /api/admin/requests
 * @desc    Get all pending admin requests (admin only)
 * @access  Private/Admin
 */
exports.getAdminRequests = async (req, res) => {
  try {
    const pendingRequests = await User.find({ 
      adminRequestPending: true,
      role: 'user'
    }).select('-password').sort({ adminRequestedAt: -1 });

    res.json({
      success: true,
      data: {
        requests: pendingRequests,
        count: pendingRequests.length
      }
    });
  } catch (error) {
    console.error('Get admin requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin requests',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/admin/requests/:id/approve
 * @desc    Approve admin request (admin only)
 * @access  Private/Admin
 */
exports.approveAdminRequest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.adminRequestPending) {
      return res.status(400).json({
        success: false,
        message: 'No pending admin request for this user'
      });
    }

    user.role = 'admin';
    user.adminRequestPending = false;
    await user.save();

    res.json({
      success: true,
      message: `${user.name} has been promoted to admin`,
      data: { user }
    });
  } catch (error) {
    console.error('Approve admin request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving admin request',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/admin/requests/:id/reject
 * @desc    Reject admin request (admin only)
 * @access  Private/Admin
 */
exports.rejectAdminRequest = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.adminRequestPending) {
      return res.status(400).json({
        success: false,
        message: 'No pending admin request for this user'
      });
    }

    user.adminRequestPending = false;
    user.adminRequestedAt = null;
    await user.save();

    res.json({
      success: true,
      message: `Admin request for ${user.name} has been rejected`,
      data: { user }
    });
  } catch (error) {
    console.error('Reject admin request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting admin request',
      error: error.message
    });
  }
};

module.exports = exports;
