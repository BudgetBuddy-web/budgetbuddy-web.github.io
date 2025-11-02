# 🧪 Admin Approval System - Testing Guide

**Date:** November 2, 2025  
**Feature:** Admin Request & Approval System Testing  
**Prerequisites:** Backend running on :5000, Frontend on :3000

---

## 🎯 Testing Objectives

1. ✅ Users can request admin access during registration
2. ✅ Requests are stored correctly in database
3. ✅ Admins see notification badge with count
4. ✅ Admin Requests page displays all pending requests
5. ✅ Approve functionality promotes user to admin
6. ✅ Reject functionality removes request
7. ✅ UI updates in real-time
8. ✅ Security: Only admins can access features

---

## 🔧 Test Environment Setup

### Prerequisites:
- ✅ Backend running: http://localhost:5000
- ✅ Frontend running: http://localhost:3000
- ✅ MongoDB connected
- ✅ At least 1 admin user exists (davidoliv0326@gmail.com)

### Admin Test Account:
```
Email: davidoliv0326@gmail.com
Password: 26032006david
Role: admin
```

---

## 🧪 Test Cases

### TEST 1: Register User with Admin Request ⭐
**Objective:** Verify users can request admin access

**Steps:**
1. Open browser: http://localhost:3000/register
2. Fill in form:
   - Name: `Test User Alpha`
   - Email: `testalpha@example.com`
   - Password: `Test123!`
3. ✅ **CHECK CHECKBOX:** "Request Admin Access (Requires approval from existing admins)"
4. Click "Register" button

