/**
 * AURA-BORDER AI - Multi-Camera Array & Unified Master Camera Engine
 * Manages CAM-01 to CAM-04 and the Unified CAM-MASTER which runs ALL 4 conditions concurrently:
 * 1. Human Detection via video frequency
 * 2. Underground Tunnel Digging via audio frequency & camera radius
 * 3. Wildlife Animal Detection (Silent SMS, No Siren)
 * 4. AVF (Adaptive Vision Filtering) for Fog Dehazing & Lightning Flash Clamping
 */

class MultiCameraManager {
  constructor() {
    this.cameras = {
      'cam_master': {
        id: 'CAM-MASTER',
        name: 'Sector Master — Unified Multi-Modal Border Hub (All Conditions)',
        canvasId: 'canvas_cam_master',
        ctx: null,
        status: 'ALL 4 AI CONDITIONS ACTIVE',
        statusClass: 'status-master',
        weather: { type: 'fog', fogDensity: 0.85, lightningActive: true, isNight: false },
        viewMode: 'optical',
        targets: [],
        coverageRadius: '300m UNIFIED FOV',
        latLong: '32°44\'18"N 74°51\'04"E',
        terrainType: 'master',
        isSlewedToTunnel: true,
        tunnelRadius: 74.6,
        tunnelDepth: 8.4
      },
      'cam1': {
        id: 'CAM-01',
        name: 'Sector Alpha — North Ridge Outpost',
        canvasId: 'canvas_cam1',
        ctx: null,
        status: 'MONITORING',
        statusClass: 'status-ok',
        weather: { type: 'clear', fogDensity: 0.0, lightningActive: false, isNight: false },
        viewMode: 'optical',
        targets: [],
        coverageRadius: '180m FOV',
        latLong: '32°44\'12"N 74°50\'52"E',
        terrainType: 'mountain'
      },
      'cam2': {
        id: 'CAM-02',
        name: 'Sector Bravo — Canyon Ridge Pass',
        canvasId: 'canvas_cam2',
        ctx: null,
        status: 'MONITORING',
        statusClass: 'status-ok',
        weather: { type: 'clear', fogDensity: 0.1, lightningActive: false, isNight: false },
        viewMode: 'optical',
        targets: [],
        coverageRadius: '220m FOV',
        latLong: '32°44\'15"N 74°50\'58"E',
        terrainType: 'canyon'
      },
      'cam3': {
        id: 'CAM-03',
        name: 'Sector Charlie — River Basin Crossing',
        canvasId: 'canvas_cam3',
        ctx: null,
        status: 'AVF DEHAZING',
        statusClass: 'status-avf',
        weather: { type: 'fog', fogDensity: 0.82, lightningActive: false, isNight: false },
        viewMode: 'optical',
        targets: [],
        coverageRadius: '200m FOV',
        latLong: '32°44\'17"N 74°51\'01"E',
        terrainType: 'river'
      },
      'cam4': {
        id: 'CAM-04',
        name: 'Sector Delta — East Subsurface Perimeter',
        canvasId: 'canvas_cam4',
        ctx: null,
        status: 'SEISMIC DAS ARMED',
        statusClass: 'status-ok',
        weather: { type: 'clear', fogDensity: 0.05, lightningActive: false, isNight: false },
        viewMode: 'optical',
        targets: [],
        coverageRadius: '250m FOV',
        latLong: '32°44\'18"N 74°51\'04"E',
        terrainType: 'desert',
        isSlewedToTunnel: false,
        tunnelRadius: 74.6,
        tunnelDepth: 8.4
      }
    };

    this.activeFocusCamera = 'all'; // 'all', 'cam_master', 'cam1', 'cam2', 'cam3', 'cam4'
    this.splitPercent = 50; // AVF Before/After Split Line
    this.fogParticles = [];
    this.lightningFlashTimer = 0;
    this.groundDisturbancePulse = 0;

    this.initFog();
    this.initMasterTargets();
  }

  init() {
    Object.keys(this.cameras).forEach(camKey => {
      const cam = this.cameras[camKey];
      const canvas = document.getElementById(cam.canvasId);
      if (canvas) {
        cam.ctx = canvas.getContext('2d', { willReadFrequently: true });
        canvas.width = camKey === 'cam_master' ? 960 : 640;
        canvas.height = camKey === 'cam_master' ? 540 : 360;
      }
    });

    this.initSplitSlider();
    this.animate();
  }

