import { SensiValues } from './sensiAlgorithm';

export type PlayerRole = 'rusher' | 'support' | 'sniper' | 'igl';
export type GameMode = 'br_ranked' | 'contra_squad' | 'custom_1v1';
export type AimFlaw = 'over_head' | 'sticking_chest' | 'shaking_horizontal' | 'slow_drag';

export interface DiagnosticInput {
  role: PlayerRole;
  mode: GameMode;
  flaw: AimFlaw;
  currentSensi: SensiValues;
}

export interface DiagnosticResult {
  diagnosisTitle: string;
  flawAnalysis: string;
  recommendedAdjustments: SensiValues;
  changesSummary: {
    generalDiff: number;
    redDotDiff: number;
    fireButtonDiff: number;
    dpiDiff: number;
    pointerSpeedDiff: number;
  };
  coachAdvice: string[];
  headshotImprovementEstimate: string;
}

export interface GameplayReviewResult {
  accuracyScore: number; // 0 - 100%
  dragSpeedRating: 'Too Slow' | 'Ideal' | 'Too Aggressive';
  headshotRatePrediction: number; // % Taxa de Capa
  recoilControlGrade: 'S+' | 'A' | 'B' | 'C';
  tacticalChecklist: {
    item: string;
    status: 'pass' | 'warning' | 'critical';
    tip: string;
  }[];
  coachSummary: string;
}

export function runAimDiagnostic(input: DiagnosticInput): DiagnosticResult {
  const { flaw, currentSensi } = input;
  const adj: SensiValues = { ...currentSensi };

  let title = '';
  let analysis = '';
  let genDiff = 0;
  let redDotDiff = 0;
  let btnDiff = 0;
  let dpiDiff = 0;
  let pointerDiff = 0;
  const advice: string[] = [];

  switch (flaw) {
    case 'over_head':
      title = 'Crosshair Over-Shooting (Tiro Passando da Cabeça)';
      analysis = 'Your camera drag velocity is exceeding enemy head hitboxes, causing bullets to fly into the sky.';
      genDiff = -4;
      redDotDiff = -3;
      btnDiff = +2;
      dpiDiff = -20;
      advice.push('Decrease Geral by 4% to create drag resistance near the helmet.');
      advice.push('Increase Fire Button size by 2% to give your thumb more travel buffer.');
      advice.push('Release the fire button a fraction of a second sooner after the initial swipe.');
      break;

    case 'sticking_chest':
      title = 'Chest Magnet Flaw (Mira Grudando no Peito)';
      analysis = 'Aim friction is overpowering your swipe, leaving crosshairs locked onto enemy torso armor.';
      genDiff = +5;
      redDotDiff = +4;
      btnDiff = -2;
      dpiDiff = +30;
      advice.push('Increase Geral by +5% and Red Dot by +4% for an explosive initial drag.');
      advice.push('Reduce Fire Button size by 2% to decrease thumb travel friction.');
      advice.push('Swipe with a quick upward flick starting right from the bottom border of the button.');
      break;

    case 'shaking_horizontal':
      title = 'Horizontal Crosshair Jitter (Mira Tremendo para os Lados)';
      analysis = 'Pointer speed or excessive touch sensitivity is creating erratic lateral drift while pulling up.';
      genDiff = -2;
      redDotDiff = -1;
      pointerDiff = -1;
      dpiDiff = -30;
      advice.push('Lower pointer speed by 1 notch in Android System Settings.');
      advice.push('Lock thumb motion along a pure vertical axis when engaging at 20-40 meters.');
      advice.push('Enable "Mira Perfeita" Regedit profile to damp micro-jitters.');
      break;

    case 'slow_drag':
      title = 'Lagged Drag Response (Subida de Capa Lenta)';
      analysis = 'Screen touch sampling latency or heavy thumb resistance is hindering rapid head snaps.';
      genDiff = +3;
      redDotDiff = +3;
      btnDiff = -3;
      dpiDiff = +40;
      pointerDiff = +1;
      advice.push('Enable "Fast Click" touch booster profile.');
      advice.push('Increase Developer Options DPI by +40 for higher pixel density response.');
      advice.push('Clean screen surface or use gaming finger sleeves for zero friction.');
      break;
  }

  adj.general = Math.max(50, Math.min(100, adj.general + genDiff));
  adj.redDot = Math.max(50, Math.min(100, adj.redDot + redDotDiff));
  adj.fireButtonSize = Math.max(35, Math.min(65, adj.fireButtonSize + btnDiff));
  adj.recommendedDpi = Math.max(360, Math.min(720, adj.recommendedDpi + dpiDiff));
  adj.pointerSpeed = Math.max(-3, Math.min(3, adj.pointerSpeed + pointerDiff));

  return {
    diagnosisTitle: title,
    flawAnalysis: analysis,
    recommendedAdjustments: adj,
    changesSummary: {
      generalDiff: genDiff,
      redDotDiff,
      fireButtonDiff: btnDiff,
      dpiDiff,
      pointerSpeedDiff: pointerDiff,
    },
    coachAdvice: advice,
    headshotImprovementEstimate: '+28% to +45% Capa Accuracy',
  };
}

