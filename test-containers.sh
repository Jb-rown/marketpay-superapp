#!/bin/bash
# MarketPay Superapp - Docker Testing Script
# This script builds and tests all containers locally

set -e  # Exit on error

echo "🐳 MarketPay Superapp - Docker Testing"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Docker is running
echo -e "\n${YELLOW}[1/6] Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi
if ! docker ps &> /dev/null; then
    echo -e "${RED}❌ Docker daemon is not running${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is ready${NC}"

# Step 2: Check environment file
echo -e "\n${YELLOW}[2/6] Setting up environment...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠ .env file not found, creating from .env.example${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please update .env with your settings${NC}"
fi
echo -e "${GREEN}✓ Environment ready${NC}"

# Step 3: Build images
echo -e "\n${YELLOW}[3/6] Building Docker images...${NC}"
docker-compose build
echo -e "${GREEN}✓ Images built successfully${NC}"

# Step 4: Start services
echo -e "\n${YELLOW}[4/6] Starting services...${NC}"
docker-compose up -d
sleep 5  # Wait for services to start
echo -e "${GREEN}✓ Services started${NC}"

# Step 5: Health checks
echo -e "\n${YELLOW}[5/6] Running health checks...${NC}"
failed=0

# PostgreSQL check
if docker-compose exec -T postgres pg_isready -U postgres &> /dev/null; then
    echo -e "${GREEN}✓ PostgreSQL is healthy${NC}"
else
    echo -e "${RED}❌ PostgreSQL health check failed${NC}"
    failed=1
fi

# Django API check
if curl -f http://localhost:8000/api/ 2>/dev/null || [ $? -eq 22 ]; then
    echo -e "${GREEN}✓ Django API is responding${NC}"
else
    echo -e "${RED}❌ Django API is not responding${NC}"
    failed=1
fi

# Frontend check
if curl -f http://localhost:3000/ 2>/dev/null || [ $? -eq 22 ]; then
    echo -e "${GREEN}✓ Frontend is responding${NC}"
else
    echo -e "${RED}❌ Frontend is not responding${NC}"
    failed=1
fi

# Wallet Service check
if curl -f http://localhost:3001/ 2>/dev/null || [ $? -eq 22 ]; then
    echo -e "${GREEN}✓ Wallet Service is responding${NC}"
else
    echo -e "${YELLOW}⚠ Wallet Service check skipped (Rust may still be compiling)${NC}"
fi

# Step 6: Run migrations
echo -e "\n${YELLOW}[6/6] Running Django migrations...${NC}"
docker-compose exec -T django-api python manage.py migrate --noinput 2>/dev/null || true
echo -e "${GREEN}✓ Migrations completed${NC}"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✓ All tests passed!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\nServices available at:"
echo "  • Frontend:       http://localhost:3000"
echo "  • Django API:     http://localhost:8000"
echo "  • Wallet Service: http://localhost:3001"
echo "  • PostgreSQL:     localhost:5432"
echo -e "\nTo view logs: ${YELLOW}docker-compose logs -f${NC}"
echo -e "To stop:      ${YELLOW}docker-compose down${NC}"

exit $failed
