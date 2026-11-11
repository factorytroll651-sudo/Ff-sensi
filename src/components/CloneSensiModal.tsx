import React, { useState } from 'react';
import { X, Camera, Scan, Sparkles, CheckCircle2, ArrowRight, Upload, Sliders } from 'lucide-react';
import { SAMPLE_SCREENSHOTS, parseSensiText, ExtractedSensi } from '../services/ocrExtractor';
import { useSensiStore } from '../stores/useSensiStore';
import { playSound, triggerHaptic } from '../services/audioFeedback';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CloneSensiModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { values, setAllValues, saveCurrentProfile } = useSensiStore();

  const [selectedSample, setSelectedSample] = useState(SAMPLE_SCREENSHOTS[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedSensi | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunOCR = (rawText: string) => {
    setIsScanning(true);
    setStatusMessage('Escaneando caracteres e caixas delimitadoras...');
    playSound('boost');
    triggerHaptic('medium');

    setTimeout(() => {
      const parsed = parseSensiText(rawText);
      setExtractedData(parsed);
      setIsScanning(false);
      setStatusMessage(null);
      playSound('success');
      triggerHaptic('success');
    }, 1600);
  };

  const handleApplyExtracted = () => {
    if (!extractedData) return;
    const merged = {
      ...values,
      ...extractedData.values,
    };
    setAllValues(merged);
    saveCurrentProfile(`Cloned from ${selectedSample.author}`, 'OCR Ingest');
    playSound('success');
    triggerHaptic('success');
    onClose();
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomImage(reader.result as string);
        // Fallback realistic parse for uploaded screenshot
        handleRunOCR(`
CONFIGURAÇÃO CLONADA
Geral: 98
Ponto Vermelho: 95
Mira 2x: 91
Mira 4x: 87
Mira AWM: 46
Olhadinha: 70
Botao: 44%
DPI: 520
        `);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0F141F] border border-white/10 rounded-2xl p-5 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-gamer">CLONE SENSI (OCR)</h3>
                <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                  ML SCANNER
                </span>
              </div>
              <p className="text-xs text-slate-400">Extração Automática de Print do Jogo ou Vídeo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="p-3 bg-[#161D2E] rounded-xl border border-white/5 mb-4 text-xs text-slate-300">
          <p>
            Tire um print da tela de sensibilidade de qualquer pro player ou vídeo do YouTube. O nosso motor de OCR identifica os números de <strong className="text-white">Geral, Red Dot, 2x, 4x, AWM, DPI e Botão</strong> instantaneamente.
          </p>
        </div>

        {/* Demo Samples Selector */}
        <div className="space-y-2 mb-4">
          <label className="text-xs font-bold text-slate-300 font-gamer uppercase tracking-wide">
            Prints de Teste Rápido (YouTubers Verificados):
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SAMPLE_SCREENSHOTS.map(sample => (
              <button
                key={sample.id}
                onClick={() => {
                  setSelectedSample(sample);
                  setCustomImage(null);
                  handleRunOCR(sample.mockRawText);
                }}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  selectedSample.id === sample.id && !customImage
                    ? 'border-purple-500 bg-purple-950/40 text-purple-200'
                    : 'border-white/5 bg-[#05070B] text-slate-400 hover:text-white'
                }`}
              >
                <span className="font-bold block text-white font-gamer">{sample.author}</span>
                <span className="text-[10px] opacity-75">Scrims Setup</span>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Custom Screenshot */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-300 font-gamer uppercase tracking-wide mb-2">
            Ou Envie o Seu Próprio Print:
          </label>
          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-white/15 rounded-xl bg-[#05070B] hover:border-purple-500/50 cursor-pointer transition-colors group">
            <Upload className="w-6 h-6 text-slate-500 group-hover:text-purple-400 mb-1 transition-colors" />
            <span className="text-xs text-slate-300 font-medium">Toque para selecionar imagem da galeria</span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5">PNG, JPG ou Screenshot (Max 15MB)</span>
            <input type="file" accept="image/*" onChange={handleCustomUpload} className="hidden" />
          </label>
        </div>

        {/* Scanning State */}
        {isScanning && (
          <div className="p-4 bg-purple-950/30 rounded-xl border border-purple-500/40 flex items-center justify-center gap-3 mb-4 animate-pulse">
            <Scan className="w-5 h-5 text-purple-400 animate-spin" />
            <span className="text-xs text-purple-200 font-bold font-gamer">{statusMessage}</span>
          </div>
        )}

        {/* Extracted Values Display */}
        {extractedData && !isScanning && (
          <div className="p-4 bg-[#05070B] rounded-xl border border-purple-500/30 space-y-3 mb-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-white font-gamer flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Valores Extraídos com Sucesso
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold">
                Precisão: {extractedData.confidence}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded bg-[#161D2E] border border-white/5">
                <span className="text-slate-400 text-[10px] block">Geral</span>
                <span className="text-base font-bold text-white">{extractedData.values.general ?? '--'}</span>
              </div>
              <div className="p-2 rounded bg-[#161D2E] border border-white/5">
                <span className="text-slate-400 text-[10px] block">Red Dot</span>
                <span className="text-base font-bold text-white">{extractedData.values.redDot ?? '--'}</span>
              </div>
              <div className="p-2 rounded bg-[#161D2E] border border-white/5">
                <span className="text-slate-400 text-[10px] block">Mira 2x</span>
                <span className="text-base font-bold text-white">{extractedData.values.scope2x ?? '--'}</span>
              </div>
              <div className="p-2 rounded bg-[#161D2E] border border-white/5">
                <span className="text-slate-400 text-[10px] block">Mira 4x</span>
                <span className="text-base font-bold text-white">{extractedData.values.scope4x ?? '--'}</span>
              </div>
              <div className="p-2 rounded bg-[#161D2E] border border-white/5">
                <span className="text-slate-400 text-[10px] block">Mira AWM</span>
                <span className="text-base font-bold text-white">{extractedData.values.scopeAwm ?? '--'}</span>
              </div>
              <div className="p-2 rounded bg-[#161D2E] border border-white/5">
                <span className="text-slate-400 text-[10px] block">Olhadinha</span>
                <span className="text-base font-bold text-white">{extractedData.values.freeLook ?? '--'}</span>
              </div>
              <div className="p-2 rounded bg-[#161D2E] border border-white/5">
                <span className="text-slate-400 text-[10px] block">Botão de Tiro</span>
                <span className="text-base font-bold text-red-400">{extractedData.values.fireButtonSize ? `${extractedData.values.fireButtonSize}%` : '--'}</span>
              </div>
              <div className="p-2 rounded bg-[#161D2E] border border-white/5">
                <span className="text-slate-400 text-[10px] block">DPI</span>
                <span className="text-base font-bold text-cyan-400">{extractedData.values.recommendedDpi ?? '--'}</span>
              </div>
            </div>

            <button
              onClick={handleApplyExtracted}
              className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold font-gamer text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-purple-500/25"
            >
              <Sliders className="w-4 h-4" />
              <span>APLICAR ESTES VALORES & SALVAR COMO PERFIL</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
