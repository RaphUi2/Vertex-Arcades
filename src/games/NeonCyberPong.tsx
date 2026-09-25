import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Zap, Award, Flame } from 'lucide-react';
import { audio } from '../utils/audio';

interface NeonCyberPongProps {
  onFinish: (score: number, bonusVC?: number) => void;
  onExit: () => void;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export function NeonCyberPong({ onFinish, onExit }: NeonCyberPongProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [rally, setRally] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);

  const stateRef = useRef({
    playerY: 180,
    aiY: 180,
    playerHeight: 80,
    aiHeight: 80,
    balls: [
      { x: 240, y: 180, vx: 320, vy: (Math.random() - 0.5) * 200, radius: 8, color: '#06b6d4' }
    ] as Ball[],
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; life: number }[],
    rally: 0,
    playerScore: 0,
    aiScore: 0,
    energy: 100,
    active: true,
    isSmashActive: false
  });

  const moveUp = () => {
    const s = stateRef.current;
    s.playerY = Math.max(50, s.playerY - 35);
  };

  const moveDown = () => {
    const s = stateRef.current;
    s.playerY = Math.min(310, s.playerY + 35);
  };

  const laserSmash = () => {
    const s = stateRef.current;
    if (s.energy >= 50) {
      s.energy -= 50;
      setEnergy(s.energy);
      s.isSmashActive = true;
      audio.playLaser();
      // Double speed of player ball
      s.balls.forEach(b => {
        if (b.vx > 0) b.vx *= 1.8;
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) moveUp();
      if (['ArrowDown', 'KeyS'].includes(e.code)) moveDown();
      if (['Space', 'KeyF'].includes(e.code)) laserSmash();
    };

    window.addEventListener('keydown', handleKeyDown);

    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const s = stateRef.current;

      if (s.active) {
        // Energy recharge
        s.energy = Math.min(100, s.energy + 15 * dt);
        setEnergy(Math.floor(s.energy));

        // AI movement tracking closest ball heading right
        const incomingBall = s.balls.find(b => b.vx > 0) || s.balls[0];
        if (incomingBall) {
          const dy = incomingBall.y - s.aiY;
          const aiSpeed = 220 + s.rally * 8;
          s.aiY += Math.sign(dy) * Math.min(Math.abs(dy), aiSpeed * dt);
          s.aiY = Math.max(50, Math.min(310, s.aiY));
        }

        // Update Balls
        s.balls.forEach(b => {
          b.x += b.vx * dt;
          b.y += b.vy * dt;

          // Wall bounces
          if (b.y <= b.radius || b.y >= canvas.height - b.radius) {
            b.vy = -b.vy;
            audio.playClick();
          }

          // Player Paddle Collision (Left side: x = 40)
          if (b.x - b.radius <= 45 && b.x + b.radius >= 25) {
            if (Math.abs(b.y - s.playerY) < s.playerHeight / 2) {
              const impact = (b.y - s.playerY) / (s.playerHeight / 2);
              b.vx = Math.abs(b.vx) * 1.05 + 10;
              b.vy = impact * 260;
              s.rally += 1;
              setRally(s.rally);
              audio.playAttack();

              // Spark particles
              for (let i = 0; i < 8; i++) {
                s.particles.push({
                  x: b.x,
                  y: b.y,
                  vx: Math.random() * 150,
                  vy: (Math.random() - 0.5) * 150,
                  color: '#06b6d4',
                  life: 0.3
                });
              }
            }
          }

          // AI Paddle Collision (Right side: x = 435)
          if (b.x + b.radius >= 435 && b.x - b.radius <= 455) {
            if (Math.abs(b.y - s.aiY) < s.aiHeight / 2) {
              const impact = (b.y - s.aiY) / (s.aiHeight / 2);
              b.vx = -Math.abs(b.vx) * 1.04;
              b.vy = impact * 260;
              s.rally += 1;
              setRally(s.rally);
              audio.playClick();

              for (let i = 0; i < 8; i++) {
                s.particles.push({
                  x: b.x,
                  y: b.y,
                  vx: -Math.random() * 150,
                  vy: (Math.random() - 0.5) * 150,
                  color: '#f43f5e',
                  life: 0.3
                });
              }
            }
          }

          // Player scores (Ball exits right)
          if (b.x > canvas.width + 20) {
            s.playerScore += 1;
            setPlayerScore(s.playerScore);
            audio.playWin();
            // Reset ball
            b.x = 240;
            b.y = 180;
            b.vx = -300;
            b.vy = (Math.random() - 0.5) * 180;
            s.rally = 0;
            setRally(0);

            if (s.playerScore >= 5) {
              s.active = false;
              setIsGameOver(true);
              audio.playWin();
              onFinish(1200 + s.playerScore * 200, 50);
            }
          }

          // AI scores (Ball exits left)
          if (b.x < -20) {
            s.aiScore += 1;
            setAiScore(s.aiScore);
            audio.playDamage();
            // Reset ball
            b.x = 240;
            b.y = 180;
            b.vx = 300;
            b.vy = (Math.random() - 0.5) * 180;
            s.rally = 0;
            setRally(0);

            if (s.aiScore >= 5) {
              s.active = false;
              setIsGameOver(true);
              audio.playGameOver();
              onFinish(s.playerScore * 150, 20);
            }
          }
        });

        // Update Particles
        s.particles.forEach(p => {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
        });
        s.particles = s.particles.filter(p => p.life > 0);
      }

      // RENDER
      ctx.fillStyle = '#060914';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center Divider Line
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Particles
      s.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 0.3;
        ctx.fillRect(p.x, p.y, 4, 4);
        ctx.globalAlpha = 1;
      });

      // Draw Balls
      s.balls.forEach(b => {
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Player Paddle (Left - Cyan)
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(30, s.playerY - s.playerHeight / 2, 14, s.playerHeight, 6);
      ctx.fill();

      // Draw AI Paddle (Right - Rose)
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(436, s.aiY - s.aiHeight / 2, 14, s.aiHeight, 6);
      ctx.fill();
      ctx.shadowBlur = 0;

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
    onFinish(playerScore * 250, 30);
    onExit();
  };

  return (
    <div className="relative w-full max-w-lg mx-auto bg-slate-900/95 border-2 border-cyan-500/80 rounded-3xl p-4 shadow-[0_0_40px_rgba(6,182,212,0.4)] backdrop-blur-2xl flex flex-col items-center select-none text-slate-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-cyan-500/30">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-xl">
            🏓
          </div>
          <div>
            <h3 className="font-black text-sm text-cyan-300 font-mono">NEON CYBER PONG</h3>
            <p className="text-[10px] text-slate-400 font-mono">Duel Réflexe & Laser Smash</p>
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
          <span className="text-[10px] text-slate-400 font-mono">SCORE</span>
          <p className="text-sm font-black text-cyan-300 font-mono">
            {playerScore} - {aiScore}
          </p>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-mono">ÉCHANGE</span>
          <p className="text-sm font-black text-yellow-400 font-mono">x{rally}</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-mono">SMASH ÉNERGIE</span>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-cyan-400 transition-all" style={{ width: `${energy}%` }} />
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-inner">
        <canvas ref={canvasRef} width={480} height={360} className="w-full max-w-[480px] h-[300px] bg-slate-950 touch-none" />
      </div>

      {/* Action Controls */}
      <div className="w-full flex items-center justify-between gap-3 mt-4">
        <button
          onClick={moveUp}
          className="flex-1 py-3.5 rounded-2xl bg-slate-800 active:bg-cyan-600 font-black text-sm text-cyan-300 cursor-pointer shadow-md"
        >
          ▲ MONTER
        </button>
        <button
          onClick={laserSmash}
          disabled={energy < 50}
          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 disabled:opacity-30 active:scale-95 font-black text-sm text-white cursor-pointer shadow-md"
        >
          ⚡ LASER SMASH
        </button>
        <button
          onClick={moveDown}
          className="flex-1 py-3.5 rounded-2xl bg-slate-800 active:bg-cyan-600 font-black text-sm text-cyan-300 cursor-pointer shadow-md"
        >
          ▼ DESCENDRE
        </button>
      </div>

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-3xl">
            {playerScore > aiScore ? '🏆' : '💀'}
          </div>
          <h3 className="text-xl font-black text-white font-mono">
            {playerScore > aiScore ? 'VICTOIRE DU MATCH !' : 'DÉFAITE DU MATCH'}
          </h3>
          <p className="text-xs text-slate-300">
            Score : <strong className="text-cyan-300">{playerScore} - {aiScore}</strong>
          </p>
          <button
            onClick={handleManualExit}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-black text-slate-950 text-xs uppercase cursor-pointer shadow-lg"
          >
            VALIDER LE SCORE
          </button>
        </div>
      )}
    </div>
  );
}
