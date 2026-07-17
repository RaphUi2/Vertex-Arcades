import { GameData } from './types';

export const GAMES_LIST: GameData[] = [
  {
    id: 'clicker',
    name: 'Neon Clicker',
    frenchName: 'Néon Clicker',
    description: 'Cliquez sur le noyau lumineux pour collecter un maximum de Pixels en 60 secondes. Achetez des multiplicateurs !',
    icon: 'Zap',
    category: 'clicker',
    difficulty: 'easy',
    color: 'text-cyan-400 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-950/20 hover:border-cyan-400'
  },
  {
    id: 'simon',
    name: 'Simon Memory',
    frenchName: 'Simon Mémorisation',
    description: 'Une séquence lumineuse et sonore se joue sous vos yeux. Mémorisez-la et répétez-la parfaitement.',
    icon: 'Brain',
    category: 'memory',
    difficulty: 'medium',
    color: 'text-purple-400 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-purple-950/20 hover:border-purple-400'
  },
  {
    id: 'reflex',
    name: 'Reflex Speed Tap',
    frenchName: 'Vitesse Réflexe',
    description: 'Cliquez sur les nodes lumineuses qui surgissent au hasard à toute vitesse. Vous avez 3 vies et 30 secondes !',
    icon: 'Target',
    category: 'reflex',
    difficulty: 'hard',
    color: 'text-rose-400 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] bg-rose-950/20 hover:border-rose-400'
  },
  {
    id: 'snake',
    name: 'Neon Snake',
    frenchName: 'Néon Snake',
    description: 'Le célèbre jeu rétro avec une queue de serpent lumineuse et un terrain néon. Ne touchez pas les bords !',
    icon: 'Play',
    category: 'arcade',
    difficulty: 'medium',
    color: 'text-emerald-400 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] bg-emerald-950/20 hover:border-emerald-400'
  },
  {
    id: 'brick',
    name: 'Brick Breaker',
    frenchName: 'Casse-Briques',
    description: 'Faites rebondir la balle avec votre raquette pour détruire les briques néon lumineuses du niveau.',
    icon: 'Grid',
    category: 'arcade',
    difficulty: 'medium',
    color: 'text-cyan-400 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-950/20 hover:border-cyan-400'
  },
  {
    id: 'stacker',
    name: 'Stacker Arcade',
    frenchName: 'Stacker',
    description: 'Empilez des blocs qui oscillent de gauche à droite. Soyez parfaitement synchronisé pour atteindre le sommet !',
    icon: 'Layers',
    category: 'arcade',
    difficulty: 'medium',
    color: 'text-purple-400 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-purple-950/20 hover:border-purple-400'
  },
  {
    id: 'catch',
    name: 'Color Catch',
    frenchName: 'Color Catch',
    description: 'Des orbes de couleur tombent du ciel. Alignez la couleur de votre réceptacle pour marquer des points !',
    icon: 'Shield',
    category: 'reflex',
    difficulty: 'hard',
    color: 'text-yellow-400 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)] bg-yellow-950/20 hover:border-yellow-400'
  },
  {
    id: 'binary',
    name: 'Binary Cipher',
    frenchName: 'Déchiffreur Binaire',
    description: 'Résolvez des énigmes en convertissant des nombres binaires en décimal. Un compte à rebours de 5 secondes !',
    icon: 'Cpu',
    category: 'puzzle',
    difficulty: 'hard',
    color: 'text-cyan-400 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-950/20 hover:border-cyan-400'
  },
  {
    id: 'tictactoe',
    name: 'Neon Tic-Tac-Toe',
    frenchName: 'Morpion Néon',
    description: 'Affrontez l\'Intelligence Artificielle "VERTEX-9000" dans un duel classique de Morpion rétro-lumineux.',
    icon: 'Sword',
    category: 'puzzle',
    difficulty: 'easy',
    color: 'text-fuchsia-400 border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.3)] bg-fuchsia-950/20 hover:border-fuchsia-400'
  },
  {
    id: 'math',
    name: 'Math Blitz',
    frenchName: 'Math Blitz',
    description: 'Une équation mathématique s\'affiche. Vrai ou Faux ? Vous avez moins de 3 secondes pour répondre !',
    icon: 'PlusCircle',
    category: 'puzzle',
    difficulty: 'medium',
    color: 'text-emerald-400 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] bg-emerald-950/20 hover:border-emerald-400'
  },
  {
    id: 'gridmemory',
    name: 'Matrix Memory',
    frenchName: 'Matrice Mémoire',
    description: 'Retenez le motif de tuiles qui s\'allument sur une grille de 4x4, puis reproduisez-le de mémoire.',
    icon: 'Grid3X3',
    category: 'memory',
    difficulty: 'medium',
    color: 'text-purple-400 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-purple-950/20 hover:border-purple-400'
  },
  {
    id: 'whack',
    name: 'Whack-A-Node',
    frenchName: 'Tape la Node',
    description: 'Des nodes lumineuses surgissent dans une grille de 3x3. Tapez-les vite avant qu\'elles ne disparaissent !',
    icon: 'Sparkles',
    category: 'reflex',
    difficulty: 'easy',
    color: 'text-yellow-400 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)] bg-yellow-950/20 hover:border-yellow-400'
  }
];

