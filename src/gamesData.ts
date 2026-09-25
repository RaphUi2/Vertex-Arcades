import {
  GameData, Quest, Achievement, PassLevel, PassLevelReward,
  CosmeticRarity, RngUniverseItem, TradeRequest, RankedTier, TrophyMilestone
} from './types';

// 54 Selectable Description Tags for Profile Creator
export const PROFILE_TAGS_54: string[] = [
  'Pro Gamer', 'Apex Runner', 'Speedrunner', 'Trader', 'PvP God', 'Builder',
  'Boss Hunter', 'AFK Grinder', 'Tycoon Master', 'Anime Fan', 'V-Coins Whale', 'Arcade Veteran',
  'Competitive', 'Chill Vibes', 'Pixel Artist', 'Glitch Hunter', 'Streamer', 'Cyber Knight',
  'High Roller', 'Leaderboard Climber', 'RNG Luck 999', 'Collector', 'Casual', 'Hardcore',
  'Night Owl', 'Speed Demon', 'Cyber Samurai', 'Neon Master', 'Champion Stellaire', 'Apex Predator',
  'Trophy Hunter', 'Pass Maxer', 'Event Specialist', 'Secret Finder', 'Beta Tester', 'VIP Member',
  'Mythic Owner', 'Soundtrack Lover', 'Manette Player', 'One-Shot King', 'Dodge Master', 'Combo Breaker',
  'Lucky Star', 'Matrix Hacker', 'Galaxy Brain', 'Challenger', 'Grand Master', 'Unstoppable',
  'Solo Carry', 'Arcade Legend', 'Creative Master', 'Void Walker', 'Sniper Apex', 'Boss Slayer'
];

