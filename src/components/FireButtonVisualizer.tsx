import React from 'react';
import { Crosshair, Move, ShieldAlert } from 'lucide-react';

interface Props {
  buttonSize: number; // percentage (e.g., 44)
  onChangeSize?: (newSize: number) => void;
  readOnly?: boolean;
}

export const FireButtonVisualizer: React.FC<Props> = ({ buttonSize, onChangeSize, readOnly = false }) => {
  // Convert percentage to pixel size in visualizer (base 120px at 50%)
  const visualPx = Math.round((buttonSize / 50) * 110);
  const mmEstimate = (buttonSize * 0.35).toFixed(1);

  return (
    <div className="bg-[#10141E] border border-white/10 rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <Crosshair className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">
              TAMANHO DO BOTÃO DE TIRO (FIRE BUTTON)
            </h4>
            <p className="text-[11px] text-slate-400 font-mono">Diâmetro Físico Estimado: {mmEstimate} mm</p>
          </div>
        </div>
        <div className="px-2.5 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold">
          {buttonSize}%
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div className="relative w-full h-40 bg-[#080A0F] rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
        {/* HUD grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px]" />
        
        {/* Safe zone boundary */}
        <div className="absolute inset-4 border border-white/5 rounded-lg pointer-events-none flex items-start justify-end p-1.5">
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Right Thumb Zone</span>
        </div>

        {/* Dynamic Fire Button */}
        <div
          className="relative rounded-full flex items-center justify-center transition-all duration-150 shadow-2xl cursor-pointer active:scale-95 group"
          style={{
            width: `${visualPx}px`,
            height: `${visualPx}px`,
            background: 'radial-gradient(circle at 35% 35%, #EF4444 0%, #B91C1C 70%, #7F1D1D 100%)',
            boxShadow: '0 0 25px rgba(239, 68, 68, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
          }}
        >
          {/* Inner ring */}
          <div className="w-3/4 h-3/4 rounded-full border border-white/30 flex items-center justify-center">
            {/* Center target crosshair */}
            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
          </div>

          {/* Bullet icon */}
          <span className="absolute text-[11px] font-bold text-white tracking-widest opacity-80 font-gamer pointer-events-none">
            FIRE
          </span>

          {/* Size badge tooltip on hover */}
          <div className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-[10px] text-white px-2 py-0.5 rounded border border-white/20 font-mono pointer-events-none whitespace-nowrap">
            Drag Zone: {visualPx}px
          </div>
        </div>

        {/* Swipe trajectory indicator */}
        <div className="absolute right-6 bottom-4 flex flex-col items-center pointer-events-none opacity-40">
          <Move className="w-4 h-4 text-emerald-400 animate-bounce" />
          <span className="text-[9px] text-emerald-400 font-mono">PULL UP</span>
        </div>
      </div>

      {/* Interactive slider if editable */}
      {!readOnly && onChangeSize && (
        <div className="mt-3.5 space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>Minimum (35%)</span>
            <span className="text-emerald-400 font-semibold font-mono">Recommended: 42% - 48%</span>
            <span>Maximum (65%)</span>
          </div>
          <input
            type="range"
            min={35}
            max={65}
            value={buttonSize}
            onChange={(e) => onChangeSize(parseInt(e.target.value, 10))}
            className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer appearance-none"
          />
        </div>
      )}

      {/* Pro tip */}
      <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-red-950/20 border border-red-500/20 text-xs text-slate-300">
        <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
        <span className="text-[11px] leading-tight">
          <strong className="text-white">Pro Guideline:</strong> Smaller button (38-44%) enables faster thumb flicks for Shotgun/SMG. Larger button (48-54%) prevents miss-taps.
        </span>
      </div>
    </div>
  );
};
