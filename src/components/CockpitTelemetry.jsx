import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Gauge, 
  Zap, 
  Flame, 
  Activity, 
  RotateCcw, 
  Sliders, 
  Cpu, 
  CheckCircle2, 
  ShieldAlert,
  Wind
} from 'lucide-react';
import { 
  playClick, 
  playSuccess, 
  playAlert, 
  startEngineSound, 
  updateEnginePitch, 
  stopEngineSound 
} from '../utils/soundFx';

export default function CockpitTelemetry() {
  const [speed, setSpeed] = useState(0); // 0 to 360 km/h
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [isNitro, setIsNitro] = useState(false);
  const [gear, setGear] = useState(1);
  const [peakSpeed, setPeakSpeed] = useState(0);

  // Performance toggles
  const [edgeCache, setEdgeCache] = useState(true);
  const [http3, setHttp3] = useState(true);
  const [aiTurbo, setAiTurbo] = useState(false);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const speedRef = useRef(0);
  const isAccelRef = useRef(false);
  const isNitroRef = useRef(false);
  const starsRef = useRef([]);

  // Sync refs for animation frame loop
  useEffect(() => {
    isAccelRef.current = isAccelerating;
  }, [isAccelerating]);

  useEffect(() => {
    isNitroRef.current = isNitro;
  }, [isNitro]);

  // Starfield warp lines setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Generate warp stars
    const starCount = 60;
    starsRef.current = Array.from({ length: starCount }, () => ({
      x: (Math.random() - 0.5) * canvas.width,
      y: (Math.random() - 0.5) * canvas.height,
      z: Math.random() * canvas.width,
      pz: Math.random() * canvas.width
    }));

    let lastTime = performance.now();

    const loop = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const topLimit = 300 + (edgeCache ? 30 : 0) + (http3 ? 20 : 0) + (aiTurbo ? 35 : 0);

      // Speed physics
      if (isNitroRef.current) {
        speedRef.current = Math.min(topLimit, speedRef.current + 280 * dt);
      } else if (isAccelRef.current) {
        const accelRate = 140 + (aiTurbo ? 40 : 0);
        speedRef.current = Math.min(topLimit, speedRef.current + accelRate * dt);
      } else {
        // Decelerate smoothly
        speedRef.current = Math.max(0, speedRef.current - 120 * dt);
      }

      const currentSpeed = speedRef.current;
      setSpeed(Math.round(currentSpeed));
      setPeakSpeed(prev => Math.max(prev, Math.round(currentSpeed)));

      // Gear calculation
      const calculatedGear = currentSpeed < 40 ? 1 : 
                            currentSpeed < 100 ? 2 : 
                            currentSpeed < 170 ? 3 : 
                            currentSpeed < 240 ? 4 : 
                            currentSpeed < 300 ? 5 : 6;
      setGear(calculatedGear);

      // Sound update
      const speedRatio = Math.min(1, currentSpeed / 360);
      updateEnginePitch(speedRatio);

      // Render warp streak canvas
      ctx.fillStyle = 'rgba(11, 15, 25, 0.45)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const warpFactor = 1 + (currentSpeed / 30);

      ctx.fillStyle = currentSpeed > 260 ? '#67e8f9' : '#38bdf8';
      ctx.strokeStyle = currentSpeed > 260 ? 'rgba(99, 102, 241, 0.7)' : 'rgba(56, 189, 248, 0.4)';

      starsRef.current.forEach(star => {
        star.pz = star.z;
        star.z -= warpFactor;

        if (star.z <= 0) {
          star.z = canvas.width;
          star.pz = star.z;
          star.x = (Math.random() - 0.5) * canvas.width;
          star.y = (Math.random() - 0.5) * canvas.height;
        }

        const k = 180 / star.z;
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        const pk = 180 / star.pz;
        const prevX = star.x * pk + cx;
        const prevY = star.y * pk + cy;

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          const streakLen = Math.hypot(px - prevX, py - prevY);
          if (streakLen > 1.5 && currentSpeed > 30) {
            ctx.beginPath();
            ctx.lineWidth = Math.min(3, 0.8 + (currentSpeed / 120));
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(px, py);
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.arc(px, py, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      stopEngineSound();
    };
  }, [edgeCache, http3, aiTurbo]);

  // Handlers for throttle
  const handleStartAccel = () => {
    setIsAccelerating(true);
    startEngineSound();
  };

  const handleStopAccel = () => {
    setIsAccelerating(false);
    if (!isNitro) {
      stopEngineSound();
    }
  };

  const triggerNitro = () => {
    if (isNitro) return;
    setIsNitro(true);
    startEngineSound();
    playAlert();
    setTimeout(() => {
      setIsNitro(false);
      if (!isAccelRef.current) {
        stopEngineSound();
      }
    }, 2800);
  };

  // Speedometer needle angle calculation (-120deg to +120deg)
  const maxDial = 360;
  const speedPercentage = Math.min(1, speed / maxDial);
  const needleAngle = -120 + speedPercentage * 240;

  // Web metrics derived from velocity
  const lcpMetric = speed === 0 ? '1.82s' : (Math.max(0.35, 1.82 - (speed / 360) * 1.45)).toFixed(2) + 's';
  const throughput = Math.round(speed * 52); // up to ~18,000 req/s
  const lighthouseScore = Math.min(100, Math.round(88 + (speed / 360) * 12));

  const isRedlining = speed > 270;

  return (
    <div className="w-full max-w-4xl mx-auto my-6 select-none font-sans">
      <div 
        className={`relative overflow-hidden rounded-3xl border transition-all duration-300 bg-slate-950/90 backdrop-blur-xl shadow-2xl ${
          isRedlining 
            ? 'border-rose-500/50 shadow-rose-500/20 animate-pulse' 
            : 'border-blue-500/30 shadow-blue-500/10'
        }`}
      >
        {/* Background Speed Starfield Canvas */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
        />

        {/* Top Cockpit Header Bar */}
        <div className="relative z-10 flex items-center justify-between px-5 py-3 border-b border-white/10 bg-slate-900/60 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                  Telemetry Core
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  <Activity className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                  LIVE DIAL
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                High-Performance Web Architecture Cluster
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end font-mono text-[11px]">
              <span className="text-slate-400">PEAK SPEED</span>
              <span className="font-bold text-amber-400">{peakSpeed} km/h</span>
            </div>

            <button
              onClick={() => {
                speedRef.current = 0;
                setSpeed(0);
                setPeakSpeed(0);
                playClick();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
              title="Reset telemetry"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Main Cockpit Cluster Body */}
        <div className="relative z-10 p-5 sm:p-7 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Live Performance Readouts */}
          <div className="md:col-span-4 flex flex-col gap-2.5 order-2 md:order-1">
            
            {/* LCP Gauge Card */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span>LARGEST CONTENTFUL PAINT</span>
                <span className={`font-bold ${parseFloat(lcpMetric) < 0.8 ? 'text-emerald-400' : 'text-blue-400'}`}>
                  {parseFloat(lcpMetric) < 0.8 ? 'SUB-SECOND' : 'NORMAL'}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-white tracking-tight">
                  {lcpMetric}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Target: &lt; 0.6s
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-100"
                  style={{ width: `${Math.min(100, Math.max(15, (1 - parseFloat(lcpMetric) / 1.82) * 100))}%` }}
                />
              </div>
            </div>

            {/* Throughput Card */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span>CONCURRENT REQUESTS</span>
                <span className="text-cyan-400 font-bold">EDGE CDN</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-white tracking-tight">
                  {throughput.toLocaleString()} <span className="text-xs text-slate-400 font-normal">req/s</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  0 Drops
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-100"
                  style={{ width: `${Math.min(100, (throughput / 18000) * 100)}%` }}
                />
              </div>
            </div>

            {/* Lighthouse Card */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span>LIGHTHOUSE SCORE</span>
                <span className="text-amber-400 font-bold">{lighthouseScore === 100 ? 'PERFECT' : 'OPTIMIZING'}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">
                  {lighthouseScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  SEO & PWA 100%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-100"
                  style={{ width: `${lighthouseScore}%` }}
                />
              </div>
            </div>

          </div>

          {/* Center Column: The Analog & Digital Speedometer Dial */}
          <div className="md:col-span-4 flex flex-col items-center justify-center order-1 md:order-2">
            
            <div className="relative w-60 h-60 sm:w-64 sm:h-64 flex items-center justify-center">
              
              {/* Outer Speed Dial SVG */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Background Ring Track */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-800/80"
                  strokeDasharray={`${(240 / 360) * 502} 502`}
                  strokeDashoffset="-63"
                  strokeLinecap="round"
                />

                {/* Active Colored Arc */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="url(#speedGradient)"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={`${(speedPercentage * (240 / 360)) * 502} 502`}
                  strokeDashoffset="-63"
                  strokeLinecap="round"
                  className="transition-all duration-75"
                />

                <defs>
                  <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="60%" stopColor="#818cf8" />
                    <stop offset="85%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f43f5e" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Ticks and Markings */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative w-full h-full">
                  {[0, 60, 120, 180, 240, 300, 360].map((tickVal) => {
                    const tickPct = tickVal / 360;
                    const angleDeg = -120 + tickPct * 240;
                    return (
                      <div 
                        key={tickVal}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{ transform: `rotate(${angleDeg}deg)` }}
                      >
                        <div className={`w-1 h-3 rounded-full mb-[150px] ${
                          tickVal >= 280 ? 'bg-rose-500' : 'bg-slate-500'
                        }`} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Physical Needle with glowing pivot */}
              <div 
                className="absolute w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-75"
                style={{ transform: `rotate(${needleAngle}deg)` }}
              >
                {/* Needle bar */}
                <div 
                  className={`w-1.5 h-20 rounded-full -translate-y-10 origin-bottom shadow-lg transition-colors ${
                    isRedlining 
                      ? 'bg-rose-500 shadow-rose-500/80' 
                      : 'bg-cyan-400 shadow-cyan-400/80'
                  }`} 
                />
              </div>

              {/* Center Digital Display Hub */}
              <div className="absolute w-36 h-36 rounded-full bg-slate-950/95 border border-white/15 flex flex-col items-center justify-center shadow-inner z-10">
                
                {/* Status Indicator Pill */}
                <div className="flex items-center gap-1 mb-0.5">
                  <span className={`text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full border ${
                    isNitro 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : isRedlining 
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  }`}>
                    {isNitro ? 'NITRO OVERDRIVE' : isRedlining ? 'REDLINE' : isAccelerating ? 'ACCELERATING' : 'IDLE'}
                  </span>
                </div>

                {/* Digital Speed Value */}
                <div className={`text-4xl sm:text-5xl font-black font-mono tracking-tight transition-colors ${
                  isRedlining ? 'text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]' : 'text-white'
                }`}>
                  {speed}
                </div>

                <div className="text-[10px] font-mono text-slate-400 tracking-wider">
                  KM/H • GEAR {gear}
                </div>

              </div>

            </div>

            {/* Gear Shift Dots */}
            <div className="flex items-center gap-1.5 mt-3">
              {[1, 2, 3, 4, 5, 6].map(g => (
                <div 
                  key={g} 
                  className={`w-4 h-1.5 rounded-full transition-colors ${
                    gear === g ? 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]' : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>

          </div>

          {/* Right Column: Interactive Hardware Controls */}
          <div className="md:col-span-4 flex flex-col gap-3 order-3">
            
            {/* The Main Throttle (GAS PEDAL) Button */}
            <button
              onMouseDown={handleStartAccel}
              onMouseUp={handleStopAccel}
              onMouseLeave={handleStopAccel}
              onTouchStart={handleStartAccel}
              onTouchEnd={handleStopAccel}
              className={`w-full py-5 px-4 rounded-2xl font-bold font-mono text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-95 shadow-xl select-none ${
                isAccelerating
                  ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 text-white shadow-blue-500/40 scale-[0.98]'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/25 hover:shadow-blue-600/40'
              }`}
            >
              <Zap className={`w-5 h-5 ${isAccelerating ? 'animate-bounce text-yellow-300' : ''}`} />
              <span>{isAccelerating ? 'ACCELERATING...' : 'HOLD TO ACCELERATE'}</span>
            </button>

            {/* NITRO Boost Button */}
            <button
              onClick={triggerNitro}
              disabled={isNitro}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border active:scale-95 ${
                isNitro
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-lg shadow-rose-500/30'
                  : 'bg-slate-900/90 hover:bg-rose-500/10 text-rose-400 border-rose-500/30 hover:border-rose-500/60'
              }`}
            >
              <Flame className={`w-4 h-4 ${isNitro ? 'animate-spin' : ''}`} />
              <span>{isNitro ? 'NITRO FIRING (3s)' : 'NITRO BOOST (LAUNCH)'}</span>
            </button>

            {/* Tuning Toggles */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col gap-2 mt-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span>Engine Optimization</span>
              </div>

              {/* Edge Cache Toggle */}
              <button
                onClick={() => {
                  setEdgeCache(!edgeCache);
                  playClick();
                }}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-white/5 text-xs font-mono transition-colors cursor-pointer"
              >
                <span className="text-slate-300">Global Edge Cache (+30 km/h)</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  edgeCache ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'
                }`}>
                  {edgeCache ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* HTTP/3 Toggle */}
              <button
                onClick={() => {
                  setHttp3(!http3);
                  playClick();
                }}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-white/5 text-xs font-mono transition-colors cursor-pointer"
              >
                <span className="text-slate-300">HTTP/3 Multiplex (+20 km/h)</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  http3 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'
                }`}>
                  {http3 ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* AI Accelerator Toggle */}
              <button
                onClick={() => {
                  setAiTurbo(!aiTurbo);
                  playClick();
                }}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-white/5 text-xs font-mono transition-colors cursor-pointer"
              >
                <span className="text-slate-300">AI Code Optimizer (+35 km/h)</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  aiTurbo ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-slate-700 text-slate-400'
                }`}>
                  {aiTurbo ? 'ON' : 'OFF'}
                </span>
              </button>

            </div>

          </div>

        </div>

        {/* Bottom Banner Status */}
        <div className="px-5 py-2.5 bg-slate-900/80 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>ARCHITECTURE: ASYNCHRONOUS HIGH-THROUGHPUT SYSTEM</span>
          </div>
          <div className="text-slate-500">
            PROVEN BENCHMARKS • ZERO CLUTTER
          </div>
        </div>

      </div>
    </div>
  );
}
