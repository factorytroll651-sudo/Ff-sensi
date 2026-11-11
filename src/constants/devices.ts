export interface DeviceSpec {
  id: string;
  brand: string;
  model: string;
  screenDpi: number;
  refreshRate: number; // Hz
  touchSamplingRate: number; // Hz
  recommendedDpi: number;
  pointerSpeed: number; // -3 to +3
  fireButtonSize: number; // percentage
  baseSensi: {
    general: number;
    redDot: number;
    scope2x: number;
    scope4x: number;
    scopeAwm: number;
    freeLook: number;
  };
}

export const POPULAR_DEVICES: DeviceSpec[] = [
  // Xiaomi / Redmi / POCO
  {
    id: 'poco-x6-pro',
    brand: 'POCO',
    model: 'POCO X6 Pro 5G',
    screenDpi: 446,
    refreshRate: 120,
    touchSamplingRate: 480,
    recommendedDpi: 520,
    pointerSpeed: 2,
    fireButtonSize: 44,
    baseSensi: { general: 97, redDot: 94, scope2x: 91, scope4x: 88, scopeAwm: 48, freeLook: 70 },
  },
  {
    id: 'poco-f5',
    brand: 'POCO',
    model: 'POCO F5 5G',
    screenDpi: 395,
    refreshRate: 120,
    touchSamplingRate: 240,
    recommendedDpi: 480,
    pointerSpeed: 1,
    fireButtonSize: 46,
    baseSensi: { general: 95, redDot: 92, scope2x: 89, scope4x: 85, scopeAwm: 50, freeLook: 65 },
  },
  {
    id: 'redmi-note-13-pro',
    brand: 'Redmi',
    model: 'Redmi Note 13 Pro+ 5G',
    screenDpi: 446,
    refreshRate: 120,
    touchSamplingRate: 360,
    recommendedDpi: 490,
    pointerSpeed: 1,
    fireButtonSize: 45,
    baseSensi: { general: 96, redDot: 93, scope2x: 90, scope4x: 87, scopeAwm: 47, freeLook: 68 },
  },
  {
    id: 'redmi-12',
    brand: 'Redmi',
    model: 'Redmi 12 5G',
    screenDpi: 396,
    refreshRate: 90,
    touchSamplingRate: 240,
    recommendedDpi: 450,
    pointerSpeed: 2,
    fireButtonSize: 50,
    baseSensi: { general: 98, redDot: 96, scope2x: 92, scope4x: 89, scopeAwm: 52, freeLook: 72 },
  },
  {
    id: 'xiaomi-14',
    brand: 'Xiaomi',
    model: 'Xiaomi 14 Ultra',
    screenDpi: 522,
    refreshRate: 120,
    touchSamplingRate: 240,
    recommendedDpi: 540,
    pointerSpeed: 0,
    fireButtonSize: 42,
    baseSensi: { general: 93, redDot: 90, scope2x: 88, scope4x: 84, scopeAwm: 45, freeLook: 60 },
  },

  // Realme
  {
    id: 'realme-12-pro-plus',
    brand: 'Realme',
    model: 'Realme 12 Pro+ 5G',
    screenDpi: 394,
    refreshRate: 120,
    touchSamplingRate: 240,
    recommendedDpi: 480,
    pointerSpeed: 1,
    fireButtonSize: 46,
    baseSensi: { general: 96, redDot: 92, scope2x: 88, scope4x: 86, scopeAwm: 49, freeLook: 67 },
  },
  {
    id: 'realme-gt-6t',
    brand: 'Realme',
    model: 'Realme GT 6T',
    screenDpi: 450,
    refreshRate: 120,
    touchSamplingRate: 360,
    recommendedDpi: 510,
    pointerSpeed: 2,
    fireButtonSize: 43,
    baseSensi: { general: 97, redDot: 95, scope2x: 92, scope4x: 89, scopeAwm: 46, freeLook: 70 },
  },
  {
    id: 'realme-narzo-70',
    brand: 'Realme',
    model: 'Realme Narzo 70 Pro 5G',
    screenDpi: 394,
    refreshRate: 120,
    touchSamplingRate: 240,
    recommendedDpi: 460,
    pointerSpeed: 1,
    fireButtonSize: 48,
    baseSensi: { general: 95, redDot: 91, scope2x: 87, scope4x: 85, scopeAwm: 50, freeLook: 66 },
  },

  // Vivo / iQOO
  {
    id: 'iqoo-neo-9-pro',
    brand: 'iQOO',
    model: 'iQOO Neo 9 Pro 5G',
    screenDpi: 452,
    refreshRate: 144,
    touchSamplingRate: 300,
    recommendedDpi: 520,
    pointerSpeed: 1,
    fireButtonSize: 44,
    baseSensi: { general: 96, redDot: 93, scope2x: 90, scope4x: 87, scopeAwm: 46, freeLook: 68 },
  },
  {
    id: 'iqoo-z9',
    brand: 'iQOO',
    model: 'iQOO Z9 5G',
    screenDpi: 395,
    refreshRate: 120,
    touchSamplingRate: 300,
    recommendedDpi: 470,
    pointerSpeed: 1,
    fireButtonSize: 47,
    baseSensi: { general: 95, redDot: 92, scope2x: 89, scope4x: 86, scopeAwm: 50, freeLook: 65 },
  },
  {
    id: 'iqoo-12',
    brand: 'iQOO',
    model: 'iQOO 12 5G (Esports Edition)',
    screenDpi: 453,
    refreshRate: 144,
    touchSamplingRate: 300,
    recommendedDpi: 540,
    pointerSpeed: 2,
    fireButtonSize: 42,
    baseSensi: { general: 98, redDot: 95, scope2x: 93, scope4x: 90, scopeAwm: 45, freeLook: 72 },
  },
  {
    id: 'vivo-v30-pro',
    brand: 'Vivo',
    model: 'Vivo V30 Pro 5G',
    screenDpi: 453,
    refreshRate: 120,
    touchSamplingRate: 300,
    recommendedDpi: 490,
    pointerSpeed: 1,
    fireButtonSize: 46,
    baseSensi: { general: 94, redDot: 90, scope2x: 88, scope4x: 85, scopeAwm: 48, freeLook: 65 },
  },
  {
    id: 'vivo-t3',
    brand: 'Vivo',
    model: 'Vivo T3 5G',
    screenDpi: 395,
    refreshRate: 120,
    touchSamplingRate: 360,
    recommendedDpi: 460,
    pointerSpeed: 1,
    fireButtonSize: 48,
    baseSensi: { general: 96, redDot: 92, scope2x: 88, scope4x: 85, scopeAwm: 51, freeLook: 68 },
  },

  // OnePlus
  {
    id: 'oneplus-12r',
    brand: 'OnePlus',
    model: 'OnePlus 12R',
    screenDpi: 450,
    refreshRate: 120,
    touchSamplingRate: 360,
    recommendedDpi: 510,
    pointerSpeed: 1,
    fireButtonSize: 43,
    baseSensi: { general: 97, redDot: 94, scope2x: 91, scope4x: 88, scopeAwm: 47, freeLook: 70 },
  },
  {
    id: 'oneplus-nord-ce-4',
    brand: 'OnePlus',
    model: 'OnePlus Nord CE 4 5G',
    screenDpi: 394,
    refreshRate: 120,
    touchSamplingRate: 240,
    recommendedDpi: 470,
    pointerSpeed: 1,
    fireButtonSize: 47,
    baseSensi: { general: 95, redDot: 91, scope2x: 88, scope4x: 85, scopeAwm: 50, freeLook: 66 },
  },
  {
    id: 'oneplus-11',
    brand: 'OnePlus',
    model: 'OnePlus 11 5G',
    screenDpi: 525,
    refreshRate: 120,
    touchSamplingRate: 360,
    recommendedDpi: 530,
    pointerSpeed: 2,
    fireButtonSize: 44,
    baseSensi: { general: 96, redDot: 93, scope2x: 90, scope4x: 87, scopeAwm: 46, freeLook: 69 },
  },

  // Samsung
  {
    id: 'samsung-s24-ultra',
    brand: 'Samsung',
    model: 'Samsung Galaxy S24 Ultra',
    screenDpi: 505,
    refreshRate: 120,
    touchSamplingRate: 240,
    recommendedDpi: 550,
    pointerSpeed: 2,
    fireButtonSize: 42,
    baseSensi: { general: 98, redDot: 95, scope2x: 92, scope4x: 89, scopeAwm: 45, freeLook: 72 },
  },
  {
    id: 'samsung-a55',
    brand: 'Samsung',
    model: 'Samsung Galaxy A55 5G',
    screenDpi: 390,
    refreshRate: 120,
    touchSamplingRate: 240,
    recommendedDpi: 470,
    pointerSpeed: 1,
    fireButtonSize: 47,
    baseSensi: { general: 94, redDot: 90, scope2x: 86, scope4x: 84, scopeAwm: 49, freeLook: 64 },
  },
  {
    id: 'samsung-m34',
    brand: 'Samsung',
    model: 'Samsung Galaxy M34 5G',
    screenDpi: 396,
    refreshRate: 120,
    touchSamplingRate: 240,
    recommendedDpi: 450,
    pointerSpeed: 2,
    fireButtonSize: 49,
    baseSensi: { general: 97, redDot: 93, scope2x: 89, scope4x: 86, scopeAwm: 51, freeLook: 68 },
  },
  {
    id: 'samsung-f54',
    brand: 'Samsung',
    model: 'Samsung Galaxy F54 5G',
    screenDpi: 393,
    refreshRate: 120,
    touchSamplingRate: 240,
    recommendedDpi: 460,
    pointerSpeed: 1,
    fireButtonSize: 48,
    baseSensi: { general: 95, redDot: 91, scope2x: 87, scope4x: 85, scopeAwm: 50, freeLook: 65 },
  },

  // Apple iPhone
  {
    id: 'iphone-16-pro-max',
    brand: 'Apple',
    model: 'iPhone 16 Pro Max',
    screenDpi: 460,
    refreshRate: 120,
    touchSamplingRate: 240,
    recommendedDpi: 490,
    pointerSpeed: 0,
    fireButtonSize: 44,
    baseSensi: { general: 95, redDot: 92, scope2x: 88, scope4x: 85, scopeAwm: 46, freeLook: 65 },
  },
  {
    id: 'iphone-15-pro',
    brand: 'Apple',
    model: 'iPhone 15 Pro',
    screenDpi: 460,
    refreshRate: 120,
    touchSamplingRate: 240,
    recommendedDpi: 480,
    pointerSpeed: 0,
    fireButtonSize: 45,
    baseSensi: { general: 94, redDot: 91, scope2x: 87, scope4x: 84, scopeAwm: 47, freeLook: 64 },
  },
  {
    id: 'iphone-14',
    brand: 'Apple',
    model: 'iPhone 14 / 14 Plus',
    screenDpi: 460,
    refreshRate: 60,
    touchSamplingRate: 120,
    recommendedDpi: 470,
    pointerSpeed: 1,
    fireButtonSize: 48,
    baseSensi: { general: 97, redDot: 94, scope2x: 90, scope4x: 88, scopeAwm: 50, freeLook: 70 },
  },
  {
    id: 'iphone-13',
    brand: 'Apple',
    model: 'iPhone 13 / 13 Pro',
    screenDpi: 460,
    refreshRate: 60,
    touchSamplingRate: 120,
    recommendedDpi: 460,
    pointerSpeed: 1,
    fireButtonSize: 48,
    baseSensi: { general: 98, redDot: 95, scope2x: 91, scope4x: 89, scopeAwm: 52, freeLook: 72 },
  },
  {
    id: 'iphone-11',
    brand: 'Apple',
    model: 'iPhone 11',
    screenDpi: 326,
    refreshRate: 60,
    touchSamplingRate: 120,
    recommendedDpi: 440,
    pointerSpeed: 2,
    fireButtonSize: 52,
    baseSensi: { general: 100, redDot: 98, scope2x: 94, scope4x: 92, scopeAwm: 55, freeLook: 75 },
  },

  // Dedicated Gaming Phones
  {
    id: 'rog-phone-8',
    brand: 'ASUS',
    model: 'ASUS ROG Phone 8 Pro',
    screenDpi: 388,
    refreshRate: 165,
    touchSamplingRate: 720,
    recommendedDpi: 600,
    pointerSpeed: 0,
    fireButtonSize: 39,
    baseSensi: { general: 92, redDot: 88, scope2x: 85, scope4x: 82, scopeAwm: 42, freeLook: 58 },
  },
  {
    id: 'black-shark-5',
    brand: 'Black Shark',
    model: 'Black Shark 5 Pro',
    screenDpi: 395,
    refreshRate: 144,
    touchSamplingRate: 720,
    recommendedDpi: 580,
    pointerSpeed: 1,
    fireButtonSize: 40,
    baseSensi: { general: 94, redDot: 90, scope2x: 87, scope4x: 84, scopeAwm: 44, freeLook: 62 },
  },

  // Infinix & Tecno
  {
    id: 'infinix-gt-20-pro',
    brand: 'Infinix',
    model: 'Infinix GT 20 Pro Gaming',
    screenDpi: 395,
    refreshRate: 144,
    touchSamplingRate: 360,
    recommendedDpi: 510,
    pointerSpeed: 1,
    fireButtonSize: 44,
    baseSensi: { general: 96, redDot: 93, scope2x: 89, scope4x: 86, scopeAwm: 48, freeLook: 68 },
  },
  {
    id: 'tecno-pova-6-pro',
    brand: 'Tecno',
    model: 'Tecno Pova 6 Pro 5G',
    screenDpi: 393,
    refreshRate: 120,
    touchSamplingRate: 240,
    recommendedDpi: 470,
    pointerSpeed: 1,
    fireButtonSize: 48,
    baseSensi: { general: 96, redDot: 92, scope2x: 88, scope4x: 85, scopeAwm: 50, freeLook: 67 },
  },

  // Motorola & Nothing
  {
    id: 'moto-edge-50-pro',
    brand: 'Motorola',
    model: 'Moto Edge 50 Pro 5G',
    screenDpi: 446,
    refreshRate: 144,
    touchSamplingRate: 360,
    recommendedDpi: 510,
    pointerSpeed: 1,
    fireButtonSize: 45,
    baseSensi: { general: 95, redDot: 92, scope2x: 88, scope4x: 86, scopeAwm: 47, freeLook: 66 },
  },
  {
    id: 'nothing-phone-2a',
    brand: 'Nothing',
    model: 'Nothing Phone (2a)',
    screenDpi: 394,
    refreshRate: 120,
    touchSamplingRate: 240,
    recommendedDpi: 480,
    pointerSpeed: 1,
    fireButtonSize: 46,
    baseSensi: { general: 96, redDot: 92, scope2x: 89, scope4x: 86, scopeAwm: 49, freeLook: 68 },
  },
];