// 15 ORIGINAL GAMES: EXACTLY 3 FREE, 12 PAID IN V-COINS
export const GAMES_LIST: GameData[] = [
  // 1. FREE GAME #1
  {
    id: 'quantum_obby',
    name: 'Quantum Velocity: Neon Run',
    frenchName: 'Quantum Velocity : Parcours Néon 🏃‍♂️',
    description: 'Parcours d\'obstacles cybernétique haute vitesse ! Sautez sur les plateformes laser mouvantes, esquivez les marteaux à plasma et franchissez les portails chrono.',
    category: 'platformer',
    difficulty: 'Moyen',
    color: 'from-cyan-500 to-blue-600',
    rating: 97,
    activePlayers: '4.8k',
    creator: 'Apex Studios',
    badge: 'GRATUIT 🔥',
    isPaid: false,
    costVCoins: 0,
    isRankedAvailable: true
  },
  // 2. FREE GAME #2
  {
    id: 'aetheria_void',
    name: 'Aetheria: Blade of the Void',
    frenchName: 'Aetheria : Blade of the Void ⚔️',
    description: 'Combat reflex & slash cyberpunk ! Découpez les entités corrompues avec votre katana laser, enchaînez les parades parfaites et déclenchez la Furie du Néant.',
    category: 'action',
    difficulty: 'Difficile',
    color: 'from-purple-600 to-indigo-800',
    rating: 98,
    activePlayers: '6.2k',
    creator: 'Kurogane Studios',
    badge: 'GRATUIT 🌟',
    isPaid: false,
    costVCoins: 0,
    isRankedAvailable: true
  },
  // 3. FREE GAME #3
  {
    id: 'titan_core',
    name: 'Titan Core: Mech Battle Arena',
    frenchName: 'Titan Core : Mech Arena 🤖',
    description: 'Combat d\'arène entre méchas colossaux ! Contrôlez vos canons jumelés, gérez votre surchauffe d\'énergie et lâchez une volée de micro-missiles dévastatrice.',
    category: 'action',
    difficulty: 'Difficile',
    color: 'from-red-500 to-orange-700',
    rating: 97,
    activePlayers: '6.9k',
    creator: 'Apex Mech Forge',
    badge: 'GRATUIT 🏆',
    isPaid: false,
    costVCoins: 0,
    isRankedAvailable: true
  },

  // 12 PAID GAMES IN V-COINS
  {
    id: 'cyber_heist',
    name: 'CyberHeist: Vault 99',
    frenchName: 'CyberHeist : Vault 99 💰',
    description: 'Infiltration et casse haute technologie VIP ! Esquivez le maillage de caméras et lasers infrarouges, piratez les 3 terminaux et fuyez avec le pactole de V-Coins.',
    category: 'puzzle',
    difficulty: 'Difficile',
    color: 'from-amber-500 to-yellow-600',
    rating: 94,
    activePlayers: '1.9k',
    creator: 'BlackHat Syndicate',
    badge: 'VIP 150 VC 💎',
    isPaid: true,
    costVCoins: 150,
    isRankedAvailable: false
  },
  {
    id: 'hyper_drift',
    name: 'HyperDrift: Neo Tokyo 2099',
    frenchName: 'HyperDrift : Neo Tokyo 2099 🏎️',
    description: 'Course de drift néon sur autoroute suspendue ! Maintenez vos dérapages dans les virages en épingle, remplissez votre jauge de Nitro et doublez les hovercars de police.',
    category: 'racer',
    difficulty: 'Moyen',
    color: 'from-fuchsia-500 to-pink-700',
    rating: 97,
    activePlayers: '5.1k',
    creator: 'Midnight Speed',
    badge: 'VIP 200 VC 💎',
    isPaid: true,
    costVCoins: 200,
    isRankedAvailable: false
  },
  {
    id: 'glitch_hunter',
    name: 'Glitch Hunter: Matrix Purge',
    frenchName: 'Glitch Hunter : Matrix Purge 👾',
    description: 'Défense d\'architecture cybernétique VIP ! Éliminez les virus et trojans corrompus avant qu\'ils ne saturent le processeur central. Déclenchez des explosions IEM massives.',
    category: 'action',
    difficulty: 'Extrême',
    color: 'from-emerald-400 to-green-800',
    rating: 99,
    activePlayers: '3.9k',
    creator: 'CyberCore Defense',
    badge: 'VIP 250 VC 💎',
    isPaid: true,
    costVCoins: 250,
    isRankedAvailable: false
  },
  {
    id: 'nebula_strike',
    name: 'Nebula Strike: Zero-G Dogfight',
    frenchName: 'Nebula Strike : Dogfight 360 🚀',
    description: 'Combat spatial en apesanteur 360° ! Pilotez votre chasseur Stellaire, verrouillez vos missiles à plasma sur les croiseurs ennemis et esquivez les pluies d\'astéroïdes.',
    category: 'action',
    difficulty: 'Moyen',
    color: 'from-sky-500 to-cyan-700',
    rating: 95,
    activePlayers: '3.1k',
    creator: 'Nova Space Flight',
    badge: 'PAYANT 120 VC ⚡',
    isPaid: true,
    costVCoins: 120,
    isRankedAvailable: false
  },
  {
    id: 'chrono_shift',
    name: 'Chrono Shift: Temporal Runner',
    frenchName: 'Chrono Shift : Temporal Runner ⏳',
    description: 'Runner temporel futuriste ! Sautez au-dessus des pièges quantiques et utilisez le Pouvoir de Rembobinage pour remonter le temps de 3 secondes si vous tombez !',
    category: 'platformer',
    difficulty: 'Moyen',
    color: 'from-emerald-500 to-teal-700',
    rating: 93,
    activePlayers: '2.5k',
    creator: 'Temporal Dynamics',
    badge: 'PAYANT 140 VC 🌀',
    isPaid: true,
    costVCoins: 140,
    isRankedAvailable: false
  },
  {
    id: 'robo_tycoon',
    name: 'CyberTycoon: Nanotech Factory',
    frenchName: 'CyberTycoon : Nanotech Factory 🏭',
    description: 'Expérience Tycoon interactive de construction d\'usine ! Installez vos convoyeurs de minerais néon, vos broyeurs quantiques et automatisez la production de V-Coins.',
    category: 'tycoon',
    difficulty: 'Facile',
    color: 'from-orange-500 to-amber-700',
    rating: 96,
    activePlayers: '8.4k',
    creator: 'MegaTycoon Games',
    badge: 'PAYANT 160 VC 📈',
    isPaid: true,
    costVCoins: 160,
    isRankedAvailable: false
  },
  {
    id: 'shadow_dungeon',
    name: 'Shadow Realm: Dungeon Escape',
    frenchName: 'Shadow Realm : Dungeon Escape 🗝️',
    description: 'Dungeon crawler roguelite en vue du dessus ! Éclairez votre route à la torche magique, découvrez des coffres d\'or anciens et affrontez le Roi Squelette spectral.',
    category: 'rpg',
    difficulty: 'Difficile',
    color: 'from-rose-600 to-red-800',
    rating: 95,
    activePlayers: '3.7k',
    creator: 'Abyss Guild',
    badge: 'PAYANT 180 VC 🗡️',
    isPaid: true,
    costVCoins: 180,
    isRankedAvailable: false
  },
  {
    id: 'pixelforge_craft',
    name: 'PixelForge: Craft & Survive',
    frenchName: 'PixelForge : Craft & Survive ⛏️',
    description: 'Survie sandbox voxel ! Récoltez du bois cyber, forgez des barricades en titane et placez des tourelles de défense pour repousser les vagues de creepers nocturnes.',
    category: 'survival',
    difficulty: 'Moyen',
    color: 'from-lime-500 to-emerald-700',
    rating: 94,
    activePlayers: '4.2k',
    creator: 'BlockyCraft Studios',
    badge: 'PAYANT 180 VC 🧱',
    isPaid: true,
    costVCoins: 180,
    isRankedAvailable: false
  },
  {
    id: 'gravity_surge',
    name: 'Gravity Surge: Orbital Jumper',
    frenchName: 'Gravity Surge : Orbital Jumper 🪐',
    description: 'Propulsez votre capsule cosmique d\'une orbite planétaire à l\'autre ! Utilisez la gravité pour accélérer, absorbez les comètes dorées et fuyez l\'horizon du trou noir.',
    category: 'action',
    difficulty: 'Moyen',
    color: 'from-violet-500 to-purple-800',
    rating: 92,
    activePlayers: '2.1k',
    creator: 'CosmoGrav Labs',
    badge: 'PAYANT 150 VC 🌌',
    isPaid: true,
    costVCoins: 150,
    isRankedAvailable: false
  },
  {
    id: 'synth_rider',
    name: 'SynthRider: Neon Beat Drop',
    frenchName: 'SynthRider : Neon Beat Drop 🎵',
    description: 'Jeu de rythme 4 pistes survitaminé ! Frappez les notes néon en rythme avec les drops synthétiques, montez le combo x8 et déclenchez le Mode Fever psychédélique !',
    category: 'rhythm',
    difficulty: 'Difficile',
    color: 'from-pink-500 to-rose-700',
    rating: 98,
    activePlayers: '7.3k',
    creator: 'BeatStorm Interactive',
    badge: 'PAYANT 220 VC 🎧',
    isPaid: true,
    costVCoins: 220,
    isRankedAvailable: false
  },
  {
    id: 'biohazard_defense',
    name: 'BioHazard: Outbreak Defense',
    frenchName: 'BioHazard : Outbreak Defense ☣️',
    description: 'Défense tactique contre une horde de mutants infectés ! Barricadez les accès, déployez des tourelles gatling et mitraillez les vagues de zombies toxiques.',
    category: 'survival',
    difficulty: 'Difficile',
    color: 'from-amber-600 to-red-700',
    rating: 96,
    activePlayers: '4.5k',
    creator: 'Sector Zero Devs',
    badge: 'PAYANT 240 VC 🧟',
    isPaid: true,
    costVCoins: 240,
    isRankedAvailable: false
  },
  {
    id: 'skybound_wings',
    name: 'Skybound: Wings of Acaris',
    frenchName: 'Skybound : Wings of Acaris 🪽',
    description: 'Vol plané immersif au-dessus des îles flottantes ! Déployez vos ailes mécaniques, traversez les anneaux d\'accélération dorés et attrapez les plumes légendaires.',
    category: 'action',
    difficulty: 'Facile',
    color: 'from-sky-400 to-blue-600',
    rating: 93,
    activePlayers: '1.7k',
    creator: 'AeroSky Worlds',
    badge: 'PAYANT 160 VC 🕊️',
    isPaid: true,
    costVCoins: 160,
    isRankedAvailable: false
  }
];

