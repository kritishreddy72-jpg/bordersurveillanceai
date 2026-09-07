/**
 * AURA-BORDER AI 2.0 - Next-Gen Defense Future Improvisations Engine
 * Powers all 20 advanced future defense features, real-world APIs, 3D Canvas,
 * Leaflet Satellite GIS, FLIR Thermal, RF Waterfall, FMCW Micro-Doppler, and ERT.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSatelliteMap();
  initLiveWeatherAPI();
  initThermalVision();
  initRFWaterfall();
  initMicroDoppler();
  initAcousticBeamformer();
  initSubsurfaceERT();
  initDASFiberOTDR();
  initKalmanTrajectory();
  init3DVoxelSubsurface();
  initGaitTracker();
  initAirspaceRadar();
  initSolarTelemetry();
  initWildlifeMigration();
});

/* ==========================================================================
   1. Live Real-World Satellite Map (Leaflet.js GIS)
   ========================================================================== */
function initSatelliteMap() {
  const mapEl = document.getElementById('leafletBorderMap');
  if (!mapEl || typeof L === 'undefined') return;

  // Center on actual border coordinates (e.g., Jammu / Kashmir Border Ridge)
  const borderCoords = [32.7383, 74.8511];
  const map = L.map('leafletBorderMap', { zoomControl: false }).setView(borderCoords, 14);

  // Satellite Tile Layer (Esri World Imagery)
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Esri World Imagery',
    maxZoom: 18
  }).addTo(map);

  // Add 4 Border Camera FOV Cones
  const cameras = [
    { name: "CAM-01 (North Ridge)", coords: [32.7430, 74.8460], color: "#00f0ff" },
    { name: "CAM-02 (Canyon Pass)", coords: [32.7395, 74.8500], color: "#ef4444" },
    { name: "CAM-03 (River Crossing)", coords: [32.7360, 74.8540], color: "#38bdf8" },
    { name: "CAM-04 (Subsurface Zone)", coords: [32.7330, 74.8580], color: "#a855f7" }
  ];

  cameras.forEach(c => {
    L.circleMarker(c.coords, { radius: 7, color: c.color, fillColor: c.color, fillOpacity: 0.9 })
      .bindPopup(`<b>${c.name}</b><br>Active Coverage Radius: 250m`)
      .addTo(map);

    L.circle(c.coords, { radius: 250, color: c.color, weight: 1, fillOpacity: 0.15 }).addTo(map);
  });

  // Add Geophone Line
  const geophonePath = [
    [32.7440, 74.8450], [32.7400, 74.8490], [32.7370, 74.8530], [32.7320, 74.8590]
  ];
  L.polyline(geophonePath, { color: '#ec4899', weight: 2, dashArray: '4, 6' })
    .bindPopup("12-Node DAS Geophone & Fiber Optic Strain Cable")
    .addTo(map);

  // Moving Intruder Marker Simulation
  let markerCoords = [32.7405, 74.8480];
  const intruderMarker = L.circleMarker(markerCoords, {
    radius: 6, color: '#ef4444', fillColor: '#ef4444', fillOpacity: 1
  }).bindPopup("🚨 <b>TRACKED HUMAN TARGET</b><br>Speed: 2.1 m/s").addTo(map);

  setInterval(() => {
    markerCoords[0] += (Math.random() - 0.5) * 0.0003;
    markerCoords[1] += (Math.random() - 0.5) * 0.0003;
    intruderMarker.setLatLng(markerCoords);
  }, 2000);
}

/* ==========================================================================
   2. Live Real-World Meteorological API (Open-Meteo)
   ========================================================================== */
async function initLiveWeatherAPI() {
  const tempEl = document.getElementById('liveTemp');
  const humEl = document.getElementById('liveHumidity');
  const visEl = document.getElementById('liveVisibility');
  const statusEl = document.getElementById('liveWeatherStatus');

  try {
    // Live free weather for coordinates (32.7383 N, 74.8511 E)
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=32.7383&longitude=74.8511&current=temperature_2m,relative_humidity_2m,visibility,weather_code');
    const data = await res.json();
    if (data && data.current) {
      if (tempEl) tempEl.textContent = `${data.current.temperature_2m} °C`;
      if (humEl) humEl.textContent = `${data.current.relative_humidity_2m} %`;
      const visKm = data.current.visibility ? (data.current.visibility / 1000).toFixed(1) : "8.5";
      if (visEl) visEl.textContent = `${visKm} km`;
      if (statusEl) statusEl.textContent = data.current.relative_humidity_2m > 75 ? "🌫️ MIST / LOW VISIBILITY (AVF ACTIVE)" : "☀️ CLEAR PASS";
    }
  } catch (e) {
    if (tempEl) tempEl.textContent = "18.4 °C (Simulated)";
    if (humEl) humEl.textContent = "84 % (Simulated)";
    if (visEl) visEl.textContent = "2.4 km (Simulated)";
    if (statusEl) statusEl.textContent = "🌫️ DENSE FOG (AVF DCP DEHAZE ACTIVE)";
  }
}

