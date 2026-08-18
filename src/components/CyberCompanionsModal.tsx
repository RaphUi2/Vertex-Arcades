import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap, Sparkles, Award, Shield, Flame, X, Check, ShoppingBag, Swords, Gift } from 'lucide-react';
import { UserProfile } from '../types';

export interface CompanionItem {
  id: string;
  name: string;
  species: string;
  emoji: string;
  cost: number;
  perkDescription: string;
  gradient: string;
  bgGlow: string;
  accentText: string;
}

export const CYBER_COMPANIONS_DATA: CompanionItem[] = [
  {
    id: 'comp_panda',
    name: 'Neo Panda',
    species: 'Panda Cybernétique',
    emoji: '🐼',
    cost: 500,
    perkDescription: '+10% de Pixels gagnés dans tous les mini-jeux d\'arcade !',
    gradient: 'from-emerald-900 via-slate-900 to-cyan-950',
    bgGlow: 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]',
    accentText: 'text-emerald-400'
  },
  {
    id: 'comp_fox',
    name: 'Mecha Fox',
    species: 'Renard Quantique',
    emoji: '🦊',
    cost: 1000,
    perkDescription: '+15% de Bonus de Score dans les épreuves de Réflexe et Mémoire !',
    gradient: 'from-orange-900 via-slate-900 to-amber-950',
    bgGlow: 'border-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.4)]',
    accentText: 'text-orange-400'
  },
  {
    id: 'comp_dragon',
    name: 'Cyber Dragon',
    species: 'Dragon Impérial',
    emoji: '🐉',
    cost: 2500,
    perkDescription: '+25% de Pixels & +1 Clé d\'Or offerte chaque jour !',
    gradient: 'from-purple-900 via-slate-900 to-fuchsia-950',
    bgGlow: 'border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.5)]',
    accentText: 'text-purple-300'
  },
  {
    id: 'comp_slime',
    name: 'Glitch Slime',
    species: 'Entité Binaire',
    emoji: '👾',
    cost: 1500,
    perkDescription: '+20% de PTS de Rang supplémentaires en Saison Classée !',
    gradient: 'from-fuchsia-900 via-slate-900 to-pink-950',
    bgGlow: 'border-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.4)]',
    accentText: 'text-fuchsia-300'
  },
  {
    id: 'comp_phoenix',
    name: 'Quantum Phoenix',
    species: 'Oiseau Stellaire',
    emoji: '🦅',
    cost: 3500,
    perkDescription: '+30% d\'XP de Pass & Génère automatiquement +50 PX toutes les 30s !',
    gradient: 'from-amber-900 via-slate-900 to-yellow-950',
    bgGlow: 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.6)]',
    accentText: 'text-yellow-300'
  },
  {
    id: 'comp_owl',
    name: 'Synth Owl',
    species: 'Hibou Sage Cyber',
    emoji: '🦉',
    cost: 1200,
    perkDescription: '+25% de Récompense dans les épreuves de Logique & Math Blitz !',
    gradient: 'from-sky-900 via-slate-900 to-indigo-950',
    bgGlow: 'border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.4)]',
    accentText: 'text-sky-300'
  },
  {
    id: 'comp_doge',
    name: 'Synthwave Doge',
    species: 'Canin Rétro 80s',
    emoji: '🐶',
    cost: 800,
    perkDescription: '+15% de chance de doubler les récompenses dans la Roue & Coffres !',
    gradient: 'from-rose-900 via-slate-900 to-red-950',
    bgGlow: 'border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]',
    accentText: 'text-rose-300'
  },
  {
    id: 'comp_reaper',
    name: 'Void Reaper',
    species: 'Spectre du Néant',
    emoji: '💀',
    cost: 5000,
    perkDescription: '+35% de Multiplicateur de High Score sur toute l\'Arcade !',
    gradient: 'from-slate-900 via-slate-950 to-indigo-950',
    bgGlow: 'border-indigo-400 shadow-[0_0_35px_rgba(129,140,248,0.7)]',
    accentText: 'text-indigo-300'
  }
];

interface CyberCompanionsModalProps {
  show: boolean;
  onClose: () => void;
  profile: UserProfile;
  equippedCompanionId?: string;
  unlockedCompanionIds?: string[];
  companionLevels?: Record<string, number>;
  onUnlockCompanion: (companionId: string, cost: number) => void;
  onEquipCompanion: (companionId: string) => void;
  onFeedCompanion: (companionId: string, cost: number) => void;
  onOpenBossRaid: () => void;
}

