import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ArrowLeft, RotateCcw, Heart, ArrowLeft as LeftIcon, ArrowRight as RightIcon, Zap } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

interface Invader {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  points: number;
  alive: boolean;
}

interface Bullet {
  x: number;
  y: number;
  dy: number;
  isEnemy: boolean;
}

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 280;
const SHIP_WIDTH = 26;
const SHIP_HEIGHT = 12;

export default function NeonInvaders({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const stateRef = useRef({
    shipX: (CANVAS_WIDTH - SHIP_WIDTH) / 2,
    bullets: [] as Bullet[],
    invaders: [] as Invader[],
    invaderDirection: 1, // 1 for right, -1 for left
    invaderMoveTimer: 0,
    shootCooldown: 0,
    leftPressed: false,
    rightPressed: false,
    spacePressed: false,
    score: 0,
    lives: 3
  });

  const animationFrameId = useRef<number | null>(null);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') stateRef.current.leftPressed = true;
      if (e.key === 'ArrowRight') stateRef.current.rightPressed = true;
      if (e.key === ' ' || e.key === 'Spacebar') {
        stateRef.current.spacePressed = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') stateRef.current.leftPressed = false;
      if (e.key === 'ArrowRight') stateRef.current.rightPressed = false;
      if (e.key === ' ' || e.key === 'Spacebar') stateRef.current.spacePressed = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const initInvaders = () => {
    const invaders: Invader[] = [];
    const rows = 3;
    const cols = 6;
    const invWidth = 22;
    const invHeight = 14;
    const paddingX = 12;
    const paddingY = 8;
    const offsetLeft = 25;
    const offsetTop = 25;

    const colors = [
      '#f43f5e', // rose
      '#ec4899', // pink
      '#a855f7'  // purple
    ];

    let id = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        invaders.push({
          id: id++,
          x: offsetLeft + c * (invWidth + paddingX),
          y: offsetTop + r * (invHeight + paddingY),
          width: invWidth,
          height: invHeight,
          color: colors[r % colors.length],
          points: (rows - r) * 15,
          alive: true
        });
      }
    }
    return invaders;
  };

  const startNewGame = () => {
    audio.playCoin();
    setScore(0);
    setLives(3);
    setIsPlaying(true);
    setIsEnded(false);

    stateRef.current = {
      shipX: (CANVAS_WIDTH - SHIP_WIDTH) / 2,
      bullets: [],
      invaders: initInvaders(),
      invaderDirection: 1,
      invaderMoveTimer: 0,
      shootCooldown: 0,
      leftPressed: false,
      rightPressed: false,
      spacePressed: false,
      score: 0,
      lives: 3
    };
  };

  // Main game loop logic
  const updateAndDraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = stateRef.current;

    // --- Physics and Updates ---
    // Move player ship
    if (state.leftPressed) {
      state.shipX = Math.max(0, state.shipX - 3);
    }
    if (state.rightPressed) {
      state.shipX = Math.min(CANVAS_WIDTH - SHIP_WIDTH, state.shipX + 3);
    }

    // Handle Shooting
    if (state.shootCooldown > 0) {
      state.shootCooldown--;
    }
    if (state.spacePressed && state.shootCooldown === 0) {
      audio.playClick();
      state.bullets.push({
        x: state.shipX + SHIP_WIDTH / 2,
        y: CANVAS_HEIGHT - SHIP_HEIGHT - 6,
        dy: -4,
        isEnemy: false
      });
      state.shootCooldown = 22; // cooldown frames
    }

    // Move Invaders
    state.invaderMoveTimer++;
    const invaderSpeedFrames = Math.max(10, 45 - Math.floor(state.score / 20)); // speeds up as invaders die
    let shiftDown = false;

    if (state.invaderMoveTimer >= invaderSpeedFrames) {
      state.invaderMoveTimer = 0;

      // Find extreme boundaries of alive invaders
      let minX = CANVAS_WIDTH;
      let maxX = 0;
      let aliveCount = 0;

      state.invaders.forEach(inv => {
        if (inv.alive) {
          aliveCount++;
          if (inv.x < minX) minX = inv.x;
          if (inv.x + inv.width > maxX) maxX = inv.x + inv.width;
        }
      });

      if (aliveCount === 0) {
        // All dead! Spawn next wave
        state.invaders = initInvaders();
        return;
      }

      // Check if we hit the screen bounds
      if (state.invaderDirection === 1 && maxX + 8 >= CANVAS_WIDTH) {
        state.invaderDirection = -1;
        shiftDown = true;
      } else if (state.invaderDirection === -1 && minX - 8 <= 0) {
        state.invaderDirection = 1;
        shiftDown = true;
      }

      // Move them
      state.invaders.forEach(inv => {
        if (inv.alive) {
          if (shiftDown) {
            inv.y += 10;
            // Check if invaders reached player level
            if (inv.y + inv.height >= CANVAS_HEIGHT - SHIP_HEIGHT - 10) {
              state.lives = 0;
            }
          } else {
            inv.x += state.invaderDirection * 8;
          }
        }
      });
    }

    // Enemy shoots occasionally
    if (Math.random() < 0.015) {
      const aliveInvaders = state.invaders.filter(i => i.alive);
      if (aliveInvaders.length > 0) {
        const shooter = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];
        state.bullets.push({
          x: shooter.x + shooter.width / 2,
          y: shooter.y + shooter.height,
          dy: 2,
          isEnemy: true
        });
      }
    }

    // Move Bullets
    state.bullets = state.bullets.filter(bullet => {
      bullet.y += bullet.dy;
      // Out of bounds
      if (bullet.y < 0 || bullet.y > CANVAS_HEIGHT) return false;

      // Collision check
      if (bullet.isEnemy) {
        // Bullet hits player ship
        const shipY = CANVAS_HEIGHT - SHIP_HEIGHT - 6;
        if (
          bullet.x >= state.shipX &&
          bullet.x <= state.shipX + SHIP_WIDTH &&
          bullet.y >= shipY &&
          bullet.y <= shipY + SHIP_HEIGHT
        ) {
          audio.playHit();
          state.lives--;
          setLives(state.lives);
          return false;
        }
      } else {
        // Player bullet hits invader
        for (let i = 0; i < state.invaders.length; i++) {
          const inv = state.invaders[i];
          if (inv.alive) {
            if (
              bullet.x >= inv.x &&
              bullet.x <= inv.x + inv.width &&
              bullet.y >= inv.y &&
              bullet.y <= inv.y + inv.height
            ) {
              inv.alive = false;
              state.score += inv.points;
              setScore(state.score);
              onScore(inv.points);
              audio.playCoin();
              return false; // delete bullet
            }
          }
        }
      }
      return true;
    });

    // Check game over
    if (state.lives <= 0) {
      setIsPlaying(false);
      setIsEnded(true);
      audio.playGameOver();
      onGameOver(state.score);
      return;
    }

    // --- Rendering ---
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Invaders
    state.invaders.forEach(inv => {
      if (inv.alive) {
        ctx.fillStyle = inv.color;
        ctx.shadowColor = inv.color;
        ctx.shadowBlur = 6;
        ctx.fillRect(inv.x, inv.y, inv.width, inv.height);

        // Simple classic alien eyes
        ctx.fillStyle = '#020617';
        ctx.shadowBlur = 0;
        ctx.fillRect(inv.x + 4, inv.y + 4, 3, 3);
        ctx.fillRect(inv.x + inv.width - 7, inv.y + 4, 3, 3);
      }
    });

    // Draw Player Ship (Neon Cyan)
    const shipY = CANVAS_HEIGHT - SHIP_HEIGHT - 6;
    ctx.fillStyle = '#22d3ee'; // cyan-400
    ctx.shadowColor = '#06b6d4'; // cyan-500
    ctx.shadowBlur = 10;
    
    // Custom retro triangle cannon shape
    ctx.beginPath();
    ctx.moveTo(state.shipX + SHIP_WIDTH / 2, shipY);
    ctx.lineTo(state.shipX + SHIP_WIDTH, shipY + SHIP_HEIGHT);
    ctx.lineTo(state.shipX, shipY + SHIP_HEIGHT);
    ctx.closePath();
    ctx.fill();

    // Draw Bullets
    state.bullets.forEach(b => {
      ctx.fillStyle = b.isEnemy ? '#f43f5e' : '#22d3ee';
      ctx.shadowColor = b.isEnemy ? '#f43f5e' : '#22d3ee';
      ctx.shadowBlur = 6;
      ctx.fillRect(b.x - 1, b.y - 2, 2, 4);
    });

    // Reset shadow blur
    ctx.shadowBlur = 0;

    // Continue loop
    if (isPlaying) {
      animationFrameId.current = requestAnimationFrame(updateAndDraw);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      animationFrameId.current = requestAnimationFrame(updateAndDraw);
    }
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isPlaying]);

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.3)] text-white relative overflow-hidden">
      {/* Glow overlays */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Controls */}
      <div className="flex justify-between items-center mb-4 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-fuchsia-400 hover:text-fuchsia-200 transition-colors bg-fuchsia-950/40 px-3 py-1.5 rounded-lg border border-fuchsia-800"
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-2 text-yellow-400">
          <Trophy size={18} />
          <span className="font-mono text-sm tracking-wide">Record: {highScore} PX</span>
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-xl font-bold font-sans tracking-widest text-fuchsia-400 uppercase drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]">
          Envahisseurs Néon
        </h2>
        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
          ESQUIVE LES LASERS ET DÉTRUIS TOUS LES VAISSEAUX ENNEMIS !
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2.5 mb-4 font-mono text-center relative z-10 text-xs">
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
          <p className="text-[9px] text-slate-400">SCORE</p>
          <p className="text-sm font-bold text-fuchsia-400">{score} PX</p>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
          <p className="text-[9px] text-slate-400">CONTROLES</p>
          <p className="text-[10px] text-slate-300 font-medium">← / → & [ESPACE]</p>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
          <p className="text-[9px] text-slate-400">VIES</p>
          <div className="flex justify-center gap-0.5 mt-0.5">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                size={12}
                className={i < lives ? "fill-rose-500 text-rose-500 animate-pulse" : "text-slate-800"}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Game Stage */}
      <div className="flex flex-col items-center justify-center relative z-10">
        <div className="relative border-2 border-slate-800 bg-slate-950 rounded-2xl overflow-hidden p-1 bg-gradient-to-b from-slate-950 to-slate-900 shadow-inner">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="block w-full max-w-[320px] aspect-[320/280]"
          />
          
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
              <p className="text-xs text-slate-400 mb-4 max-w-[240px] uppercase font-mono">
                {isEnded ? 'PARTIE TERMINÉE !' : 'PRÊT POUR LE DUEL SPATIAL ?'}
              </p>
              {isEnded && (
                <p className="text-xl font-bold text-fuchsia-400 mb-4 font-mono">
                  SCORE FINAL : {score} PX
                </p>
              )}
              <button
                onClick={startNewGame}
                className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-mono font-bold py-2.5 px-6 rounded-xl shadow-lg transition-all text-xs tracking-wider"
              >
                <RotateCcw size={14} /> {isEnded ? 'REJOUER' : 'COMMENCER'}
              </button>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        {isPlaying && (
          <div className="flex justify-between items-center w-full max-w-[320px] mt-4 gap-3 font-mono">
            <div className="flex gap-2">
              <button
                onTouchStart={() => { stateRef.current.leftPressed = true; }}
                onTouchEnd={() => { stateRef.current.leftPressed = false; }}
                onMouseDown={() => { stateRef.current.leftPressed = true; }}
                onMouseUp={() => { stateRef.current.leftPressed = false; }}
                className="w-12 h-12 bg-slate-900 hover:bg-slate-850 active:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-center select-none cursor-pointer text-slate-300 active:text-white"
              >
                <LeftIcon size={18} />
              </button>
              <button
                onTouchStart={() => { stateRef.current.rightPressed = true; }}
                onTouchEnd={() => { stateRef.current.rightPressed = false; }}
                onMouseDown={() => { stateRef.current.rightPressed = true; }}
                onMouseUp={() => { stateRef.current.rightPressed = false; }}
                className="w-12 h-12 bg-slate-900 hover:bg-slate-850 active:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-center select-none cursor-pointer text-slate-300 active:text-white"
              >
                <RightIcon size={18} />
              </button>
            </div>

            <button
              onTouchStart={() => { stateRef.current.spacePressed = true; }}
              onTouchEnd={() => { stateRef.current.spacePressed = false; }}
              onMouseDown={() => { stateRef.current.spacePressed = true; }}
              onMouseUp={() => { stateRef.current.spacePressed = false; }}
              className="flex-1 h-12 bg-gradient-to-r from-fuchsia-600 to-pink-600 active:from-fuchsia-500 active:to-pink-500 rounded-xl flex items-center justify-center gap-1 font-bold text-xs shadow-md select-none cursor-pointer uppercase text-white"
            >
              <Zap size={14} /> FEU
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
