import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, ArrowLeft, Zap, ShoppingBag, Clock } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  amount: number;
}

export default function NeonClicker({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [autoRate, setAutoRate] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [autoCost, setAutoCost] = useState(15);
  const [multCost, setMultCost] = useState(25);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoClickRef = useRef<NodeJS.Timeout | null>(null);

  // Auto clicker logic
  useEffect(() => {
    if (gameStarted && autoRate > 0) {
      autoClickRef.current = setInterval(() => {
        setScore((prev) => {
          const newScore = prev + autoRate;
          onScore(autoRate);
          return newScore;
        });
      }, 1000);
    }
    return () => {
      if (autoClickRef.current) clearInterval(autoClickRef.current);
    };
  }, [gameStarted, autoRate]);

  // Timer countdown - Only starts/stops on gameStarted status change to prevent stuck timer
  useEffect(() => {
    if (gameStarted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted]);

  const handleGameOver = () => {
    setGameStarted(false);
    audio.playGameOver();
    onGameOver(score);
  };

  const handleNodeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameStarted) {
      if (timeLeft <= 0) {
        setTimeLeft(60);
        setScore(0);
        setMultiplier(1);
        setAutoRate(0);
        setAutoCost(15);
        setMultCost(25);
      }
      setGameStarted(true);
      audio.playCoin();
    }
    
    audio.playClick();
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Check clientX/Y and fallback for touch interfaces safely
    let clientX = e.clientX;
    let clientY = e.clientY;
    
    if (!clientX && (e.nativeEvent as any).touches && (e.nativeEvent as any).touches.length > 0) {
      clientX = (e.nativeEvent as any).touches[0].clientX;
      clientY = (e.nativeEvent as any).touches[0].clientY;
    }
    
    const finalX = typeof clientX === 'number' && !isNaN(clientX) ? clientX : (rect.left + rect.width / 2);
    const finalY = typeof clientY === 'number' && !isNaN(clientY) ? clientY : (rect.top + rect.height / 2);

    const x = finalX - rect.left;
    const y = finalY - rect.top;

    const gained = multiplier;
    setScore((prev) => prev + gained);
    onScore(gained);

    // Spawn a floating text particle
    const newParticle: Particle = {
      id: Date.now() + Math.random(),
      x,
      y,
      amount: gained,
    };
    setParticles((prev) => [...prev, newParticle]);

    // Remove particle after animation
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1000);
  };

  const buyAutoClicker = () => {
    if (score >= autoCost) {
      audio.playWin();
      setScore((prev) => prev - autoCost);
      setAutoRate((prev) => prev + 1);
      setAutoCost((prev) => Math.round(prev * 1.5));
    } else {
      audio.playHit();
    }
  };

  const buyMultiplier = () => {
    if (score >= multCost) {
      audio.playWin();
      setScore((prev) => prev - multCost);
      setMultiplier((prev) => prev + 1);
      setMultCost((prev) => Math.round(prev * 1.6));
    } else {
      audio.playHit();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-white relative overflow-hidden">
      {/* Glow ambient background elements */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-200 transition-colors bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-800"
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-2 text-yellow-400">
          <Trophy size={18} />
          <span className="font-mono text-sm tracking-wide">Record: {highScore} PX</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold font-sans tracking-widest text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
          Néon Clicker
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          {gameStarted ? "CLIQUE SUR LE NOYAU LUMINEUX !" : "Clique sur le noyau pour démarrer le chrono !"}
        </p>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-3 gap-3 mb-6 font-mono text-center relative z-10">
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SCORE</p>
          <p className="text-lg font-bold text-cyan-400">{score} PX</p>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-center items-center">
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Clock size={10} /> TEMPS
          </div>
          <p className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-200'}`}>
            {timeLeft}s
          </p>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">MULTI / SEC</p>
          <p className="text-xs text-purple-400 font-semibold">
            +{multiplier} / +{autoRate}s
          </p>
        </div>
      </div>

      {/* Click Stage */}
      <div className="flex justify-center items-center h-56 mb-6 relative">
        {/* Pulsating cosmic outer shadow glow ring */}
        <div className="absolute w-40 h-40 rounded-full bg-cyan-500/10 border border-cyan-500/20 animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute w-44 h-44 rounded-full bg-purple-500/5 border border-purple-500/10 animate-pulse"></div>

        <div
          id="click-node"
          onClick={handleNodeClick}
          className="relative w-40 h-40 rounded-full bg-slate-900/80 border-4 border-cyan-400 shadow-[0_0_35px_rgba(34,211,238,0.7),inset_0_0_20px_rgba(34,211,238,0.3)] hover:scale-105 active:scale-95 transition-all duration-75 cursor-pointer flex flex-col justify-center items-center select-none z-10"
        >
          {/* Outer dashed mechanical ring spinning */}
          <div className="absolute inset-1 rounded-full border-2 border-dashed border-cyan-400/30 animate-spin" style={{ animationDuration: '14s' }}></div>
          {/* Inner tight pink neon accent ring */}
          <div className="absolute inset-3 rounded-full border border-purple-500/40 animate-pulse"></div>
          
          <motion.div
            animate={gameStarted ? { scale: [1, 1.08, 1], rotate: [0, 180, 360] } : {}}
            transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
            className="text-cyan-400 relative z-20"
          >
            <Zap size={48} className="drop-shadow-[0_0_12px_rgba(34,211,238,0.9)] text-cyan-300" />
          </motion.div>
          
          <span className="text-[9px] font-mono tracking-widest text-cyan-300 mt-2 font-black uppercase relative z-20 bg-slate-950/90 px-2 py-0.5 rounded border border-cyan-500/20 shadow-[0_0_8px_rgba(34,211,238,0.3)]">
            {gameStarted ? 'CORE_ACTIVE' : 'START_CORE'}
          </span>

          {/* Render click text particles */}
          <AnimatePresence>
            {particles.map((p) => (
              <motion.span
                key={p.id}
                initial={{ opacity: 1, y: p.y - 20, scale: 0.8 }}
                animate={{ opacity: 0, y: p.y - 80, x: p.x + (Math.random() * 50 - 25), scale: 1.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute font-mono font-black text-yellow-400 text-sm pointer-events-none drop-shadow-[0_0_5px_rgba(234,179,8,0.8)] z-30"
                style={{ left: p.x, top: p.y }}
              >
                +{p.amount} PX
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Shop / Upgrades Section */}
      <div className="relative z-10 border-t border-slate-800 pt-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-1.5">
          <ShoppingBag size={14} /> MAGASIN D'AMÉLIORATIONS
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Upgrade Multiplier */}
          <button
            onClick={buyMultiplier}
            className={`flex flex-col justify-between p-3 rounded-xl border font-mono text-left transition-all ${
              score >= multCost
                ? 'bg-slate-900 border-purple-500/60 hover:border-purple-400 cursor-pointer text-white shadow-[0_0_10px_rgba(168,85,247,0.15)]'
                : 'bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <div>
              <p className="text-xs font-bold text-purple-400">Noyau Lumineux</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Click Multiplier +1</p>
            </div>
            <div className="flex justify-between items-center w-full mt-4 text-xs">
              <span className="font-semibold">Niveau {multiplier}</span>
              <span className={`font-bold ${score >= multCost ? 'text-yellow-400' : 'text-slate-500'}`}>
                {multCost} PX
              </span>
            </div>
          </button>

          {/* Upgrade Auto Clicker */}
          <button
            onClick={buyAutoClicker}
            className={`flex flex-col justify-between p-3 rounded-xl border font-mono text-left transition-all ${
              score >= autoCost
                ? 'bg-slate-900 border-emerald-500/60 hover:border-emerald-400 cursor-pointer text-white shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                : 'bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <div>
              <p className="text-xs font-bold text-emerald-400">Générateur Automatique</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Auto-Pixel +1/sec</p>
            </div>
            <div className="flex justify-between items-center w-full mt-4 text-xs">
              <span className="font-semibold">Niveau {autoRate}</span>
              <span className={`font-bold ${score >= autoCost ? 'text-yellow-400' : 'text-slate-500'}`}>
                {autoCost} PX
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
