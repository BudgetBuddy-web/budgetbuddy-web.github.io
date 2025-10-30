const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { dbLimiter } = require('../middleware/rateLimiter');
const Budget = require('../models/Budget');

// Get all budgets for user
router.get('/', auth, dbLimiter, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(budgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get budget by ID
router.get('/:id', auth, dbLimiter, async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create budget
router.post('/', [
  auth,
  dbLimiter,
  body('name').notEmpty().trim().escape(),
  body('targetAmount').isFloat({ min: 0 }),
  body('currentAmount').optional().isFloat({ min: 0 }),
  body('category').optional().trim().escape(),
  body('deadline').optional().isISO8601(),
  body('type').optional().isIn(['savings', 'budget'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const budget = new Budget({
      name: req.body.name,
      targetAmount: req.body.targetAmount,
      currentAmount: req.body.currentAmount,
      category: req.body.category,
      deadline: req.body.deadline,
      type: req.body.type,
      user: req.user._id
    });

    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update budget
router.put('/:id', [
  auth,
  dbLimiter,
  body('name').optional().trim().escape(),
  body('targetAmount').optional().isFloat({ min: 0 }),
  body('currentAmount').optional().isFloat({ min: 0 }),
  body('category').optional().trim().escape(),
  body('deadline').optional().isISO8601(),
  body('type').optional().isIn(['savings', 'budget'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Build update object with validated fields only
    const updateFields = {};
    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.targetAmount !== undefined) updateFields.targetAmount = req.body.targetAmount;
    if (req.body.currentAmount !== undefined) updateFields.currentAmount = req.body.currentAmount;
    if (req.body.category) updateFields.category = req.body.category;
    if (req.body.deadline) updateFields.deadline = req.body.deadline;
    if (req.body.type) updateFields.type = req.body.type;

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateFields,
      { new: true }
    );

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete budget
router.delete('/:id', auth, dbLimiter, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
