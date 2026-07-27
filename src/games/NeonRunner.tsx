import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Trophy, RotateCcw, Zap, Sparkles, Flame, Shield } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'barrier' | 'drone' | 'orb' | 'shield';
  passed?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

export default function NeonRunner({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [hasShield, setHasShield] = useState(false);

  const stateRef = useRef({
    isPlaying: false,
    score: 0,
    runnerY: 280,
    vy: 0,
    gravity: 0.6,
    jumpForce: -11.5,
    isGrounded: true,
    jumpsLeft: 2,
    hasShield: false,
    speed: 4.5,
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    spawnTimer: 0,
    distance: 0,
    groundY: 280
  });

  const requestRef = useRef<number | null>(null);

  const doJump = () => {
    const st = stateRef.current;
    if (!st.isPlaying) return;

    if (st.jumpsLeft > 0) {
      st.vy = st.jumpForce;
      st.isGrounded = false;
      st.jumpsLeft -= 1;
      audio.playClick();

      // Jump particles
      for (let i = 0; i < 8; i++) {
        st.particles.push({
          x: 60,
          y: st.runnerY + 20,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 2 + 1,
          size: Math.random() * 4 + 2,
          color: '#06b6d4',
          life: 1
        });
      }
    }
  };

  const startNewGame = () => {
    audio.playCoin();
    setScore(0);
    setIsEnded(false);
    setIsPlaying(true);
    setHasShield(false);

    stateRef.current = {
      isPlaying: true,
      score: 0,
      runnerY: 280,
      vy: 0,
      gravity: 0.6,
      jumpForce: -11.5,
      isGrounded: true,
      jumpsLeft: 2,
      hasShield: false,
      speed: 4.5,
      obstacles: [],
      particles: [],
      spawnTimer: 0,
      distance: 0,
      groundY: 280
    };
  };

  const triggerGameOver = () => {
    stateRef.current.isPlaying = false;
    setIsPlaying(false);
    setIsEnded(true);
    audio.playGameOver();
    onGameOver(stateRef.current.score);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        if (!stateRef.current.isPlaying && !isEnded) {
          startNewGame();
        } else {
          doJump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEnded]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const gameLoop = () => {
      const st = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background Cyberpunk Grid
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Moving Neon Ground Line
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, st.groundY + 20);
      ctx.lineTo(canvas.width, st.groundY + 20);
      ctx.stroke();

      // Ground grid lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 1;
      const gridOffset = (st.distance * 8) % 30;
      for (let x = -gridOffset; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, st.groundY + 20);
        ctx.lineTo(x - 40, canvas.height);
        ctx.stroke();
      }

      if (st.isPlaying) {
        st.distance += 0.1;
        st.speed = 4.5 + Math.floor(st.distance / 50) * 0.4;
        st.score = Math.floor(st.distance * 10);
        setScore(st.score);
        onScore(st.score);

        // Runner physics
        st.vy += st.gravity;
        st.runnerY += st.vy;

        if (st.runnerY >= st.groundY - 15) {
          st.runnerY = st.groundY - 15;
          st.vy = 0;
          st.isGrounded = true;
          st.jumpsLeft = 2;
        }

        // Runner trail particles
        if (Math.random() < 0.6) {
          st.particles.push({
            x: 50,
            y: st.runnerY + 15,
            vx: -st.speed * 0.8,
            vy: (Math.random() - 0.5) * 1,
            size: Math.random() * 3 + 2,
            color: st.hasShield ? '#10b981' : '#ec4899',
            life: 1
          });
        }

        // Spawn obstacles
        st.spawnTimer += 1;
        if (st.spawnTimer > Math.max(45, 90 - Math.floor(st.distance / 20) * 5)) {
          st.spawnTimer = 0;
          const rand = Math.random();

          if (rand < 0.5) {
            // Ground Barrier
            st.obstacles.push({
              x: canvas.width + 20,
              y: st.groundY - 15,
              w: 22,
              h: 35,
              type: 'barrier'
            });
          } else if (rand < 0.8) {
            // Floating Plasma Drone
            st.obstacles.push({
              x: canvas.width + 20,
              y: st.groundY - 65,
              w: 24,
              h: 24,
              type: 'drone'
            });
          } else if (rand < 0.93) {
            // Neon Bonus Orb
            st.obstacles.push({
              x: canvas.width + 20,
              y: st.groundY - 50 - Math.random() * 40,
              w: 18,
              h: 18,
              type: 'orb'
            });
          } else {
            // Shield Pickup
            st.obstacles.push({
              x: canvas.width + 20,
              y: st.groundY - 45,
              w: 20,
              h: 20,
              type: 'shield'
            });
          }
        }

        // Update obstacles
        for (let i = st.obstacles.length - 1; i >= 0; i--) {
          const obs = st.obstacles[i];
          obs.x -= st.speed;

          // Runner Hitbox
          const rx = 50;
          const ry = st.runnerY;
          const rw = 22;
          const rh = 32;

          // Collision Check
          if (
            rx < obs.x + obs.w &&
            rx + rw > obs.x &&
            ry < obs.y + obs.h &&
            ry + rh > obs.y
          ) {
            if (obs.type === 'barrier' || obs.type === 'drone') {
              if (st.hasShield) {
                // Break shield
                st.hasShield = false;
                setHasShield(false);
                audio.playExplosion();
                st.obstacles.splice(i, 1);

                for (let k = 0; k < 12; k++) {
                  st.particles.push({
                    x: obs.x,
                    y: obs.y,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    size: 4,
                    color: '#10b981',
                    life: 1
                  });
                }
              } else {
                triggerGameOver();
                break;
              }
            } else if (obs.type === 'orb') {
              st.distance += 5; // Bonus distance score
              audio.playCoin();
              st.obstacles.splice(i, 1);

              for (let k = 0; k < 8; k++) {
                st.particles.push({
                  x: obs.x,
                  y: obs.y,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  size: 3,
                  color: '#eab308',
                  life: 1
                });
              }
            } else if (obs.type === 'shield') {
              st.hasShield = true;
              setHasShield(true);
              audio.playWin();
              st.obstacles.splice(i, 1);
            }
          }

          // Remove offscreen
          if (obs.x < -40) {
            st.obstacles.splice(i, 1);
          }
        }
      }

      // Draw Particles
      for (let i = st.particles.length - 1; i >= 0; i--) {
        const p = st.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.04;

        if (p.life <= 0) {
          st.particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Draw Obstacles
      st.obstacles.forEach((obs) => {
        if (obs.type === 'barrier') {
          ctx.fillStyle = '#f43f5e';
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 12;
          ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
          ctx.shadowBlur = 0;
        } else if (obs.type === 'drone') {
          ctx.fillStyle = '#a855f7';
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(obs.x + obs.w / 2, obs.y + obs.h / 2, obs.w / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (obs.type === 'orb') {
          ctx.fillStyle = '#eab308';
          ctx.shadowColor = '#eab308';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(obs.x + obs.w / 2, obs.y + obs.h / 2, obs.w / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (obs.type === 'shield') {
          ctx.fillStyle = '#10b981';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 10;
          ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
          ctx.shadowBlur = 0;
        }
      });

      // Draw Cyber Runner
      const rx = 50;
      const ry = st.runnerY;

      ctx.fillStyle = st.hasShield ? '#10b981' : '#06b6d4';
      ctx.shadowColor = st.hasShield ? '#10b981' : '#06b6d4';
      ctx.shadowBlur = 15;

      // Body
      ctx.fillRect(rx, ry, 22, 32);

      // Visor
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(rx + 12, ry + 6, 8, 5);

      if (st.hasShield) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(rx + 11, ry + 16, 24, 0, Math.PI * 2);
        ctx.stroke();
      }

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
            <Zap size={14} /> SCORE: {score}
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        onClick={isPlaying ? doJump : startNewGame}
        className="relative border-2 border-cyan-500/80 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.3)] cursor-pointer bg-slate-950"
      >
        <canvas
          ref={canvasRef}
          width={420}
          height={320}
          className="block w-full max-w-[420px] h-auto touch-none"
        />

        {/* Shield Status */}
        {hasShield && (
          <div className="absolute top-3 left-3 bg-emerald-950/90 text-emerald-300 border border-emerald-500/80 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
            <Shield size={12} /> BOUCLIER ACTIF
          </div>
        )}

        {/* Start Overlay */}
        {!isPlaying && !isEnded && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="p-3 bg-cyan-950/60 rounded-full border border-cyan-500 mb-3 animate-bounce">
              <Flame size={32} className="text-cyan-400" />
            </div>
            <h3 className="text-2xl font-black text-cyan-400 uppercase tracking-widest mb-1">
              COURSE NÉON CYBER
            </h3>
            <p className="text-xs text-slate-300 max-w-xs mb-5">
              Esquivez les barrières et les drones néon ! Sautez et faites un <span className="text-cyan-400 font-bold">double saut</span> dans les airs !
            </p>
            <button
              onClick={startNewGame}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3 px-8 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-lg animate-pulse"
            >
              APPUYEZ POUR COURIR ⚡
            </button>
            <p className="text-[10px] text-slate-400 mt-3">[CLIC / ESPACE / TACTILE] pour sauter</p>
          </div>
        )}

        {/* Game Over Overlay */}
        {isEnded && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-black text-rose-500 uppercase tracking-widest mb-1">
              BOOM ! DÉRAILLEMENT
            </h3>
            <p className="text-sm text-slate-300 mb-4">
              Distance parcourue : <span className="text-cyan-400 font-black">{score} pts</span>
            </p>
            <button
              onClick={startNewGame}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3 px-8 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-lg flex items-center gap-2 mb-2"
            >
              <RotateCcw size={16} /> RECOMMENCER
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
