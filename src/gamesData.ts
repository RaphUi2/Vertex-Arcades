import { GameData, Quest, Achievement, PassLevel, PassLevelReward, Tournament, CompetitiveRank, CosmeticRarity } from './types';

export interface CabinetSkin {
  id: string;
  name: string;
  cost: number;
  theme: string;
  bgGradient: string;
  cardBg: string;
  glowColor: string;
  accentText: string;
  buttonStyle: string;
  colorPreview: string;
  rarity: CosmeticRarity;
  bgType: 'grid' | 'matrix' | 'synthwave' | 'quantum' | 'lava' | 'glacier' | 'gold' | 'neon_rain' | 'nebula' | 'supernova' | 'glitch';
}

export interface CosmeticItem {
  id: string;
  name: string;
  category: 'skin' | 'aura' | 'banner' | 'title' | 'icon' | 'color' | 'frame' | 'fx';
  cost: number;
  rarity: CosmeticRarity;
  desc?: string;
  previewVal?: string;
  colorHex?: string;
  iconName?: string;
  glowClass?: string;
  gradient?: string;
}

export const GAMES_LIST: GameData[] = [
  {
    id: 'clicker',
    name: 'Neon Clicker',
    frenchName: 'Néon Clicker',
    description: 'Noyau Overclock : générez des Pixels, détruisez les anomalies bosses et déclenchez la surtension Hyperdrive !',
    icon: 'Zap',
    category: 'clicker',
    difficulty: 'easy',
    color: 'text-cyan-400 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-950/20 hover:border-cyan-400',
    rarity: 'commun'
  },
  {
    id: 'reflex',
    name: 'Reflex Speed Tap',
    frenchName: 'Vitesse Réflexe',
    description: 'Cliquez sur les nodes néon géantes sans stress. Vous avez 10 vies et 60 secondes !',
    icon: 'Target',
    category: 'reflex',
    difficulty: 'easy',
    color: 'text-rose-400 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] bg-rose-950/20 hover:border-rose-400',
    rarity: 'commun'
  },
  {
    id: 'snake',
    name: 'Neon Snake',
    frenchName: 'Néon Snake',
    description: 'Le célèbre jeu rétro avec une queue de serpent lumineuse et un terrain néon. Ne touchez pas les bords !',
    icon: 'Play',
    category: 'arcade',
    difficulty: 'medium',
    color: 'text-emerald-400 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] bg-emerald-950/20 hover:border-emerald-400',
    rarity: 'commun'
  },
  {
    id: 'brick',
    name: 'Brick Breaker',
    frenchName: 'Casse-Briques',
    description: 'Faites rebondir la balle avec votre raquette pour détruire les briques néon lumineuses du niveau.',
    icon: 'Grid',
    category: 'arcade',
    difficulty: 'medium',
    color: 'text-cyan-400 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-950/20 hover:border-cyan-400',
    rarity: 'commun'
  },
  {
    id: 'tictactoe',
    name: 'Neon Tic-Tac-Toe',
    frenchName: 'Morpion Néon',
    description: 'Affrontez l\'IA "VERTEX-9000" dans un duel classique de Morpion rétro-lumineux.',
    icon: 'Sword',
    category: 'puzzle',
    difficulty: 'easy',
    color: 'text-fuchsia-400 border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.3)] bg-fuchsia-950/20 hover:border-fuchsia-400',
    rarity: 'commun'
  },
  {
    id: 'math',
    name: 'Math Blitz',
    frenchName: 'Math Blitz',
    description: 'Une équation mathématique s\'affiche. Vrai ou Faux ? Vous avez moins de 3 secondes pour répondre !',
    icon: 'PlusCircle',
    category: 'puzzle',
    difficulty: 'medium',
    color: 'text-emerald-400 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] bg-emerald-950/20 hover:border-emerald-400',
    rarity: 'commun'
  },
  {
    id: 'whack',
    name: 'Whack-A-Node',
    frenchName: 'Tape la Node',
    description: 'Des nodes lumineuses surgissent dans une grille de 3x3. Tapez-les vite avant qu\'elles ne disparaissent !',
    icon: 'Sparkles',
    category: 'reflex',
    difficulty: 'easy',
    color: 'text-yellow-400 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)] bg-yellow-950/20 hover:border-yellow-400',
    rarity: 'commun'
  },
  {
    id: 'bubble',
    name: 'Neon Bubble Pop',
    frenchName: 'Éclate-Nodes',
    description: 'Éclatez les orbes de données bleues qui s\'élèvent, mais évitez les charges électriques rouges.',
    icon: 'Sparkles',
    category: 'reflex',
    difficulty: 'easy',
    color: 'text-cyan-400 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-950/20 hover:border-cyan-400',
    rarity: 'commun'
  },
  {
    id: 'pairs',
    name: 'Memory Pairs',
    frenchName: 'Paires Néon',
    description: 'Retournez les cartes de la matrice cybernétique pour retrouver toutes les paires identiques.',
    icon: 'Grid',
    category: 'memory',
    difficulty: 'easy',
    color: 'text-purple-400 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-purple-950/20 hover:border-purple-400',
    rarity: 'commun'
  },
  {
    id: 'mines',
    name: 'Minesweeper Express',
    frenchName: 'Démineur Express',
    description: 'Découvrez les tuiles sûres sans faire sauter les mines plasma instables du secteur !',
    icon: 'Shield',
    category: 'puzzle',
    difficulty: 'easy',
    color: 'text-rose-400 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)] bg-rose-950/20 hover:border-rose-400',
    rarity: 'commun'
  },
  {
    id: 'simon',
    name: 'Simon Memory',
    frenchName: 'Simon Mémorisation',
    description: 'Une séquence lumineuse et sonore se joue sous vos yeux. Mémorisez-la et répétez-la parfaitement.',
    icon: 'Brain',
    category: 'memory',
    difficulty: 'medium',
    color: 'text-purple-400 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-purple-950/20 hover:border-purple-400',
    rarity: 'rare'
  },
  {
    id: 'stacker',
    name: 'Stacker Arcade',
    frenchName: 'Stacker',
    description: 'Empilez des blocs qui oscillent. Soyez parfaitement synchronisé pour atteindre le sommet !',
    icon: 'Layers',
    category: 'arcade',
    difficulty: 'medium',
    color: 'text-purple-400 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-purple-950/20 hover:border-purple-400',
    rarity: 'rare'
  },
  {
    id: 'binary',
    name: 'Binary Cipher',
    frenchName: 'Déchiffreur Binaire',
    description: 'Convertissez des nombres binaires en décimal avant la fin du compte à rebours de 5 secondes !',
    icon: 'Cpu',
    category: 'puzzle',
    difficulty: 'hard',
    color: 'text-cyan-400 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-950/20 hover:border-cyan-400',
    rarity: 'rare'
  },
  {
    id: 'gridmemory',
    name: 'Matrix Memory',
    frenchName: 'Matrice Mémoire',
    description: 'Retenez le motif de tuiles qui s\'allument sur une grille de 4x4, puis reproduisez-le.',
    icon: 'Grid3X3',
    category: 'memory',
    difficulty: 'medium',
    color: 'text-purple-400 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-purple-950/20 hover:border-purple-400',
    rarity: 'rare'
  },
  {
    id: 'flappy',
    name: 'Neon Flappy',
    frenchName: 'Néon Flappy',
    description: 'Sautez au bon moment pour faire passer votre drone à travers les portails d\'énergie instables.',
    icon: 'Navigation',
    category: 'arcade',
    difficulty: 'medium',
    color: 'text-amber-400 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] bg-amber-950/20 hover:border-amber-400',
    rarity: 'rare'
  },
  {
    id: 'target',
    name: 'Neon Target',
    frenchName: 'Cible Néon',
    description: 'Un curseur oscille sur une jauge. Cliquez pile au centre dans la zone de surcharge critique !',
    icon: 'Target',
    category: 'reflex',
    difficulty: 'medium',
    color: 'text-emerald-400 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] bg-emerald-950/20 hover:border-emerald-400',
    rarity: 'rare'
  },
  {
    id: 'pong',
    name: 'Neon Pong',
    frenchName: 'Néon Pong',
    description: 'Duel d\'arcade 1v1 contre l\'I.A. Renvoyez la balle électrisée avec votre raquette néon.',
    icon: 'Shield',
    category: 'arcade',
    difficulty: 'medium',
    color: 'text-cyan-400 border-cyan-500 shadow-[0_0_18px_rgba(6,182,212,0.4)] bg-cyan-950/20 hover:border-cyan-400',
    rarity: 'rare'
  },
  {
    id: 'maze',
    name: 'Neon Maze',
    frenchName: 'Labyrinthe Néon',
    description: 'Frayez-vous un chemin dans la matrice labyrinthe, récoltez les puces et fuyez avant le délai !',
    icon: 'Compass',
    category: 'puzzle',
    difficulty: 'medium',
    color: 'text-emerald-400 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] bg-emerald-950/30 hover:border-emerald-400',
    rarity: 'rare'
  },
  {
    id: 'tetris',
    name: 'Tetris Micro Neon',
    frenchName: 'Néon Tetris',
    description: 'Empilez et complétez des lignes de tetrominos lumineuses dans ce grand classique rétro !',
    icon: 'Grid',
    category: 'arcade',
    difficulty: 'medium',
    color: 'text-cyan-400 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] bg-cyan-950/30 hover:border-cyan-400',
    rarity: 'rare'
  },
  {
    id: 'frogger',
    name: 'Cyber Highway Cross',
    frenchName: 'Traversée Cyber',
    description: 'Guidez votre avatar à travers des voies de circulation rapides d\'hovercars et de rivières plasma !',
    icon: 'Compass',
    category: 'reflex',
    difficulty: 'medium',
    color: 'text-emerald-400 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] bg-emerald-950/30 hover:border-emerald-400',
    rarity: 'rare'
  },
  {
    id: 'quantum_clicker',
    name: 'Quantum Reactor Clicker',
    frenchName: 'Réacteur Quantique',
    description: 'Cliquez sur le Cœur Quantique pour déclencher des réactions de fusion et la surtension d\'énergie !',
    icon: 'Cpu',
    category: 'clicker',
    difficulty: 'medium',
    color: 'text-purple-400 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-purple-950/20 hover:border-purple-400',
    rarity: 'epique'
  },
  {
    id: 'catch',
    name: 'Color Catch',
    frenchName: 'Color Catch',
    description: 'Des orbes de couleur tombent du ciel. Alignez la couleur de votre réceptacle pour marquer !',
    icon: 'Shield',
    category: 'reflex',
    difficulty: 'hard',
    color: 'text-yellow-400 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)] bg-yellow-950/20 hover:border-yellow-400',
    rarity: 'epique'
  },
  {
    id: 'invaders',
    name: 'Neon Invaders',
    frenchName: 'Envahisseurs Néon',
    description: 'Esquivez les lasers ennemis et détruisez les vagues d\'envahisseurs rétro-lumineux de l\'espace.',
    icon: 'Cpu',
    category: 'arcade',
    difficulty: 'medium',
    color: 'text-fuchsia-400 border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.3)] bg-fuchsia-950/20 hover:border-fuchsia-400',
    rarity: 'epique'
  },
  {
    id: 'runner',
    name: 'Neon Runner',
    frenchName: 'Course Néon Cyber',
    description: 'Foncez sur une grille cyberpunk en sautant et double-sautant par-dessus les barrières !',
    icon: 'Flame',
    category: 'arcade',
    difficulty: 'hard',
    color: 'text-amber-400 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)] bg-amber-950/30 hover:border-amber-400',
    rarity: 'epique'
  },
  {
    id: 'gravity',
    name: 'Gravity Orb',
    frenchName: 'Orbe de Gravité',
    description: 'Inversez la gravité en plein vol pour esquiver les pylônes de défense plasmiques à haute tension !',
    icon: 'Flame',
    category: 'reflex',
    difficulty: 'hard',
    color: 'text-cyan-400 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] bg-cyan-950/30 hover:border-cyan-400',
    rarity: 'epique'
  },
  {
    id: 'asteroid',
    name: 'Asteroid Blaster',
    frenchName: 'Chasseur d\'Astéroïdes',
    description: 'Pilotez votre vaisseau vectoriel en 2D, détruisez les astéroïdes et évitez les fragments !',
    icon: 'Sparkles',
    category: 'arcade',
    difficulty: 'hard',
    color: 'text-fuchsia-400 border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.5)] bg-fuchsia-950/30 hover:border-fuchsia-400',
    rarity: 'epique'
  },
  {
    id: 'meteor',
    name: 'Meteor Storm',
    frenchName: 'Tempête Météore',
    description: 'Une pluie de météores s\'abat sur votre secteur. Esquivez-les ou pulvérisez-les à coups de laser !',
    icon: 'Sparkles',
    category: 'reflex',
    difficulty: 'hard',
    color: 'text-amber-400 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] bg-amber-950/20 hover:border-amber-400',
    rarity: 'legendaire'
  },
  {
    id: 'pinball',
    name: 'Neon Pinball',
    frenchName: 'Pinball Néon',
    description: 'Propulsez la bille argentée, enchaînez les ricochets sur les bumpers néon et contrôlez les flippers !',
    icon: 'Disc',
    category: 'arcade',
    difficulty: 'medium',
    color: 'text-cyan-400 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] bg-cyan-950/30 hover:border-cyan-400',
    rarity: 'legendaire'
  },
  {
    id: 'rhythm',
    name: 'Cyber Rhythm',
    frenchName: 'Cyber Rythme Néon',
    description: 'Pressez les touches en rythme sur 4 pistes néon électrisantes ! Déclenchez des combos de folie !',
    icon: 'Music',
    category: 'rhythm',
    difficulty: 'hard',
    color: 'text-pink-400 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)] bg-pink-950/30 hover:border-pink-400',
    rarity: 'legendaire'
  },
  {
    id: 'galaga',
    name: 'Star Fighter 1980',
    frenchName: 'Chasseur d\'Étoiles',
    description: 'Shooter spatial vertical rétro. Pulvérisez des vagues d\'escadrilles et des vaisseaux amiraux bosses !',
    icon: 'Zap',
    category: 'arcade',
    difficulty: 'hard',
    color: 'text-sky-400 border-sky-500 shadow-[0_0_20px_rgba(56,189,248,0.5)] bg-sky-950/30 hover:border-sky-400',
    rarity: 'legendaire'
  },
  {
    id: 'highway',
    name: 'Cyber Highway',
    frenchName: 'Cyber Highway',
    description: 'Esquivez les obstacles à haute tension sur une autoroute numérique à trois voies. Vitesse extrême !',
    icon: 'Zap',
    category: 'reflex',
    difficulty: 'mythic',
    color: 'text-rose-400 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)] bg-rose-950/30 hover:border-rose-400',
    rarity: 'mythique'
  },
  {
    id: 'lock',
    name: 'Cyber Lock Hacker',
    frenchName: 'Hacker de Verrou',
    description: 'Arrêtez le rotor laser de piratage précisément au niveau des segments de code lumineux.',
    icon: 'Key',
    category: 'puzzle',
    difficulty: 'mythic',
    color: 'text-yellow-400 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)] bg-yellow-950/30 hover:border-yellow-400',
    rarity: 'mythique'
  },
  {
    id: 'laserdodge',
    name: 'Laser Dodge',
    frenchName: 'Esquive Laser',
    description: 'Pilotez votre vaisseau néon et esquivez des grilles laser meurtrières tout en capturant des orbes !',
    icon: 'Sparkles',
    category: 'reflex',
    difficulty: 'mythic',
    color: 'text-fuchsia-400 border-fuchsia-500 shadow-[0_0_25px_rgba(217,70,239,0.6)] bg-fuchsia-950/30 hover:border-fuchsia-400',
    rarity: 'mythique'
  },
  {
    id: 'codebreaker',
    name: 'Matrix Code Breaker',
    frenchName: 'Piratage de Code',
    description: 'Mastermind cyberpunk : déchiffrez la combinaison secrète de 4 chiffres en analysant les indices !',
    icon: 'Key',
    category: 'puzzle',
    difficulty: 'mythic',
    color: 'text-green-400 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)] bg-green-950/30 hover:border-green-400',
    rarity: 'divin'
  },
  {
    id: 'geometry',
    name: 'Cyber Spike Jump',
    frenchName: 'Saut à Pics Néon',
    description: 'Foncez avec votre cube cybernétique et sautez au millimètre près par-dessus les pièges et pics laser !',
    icon: 'Flame',
    category: 'reflex',
    difficulty: 'mythic',
    color: 'text-pink-400 border-pink-500 shadow-[0_0_25px_rgba(236,72,153,0.6)] bg-pink-950/30 hover:border-pink-400',
    rarity: 'divin'
  }
];

