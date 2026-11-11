import React, { useState } from 'react';
import { X, Calendar, Gift, Sparkles, CheckCircle2, Flame, Award, ArrowRight } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';
import { useSensiStore } from '../stores/useSensiStore';
import { playSound, triggerHaptic } from '../services/audioFeedback';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const STREAK_DAYS = [
  { day: 1, reward: '+1 Coach Token', icon: Sparkles, isGrand: false },
  { day: 2, reward: '+1 Coach Token', icon: Sparkles, isGrand: false },
  { day: 3, reward: '+1 Coach Token', icon: Sparkles, isGrand: false },
  { day: 4, reward: '+1 Coach Token', icon: Sparkles, isGrand: false },
  { day: 5, reward: '+2 Coach Tokens', icon: Flame, isGrand: false },
  { day: 6, reward: '+2 Coach Tokens', icon: Flame, isGrand: false },
  { day: 7, reward: 'One-Tap Shotgun Sensi + 3 Tokens', icon: Award, isGrand: true },
];

export const RewardsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { streakCount, claimedStreakDays, claimDailyStreak } = useUserStore();
  const { saveCurrentProfile, setAllValues } = useSensiStore();
  const [claimFeedback, setClaimFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClaim = (dayIndex: number) => {
    playSound('token');
    triggerHaptic('medium');

    const result = claimDailyStreak(dayIndex);
    if (result.success) {
      if (result.isGrandPrize) {
        setAllValues({
          general: 100,
          redDot: 98,
          scope2x: 95,
          scope4x: 90,
          scopeAwm: 45,
          freeLook: 75,
          fireButtonSize: 41,
          recommendedDpi: 580,
          pointerSpeed: 2,
        });
        saveCurrentProfile('Day 7 Exclusive One-Tap Shotgun Sensi', 'Day 7 Streak Reward');
        setClaimFeedback('🎉 Grande Prêmio Reclamado! Sensi One-Tap Aplicada e +3 Tokens!');
      } else {
        setClaimFeedback(`🎁 Recompensa do Dia ${dayIndex} Coletada com Sucesso!`);
      }

      playSound('success');
      triggerHaptic('success');
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {
        // ignore
      }

      setTimeout(() => setClaimFeedback(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0F141F] border border-amber-500/20 rounded-2xl p-5 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-gamer">STREAK DIÁRIO DE RECOMPENSAS</h3>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                  7 DIAS
                </span>
              </div>
              <p className="text-xs text-slate-400">Entre todos os dias para desbloquear a Sensi Secreta</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current streak banner */}
        <div className="p-4 bg-gradient-to-r from-amber-950/40 via-red-950/30 to-[#05070B] rounded-xl border border-amber-500/30 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider block">Sequência Atual</span>
              <h4 className="text-base font-bold text-white font-gamer">{streakCount} Dias Consecutivos 🔥</h4>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Progresso</span>
            <span className="text-xs font-bold text-amber-300 font-mono">{claimedStreakDays.length} / 7 Dias</span>
          </div>
        </div>

        {/* Feedback notice */}
        {claimFeedback && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl mb-4 text-emerald-300 font-gamer text-xs flex items-center justify-center gap-2 animate-in zoom-in-95">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{claimFeedback}</span>
          </div>
        )}

        {/* 7 Days Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {STREAK_DAYS.map(item => {
            const isClaimed = claimedStreakDays.includes(item.day);
            const canClaim = !isClaimed && item.day <= streakCount;
            const Icon = item.icon;

            return (
              <div
                key={item.day}
                className={`p-3 rounded-xl border relative flex flex-col justify-between transition-all ${
                  item.isGrand ? 'col-span-2 bg-gradient-to-br from-amber-950/50 to-red-950/50 border-amber-500/50' : ''
                } ${
                  isClaimed
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : canClaim
                    ? 'border-amber-500 bg-[#161D2E] shadow-lg shadow-amber-500/10'
                    : 'border-white/5 bg-[#05070B] opacity-60'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold font-mono text-slate-400">DIA {item.day}</span>
                  {isClaimed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Icon className={`w-4 h-4 ${item.isGrand ? 'text-amber-400' : 'text-slate-400'}`} />
                  )}
                </div>

                <div className="my-1">
                  <span className={`text-xs font-bold font-gamer block ${item.isGrand ? 'text-amber-300' : 'text-white'}`}>
                    {item.reward}
                  </span>
                  {item.isGrand && (
                    <span className="text-[10px] text-amber-400/80 font-mono block mt-0.5">
                      ★ Sensi Especial de Doze
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleClaim(item.day)}
                  disabled={isClaimed}
                  className={`mt-2 w-full py-1.5 rounded-lg text-[11px] font-bold font-gamer transition-all ${
                    isClaimed
                      ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                      : canClaim
                      ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-md'
                      : 'bg-white/5 text-slate-500 hover:bg-white/10'
                  }`}
                >
                  {isClaimed ? 'COLETADO ✓' : canClaim ? 'RESGATAR' : 'BLOQUEADO'}
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold font-gamer text-xs transition-colors"
        >
          FECHAR
        </button>
      </div>
    </div>
  );
};
