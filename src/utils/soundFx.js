// Web Audio API micro-sound engine (Zero external audio files, 100% lightweight & instantaneous)

let audioCtx = null;
let isMuted = false;

// Initialize on first user interaction to comply with browser autoplay policies
function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function getMuteState() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('sound_muted');
    if (stored !== null) {
      isMuted = stored === 'true';
    }
  }
  return isMuted;
}

export function toggleSound() {
  isMuted = !isMuted;
  if (typeof window !== 'undefined') {
    localStorage.setItem('sound_muted', isMuted ? 'true' : 'false');
  }
  return !isMuted;
}

// Gentle mechanical click (Linear / Apple style)
export function playClick() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(620, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Graceful fallback
  }
}

// Paper / scratch friction sound for Scratch card
let lastScratchTime = 0;
export function playScratch() {
  if (isMuted) return;
  const now = Date.now();
  if (now - lastScratchTime < 45) return; // Throttle sound frequency
  lastScratchTime = now;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const bufferSize = ctx.sampleRate * 0.03; // 30ms burst
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.03;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800 + Math.random() * 600;
    filter.Q.value = 2.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.025, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch {
    // Graceful fallback
  }
}

// Elegant unlock / success chime (C5 -> E5 -> G5 chord)
export function playSuccess() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.06);
      osc.stop(ctx.currentTime + idx * 0.06 + 0.35);
    });
  } catch {
    // Graceful fallback
  }
}

// Telemetry incident beep
export function playAlert() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.setValueAtTime(260, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  } catch {
    // Graceful fallback
  }
}

// Interactive Cockpit Engine / Turbo synthesizer
let engineOsc = null;
let engineGain = null;
let engineFilter = null;

export function startEngineSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    if (engineOsc) return;
    engineOsc = ctx.createOscillator();
    engineGain = ctx.createGain();
    engineFilter = ctx.createBiquadFilter();

    engineOsc.type = 'sawtooth';
    engineOsc.frequency.setValueAtTime(65, ctx.currentTime);

    engineFilter.type = 'lowpass';
    engineFilter.frequency.setValueAtTime(300, ctx.currentTime);

    engineGain.gain.setValueAtTime(0.02, ctx.currentTime);

    engineOsc.connect(engineFilter);
    engineFilter.connect(engineGain);
    engineGain.connect(ctx.destination);
    engineOsc.start();
  } catch {
    // Graceful fallback
  }
}

export function updateEnginePitch(ratio) {
  if (isMuted || !engineOsc || !audioCtx) return;
  try {
    const targetFreq = 70 + ratio * 240; // 70Hz -> 310Hz
    const targetFilter = 250 + ratio * 800; // filter opens up with speed
    engineOsc.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.05);
    if (engineFilter) {
      engineFilter.frequency.setTargetAtTime(targetFilter, audioCtx.currentTime, 0.05);
    }
    if (engineGain) {
      const vol = 0.02 + ratio * 0.035;
      engineGain.gain.setTargetAtTime(vol, audioCtx.currentTime, 0.05);
    }
  } catch {
    // Graceful fallback
  }
}

export function stopEngineSound() {
  if (!audioCtx) return;
  try {
    if (engineGain) {
      engineGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.1);
    }
    setTimeout(() => {
      if (engineOsc) {
        try { engineOsc.stop(); } catch {}
        engineOsc = null;
        engineGain = null;
        engineFilter = null;
      }
    }, 120);
  } catch {
    engineOsc = null;
    engineGain = null;
    engineFilter = null;
  }
}

