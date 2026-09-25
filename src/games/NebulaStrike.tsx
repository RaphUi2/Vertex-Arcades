import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../utils/audio';
import { Play, RotateCcw, X, Rocket, Shield, Zap } from 'lucide-react';

interface GameProps {
  onFinish: (score: number, bonusVC?: number) => void;
  onExit: () => void;
}

export function NebulaStrike({ onFinish, onExit }: GameProps) {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState(0);
  const [hull, setHull] = useState(100);
  const [torpedoes, setTorpedoes] = useState(6);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shipRef = useRef({
    x: 400,
    y: 200,
    vx: 0,
    vy: 0,
    angle: 0,
    thrusting: false
  });

  const lasersRef = useRef<{ x: number; y: number; vx: number; vy: number; isTorpedo?: boolean }[]>([]);
  const targetsRef = useRef<{ x: number; y: number; vx: number; vy: number; radius: number; hp: number; isEnemy?: boolean }[]>([]);
  const keysRef = useRef<{ left: boolean; right: boolean; thrust: boolean; fire: boolean }>({
    left: false,
    right: false,
    thrust: false,
    fire: false
  });

  const startGame = () => {
    audio.playStart();
    setGameState('playing');
    setScore(0);
    setHull(100);
    setTorpedoes(6);
    lasersRef.current = [];
    targetsRef.current = [];
    shipRef.current = { x: 400, y: 200, vx: 0, vy: 0, angle: 0, thrusting: false };

    // Initial asteroids
    for (let i = 0; i < 7; i++) {
      targetsRef.current.push({
        x: Math.random() * 800,
        y: Math.random() * 400,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: 20 + Math.random() * 15,
        hp: 30
      });
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent, isDown: boolean) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = isDown;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = isDown;
      if (e.code === 'ArrowUp' || e.code === 'KeyW') keysRef.current.thrust = isDown;
      if ((e.code === 'Space' || e.code === 'KeyJ') && isDown) fireLaser();
      if ((e.code === 'KeyK' || e.code === 'KeyE') && isDown) fireTorpedo();
    };

    const down = (e: KeyboardEvent) => handleKey(e, true);
    const up = (e: KeyboardEvent) => handleKey(e, false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [gameState, torpedoes]);

  const fireLaser = () => {
    if (gameState !== 'playing') return;
    const s = shipRef.current;
    audio.playLaser();
    lasersRef.current.push({
      x: s.x + Math.cos(s.angle) * 20,
      y: s.y + Math.sin(s.angle) * 20,
      vx: Math.cos(s.angle) * 11 + s.vx * 0.5,
      vy: Math.sin(s.angle) * 11 + s.vy * 0.5
    });
  };

  const fireTorpedo = () => {
    if (gameState !== 'playing' || torpedoes <= 0) return;
    const s = shipRef.current;
    audio.playPowerup();
    setTorpedoes(t => t - 1);
    lasersRef.current.push({
      x: s.x + Math.cos(s.angle) * 22,
      y: s.y + Math.sin(s.angle) * 22,
      vx: Math.cos(s.angle) * 7 + s.vx * 0.5,
      vy: Math.sin(s.angle) * 7 + s.vy * 0.5,
      isTorpedo: true
    });
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
      const s = shipRef.current;
      const k = keysRef.current;

      // Rotation
      if (k.left) s.angle -= 0.07;
      if (k.right) s.angle += 0.07;

      // Thrusters
      if (k.thrust) {
        s.vx += Math.cos(s.angle) * 0.22;
        s.vy += Math.sin(s.angle) * 0.22;
      }
      s.vx *= 0.985;
      s.vy *= 0.985;
      s.x += s.vx;
      s.y += s.vy;

      // Screen wrap
      if (s.x < 0) s.x = canvas.width;
      if (s.x > canvas.width) s.x = 0;
      if (s.y < 0) s.y = canvas.height;
      if (s.y > canvas.height) s.y = 0;

      // Spawn new enemy interceptors
      spawnTimer++;
      if (spawnTimer % 180 === 0) {
        targetsRef.current.push({
          x: Math.random() > 0.5 ? 0 : canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          radius: 18,
          hp: 40,
          isEnemy: true
        });
      }

      // Update Lasers
      lasersRef.current.forEach(l => {
        l.x += l.vx;
        l.y += l.vy;
      });
      lasersRef.current = lasersRef.current.filter(
        l => l.x >= 0 && l.x <= canvas.width && l.y >= 0 && l.y <= canvas.height
      );

      // Update Targets (Asteroids & Enemies)
      targetsRef.current.forEach(t => {
        t.x += t.vx;
        t.y += t.vy;
        if (t.x < 0) t.x = canvas.width;
        if (t.x > canvas.width) t.x = 0;
        if (t.y < 0) t.y = canvas.height;
        if (t.y > canvas.height) t.y = 0;

        // Collision with Ship
        const dx = s.x - t.x;
        const dy = s.y - t.y;
        if (Math.hypot(dx, dy) < t.radius + 12) {
          audio.playHit();
          setHull(prev => {
            const next = prev - 25;
            if (next <= 0) {
              audio.playExplosion();
              setGameState('gameover');
              onFinish(score, 25);
              return 0;
            }
            return next;
          });
          t.hp = 0;
        }

        // Collision with Lasers
        lasersRef.current.forEach(l => {
          const ldx = l.x - t.x;
          const ldy = l.y - t.y;
          if (Math.hypot(ldx, ldy) < t.radius) {
            audio.playHit();
            t.hp -= l.isTorpedo ? 60 : 25;
            l.x = -999;

            if (t.hp <= 0) {
              audio.playExplosion();
              setScore(sc => sc + (t.isEnemy ? 250 : 100));
            }
          }
        });
      });

      targetsRef.current = targetsRef.current.filter(t => t.hp > 0);

      // RENDER
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 35; i++) {
        const sx = (i * 97) % canvas.width;
        const sy = (i * 61) % canvas.height;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Draw Lasers
      lasersRef.current.forEach(l => {
        ctx.fillStyle = l.isTorpedo ? '#f59e0b' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(l.x, l.y, l.isTorpedo ? 5 : 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Targets
      targetsRef.current.forEach(t => {
        if (t.isEnemy) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Draw Ship
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.angle);

      // Thrust Flame
      if (k.thrust) {
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(-14, -5);
        ctx.lineTo(-24 - Math.random() * 8, 0);
        ctx.lineTo(-14, 5);
        ctx.fill();
      }

      // Starfighter Body
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(-14, -12);
      ctx.lineTo(-8, 0);
      ctx.lineTo(-14, 12);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, score, torpedoes, onFinish]);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[#080d1a] border-2 border-sky-500/50 rounded-3xl p-6 shadow-[0_0_40px_rgba(56,189,248,0.3)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-sky-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-300 font-bold text-lg">
            🚀
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">Nebula Strike: Zero-G Dogfight</h2>
            <p className="text-xs text-sky-400 font-mono">Torpilles: {torpedoes}x (K) • Coque: {hull}%</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-mono font-bold">
          <div className="text-cyan-300">Score: {score}</div>
          <button onClick={onExit} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-sky-900/60 bg-[#030712] flex justify-center">
        <canvas ref={canvasRef} width={800} height={380} className="w-full max-w-[800px] h-auto block" />

        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 font-mono mb-2">
              NEBULA STRIKE 360
            </h3>
            <p className="text-slate-300 text-sm max-w-md mb-6">
              Contrôlez votre vaisseau en apesanteur 360° ! <strong>Flèches Gauche/Droite</strong> pour pivoter, <strong>Haut / W</strong> pour les réacteurs, <strong>Espace</strong> pour le laser et <strong>K / E</strong> pour la torpille.
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(56,189,248,0.5)] cursor-pointer flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" /> ALLUMER LES PROPULSEURS
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl mb-2">💥🚀</div>
            <h3 className="text-2xl font-black text-rose-500 font-mono mb-2">VAISSEAU DÉTRUIT</h3>
            <p className="text-slate-300 text-sm mb-4">Score final : <strong className="text-sky-300">{score} pts</strong></p>
            <div className="flex gap-3">
              <button onClick={startGame} className="px-6 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs uppercase">
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
