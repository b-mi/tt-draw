@echo off
call npm version patch
call npm run deploy
pause
