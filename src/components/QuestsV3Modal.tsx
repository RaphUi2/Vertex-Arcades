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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-[#0c1322] border-2 border-emerald-500/60 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.4)] flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/30 bg-[#080d1a]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-600 border border-emerald-400 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                🎯
              </div>
              <div>
                <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-green-400 font-mono">
                  MISSIONS & QUÊTES 3.0
                </h2>
                <p className="text-xs text-emerald-400 font-mono">
                  Défis quotidiens et métaverse avec récompenses en V-Coins et jetons de pass
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

          {/* Category Tabs */}
          <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-[#080d1a]/80">
            <button
              onClick={() => { audio.playClick(); setActiveCategory('daily'); }}
              className={`px-5 py-2.5 rounded-t-2xl font-bold text-xs uppercase transition-all cursor-pointer flex items-center gap-2 ${
                activeCategory === 'daily'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" /> Quotidiennes
            </button>
            <button
              onClick={() => { audio.playClick(); setActiveCategory('weekly'); }}
              className={`px-5 py-2.5 rounded-t-2xl font-bold text-xs uppercase transition-all cursor-pointer flex items-center gap-2 ${
                activeCategory === 'weekly'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4" /> Hebdomadaires (2x)
            </button>
            <button
              onClick={() => { audio.playClick(); setActiveCategory('metaverse'); }}
              className={`px-5 py-2.5 rounded-t-2xl font-bold text-xs uppercase transition-all cursor-pointer flex items-center gap-2 ${
                activeCategory === 'metaverse'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" /> Événements Métaverse
            </button>
          </div>

          {/* Quests List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {filteredQuests.map(quest => {
              const progressPct = Math.min(100, (quest.current / quest.target) * 100);
              const isReadyToClaim = quest.current >= quest.target && !quest.isClaimed;

              return (
                <div
                  key={quest.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isReadyToClaim
                      ? 'bg-[#132219] border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : quest.isClaimed
                      ? 'bg-[#09101c] border-slate-800 opacity-60'
                      : 'bg-[#0e1628] border-slate-800'
                  }`}
                >
                  <div className="flex-1 space-y-1.5 w-full">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base font-mono">{quest.title}</span>
                      {quest.multiplier && (
                        <span className="px-2 py-0.5 rounded-md bg-yellow-400/20 text-yellow-300 font-mono font-bold text-[10px] border border-yellow-400/40">
                          {quest.multiplier}x EXP
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{quest.description}</p>

                    {/* Progress Bar */}
                    <div className="pt-2 space-y-1">
                      <div className="flex justify-between text-[11px] font-mono text-slate-400">
                        <span>Progression</span>
                        <span>{quest.current} / {quest.target}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions / Rewards */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-yellow-300">
                      <Coins className="w-4 h-4 fill-current text-yellow-400" />
                      <span>+{quest.rewardVCoins} VC</span>
                    </div>

                    {quest.isClaimed ? (
                      <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Récupéré
                      </span>
                    ) : isReadyToClaim ? (
                      <button
                        onClick={() => {
                          audio.playWin();
                          onClaimQuest(quest.id);
                        }}
                        className="px-6 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black text-xs uppercase cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-bounce font-mono"
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
                        className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs flex items-center gap-1.5 cursor-pointer border border-cyan-500/30"
                      >
                        <Play className="w-3 h-3 fill-current" /> Jouer
                      </button>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-500">En cours...</span>
                    )}
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
