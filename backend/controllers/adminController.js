const User = require('../models/User');
const Course = require('../models/Course');
const CourseAssignment = require('../models/CourseAssignment');
const QuizAttempt = require('../models/QuizAttempt');
const Gamification = require('../models/Gamification');
const ReportGenerator = require('../utils/reportGenerator');
const path = require('path');
const fs = require('fs');

// @desc    Get all trainees
// @route   GET /api/admin/trainees
// @access  Private/Admin
exports.getTrainees = async (req, res) => {
  try {
    const trainees = await User.findAll({
      where: { role: 'trainee' },
      attributes: { exclude: ['password'] },
      include: [{
        model: Gamification,
        as: 'gamification'
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: trainees.length,
      data: trainees
    });
  } catch (error) {
    console.error('Get trainees error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get trainee details
// @route   GET /api/admin/trainees/:id
// @access  Private/Admin
exports.getTraineeDetails = async (req, res) => {
  try {
    const trainee = await User.findOne({
      where: {
        id: req.params.id,
        role: 'trainee'
      },
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Gamification,
          as: 'gamification'
        },
        {
          model: CourseAssignment,
          as: 'assignments',
          include: [{
            model: Course,
            as: 'course'
          }]
        },
        {
          model: QuizAttempt,
          as: 'quizAttempts',
          include: [{
            model: require('../models/Quiz'),
            as: 'quiz',
            include: [{
              model: Course,
              as: 'course'
            }]
          }],
          order: [['submittedAt', 'DESC']],
          limit: 10
        }
      ]
    });

    if (!trainee) {
      return res.status(404).json({ message: 'Trainee not found' });
    }

    res.json({
      success: true,
      data: trainee
    });
  } catch (error) {
    console.error('Get trainee details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalTrainees,
      totalCourses,
      totalAssignments,
      totalQuizAttempts
    ] = await Promise.all([
      User.count({ where: { role: 'trainee', isActive: true } }),
      Course.count({ where: { isActive: true } }),
      CourseAssignment.count(),
      QuizAttempt.count()
    ]);

    const completedCourses = await CourseAssignment.count({
      where: { status: 'completed' }
    });

    const passedQuizzes = await QuizAttempt.count({
      where: { passed: true }
    });

    const recentAssignments = await CourseAssignment.findAll({
      limit: 5,
      order: [['assignedAt', 'DESC']],
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title']
        },
        {
          model: User,
          as: 'trainee',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    const topPerformers = await Gamification.findAll({
      limit: 5,
      order: [['totalPoints', 'DESC']],
      include: [{
        model: User,
        as: 'trainee',
        attributes: ['id', 'name', 'email', 'avatar']
      }]
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalTrainees,
          totalCourses,
          totalAssignments,
          totalQuizAttempts,
          completedCourses,
          passedQuizzes,
          courseCompletionRate: totalAssignments > 0 
            ? ((completedCourses / totalAssignments) * 100).toFixed(2)
            : 0,
          quizPassRate: totalQuizAttempts > 0
            ? ((passedQuizzes / totalQuizAttempts) * 100).toFixed(2)
            : 0
        },
        recentAssignments,
        topPerformers
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Generate trainee report (PDF)
// @route   GET /api/admin/reports/trainee/:traineeId
// @access  Private/Admin
exports.generateTraineeReport = async (req, res) => {
  try {
    const trainee = await User.findOne({
      where: {
        id: req.params.traineeId,
        role: 'trainee'
      },
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Gamification,
          as: 'gamification'
        },
        {
          model: CourseAssignment,
          as: 'assignments',
          include: [{
            model: Course,
            as: 'course'
          }]
        },
        {
          model: QuizAttempt,
          as: 'quizAttempts',
          include: [{
            model: require('../models/Quiz'),
            as: 'quiz'
          }]
        }
      ]
    });

    if (!trainee) {
      return res.status(404).json({ message: 'Trainee not found' });
    }

    // Ensure reports directory exists
    const reportsDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const fileName = `trainee_${trainee.id}_${Date.now()}.pdf`;
    const filePath = path.join(reportsDir, fileName);

    await ReportGenerator.generateTraineeReportPDF(trainee, filePath);

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      // Clean up file after download
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Generate trainee report error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Generate bulk report (Excel)
// @route   GET /api/admin/reports/bulk
// @access  Private/Admin
exports.generateBulkReport = async (req, res) => {
  try {
    const trainees = await User.findAll({
      where: { role: 'trainee' },
      attributes: { exclude: ['password'] },
      include: [{
        model: Gamification,
        as: 'gamification'
      }]
    });

    // Ensure reports directory exists
    const reportsDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const fileName = `bulk_report_${Date.now()}.xlsx`;
    const filePath = path.join(reportsDir, fileName);

    await ReportGenerator.generateBulkReportExcel(trainees, filePath);

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      // Clean up file after download
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Generate bulk report error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Toggle trainee status
// @route   PUT /api/admin/trainees/:id/toggle-status
// @access  Private/Admin
exports.toggleTraineeStatus = async (req, res) => {
  try {
    const trainee = await User.findOne({
      where: {
        id: req.params.id,
        role: 'trainee'
      }
    });

    if (!trainee) {
      return res.status(404).json({ message: 'Trainee not found' });
    }

    await trainee.update({ isActive: !trainee.isActive });

    res.json({
      success: true,
      message: `Trainee ${trainee.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: trainee.id,
        name: trainee.name,
        isActive: trainee.isActive
      }
    });
  } catch (error) {
    console.error('Toggle trainee status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getSystemAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate) dateFilter.createdAt = { $gte: new Date(startDate) };
    if (endDate) dateFilter.createdAt = { ...dateFilter.createdAt, $lte: new Date(endDate) };

    // Course analytics
    const coursesByCategory = await Course.findAll({
      attributes: [
        'category',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: { isActive: true },
      group: ['category']
    });

    // Quiz performance
    const quizStats = await QuizAttempt.findAll({
      attributes: [
        [require('sequelize').fn('AVG', require('sequelize').col('percentage')), 'avgScore'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'totalAttempts'],
        [require('sequelize').fn('SUM', require('sequelize').literal('CASE WHEN passed = 1 THEN 1 ELSE 0 END')), 'passedCount']
      ]
    });

    // Active users trend
    const activeUsers = await User.count({
      where: {
        role: 'trainee',
        isActive: true,
        lastLogin: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    });

    res.json({
      success: true,
      data: {
        coursesByCategory,
        quizStats: quizStats[0],
        activeUsers
      }
    });
  } catch (error) {
    console.error('Get system analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
