import { GameData, Quest, Achievement, PassLevel, PassLevelReward, Tournament, CompetitiveRank, RankQuest } from './types';

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
    id: 'reflex',
    name: 'Reflex Speed Tap',
    frenchName: 'Vitesse Réflexe',
    description: 'Ultra-simplifié ! Cliquez sur les nodes néon géantes sans stress. Vous avez 10 vies et 60 secondes !',
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
    id: 'stacker',
    name: 'Stacker Arcade',
    frenchName: 'Stacker',
    description: 'Empilez des blocs qui oscillent de gauche à droite. Soyez parfaitement synchronisé pour atteindre le sommet !',
    icon: 'Layers',
    category: 'arcade',
    difficulty: 'medium',
    color: 'text-purple-400 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-purple-950/20 hover:border-purple-400',
    rarity: 'rare'
  },
  {
    id: 'catch',
    name: 'Color Catch',
    frenchName: 'Color Catch',
    description: 'Des orbes de couleur tombent du ciel. Alignez la couleur de votre réceptacle pour marquer des points !',
    icon: 'Shield',
    category: 'reflex',
    difficulty: 'hard',
    color: 'text-yellow-400 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)] bg-yellow-950/20 hover:border-yellow-400',
    rarity: 'epique'
  },
  {
    id: 'binary',
    name: 'Binary Cipher',
    frenchName: 'Déchiffreur Binaire',
    description: 'Résolvez des énigmes en convertissant des nombres binaires en décimal. Un compte à rebours de 5 secondes !',
    icon: 'Cpu',
    category: 'puzzle',
    difficulty: 'hard',
    color: 'text-cyan-400 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-950/20 hover:border-cyan-400',
    rarity: 'rare'
  },
  {
    id: 'tictactoe',
    name: 'Neon Tic-Tac-Toe',
    frenchName: 'Morpion Néon',
    description: 'Affrontez l\'Intelligence Artificielle "VERTEX-9000" dans un duel classique de Morpion rétro-lumineux.',
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
    id: 'gridmemory',
    name: 'Matrix Memory',
    frenchName: 'Matrice Mémoire',
    description: 'Retenez le motif de tuiles qui s\'allument sur une grille de 4x4, puis reproduisez-le de mémoire.',
    icon: 'Grid3X3',
    category: 'memory',
    difficulty: 'medium',
    color: 'text-purple-400 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-purple-950/20 hover:border-purple-400',
    rarity: 'rare'
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
    id: 'meteor',
    name: 'Meteor Storm',
    frenchName: 'Tempête Météore',
    description: 'Une pluie de météores s\'abat sur votre secteur. Esquivez-les ou pulvérisez-les à coups de laser !',
    icon: 'Sparkles',
    category: 'reflex',
    difficulty: 'hard',
    color: 'text-amber-400 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] bg-amber-950/20 hover:border-amber-400',
    rarity: 'epique'
  },
  {
    id: 'flappy',
    name: 'Neon Flappy',
    frenchName: 'Néon Flappy',
    description: 'Sauter au bon moment pour faire passer votre drone à travers les portails d\'énergie instables.',
    icon: 'Navigation',
    category: 'arcade',
    difficulty: 'medium',
    color: 'text-amber-400 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] bg-amber-950/20 hover:border-amber-400',
    rarity: 'rare'
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
    description: 'Arrêtez le rotor laser de piratage précisément au niveau des segments de code lumineux pour forcer le coffre.',
    icon: 'Key',
    category: 'puzzle',
    difficulty: 'mythic',
    color: 'text-yellow-400 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)] bg-yellow-950/30 hover:border-yellow-400',
    rarity: 'mythique'
  },
  {
    id: 'bubble',
    name: 'Neon Bubble Pop',
    frenchName: 'Éclate-Nodes',
    description: 'Éclatez les orbes de données bleues qui s\'élèvent, mais évitez à tout prix les charges électriques rouges.',
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
    description: 'Retournez les cartes de la matrice cybernétique pour retrouver toutes les paires identiques avant le temps imparti.',
    icon: 'Grid',
    category: 'memory',
    difficulty: 'easy',
    color: 'text-purple-400 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] bg-purple-950/20 hover:border-purple-400',
    rarity: 'commun'
  },
  {
    id: 'target',
    name: 'Neon Target',
    frenchName: 'Cible Néon',
    description: 'Un curseur oscille sur une jauge. Cliquez pile au centre dans la zone de surcharge critique pour marquer !',
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
    description: 'Duel d\'arcade 1v1 contre l\'I.A. Renvoyez la balle électrisée avec votre raquette néon et accumulez les PX !',
    icon: 'Shield',
    category: 'arcade',
    difficulty: 'medium',
    color: 'text-cyan-400 border-cyan-500 shadow-[0_0_18px_rgba(6,182,212,0.4)] bg-cyan-950/20 hover:border-cyan-400',
    rarity: 'rare'
  },
  {
    id: 'laserdodge',
    name: 'Laser Dodge',
    frenchName: 'Esquive Laser',
    description: 'Pilotez votre vaisseau néon et esquivez des grilles laser meurtrières tout en capturant des orbes d\'énergie !',
    icon: 'Sparkles',
    category: 'reflex',
    difficulty: 'mythic',
    color: 'text-fuchsia-400 border-fuchsia-500 shadow-[0_0_25px_rgba(217,70,239,0.6)] bg-fuchsia-950/30 hover:border-fuchsia-400',
    rarity: 'mythique'
  },
  {
    id: 'runner',
    name: 'Neon Runner',
    frenchName: 'Course Néon Cyber',
    description: 'Foncez sur une grille cyberpunk en sautant et double-sautant par-dessus les barrières et drones néon !',
    icon: 'Flame',
    category: 'arcade',
    difficulty: 'hard',
    color: 'text-amber-400 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)] bg-amber-950/30 hover:border-amber-400',
    rarity: 'epique'
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
    rarity: 'epique'
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
    rarity: 'epique'
  },
  {
    id: 'maze',
    name: 'Neon Maze',
    frenchName: 'Labyrinthe Néon',
    description: 'Frayez-vous un chemin dans la matrice labyrinthe, récoltez les puces de données et fuyez avant le délai !',
    icon: 'Compass',
    category: 'puzzle',
    difficulty: 'medium',
    color: 'text-emerald-400 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] bg-emerald-950/30 hover:border-emerald-400',
    rarity: 'rare'
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
    id: 'codebreaker',
    name: 'Matrix Code Breaker',
    frenchName: 'Piratage de Code',
    description: 'Mastermind cyberpunk : déchiffrez la combinaison secrète de 4 chiffres en analysant les indices de sécurité !',
    icon: 'Key',
    category: 'puzzle',
    difficulty: 'mythic',
    color: 'text-green-400 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)] bg-green-950/30 hover:border-green-400',
    rarity: 'mythique'
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
    description: 'Guidez votre grenouille néon à travers des voies de circulation rapides d\'hovercars et de rivières plasma !',
    icon: 'Compass',
    category: 'reflex',
    difficulty: 'medium',
    color: 'text-emerald-400 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] bg-emerald-950/30 hover:border-emerald-400',
    rarity: 'rare'
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
    id: 'colorswitch',
    name: 'Neon Color Switch',
    frenchName: 'Color Switch Néon',
    description: 'Faites reboondir la bille à travers des anneaux rotatifs en respectant scrupuleusement la couleur actuelle !',
    icon: 'Shield',
    category: 'reflex',
    difficulty: 'hard',
    color: 'text-yellow-400 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)] bg-yellow-950/30 hover:border-yellow-400',
    rarity: 'epique'
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
    rarity: 'epique'
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
    rarity: 'mythique'
  }
];

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
  colorPreview: string; // CSS hex/gradient representation for shop square
}

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
    colorPreview: '#06b6d4'
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
    colorPreview: '#eab308'
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
    colorPreview: '#10b981'
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
    colorPreview: '#f97316'
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
    colorPreview: '#22c55e'
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
    colorPreview: '#d946ef'
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
    colorPreview: '#ec4899'
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
    colorPreview: '#a855f7'
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
    colorPreview: '#facc15'
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
    colorPreview: '#38bdf8'
  },
  // 4 NEW THEMES
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
    colorPreview: '#facc15'
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
    colorPreview: '#ec4899'
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
    colorPreview: '#ef4444'
  }
];

