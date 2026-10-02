import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Check, Sparkles, Zap, Award, Search, Coins, Lock } from 'lucide-react';
import { audio } from '../utils/audio';
import { Achievement } from '../types';
import { Language, getTranslation } from '../utils/i18n';

interface AchievementsV3ModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  onClaimAchievement?: (achId: string) => void;
  language?: Language;
}

export function AchievementsV3Modal({
  isOpen,
  onClose,
  achievements,
  language = 'en'
}: AchievementsV3ModalProps) {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [search, setSearch] = useState('');

  const t = getTranslation(language);

  if (!isOpen) return null;

  const getCatCount = (catId: string) => {
    if (catId === 'all') return achievements.length;
    return achievements.filter(a => a.category === catId).length;
  };

  const categories = [
    { id: 'all', label: `${t.all} (${achievements.length})` },
    { id: 'gameplay', label: `${language === 'en' ? 'Gameplay 🎮' : language === 'es' ? 'Jugabilidad 🎮' : 'Gameplay 🎮'} (${getCatCount('gameplay')})` },
    { id: 'ranked', label: `${language === 'en' ? 'Ranked ⚔️' : language === 'es' ? 'Clasificatorio ⚔️' : 'Classé ⚔️'} (${getCatCount('ranked')})` },
    { id: 'story', label: `${language === 'en' ? 'Story 📖' : language === 'es' ? 'Historia 📖' : 'Histoire 📖'} (${getCatCount('story')})` },
    { id: 'trophy', label: `${language === 'en' ? 'Trophies 🏆' : language === 'es' ? 'Trofeos 🏆' : 'Trophées 🏆'} (${getCatCount('trophy')})` },
    { id: 'rng', label: `${language === 'en' ? 'RNG & Relics 🌌' : language === 'es' ? 'RNG y Reliquias 🌌' : 'RNG & Reliques 🌌'} (${getCatCount('rng')})` },
    { id: 'trade', label: `${language === 'en' ? 'Trades 🔄' : language === 'es' ? 'Intercambios 🔄' : 'Échanges 🔄'} (${getCatCount('trade')})` },
    { id: 'cosmetics', label: `${language === 'en' ? 'Cosmetics 👑' : language === 'es' ? 'Cosméticos 👑' : 'Cosmétiques 👑'} (${getCatCount('cosmetics')})` },
    { id: 'secret', label: `${language === 'en' ? 'Secrets 🔮' : language === 'es' ? 'Secretos 🔮' : 'Secrets 🔮'} (${getCatCount('secret')})` }
  ];

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  const getAchTitle = (ach: Achievement) => {
    if (language === 'fr') return ach.frenchTitle || ach.title;
    if (language === 'es') return ach.spanishTitle || ach.title;
    return ach.title;
  };

  const getAchDesc = (ach: Achievement) => {
    if (language === 'fr') return ach.frenchDescription || ach.description;
    if (language === 'es') return ach.spanishDescription || ach.description;
    return ach.description;
  };

  const getCatBadge = (cat: string) => {
    if (cat === 'gameplay') return 'GAMEPLAY';
    if (cat === 'ranked') return language === 'es' ? 'CLASIFICADO' : language === 'fr' ? 'CLASSÉ' : 'RANKED';
    if (cat === 'story') return language === 'es' ? 'HISTORIA' : language === 'fr' ? 'HISTOIRE' : 'STORY';
    if (cat === 'trophy') return language === 'es' ? 'TROFEOS' : language === 'fr' ? 'TROPHÉES' : 'TROPHIES';
    if (cat === 'rng') return 'RNG';
    if (cat === 'trade') return language === 'es' ? 'INTERCAMBIO' : language === 'fr' ? 'ÉCHANGE' : 'TRADE';
    if (cat === 'cosmetics') return language === 'es' ? 'COSMÉTICOS' : language === 'fr' ? 'COSMÉTIQUES' : 'COSMETICS';
    if (cat === 'secret') return language === 'es' ? 'SECRETO' : language === 'fr' ? 'SECRET' : 'SECRET';
    return cat.toUpperCase();
  };

  const filtered = achievements.filter(a => {
    const matchCat = selectedCat === 'all' || a.category === selectedCat;
    const title = getAchTitle(a);
    const desc = getAchDesc(a);
    const matchSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      desc.toLowerCase().includes(search.toLowerCase());
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
              <div className="w-11 h-11 rounded-2xl bg-orange-500/20 border border-orange-400/50 flex items-center justify-center text-orange-300 text-xl shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                🏆
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white font-mono tracking-tight flex items-center gap-1.5">
                    <span>{t.achievementsTitle}</span>
                    <span className="text-sm">🎃</span>
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-400/30">
                    300
                  </span>
                </div>
                <p className="text-xs text-orange-200/80">
                  {unlockedCount} / {achievements.length} {t.achievementsUnlockedCount} ({Math.round((unlockedCount / (achievements.length || 1)) * 100)}%) • 🍬 Spooky Edition
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
                placeholder={t.achievementsSearch}
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
            {filtered.map(ach => {
              const achTitle = getAchTitle(ach);
              const achDesc = getAchDesc(ach);

              return (
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
                      {achTitle}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {achDesc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="uppercase font-bold tracking-wider">{getCatBadge(ach.category)}</span>
                    <span className={ach.isUnlocked ? 'text-emerald-400 font-bold' : ''}>
                      {ach.isUnlocked ? t.achievementsCompleted : t.achievementsLocked}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>
              {language === 'fr' ? 'Débloquez des succès pour enrichir votre pactole de V-Coins' :
               language === 'es' ? 'Desbloquea logros para aumentar tu fortuna de V-Coins' :
               'Unlock achievements to expand your V-Coins treasure'}
            </span>
            <span className="text-amber-400 font-bold">Vertex Arcades</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
