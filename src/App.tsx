import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Brain, Target, Play, Grid, Layers, Shield, Cpu, Sword, PlusCircle, Grid3X3, Sparkles, Award, Trophy, User, ShoppingBag, Settings, Volume2, VolumeX, Medal, Flame, PlayCircle, Eye, Info, Check, Lock, Key, Navigation, RefreshCw, Calendar, Crown, Music, Compass, Disc, Star, Clock, Heart, Search, Filter, RotateCcw
} from 'lucide-react';

import { audio } from './utils/audio';
import { GlobalState, GameStats, Achievement, Quest, ArcadePass, Tournament, CosmeticRarity, AppSettings, RankedGameScores } from './types';
import {
  GAMES_LIST,
  CABINET_SKINS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_QUESTS,
  QUEST_POOL,
  PASS_LEVELS,
  PRO_PASS_LEVELS,
  AURA_COSMETICS,
  TITLE_BANNERS,
  SHOP_TITLES,
  AVATAR_ICONS_SHOP,
  AVATAR_COLORS_SHOP,
  FRAME_BORDERS_SHOP,
  VICTORY_FX_SHOP,
  COMPETITIVE_RANKS
} from './gamesData';

import { ArcadeBackgroundCanvas } from './components/ArcadeBackgroundCanvas';
import { AchievementToast } from './components/AchievementToast';
import { WheelOfFortuneModal } from './components/WheelOfFortuneModal';
import { LootBoxesModal } from './components/LootBoxesModal';
import { ArcadePassModal } from './components/ArcadePassModal';
import { QuestsAndFlashModal } from './components/QuestsAndFlashModal';
import { SettingsModal } from './components/SettingsModal';
import { RankedSeasonModal } from './components/RankedSeasonModal';
import { ShopBoutiqueModal } from './components/ShopBoutiqueModal';
import { PrestigeModal } from './components/PrestigeModal';
import { AchievementsModal } from './components/AchievementsModal';
import { UserProfileAvatar } from './components/UserProfileAvatar';
import { UserProfileCard } from './components/UserProfileCard';

// Mini games imports
import NeonClicker from './games/NeonClicker';
import SimonMemory from './games/SimonMemory';
import ReflexTap from './games/ReflexTap';
import RetroSnake from './games/RetroSnake';
import BrickBreaker from './games/BrickBreaker';
import Stacker from './games/Stacker';
import ColorCatch from './games/ColorCatch';
import BinaryCipher from './games/BinaryCipher';
import TicTacToe from './games/TicTacToe';
import MathBlitz from './games/MathBlitz';
import GridMemory from './games/GridMemory';
import WhackNode from './games/WhackNode';
import NeonInvaders from './games/NeonInvaders';
import MeteorStorm from './games/MeteorStorm';
import NeonFlappy from './games/NeonFlappy';
import CyberHighway from './games/CyberHighway';
import CyberLock from './games/CyberLock';
import NeonBubble from './games/NeonBubble';
import MemoryPairs from './games/MemoryPairs';
import NeonTarget from './games/NeonTarget';
import NeonPong from './games/NeonPong';
import LaserDodge from './games/LaserDodge';
import NeonRunner from './games/NeonRunner';
import NeonPinball from './games/NeonPinball';
import CyberRhythm from './games/CyberRhythm';
import NeonMaze from './games/NeonMaze';
import GravityOrb from './games/GravityOrb';
import MatrixCodeBreaker from './games/MatrixCodeBreaker';
import TetrisMicro from './games/TetrisMicro';
import FroggerCross from './games/FroggerCross';
import AsteroidBlaster from './games/AsteroidBlaster';
import GalagaShooter from './games/GalagaShooter';
import GeometryJump from './games/GeometryJump';
import QuantumClicker from './games/QuantumClicker';
import Neon2048 from './games/Neon2048';
import CyberDrift from './games/CyberDrift';
import NeonAirHockey from './games/NeonAirHockey';
import CyberDefender from './games/CyberDefender';
import JurassicDinoDash from './games/JurassicDinoDash';
import JurassicPinball from './games/JurassicPinball';
import JurassicDinoHunter from './games/JurassicDinoHunter';

import { CyberCompanionsModal } from './components/CyberCompanionsModal';
import { BossRaidArenaModal } from './components/BossRaidArenaModal';
import { FriendsModal } from './components/FriendsModal';
import { ArcadeChatModal } from './components/ArcadeChatModal';
import { DuelArenaModal } from './components/DuelArenaModal';
import { Friend, ChatMessage, DuelChallenge } from './types';

