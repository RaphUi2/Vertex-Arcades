import {
  GameData, Quest, Achievement, PassLevel, PassLevelReward,
  CosmeticRarity, RngUniverseItem, TradeRequest, RankedTier, TrophyMilestone
} from './types';

// 79 Selectable Description Tags for Profile Creator
export const PROFILE_TAGS_79: string[] = [
  'Pro Gamer', 'Apex Runner', 'Speedrunner', 'Trader', 'PvP God', 'Builder',
  'Boss Hunter', 'AFK Grinder', 'Tycoon Master', 'Anime Fan', 'V-Coins Whale', 'Arcade Veteran',
  'Competitive', 'Chill Vibes', 'Pixel Artist', 'Glitch Hunter', 'Streamer', 'Cyber Knight',
  'High Roller', 'Leaderboard Climber', 'RNG Luck 999', 'Collector', 'Casual', 'Hardcore',
  'Night Owl', 'Speed Demon', 'Cyber Samurai', 'Neon Master', 'Champion Stellaire', 'Apex Predator',
  'Trophy Hunter', 'Pass Maxer', 'Event Specialist', 'Secret Finder', 'Beta Tester', 'VIP Member',
  'Mythic Owner', 'Soundtrack Lover', 'Manette Player', 'One-Shot King', 'Dodge Master', 'Combo Breaker',
  'Lucky Star', 'Matrix Hacker', 'Galaxy Brain', 'Challenger', 'Grand Master', 'Unstoppable',
  'Solo Carry', 'Arcade Legend', 'Creative Master', 'Void Walker', 'Sniper Apex', 'Boss Slayer',
  'Retro Gamer', 'Void Striker', 'Loot Goblin', 'Tactician', 'Matrix Runner',
  'Overclocked', 'Speed Legend', 'Pixel Ninja', 'Laser Master', 'Boss Devourer',
  'Crypto Miner', 'Diamond Hands', 'Stealth Operative', 'Cosmic Pilot', 'Quantum Brain',
  'Chaos Enjoyer', 'Glitch Breaker', 'High Roller VIP', 'Zero Gravity', 'Adrenaline Junkie',
  'Arcade God', 'Neon Knight', 'Infinite Stamina', 'Starlight Master', 'Apex Legend'
];
export const PROFILE_TAGS_54 = PROFILE_TAGS_79;

// 5 GAMES: EXACTLY 3 FREE, 2 PAID IN V-COINS (Clean vector arcade cards & banners)
export const GAMES_LIST: GameData[] = [
  // 1. FREE GAME #1: Runner
  {
    id: "cyber_runner_2099",
    name: "Runner",
    frenchName: "Runner",
    description: "Course effrénée sur les autoroutes célestes ! Esquivez les barrages laser, sautez par-dessus les drones et ramassez les orbes de vitesse.",
    category: "platformer",
    difficulty: "Moyen",
    color: "from-cyan-500 to-blue-600",
    creator: "Apex Works",
    badge: "GRATUIT 🔥",
    isPaid: false,
    costVCoins: 0,
    isRankedAvailable: true
  },
  // 2. FREE GAME #2: Cosmic
  {
    id: "cosmic_defender",
    name: "Cosmic",
    frenchName: "Cosmic",
    description: "Shoot'em up spatial haute intensité ! Repoussez les nuées d'envahisseurs stellaires, débloquez les tirs triples et anéantissez les vaisseaux amiraux.",
    category: "action",
    difficulty: "Difficile",
    color: "from-blue-600 to-indigo-800",
    creator: "Starlight Defense",
    badge: "GRATUIT 🌟",
    isPaid: false,
    costVCoins: 0,
    isRankedAvailable: true
  },
  // 3. FREE GAME #3: Dungeon
  {
    id: "pixel_dungeon_quest",
    name: "Dungeon",
    frenchName: "Dungeon",
    description: "Aventure rogue-lite rétro au cœur des catacombes hantées ! Frayez-vous un chemin à coups d'épée magique, amassez des trésors et terrassez le Seigneur Dragon.",
    category: "rpg",
    difficulty: "Moyen",
    color: "from-emerald-500 to-teal-700",
    creator: "RetroBit Studios",
    badge: "GRATUIT 🏆",
    isPaid: false,
    costVCoins: 0,
    isRankedAvailable: true
  },

  // 4. PAID GAME #1: Pinball
  {
    id: "titan_pinball_titan",
    name: "Pinball",
    frenchName: "Pinball",
    description: "Flipper cyber-arcade surpuissant ! Activez les multiplicateurs quantiques, déclenchez le Multiball frénétique et explosez le jackpot des Titans.",
    category: "action",
    difficulty: "Difficile",
    color: "from-amber-500 to-orange-700",
    creator: "Apex Pinball Labs",
    badge: "VIP 150 VC 💎",
    isPaid: true,
    costVCoins: 150,
    isRankedAvailable: false
  },
  // 5. PAID GAME #2: Laser
  {
    id: "quantum_strike",
    name: "Laser",
    frenchName: "Laser",
    description: "Assaut laser de précision et réflexes extrêmes ! Verrouillez les cibles énergétiques en temps réel, chargez vos combos x10 et désintégrez les anomalies.",
    category: "puzzle",
    difficulty: "Extrême",
    color: "from-purple-500 to-fuchsia-700",
    creator: "CyberStrike Core",
    badge: "VIP 250 VC ⚡",
    isPaid: true,
    costVCoins: 250,
    isRankedAvailable: false
  }
];

