@echo off
title AURA-BORDER AI Local Defense Server
echo Starting AURA-BORDER AI on http://localhost:8080...
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
