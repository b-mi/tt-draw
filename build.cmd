@echo off
call npm version patch
call ng deploy  --base-href=/tt-draw/ --no-silent
pause
