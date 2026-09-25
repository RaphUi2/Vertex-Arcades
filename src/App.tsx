import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Trophy, Sparkles, Heart, Search, Play, X, Coins,
  Settings, Gamepad2, Volume2, VolumeX, Crown, Target, ShoppingBag,
  ArrowRightLeft, Skull, Flame, Check, Shield, Lock, User, Award
} from 'lucide-react';

import { audio } from './utils/audio';
import { useGamepad } from './utils/gamepad';
import { GlobalState, GameStats, UserProfile, Quest, RngUniverseItem } from './types';
import {
  GAMES_LIST,
  INITIAL_ACHIEVEMENTS_200,
  INITIAL_QUESTS_V3,
  INITIAL_TRADE_REQUESTS,
  NEW_COSMETICS_SHOP,
  RANKED_GAMES_IDS,
  ShopCosmetic
} from './gamesData';

// Modals
import { GameCardIllustration } from './components/GameCardIllustration';
import { RngUniverseModal } from './components/RngUniverseModal';
import { ApexTrophyRoadModal } from './components/ApexTrophyRoadModal';
import { RankedV3Modal } from './components/RankedV3Modal';
import { ProfileCreatorModal } from './components/ProfileCreatorModal';
import { QuestsV3Modal } from './components/QuestsV3Modal';
import { MetaverseForgeModal } from './components/MetaverseForgeModal';
import { AchievementsV3Modal } from './components/AchievementsV3Modal';
import { ShopV3Modal } from './components/ShopV3Modal';
import { SettingsV3Modal } from './components/SettingsV3Modal';
import { ArcadePassV3Modal } from './components/ArcadePassV3Modal';
import { MobileGameControls } from './components/MobileGameControls';

// 15 Games
import { QuantumObby } from './games/QuantumObby';
import { AetheriaVoid } from './games/AetheriaVoid';
import { TitanCore } from './games/TitanCore';
import { CyberHeist } from './games/CyberHeist';
import { NebulaStrike } from './games/NebulaStrike';
import { ChronoShift } from './games/ChronoShift';
import { RoboTycoon } from './games/RoboTycoon';
import { ShadowDungeon } from './games/ShadowDungeon';
import { HyperDrift } from './games/HyperDrift';
import { PixelForge } from './games/PixelForge';
import { GravitySurge } from './games/GravitySurge';
import { SynthRider } from './games/SynthRider';
import { BioHazardDefense } from './games/BioHazardDefense';
import { SkyboundWings } from './games/SkyboundWings';
import { GlitchHunter } from './games/GlitchHunter';

