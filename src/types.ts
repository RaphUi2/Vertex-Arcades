export interface UserProfile {
  username: string;
  avatarColor: string;
  totalPixels: number;
  unlockedSkins: string[];
  activeSkin: string;
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

export interface GlobalState {
  profile: UserProfile;
  stats: Record<string, GameStats>; // gameId -> stats
  achievements: Achievement[];
}
