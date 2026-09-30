export type Language = 'en' | 'fr' | 'es';

export interface Translations {
  // Navigation & General
  appTitle: string;
  hubTitle: string;
  allExperiences: string;
  play: string;
  playNow: string;
  unlock: string;
  unlocked: string;
  locked: string;
  close: string;
  cancel: string;
  confirm: string;
  save: string;
  search: string;
  searchPlaceholder: string;
  filter: string;
  filters: string;
  allCategories: string;
  all: string;
  favorite: string;
  favorites: string;
  version: string;
  creator: string;
  rating: string;
  players: string;
  highScore: string;
  totalPlays: string;
  gameVersion: string;
  details: string;

  // Categories
  catAction: string;
  catSurvival: string;
  catRacer: string;
  catPlatformer: string;
  catTycoon: string;
  catRhythm: string;
  catPuzzle: string;

  // Profile
  playerProfile: string;
  profileSubtitle: string;
  username: string;
  bio: string;
  bioPlaceholder: string;
  uploadPhoto: string;
  replacePhoto: string;
  deletePhoto: string;
  saveProfile: string;
  activeBadges: string;
  tagsCatalog: string;
  filterTags: string;

  // Header & VC
  vcoinsBalance: string;
  level: string;
  trophies: string;

  // Modals & Features
  trophyLeague: string;
  trophyRoadSubtitle: string;
  arcadePass: string;
  arcadePassSubtitle: string;
  seasonEnds: string;
  seasonEndsDate: string;
  upgradeVip: string;
  claim: string;
  claimed: string;
  freePass: string;
  vipPass: string;

  quests: string;
  questsSubtitle: string;
  dailyQuests: string;
  weeklyQuests: string;
  metaverseQuests: string;

  rngSanctuary: string;
  rngSubtitle: string;
  roll1x: string;
  roll5x: string;
  roll10x: string;
  luckBooster: string;
  pityGuaranteed: string;
  inventory: string;
  salvageDuplicates: string;

  storyMode: string;
  storySubtitle: string;
  chapter: string;
  boss: string;
  fight: string;

  shop: string;
  shopSubtitle: string;
  buyEquip: string;
  equipped: string;
  insufficientFunds: string;

  settings: string;
  settingsSubtitle: string;
  language: string;
  audioSettings: string;
  sfx: string;
  music: string;
  gamepad: string;
  playBtnColor: string;
  resetData: string;
  resetPrompt: string;

  // Drawer Menu & Encadrés
  drawerMenuTitle: string;
  navSectionGames: string;
  navSectionProgression: string;
  navSectionHub: string;
  navGamesTitle: string;
  navGamesSub: string;
  navGamesBadge: string;
  navRngTitle: string;
  navRngSub: string;
  navRngBadge: string;
  navStoryTitle: string;
  navStorySub: string;
  navStoryBadge: string;
  navTrophyTitle: string;
  navTrophySub: string;
  navPassTitle: string;
  navPassSub: string;
  navQuestsTitle: string;
  navQuestsSub: string;
  navQuestsBadge: string;
  navAchievementsTitle: string;
  navAchievementsSub: string;
  navAchievementsBadge: string;
  navProfileTitle: string;
  navProfileSub: string;
  navProfileBadge: string;
  navSettingsTitle: string;
  navSettingsSub: string;
  navSettingsBadge: string;