export const CABINET_SKINS: CabinetSkin[] = [
  {
    id: 'neon',
    name: 'Cyber Néon Classique',
    cost: 0,
    theme: 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.4)]',
    bgGradient: 'bg-slate-950',
    cardBg: 'bg-slate-900 border-slate-800 hover:border-cyan-500',
    glowColor: 'rgba(6,182,212,0.4)',
    accentText: 'text-cyan-400',
    buttonStyle: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400',
    colorPreview: '#06b6d4',
    rarity: 'commun',
    bgType: 'grid'
  },
  {
    id: 'retrowave',
    name: 'Retrowave Doré 🌅',
    cost: 150,
    theme: 'border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.4)]',
    bgGradient: 'bg-amber-950',
    cardBg: 'bg-amber-900 border-amber-700 hover:border-yellow-400',
    glowColor: 'rgba(234,179,8,0.5)',
    accentText: 'text-yellow-400',
    buttonStyle: 'bg-yellow-500 text-slate-950 hover:bg-yellow-400',
    colorPreview: '#eab308',
    rarity: 'rare',
    bgType: 'synthwave'
  },
  {
    id: 'slime',
    name: 'Cosmic Slime 🧪',
    cost: 250,
    theme: 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]',
    bgGradient: 'bg-emerald-950',
    cardBg: 'bg-emerald-900 border-emerald-700 hover:border-emerald-400',
    glowColor: 'rgba(16,185,129,0.5)',
    accentText: 'text-emerald-400',
    buttonStyle: 'bg-emerald-500 text-slate-950 hover:bg-emerald-400',
    colorPreview: '#10b981',
    rarity: 'rare',
    bgType: 'lava'
  },
  {
    id: 'sunfire',
    name: 'Tempête Solaire ☀️',
    cost: 350,
    theme: 'border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.5)]',
    bgGradient: 'bg-orange-950',
    cardBg: 'bg-orange-900 border-orange-700 hover:border-orange-400',
    glowColor: 'rgba(249,115,22,0.6)',
    accentText: 'text-orange-400',
    buttonStyle: 'bg-orange-500 text-slate-950 hover:bg-orange-400',
    colorPreview: '#f97316',
    rarity: 'epique',
    bgType: 'supernova'
  },
  {
    id: 'matrix',
    name: 'Matrix Terminal 💻',
    cost: 450,
    theme: 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]',
    bgGradient: 'bg-zinc-950',
    cardBg: 'bg-zinc-900 border-green-800 hover:border-green-400',
    glowColor: 'rgba(34,197,94,0.5)',
    accentText: 'text-green-400',
    buttonStyle: 'bg-green-500 text-slate-950 hover:bg-green-400',
    colorPreview: '#22c55e',
    rarity: 'epique',
    bgType: 'matrix'
  },
  {
    id: 'glitch',
    name: 'Néon Glitché 🌀',
    cost: 550,
    theme: 'border-fuchsia-500 shadow-[0_0_30px_rgba(217,70,239,0.5)]',
    bgGradient: 'bg-purple-950',
    cardBg: 'bg-purple-900 border-fuchsia-800 hover:border-fuchsia-400',
    glowColor: 'rgba(217,70,239,0.6)',
    accentText: 'text-fuchsia-400',
    buttonStyle: 'bg-fuchsia-600 text-white hover:bg-fuchsia-500',
    colorPreview: '#d946ef',
    rarity: 'legendaire',
    bgType: 'glitch'
  },
  {
    id: 'prismatic',
    name: 'Prisme Magmatique 🔥',
    cost: 650,
    theme: 'border-pink-500 shadow-[0_0_35px_rgba(236,72,153,0.6)]',
    bgGradient: 'bg-rose-950',
    cardBg: 'bg-rose-900 border-pink-900 hover:border-pink-400',
    glowColor: 'rgba(236,72,153,0.6)',
    accentText: 'text-pink-400',
    buttonStyle: 'bg-pink-600 text-white hover:bg-pink-500',
    colorPreview: '#ec4899',
    rarity: 'legendaire',
    bgType: 'lava'
  },
  {
    id: 'quantum_void',
    name: 'Vide Quantique 🌌',
    cost: 800,
    theme: 'border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.75)]',
    bgGradient: 'bg-indigo-950',
    cardBg: 'bg-indigo-900 border-purple-800 hover:border-purple-400',
    glowColor: 'rgba(168,85,247,0.7)',
    accentText: 'text-purple-400',
    buttonStyle: 'bg-purple-600 text-white hover:bg-purple-500',
    colorPreview: '#a855f7',
    rarity: 'mythique',
    bgType: 'quantum'
  },
  {
    id: 'gold_emperor',
    name: 'Empereur d\'Or 👑',
    cost: 1000,
    theme: 'border-yellow-400 shadow-[0_0_40px_rgba(234,179,8,0.8)]',
    bgGradient: 'bg-yellow-950',
    cardBg: 'bg-yellow-900 border-yellow-700 hover:border-yellow-300',
    glowColor: 'rgba(234,179,8,0.8)',
    accentText: 'text-yellow-300',
    buttonStyle: 'bg-yellow-500 text-slate-950 hover:bg-yellow-400',
    colorPreview: '#facc15',
    rarity: 'mythique',
    bgType: 'gold'
  },
  {
    id: 'frozen_glacier',
    name: 'Glacier Éternel ❄️',
    cost: 1200,
    theme: 'border-sky-300 shadow-[0_0_35px_rgba(125,211,252,0.6)]',
    bgGradient: 'bg-sky-950',
    cardBg: 'bg-sky-900 border-sky-800 hover:border-sky-300',
    glowColor: 'rgba(125,211,252,0.7)',
    accentText: 'text-sky-300',
    buttonStyle: 'bg-sky-500 text-slate-950 hover:bg-sky-400',
    colorPreview: '#38bdf8',
    rarity: 'mythique',
    bgType: 'glacier'
  },
  {
    id: 'cyberpunk_2099',
    name: 'Cyberpunk 2099 ⚡',
    cost: 1400,
    theme: 'border-yellow-400 shadow-[0_0_40px_rgba(234,179,8,0.8)]',
    bgGradient: 'bg-yellow-950',
    cardBg: 'bg-yellow-900 border-yellow-500 hover:border-fuchsia-400',
    glowColor: 'rgba(234,179,8,0.8)',
    accentText: 'text-yellow-300',
    buttonStyle: 'bg-yellow-500 text-slate-950 hover:bg-yellow-400',
    colorPreview: '#facc15',
    rarity: 'mythique',
    bgType: 'synthwave'
  },
  {
    id: 'neon_synthwave',
    name: 'Synthwave Grille 🌇',
    cost: 1500,
    theme: 'border-pink-500 shadow-[0_0_40px_rgba(236,72,153,0.8)]',
    bgGradient: 'bg-purple-950',
    cardBg: 'bg-purple-900 border-pink-700 hover:border-cyan-400',
    glowColor: 'rgba(236,72,153,0.8)',
    accentText: 'text-pink-300',
    buttonStyle: 'bg-pink-600 text-white hover:bg-pink-500',
    colorPreview: '#ec4899',
    rarity: 'mythique',
    bgType: 'synthwave'
  },
  {
    id: 'supernova',
    name: 'Supernova Rouge 💥',
    cost: 1800,
    theme: 'border-red-500 shadow-[0_0_45px_rgba(239,68,68,0.9)]',
    bgGradient: 'bg-red-950',
    cardBg: 'bg-red-900 border-red-700 hover:border-orange-400',
    glowColor: 'rgba(239,68,68,0.9)',
    accentText: 'text-red-400',
    buttonStyle: 'bg-red-600 text-white hover:bg-red-500',
    colorPreview: '#ef4444',
    rarity: 'divin',
    bgType: 'supernova'
  },
  {
    id: 'celestial_astral',
    name: 'Sanctuaire Céleste ✨',
    cost: 2500,
    theme: 'border-amber-200 shadow-[0_0_50px_rgba(253,230,138,1)]',
    bgGradient: 'bg-amber-950',
    cardBg: 'bg-amber-900 border-amber-400 hover:border-yellow-200',
    glowColor: 'rgba(253,230,138,1)',
    accentText: 'text-amber-200',
    buttonStyle: 'bg-amber-400 text-slate-950 hover:bg-amber-300',
    colorPreview: '#fde047',
    rarity: 'divin',
    bgType: 'nebula'
  },
  {
    id: 'omega_vortex',
    name: 'Noyau Oméga Absolu 🔮',
    cost: 3500,
    theme: 'border-rose-400 shadow-[0_0_60px_rgba(244,63,94,1)]',
    bgGradient: 'bg-rose-950',
    cardBg: 'bg-slate-950 border-rose-500 hover:border-fuchsia-300',
    glowColor: 'rgba(244,63,94,1)',
    accentText: 'text-rose-300',
    buttonStyle: 'bg-rose-500 text-white hover:bg-rose-400',
    colorPreview: '#f43f5e',
    rarity: 'divin',
    bgType: 'quantum'
  }
];

