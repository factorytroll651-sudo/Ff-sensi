import { SensiValues } from './sensiAlgorithm';

export interface ExtractedSensi {
  values: Partial<SensiValues>;
  rawMatches: { label: string; value: number }[];
  confidence: number;
  detectedPresetName?: string;
}

export const SAMPLE_SCREENSHOTS = [
  {
    id: 'raistar-scrims',
    title: 'Raistar Tournament Sensi (YouTube Frame)',
    author: 'Raistar',
    previewUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
    mockRawText: `
CONFIGURAÇÕES DE SENSIBILIDADE
Geral: 100
Ponto Vermelho: 98
Mira 2x: 95
Mira 4x: 92
Mira AWM: 44
Olhadinha: 75
Tamanho do Botão: 42%
DPI: 560
    `,
  },
  {
    id: 'ajjubhai-stream',
    title: 'Total Gaming AjjuBhai Live Setup',
    author: 'Total Gaming',
    previewUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=80',
    mockRawText: `
FREE FIRE SENSITIVITY
General: 96
Red Dot: 92
2x Scope: 88
4x Scope: 85
Sniper Scope: 50
Free Look: 65
Fire Button Size: 47%
DPI: 480
    `,
  },
  {
    id: 'nobru-fluxo',
    title: 'Nobru Fluxo World Series Sensi',
    author: 'Nobru TV',
    previewUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=80',
    mockRawText: `
SENSI DEUSES DO FREE FIRE
Geral: 99
Ponto Vermelho: 96
Mira 2x: 93
Mira 4x: 89
Mira AWM: 45
Olhadinha: 74
Tamanho do Botao: 43%
DPI Recomendada: 540
    `,
  },
];

/**
 * Parses OCR raw text and extracts numeric values corresponding to Free Fire sensitivities.
 */
export function parseSensiText(rawText: string): ExtractedSensi {
  const lines = rawText.split('\n');
  const values: Partial<SensiValues> = {};
  const rawMatches: { label: string; value: number }[] = [];

  const extractNumberAfter = (line: string, regex: RegExp): number | null => {
    if (regex.test(line)) {
      const match = line.match(/(\d{1,3})/g);
      if (match && match.length > 0) {
        // usually the last or only number on that line
        const num = parseInt(match[match.length - 1], 10);
        if (!isNaN(num) && num >= 0 && num <= 1000) {
          return num;
        }
      }
    }
    return null;
  };

  for (const line of lines) {
    const cleanLine = line.trim();
    if (!cleanLine) continue;

    // Geral / General
    if (/geral|general/i.test(cleanLine) && values.general === undefined) {
      const num = extractNumberAfter(cleanLine, /geral|general/i);
      if (num !== null && num <= 200) {
        values.general = num;
        rawMatches.push({ label: 'Geral', value: num });
      }
    }

    // Ponto Vermelho / Red Dot
    if (/(ponto\s*vermelho|red\s*dot)/i.test(cleanLine) && values.redDot === undefined) {
      const num = extractNumberAfter(cleanLine, /(ponto\s*vermelho|red\s*dot)/i);
      if (num !== null && num <= 200) {
        values.redDot = num;
        rawMatches.push({ label: 'Red Dot', value: num });
      }
    }

    // Mira 2x / 2x Scope
    if (/(mira\s*2x|2x\s*scope|2x)/i.test(cleanLine) && values.scope2x === undefined && !/4x/i.test(cleanLine)) {
      const num = extractNumberAfter(cleanLine, /(mira\s*2x|2x\s*scope|2x)/i);
      if (num !== null && num <= 200) {
        values.scope2x = num;
        rawMatches.push({ label: 'Mira 2x', value: num });
      }
    }

    // Mira 4x / 4x Scope
    if (/(mira\s*4x|4x\s*scope|4x)/i.test(cleanLine) && values.scope4x === undefined) {
      const num = extractNumberAfter(cleanLine, /(mira\s*4x|4x\s*scope|4x)/i);
      if (num !== null && num <= 200) {
        values.scope4x = num;
        rawMatches.push({ label: 'Mira 4x', value: num });
      }
    }

    // Mira AWM / Sniper Scope
    if (/(mira\s*awm|awm|sniper)/i.test(cleanLine) && values.scopeAwm === undefined) {
      const num = extractNumberAfter(cleanLine, /(mira\s*awm|awm|sniper)/i);
      if (num !== null && num <= 200) {
        values.scopeAwm = num;
        rawMatches.push({ label: 'Mira AWM', value: num });
      }
    }

    // Olhadinha / Free Look
    if (/(olhadinha|free\s*look)/i.test(cleanLine) && values.freeLook === undefined) {
      const num = extractNumberAfter(cleanLine, /(olhadinha|free\s*look)/i);
      if (num !== null && num <= 200) {
        values.freeLook = num;
        rawMatches.push({ label: 'Olhadinha', value: num });
      }
    }

    // Fire button / Botão
    if (/(bot[aã]o|fire\s*button|tamanho)/i.test(cleanLine) && values.fireButtonSize === undefined) {
      const num = extractNumberAfter(cleanLine, /(bot[aã]o|fire\s*button|tamanho)/i);
      if (num !== null && num >= 20 && num <= 100) {
        values.fireButtonSize = num;
        rawMatches.push({ label: 'Botão de Tiro', value: num });
      }
    }

    // DPI
    if (/dpi/i.test(cleanLine) && values.recommendedDpi === undefined) {
      const num = extractNumberAfter(cleanLine, /dpi/i);
      if (num !== null && num >= 300 && num <= 960) {
        values.recommendedDpi = num;
        rawMatches.push({ label: 'DPI', value: num });
      }
    }
  }

  // Calculate recognition confidence
  const totalFields = 8;
  const matchedFields = rawMatches.length;
  const confidence = Math.min(100, Math.round((matchedFields / totalFields) * 100));

  return {
    values,
    rawMatches,
    confidence: confidence > 0 ? confidence : 70,
  };
}
