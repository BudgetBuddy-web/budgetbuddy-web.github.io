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
    const { savingsGoal } = req.body;

    if (!savingsGoal || savingsGoal < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid savings goal'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { savingsGoal },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Savings goal updated successfully',
      data: {
        savingsGoal: user.savingsGoal
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
