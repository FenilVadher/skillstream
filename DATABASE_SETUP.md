# 🗄️ Complete Database Setup Instructions

## 📋 Database Overview

The AI Training Management System uses **MySQL** with **11 tables** to store all data including users, courses, quizzes, progress, gamification, and AI recommendations.

## 🚀 Quick Setup (3 Methods)

### Method 1: Automated Script (Easiest) ⭐

#### For Mac/Linux:
```bash
cd database
chmod +x setup.sh
./setup.sh
```

#### For Windows:
```cmd
cd database
setup.bat
```

The script will:
- ✅ Test MySQL connection
- ✅ Create database `training_management_db`
- ✅ Create all 11 tables
- ✅ Insert default badges
- ✅ Show success confirmation

---

### Method 2: Manual SQL Execution

#### Step 1: Login to MySQL
```bash
mysql -u root -p
# Enter your MySQL password
```

#### Step 2: Create Database
```sql
CREATE DATABASE training_management_db;
USE training_management_db;
```

#### Step 3: Exit and Run Schema
```bash
exit
mysql -u root -p training_management_db < database/schema.sql
```

#### Step 4: Insert Seed Data
```bash
mysql -u root -p training_management_db < database/seed.sql
```

---

### Method 3: Using MySQL Workbench (GUI)

1. **Open MySQL Workbench**
2. **Connect** to your MySQL server
3. **Create Database:**
   - Right-click on Schemas → Create Schema
   - Name: `training_management_db`
   - Click Apply

4. **Run Schema Script:**
   - File → Open SQL Script
   - Navigate to `database/schema.sql`
   - Click Execute (⚡ icon)

5. **Run Seed Script:**
   - File → Open SQL Script
   - Navigate to `database/seed.sql`
   - Click Execute (⚡ icon)

---

## 📊 Database Structure

### Tables Created (11):

| # | Table Name | Purpose | Records |
|---|------------|---------|---------|
| 1 | `users` | User accounts (admin/trainee) | Dynamic |
| 2 | `courses` | Course information | Dynamic |
| 3 | `materials` | Course content (video/PDF) | Dynamic |
| 4 | `course_assignments` | Course-trainee mapping | Dynamic |
| 5 | `progress` | Learning progress tracking | Dynamic |
| 6 | `quizzes` | Quiz definitions | Dynamic |
| 7 | `questions` | Quiz questions | Dynamic |
| 8 | `quiz_attempts` | Quiz submissions | Dynamic |
| 9 | `gamification` | Points, levels, badges | Dynamic |
| 10 | `badges` | Badge definitions | 6 default |
| 11 | `recommendations` | AI course suggestions | Dynamic |

### Entity Relationships:

```
users (admin/trainee)
  ├── courses (created_by)
  ├── course_assignments (trainee_id, assigned_by)
  ├── progress (trainee_id)
  ├── quiz_attempts (trainee_id)
  ├── gamification (trainee_id) [1:1]
  └── recommendations (trainee_id)

courses
  ├── materials (course_id)
  ├── quizzes (course_id)
  ├── course_assignments (course_id)
  └── progress (course_id)

quizzes
  ├── questions (quiz_id)
  └── quiz_attempts (quiz_id)

materials
  └── progress (material_id)
```

---

## ✅ Verification Steps

After running the setup, verify everything is correct:

### 1. Check Database Exists
```bash
mysql -u root -p -e "SHOW DATABASES LIKE 'training_management_db';"
```

### 2. Check All Tables
```bash
mysql -u root -p training_management_db -e "SHOW TABLES;"
```

**Expected Output:**
```
+------------------------------------+
| Tables_in_training_management_db   |
+------------------------------------+
| badges                             |
| course_assignments                 |
| courses                            |
| gamification                       |
| materials                          |
| progress                           |
| questions                          |
| quiz_attempts                      |
| quizzes                            |
| recommendations                    |
| users                              |
+------------------------------------+
```

### 3. Check Default Badges
```bash
mysql -u root -p training_management_db -e "SELECT name, rarity, points FROM badges;"
```

**Expected Output:**
```
+----------------------+-----------+--------+
| name                 | rarity    | points |
+----------------------+-----------+--------+
| First Steps          | common    |     50 |
| Learning Enthusiast  | rare      |    200 |
| Quiz Master          | epic      |    300 |
| Point Collector      | rare      |    100 |
| Dedicated Learner    | epic      |    150 |
| Legend               | legendary |    500 |
+----------------------+-----------+--------+
```

### 4. Check Table Structure (Example)
```bash
mysql -u root -p training_management_db -e "DESCRIBE users;"
```

---

## ⚙️ Configure Backend

After database setup, update your backend configuration:

### 1. Navigate to Backend
```bash
cd backend
```

### 2. Create .env File
```bash
cp .env.example .env
```

### 3. Edit .env File
```bash
nano .env  # or use any text editor
```

### 4. Update Database Credentials
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=training_management_db
DB_USER=root
DB_PASSWORD=your_actual_mysql_password

# Other settings
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

---

## 🔄 Database Auto-Sync

The backend uses **Sequelize ORM** which will:
- ✅ Automatically connect to the database
- ✅ Sync models with tables (in development mode)
- ✅ Create missing columns if needed
- ✅ Validate data types

When you start the backend server:
```bash
cd backend
npm run dev
```

You should see:
```
✅ Database connection established successfully.
✅ Database synchronized
🚀 Server running on port 5000 in development mode
```