  owned: string;
  free: string;
  gamesCount: string;
  catFree: string;
  catVip: string;
  status: string;
  readyToPlay: string;
  vcRequired: string;
  difficulty: string;
  achievementsTitle: string;
  achievementsCompleted: string;
  achievementsLocked: string;
  achievementsUnlockedCount: string;
  achievementsSearch: string;
  soundOn: string;
  soundOff: string;
  toggleSound: string;
  openMenu: string;
  quit: string;
  gamepadConnected: string;
  gamepadDisconnected: string;
  autoSaveNotice: string;
  activeTrack: string;
  sfxDescription: string;
  musicDescription: string;
  playBtnColorDesc: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appTitle: 'Vertex Arcades',
    hubTitle: 'VERTEX HUB',
    allExperiences: 'All experiences & features',
    play: 'Play',
    playNow: 'PLAY NOW',
    unlock: 'UNLOCK',
    unlocked: 'Unlocked',
    locked: 'Locked',
    close: 'Close',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    search: 'Search',
    searchPlaceholder: 'Search games, tags, creators...',
    filter: 'Filter',
    filters: 'Filters',
    allCategories: 'All Categories',
    all: 'All',
    favorite: 'Favorite',
    favorites: 'Favorites',
    version: 'Version',
    creator: 'Creator',
    rating: 'Rating',
    players: 'Players',
    highScore: 'Best Score',
    totalPlays: 'Total Plays',
    gameVersion: 'Game Version',
    details: 'Game Details',

    catAction: 'Action',
    catSurvival: 'Survival',
    catRacer: 'Racing',
    catPlatformer: 'Platformer',
    catTycoon: 'Tycoon',
    catRhythm: 'Rhythm',
    catPuzzle: 'Puzzle',

    playerProfile: 'Player Profile',
    profileSubtitle: 'Custom photo, bio & community identity badges',
    username: 'Player Username',
    bio: 'Profile Bio & Quote',
    bioPlaceholder: 'Share your gaming story across Vertex...',
    uploadPhoto: 'Upload Photo',
    replacePhoto: 'Replace Photo',
    deletePhoto: 'Remove Custom Photo',
    saveProfile: 'SAVE PROFILE',
    activeBadges: 'Active Tags & Badges',
    tagsCatalog: 'Badges & Tags Catalog',
    filterTags: 'Filter tags...',

    vcoinsBalance: 'V-Coins Balance',
    level: 'Lvl',
    trophies: 'Trophies',

    trophyLeague: 'Trophy League',
    trophyRoadSubtitle: 'Trophy milestones progression every 100 🏆 up to 25,000 🏆',
    arcadePass: 'Arcade Pass',
    arcadePassSubtitle: '50 Unique Tiers • Auras, Hats, Banners & Titles',
    seasonEnds: 'Season Ends',
    seasonEndsDate: 'October 31 at 14:00 UTC',
    upgradeVip: 'Upgrade VIP (1,000 VC)',
    claim: 'CLAIM',
    claimed: 'Claimed',
    freePass: 'Free Track',
    vipPass: 'VIP Track',

    quests: 'Missions & Quests',
    questsSubtitle: 'Daily, weekly and metaverse bounties with V-Coins',
    dailyQuests: 'Daily',
    weeklyQuests: 'Weekly (2x)',
    metaverseQuests: 'Metaverse Events',

    rngSanctuary: 'RNG Sanctuary V2',
    rngSubtitle: 'Summon mystical universe relics, roll multi-pulls & unlock auras',
    roll1x: 'Roll 1x',
    roll5x: 'Roll 5x Fast',
    roll10x: 'Roll 10x Turbo',
    luckBooster: 'Luck Booster',
    pityGuaranteed: 'Guaranteed Epic+ in',
    inventory: 'Relics Vault',
    salvageDuplicates: 'Recycle Duplicates',

    storyMode: 'Story Chronicles',
    storySubtitle: 'Episodic boss campaign with legendary lore and rewards',
    chapter: 'Chapter',
    boss: 'Boss',
    fight: 'ENGAGE BATTLE',

    shop: 'Cosmetics Store',
    shopSubtitle: 'Mythic auras, cyber crowns, wings & neon prestige frames',
    buyEquip: 'Buy & Equip',
    equipped: 'Equipped',
    insufficientFunds: 'Insufficient Funds',