// 3 DEDICATED RANKED GAMES
export const RANKED_GAMES_IDS = ['cyber_runner_2099', 'cosmic_defender', 'pixel_dungeon_quest'];

// RANKED LADDER TIERS
export const RANKED_TIERS_V3: RankedTier[] = [
  { id: 'bronze', name: 'BRONZE', frenchName: 'Bronze 🛡️', minPoints: 0, color: 'text-amber-500', glow: 'shadow-[0_0_20px_rgba(217,119,6,0.6)]', icon: 'Shield', badgeGradient: 'from-amber-700 to-amber-900' },
  { id: 'silver', name: 'ARGENT', frenchName: 'Argent ⚔️', minPoints: 400, color: 'text-slate-300', glow: 'shadow-[0_0_25px_rgba(203,213,225,0.7)]', icon: 'Award', badgeGradient: 'from-slate-400 to-slate-700' },
  { id: 'gold', name: 'OR', frenchName: 'Or 👑', minPoints: 900, color: 'text-yellow-400', glow: 'shadow-[0_0_30px_rgba(250,204,21,0.8)]', icon: 'Crown', badgeGradient: 'from-yellow-400 to-amber-600' },
  { id: 'platine', name: 'PLATINE', frenchName: 'Platine 💎', minPoints: 1600, color: 'text-cyan-400', glow: 'shadow-[0_0_35px_rgba(34,211,238,0.85)]', icon: 'Zap', badgeGradient: 'from-cyan-400 to-blue-600' },
  { id: 'diamant', name: 'DIAMANT', frenchName: 'Diamant 🔮', minPoints: 2600, color: 'text-purple-400', glow: 'shadow-[0_0_40px_rgba(192,132,252,0.9)]', icon: 'Sparkles', badgeGradient: 'from-purple-500 to-indigo-700' },
  { id: 'maitre', name: 'MAÎTRE', frenchName: 'Maître 🔥', minPoints: 4000, color: 'text-rose-400', glow: 'shadow-[0_0_45px_rgba(244,63,94,0.95)]', icon: 'Flame', badgeGradient: 'from-rose-500 to-red-800' },
  { id: 'apex_god', name: 'DIEU APEX', frenchName: 'Dieu Apex 👑⚡', minPoints: 6000, color: 'text-yellow-300', glow: 'shadow-[0_0_55px_rgba(253,224,71,1)]', icon: 'Trophy', badgeGradient: 'from-yellow-300 via-amber-500 to-orange-600' }
];

