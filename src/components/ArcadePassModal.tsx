import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Crown, Sparkles, Award, Lock, Check, Zap, Gift, ShieldAlert, Star, ChevronRight } from 'lucide-react';
import { PASS_LEVELS } from '../gamesData';
import { PassLevel, PassLevelReward } from '../types';
import { audio } from '../utils/audio';

interface ArcadePassModalProps {
  show: boolean;
  onClose: () => void;
  arcadePass: {
    level: number;
    xp: number;
    isPremium: boolean;
    claimedFreeRewards: number[];
    claimedPremiumRewards: number[];
  };
  totalPixels: number;
  onUnlockPremium: (cost: number) => void;
  onClaimReward: (level: number, isPremiumReward: boolean, reward: PassLevelReward) => void;
}

export const ArcadePassModal: React.FC<ArcadePassModalProps> = ({
  show,
  onClose,
  arcadePass,
  totalPixels,
  onUnlockPremium,
  onClaimReward
}) => {
  const [filterLevel, setFilterLevel] = useState<'all' | 'claimable' | 'unlocked'>('all');

  if (!show) return null;

  const passLevel = arcadePass?.level || 1;
  const passXp = arcadePass?.xp || 0;
  const isPremium = arcadePass?.isPremium || false;
  const claimedFree = arcadePass?.claimedFreeRewards || [];
  const claimedPremium = arcadePass?.claimedPremiumRewards || [];

  const xpRequiredForNext = 1000;
  const xpPercent = Math.min(100, Math.floor((passXp / xpRequiredForNext) * 100));

  // Count unclaimed rewards
  const unclaimedFreeCount = PASS_LEVELS.filter(
    l => l.level <= passLevel && !claimedFree.includes(l.level)
  ).length;

  const unclaimedPremiumCount = isPremium
    ? PASS_LEVELS.filter(l => l.level <= passLevel && !claimedPremium.includes(l.level)).length
    : 0;

  const totalUnclaimed = unclaimedFreeCount + unclaimedPremiumCount;

  const filteredLevels = PASS_LEVELS.filter(l => {
    if (filterLevel === 'claimable') {
      const freeCan = l.level <= passLevel && !claimedFree.includes(l.level);
      const premCan = isPremium && l.level <= passLevel && !claimedPremium.includes(l.level);
      return freeCan || premCan;
    }
    if (filterLevel === 'unlocked') {
      return l.level <= passLevel;
    }
    return true;
  });

  const getRewardIcon = (reward: PassLevelReward) => {
    if (reward.type === 'pixels') return <Sparkles size={18} className="text-yellow-400" />;
    if (reward.type === 'title') return <Award size={18} className="text-purple-400" />;
    if (reward.type === 'skin') return <Zap size={18} className="text-cyan-400" />;
    if (reward.type === 'aura') return <Flame size={18} className="text-rose-400" />;
    if (reward.type === 'color') return <Star size={18} className="text-fuchsia-400" />;
    return <Gift size={18} className="text-amber-400" />;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 font-mono select-none">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          className="bg-slate-950 border-2 border-rose-500/80 p-5 sm:p-6 rounded-3xl w-full max-w-5xl text-white relative max-h-[92vh] flex flex-col shadow-[0_0_60px_rgba(244,63,94,0.35)] overflow-hidden"
        >
          {/* Top Header Banner */}
          <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-rose-600 to-amber-600 border-2 border-yellow-400 rounded-2xl text-slate-950 shadow-[0_0_20px_rgba(244,63,94,0.6)]">
                <Flame size={26} className="animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-amber-200 to-yellow-400 uppercase tracking-widest flex items-center gap-2">
                  PASS ARCADE S2: CYBER MATRIX
                </h3>
                <p className="text-[11px] text-slate-400 font-sans">
                  Saison 2 • 100 Niveaux de récompenses exclusives & titres de prestige !
                </p>
              </div>
            </div>

            <button
              onClick={() => { audio.playClick(); onClose(); }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-rose-500 text-slate-300 hover:text-white font-bold cursor-pointer text-xs transition-all"
            >
              ✕ FERMER
            </button>
          </div>

          {/* Pass Status Showcase & Progress Gauge */}
          <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/70 border-2 border-rose-500/50 p-4 rounded-2xl mb-4 shrink-0 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
            {/* Level Badge & XP */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 via-amber-500 to-yellow-400 border-2 border-yellow-300 flex flex-col items-center justify-center text-slate-950 shrink-0 shadow-[0_0_20px_rgba(250,204,21,0.5)]">
                <span className="text-[9px] font-black uppercase tracking-widest leading-none">NIV.</span>
                <span className="text-2xl font-black leading-none">{passLevel}</span>
              </div>

              <div className="flex-1 min-w-[200px]">
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span className="text-rose-300 uppercase flex items-center gap-1.5">
                    <Zap size={14} className="text-yellow-400" /> PROGRESSION DU PASS
                  </span>
                  <span className="text-slate-300">
                    {passXp} / {xpRequiredForNext} XP ({xpPercent}%)
                  </span>
                </div>
                <div className="w-full h-3.5 bg-slate-950 border border-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-yellow-300 rounded-full transition-all duration-500 shadow-[0_0_12px_#facc15]"
                    style={{ width: `${xpPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Premium Status & Unlock Action */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              {isPremium ? (
                <div className="bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-500/20 border-2 border-yellow-400 px-4 py-2.5 rounded-2xl text-yellow-300 flex items-center gap-2.5 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                  <Crown size={22} className="text-yellow-400 animate-pulse" />
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest block text-yellow-400 leading-none">STATUT PASS</span>
                    <span className="text-xs font-black uppercase">CYBER PREMIUM ACTIF (+50% XP)</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (totalPixels >= 2500) {
                      audio.playWin();
                      onUnlockPremium(2500);
                    } else {
                      audio.playHit();
                    }
                  }}
                  className={`px-5 py-3 rounded-2xl font-black text-xs uppercase cursor-pointer transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(234,179,8,0.5)] ${
                    totalPixels >= 2500
                      ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 scale-105'
                      : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Crown size={18} className="text-slate-950" />
                  DÉBLOQUER PREMIUM (2 500 PX)
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex justify-between items-center mb-3 shrink-0 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { audio.playClick(); setFilterLevel('all'); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer border ${
                  filterLevel === 'all'
                    ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                TOUS NIVEAUX (100)
              </button>

              <button
                onClick={() => { audio.playClick(); setFilterLevel('claimable'); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer border flex items-center gap-1.5 ${
                  filterLevel === 'claimable'
                    ? 'bg-yellow-500 text-slate-950 border-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.4)]'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                🎁 À RÉCLAMER ({totalUnclaimed})
              </button>
            </div>

            <p className="text-[10px] text-slate-400 italic">
              💡 Jouez à n'importe quel jeu pour accumuler de l'XP de Pass à chaque partie !
            </p>
          </div>

          {/* Interactive Battle Pass Track List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filteredLevels.map((lvl) => {
              const isUnlocked = lvl.level <= passLevel;
              const isFreeClaimed = claimedFree.includes(lvl.level);
              const isPremClaimed = claimedPremium.includes(lvl.level);

              const canClaimFree = isUnlocked && !isFreeClaimed;
              const canClaimPrem = isPremium && isUnlocked && !isPremClaimed;

              return (
                <div
                  key={lvl.level}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${
                    isUnlocked
                      ? 'bg-slate-900/90 border-rose-500/40 hover:border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                      : 'bg-slate-950/60 border-slate-800/90 opacity-75'
                  }`}
                >
                  {/* Level Node Badge */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className={`w-12 h-12 rounded-2xl border-2 flex flex-col items-center justify-center font-black text-xs shrink-0 ${
                      isUnlocked
                        ? 'bg-rose-950 border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                        : 'bg-slate-950 border-slate-800 text-slate-600'
                    }`}>
                      <span className="text-[8px] uppercase tracking-tighter opacity-80">NIV.</span>
                      <span className="text-base leading-none">{lvl.level}</span>
                    </div>

                    <div>
                      <span className="font-black text-sm text-white block">NIVEAU {lvl.level}</span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border inline-block mt-0.5 ${
                        isUnlocked
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-slate-950 text-slate-600 border-slate-900'
                      }`}>
                        {isUnlocked ? '✓ DEBLOQUÉ' : '🔒 VERROUILLÉ'}
                      </span>
                    </div>
                  </div>

                  {/* Dual Rewards Container */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                    {/* Track 1: Free Reward */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg">
                          {getRewardIcon(lvl.freeReward)}
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">PISTE GRATUITE</span>
                          <span className="text-xs font-black text-white">{lvl.freeReward.label}</span>
                        </div>
                      </div>

                      {isFreeClaimed ? (
                        <span className="text-[9px] bg-slate-900 text-slate-500 font-bold px-2.5 py-1 rounded border border-slate-800 uppercase">
                          ✅ RÉCLAMÉ
                        </span>
                      ) : canClaimFree ? (
                        <button
                          onClick={() => {
                            audio.playWin();
                            onClaimReward(lvl.level, false, lvl.freeReward);
                          }}
                          className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-[10px] uppercase rounded-lg cursor-pointer shadow-[0_0_10px_rgba(234,179,8,0.4)] animate-bounce"
                        >
                          RÉCLAMER !
                        </button>
                      ) : (
                        <Lock size={14} className="text-slate-600 mr-2" />
                      )}
                    </div>

                    {/* Track 2: Premium Reward */}
                    <div className={`p-3 rounded-xl border flex justify-between items-center ${
                      isPremium
                        ? 'bg-amber-950/30 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                        : 'bg-slate-950/80 border-slate-800 opacity-60'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-yellow-500/20 border border-yellow-400/40 rounded-lg text-yellow-300">
                          {getRewardIcon(lvl.premiumReward)}
                        </div>
                        <div>
                          <span className="text-[9px] text-yellow-400 font-bold uppercase block leading-none flex items-center gap-1">
                            <Crown size={10} /> PISTE PREMIUM
                          </span>
                          <span className="text-xs font-black text-amber-200">{lvl.premiumReward.label}</span>
                        </div>
                      </div>

                      {!isPremium ? (
                        <span className="text-[9px] bg-yellow-950/50 text-yellow-500 font-bold px-2 py-1 rounded border border-yellow-900 uppercase flex items-center gap-1">
                          <Lock size={10} /> REQUIS
                        </span>
                      ) : isPremClaimed ? (
                        <span className="text-[9px] bg-slate-900 text-slate-500 font-bold px-2.5 py-1 rounded border border-slate-800 uppercase">
                          ✅ RÉCLAMÉ
                        </span>
                      ) : canClaimPrem ? (
                        <button
                          onClick={() => {
                            audio.playWin();
                            onClaimReward(lvl.level, true, lvl.premiumReward);
                          }}
                          className="px-3 py-1 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-[10px] uppercase rounded-lg cursor-pointer shadow-[0_0_10px_rgba(234,179,8,0.5)] animate-bounce"
                        >
                          RÉCLAMER !
                        </button>
                      ) : (
                        <Lock size={14} className="text-slate-600 mr-2" />
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
};
