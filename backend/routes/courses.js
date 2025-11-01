const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  addMaterial,
  getMaterials,
  assignCourse,
  getCourseStats
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(protect, getCourses)
  .post(protect, authorize('admin'), upload.single('thumbnail'), createCourse);

router.route('/:id')
  .get(protect, getCourse)
  .put(protect, authorize('admin'), upload.single('thumbnail'), updateCourse)
  .delete(protect, authorize('admin'), deleteCourse);

router.route('/:id/materials')
  .get(protect, getMaterials)
  .post(protect, authorize('admin'), upload.single('material'), addMaterial);

router.post('/:id/assign', protect, authorize('admin'), assignCourse);
router.get('/:id/stats', protect, authorize('admin'), getCourseStats);

module.exports = router;