---

## 🎯 Default Data Included

### 6 Default Badges:

1. **🎯 First Steps**
   - Criteria: Complete 1 course
   - Points: 50
   - Rarity: Common

2. **📚 Learning Enthusiast**
   - Criteria: Complete 5 courses
   - Points: 200
   - Rarity: Rare

3. **🏆 Quiz Master**
   - Criteria: Pass 10 quizzes
   - Points: 300
   - Rarity: Epic

4. **⭐ Point Collector**
   - Criteria: Earn 1000 points
   - Points: 100
   - Rarity: Rare

5. **🔥 Dedicated Learner**
   - Criteria: 7-day streak
   - Points: 150
   - Rarity: Epic

6. **👑 Legend**
   - Criteria: Earn 5000 points
   - Points: 500
   - Rarity: Legendary

---

## 🛠️ Troubleshooting

### Issue 1: "Access denied for user"
**Solution:**
```bash
# Check MySQL is running
mysql -V

# Try connecting
mysql -u root -p

# If password is wrong, reset it:
# (Follow MySQL password reset procedure for your OS)
```

### Issue 2: "Database already exists"
**Solution:**
```bash
# Drop and recreate
mysql -u root -p -e "DROP DATABASE IF EXISTS training_management_db;"
mysql -u root -p -e "CREATE DATABASE training_management_db;"

# Then run schema again
mysql -u root -p training_management_db < database/schema.sql
```

### Issue 3: "Table already exists"
**Solution:**
```bash
# Reset all tables
mysql -u root -p training_management_db -e "
DROP TABLE IF EXISTS recommendations, badges, gamification, 
quiz_attempts, questions, quizzes, progress, 
course_assignments, materials, courses, users;"

# Then run schema again
mysql -u root -p training_management_db < database/schema.sql
```

### Issue 4: Backend can't connect to database
**Solution:**
1. Check MySQL is running: `mysql -V`
2. Verify credentials in `backend/.env`
3. Test connection: `mysql -u root -p training_management_db`
4. Check firewall settings
5. Ensure MySQL port 3306 is open

### Issue 5: "Unknown database"
**Solution:**
```bash
# Create database first
mysql -u root -p -e "CREATE DATABASE training_management_db;"

# Then run schema
mysql -u root -p training_management_db < database/schema.sql
```

---

## 📦 Database Files Location

```
HackX_DebugThugs/
└── database/
    ├── schema.sql      # Complete database schema (11 tables)
    ├── seed.sql        # Default data (6 badges)
    ├── setup.sh        # Auto-setup script (Mac/Linux)
    ├── setup.bat       # Auto-setup script (Windows)
    └── README.md       # Detailed documentation
```

---

## 🔐 Security Best Practices

### For Development:
- ✅ Use strong MySQL root password
- ✅ Keep `.env` file secure (never commit to git)
- ✅ Use localhost connections only

### For Production:
- ✅ Create dedicated MySQL user (not root)
- ✅ Grant minimal required permissions
- ✅ Use environment variables for credentials
- ✅ Enable SSL for database connections
- ✅ Regular database backups
- ✅ Use strong, unique passwords
- ✅ Restrict network access to database

---

## 💾 Backup & Restore

### Backup Database
```bash
# Full backup
mysqldump -u root -p training_management_db > backup_$(date +%Y%m%d).sql

# Backup structure only
mysqldump -u root -p --no-data training_management_db > structure.sql

# Backup data only
mysqldump -u root -p --no-create-info training_management_db > data.sql
```

### Restore Database
```bash
# Restore from backup
mysql -u root -p training_management_db < backup_20250101.sql
```

---

## 📈 Database Maintenance

### Check Database Size
```sql
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'training_management_db'
ORDER BY (data_length + index_length) DESC;
```

### Optimize Tables
```sql
USE training_management_db;
OPTIMIZE TABLE users, courses, materials, quizzes, questions, 
    quiz_attempts, progress, course_assignments, gamification, 
    badges, recommendations;
```

### Check Table Status
```sql
USE training_management_db;
SHOW TABLE STATUS;
```

---

## ✅ Complete Setup Checklist

- [ ] MySQL installed and running
- [ ] Database `training_management_db` created
- [ ] All 11 tables created successfully
- [ ] 6 default badges inserted
- [ ] `backend/.env` file configured with DB credentials
- [ ] Backend server connects to database successfully
- [ ] Tables verified using `SHOW TABLES;`
- [ ] Default badges verified using `SELECT * FROM badges;`

---

## 🎉 Next Steps

After successful database setup:

1. ✅ **Database Ready**
2. ⏭️ **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

3. ⏭️ **Start Frontend Server**
   ```bash
   cd frontend
   npm run dev
   ```

4. ⏭️ **Register Users**
   - Go to http://localhost:5173/register
   - Create admin account
   - Create trainee account

5. ⏭️ **Start Using the System!**
   - Admin: Create courses, quizzes, assign to trainees
   - Trainee: Access courses, take quizzes, earn badges

---

## 📞 Support

If you encounter any database issues:

1. Check MySQL is running: `systemctl status mysql` (Linux) or `brew services list` (Mac)
2. Verify credentials in `backend/.env`
3. Check MySQL error logs
4. Review the troubleshooting section above
5. Ensure MySQL version >= 8.0

---

**Database Setup Complete! 🎉**

Your AI Training Management System database is ready to use!
