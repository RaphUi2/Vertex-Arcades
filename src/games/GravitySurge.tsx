import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../utils/audio';
import { Play, RotateCcw, X, Orbit, Sparkles } from 'lucide-react';

interface GameProps {
  onFinish: (score: number, bonusVC?: number) => void;
  onExit: () => void;
}

export function GravitySurge({ onFinish, onExit }: GameProps) {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState(0);
  const [comets, setComets] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const podRef = useRef({
    currentPlanetIndex: 0,
    angle: 0,
    speed: 0.05,
    isFlying: false,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0
  });

  const planetsRef = useRef<{ x: number; y: number; r: number; color: string }[]>([]);
  const stardustRef = useRef<{ x: number; y: number; taken: boolean }[]>([]);

  const startGame = () => {
    audio.playStart();
    setGameState('playing');
    setScore(0);
    setComets(0);

    const pls = [
      { x: 120, y: 200, r: 35, color: '#3b82f6' },
      { x: 300, y: 140, r: 45, color: '#a855f7' },
      { x: 480, y: 260, r: 40, color: '#ec4899' },
      { x: 680, y: 170, r: 50, color: '#f59e0b' }
    ];
    planetsRef.current = pls;

    const dust: any[] = [];
    for (let i = 0; i < 15; i++) {
      dust.push({ x: Math.random() * 700 + 50, y: Math.random() * 320 + 30, taken: false });
    }
    stardustRef.current = dust;

    podRef.current = {
      currentPlanetIndex: 0,
      angle: 0,
      speed: 0.045,
      isFlying: false,
      x: pls[0].x,
      y: pls[0].y - pls[0].r - 12,
      vx: 0,
      vy: 0
    };
  };

  // Launch Pod
  const launchPod = () => {
    if (gameState !== 'playing') return;
    const p = podRef.current;
    if (p.isFlying) return;

    audio.playJump();
    p.isFlying = true;
    const curP = planetsRef.current[p.currentPlanetIndex];
    // Tangent velocity
    p.vx = -Math.sin(p.angle) * 8.5;
    p.vy = Math.cos(p.angle) * 8.5;
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') launchPod();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  // Main Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      const p = podRef.current;

      if (!p.isFlying) {
        // Orbit current planet
        const pl = planetsRef.current[p.currentPlanetIndex];
        p.angle += p.speed;
        p.x = pl.x + Math.cos(p.angle) * (pl.r + 14);
        p.y = pl.y + Math.sin(p.angle) * (pl.r + 14);
      } else {
        // Flying through space
        p.x += p.vx;
        p.y += p.vy;

        // Check if captured by another planet
        planetsRef.current.forEach((pl, idx) => {
          if (idx !== p.currentPlanetIndex) {
            const dist = Math.hypot(p.x - pl.x, p.y - pl.y);
            if (dist < pl.r + 18) {
              audio.playWin();
              p.isFlying = false;
              p.currentPlanetIndex = idx;
              p.angle = Math.atan2(p.y - pl.y, p.x - pl.x);
              setScore(s => s + 250);
            }
          }
        });

        // Lost in deep space check
        if (p.x < -50 || p.x > canvas.width + 50 || p.y < -50 || p.y > canvas.height + 50) {
          audio.playOof();
          setGameState('gameover');
          onFinish(score + comets * 50, 25);
        }
      }

      // Collect Stardust
      stardustRef.current.forEach(dust => {
        if (!dust.taken && Math.hypot(p.x - dust.x, p.y - dust.y) < 18) {
          dust.taken = true;
          audio.playCoin();
          setComets(c => c + 1);
          setScore(s => s + 80);
        }
      });

      // RENDER
      ctx.fillStyle = '#050713';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 40; i++) {
        const sx = (i * 91) % canvas.width;
        const sy = (i * 59) % canvas.height;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Draw Stardust
      stardustRef.current.forEach(dust => {
        if (!dust.taken) {
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(dust.x, dust.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Planets
      planetsRef.current.forEach((pl, idx) => {
        ctx.fillStyle = pl.color;
        ctx.beginPath();
        ctx.arc(pl.x, pl.y, pl.r, 0, Math.PI * 2);
        ctx.fill();

        // Orbit ring
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pl.x, pl.y, pl.r + 14, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Draw Pod
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Flame trail if flying
      if (p.isFlying) {
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(p.x - p.vx * 1.5, p.y - p.vy * 1.5, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, score, comets, onFinish]);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[#0a0a1c] border-2 border-violet-500/50 rounded-3xl p-6 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-violet-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400 flex items-center justify-center text-violet-300 font-bold text-lg">
            🪐
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">Gravity Surge: Orbital Jumper</h2>
            <p className="text-xs text-violet-400 font-mono">Poussières d'étoiles: {comets} ⭐</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-mono font-bold">
          <div className="text-yellow-400">Score: {score}</div>
          <button onClick={onExit} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-violet-900/60 bg-[#050713] flex justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={380}
          onClick={launchPod}
          className="w-full max-w-[800px] h-auto block cursor-pointer"
        />

        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-300 font-mono mb-2">
              GRAVITY SURGE
            </h3>
            <p className="text-slate-300 text-sm max-w-md mb-6">
              Appuyez sur <strong>Espace / Clic</strong> pour éjecter votre capsule hors de l'orbite actuelle et vous arrimer à la planète suivante !
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(139,92,246,0.5)] cursor-pointer flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" /> ALLUMER L'ORBITAL
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl mb-2">🌌🛰️</div>
            <h3 className="text-2xl font-black text-rose-500 font-mono mb-2">PERDU DANS LE NÉANT</h3>
            <p className="text-slate-300 text-sm mb-4">Score cosmique : <strong className="text-violet-300">{score} pts</strong></p>
            <div className="flex gap-3">
              <button onClick={startGame} className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs uppercase">
                Rejouer
              </button>
              <button onClick={onExit} className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs uppercase">
                Quitter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
