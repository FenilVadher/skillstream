const express = require('express');
const router = express.Router();
const {
  getTrainees,
  getTraineeDetails,
  getDashboardStats,
  generateTraineeReport,
  generateBulkReport,
  toggleTraineeStatus,
  getSystemAnalytics
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/trainees', getTrainees);
router.get('/trainees/:id', getTraineeDetails);
router.put('/trainees/:id/toggle-status', toggleTraineeStatus);
router.get('/reports/trainee/:traineeId', generateTraineeReport);
router.get('/reports/bulk', generateBulkReport);
router.get('/analytics', getSystemAnalytics);

module.exports = router;