    settings: 'Settings',
    settingsSubtitle: 'Audio, language, controllers & visual preferences',
    language: 'Language',
    audioSettings: 'Sound & Music',
    sfx: 'Sound Effects (SFX)',
    music: 'Background Music (BGM)',
    gamepad: 'Gamepad Controller Support',
    playBtnColor: 'Play Button Color',
    resetData: 'Reset Local Data',
    resetPrompt: 'Reset all stored game data to factory default',

    drawerMenuTitle: 'VERTEX HUB',
    navSectionGames: '🎮 Games & Experiences',
    navSectionProgression: '🏆 Progression & Rewards',
    navSectionHub: '💎 Player Hub & Settings',
    navGamesTitle: 'Games Catalog',
    navGamesSub: '25 Original Experiences (3 Free • 22 VIP)',
    navGamesBadge: '25 GAMES',
    navRngTitle: 'RNG Sanctuary V2',
    navRngSub: 'Relics Vault & Multi-Rolls x1, x5, x10',
    navRngBadge: '3x LUCK',
    navStoryTitle: 'Story Mode: Chronicles',
    navStorySub: 'Stellar campaign, 6 Chapters & Bosses',
    navStoryBadge: '6 CHAPTERS',
    navTrophyTitle: 'Trophy League',
    navTrophySub: '25,000 Trophies Road & Milestones',
    navPassTitle: 'VIP Arcade Pass',
    navPassSub: '50 Unlockable Tiers (Ends Oct 31, 14:00)',
    navQuestsTitle: 'Missions & Quests',
    navQuestsSub: 'Daily, weekly & boss challenges',
    navQuestsBadge: 'EARN VC',
    navAchievementsTitle: '300 Arcade Achievements',
    navAchievementsSub: 'Gameplay challenges, Story & V-Coins',
    navAchievementsBadge: '300 ACHIEVEMENTS',
    navProfileTitle: 'My Profile & Bio',
    navProfileSub: 'Customize avatar, photo, tags & badges',
    navProfileBadge: 'PROFILE',
    navSettingsTitle: 'Settings & Audio',
    navSettingsSub: 'Sound, language, controllers & options',
    navSettingsBadge: 'SETTINGS',