// 3 DEDICATED RANKED GAMES
export const RANKED_GAMES_IDS = ['titan_core', 'quantum_obby', 'aetheria_void'];

// RANKED LADDER TIERS
export const RANKED_TIERS_V3: RankedTier[] = [
  { id: 'bronze', name: 'BRONZE', frenchName: 'Bronze 🛡️', minPoints: 0, color: 'text-amber-500', glow: 'shadow-[0_0_20px_rgba(217,119,6,0.6)]', icon: 'Shield', badgeGradient: 'from-amber-700 to-amber-900' },
  { id: 'silver', name: 'ARGENT', frenchName: 'Argent ⚔️', minPoints: 400, color: 'text-slate-300', glow: 'shadow-[0_0_25px_rgba(203,213,225,0.7)]', icon: 'Award', badgeGradient: 'from-slate-400 to-slate-700' },
  { id: 'gold', name: 'OR', frenchName: 'Or 👑', minPoints: 900, color: 'text-yellow-400', glow: 'shadow-[0_0_30px_rgba(250,204,21,0.8)]', icon: 'Crown', badgeGradient: 'from-yellow-400 to-amber-600' },
  { id: 'platine', name: 'PLATINE', frenchName: 'Platine ⚡', minPoints: 1600, color: 'text-cyan-300', glow: 'shadow-[0_0_35px_rgba(103,232,249,0.85)]', icon: 'Zap', badgeGradient: 'from-cyan-400 to-blue-700' },
  { id: 'diamant', name: 'DIAMANT', frenchName: 'Diamant 💎', minPoints: 2600, color: 'text-fuchsia-300', glow: 'shadow-[0_0_40px_rgba(217,70,239,0.9)]', icon: 'Sparkles', badgeGradient: 'from-fuchsia-500 to-purple-800' },
  { id: 'maitre', name: 'MAÎTRE', frenchName: 'Maître 🔥', minPoints: 4000, color: 'text-rose-400', glow: 'shadow-[0_0_45px_rgba(244,63,94,0.95)]', icon: 'Flame', badgeGradient: 'from-rose-500 to-red-800' },
  { id: 'apex_god', name: 'DIEU APEX', frenchName: 'Dieu Apex 🌌', minPoints: 6000, color: 'text-amber-200', glow: 'shadow-[0_0_55px_rgba(253,230,138,1)]', icon: 'Trophy', badgeGradient: 'from-yellow-300 via-rose-500 to-indigo-600' }
];