export const AURA_COSMETICS = [
  { id: 'none', name: 'Aucune Aura 📭', desc: 'Style sobre sans projection d\'énergie.', cost: 0, glowClass: 'border-slate-800' },
  { id: 'fire', name: 'Aura Solaire 🔥', desc: 'Halo d\'énergie plasma ardent en crépitement permanent.', cost: 100, glowClass: 'border-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.9)] ring-2 ring-orange-500/50 animate-pulse' },
  { id: 'cyber', name: 'Aura Hologramme 💎', desc: 'Ondes néon cyan laser avec pulsation quantique.', cost: 150, glowClass: 'border-cyan-400 border-dashed shadow-[0_0_30px_rgba(6,182,212,0.95)] ring-2 ring-cyan-400/60 animate-[pulse_2s_infinite]' },
  { id: 'quantum', name: 'Aura Shifting 🌀', desc: 'Distorsion de flux temporel violet et fuchsia ultra brillant.', cost: 200, glowClass: 'border-purple-500 shadow-[0_0_35px_rgba(168,85,247,0.95)] ring-2 ring-purple-500/60 animate-bounce-slow' },
  { id: 'rainbow', name: 'Aura Royale 👑', desc: 'Halo doré impérial étincelant, réservé aux seigneurs de l\'arcade.', cost: 300, glowClass: 'border-yellow-400 shadow-[0_0_40px_rgba(253,224,71,1)] ring-4 ring-yellow-400/70 animate-pulse' },
  { id: 'matrix', name: 'Aura Matrix Émeraude 💻', desc: 'Champ de force vert binaire tiré du code source de l\'Arcade.', cost: 250, glowClass: 'border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.9)] ring-2 ring-emerald-400/60 animate-pulse' },
  { id: 'plasma', name: 'Aura Rose Néon 💖', desc: 'Impulsions plasma rose électrique à haute intensité.', cost: 280, glowClass: 'border-rose-400 shadow-[0_0_35px_rgba(244,63,94,0.95)] ring-2 ring-rose-400/60 animate-pulse' },
  { id: 'nebula', name: 'Aura Nébuleuse 🌌', desc: 'Nuage cosmique indigo aux scintillements stellaires.', cost: 350, glowClass: 'border-indigo-400 shadow-[0_0_35px_rgba(129,140,248,0.95)] ring-2 ring-indigo-400/60 animate-pulse' },
  { id: 'ice_shield', name: 'Aura Bouclier Glacial ❄️', desc: 'Cristaux de glace néon flottant en orbite protectrice.', cost: 400, glowClass: 'border-sky-300 shadow-[0_0_35px_rgba(125,211,252,0.9)] ring-2 ring-sky-300/60 animate-pulse' },
  { id: 'magma', name: 'Aura Magmatique 🌋', desc: 'Éruptions de lave brillante et étincelles incandescendantes.', cost: 450, glowClass: 'border-red-600 shadow-[0_0_35px_rgba(220,38,38,0.95)] ring-2 ring-red-600/70 animate-pulse' },
  { id: 'hyperdrive', name: 'Aura Hyperdrive 🚀', desc: 'Ondes de distorsion supraluminiques autour de la silhouette.', cost: 500, glowClass: 'border-amber-300 shadow-[0_0_40px_rgba(252,211,77,1)] ring-2 ring-amber-300/80 animate-ping' },
  { id: 'toxic', name: 'Aura Toxique Fluo ☣️', desc: 'Brumes de poison vert acide néon ultra lumineuses.', cost: 400, glowClass: 'border-lime-400 shadow-[0_0_35px_rgba(163,230,53,0.9)] ring-2 ring-lime-400/60 animate-pulse' },
  { id: 'phoenix', name: 'Aura Phoenix Rétro 🦅', desc: 'Ailes d\'énergie dorée étincelante renaissant des cendres.', cost: 600, glowClass: 'border-orange-400 shadow-[0_0_40px_rgba(251,146,60,1)] ring-4 ring-orange-400/70 animate-pulse' },
  { id: 'void_eye', name: 'Aura Oeil du Néant 👁️', desc: 'Trou noir miniature dévorant la lumière ambiante.', cost: 650, glowClass: 'border-purple-800 shadow-[0_0_40px_rgba(107,33,168,1)] ring-4 ring-purple-600/80 animate-pulse' },
  { id: 'lightning', name: 'Aura Éclair Quantique ⚡', desc: 'Arcs électriques bleus crépitant à haute fréquence.', cost: 550, glowClass: 'border-blue-400 shadow-[0_0_35px_rgba(96,165,250,1)] ring-2 ring-blue-400/70 animate-pulse' },
  { id: 'synth_glow', name: 'Aura Synthwave 80s 🌇', desc: 'Dégradé fuchsia et cyan aux accents rétro nostalgiques.', cost: 500, glowClass: 'border-fuchsia-400 shadow-[0_0_35px_rgba(232,121,249,1)] ring-2 ring-cyan-400/70 animate-pulse' },
  { id: 'godlike', name: 'Aura Divinité Arcane ✨', desc: 'Rayons de lumière divine transcendant l\'espace virtuel.', cost: 800, glowClass: 'border-yellow-200 shadow-[0_0_50px_rgba(254,240,138,1)] ring-4 ring-yellow-300/80 animate-pulse' },
  { id: 'cyber_glitch', name: 'Aura Glitch Cybernétique 👾', desc: 'Effet de décalage vidéo rétro et particules de pixels cassés.', cost: 550, glowClass: 'border-teal-400 shadow-[0_0_35px_rgba(45,212,191,0.9)] ring-2 ring-pink-500/60 animate-pulse' },
  { id: 'shadow_ninja', name: 'Aura Ombre de Ninjutsu 🥷', desc: 'Voile d\'ombre fumante violette pour les maîtres du score.', cost: 600, glowClass: 'border-slate-400 shadow-[0_0_35px_rgba(148,163,184,0.9)] ring-2 ring-purple-900/80 animate-pulse' },
  { id: 'atomic', name: 'Aura Atome Néon ⚛️', desc: 'Électrons en orbite tournoyant autour de la cible à vitesse folle.', cost: 700, glowClass: 'border-cyan-300 shadow-[0_0_40px_rgba(103,232,249,1)] ring-4 ring-cyan-400/70 animate-spin-slow' },
  { id: 'starlight', name: 'Aura Étoile du Matin 🌟', desc: 'Inondation d\'étincelles d\'or denses et scintillantes.', cost: 750, glowClass: 'border-amber-200 shadow-[0_0_45px_rgba(253,230,138,1)] ring-4 ring-amber-300/80 animate-pulse' },
  { id: 'omega_core', name: 'Aura Noyau Oméga 🔮', desc: 'Sphere d\'énergie d\'annihilation absolue tirée du futur.', cost: 900, glowClass: 'border-rose-500 shadow-[0_0_50px_rgba(244,63,94,1)] ring-4 ring-purple-500/90 animate-pulse' }
];

