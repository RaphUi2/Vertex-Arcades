import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowUp, Trophy, Flame } from 'lucide-react';
import { audio } from '../utils/audio';

interface GeometryJumpProps {
  onScoreUpdate: (score: number) => void;
  onGameOver: (score: number) => void;
  highScore: number;
}

interface Spike {
  x: number;
  width: number;
  height: number;
}

export default function GeometryJump({ onScoreUpdate, onGameOver, highScore }: GeometryJumpProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Cube State
  const cubeRef = useRef({
    x: 40,
    y: 230,
    vy: 0,
    isJumping: false,
    rotation: 0,
  });

  const spikesRef = useRef<Spike[]>([]);
  const animRef = useRef<number | null>(null);

  const startGame = () => {
    audio.playClick();
    cubeRef.current = { x: 40, y: 230, vy: 0, isJumping: false, rotation: 0 };
    spikesRef.current = [
      { x: 320, width: 20, height: 25 },
      { x: 500, width: 20, height: 25 },
    ];
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  const jump = () => {
    if (!isPlaying) return;
    const cube = cubeRef.current;
    if (!cube.isJumping) {
      audio.playClick();
      cube.vy = -8.5;
      cube.isJumping = true;
    }
  };

  // Loop
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
      const groundY = 230;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Floor Line
      ctx.strokeStyle = '#ec4899';
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, groundY + 20);
      ctx.lineTo(w, groundY + 20);
      ctx.stroke();

      // Cube Physics
      const cube = cubeRef.current;
      cube.vy += 0.45; // Gravity
      cube.y += cube.vy;

      if (cube.y >= groundY) {
        cube.y = groundY;
        cube.vy = 0;
        cube.isJumping = false;
        cube.rotation = Math.round(cube.rotation / (Math.PI / 2)) * (Math.PI / 2);
      } else {
        cube.rotation += 0.12;
      }

      // Draw Cube
      ctx.save();
      ctx.translate(cube.x + 10, cube.y + 10);
      ctx.rotate(cube.rotation);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.fillRect(-10, -10, 20, 20);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(-10, -10, 20, 20);
      ctx.restore();

      // Move & Draw Spikes
      const speed = 3.5 + Math.floor(score / 50) * 0.3;
      const nextSpikes: Spike[] = [];

      spikesRef.current.forEach(spike => {
        spike.x -= speed;

        // Draw Triangle Spike
        ctx.save();
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(spike.x, groundY + 20);
        ctx.lineTo(spike.x + spike.width / 2, groundY + 20 - spike.height);
        ctx.lineTo(spike.x + spike.width, groundY + 20);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Check Collision
        if (
          cube.x + 20 > spike.x &&
          cube.x < spike.x + spike.width &&
          cube.y + 20 > groundY + 20 - spike.height
        ) {
          // Crash!
          audio.playLose();
          setIsPlaying(false);
          setGameOver(true);
          onGameOver(score);
          return;
        }

        if (spike.x > -30) {
          nextSpikes.push(spike);
        } else {
          // Passed spike -> score
          audio.playWin();
          setScore(prev => {
            const nextScore = prev + 10;
            onScoreUpdate(nextScore);
            return nextScore;
          });
        }
      });

      // Spawn new spikes
      if (nextSpikes.length === 0 || (nextSpikes[nextSpikes.length - 1].x < w - 140 && Math.random() < 0.03)) {
        nextSpikes.push({
          x: w + Math.random() * 40,
          width: 22,
          height: 26,
        });
      }

      spikesRef.current = nextSpikes;

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
      <div className="w-full flex justify-between items-center bg-slate-900/80 p-3 rounded-xl border border-pink-500/40 mb-4 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
        <div>
          <span className="text-[10px] text-pink-400 font-bold uppercase block">SCORE</span>
          <span className="text-xl font-black text-pink-300">{score}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-cyan-400 font-bold uppercase block">RECORD</span>
          <span className="text-xl font-black text-cyan-300">{highScore}</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative bg-slate-950 p-2 rounded-2xl border-2 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="rounded-xl border border-slate-800 bg-slate-950 block cursor-pointer"
          onClick={jump}
        />

        {/* Start / Game Over Overlay */}
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-4 text-center z-20">
            {gameOver ? (
              <>
                <Trophy size={48} className="text-yellow-400 mb-2 animate-bounce" />
                <h3 className="text-2xl font-black text-rose-400 mb-1">CRASH DANS LES PICS!</h3>
                <p className="text-xs text-slate-300 mb-4">SCORE FINAL : <span className="text-yellow-300 font-bold">{score} PTS</span></p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-pink-950 border border-pink-400 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                  <Play size={24} className="text-pink-400" />
                </div>
                <h3 className="text-xl font-black text-pink-300 mb-1">CYBER SPIKE JUMP</h3>
                <p className="text-xs text-slate-400 mb-4 max-w-xs">Sautez par-dessus les pics néon en rythme avec la musique !</p>
              </>
            )}
            <button
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-slate-950 font-black rounded-xl cursor-pointer uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(236,72,153,0.6)] flex items-center gap-2"
            >
              {gameOver ? <RotateCcw size={16} /> : <Play size={16} />}
              {gameOver ? 'RÉESSAYER' : 'LANCER LA PARTIE'}
            </button>
          </div>
        )}
      </div>

      {/* Jump Control */}
      <div className="w-full max-w-xs mt-4">
        <button
          onClick={jump}
          className="w-full p-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 text-sm uppercase cursor-pointer active:scale-95 shadow-[0_0_20px_rgba(236,72,153,0.5)]"
        >
          <ArrowUp size={22} /> SAUTER (TAP / CLIC)
        </button>
      </div>
    </div>
  );
}
