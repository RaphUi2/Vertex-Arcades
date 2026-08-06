import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Shield, Sparkles, Flame, RotateCcw, Award, X } from 'lucide-react';
import { UserProfile } from '../types';

interface PrestigeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onPerformPrestige: () => void;
}

export const PrestigeModal: React.FC<PrestigeModalProps> = ({
  isOpen,
  onClose,
  profile,
  onPerformPrestige
}) => {
  if (!isOpen) return null;

  const currentPrestige = profile.prestigeLevel || 0;
  const nextPrestige = currentPrestige + 1;
  const currentMultiplier = 1 + currentPrestige * 0.25;
  const nextMultiplier = 1 + nextPrestige * 0.25;

  const requiredPixels = (currentPrestige + 1) * 5000;
  const canPrestige = profile.totalPixels >= requiredPixels;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900/95 border border-yellow-500/40 rounded-2xl shadow-[0_0_60px_rgba(234,179,8,0.3)] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/90 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-500/20 border border-yellow-500/50 rounded-xl text-yellow-400">
                <Star size={26} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2">
                  RÉSEAU DE PRESTIGE 2.0 <span className="text-xs bg-yellow-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">MULTIPLICATEUR PERMANENT</span>
                </h2>
                <p className="text-xs text-slate-400">Réinitialisez vos PX pour des étoiles de prestige permanentes</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Prestige Status */}
          <div className="p-6 space-y-5">
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-center space-y-2">
              <span className="text-xs font-black text-yellow-400 uppercase tracking-widest block">NIVEAU DE PRESTIGE ACTUEL</span>
              <div className="flex items-center justify-center gap-2">
                {Array.from({ length: Math.min(5, currentPrestige + 1) }).map((_, i) => (
                  <Star key={i} size={28} className="text-yellow-400 fill-yellow-400 animate-pulse" />
                ))}
              </div>
              <h3 className="text-3xl font-black text-white">Prestige Niveau {currentPrestige}</h3>
              <p className="text-xs text-slate-400">Multiplicateur permanent actif : <span className="text-emerald-400 font-bold">x{currentMultiplier.toFixed(2)} PX</span></p>
            </div>

            {/* Next Level Perks */}
            <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-2xl space-y-3">
              <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} /> AVANTAGES DU PRESTIGE {nextPrestige}
              </h4>
              <ul className="text-xs text-slate-300 space-y-2 font-bold">
                <li className="flex items-center gap-2 text-emerald-400">
                  ⚡ Multiplicateur permanent boosté à x{nextMultiplier.toFixed(2)} (+25% sur tous les gains)
                </li>
                <li className="flex items-center gap-2 text-yellow-400">
                  ⭐ Étoile de Prestige dorée exclusive sur votre profil
                </li>
                <li className="flex items-center gap-2 text-cyan-400">
                  🎁 +1 Clé d'Or de Coffre offerte
                </li>
              </ul>
            </div>

            {/* Action */}
            <div className="pt-2">
              <button
                onClick={onPerformPrestige}
                disabled={!canPrestige}
                className={`w-full py-3.5 rounded-xl font-black text-sm uppercase cursor-pointer transition flex items-center justify-center gap-2 shadow-lg ${
                  canPrestige
                    ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-950 shadow-[0_0_25px_rgba(234,179,8,0.5)] animate-bounce'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <RotateCcw size={18} />
                <span>
                  {canPrestige
                    ? `Passer au Prestige ${nextPrestige} (${requiredPixels} PX)`
                    : `Prestige ${nextPrestige} verrouillé (Requis: ${requiredPixels} PX)`}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