export const TITLE_BANNERS = [
  { id: 'banner_neon', name: 'Bannière Néon Cyber', cost: 0, gradient: 'bg-cyan-900' },
  { id: 'banner_sunset', name: 'Bannière Coucher Retrowave 🌅', cost: 80, gradient: 'bg-rose-900' },
  { id: 'banner_matrix', name: 'Bannière Pluie Matrix 💻', cost: 120, gradient: 'bg-emerald-900' },
  { id: 'banner_solar', name: 'Bannière Éruption Solaire ☀️', cost: 180, gradient: 'bg-orange-900' },
  { id: 'banner_cosmic', name: 'Bannière Nébuleuse Quantique 🌌', cost: 250, gradient: 'bg-purple-900' },
  { id: 'banner_gold', name: 'Bannière Impériale d\'Or 👑', cost: 350, gradient: 'bg-yellow-900' },
  { id: 'banner_cyberpunk', name: 'Bannière Cyberpunk 2099 ⚡', cost: 220, gradient: 'bg-fuchsia-900' },
  { id: 'banner_glacier', name: 'Bannière Glacier Céleste ❄️', cost: 200, gradient: 'bg-sky-900' },
  { id: 'banner_volcano', name: 'Bannière Magma Ardent 🌋', cost: 300, gradient: 'bg-red-900' },
  { id: 'banner_emerald', name: 'Bannière Émeraude Royale 💎', cost: 280, gradient: 'bg-teal-900' },
  { id: 'banner_void', name: 'Bannière Trou Noir Absolu 🌑', cost: 320, gradient: 'bg-slate-900' },
  { id: 'banner_synth', name: 'Bannière Neon Synth 80s 🌇', cost: 160, gradient: 'bg-pink-900' },
  { id: 'banner_toxic', name: 'Bannière Fusion Toxique ☣️', cost: 220, gradient: 'bg-lime-900' },
  { id: 'banner_phoenix', name: 'Bannière Ailes de Phoenix 🦅', cost: 400, gradient: 'bg-amber-900' },
  { id: 'banner_galaxy', name: 'Bannière Voie Lactée 🌠', cost: 300, gradient: 'bg-indigo-900' },
  { id: 'banner_atomic', name: 'Bannière Réacteur Atomique ⚛️', cost: 350, gradient: 'bg-cyan-950' },
  { id: 'banner_blood', name: 'Bannière Lune de Sang 🩸', cost: 380, gradient: 'bg-red-950' },
  { id: 'banner_aurora', name: 'Bannière Aurore Boréale 🌌', cost: 260, gradient: 'bg-emerald-950' },
  { id: 'banner_golden_god', name: 'Bannière Divinité d\'Or 🌟', cost: 500, gradient: 'bg-yellow-950' },
  { id: 'banner_quantum_grid', name: 'Bannière Grille Quantique 🧬', cost: 420, gradient: 'bg-fuchsia-950' },
  { id: 'banner_ultimate', name: 'Bannière Maître de l\'Arcade 🏆', cost: 600, gradient: 'bg-rose-950' }
];

export const SHOP_TITLES = [
  { id: 'title_novice', title: 'APPRENTI DU NÉON', cost: 50 },
  { id: 'title_pro', title: 'PRO D\'ARCADE 🎮', cost: 100 },
  { id: 'title_hacker', title: 'HACKER QUANTIQUE 💻', cost: 120 },
  { id: 'title_speed', title: 'DÉMON DE VITESSE ⚡', cost: 150 },
  { id: 'title_legend', title: 'LÉGENDE VIVANTE 👑', cost: 250 },
  { id: 'title_god', title: 'DIEU DU PIXEL 🌌', cost: 400 },
  { id: 'title_sprint', title: 'SEIGNEUR DU SPRINT 🏃', cost: 100 },
  { id: 'title_pinball', title: 'MAÎTRE DU PINBALL 🎯', cost: 140 },
  { id: 'title_hyperspace', title: 'LÉGENDE HYPERSPACE 🚀', cost: 180 },
  { id: 'title_architect', title: 'CYBER ARCHITECTE 📐', cost: 200 },
  { id: 'title_unbeatable', title: 'INCAPABLE DE PERDRE 🛡️', cost: 220 },
  { id: 'title_extreme_hacker', title: 'HACKER DE L\'EXTRÊME 👾', cost: 250 },
  { id: 'title_king_comp', title: 'ROI DES COMPÉTITIONS 🏆', cost: 300 },
  { id: 'title_overclock', title: 'OVERCLOCKER SUPRÊME ⚡', cost: 320 },
  { id: 'title_rhythm', title: 'MAÎTRE DU RYTHME 🎵', cost: 160 },
  { id: 'title_maze_runner', title: 'PIRATE DU LABYRINTHE 🧭', cost: 180 },
  { id: 'title_gravity', title: 'DOMPTEUR DE GRAVITÉ 🌀', cost: 220 },
  { id: 'title_codebreaker', title: 'BRISEUR DE CODES 🔓', cost: 280 },
  { id: 'title_pixel_millionaire', title: 'MILLIONNAIRE EN PIXELS 💰', cost: 350 },
  { id: 'title_retro_king', title: 'MONARQUE DU RÉTRO 👑', cost: 380 },
  { id: 'title_singularity', title: 'SINGULARITÉ ULTIME 🌌', cost: 500 }
];

