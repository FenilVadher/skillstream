#!/bin/bash

# ============================================
# Environment Setup Script
# ============================================

echo "🔧 Setting up environment configuration..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found. Run this from project root."
    exit 1
fi

# Navigate to backend
cd backend

# Check if .env already exists
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file already exists!${NC}"
    read -p "Do you want to overwrite it? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        echo "Skipping .env creation."
        exit 0
    fi
fi

# Create .env from example
if [ -f ".env.example" ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file from .env.example${NC}"
else
    echo "❌ .env.example not found!"
    exit 1
fi

echo ""
echo -e "${BLUE}📝 Configure your database settings:${NC}"
echo ""

# Prompt for database password
echo "Enter your MySQL password (press Enter if no password for XAMPP/MAMP):"
read -s DB_PASSWORD
echo ""

# Prompt for database port
echo "Enter MySQL port (default: 3306, MAMP usually: 8889):"
read DB_PORT
DB_PORT=${DB_PORT:-3306}

# Update .env file
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env
    sed -i '' "s/DB_PORT=.*/DB_PORT=$DB_PORT/" .env
else
    # Linux
    sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env
    sed -i "s/DB_PORT=.*/DB_PORT=$DB_PORT/" .env
fi

echo -e "${GREEN}✅ Updated database configuration${NC}"
echo ""

# Create upload directories
echo "Creating upload directories..."
mkdir -p uploads/courses uploads/materials uploads/avatars
echo -e "${GREEN}✅ Upload directories created${NC}"
echo ""

# Show configuration
echo -e "${BLUE}📋 Your configuration:${NC}"
echo "  Database: training_management_db"
echo "  Host: localhost"
echo "  Port: $DB_PORT"
echo "  User: root"
echo "  Password: $([ -z "$DB_PASSWORD" ] && echo "(empty)" || echo "***")"
echo ""

echo -e "${GREEN}🎉 Environment setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Install dependencies: npm install"
echo "  2. Start backend: npm run dev"
echo "  3. Open new terminal and start frontend"
echo ""
