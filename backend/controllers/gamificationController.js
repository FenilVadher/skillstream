const Gamification = require('../models/Gamification');
const Badge = require('../models/Badge');
const User = require('../models/User');
const GamificationEngine = require('../utils/gamificationEngine');

// @desc    Get leaderboard
// @route   GET /api/gamification/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const leaderboard = await GamificationEngine.getLeaderboard(parseInt(limit));

    res.json({
      success: true,
      count: leaderboard.length,
      data: leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get my gamification stats
// @route   GET /api/gamification/me
// @access  Private/Trainee
exports.getMyStats = async (req, res) => {
  try {
    const gamification = await Gamification.findOne({
      where: { traineeId: req.user.id }
    });

    if (!gamification) {
      // Initialize if not exists
      await GamificationEngine.initializeUser(req.user.id);
      const newGamification = await Gamification.findOne({
        where: { traineeId: req.user.id }
      });
      return res.json({
        success: true,
        data: newGamification
      });
    }

    // Get rank position
    const allGamification = await Gamification.findAll({
      order: [['totalPoints', 'DESC']]
    });

    const rankPosition = allGamification.findIndex(g => g.traineeId === req.user.id) + 1;

    res.json({
      success: true,
      data: {
        ...gamification.toJSON(),
        rankPosition,
        totalUsers: allGamification.length
      }
    });
  } catch (error) {
    console.error('Get my stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all badges
// @route   GET /api/gamification/badges
// @access  Private
exports.getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.findAll({
      order: [['points', 'DESC']]
    });

    res.json({
      success: true,
      count: badges.length,
      data: badges
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create badge (Admin)
// @route   POST /api/gamification/badges
// @access  Private/Admin
exports.createBadge = async (req, res) => {
  try {
    const { name, description, icon, criteria, points, rarity } = req.body;

    const badge = await Badge.create({
      name,
      description,
      icon,
      criteria,
      points: points || 0,
      rarity: rarity || 'common'
    });

    res.status(201).json({
      success: true,
      data: badge
    });
  } catch (error) {
    console.error('Create badge error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get trainee badges
// @route   GET /api/gamification/trainee/:traineeId/badges
// @access  Private
exports.getTraineeBadges = async (req, res) => {
  try {
    const { traineeId } = req.params;

    // Trainees can only view their own badges unless admin
    if (req.user.role === 'trainee' && req.user.id !== parseInt(traineeId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const gamification = await Gamification.findOne({
      where: { traineeId }
    });

    if (!gamification) {
      return res.json({
        success: true,
        data: []
      });
    }

    res.json({
      success: true,
      data: gamification.badges || []
    });
  } catch (error) {
    console.error('Get trainee badges error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get gamification overview (Admin)
// @route   GET /api/gamification/overview
// @access  Private/Admin
exports.getOverview = async (req, res) => {
  try {
    const allGamification = await Gamification.findAll({
      include: [{
        model: User,
        as: 'trainee',
        attributes: ['id', 'name', 'email']
      }],
      order: [['totalPoints', 'DESC']]
    });

    const totalTrainees = allGamification.length;
    const totalPoints = allGamification.reduce((sum, g) => sum + g.totalPoints, 0);
    const avgPoints = totalTrainees > 0 ? (totalPoints / totalTrainees).toFixed(2) : 0;
    
    const totalCoursesCompleted = allGamification.reduce((sum, g) => sum + g.coursesCompleted, 0);
    const totalQuizzesAttempted = allGamification.reduce((sum, g) => sum + g.quizzesAttempted, 0);
    const totalQuizzesPassed = allGamification.reduce((sum, g) => sum + g.quizzesPassed, 0);

    const rankDistribution = {};
    allGamification.forEach(g => {
      rankDistribution[g.rank] = (rankDistribution[g.rank] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        totalTrainees,
        totalPoints,
        avgPoints,
        totalCoursesCompleted,
        totalQuizzesAttempted,
        totalQuizzesPassed,
        passRate: totalQuizzesAttempted > 0 
          ? ((totalQuizzesPassed / totalQuizzesAttempted) * 100).toFixed(2)
          : 0,
        rankDistribution,
        topPerformers: allGamification.slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Get overview error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Award manual points (Admin)
// @route   POST /api/gamification/award-points
// @access  Private/Admin
exports.awardPoints = async (req, res) => {
  try {
    const { traineeId, points, reason } = req.body;

    if (!traineeId || !points) {
      return res.status(400).json({ message: 'Please provide traineeId and points' });
    }

    const trainee = await User.findOne({
      where: { id: traineeId, role: 'trainee' }
    });

    if (!trainee) {
      return res.status(404).json({ message: 'Trainee not found' });
    }

    await GamificationEngine.addPoints(traineeId, points, reason || 'Manual award by admin');

    const gamification = await Gamification.findOne({
      where: { traineeId }
    });

    res.json({
      success: true,
      message: `${points} points awarded to ${trainee.name}`,
      data: gamification
    });
  } catch (error) {
    console.error('Award points error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
