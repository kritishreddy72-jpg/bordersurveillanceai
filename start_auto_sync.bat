@echo off
title AURA-BORDER AI - GitHub Auto-Sync Watcher
echo Starting Real-Time GitHub Auto-Sync Watcher...
powershell -ExecutionPolicy Bypass -File "%~dp0auto_git_sync.ps1"
pause
