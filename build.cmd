@echo off
call npm version patch
call ng deploy 
rem --base-href=tt-draw
pause
