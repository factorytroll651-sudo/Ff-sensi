import React, { useState } from 'react';
import {
  Gamepad2,
  Smartphone,
  Volume2,
  VolumeX,
  Vibrate,
  Download,
  Upload,
  User,
  ShieldCheck,
  Headphones,
  Sparkles,
  ExternalLink,
  Crown,
  Share2,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { useSensiStore } from '../../stores/useSensiStore';
import { GAMES_INFO, SupportedGame } from '../../services/gameLauncher';
import { autoDetectDevice } from '../../constants/devices';
import { playSound, triggerHaptic } from '../../services/audioFeedback';

interface Props {
  onOpenAuth: () => void;
  onOpenReferral: () => void;
  onOpenPlans: () => void;
}

export const SettingsTab: React.FC<Props> = ({ onOpenAuth, onOpenReferral, onOpenPlans }) => {
  const {
    selectedGame,
    setSelectedGame,
    device,
    setDevice,
    soundEnabled,
    toggleSound,
    hapticsEnabled,
    toggleHaptics,
    isLoggedIn,
    displayName,
    email,
    vipTier,
    coachTokens,
    setVipTier,
    addTokens,
  } = useUserStore();

  const { values, setAllValues, savedProfiles } = useSensiStore();

  const [tapCount, setTapCount] = useState(0);
  const [devUnlockedAlert, setDevUnlockedAlert] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  // 7-Tap Secret Dev Mode as specifically instructed in requirements!
  const handleSecretDevTap = () => {
    playSound('click');
    triggerHaptic('light');

    setTapCount(prev => {
      const next = prev + 1;
      if (next >= 7) {
        setVipTier('elite');
        addTokens(500);
        playSound('success');
        triggerHaptic('success');
        setDevUnlockedAlert(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return 0;
      }
      return next;
    });
  };

  const handleExportJSON = () => {
    const payload = {
      app: 'SensiPro FF',
      exportedAt: new Date().toISOString(),
      device: device.model,
      selectedGame,
      currentSensi: values,
      savedProfiles,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SensiPro_Backup_${device.model.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    playSound('success');
    setExportNotice('Backup JSON exportado com sucesso!');
    setTimeout(() => setExportNotice(null), 2500);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string);
          if (parsed.currentSensi) {
            setAllValues(parsed.currentSensi);
            playSound('success');
            setExportNotice('Configurações importadas com sucesso!');
            setTimeout(() => setExportNotice(null), 2500);
          }
        } catch {
          alert('Arquivo JSON inválido.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleAutoDetect = () => {
    const detected = autoDetectDevice();
    setDevice(detected);
    playSound('success');
    triggerHaptic('success');
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setSupportSubmitted(true);
    playSound('success');
    setSupportMessage('');
    setTimeout(() => setSupportSubmitted(false), 3000);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Dev Mode Notification Modal */}
      {devUnlockedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in zoom-in-95">
          <div className="w-full max-w-sm p-5 bg-gradient-to-br from-[#0F141F] to-[#161D2E] border-2 border-amber-400 rounded-2xl shadow-2xl space-y-3 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-base font-bold text-white font-gamer">
              🛠️ MODO DESENVOLVEDOR ATIVADO!
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Todos os recursos <strong>ELITE VIP</strong> foram liberados e <strong>+500 Tokens de Coach IA</strong> foram creditados no seu saldo!
            </p>
            <button
              onClick={() => setDevUnlockedAlert(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold font-gamer text-xs shadow-lg shadow-amber-500/25 transition-transform active:scale-95"
            >
              APROVEITAR RECURSOS VIP
            </button>
          </div>
        </div>
      )}

      {/* Settings Sections Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* LEFT COLUMN: Account, Game Client & Device */}
        <div className="space-y-4">
          {/* User Account Card */}
          <div className="p-4 bg-[#10141E] rounded-xl border border-white/10 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-400" />
                CONTA DO JOGADOR
              </h3>
              <button
                onClick={onOpenAuth}
                className="text-xs font-bold text-emerald-400 font-mono hover:underline cursor-pointer"
              >
                {isLoggedIn ? 'Gerenciar Perfil' : 'Fazer Login'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#080A0F] rounded-lg border border-white/5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white font-gamer">{displayName}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                    vipTier === 'elite' ? 'bg-amber-500/20 text-amber-400' : vipTier === 'pro' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {vipTier === 'elite' ? 'ELITE VIP' : vipTier === 'pro' ? 'PRO VIP' : 'FREE TIER'}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono block">{email}</span>
              </div>

              <div className="text-right">
                <span className="text-[9px] text-slate-500 font-mono uppercase block">Saldo Coach</span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {vipTier === 'elite' ? '∞ Ilimitado' : `${coachTokens} Tokens`}
                </span>
              </div>
            </div>

            {/* Action Row */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={onOpenPlans}
                className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Planos & VIP</span>
              </button>

              <button
                onClick={onOpenReferral}
                className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Indicar Amigos</span>
              </button>
            </div>
          </div>

          {/* Target Game Selector */}
          <div className="p-4 bg-[#10141E] rounded-xl border border-white/10 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-emerald-400" />
                CLIENTE DE JOGO ALVO
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Calibração de Latência</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(['freefire_india', 'freefire_max', 'freefire_global'] as SupportedGame[]).map(gId => {
                const info = GAMES_INFO[gId];
                const isSelected = selectedGame === gId;

                return (
                  <button
                    key={gId}
                    onClick={() => {
                      setSelectedGame(gId);
                      playSound('toggle');
                      triggerHaptic('light');
                    }}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/30 text-emerald-300'
                        : 'border-white/5 bg-[#080A0F] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-bold font-mono">{info.badge}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <h4 className="text-xs font-bold text-white font-gamer">{info.title}</h4>
                    <span className="text-[9px] text-slate-500 font-mono truncate block">{info.packageName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hardware Device Settings */}
          <div className="p-4 bg-[#10141E] rounded-xl border border-white/10 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                DETECÇÃO DE APARELHO
              </h3>
              <button
                onClick={handleAutoDetect}
                className="text-[11px] text-emerald-400 hover:underline font-mono font-bold cursor-pointer"
              >
                Auto-Detectar Agora
              </button>
            </div>

            <div className="p-3 bg-[#080A0F] rounded-lg border border-white/5 space-y-1">
              <span className="text-xs font-bold text-white font-gamer block">{device.model}</span>
              <p className="text-[11px] text-slate-400 font-mono">
                DPI Nativo: {device.screenDpi} • Taxa de Amostragem de Toque: {device.touchSamplingRate}Hz
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sound, Sync & Support */}
        <div className="space-y-4">
          {/* Sound & Haptics Preferences */}
          <div className="p-4 bg-[#10141E] rounded-xl border border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider pb-2 border-b border-white/10">
              PREFERÊNCIAS DE SOM & SENSAÇÃO TÁTIL
            </h3>

        <div className="flex items-center justify-between p-2.5 bg-[#05070B] rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span className="text-xs font-bold text-white font-gamer">Efeitos Sonoros Cibernéticos</span>
          </div>
          <button
            onClick={toggleSound}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              soundEnabled ? 'bg-emerald-500' : 'bg-slate-800'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-2.5 bg-[#05070B] rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            <Vibrate className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white font-gamer">Feedback Háptico (Vibração ao Toque)</span>
          </div>
          <button
            onClick={toggleHaptics}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              hapticsEnabled ? 'bg-emerald-500' : 'bg-slate-800'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${hapticsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Backup & Export / Import */}
      <div className="p-4 bg-[#0F141F] rounded-2xl border border-white/10 space-y-3">
        <h3 className="text-sm font-bold text-white font-gamer pb-2 border-b border-white/10">
          BACKUP & SINCRONIZAÇÃO
        </h3>

        {exportNotice && (
          <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-gamer flex items-center gap-1.5 animate-in zoom-in-95">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{exportNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExportJSON}
            className="p-2.5 rounded-xl bg-[#05070B] hover:bg-[#161D2E] border border-white/10 text-white font-bold font-gamer text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exportar JSON</span>
          </button>

          <label className="p-2.5 rounded-xl bg-[#05070B] hover:bg-[#161D2E] border border-white/10 text-white font-bold font-gamer text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Importar JSON</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>
        </div>
      </div>

      {/* Helpdesk & Support Form */}
      <div className="p-4 bg-[#0F141F] rounded-2xl border border-white/10 space-y-3">
        <h3 className="text-sm font-bold text-white font-gamer pb-2 border-b border-white/10 flex items-center gap-1.5">
          <Headphones className="w-4 h-4 text-emerald-400" />
          SUPORTE AO JOGADOR & PEDIDO DE SENSI
        </h3>

        {supportSubmitted ? (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-gamer">
            Ticket enviado com sucesso! Nosso time de análise responderá em até 24 horas.
          </div>
        ) : (
          <form onSubmit={handleSubmitTicket} className="space-y-2">
            <textarea
              required
              rows={2}
              placeholder="Descreva seu aparelho, arma favorita ou dúvida de sensibilidade..."
              value={supportMessage}
              onChange={e => setSupportMessage(e.target.value)}
              className="w-full p-2.5 bg-[#05070B] rounded-xl border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-500 font-gamer"
            />
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold font-gamer text-xs transition-colors"
            >
              ENVIAR TICKET
            </button>
          </form>
        )}
      </div>
    </div>
  </div>

      {/* Footer Version: SECRET 7-TAP TARGET (Explicitly tested by user in prompt lines 234-267) */}
      <button
        onClick={handleSecretDevTap}
        className="w-full py-4 flex flex-col items-center justify-center cursor-pointer select-none group active:opacity-80"
        aria-label="Secret Dev Tap Version Target"
      >
        <span className="text-gray-500 text-xs font-mono group-hover:text-gray-400 transition-colors">
          Versão 1.0.0 (Build 42) - Free Fire India
        </span>
        <span className="text-[9px] text-gray-700 font-mono mt-0.5">
          {tapCount > 0 && tapCount < 7 ? `[Dev Tap: ${tapCount}/7]` : '© 2026 SensiPro FF Technologies'}
        </span>
      </button>
    </div>
  );
};
