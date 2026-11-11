import React, { useState } from 'react';
import { X, Smartphone, Layers, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HUDPlacementModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeClaw, setActiveClaw] = useState<'2_finger' | '3_finger' | '4_finger'>('2_finger');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0F141F] border border-white/10 rounded-2xl p-5 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-gamer">POSIÇÃO DO BOTÃO (HUD CLAW)</h3>
              <p className="text-xs text-slate-400">Optimal Button Layout for Maximum Headshot Drag</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Claw Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-[#05070B] rounded-xl mb-4 border border-white/5">
          <button
            onClick={() => setActiveClaw('2_finger')}
            className={`py-2 text-xs font-bold rounded-lg font-gamer transition-all ${
              activeClaw === '2_finger'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2-Finger Thumb
          </button>
          <button
            onClick={() => setActiveClaw('3_finger')}
            className={`py-2 text-xs font-bold rounded-lg font-gamer transition-all ${
              activeClaw === '3_finger'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3-Finger Claw
          </button>
          <button
            onClick={() => setActiveClaw('4_finger')}
            className={`py-2 text-xs font-bold rounded-lg font-gamer transition-all ${
              activeClaw === '4_finger'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            4-Finger Pro
          </button>
        </div>

        {/* HUD Layout Screen Diagram */}
        <div className="relative aspect-[16/9] w-full bg-[#05070B] rounded-xl border border-white/15 overflow-hidden p-3 shadow-inner">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px]" />

          {/* Left Side: Joystick & Gloo */}
          <div className="absolute left-4 bottom-4 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border border-dashed border-white/20 bg-white/5 flex items-center justify-center">
              <span className="text-[9px] text-slate-400 font-mono">Analog</span>
            </div>
            <span className="text-[9px] text-slate-500 mt-1">Left Thumb</span>
          </div>

          {/* Gloo Wall Placement based on Claw */}
          <div
            className={`absolute transition-all duration-300 p-2 rounded-lg border flex flex-col items-center ${
              activeClaw === '2_finger'
                ? 'left-20 bottom-8 border-cyan-500/50 bg-cyan-950/40 text-cyan-300'
                : 'left-4 top-4 border-cyan-500/70 bg-cyan-950/60 text-cyan-300'
            }`}
          >
            <span className="text-[10px] font-bold font-gamer">GLOO WALL</span>
            <span className="text-[8px] opacity-75">{activeClaw === '2_finger' ? 'Thumb Reach' : 'Left Index Finger'}</span>
          </div>

          {/* Jump / Crouch / Scope */}
          <div className="absolute right-4 top-4 flex gap-2">
            <div className="p-1.5 rounded-lg border border-amber-500/50 bg-amber-950/40 text-amber-300 flex flex-col items-center">
              <span className="text-[10px] font-bold font-gamer">JUMP</span>
              <span className="text-[8px] opacity-75">{activeClaw === '4_finger' ? 'Right Index' : 'Right Thumb'}</span>
            </div>
            <div className="p-1.5 rounded-lg border border-amber-500/50 bg-amber-950/40 text-amber-300 flex flex-col items-center">
              <span className="text-[10px] font-bold font-gamer">SCOPE</span>
            </div>
          </div>

          {/* Fire Button Position */}
          <div
            className={`absolute transition-all duration-300 flex flex-col items-center ${
              activeClaw === '2_finger'
                ? 'right-6 bottom-4'
                : activeClaw === '3_finger'
                ? 'right-8 bottom-6'
                : 'right-10 bottom-8'
            }`}
          >
            <div className="w-12 h-12 rounded-full border-2 border-red-500 bg-red-600/30 flex items-center justify-center shadow-lg shadow-red-500/30">
              <span className="text-[9px] font-bold text-white font-gamer">FIRE</span>
            </div>
            <span className="text-[8px] text-red-400 mt-0.5 font-mono">Drag Zone</span>
          </div>

          {/* Quick Weapon Switch */}
          <div className="absolute left-1/2 top-4 -translate-x-1/2 p-1.5 rounded-lg border border-purple-500/50 bg-purple-950/40 text-purple-300 flex flex-col items-center">
            <span className="text-[9px] font-bold font-gamer">QUICK SWITCH</span>
            <span className="text-[8px] opacity-75">Center Top</span>
          </div>
        </div>

        {/* Configuration Specs */}
        <div className="mt-4 space-y-2 text-xs">
          {activeClaw === '2_finger' && (
            <div className="p-3 bg-[#161D2E] rounded-xl border border-white/5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle className="w-4 h-4" />
                <span>2-Finger Standard Layout (Most Comfortable)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Place the Fire button at the lower third of the right screen (X: 82%, Y: 24%). This leaves maximum vertical runway for your right thumb to pull up smoothly without hitting the screen top bezel.
              </p>
            </div>
          )}

          {activeClaw === '3_finger' && (
            <div className="p-3 bg-[#161D2E] rounded-xl border border-white/5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle className="w-4 h-4" />
                <span>3-Finger Claw (Fastest Gloo Wall Deploy)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Move Gloo Wall or Jump to the top-left corner. Your left index finger taps Gloo instantly while your right thumb continues to pull the fire button down for immediate defensive shield.
              </p>
            </div>
          )}

          {activeClaw === '4_finger' && (
            <div className="p-3 bg-[#161D2E] rounded-xl border border-white/5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle className="w-4 h-4" />
                <span>4-Finger Esports Pro (Complete Simultaneous Action)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Used by international competitive players. Left index operates Gloo/Crouch, right index handles Jump and Scope, leaving both thumbs dedicated solely to movement and pixel-perfect drag aiming.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-gamer transition-colors"
        >
          CONFIRMAR & VOLTAR
        </button>
      </div>
    </div>
  );
};
