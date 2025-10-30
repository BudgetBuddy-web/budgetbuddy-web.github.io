# 🎯 BudgetBuddy - Quick Reference

## 🚀 Quick Start Commands

### First Time Setup
```bash
# Make start script executable
chmod +x start.sh

# Run quick start (installs deps and sets up)
./start.sh
```

### Start Backend (Terminal 1)
```bash
cd server
npm start
```

### Start Frontend (Terminal 2)
```bash
cd client
npm start
```

### Seed Demo Data
```bash
cd server
node utils/seed.js
```

## 🔑 Demo Credentials
- **Email:** david@example.com
- **Password:** password123

## 📁 Key Files

### Backend
- `server/server.js` - Main server file
- `server/models/` - Database schemas
- `server/controllers/` - Business logic
- `server/routes/` - API endpoints

### Frontend
- `client/src/App.js` - Main React app
- `client/src/pages/` - Page components
- `client/src/components/AnimeAssistant.js` - Anime character
- `client/src/contexts/` - State management

## 🎭 Assistant Moods
- `happy` - Default, cheerful
- `excited` - Celebrating success
- `sad` - Over budget warning
- `shocked` - Large expense
- `thinking` - Processing data
- `shy` - Covering eyes during password entry

## 📊 Transaction Categories
Income: Salary, Freelance, Investment
Expense: Food, Travel, Entertainment, Shopping, Healthcare, Education, Utilities, Rent, Other

## 🌐 URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health

## 🛠️ Useful Commands

### Backend
```bash
npm start          # Start server
npm run dev        # Start with nodemon
node utils/seed.js # Seed demo data
```

### Frontend
```bash
npm start          # Start dev server
npm run build      # Build for production
npm test           # Run tests
```

## 📱 Features Checklist
- ✅ Authentication (Email + Google OAuth)
- ✅ Transaction Management (CRUD)
- ✅ Dashboard with Charts
- ✅ Budget Tracking
- ✅ Financial Reports
- ✅ Export CSV/PDF
- ✅ Anime Assistant with Animations
- ✅ Settings & Personalization
- ✅ Responsive Design

## 🎨 Customization

### Change Assistant Personality
Go to Settings → Assistant Personality → Choose from:
- Cheerful
- Calm  
- Strict

### Change Theme
Go to Settings → Theme → Choose from:
- Light
- Dark
- Auto

### Update Budget Goal
Go to Settings → Budget Goal → Set amount

## 🐛 Common Issues

**MongoDB not connecting?**
- Start MongoDB: `mongod`
- Check MONGODB_URI in server/.env

**Google OAuth not working?**
- Add credentials to both .env files
- Check redirect URIs in Google Console

**Port already in use?**
```bash
# Kill process on port
lsof -ti:5000 | xargs kill -9
```

## 📚 Tech Stack
- **Frontend:** React, Chart.js, Anime.js
- **Backend:** Node.js, Express, MongoDB
- **Auth:** JWT, bcrypt, Google OAuth

---
Happy Budgeting! 💰✨
