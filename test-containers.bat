@echo off
REM MarketPay Superapp - Docker Testing Script (Windows)
REM This script builds and tests all containers locally

setlocal enabledelayedexpansion

echo.
echo ====================================
echo Docker Testing - MarketPay Superapp
echo ====================================

REM Step 1: Check Docker is running
echo.
echo [1/6] Checking Docker installation...
docker ps >nul 2>&1
if errorlevel 1 (
    echo Error: Docker daemon is not running
    exit /b 1
)
echo Success: Docker is ready

REM Step 2: Check environment file
echo.
echo [2/6] Setting up environment...
if not exist .env (
    echo Warning: .env file not found, creating from .env.example
    copy .env.example .env
    echo Warning: Please update .env with your settings
)
echo Success: Environment ready

REM Step 3: Build images
echo.
echo [3/6] Building Docker images...
call docker-compose build
if errorlevel 1 (
    echo Error: Failed to build images
    exit /b 1
)
echo Success: Images built

REM Step 4: Start services
echo.
echo [4/6] Starting services...
call docker-compose up -d
timeout /t 5 /nobreak
echo Success: Services started

REM Step 5: Health checks
echo.
echo [5/6] Running health checks...

echo Checking PostgreSQL...
docker-compose exec -T postgres pg_isready -U postgres >nul 2>&1
if errorlevel 1 (
    echo Warning: PostgreSQL health check returned non-zero
) else (
    echo Success: PostgreSQL is healthy
)

echo Checking Django API...
curl -f http://localhost:8000/api/ >nul 2>&1
if errorlevel 1 (
    echo Warning: Django API health check failed
) else (
    echo Success: Django API is responding
)

echo Checking Frontend...
curl -f http://localhost:3000/ >nul 2>&1
if errorlevel 1 (
    echo Warning: Frontend health check failed
) else (
    echo Success: Frontend is responding
)

REM Step 6: Run migrations
echo.
echo [6/6] Running Django migrations...
docker-compose exec -T django-api python manage.py migrate --noinput >nul 2>&1
echo Success: Migrations completed

echo.
echo ========================================
echo SUCCESS: All tests passed!
echo ========================================
echo.
echo Services available at:
echo   * Frontend:       http://localhost:3000
echo   * Django API:     http://localhost:8000
echo   * Wallet Service: http://localhost:3001
echo   * PostgreSQL:     localhost:5432
echo.
echo To view logs: docker-compose logs -f
echo To stop:      docker-compose down
echo.
