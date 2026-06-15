@echo off
color 0B
echo ===================================================
echo   CONNECT SHIKSHA - LIVE WEBSITE UPDATER
echo ===================================================
echo.
echo [Step 1] Rebuilding the latest HTML from your data...
node build_html.js
echo.

echo [Step 2] Moving files to the 'deploy' folder...
if not exist "deploy" mkdir deploy
copy /Y Interactive_STEM_Lab_Guide.html deploy\index.html >nul
echo.

echo [Step 3] Uploading the new version to Netlify Server...
call npx netlify-cli deploy --dir=deploy --prod
echo.

echo ===================================================
echo   SUCCESS! The live website has been updated.
echo ===================================================
pause
