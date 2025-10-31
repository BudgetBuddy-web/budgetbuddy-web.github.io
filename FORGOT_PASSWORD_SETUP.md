# Forgot Password Feature - Email Setup Guide

## Current Status
❌ **The forgot password feature is currently a DEMO/SIMULATION only**
- It shows a success message but doesn't actually send emails
- No real password reset emails are being sent

## Why Emails Aren't Sending
The current implementation is **frontend-only** for demonstration purposes. Real email sending requires:
1. Backend email service configuration
2. Email provider account (Gmail, SendGrid, Mailgun, etc.)
3. SMTP credentials or API keys
4. Database to store reset tokens

## To Enable Real Email Sending

### Option 1: Using Nodemailer with Gmail (Free)

**Backend Setup (server/controllers/auth.controller.js):**

```javascript
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your-email@gmail.com
    pass: process.env.EMAIL_PASSWORD // your-app-password
  }
});

// Forgot password endpoint
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour
    
    // Save token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();
    
    // Send email
    const resetUrl = `https://budgetbuddy-web.github.io/reset-password/${resetToken}`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'BudgetBuddy - Password Reset',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });
    
    res.json({ success: true, message: 'Reset email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email' });
  }
};
```

**Environment Variables (Render.com):**
- `EMAIL_USER`: your-email@gmail.com
- `EMAIL_PASSWORD`: Your Gmail App Password (not regular password!)

**How to Get Gmail App Password:**
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → App Passwords
4. Generate password for "Mail" app
5. Use that password (16 characters)

### Option 2: Using SendGrid (Professional, Free Tier Available)

**Install:**
```bash
npm install @sendgrid/mail
```

**Backend:**
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: email,
  from: 'noreply@budgetbuddy.com', // verified sender
  subject: 'Password Reset',
  html: resetEmailHtml
};

await sgMail.send(msg);
```

**Setup:**
1. Sign up at sendgrid.com (free tier: 100 emails/day)
2. Verify sender email
3. Get API key
4. Add to Render environment: `SENDGRID_API_KEY`

## Quick Demo Alternative
Since this is a demo project, you can:
1. Keep the current simulation (it's fine for portfolios)
2. Add a note in your README that email is simulated
3. In a real production app, implement one of the above solutions

## Current Implementation
The frontend shows a success message but no actual email is sent. This is intentional for demo purposes and doesn't require email provider credentials.

---

**Created by:** DAVID OLIVER J | URK23CS1305
**Date:** October 31, 2025
