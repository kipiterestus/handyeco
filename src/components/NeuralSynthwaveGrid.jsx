import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Sparkles, 
  Layers, 
  Radio, 
  Activity, 
  Zap, 
  Compass, 
  RotateCcw,
  Maximize2
} from 'lucide-react';
import { playClick, playSuccess, playAlert } from '../utils/soundFx';

export default function NeuralSynthwaveGrid() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const [mode, setMode] = useState('grid'); // 'grid' | 'neural' | 'warp'
  const [pulseCount, setPulseCount] = useState(0);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000, active: false });

  // Refs for animation loop
  const modeRef = useRef('grid');
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovering: false });
  const shockwavesRef = useRef([]);
  const timeRef = useRef(0);
  const nodesRef = useRef([]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Trigger shockwave pulse
  const triggerPulse = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    shockwavesRef.current.push({
      x: canvas.width / 2,
      y: canvas.height * 0.55,
      radius: 10,
      maxRadius: Math.max(canvas.width, canvas.height) * 0.85,
      speed: 380,
      strength: 35,
    });
    setPulseCount(prev => prev + 1);
    playSuccess();
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Re-init neural nodes
      const count = Math.min(50, Math.floor(rect.width / 16));
      nodesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        size: 1.5 + Math.random() * 2,
        baseColor: Math.random() > 0.4 ? '#38bdf8' : '#818cf8',
      }));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Initial shockwave
    shockwavesRef.current.push({
      x: canvas.width / 2,
      y: canvas.height * 0.55,
      radius: 0,
      maxRadius: Math.max(canvas.width, canvas.height) * 0.6,
      speed: 320,
      strength: 25,
    });

    let lastTime = performance.now();

    const render = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      timeRef.current += dt;
      const t = timeRef.current;

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.12;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.12;

      // Clear with dark synth fade
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const horizonY = h * 0.42;

      // Expand shockwaves
      shockwavesRef.current = shockwavesRef.current.filter(sw => {
        sw.radius += sw.speed * dt;
        sw.strength *= 0.985;
        return sw.radius < sw.maxRadius && sw.strength > 0.5;
      });

      if (modeRef.current === 'grid') {
        // --- MODE 1: 3D SYNTHWAVE / TRON HORIZON GRID ---
        
        // Background sky gradient & glowing neon sun/core
        const sunGradient = ctx.createRadialGradient(w / 2, horizonY, 5, w / 2, horizonY, h * 0.5);
        sunGradient.addColorStop(0, 'rgba(99, 102, 241, 0.45)');
        sunGradient.addColorStop(0.3, 'rgba(56, 189, 248, 0.2)');
        sunGradient.addColorStop(1, 'rgba(3, 7, 18, 0)');
        ctx.fillStyle = sunGradient;
        ctx.fillRect(0, 0, w, horizonY + 80);

        // Core pulsating sphere
        const pulseScale = 1 + Math.sin(t * 3.5) * 0.08;
        const sunRadius = Math.min(48, w * 0.08) * pulseScale;
        ctx.save();
        ctx.beginPath();
        ctx.arc(w / 2, horizonY - 10, sunRadius, 0, Math.PI * 2);
        const sunCore = ctx.createRadialGradient(w / 2, horizonY - 10, 0, w / 2, horizonY - 10, sunRadius);
        sunCore.addColorStop(0, '#ffffff');
        sunCore.addColorStop(0.4, '#38bdf8');
        sunCore.addColorStop(0.8, '#6366f1');
        sunCore.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx.fillStyle = sunCore;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 24;
        ctx.fill();
        ctx.restore();

        // Glowing horizon separator line
        ctx.beginPath();
        ctx.moveTo(0, horizonY);
        ctx.lineTo(w, horizonY);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 3D Perspective Grid
        const numHorizontalLines = 18;
        const speedOffset = (t * 1.2) % 1;

        // Draw horizontal receding lines
        for (let i = 0; i < numHorizontalLines; i++) {
          const depth = (i + speedOffset) / numHorizontalLines;
          const y = horizonY + Math.pow(depth, 2.3) * (h - horizonY);
          const alpha = Math.min(1, Math.pow(depth, 1.4) * 0.9);

          ctx.beginPath();
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.8 + depth * 1.6;

          // Add wave distortion across horizontal line
          const segments = 40;
          for (let s = 0; s <= segments; s++) {
            const x = (s / segments) * w;
            
            // Base sine oscillation
            let waveHeight = Math.sin(s * 0.4 + t * 3 + depth * 5) * (depth * 9);

            // Cursor proximity elevation
            if (mouseRef.current.isHovering) {
              const dx = x - mouseRef.current.x;
              const dy = y - mouseRef.current.y;
              const dist = Math.hypot(dx, dy);
              if (dist < 140) {
                const force = (1 - dist / 140) * 22;
                waveHeight -= force;
              }
            }

            // Shockwave elevation
            shockwavesRef.current.forEach(sw => {
              const dist = Math.hypot(x - sw.x, y - sw.y);
              const waveDist = Math.abs(dist - sw.radius);
              if (waveDist < 35) {
                const swForce = (1 - waveDist / 35) * sw.strength;
                waveHeight += Math.sin((waveDist / 35) * Math.PI) * swForce;
              }
            });

            if (s === 0) ctx.moveTo(x, y + waveHeight);
            else ctx.lineTo(x, y + waveHeight);
          }
          ctx.stroke();
        }

        // Draw perspective lines radiating to vanishing point
        const numVerticalLines = 24;
        for (let i = -numVerticalLines / 2; i <= numVerticalLines / 2; i++) {
          const normalized = i / (numVerticalLines / 2);
          const bottomX = w / 2 + normalized * (w * 0.85);
          const topX = w / 2 + normalized * 18;

          ctx.beginPath();
          ctx.moveTo(topX, horizonY);
          ctx.lineTo(bottomX, h);
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 + Math.abs(normalized) * 0.25})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

      } else if (modeRef.current === 'neural') {
        // --- MODE 2: INTERACTIVE NEURAL CONSTELLATION ---
        
        const nodes = nodesRef.current;
        const maxDist = Math.min(130, w * 0.2);

        // Move nodes
        nodes.forEach(node => {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0 || node.x > w) node.vx *= -1;
          if (node.y < 0 || node.y > h) node.vy *= -1;

          // Repel slightly from cursor
          if (mouseRef.current.isHovering) {
            const dx = node.x - mouseRef.current.x;
            const dy = node.y - mouseRef.current.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 120 && dist > 1) {
              node.x += (dx / dist) * 1.5;
              node.y += (dy / dist) * 1.5;
            }
          }
        });

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.hypot(dx, dy);

            if (dist < maxDist) {
              const alpha = (1 - dist / maxDist) * 0.45;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }

          // Connect to cursor if close
          if (mouseRef.current.isHovering) {
            const dx = nodes[i].x - mouseRef.current.x;
            const dy = nodes[i].y - mouseRef.current.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 160) {
              const alpha = (1 - dist / 160) * 0.8;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
              ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
              ctx.lineWidth = 1.2;
              ctx.stroke();
            }
          }

          // Draw node circles
          ctx.beginPath();
          ctx.arc(nodes[i].x, nodes[i].y, nodes[i].size, 0, Math.PI * 2);
          ctx.fillStyle = nodes[i].baseColor;
          ctx.fill();
        }

        // Shockwaves in neural mode
        shockwavesRef.current.forEach(sw => {
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(0.8, sw.strength / 20)})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        });

      } else {
        // --- MODE 3: QUANTUM WARP TUNNEL ---
        
        const cx = w / 2;
        const cy = h / 2;
        const rings = 14;

        for (let r = 0; r < rings; r++) {
          const depth = (r + (t * 2) % 1) / rings;
          const radius = Math.pow(depth, 2) * (Math.max(w, h) * 0.7);
          const alpha = depth * 0.7;

          // Distort center towards cursor
          const offsetX = mouseRef.current.isHovering ? (mouseRef.current.x - cx) * (1 - depth) * 0.4 : 0;
          const offsetY = mouseRef.current.isHovering ? (mouseRef.current.y - cy) * (1 - depth) * 0.4 : 0;

          ctx.beginPath();
          ctx.arc(cx + offsetX, cy + offsetY, Math.max(1, radius), 0, Math.PI * 2);
          ctx.strokeStyle = r % 2 === 0 ? `rgba(56, 189, 248, ${alpha})` : `rgba(168, 85, 247, ${alpha})`;
          ctx.lineWidth = 1 + depth * 2.5;
          ctx.stroke();
        }

        // Tunnel Rays
        const rayCount = 16;
        for (let i = 0; i < rayCount; i++) {
          const angle = (i / rayCount) * Math.PI * 2 + t * 0.3;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(angle) * w, cy + Math.sin(angle) * h);
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.2)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Mouse / Touch trackers
  const handleMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseRef.current.targetX = x;
    mouseRef.current.targetY = y;
    mouseRef.current.isHovering = true;
    setMousePos({ x: Math.round(x), y: Math.round(y), active: true });
  };

  const handleMouseLeave = () => {
    mouseRef.current.isHovering = false;
    setMousePos(prev => ({ ...prev, active: false }));
  };

  const handleTouchMove = (e) => {
    if (!e.touches[0]) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    mouseRef.current.targetX = x;
    mouseRef.current.targetY = y;
    mouseRef.current.isHovering = true;
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 select-none font-sans">
      <div 
        ref={containerRef}
        className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-slate-950/90 shadow-2xl shadow-blue-500/10 backdrop-blur-xl"
      >
        {/* Top Cyber HUD Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between px-5 py-3 border-b border-white/10 bg-slate-900/70 backdrop-blur-md gap-3">
          
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white tracking-wider uppercase">
                  Neural Synthwave Horizon
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Activity className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                  60 FPS • 0.2ms
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Interactive 3D Mathematical Mesh & Ripple Field
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                setMode('grid');
                playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                mode === 'grid'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              3D Grid
            </button>

            <button
              onClick={() => {
                setMode('neural');
                playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                mode === 'neural'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              Neural Web
            </button>

            <button
              onClick={() => {
                setMode('warp');
                playClick();
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                mode === 'warp'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              Warp Tunnel
            </button>
          </div>

        </div>

        {/* Canvas Visual Area */}
        <div 
          className="relative w-full h-[320px] sm:h-[380px] cursor-crosshair overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchMove}
          onClick={triggerPulse}
        >
          <canvas 
            ref={canvasRef} 
            className="w-full h-full block"
          />

          {/* Floating Instructions Pill */}
          <div className="absolute top-4 left-4 pointer-events-none z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-md text-[11px] font-mono text-slate-300 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Hover / Drag to bend terrain • Click anywhere to shockwave</span>
          </div>

          {/* Mouse Coordinates Badge */}
          {mousePos.active && (
            <div className="absolute top-4 right-4 pointer-events-none z-10 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/70 border border-white/10 text-[10px] font-mono text-cyan-300">
              <span>X: {mousePos.x}</span>
              <span>Y: {mousePos.y}</span>
            </div>
          )}

          {/* Center-Bottom Shockwave Action Button */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerPulse();
              }}
              className="group px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 text-cyan-300 group-hover:scale-125 transition-transform" />
              <span>DETONATE SHOCKWAVE ({pulseCount})</span>
            </button>
          </div>

        </div>

        {/* Bottom Status Bar */}
        <div className="px-5 py-2.5 bg-slate-900/80 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">MATH:</span>
            <span>Real-time Sine Waves & Inverse Square Law Physics</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-indigo-400">HARDWARE ACCELERATION: GPU</span>
            <span className="text-emerald-400">LATENCY: &lt; 0.4ms</span>
          </div>
        </div>

      </div>
    </div>
  );
}
