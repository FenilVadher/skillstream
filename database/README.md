# 🗄️ Database Setup Guide

## Overview

This directory contains all database-related files for the AI Training Management System.

## Files

- **schema.sql** - Complete database schema with all 11 tables
- **seed.sql** - Initial seed data (default badges)
- **setup.sh** - Automated setup script for Mac/Linux
- **setup.bat** - Automated setup script for Windows
- **README.md** - This file

## Quick Setup

### Option 1: Automated Setup (Recommended)

#### Mac/Linux:
```bash
cd database
chmod +x setup.sh
./setup.sh
```

#### Windows:
```cmd
cd database
setup.bat
```

### Option 2: Manual Setup

#### Step 1: Create Database
```bash
mysql -u root -p
```

Then execute:
```sql
CREATE DATABASE training_management_db;
EXIT;
```

#### Step 2: Run Schema
```bash
mysql -u root -p training_management_db < schema.sql
```

#### Step 3: Run Seed Data
```bash
mysql -u root -p training_management_db < seed.sql
```

### Option 3: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. File → Open SQL Script → Select `schema.sql`
4. Execute the script (⚡ icon)
5. File → Open SQL Script → Select `seed.sql`
6. Execute the script

## Database Schema

### Tables Created (11 total):

1. **users** - User accounts (admin/trainee)
   - Stores user credentials and profile info
   - Role-based access control

2. **courses** - Course information
   - Course metadata (title, description, category, etc.)
   - Linked to creator (admin)

3. **materials** - Course materials
   - Video/PDF/Document files
   - Ordered content within courses

4. **course_assignments** - Course-trainee assignments
   - Tracks which courses are assigned to which trainees
   - Assignment status and completion

5. **progress** - Learning progress tracking
   - Material-level progress
   - Time spent and completion status

6. **quizzes** - Quiz definitions
   - Quiz metadata and settings
   - Linked to courses

7. **questions** - Quiz questions
   - MCQ questions with options
   - Correct answer tracking

8. **quiz_attempts** - Quiz submission records
   - Student answers and scores
   - Pass/fail status

9. **gamification** - Gamification data
   - Points, levels, ranks
   - Badges, streaks, statistics

10. **badges** - Badge definitions
    - Badge criteria and rewards
    - Rarity levels

11. **recommendations** - AI recommendations
    - Personalized course suggestions
    - Recommendation scores

## Default Data

### Badges (6 default):
- 🎯 **First Steps** - Complete 1 course (50 pts, Common)
- 📚 **Learning Enthusiast** - Complete 5 courses (200 pts, Rare)
- 🏆 **Quiz Master** - Pass 10 quizzes (300 pts, Epic)
- ⭐ **Point Collector** - Earn 1000 points (100 pts, Rare)
- 🔥 **Dedicated Learner** - 7-day streak (150 pts, Epic)
- 👑 **Legend** - Earn 5000 points (500 pts, Legendary)

## Verification

After setup, verify the database:

```bash
mysql -u root -p
```

```sql
USE training_management_db;

-- Show all tables
SHOW TABLES;

-- Should show 11 tables:
-- badges, course_assignments, courses, gamification, materials,
-- progress, questions, quiz_attempts, quizzes, recommendations, users

-- Check badges
SELECT * FROM badges;

-- Should show 6 default badges

-- Check table structure
DESCRIBE users;
DESCRIBE courses;
-- etc.
```

## Database Configuration

After creating the database, update your backend `.env` file:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=training_management_db
DB_USER=root
DB_PASSWORD=your_mysql_password
```

## Troubleshooting

### Error: Access denied
- Check MySQL username and password
- Ensure MySQL server is running
- Verify user has CREATE DATABASE privileges

### Error: Database already exists
```sql
DROP DATABASE training_management_db;
CREATE DATABASE training_management_db;
```

### Error: Table already exists
```sql
USE training_management_db;
DROP TABLE IF EXISTS recommendations, badges, gamification, 
    quiz_attempts, questions, quizzes, progress, 
    course_assignments, materials, courses, users;
```
Then run schema.sql again.

### Error: Foreign key constraint fails
- Ensure tables are created in the correct order (schema.sql handles this)
- Check that referenced tables exist
- Verify InnoDB engine is being used

## Database Maintenance

### Backup Database
```bash
mysqldump -u root -p training_management_db > backup.sql
```

### Restore Database
```bash
mysql -u root -p training_management_db < backup.sql
```

### Reset Database
```bash
mysql -u root -p
DROP DATABASE training_management_db;
CREATE DATABASE training_management_db;
EXIT;

mysql -u root -p training_management_db < schema.sql
mysql -u root -p training_management_db < seed.sql
```

## Security Notes

- Never commit database passwords to version control
- Use strong passwords for production
- Limit database user permissions in production
- Enable SSL for database connections in production
- Regular backups are recommended

## Next Steps

After database setup:

1. ✅ Database created and configured
2. ⏭️ Update `backend/.env` with database credentials
3. ⏭️ Start backend server: `cd backend && npm run dev`
4. ⏭️ Backend will auto-sync models with database
5. ⏭️ Register users through the application
6. ⏭️ Start using the system!

## Support

If you encounter issues:
1. Check MySQL is running: `mysql -V`
2. Verify credentials are correct
3. Check MySQL error logs
4. Ensure MySQL version >= 8.0
5. Review error messages carefully

---

**Database setup complete! 🎉**
