import React, { useState } from 'react';
import { Crown, Lock, Check, Sparkles, Zap, Flame, Sliders, ExternalLink } from 'lucide-react';
import { INFLUENCER_PRESETS, InfluencerPreset } from '../../constants/influencers';
import { useUserStore } from '../../stores/useUserStore';
import { useSensiStore } from '../../stores/useSensiStore';
import { playSound, triggerHaptic } from '../../services/audioFeedback';

interface Props {
  onOpenPlans: () => void;
  onNavigateTab: (tab: 'home' | 'sensi' | 'loja' | 'settings') => void;
}

export const LojaTab: React.FC<Props> = ({ onOpenPlans, onNavigateTab }) => {
  const { vipTier } = useUserStore();
  const { setAllValues, saveCurrentProfile, recordCopied } = useSensiStore();

  const [regionFilter, setRegionFilter] = useState<'ALL' | 'IN' | 'BR' | 'GLOBAL'>('ALL');
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const isVip = vipTier === 'pro' || vipTier === 'elite';

  const filteredInfluencers = INFLUENCER_PRESETS.filter(inf => {
    if (regionFilter === 'ALL') return true;
    return inf.region === regionFilter;
  });

  const handleApplyPreset = (influencer: InfluencerPreset) => {
    if (influencer.isVipOnly && !isVip) {
      onOpenPlans();
      return;
    }

    setAllValues({
      general: influencer.general,
      redDot: influencer.redDot,
      scope2x: influencer.scope2x,
      scope4x: influencer.scope4x,
      scopeAwm: influencer.scopeAwm,
      freeLook: influencer.freeLook,
      fireButtonSize: influencer.fireButtonSize,
      recommendedDpi: influencer.recommendedDpi,
      pointerSpeed: influencer.pointerSpeed,
    });

    saveCurrentProfile(`Preset Pro: ${influencer.name}`, influencer.deviceUsed);
    recordCopied();
    playSound('success');
    triggerHaptic('success');
    setAppliedNotice(`Sensi de ${influencer.name} aplicada com sucesso!`);
    setTimeout(() => setAppliedNotice(null), 2500);
  };

  return (
    <div className="space-y-3.5 pb-24 text-slate-200">
      {/* VIP Upgrade Banner if Free */}
      {!isVip && (
        <div className="p-4 bg-gradient-to-r from-amber-950/40 via-[#10141E] to-[#080A0F] rounded-xl border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold border border-amber-500/20">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-gamer">DESBLOQUEIE TODOS OS PRO PLAYERS</h3>
              <p className="text-xs text-slate-400">Total Gaming, Nobru, Cerol, Bak e mais com o VIP SensiPro</p>
            </div>
          </div>
          <button
            onClick={onOpenPlans}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono transition-colors cursor-pointer"
          >
            VER PLANOS
          </button>
        </div>
      )}

      {/* Region Filter Chips */}
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
          Presets de Criadores e Atletas:
        </span>
        <div className="flex gap-1 bg-[#10141E] p-1 rounded-lg border border-white/5">
          {(['ALL', 'IN', 'BR', 'GLOBAL'] as const).map(reg => (
            <button
              key={reg}
              onClick={() => {
                setRegionFilter(reg);
                playSound('click');
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition-all ${
                regionFilter === reg ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              {reg === 'ALL' ? 'Todos' : reg === 'IN' ? '🇮🇳 Índia' : reg === 'BR' ? '🇧🇷 Brasil' : '🌐 Global'}
            </button>
          ))}
        </div>
      </div>

      {/* Applied Notice */}
      {appliedNotice && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-gamer flex items-center justify-between animate-in zoom-in-95">
          <span>{appliedNotice}</span>
          <button
            onClick={() => onNavigateTab('sensi')}
            className="text-white underline font-mono text-[10px]"
          >
            Ver Sliders &gt;
          </button>
        </div>
      )}

      {/* Influencer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredInfluencers.map(inf => {
          const isLocked = inf.isVipOnly && !isVip;

          return (
            <div
              key={inf.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isLocked
                  ? 'bg-[#10141E]/80 border-white/5 opacity-85'
                  : 'bg-[#10141E] border-white/10 hover:border-emerald-500/40 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={inf.avatar}
                      alt={inf.name}
                      className="w-12 h-12 rounded-xl object-cover border border-white/15"
                    />
                    <span className="absolute -bottom-1 -right-1 px-1 rounded bg-black/90 text-[8px] font-mono text-white border border-white/20">
                      {inf.region === 'IN' ? '🇮🇳' : inf.region === 'BR' ? '🇧🇷' : '🌐'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white font-gamer">{inf.name}</h4>
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold">
                        {inf.badge}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 block">{inf.channel} • {inf.subscribers}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Dispositivo: {inf.deviceUsed}</span>
                  </div>
                </div>

                {isLocked ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>VIP ONLY</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                    VERIFICADO ✓
                  </span>
                )}
              </div>

              {/* Sliders Preview Box */}
              <div className="grid grid-cols-4 gap-1.5 p-2 bg-[#05070B] rounded-xl border border-white/5 text-center text-xs font-mono mb-3">
                <div className="p-1">
                  <span className="text-[9px] text-slate-500 block">Geral</span>
                  <span className="font-bold text-white">{inf.general}</span>
                </div>
                <div className="p-1">
                  <span className="text-[9px] text-slate-500 block">Red Dot</span>
                  <span className="font-bold text-white">{inf.redDot}</span>
                </div>
                <div className="p-1">
                  <span className="text-[9px] text-slate-500 block">2x</span>
                  <span className="font-bold text-white">{inf.scope2x}</span>
                </div>
                <div className="p-1">
                  <span className="text-[9px] text-slate-500 block">4x</span>
                  <span className="font-bold text-white">{inf.scope4x}</span>
                </div>
                <div className="p-1">
                  <span className="text-[9px] text-slate-500 block">AWM</span>
                  <span className="font-bold text-white">{inf.scopeAwm}</span>
                </div>
                <div className="p-1">
                  <span className="text-[9px] text-slate-500 block">Olhadinha</span>
                  <span className="font-bold text-white">{inf.freeLook}</span>
                </div>
                <div className="p-1">
                  <span className="text-[9px] text-slate-500 block">Botão</span>
                  <span className="font-bold text-red-400">{inf.fireButtonSize}%</span>
                </div>
                <div className="p-1">
                  <span className="text-[9px] text-slate-500 block">DPI</span>
                  <span className="font-bold text-cyan-400">{inf.recommendedDpi}</span>
                </div>
              </div>

              {/* Signature Style Quote */}
              <p className="text-[11px] text-slate-400 italic mb-3">
                &quot;{inf.signatureStyle}&quot;
              </p>

              {/* Action Button */}
              <button
                onClick={() => handleApplyPreset(inf)}
                className={`w-full py-2 rounded-xl text-xs font-bold font-gamer flex items-center justify-center gap-1.5 transition-all ${
                  isLocked
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20'
                }`}
              >
                {isLocked ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>DESBLOQUEAR NO PLANO VIP</span>
                  </>
                ) : (
                  <>
                    <Sliders className="w-3.5 h-3.5" />
                    <span>APLICAR NO MEU SETUP (1-TOQUE)</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
