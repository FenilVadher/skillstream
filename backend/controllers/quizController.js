const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const Course = require('../models/Course');
const User = require('../models/User');
const GamificationEngine = require('../utils/gamificationEngine');

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Private
exports.getQuizzes = async (req, res) => {
  try {
    const { courseId } = req.query;
    const where = { isActive: true };

    if (courseId) where.courseId = courseId;

    const quizzes = await Quiz.findAll({
      where,
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'category']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'category']
        },
        {
          model: Question,
          as: 'questions',
          attributes: req.user.role === 'admin' 
            ? undefined 
            : { exclude: ['correctAnswer'] }, // Hide correct answers for trainees
          order: [['orderIndex', 'ASC']]
        }
      ]
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create quiz
// @route   POST /api/quizzes
// @access  Private/Admin
exports.createQuiz = async (req, res) => {
  try {
    const { courseId, title, description, duration, passingScore, totalMarks, questions } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const quiz = await Quiz.create({
      courseId,
      title,
      description,
      duration,
      passingScore: passingScore || 70,
      totalMarks: totalMarks || 100,
      createdBy: req.user.id
    });

    // Add questions if provided
    if (questions && Array.isArray(questions)) {
      for (let i = 0; i < questions.length; i++) {
        await Question.create({
          quizId: quiz.id,
          questionText: questions[i].questionText,
          options: questions[i].options,
          correctAnswer: questions[i].correctAnswer,
          marks: questions[i].marks || 1,
          orderIndex: i
        });
      }
    }

    const quizWithQuestions = await Quiz.findByPk(quiz.id, {
      include: [{ model: Question, as: 'questions' }]
    });

    res.status(201).json({
      success: true,
      data: quizWithQuestions
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Admin
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { title, description, duration, passingScore, totalMarks, isActive } = req.body;

    await quiz.update({
      title: title || quiz.title,
      description: description || quiz.description,
      duration: duration || quiz.duration,
      passingScore: passingScore || quiz.passingScore,
      totalMarks: totalMarks || quiz.totalMarks,
      isActive: isActive !== undefined ? isActive : quiz.isActive
    });

    res.json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Admin
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    await quiz.update({ isActive: false });

    res.json({
      success: true,
      message: 'Quiz deactivated successfully'
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add question to quiz
// @route   POST /api/quizzes/:id/questions
// @access  Private/Admin
exports.addQuestion = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { questionText, options, correctAnswer, marks, orderIndex } = req.body;

    const question = await Question.create({
      quizId: quiz.id,
      questionText,
      options,
      correctAnswer,
      marks: marks || 1,
      orderIndex: orderIndex || 0
    });

    res.status(201).json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Add question error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/:id/submit
// @access  Private/Trainee
exports.submitQuiz = async (req, res) => {
  try {
    const { answers, timeSpent } = req.body;

    const quiz = await Quiz.findByPk(req.params.id, {
      include: [{
        model: Question,
        as: 'questions'
      }]
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate score
    let score = 0;
    let totalMarks = 0;

    quiz.questions.forEach(question => {
      totalMarks += question.marks;
      if (answers[question.id] === question.correctAnswer) {
        score += question.marks;
      }
    });

    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
    const passed = percentage >= quiz.passingScore;

    // Save attempt
    const attempt = await QuizAttempt.create({
      quizId: quiz.id,
      traineeId: req.user.id,
      answers,
      score,
      totalMarks,
      percentage: percentage.toFixed(2),
      passed,
      timeSpent,
      startedAt: new Date(Date.now() - (timeSpent * 1000)),
      submittedAt: new Date()
    });

    // Update gamification
    await GamificationEngine.updateQuizAttempt(req.user.id, passed, percentage);

    res.status(201).json({
      success: true,
      data: {
        attempt,
        score,
        totalMarks,
        percentage: percentage.toFixed(2),
        passed,
        passingScore: quiz.passingScore
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get quiz attempts
// @route   GET /api/quizzes/:id/attempts
// @access  Private
exports.getQuizAttempts = async (req, res) => {
  try {
    const where = { quizId: req.params.id };

    // Trainees can only see their own attempts
    if (req.user.role === 'trainee') {
      where.traineeId = req.user.id;
    }

    const attempts = await QuizAttempt.findAll({
      where,
      include: [
        {
          model: User,
          as: 'trainee',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['submittedAt', 'DESC']]
    });

    res.json({
      success: true,
      count: attempts.length,
      data: attempts
    });
  } catch (error) {
    console.error('Get quiz attempts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get trainee's quiz history
// @route   GET /api/quizzes/my-attempts
// @access  Private/Trainee
exports.getMyAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.findAll({
      where: { traineeId: req.user.id },
      include: [
        {
          model: Quiz,
          as: 'quiz',
          include: [{
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'category']
          }]
        }
      ],
      order: [['submittedAt', 'DESC']]
    });

    res.json({
      success: true,
      count: attempts.length,
      data: attempts
    });
  } catch (error) {
    console.error('Get my attempts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