// RNG COLLECTIBLES (CYBERPUNK, ARCADE, SCI-FI & GAMING LEGENDS)
export const RNG_UNIVERSE_ITEMS: RngUniverseItem[] = [
  // 1 in 5 to 1 in 50
  {
    id: 'matrice_cyber_apex',
    name: 'Matrice Cyber Apex',
    universe: 'Metaverse',
    rarity: 'Commun',
    chanceDenominator: 5,
    iconName: 'Cpu',
    accentColor: '#38bdf8',
    glowClass: 'shadow-[0_0_15px_rgba(56,189,248,0.5)]',
    description: 'Composant quantique haut débit palpitant d\'énergie néon pure.',
    vcoinWorth: 30
  },
  {
    id: 'boogie_bomb',
    name: 'Grenade Disco Impulsion',
    universe: 'Fortnite',
    rarity: 'Commun',
    chanceDenominator: 12,
    iconName: 'Disc',
    accentColor: '#22c55e',
    glowClass: 'shadow-[0_0_15px_rgba(34,197,94,0.5)]',
    description: 'Déclenche une onde sonore rétro qui fait vibrer toute l\'arène.',
    vcoinWorth: 50
  },
  {
    id: 'golden_apple',
    name: 'Pomme d\'Or Enchantée',
    universe: 'Minecraft',
    rarity: 'Peu Commun',
    chanceDenominator: 28,
    iconName: 'Apple',
    accentColor: '#eab308',
    glowClass: 'shadow-[0_0_20px_rgba(234,179,8,0.6)]',
    description: 'Confère une aura de protection rayonnante et absorbe les chocs.',
    vcoinWorth: 90
  },
  {
    id: 'lame_spectrale_neon',
    name: 'Lame Spectrale Néon',
    universe: 'Metaverse',
    rarity: 'Peu Commun',
    chanceDenominator: 45,
    iconName: 'Zap',
    accentColor: '#facc15',
    glowClass: 'shadow-[0_0_20px_rgba(250,204,21,0.6)]',
    description: 'Dague de combat en lumière solide forgée dans le cœur de Vertex.',
    vcoinWorth: 140
  },

  // 1 in 100 to 1 in 1,000
  {
    id: 'victory_crown',
    name: 'Couronne Royale du Champion',
    universe: 'Fortnite',
    rarity: 'Rare',
    chanceDenominator: 180,
    iconName: 'Crown',
    accentColor: '#fbbf24',
    glowClass: 'shadow-[0_0_25px_rgba(251,191,36,0.7)]',
    description: 'La couronne dorée des champions invaincus.',
    vcoinWorth: 400
  },
  {
    id: 'diamond_sword',
    name: 'Épée en Diamant Céleste',
    universe: 'Minecraft',
    rarity: 'Rare',
    chanceDenominator: 320,
    iconName: 'Sword',
    accentColor: '#06b6d4',
    glowClass: 'shadow-[0_0_25px_rgba(6,182,212,0.75)]',
    description: 'Tranchant V et affûtage plasma dans les profondeurs cristallines.',
    vcoinWorth: 600
  },
  {
    id: 'chug_jug_mythic',
    name: 'Nectar Plasma Infini',
    universe: 'Fortnite',
    rarity: 'Épique',
    chanceDenominator: 850,
    iconName: 'Zap',
    accentColor: '#38bdf8',
    glowClass: 'shadow-[0_0_30px_rgba(56,189,248,0.8)]',
    description: 'Restaure 100% d\'énergie instantanément avec son fluide phosphorescent.',
    vcoinWorth: 1400
  },
  {
    id: 'netherite_blade',
    name: 'Lame Netherite Sombre',
    universe: 'Minecraft',
    rarity: 'Épique',
    chanceDenominator: 1400,
    iconName: 'Flame',
    accentColor: '#78716c',
    glowClass: 'shadow-[0_0_30px_rgba(120,113,108,0.85)]',
    description: 'Forgée dans les débris antiques indestructibles.',
    vcoinWorth: 2200
  },

  // 1 in 5,000 to 1 in 50,000
  {
    id: 'hyper_cristal_quantique',
    name: 'Hyper Cristal Quantique',
    universe: 'Metaverse',
    rarity: 'Légendaire',
    chanceDenominator: 6500,
    iconName: 'Sparkles',
    accentColor: '#a855f7',
    glowClass: 'shadow-[0_0_35px_rgba(168,85,247,0.9)]',
    description: 'Un cristal pulsant qui courbe le temps et amplifie les récompenses.',
    vcoinWorth: 5500
  },
  {
    id: 'reaper_scythe',
    name: 'Faux de l\'Ombre Spectrale',
    universe: 'Fortnite',
    rarity: 'Légendaire',
    chanceDenominator: 9500,
    iconName: 'Moon',
    accentColor: '#94a3b8',
    glowClass: 'shadow-[0_0_35px_rgba(148,163,184,0.95)]',
    description: 'Le son métallique légendaire qui tranche l\'obscurité.',
    vcoinWorth: 8000
  },
  {
    id: 'portal_gun',
    name: 'Générateur de Faille Dimensionnelle',
    universe: 'Metaverse',
    rarity: 'Mythique',
    chanceDenominator: 25000,
    iconName: 'CircleDot',
    accentColor: '#0ea5e9',
    glowClass: 'shadow-[0_0_40px_rgba(14,165,233,1)]',
    description: 'Déchire l\'espace pour voyager instantanément d\'un point à l\'autre.',
    vcoinWorth: 16000
  },
  {
    id: 'couronne_imperiale_or',
    name: 'Couronne Impériale Stellaire',
    universe: 'Metaverse',
    rarity: 'Mythique',
    chanceDenominator: 48000,
    iconName: 'Crown',
    accentColor: '#f43f5e',
    glowClass: 'shadow-[0_0_45px_rgba(244,63,94,1)]',
    description: 'Ailes de lumière majestueuses et ornement d\'or divin.',
    vcoinWorth: 35000
  },

  // 1 in 80,000 to 1 in 350,000
  {
    id: 'black_knight_shield',
    name: 'Égide du Chevalier Noir',
    universe: 'Fortnite',
    rarity: 'Cosmique',
    chanceDenominator: 85000,
    iconName: 'ShieldAlert',
    accentColor: '#ef4444',
    glowClass: 'shadow-[0_0_50px_rgba(239,68,68,1)]',
    description: 'Le bouclier d\'intimidation supreme forgé pour les légendes.',
    vcoinWorth: 65000
  },
  {
    id: 'relique_du_neant',
    name: 'Orbe Singulier du Néant',
    universe: 'Metaverse',
    rarity: 'Cosmique',
    chanceDenominator: 120000,
    iconName: 'Ghost',
    accentColor: '#38bdf8',
    glowClass: 'shadow-[0_0_55px_rgba(56,189,248,1)]',
    description: 'Une distorsion gravitationnelle vivante enveloppée d\'éclairs glacés.',
    vcoinWorth: 95000
  },
  {
    id: 'galaxy_pickaxe',
    name: 'Pioche Stellaire Galaxie',
    universe: 'Fortnite',
    rarity: 'Divin',
    chanceDenominator: 200000,
    iconName: 'Stars',
    accentColor: '#d946ef',
    glowClass: 'shadow-[0_0_60px_rgba(217,70,239,1)]',
    description: 'Une nébuleuse vivante avec constellations en rotation continue.',
    vcoinWorth: 160000
  },
  {
    id: 'diademe_celeste_apex',
    name: 'Diadème Céleste Apex',
    universe: 'Metaverse',
    rarity: 'Divin',
    chanceDenominator: 350000,
    iconName: 'Crown',
    accentColor: '#f59e0b',
    glowClass: 'shadow-[0_0_70px_rgba(245,158,11,1)]',
    description: 'LA RELIQUE ULTIME DU MÉTAVERSE. Le joyau céleste omnipotent de Vertex.',
    vcoinWorth: 350000
  }
];

