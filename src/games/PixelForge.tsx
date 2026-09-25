import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../utils/audio';
import { Play, RotateCcw, X, Hammer, Shield, Moon } from 'lucide-react';

interface GameProps {
  onFinish: (score: number, bonusVC?: number) => void;
  onExit: () => void;
}

export function PixelForge({ onFinish, onExit }: GameProps) {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState(0);
  const [wood, setWood] = useState(15);
  const [stone, setStone] = useState(10);
  const [baseHp, setBaseHp] = useState(100);
  const [wave, setWave] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef({ x: 400, y: 190 });
  const structuresRef = useRef<{ x: number; y: number; type: 'wall' | 'turret'; hp: number }[]>([]);
  const creepersRef = useRef<{ x: number; y: number; hp: number; speed: number }[]>([]);
  const resourcesRef = useRef<{ x: number; y: number; type: 'tree' | 'rock'; hp: number }[]>([]);

  const startGame = () => {
    audio.playStart();
    setGameState('playing');
    setScore(0);
    setWood(25);
    setStone(15);
    setBaseHp(100);
    setWave(1);
    structuresRef.current = [];
    creepersRef.current = [];

    // Spawn initial resources
    const res: any[] = [];
    for (let i = 0; i < 6; i++) {
      res.push({
        x: Math.random() * 700 + 50,
        y: Math.random() * 300 + 40,
        type: i % 2 === 0 ? 'tree' : 'rock',
        hp: 30
      });
    }
    resourcesRef.current = res;
  };

  // Build structure at player location
  const buildWall = () => {
    if (wood < 10) return;
    audio.playHit();
    setWood(w => w - 10);
    structuresRef.current.push({ x: playerRef.current.x, y: playerRef.current.y, type: 'wall', hp: 80 });
  };

  const buildTurret = () => {
    if (stone < 10 || wood < 10) return;
    audio.playPowerup();
    setStone(s => s - 10);
    setWood(w => w - 10);
    structuresRef.current.push({ x: playerRef.current.x, y: playerRef.current.y, type: 'turret', hp: 50 });
  };

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const p = playerRef.current;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') p.y -= 8;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') p.y += 8;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') p.x -= 8;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') p.x += 8;
      if (e.code === 'KeyB') buildWall();
      if (e.code === 'KeyT') buildTurret();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [wood, stone]);

  // Click or touch to mine resource
  const handleMineAt = (clientX: number, clientY: number) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;

    // Check hit on resources
    resourcesRef.current.forEach(r => {
      if (Math.hypot(mx - r.x, my - r.y) < 36) {
        audio.playHit();
        r.hp -= 15;
        if (r.type === 'tree') setWood(w => w + 5);
        else setStone(s => s + 5);
        setScore(sc => sc + 25);
      }
    });

    resourcesRef.current = resourcesRef.current.filter(r => r.hp > 0);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleMineAt(e.clientX, e.clientY);
  };

  // Main Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let animId: number;
    let spawnTimer = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      // Spawn Creepers towards base center (400, 190)
      spawnTimer++;
      if (spawnTimer % 110 === 0) {
        const ang = Math.random() * Math.PI * 2;
        creepersRef.current.push({
          x: 400 + Math.cos(ang) * 420,
          y: 190 + Math.sin(ang) * 420,
          hp: 30,
          speed: 1.1 + wave * 0.1
        });
      }

      // Turrets auto-fire on nearest creeper
      structuresRef.current.forEach(str => {
        if (str.type === 'turret' && spawnTimer % 30 === 0) {
          if (creepersRef.current.length > 0) {
            const target = creepersRef.current[0];
            target.hp -= 20;
            audio.playLaser();
            if (target.hp <= 0) {
              setScore(sc => sc + 100);
            }
          }
        }
      });

      // Update Creepers
      creepersRef.current.forEach(cr => {
        const ang = Math.atan2(190 - cr.y, 400 - cr.x);
        cr.x += Math.cos(ang) * cr.speed;
        cr.y += Math.sin(ang) * cr.speed;

        // Creeper hits base
        if (Math.hypot(400 - cr.x, 190 - cr.y) < 35) {
          audio.playHit();
          cr.hp = 0;
          setBaseHp(prev => {
            const next = prev - 15;
            if (next <= 0) {
              audio.playOof();
              setGameState('gameover');
              onFinish(score, 30);
              return 0;
            }
            return next;
          });
        }
      });

      creepersRef.current = creepersRef.current.filter(c => c.hp > 0);

      // RENDER
      ctx.fillStyle = '#08140b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Voxel Grass Grid
      ctx.strokeStyle = '#14532d';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw Central Base Heart
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(380, 170, 40, 40);
      ctx.strokeStyle = '#86efac';
      ctx.lineWidth = 2;
      ctx.strokeRect(380, 170, 40, 40);

      // Draw Resources (Trees & Rocks)
      resourcesRef.current.forEach(r => {
        if (r.type === 'tree') {
          ctx.fillStyle = '#15803d';
          ctx.beginPath();
          ctx.arc(r.x, r.y, 16, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#64748b';
          ctx.fillRect(r.x - 12, r.y - 12, 24, 24);
        }
      });

      // Draw Structures (Walls & Turrets)
      structuresRef.current.forEach(str => {
        if (str.type === 'wall') {
          ctx.fillStyle = '#78350f';
          ctx.fillRect(str.x - 10, str.y - 10, 20, 20);
        } else {
          ctx.fillStyle = '#3b82f6';
          ctx.beginPath();
          ctx.arc(str.x, str.y, 12, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw Creepers
      creepersRef.current.forEach(c => {
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(c.x - 10, c.y - 10, 20, 20);
        ctx.fillStyle = '#000000';
        ctx.fillRect(c.x - 6, c.y - 6, 4, 4);
        ctx.fillRect(c.x + 2, c.y - 6, 4, 4);
      });

      // Draw Player
      const p = playerRef.current;
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(p.x - 10, p.y - 10, 20, 20);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, score, wave, onFinish]);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[#0a160d] border-2 border-emerald-500/50 rounded-3xl p-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-emerald-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 font-bold text-lg">
            ⛏️
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">PixelForge: Craft & Survive</h2>
            <p className="text-xs text-emerald-400 font-mono">Bois: {wood} • Pierre: {stone} • Base: {baseHp}%</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm font-mono font-bold">
          <button onClick={buildWall} className="px-3 py-1 bg-amber-900 border border-amber-500 text-yellow-300 rounded-lg text-xs cursor-pointer">
            Mur (B: 10 Bois)
          </button>
          <button onClick={buildTurret} className="px-3 py-1 bg-blue-900 border border-blue-500 text-cyan-300 rounded-lg text-xs cursor-pointer">
            Tourelle (T: 10/10)
          </button>
          <div className="text-cyan-300">Score: {score}</div>
          <button onClick={onExit} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-900/60 bg-[#08140b] flex justify-center cursor-pointer">
        <canvas
          ref={canvasRef}
          width={800}
          height={380}
          onClick={handleCanvasClick}
          className="w-full max-w-[800px] h-auto block"
        />

        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300 font-mono mb-2">
              PIXELFORGE SURVIVAL
            </h3>
            <p className="text-slate-300 text-sm max-w-md mb-6">
              Déplacez-vous avec <strong>Z-Q-S-D</strong>, cliquez pour récolter des arbres et rochers, puis construisez des barricades (<strong>B</strong>) et des tourelles (<strong>T</strong>) pour protéger votre cœur de base !
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.5)] cursor-pointer flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" /> COMMENCER LA SURVIE
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl mb-2">💥🧱</div>
            <h3 className="text-2xl font-black text-rose-500 font-mono mb-2">CŒUR DE BASE DÉTRUIT</h3>
            <p className="text-slate-300 text-sm mb-4">Score final : <strong className="text-emerald-400">{score} pts</strong></p>
            <div className="flex gap-3">
              <button onClick={startGame} className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase">
                Rejouer
              </button>
              <button onClick={onExit} className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs uppercase">
                Quitter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