// GENERATING EXPANSIVE COSMETICS FOR 300+ TOTAL ITEMS
export const AURA_COSMETICS: CosmeticItem[] = Array.from({ length: 40 }, (_, i) => {
  const rarities: CosmeticRarity[] = ['commun', 'rare', 'epique', 'legendaire', 'mythique', 'divin'];
  const rarity = rarities[Math.floor(i / 7)] || 'divin';
  const names = [
    'Aucune Aura 📭', 'Aura Solaire 🔥', 'Aura Hologramme 💎', 'Aura Shifting 🌀', 'Aura Royale 👑',
    'Aura Matrix Émeraude 💻', 'Aura Rose Néon 💖', 'Aura Nébuleuse 🌌', 'Aura Bouclier Glacial ❄️', 'Aura Magmatique 🌋',
    'Aura Hyperdrive 🚀', 'Aura Toxique Fluo ☣️', 'Aura Phoenix Rétro 🦅', 'Aura Oeil du Néant 👁️', 'Aura Éclair Quantique ⚡',
    'Aura Synthwave 80s 🌇', 'Aura Divinité Arcane ✨', 'Aura Glitch Cybernétique 👾', 'Aura Ombre de Ninjutsu 🥷', 'Aura Atome Néon ⚛️',
    'Aura Étoile du Matin 🌟', 'Aura Noyau Oméga 🔮', 'Aura Plasma Céleste 🌠', 'Aura Supernova Arpège 💥', 'Aura Cyber Vador 🖤',
    'Aura Prisme Spectral 🌈', 'Aura Vortex Éther 🌌', 'Aura Couronne Stellaire 👑', 'Aura Lumina Pro 💡', 'Aura Rayon Gamma ☢️',
    'Aura Laser Rouge 🛑', 'Aura Cristal de Glace 💎', 'Aura Spectre Blanc 👻', 'Aura Pulsation Temporelle ⏳', 'Aura Cœur Synthétique 💖',
    'Aura Tempête Ionique ⚡', 'Aura Flamme Bleue 🟦', 'Aura Ténèbres Absolues 🌑', 'Aura Nova de Diamant 💎', 'Aura Singularité 🌌'
  ];
  const glowClasses = [
    'border-slate-800',
    'border-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.9)] ring-2 ring-orange-500/50 animate-pulse',
    'border-cyan-400 border-dashed shadow-[0_0_30px_rgba(6,182,212,0.95)] ring-2 ring-cyan-400/60 animate-[pulse_2s_infinite]',
    'border-purple-500 shadow-[0_0_35px_rgba(168,85,247,0.95)] ring-2 ring-purple-500/60 animate-bounce-slow',
    'border-yellow-400 shadow-[0_0_40px_rgba(253,224,71,1)] ring-4 ring-yellow-400/70 animate-pulse',
    'border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.9)] ring-2 ring-emerald-400/60 animate-pulse',
    'border-rose-400 shadow-[0_0_35px_rgba(244,63,94,0.95)] ring-2 ring-rose-400/60 animate-pulse',
    'border-indigo-400 shadow-[0_0_35px_rgba(129,140,248,0.95)] ring-2 ring-indigo-400/60 animate-pulse'
  ];
  return {
    id: i === 0 ? 'none' : `aura_${i}`,
    name: names[i] || `Aura Néon Ultra #${i}`,
    category: 'aura',
    cost: i === 0 ? 0 : 80 + i * 25,
    rarity,
    desc: `Aura d'énergie d'arcade de rareté ${rarity.toUpperCase()}.`,
    glowClass: glowClasses[i % glowClasses.length] || 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.8)]'
  };
});

