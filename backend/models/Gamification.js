const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Gamification = sequelize.define('Gamification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  traineeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  totalPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  rank: {
    type: DataTypes.STRING(50),
    defaultValue: 'Beginner'
  },
  badges: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of earned badges'
  },
  coursesCompleted: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  quizzesAttempted: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  quizzesPassed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  averageScore: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Current learning streak in days'
  },
  lastActivityDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'gamification'
});

module.exports = Gamification;
