export type WeaponCategory = 'all' | 'shotgun' | 'smg' | 'ar' | 'sniper';

export interface WeaponInfo {
  id: string;
  name: string;
  category: WeaponCategory;
  tag: string;
  dragStyle: string;
  generalModifier: number; // offset to add/subtract to Geral
  redDotModifier: number;
  fireButtonModifier: number; // percentage offset
  tip: string;
}

export const WEAPON_CATEGORIES: { id: WeaponCategory; label: string; icon: string; desc: string }[] = [
  { id: 'all', label: 'Balanced (All)', icon: 'Crosshair', desc: 'Versatile tournament preset for any weapon' },
  { id: 'shotgun', label: 'Shotgun / Doze', icon: 'Flame', desc: 'One-tap drag & flick (M1014, M1887, MAG-7)' },
  { id: 'smg', label: 'SMG Spray', icon: 'Zap', desc: 'High-speed continuous head drag (MP40, UMP)' },
  { id: 'ar', label: 'Rifle / AR', icon: 'Shield', desc: 'Recoil control & burst accuracy (AK, SCAR, M4)' },
  { id: 'sniper', label: 'Sniper / AWM', icon: 'Target', desc: 'Micro-flick stabilization (AWM, M82B, Kar98)' },
];

export const WEAPONS_CATALOG: WeaponInfo[] = [
  // Shotguns
  {
    id: 'm1887',
    name: 'M1887 (Two9)',
    category: 'shotgun',
    tag: 'One-Tap King',
    dragStyle: 'Fast "J" Shaped Drag',
    generalModifier: +3,
    redDotModifier: +4,
    fireButtonModifier: -2,
    tip: 'Pull fire button in an upward hook motion towards the enemy head instantly after sliding.',
  },
  {
    id: 'm1014',
    name: 'M1014 (Shotgun)',
    category: 'shotgun',
    tag: 'Close Range Burst',
    dragStyle: 'Vertical Straight Drag',
    generalModifier: +2,
    redDotModifier: +3,
    fireButtonModifier: -1,
    tip: 'Jump and pull straight up rapidly when the crosshair touches the enemy chest.',
  },
  {
    id: 'mag7',
    name: 'MAG-7',
    category: 'shotgun',
    tag: 'Rapid Fire',
    dragStyle: 'Diagonal Drag',
    generalModifier: +1,
    redDotModifier: +2,
    fireButtonModifier: 0,
    tip: 'Continuous tap-drag keeps crosshair level with enemy chin.',
  },

  // SMGs
  {
    id: 'mp40',
    name: 'MP40',
    category: 'smg',
    tag: 'High Fire Rate',
    dragStyle: 'Controlled Linear Rise',
    generalModifier: +1,
    redDotModifier: +3,
    fireButtonModifier: 0,
    tip: 'Start drag slowly, then accelerate upward as bullet spread begins.',
  },
  {
    id: 'ump',
    name: 'UMP',
    category: 'smg',
    tag: 'Armor Penetrator',
    dragStyle: 'Quick Snap Drag',
    generalModifier: +2,
    redDotModifier: +4,
    fireButtonModifier: -1,
    tip: 'Unmatched headshot magnetism; drag upward with minimal force at mid-range.',
  },
  {
    id: 'thompson',
    name: 'Thompson',
    category: 'smg',
    tag: 'High Capacity',
    dragStyle: 'Straight Vertical Drag',
    generalModifier: 0,
    redDotModifier: +2,
    fireButtonModifier: +1,
    tip: 'Compensate for initial recoil shake with steady upward pressure.',
  },

  // ARs
  {
    id: 'woodpecker',
    name: 'Woodpecker',
    category: 'ar',
    tag: 'Single-Tap Lethal',
    dragStyle: 'Micro Drag Tap',
    generalModifier: -1,
    redDotModifier: +2,
    fireButtonModifier: -2,
    tip: 'One gentle upward flick lands a 300+ helmet-shattering headshot.',
  },
  {
    id: 'ak47',
    name: 'AK-47',
    category: 'ar',
    tag: 'Heavy Damage',
    dragStyle: 'Delayed Pull Drag',
    generalModifier: -2,
    redDotModifier: -1,
    fireButtonModifier: +2,
    tip: 'Wait 0.2s before dragging to let first bullet accuracy reset.',
  },
  {
    id: 'scar',
    name: 'SCAR',
    category: 'ar',
    tag: 'Laser Accuracy',
    dragStyle: 'Smooth Vertical Pull',
    generalModifier: 0,
    redDotModifier: +1,
    fireButtonModifier: 0,
    tip: 'Extremely forgiving recoil curve; reliable headshot laser at 30-50m.',
  },

  // Snipers
  {
    id: 'awm',
    name: 'AWM',
    category: 'sniper',
    tag: 'One-Shot Beast',
    dragStyle: 'Quick Switch Flick',
    generalModifier: 0,
    redDotModifier: 0,
    fireButtonModifier: -3,
    tip: 'Use Free Look dot at center of screen for no-scope quick swaps.',
  },
  {
    id: 'm82b',
    name: 'M82B (Barret)',
    category: 'sniper',
    tag: 'Gloo Wall Penetrator',
    dragStyle: 'Pre-Aim Tracking',
    generalModifier: -1,
    redDotModifier: 0,
    fireButtonModifier: -2,
    tip: 'Track player silhouette behind gloo walls and flick shoot.',
  },
];
