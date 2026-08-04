import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap, Brain, Target, Play, Grid, Layers, Shield, Cpu, Sword, PlusCircle, Grid3X3, Sparkles, Award, Trophy, User, ShoppingBag, Settings, Volume2, VolumeX, Medal, Flame, PlayCircle, Eye, Info, Check, Lock, Key, Navigation, RefreshCw, Calendar, Crown, Music, Compass, Disc
} from 'lucide-react';

import { audio } from './utils/audio';
import { GlobalState, GameStats, Achievement, Quest, ArcadePass, Tournament } from './types';
import {
  GAMES_LIST,
  CABINET_SKINS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_QUESTS,
  QUEST_POOL,
  PASS_LEVELS,
  AURA_COSMETICS,
  TITLE_BANNERS,
  SHOP_TITLES,
  AVATAR_ICONS_SHOP,
  AVATAR_COLORS_SHOP,
  INITIAL_TOURNAMENTS,
  COMPETITIVE_RANKS,
  RANK_QUESTS
} from './gamesData';

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
import ColorSwitch from './games/ColorSwitch';
import GalagaShooter from './games/GalagaShooter';
import GeometryJump from './games/GeometryJump';
import QuantumClicker from './games/QuantumClicker';

const AVATAR_COLORS = AVATAR_COLORS_SHOP;

