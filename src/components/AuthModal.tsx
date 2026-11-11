import React, { useState } from 'react';
import { X, Lock, Mail, ShieldCheck, UserCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';
import { playSound, triggerHaptic } from '../services/audioFeedback';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { isLoggedIn, email, displayName, loginUser, logoutUser } = useUserStore();
  const [inputEmail, setInputEmail] = useState('');
  const [inputName, setInputName] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.includes('@')) return;

    setIsLoading(true);
    playSound('toggle');
    triggerHaptic('light');

    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      playSound('success');
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    playSound('boost');
    triggerHaptic('medium');

    setTimeout(() => {
      loginUser(inputEmail, inputName || undefined);
      setIsLoading(false);
      playSound('success');
      triggerHaptic('success');
      onClose();
    }, 1000);
  };

  const handleFastDemoLogin = () => {
    loginUser('pro_player@sensipro.gg', 'RaistarFan_99');
    playSound('success');
    triggerHaptic('success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0F141F] border border-white/10 rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-gamer">
                {isLoggedIn ? 'PERFIL DO JOGADOR' : 'ENTRAR NO SENSIPRO FF'}
              </h3>
              <p className="text-xs text-slate-400">
                {isLoggedIn ? 'Conta Autenticada e Sincronizada' : 'Acesso Rápido Sem Senha (OTP)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoggedIn ? (
          <div className="space-y-4">
            <div className="p-4 bg-[#05070B] rounded-xl border border-white/10 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <UserCheck className="w-6 h-6" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="text-sm font-bold text-white font-gamer truncate">{displayName}</h4>
                <p className="text-xs text-slate-400 font-mono truncate">{email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                  Sincronização em Nuvem Ativa
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                logoutUser();
                playSound('click');
              }}
              className="w-full py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-bold font-gamer text-xs transition-colors"
            >
              ENCERRAR SESSÃO
            </button>
          </div>
        ) : step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 font-gamer uppercase tracking-wide mb-1.5">
                Nome de Jogador / Nickname
              </label>
              <input
                type="text"
                placeholder="Ex: Ghost_FF, AjjuFan, NobruStyle"
                value={inputName}
                onChange={e => setInputName(e.target.value)}
                className="w-full px-3 py-2 bg-[#05070B] rounded-xl border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 font-gamer uppercase tracking-wide mb-1.5">
                E-mail para Código OTP
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  value={inputEmail}
                  onChange={e => setInputEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#05070B] rounded-xl border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-gamer text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <span>{isLoading ? 'ENVIANDO CÓDIGO...' : 'CONTINUAR COM CÓDIGO OTP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-white/10" />
              <span className="flex-shrink mx-3 text-slate-500 text-[10px] font-mono">OU</span>
              <div className="flex-grow border-t border-white/10" />
            </div>

            <button
              type="button"
              onClick={handleFastDemoLogin}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-gamer text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Login Rápido de Demonstração (1-Clique)</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-xs text-slate-400 text-center">
              Insira o código de 4 dígitos enviado para <strong className="text-white font-mono">{inputEmail}</strong>:
            </p>

            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map(i => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={otpCode[i]}
                  onChange={e => {
                    const val = e.target.value;
                    const next = [...otpCode];
                    next[i] = val;
                    setOtpCode(next);
                    if (val && i < 3) {
                      document.getElementById(`otp-${i + 1}`)?.focus();
                    }
                  }}
                  className="w-12 h-12 text-center text-lg font-mono font-bold bg-[#05070B] border border-emerald-500/40 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-gamer text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoading ? 'VERIFICANDO...' : 'CONFIRMAR & ENTRAR'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
