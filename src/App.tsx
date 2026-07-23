import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap, Brain, Target, Play, Grid, Layers, Shield, Cpu, Sword, PlusCircle, Grid3X3, Sparkles, Award, Trophy, User, ShoppingBag, Settings, Volume2, VolumeX, Medal, Flame, PlayCircle, Eye, Info, Check, Lock, Key, Navigation, RefreshCw, Calendar, Crown
} from 'lucide-react';

import { audio } from './utils/audio';
import { GlobalState, GameStats, Achievement, Quest, ArcadePass } from './types';
import { GAMES_LIST, CABINET_SKINS, INITIAL_ACHIEVEMENTS, INITIAL_QUESTS, QUEST_POOL, PASS_LEVELS, AURA_COSMETICS, TITLE_BANNERS } from './gamesData';

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

const AVATAR_COLORS = [
  { id: 'cyan', hex: '#06b6d4', text: 'text-cyan-400', border: 'border-cyan-500' },
  { id: 'pink', hex: '#ec4899', text: 'text-pink-400', border: 'border-pink-500' },
  { id: 'purple', hex: '#a855f7', text: 'text-purple-400', border: 'border-purple-500' },
  { id: 'emerald', hex: '#10b981', text: 'text-emerald-400', border: 'border-emerald-500' },
  { id: 'yellow', hex: '#eab308', text: 'text-yellow-400', border: 'border-yellow-500' },
  { id: 'plasma_violet', hex: '#a855f7', text: 'text-purple-400 font-bold', border: 'border-purple-500 shadow-[0_0_10px_#a855f7] animate-pulse' },
  { id: 'rose_neon', hex: '#f43f5e', text: 'text-rose-400 font-bold', border: 'border-rose-500 animate-pulse' },
  { id: 'gold_rainbow', hex: '#fbbf24', text: 'text-yellow-400 font-extrabold bg-gradient-to-r from-yellow-400 via-rose-500 to-cyan-400 bg-clip-text text-transparent', border: 'border-yellow-400 shadow-[0_0_15px_#eab308] border-dashed animate-pulse' }
];

const PURCHASABLE_TITLES = [
  { id: 'NÉON GOD ⚡', cost: 500, desc: 'Pour les divinités du rétro' },
  { id: 'VERTEX EMPEREUR 👑', cost: 750, desc: 'Pour les monarques absolus du Vertex' },
  { id: 'SANS RETOUR 🔥', cost: 350, desc: 'Pour ceux qui ne reculent devant rien' },
  { id: 'CHASSEUR DE PIXELS 🎯', cost: 200, desc: 'Pour les collectionneurs d\'élite' },
  { id: 'MAÎTRE MYTHIQUE 🌌', cost: 1000, desc: 'Pour les vainqueurs des épreuves mythiques' }
];