export default function App() {
  const [state, setState] = useState<GlobalState>(() => {
    let parsed: any = null;
    try {
      const saved = localStorage.getItem('vertex_arcades_state');
      if (saved) {
        parsed = JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load local state from localStorage", e);
    }

    if (!parsed) {
      parsed = {
        profile: {
          username: 'PLAYER_ONE',
          avatarColor: 'cyan',
          avatarIcon: 'Crown',
          totalPixels: 0,
          unlockedSkins: ['neon'],
          activeSkin: 'neon',
          title: 'DÉBUTANT',
          unlockedTitles: ['DÉBUTANT'],
          unlockedColors: ['cyan'],
          unlockedAvatarIcons: ['Crown'],
          activeAura: 'none',
          unlockedAuras: ['none'],
          activeBanner: 'banner_neon',
          unlockedBanners: ['banner_neon']
        },
        stats: GAMES_LIST.reduce((acc, g) => {
          acc[g.id] = { plays: 0, highScore: 0 };
          return acc;
        }, {} as Record<string, GameStats>),
        achievements: INITIAL_ACHIEVEMENTS,
        quests: INITIAL_QUESTS,
        arcadePass: {
          level: 1,
          xp: 0,
          isPremium: false,
          claimedFreeRewards: [],
          claimedPremiumRewards: []
        }
      };
    }

    // Schema updates
    if (!parsed.profile.title) parsed.profile.title = 'DÉBUTANT';
    if (!parsed.profile.unlockedTitles) parsed.profile.unlockedTitles = ['DÉBUTANT'];
    if (!parsed.profile.unlockedColors) parsed.profile.unlockedColors = ['cyan'];
    if (!parsed.profile.unlockedAvatarIcons) parsed.profile.unlockedAvatarIcons = ['Crown', 'Zap'];
    if (!parsed.profile.activeAura) parsed.profile.activeAura = 'none';
    if (!parsed.profile.unlockedAuras) parsed.profile.unlockedAuras = ['none'];
    if (!parsed.profile.activeBanner) parsed.profile.activeBanner = 'banner_neon';
    if (!parsed.profile.unlockedBanners) parsed.profile.unlockedBanners = ['banner_neon'];
    if (!parsed.achievements) parsed.achievements = INITIAL_ACHIEVEMENTS;
    else {
      INITIAL_ACHIEVEMENTS.forEach(initialAch => {
        if (!parsed.achievements.some((a: any) => a.id === initialAch.id)) {
          parsed.achievements.push({ ...initialAch });
        }
      });
    }
    if (!parsed.quests || parsed.quests.length === 0) parsed.quests = INITIAL_QUESTS;
    if (!parsed.stats) parsed.stats = {};
    GAMES_LIST.forEach(g => {
      if (!parsed.stats[g.id]) {
        parsed.stats[g.id] = { plays: 0, highScore: 0 };
      }
    });
    if (!parsed.arcadePass) {
      parsed.arcadePass = { level: 1, xp: 0, isPremium: false, claimedFreeRewards: [], claimedPremiumRewards: [] };
    }

    return parsed;
  });

  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [soundOn, setSoundOn] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [shopTab, setShopTab] = useState<'skins' | 'auras' | 'titles' | 'banners' | 'icons' | 'colors'>('skins');
  const [profileTab, setProfileTab] = useState<'identity' | 'auras' | 'banners' | 'avatar'>('identity');
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showQuestsModal, setShowQuestsModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showTournamentsModal, setShowTournamentsModal] = useState(false);
  const [showRanksModal, setShowRanksModal] = useState(false);
  const [showPrestigeModal, setShowPrestigeModal] = useState(false);
  const [showWheelModal, setShowWheelModal] = useState(false);
  const [showBoxesModal, setShowBoxesModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpinningWheel, setIsSpinningWheel] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  const [boxResult, setBoxResult] = useState<string | null>(null);
  const [rankedModalTab, setRankedModalTab] = useState<'progress' | 'quests' | 'perks'>('progress');
  const [expandedLeaderboardId, setExpandedLeaderboardId] = useState<string | null>(null);

  // Competitive Rank Points (Start at 0, progress via Rank Quests)
  const rankPoints = state.rankPoints || 0;

  const totalGamesPlayedCount = (Object.values(state.stats || {}) as GameStats[]).reduce(
    (acc, curr) => acc + (curr.plays || 0),
    0
  );

  const currentRank = [...COMPETITIVE_RANKS]
    .reverse()
    .find(r => rankPoints >= r.minScore) || COMPETITIVE_RANKS[0];

  const nextRankIndex = COMPETITIVE_RANKS.findIndex(r => r.id === currentRank.id) + 1;
  const nextRank = COMPETITIVE_RANKS[nextRankIndex] || null;

  const currentRankMin = currentRank.minScore;
  const nextRankMin = nextRank ? nextRank.minScore : currentRankMin + 1000;
  const rankProgressScore = Math.max(0, rankPoints - currentRankMin);
  const rankNeededScore = Math.max(1, nextRankMin - currentRankMin);
  const rankProgressPercent = nextRank
    ? Math.min(100, Math.max(0, Math.floor((rankProgressScore / rankNeededScore) * 100)))
    : 100;

  // Helper to get live progress for a rank quest
  const getRankQuestProgress = (quest: typeof RANK_QUESTS[0]) => {
    if (quest.type === 'plays_total') return totalGamesPlayedCount;
    if (quest.type === 'plays_game') return Object.keys(state.stats || {}).length;
    if (quest.type === 'highscore') {
      return quest.gameId ? (state.stats[quest.gameId]?.highScore || 0) : rankPoints;
    }
    if (quest.type === 'shop_buy') {
      return (state.profile.unlockedSkins.length + (state.profile.unlockedBanners?.length || 0) + (state.profile.unlockedAuras?.length || 0) - 1);
    }
    if (quest.type === 'pass_level') return state.arcadePass?.level || 1;
    return 0;
  };

  const unclaimedRankQuestsCount = RANK_QUESTS.filter(q => {
    const isClaimed = (state.claimedRankQuests || []).includes(q.id);
    const prog = getRankQuestProgress(q);
    return prog >= q.target && !isClaimed;
  }).length;

  const hasUnclaimedRankRewards = COMPETITIVE_RANKS.some(
    r => rankPoints >= r.minScore && !(state.claimedRankRewards || []).includes(r.id)
  ) || unclaimedRankQuestsCount > 0;

  const claimRankReward = (rankId: string) => {
    const rank = COMPETITIVE_RANKS.find(r => r.id === rankId);
    if (!rank || rankPoints < rank.minScore) return;
    const alreadyClaimed = (state.claimedRankRewards || []).includes(rankId);
    if (alreadyClaimed) return;

    audio.playWin();
    setState(prev => {
      const newClaimed = [...(prev.claimedRankRewards || []), rankId];
      const newUnlockedTitles = [...(prev.profile.unlockedTitles || ['DÉBUTANT'])];
      if (rank.titleReward && !newUnlockedTitles.includes(rank.titleReward)) {
        newUnlockedTitles.push(rank.titleReward);
      }
      return {
        ...prev,
        profile: {
          ...prev.profile,
          totalPixels: prev.profile.totalPixels + rank.pixelReward,
          unlockedTitles: newUnlockedTitles
        },
        claimedRankRewards: newClaimed
      };
    });

    setActiveNotification(`🎖️ PALIER DE RANG DÉBLOQUÉ : ${rank.frenchName} (+${rank.pixelReward} PX) !`);
    setTimeout(() => setActiveNotification(null), 4500);
  };

  const claimRankQuest = (questId: string) => {
    const quest = RANK_QUESTS.find(q => q.id === questId);
    if (!quest) return;
    const isClaimed = (state.claimedRankQuests || []).includes(questId);
    if (isClaimed) return;

    audio.playWin();
    setState(prev => {
      const newClaimed = [...(prev.claimedRankQuests || []), questId];
      return {
        ...prev,
        rankPoints: (prev.rankPoints || 0) + quest.rewardRankPts,
        profile: {
          ...prev.profile,
          totalPixels: prev.profile.totalPixels + quest.rewardPixels
        },
        claimedRankQuests: newClaimed
      };
    });

    setActiveNotification(`🎯 QUÊTE DE RANG VALIDÉE : +${quest.rewardRankPts} PTS DE RANG & +${quest.rewardPixels} PX !`);
    setTimeout(() => setActiveNotification(null), 4500);
  };

  const [usernameInput, setUsernameInput] = useState(state.profile.username);
  const [selectedTitleInput, setSelectedTitleInput] = useState(state.profile.title || 'DÉBUTANT');
  const [selectedAvatarColorInput, setSelectedAvatarColorInput] = useState(state.profile.avatarColor);
  const [selectedAvatarIconInput, setSelectedAvatarIconInput] = useState(state.profile.avatarIcon || 'Crown');
  const [selectedAuraInput, setSelectedAuraInput] = useState(state.profile.activeAura || 'none');
  const [selectedBannerInput, setSelectedBannerInput] = useState(state.profile.activeBanner || 'banner_neon');
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // Sync profile inputs when profile modal opens
  useEffect(() => {
    if (showProfileModal) {
      setUsernameInput(state.profile.username);
      setSelectedTitleInput(state.profile.title || 'DÉBUTANT');
      setSelectedAvatarColorInput(state.profile.avatarColor || 'cyan');
      setSelectedAvatarIconInput(state.profile.avatarIcon || 'Crown');
      setSelectedAuraInput(state.profile.activeAura || 'none');
      setSelectedBannerInput(state.profile.activeBanner || 'banner_neon');
    }
  }, [showProfileModal, state.profile]);

  // Auto-save state
  useEffect(() => {
    try {
      localStorage.setItem('vertex_arcades_state', JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to persist state", e);
    }
  }, [state]);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    audio.setMuted(!next);
  };

  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className={className} />;
      case 'Brain': return <Brain className={className} />;
      case 'Target': return <Target className={className} />;
      case 'Play': return <Play className={className} />;
      case 'Grid': return <Grid className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Shield': return <Shield className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Sword': return <Sword className={className} />;
      case 'PlusCircle': return <PlusCircle className={className} />;
      case 'Grid3X3': return <Grid3X3 className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Award': return <Award className={className} />;
      case 'Crown': return <Crown className={className} />;
      case 'Gamepad2': return <Play className={className} />;
      case 'Rocket': return <Flame className={className} />;
      case 'Headphones': return <Music className={className} />;
      case 'Crosshair': return <Target className={className} />;
      case 'Terminal': return <Cpu className={className} />;
      case 'Ghost': return <Sparkles className={className} />;
      case 'Skull': return <Shield className={className} />;
      case 'Globe': return <Compass className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  const triggerNotification = (ach: Achievement) => {
    audio.playWin();
    setActiveNotification(`🏆 SUCCÈS DÉVERROUILLÉ : ${ach.frenchTitle} (+${ach.pixelReward} PX) !`);
    setTimeout(() => {
      setActiveNotification(null);
    }, 4500);
  };

  const handlePrestige = () => {
    const pLevel = state.profile.prestigeLevel || 0;
    audio.playWin();
    const newPrestige = pLevel + 1;
    const bonusPX = 5000;
    const prestigeTitle = `PRESTIGE ${newPrestige} 🌀`;

    setState(prev => ({
      ...prev,
      rankPoints: 0,
      profile: {
        ...prev.profile,
        prestigeLevel: newPrestige,
        totalPixels: prev.profile.totalPixels + bonusPX,
        title: prestigeTitle,
        unlockedTitles: [...(prev.profile.unlockedTitles || []), prestigeTitle]
      }
    }));

    setShowPrestigeModal(false);
    setActiveNotification(`🌀 PRESTIGE ${newPrestige} ATTEINT ! Multiplicateur +${newPrestige * 15}% PX & +5 000 PX !`);
    setTimeout(() => setActiveNotification(null), 5000);
  };

  const handleSpinWheel = () => {
    if (isSpinningWheel) return;
    setIsSpinningWheel(true);
    setWheelResult(null);
    audio.playCoin();

    const rewards = [
      { type: 'px', val: 30, label: '30 PX' },
      { type: 'px', val: 75, label: '75 PX' },
      { type: 'px', val: 150, label: '150 PX' },
      { type: 'pass', val: 1, label: '+1 Niv. Pass' },
      { type: 'title', val: 'CHANCEUX 🎰', label: 'Titre: Chanceux' },
      { type: 'px', val: 250, label: '250 PX' },
      { type: 'px', val: 500, label: 'JACKPOT 500 PX 🎉' },
      { type: 'px', val: 50, label: '50 PX' }
    ];

    setTimeout(() => {
      const chosen = rewards[Math.floor(Math.random() * rewards.length)];
      setIsSpinningWheel(false);
      setWheelResult(chosen.label);
      audio.playWin();

      if (chosen.type === 'px') {
        setState(prev => ({
          ...prev,
          profile: { ...prev.profile, totalPixels: prev.profile.totalPixels + (chosen.val as number) }
        }));
      } else if (chosen.type === 'pass') {
        setState(prev => ({
          ...prev,
          arcadePass: prev.arcadePass
            ? { ...prev.arcadePass, level: prev.arcadePass.level + 1 }
            : { level: 2, xp: 0, isPremium: false, claimedFreeRewards: [], claimedPremiumRewards: [] }
        }));
      } else if (chosen.type === 'title') {
        setState(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            unlockedTitles: [...(prev.profile.unlockedTitles || []), chosen.val as string],
            title: chosen.val as string
          }
        }));
      }

      setActiveNotification(`🎰 ROUE DE LA FORTUNE : Vous gagnez ${chosen.label} !`);
      setTimeout(() => setActiveNotification(null), 4000);
    }, 2000);
  };

  const handleOpenBox = (cost: number, boxName: string) => {
    if (state.profile.totalPixels < cost) {
      audio.playHit();
      setActiveNotification(`❌ Pixels insuffisants ! Il vous faut ${cost} PX.`);
      setTimeout(() => setActiveNotification(null), 3000);
      return;
    }

    audio.playCoin();
    const prestigeMult = 1 + (state.profile.prestigeLevel || 0) * 0.15;
    // Nerfed reward multiplier from (1.2 ~ 3.0) down to (0.3 ~ 1.1)
    const baseWin = Math.floor((cost * (0.3 + Math.random() * 0.8)) * prestigeMult);

    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        totalPixels: prev.profile.totalPixels - cost + baseWin
      }
    }));

    audio.playWin();
    setBoxResult(`🎁 ${boxName} : Vous gagnez +${baseWin} PX !`);
    setActiveNotification(`🎁 ${boxName} : +${baseWin} PX gagnés !`);
    setTimeout(() => setActiveNotification(null), 4000);
  };

  const handleScore = (earnedPixels: number) => {
    const prestigeMult = 1 + (state.profile.prestigeLevel || 0) * 0.15;
    const finalEarned = Math.round(earnedPixels * prestigeMult);

    setState(prev => {
      const nextPixels = prev.profile.totalPixels + finalEarned;
      const nextProfile = { ...prev.profile, totalPixels: nextPixels };

      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === 'ach1' && !ach.isUnlocked && nextPixels > 0) {
          triggerNotification(ach);
          return { ...ach, isUnlocked: true };
        }
        return ach;
      });

      const updatedQuests = (prev.quests || INITIAL_QUESTS).map(q => {
        if (q.type === 'pixels_earned' && !q.isCompleted) {
          const nextCurrent = q.current + earnedPixels;
          const isNowCompleted = nextCurrent >= q.target;
          if (isNowCompleted) {
            setTimeout(() => {
              audio.playWin();
              setActiveNotification(`🎯 QUÊTE RÉUSSIE : ${q.title} (+${q.rewardPixels} PX) !`);
              setTimeout(() => setActiveNotification(null), 4500);
            }, 100);
          }
          return { ...q, current: nextCurrent, isCompleted: isNowCompleted };
        }
        return q;
      });

      return {
        ...prev,
        profile: nextProfile,
        achievements: updatedAchievements,
        quests: updatedQuests
      };
    });
  };

  const handleGameOver = (gameId: string, finalScore: number) => {
    audio.playClick();
    setState(prev => {
      const currentStats = prev.stats[gameId] || { plays: 0, highScore: 0 };
      const newHighScore = Math.max(currentStats.highScore, finalScore);
      const newPlays = currentStats.plays + 1;

      const updatedStats = {
        ...prev.stats,
        [gameId]: { plays: newPlays, highScore: newHighScore }
      };

      const totalPlays = (Object.values(updatedStats) as GameStats[]).reduce((acc, curr) => acc + curr.plays, 0);

      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === 'ach18' && !ach.isUnlocked && totalPlays >= 5) {
          triggerNotification(ach);
          return { ...ach, isUnlocked: true };
        }
        if (ach.id === 'ach19' && !ach.isUnlocked && totalPlays >= 15) {
          triggerNotification(ach);
          return { ...ach, isUnlocked: true };
        }
        if (ach.id === 'ach20' && !ach.isUnlocked && totalPlays >= 30) {
          triggerNotification(ach);
          return { ...ach, isUnlocked: true };
        }
        return ach;
      });

      const updatedQuests = (prev.quests || INITIAL_QUESTS).map(q => {
        if (q.type === 'plays_total' && !q.isCompleted) {
          const nextCurrent = q.current + 1;
          const isNowCompleted = nextCurrent >= q.target;
          return { ...q, current: nextCurrent, isCompleted: isNowCompleted };
        }
        if (q.type === 'score_specific' && q.gameId === gameId && !q.isCompleted) {
          const isNowCompleted = finalScore >= q.target;
          return { ...q, current: Math.max(q.current, finalScore), isCompleted: isNowCompleted };
        }
        return q;
      });

      return {
        ...prev,
        stats: updatedStats,
        achievements: updatedAchievements,
        quests: updatedQuests
      };
    });
  };

  const saveProfile = () => {
    audio.playWin();
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        username: usernameInput,
        title: selectedTitleInput,
        avatarColor: selectedAvatarColorInput,
        avatarIcon: selectedAvatarIconInput,
        activeAura: selectedAuraInput,
        activeBanner: selectedBannerInput
      }
    }));
    setShowProfileModal(false);
  };

  const buySkin = (skinId: string, cost: number) => {
    if (state.profile.totalPixels >= cost) {
      audio.playWin();
      setState(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          totalPixels: prev.profile.totalPixels - cost,
          unlockedSkins: [...prev.profile.unlockedSkins, skinId],
          activeSkin: skinId
        }
      }));
    } else {
      audio.playHit();
    }
  };

  const useSkin = (skinId: string) => {
    audio.playClick();
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, activeSkin: skinId }
    }));
  };

  const buyAura = (auraId: string, cost: number) => {
    if (state.profile.totalPixels >= cost) {
      audio.playWin();
      setState(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          totalPixels: prev.profile.totalPixels - cost,
          unlockedAuras: [...(prev.profile.unlockedAuras || ['none']), auraId],
          activeAura: auraId
        }
      }));
    } else {
      audio.playHit();
    }
  };

  const useAura = (auraId: string) => {
    audio.playClick();
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, activeAura: auraId }
    }));
  };

  const buyBanner = (bannerId: string, cost: number) => {
    if (state.profile.totalPixels >= cost) {
      audio.playWin();
      setState(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          totalPixels: prev.profile.totalPixels - cost,
          unlockedBanners: [...(prev.profile.unlockedBanners || ['banner_neon']), bannerId],
          activeBanner: bannerId
        }
      }));
    } else {
      audio.playHit();
    }
  };

  const useBanner = (bannerId: string) => {
    audio.playClick();
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, activeBanner: bannerId }
    }));
  };

  const buyTitle = (titleId: string, cost: number) => {
    if (state.profile.totalPixels >= cost) {
      audio.playWin();
      setState(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          totalPixels: prev.profile.totalPixels - cost,
          unlockedTitles: [...(prev.profile.unlockedTitles || ['DÉBUTANT']), titleId],
          title: titleId
        }
      }));
    } else {
      audio.playHit();
    }
  };

  const equipTitle = (titleId: string) => {
    audio.playClick();
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, title: titleId }
    }));
  };

  const buyAvatarIcon = (iconId: string, cost: number) => {
    if (state.profile.totalPixels >= cost) {
      audio.playWin();
      setState(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          totalPixels: prev.profile.totalPixels - cost,
          unlockedAvatarIcons: [...(prev.profile.unlockedAvatarIcons || ['Crown']), iconId],
          avatarIcon: iconId
        }
      }));
    } else {
      audio.playHit();
    }
  };

  const buyAvatarColor = (colorId: string, cost: number) => {
    if (state.profile.totalPixels >= cost) {
      audio.playWin();
      setState(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          totalPixels: prev.profile.totalPixels - cost,
          unlockedColors: [...(prev.profile.unlockedColors || ['cyan']), colorId],
          avatarColor: colorId
        }
      }));
    } else {
      audio.playHit();
    }
  };

  const handleLaunchGame = (gameId: string) => {
    audio.playCoin();
    setActiveGameId(gameId);
  };

  const renderActiveGame = () => {
    if (!activeGameId) return null;
    const gameHighScore = state.stats[activeGameId]?.highScore || 0;

    const gameProps = {
      onScore: handleScore,
      onScoreUpdate: handleScore,
      onGameOver: (finalScore: number) => handleGameOver(activeGameId, finalScore),
      onBack: () => {
        audio.playClick();
        setActiveGameId(null);
      },
      highScore: gameHighScore,
    };

    switch (activeGameId) {
      case 'clicker': return <NeonClicker {...gameProps} />;
      case 'quantum_clicker': return <QuantumClicker {...gameProps} />;
      case 'simon': return <SimonMemory {...gameProps} />;
      case 'reflex': return <ReflexTap {...gameProps} />;
      case 'snake': return <RetroSnake {...gameProps} />;
      case 'brick': return <BrickBreaker {...gameProps} />;
      case 'stacker': return <Stacker {...gameProps} />;
      case 'catch': return <ColorCatch {...gameProps} />;
      case 'binary': return <BinaryCipher {...gameProps} />;
      case 'tictactoe': return <TicTacToe {...gameProps} />;
      case 'math': return <MathBlitz {...gameProps} />;
      case 'gridmemory': return <GridMemory {...gameProps} />;
      case 'whack': return <WhackNode {...gameProps} />;
      case 'invaders': return <NeonInvaders {...gameProps} />;
      case 'meteor': return <MeteorStorm {...gameProps} />;
      case 'flappy': return <NeonFlappy {...gameProps} />;
      case 'highway': return <CyberHighway {...gameProps} />;
      case 'lock': return <CyberLock {...gameProps} />;
      case 'bubble': return <NeonBubble {...gameProps} />;
      case 'pairs': return <MemoryPairs {...gameProps} />;
      case 'target': return <NeonTarget {...gameProps} />;
      case 'pong': return <NeonPong {...gameProps} />;
      case 'laserdodge': return <LaserDodge {...gameProps} />;
      case 'runner': return <NeonRunner {...gameProps} />;
      case 'pinball': return <NeonPinball {...gameProps} />;
      case 'rhythm': return <CyberRhythm {...gameProps} />;
      case 'maze': return <NeonMaze {...gameProps} />;
      case 'gravity': return <GravityOrb {...gameProps} />;
      case 'codebreaker': return <MatrixCodeBreaker {...gameProps} />;
      case 'tetris': return <TetrisMicro {...gameProps} />;
      case 'frogger': return <FroggerCross {...gameProps} />;
      case 'asteroid': return <AsteroidBlaster {...gameProps} />;
      case 'colorswitch': return <ColorSwitch {...gameProps} />;
      case 'galaga': return <GalagaShooter {...gameProps} />;
      case 'geometry': return <GeometryJump {...gameProps} />;
      default:
        return (
          <div className="text-center py-10 font-mono text-red-400">
            Jeu non trouvé
          </div>
        );
    }
  };

  const activeSkinObj = CABINET_SKINS.find(s => s.id === state.profile.activeSkin) || CABINET_SKINS[0];

  const filteredGames = GAMES_LIST.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      game.frenchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col font-sans select-none relative overflow-x-hidden pb-10 transition-colors duration-500 ${activeSkinObj.bgGradient}`}>
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      {/* Retro CRT Scanline overlay effect */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none z-50"></div>

      {/* Global Toast Notification */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 border-2 border-yellow-400 py-3 px-6 rounded-xl shadow-[0_0_25px_rgba(234,179,8,0.5)] flex items-center gap-3 font-mono"
          >
            <Medal size={20} className="text-yellow-400 animate-bounce" />
            <span className="text-xs text-yellow-300 font-black tracking-wide">
              {activeNotification}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <header className="border-b-2 border-cyan-500/30 bg-slate-950/95 backdrop-blur-xl sticky top-0 z-40 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">
          {/* Top Row: Brand Logo, Sound, User Card & PX Balance */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-3">
              <div className="relative cursor-pointer" onClick={() => { audio.playClick(); setActiveGameId(null); }}>
                <div className="absolute inset-0 bg-cyan-500 rounded-xl blur-md opacity-60 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 border-2 border-cyan-400 p-2.5 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                  <Zap className="text-cyan-400 animate-bounce-slow" size={24} />
                </div>
              </div>
              <div>
                <h1
                  onClick={() => { audio.playClick(); setActiveGameId(null); }}
                  className="text-2xl font-black font-sans tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-rose-400 uppercase drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Vertex Arcades
                </h1>
                <p className="text-[10px] font-mono font-extrabold text-cyan-300/90 uppercase tracking-wider">
                  CENTRE D'ARCADE FUTURISTE NÉON • 34 JEUX MULTI-UNIVERS
                </p>
              </div>
            </div>

            {/* Right Profile & Balance Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Sounds Toggle */}
              <button
                onClick={toggleSound}
                className="p-2 rounded-xl border border-slate-700 bg-slate-900/90 text-slate-300 hover:text-white hover:border-cyan-400 transition-all cursor-pointer shadow-md"
                title={soundOn ? 'Muter le son' : 'Activer le son'}
              >
                {soundOn ? <Volume2 size={16} className="text-cyan-400" /> : <VolumeX size={16} className="text-red-400" />}
              </button>

              {/* User Profile Button */}
              {(() => {
                const userColorHex = AVATAR_COLORS.find(c => c.id === state.profile.avatarColor)?.hex || '#06b6d4';
                const userAuraObj = AURA_COSMETICS.find(a => a.id === state.profile.activeAura) || AURA_COSMETICS[0];
                return (
                  <button
                    onClick={() => { audio.playClick(); setShowProfileModal(true); }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-slate-900/90 hover:border-cyan-400 transition-all cursor-pointer text-xs font-mono shadow-[0_0_12px_rgba(6,182,212,0.15)] group"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center relative shrink-0 transition-all ${userAuraObj.glowClass}`}
                      style={{ backgroundColor: userColorHex }}
                    >
                      {renderIcon(state.profile.avatarIcon || 'Crown', "w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]")}
                    </div>
                    <div className="text-left">
                      <p className="font-sans font-black text-[11px] leading-tight text-white group-hover:text-cyan-300 transition-colors">{state.profile.username}</p>
                      <p className="text-[7px] text-yellow-400 font-bold tracking-wider uppercase mt-0.5">{state.profile.title || 'DÉBUTANT'}</p>
                    </div>
                  </button>
                );
              })()}

              {/* Golden PX Counter */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/90 via-yellow-950/90 to-amber-950/90 border-2 border-yellow-400/90 text-yellow-300 font-mono text-xs font-black shadow-[0_0_20px_rgba(234,179,8,0.4)] relative overflow-hidden">
                <Sparkles size={16} className="text-yellow-400 animate-pulse" />
                <span className="tracking-wider text-sm text-yellow-200">{state.profile.totalPixels.toLocaleString()}</span>
                <span className="text-[10px] text-amber-400 font-sans font-black">PX</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Streamlined Categorized Arcade Action Navbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            {/* GROUP 1: RECOMPENSES & BOUTIQUE */}
            <div className="flex items-center gap-1.5 flex-wrap bg-slate-900/70 p-1 rounded-2xl border border-slate-800">
              <span className="text-[9px] text-slate-500 font-black uppercase px-2">BOUTIQUE & CASINO :</span>
              <button
                onClick={() => { audio.playClick(); setShowShopModal(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/80 bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900/80 hover:border-cyan-400 transition-all cursor-pointer font-black text-[11px] shadow-[0_0_12px_rgba(6,182,212,0.25)]"
              >
                <ShoppingBag size={14} className="text-cyan-400" /> BOUTIQUE
              </button>

              <button
                onClick={() => { audio.playClick(); setShowWheelModal(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-yellow-500/80 bg-yellow-950/60 text-yellow-300 hover:bg-yellow-900/80 hover:border-yellow-400 transition-all cursor-pointer font-black text-[11px] shadow-[0_0_12px_rgba(234,179,8,0.25)]"
              >
                <Disc size={14} className="text-yellow-400 animate-spin-slow" /> ROUE
              </button>

              <button
                onClick={() => { audio.playClick(); setShowBoxesModal(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/80 bg-rose-950/60 text-rose-300 hover:bg-rose-900/80 hover:border-rose-400 transition-all cursor-pointer font-black text-[11px] shadow-[0_0_12px_rgba(244,63,94,0.25)]"
              >
                <Key size={14} className="text-rose-400" /> COFFRES
              </button>

              <button
                onClick={() => { audio.playClick(); setShowPassModal(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-500/80 bg-orange-950/60 text-orange-300 hover:bg-orange-900/80 hover:border-orange-400 transition-all cursor-pointer font-black text-[11px] shadow-[0_0_12px_rgba(249,115,22,0.25)]"
              >
                <Flame size={14} className="text-orange-400 animate-pulse" /> PASS <span className="text-[9px] bg-orange-500/30 px-1 rounded">SAISON 1 (50 NIV.)</span>
              </button>
            </div>

            {/* GROUP 2: COMPETITION & PROGRES */}
            <div className="flex items-center gap-1.5 flex-wrap bg-slate-900/70 p-1 rounded-2xl border border-slate-800">
              <span className="text-[9px] text-slate-500 font-black uppercase px-2">LIGUE & QUÊTES :</span>
              <button
                onClick={() => { audio.playClick(); setShowPrestigeModal(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-500/80 bg-purple-950/60 text-purple-300 hover:bg-purple-900/80 hover:border-purple-400 transition-all cursor-pointer font-black text-[11px] shadow-[0_0_12px_rgba(168,85,247,0.25)]"
              >
                <Sparkles size={14} className="text-purple-400" /> PRESTIGE {state.profile.prestigeLevel || 0}
              </button>

              <button
                onClick={() => { audio.playClick(); setShowRanksModal(true); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${currentRank.badgeColor} ${currentRank.glowColor} hover:scale-105 transition-all cursor-pointer font-black text-[11px] relative`}
              >
                <Trophy size={14} className="animate-pulse" /> CLASSÉ
                {hasUnclaimedRankRewards && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400 shadow-[0_0_8px_#facc15] animate-ping"></span>
                  </span>
                )}
              </button>

              <button
                onClick={() => { audio.playClick(); setShowQuestsModal(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/80 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/80 hover:border-emerald-400 transition-all cursor-pointer font-black text-[11px] shadow-[0_0_12px_rgba(16,185,129,0.25)] relative"
              >
                <Target size={14} className="text-emerald-400" /> QUÊTES
                {state.quests?.some(q => q.isCompleted && !q.isClaimed) && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 relative z-10 flex flex-col items-center">
        {activeGameId ? (() => {
            const activeGameObj = GAMES_LIST.find(g => g.id === activeGameId);
            const activeStats = state.stats[activeGameId] || { plays: 0, highScore: 0 };
            return (
              <div className="w-full max-w-4xl flex flex-col items-center gap-4 py-2 font-mono">
                {/* --- BARRE DE PRÉSENTATION DU JEU NÉON (Marquee Header Bar) --- */}
                <div className="w-full bg-slate-950 border-2 border-cyan-500 rounded-2xl p-4 shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-4">
                  {/* Left: Icon, Name & Tags */}
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-cyan-950 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)] shrink-0">
                      {renderIcon(activeGameObj?.icon || 'Zap', "w-7 h-7")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/50">
                          {activeGameObj?.category}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                          activeGameObj?.rarity === 'mythique' ? 'bg-red-950 text-red-300 border-red-500 animate-pulse' :
                          activeGameObj?.rarity === 'legendaire' ? 'bg-yellow-950 text-yellow-300 border-yellow-500' :
                          activeGameObj?.rarity === 'epique' ? 'bg-purple-950 text-purple-300 border-purple-500' :
                          activeGameObj?.rarity === 'rare' ? 'bg-blue-950 text-blue-300 border-blue-500' :
                          'bg-emerald-950 text-emerald-300 border-emerald-500'
                        }`}>
                          {activeGameObj?.rarity}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black font-sans uppercase text-white tracking-wide">
                        {activeGameObj?.frenchName || activeGameObj?.name}
                      </h2>
                    </div>
                  </div>

                  {/* Middle Bio Box */}
                  <div className="flex-1 bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs text-slate-300 leading-relaxed max-w-md">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1 text-[11px] uppercase tracking-wider">
                      <Info size={14} /> DESCRIPTION & BIO DU JEU :
                    </div>
                    <p className="font-sans font-medium text-slate-200 leading-snug">
                      {activeGameObj?.description}
                    </p>
                  </div>

                  {/* Right: Record Score & Back Button */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-3 bg-slate-900 border border-yellow-500/50 px-3 py-1.5 rounded-xl">
                      <div className="text-right">
                        <p className="text-[9px] text-slate-400 font-black uppercase">MEILLEUR RECORD</p>
                        <p className="text-sm font-black text-yellow-300">{activeStats.highScore.toLocaleString()} PX</p>
                      </div>
                      <Trophy size={18} className="text-yellow-400" />
                    </div>

                    <button
                      onClick={() => { audio.playClick(); setActiveGameId(null); }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-cyan-950 border border-cyan-500 text-cyan-300 hover:text-white font-black text-xs uppercase cursor-pointer transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                    >
                      ⬅️ RETOUR AUX JEUX
                    </button>
                  </div>
                </div>

                {/* Cabinet Screen Container */}
                <div className="w-full max-w-2xl flex flex-col items-center">
                  <div className={`w-full bg-slate-950 p-4 rounded-3xl border-4 ${activeSkinObj.theme} transition-all duration-300`}>
                    <div className="relative rounded-2xl bg-slate-950 p-2 sm:p-4 overflow-hidden border border-slate-900">
                      {renderActiveGame()}
                    </div>
                  </div>
                  <div className="w-full max-w-xl h-4 bg-slate-900 border-x-4 border-b-4 border-slate-800 rounded-b-xl shadow-[0_4px_10px_rgba(0,0,0,0.5)]"></div>
                </div>
              </div>
            );
          })() : (
            <div className="w-full">
            {/* Search Bar & Category Filters */}
            <div className="flex flex-col items-center gap-4 mb-8 max-w-4xl mx-auto">
              {/* Search Bar */}
              <div className="w-full max-w-md relative font-mono">
                <input
                  type="text"
                  placeholder="🔍 Rechercher un jeu (34 jeux disponibles)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border-2 border-cyan-500 focus:border-cyan-400 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex justify-center gap-2 flex-wrap font-mono">
                {['all', 'clicker', 'memory', 'reflex', 'arcade', 'puzzle', 'rhythm'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { audio.playClick(); setSelectedCategory(cat); }}
                    className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase border transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)] scale-105'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {cat === 'all' && `TOUS LES JEUX (${GAMES_LIST.length})`}
                    {cat === 'clicker' && 'CLICKER'}
                    {cat === 'memory' && 'MÉMORISATION'}
                    {cat === 'reflex' && 'RÉFLEXES'}
                    {cat === 'arcade' && 'ARCADE'}
                    {cat === 'puzzle' && 'ÉNIGMES / CODE'}
                    {cat === 'rhythm' && 'CYBER RYTHME'}
                  </button>
                ))}
              </div>
            </div>

            {/* --- REDESIGNED 100% GAME ENCADRÉS CATALOG GRID WITH STRICT RARITY COLORS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredGames.map((game) => {
                const gameStats = state.stats[game.id] || { plays: 0, highScore: 0 };

                // 100% Rarity Encadré Color System:
                // Vert = Commun, Bleu = Rare, Violet = Épique, Jaune = Légendaire, Rouge = Mythique
                const frameStyle =
                  game.rarity === 'mythique'
                    ? `border-2 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.35)] ${activeSkinObj.cardBg} hover:border-red-400 hover:shadow-[0_0_35px_rgba(239,68,68,0.7)]`
                    : game.rarity === 'legendaire'
                    ? `border-2 border-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.35)] ${activeSkinObj.cardBg} hover:border-yellow-400 hover:shadow-[0_0_35px_rgba(234,179,8,0.7)]`
                    : game.rarity === 'epique'
                    ? `border-2 border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.35)] ${activeSkinObj.cardBg} hover:border-purple-400 hover:shadow-[0_0_35px_rgba(168,85,247,0.7)]`
                    : game.rarity === 'rare'
                    ? `border-2 border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.35)] ${activeSkinObj.cardBg} hover:border-blue-400 hover:shadow-[0_0_35px_rgba(59,130,246,0.7)]`
                    : `border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)] ${activeSkinObj.cardBg} hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]`;

                return (
                  <motion.div
                    key={game.id}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className={`rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden backdrop-blur-xl group ${frameStyle}`}
                  >
                    {/* Metallic Cyber Corner Accents */}
                    <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_6px_#22d3ee]"></div>
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_6px_#22d3ee]"></div>

                    <div>
                      {/* Top Marquee Header: Icon + Category & Rarity Tags */}
                      <div className="flex justify-between items-center mb-3 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-700 group-hover:border-cyan-400 transition-colors shadow-inner">
                            {renderIcon(game.icon, "w-6 h-6 text-cyan-300")}
                          </div>
                          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                            {game.category}
                          </span>
                        </div>

                        {/* Rarity Tag with Strict Color Mapping */}
                        <span className={`text-[9px] font-mono font-black px-2.5 py-1 rounded-full uppercase border tracking-widest ${
                          game.rarity === 'mythique' ? 'bg-red-950 text-red-300 border-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                          game.rarity === 'legendaire' ? 'bg-yellow-950 text-yellow-300 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' :
                          game.rarity === 'epique' ? 'bg-purple-950 text-purple-300 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' :
                          game.rarity === 'rare' ? 'bg-blue-950 text-blue-300 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' :
                          'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                        }`}>
                          {game.rarity}
                        </span>
                      </div>

                      {/* Game Title */}
                      <h3 className="text-xl font-black font-sans uppercase tracking-wide text-white group-hover:text-cyan-300 transition-colors">
                        {game.frenchName}
                      </h3>

                      {/* --- GAME BIO & DESCRIPTION INSET PANEL --- */}
                      <div className="mt-2.5 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-inner group-hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-cyan-400 mb-1 uppercase tracking-wider">
                          <Info size={12} /> BIO DU JEU
                        </div>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed">
                          {game.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer Stats & Action Play Button */}
                    <div className="mt-5 border-t border-slate-800 pt-3 flex justify-between items-center font-mono">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-[8px] text-slate-500 font-bold uppercase">RECORD</p>
                          <p className="text-xs font-black text-yellow-300">{gameStats.highScore.toLocaleString()} PX</p>
                        </div>
                        <div className="w-px h-6 bg-slate-800"></div>
                        <div>
                          <p className="text-[8px] text-slate-500 font-bold uppercase">PARTIES</p>
                          <p className="text-xs font-black text-slate-300">{gameStats.plays}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleLaunchGame(game.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs uppercase cursor-pointer transition-all group-hover:scale-105 ${activeSkinObj.buttonStyle}`}
                      >
                        <Play size={13} fill="currentColor" /> JOUER
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* --- Profile Customization Modal --- */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
          <div className="bg-slate-950 border-2 border-cyan-500 p-6 rounded-2xl w-full max-w-xl text-white relative shadow-[0_0_35px_rgba(6,182,212,0.3)]">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <User size={20} /> PERSONNALISATION DU PROFIL
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm"
              >
                ✕ FERMER
              </button>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex gap-2 mb-4 border-b border-slate-800 pb-2">
              <button
                onClick={() => setProfileTab('identity')}
                className={`py-1.5 px-3 text-xs font-bold rounded-lg border cursor-pointer ${profileTab === 'identity' ? 'bg-cyan-950 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                👤 IDENTITÉ
              </button>
              <button
                onClick={() => setProfileTab('auras')}
                className={`py-1.5 px-3 text-xs font-bold rounded-lg border cursor-pointer ${profileTab === 'auras' ? 'bg-purple-950 border-purple-400 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                ✨ AURAS (ACQUISES)
              </button>
              <button
                onClick={() => setProfileTab('banners')}
                className={`py-1.5 px-3 text-xs font-bold rounded-lg border cursor-pointer ${profileTab === 'banners' ? 'bg-rose-950 border-rose-400 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                🎨 BANNIÈRES (ACQUISES)
              </button>
              <button
                onClick={() => setProfileTab('avatar')}
                className={`py-1.5 px-3 text-xs font-bold rounded-lg border cursor-pointer ${profileTab === 'avatar' ? 'bg-yellow-950 border-yellow-400 text-yellow-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                🖼️ AVATAR & COULEURS
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {profileTab === 'identity' && (
                <>
                  {/* Competitive Rank Banner in Profile */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${currentRank.badgeColor} ${currentRank.glowColor}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl border border-white/30 flex items-center justify-center bg-slate-950/70 shrink-0">
                        {renderIcon(currentRank.icon, "w-6 h-6 text-yellow-300")}
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-300">RANG COMPÉTITIF ACTUEL</p>
                        <p className="text-sm font-black text-white">{currentRank.frenchName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-300 font-bold uppercase">SCORE DE RANG</p>
                      <p className="text-sm font-black text-yellow-300">{rankPoints.toLocaleString()} PTS</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-bold block mb-1 uppercase">PSEUDO JOUEUR :</label>
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value.toUpperCase().slice(0, 16))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-cyan-300 font-bold focus:border-cyan-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-bold block mb-1 uppercase">TITRE ÉQUIPÉ (ACQUIS UNIQUEMENT) :</label>
                    <div className="grid grid-cols-2 gap-2">
                      {SHOP_TITLES.filter(t => (state.profile.unlockedTitles || ['DÉBUTANT']).includes(t.title)).map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTitleInput(t.title)}
                          className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${selectedTitleInput === t.title ? 'bg-amber-950 border-amber-400 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                        >
                          <p className="text-xs font-bold">{t.title}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {profileTab === 'auras' && (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-400 mb-2">Seules vos auras débloquées apparaissent ci-dessous :</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {AURA_COSMETICS.filter(a => (state.profile.unlockedAuras || ['none']).includes(a.id)).map((aura) => {
                      const isSelected = selectedAuraInput === aura.id;
                      return (
                        <div
                          key={aura.id}
                          onClick={() => setSelectedAuraInput(aura.id)}
                          className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-3 ${isSelected ? 'border-purple-400 bg-purple-950/40 shadow-lg' : 'border-slate-800 bg-slate-900/60'}`}
                        >
                          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${aura.glowClass}`}>
                            <Zap size={14} className="text-white" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-200">{aura.name}</p>
                            <span className="text-[9px] text-purple-400 font-bold">{isSelected ? 'SÉLECTIONNÉE' : 'CHOISIR'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {profileTab === 'banners' && (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-400 mb-2">Seules vos bannières débloquées apparaissent ci-dessous :</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {TITLE_BANNERS.filter(b => (state.profile.unlockedBanners || ['banner_neon']).includes(b.id)).map((b) => {
                      const isSelected = selectedBannerInput === b.id;
                      return (
                        <div
                          key={b.id}
                          onClick={() => setSelectedBannerInput(b.id)}
                          className={`p-2.5 rounded-xl border cursor-pointer ${isSelected ? 'border-rose-400 ring-2 ring-rose-500/50' : 'border-slate-800'}`}
                        >
                          <div className={`h-10 rounded-lg ${b.gradient} flex items-center justify-center font-bold text-xs text-white mb-1.5`}>
                            {b.name}
                          </div>
                          <span className="text-[9px] text-rose-400 font-bold uppercase">{isSelected ? 'SÉLECTIONNÉE' : 'CHOISIR'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {profileTab === 'avatar' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 font-bold block mb-2 uppercase">COULEURS D'AVATAR DÉBLOQUÉES :</label>
                    <div className="flex flex-wrap gap-2.5">
                      {AVATAR_COLORS_SHOP.filter(c => (state.profile.unlockedColors || ['cyan']).includes(c.id)).map(col => (
                        <button
                          key={col.id}
                          onClick={() => setSelectedAvatarColorInput(col.id)}
                          className={`w-9 h-9 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-center ${selectedAvatarColorInput === col.id ? 'scale-110 border-white shadow-[0_0_12px_rgba(255,255,255,0.8)]' : 'border-transparent opacity-75'}`}
                          style={{ backgroundColor: col.hex }}
                        >
                          {selectedAvatarColorInput === col.id && <span className="text-white text-xs font-black">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 font-bold block mb-2 uppercase">ICÔNES D'AVATAR DÉBLOQUÉES :</label>
                    <div className="grid grid-cols-5 gap-2">
                      {AVATAR_ICONS_SHOP.filter(i => (state.profile.unlockedAvatarIcons || ['Crown', 'Zap']).includes(i.id)).map((iconObj) => {
                        const isSelected = selectedAvatarIconInput === iconObj.id;
                        return (
                          <button
                            key={iconObj.id}
                            onClick={() => setSelectedAvatarIconInput(iconObj.id)}
                            className={`p-3 rounded-xl border flex items-center justify-center cursor-pointer ${isSelected ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                          >
                            {renderIcon(iconObj.id, "w-6 h-6")}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4 border-t border-slate-800 pt-3">
              <button
                onClick={saveProfile}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-black py-3 rounded-xl text-xs uppercase cursor-pointer shadow-lg"
              >
                💾 ENREGISTRER
              </button>
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 bg-slate-900 text-slate-400 font-bold py-3 rounded-xl text-xs uppercase cursor-pointer border border-slate-800"
              >
                ANNULER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Shop Modal --- */}
      {showShopModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
          <div className="bg-slate-950 border-2 border-cyan-500 p-6 rounded-2xl w-full max-w-3xl text-white relative max-h-[85vh] flex flex-col shadow-[0_0_40px_rgba(6,182,212,0.25)]">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <ShoppingBag size={20} /> BOUTIQUE D'ARCADE VERTEX
              </h3>
              <button
                onClick={() => setShowShopModal(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm"
              >
                ✕ FERMER
              </button>
            </div>

            {/* Shop Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setShopTab('skins')}
                className={`px-3 py-2 text-xs font-bold rounded-lg border cursor-pointer ${shopTab === 'skins' ? 'bg-cyan-950 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                🕹️ THÈMES ({CABINET_SKINS.length})
              </button>
              <button
                onClick={() => setShopTab('auras')}
                className={`px-3 py-2 text-xs font-bold rounded-lg border cursor-pointer ${shopTab === 'auras' ? 'bg-purple-950 border-purple-400 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                ✨ AURAS ({AURA_COSMETICS.length})
              </button>
              <button
                onClick={() => setShopTab('titles')}
                className={`px-3 py-2 text-xs font-bold rounded-lg border cursor-pointer ${shopTab === 'titles' ? 'bg-amber-950 border-amber-400 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                🎖️ TITRES ({SHOP_TITLES.length})
              </button>
              <button
                onClick={() => setShopTab('banners')}
                className={`px-3 py-2 text-xs font-bold rounded-lg border cursor-pointer ${shopTab === 'banners' ? 'bg-rose-950 border-rose-400 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                🎨 BANNIÈRES ({TITLE_BANNERS.length})
              </button>
              <button
                onClick={() => setShopTab('icons')}
                className={`px-3 py-2 text-xs font-bold rounded-lg border cursor-pointer ${shopTab === 'icons' ? 'bg-emerald-950 border-emerald-400 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                🖼️ AVATARS ({AVATAR_ICONS_SHOP.length})
              </button>
              <button
                onClick={() => setShopTab('colors')}
                className={`px-3 py-2 text-xs font-bold rounded-lg border cursor-pointer ${shopTab === 'colors' ? 'bg-yellow-950 border-yellow-400 text-yellow-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                🎨 COULEURS ({AVATAR_COLORS_SHOP.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              {shopTab === 'skins' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CABINET_SKINS.map((skin) => {
                    const isUnlocked = state.profile.unlockedSkins.includes(skin.id);
                    const isActive = state.profile.activeSkin === skin.id;

                    return (
                      <div key={skin.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 rounded border border-white/20 shadow-sm" style={{ backgroundColor: skin.colorPreview }}></div>
                            <p className="font-bold text-sm text-slate-200">{skin.name}</p>
                          </div>
                          <p className="text-[10px] text-slate-400">Thème personnalisé pour votre borne de jeu.</p>
                        </div>
                        <div className="mt-3 flex justify-between items-center bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                          <span className="text-xs text-yellow-400 font-bold">{skin.cost === 0 ? 'GRATUIT' : `${skin.cost} PX`}</span>
                          {isActive ? (
                            <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-1 rounded border border-cyan-800 font-bold">ÉQUIPÉ</span>
                          ) : isUnlocked ? (
                            <button onClick={() => useSkin(skin.id)} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded text-cyan-300 cursor-pointer font-bold">ÉQUIPER</button>
                          ) : (
                            <button onClick={() => buySkin(skin.id, skin.cost)} className="text-xs bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-3 py-1 rounded font-bold cursor-pointer">ACHETER</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {shopTab === 'auras' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AURA_COSMETICS.map((aura) => {
                    const isUnlocked = (state.profile.unlockedAuras || ['none']).includes(aura.id);
                    const isActive = state.profile.activeAura === aura.id;

                    return (
                      <div key={aura.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col justify-between">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center bg-slate-950 shrink-0 ${aura.glowClass}`}>
                            <Zap size={18} className="text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-200">{aura.name}</p>
                            <p className="text-[10px] text-slate-400">{aura.desc}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center bg-slate-950/80 p-2 rounded-lg border border-slate-800 mt-2">
                          <span className="text-xs text-yellow-400 font-bold">{aura.cost === 0 ? 'GRATUIT' : `${aura.cost} PX`}</span>
                          {isActive ? (
                            <span className="text-[10px] bg-purple-950 text-purple-400 px-2 py-1 rounded border border-purple-800 font-bold">ÉQUIPÉ</span>
                          ) : isUnlocked ? (
                            <button onClick={() => useAura(aura.id)} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded text-purple-300 cursor-pointer font-bold">ÉQUIPER</button>
                          ) : (
                            <button onClick={() => buyAura(aura.id, aura.cost)} className="text-xs bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-3 py-1 rounded font-bold cursor-pointer">ACHETER</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {shopTab === 'titles' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SHOP_TITLES.map((t) => {
                    const isUnlocked = (state.profile.unlockedTitles || ['DÉBUTANT']).includes(t.title);
                    const isActive = state.profile.title === t.title;

                    return (
                      <div key={t.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm text-yellow-400">{t.title}</p>
                          <p className="text-[10px] text-slate-400">Titre honorifique de profil</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-yellow-400 font-bold">{t.cost} PX</span>
                          {isActive ? (
                            <span className="text-[10px] bg-amber-950 text-amber-400 px-2 py-1 rounded border border-amber-800 font-bold">ÉQUIPÉ</span>
                          ) : isUnlocked ? (
                            <button onClick={() => equipTitle(t.title)} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded text-amber-300 cursor-pointer font-bold">ÉQUIPER</button>
                          ) : (
                            <button onClick={() => buyTitle(t.title, t.cost)} className="text-xs bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-3 py-1 rounded font-bold cursor-pointer">ACHETER</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {shopTab === 'banners' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TITLE_BANNERS.map((b) => {
                    const isUnlocked = (state.profile.unlockedBanners || ['banner_neon']).includes(b.id);
                    const isActive = state.profile.activeBanner === b.id;

                    return (
                      <div key={b.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col justify-between">
                        <div className={`h-10 rounded-lg mb-2 ${b.gradient} flex items-center justify-center font-bold text-xs text-white shadow-md`}>
                          {b.name}
                        </div>
                        <div className="flex justify-between items-center bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                          <span className="text-xs text-yellow-400 font-bold">{b.cost === 0 ? 'GRATUIT' : `${b.cost} PX`}</span>
                          {isActive ? (
                            <span className="text-[10px] bg-rose-950 text-rose-400 px-2 py-1 rounded border border-rose-800 font-bold">ÉQUIPÉ</span>
                          ) : isUnlocked ? (
                            <button onClick={() => useBanner(b.id)} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded text-rose-300 cursor-pointer font-bold">ÉQUIPER</button>
                          ) : (
                            <button onClick={() => buyBanner(b.id, b.cost)} className="text-xs bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-3 py-1 rounded font-bold cursor-pointer">ACHETER</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {shopTab === 'icons' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AVATAR_ICONS_SHOP.map((iconObj) => {
                    const isUnlocked = (state.profile.unlockedAvatarIcons || ['Crown', 'Zap']).includes(iconObj.id);
                    const isActive = state.profile.avatarIcon === iconObj.id;

                    return (
                      <div key={iconObj.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col items-center text-center">
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-cyan-400 my-1">
                          {renderIcon(iconObj.id, "w-6 h-6")}
                        </div>
                        <p className="text-xs font-bold text-slate-200 mt-1">{iconObj.name}</p>
                        <div className="mt-2 w-full flex justify-between items-center bg-slate-950/80 p-1.5 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-yellow-400 font-bold">{iconObj.cost === 0 ? 'GRATUIT' : `${iconObj.cost} PX`}</span>
                          {isActive ? (
                            <span className="text-[9px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800 font-bold">ÉQUIPÉ</span>
                          ) : isUnlocked ? (
                            <button onClick={() => { setState(p => ({ ...p, profile: { ...p.profile, avatarIcon: iconObj.id } })); }} className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-cyan-300 cursor-pointer font-bold">ÉQUIPER</button>
                          ) : (
                            <button onClick={() => buyAvatarIcon(iconObj.id, iconObj.cost)} className="text-[10px] bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-2 py-0.5 rounded font-bold cursor-pointer">ACHETER</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {shopTab === 'colors' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AVATAR_COLORS_SHOP.map((colorObj) => {
                    const isUnlocked = (state.profile.unlockedColors || ['cyan']).includes(colorObj.id);
                    const isActive = state.profile.avatarColor === colorObj.id;

                    return (
                      <div key={colorObj.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col items-center text-center">
                        <div className="w-8 h-8 rounded-full border-2 border-white/30 my-1 shadow-md" style={{ backgroundColor: colorObj.hex }}></div>
                        <p className="text-xs font-bold text-slate-200 mt-1">{colorObj.name}</p>
                        <div className="mt-2 w-full flex justify-between items-center bg-slate-950/80 p-1.5 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-yellow-400 font-bold">{colorObj.cost === 0 ? 'GRATUIT' : `${colorObj.cost} PX`}</span>
                          {isActive ? (
                            <span className="text-[9px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800 font-bold">ÉQUIPÉ</span>
                          ) : isUnlocked ? (
                            <button onClick={() => { setState(p => ({ ...p, profile: { ...p.profile, avatarColor: colorObj.id } })); }} className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-cyan-300 cursor-pointer font-bold">ÉQUIPER</button>
                          ) : (
                            <button onClick={() => buyAvatarColor(colorObj.id, colorObj.cost)} className="text-[10px] bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-2 py-0.5 rounded font-bold cursor-pointer">ACHETER</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Achievements Modal (100) --- */}
      {showAchievementsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
          <div className="bg-slate-950 border-2 border-purple-500 p-6 rounded-2xl w-full max-w-3xl text-white relative max-h-[85vh] flex flex-col shadow-[0_0_40px_rgba(168,85,247,0.25)]">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                <Medal size={22} /> TABLEAU DES SUCCÈS (100 SUCCÈS)
              </h3>
              <button
                onClick={() => setShowAchievementsModal(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm"
              >
                ✕ FERMER
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {state.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    ach.isUnlocked
                      ? 'bg-purple-950/30 border-purple-500/60 text-purple-200'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${ach.isUnlocked ? 'bg-purple-950 border-purple-400 text-purple-300' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                      {renderIcon(ach.icon || 'Award', "w-5 h-5")}
                    </div>
                    <div>
                      <p className={`font-bold text-xs ${ach.isUnlocked ? 'text-white' : 'text-slate-400'}`}>{ach.frenchTitle}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{ach.frenchDescription}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-xs font-bold ${ach.isUnlocked ? 'text-yellow-400' : 'text-slate-600'}`}>+{ach.pixelReward} PX</span>
                    <span className="block text-[8px] font-black uppercase mt-0.5">{ach.isUnlocked ? '✅ DÉBLOQUÉ' : '🔒 VERROUILLÉ'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- Quests Modal --- */}
      {showQuestsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
          <div className="bg-slate-950 border-2 border-emerald-500 p-6 rounded-2xl w-full max-w-2xl text-white relative max-h-[85vh] flex flex-col shadow-[0_0_40px_rgba(16,185,129,0.25)]">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Target size={20} /> QUÊTES QUOTIDIENNES D'ARCADE
              </h3>
              <button
                onClick={() => setShowQuestsModal(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm"
              >
                ✕ FERMER
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {(state.quests || INITIAL_QUESTS).map((quest) => (
                <div key={quest.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-xs text-slate-200">{quest.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{quest.description}</p>
                    <div className="w-36 h-1.5 bg-slate-950 rounded-full mt-2 border border-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-400 transition-all" style={{ width: `${Math.min(100, (quest.current / quest.target) * 100)}%` }}></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-yellow-400 font-bold block">+{quest.rewardPixels} PX</span>
                    {quest.isClaimed ? (
                      <span className="text-[9px] text-slate-500 font-bold uppercase">RÉCOMPENSÉ</span>
                    ) : quest.isCompleted ? (
                      <button
                        onClick={() => {
                          audio.playWin();
                          setState(prev => ({
                            ...prev,
                            profile: { ...prev.profile, totalPixels: prev.profile.totalPixels + quest.rewardPixels },
                            quests: prev.quests.map(q => q.id === quest.id ? { ...q, isClaimed: true } : q)
                          }));
                        }}
                        className="text-[10px] bg-emerald-500 text-slate-950 px-2.5 py-1 rounded font-black cursor-pointer uppercase animate-bounce"
                      >
                        RÉCLAMER !
                      </button>
                    ) : (
                      <span className="text-[9px] text-slate-400 font-bold">{quest.current}/{quest.target}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- Pass Arcade Modal --- */}
      {showPassModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
          <div className="bg-slate-950 border-2 border-rose-500 p-6 rounded-2xl w-full max-w-3xl text-white relative max-h-[85vh] flex flex-col shadow-[0_0_40px_rgba(244,63,94,0.25)]">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <Flame size={22} /> PASS ARCADE SAISON 1 (50 NIVEAUX)
              </h3>
              <button
                onClick={() => setShowPassModal(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm"
              >
                ✕ FERMER
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {PASS_LEVELS.map((lvl) => (
                <div key={lvl.level} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 flex items-center justify-center font-black text-xs">
                      {lvl.level}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-200">Niveau {lvl.level}</p>
                      <p className="text-[10px] text-yellow-400 font-bold">{lvl.freeReward.label}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-400 font-bold">
                    {state.arcadePass?.level >= lvl.level ? 'DÉBLOQUÉ' : 'VERROUILLÉ'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- Tournois (Tournaments) Modal --- */}
      {showTournamentsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
          <div className="bg-slate-950 border-2 border-amber-500 p-6 rounded-2xl w-full max-w-3xl text-white relative max-h-[88vh] flex flex-col shadow-[0_0_40px_rgba(245,158,11,0.25)]">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xl font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                  <Trophy size={22} className="text-amber-400 animate-bounce" /> TOURNOIS & COMPÉTITIONS NÉON
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Dépassez les objectifs de score en direct et décrochez jusqu'à 15 000 PX !
                </p>
              </div>
              <button
                onClick={() => setShowTournamentsModal(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm"
              >
                ✕ FERMER
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {INITIAL_TOURNAMENTS.map((t) => (
                <div key={t.id} className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-sm text-amber-300 uppercase">{t.frenchTitle}</h4>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/60 font-black px-2 py-0.5 rounded-full uppercase">
                      ● EN DIRECT
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{t.description}</p>
                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800 mt-2">
                    <span className="text-xs text-yellow-400 font-bold">CAGNOTTE: {t.prizePool} PX</span>
                    <button
                      onClick={() => {
                        setShowTournamentsModal(false);
                        handleLaunchGame(t.gameId);
                      }}
                      className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3 py-1.5 rounded-lg cursor-pointer uppercase"
                    >
                      REJOINDRE L'ÉPREUVE 🎮
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* --- Competitive Ranks Modal --- */}
      {showRanksModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
          <div className="bg-slate-950 border-2 border-fuchsia-500 p-6 rounded-2xl w-full max-w-4xl text-white relative max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(217,70,239,0.35)]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3 shrink-0">
              <div>
                <h3 className="text-xl font-black text-fuchsia-400 uppercase tracking-widest flex items-center gap-2">
                  <Trophy size={24} className="text-fuchsia-400 animate-pulse" /> SYSTÈME DE RANG & QUÊTES DE CLASSE
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Démarrez à 0 PTS de Rang ! Accomplissez des Quêtes de Rang pour cumuler des points, débloquer des divisions et gagner des bonus.
                </p>
              </div>
              <button
                onClick={() => setShowRanksModal(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl"
              >
                ✕ FERMER
              </button>
            </div>

            {/* Current Rank Showcase & Progress Bar */}
            <div className={`p-4 rounded-xl border mb-4 ${currentRank.badgeColor} ${currentRank.glowColor} shrink-0`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl border border-white/30 bg-slate-950/80 flex items-center justify-center shrink-0 shadow-lg">
                    {renderIcon(currentRank.icon, "w-7 h-7 text-yellow-400")}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-300 block">RANG ACTUEL</span>
                    <h4 className="text-lg font-black text-white flex items-center gap-2">
                      {currentRank.frenchName}
                      <span className="text-xs bg-black/40 border border-white/20 px-2 py-0.5 rounded text-yellow-300">
                        {currentRank.perkText}
                      </span>
                    </h4>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-300 font-bold uppercase block">SCORE DE RANG CUMULÉ</span>
                  <p className="text-2xl font-black text-yellow-300 font-sans tracking-wide">
                    {rankPoints.toLocaleString()} <span className="text-xs font-mono text-slate-300">PTS DE RANG</span>
                  </p>
                </div>
              </div>

              {/* Progress Bar Gauge */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-200">
                  <span>Progression vers {nextRank ? nextRank.frenchName : 'RANG MAX'}</span>
                  <span>{rankProgressPercent}% ({rankPoints.toLocaleString()} / {nextRank ? nextRank.minScore.toLocaleString() : 'MAX'} PTS)</span>
                </div>
                <div className="w-full bg-slate-950/80 rounded-full h-3.5 border border-white/20 overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-amber-400 via-yellow-400 to-fuchsia-500 h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(250,204,21,0.8)]"
                    style={{ width: `${rankProgressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-800 mb-4 gap-2 shrink-0">
              <button
                onClick={() => { audio.playClick(); setRankedModalTab('progress'); }}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
                  rankedModalTab === 'progress'
                    ? 'bg-fuchsia-950/80 border-t-2 border-x border-fuchsia-500 text-fuchsia-300 font-black'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                🏅 PALIER DE RANG
                {hasUnclaimedRankRewards && (
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping"></span>
                )}
              </button>
              <button
                onClick={() => { audio.playClick(); setRankedModalTab('quests'); }}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
                  rankedModalTab === 'quests'
                    ? 'bg-fuchsia-950/80 border-t-2 border-x border-fuchsia-500 text-fuchsia-300 font-black'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                🎯 QUÊTES DE RANG ({unclaimedRankQuestsCount})
                {unclaimedRankQuestsCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-yellow-400 text-slate-950 rounded-full text-[10px] font-black animate-bounce">
                    {unclaimedRankQuestsCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => { audio.playClick(); setRankedModalTab('perks'); }}
                className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 ${
                  rankedModalTab === 'perks'
                    ? 'bg-fuchsia-950/80 border-t-2 border-x border-fuchsia-500 text-fuchsia-300 font-black'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                ⚡ BONUS & PERKS
              </button>
            </div>

            {/* Tab Content 1: Palier de Rang */}
            {rankedModalTab === 'progress' && (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {COMPETITIVE_RANKS.map((rank) => {
                  const isUnlocked = rankPoints >= rank.minScore;
                  const isClaimed = (state.claimedRankRewards || []).includes(rank.id);
                  const isCurrent = currentRank.id === rank.id;

                  return (
                    <div
                      key={rank.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCurrent
                          ? `${rank.badgeColor} ${rank.glowColor} ring-2 ring-yellow-400/50`
                          : isUnlocked
                          ? 'bg-slate-900/80 border-slate-700 text-slate-200'
                          : 'bg-slate-950/60 border-slate-900 text-slate-500 opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl border border-white/20 bg-slate-950/80 flex items-center justify-center shrink-0 shadow-inner">
                          {renderIcon(rank.icon, `w-6 h-6 ${isUnlocked ? 'text-yellow-400' : 'text-slate-600'}`)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-sm uppercase text-white tracking-wide">{rank.frenchName}</h4>
                            {isCurrent && (
                              <span className="text-[9px] bg-yellow-400 text-slate-950 font-black px-2 py-0.5 rounded uppercase">
                                ACTUEL
                              </span>
                            )}
                            <span className="text-[10px] bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold px-2 py-0.5 rounded">
                              {rank.perkText}
                            </span>
                          </div>
                          <p className="text-xs mt-0.5 opacity-90">{rank.description}</p>
                          <p className="text-[10px] text-cyan-300 font-bold mt-1">
                            Score Requis : {rank.minScore.toLocaleString()} PTS DE RANG
                            {rank.titleReward && <span className="ml-2 text-yellow-300 font-bold">• Titre : {rank.titleReward}</span>}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2">
                        <span className="text-xs font-black text-yellow-400">+{rank.pixelReward} PX</span>
                        {isClaimed ? (
                          <span className="text-[10px] bg-slate-900 text-slate-400 font-bold px-3 py-1 rounded border border-slate-800 uppercase">
                            ✅ RÉCLAMÉ
                          </span>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => claimRankReward(rank.id)}
                            className="text-xs bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl cursor-pointer uppercase shadow-[0_0_15px_rgba(234,179,8,0.5)] animate-bounce"
                          >
                            RÉCLAMER !
                          </button>
                        ) : (
                          <span className="text-[10px] bg-slate-950 text-slate-600 font-bold px-3 py-1 rounded border border-slate-900 uppercase">
                            🔒 VERROUILLÉ
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab Content 2: Quêtes de Rang */}
            {rankedModalTab === 'quests' && (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                <div className="bg-fuchsia-950/40 border border-fuchsia-800/60 p-3 rounded-xl mb-3 text-xs text-fuchsia-200 flex items-center justify-between">
                  <span>🎯 Accomplissez ces quêtes pour accumuler des <strong>PTS DE RANG</strong> et débloquer les divisions de rang !</span>
                  <span className="font-black text-yellow-300">{unclaimedRankQuestsCount} PRÊTE(S)</span>
                </div>

                {RANK_QUESTS.map((q) => {
                  const isClaimed = (state.claimedRankQuests || []).includes(q.id);
                  const progress = getRankQuestProgress(q);
                  const isCompleted = progress >= q.target;
                  const percent = Math.min(100, Math.floor((progress / q.target) * 100));

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isClaimed
                          ? 'bg-slate-950/60 border-slate-900 text-slate-500 opacity-70'
                          : isCompleted
                          ? 'bg-fuchsia-950/80 border-fuchsia-500 text-white shadow-[0_0_20px_rgba(217,70,239,0.3)]'
                          : 'bg-slate-900/80 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-black text-sm uppercase text-white tracking-wide">{q.title}</h4>
                          <span className="text-[10px] bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 font-bold px-2 py-0.5 rounded">
                            +{q.rewardRankPts} PTS RANG
                          </span>
                          <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold px-2 py-0.5 rounded">
                            +{q.rewardPixels} PX
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{q.description}</p>

                        {/* Progress Bar */}
                        <div className="mt-2 space-y-1 max-w-md">
                          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                            <span>Progression</span>
                            <span>{progress} / {q.target} ({percent}%)</span>
                          </div>
                          <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-800 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-fuchsia-500 to-yellow-400 h-full rounded-full transition-all duration-300"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {isClaimed ? (
                          <span className="text-[10px] bg-slate-900 text-slate-500 font-bold px-3 py-1.5 rounded border border-slate-800 uppercase block">
                            ✅ VALIDÉE
                          </span>
                        ) : isCompleted ? (
                          <button
                            onClick={() => claimRankQuest(q.id)}
                            className="text-xs bg-gradient-to-r from-yellow-400 to-fuchsia-500 hover:from-yellow-300 hover:to-fuchsia-400 text-slate-950 font-black px-4 py-2 rounded-xl cursor-pointer uppercase shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-bounce"
                          >
                            RÉCLAMER +{q.rewardRankPts} PTS !
                          </button>
                        ) : (
                          <span className="text-[10px] bg-slate-950 text-slate-500 font-bold px-3 py-1.5 rounded border border-slate-900 uppercase block">
                            🔒 {progress} / {q.target}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab Content 3: Bonus & Perks */}
            {rankedModalTab === 'perks' && (
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">MULTIPLICATEUR DE GAIN ACTIF</span>
                    <p className="text-2xl font-black text-emerald-400">{currentRank.perkText}</p>
                    <p className="text-[11px] text-slate-400 mt-1">S'applique automatiquement sur tous les gains de Pixels d'arcade.</p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">TOTAL PTS DE RANG CUMULÉS</span>
                    <p className="text-2xl font-black text-cyan-400">{rankPoints} PTS</p>
                    <p className="text-[11px] text-slate-400 mt-1">Cumulez vos points en accomplissant des Quêtes de Rang.</p>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                  <h4 className="font-black text-sm text-yellow-300 mb-2 uppercase">💡 COMMENT FONCTIONNE LA PROGRESSION DE RANG ?</h4>
                  <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside font-sans">
                    <li>Vous commencez au rang <strong>Bronze III avec 0 PTS</strong>.</li>
                    <li>Rendez-vous dans l'onglet <strong>🎯 QUÊTES DE RANG</strong> et accomplissez les objectifs pour gagner des <strong>PTS DE RANG</strong>.</li>
                    <li>Chaque quête validée vous accorde des Points de Rang et des Pixels immédiatement.</li>
                    <li>Dès que vous atteignez le seuil d'une nouvelle division (ex. 100 PTS pour Bronze II, 250 PTS pour Bronze I, 450 PTS pour Argent III...), vous pouvez réclamer la récompense de palier !</li>
                  </ul>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- Prestige Modal --- */}
      {showPrestigeModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
          <div className="bg-slate-950 border-2 border-purple-500 p-6 rounded-2xl w-full max-w-xl text-white relative shadow-[0_0_50px_rgba(168,85,247,0.4)]">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={20} className="animate-spin-slow" /> SYSTÈME DE PRESTIGE
              </h3>
              <button
                onClick={() => setShowPrestigeModal(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm"
              >
                ✕ FERMER
              </button>
            </div>

            <div className="text-center space-y-4 my-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-950/80 border-2 border-purple-400 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.6)] animate-pulse">
                <Crown size={40} className="text-purple-300" />
              </div>

              <div>
                <h4 className="text-xl font-black text-white uppercase">PRESTIGE ACTUEL : LEVEL {state.profile.prestigeLevel || 0}</h4>
                <p className="text-xs text-purple-300 font-bold mt-1">MULTIPLICATEUR DE GAIN : +{(state.profile.prestigeLevel || 0) * 15}% PX</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-left space-y-2 text-xs text-slate-300">
                <p className="font-bold text-yellow-300 uppercase">⚡ AVANTAGES DU PRESTIGE :</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Augmente de façon permanente tous vos gains de Pixels de <strong>+15% par niveau de Prestige</strong> !</li>
                  <li>Débloque un titre exclusif de Prestige (ex: PRESTIGE {(state.profile.prestigeLevel || 0) + 1} 🌀)</li>
                  <li>Accorde un bonus immédiat de <strong>+5 000 PX</strong> !</li>
                  <li>Réinitialise vos points de rang à 0 pour vous permettre de refaire les quêtes de rang !</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handlePrestige}
                className="flex-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-slate-950 font-black py-3 rounded-xl text-xs uppercase cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.6)]"
              >
                🌀 PASSER AU PRESTIGE {(state.profile.prestigeLevel || 0) + 1} (+5 000 PX)
              </button>
              <button
                onClick={() => setShowPrestigeModal(false)}
                className="px-4 bg-slate-900 text-slate-400 font-bold py-3 rounded-xl text-xs uppercase cursor-pointer border border-slate-800"
              >
                FERMER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Roue de la Fortune Modal --- */}
      {showWheelModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
          <div className="bg-slate-950 border-2 border-yellow-500 p-6 rounded-2xl w-full max-w-md text-white relative shadow-[0_0_50px_rgba(234,179,8,0.4)] text-center">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-yellow-400 uppercase tracking-widest flex items-center gap-2">
                <Disc size={20} className="animate-spin-slow" /> ROUE DE LA FORTUNE NÉON
              </h3>
              <button
                onClick={() => setShowWheelModal(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm"
              >
                ✕ FERMER
              </button>
            </div>

            <div className="my-6 relative flex flex-col items-center justify-center">
              <div className={`w-48 h-48 rounded-full border-4 border-yellow-400 bg-gradient-to-tr from-yellow-950 via-slate-900 to-amber-900 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.6)] relative overflow-hidden transition-transform duration-[2000ms] ${isSpinningWheel ? 'animate-spin' : ''}`}>
                <div className="text-center p-4">
                  <Disc size={48} className="text-yellow-400 mx-auto mb-2" />
                  <span className="text-xs font-black text-yellow-300">GAGNEZ JUSQU'À 5 000 PX !</span>
                </div>
              </div>

              {wheelResult && (
                <div className="mt-4 p-3 bg-yellow-950/80 border border-yellow-400 rounded-xl text-yellow-300 font-black text-sm animate-bounce">
                  🎉 RÉCOMPENSE : {wheelResult} !
                </div>
              )}
            </div>

            <button
              onClick={handleSpinWheel}
              disabled={isSpinningWheel}
              className="w-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase cursor-pointer shadow-[0_0_20px_rgba(234,179,8,0.6)] disabled:opacity-50"
            >
              {isSpinningWheel ? 'TOURNOIEMENT EN COURS...' : '🎰 TOURNER LA ROUE !'}
            </button>
          </div>
        </div>
      )}

      {/* --- Coffres de Chance Modal --- */}
      {showBoxesModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
          <div className="bg-slate-950 border-2 border-rose-500 p-6 rounded-2xl w-full max-w-2xl text-white relative shadow-[0_0_50px_rgba(244,63,94,0.4)]">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <Key size={20} /> COFFRES MYSTÈRES ARCADE
              </h3>
              <button
                onClick={() => setShowBoxesModal(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm"
              >
                ✕ FERMER
              </button>
            </div>

            {boxResult && (
              <div className="mb-4 p-3 bg-rose-950/80 border border-rose-400 rounded-xl text-rose-300 font-black text-xs text-center animate-pulse">
                {boxResult}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
              {/* Box 1: Bronze */}
              <div className="p-4 bg-slate-900/80 border border-slate-700 rounded-xl flex flex-col justify-between text-center">
                <div>
                  <div className="text-3xl mb-2">📦</div>
                  <h4 className="font-black text-sm text-amber-400 uppercase">COFFRE BRONZE</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Contient entre 50 et 300 PX</p>
                </div>
                <button
                  onClick={() => handleOpenBox(100, 'COFFRE BRONZE')}
                  className="mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2 rounded-lg text-xs cursor-pointer uppercase"
                >
                  OUVRIR (100 PX)
                </button>
              </div>

              {/* Box 2: Épique */}
              <div className="p-4 bg-purple-950/40 border border-purple-500 rounded-xl flex flex-col justify-between text-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <div>
                  <div className="text-3xl mb-2">🎁</div>
                  <h4 className="font-black text-sm text-purple-300 uppercase">COFFRE ÉPIQUE</h4>
                  <p className="text-[10px] text-purple-200 mt-1">Contient entre 300 et 1 500 PX</p>
                </div>
                <button
                  onClick={() => handleOpenBox(500, 'COFFRE ÉPIQUE')}
                  className="mt-4 bg-purple-500 hover:bg-purple-400 text-slate-950 font-black py-2 rounded-lg text-xs cursor-pointer uppercase shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                >
                  OUVRIR (500 PX)
                </button>
              </div>

              {/* Box 3: Mythique */}
              <div className="p-4 bg-rose-950/40 border-2 border-rose-500 rounded-xl flex flex-col justify-between text-center shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                <div>
                  <div className="text-3xl mb-2">💎</div>
                  <h4 className="font-black text-sm text-rose-300 uppercase">COFFRE MYTHIQUE</h4>
                  <p className="text-[10px] text-rose-200 mt-1">Contient entre 1 000 et 5 000 PX</p>
                </div>
                <button
                  onClick={() => handleOpenBox(1500, 'COFFRE MYTHIQUE')}
                  className="mt-4 bg-gradient-to-r from-rose-500 to-amber-400 hover:from-rose-400 hover:to-amber-300 text-slate-950 font-black py-2 rounded-lg text-xs cursor-pointer uppercase shadow-[0_0_15px_rgba(244,63,94,0.6)]"
                >
                  OUVRIR (1 500 PX)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
