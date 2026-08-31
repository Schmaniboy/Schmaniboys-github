@echo off
title CARONEX Dev Server
echo.
echo  ========================================
echo   CARONEX Development Server
echo  ========================================
echo.
echo  Starte den Entwicklungsserver...
echo  Nach dem Start oeffne: http://localhost:3000
echo.
echo  Zum Beenden: Strg+C druecken
echo  ========================================
echo.

cd /d "%~dp0"
pnpm dev
pause
