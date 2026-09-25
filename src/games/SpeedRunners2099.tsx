import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Zap, Flame, Shield, Award } from 'lucide-react';
import { audio } from '../utils/audio';

interface SpeedRunnersProps {
  onFinish: (score: number, bonusVC?: number) => void;
  onExit: () => void;
}

interface Obstacle {
  lane: number; // -1, 0, 1
  z: number; // 0 to 1000
  type: 'barrier' | 'boost' | 'coin';
  color: string;
}

export function SpeedRunners2099({ onFinish, onExit }: SpeedRunnersProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [speedKmh, setSpeedKmh] = useState(300);
  const [nitro, setNitro] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);

  const stateRef = useRef({
    lane: 0, // -1 (left), 0 (center), 1 (right)
    targetLane: 0,
    laneX: 0,
    speed: 400,
    nitro: 100,
    isNitroActive: false,
    distance: 0,
    obstacles: [] as Obstacle[],
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; life: number }[],
    score: 0,
    active: true
  });

  const moveLeft = () => {
    const s = stateRef.current;
    if (s.targetLane > -1) {
      s.targetLane -= 1;
      audio.playJump();
    }
  };

  const moveRight = () => {
    const s = stateRef.current;
    if (s.targetLane < 1) {
      s.targetLane += 1;
      audio.playJump();
    }
  };

  const triggerNitro = () => {
    const s = stateRef.current;
    if (s.nitro >= 25 && !s.isNitroActive) {
      s.isNitroActive = true;
      audio.playLaser();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA', 'q', 'Q'].includes(e.code)) moveLeft();
      if (['ArrowRight', 'KeyD', 'd', 'D'].includes(e.code)) moveRight();
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) triggerNitro();
    };

    window.addEventListener('keydown', handleKeyDown);

    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    let spawnTimer = 0;

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const s = stateRef.current;

      if (s.active) {
        // Lane interpolation
        const targetX = s.targetLane * 90;
        s.laneX += (targetX - s.laneX) * 12 * dt;

        // Nitro handling
        if (s.isNitroActive) {
          s.speed = 850;
          s.nitro = Math.max(0, s.nitro - 35 * dt);
          if (s.nitro <= 0) s.isNitroActive = false;
        } else {
          s.speed = 380 + Math.min(250, s.distance / 15);
          s.nitro = Math.min(100, s.nitro + 12 * dt);
        }

        setSpeedKmh(Math.floor(s.speed));
        setNitro(Math.floor(s.nitro));

        s.distance += s.speed * dt;
        s.score += Math.floor((s.speed / 10) * dt);
        setScore(s.score);

        // Spawn obstacles
        spawnTimer += dt * (s.speed / 400);
        if (spawnTimer > 0.45) {
          spawnTimer = 0;
          const lane = [-1, 0, 1][Math.floor(Math.random() * 3)];
          const roll = Math.random();
          let type: Obstacle['type'] = 'barrier';
          let color = '#ef4444';
          if (roll < 0.25) {
            type = 'boost';
            color = '#38bdf8';
          } else if (roll < 0.5) {
            type = 'coin';
            color = '#fbbf24';
          }
          s.obstacles.push({ lane, z: 900, type, color });
        }

        // Update obstacles
        s.obstacles.forEach(o => {
          o.z -= s.speed * dt;

          // Collision check near player (z between 40 and 120)
          if (o.z > 30 && o.z < 110) {
            const laneDiff = Math.abs(s.laneX - (o.lane * 90));
            if (laneDiff < 45) {
              if (o.type === 'barrier') {
                if (s.isNitroActive) {
                  // Smash through barrier in nitro mode
                  audio.playHit();
                  s.score += 200;
                  o.z = -100;
                } else {
                  // Crash
                  audio.playDamage();
                  s.active = false;
                  setIsGameOver(true);
                  onFinish(s.score, 45);
                }
              } else if (o.type === 'boost') {
                audio.playLaser();
                s.nitro = 100;
                s.isNitroActive = true;
                s.score += 150;
                o.z = -100;
              } else if (o.type === 'coin') {
                audio.playCoin();
                s.score += 100;
                o.z = -100;
              }
            }
          }
        });
        s.obstacles = s.obstacles.filter(o => o.z > 0);
      }

      // RENDER
      ctx.fillStyle = '#060a16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = 130;

      // Draw 3D perspective track grid
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 2;

      // Horizon line
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();

      // Lane boundaries
      const lanes = [-135, -45, 45, 135];
      lanes.forEach(lx => {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + lx * 2.5, canvas.height);
        ctx.stroke();
      });

      // Moving track horizontal lines
      const offset = (s.distance * 0.8) % 40;
      for (let y = centerY; y < canvas.height; y += 24) {
        const lineY = y + offset * ((y - centerY) / 200);
        if (lineY > centerY && lineY < canvas.height) {
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(centerX - ((lineY - centerY) * 1.5), lineY);
          ctx.lineTo(centerX + ((lineY - centerY) * 1.5), lineY);
          ctx.stroke();
        }
      }

      // Draw Obstacles with perspective projection
      const sortedObstacles = [...s.obstacles].sort((a, b) => b.z - a.z);
      sortedObstacles.forEach(o => {
        const progress = 1 - (o.z / 900); // 0 at far horizon, 1 at screen bottom
        if (progress < 0 || progress > 1) return;

        const scale = 0.15 + (progress * 1.2);
        const screenY = centerY + (canvas.height - centerY) * progress;
        const screenX = centerX + (o.lane * 90) * scale * 1.8;

        ctx.fillStyle = o.color;
        ctx.shadowColor = o.color;
        ctx.shadowBlur = 10 * scale;

        if (o.type === 'barrier') {
          ctx.fillRect(screenX - (25 * scale), screenY - (30 * scale), 50 * scale, 30 * scale);
        } else if (o.type === 'boost') {
          ctx.beginPath();
          ctx.moveTo(screenX, screenY - (30 * scale));
          ctx.lineTo(screenX + (20 * scale), screenY);
          ctx.lineTo(screenX - (20 * scale), screenY);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(screenX, screenY - (15 * scale), 14 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      });

      // Draw Player Jet Hovercar
      const playerY = canvas.height - 40;
      const playerX = centerX + s.laneX * 1.6;

      ctx.save();
      ctx.translate(playerX, playerY);

      // Jet thruster flames
      ctx.fillStyle = s.isNitroActive ? '#ec4899' : '#38bdf8';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(-12, 10);
      ctx.lineTo(0, 28 + (Math.random() * 8));
      ctx.lineTo(12, 10);
      ctx.closePath();
      ctx.fill();

      // Jet chassis
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -25);
      ctx.lineTo(24, 12);
      ctx.lineTo(-24, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Jet cockpit glow
      ctx.fillStyle = '#67e8f9';
      ctx.beginPath();
      ctx.arc(0, -6, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleManualExit = () => {
    audio.playClick();
    onFinish(stateRef.current.score, 45);
    onExit();
  };

  return (
    <div className="relative w-full max-w-lg mx-auto bg-slate-900/95 border-2 border-cyan-500/80 rounded-3xl p-4 shadow-[0_0_40px_rgba(6,182,212,0.4)] backdrop-blur-2xl flex flex-col items-center select-none text-slate-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-cyan-500/30">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-xl">
            ⚡
          </div>
          <div>
            <h3 className="font-black text-sm text-cyan-300 font-mono">SPEED RUNNERS 2099</h3>
            <p className="text-[10px] text-slate-400 font-mono">Course Supersonique Anti-Gravité</p>
          </div>
        </div>
        <button
          onClick={handleManualExit}
          className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Bar */}
      <div className="w-full grid grid-cols-3 gap-2 py-3">
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-mono">VITESSE</span>
          <p className="text-sm font-black text-cyan-300 font-mono">{speedKmh} km/h</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-mono">SCORE</span>
          <p className="text-sm font-black text-yellow-400 font-mono">{score} pts</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-mono">NITRO</span>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-pink-500 transition-all" style={{ width: `${nitro}%` }} />
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-inner">
        <canvas ref={canvasRef} width={460} height={320} className="w-full max-w-[460px] h-[280px] bg-slate-950 touch-none" />
      </div>

      {/* Action Controls */}
      <div className="w-full flex items-center justify-between gap-3 mt-4">
        <button
          onClick={moveLeft}
          className="flex-1 py-3.5 rounded-2xl bg-slate-800 active:bg-cyan-600 font-black text-sm text-cyan-300 cursor-pointer shadow-md"
        >
          ◀ GAUCHE
        </button>
        <button
          onClick={triggerNitro}
          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 active:scale-95 font-black text-sm text-white cursor-pointer shadow-md"
        >
          🚀 NITRO BOOST
        </button>
        <button
          onClick={moveRight}
          className="flex-1 py-3.5 rounded-2xl bg-slate-800 active:bg-cyan-600 font-black text-sm text-cyan-300 cursor-pointer shadow-md"
        >
          DROITE ▶
        </button>
      </div>

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-3xl">
            💥
          </div>
          <h3 className="text-xl font-black text-white font-mono">COLLISION CRITIQUE</h3>
          <p className="text-xs text-slate-300">
            Score supersonique final : <strong className="text-cyan-300">{score} pts</strong>
          </p>
          <button
            onClick={handleManualExit}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-black text-slate-950 text-xs uppercase cursor-pointer shadow-lg"
          >
            ENREGISTRER LE RECORD
          </button>
        </div>
      )}
    </div>
  );
}
