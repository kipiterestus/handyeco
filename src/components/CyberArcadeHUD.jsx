import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  RotateCcw, 
  Sparkles, 
  Zap, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Bot
} from 'lucide-react';
import { playClick, playSuccess, playAlert } from '../utils/soundFx';

const TARGET_ORBS = [
  { id: 'react', label: 'React 19', color: '#38bdf8', points: 150 },
  { id: 'speed', label: '0.4s LCP', color: '#34d399', points: 200 },
  { id: 'ai', label: 'AI Builder', color: '#818cf8', points: 250 },
  { id: 'uptime', label: '99.9% Uptime', color: '#fbbf24', points: 150 },
  { id: 'ideal', label: 'iDEAL & Mollie', color: '#f43f5e', points: 200 },
];

export default function CyberArcadeHUD() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [score, setScore] = useState(0);
  const [collectedCount, setCollectedCount] = useState(0);
  const [isVictory, setIsVictory] = useState(false);
  const [autoPilot, setAutoPilot] = useState(false);

  // Ship and Game State
  const shipRef = useRef({
    x: 150,
    y: 130,
    vx: 0,
    vy: 0,
    angle: 0,
    speed: 3.5,
    trail: [],
  });

  const orbsRef = useRef([]);
  const keysRef = useRef({ up: false, down: false, left: false, right: false, boost: false });
  const particlesRef = useRef([]);

  // Initialize orbs in arena
  const initOrbs = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;

    orbsRef.current = TARGET_ORBS.map((orb, i) => {
      const pad = 40;
      return {
        ...orb,
        x: pad + Math.random() * (width - pad * 2),
        y: pad + Math.random() * (height - pad * 2),
        radius: 20,
        collected: false,
        pulse: i * 0.8,
      };
    });

    shipRef.current.x = width / 2;
    shipRef.current.y = height / 2;
    shipRef.current.vx = 0;
    shipRef.current.vy = 0;
    shipRef.current.trail = [];
    particlesRef.current = [];

    setScore(0);
    setCollectedCount(0);
    setIsVictory(false);
  }, []);

  useEffect(() => {
    initOrbs();
    window.addEventListener('resize', initOrbs);
    return () => window.removeEventListener('resize', initOrbs);
  }, [initOrbs]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const k = e.key.toLowerCase();
      if (['arrowup', 'w'].includes(k)) keysRef.current.up = true;
      if (['arrowdown', 's'].includes(k)) keysRef.current.down = true;
      if (['arrowleft', 'a'].includes(k)) keysRef.current.left = true;
      if (['arrowright', 'd'].includes(k)) keysRef.current.right = true;
      if (e.key === ' ') {
        e.preventDefault();
        keysRef.current.boost = true;
      }
    };

    const handleKeyUp = (e) => {
      const k = e.key.toLowerCase();
      if (['arrowup', 'w'].includes(k)) keysRef.current.up = false;
      if (['arrowdown', 's'].includes(k)) keysRef.current.down = false;
      if (['arrowleft', 'a'].includes(k)) keysRef.current.left = false;
      if (['arrowright', 'd'].includes(k)) keysRef.current.right = false;
      if (e.key === ' ') keysRef.current.boost = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main game loop (Canvas)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animId;
    const ctx = canvas.getContext('2d');

    const loop = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);
      }

      ctx.clearRect(0, 0, width, height);

      const ship = shipRef.current;
      const keys = keysRef.current;
      const orbs = orbsRef.current;

      // Auto-pilot logic (chases nearest uncollected orb)
      if (autoPilot) {
        const activeOrb = orbs.find((o) => !o.collected);
        if (activeOrb) {
          const dx = activeOrb.x - ship.x;
          const dy = activeOrb.y - ship.y;
          const targetAngle = Math.atan2(dy, dx);
          ship.angle = targetAngle;
          ship.vx += Math.cos(targetAngle) * 0.45;
          ship.vy += Math.sin(targetAngle) * 0.45;
        }
      } else {
        // Player manual controls
        const accel = keys.boost ? 0.75 : 0.45;
        if (keys.up) ship.vy -= accel;
        if (keys.down) ship.vy += accel;
        if (keys.left) ship.vx -= accel;
        if (keys.right) ship.vx += accel;
      }

      // Physics damping
      ship.vx *= 0.94;
      ship.vy *= 0.94;

      ship.x += ship.vx;
      ship.y += ship.vy;

      // Update orientation angle based on velocity
      if (Math.hypot(ship.vx, ship.vy) > 0.2) {
        ship.angle = Math.atan2(ship.vy, ship.vx);
      }

      // Boundary wraps / bounces
      if (ship.x < 15) { ship.x = 15; ship.vx = -ship.vx * 0.5; }
      if (ship.x > width - 15) { ship.x = width - 15; ship.vx = -ship.vx * 0.5; }
      if (ship.y < 15) { ship.y = 15; ship.vy = -ship.vy * 0.5; }
      if (ship.y > height - 15) { ship.y = height - 15; ship.vy = -ship.vy * 0.5; }

      // Trail record
      ship.trail.push({ x: ship.x, y: ship.y });
      if (ship.trail.length > 12) ship.trail.shift();

      // Draw light trail
      ctx.beginPath();
      ship.trail.forEach((t, i) => {
        ctx.strokeStyle = `rgba(56, 189, 248, ${i / 15})`;
        ctx.lineWidth = i * 0.6;
        if (i === 0) ctx.moveTo(t.x, t.y);
        else ctx.lineTo(t.x, t.y);
      });
      ctx.stroke();

      // Check collision with orbs
      orbs.forEach((orb) => {
        if (!orb.collected) {
          const dist = Math.hypot(ship.x - orb.x, ship.y - orb.y);
          if (dist < orb.radius + 14) {
            orb.collected = true;
            playSuccess();

            // Spawn celebration particles
            for (let p = 0; p < 18; p++) {
              const pAngle = Math.random() * Math.PI * 2;
              const pSpeed = 1.5 + Math.random() * 4;
              particlesRef.current.push({
                x: orb.x,
                y: orb.y,
                vx: Math.cos(pAngle) * pSpeed,
                vy: Math.sin(pAngle) * pSpeed,
                color: orb.color,
                life: 30,
              });
            }

            setScore((s) => s + orb.points);
            setCollectedCount((c) => {
              const next = c + 1;
              if (next >= TARGET_ORBS.length) {
                setIsVictory(true);
              }
              return next;
            });
          }
        }
      });

      // Draw Orbs
      orbs.forEach((orb) => {
        if (!orb.collected) {
          orb.pulse += 0.05;
          const currentRadius = orb.radius + Math.sin(orb.pulse) * 2;

          ctx.save();
          ctx.shadowColor = orb.color;
          ctx.shadowBlur = 18;

          // Glowing Orb Ring
          ctx.strokeStyle = orb.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, currentRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Center core
          ctx.fillStyle = orb.color;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0;

          // Label text
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(orb.label, orb.x, orb.y + 32);

          ctx.restore();
        }
      });

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw Player Ship (Neon Builder Drone)
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.angle);

      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 18;

      // Futuristic triangle ship shape
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(-10, -9);
      ctx.lineTo(-5, 0);
      ctx.lineTo(-10, 9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Reactor engine flame
      if (Math.hypot(ship.vx, ship.vy) > 0.5) {
        ctx.fillStyle = '#34d399';
        ctx.beginPath();
        ctx.moveTo(-6, 0);
        ctx.lineTo(-14, -3);
        ctx.lineTo(-18, 0);
        ctx.lineTo(-14, 3);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [autoPilot]);

  // Virtual D-pad clickers
  const triggerDir = (dir, isDown) => {
    keysRef.current[dir] = isDown;
    if (isDown) playClick();
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 relative select-none">
      
      {/* Top Arcade HUD Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 mb-2 rounded-2xl bg-slate-900/90 border border-indigo-500/30 backdrop-blur-md text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping"></span>
          <span className="text-indigo-400 font-bold flex items-center gap-1.5">
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            KONSEPT 2 / 4: RETRO CYBER-ARCADE HUD
          </span>
          <span className="text-slate-500 hidden sm:inline">• Tuşlar: W-A-S-D veya Oklar</span>
        </div>

        {/* Score & Mission Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-emerald-400 font-bold">
            <Trophy className="w-3.5 h-3.5" />
            <span>SKOR: {score} XP</span>
          </div>

          <span className="text-slate-400">
            HEDEF: <strong className="text-blue-400">{collectedCount}/{TARGET_ORBS.length}</strong>
          </span>

          <button
            onClick={() => {
              playClick();
              setAutoPilot((a) => !a);
            }}
            className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1 transition-all cursor-pointer ${
              autoPilot 
                ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/30' 
                : 'bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>{autoPilot ? 'Oto-Pilot ON' : 'Oto-Pilot'}</span>
          </button>

          <button
            onClick={() => {
              playClick();
              initOrbs();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Yeniden Başlat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Arcade Arena (Canvas) */}
      <div 
        ref={containerRef}
        className="relative w-full h-[280px] sm:h-[320px] rounded-3xl overflow-hidden border border-indigo-500/20 bg-gradient-to-b from-[#090D1C] via-[#070A14] to-[#05070E] shadow-2xl touch-none"
      >
        {/* Retro scanline & grid effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/5 to-transparent pointer-events-none" />

        {/* Canvas Screen */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Victory Overlay Screen */}
        {isVictory && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-3 animate-bounce">
              <Trophy className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mb-1">
              GÖREV TAMAMLANDI! (100% PRODUCTION READY)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-4 font-mono">
              Tüm teknoloji modülleri toplandı. Toplam Skor: <span className="text-emerald-400 font-bold">{score} XP</span>
            </p>
            <button
              onClick={() => {
                playClick();
                initOrbs();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 cursor-pointer active:scale-95"
            >
              Tekrar Oyna
            </button>
          </div>
        )}

        {/* On-Screen Mobile Virtual D-Pad (Touch & Click Friendly) */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
          <button
            onMouseDown={() => triggerDir('up', true)}
            onMouseUp={() => triggerDir('up', false)}
            onTouchStart={(e) => { e.preventDefault(); triggerDir('up', true); }}
            onTouchEnd={(e) => { e.preventDefault(); triggerDir('up', false); }}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 active:bg-blue-600 border border-white/10 text-white flex items-center justify-center cursor-pointer shadow-md"
            aria-label="Up"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <div className="flex gap-1">
            <button
              onMouseDown={() => triggerDir('left', true)}
              onMouseUp={() => triggerDir('left', false)}
              onTouchStart={(e) => { e.preventDefault(); triggerDir('left', true); }}
              onTouchEnd={(e) => { e.preventDefault(); triggerDir('left', false); }}
              className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 active:bg-blue-600 border border-white/10 text-white flex items-center justify-center cursor-pointer shadow-md"
              aria-label="Left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onMouseDown={() => triggerDir('down', true)}
              onMouseUp={() => triggerDir('down', false)}
              onTouchStart={(e) => { e.preventDefault(); triggerDir('down', true); }}
              onTouchEnd={(e) => { e.preventDefault(); triggerDir('down', false); }}
              className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 active:bg-blue-600 border border-white/10 text-white flex items-center justify-center cursor-pointer shadow-md"
              aria-label="Down"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onMouseDown={() => triggerDir('right', true)}
              onMouseUp={() => triggerDir('right', false)}
              onTouchStart={(e) => { e.preventDefault(); triggerDir('right', true); }}
              onTouchEnd={(e) => { e.preventDefault(); triggerDir('right', false); }}
              className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 active:bg-blue-600 border border-white/10 text-white flex items-center justify-center cursor-pointer shadow-md"
              aria-label="Right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