    owned: 'ACQUIRED',
    free: 'FREE',
    gamesCount: 'Games',
    catFree: 'Free ⚡',
    catVip: 'VIP 💎',
    status: 'Status',
    readyToPlay: 'Ready to play',
    vcRequired: 'VC required',
    difficulty: 'Difficulty',
    achievementsTitle: '300 ARCADE ACHIEVEMENTS',
    achievementsCompleted: 'COMPLETED',
    achievementsLocked: 'LOCKED',
    achievementsUnlockedCount: 'Unlocked',
    achievementsSearch: 'Search among the 300 achievements...',
    soundOn: 'Sound ON 🔊',
    soundOff: 'Sound OFF 🔇',
    toggleSound: 'Toggle sound',
    openMenu: 'Open main menu',
    quit: 'Quit',
    gamepadConnected: 'Connected',
    gamepadDisconnected: 'No controller detected (Connect or turn on an Xbox/PS gamepad)',
    autoSaveNotice: 'Immediate automatic saving of your preferences',
    activeTrack: 'Active Music Track',
    sfxDescription: 'Sound effects for jumps, coins, lasers and clicks',
    musicDescription: 'Retro-cyber ambient procedural soundtrack loops',
    playBtnColorDesc: 'Customize the launch button color across all catalog games'
  },

  fr: {
    appTitle: 'Vertex Arcades',
    hubTitle: 'HUB VERTEX',
    allExperiences: 'Toutes les expériences & fonctionnalités',
    play: 'Jouer',
    playNow: 'JOUER MAINTENANT',
    unlock: 'DÉBLOQUER',
    unlocked: 'Débloqué',
    locked: 'Verrouillé',
    close: 'Fermer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    save: 'Enregistrer',
    search: 'Recherche',
    searchPlaceholder: 'Rechercher un jeu, tag, créateur...',
    filter: 'Filtre',
    filters: 'Filtres',
    allCategories: 'Toutes les Catégories',
    all: 'Tous',
    favorite: 'Favori',
    favorites: 'Favoris',
    version: 'Version',
    creator: 'Créateur',
    rating: 'Note',
    players: 'Joueurs',
    highScore: 'Meilleur Score',
    totalPlays: 'Parties Jouées',
    gameVersion: 'Version du Jeu',
    details: 'Détails du Jeu',

    catAction: 'Action',
    catSurvival: 'Survie',
    catRacer: 'Course',
    catPlatformer: 'Plateforme',
    catTycoon: 'Tycoon',
    catRhythm: 'Rythme',
    catPuzzle: 'Puzzle',

    playerProfile: 'Profil Joueur',
    profileSubtitle: 'Photo personnalisée, bio & badges communautaires',
    username: 'Pseudonyme Joueur',
    bio: 'Bio & Citation du Profil',
    bioPlaceholder: 'Racontez votre parcours sur Vertex...',
    uploadPhoto: 'Importer photo',
    replacePhoto: 'Remplacer photo',
    deletePhoto: 'Supprimer la photo',
    saveProfile: 'ENREGISTRER LE PROFIL',
    activeBadges: 'Badges & Tags Actifs',
    tagsCatalog: 'Catalogue des Étiquettes',
    filterTags: 'Filtrer un tag...',

    vcoinsBalance: 'Solde V-Coins',
    level: 'Niv.',
    trophies: 'Trophées',

    trophyLeague: 'Ligue des Trophées',
    trophyRoadSubtitle: 'Paliers de récompenses tous les 100 🏆 jusqu\'à 25 000 🏆',
    arcadePass: 'Pass Arcade',
    arcadePassSubtitle: '50 Paliers Exclusifs • Auras, Couvre-chefs & Titres',
    seasonEnds: 'Fin de Saison',
    seasonEndsDate: '31 octobre à 14h00 UTC',
    upgradeVip: 'Pass VIP (1 000 VC)',
    claim: 'RÉCLAMER',
    claimed: 'Récupéré',
    freePass: 'Piste Gratuite',
    vipPass: 'Piste VIP',

    quests: 'Missions & Quêtes',
    questsSubtitle: 'Défis quotidiens, hebdos et métaverse avec V-Coins',
    dailyQuests: 'Quotidiennes',
    weeklyQuests: 'Hebdomadaires (2x)',
    metaverseQuests: 'Événements Métaverse',

    rngSanctuary: 'Sanctuaire RNG V2',
    rngSubtitle: 'Invoquez des reliques d\'univers, tirages multiples & auras',
    roll1x: 'Tirage 1x',
    roll5x: 'Tirage 5x Rapide',
    roll10x: 'Tirage 10x Turbo',
    luckBooster: 'Boost de Chance',
    pityGuaranteed: 'Garanti Épique+ dans',
    inventory: 'Coffre des Reliques',
    salvageDuplicates: 'Recycler les Doublons',

    storyMode: 'Mode Histoire',
    storySubtitle: 'Campagne de boss par épisodes avec récits et récompenses',
    chapter: 'Chapitre',
    boss: 'Boss',
    fight: 'LANCER LE COMBAT',

    shop: 'Boutique Cosmétique',
    shopSubtitle: 'Auras mythiques, couronnes cyber, ailes & cadres néon',
    buyEquip: 'Acheter & Équiper',
    equipped: 'Équipé',
    insufficientFunds: 'Fonds Insuffisants',

    settings: 'Paramètres',
    settingsSubtitle: 'Audio, langues, manettes & préférences visuelles',
    language: 'Langue',
    audioSettings: 'Sons & Musique',
    sfx: 'Effets Sonores (SFX)',
    music: 'Musique de Fond (BGM)',
    gamepad: 'Support Manette / Contrôleur',
    playBtnColor: 'Couleur du Bouton "JOUER"',
    resetData: 'Réinitialiser les données',
    resetPrompt: 'Efface la sauvegarde locale et remet l\'arcade à neuf',

    drawerMenuTitle: 'HUB VERTEX',
    navSectionGames: '🎮 Jeux & Expériences',
    navSectionProgression: '🏆 Progression & Récompenses',
    navSectionHub: '💎 Hub Joueur & Réglages',
    navGamesTitle: 'Catalogue des Jeux',
    navGamesSub: '25 Expériences Originales (3 Gratuits • 22 VIP)',
    navGamesBadge: '25 JEUX',
    navRngTitle: 'Sanctuaire RNG V2',
    navRngSub: 'Roulette de Reliques & Multi-Tirages x1, x5, x10',
    navRngBadge: 'CHANCE x3',
    navStoryTitle: 'Mode Histoire : Chroniques',
    navStorySub: 'Campagne stellaire, 6 Chapitres & Boss',
    navStoryBadge: '6 CHAPITRES',
    navTrophyTitle: 'Ligue des Trophées',
    navTrophySub: 'Route des 25 000 Trophées & Paliers',
    navPassTitle: 'Pass Arcade VIP',
    navPassSub: '50 Paliers débloquables (Fin 31 oct. 14h)',
    navQuestsTitle: 'Missions & Quêtes',
    navQuestsSub: 'Défis journaliers, hebdos & boss',
    navQuestsBadge: 'GAIN VC',
    navAchievementsTitle: '300 Succès d\'Arcade',
    navAchievementsSub: 'Défis de gameplay, Histoire & V-Coins',
    navAchievementsBadge: '300 SUCCÈS',
    navProfileTitle: 'Mon Profil & Bio',
    navProfileSub: 'Personnaliser photo, tags et badges',
    navProfileBadge: 'PROFIL',
    navSettingsTitle: 'Paramètres & Audio',
    navSettingsSub: 'Audio, langues, manettes & contrôles',
    navSettingsBadge: 'RÉGLAGES',

    owned: 'ACQUIS',
    free: 'GRATUIT',
    gamesCount: 'Jeux',
    catFree: 'Gratuits ⚡',
    catVip: 'VIP 💎',
    status: 'Statut',
    readyToPlay: 'Prêt à jouer',
    vcRequired: 'VC requis',
    difficulty: 'Difficulté',
    achievementsTitle: 'LES 300 SUCCÈS D\'ARCADE',
    achievementsCompleted: 'COMPLÉTÉ',
    achievementsLocked: 'VERROUILLÉ',
    achievementsUnlockedCount: 'Débloqués',
    achievementsSearch: 'Rechercher parmi les 300 succès...',
    soundOn: 'Son ACTIVÉ 🔊',
    soundOff: 'Son COUPÉ 🔇',
    toggleSound: 'Basculer le son',
    openMenu: 'Ouvrir le menu principal',
    quit: 'Quitter',
    gamepadConnected: 'Connectée',
    gamepadDisconnected: 'Aucune manette détectée (Branchez ou allumez une manette Xbox/PS)',
    autoSaveNotice: 'Sauvegarde automatique immédiate de vos préférences',
    activeTrack: 'Piste Musicale Active',
    sfxDescription: 'Sons de tir, sauts, pièces et clics',
    musicDescription: 'Boucles ambiantes procédurales rétro-cyber',
    playBtnColorDesc: 'Personnalisez la couleur de tous les boutons de lancement des jeux du catalogue'
  },

  es: {
    appTitle: 'Vertex Arcades',
    hubTitle: 'CENTRO VERTEX',
    allExperiences: 'Todas las experiencias y características',
    play: 'Jugar',
    playNow: 'JUGAR AHORA',
    unlock: 'DESBLOQUEAR',
    unlocked: 'Desbloqueado',
    locked: 'Bloqueado',
    close: 'Cerrar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    save: 'Guardar',
    search: 'Buscar',
    searchPlaceholder: 'Buscar juegos, etiquetas, creadores...',
    filter: 'Filtro',
    filters: 'Filtros',
    allCategories: 'Todas las Categorías',
    all: 'Todos',
    favorite: 'Favorito',
    favorites: 'Favoritos',
    version: 'Versión',
    creator: 'Creador',
    rating: 'Calificación',
    players: 'Jugadores',
    highScore: 'Mejor Puntuación',
    totalPlays: 'Partidas Jugadas',
    gameVersion: 'Versión del Juego',
    details: 'Detalles del Juego',

    catAction: 'Acción',
    catSurvival: 'Supervivencia',
    catRacer: 'Carreras',
    catPlatformer: 'Plataformas',
    catTycoon: 'Tycoon',
    catRhythm: 'Ritmo',
    catPuzzle: 'Puzle',

    playerProfile: 'Perfil de Jugador',
    profileSubtitle: 'Foto personalizada, biografía y medallas comunitarias',
    username: 'Nombre de Jugador',
    bio: 'Biografía y Cita del Perfil',
    bioPlaceholder: 'Comparte tu historia en Vertex...',
    uploadPhoto: 'Subir Foto',
    replacePhoto: 'Reemplazar Foto',
    deletePhoto: 'Eliminar Foto Personalizada',
    saveProfile: 'GUARDAR PERFIL',
    activeBadges: 'Etiquetas Activas',
    tagsCatalog: 'Catálogo de Etiquetas',
    filterTags: 'Filtrar etiquetas...',

    vcoinsBalance: 'Saldo V-Coins',
    level: 'Niv.',
    trophies: 'Trofeos',

    trophyLeague: 'Liga de Trofeos',
    trophyRoadSubtitle: 'Recompensas cada 100 🏆 hasta 25.000 🏆',
    arcadePass: 'Pase Arcade',
    arcadePassSubtitle: '50 Niveles Exclusivos • Auras, Sombreros y Títulos',
    seasonEnds: 'Fin de Temporada',
    seasonEndsDate: '31 de octubre a las 14:00 UTC',
    upgradeVip: 'Mejorar a VIP (1.000 VC)',
    claim: 'RECLAMAR',
    claimed: 'Reclamado',
    freePass: 'Pase Gratuito',
    vipPass: 'Pase VIP',

    quests: 'Misiones y Desafíos',
    questsSubtitle: 'Misiones diarias, semanales y eventos con V-Coins',
    dailyQuests: 'Diarias',
    weeklyQuests: 'Semanales (2x)',
    metaverseQuests: 'Eventos del Metaverso',

    rngSanctuary: 'Santuario RNG V2',
    rngSubtitle: 'Invoca reliquias místicas, tiradas múltiples y auras',
    roll1x: 'Tirada 1x',
    roll5x: 'Tirada 5x Rápida',
    roll10x: 'Tirada 10x Turbo',
    luckBooster: 'Acelerador de Suerte',
    pityGuaranteed: 'Garantizado Épico+ en',
    inventory: 'Bóveda de Reliquias',
    salvageDuplicates: 'Reciclar Duplicados',

    storyMode: 'Modo Historia',
    storySubtitle: 'Campaña contra jefes con recompensas legendarias',
    chapter: 'Capítulo',
    boss: 'Jefe',
    fight: 'INICIAR COMBATE',

    shop: 'Tienda de Cosméticos',
    shopSubtitle: 'Auras míticas, coronas ciber, alas y marcos de neón',
    buyEquip: 'Comprar y Equipar',
    equipped: 'Equipado',
    insufficientFunds: 'Fondos Insuficientes',

    settings: 'Ajustes',
    settingsSubtitle: 'Audio, idioma, mandos y preferencias visuales',
    language: 'Idioma',
    audioSettings: 'Sonido y Música',
    sfx: 'Efectos de Sonido (SFX)',
    music: 'Música de Fondo (BGM)',
    gamepad: 'Soporte para Mando / Gamepad',
    playBtnColor: 'Color del Botón "JUGAR"',
    resetData: 'Restablecer Datos Locales',
    resetPrompt: 'Borra los datos guardados y reinicia el arcade',

    drawerMenuTitle: 'CENTRO VERTEX',
    navSectionGames: '🎮 Juegos y Experiencias',
    navSectionProgression: '🏆 Progresión y Recompensas',
    navSectionHub: '💎 Centro de Jugador y Ajustes',
    navGamesTitle: 'Catálogo de Juegos',
    navGamesSub: '25 Experiencias Originales (3 Gratis • 22 VIP)',
    navGamesBadge: '25 JUEGOS',
    navRngTitle: 'Santuario RNG V2',
    navRngSub: 'Ruleta de Reliquias y Tiradas x1, x5, x10',
    navRngBadge: 'SUERTE x3',
    navStoryTitle: 'Modo Historia: Crónicas',
    navStorySub: 'Campaña estelar, 6 Capítulos y Jefes',
    navStoryBadge: '6 CAPÍTULOS',
    navTrophyTitle: 'Liga de Trofeos',
    navTrophySub: 'Camino de 25.000 Trofeos y Niveles',
    navPassTitle: 'Pase Arcade VIP',
    navPassSub: '50 Niveles desbloqueables (Fin 31 oct. 14h)',
    navQuestsTitle: 'Misiones y Desafíos',
    navQuestsSub: 'Desafíos diarios, semanales y jefes',
    navQuestsBadge: 'GANAR VC',
    navAchievementsTitle: '300 Logros de Arcade',
    navAchievementsSub: 'Desafíos de juego, Historia y V-Coins',
    navAchievementsBadge: '300 LOGROS',
    navProfileTitle: 'Mi Perfil y Bio',
    navProfileSub: 'Personalizar foto, etiquetas y medallas',
    navProfileBadge: 'PERFIL',
    navSettingsTitle: 'Ajustes y Audio',
    navSettingsSub: 'Audio, idiomas, mandos y controles',
    navSettingsBadge: 'AJUSTES',

    owned: 'ADQUIRIDO',
    free: 'GRATIS',
    gamesCount: 'Juegos',
    catFree: 'Gratis ⚡',
    catVip: 'VIP 💎',
    status: 'Estado',
    readyToPlay: 'Listo para jugar',
    vcRequired: 'VC requeridos',
    difficulty: 'Dificultad',
    achievementsTitle: 'LOS 300 LOGROS DE ARCADE',
    achievementsCompleted: 'COMPLETADO',
    achievementsLocked: 'BLOQUEADO',
    achievementsUnlockedCount: 'Desbloqueados',
    achievementsSearch: 'Buscar entre los 300 logros...',
    soundOn: 'Sonido ACTIVADO 🔊',
    soundOff: 'Sonido APAGADO 🔇',
    toggleSound: 'Alternar sonido',
    openMenu: 'Abrir menú principal',
    quit: 'Salir',
    gamepadConnected: 'Conectado',
    gamepadDisconnected: 'Ningún mando detectado (Conecta o enciende un mando de Xbox/PS)',
    autoSaveNotice: 'Guardado automático inmediato de tus preferencias',
    activeTrack: 'Pista Musical Activa',
    sfxDescription: 'Efectos de sonido de saltos, monedas, láseres y clics',
    musicDescription: 'Pistas retro-cyber procedurales de fondo',
    playBtnColorDesc: 'Personaliza el color de todos los botones de inicio de juegos'
  }
};

export function getTranslation(lang: Language = 'en'): Translations {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