export function autoDetectDevice(): DeviceSpec {
  if (typeof window === 'undefined') return POPULAR_DEVICES[0];
  const ua = window.navigator.userAgent.toLowerCase();
  
  if (ua.includes('iphone')) {
    return POPULAR_DEVICES.find(d => d.id === 'iphone-15-pro') || POPULAR_DEVICES[0];
  }
  if (ua.includes('samsung') || ua.includes('sm-')) {
    return POPULAR_DEVICES.find(d => d.id === 'samsung-s24-ultra') || POPULAR_DEVICES[0];
  }
  if (ua.includes('oneplus')) {
    return POPULAR_DEVICES.find(d => d.id === 'oneplus-12r') || POPULAR_DEVICES[0];
  }
  if (ua.includes('iqoo') || ua.includes('vivo')) {
    return POPULAR_DEVICES.find(d => d.id === 'iqoo-neo-9-pro') || POPULAR_DEVICES[0];
  }
  if (ua.includes('poco') || ua.includes('redmi') || ua.includes('xiaomi')) {
    return POPULAR_DEVICES.find(d => d.id === 'poco-x6-pro') || POPULAR_DEVICES[0];
  }
  if (ua.includes('realme')) {
    return POPULAR_DEVICES.find(d => d.id === 'realme-12-pro-plus') || POPULAR_DEVICES[0];
  }
  
  // Default to balanced esports champion device: POCO X6 Pro 5G
  return POPULAR_DEVICES[0];
}
