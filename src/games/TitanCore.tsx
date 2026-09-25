import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../utils/audio';
import { Play, RotateCcw, X, Shield, Zap, Target } from 'lucide-react';

interface GameProps {
  onFinish: (score: number, bonusVC?: number) => void;
  onExit: () => void;
}

export function TitanCore({ onFinish, onExit }: GameProps) {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState(0);
  const [shield, setShield] = useState(100);
  const [heat, setHeat] = useState(0);
  const [missiles, setMissiles] = useState(4);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mechRef = useRef({
    x: 400,
    y: 300,
    targetX: 400,
    targetY: 300,
    angle: 0,
    cooldown: 0
  });

  const bulletsRef = useRef<{ x: number; y: number; vx: number; vy: number; isPlayer: boolean; type: 'cannon' | 'missile' }[]>([]);
  const enemyMechsRef = useRef<{ x: number; y: number; hp: number; maxHp: number; angle: number; shootTimer: number; type: 'scout' | 'heavy' | 'boss' }[]>([]);
  const explosionsRef = useRef<{ x: number; y: number; r: number; maxR: number; color: string }[]>([]);

  const startGame = () => {
    audio.playStart();
    setGameState('playing');
    setScore(0);
    setShield(100);
    setHeat(0);
    setMissiles(4);
    bulletsRef.current = [];
    enemyMechsRef.current = [];
    explosionsRef.current = [];
  };

  // Gatling Cannon Fire
  const fireCannons = () => {
    if (gameState !== 'playing' || heat >= 95) return;
    const m = mechRef.current;
    audio.playLaser();

    const speed = 12;
    const offset = 12;
    // Dual cannons left & right
    const cos = Math.cos(m.angle);
    const sin = Math.sin(m.angle);

    bulletsRef.current.push(
      { x: m.x + cos * 20 - sin * offset, y: m.y + sin * 20 + cos * offset, vx: cos * speed, vy: sin * speed, isPlayer: true, type: 'cannon' },
      { x: m.x + cos * 20 + sin * offset, y: m.y + sin * 20 - cos * offset, vx: cos * speed, vy: sin * speed, isPlayer: true, type: 'cannon' }
    );

    setHeat(h => Math.min(100, h + 8));
  };

  // Micro Missiles Barrage
  const fireMissiles = () => {
    if (gameState !== 'playing' || missiles <= 0) return;
    const m = mechRef.current;
    audio.playPowerup();
    setMissiles(cnt => cnt - 1);

    for (let i = -2; i <= 2; i++) {
      const ang = m.angle + (i * 0.25);
      bulletsRef.current.push({
        x: m.x,
        y: m.y,
        vx: Math.cos(ang) * 9,
        vy: Math.sin(ang) * 9,
        isPlayer: true,
        type: 'missile'
      });
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'KeyJ') fireCannons();
      if (e.code === 'KeyQ' || e.code === 'KeyK') fireMissiles();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, heat, missiles]);

  // Main Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let animId: number;
    let spawnTimer = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      mechRef.current.targetX = mx;
      mechRef.current.targetY = my;
      mechRef.current.angle = Math.atan2(my - mechRef.current.y, mx - mechRef.current.x);
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches && e.touches[0]) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.touches[0].clientX - rect.left;
        const my = e.touches[0].clientY - rect.top;
        mechRef.current.targetX = mx;
        mechRef.current.targetY = my;
        mechRef.current.angle = Math.atan2(my - mechRef.current.y, mx - mechRef.current.x);
        fireCannons();
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });

    const loop = () => {
      const m = mechRef.current;

      // Mech gentle hover follow
      m.x += (m.targetX - m.x) * 0.08;
      m.y += (m.targetY - m.y) * 0.08;

      // Heat cooldown
      setHeat(h => Math.max(0, h - 0.4));

      // Spawn Enemy Mechs
      spawnTimer++;
      if (spawnTimer % 90 === 0) {
        const isBoss = spawnTimer % 360 === 0;
        enemyMechsRef.current.push({
          x: Math.random() * (canvas.width - 100) + 50,
          y: -40,
          hp: isBoss ? 200 : 40,
          maxHp: isBoss ? 200 : 40,
          angle: Math.PI / 2,
          shootTimer: 0,
          type: isBoss ? 'boss' : (Math.random() > 0.5 ? 'heavy' : 'scout')
        });
      }

      // Update Bullets
      bulletsRef.current.forEach(b => {
        b.x += b.vx;
        b.y += b.vy;
      });

      // Filter out of bounds bullets
      bulletsRef.current = bulletsRef.current.filter(
        b => b.x >= 0 && b.x <= canvas.width && b.y >= 0 && b.y <= canvas.height
      );

      // Update Enemies
      enemyMechsRef.current.forEach(enemy => {
        enemy.y += enemy.type === 'boss' ? 0.6 : 1.4;
        enemy.shootTimer++;

        // Enemy firing
        if (enemy.shootTimer % (enemy.type === 'boss' ? 45 : 75) === 0) {
          const ang = Math.atan2(m.y - enemy.y, m.x - enemy.x);
          bulletsRef.current.push({
            x: enemy.x,
            y: enemy.y,
            vx: Math.cos(ang) * 4.5,
            vy: Math.sin(ang) * 4.5,
            isPlayer: false,
            type: 'cannon'
          });
        }

        // Bullet vs Enemy Collision
        bulletsRef.current.forEach(b => {
          if (b.isPlayer) {
            const dx = enemy.x - b.x;
            const dy = enemy.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = enemy.type === 'boss' ? 35 : 20;

            if (dist < radius) {
              enemy.hp -= b.type === 'missile' ? 45 : 20;
              b.x = -999; // destroy bullet
              audio.playHit();

              if (enemy.hp <= 0) {
                audio.playExplosion();
                explosionsRef.current.push({
                  x: enemy.x,
                  y: enemy.y,
                  r: 5,
                  maxR: enemy.type === 'boss' ? 45 : 25,
                  color: '#f97316'
                });
                setScore(s => s + (enemy.type === 'boss' ? 500 : 120));
              }
            }
          }
        });
      });

      // Remove dead enemies
      enemyMechsRef.current = enemyMechsRef.current.filter(e => e.hp > 0 && e.y < canvas.height + 50);

      // Enemy Bullets vs Player Mech
      bulletsRef.current.forEach(b => {
        if (!b.isPlayer) {
          const dx = m.x - b.x;
          const dy = m.y - b.y;
          if (Math.sqrt(dx * dx + dy * dy) < 26) {
            b.x = -999;
            audio.playHit();
            setShield(prev => {
              const next = prev - 15;
              if (next <= 0) {
                audio.playExplosion();
                setGameState('gameover');
                onFinish(score, 35);
                return 0;
              }
              return next;
            });
          }
        }
      });

      // Update Explosions
      explosionsRef.current.forEach(ex => { ex.r += 2.5; });
      explosionsRef.current = explosionsRef.current.filter(ex => ex.r < ex.maxR);

      // RENDER
      ctx.fillStyle = '#080816';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid Arena lines
      ctx.strokeStyle = '#1e1b4b';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw Explosions
      explosionsRef.current.forEach(ex => {
        ctx.strokeStyle = ex.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(ex.x, ex.y, ex.r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Draw Bullets
      bulletsRef.current.forEach(b => {
        ctx.fillStyle = b.isPlayer ? (b.type === 'missile' ? '#f59e0b' : '#38bdf8') : '#ef4444';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.type === 'missile' ? 5 : 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Enemy Mechs
      enemyMechsRef.current.forEach(enemy => {
        ctx.fillStyle = enemy.type === 'boss' ? '#dc2626' : '#ea580c';
        const r = enemy.type === 'boss' ? 30 : 18;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 2;
        ctx.stroke();

        // HP bar above enemy
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(enemy.x - 20, enemy.y - r - 10, 40, 4);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(enemy.x - 20, enemy.y - r - 10, (enemy.hp / enemy.maxHp) * 40, 4);
      });

      // Draw Player Titan Mech
      ctx.save();
      ctx.translate(m.x, m.y);
      ctx.rotate(m.angle);

      // Energy Shield Bubble
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.stroke();

      // Mech Shoulders / Weapons
      ctx.fillStyle = '#475569';
      ctx.fillRect(8, -18, 16, 6);
      ctx.fillRect(8, 12, 16, 6);

      // Mech Main Body
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();

      // Cockpit Glow
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(4, 0, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('touchmove', handleTouch);
    };
  }, [gameState, score, heat, missiles, onFinish]);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[#0f0c1b] border-2 border-red-500/50 rounded-3xl p-6 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-red-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-400 flex items-center justify-center text-red-300 font-bold text-lg">
            🤖
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">Titan Core: Mech Battle Arena</h2>
            <p className="text-xs text-red-400 font-mono">Arène Classée • Surchauffe: {Math.round(heat)}%</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-mono font-bold">
          <div className="text-cyan-300">Bouclier: {shield}%</div>
          <div className="text-amber-400">Missiles: {missiles}x (Q)</div>
          <div className="text-white">Score: {score}</div>
          <button onClick={onExit} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-red-900/60 bg-[#080816] flex justify-center cursor-crosshair">
        <canvas ref={canvasRef} width={800} height={380} className="w-full max-w-[800px] h-auto block" />

        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500 font-mono mb-2">
              TITAN CORE MECH ARENA
            </h3>
            <p className="text-slate-300 text-sm max-w-md mb-6">
              Visez à la souris, appuyez sur <strong>Espace / J</strong> pour tirer aux doubles canons et <strong>Q / K</strong> pour lancer des micro-missiles guidés !
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(239,68,68,0.5)] cursor-pointer flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" /> ACTIVER LE MÉCHA
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl mb-2">🤖💥</div>
            <h3 className="text-2xl font-black text-rose-500 font-mono mb-2">MÉCHA NEUTRALISÉ</h3>
            <p className="text-slate-300 text-sm mb-4">Score final : <strong className="text-amber-400">{score} pts</strong></p>
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
