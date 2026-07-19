import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ArrowLeft, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

interface Obstacle {
  x: number;
  topHeight: number;
  bottomHeight: number;
  width: number;
  passed: boolean;
}

export default function NeonFlappy({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [score, setScore] = useState(0);

  // Use refs to avoid stale closures in the requestAnimationFrame loop
  const stateRef = useRef({
    isPlaying: false,
    score: 0,
    birdY: 200,
    birdVelocity: 0,
    obstacles: [] as Obstacle[],
    frameCount: 0,
  });

  const highScoreRef = useRef(highScore);
  useEffect(() => {
    highScoreRef.current = highScore;
  }, [highScore]);

  const gravity = 0.35;
  const jumpForce = -6.5;

  const startGame = () => {
    audio.playCoin();
    setScore(0);
    setIsEnded(false);
    setIsPlaying(true);

    stateRef.current = {
      isPlaying: true,
      score: 0,
      birdY: 180,
      birdVelocity: 0,
      obstacles: [
        createObstacle(400),
        createObstacle(600),
      ],
      frameCount: 0,
    };
  };

  const createObstacle = (startX: number): Obstacle => {
    const gap = 110;
    const minHeight = 40;
    const maxHeight = 220;
    const topHeight = minHeight + Math.random() * (maxHeight - minHeight);
    const bottomHeight = 400 - topHeight - gap;

    return {
      x: startX,
      topHeight,
      bottomHeight,
      width: 45,
      passed: false,
    };
  };

  const handleCanvasClick = () => {
    if (!stateRef.current.isPlaying) {
      if (!isEnded) startGame();
      return;
    }
    stateRef.current.birdVelocity = jumpForce;
    audio.playClick();
  };

  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
  }, [isPlaying]);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const update = () => {
      const state = stateRef.current;
      if (!state.isPlaying) {
        // Draw idle screen
        draw(ctx, canvas);
        animId = requestAnimationFrame(update);
        return;
      }

      state.frameCount++;

      // Bird physics
      state.birdVelocity += gravity;
      state.birdY += state.birdVelocity;

      // Wall collision
      if (state.birdY < 10) {
        state.birdY = 10;
        state.birdVelocity = 0;
      }
      if (state.birdY > 390) {
        // Game Over
        triggerGameOver();
        return;
      }

      // Move obstacles
      state.obstacles.forEach((obs) => {
        obs.x -= 2.2;
      });

      // Remove offscreen obstacles and add new ones
      if (state.obstacles.length > 0 && state.obstacles[0].x < -50) {
        state.obstacles.shift();
      }

      const lastObs = state.obstacles[state.obstacles.length - 1];
      if (lastObs && lastObs.x < 280) {
        state.obstacles.push(createObstacle(450));
      }

      // Score checking
      state.obstacles.forEach((obs) => {
        if (!obs.passed && obs.x + obs.width < 100) {
          obs.passed = true;
          state.score += 20;
          setScore(state.score);
          onScore(20);
          audio.playCoin();
        }
      });

      // Collision detection
      const birdX = 100;
      const birdRadius = 12;

      for (let i = 0; i < state.obstacles.length; i++) {
        const obs = state.obstacles[i];
        
        // Check top obstacle
        const topCollision = 
          birdX + birdRadius > obs.x && 
          birdX - birdRadius < obs.x + obs.width && 
          state.birdY - birdRadius < obs.topHeight;

        // Check bottom obstacle
        const bottomCollision = 
          birdX + birdRadius > obs.x && 
          birdX - birdRadius < obs.x + obs.width && 
          state.birdY + birdRadius > 400 - obs.bottomHeight;

        if (topCollision || bottomCollision) {
          triggerGameOver();
          return;
        }
      }

      draw(ctx, canvas);
      animId = requestAnimationFrame(update);
    };

    const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const state = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark futuristic bg
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid background lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.3)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw obstacles
      state.obstacles.forEach((obs) => {
        // Neon top obstacle
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#f43f5e';
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#4c0519';

        // Top rect
        ctx.beginPath();
        ctx.roundRect(obs.x, -10, obs.width, obs.topHeight + 10, [0, 0, 8, 8]);
        ctx.fill();
        ctx.stroke();

        // Neon bottom obstacle
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#10b981';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#022c22';

        // Bottom rect
        const bY = 400 - obs.bottomHeight;
        ctx.beginPath();
        ctx.roundRect(obs.x, bY, obs.width, obs.bottomHeight + 10, [8, 8, 0, 0]);
        ctx.fill();
        ctx.stroke();
      });

      // Draw player bird (Glowing cyan core)
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#06b6d4';
      ctx.strokeStyle = '#22d3ee';
      ctx.fillStyle = '#0891b2';
      ctx.lineWidth = 3;

      ctx.beginPath();
      // Draw a neat arrow/triangle shape pointing slightly down/up based on velocity
      ctx.save();
      ctx.translate(100, state.birdY);
      const angle = Math.min(Math.max(state.birdVelocity * 0.06, -0.6), 0.7);
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(-10, -10);
      ctx.lineTo(-6, 0);
      ctx.lineTo(-10, 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Core thruster dot
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.beginPath();
      ctx.arc(-4, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Reset shadow
      ctx.shadowBlur = 0;
    };

    const triggerGameOver = () => {
      setIsPlaying(false);
      setIsEnded(true);
      audio.playGameOver();
      onGameOver(stateRef.current.score);
    };

    animId = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, isEnded]);

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)] text-white relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-amber-400 hover:text-amber-200 transition-colors bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-800"
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-2 text-yellow-400">
          <Trophy size={18} />
          <span className="font-mono text-sm tracking-wide">Record: {highScore} PX</span>
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold font-sans tracking-widest text-amber-400 uppercase drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
          Néon Flappy
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          CLIQUEZ POUR SAUTER ET ÉVITER LES TOURS ÉLECTRIQUES !
        </p>
      </div>

      {/* Score Panel */}
      <div className="grid grid-cols-1 mb-4 font-mono text-center relative z-10">
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SCORE</p>
          <p className="text-lg font-bold text-amber-400">{score} PX</p>
        </div>
      </div>

      {/* Stage */}
      <div className="flex justify-center items-center my-2 relative z-10">
        <div className="relative border-4 border-slate-800 rounded-2xl overflow-hidden shadow-inner">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            onClick={handleCanvasClick}
            className="w-full max-w-[400px] aspect-square bg-slate-950 cursor-pointer block"
          />

          {/* Overlays */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col justify-center items-center p-6 text-center font-mono">
              {!isEnded ? (
                <>
                  <p className="text-sm text-amber-400 mb-6 font-bold uppercase tracking-widest animate-pulse">
                    Prêt pour le Décollage ?
                  </p>
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-mono font-bold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all transform active:scale-95 text-xs tracking-widest"
                  >
                    DÉMARRER
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-red-500 mb-2 font-bold uppercase tracking-widest">
                    Vaisseau Éclaté !
                  </p>
                  <p className="text-xs text-slate-400 mb-6"> Score Final : {score} PX </p>
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-mono font-bold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all transform active:scale-95 text-xs tracking-widest"
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
