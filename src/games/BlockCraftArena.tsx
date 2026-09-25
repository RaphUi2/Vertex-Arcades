import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Shield, Sparkles, Zap, Award } from 'lucide-react';
import { audio } from '../utils/audio';

interface BlockCraftArenaProps {
  onFinish: (score: number, bonusVC?: number) => void;
  onExit: () => void;
}

interface Mob {
  x: number;
  y: number;
  type: 'zombie' | 'creeper' | 'phantom';
  hp: number;
  maxHp: number;
  speed: number;
}

interface Block {
  x: number;
  y: number;
  hp: number;
}

interface Arrow {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function BlockCraftArena({ onFinish, onExit }: BlockCraftArenaProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [crystalHp, setCrystalHp] = useState(100);
  const [woodBlocks, setWoodBlocks] = useState(15);
  const [wave, setWave] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  const stateRef = useRef({
    playerX: 200,
    playerY: 280,
    mobs: [] as Mob[],
    blocks: [] as Block[],
    arrows: [] as Arrow[],
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; life: number }[],
    score: 0,
    crystalHp: 100,
    woodBlocks: 15,
    wave: 1,
    active: true,
    facing: 1
  });

  const moveLeft = () => {
    const s = stateRef.current;
    s.playerX = Math.max(40, s.playerX - 25);
    s.facing = -1;
  };

  const moveRight = () => {
    const s = stateRef.current;
    s.playerX = Math.min(360, s.playerX + 25);
    s.facing = 1;
  };

  const placeBlock = () => {
    const s = stateRef.current;
    if (s.woodBlocks > 0) {
      s.woodBlocks -= 1;
      setWoodBlocks(s.woodBlocks);
      s.blocks.push({
        x: s.playerX + s.facing * 30,
        y: 280,
        hp: 60
      });
      audio.playBlockBreak();
    }
  };

  const shootBow = () => {
    const s = stateRef.current;
    s.arrows.push({
      x: s.playerX,
      y: s.playerY - 15,
      vx: s.facing * 400,
      vy: -50
    });
    audio.playBowShoot();
  };

