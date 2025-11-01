#!/bin/bash

# ============================================
# Git Commit Script - AI Training Management System
# ============================================

echo "🚀 Preparing to commit all project files..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository!"
    exit 1
fi

echo -e "${BLUE}📋 Current branch:${NC}"
git branch --show-current
echo ""

echo -e "${BLUE}📊 Files to be committed:${NC}"
git status --short
echo ""

# Add all files
echo -e "${YELLOW}Adding all files...${NC}"
git add .
echo -e "${GREEN}✅ Files staged${NC}"
echo ""

# Show what will be committed
echo -e "${BLUE}📦 Files staged for commit:${NC}"
git status --short
echo ""

# Commit with a descriptive message
echo -e "${YELLOW}Committing files...${NC}"
git commit -m "feat: Complete AI Training Management System

- Full-stack application (React + Node.js + MySQL)
- Backend API with Express.js and Sequelize ORM
- Frontend with React, Vite, TailwindCSS
- Database schema with 11 tables
- Authentication & Authorization (JWT)
- Admin module (courses, quizzes, trainees, reports)
- Trainee module (learning, progress, quizzes)
- Gamification engine (points, badges, levels, leaderboard)
- AI analytics & recommendations
- Report generation (PDF/Excel)
- Dark mode support
- Responsive design
- Complete documentation

Features:
- Role-based access control
- Course management with materials
- Quiz system with auto-grading
- Progress tracking
- Gamification with badges and leaderboard
- AI-powered recommendations
- Performance analytics
- Report generation
- File upload support
- Dark/Light theme toggle

Tech Stack:
- Backend: Node.js, Express, MySQL, Sequelize, JWT
- Frontend: React 18, Vite, TailwindCSS, Zustand, Axios
- Database: MySQL with 11 tables
- Features: 150+ implemented features"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Commit successful!${NC}"
    echo ""
    echo -e "${BLUE}📤 Ready to push to GitHub${NC}"
    echo ""
    echo "To push to GitHub, run:"
    echo -e "${YELLOW}git push origin fenil${NC}"
    echo ""
    echo "Or to push to main branch:"
    echo -e "${YELLOW}git checkout main${NC}"
    echo -e "${YELLOW}git merge fenil${NC}"
    echo -e "${YELLOW}git push origin main${NC}"
else
    echo ""
    echo -e "${RED}❌ Commit failed!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 All done!${NC}"
echo ""
