# BudgetBuddy 💰

A production-ready full-stack MERN (MongoDB, Express, React, Node.js) personal finance management application featuring an interactive anime assistant named **Akari**. BudgetBuddy makes budgeting engaging, visual, and emotionally rewarding by helping users track expenses, monitor savings goals, and make informed financial decisions with real-time feedback and motivation.

## ✨ Features

### Core Functionality
- **User Authentication**: Secure registration and login with JWT tokens
- **Expense Tracking**: Record and categorize income and expenses
- **Budget Management**: Set budgets and track spending limits
- **Savings Goals**: Create and monitor savings objectives with progress tracking
- **Real-time Statistics**: View total income, expenses, and current balance
- **Visual Analytics**: Interactive charts showing expense breakdowns by category

### Akari - Your AI Finance Assistant 🌟
- Interactive anime-style character that provides:
  - Personalized financial feedback
  - Motivational messages
  - Spending alerts and insights
  - Goal achievement celebrations
- Context-aware responses based on your financial activity
- Animated character with friendly expressions

## 🛠 Tech Stack

### Backend
- **Node.js** & **Express.js** - Server and API
- **MongoDB** & **Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcryptjs** - Password encryption
- **express-validator** - Input validation

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Canvas API** - Akari character animation

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your settings
# Set MONGODB_URI to your MongoDB connection string
# Set JWT_SECRET to a secure random string

# Start the server
npm run dev
```

The backend server will start on `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🚀 Usage

1. **Register an Account**: Create a new account with your name, email, and password
2. **Add Transactions**: Record your income and expenses with categories
3. **Set Goals**: Create budgets or savings goals to track your progress
4. **Monitor Dashboard**: View your financial statistics and visualizations
5. **Interact with Akari**: Your AI assistant will provide feedback and motivation

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/stats/summary` - Get summary statistics

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

## 🎨 Screenshots

*Screenshots will be available after running the application*

## 🔒 Security

- Passwords are hashed using bcryptjs
- JWT tokens for secure authentication
- Input validation on all endpoints
- Protected routes requiring authentication
- CORS enabled for cross-origin requests

## 🌟 Akari's Personality

Akari is your friendly finance companion who:
- Celebrates your financial wins
- Gently reminds you about spending habits
- Encourages you to save
- Makes budgeting feel less intimidating
- Provides contextual advice based on your activity

## 🤝 Contributing

This is a personal finance application. Feel free to fork and customize for your needs!

## 📝 License

MIT License - feel free to use this project for personal or educational purposes.

## 🎯 Future Enhancements

- [ ] Monthly spending reports
- [ ] Budget recommendations using AI
- [ ] Bill reminders and notifications
- [ ] Multi-currency support
- [ ] Export data to CSV/PDF
- [ ] Mobile responsive design improvements
- [ ] Advanced Live2D character animations
- [ ] Integration with bank APIs

## 👨‍💻 Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## 💡 Tips

- Start by adding a few transactions to see Akari come to life!
- Set realistic budgets to get helpful insights
- Check your dashboard regularly to stay on track
- Categorize expenses consistently for better analytics

---

Made with ❤️ and powered by Akari 🌸
