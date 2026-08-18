import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Shield, Flame, Sparkles, Trophy, X, Zap, Award } from 'lucide-react';
import { UserProfile } from '../types';
import { CYBER_COMPANIONS_DATA } from './CyberCompanionsModal';

interface BossRaidArenaModalProps {
  show: boolean;
  onClose: () => void;
  profile: UserProfile;
  equippedCompanionId?: string;
  onVictoryReward: (pixels: number) => void;
}

export const BossRaidArenaModal: React.FC<BossRaidArenaModalProps> = ({
  show,
  onClose,
  profile,
  equippedCompanionId = 'none',
  onVictoryReward
}) => {
  const [bossHp, setBossHp] = useState(10000);
  const [bossMaxHp] = useState(10000);
  const [bossPhase, setBossPhase] = useState<'OVERLORD OMEGA-9' | 'NEON HYDRA' | 'CYBER KRAKEN'>('OVERLORD OMEGA-9');
  const [playerDamage, setPlayerDamage] = useState(0);
  const [ultimateCharge, setUltimateCharge] = useState(0);
  const [floatingHits, setFloatingHits] = useState<{ id: number; damage: number; x: number; y: number }[]>([]);
  const [bossDefeated, setBossDefeated] = useState(false);

  // Companion
  const companion = CYBER_COMPANIONS_DATA.find(c => c.id === equippedCompanionId) || CYBER_COMPANIONS_DATA[0];

  if (!show) return null;

  const handleAttack = (e: React.MouseEvent) => {
    if (bossDefeated) return;

    const hitDamage = Math.floor(Math.random() * 80) + 120;
    const newHp = Math.max(0, bossHp - hitDamage);
    setBossHp(newHp);
    setPlayerDamage(prev => prev + hitDamage);
    setUltimateCharge(prev => Math.min(100, prev + 8));

    // Add floating text
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newHit = { id: Date.now() + Math.random(), damage: hitDamage, x, y };
    setFloatingHits(prev => [...prev.slice(-6), newHit]);

    if (newHp === 0) {
      setBossDefeated(true);
      onVictoryReward(2500);
    }
  };

  const handleUltimate = () => {
    if (ultimateCharge < 100 || bossDefeated) return;

    const ultDmg = 1500;
    const newHp = Math.max(0, bossHp - ultDmg);
    setBossHp(newHp);
    setPlayerDamage(prev => prev + ultDmg);
    setUltimateCharge(0);

    if (newHp === 0) {
      setBossDefeated(true);
      onVictoryReward(2500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <Swords size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2">
                  ARÈNE RAID DE BOSS <span className="text-xs text-rose-400 font-bold">V2.1</span>
                </h2>
                <p className="text-xs text-slate-400">Attaquez le Boss & déclenchez le coup spécial de votre Compagnon !</p>
              </div>
            </div>

            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
              <X size={20} />
            </button>
          </div>

          {/* Boss Stage Box */}
          <div
            onClick={handleAttack}
            className="w-full h-72 sm:h-80 bg-gradient-to-b from-rose-950/80 via-slate-950 to-slate-950 border-2 border-rose-500/40 rounded-2xl p-4 flex flex-col items-center justify-between relative overflow-hidden cursor-crosshair select-none shadow-2xl"
          >
            {/* Boss Health Bar */}
            <div className="w-full max-w-md bg-slate-900/90 border border-rose-500/40 p-2.5 rounded-2xl shadow-lg z-10">
              <div className="flex items-center justify-between text-xs font-black mb-1">
                <span className="text-rose-400 uppercase tracking-wider">{bossPhase}</span>
                <span className="text-white">{bossHp} / {bossMaxHp} HP</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-rose-600 via-orange-500 to-amber-400 h-full transition-all duration-150 rounded-full"
                  style={{ width: `${(bossHp / bossMaxHp) * 100}%` }}
                />
              </div>
            </div>

            {/* Boss Avatar & Animation */}
            <div className="flex flex-col items-center justify-center relative my-auto">
              <motion.div
                animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="text-7xl sm:text-8xl filter drop-shadow-[0_0_30px_rgba(244,63,94,0.6)]"
              >
                👾
              </motion.div>

              {/* Floating Damage Numbers */}
              {floatingHits.map(hit => (
                <motion.span
                  key={hit.id}
                  initial={{ opacity: 1, y: hit.y, x: hit.x, scale: 1 }}
                  animate={{ opacity: 0, y: hit.y - 60, scale: 1.4 }}
                  transition={{ duration: 0.8 }}
                  className="absolute font-black text-yellow-300 text-lg sm:text-2xl pointer-events-none drop-shadow-[0_0_10px_rgba(234,179,8,1)]"
                >
                  -{hit.damage}
                </motion.span>
              ))}
            </div>

            {/* Bottom Controls inside arena */}
            <div className="w-full flex items-center justify-between z-10 border-t border-slate-800/80 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{companion.emoji}</span>
                <div>
                  <h4 className="text-xs font-black text-white">{companion.name}</h4>
                  <p className="text-[10px] text-cyan-400 font-bold">Dégâts infligés : {playerDamage} HP</p>
                </div>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); handleUltimate(); }}
                disabled={ultimateCharge < 100 || bossDefeated}
                className="px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 disabled:opacity-40 text-white font-black text-xs uppercase rounded-xl shadow-[0_0_15px_rgba(217,70,239,0.5)] transition cursor-pointer flex items-center gap-1.5"
              >
                <Zap size={15} /> Ultime Compagnon : {ultimateCharge}%
              </button>
            </div>

            {/* Defeated Overlay */}
            {bossDefeated && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 space-y-3"
              >
                <Trophy size={50} className="text-yellow-400 animate-bounce" />
                <h3 className="text-2xl font-black text-white">BOSS TERRASSÉ !</h3>
                <p className="text-xs text-slate-300">
                  Félicitations Pilot ! Vous et votre compagnon <span className="text-cyan-400 font-bold">{companion.name}</span> avez vaincu le Boss.
                </p>
                <div className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 font-black text-sm rounded-xl">
                  🎁 RÉCOMPENSE : +2 500 PX RÉCOLTÉS !
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-cyan-500 text-slate-950 font-black text-xs uppercase rounded-xl cursor-pointer hover:bg-cyan-400"
                >
                  Fermer & Continuer
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BossRaidArenaModal;