export const CyberCompanionsModal: React.FC<CyberCompanionsModalProps> = ({
  show,
  onClose,
  profile,
  equippedCompanionId = 'none',
  unlockedCompanionIds = ['comp_panda'],
  companionLevels = { comp_panda: 1 },
  onUnlockCompanion,
  onEquipCompanion,
  onFeedCompanion,
  onOpenBossRaid
}) => {
  const [selectedCompId, setSelectedCompId] = useState<string>('comp_panda');

  if (!show) return null;

  const activeComp = CYBER_COMPANIONS_DATA.find(c => c.id === selectedCompId) || CYBER_COMPANIONS_DATA[0];
  const isUnlocked = unlockedCompanionIds.includes(activeComp.id);
  const isEquipped = equippedCompanionId === activeComp.id;
  const currentLevel = companionLevels[activeComp.id] || 1;

  const feedCost = currentLevel * 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-950 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header Title */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-400 flex items-center justify-center text-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.3)] text-2xl">
                🐉
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-wider flex items-center gap-2">
                  STUDIO COMPAGNONS CYBER <span className="px-2 py-0.5 text-xs bg-fuchsia-500/20 text-fuchsia-300 rounded-lg border border-fuchsia-500/40">V2.1</span>
                </h2>
                <p className="text-xs text-slate-400">Adoptez des mascottes d'arcade, nourrissez-les & combattez en Boss Raid !</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenBossRaid}
                className="px-4 py-2 bg-gradient-to-r from-rose-600 via-purple-600 to-rose-600 hover:from-rose-500 hover:to-purple-500 text-white font-black text-xs uppercase rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.4)] transition cursor-pointer flex items-center gap-1.5 animate-pulse"
              >
                <Swords size={16} /> Raid de Boss ⚔️
              </button>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-xl border border-slate-800 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Modal Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 overflow-y-auto flex-1 pr-1">
            {/* Left Column: Companion Select Grid */}
            <div className="md:col-span-5 grid grid-cols-2 gap-3">
              {CYBER_COMPANIONS_DATA.map(comp => {
                const unlocked = unlockedCompanionIds.includes(comp.id);
                const equipped = equippedCompanionId === comp.id;
                const isSelected = selectedCompId === comp.id;

                return (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedCompId(comp.id)}
                    className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col items-center justify-center cursor-pointer ${
                      isSelected
                        ? `${comp.bgGlow} bg-slate-900 scale-105 z-10`
                        : unlocked
                        ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/80 border-slate-900 opacity-60'
                    }`}
                  >
                    {equipped && (
                      <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-cyan-500 text-slate-950 text-[9px] font-black rounded-md flex items-center gap-0.5">
                        <Check size={10} /> ÉQUIPÉ
                      </span>
                    )}

                    <div className="text-4xl my-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                      {comp.emoji}
                    </div>

                    <h4 className="font-black text-xs text-white text-center">{comp.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold">{comp.species}</p>

                    {!unlocked && (
                      <span className="mt-1 text-[10px] font-black text-yellow-400 bg-yellow-950/60 px-2 py-0.5 rounded-full border border-yellow-500/40">
                        {comp.cost} PX
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Column: Selected Companion Details & Feeding Panel */}
            <div className={`md:col-span-7 bg-gradient-to-br ${activeComp.gradient} border border-slate-800 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl`}>
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-slate-950/70 border border-white/10 rounded-xl text-xs font-black text-white flex items-center gap-1.5">
                    <Sparkles size={14} className={activeComp.accentText} /> {activeComp.species}
                  </span>

                  <span className="text-xs font-black text-cyan-300 bg-slate-950/80 px-3 py-1 rounded-xl border border-cyan-500/30">
                    Niveau {currentLevel}
                  </span>
                </div>

                {/* Big Animated Mascot Showcase */}
                <div className="flex flex-col items-center justify-center my-4 text-center">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="text-7xl sm:text-8xl my-2 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                  >
                    {activeComp.emoji}
                  </motion.div>

                  <h3 className="text-2xl font-black text-white tracking-wider drop-shadow-md">
                    {activeComp.name}
                  </h3>
                  <p className={`text-xs font-bold mt-1 max-w-sm ${activeComp.accentText}`}>
                    ⚡ POUVOIR : {activeComp.perkDescription}
                  </p>
                </div>

                {/* Stats & Feeding */}
                {isUnlocked && (
                  <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 my-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <span className="flex items-center gap-1"><Heart size={14} className="text-rose-500" /> Affinité / Bonheur</span>
                      <span className="text-emerald-400">100%</span>
                    </div>

                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full w-full rounded-full" />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-black text-slate-300">
                  Solde : <span className="text-yellow-400">{profile.totalPixels} PX</span>
                </div>

                {isUnlocked ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onFeedCompanion(activeComp.id, feedCost)}
                      disabled={profile.totalPixels < feedCost}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs uppercase rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                    >
                      <Gift size={15} /> Nourrir (+1 Niv) : {feedCost} PX
                    </button>

                    <button
                      onClick={() => onEquipCompanion(activeComp.id)}
                      disabled={isEquipped}
                      className={`px-5 py-2.5 font-black text-xs uppercase rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                        isEquipped
                          ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                      }`}
                    >
                      {isEquipped ? 'Équipé ✓' : 'Équiper'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onUnlockCompanion(activeComp.id, activeComp.cost)}
                    disabled={profile.totalPixels < activeComp.cost}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs uppercase rounded-xl transition cursor-pointer flex items-center gap-2 shadow-[0_0_18px_rgba(52,211,153,0.5)]"
                  >
                    <ShoppingBag size={16} /> Adopter : {activeComp.cost} PX
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CyberCompanionsModal;
