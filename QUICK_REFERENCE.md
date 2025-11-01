# ⚡ Quick Reference Guide

## 🚀 Quick Start Commands

### First Time Setup
```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Setup database
mysql -u root -p
CREATE DATABASE training_management_db;
EXIT;

# 3. Configure backend
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials

# 4. Start servers
cd backend && npm run dev          # Terminal 1
cd frontend && npm run dev         # Terminal 2
```

### Daily Development
```bash
# Start both servers from root
npm run dev

# Or separately
cd backend && npm run dev
cd frontend && npm run dev
```

## 🔑 Default Ports

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **API:** http://localhost:5000/api

## 👤 Test Accounts

Create via registration UI or API:

```bash
# Admin Account
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@test.com","password":"admin123","role":"admin"}'

# Trainee Account
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Trainee","email":"trainee@test.com","password":"trainee123","role":"trainee"}'
```

## 📋 Common Tasks

### As Admin

**1. Create a Course**
- Login → Courses → Create Course
- Fill: Title, Description, Category, Technology, Difficulty
- Upload thumbnail (optional)
- Submit

**2. Add Materials**
- Go to Course Details
- Click "Add Material"
- Upload video/PDF
- Set title and order
- Submit

**3. Create Quiz**
- Quizzes → Create Quiz
- Select course
- Add questions with 4 options each
- Mark correct answer
- Set passing score
- Submit

**4. Assign Course**
- Courses → Select Course → Assign
- Select trainees
- Set due date (optional)
- Submit

**5. Generate Report**
- Trainees → Select Trainee → Generate Report
- Or Dashboard → Export Bulk Report

### As Trainee

**1. Access Course**
- Dashboard → My Courses
- Click on assigned course
- View materials

**2. Complete Material**
- Open material
- Progress tracked automatically
- Mark as complete

**3. Take Quiz**
- Quizzes → Available Quizzes
- Click "Start Quiz"
- Answer questions
- Submit
- View results instantly

**4. Check Progress**
- Dashboard → View stats
- Progress → Detailed view
- Track completion percentage

**5. View Recommendations**
- Dashboard → AI Recommendations
- Or Recommendations page
- Accept recommended courses

## 🎮 Gamification Quick Guide

### Earning Points
- Complete course: **100 pts**
- Pass quiz: **50 pts**
- Perfect score: **100 pts**
- Complete material: **10 pts**
- Daily login: **5 pts**

### Rank Progression
```
Beginner (0) → Learner (100) → Explorer (300) → 
Achiever (600) → Expert (1000) → Master (2000) → Legend (5000)
```

### Earning Badges
- Complete 1 course → First Steps
- Complete 5 courses → Learning Enthusiast
- Pass 10 quizzes → Quiz Master
- Earn 1000 points → Point Collector
- 7-day streak → Dedicated Learner
- Earn 5000 points → Legend

## 🛠️ Troubleshooting

### Database Connection Failed
```bash
# Check MySQL is running
mysql -u root -p

# Verify database exists
SHOW DATABASES;

# Check .env credentials match
cat backend/.env
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill

# Or change port in backend/.env
PORT=5001
```

### Module Not Found
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
```

### CORS Error
```bash
# Ensure backend is running
# Check FRONTEND_URL in backend/.env
FRONTEND_URL=http://localhost:5173
```

### Upload Error
```bash
# Create upload directories
cd backend
mkdir -p uploads/courses uploads/materials uploads/avatars
```

## 📊 API Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'
```

### Get Courses (with token)
```bash
curl http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Course
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"React Basics","description":"Learn React","category":"Web Development","difficulty":"beginner"}'
```

### Get Leaderboard
```bash
curl http://localhost:5000/api/gamification/leaderboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🎨 Customization

### Change Primary Color
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#your-color',
    600: '#your-darker-color',
  }
}
```

### Change App Name
1. `frontend/index.html` - Update `<title>`
2. `frontend/src/components/layout/Sidebar.jsx` - Update logo text

### Add New Badge
```bash
curl -X POST http://localhost:5000/api/gamification/badges \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Speed Learner",
    "description":"Complete 3 courses in a week",
    "icon":"⚡",
    "criteria":{"type":"courses_completed","value":3},
    "points":150,
    "rarity":"rare"
  }'
```

## 📁 Important File Locations

### Configuration
- Backend env: `backend/.env`
- Frontend env: `frontend/.env` (optional)
- Tailwind config: `frontend/tailwind.config.js`
- Vite config: `frontend/vite.config.js`

### Key Files
- Backend entry: `backend/server.js`
- Frontend entry: `frontend/src/main.jsx`
- App routes: `frontend/src/App.jsx`
- Database config: `backend/config/database.js`

### Models
- All models: `backend/models/`
- Model index: `backend/models/index.js`

### Controllers
- All controllers: `backend/controllers/`
- Auth: `backend/controllers/authController.js`
- Courses: `backend/controllers/courseController.js`

### Frontend Pages
- Admin: `frontend/src/pages/admin/`
- Trainee: `frontend/src/pages/trainee/`
- Shared: `frontend/src/pages/`

## 🔍 Useful Commands

### Database
```bash
# Access MySQL
mysql -u root -p

# Show all tables
USE training_management_db;
SHOW TABLES;

# View users
SELECT * FROM users;

# View gamification
SELECT * FROM gamification;
```

### Development
```bash
# Check backend logs
cd backend && npm run dev

# Build frontend for production
cd frontend && npm run build

# Preview production build
cd frontend && npm run preview
```

### Cleanup
```bash
# Clear uploads
rm -rf backend/uploads/*

# Reset database (careful!)
mysql -u root -p
DROP DATABASE training_management_db;
CREATE DATABASE training_management_db;
```

## 📈 Monitoring

### Check Server Status
```bash
# Health check
curl http://localhost:5000/api/health

# Should return:
# {"success":true,"message":"Server is running","timestamp":"..."}
```

### View Logs
- Backend logs appear in terminal running `npm run dev`
- Frontend logs in browser console (F12)

## 🎯 Quick Tips

1. **Always start backend before frontend**
2. **Keep both terminals open during development**
3. **Check browser console for frontend errors**
4. **Check terminal for backend errors**
5. **Use dark mode toggle in header**
6. **Logout/login to refresh token**
7. **Clear browser cache if issues persist**
8. **Check .env files are configured correctly**
9. **Ensure MySQL is running**
10. **Use recommended Node.js version (16+)**

## 📞 Getting Help

1. Check error message in terminal/console
2. Review SETUP_GUIDE.md
3. Check troubleshooting section above
4. Verify all dependencies installed
5. Ensure database is running
6. Check file permissions

## ✅ Pre-Launch Checklist

- [ ] MySQL running
- [ ] Database created
- [ ] Backend .env configured
- [ ] Dependencies installed (backend)
- [ ] Dependencies installed (frontend)
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Can access http://localhost:5173
- [ ] Can register new user
- [ ] Can login
- [ ] Dashboard loads
- [ ] No console errors

---

**Quick Reference Complete! 🚀**

For detailed information, see README.md and SETUP_GUIDE.md
