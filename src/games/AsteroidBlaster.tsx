import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, RotateCw, RotateCcw as RotateLeft, Flame, Zap, Trophy } from 'lucide-react';
import { audio } from '../utils/audio';

interface AsteroidBlasterProps {
  onScoreUpdate: (score: number) => void;
  onGameOver: (score: number) => void;
  highScore: number;
}

interface Asteroid {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number; // 3 = large, 2 = medium, 1 = small
  points: number[];
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export default function AsteroidBlaster({ onScoreUpdate, onGameOver, highScore }: AsteroidBlasterProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Ship State
  const shipRef = useRef({
    x: 150,
    y: 150,
    angle: -Math.PI / 2, // facing up
    vx: 0,
    vy: 0,
  });

  const asteroidsRef = useRef<Asteroid[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const spawnAsteroid = (x?: number, y?: number, size = 3): Asteroid => {
    const canvasWidth = 300;
    const canvasHeight = 300;

    const astX = x !== undefined ? x : Math.random() < 0.5 ? 0 : canvasWidth;
    const astY = y !== undefined ? y : Math.random() * canvasHeight;
    const speed = (4 - size) * 0.8 + Math.random() * 0.5;
    const angle = Math.random() * Math.PI * 2;

    const vertCount = 6 + Math.floor(Math.random() * 4);
    const radius = size * 8;
    const points: number[] = [];
    for (let i = 0; i < vertCount; i++) {
      const a = (i / vertCount) * Math.PI * 2;
      const r = radius * (0.8 + Math.random() * 0.4);
      points.push(r * Math.cos(a), r * Math.sin(a));
    }

    return {
      id: Math.random(),
      x: astX,
      y: astY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size,
      points,
    };
  };

  const startGame = () => {
    audio.playClick();
    shipRef.current = { x: 150, y: 150, angle: -Math.PI / 2, vx: 0, vy: 0 };
    bulletsRef.current = [];
    setScore(0);
    setLives(3);
    setGameOver(false);
    setIsPlaying(true);

    const initial: Asteroid[] = [];
    for (let i = 0; i < 4; i++) {
      initial.push(spawnAsteroid());
    }
    asteroidsRef.current = initial;
  };

  // Turn Left / Right / Thrust / Shoot
  const turn = (dir: number) => {
    if (!isPlaying) return;
    shipRef.current.angle += dir * 0.25;
  };

  const thrust = () => {
    if (!isPlaying) return;
    audio.playClick();
    const ship = shipRef.current;
    ship.vx += Math.cos(ship.angle) * 1.5;
    ship.vy += Math.sin(ship.angle) * 1.5;
  };

  const fire = () => {
    if (!isPlaying) return;
    audio.playClick();
    const ship = shipRef.current;
    const speed = 6;
    bulletsRef.current.push({
      id: Math.random(),
      x: ship.x + Math.cos(ship.angle) * 12,
      y: ship.y + Math.sin(ship.angle) * 12,
      vx: Math.cos(ship.angle) * speed,
      vy: Math.sin(ship.angle) * speed,
      life: 40,
    });
  };

  // Main Render Loop
  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateGame = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear Canvas
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // Update Ship
      const ship = shipRef.current;
      ship.x = (ship.x + ship.vx + width) % width;
      ship.y = (ship.y + ship.vy + height) % height;
      ship.vx *= 0.98; // Friction
      ship.vy *= 0.98;

      // Draw Ship
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.angle);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(-8, -7);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-8, 7);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // Update Bullets
      bulletsRef.current = bulletsRef.current
        .map(b => ({
          ...b,
          x: (b.x + b.vx + width) % width,
          y: (b.y + b.vy + height) % height,
          life: b.life - 1,
        }))
        .filter(b => b.life > 0);

