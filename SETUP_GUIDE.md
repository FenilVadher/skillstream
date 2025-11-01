# 🚀 Quick Setup Guide

## Step-by-Step Installation

### 1️⃣ Prerequisites Check

Ensure you have installed:
- ✅ Node.js (v16 or higher) - [Download](https://nodejs.org/)
- ✅ MySQL (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- ✅ Git - [Download](https://git-scm.com/)

Verify installations:
```bash
node --version
npm --version
mysql --version
```

### 2️⃣ Database Setup

**Option A: Using MySQL Command Line**
```bash
mysql -u root -p
```

Then execute:
```sql
CREATE DATABASE training_management_db;
SHOW DATABASES;
EXIT;
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Create new schema named `training_management_db`

### 3️⃣ Project Setup

```bash
# Navigate to project directory
cd HackX_DebugThugs

# Install root dependencies
npm install
```

### 4️⃣ Backend Configuration

```bash
# Navigate to backend
cd backend

# Install backend dependencies
npm install

# Create environment file
cp .env.example .env
```

**Edit backend/.env file:**
```env
PORT=5000
NODE_ENV=development

# Update these with your MySQL credentials
DB_HOST=localhost
DB_PORT=3306
DB_NAME=training_management_db
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD

# Generate a secure random string for JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=7d

UPLOAD_PATH=./uploads
MAX_FILE_SIZE=52428800

FRONTEND_URL=http://localhost:5173
```

### 5️⃣ Frontend Configuration

```bash
# Navigate to frontend (from project root)
cd frontend

# Install frontend dependencies
npm install
```

### 6️⃣ Start the Application

**Method 1: Run Both Servers Separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

**Method 2: Run Both from Root (Recommended)**

```bash
# From project root
npm run dev
```

### 7️⃣ Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

### 8️⃣ Create First Admin Account

**Option A: Through UI**
1. Go to http://localhost:5173/register
2. Fill in the form
3. Select "Admin" role
4. Click "Create Account"

**Option B: Using API (Postman/cURL)**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### 9️⃣ Create Test Trainee Account

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Trainee",
    "email": "trainee@example.com",
    "password": "trainee123",
    "role": "trainee"
  }'
```

## 🎯 Quick Start Workflow

### As Admin:
1. Login with admin credentials
2. Navigate to Courses → Create a new course
3. Add materials (videos/PDFs) to the course
4. Navigate to Quizzes → Create a quiz for the course
5. Add questions to the quiz
6. Navigate to Trainees → View all trainees
7. Assign courses to trainees
8. View dashboard analytics

### As Trainee:
1. Login with trainee credentials
2. View assigned courses on dashboard
3. Access course materials
4. Complete materials (progress tracked automatically)
5. Take quizzes
6. Earn points and badges
7. View AI recommendations
8. Check leaderboard position

## 🔧 Troubleshooting

### Database Connection Error
```
Error: Unable to connect to the database
```
**Solution:**
- Verify MySQL is running
- Check DB credentials in `.env`
- Ensure database `training_management_db` exists
- Test connection: `mysql -u root -p`

### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution:**
- Change PORT in backend/.env
- Or kill process using port: `lsof -ti:5000 | xargs kill`

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:**
- Ensure backend is running
- Check FRONTEND_URL in backend/.env matches your frontend URL
- Clear browser cache

### Upload Directory Error
```
Error: ENOENT: no such file or directory, open 'uploads/...'
```
**Solution:**
```bash
cd backend
mkdir -p uploads/courses uploads/materials uploads/avatars
```

## 📦 Production Build

### Backend
```bash
cd backend
NODE_ENV=production npm start
```

### Frontend
```bash
cd frontend
npm run build
# Deploy 'dist' folder to your hosting
```

## 🔐 Security Checklist for Production

- [ ] Change JWT_SECRET to a strong random string
- [ ] Update database credentials
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up rate limiting
- [ ] Enable database backups
- [ ] Use environment variables for secrets
- [ ] Update FRONTEND_URL to production domain

## 📊 Database Seeding (Optional)

To populate with sample data for testing:

```bash
cd backend
node scripts/seed.js  # If seed script exists
```

Or manually create:
- 5-10 courses
- 20-30 materials
- 10-15 quizzes with questions
- 5-10 trainee accounts

## 🎨 Customization

### Change Theme Colors
Edit `frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Change these values
        500: '#3b82f6',
        600: '#2563eb',
        // ...
      }
    }
  }
}
```

### Change App Name
- Update `frontend/index.html` title
- Update sidebar logo in `frontend/src/components/layout/Sidebar.jsx`

## 📱 Mobile Testing

The app is responsive. Test on:
- Chrome DevTools (F12 → Toggle Device Toolbar)
- Real mobile devices
- Different screen sizes

## 🆘 Getting Help

1. Check this guide
2. Review error logs in terminal
3. Check browser console (F12)
4. Verify all dependencies installed
5. Ensure MySQL is running
6. Check file permissions

## ✅ Verification Checklist

After setup, verify:
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] Database connection successful
- [ ] Can register new user
- [ ] Can login
- [ ] Dashboard loads
- [ ] No console errors
- [ ] File uploads work
- [ ] Dark mode toggle works

---

**Setup Complete! 🎉**

You're ready to use the AI Training Management System!
