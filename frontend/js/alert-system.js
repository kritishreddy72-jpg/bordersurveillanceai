/**
 * AURA-BORDER AI - Tactical Alert & Threat Dispatch Engine
 * Multi-Camera Aware Incident Management:
 * 1. Human Infiltration -> Tactical Siren + Red Banner + Explicit Camera ID
 * 2. Underground Digging -> Audible Seismic Alarm + Purple Strobe + Explicit Camera ID & Radius
 * 3. Wildlife Detection -> Silent SMS/Telemetry ONLY (Strictly No Alarm/Siren)
 */

class TacticalAlertSystem {
  constructor() {
    this.incidents = [];
    this.activeAlarm = false;
    this.humanAlertCount = 0;
    this.animalAlertCount = 0;
    this.tunnelAlertCount = 0;
  }

  init() {
    this.renderInitialLogs();
  }

  /**
   * Primary Target Event Handler
   */
  handleTargetDetection(target, cam) {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const camId = cam ? cam.id : 'CAM-02';
    const camName = cam ? cam.name : 'Sector Bravo';

    if (target.type === 'human') {
      this.triggerHumanAlarm(target, camId, camName, timestamp);
    } else if (target.type === 'animal') {
      this.triggerAnimalSilentNotification(target, camId, camName, timestamp);
    }
  }

  /**
   * 🚨 RULE 1: Human Intruder -> Audible Tactical Siren + Red Alert on Specific Camera
   */
  triggerHumanAlarm(target, camId, camName, timestamp) {
    this.humanAlertCount++;
    this.activeAlarm = true;

    // 1. Play Tactical Alarm Siren
    if (window.tacticalAudio) {
      window.tacticalAudio.startAlarmSiren();
    }

    // 2. Activate Strobe Banner on Dashboard with Camera ID
    const banner = document.getElementById('globalAlertBanner');
    if (banner) {
      banner.className = 'alert-banner active banner-human';
      banner.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:1.4rem;">🚨</span>
          <span><strong>TACTICAL BREACH IN ${camId}</strong>: Human Infiltrator locked on ${camName} [${target.coords}]. Threat: CRITICAL.</span>
        </div>
        <button class="btn btn-ghost" onclick="window.alertSystem.silenceAlarm()" style="color:#fff; border-color:rgba(255,255,255,0.4); font-size:0.75rem;">ACKNOWLEDGE & SILENCE</button>
      `;
    }

    // 3. Highlight Camera Tile
    const cardEl = document.querySelector(`.camera-card[data-cam="cam2"]`);
    if (cardEl) {
      cardEl.classList.add('camera-alert-active');
    }

    // 4. Add to Incident Feed
    const incident = {
      id: `INC-H${1000 + this.humanAlertCount}`,
      type: 'human',
      title: `[${camId}] HUMAN INTRUDER CONFIRMED`,
      msg: `Neural vision frequency lock on human target [Conf: ${(target.confidence * 100).toFixed(1)}%] at ${camName}. Audible Siren Triggered. Autonomous QRF Intercept Dispatched.`,
      timestamp: timestamp,
      sector: camName,
      badgeClass: 'badge-human',
      itemClass: 'human-threat',
      ruleNote: `⚠️ ALARM ACTIVE ON ${camId}`
    };

    this.addIncident(incident);
    this.updateSummaryPills();
  }

  /**
   * ⛏️ RULE 2: Underground Digging Activity -> Audible Seismic Alarm + Purple Banner on CAM-04
   */
  handleTunnelDetection(data) {
    this.tunnelAlertCount++;
    this.activeAlarm = true;
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const camId = data.cameraId || 'CAM-04';
    const camRadius = data.cameraRadius || 74.6;

    // 1. Play Dedicated Underground Digging Alarm & Subterranean Drill Sounds
    if (window.tacticalAudio) {
      window.tacticalAudio.startDiggingAlarm();
    }

    // 2. Activate Strobe Banner with Camera ID & Radius
    const banner = document.getElementById('globalAlertBanner');
    if (banner) {
      banner.className = 'alert-banner active banner-tunnel';
      banner.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:1.4rem;">⛏️</span>
          <span><strong>SUB-SURFACE DIGGING ALARM IN ${camId}</strong>: Detected within <strong>${camRadius}m Radius</strong> of ${camId} | Depth: -${data.depth}m | Acoustic DAS Armed.</span>
        </div>
        <button class="btn btn-ghost" onclick="window.alertSystem.silenceAlarm()" style="color:#fff; border-color:rgba(255,255,255,0.4); font-size:0.75rem;">ACKNOWLEDGE & SILENCE</button>
      `;
    }

    // 3. Highlight CAM-04 Card
    const cardEl = document.querySelector(`.camera-card[data-cam="cam4"]`);
    if (cardEl) {
      cardEl.classList.add('camera-tunnel-active');
    }

    // 4. Update Geophone Nodes in UI
    const nodes = document.querySelectorAll('.geophone-node');
    nodes.forEach((node, idx) => {
      if (idx >= 5 && idx <= 8) {
        node.classList.add('active-drill');
      } else {
        node.classList.remove('active-drill');
      }
    });

    const incident = {
      id: `SEIS-T${1000 + this.tunnelAlertCount}`,
      type: 'tunnel',
      title: `[${camId}] SUB-SURFACE DIGGING (RADIUS: ${camRadius}m)`,
      msg: `${data.type} detected at acoustic frequency ${data.freqBand}. Triangulated Depth: -${data.depth}m directly within ${camRadius}m radius of ${camId} (Sector Delta). Slew-to-Cue Locked.`,
      timestamp: timestamp,
      sector: data.cameraSector || 'Sector Delta',
      badgeClass: 'badge-tunnel',
      itemClass: 'tunnel-threat',
      ruleNote: `⛏️ SEISMIC ALARM SOUNDING ON ${camId}`
    };

    this.addIncident(incident);
    this.updateSummaryPills();
  }

