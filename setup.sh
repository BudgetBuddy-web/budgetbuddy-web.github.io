#!/bin/bash

echo "🎉 Welcome to BudgetBuddy Setup! 💰"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"

# Check if MongoDB is running (optional)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed locally."
    echo "   You can either:"
    echo "   1. Install MongoDB locally"
    echo "   2. Use MongoDB Atlas (cloud)"
    echo "   3. Use Docker: docker-compose up -d mongodb"
    echo ""
fi

# Setup Backend
echo "📦 Setting up Backend..."
cd backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ Created .env file (please configure it)"
else
    echo "✓ .env file already exists"
fi

echo "📦 Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd frontend

echo "📦 Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "🎊 Setup Complete! 🎊"
echo "===================="
echo ""
echo "Next steps:"
echo "1. Configure backend/.env with your MongoDB URI"
echo "2. Start MongoDB (if running locally)"
echo "3. Run 'npm run dev' in backend directory"
echo "4. Run 'npm run dev' in frontend directory"
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "Or use Docker:"
echo "  docker-compose up"
echo ""
echo "Happy budgeting with Akari! 🌸"