      // Draw Bullets
      bulletsRef.current.forEach(b => {
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update Asteroids
      const newAsteroidsList: Asteroid[] = [];
      asteroidsRef.current.forEach(ast => {
        ast.x = (ast.x + ast.vx + width) % width;
        ast.y = (ast.y + ast.vy + height) % height;

        // Draw Asteroid
        ctx.save();
        ctx.translate(ast.x, ast.y);
        ctx.strokeStyle = ast.size === 3 ? '#ec4899' : ast.size === 2 ? '#a855f7' : '#38bdf8';
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 10;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < ast.points.length; i += 2) {
          const px = ast.points[i];
          const py = ast.points[i + 1];
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();

        // Check Bullet collisions
        let destroyed = false;
        bulletsRef.current.forEach(bullet => {
          const dist = Math.hypot(bullet.x - ast.x, bullet.y - ast.y);
          if (dist < ast.size * 8) {
            bullet.life = 0; // Destroy bullet
            destroyed = true;
          }
        });

        if (destroyed) {
          audio.playWin();
          const pts = ast.size === 3 ? 50 : ast.size === 2 ? 100 : 200;
          setScore(prev => {
            const newScore = prev + pts;
            onScoreUpdate(newScore);
            return newScore;
          });

          // Split asteroid if larger than 1
          if (ast.size > 1) {
            newAsteroidsList.push(spawnAsteroid(ast.x, ast.y, ast.size - 1));
            newAsteroidsList.push(spawnAsteroid(ast.x, ast.y, ast.size - 1));
          }
        } else {
          // Check Ship Collision
          const shipDist = Math.hypot(ship.x - ast.x, ship.y - ast.y);
          if (shipDist < ast.size * 8 + 6) {
            audio.playLose();
            setLives(prev => {
              if (prev > 1) {
                shipRef.current.x = 150;
                shipRef.current.y = 150;
                shipRef.current.vx = 0;
                shipRef.current.vy = 0;
                return prev - 1;
              } else {
                setIsPlaying(false);
                setGameOver(true);
                onGameOver(score);
                return 0;
              }
            });
          }
          newAsteroidsList.push(ast);
        }
      });

      // Respawn asteroids if all cleared
      if (newAsteroidsList.length === 0) {
        for (let i = 0; i < 5; i++) {
          newAsteroidsList.push(spawnAsteroid());
        }
      }

      asteroidsRef.current = newAsteroidsList;

      if (isPlaying) {
        animFrameRef.current = requestAnimationFrame(updateGame);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateGame);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, score, onGameOver, onScoreUpdate]);

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto font-mono text-white">
      {/* Header */}
      <div className="w-full flex justify-between items-center bg-slate-900/80 p-3 rounded-xl border border-fuchsia-500/40 mb-4 shadow-[0_0_15px_rgba(217,70,239,0.2)]">
        <div>
          <span className="text-[10px] text-fuchsia-400 font-bold uppercase block">SCORE</span>
          <span className="text-xl font-black text-fuchsia-300">{score}</span>
        </div>
        <div className="text-center">
          <span className="text-[10px] text-rose-400 font-bold uppercase block">VIES</span>
          <span className="text-lg font-bold text-rose-300">{'🚀'.repeat(lives)}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-yellow-400 font-bold uppercase block">RECORD</span>
          <span className="text-xl font-black text-yellow-300">{highScore}</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative bg-slate-950 p-2 rounded-2xl border-2 border-fuchsia-500 shadow-[0_0_30px_rgba(217,70,239,0.3)]">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="rounded-xl border border-slate-800 bg-slate-950 block"
        />

        {/* Start / Game Over Overlay */}
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-4 text-center z-20">
            {gameOver ? (
              <>
                <Trophy size={48} className="text-yellow-400 mb-2 animate-bounce" />
                <h3 className="text-2xl font-black text-rose-400 mb-1">PULVÉRISÉ !</h3>
                <p className="text-xs text-slate-300 mb-4">SCORE FINAL : <span className="text-yellow-300 font-bold">{score} PTS</span></p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-fuchsia-950 border border-fuchsia-400 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(217,70,239,0.5)]">
                  <Play size={24} className="text-fuchsia-400" />
                </div>
                <h3 className="text-xl font-black text-fuchsia-300 mb-1">ASTEROID BLASTER</h3>
                <p className="text-xs text-slate-400 mb-4 max-w-xs">Pilotez votre vaisseau et détrônez la tempête d'astéroïdes néon !</p>
              </>
            )}
            <button
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-rose-500 hover:from-fuchsia-400 hover:to-rose-400 text-slate-950 font-black rounded-xl cursor-pointer uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(217,70,239,0.6)] flex items-center gap-2"
            >
              {gameOver ? <RotateCcw size={16} /> : <Play size={16} />}
              {gameOver ? 'RÉESSAYER' : 'LANCER LA PARTIE'}
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full max-w-xs mt-4 grid grid-cols-3 gap-2">
        <button
          onClick={() => turn(-1)}
          className="p-3 bg-slate-900 border border-slate-700 hover:border-fuchsia-400 rounded-xl flex items-center justify-center text-fuchsia-300 cursor-pointer active:scale-95"
        >
          <RotateLeft size={20} />
        </button>
        <button
          onClick={thrust}
          className="p-3 bg-fuchsia-950 border border-fuchsia-500 hover:border-fuchsia-300 rounded-xl flex items-center justify-center text-fuchsia-300 cursor-pointer active:scale-95 shadow-[0_0_10px_rgba(217,70,239,0.3)]"
        >
          <Flame size={20} />
        </button>
        <button
          onClick={() => turn(1)}
          className="p-3 bg-slate-900 border border-slate-700 hover:border-fuchsia-400 rounded-xl flex items-center justify-center text-fuchsia-300 cursor-pointer active:scale-95"
        >
          <RotateCw size={20} />
        </button>
        <div className="col-span-3">
          <button
            onClick={fire}
            className="w-full p-3 bg-gradient-to-r from-yellow-500 to-rose-500 hover:from-yellow-400 hover:to-rose-400 text-slate-950 font-black rounded-xl flex items-center justify-center gap-2 text-xs uppercase cursor-pointer active:scale-95 shadow-[0_0_15px_rgba(250,204,21,0.5)]"
          >
            <Zap size={18} /> TIRER LASER
          </button>
        </div>
      </div>
    </div>
  );
}
