import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, RotateCcw, CheckCircle2, Gift, Sparkles, X } from 'lucide-react';
import { Quest } from '../types';

interface QuestsAndFlashModalProps {
  isOpen: boolean;
  onClose: () => void;
  quests: Quest[];
  userPixels: number;
  onClaimQuest: (questId: string, rewardPixels: number, rewardXp: number) => void;
  onResetQuests: () => void;
}

export const QuestsAndFlashModal: React.FC<QuestsAndFlashModalProps> = ({
  isOpen,
  onClose,
  quests,
  userPixels,
  onClaimQuest,
  onResetQuests
}) => {
  const [filter, setFilter] = useState<'all' | 'quests' | 'flash'>('all');

  if (!isOpen) return null;

  const filteredQuests = quests.filter(q => {
    if (filter === 'quests') return !q.isFlash;
    if (filter === 'flash') return q.isFlash;
    return true;
  });

  const canReset = userPixels >= 1000;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-slate-900/90 border border-emerald-500/40 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.3)] overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400">
                <Target size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2">
                  HQ QUÊTES & DÉFIS FLASH <span className="text-xs bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">V2.0</span>
                </h2>
                <p className="text-xs text-slate-400">Accomplissez vos objectifs quotidiens et défis éclair ⚡</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Subheader & Controls */}
          <div className="p-4 bg-slate-950/40 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition ${
                  filter === 'all'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white'
                }`}
              >
                Tout ({quests.length})
              </button>
              <button
                onClick={() => setFilter('quests')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition ${
                  filter === 'quests'
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white'
                }`}
              >
                Quêtes ({quests.filter(q => !q.isFlash).length})
              </button>
              <button
                onClick={() => setFilter('flash')}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition ${
                  filter === 'flash'
                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white'
                }`}
              >
                ⚡ Flash ({quests.filter(q => q.isFlash).length})
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={onResetQuests}
              disabled={!canReset}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-xs uppercase cursor-pointer border transition ${
                canReset
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 hover:bg-amber-500 hover:text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed'
              }`}
              title={canReset ? "Réinitialiser toutes vos quêtes" : "Nécessite 1 000 PX"}
            >
              <RotateCcw size={14} />
              <span>Réinitialiser (1 000 PX)</span>
            </button>
          </div>

          {/* Quests List */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1">
            {filteredQuests.map((quest) => {
              const progressPct = Math.min(100, (quest.current / quest.target) * 100);

              return (
                <div
                  key={quest.id}
                  className={`p-4 rounded-xl border transition flex items-center justify-between gap-4 ${
                    quest.isFlash
                      ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {quest.isFlash ? (
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 font-black text-[10px] rounded uppercase flex items-center gap-1 border border-amber-500/30">
                          <Zap size={10} /> FLASH x{quest.multiplier || 2}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-bold text-[10px] rounded uppercase">
                          QUOTIDIENNE
                        </span>
                      )}
                      <h4 className="font-extrabold text-sm text-slate-100">{quest.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{quest.description}</p>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            quest.isFlash ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">
                        {quest.current} / {quest.target}
                      </span>
                    </div>
                  </div>

                  {/* Reward & Action */}
                  <div className="flex flex-col items-end justify-center min-w-[100px]">
                    <div className="text-right mb-1">
                      <span className="text-xs font-black text-yellow-400 block">
                        +{quest.rewardPixels} PX
                      </span>
                      <span className="text-[10px] text-cyan-400 font-bold">
                        +{quest.rewardXp} XP
                      </span>
                    </div>

                    {quest.isClaimed ? (
                      <span className="flex items-center gap-1 text-[10px] text-slate-500 font-black uppercase tracking-wider py-1">
                        <CheckCircle2 size={12} /> RÉCOMPENSÉ
                      </span>
                    ) : quest.isCompleted ? (
                      <button
                        onClick={() => onClaimQuest(quest.id, quest.rewardPixels, quest.rewardXp)}
                        className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-black text-xs rounded-lg uppercase cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition animate-bounce"
                      >
                        Réclamer !
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-bold uppercase py-1">
                        En cours
                      </span>
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
};
