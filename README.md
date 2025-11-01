# 🎓 AI-Powered Training Management and Evaluation System

A comprehensive full-stack Learning Management System (LMS) with gamification, AI-powered analytics, and personalized recommendations.

## ✨ Features

### 👨‍💼 Admin Features
- **Dashboard Analytics** - Real-time overview of trainees, courses, and performance metrics
- **Course Management** - Create, edit, and organize courses with video/PDF materials
- **Quiz Creation** - Build MCQ-based assessments with automatic grading
- **Trainee Management** - Monitor progress, assign courses, and manage users
- **Leaderboard** - View top performers and engagement metrics
- **Report Generation** - Export PDF/Excel reports for individual or bulk trainees
- **AI Analytics** - Identify struggling topics and performance trends

### 👨‍🎓 Trainee Features
- **Personalized Dashboard** - Track progress, points, and achievements
- **Course Access** - View assigned courses and learning materials
- **Progress Tracking** - Monitor completion status and time spent
- **Quiz Attempts** - Take assessments and view instant results
- **Gamification** - Earn points, badges, and climb the leaderboard
- **AI Recommendations** - Get personalized course suggestions based on performance
- **Performance Analytics** - Identify weak areas and improvement opportunities

### 🎮 Gamification Engine
- **Points System** - Earn points for completing courses, passing quizzes, and daily logins
- **Badges & Achievements** - Unlock special badges based on milestones
- **Leaderboard** - Real-time rankings with levels and ranks
- **Streak Tracking** - Maintain learning streaks for bonus points
- **Rank Progression** - Advance from Beginner to Legend

### 🤖 AI-Powered Features
- **Performance Analysis** - Analyze quiz results to identify weak topics
- **Smart Recommendations** - Suggest courses based on learning patterns
- **Engagement Analytics** - Track activity and completion rates
- **Predictive Insights** - Identify at-risk trainees early

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - RESTful API server
- **MySQL** - Relational database
- **Sequelize ORM** - Database modeling and migrations
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **PDFKit** - PDF report generation
- **ExcelJS** - Excel report generation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications

## 📋 Prerequisites

- **Node.js** >= 16.x
- **MySQL** >= 8.0
- **npm** or **yarn**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd HackX_DebugThugs
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE training_management_db;
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Update DB credentials and JWT secret
```

**Backend .env Configuration:**

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=training_management_db
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

UPLOAD_PATH=./uploads
MAX_FILE_SIZE=52428800

FRONTEND_URL=http://localhost:5173
```

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file (optional)
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

### 6. Create Initial Admin Account

You can register through the UI or create directly via API:

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

## 📁 Project Structure

```
HackX_DebugThugs/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/             # Request handlers
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── quizController.js
│   │   ├── progressController.js
│   │   ├── gamificationController.js
│   │   ├── analyticsController.js
│   │   └── adminController.js
│   ├── middleware/              # Custom middleware
│   │   ├── auth.js
│   │   ├── upload.js
│   │   └── errorHandler.js
│   ├── models/                  # Sequelize models
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Material.js
│   │   ├── Quiz.js
│   │   ├── Question.js
│   │   ├── QuizAttempt.js
│   │   ├── Progress.js
│   │   ├── Gamification.js
│   │   ├── Badge.js
│   │   └── Recommendation.js
│   ├── routes/                  # API routes
│   ├── utils/                   # Utility functions
│   │   ├── gamificationEngine.js
│   │   ├── aiEngine.js
│   │   └── reportGenerator.js
│   ├── uploads/                 # File uploads
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # Reusable UI components
│   │   │   └── layout/         # Layout components
│   │   ├── pages/
│   │   │   ├── admin/          # Admin pages
│   │   │   ├── trainee/        # Trainee pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Leaderboard.jsx
│   │   ├── services/           # API service layer
│   │   ├── store/              # Zustand stores
│   │   ├── utils/              # Utility functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── package.json                # Root package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (Admin)
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course (Admin)
- `DELETE /api/courses/:id` - Delete course (Admin)
- `POST /api/courses/:id/materials` - Add material (Admin)
- `POST /api/courses/:id/assign` - Assign course (Admin)

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `POST /api/quizzes` - Create quiz (Admin)
- `GET /api/quizzes/:id` - Get quiz details
- `POST /api/quizzes/:id/submit` - Submit quiz (Trainee)
- `GET /api/quizzes/my-attempts` - Get my attempts (Trainee)

### Progress
- `GET /api/progress` - Get my progress (Trainee)
- `PUT /api/progress/material/:id` - Update progress (Trainee)
- `GET /api/progress/course/:id` - Get course progress (Trainee)
- `GET /api/progress/all` - Get all progress (Admin)

### Gamification
- `GET /api/gamification/leaderboard` - Get leaderboard
- `GET /api/gamification/me` - Get my stats (Trainee)
- `GET /api/gamification/badges` - Get all badges
- `POST /api/gamification/award-points` - Award points (Admin)

### Analytics
- `GET /api/analytics/performance` - Get performance analysis (Trainee)
- `GET /api/analytics/recommendations` - Get AI recommendations (Trainee)
- `GET /api/analytics/engagement` - Get engagement analytics (Trainee)
- `GET /api/analytics/trainee/:id` - Get trainee analytics (Admin)

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/trainees` - Get all trainees
- `GET /api/admin/reports/trainee/:id` - Generate trainee report (PDF)
- `GET /api/admin/reports/bulk` - Generate bulk report (Excel)

