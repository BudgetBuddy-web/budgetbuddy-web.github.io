# Terms & Conditions and User Management Enhancements

## Overview
This document describes the new features added to improve user management, compliance, and ethical data handling.

---

## 🆕 Features Added

### 1. **Terms & Conditions Modal (Registration)**

**Location:** Registration page  
**Purpose:** Users must accept terms before creating an account

#### Implementation:
- **Modal popup** appears during registration process
- Users must click "I Accept" to continue
- Cannot register without accepting terms

#### Terms Content:
```
📋 Account Inactivity Policy

1. Inactivity Period
   - Accounts inactive for 30+ days are flagged

2. Account Deletion
   - Inactive accounts may be permanently deleted by admins
   - Maintains system efficiency and data hygiene

3. Data Deletion
   When an account is deleted:
   - User profile removed
   - All transactions deleted
   - Budget goals removed
   - All associated data erased

4. Notification
   - No automatic notification before deletion
   - Users should log in regularly

5. Ethical Data Management
   - Ensures we don't retain unused personal data indefinitely
   - Complies with data privacy best practices
```

#### Technical Details:
- **Frontend:** `client/src/pages/Register.js` - Modal component
- **Backend:** `server/controllers/auth.controller.js` - Validates `acceptedTerms`
- **Database:** `server/models/User.model.js` - Fields:
  - `acceptedTerms: Boolean`
  - `termsAcceptedAt: Date`
  - `lastActivity: Date`

---

### 2. **Inactivity Tracking**

**Purpose:** Automatically track when users last interacted with the system

