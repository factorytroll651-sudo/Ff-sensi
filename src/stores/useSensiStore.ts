import { useState, useEffect } from 'react';
import { DeviceSpec, POPULAR_DEVICES } from '../constants/devices';
import { WeaponCategory } from '../constants/weapons';
import { SensiValues, PlaystyleType, calculateSensitivity } from '../services/sensiAlgorithm';

export interface SavedProfile {
  id: string;
  name: string;
  date: string;
  deviceName: string;
  values: SensiValues;
}

export interface SensiState {
  values: SensiValues;
  sliderScale: '100' | '200';
  activeWeapon: WeaponCategory;
  playstyle: PlaystyleType;
  regedit: {
    miraPerfeita: boolean;
    semRecuo: boolean;
    fastClick: boolean;
    fpsBooster: boolean;
    touchMultiplier: number; // 1x, 2x, 5x, 10x
    fpsTarget: 60 | 90 | 120;
  };
  savedProfiles: SavedProfile[];
  lastCopiedTimestamp: number | null;
}

const STORAGE_KEY = 'sensipro_ff_sensi_v1';

const initialValues: SensiValues = {
  general: 97,
  redDot: 94,
  scope2x: 91,
  scope4x: 88,
  scopeAwm: 48,
  freeLook: 70,
  fireButtonSize: 44,
  recommendedDpi: 520,
  pointerSpeed: 2,
};

const defaultProfiles: SavedProfile[] = [
  {
    id: 'fav-tournament',
    name: 'Tournament Scrims Rusher',
    date: '2026-11-10',
    deviceName: 'POCO X6 Pro 5G',
    values: {
      general: 98,
      redDot: 95,
      scope2x: 92,
      scope4x: 88,
      scopeAwm: 46,
      freeLook: 72,
      fireButtonSize: 43,
      recommendedDpi: 540,
      pointerSpeed: 2,
    },
  },
  {
    id: 'fav-shotgun',
    name: 'One-Tap M1887 High Flick',
    date: '2026-11-08',
    deviceName: 'iPhone 15 Pro',
    values: {
      general: 100,
      redDot: 98,
      scope2x: 94,
      scope4x: 90,
      scopeAwm: 45,
      freeLook: 75,
      fireButtonSize: 41,
      recommendedDpi: 560,
      pointerSpeed: 2,
    },
  },
];

function loadStoredSensi(): SensiState {
  if (typeof window === 'undefined') {
    return {
      values: initialValues,
      sliderScale: '100',
      activeWeapon: 'all',
      playstyle: 'balanced',
      regedit: {
        miraPerfeita: true,
        semRecuo: false,
        fastClick: true,
        fpsBooster: false,
        touchMultiplier: 2,
        fpsTarget: 120,
      },
      savedProfiles: defaultProfiles,
      lastCopiedTimestamp: null,
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        values: initialValues,
        sliderScale: '100',
        activeWeapon: 'all',
        playstyle: 'balanced',
        regedit: {
          miraPerfeita: true,
          semRecuo: false,
          fastClick: true,
          fpsBooster: false,
          touchMultiplier: 2,
          fpsTarget: 120,
        },
        savedProfiles: defaultProfiles,
        lastCopiedTimestamp: null,
        ...parsed,
      };
    }
  } catch {
    // fallback
  }
  return {
    values: initialValues,
    sliderScale: '100',
    activeWeapon: 'all',
    playstyle: 'balanced',
    regedit: {
      miraPerfeita: true,
      semRecuo: false,
      fastClick: true,
      fpsBooster: false,
      touchMultiplier: 2,
      fpsTarget: 120,
    },
    savedProfiles: defaultProfiles,
    lastCopiedTimestamp: null,
  };
}

let memorySensiState: SensiState = loadStoredSensi();
const sensiListeners = new Set<(state: SensiState) => void>();

function emitSensiChange() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memorySensiState));
    } catch {
      // ignore
    }
  }
  sensiListeners.forEach(l => l(memorySensiState));
}

