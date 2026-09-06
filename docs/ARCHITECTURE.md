# AURA-BORDER AI - Technical Architecture & Specifications

## 1. System Overview
**AURA-BORDER AI** is an autonomous multi-modal border surveillance and subsurface defense platform. It combines optical/thermal video frequency analysis, subsurface acoustic geophone sensing (DAS), and atmospheric vision filtering (AVF) into a unified Command and Control (C2) matrix.

---

## 2. Directory Architecture & Layer Segregation

```
ai-border-surveillance/
├── frontend/                      # 🖥️ FRONTEND CLIENT LAYER
│   ├── index.html                 # Main C2 Defense Dashboard UI
│   ├── presentation.html          # Technical Architecture Slide Deck
│   ├── css/                       # Tactical Defense Glassmorphism Styling
│   │   ├── style.css              # Typography & Base Tokens
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
└── README.md                      # Project Readme & Overview
```

---

## 3. Operational Protocols

| Rule # | Condition | Sensor Trigger | Autonomous Actuation | Audio Level |
|---|---|---|---|---|
| **Rule 1** | Human Intrusion | Spatial Video AI | Two-Tone Tactical Siren + QRF Alert | **95 dB (High)** |
| **Rule 2** | Subsurface Digging | Acoustic Geophone DAS | Seismic Klaxon + 74.6m Camera Slew | **85 dB (Medium)** |
| **Rule 3** | Wildlife / Fauna | Species Classifier | Silent SMS to Forest Rangers | **0 dB (Muted)** |
| **Rule 4** | Adverse Weather | Atmospheric Sensor | AVF Dehaze + Lightning Clamp | **Passive** |
