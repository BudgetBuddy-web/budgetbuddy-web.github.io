const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/budgetbuddy';

// Sample data
const sampleExpenses = [
  { type: 'income', category: 'Salary', amount: 5000, description: 'Monthly salary', date: new Date('2024-01-01') },
  { type: 'expense', category: 'Groceries', amount: 450, description: 'Weekly shopping', date: new Date('2024-01-03') },
  { type: 'expense', category: 'Transportation', amount: 120, description: 'Gas', date: new Date('2024-01-05') },
  { type: 'expense', category: 'Entertainment', amount: 80, description: 'Movie tickets', date: new Date('2024-01-07') },
  { type: 'expense', category: 'Utilities', amount: 200, description: 'Electric bill', date: new Date('2024-01-10') },
  { type: 'income', category: 'Freelance', amount: 800, description: 'Project payment', date: new Date('2024-01-15') },
];

const sampleBudgets = [
  { name: 'Emergency Fund', targetAmount: 10000, currentAmount: 2500, type: 'savings', category: 'Savings' },
  { name: 'Vacation Fund', targetAmount: 3000, currentAmount: 500, type: 'savings', category: 'Travel' },
  { name: 'Monthly Food Budget', targetAmount: 600, currentAmount: 450, type: 'budget', category: 'Food' },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Expense.deleteMany({});
    await Budget.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create demo user
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@budgetbuddy.com',
      password: 'demo123' // Will be hashed by the User model
    });
    await demoUser.save();
    console.log('✓ Created demo user');
    console.log('  Email: demo@budgetbuddy.com');
    console.log('  Password: demo123');

    // Create expenses
    const expenses = sampleExpenses.map(exp => ({
      ...exp,
      user: demoUser._id
    }));
    await Expense.insertMany(expenses);
    console.log(`✓ Created ${expenses.length} sample expenses`);

    // Create budgets
    const budgets = sampleBudgets.map(budget => ({
      ...budget,
      user: demoUser._id
    }));
    await Budget.insertMany(budgets);
    console.log(`✓ Created ${budgets.length} sample budgets`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nYou can now login with:');
    console.log('  Email: demo@budgetbuddy.com');
    console.log('  Password: demo123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
