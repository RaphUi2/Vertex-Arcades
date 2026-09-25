import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../utils/audio';
import { Play, RotateCcw, X, Shield, Sword, Sparkles } from 'lucide-react';

interface GameProps {
  onFinish: (score: number, bonusVC?: number) => void;
  onExit: () => void;
}

export function ShadowDungeon({ onFinish, onExit }: GameProps) {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover' | 'won'>('ready');
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(100);
  const [keys, setKeys] = useState(0);
  const [chestsFound, setChestsFound] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef({ x: 60, y: 60, vx: 0, vy: 0, speed: 4 });
  const skeletonsRef = useRef<{ x: number; y: number; hp: number; speed: number }[]>([]);
  const chestsRef = useRef<{ x: number; y: number; opened: boolean }[]>([]);
  const arrowsRef = useRef<{ x: number; y: number; vx: number; vy: number }[]>([]);

  const keysStateRef = useRef<{ w: boolean; s: boolean; a: boolean; d: boolean }>({ w: false, s: false, a: false, d: false });

  const startGame = () => {
    audio.playStart();
    setGameState('playing');
    setScore(0);
    setHp(100);
    setKeys(0);
    setChestsFound(0);
    playerRef.current = { x: 60, y: 60, vx: 0, vy: 0, speed: 4 };
    arrowsRef.current = [];

    // Chests
    chestsRef.current = [
      { x: 220, y: 80, opened: false },
      { x: 550, y: 120, opened: false },
      { x: 680, y: 280, opened: false },
      { x: 300, y: 300, opened: false }
    ];

    // Skeletons
    skeletonsRef.current = [
      { x: 200, y: 180, hp: 30, speed: 1.2 },
      { x: 450, y: 240, hp: 30, speed: 1.4 },
      { x: 600, y: 150, hp: 40, speed: 1.5 },
      { x: 350, y: 100, hp: 30, speed: 1.3 }
    ];
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent, isDown: boolean) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keysStateRef.current.w = isDown;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keysStateRef.current.s = isDown;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keysStateRef.current.a = isDown;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keysStateRef.current.d = isDown;
    };
    const down = (e: KeyboardEvent) => handleKey(e, true);
    const up = (e: KeyboardEvent) => handleKey(e, false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // Shoot Arrow on Click or Touch
  const handleShootAt = (clientX: number, clientY: number) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;

    const p = playerRef.current;
    const ang = Math.atan2(my - p.y, mx - p.x);
    audio.playLaser();

    arrowsRef.current.push({
      x: p.x,
      y: p.y,
      vx: Math.cos(ang) * 9,
      vy: Math.sin(ang) * 9
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleShootAt(e.clientX, e.clientY);
  };

  // Main Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      const p = playerRef.current;
      const k = keysStateRef.current;

      p.vx = (k.d ? 1 : 0) - (k.a ? 1 : 0);
      p.vy = (k.s ? 1 : 0) - (k.w ? 1 : 0);
      const len = Math.hypot(p.vx, p.vy);
      if (len > 0) {
        p.x += (p.vx / len) * p.speed;
        p.y += (p.vy / len) * p.speed;
      }

      p.x = Math.max(30, Math.min(canvas.width - 30, p.x));
      p.y = Math.max(30, Math.min(canvas.height - 30, p.y));

      // Update Arrows
      arrowsRef.current.forEach(arrow => {
        arrow.x += arrow.vx;
        arrow.y += arrow.vy;
      });

      // Update Skeletons
      skeletonsRef.current.forEach((skel, sIdx) => {
        const ang = Math.atan2(p.y - skel.y, p.x - skel.x);
        skel.x += Math.cos(ang) * skel.speed;
        skel.y += Math.sin(ang) * skel.speed;

        // Player Touch Skeleton
        if (Math.hypot(p.x - skel.x, p.y - skel.y) < 22) {
          audio.playHit();
          setHp(prev => {
            const next = prev - 15;
            if (next <= 0) {
              audio.playOof();
              setGameState('gameover');
              onFinish(score, 20);
              return 0;
            }
            return next;
          });
        }

        // Arrow hit Skeleton
        arrowsRef.current.forEach(arr => {
          if (Math.hypot(arr.x - skel.x, arr.y - skel.y) < 18) {
            audio.playHit();
            skel.hp -= 20;
            arr.x = -999;
            if (skel.hp <= 0) {
              audio.playPowerup();
              setScore(sc => sc + 150);
            }
          }
        });
      });

      skeletonsRef.current = skeletonsRef.current.filter(sk => sk.hp > 0);
      arrowsRef.current = arrowsRef.current.filter(
        a => a.x >= 0 && a.x <= canvas.width && a.y >= 0 && a.y <= canvas.height
      );

      // Open Chests
      chestsRef.current.forEach(chest => {
        if (!chest.opened && Math.hypot(p.x - chest.x, p.y - chest.y) < 26) {
          chest.opened = true;
          audio.playCoin();
          setScore(s => s + 400);
          setChestsFound(c => c + 1);
        }
      });

      // Victory Condition: All 4 chests opened!
      if (chestsRef.current.every(c => c.opened)) {
        audio.playWin();
        setGameState('won');
        onFinish(score + 1000, 150);
        return;
      }

      // RENDER (Torchlight Dark Atmosphere)
      ctx.fillStyle = '#05070e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Torchlight Gradient
      const grad = ctx.createRadialGradient(p.x, p.y, 20, p.x, p.y, 220);
      grad.addColorStop(0, 'rgba(251, 191, 36, 0.22)');
      grad.addColorStop(0.6, 'rgba(217, 119, 6, 0.08)');
      grad.addColorStop(1, 'rgba(5, 7, 14, 0.98)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Chests
      chestsRef.current.forEach(chest => {
        ctx.fillStyle = chest.opened ? '#64748b' : '#eab308';
        ctx.fillRect(chest.x - 12, chest.y - 10, 24, 20);
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.strokeRect(chest.x - 12, chest.y - 10, 24, 20);
      });

      // Draw Arrows
      ctx.fillStyle = '#38bdf8';
      arrowsRef.current.forEach(a => {
        ctx.fillRect(a.x - 2, a.y - 2, 5, 5);
      });

      // Draw Skeletons
      skeletonsRef.current.forEach(skel => {
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(skel.x, skel.y, 12, 0, Math.PI * 2);
        ctx.fill();

        // Red glowing eyes
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(skel.x - 4, skel.y - 3, 2, 2);
        ctx.fillRect(skel.x + 2, skel.y - 3, 2, 2);
      });

      // Draw Player Hero (Torchbearer)
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
      ctx.fill();

      // Torch
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(p.x + 10, p.y - 10, 5, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, score, onFinish]);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[#0d0f18] border-2 border-rose-500/50 rounded-3xl p-6 shadow-[0_0_40px_rgba(244,63,94,0.3)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-rose-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-300 font-bold text-lg">
            🗝️
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">Shadow Realm: Dungeon Escape</h2>
            <p className="text-xs text-rose-400 font-mono">Coffres trouvés: {chestsFound}/4 • PV: {hp}%</p>
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
      <div className="relative rounded-2xl overflow-hidden border border-rose-900/60 bg-[#05070e] flex justify-center cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={800}
          height={380}
          onClick={handleCanvasClick}
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
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-400 font-mono mb-2">
              SHADOW REALM DUNGEON
            </h3>
            <p className="text-slate-300 text-sm max-w-md mb-6">
              Explorez le donjon sombre avec <strong>Z-Q-S-D / Flèches</strong>, tirez à l'arc spectral avec un <strong>Clic Gauche</strong> et ouvrez les 4 coffres d'or pour vous échapper !
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(244,63,94,0.5)] cursor-pointer flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" /> ALLUMER LA TORCHE
            </button>
          </div>
        )}

        {gameState === 'won' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl mb-2">🏆🗝️</div>
            <h3 className="text-2xl font-black text-yellow-400 font-mono mb-2">DONJON PURIFIÉ !</h3>
            <p className="text-slate-300 text-sm mb-4">Victoire totale : <strong className="text-yellow-300">{score} pts</strong> • +150 V-Coins !</p>
            <div className="flex gap-3">
              <button onClick={startGame} className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs uppercase">
                Rejouer
              </button>
              <button onClick={onExit} className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs uppercase">
                Quitter
              </button>
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl mb-2">💀</div>
            <h3 className="text-2xl font-black text-rose-500 font-mono mb-2">VAINCU DANS LES OMBRES</h3>
            <p className="text-slate-300 text-sm mb-4">Score final : <strong className="text-rose-400">{score} pts</strong></p>
            <div className="flex gap-3">
              <button onClick={startGame} className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs uppercase">
                Recommencer
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
