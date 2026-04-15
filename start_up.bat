@echo off
SET APP_DIR=D:\AIRIRIO\railway-portal
SET BUILD_DIR=%APP_DIR%\.next

echo Entering directory: %APP_DIR%
cd /d "%APP_DIR%"

:: Check if the .next folder exists
if not exist "%BUILD_DIR%" (
    echo [INFO] No build found. Starting initial build...
    call npm run build
) else (
    echo [INFO] Build folder detected.
    set /p choice="Force a fresh build? (y/n): "
    if /I "%choice%"=="y" (
        echo [INFO] Rebuilding...
        call npm run build
    )
)

echo [INFO] Launching Next.js application...
call npm run start
pause