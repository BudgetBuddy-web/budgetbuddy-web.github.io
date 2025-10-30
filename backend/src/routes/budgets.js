const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Budget = require('../models/Budget');

// Get all budgets for user
router.get('/', auth, async (req, res) => {
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
router.get('/:id', auth, async (req, res) => {
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
  body('name').notEmpty().trim(),
  body('targetAmount').isFloat({ min: 0 }),
  body('currentAmount').optional().isFloat({ min: 0 }),
  body('category').optional().trim(),
  body('deadline').optional().isISO8601(),
  body('type').optional().isIn(['savings', 'budget'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const budget = new Budget({
      ...req.body,
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
  body('name').optional().trim(),
  body('targetAmount').optional().isFloat({ min: 0 }),
  body('currentAmount').optional().isFloat({ min: 0 }),
  body('category').optional().trim(),
  body('deadline').optional().isISO8601(),
  body('type').optional().isIn(['savings', 'budget'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
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
router.delete('/:id', auth, async (req, res) => {
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
