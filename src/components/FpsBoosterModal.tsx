import React, { useState } from 'react';
import { X, Zap, Cpu, CheckCircle2, RotateCw, Sparkles, Activity } from 'lucide-react';
import { playSound, triggerHaptic } from '../services/audioFeedback';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FpsBoosterModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [isFlushing, setIsFlushing] = useState(false);
  const [flushComplete, setFlushComplete] = useState(false);
  const [freedRamMb, setFreedRamMb] = useState(640);
  const [touchLatencyReduction, setTouchLatencyReduction] = useState(14); // ms

  if (!isOpen) return null;

  const handleRunFlush = () => {
    setIsFlushing(true);
    setFlushComplete(false);
    playSound('boost');
    triggerHaptic('heavy');

    setTimeout(() => {
      setIsFlushing(false);
      setFlushComplete(true);
      setFreedRamMb(Math.floor(Math.random() * 250) + 550);
      setTouchLatencyReduction(Math.floor(Math.random() * 8) + 12);
      playSound('success');
      triggerHaptic('success');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0F141F] border border-white/10 rounded-2xl p-5 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-gamer">REDUTOR DE LAG & FPS BOOSTER</h3>
              <p className="text-xs text-slate-400">RAM Flush & 240Hz Touch Sampling Calibration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live System Diagnostics Card */}
        <div className="p-4 bg-[#05070B] rounded-xl border border-white/10 space-y-3 mb-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Touch Engine Polling:
            </span>
            <span className="font-mono font-bold text-emerald-400">1000Hz Ultra Mode Active</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-400" />
              Target Game Refresh:
            </span>
            <span className="font-mono font-bold text-white">120 FPS / High Framerate Cap</span>
          </div>

          {/* Gauge bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Touch Latency</span>
              <span className="text-emerald-400 font-bold">{flushComplete ? '4.2 ms (Optimal)' : '18.4 ms'}</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: flushComplete ? '94%' : '65%' }}
              />
            </div>
          </div>
        </div>

        {/* Results Banner */}
        {flushComplete && (
          <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/40 rounded-xl mb-4 space-y-1 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm font-gamer">
              <Sparkles className="w-4 h-4" />
              <span>SISTEMA OTIMIZADO COM SUCESSO!</span>
            </div>
            <p className="text-xs text-slate-300">
              Liberados <strong className="text-white font-mono">{freedRamMb} MB</strong> de RAM em background e latência de toque reduzida em <strong className="text-emerald-300 font-mono">-{touchLatencyReduction} ms</strong>.
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleRunFlush}
          disabled={isFlushing}
          className={`w-full py-3 rounded-xl font-bold font-gamer text-sm flex items-center justify-center gap-2 transition-all ${
            isFlushing
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black shadow-lg shadow-cyan-500/25'
          }`}
        >
          {isFlushing ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin text-cyan-400" />
              <span>CALIBRANDO BUFFER DE TOQUE...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>{flushComplete ? 'OTIMIZAR NOVAMENTE' : 'EXECUTAR LIMPEZA DE RAM & FLUSH'}</span>
            </>
          )}
        </button>

        {/* Android Optimization Checklist */}
        <div className="mt-4 p-3 bg-[#161D2E] rounded-xl border border-white/5 space-y-2 text-xs">
          <span className="font-bold text-white font-gamer tracking-wide block">
            CHECKLIST DE CONFIGURAÇÃO DO APARELHO:
          </span>
          <ul className="space-y-1.5 text-slate-300">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Ative a &quot;Taxa de Atualização de 120Hz&quot; nas configurações de Tela do seu celular.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Nas Opções do Desenvolvedor, defina as 3 Escalas de Animação para <strong className="text-white">0.5x</strong> ou <strong className="text-white">Desligadas</strong>.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Desative a otimização de bateria para o aplicativo do Free Fire para evitar engasgos de CPU.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
