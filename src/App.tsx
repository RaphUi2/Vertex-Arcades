import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Trophy, Sparkles, Heart, Search, Play, X, Coins,
  Settings, Gamepad2, Volume2, VolumeX, Crown, Target, ShoppingBag,
  ArrowRightLeft, Skull, Flame, Check, Shield, Lock, User, Award,
  Menu, ChevronRight, Plus, Star, Compass, Layers, Radio, BookOpen,
  Filter, SlidersHorizontal, ArrowLeft, Users, Palette, Moon, Sun, Globe
} from 'lucide-react';

import { audio } from './utils/audio';
import { useGamepad } from './utils/gamepad';
import { GlobalState, GameStats, UserProfile, Quest, RngUniverseItem, StoryModeState, GameData } from './types';
import { Language, getTranslation } from './utils/i18n';
import {
  GAMES_LIST,
  INITIAL_ACHIEVEMENTS_300,
  INITIAL_QUESTS_V3,
  INITIAL_TRADE_REQUESTS,
  INITIAL_STORY_MODE,
  RANKED_GAMES_IDS
} from './gamesData';

// Modals
import { GameCardIllustration } from './components/GameCardIllustration';
import { GameDetailModal } from './components/GameDetailModal';
import { RngUniverseModal } from './components/RngUniverseModal';
import { ApexTrophyRoadModal } from './components/ApexTrophyRoadModal';
import { ProfileCreatorModal } from './components/ProfileCreatorModal';
import { QuestsV3Modal } from './components/QuestsV3Modal';
import { StoryModeModal } from './components/StoryModeModal';
import { AchievementsV3Modal } from './components/AchievementsV3Modal';
import { SettingsV3Modal } from './components/SettingsV3Modal';
import { ArcadePassV3Modal } from './components/ArcadePassV3Modal';
import { FriendsComingSoonModal } from './components/FriendsComingSoonModal';
import { VertexPortalHub } from './components/VertexPortalHub';
import { VibePreviewModal } from './components/VibePreviewModal';
import { VwebPreviewModal } from './components/VwebPreviewModal';
import { HalloweenDecorOverlay } from './components/HalloweenDecorOverlay';

// 5 Modern Games
import { CyberRunner2099 } from './games/CyberRunner2099';
import { CosmicDefender } from './games/CosmicDefender';
import { PixelDungeonQuest } from './games/PixelDungeonQuest';
import { TitanPinballTitan } from './games/TitanPinballTitan';
import { QuantumStrike } from './games/QuantumStrike';

