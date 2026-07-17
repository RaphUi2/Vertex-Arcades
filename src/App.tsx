import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap, Brain, Target, Play, Grid, Layers, Shield, Cpu, Sword, PlusCircle, Grid3X3, Sparkles, Award, Trophy, User, ShoppingBag, Settings, Volume2, VolumeX, Medal, Flame, PlayCircle, Eye, Info
} from 'lucide-react';

import { audio } from './utils/audio';
import { GlobalState, GameStats, Achievement } from './types';
import { GAMES_LIST, CABINET_SKINS, INITIAL_ACHIEVEMENTS } from './gamesData';

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

const AVATAR_COLORS = [
  { id: 'cyan', hex: '#06b6d4', text: 'text-cyan-400', border: 'border-cyan-500' },
  { id: 'pink', hex: '#ec4899', text: 'text-pink-400', border: 'border-pink-500' },
  { id: 'purple', hex: '#a855f7', text: 'text-purple-400', border: 'border-purple-500' },
  { id: 'emerald', hex: '#10b981', text: 'text-emerald-400', border: 'border-emerald-500' },
  { id: 'yellow', hex: '#eab308', text: 'text-yellow-400', border: 'border-yellow-500' }
];

export default function App() {
  // Load initial global state from localStorage
  const [state, setState] = useState<GlobalState>(() => {
    try {
      const saved = localStorage.getItem('vertex_arcades_state');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load local state from localStorage", e);
    }
    
    // Default fallback state
    return {
      profile: {
        username: 'PLAYER_ONE',
        avatarColor: 'cyan',
        totalPixels: 0,
        unlockedSkins: ['neon'],
        activeSkin: 'neon'
      },
      stats: GAMES_LIST.reduce((acc, g) => {
        acc[g.id] = { plays: 0, highScore: 0 };
        return acc;
      }, {} as Record<string, GameStats>),
      achievements: INITIAL_ACHIEVEMENTS
    };
  });

  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [soundOn, setSoundOn] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSkinsModal, setShowSkinsModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState(state.profile.username);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

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

      return {
        ...prev,
        profile: nextProfile,
        achievements: updatedAchievements
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

      return {
        ...prev,
        profile: {
          ...prev.profile,
          totalPixels: prev.profile.totalPixels + extraPixels
        },
        stats: updatedStats,
        achievements: updatedAchievements
      };
    });
  };

  const saveProfile = () => {
    audio.playCoin();
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        username: usernameInput.trim() || 'PLAYER_ONE'
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
              12 Jeux Rétro Néon d'Élite
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

          {/* Stats Button */}
          <button
            onClick={() => { audio.playClick(); setShowStatsModal(true); }}
            className="flex items-center gap-1 px-3 py-2.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-all cursor-pointer text-xs font-mono"
          >
            <Trophy size={14} className="text-yellow-400" /> Stats
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
                  <p className="text-lg font-bold text-cyan-400">12 Mini-Jeux</p>
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
                        className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 hover:border-cyan-500 hover:text-cyan-400 text-slate-300 font-mono text-xs font-bold py-2 px-3.5 rounded-lg shadow-sm transition-all cursor-pointer"
                      >
                        <PlayCircle size={14} /> JOUER
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl w-full max-w-sm font-mono text-white relative">
            <h3 className="text-base font-bold text-cyan-400 mb-4 uppercase tracking-wider">
              Modifier le Profil
            </h3>

            <div className="mb-4">
              <label className="text-[10px] text-slate-400 block mb-1">PSEUDO DE JOUEUR</label>
              <input
                type="text"
                maxLength={14}
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value.toUpperCase())}
                className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="mb-6">
              <label className="text-[10px] text-slate-400 block mb-2">COULEUR D'AVATAR</label>
              <div className="flex gap-3">
                {AVATAR_COLORS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setAvatarColor(c.id)}
                    className={`w-8 h-8 rounded-full border-2 ${state.profile.avatarColor === c.id ? 'border-white scale-110 shadow-lg' : 'border-transparent'} transition-all`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
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

      {/* --- Skins Shop Modal --- */}
      {showSkinsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl w-full max-w-md font-mono text-white relative">
            <h3 className="text-base font-bold text-cyan-400 mb-2 uppercase tracking-widest">
              BORNE CABINE SKINS
            </h3>
            <p className="text-[10px] text-slate-400 mb-4">
              PERSONNALISE TON CHÂSSIS D'ARCADE EN DÉPENSANT TES PIXELS
            </p>

            <div className="flex items-center gap-1.5 mb-4 text-xs font-bold text-yellow-400 bg-yellow-950/20 p-2 rounded border border-yellow-500/20 w-fit">
              <Sparkles size={14} /> Solde: {state.profile.totalPixels} PX
            </div>

            <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-1">
              {CABINET_SKINS.map((skin) => {
                const isUnlocked = state.profile.unlockedSkins.includes(skin.id);
                const isActive = state.profile.activeSkin === skin.id;

                return (
                  <div
                    key={skin.id}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      isActive ? 'bg-slate-900 border-cyan-500' : 'bg-slate-900/40 border-slate-900'
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
              })}
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

      {/* --- Achievements Modal --- */}
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
    </div>
  );
}
