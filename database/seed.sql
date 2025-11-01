-- ============================================
-- AI Training Management System - Seed Data
-- ============================================

USE training_management_db;

-- ============================================
-- Insert Default Badges
-- ============================================
INSERT INTO badges (name, description, icon, criteria, points, rarity) VALUES
('First Steps', 'Complete your first course', '🎯', '{"type":"courses_completed","value":1}', 50, 'common'),
('Learning Enthusiast', 'Complete 5 courses', '📚', '{"type":"courses_completed","value":5}', 200, 'rare'),
('Quiz Master', 'Pass 10 quizzes', '🏆', '{"type":"quizzes_passed","value":10}', 300, 'epic'),
('Point Collector', 'Earn 1000 points', '⭐', '{"type":"points","value":1000}', 100, 'rare'),
('Dedicated Learner', 'Maintain a 7-day streak', '🔥', '{"type":"streak","value":7}', 150, 'epic'),
('Legend', 'Earn 5000 points', '👑', '{"type":"points","value":5000}', 500, 'legendary')
ON DUPLICATE KEY UPDATE name=name;

-- ============================================
-- Insert Sample Admin User
-- Password: admin123 (hashed with bcrypt)
-- ============================================
INSERT INTO users (name, email, password, role, is_active) VALUES
('Admin User', 'admin@example.com', '$2a$10$YourHashedPasswordHere', 'admin', TRUE)
ON DUPLICATE KEY UPDATE name=name;

-- Note: The actual password hash will be generated when you register through the application
-- The above is just a placeholder. Use the registration endpoint to create real users.

-- ============================================
-- Insert Sample Courses (Optional)
-- ============================================
-- Uncomment below to add sample courses after creating an admin user

/*
INSERT INTO courses (title, description, category, technology, difficulty, created_by) VALUES
('Introduction to React', 'Learn the basics of React.js', 'Web Development', 'React', 'beginner', 1),
('Advanced JavaScript', 'Master advanced JavaScript concepts', 'Programming', 'JavaScript', 'advanced', 1),
('Node.js Fundamentals', 'Build backend applications with Node.js', 'Backend Development', 'Node.js', 'intermediate', 1),
('MySQL Database Design', 'Learn database design and optimization', 'Database', 'MySQL', 'intermediate', 1),
('Python for Beginners', 'Start your journey with Python', 'Programming', 'Python', 'beginner', 1);
*/

-- ============================================
-- Success Message
-- ============================================
SELECT 'Seed data inserted successfully!' AS message;
SELECT 'Default badges created. Use the application to create users and courses.' AS note;
