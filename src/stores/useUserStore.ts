import { useState, useEffect } from 'react';
import { SupportedGame } from '../services/gameLauncher';
import { DeviceSpec, POPULAR_DEVICES, autoDetectDevice } from '../constants/devices';
import { Language } from '../constants/translations';

export type VipTier = 'free' | 'pro' | 'elite';

export interface UserState {
  isLoggedIn: boolean;
  email: string;
  displayName: string;
  gameUid: string;
  language: Language;
  masterSensitivityEnabled: boolean;
  vipTier: VipTier;
  vipExpiresAt: string | null;
  coachTokens: number;
  streakCount: number;
  lastStreakClaimDate: string | null;
  claimedStreakDays: number[];
  referralCode: string;
  referredCount: number;
  selectedGame: SupportedGame;
  device: DeviceSpec;
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  isDevModeActive: boolean;
}

const STORAGE_KEY = 'sensipro_ff_user_v1';

const defaultState: UserState = {
  isLoggedIn: false,
  email: 'player@sensipro.gg',
  displayName: 'Pro Player #42',
  gameUid: '284910284',
  language: 'hi', // Default to Hindi / Indian audience
  masterSensitivityEnabled: true,
  vipTier: 'free',
  vipExpiresAt: null,
  coachTokens: 5, // 5 Starter bonus tokens!
  streakCount: 1,
  lastStreakClaimDate: null,
  claimedStreakDays: [],
  referralCode: 'SENSI999',
  referredCount: 2,
  selectedGame: 'freefire_india',
  device: POPULAR_DEVICES[0],
  hapticsEnabled: true,
  soundEnabled: true,
  isDevModeActive: false,
};

function loadStoredState(): UserState {
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultState, ...parsed };
    }
  } catch {
    // fallback
  }
  const detected = autoDetectDevice();
  return { ...defaultState, device: detected };
}

// React Hook state store with localStorage sync
let memoryState: UserState = loadStoredState();
const listeners = new Set<(state: UserState) => void>();

function emitChange() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
    } catch {
      // storage quota or private mode
    }
  }
  listeners.forEach(listener => listener(memoryState));
}

export function useUserStore() {
  const [state, setState] = useState<UserState>(memoryState);

  useEffect(() => {
    const listener = (newState: UserState) => setState({ ...newState });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setVipTier = (tier: VipTier) => {
    memoryState = {
      ...memoryState,
      vipTier: tier,
      vipExpiresAt: tier === 'free' ? null : '2027-12-31T23:59:59Z',
    };
    emitChange();
  };

  const addTokens = (count: number) => {
    memoryState = {
      ...memoryState,
      coachTokens: Math.max(0, memoryState.coachTokens + count),
    };
    emitChange();
  };

  const consumeToken = (): boolean => {
    if (memoryState.vipTier === 'elite') return true; // Elite has unlimited tokens
    if (memoryState.coachTokens <= 0) return false;
    memoryState = {
      ...memoryState,
      coachTokens: memoryState.coachTokens - 1,
    };
    emitChange();
    return true;
  };

  const setSelectedGame = (game: SupportedGame) => {
    memoryState = {
      ...memoryState,
      selectedGame: game,
    };
    emitChange();
  };

  const setDevice = (device: DeviceSpec) => {
    memoryState = {
      ...memoryState,
      device,
    };
    emitChange();
  };

  const claimDailyStreak = (dayIndex: number): { success: boolean; tokensAwarded: number; isGrandPrize: boolean } => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (memoryState.claimedStreakDays.includes(dayIndex)) {
      return { success: false, tokensAwarded: 0, isGrandPrize: false };
    }

    const isGrandPrize = dayIndex === 7;
    const tokensAwarded = isGrandPrize ? 3 : 1;

    memoryState = {
      ...memoryState,
      coachTokens: memoryState.coachTokens + tokensAwarded,
      claimedStreakDays: [...memoryState.claimedStreakDays, dayIndex],
      lastStreakClaimDate: todayStr,
      streakCount: Math.min(7, memoryState.streakCount + 1),
    };
    emitChange();

    return { success: true, tokensAwarded, isGrandPrize };
  };

  const redeemReferral = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === memoryState.referralCode) {
      return { success: false, message: 'You cannot redeem your own referral code!' };
    }
    if (cleanCode.length < 4) {
      return { success: false, message: 'Invalid code format. Enter a valid creator or friend code.' };
    }

    memoryState = {
      ...memoryState,
      coachTokens: memoryState.coachTokens + 2,
      referredCount: memoryState.referredCount + 1,
    };
    emitChange();

    return {
      success: true,
      message: `Code "${cleanCode}" redeemed! +2 Coach IA Tokens added to your wallet!`,
    };
  };

  const setLanguage = (lang: Language) => {
    memoryState = {
      ...memoryState,
      language: lang,
    };
    emitChange();
  };

  const toggleMasterSensitivity = () => {
    memoryState = {
      ...memoryState,
      masterSensitivityEnabled: !memoryState.masterSensitivityEnabled,
    };
    emitChange();
  };

  const loginUser = (email: string, name?: string, uid?: string) => {
    memoryState = {
      ...memoryState,
      isLoggedIn: true,
      email,
      displayName: name || email.split('@')[0],
      gameUid: uid || memoryState.gameUid,
    };
    emitChange();
  };

  const logoutUser = () => {
    memoryState = {
      ...memoryState,
      isLoggedIn: false,
    };
    emitChange();
  };

  const toggleSound = () => {
    memoryState = { ...memoryState, soundEnabled: !memoryState.soundEnabled };
    emitChange();
  };

  const toggleHaptics = () => {
    memoryState = { ...memoryState, hapticsEnabled: !memoryState.hapticsEnabled };
    emitChange();
  };

  const activateDevMode = () => {
    memoryState = {
      ...memoryState,
      vipTier: 'elite',
      coachTokens: memoryState.coachTokens + 500,
      isDevModeActive: true,
    };
    emitChange();
  };

  return {
    ...state,
    setVipTier,
    addTokens,
    consumeToken,
    setSelectedGame,
    setDevice,
    setLanguage,
    toggleMasterSensitivity,
    claimDailyStreak,
    redeemReferral,
    loginUser,
    logoutUser,
    toggleSound,
    toggleHaptics,
    activateDevMode,
  };
}