export const TITLE_BANNERS: CosmeticItem[] = Array.from({ length: 40 }, (_, i) => {
  const rarities: CosmeticRarity[] = ['commun', 'rare', 'epique', 'legendaire', 'mythique', 'divin'];
  const rarity = rarities[Math.floor(i / 7)] || 'divin';
  const names = [
    'Bannière Néon Cyber', 'Bannière Coucher Retrowave 🌅', 'Bannière Pluie Matrix 💻', 'Bannière Éruption Solaire ☀️',
    'Bannière Nébuleuse Quantique 🌌', 'Bannière Impériale d\'Or 👑', 'Bannière Cyberpunk 2099 ⚡', 'Bannière Glacier Céleste ❄️',
    'Bannière Magma Ardent 🌋', 'Bannière Émeraude Royale 💎', 'Bannière Trou Noir Absolu 🌑', 'Bannière Neon Synth 80s 🌇',
    'Bannière Fusion Toxique ☣️', 'Bannière Ailes de Phoenix 🦅', 'Bannière Voie Lactée 🌠', 'Bannière Réacteur Atomique ⚛️',
    'Bannière Lune de Sang 🩸', 'Bannière Aurore Boréale 🌌', 'Bannière Divinité d\'Or 🌟', 'Bannière Grille Quantique 🧬',
    'Bannière Maître de l\'Arcade 🏆', 'Bannière Circuit Intégré 🔌', 'Bannière Néon Noir 🖤', 'Bannière Vitesse Lumière 🚀',
    'Bannière Tempête Laser ⚡', 'Bannière Horizon Cassé 🌅', 'Bannière Cyber Samurai 🗡️', 'Bannière Univers Parallèle 🪐',
    'Bannière Code Source 💻', 'Bannière Matrice Infinie ♾️', 'Bannière Pulsar Stellaire 💫', 'Bannière Boss Suprême 💀',
    'Bannière Vainqueur de la Saison 🥇', 'Bannière Diamant Pur 💎', 'Bannière Chasseur de Score 🎯', 'Bannière Pixel Art 🎨',
    'Bannière Musique Synth 🎵', 'Bannière Arcade Retro 🎮', 'Bannière Glitch Master 👾', 'Bannière Oméga Final 🔮'
  ];
  const gradients = [
    'bg-cyan-900', 'bg-rose-900', 'bg-emerald-900', 'bg-orange-900', 'bg-purple-900', 'bg-yellow-900', 'bg-fuchsia-900',
    'bg-sky-900', 'bg-red-900', 'bg-teal-900', 'bg-slate-900', 'bg-pink-900', 'bg-lime-900', 'bg-amber-900', 'bg-indigo-900'
  ];
  return {
    id: i === 0 ? 'banner_neon' : `banner_${i}`,
    name: names[i] || `Bannière V2.0 #${i}`,
    category: 'banner',
    cost: i === 0 ? 0 : 50 + i * 20,
    rarity,
    desc: `Bannière de profil exclusive V2.0.`,
    gradient: gradients[i % gradients.length]
  };
});

