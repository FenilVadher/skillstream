const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Recommendation = sequelize.define('Recommendation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  traineeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    comment: 'Recommendation score (0-100)'
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isViewed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isAccepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'recommendations'
});

module.exports = Recommendation;
