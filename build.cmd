@echo off
call versionchanger --angular
call ng deploy --base-href=/tt-draw/ --no-silent
rem call npm run deploy
pause
