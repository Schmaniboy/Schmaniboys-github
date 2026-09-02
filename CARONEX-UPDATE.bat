@echo off
chcp 65001 >nul 2>&1
title CARONEX — Update
color 0E

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║           CARONEX — Projekt-Update           ║
echo  ╚══════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

:: ──────────────────────────────────────────────
:: 1. Git pruefen
:: ──────────────────────────────────────────────
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo  [FEHLER] Git ist nicht installiert.
    echo           Bitte von https://git-scm.com herunterladen.
    echo.
    pause
    exit /b 1
)

:: ──────────────────────────────────────────────
:: 2. Aktuelle Aenderungen sichern
:: ──────────────────────────────────────────────
echo  Pruefe lokale Aenderungen...
git stash >nul 2>&1
set STASHED=%errorlevel%

:: ──────────────────────────────────────────────
:: 3. Neusten Stand vom Server holen
:: ──────────────────────────────────────────────
echo  Hole neuesten Stand von GitHub...
echo.
git pull origin main
if %errorlevel% neq 0 (
    echo.
    echo  [FEHLER] Git pull fehlgeschlagen.
    echo           Pruefe deine Internetverbindung.
    if %STASHED% equ 0 (
        git stash pop >nul 2>&1
    )
    pause
    exit /b 1
)

:: ──────────────────────────────────────────────
:: 4. Gesicherte Aenderungen wiederherstellen
:: ──────────────────────────────────────────────
if %STASHED% equ 0 (
    echo.
    echo  Stelle lokale Aenderungen wieder her...
    git stash pop
)

:: ──────────────────────────────────────────────
:: 5. Paketmanager erkennen
:: ──────────────────────────────────────────────
set PKG_MGR=pnpm
where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    set PKG_MGR=npm
)

:: ──────────────────────────────────────────────
:: 6. Abhaengigkeiten aktualisieren
:: ──────────────────────────────────────────────
echo.
echo  Aktualisiere Abhaengigkeiten...
call %PKG_MGR% install
if %errorlevel% neq 0 (
    echo  [WARNUNG] Abhaengigkeiten konnten nicht aktualisiert werden.
)

:: ──────────────────────────────────────────────
:: 7. Prisma-Client neu generieren
:: ──────────────────────────────────────────────
echo.
echo  Generiere Prisma-Client...
call %PKG_MGR% run db:generate

:: ──────────────────────────────────────────────
:: 8. Datenbank-Migrationen ausfuehren
:: ──────────────────────────────────────────────
echo.
echo  Fuehre Datenbank-Migrationen aus...
call npx prisma migrate deploy --schema packages/db/prisma/schema.prisma
if %errorlevel% neq 0 (
    echo  [WARNUNG] Migration fehlgeschlagen — Datenbank laeuft?
)

:: ──────────────────────────────────────────────
:: 9. .env synchronisieren
:: ──────────────────────────────────────────────
if exist ".env" (
    copy ".env" "apps\web\.env" >nul
    echo  .env nach apps\web\ synchronisiert.
)

:: ──────────────────────────────────────────────
:: 10. TypeScript pruefen
:: ──────────────────────────────────────────────
echo.
echo  Pruefe TypeScript...
call %PKG_MGR% run typecheck
if %errorlevel% neq 0 (
    echo  [WARNUNG] TypeScript-Fehler gefunden.
    echo            Bitte vor dem Start beheben.
) else (
    echo  TypeScript: OK
)

:: ──────────────────────────────────────────────
:: 11. Build pruefen
:: ──────────────────────────────────────────────
echo.
echo  Pruefe Build...
call %PKG_MGR% run build
if %errorlevel% neq 0 (
    echo  [WARNUNG] Build fehlgeschlagen.
    echo            Bitte vor dem Start beheben.
) else (
    echo  Build: OK
)

echo.
echo  ════════════════════════════════════════════════
echo   Update abgeschlossen!
echo.
echo   Starte den Server mit: CARONEX-START.bat
echo  ════════════════════════════════════════════════
echo.
pause