export const AVATAR_ICONS_SHOP = [
  { id: 'Zap', name: 'Éclair Néon ⚡', cost: 0 },
  { id: 'Crown', name: 'Couronne Impériale 👑', cost: 40 },
  { id: 'Gamepad2', name: 'Manette Arcade 🎮', cost: 60 },
  { id: 'Rocket', name: 'Fusée Quantique 🚀', cost: 80 },
  { id: 'Headphones', name: 'Casque Cyber 🎧', cost: 100 },
  { id: 'Crosshair', name: 'Viseur Précision 🎯', cost: 120 },
  { id: 'Terminal', name: 'Console Hacker 💻', cost: 140 },
  { id: 'Ghost', name: 'Fantôme Rétro 👻', cost: 160 },
  { id: 'Skull', name: 'Crâne Cybernétique 💀', cost: 180 },
  { id: 'Globe', name: 'Matrice Mondiale 🌐', cost: 200 }
];

export const AVATAR_COLORS_SHOP = [
  { id: 'cyan', name: 'Cyan Néon', hex: '#06b6d4', cost: 0 },
  { id: 'purple', name: 'Violet Quantique', hex: '#a855f7', cost: 30 },
  { id: 'emerald', name: 'Vert Émeraude', hex: '#10b981', cost: 40 },
  { id: 'yellow', name: 'Or Impérial', hex: '#eab308', cost: 50 },
  { id: 'rose', name: 'Rose Fluo', hex: '#f43f5e', cost: 60 },
  { id: 'blue', name: 'Bleu Abyssal', hex: '#3b82f6', cost: 70 },
  { id: 'orange', name: 'Orange Solaire', hex: '#f97316', cost: 80 },
  { id: 'lime', name: 'Vert Toxique', hex: '#84cc16', cost: 90 },
  { id: 'fuchsia', name: 'Fuchsia Glitch', hex: '#d946ef', cost: 100 },
  { id: 'sky', name: 'Glace Arctique', hex: '#38bdf8', cost: 110 },
  { id: 'red', name: 'Rouge Rubis', hex: '#ef4444', cost: 120 },
  { id: 'indigo', name: 'Indigo Profond', hex: '#6366f1', cost: 130 },
  { id: 'teal', name: 'Turquoise Vif', hex: '#14b8a6', cost: 140 },
  { id: 'amber', name: 'Ambre Ardent', hex: '#f59e0b', cost: 150 },
  { id: 'white', name: 'Lumière Pure', hex: '#ffffff', cost: 200 }
];

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
    description: 'Niveau initial. Accomplissez des Quêtes de Rang pour accumuler des PTS de Rang et gravir les échelons !',
    perkText: '+2% de gain de Pixels',
    bonusMultiplier: 1.02
  },
  {
    id: 'bronze_2',
    name: 'BRONZE II',
    frenchName: 'Bronze II 🥉',
    tier: 'bronze',
    division: 'II',
    minScore: 100,
    pixelReward: 150,
    badgeColor: 'border-amber-600 bg-amber-950/90 text-amber-400',
    glowColor: 'shadow-[0_0_18px_rgba(217,119,6,0.5)]',
    icon: 'Shield',
    description: 'Premiers pas réussis. Vous commencez à maîtriser les mécaniques d\'arcade !',
    perkText: '+4% de gain de Pixels',
    bonusMultiplier: 1.04
  },
  {
    id: 'bronze_1',
    name: 'BRONZE I',
    frenchName: 'Bronze I 🥉',
    tier: 'bronze',
    division: 'I',
    minScore: 250,
    pixelReward: 200,
    titleReward: 'COMBATTANT BRONZE',
    badgeColor: 'border-amber-500 bg-amber-900/90 text-amber-300',
    glowColor: 'shadow-[0_0_20px_rgba(245,158,11,0.6)]',
    icon: 'Award',
    description: 'Dernier palier du rang Bronze ! La ligue d\'Argent est à portée de clic.',
    perkText: '+6% de gain de Pixels',
    bonusMultiplier: 1.06
  },
  {
    id: 'silver_3',
    name: 'ARGENT III',
    frenchName: 'Argent III 🥈',
    tier: 'silver',
    division: 'III',
    minScore: 450,
    pixelReward: 300,
    titleReward: 'SUDO HACKER',
    badgeColor: 'border-slate-400 bg-slate-900/90 text-slate-300',
    glowColor: 'shadow-[0_0_22px_rgba(203,213,225,0.6)]',
    icon: 'Award',
    description: 'Accès au rang Argent. Vos réflexes et votre précision font la différence !',
    perkText: '+8% de gain de Pixels',
    bonusMultiplier: 1.08
  },
  {
    id: 'silver_2',
    name: 'ARGENT II',
    frenchName: 'Argent II 🥈',
    tier: 'silver',
    division: 'II',
    minScore: 700,
    pixelReward: 400,
    badgeColor: 'border-slate-300 bg-slate-800/90 text-slate-200',
    glowColor: 'shadow-[0_0_25px_rgba(226,232,240,0.7)]',
    icon: 'Award',
    description: 'Performances régulières. Vous vous frayez un chemin vers le sommet !',
    perkText: '+10% de gain de Pixels',
    bonusMultiplier: 1.10
  },
  {
    id: 'silver_1',
    name: 'ARGENT I',
    frenchName: 'Argent I 🥈',
    tier: 'silver',
    division: 'I',
    minScore: 1000,
    pixelReward: 500,
    titleReward: 'CHAMPION D\'ARGENT',
    badgeColor: 'border-slate-200 bg-slate-700/90 text-white',
    glowColor: 'shadow-[0_0_28px_rgba(248,250,252,0.8)]',
    icon: 'Trophy',
    description: 'Niveau Élite Argent. L\'élite du rang Or vous ouvre grand ses portes.',
    perkText: '+12% de gain de Pixels',
    bonusMultiplier: 1.12
  },
  {
    id: 'gold_3',
    name: 'OR III',
    frenchName: 'Or III 🥇',
    tier: 'gold',
    division: 'III',
    minScore: 1400,
    pixelReward: 650,
    titleReward: 'MAÎTRE D\'OR 👑',
    badgeColor: 'border-yellow-500 bg-yellow-950/90 text-yellow-400',
    glowColor: 'shadow-[0_0_30px_rgba(234,179,8,0.75)]',
    icon: 'Crown',
    description: 'Palier d\'Or atteint ! Vous faites désormais partie des meilleurs joueurs compétitifs.',
    perkText: '+15% de gain de Pixels',
    bonusMultiplier: 1.15
  },
  {
    id: 'gold_1',
    name: 'OR I',
    frenchName: 'Or I 🥇',
    tier: 'gold',
    division: 'I',
    minScore: 1900,
    pixelReward: 850,
    titleReward: 'SOUVERAIN D\'OR 👑',
    badgeColor: 'border-yellow-400 bg-yellow-900/90 text-yellow-300',
    glowColor: 'shadow-[0_0_35px_rgba(250,204,21,0.85)]',
    icon: 'Crown',
    description: 'Domination absolue au niveau Or. Préparez-vous à entrer en Platine !',
    perkText: '+18% de gain de Pixels',
    bonusMultiplier: 1.18
  },
  {
    id: 'platinum_3',
    name: 'PLATINE III',
    frenchName: 'Platine III 🏆',
    tier: 'platinum',
    division: 'III',
    minScore: 2500,
    pixelReward: 1200,
    titleReward: 'CYBER LÉGENDE ⚡',
    badgeColor: 'border-cyan-400 bg-cyan-950/90 text-cyan-300',
    glowColor: 'shadow-[0_0_35px_rgba(6,182,212,0.85)]',
    icon: 'Trophy',
    description: 'Entrée dans le rang Platine. Seuls les joueurs ultra aiguisés y parviennent !',
    perkText: '+22% de gain de Pixels',
    bonusMultiplier: 1.22
  },
  {
    id: 'platinum_1',
    name: 'PLATINE I',
    frenchName: 'Platine I 🏆',
    tier: 'platinum',
    division: 'I',
    minScore: 3200,
    pixelReward: 1600,
    titleReward: 'SEIGNEUR DU PLATINE ⚡',
    badgeColor: 'border-cyan-300 bg-cyan-900/90 text-cyan-200',
    glowColor: 'shadow-[0_0_40px_rgba(103,232,249,0.9)]',
    icon: 'Trophy',
    description: 'Sommet du niveau Platine. Le rang Diamant et ses distinctions vous attendent !',
    perkText: '+26% de gain de Pixels',
    bonusMultiplier: 1.26
  },
  {
    id: 'diamond_1',
    name: 'DIAMANT I',
    frenchName: 'Diamant 💎',
    tier: 'diamond',
    division: 'I',
    minScore: 4000,
    pixelReward: 2500,
    titleReward: 'MAÎTRE DIAMANT 🌌',
    badgeColor: 'border-fuchsia-400 bg-fuchsia-950/90 text-fuchsia-300',
    glowColor: 'shadow-[0_0_45px_rgba(217,70,239,0.95)]',
    icon: 'Sparkles',
    description: 'Rang d\'élite Diamant. Un score monumental réservé aux virtuoses des mini-jeux !',
    perkText: '+32% de gain de Pixels',
    bonusMultiplier: 1.32
  },
  {
    id: 'master_apex',
    name: 'MAÎTRE VERTEX',
    frenchName: 'Maître Vertex 👑',
    tier: 'master',
    division: 'APEX',
    minScore: 5000,
    pixelReward: 5000,
    titleReward: 'DIVINITÉ DE L\'ARCADE 🌌',
    badgeColor: 'border-rose-400 bg-rose-950/95 text-rose-200',
    glowColor: 'shadow-[0_0_50px_rgba(244,63,94,1)]',
    icon: 'Crown',
    description: 'LE RANG SUPRÊME. Vous avez conquis la totalité des mini-jeux d\'Arcade Vertex !',
    perkText: '+50% de gain de Pixels (MAX)',
    bonusMultiplier: 1.50
  }
];

