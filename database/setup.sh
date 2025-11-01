#!/bin/bash

# ============================================
# AI Training Management System - Database Setup Script
# ============================================

echo "🚀 Starting Database Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Database configuration
DB_NAME="training_management_db"
DB_USER="root"

# Prompt for MySQL password
echo -e "${YELLOW}Enter MySQL root password:${NC}"
read -s DB_PASSWORD
echo ""

# Test MySQL connection
echo "Testing MySQL connection..."
mysql -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to connect to MySQL. Please check your credentials.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ MySQL connection successful!${NC}"
echo ""

# Create database and schema
echo "Creating database and tables..."
mysql -u"$DB_USER" -p"$DB_PASSWORD" < schema.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database schema created successfully!${NC}"
else
    echo -e "${RED}❌ Failed to create database schema.${NC}"
    exit 1
fi

echo ""

# Insert seed data
echo "Inserting seed data..."
mysql -u"$DB_USER" -p"$DB_PASSWORD" < seed.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Seed data inserted successfully!${NC}"
else
    echo -e "${RED}❌ Failed to insert seed data.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Database setup completed successfully!${NC}"
echo ""
echo "Database Details:"
echo "  - Database Name: $DB_NAME"
echo "  - Tables Created: 11"
echo "  - Default Badges: 6"
echo ""
echo "Next Steps:"
echo "  1. Update backend/.env with your database credentials"
echo "  2. Start the backend server: cd backend && npm run dev"
echo "  3. Register admin and trainee users through the application"
echo ""
