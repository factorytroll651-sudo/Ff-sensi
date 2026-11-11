import { DeviceSpec } from '../constants/devices';
import { WeaponCategory, WEAPONS_CATALOG } from '../constants/weapons';

export type PlaystyleType = 'balanced' | 'aggressive_rusher' | 'tactical_drag' | 'sniper_support';

export interface SensiValues {
  general: number;
  redDot: number;
  scope2x: number;
  scope4x: number;
  scopeAwm: number;
  freeLook: number;
  fireButtonSize: number;
  recommendedDpi: number;
  pointerSpeed: number;
}

export interface CalculationOptions {
  device: DeviceSpec;
  weaponCategory?: WeaponCategory;
  playstyle?: PlaystyleType;
  sliderScale?: '100' | '200'; // Standard 0-100 or Extended 0-200
  regeditAimAssist?: boolean;
}

/**
 * Calculates in-game sensitivities, fire button size, and DPI based on hardware physics.
 */
export function calculateSensitivity(options: CalculationOptions): SensiValues {
  const { device, weaponCategory = 'all', playstyle = 'balanced', sliderScale = '100', regeditAimAssist = false } = options;

  // Base sensitivities from device tuning
  let general = device.baseSensi.general;
  let redDot = device.baseSensi.redDot;
  let scope2x = device.baseSensi.scope2x;
  let scope4x = device.baseSensi.scope4x;
  let scopeAwm = device.baseSensi.scopeAwm;
  let freeLook = device.baseSensi.freeLook;
  let fireButtonSize = device.fireButtonSize;
  let recommendedDpi = device.recommendedDpi;
  let pointerSpeed = device.pointerSpeed;

  // Playstyle adjustments
  switch (playstyle) {
    case 'aggressive_rusher':
      general += 3;
      redDot += 3;
      scope2x += 2;
      fireButtonSize -= 3; // smaller button = faster swipe distance
      recommendedDpi += 30;
      pointerSpeed = Math.min(3, pointerSpeed + 1);
      break;
    case 'tactical_drag':
      general -= 1;
      redDot += 1;
      scope2x += 2;
      scope4x += 2;
      fireButtonSize += 1;
      break;
    case 'sniper_support':
      general -= 3;
      redDot -= 2;
      scopeAwm += 8;
      fireButtonSize -= 1;
      recommendedDpi = Math.max(380, recommendedDpi - 20);
      pointerSpeed = Math.max(-1, pointerSpeed - 1);
      break;
    case 'balanced':
    default:
      break;
  }

  // Weapon category adjustments
  if (weaponCategory !== 'all') {
    const matchingWeapons = WEAPONS_CATALOG.filter(w => w.category === weaponCategory);
    if (matchingWeapons.length > 0) {
      const avgGen = matchingWeapons.reduce((sum, w) => sum + w.generalModifier, 0) / matchingWeapons.length;
      const avgRed = matchingWeapons.reduce((sum, w) => sum + w.redDotModifier, 0) / matchingWeapons.length;
      const avgBtn = matchingWeapons.reduce((sum, w) => sum + w.fireButtonModifier, 0) / matchingWeapons.length;

      general += Math.round(avgGen);
      redDot += Math.round(avgRed);
      fireButtonSize += Math.round(avgBtn);
    }
  }

  // Tactical Regedit Aim Assist stabilization
  if (regeditAimAssist) {
    // Smoother crosshair drag curve: nudge Geral and Red Dot into sweet spot
    general = Math.min(100, Math.max(90, general));
    redDot = Math.min(100, Math.max(92, redDot));
    // Pointer speed sweet spot
    pointerSpeed = Math.min(2, Math.max(1, pointerSpeed));
  }

  // Clamp values within 0-100 range first
  general = Math.max(50, Math.min(100, general));
  redDot = Math.max(50, Math.min(100, redDot));
  scope2x = Math.max(40, Math.min(100, scope2x));
  scope4x = Math.max(30, Math.min(100, scope4x));
  scopeAwm = Math.max(20, Math.min(100, scopeAwm));
  freeLook = Math.max(30, Math.min(100, freeLook));
  fireButtonSize = Math.max(35, Math.min(65, fireButtonSize));
  pointerSpeed = Math.max(-3, Math.min(3, pointerSpeed));

  // If 200 slider mode is active (Free Fire 2024+ extended scale)
  if (sliderScale === '200') {
    general = Math.round(general * 2);
    redDot = Math.round(redDot * 2);
    scope2x = Math.round(scope2x * 2);
    scope4x = Math.round(scope4x * 2);
    scopeAwm = Math.round(scopeAwm * 2);
    freeLook = Math.round(freeLook * 2);
  }

  return {
    general,
    redDot,
    scope2x,
    scope4x,
    scopeAwm,
    freeLook,
    fireButtonSize,
    recommendedDpi,
    pointerSpeed,
  };
}

/**
 * Format pointer speed as friendly label e.g., "+2 (2 notches right of center)"
 */
export function formatPointerSpeed(value: number): string {
  if (value === 0) return '0 (Default Center)';
  if (value > 0) return `+${value} (${value} notches right / fast)`;
  return `${value} (${Math.abs(value)} notches left / slow)`;
}