// INITIAL TRADE REQUESTS
export const INITIAL_TRADE_REQUESTS: TradeRequest[] = [
  {
    id: 'trade_1',
    traderName: 'CyberHunter_99',
    traderAvatar: 'Zap',
    traderTitle: 'Maître Cyber ⚡',
    offeredItemIds: ['lame_spectrale_neon', 'matrice_cyber_apex'],
    offeredVCoins: 200,
    requestedItemIds: ['boogie_bomb'],
    requestedVCoins: 0,
    message: 'Salut ! Je recherche la Grenade Disco, je te propose ma Lame Spectrale et une Matrice en échange.'
  },
  {
    id: 'trade_2',
    traderName: 'AstroCollector_X',
    traderAvatar: 'Crown',
    traderTitle: 'Baleine V-Coins 🐋',
    offeredItemIds: ['victory_crown'],
    offeredVCoins: 500,
    requestedItemIds: ['golden_apple', 'matrice_cyber_apex'],
    requestedVCoins: 0,
    message: 'Offre avantageuse ! Je te propose la Couronne Royale contre ta Pomme d\'Or et ta Matrice.'
  },
  {
    id: 'trade_3',
    traderName: 'ValkyrieQueen',
    traderAvatar: 'Sparkles',
    traderTitle: 'Collectionneuse Mythique 💎',
    offeredItemIds: ['hyper_cristal_quantique'],
    offeredVCoins: 1500,
    requestedItemIds: ['diamond_sword', 'victory_crown'],
    requestedVCoins: 0,
    message: 'Je cherche l\'Épée Diamant et la Couronne pour ma vitrine. Voici mon Hyper Cristal Quantique !'
  }
];