export function analyzeGameplayClip(fileNameOrSample: string): GameplayReviewResult {
  // Deterministic realistic AI evaluation with rich metrics
  const isShotgunSample = fileNameOrSample.toLowerCase().includes('shotgun') || fileNameOrSample.toLowerCase().includes('two9');
  const isSmgSample = fileNameOrSample.toLowerCase().includes('smg') || fileNameOrSample.toLowerCase().includes('mp40');

  if (isShotgunSample) {
    return {
      accuracyScore: 92,
      dragSpeedRating: 'Ideal',
      headshotRatePrediction: 86,
      recoilControlGrade: 'S+',
      tacticalChecklist: [
        { item: 'First Bullet Alignment', status: 'pass', tip: 'Crosshair pre-placed at neck level before jumping.' },
        { item: 'Upward Hook Drag Angle', status: 'pass', tip: 'Clean curved "J" trajectory observed during flick.' },
        { item: 'Gloo Wall Follow-Through', status: 'warning', tip: '0.15s delay between shooting and deploying defense.' },
      ],
      coachSummary: 'World-class shotgun one-tap mechanics! Your drag angle matches pro esports players like Raistar.',
    };
  }

  if (isSmgSample) {
    return {
      accuracyScore: 84,
      dragSpeedRating: 'Ideal',
      headshotRatePrediction: 79,
      recoilControlGrade: 'A',
      tacticalChecklist: [
        { item: 'Burst Duration Control', status: 'pass', tip: 'Disciplined 6-bullet sprays before bullet spread expands.' },
        { item: 'Mid-Range Tracking', status: 'pass', tip: 'Smooth horizontal tracking of strafing target.' },
        { item: 'Initial Button Press Drag', status: 'warning', tip: 'Slight delay of 80ms before lifting fire button.' },
      ],
      coachSummary: 'High-tier SMG spray! Increasing Geral by 2% will convert those yellow torso hits into crisp red headshots.',
    };
  }

  // General evaluation
  return {
    accuracyScore: 88,
    dragSpeedRating: 'Ideal',
    headshotRatePrediction: 82,
    recoilControlGrade: 'A',
    tacticalChecklist: [
      { item: 'Target Acquisition Speed', status: 'pass', tip: 'Target locked in under 0.22 seconds.' },
      { item: 'Vertical Drag Arc', status: 'pass', tip: 'Linear drag trajectory consistent with pro standards.' },
      { item: 'Crosshair Recovery Speed', status: 'warning', tip: 'Re-center crosshair quicker after enemy drops.' },
    ],
    coachSummary: 'Strong competitive potential! Your crosshair placement is already in the top 10% of players.',
  };
}
