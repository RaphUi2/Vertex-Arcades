import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Sparkles, Check, Gift, Crown, Shield, Award, Zap, Coins } from 'lucide-react';
import { audio } from '../utils/audio';
import { APEX_TROPHY_ROAD } from '../gamesData';
import { Language, getTranslation } from '../utils/i18n';

interface TrophyRoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalTrophies: number;
  claimedMilestones: number[];
  onClaimMilestone: (trophiesRequired: number, rewardLabel: string, rewardType: string, rewardValue: any) => void;
  language?: Language;
}

export function ApexTrophyRoadModal({
  isOpen,
  onClose,
  totalTrophies,
  claimedMilestones,
  onClaimMilestone,
  language = 'en'
}: TrophyRoadModalProps) {
  const t = getTranslation(language);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="liquid-glass-container w-full max-w-4xl max-h-[92vh] rounded-3xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl relative border border-white/15 text-slate-100"
        >
          {/* Top Specular Glint */}
          <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-300/50 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.35)] text-xl">
                🏆
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white font-mono tracking-tight uppercase">
                    {t.trophyLeague}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    25 000 🏆 MAX
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {t.trophyRoadSubtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl liquid-glass-pill text-yellow-300 font-mono font-bold text-xs shadow-sm">
                <Trophy className="w-4 h-4 fill-current text-yellow-400" />
                <span>{totalTrophies.toLocaleString()} 🏆</span>
              </div>
              <button
                onClick={() => { audio.playClick(); onClose(); }}
                className="w-9 h-9 rounded-full liquid-glass-pill text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shadow-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Trophy Road Milestone Track */}
          <div className="flex-1 overflow-y-auto my-4 space-y-6 pr-2 no-scrollbar">
            <div className="relative pl-6 sm:pl-10 space-y-6 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-1 before:bg-gradient-to-b before:from-amber-400 before:via-yellow-300 before:to-amber-500 before:shadow-[0_0_12px_rgba(245,158,11,0.6)]">
              {APEX_TROPHY_ROAD.map((node) => {
                const isReached = totalTrophies >= node.trophiesRequired;
                const isClaimed = claimedMilestones.includes(node.trophiesRequired);
                const canClaim = isReached && !isClaimed;

                return (
                  <div key={node.trophiesRequired} className="relative flex items-center gap-4">
                    {/* Road Node Circle Badge */}
                    <div
                      className={`absolute -left-6 sm:-left-10 w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-mono font-bold text-xs sm:text-sm z-10 transition-all ${
                        isClaimed
                          ? 'bg-emerald-500/90 text-slate-950 border border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                          : canClaim
                          ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 border-2 border-white animate-bounce shadow-[0_0_20px_rgba(250,204,21,0.8)]'
                          : isReached
                          ? 'liquid-glass-pill text-yellow-300 border-amber-400/60'
                          : 'liquid-glass-pill text-slate-500 opacity-40 border-white/5'
                      }`}
                    >
                      {isClaimed ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                      ) : (
                        <span>{node.badgeIcon}</span>
                      )}
                    </div>

                    {/* Milestone Card */}
                    <div
                      className={`flex-1 p-4 rounded-3xl transition-all border ${
                        canClaim
                          ? 'liquid-glass-card border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.3)] bg-gradient-to-r from-amber-500/10 via-transparent to-transparent'
                          : isClaimed
                          ? 'liquid-glass-card border-white/10 opacity-75'
                          : isReached
                          ? 'liquid-glass-card border-white/15'
                          : 'bg-slate-950/40 border-white/5 opacity-50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                              {language === 'en' ? 'Tier' : language === 'es' ? 'Nivel' : 'Palier'} {node.trophiesRequired.toLocaleString()} 🏆
                            </span>
                            <span className="text-xs text-slate-400">·</span>
                            <span className="text-xs text-slate-300 font-mono">{node.leagueName}</span>
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-white font-mono mt-0.5 flex items-center gap-2">
                            <Gift className="w-4 h-4 text-amber-400" /> {node.rewardLabel}
                          </h4>
                        </div>

                        {/* Claim Button */}
                        <div>
                          {isClaimed ? (
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                              <Check className="w-3.5 h-3.5 stroke-[3]" /> {t.claimed}
                            </span>
                          ) : canClaim ? (
                            <button
                              onClick={() => {
                                audio.playWin();
                                onClaimMilestone(
                                  node.trophiesRequired,
                                  node.rewardLabel,
                                  node.rewardType,
                                  node.rewardValue
                                );
                              }}
                              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs font-mono uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.5)] active:scale-95 transition-all"
                            >
                              {t.claim} !
                            </button>
                          ) : (
                            <span className="text-[11px] font-mono text-slate-400">
                              {language === 'en' ? `Needs ${(node.trophiesRequired - totalTrophies).toLocaleString()} 🏆` :
                               language === 'es' ? `Faltan ${(node.trophiesRequired - totalTrophies).toLocaleString()} 🏆` :
                               `Manque ${(node.trophiesRequired - totalTrophies).toLocaleString()} 🏆`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>
              {language === 'en' ? '25,000 Trophies Road • 250 Milestones (Every 100 🏆)' :
               language === 'es' ? 'Camino de 25.000 Trofeos • 250 Recompensas (cada 100 🏆)' :
               'Route de 25 000 Trophées • 250 Récompenses (tous les 100 🏆)'}
            </span>
            <span className="text-amber-400 font-bold">{t.trophyLeague}</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
