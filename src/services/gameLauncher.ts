export type SupportedGame = 'freefire_india' | 'freefire_max' | 'freefire_global';

export interface GameMetadata {
  id: SupportedGame;
  title: string;
  packageName: string;
  badge: string;
  shortTag: string;
  intentUrl: string;
  marketUrl: string;
  universalUrl: string;
  bannerColor: string;
  description: string;
}

export const GAMES_INFO: Record<SupportedGame, GameMetadata> = {
  freefire_india: {
    id: 'freefire_india',
    title: 'Free Fire India',
    packageName: 'com.dts.freefireindia',
    badge: 'India Exclusive 🇮🇳',
    shortTag: 'FF INDIA',
    intentUrl: 'intent://com.dts.freefireindia/#Intent;scheme=package;package=com.dts.freefireindia;end',
    marketUrl: 'https://play.google.com/store/apps/details?id=com.dts.freefireindia',
    universalUrl: 'freefireindia://open',
    bannerColor: '#22C55E',
    description: 'Direct launch intent for the official Free Fire India client with calibrated server latency.',
  },
  freefire_max: {
    id: 'freefire_max',
    title: 'Free Fire MAX',
    packageName: 'com.dts.freefiremax',
    badge: 'Ultra HD 🌟',
    shortTag: 'FF MAX',
    intentUrl: 'intent://com.dts.freefiremax/#Intent;scheme=package;package=com.dts.freefiremax;end',
    marketUrl: 'https://play.google.com/store/apps/details?id=com.dts.freefiremax',
    universalUrl: 'freefiremax://open',
    bannerColor: '#F59E0B',
    description: 'High-fidelity graphics engine launcher with dynamic lighting and sound craft.',
  },
  freefire_global: {
    id: 'freefire_global',
    title: 'Free Fire Global',
    packageName: 'com.dts.freefireth',
    badge: 'Global Edition 🌐',
    shortTag: 'FF GLOBAL',
    intentUrl: 'intent://com.dts.freefireth/#Intent;scheme=package;package=com.dts.freefireth;end',
    marketUrl: 'https://play.google.com/store/apps/details?id=com.dts.freefireth',
    universalUrl: 'freefireth://open',
    bannerColor: '#3B82F6',
    description: 'Original lightweight battle royale edition for universal esports scrims.',
  },
};

/**
 * Executes or triggers the game launch intent.
 * If running in mobile browser, dispatches the intent URL;
 * Otherwise opens the verified store page or copies launch command.
 */
export function launchGame(gameId: SupportedGame): { launched: boolean; method: 'intent' | 'store' | 'web'; message: string } {
  const game = GAMES_INFO[gameId];
  if (!game) return { launched: false, method: 'web', message: 'Game not recognized' };

  if (typeof window === 'undefined') {
    return { launched: false, method: 'web', message: 'Unavailable outside browser' };
  }

  const isAndroid = /android/i.test(navigator.userAgent);
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  if (isAndroid) {
    // Attempt android intent launch
    window.location.href = game.intentUrl;
    return {
      launched: true,
      method: 'intent',
      message: `Triggered Android intent for ${game.title} (${game.packageName})`,
    };
  } else if (isIOS) {
    window.location.href = game.universalUrl;
    return {
      launched: true,
      method: 'intent',
      message: `Triggered iOS scheme for ${game.title}`,
    };
  } else {
    // Desktop or preview mode: open Google Play store page
    window.open(game.marketUrl, '_blank', 'noopener,noreferrer');
    return {
      launched: true,
      method: 'store',
      message: `Opened ${game.title} Google Play target (${game.packageName})`,
    };
  }
}
