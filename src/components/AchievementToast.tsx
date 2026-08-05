import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Award, Sparkles, Zap, Flame, Star, CheckCircle } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  scale: number;
  delay: number;
  duration: number;
  shape: 'circle' | 'star' | 'square' | 'ring';
}

interface AchievementToastProps {
  notification: string | null;
  onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ notification, onClose }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (notification) {
      // Generate 30 dynamic burst particles around the toast container
      const colors = ['#facc15', '#06b6d4', '#a855f7', '#f43f5e', '#3b82f6', '#34d399', '#ffffff'];
      const shapes: ('circle' | 'star' | 'square' | 'ring')[] = ['circle', 'star', 'square', 'ring'];
      const newParticles: Particle[] = [];

      for (let i = 0; i < 32; i++) {
        const angle = (i / 32) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const distance = 80 + Math.random() * 160;
        newParticles.push({
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - (Math.random() * 40),
          size: 4 + Math.random() * 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          scale: 0.6 + Math.random() * 0.8,
          delay: Math.random() * 0.15,
          duration: 0.8 + Math.random() * 0.7,
          shape: shapes[Math.floor(Math.random() * shapes.length)]
        });
      }

      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [notification]);

  if (!notification) return null;

  const isTrophy = notification.includes('SUCCÈS') || notification.includes('🏆') || notification.includes('TROPHÉE');
  const isRank = notification.includes('RANG') || notification.includes('🎖️');
  const isQuest = notification.includes('QUÊTE') || notification.includes('🎯');

  return (
    <AnimatePresence>
      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none flex justify-center items-center w-full max-w-lg px-4 font-mono">
          {/* Central Burst Glow Backdrop */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0.5, 1.8, 1.2], opacity: [0, 0.9, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`absolute w-72 h-32 rounded-full blur-2xl ${
              isTrophy
                ? 'bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600'
                : isRank
                ? 'bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-600'
                : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500'
            }`}
          />

          {/* 360 Explosion Particles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: p.scale, rotate: 0 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  opacity: [1, 1, 0],
                  scale: [p.scale, p.scale * 1.3, 0],
                  rotate: p.rotation + 360
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="absolute"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.shape !== 'ring' ? p.color : 'transparent',
                  border: p.shape === 'ring' ? `2px solid ${p.color}` : 'none',
                  borderRadius: p.shape === 'circle' || p.shape === 'ring' ? '50%' : p.shape === 'star' ? '2px' : '3px',
                  boxShadow: `0 0 10px ${p.color}`
                }}
              />
            ))}
          </div>

          {/* Main Neon Toast Card */}
          <motion.div
            initial={{ y: -50, scale: 0.8, opacity: 0, rotateX: -20 }}
            animate={{ y: 0, scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ y: -40, scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`pointer-events-auto relative w-full bg-slate-950/95 border-2 ${
              isTrophy
                ? 'border-yellow-400 shadow-[0_0_35px_rgba(234,179,8,0.6)]'
                : isRank
                ? 'border-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.6)]'
                : 'border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.6)]'
            } p-4 rounded-2xl backdrop-blur-xl flex items-center gap-3.5 overflow-hidden`}
          >
            {/* Shimmer Light Reflection Sweep */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.5 }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
            />

            {/* Icon Container with Pulsing Halo */}
            <div className="relative shrink-0">
              <motion.div
                animate={{ scale: [1, 1.25, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`p-3.5 rounded-2xl border-2 ${
                  isTrophy
                    ? 'bg-yellow-950/90 border-yellow-400 text-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.8)]'
                    : isRank
                    ? 'bg-purple-950/90 border-purple-400 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.8)]'
                    : 'bg-cyan-950/90 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.8)]'
                }`}
              >
                {isTrophy ? (
                  <Trophy size={28} className="animate-bounce" />
                ) : isRank ? (
                  <Award size={28} className="animate-bounce" />
                ) : (
                  <Sparkles size={28} className="animate-spin-slow" />
                )}
              </motion.div>
            </div>

            {/* Notification Content Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border tracking-wider ${
                  isTrophy
                    ? 'bg-yellow-500 text-slate-950 border-yellow-300 shadow-[0_0_8px_#facc15]'
                    : isRank
                    ? 'bg-purple-500 text-white border-purple-300 shadow-[0_0_8px_#a855f7]'
                    : 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_8px_#06b6d4]'
                }`}>
                  {isTrophy ? 'TROPHÉE DÉBLOCAGE !' : isRank ? 'RANG NOUVEAU !' : 'ALERTE MAÎTRISE !'}
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Star size={10} className="text-yellow-400" /> VERTEX ARCADE
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-black font-sans uppercase tracking-wide text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] leading-tight">
                {notification}
              </h4>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-white font-black text-xs cursor-pointer transition-all shrink-0"
            >
              ✕
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
