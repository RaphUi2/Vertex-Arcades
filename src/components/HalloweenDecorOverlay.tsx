import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audio } from '../utils/audio';

interface HalloweenDecorOverlayProps {
  onShowToast?: (msg: string) => void;
}

export function HalloweenDecorOverlay({ onShowToast }: HalloweenDecorOverlayProps) {
  const [spiderBounced, setSpiderBounced] = useState(false);
  const [catPurred, setCatPurred] = useState(false);
  const [candyPops, setCandyPops] = useState<{ id: number; x: number; y: number; icon: string; text: string }[]>([]);

  // Interactive spooky click handler
  const handleSpookyElementClick = (e: React.MouseEvent, icon: string, label: string) => {
    e.stopPropagation();
    audio.playHalloweenSpook();

    const newId = Date.now() + Math.random();
    const treats = ["+🎃 50 XP Spooky", "+🍬 Bonbon Mystique", "+👻 Esprit Farceur", "+🦇 Ailes de Chauve-souris", "+✨ Énergie d'Halloween"];
    const text = treats[Math.floor(Math.random() * treats.length)];

    const newPop = { id: newId, x: e.clientX, y: e.clientY, icon, text };
    setCandyPops(prev => [...prev.slice(-8), newPop]);

    setTimeout(() => {
      setCandyPops(prev => prev.filter(p => p.id !== newId));
    }, 1400);

    if (onShowToast) {
      const phrases = [
        "🎃 Joyeux Halloween ! Vous avez déniché un trésor ensorcelé !",
        "👻 Ouhouh ! Un fantôme d'arcade danse avec vos scores !",
        "🦇 Une chauve-souris de minuit vous salue d'un battement d'ailes !",
        "🧙‍♀️ La sorcière du métaverse a béni vos réflexes de jeu !",
        "🍬 Bonbon magique récolté ! Que la fête des monstres commence !",
        "🕷️ L'araignée d'arcade tisse une toile d'invincibilité !"
      ];
      onShowToast(phrases[Math.floor(Math.random() * phrases.length)]);
    }
  };

  const handleSpiderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playHalloweenSpook();
    setSpiderBounced(true);
    setTimeout(() => setSpiderBounced(false), 900);
    if (onShowToast) {
      onShowToast("🕷️ Vous avez taquiné l'Araignée tisseuse d'Halloween !");
    }
  };

  const handleCatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playHalloweenSpook();
    setCatPurred(true);
    setTimeout(() => setCatPurred(false), 800);
    if (onShowToast) {
      onShowToast("🐱 Miaou ! Le Chat Noir d'Halloween vous porte chance !");
    }
  };

  return (
    <>
      {/* ========================================================
          1. BACKGROUND AMBIENT LAYER (Z-INDEX 0 - BEHIND UI)
          ======================================================== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Full Blood Harvest Moon with Glowing Atmosphere */}
        <div className="absolute top-3 right-6 sm:top-8 sm:right-16 pointer-events-none opacity-60 sm:opacity-75">
          <div className="relative w-28 h-28 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-amber-300 via-orange-500 to-rose-700 blur-[0.5px] shadow-[0_0_80px_rgba(249,115,22,0.8)] animate-pulse" style={{ animationDuration: '6s' }}>
            {/* Moon craters */}
            <div className="absolute top-6 left-8 w-6 h-6 rounded-full bg-orange-800/40 blur-[1px]" />
            <div className="absolute top-16 left-16 w-10 h-10 rounded-full bg-orange-900/35 blur-[1px]" />
            <div className="absolute bottom-8 left-10 w-12 h-12 rounded-full bg-amber-900/30 blur-[1px]" />
          </div>
        </div>

        {/* 🧙‍♀️ Animated Witch Flying across the Blood Moon */}
        <motion.div
          animate={{
            x: ['-20vw', '120vw'],
            y: [90, 60, 110, 70, 95],
            rotate: [-5, 8, -6, 5, -5]
          }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear", delay: 3 }}
          className="absolute top-12 z-0 text-3xl sm:text-5xl filter drop-shadow-[0_0_20px_rgba(249,115,22,0.9)] opacity-75"
        >
          🧙‍♀️
        </motion.div>

        {/* Distant Spooky Flying Bats Background Swarm */}
        <motion.div
          animate={{
            x: ['110vw', '-20vw'],
            y: [50, 120, 40, 100, 60]
          }}
          transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
          className="absolute top-8 flex items-center gap-6 opacity-50 text-xl"
        >
          <span>🦇</span>
          <span className="scale-75 translate-y-3">🦇</span>
          <span className="scale-50 -translate-y-2">🦇</span>
        </motion.div>

        {/* Bottom Graveyard Silhouette & Mist */}
        <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none bg-gradient-to-t from-orange-950/50 via-purple-950/30 to-transparent">
          {/* Tombstones and spooky fences silhouettes */}
          <div className="absolute bottom-2 inset-x-4 flex justify-between items-end opacity-40">
            <div className="flex items-end gap-3">
              <span className="text-3xl">🪦</span>
              <span className="text-2xl">🌲</span>
              <span className="text-4xl -translate-y-1">⚰️</span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-3xl">🌲</span>
              <span className="text-2xl">🪦</span>
              <span className="text-3xl">🕯️</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. FOREGROUND INTERACTIVE ATMOSPHERIC LAYER (Z-INDEX 35)
          ======================================================== */}
      <div className="fixed inset-0 pointer-events-none z-35 overflow-hidden select-none">
        
        {/* 🕸️ 4 CORNER SPIDERWEBS WITH ANIMATED GLOW */}
        {/* Top-Left Web */}
        <div className="absolute top-0 left-0 w-32 h-32 sm:w-52 sm:h-52 pointer-events-none opacity-80 filter drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]">
          <svg viewBox="0 0 100 100" className="w-full h-full text-orange-400 fill-none stroke-current stroke-[1.2]">
            <path d="M0,0 Q50,0 100,0 M0,0 Q0,50 0,100 M0,0 L100,100 M0,0 L35,100 M0,0 L100,35 M0,0 L70,100 M0,0 L100,70" opacity="0.4" />
            <path d="M15,0 Q12,12 0,15 M30,0 Q24,24 0,30 M45,0 Q36,36 0,45 M60,0 Q48,48 0,60 M75,0 Q60,60 0,75 M90,0 Q72,72 0,90" />
            <circle cx="45" cy="45" r="2" className="fill-orange-400" />
          </svg>
        </div>

        {/* Top-Right Web */}
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-52 sm:h-52 pointer-events-none opacity-80 rotate-90 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
          <svg viewBox="0 0 100 100" className="w-full h-full text-purple-400 fill-none stroke-current stroke-[1.2]">
            <path d="M0,0 Q50,0 100,0 M0,0 Q0,50 0,100 M0,0 L100,100 M0,0 L35,100 M0,0 L100,35 M0,0 L70,100 M0,0 L100,70" opacity="0.4" />
            <path d="M15,0 Q12,12 0,15 M30,0 Q24,24 0,30 M45,0 Q36,36 0,45 M60,0 Q48,48 0,60 M75,0 Q60,60 0,75 M90,0 Q72,72 0,90" />
          </svg>
        </div>

        {/* Bottom-Left Web */}
        <div className="absolute bottom-0 left-0 w-28 h-28 sm:w-44 sm:h-44 pointer-events-none opacity-70 -rotate-90 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500 fill-none stroke-current stroke-[1.2]">
            <path d="M0,0 Q50,0 100,0 M0,0 Q0,50 0,100 M0,0 L100,100 M0,0 L35,100 M0,0 L100,35" opacity="0.4" />
            <path d="M15,0 Q12,12 0,15 M30,0 Q24,24 0,30 M45,0 Q36,36 0,45 M60,0 Q48,48 0,60" />
          </svg>
        </div>

        {/* Bottom-Right Web */}
        <div className="absolute bottom-0 right-0 w-28 h-28 sm:w-44 sm:h-44 pointer-events-none opacity-70 rotate-180 filter drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]">
          <svg viewBox="0 0 100 100" className="w-full h-full text-orange-500 fill-none stroke-current stroke-[1.2]">
            <path d="M0,0 Q50,0 100,0 M0,0 Q0,50 0,100 M0,0 L100,100 M0,0 L35,100 M0,0 L100,35" opacity="0.4" />
            <path d="M15,0 Q12,12 0,15 M30,0 Q24,24 0,30 M45,0 Q36,36 0,45 M60,0 Q48,48 0,60" />
          </svg>
        </div>

        {/* 🕷️ INTERACTIVE HANGING SWINGING SPIDER ON SILK THREAD */}
        <div className="absolute top-0 left-24 sm:left-44 pointer-events-auto z-40">
          <motion.div
            animate={spiderBounced ? { y: [0, -45, 20, -15, 0], rotate: [0, -25, 25, -10, 0] } : { y: [0, 16, 0], rotate: [-6, 6, -6] }}
            transition={spiderBounced ? { duration: 0.8 } : { repeat: Infinity, duration: 3.6, ease: "easeInOut" }}
            onClick={handleSpiderClick}
            className="flex flex-col items-center cursor-pointer group"
            title="Cliquez sur l'araignée d'Halloween !"
          >
            {/* Silk string */}
            <div className="w-[1.5px] h-14 sm:h-24 bg-gradient-to-b from-white via-orange-300 to-purple-300 shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
            {/* Animated Spider Body */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-slate-900 via-purple-950 to-black border-2 border-orange-400 flex items-center justify-center text-base sm:text-lg shadow-[0_0_20px_rgba(249,115,22,0.9)] group-hover:scale-130 transition-transform group-hover:border-amber-300">
              🕷️
            </div>
          </motion.div>
        </div>

        {/* 🐱 INTERACTIVE BLACK CAT WITH GLOWING EYES SITTING ON TOP BAR */}
        <div className="absolute top-1 left-3 sm:left-6 pointer-events-auto z-40">
          <motion.div
            animate={catPurred ? { scale: [1, 1.35, 1], rotate: [0, 15, -15, 0] } : { y: [0, -3, 0] }}
            transition={catPurred ? { duration: 0.6 } : { repeat: Infinity, duration: 4, ease: "easeInOut" }}
            onClick={handleCatClick}
            className="cursor-pointer flex items-center gap-1 p-1 rounded-full bg-slate-950/70 border border-orange-500/40 shadow-[0_0_12px_rgba(249,115,22,0.4)] hover:scale-115 transition-transform"
            title="Chat noir d'Halloween ! Cliquez pour un câlin magique !"
          >
            <span className="text-base sm:text-lg">🐈‍⬛</span>
            <span className="text-[10px] font-mono font-bold text-orange-300 hidden sm:inline">Miaou!</span>
          </motion.div>
        </div>

        {/* 👻 DANCING & FLOATING ANIMATED GHOSTS WITH SPECTRAL TRAILS */}
        {/* Ghost 1 (Wandering Casper) */}
        <motion.div
          animate={{
            x: ['-10vw', '110vw'],
            y: [120, 180, 130, 220, 140],
            rotate: [0, 12, -12, 8, 0],
            scale: [1, 1.15, 0.95, 1.1, 1]
          }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          onClick={(e) => handleSpookyElementClick(e, '👻', 'Fantôme')}
          className="absolute top-16 pointer-events-auto cursor-pointer p-2 text-3xl sm:text-5xl filter drop-shadow-[0_0_25px_rgba(168,85,247,0.9)] hover:scale-130 transition-transform active:scale-95"
          title="Fantôme d'Halloween ! Cliquez pour récolter des bonbons !"
        >
          <div className="relative">
            <span>👻</span>
            <span className="absolute -bottom-1 left-2 w-4 h-2 bg-purple-400/40 rounded-full blur-[2px] animate-ping" />
          </div>
        </motion.div>

        {/* Ghost 2 (Ethereal Blue Phantom) */}
        <motion.div
          animate={{
            x: ['110vw', '-10vw'],
            y: [280, 210, 320, 240, 290],
            rotate: [0, -15, 15, -8, 0],
            scale: [0.9, 1.1, 0.95, 1.05, 0.9]
          }}
          transition={{ repeat: Infinity, duration: 26, ease: "linear", delay: 7 }}
          onClick={(e) => handleSpookyElementClick(e, '👻', 'Esprit')}
          className="absolute top-48 pointer-events-auto cursor-pointer p-2 text-3xl sm:text-4xl filter drop-shadow-[0_0_25px_rgba(34,211,238,0.9)] hover:scale-130 transition-transform active:scale-95"
          title="Esprit céleste d'Halloween !"
        >
          <span>👻</span>
        </motion.div>

        {/* 🦇 FLAPPING BATS WITH DYNAMIC FLUTTER ANIMATION */}
        {/* Bat 1 (Fluttering across with wing beat) */}
        <motion.div
          animate={{
            x: ['-10vw', '110vw'],
            y: [60, 120, 50, 140, 70],
            rotate: [-12, 12, -15, 10, -12]
          }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear", delay: 1 }}
          onClick={(e) => handleSpookyElementClick(e, '🦇', 'Chauve-souris')}
          className="absolute top-8 pointer-events-auto cursor-pointer p-2 text-2xl sm:text-4xl filter drop-shadow-[0_0_15px_rgba(249,115,22,0.9)] hover:scale-140 transition-transform active:scale-90 animate-bounce"
          style={{ animationDuration: '0.6s' }}
          title="Chauve-souris d'Halloween ! Cliquez pour l'attraper !"
        >
          🦇
        </motion.div>

        {/* Bat 2 (Fast dive) */}
        <motion.div
          animate={{
            x: ['110vw', '-10vw'],
            y: [160, 90, 190, 110, 170],
            rotate: [15, -15, 20, -10, 15]
          }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear", delay: 5 }}
          onClick={(e) => handleSpookyElementClick(e, '🦇', 'Chauve-souris')}
          className="absolute top-36 pointer-events-auto cursor-pointer p-2 text-xl sm:text-3xl filter drop-shadow-[0_0_15px_rgba(217,70,239,0.9)] hover:scale-140 transition-transform active:scale-90 animate-bounce"
          style={{ animationDuration: '0.5s' }}
        >
          🦇
        </motion.div>

        {/* 🎃 ANIMATED FLICKERING JACK-O'-LANTERNS (BOTTOM CORNERS) */}
        {/* Left Glowing Jack-o'-Lantern */}
        <motion.div
          animate={{
            y: [0, -14, 0],
            rotate: [-5, 5, -5],
            scale: [1, 1.05, 1]
          }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          onClick={(e) => handleSpookyElementClick(e, '🎃', 'Citrouille')}
          className="absolute bottom-16 left-4 sm:bottom-20 sm:left-10 pointer-events-auto cursor-pointer text-4xl sm:text-6xl filter drop-shadow-[0_0_30px_rgba(249,115,22,1)] hover:scale-130 transition-transform active:scale-95"
          title="Citrouille d'Halloween enchantée !"
        >
          <div className="relative">
            <span>🎃</span>
            <span className="absolute -top-1 -right-1 text-sm animate-ping">✨</span>
          </div>
        </motion.div>

        {/* Right Glowing Jack-o'-Lantern */}
        <motion.div
          animate={{
            y: [0, -16, 0],
            rotate: [6, -6, 6],
            scale: [1, 1.06, 1]
          }}
          transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 0.8 }}
          onClick={(e) => handleSpookyElementClick(e, '🎃', 'Citrouille')}
          className="absolute bottom-16 right-4 sm:bottom-20 sm:right-10 pointer-events-auto cursor-pointer text-4xl sm:text-6xl filter drop-shadow-[0_0_30px_rgba(249,115,22,1)] hover:scale-130 transition-transform active:scale-95"
          title="Citrouille d'Halloween enchantée !"
        >
          <div className="relative">
            <span>🎃</span>
            <span className="absolute -top-1 -left-1 text-sm animate-ping">🔥</span>
          </div>
        </motion.div>

        {/* 🧪 BUBBLING TOXIC CAULDRON (BOTTOM CENTER-RIGHT) */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          onClick={(e) => handleSpookyElementClick(e, '🧪', 'Potion Magique')}
          className="absolute bottom-8 right-24 sm:bottom-12 sm:right-36 pointer-events-auto cursor-pointer flex items-center gap-1.5 p-2 rounded-2xl bg-slate-950/80 border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.6)] hover:scale-115 transition-transform"
          title="Chaudron magique bouillonnant ! Cliquez pour une gorgée magique !"
        >
          <span className="text-2xl sm:text-3xl animate-pulse">🧪</span>
          <span className="text-xs font-mono font-black text-green-400 hidden sm:inline">POTION +XP</span>
        </motion.div>

        {/* 🍬 POPPING CANDY PARTICLES ON CLICK */}
        <AnimatePresence>
          {candyPops.map(pop => (
            <motion.div
              key={pop.id}
              initial={{ opacity: 1, scale: 0.5, y: pop.y, x: pop.x }}
              animate={{ opacity: 0, scale: 2, y: pop.y - 100, x: pop.x + (Math.random() * 80 - 40) }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.3 }}
              className="fixed pointer-events-none z-50 text-2xl sm:text-3xl font-mono font-black text-amber-300 drop-shadow-[0_0_15px_#f59e0b] flex items-center gap-1.5"
            >
              <span>{pop.icon}</span>
              <span className="text-xs sm:text-sm text-orange-400 font-bold bg-slate-950/80 px-2 py-0.5 rounded-full border border-orange-500/50">{pop.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