export const RANK_QUESTS: RankQuest[] = [
  { id: 'rq_1', title: 'Premiers Pas en Arcade', description: 'Jouez à au moins 1 mini-jeu', type: 'plays_total', target: 1, rewardRankPts: 50, rewardPixels: 100 },
  { id: 'rq_2', title: 'Explorateur d\'Arcade', description: 'Jouez à au moins 5 parties de mini-jeux', type: 'plays_total', target: 5, rewardRankPts: 100, rewardPixels: 150 },
  { id: 'rq_3', title: 'Cliquer sans Fin', description: 'Scorez au moins 100 points dans Néon Clicker', type: 'highscore', target: 100, gameId: 'clicker', rewardRankPts: 100, rewardPixels: 150 },
  { id: 'rq_4', title: 'Reflexes de Choc', description: 'Scorez au moins 20 points dans Vitesse Réflexe', type: 'highscore', target: 20, gameId: 'reflex', rewardRankPts: 100, rewardPixels: 150 },
  { id: 'rq_5', title: 'Mémoire Flash', description: 'Atteignez une séquence de 5 dans Simon Mémorisation', type: 'highscore', target: 5, gameId: 'simon', rewardRankPts: 100, rewardPixels: 150 },
  { id: 'rq_6', title: 'As des Cartes', description: 'Scorez au moins 10 points dans Cartes Mémoire', type: 'highscore', target: 10, gameId: 'memory', rewardRankPts: 100, rewardPixels: 150 },
  { id: 'rq_7', title: 'Pilote du Serpent', description: 'Marquez au moins 10 points dans Néon Snake', type: 'highscore', target: 10, gameId: 'snake', rewardRankPts: 120, rewardPixels: 200 },
  { id: 'rq_8', title: 'As de l\'Espace', description: 'Marquez au moins 50 points dans Space Shooter', type: 'highscore', target: 50, gameId: 'spaceinva', rewardRankPts: 120, rewardPixels: 200 },
  { id: 'rq_9', title: 'Calculateur Rapide', description: 'Répondez correctement à 10 calculs dans Math Blitz', type: 'highscore', target: 10, gameId: 'math', rewardRankPts: 120, rewardPixels: 200 },
  { id: 'rq_10', title: 'Démineur de Choc', description: 'Scorez au moins 20 points dans Démineur Express', type: 'highscore', target: 20, gameId: 'mines', rewardRankPts: 150, rewardPixels: 250 },
  { id: 'rq_11', title: 'Rythme Cyber', description: 'Atteignez 100 points dans Cyber Rythme', type: 'highscore', target: 100, gameId: 'rhythm', rewardRankPts: 150, rewardPixels: 250 },
  { id: 'rq_12', title: 'Casse-Briques Pro', description: 'Marquez 50 points dans Casse-Briques', type: 'highscore', target: 50, gameId: 'brick', rewardRankPts: 150, rewardPixels: 250 },
  { id: 'rq_13', title: 'Vétéran des Bornes', description: 'Jouez un total de 15 parties d\'arcade', type: 'plays_total', target: 15, rewardRankPts: 200, rewardPixels: 300 },
  { id: 'rq_14', title: 'Shopping de Prestige', description: 'Achetez au moins 1 cosmétique dans le shop', type: 'shop_buy', target: 1, rewardRankPts: 150, rewardPixels: 200 },
  { id: 'rq_15', title: 'Polyvalent de l\'Arcade', description: 'Jouez à au moins 10 mini-jeux différents', type: 'plays_game', target: 10, rewardRankPts: 300, rewardPixels: 400 },
  { id: 'rq_16', title: 'Champion des Flappies', description: 'Scorez 10 points dans Flappy Pixel', type: 'highscore', target: 10, gameId: 'flappy', rewardRankPts: 150, rewardPixels: 250 },
  { id: 'rq_17', title: 'Stratège du 2048', description: 'Scorez 200 points dans 2048 Mini', type: 'highscore', target: 200, gameId: 'g2048', rewardRankPts: 200, rewardPixels: 300 },
  { id: 'rq_18', title: 'Maître du Tetris', description: 'Scorez 200 points dans Tetris Micro', type: 'highscore', target: 200, gameId: 'tetris', rewardRankPts: 200, rewardPixels: 300 },
  { id: 'rq_19', title: 'Souverain du Pong', description: 'Scorez 30 points dans Néon Pong', type: 'highscore', target: 30, gameId: 'pong', rewardRankPts: 150, rewardPixels: 250 },
  { id: 'rq_20', title: 'Marathonien de l\'Arcade', description: 'Jouez un total de 30 parties', type: 'plays_total', target: 30, rewardRankPts: 400, rewardPixels: 500 },
  { id: 'rq_21', title: 'Seigneur des Rangs', description: 'Atteignez un niveau élevé dans le Pass Arcade', type: 'pass_level', target: 3, rewardRankPts: 300, rewardPixels: 400 },
  { id: 'rq_22', title: 'Légende Immortelle', description: 'Accumulez 1000 Rank PTS', type: 'highscore', target: 1000, rewardRankPts: 600, rewardPixels: 1000 }
];

