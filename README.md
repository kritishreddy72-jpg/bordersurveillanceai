# AURA-BORDER AI: Tactical Border Surveillance & Subsurface Defense System

An AI Command & Control (C2) tactical defense platform and presentation system designed for next-generation border reconnaissance, subsurface tunnel digging detection, and adverse weather vision clarification.

---

## 🛡️ Core Capabilities & Requirements Implemented

1. **Only Human Detection via Video Frequency & Spatial Neural AI**:
   - Isolates human infiltrators from dynamic background noise.
   - Computes bounding boxes, limb velocities, and posture tracking.
   - Activates tactical audio sirens, flashing red alarm strobes, and automated Quick Reaction Force (QRF) dispatch.

2. **Underground Tunnel Digging Activity via Audio Frequency**:
   - Sub-surface Distributed Acoustic Sensing (DAS) and Geophone Array simulation (0 Hz - 4.0 kHz).
   - Real-time Fast Fourier Transform (FFT) spectrogram & seismic waveform oscilloscope.
   - Distinguishes manual pickaxe impacts (80 - 250 Hz rhythmic pulses) from high-speed rotary drills (1.2 - 3.5 kHz harmonics).
   - Subterranean depth estimation (*-8.4 meters underground*).

3. **Wildlife / Animal Discrimination (Silent SMS Protocol)**:
   - Identifies quadrupeds and fauna (wolves, deer, camels, livestock).
   - **STRICT RULE ENFORCED**: Completely suppresses tactical sirens and alarm strobes.
   - Sends a silent SATCOM/SMS log to wildlife rangers to avoid panicking border guards.

4. **AVF (Adaptive Vision Filtering) in Extreme Fog & Lightning**:
   - Atmospheric scattering restoration based on the Koschmieder model and Dark Channel Prior (DCP) dehazing.
   - Temporal Adaptive Clamping (AVF-TAC) to instantly suppress blinding lightning strikes and flare without losing track of targets.
   - Interactive split-slider for live before/after comparison.

5. **PPT Presentation View (`presentation.html`)**:
   - Dedicated presentation slides mode with mathematical formulations ($I(x) = J(x)t(x) + A(1-t(x))$), system architecture block diagrams, and benchmark performance comparison tables.

---

## 🚀 How to Run Locally

### Option 1: Direct Browser Launch
Simply double click on `index.html` or `presentation.html` in your file explorer to open it in Chrome, Edge, Firefox, or Safari.

### Option 2: Local Web Server (Recommended)
Open a terminal in this folder and run:
```bash
# Using Python
python -m http.server 8000

# Or using Node.js / npx
npx serve .
```
Then navigate to `http://localhost:8000` in your browser.

---

## 🌐 How to Deploy for a Live URL (For Your PPT Link)

To get a live link (e.g. `https://your-border-ai.vercel.app` or `https://username.github.io/ai-border-surveillance`) to paste into your PowerPoint slides:

### Method 1: Netlify Drop (Zero Installation - 30 Seconds)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop this entire `ai-border-surveillance` folder onto the web page.
3. Netlify will instantly give you a free public live link (e.g. `https://aura-border-ai.netlify.app`).

### Method 2: GitHub Pages (Permanent Free Hosting)
1. Create a new repository on [GitHub](https://github.com).
2. Upload this folder's contents and commit to the `main` branch.
3. Go to **Settings > Pages** in your GitHub repo and select **Deploy from Branch (main)**.
4. Your live link will be `https://<your-username>.github.io/<repo-name>`.

### Method 3: Vercel CLI
```bash
npx vercel
```
Follow the 3 quick prompts to get a fast production URL.

---

## 📋 How to Link in Your PowerPoint Presentation

1. In PowerPoint, create a button or text on your slide (e.g., `[ Click Here for Live AURA-BORDER AI Demo ]`).
2. Select the text/button and press `Ctrl + K` (or `Cmd + K` on Mac).
3. Paste your live deployment URL (or link to local `index.html`).
4. During your presentation, clicking this link will open the live dashboard.
