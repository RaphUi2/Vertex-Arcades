import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowUp, Trophy } from 'lucide-react';
import { audio } from '../utils/audio';

interface ColorSwitchProps {
  onScoreUpdate: (score: number) => void;
  onGameOver: (score: number) => void;
  highScore: number;
}

const COLORS = ['#06b6d4', '#f43f5e', '#eab308', '#a855f7']; // Cyan, Rose, Yellow, Purple

export default function ColorSwitch({ onScoreUpdate, onGameOver, highScore }: ColorSwitchProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Ball State
  const ballRef = useRef({
    x: 150,
    y: 220,
    vy: 0,
    color: COLORS[0],
    colorIndex: 0,
  });

  // Ring Obstacles
  const ringRef = useRef({
    x: 150,
    y: 100,
    angle: 0,
    radius: 45,
    speed: 0.03,
  });

  const animRef = useRef<number | null>(null);

  const startGame = () => {
    audio.playClick();
    const firstColorIdx = Math.floor(Math.random() * COLORS.length);
    ballRef.current = {
      x: 150,
      y: 220,
      vy: 0,
      color: COLORS[firstColorIdx],
      colorIndex: firstColorIdx,
    };
    ringRef.current = {
      x: 150,
      y: 100,
      angle: 0,
      radius: 45,
      speed: 0.03,
    };
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  const tapBounce = () => {
    if (!isPlaying) return;
    audio.playClick();
    ballRef.current.vy = -5.5; // Jump up
  };

  // Main Loop
  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const update = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Physics - Ball Gravity
      const ball = ballRef.current;
      ball.vy += 0.25; // Gravity
      ball.y += ball.vy;

      // Check Floor / Ceiling
      if (ball.y > h - 15) {
        // Fall off bottom -> Game Over
        audio.playLose();
        setIsPlaying(false);
        setGameOver(true);
        onGameOver(score);
        return;
      }
      if (ball.y < 15) ball.y = 15;

      // Draw Ball
      ctx.save();
      ctx.fillStyle = ball.color;
      ctx.shadowColor = ball.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Rotate Ring
      const ring = ringRef.current;
      ring.angle += ring.speed;

      // Draw Ring (4 quadrants)
      ctx.save();
      ctx.translate(ring.x, ring.y);
      ctx.lineWidth = 10;

      for (let i = 0; i < 4; i++) {
        const startA = ring.angle + (i * Math.PI) / 2;
        const endA = startA + Math.PI / 2;
        ctx.strokeStyle = COLORS[i];
        ctx.shadowColor = COLORS[i];
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, ring.radius, startA, endA);
        ctx.stroke();
      }
      ctx.restore();

      // Check Collision with Ring top/bottom arcs when ball passes ring y
      const distY = Math.abs(ball.y - ring.y);
      if (distY < ring.radius + 8 && distY > ring.radius - 8) {
        // Calculate angle of collision relative to ring center
        const angleToBall = Math.atan2(ball.y - ring.y, ball.x - ring.x);
        let normalized = (angleToBall - ring.angle) % (Math.PI * 2);
        if (normalized < 0) normalized += Math.PI * 2;

        const hitArcIdx = Math.floor(normalized / (Math.PI / 2)) % 4;
        const hitColor = COLORS[hitArcIdx];

        if (hitColor !== ball.color) {
          // Color mismatch!
          audio.playLose();
          setIsPlaying(false);
          setGameOver(true);
          onGameOver(score);
          return;
        }
      }

      // If ball passes above ring center -> Score point & reset ring below!
      if (ball.y < ring.y - 20) {
        audio.playWin();
        const nextScore = score + 10;
        setScore(nextScore);
        onScoreUpdate(nextScore);

        // Reset ring & randomize ball color
        ring.y = 100;
        const newColorIdx = Math.floor(Math.random() * COLORS.length);
        ball.colorIndex = newColorIdx;
        ball.color = COLORS[newColorIdx];
        ball.y = 220;
        ball.vy = 0;
      }

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
      <div className="w-full flex justify-between items-center bg-slate-900/80 p-3 rounded-xl border border-yellow-500/40 mb-4 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
        <div>
          <span className="text-[10px] text-yellow-400 font-bold uppercase block">SCORE</span>
          <span className="text-xl font-black text-yellow-300">{score}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-cyan-400 font-bold uppercase block">RECORD</span>
          <span className="text-xl font-black text-cyan-300">{highScore}</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative bg-slate-950 p-2 rounded-2xl border-2 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="rounded-xl border border-slate-800 bg-slate-950 block cursor-pointer"
          onClick={tapBounce}
        />

        {/* Start / Game Over Overlay */}
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-4 text-center z-20">
            {gameOver ? (
              <>
                <Trophy size={48} className="text-yellow-400 mb-2 animate-bounce" />
                <h3 className="text-2xl font-black text-rose-400 mb-1">MAUVAISE COULEUR!</h3>
                <p className="text-xs text-slate-300 mb-4">SCORE FINAL : <span className="text-yellow-300 font-bold">{score} PTS</span></p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-yellow-950 border border-yellow-400 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                  <Play size={24} className="text-yellow-400" />
                </div>
                <h3 className="text-xl font-black text-yellow-300 mb-1">NEON COLOR SWITCH</h3>
                <p className="text-xs text-slate-400 mb-4 max-w-xs">Faites rebondir la bille à travers les anneaux de la MÊME couleur !</p>
              </>
            )}
            <button
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black rounded-xl cursor-pointer uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(234,179,8,0.6)] flex items-center gap-2"
            >
              {gameOver ? <RotateCcw size={16} /> : <Play size={16} />}
              {gameOver ? 'RÉESSAYER' : 'LANCER LA PARTIE'}
            </button>
          </div>
        )}
      </div>

      {/* Tap Bounce Control */}
      <div className="w-full max-w-xs mt-4">
        <button
          onClick={tapBounce}
          className="w-full p-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 text-sm uppercase cursor-pointer active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.5)]"
        >
          <ArrowUp size={22} /> REBONDIR (TAP / CLIC)
        </button>
      </div>
    </div>
  );
}
