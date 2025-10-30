/**
 * Seed Script
 * Add demo data to the database for testing
 */

const mongoose = require('mongoose');
const User = require('../models/User.model');
const Transaction = require('../models/Transaction.model');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create demo user
    const demoUser = await User.create({
      name: 'David Oliver',
      email: 'david@example.com',
      password: 'password123',
      savingsGoal: 5000,
      assistantPersonality: 'cheerful',
      theme: 'light'
    });
    console.log('👤 Created demo user');

    // Create demo transactions
    const demoTransactions = [
      {
        userId: demoUser._id,
        type: 'income',
        category: 'Salary',
        amount: 50000,
        date: new Date(2025, 9, 1),
        note: 'Monthly salary'
      },
      {
        userId: demoUser._id,
        type: 'expense',
        category: 'Food',
        amount: 250,
        date: new Date(2025, 9, 30),
        note: 'Lunch at Subway'
      },
      {
        userId: demoUser._id,
        type: 'expense',
        category: 'Travel',
        amount: 500,
        date: new Date(2025, 9, 28),
        note: 'Uber ride to office'
      },
      {
        userId: demoUser._id,
        type: 'expense',
        category: 'Entertainment',
        amount: 800,
        date: new Date(2025, 9, 25),
        note: 'Movie tickets and dinner'
      },
      {
        userId: demoUser._id,
        type: 'expense',
        category: 'Shopping',
        amount: 1200,
        date: new Date(2025, 9, 20),
        note: 'New headphones'
      },
      {
        userId: demoUser._id,
        type: 'income',
        category: 'Freelance',
        amount: 5000,
        date: new Date(2025, 9, 15),
        note: 'Website design project'
      },
      {
        userId: demoUser._id,
        type: 'expense',
        category: 'Utilities',
        amount: 1500,
        date: new Date(2025, 9, 10),
        note: 'Electricity bill'
      },
      {
        userId: demoUser._id,
        type: 'expense',
        category: 'Healthcare',
        amount: 600,
        date: new Date(2025, 9, 5),
        note: 'Medical checkup'
      }
    ];

    await Transaction.insertMany(demoTransactions);
    console.log('💸 Created demo transactions');

    console.log('\n✨ Seed data created successfully!');
    console.log('\n📝 Demo User Credentials:');
    console.log('Email: david@example.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