export const CABINET_SKINS = [
  { id: 'neon', name: 'Cyber Néon', cost: 0, theme: 'from-slate-950 via-slate-900 to-indigo-950 border-cyan-500/80 shadow-[0_0_30px_rgba(6,182,212,0.4)]' },
  { id: 'retrowave', name: 'Retrowave Doré', cost: 150, theme: 'from-slate-950 via-fuchsia-950 to-slate-950 border-yellow-500/80 shadow-[0_0_30px_rgba(234,179,8,0.4)]' },
  { id: 'slime', name: 'Cosmic Slime', cost: 250, theme: 'from-slate-950 via-slate-900 to-emerald-950 border-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.4)]' },
  { id: 'matrix', name: 'Matrix Terminal', cost: 400, theme: 'from-black via-zinc-900 to-black border-green-500/80 shadow-[0_0_30px_rgba(34,197,94,0.4)]' }
];

export const INITIAL_ACHIEVEMENTS = [
  { id: 'ach1', title: 'First Pixel', frenchTitle: 'Premier Pixel', description: 'Earn your first pixels in any game', frenchDescription: 'Gagnez vos premiers pixels dans n\'importe quel jeu', pixelReward: 20, isUnlocked: false, icon: 'Award' },
  { id: 'ach2', title: 'Click Pioneer', frenchTitle: 'Pionnier du Clic', description: 'Score over 150 pixels in Neon Clicker', frenchDescription: 'Scorez plus de 150 pixels dans Néon Clicker', pixelReward: 40, isUnlocked: false, icon: 'Zap' },
  { id: 'ach3', title: 'Simon King', frenchTitle: 'Roi de Simon', description: 'Reach a sequence length of 6 in Simon Memory', frenchDescription: 'Atteignez une longueur de séquence de 6 dans Simon Mémorisation', pixelReward: 50, isUnlocked: false, icon: 'Brain' },
  { id: 'ach4', title: 'Speed God', frenchTitle: 'Dieu de la Vitesse', description: 'Score over 120 points in Reflex Speed Tap', frenchDescription: 'Scorez plus de 120 points dans Vitesse Réflexe', pixelReward: 60, isUnlocked: false, icon: 'Zap' },
  { id: 'ach5', title: 'Snake Charm', frenchTitle: 'Charmeur de Serpent', description: 'Score over 100 points in Neon Snake', frenchDescription: 'Scorez plus de 100 points dans Néon Snake', pixelReward: 50, isUnlocked: false, icon: 'Award' },
  { id: 'ach6', title: 'Block Master', frenchTitle: 'Destructeur de Blocs', description: 'Score over 150 points in Brick Breaker', frenchDescription: 'Scorez plus de 150 points dans Casse-Briques', pixelReward: 50, isUnlocked: false, icon: 'Grid' },
  { id: 'ach7', title: 'Stack Lord', frenchTitle: 'Seigneur de la Pile', description: 'Score over 200 points in Stacker Arcade', frenchDescription: 'Scorez plus de 200 points dans Stacker', pixelReward: 50, isUnlocked: false, icon: 'Layers' },
  { id: 'ach8', title: 'Color Harvester', frenchTitle: 'Moissonneur de Couleur', description: 'Score over 120 points in Color Catch', frenchDescription: 'Scorez plus de 120 points dans Color Catch', pixelReward: 50, isUnlocked: false, icon: 'Shield' },
  { id: 'ach9', title: 'AI Slayer', frenchTitle: 'Fléau de l\'I.A.', description: 'Defeat AI "VERTEX-9000" in Tic-Tac-Toe', frenchDescription: 'Battez l\'I.A. "VERTEX-9000" au Morpion Néon', pixelReward: 50, isUnlocked: false, icon: 'Sword' },
  { id: 'ach10', title: 'Math Genius', frenchTitle: 'Génie Mathématique', description: 'Get a 10 streak in Math Blitz', frenchDescription: 'Obtenez une série de 10 réponses correctes dans Math Blitz', pixelReward: 50, isUnlocked: false, icon: 'PlusCircle' }
];
