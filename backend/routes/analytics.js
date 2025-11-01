const express = require('express');
const router = express.Router();
const {
  getPerformanceAnalysis,
  getRecommendations,
  getSavedRecommendations,
  markRecommendationViewed,
  acceptRecommendation,
  getEngagementAnalytics,
  getStrugglingTopics,
  getTraineeAnalytics
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/performance', protect, authorize('trainee'), getPerformanceAnalysis);
router.get('/recommendations', protect, authorize('trainee'), getRecommendations);
router.get('/recommendations/saved', protect, authorize('trainee'), getSavedRecommendations);
router.put('/recommendations/:id/view', protect, authorize('trainee'), markRecommendationViewed);
router.put('/recommendations/:id/accept', protect, authorize('trainee'), acceptRecommendation);
router.get('/engagement', protect, authorize('trainee'), getEngagementAnalytics);
router.get('/struggling-topics', protect, authorize('trainee'), getStrugglingTopics);
router.get('/trainee/:traineeId', protect, authorize('admin'), getTraineeAnalytics);

module.exports = router;
