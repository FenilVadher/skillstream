const express = require('express');
const router = express.Router();
const {
  getLeaderboard,
  getMyStats,
  getAllBadges,
  createBadge,
  getTraineeBadges,
  getOverview,
  awardPoints
} = require('../controllers/gamificationController');
const { protect, authorize } = require('../middleware/auth');

router.get('/leaderboard', protect, getLeaderboard);
router.get('/me', protect, authorize('trainee'), getMyStats);
router.get('/badges', protect, getAllBadges);
router.post('/badges', protect, authorize('admin'), createBadge);
router.get('/trainee/:traineeId/badges', protect, getTraineeBadges);
router.get('/overview', protect, authorize('admin'), getOverview);
router.post('/award-points', protect, authorize('admin'), awardPoints);

module.exports = router;
