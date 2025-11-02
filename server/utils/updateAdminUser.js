/**
 * Update Admin User Script
 * Sets davidoliv0326@gmail.com as admin with specific password
 */

const mongoose = require('mongoose');
const User = require('../models/User.model');
require('dotenv').config();

const updateAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const adminEmail = 'davidoliv0326@gmail.com';
    const adminPassword = '26032006david';

    // Find user
    let user = await User.findOne({ email: adminEmail });

    if (user) {
      // Update existing user
      user.role = 'admin';
      user.password = adminPassword; // Will be hashed by pre-save hook
      await user.save();
      console.log(`✅ Updated existing user to admin: ${adminEmail}`);
    } else {
      // Create new admin user
      user = await User.create({
        name: 'David Oliver',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log(`✅ Created new admin user: ${adminEmail}`);
    }

    console.log('\n📊 Admin User Details:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Password: 26032006david`);

    // Show all users
    const allUsers = await User.find({});
    console.log(`\n📊 Total Users: ${allUsers.length}`);
    console.log(`   Admins: ${allUsers.filter(u => u.role === 'admin').length}`);
    console.log(`   Normal Users: ${allUsers.filter(u => u.role === 'user').length}`);

    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateAdminUser();
