export type CosmeticRarity = 'commun' | 'rare' | 'epique' | 'legendaire' | 'mythique' | 'divin';

export interface AppSettings {
  sfxEnabled: boolean;
  musicEnabled: boolean;
  particleDensity: 'faible' | 'normal' | 'extreme';
  bgAnimationOverride?: string;
  crtFilter: boolean;
  autoSave: boolean;
  scanlines: boolean;
  retroGlow: boolean;
}

export interface Friend {
  id: string;
  username: string;
  avatarColor: string;
  avatarIcon: string;
  activeBanner?: string;
  activeAura?: string;
  activeFrame?: string;
  status: 'online' | 'in-game' | 'offline';
  currentGame?: string;
  rankPoints: number;
  rankTier: string;
  totalPixels: number;
  duelWins: number;
  duelLosses: number;
  isFavorite?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderColor: string;
  senderIcon: string;
  senderRank?: string;
  message: string;
  timestamp: number;
  channel: 'general' | 'jurassic' | 'duels' | 'dm';
  recipientId?: string;
  isSystem?: boolean;
  scoreFlex?: { gameName: string; score: number };
}

export interface DuelChallenge {
  id: string;
  challengerId: string;
  challengerName: string;
  challengerAvatar: { color: string; icon: string };
  challengedId: string;
  challengedName: string;
  challengedAvatar: { color: string; icon: string };
  gameId: string;
  gameName: string;
  wagerPx: number;
  status: 'pending' | 'active' | 'completed' | 'declined';
  challengerScore?: number;
  challengedScore?: number;
  winnerId?: string;
  timestamp: number;
}

export interface UserProfile {
  username: string;
  avatarColor: string;
  totalPixels: number;
  amberTokens?: number;
  unlockedSkins: string[];
  activeSkin: string;
  title?: string;
  unlockedTitles?: string[];
  avatarIcon?: string;
  unlockedAvatarIcons?: string[];
  activeAura?: string;
  unlockedAuras?: string[];
  activeBanner?: string;
  unlockedBanners?: string[];
  unlockedColors?: string[];
  unlockedFrames?: string[];
  activeFrame?: string;
  unlockedFx?: string[];
  activeFx?: string;
  bio?: string;
  prestigeLevel?: number;
  dailyStreak?: number;
  lastDailyClaimTimestamp?: number;
  lastWheelSpinTimestamp?: number;
  goldenKeys?: number;
  equippedCompanionId?: string;
  unlockedCompanionIds?: string[];
  companionLevels?: Record<string, number>;
  duelWins?: number;
  duelLosses?: number;
  duelWinStreak?: number;
  friends?: Friend[];
  customBadges?: string[];
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
  icon: string;
  category: 'clicker' | 'memory' | 'reflex' | 'arcade' | 'puzzle' | 'rhythm' | 'jurassic';
  difficulty: 'easy' | 'medium' | 'hard' | 'mythic';
  color: string; // Tailwind glow/text color
  rarity?: CosmeticRarity;
  isNew?: boolean;
  tag?: string;
}

export interface Achievement {
  id: string;
  title: string;
  frenchTitle: string;
  description: string;
  frenchDescription: string;
  pixelReward: number;
  isUnlocked: boolean;
  icon: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: string;
  target: number;
  current: number;
  rewardPixels: number;
  rewardXp: number;
  isCompleted: boolean;
  isClaimed: boolean;
  gameId?: string;
  isFlash?: boolean;
  multiplier?: number;
}

export interface PassLevelReward {
  type: 'pixels' | 'title' | 'skin' | 'color' | 'aura' | 'banner' | 'frame' | 'key' | 'rp' | 'amber' | 'pet';
  value: number | string;
  label: string;
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
  season: number;
  seasonName?: string;
  claimedFreeRewards: number[];
  claimedPremiumRewards: number[];
}

export interface ProPassState {
  level: number;
  xp: number;
  isPro: boolean;
  claimedFreeRewards: number[];
  claimedProRewards: number[];
}

export interface TournamentLeaderboardEntry {
  rank: number;
  username: string;
  avatarColor: string;
  avatarIcon: string;
  score: number;
  isUser?: boolean;
}

export interface Tournament {
  id: string;
  title: string;
  frenchTitle: string;
  gameId: string;
  gameName: string;
  description: string;
  targetScore: number;
  unit?: string;
  prizePool: number;
  titleReward: string;
  endsInDays: number;
  status: 'active' | 'upcoming' | 'ended';
  participantsCount: number;
  leaderboard: TournamentLeaderboardEntry[];
  userBestScore?: number;
}

export interface CompetitiveRank {
  id: string;
  name: string;
  frenchName: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'celestial' | 'apex_primal';
  division: string;
  minScore: number;
  pixelReward: number;
  titleReward?: string;
  badgeColor: string;
  glowColor: string;
  icon: string;
  description: string;
}

export interface RankedGameScores {
  sprintReflex: number;
  laserBlitz: number;
  quantumTarget: number;
  dinoTrial?: number;
}

export interface GlobalState {
  profile: UserProfile;
  stats: Record<string, GameStats>; // gameId -> stats
  achievements: Achievement[];
  quests?: Quest[];
  arcadePass?: ArcadePass;
  proPass?: ProPassState;
  settings?: AppSettings;
  rankedScores?: RankedGameScores;
  tournamentScores?: Record<string, number>;
  claimedTournaments?: string[];
  claimedRankRewards?: string[];
  rankPoints?: number;
  favorites?: string[];
  recentGames?: string[];
  friends?: Friend[];
  chatMessages?: ChatMessage[];
  activeDuels?: DuelChallenge[];
  duelHistory?: DuelChallenge[];
}

