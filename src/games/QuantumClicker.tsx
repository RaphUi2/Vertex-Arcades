import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Sparkles, Trophy, ArrowLeft, RefreshCw, Cpu, Flame, Shield } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

interface ClickParticle {
  id: number;
  x: number;
  y: number;
  amount: number;
  isCrit?: boolean;
}

export default function QuantumClicker({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [score, setScore] = useState(0);
  const [powerPerClick, setPowerPerClick] = useState(1);
  const [autoRate, setAutoRate] = useState(0);
  const [critChance, setCritChance] = useState(0.08);

  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [particles, setParticles] = useState<ClickParticle[]>([]);

  // Quantum upgrades
  const [clickUpgradeCost, setClickUpgradeCost] = useState(15);
  const [autoUpgradeCost, setAutoUpgradeCost] = useState(25);
  const [critUpgradeCost, setCritUpgradeCost] = useState(50);
  const [fusionUpgradeCost, setFusionUpgradeCost] = useState(100);
  const [fusionLevel, setFusionLevel] = useState(0);

  // Quantum Overdrive state
  const [charge, setCharge] = useState(0);
  const [overdrive, setOverdrive] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoRef = useRef<NodeJS.Timeout | null>(null);

  // Auto production loop
  useEffect(() => {
    if (gameStarted && (autoRate > 0 || fusionLevel > 0)) {
      autoRef.current = setInterval(() => {
        const gained = (autoRate + fusionLevel * 8) * (overdrive ? 3 : 1);
        if (gained > 0) {
          setScore((prev) => prev + gained);
          onScore(gained);
        }
      }, 1000);
    }
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [gameStarted, autoRate, fusionLevel, overdrive]);

  // Timer loop
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
    audio.playGameOver();
    onGameOver(score);
  };

  const startGame = () => {
    audio.playLaser();
    setScore(0);
    setPowerPerClick(1);
    setAutoRate(0);
    setCritChance(0.08);
    setClickUpgradeCost(15);
    setAutoUpgradeCost(25);
    setCritUpgradeCost(50);
    setFusionUpgradeCost(100);
    setFusionLevel(0);
    setCharge(0);
    setOverdrive(false);
    setTimeLeft(60);
    setGameStarted(true);
  };

  const handleCoreClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameStarted) return;

    audio.playClick();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const isCrit = Math.random() < critChance;
    const mult = isCrit ? 3 : 1;
    const gained = powerPerClick * mult * (overdrive ? 2 : 1);

    setScore((prev) => prev + gained);
    onScore(gained);

    // Charge gauge
    setCharge((prev) => {
      const next = prev + 4;
      if (next >= 100 && !overdrive) {
        audio.playPowerup();
        setOverdrive(true);
        setTimeout(() => setOverdrive(false), 8000);
        return 0;
      }
      return Math.min(100, next);
    });

    // Particle
    const newParticle: ClickParticle = {
      id: Date.now() + Math.random(),
      x,
      y,
      amount: gained,
      isCrit
    };
    setParticles((prev) => [...prev.slice(-15), newParticle]);
  };

  // Upgrades
  const buyClickUpgrade = () => {
    if (score >= clickUpgradeCost) {
      audio.playCoin();
      setScore((p) => p - clickUpgradeCost);
      setPowerPerClick((p) => p + 1);
      setClickUpgradeCost((p) => Math.floor(p * 1.6));
    }
  };

  const buyAutoUpgrade = () => {
    if (score >= autoUpgradeCost) {
      audio.playCoin();
      setScore((p) => p - autoUpgradeCost);
      setAutoRate((p) => p + 2);
      setAutoUpgradeCost((p) => Math.floor(p * 1.7));
    }
  };

  const buyCritUpgrade = () => {
    if (score >= critUpgradeCost) {
      audio.playCoin();
      setScore((p) => p - critUpgradeCost);
      setCritChance((p) => Math.min(0.75, p + 0.05));
      setCritUpgradeCost((p) => Math.floor(p * 1.8));
    }
  };

  const buyFusionUpgrade = () => {
    if (score >= fusionUpgradeCost) {
      audio.playCoin();
      setScore((p) => p - fusionUpgradeCost);
      setFusionLevel((p) => p + 1);
      setFusionUpgradeCost((p) => Math.floor(p * 2.1));
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[460px] w-full max-w-xl mx-auto bg-slate-950 text-white p-4 rounded-2xl border-2 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)] font-mono select-none relative overflow-hidden">
      {/* Background Quantum Pulse */}
      <div className={`absolute inset-0 bg-purple-950/20 pointer-events-none transition-all ${overdrive ? 'bg-fuchsia-950/40 animate-pulse' : ''}`} />

      {/* Header bar */}
      <div className="w-full flex items-center justify-between z-10 border-b border-purple-900/60 pb-3">
        <button
          onClick={() => { audio.playClick(); onBack(); }}
          className="flex items-center gap-1 text-xs bg-slate-900 border border-purple-800 hover:border-purple-500 text-purple-300 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold"
        >
          <ArrowLeft size={14} /> RETOUR
        </button>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <span className="text-[10px] text-purple-400 font-bold block">CHRONO</span>
            <span className="text-base font-black text-white">{timeLeft}s</span>
          </div>

          <div className="text-center">
            <span className="text-[10px] text-yellow-400 font-bold block">MEILLEUR</span>
            <span className="text-base font-black text-yellow-300">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Main Game Screen */}
      {!gameStarted ? (
        <div className="my-auto text-center z-10 space-y-4 py-8">
          <div className="p-4 bg-purple-950 border-2 border-purple-500 rounded-3xl inline-block shadow-[0_0_20px_rgba(168,85,247,0.5)]">
            <Zap size={48} className="text-fuchsia-400 animate-bounce" />
          </div>
          <h2 className="text-2xl font-black text-purple-300 uppercase tracking-widest">RÉACTEUR QUANTIQUE</h2>
          <p className="text-xs text-slate-300 max-w-xs mx-auto">
            Cliquez sur le Cœur Quantique pour générer des PX ! Débloquez des accélérateurs de plasma et déclenchez la Surcharge Quantique !
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-sm uppercase rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.6)] cursor-pointer transition-all hover:scale-105"
          >
            DÉMARRER LA FUSION ⚛️
          </button>
        </div>
      ) : (
        <div className="w-full flex-1 flex flex-col items-center justify-around z-10 py-2">
          {/* Top Score & Status */}
          <div className="text-center">
            <p className="text-3xl font-black text-yellow-400 font-sans tracking-wider">
              {score.toLocaleString()} <span className="text-xs font-mono text-purple-300">PX</span>
            </p>
            {overdrive && (
              <span className="text-xs font-black bg-fuchsia-600 text-white px-3 py-0.5 rounded-full uppercase animate-bounce shadow-[0_0_15px_#d946ef] mt-1 inline-block">
                ⚡ SURCHARGE QUANTIQUE (x2/x3) ⚡
              </span>
            )}
          </div>

          {/* Charge Bar */}
          <div className="w-full max-w-xs space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-purple-300">
              <span>CHARGE DU RÉACTEUR</span>
              <span>{charge}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 border border-purple-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full transition-all"
                style={{ width: `${charge}%` }}
              />
            </div>
          </div>

          {/* Interactive Core */}
          <div className="relative my-3">
            <motion.div
              whileTap={{ scale: 0.9 }}
              onClick={handleCoreClick}
              className={`w-36 h-36 rounded-full border-4 flex items-center justify-center cursor-pointer transition-all shadow-2xl relative ${
                overdrive
                  ? 'bg-fuchsia-600 border-white shadow-[0_0_50px_#d946ef] animate-pulse'
                  : 'bg-purple-950 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:border-fuchsia-400'
              }`}
            >
              <Zap size={56} className={`${overdrive ? 'text-white animate-spin' : 'text-purple-300'}`} />

              {/* Floating particles */}
              <AnimatePresence>
                {particles.map((p) => (
                  <motion.span
                    key={p.id}
                    initial={{ opacity: 1, y: p.y, x: p.x, scale: 1 }}
                    animate={{ opacity: 0, y: p.y - 50, scale: 1.4 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className={`absolute text-sm font-black pointer-events-none ${
                      p.isCrit ? 'text-yellow-300 drop-shadow-[0_0_8px_#facc15]' : 'text-cyan-300'
                    }`}
                  >
                    +{p.amount} {p.isCrit ? 'CRIT!' : ''}
                  </motion.span>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Upgrade Shop Grid */}
          <div className="w-full grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={buyClickUpgrade}
              disabled={score < clickUpgradeCost}
              className={`p-2 rounded-xl border text-left flex justify-between items-center transition-all ${
                score >= clickUpgradeCost
                  ? 'bg-purple-900 border-purple-500 text-white cursor-pointer hover:bg-purple-800'
                  : 'bg-slate-900 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div>
                <p className="text-[10px] font-bold text-purple-300">IMPULSION +1</p>
                <p className="text-[9px] text-slate-400">Actuel: +{powerPerClick}</p>
              </div>
              <span className="text-xs font-bold text-yellow-400">{clickUpgradeCost} PX</span>
            </button>

            <button
              onClick={buyAutoUpgrade}
              disabled={score < autoUpgradeCost}
              className={`p-2 rounded-xl border text-left flex justify-between items-center transition-all ${
                score >= autoUpgradeCost
                  ? 'bg-purple-900 border-purple-500 text-white cursor-pointer hover:bg-purple-800'
                  : 'bg-slate-900 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div>
                <p className="text-[10px] font-bold text-purple-300">AUTO-ACCÉL. +2</p>
                <p className="text-[9px] text-slate-400">Actuel: {autoRate}/s</p>
              </div>
              <span className="text-xs font-bold text-yellow-400">{autoUpgradeCost} PX</span>
            </button>

            <button
              onClick={buyCritUpgrade}
              disabled={score < critUpgradeCost}
              className={`p-2 rounded-xl border text-left flex justify-between items-center transition-all ${
                score >= critUpgradeCost
                  ? 'bg-purple-900 border-purple-500 text-white cursor-pointer hover:bg-purple-800'
                  : 'bg-slate-900 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div>
                <p className="text-[10px] font-bold text-purple-300">CRITIQUE +5%</p>
                <p className="text-[9px] text-slate-400">Actuel: {Math.round(critChance * 100)}%</p>
              </div>
              <span className="text-xs font-bold text-yellow-400">{critUpgradeCost} PX</span>
            </button>

            <button
              onClick={buyFusionUpgrade}
              disabled={score < fusionUpgradeCost}
              className={`p-2 rounded-xl border text-left flex justify-between items-center transition-all ${
                score >= fusionUpgradeCost
                  ? 'bg-purple-900 border-purple-500 text-white cursor-pointer hover:bg-purple-800'
                  : 'bg-slate-900 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div>
                <p className="text-[10px] font-bold text-purple-300">SYNTHÈSE FUSION</p>
                <p className="text-[9px] text-slate-400">Niv: {fusionLevel} (+{fusionLevel * 8}/s)</p>
              </div>
              <span className="text-xs font-bold text-yellow-400">{fusionUpgradeCost} PX</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
