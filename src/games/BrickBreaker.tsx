import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ArrowLeft, RotateCcw, Heart, ArrowLeft as LeftIcon, ArrowRight as RightIcon } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

interface Brick {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  points: number;
  alive: boolean;
}

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 280;
const PADDLE_WIDTH = 60;
const PADDLE_HEIGHT = 8;
const BALL_RADIUS = 5;

export default function BrickBreaker({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Game state held in refs for the animation loop
  const stateRef = useRef({
    paddleX: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT - 30,
    dx: 2.5,
    dy: -2.5,
    bricks: [] as Brick[],
    leftPressed: false,
    rightPressed: false,
    score: 0,
    lives: 3
  });

  const animationFrameId = useRef<number | null>(null);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') stateRef.current.leftPressed = true;
      if (e.key === 'ArrowRight') stateRef.current.rightPressed = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') stateRef.current.leftPressed = false;
      if (e.key === 'ArrowRight') stateRef.current.rightPressed = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const initBricks = () => {
    const bricks: Brick[] = [];
    const rows = 4;
    const cols = 6;
    const brickWidth = 44;
    const brickHeight = 12;
    const padding = 6;
    const offsetTop = 20;
    const offsetLeft = 14;

    const colors = [
      '#f43f5e', // rose-500
      '#a855f7', // purple-500
      '#06b6d4', // cyan-500
      '#10b981'  // emerald-500
    ];

    let id = 0;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = c * (brickWidth + padding) + offsetLeft;
        const y = r * (brickHeight + padding) + offsetTop;
        bricks.push({
          id: id++,
          x,
          y,
          width: brickWidth,
          height: brickHeight,
          color: colors[r % colors.length],
          points: (4 - r) * 10,
          alive: true
        });
      }
    }
    return bricks;
  };

  const handleCrash = () => {
    audio.playHit();
    stateRef.current.lives -= 1;
    setLives(stateRef.current.lives);

    if (stateRef.current.lives <= 0) {
      endTheGame();
    } else {
      // Reset ball and paddle
      stateRef.current.ballX = CANVAS_WIDTH / 2;
      stateRef.current.ballY = CANVAS_HEIGHT - 30;
      stateRef.current.dx = 2.5;
      stateRef.current.dy = -2.5;
      stateRef.current.paddleX = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
    }
  };

  const endTheGame = () => {
    setIsPlaying(false);
    setIsEnded(true);
    audio.playGameOver();
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    onGameOver(stateRef.current.score);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear Canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const state = stateRef.current;

    // Draw Bricks
    state.bricks.forEach((b) => {
      if (b.alive) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = b.color;
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);
        ctx.strokeStyle = '#020617';
        ctx.strokeRect(b.x, b.y, b.width, b.height);
      }
    });

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw Paddle
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#06b6d4'; // cyan
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(state.paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw Ball
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#f43f5e'; // rose
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(state.ballX, state.ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.shadowBlur = 0; // Clear shadow for next frame

    // Movement logic
    if (state.rightPressed && state.paddleX < CANVAS_WIDTH - PADDLE_WIDTH) {
      state.paddleX += 4;
    } else if (state.leftPressed && state.paddleX > 0) {
      state.paddleX -= 4;
    }

    // Ball Wall bounce
    if (state.ballX + state.dx > CANVAS_WIDTH - BALL_RADIUS || state.ballX + state.dx < BALL_RADIUS) {
      state.dx = -state.dx;
      audio.playClick();
    }
    if (state.ballY + state.dy < BALL_RADIUS) {
      state.dy = -state.dy;
      audio.playClick();
    } else if (state.ballY + state.dy > CANVAS_HEIGHT - BALL_RADIUS - 10 - PADDLE_HEIGHT) {
      // Paddle bounce
      if (state.ballX > state.paddleX && state.ballX < state.paddleX + PADDLE_WIDTH) {
        state.dy = -state.dy;
        audio.playClick();
        // Give slight direction push depending on where it hit on the paddle
        const hitPoint = (state.ballX - (state.paddleX + PADDLE_WIDTH / 2)) / (PADDLE_WIDTH / 2);
        state.dx = hitPoint * 3;
      } else if (state.ballY + state.dy > CANVAS_HEIGHT - BALL_RADIUS) {
        // Missed ball!
        handleCrash();
      }
    }

    // Brick Collision Detection
    for (let i = 0; i < state.bricks.length; i++) {
      const b = state.bricks[i];
      if (b.alive) {
        if (
          state.ballX > b.x &&
          state.ballX < b.x + b.width &&
          state.ballY > b.y &&
          state.ballY < b.y + b.height
        ) {
          state.dy = -state.dy;
          b.alive = false;
          audio.playCoin();
          state.score += b.points;
          setScore(state.score);
          onScore(b.points);

          // Level cleared checking
          if (state.bricks.every((brick) => !brick.alive)) {
            audio.playWin();
            // Regenerate bricks
            state.bricks = initBricks();
            // speed up
            state.dx *= 1.15;
            state.dy *= 1.15;
          }
          break;
        }
      }
    }

    state.ballX += state.dx;
    state.ballY += state.dy;

    if (isPlaying) {
      animationFrameId.current = requestAnimationFrame(draw);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      animationFrameId.current = requestAnimationFrame(draw);
    }
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isPlaying]);

  const startGame = () => {
    audio.playCoin();
    stateRef.current = {
      paddleX: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
      ballX: CANVAS_WIDTH / 2,
      ballY: CANVAS_HEIGHT - 30,
      dx: 2.5,
      dy: -2.5,
      bricks: initBricks(),
      leftPressed: false,
      rightPressed: false,
      score: 0,
      lives: 3
    };
    setScore(0);
    setLives(3);
    setIsEnded(false);
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-white relative overflow-hidden">
      {/* Background neon light */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

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
        <h2 className="text-2xl font-bold font-sans tracking-widest text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
          Casse-Briques Néon
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          DÉTRUIS TOUTES LES BRIQUES NÉON EN FAISANT REBONDIR LA BALLE !
        </p>
      </div>

      {/* Score / Lives Panel */}
      <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-center relative z-10">
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SCORE</p>
          <p className="text-lg font-bold text-cyan-400">{score} PX</p>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
          <p className="text-[10px] text-slate-400">VIES</p>
          <div className="flex justify-center gap-1 mt-0.5">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                size={14}
                className={i < lives ? "fill-rose-500 text-rose-500 animate-pulse" : "text-slate-800"}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Game Stage (HTML Canvas) */}
      <div className="flex justify-center items-center my-2 relative z-10">
        <div className="relative border-4 border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-inner">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="block max-w-full"
          />

          {/* Overlays */}
          {!isPlaying && !isEnded && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col justify-center items-center p-4 text-center">
              <p className="text-xs font-mono text-cyan-400 mb-4 font-bold tracking-widest uppercase">Prêt à casser ?</p>
              <button
                onClick={startGame}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold py-2.5 px-6 rounded-lg text-xs tracking-widest"
              >
                DÉMARRER
              </button>
            </div>
          )}

          {isEnded && (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col justify-center items-center p-4 text-center">
              <p className="text-rose-500 font-mono font-bold tracking-widest mb-1 text-sm uppercase">GAME OVER</p>
              <p className="text-slate-400 text-xs font-mono mb-4">Score final : {score} PX</p>
              <button
                onClick={startGame}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold py-2.5 px-6 rounded-lg text-xs flex items-center gap-1.5"
              >
                <RotateCcw size={12} /> REESSAYER
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Manual direction keys for mobile/mouse players */}
      <div className="flex justify-center gap-6 mt-4 relative z-10">
        <button
          onTouchStart={() => { stateRef.current.leftPressed = true; }}
          onTouchEnd={() => { stateRef.current.leftPressed = false; }}
          onMouseDown={() => { stateRef.current.leftPressed = true; }}
          onMouseUp={() => { stateRef.current.leftPressed = false; }}
          onMouseLeave={() => { stateRef.current.leftPressed = false; }}
          className="w-16 h-12 rounded-xl bg-slate-900 border border-slate-700 active:bg-slate-800 flex items-center justify-center cursor-pointer select-none"
        >
          <LeftIcon size={24} className="text-cyan-400" />
        </button>
        <button
          onTouchStart={() => { stateRef.current.rightPressed = true; }}
          onTouchEnd={() => { stateRef.current.rightPressed = false; }}
          onMouseDown={() => { stateRef.current.rightPressed = true; }}
          onMouseUp={() => { stateRef.current.rightPressed = false; }}
          onMouseLeave={() => { stateRef.current.rightPressed = false; }}
          className="w-16 h-12 rounded-xl bg-slate-900 border border-slate-700 active:bg-slate-800 flex items-center justify-center cursor-pointer select-none"
        >
          <RightIcon size={24} className="text-cyan-400" />
        </button>
      </div>
    </div>
  );
}
