const express = require('express');
const router = express.Router();
const {
  getMyProgress,
  updateProgress,
  getCourseProgress,
  getAllProgress
} = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('trainee'), getMyProgress);
router.get('/all', protect, authorize('admin'), getAllProgress);
router.put('/material/:materialId', protect, authorize('trainee'), updateProgress);
router.get('/course/:courseId', protect, authorize('trainee'), getCourseProgress);

module.exports = router;
