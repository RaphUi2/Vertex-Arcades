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
    { id: 'all', label: `Tous (${achievements.length})` },
    { id: 'gameplay', label: 'Gameplay' },
    { id: 'story', label: 'Histoire 📖' },
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="liquid-glass-container w-full max-w-4xl max-h-[92vh] rounded-3xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl relative border border-white/15 text-slate-100"
        >
          {/* Top Specular Glint */}
          <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-300/40 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 text-xl shadow-[0_0_15px_rgba(245,158,11,0.35)]">
                🏆
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white font-mono tracking-tight">
                    LES {achievements.length} SUCCÈS D'ARCADE
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    LIQUID GLASS
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {unlockedCount} / {achievements.length} Débloqués ({Math.round((unlockedCount / achievements.length) * 100)}%)
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

          {/* Search & Category Pills */}
          <div className="pt-3 pb-3 border-b border-white/10 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Rechercher parmi les ${achievements.length} succès...`}
                className="w-full pl-10 pr-4 py-2 rounded-2xl liquid-glass-input text-xs text-white placeholder-slate-400 outline-none"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { audio.playClick(); setSelectedCat(cat.id); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCat === cat.id
                      ? 'liquid-glass-pill-active border-amber-400/80 text-white shadow-md'
                      : 'liquid-glass-pill text-slate-300 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="flex-1 overflow-y-auto my-3 p-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 no-scrollbar">
            {filtered.map(ach => (
              <div
                key={ach.id}
                className={`p-4 rounded-3xl border transition-all flex flex-col justify-between ${
                  ach.isUnlocked
                    ? 'liquid-glass-card border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'liquid-glass-card border-white/5 opacity-55'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-xl liquid-glass-pill flex items-center justify-center text-sm shadow-sm">
                      {ach.isUnlocked ? '🌟' : '🔒'}
                    </span>
                    <span className="text-[11px] font-mono text-yellow-300 font-bold liquid-glass-vc px-2.5 py-0.5 rounded-lg">
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

                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="uppercase">{ach.category}</span>
                  <span className={ach.isUnlocked ? 'text-emerald-400 font-bold' : ''}>
                    {ach.isUnlocked ? 'COMPLÉTÉ' : 'VERROUILLÉ'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Débloquez des succès pour enrichir votre pactole de V-Coins</span>
            <span className="text-amber-400 font-bold">Succès Liquid Glass</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
