const Progress = require('../models/Progress');
const Material = require('../models/Material');
const Course = require('../models/Course');
const CourseAssignment = require('../models/CourseAssignment');
const GamificationEngine = require('../utils/gamificationEngine');

// @desc    Get trainee progress
// @route   GET /api/progress
// @access  Private/Trainee
exports.getMyProgress = async (req, res) => {
  try {
    const { courseId } = req.query;
    const where = { traineeId: req.user.id };

    if (courseId) where.courseId = courseId;

    const progress = await Progress.findAll({
      where,
      include: [
        {
          model: Material,
          as: 'material',
          include: [{
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'category']
          }]
        }
      ],
      order: [['lastAccessedAt', 'DESC']]
    });

    res.json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update material progress
// @route   PUT /api/progress/material/:materialId
// @access  Private/Trainee
exports.updateProgress = async (req, res) => {
  try {
    const { materialId } = req.params;
    const { status, progressPercentage, timeSpent } = req.body;

    const material = await Material.findByPk(materialId, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Check if progress record exists
    let progress = await Progress.findOne({
      where: {
        traineeId: req.user.id,
        materialId
      }
    });

    const updateData = {
      status: status || (progress?.status || 'in_progress'),
      progressPercentage: progressPercentage !== undefined ? progressPercentage : (progress?.progressPercentage || 0),
      timeSpent: timeSpent !== undefined ? timeSpent : (progress?.timeSpent || 0),
      lastAccessedAt: new Date()
    };

    if (status === 'completed' || progressPercentage === 100) {
      updateData.status = 'completed';
      updateData.progressPercentage = 100;
      updateData.completedAt = new Date();
      
      // Award points for material completion
      await GamificationEngine.addPoints(req.user.id, 10, 'Material completion');
    }

    if (progress) {
      await progress.update(updateData);
    } else {
      progress = await Progress.create({
        traineeId: req.user.id,
        courseId: material.courseId,
        materialId,
        ...updateData
      });
    }

    // Update course assignment status
    const assignment = await CourseAssignment.findOne({
      where: {
        traineeId: req.user.id,
        courseId: material.courseId
      }
    });

    if (assignment && assignment.status === 'assigned') {
      await assignment.update({ status: 'in_progress' });
    }

    // Check if all materials in course are completed
    if (status === 'completed' || progressPercentage === 100) {
      await this.checkCourseCompletion(req.user.id, material.courseId);
    }

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get course progress summary
// @route   GET /api/progress/course/:courseId
// @access  Private/Trainee
exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findByPk(courseId, {
      include: [{
        model: Material,
        as: 'materials'
      }]
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const progress = await Progress.findAll({
      where: {
        traineeId: req.user.id,
        courseId
      },
      include: [{
        model: Material,
        as: 'material'
      }]
    });

    const totalMaterials = course.materials.length;
    const completedMaterials = progress.filter(p => p.status === 'completed').length;
    const inProgressMaterials = progress.filter(p => p.status === 'in_progress').length;

    const overallProgress = totalMaterials > 0 
      ? ((completedMaterials / totalMaterials) * 100).toFixed(2)
      : 0;

    const totalTimeSpent = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);

    res.json({
      success: true,
      data: {
        courseId,
        courseTitle: course.title,
        totalMaterials,
        completedMaterials,
        inProgressMaterials,
        notStartedMaterials: totalMaterials - completedMaterials - inProgressMaterials,
        overallProgress,
        totalTimeSpent,
        materials: progress
      }
    });
  } catch (error) {
    console.error('Get course progress error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all trainees progress (Admin)
// @route   GET /api/progress/all
// @access  Private/Admin
exports.getAllProgress = async (req, res) => {
  try {
    const { courseId, traineeId } = req.query;
    const where = {};

    if (courseId) where.courseId = courseId;
    if (traineeId) where.traineeId = traineeId;

    const progress = await Progress.findAll({
      where,
      include: [
        {
          model: require('../models/User'),
          as: 'trainee',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Material,
          as: 'material',
          include: [{
            model: Course,
            as: 'course',
            attributes: ['id', 'title', 'category']
          }]
        }
      ],
      order: [['lastAccessedAt', 'DESC']]
    });

    res.json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (error) {
    console.error('Get all progress error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to check course completion
exports.checkCourseCompletion = async (traineeId, courseId) => {
  try {
    const course = await Course.findByPk(courseId, {
      include: [{ model: Material, as: 'materials' }]
    });

    const progress = await Progress.findAll({
      where: { traineeId, courseId }
    });

    const totalMaterials = course.materials.length;
    const completedMaterials = progress.filter(p => p.status === 'completed').length;

    if (totalMaterials > 0 && completedMaterials === totalMaterials) {
      // Mark course as completed
      const assignment = await CourseAssignment.findOne({
        where: { traineeId, courseId }
      });

      if (assignment && assignment.status !== 'completed') {
        await assignment.update({
          status: 'completed',
          completedAt: new Date()
        });

        // Award course completion points
        await GamificationEngine.updateCourseCompletion(traineeId);
      }
    }
  } catch (error) {
    console.error('Check course completion error:', error);
  }
};
