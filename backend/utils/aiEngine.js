const { Op } = require('sequelize');
const Course = require('../models/Course');
const QuizAttempt = require('../models/QuizAttempt');
const Progress = require('../models/Progress');
const CourseAssignment = require('../models/CourseAssignment');
const Recommendation = require('../models/Recommendation');
const Question = require('../models/Question');

class AIEngine {
  /**
   * Analyze trainee performance and identify weak areas
   */
  static async analyzePerformance(traineeId) {
    try {
      const quizAttempts = await QuizAttempt.findAll({
        where: { traineeId },
        include: [{
          model: require('../models/Quiz'),
          as: 'quiz',
          include: [{
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'category', 'technology']
          }]
        }],
        order: [['submittedAt', 'DESC']]
      });

      if (quizAttempts.length === 0) {
        return {
          weakAreas: [],
          strongAreas: [],
          averageScore: 0,
          totalAttempts: 0
        };
      }

      // Analyze by category/technology
      const categoryScores = {};
      const technologyScores = {};

      quizAttempts.forEach(attempt => {
        const category = attempt.quiz.course.category;
        const technology = attempt.quiz.course.technology;
        const score = parseFloat(attempt.percentage);

        if (!categoryScores[category]) {
          categoryScores[category] = { total: 0, count: 0 };
        }
        categoryScores[category].total += score;
        categoryScores[category].count += 1;

        if (technology) {
          if (!technologyScores[technology]) {
            technologyScores[technology] = { total: 0, count: 0 };
          }
          technologyScores[technology].total += score;
          technologyScores[technology].count += 1;
        }
      });

      // Calculate averages
      const categoryAverages = Object.entries(categoryScores).map(([name, data]) => ({
        name,
        average: (data.total / data.count).toFixed(2),
        attempts: data.count
      }));

      const technologyAverages = Object.entries(technologyScores).map(([name, data]) => ({
        name,
        average: (data.total / data.count).toFixed(2),
        attempts: data.count
      }));

      // Identify weak and strong areas (threshold: 70%)
      const weakAreas = [
        ...categoryAverages.filter(c => c.average < 70),
        ...technologyAverages.filter(t => t.average < 70)
      ];

      const strongAreas = [
        ...categoryAverages.filter(c => c.average >= 85),
        ...technologyAverages.filter(t => t.average >= 85)
      ];

      const totalScore = quizAttempts.reduce((sum, a) => sum + parseFloat(a.percentage), 0);
      const averageScore = (totalScore / quizAttempts.length).toFixed(2);

      return {
        weakAreas,
        strongAreas,
        averageScore,
        totalAttempts: quizAttempts.length,
        categoryAverages,
        technologyAverages
      };
    } catch (error) {
      console.error('Error analyzing performance:', error);
      throw error;
    }
  }

  /**
   * Generate personalized course recommendations
   */
  static async generateRecommendations(traineeId) {
    try {
      // Get trainee's performance analysis
      const performance = await this.analyzePerformance(traineeId);

      // Get completed courses
      const completedAssignments = await CourseAssignment.findAll({
        where: {
          traineeId,
          status: 'completed'
        },
        attributes: ['courseId']
      });

      const completedCourseIds = completedAssignments.map(a => a.courseId);

      // Get all available courses
      const allCourses = await Course.findAll({
        where: {
          is_active: true,
          id: { [Op.notIn]: completedCourseIds }
        }
      });

      const recommendations = [];

      for (const course of allCourses) {
        let score = 50; // Base score
        let reason = [];

        // Boost score for weak areas
        const weakCategories = performance.weakAreas.map(w => w.name.toLowerCase());
        if (weakCategories.includes(course.category.toLowerCase())) {
          score += 30;
          reason.push(`Helps improve your ${course.category} skills`);
        }
        if (course.technology && weakCategories.includes(course.technology.toLowerCase())) {
          score += 30;
          reason.push(`Addresses your weak area in ${course.technology}`);
        }

        // Consider difficulty progression
        if (performance.averageScore >= 85 && course.difficulty === 'advanced') {
          score += 20;
          reason.push('Matches your advanced skill level');
        } else if (performance.averageScore >= 70 && course.difficulty === 'intermediate') {
          score += 15;
          reason.push('Good next step for your skill level');
        } else if (performance.averageScore < 70 && course.difficulty === 'beginner') {
          score += 15;
          reason.push('Helps build foundational skills');
        }

        // Boost score for related technologies
        const strongCategories = performance.strongAreas.map(s => s.name.toLowerCase());
        if (strongCategories.includes(course.category.toLowerCase())) {
          score += 10;
          reason.push(`Builds on your strength in ${course.category}`);
        }

        // Cap score at 100
        score = Math.min(score, 100);

        if (score >= 60) {
          recommendations.push({
            courseId: course.id,
            course,
            score,
            reason: reason.join('. ')
          });
        }
      }

      // Sort by score
      recommendations.sort((a, b) => b.score - a.score);

      // Save top recommendations to database
      const topRecommendations = recommendations.slice(0, 5);
      
      // Clear old recommendations
      await Recommendation.destroy({ where: { traineeId } });

      // Save new recommendations
      for (const rec of topRecommendations) {
        await Recommendation.create({
          traineeId,
          courseId: rec.courseId,
          score: rec.score,
          reason: rec.reason
        });
      }

      return recommendations.slice(0, 10);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  /**
   * Get engagement analytics
   */
  static async getEngagementAnalytics(traineeId) {
    try {
      const progress = await Progress.findAll({
        where: { traineeId }
      });

      const totalMaterials = progress.length;
      const completedMaterials = progress.filter(p => p.status === 'completed').length;
      const inProgressMaterials = progress.filter(p => p.status === 'in_progress').length;

      const totalTimeSpent = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
      const avgTimePerMaterial = totalMaterials > 0 ? totalTimeSpent / totalMaterials : 0;

      // Get recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentProgress = progress.filter(p => 
        p.lastAccessedAt && new Date(p.lastAccessedAt) >= sevenDaysAgo
      );

      return {
        totalMaterials,
        completedMaterials,
        inProgressMaterials,
        completionRate: totalMaterials > 0 ? ((completedMaterials / totalMaterials) * 100).toFixed(2) : 0,
        totalTimeSpent,
        avgTimePerMaterial: Math.round(avgTimePerMaterial),
        recentActivity: recentProgress.length,
        isActive: recentProgress.length > 0
      };
    } catch (error) {
      console.error('Error getting engagement analytics:', error);
      throw error;
    }
  }

  /**
   * Identify topics where trainee struggles
   */
  static async identifyStrugglingTopics(traineeId) {
    try {
      const quizAttempts = await QuizAttempt.findAll({
        where: { traineeId },
        include: [{
          model: require('../models/Quiz'),
          as: 'quiz',
          include: [{
            model: Course,
            as: 'course'
          }, {
            model: Question,
            as: 'questions'
          }]
        }]
      });

      const topicPerformance = {};

      for (const attempt of quizAttempts) {
        const courseTopic = attempt.quiz.course.category;
        const answers = attempt.answers;
        const questions = attempt.quiz.questions;

        let correctCount = 0;
        questions.forEach(q => {
          if (answers[q.id] === q.correctAnswer) {
            correctCount++;
          }
        });

        const accuracy = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;

        if (!topicPerformance[courseTopic]) {
          topicPerformance[courseTopic] = { total: 0, count: 0 };
        }
        topicPerformance[courseTopic].total += accuracy;
        topicPerformance[courseTopic].count += 1;
      }

      const strugglingTopics = Object.entries(topicPerformance)
        .map(([topic, data]) => ({
          topic,
          averageAccuracy: (data.total / data.count).toFixed(2),
          attempts: data.count
        }))
        .filter(t => t.averageAccuracy < 60)
        .sort((a, b) => a.averageAccuracy - b.averageAccuracy);

      return strugglingTopics;
    } catch (error) {
      console.error('Error identifying struggling topics:', error);
      throw error;
    }
  }
}

module.exports = AIEngine;
