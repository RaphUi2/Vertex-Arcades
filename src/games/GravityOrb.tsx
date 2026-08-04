import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Trophy, RotateCcw, Zap, Sparkles, Flame } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

interface Obstacle {
  x: number;
  y: number; // Top or bottom barrier
  width: number;
  height: number;
  color: string;
}

export default function GravityOrb({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [score, setScore] = useState(0);

  const stateRef = useRef({
    isPlaying: false,
    score: 0,
    orb: {
      x: 80,
      y: 200,
      vy: 0,
      r: 12,
      gravity: 0.6 // Positive = down, Negative = up
    },
    obstacles: [] as Obstacle[],
    speed: 4,
    spawnTimer: 0
  });

  const flipGravity = () => {
    const st = stateRef.current;
    if (st.isPlaying) {
      st.orb.gravity *= -1;
      st.orb.vy = st.orb.gravity > 0 ? 3 : -3;
      audio.playJump();
    }
  };

  const startNewGame = () => {
    audio.playCoin();
    setScore(0);
    setIsEnded(false);
    setIsPlaying(true);

    stateRef.current = {
      isPlaying: true,
      score: 0,
      orb: {
        x: 80,
        y: 200,
        vy: 0,
        r: 12,
        gravity: 0.6
      },
      obstacles: [],
      speed: 4,
      spawnTimer: 0
    };
  };

  const triggerGameOver = () => {
    stateRef.current.isPlaying = false;
    setIsPlaying(false);
    setIsEnded(true);
    audio.playGameOver();
    onGameOver(stateRef.current.score);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'Enter') {
        e.preventDefault();
        if (!stateRef.current.isPlaying && !isEnded) {
          startNewGame();
        } else {
          flipGravity();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEnded]);

  // Main Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const gameLoop = () => {
      const st = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Top & Bottom Rails
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, 20);
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 20);
      ctx.lineTo(canvas.width, 20);
      ctx.moveTo(0, canvas.height - 20);
      ctx.lineTo(canvas.width, canvas.height - 20);
      ctx.stroke();

      if (st.isPlaying) {
        // Physics update
        const orb = st.orb;
        orb.vy += orb.gravity;
        orb.y += orb.vy;

        // Clamp to floor / ceiling
        if (orb.y - orb.r < 20) {
          orb.y = 20 + orb.r;
          orb.vy = 0;
        }
        if (orb.y + orb.r > canvas.height - 20) {
          orb.y = canvas.height - 20 - orb.r;
          orb.vy = 0;
        }

        // Score tick
        st.score += 1;
        if (st.score % 20 === 0) {
          setScore(st.score);
          onScore(st.score);
        }

        // Spawn obstacles
        st.spawnTimer++;
        if (st.spawnTimer > 50 - Math.min(25, Math.floor(st.score / 500))) {
          st.spawnTimer = 0;
          const isTop = Math.random() > 0.5;
          const h = 50 + Math.random() * 80;
          st.obstacles.push({
            x: canvas.width,
            y: isTop ? 20 : canvas.height - 20 - h,
            width: 25,
            height: h,
            color: isTop ? '#ec4899' : '#eab308'
          });
        }

        // Update obstacles
        for (let i = st.obstacles.length - 1; i >= 0; i--) {
          const obs = st.obstacles[i];
          obs.x -= st.speed + Math.min(3, st.score / 1000);

          // Collision test
          if (
            orb.x + orb.r > obs.x &&
            orb.x - orb.r < obs.x + obs.width &&
            orb.y + orb.r > obs.y &&
            orb.y - orb.r < obs.y + obs.height
          ) {
            triggerGameOver();
            break;
          }

          if (obs.x + obs.width < 0) {
            st.obstacles.splice(i, 1);
          }
        }
      }

      // Draw Obstacles
      st.obstacles.forEach((obs) => {
        ctx.fillStyle = obs.color;
        ctx.shadowColor = obs.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.shadowBlur = 0;
      });

      // Draw Orb
      const orb = st.orb;
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.r / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 font-mono">
      {/* Top Header */}
      <div className="w-full max-w-lg flex items-center justify-between mb-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs">
        <button
          onClick={() => { audio.playClick(); onBack(); }}
          className="flex items-center gap-1 text-slate-400 hover:text-white font-bold cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800"
        >
          <ArrowLeft size={14} /> QUITTER
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Trophy size={14} /> BEST: {highScore}
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400 font-black">
            <Zap size={14} /> {score}
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        onClick={flipGravity}
        className="relative border-2 border-cyan-500/80 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.3)] bg-slate-950 cursor-pointer"
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="block w-full max-w-[400px] h-auto"
        />

        {/* Tap Prompt */}
        {isPlaying && (
          <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
            <span className="text-[10px] bg-slate-900/80 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/50 font-bold uppercase tracking-wider">
              TAP POUR INVERSER LA GRAVITÉ 🔄
            </span>
          </div>
        )}

        {/* Start Overlay */}
        {!isPlaying && !isEnded && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="p-3 bg-cyan-950/60 rounded-full border border-cyan-500 mb-3 animate-bounce">
              <Flame size={32} className="text-cyan-400" />
            </div>
            <h3 className="text-2xl font-black text-cyan-400 uppercase tracking-widest mb-1">
              GRAVITY ORB NÉON
            </h3>
            <p className="text-xs text-slate-300 max-w-xs mb-5">
              Cliquez ou touchez l'écran pour inverser la gravité et esquiver les barrières énergétiques !
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); startNewGame(); }}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3 px-8 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-lg animate-pulse"
            >
              LANCER L'ORBE ⚡
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {isEnded && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-black text-rose-500 uppercase tracking-widest mb-1">
              IMPACT DÉTECTÉ
            </h3>
            <p className="text-sm text-slate-300 mb-4">
              Score Final : <span className="text-cyan-400 font-black">{score} pts</span>
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); startNewGame(); }}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3 px-8 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-lg flex items-center gap-2 mb-2"
            >
              <RotateCcw size={16} /> REPLAY GRAVITY
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