// 100 ACHIEVEMENTS TOTAL!
export const INITIAL_ACHIEVEMENTS: Achievement[] = Array.from({ length: 100 }, (_, i) => {
  const id = `ach${i + 1}`;
  let title = `Succès #${i + 1}`;
  let frenchTitle = `Succès #${i + 1}`;
  let description = `Relevez le défi de l'arcade #${i + 1}`;
  let frenchDescription = `Relevez le défi de l'arcade #${i + 1}`;
  let pixelReward = 30 + (i % 10) * 15;
  let icon = 'Award';

  if (i === 0) { frenchTitle = 'Premier Pixel'; frenchDescription = 'Gagnez vos premiers pixels dans n\'importe quel jeu'; pixelReward = 20; icon = 'Zap'; }
  else if (i === 1) { frenchTitle = 'Pionnier du Clic'; frenchDescription = 'Scorez plus de 150 pixels dans Néon Clicker'; pixelReward = 40; icon = 'Zap'; }
  else if (i === 2) { frenchTitle = 'Roi de Simon'; frenchDescription = 'Atteignez une séquence de 6 dans Simon Mémorisation'; pixelReward = 50; icon = 'Brain'; }
  else if (i === 3) { frenchTitle = 'Dieu de la Vitesse'; frenchDescription = 'Scorez plus de 120 points dans Vitesse Réflexe'; pixelReward = 60; icon = 'Target'; }
  else if (i === 4) { frenchTitle = 'Charmeur de Serpent'; frenchDescription = 'Scorez plus de 100 points dans Néon Snake'; pixelReward = 50; icon = 'Play'; }
  else if (i === 5) { frenchTitle = 'Destructeur de Blocs'; frenchDescription = 'Scorez plus de 150 points dans Casse-Briques'; pixelReward = 50; icon = 'Grid'; }
  else if (i === 6) { frenchTitle = 'Seigneur de la Pile'; frenchDescription = 'Scorez plus de 200 points dans Stacker'; pixelReward = 50; icon = 'Layers'; }
  else if (i === 7) { frenchTitle = 'Moissonneur de Couleur'; frenchDescription = 'Scorez plus de 120 points dans Color Catch'; pixelReward = 50; icon = 'Shield'; }
  else if (i === 8) { frenchTitle = 'Fléau de l\'I.A.'; frenchDescription = 'Battez l\'I.A. "VERTEX-9000" au Morpion Néon'; pixelReward = 50; icon = 'Sword'; }
  else if (i === 9) { frenchTitle = 'Génie Mathématique'; frenchDescription = 'Série de 10 réponses correctes dans Math Blitz'; pixelReward = 50; icon = 'PlusCircle'; }
  else if (i === 10) { frenchTitle = 'Invasion Repoussée'; frenchDescription = 'Scorez plus de 100 points dans Envahisseurs Néon'; pixelReward = 60; icon = 'Cpu'; }
  else if (i === 11) { frenchTitle = 'Dévoreur de Météores'; frenchDescription = 'Scorez plus de 150 points dans Tempête Météore'; pixelReward = 60; icon = 'Sparkles'; }
  else if (i === 12) { frenchTitle = 'As du Pinball'; frenchDescription = 'Scorez plus de 300 points dans Néon Pinball'; pixelReward = 70; icon = 'Disc'; }
  else if (i === 13) { frenchTitle = 'Mélomane Néon'; frenchDescription = 'Scorez plus de 500 points dans Cyber Rythme'; pixelReward = 80; icon = 'Music'; }
  else if (i === 14) { frenchTitle = 'Fuyard du Labyrinthe'; frenchDescription = 'Terminez 3 labyrinthes dans Labyrinthe Néon'; pixelReward = 80; icon = 'Compass'; }
  else if (i === 15) { frenchTitle = 'Défiant la Gravité'; frenchDescription = 'Scorez plus de 250 points dans Orbe de Gravité'; pixelReward = 80; icon = 'Flame'; }
  else if (i === 16) { frenchTitle = 'Mastermind Cyber'; frenchDescription = 'Piratez un code secret dans Piratage de Code'; pixelReward = 100; icon = 'Key'; }
  else if (i === 17) { frenchTitle = 'Apprenti d\'Arcade'; frenchDescription = 'Jouez un total de 5 parties de jeux'; pixelReward = 30; icon = 'Play'; }
  else if (i === 18) { frenchTitle = 'Habitué des Salles'; frenchDescription = 'Jouez un total de 15 parties de jeux'; pixelReward = 50; icon = 'Play'; }
  else if (i === 19) { frenchTitle = 'Vétéran Retro'; frenchDescription = 'Jouez un total de 30 parties de jeux'; pixelReward = 80; icon = 'Play'; }
  else if (i === 20) { frenchTitle = 'Collecteur de Pixels'; frenchDescription = 'Gagnez un total de 200 pixels'; pixelReward = 40; icon = 'Zap'; }
  else if (i === 21) { frenchTitle = 'Gros Bonnet'; frenchDescription = 'Gagnez un total de 1 000 pixels'; pixelReward = 80; icon = 'Zap'; }
  else if (i === 22) { frenchTitle = 'Empereur du Pixel'; frenchDescription = 'Gagnez un total de 5 000 pixels'; pixelReward = 150; icon = 'Trophy'; }
  else if (i === 23) { frenchTitle = 'Légende du Clic'; frenchDescription = 'Scorez plus de 500 points dans Néon Clicker'; pixelReward = 100; icon = 'Zap'; }
  else if (i === 24) { frenchTitle = 'Acheteur de la Boutique'; frenchDescription = 'Achetez votre premier cosmétique dans le shop'; pixelReward = 50; icon = 'ShoppingBag'; }
  else if (i === 25) { frenchTitle = 'Collectionneur d\'Auras'; frenchDescription = 'Débloquez au moins 2 auras différentes'; pixelReward = 100; icon = 'Sparkles'; }
  else if (i === 26) { frenchTitle = 'Squelette Néon'; frenchDescription = 'Débloquez un nouvel icône d\'avatar'; pixelReward = 60; icon = 'Crown'; }
  else if (i === 27) { frenchTitle = 'Caméléon'; frenchDescription = 'Changez la couleur de votre avatar'; pixelReward = 40; icon = 'Award'; }
  else if (i === 28) { frenchTitle = 'Champion des Tournois'; frenchDescription = 'Participez à au moins 2 tournois officiels'; pixelReward = 100; icon = 'Trophy'; }
  else if (i === 29) { frenchTitle = 'Pass Niveau 10'; frenchDescription = 'Atteignez le niveau 10 dans le Pass Arcade'; pixelReward = 100; icon = 'Flame'; }
  else if (i === 30) { frenchTitle = 'Pass Niveau 25'; frenchDescription = 'Atteignez le niveau 25 dans le Pass Arcade'; pixelReward = 200; icon = 'Flame'; }
  else if (i === 31) { frenchTitle = 'Pass Niveau 50'; frenchDescription = 'Atteignez le niveau 50 max dans le Pass Arcade'; pixelReward = 500; icon = 'Flame'; }
  else if (i === 32) { frenchTitle = 'Chasseur de Quêtes'; frenchDescription = 'Accomplissez 5 quêtes quotidiennes'; pixelReward = 80; icon = 'Award'; }
  else if (i === 33) { frenchTitle = 'Maître des Quêtes'; frenchDescription = 'Accomplissez 15 quêtes quotidiennes'; pixelReward = 150; icon = 'Award'; }
  else if (i === 34) { frenchTitle = 'Surtension Maximale'; frenchDescription = 'Déclenchez la surtension Hyperdrive dans Clicker'; pixelReward = 80; icon = 'Zap'; }
  else if (i === 35) { frenchTitle = 'Tueur d\'Anomalies'; frenchDescription = 'Détruisez une anomalie boss dans Néon Clicker'; pixelReward = 90; icon = 'Shield'; }
  else if (i === 36) { frenchTitle = 'Marathonien 50 Parties'; frenchDescription = 'Jouez un total de 50 parties de jeux'; pixelReward = 120; icon = 'Play'; }
  else if (i === 37) { frenchTitle = 'Centenaire Arcade'; frenchDescription = 'Jouez un total de 100 parties de jeux'; pixelReward = 250; icon = 'Play'; }
  else if (i === 38) { frenchTitle = 'Acheteur Compulsif'; frenchDescription = 'Possédez au moins 5 cosmétiques dans la boutique'; pixelReward = 150; icon = 'ShoppingBag'; }
  else if (i === 39) { frenchTitle = 'Baron de la Borne'; frenchDescription = 'Débloquez 3 thèmes de bornes d\'arcade'; pixelReward = 120; icon = 'ShoppingBag'; }
  else if (i === 40) { frenchTitle = 'Seigneur des Titres'; frenchDescription = 'Possédez 3 titres personnalisés'; pixelReward = 100; icon = 'Award'; }
  else {
    frenchTitle = `Succès Arcade #${i + 1}`;
    frenchDescription = `Marquez plus de ${100 + i * 20} points ou gagnez des récompenses dans l'arcade.`;
  }

  return {
    id,
    title: frenchTitle,
    frenchTitle,
    description: frenchDescription,
    frenchDescription,
    pixelReward,
    isUnlocked: false,
    icon
  };
});

