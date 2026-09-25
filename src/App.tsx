import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Trophy, Sparkles, Heart, Search, Play, X, Coins,
  Settings, Gamepad2, Volume2, VolumeX, Crown, Target, ShoppingBag,
  ArrowRightLeft, Skull, Flame, Check, Shield, Lock, User, Award,
  Menu, ChevronRight, Plus, Star, Compass, Layers, Radio
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

// 20 Games
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
import { CosmicMiner } from './games/CosmicMiner';
import { ShadowShinobi } from './games/ShadowShinobi';
import { SpeedRunners2099 } from './games/SpeedRunners2099';
import { BlockCraftArena } from './games/BlockCraftArena';
import { NeonCyberPong } from './games/NeonCyberPong';

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
          totalVCoins: 1250,
          totalPixels: 1250,
          title: 'VÉTÉRAN VERTEX 3.1',
          unlockedTitles: ['VÉTÉRAN VERTEX 3.1'],
          unlockedAvatarIcons: ['Crown', 'Zap', 'Star'],
          activeAura: 'none',
          unlockedAuras: ['none'],
          activeBanner: 'banner_cyber_grid',
          unlockedBanners: ['banner_cyber_grid'],
          activeFrame: 'frame_neon_cyan',
          unlockedFrames: ['frame_neon_cyan'],
          activeHat: 'hat_cap_pro',
          unlockedHats: ['hat_cap_pro'],
          bio: 'Prêt pour la version 3.1 ! Explorateur d\'expériences et champion de l\'arène.',
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
        arcadePass: { level: 2, xp: 350, isPremium: false, claimedFreeRewards: [], claimedPremiumRewards: [] },
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
        rankPoints: 240,
        totalTrophies: 120,
        claimedTrophyRoadRewards: [50],
        rngInventory: { matrice_cyber_apex: 2, boogie_bomb: 1 },
        rngTotalRolls: 5,
        activeTradeRequests: INITIAL_TRADE_REQUESTS,
        completedTradesCount: 0,
        worldBoss: {
          name: 'TITAN GLITCH OMNI',
          currentHp: 850000,
          maxHp: 1000000,
          stage: 1,
          playerTotalDamage: 6500,
          claimedMilestones: []
        },
        favorites: ['quantum_obby', 'titan_core', 'shadow_shinobi'],
        recentGames: []
      };
    }

    return parsed;
  });

  // Active game & category filters
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // iOS Drawer Navigation Menu
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  // Heart particle animation tracker
  const [favoritedPopId, setFavoritedPopId] = useState<string | null>(null);

  // Notification Toast
  const [notification, setNotification] = useState<string | null>(null);
  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const toggleSound = () => {
    setState(prev => {
      const nextSfx = !prev.settings.sfxEnabled;
      audio.setSfxEnabled(nextSfx);
      audio.setMusicEnabled(nextSfx);
      if (nextSfx) audio.playClick();
      return {
        ...prev,
        settings: {
          ...prev.settings,
          sfxEnabled: nextSfx,
          musicEnabled: nextSfx
        }
      };
    });
  };

  // Controller / Gamepad Hook
  const { gamepadState, vibrate } = useGamepad((action) => {
    if (action === 'B') {
      setIsDrawerOpen(false);
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
    } else if (action === 'START') {
      audio.playClick();
      setIsDrawerOpen(prev => !prev);
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

  // Toggle favorite with animated Heart pop
  const handleToggleFavorite = (gameId: string) => {
    audio.playHeartPop();
    vibrate(45, 0.4, 0.6);
    setFavoritedPopId(gameId);
    setTimeout(() => setFavoritedPopId(null), 800);

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

    const earnedVC = Math.max(30, Math.min(400, Math.floor(score * 0.18) + (isNewHigh ? 60 : 0) + customVCoinsBonus));
    const earnedXP = Math.floor(earnedVC * 1.5) + (isNewHigh ? 75 : 30);
    const earnedTrophies = isNewHigh ? 8 : 4;

    const isRanked = RANKED_GAMES_IDS.includes(gameId);
    const earnedRP = isRanked ? Math.floor(score * 0.25) + 35 : 0;
    const bossDmg = Math.max(120, Math.floor(score * 1.25));

    audio.playWin();

    setState(prev => {
      const newStats = {
        ...prev.stats,
        [gameId]: {
          plays: prevStats.plays + 1,
          highScore: Math.max(prevStats.highScore, score)
        }
      };

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

      let nextPassXp = prev.arcadePass.xp + earnedXP;
      let nextPassLevel = prev.arcadePass.level;
      while (nextPassXp >= 1000 && nextPassLevel < 50) {
        nextPassXp -= 1000;
        nextPassLevel += 1;
      }

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
        : selectedCategory === 'free'
        ? !game.isPaid
        : selectedCategory === 'ranked'
        ? game.isRankedAvailable
        : game.category === selectedCategory;

    const gameTitle = game.frenchName || game.name;
    const matchesSearch =
      gameTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.creator.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative min-h-screen bg-[#070913] text-slate-100 flex flex-col justify-between overflow-x-hidden font-sans select-none antialiased">
      {/* 1. iOS Glass Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-slate-900/90 border border-cyan-400/50 text-white font-mono text-xs font-bold shadow-[0_8px_32px_rgba(6,182,212,0.35)] flex items-center gap-2.5 backdrop-blur-2xl"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Top Header - Liquid Glass Hotbar */}
      <header className="liquid-glass-header sticky top-0 z-40 w-full px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Specular top reflection glint line */}
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />

        {/* Left: Enhanced Rich Player Profile Capsule */}
        <div
          onClick={() => { audio.playClick(); setShowProfileModal(true); }}
          className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl liquid-glass-pill hover:border-cyan-400/60 transition-all cursor-pointer group shadow-sm active:scale-98"
        >
          <div className="relative">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              style={{ backgroundColor: state.profile.avatarColor }}
            >
              {state.profile.avatarModel === 'cyber_ninja' ? '🥷' : state.profile.avatarModel === 'blocky_knight' ? '🛡️' : '🧑‍🚀'}
            </div>
            {/* Live Online Status Dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white font-mono group-hover:text-cyan-300 transition-colors">
                {state.profile.username}
              </span>
              <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Niv. {state.arcadePass.level}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-[10px] text-slate-400 font-mono mt-0.5">
              <span className="text-yellow-400 font-bold flex items-center gap-1">
                <Trophy className="w-3 h-3 fill-current" /> {state.totalTrophies}
              </span>
              <span>·</span>
              <span className="text-orange-400 font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" /> 5j
              </span>
            </div>
          </div>
        </div>

        {/* Center: SLEEK MONOCHROME GAMEPAD LOGO (NO TEXT) */}
        <div
          onClick={() => { audio.playWin(); }}
          className="w-10 h-10 rounded-2xl liquid-glass-pill hover:border-cyan-400/70 flex items-center justify-center transition-all cursor-pointer group shadow-sm active:scale-95"
          title="Vertex Arcades"
        >
          <Gamepad2 className="w-5 h-5 text-cyan-400 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.9)] group-hover:scale-110 transition-transform" />
        </div>

        {/* Right: Compact VC Bubble + 3-Bars Menu Button */}
        <div className="flex items-center gap-2.5">
          {/* Compact Golden Liquid Glass VC Bubble */}
          <div
            onClick={() => { audio.playClick(); setShowShopModal(true); }}
            className="liquid-glass-vc flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-yellow-300 text-[11px] font-mono font-bold cursor-pointer group shadow-sm active:scale-95 transition-all"
            title="Votre solde V-Coins (Cliquer pour recharger)"
          >
            <Coins className="w-3.5 h-3.5 fill-current text-yellow-400 group-hover:rotate-12 transition-transform" />
            <span>{currentVCoins.toLocaleString()} VC</span>
            <div className="w-4 h-4 rounded-md bg-amber-400/30 flex items-center justify-center text-yellow-200 group-hover:bg-amber-400/50 transition-colors">
              <Plus className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          </div>

          {/* 3-BARS MENU BUTTON (OPENS DRAWER INTERFACE WITH ALL BUTTONS) */}
          <button
            onClick={() => {
              audio.playClick();
              setIsDrawerOpen(true);
            }}
            className="w-10 h-10 rounded-2xl liquid-glass-pill hover:border-cyan-400 flex items-center justify-center text-slate-200 hover:text-white transition-all cursor-pointer shadow-md active:scale-95 group"
            title="Ouvrir le menu principal (tous les menus)"
          >
            <Menu className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </header>

      {/* 3. Liquid Glass Slide-In Drawer Navigation Menu (From Right) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            {/* Slide-out Sheet */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="liquid-glass-drawer relative w-full max-w-md h-full p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto no-scrollbar"
            >
              <div className="space-y-6">
                {/* Drawer Header with Title & Close button */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white font-mono tracking-wider flex items-center gap-2">
                        HUB VERTEX
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                          v3.1
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400 font-sans">Toutes les expériences & fonctionnalités</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { audio.playClick(); setIsDrawerOpen(false); }}
                    className="w-9 h-9 rounded-full liquid-glass-pill text-slate-300 flex items-center justify-center hover:text-white hover:border-white/40 transition-all cursor-pointer shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Profile Summary Card inside Drawer */}
                <div 
                  onClick={() => { audio.playClick(); setShowProfileModal(true); setIsDrawerOpen(false); }}
                  className="p-3.5 rounded-2xl liquid-glass-card border border-white/15 cursor-pointer hover:border-cyan-400/60 transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl border border-cyan-400/60 shadow-inner"
                      style={{ backgroundColor: state.profile.avatarColor }}
                    >
                      {state.profile.avatarModel === 'cyber_ninja' ? '🥷' : state.profile.avatarModel === 'blocky_knight' ? '🛡️' : '🧑‍🚀'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white font-mono group-hover:text-cyan-300 transition-colors">
                          {state.profile.username}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/25 text-cyan-300 border border-cyan-400/30 font-bold">
                          VIP Niv. {state.arcadePass.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-slate-300 mt-1">
                        <span className="text-yellow-400 font-bold flex items-center gap-1">
                          <Trophy className="w-3 h-3 fill-current" /> {state.totalTrophies}
                        </span>
                        <span className="text-amber-300 font-bold flex items-center gap-1">
                          <Coins className="w-3 h-3 fill-current" /> {currentVCoins.toLocaleString()} VC
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
                </div>

                {/* Categorized Navigation Sections */}
                <div className="space-y-5">
                  {/* Category 1: JEUX & EXPÉRIENCES */}
                  <div>
                    <span className="text-[10px] font-mono font-black text-cyan-400/90 tracking-wider uppercase px-1 mb-2 block">
                      🎮 Jeux & Expériences
                    </span>
                    <div className="space-y-1.5">
                      {[
                        {
                          id: 'games',
                          title: 'Catalogue des Jeux',
                          subtitle: '20 Expériences (3 Gratuits • 17 VIP)',
                          badge: '20 JEUX',
                          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
                          icon: <Gamepad2 className="w-4 h-4 text-cyan-400" />,
                          iconBg: 'bg-cyan-500/10 border-cyan-400/30',
                          action: () => { setActiveGameId(null); setIsDrawerOpen(false); }
                        },
                        {
                          id: 'rng',
                          title: 'Sanctuaire RNG',
                          subtitle: 'Roulette de Reliques & Potions Alchimiques',
                          badge: 'CHANCE x3',
                          badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
                          icon: <Sparkles className="w-4 h-4 text-teal-300" />,
                          iconBg: 'bg-teal-500/10 border-teal-400/30',
                          action: () => { setShowRngModal(true); setIsDrawerOpen(false); }
                        },
                        {
                          id: 'ranked',
                          title: 'Mode Classé v3.1',
                          subtitle: 'Compétition, 3 Épreuves & Ladder Mondial',
                          badge: 'SAISON 1',
                          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
                          icon: <Flame className="w-4 h-4 text-rose-400" />,
                          iconBg: 'bg-rose-500/10 border-rose-400/30',
                          action: () => { setShowRankedModal(true); setIsDrawerOpen(false); }
                        }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => { audio.playClick(); item.action(); }}
                          className="w-full p-2.5 rounded-2xl liquid-glass-menu-item flex items-center justify-between cursor-pointer group text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${item.iconBg} group-hover:scale-105 transition-transform`}>
                              {item.icon}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white font-mono group-hover:text-cyan-300 transition-colors">
                                {item.title}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-sans">{item.subtitle}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category 2: PROGRESSION & RÉCOMPENSES */}
                  <div>
                    <span className="text-[10px] font-mono font-black text-amber-400/90 tracking-wider uppercase px-1 mb-2 block">
                      🏆 Progression & Récompenses
                    </span>
                    <div className="space-y-1.5">
                      {[
                        {
                          id: 'trophy',
                          title: 'Ligue Stellaire Apex',
                          subtitle: 'Route des 10 000 Trophées & Paliers',
                          badge: `${state.totalTrophies} 🏆`,
                          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
                          icon: <Trophy className="w-4 h-4 text-amber-400" />,
                          iconBg: 'bg-amber-500/10 border-amber-400/30',
                          action: () => { setShowTrophyModal(true); setIsDrawerOpen(false); }
                        },
                        {
                          id: 'pass',
                          title: 'Pass Arcade VIP',
                          subtitle: '50 Paliers débloquables & Titres légendaires',
                          badge: `Niv. ${state.arcadePass.level}`,
                          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
                          icon: <Crown className="w-4 h-4 text-purple-400" />,
                          iconBg: 'bg-purple-500/10 border-purple-400/30',
                          action: () => { setShowPassModal(true); setIsDrawerOpen(false); }
                        },
                        {
                          id: 'quests',
                          title: 'Missions & Quêtes',
                          subtitle: 'Défis journaliers, hebdos & boss',
                          badge: 'GAIN VC',
                          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
                          icon: <Target className="w-4 h-4 text-emerald-400" />,
                          iconBg: 'bg-emerald-500/10 border-emerald-400/30',
                          action: () => { setShowQuestsModal(true); setIsDrawerOpen(false); }
                        },
                        {
                          id: 'boss',
                          title: 'Titan Raid & Forge',
                          subtitle: 'Combat de boss mondial & transmutation',
                          badge: `BOSS V3`,
                          badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/30',
                          icon: <Skull className="w-4 h-4 text-fuchsia-400" />,
                          iconBg: 'bg-fuchsia-500/10 border-fuchsia-400/30',
                          action: () => { setShowForgeModal(true); setIsDrawerOpen(false); }
                        }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => { audio.playClick(); item.action(); }}
                          className="w-full p-2.5 rounded-2xl liquid-glass-menu-item flex items-center justify-between cursor-pointer group text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${item.iconBg} group-hover:scale-105 transition-transform`}>
                              {item.icon}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white font-mono group-hover:text-cyan-300 transition-colors">
                                {item.title}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-sans">{item.subtitle}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category 3: HUB JOUEUR & RÉGLAGES */}
                  <div>
                    <span className="text-[10px] font-mono font-black text-slate-400 tracking-wider uppercase px-1 mb-2 block">
                      💎 Hub Joueur & Réglages
                    </span>
                    <div className="space-y-1.5">
                      {[
                        {
                          id: 'shop',
                          title: 'Boutique Cosmétiques',
                          subtitle: 'Auras, Effets, Bannières, Chapeaux & Packs',
                          badge: 'BOUTIQUE',
                          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
                          icon: <ShoppingBag className="w-4 h-4 text-rose-400" />,
                          iconBg: 'bg-rose-500/10 border-rose-400/30',
                          action: () => { setShowShopModal(true); setIsDrawerOpen(false); }
                        },
                        {
                          id: 'achievements',
                          title: '200 Succès de Maîtrise',
                          subtitle: 'Défis complétés & récompenses de succès',
                          badge: '200 SUCCÈS',
                          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
                          icon: <Award className="w-4 h-4 text-amber-400" />,
                          iconBg: 'bg-amber-500/10 border-amber-400/30',
                          action: () => { setShowAchievementsModal(true); setIsDrawerOpen(false); }
                        },
                        {
                          id: 'profile',
                          title: 'Mon Profil & Bio',
                          subtitle: 'Personnaliser modèle, couleurs et tags',
                          badge: 'PROFIL',
                          badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
                          icon: <User className="w-4 h-4 text-sky-400" />,
                          iconBg: 'bg-sky-500/10 border-sky-400/30',
                          action: () => { setShowProfileModal(true); setIsDrawerOpen(false); }
                        },
                        {
                          id: 'settings',
                          title: 'Paramètres & Audio',
                          subtitle: 'Audio, graphismes, manettes et contrôles',
                          badge: 'RÉGLAGES',
                          badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-400/30',
                          icon: <Settings className="w-4 h-4 text-slate-300" />,
                          iconBg: 'bg-slate-500/10 border-slate-400/30',
                          action: () => { setShowSettingsModal(true); setIsDrawerOpen(false); }
                        }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => { audio.playClick(); item.action(); }}
                          className="w-full p-2.5 rounded-2xl liquid-glass-menu-item flex items-center justify-between cursor-pointer group text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${item.iconBg} group-hover:scale-105 transition-transform`}>
                              {item.icon}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-white font-mono group-hover:text-cyan-300 transition-colors">
                                {item.title}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-sans">{item.subtitle}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer with Quick Controls */}
              <div className="pt-5 border-t border-white/10 mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleSound}
                    className="p-2 rounded-xl liquid-glass-pill text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                    title="Basculer le son"
                  >
                    {state.settings.sfxEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{state.settings.sfxEnabled ? 'Son ON' : 'Son OFF'}</span>
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Vertex Arcades v3.1
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Main Content Body - Clean Modern Experience Catalog */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        {/* Liquid Glass Search & Segmented Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-7">
          {/* Liquid Glass Segmented Category Tabs */}
          <div className="relative flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl liquid-glass-container no-scrollbar shadow-2xl">
            {/* Top liquid reflection specular glint */}
            <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

            {[
              { id: 'all', label: `Tous les Jeux (${GAMES_LIST.length})` },
              { id: 'favorites', label: 'Favoris ❤️' },
              { id: 'free', label: 'Gratuits ⚡' },
              { id: 'paid', label: 'VIP V-Coins 💎' },
              { id: 'ranked', label: 'Classé 🏆' },
              { id: 'action', label: 'Action' },
              { id: 'survival', label: 'Survie' },
              { id: 'racer', label: 'Course' },
              { id: 'platformer', label: 'Obby' },
              { id: 'tycoon', label: 'Tycoon' },
              { id: 'rhythm', label: 'Rythme' }
            ].map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { audio.playClick(); setSelectedCategory(cat.id); }}
                  className={`relative px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap cursor-pointer transition-all ${
                    isActive
                      ? 'liquid-glass-pill-active scale-[1.02]'
                      : 'liquid-glass-pill text-slate-300 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Liquid Glass Search Box */}
          <div className="relative min-w-[280px] group">
            {/* Liquid aura backdrop glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 via-teal-400/20 to-blue-500/30 rounded-2xl blur-md opacity-40 group-focus-within:opacity-100 transition-all duration-500 pointer-events-none" />

            <div className="relative flex items-center rounded-2xl liquid-glass-input overflow-hidden">
              {/* Top specular refraction glint */}
              <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

              <Search className="w-4 h-4 ml-3.5 text-cyan-400 group-focus-within:text-cyan-300 transition-colors pointer-events-none shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une expérience, créateur..."
                className="w-full pl-3 pr-9 py-2.5 bg-transparent text-xs text-white placeholder-slate-400 outline-none font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 p-1 rounded-full bg-white/10 hover:bg-white/25 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 5. Rich Experience Grid (20 Games) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredGames.map((game) => {
            const stats = state.stats[game.id] || { plays: 0, highScore: 0 };
            const isFavorite = state.favorites.includes(game.id);
            const isUnlocked = !game.isPaid || state.profile.unlockedGames?.includes(game.id);
            const isPopping = favoritedPopId === game.id;

            return (
              <motion.div
                key={game.id}
                whileHover={{ y: -7, scale: 1.025 }}
                transition={{ type: "spring", stiffness: 380, damping: 24 }}
                className="liquid-glass-card rounded-3xl border border-white/12 bg-gradient-to-b from-slate-900/85 via-slate-900/90 to-slate-950/95 hover:border-cyan-400/80 transition-all flex flex-col justify-between overflow-hidden group shadow-xl hover:shadow-[0_20px_50px_rgba(6,182,212,0.35),0_0_30px_rgba(34,211,238,0.25)] backdrop-blur-2xl relative"
              >
                {/* Specular top reflection glint */}
                <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-20" />

                {/* Subtle ambient cyan aura on hover */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-cyan-400/12 via-transparent to-cyan-500/5 z-0" />

                {/* --- Illustration Cover & Floating Glass Chips --- */}
                <div className="relative overflow-hidden z-10">
                  <div className="transform transition-transform duration-500 ease-out group-hover:scale-105">
                    <GameCardIllustration gameId={game.id} className="w-full h-44 object-cover" />
                  </div>

                  {/* Contrast gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                  {/* Top-Left Floating Badge: Status / Price */}
                  <div className="absolute top-3 left-3 z-10">
                    {game.isPaid ? (
                      isUnlocked ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-black tracking-wider bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 backdrop-blur-md shadow-md flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-400 stroke-[3]" /> ACQUIS
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-black tracking-wider bg-amber-500/25 text-amber-300 border border-amber-400/50 backdrop-blur-md shadow-md flex items-center gap-1">
                          <Coins className="w-3 h-3 text-amber-400 fill-amber-400" /> {game.costVCoins} VC
                        </span>
                      )
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-black tracking-wider bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 backdrop-blur-md shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-400" /> GRATUIT
                      </span>
                    )}
                  </div>

                  {/* Top-Right Animated Heart Button */}
                  <motion.button
                    animate={isPopping ? { scale: [1, 1.4, 0.9, 1] } : { scale: 1 }}
                    transition={{ duration: 0.35 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(game.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xl border transition-all cursor-pointer shadow-md z-10 ${
                      isFavorite
                        ? 'bg-rose-500/35 border-rose-400/70 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                        : 'bg-slate-950/65 hover:bg-slate-900/80 border-white/20 text-slate-300 hover:text-white hover:border-white/40'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                  </motion.button>

                  {/* Bottom Image Badges: Category & Difficulty */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-[9px] font-mono font-bold text-cyan-300 border border-white/15 uppercase tracking-wider flex items-center gap-1">
                      <Gamepad2 className="w-2.5 h-2.5" />
                      {game.category}
                    </span>

                    <span className={`px-2 py-0.5 rounded-lg backdrop-blur-md text-[9px] font-mono font-bold border flex items-center gap-1.5 ${
                      game.difficulty === 'Facile'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : game.difficulty === 'Moyen'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        game.difficulty === 'Facile' ? 'bg-emerald-400' : game.difficulty === 'Moyen' ? 'bg-amber-400' : 'bg-rose-400'
                      }`} />
                      {game.difficulty}
                    </span>
                  </div>
                </div>

                {/* --- Information Card Body --- */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3.5 z-10">
                  <div className="space-y-1.5">
                    {/* Creator label */}
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
                      <span className="truncate text-slate-300">
                        Par <span className="text-cyan-300 font-semibold">{game.creator}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-black text-white text-base group-hover:text-cyan-300 transition-colors font-sans tracking-tight line-clamp-1">
                      {game.frenchName}
                    </h3>

                    {/* Description */}
                    <p className="text-[11px] text-slate-300/85 leading-relaxed line-clamp-2 h-[34px]">
                      {game.description}
                    </p>
                  </div>

                  {/* Player Personal Stats Pod (Organized 2-Column Capsule) */}
                  <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/8 backdrop-blur-sm text-[10px] font-mono">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-slate-400 text-[9px] block">Record</span>
                        <strong className="text-amber-300 font-black">{stats.highScore.toLocaleString()}</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 border-l border-white/10 pl-2.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-slate-400 text-[9px] block">Parties</span>
                        <strong className="text-cyan-300 font-black">{stats.plays}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Action CTA Button */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTryLaunchGame(game.id)}
                    className={`w-full py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg font-mono relative overflow-hidden ${
                      isUnlocked
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.35)] border border-emerald-300/40'
                        : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)] border border-yellow-300/40'
                    }`}
                  >
                    {/* Specular button sheen */}
                    <div className="absolute inset-x-4 top-0 h-[1px] bg-white/40 pointer-events-none" />

                    {isUnlocked ? (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" /> JOUER MAINTENANT
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 stroke-[2.5]" /> DÉBLOQUER ({game.costVCoins} VC)
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* 6. Active Game Overlay Cabinet (All 20 Games) */}
      {activeGameId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/95 backdrop-blur-2xl overflow-y-auto">
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
            {/* 5 NEW GAMES */}
            {activeGameId === 'cosmic_miner' && (
              <CosmicMiner
                onFinish={(sc, b) => handleFinishGame('cosmic_miner', sc, b)}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'shadow_shinobi' && (
              <ShadowShinobi
                onFinish={(sc, b) => handleFinishGame('shadow_shinobi', sc, b)}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'speed_runners_2099' && (
              <SpeedRunners2099
                onFinish={(sc, b) => handleFinishGame('speed_runners_2099', sc, b)}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'block_craft_arena' && (
              <BlockCraftArena
                onFinish={(sc, b) => handleFinishGame('block_craft_arena', sc, b)}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === 'neon_cyber_pong' && (
              <NeonCyberPong
                onFinish={(sc, b) => handleFinishGame('neon_cyber_pong', sc, b)}
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
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900/95 border border-amber-500/60 shadow-2xl text-center space-y-4">
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
