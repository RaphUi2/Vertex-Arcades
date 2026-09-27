import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Check, Sparkles, Trophy, Coins, Zap, Play, Flame } from 'lucide-react';
import { audio } from '../utils/audio';
import { Quest } from '../types';

interface QuestsV3ModalProps {
  isOpen: boolean;
  onClose: () => void;
  quests: Quest[];
  onClaimQuest: (questId: string) => void;
  onLaunchGame: (gameId: string) => void;
}

export function QuestsV3Modal({
  isOpen,
  onClose,
  quests,
  onClaimQuest,
  onLaunchGame
}: QuestsV3ModalProps) {
  const [activeCategory, setActiveCategory] = useState<'daily' | 'weekly' | 'metaverse'>('daily');

  if (!isOpen) return null;

  const filteredQuests = quests.filter(q => (q.category || 'daily') === activeCategory);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="liquid-glass-container w-full max-w-3xl max-h-[92vh] rounded-3xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl relative border border-white/15 text-slate-100"
        >
          {/* Top Specular Glint */}
          <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-2xl text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                🎯
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white font-mono tracking-tight">
                    MISSIONS & QUÊTES LIQUID GLASS
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    SAISONNIER
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Défis quotidiens, hebdos et métaverse avec gains en V-Coins
                </p>
              </div>
            </div>

            <button
              onClick={() => { audio.playClick(); onClose(); }}
              className="w-9 h-9 rounded-full liquid-glass-pill text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shadow-sm transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Liquid Glass Category Tabs */}
          <div className="pt-3 pb-2 flex items-center gap-2 border-b border-white/10 overflow-x-auto no-scrollbar">
            {[
              { id: 'daily', label: 'Quotidiennes', icon: <Zap className="w-3.5 h-3.5 text-cyan-300" /> },
              { id: 'weekly', label: 'Hebdomadaires (2x)', icon: <Flame className="w-3.5 h-3.5 text-amber-400" /> },
              { id: 'metaverse', label: 'Événements Métaverse', icon: <Trophy className="w-3.5 h-3.5 text-purple-400" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { audio.playClick(); setActiveCategory(tab.id as any); }}
                className={`px-4 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeCategory === tab.id
                    ? 'liquid-glass-pill-active border-emerald-400/80 text-white shadow-md'
                    : 'liquid-glass-pill text-slate-300 hover:text-white'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Quests List */}
          <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-1 no-scrollbar">
            {filteredQuests.map(quest => {
              const progressPct = Math.min(100, (quest.current / quest.target) * 100);
              const isReadyToClaim = quest.current >= quest.target && !quest.isClaimed;

              return (
                <div
                  key={quest.id}
                  className={`p-4 rounded-3xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isReadyToClaim
                      ? 'liquid-glass-card border-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent'
                      : quest.isClaimed
                      ? 'liquid-glass-card border-white/5 opacity-60'
                      : 'liquid-glass-card border-white/10'
                  }`}
                >
                  <div className="flex-1 space-y-1.5 w-full">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm font-mono">{quest.title}</span>
                      {quest.multiplier && (
                        <span className="px-2 py-0.5 rounded-md bg-yellow-400/20 text-yellow-300 font-mono font-bold text-[10px] border border-yellow-400/40">
                          {quest.multiplier}x EXP
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{quest.description}</p>

                    {/* Progress Bar */}
                    <div className="pt-1.5 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-300">
                        <span>Progression</span>
                        <span>{quest.current} / {quest.target}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-950/80 border border-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions / Rewards */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-yellow-300 liquid-glass-vc px-3 py-1 rounded-xl">
                      <Coins className="w-3.5 h-3.5 fill-current text-yellow-400" />
                      <span>+{quest.rewardVCoins} VC</span>
                    </div>

                    {quest.isClaimed ? (
                      <span className="px-3.5 py-1.5 rounded-full text-emerald-400 font-mono text-xs font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Récupéré
                      </span>
                    ) : isReadyToClaim ? (
                      <button
                        onClick={() => {
                          audio.playWin();
                          onClaimQuest(quest.id);
                        }}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-bounce font-mono active:scale-95"
                      >
                        RÉCLAMER 🎁
                      </button>
                    ) : quest.gameId ? (
                      <button
                        onClick={() => {
                          audio.playClick();
                          onClose();
                          onLaunchGame(quest.gameId!);
                        }}
                        className="px-3.5 py-1.5 rounded-xl liquid-glass-pill hover:border-cyan-400 text-cyan-300 font-mono text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                      >
                        <Play className="w-3 h-3 fill-current" /> Jouer
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400">En cours...</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Réinitialisation quotidienne à minuit</span>
            <span className="text-emerald-400 font-bold">Missions Liquid Glass</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
