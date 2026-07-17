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
    description: 'Cliquez sur les nodes lumineuses qui surgissent au hasard à toute vitesse. Vous avez 6 vies et 30 secondes !',
    icon: 'Target',
    category: 'reflex',
    difficulty: 'medium',
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
  },
  {
    id: 'invaders',
    name: 'Neon Invaders',
    frenchName: 'Envahisseurs Néon',
    description: 'Esquivez les lasers ennemis et détruisez les vagues d\'envahisseurs rétro-lumineux de l\'espace.',
    icon: 'Cpu',
    category: 'arcade',
    difficulty: 'medium',
    color: 'text-fuchsia-400 border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.3)] bg-fuchsia-950/20 hover:border-fuchsia-400'
  },
  {
    id: 'meteor',
    name: 'Meteor Storm',
    frenchName: 'Tempête Météore',
    description: 'Une pluie de météores s\'abat sur votre secteur. Esquivez-les ou pulvérisez-les à coups de laser !',
    icon: 'Sparkles',
    category: 'reflex',
    difficulty: 'hard',
    color: 'text-amber-400 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] bg-amber-950/20 hover:border-amber-400'
  }
];

export const CABINET_SKINS = [
  { id: 'neon', name: 'Cyber Néon', cost: 0, theme: 'from-slate-950 via-slate-900 to-indigo-950 border-cyan-500/80 shadow-[0_0_30px_rgba(6,182,212,0.4)]' },
  { id: 'retrowave', name: 'Retrowave Doré', cost: 150, theme: 'from-slate-950 via-fuchsia-950 to-slate-950 border-yellow-500/80 shadow-[0_0_30px_rgba(234,179,8,0.4)]' },
  { id: 'slime', name: 'Cosmic Slime', cost: 250, theme: 'from-slate-950 via-slate-900 to-emerald-950 border-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.4)]' },
  { id: 'sunfire', name: 'Tempête Solaire ☀️', cost: 350, theme: 'from-slate-950 via-amber-950 to-slate-950 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.5)]' },
  { id: 'matrix', name: 'Matrix Terminal', cost: 400, theme: 'from-black via-zinc-900 to-black border-green-500/80 shadow-[0_0_30px_rgba(34,197,94,0.4)]' },
  { id: 'glitch', name: 'Néon Glitché 🌀', cost: 500, theme: 'from-slate-950 via-slate-900 to-slate-950 border-fuchsia-500 shadow-[0_0_30px_rgba(217,70,239,0.5),0_0_15px_rgba(6,182,212,0.5)] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] animate-[pulse_4s_infinite]' },
  { id: 'prismatic', name: 'Prisme Magmatique', cost: 600, theme: 'from-slate-950 via-rose-950 to-violet-950 border-pink-500/80 shadow-[0_0_35px_rgba(236,72,153,0.6)]' },
  { id: 'quantum_void', name: 'Vide Quantique 🌌', cost: 850, theme: 'from-slate-950 via-indigo-950 to-purple-950 border-purple-500/90 shadow-[0_0_40px_rgba(168,85,247,0.75)] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] animate-[pulse_3s_infinite]' },
  { id: 'gold_emperor', name: 'Empereur d\'Or 👑', cost: 1000, theme: 'from-slate-950 via-yellow-950 to-slate-950 border-yellow-400 shadow-[0_0_40px_rgba(234,179,8,0.8),inset_0_0_15px_rgba(234,179,8,0.2)]' },
  { id: 'frozen_glacier', name: 'Glacier Éternel ❄️', cost: 1200, theme: 'from-slate-950 via-cyan-950 to-slate-900 border-sky-300 shadow-[0_0_35px_rgba(125,211,252,0.6)]' }
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
  { id: 'ach10', title: 'Math Genius', frenchTitle: 'Génie Mathématique', description: 'Get a 10 streak in Math Blitz', frenchDescription: 'Obtenez une série de 10 réponses correctes dans Math Blitz', pixelReward: 50, isUnlocked: false, icon: 'PlusCircle' },
  { id: 'ach11', title: 'Space Shield', frenchTitle: 'Invasion Repoussée', description: 'Score over 100 points in Neon Invaders', frenchDescription: 'Scorez plus de 100 points dans Envahisseurs Néon', pixelReward: 60, isUnlocked: false, icon: 'Cpu' },
  { id: 'ach12', title: 'Meteor Blast', frenchTitle: 'Dévoreur de Météores', description: 'Score over 150 points in Meteor Storm', frenchDescription: 'Scorez plus de 150 points dans Tempête Météore', pixelReward: 60, isUnlocked: false, icon: 'Sparkles' },
  { id: 'ach13', title: 'Title Unlocked', frenchTitle: 'Titre de Noblesse', description: 'Unlock any custom title in the shop', frenchDescription: 'Débloquez un titre dans la boutique de titres', pixelReward: 80, isUnlocked: false, icon: 'Award' },
  { id: 'ach14', title: 'Rich Pixel', frenchTitle: 'Pixel Crésus', description: 'Accumulate over 1200 Pixels in your wallet', frenchDescription: 'Cumulez plus de 1200 Pixels dans votre cagnotte', pixelReward: 100, isUnlocked: false, icon: 'Trophy' },
  { id: 'ach15', title: 'Arcade Novice', frenchTitle: 'Apprenti d\'Arcade', description: 'Play 5 total game sessions', frenchDescription: 'Jouez un total de 5 parties de jeux', pixelReward: 30, isUnlocked: false, icon: 'Play' },
  { id: 'ach16', title: 'Arcade Regular', frenchTitle: 'Habitué des Salles', description: 'Play 15 total game sessions', frenchDescription: 'Jouez un total de 15 parties de jeux', pixelReward: 50, isUnlocked: false, icon: 'Play' },
  { id: 'ach17', title: 'Arcade Veteran', frenchTitle: 'Vétéran Retro', description: 'Play 30 total game sessions', frenchDescription: 'Jouez un total de 30 parties de jeux', pixelReward: 80, isUnlocked: false, icon: 'Play' },
  { id: 'ach18', title: 'Pixel Collector', frenchTitle: 'Collecteur de Pixels', description: 'Earn a total of 100 Pixels', frenchDescription: 'Gagnez un total de 100 pixels', pixelReward: 30, isUnlocked: false, icon: 'Zap' },
  { id: 'ach19', title: 'Pixel Hoarder', frenchTitle: 'Gros Bonnet', description: 'Earn a total of 500 Pixels', frenchDescription: 'Gagnez un total de 500 pixels', pixelReward: 60, isUnlocked: false, icon: 'Zap' },
  { id: 'ach20', title: 'Pixel Emperor', frenchTitle: 'Empereur du Pixel', description: 'Earn a total of 2000 Pixels', frenchDescription: 'Gagnez un total de 2000 pixels', pixelReward: 120, isUnlocked: false, icon: 'Trophy' },
  { id: 'ach21', title: 'Click Enthusiast', frenchTitle: 'Fou du Clic', description: 'Score over 50 points in Neon Clicker', frenchDescription: 'Scorez plus de 50 points dans Néon Clicker', pixelReward: 25, isUnlocked: false, icon: 'Zap' },
  { id: 'ach22', title: 'Click Legend', frenchTitle: 'Légende du Clic', description: 'Score over 200 points in Neon Clicker', frenchDescription: 'Scorez plus de 200 points dans Néon Clicker', pixelReward: 80, isUnlocked: false, icon: 'Zap' },
  { id: 'ach23', title: 'Memory Student', frenchTitle: 'Mémoire Vive', description: 'Score over 30 points in Simon Memory', frenchDescription: 'Scorez plus de 30 points dans Simon Mémorisation', pixelReward: 25, isUnlocked: false, icon: 'Brain' },
  { id: 'ach24', title: 'Memory Sage', frenchTitle: 'Sage de la Mémoire', description: 'Score over 80 points in Simon Memory', frenchDescription: 'Scorez plus de 80 points dans Simon Mémorisation', pixelReward: 80, isUnlocked: false, icon: 'Brain' },
  { id: 'ach25', title: 'Reflex Cadet', frenchTitle: 'Cadet du Réflexe', description: 'Score over 40 points in Reflex Speed Tap', frenchDescription: 'Scorez plus de 40 points dans Vitesse Réflexe', pixelReward: 25, isUnlocked: false, icon: 'Target' },
  { id: 'ach26', title: 'Reflex Champion', frenchTitle: 'Champion Réflexe', description: 'Score over 80 points in Reflex Speed Tap', frenchDescription: 'Scorez plus de 80 points dans Vitesse Réflexe', pixelReward: 80, isUnlocked: false, icon: 'Target' },
  { id: 'ach27', title: 'Snake Egg', frenchTitle: 'Bébé Serpent', description: 'Score over 40 points in Neon Snake', frenchDescription: 'Scorez plus de 40 points dans Néon Snake', pixelReward: 25, isUnlocked: false, icon: 'Play' },
  { id: 'ach28', title: 'Snake Emperor', frenchTitle: 'Empereur Serpent', description: 'Score over 150 points in Neon Snake', frenchDescription: 'Scorez plus de 150 points dans Néon Snake', pixelReward: 80, isUnlocked: false, icon: 'Play' },
  { id: 'ach29', title: 'Paddle Guard', frenchTitle: 'Gardien de Raquette', description: 'Score over 60 points in Brick Breaker', frenchDescription: 'Scorez plus de 60 points dans Casse-Briques', pixelReward: 25, isUnlocked: false, icon: 'Grid' },
  { id: 'ach30', title: 'Brick Pulverizer', frenchTitle: 'Pulvérisateur de Briques', description: 'Score over 200 points in Brick Breaker', frenchDescription: 'Scorez plus de 200 points dans Casse-Briques', pixelReward: 80, isUnlocked: false, icon: 'Grid' },
  { id: 'ach31', title: 'Stack Novice', frenchTitle: 'Empileur Junior', description: 'Score over 80 points in Stacker Arcade', frenchDescription: 'Scorez plus de 80 points dans Stacker', pixelReward: 25, isUnlocked: false, icon: 'Layers' },
  { id: 'ach32', title: 'Stack Titan', frenchTitle: 'Titan de la Pile', description: 'Score over 300 points in Stacker Arcade', frenchDescription: 'Scorez plus de 300 points dans Stacker', pixelReward: 80, isUnlocked: false, icon: 'Layers' },
  { id: 'ach33', title: 'Orbs Collector', frenchTitle: 'Attrapeur d\'Orbes', description: 'Score over 50 points in Color Catch', frenchDescription: 'Scorez plus de 50 points dans Color Catch', pixelReward: 25, isUnlocked: false, icon: 'Shield' },
  { id: 'ach34', title: 'Color Overlord', frenchTitle: 'Maître des Orbes', description: 'Score over 150 points in Color Catch', frenchDescription: 'Scorez plus de 150 points dans Color Catch', pixelReward: 80, isUnlocked: false, icon: 'Shield' },
  { id: 'ach35', title: 'Binary Apprentice', frenchTitle: 'Apprenti Binaire', description: 'Score over 40 points in Binary Cipher', frenchDescription: 'Scorez plus de 40 points dans Déchiffreur Binaire', pixelReward: 25, isUnlocked: false, icon: 'Cpu' },
  { id: 'ach36', title: 'Binary Master', frenchTitle: 'Maître du Code', description: 'Score over 100 points in Binary Cipher', frenchDescription: 'Scorez plus de 100 points dans Déchiffreur Binaire', pixelReward: 80, isUnlocked: false, icon: 'Cpu' },
  { id: 'ach37', title: 'Grid Master', frenchTitle: 'Morpion d\'Argent', description: 'Score over 10 points in Tic-Tac-Toe', frenchDescription: 'Scorez plus de 10 points dans Morpion Néon', pixelReward: 25, isUnlocked: false, icon: 'Sword' },
  { id: 'ach38', title: 'Grid Legend', frenchTitle: 'Dieu du Morpion', description: 'Score over 30 points in Tic-Tac-Toe', frenchDescription: 'Scorez plus de 30 points dans Morpion Néon', pixelReward: 80, isUnlocked: false, icon: 'Sword' },
  { id: 'ach39', title: 'Math Kid', frenchTitle: 'Écolier en Math', description: 'Score over 40 points in Math Blitz', frenchDescription: 'Scorez plus de 40 points dans Math Blitz', pixelReward: 25, isUnlocked: false, icon: 'PlusCircle' },
  { id: 'ach40', title: 'Math Sage', frenchTitle: 'Sage des Nombres', description: 'Score over 120 points in Math Blitz', frenchDescription: 'Scorez plus de 120 points dans Math Blitz', pixelReward: 80, isUnlocked: false, icon: 'PlusCircle' },
  { id: 'ach41', title: 'Matrix Trainee', frenchTitle: 'Recrue de Matrix', description: 'Score over 40 points in Matrix Memory', frenchDescription: 'Scorez plus de 40 points dans Matrice Mémoire', pixelReward: 25, isUnlocked: false, icon: 'Grid3X3' },
  { id: 'ach42', title: 'Matrix Oracle', frenchTitle: 'Oracle de Matrix', description: 'Score over 100 points in Matrix Memory', frenchDescription: 'Scorez plus de 100 points dans Matrice Mémoire', pixelReward: 80, isUnlocked: false, icon: 'Grid3X3' },
  { id: 'ach43', title: 'Node Tapper', frenchTitle: 'Chasseur de Nodes', description: 'Score over 50 points in Whack-A-Node', frenchDescription: 'Scorez plus de 50 points dans Tape la Node', pixelReward: 25, isUnlocked: false, icon: 'Sparkles' },
  { id: 'ach44', title: 'Node Destroyer', frenchTitle: 'Démolisseur de Nodes', description: 'Score over 150 points in Whack-A-Node', frenchDescription: 'Scorez plus de 150 points dans Tape la Node', pixelReward: 80, isUnlocked: false, icon: 'Sparkles' },
  { id: 'ach45', title: 'Galaxy Cadet', frenchTitle: 'Cadet Galactique', description: 'Score over 50 points in Neon Invaders', frenchDescription: 'Scorez plus de 50 points dans Envahisseurs Néon', pixelReward: 25, isUnlocked: false, icon: 'Cpu' },
  { id: 'ach46', title: 'Galaxy Savior', frenchTitle: 'Sauveur de l\'Univers', description: 'Score over 150 points in Neon Invaders', frenchDescription: 'Scorez plus de 150 points dans Envahisseurs Néon', pixelReward: 80, isUnlocked: false, icon: 'Cpu' },
  { id: 'ach47', title: 'Meteor Survivor', frenchTitle: 'Survivant des Étoiles', description: 'Score over 60 points in Meteor Storm', frenchDescription: 'Scorez plus de 60 points dans Tempête Météore', pixelReward: 25, isUnlocked: false, icon: 'Sparkles' },
  { id: 'ach48', title: 'Cosmic Deflector', frenchTitle: 'Protecteur Cosmique', description: 'Score over 200 points in Meteor Storm', frenchDescription: 'Scorez plus de 200 points dans Tempête Météore', pixelReward: 80, isUnlocked: false, icon: 'Sparkles' },
  { id: 'ach49', title: 'Arcade Elite', frenchTitle: 'Élite du Pass', description: 'Reach level 5 in the Arcade Pass', frenchDescription: 'Atteignez le niveau 5 dans le Pass Arcade', pixelReward: 50, isUnlocked: false, icon: 'Flame' },
  { id: 'ach50', title: 'Cosmetic collector', frenchTitle: 'Collectionneur de Bornes', description: 'Unlock 3 cabinet skins from the shop', frenchDescription: 'Débloquez 3 skins de bornes dans la boutique', pixelReward: 50, isUnlocked: false, icon: 'ShoppingBag' }
];

