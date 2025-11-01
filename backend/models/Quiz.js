const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Quiz = sequelize.define('Quiz', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in minutes'
  },
  passing_score: {
    type: DataTypes.INTEGER,
    field: 'passing_score',
    defaultValue: 70,
    comment: 'Passing percentage'
  },
  total_marks: {
    type: DataTypes.INTEGER,
    field: 'total_marks',
    defaultValue: 100
  },
  created_by: {
    type: DataTypes.INTEGER,
    field: 'created_by',
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    field: 'is_active',
    defaultValue: true
  }
}, {
  tableName: 'quizzes'
});

module.exports = Quiz;