export function useSensiStore() {
  const [state, setState] = useState<SensiState>(memorySensiState);

  useEffect(() => {
    const listener = (newState: SensiState) => setState({ ...newState });
    sensiListeners.add(listener);
    return () => {
      sensiListeners.delete(listener);
    };
  }, []);

  const updateValue = (key: keyof SensiValues, value: number) => {
    memorySensiState = {
      ...memorySensiState,
      values: {
        ...memorySensiState.values,
        [key]: value,
      },
    };
    emitSensiChange();
  };

  const setAllValues = (newValues: SensiValues) => {
    memorySensiState = {
      ...memorySensiState,
      values: newValues,
    };
    emitSensiChange();
  };

  const setSliderScale = (scale: '100' | '200') => {
    const factor = scale === '200' ? 2 : 0.5;
    if (memorySensiState.sliderScale !== scale) {
      memorySensiState = {
        ...memorySensiState,
        sliderScale: scale,
        values: {
          ...memorySensiState.values,
          general: Math.round(memorySensiState.values.general * factor),
          redDot: Math.round(memorySensiState.values.redDot * factor),
          scope2x: Math.round(memorySensiState.values.scope2x * factor),
          scope4x: Math.round(memorySensiState.values.scope4x * factor),
          scopeAwm: Math.round(memorySensiState.values.scopeAwm * factor),
          freeLook: Math.round(memorySensiState.values.freeLook * factor),
        },
      };
      emitSensiChange();
    }
  };

  const setActiveWeapon = (weapon: WeaponCategory, currentDevice?: DeviceSpec) => {
    const targetDevice = currentDevice || POPULAR_DEVICES[0];
    const recalculated = calculateSensitivity({
      device: targetDevice,
      weaponCategory: weapon,
      playstyle: memorySensiState.playstyle,
      sliderScale: memorySensiState.sliderScale,
      regeditAimAssist: memorySensiState.regedit.miraPerfeita,
    });

    memorySensiState = {
      ...memorySensiState,
      activeWeapon: weapon,
      values: recalculated,
    };
    emitSensiChange();
  };

  const setPlaystyle = (playstyle: PlaystyleType, currentDevice?: DeviceSpec) => {
    const targetDevice = currentDevice || POPULAR_DEVICES[0];
    const recalculated = calculateSensitivity({
      device: targetDevice,
      weaponCategory: memorySensiState.activeWeapon,
      playstyle,
      sliderScale: memorySensiState.sliderScale,
      regeditAimAssist: memorySensiState.regedit.miraPerfeita,
    });

    memorySensiState = {
      ...memorySensiState,
      playstyle,
      values: recalculated,
    };
    emitSensiChange();
  };

  const setTouchMultiplier = (multiplier: number) => {
    memorySensiState = {
      ...memorySensiState,
      regedit: {
        ...memorySensiState.regedit,
        touchMultiplier: multiplier,
      },
    };
    emitSensiChange();
  };

  const setFpsTarget = (fps: 60 | 90 | 120) => {
    memorySensiState = {
      ...memorySensiState,
      regedit: {
        ...memorySensiState.regedit,
        fpsTarget: fps,
      },
    };
    emitSensiChange();
  };

  const toggleRegedit = (key: 'miraPerfeita' | 'semRecuo' | 'fastClick' | 'fpsBooster') => {
    memorySensiState = {
      ...memorySensiState,
      regedit: {
        ...memorySensiState.regedit,
        [key]: !memorySensiState.regedit[key],
      },
    };
    emitSensiChange();
  };

  const saveCurrentProfile = (profileName: string, deviceName: string) => {
    const newProfile: SavedProfile = {
      id: `prof-${Date.now()}`,
      name: profileName || `Custom Sensi #${memorySensiState.savedProfiles.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      deviceName,
      values: { ...memorySensiState.values },
    };
    memorySensiState = {
      ...memorySensiState,
      savedProfiles: [newProfile, ...memorySensiState.savedProfiles],
    };
    emitSensiChange();
  };

  const loadProfile = (profile: SavedProfile) => {
    memorySensiState = {
      ...memorySensiState,
      values: { ...profile.values },
    };
    emitSensiChange();
  };

  const deleteProfile = (id: string) => {
    memorySensiState = {
      ...memorySensiState,
      savedProfiles: memorySensiState.savedProfiles.filter(p => p.id !== id),
    };
    emitSensiChange();
  };

  const recordCopied = () => {
    memorySensiState = {
      ...memorySensiState,
      lastCopiedTimestamp: Date.now(),
    };
    emitSensiChange();
  };

  return {
    ...state,
    updateValue,
    setAllValues,
    setSliderScale,
    setActiveWeapon,
    setPlaystyle,
    toggleRegedit,
    setTouchMultiplier,
    setFpsTarget,
    saveCurrentProfile,
    loadProfile,
    deleteProfile,
    recordCopied,
  };
}
