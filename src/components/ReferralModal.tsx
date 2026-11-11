import React, { useState } from 'react';
import { X, Users, Copy, Check, Gift, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';
import { playSound, triggerHaptic } from '../services/audioFeedback';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferralModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { referralCode, referredCount, redeemReferral } = useUserStore();
  const [inputCode, setInputCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    playSound('click');
    triggerHaptic('light');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const res = redeemReferral(inputCode);
    setResultMessage({ text: res.message, success: res.success });
    if (res.success) {
      playSound('success');
      triggerHaptic('success');
      setInputCode('');
    } else {
      playSound('click');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0F141F] border border-white/10 rounded-2xl p-5 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-gamer">INDICAÇÃO & CUPONS</h3>
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                  AFILIADOS
                </span>
              </div>
              <p className="text-xs text-slate-400">Convide Amigos e Ganhe Tokens de Coach IA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User's Referral Code Card */}
        <div className="p-4 bg-[#05070B] rounded-xl border border-white/10 mb-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-mono">Seu Código de Indicação Único:</span>
            <span className="text-emerald-400 font-mono font-bold">{referredCount} Amigos Indicados</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 p-3 bg-[#161D2E] rounded-xl border border-dashed border-white/20 text-center font-mono text-lg font-bold text-amber-400 tracking-wider">
              {referralCode}
            </div>
            <button
              onClick={handleCopy}
              className="p-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-black font-bold flex items-center justify-center transition-colors"
              title="Copiar Código"
            >
              {copiedCode ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            Compartilhe seu código nos grupos de WhatsApp ou Discord do seu squad. Quando seu amigo usar o app, vocês dois recebem <strong className="text-white">+2 Tokens de Coach IA</strong> imediatamente.
          </p>
        </div>

        {/* Redeem Friend / Creator Code Form */}
        <form onSubmit={handleRedeem} className="p-4 bg-[#161D2E] rounded-xl border border-white/5 space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white font-gamer">RESGATAR CÓDIGO DE CRIADOR OU AMIGO</h4>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Digite o código (ex: AJJU99, RAIS77)"
              value={inputCode}
              onChange={e => setInputCode(e.target.value.toUpperCase())}
              className="flex-1 px-3 py-2 bg-[#05070B] rounded-xl border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 uppercase placeholder:normal-case placeholder:text-slate-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-gamer text-xs rounded-xl transition-colors shadow-md"
            >
              RESGATAR
            </button>
          </div>

          {resultMessage && (
            <div
              className={`p-2.5 rounded-lg text-xs font-medium ${
                resultMessage.success
                  ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                  : 'bg-red-950/40 border border-red-500/40 text-red-300'
              }`}
            >
              {resultMessage.text}
            </div>
          )}
        </form>

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
