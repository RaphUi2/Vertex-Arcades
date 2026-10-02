// Vertex Arcades - TypeScript Definitions
import { Language } from './utils/i18n';

export type CosmeticRarity = 'commun' | 'rare' | 'epique' | 'legendaire' | 'mythique' | 'divin';

export interface AppSettings {
  language?: Language; // 'en' (default) | 'fr' | 'es'
  sfxEnabled: boolean;
  musicEnabled: boolean;
  sfxVolume: number; // 0 to 100
  musicVolume: number; // 0 to 100
  currentTrack: 'halloween' | 'portal' | 'chill' | 'synthwave' | 'hyper' | 'neon';
  graphicsQuality: 'eco' | 'balanced' | 'ultra';
  particleDensity: 'faible' | 'normal' | 'extreme';
  glowEffects: boolean;
  scanlines: boolean;
  hapticVibration: boolean;
  showFps: boolean;
  controllerLayout: 'xbox' | 'playstation';
  mobileControlsEnabled: boolean;
  colorTheme?: 'halloween' | 'cyber' | 'dark' | 'light';
  playButtonColor?: 'emerald' | 'cyan' | 'purple' | 'rose' | 'amber' | 'zinc' | 'white';
  monochromeMode?: boolean; // legacy alias
}

export interface UserProfile {
  username: string;
  avatarColor: string;
  avatarIcon: string;
  avatarModel: string;
  customAvatarUrl?: string; // Custom uploaded profile photo
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
  selectedTags: string[]; // Up to 8 active description tags
  unlockedGames: string[]; // Paid games unlocked with V-Coins
  luckMultiplier: number; // Bonus RNG luck
  activeFusionArtifact?: string;

  // Social & Friends Preparation Fields
  socialStatus?: 'ready_for_duel' | 'looking_for_squad' | 'tryhard' | 'chill' | 'grinding_achievements' | 'dnd' | 'afk';
  socialCustomStatus?: string; // Custom mood or quote shown to friends
  gamerPlaystyle?: 'tryhard' | 'chill' | 'speedrunner' | 'completionist' | 'teamplayer' | 'collector';
  favoriteGameId?: string; // Signature game ('cyber_runner_2099', 'cosmic_defender', 'pixel_dungeon_quest', 'titan_pinball_titan', 'quantum_strike')
  preferredControl?: 'touch' | 'keyboard' | 'gamepad' | 'all';
  voiceChatPreference?: 'open' | 'push_to_talk' | 'listening_only' | 'no_mic';
  socialCardTheme?: 'cyan' | 'fuchsia' | 'emerald' | 'amber' | 'purple' | 'gold';
  friendCode?: string;
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
  rating?: number;
  activePlayers?: string;
  creator: string;
  badge?: string;
  isPaid: boolean;
  costVCoins: number;
  isRankedAvailable?: boolean;
  imageSquare?: string;
  imageBanner?: string;
}

export interface Achievement {
  id: string;
  title: string;
  frenchTitle: string;
  spanishTitle?: string;
  description: string;
  frenchDescription: string;
  spanishDescription?: string;
  vcoinReward: number;
  isUnlocked: boolean;
  icon: string;
  category: 'gameplay' | 'ranked' | 'trophy' | 'rng' | 'trade' | 'cosmetics' | 'secret' | 'story';
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

export interface StoryChapter {
  id: number;
  title: string;
  subtitle: string;
  lore: string;
  enemyName: string;
  enemyHp: number;
  enemyMaxHp: number;
  playerHp: number;
  playerMaxHp: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  stars: number; // 0 to 3 stars
  rewardVCoins: number;
  rewardTitle?: string;
  bossEmoji: string;
}

export interface StoryModeState {
  currentChapterId: number;
  chapters: StoryChapter[];
  totalStars: number;
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
  worldBoss?: WorldBossState;
  storyMode?: StoryModeState;
  favorites: string[]; // List of favorite game IDs (Hearts!)
  recentGames: string[];
}
