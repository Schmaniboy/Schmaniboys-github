@echo off
chcp 65001 >nul 2>&1
title CARONEX — Entwicklungsumgebung
color 0C

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║          CARONEX — Entwicklungsserver        ║
echo  ╚══════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

:: ──────────────────────────────────────────────
:: 1. Node.js pruefen
:: ──────────────────────────────────────────────
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [FEHLER] Node.js ist nicht installiert.
    echo           Bitte von https://nodejs.org herunterladen.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo  Node.js:    %NODE_VER%

:: ──────────────────────────────────────────────
:: 2. pnpm pruefen (oder npm als Fallback)
:: ──────────────────────────────────────────────
set PKG_MGR=pnpm
where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    echo  [HINWEIS] pnpm nicht gefunden, nutze npm.
    set PKG_MGR=npm
)
echo  Paketmanager: %PKG_MGR%

:: ──────────────────────────────────────────────
:: 3. PostgreSQL-Verbindung pruefen
:: ──────────────────────────────────────────────
if exist ".env" (
    echo  .env:       gefunden
) else (
    echo  [WARNUNG] Keine .env Datei gefunden!
    echo            Kopiere .env.example nach .env und trage
    echo            deine Datenbankverbindung ein.
    echo.
)

:: ──────────────────────────────────────────────
:: 4. Abhaengigkeiten installieren (falls noetig)
:: ──────────────────────────────────────────────
if not exist "node_modules" (
    echo.
    echo  Installiere Abhaengigkeiten...
    call %PKG_MGR% install
    if %errorlevel% neq 0 (
        echo  [FEHLER] Installation fehlgeschlagen.
        pause
        exit /b 1
    )
)

:: ──────────────────────────────────────────────
:: 5. Prisma-Client generieren
:: ──────────────────────────────────────────────
echo.
echo  Generiere Prisma-Client...
call %PKG_MGR% run db:generate
if %errorlevel% neq 0 (
    echo  [WARNUNG] Prisma-Client konnte nicht generiert werden.
    echo            Die Datenbank ist moeglicherweise nicht erreichbar.
)

:: ──────────────────────────────────────────────
:: 6. .env in apps/web kopieren (Next.js braucht sie dort)
:: ──────────────────────────────────────────────
if exist ".env" (
    if not exist "apps\web\.env" (
        copy ".env" "apps\web\.env" >nul
        echo  .env nach apps\web\ kopiert.
    )
)

:: ──────────────────────────────────────────────
:: 7. Datenbank-Migrationen ausfuehren
:: ──────────────────────────────────────────────
echo.
echo  Fuehre Datenbank-Migrationen aus...
call npx prisma migrate deploy --schema packages/db/prisma/schema.prisma
if %errorlevel% neq 0 (
    echo  [WARNUNG] Migration fehlgeschlagen — Datenbank laeuft?
)

:: ──────────────────────────────────────────────
:: 8. Server starten
:: ──────────────────────────────────────────────
echo.
echo  ════════════════════════════════════════════════
echo   Server wird gestartet...
echo   Nach dem Start oeffne: http://localhost:3000
echo   Zum Beenden: Strg+C druecken
echo  ════════════════════════════════════════════════
echo.

call %PKG_MGR% run dev

echo.
echo  Server beendet.
pause
