import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap, Brain, Target, Play, Grid, Layers, Shield, Cpu, Sword, PlusCircle, Grid3X3, Sparkles, Award, Trophy, User, ShoppingBag, Settings, Volume2, VolumeX, Medal, Flame, PlayCircle, Eye, Info, Check, Lock
} from 'lucide-react';

import { audio } from './utils/audio';
import { GlobalState, GameStats, Achievement, Quest, ArcadePass } from './types';
import { GAMES_LIST, CABINET_SKINS, INITIAL_ACHIEVEMENTS, INITIAL_QUESTS, PASS_LEVELS } from './gamesData';

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
  { id: 'NÉON GOD', cost: 500, desc: 'Pour les divinités du rétro' },
  { id: 'VERTEX EMPEREUR', cost: 750, desc: 'Pour les monarques absolus du Vertex' },
  { id: 'SANS RETOUR', cost: 350, desc: 'Pour ceux qui ne reculent devant rien' },
  { id: 'CHASSEUR DE PIXELS', cost: 200, desc: 'Pour les collectionneurs d\'élite' }
];

export default function App() {
  // Load initial global state from localStorage
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
    
    // Default fallback state
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
          unlockedColors: ['cyan', 'pink', 'purple', 'emerald', 'yellow', 'plasma_violet']
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

    // Dynamic schema upgrade for existing saves
    if (!parsed.profile.title) {
      parsed.profile.title = 'DÉBUTANT';
    }
    if (!parsed.profile.unlockedTitles) {
      parsed.profile.unlockedTitles = ['DÉBUTANT'];
    }
    if (!parsed.profile.unlockedColors) {
      parsed.profile.unlockedColors = ['cyan', 'pink', 'purple', 'emerald', 'yellow', 'plasma_violet'];
    }
    if (!parsed.profile.unlockedColors.includes('plasma_violet')) {
      parsed.profile.unlockedColors.push('plasma_violet');
    }
    if (!parsed.achievements) {
      parsed.achievements = INITIAL_ACHIEVEMENTS;
    } else {
      INITIAL_ACHIEVEMENTS.forEach(initialAch => {
        const hasAch = parsed.achievements.some((a: any) => a.id === initialAch.id);
        if (!hasAch) {
          parsed.achievements.push({ ...initialAch });
        }
      });
    }
    if (!parsed.quests || parsed.quests.length === 0) {
      parsed.quests = INITIAL_QUESTS;
    } else {
      INITIAL_QUESTS.forEach(initialQuest => {
        const hasQuest = parsed.quests.some((q: any) => q.id === initialQuest.id);
        if (!hasQuest) {
          parsed.quests.push({ ...initialQuest });
        }
      });
    }
    if (!parsed.stats) {
      parsed.stats = {};
    }
    GAMES_LIST.forEach(g => {
      if (!parsed.stats[g.id]) {
        parsed.stats[g.id] = { plays: 0, highScore: 0 };
      }
    });
    if (!parsed.arcadePass) {
      parsed.arcadePass = {
        level: 1,
        xp: 0,
        isPremium: false,
        claimedFreeRewards: [],
        claimedPremiumRewards: []
      };
    }

    return parsed;
  });

  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [soundOn, setSoundOn] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSkinsModal, setShowSkinsModal] = useState(false);
  const [shopTab, setShopTab] = useState<'skins' | 'titles'>('skins');
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showQuestsModal, setShowQuestsModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [leaderboardShowSolo, setLeaderboardShowSolo] = useState(true);
  const [usernameInput, setUsernameInput] = useState(state.profile.username);
  const [selectedTitleInput, setSelectedTitleInput] = useState(state.profile.title || 'DÉBUTANT');
  const [selectedAvatarColorInput, setSelectedAvatarColorInput] = useState(state.profile.avatarColor);
  const [selectedAvatarIconInput, setSelectedAvatarIconInput] = useState(state.profile.avatarIcon || 'Crown');
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // Sync profile edits when modal opens
  useEffect(() => {
    if (showProfileModal) {
      setUsernameInput(state.profile.username);
      setSelectedTitleInput(state.profile.title || 'DÉBUTANT');
      setSelectedAvatarColorInput(state.profile.avatarColor);
      setSelectedAvatarIconInput(state.profile.avatarIcon || 'Crown');
    }
  }, [showProfileModal, state.profile]);

  // Synchronize state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vertex_arcades_state', JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save state to localStorage", e);
    }
  }, [state]);

  const toggleSound = () => {
    const enabled = audio.toggleSound();
    setSoundOn(enabled);
  };

  const renderIcon = (iconName: string, className?: string) => {
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
      default: return <Sparkles className={className} />;
    }
  };

  const handleScore = (earnedPixels: number) => {
    setState(prev => {
      const nextPixels = prev.profile.totalPixels + earnedPixels;
      const nextProfile = { ...prev.profile, totalPixels: nextPixels };
      
      // Real-time achievement check (First Pixel)
      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === 'ach1' && !ach.isUnlocked && nextPixels > 0) {
          triggerNotification(ach);
          return { ...ach, isUnlocked: true };
        }
        return ach;
      });

      // Update quests progress for pixels_earned
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

  const triggerNotification = (ach: Achievement) => {
    audio.playWin();
    setActiveNotification(`🏆 SUCCÈS DÉVERROUILLÉ : ${ach.frenchTitle} (+${ach.pixelReward} PX) !`);
    setTimeout(() => {
      setActiveNotification(null);
    }, 4500);
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

      // Check achievements for specific games
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

        if (shouldUnlock && !ach.isUnlocked) {
          triggerNotification(ach);
          extraPixels += ach.pixelReward;
          return { ...ach, isUnlocked: true };
        }
        return ach;
      });

      // Update Quests for game over
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
        avatarIcon: selectedAvatarIconInput
      }
    }));
    setShowProfileModal(false);
  };

  const setAvatarColor = (colorId: string) => {
    audio.playClick();
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        avatarColor: colorId
      }
    }));
  };

  const claimQuest = (questId: string) => {
    audio.playCoin();
    setState(prev => {
      const quest = (prev.quests || INITIAL_QUESTS).find(q => q.id === questId);
      if (!quest || !quest.isCompleted || quest.isClaimed) return prev;

      const updatedQuests = (prev.quests || INITIAL_QUESTS).map(q => {
        if (q.id === questId) {
          return { ...q, isClaimed: true };
        }
        return q;
      });

      let nextPixels = prev.profile.totalPixels + quest.rewardPixels;
      let nextPass = { ...(prev.arcadePass || { level: 1, xp: 0, isPremium: false, claimedFreeRewards: [], claimedPremiumRewards: [] }) };
      
      nextPass.xp += quest.rewardXp;
      
      let levelUps = 0;
      while (nextPass.xp >= 100 && nextPass.level < 10) {
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
        profile: {
          ...prev.profile,
          totalPixels: nextPixels
        },
        quests: updatedQuests,
        arcadePass: nextPass
      };
    });
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
          profile: {
            ...prev.profile,
            totalPixels: prev.profile.totalPixels - cost
          },
          arcadePass: nextPass
        };
      });
      setActiveNotification(`💎 PASS ELITE PREMIUM ACTIVÉ ! Amuse-toi bien !`);
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

      // Deep copy profile
      const nextProfile = { ...prev.profile };
      
      if (reward.type === 'pixels') {
        nextProfile.totalPixels += (reward.value as number);
      } else if (reward.type === 'title') {
        const titleVal = reward.value as string;
        const unlockedTitles = nextProfile.unlockedTitles || ['DÉBUTANT'];
        if (!unlockedTitles.includes(titleVal)) {
          nextProfile.unlockedTitles = [...unlockedTitles, titleVal];
        }
        nextProfile.title = titleVal;
      } else if (reward.type === 'skin') {
        const skinVal = reward.value as string;
        const unlockedSkins = nextProfile.unlockedSkins || ['neon'];
        if (!unlockedSkins.includes(skinVal)) {
          nextProfile.unlockedSkins = [...unlockedSkins, skinVal];
        }
        nextProfile.activeSkin = skinVal;
      } else if (reward.type === 'color') {
        const colorVal = reward.value as string;
        const unlockedColors = nextProfile.unlockedColors || ['cyan', 'pink', 'purple', 'emerald', 'yellow'];
        if (!unlockedColors.includes(colorVal)) {
          nextProfile.unlockedColors = [...unlockedColors, colorVal];
        }
        nextProfile.avatarColor = colorVal;
      }

      const nextPass = { ...pass };
      if (track === 'free') {
        nextPass.claimedFreeRewards = [...pass.claimedFreeRewards, lvl];
      } else {
        nextPass.claimedPremiumRewards = [...pass.claimedPremiumRewards, lvl];
      }

      setTimeout(() => {
        audio.playWin();
        setActiveNotification(`🎁 RÉCOMPENSE DU PASS OBTENUE : ${reward.label} !`);
        setTimeout(() => setActiveNotification(null), 4000);
      }, 100);

      return {
        ...prev,
        profile: nextProfile,
        arcadePass: nextPass
      };
    });
  };

  const refreshQuests = () => {
    const cost = 50;
    if (state.profile.totalPixels >= cost) {
      audio.playWin();
      setState(prev => {
        // Re-seed all quests with current counts at 0
        const resetQuests = INITIAL_QUESTS.map(q => ({
          ...q,
          current: 0,
          isCompleted: false,
          isClaimed: false
        }));
        return {
          ...prev,
          profile: {
            ...prev.profile,
            totalPixels: prev.profile.totalPixels - cost
          },
          quests: resetQuests
        };
      });
      setActiveNotification(`🔄 QUÊTES RÉGÉNÉRÉES ! (-${cost} PX)`);
      setTimeout(() => setActiveNotification(null), 4000);
    } else {
      audio.playHit();
      setActiveNotification(`⚠️ Erreur: Il te faut ${cost} PX pour réinitialiser les quêtes !`);
      setTimeout(() => setActiveNotification(null), 4000);
    }
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
      profile: {
        ...prev.profile,
        activeSkin: skinId
      }
    }));
  };

  const buyTitle = (titleId: string, cost: number) => {
    if (state.profile.totalPixels >= cost) {
      audio.playWin();
      setState(prev => {
        const unlockedTitles = prev.profile.unlockedTitles || ['DÉBUTANT'];
        const nextUnlocked = unlockedTitles.includes(titleId) ? unlockedTitles : [...unlockedTitles, titleId];
        
        // Also check achievement ach13 (Title Unlocked)
        const updatedAchievements = prev.achievements.map(ach => {
          if (ach.id === 'ach13' && !ach.isUnlocked) {
            return { ...ach, isUnlocked: true };
          }
          return ach;
        });

        // If achievement got unlocked, grant extra rewards
        let bonusPixels = 0;
        const targetAch = prev.achievements.find(a => a.id === 'ach13');
        if (targetAch && !targetAch.isUnlocked) {
          bonusPixels = targetAch.pixelReward;
        }

        return {
          ...prev,
          profile: {
            ...prev.profile,
            totalPixels: prev.profile.totalPixels - cost + bonusPixels,
            unlockedTitles: nextUnlocked,
            title: titleId // Equip immediately
          },
          achievements: updatedAchievements
        };
      });
      setActiveNotification(`🎖️ NOUVEAU TITRE ACHETÉ & ÉQUIPÉ : ${titleId} !`);
      setTimeout(() => setActiveNotification(null), 4000);
    } else {
      audio.playHit();
      setActiveNotification(`⚠️ Erreur: Pixels insuffisants pour acheter ce titre !`);
      setTimeout(() => setActiveNotification(null), 4000);
    }
  };

  const equipTitle = (titleId: string) => {
    audio.playClick();
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        title: titleId
      }
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
      case 'clicker':
        return <NeonClicker {...gameProps} />;
      case 'simon':
        return <SimonMemory {...gameProps} />;
      case 'reflex':
        return <ReflexTap {...gameProps} />;
      case 'snake':
        return <RetroSnake {...gameProps} />;
      case 'brick':
        return <BrickBreaker {...gameProps} />;
      case 'stacker':
        return <Stacker {...gameProps} />;
      case 'catch':
        return <ColorCatch {...gameProps} />;
      case 'binary':
        return <BinaryCipher {...gameProps} />;
      case 'tictactoe':
        return <TicTacToe {...gameProps} />;
      case 'math':
        return <MathBlitz {...gameProps} />;
      case 'gridmemory':
        return <GridMemory {...gameProps} />;
      case 'whack':
        return <WhackNode {...gameProps} />;
      case 'invaders':
        return <NeonInvaders {...gameProps} />;
      case 'meteor':
        return <MeteorStorm {...gameProps} />;
      default:
        return (
          <div className="text-center py-10 font-mono text-red-400">
            Jeu non trouvé ou en cours de développement
          </div>
        );
    }
  };

  const activeSkinObj = CABINET_SKINS.find(s => s.id === state.profile.activeSkin) || CABINET_SKINS[0];

  const filteredGames = GAMES_LIST.filter(game => {
    if (selectedCategory === 'all') return true;
    return game.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none relative overflow-x-hidden pb-10">
      {/* Visual background lines (grid) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b1a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b1a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      {/* Retro CRT Scanline overlay effect */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none z-50"></div>

      {/* Achievement and global notification */}
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

      {/* Top Navigation Bar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 rounded-lg blur opacity-40 animate-pulse"></div>
            <div className="relative bg-cyan-950/30 border-2 border-cyan-400 p-2 rounded-lg">
              <Zap className="text-cyan-400 animate-bounce-slow" size={20} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black font-sans tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-rose-400 uppercase drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              Vertex Arcades
            </h1>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">
              14 Jeux Rétro Néon d'Élite
            </p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sounds Toggle */}
          <button
            onClick={toggleSound}
            className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-all cursor-pointer"
            title={soundOn ? 'Muter le son' : 'Activer le son'}
          >
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} className="text-red-400" />}
          </button>

          {/* Quests Button */}
          <button
            onClick={() => { audio.playClick(); setShowQuestsModal(true); }}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-all cursor-pointer text-xs font-mono relative"
          >
            <Target size={14} className="text-emerald-400" /> Quêtes
            {state.quests?.some(q => q.isCompleted && !q.isClaimed) && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            )}
          </button>

          {/* Arcade Pass Button */}
          <button
            onClick={() => { audio.playClick(); setShowPassModal(true); }}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-all cursor-pointer text-xs font-mono relative"
          >
            <Flame size={14} className="text-rose-400 animate-pulse" /> Pass Arcade
            <span className="text-[9px] bg-rose-500/20 text-rose-300 font-bold px-1 py-0.5 rounded border border-rose-500/30">
              Niv.{state.arcadePass?.level || 1}
            </span>
          </button>

          {/* Stats Button */}
          <button
            onClick={() => { audio.playClick(); setShowStatsModal(true); }}
            className="flex items-center gap-1 px-3 py-2.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-all cursor-pointer text-xs font-mono"
          >
            <Trophy size={14} className="text-yellow-400" /> Stats
          </button>

          {/* Classement Button */}
          <button
            onClick={() => { audio.playClick(); setShowLeaderboardModal(true); }}
            className="flex items-center gap-1 px-3 py-2.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-all cursor-pointer text-xs font-mono"
            title="Affiche le classement mondial rétro !"
          >
            <Trophy size={14} className="text-cyan-400 animate-pulse" /> Classement
          </button>

          {/* Achievements Button */}
          <button
            onClick={() => { audio.playClick(); setShowAchievementsModal(true); }}
            className="flex items-center gap-1 px-3 py-2.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-all cursor-pointer text-xs font-mono"
          >
            <Medal size={14} className="text-purple-400" /> Succès
          </button>

          {/* Skins Cabinet Shop Button */}
          <button
            onClick={() => { audio.playClick(); setShowSkinsModal(true); }}
            className="flex items-center gap-1 px-3 py-2.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-all cursor-pointer text-xs font-mono"
          >
            <ShoppingBag size={14} className="text-cyan-400" /> Skins
          </button>

          {/* Profile Quick Setup Button */}
          <button
            onClick={() => { audio.playClick(); setShowProfileModal(true); }}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-slate-100 hover:border-slate-700 transition-all cursor-pointer text-xs font-mono"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: AVATAR_COLORS.find(c => c.id === state.profile.avatarColor)?.hex }}
            />
            <span>{state.profile.username}</span>
          </button>

          {/* Score Counter (Pixels currency) */}
          <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-yellow-950/20 border border-yellow-500/30 text-yellow-400 font-mono text-xs font-extrabold shadow-[0_0_10px_rgba(234,179,8,0.1)]">
            <Sparkles size={14} className="animate-spin-slow" />
            <span>{state.profile.totalPixels} PX</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 relative z-10 flex flex-col items-center">
        {activeGameId ? (
          /* Active Game View wrapper (framed as an arcade cabinet screen) */
          <div className="w-full max-w-2xl flex flex-col items-center py-4">
            <div className={`w-full bg-gradient-to-b p-4 rounded-3xl border-4 ${activeSkinObj.theme} transition-all duration-300`}>
              {/* Internal Cabinet Bezel screen reflection simulation */}
              <div className="relative rounded-2xl bg-slate-950 p-2 sm:p-4 overflow-hidden border border-slate-900">
                {renderActiveGame()}
              </div>
            </div>
            
            {/* Cabinet control deck visual base */}
            <div className="w-full max-w-xl h-4 bg-slate-900 border-x-4 border-b-4 border-slate-800 rounded-b-xl shadow-[0_4px_10px_rgba(0,0,0,0.5)]"></div>
          </div>
        ) : (
          /* Dashboard Home View */
          <div className="w-full">
            {/* Quick Hero panel */}
            <section className="mb-10 text-center relative py-12 px-6 bg-slate-900/40 rounded-3xl border border-slate-900 max-w-4xl mx-auto overflow-hidden">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

              <span className="font-mono text-[9px] tracking-widest text-cyan-400 font-black uppercase bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded-full">
                SÉLECTIONNE TA BORNE DE JEU
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 mt-3 font-sans tracking-tight">
                Plongez dans l'arcade rétro ultime
              </h2>
              <p className="text-slate-400 text-sm max-w-lg mx-auto mt-2 font-mono">
                Gagnez des <span className="text-yellow-400 font-bold">Pixels (PX)</span> à chaque partie, battez vos records et débloquez de superbes styles de bornes !
              </p>

              {/* General Statistics Summary inline */}
              <div className="flex justify-center gap-6 mt-8 font-mono text-center text-xs">
                <div>
                  <p className="text-slate-500 text-[10px]">TOTAL JEUX</p>
                  <p className="text-lg font-bold text-cyan-400">14 Mini-Jeux</p>
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

            {/* Category Filters row */}
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

            {/* Grid display of 12 games */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredGames.map((game) => {
                const gamePlayCount = state.stats[game.id]?.plays || 0;
                const gameHighScore = state.stats[game.id]?.highScore || 0;

                return (
                  <div
                    key={game.id}
                    className={`relative p-5 rounded-2xl border bg-slate-900/30 flex flex-col justify-between overflow-hidden group hover:scale-[1.02] transition-all duration-300 ${game.color}`}
                  >
                    {/* Glowing highlight point */}
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-ping"></div>

                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-slate-950/40 rounded-lg border border-slate-800/40 text-current">
                            {renderIcon(game.icon, "w-5 h-5")}
                          </div>
                          <div>
                            <h3 className="font-sans font-extrabold text-base tracking-wide text-slate-100 group-hover:text-cyan-300 transition-colors">
                              {game.frenchName}
                            </h3>
                            <span className="text-[9px] font-mono font-semibold uppercase opacity-60">
                              {game.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-slate-400 text-xs mt-1 leading-relaxed min-h-[48px]">
                        {game.description}
                      </p>
                    </div>

                    {/* Footer Score stats and button */}
                    <div className="border-t border-slate-900 pt-3 mt-4 flex items-center justify-between gap-3">
                      <div className="font-mono text-[10px] text-slate-500">
                        <p>Parties: <span className="font-bold text-slate-300">{gamePlayCount}</span></p>
                        <p>Record: <span className="font-bold text-yellow-400">{gameHighScore} PX</span></p>
                      </div>

                      <button
                        onClick={() => handleLaunchGame(game.id)}
                        className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-black py-2.5 px-4 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer tracking-wider border border-cyan-400/30"
                      >
                        <PlayCircle size={15} className="animate-pulse" /> JOUER
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* --- Profile Modification Modal --- */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl w-full max-w-md font-mono text-white relative">
            <h3 className="text-base font-bold text-cyan-400 mb-4 uppercase tracking-wider text-center">
              👤 MODIFIER TON PROFIL VERTEX
            </h3>

            {/* Square Brawl Stars style Avatar Live Preview */}
            <div className="flex flex-col items-center justify-center mb-6 bg-slate-900/40 p-4 rounded-xl border border-slate-900">
              <div
                className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] relative ${
                  selectedAvatarColorInput === 'plasma_violet' ? 'shadow-[0_0_15px_#a855f7] animate-pulse' :
                  selectedAvatarColorInput === 'rose_neon' ? 'animate-pulse' :
                  selectedAvatarColorInput === 'gold_rainbow' ? 'shadow-[0_0_20px_#eab308] border-yellow-400 border-dashed animate-pulse' : ''
                }`}
                style={{
                  backgroundColor: AVATAR_COLORS.find(c => c.id === selectedAvatarColorInput)?.hex || '#06b6d4'
                }}
              >
                {renderIcon(selectedAvatarIconInput, "w-8 h-8 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]")}
              </div>
              <p className="text-[10px] text-slate-300 mt-2 font-bold uppercase tracking-wider">{usernameInput || 'PLAYER_ONE'}</p>
              <p className="text-[8px] text-yellow-400 font-bold tracking-widest mt-0.5">{selectedTitleInput}</p>
            </div>

            {/* Pseudo input */}
            <div className="mb-4">
              <label className="text-[10px] text-slate-400 block mb-1 font-bold">PSEUDO DE JOUEUR</label>
              <input
                type="text"
                maxLength={14}
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value.toUpperCase())}
                className="w-full bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Title selection */}
            <div className="mb-4">
              <label className="text-[10px] text-slate-400 block mb-1 font-bold">TITRE SÉLECTIONNÉ</label>
              <select
                value={selectedTitleInput}
                onChange={(e) => {
                  audio.playClick();
                  setSelectedTitleInput(e.target.value);
                }}
                className="w-full bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs text-yellow-400 font-bold focus:outline-none focus:border-yellow-400"
              >
                {(state.profile.unlockedTitles || ['DÉBUTANT']).map(t => (
                  <option key={t} value={t} className="bg-slate-950 text-white">{t}</option>
                ))}
              </select>
            </div>

            {/* Avatar color choices */}
            <div className="mb-4">
              <label className="text-[10px] text-slate-400 block mb-1.5 font-bold">COULEUR D'AVATAR (CARRÉ)</label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_COLORS.map(c => {
                  const isUnlocked = (state.profile.unlockedColors || ['cyan', 'pink', 'purple', 'emerald', 'yellow']).includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      disabled={!isUnlocked}
                      onClick={() => {
                        audio.playClick();
                        setSelectedAvatarColorInput(c.id);
                      }}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center relative transition-all ${
                        selectedAvatarColorInput === c.id ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                      } ${!isUnlocked ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                      style={{ backgroundColor: c.hex }}
                      title={isUnlocked ? c.id : 'Bloqué (Pass Premium!)'}
                    >
                      {!isUnlocked && <span className="text-[8px] text-white">🔒</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Avatar icon choices (Brawl stars square avatars style) */}
            <div className="mb-6">
              <label className="text-[10px] text-slate-400 block mb-1.5 font-bold">ICÔNE DE BANNIÈRE</label>
              <div className="grid grid-cols-4 gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
                {[
                  { id: 'Crown', icon: 'Award' },
                  { id: 'Zap', icon: 'Zap' },
                  { id: 'Flame', icon: 'Flame' },
                  { id: 'Sword', icon: 'Sword' },
                  { id: 'Brain', icon: 'Brain' },
                  { id: 'Target', icon: 'Target' },
                  { id: 'Shield', icon: 'Shield' },
                  { id: 'Cpu', icon: 'Cpu' }
                ].map((item) => {
                  const isSelected = selectedAvatarIconInput === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        audio.playClick();
                        setSelectedAvatarIconInput(item.id);
                      }}
                      className={`p-2 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                          : 'bg-slate-950/80 border-slate-850 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {renderIcon(item.id, "w-4 h-4")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowProfileModal(false)}
                className="flex-1 bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold py-2.5 rounded-xl text-xs cursor-pointer border border-slate-800"
              >
                Annuler
              </button>
              <button
                onClick={saveProfile}
                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Skins & Titles Arcade Shop Modal --- */}
      {showSkinsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl w-full max-w-md font-mono text-white relative">
            <h3 className="text-base font-bold text-cyan-400 mb-1 uppercase tracking-widest flex items-center gap-2">
              <ShoppingBag size={18} /> BOUTIQUE DE L'ARCADE
            </h3>
            <p className="text-[10px] text-slate-400 mb-4">
              PERSONNALISE TON PROFIL ET TON CHÂSSIS D'ARCADE EN DÉPENSANT TES PIXELS
            </p>

            {/* Solde row */}
            <div className="flex items-center gap-1.5 mb-4 text-xs font-bold text-yellow-400 bg-yellow-950/20 p-2 rounded border border-yellow-500/20 w-fit">
              <Sparkles size={14} /> Solde: {state.profile.totalPixels} PX
            </div>

            {/* Shop Tabs Selector */}
            <div className="flex gap-2 mb-4 border-b border-slate-800 pb-2">
              <button
                onClick={() => { audio.playClick(); setShopTab('skins'); }}
                className={`flex-1 py-1.5 rounded-lg font-bold text-xs cursor-pointer uppercase transition-all ${
                  shopTab === 'skins'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-900/60 text-slate-500 border border-transparent hover:text-slate-300'
                }`}
              >
                Châssis (Skins)
              </button>
              <button
                onClick={() => { audio.playClick(); setShopTab('titles'); }}
                className={`flex-1 py-1.5 rounded-lg font-bold text-xs cursor-pointer uppercase transition-all ${
                  shopTab === 'titles'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-900/60 text-slate-500 border border-transparent hover:text-slate-300'
                }`}
              >
                Titres ({PURCHASABLE_TITLES.length})
              </button>
            </div>

            {/* Tab content */}
            <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-1">
              {shopTab === 'skins' ? (
                CABINET_SKINS.map((skin) => {
                  const isUnlocked = state.profile.unlockedSkins.includes(skin.id);
                  const isActive = state.profile.activeSkin === skin.id;

                  return (
                    <div
                      key={skin.id}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isActive ? 'bg-slate-900 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-slate-900/40 border-slate-900'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-200">{skin.name}</p>
                        <p className="text-[8px] text-slate-500 uppercase mt-0.5">Style néon d'enceinte</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isActive ? (
                          <span className="text-[10px] text-cyan-400 font-bold uppercase border border-cyan-950 bg-cyan-950/40 px-2 py-1 rounded">
                            Actif
                          </span>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => useSkin(skin.id)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 px-3 rounded text-[10px] font-bold cursor-pointer"
                          >
                            Équiper
                          </button>
                        ) : (
                          <button
                            onClick={() => buySkin(skin.id, skin.cost)}
                            disabled={state.profile.totalPixels < skin.cost}
                            className={`py-1.5 px-3 rounded text-[10px] font-bold flex items-center gap-1 ${
                              state.profile.totalPixels >= skin.cost
                                ? 'bg-yellow-600 hover:bg-yellow-500 text-white cursor-pointer'
                                : 'bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed'
                            }`}
                          >
                            <span>Acheter</span>
                            <span className="text-yellow-400">{skin.cost} PX</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                PURCHASABLE_TITLES.map((title) => {
                  const isUnlocked = (state.profile.unlockedTitles || ['DÉBUTANT']).includes(title.id);
                  const isActive = state.profile.title === title.id;

                  return (
                    <div
                      key={title.id}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isActive ? 'bg-slate-900 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.1)]' : 'bg-slate-900/40 border-slate-900'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-yellow-400">{title.id}</p>
                        <p className="text-[8px] text-slate-500 uppercase mt-0.5">{title.desc}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isActive ? (
                          <span className="text-[10px] text-yellow-400 font-bold uppercase border border-yellow-950 bg-yellow-950/40 px-2 py-1 rounded">
                            Équipé
                          </span>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => equipTitle(title.id)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 px-3 rounded text-[10px] font-bold cursor-pointer"
                          >
                            Équiper
                          </button>
                        ) : (
                          <button
                            onClick={() => buyTitle(title.id, title.cost)}
                            disabled={state.profile.totalPixels < title.cost}
                            className={`py-1.5 px-3 rounded text-[10px] font-bold flex items-center gap-1 ${
                              state.profile.totalPixels >= title.cost
                                ? 'bg-yellow-600 hover:bg-yellow-500 text-white cursor-pointer'
                                : 'bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed'
                            }`}
                          >
                            <span>Acheter</span>
                            <span className="text-yellow-400">{title.cost} PX</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => { audio.playClick(); setShowSkinsModal(false); }}
              className="w-full bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold py-2.5 rounded-xl text-xs mt-6 border border-slate-850 cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}


      {/* --- Leaderboard Modal --- */}
      {showLeaderboardModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl w-full max-w-lg font-mono text-white relative">
            <h3 className="text-base font-bold text-yellow-400 mb-1 uppercase tracking-widest flex items-center gap-2">
              <Trophy size={18} className="text-yellow-500 animate-bounce" /> CLASSEMENT VERTEX
            </h3>
            <p className="text-[10px] text-slate-400 mb-4">
              AFFICHE TES RECORDS AUTHENTIQUES OU COMPARE-TOI AUX SIMULATEURS D'I.A. !
            </p>

            {/* Mode selection toggle */}
            <div className="flex gap-2 mb-4 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => { audio.playClick(); setLeaderboardShowSolo(true); }}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  leaderboardShowSolo
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 shadow'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                🏆 Solo (Réel)
              </button>
              <button
                onClick={() => { audio.playClick(); setLeaderboardShowSolo(false); }}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  !leaderboardShowSolo
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                🤖 Simulateurs I.A.
              </button>
            </div>

            {/* Leaderboard list calculation */}
            {(() => {
              const staticPlayers = [
                { id: '1', username: 'VertexMaster99', title: 'VERTEX EMPEREUR', pixels: 2450, colorId: 'gold_rainbow', isUser: false, invadersScore: 280, meteorScore: 320 },
                { id: '2', username: 'NeonGlitcher', title: 'NÉON GOD', pixels: 1890, colorId: 'plasma_violet', isUser: false, invadersScore: 190, meteorScore: 240 },
                { id: '3', username: 'CyberPunk_88', title: 'CHASSEUR DE PIXELS', pixels: 1420, colorId: 'rose_neon', isUser: false, invadersScore: 130, meteorScore: 180 },
                { id: '4', username: 'RetroRider', title: 'SANS RETOUR', pixels: 1100, colorId: 'purple', isUser: false, invadersScore: 90, meteorScore: 140 },
                { id: '5', username: 'PixelLord', title: 'DÉBUTANT', pixels: 850, colorId: 'cyan', isUser: false, invadersScore: 70, meteorScore: 110 },
                { id: '6', username: 'PixelKing', title: 'DÉBUTANT', pixels: 480, colorId: 'emerald', isUser: false, invadersScore: 40, meteorScore: 75 },
                { id: '7', username: 'ArcadeKid', title: 'DÉBUTANT', pixels: 250, colorId: 'yellow', isUser: false, invadersScore: 25, meteorScore: 40 }
              ];

              // Insert real user stats
              const userInvadersScore = state.stats['invaders']?.highScore || 0;
              const userMeteorScore = state.stats['meteor']?.highScore || 0;
              const userRecord = {
                id: 'user_current',
                username: `${state.profile.username} (Toi)`,
                title: state.profile.title || 'DÉBUTANT',
                pixels: state.profile.totalPixels,
                colorId: state.profile.avatarColor,
                isUser: true,
                invadersScore: userInvadersScore,
                meteorScore: userMeteorScore
              };

              // Filter or keep competitors based on mode
              const activePlayers = leaderboardShowSolo ? [userRecord] : [...staticPlayers, userRecord];

              // We'll have general scoreboard list sorted by pixels, and game-specific lists
              const allPixelsList = [...activePlayers].sort((a, b) => b.pixels - a.pixels);
              const allInvadersList = [...activePlayers].sort((a, b) => b.invadersScore - a.invadersScore);
              const allMeteorList = [...activePlayers].sort((a, b) => b.meteorScore - a.meteorScore);

              return (
                <div>
                  {/* Info notice about realism */}
                  {leaderboardShowSolo && (
                    <div className="bg-yellow-950/20 border border-yellow-600/30 text-yellow-400 p-2.5 rounded-xl mb-4 text-[9px] leading-relaxed text-center">
                      📍 CLASSEMENT LOCAL RÉEL : 1 Joueur Enregitré sur cette machine. Les autres joueurs étant des simulations d'I.A. (clique sur "Simulateurs I.A." pour comparer tes scores !).
                    </div>
                  )}

                  {/* Internal tabs */}
                  <div className="flex gap-1 mb-4 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 text-[10px]">
                    <button
                      onClick={() => { audio.playClick(); (window as any)._boardTab = 'general'; setState(p => ({ ...p })); }}
                      className={`flex-1 py-1 rounded font-bold cursor-pointer uppercase transition-all ${
                        !(window as any)._boardTab || (window as any)._boardTab === 'general'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 shadow'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      🏆 Général (PX)
                    </button>
                    <button
                      onClick={() => { audio.playClick(); (window as any)._boardTab = 'invaders'; setState(p => ({ ...p })); }}
                      className={`flex-1 py-1 rounded font-bold cursor-pointer uppercase transition-all ${
                        (window as any)._boardTab === 'invaders'
                          ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 shadow'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      🛸 Invaders
                    </button>
                    <button
                      onClick={() => { audio.playClick(); (window as any)._boardTab = 'meteor'; setState(p => ({ ...p })); }}
                      className={`flex-1 py-1 rounded font-bold cursor-pointer uppercase transition-all ${
                        (window as any)._boardTab === 'meteor'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      ☄️ Météores
                    </button>
                  </div>

                  {/* Player Rankings */}
                  <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                    {(() => {
                      const tab = (window as any)._boardTab || 'general';
                      const list = tab === 'general' ? allPixelsList : tab === 'invaders' ? allInvadersList : allMeteorList;

                      return list.map((player, idx) => {
                        const isTopThree = idx < 3;
                        const rankBadge = isTopThree 
                          ? idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'
                          : `#${idx + 1}`;

                        const displayScore = tab === 'general' 
                          ? `${player.pixels} PX` 
                          : tab === 'invaders' 
                            ? `${player.invadersScore} pts` 
                            : `${player.meteorScore} pts`;

                        const pColorObj = AVATAR_COLORS.find(c => c.id === player.colorId) || AVATAR_COLORS[0];

                        return (
                          <div
                            key={player.id}
                            className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                              player.isUser
                                ? 'bg-cyan-950/20 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.15)] animate-[pulse_3s_infinite]'
                                : 'bg-slate-900/40 border-slate-900/60'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold w-6 text-center">{rankBadge}</span>
                              <div
                                className="w-3 h-3 rounded-full shrink-0 animate-pulse"
                                style={{ backgroundColor: pColorObj.hex }}
                              />
                              <div className="text-left">
                                <p className={`text-xs font-bold flex items-center gap-1.5 ${player.isUser ? 'text-cyan-400' : 'text-slate-200'}`}>
                                  {player.username}
                                </p>
                                <p className="text-[7px] text-slate-500 font-extrabold tracking-wider">{player.title}</p>
                              </div>
                            </div>

                            <span className={`text-xs font-extrabold ${isTopThree ? 'text-yellow-400' : player.isUser ? 'text-cyan-300' : 'text-slate-400'}`}>
                              {displayScore}
                            </span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              );
            })()}

            <button
              onClick={() => { audio.playClick(); setShowLeaderboardModal(false); }}
              className="w-full bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold py-2.5 rounded-xl text-xs mt-6 border border-slate-850 cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}


      {showAchievementsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl w-full max-w-lg font-mono text-white relative">
            <h3 className="text-base font-bold text-purple-400 mb-2 uppercase tracking-widest">
              🏆 SUCCÈS & EXPLOITS
            </h3>
            <p className="text-[10px] text-slate-400 mb-4">
              ACCOMPLIS DES RECORDS DE JEU POUR DEVENIR UNE LÉGENDE DE VERTEX !
            </p>

            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
              {state.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    ach.isUnlocked
                      ? 'bg-purple-950/10 border-purple-800/40 shadow-[0_0_10px_rgba(168,85,247,0.05)]'
                      : 'bg-slate-900/30 border-slate-900 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${ach.isUnlocked ? 'bg-purple-900/20 text-purple-400 border border-purple-800/30' : 'bg-slate-950 text-slate-600 border border-slate-900'}`}>
                      {renderIcon(ach.icon, "w-4 h-4")}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${ach.isUnlocked ? 'text-slate-100' : 'text-slate-500'}`}>
                        {ach.frenchTitle}
                      </p>
                      <p className="text-[9px] text-slate-400 mt-0.5">{ach.frenchDescription}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold ${ach.isUnlocked ? 'text-yellow-400' : 'text-slate-600'}`}>
                    +{ach.pixelReward} PX
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => { audio.playClick(); setShowAchievementsModal(false); }}
              className="w-full bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold py-2.5 rounded-xl text-xs mt-6 border border-slate-850 cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* --- High Scores Stats Modal --- */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl w-full max-w-md font-mono text-white relative">
            <h3 className="text-base font-bold text-yellow-400 mb-2 uppercase tracking-widest">
              📊 TABLEAU DES RECORDS
            </h3>
            <p className="text-[10px] text-slate-400 mb-4">
              TES MEILLEURS RÉSULTATS PAR BORNE D'ARCADE
            </p>

            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
              {GAMES_LIST.map((game) => {
                const gameStats = state.stats[game.id] || { plays: 0, highScore: 0 };

                return (
                  <div
                    key={game.id}
                    className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-900/80 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-300">{game.frenchName}</span>
                    <div className="text-right font-bold">
                      <span className="text-slate-500 font-medium text-[10px] mr-2">
                        {gameStats.plays} parties
                      </span>
                      <span className="text-yellow-400 font-bold">
                        {gameStats.highScore} PX
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => { audio.playClick(); setShowStatsModal(false); }}
              className="w-full bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold py-2.5 rounded-xl text-xs mt-6 border border-slate-850 cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* --- Quests Modal --- */}
      {showQuestsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl w-full max-w-lg font-mono text-white relative">
            <h3 className="text-base font-bold text-emerald-400 mb-2 uppercase tracking-widest flex items-center gap-2">
              <Target size={18} className="animate-pulse" /> 🎯 QUÊTES ARCADE
            </h3>
            <p className="text-[10px] text-slate-400 mb-4">
              RELEVE LES DÉFIS DE L'ARCADE POUR GAGNER DE L'EXP ET DES PIXELS !
            </p>

            <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
              {(state.quests || INITIAL_QUESTS).map((quest) => {
                const ratio = Math.min(quest.current, quest.target) / quest.target;
                const percent = Math.floor(ratio * 100);

                return (
                  <div
                    key={quest.id}
                    className={`p-4 rounded-xl border flex flex-col gap-3 transition-all ${
                      quest.isClaimed 
                        ? 'bg-slate-900/20 border-slate-950 opacity-60' 
                        : quest.isCompleted
                          ? 'bg-slate-900/80 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                          : 'bg-slate-900/50 border-slate-900'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${quest.isCompleted && !quest.isClaimed ? 'text-emerald-400' : 'text-slate-200'}`}>
                            {quest.title}
                          </span>
                          {quest.isClaimed && (
                            <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700/50">
                              REÇU
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{quest.description}</p>
                      </div>

                      <div className="text-right flex flex-col gap-1">
                        <span className="text-[10px] text-yellow-400 font-bold">
                          +{quest.rewardPixels} PX
                        </span>
                        <span className="text-[10px] text-rose-400 font-bold">
                          +{quest.rewardXp} XP
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full flex items-center gap-3">
                      <div className="flex-1 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 relative">
                        <div
                          className={`h-full transition-all duration-500 ${
                            quest.isCompleted ? 'bg-emerald-500' : 'bg-cyan-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 min-w-[45px] text-right">
                        {quest.current}/{quest.target}
                      </span>
                    </div>

                    {/* Claim Button */}
                    {!quest.isClaimed && (
                      <button
                        disabled={!quest.isCompleted}
                        onClick={() => claimQuest(quest.id)}
                        className={`w-full py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                          quest.isCompleted
                            ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                            : 'bg-slate-950 text-slate-500 border border-slate-900 cursor-not-allowed'
                        }`}
                      >
                        {quest.isCompleted ? '🎯 RÉCLAMER LA RÉCOMPENSE' : 'EN COURS...'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={refreshQuests}
                className="flex-1 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 py-2.5 rounded-xl text-xs font-bold border border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                title="Régénère toutes les quêtes pour repartir de zéro contre 50 PX !"
              >
                🔄 Régénérer (50 PX)
              </button>

              <button
                onClick={() => { audio.playClick(); setShowQuestsModal(false); }}
                className="flex-1 bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold py-2.5 rounded-xl text-xs border border-slate-850 cursor-pointer text-center"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Arcade Pass Modal --- */}
      {showPassModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl w-full max-w-xl font-mono text-white relative flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex justify-between items-start gap-4 mb-4 text-left">
              <div>
                <h3 className="text-base font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                  <Flame size={18} className="text-rose-500 animate-pulse" /> PASS ARCADE - SAISON 1
                </h3>
                <p className="text-[10px] text-slate-400">
                  MONTE EN NIVEAU POUR OBTENIR DES TITRES, SKINS ET COULEURS EXCLUSIFS !
                </p>
              </div>

              {state.arcadePass?.isPremium ? (
                <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 text-[9px] font-black px-2.5 py-1 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.3)] uppercase tracking-wider animate-pulse flex items-center gap-1 shrink-0">
                  <Sparkles size={10} /> Élite Actif
                </div>
              ) : (
                <button
                  onClick={buyPremiumPass}
                  className="bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-400 hover:via-purple-500 hover:to-indigo-500 text-white text-[9px] font-black px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all cursor-pointer uppercase tracking-wider flex items-center gap-1 animate-bounce shrink-0"
                >
                  👑 ÉLITE (600 PX)
                </button>
              )}
            </div>

            {/* Level & XP Gauge */}
            <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-xl flex items-center gap-4 mb-4 text-left">
              <div className="relative">
                <div className="absolute inset-0 bg-rose-500/30 rounded-xl blur-md"></div>
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 flex flex-col items-center justify-center border border-rose-400 shadow-md">
                  <span className="text-[8px] font-bold text-rose-200 uppercase">Niveau</span>
                  <span className="text-lg font-black text-white leading-none mt-0.5">{state.arcadePass?.level || 1}</span>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1.5">
                  <span>EXPÉRIENCE DE SAISON</span>
                  <span className="text-rose-400 font-extrabold">{state.arcadePass?.xp || 0} / 100 XP</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 relative">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${state.arcadePass?.xp || 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Rewards Scrollable List */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 mb-4 scrollbar-thin scrollbar-thumb-slate-800 text-left">
              {PASS_LEVELS.map((pLevel) => {
                const currentLevel = state.arcadePass?.level || 1;
                const isPremiumUnlocked = state.arcadePass?.isPremium || false;
                const isLevelReached = currentLevel >= pLevel.level;

                const isFreeClaimed = state.arcadePass?.claimedFreeRewards?.includes(pLevel.level) || false;
                const isPremiumClaimed = state.arcadePass?.claimedPremiumRewards?.includes(pLevel.level) || false;

                return (
                  <div
                    key={pLevel.level}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                      isLevelReached 
                        ? 'bg-slate-900/40 border-slate-900' 
                        : 'bg-slate-950/20 border-slate-950 opacity-40'
                    }`}
                  >
                    {/* Level Hexagon */}
                    <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-xs text-slate-400 shrink-0">
                      N.{pLevel.level}
                    </div>

                    {/* Free Track Reward Card */}
                    <div className="flex-1 p-2 rounded-lg bg-slate-950/60 border border-slate-900/50 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase font-bold">Gratuit</span>
                        <span className="text-[10px] font-bold text-slate-200">{pLevel.freeReward.label}</span>
                      </div>

                      {isFreeClaimed ? (
                        <span className="text-emerald-400 text-xs font-bold" title="Récupéré">✓</span>
                      ) : (
                        <button
                          disabled={!isLevelReached}
                          onClick={() => claimPassReward(pLevel.level, 'free')}
                          className={`text-[9px] font-bold px-2 py-1 rounded transition-all cursor-pointer ${
                            isLevelReached
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                              : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                          }`}
                        >
                          {isLevelReached ? 'PRENDRE' : 'BLOQUÉ'}
                        </button>
                      )}
                    </div>

                    {/* Premium Track Reward Card */}
                    <div className="flex-1 p-2 rounded-lg bg-indigo-950/10 border border-indigo-900/20 flex items-center justify-between gap-2 relative overflow-hidden">
                      {/* Premium Accent line overlay */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl pointer-events-none"></div>

                      <div>
                        <span className="text-[8px] text-purple-400 block uppercase font-bold flex items-center gap-0.5">
                          💎 Élite
                        </span>
                        <span className="text-[10px] font-bold text-purple-200">{pLevel.premiumReward.label}</span>
                      </div>

                      {isPremiumClaimed ? (
                        <span className="text-purple-400 text-xs font-bold" title="Récupéré">✓</span>
                      ) : (
                        <button
                          disabled={!isLevelReached || !isPremiumUnlocked}
                          onClick={() => claimPassReward(pLevel.level, 'premium')}
                          className={`text-[9px] font-bold px-2 py-1 rounded transition-all cursor-pointer ${
                            isLevelReached && isPremiumUnlocked
                              ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm'
                              : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                          }`}
                        >
                          {isLevelReached && isPremiumUnlocked ? 'PRENDRE' : 'BLOQUÉ'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Close */}
            <button
              onClick={() => { audio.playClick(); setShowPassModal(false); }}
              className="w-full bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold py-2.5 rounded-xl text-xs border border-slate-850 cursor-pointer text-center shrink-0"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* --- Global Leaderboard Modal --- */}
      {showLeaderboardModal && (() => {
        const seedList = [
          { username: 'CYBER_SHOGUN', title: 'NÉON GOD', pixels: 3450, avatarColor: 'rose_neon', passLevel: 10 },
          { username: 'RETRO_RUNNER', title: 'VERTEX EMPEREUR', pixels: 2800, avatarColor: 'gold_rainbow', passLevel: 9 },
          { username: 'NEON_SAMURAI', title: 'CHASSEUR DE PIXELS', pixels: 2150, avatarColor: 'plasma_violet', passLevel: 8 },
          { username: 'ARCADE_QUEEN', title: 'SANS RETOUR', pixels: 1900, avatarColor: 'pink', passLevel: 7 },
          { username: 'GLITCH_HUNTER', title: 'DÉBUTANT', pixels: 1450, avatarColor: 'emerald', passLevel: 6 },
          { username: 'PIXEL_CHEF', title: 'DÉBUTANT', pixels: 980, avatarColor: 'yellow', passLevel: 5 },
          { username: 'VORTEX_RIDER', title: 'DÉBUTANT', pixels: 720, avatarColor: 'purple', passLevel: 4 },
          { username: 'SYNTH_BOY', title: 'DÉBUTANT', pixels: 410, avatarColor: 'cyan', passLevel: 3 },
        ];

        const currentPlayerItem = {
          username: state.profile.username || 'PLAYER_ONE',
          title: state.profile.title || 'DÉBUTANT',
          pixels: state.profile.totalPixels || 0,
          avatarColor: state.profile.avatarColor || 'cyan',
          passLevel: state.arcadePass?.level || 1,
          isPlayer: true
        };

        const sortedRankings = [...seedList, currentPlayerItem]
          .sort((a, b) => b.pixels - a.pixels)
          .map((item, idx) => ({ ...item, rank: idx + 1 }));

        return (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl w-full max-w-md font-mono text-white relative flex flex-col max-h-[85vh]">
              
              {/* Header */}
              <div className="text-left mb-4">
                <h3 className="text-base font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                  <Trophy size={18} className="text-cyan-400 animate-bounce" /> CLASSEMENT RETRO MONDIAL
                </h3>
                <p className="text-[10px] text-slate-400">
                  SERAS-TU LE DIEU SUPRÊME DU VERTEX ? ACCUMULE TES PIXELS !
                </p>
              </div>

              {/* Ranks list container */}
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 mb-4 text-left">
                {sortedRankings.map((competitor) => {
                  const isUser = competitor.username === state.profile.username;
                  const itemColor = AVATAR_COLORS.find(c => c.id === competitor.avatarColor) || AVATAR_COLORS[0];
                  
                  return (
                    <div
                      key={competitor.username}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isUser 
                          ? 'bg-cyan-950/20 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)] scale-[1.02]' 
                          : 'bg-slate-900/40 border-slate-900'
                      }`}
                    >
                      {/* Left: Rank & Avatar */}
                      <div className="flex items-center gap-3">
                        {/* Rank Badge */}
                        <div className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                          competitor.rank === 1 ? 'bg-yellow-500 text-slate-950 shadow-[0_0_8px_#eab308]' :
                          competitor.rank === 2 ? 'bg-slate-300 text-slate-950' :
                          competitor.rank === 3 ? 'bg-amber-600 text-slate-950' :
                          'bg-slate-950 border border-slate-850 text-slate-400'
                        }`}>
                          {competitor.rank}
                        </div>

                        {/* Avatar bubble representation */}
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: itemColor.hex }}
                        />

                        {/* Username & Title */}
                        <div>
                          <p className={`text-xs font-bold uppercase tracking-wider ${isUser ? 'text-cyan-400' : 'text-slate-200'}`}>
                            {competitor.username} {isUser && <span className="text-[9px] text-yellow-400 font-bold ml-1">(TOI)</span>}
                          </p>
                          <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest mt-0.5">{competitor.title}</p>
                        </div>
                      </div>

                      {/* Right: Pixels balance & Pass level */}
                      <div className="text-right flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs text-yellow-400 font-extrabold flex items-center gap-1">
                          {competitor.pixels} <span className="text-[10px] text-yellow-500 font-bold">PX</span>
                        </span>
                        <span className="text-[8px] text-rose-400 bg-rose-950/10 px-1.5 py-0.5 rounded border border-rose-950/20 font-bold uppercase">
                          PASS NIV. {competitor.passLevel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Close Button */}
              <button
                onClick={() => { audio.playClick(); setShowLeaderboardModal(false); }}
                className="w-full bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold py-2.5 rounded-xl text-xs border border-slate-850 cursor-pointer text-center shrink-0"
              >
                Fermer le classement
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
