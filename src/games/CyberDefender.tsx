import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Shield, ShieldAlert, Zap, Target, Sparkles, Award } from 'lucide-react';

interface CyberDefenderProps {
  onGameOver: (score: number, pixelsEarned: number) => void;
  audioEnabled?: boolean;
}

export const CyberDefender: React.FC<CyberDefenderProps> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [coreHealth, setCoreHealth] = useState(100);
  const [wave, setWave] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const w = canvas.width;
    const h = canvas.height;

    // Turrets & Core positions
    const turrets = [
      { x: 50, y: h - 30, ammo: 10 },
      { x: w / 2, y: h - 30, ammo: 15 },
      { x: w - 50, y: h - 30, ammo: 10 }
    ];

    interface Warhead {
      startX: number;
      startY: number;
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      speed: number;
      color: string;
      radius: number;
      hp: number;
    }

    interface Missile {
      startX: number;
      startY: number;
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      speed: number;
    }

    interface Explosion {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      growing: boolean;
      color: string;
    }

    let warheads: Warhead[] = [];
    let missiles: Missile[] = [];
    let explosions: Explosion[] = [];

    let currentScore = 0;
    let currentHealth = 100;
    let currentWave = 1;
    let frameCount = 0;

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      if (clickY > h - 40) return; // Don't fire below ground

      // Choose closest turret with ammo
      let bestTurret = turrets[1];
      let minDist = 9999;
      for (let t of turrets) {
        const dist = Math.hypot(t.x - clickX, t.y - clickY);
        if (dist < minDist) {
          minDist = dist;
          bestTurret = t;
        }
      }

      missiles.push({
        startX: bestTurret.x,
        startY: bestTurret.y,
        x: bestTurret.x,
        y: bestTurret.y,
        targetX: clickX,
        targetY: clickY,
        speed: 8
      });
    };

    canvas.addEventListener('click', handleClick);

    const gameLoop = () => {
      frameCount++;
      ctx.clearRect(0, 0, w, h);

      // Draw Sky & Cyber Grid Ground
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      // Starfield dots
      ctx.fillStyle = '#ffffff33';
      for (let i = 0; i < 20; i++) {
        const sx = (i * 37) % w;
        const sy = (i * 29) % (h - 80);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Ground Core Line
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, h - 35, w, 35);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, h - 35);
      ctx.lineTo(w, h - 35);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Turrets
      turrets.forEach(t => {
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(t.x, t.y, 16, Math.PI, 0);
        ctx.fill();
      });

      // Spawn Enemy Warheads
      const spawnInterval = Math.max(25, 70 - currentWave * 8);
      if (frameCount % spawnInterval === 0) {
        const startX = Math.random() * w;
        const targetX = Math.random() * w;
        warheads.push({
          startX,
          startY: 0,
          x: startX,
          y: 0,
          targetX,
          targetY: h - 35,
          speed: 1.2 + currentWave * 0.3,
          color: '#f43f5e',
          radius: 3,
          hp: 1
        });
      }

      // Update Missiles
      for (let i = missiles.length - 1; i >= 0; i--) {
        const m = missiles[i];
        const dx = m.targetX - m.x;
        const dy = m.targetY - m.y;
        const dist = Math.hypot(dx, dy);

        if (dist < m.speed) {
          explosions.push({
            x: m.targetX,
            y: m.targetY,
            radius: 2,
            maxRadius: 35,
            growing: true,
            color: '#38bdf8'
          });
          missiles.splice(i, 1);
        } else {
          m.x += (dx / dist) * m.speed;
          m.y += (dy / dist) * m.speed;

          // Draw Missile Trail
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(m.startX, m.startY);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
        }
      }

      // Update Explosions
      for (let i = explosions.length - 1; i >= 0; i--) {
        const ex = explosions[i];
        if (ex.growing) {
          ex.radius += 1.8;
          if (ex.radius >= ex.maxRadius) ex.growing = false;
        } else {
          ex.radius -= 1.2;
          if (ex.radius <= 0) {
            explosions.splice(i, 1);
            continue;
          }
        }

        ctx.fillStyle = ex.color + '55';
        ctx.strokeStyle = ex.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ex.x, ex.y, ex.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Update Enemy Warheads
      for (let i = warheads.length - 1; i >= 0; i--) {
        const wh = warheads[i];
        const dx = wh.targetX - wh.x;
        const dy = wh.targetY - wh.y;
        const dist = Math.hypot(dx, dy);

        if (dist < wh.speed) {
          // Impact Ground Core!
          currentHealth -= 10;
          setCoreHealth(currentHealth);
          explosions.push({
            x: wh.x,
            y: wh.y,
            radius: 5,
            maxRadius: 25,
            growing: true,
            color: '#f43f5e'
          });
          warheads.splice(i, 1);

          if (currentHealth <= 0) {
            setGameOver(true);
            setIsPlaying(false);
            const px = Math.floor(currentScore / 2);
            onGameOver(currentScore, px);
            return;
          }
        } else {
          wh.x += (dx / dist) * wh.speed;
          wh.y += (dy / dist) * wh.speed;

          // Draw Warhead Trail
          ctx.strokeStyle = wh.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(wh.startX, wh.startY);
          ctx.lineTo(wh.x, wh.y);
          ctx.stroke();

          // Check hit by explosions
          for (let ex of explosions) {
            const edx = wh.x - ex.x;
            const edy = wh.y - ex.y;
            if (Math.hypot(edx, edy) < ex.radius + wh.radius) {
              currentScore += 100 * currentWave;
              setScore(currentScore);
              explosions.push({
                x: wh.x,
                y: wh.y,
                radius: 2,
                maxRadius: 20,
                growing: true,
                color: '#facc15'
              });
              warheads.splice(i, 1);
              break;
            }
          }
        }
      }

      // Wave Progression
      if (frameCount % 600 === 0) {
        currentWave++;
        setWave(currentWave);
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('click', handleClick);
    };
  }, [isPlaying, gameOver, onGameOver]);

  const startGame = () => {
    setScore(0);
    setCoreHealth(100);
    setWave(1);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4 bg-slate-950/90 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Title Bar */}
      <div className="w-full flex items-center justify-between mb-3 border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-wider">
            <Target className="text-cyan-400" size={22} /> CYBER DEFENDER 2099
          </h2>
          <p className="text-xs text-slate-400">Cliquez dans le ciel pour intercepter les ogives plasma !</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-xl text-center">
            <span className="text-[9px] uppercase text-cyan-400 font-bold block">Score</span>
            <span className="text-sm font-black text-cyan-300">{score}</span>
          </div>
          <div className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-xl text-center">
            <span className="text-[9px] uppercase text-emerald-400 font-bold block">Noyau</span>
            <span className="text-sm font-black text-emerald-300">{coreHealth}%</span>
          </div>
        </div>
      </div>

      {!isPlaying ? (
        <div className="flex flex-col items-center justify-center my-12 text-center space-y-5">
          <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border-2 border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <Shield size={40} />
          </div>
          <h3 className="text-xl font-extrabold text-white">Défense de Cité Cybernétique</h3>
          <p className="text-xs text-slate-400 max-w-xs">
            Cliquez n'importe où dans le ciel pour lancer des missiles d'interception à détonation sphérique.
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-sm uppercase rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.5)] transition cursor-pointer flex items-center gap-2"
          >
            <Play size={18} /> Activer les Tourelles
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <canvas
            ref={canvasRef}
            width={350}
            height={430}
            className="border-2 border-cyan-500/40 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.2)] bg-slate-950 cursor-crosshair"
          />
        </div>
      )}
    </div>
  );
};

export default CyberDefender;
