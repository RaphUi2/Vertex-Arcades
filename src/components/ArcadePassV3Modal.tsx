import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Sparkles, Lock, Star, Coins, Zap } from 'lucide-react';
import { audio } from '../utils/audio';
import { ArcadePass } from '../types';
import { PASS_LEVELS_V3 } from '../gamesData';

interface ArcadePassV3ModalProps {
  isOpen: boolean;
  onClose: () => void;
  passState: ArcadePass;
  onClaimReward: (level: number, isPremium: boolean, rewardLabel: string, rewardType: string, rewardValue: any) => void;
  onUpgradeToPremium: () => void;
  userVCoins: number;
}

export function ArcadePassV3Modal({
  isOpen,
  onClose,
  passState,
  onClaimReward,
  onUpgradeToPremium,
  userVCoins
}: ArcadePassV3ModalProps) {
  if (!isOpen) return null;

  const currentLevel = passState.level;
  const currentXp = passState.xp;
  const xpPerLevel = 1000;
  const progressPct = Math.min(100, (currentXp / xpPerLevel) * 100);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-[#0f0c20] border-2 border-purple-500/60 rounded-3xl shadow-[0_0_60px_rgba(168,85,247,0.4)] flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/30 bg-[#090715]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 border border-purple-400 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                👑
              </div>
              <div>
                <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-200 to-indigo-300 font-mono">
                  PASS ARCADE v3.0
                </h2>
                <p className="text-xs text-purple-400 font-mono">
                  Saison 3 : Renaissance Métaverse • 50 Paliers Exclusifs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {!passState.isPremium && (
                <button
                  onClick={() => {
                    if (userVCoins >= 1000) {
                      audio.playWin();
                      onUpgradeToPremium();
                    }
                  }}
                  disabled={userVCoins < 1000}
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.5)] disabled:opacity-40 font-mono"
                >
                  Débloquer Pass VIP (1 000 VC)
                </button>
              )}
              <button
                onClick={() => { audio.playClick(); onClose(); }}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Level Progress Banner */}
          <div className="p-6 bg-[#16102a] border-b border-purple-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-600/30 border border-purple-400 flex items-center justify-center font-black text-2xl text-purple-300 font-mono">
                {currentLevel}
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-purple-300 uppercase">
                  NIVEAU DU PASS
                </span>
                <div className="text-xs text-slate-300 font-mono mt-0.5">
                  XP : {currentXp} / {xpPerLevel} ({Math.round(progressPct)}%)
                </div>
              </div>
            </div>

            <div className="w-full sm:w-64 h-3 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Levels Track Grid */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {PASS_LEVELS_V3.map((lvl) => {
              const isLevelReached = currentLevel >= lvl.level;
              const freeClaimed = passState.claimedFreeRewards.includes(lvl.level);
              const premClaimed = passState.claimedPremiumRewards.includes(lvl.level);

              const canClaimFree = isLevelReached && !freeClaimed;
              const canClaimPrem = isLevelReached && passState.isPremium && !premClaimed;

              return (
                <div
                  key={lvl.level}
                  className={`p-4 rounded-3xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
                    isLevelReached ? 'bg-[#181330] border-purple-500/50' : 'bg-[#0c0919] border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-500 text-purple-300 font-black font-mono flex items-center justify-center text-sm">
                      {lvl.level}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-sm font-mono">Palier {lvl.level}</h4>
                      <p className="text-xs text-slate-400">Gratuit: {lvl.freeReward.label}</p>
                    </div>
                  </div>

                  {/* Rewards Dual Track: Free & Premium */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Free Track */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-300">
                        {lvl.freeReward.label}
                      </span>
                      {freeClaimed ? (
                        <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300"><Check className="w-4 h-4" /></span>
                      ) : canClaimFree ? (
                        <button
                          onClick={() => {
                            audio.playWin();
                            onClaimReward(lvl.level, false, lvl.freeReward.label, lvl.freeReward.type, lvl.freeReward.value);
                          }}
                          className="px-3 py-1 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs uppercase cursor-pointer font-mono"
                        >
                          Récupérer
                        </button>
                      ) : (
                        <span className="p-1 text-slate-600"><Lock className="w-4 h-4" /></span>
                      )}
                    </div>

                    <div className="w-px h-6 bg-slate-800" />

                    {/* Premium Track */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                        <Crown className="w-3 h-3 text-yellow-400" /> {lvl.premiumReward.label}
                      </span>
                      {premClaimed ? (
                        <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300"><Check className="w-4 h-4" /></span>
                      ) : canClaimPrem ? (
                        <button
                          onClick={() => {
                            audio.playWin();
                            onClaimReward(lvl.level, true, lvl.premiumReward.label, lvl.premiumReward.type, lvl.premiumReward.value);
                          }}
                          className="px-3 py-1 rounded-xl bg-yellow-400 text-slate-950 font-black text-xs uppercase cursor-pointer font-mono"
                        >
                          VIP
                        </button>
                      ) : (
                        <span className="p-1 text-slate-600"><Lock className="w-4 h-4" /></span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
