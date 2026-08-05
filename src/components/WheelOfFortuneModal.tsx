import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Disc, Sparkles, Award, Star, Zap, Trophy } from 'lucide-react';
import { audio } from '../utils/audio';

interface WheelOfFortuneModalProps {
  show: boolean;
  onClose: () => void;
  totalPixels: number;
  onReward: (reward: { type: string; val: string | number; label: string }) => void;
}

const SEGMENTS = [
  { label: '30 PX', val: 30, type: 'px', color: '#06b6d4', bg: 'from-cyan-900 to-cyan-950' },
  { label: '75 PX', val: 75, type: 'px', color: '#a855f7', bg: 'from-purple-900 to-purple-950' },
  { label: '150 PX', val: 150, type: 'px', color: '#f43f5e', bg: 'from-rose-900 to-rose-950' },
  { label: '+1 NIV. PASS', val: 1, type: 'pass', color: '#38bdf8', bg: 'from-sky-900 to-sky-950' },
  { label: 'TITRE: CHANCEUX', val: 'CHANCEUX 🎰', type: 'title', color: '#facc15', bg: 'from-yellow-900 to-yellow-950' },
  { label: '250 PX', val: 250, type: 'px', color: '#34d399', bg: 'from-emerald-900 to-emerald-950' },
  { label: 'JACKPOT 500 PX', val: 500, type: 'px', color: '#fbbf24', bg: 'from-amber-800 to-amber-950' },
  { label: '50 PX', val: 50, type: 'px', color: '#ec4899', bg: 'from-pink-900 to-pink-950' }
];

export const WheelOfFortuneModal: React.FC<WheelOfFortuneModalProps> = ({
  show,
  onClose,
  totalPixels,
  onReward
}) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winningSegment, setWinningSegment] = useState<typeof SEGMENTS[0] | null>(null);

  if (!show) return null;

  const spinWheel = () => {
    if (spinning) return;

    audio.playCoin();
    setSpinning(true);
    setWinningSegment(null);

    // Pick random target segment (0 to 7)
    const segmentIndex = Math.floor(Math.random() * SEGMENTS.length);
    const segmentAngle = 360 / SEGMENTS.length;
    // Extra full turns + offset to point to the segment under top needle (270deg offset)
    const extraRotations = (5 + Math.floor(Math.random() * 4)) * 360;
    const targetAngle = extraRotations + (360 - (segmentIndex * segmentAngle + segmentAngle / 2));

    setRotation(prev => prev + targetAngle);

    setTimeout(() => {
      const winner = SEGMENTS[segmentIndex];
      setWinningSegment(winner);
      setSpinning(false);
      audio.playWin();
      onReward(winner);
    }, 4500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono select-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          className="bg-slate-950 border-2 border-yellow-400/90 p-5 sm:p-6 rounded-3xl w-full max-w-lg text-white relative shadow-[0_0_60px_rgba(234,179,8,0.4)] flex flex-col items-center overflow-hidden"
        >
          {/* Header */}
          <div className="w-full flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-yellow-500/20 border border-yellow-400 rounded-2xl text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                <Disc size={22} className={spinning ? 'animate-spin' : ''} />
              </div>
              <div>
                <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-500 uppercase tracking-widest">
                  ROUE DE LA FORTUNE NÉON
                </h3>
                <span className="text-[10px] text-slate-400 font-sans">
                  Tirage instantané d'arcade • Solde actuel : <strong className="text-yellow-400">{totalPixels.toLocaleString()} PX</strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => { audio.playClick(); onClose(); }}
              className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-bold cursor-pointer text-xs"
            >
              ✕ FERMER
            </button>
          </div>

          {/* Wheel Display Container */}
          <div className="relative my-4 flex flex-col items-center justify-center">
            {/* Top Pointer Needle */}
            <div className="absolute -top-3 z-30 flex flex-col items-center">
              <div className="w-6 h-6 bg-yellow-400 rotate-45 border-2 border-slate-950 shadow-[0_0_15px_#facc15] rounded-sm"></div>
              <div className="w-2 h-4 bg-yellow-300 -mt-2"></div>
            </div>

            {/* Glowing Outer Neon Ring */}
            <div className="p-3 rounded-full bg-gradient-to-br from-yellow-500/30 via-amber-500/20 to-purple-500/30 border-4 border-yellow-400 shadow-[0_0_40px_rgba(234,179,8,0.5)]">
              {/* Rotating SVG Wheel */}
              <div
                className="w-64 h-64 sm:w-72 sm:h-72 rounded-full relative transition-transform ease-[cubic-bezier(0.15,0.95,0.3,1)] duration-[4500ms]"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full rounded-full shadow-inner">
                  {SEGMENTS.map((seg, i) => {
                    const angle = 360 / SEGMENTS.length;
                    const startAngle = i * angle;
                    const endAngle = (i + 1) * angle;

                    const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                    const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                    const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                    const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

                    const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                    const textAngle = startAngle + angle / 2;
                    const textRad = (Math.PI * (textAngle - 90)) / 180;
                    const textX = 50 + 32 * Math.cos(textRad);
                    const textY = 50 + 32 * Math.sin(textRad);

                    return (
                      <g key={i}>
                        <path d={pathData} fill={seg.color} opacity={i % 2 === 0 ? 0.85 : 0.95} stroke="#020617" strokeWidth="0.8" />
                        <text
                          x={textX}
                          y={textY}
                          fill="#ffffff"
                          fontSize="3.8"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="central"
                          transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                        >
                          {seg.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Center Arcade Hub Button */}
                <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-slate-950 border-4 border-yellow-400 flex items-center justify-center shadow-[0_0_20px_#facc15] z-10">
                  <Sparkles size={20} className="text-yellow-400 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Victory Result Banner */}
          <AnimatePresence>
            {winningSegment && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="w-full bg-gradient-to-r from-yellow-950/90 via-amber-900/90 to-yellow-950/90 border-2 border-yellow-400 p-3 rounded-2xl text-center my-2 shadow-[0_0_25px_rgba(234,179,8,0.6)] animate-bounce"
              >
                <div className="flex items-center justify-center gap-2 text-yellow-300 font-black text-sm uppercase">
                  <Trophy size={18} /> GAGNÉ : {winningSegment.label} !
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Spin Trigger Button */}
          <button
            onClick={spinWheel}
            disabled={spinning}
            className={`w-full mt-3 py-3.5 px-6 rounded-2xl font-black text-xs uppercase transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(234,179,8,0.5)] ${
              spinning
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 hover:scale-[1.02]'
            }`}
          >
            <Disc size={16} className={spinning ? 'animate-spin' : ''} />
            {spinning ? 'TOURNEMENT MULTIDIMENSIONNEL EN COURS...' : '🎰 TOURNER LA ROUE DE FORTUNE !'}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
