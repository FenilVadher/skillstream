const express = require('express');
const router = express.Router();
const {
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  submitQuiz,
  getQuizAttempts,
  getMyAttempts
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getQuizzes)
  .post(protect, authorize('admin'), createQuiz);

router.get('/my-attempts', protect, authorize('trainee'), getMyAttempts);

router.route('/:id')
  .get(protect, getQuiz)
  .put(protect, authorize('admin'), updateQuiz)
  .delete(protect, authorize('admin'), deleteQuiz);

router.post('/:id/questions', protect, authorize('admin'), addQuestion);
router.post('/:id/submit', protect, authorize('trainee'), submitQuiz);
router.get('/:id/attempts', protect, getQuizAttempts);

module.exports = router;
