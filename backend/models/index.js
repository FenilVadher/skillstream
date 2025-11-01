const { sequelize } = require('../config/database');
const User = require('./User');
const Course = require('./Course');
const Material = require('./Material');
const CourseAssignment = require('./CourseAssignment');
const Progress = require('./Progress');
const Quiz = require('./Quiz');
const Question = require('./Question');
const QuizAttempt = require('./QuizAttempt');
const Gamification = require('./Gamification');
const Badge = require('./Badge');
const Recommendation = require('./Recommendation');

// Define Associations

// User associations
User.hasMany(Course, { foreignKey: 'createdBy', as: 'createdCourses' });
User.hasMany(CourseAssignment, { foreignKey: 'traineeId', as: 'assignments' });
User.hasMany(Progress, { foreignKey: 'traineeId', as: 'progress' });
User.hasMany(QuizAttempt, { foreignKey: 'traineeId', as: 'quizAttempts' });
User.hasOne(Gamification, { foreignKey: 'traineeId', as: 'gamification' });
User.hasMany(Recommendation, { foreignKey: 'traineeId', as: 'recommendations' });

// Course associations
Course.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Course.hasMany(Material, { foreignKey: 'courseId', as: 'materials' });
Course.hasMany(CourseAssignment, { foreignKey: 'courseId', as: 'assignments' });
Course.hasMany(Progress, { foreignKey: 'courseId', as: 'progress' });
Course.hasMany(Quiz, { foreignKey: 'courseId', as: 'quizzes' });
Course.hasMany(Recommendation, { foreignKey: 'courseId', as: 'recommendations' });

// Material associations
Material.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Material.hasMany(Progress, { foreignKey: 'materialId', as: 'progress' });

// CourseAssignment associations
CourseAssignment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
CourseAssignment.belongsTo(User, { foreignKey: 'traineeId', as: 'trainee' });
CourseAssignment.belongsTo(User, { foreignKey: 'assignedBy', as: 'assigner' });

// Progress associations
Progress.belongsTo(User, { foreignKey: 'traineeId', as: 'trainee' });
Progress.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Progress.belongsTo(Material, { foreignKey: 'materialId', as: 'material' });

// Quiz associations
Quiz.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Quiz.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Quiz.hasMany(Question, { foreignKey: 'quizId', as: 'questions' });
Quiz.hasMany(QuizAttempt, { foreignKey: 'quizId', as: 'attempts' });

// Question associations
Question.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });

// QuizAttempt associations
QuizAttempt.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });
QuizAttempt.belongsTo(User, { foreignKey: 'traineeId', as: 'trainee' });

// Gamification associations
Gamification.belongsTo(User, { foreignKey: 'traineeId', as: 'trainee' });

// Recommendation associations
Recommendation.belongsTo(User, { foreignKey: 'traineeId', as: 'trainee' });
Recommendation.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

const models = {
  User,
  Course,
  Material,
  CourseAssignment,
  Progress,
  Quiz,
  Question,
  QuizAttempt,
  Gamification,
  Badge,
  Recommendation,
  sequelize
};

module.exports = models;
