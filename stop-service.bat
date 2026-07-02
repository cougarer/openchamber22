@echo off
setlocal EnableExtensions

set "ROOT=%~dp0"
set "CLI=%ROOT%packages\web\bin\cli.js"
set "PORT=3000"

if not exist "%CLI%" (
  echo [ERROR] CLI entry not found: "%CLI%"
  exit /b 1
)

echo Stopping OpenChamber on port %PORT%
node "%CLI%" stop --port %PORT%
set "EXIT_CODE=%ERRORLEVEL%"

if not "%EXIT_CODE%"=="0" (
  echo [ERROR] Stop failed with exit code %EXIT_CODE%.
)

exit /b %EXIT_CODE%
