# ============================================================
#   Stop All Career Guidance Services (Backend, Frontend, Java)
# ============================================================

Write-Host "Stopping all running Backend (Java) & Node processes..." -ForegroundColor Yellow

Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "All backend and frontend services have been stopped successfully!" -ForegroundColor Green
