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
  deleteTransaction,
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
router.delete('/transactions/:id', deleteTransaction);

// System statistics
router.get('/stats', getSystemStats);

module.exports = router;
