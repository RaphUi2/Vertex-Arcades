import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, ArrowLeft, Zap, ShoppingBag, Clock, Heart, Flame } from 'lucide-react';
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
  isCrit?: boolean;
}

interface GoldenNode {
  id: number;
  x: number;
  y: number;
}

export default function NeonClicker({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [autoRate, setAutoRate] = useState(0);
  const [critChance, setCritChance] = useState(0.05); // 5% base crit chance
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [goldenNode, setGoldenNode] = useState<GoldenNode | null>(null);

  // Upgrade costs
  const [autoCost, setAutoCost] = useState(15);
  const [multCost, setMultCost] = useState(25);
  const [critCost, setCritCost] = useState(40);

  // Combo supercharge gauge
  const [combo, setCombo] = useState(0);
  const [supercharged, setSupercharged] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoClickRef = useRef<NodeJS.Timeout | null>(null);
  const comboDecayRef = useRef<NodeJS.Timeout | null>(null);

  // Score Ref to solve stale closure bugs completely
  const scoreRef = useRef(0);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Keep track of combo decay
  useEffect(() => {
    if (gameStarted && combo > 0 && !supercharged) {
      comboDecayRef.current = setInterval(() => {
        setCombo((prev) => Math.max(0, prev - 1));
      }, 800);
    }
    return () => {
      if (comboDecayRef.current) clearInterval(comboDecayRef.current);
    };
  }, [gameStarted, combo, supercharged]);

  // Auto clicker logic
  useEffect(() => {
    if (gameStarted && autoRate > 0) {
      autoClickRef.current = setInterval(() => {
        const gained = autoRate * (supercharged ? 2 : 1);
        setScore((prev) => prev + gained);
        onScore(gained);
      }, 1000);
    }
    return () => {
      if (autoClickRef.current) clearInterval(autoClickRef.current);
    };
  }, [gameStarted, autoRate, supercharged]);

  // Timer countdown
  useEffect(() => {
    if (gameStarted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleGameOver();
            return 0;
          }
          // Spawn Golden Node occasionally
          if (prev % 15 === 0 && !goldenNode) {
            spawnGoldenNode();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, goldenNode]);

  const handleGameOver = () => {
    setGameStarted(false);
    audio.playGameOver();
    onGameOver(scoreRef.current);
  };

  const spawnGoldenNode = () => {
    const rx = 40 + Math.random() * 240;
    const ry = 40 + Math.random() * 180;
    setGoldenNode({
      id: Date.now(),
      x: rx,
      y: ry,
    });
  };

  const handleGoldenNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!goldenNode) return;
    audio.playWin();
    
    // Massive bonus
    const bonus = 100 + multiplier * 15;
    setScore((prev) => prev + bonus);
    onScore(bonus);

    // Spawn special golden particle
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    const x = e.clientX - (rect?.left || 0);
    const y = e.clientY - (rect?.top || 0);

    const newParticle: Particle = {
      id: Date.now() + Math.random(),
      x,
      y,
      amount: bonus,
      isCrit: true,
    };
    setParticles((prev) => [...prev, newParticle]);

    setGoldenNode(null);

    // Enter temporary Supercharge mode instantly!
    triggerSupercharge();

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1200);
  };

  const triggerSupercharge = () => {
    setSupercharged(true);
    setCombo(30);
    audio.playWin();

    // End supercharge after 8 seconds
    setTimeout(() => {
      setSupercharged(false);
      setCombo(0);
    }, 8000);
  };

  const handleNodeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameStarted) {
      if (timeLeft <= 0) {
        setTimeLeft(60);
        setScore(0);
        setMultiplier(1);
        setAutoRate(0);
        setCritChance(0.05);
        setAutoCost(15);
        setMultCost(25);
        setCritCost(40);
        setCombo(0);
        setSupercharged(false);
      }
      setGameStarted(true);
      audio.playCoin();
    }
    
    audio.playClick();
    const rect = e.currentTarget.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check critical hit
    const isCrit = Math.random() < critChance;
    const clickPower = multiplier * (supercharged ? 2 : 1);
    const gained = isCrit ? clickPower * 5 : clickPower;

    setScore((prev) => prev + gained);
    onScore(gained);

    // Update combo
    if (!supercharged) {
      setCombo((prev) => {
        const next = prev + 1;
        if (next >= 30) {
          triggerSupercharge();
          return 30;
        }
        return next;
      });
    }

    // Spawn a floating text particle
    const newParticle: Particle = {
      id: Date.now() + Math.random(),
      x,
      y,
      amount: gained,
      isCrit,
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
      setAutoCost((prev) => Math.round(prev * 1.55));
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

  const buyCritChance = () => {
    if (score >= critCost) {
      audio.playWin();
      setScore((prev) => prev - critCost);
      setCritChance((prev) => Math.min(0.5, prev + 0.05)); // max 50% crit chance
      setCritCost((prev) => Math.round(prev * 1.8));
    } else {
      audio.playHit();
    }
  };

  return (
    <div className={`w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 transition-all duration-500 text-white relative overflow-hidden ${supercharged ? 'border-amber-400 shadow-[0_0_35px_rgba(251,191,36,0.5)]' : 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]'}`}>
      
      {/* Golden Matrix rain grid in supercharge */}
      {supercharged && (
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(251,191,36,0.05)_1px,transparent_1px)] bg-[size:100%_8px] pointer-events-none animate-pulse"></div>
      )}

      {/* Glow ambient background elements */}
      <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${supercharged ? 'bg-amber-500/20' : 'bg-cyan-500/10'}`}></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <button
          onClick={onBack}
          className={`flex items-center gap-1 text-sm transition-colors px-3 py-1.5 rounded-lg border ${supercharged ? 'text-amber-400 bg-amber-950/40 border-amber-800' : 'text-cyan-400 bg-cyan-950/40 border-cyan-800'}`}
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-2 text-yellow-400">
          <Trophy size={18} />
          <span className="font-mono text-sm tracking-wide">Record: {highScore} PX</span>
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className={`text-2xl font-black font-sans tracking-widest uppercase transition-colors duration-500 ${supercharged ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]' : 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]'}`}>
          {supercharged ? "🔥 OVERDRIVE ACTIVE 🔥" : "Néon Clicker"}
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          {supercharged ? "CLIQUEZ EN DOUBLE MULTIPLICATEUR !" : "CLIQUEZ SUR LE NOYAU POUR GAGNER DES PIXELS !"}
        </p>
      </div>

      {/* Supercharge Combo Gauge */}
      <div className="mb-4 relative z-10 px-2 font-mono">
        <div className="flex justify-between items-center text-[9px] mb-1">
          <span className="text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Flame size={10} className={supercharged ? "text-amber-400 animate-bounce" : "text-slate-500"} /> 
            COMBO JAUGE {supercharged && "(HYPERDRIVE MULTI x2)"}
          </span>
          <span className={supercharged ? "text-amber-400 font-bold" : "text-cyan-400"}>
            {supercharged ? '30 / 30 MAX' : `${combo} / 30`}
          </span>
        </div>
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-300 ${supercharged ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(251,191,36,0.8)] w-full' : 'bg-cyan-500 w-[calc(100%*var(--percent))]'}`}
            style={{ '--percent': combo / 30 } as React.CSSProperties}
          ></div>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-3 gap-2 mb-6 font-mono text-center relative z-10">
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SCORE</p>
          <p className={`text-base font-bold transition-colors ${supercharged ? 'text-amber-400' : 'text-cyan-400'}`}>{score} PX</p>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex flex-col justify-center items-center">
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Clock size={10} /> TEMPS
          </div>
          <p className={`text-base font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-200'}`}>{timeLeft}s</p>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">CLICS</p>
          <p className="text-base font-bold text-slate-200">+{multiplier * (supercharged ? 2 : 1)} PX</p>
        </div>
      </div>

      {/* Interactive Core Click Area */}
      <div className="flex justify-center items-center my-6 relative min-h-[180px]">
        
        {/* Golden Floating node */}
        <AnimatePresence>
          {goldenNode && (
            <motion.button
              key={goldenNode.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={handleGoldenNodeClick}
              className="absolute z-30 w-11 h-11 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 border-2 border-white flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(251,191,36,1)] animate-bounce"
              style={{ left: goldenNode.x, top: goldenNode.y }}
            >
              <Sparkles size={16} className="text-white animate-spin" />
            </motion.button>
          )}
        </AnimatePresence>

        <div
          onClick={handleNodeClick}
          className={`relative w-36 h-36 rounded-full flex items-center justify-center cursor-pointer select-none active:scale-90 transition-all duration-100 ${
            supercharged
              ? 'bg-amber-950/20 border-4 border-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.8)]'
              : 'bg-cyan-950/20 border-4 border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.4)]'
          }`}
        >
          {/* Inner pulsating core */}
          <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center ${supercharged ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'} relative overflow-hidden`}>
            <Zap size={44} className={gameStarted ? "animate-pulse" : "animate-bounce"} />
            <span className="text-[8px] font-mono tracking-widest mt-1 opacity-80 uppercase">
              {gameStarted ? "APPUYER" : "START"}
            </span>
          </div>

          {/* Floating numeric particles */}
          <AnimatePresence>
            {particles.map((p) => (
              <motion.span
                key={p.id}
                initial={{ opacity: 1, y: p.y - 10, x: p.x - 40, scale: p.isCrit ? 1.4 : 1 }}
                animate={{ opacity: 0, y: p.y - 80, scale: p.isCrit ? 1.8 : 1.1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`absolute z-20 font-mono font-black text-sm pointer-events-none ${
                  p.isCrit ? 'text-yellow-300 drop-shadow-[0_0_5px_rgba(251,191,36,0.9)]' : 'text-cyan-300'
                }`}
              >
                +{p.amount} PX {p.isCrit && '🔥 CRITIQUE!'}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Upgrades Shop Deck */}
      <div className="mt-4 relative z-10">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5 border-b border-slate-900 pb-1.5">
          <ShoppingBag size={12} /> AMÉLIORATIONS VERTEX
        </h3>

        <div className="grid grid-cols-3 gap-2 font-mono text-center">
          
          {/* Upgrade Multiplier */}
          <button
            onClick={buyMultiplier}
            disabled={score < multCost}
            className={`p-2 rounded-xl border flex flex-col justify-between items-center transition-all cursor-pointer ${
              score >= multCost
                ? 'bg-slate-900 border-cyan-500 hover:border-cyan-400 text-cyan-300'
                : 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed'
            }`}
          >
            <p className="text-[9px] text-slate-400 uppercase tracking-wide font-bold">FORCE</p>
            <p className="text-xs font-black my-1">x{multiplier + 1}</p>
            <p className="text-[10px] bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-900/50">{multCost} PX</p>
          </button>

          {/* Upgrade Auto Clicker */}
          <button
            onClick={buyAutoClicker}
            disabled={score < autoCost}
            className={`p-2 rounded-xl border flex flex-col justify-between items-center transition-all cursor-pointer ${
              score >= autoCost
                ? 'bg-slate-900 border-purple-500 hover:border-purple-400 text-purple-300'
                : 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed'
            }`}
          >
            <p className="text-[9px] text-slate-400 uppercase tracking-wide font-bold">GÉNÉRATION</p>
            <p className="text-xs font-black my-1">+{autoRate + 1}/s</p>
            <p className="text-[10px] bg-purple-950/50 px-2 py-0.5 rounded border border-purple-900/50">{autoCost} PX</p>
          </button>

          {/* Upgrade Critical Hit Chance */}
          <button
            onClick={buyCritChance}
            disabled={score < critCost || critChance >= 0.5}
            className={`p-2 rounded-xl border flex flex-col justify-between items-center transition-all cursor-pointer ${
              score >= critCost && critChance < 0.5
                ? 'bg-slate-900 border-yellow-500 hover:border-yellow-400 text-yellow-300'
                : 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed'
            }`}
          >
            <p className="text-[9px] text-slate-400 uppercase tracking-wide font-bold">CRITIQUE</p>
            <p className="text-xs font-black my-1">{critChance >= 0.5 ? 'MAX (50%)' : `${Math.round((critChance + 0.05) * 100)}%`}</p>
            <p className="text-[10px] bg-yellow-950/50 px-2 py-0.5 rounded border border-yellow-900/50">
              {critChance >= 0.5 ? 'COMPLET' : `${critCost} PX`}
            </p>
          </button>

        </div>
      </div>
    </div>
  );
}
