/**
 * Migration Script: Add role field to existing users
 * Run once to update database with role field
 * 
 * Usage: node utils/addRolesToUsers.js
 */

const mongoose = require('mongoose');
const User = require('../models/User.model');
require('dotenv').config();

const addRolesToUsers = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected successfully\n');

    // Count users before migration
    const totalUsersBefore = await User.countDocuments();
    console.log(`📊 Total users in database: ${totalUsersBefore}`);

    // Update all users without a role field to 'user'
    const result = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'user' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} users with 'user' role\n`);

    // Promote first user to admin (CHANGE THIS EMAIL!)
    const adminEmail = process.env.ADMIN_EMAIL || 'david@example.com'; // Changed to David Oliver's email
    
    console.log(`🔐 Attempting to promote user: ${adminEmail}`);
    const admin = await User.findOneAndUpdate(
      { email: adminEmail },
      { $set: { role: 'admin' } },
      { new: true }
    );

    if (admin) {
      console.log(`✅ Successfully promoted ${admin.email} to admin`);
      console.log(`   Name: ${admin.name}`);
      console.log(`   Role: ${admin.role}`);
    } else {
      console.log(`⚠️  WARNING: No user found with email ${adminEmail}`);
      console.log(`⚠️  Please update the ADMIN_EMAIL in .env file or modify this script`);
      console.log(`\n📝 Available users in database:`);
      
      const allUsers = await User.find({}).select('name email role');
      allUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
      });
    }

    // Display final statistics
    console.log(`\n📊 Final Statistics:`);
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userCount = await User.countDocuments({ role: 'user' });
    console.log(`   Total Users: ${totalUsersBefore}`);
    console.log(`   Admins: ${adminCount}`);
    console.log(`   Normal Users: ${userCount}`);

    console.log('\n✅ Migration completed successfully!');
    console.log('💡 You can now run the server and test role-based access.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
};

// Run migration
console.log('🚀 Starting User Role Migration...\n');
addRolesToUsers();
