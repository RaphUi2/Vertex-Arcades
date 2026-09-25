import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Check, Sparkles, Zap, Award, Search, Coins, Lock } from 'lucide-react';
import { audio } from '../utils/audio';
import { Achievement } from '../types';

interface AchievementsV3ModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  onClaimAchievement?: (achId: string) => void;
}

export function AchievementsV3Modal({
  isOpen,
  onClose,
  achievements
}: AchievementsV3ModalProps) {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Tous (200)' },
    { id: 'gameplay', label: 'Gameplay' },
    { id: 'ranked', label: 'Classé' },
    { id: 'trophy', label: 'Trophées' },
    { id: 'rng', label: 'RNG & Reliques' },
    { id: 'trade', label: 'Échanges' },
    { id: 'cosmetics', label: 'Cosmétiques' },
    { id: 'secret', label: 'Secrets' }
  ];

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  const filtered = achievements.filter(a => {
    const matchCat = selectedCat === 'all' || a.category === selectedCat;
    const matchSearch =
      a.frenchTitle.toLowerCase().includes(search.toLowerCase()) ||
      a.frenchDescription.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-[#0c1020] border-2 border-yellow-500/60 rounded-3xl shadow-[0_0_60px_rgba(234,179,8,0.4)] flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-yellow-500/30 bg-[#080d1a]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-600 border border-yellow-300 flex items-center justify-center text-slate-950 font-black text-2xl shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                🏆
              </div>
              <div>
                <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-500 font-mono">
                  LES 200 SUCCÈS D'ARCADE
                </h2>
                <p className="text-xs text-yellow-400 font-mono">
                  {unlockedCount} / 200 Débloqués ({Math.round((unlockedCount / 200) * 100)}%)
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

          {/* Search & Category Pills */}
          <div className="p-4 border-b border-slate-800 bg-[#080d1a]/60 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher parmi les 200 succès..."
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-yellow-400"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { audio.playClick(); setSelectedCat(cat.id); }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCat === cat.id
                      ? 'bg-yellow-400 text-slate-950 font-black shadow-[0_0_12px_rgba(250,204,21,0.6)]'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(ach => (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  ach.isUnlocked
                    ? 'bg-[#151c30] border-yellow-400/60 shadow-lg'
                    : 'bg-[#080c17] border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm">
                      {ach.isUnlocked ? '🌟' : '🔒'}
                    </span>
                    <span className="text-[11px] font-mono text-yellow-300 font-bold">
                      +{ach.vcoinReward} VC
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm font-mono mb-1">
                    {ach.frenchTitle}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {ach.frenchDescription}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="uppercase">{ach.category}</span>
                  <span className={ach.isUnlocked ? 'text-emerald-400 font-bold' : ''}>
                    {ach.isUnlocked ? 'COMPLÉTÉ' : 'VERROUILLÉ'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