export default function App() {
  const [state, setState] = useState<GlobalState>(() => {
    let parsed: any = null;
    try {
      const saved = localStorage.getItem('vertex_arcades_v2_state');
      if (saved) parsed = JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to parse state", e);
    }

    if (!parsed) {
      parsed = {
        profile: {
          username: 'CYBER_HERO',
          avatarColor: 'cyan',
          avatarIcon: 'Crown',
          totalPixels: 500,
          unlockedSkins: ['neon'],
          activeSkin: 'neon',
          title: 'PILOTE DE NÉON',
          unlockedTitles: ['PILOTE DE NÉON'],
          unlockedColors: ['cyan'],
          unlockedAvatarIcons: ['Crown'],
          activeAura: 'none',
          unlockedAuras: ['none'],
          activeBanner: 'banner_neon',
          unlockedBanners: ['banner_neon'],
          goldenKeys: 2
        },
        stats: GAMES_LIST.reduce((acc, g) => {
          acc[g.id] = { plays: 0, highScore: 0 };
          return acc;
        }, {} as Record<string, GameStats>),
        achievements: INITIAL_ACHIEVEMENTS,
        quests: INITIAL_QUESTS,
        arcadePass: { level: 1, xp: 0, isPremium: false, claimedFreeRewards: [], claimedPremiumRewards: [] },
        proPass: { level: 1, xp: 0, isPro: false, claimedFreeRewards: [], claimedProRewards: [] },
        settings: { sfxEnabled: true, musicEnabled: true, particleDensity: 'normal', crtFilter: false, autoSave: true },
        rankedScores: { sprintReflex: 0, laserBlitz: 0, quantumTarget: 0 },
        rankPoints: 0,
        favorites: [],
        recentGames: []
      };
    }

    return parsed;
  });

  // Modal controls
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [showQuestsModal, setShowQuestsModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showRankedModal, setShowRankedModal] = useState(false);
  const [showPrestigeModal, setShowPrestigeModal] = useState(false);
  const [showWheelModal, setShowWheelModal] = useState(false);
  const [showBoxesModal, setShowBoxesModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showCompanionsModal, setShowCompanionsModal] = useState(false);
  const [showBossRaidModal, setShowBossRaidModal] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showDuelModal, setShowDuelModal] = useState(false);
  const [selectedDuelOpponent, setSelectedDuelOpponent] = useState<Friend | null>(null);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // Social & Duel State with default seeds
  const [friendsList, setFriendsList] = useState<Friend[]>(() => {
    return state.friends || [
      {
        id: 'f_rex',
        username: 'RexHunter_99 🦖',
        avatarColor: '#f59e0b',
        avatarIcon: 'Flame',
        status: 'online',
        currentGame: 'Jurassic Dino Dash',
        rankPoints: 4800,
        rankTier: 'master',
        totalPixels: 34200,
        duelWins: 42,
        duelLosses: 11
      },
      {
        id: 'f_raptor',
        username: 'CyberRaptor 🦕',
        avatarColor: '#06b6d4',
        avatarIcon: 'Zap',
        status: 'in-game',
        currentGame: 'Jurassic Pinball',
        rankPoints: 6100,
        rankTier: 'celestial',
        totalPixels: 51000,
        duelWins: 68,
        duelLosses: 19
      },
      {
        id: 'f_queen',
        username: 'AmberQueen 💎',
        avatarColor: '#ec4899',
        avatarIcon: 'Crown',
        status: 'online',
        currentGame: 'Neon 2048 Fusion',
        rankPoints: 3900,
        rankTier: 'diamond',
        totalPixels: 28900,
        duelWins: 31,
        duelLosses: 14
      }
    ];
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    return state.chatMessages || [
      {
        id: 'msg_1',
        senderId: 'f_rex',
        senderName: 'RexHunter_99 🦖',
        senderColor: '#f59e0b',
        senderIcon: 'Flame',
        senderRank: 'APEX MASTER',
        message: 'Bienvenue sur la mise à jour 2.2 ! Les épreuves jurassiques sont folles ! 🔥',
        timestamp: Date.now() - 300000,
        channel: 'jurassic'
      },
      {
        id: 'msg_2',
        senderId: 'f_raptor',
        senderName: 'CyberRaptor 🦕',
        senderColor: '#06b6d4',
        senderIcon: 'Zap',
        senderRank: 'CELESTIAL',
        message: 'Qui veut un duel 1v1 sur Jurassic Pinball ? Mise de 250 PX prête ! ⚔️',
        timestamp: Date.now() - 120000,
        channel: 'duels'
      },
      {
        id: 'msg_3',
        senderId: 'f_queen',
        senderName: 'AmberQueen 💎',
        senderColor: '#ec4899',
        senderIcon: 'Crown',
        senderRank: 'DIAMANT APEX',
        message: 'GG pour vos scores en Classé Saison 2 ! 👑',
        timestamp: Date.now() - 45000,
        channel: 'general'
      }
    ];
  });

  const [duelHistory, setDuelHistory] = useState<DuelChallenge[]>(() => {
    return state.duelHistory || [
      {
        id: 'duel_seed_1',
        challengerId: 'user',
        challengerName: state.profile.username,
        challengedId: 'f_rex',
        challengedName: 'RexHunter_99 🦖',
        gameId: 'dino_dash',
        gameName: 'Course Dino Jurassique 🦖',
        wagerPx: 200,
        status: 'completed',
        winnerId: 'user',
        timestamp: Date.now() - 86400000
      }
    ];
  });

  // Active Skin theme finding
  const activeSkinData = CABINET_SKINS.find(s => s.id === (state.profile.activeSkin || 'neon')) || CABINET_SKINS[0];

  // Auto-save
  useEffect(() => {
    try {
      localStorage.setItem('vertex_arcades_v2_state', JSON.stringify(state));
    } catch (e) {
      console.warn("Save state error", e);
    }
  }, [state]);

  const toggleFavorite = (gameId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    audio.playClick();
    setState(prev => {
      const favs = prev.favorites || [];
      const exists = favs.includes(gameId);
      return { ...prev, favorites: exists ? favs.filter(id => id !== gameId) : [...favs, gameId] };
    });
  };

  const handleClaimQuest = (questId: string, rewardPx: number, rewardXp: number) => {
    audio.playWin();
    setState(prev => {
      const updatedQuests = (prev.quests || []).map(q =>
        q.id === questId ? { ...q, isClaimed: true } : q
      );
      const currentPass = prev.arcadePass || { level: 1, xp: 0, isPremium: false, claimedFreeRewards: [], claimedPremiumRewards: [] };
      let newXp = currentPass.xp + rewardXp;
      let newLvl = currentPass.level;
      if (newXp >= 200) {
        newLvl += Math.floor(newXp / 200);
        newXp = newXp % 200;
      }

      return {
        ...prev,
        profile: { ...prev.profile, totalPixels: prev.profile.totalPixels + rewardPx },
        quests: updatedQuests,
        arcadePass: { ...currentPass, level: newLvl, xp: newXp }
      };
    });
    setActiveNotification(`🎯 RÉCOMPENSE RÉCLAMÉE : +${rewardPx} PX & +${rewardXp} XP !`);
    setTimeout(() => setActiveNotification(null), 3500);
  };

  const handleResetQuests = () => {
    if (state.profile.totalPixels < 1000) return;
    audio.playWin();
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, totalPixels: prev.profile.totalPixels - 1000 },
      quests: INITIAL_QUESTS.map(q => ({ ...q, current: 0, isCompleted: false, isClaimed: false }))
    }));
    setActiveNotification(`🔄 QUÊTES RÉINITIALISÉES (-1 000 PX) !`);
    setTimeout(() => setActiveNotification(null), 3500);
  };

  const handleFinishGame = (gameId: string, finalScore: number) => {
    audio.playWin();
    setState(prev => {
      const currentStats = prev.stats[gameId] || { plays: 0, highScore: 0 };
      const newHighScore = Math.max(currentStats.highScore, finalScore);
      const mult = 1 + (prev.profile.prestigeLevel || 0) * 0.25;
      const earnedPx = Math.floor(finalScore * mult);

      return {
        ...prev,
        profile: { ...prev.profile, totalPixels: prev.profile.totalPixels + earnedPx },
        stats: {
          ...prev.stats,
          [gameId]: { plays: currentStats.plays + 1, highScore: newHighScore }
        }
      };
    });

    setActiveNotification(`🎮 PARTIE TERMINÉE ! Score: ${finalScore} (+${Math.floor(finalScore * (1 + (state.profile.prestigeLevel || 0) * 0.25))} PX)`);
    setTimeout(() => setActiveNotification(null), 4000);
    setActiveGameId(null);
  };

  const filteredGames = GAMES_LIST.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.frenchName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || g.category === selectedCategory || (selectedCategory === 'fav' && (state.favorites || []).includes(g.id));
    const matchesRarity = selectedRarity === 'all' || g.rarity === selectedRarity;
    return matchesSearch && matchesCategory && matchesRarity;
  });

  return (
    <div className={`min-h-screen text-slate-100 relative font-sans overflow-x-hidden ${activeSkinData.bgGradient}`}>
      {/* Dynamic Theme Animated Background Canvas */}
      <ArcadeBackgroundCanvas themeType={activeSkinData.bgType || 'grid'} />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* --- TOP BAR (COMPLETELY AT THE TOP) --- */}
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xl">
          {/* Top Left: Avatar Profile Icon + VERTEX ARCADES Branding */}
          <div className="flex items-center gap-3">
            <UserProfileAvatar
              avatarIcon={state.profile.avatarIcon || 'Zap'}
              avatarColor={state.profile.avatarColor || '#06b6d4'}
              activeFrame={state.profile.activeFrame || 'none'}
              activeAura={state.profile.activeAura || 'none'}
              size="md"
              onClick={() => { audio.playClick(); setShowShopModal(true); }}
            />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400">
                  VERTEX ARCADES <span className="text-[10px] text-slate-950 bg-cyan-400 px-1.5 py-0.5 rounded font-black not-italic">2.0</span>
                </h1>
              </div>
              <p className="text-[10px] text-slate-400 font-bold tracking-wide">
                {state.profile.username} • <span className="text-purple-300">{state.profile.title || 'PILOTE'}</span>
              </p>
            </div>
          </div>

          {/* Top Right: Redesigned PX Glass Enclosure & Quick Action Navigation Icons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* PX Display Box */}
            <div className="px-3 py-1.5 bg-slate-900/90 border border-yellow-500/40 rounded-xl text-yellow-400 font-black text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              <Sparkles size={16} className="text-yellow-400 animate-pulse" />
              <span>{state.profile.totalPixels} PX</span>
              {(state.profile.prestigeLevel || 0) > 0 && (
                <span className="text-[9px] bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-1.5 py-0.5 rounded">
                  x{(1 + (state.profile.prestigeLevel || 0) * 0.25).toFixed(2)}
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <button
              onClick={() => { audio.playClick(); setShowWheelModal(true); }}
              className="p-2 bg-slate-900/80 hover:bg-slate-800 text-yellow-400 border border-slate-700 hover:border-yellow-400 rounded-xl transition cursor-pointer"
              title="Roue de la Fortune"
            >
              <Disc size={18} />
            </button>

            <button
              onClick={() => { audio.playClick(); setShowBoxesModal(true); }}
              className="p-2 bg-slate-900/80 hover:bg-slate-800 text-cyan-400 border border-slate-700 hover:border-cyan-400 rounded-xl transition cursor-pointer"
              title="Coffres & Clefs"
            >
              <Key size={18} />
            </button>

            <button
              onClick={() => { audio.playClick(); setShowQuestsModal(true); }}
              className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition cursor-pointer"
            >
              <Target size={16} /> Quêtes & Flash
            </button>

            <button
              onClick={() => { audio.playClick(); setShowRankedModal(true); }}
              className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-400 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition cursor-pointer"
            >
              <Trophy size={16} /> Mode Classé
            </button>

            <button
              onClick={() => { audio.playClick(); setShowPassModal(true); }}
              className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.3)]"
            >
              <Award size={16} /> Pass S2 Jurassique
            </button>

            <button
              onClick={() => { audio.playClick(); setShowFriendsModal(true); }}
              className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)]"
            >
              <User size={16} /> Amis ({friendsList.length})
            </button>

            <button
              onClick={() => { audio.playClick(); setShowChatModal(true); }}
              className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(59,130,246,0.3)]"
            >
              <Navigation size={16} /> Tchat Live
            </button>

            <button
              onClick={() => { audio.playClick(); setShowDuelModal(true); }}
              className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(244,63,94,0.3)]"
            >
              <Sword size={16} /> Duels 1v1
            </button>

            <button
              onClick={() => { audio.playClick(); setShowCompanionsModal(true); }}
              className="px-3 py-1.5 bg-fuchsia-500/20 hover:bg-fuchsia-500/30 border border-fuchsia-500/40 text-fuchsia-300 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(217,70,239,0.3)]"
            >
              <Cpu size={16} /> Compagnons V2.1
            </button>

            <button
              onClick={() => { audio.playClick(); setShowBossRaidModal(true); }}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.3)]"
            >
              <Sword size={16} /> Boss Raid
            </button>

            <button
              onClick={() => { audio.playClick(); setShowShopModal(true); }}
              className="p-2 bg-slate-900/80 hover:bg-slate-800 text-purple-400 border border-slate-700 hover:border-purple-400 rounded-xl transition cursor-pointer"
              title="Boutique"
            >
              <ShoppingBag size={18} />
            </button>

            <button
              onClick={() => { audio.playClick(); setShowPrestigeModal(true); }}
              className="p-2 bg-slate-900/80 hover:bg-slate-800 text-amber-400 border border-slate-700 hover:border-amber-400 rounded-xl transition cursor-pointer"
              title="Prestige 2.0"
            >
              <Star size={18} />
            </button>

            <button
              onClick={() => { audio.playClick(); setShowAchievementsModal(true); }}
              className="p-2 bg-slate-900/80 hover:bg-slate-800 text-yellow-400 border border-slate-700 hover:border-yellow-400 rounded-xl transition cursor-pointer"
              title="Succès & Hauts Faits (100)"
            >
              <Trophy size={18} />
            </button>

            <button
              onClick={() => { audio.playClick(); setShowSettingsModal(true); }}
              className="p-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-white rounded-xl transition cursor-pointer"
              title="Paramètres"
            >
              <Settings size={18} />
            </button>
          </div>
        </header>

        {/* Notification Toast */}
        <AnimatePresence>
          {activeNotification && (
            <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="px-4 py-2 bg-slate-900 border-2 border-emerald-500 text-emerald-300 rounded-xl font-extrabold text-xs shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2"
              >
                <Sparkles size={16} /> {activeNotification}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MAIN GAME VIEW OR SELECTION */}
        {activeGameId ? (
          /* ACTIVE GAME PLAYER */
          <main className="flex-1 p-4 flex flex-col max-w-5xl mx-auto w-full">
            <div className="mb-3 flex justify-between items-center">
              <button
                onClick={() => setActiveGameId(null)}
                className="px-4 py-2 bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 font-extrabold text-xs uppercase rounded-xl cursor-pointer transition flex items-center gap-2"
              >
                ← Quitter le jeu
              </button>

              <div className="text-right">
                <span className="text-xs text-slate-400 font-bold block">Thème Actif</span>
                <span className="text-sm font-black text-cyan-400 uppercase">{activeSkinData.name}</span>
              </div>
            </div>

            {/* Render Game Container */}
            <div className="flex-1 bg-slate-950/90 border-2 border-cyan-500/40 rounded-2xl p-4 shadow-[0_0_40px_rgba(6,182,212,0.2)] flex items-center justify-center min-h-[500px]">
              {activeGameId === 'clicker' && <NeonClicker onScore={() => {}} onGameOver={(score) => handleFinishGame('clicker', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['clicker']?.highScore || 0} />}
              {activeGameId === 'reflex' && <ReflexTap onScore={() => {}} onGameOver={(score) => handleFinishGame('reflex', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['reflex']?.highScore || 0} />}
              {activeGameId === 'snake' && <RetroSnake onScore={() => {}} onGameOver={(score) => handleFinishGame('snake', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['snake']?.highScore || 0} />}
              {activeGameId === 'brick' && <BrickBreaker onScore={() => {}} onGameOver={(score) => handleFinishGame('brick', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['brick']?.highScore || 0} />}
              {activeGameId === 'tictactoe' && <TicTacToe onScore={() => {}} onGameOver={(score) => handleFinishGame('tictactoe', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['tictactoe']?.highScore || 0} />}
              {activeGameId === 'math' && <MathBlitz onScore={() => {}} onGameOver={(score) => handleFinishGame('math', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['math']?.highScore || 0} />}
              {activeGameId === 'whack' && <WhackNode onScore={() => {}} onGameOver={(score) => handleFinishGame('whack', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['whack']?.highScore || 0} />}
              {activeGameId === 'bubble' && <NeonBubble onScore={() => {}} onGameOver={(score) => handleFinishGame('bubble', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['bubble']?.highScore || 0} />}
              {activeGameId === 'pairs' && <MemoryPairs onScore={() => {}} onGameOver={(score) => handleFinishGame('pairs', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['pairs']?.highScore || 0} />}
              {activeGameId === 'simon' && <SimonMemory onScore={() => {}} onGameOver={(score) => handleFinishGame('simon', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['simon']?.highScore || 0} />}
              {activeGameId === 'stacker' && <Stacker onScore={() => {}} onGameOver={(score) => handleFinishGame('stacker', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['stacker']?.highScore || 0} />}
              {activeGameId === 'binary' && <BinaryCipher onScore={() => {}} onGameOver={(score) => handleFinishGame('binary', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['binary']?.highScore || 0} />}
              {activeGameId === 'gridmemory' && <GridMemory onScore={() => {}} onGameOver={(score) => handleFinishGame('gridmemory', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['gridmemory']?.highScore || 0} />}
              {activeGameId === 'flappy' && <NeonFlappy onScore={() => {}} onGameOver={(score) => handleFinishGame('flappy', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['flappy']?.highScore || 0} />}
              {activeGameId === 'target' && <NeonTarget onScore={() => {}} onGameOver={(score) => handleFinishGame('target', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['target']?.highScore || 0} />}
              {activeGameId === 'pong' && <NeonPong onScore={() => {}} onGameOver={(score) => handleFinishGame('pong', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['pong']?.highScore || 0} />}
              {activeGameId === 'maze' && <NeonMaze onScore={() => {}} onGameOver={(score) => handleFinishGame('maze', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['maze']?.highScore || 0} />}
              {activeGameId === 'tetris' && <TetrisMicro onScoreUpdate={() => {}} onGameOver={(score) => handleFinishGame('tetris', score)} highScore={state.stats['tetris']?.highScore || 0} />}
              {activeGameId === 'frogger' && <FroggerCross onScoreUpdate={() => {}} onGameOver={(score) => handleFinishGame('frogger', score)} highScore={state.stats['frogger']?.highScore || 0} />}
              {activeGameId === 'quantum_clicker' && <QuantumClicker onScore={() => {}} onGameOver={(score) => handleFinishGame('quantum_clicker', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['quantum_clicker']?.highScore || 0} />}
              {activeGameId === 'catch' && <ColorCatch onScore={() => {}} onGameOver={(score) => handleFinishGame('catch', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['catch']?.highScore || 0} />}
              {activeGameId === 'invaders' && <NeonInvaders onScore={() => {}} onGameOver={(score) => handleFinishGame('invaders', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['invaders']?.highScore || 0} />}
              {activeGameId === 'runner' && <NeonRunner onScore={() => {}} onGameOver={(score) => handleFinishGame('runner', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['runner']?.highScore || 0} />}
              {activeGameId === 'gravity' && <GravityOrb onScore={() => {}} onGameOver={(score) => handleFinishGame('gravity', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['gravity']?.highScore || 0} />}
              {activeGameId === 'asteroid' && <AsteroidBlaster onScoreUpdate={() => {}} onGameOver={(score) => handleFinishGame('asteroid', score)} highScore={state.stats['asteroid']?.highScore || 0} />}
              {activeGameId === 'meteor' && <MeteorStorm onScore={() => {}} onGameOver={(score) => handleFinishGame('meteor', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['meteor']?.highScore || 0} />}
              {activeGameId === 'pinball' && <NeonPinball onScore={() => {}} onGameOver={(score) => handleFinishGame('pinball', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['pinball']?.highScore || 0} />}
              {activeGameId === 'rhythm' && <CyberRhythm onScore={() => {}} onGameOver={(score) => handleFinishGame('rhythm', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['rhythm']?.highScore || 0} />}
              {activeGameId === 'galaga' && <GalagaShooter onScoreUpdate={() => {}} onGameOver={(score) => handleFinishGame('galaga', score)} highScore={state.stats['galaga']?.highScore || 0} />}
              {activeGameId === 'highway' && <CyberHighway onScore={() => {}} onGameOver={(score) => handleFinishGame('highway', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['highway']?.highScore || 0} />}
              {activeGameId === 'lock' && <CyberLock onScore={() => {}} onGameOver={(score) => handleFinishGame('lock', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['lock']?.highScore || 0} />}
              {activeGameId === 'laserdodge' && <LaserDodge onScore={() => {}} onGameOver={(score) => handleFinishGame('laserdodge', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['laserdodge']?.highScore || 0} />}
              {activeGameId === 'codebreaker' && <MatrixCodeBreaker onScore={() => {}} onGameOver={(score) => handleFinishGame('codebreaker', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['codebreaker']?.highScore || 0} />}
              {activeGameId === 'geometry' && <GeometryJump onScoreUpdate={() => {}} onGameOver={(score) => handleFinishGame('geometry', score)} highScore={state.stats['geometry']?.highScore || 0} />}
              {activeGameId === '2048' && <Neon2048 onScore={() => {}} onGameOver={(score) => handleFinishGame('2048', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['2048']?.highScore || 0} />}
              {activeGameId === 'drift' && <CyberDrift onScore={() => {}} onGameOver={(score) => handleFinishGame('drift', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['drift']?.highScore || 0} />}
              {activeGameId === 'airhockey' && <NeonAirHockey onScore={() => {}} onGameOver={(score) => handleFinishGame('airhockey', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['airhockey']?.highScore || 0} />}
              {activeGameId === 'defender' && <CyberDefender onScore={() => {}} onGameOver={(score) => handleFinishGame('defender', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['defender']?.highScore || 0} />}
              {activeGameId === 'dino_dash' && <JurassicDinoDash onScore={() => {}} onGameOver={(score) => handleFinishGame('dino_dash', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['dino_dash']?.highScore || 0} />}
              {activeGameId === 'pinball_jurassic' && <JurassicPinball onScore={() => {}} onGameOver={(score) => handleFinishGame('pinball_jurassic', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['pinball_jurassic']?.highScore || 0} />}
              {activeGameId === 'dino_hunter' && <JurassicDinoHunter onScore={() => {}} onGameOver={(score) => handleFinishGame('dino_hunter', score)} onBack={() => setActiveGameId(null)} highScore={state.stats['dino_hunter']?.highScore || 0} />}
            </div>
          </main>
        ) : (
          /* CATALOG / GRID OF GAMES */
          <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
            {/* User Profile Banner & Cosmetic Card */}
            <UserProfileCard
              profile={state.profile}
              rankPoints={state.rankPoints || 0}
              unlockedAchievementsCount={(state.achievements || []).filter(a => a.isUnlocked).length}
              onUpdateUsername={(newUsername) => setState(prev => ({ ...prev, profile: { ...prev.profile, username: newUsername } }))}
              onOpenShop={() => setShowShopModal(true)}
            />

            {/* Filter and Search Bar */}
            <div className="p-4 bg-slate-950/70 backdrop-blur-md rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'Tout' },
                  { id: 'fav', label: 'Favoris ❤️' },
                  { id: 'clicker', label: 'Clicker' },
                  { id: 'reflex', label: 'Réflexe' },
                  { id: 'arcade', label: 'Arcade' },
                  { id: 'puzzle', label: 'Puzzle' },
                  { id: 'memory', label: 'Mémoire' },
                  { id: 'rhythm', label: 'Rythme' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase cursor-pointer border transition ${
                      selectedCategory === cat.id
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Rarity Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Rareté:</span>
                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer font-bold"
                >
                  <option value="all">Toutes Raretés</option>
                  <option value="commun">Commun</option>
                  <option value="rare">Rare</option>
                  <option value="epique">Épique</option>
                  <option value="legendaire">Légendaire</option>
                  <option value="mythique">Mythique</option>
                  <option value="divin">Divin</option>
                </select>
              </div>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredGames.map((game) => {
                const stats = state.stats[game.id] || { plays: 0, highScore: 0 };
                const isFav = (state.favorites || []).includes(game.id);

                const rarityGlows: Record<CosmeticRarity, string> = {
                  commun: 'border-slate-800 hover:border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]',
                  rare: 'border-cyan-600 hover:border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)]',
                  epique: 'border-purple-600 hover:border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.35)]',
                  legendaire: 'border-amber-500 hover:border-yellow-400 shadow-[0_0_25px_rgba(245,158,11,0.4)]',
                  mythique: 'border-fuchsia-500 hover:border-fuchsia-300 shadow-[0_0_30px_rgba(217,70,239,0.5)] animate-pulse',
                  divin: 'border-rose-400 hover:border-yellow-300 shadow-[0_0_35px_rgba(244,63,94,0.6)] animate-pulse'
                };

                return (
                  <div
                    key={game.id}
                    className={`p-5 rounded-2xl bg-slate-900/80 backdrop-blur-md border flex flex-col justify-between transition group hover:-translate-y-1 ${
                      rarityGlows[game.rarity || 'commun']
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-950 border border-slate-800 text-slate-300">
                          {game.rarity || 'commun'}
                        </span>

                        <button
                          onClick={(e) => toggleFavorite(game.id, e)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                        >
                          <Heart size={18} className={isFav ? 'fill-rose-500 text-rose-500' : ''} />
                        </button>
                      </div>

                      <h3 className="text-lg font-black text-white group-hover:text-cyan-400 transition mb-1">
                        {game.frenchName}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4 font-normal">
                        {game.description}
                      </p>

                      <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs flex justify-between font-bold mb-4">
                        <span className="text-slate-400">Meilleur Score :</span>
                        <span className="text-yellow-400">{stats.highScore} PTS</span>
                      </div>
                    </div>

                    <button
                      onClick={() => { audio.playClick(); setActiveGameId(game.id); }}
                      className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase rounded-xl cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)] transition flex items-center justify-center gap-2"
                    >
                      <Play size={16} /> Jouer
                    </button>
                  </div>
                );
              })}
            </div>
          </main>
        )}
      </div>

      {/* --- MODALS INTEGRATION --- */}
      <QuestsAndFlashModal
        isOpen={showQuestsModal}
        onClose={() => setShowQuestsModal(false)}
        quests={state.quests || INITIAL_QUESTS}
        userPixels={state.profile.totalPixels}
        onClaimQuest={handleClaimQuest}
        onResetQuests={handleResetQuests}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={state.settings || { sfxEnabled: true, musicEnabled: true, particleDensity: 'normal', crtFilter: false, autoSave: true }}
        username={state.profile.username}
        onUpdateUsername={(newUsername) => setState(prev => ({ ...prev, profile: { ...prev.profile, username: newUsername } }))}
        onUpdateSettings={(newSet) => setState(prev => ({ ...prev, settings: { ...prev.settings!, ...newSet } }))}
        onResetData={() => {
          localStorage.removeItem('vertex_arcades_v2_state');
          window.location.reload();
        }}
        onExportData={() => {
          const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'vertex_arcades_backup.json';
          a.click();
        }}
        onImportData={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (evt) => {
                try {
                  const imported = JSON.parse(evt.target?.result as string);
                  setState(imported);
                  setShowSettingsModal(false);
                } catch (err) {
                  alert('Fichier invalide');
                }
              };
              reader.readAsText(file);
            }
          };
          input.click();
        }}
      />

      <RankedSeasonModal
        isOpen={showRankedModal}
        onClose={() => setShowRankedModal(false)}
        rankPoints={state.rankPoints || 0}
        rankedScores={state.rankedScores || { sprintReflex: 0, laserBlitz: 0, quantumTarget: 0 }}
        proPass={state.proPass || { level: 1, xp: 0, isPro: false, claimedFreeRewards: [], claimedProRewards: [] }}
        onPlayRankedGame={(gameType) => {
          setShowRankedModal(false);
          const mappedId = gameType === 'sprintReflex' ? 'reflex' : gameType === 'laserBlitz' ? 'laserdodge' : 'target';
          setActiveGameId(mappedId);
        }}
        onClaimProPassReward={(lvl, isPro) => {
          setState(prev => {
            const currentPro = prev.proPass || { level: 1, xp: 0, isPro: false, claimedFreeRewards: [], claimedProRewards: [] };
            const claimed = isPro ? currentPro.claimedProRewards : currentPro.claimedFreeRewards;
            if (claimed.includes(lvl)) return prev;

            const updated = isPro ? [...currentPro.claimedProRewards, lvl] : [...currentPro.claimedFreeRewards, lvl];
            return {
              ...prev,
              proPass: {
                ...currentPro,
                claimedFreeRewards: isPro ? currentPro.claimedFreeRewards : updated,
                claimedProRewards: isPro ? updated : currentPro.claimedProRewards
              }
            };
          });
        }}
      />

      <ShopBoutiqueModal
        isOpen={showShopModal}
        onClose={() => setShowShopModal(false)}
        profile={state.profile}
        onBuySkin={(skinId, cost) => {
          if (state.profile.totalPixels < cost) return;
          audio.playWin();
          setState(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              totalPixels: prev.profile.totalPixels - cost,
              unlockedSkins: [...(prev.profile.unlockedSkins || []), skinId]
            }
          }));
        }}
        onEquipSkin={(skinId) => {
          audio.playClick();
          setState(prev => ({ ...prev, profile: { ...prev.profile, activeSkin: skinId } }));
        }}
        onBuyAura={(auraId, cost) => {
          if (state.profile.totalPixels < cost) return;
          audio.playWin();
          setState(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              totalPixels: prev.profile.totalPixels - cost,
              unlockedAuras: [...(prev.profile.unlockedAuras || []), auraId]
            }
          }));
        }}
        onEquipAura={(auraId) => {
          audio.playClick();
          setState(prev => ({ ...prev, profile: { ...prev.profile, activeAura: auraId } }));
        }}
        onBuyBanner={(bannerId, cost) => {
          if (state.profile.totalPixels < cost) return;
          audio.playWin();
          setState(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              totalPixels: prev.profile.totalPixels - cost,
              unlockedBanners: [...(prev.profile.unlockedBanners || []), bannerId]
            }
          }));
        }}
        onEquipBanner={(bannerId) => {
          audio.playClick();
          setState(prev => ({ ...prev, profile: { ...prev.profile, activeBanner: bannerId } }));
        }}
        onBuyTitle={(title, cost) => {
          if (state.profile.totalPixels < cost) return;
          audio.playWin();
          setState(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              totalPixels: prev.profile.totalPixels - cost,
              unlockedTitles: [...(prev.profile.unlockedTitles || []), title]
            }
          }));
        }}
        onEquipTitle={(title) => {
          audio.playClick();
          setState(prev => ({ ...prev, profile: { ...prev.profile, title } }));
        }}
        onBuyAvatarIcon={(iconName, cost) => {
          if (state.profile.totalPixels < cost) return;
          audio.playWin();
          setState(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              totalPixels: prev.profile.totalPixels - cost,
              unlockedAvatarIcons: [...(prev.profile.unlockedAvatarIcons || []), iconName]
            }
          }));
        }}
        onEquipAvatarIcon={(iconName) => {
          audio.playClick();
          setState(prev => ({ ...prev, profile: { ...prev.profile, avatarIcon: iconName } }));
        }}
        onBuyAvatarColor={(colorHex, cost) => {
          if (state.profile.totalPixels < cost) return;
          audio.playWin();
          setState(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              totalPixels: prev.profile.totalPixels - cost,
              unlockedColors: [...(prev.profile.unlockedColors || []), colorHex]
            }
          }));
        }}
        onEquipAvatarColor={(colorHex) => {
          audio.playClick();
          setState(prev => ({ ...prev, profile: { ...prev.profile, avatarColor: colorHex } }));
        }}
        onBuyFrame={(frameId, cost) => {
          if (state.profile.totalPixels < cost) return;
          audio.playWin();
          setState(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              totalPixels: prev.profile.totalPixels - cost,
              unlockedFrames: [...(prev.profile.unlockedFrames || []), frameId]
            }
          }));
        }}
        onEquipFrame={(frameId) => {
          audio.playClick();
          setState(prev => ({ ...prev, profile: { ...prev.profile, activeFrame: frameId } }));
        }}
        onBuyFx={(fxId, cost) => {
          if (state.profile.totalPixels < cost) return;
          audio.playWin();
          setState(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              totalPixels: prev.profile.totalPixels - cost,
              unlockedFx: [...(prev.profile.unlockedFx || []), fxId]
            }
          }));
        }}
        onEquipFx={(fxId) => {
          audio.playClick();
          setState(prev => ({ ...prev, profile: { ...prev.profile, activeFx: fxId } }));
        }}
      />

      <PrestigeModal
        isOpen={showPrestigeModal}
        onClose={() => setShowPrestigeModal(false)}
        profile={state.profile}
        onPerformPrestige={() => {
          const currentP = state.profile.prestigeLevel || 0;
          const req = (currentP + 1) * 5000;
          if (state.profile.totalPixels < req) return;
          audio.playWin();
          setState(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              prestigeLevel: currentP + 1,
              totalPixels: prev.profile.totalPixels - req + 1000
            }
          }));
          setShowPrestigeModal(false);
          setActiveNotification(`🌀 PRESTIGE ${currentP + 1} DÉBLOQUÉ ! Multiplicateur permanent actif !`);
          setTimeout(() => setActiveNotification(null), 4500);
        }}
      />

      {/* Wheel of fortune */}
      <WheelOfFortuneModal
        show={showWheelModal}
        onClose={() => setShowWheelModal(false)}
        totalPixels={state.profile.totalPixels}
        onReward={(reward) => {
          if (reward.type === 'px') {
            const amount = typeof reward.val === 'number' ? reward.val : parseInt(reward.val, 10) || 100;
            setState(prev => ({
              ...prev,
              profile: { ...prev.profile, totalPixels: prev.profile.totalPixels + amount }
            }));
            setActiveNotification(`🎰 ROUE : GAGNÉ +${amount} PX !`);
          } else if (reward.type === 'pass') {
            setState(prev => {
              const pass = prev.arcadePass || { level: 1, xp: 0, isPremium: false, claimedFreeRewards: [], claimedPremiumRewards: [] };
              return {
                ...prev,
                arcadePass: { ...pass, level: pass.level + 1 }
              };
            });
            setActiveNotification(`🎰 ROUE : +1 NIVEAU DE PASS ARCADE !`);
          } else if (reward.type === 'title') {
            const titleName = String(reward.val);
            setState(prev => ({
              ...prev,
              profile: {
                ...prev.profile,
                title: titleName,
                unlockedTitles: [...(prev.profile.unlockedTitles || []), titleName]
              }
            }));
            setActiveNotification(`🎰 ROUE : TITRE ÉQUIPÉ : ${titleName} !`);
          }
          setTimeout(() => setActiveNotification(null), 4000);
        }}
      />

      {/* Loot Boxes */}
      <LootBoxesModal
        show={showBoxesModal}
        onClose={() => setShowBoxesModal(false)}
        totalPixels={state.profile.totalPixels}
        onOpenBox={(cost, boxName) => {
          if (state.profile.totalPixels < cost) return;
          const boxTier = { cost, minWin: Math.floor(cost * 0.8), maxWin: Math.floor(cost * 2.5) };
          const win = Math.floor(Math.random() * (boxTier.maxWin - boxTier.minWin + 1)) + boxTier.minWin;
          setState(prev => ({
            ...prev,
            profile: { ...prev.profile, totalPixels: prev.profile.totalPixels - cost + win }
          }));
          setActiveNotification(`📦 ${boxName} OUVERT : +${win} PX RÉCOLTÉS !`);
          setTimeout(() => setActiveNotification(null), 4000);
        }}
      />

      {/* Season 3 Pass */}
      <ArcadePassModal
        show={showPassModal}
        onClose={() => setShowPassModal(false)}
        arcadePass={state.arcadePass || { level: 1, xp: 0, isPremium: false, claimedFreeRewards: [], claimedPremiumRewards: [] }}
        totalPixels={state.profile.totalPixels}
        onUnlockPremium={(cost) => {
          if (state.profile.totalPixels < cost) return;
          setState(prev => ({
            ...prev,
            profile: { ...prev.profile, totalPixels: prev.profile.totalPixels - cost },
            arcadePass: { ...(prev.arcadePass || { level: 1, xp: 0, isPremium: false, claimedFreeRewards: [], claimedPremiumRewards: [] }), isPremium: true }
          }));
          setActiveNotification(`⭐ PASS PREMIUM DÉBLOQUÉ !`);
          setTimeout(() => setActiveNotification(null), 3500);
        }}
        onClaimReward={(lvl, isPrem, reward) => {
          setState(prev => {
            const currentPass = prev.arcadePass || { level: 1, xp: 0, isPremium: false, claimedFreeRewards: [], claimedPremiumRewards: [] };
            const claimed = isPrem ? currentPass.claimedPremiumRewards : currentPass.claimedFreeRewards;
            if (claimed.includes(lvl)) return prev;

            const updated = isPrem ? [...currentPass.claimedPremiumRewards, lvl] : [...currentPass.claimedFreeRewards, lvl];
            let addedPx = 0;
            if (reward && reward.type === 'pixels') addedPx = typeof reward.val === 'number' ? reward.val : 100;

            return {
              ...prev,
              profile: { ...prev.profile, totalPixels: prev.profile.totalPixels + addedPx },
              arcadePass: {
                ...currentPass,
                claimedFreeRewards: isPrem ? currentPass.claimedFreeRewards : updated,
                claimedPremiumRewards: isPrem ? updated : currentPass.claimedPremiumRewards
              }
            };
          });
          setActiveNotification(`🎁 RÉCOMPENSE DU PASS (Niv. ${lvl}) RÉCLAMÉE !`);
          setTimeout(() => setActiveNotification(null), 3500);
        }}
      />

      <AchievementsModal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        achievements={state.achievements || INITIAL_ACHIEVEMENTS}
        userPixels={state.profile.totalPixels}
        onClaimAchievement={(achId, rewardPx) => {
          audio.playWin();
          setState(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              totalPixels: prev.profile.totalPixels + rewardPx
            },
            achievements: (prev.achievements || INITIAL_ACHIEVEMENTS).map(a =>
              a.id === achId ? { ...a, isUnlocked: true } : a
            )
          }));
        }}
      />

      {/* Cyber Companions V2.1 Modal */}
      <CyberCompanionsModal
        show={showCompanionsModal}
        onClose={() => setShowCompanionsModal(false)}
        profile={state.profile}
        equippedCompanionId={state.profile.equippedCompanionId || 'comp_panda'}
        unlockedCompanionIds={state.profile.unlockedCompanionIds || ['comp_panda']}
        companionLevels={state.profile.companionLevels || { comp_panda: 1 }}
        onOpenBossRaid={() => setShowBossRaidModal(true)}
        onUnlockCompanion={(companionId, cost) => {
          if (state.profile.totalPixels < cost) return;
          audio.playWin();
          setState(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              totalPixels: prev.profile.totalPixels - cost,
              unlockedCompanionIds: [...(prev.profile.unlockedCompanionIds || ['comp_panda']), companionId],
              companionLevels: { ...(prev.profile.companionLevels || { comp_panda: 1 }), [companionId]: 1 }
            }
          }));
          setActiveNotification(`🐉 NOUVEAU COMPAGNON DÉBLOQUÉ !`);
          setTimeout(() => setActiveNotification(null), 3000);
        }}
        onEquipCompanion={(companionId) => {
          audio.playClick();
          setState(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              equippedCompanionId: companionId
            }
          }));
          setActiveNotification(`⚡ COMPAGNON ÉQUIPÉ !`);
          setTimeout(() => setActiveNotification(null), 2500);
        }}
        onFeedCompanion={(companionId, foodCost) => {
          if (state.profile.totalPixels < foodCost) return;
          audio.playWin();
          setState(prev => {
            const currentLevels = prev.profile.companionLevels || { comp_panda: 1 };
            const curLvl = currentLevels[companionId] || 1;
            return {
              ...prev,
              profile: {
                ...prev.profile,
                totalPixels: prev.profile.totalPixels - foodCost,
                companionLevels: {
                  ...currentLevels,
                  [companionId]: curLvl + 1
                }
              }
            };
          });
          setActiveNotification(`🍲 COMPAGNON NOURRI & NIVEAU SUPÉRIEUR !`);
          setTimeout(() => setActiveNotification(null), 3000);
        }}
      />

      {/* Boss Raid Arena V2.1 Modal */}
      <BossRaidArenaModal
        show={showBossRaidModal}
        onClose={() => setShowBossRaidModal(false)}
        profile={state.profile}
        equippedCompanionId={state.profile.equippedCompanionId || 'comp_panda'}
        onVictoryReward={(rewardPx) => {
          audio.playWin();
          setState(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              totalPixels: prev.profile.totalPixels + rewardPx
            }
          }));
          setActiveNotification(`⚔️ VICTOIRE BOSS RAID : +${rewardPx} PX RÉCOLTÉS !`);
          setTimeout(() => setActiveNotification(null), 4000);
        }}
      />

      {/* Friends Modal V2.2 */}
      <FriendsModal
        show={showFriendsModal}
        onClose={() => setShowFriendsModal(false)}
        friends={friendsList}
        userPixels={state.profile.totalPixels}
        onAddFriend={(friend) => {
          setFriendsList(prev => [...prev, friend]);
          setActiveNotification(`👥 NOUVEL AMI AJOUTÉ : ${friend.username} !`);
          setTimeout(() => setActiveNotification(null), 3000);
        }}
        onRemoveFriend={(friendId) => {
          setFriendsList(prev => prev.filter(f => f.id !== friendId));
          setActiveNotification(`Ami retiré.`);
          setTimeout(() => setActiveNotification(null), 2000);
        }}
        onChallengeFriend={(friend) => {
          setSelectedDuelOpponent(friend);
          setShowFriendsModal(false);
          setShowDuelModal(true);
        }}
        onOpenChat={(friend) => {
          setShowFriendsModal(false);
          setShowChatModal(true);
        }}
        onSendGift={(friendId, giftPx) => {
          if (state.profile.totalPixels < giftPx) return;
          audio.playWin();
          setState(prev => ({
            ...prev,
            profile: { ...prev.profile, totalPixels: prev.profile.totalPixels - giftPx }
          }));
          setActiveNotification(`🎁 CADEAU DE ${giftPx} PX ENVOYÉ !`);
          setTimeout(() => setActiveNotification(null), 3000);
        }}
      />

      {/* Arcade Chat Live Modal V2.2 */}
      <ArcadeChatModal
        show={showChatModal}
        onClose={() => setShowChatModal(false)}
        profile={state.profile}
        friends={friendsList}
        messages={chatMessages}
        onSendMessage={(msg) => {
          setChatMessages(prev => [...prev, msg]);
        }}
        onChallengeUser={(targetUsername, targetId) => {
          const friendMatch = friendsList.find(f => f.id === targetId) || {
            id: targetId,
            username: targetUsername,
            avatarColor: '#06b6d4',
            avatarIcon: 'Zap',
            status: 'online',
            rankPoints: 3500,
            rankTier: 'diamond',
            totalPixels: 25000,
            duelWins: 10,
            duelLosses: 5
          };
          setSelectedDuelOpponent(friendMatch);
          setShowChatModal(false);
          setShowDuelModal(true);
        }}
      />

      {/* Duel Arena 1v1 Modal V2.2 */}
      <DuelArenaModal
        show={showDuelModal}
        onClose={() => {
          setShowDuelModal(false);
          setSelectedDuelOpponent(null);
        }}
        profile={state.profile}
        friends={friendsList}
        duelHistory={duelHistory}
        initialOpponent={selectedDuelOpponent}
        onStartDuelGame={(gameId, opp, wager) => {
          setShowDuelModal(false);
          setActiveGameId(gameId);
          setActiveNotification(`⚔️ DUEL 1v1 LANCÉ SUR ${gameId.toUpperCase()} ! MISE : ${wager} PX !`);
          setTimeout(() => setActiveNotification(null), 4000);
        }}
        onClaimDuelWin={(wager, oppName, gameTitle) => {
          audio.playWin();
          setState(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              totalPixels: prev.profile.totalPixels + wager,
              duelWins: (prev.profile.duelWins || 0) + 1,
              duelStreak: (prev.profile.duelStreak || 0) + 1
            }
          }));
          setDuelHistory(prev => [
            {
              id: `duel_${Date.now()}`,
              challengerId: 'user',
              challengerName: state.profile.username,
              challengedId: selectedDuelOpponent?.id || 'opp',
              challengedName: oppName,
              gameId: 'duel',
              gameName: gameTitle,
              wagerPx: wager,
              status: 'completed',
              winnerId: 'user',
              timestamp: Date.now()
            },
            ...prev
          ]);
          setActiveNotification(`🏆 VICTOIRE EN DUEL CONTRE ${oppName} (+${wager * 2} PX) !`);
          setTimeout(() => setActiveNotification(null), 4500);
        }}
        onClaimDuelLoss={(wager, oppName, gameTitle) => {
          audio.playLoss();
          setState(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              totalPixels: Math.max(0, prev.profile.totalPixels - wager),
              duelLosses: (prev.profile.duelLosses || 0) + 1,
              duelStreak: 0
            }
          }));
          setDuelHistory(prev => [
            {
              id: `duel_${Date.now()}`,
              challengerId: 'user',
              challengerName: state.profile.username,
              challengedId: selectedDuelOpponent?.id || 'opp',
              challengedName: oppName,
              gameId: 'duel',
              gameName: gameTitle,
              wagerPx: wager,
              status: 'completed',
              winnerId: 'opponent',
              timestamp: Date.now()
            },
            ...prev
          ]);
          setActiveNotification(`💀 DÉFAITE EN DUEL CONTRE ${oppName} (-${wager} PX)...`);
          setTimeout(() => setActiveNotification(null), 4500);
        }}
      />
    </div>
  );
}