export const SHOP_TITLES: CosmeticItem[] = Array.from({ length: 80 }, (_, i) => {
  const rarities: CosmeticRarity[] = ['commun', 'rare', 'epique', 'legendaire', 'mythique', 'divin'];
  const rarity = rarities[Math.floor(i / 14)] || 'divin';
  const titlesList = [
    'APPRENTI DU NÉON', 'PRO D\'ARCADE 🎮', 'HACKER QUANTIQUE 💻', 'DÉMON DE VITESSE ⚡', 'LÉGENDE VIVANTE 👑',
    'DIEU DU PIXEL 🌌', 'SEIGNEUR DU SPRINT 🏃', 'MAÎTRE DU PINBALL 🎯', 'LÉGENDE HYPERSPACE 🚀', 'CYBER ARCHITECTE 📐',
    'INCAPABLE DE PERDRE 🛡️', 'HACKER DE L\'EXTRÊME 👾', 'ROI DES COMPÉTITIONS 🏆', 'OVERCLOCKER SUPRÊME ⚡', 'MAÎTRE DU RYTHME 🎵',
    'PIRATE DU LABYRINTHE 🧭', 'DOMPTEUR DE GRAVITÉ 🌀', 'BRISEUR DE CODES 🔓', 'MILLIONNAIRE EN PIXELS 💰', 'MONARQUE DU RÉTRO 👑',
    'SINGULARITÉ ULTIME 🌌', 'JOUEUR DU SEMAINE 🌟', 'COLLECTIONNEUR DE RANGS 🎖️', 'EXPERT DU CLIC ⚡', 'LÉGENDE DE SAISON 3 🚀',
    'MAÎTRE DES COFFRES 📦', 'CHAMPION DU TOURNOI 🏆', 'SUDO ROOT 💻', 'SURCHARGE SYSTEM 💥', 'AURA DIVINE ✨',
    'ROUE DE LA FORTUNE 🎲', 'PRESTIGE ASTRAL 🌟', 'PILOTE SUPRASO 🏎️', 'ESPION QUANTIQUE 🕵️', 'TUEUR DE BOSS 👾',
    'PERFECTIONNISTE 🎯', 'MAÎTRE DES DÉFIS ⚡', 'FALCON PUNCH 🥊', 'RETRO VIBES 📻', 'MATRIX NEO 🕶️',
    'PRO PASS S3 🎫', 'COMBATTANT DE CLASSEMENT ⚔️', 'DIAMANT IMPÉRIALE 💎', 'LÉGENDE DES SITES 🌐', 'TITAN DE PIXEL 🗿',
    'LE DRAGON NÉON 🐉', 'SPECTRE CYBER 👻', 'MAÎTRE DU SERPENT 🐍', 'CASSEUR DE BLOCS 🧱', 'BOMBERMAN NÉON 💣',
    'CHASSEUR D\'ÉTOILES 🌠', 'PHOENIX REBORN 🦅', 'LÉGENDE DU CASSE-BRIQUES 🧱', 'CHAMPION DES RÉFLÈXES ⚡', 'ROI DU MORPION ❌',
    'ASTRONAUTE QUANTIQUE 👨‍🚀', 'DOMINATEUR DE GRILLE 📊', 'INCONTESTABLE 🥇', 'PRO GAMER 2.0 🎮', 'VIP VERTEX 💎',
    'ULTRA SPEEDSTER ⚡', 'CYBER SAMURAI 🗡️', 'NINJA DU PIXEL 🥷', 'SEIGNEUR DU MATRIX 🕶️', 'PROTOTYPE V2 🧪',
    'DIVINITÉ DE SAISON 🌌', 'EXÉCUTEUR DU CODE 💻', 'HYPERDRIVE ACE 🚀', 'MAÎTRE DES TOURS 🏛️', 'INARRÊTABLE 🛑',
    'SOUVERAIN DU NÉON 👑', 'PRINCE DU PIXEL 👑', 'SAGE DE L\'ARCADE 🧙', 'CYBER WIZARD 🧙‍♂️', 'VALKYRIE NÉON 🛡️',
    'COMMANDANT SPATIAL 🚀', 'EMPILAGE PARFAIT 📚', 'ROI DES COMBOS 💥', 'OVERLORD ARCADE 👑', 'DIVINITÉ ULTIME ✨'
  ];
  return {
    id: `title_shop_${i}`,
    name: titlesList[i] || `TITRE VIP #${i + 1}`,
    category: 'title',
    cost: 30 + i * 15,
    rarity,
    previewVal: titlesList[i] || `TITRE VIP #${i + 1}`,
    desc: `Titre prestigieux pour profil.`
  };
});

