# 🚀 HOW TO RUN - BudgetBuddy

## ✅ Current Status: RUNNING!

Your BudgetBuddy application is now running with:
- ✅ **Backend Server**: http://localhost:5000
- ✅ **Frontend App**: http://localhost:3000 (starting...)
- ✅ **MongoDB**: Running and connected
- ✅ **Demo Data**: Loaded successfully

---

## 🔑 Login Credentials

**Demo Account:**
- **Email**: david@example.com
- **Password**: password123

---

## 🌐 Access the Application

### Option 1: Open in Browser
```bash
# The app will open automatically when React finishes starting
# Or manually open: http://localhost:3000
```

### Option 2: Use VS Code Simple Browser
- The frontend should be accessible at http://localhost:3000
- The backend API is at http://localhost:5000/api

---

## 📋 What's Running Now

### Terminal 1: Backend Server
```
Port: 5000
Status: ✅ Running
MongoDB: ✅ Connected
```

### Terminal 2: React Frontend  
```
Port: 3000
Status: ⏳ Starting (compiling React app)
```

---

## 🎯 Quick Actions

### Stop the Servers
Press `Ctrl+C` in each terminal, or:
```bash
# Kill backend
pkill -f "node server.js"

# Kill frontend
pkill -f "react-scripts"
```

### Restart Backend
```bash
cd /home/david/HTML/BudgetBuddy/server
node server.js
```

### Restart Frontend
```bash
cd /home/david/HTML/BudgetBuddy/client
npm start
```

### View Backend Logs
Check the terminal running the backend server

### View Frontend Logs
Check the terminal running npm start

---

## 🎮 Using the Application

### 1. Login Page (http://localhost:3000/login)
- Use demo credentials above
- Or register a new account
- Or use Google Sign-In (requires OAuth setup)

### 2. Dashboard
- View your financial overview
- See charts and statistics
- Watch the anime assistant react!

### 3. Add Transactions
- Click "Add Transaction" button
- Fill in details (type, category, amount, date)
- Watch the assistant celebrate or react!

### 4. View Reports
- See monthly/yearly summaries
- Export data as PDF or CSV
- Analyze spending by category

### 5. Update Settings
- Change your profile
- Adjust budget goals
- Customize assistant personality
- Switch themes

---

## 🎭 Anime Assistant Features

The assistant will:
- 🙈 **Cover eyes** when you type passwords
- 😱 **Show shock** when you add large expenses (>₹1000)
- 🎉 **Celebrate** when you're under budget
- 😢 **Show concern** when you overspend
- 💭 **Think** while processing data

---

## 🔧 Troubleshooting

### Frontend Won't Start
```bash
cd /home/david/HTML/BudgetBuddy/client
rm -rf node_modules package-lock.json
npm install
npm start
```

### Backend Won't Start
```bash
# Check if MongoDB is running
pgrep mongod

# If not running, start it
mongod --dbpath ~/data/db
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
sudo systemctl start mongod

# Or start manually
mongod --dbpath ~/data/db
```

---

## 📊 API Endpoints (for testing)

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Get Transactions (requires auth)
```bash
curl http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎨 Features to Explore

1. ✅ **Add Income** → Watch assistant celebrate
2. ✅ **Add Large Expense** → See shock reaction
3. ✅ **View Dashboard** → Beautiful charts
4. ✅ **Export Reports** → Download PDF/CSV
5. ✅ **Change Theme** → Try dark mode
6. ✅ **Set Budget** → Track spending goals

---

## 📱 Next Steps

### For Development
1. Edit files in `client/src/` for frontend changes
2. Edit files in `server/` for backend changes
3. Changes auto-reload (React has hot-reload)

### For Production
1. Build frontend: `cd client && npm run build`
2. Deploy backend to Heroku/Railway
3. Deploy frontend to Netlify/Vercel
4. Use MongoDB Atlas for database

---

## 🆘 Need Help?

- Check `SETUP.md` for detailed setup instructions
- Check `README.md` for feature overview
- Check `FILE_STRUCTURE.md` for code organization
- Check `PROJECT_SUMMARY.md` for complete details

---

## 🎉 Enjoy BudgetBuddy!

Your personal finance tracker with a cute anime assistant is ready to help you manage your money! 💰✨

**Have fun exploring all the features!**
