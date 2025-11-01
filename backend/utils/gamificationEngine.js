const Gamification = require('../models/Gamification');
const Badge = require('../models/Badge');

// Points system
const POINTS = {
  COURSE_COMPLETE: 100,
  QUIZ_PASS: 50,
  QUIZ_PERFECT: 100,
  MATERIAL_COMPLETE: 10,
  DAILY_LOGIN: 5
};

// Rank thresholds
const RANKS = [
  { name: 'Beginner', minPoints: 0 },
  { name: 'Learner', minPoints: 100 },
  { name: 'Explorer', minPoints: 300 },
  { name: 'Achiever', minPoints: 600 },
  { name: 'Expert', minPoints: 1000 },
  { name: 'Master', minPoints: 2000 },
  { name: 'Legend', minPoints: 5000 }
];

class GamificationEngine {
  static async initializeUser(traineeId) {
    try {
      const existing = await Gamification.findOne({ where: { traineeId } });
      if (!existing) {
        await Gamification.create({ traineeId });
      }
    } catch (error) {
      console.error('Error initializing gamification:', error);
    }
  }

  static async addPoints(traineeId, points, reason = '') {
    try {
      await this.initializeUser(traineeId);
      
      const gamification = await Gamification.findOne({ where: { traineeId } });
      const newTotal = gamification.totalPoints + points;
      
      // Calculate new level (every 200 points = 1 level)
      const newLevel = Math.floor(newTotal / 200) + 1;
      
      // Determine rank
      const rank = RANKS.reverse().find(r => newTotal >= r.minPoints) || RANKS[0];
      
      await gamification.update({
        totalPoints: newTotal,
        level: newLevel,
        rank: rank.name
      });

      // Check for badge eligibility
      await this.checkBadges(traineeId);

      return gamification;
    } catch (error) {
      console.error('Error adding points:', error);
      throw error;
    }
  }

  static async updateCourseCompletion(traineeId) {
    try {
      const gamification = await Gamification.findOne({ where: { traineeId } });
      await gamification.increment('coursesCompleted');
      await this.addPoints(traineeId, POINTS.COURSE_COMPLETE, 'Course completion');
    } catch (error) {
      console.error('Error updating course completion:', error);
    }
  }

  static async updateQuizAttempt(traineeId, passed, percentage) {
    try {
      const gamification = await Gamification.findOne({ where: { traineeId } });
      
      await gamification.increment('quizzesAttempted');
      
      if (passed) {
        await gamification.increment('quizzesPassed');
        
        // Award points based on performance
        let points = POINTS.QUIZ_PASS;
        if (percentage === 100) {
          points = POINTS.QUIZ_PERFECT;
        }
        
        await this.addPoints(traineeId, points, `Quiz passed with ${percentage}%`);
      }

      // Update average score
      const totalAttempts = gamification.quizzesAttempted + 1;
      const newAverage = ((gamification.averageScore * gamification.quizzesAttempted) + percentage) / totalAttempts;
      
      await gamification.update({
        averageScore: newAverage.toFixed(2)
      });

    } catch (error) {
      console.error('Error updating quiz attempt:', error);
    }
  }

  static async updateStreak(traineeId) {
    try {
      const gamification = await Gamification.findOne({ where: { traineeId } });
      const today = new Date().toISOString().split('T')[0];
      const lastActivity = gamification.lastActivityDate;

      if (!lastActivity) {
        // First activity
        await gamification.update({
          streak: 1,
          lastActivityDate: today
        });
        await this.addPoints(traineeId, POINTS.DAILY_LOGIN, 'Daily login');
      } else {
        const lastDate = new Date(lastActivity);
        const todayDate = new Date(today);
        const diffTime = todayDate - lastDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Consecutive day
          await gamification.increment('streak');
          await gamification.update({ lastActivityDate: today });
          await this.addPoints(traineeId, POINTS.DAILY_LOGIN, 'Daily login streak');
        } else if (diffDays > 1) {
          // Streak broken
          await gamification.update({
            streak: 1,
            lastActivityDate: today
          });
          await this.addPoints(traineeId, POINTS.DAILY_LOGIN, 'Daily login');
        }
        // Same day, do nothing
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }

  static async checkBadges(traineeId) {
    try {
      const gamification = await Gamification.findOne({ where: { traineeId } });
      const allBadges = await Badge.findAll();
      const earnedBadges = gamification.badges || [];

      for (const badge of allBadges) {
        // Skip if already earned
        if (earnedBadges.some(b => b.id === badge.id)) continue;

        const criteria = badge.criteria;
        let earned = false;

        // Check criteria
        if (criteria.type === 'courses_completed' && gamification.coursesCompleted >= criteria.value) {
          earned = true;
        } else if (criteria.type === 'quizzes_passed' && gamification.quizzesPassed >= criteria.value) {
          earned = true;
        } else if (criteria.type === 'points' && gamification.totalPoints >= criteria.value) {
          earned = true;
        } else if (criteria.type === 'streak' && gamification.streak >= criteria.value) {
          earned = true;
        } else if (criteria.type === 'perfect_score' && criteria.value === true) {
          // Check if user has any perfect score
          // This would require checking quiz attempts
          continue;
        }

        if (earned) {
          earnedBadges.push({
            id: badge.id,
            name: badge.name,
            icon: badge.icon,
            earnedAt: new Date()
          });
        }
      }

      await gamification.update({ badges: earnedBadges });
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  }

  static async getLeaderboard(limit = 10) {
    try {
      const leaderboard = await Gamification.findAll({
        include: [{
          model: require('../models/User'),
          as: 'trainee',
          attributes: ['id', 'name', 'email', 'avatar']
        }],
        order: [['totalPoints', 'DESC']],
        limit
      });

      return leaderboard;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }
}

module.exports = GamificationEngine;
