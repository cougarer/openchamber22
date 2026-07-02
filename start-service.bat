@echo off
setlocal EnableExtensions DisableDelayedExpansion

set "ROOT=%~dp0"
set "PASSWORD_FILE=%ROOT%password.txt"
set "CLI=%ROOT%packages\web\bin\cli.js"
set "PORT=3000"

if not exist "%PASSWORD_FILE%" (
  echo [ERROR] Missing password file: "%PASSWORD_FILE%"
  echo Please edit password.txt and set your password on the first line.
  exit /b 1
)

set /p OPENCHAMBER_UI_PASSWORD=<"%PASSWORD_FILE%"

if not defined OPENCHAMBER_UI_PASSWORD (
  echo [ERROR] password.txt is empty.
  echo Please put your password on the first line of password.txt.
  exit /b 1
)

if not exist "%CLI%" (
  echo [ERROR] CLI entry not found: "%CLI%"
  exit /b 1
)

echo Starting OpenChamber on http://0.0.0.0:%PORT% with LAN access enabled
node "%CLI%" serve --port %PORT% --lan
set "EXIT_CODE=%ERRORLEVEL%"

if not "%EXIT_CODE%"=="0" (
  echo [ERROR] Start failed with exit code %EXIT_CODE%.
)

exit /b %EXIT_CODE%
