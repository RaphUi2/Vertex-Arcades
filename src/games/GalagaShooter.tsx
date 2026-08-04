import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowLeft, ArrowRight, Zap, Trophy, Shield } from 'lucide-react';
import { audio } from '../utils/audio';

interface GalagaShooterProps {
  onScoreUpdate: (score: number) => void;
  onGameOver: (score: number) => void;
  highScore: number;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  speed: number;
  hp: number;
  color: string;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
}

export default function GalagaShooter({ onScoreUpdate, onGameOver, highScore }: GalagaShooterProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Player position
  const playerRef = useRef({ x: 150, y: 260 });
  const enemiesRef = useRef<Enemy[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const animRef = useRef<number | null>(null);

  const startGame = () => {
    audio.playClick();
    playerRef.current = { x: 150, y: 260 };
    bulletsRef.current = [];
    enemiesRef.current = [];
    setScore(0);
    setLives(3);
    setGameOver(false);
    setIsPlaying(true);
  };

  const movePlayer = (dir: number) => {
    if (!isPlaying) return;
    playerRef.current.x = Math.max(20, Math.min(280, playerRef.current.x + dir * 20));
  };

  const fire = () => {
    if (!isPlaying) return;
    audio.playClick();
    const px = playerRef.current.x;
    bulletsRef.current.push({ id: Math.random(), x: px - 8, y: 240 });
    bulletsRef.current.push({ id: Math.random(), x: px + 8, y: 240 });
  };

  // Main Loop
  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameCount = 0;

    const update = () => {
      frameCount++;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, w, h);

      // Starfield background
      ctx.fillStyle = '#1e293b';
      for (let i = 0; i < 20; i++) {
        const sx = (i * 17 + frameCount * 2) % w;
        const sy = (i * 23 + frameCount * 3) % h;
        ctx.fillRect(sx, sy, 2, 2);
      }

      // Draw Player Fighter
      const p = playerRef.current;
      ctx.save();
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - 12);
      ctx.lineTo(p.x - 12, p.y + 12);
      ctx.lineTo(p.x, p.y + 6);
      ctx.lineTo(p.x + 12, p.y + 12);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Spawn Enemies
      if (frameCount % 45 === 0) {
        const isBoss = Math.random() < 0.2;
        enemiesRef.current.push({
          id: Math.random(),
          x: 20 + Math.random() * (w - 40),
          y: -20,
          speed: isBoss ? 1.2 : 2.0,
          hp: isBoss ? 3 : 1,
          color: isBoss ? '#f43f5e' : '#a855f7',
        });
      }

      // Update Bullets
      bulletsRef.current = bulletsRef.current
        .map(b => ({ ...b, y: b.y - 8 }))
        .filter(b => b.y > 0);

      // Draw Bullets
      bulletsRef.current.forEach(b => {
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 8;
        ctx.fillRect(b.x - 1, b.y, 3, 10);
      });

      // Update Enemies
      const nextEnemies: Enemy[] = [];
      enemiesRef.current.forEach(e => {
        e.y += e.speed;

        // Draw Enemy
        ctx.save();
        ctx.fillStyle = e.color;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.hp > 1 ? 14 : 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Check Bullet hit
        let hit = false;
        bulletsRef.current.forEach(b => {
          if (Math.hypot(b.x - e.x, b.y - e.y) < 15) {
            b.y = -10; // destroy bullet
            e.hp -= 1;
            if (e.hp <= 0) hit = true;
          }
        });

        if (hit) {
          audio.playWin();
          const pts = e.color === '#f43f5e' ? 100 : 30;
          setScore(prev => {
            const newScore = prev + pts;
            onScoreUpdate(newScore);
            return newScore;
          });
        } else if (e.y > h + 20) {
          // Escaped
        } else {
          // Check collision with player
          if (Math.hypot(p.x - e.x, p.y - e.y) < 20) {
            audio.playLose();
            setLives(prev => {
              if (prev > 1) return prev - 1;
              setIsPlaying(false);
              setGameOver(true);
              onGameOver(score);
              return 0;
            });
          } else {
            nextEnemies.push(e);
          }
        }
      });

      enemiesRef.current = nextEnemies;

      if (isPlaying) {
        animRef.current = requestAnimationFrame(update);
      }
    };

    animRef.current = requestAnimationFrame(update);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, score, onGameOver, onScoreUpdate]);

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto font-mono text-white">
      {/* Header */}
      <div className="w-full flex justify-between items-center bg-slate-900/80 p-3 rounded-xl border border-sky-500/40 mb-4 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
        <div>
          <span className="text-[10px] text-sky-400 font-bold uppercase block">SCORE</span>
          <span className="text-xl font-black text-sky-300">{score}</span>
        </div>
        <div className="text-center">
          <span className="text-[10px] text-rose-400 font-bold uppercase block">VIES</span>
          <span className="text-lg font-bold text-rose-300">{'🛸'.repeat(lives)}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-yellow-400 font-bold uppercase block">RECORD</span>
          <span className="text-xl font-black text-yellow-300">{highScore}</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative bg-slate-950 p-2 rounded-2xl border-2 border-sky-500 shadow-[0_0_30px_rgba(56,189,248,0.3)]">
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
                <h3 className="text-2xl font-black text-rose-400 mb-1">VAISSEAU DÉTRUIT!</h3>
                <p className="text-xs text-slate-300 mb-4">SCORE FINAL : <span className="text-yellow-300 font-bold">{score} PTS</span></p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-sky-950 border border-sky-400 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                  <Play size={24} className="text-sky-400" />
                </div>
                <h3 className="text-xl font-black text-sky-300 mb-1">STAR FIGHTER 1980</h3>
                <p className="text-xs text-slate-400 mb-4 max-w-xs">Détruisez les escadrilles spatiales et les cuirassés ennemis !</p>
              </>
            )}
            <button
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 font-black rounded-xl cursor-pointer uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(56,189,248,0.6)] flex items-center gap-2"
            >
              {gameOver ? <RotateCcw size={16} /> : <Play size={16} />}
              {gameOver ? 'RÉESSAYER' : 'LANCER LA PARTIE'}
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full max-w-xs mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => movePlayer(-1)}
          className="p-3 bg-slate-900 border border-slate-700 hover:border-sky-400 rounded-xl flex items-center justify-center text-sky-300 cursor-pointer active:scale-95"
        >
          <ArrowLeft size={22} />
        </button>
        <button
          onClick={() => movePlayer(1)}
          className="p-3 bg-slate-900 border border-slate-700 hover:border-sky-400 rounded-xl flex items-center justify-center text-sky-300 cursor-pointer active:scale-95"
        >
          <ArrowRight size={22} />
        </button>
        <div className="col-span-2">
          <button
            onClick={fire}
            className="w-full p-3 bg-gradient-to-r from-yellow-400 to-sky-500 hover:from-yellow-300 hover:to-sky-400 text-slate-950 font-black rounded-xl flex items-center justify-center gap-2 text-xs uppercase cursor-pointer active:scale-95 shadow-[0_0_15px_rgba(56,189,248,0.5)]"
          >
            <Zap size={18} /> TIRER DOUBLE LASER
          </button>
        </div>
      </div>
    </div>
  );
}
