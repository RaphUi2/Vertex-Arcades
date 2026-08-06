import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle2, Lock, Sparkles, X, Search, Zap, Award, Star, Flame } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  userPixels: number;
  onClaimAchievement: (achId: string, rewardPx: number) => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements,
  userPixels,
  onClaimAchievement
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;
  const progressPct = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = achievements.filter(a => {
    const matchesFilter =
      filter === 'all' ? true : filter === 'unlocked' ? a.isUnlocked : !a.isUnlocked;
    const matchesSearch =
      (a.frenchTitle || a.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.frenchDescription || a.description).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-slate-900/95 border border-yellow-500/40 rounded-2xl shadow-[0_0_60px_rgba(234,179,8,0.3)] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/90 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-500/20 border border-yellow-500/50 rounded-xl text-yellow-400">
                <Trophy size={26} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-wider flex items-center gap-2">
                  SUCCÈS & HAUTS FAITS <span className="text-xs bg-yellow-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">100 SUCCÈS</span>
                </h2>
                <p className="text-xs text-slate-400">Débloquez les succès pour gagner des milliers de Pixels !</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress Bar & Filter Bar */}
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs font-black uppercase">
              <span className="text-slate-300">Progression globale des succès</span>
              <span className="text-yellow-400">{unlockedCount} / {totalCount} ({progressPct}%)</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(234,179,8,0.6)]"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un succès..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div className="flex gap-2">
                {(['all', 'unlocked', 'locked'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase cursor-pointer border transition ${
                      filter === f
                        ? 'bg-yellow-500 text-slate-950 border-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.4)]'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    {f === 'all' ? 'Tout' : f === 'unlocked' ? 'Débloqués' : 'Verrouillés'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredAchievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                  ach.isUnlocked
                    ? 'bg-amber-950/20 border-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.15)]'
                    : 'bg-slate-950/60 border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl border flex items-center justify-center ${
                      ach.isUnlocked
                        ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                        : 'bg-slate-800/50 border-slate-700 text-slate-500'
                    }`}
                  >
                    {ach.isUnlocked ? <Trophy size={20} /> : <Lock size={20} />}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">{ach.frenchTitle || ach.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{ach.frenchDescription || ach.description}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-yellow-400 mt-1">
                      <Sparkles size={12} /> +{ach.pixelReward} PX
                    </span>
                  </div>
                </div>

                <div>
                  {ach.isUnlocked ? (
                    <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-[10px] font-black uppercase rounded-lg flex items-center gap-1">
                      <CheckCircle2 size={12} /> DÉBLOQUÉ
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-500 text-[10px] font-bold uppercase rounded-lg flex items-center gap-1">
                      <Lock size={12} /> À DÉBLOQUER
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
