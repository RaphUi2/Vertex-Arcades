export interface UserProfile {
  username: string;
  avatarColor: string;
  totalPixels: number;
  unlockedSkins: string[];
  activeSkin: string;
  title?: string;
  unlockedTitles?: string[];
  unlockedColors?: string[];
  avatarIcon?: string;
  unlockedAvatarIcons?: string[];
  activeAura?: string;
  unlockedAuras?: string[];
  activeBanner?: string;
  unlockedBanners?: string[];
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
  category: 'clicker' | 'memory' | 'reflex' | 'arcade' | 'puzzle';
  difficulty: 'easy' | 'medium' | 'hard' | 'mythic';
  color: string; // Tailwind glow/text color
  rarity?: 'commun' | 'rare' | 'epique' | 'divin' | 'mythique';
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

export interface GlobalState {
  profile: UserProfile;
  stats: Record<string, GameStats>; // gameId -> stats
  achievements: Achievement[];
  quests?: Quest[];
  arcadePass?: ArcadePass;
  tournamentScores?: Record<string, number>; // tournamentId -> score
  claimedTournaments?: string[]; // IDs of tournaments where prize was claimed
}
