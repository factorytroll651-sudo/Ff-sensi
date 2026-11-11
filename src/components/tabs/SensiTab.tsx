import React, { useState } from 'react';
import {
  Smartphone,
  Search,
  Check,
  Copy,
  Save,
  RotateCcw,
  Sliders,
  Layers,
  Flame,
  Zap,
  Target,
  ShieldAlert,
  ChevronDown,
  Sparkles,
  MousePointer,
  Gauge,
} from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { useSensiStore } from '../../stores/useSensiStore';
import { POPULAR_DEVICES, DeviceSpec } from '../../constants/devices';
import { WEAPON_CATEGORIES, WeaponCategory, WEAPONS_CATALOG } from '../../constants/weapons';
import { FireButtonVisualizer } from '../FireButtonVisualizer';
import { formatPointerSpeed } from '../../services/sensiAlgorithm';
import { playSound, triggerHaptic } from '../../services/audioFeedback';

interface Props {
  onOpenHUDGuide: () => void;
  onOpenRecoilGuide: () => void;
  onOpenFpsBooster: () => void;
}

export const SensiTab: React.FC<Props> = ({ onOpenHUDGuide, onOpenRecoilGuide, onOpenFpsBooster }) => {
  const { device, setDevice } = useUserStore();
  const {
    values,
    sliderScale,
    activeWeapon,
    playstyle,
    regedit,
    updateValue,
    setSliderScale,
    setActiveWeapon,
    setPlaystyle,
    toggleRegedit,
    saveCurrentProfile,
    recordCopied,
  } = useSensiStore();

  const [deviceSearch, setDeviceSearch] = useState('');
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [saveProfileName, setSaveProfileName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const filteredDevices = POPULAR_DEVICES.filter(d =>
    `${d.brand} ${d.model}`.toLowerCase().includes(deviceSearch.toLowerCase())
  );

  const maxSliderValue = sliderScale === '200' ? 200 : 100;

  const handleSliderChange = (key: keyof typeof values, val: number) => {
    updateValue(key, val);
    playSound('slider');
    triggerHaptic('light');
  };

  const handleCopyAll = () => {
    const text = `SensiPro FF Config [${device.model}]: Geral ${values.general} | Red Dot ${values.redDot} | 2x ${values.scope2x} | 4x ${values.scope4x} | AWM ${values.scopeAwm} | Olhadinha ${values.freeLook} | Botão ${values.fireButtonSize}% | DPI ${values.recommendedDpi} | Ponteiro ${formatPointerSpeed(values.pointerSpeed)}`;
    navigator.clipboard.writeText(text);
    recordCopied();
    playSound('success');
    triggerHaptic('success');
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveProfileName.trim()) return;
    saveCurrentProfile(saveProfileName, device.model);
    playSound('success');
    triggerHaptic('success');
    setShowSaveDialog(false);
    setSaveProfileName('');
  };

  const activeWeaponInfo = WEAPONS_CATALOG.find(w => w.category === activeWeapon);

  return (
    <div className="space-y-4 pb-24 text-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT COLUMN: Device, Scale, Weapon Presets & Sliders */}
        <div className="lg:col-span-7 space-y-3.5">
          {/* Device Selector Card */}
      <div className="p-4 bg-[#10141E] rounded-xl border border-white/10 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-mono text-emerald-400 uppercase tracking-wider block font-bold">
            Dispositivo Selecionado
          </span>
          <button
            onClick={() => setIsDeviceModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-mono text-xs flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mudar Aparelho</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#080A0F] rounded-lg border border-white/5">
          <div>
            <h3 className="text-sm font-bold text-white font-gamer">{device.model}</h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Marca: {device.brand} • Tela: {device.screenDpi} DPI • Refresh: {device.refreshRate}Hz
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-slate-500 font-mono uppercase block">Touch Polling</span>
            <span className="text-xs font-mono font-bold text-emerald-400">{device.touchSamplingRate}Hz</span>
          </div>
        </div>
      </div>

      {/* Scale Mode & Playstyle Row */}
      <div className="grid grid-cols-2 gap-2">
        {/* Scale Toggle (100 vs 200) */}
        <div className="p-3 bg-[#10141E] rounded-xl border border-white/10 space-y-2">
          <span className="text-xs font-bold text-white font-mono flex items-center justify-between">
            <span>Escala dos Sliders</span>
            <span className="text-[10px] font-mono text-slate-400">0-100 / 0-200</span>
          </span>
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#080A0F] rounded-lg border border-white/5">
            <button
              onClick={() => {
                setSliderScale('100');
                playSound('toggle');
              }}
              className={`py-1.5 rounded-md text-xs font-bold font-mono transition-all cursor-pointer ${
                sliderScale === '100' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              0 - 100
            </button>
            <button
              onClick={() => {
                setSliderScale('200');
                playSound('toggle');
              }}
              className={`py-1.5 rounded-md text-xs font-bold font-mono transition-all cursor-pointer ${
                sliderScale === '200' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              0 - 200
            </button>
          </div>
        </div>

        {/* Playstyle Selector */}
        <div className="p-3 bg-[#10141E] rounded-xl border border-white/10 space-y-2">
          <span className="text-xs font-bold text-white font-mono flex items-center justify-between">
            <span>Estilo de Jogo</span>
            <span className="text-[10px] font-mono text-emerald-400">Tuning IA</span>
          </span>
          <select
            value={playstyle}
            onChange={e => {
              setPlaystyle(e.target.value as any, device);
              playSound('toggle');
            }}
            className="w-full py-1.5 px-2 rounded-lg bg-[#080A0F] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="balanced">Equilibrado (Padrão)</option>
            <option value="aggressive_rusher">Rusher Agressivo (Rápido)</option>
            <option value="tactical_drag">Puxada Tática (Anti-Jitter)</option>
            <option value="sniper_support">Suporte Sniper (Estável)</option>
          </select>
        </div>
      </div>

      {/* Weapon Filter Chips */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 font-gamer uppercase tracking-wide block">
          Preset por Categoria de Arma:
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {WEAPON_CATEGORIES.map(w => (
            <button
              key={w.id}
              onClick={() => {
                setActiveWeapon(w.id, device);
                playSound('click');
                triggerHaptic('light');
              }}
              className={`px-3 py-2 rounded-xl border text-xs font-bold font-gamer shrink-0 transition-all ${
                activeWeapon === w.id
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-md shadow-emerald-500/15'
                  : 'border-white/5 bg-[#0F141F] text-slate-400 hover:text-white'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>

        {/* Weapon Drag Tip */}
        {activeWeaponInfo && (
          <div className="p-2.5 rounded-xl bg-[#161D2E] border border-white/5 text-[11px] text-slate-300 flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              <strong className="text-amber-300 font-gamer">{activeWeaponInfo.name}:</strong> {activeWeaponInfo.tip}
            </span>
          </div>
        )}
      </div>

      {/* 6 In-Game Sensitivity Sliders */}
      <div className="p-4 bg-[#0F141F] rounded-2xl border border-white/10 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-white/10">
          <h3 className="text-sm font-bold text-white font-gamer flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-emerald-400" />
            SLIDERS DE SENSIBILIDADE NO JOGO
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Sensibilidade Exata</span>
        </div>

        {/* Geral */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-white font-gamer">GERAL (Câmera Base)</span>
            <span className="font-mono font-bold text-emerald-400">{values.general}</span>
          </div>
          <input
            type="range"
            min={0}
            max={maxSliderValue}
            value={values.general}
            onChange={e => handleSliderChange('general', parseInt(e.target.value, 10))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Ponto Vermelho */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-white font-gamer">PONTO VERMELHO (Red Dot)</span>
            <span className="font-mono font-bold text-emerald-400">{values.redDot}</span>
          </div>
          <input
            type="range"
            min={0}
            max={maxSliderValue}
            value={values.redDot}
            onChange={e => handleSliderChange('redDot', parseInt(e.target.value, 10))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Mira 2x */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-white font-gamer">MIRA 2X (2x Scope)</span>
            <span className="font-mono font-bold text-emerald-400">{values.scope2x}</span>
          </div>
          <input
            type="range"
            min={0}
            max={maxSliderValue}
            value={values.scope2x}
            onChange={e => handleSliderChange('scope2x', parseInt(e.target.value, 10))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Mira 4x */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-white font-gamer">MIRA 4X (4x Scope)</span>
            <span className="font-mono font-bold text-emerald-400">{values.scope4x}</span>
          </div>
          <input
            type="range"
            min={0}
            max={maxSliderValue}
            value={values.scope4x}
            onChange={e => handleSliderChange('scope4x', parseInt(e.target.value, 10))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Mira AWM */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-white font-gamer">MIRA AWM (Sniper)</span>
            <span className="font-mono font-bold text-emerald-400">{values.scopeAwm}</span>
          </div>
          <input
            type="range"
            min={0}
            max={maxSliderValue}
            value={values.scopeAwm}
            onChange={e => handleSliderChange('scopeAwm', parseInt(e.target.value, 10))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* Olhadinha */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-white font-gamer">OLHADINHA (Free Look 360°)</span>
            <span className="font-mono font-bold text-emerald-400">{values.freeLook}</span>
          </div>
          <input
            type="range"
            min={0}
            max={maxSliderValue}
            value={values.freeLook}
            onChange={e => handleSliderChange('freeLook', parseInt(e.target.value, 10))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Bottom Save & Copy Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleCopyAll}
          className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-gamer text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          {copyFeedback ? (
            <>
              <Check className="w-4 h-4" />
              <span>COPIADO COM SUCESSO!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>COPIAR SENSIBILIDADE COMPLETA</span>
            </>
          )}
        </button>

        <button
          onClick={() => setShowSaveDialog(true)}
          className="px-4 py-3 rounded-xl bg-[#0F141F] hover:bg-[#161D2E] border border-white/10 text-white font-bold font-gamer text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          title="Salvar como Perfil"
        >
          <Save className="w-4 h-4 text-amber-400" />
          <span>SALVAR</span>
        </button>
      </div>
    </div>

    {/* RIGHT COLUMN: Visualizer, Claw HUD, DPI & Pointer Speed, Tactical Regedit */}
    <div className="lg:col-span-5 space-y-3.5">
      {/* Hardware Tuning Metrics: Fire Button Size Visualizer */}
      <FireButtonVisualizer
        buttonSize={values.fireButtonSize}
        onChangeSize={newSize => updateValue('fireButtonSize', newSize)}
      />

      {/* Link to Claw HUD Placement Modal */}
      <button
        onClick={onOpenHUDGuide}
        className="w-full p-3 bg-[#0F141F] hover:bg-[#161D2E] rounded-2xl border border-white/10 flex items-center justify-between text-left transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white font-gamer block">POSIÇÃO DO BOTÃO NO HUD</span>
            <span className="text-[10px] text-slate-400">Visualizar diagrama para 2, 3 e 4 Dedos (Claw)</span>
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-400 font-gamer">Ver Diagrama &gt;</span>
      </button>

      {/* DPI & Pointer Speed Tuning Card */}
      <div className="p-4 bg-[#0F141F] rounded-2xl border border-white/10 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-white/10">
          <h3 className="text-sm font-bold text-white font-gamer flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-cyan-400" />
            CALIBRAÇÃO DE SISTEMA (DPI & PONTEIRO)
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Opções do Desenvolvedor</span>
        </div>

        {/* DPI Recommendation */}
        <div className="p-3 bg-[#05070B] rounded-xl border border-white/5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white font-gamer">Menor Largura Recomendada (DPI):</span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-sm font-bold">
              {values.recommendedDpi} DPI
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Configure este valor em: <strong className="text-slate-300">Configurações &gt; Opções do Desenvolvedor &gt; Menor Largura</strong> para máxima sensibilidade de toque no {device.model}.
          </p>
        </div>

        {/* Pointer Speed Slider */}
        <div className="p-3 bg-[#05070B] rounded-xl border border-white/5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white font-gamer flex items-center gap-1">
              <MousePointer className="w-3.5 h-3.5 text-amber-400" />
              Velocidade do Ponteiro:
            </span>
            <span className="font-mono text-xs font-bold text-amber-400">
              {formatPointerSpeed(values.pointerSpeed)}
            </span>
          </div>
          <input
            type="range"
            min={-3}
            max={3}
            step={1}
            value={values.pointerSpeed}
            onChange={e => handleSliderChange('pointerSpeed', parseInt(e.target.value, 10))}
            className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>-3 (Lento)</span>
            <span>0 (Padrão)</span>
            <span>+3 (Rápido)</span>
          </div>
        </div>
      </div>

      {/* Tactical Optimizer ("Regedit" Toggles) */}
      <div className="p-4 bg-[#0F141F] rounded-2xl border border-white/10 space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-white/10">
          <h3 className="text-sm font-bold text-white font-gamer flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-emerald-400" />
            SUÍTE REGEDIT (OTIMIZADORES TÁTICOS)
          </h3>
          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold">
            100% SEGURO / SEM RISCO DE BAN
          </span>
        </div>

        {/* Mira Perfeita Toggle */}
        <div className="p-3 bg-[#05070B] rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white font-gamer block">Mira Perfeita (Anti-Jitter)</span>
            <span className="text-[11px] text-slate-400">Estabilização de curva para evitar tremedeira</span>
          </div>
          <button
            onClick={() => {
              toggleRegedit('miraPerfeita');
              playSound('toggle');
              triggerHaptic('light');
            }}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              regedit.miraPerfeita ? 'bg-emerald-500' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                regedit.miraPerfeita ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Fast Click Toggle */}
        <div className="p-3 bg-[#05070B] rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white font-gamer block">Fast Click (Touch Booster)</span>
            <span className="text-[11px] text-slate-400">Taxa de resposta de toque instantânea</span>
          </div>
          <button
            onClick={() => {
              toggleRegedit('fastClick');
              playSound('toggle');
              triggerHaptic('light');
            }}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
              regedit.fastClick ? 'bg-emerald-500' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                regedit.fastClick ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Sem Recuo & FPS Booster Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onOpenRecoilGuide}
            className="p-2.5 rounded-xl bg-red-950/30 hover:bg-red-950/50 border border-red-500/30 text-left transition-colors flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-red-300 font-gamer block">Sem Recuo</span>
              <span className="text-[10px] text-slate-400">Guia de Arrasto</span>
            </div>
            <Flame className="w-4 h-4 text-red-400" />
          </button>

          <button
            onClick={onOpenFpsBooster}
            className="p-2.5 rounded-xl bg-cyan-950/30 hover:bg-cyan-950/50 border border-cyan-500/30 text-left transition-colors flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-cyan-300 font-gamer block">FPS Booster</span>
              <span className="text-[10px] text-slate-400">Limpeza de RAM</span>
            </div>
            <Zap className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

        </div>
      </div>

      {/* Save Profile Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleSaveProfile}
            className="w-full max-w-sm bg-[#0F141F] border border-white/10 rounded-2xl p-4 shadow-2xl space-y-3"
          >
            <h4 className="text-sm font-bold text-white font-gamer">SALVAR COMO NOVO PERFIL</h4>
            <input
              type="text"
              required
              placeholder="Nome do perfil (ex: X1 Apostado M1887)"
              value={saveProfileName}
              onChange={e => setSaveProfileName(e.target.value)}
              className="w-full px-3 py-2 bg-[#05070B] rounded-xl border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-500 font-gamer"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowSaveDialog(false)}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-xs font-gamer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs font-gamer"
              >
                Salvar Perfil
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Device Selection Modal */}
      {isDeviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0F141F] border border-white/10 rounded-2xl p-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white font-gamer">BUSCAR MODELO DE APARELHO</h3>
              <button
                onClick={() => setIsDeviceModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="my-3 relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar Xiaomi, Samsung, iPhone, Vivo, Realme..."
                value={deviceSearch}
                onChange={e => setDeviceSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#05070B] rounded-xl border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-500 font-gamer"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {filteredDevices.map(d => (
                <button
                  key={d.id}
                  onClick={() => {
                    setDevice(d);
                    setIsDeviceModalOpen(false);
                    playSound('click');
                    triggerHaptic('light');
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center justify-between ${
                    device.id === d.id
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                      : 'border-white/5 bg-[#05070B] text-slate-300 hover:bg-[#161D2E]'
                  }`}
                >
                  <div>
                    <span className="font-bold text-white font-gamer block">{d.model}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {d.brand} • {d.screenDpi} DPI • {d.refreshRate}Hz
                    </span>
                  </div>
                  {device.id === d.id && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