const AVATAR_ICONS = ['Crown', 'Zap', 'Award', 'Trophy', 'Brain', 'Target', 'Shield', 'Cpu', 'Sword', 'Sparkles'];

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
          totalPixels: 0,
          unlockedSkins: ['neon'],
          activeSkin: 'neon',
          title: 'DÉBUTANT',
          unlockedTitles: ['DÉBUTANT'],
          unlockedColors: ['cyan', 'pink', 'purple', 'emerald', 'yellow', 'plasma_violet'],
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

    // Dynamic schema upgrades
    if (!parsed.profile.title) parsed.profile.title = 'DÉBUTANT';
    if (!parsed.profile.unlockedTitles) parsed.profile.unlockedTitles = ['DÉBUTANT'];
    if (!parsed.profile.unlockedColors) parsed.profile.unlockedColors = ['cyan', 'pink', 'purple', 'emerald', 'yellow', 'plasma_violet'];
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
  const [shopTab, setShopTab] = useState<'skins' | 'auras' | 'titles' | 'banners'>('skins');
  const [profileTab, setProfileTab] = useState<'identity' | 'auras' | 'banners' | 'avatar'>('identity');
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showQuestsModal, setShowQuestsModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showTournamentsModal, setShowTournamentsModal] = useState(false);

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

  const handleScore = (earnedPixels: number) => {
    setState(prev => {
      const nextPixels = prev.profile.totalPixels + earnedPixels;
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
      const nextStats: GameStats = {
        plays: currentStats.plays + 1,
        highScore: Math.max(currentStats.highScore, finalScore)
      };

      const updatedStats = {
        ...prev.stats,
        [gameId]: nextStats
      };

      const gameObj = GAMES_LIST.find(g => g.id === gameId);

      let extraPixels = 0;
      const updatedAchievements = prev.achievements.map(ach => {
        let shouldUnlock = false;

        if (ach.id === 'ach2' && gameId === 'clicker' && finalScore >= 150) shouldUnlock = true;
        if (ach.id === 'ach3' && gameId === 'simon' && finalScore >= 60) shouldUnlock = true;
        if (ach.id === 'ach4' && gameId === 'reflex' && finalScore >= 120) shouldUnlock = true;
        if (ach.id === 'ach5' && gameId === 'snake' && finalScore >= 100) shouldUnlock = true;
        if (ach.id === 'ach6' && gameId === 'brick' && finalScore >= 150) shouldUnlock = true;
        if (ach.id === 'ach7' && gameId === 'stacker' && finalScore >= 200) shouldUnlock = true;
        if (ach.id === 'ach8' && gameId === 'catch' && finalScore >= 120) shouldUnlock = true;
        if (ach.id === 'ach9' && gameId === 'tictactoe' && finalScore >= 50) shouldUnlock = true;
        if (ach.id === 'ach10' && gameId === 'math' && finalScore >= 100) shouldUnlock = true;
        if (ach.id === 'ach44' && gameId === 'pong' && finalScore >= 60) shouldUnlock = true;
        if (ach.id === 'ach45' && gameId === 'laserdodge' && finalScore >= 80) shouldUnlock = true;

        if (shouldUnlock && !ach.isUnlocked) {
          triggerNotification(ach);
          extraPixels += ach.pixelReward;
          return { ...ach, isUnlocked: true };
        }
        return ach;
      });

      const updatedQuests = (prev.quests || INITIAL_QUESTS).map(q => {
        if (q.isCompleted) return q;

        let nextCurrent = q.current;
        let isNowCompleted = false;

        if (q.type === 'plays_total') {
          nextCurrent = q.current + 1;
          isNowCompleted = nextCurrent >= q.target;
        } else if (q.type === 'score_specific' && q.gameId === gameId) {
          nextCurrent = Math.max(q.current, finalScore);
          isNowCompleted = nextCurrent >= q.target;
        } else if (q.type === 'math_streak' && gameId === 'math') {
          nextCurrent = Math.max(q.current, finalScore);
          isNowCompleted = nextCurrent >= q.target;
        } else if (q.type === 'plays_easy' && gameObj?.difficulty === 'easy') {
          nextCurrent = q.current + 1;
          isNowCompleted = nextCurrent >= q.target;
        } else if (q.type === 'plays_medium' && gameObj?.difficulty === 'medium') {
          nextCurrent = q.current + 1;
          isNowCompleted = nextCurrent >= q.target;
        } else if (q.type === 'plays_hard' && gameObj?.difficulty === 'hard') {
          nextCurrent = q.current + 1;
          isNowCompleted = nextCurrent >= q.target;
        } else if (q.type === 'plays_mythic' && gameObj?.difficulty === 'mythic') {
          nextCurrent = q.current + 1;
          isNowCompleted = nextCurrent >= q.target;
        } else if (q.type === 'perfect_reflex' && gameObj?.category === 'reflex' && finalScore >= q.target) {
          nextCurrent = Math.max(q.current, finalScore);
          isNowCompleted = true;
        } else if (q.type === 'perfect_memory' && gameObj?.category === 'memory' && finalScore >= q.target) {
          nextCurrent = Math.max(q.current, finalScore);
          isNowCompleted = true;
        } else if (q.type === 'different_games') {
          const playedCount = (Object.values(updatedStats) as GameStats[]).filter(s => s.plays > 0).length;
          nextCurrent = playedCount;
          isNowCompleted = nextCurrent >= q.target;
        }

        if (nextCurrent !== q.current) {
          if (isNowCompleted) {
            setTimeout(() => {
              audio.playWin();
              setActiveNotification(`🎯 QUÊTE RÉUSSIE : ${q.title} (+${q.rewardPixels} PX) !`);
              setTimeout(() => setActiveNotification(null), 4500);
            }, 200);
          }
          return { ...q, current: nextCurrent, isCompleted: isNowCompleted };
        }
        return q;
      });

      return {
        ...prev,
        profile: {
          ...prev.profile,
          totalPixels: prev.profile.totalPixels + extraPixels
        },
        stats: updatedStats,
        achievements: updatedAchievements,
        quests: updatedQuests
      };
    });
  };

  const saveProfile = () => {
    audio.playCoin();
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        username: usernameInput.trim() || 'PLAYER_ONE',
        title: selectedTitleInput,
        avatarColor: selectedAvatarColorInput,
        avatarIcon: selectedAvatarIconInput,
        activeAura: selectedAuraInput,
        activeBanner: selectedBannerInput
      }
    }));
    setShowProfileModal(false);
  };

  const claimQuest = (questId: string) => {
    audio.playCoin();
    setState(prev => {
      const quest = (prev.quests || INITIAL_QUESTS).find(q => q.id === questId);
      if (!quest || !quest.isCompleted || quest.isClaimed) return prev;

      const updatedQuests = (prev.quests || INITIAL_QUESTS).map(q => {
        if (q.id === questId) return { ...q, isClaimed: true };
        return q;
      });

      let nextPixels = prev.profile.totalPixels + quest.rewardPixels;
      let nextPass = { ...(prev.arcadePass || { level: 1, xp: 0, isPremium: false, claimedFreeRewards: [], claimedPremiumRewards: [] }) };
      
      nextPass.xp += quest.rewardXp;
      
      let levelUps = 0;
      while (nextPass.xp >= 100 && nextPass.level < 50) {
        nextPass.xp -= 100;
        nextPass.level += 1;
        levelUps++;
      }

      if (levelUps > 0) {
        setTimeout(() => {
          audio.playWin();
          setActiveNotification(`🎉 PASS ARCADE : Niveau ${nextPass.level} atteint !`);
          setTimeout(() => setActiveNotification(null), 4500);
        }, 100);
      }

      return {
        ...prev,
        profile: { ...prev.profile, totalPixels: nextPixels },
        quests: updatedQuests,
        arcadePass: nextPass
      };
    });
  };

  const rotateQuests = () => {
    audio.playCoin();
    setState(prev => {
      // Pick 5 random fresh quests from QUEST_POOL
      const shuffled = [...QUEST_POOL].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 8).map(q => ({
        ...q,
        current: 0,
        isCompleted: false,
        isClaimed: false
      }));

      return {
        ...prev,
        quests: selected
      };
    });
    setActiveNotification(`🔄 NOUVELLES QUÊTES GÉNÉRÉES !`);
    setTimeout(() => setActiveNotification(null), 4000);
  };

  const buyPremiumPass = () => {
    const cost = 600;
    if (state.profile.totalPixels >= cost) {
      audio.playWin();
      setState(prev => {
        const nextPass = { ...(prev.arcadePass || { level: 1, xp: 0, isPremium: false, claimedFreeRewards: [], claimedPremiumRewards: [] }) };
        nextPass.isPremium = true;

        return {
          ...prev,
          profile: { ...prev.profile, totalPixels: prev.profile.totalPixels - cost },
          arcadePass: nextPass
        };
      });
      setActiveNotification(`💎 PASS ELITE PREMIUM ACTIVÉ !`);
      setTimeout(() => setActiveNotification(null), 4500);
    } else {
      audio.playHit();
      setActiveNotification(`⚠️ Erreur: Il te faut ${cost} PX pour le pass Élite !`);
      setTimeout(() => setActiveNotification(null), 4000);
    }
  };

  const claimPassReward = (lvl: number, track: 'free' | 'premium') => {
    audio.playCoin();
    setState(prev => {
      const pass = prev.arcadePass || { level: 1, xp: 0, isPremium: false, claimedFreeRewards: [], claimedPremiumRewards: [] };
      if (pass.level < lvl) return prev;
      if (track === 'premium' && !pass.isPremium) return prev;

      const alreadyClaimed = track === 'free' 
        ? pass.claimedFreeRewards.includes(lvl) 
        : pass.claimedPremiumRewards.includes(lvl);
      if (alreadyClaimed) return prev;

      const rewardLevelObj = PASS_LEVELS.find(pl => pl.level === lvl);
      if (!rewardLevelObj) return prev;

      const reward = track === 'free' ? rewardLevelObj.freeReward : rewardLevelObj.premiumReward;
      const nextProfile = { ...prev.profile };
      
      if (reward.type === 'pixels') {
        nextProfile.totalPixels += (reward.value as number);
      } else if (reward.type === 'title') {
        const titleVal = reward.value as string;
        const unlockedTitles = nextProfile.unlockedTitles || ['DÉBUTANT'];
        if (!unlockedTitles.includes(titleVal)) nextProfile.unlockedTitles = [...unlockedTitles, titleVal];
        nextProfile.title = titleVal;
      } else if (reward.type === 'skin') {
        const skinVal = reward.value as string;
        const unlockedSkins = nextProfile.unlockedSkins || ['neon'];
        if (!unlockedSkins.includes(skinVal)) nextProfile.unlockedSkins = [...unlockedSkins, skinVal];
        nextProfile.activeSkin = skinVal;
      } else if (reward.type === 'color') {
        const colorVal = reward.value as string;
        const unlockedColors = nextProfile.unlockedColors || ['cyan', 'pink', 'purple', 'emerald', 'yellow'];
        if (!unlockedColors.includes(colorVal)) nextProfile.unlockedColors = [...unlockedColors, colorVal];
        nextProfile.avatarColor = colorVal;
      } else if (reward.type === 'aura') {
        const auraVal = reward.value as string;
        const unlockedAuras = nextProfile.unlockedAuras || ['none'];
        if (!unlockedAuras.includes(auraVal)) nextProfile.unlockedAuras = [...unlockedAuras, auraVal];
        nextProfile.activeAura = auraVal;
      }

      const nextPass = { ...pass };
      if (track === 'free') nextPass.claimedFreeRewards = [...pass.claimedFreeRewards, lvl];
      else nextPass.claimedPremiumRewards = [...pass.claimedPremiumRewards, lvl];

      setTimeout(() => {
        audio.playWin();
        setActiveNotification(`🎁 RÉCOMPENSE OBTENUE : ${reward.label} !`);
        setTimeout(() => setActiveNotification(null), 4000);
      }, 100);

      return { ...prev, profile: nextProfile, arcadePass: nextPass };
    });
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
      setActiveNotification(`🕹️ CHÂSSIS DÉBLOQUÉ & ÉQUIPÉ !`);
      setTimeout(() => setActiveNotification(null), 4000);
    } else {
      audio.playHit();
      setActiveNotification(`⚠️ Pixels insuffisants !`);
      setTimeout(() => setActiveNotification(null), 3000);
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
      setState(prev => {
        const unlockedAuras = prev.profile.unlockedAuras || ['none'];
        return {
          ...prev,
          profile: {
            ...prev.profile,
            totalPixels: prev.profile.totalPixels - cost,
            unlockedAuras: [...unlockedAuras, auraId],
            activeAura: auraId
          }
        };
      });
      setActiveNotification(`✨ AURA HOLOGRAPHIQUE ÉQUIPÉE !`);
      setTimeout(() => setActiveNotification(null), 4000);
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
      setState(prev => {
        const unlockedBanners = prev.profile.unlockedBanners || ['banner_neon'];
        return {
          ...prev,
          profile: {
            ...prev.profile,
            totalPixels: prev.profile.totalPixels - cost,
            unlockedBanners: [...unlockedBanners, bannerId],
            activeBanner: bannerId
          }
        };
      });
      setActiveNotification(`🎨 BANNIÈRE DE PROFIL ÉQUIPÉE !`);
      setTimeout(() => setActiveNotification(null), 4000);
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
      setState(prev => {
        const unlockedTitles = prev.profile.unlockedTitles || ['DÉBUTANT'];
        const nextUnlocked = unlockedTitles.includes(titleId) ? unlockedTitles : [...unlockedTitles, titleId];
        return {
          ...prev,
          profile: {
            ...prev.profile,
            totalPixels: prev.profile.totalPixels - cost,
            unlockedTitles: nextUnlocked,
            title: titleId
          }
        };
      });
      setActiveNotification(`🎖️ NOUVEAU TITRE ÉQUIPÉ : ${titleId} !`);
      setTimeout(() => setActiveNotification(null), 4000);
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

  const handleLaunchGame = (gameId: string) => {
    audio.playCoin();
    setActiveGameId(gameId);
  };

  const renderActiveGame = () => {
    if (!activeGameId) return null;
    const gameHighScore = state.stats[activeGameId]?.highScore || 0;

    const gameProps = {
      onScore: handleScore,
      onGameOver: (finalScore: number) => handleGameOver(activeGameId, finalScore),
      onBack: () => {
        audio.playClick();
        setActiveGameId(null);
      },
      highScore: gameHighScore,
    };

    switch (activeGameId) {
      case 'clicker': return <NeonClicker {...gameProps} />;
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
      default:
        return (
          <div className="text-center py-10 font-mono text-red-400">
            Jeu non trouvé
          </div>
        );
    }
  };

  const activeSkinObj = CABINET_SKINS.find(s => s.id === state.profile.activeSkin) || CABINET_SKINS[0];
  const activeBannerObj = TITLE_BANNERS.find(b => b.id === state.profile.activeBanner) || TITLE_BANNERS[0];

  const filteredGames = GAMES_LIST.filter(game => {
    if (selectedCategory === 'all') return true;
    return game.category === selectedCategory;
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
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 border-2 border-yellow-400 py-3 px-6 rounded-xl shadow-[0_0_25px_rgba(234,179,8,0.5)] flex items-center gap-3"
          >
            <Medal size={20} className="text-yellow-400 animate-bounce" />
            <span className="font-mono font-bold text-xs text-yellow-300 tracking-wide">
              {activeNotification}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header className="border-b border-slate-900/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 rounded-lg blur opacity-50 animate-pulse"></div>
            <div className="relative bg-cyan-950/40 border-2 border-cyan-400 p-2.5 rounded-xl">
              <Zap className="text-cyan-400 animate-bounce-slow" size={22} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black font-sans tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-rose-400 uppercase drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]">
              Vertex Arcades
            </h1>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
              22 Mini-Jeux Rétro Néon d'Élite
            </p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sounds Toggle */}
          <button
            onClick={toggleSound}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-all cursor-pointer"
            title={soundOn ? 'Muter le son' : 'Activer le son'}
          >
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} className="text-red-400" />}
          </button>

          {/* Quests Button */}
          <button
            onClick={() => { audio.playClick(); setShowQuestsModal(true); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-slate-100 hover:border-slate-700 transition-all cursor-pointer text-xs font-mono relative"
          >
            <Target size={15} className="text-emerald-400" /> Quêtes
            {state.quests?.some(q => q.isCompleted && !q.isClaimed) && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
              </span>
            )}
          </button>

          {/* Arcade Pass Button */}
          <button
            onClick={() => { audio.playClick(); setShowPassModal(true); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-900/50 bg-rose-950/30 text-slate-200 hover:border-rose-500/50 transition-all cursor-pointer text-xs font-mono relative"
          >
            <Flame size={15} className="text-rose-400 animate-pulse" /> Pass Arcade
            <span className="text-[9px] bg-rose-500/30 text-rose-300 font-bold px-1.5 py-0.5 rounded border border-rose-500/40">
              Niv.{state.arcadePass?.level || 1}/50
            </span>
          </button>

          {/* Tournois (Tournaments) Button */}
          <button
            onClick={() => { audio.playClick(); setShowTournamentsModal(true); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-900/50 bg-amber-950/30 text-amber-300 hover:border-amber-500/50 transition-all cursor-pointer text-xs font-mono relative"
          >
            <Calendar size={15} className="text-amber-400 animate-bounce" /> Tournois
            <span className="text-[8px] bg-amber-500/20 text-amber-300 font-bold px-1 py-0.5 rounded border border-amber-500/30 uppercase">
              À venir
            </span>
          </button>

          {/* Stats Button */}
          <button
            onClick={() => { audio.playClick(); setShowStatsModal(true); }}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-slate-100 hover:border-slate-700 transition-all cursor-pointer text-xs font-mono"
          >
            <Trophy size={15} className="text-yellow-400" /> Stats
          </button>

          {/* Achievements Button */}
          <button
            onClick={() => { audio.playClick(); setShowAchievementsModal(true); }}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-slate-100 hover:border-slate-700 transition-all cursor-pointer text-xs font-mono"
          >
            <Medal size={15} className="text-purple-400" /> Succès
          </button>

          {/* Shop Button */}
          <button
            onClick={() => { audio.playClick(); setShowShopModal(true); }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-cyan-800/80 bg-cyan-950/40 text-cyan-300 hover:border-cyan-400 transition-all cursor-pointer text-xs font-mono shadow-[0_0_12px_rgba(6,182,212,0.2)]"
          >
            <ShoppingBag size={15} className="text-cyan-400" /> Shop
          </button>

          {/* User Profile Button */}
          {(() => {
            const userColorHex = AVATAR_COLORS.find(c => c.id === state.profile.avatarColor)?.hex || '#06b6d4';
            const userAuraObj = AURA_COSMETICS.find(a => a.id === state.profile.activeAura) || AURA_COSMETICS[0];
            return (
              <button
                onClick={() => { audio.playClick(); setShowProfileModal(true); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-slate-100 hover:border-slate-700 transition-all cursor-pointer text-xs font-mono"
              >
                <div
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center relative shrink-0 transition-all ${userAuraObj.glowClass}`}
                  style={{ backgroundColor: userColorHex }}
                >
                  {renderIcon(state.profile.avatarIcon || 'Crown', "w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]")}
                </div>
                <div className="text-left">
                  <p className="font-sans font-black text-[11px] leading-tight text-white">{state.profile.username}</p>
                  <p className="text-[7px] text-yellow-400 font-bold tracking-wider uppercase mt-0.5">{state.profile.title || 'DÉBUTANT'}</p>
                </div>
              </button>
            );
          })()}

          {/* Prettier Golden PX Badge Counter */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-950/90 via-yellow-950/80 to-amber-950/90 border-2 border-yellow-400/80 text-yellow-300 font-mono text-xs font-black shadow-[0_0_18px_rgba(234,179,8,0.35)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.15)_50%,transparent_75%)] bg-[size:250%_250%] animate-[shimmer_3s_infinite]"></div>
            <Sparkles size={16} className="text-yellow-400 animate-pulse" />
            <span className="tracking-wider text-sm">{state.profile.totalPixels.toLocaleString()}</span>
            <span className="text-[10px] text-amber-400/90 font-sans font-extrabold">PX</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 relative z-10 flex flex-col items-center">
        {activeGameId ? (
          /* Active Game View wrapper */
          <div className="w-full max-w-2xl flex flex-col items-center py-4">
            <div className={`w-full bg-gradient-to-b p-4 rounded-3xl border-4 ${activeSkinObj.theme} transition-all duration-300`}>
              <div className="relative rounded-2xl bg-slate-950 p-2 sm:p-4 overflow-hidden border border-slate-900">
                {renderActiveGame()}
              </div>
            </div>
            <div className="w-full max-w-xl h-4 bg-slate-900 border-x-4 border-b-4 border-slate-800 rounded-b-xl shadow-[0_4px_10px_rgba(0,0,0,0.5)]"></div>
          </div>
        ) : (
          /* Dashboard Home View */
          <div className="w-full">
            {/* Quick Hero panel */}
            <section className="mb-10 text-center relative py-12 px-6 bg-slate-900/40 rounded-3xl border border-slate-900 max-w-4xl mx-auto overflow-hidden">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

              <span className="font-mono text-[9px] tracking-widest text-cyan-400 font-black uppercase bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded-full">
                SÉLECTIONNE TA BORNE DE JEU
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 mt-3 font-sans tracking-tight">
                Plongez dans l'arcade rétro ultime
              </h2>
              <p className="text-slate-400 text-sm max-w-lg mx-auto mt-2 font-mono">
                Gagnez des <span className="text-yellow-400 font-bold">Pixels (PX)</span> à chaque partie, remplissez vos quêtes et débloquez de superbes styles de bornes !
              </p>

              {/* Stats Summary */}
              <div className="flex justify-center gap-6 mt-8 font-mono text-center text-xs">
                <div>
                  <p className="text-slate-500 text-[10px]">TOTAL JEUX</p>
                  <p className="text-lg font-bold text-cyan-400">22 Mini-Jeux</p>
                </div>
                <div className="w-[1px] bg-slate-800"></div>
                <div>
                  <p className="text-slate-500 text-[10px]">PARTIES JOUÉES</p>
                  <p className="text-lg font-bold text-purple-400">
                    {(Object.values(state.stats) as GameStats[]).reduce((acc, curr) => acc + curr.plays, 0)}
                  </p>
                </div>
                <div className="w-[1px] bg-slate-800"></div>
                <div>
                  <p className="text-slate-500 text-[10px]">SUCCÈS</p>
                  <p className="text-lg font-bold text-yellow-400">
                    {state.achievements.filter(a => a.isUnlocked).length} / {state.achievements.length}
                  </p>
                </div>
              </div>
            </section>

            {/* Category Filters */}
            <div className="flex justify-center gap-2 mb-8 flex-wrap">
              {['all', 'clicker', 'memory', 'reflex', 'arcade', 'puzzle'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => { audio.playClick(); setSelectedCategory(cat); }}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900/60 border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800'
                  }`}
                >
                  {cat === 'all' && 'TOUS LES JEUX'}
                  {cat === 'clicker' && 'CLICKER'}
                  {cat === 'memory' && 'MÉMORISATION'}
                  {cat === 'reflex' && 'RÉFLEXES'}
                  {cat === 'arcade' && 'ARCADE'}
                  {cat === 'puzzle' && 'ÉNIGME / MATH'}
                </button>
              ))}
            </div>

            {/* Grid display of 22 games */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredGames.map((game) => {
                const gamePlayCount = state.stats[game.id]?.plays || 0;
                const gameHighScore = state.stats[game.id]?.highScore || 0;

                let rarityBadge = { label: 'COMMUN', class: 'bg-slate-800 text-slate-300 border-slate-700' };
                if (game.rarity === 'rare') rarityBadge = { label: 'RARE', class: 'bg-purple-950 text-purple-300 border-purple-700' };
                if (game.rarity === 'epique') rarityBadge = { label: 'ÉPIQUE', class: 'bg-amber-950 text-amber-300 border-amber-700' };
                if (game.rarity === 'divin') rarityBadge = { label: 'DIVIN', class: 'bg-yellow-950 text-yellow-300 border-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.3)]' };
                if (game.rarity === 'mythique') rarityBadge = { label: 'MYTHIQUE', class: 'bg-rose-950 text-rose-300 border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)] animate-pulse' };

                return (
                  <div
                    key={game.id}
                    className={`relative p-5 rounded-2xl border bg-slate-900/40 flex flex-col justify-between overflow-hidden group hover:scale-[1.02] transition-all duration-300 ${game.color}`}
                  >
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-current opacity-80 animate-ping"></div>

                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/60 text-current">
                            {renderIcon(game.icon, "w-5 h-5")}
                          </div>
                          <div>
                            <h3 className="font-sans font-extrabold text-base tracking-wide text-slate-100 group-hover:text-cyan-300 transition-colors">
                              {game.frenchName}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[9px] font-mono font-bold uppercase opacity-75">
                                {game.difficulty}
                              </span>
                              <span className={`text-[8px] font-mono font-black px-1.5 py-0.5 rounded border ${rarityBadge.class}`}>
                                {rarityBadge.label}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-slate-400 text-xs mt-1 leading-relaxed min-h-[48px]">
                        {game.description}
                      </p>
                    </div>

                    {/* Footer Score stats and play button */}
                    <div className="border-t border-slate-900/80 pt-3 mt-4 flex items-center justify-between gap-3">
                      <div className="font-mono text-[10px] text-slate-400">
                        <p>Parties: <span className="font-bold text-slate-200">{gamePlayCount}</span></p>
                        <p>Record: <span className="font-bold text-yellow-400">{gameHighScore} PX</span></p>
                      </div>

                      <button
                        onClick={() => handleLaunchGame(game.id)}
                        className="flex items-center gap-2 bg-gradient-to-b from-yellow-400 to-amber-500 hover:from-yellow-350 hover:to-amber-400 text-slate-950 font-sans text-xs font-black py-2.5 px-5 rounded-xl border-b-4 border-amber-700 active:border-b-0 active:translate-y-[2px] transition-all shadow-[0_4px_10px_rgba(234,179,8,0.3)] hover:shadow-[0_6px_15px_rgba(234,179,8,0.5)] cursor-pointer tracking-wider font-extrabold uppercase"
                      >
                        <PlayCircle size={15} className="animate-pulse text-slate-950" /> JOUER
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* --- Profile Customization Modal --- */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-cyan-500 p-6 rounded-2xl w-full max-w-xl font-mono text-white relative max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                👤 PERSONNALISATION DU PROFIL VERTEX
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm"
              >
                ✕ FERMER
              </button>
            </div>

            {/* Live Profile Banner & Avatar Preview */}
            {(() => {
              const previewBannerObj = TITLE_BANNERS.find(b => b.id === selectedBannerInput) || TITLE_BANNERS[0];
              const previewAuraObj = AURA_COSMETICS.find(a => a.id === selectedAuraInput) || AURA_COSMETICS[0];
              const previewColorHex = AVATAR_COLORS.find(c => c.id === selectedAvatarColorInput)?.hex || '#06b6d4';

              return (
                <div className={`relative mb-4 p-5 rounded-xl border border-slate-700 text-center overflow-hidden shadow-2xl transition-all duration-300 ${previewBannerObj.gradient}`}>
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:1rem_1rem]"></div>
                  
                  <div className="flex flex-col items-center relative z-10">
                    {/* Avatar Frame with Active Aura Glow */}
                    <div className="relative mb-2">
                      <div
                        className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center relative shadow-2xl transition-all duration-300 ${previewAuraObj.glowClass}`}
                        style={{ backgroundColor: previewColorHex }}
                      >
                        {renderIcon(selectedAvatarIconInput, "w-10 h-10 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]")}
                      </div>
                      {selectedAuraInput !== 'none' && (
                        <span className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 bg-purple-950 text-purple-300 border border-purple-500/80 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-lg whitespace-nowrap">
                          {previewAuraObj.name}
                        </span>
                      )}
                    </div>

                    <p className="font-sans font-black text-xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mt-1">
                      {usernameInput || 'PLAYER_ONE'}
                    </p>
                    <p className="text-[11px] text-yellow-300 font-black uppercase tracking-wider bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg border border-yellow-500/50 mt-1 shadow-md">
                      🎖️ {selectedTitleInput}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Customization Tabs */}
            <div className="flex gap-1.5 mb-4 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setProfileTab('identity')}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${profileTab === 'identity' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
              >
                🏷️ Pseudo & Titre
              </button>
              <button
                onClick={() => setProfileTab('auras')}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${profileTab === 'auras' ? 'bg-purple-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
              >
                ✨ Aura ({(state.profile.unlockedAuras || ['none']).length})
              </button>
              <button
                onClick={() => setProfileTab('banners')}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${profileTab === 'banners' ? 'bg-rose-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
              >
                🎨 Bannière ({(state.profile.unlockedBanners || ['banner_neon']).length})
              </button>
              <button
                onClick={() => setProfileTab('avatar')}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${profileTab === 'avatar' ? 'bg-yellow-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
              >
                🎭 Avatar
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {/* TAB 1: IDENTITY (Pseudo + Titre) */}
              {profileTab === 'identity' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-300 font-bold block mb-1.5 uppercase">
                      PSEUDONYME DU JOUEUR :
                    </label>
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      maxLength={16}
                      placeholder="Entre ton pseudo..."
                      className="w-full bg-slate-900 border-2 border-slate-800 rounded-xl px-3 py-2 text-sm text-cyan-300 font-bold focus:outline-none focus:border-cyan-400 shadow-inner"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs text-slate-300 font-bold uppercase">
                        TITRE ÉQUIPÉ :
                      </label>
                      <button
                        onClick={() => { setShowProfileModal(false); setShopTab('titles'); setShowShopModal(true); }}
                        className="text-[10px] text-amber-400 hover:underline font-bold cursor-pointer"
                      >
                        + Acheter plus de titres dans la boutique 🛒
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(state.profile.unlockedTitles || ['DÉBUTANT']).map((t) => {
                        const isSelected = selectedTitleInput === t;
                        return (
                          <button
                            key={t}
                            onClick={() => setSelectedTitleInput(t)}
                            className={`p-2.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${isSelected ? 'bg-amber-950/60 border-yellow-400 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.3)]' : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                          >
                            <span className="font-bold text-xs uppercase">{t}</span>
                            {isSelected && <span className="text-[10px] bg-yellow-400 text-slate-950 px-2 py-0.5 rounded font-black">ACTIF</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: AURAS & EXPLICATION */}
              {profileTab === 'auras' && (
                <div className="space-y-4">
                  {/* Aura Explanation Card */}
                  <div className="bg-purple-950/40 p-3.5 rounded-xl border border-purple-500/50 text-xs leading-relaxed space-y-1.5">
                    <p className="font-bold text-purple-300 flex items-center gap-1.5 text-sm">
                      ✨ Qu'est-ce qu'une Aura dans Vertex Arcades ?
                    </p>
                    <p className="text-slate-300 text-[11px]">
                      Une <strong className="text-purple-300">Aura</strong> est un champ de force lumineux holographique (Solaire, Cyber, Quantique, Royale, Matrix, Plasma) qui entoure le cadre de ton avatar.
                    </p>
                    <p className="text-slate-400 text-[10px] italic">
                      💡 <strong className="text-white">Fonctionnalité complète :</strong> Elle s'anime en temps réel et illumine ton avatar dans la barre supérieure, sur ton profil, dans la boutique et sur tes victoires !
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs text-slate-300 font-bold uppercase">
                        VOS AURAS DÉBLOQUÉES :
                      </label>
                      <button
                        onClick={() => { setShowProfileModal(false); setShopTab('auras'); setShowShopModal(true); }}
                        className="text-[10px] text-purple-400 hover:underline font-bold cursor-pointer"
                      >
                        + Boutique d'Auras 🛒
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {AURA_COSMETICS.filter(a => (state.profile.unlockedAuras || ['none']).includes(a.id)).map((a) => {
                        const isSelected = selectedAuraInput === a.id;
                        return (
                          <div
                            key={a.id}
                            onClick={() => setSelectedAuraInput(a.id)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${isSelected ? 'bg-purple-950/70 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center bg-slate-950 ${a.glowClass}`}>
                                <Zap size={14} className="text-white" />
                              </div>
                              <div>
                                <p className="font-bold text-xs text-slate-100">{a.name}</p>
                                <p className="text-[10px] text-slate-400">{a.desc || 'Effet visuel d\'aura'}</p>
                              </div>
                            </div>
                            {isSelected ? (
                              <span className="text-[10px] bg-purple-500 text-slate-950 px-2.5 py-1 rounded-lg font-black uppercase">ÉQUIPÉE</span>
                            ) : (
                              <button className="text-[10px] bg-slate-800 hover:bg-slate-700 text-purple-300 px-2.5 py-1 rounded-lg font-bold uppercase">ÉQUIPER</button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BANNIÈRES */}
              {profileTab === 'banners' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-slate-300 font-bold uppercase">
                      VOS BANNIÈRES DE PROFIL :
                    </label>
                    <button
                      onClick={() => { setShowProfileModal(false); setShopTab('banners'); setShowShopModal(true); }}
                      className="text-[10px] text-rose-400 hover:underline font-bold cursor-pointer"
                    >
                      + Boutique de Bannières 🛒
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {TITLE_BANNERS.filter(b => (state.profile.unlockedBanners || ['banner_neon']).includes(b.id)).map((b) => {
                      const isSelected = selectedBannerInput === b.id;
                      return (
                        <div
                          key={b.id}
                          onClick={() => setSelectedBannerInput(b.id)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-rose-400 ring-2 ring-rose-500/50 shadow-lg' : 'border-slate-800 opacity-80 hover:opacity-100'}`}
                        >
                          <div className={`h-12 rounded-lg ${b.gradient} flex items-center justify-center font-bold text-xs text-white shadow-inner mb-2`}>
                            {b.name}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 font-bold">Bannière</span>
                            {isSelected ? (
                              <span className="text-[9px] bg-rose-500 text-slate-950 px-2 py-0.5 rounded font-black uppercase">SÉLECTIONNÉE</span>
                            ) : (
                              <span className="text-[9px] text-rose-400 font-bold uppercase">CHOISIR</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: AVATAR (COULEUR & ICÔNE) */}
              {profileTab === 'avatar' && (
                <div className="space-y-4">
                  {/* Colors */}
                  <div>
                    <label className="text-xs text-slate-300 font-bold block mb-2 uppercase">
                      COULEUR D'AVATAR :
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {AVATAR_COLORS.filter(c => (state.profile.unlockedColors || ['cyan']).includes(c.id)).map(col => (
                        <button
                          key={col.id}
                          onClick={() => setSelectedAvatarColorInput(col.id)}
                          className={`w-10 h-10 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-center ${selectedAvatarColorInput === col.id ? 'scale-110 border-white shadow-[0_0_12px_rgba(255,255,255,0.8)]' : 'border-transparent opacity-75 hover:opacity-100'}`}
                          style={{ backgroundColor: col.hex }}
                        >
                          {selectedAvatarColorInput === col.id && <span className="text-white text-xs font-black">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Icons */}
                  <div>
                    <label className="text-xs text-slate-300 font-bold block mb-2 uppercase">
                      ICÔNE D'AVATAR :
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {AVATAR_ICONS.map((iconName) => {
                        const isSelected = selectedAvatarIconInput === iconName;
                        return (
                          <button
                            key={iconName}
                            onClick={() => setSelectedAvatarIconInput(iconName)}
                            className={`p-3 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${isSelected ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
                          >
                            {renderIcon(iconName, "w-6 h-6")}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-4 border-t border-slate-800 pt-3">
              <button
                onClick={saveProfile}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black py-3 rounded-xl text-xs uppercase cursor-pointer shadow-lg tracking-wider"
              >
                💾 ENREGISTRER LA PERSONNALISATION
              </button>
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold py-3 rounded-xl text-xs uppercase cursor-pointer border border-slate-800"
              >
                ANNULER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Shop Modal (Skins, Auras, Titles, Banners) --- */}
      {showShopModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-cyan-500 p-6 rounded-2xl w-full max-w-2xl font-mono text-white relative max-h-[85vh] flex flex-col">
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
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setShopTab('skins')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${shopTab === 'skins' ? 'bg-cyan-950 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                🕹️ CHÂSSIS ({CABINET_SKINS.length})
              </button>
              <button
                onClick={() => setShopTab('auras')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${shopTab === 'auras' ? 'bg-purple-950 border-purple-400 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                ✨ AURAS ({AURA_COSMETICS.length})
              </button>
              <button
                onClick={() => setShopTab('titles')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${shopTab === 'titles' ? 'bg-amber-950 border-amber-400 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                🎖️ TITRES
              </button>
              <button
                onClick={() => setShopTab('banners')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${shopTab === 'banners' ? 'bg-rose-950 border-rose-400 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
              >
                🎨 BANNIÈRES
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
                          <p className="font-bold text-sm text-slate-200">{skin.name}</p>
                          <p className="text-[10px] text-slate-400 mt-1">Transforme le thème complet de votre borne.</p>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
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
                <div className="space-y-3">
                  <div className="bg-purple-950/40 p-3.5 rounded-xl border border-purple-500/50 text-xs leading-relaxed space-y-1">
                    <p className="font-bold text-purple-300 flex items-center gap-1.5">
                      <Sparkles size={16} className="text-purple-400" /> Qu'est-ce qu'une Aura Holographique ?
                    </p>
                    <p className="text-slate-300 text-[11px]">
                      L'<strong>Aura</strong> est un rayonnement néon et d'ondes plasma autour du cadre de votre avatar. Elle illumine votre présence en haut de l'écran, sur votre profil et lors de vos victoires !
                    </p>
                  </div>

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
                              <p className="text-[10px] text-slate-400">{aura.desc || 'Effet visuel d\'aura'}</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-2 border-t border-slate-800/80 pt-2">
                            <span className="text-xs text-yellow-400 font-bold">{aura.cost === 0 ? 'GRATUIT' : `${aura.cost} PX`}</span>
                            {isActive ? (
                              <span className="text-[10px] bg-purple-950 text-purple-400 px-2.5 py-1 rounded border border-purple-800 font-bold">ÉQUIPÉ</span>
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
                </div>
              )}

              {shopTab === 'titles' && (
                <div className="space-y-2">
                  {PURCHASABLE_TITLES.map((t) => {
                    const isUnlocked = (state.profile.unlockedTitles || ['DÉBUTANT']).includes(t.id);
                    const isActive = state.profile.title === t.id;

                    return (
                      <div key={t.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm text-yellow-400">{t.id}</p>
                          <p className="text-[10px] text-slate-400">{t.desc}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-yellow-400 font-bold">{t.cost} PX</span>
                          {isActive ? (
                            <span className="text-[10px] bg-amber-950 text-amber-400 px-2 py-1 rounded border border-amber-800 font-bold">ÉQUIPÉ</span>
                          ) : isUnlocked ? (
                            <button onClick={() => equipTitle(t.id)} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded text-amber-300 cursor-pointer font-bold">ÉQUIPER</button>
                          ) : (
                            <button onClick={() => buyTitle(t.id, t.cost)} className="text-xs bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-3 py-1 rounded font-bold cursor-pointer">ACHETER</button>
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
                        <div className={`h-12 rounded-lg mb-2 ${b.gradient} flex items-center justify-center font-bold text-xs text-white shadow-md`}>
                          {b.name}
                        </div>
                        <div className="flex justify-between items-center">
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
            </div>
          </div>
        </div>
      )}

      {/* --- Tournois (Tournaments) Modal --- */}
      {showTournamentsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
          <div className="bg-slate-950 border-2 border-amber-500 p-6 rounded-2xl w-full max-w-lg text-white relative text-center">
            <div className="inline-block p-3 bg-amber-950/40 rounded-full border border-amber-500 mb-3 animate-bounce">
              <Calendar size={32} className="text-amber-400" />
            </div>
            <h3 className="text-2xl font-black text-amber-400 uppercase tracking-widest mb-1">
              TOURNOIS VERTEX ARCADE
            </h3>
            <span className="inline-block px-3 py-1 bg-rose-950 text-rose-400 border border-rose-500 text-xs font-black uppercase tracking-widest rounded-full mb-4">
              PROCHAINEMENT / À VENIR
            </span>

            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto mb-6">
              La Saison 1 des Tournois Officiels Vertex débarque très bientôt ! Affrontez les meilleurs joueurs en temps réel dans des compétitions sur élimination directe.
            </p>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 mb-6 text-left space-y-2">
              <p className="text-xs text-yellow-400 font-bold">🏆 RÉCOMPENSES DU PREMIER TOURNOI :</p>
              <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                <li><span className="text-amber-400 font-bold">1er Place :</span> +10,000 PX + Titre Exclusif "CHAMPION DU MONDE 🥇"</li>
                <li><span className="text-slate-300 font-bold">2ème Place :</span> +5,000 PX + Titre "VICE-CHAMPION 🥈"</li>
                <li><span className="text-amber-600 font-bold">3ème Place :</span> +2,500 PX + Titre "LÉGENDE D'ARGENT 🥉"</li>
              </ul>
            </div>

            <button
              onClick={() => setShowTournamentsModal(false)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-8 rounded-xl text-xs uppercase cursor-pointer"
            >
              COMPRIS !
            </button>
          </div>
        </div>
      )}

      {/* --- Quests Modal --- */}
      {showQuestsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
          <div className="bg-slate-950 border-2 border-emerald-500 p-6 rounded-2xl w-full max-w-xl text-white relative max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Target size={20} /> QUÊTES ET DÉFIS
              </h3>
              <button onClick={() => setShowQuestsModal(false)} className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm">
                ✕ FERMER
              </button>
            </div>

            <div className="flex justify-between items-center mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-300">Accomplissez vos défis pour gagner des PX et de l'XP !</p>
              <button
                onClick={rotateQuests}
                className="flex items-center gap-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-xs px-3 py-1.5 rounded-lg border border-emerald-800 font-bold cursor-pointer"
              >
                <RefreshCw size={12} /> NOUVELLES QUÊTES
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {(state.quests || INITIAL_QUESTS).map((q) => (
                <div key={q.id} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-200">{q.title}</p>
                    <p className="text-[11px] text-slate-400">{q.description}</p>
                    <div className="w-full bg-slate-950 h-2 rounded-full mt-2 overflow-hidden border border-slate-800">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (q.current / q.target) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-[9px] text-slate-500 mt-0.5">{q.current} / {q.target}</p>
                  </div>

                  <div>
                    {q.isClaimed ? (
                      <span className="text-[10px] text-slate-500 font-bold uppercase">RÉCLAMÉE</span>
                    ) : q.isCompleted ? (
                      <button
                        onClick={() => claimQuest(q.id)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-1.5 px-3 rounded-lg cursor-pointer uppercase animate-pulse"
                      >
                        RÉCLAMER (+{q.rewardPixels} PX)
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-bold uppercase">EN COURS</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- Pass Arcade Modal (50 Levels) --- */}
      {showPassModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
          <div className="bg-slate-950 border-2 border-rose-500 p-6 rounded-2xl w-full max-w-2xl text-white relative max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <Flame size={20} className="animate-bounce" /> PASS ARCADE 50 NIVEAUX
              </h3>
              <button onClick={() => setShowPassModal(false)} className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm">
                ✕ FERMER
              </button>
            </div>

            {/* Pass status */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 mb-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-rose-300">NIVEAU {state.arcadePass?.level || 1} / 50</p>
                <p className="text-xs text-slate-400 mt-0.5">XP: {state.arcadePass?.xp || 0} / 100</p>
              </div>

              {!state.arcadePass?.isPremium && (
                <button
                  onClick={buyPremiumPass}
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs py-2 px-4 rounded-xl shadow-md hover:scale-105 transition-transform cursor-pointer uppercase"
                >
                  DEVENIR ÉLITE PREMIUM (600 PX)
                </button>
              )}
            </div>

            {/* 50 Levels List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {PASS_LEVELS.map((pl) => {
                const isCurrentLvl = (state.arcadePass?.level || 1) >= pl.level;
                const freeClaimed = (state.arcadePass?.claimedFreeRewards || []).includes(pl.level);
                const premiumClaimed = (state.arcadePass?.claimedPremiumRewards || []).includes(pl.level);

                return (
                  <div key={pl.level} className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${isCurrentLvl ? 'bg-slate-900 border-rose-800' : 'bg-slate-950 border-slate-900 opacity-60'}`}>
                    <div className="w-12 text-center">
                      <span className="text-xs font-black text-rose-400">NIV.{pl.level}</span>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
                      {/* Free Track */}
                      <div className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] text-slate-500 block font-bold">GRATUIT</span>
                          <span className="text-slate-200 font-bold text-[11px]">{pl.freeReward.label}</span>
                        </div>
                        {isCurrentLvl && !freeClaimed && (
                          <button onClick={() => claimPassReward(pl.level, 'free')} className="bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-1 rounded cursor-pointer uppercase">OBTENIR</button>
                        )}
                      </div>

                      {/* Premium Track */}
                      <div className="bg-amber-950/30 p-2 rounded border border-amber-900/50 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] text-amber-400 block font-bold">ÉLITE PREMIUM</span>
                          <span className="text-amber-300 font-bold text-[11px]">{pl.premiumReward.label}</span>
                        </div>
                        {isCurrentLvl && state.arcadePass?.isPremium && !premiumClaimed && (
                          <button onClick={() => claimPassReward(pl.level, 'premium')} className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-1 rounded cursor-pointer uppercase">OBTENIR</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- Achievements Modal (50 Achievements) --- */}
      {showAchievementsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
          <div className="bg-slate-950 border-2 border-purple-500 p-6 rounded-2xl w-full max-w-2xl text-white relative max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                <Medal size={20} /> SUCCÈS (50 SUCCÈS)
              </h3>
              <button onClick={() => setShowAchievementsModal(false)} className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm">
                ✕ FERMER
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {state.achievements.map((ach) => (
                <div key={ach.id} className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${ach.isUnlocked ? 'bg-purple-950/30 border-purple-800' : 'bg-slate-900/50 border-slate-900 opacity-60'}`}>
                  <div>
                    <p className="font-bold text-sm text-slate-200">{ach.frenchTitle}</p>
                    <p className="text-[11px] text-slate-400">{ach.frenchDescription}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-yellow-400 font-bold">+{ach.pixelReward} PX</span>
                    <p className="text-[10px] font-bold uppercase mt-0.5">{ach.isUnlocked ? <span className="text-emerald-400">DÉBLOQUÉ ✓</span> : <span className="text-slate-500">VERROUILLÉ</span>}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- Stats Modal --- */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
          <div className="bg-slate-950 border-2 border-yellow-500 p-6 rounded-2xl w-full max-w-md text-white relative max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-yellow-400 uppercase tracking-widest flex items-center gap-2">
                <Trophy size={20} /> VOS STATISTIQUES
              </h3>
              <button onClick={() => setShowStatsModal(false)} className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm">
                ✕ FERMER
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {GAMES_LIST.map((game) => {
                const st = state.stats[game.id] || { plays: 0, highScore: 0 };
                return (
                  <div key={game.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-xs text-slate-200">{game.frenchName}</p>
                      <p className="text-[10px] text-slate-500">Parties : {st.plays}</p>
                    </div>
                    <span className="text-xs text-yellow-400 font-bold">{st.highScore} PX</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