export const AVATAR_ICONS_SHOP: CosmeticItem[] = [
  { id: 'Zap', name: 'Éclair Néon ⚡', category: 'icon', cost: 0, rarity: 'commun', iconName: 'Zap' },
  { id: 'Crown', name: 'Couronne Impériale 👑', category: 'icon', cost: 40, rarity: 'rare', iconName: 'Crown' },
  { id: 'Gamepad2', name: 'Manette Arcade 🎮', category: 'icon', cost: 60, rarity: 'rare', iconName: 'Gamepad2' },
  { id: 'Rocket', name: 'Fusée Quantique 🚀', category: 'icon', cost: 80, rarity: 'epique', iconName: 'Rocket' },
  { id: 'Headphones', name: 'Casque Cyber 🎧', category: 'icon', cost: 100, rarity: 'epique', iconName: 'Headphones' },
  { id: 'Crosshair', name: 'Viseur Précision 🎯', category: 'icon', cost: 120, rarity: 'epique', iconName: 'Crosshair' },
  { id: 'Terminal', name: 'Console Hacker 💻', category: 'icon', cost: 140, rarity: 'legendaire', iconName: 'Terminal' },
  { id: 'Ghost', name: 'Fantôme Rétro 👻', category: 'icon', cost: 160, rarity: 'legendaire', iconName: 'Ghost' },
  { id: 'Skull', name: 'Crâne Cybernétique 💀', category: 'icon', cost: 180, rarity: 'mythique', iconName: 'Skull' },
  { id: 'Globe', name: 'Matrice Mondiale 🌐', category: 'icon', cost: 200, rarity: 'mythique', iconName: 'Globe' },
  { id: 'Trophy', name: 'Trophée d\'Or 🏆', category: 'icon', cost: 250, rarity: 'mythique', iconName: 'Trophy' },
  { id: 'Sparkles', name: 'Étoile Céleste ✨', category: 'icon', cost: 300, rarity: 'divin', iconName: 'Sparkles' },
  { id: 'Flame', name: 'Flamme Arpège 🔥', category: 'icon', cost: 350, rarity: 'divin', iconName: 'Flame' },
  { id: 'Shield', name: 'Bouclier Divin 🛡️', category: 'icon', cost: 400, rarity: 'divin', iconName: 'Shield' },
  { id: 'Sword', name: 'Épée Laser 🗡️', category: 'icon', cost: 450, rarity: 'divin', iconName: 'Sword' }
];

export const AVATAR_COLORS_SHOP: CosmeticItem[] = [
  { id: 'cyan', name: 'Cyan Néon', category: 'color', cost: 0, rarity: 'commun', colorHex: '#06b6d4' },
  { id: 'purple', name: 'Violet Quantique', category: 'color', cost: 30, rarity: 'commun', colorHex: '#a855f7' },
  { id: 'emerald', name: 'Vert Émeraude', category: 'color', cost: 40, rarity: 'rare', colorHex: '#10b981' },
  { id: 'yellow', name: 'Or Impérial', category: 'color', cost: 50, rarity: 'rare', colorHex: '#eab308' },
  { id: 'rose', name: 'Rose Fluo', category: 'color', cost: 60, rarity: 'epique', colorHex: '#f43f5e' },
  { id: 'blue', name: 'Bleu Abyssal', category: 'color', cost: 70, rarity: 'epique', colorHex: '#3b82f6' },
  { id: 'orange', name: 'Orange Solaire', category: 'color', cost: 80, rarity: 'epique', colorHex: '#f97316' },
  { id: 'lime', name: 'Vert Toxique', category: 'color', cost: 90, rarity: 'legendaire', colorHex: '#84cc16' },
  { id: 'fuchsia', name: 'Fuchsia Glitch', category: 'color', cost: 100, rarity: 'legendaire', colorHex: '#d946ef' },
  { id: 'sky', name: 'Glace Arctique', category: 'color', cost: 110, rarity: 'mythique', colorHex: '#38bdf8' },
  { id: 'red', name: 'Rouge Rubis', category: 'color', cost: 120, rarity: 'mythique', colorHex: '#ef4444' },
  { id: 'white', name: 'Lumière Pure', category: 'color', cost: 200, rarity: 'divin', colorHex: '#ffffff' }
];

export const FRAME_BORDERS_SHOP: CosmeticItem[] = Array.from({ length: 30 }, (_, i) => {
  const rarities: CosmeticRarity[] = ['commun', 'rare', 'epique', 'legendaire', 'mythique', 'divin'];
  const rarity = rarities[Math.floor(i / 5)] || 'divin';
  const names = [
    'Cadre Simple Cyan', 'Cadre Néon Pulsé', 'Cadre Hexagone Matrix', 'Cadre Doré Impérial', 'Cadre Rose Cyber',
    'Cadre Émeraude Laser', 'Cadre Feu Solaire', 'Cadre Glacier Cristal', 'Cadre Glitch Électrique', 'Cadre Vide Quantique',
    'Cadre Diamant Pur', 'Cadre Phoenix Ardent', 'Cadre VIP V2.0', 'Cadre Étoiles Célestes', 'Cadre Oméga Final',
    'Cadre Plaque Acier', 'Cadre Néon Violet', 'Cadre Rayon Plasma', 'Cadre Circuit Imprimé', 'Cadre Bouclier Divin',
    'Cadre Cyberpunk 2099', 'Cadre Retrowave Sunset', 'Cadre Supernova', 'Cadre Singularity', 'Cadre Champion S3',
    'Cadre Hacker Root', 'Cadre Laser Triple', 'Cadre Orbe Céleste', 'Cadre Couronne d\'Or', 'Cadre Divinité Absolue'
  ];
  return {
    id: `frame_${i}`,
    name: names[i] || `Cadre Néon #${i}`,
    category: 'frame',
    cost: 40 + i * 25,
    rarity,
    desc: `Encadrement animé pour votre photo de profil.`
  };
});

