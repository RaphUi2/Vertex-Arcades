import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Sparkles, Lock, Star, Coins, Zap } from 'lucide-react';
import { audio } from '../utils/audio';
import { ArcadePass } from '../types';
import { PASS_LEVELS_V3 } from '../gamesData';
import { Language, getTranslation } from '../utils/i18n';

interface ArcadePassV3ModalProps {
  isOpen: boolean;
  onClose: () => void;
  passState: ArcadePass;
  onClaimReward: (level: number, isPremium: boolean, rewardLabel: string, rewardType: string, rewardValue: any) => void;
  onUpgradeToPremium: () => void;
  userVCoins: number;
  language?: Language;
}

export function ArcadePassV3Modal({
  isOpen,
  onClose,
  passState,
  onClaimReward,
  onUpgradeToPremium,
  userVCoins,
  language = 'en'
}: ArcadePassV3ModalProps) {
  const t = getTranslation(language);

  if (!isOpen) return null;

  const currentLevel = passState.level;
  const currentXp = passState.xp;
  const xpPerLevel = 1000;
  const progressPct = Math.min(100, (currentXp / xpPerLevel) * 100);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="liquid-glass-container w-full max-w-4xl max-h-[92vh] rounded-3xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl relative border border-white/15 text-slate-100"
        >
          {/* Top Specular Glint & Corner Spiderweb */}
          <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-orange-400/60 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-12 w-12 h-12 pointer-events-none opacity-60">
            <svg viewBox="0 0 50 50" className="w-full h-full text-orange-400 fill-none stroke-current stroke-[1.2]">
              <path d="M50,0 Q25,0 0,0 M50,0 Q50,25 50,50 M50,0 L0,50" />
            </svg>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-orange-500/20">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-orange-500/20 border border-orange-400/50 flex items-center justify-center text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.4)] text-xl">
                🎃
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white font-mono tracking-tight uppercase flex items-center gap-1.5">
                    <span>{t.arcadePass}</span>
                    <span className="text-sm">👑</span>
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-400/30">
                    🎃 PASS HALLOWEEN
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-400/40 animate-pulse">
                    {language === 'en' ? 'Ends: Oct 31 at 14:00' : language === 'es' ? 'Fin: 31 oct. 14h' : 'Fin : 31 oct. à 14h'}
                  </span>
                </div>
                <p className="text-xs text-orange-200/80">
                  {t.arcadePassSubtitle} • 🍬 Débloquez les récompenses d'Halloween !
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!passState.isPremium && (
                <button
                  onClick={() => {
                    if (userVCoins >= 1000) {
                      audio.playWin();
                      onUpgradeToPremium();
                    }
                  }}
                  disabled={userVCoins < 1000}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.5)] disabled:opacity-40 font-mono transition-all active:scale-95"
                >
                  {t.upgradeVip}
                </button>
              )}
              <button
                onClick={() => { audio.playClick(); onClose(); }}
                className="w-9 h-9 rounded-full liquid-glass-pill text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shadow-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Level Progress Banner */}
          <div className="my-4 p-4 rounded-3xl liquid-glass-card border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl liquid-glass-pill border border-purple-400/60 flex items-center justify-center text-purple-300 font-mono font-black text-base shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                {currentLevel}
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                  {language === 'en' ? 'Current Tier: Level' : language === 'es' ? 'Nivel Actual:' : 'Palier Actuel : Niveau'} {currentLevel} / 50
                </span>
                <span className="text-[11px] font-mono text-slate-300">
                  {language === 'en' ? `${currentXp} / ${xpPerLevel} XP earned toward next tier` :
                   language === 'es' ? `${currentXp} / ${xpPerLevel} XP acumulados para el siguiente nivel` :
                   `${currentXp} / ${xpPerLevel} XP accumulés pour le niveau suivant`}
                </span>
              </div>
            </div>

            {/* XP Bar */}
            <div className="w-full sm:w-64 space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>{language === 'en' ? 'Progress' : language === 'es' ? 'Progreso' : 'Progression'}</span>
                <span className="text-cyan-300 font-bold">{Math.round(progressPct)}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-950/80 border border-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-400 to-cyan-300 transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* 50 Levels List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar">
            {PASS_LEVELS_V3.map((lvl) => {
              const isUnlocked = currentLevel >= lvl.level;
              const isFreeClaimed = passState.claimedFreeRewards.includes(lvl.level);
              const isPremiumClaimed = passState.claimedPremiumRewards.includes(lvl.level);
              const canClaimFree = isUnlocked && !isFreeClaimed;
              const canClaimPremium = isUnlocked && passState.isPremium && !isPremiumClaimed;

              return (
                <div
                  key={lvl.level}
                  className={`p-3.5 rounded-3xl transition-all border ${
                    isUnlocked
                      ? 'liquid-glass-card border-white/15'
                      : 'bg-slate-950/40 border-white/5 opacity-55'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Level Number Pill */}
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-mono font-bold text-xs border ${
                        isUnlocked ? 'liquid-glass-pill-active border-purple-400/80 text-white' : 'liquid-glass-pill text-slate-400'
                      }`}>
                        {lvl.level}
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-300 hidden sm:inline">
                        {language === 'en' ? 'Level' : language === 'es' ? 'Nivel' : 'Niveau'} {lvl.level}
                      </span>
                    </div>

                    {/* Free Reward */}
                    <div className="flex-1 p-2 rounded-2xl liquid-glass-pill border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-black text-cyan-400 uppercase">
                          {t.free.toUpperCase()} :
                        </span>
                        <span className="text-xs font-mono text-white line-clamp-1">{lvl.freeReward.label}</span>
                      </div>
                      {isFreeClaimed ? (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" /> {t.claimed}
                        </span>
                      ) : canClaimFree ? (
                        <button
                          onClick={() => {
                            audio.playWin();
                            onClaimReward(lvl.level, false, lvl.freeReward.label, lvl.freeReward.type, lvl.freeReward.value);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-[10px] font-mono font-black uppercase cursor-pointer transition-all active:scale-95"
                        >
                          {t.claim}
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400">{t.locked}</span>
                      )}
                    </div>

                    {/* VIP Reward */}
                    <div className="flex-1 p-2 rounded-2xl liquid-glass-pill border-amber-400/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-black text-amber-400 uppercase flex items-center gap-1">
                          <Crown className="w-3 h-3 text-amber-400" /> VIP :
                        </span>
                        <span className="text-xs font-mono text-amber-200 line-clamp-1">{lvl.premiumReward.label}</span>
                      </div>
                      {isPremiumClaimed ? (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" /> {t.claimed}
                        </span>
                      ) : canClaimPremium ? (
                        <button
                          onClick={() => {
                            audio.playWin();
                            onClaimReward(lvl.level, true, lvl.premiumReward.label, lvl.premiumReward.type, lvl.premiumReward.value);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-slate-950 text-[10px] font-mono font-black uppercase cursor-pointer transition-all active:scale-95"
                        >
                          {t.claim}
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> VIP
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>
              {language === 'en' ? 'XP earned by playing experiences and finishing missions' :
               language === 'es' ? 'XP obtenida jugando experiencias y completando misiones' :
               'XP obtenue en jouant et en complétant des missions'}
            </span>
            <span className="text-purple-400 font-bold">{t.arcadePass}</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
