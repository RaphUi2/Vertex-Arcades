import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, Sparkles, Gift, Package, ShieldAlert, Award, Trophy } from 'lucide-react';
import { audio } from '../utils/audio';

interface LootBoxesModalProps {
  show: boolean;
  onClose: () => void;
  totalPixels: number;
  onOpenBox: (cost: number, boxName: string) => void;
}

const BOX_TIERS = [
  {
    id: 'bronze',
    name: 'COFFRE BRONZE',
    cost: 100,
    minWin: 50,
    maxWin: 300,
    borderColor: 'border-amber-500/80',
    bgColor: 'bg-amber-950/40',
    glowColor: 'shadow-[0_0_25px_rgba(245,158,11,0.3)]',
    btnBg: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    icon: '📦',
    accentColor: '#f59e0b'
  },
  {
    id: 'epique',
    name: 'COFFRE ÉPIQUE',
    cost: 500,
    minWin: 300,
    maxWin: 1500,
    borderColor: 'border-purple-500/80',
    bgColor: 'bg-purple-950/40',
    glowColor: 'shadow-[0_0_30px_rgba(168,85,247,0.4)]',
    btnBg: 'bg-purple-500 hover:bg-purple-400 text-slate-950',
    icon: '🎁',
    accentColor: '#a855f7'
  },
  {
    id: 'mythique',
    name: 'COFFRE MYTHIQUE',
    cost: 1500,
    minWin: 1000,
    maxWin: 5000,
    borderColor: 'border-rose-500/90',
    bgColor: 'bg-rose-950/40',
    glowColor: 'shadow-[0_0_40px_rgba(244,63,94,0.5)]',
    btnBg: 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 hover:from-rose-400 hover:to-amber-300 text-slate-950',
    icon: '💎',
    accentColor: '#f43f5e'
  }
];

export const LootBoxesModal: React.FC<LootBoxesModalProps> = ({
  show,
  onClose,
  totalPixels,
  onOpenBox
}) => {
  const [openingBoxId, setOpeningBoxId] = useState<string | null>(null);

  if (!show) return null;

  const handleOpen = (box: typeof BOX_TIERS[0]) => {
    if (totalPixels < box.cost) {
      audio.playHit();
      return;
    }

    setOpeningBoxId(box.id);
    audio.playCoin();

    setTimeout(() => {
      onOpenBox(box.cost, box.name);
      setOpeningBoxId(null);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono select-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          className="bg-slate-950 border-2 border-rose-500/80 p-5 sm:p-6 rounded-3xl w-full max-w-3xl text-white relative shadow-[0_0_60px_rgba(244,63,94,0.35)] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-950 border border-rose-500 rounded-2xl text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                <Key size={24} className="animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-300 to-amber-300 uppercase tracking-widest">
                  COFFRES MYSTÈRES ARCADE
                </h3>
                <span className="text-[11px] text-slate-400 font-sans">
                  Ouvrez des coffres haute rareté • Solde actuel : <strong className="text-yellow-400">{totalPixels.toLocaleString()} PX</strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => { audio.playClick(); onClose(); }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-bold cursor-pointer text-xs transition-all"
            >
              ✕ FERMER
            </button>
          </div>

          {/* Grid of Chest Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-2">
            {BOX_TIERS.map((box) => {
              const isOpening = openingBoxId === box.id;
              const canAfford = totalPixels >= box.cost;

              return (
                <motion.div
                  key={box.id}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`relative p-5 rounded-2xl border-2 ${box.borderColor} ${box.bgColor} ${box.glowColor} flex flex-col justify-between text-center overflow-hidden transition-all`}
                >
                  {/* Glowing background rays */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                  {/* Icon with Shake / Burst Animation when Opening */}
                  <div className="relative my-3 flex flex-col items-center justify-center">
                    <motion.div
                      animate={isOpening ? { rotate: [-10, 10, -10, 10, 0], scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.5, repeat: isOpening ? Infinity : 0 }}
                      className="text-5xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                    >
                      {box.icon}
                    </motion.div>

                    {isOpening && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0.5, 2], opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="absolute w-24 h-24 rounded-full border-2 border-white pointer-events-none"
                      />
                    )}
                  </div>

                  <div>
                    <h4 className="font-black text-sm text-white uppercase tracking-wider mb-1">{box.name}</h4>
                    <p className="text-[11px] text-slate-300 font-sans">
                      Gain potentiel : <strong className="text-yellow-300">+{box.minWin} à +{box.maxWin} PX</strong>
                    </p>
                  </div>

                  {/* Button */}
                  <button
                    disabled={isOpening || !canAfford}
                    onClick={() => handleOpen(box)}
                    className={`mt-4 py-3 px-4 rounded-xl font-black text-xs uppercase cursor-pointer transition-all shadow-md flex items-center justify-center gap-1.5 ${
                      !canAfford
                        ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
                        : isOpening
                        ? 'bg-yellow-400 text-slate-950 animate-pulse'
                        : `${box.btnBg} scale-102`
                    }`}
                  >
                    {isOpening ? (
                      <>
                        <Sparkles size={14} className="animate-spin" /> OUVERTURE...
                      </>
                    ) : (
                      <>
                        OUVRIR ({box.cost} PX)
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>

          <p className="text-[10px] text-slate-400 italic text-center mt-3">
            💡 Astuce : Les coefficients du Système de Prestige augmentent directement vos récompenses de coffres !
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
