import React, { useState } from 'react';
import { X, Bot, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Video, Target, Copy, Zap, Crown } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';
import { useSensiStore } from '../stores/useSensiStore';
import {
  PlayerRole,
  GameMode,
  AimFlaw,
  runAimDiagnostic,
  analyzeGameplayClip,
  DiagnosticResult,
  GameplayReviewResult,
} from '../services/coachEngine';
import { playSound, triggerHaptic } from '../services/audioFeedback';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenPlans: () => void;
}

export const CoachModal: React.FC<Props> = ({ isOpen, onClose, onOpenPlans }) => {
  const { coachTokens, consumeToken, vipTier } = useUserStore();
  const { values, setAllValues, recordCopied } = useSensiStore();

  const [activeTab, setActiveTab] = useState<'questionnaire' | 'clip_review'>('questionnaire');

  // Mode 1: Questionnaire state
  const [selectedRole, setSelectedRole] = useState<PlayerRole>('rusher');
  const [selectedMode, setSelectedMode] = useState<GameMode>('contra_squad');
  const [selectedFlaw, setSelectedFlaw] = useState<AimFlaw>('sticking_chest');
  const [diagResult, setDiagResult] = useState<DiagnosticResult | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  // Mode 2: Clip review state
  const [selectedSampleClip, setSelectedSampleClip] = useState<string>('Training Ground Shotgun Jump Drag (10s)');
  const [isAnalyzingClip, setIsAnalyzingClip] = useState(false);
  const [clipResult, setClipResult] = useState<GameplayReviewResult | null>(null);

  if (!isOpen) return null;

  const handleRunDiagnostic = () => {
    playSound('toggle');
    triggerHaptic('light');

    const result = runAimDiagnostic({
      role: selectedRole,
      mode: selectedMode,
      flaw: selectedFlaw,
      currentSensi: values,
    });
    setDiagResult(result);
  };

  const handleApplyDiagnostic = () => {
    if (!diagResult) return;
    setAllValues(diagResult.recommendedAdjustments);
    recordCopied();
    playSound('success');
    triggerHaptic('success');
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleAnalyzeClip = () => {
    if (coachTokens <= 0 && vipTier !== 'elite') {
      onOpenPlans();
      return;
    }

    const success = consumeToken();
    if (!success) {
      onOpenPlans();
      return;
    }

    setIsAnalyzingClip(true);
    playSound('boost');
    triggerHaptic('medium');

    setTimeout(() => {
      const result = analyzeGameplayClip(selectedSampleClip);
      setClipResult(result);
      setIsAnalyzingClip(false);
      playSound('success');
      triggerHaptic('success');
    }, 1900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0F141F] border border-white/10 rounded-2xl p-5 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-gamer">COACH IA</h3>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                  DIAGNÓSTICO PRO
                </span>
              </div>
              <p className="text-xs text-slate-400">Personal AI Aim & Gameplay Correction</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tokens Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{vipTier === 'elite' ? '∞ VIP' : `${coachTokens} Tokens`}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Navigation Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#05070B] rounded-xl mb-4 border border-white/5">
          <button
            onClick={() => setActiveTab('questionnaire')}
            className={`py-2 text-xs font-bold rounded-lg font-gamer transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'questionnaire'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Questionário Rápido</span>
          </button>
          <button
            onClick={() => setActiveTab('clip_review')}
            className={`py-2 text-xs font-bold rounded-lg font-gamer transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'clip_review'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Análise de Vídeo / Clip</span>
          </button>
        </div>

        {/* TAB 1: Guided Questionnaire */}
        {activeTab === 'questionnaire' && (
          <div className="space-y-4">
            {/* Step 1: Role */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 font-gamer uppercase tracking-wide">
                Passo 1: Qual é a sua função principal?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'rusher', label: 'Rusher (Ataque)' },
                  { id: 'support', label: 'Suporte' },
                  { id: 'sniper', label: 'Sniper (AWM)' },
                  { id: 'igl', label: 'IGL / Capitão' },
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRole(r.id as PlayerRole)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      selectedRole === r.id
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                        : 'border-white/5 bg-[#161D2E] text-slate-400 hover:text-white'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Game Mode */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 font-gamer uppercase tracking-wide">
                Passo 2: Modo de Jogo em Foco:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'contra_squad', label: 'Contra Squad (CS)' },
                  { id: 'br_ranked', label: 'Battle Royale (BR)' },
                  { id: 'custom_1v1', label: '1v1 Apostado / Sala' },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMode(m.id as GameMode)}
                    className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                      selectedMode === m.id
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                        : 'border-white/5 bg-[#161D2E] text-slate-400 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: What is failing? */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-red-400 font-gamer uppercase tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Passo 3: O que está falhando na sua mira?
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'sticking_chest',
                    title: 'Mira Grudando no Peito (Não Sobe Capa)',
                    desc: 'O tiro não sobe para a cabeça de jeito nenhum, fica preso no colete.',
                  },
                  {
                    id: 'over_head',
                    title: 'Tiro Passando da Cabeça (Voando)',
                    desc: 'A mira sobe com muita velocidade e as balas passam por cima do inimigo.',
                  },
                  {
                    id: 'shaking_horizontal',
                    title: 'Mira Tremendo para os Lados',
                    desc: 'A mira treme horizontalmente ao puxar o analógico ou botão.',
                  },
                  {
                    id: 'slow_drag',
                    title: 'Subida de Capa Lenta / Tela Pesada',
                    desc: 'Sensação de que o dedo escorrega mas a mira sobe com atraso de toque.',
                  },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFlaw(f.id as AimFlaw)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      selectedFlaw === f.id
                        ? 'border-red-500 bg-red-950/30 text-white shadow-md'
                        : 'border-white/5 bg-[#161D2E] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-red-300 font-gamer">{f.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleRunDiagnostic}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold font-gamer text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>GERAR DIAGNÓSTICO DO COACH IA</span>
            </button>

            {/* Diagnostic Report Display */}
            {diagResult && (
              <div className="mt-4 p-4 bg-[#05070B] rounded-xl border border-emerald-500/30 space-y-3 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider block">
                      Relatório de Correção Imediata
                    </span>
                    <h4 className="text-sm font-bold text-white font-gamer">{diagResult.diagnosisTitle}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                    {diagResult.headshotImprovementEstimate}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-[#161D2E] p-2.5 rounded-lg border border-white/5">
                  {diagResult.flawAnalysis}
                </p>

                {/* Adjustments table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded bg-black/50 border border-white/5">
                    <span className="text-slate-500 text-[10px] block">Geral</span>
                    <span className="text-white font-bold">{diagResult.recommendedAdjustments.general}</span>
                    <span className={`text-[10px] block ${diagResult.changesSummary.generalDiff > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {diagResult.changesSummary.generalDiff > 0 ? `+${diagResult.changesSummary.generalDiff}` : diagResult.changesSummary.generalDiff}%
                    </span>
                  </div>

                  <div className="p-2 rounded bg-black/50 border border-white/5">
                    <span className="text-slate-500 text-[10px] block">Red Dot</span>
                    <span className="text-white font-bold">{diagResult.recommendedAdjustments.redDot}</span>
                    <span className={`text-[10px] block ${diagResult.changesSummary.redDotDiff > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {diagResult.changesSummary.redDotDiff > 0 ? `+${diagResult.changesSummary.redDotDiff}` : diagResult.changesSummary.redDotDiff}%
                    </span>
                  </div>

                  <div className="p-2 rounded bg-black/50 border border-white/5">
                    <span className="text-slate-500 text-[10px] block">Botão</span>
                    <span className="text-white font-bold">{diagResult.recommendedAdjustments.fireButtonSize}%</span>
                    <span className="text-amber-400 text-[10px] block">
                      {diagResult.changesSummary.fireButtonDiff > 0 ? `+${diagResult.changesSummary.fireButtonDiff}` : diagResult.changesSummary.fireButtonDiff}%
                    </span>
                  </div>

                  <div className="p-2 rounded bg-black/50 border border-white/5">
                    <span className="text-slate-500 text-[10px] block">DPI</span>
                    <span className="text-white font-bold">{diagResult.recommendedAdjustments.recommendedDpi}</span>
                    <span className="text-cyan-400 text-[10px] block">
                      {diagResult.changesSummary.dpiDiff > 0 ? `+${diagResult.changesSummary.dpiDiff}` : diagResult.changesSummary.dpiDiff}
                    </span>
                  </div>
                </div>

                {/* Coach Tips */}
                <div className="space-y-1.5 text-xs text-slate-300">
                  <span className="font-bold text-white font-gamer text-[11px] block">INSTRUÇÃO TÁTICA:</span>
                  {diagResult.coachAdvice.map((adv, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{adv}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleApplyDiagnostic}
                    className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-gamer text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{copiedToast ? 'APLICADO NO SEU SETUP!' : 'APLICAR COMO MINHA SENSI'}</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `SensiPro FF Coach: Geral ${diagResult.recommendedAdjustments.general}, Red Dot ${diagResult.recommendedAdjustments.redDot}, Botão ${diagResult.recommendedAdjustments.fireButtonSize}%, DPI ${diagResult.recommendedAdjustments.recommendedDpi}`
                      );
                      playSound('click');
                      setCopiedToast(true);
                      setTimeout(() => setCopiedToast(false), 2000);
                    }}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center justify-center"
                    title="Copiar texto"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Video & Clip Analysis */}
        {activeTab === 'clip_review' && (
          <div className="space-y-4">
            <div className="p-3 bg-[#161D2E] rounded-xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white font-gamer flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-cyan-400" />
                  Envio de Gameplay (Ilha de Treinamento ou 4v4)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Duração: 5-15 segundos</span>
              </div>
              <p className="text-xs text-slate-400">
                O Coach IA examina o ângulo de arrasto do seu polegar, velocidade de resposta ao toque e estabilização de mira para prever a Taxa de Capa.
              </p>
            </div>

            {/* Clip selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 font-gamer uppercase tracking-wide">
                Selecione ou Simule um Clip para Avaliar:
              </label>
              <div className="space-y-2">
                {[
                  'Training Ground Shotgun Jump Drag (M1887)',
                  'Clash Squad MP40 Continuous Head Drag (6s)',
                  'Custom Room 1v1 Fast Gloo & Flick Drag (12s)',
                ].map(clip => (
                  <button
                    key={clip}
                    onClick={() => setSelectedSampleClip(clip)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      selectedSampleClip === clip
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                        : 'border-white/5 bg-[#161D2E] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">{clip}</span>
                    </div>
                    {selectedSampleClip === clip && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Analysis Action */}
            <button
              onClick={handleAnalyzeClip}
              disabled={isAnalyzingClip}
              className={`w-full py-3 rounded-xl font-bold font-gamer text-sm flex items-center justify-center gap-2 transition-all ${
                isAnalyzingClip
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black shadow-lg shadow-cyan-500/25'
              }`}
            >
              {isAnalyzingClip ? (
                <>
                  <Zap className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>PROCESSANDO VÍDEO & VETORES DE ARRASTO...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>AVALIAR CLIP (-1 TOKEN IA)</span>
                </>
              )}
            </button>

            {/* Clip Results Display */}
            {clipResult && (
              <div className="mt-4 p-4 bg-[#05070B] rounded-xl border border-cyan-500/30 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-[#161D2E] border border-white/5">
                    <span className="text-[10px] text-slate-400 block font-mono">Taxa de Capa</span>
                    <span className="text-xl font-bold text-emerald-400 font-mono">{clipResult.headshotRatePrediction}%</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#161D2E] border border-white/5">
                    <span className="text-[10px] text-slate-400 block font-mono">Velocidade</span>
                    <span className="text-sm font-bold text-cyan-300 font-gamer mt-1 block">{clipResult.dragSpeedRating}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#161D2E] border border-white/5">
                    <span className="text-[10px] text-slate-400 block font-mono">Nota de Recuo</span>
                    <span className="text-xl font-bold text-amber-400 font-mono">{clipResult.recoilControlGrade}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#161D2E] rounded-xl border border-white/5">
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    &quot;{clipResult.coachSummary}&quot;
                  </p>
                </div>

                {/* Tactical Checklist */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-white font-gamer tracking-wide block">
                    CHECKLIST DE DESEMPENHO NO CLIP:
                  </span>
                  {clipResult.tacticalChecklist.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#161D2E] border border-white/5 flex items-start gap-2">
                      {item.status === 'pass' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="text-xs font-bold text-slate-200">{item.item}</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
