import React, { useState } from 'react';
import { X, Crown, Check, Zap, Sparkles, ShieldCheck, Flame, CreditCard } from 'lucide-react';
import { useUserStore, VipTier } from '../stores/useUserStore';
import { playSound, triggerHaptic } from '../services/audioFeedback';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PlansModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { vipTier, setVipTier, addTokens } = useUserStore();
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectTier = (tier: VipTier, tokensAward: number, label: string) => {
    setIsProcessing(true);
    playSound('boost');
    triggerHaptic('heavy');

    setTimeout(() => {
      setVipTier(tier);
      if (tokensAward > 0) {
        addTokens(tokensAward);
      }
      setIsProcessing(false);
      setSuccessNotice(`Plano ${label} Ativado com Sucesso!`);
      playSound('success');
      triggerHaptic('success');
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
      setTimeout(() => {
        setSuccessNotice(null);
        onClose();
      }, 1800);
    }, 1200);
  };

  const handleBuyTokens = (count: number, priceStr: string) => {
    setIsProcessing(true);
    playSound('token');
    triggerHaptic('medium');

    setTimeout(() => {
      addTokens(count);
      setIsProcessing(false);
      setSuccessNotice(`+${count} Tokens de Coach IA adicionados!`);
      playSound('success');
      triggerHaptic('success');
      setTimeout(() => setSuccessNotice(null), 1800);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0F141F] border border-amber-500/20 rounded-2xl p-5 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-gamer">VIP SENSIPRO FF</h3>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                  ELITE CLUB
                </span>
              </div>
              <p className="text-xs text-slate-400">Unlock Unlimited Coach IA & Pro Esports Presets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center justify-between p-2 bg-[#05070B] rounded-xl mb-4 border border-white/5">
          <span className="text-xs text-slate-400 font-mono">Select Billing Region:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                currency === 'INR' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇮🇳 India (INR / UPI)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                currency === 'USD' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌐 Global (USD / BRL)
            </button>
          </div>
        </div>

        {/* Success Notice */}
        {successNotice && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl mb-4 text-emerald-300 font-gamer text-xs flex items-center justify-center gap-2 animate-in zoom-in-95">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Plan Cards */}
        <div className="space-y-3 mb-5">
          {/* FREE PLAN */}
          <div className={`p-4 rounded-xl border transition-all ${vipTier === 'free' ? 'border-white/20 bg-[#161D2E]' : 'border-white/5 bg-[#05070B]'}`}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-xs font-bold text-slate-300 font-gamer">FREE TIER</span>
                <p className="text-[11px] text-slate-500">Cálculo básico de sensibilidade geral</p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">R$ 0 / Grátis</span>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1 mb-2">
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> 1 Pergunta diária ao Coach IA</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> Predefinição básica de fábrica</li>
            </ul>
          </div>

          {/* PRO PLAN */}
          <div className={`p-4 rounded-xl border relative overflow-hidden transition-all ${vipTier === 'pro' ? 'border-emerald-500 bg-emerald-950/20' : 'border-emerald-500/40 bg-[#161D2E]'}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-emerald-400 font-gamer">PLANO PRO</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono">POPULAR</span>
                </div>
                <p className="text-[11px] text-slate-400">Todas as armas + Toggles Regedit</p>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-white font-mono">{currency === 'INR' ? '₹99' : '$2.99'}</span>
                <span className="text-[10px] text-slate-400 block font-mono">/ mês</span>
              </div>
            </div>

            <ul className="text-[11px] text-slate-300 space-y-1 mb-3">
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> Sensibilidades para todas as armas (Doze, SMG, AR, AWM)</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> Toggles Regedit: Mira Perfeita, Fast Click e FPS Booster</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> 5 Tokens Diários de Coach IA</li>
            </ul>

            <button
              onClick={() => handleSelectTier('pro', 10, 'PRO')}
              disabled={isProcessing}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-gamer text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{vipTier === 'pro' ? 'PLANO ATUAL ATIVO' : 'ASSINAR PRO'}</span>
            </button>
          </div>

          {/* ELITE PLAN (VIP) */}
          <div className={`p-4 rounded-xl border relative overflow-hidden transition-all ${vipTier === 'elite' ? 'border-amber-500 bg-amber-950/25' : 'border-amber-500/60 bg-[#161D2E] shadow-xl'}`}>
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-black px-3 py-0.5 text-[9px] font-bold font-gamer uppercase tracking-widest rounded-bl-lg">
              ACESSO TOTAL
            </div>

            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-amber-300 font-gamer">PLANO ELITE VIP</span>
                </div>
                <p className="text-[11px] text-slate-400">Coach IA Ilimitado + Todos os Influencers</p>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-amber-400 font-mono">{currency === 'INR' ? '₹299' : '$9.99'}</span>
                <span className="text-[10px] text-slate-400 block font-mono">{currency === 'INR' ? 'Anual (ou ₹499 Vitalício)' : 'Anual / R$ 49,90'}</span>
              </div>
            </div>

            <ul className="text-[11px] text-slate-200 space-y-1 mb-3">
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-amber-400" /> <strong>Coach IA Ilimitado</strong> com análise de vídeo e clips</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-amber-400" /> <strong>Scanner OCR Clone Sensi</strong> sem limites</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-amber-400" /> Presets de todos os Influencers (Total Gaming, Raistar, Nobru, etc.)</li>
              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-amber-400" /> Cargo VIP no Discord & Suporte Prioritário</li>
            </ul>

            <button
              onClick={() => handleSelectTier('elite', 100, 'ELITE VIP')}
              disabled={isProcessing}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold font-gamer text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-amber-500/25"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{vipTier === 'elite' ? 'VOCÊ É ELITE VIP' : 'DESBLOQUEAR ELITE VIP'}</span>
            </button>
          </div>
        </div>

        {/* Microtransactions: Token Packs */}
        <div className="p-3.5 bg-[#05070B] rounded-xl border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white font-gamer flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Microtransações de Tokens de Coach IA:
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleBuyTokens(3, currency === 'INR' ? '₹29' : '$0.99')}
              className="p-2.5 rounded-lg bg-[#161D2E] hover:bg-[#1E273D] border border-white/5 flex items-center justify-between text-xs transition-colors"
            >
              <div>
                <span className="font-bold text-white block font-gamer">3 Tokens</span>
                <span className="text-[10px] text-slate-400">Análise de mira</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">{currency === 'INR' ? '₹29' : '$0.99'}</span>
            </button>

            <button
              onClick={() => handleBuyTokens(10, currency === 'INR' ? '₹79' : '$2.49')}
              className="p-2.5 rounded-lg bg-[#161D2E] hover:bg-[#1E273D] border border-white/5 flex items-center justify-between text-xs transition-colors"
            >
              <div>
                <span className="font-bold text-white block font-gamer">10 Tokens</span>
                <span className="text-[10px] text-amber-400 font-mono">+2 Bônus</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">{currency === 'INR' ? '₹79' : '$2.49'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
