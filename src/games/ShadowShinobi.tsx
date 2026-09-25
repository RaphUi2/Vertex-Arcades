import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Zap, Shield, Flame } from 'lucide-react';
import { audio } from '../utils/audio';

interface ShadowShinobiProps {
  onFinish: (score: number, bonusVC?: number) => void;
  onExit: () => void;
}

interface Enemy {
  x: number;
  y: number;
  type: 'drone' | 'samurai' | 'laser';
  hp: number;
  color: string;
}

interface Shuriken {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
}

export function ShadowShinobi({ onFinish, onExit }: ShadowShinobiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [health, setHealth] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);

  const stateRef = useRef({
    playerX: 60,
    playerY: 280,
    vy: 0,
    isGrounded: true,
    isSlashing: false,
    slashTimer: 0,
    doubleJumpAvailable: true,
    distance: 0,
    enemies: [] as Enemy[],
    shurikens: [] as Shuriken[],
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; life: number }[],
    score: 0,
    combo: 1,
    comboTimer: 0,
    health: 100,
    active: true,
    keys: { jump: false, slash: false, shuriken: false }
  });

  const jump = () => {
    const s = stateRef.current;
    if (s.isGrounded) {
      s.vy = -12;
      s.isGrounded = false;
      s.doubleJumpAvailable = true;
      audio.playJump();
    } else if (s.doubleJumpAvailable) {
      s.vy = -10;
      s.doubleJumpAvailable = false;
      audio.playJump();
    }
  };

  const slash = () => {
    const s = stateRef.current;
    s.isSlashing = true;
    s.slashTimer = 0.25;
    audio.playAttack();

    // Hit enemies in melee range
    s.enemies.forEach(e => {
      const dx = e.x - s.playerX;
      const dy = e.y - s.playerY;
      if (dx > 0 && dx < 90 && Math.abs(dy) < 40) {
        e.hp -= 50;
        audio.playHit();
        s.score += 50 * s.combo;
        s.combo = Math.min(10, s.combo + 1);
        s.comboTimer = 2.5;

        // Particle sparks
        for (let i = 0; i < 8; i++) {
          s.particles.push({
            x: e.x,
            y: e.y,
            vx: (Math.random() - 0.5) * 200,
            vy: (Math.random() - 0.5) * 200,
            color: '#38bdf8',
            life: 0.4
          });
        }
      }
    });
  };

  const throwShuriken = () => {
    const s = stateRef.current;
    s.shurikens.push({
      x: s.playerX + 20,
      y: s.playerY,
      vx: 450,
      vy: 0,
      angle: 0
    });
    audio.playLaser();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        jump();
      }
      if (['KeyF', 'KeyJ', 'KeyX'].includes(e.code)) {
        slash();
      }
      if (['KeyE', 'KeyK', 'KeyC'].includes(e.code)) {
        throwShuriken();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    let enemySpawnTimer = 0;

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const s = stateRef.current;

      if (s.active) {
        // Physics
        s.vy += 28 * dt;
        s.playerY += s.vy * 40 * dt;

        // Ground collision (Rooftop floor is at y = 280)
        if (s.playerY >= 280) {
          s.playerY = 280;
          s.vy = 0;
          s.isGrounded = true;
        }

        // Distance and score
        s.distance += 150 * dt;
        s.score += Math.floor(10 * dt);
        setScore(s.score);

        // Combo timer
        if (s.comboTimer > 0) {
          s.comboTimer -= dt;
          if (s.comboTimer <= 0) s.combo = 1;
        }
        setCombo(s.combo);

        // Slash timer
        if (s.isSlashing) {
          s.slashTimer -= dt;
          if (s.slashTimer <= 0) s.isSlashing = false;
        }

        // Spawn Enemies
        enemySpawnTimer += dt;
        if (enemySpawnTimer > Math.max(0.8, 2.2 - (s.distance / 3000))) {
          enemySpawnTimer = 0;
          const roll = Math.random();
          if (roll < 0.5) {
            s.enemies.push({ x: 500, y: 280, type: 'samurai', hp: 30, color: '#ef4444' });
          } else {
            s.enemies.push({ x: 500, y: 220 + Math.random() * 50, type: 'drone', hp: 20, color: '#f59e0b' });
          }
        }

        // Update Shurikens
        s.shurikens.forEach(sh => {
          sh.x += sh.vx * dt;
          sh.angle += 15 * dt;

          // Collision with enemies
          s.enemies.forEach(e => {
            if (Math.hypot(e.x - sh.x, e.y - sh.y) < 25) {
              e.hp -= 30;
              sh.x = 9999; // destroy
              audio.playHit();
              s.score += 40 * s.combo;
              for (let i = 0; i < 6; i++) {
                s.particles.push({
                  x: e.x,
                  y: e.y,
                  vx: (Math.random() - 0.5) * 150,
                  vy: (Math.random() - 0.5) * 150,
                  color: '#e0e7ff',
                  life: 0.3
                });
              }
            }
          });
        });
        s.shurikens = s.shurikens.filter(sh => sh.x < 550);

        // Update Enemies
        const speed = 180 + Math.min(150, s.distance / 30);
        s.enemies.forEach(e => {
          e.x -= speed * dt;

          // Enemy collision with player
          if (Math.hypot(e.x - s.playerX, e.y - s.playerY) < 30) {
            s.health -= 25;
            setHealth(s.health);
            audio.playDamage();
            e.hp = 0; // destroyed by body collision

            if (s.health <= 0) {
              s.active = false;
              setIsGameOver(true);
              audio.playGameOver();
              onFinish(s.score, 50);
            }
          }
        });
        s.enemies = s.enemies.filter(e => e.hp > 0 && e.x > -50);

        // Update Particles
        s.particles.forEach(p => {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
        });
        s.particles = s.particles.filter(p => p.life > 0);
      }

      // RENDER
      ctx.fillStyle = '#070a14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyber Rooftop Background Skyline
      ctx.fillStyle = '#0f172a';
      for (let i = 0; i < 6; i++) {
        const bgX = (i * 90 - (stateRef.current.distance * 0.2)) % 550;
        ctx.fillRect(bgX < 0 ? bgX + 550 : bgX, 80 + (i % 3) * 30, 70, 250);
      }

      // Neon Rooftop Floor
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 310, canvas.width, 90);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 310);
      ctx.lineTo(canvas.width, 310);
      ctx.stroke();

      // Draw Enemies
      s.enemies.forEach(e => {
        ctx.fillStyle = e.color;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 10;
        if (e.type === 'samurai') {
          // Cyber Samurai
          ctx.beginPath();
          ctx.roundRect(e.x - 12, e.y - 30, 24, 30, 4);
          ctx.fill();
          // Red glowing eyes
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(e.x - 8, e.y - 24, 4, 3);
          ctx.fillRect(e.x + 4, e.y - 24, 4, 3);
        } else {
          // Cyber Drone
          ctx.beginPath();
          ctx.arc(e.x, e.y, 14, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      });

      // Draw Shurikens
      s.shurikens.forEach(sh => {
        ctx.save();
        ctx.translate(sh.x, sh.y);
        ctx.rotate(sh.angle);
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.fillRect(-6, -6, 12, 12);
        ctx.restore();
      });

      // Draw Particles
      s.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 0.4;
        ctx.fillRect(p.x, p.y, 3, 3);
        ctx.globalAlpha = 1;
      });

      // Draw Player Ninja
      ctx.save();
      ctx.translate(s.playerX, s.playerY);

      // Ninja Body
      ctx.fillStyle = '#1e293b';
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(-10, -32, 20, 32, 6);
      ctx.fill();

      // Neon Scarf / Visor
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(-8, -26, 16, 5);

      // Katana Blade Slash Effect
      if (s.isSlashing) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 6;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(15, -16, 40, -Math.PI / 4, Math.PI / 3);
        ctx.stroke();
      }

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
    onFinish(stateRef.current.score, 40);
    onExit();
  };

  return (
    <div className="relative w-full max-w-lg mx-auto bg-slate-900/95 border-2 border-purple-500/80 rounded-3xl p-4 shadow-[0_0_40px_rgba(168,85,247,0.4)] backdrop-blur-2xl flex flex-col items-center select-none text-slate-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-purple-500/30">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-xl">
            🥷
          </div>
          <div>
            <h3 className="font-black text-sm text-purple-300 font-mono">SHADOW SHINOBI</h3>
            <p className="text-[10px] text-slate-400 font-mono">Cyber Ninja Slash & Shuriken</p>
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
          <span className="text-[10px] text-slate-400 font-mono">VIE</span>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-emerald-400 transition-all" style={{ width: `${health}%` }} />
          </div>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-mono">SCORE</span>
          <p className="text-sm font-black text-yellow-400 font-mono">{score} pts</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-mono">COMBO</span>
          <p className="text-sm font-black text-purple-400 font-mono">x{combo}</p>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-inner">
        <canvas ref={canvasRef} width={480} height={360} className="w-full max-w-[480px] h-[300px] bg-slate-950 touch-none" />
      </div>

      {/* Action Controls */}
      <div className="w-full flex items-center justify-between gap-3 mt-4">
        <button
          onClick={jump}
          className="flex-1 py-3.5 rounded-2xl bg-slate-800 active:bg-cyan-600 font-black text-sm text-cyan-300 cursor-pointer shadow-md"
        >
          🦘 SAUTER
        </button>
        <button
          onClick={throwShuriken}
          className="flex-1 py-3.5 rounded-2xl bg-slate-800 active:bg-purple-600 font-black text-sm text-purple-300 cursor-pointer shadow-md"
        >
          ⭐ SHURIKEN
        </button>
        <button
          onClick={slash}
          className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 active:scale-95 font-black text-sm text-white cursor-pointer shadow-md"
        >
          ⚔️ SLASH
        </button>
      </div>

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-3xl">
            💀
          </div>
          <h3 className="text-xl font-black text-white font-mono">FIN DE COURSE</h3>
          <p className="text-xs text-slate-300">
            Score d'infiltration final : <strong className="text-purple-300">{score} pts</strong>
          </p>
          <button
            onClick={handleManualExit}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 font-black text-white text-xs uppercase cursor-pointer shadow-lg"
          >
            VALIDER LE SCORE
          </button>
        </div>
      )}
    </div>
  );
}