export const VICTORY_FX_SHOP: CosmeticItem[] = Array.from({ length: 50 }, (_, i) => {
  const rarities: CosmeticRarity[] = ['commun', 'rare', 'epique', 'legendaire', 'mythique', 'divin'];
  const rarity = rarities[Math.floor(i / 9)] || 'divin';
  const names = [
    'Explosion de Confettis', 'Pluie de Pixels Verts', 'Ondes de Choc Cyan', 'Étincelles Dorées', 'Surcharge Néon Fuchsia',
    'Feu d\'Artifice Quantique', 'Flocons de Neige Laser', 'Crâne de Victoire 💀', 'Pluie de Pièces d\'Or 🪙', 'Explosion de Roses 🌹',
    'Pluie d\'Étoiles Filantes 🌠', 'Éclairs Bleus Crépitants ⚡', 'Nuage de Fumée Violette 🌫️', 'Pétales de Cerisier 🌸', 'Onde de Plasma Rouge 🔴',
    'Poussière d\'Étoiles 💫', 'Orbes de Lumière 🔮', 'Lasers Multicolores 🌈', 'Pluie de Diamants 💎', 'Feu Solaire Ardent ☀️',
    'Cascades de Code Matrix 💻', 'Briques en Ruines 🧱', 'Billet de Banque Volants 💵', 'Supernova Incandescente 💥', 'Champ de Force Ailé 🦅',
    'Pétards Rétro 🧨', 'Éléments Chimiques Toxiques 🧪', 'Bulles de Savon Néon 🫧', 'Ailes d\'Ange Dorées 👼', 'Foudre Quantique ⚡',
    'Ondes Sonores Synthwave 🎵', 'Anneaux Saturniens 🪐', 'Gouttes de Mercure 💧', 'Fleurs de Lotus 🪷', 'Pluie de Cœurs Néon 💖',
    'Cristaux de Glace ❄️', 'Flammes Bleues Déferlantes 🔥', 'Portail Spatio-Temporel 🌀', 'Comètes Arpèges ☄️', 'Trophée Flottant 🏆',
    'Soleil Levant 🌅', 'Nébuleuse Indigo 🌌', 'Choc Électrique 100kV ⚡', 'Aura Arc-en-Ciel 🌈', 'Couronne d\'Honneur 👑',
    'Feux de Joie 🎆', 'Glace Pilée 🧊', 'Démarrage Système 💻', 'Drapeau d\'Arrivée 🏁', 'Célébration Ultima ✨'
  ];
  return {
    id: `fx_${i}`,
    name: names[i] || `Effet Victoire #${i}`,
    category: 'fx',
    cost: 50 + i * 20,
    rarity,
    desc: `Effet visuel de victoire spectaculaire lors des records.`
  };
});

