# 🛡️ AURA-BORDER AI - Autonomous Multi-Modal Border Surveillance Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20ES6+-cyan.svg)](frontend/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.10+-green.svg)](backend/)
[![Deploy](https://img.shields.io/badge/Deployment-Vercel%20%7C%20Netlify-purple.svg)](deployment/)

An enterprise defense Command and Control (C2) surveillance platform unifying **optical/thermal video frequency analysis**, **subsurface acoustic geophone detection (DAS)**, and **atmospheric vision filtering (AVF)** under an autonomous rule matrix.

---

## 📂 Segregated Project Structure

```
ai-border-surveillance/
├── frontend/                      # 🖥️ FRONTEND CLIENT LAYER
│   ├── index.html                 # Main C2 Defense Dashboard UI
│   ├── presentation.html          # Technical Architecture Slide Deck
│   ├── css/                       # Tactical Glassmorphism Styling
│   │   ├── style.css              # Base Layout & Tokens
│   │   └── tactical-ui.css        # Quad-Grid, Radar & HUD Components
│   └── js/                        # Client-Side Simulation & Math Engines
│       ├── alert-system.js        # Incident Routing & Silent Wildlife SMS
│       ├── app.js                 # Frontend Master UI Controller
│       ├── audio-synth.js         # Web Audio API Tactical Sound Synthesizer
│       ├── avf-filter.js          # Koschmieder DCP Fog & Flash Clamping
│       ├── seismic-audio.js       # Fast Fourier Transform (FFT) Spectrogram
│       └── vision-feed.js         # 4-Camera Array & CAM-MASTER Viewport
│
├── backend/                       # ⚙️ BACKEND & AI PROCESSING LAYER
│   ├── server.py                  # FastAPI / WebSocket Telemetry Server
│   ├── dsp_processor.py           # Seismic FFT & TDOA Triangulation Module
│   ├── server.ps1                 # Lightweight Windows .NET HTTP Server
│   └── requirements.txt           # Python Environment Dependencies
│
├── deployment/                    # 🚀 DEPLOYMENT & DEVOPS AUTOMATION
│   ├── auto_git_sync.ps1          # Real-time GitHub Auto-Sync Watcher
│   ├── start_auto_sync.bat        # 1-Click Batch Launcher for Auto-Sync
│   ├── start_server.bat           # 1-Click Local Server Launcher
│   └── vercel.json                # Edge Routing Configuration
│
├── docs/                          # 📚 DOCUMENTATION & SPECIFICATIONS
│   ├── ARCHITECTURE.md            # System Architecture & API Specifications
│   └── DATASETS.md                # Research Benchmark Dataset Citations
│
├── index.html                     # Root Entrypoint
├── vercel.json                    # Root Vercel Edge Router
└── README.md                      # Project Readme
```

---

## 🚀 Quick Start Guide

### 1. Running the Frontend Dashboard
Simply open [`frontend/index.html`](frontend/index.html) in any modern web browser or run:
```powershell
.\deployment\start_server.bat
```
Visit `http://localhost:8080` in your browser.

### 2. Running the Python Backend (Optional)
```bash
cd backend
pip install -r requirements.txt
python server.py
```
API Documentation will be live at `http://localhost:8000/docs`.

### 3. Real-Time GitHub Auto-Sync
Whenever you make changes, launch:
```powershell
.\deployment\start_auto_sync.bat
```
All file changes will be pushed directly to GitHub automatically in real time!
