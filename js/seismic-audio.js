/**
 * AURA-BORDER AI - Underground Acoustic & Seismic Detection Engine
 * Analyzes audio frequency signatures of subterranean tunnel digging (pickaxe, rotary drill),
 * renders real-time FFT spectrograms, calculates camera detection radius, and triggers audible seismic alarms.
 */

class SeismicAudioEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.width = 480;
    this.height = 130;

    this.isDiggingActive = false;
    this.diggingType = 'rotary_drill';
    this.activeSensorIndex = 6;
    this.estimatedDepth = 8.4;
    this.confidence = 96.8;
    this.frequencySpike = 185; // Hz

    // Subsurface Geotechnical Parameters
    this.shearWaveSpeed = 340; // m/s (Vs)
    this.soilAttenuation = 0.14; // dB/m
    this.detectedCameraId = 'CAM-04';
    this.detectedRadius = 74.6; // meters from CAM-04

    this.fftData = new Float32Array(64);
    this.waterfallHistory = [];
    this.maxWaterfall = 35;
  }

  init() {
    if (!this.canvas) return;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.animate();
  }

  /**
   * Trigger Underground Digging Simulation on CAM-04
   */
  triggerTunnelDigging(type = 'rotary_drill') {
    this.isDiggingActive = true;
    this.diggingType = type;
    this.confidence = 95.0 + Math.random() * 4.5;
    this.estimatedDepth = +(6.5 + Math.random() * 4.0).toFixed(1);
    this.detectedRadius = +(65.0 + Math.random() * 25.0).toFixed(1);
    this.activeSensorIndex = 6;

    // Trigger Audible Underground Digging Alarm & Subterranean Drill Sounds
    if (window.tacticalAudio) {
      window.tacticalAudio.startDiggingAlarm();
    }

    // Trigger Alert System Log
    if (window.alertSystem) {
      window.alertSystem.handleTunnelDetection({
        sensorId: `GEO-NODE #07`,
        depth: this.estimatedDepth,
        confidence: this.confidence,
        type: this.diggingType === 'rotary_drill' ? 'Heavy Rotary Tunnel Boring' : 'Manual Pickaxe Excavation',
        freqBand: this.diggingType === 'rotary_drill' ? '1.4 kHz - 2.8 kHz' : '65 Hz - 220 Hz',
        cameraId: 'CAM-04',
        cameraSector: 'Sector Delta — East Subsurface Perimeter',
        cameraRadius: this.detectedRadius,
        maxCameraRadius: 250
      });
    }

    // Update CAM-04 in MultiCameraManager
    if (window.multiCamManager) {
      const cam = window.multiCamManager.cameras['cam4'];
      if (cam) {
        cam.isSlewedToTunnel = true;
        cam.tunnelRadius = this.detectedRadius;
        cam.tunnelDepth = this.estimatedDepth;
        cam.status = `⛏️ DIGGING [${this.detectedRadius}m RADIUS]`;
        window.multiCamManager.updateCamCardBadge('cam4', `⛏️ DIGGING [${this.detectedRadius}m RADIUS]`, 'badge-tunnel');
      }
    }

    this.updateDiggingUI();
  }

  stopTunnelDigging() {
    this.isDiggingActive = false;
    if (window.tacticalAudio) {
      window.tacticalAudio.stopDiggingAlarm();
    }

    // Reset Radar Camera Ring highlights
    document.querySelectorAll('.cam-radius-ring').forEach(ring => {
      ring.classList.remove('active-intersect');
    });

    if (window.multiCamManager) {
      window.multiCamManager.stopDiggingOnCam4();
    }
  }

  updateDiggingUI() {
    const depthEl = document.getElementById('undergroundDepthVal');
    if (depthEl) depthEl.textContent = `-${this.estimatedDepth}m Depth`;
    
    const camRadiusEl = document.getElementById('diggingCamRadiusVal');
    if (camRadiusEl) {
      camRadiusEl.textContent = `CAM-04 [${this.detectedRadius}m Radius]`;
    }

    const cavEl = document.getElementById('tunnelCavity');
    if (cavEl) {
      cavEl.style.left = `62%`;
      cavEl.style.top = `${38 + (this.estimatedDepth - 5) * 6}px`;
    }

    // Highlight CAM-04 Radius Ring on Radar
    const ringEl = document.getElementById('camRing_CAM-04');
    if (ringEl) {
      document.querySelectorAll('.cam-radius-ring').forEach(r => r.classList.remove('active-intersect'));
      ringEl.classList.add('active-intersect');
    }
  }

  updateFFT() {
    const time = Date.now() * 0.005;
    for (let i = 0; i < this.fftData.length; i++) {
      let baseNoise = Math.sin(time + i * 0.4) * 5 + Math.random() * 8 + 4;

      if (this.isDiggingActive) {
        if (this.diggingType === 'rotary_drill') {
          if (i >= 12 && i <= 38) {
            baseNoise += Math.sin(time * 3 + i) * 20 + 45 + Math.random() * 25;
          }
        } else {
          if (i >= 2 && i <= 10) {
            const rhythmicBeat = Math.abs(Math.sin(time * 2)) > 0.7 ? 65 : 15;
            baseNoise += rhythmicBeat + Math.random() * 20;
          }
        }
      }

      this.fftData[i] = Math.min(100, Math.max(0, baseNoise));
    }

    this.waterfallHistory.unshift([...this.fftData]);
    if (this.waterfallHistory.length > this.maxWaterfall) {
      this.waterfallHistory.pop();
    }
  }

  drawSpectrogram() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, w, h);

    // 1. Grid
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.12)';
    ctx.lineWidth = 1;
    for (let y = 20; y < h; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 2. Bars
    const barWidth = (w / this.fftData.length) - 1;
    for (let i = 0; i < this.fftData.length; i++) {
      const val = this.fftData[i];
      const barHeight = (val / 100) * (h - 22);
      const x = i * (barWidth + 1);
      const y = h - barHeight;

      let grad = ctx.createLinearGradient(0, h, 0, 0);
      if (this.isDiggingActive && val > 40) {
        grad.addColorStop(0, 'rgba(168, 85, 247, 0.7)');
        grad.addColorStop(0.7, '#ec4899');
        grad.addColorStop(1, '#ef4444');
      } else {
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        grad.addColorStop(1, 'rgba(168, 85, 247, 0.8)');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barWidth, barHeight);

      if (val > 50) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, y - 2, barWidth, 2);
      }
    }

    // 3. Status
    if (this.isDiggingActive) {
      ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
      ctx.fillRect(0, 0, w, 22);
      ctx.fillStyle = '#ec4899';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`🚨 DIGGING ALARM: ${this.detectedCameraId} RADIUS (${this.detectedRadius}m) | DEPTH: -${this.estimatedDepth}m | CONF: ${this.confidence.toFixed(1)}%`, 6, 15);
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      ctx.fillText(`SEISMIC DAS SPECTRUM [0-4 kHz] | CAM-04 SUBTERRANEAN SENSOR ARRAY ARMED`, 6, 15);
    }
  }

  animate() {
    this.updateFFT();
    this.drawSpectrogram();
    requestAnimationFrame(() => this.animate());
  }
}

window.SeismicAudioEngine = SeismicAudioEngine;
