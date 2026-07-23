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

export interface GlobalState {
  profile: UserProfile;
  stats: Record<string, GameStats>; // gameId -> stats
  achievements: Achievement[];
  quests?: Quest[];
  arcadePass?: ArcadePass;
}
