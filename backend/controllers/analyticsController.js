const AIEngine = require('../utils/aiEngine');
const Recommendation = require('../models/Recommendation');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get AI performance analysis
// @route   GET /api/analytics/performance
// @access  Private/Trainee
exports.getPerformanceAnalysis = async (req, res) => {
  try {
    const analysis = await AIEngine.analyzePerformance(req.user.id);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Get performance analysis error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get AI course recommendations
// @route   GET /api/analytics/recommendations
// @access  Private/Trainee
exports.getRecommendations = async (req, res) => {
  try {
    // Generate fresh recommendations
    const recommendations = await AIEngine.generateRecommendations(req.user.id);

    res.json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get saved recommendations
// @route   GET /api/analytics/recommendations/saved
// @access  Private/Trainee
exports.getSavedRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.findAll({
      where: { traineeId: req.user.id },
      include: [{
        model: Course,
        as: 'course',
        include: [{
          model: User,
          as: 'creator',
          attributes: ['id', 'name']
        }]
      }],
      order: [['score', 'DESC']]
    });

    res.json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    console.error('Get saved recommendations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Mark recommendation as viewed
// @route   PUT /api/analytics/recommendations/:id/view
// @access  Private/Trainee
exports.markRecommendationViewed = async (req, res) => {
  try {
    const recommendation = await Recommendation.findOne({
      where: {
        id: req.params.id,
        traineeId: req.user.id
      }
    });

    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }

    await recommendation.update({ isViewed: true });

    res.json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    console.error('Mark recommendation viewed error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Accept recommendation
// @route   PUT /api/analytics/recommendations/:id/accept
// @access  Private/Trainee
exports.acceptRecommendation = async (req, res) => {
  try {
    const recommendation = await Recommendation.findOne({
      where: {
        id: req.params.id,
        traineeId: req.user.id
      }
    });

    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }

    await recommendation.update({
      isViewed: true,
      isAccepted: true
    });

    res.json({
      success: true,
      message: 'Recommendation accepted',
      data: recommendation
    });
  } catch (error) {
    console.error('Accept recommendation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get engagement analytics
// @route   GET /api/analytics/engagement
// @access  Private/Trainee
exports.getEngagementAnalytics = async (req, res) => {
  try {
    const analytics = await AIEngine.getEngagementAnalytics(req.user.id);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get engagement analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get struggling topics
// @route   GET /api/analytics/struggling-topics
// @access  Private/Trainee
exports.getStrugglingTopics = async (req, res) => {
  try {
    const topics = await AIEngine.identifyStrugglingTopics(req.user.id);

    res.json({
      success: true,
      count: topics.length,
      data: topics
    });
  } catch (error) {
    console.error('Get struggling topics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get trainee analytics (Admin)
// @route   GET /api/analytics/trainee/:traineeId
// @access  Private/Admin
exports.getTraineeAnalytics = async (req, res) => {
  try {
    const { traineeId } = req.params;

    const trainee = await User.findByPk(traineeId);
    if (!trainee || trainee.role !== 'trainee') {
      return res.status(404).json({ message: 'Trainee not found' });
    }

    const [performance, engagement, strugglingTopics] = await Promise.all([
      AIEngine.analyzePerformance(traineeId),
      AIEngine.getEngagementAnalytics(traineeId),
      AIEngine.identifyStrugglingTopics(traineeId)
    ]);

    res.json({
      success: true,
      data: {
        trainee: {
          id: trainee.id,
          name: trainee.name,
          email: trainee.email
        },
        performance,
        engagement,
        strugglingTopics
      }
    });
  } catch (error) {
    console.error('Get trainee analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
