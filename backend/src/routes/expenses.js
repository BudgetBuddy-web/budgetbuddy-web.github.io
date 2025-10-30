const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');

// Get all expenses for user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id })
      .sort({ date: -1 });
    
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get expense by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create expense
router.post('/', [
  auth,
  body('type').isIn(['income', 'expense']),
  body('category').notEmpty().trim(),
  body('amount').isFloat({ min: 0 }),
  body('description').optional().trim(),
  body('date').optional().isISO8601()
], async (req, res) => {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const expense = new Expense({
      ...req.body,
      user: req.user._id
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update expense
router.put('/:id', [
  auth,
  body('type').optional().isIn(['income', 'expense']),
  body('category').optional().trim(),
  body('amount').optional().isFloat({ min: 0 }),
  body('description').optional().trim(),
  body('date').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get summary statistics
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });
    
    const summary = expenses.reduce((acc, expense) => {
      if (expense.type === 'income') {
        acc.totalIncome += expense.amount;
      } else {
        acc.totalExpenses += expense.amount;
      }
      return acc;
    }, { totalIncome: 0, totalExpenses: 0 });

    summary.balance = summary.totalIncome - summary.totalExpenses;

    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
