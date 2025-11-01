# 🚀 START HERE - Quick Setup Commands

Your database is ready! Follow these simple steps:

## ⚡ Option 1: Automated Setup (Easiest)

```bash
# Run the setup script
./setup-env.sh
```

This will:
- ✅ Create `backend/.env` file
- ✅ Ask for your MySQL password
- ✅ Ask for MySQL port
- ✅ Create upload directories
- ✅ Configure everything automatically

---

## ⚡ Option 2: Manual Setup (3 Commands)

### Step 1: Create .env file
```bash
cd backend
cp .env.example .env
```

### Step 2: Edit .env file
```bash
# Open in your editor
nano .env
# or
code .env
# or
open .env
```

**Update these lines:**
```env
DB_PASSWORD=           # Leave empty for XAMPP/MAMP, or enter your MySQL password
DB_PORT=3306          # Use 8889 if using MAMP
```

### Step 3: Create upload directories
```bash
mkdir -p uploads/courses uploads/materials uploads/avatars
```

---

## 🎯 Configuration Values

### For XAMPP/MAMP Users:
```env
DB_HOST=localhost
DB_PORT=3306          # or 8889 for MAMP
DB_NAME=training_management_db
DB_USER=root
DB_PASSWORD=          # Leave EMPTY (no password)
```

### For Standalone MySQL:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=training_management_db
DB_USER=root
DB_PASSWORD=your_mysql_password
```

---

## 🚀 Start the Application

### Terminal 1 - Backend:
```bash
cd backend
npm install          # First time only
npm run dev
```

**Wait for:**
```
✅ Database connection established successfully.
✅ Database synchronized
🚀 Server running on port 5000
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm install          # First time only
npm run dev
```

**Wait for:**
```
➜  Local:   http://localhost:5173/
```

---

## 🌐 Access Application

Open browser: **http://localhost:5173**

### Create First User:
1. Click "Sign up"
2. Fill in details
3. Select role: **Admin** or **Trainee**
4. Click "Create Account"

---

## ✅ Quick Checklist

- [ ] Database created (training_management_db) ✅ DONE
- [ ] Backend .env configured
- [ ] Upload directories created
- [ ] Backend dependencies installed
- [ ] Backend server running
- [ ] Frontend dependencies installed
- [ ] Frontend server running
- [ ] Can access http://localhost:5173
- [ ] Can register new user

---

## 🆘 Troubleshooting

### Backend won't connect to database:
```bash
# Check MySQL is running (start XAMPP/MAMP)
# Verify password in backend/.env
# Try empty password for XAMPP/MAMP
```

### Port already in use:
```bash
# Kill process
lsof -ti:5000 | xargs kill    # Backend
lsof -ti:5173 | xargs kill    # Frontend
```

### Module not found:
```bash
cd backend && npm install
cd frontend && npm install
```

---

## 📚 Full Documentation

- **CONFIGURE_ENV.md** - Detailed environment setup
- **DATABASE_SETUP.md** - Database setup guide
- **README.md** - Complete project documentation
- **SETUP_GUIDE.md** - Full installation guide

---

**Ready to start? Run: `./setup-env.sh`** 🚀
