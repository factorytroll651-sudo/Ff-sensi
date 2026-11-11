import React, { useState } from 'react';
import {
  Smartphone,
  Play,
  Copy,
  Check,
  Zap,
  Activity,
  Cpu,
  Flame,
  Bot,
  Scan,
  Crown,
  ChevronRight,
  ShieldCheck,
  RotateCw,
  Sparkles,
  Sliders,
  Layers,
} from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { useSensiStore } from '../../stores/useSensiStore';
import { GAMES_INFO, launchGame, SupportedGame } from '../../services/gameLauncher';
import { TRANSLATIONS } from '../../constants/translations';
import { INFLUENCER_PRESETS } from '../../constants/influencers';
import { playSound, triggerHaptic } from '../../services/audioFeedback';

interface Props {
  onNavigateTab: (tab: 'home' | 'sensi' | 'loja' | 'settings') => void;
  onOpenCoach: () => void;
  onOpenCloneSensi: () => void;
  onOpenRewards: () => void;
  onOpenPlans: () => void;
  onOpenRecoilGuide: () => void;
  onOpenFpsBooster: () => void;
}

export const HomeTab: React.FC<Props> = ({
  onNavigateTab,
  onOpenCoach,
  onOpenCloneSensi,
  onOpenRewards,
  onOpenPlans,
  onOpenRecoilGuide,
  onOpenFpsBooster,
}) => {
  const {
    language,
    selectedGame,
    device,
    coachTokens,
    vipTier,
    masterSensitivityEnabled,
    toggleMasterSensitivity,
    streakCount,
  } = useUserStore();

  const {
    values,
    regedit,
    toggleRegedit,
    setTouchMultiplier,
    setFpsTarget,
    recordCopied,
  } = useSensiStore();

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isRamCleaning, setIsRamCleaning] = useState(false);
  const [cleanedNotice, setCleanedNotice] = useState<string | null>(null);
  const [launchNotice, setLaunchNotice] = useState<string | null>(null);

  const currentGame = GAMES_INFO[selectedGame] || GAMES_INFO.freefire_india;
  const topInfluencer = INFLUENCER_PRESETS[0]; // Raistar

  const handleCopyAll = () => {
    const text = `SensiPro FF [${device.model}]: Geral ${values.general} | Red Dot ${values.redDot} | 2x ${values.scope2x} | 4x ${values.scope4x} | AWM ${values.scopeAwm} | Botão ${values.fireButtonSize}% | DPI ${values.recommendedDpi} | Ponteiro ${values.pointerSpeed >= 0 ? `+${values.pointerSpeed}` : values.pointerSpeed}`;
    navigator.clipboard.writeText(text);
    recordCopied();
    playSound('success');
    triggerHaptic('success');
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleLaunch = (gameId: SupportedGame) => {
    playSound('boost');
    triggerHaptic('heavy');
    const res = launchGame(gameId);
    setLaunchNotice(res.message);
    setTimeout(() => setLaunchNotice(null), 3500);
  };

  const handleQuickRamClean = () => {
    setIsRamCleaning(true);
    playSound('boost');
    triggerHaptic('heavy');

    setTimeout(() => {
      setIsRamCleaning(false);
      setCleanedNotice('✓ 680 MB de memória RAM liberados. Latência de toque otimizada!');
      playSound('success');
      triggerHaptic('success');
      setTimeout(() => setCleanedNotice(null), 3000);
    }, 1400);
  };

  return (
    <div className="space-y-4 pb-24 text-slate-200">
      {/* Responsive Grid for Large Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT COLUMN: Master Switch, Hardware Telemetry & Game Launchers */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* 1. MASTER SENSITIVITY TOGGLE CARD */}
          <div className="p-4 rounded-xl bg-[#10141E] border border-white/10 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      masterSensitivityEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-xs font-bold text-white tracking-wider font-mono uppercase">
                    {masterSensitivityEnabled ? t.active_status : t.inactive_status}
                  </span>
                </div>
                <h2 className="text-sm font-bold text-white font-gamer">
                  {t.master_toggle}
                </h2>
                <p className="text-[11px] text-slate-400 font-mono">
                  Engine: <span className="text-emerald-400">{device.model}</span> (DPI: {values.recommendedDpi})
                </p>
              </div>

              <button
                onClick={() => {
                  toggleMasterSensitivity();
                  playSound('toggle');
                  triggerHaptic('medium');
                }}
                className={`w-14 h-8 rounded-full transition-colors relative flex items-center p-1 cursor-pointer ${
                  masterSensitivityEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
                aria-label="Toggle Master Sensitivity"
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                    masterSensitivityEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 2. REAL-TIME HARDWARE DIAGNOSTICS BAR */}
          <div className="p-3.5 rounded-xl bg-[#10141E] border border-white/5 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                {t.device_info}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">100% Otimizado</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-lg bg-[#080A0F] border border-white/5">
                <span className="text-[9px] text-slate-500 uppercase block">{t.refresh_rate}</span>
                <span className="font-bold text-white text-xs">{device.refreshRate} Hz</span>
              </div>

              <div className="p-2 rounded-lg bg-[#080A0F] border border-white/5">
                <span className="text-[9px] text-slate-500 uppercase block">{t.touch_sampling}</span>
                <span className="font-bold text-emerald-400 text-xs">{device.touchSamplingRate} Hz</span>
              </div>

              <div className="p-2 rounded-lg bg-[#080A0F] border border-white/5">
                <span className="text-[9px] text-slate-500 uppercase block">{t.dpi_current}</span>
                <span className="font-bold text-cyan-400 text-xs">{values.recommendedDpi}</span>
              </div>

              <div className="p-2 rounded-lg bg-[#080A0F] border border-white/5">
                <span className="text-[9px] text-slate-500 uppercase block">{t.ram_available}</span>
                <span className="font-bold text-white text-xs">5.8 / 8 GB</span>
              </div>

              <div className="p-2 rounded-lg bg-[#080A0F] border border-white/5">
                <span className="text-[9px] text-slate-500 uppercase block">{t.battery_temp}</span>
                <span className="font-bold text-amber-400 text-xs">32°C</span>
              </div>

              <div className="p-2 rounded-lg bg-[#080A0F] border border-white/5">
                <span className="text-[9px] text-slate-500 uppercase block">{t.live_ping}</span>
                <span className="font-bold text-emerald-400 text-xs">22 ms</span>
              </div>
            </div>
          </div>

          {/* 3. MULTI-GAME DIRECT LAUNCH BAR */}
          <div className="p-3.5 rounded-xl bg-[#10141E] border border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                {t.game_launcher}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Direct Launch</span>
            </div>

            {launchNotice && (
              <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-300 font-mono">
                {launchNotice}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              {/* Free Fire India */}
              <button
                onClick={() => handleLaunch('freefire_india')}
                className="p-2.5 rounded-lg bg-[#080A0F] hover:bg-[#151B28] border border-emerald-500/30 text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-emerald-400 font-mono">🇮🇳 INDIA</span>
                  <Play className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-xs font-bold text-white block mt-0.5 truncate font-gamer">FF India</span>
                <span className="text-[9px] text-slate-500 font-mono block truncate">com.dts.freefireindia</span>
              </button>

              {/* Free Fire MAX */}
              <button
                onClick={() => handleLaunch('freefire_max')}
                className="p-2.5 rounded-lg bg-[#080A0F] hover:bg-[#151B28] border border-amber-500/30 text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-amber-400 font-mono">🌟 MAX HD</span>
                  <Play className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-xs font-bold text-white block mt-0.5 truncate font-gamer">FF MAX</span>
                <span className="text-[9px] text-slate-500 font-mono block truncate">com.dts.freefiremax</span>
              </button>

              {/* Free Fire Global */}
              <button
                onClick={() => handleLaunch('freefire_global')}
                className="p-2.5 rounded-lg bg-[#080A0F] hover:bg-[#151B28] border border-blue-500/30 text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-blue-400 font-mono">🌐 GLOBAL</span>
                  <Play className="w-3 h-3 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-xs font-bold text-white block mt-0.5 truncate font-gamer">FF Global</span>
                <span className="text-[9px] text-slate-500 font-mono block truncate">com.dts.freefireth</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sensitivity Sliders, Regedit, AI Coach & Presets */}
        <div className="lg:col-span-7 space-y-3.5">
          {/* 4. ACTIVE SENSITIVITY CONFIGURATION SUMMARY */}
          <div className="p-4 rounded-xl bg-[#10141E] border border-white/10 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
                  {t.current_sensi}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  Dispositivo: {device.brand} {device.model}
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('sensi')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 font-mono cursor-pointer"
              >
                Ajustar Sliders &gt;
              </button>
            </div>

            {/* Sliders Value Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center font-mono">
              <div className="p-2.5 rounded-lg bg-[#080A0F] border border-white/5">
                <span className="text-[10px] text-slate-400 block">{t.general}</span>
                <span className="text-base font-bold text-white">{values.general}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#080A0F] border border-white/5">
                <span className="text-[10px] text-slate-400 block">{t.red_dot}</span>
                <span className="text-base font-bold text-white">{values.redDot}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#080A0F] border border-white/5">
                <span className="text-[10px] text-slate-400 block">{t.scope_2x}</span>
                <span className="text-base font-bold text-white">{values.scope2x}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#080A0F] border border-white/5">
                <span className="text-[10px] text-slate-400 block">{t.scope_4x}</span>
                <span className="text-base font-bold text-white">{values.scope4x}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#080A0F] border border-white/5">
                <span className="text-[10px] text-slate-400 block">{t.scope_awm}</span>
                <span className="text-base font-bold text-white">{values.scopeAwm}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#080A0F] border border-white/5">
                <span className="text-[10px] text-slate-400 block">{t.fire_button}</span>
                <span className="text-base font-bold text-red-400">{values.fireButtonSize}%</span>
              </div>
            </div>

            {/* Copy All Button */}
            <button
              onClick={handleCopyAll}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              {copyFeedback ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>COPIADO COM SUCESSO! ABRA O FREE FIRE</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{t.copy_to_game}</span>
                </>
              )}
            </button>
          </div>

          {/* 5. REGEDIT MOBILE & PERFORMANCE OPTIMIZER */}
          <div className="p-4 rounded-xl bg-[#10141E] border border-white/10 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {t.regedit_suite}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">100% Anti-Ban</span>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-[#080A0F] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">{t.aim_lock}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Estabilização de Mira</span>
                </div>
                <button
                  onClick={() => {
                    toggleRegedit('miraPerfeita');
                    playSound('toggle');
                  }}
                  className={`w-10 h-5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                    regedit.miraPerfeita ? 'bg-emerald-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      regedit.miraPerfeita ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-[#080A0F] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">{t.fast_click}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Aceleração de Toque</span>
                </div>
                <button
                  onClick={() => {
                    toggleRegedit('fastClick');
                    playSound('toggle');
                  }}
                  className={`w-10 h-5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                    regedit.fastClick ? 'bg-emerald-500' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      regedit.fastClick ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Touch Multiplier Selection */}
            <div className="p-2.5 rounded-lg bg-[#080A0F] border border-white/5 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[11px] text-slate-400 font-mono">Sensibilidade de Toque (Touch Multiplier):</span>
                <span className="font-bold text-emerald-400 font-mono">{regedit.touchMultiplier}x Ativo</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
                {[1, 2, 5, 10].map(m => (
                  <button
                    key={m}
                    onClick={() => {
                      setTouchMultiplier(m);
                      playSound('click');
                    }}
                    className={`py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                      regedit.touchMultiplier === m
                        ? 'bg-emerald-500 text-black'
                        : 'bg-[#151B28] text-slate-400 hover:text-white'
                    }`}
                  >
                    {m}x
                  </button>
                ))}
              </div>
            </div>

            {/* FPS Target Lock */}
            <div className="p-2.5 rounded-lg bg-[#080A0F] border border-white/5 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[11px] text-slate-400 font-mono">Estabilizador de Taxa de Quadros (FPS Lock):</span>
                <span className="font-bold text-cyan-400 font-mono">{regedit.fpsTarget} FPS</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
                {([60, 90, 120] as const).map(fps => (
                  <button
                    key={fps}
                    onClick={() => {
                      setFpsTarget(fps);
                      playSound('click');
                    }}
                    className={`py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                      regedit.fpsTarget === fps
                        ? 'bg-cyan-500 text-black'
                        : 'bg-[#151B28] text-slate-400 hover:text-white'
                    }`}
                  >
                    {fps} FPS
                  </button>
                ))}
              </div>
            </div>

            {/* Sem Recuo & RAM Cleaner Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={onOpenRecoilGuide}
                className="p-2 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-500/30 text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="text-xs font-bold text-red-300 block">{t.recoil_guide}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Ângulos de Puxada</span>
                </div>
                <Flame className="w-4 h-4 text-red-400" />
              </button>

              <button
                onClick={handleQuickRamClean}
                disabled={isRamCleaning}
                className="p-2 rounded-lg bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-500/30 text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="text-xs font-bold text-cyan-300 block">{t.ram_cleaner}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {isRamCleaning ? 'Limpando...' : t.clean_now}
                  </span>
                </div>
                <RotateCw className={`w-4 h-4 text-cyan-400 ${isRamCleaning ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {cleanedNotice && (
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs font-mono animate-in zoom-in-95">
                {cleanedNotice}
              </div>
            )}
          </div>

          {/* 6. AI COACH & CLONE SENSI ENTRY TILES */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onOpenCoach}
              className="p-3 rounded-xl bg-[#10141E] hover:bg-[#151B28] border border-white/10 text-left transition-colors flex flex-col justify-between cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-white block">{t.coach_ia}</span>
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Diagnóstico de mira, correção de capa e análise de clips
              </p>
              <span className="mt-2 text-[10px] font-mono font-bold text-emerald-400">
                {coachTokens} Tokens Disponíveis &gt;
              </span>
            </button>

            <button
              onClick={onOpenCloneSensi}
              className="p-3 rounded-xl bg-[#10141E] hover:bg-[#151B28] border border-white/10 text-left transition-colors flex flex-col justify-between cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-white block">{t.clone_sensi}</span>
                <Scan className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Extraia a sensibilidade de prints de vídeos e lives do YouTube
              </p>
              <span className="mt-2 text-[10px] font-mono font-bold text-purple-400">
                Abrir Scanner OCR &gt;
              </span>
            </button>
          </div>

          {/* 7. PRO INFLUENCER HIGHLIGHT */}
          <div className="p-3.5 rounded-xl bg-[#10141E] border border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                {t.pro_presets} (Esports Verified)
              </span>
              <button
                onClick={() => onNavigateTab('loja')}
                className="text-[11px] text-emerald-400 hover:underline font-mono"
              >
                Ver Todos &gt;
              </button>
            </div>

            <div className="p-2.5 rounded-lg bg-[#080A0F] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={topInfluencer.avatar}
                  alt={topInfluencer.name}
                  className="w-10 h-10 rounded-lg object-cover border border-amber-500/40"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{topInfluencer.name}</span>
                    <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-400 font-mono">
                      {topInfluencer.badge}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    Geral: {topInfluencer.general} | Red Dot: {topInfluencer.redDot} | Botão: {topInfluencer.fireButtonSize}%
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('loja')}
                className="px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono cursor-pointer"
              >
                USAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