#### How It Works:
1. Every API request updates `lastActivity` timestamp
2. Calculated on every protected route via middleware
3. Non-blocking update (doesn't slow down requests)

#### Implementation:
- **Middleware:** `server/middleware/auth.middleware.js`
- Updates `lastActivity` field on every authenticated request
- Calculates inactivity days: `(Today - lastActivity) / 24 hours`

---

### 3. **Enhanced Admin Users Page**

**Location:** `/admin/users`  
**Access:** Admin only

#### New Features:

##### A. **Separate Tables**
- **Admin Users Table** - Shows all admins
- **Regular Users Table** - Shows all regular users
- Better organization and clarity

##### B. **Sortable Columns** (Click to Sort)
All columns are sortable with visual indicators:
- ▲ Ascending sort
- ▼ Descending sort
- ⇅ Not currently sorted

**Admin Table Columns:**
- User (name)
- Email
- Joined date
- Last Login
- Transactions count

**Regular Users Table Columns:**
- User (name)
- Email
- Status (Active/Inactive/Pending)
- **Inactive Days** ⚠️ (NEW!)
- Joined date
- Last Login
- Transactions count

##### C. **Inactivity Highlighting**
- Users inactive for 30+ days:
  - Row highlighted in **red background**
  - Status badge shows "⚠️ Inactive"
  - Inactive days shown in **red bold text**
  - Delete button changes to solid red

##### D. **Enhanced Statistics**
- Total Users
- Admins count
- Regular Users count
- **Inactive 30+ Days** ⚠️ (NEW!)

##### E. **Ethical Deletion Notice**
When deleting a user, modal shows:
- User details
- Transaction count
- **Inactive days count**
- Ethical notice about data privacy compliance

---

## 📊 User Flow

### Registration Flow
```
1. User fills registration form
2. User clicks "Register"
3. 📋 Terms & Conditions modal appears
4. User reads terms
5. User clicks "I Accept" or "Decline"
   ├─ Accept → Registration completes
   └─ Decline → Returns to form (must accept to register)
6. Account created with:
   - acceptedTerms: true
   - termsAcceptedAt: current timestamp
   - lastActivity: current timestamp
```

### Admin User Management Flow
```
1. Admin visits /admin/users
2. Sees two separate tables:
   ├─ 👑 Admin Users Table
   └─ 👤 Regular Users Table
3. Can sort any column by clicking header
4. Inactive users (30+ days) highlighted in red
5. Can delete users with "REMOVE" confirmation
6. Deletion shows ethical notice about data privacy
```

---

## 🔒 Security & Privacy

### Data Protection
- Terms acceptance is **required** for registration
- `acceptedTerms` field validates user consent
- Timestamp of acceptance stored (`termsAcceptedAt`)

### Activity Tracking
- Non-intrusive (updates in background)
- Doesn't slow down user requests
- Helps identify abandoned accounts

### Ethical Deletion
- Clear notice shown before deletion
- Inactivity days displayed
- Compliance with data privacy policies
- Users accepted these terms during registration

---

## 🎨 UI/UX Enhancements

### Terms Modal
- **Large modal** for readability
- Scrollable content area
- Cannot close without decision (Accept/Decline)
- Clear, structured content with sections
- Warning badges for important info

### Admin Users Page
- **Separate tables** reduce confusion
- **Sortable columns** improve usability
- **Visual indicators**:
  - Red background for inactive users
  - Red badge "⚠️ Inactive"
  - Sort arrows (▲▼⇅)
  - Color-coded statistics
- **Responsive design** works on all devices

---

## 🛠️ Technical Implementation

### Frontend Changes

**File: `client/src/pages/Register.js`**
```javascript
// New state
const [showTermsModal, setShowTermsModal] = useState(false);
const [acceptedTerms, setAcceptedTerms] = useState(false);

// Form submission checks terms
if (!acceptedTerms) {
  setShowTermsModal(true);
  return;
}

// Terms modal component added
<Modal show={showTermsModal} backdrop="static" keyboard={false}>
  {/* Terms content */}
</Modal>
```

**File: `client/src/pages/AdminUsers.js` (Complete Rewrite)**
- 600+ lines
- Sorting logic for both tables
- Inactivity calculation
- Separate admin/user rendering
- Enhanced statistics

**File: `client/src/pages/AdminUsers.css`**
- `.inactive-user` class for highlighting
- `.section-header` for table titles
- Sortable column hover effects

### Backend Changes

**File: `server/models/User.model.js`**
```javascript
// New fields
acceptedTerms: { type: Boolean, default: false },
termsAcceptedAt: { type: Date, default: null },
lastActivity: { type: Date, default: Date.now }
```

**File: `server/controllers/auth.controller.js`**
```javascript
// Validate terms acceptance
if (!acceptedTerms) {
  return res.status(400).json({
    message: 'You must accept the terms and conditions'
  });
}

// Set fields on registration
acceptedTerms: true,
termsAcceptedAt: new Date(),
lastActivity: new Date()
```

**File: `server/middleware/auth.middleware.js`**
```javascript
// Update lastActivity on every authenticated request
User.findByIdAndUpdate(decoded.id, { 
  lastActivity: new Date() 
}).catch(err => console.error('Failed to update lastActivity:', err));
```

---

## 📈 Statistics Tracking

### Inactivity Calculation
```javascript
const calculateInactivityDays = (lastActivity) => {
  if (!lastActivity) return 0;
  const now = new Date();
  const lastActiveDate = new Date(lastActivity);
  const diffTime = Math.abs(now - lastActiveDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
```

### Auto-Highlighting
```javascript
const isInactive = inactiveDays > 30;

<tr className={isInactive ? 'inactive-user' : ''}>
  <td>
    <span className={isInactive ? 'text-danger fw-bold' : ''}>
      {inactiveDays} days {isInactive && '⚠️'}
    </span>
  </td>
</tr>
```

---

## 🚀 Deployment

### Build & Deploy
```bash
# Frontend
cd client
npm run build

# Commit and push
git add .
git commit -m "feat: Terms & Conditions + Inactivity Tracking + Enhanced User Management"
git push origin main
```

### Environment Variables
No new environment variables needed. All features work with existing setup.

---

## ✅ Testing Checklist

### Registration
- [ ] Terms modal appears on registration
- [ ] Cannot register without accepting terms
- [ ] "Decline" returns to form
- [ ] "Accept" completes registration
- [ ] `acceptedTerms` field saved in database
- [ ] `termsAcceptedAt` timestamp recorded

### Inactivity Tracking
- [ ] `lastActivity` updates on login
- [ ] `lastActivity` updates on API requests
- [ ] Inactivity days calculated correctly
- [ ] 30+ days shows as inactive

### Admin Users Page
- [ ] Two separate tables displayed
- [ ] Sorting works on all columns
- [ ] Sort icons display correctly (▲▼⇅)
- [ ] Inactive users highlighted in red
- [ ] Statistics show correct counts
- [ ] Delete confirmation shows inactivity days
- [ ] Ethical notice displayed in delete modal

---

## 🎯 Benefits

### For Users
- **Transparency:** Clear understanding of account policies
- **Informed consent:** Know what happens to inactive accounts
- **Peace of mind:** Simple login keeps account active

### For Admins
- **Better organization:** Separate admin/user tables
- **Quick identification:** Inactive users highlighted
- **Efficient management:** Sortable columns
- **Compliance tracking:** See who accepted terms and when

### For the System
- **Data hygiene:** Remove abandoned accounts
- **Privacy compliance:** Don't retain unused data
- **Ethical practices:** Users consented to policy
- **Resource optimization:** Clean up inactive data

---

## 📝 Future Enhancements

### Potential Additions
1. **Email notifications** before deletion (7 days warning)
2. **Bulk delete** inactive users
3. **Export user data** before deletion
4. **Automated cleanup** job (cron task)
5. **Activity logs** to show what users are doing
6. **Grace period** setting (configurable days)
7. **Reactivation requests** from deleted users

---

## 🔗 Related Documentation

- `ADMIN_APPROVAL_SYSTEM.md` - Admin request/approval workflow
- `SECURITY.md` - Security practices
- `HOW_TO_RUN.md` - Running the application
- `BACKEND_DEPLOYMENT.md` - Deploying backend
- `GITHUB_PAGES_DEPLOYMENT.md` - Deploying frontend

---

## 👨‍💻 Created By

**DAVID OLIVER J**  
URK23CS1305  
BudgetBuddy - Personal Finance Management System

---

**Last Updated:** November 2, 2025  
**Version:** 2.0.0