export const INITIAL_QUESTS = [
  { id: 'q1', title: 'Session d\'Entraînement', description: 'Jouez à 3 parties de n\'importe quel jeu', type: 'plays_total', target: 3, current: 0, rewardPixels: 40, rewardXp: 50, isCompleted: false, isClaimed: false },
  { id: 'q2', title: 'Accumulateur de Pixels', description: 'Gagnez un total de 150 PX', type: 'pixels_earned', target: 150, current: 0, rewardPixels: 50, rewardXp: 60, isCompleted: false, isClaimed: false },
  { id: 'q3', title: 'Score Parfait en Math', description: 'Obtenez une série de 5 bonnes réponses en Math Blitz', type: 'math_streak', target: 5, current: 0, rewardPixels: 60, rewardXp: 70, isCompleted: false, isClaimed: false },
  { id: 'q4', title: 'Maître du Clic', description: 'Scorez plus de 100 points dans Néon Clicker', type: 'score_specific', target: 100, current: 0, rewardPixels: 30, rewardXp: 40, isCompleted: false, isClaimed: false, gameId: 'clicker' },
  { id: 'q5', title: 'Explorateur de Vitesse', description: 'Scorez plus de 30 points dans Vitesse Réflexe', type: 'score_specific', target: 30, current: 0, rewardPixels: 35, rewardXp: 45, isCompleted: false, isClaimed: false, gameId: 'reflex' },
  { id: 'q6', title: 'Survie de l\'Espace', description: 'Scorez plus de 50 points dans Tempête Météore', type: 'score_specific', target: 50, current: 0, rewardPixels: 45, rewardXp: 55, isCompleted: false, isClaimed: false, gameId: 'meteor' },
  { id: 'q7', title: 'Pilote d\'Élite', description: 'Scorez plus de 40 points dans Envahisseurs Néon', type: 'score_specific', target: 40, current: 0, rewardPixels: 40, rewardXp: 50, isCompleted: false, isClaimed: false, gameId: 'invaders' },
  { id: 'q8', title: 'Série de Défis', description: 'Jouez à 6 parties de n\'importe quel jeu', type: 'plays_total', target: 6, current: 0, rewardPixels: 50, rewardXp: 60, isCompleted: false, isClaimed: false }
];

