/**
 * User Routes
 */

const express = require('express');
const router = express.Router();
const { updateProfile, updateBudget, updateSettings, deleteAccount } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

router.put('/profile', updateProfile);
router.put('/budget', updateBudget);
router.put('/settings', updateSettings);
router.delete('/account', deleteAccount);

module.exports = router;