**Expected Results:**
- ✅ Toast appears: "Account created! Admin request sent for approval."
- ✅ Redirected to dashboard (http://localhost:3000/dashboard)
- ✅ User can see normal user features
- ✅ NO "Admin" link in navbar (still regular user)

**Database Verification:**
```bash
# Check in MongoDB
db.users.findOne({ email: "testalpha@example.com" })

Expected:
{
  name: "Test User Alpha",
  email: "testalpha@example.com",
  role: "user",  // Still user, not admin yet
  adminRequestPending: true,  // Request pending
  adminRequestedAt: ISODate("..."),  // Timestamp
  ...
}
```

**Result:** ⬜ PASS / ⬜ FAIL

---

### TEST 2: Admin Sees Notification Badge 🔔
**Objective:** Verify admins see pending request notification

**Steps:**
1. Logout (if logged in as test user)
2. Login as admin:
   - Email: `davidoliv0326@gmail.com`
   - Password: `26032006david`
3. Look at dashboard (http://localhost:3000/dashboard)
4. Find "Quick Actions" section
5. Look at "👑 Admin" button

**Expected Results:**
- ✅ Admin Dashboard loads (showing graphs/charts)
- ✅ "Quick Actions" section visible
- ✅ "👑 Admin" button present
- ✅ **RED BADGE** showing count "1" (or number of pending requests)

**Result:** ⬜ PASS / ⬜ FAIL

---

### TEST 3: View Admin Requests Page 📋
**Objective:** Verify Admin Requests page displays correctly

**Steps:**
1. On Admin Dashboard
2. Click "👑 Admin Requests" button (the one with red badge)
3. Should redirect to: http://localhost:3000/admin/requests

**Expected Results:**
- ✅ Page loads with purple gradient background
- ✅ Title: "👑 Admin Access Requests"
- ✅ Subtitle: "Review and manage pending admin access requests"
- ✅ Table displayed with columns:
  - Name
  - Email
  - Requested On
  - Actions
- ✅ Row showing "Test User Alpha"
  - Email: testalpha@example.com
  - Requested date (formatted)
  - Two buttons: "✓ Approve" (green) and "✗ Reject" (red)

**Result:** ⬜ PASS / ⬜ FAIL

---

### TEST 4: Approve Admin Request ✅
**Objective:** Verify approval promotes user to admin

**Steps:**
1. On Admin Requests page
2. Find row for "Test User Alpha"
3. Click "✓ Approve" button
4. Confirmation dialog appears
5. Click "OK" to confirm

**Expected Results:**
- ✅ Confirmation dialog: "Are you sure you want to approve Test User Alpha as admin?"
- ✅ After clicking OK:
  - Toast appears: "✅ Test User Alpha has been promoted to admin!"
  - Row disappears from table
  - If no more requests: Shows "No Pending Requests" message
- ✅ Back to dashboard: Badge count decreases (or disappears if 0)

**Database Verification:**
```bash
db.users.findOne({ email: "testalpha@example.com" })

Expected:
{
  name: "Test User Alpha",
  email: "testalpha@example.com",
  role: "admin",  // Changed to admin!
  adminRequestPending: false,  // No longer pending
  adminRequestedAt: ISODate("..."),  // Timestamp preserved
  ...
}
```

**Login Verification:**
1. Logout
2. Login as testalpha@example.com / Test123!
3. Check navbar: Should see "👑 Admin" link
4. Click "Admin" → Should access Admin Dashboard

**Result:** ⬜ PASS / ⬜ FAIL

---

### TEST 5: Register Another User (For Reject Test) 👤
**Objective:** Create another test user to test rejection

**Steps:**
1. Logout
2. Go to http://localhost:3000/register
3. Fill in:
   - Name: `Test User Beta`
   - Email: `testbeta@example.com`
   - Password: `Test123!`
4. ✅ **CHECK CHECKBOX:** "Request Admin Access"
5. Click "Register"

**Expected Results:**
- ✅ Toast: "Account created! Admin request sent for approval."
- ✅ Redirected to dashboard
- ✅ User is regular user (no admin link)

**Result:** ⬜ PASS / ⬜ FAIL

---

### TEST 6: Reject Admin Request ❌
**Objective:** Verify rejection removes request without promoting

**Steps:**
1. Login as admin (davidoliv0326@gmail.com)
2. Go to Admin Dashboard
3. Badge should show "1" (one pending request)
4. Click "Admin Requests"
5. Find "Test User Beta" row
6. Click "✗ Reject" button
7. Confirmation dialog appears
8. Click "OK"

**Expected Results:**
- ✅ Confirmation dialog: "Are you sure you want to reject Test User Beta's request?"
- ✅ After clicking OK:
  - Toast: "❌ Test User Beta's admin request has been rejected"
  - Row disappears from table
  - Shows "No Pending Requests" (if no other requests)
- ✅ Badge on dashboard disappears (0 requests)

**Database Verification:**
```bash
db.users.findOne({ email: "testbeta@example.com" })

Expected:
{
  name: "Test User Beta",
  email: "testbeta@example.com",
  role: "user",  // Still user (NOT promoted)
  adminRequestPending: false,  // No longer pending
  adminRequestedAt: null,  // Cleared on rejection
  ...
}
```

**Login Verification:**
1. Logout
2. Login as testbeta@example.com / Test123!
3. Check navbar: Should NOT see "Admin" link
4. Navigate to http://localhost:3000/admin manually
5. Should be redirected (not authorized)

**Result:** ⬜ PASS / ⬜ FAIL

---

### TEST 7: Empty State Display 🎨
**Objective:** Verify UI shows correct empty state

**Steps:**
1. Login as admin
2. Go to Admin Requests page
3. Ensure all requests are approved/rejected

**Expected Results:**
- ✅ No table displayed
- ✅ Green checkmark icon (✅)
- ✅ Title: "No Pending Requests"
- ✅ Message: "There are currently no pending admin access requests."
- ✅ No errors in console

**Result:** ⬜ PASS / ⬜ FAIL

---

### TEST 8: Security - Non-Admin Access 🔒
**Objective:** Verify non-admins cannot access admin features

**Steps:**
1. Register/Login as regular user (or use testbeta)
2. Try to access: http://localhost:3000/admin/requests directly
3. Check navbar for "Admin" link

**Expected Results:**
- ✅ No "Admin" link visible in navbar
- ✅ Direct URL access → Redirected to /dashboard
- ✅ Toast: "Unauthorized: Admin access required" (or similar)
- ✅ Cannot see admin requests page

**Result:** ⬜ PASS / ⬜ FAIL

---

### TEST 9: Multiple Pending Requests 📊
**Objective:** Verify system handles multiple requests

**Steps:**
1. Register 3 new users with admin requests:
   - testgamma@example.com
   - testdelta@example.com
   - testepsilon@example.com
2. All check "Request Admin Access"
3. Login as admin
4. Go to Admin Requests page

**Expected Results:**
- ✅ Badge shows "3"
- ✅ Table displays all 3 requests
- ✅ Each has Approve/Reject buttons
- ✅ Can approve one → count updates to "2"
- ✅ Can reject one → count updates to "1"
- ✅ Can approve last → shows empty state

**Result:** ⬜ PASS / ⬜ FAIL

---

### TEST 10: API Endpoints Direct Test 🔌
**Objective:** Verify backend endpoints work correctly

**Test GET /api/admin/requests:**
```bash
curl -X GET http://localhost:5000/api/admin/requests \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

Expected Response:
{
  "success": true,
  "data": {
    "requests": [...],
    "count": <number>
  }
}
```

**Test PUT /api/admin/requests/:id/approve:**
```bash
curl -X PUT http://localhost:5000/api/admin/requests/<USER_ID>/approve \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

Expected Response:
{
  "success": true,
  "message": "User has been promoted to admin",
  "data": { "user": {...} }
}
```

**Test PUT /api/admin/requests/:id/reject:**
```bash
curl -X PUT http://localhost:5000/api/admin/requests/<USER_ID>/reject \
  -H "Authorization: Bearer <ADMIN_TOKEN>"

Expected Response:
{
  "success": true,
  "message": "Admin request has been rejected",
  "data": { "user": {...} }
}
```

**Result:** ⬜ PASS / ⬜ FAIL

---

## 📊 Test Results Summary

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Register with Admin Request | ⬜ | |
| 2 | Admin Notification Badge | ⬜ | |
| 3 | Admin Requests Page Display | ⬜ | |
| 4 | Approve Request | ⬜ | |
| 5 | Register for Reject Test | ⬜ | |
| 6 | Reject Request | ⬜ | |
| 7 | Empty State Display | ⬜ | |
| 8 | Non-Admin Security | ⬜ | |
| 9 | Multiple Requests | ⬜ | |
| 10 | API Endpoints | ⬜ | |

**Overall Status:** ⬜ All Pass / ⬜ Some Failures

---

## 🐛 Known Issues / Edge Cases

### Edge Case 1: Request Spam
**Scenario:** User registers multiple accounts requesting admin
**Current Behavior:** All appear in requests list
**Consideration:** May want to limit by email domain or add cooldown

### Edge Case 2: Already Admin
**Scenario:** Admin user requests admin again
**Current Behavior:** Request appears even though already admin
**Fix Needed:** Check if user is already admin before allowing request

### Edge Case 3: Request During OAuth Login
**Scenario:** Users signing in with Google OAuth
**Current Behavior:** No option to request admin (only on email registration)
**Future:** Add admin request button in user settings

---

## ✅ Acceptance Criteria

**Feature Complete When:**
- ✅ All 10 tests pass
- ✅ No console errors
- ✅ UI is responsive and user-friendly
- ✅ Security checks prevent unauthorized access
- ✅ Database state is correct after all operations
- ✅ Notifications work properly
- ✅ Empty states display correctly

---

## 🚀 Next Steps After Testing

1. **If All Tests Pass:**
   - ✅ Push to GitHub
   - ✅ Update README.md with admin approval instructions
   - ✅ Update 3IA compliance (now 100% compliant)
   - ✅ Deploy to production

2. **If Tests Fail:**
   - 🐛 Document failures
   - 🔧 Fix bugs
   - 🔄 Re-test
   - 📝 Update this guide with findings

---

**Testing Started:** _______________  
**Testing Completed:** _______________  
**Tested By:** _______________  
**Result:** ⬜ PASSED / ⬜ FAILED
