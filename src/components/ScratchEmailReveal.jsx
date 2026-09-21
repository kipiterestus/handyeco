import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Mail, 
  Copy, 
  CheckCheck, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { playScratch, playSuccess, playClick } from '../utils/soundFx';

export default function ScratchEmailReveal() {
  const { t } = useLanguage();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Email obfuscation - constructed on client interaction to deter simple scrapers
  const emailUser = 'contact';
  const emailDomain = 'utkudev.nl';
  const email = `${emailUser}@${emailDomain}`;

  const [isRevealed, setIsRevealed] = useState(false);
  const [, setScratchPercent] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [copied, setCopied] = useState(false);
  const lastPosRef = useRef(null);

  // Initialize and paint scratch foil on canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const width = Math.max(rect.width, 280);
    const height = Math.max(rect.height, 70);

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // Render luxury metallic / holographic scratch foil
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1E2438');
    gradient.addColorStop(0.3, '#2A3352');
    gradient.addColorStop(0.5, '#1E2438');
    gradient.addColorStop(0.7, '#313C60');
    gradient.addColorStop(1, '#1A2035');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative diagonal micro-stripes pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = -height; i < width + height; i += 10) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }

    // Border highlight
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(1, 1, width - 2, height - 2);

    // Central prompt text & icon
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '600 12.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✏️ ' + (t.contact.scratch?.instruction || 'Scratch to reveal email'), width / 2, height / 2 - 8);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 10px "JetBrains Mono", monospace';
    ctx.fillText('🔒 ' + (t.contact.scratch?.badge || 'Anti-Spam Human Shield'), width / 2, height / 2 + 12);
  }, [t]);

  useEffect(() => {
    if (!isRevealed) {
      initCanvas();
    }
  }, [initCanvas, isRevealed]);

  // Handle window resize to re-paint foil if not yet revealed
  useEffect(() => {
    const handleResize = () => {
      if (!isRevealed) {
        initCanvas();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas, isRevealed]);

  // Calculate scratched transparent area
  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width;
    const h = canvas.height;

    // Sample pixels at intervals for performance
    const sampleStep = 8 * dpr;
    let transparentCount = 0;
    let totalSamples = 0;

    try {
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      for (let y = 0; y < h; y += sampleStep) {
        for (let x = 0; x < w; x += sampleStep) {
          totalSamples++;
          const index = (y * w + x) * 4 + 3; // alpha channel
          if (data[index] < 128) {
            transparentCount++;
          }
        }
      }

      const percent = Math.round((transparentCount / totalSamples) * 100);
      setScratchPercent(percent);

      // Once user scratches > 25%, unlock automatically
      if (percent >= 25) {
        setIsRevealed((prev) => {
          if (!prev) playSuccess();
          return true;
        });
      }
    } catch {
      // Fallback
    }
  };

  const getCanvasPos = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const scratchAt = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    playScratch();

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 32;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (lastPosRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    lastPosRef.current = { x, y };
  };

  // Mouse event listeners
  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const pos = getCanvasPos(e.clientX, e.clientY);
    lastPosRef.current = pos;
    scratchAt(pos.x, pos.y);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const pos = getCanvasPos(e.clientX, e.clientY);
    scratchAt(pos.x, pos.y);
    checkScratchPercentage();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
    checkScratchPercentage();
  };

  // Touch event listeners
  const handleTouchStart = (e) => {
    setIsDrawing(true);
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const pos = getCanvasPos(touch.clientX, touch.clientY);
      lastPosRef.current = pos;
      scratchAt(pos.x, pos.y);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDrawing || e.touches.length === 0) return;
    e.preventDefault(); // prevent unwanted scrolling during scratching
    const touch = e.touches[0];
    const pos = getCanvasPos(touch.clientX, touch.clientY);
    scratchAt(pos.x, pos.y);
    checkScratchPercentage();
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
    checkScratchPercentage();
  };

  const handleCopyEmail = () => {
    playClick();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-2.5">
      {/* Scratch Container Card */}
      <div 
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-lg min-h-[72px] flex items-center justify-between p-3 select-none"
      >
        {/* Underlying Revealed Email Display */}
        <div className={`w-full flex items-center justify-between gap-2.5 transition-all duration-500 ${
          isRevealed ? 'filter-none opacity-100' : 'filter blur-md opacity-35'
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>{t.contact.scratch?.revealed || 'Verified Human • Unlocked'}</span>
              </div>
              <span className="font-mono text-sm sm:text-base text-blue-200 font-semibold select-all tracking-wide">
                {isRevealed ? email : '•••••••@•••••••.nl'}
              </span>
            </div>
          </div>

          {/* Action buttons (only active when unlocked) */}
          <div className="flex items-center gap-1.5 shrink-0 z-10">
            <button
              onClick={handleCopyEmail}
              disabled={!isRevealed}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isRevealed 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 active:scale-95' 
                  : 'bg-slate-800/30 text-slate-600 cursor-not-allowed'
              }`}
              title={t.contact.scratch?.copy || 'Copy Email'}
            >
              {copied ? (
                <CheckCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <a
              href={isRevealed ? `mailto:${email}?subject=Project%20Inquiry%20-%20Custom%20Build` : '#'}
              onClick={(e) => {
                if (!isRevealed) e.preventDefault();
              }}
              className={`p-2 rounded-xl transition-all ${
                isRevealed 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer' 
                  : 'bg-slate-800/30 text-slate-600 cursor-not-allowed'
              }`}
              title={t.contact.scratch?.send || 'Send Email'}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Scratch Canvas Overlay (fades out completely when revealed) */}
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="absolute inset-0 z-20 cursor-crosshair touch-none transition-opacity duration-500 rounded-2xl"
            title="Scratch with mouse or finger to reveal"
          />
        )}
      </div>

      {/* Under-card helper bar */}
      <div className="flex items-center justify-between px-1 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>{t.contact.scratch?.subtext || 'Interactive anti-spam foil'}</span>
        </div>

        {isRevealed && copied && (
          <span className="text-emerald-400 font-semibold">
            ✓ {t.contact.scratch?.copied || 'Copied!'}
          </span>
        )}
      </div>
    </div>
  );
}
