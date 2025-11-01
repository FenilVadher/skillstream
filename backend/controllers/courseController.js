const { Op } = require('sequelize');
const Course = require('../models/Course');
const Material = require('../models/Material');
const CourseAssignment = require('../models/CourseAssignment');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
exports.getCourses = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    const where = { isActive: true };

    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const courses = await Course.findAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Material,
          as: 'materials',
          attributes: ['id', 'title', 'type', 'duration']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Material,
          as: 'materials',
          order: [['orderIndex', 'ASC']]
        },
        {
          model: Quiz,
          as: 'quizzes',
          where: { isActive: true },
          required: false
        }
      ]
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Admin
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, technology, difficulty, duration } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
      technology,
      difficulty,
      duration,
      createdBy: req.user.id,
      thumbnail: req.file ? `/uploads/courses/${req.file.filename}` : null
    });

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const { title, description, category, technology, difficulty, duration, isActive } = req.body;

    await course.update({
      title: title || course.title,
      description: description || course.description,
      category: category || course.category,
      technology: technology || course.technology,
      difficulty: difficulty || course.difficulty,
      duration: duration || course.duration,
      isActive: isActive !== undefined ? isActive : course.isActive,
      thumbnail: req.file ? `/uploads/courses/${req.file.filename}` : course.thumbnail
    });

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.update({ is_active: false });

    res.json({
      success: true,
      message: 'Course deactivated successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add material to course
// @route   POST /api/courses/:id/materials
// @access  Private/Admin
exports.addMaterial = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const { title, type, duration, orderIndex } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const material = await Material.create({
      courseId: course.id,
      title,
      type,
      fileUrl: `/uploads/materials/${req.file.filename}`,
      fileSize: req.file.size,
      duration,
      orderIndex
    });

    res.status(201).json({
      success: true,
      data: material
    });
  } catch (error) {
    console.error('Add material error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get course materials
// @route   GET /api/courses/:id/materials
// @access  Private
exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.findAll({
      where: { courseId: req.params.id },
      order: [['orderIndex', 'ASC']]
    });

    res.json({
      success: true,
      count: materials.length,
      data: materials
    });
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Assign course to trainee
// @route   POST /api/courses/:id/assign
// @access  Private/Admin
exports.assignCourse = async (req, res) => {
  try {
    const { traineeIds, dueDate } = req.body;

    if (!traineeIds || !Array.isArray(traineeIds) || traineeIds.length === 0) {
      return res.status(400).json({ message: 'Please provide trainee IDs' });
    }

    const course = await Course.findByPk(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const assignments = [];

    for (const traineeId of traineeIds) {
      const trainee = await User.findOne({
        where: { id: traineeId, role: 'trainee' }
      });

      if (!trainee) continue;

      // Check if already assigned
      const existing = await CourseAssignment.findOne({
        where: { courseId: course.id, traineeId }
      });

      if (!existing) {
        const assignment = await CourseAssignment.create({
          courseId: course.id,
          traineeId,
          assignedBy: req.user.id,
          dueDate
        });
        assignments.push(assignment);
      }
    }

    res.status(201).json({
      success: true,
      message: `Course assigned to ${assignments.length} trainee(s)`,
      data: assignments
    });
  } catch (error) {
    console.error('Assign course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get course statistics
// @route   GET /api/courses/:id/stats
// @access  Private/Admin
exports.getCourseStats = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: CourseAssignment,
          as: 'assignments',
          include: [{
            model: User,
            as: 'trainee',
            attributes: ['id', 'name', 'email']
          }]
        },
        {
          model: Material,
          as: 'materials'
        }
      ]
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const stats = {
      totalEnrolled: course.assignments.length,
      completed: course.assignments.filter(a => a.status === 'completed').length,
      inProgress: course.assignments.filter(a => a.status === 'in_progress').length,
      notStarted: course.assignments.filter(a => a.status === 'assigned').length,
      totalMaterials: course.materials.length,
      completionRate: course.assignments.length > 0 
        ? ((course.assignments.filter(a => a.status === 'completed').length / course.assignments.length) * 100).toFixed(2)
        : 0
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get course stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