export interface PassLevelReward {
  level: number;
  xpRequired: number;
  freeReward: {
    type: 'pixels' | 'title' | 'skin' | 'color';
    value: string | number;
    label: string;
  };
  premiumReward: {
    type: 'pixels' | 'title' | 'skin' | 'color';
    value: string | number;
    label: string;
  };
}

export const PASS_LEVELS: PassLevelReward[] = [
  {
    level: 1,
    xpRequired: 100,
    freeReward: { type: 'pixels', value: 50, label: '+50 PX' },
    premiumReward: { type: 'pixels', value: 150, label: '+150 PX' }
  },
  {
    level: 2,
    xpRequired: 100,
    freeReward: { type: 'title', value: 'NOVICE', label: 'Titre: Novice' },
    premiumReward: { type: 'title', value: 'SOLDAT DU NÉON', label: 'Titre: Soldat Néon' }
  },
  {
    level: 3,
    xpRequired: 100,
    freeReward: { type: 'pixels', value: 80, label: '+80 PX' },
    premiumReward: { type: 'color', value: 'rose_neon', label: 'Avatar: Rose Néon' }
  },
  {
    level: 4,
    xpRequired: 100,
    freeReward: { type: 'pixels', value: 100, label: '+100 PX' },
    premiumReward: { type: 'pixels', value: 250, label: '+250 PX' }
  },
  {
    level: 5,
    xpRequired: 100,
    freeReward: { type: 'title', value: 'GAMER', label: 'Titre: Gamer' },
    premiumReward: { type: 'title', value: 'CYBER LÉGENDE', label: 'Titre: Cyber Légende' }
  },
  {
    level: 6,
    xpRequired: 100,
    freeReward: { type: 'pixels', value: 150, label: '+150 PX' },
    premiumReward: { type: 'pixels', value: 400, label: '+400 PX' }
  },
  {
    level: 7,
    xpRequired: 100,
    freeReward: { type: 'title', value: 'PRO D\'ARCADE', label: 'Titre: Pro Arcade' },
    premiumReward: { type: 'color', value: 'gold_rainbow', label: 'Avatar: Or Arc-en-Ciel' }
  },
  {
    level: 8,
    xpRequired: 100,
    freeReward: { type: 'pixels', value: 200, label: '+200 PX' },
    premiumReward: { type: 'pixels', value: 500, label: '+500 PX' }
  },
  {
    level: 9,
    xpRequired: 100,
    freeReward: { type: 'title', value: 'MAÎTRE DU PIXEL', label: 'Titre: Maître Pixel' },
    premiumReward: { type: 'title', value: 'VERTEX CHAMPION', label: 'Titre: Vertex Champion' }
  },
  {
    level: 10,
    xpRequired: 100,
    freeReward: { type: 'skin', value: 'matrix', label: 'Châssis Matrix' },
    premiumReward: { type: 'skin', value: 'prismatic', label: 'Châssis Prismatique' }
  }
];
