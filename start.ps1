# ============================================================
#   Student Career Guidance Platform - Start Everything
#   Run this from c:\Agent-Project-\  as Administrator
# ============================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Student Career Guidance Platform" -ForegroundColor Cyan
Write-Host "  Starting All Services..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# --- Step 0: Stop any old backend/frontend processes ---
Write-Host "[0/3] Stopping previous instances..." -ForegroundColor Yellow
Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# --- Step 1: Start MySQL ---
Write-Host "[1/3] Checking MySQL..." -ForegroundColor Yellow
$mysql = Get-Service -Name "MySQL80" -ErrorAction SilentlyContinue
if ($mysql.Status -ne "Running") {
    Write-Host "      Starting MySQL80..." -ForegroundColor Yellow
    Start-Service MySQL80
    Start-Sleep -Seconds 3
    Write-Host "      MySQL80 Started!" -ForegroundColor Green
} else {
    Write-Host "      MySQL80 already running." -ForegroundColor Green
}

# --- Step 2: Start Backend in new terminal window ---
Write-Host ""
Write-Host "[2/3] Starting Backend (Spring Boot on port 8080)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "cd 'c:\Agent-Project-\backend'; Write-Host 'BACKEND STARTING...' -ForegroundColor Cyan; .\mvnw.cmd spring-boot:run"

Write-Host "      Backend window opened!" -ForegroundColor Green

# --- Step 3: Start Frontend in new terminal window ---
Write-Host ""
Write-Host "[3/3] Starting Frontend (Vite on port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", `
    "cd 'c:\Agent-Project-\frontend'; Write-Host 'FRONTEND STARTING...' -ForegroundColor Cyan; npm run dev"

Write-Host "      Frontend window opened!" -ForegroundColor Green

# --- Done ---
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend  -->  http://localhost:3000" -ForegroundColor White
Write-Host "  Backend   -->  http://localhost:8080/api" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Wait ~30 seconds for backend to boot up" -ForegroundColor Yellow
Write-Host ""
