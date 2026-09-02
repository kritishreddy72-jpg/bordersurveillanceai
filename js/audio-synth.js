/**
 * AURA-BORDER AI - Web Audio API Tactical Sound Synthesizer
 * Generates human intrusion sirens, underground digging seismic alarms,
 * subterranean drill acoustics, and wildlife radio telemetry chirps.
 */

class TacticalAudioSynth {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    
    // Human Siren State
    this.sirenOsc = null;
    this.sirenGain = null;
    this.sirenInterval = null;
    this.isSirenPlaying = false;

    // Underground Digging Alarm & Acoustic State
    this.isDiggingAlarmPlaying = false;
    this.diggingAlarmInterval = null;
    this.diggingSoundInterval = null;
    this.diggingOsc = null;
    this.diggingGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAlarmSiren();
      this.stopDiggingAlarm();
    }
    return this.isMuted;
  }

  /**
   * 🚨 1. Human Intrusion Tactical Alarm Siren (Two-tone rapid sweep)
   */
  startAlarmSiren() {
    if (this.isMuted || this.isSirenPlaying) return;
    this.init();

    this.isSirenPlaying = true;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(650, now);
    gain.gain.setValueAtTime(0.16, now);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    
    let high = true;
    this.sirenInterval = setInterval(() => {
      if (!this.isSirenPlaying || !this.ctx) return;
      const t = this.ctx.currentTime;
      if (high) {
        osc.frequency.exponentialRampToValueAtTime(950, t + 0.22);
      } else {
        osc.frequency.exponentialRampToValueAtTime(550, t + 0.22);
      }
      high = !high;
    }, 260);

    this.sirenOsc = osc;
    this.sirenGain = gain;
  }

  stopAlarmSiren() {
    if (!this.isSirenPlaying) return;
    this.isSirenPlaying = false;
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
    if (this.sirenOsc) {
      try {
        this.sirenGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
        setTimeout(() => {
          try {
            this.sirenOsc.stop();
            this.sirenOsc.disconnect();
          } catch(e) {}
        }, 100);
      } catch (e) {}
    }
  }

  /**
   * ⛏️ 2. Underground Digging Alarm & Subterranean Drill Sound
   * Heavy pulsing low-frequency seismic klaxon + realistic mechanical drill impacts
   */
  startDiggingAlarm() {
    if (this.isMuted || this.isDiggingAlarmPlaying) return;
    this.init();
    this.isDiggingAlarmPlaying = true;

    // A. Subterranean Pulsing Seismic Klaxon Alarm (Low pulsing alert tone)
    const playSeismicPulse = () => {
      if (!this.isDiggingAlarmPlaying || !this.ctx || this.isMuted) return;
      const t = this.ctx.currentTime;

      // Dual square/saw alert buzzer
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, t);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.linearRampToValueAtTime(180, t + 0.4);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.48);
    };

    // B. Low-Frequency Underground Digging / Drill Thump Sound
    const playDiggingThud = () => {
      if (!this.isDiggingAlarmPlaying || !this.ctx || this.isMuted) return;
      const t = this.ctx.currentTime;

      // Heavy bass impact
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      const bassFilter = this.ctx.createBiquadFilter();

      bassFilter.type = 'lowpass';
      bassFilter.frequency.setValueAtTime(120, t);

      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(85, t);
      bassOsc.frequency.exponentialRampToValueAtTime(28, t + 0.35);

      bassGain.gain.setValueAtTime(0.28, t);
      bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      bassGain.connect(this.ctx.destination);

      bassOsc.start(t);
      bassOsc.stop(t + 0.38);

      // Rotary Drill harmonic hiss
      const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.12, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseBuffer.length; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.08;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(950, t);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.04, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);
    };

    playSeismicPulse();
    playDiggingThud();

    this.diggingAlarmInterval = setInterval(playSeismicPulse, 700);
    this.diggingSoundInterval = setInterval(playDiggingThud, 550);
  }

  stopDiggingAlarm() {
    if (!this.isDiggingAlarmPlaying) return;
    this.isDiggingAlarmPlaying = false;
    if (this.diggingAlarmInterval) {
      clearInterval(this.diggingAlarmInterval);
      this.diggingAlarmInterval = null;
    }
    if (this.diggingSoundInterval) {
      clearInterval(this.diggingSoundInterval);
      this.diggingSoundInterval = null;
    }
  }

  /**
   * 🐾 3. Silent Radio Telemetry Chirp (For Animal / Ranger Notification)
   */
  playTelemetryChirp() {
    if (this.isMuted) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1320, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  playClick() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }
}

window.tacticalAudio = new TacticalAudioSynth();
