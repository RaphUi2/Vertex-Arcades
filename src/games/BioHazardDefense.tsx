import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../utils/audio';
import { Play, RotateCcw, X, Shield, Crosshair, Skull } from 'lucide-react';

interface GameProps {
  onFinish: (score: number, bonusVC?: number) => void;
  onExit: () => void;
}

export function BioHazardDefense({ onFinish, onExit }: GameProps) {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState(0);
  const [barricadeHp, setBarricadeHp] = useState(100);
  const [ammo, setAmmo] = useState(24);
  const [wave, setWave] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const zombiesRef = useRef<{ x: number; y: number; hp: number; speed: number }[]>([]);
  const bulletsRef = useRef<{ x: number; y: number; vx: number; vy: number }[]>([]);

  const startGame = () => {
    audio.playStart();
    setGameState('playing');
    setScore(0);
    setBarricadeHp(100);
    setAmmo(24);
    setWave(1);
    zombiesRef.current = [];
    bulletsRef.current = [];
  };

  const reloadAmmo = () => {
    audio.playPowerup();
    setAmmo(24);
  };

  const handleShootAt = (clientX: number, clientY: number) => {
    if (gameState !== 'playing') return;
    if (ammo <= 0) {
      audio.playHit();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;

    audio.playLaser();
    setAmmo(a => a - 1);

    // Bullet travels from bottom center bunker (400, 340)
    const ang = Math.atan2(my - 340, mx - 400);
    bulletsRef.current.push({
      x: 400,
      y: 340,
      vx: Math.cos(ang) * 14,
      vy: Math.sin(ang) * 14
    });
  };

  const handleShoot = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleShootAt(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyR') reloadAmmo();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

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
      // Spawn Zombies
      spawnTimer++;
      if (spawnTimer % 45 === 0) {
        zombiesRef.current.push({
          x: Math.random() * (canvas.width - 100) + 50,
          y: -20,
          hp: 30,
          speed: 1.2 + wave * 0.1
        });
      }

      // Update Bullets
      bulletsRef.current.forEach(b => {
        b.x += b.vx;
        b.y += b.vy;
      });

      // Update Zombies
      zombiesRef.current.forEach(z => {
        z.y += z.speed;

        // Zombie reaches Barricade (y = 310)
        if (z.y >= 310) {
          audio.playHit();
          z.hp = 0;
          setBarricadeHp(prev => {
            const next = prev - 12;
            if (next <= 0) {
              audio.playOof();
              setGameState('gameover');
              onFinish(score, 30);
              return 0;
            }
            return next;
          });
        }

        // Bullet hit check
        bulletsRef.current.forEach(b => {
          if (Math.hypot(b.x - z.x, b.y - z.y) < 18) {
            audio.playHit();
            z.hp -= 25;
            b.x = -999;
            if (z.hp <= 0) {
              audio.playExplosion();
              setScore(s => s + 85);
            }
          }
        });
      });

      bulletsRef.current = bulletsRef.current.filter(b => b.y > -20 && b.y < canvas.height);
      zombiesRef.current = zombiesRef.current.filter(z => z.hp > 0);

      // RENDER
      ctx.fillStyle = '#110707';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Barricade line (y = 310)
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(0, 310, canvas.width, 15);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 310, canvas.width, 15);

      // Player Bunker
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(360, 325, 80, 55);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(400, 340, 12, 0, Math.PI * 2);
      ctx.fill();

      // Draw Bullets
      ctx.fillStyle = '#f59e0b';
      bulletsRef.current.forEach(b => {
        ctx.fillRect(b.x - 2, b.y - 2, 4, 8);
      });

      // Draw Zombies
      zombiesRef.current.forEach(z => {
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(z.x, z.y, 14, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(z.x - 5, z.y + 2, 3, 3);
        ctx.fillRect(z.x + 2, z.y + 2, 3, 3);
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, score, wave, onFinish]);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[#180909] border-2 border-red-500/50 rounded-3xl p-6 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-red-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-400 flex items-center justify-center text-red-300 font-bold text-lg">
            ☣️
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">BioHazard: Outbreak Defense</h2>
            <p className="text-xs text-red-400 font-mono">Barricade : {barricadeHp}% • Munitions : {ammo}/24 (R: Recharger)</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-mono font-bold">
          <div className="text-yellow-400">Score: {score}</div>
          <button onClick={onExit} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-red-900/60 bg-[#110707] flex justify-center cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={800}
          height={380}
          onClick={handleShoot}
          onTouchStart={(e) => {
            e.preventDefault();
            if (e.touches && e.touches[0]) {
              handleShootAt(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          className="w-full max-w-[800px] h-auto block touch-none"
        />

        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500 font-mono mb-2">
              BIOHAZARD DEFENSE
            </h3>
            <p className="text-slate-300 text-sm max-w-md mb-6">
              Cliquez pour faire feu sur la horde de mutants toxiques avant qu'ils ne franchissent la barricade de sécurité ! Appuyez sur <strong>R</strong> pour recharger.
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(239,68,68,0.5)] cursor-pointer flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" /> SÉCURISER LE PÉRIMÈTRE
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl mb-2">☣️🧟</div>
            <h3 className="text-2xl font-black text-rose-500 font-mono mb-2">BARRICADE ROMPUE</h3>
            <p className="text-slate-300 text-sm mb-4">Score final : <strong className="text-red-400">{score} pts</strong></p>
            <div className="flex gap-3">
              <button onClick={startGame} className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase">
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
