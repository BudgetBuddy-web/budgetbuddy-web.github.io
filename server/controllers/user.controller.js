/**
 * User Controller
 * Handles user profile and settings updates
 */

const User = require('../models/User.model');

/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, profilePic } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, profilePic },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          savingsGoal: user.savingsGoal,
          allTimeGoal: user.allTimeGoal,
          profilePic: user.profilePic,
          assistantPersonality: user.assistantPersonality,
          theme: user.theme
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/user/budget
 * @desc    Update savings goal
 * @access  Private
 */
exports.updateBudget = async (req, res) => {
  try {
    const { savingsGoal, allTimeGoal } = req.body;

    if (!savingsGoal || savingsGoal < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid monthly savings goal'
      });
    }

    if (allTimeGoal !== undefined && allTimeGoal < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid all-time goal'
      });
    }

    const updateData = { savingsGoal };
    if (allTimeGoal !== undefined) {
      updateData.allTimeGoal = allTimeGoal;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Savings goals updated successfully',
      data: {
        savingsGoal: user.savingsGoal,
        allTimeGoal: user.allTimeGoal
      }
    });
  } catch (error) {
    console.error('Update savings goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating savings goal',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/user/settings
 * @desc    Update user settings
 * @access  Private
 */
exports.updateSettings = async (req, res) => {
  try {
    const { assistantPersonality, theme } = req.body;

    const updateData = {};
    if (assistantPersonality) updateData.assistantPersonality = assistantPersonality;
    if (theme) updateData.theme = theme;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        assistantPersonality: user.assistantPersonality,
        theme: user.theme
      }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
};

/**
 * @route   PUT /api/user/change-password
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

/**
 * @route   DELETE /api/user/account
 * @desc    Delete user account and all associated data
 * @access  Private
 */
exports.deleteAccount = async (req, res) => {
  try {
    const Transaction = require('../models/Transaction.model');
    
    // Delete all user's transactions
    await Transaction.deleteMany({ userId: req.user._id });
    
    // Delete user account
    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: 'Account and all associated data deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/user/request-admin
 * @desc    Request admin access (for existing users)
 * @access  Private
 */
exports.requestAdminAccess = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check if user is already admin
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'You already have admin access'
      });
    }

    // Check if request is already pending
    if (user.adminRequestPending) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending admin request'
      });
    }

    // Set admin request pending
    user.adminRequestPending = true;
    user.adminRequestedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Admin access request sent successfully. Administrators will review your request.'
    });
  } catch (error) {
    console.error('Request admin access error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending admin request',
      error: error.message
    });
  }
};

/**
 * @route   POST /api/user/cancel-admin-request
 * @desc    Cancel pending admin access request
 * @access  Private
 */
exports.cancelAdminRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check if there's a pending request
    if (!user.adminRequestPending) {
      return res.status(400).json({
        success: false,
        message: 'No pending admin request found'
      });
    }

    // Cancel the request
    user.adminRequestPending = false;
    user.adminRequestedAt = null;
    await user.save();

    res.json({
      success: true,
      message: 'Admin request cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel admin request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling admin request',
      error: error.message
    });
  }
};
