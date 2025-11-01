# ⚙️ Environment Configuration Guide

## 🎯 Quick Setup

Your database is ready! Now configure the backend to connect to it.

## 📝 Step 1: Create Backend .env File

```bash
cd backend
cp .env.example .env
```

## ✏️ Step 2: Edit the .env File

Open `backend/.env` in your text editor and update these values:

### **For XAMPP/MAMP Users (No Password):**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=training_management_db
DB_USER=root
DB_PASSWORD=

# For MAMP, port might be different:
# DB_PORT=8889

# JWT Secret (IMPORTANT: Change this!)
JWT_SECRET=hackx_debugthugs_super_secret_key_2024_change_in_production
JWT_EXPIRE=7d

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=52428800

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### **For Standalone MySQL (With Password):**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=training_management_db
DB_USER=root
DB_PASSWORD=your_actual_mysql_password

# JWT Secret (IMPORTANT: Change this!)
JWT_SECRET=hackx_debugthugs_super_secret_key_2024_change_in_production
JWT_EXPIRE=7d

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=52428800

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

## 🔐 Important Notes

### Database Password:
- **XAMPP/MAMP:** Usually no password (leave empty: `DB_PASSWORD=`)
- **Standalone MySQL:** Use your MySQL root password
- **MAMP Pro:** Default password is often `root`

### Database Port:
- **Standard MySQL:** `3306`
- **MAMP:** Often `8889` (check MAMP preferences)
- **XAMPP:** Usually `3306`

### JWT Secret:
- **Development:** Use the provided secret
- **Production:** Generate a strong random string (min 32 characters)
- Never commit this to git!

## 🚀 Step 3: Create Upload Directories

```bash
# From backend directory
mkdir -p uploads/courses uploads/materials uploads/avatars
```

## ✅ Step 4: Verify Configuration

Test if backend can connect to database:

```bash
cd backend
npm run dev
```

### Expected Success Output:
```
✅ Database connection established successfully.
✅ Database synchronized
✅ Default badges initialized
🚀 Server running on port 5000 in development mode
```

### If You See Errors:

#### Error: "Access denied for user 'root'"
**Solution:** Wrong password in `.env`
- Check your MySQL password
- For XAMPP/MAMP, try leaving password empty
- For MAMP, try password: `root`

#### Error: "Unknown database 'training_management_db'"
**Solution:** Database not created
- Go back to database setup
- Run the SQL scripts in phpMyAdmin

#### Error: "connect ECONNREFUSED"
**Solution:** MySQL not running
- Start XAMPP/MAMP
- Or start MySQL service: `brew services start mysql`

#### Error: "Port 5000 already in use"
**Solution:** Kill the process or change port
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill

# Or change PORT in .env to 5001
```

## 📋 Complete .env Template

Copy this entire block to `backend/.env` and adjust as needed:

```env
# ============================================
# AI Training Management System - Backend Configuration
# ============================================

# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
# Update these with your actual MySQL credentials
DB_HOST=localhost
DB_PORT=3306
DB_NAME=training_management_db
DB_USER=root
DB_PASSWORD=

# For MAMP users, uncomment and use:
# DB_PORT=8889
# DB_PASSWORD=root

# JWT Configuration
# IMPORTANT: Change JWT_SECRET in production!
JWT_SECRET=hackx_debugthugs_super_secret_jwt_key_2024_change_in_production
JWT_EXPIRE=7d

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=52428800

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# ============================================
# Notes:
# - Never commit this file to git
# - Change JWT_SECRET before deploying to production
# - Adjust DB_PASSWORD based on your MySQL setup
# - For MAMP, check port in MAMP preferences
# ============================================
```

## 🎯 Quick Commands

```bash
# Navigate to backend
cd backend

# Create .env from example
cp .env.example .env

# Edit .env (use your preferred editor)
nano .env
# or
code .env
# or
open .env

# Create upload directories
mkdir -p uploads/courses uploads/materials uploads/avatars

# Install dependencies (if not done)
npm install

# Start backend server
npm run dev
```

## ✅ Checklist

- [ ] Created `backend/.env` file
- [ ] Updated `DB_PASSWORD` (empty for XAMPP/MAMP, or your password)
- [ ] Updated `DB_PORT` (3306 or 8889 for MAMP)
- [ ] Changed `JWT_SECRET` to something unique
- [ ] Created upload directories
- [ ] Backend starts without errors
- [ ] See "Database connection established" message

## 🎉 Next Steps

Once backend is running successfully:

1. Open new terminal
2. Navigate to frontend: `cd frontend`
3. Install dependencies: `npm install`
4. Start frontend: `npm run dev`
5. Access application: http://localhost:5173

---

**Configuration Complete! 🚀**