export default function App() {
  const [state, setState] = useState<GlobalState>(() => {
    let parsed: any = null;
    try {
      const saved = localStorage.getItem('vertex_arcades_v3_state');
      if (saved) parsed = JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to parse state", e);
    }

    if (!parsed || !parsed.rngInventory) {
      parsed = {
        profile: {
          username: 'CYBER_HERO',
          avatarColor: '#06b6d4',
          avatarIcon: 'Crown',
          avatarModel: 'cyber_agent',
          totalVCoins: 850,
          totalPixels: 850,
          title: 'VÉTÉRAN VERTEX 3.0',
          unlockedTitles: ['VÉTÉRAN VERTEX 3.0'],
          unlockedAvatarIcons: ['Crown', 'Zap', 'Star'],
          activeAura: 'none',
          unlockedAuras: ['none'],
          activeBanner: 'banner_cyber_grid',
          unlockedBanners: ['banner_cyber_grid'],
          activeFrame: 'frame_neon_cyan',
          unlockedFrames: ['frame_neon_cyan'],
          activeHat: 'hat_cap_pro',
          unlockedHats: ['hat_cap_pro'],
          bio: 'Prêt pour la version 3.0 ! Explorateur de mondes et collectionneur de reliques.',
          selectedTags: ['Pro Gamer', 'Obby King', 'Trader'],
          unlockedGames: [],
          luckMultiplier: 1
        },
        stats: GAMES_LIST.reduce((acc, g) => {
          acc[g.id] = { plays: 0, highScore: 0 };
          return acc;
        }, {} as Record<string, GameStats>),
        achievements: INITIAL_ACHIEVEMENTS_200,
        quests: INITIAL_QUESTS_V3,
        arcadePass: { level: 1, xp: 0, isPremium: false, claimedFreeRewards: [], claimedPremiumRewards: [] },
        settings: {
          sfxEnabled: true,
          musicEnabled: true,
          sfxVolume: 70,
          musicVolume: 40,
          currentTrack: 'chill',
          graphicsQuality: 'ultra',
          particleDensity: 'extreme',
          glowEffects: true,
          scanlines: false,
          hapticVibration: true,
          showFps: false,
          controllerLayout: 'xbox'
        },
        rankPoints: 150,
        totalTrophies: 60,
        claimedTrophyRoadRewards: [50],
        rngInventory: { bloxy_cola: 2, golden_noob_head: 1 },
        rngTotalRolls: 3,
        activeTradeRequests: INITIAL_TRADE_REQUESTS,
        completedTradesCount: 0,
        worldBoss: {
          name: 'TITAN GLITCH OMNI',
          currentHp: 885000,
          maxHp: 1000000,
          stage: 1,
          playerTotalDamage: 4500,
          claimedMilestones: []
        },
        favorites: ['quantum_obby', 'titan_core'],
        recentGames: []
      };
    }

    return parsed;
  });

  // Active game & category filters
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showRngModal, setShowRngModal] = useState(false);
  const [showTrophyModal, setShowTrophyModal] = useState(false);
  const [showRankedModal, setShowRankedModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showQuestsModal, setShowQuestsModal] = useState(false);
  const [showForgeModal, setShowForgeModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);

  // Paid game prompt modal state
  const [paidGamePrompt, setPaidGamePrompt] = useState<string | null>(null);

  // Notification Toast
  const [notification, setNotification] = useState<string | null>(null);
  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Controller / Gamepad Hook
  const { gamepadState, vibrate } = useGamepad((action) => {
    if (action === 'B') {
      // Close any open modal
      setShowRngModal(false);
      setShowTrophyModal(false);
      setShowRankedModal(false);
      setShowProfileModal(false);
      setShowQuestsModal(false);
      setShowForgeModal(false);
      setShowAchievementsModal(false);
      setShowShopModal(false);
      setShowSettingsModal(false);
      setShowPassModal(false);
      setPaidGamePrompt(null);
    } else if (action === 'Y') {
      audio.playClick();
      setShowProfileModal(true);
    }
  });

  // Save state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vertex_arcades_v3_state', JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to persist state", e);
    }
  }, [state]);

  const currentVCoins = state.profile.totalVCoins ?? 0;

  // Toggle favorite with Heart icon
  const handleToggleFavorite = (gameId: string) => {
    audio.playHeartPop();
    vibrate(40, 0.4, 0.5);
    setState(prev => {
      const isFav = prev.favorites.includes(gameId);
      const newFavs = isFav
        ? prev.favorites.filter(id => id !== gameId)
        : [...prev.favorites, gameId];
      return { ...prev, favorites: newFavs };
    });
  };

  // Handle Game launch with Paid verification
  const handleTryLaunchGame = (gameId: string) => {
    const game = GAMES_LIST.find(g => g.id === gameId);
    if (!game) return;

    if (game.isPaid && !state.profile.unlockedGames?.includes(gameId)) {
      audio.playClick();
      setPaidGamePrompt(gameId);
      return;
    }

    audio.playStart();
    setActiveGameId(gameId);
  };

  // Unlock paid game with V-Coins
  const handleUnlockPaidGame = (gameId: string) => {
    const game = GAMES_LIST.find(g => g.id === gameId);
    if (!game || currentVCoins < game.costVCoins) return;

    audio.playWin();
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        totalVCoins: prev.profile.totalVCoins - game.costVCoins,
        unlockedGames: [...(prev.profile.unlockedGames || []), gameId]
      }
    }));
    notify(`Jeu débloqué avec succès : ${game.frenchName} !`);
    setPaidGamePrompt(null);
    setActiveGameId(gameId);
  };

  // Finish Game Handler (Rewards + Quests + Trophies + Ranked Points + World Boss Damage)
  const handleFinishGame = (gameId: string, score: number, customVCoinsBonus = 0) => {
    const prevStats = state.stats[gameId] || { plays: 0, highScore: 0 };
    const isNewHigh = score > prevStats.highScore;

    // High performance reward scaling
    const earnedVC = Math.max(25, Math.min(350, Math.floor(score * 0.15) + (isNewHigh ? 50 : 0) + customVCoinsBonus));
    const earnedXP = Math.floor(earnedVC * 1.5) + (isNewHigh ? 60 : 25);
    const earnedTrophies = isNewHigh ? 6 : 3;

    // Ranked Points if this is one of the 3 Ranked Games
    const isRanked = RANKED_GAMES_IDS.includes(gameId);
    const earnedRP = isRanked ? Math.floor(score * 0.25) + 30 : 0;

    // Deal damage to World Boss
    const bossDmg = Math.max(100, Math.floor(score * 1.2));

    audio.playWin();

    setState(prev => {
      // 1. Stats
      const newStats = {
        ...prev.stats,
        [gameId]: {
          plays: prevStats.plays + 1,
          highScore: Math.max(prevStats.highScore, score)
        }
      };

      // 2. Quests
      const newQuests = prev.quests.map(q => {
        let added = 0;
        if (q.id === 'q_daily_1') added = 1;
        if (q.id === 'q_daily_2' && gameId === 'quantum_obby') added = score;
        if (q.id === 'q_daily_3') added = earnedVC;
        if (q.id === 'q_weekly_1') added = 1;
        if (q.id === 'q_weekly_2' && gameId === 'aetheria_void') added = score;
        if (q.id === 'q_meta_1') added = bossDmg;

        const nextCur = Math.min(q.target, q.current + added);
        return { ...q, current: nextCur, isCompleted: nextCur >= q.target };
      });

      // 3. Pass XP
      let nextPassXp = prev.arcadePass.xp + earnedXP;
      let nextPassLevel = prev.arcadePass.level;
      while (nextPassXp >= 1000 && nextPassLevel < 50) {
        nextPassXp -= 1000;
        nextPassLevel += 1;
      }

      // 4. World Boss
      const nextBossHp = Math.max(0, prev.worldBoss.currentHp - bossDmg);

      return {
        ...prev,
        profile: {
          ...prev.profile,
          totalVCoins: prev.profile.totalVCoins + earnedVC
        },
        totalTrophies: prev.totalTrophies + earnedTrophies,
        rankPoints: prev.rankPoints + earnedRP,
        stats: newStats,
        quests: newQuests,
        arcadePass: {
          ...prev.arcadePass,
          level: nextPassLevel,
          xp: nextPassXp
        },
        worldBoss: {
          ...prev.worldBoss,
          currentHp: nextBossHp,
          playerTotalDamage: prev.worldBoss.playerTotalDamage + bossDmg
        },
        recentGames: [gameId, ...prev.recentGames.filter(id => id !== gameId)].slice(0, 8)
      };
    });

    notify(
      `🏆 VICTOIRE : +${earnedVC} V-Coins • +${earnedTrophies} 🏆${isRanked ? ` • +${earnedRP} RP` : ''} • -${bossDmg} PV au Boss !`
    );
  };

  // Filter games
  const filteredGames = GAMES_LIST.filter(game => {
    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'favorites'
        ? state.favorites.includes(game.id)
        : selectedCategory === 'paid'
        ? game.isPaid
        : selectedCategory === 'ranked'
        ? game.isRankedAvailable
        : game.category === selectedCategory;

    const gameTitle = game.frenchName || game.name;
    const matchesSearch =
      gameTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-[#080b14] text-slate-100 flex flex-col justify-between overflow-x-hidden font-sans select-none">
      {/* 1. Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-slate-900/95 border-2 border-cyan-400 text-white font-mono text-xs font-bold shadow-[0_0_35px_rgba(6,182,212,0.6)] flex items-center gap-2.5 backdrop-blur-xl"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Top Header: REFRESHED LOGO DEAD CENTER, NO TEXT "VERTEX ARCADES" */}
      <header className="sticky top-0 z-40 w-full bg-[#070a12] border-b border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xl">
        {/* Left: Player Profile Pill */}
        <div
          onClick={() => { audio.playClick(); setShowProfileModal(true); }}
          className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-[#0d1222] border border-slate-700 hover:border-cyan-400 transition-all cursor-pointer group shadow-md"
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg border-2 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
            style={{ backgroundColor: state.profile.avatarColor }}
          >
            {state.profile.avatarModel === 'cyber_ninja' ? '🥷' : state.profile.avatarModel === 'blocky_knight' ? '🛡️' : '🧑‍🚀'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-black text-white font-mono leading-none group-hover:text-cyan-300 transition-colors">
              {state.profile.username}
            </div>
            <div className="text-[10px] text-yellow-400 font-mono flex items-center gap-1 mt-0.5 font-bold">
              <Trophy className="w-3 h-3 fill-current" /> {state.totalTrophies} 🏆
            </div>
          </div>
        </div>

        {/* Center: REFRESHED VERTEX ARCADES LOGO DEAD CENTER (NO TEXT!) */}
        <div className="flex items-center justify-center">
          <div
            onClick={() => { audio.playWin(); }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-amber-400 border-2 border-white/80 flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(6,182,212,0.7),0_0_20px_rgba(217,70,239,0.6)] cursor-pointer hover:rotate-12 transition-transform active:scale-95"
            title="Vertex Arcades v3.0 Logo"
          >
            {/* Chromatic stylized geometric cube logo icon */}
            <svg className="w-7 h-7 fill-slate-950" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
        </div>

        {/* Right: V-Coins Pill & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Gamepad detection indicator */}
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
              gamepadState.connected
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(34,197,94,0.5)]'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={gamepadState.connected ? `Manette connectée : ${gamepadState.id}` : 'Manette déconnectée'}
          >
            <Gamepad2 className="w-4 h-4" />
          </div>

          {/* V-Coins Wallet */}
          <div
            onClick={() => { audio.playClick(); setShowShopModal(true); }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-500 text-yellow-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] text-xs font-mono font-bold cursor-pointer hover:bg-amber-900/80 transition-all"
          >
            <Coins className="w-4 h-4 fill-current text-yellow-400 animate-pulse" />
            <span>{currentVCoins.toLocaleString()} VC</span>
          </div>

          {/* Settings */}
          <button
            onClick={() => { audio.playClick(); setShowSettingsModal(true); }}
            className="w-9 h-9 rounded-full bg-[#0d1222] hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Paramètres"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 3. Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 pb-28">
        {/* Vertex Arcades Action Hub Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* 1. Sanctuaire RNG (Replaces Nano Star) */}
          <div
            onClick={() => { audio.playClick(); setShowRngModal(true); }}
            className="p-5 rounded-3xl border-2 border-cyan-500/40 bg-[#0c1224] hover:bg-[#121a32] hover:border-cyan-400 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  🎲
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-mono">
                  RNG VERTEX
                </span>
              </div>
              <h3 className="font-bold text-white text-base font-mono group-hover:text-cyan-300 transition-colors">
                Sanctuaire RNG
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Tirez et échangez des reliques mythiques du Cyberverse, Fortnite et Minecraft !
              </p>
            </div>
          </div>

          {/* 2. Ligue des Trophées Vertex */}
          <div
            onClick={() => { audio.playClick(); setShowTrophyModal(true); }}
            className="p-5 rounded-3xl border-2 border-yellow-500/40 bg-[#0c1224] hover:bg-[#121a32] hover:border-yellow-400 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 border border-yellow-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                  🏆
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-yellow-400/20 text-yellow-300 border border-yellow-400 font-mono">
                  LIGUE APEX
                </span>
              </div>
              <h3 className="font-bold text-white text-base font-mono group-hover:text-yellow-300 transition-colors">
                Ligue des Trophées
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Route des trophées 0 à 10 000 🏆 avec récompenses et chapeaux exclusifs.
              </p>
            </div>
          </div>

          {/* 3. Classé v3.0 (3 dedicated games, pure ladder progression) */}
          <div
            onClick={() => { audio.playClick(); setShowRankedModal(true); }}
            className="p-5 rounded-3xl border-2 border-red-500/40 bg-[#0c1224] hover:bg-[#121a32] hover:border-red-400 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                  🔥
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-300 border border-red-400 font-mono">
                  3 ÉPREUVES
                </span>
              </div>
              <h3 className="font-bold text-white text-base font-mono group-hover:text-red-300 transition-colors">
                Classé v3.0
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Grimpez du Bronze au rang Apex. Plus vous jouez, plus vous engrangez de RP !
              </p>
            </div>
          </div>

          {/* 4. Crazy New System: World Boss & Fusion Forge */}
          <div
            onClick={() => { audio.playClick(); setShowForgeModal(true); }}
            className="p-5 rounded-3xl border-2 border-fuchsia-500/40 bg-[#0c1224] hover:bg-[#121a32] hover:border-fuchsia-400 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(217,70,239,0.3)]">
                  👾
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400 font-mono">
                  WORLD BOSS
                </span>
              </div>
              <h3 className="font-bold text-white text-base font-mono group-hover:text-fuchsia-300 transition-colors">
                Titan Glitch Raid
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Boss mondial à 1M de PV & laboratoire de transmutation de reliques !
              </p>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'Tous les Jeux (15)' },
              { id: 'favorites', label: 'Mes Favoris ❤️' },
              { id: 'ranked', label: 'Classé 🏆' },
              { id: 'paid', label: 'VIP V-Coins 💎' },
              { id: 'action', label: 'Action & Combat' },
              { id: 'platformer', label: 'Obby & Runner' },
              { id: 'tycoon', label: 'Tycoon & Factory' },
              { id: 'rhythm', label: 'Rythme' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => { audio.playClick(); setSelectedCategory(cat.id); }}
                className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                    : 'bg-[#0d1222] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une expérience..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#0d1222] border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* 4. Vertex Experiences Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredGames.map((game) => {
            const stats = state.stats[game.id] || { plays: 0, highScore: 0 };
            const isFavorite = state.favorites.includes(game.id);
            const isUnlocked = !game.isPaid || state.profile.unlockedGames?.includes(game.id);

            return (
              <div
                key={game.id}
                className="rounded-3xl border-2 border-slate-800 bg-[#0c1020] hover:border-cyan-400/80 transition-all flex flex-col justify-between overflow-hidden group shadow-xl hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]"
              >
                {/* Game Card Illustration Banner */}
                <div className="relative">
                  <GameCardIllustration gameId={game.id} className="w-full h-44" />

                  {/* Favorite Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(game.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                      isFavorite
                        ? 'bg-rose-500/30 border-rose-400 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                        : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>

                  {/* Meta Pill (Active players & thumbs up) */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-[10px] font-mono font-bold text-emerald-400 border border-slate-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {game.activePlayers}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-300 border border-slate-700">
                      👍 {game.rating}%
                    </span>
                  </div>
                </div>

                {/* Card Information */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>Créateur : <strong className="text-slate-300">{game.creator}</strong></span>
                      <span className="text-yellow-400 font-bold">{game.isPaid ? `${game.costVCoins} VC` : 'GRATUIT'}</span>
                    </div>

                    <h3 className="font-black text-white text-base group-hover:text-cyan-300 transition-colors font-mono">
                      {game.frenchName}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  {/* Highscore & Play Button */}
                  <div className="pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-3">
                      <span>Record : <strong className="text-cyan-300">{stats.highScore.toLocaleString()} pts</strong></span>
                      <span>Parties : {stats.plays}</span>
                    </div>

                    {/* Play Button */}
                    <button
                      onClick={() => handleTryLaunchGame(game.id)}
                      className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg font-mono ${
                        isUnlocked
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                          : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                      }`}
                    >
                      {isUnlocked ? (
                        <>
                          <Play className="w-4 h-4 fill-current" /> JOUER
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" /> DÉBLOQUER ({game.costVCoins} VC)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 5. Floating Rounded Bottom Navigation Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[94vw]">
        <div className="px-4 py-2.5 rounded-full bg-[#080d1a] border-2 border-cyan-500/50 shadow-[0_4px_30px_rgba(0,0,0,0.9),0_0_25px_rgba(6,182,212,0.35)] flex items-center gap-1 sm:gap-3">
          <button
            onClick={() => { audio.playClick(); setActiveGameId(null); }}
            className="p-2.5 rounded-full hover:bg-cyan-500/20 text-cyan-300 flex flex-col items-center gap-0.5 transition-all cursor-pointer"
            title="Catalogue de Jeux"
          >
            <Gamepad2 className="w-5 h-5" />
            <span className="text-[9px] font-bold">Jeux</span>
          </button>

          <button
            onClick={() => { audio.playClick(); setShowRngModal(true); }}
            className="p-2.5 rounded-full hover:bg-cyan-500/20 text-cyan-300 flex flex-col items-center gap-0.5 transition-all cursor-pointer"
            title="Sanctuaire RNG"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[9px] font-bold">RNG</span>
          </button>

          <button
            onClick={() => { audio.playClick(); setShowTrophyModal(true); }}
            className="p-2.5 rounded-full hover:bg-yellow-500/20 text-yellow-300 flex flex-col items-center gap-0.5 transition-all cursor-pointer"
            title="Ligue des Trophées"
          >
            <Trophy className="w-5 h-5" />
            <span className="text-[9px] font-bold">Trophées</span>
          </button>

          <button
            onClick={() => { audio.playClick(); setShowRankedModal(true); }}
            className="p-2.5 rounded-full hover:bg-red-500/20 text-red-400 flex flex-col items-center gap-0.5 transition-all cursor-pointer"
            title="Mode Classé"
          >
            <Flame className="w-5 h-5" />
            <span className="text-[9px] font-bold">Classé</span>
          </button>

          <button
            onClick={() => { audio.playClick(); setShowPassModal(true); }}
            className="p-2.5 rounded-full hover:bg-purple-500/20 text-purple-300 flex flex-col items-center gap-0.5 transition-all cursor-pointer"
            title="Pass Arcade"
          >
            <Crown className="w-5 h-5" />
            <span className="text-[9px] font-bold">Pass</span>
          </button>

          <button
            onClick={() => { audio.playClick(); setShowQuestsModal(true); }}
            className="p-2.5 rounded-full hover:bg-emerald-500/20 text-emerald-300 flex flex-col items-center gap-0.5 transition-all cursor-pointer"
            title="Missions"
          >
            <Target className="w-5 h-5" />
            <span className="text-[9px] font-bold">Missions</span>
          </button>

          <button
            onClick={() => { audio.playClick(); setShowShopModal(true); }}
            className="p-2.5 rounded-full hover:bg-rose-500/20 text-rose-300 flex flex-col items-center gap-0.5 transition-all cursor-pointer"
            title="Boutique"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[9px] font-bold">Boutique</span>
          </button>

          <button
            onClick={() => { audio.playClick(); setShowAchievementsModal(true); }}
            className="p-2.5 rounded-full hover:bg-yellow-500/20 text-yellow-300 flex flex-col items-center gap-0.5 transition-all cursor-pointer"
            title="Succès (200)"
          >
            <Award className="w-5 h-5" />
            <span className="text-[9px] font-bold">200 Succès</span>
          </button>
        </div>
      </div>

      {/* 6. Active Game Overlay Cabinet */}
      {activeGameId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/95 backdrop-blur-xl overflow-y-auto">
          <div className="relative w-full max-w-5xl my-auto py-2">
            {activeGameId === 'quantum_obby' && (
              <QuantumObby
                onFinish={(sc, b) => handleFinishGame('quantum_obby', sc, b)}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'aetheria_void' && (
              <AetheriaVoid
                onFinish={(sc, b) => handleFinishGame('aetheria_void', sc, b)}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'titan_core' && (
              <TitanCore
                onFinish={(sc, b) => handleFinishGame('titan_core', sc, b)}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'cyber_heist' && (
              <CyberHeist
                onFinish={(sc, b) => handleFinishGame('cyber_heist', sc, b)}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'nebula_strike' && (
              <NebulaStrike
                onFinish={(sc, b) => handleFinishGame('nebula_strike', sc, b)}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'chrono_shift' && (
              <ChronoShift
                onFinish={(sc, b) => handleFinishGame('chrono_shift', sc, b)}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'robo_tycoon' && (
              <RoboTycoon
                onFinish={(sc, b) => handleFinishGame('robo_tycoon', sc, b)}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'shadow_dungeon' && (
              <ShadowDungeon
                onFinish={(sc, b) => handleFinishGame('shadow_dungeon', sc, b)}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'hyper_drift' && (
              <HyperDrift
                onFinish={(sc, b) => handleFinishGame('hyper_drift', sc, b)}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'pixelforge_craft' && (
              <PixelForge
                onFinish={(sc, b) => handleFinishGame('pixelforge_craft', sc, b)}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'gravity_surge' && (
              <GravitySurge
                onFinish={(sc, b) => handleFinishGame('gravity_surge', sc, b)}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'synth_rider' && (
              <SynthRider
                onFinish={(sc, b) => handleFinishGame('synth_rider', sc, b)}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'biohazard_defense' && (
              <BioHazardDefense
                onFinish={(sc, b) => handleFinishGame('biohazard_defense', sc, b)}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'skybound_wings' && (
              <SkyboundWings
                onFinish={(sc, b) => handleFinishGame('skybound_wings', sc, b)}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'glitch_hunter' && (
              <GlitchHunter
                onFinish={(sc, b) => handleFinishGame('glitch_hunter', sc, b)}
                onExit={() => setActiveGameId(null)}
              />
            )}

            {/* Mobile / Touch Ergonomic Controls */}
            <MobileGameControls
              gameId={activeGameId}
              onExit={() => setActiveGameId(null)}
            />
          </div>
        </div>
      )}

      {/* 7. Paid Game Unlock Modal */}
      {paidGamePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0e1424] border-2 border-amber-500 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400 mx-auto flex items-center justify-center text-3xl">
              💎
            </div>
            <h3 className="text-xl font-bold text-white font-mono">
              ACCÈS VIP REQUIS
            </h3>
            <p className="text-xs text-slate-300">
              Cette expérience arcade de prestige nécessite un pass VIP de{' '}
              <strong className="text-yellow-400">
                {GAMES_LIST.find(g => g.id === paidGamePrompt)?.costVCoins} V-Coins
              </strong>{' '}
              pour un déblocage permanent !
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setPaidGamePrompt(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs uppercase cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => handleUnlockPaidGame(paidGamePrompt)}
                disabled={currentVCoins < (GAMES_LIST.find(g => g.id === paidGamePrompt)?.costVCoins || 0)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 disabled:opacity-40 text-slate-950 font-black text-xs uppercase cursor-pointer"
              >
                Débloquer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Modals System */}
      <RngUniverseModal
        isOpen={showRngModal}
        onClose={() => setShowRngModal(false)}
        inventory={state.rngInventory}
        onInventoryUpdate={(newInv, vc) => {
          setState(prev => ({
            ...prev,
            rngInventory: newInv,
            rngTotalRolls: prev.rngTotalRolls + 1,
            profile: { ...prev.profile, totalVCoins: prev.profile.totalVCoins + vc }
          }));
        }}
        tradeRequests={state.activeTradeRequests}
        onAcceptTrade={(tradeId) => {
          const trade = state.activeTradeRequests.find(t => t.id === tradeId);
          if (!trade) return;
          setState(prev => ({
            ...prev,
            activeTradeRequests: prev.activeTradeRequests.filter(t => t.id !== tradeId),
            completedTradesCount: prev.completedTradesCount + 1,
            profile: { ...prev.profile, totalVCoins: prev.profile.totalVCoins + trade.offeredVCoins }
          }));
          notify(`Échange accepté avec ${trade.traderName} ! (+${trade.offeredVCoins} VC)`);
        }}
        totalRolls={state.rngTotalRolls}
        userVCoins={currentVCoins}
      />

      <ApexTrophyRoadModal
        isOpen={showTrophyModal}
        onClose={() => setShowTrophyModal(false)}
        totalTrophies={state.totalTrophies}
        claimedMilestones={state.claimedTrophyRoadRewards}
        onClaimMilestone={(nodeReq, label, type, val) => {
          setState(prev => {
            const nextClaimed = [...prev.claimedTrophyRoadRewards, nodeReq];
            let nextVC = prev.profile.totalVCoins;
            if (type === 'vcoins') nextVC += Number(val);
            return {
              ...prev,
              claimedTrophyRoadRewards: nextClaimed,
              profile: { ...prev.profile, totalVCoins: nextVC }
            };
          });
          notify(`Palier débloqué : ${label} !`);
        }}
      />

      <RankedV3Modal
        isOpen={showRankedModal}
        onClose={() => setShowRankedModal(false)}
        rankPoints={state.rankPoints}
        onLaunchRankedGame={(gameId) => {
          setShowRankedModal(false);
          setActiveGameId(gameId);
        }}
      />

      <ProfileCreatorModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={state.profile}
        onSaveProfile={(updated) => {
          setState(prev => ({ ...prev, profile: updated }));
          notify(`Profil de ${updated.username} mis à jour avec succès !`);
        }}
        totalTrophies={state.totalTrophies}
        rankPoints={state.rankPoints}
      />

      <QuestsV3Modal
        isOpen={showQuestsModal}
        onClose={() => setShowQuestsModal(false)}
        quests={state.quests}
        onClaimQuest={(qId) => {
          const q = state.quests.find(quest => quest.id === qId);
          if (!q) return;
          setState(prev => ({
            ...prev,
            profile: { ...prev.profile, totalVCoins: prev.profile.totalVCoins + q.rewardVCoins },
            quests: prev.quests.map(qst => qst.id === qId ? { ...qst, isClaimed: true } : qst)
          }));
          notify(`Quête complétée : +${q.rewardVCoins} V-Coins !`);
        }}
        onLaunchGame={(gId) => {
          setShowQuestsModal(false);
          handleTryLaunchGame(gId);
        }}
      />

      <MetaverseForgeModal
        isOpen={showForgeModal}
        onClose={() => setShowForgeModal(false)}
        worldBoss={state.worldBoss}
        onDealBossDamage={(dmg) => {
          setState(prev => ({
            ...prev,
            profile: { ...prev.profile, totalVCoins: Math.max(0, prev.profile.totalVCoins - 30) },
            worldBoss: {
              ...prev.worldBoss,
              currentHp: Math.max(0, prev.worldBoss.currentHp - dmg),
              playerTotalDamage: prev.worldBoss.playerTotalDamage + dmg
            }
          }));
          notify(`Frappe directe au Boss : -${dmg} PV !`);
        }}
        inventory={state.rngInventory}
        onFuseArtifact={() => {
          setState(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              luckMultiplier: 2,
              totalVCoins: prev.profile.totalVCoins + 500
            }
          }));
          notify(`Fusion réussie : Relique Stellaire Forgée (+2x Chance & +500 VC) !`);
        }}
        userVCoins={currentVCoins}
      />

      <AchievementsV3Modal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        achievements={state.achievements}
      />

      <ShopV3Modal
        isOpen={showShopModal}
        onClose={() => setShowShopModal(false)}
        userVCoins={currentVCoins}
        profile={state.profile}
        onBuyAndEquip={(item) => {
          setState(prev => {
            let nextProfile = { ...prev.profile };
            if (!nextProfile.unlockedHats?.includes(item.id) && item.category === 'hat') {
              nextProfile.unlockedHats = [...(nextProfile.unlockedHats || []), item.id];
              nextProfile.activeHat = item.id;
              nextProfile.totalVCoins -= item.costVCoins;
            } else if (!nextProfile.unlockedAuras?.includes(item.id) && item.category === 'aura') {
              nextProfile.unlockedAuras = [...(nextProfile.unlockedAuras || []), item.id];
              nextProfile.activeAura = item.id;
              nextProfile.totalVCoins -= item.costVCoins;
            } else if (!nextProfile.unlockedTitles?.includes(item.name) && item.category === 'title') {
              nextProfile.unlockedTitles = [...(nextProfile.unlockedTitles || []), item.name];
              nextProfile.title = item.name;
              nextProfile.totalVCoins -= item.costVCoins;
            }
            return { ...prev, profile: nextProfile };
          });
          notify(`Cosmétique équipé : ${item.name} !`);
        }}
      />

      <SettingsV3Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={state.settings}
        onUpdateSettings={(newSet) => setState(prev => ({ ...prev, settings: newSet }))}
        gamepadConnected={gamepadState.connected}
        gamepadName={gamepadState.id}
        onResetData={() => {
          localStorage.removeItem('vertex_arcades_v3_state');
          window.location.reload();
        }}
      />

      <ArcadePassV3Modal
        isOpen={showPassModal}
        onClose={() => setShowPassModal(false)}
        passState={state.arcadePass}
        onClaimReward={(lvl, isPrem, label, type, val) => {
          setState(prev => {
            const nextFreeClaimed = !isPrem ? [...prev.arcadePass.claimedFreeRewards, lvl] : prev.arcadePass.claimedFreeRewards;
            const nextPremClaimed = isPrem ? [...prev.arcadePass.claimedPremiumRewards, lvl] : prev.arcadePass.claimedPremiumRewards;
            let nextVC = prev.profile.totalVCoins;
            if (type === 'vcoins') nextVC += Number(val);
            return {
              ...prev,
              profile: { ...prev.profile, totalVCoins: nextVC },
              arcadePass: {
                ...prev.arcadePass,
                claimedFreeRewards: nextFreeClaimed,
                claimedPremiumRewards: nextPremClaimed
              }
            };
          });
          notify(`Récompense du Pass récupérée : ${label} !`);
        }}
        onUpgradeToPremium={() => {
          setState(prev => ({
            ...prev,
            profile: { ...prev.profile, totalVCoins: prev.profile.totalVCoins - 1000 },
            arcadePass: { ...prev.arcadePass, isPremium: true }
          }));
          notify(`Pass Arcade VIP débloqué avec succès ! 👑`);
        }}
        userVCoins={currentVCoins}
      />
    </div>
  );
}
