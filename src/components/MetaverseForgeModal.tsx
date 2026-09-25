import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Flame, ShieldAlert, Zap, Skull, Award, Coins } from 'lucide-react';
import { audio } from '../utils/audio';
import { WorldBossState } from '../types';

interface MetaverseForgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  worldBoss: WorldBossState;
  onDealBossDamage: (damage: number) => void;
  inventory: Record<string, number>;
  onFuseArtifact: () => void;
  userVCoins: number;
}

export function MetaverseForgeModal({
  isOpen,
  onClose,
  worldBoss,
  onDealBossDamage,
  inventory,
  onFuseArtifact,
  userVCoins
}: MetaverseForgeModalProps) {
  const [activeTab, setActiveTab] = useState<'boss' | 'forge'>('boss');
  const [isStriking, setIsStriking] = useState(false);

  if (!isOpen) return null;

  const bossHpPct = Math.max(0, (worldBoss.currentHp / worldBoss.maxHp) * 100);

  // Community Direct Strike
  const handleStrike = () => {
    if (userVCoins < 30 || isStriking) return;
    setIsStriking(true);
    audio.playLaser();
    audio.playExplosion();

    const damage = Math.floor(Math.random() * 2500) + 1500;
    onDealBossDamage(damage);

    setTimeout(() => {
      setIsStriking(false);
    }, 400);
  };

  const totalRelicsOwned = Object.values(inventory).reduce((a, b) => a + b, 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-[#120a1c] border-2 border-fuchsia-500/60 rounded-3xl shadow-[0_0_60px_rgba(217,70,239,0.4)] flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-fuchsia-500/30 bg-[#090510]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-rose-600 border border-fuchsia-400 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(217,70,239,0.5)]">
                🌌
              </div>
              <div>
                <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-300 to-rose-400 font-mono">
                  FORGE QUANTIQUE & WORLD BOSS RAID
                </h2>
                <p className="text-xs text-fuchsia-400 font-mono">
                  Événement Métaverse Mondial : Combattez le Titan Glitch et fusionnez vos reliques
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

          {/* Navigation */}
          <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-[#090510]">
            <button
              onClick={() => { audio.playClick(); setActiveTab('boss'); }}
              className={`px-5 py-2.5 rounded-t-2xl font-bold text-xs uppercase transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'boss'
                  ? 'bg-fuchsia-600 text-white font-black shadow-[0_0_15px_rgba(217,70,239,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Skull className="w-4 h-4" /> Raid Boss : Titan Glitch Omni
            </button>
            <button
              onClick={() => { audio.playClick(); setActiveTab('forge'); }}
              className={`px-5 py-2.5 rounded-t-2xl font-bold text-xs uppercase transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'forge'
                  ? 'bg-fuchsia-600 text-white font-black shadow-[0_0_15px_rgba(217,70,239,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Laboratoire de Fusion (3x)
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: WORLD BOSS RAID */}
            {activeTab === 'boss' && (
              <div className="space-y-6">
                {/* Boss Visualizer Card */}
                <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1a0e28] to-[#0d0714] border-2 border-fuchsia-500/50 flex flex-col items-center text-center overflow-hidden shadow-2xl">
                  {/* Glowing Aura Effect */}
                  <div className="absolute inset-0 bg-radial from-fuchsia-600/20 to-transparent pointer-events-none" />

                  <motion.div
                    animate={isStriking ? { scale: [1, 1.25, 0.9, 1], rotate: [-5, 5, 0] } : { y: [-6, 6, -6] }}
                    transition={isStriking ? { duration: 0.3 } : { repeat: Infinity, duration: 4 }}
                    className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-rose-600 via-fuchsia-600 to-indigo-800 border-4 border-fuchsia-300 flex items-center justify-center text-6xl shadow-[0_0_50px_rgba(217,70,239,0.8)] mb-4"
                  >
                    👾
                  </motion.div>

                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40 mb-1">
                    BOSS MONDIAL DE SERVEUR
                  </span>
                  <h3 className="text-2xl font-black text-white font-mono tracking-wider">
                    {worldBoss.name}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md mt-1">
                    Chaque run d'arcade effectuée sur Vertex Arcades inflige des dégâts en direct au Titan !
                  </p>

                  {/* Community HP Bar */}
                  <div className="w-full max-w-lg mt-6 space-y-1.5">
                    <div className="flex justify-between text-xs font-mono font-bold">
                      <span className="text-rose-400">PV Restants</span>
                      <span className="text-white font-mono">
                        {worldBoss.currentHp.toLocaleString()} / {worldBoss.maxHp.toLocaleString()} HP ({Math.round(bossHpPct)}%)
                      </span>
                    </div>
                    <div className="w-full h-4 rounded-full bg-slate-900 border border-fuchsia-500/50 overflow-hidden p-0.5 shadow-inner">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-rose-600 via-fuchsia-500 to-purple-500 shadow-[0_0_15px_rgba(244,63,94,0.8)] transition-all duration-300"
                        style={{ width: `${bossHpPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Strike Button */}
                  <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={handleStrike}
                      disabled={userVCoins < 30 || isStriking}
                      className="px-8 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-400 hover:to-fuchsia-500 active:scale-95 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(244,63,94,0.6)] cursor-pointer flex items-center gap-2 font-mono"
                    >
                      <Zap className="w-4 h-4 fill-current" /> FRAPPE TACTIQUE (-30 VC)
                    </button>
                    <span className="text-xs font-mono text-cyan-300">
                      Vos dégâts totaux : {worldBoss.playerTotalDamage.toLocaleString()} DMG
                    </span>
                  </div>
                </div>

                {/* Community Jackpots Milestones */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-fuchsia-500/30">
                    <div className="text-xs font-mono text-fuchsia-400 font-bold mb-1">Palier 75% HP</div>
                    <p className="text-sm font-bold text-white">Cagnotte +2 500 VC</p>
                    <p className="text-[11px] text-slate-400 mt-1">Distribué à tous les participants du serveur.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-fuchsia-500/30">
                    <div className="text-xs font-mono text-fuchsia-400 font-bold mb-1">Palier 50% HP</div>
                    <p className="text-sm font-bold text-white">5x Tirages Mythiques</p>
                    <p className="text-[11px] text-slate-400 mt-1">Multiplicateur de chance x10 garanti.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-fuchsia-500/30">
                    <div className="text-xs font-mono text-fuchsia-400 font-bold mb-1">DÉFAITE DU BOSS</div>
                    <p className="text-sm font-bold text-yellow-300">DOMINUS APEX JACKPOT 👑</p>
                    <p className="text-[11px] text-slate-400 mt-1">Titre divin + 10 000 V-Coins pour tous.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: FUSION FORGE */}
            {activeTab === 'forge' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-fuchsia-500/30 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-400 mx-auto flex items-center justify-center text-3xl">
                    ⚗️
                  </div>
                  <h3 className="text-lg font-bold text-white font-mono">
                    Laboratoire de Transmutation Quantique
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Combinez 3 doublons de votre collection pour forger une Relique Overclockée conférant des bonus passifs permanents (+20% V-Coins).
                  </p>

                  <div className="flex justify-center items-center gap-3 pt-2">
                    <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-fuchsia-400/60 bg-slate-950 flex items-center justify-center text-xs font-mono text-slate-500">
                      Item 1
                    </div>
                    <span className="text-fuchsia-400 font-bold">+</span>
                    <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-fuchsia-400/60 bg-slate-950 flex items-center justify-center text-xs font-mono text-slate-500">
                      Item 2
                    </div>
                    <span className="text-fuchsia-400 font-bold">+</span>
                    <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-fuchsia-400/60 bg-slate-950 flex items-center justify-center text-xs font-mono text-slate-500">
                      Item 3
                    </div>
                    <span className="text-fuchsia-400 font-bold">=</span>
                    <div className="w-16 h-16 rounded-2xl border-2 border-fuchsia-400 bg-fuchsia-950/80 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(217,70,239,0.6)]">
                      🔮
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (totalRelicsOwned < 3) return;
                      audio.playPowerup();
                      onFuseArtifact();
                    }}
                    disabled={totalRelicsOwned < 3}
                    className="mt-4 px-8 py-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 disabled:opacity-40 text-white font-black text-xs uppercase cursor-pointer shadow-[0_0_20px_rgba(217,70,239,0.5)] font-mono"
                  >
                    FUSIONNER 3 RELIQUES ({totalRelicsOwned} possédées)
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