  initSplitSlider() {
    const splitWrapper = document.getElementById('masterAvfWrapper');
    const splitLine = document.getElementById('masterSplitLine');
    if (!splitWrapper || !splitLine) return;

    let isDragging = false;
    const updateSplit = (clientX) => {
      const rect = splitWrapper.getBoundingClientRect();
      let x = clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const pct = (x / rect.width) * 100;
      this.splitPercent = pct;
      splitLine.style.left = `${pct}%`;
    };

    splitLine.addEventListener('mousedown', () => { isDragging = true; });
    window.addEventListener('mousemove', (e) => {
      if (isDragging) updateSplit(e.clientX);
    });
    window.addEventListener('mouseup', () => { isDragging = false; });

    splitLine.addEventListener('touchstart', () => { isDragging = true; });
    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length > 0) updateSplit(e.touches[0].clientX);
    });
    window.addEventListener('touchend', () => { isDragging = false; });
  }

  initFog() {
    this.fogParticles = [];
    for (let i = 0; i < 45; i++) {
      this.fogParticles.push({
        x: Math.random() * 960,
        y: Math.random() * 540,
        radius: 70 + Math.random() * 120,
        vx: 0.35 + Math.random() * 0.7,
        opacity: 0.2 + Math.random() * 0.4
      });
    }
  }

  initMasterTargets() {
    // CAM-MASTER has BOTH Human and Wildlife, plus Subsurface Digging and AVF Fog
    this.cameras['cam_master'].targets = [
      {
        id: 'T-01',
        type: 'human',
        name: 'HUMAN INFILTRATOR',
        x: 180,
        y: 280,
        width: 36,
        height: 80,
        speedX: 0.65,
        confidence: 0.986,
        threatLevel: 'CRITICAL (SIREN ARMED)',
        thermalSignature: '37.4°C',
        coords: '32°44\'18"N 74°51\'04"E'
      },
      {
        id: 'W-01',
        type: 'animal',
        name: 'WILDLIFE: CANIS LUPUS (WOLF)',
        x: 680,
        y: 330,
        width: 65,
        height: 46,
        speedX: -0.75,
        confidence: 0.954,
        threatLevel: 'ZERO (SILENT SMS LOGGED)',
        thermalSignature: '38.8°C',
        coords: '32°44\'20"N 74°51\'08"E'
      }
    ];
  }

  /**
   * 🌟 Trigger ALL 4 Conditions Concurrently on CAM-MASTER
   */
  triggerAllConditionsMaster() {
    this.setFocusCamera('cam_master');
    const masterCam = this.cameras['cam_master'];

    // 1. Human Infiltration (triggers siren)
    if (window.alertSystem) {
      window.alertSystem.triggerHumanAlarm(masterCam.targets[0], 'CAM-MASTER', 'Unified Defense Hub', new Date().toLocaleTimeString());
      // 2. Wildlife Animal Silent Protocol (triggers silent SMS)
      window.alertSystem.triggerAnimalSilentNotification(masterCam.targets[1], 'CAM-MASTER', 'Unified Defense Hub', new Date().toLocaleTimeString());
    }

    // 3. Underground Tunnel Digging (triggers digging alarm + DAS)
    if (window.seismicEngine) {
      window.seismicEngine.triggerTunnelDigging('rotary_drill');
    }

    // 4. Fog & Lightning AVF (starts lightning flash and active dehaze)
    masterCam.weather.fogDensity = 0.85;
    masterCam.weather.lightningActive = true;
    this.lightningFlashTimer = 20;

    // Highlight All Badge
    this.updateCamCardBadge('cam_master', '🌟 ALL 4 CONDITIONS ACTIVE', 'badge-master');
  }

  triggerHumanOnCam2() {
    const cam = this.cameras['cam2'];
    cam.targets = [{
      id: 'T-02',
      type: 'human',
      name: 'HUMAN INFILTRATOR',
      x: 220,
      y: 190,
      width: 30,
      height: 68,
      speedX: 0.7,
      confidence: 0.986,
      threatLevel: 'CRITICAL',
      thermalSignature: '37.4°C',
      coords: cam.latLong
    }];
    cam.status = '🚨 HUMAN INTRUDER';
    this.updateCamCardBadge('cam2', '🚨 HUMAN INTRUDER', 'badge-human');

    if (window.alertSystem) {
      window.alertSystem.handleTargetDetection(cam.targets[0], cam);
    }
  }

  triggerWildlifeOnCam1() {
    const cam = this.cameras['cam1'];
    cam.targets = [{
      id: 'W-01',
      type: 'animal',
      name: 'WILDLIFE: CANIS LUPUS (WOLF)',
      x: 320,
      y: 220,
      width: 54,
      height: 38,
      speedX: -0.85,
      confidence: 0.952,
      threatLevel: 'NONE (ANIMAL)',
      thermalSignature: '38.8°C',
      coords: cam.latLong
    }];
    cam.status = '🐾 WILDLIFE (SILENT)';
    this.updateCamCardBadge('cam1', '🐾 WILDLIFE (SILENT)', 'badge-animal');

    if (window.alertSystem) {
      window.alertSystem.handleTargetDetection(cam.targets[0], cam);
    }
  }

  triggerDiggingOnCam4(depth = 8.4, radius = 74.6) {
    const cam = this.cameras['cam4'];
    cam.isSlewedToTunnel = true;
    cam.tunnelRadius = radius;
    cam.tunnelDepth = depth;
    cam.status = '⛏️ DIGGING DETECTED';
    this.updateCamCardBadge('cam4', `⛏️ DIGGING [${radius}m RADIUS]`, 'badge-tunnel');

    if (window.seismicEngine) {
      window.seismicEngine.triggerTunnelDigging('rotary_drill');
    }
  }

  stopDiggingOnCam4() {
    const cam = this.cameras['cam4'];
    cam.isSlewedToTunnel = false;
    cam.status = 'SEISMIC DAS ARMED';
    this.updateCamCardBadge('cam4', 'SEISMIC DAS ARMED', 'card-badge');

    if (window.seismicEngine) {
      window.seismicEngine.stopTunnelDigging();
    }
  }

  triggerLightningOnCam3() {
    this.lightningFlashTimer = 16;
  }

  setWeatherOnCam(camKey, weatherType) {
    const cam = this.cameras[camKey];
    if (!cam) return;
    cam.weather.type = weatherType;
    if (weatherType === 'clear') {
      cam.weather.fogDensity = 0.0;
      cam.weather.lightningActive = false;
    } else if (weatherType === 'fog') {
      cam.weather.fogDensity = 0.85;
      cam.weather.lightningActive = false;
    } else if (weatherType === 'lightning') {
      cam.weather.fogDensity = 0.35;
      cam.weather.lightningActive = true;
      this.triggerLightningOnCam3();
    }
  }

  updateCamCardBadge(camKey, text, className) {
    const badgeEl = document.getElementById(`badge_${camKey}`);
    if (badgeEl) {
      badgeEl.className = `card-badge ${className}`;
      badgeEl.textContent = text;
    }
  }

  setFocusCamera(camKey) {
    this.activeFocusCamera = camKey;
    const gridContainer = document.getElementById('cameraGridContainer');
    const masterContainer = document.getElementById('masterCameraContainer');
    if (!gridContainer || !masterContainer) return;

    if (camKey === 'cam_master') {
      masterContainer.style.display = 'block';
      gridContainer.style.display = 'none';
    } else if (camKey === 'all') {
      masterContainer.style.display = 'none';
      gridContainer.style.display = 'grid';
      gridContainer.className = 'camera-grid-quad';
      document.querySelectorAll('.camera-card').forEach(card => card.style.display = 'flex');
    } else {
      masterContainer.style.display = 'none';
      gridContainer.style.display = 'flex';
      gridContainer.className = 'camera-grid-single';
      document.querySelectorAll('.camera-card').forEach(card => {
        card.style.display = card.getAttribute('data-cam') === camKey ? 'flex' : 'none';
      });
    }
  }

  update() {
    Object.keys(this.cameras).forEach(key => {
      const cam = this.cameras[key];
      const maxW = key === 'cam_master' ? 860 : 540;
      cam.targets.forEach(t => {
        t.x += t.speedX;
        if (t.x > maxW) t.speedX = -Math.abs(t.speedX);
        if (t.x < 60) t.speedX = Math.abs(t.speedX);
      });
    });

    this.fogParticles.forEach(p => {
      p.x += p.vx;
      if (p.x - p.radius > 960) p.x = -p.radius;
    });

    if (this.lightningFlashTimer > 0) {
      this.lightningFlashTimer--;
    } else if ((this.cameras['cam3'].weather.type === 'lightning' || this.cameras['cam_master'].weather.lightningActive) && Math.random() < 0.02) {
      this.triggerLightningOnCam3();
    }

    this.groundDisturbancePulse = (this.groundDisturbancePulse + 0.09) % (Math.PI * 2);
  }

  render() {
    Object.keys(this.cameras).forEach(camKey => {
      const cam = this.cameras[camKey];
      if (!cam.ctx) return;
      if (camKey === 'cam_master') {
        this.renderMasterCamera(cam);
      } else {
        this.renderSingleCamera(cam);
      }
    });
  }

  /**
   * Render Unified CAM-MASTER with ALL 4 conditions simultaneously
   */
  renderMasterCamera(cam) {
    const ctx = cam.ctx;
    const w = 960;
    const h = 540;

    ctx.clearRect(0, 0, w, h);

    // 1. Sky Gradient
    let sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#090d16');
    sky.addColorStop(1, '#1e293b');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // 2. Mountain Horizon
    ctx.fillStyle = '#060911';
    ctx.beginPath();
    ctx.moveTo(0, 220);
    ctx.lineTo(120, 160);
    ctx.lineTo(280, 210);
    ctx.lineTo(440, 150);
    ctx.lineTo(620, 190);
    ctx.lineTo(780, 140);
    ctx.lineTo(w, 220);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();

    // 3. Ground Plane
    ctx.fillStyle = '#141418';
    ctx.fillRect(0, 220, w, h - 220);

    // 4. Perimeter Fence Line & Posts
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    for (let x = 40; x < w; x += 65) {
      ctx.beginPath();
      ctx.moveTo(x, 190);
      ctx.lineTo(x, 390);
      ctx.stroke();

      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(x - 2, 186, 4, 4);
    }
    for (let y = 200; y < 390; y += 22) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Watchtower
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(760, 130, 45, 90);
    ctx.fillStyle = 'rgba(0, 240, 255, 0.6)';
    ctx.fillRect(770, 140, 25, 12);

    // 5. Condition 2: Underground Tunnel Digging Shockwaves & Reticle
    const spotX = 440;
    const spotY = 350;
    const pulse = Math.sin(this.groundDisturbancePulse) * 8;

    for (let r = 20; r <= 80; r += 20) {
      ctx.strokeStyle = `rgba(168, 85, 247, ${0.8 - r / 120})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(spotX, spotY, r + pulse, (r + pulse) * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.beginPath();
    ctx.ellipse(spotX, spotY, 28, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Slew Reticle
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.strokeRect(spotX - 50, spotY - 30, 100, 60);
    ctx.fillStyle = '#a855f7';
    const tag = `⛏️ CONDITION 2: DIGGING (-${cam.tunnelDepth}m | RADIUS: ${cam.tunnelRadius}m)`;
    ctx.font = 'bold 10px monospace';
    const tagW = ctx.measureText(tag).width;
    ctx.fillRect(spotX - tagW / 2 - 4, spotY - 48, tagW + 8, 16);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(tag, spotX - tagW / 2, spotY - 36);

    // 6. Draw Targets (Condition 1 Human + Condition 3 Wildlife)
    cam.targets.forEach(target => {
      this.drawTarget(ctx, target);
    });

    // 7. Condition 4: Fog Layer (Pre-AVF)
    if (cam.weather.fogDensity > 0.05) {
      this.fogParticles.forEach(p => {
        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        radGrad.addColorStop(0, `rgba(203, 213, 225, ${p.opacity * cam.weather.fogDensity})`);
        radGrad.addColorStop(1, 'rgba(203, 213, 225, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Lightning Strobe
    if (this.lightningFlashTimer > 0) {
      const flash = this.lightningFlashTimer / 20;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.85 * flash})`;
      ctx.fillRect(0, 0, w, h);
    }

    // 8. Condition 4: Apply AVF Filter with Split Slider
    if (window.avfEngine && window.avfEngine.enabled) {
      window.avfEngine.applyAVF(ctx, w, h, {
        fogDensity: cam.weather.fogDensity,
        lightningActive: this.lightningFlashTimer > 0,
        isNight: false
      }, this.splitPercent);
    }

    // 9. Draw AI Bounding Boxes for Human & Animal
    cam.targets.forEach(target => {
      this.drawBoundingBox(ctx, target, cam);
    });

    // 10. Master Camera Telemetry Banner
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(10, 10, 310, 24);
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`🌟 CAM-MASTER: ALL 4 CONDITIONS ACTIVE`, 18, 26);
  }

  renderSingleCamera(cam) {
    const ctx = cam.ctx;
    const w = 640;
    const h = 360;

    ctx.clearRect(0, 0, w, h);

    let sky = ctx.createLinearGradient(0, 0, 0, h);
    if (cam.terrainType === 'mountain') {
      sky.addColorStop(0, '#0f172a');
      sky.addColorStop(1, '#1e293b');
    } else if (cam.terrainType === 'canyon') {
      sky.addColorStop(0, '#1c1917');
      sky.addColorStop(1, '#292524');
    } else if (cam.terrainType === 'river') {
      sky.addColorStop(0, '#091e3a');
      sky.addColorStop(1, '#1e3a5f');
    } else {
      sky.addColorStop(0, '#18181b');
      sky.addColorStop(1, '#27272a');
    }
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.lineTo(80, 110);
    ctx.lineTo(190, 140);
    ctx.lineTo(310, 100);
    ctx.lineTo(440, 135);
    ctx.lineTo(560, 95);
    ctx.lineTo(w, 150);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();

    ctx.fillStyle = cam.terrainType === 'river' ? '#0f2942' : '#141416';
    ctx.fillRect(0, 150, w, h - 150);

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    for (let x = 30; x < w; x += 45) {
      ctx.beginPath();
      ctx.moveTo(x, 130);
      ctx.lineTo(x, 260);
      ctx.stroke();

      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(x - 2, 127, 4, 4);
    }
    for (let y = 140; y < 260; y += 18) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    if (cam.id === 'CAM-04' && cam.isSlewedToTunnel) {
      this.drawCam4SubsurfaceDisturbance(ctx, w, h, cam);
    }

    cam.targets.forEach(target => {
      this.drawTarget(ctx, target);
    });

    if (cam.weather.fogDensity > 0.05) {
      this.fogParticles.forEach(p => {
        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        radGrad.addColorStop(0, `rgba(203, 213, 225, ${p.opacity * cam.weather.fogDensity})`);
        radGrad.addColorStop(1, 'rgba(203, 213, 225, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    if (cam.id === 'CAM-03' && this.lightningFlashTimer > 0) {
      const flash = this.lightningFlashTimer / 16;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.85 * flash})`;
      ctx.fillRect(0, 0, w, h);
    }

    if (cam.id === 'CAM-03' && window.avfEngine && window.avfEngine.enabled) {
      window.avfEngine.applyAVF(ctx, w, h, {
        fogDensity: cam.weather.fogDensity,
        lightningActive: this.lightningFlashTimer > 0,
        isNight: false
      }, this.splitPercent);
    }

    cam.targets.forEach(target => {
      this.drawBoundingBox(ctx, target, cam);
    });

    this.drawCameraHUDWatermark(ctx, w, h, cam);
  }

  drawCam4SubsurfaceDisturbance(ctx, w, h, cam) {
    const spotX = 400;
    const spotY = 235;
    const pulse = Math.sin(this.groundDisturbancePulse) * 6;

    for (let r = 15; r <= 60; r += 15) {
      ctx.strokeStyle = `rgba(168, 85, 247, ${0.75 - r / 90})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(spotX, spotY, r + pulse, (r + pulse) * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
    ctx.beginPath();
    ctx.ellipse(spotX, spotY, 20, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.strokeRect(spotX - 35, spotY - 20, 70, 40);

    ctx.fillStyle = '#a855f7';
    const tag = `🎯 PTZ SLEWED: RADIUS ${cam.tunnelRadius}m | DEPTH: -${cam.tunnelDepth}m`;
    ctx.font = 'bold 9px monospace';
    const tagW = ctx.measureText(tag).width;
    ctx.fillRect(spotX - tagW / 2 - 3, spotY - 34, tagW + 6, 14);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(tag, spotX - tagW / 2, spotY - 24);
  }

  drawTarget(ctx, target) {
    if (target.type === 'human') {
      ctx.save();
      ctx.fillStyle = '#1e1b18';
      ctx.beginPath();
      ctx.roundRect(target.x + 6, target.y + 16, 18, 36, 3);
      ctx.fill();

      ctx.fillStyle = '#292524';
      ctx.beginPath();
      ctx.arc(target.x + 15, target.y + 10, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#1e1b18';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(target.x + 10, target.y + 52);
      ctx.lineTo(target.x + 6 + Math.sin(Date.now() * 0.008) * 6, target.y + target.height);
      ctx.moveTo(target.x + 20, target.y + 52);
      ctx.lineTo(target.x + 24 - Math.sin(Date.now() * 0.008) * 6, target.y + target.height);
      ctx.stroke();
      ctx.restore();
    } else if (target.type === 'animal') {
      ctx.save();
      ctx.fillStyle = '#3f3f46';
      ctx.beginPath();
      ctx.roundRect(target.x, target.y + 10, target.width - 12, target.height - 18, 6);
      ctx.fill();

      const headX = target.speedX >= 0 ? target.x + target.width - 10 : target.x + 4;
      ctx.beginPath();
      ctx.arc(headX, target.y + 12, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#3f3f46';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(target.x + 6, target.y + target.height - 10);
      ctx.lineTo(target.x + 4 + Math.sin(Date.now() * 0.01) * 5, target.y + target.height);
      ctx.moveTo(target.x + target.width - 16, target.y + target.height - 10);
      ctx.lineTo(target.x + target.width - 14 - Math.sin(Date.now() * 0.01) * 5, target.y + target.height);
      ctx.stroke();
      ctx.restore();
    }
  }

  drawBoundingBox(ctx, target, cam) {
    const isHuman = target.type === 'human';
    const boxColor = isHuman ? '#ef4444' : '#10b981';

    ctx.save();
    ctx.strokeStyle = boxColor;
    ctx.lineWidth = 2;
    ctx.fillStyle = isHuman ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.12)';
    ctx.fillRect(target.x - 3, target.y - 3, target.width + 6, target.height + 6);
    ctx.strokeRect(target.x - 3, target.y - 3, target.width + 6, target.height + 6);

    ctx.fillStyle = boxColor;
    const tagText = isHuman 
      ? `🚨 [${cam.id}] ${target.name} [${(target.confidence * 100).toFixed(1)}%]`
      : `🐾 [${cam.id}] ${target.name} [${(target.confidence * 100).toFixed(1)}%]`;
    
    ctx.font = 'bold 9px monospace';
    const tw = ctx.measureText(tagText).width;
    ctx.fillRect(target.x - 3, target.y - 17, tw + 8, 14);
    ctx.fillStyle = isHuman ? '#ffffff' : '#000000';
    ctx.fillText(tagText, target.x + 1, target.y - 7);

    const subText = isHuman ? `THREAT: CRITICAL | SIREN ACTIVE` : `THREAT: 0 | SILENT SMS (NO ALARM)`;
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(target.x - 3, target.y + target.height + 5, ctx.measureText(subText).width + 6, 12);
    ctx.fillStyle = boxColor;
    ctx.font = '8px monospace';
    ctx.fillText(subText, target.x, target.y + target.height + 14);

    ctx.restore();
  }

  drawCameraHUDWatermark(ctx, w, h, cam) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(8, 8, 160, 20);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(16, 18, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(`${cam.id} | ${cam.coverageRadius}`, 24, 21);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(8, h - 22, 190, 16);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '8px monospace';
    ctx.fillText(`LAT/LONG: ${cam.latLong}`, 12, h - 11);
    ctx.restore();
  }

  animate() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.animate());
  }
}

window.MultiCameraManager = MultiCameraManager;
