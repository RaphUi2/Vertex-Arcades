import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Sparkles, Check, Gift, Crown, Shield, Award, Zap, Coins } from 'lucide-react';
import { audio } from '../utils/audio';
import { APEX_TROPHY_ROAD } from '../gamesData';

interface TrophyRoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalTrophies: number;
  claimedMilestones: number[];
  onClaimMilestone: (trophiesRequired: number, rewardLabel: string, rewardType: string, rewardValue: any) => void;
}

export function ApexTrophyRoadModal({
  isOpen,
  onClose,
  totalTrophies,
  claimedMilestones,
  onClaimMilestone
}: TrophyRoadModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d1222] border-2 border-yellow-500/60 rounded-3xl shadow-[0_0_60px_rgba(234,179,8,0.4)] flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-yellow-500/30 bg-[#080d1a]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 via-amber-500 to-orange-600 border border-yellow-300 flex items-center justify-center text-slate-950 font-black text-2xl shadow-[0_0_20px_rgba(234,179,8,0.6)]">
                🏆
              </div>
              <div>
                <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-500 font-mono">
                  LIGUE STELLAIRE APEX
                </h2>
                <p className="text-xs text-yellow-400 font-mono">
                  Route des trophées et récompenses de prestige par paliers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-950/90 border border-yellow-500 text-yellow-300 font-mono font-bold text-sm shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                <Trophy className="w-4 h-4 fill-current text-yellow-400" />
                <span>{totalTrophies.toLocaleString()} 🏆</span>
              </div>
              <button
                onClick={() => { audio.playClick(); onClose(); }}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Trophy Road Milestone Track */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-1 before:bg-gradient-to-b before:from-yellow-400 before:via-amber-500 before:to-yellow-600">
              {APEX_TROPHY_ROAD.map((node) => {
                const isReached = totalTrophies >= node.trophiesRequired;
                const isClaimed = claimedMilestones.includes(node.trophiesRequired);
                const canClaim = isReached && !isClaimed;

                return (
                  <div key={node.trophiesRequired} className="relative flex items-center gap-4">
                    {/* Road Node Circle Badge */}
                    <div
                      className={`absolute -left-6 sm:-left-10 w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-bold text-sm z-10 transition-all ${
                        isClaimed
                          ? 'bg-emerald-500 text-slate-950 border-2 border-emerald-300 shadow-[0_0_15px_rgba(34,197,94,0.6)]'
                          : canClaim
                          ? 'bg-yellow-400 text-slate-950 border-2 border-white animate-bounce shadow-[0_0_20px_rgba(250,204,21,0.8)]'
                          : isReached
                          ? 'bg-amber-500 text-slate-950 border border-yellow-300'
                          : 'bg-slate-900 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {isClaimed ? <Check className="w-5 h-5 stroke-[3]" /> : <Trophy className="w-5 h-5" />}
                    </div>

                    {/* Milestone Card */}
                    <div
                      className={`flex-1 p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        canClaim
                          ? 'bg-[#181d30] border-yellow-400 shadow-[0_0_25px_rgba(234,179,8,0.3)]'
                          : isClaimed
                          ? 'bg-[#0a0f1c] border-slate-800 opacity-75'
                          : 'bg-[#0f1426] border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-yellow-400 uppercase">
                            {node.leagueName}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            • Palier {node.trophiesRequired} 🏆
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-base">
                          {node.rewardLabel}
                        </h4>
                      </div>

                      {/* Action Button */}
                      <div>
                        {isClaimed ? (
                          <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Récupéré
                          </span>
                        ) : canClaim ? (
                          <button
                            onClick={() => {
                              audio.playWin();
                              onClaimMilestone(node.trophiesRequired, node.rewardLabel, node.rewardType, node.rewardValue);
                            }}
                            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase cursor-pointer shadow-[0_0_20px_rgba(234,179,8,0.6)] animate-pulse transition-all font-mono"
                          >
                            RÉCUPÉRER 🎁
                          </button>
                        ) : (
                          <span className="px-4 py-1.5 rounded-full bg-slate-900 text-slate-500 font-mono text-xs border border-slate-800">
                            Verrouillé
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
