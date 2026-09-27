import React, { useState, useEffect, useRef } from 'react';
import { Zap, Shield, Trophy, RotateCcw, Flame, Sparkles } from 'lucide-react';
import { audio } from '../utils/audio';

interface SolarOverdriveProps {
  onScoreSubmit: (score: number) => void;
  onVCoinsEarned: (coins: number) => void;
}

interface Obstacle {
  lane: number; // 0, 1, 2
  z: number; // Distance 0 to 1000
  type: 'barrier' | 'boost' | 'coin';
}

export function SolarOverdrive({ onScoreSubmit, onVCoinsEarned }: SolarOverdriveProps) {
  const [currentLane, setCurrentLane] = useState(1); // 0 = Left, 1 = Center, 2 = Right
  const [speed, setSpeed] = useState(15);
  const [distance, setDistance] = useState(0);
  const [shield, setShield] = useState(100);
  const [nitro, setNitro] = useState(100);
  const [isNitroActive, setIsNitroActive] = useState(false);
  const [score, setScore] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);

  const animFrameRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const currentLaneRef = useRef(1);
  currentLaneRef.current = currentLane;

  const handleLaneMove = (delta: number) => {
    if (gameOver) return;
    audio.playClick();
    setCurrentLane(prev => Math.max(0, Math.min(2, prev + delta)));
  };

  const activateNitro = () => {
    if (gameOver || nitro < 30 || isNitroActive) return;
    setIsNitroActive(true);
    audio.playLaser();
    setSpeed(prev => prev + 12);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'q') handleLaneMove(-1);
      if (e.key === 'ArrowRight' || e.key === 'd') handleLaneMove(1);
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') activateNitro();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nitro, isNitroActive, gameOver]);

  // Game loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (!gameOver) {
        // Update distance and score
        const activeSpeed = isNitroActive ? 32 : 18;
        setDistance(prev => {
          const next = prev + activeSpeed * dt * 25;
          setScore(Math.floor(next));
          return next;
        });

        // Deplete nitro
        if (isNitroActive) {
          setNitro(prev => {
            const next = prev - 45 * dt;
            if (next <= 0) {
              setIsNitroActive(false);
              return 0;
            }
            return next;
          });
        } else {
          setNitro(prev => Math.min(100, prev + 12 * dt));
        }

        // Spawn obstacles
        if (time - lastSpawnRef.current > 750) {
          lastSpawnRef.current = time;
          const r = Math.random();
          const lane = Math.floor(Math.random() * 3);
          const type: Obstacle['type'] = r < 0.55 ? 'barrier' : r < 0.8 ? 'coin' : 'boost';
          setObstacles(prev => [...prev, { lane, z: 1000, type }]);
        }

        // Advance obstacles & collision check
        setObstacles(prev => {
          const nextObstacles: Obstacle[] = [];
          for (const obs of prev) {
            const nextZ = obs.z - activeSpeed * dt * 110;
            // Collision at player position (z around 80-140)
            if (nextZ >= 60 && nextZ <= 140 && obs.lane === currentLaneRef.current) {
              if (obs.type === 'barrier') {
                audio.playDamage();
                setShield(s => {
                  const remaining = s - 35;
                  if (remaining <= 0) {
                    setGameOver(true);
                    audio.playGameOver();
                  }
                  return Math.max(0, remaining);
                });
              } else if (obs.type === 'coin') {
                audio.playWin();
                setCoinsCollected(c => c + 1);
                onVCoinsEarned(5);
              } else if (obs.type === 'boost') {
                audio.playLevelUp();
                setNitro(100);
              }
            } else if (nextZ > 0) {
              nextObstacles.push({ ...obs, z: nextZ });
            }
          }
          return nextObstacles;
        });
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [gameOver, isNitroActive]);

  useEffect(() => {
    if (gameOver) {
      onScoreSubmit(score);
    }
  }, [gameOver]);

  const restartGame = () => {
    setCurrentLane(1);
    setDistance(0);
    setShield(100);
    setNitro(100);
    setIsNitroActive(false);
    setScore(0);
    setCoinsCollected(0);
    setObstacles([]);
    setGameOver(false);
    audio.playStart();
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 bg-slate-950 text-white select-none overflow-hidden font-mono">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between z-20 px-4 py-2 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">DISTANCE</span>
            <strong className="text-cyan-300 text-lg font-black">{score.toLocaleString()} m</strong>
          </div>
          <div className="border-l border-white/10 pl-4">
            <span className="text-slate-400 block text-[10px]">V-COINS SAISIS</span>
            <strong className="text-yellow-400 text-lg font-black">+{coinsCollected * 5} VC</strong>
          </div>
        </div>

        {/* Shield & Nitro Bars */}
        <div className="flex items-center gap-4">
          <div className="w-28 sm:w-36">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-emerald-400 flex items-center gap-1 font-bold"><Shield className="w-3 h-3" /> BOUCLIER</span>
              <span>{Math.round(shield)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${shield > 40 ? 'bg-emerald-400' : 'bg-rose-500'}`}
                style={{ width: `${shield}%` }}
              />
            </div>
          </div>

          <div className="w-28 sm:w-36">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-amber-400 flex items-center gap-1 font-bold"><Flame className="w-3 h-3" /> NITRO</span>
              <span>{Math.round(nitro)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${isNitroActive ? 'bg-gradient-to-r from-orange-400 to-rose-500 animate-pulse' : 'bg-amber-400'}`}
                style={{ width: `${nitro}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3D Track Perspective Canvas Area */}
      <div className="relative w-full flex-1 my-3 rounded-3xl overflow-hidden border border-cyan-500/30 bg-gradient-to-b from-indigo-950 via-slate-900 to-black shadow-[inset_0_0_80px_rgba(6,182,212,0.2)]">
        {/* Starfield & Sun in Horizon */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full bg-gradient-to-b from-yellow-300 via-rose-500 to-purple-600 blur-sm opacity-90 shadow-[0_0_60px_#f43f5e]" />
        
        {/* Perspective Track Floor */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Track Grid Lines */}
          <div className="w-full h-full relative" style={{ perspective: '300px' }}>
            <div
              className="absolute bottom-0 w-full h-[70%] border-t-2 border-cyan-400/50"
              style={{
                transform: 'rotateX(60deg)',
                background: 'linear-gradient(to top, rgba(6,182,212,0.15) 0%, transparent 100%)',
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 32%, rgba(6,182,212,0.4) 33%, rgba(6,182,212,0.4) 34%, transparent 35%, transparent 65%, rgba(6,182,212,0.4) 66%, rgba(6,182,212,0.4) 67%, transparent 68%)'
              }}
            />
          </div>
        </div>

        {/* Obstacles rendered in 3D projection */}
        {obstacles.map((obs, idx) => {
          const depthProgress = Math.max(0, Math.min(1, 1 - obs.z / 1000));
          const scale = 0.2 + depthProgress * 1.3;
          const bottom = depthProgress * 75; // percentage from bottom
          const laneX = obs.lane === 0 ? 25 : obs.lane === 1 ? 50 : 75;

          return (
            <div
              key={idx}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform pointer-events-none"
              style={{
                left: `${laneX}%`,
                bottom: `${bottom}%`,
                transform: `scale(${scale})`,
                zIndex: Math.floor(depthProgress * 50)
              }}
            >
              {obs.type === 'barrier' && (
                <div className="w-20 h-10 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 border-2 border-rose-300 flex items-center justify-center shadow-[0_0_20px_#ef4444] text-white font-black text-xs">
                  ⚡ LASER
                </div>
              )}
              {obs.type === 'coin' && (
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-500 via-amber-300 to-yellow-100 border-2 border-amber-200 flex items-center justify-center shadow-[0_0_25px_#f59e0b] text-slate-950 font-black text-sm animate-spin">
                  VC
                </div>
              )}
              {obs.type === 'boost' && (
                <div className="w-16 h-8 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 border-2 border-cyan-200 flex items-center justify-center shadow-[0_0_20px_#06b6d4] text-white font-black text-xs">
                  NITRO
                </div>
              )}
            </div>
          );
        })}

        {/* Player Hovercraft */}
        <div
          className="absolute bottom-6 -translate-x-1/2 transition-all duration-150 z-30"
          style={{
            left: currentLane === 0 ? '25%' : currentLane === 1 ? '50%' : '75%'
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* Nitro thruster flame */}
            <div className={`w-8 h-10 rounded-full blur-[2px] transition-all ${isNitroActive ? 'bg-gradient-to-t from-orange-500 via-yellow-300 to-transparent scale-150 shadow-[0_0_25px_#f97316]' : 'bg-gradient-to-t from-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee]'}`} />
            
            {/* Cyber Racer Vessel */}
            <div className="w-24 h-16 rounded-2xl bg-gradient-to-b from-cyan-400 via-blue-600 to-slate-900 border-2 border-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.8)] flex items-center justify-center relative">
              <div className="w-12 h-6 rounded-lg bg-cyan-200/90 shadow-inner flex items-center justify-center text-[9px] font-black text-slate-950">
                APEX 3000
              </div>
              {/* Twin wings */}
              <div className="absolute -left-3 top-3 w-4 h-8 bg-cyan-500 rounded-l-lg border-l border-white/50" />
              <div className="absolute -right-3 top-3 w-4 h-8 bg-cyan-500 rounded-r-lg border-r border-white/50" />
            </div>
          </div>
        </div>

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xl flex flex-col items-center justify-center p-6 z-50 text-center animate-fade-in">
            <Trophy className="w-16 h-16 text-yellow-400 mb-3 animate-bounce" />
            <h2 className="text-2xl font-black text-white font-mono tracking-wider">COLLISION CRITIQUE !</h2>
            <p className="text-slate-300 text-sm mt-1 mb-4">Votre vaisseau Solar a pulvérisé la distance.</p>
            
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 mb-6 w-full max-w-xs space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Distance parcourue</span>
                <strong className="text-cyan-300">{score.toLocaleString()} m</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">V-Coins ramassés</span>
                <strong className="text-yellow-400">+{coinsCollected * 5} VC</strong>
              </div>
            </div>

            <button
              onClick={restartGame}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black font-mono flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_25px_rgba(6,182,212,0.6)] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> NOUVELLE COURSE
            </button>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="w-full flex items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleLaneMove(-1)}
            disabled={currentLane === 0}
            className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 active:scale-95 disabled:opacity-30 cursor-pointer font-black text-sm"
          >
            ← GAUCHE
          </button>
          <button
            onClick={() => handleLaneMove(1)}
            disabled={currentLane === 2}
            className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 active:scale-95 disabled:opacity-30 cursor-pointer font-black text-sm"
          >
            DROITE →
          </button>
        </div>

        <button
          onClick={activateNitro}
          disabled={nitro < 30 || isNitroActive}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black active:scale-95 disabled:opacity-40 cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
        >
          <Flame className="w-4 h-4 fill-current" /> {isNitroActive ? 'BOOST ACTIF !' : 'PROPULSION NITRO'}
        </button>
      </div>
    </div>
  );
}
