import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../utils/audio';
import { Play, RotateCcw, X, Sword, Shield, Flame, Zap } from 'lucide-react';

interface GameProps {
  onFinish: (score: number, bonusVC?: number) => void;
  onExit: () => void;
}

export function AetheriaVoid({ onFinish, onExit }: GameProps) {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [hp, setHp] = useState(100);
  const [fury, setFury] = useState(0);
  const [waves, setWaves] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef({
    x: 400,
    y: 260,
    radius: 20,
    angle: 0,
    slashing: false,
    slashAngle: 0,
    parrying: false
  });

  const enemiesRef = useRef<{ id: number; x: number; y: number; speed: number; hp: number; type: 'stalker' | 'shade' | 'brute' }[]>([]);
  const slashParticlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; color: string }[]>([]);

  const startGame = () => {
    audio.playStart();
    setGameState('playing');
    setScore(0);
    setCombo(1);
    setHp(100);
    setFury(0);
    setWaves(1);
    enemiesRef.current = [];
    slashParticlesRef.current = [];
    playerRef.current.x = 400;
    playerRef.current.y = 260;
  };

  // Slash action
  const handleSlash = () => {
    if (gameState !== 'playing') return;
    const p = playerRef.current;
    p.slashing = true;
    p.slashAngle = p.angle;
    audio.playLaser();

    // Check hit on enemies in front arc
    const hitRadius = 75;
    let hitCount = 0;

    enemiesRef.current.forEach(enemy => {
      const dx = enemy.x - p.x;
      const dy = enemy.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < hitRadius) {
        enemy.hp -= 35;
        hitCount++;
        audio.playHit();

        // Particles
        for (let i = 0; i < 8; i++) {
          slashParticlesRef.current.push({
            x: enemy.x,
            y: enemy.y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 15,
            color: '#c084fc'
          });
        }
      }
    });

    if (hitCount > 0) {
      setScore(s => s + hitCount * 60 * combo);
      setCombo(c => Math.min(10, c + 1));
      setFury(f => Math.min(100, f + hitCount * 12));
    }

    setTimeout(() => { p.slashing = false; }, 140);
  };

  // Unleash Void Fury
  const handleUltimate = () => {
    if (fury < 100) return;
    audio.playPowerup();
    audio.playExplosion();
    setFury(0);

    // Wipe all active enemies on screen
    const count = enemiesRef.current.length;
    enemiesRef.current = [];
    setScore(s => s + count * 150 * combo + 500);
    setCombo(c => Math.min(10, c + 3));

    // Massive particle ring
    const p = playerRef.current;
    for (let i = 0; i < 40; i++) {
      const ang = (i / 40) * Math.PI * 2;
      slashParticlesRef.current.push({
        x: p.x,
        y: p.y,
        vx: Math.cos(ang) * 9,
        vy: Math.sin(ang) * 9,
        life: 25,
        color: '#e879f9'
      });
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'KeyJ') handleSlash();
      if (e.code === 'KeyK' || e.code === 'KeyE') handleUltimate();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, fury, combo]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let animId: number;
    let spawnTimer = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mouse movement to aim
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      playerRef.current.angle = Math.atan2(my - playerRef.current.y, mx - playerRef.current.x);
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches && e.touches[0]) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.touches[0].clientX - rect.left;
        const my = e.touches[0].clientY - rect.top;
        playerRef.current.angle = Math.atan2(my - playerRef.current.y, mx - playerRef.current.x);
        handleSlash();
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });

    const loop = () => {
      const p = playerRef.current;

      // Spawn enemies
      spawnTimer++;
      if (spawnTimer % 45 === 0) {
        const side = Math.floor(Math.random() * 4);
        let ex = 0, ey = 0;
        if (side === 0) { ex = Math.random() * canvas.width; ey = -20; }
        else if (side === 1) { ex = canvas.width + 20; ey = Math.random() * canvas.height; }
        else if (side === 2) { ex = Math.random() * canvas.width; ey = canvas.height + 20; }
        else { ex = -20; ey = Math.random() * canvas.height; }

        enemiesRef.current.push({
          id: Math.random(),
          x: ex,
          y: ey,
          speed: 1.5 + Math.random() * 1.5,
          hp: 40,
          type: Math.random() > 0.3 ? 'stalker' : 'shade'
        });
      }

      // Update enemies
      enemiesRef.current.forEach((enemy, idx) => {
        const angle = Math.atan2(p.y - enemy.y, p.x - enemy.x);
        enemy.x += Math.cos(angle) * enemy.speed;
        enemy.y += Math.sin(angle) * enemy.speed;

        // Collision with player
        const dx = p.x - enemy.x;
        const dy = p.y - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < p.radius + 15) {
          audio.playHit();
          enemiesRef.current.splice(idx, 1);
          setCombo(1);
          setHp(prev => {
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

      // Filter dead enemies
      enemiesRef.current = enemiesRef.current.filter(e => e.hp > 0);

      // Update particles
      slashParticlesRef.current.forEach(pt => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
      });
      slashParticlesRef.current = slashParticlesRef.current.filter(pt => pt.life > 0);

      // RENDER
      ctx.fillStyle = '#060814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Radial dark background glow
      const grad = ctx.createRadialGradient(p.x, p.y, 20, p.x, p.y, 350);
      grad.addColorStop(0, 'rgba(147, 51, 234, 0.15)');
      grad.addColorStop(1, 'rgba(6, 8, 20, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Enemies
      enemiesRef.current.forEach(enemy => {
        ctx.fillStyle = enemy.type === 'shade' ? '#f43f5e' : '#a855f7';
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, 14, 0, Math.PI * 2);
        ctx.fill();

        // Glowing eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(enemy.x - 4, enemy.y - 2, 2.5, 0, Math.PI * 2);
        ctx.arc(enemy.x + 4, enemy.y - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Particles
      slashParticlesRef.current.forEach(pt => {
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, 3, 3);
      });

      // Draw Player Blade Arc if slashing
      if (p.slashing) {
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 65, p.slashAngle - Math.PI / 3, p.slashAngle + Math.PI / 3);
        ctx.stroke();
      }

      // Draw Player Hero (Aetheria Void Blade)
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      // Katana Blade
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(45, 0);
      ctx.stroke();

      // Cyber Body
      ctx.fillStyle = '#9333ea';
      ctx.beginPath();
      ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Visor
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(4, -5, 12, 10);

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
  }, [gameState, score, combo, fury, onFinish]);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[#0b0c1e] border-2 border-purple-500/50 rounded-3xl p-6 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-purple-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-300 font-bold text-lg">
            ⚔️
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">Aetheria: Blade of the Void</h2>
            <p className="text-xs text-purple-400 font-mono">Combo: x{combo} • Furie : {fury}%</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-mono font-bold">
          <div className="text-rose-400">PV: {hp}%</div>
          <div className="text-cyan-300">Score: {score}</div>
          {fury >= 100 && (
            <button
              onClick={handleUltimate}
              className="px-3 py-1 rounded-full bg-fuchsia-500 text-slate-950 font-black text-xs uppercase animate-pulse shadow-[0_0_15px_rgba(217,70,239,0.8)] cursor-pointer"
            >
              ⚡ ULTIME PRÊT (E)
            </button>
          )}
          <button onClick={onExit} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-purple-900/60 bg-[#060814] flex justify-center cursor-crosshair">
        <canvas ref={canvasRef} width={800} height={380} className="w-full max-w-[800px] h-auto block" />

        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 font-mono mb-2">
              BLADE OF THE VOID
            </h3>
            <p className="text-slate-300 text-sm max-w-md mb-6">
              Visez à la souris, appuyez sur <strong>Espace / J</strong> pour trancher les ombres du néant. Remplissez la Furie à 100% pour déclencher l'onde de choc céleste !
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(168,85,247,0.5)] cursor-pointer flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" /> ENGAGER LE COMBAT
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl mb-2">⚔️</div>
            <h3 className="text-2xl font-black text-rose-500 font-mono mb-2">LAME BRISÉE</h3>
            <p className="text-slate-300 text-sm mb-4">Score glorieux : <strong className="text-purple-300">{score} pts</strong></p>
            <div className="flex gap-3">
              <button onClick={startGame} className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs uppercase">
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
