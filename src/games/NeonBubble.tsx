import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ArrowLeft, RotateCcw, Clock } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  radius: number;
  speed: number;
  type: 'good' | 'bad'; // good = cyan (+20 PX), bad = red (damage / game over / loss of score)
  color: string;
}

export default function NeonBubble({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const stateRef = useRef({
    isPlaying: false,
    score: 0,
    bubbles: [] as Bubble[],
    frameCount: 0,
    lives: 3,
  });

  const highScoreRef = useRef(highScore);
  useEffect(() => {
    highScoreRef.current = highScore;
  }, [highScore]);

  const startGame = () => {
    audio.playCoin();
    setScore(0);
    setTimeLeft(30);
    setIsEnded(false);
    setIsPlaying(true);

    stateRef.current = {
      isPlaying: true,
      score: 0,
      bubbles: [],
      frameCount: 0,
      lives: 3,
    };
  };

  const spawnBubble = () => {
    const isBad = Math.random() > 0.75;
    const radius = 16 + Math.random() * 12;
    const x = radius + Math.random() * (300 - radius * 2);
    const speed = 1.2 + Math.random() * 1.8;

    stateRef.current.bubbles.push({
      id: Date.now() + Math.random(),
      x,
      y: 420,
      radius,
      speed,
      type: isBad ? 'bad' : 'good',
      color: isBad ? '#ef4444' : '#06b6d4',
    });
  };

  const triggerGameOver = () => {
    setIsPlaying(false);
    setIsEnded(true);
    stateRef.current.isPlaying = false;
    onGameOver(stateRef.current.score);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!stateRef.current.isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const state = stateRef.current;
    let hitAnything = false;

    for (let i = state.bubbles.length - 1; i >= 0; i--) {
      const b = state.bubbles[i];
      const dist = Math.hypot(clickX - b.x, clickY - b.y);

      if (dist <= b.radius + 10) {
        // Pop!
        hitAnything = true;
        state.bubbles.splice(i, 1);

        if (b.type === 'good') {
          audio.playCoin();
          state.score += 20;
          setScore(state.score);
          onScore(20);
        } else {
          audio.playHit();
          state.lives--;
          if (state.lives <= 0) {
            triggerGameOver();
            return;
          }
        }
        break; // Pop only one bubble per click
      }
    }

    if (!hitAnything) {
      // Small sound on miss
      audio.playClick();
    }
  };

  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
  }, [isPlaying]);

  // 30 Seconds Timer
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isPlaying) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            triggerGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isPlaying]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const update = () => {
      const state = stateRef.current;
      if (!state.isPlaying) {
        draw(ctx, canvas);
        animId = requestAnimationFrame(update);
        return;
      }

      state.frameCount++;

      // Spawn bubbles
      if (state.frameCount % 28 === 0) {
        spawnBubble();
      }

      // Update positions
      state.bubbles.forEach((b) => {
        b.y -= b.speed;
      });

      // Check for bubbles reaching the top
      for (let i = state.bubbles.length - 1; i >= 0; i--) {
        const b = state.bubbles[i];
        if (b.y < -30) {
          state.bubbles.splice(i, 1);
          if (b.type === 'good') {
            // Missed a good bubble -> Lose points or do nothing
            state.score = Math.max(0, state.score - 5);
            setScore(state.score);
          }
        }
      }

      draw(ctx, canvas);
      animId = requestAnimationFrame(update);
    };

    const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const state = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark bg
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw bubbles
      state.bubbles.forEach((b) => {
        ctx.shadowBlur = 15;
        ctx.shadowColor = b.color;
        ctx.strokeStyle = b.color;
        ctx.lineWidth = 2.5;

        // Bubble fill with gradient
        const grad = ctx.createRadialGradient(b.x, b.y, b.radius / 4, b.x, b.y, b.radius);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
        grad.addColorStop(0.3, b.color + '33');
        grad.addColorStop(1, b.color + '1a');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Shiny reflection dot
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.15, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.shadowBlur = 0;
    };

    const triggerGameOver = () => {
      setIsPlaying(false);
      setIsEnded(true);
      audio.playGameOver();
      onGameOver(stateRef.current.score);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isEnded]);

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-white relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-200 transition-colors bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-800"
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-2 text-yellow-400">
          <Trophy size={18} />
          <span className="font-mono text-sm tracking-wide">Record: {highScore} PX</span>
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold font-sans tracking-widest text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
          Éclate-Nodes
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          ÉCLATEZ LES CODES BLEUS, ÉVITEZ LES ALERTES ROUGES !
        </p>
      </div>

      {/* Score Panel */}
      <div className="grid grid-cols-3 gap-3 mb-4 font-mono text-center relative z-10">
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SCORE</p>
          <p className="text-base font-bold text-cyan-400">{score} PX</p>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex flex-col justify-center items-center">
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Clock size={10} /> TEMPS
          </div>
          <p className={`text-base font-bold ${timeLeft <= 6 ? 'text-red-500 animate-pulse' : 'text-slate-200'}`}>{timeLeft}s</p>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">VIES</p>
          <p className="text-base font-bold text-red-400">
            {isPlaying ? '❤️'.repeat(stateRef.current.lives) : '3/3'}
          </p>
        </div>
      </div>

      {/* Stage */}
      <div className="flex flex-col justify-center items-center my-2 relative z-10">
        <div className="relative border-4 border-slate-800 rounded-2xl overflow-hidden shadow-inner">
          <canvas
            ref={canvasRef}
            width={300}
            height={400}
            onClick={handleCanvasClick}
            className="w-full max-w-[300px] aspect-[3/4] bg-slate-950 cursor-pointer block"
          />

          {/* Overlays */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-slate-950/85 flex flex-col justify-center items-center p-6 text-center font-mono">
              {!isEnded ? (
                <>
                  <p className="text-sm text-cyan-400 mb-6 font-bold uppercase tracking-widest animate-pulse">
                    FLUX DE DONNÉES PRÊT !
                  </p>
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all transform active:scale-95 text-xs tracking-widest"
                  >
                    DÉMARRER
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-red-500 mb-2 font-bold uppercase tracking-widest">
                    SESSION COMPLÉTÉE !
                  </p>
                  <p className="text-xs text-slate-400 mb-6"> Score Final : {score} PX </p>
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all transform active:scale-95 text-xs tracking-widest"
                  >
                    <RotateCcw size={14} /> REJOUER
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
