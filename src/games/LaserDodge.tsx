import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Trophy, RotateCcw, Zap, Shield, Sparkles } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  type: 'laser' | 'wall' | 'orb';
  color: string;
}

export default function LaserDodge({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);

  const stateRef = useRef({
    isPlaying: false,
    score: 0,
    health: 3,
    shipX: 170,
    shipSpeed: 6,
    keys: { left: false, right: false },
    obstacles: [] as Obstacle[],
    spawnTimer: 0,
    gameSpeed: 3.5,
    particles: [] as Array<{ x: number; y: number; vx: number; vy: number; color: string; life: number }>
  });

  const requestRef = useRef<number | null>(null);

  const startNewGame = () => {
    audio.playCoin();
    setScore(0);
    setHealth(3);
    setIsEnded(false);
    setIsPlaying(true);

    stateRef.current = {
      isPlaying: true,
      score: 0,
      health: 3,
      shipX: 170,
      shipSpeed: 6,
      keys: { left: false, right: false },
      obstacles: [],
      spawnTimer: 0,
      gameSpeed: 3.5,
      particles: []
    };
  };

  const triggerGameOver = () => {
    stateRef.current.isPlaying = false;
    setIsPlaying(false);
    setIsEnded(true);
    audio.playGameOver();
    onGameOver(stateRef.current.score);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.right = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const state = stateRef.current;

      // Draw background
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw scrolling grid speed lines
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.15)';
      ctx.lineWidth = 1;
      const offset = (now * 0.1) % 20;
      for (let y = offset; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      if (state.isPlaying) {
        // Ship controls
        if (state.keys.left) state.shipX = Math.max(20, state.shipX - state.shipSpeed);
        if (state.keys.right) state.shipX = Math.min(canvas.width - 20, state.shipX + state.shipSpeed);

        // Spawn obstacles
        state.spawnTimer += 1;
        if (state.spawnTimer >= Math.max(18, 45 - Math.floor(state.score / 30))) {
          state.spawnTimer = 0;
          const isOrb = Math.random() < 0.25;
          const isWall = !isOrb && Math.random() < 0.35;

          if (isOrb) {
            state.obstacles.push({
              x: 20 + Math.random() * (canvas.width - 40),
              y: -20,
              w: 16,
              h: 16,
              speed: state.gameSpeed * 1.2,
              type: 'orb',
              color: '#facc15'
            });
          } else if (isWall) {
            const w = 120;
            state.obstacles.push({
              x: Math.random() < 0.5 ? 10 : canvas.width - w - 10,
              y: -30,
              w,
              h: 16,
              speed: state.gameSpeed,
              type: 'wall',
              color: '#ec4899'
            });
          } else {
            const w = 40 + Math.random() * 50;
            state.obstacles.push({
              x: Math.random() * (canvas.width - w),
              y: -30,
              w,
              h: 12,
              speed: state.gameSpeed * 1.1,
              type: 'laser',
              color: '#f43f5e'
            });
          }

          // Ramp up speed slightly
          state.gameSpeed = Math.min(8.5, state.gameSpeed + 0.02);
        }

        // Update & Draw obstacles
        const shipY = canvas.height - 45;
        const shipW = 24;
        const shipH = 28;

        for (let i = state.obstacles.length - 1; i >= 0; i--) {
          const obs = state.obstacles[i];
          obs.y += obs.speed;

          // Draw obstacle
          ctx.fillStyle = obs.color;
          ctx.shadowColor = obs.color;
          ctx.shadowBlur = 12;

          if (obs.type === 'orb') {
            ctx.beginPath();
            ctx.arc(obs.x, obs.y, 10, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
          }
          ctx.shadowBlur = 0;

          // Collision with ship
          if (
            obs.y + obs.h >= shipY - shipH / 2 &&
            obs.y <= shipY + shipH / 2 &&
            obs.x + obs.w >= state.shipX - shipW / 2 &&
            obs.x <= state.shipX + shipW / 2
          ) {
            if (obs.type === 'orb') {
              // Collected energy orb!
              audio.playCoin();
              const added = 25;
              state.score += added;
              setScore(state.score);
              onScore(added);

              // Spawn sparkle
              for (let p = 0; p < 10; p++) {
                state.particles.push({
                  x: obs.x,
                  y: obs.y,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  color: '#facc15',
                  life: 1
                });
              }
              state.obstacles.splice(i, 1);
            } else {
              // Hit laser/wall!
              audio.playHit();
              state.health -= 1;
              setHealth(state.health);

              // Spark particles
              for (let p = 0; p < 12; p++) {
                state.particles.push({
                  x: state.shipX,
                  y: shipY,
                  vx: (Math.random() - 0.5) * 8,
                  vy: (Math.random() - 0.5) * 8,
                  color: '#f43f5e',
                  life: 1
                });
              }

              state.obstacles.splice(i, 1);

              if (state.health <= 0) {
                triggerGameOver();
              }
            }
            continue;
          }

          // Offscreen & Score increment
          if (obs.y > canvas.height + 30) {
            if (obs.type !== 'orb') {
              const added = 5;
              state.score += added;
              setScore(state.score);
              onScore(added);
            }
            state.obstacles.splice(i, 1);
          }
        }
      }

      // Draw Particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        if (p.life <= 0) {
          state.particles.splice(i, 1);
        } else {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
          ctx.globalAlpha = 1;
        }
      }

      // Draw Player Ship (Neon Triangle)
      const shipY = canvas.height - 45;
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(state.shipX, shipY - 18);
      ctx.lineTo(state.shipX - 14, shipY + 12);
      ctx.lineTo(state.shipX + 14, shipY + 12);
      ctx.closePath();
      ctx.fill();

      // Ship thruster flame
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(state.shipX - 6, shipY + 13);
      ctx.lineTo(state.shipX, shipY + 22 + Math.random() * 5);
      ctx.lineTo(state.shipX + 6, shipY + 13);
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 0;

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-fuchsia-500 shadow-[0_0_25px_rgba(217,70,239,0.35)] text-white relative overflow-hidden font-mono">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-fuchsia-400 hover:text-fuchsia-200 transition-colors bg-fuchsia-950/40 px-3 py-1.5 rounded-lg border border-fuchsia-800 cursor-pointer"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div className="flex items-center gap-2 text-yellow-400 text-xs">
          <Trophy size={16} />
          <span>Record: {highScore} PX</span>
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-xl font-bold uppercase tracking-widest text-fuchsia-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]">
          ESQUIVE LASER
        </h2>
        <p className="text-[10px] text-slate-400">ÉVITE LES GRILLES LASER ET ATTRAPE LES ORBES D'ÉNERGIE !</p>
      </div>

      {/* Info bar */}
      <div className="flex justify-around items-center bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 mb-4 text-xs">
        <div>
          <span className="text-[10px] text-slate-500 block uppercase">Score</span>
          <span className="font-extrabold text-fuchsia-400 text-sm">{score} PX</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 block uppercase">Bouclier</span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <Shield
                key={i}
                size={14}
                className={i < health ? "fill-fuchsia-400 text-fuchsia-400 animate-pulse" : "text-slate-800"}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex justify-center relative my-2">
        <canvas
          ref={canvasRef}
          width={340}
          height={400}
          className="bg-slate-950 rounded-xl border-2 border-slate-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] touch-none"
        />

        {/* Start / Game Over Overlay */}
        {(!isPlaying || isEnded) && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-6 text-center">
            {isEnded ? (
              <>
                <h3 className="text-2xl font-black text-rose-500 uppercase tracking-widest mb-1 animate-pulse">VAISSEAU DÉTRUIT</h3>
                <p className="text-xs text-slate-400 mb-4">SCORE FINAL : <span className="text-yellow-400 font-bold">{score} PX</span></p>
              </>
            ) : (
              <>
                <Sparkles size={36} className="text-fuchsia-400 mb-2 animate-bounce" />
                <h3 className="text-lg font-black text-fuchsia-400 uppercase tracking-widest mb-1">DÉFI ESQUIVE LASER</h3>
                <p className="text-[10px] text-slate-400 max-w-xs mb-4">
                  Utilise les flèches (ou A / D / boutons) pour esquiver les lasers et ramasser les orbes jaunes !
                </p>
              </>
            )}

            <button
              onClick={startNewGame}
              className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 to-rose-600 hover:from-fuchsia-500 hover:to-rose-500 text-white font-extrabold text-xs py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(217,70,239,0.5)] transition-all transform active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              <RotateCcw size={16} /> {isEnded ? 'REJOUER' : 'LANCER LA PARTIE'}
            </button>
          </div>
        )}
      </div>

      {/* On-screen controls for mobile */}
      <div className="flex justify-between gap-4 mt-4">
        <button
          onMouseDown={() => { stateRef.current.keys.left = true; }}
          onMouseUp={() => { stateRef.current.keys.left = false; }}
          onTouchStart={() => { stateRef.current.keys.left = true; }}
          onTouchEnd={() => { stateRef.current.keys.left = false; }}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-fuchsia-400 font-bold py-3 rounded-xl border border-slate-800 text-xs active:bg-fuchsia-950 cursor-pointer select-none"
        >
          ◄ GAUCHE
        </button>
        <button
          onMouseDown={() => { stateRef.current.keys.right = true; }}
          onMouseUp={() => { stateRef.current.keys.right = false; }}
          onTouchStart={() => { stateRef.current.keys.right = true; }}
          onTouchEnd={() => { stateRef.current.keys.right = false; }}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-fuchsia-400 font-bold py-3 rounded-xl border border-slate-800 text-xs active:bg-fuchsia-950 cursor-pointer select-none"
        >
          DROITE ►
        </button>
      </div>
    </div>
  );
}