  /**
   * 🐾 RULE 3: Wildlife Detected -> STRICTLY NO ALARM / NO SIREN (Silent SMS Only)
   */
  triggerAnimalSilentNotification(target, camId, camName, timestamp) {
    this.animalAlertCount++;

    // 1. Play gentle radio telemetry chirp (NO SIREN)
    if (window.tacticalAudio) {
      window.tacticalAudio.playTelemetryChirp();
    }

    const incident = {
      id: `NOTIF-A${1000 + this.animalAlertCount}`,
      type: 'animal',
      title: `[${camId}] WILDLIFE DETECTED (NO ALARM)`,
      msg: `Classified as ${target.name} [Conf: ${(target.confidence * 100).toFixed(1)}%] on ${camName}. Behavioral model confirms non-human fauna. Automated SATCOM/SMS sent to Forest Rangers.`,
      timestamp: timestamp,
      sector: camName,
      badgeClass: 'badge-animal',
      itemClass: 'animal-silent',
      ruleNote: `🛡️ SILENT SMS SENT FOR ${camId} (Alarm Suppressed)`
    };

    this.addIncident(incident);
    this.updateSummaryPills();

    this.showSilentToast(target.name, camId);
  }

  silenceAlarm() {
    this.activeAlarm = false;
    if (window.tacticalAudio) {
      window.tacticalAudio.stopAlarmSiren();
      window.tacticalAudio.stopDiggingAlarm();
    }
    const banner = document.getElementById('globalAlertBanner');
    if (banner) {
      banner.className = 'alert-banner';
      banner.innerHTML = '';
    }

    document.querySelectorAll('.camera-card').forEach(card => {
      card.classList.remove('camera-alert-active', 'camera-tunnel-active');
    });
  }

  addIncident(incident) {
    this.incidents.unshift(incident);
    if (this.incidents.length > 50) this.incidents.pop();

    const feedEl = document.getElementById('incidentFeed');
    if (!feedEl) return;

    const itemEl = document.createElement('div');
    itemEl.className = `incident-item ${incident.itemClass}`;
    itemEl.innerHTML = `
      <div class="incident-header">
        <span class="incident-badge ${incident.badgeClass}">${incident.title}</span>
        <span>${incident.timestamp}</span>
      </div>
      <div class="incident-msg">${incident.msg}</div>
      <div class="incident-rule-note">${incident.ruleNote}</div>
    `;

    feedEl.prepend(itemEl);
  }

  showSilentToast(animalName, camId) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: rgba(16, 185, 129, 0.95);
      color: #022c22;
      padding: 10px 16px;
      border-radius: 8px;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      font-weight: 700;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: slideInIncident 0.3s ease;
    `;
    toast.innerHTML = `📱 <strong>[${camId}] SILENT SMS SENT</strong>: ${animalName} logged. Alarm suppressed.`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s ease';
      setTimeout(() => toast.remove(), 500);
    }, 3500);
  }

  renderInitialLogs() {
    this.addIncident({
      id: 'SYS-INIT',
      type: 'animal',
      title: '4-CAMERA DEFENSE GRID ONLINE',
      msg: 'CAM-01 (North Ridge), CAM-02 (Canyon), CAM-03 (River Basin), and CAM-04 (Subsurface DAS) connected and synchronizing live telemetry.',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      sector: 'All Sectors',
      badgeClass: 'badge-animal',
      itemClass: 'animal-silent',
      ruleNote: '✓ Multi-Camera Tracking & Digging Alarm Armed'
    });
  }

  updateSummaryPills() {
    const humEl = document.getElementById('metricHumanThreats');
    if (humEl) humEl.textContent = this.humanAlertCount;
    const animEl = document.getElementById('metricAnimalLogged');
    if (animEl) animEl.textContent = this.animalAlertCount;
    const tunEl = document.getElementById('metricTunnelAlerts');
    if (tunEl) tunEl.textContent = this.tunnelAlertCount;
  }
}

window.alertSystem = new TacticalAlertSystem();