const PLAY_BUTTON_STYLES: Record<string, string> = {
  emerald: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.35)] border border-emerald-300/40',
  cyan: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.45)] border border-cyan-300/50',
  purple: 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.45)] border border-purple-300/50',
  rose: 'bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.45)] border border-rose-300/50',
  amber: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.45)] border border-amber-300/60',
  zinc: 'bg-gradient-to-r from-zinc-800 via-zinc-900 to-black hover:from-zinc-700 hover:to-zinc-900 text-white shadow-[0_0_20px_rgba(0,0,0,0.7)] border border-white/30',
  white: 'bg-gradient-to-r from-white via-slate-100 to-slate-200 hover:from-slate-100 hover:to-white text-slate-950 font-black shadow-[0_0_20px_rgba(255,255,255,0.5)] border border-white'
};

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
          title: 'VÉTÉRAN VERTEX',
          unlockedTitles: ['VÉTÉRAN VERTEX'],
          unlockedAvatarIcons: ['Crown', 'Zap', 'Star'],
          activeAura: 'none',
          unlockedAuras: ['none'],
          activeBanner: 'banner_cyber_grid',
          unlockedBanners: ['banner_cyber_grid'],
          activeFrame: 'frame_neon_cyan',
          unlockedFrames: ['frame_neon_cyan'],
          activeHat: 'hat_cap_pro',
          unlockedHats: ['hat_cap_pro'],
          bio: 'Champion des arènes et explorateur de mondes arcade.',
          selectedTags: ['Pro Gamer', 'Speedrunner', 'Trader', 'Dodge Master'],
          unlockedGames: [],
          luckMultiplier: 1,
          socialStatus: 'ready_for_duel',
          socialCustomStatus: 'Prêt pour défier mes amis sur le Hub !',
          gamerPlaystyle: 'speedrunner',
          favoriteGameId: 'cyber_runner_2099',
          preferredControl: 'gamepad',
          voiceChatPreference: 'open',
          socialCardTheme: 'cyan',
          friendCode: 'VERTEX#8492'
        },
        stats: GAMES_LIST.reduce((acc, g) => {
          acc[g.id] = { plays: 0, highScore: 0 };
          return acc;
        }, {} as Record<string, GameStats>),
        achievements: INITIAL_ACHIEVEMENTS_300,
        quests: INITIAL_QUESTS_V3,
        arcadePass: { level: 2, xp: 350, isPremium: false, claimedFreeRewards: [], claimedPremiumRewards: [] },
        settings: {
          language: 'en', // English by default
          sfxEnabled: true,
          musicEnabled: true,
          sfxVolume: 70,
          musicVolume: 40,
          currentTrack: 'halloween',
          graphicsQuality: 'ultra',
          particleDensity: 'extreme',
          glowEffects: true,
          scanlines: false,
          hapticVibration: true,
          showFps: false,
          controllerLayout: 'xbox',
          colorTheme: 'halloween'
        },
        rankPoints: 240,
        totalTrophies: 120,
        claimedTrophyRoadRewards: [50],
        rngInventory: { matrice_cyber_apex: 2, boogie_bomb: 1 },
        rngTotalRolls: 5,
        activeTradeRequests: INITIAL_TRADE_REQUESTS,
        completedTradesCount: 0,
        storyMode: INITIAL_STORY_MODE,
        favorites: ['cyber_runner_2099', 'cosmic_defender'],
        recentGames: []
      };
    }

    if (parsed.profile) {
      if (parsed.profile.title && (/roblox/i.test(parsed.profile.title) || /3\.[0-9]/i.test(parsed.profile.title))) {
        parsed.profile.title = 'VÉTÉRAN VERTEX';
      }
      if (Array.isArray(parsed.profile.unlockedTitles)) {
        parsed.profile.unlockedTitles = parsed.profile.unlockedTitles.map((t: string) =>
          (/roblox/i.test(t) || /3\.[0-9]/i.test(t)) ? 'VÉTÉRAN VERTEX' : t
        );
        if (!parsed.profile.unlockedTitles.includes('VÉTÉRAN VERTEX')) {
          parsed.profile.unlockedTitles.push('VÉTÉRAN VERTEX');
        }
      }
      if (parsed.profile.bio && /roblox/i.test(parsed.profile.bio)) {
        parsed.profile.bio = parsed.profile.bio.replace(/roblox/gi, 'Vertex');
      }
      if (Array.isArray(parsed.profile.selectedTags)) {
        parsed.profile.selectedTags = parsed.profile.selectedTags.map((t: string) =>
          /obby/i.test(t) ? 'Speedrunner' : t
        );
      }
    }

    // Always ensure all 6 Story Mode chapters are present and synchronized
    if (!parsed.storyMode || !parsed.storyMode.chapters || parsed.storyMode.chapters.length < 6) {
      const existingChaptersMap = new Map<number, any>((parsed.storyMode?.chapters || []).map((c: any) => [c.id, c]));
      const fullChapters = INITIAL_STORY_MODE.chapters.map(chap => {
        const exist = existingChaptersMap.get(chap.id) as Record<string, any> | undefined;
        if (exist && typeof exist === 'object') {
          return { ...chap, isCompleted: !!exist.isCompleted, stars: exist.stars || 0, isUnlocked: exist.isUnlocked ?? chap.isUnlocked };
        }
        return chap;
      });
      parsed.storyMode = {
        currentChapterId: parsed.storyMode?.currentChapterId || 1,
        totalStars: parsed.storyMode?.totalStars || 0,
        chapters: fullChapters
      };
    } else {
      // Ensure Chapter 6 data is correctly merged
      const existingChaptersMap = new Map<number, any>(parsed.storyMode.chapters.map((c: any) => [c.id, c]));
      parsed.storyMode.chapters = INITIAL_STORY_MODE.chapters.map(chap => {
        const exist = existingChaptersMap.get(chap.id) as Record<string, any> | undefined;
        if (exist && typeof exist === 'object') {
          return { ...chap, isCompleted: !!exist.isCompleted, stars: exist.stars || 0, isUnlocked: exist.isUnlocked ?? chap.isUnlocked };
        }
        return chap;
      });
    }

    // Always guarantee exactly 300 achievements from INITIAL_ACHIEVEMENTS_300 with latest titles & translations
    const existingAchMap = new Map(parsed.achievements?.map((a: any) => [a.id, a.isUnlocked]) || []);
    parsed.achievements = INITIAL_ACHIEVEMENTS_300.map(ach => ({
      ...ach,
      isUnlocked: existingAchMap.has(ach.id) ? !!existingAchMap.get(ach.id) : ach.isUnlocked
    }));

    if (!parsed.settings) {
      parsed.settings = {} as any;
    }
    if (!parsed.settings.language) {
      parsed.settings.language = 'en'; // English is default
    }
    if (!parsed.settings.colorTheme || parsed.settings.colorTheme === 'cyber') {
      parsed.settings.colorTheme = 'halloween';
      parsed.settings.monochromeMode = false;
    }
    if (!parsed.settings.currentTrack || parsed.settings.currentTrack === 'chill') {
      parsed.settings.currentTrack = 'halloween';
    }
    // Ensure all 5 games have stats
    for (const g of GAMES_LIST) {
      if (!parsed.stats[g.id]) {
        parsed.stats[g.id] = { plays: 0, highScore: 0 };
      }
    }

    return parsed;
  });

  // Active Destination: Starts on 'hub' (Portail Vertex) on every launch!
  const [currentDestination, setCurrentDestination] = useState<'hub' | 'games'>('hub');
  const [showVibeModal, setShowVibeModal] = useState(false);
  const [showVwebModal, setShowVwebModal] = useState(false);

  // Active game & category filters
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // UI state for Roblox-like game card click & filters/search buttons
  const [selectedGameForDetail, setSelectedGameForDetail] = useState<GameData | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // iOS Drawer Navigation Menu
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modals state
  const [showRngModal, setShowRngModal] = useState(false);
  const [showTrophyModal, setShowTrophyModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showQuestsModal, setShowQuestsModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);

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
      if (activeGameId) {
        audio.playClick();
        setActiveGameId(null);
        return;
      }
      if (selectedGameForDetail) {
        audio.playClick();
        setSelectedGameForDetail(null);
        return;
      }
      setIsDrawerOpen(false);
      setShowRngModal(false);
      setShowTrophyModal(false);
      setShowProfileModal(false);
      setShowQuestsModal(false);
      setShowStoryModal(false);
      setShowAchievementsModal(false);
      setShowSettingsModal(false);
      setShowPassModal(false);
      setShowFriendsModal(false);
      setShowVibeModal(false);
      setShowVwebModal(false);
      setPaidGamePrompt(null);
    } else if (action === 'A') {
      if (selectedGameForDetail) {
        handleTryLaunchGame(selectedGameForDetail.id);
      }
    } else if (action === 'Y') {
      audio.playClick();
      setShowProfileModal(true);
    } else if (action === 'START') {
      audio.playClick();
      setIsDrawerOpen(prev => !prev);
    }
  });

  // Global Escape Key Listener for Multiplatform Keyboard / Desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeGameId) {
          audio.playClick();
          setActiveGameId(null);
        } else if (selectedGameForDetail) {
          audio.playClick();
          setSelectedGameForDetail(null);
        } else if (isDrawerOpen) {
          setIsDrawerOpen(false);
        } else if (paidGamePrompt) {
          setPaidGamePrompt(null);
        } else {
          setShowRngModal(false);
          setShowTrophyModal(false);
          setShowProfileModal(false);
          setShowQuestsModal(false);
          setShowStoryModal(false);
          setShowAchievementsModal(false);
          setShowSettingsModal(false);
          setShowPassModal(false);
          setShowFriendsModal(false);
          setShowVibeModal(false);
          setShowVwebModal(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGameId, selectedGameForDetail, isDrawerOpen, paidGamePrompt]);

  // Save state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vertex_arcades_v3_state', JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to persist state", e);
    }
  }, [state]);

  const currentVCoins = state.profile.totalVCoins ?? 0;

  // Toggle favorite with animated Heart pop & like sound effect
  const handleToggleFavorite = (gameId: string) => {
    audio.playLike();
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
        if (q.id === 'q_daily_2' && gameId === 'cyber_runner_2099') added = score;
        if (q.id === 'q_daily_3') added = earnedVC;
        if (q.id === 'q_weekly_1') added = 1;
        if (q.id === 'q_weekly_2' && gameId === 'cosmic_defender') added = score;
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

  const currentTheme = state.settings.colorTheme || (state.settings.monochromeMode ? 'dark' : 'halloween');
  const themeClass = currentTheme === 'dark' ? 'theme-dark' : currentTheme === 'light' ? 'theme-light' : currentTheme === 'cyber' ? 'theme-cyber' : 'theme-halloween';
  const currentLang: Language = state.settings.language || 'en';
  const t = getTranslation(currentLang);

  // Synchronize document theme classes & body background for seamless Halloween/Noir/Blanc/Cyber feel
  useEffect(() => {
    document.documentElement.classList.remove('theme-dark', 'theme-light', 'theme-cyber', 'theme-halloween');
    document.documentElement.classList.add(themeClass);
    document.body.style.backgroundColor = currentTheme === 'light' ? '#eef1f5' : currentTheme === 'dark' ? '#07080b' : currentTheme === 'cyber' ? '#080b14' : '#07030e';
  }, [currentTheme, themeClass]);

  return (
    <div className={`relative min-h-screen ${themeClass} text-slate-100 flex flex-col justify-between overflow-x-hidden font-sans select-none antialiased transition-colors duration-300`}>
      {/* 🎃 GLOBAL HALLOWEEN DECOR OVERLAY (Moons, Ghosts, Bats, Cobwebs, Pumpkins, Spooky Mist) */}
      <HalloweenDecorOverlay onShowToast={(msg) => notify(msg)} />

      {/* 1. iOS Glass Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-slate-900/90 border border-orange-500/50 text-white font-mono text-xs font-bold shadow-[0_8px_32px_rgba(249,115,22,0.4)] flex items-center gap-2.5 backdrop-blur-2xl"
          >
            <span className="text-sm">🎃</span>
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN HUB / PORTAL LANDING (Default on startup) */}
      {currentDestination === 'hub' ? (
        <VertexPortalHub
          profile={state.profile}
          settings={state.settings}
          totalTrophies={state.totalTrophies}
          arcadePassLevel={state.arcadePass.level}
          language={currentLang}
          onEnterGames={() => {
            setCurrentDestination('games');
            if (state.settings.musicEnabled) {
              audio.startBGM(state.settings.currentTrack || 'halloween');
            }
            notify("🎃 Bienvenue dans GAMES • Édition Halloween ! 🎮");
          }}
          onOpenVibePreview={() => setShowVibeModal(true)}
          onOpenVwebPreview={() => setShowVwebModal(true)}
          onOpenProfile={() => setShowProfileModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
          onToggleSound={toggleSound}
          onSelectTheme={(th) => {
            audio.playClick();
            setState(prev => ({ ...prev, settings: { ...prev.settings, colorTheme: th } }));
            notify(`Thème ${th === 'dark' ? 'Noir Obsidienne' : th === 'light' ? 'Blanc Pur' : 'Cyber Néon'} activé`);
          }}
          onSelectLanguage={(lng) => {
            setState(prev => ({ ...prev, settings: { ...prev.settings, language: lng } }));
          }}
        />
      ) : (
        <>
          {/* Top Header - Liquid Glass Hotbar for GAMES */}
          <header className="liquid-glass-header sticky top-0 z-40 w-full px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Specular top reflection glint line */}
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-orange-400/40 to-transparent pointer-events-none" />

        {/* Left: Enhanced Rich Player Profile Capsule */}
        <div
          onClick={() => { audio.playClick(); setShowProfileModal(true); }}
          className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl liquid-glass-pill hover:border-cyan-400/60 transition-all cursor-pointer group shadow-sm active:scale-98"
        >
          <div className="relative">
            <div
              className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center text-lg border border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.3)] bg-gradient-to-br from-cyan-900 to-blue-950"
            >
              {state.profile.customAvatarUrl ? (
                <img src={state.profile.customAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-mono font-black text-white text-base">
                  {(state.profile.username.trim()[0] || 'V').toUpperCase()}
                </span>
              )}
            </div>
            {/* Live Online Status Dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white font-mono group-hover:text-cyan-300 transition-colors">
                {state.profile.username}
              </span>
              {state.profile.socialStatus && (
                <span className="px-1.5 py-0.2 rounded-md text-[9px] font-mono font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/30">
                  {state.profile.socialStatus === 'ready_for_duel' ? '⚔️' :
                   state.profile.socialStatus === 'looking_for_squad' ? '🚀' :
                   state.profile.socialStatus === 'tryhard' ? '🏆' :
                   state.profile.socialStatus === 'chill' ? '☕' :
                   state.profile.socialStatus === 'grinding_achievements' ? '🎯' :
                   state.profile.socialStatus === 'dnd' ? '⛔' : '💤'}
                </span>
              )}
              <span className="hidden md:inline-block px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Niv.{state.arcadePass.level}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
              <span className="text-yellow-400 font-bold flex items-center gap-1">
                <Trophy className="w-3 h-3 fill-current" /> {state.totalTrophies} 🏆
              </span>
            </div>
          </div>
        </div>

        {/* Center-Left: Instant Return to Vertex Portal Button */}
        <button
          onClick={() => {
            audio.playClick();
            setActiveGameId(null);
            setSelectedGameForDetail(null);
            setCurrentDestination('hub');
            if (state.settings.musicEnabled) {
              audio.startBGM(state.settings.currentTrack || 'halloween');
            }
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl liquid-glass-pill hover:border-orange-400 text-orange-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95 group font-mono text-xs font-bold"
          title="Retourner au Portail Principal (Menu des Lieux)"
        >
          <span className="text-sm group-hover:rotate-12 transition-transform">🎃</span>
          <span>Portail Vertex</span>
        </button>

        {/* Center: SLEEK GAMES LOGO WITH HALLOWEEN PUMPKIN */}
        <div
          onClick={() => { audio.playHalloweenSpook(); }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl liquid-glass-pill hover:border-orange-400/70 transition-all cursor-pointer group shadow-sm active:scale-95 border-orange-500/30"
          title="Games • Édition Halloween"
        >
          <span className="text-sm group-hover:scale-125 transition-transform">🎃</span>
          <Gamepad2 className="w-5 h-5 text-orange-400 filter drop-shadow-[0_0_8px_rgba(249,115,22,0.9)] group-hover:scale-110 transition-transform" />
          <span className="font-mono font-black text-xs text-white tracking-wider flex items-center gap-1.5">
            GAMES
            <span className="px-1.5 py-0.5 rounded-md text-[8px] bg-orange-500/25 text-orange-300 border border-orange-400/40 uppercase tracking-widest">
              🎃 SPOOKY
            </span>
            {gamepadState?.connected && (
              <span className="px-1.5 py-0.5 rounded-md text-[8px] bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 uppercase tracking-widest hidden sm:inline">
                🎮 PAD
              </span>
            )}
          </span>
        </div>

        {/* Right: Small & Discreet VC Badge + 3-Bars Menu Button */}
        <div className="flex items-center gap-2">
          {/* Small Golden Liquid Glass VC Badge */}
          <div
            onClick={() => { audio.playClick(); setShowQuestsModal(true); }}
            className="liquid-glass-vc flex items-center gap-1 px-2 py-0.5 rounded-lg text-yellow-300 text-[10px] font-mono font-bold cursor-pointer group shadow-sm active:scale-95 transition-all"
            title={t.vcoinsBalance}
          >
            <Coins className="w-2.5 h-2.5 fill-current text-yellow-400 group-hover:rotate-12 transition-transform" />
            <span>{currentVCoins.toLocaleString()} VC</span>
            <div className="w-3.5 h-3.5 rounded bg-amber-400/30 flex items-center justify-center text-yellow-200 group-hover:bg-amber-400/50 transition-colors">
              <Plus className="w-2 h-2 stroke-[3]" />
            </div>
          </div>

          {/* 3-BARS MENU BUTTON (OPENS DRAWER INTERFACE WITH ALL BUTTONS) */}
          <button
            onClick={() => {
              audio.playClick();
              setIsDrawerOpen(true);
            }}
            className="w-10 h-10 rounded-2xl liquid-glass-pill hover:border-cyan-400 flex items-center justify-center text-slate-200 hover:text-white transition-all cursor-pointer shadow-md active:scale-95 group"
            title={t.openMenu}
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
                        {t.drawerMenuTitle}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-sans">{t.allExperiences}</p>
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
                      className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center text-xl border border-cyan-400/60 shadow-inner bg-gradient-to-br from-cyan-900 to-blue-950"
                    >
                      {state.profile.customAvatarUrl ? (
                        <img src={state.profile.customAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-mono font-black text-white text-base">
                          {(state.profile.username.trim()[0] || 'V').toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white font-mono group-hover:text-cyan-300 transition-colors">
                          {state.profile.username}
                        </span>
                        {state.profile.socialStatus && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/30 font-bold">
                            {state.profile.socialStatus === 'ready_for_duel' ? '⚔️ 1v1' :
                             state.profile.socialStatus === 'looking_for_squad' ? '🚀 Escouade' :
                             state.profile.socialStatus === 'tryhard' ? '🏆 Record' :
                             state.profile.socialStatus === 'chill' ? '☕ Chill' :
                             state.profile.socialStatus === 'grinding_achievements' ? '🎯 Succès' :
                             state.profile.socialStatus === 'dnd' ? '⛔ Occupé' : '💤 Pause'}
                          </span>
                        )}
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/25 text-cyan-300 border border-cyan-400/30 font-bold">
                          VIP {t.level} {state.arcadePass.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-[9px] font-mono text-slate-300 mt-1">
                        <span className="text-yellow-400 font-bold flex items-center gap-1">
                          <Trophy className="w-2.5 h-2.5 fill-current" /> {state.totalTrophies}
                        </span>
                        <span className="text-amber-300 font-bold flex items-center gap-1">
                          <Coins className="w-2.5 h-2.5 fill-current" /> {currentVCoins.toLocaleString()} VC
                        </span>
                      </div>
                      {state.profile.socialCustomStatus && (
                        <div className="text-[10px] text-slate-400 italic font-sans truncate max-w-[200px] mt-0.5">
                          "{state.profile.socialCustomStatus}"
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
                </div>

                {/* Categorized Navigation Sections */}
                <div className="space-y-5">
                  {/* Category 0: LIEUX VERTEX & DESTINATIONS */}
                  <div>
                    <span className="text-[10px] font-mono font-black text-cyan-400/90 tracking-wider uppercase px-1 mb-2 block">
                      🌌 {t.portalDestinations}
                    </span>
                    <div className="space-y-1.5">
                      {/* Return to Portal Main Menu */}
                      <div
                        onClick={() => {
                          audio.playClick();
                          setIsDrawerOpen(false);
                          setActiveGameId(null);
                          setSelectedGameForDetail(null);
                          setCurrentDestination('hub');
                          if (state.settings.musicEnabled) {
                            audio.startBGM('portal');
                          }
                        }}
                        className="p-3 rounded-2xl liquid-glass-card border border-cyan-400/50 hover:border-cyan-400 transition-all cursor-pointer group flex items-center justify-between shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-cyan-500/25 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white font-mono group-hover:text-cyan-300 transition-colors">
                                {t.returnToPortal}
                              </span>
                              <span className="px-1.5 py-0.2 rounded-full text-[8px] font-mono font-black bg-cyan-500/30 text-cyan-200 border border-cyan-400/50">
                                MENU
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              Changer de lieu (Games, Vibe, Vweb)
                            </span>
                          </div>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
                      </div>

                      {/* Vibe Quick Preview */}
                      <div
                        onClick={() => {
                          audio.playClick();
                          setIsDrawerOpen(false);
                          setShowVibeModal(true);
                        }}
                        className="p-2.5 rounded-2xl liquid-glass-pill border border-fuchsia-400/30 hover:border-fuchsia-400 transition-all cursor-pointer group flex items-center justify-between text-xs font-mono"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-fuchsia-500/20 border border-fuchsia-400/30 flex items-center justify-center text-fuchsia-300">
                            <Radio className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-white group-hover:text-fuchsia-300">Vibe</span>
                            <span className="text-[10px] text-slate-400 ml-2">Salons & Radio Lo-Fi</span>
                          </div>
                        </div>
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-fuchsia-500/25 text-fuchsia-300 border border-fuchsia-400/40 font-bold animate-pulse">Soon!</span>
                      </div>

                      {/* Vweb Quick Preview */}
                      <div
                        onClick={() => {
                          audio.playClick();
                          setIsDrawerOpen(false);
                          setShowVwebModal(true);
                        }}
                        className="p-2.5 rounded-2xl liquid-glass-pill border border-blue-400/30 hover:border-blue-400 transition-all cursor-pointer group flex items-center justify-between text-xs font-mono"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                            <Globe className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-white group-hover:text-blue-300">Vweb</span>
                            <span className="text-[10px] text-slate-400 ml-2">Web Métaverse & Apps</span>
                          </div>
                        </div>
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-blue-500/25 text-blue-300 border border-blue-400/40 font-bold animate-pulse">Soon!</span>
                      </div>
                    </div>
                  </div>

                  {/* Category 1: JEUX & EXPÉRIENCES */}
                  <div>
                    <span className="text-[10px] font-mono font-black text-cyan-400/90 tracking-wider uppercase px-1 mb-2 block">
                      {t.navSectionGames}
                    </span>
                    <div className="space-y-1.5">
                      {[
                        {
                          id: 'games',
                          title: t.navGamesTitle,
                          subtitle: t.navGamesSub,
                          badge: t.navGamesBadge,
                          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
                          icon: <Gamepad2 className="w-4 h-4 text-cyan-400" />,
                          iconBg: 'bg-cyan-500/10 border-cyan-400/30',
                          action: () => { setActiveGameId(null); setIsDrawerOpen(false); }
                        },
                        {
                          id: 'rng',
                          title: t.navRngTitle,
                          subtitle: t.navRngSub,
                          badge: t.navRngBadge,
                          badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
                          icon: <Sparkles className="w-4 h-4 text-teal-300" />,
                          iconBg: 'bg-teal-500/10 border-teal-400/30',
                          action: () => { setShowRngModal(true); setIsDrawerOpen(false); }
                        },
                        {
                          id: 'story',
                          title: t.navStoryTitle,
                          subtitle: t.navStorySub,
                          badge: t.navStoryBadge,
                          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
                          icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
                          iconBg: 'bg-cyan-500/10 border-cyan-400/30',
                          action: () => { setShowStoryModal(true); setIsDrawerOpen(false); }
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
                      {t.navSectionProgression}
                    </span>
                    <div className="space-y-1.5">
                      {[
                        {
                          id: 'trophy',
                          title: t.navTrophyTitle,
                          subtitle: t.navTrophySub,
                          badge: `${state.totalTrophies} 🏆`,
                          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
                          icon: <Trophy className="w-4 h-4 text-amber-400" />,
                          iconBg: 'bg-amber-500/10 border-amber-400/30',
                          action: () => { setShowTrophyModal(true); setIsDrawerOpen(false); }
                        },
                        {
                          id: 'pass',
                          title: t.navPassTitle,
                          subtitle: t.navPassSub,
                          badge: `${t.level} ${state.arcadePass.level}`,
                          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
                          icon: <Crown className="w-4 h-4 text-purple-400" />,
                          iconBg: 'bg-purple-500/10 border-purple-400/30',
                          action: () => { setShowPassModal(true); setIsDrawerOpen(false); }
                        },
                        {
                          id: 'quests',
                          title: t.navQuestsTitle,
                          subtitle: t.navQuestsSub,
                          badge: t.navQuestsBadge,
                          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
                          icon: <Target className="w-4 h-4 text-emerald-400" />,
                          iconBg: 'bg-emerald-500/10 border-emerald-400/30',
                          action: () => { setShowQuestsModal(true); setIsDrawerOpen(false); }
                        },
                        {
                          id: 'achievements',
                          title: t.navAchievementsTitle,
                          subtitle: t.navAchievementsSub,
                          badge: t.navAchievementsBadge,
                          badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
                          icon: <Award className="w-4 h-4 text-yellow-400" />,
                          iconBg: 'bg-yellow-500/10 border-yellow-400/30',
                          action: () => { setShowAchievementsModal(true); setIsDrawerOpen(false); }
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
                      {t.navSectionHub}
                    </span>
                    <div className="space-y-1.5">
                      {[
                        {
                          id: 'profile',
                          title: t.navProfileTitle,
                          subtitle: t.navProfileSub,
                          badge: t.navProfileBadge,
                          badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
                          icon: <User className="w-4 h-4 text-sky-400" />,
                          iconBg: 'bg-sky-500/10 border-sky-400/30',
                          action: () => { setShowProfileModal(true); setIsDrawerOpen(false); }
                        },
                        {
                          id: 'friends',
                          title: t.navFriendsTitle || 'Amis',
                          subtitle: t.navFriendsSub || 'Multijoueur, escouades & chat',
                          badge: 'Coming Soon!',
                          badgeColor: 'bg-fuchsia-500/25 text-fuchsia-300 border-fuchsia-400/50 font-black animate-pulse',
                          icon: <Users className="w-4 h-4 text-fuchsia-400" />,
                          iconBg: 'bg-fuchsia-500/10 border-fuchsia-400/30',
                          action: () => { setShowFriendsModal(true); setIsDrawerOpen(false); }
                        },
                        {
                          id: 'settings',
                          title: t.navSettingsTitle,
                          subtitle: t.navSettingsSub,
                          badge: t.navSettingsBadge,
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

              {/* Drawer Footer with Quick Controls & Theme Switcher */}
              <div className="pt-4 border-t border-white/10 mt-6 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleSound}
                      className="p-2 rounded-xl liquid-glass-pill text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                      title={t.toggleSound}
                    >
                      {state.settings.sfxEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                      <span>{state.settings.sfxEnabled ? t.soundOn : t.soundOff}</span>
                    </button>
                  </div>

                  {/* Quick Theme Switcher Pill (Halloween / Cyber / Noir / Blanc) */}
                  <div className="flex items-center p-1 rounded-xl liquid-glass-pill border border-orange-500/30 gap-1 text-[11px] font-mono">
                    <button
                      onClick={() => {
                        audio.playHalloweenSpook();
                        setState(prev => ({ ...prev, settings: { ...prev.settings, colorTheme: 'halloween' } }));
                        notify("🎃 Thème Halloween Orange & Violet activé !");
                      }}
                      className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        currentTheme === 'halloween' ? 'bg-orange-500 text-slate-950 font-black shadow-[0_0_12px_#f97316]' : 'text-orange-300 hover:text-white'
                      }`}
                      title="Thème Spécial Halloween"
                    >
                      <span>🎃</span>
                      <span className="hidden sm:inline">Halloween</span>
                    </button>
                    <button
                      onClick={() => {
                        audio.playClick();
                        setState(prev => ({ ...prev, settings: { ...prev.settings, colorTheme: 'cyber' } }));
                        notify("Thème Cyber activé");
                      }}
                      className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                        currentTheme === 'cyber' ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-400/40' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Thème Cyber Néon"
                    >
                      Cyber
                    </button>
                    <button
                      onClick={() => {
                        audio.playClick();
                        setState(prev => ({ ...prev, settings: { ...prev.settings, colorTheme: 'dark' } }));
                        notify("Thème Noir Obsidienne activé");
                      }}
                      className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        currentTheme === 'dark' ? 'bg-zinc-800 text-white font-bold border border-white/30' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Thème Noir Obsidienne"
                    >
                      <Moon className="w-3 h-3" /> Noir
                    </button>
                    <button
                      onClick={() => {
                        audio.playClick();
                        setState(prev => ({ ...prev, settings: { ...prev.settings, colorTheme: 'light' } }));
                        notify("Thème Blanc Pur activé");
                      }}
                      className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        currentTheme === 'light' ? 'bg-slate-200 text-slate-900 font-bold border border-slate-300' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Thème Blanc Pur"
                    >
                      <Sun className="w-3 h-3" /> Blanc
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Hub Vertex</span>
                  <span>Vertex Arcades</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Main Content Body - Clean Modern Experience Catalog with Halloween Theme */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-5">
        {/* 🎃 Spooky Halloween Event Banner */}
        <div className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-r from-orange-950/70 via-purple-950/60 to-slate-900/80 border-2 border-orange-500/60 shadow-[0_0_30px_rgba(249,115,22,0.35)] backdrop-blur-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-orange-500/20 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(249,115,22,0.6)] animate-bounce" style={{ animationDuration: '2s' }}>
              🎃
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm text-white uppercase tracking-wider">
                  FESTIVAL D'HALLOWEEN 2026
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black bg-orange-500/30 text-orange-300 border border-orange-400/50 animate-pulse">
                  EN COURS 🦇
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans">
                Collectez des bonbons d'Halloween 🍬, défiez les 5 arènes et débloquez des succès spectraux !
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            <button
              onClick={() => {
                audio.playHalloweenSpook();
                notify("🎃 Boo ! +100 Bonbons d'Halloween ajoutés à votre besace ! 🍬");
              }}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-purple-600 hover:from-orange-400 hover:to-purple-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(249,115,22,0.5)] cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <span>🍬 RÉCOLTER BONBONS</span>
            </button>
          </div>
        </div>

        {/* Header Controls Bar: Filter & Search Toggle Buttons */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Button 1: Toggle Filters */}
              <button
                onClick={() => {
                  audio.playClick();
                  setIsFilterOpen(prev => !prev);
                }}
                className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-mono font-bold cursor-pointer transition-all shadow-md active:scale-95 ${
                  isFilterOpen || selectedCategory !== 'all'
                    ? 'liquid-glass-pill-active border-orange-400 text-white'
                    : 'liquid-glass-pill text-slate-300 hover:text-white'
                }`}
                title={t.filters}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
                <span>{t.filters}</span>
                {selectedCategory !== 'all' && (
                  <span className="ml-1 px-2 py-0.2 rounded-full text-[9px] bg-orange-400 text-slate-950 font-black uppercase">
                    {selectedCategory}
                  </span>
                )}
              </button>

              {/* Button 2: Toggle Search Bar */}
              <button
                onClick={() => {
                  audio.playClick();
                  setIsSearchOpen(prev => !prev);
                }}
                className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-mono font-bold cursor-pointer transition-all shadow-md active:scale-95 ${
                  isSearchOpen || searchQuery
                    ? 'liquid-glass-pill-active border-orange-400 text-white'
                    : 'liquid-glass-pill text-slate-300 hover:text-white'
                }`}
                title={t.search}
              >
                <Search className="w-3.5 h-3.5 text-orange-400" />
                <span>{t.search}</span>
                {searchQuery && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-orange-400/25 text-orange-200 border border-orange-400/30 truncate max-w-[80px]">
                    "{searchQuery}"
                  </span>
                )}
              </button>
            </div>

            {/* Total experiences count */}
            <span className="text-xs font-mono text-orange-300/80 hidden sm:inline-block">
              🎃 {filteredGames.length} / {GAMES_LIST.length} {t.gamesCount}
            </span>
          </div>

          {/* Expandable Category Filters Strip */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="relative flex items-center gap-1.5 overflow-x-auto p-2 rounded-2xl liquid-glass-container no-scrollbar shadow-xl border border-white/10 my-1">
                  {[
                    { id: 'all', label: `${t.all} (${GAMES_LIST.length})` },
                    { id: 'favorites', label: `${t.favorites} ❤️` },
                    { id: 'free', label: t.catFree },
                    { id: 'paid', label: t.catVip },
                    { id: 'action', label: t.catAction },
                    { id: 'survival', label: t.catSurvival },
                    { id: 'racer', label: t.catRacer },
                    { id: 'platformer', label: t.catPlatformer },
                    { id: 'tycoon', label: t.catTycoon },
                    { id: 'rhythm', label: t.catRhythm }
                  ].map(cat => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => { audio.playClick(); setSelectedCategory(cat.id); }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap cursor-pointer transition-all ${
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expandable Search Input Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="relative flex items-center rounded-2xl liquid-glass-input overflow-hidden my-1 shadow-lg">
                  <Search className="w-4 h-4 ml-3.5 text-cyan-400 shrink-0 pointer-events-none" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 5. 1:1 Square Format Game Grid (Clean illustrations with short title & favorite heart) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
          {filteredGames.map((game) => {
            const isFavorite = state.favorites.includes(game.id);
            const isUnlocked = !game.isPaid || state.profile.unlockedGames?.includes(game.id);
            const isPopping = favoritedPopId === game.id;

            return (
              <motion.div
                key={game.id}
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={() => {
                  audio.playClick();
                  setSelectedGameForDetail(game);
                }}
                className="aspect-square liquid-glass-card rounded-3xl border border-orange-500/30 hover:border-orange-400 transition-all overflow-hidden group shadow-xl hover:shadow-[0_15px_35px_rgba(249,115,22,0.4)] backdrop-blur-2xl relative cursor-pointer active:scale-95 flex flex-col justify-end"
              >
                {/* 1:1 Full Cover Illustration */}
                <div className="absolute inset-0 z-0">
                  <GameCardIllustration gameId={game.id} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" />
                </div>

                {/* Top Subtle Sheen */}
                <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-orange-400/60 to-transparent pointer-events-none z-10" />

                {/* 🕸️ Spooky Corner Spiderweb on every Game Card */}
                <div className="absolute top-0 right-0 w-14 h-14 pointer-events-none z-10 opacity-70 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 50 50" className="w-full h-full text-orange-400/80 fill-none stroke-current stroke-[1.2]">
                    <path d="M50,0 Q25,0 0,0 M50,0 Q50,25 50,50 M50,0 L0,50 M50,0 L18,50 M50,0 L50,18" />
                    <path d="M40,0 Q35,15 50,20 M30,0 Q22,28 50,35 M20,0 Q12,38 50,45" />
                  </svg>
                </div>

                {/* Top Left: Floating Status Badge & Mini Pumpkin */}
                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1">
                  {game.isPaid ? (
                    isUnlocked ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black tracking-wider bg-emerald-500/35 text-emerald-300 border border-emerald-400/50 backdrop-blur-md shadow-md flex items-center gap-1">
                        <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" /> {t.owned}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black tracking-wider bg-amber-500/35 text-amber-300 border border-amber-400/50 backdrop-blur-md shadow-md flex items-center gap-1">
                        <Coins className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /> {game.costVCoins} VC
                      </span>
                    )
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black tracking-wider bg-orange-500/35 text-orange-200 border border-orange-400/50 backdrop-blur-md shadow-md flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-orange-300" /> {t.free}
                    </span>
                  )}
                  <span className="text-[10px] animate-pulse">🎃</span>
                </div>

                {/* Bottom Bar: Gradient Overlay with ONLY Short Game Name & Favorite Heart on the Right */}
                <div className="relative z-10 p-2.5 pt-8 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent flex items-center justify-between gap-1.5">
                  <span className="font-black text-white text-xs sm:text-sm font-mono tracking-tight truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center gap-1">
                    <span>{game.name}</span>
                  </span>

                  {/* Favorite Like Button nicely positioned to the right of the title */}
                  <motion.button
                    animate={isPopping ? { scale: [1, 1.45, 0.9, 1] } : { scale: 1 }}
                    transition={{ duration: 0.35 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(game.id);
                    }}
                    className={`p-1.5 rounded-xl backdrop-blur-xl border transition-all cursor-pointer shadow-md shrink-0 ${
                      isFavorite
                        ? 'bg-rose-500/40 border-rose-400/70 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                        : 'bg-black/50 hover:bg-slate-900 border-white/20 text-slate-300 hover:text-white'
                    }`}
                    title={isFavorite ? t.favorite : t.favorites}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* 6. Game Detail Modal (Roblox-like Game Page with 16:9 Banner & Stats) */}
      <GameDetailModal
        isOpen={!!selectedGameForDetail}
        onClose={() => setSelectedGameForDetail(null)}
        game={selectedGameForDetail}
        stats={selectedGameForDetail ? (state.stats[selectedGameForDetail.id] || { plays: 0, highScore: 0 }) : { plays: 0, highScore: 0 }}
        isUnlocked={selectedGameForDetail ? (!selectedGameForDetail.isPaid || !!state.profile.unlockedGames?.includes(selectedGameForDetail.id)) : false}
        isFavorite={selectedGameForDetail ? state.favorites.includes(selectedGameForDetail.id) : false}
        userVCoins={currentVCoins}
        playButtonColor={state.settings.playButtonColor}
        language={state.settings.language || 'en'}
        onToggleFavorite={handleToggleFavorite}
        onPlayGame={(gameId) => handleTryLaunchGame(gameId)}
        onUnlockGame={(game) => handleUnlockPaidGame(game.id)}
      />

      {/* 6. Active Game Overlay Cabinet - Multiplatform Console / PC / Mobile / Tablet Shell */}
      {activeGameId && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/98 backdrop-blur-3xl overflow-hidden select-none">
          {/* Universal Multiplatform Header Bar */}
          <header className="h-14 shrink-0 px-3 sm:px-6 flex items-center justify-between border-b border-white/10 bg-slate-900/80 backdrop-blur-xl z-20">
            {/* Left: Instant Back / Exit Button */}
            <button
              onClick={() => {
                audio.playClick();
                setActiveGameId(null);
              }}
              className="px-3.5 py-1.5 rounded-xl liquid-glass-pill hover:border-cyan-400 text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
              title="Retour au catalogue (Échap / Manette B)"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>

            {/* Center: Clean Game Name & Multiplatform Indicator */}
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-white text-sm sm:text-base tracking-wider uppercase">
                {GAMES_LIST.find(g => g.id === activeGameId)?.name || 'Jeu'}
              </span>
              <div className="hidden sm:flex items-center gap-1.5">
                {gamepadState?.connected ? (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                    🎮 Manette Détectée
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    📱 Tactile / ⌨️ Clavier
                  </span>
                )}
              </div>
            </div>

            {/* Right: Sound Toggle & VC Counter */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={toggleSound}
                className="p-2 rounded-xl liquid-glass-pill text-xs text-slate-300 hover:text-white cursor-pointer"
                title={t.toggleSound}
              >
                {state.settings.sfxEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </button>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-yellow-300 text-xs font-mono font-bold">
                <Coins className="w-3.5 h-3.5 fill-current text-yellow-400" />
                <span>{currentVCoins.toLocaleString()} VC</span>
              </div>
            </div>
          </header>

          {/* Main Game Frame - Responsive full-height canvas */}
          <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col items-center justify-center p-1 sm:p-4 overflow-y-auto no-scrollbar">
            {activeGameId === "cyber_runner_2099" && (
              <CyberRunner2099
                onScoreSubmit={(sc) => handleFinishGame("cyber_runner_2099", sc, 1)}
                onVCoinsEarned={(vc) => {
                  setState(prev => ({
                    ...prev,
                    profile: { ...prev.profile, totalVCoins: prev.profile.totalVCoins + vc }
                  }));
                }}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === "cosmic_defender" && (
              <CosmicDefender
                onScoreSubmit={(sc) => handleFinishGame("cosmic_defender", sc, 1)}
                onVCoinsEarned={(vc) => {
                  setState(prev => ({
                    ...prev,
                    profile: { ...prev.profile, totalVCoins: prev.profile.totalVCoins + vc }
                  }));
                }}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === "pixel_dungeon_quest" && (
              <PixelDungeonQuest
                onScoreSubmit={(sc) => handleFinishGame("pixel_dungeon_quest", sc, 1)}
                onVCoinsEarned={(vc) => {
                  setState(prev => ({
                    ...prev,
                    profile: { ...prev.profile, totalVCoins: prev.profile.totalVCoins + vc }
                  }));
                }}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === "titan_pinball_titan" && (
              <TitanPinballTitan
                onScoreSubmit={(sc) => handleFinishGame("titan_pinball_titan", sc, 1)}
                onVCoinsEarned={(vc) => {
                  setState(prev => ({
                    ...prev,
                    profile: { ...prev.profile, totalVCoins: prev.profile.totalVCoins + vc }
                  }));
                }}
                onExit={() => setActiveGameId(null)}
              />
            )}
            {activeGameId === "quantum_strike" && (
              <QuantumStrike
                onScoreSubmit={(sc) => handleFinishGame("quantum_strike", sc, 1)}
                onVCoinsEarned={(vc) => {
                  setState(prev => ({
                    ...prev,
                    profile: { ...prev.profile, totalVCoins: prev.profile.totalVCoins + vc }
                  }));
                }}
                onExit={() => setActiveGameId(null)}
              />
            )}
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
      </>
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
        language={currentLang}
      />

      <ApexTrophyRoadModal
        isOpen={showTrophyModal}
        onClose={() => setShowTrophyModal(false)}
        totalTrophies={state.totalTrophies}
        claimedMilestones={state.claimedTrophyRoadRewards}
        language={currentLang}
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

      <ProfileCreatorModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={state.profile}
        language={currentLang}
        onSaveProfile={(updated) => {
          setState(prev => ({ ...prev, profile: updated }));
          notify(`Profil de ${updated.username} mis à jour avec succès !`);
        }}
        totalTrophies={state.totalTrophies}
        rankPoints={state.rankPoints}
        onShowToast={(msg) => notify(msg)}
      />

      <QuestsV3Modal
        isOpen={showQuestsModal}
        onClose={() => setShowQuestsModal(false)}
        quests={state.quests}
        language={currentLang}
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

      {showStoryModal && state.storyMode && (
        <StoryModeModal
          storyState={state.storyMode}
          language={currentLang}
          onUpdateStory={(updated) => {
            setState(prev => ({ ...prev, storyMode: updated }));
          }}
          onEarnVCoins={(coins) => {
            setState(prev => ({
              ...prev,
              profile: { ...prev.profile, totalVCoins: prev.profile.totalVCoins + coins }
            }));
            notify(`Victoire de Chapitre : +${coins} V-Coins !`);
          }}
          onEarnTrophies={(tr) => {
            setState(prev => ({
              ...prev,
              totalTrophies: prev.totalTrophies + tr
            }));
            notify(`+${tr} Trophées remportés !`);
          }}
          onClose={() => setShowStoryModal(false)}
        />
      )}

      <AchievementsV3Modal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        achievements={state.achievements}
        language={currentLang}
      />

      <SettingsV3Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={state.settings}
        onUpdateSettings={(newSet) => setState(prev => ({ ...prev, settings: newSet }))}
        gamepadConnected={gamepadState.connected}
        gamepadName={gamepadState.id}
        context={currentDestination === 'hub' ? 'portal' : 'games'}
        onResetData={() => {
          localStorage.removeItem('vertex_arcades_v3_state');
          window.location.reload();
        }}
      />

      <ArcadePassV3Modal
        isOpen={showPassModal}
        onClose={() => setShowPassModal(false)}
        passState={state.arcadePass}
        language={currentLang}
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

      {/* 8. Friends Coming Soon Modal */}
      <FriendsComingSoonModal
        isOpen={showFriendsModal}
        onClose={() => setShowFriendsModal(false)}
        username={state.profile.username}
        onShowToast={(msg) => notify(msg)}
        language={currentLang}
      />

      {/* 9. Vibe Destination Preview Modal */}
      <VibePreviewModal
        isOpen={showVibeModal}
        onClose={() => setShowVibeModal(false)}
        onShowToast={(msg) => notify(msg)}
        language={currentLang}
      />

      {/* 10. Vweb Destination Preview Modal */}
      <VwebPreviewModal
        isOpen={showVwebModal}
        onClose={() => setShowVwebModal(false)}
        onShowToast={(msg) => notify(msg)}
        language={currentLang}
      />
    </div>
  );
}