## 🎨 UI Features

### Design System
- **Color Palette:** Blue primary with gradient accents
- **Typography:** Inter font family
- **Dark Mode:** Full dark mode support with smooth transitions
- **Responsive:** Mobile-first design, works on all devices
- **Animations:** Smooth transitions and loading states

### Components
- Reusable UI components (Button, Card, Input, Badge, Modal, etc.)
- Dashboard layouts with sidebar navigation
- Data visualization with charts
- Progress bars and statistics cards
- Leaderboard with podium display

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Request rate limiting
- Helmet.js security headers
- CORS configuration
- Input validation
- SQL injection prevention (Sequelize ORM)

## 📊 Database Schema

### Main Tables
- **users** - User accounts (admin/trainee)
- **courses** - Course information
- **materials** - Course materials (videos/PDFs)
- **course_assignments** - Course-trainee assignments
- **quizzes** - Quiz definitions
- **questions** - Quiz questions
- **quiz_attempts** - Quiz submission records
- **progress** - Material completion tracking
- **gamification** - Points, badges, ranks
- **badges** - Badge definitions
- **recommendations** - AI-generated recommendations

## 🎯 Gamification Rules

### Points
- Course completion: 100 points
- Quiz pass: 50 points
- Perfect quiz score: 100 points
- Material completion: 10 points
- Daily login: 5 points

### Ranks (by points)
- Beginner: 0+
- Learner: 100+
- Explorer: 300+
- Achiever: 600+
- Expert: 1000+
- Master: 2000+
- Legend: 5000+

### Levels
- Every 200 points = 1 level

## 🤖 AI Features

### Performance Analysis
- Analyzes quiz attempts by category and technology
- Identifies weak areas (< 70% accuracy)
- Identifies strong areas (>= 85% accuracy)
- Calculates average scores and trends

### Recommendation Engine
- Suggests courses based on weak areas
- Considers difficulty progression
- Matches skill level
- Scores recommendations (0-100)
- Saves top 5 recommendations per trainee

### Engagement Analytics
- Tracks material completion rates
- Monitors time spent learning
- Identifies active vs inactive users
- Recent activity tracking (7 days)

## 🧪 Testing

### Manual Testing
1. Register as admin and trainee
2. Create courses and upload materials
3. Assign courses to trainees
4. Create quizzes with questions
5. Take quizzes as trainee
6. Check gamification updates
7. View AI recommendations
8. Generate reports

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Update database credentials
3. Set secure JWT_SECRET
4. Configure CORS for production domain
5. Use process manager (PM2)

### Frontend Deployment
1. Build: `npm run build`
2. Deploy `dist` folder to hosting (Vercel, Netlify, etc.)
3. Update API URL in environment variables

## 📝 License

MIT License

## 👥 Contributors

Built for HackX by DebugThugs Team

## 🆘 Support

For issues and questions, please create an issue in the repository.

---

**Happy Learning! 🎓✨**