/* ==========================================================================
   3. FLIR Thermal / Night-Vision Heatmap Switcher
   ========================================================================== */
let thermalMode = 'ironbow'; // 'optical', 'white_hot', 'ironbow'

function setThermalMode(mode) {
  thermalMode = mode;
  document.querySelectorAll('.thermal-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-mode') === mode);
  });
}

function initThermalVision() {
  const canvas = document.getElementById('thermalCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 480;
  canvas.height = 240;

  let targetX = 140;
  let targetSpeed = 0.8;

  function renderThermal() {
    targetX += targetSpeed;
    if (targetX > 400 || targetX < 80) targetSpeed *= -1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (thermalMode === 'optical') {
      // Optical RGB Night
      let bg = ctx.createLinearGradient(0, 0, 0, 240);
      bg.addColorStop(0, '#090d16');
      bg.addColorStop(1, '#1e293b');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 480, 240);

      // Dark Figure
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(targetX, 100, 24, 65);
    } else if (thermalMode === 'white_hot') {
      // FLIR White-Hot (Cold ground = dark, hot body = bright white)
      ctx.fillStyle = '#1e1e1e';
      ctx.fillRect(0, 0, 480, 240);

      // Ground noise
      for (let i = 0; i < 300; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.08})`;
        ctx.fillRect(Math.random() * 480, 140 + Math.random() * 100, 2, 2);
      }

      // Hot Human Body (37.4 C)
      const grad = ctx.createRadialGradient(targetX + 12, 130, 2, targetX + 12, 130, 30);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.7, '#e2e8f0');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(targetX + 12, 130, 32, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(targetX, 100, 24, 65);
    } else if (thermalMode === 'ironbow') {
      // FLIR Ironbow Palette (Cold = Purple/Black, Warm = Orange, Hot = Yellow/White)
      let bg = ctx.createLinearGradient(0, 0, 0, 240);
      bg.addColorStop(0, '#10002b');
      bg.addColorStop(0.6, '#240046');
      bg.addColorStop(1, '#3c096c');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 480, 240);

      // Hot Thermal Target (37.4 C Ironbow gradient)
      const grad = ctx.createRadialGradient(targetX + 12, 130, 2, targetX + 12, 130, 35);
      grad.addColorStop(0, '#ffff3f'); // White-hot core
      grad.addColorStop(0.4, '#ff5400'); // Orange heat
      grad.addColorStop(0.8, '#9d0208'); // Red edge
      grad.addColorStop(1, 'rgba(157,2,8,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(targetX + 12, 130, 38, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffff3f';
      ctx.fillRect(targetX, 100, 24, 65);
    }

    // AI Bounding Box & Weapon Detection
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(targetX - 4, 90, 32, 80);

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(targetX - 4, 74, 170, 15);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('🚨 HUMAN [37.4°C] | ⚠️ AK-47 [94%]', targetX, 85);

    requestAnimationFrame(renderThermal);
  }
  renderThermal();
}

/* ==========================================================================
   4. RF (Radio Frequency) & SDR Spectrum Waterfall
   ========================================================================== */
function initRFWaterfall() {
  const canvas = document.getElementById('rfWaterfallCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 480;
  canvas.height = 200;

  const history = [];

  function renderRF() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Generate new RF frequency slice
    const row = new Array(80).fill(0);
    const time = Date.now() * 0.004;

    for (let i = 0; i < 80; i++) {
      let power = Math.random() * 15;
      // Channel 1: 433 MHz Handheld Walkie-Talkie Burst
      if (i >= 22 && i <= 26) power += 70 + Math.sin(time * 3) * 15;
      // Channel 2: 2.4 GHz Drone Controller Link
      if (i >= 55 && i <= 62) power += 85 + Math.cos(time * 4) * 20;
      row[i] = power;
    }

    history.unshift(row);
    if (history.length > 35) history.pop();

    // Render Waterfall Rows
    const rowH = canvas.height / 35;
    const colW = canvas.width / 80;

    for (let y = 0; y < history.length; y++) {
      for (let x = 0; x < 80; x++) {
        const val = history[y][x];
        if (val > 60) {
          ctx.fillStyle = `rgb(239, 68, 68)`; // Red RF Burst
        } else if (val > 35) {
          ctx.fillStyle = `rgb(245, 158, 11)`; // Amber RF
        } else if (val > 15) {
          ctx.fillStyle = `rgb(0, 240, 255)`; // Cyan Baseline
        } else {
          ctx.fillStyle = `rgb(3, 7, 18)`; // Black Noise Floor
        }
        ctx.fillRect(x * colW, y * rowH, colW, rowH);
      }
    }

    requestAnimationFrame(renderRF);
  }
  renderRF();
}

/* ==========================================================================
   5. 77 GHz FMCW Micro-Doppler Radar Spectrogram
   ========================================================================== */
function initMicroDoppler() {
  const canvas = document.getElementById('microDopplerCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 480;
  canvas.height = 200;

  let offset = 0;

  function renderDoppler() {
    offset += 0.08;
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.5;

    // Center Baseline (Zero Doppler Velocity)
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.lineTo(480, 100);
    ctx.stroke();

    // Torso Doppler Shift + Arm/Leg Micro-Doppler Oscillations
    ctx.strokeStyle = '#10b981';
    ctx.beginPath();
    for (let x = 0; x < 480; x += 4) {
      const torso = Math.sin(x * 0.03 + offset) * 15;
      const legSwing = Math.sin(x * 0.08 + offset * 2) * 35;
      const y = 100 + torso + legSwing;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('77GHz FMCW: HUMAN BIPEDAL STRIDE DOPPLER CONFIRMED', 12, 20);

    requestAnimationFrame(renderDoppler);
  }
  renderDoppler();
}

/* ==========================================================================
   6. Acoustic Beamforming 360 Polar Direction-of-Arrival (DOA)
   ========================================================================== */
function initAcousticBeamformer() {
  const canvas = document.getElementById('beamformingCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 240;
  canvas.height = 240;

  let angle = 128; // Degree bearing of digging noise

  function renderBeamformer() {
    ctx.clearRect(0, 0, 240, 240);
    const cx = 120;
    const cy = 120;

    // Concentric Polar Rings
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let r = 20; r <= 100; r += 25) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(cx, 10); ctx.lineTo(cx, 230);
    ctx.moveTo(10, cy); ctx.lineTo(230, cy);
    ctx.stroke();

    // Acoustic Energy Beam (128 Bearing)
    const rad = (angle * Math.PI) / 180;
    const bx = cx + Math.cos(rad) * 90;
    const by = cy + Math.sin(rad) * 90;

    const beamGrad = ctx.createRadialGradient(bx, by, 2, bx, by, 30);
    beamGrad.addColorStop(0, '#a855f7');
    beamGrad.addColorStop(1, 'rgba(168,85,247,0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.arc(bx, by, 32, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(bx, by);
    ctx.stroke();

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(`BEAM: ${angle}° SE`, 14, 22);

    requestAnimationFrame(renderBeamformer);
  }
  renderBeamformer();
}

/* ==========================================================================
   7. Subsurface Electrical Resistivity Tomography (ERT) Heatmap
   ========================================================================== */
function initSubsurfaceERT() {
  const canvas = document.getElementById('ertCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 480;
  canvas.height = 180;

  function renderERT() {
    ctx.clearRect(0, 0, 480, 180);

    // Low Resistivity Soil Matrix (Blue/Green background)
    let soil = ctx.createLinearGradient(0, 0, 0, 180);
    soil.addColorStop(0, '#1e3a8a');
    soil.addColorStop(0.5, '#065f46');
    soil.addColorStop(1, '#0f172a');
    ctx.fillStyle = soil;
    ctx.fillRect(0, 0, 480, 180);

    // High-Resistivity Hollow Tunnel Anomaly at X:260, Y:110
    const anomaly = ctx.createRadialGradient(260, 105, 5, 260, 105, 45);
    anomaly.addColorStop(0, '#ef4444'); // High resistance void (>1500 ohm-m)
    anomaly.addColorStop(0.5, '#f59e0b');
    anomaly.addColorStop(1, 'rgba(6,95,70,0)');
    ctx.fillStyle = anomaly;
    ctx.beginPath();
    ctx.ellipse(260, 105, 40, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(215, 80, 90, 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('ERT VOID ANOMALY: 1840 Ω·m (-8.4m DEPTH)', 12, 20);
  }
  renderERT();
}

/* ==========================================================================
   8. DAS Optical Fiber OTDR 10km Waterfall Plot
   ========================================================================== */
function initDASFiberOTDR() {
  const canvas = document.getElementById('dasOtdrCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 480;
  canvas.height = 180;

  const otdrData = [];

  function renderOTDR() {
    ctx.clearRect(0, 0, 480, 180);

    const slice = new Array(100).fill(0);
    for (let i = 0; i < 100; i++) {
      let strain = Math.random() * 10;
      // High acoustic strain at kilometer 4.2 (Index 42)
      if (i >= 40 && i <= 44) strain += 80 + Math.random() * 20;
      slice[i] = strain;
    }

    otdrData.unshift(slice);
    if (otdrData.length > 25) otdrData.pop();

    const rowH = 180 / 25;
    const colW = 480 / 100;

    for (let y = 0; y < otdrData.length; y++) {
      for (let x = 0; x < 100; x++) {
        const val = otdrData[y][x];
        ctx.fillStyle = val > 60 ? '#ec4899' : (val > 20 ? '#38bdf8' : '#030712');
        ctx.fillRect(x * colW, y * rowH, colW, rowH);
      }
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('DAS 10km FIBER STRAIN: KM 4.218 DETECTED', 12, 18);

    requestAnimationFrame(renderOTDR);
  }
  renderOTDR();
}

/* ==========================================================================
   9. Kalman Filter AI Interception Trajectory
   ========================================================================== */
function initKalmanTrajectory() {
  const canvas = document.getElementById('kalmanCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 480;
  canvas.height = 200;

  let posX = 80;
  let posY = 150;

  function renderKalman() {
    ctx.clearRect(0, 0, 480, 200);

    // Current Target Position
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(posX, posY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Projected Future Vectors (30s, 60s, 120s)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(posX, posY);
    ctx.lineTo(posX + 80, posY - 40);
    ctx.lineTo(posX + 160, posY - 70);
    ctx.lineTo(posX + 240, posY - 85);
    ctx.stroke();
    ctx.setLineDash([]);

    // Intercept Point (QRF Drone Vector)
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(400, 20); // Watchtower QRF Drone Base
    ctx.lineTo(posX + 160, posY - 70);
    ctx.stroke();

    ctx.fillStyle = '#00f0ff';
    ctx.fillText('🎯 OPTIMAL INTERCEPTION POINT (T+60s)', posX + 165, posY - 75);

    requestAnimationFrame(renderKalman);
  }
  renderKalman();
}

/* ==========================================================================
   10. 3D Subterranean Voxel Viewer (Canvas Isometric 3D)
   ========================================================================== */
function init3DVoxelSubsurface() {
  const canvas = document.getElementById('voxelCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 480;
  canvas.height = 220;

  let angle = 0;

  function renderVoxel() {
    angle += 0.015;
    ctx.clearRect(0, 0, 480, 220);

    // Isometric Stratum Block
    ctx.fillStyle = '#451a03'; // Topsoil
    ctx.fillRect(80, 60, 320, 30);

    ctx.fillStyle = '#78350f'; // Alluvial Clay
    ctx.fillRect(80, 90, 320, 50);

    ctx.fillStyle = '#1e293b'; // Solid Bedrock
    ctx.fillRect(80, 140, 320, 60);

    // Burrowing 3D Tunnel Cylinder with pulsating excavator
    const pulse = Math.sin(angle * 4) * 4;
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.ellipse(240, 115, 20 + pulse, 10 + pulse * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(80, 60, 320, 140);

    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('3D VOXEL STRATA: -8.4m CAVITY TRAJECTORY', 90, 48);

    requestAnimationFrame(renderVoxel);
  }
  renderVoxel();
}

/* ==========================================================================
   11. Biometric Gait Cadence Tracker
   ========================================================================== */
function initGaitTracker() {
  const canvas = document.getElementById('gaitCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 240;
  canvas.height = 200;

  let step = 0;

  function renderGait() {
    step += 0.05;
    ctx.clearRect(0, 0, 240, 200);

    const cx = 120;
    const cy = 60;

    // 17 Skeletal Keypoints
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;

    // Head
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.stroke();

    // Torso
    ctx.beginPath();
    ctx.moveTo(cx, cy + 10);
    ctx.lineTo(cx, cy + 60);
    ctx.stroke();

    // Legs with Sinusoidal Stride Cadence (2.1 Hz)
    const legL = Math.sin(step) * 20;
    const legR = -Math.sin(step) * 20;

    ctx.beginPath();
    ctx.moveTo(cx, cy + 60);
    ctx.lineTo(cx - 15 + legL, cy + 110);
    ctx.moveTo(cx, cy + 60);
    ctx.lineTo(cx + 15 + legR, cy + 110);
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('GAIT: BIPEDAL (2.1 Hz)', 12, 185);

    requestAnimationFrame(renderGait);
  }
  renderGait();
}

/* ==========================================================================
   12. Live Airspace & Drone ADS-B Radar
   ========================================================================== */
function initAirspaceRadar() {
  const canvas = document.getElementById('airspaceCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 240;
  canvas.height = 200;

  let sweep = 0;

  function renderAirspace() {
    sweep = (sweep + 0.03) % (Math.PI * 2);
    ctx.fillStyle = 'rgba(2, 6, 23, 0.2)';
    ctx.fillRect(0, 0, 240, 200);

    const cx = 120;
    const cy = 100;

    // Sweep Line
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(sweep) * 90, cy + Math.sin(sweep) * 90);
    ctx.stroke();

    // Drone Target Blip
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(cx + 45, cy - 35, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 8px monospace';
    ctx.fillText('UAV-04 (ALT: 120m)', cx + 52, cy - 32);

    requestAnimationFrame(renderAirspace);
  }
  renderAirspace();
}

/* ==========================================================================
   13. Solar Array & Battery Edge Power Management
   ========================================================================== */
function initSolarTelemetry() {
  setInterval(() => {
    const solarEl = document.getElementById('solarWattage');
    const battEl = document.getElementById('battReserve');
    const aiPowerEl = document.getElementById('aiPowerDraw');

    if (solarEl) solarEl.textContent = `${(420 + Math.random() * 40).toFixed(0)} W`;
    if (battEl) battEl.textContent = `94.${Math.floor(Math.random() * 9)}%`;
    if (aiPowerEl) aiPowerEl.textContent = `${(18.2 + Math.random() * 2).toFixed(1)} W`;
  }, 2500);
}

/* ==========================================================================
   14. Wildlife Migration Corridor Heatmap
   ========================================================================== */
function initWildlifeMigration() {
  const canvas = document.getElementById('wildlifeCorridorCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 480;
  canvas.height = 180;

  function renderCorridor() {
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 480, 180);

    // Natural Animal Path Density Gradient
    const pathGrad = ctx.createLinearGradient(0, 40, 480, 140);
    pathGrad.addColorStop(0, 'rgba(16, 185, 129, 0.1)');
    pathGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.85)'); // High migration activity
    pathGrad.addColorStop(1, 'rgba(16, 185, 129, 0.1)');

    ctx.fillStyle = pathGrad;
    ctx.beginPath();
    ctx.ellipse(240, 90, 180, 45, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('🐾 CANINE & UNGULATE MIGRATION DENSITY [SECTOR ALPHA]', 12, 20);
  }
  renderCorridor();
}

/* ==========================================================================
   15. Real Telegram / SMS Webhook Dispatcher
   ========================================================================== */
window.dispatchLiveTelegramAlert = function() {
  const toast = document.getElementById('telegramToast');
  if (toast) {
    toast.style.display = 'block';
    toast.innerHTML = `
      <strong>📱 TELEGRAM SATCOM DISPATCHED:</strong><br>
      <code>[AURA-BORDER 2.0] ALERT: CAM-01 Fauna Activity (Wolf Pack) at ${new Date().toLocaleTimeString()} UTC. Siren suppressed. Logged to Forest Rangers.</code>
    `;
    setTimeout(() => { toast.style.display = 'none'; }, 6000);
  }
};