export const INITIAL_QUESTS: Quest[] = [
  { id: 'q1', title: 'Session d\'Entraînement', description: 'Jouez à 3 parties de n\'importe quel jeu', type: 'plays_total', target: 3, current: 0, rewardPixels: 50, rewardXp: 50, isCompleted: false, isClaimed: false },
  { id: 'q2', title: 'Accumulateur de Pixels', description: 'Gagnez un total de 200 PX', type: 'pixels_earned', target: 200, current: 0, rewardPixels: 70, rewardXp: 60, isCompleted: false, isClaimed: false },
  { id: 'q3', title: 'Score Parfait en Math', description: 'Obtenez une série de 5 bonnes réponses en Math Blitz', type: 'math_streak', target: 5, current: 0, rewardPixels: 80, rewardXp: 70, isCompleted: false, isClaimed: false },
  { id: 'q4', title: 'Maître du Clic', description: 'Scorez plus de 150 points dans Néon Clicker', type: 'score_specific', target: 150, current: 0, rewardPixels: 60, rewardXp: 50, isCompleted: false, isClaimed: false, gameId: 'clicker' },
  { id: 'q5', title: 'Champion du Pong', description: 'Scorez plus de 50 points dans Néon Pong', type: 'score_specific', target: 50, current: 0, rewardPixels: 60, rewardXp: 50, isCompleted: false, isClaimed: false, gameId: 'pong' },
  { id: 'q6', title: 'Esquiveur Mythique', description: 'Scorez plus de 60 points dans Esquive Laser', type: 'score_specific', target: 60, current: 0, rewardPixels: 80, rewardXp: 80, isCompleted: false, isClaimed: false, gameId: 'laserdodge' },
  { id: 'q7', title: 'Star du Pinball', description: 'Scorez plus de 200 points dans Néon Pinball', type: 'score_specific', target: 200, current: 0, rewardPixels: 90, rewardXp: 90, isCompleted: false, isClaimed: false, gameId: 'pinball' },
  { id: 'q8', title: 'Rythme Enflammé', description: 'Scorez plus de 300 points dans Cyber Rythme', type: 'score_specific', target: 300, current: 0, rewardPixels: 90, rewardXp: 90, isCompleted: false, isClaimed: false, gameId: 'rhythm' },
  { id: 'q9', title: 'Guerrier Mythique', description: 'Jouez à 1 partie d\'un jeu Mythique', type: 'plays_mythic', target: 1, current: 0, rewardPixels: 100, rewardXp: 100, isCompleted: false, isClaimed: false },
  { id: 'q10', title: 'Client de la Boutique', description: 'Achetez une cosmétique dans la boutique', type: 'shop_buy', target: 1, current: 0, rewardPixels: 80, rewardXp: 80, isCompleted: false, isClaimed: false }
];