// APEX TROPHY ROAD (VERTEX STELLAR LEAGUE)
export const VERTEX_TROPHY_ROAD: TrophyMilestone[] = [
  { trophiesRequired: 50, leagueName: 'Ligue Recrue I', rewardType: 'vcoins', rewardLabel: '+200 V-Coins', rewardValue: 200, badgeIcon: 'Shield', color: 'text-amber-600' },
  { trophiesRequired: 150, leagueName: 'Ligue Recrue II', rewardType: 'rng_roll', rewardLabel: '3x Tirages Chance RNG 🎲', rewardValue: 3, badgeIcon: 'Dice5', color: 'text-amber-500' },
  { trophiesRequired: 300, leagueName: 'Ligue Bronze I', rewardType: 'title', rewardLabel: 'Titre : Éclaireur de Ligue ⚡', rewardValue: 'Éclaireur de Ligue ⚡', badgeIcon: 'Award', color: 'text-amber-400' },
  { trophiesRequired: 500, leagueName: 'Ligue Bronze II', rewardType: 'vcoins', rewardLabel: '+500 V-Coins', rewardValue: 500, badgeIcon: 'Coins', color: 'text-yellow-400' },
  { trophiesRequired: 750, leagueName: 'Ligue Argent I', rewardType: 'hat', rewardLabel: 'Casque : Visière Cyber Pro 🪖', rewardValue: 'hat_cap_pro', badgeIcon: 'Crown', color: 'text-slate-300' },
  { trophiesRequired: 1000, leagueName: 'Ligue Argent II', rewardType: 'vcoins', rewardLabel: '+1 000 V-Coins', rewardValue: 1000, badgeIcon: 'Zap', color: 'text-slate-200' },
  { trophiesRequired: 1500, leagueName: 'Ligue Or I', rewardType: 'aura', rewardLabel: 'Aura : Particules Solaires 🌟', rewardValue: 'aura_solar', badgeIcon: 'Sun', color: 'text-yellow-300' },
  { trophiesRequired: 2000, leagueName: 'Ligue Or II', rewardType: 'vcoins', rewardLabel: '+2 000 V-Coins', rewardValue: 2000, badgeIcon: 'Trophy', color: 'text-yellow-400' },
  { trophiesRequired: 3000, leagueName: 'Ligue Diamant I', rewardType: 'title', rewardLabel: 'Titre : Maître des Arènes 💎', rewardValue: 'Maître des Arènes 💎', badgeIcon: 'Sparkles', color: 'text-fuchsia-300' },
  { trophiesRequired: 5000, leagueName: 'Ligue Légendaire', rewardType: 'hat', rewardLabel: 'Couronne : Diadème Néon Apex 👑', rewardValue: 'hat_dominus_neon', badgeIcon: 'Crown', color: 'text-rose-400' },
  { trophiesRequired: 7500, leagueName: 'Ligue Maître Apex', rewardType: 'vcoins', rewardLabel: '+10 000 V-Coins Jackpots', rewardValue: 10000, badgeIcon: 'Trophy', color: 'text-amber-300' },
  { trophiesRequired: 10000, leagueName: 'Ligue Céleste Suprême', rewardType: 'aura', rewardLabel: 'Aura : Trou Noir d\'Omnipotence 🌌', rewardValue: 'aura_black_hole', badgeIcon: 'Sparkles', color: 'text-cyan-200' }
];
export const APEX_TROPHY_ROAD = VERTEX_TROPHY_ROAD;

// REBUILT ARCADE PASS (50 LEVELS)
export const PASS_LEVELS_V3: PassLevel[] = Array.from({ length: 50 }, (_, i) => {
  const lvl = i + 1;
  const freeVC = 150 + lvl * 40;
  const premVC = 350 + lvl * 80;

  let freeReward: PassLevelReward = { type: 'vcoins', value: freeVC, label: `+${freeVC} VC`, icon: 'Coins' };
  let premiumReward: PassLevelReward = { type: 'vcoins', value: premVC, label: `+${premVC} VC`, icon: 'Sparkles' };

  if (lvl === 5) {
    freeReward = { type: 'title', value: 'Pilote Déterminé ⚡', label: 'Titre : Pilote Déterminé ⚡', icon: 'Award' };
    premiumReward = { type: 'hat', value: 'hat_cyber_shades', label: 'Visière Cyber Matrix 😎', icon: 'Eye' };
  } else if (lvl === 15) {
    premiumReward = { type: 'aura', value: 'aura_plasma_ring', label: 'Aura : Anneau Plasma 🔮', icon: 'Sparkles' };
  } else if (lvl === 25) {
    freeReward = { type: 'rng_ticket', value: 5, label: '5x Tirages Chance RNG 🎲', icon: 'Dice5' };
    premiumReward = { type: 'hat', value: 'hat_halo_angel', label: 'Halo Céleste d\'Or 😇', icon: 'Crown' };
  } else if (lvl === 40) {
    premiumReward = { type: 'banner', value: 'banner_apex_nebula', label: 'Bannière Nébuleuse Apex 🌌', icon: 'Layers' };
  } else if (lvl === 50) {
    freeReward = { type: 'title', value: 'Vétéran Apex Suprême 👑', label: 'Titre : Vétéran Apex 👑', icon: 'Crown' };
    premiumReward = { type: 'hat', value: 'hat_dominus_apex', label: 'COURONNE APEX OMNI 👑🔥', icon: 'Crown' };
  }

  return { level: lvl, freeReward, premiumReward };
});

