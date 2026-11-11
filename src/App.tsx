import React, { useState, useEffect } from 'react';
import {
  Home,
  Sliders,
  Crown,
  Settings,
  Bot,
  Scan,
  Maximize2,
  Minimize2,
  Globe,
  Smartphone,
  Shield,
} from 'lucide-react';
import { useUserStore } from './stores/useUserStore';
import { HomeTab } from './components/tabs/HomeTab';
import { SensiTab } from './components/tabs/SensiTab';
import { LojaTab } from './components/tabs/LojaTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { CoachModal } from './components/CoachModal';
import { CloneSensiModal } from './components/CloneSensiModal';
import { PlansModal } from './components/PlansModal';
import { RewardsModal } from './components/RewardsModal';
import { ReferralModal } from './components/ReferralModal';
import { AuthModal } from './components/AuthModal';
import { HUDPlacementModal } from './components/HUDPlacementModal';
import { RecoilGuideModal } from './components/RecoilGuideModal';
import { FpsBoosterModal } from './components/FpsBoosterModal';
import { GAMES_INFO } from './services/gameLauncher';
import { Language } from './constants/translations';
import { playSound, triggerHaptic } from './services/audioFeedback';

type TabType = 'home' | 'sensi' | 'loja' | 'settings';

export default function App() {
  const { selectedGame, device, language, setLanguage, vipTier } = useUserStore();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  // Modal states
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [isCloneSensiOpen, setIsCloneSensiOpen] = useState(false);
  const [isPlansOpen, setIsPlansOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHUDGuideOpen, setIsHUDGuideOpen] = useState(false);
  const [isRecoilGuideOpen, setIsRecoilGuideOpen] = useState(false);
  const [isFpsBoosterOpen, setIsFpsBoosterOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as TabType;
      if (tabParam && ['home', 'sensi', 'loja', 'settings'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    playSound('click');
    triggerHaptic('light');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentGame = GAMES_INFO[selectedGame] || GAMES_INFO.freefire_india;

  return (
    <div className="min-h-screen bg-[#080A0F] text-slate-200 flex flex-col items-center justify-start antialiased selection:bg-blue-600/30 selection:text-blue-200">
      {/* Top Application Bar with Language Selector & Screen Mode */}
      <header className="w-full border-b border-white/10 bg-[#0A0D15]/95 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between text-xs">
          {/* Brand & Active Game Status */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="absolute w-4 h-4 rounded-full bg-emerald-400/40 animate-ping"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-white tracking-wider text-sm uppercase font-gamer">
                  SensiPro FF
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[9px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                  REAL SENSI PRO
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                <span className="text-white font-bold">{currentGame.title}</span>
                <span>•</span>
                <span>{device.model}</span>
                <span>•</span>
                <span className="text-emerald-400">{device.refreshRate}Hz</span>
              </div>
            </div>
          </div>

          {/* Center Navigation on Tablet/Desktop */}
          <nav className="hidden md:flex items-center bg-[#10141E] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => handleTabChange('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Painel</span>
            </button>

            <button
              onClick={() => handleTabChange('sensi')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'sensi'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Sensi & DPI</span>
            </button>

            <button
              onClick={() => handleTabChange('loja')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'loja'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>Presets Pro & VIP</span>
            </button>

            <button
              onClick={() => handleTabChange('settings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Ajustes</span>
            </button>
          </nav>

          {/* Right Controls: Language Selector & Screen Mode */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center bg-[#10141E] rounded-lg border border-white/10 p-0.5">
              <button
                onClick={() => {
                  setLanguage('hi');
                  playSound('click');
                }}
                className={`px-2 py-1 text-[11px] rounded font-mono font-bold cursor-pointer transition-colors ${
                  language === 'hi' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="हिंदी (Hindi)"
              >
                🇮🇳 HI
              </button>
              <button
                onClick={() => {
                  setLanguage('en');
                  playSound('click');
                }}
                className={`px-2 py-1 text-[11px] rounded font-mono font-bold cursor-pointer transition-colors ${
                  language === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => {
                  setLanguage('pt');
                  playSound('click');
                }}
                className={`px-2 py-1 text-[11px] rounded font-mono font-bold cursor-pointer transition-colors ${
                  language === 'pt' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Português"
              >
                PT
              </button>
            </div>

            {/* Desktop / Phone Simulator Toggle */}
            <button
              onClick={() => setIsPhoneFrame(!isPhoneFrame)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#10141E] hover:bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-mono"
              title={isPhoneFrame ? 'Mudar para Vista Desktop Larga' : 'Simular Tela de Celular'}
            >
              {isPhoneFrame ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Desktop</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Celular</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-md my-6 rounded-[40px] border-[8px] border-[#161D2E] shadow-2xl overflow-hidden min-h-[820px] relative bg-[#080A0F] p-3'
            : 'max-w-6xl mx-auto px-4 py-4 md:py-6'
        }`}
      >
        {/* Tab Content Router */}
        <div>
          {activeTab === 'home' && (
            <HomeTab
              onNavigateTab={handleTabChange}
              onOpenCoach={() => setIsCoachOpen(true)}
              onOpenCloneSensi={() => setIsCloneSensiOpen(true)}
              onOpenRewards={() => setIsRewardsOpen(true)}
              onOpenPlans={() => setIsPlansOpen(true)}
              onOpenRecoilGuide={() => setIsRecoilGuideOpen(true)}
              onOpenFpsBooster={() => setIsFpsBoosterOpen(true)}
            />
          )}

          {activeTab === 'sensi' && (
            <SensiTab
              onOpenHUDGuide={() => setIsHUDGuideOpen(true)}
              onOpenRecoilGuide={() => setIsRecoilGuideOpen(true)}
              onOpenFpsBooster={() => setIsFpsBoosterOpen(true)}
            />
          )}

          {activeTab === 'loja' && (
            <LojaTab
              onOpenPlans={() => setIsPlansOpen(true)}
              onNavigateTab={handleTabChange}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              onOpenAuth={() => setIsAuthOpen(true)}
              onOpenReferral={() => setIsReferralOpen(true)}
              onOpenPlans={() => setIsPlansOpen(true)}
            />
          )}
        </div>

        {/* Bottom Android Navigation Bar (visible on mobile or inside phone simulator) */}
        <nav
          className={`${
            isPhoneFrame
              ? 'absolute bottom-0 left-0 right-0 z-40 bg-[#0E121C]/95 backdrop-blur-md border-t border-white/10 py-2.5 px-3 rounded-b-[32px]'
              : 'fixed bottom-0 left-0 right-0 z-40 bg-[#0E121C]/95 backdrop-blur-md border-t border-white/10 py-2.5 px-3 md:hidden'
          }`}
        >
          <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
            {/* TAB 1: Dashboard */}
            <button
              onClick={() => handleTabChange('home')}
              className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'home'
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-mono mt-0.5">Painel</span>
            </button>

            {/* TAB 2: Sensibilidade */}
            <button
              onClick={() => handleTabChange('sensi')}
              className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'sensi'
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-5 h-5" />
              <span className="text-[10px] font-mono mt-0.5">Sensi & DPI</span>
            </button>

            {/* TAB 3: Loja (Store & Pro Presets) */}
            <button
              onClick={() => handleTabChange('loja')}
              className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'loja'
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-5 h-5" />
              <span className="text-[10px] font-mono mt-0.5">Presets</span>
            </button>

            {/* TAB 4: Ajustes (Settings & Profile) */}
            <button
              onClick={() => handleTabChange('settings')}
              className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-[10px] font-mono mt-0.5">Ajustes</span>
            </button>
          </div>
        </nav>
      </main>

      {/* Global Modals */}
      <CoachModal
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
        onOpenPlans={() => {
          setIsCoachOpen(false);
          setIsPlansOpen(true);
        }}
      />

      <CloneSensiModal
        isOpen={isCloneSensiOpen}
        onClose={() => setIsCloneSensiOpen(false)}
      />

      <PlansModal
        isOpen={isPlansOpen}
        onClose={() => setIsPlansOpen(false)}
      />

      <RewardsModal
        isOpen={isRewardsOpen}
        onClose={() => setIsRewardsOpen(false)}
      />

      <ReferralModal
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <HUDPlacementModal
        isOpen={isHUDGuideOpen}
        onClose={() => setIsHUDGuideOpen(false)}
      />

      <RecoilGuideModal
        isOpen={isRecoilGuideOpen}
        onClose={() => setIsRecoilGuideOpen(false)}
      />

      <FpsBoosterModal
        isOpen={isFpsBoosterOpen}
        onClose={() => setIsFpsBoosterOpen(false)}
      />
    </div>
  );
}
