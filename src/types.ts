// Vertex Arcades v3.0 TypeScript Definitions

export type CosmeticRarity = 'commun' | 'rare' | 'epique' | 'legendaire' | 'mythique' | 'divin';

export interface AppSettings {
  sfxEnabled: boolean;
  musicEnabled: boolean;
  sfxVolume: number; // 0 to 100
  musicVolume: number; // 0 to 100
  currentTrack: 'chill' | 'synthwave' | 'hyper' | 'neon';
  graphicsQuality: 'eco' | 'balanced' | 'ultra';
  particleDensity: 'faible' | 'normal' | 'extreme';
  glowEffects: boolean;
  scanlines: boolean;
  hapticVibration: boolean;
  showFps: boolean;
  controllerLayout: 'xbox' | 'playstation';
  mobileControlsEnabled: boolean;
}

export interface UserProfile {
  username: string;
  avatarColor: string;
  avatarIcon: string;
  avatarModel: string;
  totalVCoins: number;
  totalPixels?: number; // legacy alias
  title: string;
  unlockedTitles: string[];
  unlockedAvatarIcons: string[];
  activeAura: string;
  unlockedAuras: string[];
  activeBanner: string;
  unlockedBanners: string[];
  activeFrame: string;
  unlockedFrames: string[];
  activeHat: string;
  unlockedHats: string[];
  bio: string;
  selectedTags: string[]; // Up to 6 active from 50+ description tags
  unlockedGames: string[]; // Paid games unlocked with V-Coins
  luckMultiplier: number; // Bonus RNG luck
  activeFusionArtifact?: string;
}

export interface GameStats {
  plays: number;
  highScore: number;
}

export interface GameData {
  id: string;
  name: string;
  frenchName: string;
  description: string;
  category: 'action' | 'platformer' | 'puzzle' | 'racer' | 'rhythm' | 'tycoon' | 'survival' | 'rpg';
  difficulty: 'Facile' | 'Moyen' | 'Difficile' | 'Extrême';
  color: string;
  rating: number; // e.g. 96 for 96%
  activePlayers: string; // e.g. "2.4k"
  creator: string;
  badge?: string;
  isPaid: boolean;
  costVCoins: number;
  isRankedAvailable?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  frenchTitle: string;
  description: string;
  frenchDescription: string;
  vcoinReward: number;
  isUnlocked: boolean;
  icon: string;
  category: 'gameplay' | 'ranked' | 'trophy' | 'rng' | 'trade' | 'cosmetics' | 'secret';
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  rewardVCoins: number;
  rewardXp: number;
  isCompleted: boolean;
  isClaimed: boolean;
  gameId?: string;
  category: 'daily' | 'weekly' | 'metaverse';
  icon: string;
  multiplier?: number;
}

export interface TrophyMilestone {
  trophiesRequired: number;
  leagueName: string;
  rewardType: 'vcoins' | 'rng_roll' | 'hat' | 'aura' | 'title';
  rewardLabel: string;
  rewardValue: string | number;
  badgeIcon: string;
  color: string;
}

export interface PassLevelReward {
  type: 'vcoins' | 'title' | 'hat' | 'aura' | 'banner' | 'frame' | 'rng_ticket' | 'pet';
  value: number | string;
  label: string;
  icon?: string;
}

export interface PassLevel {
  level: number;
  freeReward: PassLevelReward;
  premiumReward: PassLevelReward;
}

export interface ArcadePass {
  level: number;
  xp: number;
  isPremium: boolean;
  claimedFreeRewards: number[];
  claimedPremiumRewards: number[];
}

export interface RngUniverseItem {
  id: string;
  name: string;
  universe: 'Cyberverse' | 'Fortnite' | 'Minecraft' | 'Apex Legends' | 'Zelda' | 'Metaverse';
  rarity: 'Commun' | 'Peu Commun' | 'Rare' | 'Épique' | 'Légendaire' | 'Mythique' | 'Cosmique' | 'Divin';
  chanceDenominator: number; // 1 in X
  iconName: string;
  accentColor: string;
  glowClass: string;
  description: string;
  vcoinWorth: number;
}

export interface TradeRequest {
  id: string;
  traderName: string;
  traderAvatar: string;
  traderTitle: string;
  offeredItemIds: string[];
  offeredVCoins: number;
  requestedItemIds: string[];
  requestedVCoins: number;
  message: string;
}

export interface RankedTier {
  id: string;
  name: string;
  frenchName: string;
  minPoints: number;
  color: string;
  glow: string;
  icon: string;
  badgeGradient: string;
}

export interface WorldBossState {
  name: string;
  currentHp: number;
  maxHp: number;
  stage: number;
  playerTotalDamage: number;
  claimedMilestones: number[];
}

export interface GlobalState {
  profile: UserProfile;
  stats: Record<string, GameStats>;
  achievements: Achievement[];
  quests: Quest[];
  arcadePass: ArcadePass;
  settings: AppSettings;
  rankPoints: number; // Ranked points
  totalTrophies: number;
  claimedTrophyRoadRewards: number[];
  rngInventory: Record<string, number>; // itemId -> count
  rngTotalRolls: number;
  activeTradeRequests: TradeRequest[];
  completedTradesCount: number;
  worldBoss: WorldBossState;
  favorites: string[]; // List of favorite game IDs (Hearts!)
  recentGames: string[];
}