export const COMPETITIVE_RANKS: CompetitiveRank[] = [
  {
    id: 'bronze_3',
    name: 'BRONZE III',
    frenchName: 'Bronze III 🥉',
    tier: 'bronze',
    division: 'III',
    minScore: 0,
    pixelReward: 100,
    titleReward: 'RECRUE DU NÉON',
    badgeColor: 'border-amber-700 bg-amber-950/80 text-amber-500',
    glowColor: 'shadow-[0_0_15px_rgba(180,83,9,0.5)]',
    icon: 'Shield',
    description: 'Premier échelon de la Saison 1 Compétitive. Jouez aux 3 épreuves de 60s pour accumuler des PTS de Rang !'
  },
  {
    id: 'bronze_2',
    name: 'BRONZE II',
    frenchName: 'Bronze II 🥉',
    tier: 'bronze',
    division: 'II',
    minScore: 150,
    pixelReward: 150,
    badgeColor: 'border-amber-600 bg-amber-950/90 text-amber-400',
    glowColor: 'shadow-[0_0_18px_rgba(217,119,6,0.5)]',
    icon: 'Shield',
    description: 'Vous commencez à maîtriser les épreuves de 60 secondes !'
  },
  {
    id: 'bronze_1',
    name: 'BRONZE I',
    frenchName: 'Bronze I 🥉',
    tier: 'bronze',
    division: 'I',
    minScore: 300,
    pixelReward: 200,
    titleReward: 'COMBATTANT BRONZE',
    badgeColor: 'border-amber-500 bg-amber-900/90 text-amber-300',
    glowColor: 'shadow-[0_0_20px_rgba(245,158,11,0.6)]',
    icon: 'Award',
    description: 'Dernier palier du rang Bronze ! L\'Argent est à portée de clic.'
  },
  {
    id: 'silver_3',
    name: 'ARGENT III',
    frenchName: 'Argent III 🥈',
    tier: 'silver',
    division: 'III',
    minScore: 500,
    pixelReward: 300,
    titleReward: 'CHAMPION DES ÉPREUVES',
    badgeColor: 'border-slate-400 bg-slate-900/90 text-slate-300',
    glowColor: 'shadow-[0_0_22px_rgba(203,213,225,0.6)]',
    icon: 'Award',
    description: 'Ligue d\'Argent débloquée ! Vos réflexes font la différence.'
  },
  {
    id: 'silver_1',
    name: 'ARGENT I',
    frenchName: 'Argent I 🥈',
    tier: 'silver',
    division: 'I',
    minScore: 900,
    pixelReward: 500,
    titleReward: 'SEIGNEUR D\'ARGENT',
    badgeColor: 'border-slate-200 bg-slate-700/90 text-white',
    glowColor: 'shadow-[0_0_28px_rgba(248,250,252,0.8)]',
    icon: 'Trophy',
    description: 'Sommet d\'Argent atteint. La ligue d\'Or vous attend !'
  },
  {
    id: 'gold_3',
    name: 'OR III',
    frenchName: 'Or III 🥇',
    tier: 'gold',
    division: 'III',
    minScore: 1400,
    pixelReward: 750,
    titleReward: 'MAÎTRE D\'OR 👑',
    badgeColor: 'border-yellow-500 bg-yellow-950/90 text-yellow-400',
    glowColor: 'shadow-[0_0_30px_rgba(234,179,8,0.75)]',
    icon: 'Crown',
    description: 'Rang d\'Or ! Seuls les compétiteurs réguliers s\'imposent ici.'
  },
  {
    id: 'gold_1',
    name: 'OR I',
    frenchName: 'Or I 🥇',
    tier: 'gold',
    division: 'I',
    minScore: 2000,
    pixelReward: 1000,
    titleReward: 'SOUVERAIN D\'OR 👑',
    badgeColor: 'border-yellow-400 bg-yellow-900/90 text-yellow-300',
    glowColor: 'shadow-[0_0_35px_rgba(250,204,21,0.85)]',
    icon: 'Crown',
    description: 'Domination absolue en Or. Prochaine étape : Platine !'
  },
  {
    id: 'platinum_1',
    name: 'PLATINE I',
    frenchName: 'Platine I 🏆',
    tier: 'platinum',
    division: 'I',
    minScore: 3000,
    pixelReward: 1500,
    titleReward: 'LÉGENDE DU PLATINE ⚡',
    badgeColor: 'border-cyan-300 bg-cyan-900/90 text-cyan-200',
    glowColor: 'shadow-[0_0_40px_rgba(103,232,249,0.9)]',
    icon: 'Trophy',
    description: 'Palier Platine d\'Élite. Vos scores de 60s font trembler les serveurs !'
  },
  {
    id: 'diamond_1',
    name: 'DIAMANT I',
    frenchName: 'Diamant 💎',
    tier: 'diamond',
    division: 'I',
    minScore: 4200,
    pixelReward: 2500,
    titleReward: 'MAÎTRE DIAMANT 🌌',
    badgeColor: 'border-fuchsia-400 bg-fuchsia-950/90 text-fuchsia-300',
    glowColor: 'shadow-[0_0_45px_rgba(217,70,239,0.95)]',
    icon: 'Sparkles',
    description: 'Rang Diamant. Une précision d\'exécution phénoménale !'
  },
  {
    id: 'master_apex',
    name: 'MAÎTRE VERTEX',
    frenchName: 'Maître Vertex 👑',
    tier: 'master',
    division: 'APEX',
    minScore: 5500,
    pixelReward: 5000,
    titleReward: 'DIVINITÉ DU CLASSÉ 🌌',
    badgeColor: 'border-rose-400 bg-rose-950/95 text-rose-200',
    glowColor: 'shadow-[0_0_50px_rgba(244,63,94,1)]',
    icon: 'Crown',
    description: 'MAÎTRE ABSOLU de la Saison 1 Compétitive.'
  },
  {
    id: 'celestial_god',
    name: 'CÉLESTE APEX',
    frenchName: 'Céleste Apex 🌟',
    tier: 'celestial',
    division: 'GODLIKE',
    minScore: 7500,
    pixelReward: 10000,
    titleReward: 'DIEU ULTIME DE L\'ARCADE ✨',
    badgeColor: 'border-amber-200 bg-amber-950/95 text-amber-200',
    glowColor: 'shadow-[0_0_60px_rgba(253,230,138,1)]',
    icon: 'Sparkles',
    description: 'RANG DIVIN LÉGENDAIRE. Le sommet de l\'univers Vertex Arcades !'
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = Array.from({ length: 100 }, (_, i) => {
  return {
    id: `ach${i + 1}`,
    title: `Succès #${i + 1}`,
    frenchTitle: i === 0 ? 'Premier Pixel' : i === 1 ? 'Pionnier du Clic' : i === 2 ? 'Roi de Simon' : `Succès #${i + 1}`,
    description: `Relevez le défi de l'arcade #${i + 1}`,
    frenchDescription: i === 0 ? 'Gagnez vos premiers pixels dans un jeu' : `Relevez le défi d'arcade #${i + 1}`,
    pixelReward: 50 + (i % 10) * 20,
    isUnlocked: false,
    icon: i % 2 === 0 ? 'Zap' : 'Trophy'
  };
});

export const INITIAL_QUESTS: Quest[] = [
  { id: 'q1', title: 'Première Surtension', description: 'Jouez à au moins 1 partie de mini-jeu', type: 'plays_total', target: 1, current: 0, rewardPixels: 100, rewardXp: 100, isCompleted: false, isClaimed: false },
  { id: 'q2', title: 'Explorateur du Néon', description: 'Jouez à 3 mini-jeux différents', type: 'plays_different', target: 3, current: 0, rewardPixels: 150, rewardXp: 150, isCompleted: false, isClaimed: false },
  { id: 'q3', title: 'Sprint du Clic', description: 'Atteignez 100 points dans Néon Clicker', type: 'score_specific', target: 100, current: 0, rewardPixels: 120, rewardXp: 120, isCompleted: false, isClaimed: false, gameId: 'clicker' },
  { id: 'q4', title: 'Reflex Master', description: 'Scorez au moins 30 points dans Vitesse Réflexe', type: 'score_specific', target: 30, current: 0, rewardPixels: 120, rewardXp: 120, isCompleted: false, isClaimed: false, gameId: 'reflex' },
  { id: 'q5', title: 'Cascade de Pixels', description: 'Cumulez 500 PX au total', type: 'pixels_earned', target: 500, current: 0, rewardPixels: 200, rewardXp: 200, isCompleted: false, isClaimed: false },
  { id: 'flash_1', title: '⚡ DÉFI FLASH : SURCHARGE 60s', description: 'Marquez 50 pts dans une épreuve classée', type: 'flash_score', target: 50, current: 0, rewardPixels: 300, rewardXp: 300, isCompleted: false, isClaimed: false, isFlash: true, multiplier: 2.5 },
  { id: 'flash_2', title: '⚡ DÉFI FLASH : ROUE DU DESTIN', description: 'Tournez la Roue de la Fortune aujourd\'hui', type: 'spin_wheel', target: 1, current: 0, rewardPixels: 250, rewardXp: 250, isCompleted: false, isClaimed: false, isFlash: true, multiplier: 2.0 }
];

export const QUEST_POOL: Quest[] = [
  ...INITIAL_QUESTS,
  { id: 'q11', title: 'Session Marathon', description: 'Jouez à 8 parties au total', type: 'plays_total', target: 8, current: 0, rewardPixels: 250, rewardXp: 250, isCompleted: false, isClaimed: false },
  { id: 'q12', title: 'Fortune du Pixel', description: 'Gagnez un total de 1000 PX', type: 'pixels_earned', target: 1000, current: 0, rewardPixels: 300, rewardXp: 300, isCompleted: false, isClaimed: false }
];

export const PASS_LEVELS: PassLevel[] = Array.from({ length: 100 }, (_, i) => {
  const lvl = i + 1;
  let freeReward: PassLevelReward = { type: 'pixels', value: 150 + lvl * 40, label: `+${150 + lvl * 40} PX` };
  let premiumReward: PassLevelReward = { type: 'pixels', value: 300 + lvl * 60, label: `+${300 + lvl * 60} PX` };

  if (lvl === 2) freeReward = { type: 'title', value: 'RECRUE SAISON 3 🚀', label: 'Titre: Recrue Saison 3' };
  if (lvl === 5) premiumReward = { type: 'title', value: 'COMMANDANT HORIZON ⚡', label: 'Titre: Commandant Horizon' };
  if (lvl === 10) premiumReward = { type: 'skin', value: 'cyberpunk_2099', label: 'Châssis Cyberpunk 2099 ⚡' };
  if (lvl === 20) premiumReward = { type: 'skin', value: 'neon_synthwave', label: 'Châssis Synthwave 🌇' };
  if (lvl === 50) premiumReward = { type: 'skin', value: 'supernova', label: 'Châssis Supernova 💥' };
  if (lvl === 100) {
    freeReward = { type: 'title', value: 'MAÎTRE SAISON 3 SUPRÊME 👑', label: 'Titre: Maître S3 Suprême' };
    premiumReward = { type: 'aura', value: 'omega_core', label: 'Aura Noyau Oméga 🔮' };
  }

  return { level: lvl, freeReward, premiumReward };
});

export const PRO_PASS_LEVELS: PassLevel[] = Array.from({ length: 50 }, (_, i) => {
  const lvl = i + 1;
  return {
    level: lvl,
    freeReward: { type: 'rp', value: 50 + lvl * 20, label: `+${50 + lvl * 20} RP` },
    premiumReward: { type: 'key', value: 1, label: `1x Clé d'Or 🔑` }
  };
});

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 'tourney_reflex',
    title: 'Grand Prix Réflexe Néon ⚡',
    frenchTitle: 'Grand Prix Réflexe Néon ⚡',
    gameId: 'reflex',
    gameName: 'Vitesse Réflexe',
    description: 'Touchez les cibles néon et dépassez l\'objectif de 1 200 pts pour décrocher la victoire !',
    targetScore: 1200,
    unit: 'pts',
    prizePool: 10000,
    titleReward: 'CHAMPION RÉFLEXE ⚡',
    endsInDays: 2,
    status: 'active',
    participantsCount: 1420,
    leaderboard: [
      { rank: 1, username: 'CyberNinja_99', avatarColor: '#ec4899', avatarIcon: 'Zap', score: 1150 },
      { rank: 2, username: 'PixelGod_X', avatarColor: '#3b82f6', avatarIcon: 'Crown', score: 1020 }
    ]
  }
];