// RNG UNIVERSE RELICS (24 MYTHICAL ARTIFACTS)
export const RNG_UNIVERSE_ITEMS: RngUniverseItem[] = [
  {
    id: 'lame_spectrale_neon',
    name: 'Lame Spectrale Néon',
    universe: 'Cyberverse',
    rarity: 'Commun',
    chanceDenominator: 2,
    iconName: 'Sword',
    accentColor: '#06b6d4',
    glowClass: 'shadow-[0_0_15px_rgba(6,182,212,0.4)]',
    description: 'Une lame d\'énergie forgée dans les bas-fonds de Vertex.',
    vcoinWorth: 50
  },
  {
    id: 'pixel_potion_xp',
    name: 'Potion de Données XP',
    universe: 'Cyberverse',
    rarity: 'Commun',
    chanceDenominator: 3,
    iconName: 'Zap',
    accentColor: '#10b981',
    glowClass: 'shadow-[0_0_15px_rgba(16,185,129,0.4)]',
    description: 'Booste instantanément votre résonance avec la matrice.',
    vcoinWorth: 75
  },
  {
    id: 'pioche_fer',
    name: 'Pioche en Fer Forgé',
    universe: 'Minecraft',
    rarity: 'Peu Commun',
    chanceDenominator: 5,
    iconName: 'Pickaxe',
    accentColor: '#94a3b8',
    glowClass: 'shadow-[0_0_18px_rgba(148,163,184,0.5)]',
    description: 'Outil classique d\'extraction de blocs voxel.',
    vcoinWorth: 120
  },
  {
    id: 'shield_potion_mini',
    name: 'Mini Potion de Bouclier',
    universe: 'Fortnite',
    rarity: 'Peu Commun',
    chanceDenominator: 8,
    iconName: 'Shield',
    accentColor: '#38bdf8',
    glowClass: 'shadow-[0_0_20px_rgba(56,189,248,0.5)]',
    description: 'Confère +25 d\'armure d\'arcade protectrice.',
    vcoinWorth: 200
  },
  {
    id: 'boogie_bomb',
    name: 'Grenade Disco Boogie',
    universe: 'Fortnite',
    rarity: 'Rare',
    chanceDenominator: 15,
    iconName: 'Bomb',
    accentColor: '#ec4899',
    glowClass: 'shadow-[0_0_25px_rgba(236,72,153,0.6)]',
    description: 'Force tous les joueurs alentour à danser pendant 5 secondes.',
    vcoinWorth: 450
  },
  {
    id: 'arc_sylvestre',
    name: 'Arc des Korogus',
    universe: 'Zelda',
    rarity: 'Rare',
    chanceDenominator: 25,
    iconName: 'Target',
    accentColor: '#84cc16',
    glowClass: 'shadow-[0_0_25px_rgba(132,204,22,0.6)]',
    description: 'Tire trois flèches spectrales d\'énergie naturelle.',
    vcoinWorth: 700
  },
  {
    id: 'diamond_sword',
    name: 'Épée en Diamant Enchantée',
    universe: 'Minecraft',
    rarity: 'Épique',
    chanceDenominator: 50,
    iconName: 'Sparkles',
    accentColor: '#0ea5e9',
    glowClass: 'shadow-[0_0_30px_rgba(14,165,233,0.7)]',
    description: 'Tranchant V avec aura phosphorescente aqua.',
    vcoinWorth: 1500
  },
  {
    id: 'matrice_cyber_apex',
    name: 'Matrice Cybernétique Apex',
    universe: 'Apex Legends',
    rarity: 'Épique',
    chanceDenominator: 100,
    iconName: 'Cpu',
    accentColor: '#a855f7',
    glowClass: 'shadow-[0_0_35px_rgba(168,85,247,0.75)]',
    description: 'Processeur quantique octroyant des réflexes surhumains.',
    vcoinWorth: 3000
  },
  {
    id: 'kunai_wraith',
    name: 'Kunai Dimensionnel de Wraith',
    universe: 'Apex Legends',
    rarity: 'Légendaire',
    chanceDenominator: 500,
    iconName: 'Flame',
    accentColor: '#f43f5e',
    glowClass: 'shadow-[0_0_40px_rgba(244,63,94,0.85)]',
    description: 'Heirloom d\'élite déchirant l\'espace lors des sprints.',
    vcoinWorth: 8500
  },
  {
    id: 'golden_apple',
    name: 'Pomme de Notch Enchantée',
    universe: 'Minecraft',
    rarity: 'Légendaire',
    chanceDenominator: 1200,
    iconName: 'Apple',
    accentColor: '#f59e0b',
    glowClass: 'shadow-[0_0_45px_rgba(245,158,11,0.9)]',
    description: 'Régénération absolue et résistance aux chutes du néant.',
    vcoinWorth: 15000
  },
  {
    id: 'master_sword',
    name: 'Lame Purificatrice Légendaire',
    universe: 'Zelda',
    rarity: 'Mythique',
    chanceDenominator: 5000,
    iconName: 'Sun',
    accentColor: '#38bdf8',
    glowClass: 'shadow-[0_0_55px_rgba(56,189,248,1)]',
    description: 'L\'épée mythique qui repousse le mal et scelle les glitches.',
    vcoinWorth: 40000
  },
  {
    id: 'victory_crown',
    name: 'Couronne Royale de Victoire',
    universe: 'Fortnite',
    rarity: 'Mythique',
    chanceDenominator: 10000,
    iconName: 'Crown',
    accentColor: '#eab308',
    glowClass: 'shadow-[0_0_60px_rgba(234,179,8,1)]',
    description: 'Illumine votre pseudo en doré étincelant avec EXP doublée.',
    vcoinWorth: 80000
  },
  {
    id: 'hyper_cristal_quantique',
    name: 'Hyper Cristal d\'Omnipotence',
    universe: 'Metaverse',
    rarity: 'Cosmique',
    chanceDenominator: 50000,
    iconName: 'Orbit',
    accentColor: '#ec4899',
    glowClass: 'shadow-[0_0_65px_rgba(236,72,153,1)]',
    description: 'Une pulsation d\'énergie pure capable de plier la physique.',
    vcoinWorth: 150000
  },
  {
    id: 'orbe_singularity',
    name: 'Orbe Primordial du Métaverse',
    universe: 'Metaverse',
    rarity: 'Divin',
    chanceDenominator: 200000,
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

// LIGUE DES TROPHÉES: EVERY 100 TROPHIES UP TO 25,000 TROPHIES (250 Milestones)
export const VERTEX_TROPHY_ROAD: TrophyMilestone[] = Array.from({ length: 250 }, (_, i) => {
  const trophies = (i + 1) * 100;
  let rewardType: TrophyMilestone['rewardType'] = 'vcoins';
  let rewardLabel = `+${100 + i * 25} V-Coins`;
  let rewardValue: any = 100 + i * 25;
  let badgeIcon = 'Coins';
  let color = 'text-yellow-400';

  let leagueName = 'Ligue Recrue';
  if (trophies > 20000) leagueName = 'Ligue Grand Maître Suprême';
  else if (trophies > 15000) leagueName = 'Ligue Titan Céleste';
  else if (trophies > 10000) leagueName = 'Ligue Diamant Apex';
  else if (trophies > 5000) leagueName = 'Ligue Or';
  else if (trophies > 2000) leagueName = 'Ligue Argent';
  else if (trophies > 1000) leagueName = 'Ligue Bronze';

  if (trophies === 1000) {
    rewardType = 'title';
    rewardLabel = 'Titre : Éclaireur de Ligue ⚡';
    rewardValue = 'Éclaireur de Ligue ⚡';
    badgeIcon = 'Award';
    color = 'text-amber-400';
  } else if (trophies === 2500) {
    rewardType = 'hat';
    rewardLabel = 'Casque : Visière Cyber Pro 🪖';
    rewardValue = 'hat_cap_pro';
    badgeIcon = 'Crown';
    color = 'text-cyan-400';
  } else if (trophies === 5000) {
    rewardType = 'aura';
    rewardLabel = 'Aura : Supernova Cosmique ✨';
    rewardValue = 'aura_supernova';
    badgeIcon = 'Sparkles';
    color = 'text-purple-400';
  } else if (trophies === 10000) {
    rewardType = 'title';
    rewardLabel = 'Titre : Maître des 10K 💎';
    rewardValue = 'Maître des 10K 💎';
    badgeIcon = 'Trophy';
    color = 'text-fuchsia-400';
  } else if (trophies === 15000) {
    rewardType = 'hat';
    rewardLabel = 'Couronne : Diadème Sombre 👑';
    rewardValue = 'hat_dominus_apex';
    badgeIcon = 'Crown';
    color = 'text-rose-400';
  } else if (trophies === 20000) {
    rewardType = 'aura';
    rewardLabel = 'Aura : Singularité Céleste 🌌';
    rewardValue = 'aura_black_hole';
    badgeIcon = 'Sparkles';
    color = 'text-cyan-300';
  } else if (trophies === 25000) {
    rewardType = 'title';
    rewardLabel = 'Titre : DIEU DE LA LIGUE 25K 🏆👑';
    rewardValue = 'DIEU DE LA LIGUE 25K 🏆👑';
    badgeIcon = 'Trophy';
    color = 'text-yellow-300';
  } else if (trophies % 1000 === 0) {
    rewardType = 'rng_roll';
    rewardLabel = `${3 + Math.floor(trophies / 2000)}x Tirages Chance RNG 🎲`;
    rewardValue = 3 + Math.floor(trophies / 2000);
    badgeIcon = 'Dice5';
    color = 'text-emerald-400';
  } else if (trophies % 500 === 0) {
    rewardType = 'rng_roll';
    rewardLabel = '2x Tirages Chance RNG 🎲';
    rewardValue = 2;
    badgeIcon = 'Dice5';
    color = 'text-emerald-400';
  }

  return {
    trophiesRequired: trophies,
    leagueName,
    rewardType,
    rewardLabel,
    rewardValue,
    badgeIcon,
    color
  };
});
export const APEX_TROPHY_ROAD = VERTEX_TROPHY_ROAD;

// REBUILT ARCADE PASS (50 LEVELS WITH VARIED REWARDS)
export const PASS_LEVELS_V3: PassLevel[] = Array.from({ length: 50 }, (_, i) => {
  const lvl = i + 1;
  const freeVC = 120 + lvl * 30;
  const premVC = 300 + lvl * 60;

  let freeReward: PassLevelReward = { type: 'vcoins', value: freeVC, label: `+${freeVC} VC`, icon: 'Coins' };
  let premiumReward: PassLevelReward = { type: 'vcoins', value: premVC, label: `+${premVC} VC`, icon: 'Sparkles' };

  if (lvl % 5 === 0) {
    if (lvl === 5) {
      freeReward = { type: 'title', value: 'Pilote Déterminé ⚡', label: 'Titre : Pilote Déterminé ⚡', icon: 'Award' };
      premiumReward = { type: 'hat', value: 'hat_cyber_shades', label: 'Visière Cyber Matrix 😎', icon: 'Eye' };
    } else if (lvl === 10) {
      freeReward = { type: 'rng_ticket', value: 3, label: '3x Tirages RNG 🎲', icon: 'Dice5' };
      premiumReward = { type: 'title', value: 'Seigneur du Pass 🌟', label: 'Titre : Seigneur du Pass 🌟', icon: 'Crown' };
    } else if (lvl === 15) {
      freeReward = { type: 'vcoins', value: 800, label: '+800 VC Bonus', icon: 'Coins' };
      premiumReward = { type: 'aura', value: 'aura_supernova', label: 'Aura : Supernova Cosmique ✨', icon: 'Sparkles' };
    } else if (lvl === 20) {
      freeReward = { type: 'title', value: 'Survivant d\'Élite 🛡️', label: 'Titre : Survivant d\'Élite 🛡️', icon: 'Shield' };
      premiumReward = { type: 'frame', value: 'frame_cosmic_pulse', label: 'Cadre Pulsar Céleste 🔮', icon: 'Sparkles' };
    } else if (lvl === 25) {
      freeReward = { type: 'rng_ticket', value: 5, label: '5x Tirages Chance RNG 🎲', icon: 'Dice5' };
      premiumReward = { type: 'hat', value: 'hat_halo_angel', label: 'Halo Céleste d\'Or 😇', icon: 'Crown' };
    } else if (lvl === 30) {
      freeReward = { type: 'vcoins', value: 1500, label: '+1 500 VC Jackpots', icon: 'Coins' };
      premiumReward = { type: 'title', value: 'Demi-Dieu de l\'Arcade ⚡', label: 'Titre : Demi-Dieu Arcade ⚡', icon: 'Trophy' };
    } else if (lvl === 35) {
      freeReward = { type: 'rng_ticket', value: 8, label: '8x Tirages Chance RNG 🎲', icon: 'Dice5' };
      premiumReward = { type: 'hat', value: 'hat_valkyrie_gold', label: 'Ailes de Valkyrie Divines 🪽', icon: 'Crown' };
    } else if (lvl === 40) {
      freeReward = { type: 'vcoins', value: 2500, label: '+2 500 VC Trésor', icon: 'Coins' };
      premiumReward = { type: 'banner', value: 'banner_void_galaxy', label: 'Bannière Faille Galactique 🌌', icon: 'Layers' };
    } else if (lvl === 45) {
      freeReward = { type: 'rng_ticket', value: 10, label: '10x Tirages Chance RNG 🎲', icon: 'Dice5' };
      premiumReward = { type: 'aura', value: 'aura_black_hole', label: 'Aura : Singularité Céleste 🌌', icon: 'Sparkles' };
    } else if (lvl === 50) {
      freeReward = { type: 'title', value: 'VÉTÉRAN APEX SUPRÊME 👑', label: 'Titre : Vétéran Apex 👑', icon: 'Crown' };
      premiumReward = { type: 'hat', value: 'hat_dominus_apex', label: 'COURONNE SOMBRE APEX 👑🔥', icon: 'Crown' };
    }
  } else if (lvl % 3 === 0) {
    freeReward = { type: 'rng_ticket', value: 2, label: '2x Tirages RNG 🎲', icon: 'Dice5' };
  }

  return { level: lvl, freeReward, premiumReward };
});

// REBUILT QUESTS (DAILY, WEEKLY, METAVERSE)
export const INITIAL_QUESTS_V3: Quest[] = [
  { id: 'q_daily_1', title: 'Première Victoire du Jour', description: 'Terminez 1 partie sur n\'importe quel jeu', target: 1, current: 0, rewardVCoins: 150, rewardXp: 100, isCompleted: false, isClaimed: false, category: 'daily', icon: 'Play' },
  { id: 'q_daily_2', title: 'Maître de la Vitesse', description: 'Atteignez au moins 250 points dans Runner', target: 250, current: 0, rewardVCoins: 200, rewardXp: 150, isCompleted: false, isClaimed: false, gameId: 'cyber_runner_2099', category: 'daily', icon: 'Flame' },
  { id: 'q_daily_3', title: 'Moisson de V-Coins', description: 'Gagnez au moins 300 V-Coins lors de vos sessions', target: 300, current: 0, rewardVCoins: 250, rewardXp: 200, isCompleted: false, isClaimed: false, category: 'daily', icon: 'Coins' },
  { id: 'q_daily_4', title: 'Tirage au Sanctuaire', description: 'Effectuez au moins 2 tirages RNG dans le Sanctuaire', target: 2, current: 0, rewardVCoins: 180, rewardXp: 140, isCompleted: false, isClaimed: false, category: 'daily', icon: 'Dice5' },
  { id: 'q_weekly_1', title: 'Grand Marathon de Jeux', description: 'Jouez à 10 parties complètes cette semaine', target: 10, current: 0, rewardVCoins: 800, rewardXp: 600, isCompleted: false, isClaimed: false, category: 'weekly', icon: 'Trophy', multiplier: 2 },
  { id: 'q_weekly_2', title: 'As Stellaire', description: 'Marquez plus de 500 points dans Cosmic', target: 500, current: 0, rewardVCoins: 900, rewardXp: 750, isCompleted: false, isClaimed: false, gameId: 'cosmic_defender', category: 'weekly', icon: 'Sword', multiplier: 2.5 },
  { id: 'q_weekly_3', title: 'Négociateur en Chef', description: 'Complétez ou proposez un échange dans le Marché', target: 1, current: 0, rewardVCoins: 700, rewardXp: 500, isCompleted: false, isClaimed: false, category: 'weekly', icon: 'RefreshCw' },
  { id: 'q_meta_1', title: 'Assaut sur le Titan Glitch', description: 'Infligez au moins 5 000 points de dégâts au World Boss', target: 5000, current: 0, rewardVCoins: 2000, rewardXp: 1500, isCompleted: false, isClaimed: false, category: 'metaverse', icon: 'Skull', multiplier: 3 }
];

// INITIAL STORY MODE (6 CHAPTERS)
export const INITIAL_STORY_MODE = {
  currentChapterId: 1,
  totalStars: 0,
  chapters: [
    {
      id: 1,
      title: "L'Éveil de l'Oasis Cyber",
      subtitle: "Affrontez la Sentinelle Corrompue qui bloque le portail de transfert.",
      lore: "Un glitch inconnu s'est propagé dans les sous-systèmes de Vertex. La Sentinelle de l'Oasis a perdu la raison et attaque quiconque approche du noyau.",
      enemyName: "Sentinelle Glitchée",
      enemyHp: 150,
      enemyMaxHp: 150,
      playerHp: 120,
      playerMaxHp: 120,
      isCompleted: false,
      isUnlocked: true,
      stars: 0,
      rewardVCoins: 300,
      rewardTitle: "Éclaireur de l'Oasis ⚡",
      bossEmoji: "🤖"
    },
    {
      id: 2,
      title: "La Nécropole des Données",
      subtitle: "Purifiez le Spectre du Code enfoui dans les archives cryptées.",
      lore: "Les anciennes mémoires d'arcade renferment des fragments spectraux avides d'énergie. Neutralisez le spectre avant la purge complète.",
      enemyName: "Spectre du Code",
      enemyHp: 250,
      enemyMaxHp: 250,
      playerHp: 150,
      playerMaxHp: 150,
      isCompleted: false,
      isUnlocked: false,
      stars: 0,
      rewardVCoins: 500,
      rewardTitle: "Purificateur Spectral 👻",
      bossEmoji: "👾"
    },
    {
      id: 3,
      title: "La Faille Gravitationnelle",
      subtitle: "Domptez le Dragon du Néant dans la déchirure de l'espace.",
      lore: "L'attraction stellaire menace d'effondrer les serveurs d'arcade. Seule une frappe chirurgicale au cœur de la singularité peut refermer la brèche.",
      enemyName: "Dragon Gravitationnel",
      enemyHp: 420,
      enemyMaxHp: 420,
      playerHp: 180,
      playerMaxHp: 180,
      isCompleted: false,
      isUnlocked: false,
      stars: 0,
      rewardVCoins: 800,
      rewardTitle: "Dompteur de Gravité 🐉",
      bossEmoji: "🐲"
    },
    {
      id: 4,
      title: "La Citadelle des Ombres",
      subtitle: "Terrassez le Maître Noir Vex à la pointe de la forteresse.",
      lore: "Le Seigneur Vex orchestre le blocage des serveurs mondiaux depuis son trône d'obsidienne. Franchissez ses défenses d'élite.",
      enemyName: "Seigneur Noir Vex",
      enemyHp: 650,
      enemyMaxHp: 650,
      playerHp: 220,
      playerMaxHp: 220,
      isCompleted: false,
      isUnlocked: false,
      stars: 0,
      rewardVCoins: 1200,
      rewardTitle: "Fléau des Ombres ⚔️",
      bossEmoji: "🦹"
    },
    {
      id: 5,
      title: "Le Trône de l'Apex Suprême",
      subtitle: "Le combat final pour l'équilibre éternel de Vertex Arcades !",
      lore: "L'intelligence primordiale 'Titan Omni-Glitch' tente de réécrire la réalité. Brandissez toutes vos reliques pour remporter la victoire ultime !",
      enemyName: "Titan Omni-Glitch",
      enemyHp: 1000,
      enemyMaxHp: 1000,
      playerHp: 300,
      playerMaxHp: 300,
      isCompleted: false,
      isUnlocked: false,
      stars: 0,
      rewardVCoins: 2500,
      rewardTitle: "LÉGENDE SUPRÊME D'APEX 👑🌌",
      bossEmoji: "👑"
    },
    // CHAPTER 6: PRIMORDIAL ARCHON
    {
      id: 6,
      title: "L'Aube du Multivers Éternel",
      subtitle: "Scellez la Brèche Cosmique contre l'Archonte Primordial.",
      lore: "La singularité dimensionnelle s'est ouverte sur le cœur battant du métaverse. L'Archonte Primordial du Vide tente d'absorber tous les serveurs d'arcade.",
      enemyName: "Archonte Primordial",
      enemyHp: 1500,
      enemyMaxHp: 1500,
      playerHp: 350,
      playerMaxHp: 350,
      isCompleted: false,
      isUnlocked: false,
      stars: 0,
      rewardVCoins: 5000,
      rewardTitle: "MAÎTRE DE L'ÉTERNITÉ 🌌👑",
      bossEmoji: "🌌"
    }
  ]
};

// 300 ACHIEVEMENTS
export const INITIAL_ACHIEVEMENTS_300: Achievement[] = Array.from({ length: 300 }, (_, i) => {
  const idNum = i + 1;
  let category: Achievement['category'] = 'gameplay';
  let title = `Achievement #${idNum}`;
  let frenchTitle = `Succès #${idNum}`;
  let spanishTitle = `Logro #${idNum}`;
  let desc = `Complete arcade challenge #${idNum}`;
  let frenchDesc = `Accomplissez le défi d'arcade numéro #${idNum}`;
  let spanishDesc = `Completa el desafío arcade número #${idNum}`;
  let icon = 'Trophy';

  if (idNum <= 30) {
    category = 'gameplay';
    title = idNum === 1 ? 'First Arcade Step' : idNum === 2 ? 'Laser Survivor' : idNum === 3 ? 'Electric Combo' : `Action Master ${idNum}`;
    frenchTitle = idNum === 1 ? 'Premier Pas d\'Arcade' : idNum === 2 ? 'Survivant du Laser' : idNum === 3 ? 'Combo Électrique' : `Maîtrise d'Action ${idNum}`;
    spanishTitle = idNum === 1 ? 'Primer Paso Arcade' : idNum === 2 ? 'Superviviente Láser' : idNum === 3 ? 'Combo Eléctrico' : `Maestría de Acción ${idNum}`;
    desc = `Score high and shine across fast arcade & action games (${idNum})`;
    frenchDesc = `Cumulez des points et brillez dans les jeux d'action et d'arcade (${idNum})`;
    spanishDesc = `Acumula puntos y destaca en los juegos de acción y arcade (${idNum})`;
    icon = 'Zap';
  } else if (idNum <= 60) {
    category = 'ranked';
    title = `Ranked Climber Lvl. ${idNum - 30}`;
    frenchTitle = `Grimpeur Classé Niv. ${idNum - 30}`;
    spanishTitle = `Escalador Clasificado Nivel ${idNum - 30}`;
    desc = `Win matches in Ranked mode and accumulate Rank Points (${(idNum - 30) * 100} RP)`;
    frenchDesc = `Enchaînez les victoires en mode Classé et accumulez des Points de Rang (${(idNum - 30) * 100} RP)`;
    spanishDesc = `Gana partidas en modo Clasificado y acumula Puntos de Rango (${(idNum - 30) * 100} RP)`;
    icon = 'Award';
  } else if (idNum <= 90) {
    category = 'trophy';
    title = `Trophy League Milestone ${idNum - 60}`;
    frenchTitle = `Ligue des Trophées Palier ${idNum - 60}`;
    spanishTitle = `Liga de Trofeos Hito ${idNum - 60}`;
    desc = `Ascend the Vertex trophy road (${(idNum - 60) * 80} 🏆)`;
    frenchDesc = `Grimpez sur la route des trophées Vertex (${(idNum - 60) * 80} 🏆)`;
    spanishDesc = `Asciende en el camino de trofeos de Vertex (${(idNum - 60) * 80} 🏆)`;
    icon = 'Crown';
  } else if (idNum <= 130) {
    category = 'rng';
    title = `Stellar Relic Collector #${idNum - 90}`;
    frenchTitle = `Collectionneur Stellaire #${idNum - 90}`;
    spanishTitle = `Coleccionista Estelar #${idNum - 90}`;
    desc = `Discover mythical artifacts at the RNG Sanctuary (${idNum - 90} items)`;
    frenchDesc = `Découvrez des reliques mythiques au Sanctuaire RNG (${idNum - 90} objets)`;
    spanishDesc = `Descubre reliquias míticas en el Santuario RNG (${idNum - 90} objetos)`;
    icon = 'Sparkles';
  } else if (idNum <= 155) {
    category = 'trade';
    title = `Metaverse Trader #${idNum - 130}`;
    frenchTitle = `Marchand du Métaverse #${idNum - 130}`;
    spanishTitle = `Comerciante del Metaverso #${idNum - 130}`;
    desc = `Trade items and relics with community members (${idNum - 130} trades)`;
    frenchDesc = `Échangez des objets et cosmétiques avec la communauté (${idNum - 130} trocs)`;
    spanishDesc = `Intercambia objetos y cosméticos con la comunidad (${idNum - 130} intercambios)`;
    icon = 'RefreshCw';
  } else if (idNum <= 180) {
    category = 'cosmetics';
    title = `Style & Identity #${idNum - 155}`;
    frenchTitle = `Style & Personnalisation #${idNum - 155}`;
    spanishTitle = `Estilo y Personalización #${idNum - 155}`;
    desc = `Equip custom helmets, neon visors and particle auras (${idNum - 155})`;
    frenchDesc = `Équipez des casques, visières néon et auras de particules exclusives (${idNum - 155})`;
    spanishDesc = `Equipa cascos personalizados, visores de neón y auras de partículas (${idNum - 155})`;
    icon = 'Shirt';
  } else if (idNum <= 200) {
    category = 'secret';
    title = `Apex Cosmic Mystery #${idNum - 180} 🔮`;
    frenchTitle = `Secret Apex Cosmique #${idNum - 180} 🔮`;
    spanishTitle = `Secreto Apex Cósmico #${idNum - 180} 🔮`;
    desc = `Unlock one of the hidden mysteries of Vertex Arcades (${idNum - 180})`;
    frenchDesc = `Débloquez l'un des mystères cachés de Vertex Arcades (${idNum - 180})`;
    spanishDesc = `Desbloquea uno de los misterios ocultos de Vertex Arcades (${idNum - 180})`;
    icon = 'Ghost';
  } else if (idNum <= 230) {
    category = 'story';
    title = `Chronicles Hero #${idNum - 200} 📖`;
    frenchTitle = `Héros des Chroniques #${idNum - 200} 📖`;
    spanishTitle = `Héroe de las Crónicas #${idNum - 200} 📖`;
    desc = `Progress in Story Campaign and defeat 6 chapter bosses (${idNum - 200})`;
    frenchDesc = `Progressez dans la campagne du Mode Histoire et triomphez des 6 boss de chapitres (${idNum - 200})`;
    spanishDesc = `Avanza en la campaña del Modo Historia y derrota a los 6 jefes (${idNum - 200})`;
    icon = 'BookOpen';
  } else if (idNum <= 250) {
    category = 'gameplay';
    title = idNum === 231 ? 'Golden Matrix Pinball' : idNum === 232 ? 'Voxel Dungeon Raider' : idNum === 233 ? 'Sky Tower Ascent' : `Grand Master #${idNum - 230}`;
    frenchTitle = idNum === 231 ? 'Flipper d\'Or Matrix' : idNum === 232 ? 'Pilleur de Donjon Voxel' : idNum === 233 ? 'Ascension de la Tour Céleste' : `Grand Maître #${idNum - 230}`;
    spanishTitle = idNum === 231 ? 'Pinball Matrix Dorado' : idNum === 232 ? 'Invasor Mazmorra Voxel' : idNum === 233 ? 'Ascenso Torre Celeste' : `Gran Maestro #${idNum - 230}`;
    desc = idNum === 231 ? 'Score over 2,000 points in Cyber Pinball' : idNum === 232 ? 'Reach Floor 3 in Voxel Dungeon' : idNum === 233 ? 'Climb over 500m in Hyper Jump' : `Arcade mastery level ${idNum - 230}`;
    frenchDesc = idNum === 231 ? 'Marquez plus de 2 000 points dans Cyber Pinball' : idNum === 232 ? 'Atteignez l\'étage 3 dans Voxel Dungeon' : idNum === 233 ? 'Dépassez 500m dans Hyper Jump' : `Maîtrise d'arcade niveau ${idNum - 230}`;
    spanishDesc = idNum === 231 ? 'Consigue más de 2.000 puntos en Cyber Pinball' : idNum === 232 ? 'Llega al piso 3 en Voxel Dungeon' : idNum === 233 ? 'Supera 500m en Hyper Jump' : `Maestría arcade nivel ${idNum - 230}`;
    icon = 'Star';
  } else {
    // 50 NEW ACHIEVEMENTS (251 - 300)
    category = 'trophy';
    title = `25K Conqueror #${idNum - 250} 🏆`;
    frenchTitle = `Conquérant des 25K #${idNum - 250} 🏆`;
    spanishTitle = `Conquistador de 25K #${idNum - 250} 🏆`;
    desc = `Reach high milestones in the Trophy League and shatter records (${(idNum - 250) * 500} 🏆)`;
    frenchDesc = `Atteignez de nouveaux sommets dans la Ligue des Trophées et battez des records mondiaux (${(idNum - 250) * 500} 🏆)`;
    spanishDesc = `Alcanza grandes hitos en la Liga de Trofeos y bate récords (${(idNum - 250) * 500} 🏆)`;
    icon = 'Trophy';
  }

  return {
    id: `ach_${idNum}`,
    title,
    frenchTitle,
    spanishTitle,
    description: desc,
    frenchDescription: frenchDesc,
    spanishDescription: spanishDesc,
    vcoinReward: 50 + (idNum % 10) * 25,
    isUnlocked: idNum === 1,
    icon,
    category
  };
});
export const INITIAL_ACHIEVEMENTS_250 = INITIAL_ACHIEVEMENTS_300;
export const INITIAL_ACHIEVEMENTS_200 = INITIAL_ACHIEVEMENTS_300;

// REFINED HIGH-TIER COSMETICS SHOP (PURIFIED & LUXURIOUS)
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
  // High-tier Hats & Wings
  { id: 'hat_cap_pro', name: 'Visière Cyber Pro', category: 'hat', costVCoins: 200, rarity: 'commun', preview: '🪖', description: 'Casque futuriste haute visibilité avec télémètre intégré.' },
  { id: 'hat_cyber_shades', name: 'Lunettes Cyber Matrix', category: 'hat', costVCoins: 350, rarity: 'rare', preview: '🕶️', description: 'Verres polarisés néon avec affichage tête haute intégré.' },
  { id: 'hat_halo_angel', name: 'Halo Céleste d\'Or', category: 'hat', costVCoins: 750, rarity: 'epique', preview: '😇', description: 'Flotte au-dessus de votre avatar en diffusant des lueurs divines.' },
  { id: 'hat_valkyrie_gold', name: 'Ailes de Valkyrie Divines', category: 'hat', costVCoins: 1800, rarity: 'legendaire', preview: '🪽', description: 'Ailes de lumière et armature en adamantium étincelant.' },
  { id: 'hat_dominus_apex', name: 'Couronne Sombre Apex', category: 'hat', costVCoins: 5000, rarity: 'divin', preview: '👑', description: 'Le couvre-chef suprême du métaverse. Respect instantané de tous.' },

  // Mythic Auras
  { id: 'aura_supernova', name: 'Aura Supernova Cosmique', category: 'aura', costVCoins: 1500, rarity: 'legendaire', preview: '✨', description: 'Constellations en rotation continue et éclats stellaires.' },
  { id: 'aura_black_hole', name: 'Aura Singularité Céleste', category: 'aura', costVCoins: 4500, rarity: 'divin', preview: '🌌', description: 'Courbure spatio-temporelle avec anneaux de particules gravitationnels.' },

  // Prestige Titles
  { id: 'title_multiverse', name: '🌌 Maître du Multivers', category: 'title', costVCoins: 800, rarity: 'epique', preview: '🌌', description: 'Pour les voyageurs ayant traversé les confins du métaverse.' },
  { id: 'title_speed_god', name: '⚡ Légende de la Vitesse', category: 'title', costVCoins: 600, rarity: 'rare', preview: '⚡', description: 'Prouve que la vélocité n\'a aucun secret pour vous.' },
  { id: 'title_vc_whale', name: '💎 Baleine à V-Coins', category: 'title', costVCoins: 1500, rarity: 'legendaire', preview: '💎', description: 'Pour ceux dont le pactole en banque ne cesse de déborder.' },
  { id: 'title_sovereign', name: '👑 Souverain des Arènes', category: 'title', costVCoins: 3500, rarity: 'divin', preview: '👑', description: 'Le statut légendaire des plus grands champions.' },

  // Animated Frames
  { id: 'frame_neon_cyan', name: 'Cadre Cyber Néon', category: 'frame', costVCoins: 250, rarity: 'commun', preview: '🔲', description: 'Bordure rectangulaire biseautée cyan haute intensité.' },
  { id: 'frame_cosmic_pulse', name: 'Cadre Pulsar Céleste', category: 'frame', costVCoins: 1100, rarity: 'legendaire', preview: '🔮', description: 'Bordure holographique animée aux couleurs changeantes.' },

  // Banners
  { id: 'banner_void_galaxy', name: 'Bannière Faille Galactique', category: 'banner', costVCoins: 1600, rarity: 'legendaire', preview: '🌌', description: 'Une déchirure dans l\'espace vers un univers parallèle.' }
];
