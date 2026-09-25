import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Flame, Shield, Sparkles, Zap, Award, RefreshCw } from 'lucide-react';
import { audio } from '../utils/audio';

interface CosmicMinerProps {
  onFinish: (score: number, bonusVC?: number) => void;
  onExit: () => void;
}

interface Mineral {
  x: number;
  y: number;
  type: 'iron' | 'gold' | 'sapphire' | 'stellarite' | 'magma';
  value: number;
  hp: number;
  maxHp: number;
  color: string;
}

export function CosmicMiner({ onFinish, onExit }: CosmicMinerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [mineralsCollected, setMineralsCollected] = useState(0);
  const [depth, setDepth] = useState(0);
  const [drillLevel, setDrillLevel] = useState(1);
  const [heat, setHeat] = useState(0);

  const gameState = useRef({
    drillX: 200,
    drillY: 100,
    drillSpeed: 3,
    drillPower: 1,
    drillCooling: 0.35,
    drillOverheated: false,
    cameraY: 0,
    heat: 0,
    depth: 0,
    minerals: [] as Mineral[],
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; life: number }[],
    keys: { left: false, right: false, drill: false, cool: false },
    score: 0,
    active: true
  });

  // Spawn minerals down the asteroid core
  const spawnLayer = (startY: number, endY: number) => {
    const types: { type: Mineral['type']; val: number; hp: number; color: string; chance: number }[] = [
      { type: 'iron', val: 15, hp: 1, color: '#94a3b8', chance: 0.5 },
      { type: 'gold', val: 40, hp: 2, color: '#fbbf24', chance: 0.25 },
      { type: 'sapphire', val: 90, hp: 3, color: '#38bdf8', chance: 0.15 },
      { type: 'stellarite', val: 250, hp: 5, color: '#f43f5e', chance: 0.05 },
      { type: 'magma', val: -1, hp: 1, color: '#ef4444', chance: 0.05 }
    ];

    const newMinerals: Mineral[] = [];
    for (let y = startY; y < endY; y += 45) {
      for (let x = 30; x < 370; x += 45) {
        if (Math.random() < 0.75) {
          const roll = Math.random();
          let acc = 0;
          let chosen = types[0];
          for (const t of types) {
            acc += t.chance;
            if (roll <= acc) {
              chosen = t;
              break;
            }
          }
          newMinerals.push({
            x,
            y,
            type: chosen.type,
            value: chosen.val,
            hp: chosen.hp,
            maxHp: chosen.hp,
            color: chosen.color
          });
        }
      }
    }
    return newMinerals;
  };

  useEffect(() => {
    // Initial spawn
    gameState.current.minerals = spawnLayer(150, 1500);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA', 'q', 'Q'].includes(e.code)) gameState.current.keys.left = true;
      if (['ArrowRight', 'KeyD', 'd', 'D'].includes(e.code)) gameState.current.keys.right = true;
      if (['ArrowDown', 'Space', 'KeyS'].includes(e.code)) gameState.current.keys.drill = true;
      if (['KeyC', 'KeyW', 'ArrowUp'].includes(e.code)) gameState.current.keys.cool = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA', 'q', 'Q'].includes(e.code)) gameState.current.keys.left = false;
      if (['ArrowRight', 'KeyD', 'd', 'D'].includes(e.code)) gameState.current.keys.right = false;
      if (['ArrowDown', 'Space', 'KeyS'].includes(e.code)) gameState.current.keys.drill = false;
      if (['KeyC', 'KeyW', 'ArrowUp'].includes(e.code)) gameState.current.keys.cool = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (gameState.current.active) {
        // Update Logic
        const s = gameState.current;

        // Move Left / Right
        if (s.keys.left) s.drillX = Math.max(30, s.drillX - 220 * dt);
        if (s.keys.right) s.drillX = Math.min(370, s.drillX + 220 * dt);

        // Heat Cooling
        if (s.keys.cool) {
          s.heat = Math.max(0, s.heat - 65 * dt);
        } else {
          s.heat = Math.max(0, s.heat - 18 * dt);
        }

        if (s.heat >= 100) {
          s.drillOverheated = true;
          audio.playDamage();
        }
        if (s.heat <= 25) {
          s.drillOverheated = false;
        }

        // Drilling
        const isDrilling = (s.keys.drill || true) && !s.drillOverheated;
        const currentSpeed = isDrilling ? 110 : 30;
        s.drillY += currentSpeed * dt;
        s.cameraY = s.drillY - 200;
        s.depth = Math.floor(s.drillY / 10);
        setDepth(s.depth);
        setHeat(Math.floor(s.heat));

        if (isDrilling) {
          s.heat = Math.min(100, s.heat + 16 * dt);
        }

        // Spawn more layers as player goes deeper
        const deepestMineral = s.minerals[s.minerals.length - 1];
        if (!deepestMineral || deepestMineral.y < s.drillY + 800) {
          const nextY = deepestMineral ? deepestMineral.y + 45 : s.drillY + 400;
          s.minerals = [...s.minerals, ...spawnLayer(nextY, nextY + 800)];
        }

        // Collisions with minerals
        const drillRadius = 20;
        s.minerals.forEach(m => {
          const dx = m.x - s.drillX;
          const dy = m.y - s.drillY;
          const dist = Math.hypot(dx, dy);

          if (dist < drillRadius + 18) {
            if (m.type === 'magma') {
              // Hit magma hazard
              s.heat = 100;
              s.drillOverheated = true;
              audio.playDamage();
              m.hp = 0;
            } else {
              // Drill mineral
              m.hp -= s.drillPower * 4 * dt;
              if (m.hp <= 0) {
                audio.playCoin();
                s.score += m.value;
                setScore(s.score);
                setMineralsCollected(prev => prev + 1);

                // Spawn particles
                for (let i = 0; i < 6; i++) {
                  s.particles.push({
                    x: m.x,
                    y: m.y,
                    vx: (Math.random() - 0.5) * 150,
                    vy: (Math.random() - 0.5) * 150,
                    color: m.color,
                    life: 0.5
                  });
                }
              }
            }
          }
        });

        // Filter destroyed minerals
        s.minerals = s.minerals.filter(m => m.hp > 0 && m.y > s.cameraY - 50);

        // Update particles
        s.particles.forEach(p => {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
        });
        s.particles = s.particles.filter(p => p.life > 0);

        // Win/Game Over condition at depth 2500m or overheat death if depth > 300
        if (s.depth >= 3000) {
          s.active = false;
          setIsGameOver(true);
          audio.playWin();
          onFinish(s.score + 1000, 75);
        }
      }

      // Render
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const s = gameState.current;

      // Draw starry background
      ctx.fillStyle = '#1e293b';
      for (let i = 0; i < 20; i++) {
        const starX = (i * 47) % 400;
        const starY = (i * 73 - (s.cameraY * 0.2)) % 600;
        ctx.fillRect(starX, (starY + 600) % 600, 2, 2);
      }

      // Draw asteroid rock wall borders
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(0, 0, 20, canvas.height);
      ctx.fillRect(380, 0, 20, canvas.height);

      ctx.save();
      ctx.translate(0, -s.cameraY);

      // Draw Minerals
      s.minerals.forEach(m => {
        ctx.fillStyle = m.color;
        ctx.shadowColor = m.color;
        ctx.shadowBlur = m.type === 'stellarite' ? 12 : 4;

        if (m.type === 'magma') {
          ctx.beginPath();
          ctx.arc(m.x, m.y, 16, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.roundRect(m.x - 14, m.y - 14, 28, 28, 6);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      });

      // Draw Particles
      s.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 0.5;
        ctx.fillRect(p.x, p.y, 4, 4);
        ctx.globalAlpha = 1;
      });

      // Draw Player Drill Ship
      ctx.save();
      ctx.translate(s.drillX, s.drillY);

      // Overheat aura
      if (s.drillOverheated) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.beginPath();
        ctx.arc(0, 0, 28, 0, Math.PI * 2);
        ctx.fill();
      }

      // Drill body
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(0, 24);
      ctx.lineTo(16, -14);
      ctx.lineTo(-16, -14);
      ctx.closePath();
      ctx.fill();

      // Rotating Drill Head
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(0, 32);
      ctx.lineTo(8, 20);
      ctx.lineTo(-8, 20);
      ctx.closePath();
      ctx.fill();

      // Cockpit
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, -4, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      ctx.restore();

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleManualExit = () => {
    audio.playClick();
    onFinish(gameState.current.score, Math.floor(gameState.current.score * 0.1));
    onExit();
  };

  return (
    <div className="relative w-full max-w-lg mx-auto bg-slate-900/95 border-2 border-cyan-500/80 rounded-3xl p-4 shadow-[0_0_40px_rgba(6,182,212,0.4)] backdrop-blur-2xl flex flex-col items-center select-none text-slate-100">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-cyan-500/30">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-xl">
            💎
          </div>
          <div>
            <h3 className="font-black text-sm text-cyan-300 font-mono">COSMIC MINER</h3>
            <p className="text-[10px] text-slate-400 font-mono">Forage au cœur des astéroïdes</p>
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
          <span className="text-[10px] text-slate-400 font-mono">PROFONDEUR</span>
          <p className="text-sm font-black text-cyan-300 font-mono">{depth} m</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-mono">SCORE</span>
          <p className="text-sm font-black text-yellow-400 font-mono">{score} pts</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-mono">SURCHAUFFE</span>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-1 overflow-hidden">
            <div
              className={`h-full transition-all ${heat > 80 ? 'bg-red-500 animate-pulse' : 'bg-amber-400'}`}
              style={{ width: `${heat}%` }}
            />
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-inner">
        <canvas ref={canvasRef} width={400} height={420} className="w-full max-w-[400px] h-[360px] bg-slate-950 touch-none" />

        {/* Overheated Warning */}
        {gameState.current.drillOverheated && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-red-600/90 text-white font-black text-xs animate-bounce shadow-lg">
            ⚠️ SURCHAUFFE DU FOREUR !
          </div>
        )}
      </div>

      {/* Touch Controls */}
      <div className="w-full flex items-center justify-between gap-3 mt-4">
        <button
          onTouchStart={() => (gameState.current.keys.left = true)}
          onTouchEnd={() => (gameState.current.keys.left = false)}
          onMouseDown={() => (gameState.current.keys.left = true)}
          onMouseUp={() => (gameState.current.keys.left = false)}
          className="flex-1 py-3.5 rounded-2xl bg-slate-800 active:bg-cyan-600 font-black text-sm text-cyan-300 cursor-pointer shadow-md"
        >
          ◀ GAUCHE
        </button>

        <button
          onTouchStart={() => (gameState.current.keys.cool = true)}
          onTouchEnd={() => (gameState.current.keys.cool = false)}
          onMouseDown={() => (gameState.current.keys.cool = true)}
          onMouseUp={() => (gameState.current.keys.cool = false)}
          className="px-5 py-3.5 rounded-2xl bg-blue-600/40 active:bg-blue-500 border border-blue-400 font-black text-xs text-blue-200 cursor-pointer"
        >
          ❄️ REFROIDIR
        </button>

        <button
          onTouchStart={() => (gameState.current.keys.right = true)}
          onTouchEnd={() => (gameState.current.keys.right = false)}
          onMouseDown={() => (gameState.current.keys.right = true)}
          onMouseUp={() => (gameState.current.keys.right = false)}
          className="flex-1 py-3.5 rounded-2xl bg-slate-800 active:bg-cyan-600 font-black text-sm text-cyan-300 cursor-pointer shadow-md"
        >
          DROITE ▶
        </button>
      </div>

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-3xl">
            🏆
          </div>
          <h3 className="text-xl font-black text-white font-mono">MISSION ACCOMPLIE !</h3>
          <p className="text-xs text-slate-300">
            Vous avez foré jusqu'au cœur avec un score de <strong className="text-cyan-300">{score} pts</strong> !
          </p>
          <button
            onClick={handleManualExit}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-black text-slate-950 text-xs uppercase cursor-pointer shadow-lg"
          >
            RÉCUPÉRER LES RÉCOMPENSES
          </button>
        </div>
      )}
    </div>
  );
}