// REBUILT QUESTS (DAILY, WEEKLY, METAVERSE)
export const INITIAL_QUESTS_V3: Quest[] = [
  { id: 'q_daily_1', title: 'Première Victoire du Jour', description: 'Terminez 1 partie sur n\'importe quel jeu', target: 1, current: 0, rewardVCoins: 150, rewardXp: 100, isCompleted: false, isClaimed: false, category: 'daily', icon: 'Play' },
  { id: 'q_daily_2', title: 'Maître de la Vitesse', description: 'Atteignez au moins 250 points dans Quantum Velocity', target: 250, current: 0, rewardVCoins: 200, rewardXp: 150, isCompleted: false, isClaimed: false, gameId: 'quantum_obby', category: 'daily', icon: 'Flame' },
  { id: 'q_daily_3', title: 'Moisson de V-Coins', description: 'Gagnez au moins 300 V-Coins lors de vos sessions', target: 300, current: 0, rewardVCoins: 250, rewardXp: 200, isCompleted: false, isClaimed: false, category: 'daily', icon: 'Coins' },
  { id: 'q_daily_4', title: 'Tirage au Sanctuaire', description: 'Effectuez au moins 2 tirages RNG dans le Sanctuaire', target: 2, current: 0, rewardVCoins: 180, rewardXp: 140, isCompleted: false, isClaimed: false, category: 'daily', icon: 'Dice5' },
  { id: 'q_weekly_1', title: 'Marathon de Jeux 3.0', description: 'Jouez à 10 parties complètes cette semaine', target: 10, current: 0, rewardVCoins: 800, rewardXp: 600, isCompleted: false, isClaimed: false, category: 'weekly', icon: 'Trophy', multiplier: 2 },
  { id: 'q_weekly_2', title: 'Lame d\'Aetheria', description: 'Marquez plus de 500 points dans Aetheria: Void Blade', target: 500, current: 0, rewardVCoins: 900, rewardXp: 750, isCompleted: false, isClaimed: false, gameId: 'aetheria_void', category: 'weekly', icon: 'Sword', multiplier: 2.5 },
  { id: 'q_weekly_3', title: 'Négociateur en Chef', description: 'Complétez ou proposez un échange dans le Marché', target: 1, current: 0, rewardVCoins: 700, rewardXp: 500, isCompleted: false, isClaimed: false, category: 'weekly', icon: 'RefreshCw' },
  { id: 'q_meta_1', title: 'Assaut sur le Titan Glitch', description: 'Infligez au moins 5 000 points de dégâts au World Boss', target: 5000, current: 0, rewardVCoins: 2000, rewardXp: 1500, isCompleted: false, isClaimed: false, category: 'metaverse', icon: 'Skull', multiplier: 3 }
];

// 200 ACHIEVEMENTS
export const INITIAL_ACHIEVEMENTS_200: Achievement[] = Array.from({ length: 200 }, (_, i) => {
  const idNum = i + 1;
  let category: Achievement['category'] = 'gameplay';
  let title = `Succès #${idNum}`;
  let desc = `Accomplissez le défi d'arcade numéro #${idNum}`;
  let icon = 'Trophy';

  if (idNum <= 30) {
    category = 'gameplay';
    title = idNum === 1 ? 'Premier Pas d\'Arcade' : idNum === 2 ? 'Survivant du Laser' : idNum === 3 ? 'Combo Électrique' : `Maîtrise d'Action ${idNum}`;
    desc = `Cumulez des points et brillez dans les jeux d'action et d'arcade (${idNum})`;
    icon = 'Zap';
  } else if (idNum <= 60) {
    category = 'ranked';
    title = `Grimpeur Classé Niv. ${idNum - 30}`;
    desc = `Enchaînez les victoires en mode Classé et accumulez des Points de Rang (${(idNum - 30) * 100} RP)`;
    icon = 'Award';
  } else if (idNum <= 90) {
    category = 'trophy';
    title = `Ligue Stellaire Palier ${idNum - 60}`;
    desc = `Grimpez sur la route des trophées Vertex (${(idNum - 60) * 80} 🏆)`;
    icon = 'Crown';
  } else if (idNum <= 130) {
    category = 'rng';
    title = `Collectionneur Stellaire #${idNum - 90}`;
    desc = `Découvrez des reliques mythiques au Sanctuaire RNG (${idNum - 90} objets)`;
    icon = 'Sparkles';
  } else if (idNum <= 155) {
    category = 'trade';
    title = `Marchand du Métaverse #${idNum - 130}`;
    desc = `Échangez des objets et cosmétiques avec la communauté (${idNum - 130} trocs)`;
    icon = 'RefreshCw';
  } else if (idNum <= 180) {
    category = 'cosmetics';
    title = `Style & Personnalisation #${idNum - 155}`;
    desc = `Équipez des casques, visières néon et auras de particules exclusives (${idNum - 155})`;
    icon = 'Shirt';
  } else {
    category = 'secret';
    title = `Secret Apex Cosmique #${idNum - 180} 🔮`;
    desc = `Débloquez l'un des mystères cachés de Vertex Arcades v3.0 (${idNum - 180})`;
    icon = 'Ghost';
  }

  return {
    id: `ach_${idNum}`,
    title,
    frenchTitle: title,
    description: desc,
    frenchDescription: desc,
    vcoinReward: 50 + (idNum % 10) * 25,
    isUnlocked: idNum === 1,
    icon,
    category
  };
});

// COSMETICS SHOP (PURIFIED CYBER & ARCADE)
export interface ShopCosmetic {
  id: string;
  name: string;
  category: 'hat' | 'aura' | 'title' | 'frame' | 'banner' | 'sound';
  costVCoins: number;
  rarity: CosmeticRarity;
  preview: string;
  description: string;
}

