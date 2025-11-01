const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

class ReportGenerator {
  /**
   * Generate PDF report for trainee progress
   */
  static async generateTraineeReportPDF(traineeData, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(outputPath);

        doc.pipe(stream);

        // Header
        doc.fontSize(24).text('Training Progress Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
        doc.moveDown(2);

        // Trainee Information
        doc.fontSize(16).text('Trainee Information', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12);
        doc.text(`Name: ${traineeData.name}`);
        doc.text(`Email: ${traineeData.email}`);
        doc.text(`Total Points: ${traineeData.gamification?.totalPoints || 0}`);
        doc.text(`Rank: ${traineeData.gamification?.rank || 'N/A'}`);
        doc.text(`Level: ${traineeData.gamification?.level || 1}`);
        doc.moveDown(2);

        // Course Progress
        doc.fontSize(16).text('Course Progress', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12);
        
        if (traineeData.assignments && traineeData.assignments.length > 0) {
          traineeData.assignments.forEach((assignment, index) => {
            doc.text(`${index + 1}. ${assignment.course.title}`);
            doc.text(`   Status: ${assignment.status}`, { indent: 20 });
            doc.text(`   Category: ${assignment.course.category}`, { indent: 20 });
            if (assignment.completedAt) {
              doc.text(`   Completed: ${new Date(assignment.completedAt).toLocaleDateString()}`, { indent: 20 });
            }
            doc.moveDown(0.5);
          });
        } else {
          doc.text('No courses assigned yet.');
        }
        doc.moveDown(2);

        // Quiz Performance
        doc.fontSize(16).text('Quiz Performance', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12);
        
        if (traineeData.quizAttempts && traineeData.quizAttempts.length > 0) {
          doc.text(`Total Attempts: ${traineeData.quizAttempts.length}`);
          doc.text(`Average Score: ${traineeData.gamification?.averageScore || 0}%`);
          doc.text(`Quizzes Passed: ${traineeData.gamification?.quizzesPassed || 0}`);
          doc.moveDown(1);

          traineeData.quizAttempts.slice(0, 5).forEach((attempt, index) => {
            doc.text(`${index + 1}. ${attempt.quiz.title}`);
            doc.text(`   Score: ${attempt.percentage}%`, { indent: 20 });
            doc.text(`   Status: ${attempt.passed ? 'Passed' : 'Failed'}`, { indent: 20 });
            doc.text(`   Date: ${new Date(attempt.submittedAt).toLocaleDateString()}`, { indent: 20 });
            doc.moveDown(0.5);
          });
        } else {
          doc.text('No quiz attempts yet.');
        }
        doc.moveDown(2);

        // Badges
        if (traineeData.gamification?.badges && traineeData.gamification.badges.length > 0) {
          doc.fontSize(16).text('Earned Badges', { underline: true });
          doc.moveDown(0.5);
          doc.fontSize(12);
          
          traineeData.gamification.badges.forEach((badge, index) => {
            doc.text(`${index + 1}. ${badge.name}`);
            doc.text(`   Earned: ${new Date(badge.earnedAt).toLocaleDateString()}`, { indent: 20 });
            doc.moveDown(0.5);
          });
        }

        // Footer
        doc.fontSize(10).text(
          'This is an auto-generated report from AI Training Management System',
          50,
          doc.page.height - 50,
          { align: 'center' }
        );

        doc.end();

        stream.on('finish', () => {
          resolve(outputPath);
        });

        stream.on('error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Generate Excel report for multiple trainees
   */
  static async generateBulkReportExcel(traineesData, outputPath) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Trainee Report');

      // Define columns
      worksheet.columns = [
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Total Points', key: 'points', width: 15 },
        { header: 'Rank', key: 'rank', width: 15 },
        { header: 'Level', key: 'level', width: 10 },
        { header: 'Courses Completed', key: 'coursesCompleted', width: 20 },
        { header: 'Quizzes Attempted', key: 'quizzesAttempted', width: 20 },
        { header: 'Quizzes Passed', key: 'quizzesPassed', width: 20 },
        { header: 'Average Score', key: 'averageScore', width: 15 },
        { header: 'Badges Earned', key: 'badgesCount', width: 15 }
      ];

      // Style header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      };
      worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

      // Add data
      traineesData.forEach(trainee => {
        worksheet.addRow({
          name: trainee.name,
          email: trainee.email,
          points: trainee.gamification?.totalPoints || 0,
          rank: trainee.gamification?.rank || 'N/A',
          level: trainee.gamification?.level || 1,
          coursesCompleted: trainee.gamification?.coursesCompleted || 0,
          quizzesAttempted: trainee.gamification?.quizzesAttempted || 0,
          quizzesPassed: trainee.gamification?.quizzesPassed || 0,
          averageScore: trainee.gamification?.averageScore || 0,
          badgesCount: trainee.gamification?.badges?.length || 0
        });
      });

      // Auto-filter
      worksheet.autoFilter = {
        from: 'A1',
        to: 'J1'
      };

      await workbook.xlsx.writeFile(outputPath);
      return outputPath;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate course analytics report
   */
  static async generateCourseAnalyticsPDF(courseData, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(outputPath);

        doc.pipe(stream);

        // Header
        doc.fontSize(24).text('Course Analytics Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
        doc.moveDown(2);

        // Course Information
        doc.fontSize(16).text('Course Information', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12);
        doc.text(`Title: ${courseData.title}`);
        doc.text(`Category: ${courseData.category}`);
        doc.text(`Technology: ${courseData.technology || 'N/A'}`);
        doc.text(`Difficulty: ${courseData.difficulty}`);
        doc.moveDown(2);

        // Enrollment Statistics
        doc.fontSize(16).text('Enrollment Statistics', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12);
        doc.text(`Total Enrolled: ${courseData.assignments?.length || 0}`);
        doc.text(`Completed: ${courseData.assignments?.filter(a => a.status === 'completed').length || 0}`);
        doc.text(`In Progress: ${courseData.assignments?.filter(a => a.status === 'in_progress').length || 0}`);
        doc.moveDown(2);

        // Materials
        if (courseData.materials && courseData.materials.length > 0) {
          doc.fontSize(16).text('Course Materials', { underline: true });
          doc.moveDown(0.5);
          doc.fontSize(12);
          
          courseData.materials.forEach((material, index) => {
            doc.text(`${index + 1}. ${material.title} (${material.type})`);
          });
          doc.moveDown(2);
        }

        // Footer
        doc.fontSize(10).text(
          'This is an auto-generated report from AI Training Management System',
          50,
          doc.page.height - 50,
          { align: 'center' }
        );

        doc.end();

        stream.on('finish', () => {
          resolve(outputPath);
        });

        stream.on('error', (error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = ReportGenerator;
