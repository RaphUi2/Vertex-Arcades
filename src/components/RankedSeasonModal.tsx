import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Shield, Crown, Sparkles, Timer, Play, CheckCircle2, Lock, X, Award } from 'lucide-react';
import { COMPETITIVE_RANKS, PRO_PASS_LEVELS } from '../gamesData';
import { RankedGameScores, ProPassState } from '../types';

interface RankedSeasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  rankPoints: number;
  rankedScores: RankedGameScores;
  proPass: ProPassState;
  onPlayRankedGame: (gameType: 'sprintReflex' | 'laserBlitz' | 'quantumTarget') => void;
  onClaimProPassReward: (level: number, isPro: boolean) => void;
}

export const RankedSeasonModal: React.FC<RankedSeasonModalProps> = ({
  isOpen,
  onClose,
  rankPoints,
  rankedScores,
  proPass,
  onPlayRankedGame,
  onClaimProPassReward
}) => {
  const [activeTab, setActiveTab] = useState<'ranked' | 'proPass'>('ranked');

  if (!isOpen) return null;

  // Calculate current rank
  const currentRank = COMPETITIVE_RANKS.slice().reverse().find(r => rankPoints >= r.minScore) || COMPETITIVE_RANKS[0];
  const nextRank = COMPETITIVE_RANKS.find(r => r.minScore > rankPoints);

  const totalScore = (rankedScores?.sprintReflex || 0) + (rankedScores?.laserBlitz || 0) + (rankedScores?.quantumTarget || 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-slate-900/95 border border-rose-500/40 rounded-2xl shadow-[0_0_60px_rgba(244,63,94,0.3)] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/90 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-400">
                <Trophy size={26} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-wider flex items-center gap-2">
                  MODE CLASSÉ SAISON 2 <span className="text-xs bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">🦖 APEX JURASSIQUE</span>
                </h2>
                <p className="text-xs text-slate-400">Affrontez les épreuves préhistoriques et hissez-vous au rang Apex Predator !</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-5 pt-3 bg-slate-950/50 border-b border-slate-800 flex justify-between items-center">
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('ranked')}
                className={`px-4 py-2 font-black text-xs uppercase rounded-t-xl cursor-pointer border-t border-x transition flex items-center gap-2 ${
                  activeTab === 'ranked'
                    ? 'bg-rose-500 text-slate-950 border-rose-400 shadow-[0_-5px_15px_rgba(244,63,94,0.3)]'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Trophy size={14} /> Saison 1 Compétitive
              </button>
              <button
                onClick={() => setActiveTab('proPass')}
                className={`px-4 py-2 font-black text-xs uppercase rounded-t-xl cursor-pointer border-t border-x transition flex items-center gap-2 ${
                  activeTab === 'proPass'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_-5px_15px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Award size={14} /> Pro Pass (Pass Classé)
              </button>
            </div>

            {/* Current Rank Badge */}
            <div className={`px-3 py-1 rounded-xl border text-xs font-black uppercase flex items-center gap-2 ${currentRank.badgeColor}`}>
              <Shield size={14} />
              <span>{currentRank.frenchName} ({rankPoints} RP)</span>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-5 overflow-y-auto flex-1 space-y-5">
            {activeTab === 'ranked' ? (
              <>
                {/* User Current Standing */}
                <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest block">Votre Rang Actuel</span>
                    <h3 className="text-2xl font-black text-white flex items-center gap-2">
                      {currentRank.frenchName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{currentRank.description}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Score Total 3 Épreuves</span>
                    <span className="text-2xl font-black text-amber-400">{totalScore} PTS</span>
                    {nextRank && (
                      <p className="text-[10px] text-slate-500 mt-0.5">Prochain rang dans {nextRank.minScore - rankPoints} RP</p>
                    )}
                  </div>
                </div>

                {/* 3 Ranked 60s Games */}
                <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Timer size={16} className="text-rose-400" /> LES 3 ÉPREUVES DE 60 SECONDES (SAISON 1)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Game 1 */}
                  <div className="p-4 bg-slate-950/80 border border-slate-800 hover:border-rose-500/50 rounded-2xl flex flex-col justify-between transition group">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="p-2 bg-rose-500/20 text-rose-400 rounded-xl font-bold text-xs">01</span>
                        <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 font-black text-[10px] rounded uppercase flex items-center gap-1">
                          <Timer size={10} /> 60 SECONDES
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-white group-hover:text-rose-400 transition">Sprint Réflexe 60s</h4>
                      <p className="text-xs text-slate-400 mt-1">Ciblez les nœuds lumineux en grille le plus vite possible pendant 60s.</p>
                      <div className="mt-3 p-2 bg-slate-900 rounded-lg text-xs flex justify-between font-bold">
                        <span className="text-slate-400">Meilleur Score :</span>
                        <span className="text-amber-400">{rankedScores?.sprintReflex || 0} PTS</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onPlayRankedGame('sprintReflex')}
                      className="mt-4 w-full py-2 bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs uppercase rounded-xl cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.4)] transition flex items-center justify-center gap-2"
                    >
                      <Play size={14} /> Jouer (60s)
                    </button>
                  </div>

                  {/* Game 2 */}
                  <div className="p-4 bg-slate-950/80 border border-slate-800 hover:border-rose-500/50 rounded-2xl flex flex-col justify-between transition group">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="p-2 bg-purple-500/20 text-purple-400 rounded-xl font-bold text-xs">02</span>
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 font-black text-[10px] rounded uppercase flex items-center gap-1">
                          <Timer size={10} /> 60 SECONDES
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-white group-hover:text-purple-400 transition">Laser Blitz 60s</h4>
                      <p className="text-xs text-slate-400 mt-1">Capturez des orbes bleues et évitez les faisceaux laser pendant 60s.</p>
                      <div className="mt-3 p-2 bg-slate-900 rounded-lg text-xs flex justify-between font-bold">
                        <span className="text-slate-400">Meilleur Score :</span>
                        <span className="text-amber-400">{rankedScores?.laserBlitz || 0} PTS</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onPlayRankedGame('laserBlitz')}
                      className="mt-4 w-full py-2 bg-purple-500 hover:bg-purple-400 text-white font-black text-xs uppercase rounded-xl cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.4)] transition flex items-center justify-center gap-2"
                    >
                      <Play size={14} /> Jouer (60s)
                    </button>
                  </div>

                  {/* Game 3 */}
                  <div className="p-4 bg-slate-950/80 border border-slate-800 hover:border-rose-500/50 rounded-2xl flex flex-col justify-between transition group">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl font-bold text-xs">03</span>
                        <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 font-black text-[10px] rounded uppercase flex items-center gap-1">
                          <Timer size={10} /> 60 SECONDES
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-white group-hover:text-cyan-400 transition">Quantum Target 60s</h4>
                      <p className="text-xs text-slate-400 mt-1">Stoppez le curseur oscillant en zone de surcharge critique.</p>
                      <div className="mt-3 p-2 bg-slate-900 rounded-lg text-xs flex justify-between font-bold">
                        <span className="text-slate-400">Meilleur Score :</span>
                        <span className="text-amber-400">{rankedScores?.quantumTarget || 0} PTS</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onPlayRankedGame('quantumTarget')}
                      className="mt-4 w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase rounded-xl cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)] transition flex items-center justify-center gap-2"
                    >
                      <Play size={14} /> Jouer (60s)
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Pro Pass Tab */
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-amber-950/60 to-slate-950 rounded-2xl border border-amber-500/40 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
                      <Award size={22} /> PRO PASS CLASSÉ (SAISON 1)
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">Gagnez des niveaux Pro Pass en jouant aux épreuves classées</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400">Niveau Pro Pass</span>
                    <span className="text-2xl font-black text-amber-400 block">{proPass.level} / 50</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {PRO_PASS_LEVELS.slice(0, 15).map((lvl) => {
                    const isUnlocked = proPass.level >= lvl.level;
                    const isClaimedFree = proPass.claimedFreeRewards.includes(lvl.level);
                    const isClaimedPro = proPass.claimedProRewards.includes(lvl.level);

                    return (
                      <div key={lvl.level} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center border border-amber-500/30">
                            {lvl.level}
                          </span>
                          <div>
                            <span className="text-xs font-extrabold text-white block">{lvl.freeReward.label}</span>
                            <span className="text-[10px] text-amber-300 font-bold">Pro : {lvl.premiumReward.label}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isUnlocked ? (
                            <button
                              onClick={() => onClaimProPassReward(lvl.level, false)}
                              disabled={isClaimedFree}
                              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition ${
                                isClaimedFree
                                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                  : 'bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer'
                              }`}
                            >
                              {isClaimedFree ? 'Réclamé' : 'Réclamer'}
                            </button>
                          ) : (
                            <span className="text-xs text-slate-600 font-bold flex items-center gap-1">
                              <Lock size={12} /> Niv {lvl.level}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
