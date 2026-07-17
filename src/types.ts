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
  difficulty: 'easy' | 'medium' | 'hard';
  color: string; // Tailwind glow/text color
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
  type: 'plays_total' | 'score_specific' | 'pixels_earned' | 'math_streak';
  target: number;
  current: number;
  rewardPixels: number;
  rewardXp: number;
  isCompleted: boolean;
  isClaimed: boolean;
  gameId?: string;
}

export interface ArcadePass {
  level: number;
  xp: number;
  isPremium: boolean;
  claimedFreeRewards: number[];
  claimedPremiumRewards: number[];
}

export interface GlobalState {
  profile: UserProfile;
  stats: Record<string, GameStats>; // gameId -> stats
  achievements: Achievement[];
  quests?: Quest[];
  arcadePass?: ArcadePass;
}
