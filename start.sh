#!/bin/bash

# BudgetBuddy Quick Start Script
# This script will help you set up and run the application

echo "🎯 BudgetBuddy - Quick Start Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   Run: mongod"
    echo ""
    read -p "Press Enter when MongoDB is running..."
fi

echo "📦 Installing dependencies..."
echo ""

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created server/.env file"
    echo "⚠️  Please edit server/.env with your configurations"
fi
cd ..

# Install client dependencies
echo "Installing client dependencies..."
cd client
npm install
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created client/.env file"
    echo "⚠️  Please edit client/.env with your Google Client ID"
fi
cd ..

echo ""
echo "✅ Installation complete!"
echo ""

# Ask if user wants to seed demo data
read -p "Do you want to seed demo data? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding demo data..."
    cd server
    node utils/seed.js
    cd ..
fi

echo ""
echo "🚀 Starting the application..."
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the servers"
echo ""

# Start both servers using a process manager or in separate terminals
# For simplicity, we'll show the commands
echo "To start the servers, run these commands in separate terminals:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd server && npm start"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd client && npm start"
echo ""

# Optional: If you have 'concurrently' installed, you can run both at once
# npm install -g concurrently
# concurrently "cd server && npm start" "cd client && npm start"
