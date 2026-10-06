import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Flame, 
  Magnet, 
  Gamepad2,
  CheckCircle2
} from 'lucide-react';
import { playClick, playSuccess } from '../utils/soundFx';

const CAPSULES = [
  { id: 'react', label: '⚡ React 19', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.4)' },
  { id: 'speed', label: '🚀 0.4s LCP', color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)', border: 'rgba(52, 211, 153, 0.4)' },
  { id: 'ai', label: '🤖 AI Builder', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.15)', border: 'rgba(129, 140, 248, 0.4)' },
  { id: 'uptime', label: '🛡️ 99.9% Uptime', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.4)' },
  { id: 'ideal', label: '💳 iDEAL & Mollie', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)', border: 'rgba(244, 63, 94, 0.4)' },
  { id: 'tailwind', label: '🎨 Tailwind v4', color: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.15)', border: 'rgba(45, 212, 191, 0.4)' },
  { id: 'db', label: '📦 Supabase DB', color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.15)', border: 'rgba(167, 139, 250, 0.4)' },
];

export default function ZeroGPlayground() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [bounceCount, setBounceCount] = useState(0);
  const [magnetMode, setMagnetMode] = useState(false);
  const isDraggingRef = useRef(null); // capsule index
  const mousePosRef = useRef({ x: 0, y: 0 });
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const mouseVelRef = useRef({ x: 0, y: 0 });
  const nodesRef = useRef([]);

  // Initialize nodes with random velocities and positions
  const initNodes = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;

    nodesRef.current = CAPSULES.map((item, index) => {
      // Distribute evenly in a circular/oval orbit initially
      const angle = (index / CAPSULES.length) * Math.PI * 2;
      const radiusX = Math.min(width * 0.35, 260);
      const radiusY = Math.min(height * 0.35, 110);
      const x = width / 2 + Math.cos(angle) * radiusX;
      const y = height / 2 + Math.sin(angle) * radiusY;

      return {
        ...item,
        x,
        y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        w: 120, // approximated pill width
        h: 38,  // pill height
        isDragged: false,
      };
    });
  }, []);

  useEffect(() => {
    initNodes();
    window.addEventListener('resize', initNodes);
    return () => window.removeEventListener('resize', initNodes);
  }, [initNodes]);

  // Main physics loop (Canvas rendering)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animId;
    const ctx = canvas.getContext('2d');

    const updatePhysics = () => {
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

      const nodes = nodesRef.current;
      const mouse = mousePosRef.current;

      // Update velocities and positions
      nodes.forEach((node, i) => {
        if (node.isDragged) {
          node.x = mouse.x;
          node.y = mouse.y;
          node.vx = mouseVelRef.current.x * 0.8;
          node.vy = mouseVelRef.current.y * 0.8;
        } else {
          // Magnet mode: pull toward mouse
          if (magnetMode) {
            const dx = mouse.x - node.x;
            const dy = mouse.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist < 350) {
              const force = (350 - dist) / 350 * 0.4;
              node.vx += (dx / dist) * force;
              node.vy += (dy / dist) * force;
            }
          }

          // Gentle zero-g damping (air resistance)
          node.vx *= 0.985;
          node.vy *= 0.985;

          // Keep a minimal drift velocity so they never stop completely
          if (Math.abs(node.vx) < 0.2) node.vx += (Math.random() - 0.5) * 0.2;
          if (Math.abs(node.vy) < 0.2) node.vy += (Math.random() - 0.5) * 0.2;

          node.x += node.vx;
          node.y += node.vy;

          // Wall bounce (Elastic collisions)
          const halfW = node.w / 2;
          const halfH = node.h / 2;

          let bounced = false;
          if (node.x - halfW < 10) {
            node.x = 10 + halfW;
            node.vx = -node.vx * 0.85;
            bounced = true;
          } else if (node.x + halfW > width - 10) {
            node.x = width - 10 - halfW;
            node.vx = -node.vx * 0.85;
            bounced = true;
          }

          if (node.y - halfH < 10) {
            node.y = 10 + halfH;
            node.vy = -node.vy * 0.85;
            bounced = true;
          } else if (node.y + halfH > height - 10) {
            node.y = height - 10 - halfH;
            node.vy = -node.vy * 0.85;
            bounced = true;
          }

          if (bounced) {
            setBounceCount((c) => c + 1);
          }
        }
      });

      // Capsule-to-capsule collisions
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = 90; // distance threshold

          if (dist < minDist && dist > 0) {
            // Overlap resolution
            const overlap = (minDist - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;

            if (!a.isDragged) {
              a.x -= nx * overlap;
              a.y -= ny * overlap;
              a.vx -= nx * 0.6;
              a.vy -= ny * 0.6;
            }
            if (!b.isDragged) {
              b.x += nx * overlap;
              b.y += ny * overlap;
              b.vx += nx * 0.6;
              b.vy += ny * 0.6;
            }

            setBounceCount((c) => c + 1);
          }
        }
      }

      // Draw capsules on canvas with glowing glass styling
      nodes.forEach((node) => {
        const x = node.x - node.w / 2;
        const y = node.y - node.h / 2;
        const r = node.h / 2;

        ctx.save();

        // Capsule glow shadow
        ctx.shadowColor = node.color;
        ctx.shadowBlur = node.isDragged ? 25 : 12;

        // Capsule background
        ctx.fillStyle = node.isDragged ? 'rgba(15, 23, 42, 0.95)' : 'rgba(13, 17, 32, 0.85)';
        ctx.strokeStyle = node.isDragged ? node.color : node.border;
        ctx.lineWidth = node.isDragged ? 2 : 1.5;

        ctx.beginPath();
        ctx.roundRect(x, y, node.w, node.h, r);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Label text inside capsule
        ctx.fillStyle = node.isDragged ? '#ffffff' : node.color;
        ctx.font = '600 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y);

        ctx.restore();
      });

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, [magnetMode]);

  // Mouse & Touch Interaction handlers
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mousePosRef.current = { x, y };
    prevMousePosRef.current = { x, y };

    // Find clicked node
    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      const dx = Math.abs(x - node.x);
      const dy = Math.abs(y - node.y);
      if (dx < node.w / 2 && dy < node.h / 2) {
        node.isDragged = true;
        isDraggingRef.current = i;
        playClick();
        break;
      }
    }
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseVelRef.current = {
      x: x - prevMousePosRef.current.x,
      y: y - prevMousePosRef.current.y,
    };

    prevMousePosRef.current = { x, y };
    mousePosRef.current = { x, y };
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current !== null) {
      const node = nodesRef.current[isDraggingRef.current];
      if (node) {
        node.isDragged = false;
        // Fling velocity
        node.vx = Math.max(-15, Math.min(15, mouseVelRef.current.x * 0.9));
        node.vy = Math.max(-15, Math.min(15, mouseVelRef.current.y * 0.9));
      }
      isDraggingRef.current = null;
    }
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      e.preventDefault();
      const touch = e.touches[0];
      handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    }
  };

  // Action Buttons
  const handleBlast = () => {
    playSuccess();
    const container = containerRef.current;
    if (!container) return;
    const cx = container.clientWidth / 2;
    const cy = container.clientHeight / 2;

    nodesRef.current.forEach((node) => {
      const dx = node.x - cx || (Math.random() - 0.5);
      const dy = node.y - cy || (Math.random() - 0.5);
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const speed = 12 + Math.random() * 8;
      node.vx = (dx / dist) * speed;
      node.vy = (dy / dist) * speed;
    });
  };

  const handleToggleMagnet = () => {
    playClick();
    setMagnetMode((m) => !m);
  };

  const handleReset = () => {
    playClick();
    initNodes();
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 relative select-none">
      
      {/* Mini HUD Concept Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 mb-2 rounded-2xl bg-slate-900/80 border border-blue-500/20 backdrop-blur-md text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-blue-400 font-bold flex items-center gap-1.5">
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            KONSEPT 1 / 4: ZERO-G PHYSICS PLAYGROUND
          </span>
          <span className="text-slate-500 hidden sm:inline">• Tut & Fırlat!</span>
        </div>

        {/* Realtime Stats & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-slate-400">
            ÇARPMA: <strong className="text-emerald-400">{bounceCount}</strong>
          </span>

          <button
            onClick={handleBlast}
            className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 flex items-center gap-1 transition-all cursor-pointer active:scale-95"
            title="Tüm kapsülleri patlat!"
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="text-[11px]">Patlat!</span>
          </button>

          <button
            onClick={handleToggleMagnet}
            className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all cursor-pointer active:scale-95 ${
              magnetMode 
                ? 'bg-blue-600 text-white border-blue-400 shadow-sm shadow-blue-500/30' 
                : 'bg-slate-800 text-slate-300 border-white/10 hover:bg-slate-700'
            }`}
            title="Mıknatıs Modu"
          >
            <Magnet className="w-3.5 h-3.5" />
            <span className="text-[11px]">{magnetMode ? 'Mıknatıs ON' : 'Mıknatıs'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Yörüngeyi Sıfırla"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Physics Stage (Canvas Container) */}
      <div 
        ref={containerRef}
        className="relative w-full h-[260px] sm:h-[300px] rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#0B0F1C]/80 via-[#0A0D18]/90 to-[#080B14] shadow-2xl cursor-grab active:cursor-grabbing touch-none group"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Subtle grid background inside the physics chamber */}
        <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

        {/* Ambient center reactor glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />

        {/* Instruction Badge */}
        <div className="absolute top-3 left-4 text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Kapsülleri fareyle veya parmağınızla tutup fırlatın!</span>
        </div>

        {/* Interactive Physics Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

    </div>
  );
}
