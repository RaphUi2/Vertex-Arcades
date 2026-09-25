import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Shield, Flame, Play, Zap, Crown, Award, Sparkles } from 'lucide-react';
import { audio } from '../utils/audio';
import { RANKED_TIERS_V3, GAMES_LIST, RANKED_GAMES_IDS } from '../gamesData';

interface RankedV3ModalProps {
  isOpen: boolean;
  onClose: () => void;
  rankPoints: number;
  onLaunchRankedGame: (gameId: string) => void;
}

export function RankedV3Modal({
  isOpen,
  onClose,
  rankPoints,
  onLaunchRankedGame
}: RankedV3ModalProps) {
  if (!isOpen) return null;

  // Determine current tier
  let currentTier = RANKED_TIERS_V3[0];
  let nextTier = RANKED_TIERS_V3[1];
  for (let i = 0; i < RANKED_TIERS_V3.length; i++) {
    if (rankPoints >= RANKED_TIERS_V3[i].minPoints) {
      currentTier = RANKED_TIERS_V3[i];
      nextTier = RANKED_TIERS_V3[i + 1] || RANKED_TIERS_V3[i];
    }
  }

  const currentTierMin = currentTier.minPoints;
  const nextTierMin = nextTier.minPoints;
  const progressPercent = nextTierMin > currentTierMin
    ? Math.min(100, Math.max(0, ((rankPoints - currentTierMin) / (nextTierMin - currentTierMin)) * 100))
    : 100;

  const rankedGames = GAMES_LIST.filter(g => RANKED_GAMES_IDS.includes(g.id));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-[#0d0d1c] border-2 border-red-500/60 rounded-3xl shadow-[0_0_60px_rgba(239,68,68,0.4)] flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-red-500/30 bg-[#080816]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-orange-500 border border-red-400 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                🔥
              </div>
              <div>
                <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-300 to-amber-400 font-mono">
                  MODE CLASSÉ v3.0
                </h2>
                <p className="text-xs text-red-400 font-mono">
                  3 Épreuves de Maîtrise • Plus vous jouez et performez, plus vous gagnez de RP !
                </p>
              </div>
            </div>

            <button
              onClick={() => { audio.playClick(); onClose(); }}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Rank Status Emblem Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-red-950/40 via-slate-900 to-[#120a16] border border-red-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-red-600 to-amber-500 border-2 border-white flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(239,68,68,0.7)] animate-pulse">
                  {currentTier.id === 'apex_god' ? '🌌' : currentTier.id === 'maitre' ? '👑' : currentTier.id === 'diamant' ? '💎' : '🛡️'}
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
                    RANG ACTUEL
                  </span>
                  <h3 className="text-2xl font-black text-white font-mono mt-0.5">
                    {currentTier.frenchName}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 font-mono">
                    <strong className="text-amber-400 text-sm">{rankPoints.toLocaleString()} RP</strong>
                    {nextTierMin > rankPoints && ` • Prochain rang : ${nextTier.frenchName} (${nextTierMin} RP)`}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full sm:w-48 space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Progression</span>
                  <span className="text-white font-bold">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-700 overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-400 shadow-[0_0_10px_rgba(239,68,68,0.8)] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* The 3 Dedicated Ranked Games */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                <Zap className="w-4 h-4 text-red-400" /> Les 3 Épreuves Officielles :
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {rankedGames.map(game => (
                  <div
                    key={game.id}
                    className="p-5 rounded-3xl bg-[#140e1f] border-2 border-red-500/40 hover:border-red-400 hover:bg-[#1a1228] transition-all flex flex-col justify-between group shadow-lg"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-400 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                        {game.id === 'titan_core' ? '🤖' : game.id === 'quantum_obby' ? '🏃' : '⚔️'}
                      </div>
                      <h5 className="font-bold text-white text-base font-mono mb-1">{game.frenchName}</h5>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{game.description}</p>
                    </div>

                    <button
                      onClick={() => {
                        audio.playStart();
                        onLaunchRankedGame(game.id);
                      }}
                      className="mt-5 w-full py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer flex items-center justify-center gap-2 transition-all font-mono"
                    >
                      <Play className="w-4 h-4 fill-current" /> JOUER EN CLASSÉ
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Ranked Rules Explainer */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1 font-mono">
              <p className="text-white font-bold">⚡ RÈGLES DU CLASSÉ v3.0 :</p>
              <p>• Aucune quête, aucun pass requis : la montée en rang est purement basée sur vos runs et vos scores.</p>
              <p>• Plus vous lancez de parties sur ces 3 épreuves, plus vous accumulez des points de maîtrise.</p>
              <p>• Chaque record personnel débloque un gros bonus de RP immédiat !</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
