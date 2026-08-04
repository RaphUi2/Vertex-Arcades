export interface UserProfile {
  username: string;
  avatarColor: string;
  totalPixels: number;
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
  prestigeLevel?: number;
  dailyStreak?: number;
  lastDailyClaimTimestamp?: number;
  lastWheelSpinTimestamp?: number;
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
  category: 'clicker' | 'memory' | 'reflex' | 'arcade' | 'puzzle' | 'rhythm';
  difficulty: 'easy' | 'medium' | 'hard' | 'mythic';
  color: string; // Tailwind glow/text color
  rarity?: 'commun' | 'rare' | 'epique' | 'legendaire' | 'mythique' | 'divin';
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
}

export interface PassLevelReward {
  type: 'pixels' | 'title' | 'skin' | 'color' | 'aura' | 'banner';
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
  claimedFreeRewards: number[];
  claimedPremiumRewards: number[];
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
  targetScore: number; // Score raisonnable à battre pour gagner le tournoi
  unit?: string; // e.g. "pts", "clics", "séquence"
  prizePool: number;
  titleReward: string;
  endsInDays: number;
  status: 'active' | 'upcoming' | 'ended';
  participantsCount: number;
  leaderboard: TournamentLeaderboardEntry[];
  userBestScore?: number;
}

export interface RankQuest {
  id: string;
  title: string;
  description: string;
  target: number;
  rewardRankPts: number;
  rewardPixels: number;
  type: 'plays_total' | 'plays_game' | 'highscore' | 'shop_buy' | 'quests_complete' | 'pass_level';
  gameId?: string;
  category?: string;
}

export interface CompetitiveRank {
  id: string;
  name: string;
  frenchName: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master';
  division: string; // e.g. "III", "II", "I", "APEX"
  minScore: number;
  pixelReward: number;
  titleReward?: string;
  badgeColor: string;
  glowColor: string;
  icon: string;
  description: string;
  perkText: string;
  bonusMultiplier: number; // e.g. 1.05 = +5% PX
}

export interface GlobalState {
  profile: UserProfile;
  stats: Record<string, GameStats>; // gameId -> stats
  achievements: Achievement[];
  quests?: Quest[];
  arcadePass?: ArcadePass;
  tournamentScores?: Record<string, number>; // tournamentId -> score
  claimedTournaments?: string[]; // IDs of tournaments where prize was claimed
  claimedRankRewards?: string[]; // IDs of claimed rank tiers
  rankPoints?: number; // Rank PTS starting at 0
  claimedRankQuests?: string[]; // IDs of completed/claimed rank quests
  favorites?: string[]; // Array of favorited game IDs
  recentGames?: string[]; // Array of up to 3 recent game IDs (most recent first)
}