export const QUEST_POOL: Quest[] = [
  ...INITIAL_QUESTS,
  { id: 'q11', title: 'Session Marathon', description: 'Jouez à 8 parties au total', type: 'plays_total', target: 8, current: 0, rewardPixels: 120, rewardXp: 120, isCompleted: false, isClaimed: false },
  { id: 'q12', title: 'Fortune du Pixel', description: 'Gagnez un total de 500 PX', type: 'pixels_earned', target: 500, current: 0, rewardPixels: 150, rewardXp: 150, isCompleted: false, isClaimed: false },
  { id: 'q13', title: 'PIRATE DU CODE', description: 'Débloquez un code dans Matrix Code Breaker', type: 'score_specific', target: 100, current: 0, rewardPixels: 100, rewardXp: 100, isCompleted: false, isClaimed: false, gameId: 'codebreaker' },
  { id: 'q14', title: 'ANOMALIE BASS', description: 'Provoquez la surtension dans Néon Clicker', type: 'score_specific', target: 300, current: 0, rewardPixels: 110, rewardXp: 110, isCompleted: false, isClaimed: false, gameId: 'clicker' }
];

export const PASS_LEVELS: PassLevel[] = Array.from({ length: 100 }, (_, i) => {
  const lvl = i + 1;
  let freeReward: PassLevelReward = { type: 'pixels', value: 100 + lvl * 30, label: `+${100 + lvl * 30} PX` };
  let premiumReward: PassLevelReward = { type: 'pixels', value: 250 + lvl * 50, label: `+${250 + lvl * 50} PX` };

  if (lvl === 2) freeReward = { type: 'title', value: 'RECRUE DU S2', label: 'Titre: Recrue Saison 2' };
  if (lvl === 5) premiumReward = { type: 'title', value: 'SOLDAT MATRIX ⚡', label: 'Titre: Soldat Matrix' };
  if (lvl === 8) freeReward = { type: 'color', value: 'fuchsia', label: 'Couleur: Fuchsia Glitch' };
  if (lvl === 10) premiumReward = { type: 'skin', value: 'cyberpunk_2099', label: 'Châssis Cyberpunk 2099 ⚡' };
  if (lvl === 15) freeReward = { type: 'aura', value: 'cyber_glitch', label: 'Aura Glitch Cyber 👾' };
  if (lvl === 20) premiumReward = { type: 'skin', value: 'neon_synthwave', label: 'Châssis Synthwave 🌇' };
  if (lvl === 25) freeReward = { type: 'title', value: 'PILOTE MATRIX', label: 'Titre: Pilote Matrix' };
  if (lvl === 30) premiumReward = { type: 'aura', value: 'atomic', label: 'Aura Atome Néon ⚛️' };
  if (lvl === 35) freeReward = { type: 'skin', value: 'slime', label: 'Châssis Cosmic Slime 🧪' };
  if (lvl === 40) premiumReward = { type: 'aura', value: 'starlight', label: 'Aura Étoile du Matin 🌟' };
  if (lvl === 45) freeReward = { type: 'title', value: 'PIRATE SYSTÈME 💻', label: 'Titre: Pirate Système' };
  if (lvl === 50) {
    freeReward = { type: 'title', value: 'SINGULARITÉ MATRIX 🌌', label: 'Titre: Singularité Matrix' };
    premiumReward = { type: 'skin', value: 'supernova', label: 'Châssis Supernova 💥' };
  }
  if (lvl === 60) premiumReward = { type: 'aura', value: 'phoenix', label: 'Aura Phoenix Rétro 🦅' };
  if (lvl === 70) freeReward = { type: 'aura', value: 'godlike', label: 'Aura Divinité Arcane ✨' };
  if (lvl === 80) premiumReward = { type: 'skin', value: 'quantum_void', label: 'Châssis Vide Quantique 🌌' };
  if (lvl === 90) freeReward = { type: 'title', value: 'MONARQUE DE L\'ARCADE 👑', label: 'Titre: Monarque Arcade' };
  if (lvl === 100) {
    freeReward = { type: 'title', value: 'MAÎTRE MATRIX SUPRÊME 👑', label: 'Titre: Maître Matrix Suprême' };
    premiumReward = { type: 'aura', value: 'omega_core', label: 'Aura Noyau Oméga 🔮' };
  }

  return {
    level: lvl,
    freeReward,
    premiumReward
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
      { rank: 2, username: 'PixelGod_X', avatarColor: '#3b82f6', avatarIcon: 'Crown', score: 1020 },
      { rank: 3, username: 'NeonQueen_99', avatarColor: '#a855f7', avatarIcon: 'Sparkles', score: 890 }
    ]
  },
  {
    id: 'tourney_rhythm',
    title: 'Festival Cyber Rythme 🎵',
    frenchTitle: 'Festival Cyber Rythme 🎵',
    gameId: 'rhythm',
    gameName: 'Cyber Rythme',
    description: 'Enchaînez les notes sans rater pour atteindre au moins 800 points dans ce tournoi musical !',
    targetScore: 800,
    unit: 'pts',
    prizePool: 12000,
    titleReward: 'VIRTUOSE DU RYTHME 🎵',
    endsInDays: 5,
    status: 'active',
    participantsCount: 1890,
    leaderboard: [
      { rank: 1, username: 'BeatMaster_X', avatarColor: '#ec4899', avatarIcon: 'Headphones', score: 750 },
      { rank: 2, username: 'RhythmQueen', avatarColor: '#06b6d4', avatarIcon: 'Zap', score: 680 }
    ]
  },
  {
    id: 'tourney_clicker',
    title: 'Sprint Néon Clicker ⚡',
    frenchTitle: 'Sprint Néon Clicker ⚡',
    gameId: 'clicker',
    gameName: 'Néon Clicker',
    description: 'Dépassez les 500 PX en une session pour remporter le jackpot du sprint !',
    targetScore: 500,
    unit: 'clics',
    prizePool: 15000,
    titleReward: 'ROI DU CLIC 👑',
    endsInDays: 7,
    status: 'active',
    participantsCount: 2100,
    leaderboard: [
      { rank: 1, username: 'SpeedFinger_X', avatarColor: '#eab308', avatarIcon: 'Zap', score: 480 },
      { rank: 2, username: 'TapMaster', avatarColor: '#ec4899', avatarIcon: 'Sparkles', score: 420 }
    ]
  }
];
