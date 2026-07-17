import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ArrowLeft, RotateCcw, Heart, ArrowLeft as LeftIcon, ArrowRight as RightIcon, Sparkles } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

interface Meteor {
  id: number;
  x: number;
  y: number;
  radius: number;
  speed: number;
  color: string;
  points: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

interface Laser {
  x: number;
  y: number;
}

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 280;
const SHIP_WIDTH = 22;
const SHIP_HEIGHT = 16;

export default function MeteorStorm({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const stateRef = useRef({
    shipX: (CANVAS_WIDTH - SHIP_WIDTH) / 2,
    meteors: [] as Meteor[],
    lasers: [] as Laser[],
    particles: [] as Particle[],
    spawnTimer: 0,
    shootCooldown: 0,
    leftPressed: false,
    rightPressed: false,
    shootPressed: false,
    meteorIdCounter: 0,
    score: 0,
    lives: 3
  });

  const animationFrameId = useRef<number | null>(null);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') stateRef.current.leftPressed = true;
      if (e.key === 'ArrowRight') stateRef.current.rightPressed = true;
      if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'ArrowUp') {
        stateRef.current.shootPressed = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') stateRef.current.leftPressed = false;
      if (e.key === 'ArrowRight') stateRef.current.rightPressed = false;
      if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'ArrowUp') stateRef.current.shootPressed = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startNewGame = () => {
    audio.playCoin();
    setScore(0);
    setLives(3);
    setIsPlaying(true);
    setIsEnded(false);

    stateRef.current = {
      shipX: (CANVAS_WIDTH - SHIP_WIDTH) / 2,
      meteors: [],
      lasers: [],
      particles: [],
      spawnTimer: 0,
      shootCooldown: 0,
      leftPressed: false,
      rightPressed: false,
      shootPressed: false,
      meteorIdCounter: 0,
      score: 0,
      lives: 3
    };
  };

  const createParticles = (x: number, y: number, color: string) => {
    const particles = stateRef.current.particles;
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1 + Math.random() * 2,
        color,
        alpha: 1
      });
    }
  };

  const updateAndDraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = stateRef.current;

    // --- Core Updates ---
    // Move ship
    if (state.leftPressed) {
      state.shipX = Math.max(0, state.shipX - 3.5);
    }
    if (state.rightPressed) {
      state.shipX = Math.min(CANVAS_WIDTH - SHIP_WIDTH, state.shipX + 3.5);
    }

    // Handle Shooting
    if (state.shootCooldown > 0) {
      state.shootCooldown--;
    }
    if (state.shootPressed && state.shootCooldown === 0) {
      audio.playClick();
      state.lasers.push({
        x: state.shipX + SHIP_WIDTH / 2,
        y: CANVAS_HEIGHT - SHIP_HEIGHT - 6
      });
      state.shootCooldown = 15; // fast fire
    }

    // Spawn Meteors
    state.spawnTimer++;
    const spawnRate = Math.max(12, 35 - Math.floor(state.score / 60)); // spawn more as score climbs
    if (state.spawnTimer >= spawnRate) {
      state.spawnTimer = 0;
      const radius = 6 + Math.random() * 12;
      const x = radius + Math.random() * (CANVAS_WIDTH - radius * 2);
      const speed = 1.5 + Math.random() * 2 + (state.score / 150); // accelerate slowly

      const colors = [
        '#f43f5e', // rose-500
        '#eab308', // yellow-500
        '#3b82f6', // blue-500
        '#a855f7'  // purple-500
      ];

      state.meteors.push({
        id: state.meteorIdCounter++,
        x,
        y: -radius,
        radius,
        speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        points: Math.floor(radius)
      });
    }

    // Move Lasers
    state.lasers = state.lasers.filter(laser => {
      laser.y -= 5;
      return laser.y > 0;
    });

    // Move particles
    state.particles = state.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.03;
      return p.alpha > 0;
    });

    // Move and Collision Check Meteors
    state.meteors = state.meteors.filter(meteor => {
      meteor.y += meteor.speed;

      // Check laser collision
      for (let l = 0; l < state.lasers.length; l++) {
        const laser = state.lasers[l];
        const dist = Math.hypot(meteor.x - laser.x, meteor.y - laser.y);
        if (dist <= meteor.radius + 3) {
          // Explode meteor!
          audio.playCoin();
          createParticles(meteor.x, meteor.y, meteor.color);
          
          state.score += 10;
          setScore(state.score);
          onScore(10);

          // delete laser
          state.lasers.splice(l, 1);
          return false;
        }
      }

      // Check ship collision
      const shipY = CANVAS_HEIGHT - SHIP_HEIGHT - 6;
      // Simple circle-box collision approximation for meteor vs ship
      const testX = Math.max(state.shipX, Math.min(meteor.x, state.shipX + SHIP_WIDTH));
      const testY = Math.max(shipY, Math.min(meteor.y, shipY + SHIP_HEIGHT));
      const distToShip = Math.hypot(meteor.x - testX, meteor.y - testY);

      if (distToShip < meteor.radius) {
        audio.playHit();
        createParticles(meteor.x, meteor.y, '#ef4444');
        state.lives--;
        setLives(state.lives);
        return false; // delete meteor
      }

      // Check bottom boundary (passed safely)
      if (meteor.y - meteor.radius > CANVAS_HEIGHT) {
        // Dodged bonus
        state.score += 2;
        setScore(state.score);
        onScore(2);
        return false;
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

    // --- Canvas Rendering ---
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid background lines inside canvas for cyberpunk matrix feel
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.25)';
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_WIDTH; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Draw Particles
    state.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Lasers
    state.lasers.forEach(l => {
      ctx.strokeStyle = '#38bdf8'; // light blue laser
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#0ea5e9';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(l.x, l.y);
      ctx.lineTo(l.x, l.y - 10);
      ctx.stroke();
    });
    ctx.shadowBlur = 0; // reset

    // Draw Meteors
    state.meteors.forEach(m => {
      ctx.fillStyle = m.color;
      ctx.shadowColor = m.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
      ctx.fill();

      // Inner details/crater overlay
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(m.x - m.radius * 0.3, m.y - m.radius * 0.2, m.radius * 0.25, 0, Math.PI * 2);
      ctx.arc(m.x + m.radius * 0.2, m.y + m.radius * 0.3, m.radius * 0.2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Player Spaceship (Golden Arrow shape)
    const shipY = CANVAS_HEIGHT - SHIP_HEIGHT - 6;
    ctx.fillStyle = '#f59e0b'; // amber-500
    ctx.shadowColor = '#d97706'; // amber-600
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.moveTo(state.shipX + SHIP_WIDTH / 2, shipY); // tip
    ctx.lineTo(state.shipX + SHIP_WIDTH, shipY + SHIP_HEIGHT); // right wing
    ctx.lineTo(state.shipX + SHIP_WIDTH / 2, shipY + SHIP_HEIGHT - 4); // tail indent
    ctx.lineTo(state.shipX, shipY + SHIP_HEIGHT); // left wing
    ctx.closePath();
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Frame requests
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
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)] text-white relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Back/Trophy */}
      <div className="flex justify-between items-center mb-4 relative z-10">
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
        <h2 className="text-xl font-bold font-sans tracking-widest text-amber-400 uppercase drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] flex items-center justify-center gap-1.5">
          <Sparkles size={18} className="animate-pulse" /> Tempête Météore
        </h2>
        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
          ESQUIVE ET FAIS EXPLOSER TOUS LES MÉTÉORES DU NÉON !
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2.5 mb-4 font-mono text-center relative z-10 text-xs">
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
          <p className="text-[9px] text-slate-400">SCORE</p>
          <p className="text-sm font-bold text-amber-400">{score} PX</p>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
          <p className="text-[9px] text-slate-400">COMMANDES</p>
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

      {/* Game view */}
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
                {isEnded ? 'PARTIE TERMINÉE !' : 'PRENDS LES COMMANDES DU RETRO VAISSEAU !'}
              </p>
              {isEnded && (
                <p className="text-xl font-bold text-amber-400 mb-4 font-mono">
                  SCORE FINAL : {score} PX
                </p>
              )}
              <button
                onClick={startNewGame}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white font-mono font-bold py-2.5 px-6 rounded-xl shadow-lg transition-all text-xs tracking-wider"
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
              onTouchStart={() => { stateRef.current.shootPressed = true; }}
              onTouchEnd={() => { stateRef.current.shootPressed = false; }}
              onMouseDown={() => { stateRef.current.shootPressed = true; }}
              onMouseUp={() => { stateRef.current.shootPressed = false; }}
              className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-yellow-600 active:from-amber-400 active:to-yellow-500 rounded-xl flex items-center justify-center gap-1 font-bold text-xs shadow-md select-none cursor-pointer uppercase text-white"
            >
              <Sparkles size={14} /> FEU
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