  const swordAttack = () => {
    const s = stateRef.current;
    audio.playSwordSwing();

    s.mobs.forEach(m => {
      const dx = m.x - s.playerX;
      if (Math.sign(dx) === s.facing && Math.abs(dx) < 65 && Math.abs(m.y - s.playerY) < 50) {
        m.hp -= 40;
        audio.playHit();
        s.score += 60;
        setScore(s.score);
        for (let i = 0; i < 8; i++) {
          s.particles.push({
            x: m.x,
            y: m.y,
            vx: (Math.random() - 0.5) * 150,
            vy: (Math.random() - 0.5) * 150,
            color: '#10b981',
            life: 0.35
          });
        }
      }
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA', 'q', 'Q'].includes(e.code)) moveLeft();
      if (['ArrowRight', 'KeyD', 'd', 'D'].includes(e.code)) moveRight();
      if (['KeyF', 'KeyJ', 'Space'].includes(e.code)) swordAttack();
      if (['KeyE', 'KeyK'].includes(e.code)) shootBow();
      if (['KeyB', 'KeyC'].includes(e.code)) placeBlock();
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
        // Spawn Mobs
        spawnTimer += dt;
        if (spawnTimer > Math.max(0.9, 2.5 - (s.wave * 0.2))) {
          spawnTimer = 0;
          const spawnFromLeft = Math.random() < 0.5;
          const spawnX = spawnFromLeft ? -20 : 420;
          const roll = Math.random();
          let type: Mob['type'] = 'zombie';
          let hp = 40;
          let speed = 45;
          if (roll < 0.3) {
            type = 'creeper';
            hp = 30;
            speed = 70;
          } else if (roll < 0.5) {
            type = 'phantom';
            hp = 25;
            speed = 90;
          }
          s.mobs.push({
            x: spawnX,
            y: type === 'phantom' ? 180 + Math.random() * 40 : 280,
            type,
            hp,
            maxHp: hp,
            speed
          });
        }

        // Update Arrows
        s.arrows.forEach(a => {
          a.x += a.vx * dt;
          a.y += a.vy * dt;
          a.vy += 60 * dt;

          s.mobs.forEach(m => {
            if (Math.hypot(m.x - a.x, m.y - a.y) < 25) {
              m.hp -= 35;
              a.x = 9999;
              audio.playHit();
              s.score += 40;
              setScore(s.score);
            }
          });
        });
        s.arrows = s.arrows.filter(a => a.x > -50 && a.x < 450);

        // Update Mobs
        s.mobs.forEach(m => {
          const targetX = 200; // Sky Crystal is at center (x=200)
          const dir = Math.sign(targetX - m.x);
          m.x += dir * m.speed * dt;

          // Block collisions
          s.blocks.forEach(b => {
            if (Math.abs(m.x - b.x) < 20) {
              b.hp -= 20 * dt;
              m.x -= dir * m.speed * dt; // blocked
            }
          });

          // Crystal collision
          if (Math.abs(m.x - targetX) < 25) {
            s.crystalHp -= (m.type === 'creeper' ? 25 : 8) * dt;
            setCrystalHp(Math.max(0, Math.floor(s.crystalHp)));
            audio.playDamage();

            if (s.crystalHp <= 0) {
              s.active = false;
              setIsGameOver(true);
              audio.playGameOver();
              onFinish(s.score, 45);
            }
          }
        });

        // Filter Dead Mobs & Blocks
        s.mobs = s.mobs.filter(m => m.hp > 0);
        s.blocks = s.blocks.filter(b => b.hp > 0);

        // Wave progression
        if (s.score > s.wave * 350) {
          s.wave += 1;
          setWave(s.wave);
          s.woodBlocks += 5;
          setWoodBlocks(s.woodBlocks);
        }

        // Update Particles
        s.particles.forEach(p => {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
        });
        s.particles = s.particles.filter(p => p.life > 0);
      }

      // RENDER
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sky Clouds
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(80, 80, 40, 0, Math.PI * 2);
      ctx.arc(120, 70, 50, 0, Math.PI * 2);
      ctx.arc(320, 90, 45, 0, Math.PI * 2);
      ctx.fill();

      // Floating Sky Island Grass Platform
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(20, 300, 360, 20);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(20, 320, 360, 40);

      // Draw Center Sky Crystal
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.moveTo(200, 240);
      ctx.lineTo(215, 275);
      ctx.lineTo(200, 300);
      ctx.lineTo(185, 275);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Blocks
      s.blocks.forEach(b => {
        ctx.fillStyle = '#b45309';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.fillRect(b.x - 12, b.y - 12, 24, 24);
        ctx.strokeRect(b.x - 12, b.y - 12, 24, 24);
      });

      // Draw Arrows
      ctx.fillStyle = '#fde047';
      s.arrows.forEach(a => {
        ctx.fillRect(a.x - 6, a.y - 2, 12, 4);
      });

      // Draw Mobs
      s.mobs.forEach(m => {
        if (m.type === 'zombie') {
          ctx.fillStyle = '#15803d'; // Green zombie
          ctx.fillRect(m.x - 10, m.y - 28, 20, 28);
        } else if (m.type === 'creeper') {
          ctx.fillStyle = '#84cc16'; // Creeper
          ctx.fillRect(m.x - 10, m.y - 28, 20, 28);
          ctx.fillStyle = '#000000';
          ctx.fillRect(m.x - 6, m.y - 22, 4, 4);
          ctx.fillRect(m.x + 2, m.y - 22, 4, 4);
        } else {
          ctx.fillStyle = '#6366f1'; // Phantom
          ctx.beginPath();
          ctx.arc(m.x, m.y, 14, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Particles
      s.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 0.35;
        ctx.fillRect(p.x, p.y, 4, 4);
        ctx.globalAlpha = 1;
      });

      // Draw Player Hero
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(s.playerX - 10, s.playerY - 28, 20, 28);
      // Sword
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(s.playerX + s.facing * 8, s.playerY - 14);
      ctx.lineTo(s.playerX + s.facing * 24, s.playerY - 24);
      ctx.stroke();

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
    <div className="relative w-full max-w-lg mx-auto bg-slate-900/95 border-2 border-emerald-500/80 rounded-3xl p-4 shadow-[0_0_40px_rgba(16,185,129,0.4)] backdrop-blur-2xl flex flex-col items-center select-none text-slate-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-emerald-500/30">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xl">
            🧱
          </div>
          <div>
            <h3 className="font-black text-sm text-emerald-300 font-mono">BLOCK CRAFT ARENA</h3>
            <p className="text-[10px] text-slate-400 font-mono">Défense de Cristal Voxel Skyblock</p>
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
          <span className="text-[10px] text-slate-400 font-mono">CRISTAL PV</span>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-cyan-400 transition-all" style={{ width: `${crystalHp}%` }} />
          </div>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-mono">SCORE</span>
          <p className="text-sm font-black text-yellow-400 font-mono">{score} pts</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-mono">BLOCS</span>
          <p className="text-sm font-black text-amber-400 font-mono">{woodBlocks} 🧱</p>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-inner">
        <canvas ref={canvasRef} width={400} height={360} className="w-full max-w-[400px] h-[300px] bg-slate-950 touch-none" />
      </div>

      {/* Action Controls */}
      <div className="w-full grid grid-cols-4 gap-2 mt-4">
        <button
          onClick={moveLeft}
          className="py-3.5 rounded-2xl bg-slate-800 active:bg-cyan-600 font-black text-xs text-cyan-300 cursor-pointer shadow-md"
        >
          ◀ GAUCHE
        </button>
        <button
          onClick={placeBlock}
          className="py-3.5 rounded-2xl bg-amber-800/70 active:bg-amber-600 border border-amber-500 font-black text-xs text-amber-200 cursor-pointer shadow-md"
        >
          🧱 POSER
        </button>
        <button
          onClick={shootBow}
          className="py-3.5 rounded-2xl bg-slate-800 active:bg-yellow-600 font-black text-xs text-yellow-300 cursor-pointer shadow-md"
        >
          🏹 TIRER
        </button>
        <button
          onClick={moveRight}
          className="py-3.5 rounded-2xl bg-slate-800 active:bg-cyan-600 font-black text-xs text-cyan-300 cursor-pointer shadow-md"
        >
          DROITE ▶
        </button>
      </div>

      <div className="w-full mt-2">
        <button
          onClick={swordAttack}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 active:scale-98 font-black text-xs text-slate-950 uppercase cursor-pointer shadow-lg font-mono"
        >
          ⚔️ ATTAQUE ÉPÉE DIAMANT
        </button>
      </div>

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-3xl">
            💎
          </div>
          <h3 className="text-xl font-black text-white font-mono">CRISTAL DÉTRUIT</h3>
          <p className="text-xs text-slate-300">
            Vous avez atteint la Vague {wave} avec un score de <strong className="text-emerald-400">{score} pts</strong> !
          </p>
          <button
            onClick={handleManualExit}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 font-black text-slate-950 text-xs uppercase cursor-pointer shadow-lg"
          >
            VALIDER LES RÉCOMPENSES
          </button>
        </div>
      )}
    </div>
  );
}
