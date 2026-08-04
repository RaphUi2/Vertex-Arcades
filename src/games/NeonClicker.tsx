import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, ArrowLeft, Zap, ShoppingBag, Clock, Flame, Shield, Cpu, RefreshCw } from 'lucide-react';
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

interface NeonBoss {
  id: number;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
}

export default function NeonClicker({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [autoRate, setAutoRate] = useState(0);
  const [critChance, setCritChance] = useState(0.05);

  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [boss, setBoss] = useState<NeonBoss | null>(null);

  // Upgrade costs
  const [autoCost, setAutoCost] = useState(15);
  const [multCost, setMultCost] = useState(25);
  const [critCost, setCritCost] = useState(40);
  const [generatorLevel, setGeneratorLevel] = useState(0);
  const [generatorCost, setGeneratorCost] = useState(100);

  // Combo supercharge gauge
  const [combo, setCombo] = useState(0);
  const [supercharged, setSupercharged] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoClickRef = useRef<NodeJS.Timeout | null>(null);
  const comboDecayRef = useRef<NodeJS.Timeout | null>(null);

  const scoreRef = useRef(0);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Combo decay
  useEffect(() => {
    if (gameStarted && combo > 0 && !supercharged) {
      comboDecayRef.current = setInterval(() => {
        setCombo((prev) => Math.max(0, prev - 1));
      }, 700);
    }
    return () => {
      if (comboDecayRef.current) clearInterval(comboDecayRef.current);
    };
  }, [gameStarted, combo, supercharged]);

  // Auto generator + clicker
  useEffect(() => {
    if (gameStarted && (autoRate > 0 || generatorLevel > 0)) {
      autoClickRef.current = setInterval(() => {
        const genGain = generatorLevel * 5;
        const gained = (autoRate + genGain) * (supercharged ? 3 : 1);
        if (gained > 0) {
          setScore((prev) => prev + gained);
          onScore(gained);
        }
      }, 1000);
    }
    return () => {
      if (autoClickRef.current) clearInterval(autoClickRef.current);
    };
  }, [gameStarted, autoRate, generatorLevel, supercharged]);

  // Timer countdown & Boss Spawning
  useEffect(() => {
    if (gameStarted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleGameOver();
            return 0;
          }

          // Random Boss Anomaly at 45s, 30s, 15s
          if ((prev === 45 || prev === 30 || prev === 15) && !boss) {
            spawnBoss();
          }

          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, boss]);

  const handleGameOver = () => {
    setGameStarted(false);
    audio.playGameOver();
    onGameOver(scoreRef.current);
  };

  const spawnBoss = () => {
    audio.playLaser();
    setBoss({
      id: Date.now(),
      x: 30 + Math.random() * 200,
      y: 30 + Math.random() * 120,
      hp: 10,
      maxHp: 10
    });
  };

  const handleBossClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!boss) return;
    audio.playHit();

    const newHp = boss.hp - 1;
    if (newHp <= 0) {
      // Defeated Boss Anomaly!
      audio.playWin();
      const bonus = 350 + multiplier * 25;
      setScore((prev) => prev + bonus);
      onScore(bonus);
      triggerSupercharge();
      setBoss(null);
    } else {
      setBoss({ ...boss, hp: newHp });
    }
  };

  const triggerSupercharge = () => {
    setSupercharged(true);
    setCombo(30);
    audio.playWin();

    setTimeout(() => {
      setSupercharged(false);
      setCombo(0);
    }, 10000);
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
        setGeneratorLevel(0);
        setGeneratorCost(100);
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

    const isCrit = Math.random() < critChance;
    const clickPower = multiplier * (supercharged ? 3 : 1);
    const gained = isCrit ? clickPower * 5 : clickPower;

    setScore((prev) => prev + gained);
    onScore(gained);

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

    const newParticle: Particle = {
      id: Date.now() + Math.random(),
      x,
      y,
      amount: gained,
      isCrit
    };
    setParticles((prev) => [...prev, newParticle]);

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
      setCritChance((prev) => Math.min(0.5, prev + 0.05));
      setCritCost((prev) => Math.round(prev * 1.8));
    } else {
      audio.playHit();
    }
  };

  const buyGenerator = () => {
    if (score >= generatorCost) {
      audio.playWin();
      setScore((prev) => prev - generatorCost);
      setGeneratorLevel((prev) => prev + 1);
      setGeneratorCost((prev) => Math.round(prev * 1.9));
    } else {
      audio.playHit();
    }
  };

  return (
    <div className={`w-full max-w-lg mx-auto bg-slate-950 p-5 rounded-2xl border-2 transition-all duration-500 text-white relative overflow-hidden font-mono ${supercharged ? 'border-amber-400 shadow-[0_0_35px_rgba(251,191,36,0.6)]' : 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]'}`}>
      {/* Top Header */}
      <div className="flex justify-between items-center mb-4 relative z-10">
        <button
          onClick={onBack}
          className={`flex items-center gap-1 text-xs font-bold transition-colors px-3 py-1.5 rounded-lg border ${supercharged ? 'text-amber-400 bg-amber-950/40 border-amber-800' : 'text-cyan-400 bg-cyan-950/40 border-cyan-800'}`}
        >
          <ArrowLeft size={14} /> QUITTER
        </button>
        <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs">
          <Trophy size={16} />
          <span>BEST: {highScore} PX</span>
        </div>
      </div>

      <div className="text-center mb-3">
        <h2 className={`text-2xl font-black uppercase tracking-widest ${supercharged ? 'text-yellow-300 animate-pulse' : 'text-cyan-400'}`}>
          {supercharged ? '⚡ SURTENSION HYPERDRIVE (x3) ⚡' : 'NOYAU NÉON OVERCLOCK'}
        </h2>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {supercharged ? 'SURCHARGE TOTALE EN COURS !' : 'BOOSTEZ LE NOYAU ET DÉTRUISEZ LES ANOMALIES NÉON !'}
        </p>
      </div>

      {/* Combo Gauge */}
      <div className="mb-3 relative z-10">
        <div className="flex justify-between items-center text-[10px] mb-1">
          <span className="text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Flame size={12} className={supercharged ? 'text-amber-400 animate-bounce' : 'text-slate-500'} />
            JAUGE DE SURCHARGE
          </span>
          <span className={supercharged ? 'text-amber-400 font-bold' : 'text-cyan-400'}>
            {supercharged ? '30 / 30 MAXIMUM' : `${combo} / 30`}
          </span>
        </div>
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-300 ${supercharged ? 'bg-amber-400 w-full animate-pulse' : 'bg-cyan-400 w-[calc(100%*var(--percent))]'}`}
            style={{ '--percent': combo / 30 } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
          <p className="text-[9px] text-slate-400 uppercase">SCORE PIXELS</p>
          <p className="text-sm font-black text-cyan-400">{score} PX</p>
        </div>
        <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
          <p className="text-[9px] text-slate-400 uppercase">CHRONO</p>
          <p className={`text-sm font-black ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-white'}`}>{timeLeft}s</p>
        </div>
        <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
          <p className="text-[9px] text-slate-400 uppercase">PUISSANCE</p>
          <p className="text-sm font-black text-amber-300">+{multiplier * (supercharged ? 3 : 1)} PX</p>
        </div>
      </div>

      {/* Core Area */}
      <div className="flex justify-center items-center my-4 relative min-h-[170px]">
        {/* Neon Boss Anomaly */}
        <AnimatePresence>
          {boss && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={handleBossClick}
              className="absolute z-30 p-3 bg-rose-950/90 border-2 border-rose-500 rounded-2xl flex flex-col items-center cursor-pointer shadow-[0_0_20px_rgba(244,63,94,0.8)] animate-bounce"
              style={{ left: boss.x, top: boss.y }}
            >
              <div className="flex items-center gap-1 text-rose-400 font-black text-[10px] uppercase mb-1">
                <Shield size={12} /> ANOMALIE BOSS ({boss.hp}/{boss.maxHp})
              </div>
              <div className="w-24 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-rose-800">
                <div className="h-full bg-rose-500 transition-all" style={{ width: `${(boss.hp / boss.maxHp) * 100}%` }} />
              </div>
              <span className="text-[9px] text-white font-bold mt-1">TAP VITE ! (+350 PX)</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          onClick={handleNodeClick}
          className={`relative w-36 h-36 rounded-full flex items-center justify-center cursor-pointer select-none active:scale-90 transition-all duration-100 ${
            supercharged
              ? 'bg-amber-950/30 border-4 border-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.9)]'
              : 'bg-cyan-950/30 border-4 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.5)]'
          }`}
        >
          <div className="w-28 h-28 rounded-full bg-slate-900 border border-slate-700 flex flex-col items-center justify-center text-cyan-300">
            <Zap size={40} className={gameStarted ? 'animate-pulse text-amber-300' : 'animate-bounce'} />
            <span className="text-[9px] font-black uppercase tracking-wider mt-1 text-slate-300">
              {gameStarted ? 'CLIQUER !' : 'DÉMARRER'}
            </span>
          </div>

          <AnimatePresence>
            {particles.map((p) => (
              <motion.span
                key={p.id}
                initial={{ opacity: 1, y: p.y - 10, x: p.x - 30 }}
                animate={{ opacity: 0, y: p.y - 70 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className={`absolute z-20 font-black text-xs pointer-events-none ${p.isCrit ? 'text-yellow-300 drop-shadow-[0_0_5px_#facc15]' : 'text-cyan-300'}`}
              >
                +{p.amount} PX {p.isCrit && '🔥'}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Upgrades Deck */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
        <button
          onClick={buyMultiplier}
          disabled={score < multCost}
          className={`p-2 rounded-xl border flex flex-col justify-between items-center cursor-pointer ${
            score >= multCost ? 'bg-slate-900 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-900 text-slate-600'
          }`}
        >
          <span className="text-[9px] text-slate-400 font-bold uppercase">FORCE</span>
          <span className="text-xs font-black my-0.5">x{multiplier + 1}</span>
          <span className="text-[9px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{multCost} PX</span>
        </button>

        <button
          onClick={buyAutoClicker}
          disabled={score < autoCost}
          className={`p-2 rounded-xl border flex flex-col justify-between items-center cursor-pointer ${
            score >= autoCost ? 'bg-slate-900 border-purple-500 text-purple-300' : 'bg-slate-950 border-slate-900 text-slate-600'
          }`}
        >
          <span className="text-[9px] text-slate-400 font-bold uppercase">DRONES</span>
          <span className="text-xs font-black my-0.5">+{autoRate + 1}/s</span>
          <span className="text-[9px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{autoCost} PX</span>
        </button>

        <button
          onClick={buyCritChance}
          disabled={score < critCost || critChance >= 0.5}
          className={`p-2 rounded-xl border flex flex-col justify-between items-center cursor-pointer ${
            score >= critCost && critChance < 0.5 ? 'bg-slate-900 border-yellow-500 text-yellow-300' : 'bg-slate-950 border-slate-900 text-slate-600'
          }`}
        >
          <span className="text-[9px] text-slate-400 font-bold uppercase">CRITIQUE</span>
          <span className="text-xs font-black my-0.5">{Math.round((critChance + 0.05) * 100)}%</span>
          <span className="text-[9px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{critCost} PX</span>
        </button>

        <button
          onClick={buyGenerator}
          disabled={score < generatorCost}
          className={`p-2 rounded-xl border flex flex-col justify-between items-center cursor-pointer ${
            score >= generatorCost ? 'bg-slate-900 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-900 text-slate-600'
          }`}
        >
          <span className="text-[9px] text-slate-400 font-bold uppercase">RÉACTEUR</span>
          <span className="text-xs font-black my-0.5">Niv. {generatorLevel + 1}</span>
          <span className="text-[9px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{generatorCost} PX</span>
        </button>
      </div>
    </div>
  );
}
