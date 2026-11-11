import React, { useState } from 'react';
import { X, Flame, ShieldAlert, ArrowUpRight, Compass, Crosshair } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RecoilGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [distance, setDistance] = useState<'close' | 'mid' | 'long'>('mid');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0F141F] border border-white/10 rounded-2xl p-5 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-gamer">GUIA TÁTICO: SEM RECUO & PUXADA</h3>
              <p className="text-xs text-slate-400">Visual Drag Trajectory & Distance Physics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Distance Selector */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-[#05070B] rounded-xl mb-4 border border-white/5">
          <button
            onClick={() => setDistance('close')}
            className={`py-2 text-xs font-bold rounded-lg font-gamer transition-all ${
              distance === 'close'
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Close (0-10m)
          </button>
          <button
            onClick={() => setDistance('mid')}
            className={`py-2 text-xs font-bold rounded-lg font-gamer transition-all ${
              distance === 'mid'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mid (10-35m)
          </button>
          <button
            onClick={() => setDistance('long')}
            className={`py-2 text-xs font-bold rounded-lg font-gamer transition-all ${
              distance === 'long'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Long (35m+)
          </button>
        </div>

        {/* Interactive Trajectory Canvas */}
        <div className="relative aspect-[16/9] w-full bg-[#05070B] rounded-xl border border-white/15 overflow-hidden p-4 flex flex-col justify-between">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px]" />

          {/* Top header on canvas */}
          <div className="relative z-10 flex justify-between items-center text-xs">
            <span className="font-mono text-slate-400 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-red-400" />
              {distance === 'close' ? 'Steep "J" Hook Flick (85° Angle)' : distance === 'mid' ? 'Balanced Diagonal Pull (60° Angle)' : 'Gentle Micro-Nudge (30° Angle)'}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/10 font-mono text-[10px] text-white">
              {distance === 'close' ? 'Shotgun / UMP' : distance === 'mid' ? 'MP40 / SCAR' : 'Woodpecker / AC80'}
            </span>
          </div>

          {/* SVG Trajectory Curve */}
          <div className="relative z-10 flex-1 flex items-center justify-center my-2">
            <svg viewBox="0 0 300 120" className="w-full h-full">
              <defs>
                <linearGradient id="curveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="60%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#22C55E" />
                </linearGradient>
              </defs>

              {/* Grid guides */}
              <line x1="40" y1="100" x2="260" y2="100" stroke="#ffffff15" strokeDasharray="4 4" />
              <line x1="40" y1="20" x2="260" y2="20" stroke="#ffffff15" strokeDasharray="4 4" />

              {/* Dynamic Path based on distance */}
              {distance === 'close' && (
                <path
                  d="M 60 100 Q 140 95 180 20"
                  fill="none"
                  stroke="url(#curveGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              )}
              {distance === 'mid' && (
                <path
                  d="M 60 100 Q 130 75 220 30"
                  fill="none"
                  stroke="url(#curveGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              )}
              {distance === 'long' && (
                <path
                  d="M 60 100 Q 160 85 240 60"
                  fill="none"
                  stroke="url(#curveGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              )}

              {/* Start Point (Thumb Touch) */}
              <circle cx="60" cy="100" r="7" fill="#EF4444" />
              <text x="60" y="116" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="monospace">TOUCH</text>

              {/* End Point (Headshot Target Lock) */}
              {distance === 'close' && (
                <>
                  <circle cx="180" cy="20" r="7" fill="#22C55E" />
                  <text x="180" y="12" fill="#4ADE80" fontSize="8" textAnchor="middle" fontFamily="monospace">HEAD LOCK (85°)</text>
                </>
              )}
              {distance === 'mid' && (
                <>
                  <circle cx="220" cy="30" r="7" fill="#22C55E" />
                  <text x="220" y="22" fill="#4ADE80" fontSize="8" textAnchor="middle" fontFamily="monospace">HEAD LOCK (60°)</text>
                </>
              )}
              {distance === 'long' && (
                <>
                  <circle cx="240" cy="60" r="7" fill="#22C55E" />
                  <text x="240" y="52" fill="#4ADE80" fontSize="8" textAnchor="middle" fontFamily="monospace">MICRO LOCK (30°)</text>
                </>
              )}
            </svg>
          </div>

          {/* Bottom stats row */}
          <div className="relative z-10 flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Swipe Velocity: <strong className="text-white">{distance === 'close' ? '0.12s (Instant)' : distance === 'mid' ? '0.24s (Linear)' : '0.40s (Gentle)'}</strong></span>
            <span>Target Zone: <strong className="text-emerald-400">Neck to Helmet</strong></span>
          </div>
        </div>

        {/* Tactical Explanation */}
        <div className="mt-4 p-3.5 bg-[#161D2E] rounded-xl border border-white/5 space-y-2 text-xs">
          {distance === 'close' && (
            <>
              <h4 className="font-bold text-red-400 font-gamer flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4" />
                Close Range (0-10m) Hook Drag Technique
              </h4>
              <p className="text-slate-300 leading-relaxed">
                When an enemy rushes you up close, standard straight dragging fails because the target hitbox is tall. Start with your crosshair slightly to the left/bottom of the enemy's feet, then pull rapidly up in a &quot;J&quot; shaped hook. The curve naturally aligns with the helmet during jump animations.
              </p>
            </>
          )}

          {distance === 'mid' && (
            <>
              <h4 className="font-bold text-amber-400 font-gamer flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4" />
                Mid Range (10-35m) Smooth Diagonal Lift
              </h4>
              <p className="text-slate-300 leading-relaxed">
                The most frequent gunfight distance in Battle Royale and Clash Squad. Do not jerk the button violently. Apply steady, uninterrupted upward pressure. After firing 5 to 7 bullets, release the button for 0.1s to allow bullet spread bloom to reset.
              </p>
            </>
          )}

          {distance === 'long' && (
            <>
              <h4 className="font-bold text-emerald-400 font-gamer flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4" />
                Long Range (35m+) Micro-Flick Tap
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Aggressive pulling at this distance will send bullets way over the enemy head. Keep crosshair pre-aligned at neck height. Use single taps with rifles like Woodpecker, SVD, or AC80 with a minimal 2mm upward thumb nudge.
              </p>
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold font-gamer transition-colors shadow-lg shadow-red-500/20"
        >
          ENTENDIDO & APLICAR
        </button>
      </div>
    </div>
  );
};
