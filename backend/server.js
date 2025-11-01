const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const quizRoutes = require('./routes/quizzes');
const progressRoutes = require('./routes/progress');
const gamificationRoutes = require('./routes/gamification');
const analyticsRoutes = require('./routes/analytics');
const adminRoutes = require('./routes/admin');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Database sync and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    const connected = await testConnection();
    
    if (!connected) {
      console.error('❌ Failed to connect to database. Please check your configuration.');
      process.exit(1);
    }

    // Sync database (create tables)
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database synchronized');

    // Initialize default badges
    await initializeDefaultBadges();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
      console.log(`📊 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

// Initialize default badges
async function initializeDefaultBadges() {
  const Badge = require('./models/Badge');
  
  const defaultBadges = [
    {
      name: 'First Steps',
      description: 'Complete your first course',
      icon: '🎯',
      criteria: { type: 'courses_completed', value: 1 },
      points: 50,
      rarity: 'common'
    },
    {
      name: 'Learning Enthusiast',
      description: 'Complete 5 courses',
      icon: '📚',
      criteria: { type: 'courses_completed', value: 5 },
      points: 200,
      rarity: 'rare'
    },
    {
      name: 'Quiz Master',
      description: 'Pass 10 quizzes',
      icon: '🏆',
      criteria: { type: 'quizzes_passed', value: 10 },
      points: 300,
      rarity: 'epic'
    },
    {
      name: 'Point Collector',
      description: 'Earn 1000 points',
      icon: '⭐',
      criteria: { type: 'points', value: 1000 },
      points: 100,
      rarity: 'rare'
    },
    {
      name: 'Dedicated Learner',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      criteria: { type: 'streak', value: 7 },
      points: 150,
      rarity: 'epic'
    },
    {
      name: 'Legend',
      description: 'Earn 5000 points',
      icon: '👑',
      criteria: { type: 'points', value: 5000 },
      points: 500,
      rarity: 'legendary'
    }
  ];

  for (const badge of defaultBadges) {
    try {
      await Badge.findOrCreate({
        where: { name: badge.name },
        defaults: badge
      });
    } catch (error) {
      // Badge might already exist, continue
    }
  }
  
  console.log('✅ Default badges initialized');
}

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});