export const NEW_COSMETICS_SHOP: ShopCosmetic[] = [
  // Casques & Équipements
  { id: 'hat_cap_pro', name: 'Visière Cyber Pro', category: 'hat', costVCoins: 200, rarity: 'commun', preview: '🪖', description: 'Casque futuriste haute visibilité avec télémètre intégré.' },
  { id: 'hat_cyber_shades', name: 'Lunettes Cyber Matrix', category: 'hat', costVCoins: 350, rarity: 'rare', preview: '🕶️', description: 'Verres polarisés néon avec affichage tête haute intégré.' },
  { id: 'hat_halo_angel', name: 'Halo Céleste d\'Or', category: 'hat', costVCoins: 750, rarity: 'epique', preview: '😇', description: 'Flotte au-dessus de votre avatar en diffusant des lueurs divines.' },
  { id: 'hat_valkyrie_gold', name: 'Casque Valkyrie Cyber', category: 'hat', costVCoins: 1800, rarity: 'legendaire', preview: '🪽', description: 'Ailes de lumière et armature en adamantium étincelant.' },
  { id: 'hat_dominus_apex', name: 'Couronne Sombre Apex', category: 'hat', costVCoins: 5000, rarity: 'divin', preview: '👑', description: 'Le couvre-chef suprême du métaverse. Respect instantané de tous.' },

  // Auras
  { id: 'aura_blue_fire', name: 'Aura Flammes Bleues', category: 'aura', costVCoins: 300, rarity: 'rare', preview: '🔥', description: 'Piliers de feu bleu enveloppant chaque saut de votre avatar.' },
  { id: 'aura_glitch_matrix', name: 'Aura Glitch Cybernétique', category: 'aura', costVCoins: 600, rarity: 'epique', preview: '👾', description: 'Effet de décalage temporel glitché vert phosphorescent.' },
  { id: 'aura_supernova', name: 'Aura Supernova Cosmique', category: 'aura', costVCoins: 1500, rarity: 'legendaire', preview: '✨', description: 'Constellations en rotation continue et éclats stellaires.' },
  { id: 'aura_black_hole', name: 'Aura Singularité Céleste', category: 'aura', costVCoins: 4500, rarity: 'divin', preview: '🌌', description: 'Courbure spatio-temporelle avec anneaux de particules gravitationnels.' },

  // Titres
  { id: 'title_obby_god', name: '⚡ Maître de la Vitesse', category: 'title', costVCoins: 250, rarity: 'rare', preview: '⚡', description: 'Prouve que la vélocité n\'a aucun secret pour vous.' },
  { id: 'title_vc_whale', name: '🐋 Baleine à V-Coins', category: 'title', costVCoins: 900, rarity: 'epique', preview: '💎', description: 'Pour ceux dont le compte en banque ne cesse de déborder.' },
  { id: 'title_rng_blessed', name: '🍀 Béni par le RNG', category: 'title', costVCoins: 1200, rarity: 'legendaire', preview: '🌟', description: 'La chance cosmique est de votre côté à chaque tirage.' },
  { id: 'title_creator', name: '🔨 Architecte du Métaverse', category: 'title', costVCoins: 3500, rarity: 'divin', preview: '👑', description: 'Le statut légendaire des bâtisseurs de Vertex.' },

  // Cadres de profil
  { id: 'frame_neon_cyan', name: 'Cadre Cyber Néon', category: 'frame', costVCoins: 200, rarity: 'commun', preview: '🔲', description: 'Bordure rectangulaire biseautée cyan haute intensité.' },
  { id: 'frame_gold_royale', name: 'Cadre Or Victoire Royale', category: 'frame', costVCoins: 500, rarity: 'rare', preview: '🥇', description: 'Cadre orné d\'étoiles dorées et de lauriers de triomphe.' },
  { id: 'frame_cosmic_pulse', name: 'Cadre Pulsar Céleste', category: 'frame', costVCoins: 1100, rarity: 'legendaire', preview: '🔮', description: 'Bordure holographique animée aux couleurs changeantes.' },

  // Bannières
  { id: 'banner_cyber_grid', name: 'Bannière Grille Cyber', category: 'banner', costVCoins: 250, rarity: 'commun', preview: '🧱', description: 'Grille futuriste 3D sous un ciel nocturne étoilé.' },
  { id: 'banner_apex_city', name: 'Bannière Mégapole 2099', category: 'banner', costVCoins: 650, rarity: 'epique', preview: '🏙️', description: 'Skylines cyberpunk baignées d\'hologrammes géants.' },
  { id: 'banner_void_galaxy', name: 'Bannière Faille Dimensionnelle', category: 'banner', costVCoins: 1600, rarity: 'legendaire', preview: '🌌', description: 'Une déchirure dans l\'espace vers un univers parallèle.' },

  // Packs de Sons
  { id: 'sound_oof_pack', name: 'Pack Sons Punch & Impact', category: 'sound', costVCoins: 400, rarity: 'rare', preview: '🔊', description: 'Bruits d\'impacts vigoureux et alertes sonores électro.' },
  { id: 'sound_retro_8bit', name: 'Pack Sons Chiptune Vintage', category: 'sound', costVCoins: 600, rarity: 'epique', preview: '🎶', description: 'Sons de synthétiseur 8-bit inspirés des bornes d\'arcade japonaises.' }
];
