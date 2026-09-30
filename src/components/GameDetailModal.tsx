import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Play, Lock, Heart, ArrowLeft, Check, Sparkles
} from 'lucide-react';
import { GameData, GameStats } from '../types';
import { GameCardIllustration } from './GameCardIllustration';
import { audio } from '../utils/audio';
import { Language, getTranslation } from '../utils/i18n';

interface GameDetailModalProps {
  isOpen?: boolean;
  onClose: () => void;
  game: GameData | null;
  stats: GameStats;
  isUnlocked: boolean;
  isFavorite: boolean;
  userVCoins: number;
  playButtonColor?: string;
  language?: Language;
  onToggleFavorite: (gameId: string) => void;
  onPlayGame: (gameId: string) => void;
  onUnlockGame: (game: GameData) => void;
}

const PLAY_BUTTON_STYLES: Record<string, string> = {
  emerald: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.35)] border border-emerald-300/40',
  cyan: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.45)] border border-cyan-300/50',
  purple: 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.45)] border border-purple-300/50',
  rose: 'bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.45)] border border-rose-300/50',
  amber: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.45)] border border-amber-300/60',
  zinc: 'bg-gradient-to-r from-zinc-800 via-zinc-900 to-black hover:from-zinc-700 hover:to-zinc-900 text-white shadow-[0_0_20px_rgba(0,0,0,0.7)] border border-white/30',
  white: 'bg-gradient-to-r from-white via-slate-100 to-slate-200 hover:from-slate-100 hover:to-white text-slate-950 font-black shadow-[0_0_20px_rgba(255,255,255,0.5)] border border-white'
};

export function GameDetailModal({
  onClose,
  game,
  stats,
  isUnlocked,
  isFavorite,
  userVCoins,
  playButtonColor = 'emerald',
  language = 'en',
  onToggleFavorite,
  onPlayGame,
  onUnlockGame
}: GameDetailModalProps) {
  const [likeBurst, setLikeBurst] = useState(false);
  const t = getTranslation(language);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!game) return null;

  const handleFavoriteClick = () => {
    audio.playLike();
    setLikeBurst(true);
    setTimeout(() => setLikeBurst(false), 900);
    onToggleFavorite(game.id);
  };

  const handleAction = () => {
    if (isUnlocked) {
      audio.playStart();
      onClose();
      onPlayGame(game.id);
    } else {
      audio.playClick();
      onUnlockGame(game);
    }
  };

  const buttonStyleClass = isUnlocked
    ? (PLAY_BUTTON_STYLES[playButtonColor] || PLAY_BUTTON_STYLES.emerald)
    : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-yellow-300/50';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={() => {
        audio.playClick();
        onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-xl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 28, stiffness: 340 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[94dvh] sm:max-h-[90vh] rounded-3xl p-4 sm:p-6 flex flex-col justify-between overflow-hidden shadow-2xl relative border border-white/15 bg-slate-900/95 text-slate-100"
      >
        {/* Top Sheen */}
        <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

        {/* Header controls: [← Retour] on the left, [X] on the right */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10 shrink-0">
          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-sm border border-white/15 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>{language === 'en' ? 'Back' : language === 'es' ? 'Volver' : 'Retour'}</span>
          </button>

          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shadow-md transition-all active:scale-90"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-3.5">
          {/* 16:9 Banner Illustration */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-lg">
            <GameCardIllustration gameId={game.id} aspect="16:9" className="w-full h-full" />
            {/* Category Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 text-[10px] font-mono font-bold text-cyan-300 border border-cyan-400/30 backdrop-blur-md">
                {game.category.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Title Row with Favorite Heart Button */}
          <div className="flex items-center justify-between gap-4 pt-1">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                {game.frenchName || game.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                <span>{t.creator}: <strong className="text-slate-200">{game.creator}</strong></span>
              </div>
            </div>

            {/* Favorite Button */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleFavoriteClick}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md border ${
                  isFavorite
                    ? 'bg-rose-500/25 border-rose-400/60 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-rose-300 hover:border-rose-400/40'
                }`}
                title={isFavorite ? t.favorite : t.favorites}
              >
                <motion.div
                  animate={likeBurst ? { scale: [1, 1.45, 1], rotate: [0, -15, 15, 0] } : {}}
                  transition={{ duration: 0.45 }}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
                </motion.div>
              </motion.button>

              {/* Heart burst */}
              <AnimatePresence>
                {likeBurst && (
                  <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 1, 0], y: -30, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute -top-3 -right-2 pointer-events-none flex gap-1"
                  >
                    <Sparkles className="w-4 h-4 text-rose-400 fill-rose-300" />
                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-3 rounded-2xl border border-white/5">
            {game.description}
          </p>

          {/* Stats Dashboard Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">{t.highScore}</span>
              <span className="text-sm sm:text-base font-black font-mono text-yellow-300">
                {stats.highScore.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">{t.totalPlays}</span>
              <span className="text-sm sm:text-base font-black font-mono text-cyan-300">
                {stats.plays.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-white/10 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">{t.difficulty}</span>
              <span className="text-sm sm:text-base font-black font-mono text-purple-300">
                {game.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Action Launch Bar */}
        <div className="pt-3 border-t border-white/10 mt-2 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono">
            {isUnlocked ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> {t.readyToPlay}
              </span>
            ) : (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Lock className="w-4 h-4" /> {game.costVCoins} VC
              </span>
            )}
          </div>

          <button
            onClick={handleAction}
            className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl font-black text-xs uppercase tracking-wider font-mono cursor-pointer transition-all active:scale-95 flex items-center gap-2 shadow-lg ${buttonStyleClass}`}
          >
            {isUnlocked ? (
              <>
                <Play className="w-4 h-4 fill-current" /> {t.playNow}
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" /> {t.unlock} ({game.costVCoins} VC)
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
