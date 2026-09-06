/**
 * AURA-BORDER AI - Main Application Controller
 * Orchestrates 4-Camera Multi-View, Master Unified Camera, Digging Alarms, AVF, and Scenarios.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Multi-Camera & Seismic Engines
  const multiCamManager = new MultiCameraManager();
  const seismicEngine = new SeismicAudioEngine('spectrogramCanvas');
  
  multiCamManager.init();
  seismicEngine.init();
  window.alertSystem.init();

  window.multiCamManager = multiCamManager;
  window.seismicEngine = seismicEngine;

  // 1. Camera View Grid / Filter Switcher
  const filterBtns = document.querySelectorAll('.cam-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetCam = btn.getAttribute('data-filter');
      multiCamManager.setFocusCamera(targetCam);
      if (window.tacticalAudio) window.tacticalAudio.playClick();
    });
  });

  // 2. Weather Controls for CAM-03 & Master Cam
  const weatherBtns = document.querySelectorAll('.weather-tab');
  weatherBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      weatherBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const weatherType = btn.getAttribute('data-weather');
      multiCamManager.setWeatherOnCam('cam3', weatherType);
      multiCamManager.setWeatherOnCam('cam_master', weatherType);
      updateAVFTelemetry();
      if (window.tacticalAudio) window.tacticalAudio.playClick();
    });
  });

  // 3. AVF Toggle
  const avfToggle = document.getElementById('avfToggleBtn');
  if (avfToggle) {
    avfToggle.addEventListener('click', () => {
      window.avfEngine.enabled = !window.avfEngine.enabled;
      avfToggle.classList.toggle('active', window.avfEngine.enabled);
      avfToggle.innerHTML = window.avfEngine.enabled 
        ? `<span style="color:#00f0ff">⚡ AVF: ACTIVE (ON)</span>`
        : `<span style="color:#ef4444">⚡ AVF: BYPASS (OFF)</span>`;
      updateAVFTelemetry();
      if (window.tacticalAudio) window.tacticalAudio.playClick();
    });
  }

  // 4. Scenario Simulation Triggers

  // 🌟 0. ALL 4 CONDITIONS CONCURRENTLY ON CAM-MASTER
  const btnSimMasterAll = document.getElementById('btnSimMasterAll');
  if (btnSimMasterAll) {
    btnSimMasterAll.addEventListener('click', () => {
      // Highlight master tab
      filterBtns.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-filter') === 'cam_master');
      });
      multiCamManager.triggerAllConditionsMaster();
      if (window.tacticalAudio) window.tacticalAudio.playClick();
    });
  }

  // A. Human Intrusion on CAM-02
  const btnSimHuman = document.getElementById('btnSimHuman');
  if (btnSimHuman) {
    btnSimHuman.addEventListener('click', () => {
      multiCamManager.triggerHumanOnCam2();
      if (window.tacticalAudio) window.tacticalAudio.playClick();
    });
  }

  // B. Wildlife on CAM-01 (Silent SMS)
  const btnSimAnimal = document.getElementById('btnSimAnimal');
  if (btnSimAnimal) {
    btnSimAnimal.addEventListener('click', () => {
      multiCamManager.triggerWildlifeOnCam1();
      if (window.tacticalAudio) window.tacticalAudio.playClick();
    });
  }

  // C. Underground Digging Alarm on CAM-04
  const btnSimTunnel = document.getElementById('btnSimTunnel');
  if (btnSimTunnel) {
    let tunnelActive = false;
    btnSimTunnel.addEventListener('click', () => {
      tunnelActive = !tunnelActive;
      btnSimTunnel.classList.toggle('active', tunnelActive);
      if (tunnelActive) {
        btnSimTunnel.innerHTML = `<span>⛏️ Digging Alarm on CAM-04 (STOP)</span>`;
        multiCamManager.triggerDiggingOnCam4(8.4, 74.6);
      } else {
        btnSimTunnel.innerHTML = `<span>⛏️ 3. Digging Alarm [CAM-04]</span>`;
        multiCamManager.stopDiggingOnCam4();
      }
      if (window.tacticalAudio) window.tacticalAudio.playClick();
    });
  }

  // D. Fog & Lightning on CAM-03
  const btnSimFogStorm = document.getElementById('btnSimFogStorm');
  if (btnSimFogStorm) {
    btnSimFogStorm.addEventListener('click', () => {
      const cur = multiCamManager.cameras['cam3'].weather.type;
      const next = cur === 'fog' ? 'lightning' : (cur === 'lightning' ? 'clear' : 'fog');
      multiCamManager.setWeatherOnCam('cam3', next);
      multiCamManager.setWeatherOnCam('cam_master', next);
      document.querySelectorAll('.weather-tab').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-weather') === next);
      });
      updateAVFTelemetry();
      if (window.tacticalAudio) window.tacticalAudio.playClick();
    });
  }

  // 5. Audio Mute Toggle
  const muteBtn = document.getElementById('audioMuteBtn');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      const isMuted = window.tacticalAudio.toggleMute();
      muteBtn.innerHTML = isMuted 
        ? `<svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg> Muted` 
        : `<svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg> Audio ON`;
    });
  }

  // 6. Fullscreen Toggle
  const fullBtn = document.getElementById('fullscreenBtn');
  if (fullBtn) {
    fullBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen();
      }
    });
  }

  // 7. Update Telemetry Helper
  function updateAVFTelemetry() {
    const cam3 = multiCamManager.cameras['cam3'];
    const tele = window.avfEngine.getTelemetry(cam3.weather);
    const algoEl = document.getElementById('avfAlgoVal');
    const snrEl = document.getElementById('avfSnrVal');
    const transEl = document.getElementById('avfTransVal');
    
    if (algoEl) algoEl.textContent = tele.algorithm;
    if (snrEl) snrEl.textContent = tele.snrEnhancement;
    if (transEl) transEl.textContent = tele.transmissionCoeff;
  }

  setInterval(() => {
    const clockEl = document.getElementById('liveClock');
    if (clockEl) {
      clockEl.textContent = new Date().toUTCString().slice(17, 25) + ' UTC';
    }
  }, 1000);
});
