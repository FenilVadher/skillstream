#!/bin/bash

# ============================================
# Project Startup Script
# ============================================

echo "🚀 Starting AI Training Management System..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if backend .env exists
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ backend/.env not found!${NC}"
    echo "Please run: ./setup-env.sh first"
    exit 1
fi

echo -e "${BLUE}📋 Pre-flight checks...${NC}"
echo ""

# Check if node_modules exist
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Backend dependencies not installed${NC}"
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
    echo ""
fi

if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Frontend dependencies not installed${NC}"
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    echo ""
fi

# Check if upload directories exist
if [ ! -d "backend/uploads" ]; then
    echo "Creating upload directories..."
    mkdir -p backend/uploads/courses backend/uploads/materials backend/uploads/avatars
    echo -e "${GREEN}✅ Upload directories created${NC}"
    echo ""
fi

echo -e "${GREEN}✅ All checks passed!${NC}"
echo ""
echo -e "${BLUE}Starting servers...${NC}"
echo ""
echo "This will open two terminal windows:"
echo "  1. Backend server (port 5000)"
echo "  2. Frontend server (port 5173)"
echo ""
echo "Press Ctrl+C in each terminal to stop the servers"
echo ""
echo -e "${YELLOW}Starting in 3 seconds...${NC}"
sleep 3

# Start backend in new terminal
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'/backend\" && npm run dev"'

# Wait a bit for backend to start
sleep 2

# Start frontend in new terminal
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'/frontend\" && npm run dev"'

echo ""
echo -e "${GREEN}🎉 Servers starting!${NC}"
echo ""
echo "Access your application at:"
echo -e "${BLUE}http://localhost:5173${NC}"
echo ""
echo "Backend API:"
echo -e "${BLUE}http://localhost:5000/api${NC}"
echo ""
echo "Check the new terminal windows for server status."
echo ""
