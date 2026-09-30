import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Shield, Zap, Coins, Crosshair } from 'lucide-react';
import { audio } from '../utils/audio';

interface CosmicDefenderProps {
  onScoreSubmit?: (score: number) => void;
  onVCoinsEarned?: (vcoins: number) => void;
  onExit?: () => void;
}

export function CosmicDefender({ onScoreSubmit, onVCoinsEarned, onExit }: CosmicDefenderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [vcoinsCollected, setVcoinsCollected] = useState(0);
  const [health, setHealth] = useState(100);
  const [wave, setWave] = useState(1);

  const stateRef = useRef({
    player: {
      x: 320,
      y: 420,
      radius: 18,
      speed: 7,
      health: 100,
      maxHealth: 100,
      shield: false,
      tripleShot: false,
      tripleShotTimer: 0
    },
    lasers: [] as Array<{ x: number; y: number; vx: number; vy: number; color: string }>,
    enemies: [] as Array<{
      x: number;
      y: number;
      hp: number;
      maxHp: number;
      radius: number;
      vx: number;
      vy: number;
      color: string;
      isBoss?: boolean;
    }>,
    enemyLasers: [] as Array<{ x: number; y: number; vy: number }>,
    powerups: [] as Array<{ x: number; y: number; type: 'heal' | 'triple' | 'shield' | 'coin'; vy: number }>,
    particles: [] as Array<{ x: number; y: number; vx: number; vy: number; color: string; life: number }>,
    stars: Array.from({ length: 60 }, () => ({
      x: Math.random() * 640,
      y: Math.random() * 480,
      speed: 0.5 + Math.random() * 2.5,
      size: 1 + Math.random() * 2
    })),
    keys: {} as Record<string, boolean>,
    touchPos: null as { x: number; y: number } | null,
    score: 0,
    vcoins: 0,
    wave: 1,
    spawnTimer: 0
  });

  const startGame = () => {
    audio.playLevelUp();
    stateRef.current.player = {
      x: 320,
      y: 420,
      radius: 18,
      speed: 7,
      health: 100,
      maxHealth: 100,
      shield: false,
      tripleShot: false,
      tripleShotTimer: 0
    };
    stateRef.current.lasers = [];
    stateRef.current.enemies = [];
    stateRef.current.enemyLasers = [];
    stateRef.current.powerups = [];
    stateRef.current.particles = [];
    stateRef.current.score = 0;
    stateRef.current.vcoins = 0;
    stateRef.current.wave = 1;
    stateRef.current.spawnTimer = 0;

    setScore(0);
    setVcoinsCollected(0);
    setHealth(100);
    setWave(1);
    setGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      stateRef.current.keys[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      stateRef.current.keys[e.code] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let shootCooldown = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const st = stateRef.current;
      const pl = st.player;

      // 1. Deep Space Void with Stars
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, w, h);

      // Starfield
      st.stars.forEach(s => {
        s.y += s.speed;
        if (s.y > h) {
          s.y = 0;
          s.x = Math.random() * w;
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });

      if (isPlaying && !gameOver) {
        // Player Input
        const keys = st.keys;
        if (keys['ArrowLeft'] || keys['KeyA']) pl.x -= pl.speed;
        if (keys['ArrowRight'] || keys['KeyD']) pl.x += pl.speed;
        if (keys['ArrowUp'] || keys['KeyW']) pl.y -= pl.speed;
        if (keys['ArrowDown'] || keys['KeyS']) pl.y += pl.speed;

        // Touch control interpolation
        if (st.touchPos) {
          pl.x += (st.touchPos.x - pl.x) * 0.15;
          pl.y += (st.touchPos.y - pl.y) * 0.15;
        }

        // Clamp inside bounds
        pl.x = Math.max(pl.radius, Math.min(w - pl.radius, pl.x));
        pl.y = Math.max(pl.radius, Math.min(h - pl.radius, pl.y));

        // Auto Fire Lasers
        shootCooldown--;
        if (shootCooldown <= 0) {
          audio.playLaser();
          if (pl.tripleShot) {
            st.lasers.push({ x: pl.x, y: pl.y - 20, vx: 0, vy: -12, color: '#38bdf8' });
            st.lasers.push({ x: pl.x - 12, y: pl.y - 15, vx: -2, vy: -11, color: '#38bdf8' });
            st.lasers.push({ x: pl.x + 12, y: pl.y - 15, vx: 2, vy: -11, color: '#38bdf8' });
          } else {
            st.lasers.push({ x: pl.x - 7, y: pl.y - 20, vx: 0, vy: -12, color: '#06b6d4' });
            st.lasers.push({ x: pl.x + 7, y: pl.y - 20, vx: 0, vy: -12, color: '#06b6d4' });
          }
          shootCooldown = 12;
        }

        if (pl.tripleShotTimer > 0) {
          pl.tripleShotTimer--;
          if (pl.tripleShotTimer <= 0) pl.tripleShot = false;
        }

        // Spawn Enemies
        st.spawnTimer--;
        if (st.spawnTimer <= 0) {
          const isBoss = st.enemies.length === 0 && st.score > 0 && st.score % 1000 < 50;
          if (isBoss) {
            st.enemies.push({
              x: w / 2,
              y: -50,
              hp: 400 + st.wave * 100,
              maxHp: 400 + st.wave * 100,
              radius: 40,
              vx: 2,
              vy: 0.8,
              color: '#ec4899',
              isBoss: true
            });
            st.spawnTimer = 200;
          } else {
            const types = [
              { radius: 16, hp: 30, color: '#f43f5e', vy: 2.2 },
              { radius: 22, hp: 60, color: '#a855f7', vy: 1.6 },
              { radius: 14, hp: 20, color: '#f97316', vy: 3.2 }
            ];
            const chosen = types[Math.floor(Math.random() * types.length)];
            st.enemies.push({
              x: 30 + Math.random() * (w - 60),
              y: -30,
              hp: chosen.hp,
              maxHp: chosen.hp,
              radius: chosen.radius,
              vx: (Math.random() - 0.5) * 2,
              vy: chosen.vy,
              color: chosen.color
            });
            st.spawnTimer = Math.max(25, 60 - st.wave * 4);
          }
        }

        // Update Lasers
        for (let i = st.lasers.length - 1; i >= 0; i--) {
          const l = st.lasers[i];
          l.x += l.vx;
          l.y += l.vy;

          if (l.y < -10) {
            st.lasers.splice(i, 1);
            continue;
          }

          // Check hit enemy
          for (let j = st.enemies.length - 1; j >= 0; j--) {
            const en = st.enemies[j];
            const dist = Math.hypot(l.x - en.x, l.y - en.y);
            if (dist < en.radius + 6) {
              en.hp -= 20;
              st.lasers.splice(i, 1);

              // Spawn hit particles
              for (let p = 0; p < 4; p++) {
                st.particles.push({
                  x: l.x,
                  y: l.y,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  color: en.color,
                  life: 15
                });
              }

              if (en.hp <= 0) {
                // Enemy Destroyed
                audio.playHit();
                st.score += en.isBoss ? 500 : 50;
                setScore(st.score);

                // Chance to spawn powerup
                const pRand = Math.random();
                if (pRand < 0.25) {
                  const pTypes: Array<'heal' | 'triple' | 'shield' | 'coin'> = ['heal', 'triple', 'shield', 'coin'];
                  st.powerups.push({
                    x: en.x,
                    y: en.y,
                    type: pTypes[Math.floor(Math.random() * pTypes.length)],
                    vy: 1.8
                  });
                }

                // Explosion particles
                for (let p = 0; p < 12; p++) {
                  st.particles.push({
                    x: en.x,
                    y: en.y,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8,
                    color: en.color,
                    life: 25
                  });
                }

                st.enemies.splice(j, 1);
              }
              break;
            }
          }
        }

        // Update Enemies
        for (let i = st.enemies.length - 1; i >= 0; i--) {
          const en = st.enemies[i];
          en.x += en.vx;
          en.y += en.vy;

          if (en.x < en.radius || en.x > w - en.radius) en.vx *= -1;

          // Enemy Shoots
          if (Math.random() < (en.isBoss ? 0.05 : 0.012)) {
            st.enemyLasers.push({ x: en.x, y: en.y + en.radius, vy: 5 });
          }

          // Crash into player
          const distToPlayer = Math.hypot(en.x - pl.x, en.y - pl.y);
          if (distToPlayer < en.radius + pl.radius) {
            audio.playHit();
            if (pl.shield) {
              pl.shield = false;
            } else {
              pl.health -= 35;
              setHealth(Math.max(0, pl.health));
              if (pl.health <= 0) {
                setGameOver(true);
                setIsPlaying(false);
                if (onScoreSubmit) onScoreSubmit(st.score);
              }
            }
            st.enemies.splice(i, 1);
            continue;
          }

          if (en.y > h + 50) {
            st.enemies.splice(i, 1);
          }
        }

        // Update Enemy Lasers
        for (let i = st.enemyLasers.length - 1; i >= 0; i--) {
          const el = st.enemyLasers[i];
          el.y += el.vy;

          const dist = Math.hypot(el.x - pl.x, el.y - pl.y);
          if (dist < pl.radius + 5) {
            audio.playHit();
            if (pl.shield) {
              pl.shield = false;
            } else {
              pl.health -= 15;
              setHealth(Math.max(0, pl.health));
              if (pl.health <= 0) {
                setGameOver(true);
                setIsPlaying(false);
                if (onScoreSubmit) onScoreSubmit(st.score);
              }
            }
            st.enemyLasers.splice(i, 1);
            continue;
          }

          if (el.y > h + 10) {
            st.enemyLasers.splice(i, 1);
          }
        }

        // Update Powerups
        for (let i = st.powerups.length - 1; i >= 0; i--) {
          const pu = st.powerups[i];
          pu.y += pu.vy;

          const dist = Math.hypot(pu.x - pl.x, pu.y - pl.y);
          if (dist < pl.radius + 15) {
            audio.playCoin();
            if (pu.type === 'coin') {
              st.vcoins += 5;
              setVcoinsCollected(st.vcoins);
              if (onVCoinsEarned) onVCoinsEarned(5);
            } else if (pu.type === 'heal') {
              pl.health = Math.min(100, pl.health + 30);
              setHealth(pl.health);
            } else if (pu.type === 'shield') {
              pl.shield = true;
            } else if (pu.type === 'triple') {
              pl.tripleShot = true;
              pl.tripleShotTimer = 400;
            }
            st.powerups.splice(i, 1);
            continue;
          }

          if (pu.y > h + 20) st.powerups.splice(i, 1);
        }

        // Update Particles
        for (let i = st.particles.length - 1; i >= 0; i--) {
          const pt = st.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life--;
          if (pt.life <= 0) st.particles.splice(i, 1);
        }
      }

      // Draw Powerups
      st.powerups.forEach(pu => {
        ctx.save();
        ctx.translate(pu.x, pu.y);
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        if (pu.type === 'coin') ctx.fillStyle = '#fbbf24';
        else if (pu.type === 'heal') ctx.fillStyle = '#10b981';
        else if (pu.type === 'shield') ctx.fillStyle = '#38bdf8';
        else ctx.fillStyle = '#c084fc';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

      // Draw Lasers
      st.lasers.forEach(l => {
        ctx.fillStyle = l.color;
        ctx.shadowColor = l.color;
        ctx.shadowBlur = 8;
        ctx.fillRect(l.x - 2.5, l.y - 12, 5, 14);
      });

      // Draw Enemy Lasers
      st.enemyLasers.forEach(el => {
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(el.x, el.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Enemies
      st.enemies.forEach(en => {
        ctx.save();
        ctx.translate(en.x, en.y);
        ctx.fillStyle = en.color;
        ctx.shadowColor = en.color;
        ctx.shadowBlur = 12;

        if (en.isBoss) {
          // Boss Ship
          ctx.beginPath();
          ctx.moveTo(0, en.radius);
          ctx.lineTo(-en.radius, -en.radius * 0.7);
          ctx.lineTo(0, -en.radius * 0.3);
          ctx.lineTo(en.radius, -en.radius * 0.7);
          ctx.closePath();
          ctx.fill();
          // Health Bar
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          ctx.fillRect(-en.radius, -en.radius - 12, en.radius * 2, 6);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(-en.radius, -en.radius - 12, (en.radius * 2) * (en.hp / en.maxHp), 6);
        } else {
          // Standard Alien Drone
          ctx.beginPath();
          ctx.moveTo(0, en.radius);
          ctx.lineTo(-en.radius, -en.radius * 0.8);
          ctx.lineTo(en.radius, -en.radius * 0.8);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      });

      // Draw Particles
      st.particles.forEach(pt => {
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, 3, 3);
      });

      // Draw Quantum Starfighter
      ctx.save();
      ctx.translate(pl.x, pl.y);

      // Shield Aura
      if (pl.shield) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(0, 0, pl.radius + 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Ship Body (Arrowhead fighter)
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(0, -pl.radius);
      ctx.lineTo(-pl.radius, pl.radius * 0.8);
      ctx.lineTo(0, pl.radius * 0.4);
      ctx.lineTo(pl.radius, pl.radius * 0.8);
      ctx.closePath();
      ctx.fill();

      // Cockpit
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, -4, 4, 0, Math.PI * 2);
      ctx.fill();

      // Thruster Flame
      ctx.fillStyle = '#fde047';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(-5, pl.radius * 0.5);
      ctx.lineTo(0, pl.radius * 0.5 + 10 + Math.random() * 6);
      ctx.lineTo(5, pl.radius * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, gameOver]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between bg-slate-950 p-2 sm:p-4 select-none">
      {/* Top HUD */}
      <div className="w-full max-w-2xl flex items-center justify-between p-3 rounded-2xl liquid-glass-pill border border-white/10 z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300">
            <Crosshair className="w-4 h-4" />
            <span>{score} PTS</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-yellow-300">
            <Coins className="w-4 h-4 fill-current text-yellow-400" />
            <span>+{vcoinsCollected} VC</span>
          </div>
        </div>

        {/* Health Bar */}
        <div className="flex items-center gap-2">
          <div className="w-24 sm:w-32 h-2.5 rounded-full bg-slate-800 overflow-hidden border border-white/10">
            <div
              className={`h-full transition-all duration-200 ${
                health > 50 ? 'bg-emerald-400' : health > 20 ? 'bg-yellow-400' : 'bg-rose-500'
              }`}
              style={{ width: `${health}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-white">{health}%</span>
        </div>
      </div>

      {/* Viewport Canvas */}
      <div
        className="relative w-full max-w-2xl flex-1 flex items-center justify-center my-2 rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-black touch-none"
        onPointerDown={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          stateRef.current.touchPos = {
            x: ((e.clientX - rect.left) / rect.width) * 640,
            y: ((e.clientY - rect.top) / rect.height) * 480
          };
        }}
        onPointerMove={(e) => {
          if (!stateRef.current.touchPos) return;
          const rect = e.currentTarget.getBoundingClientRect();
          stateRef.current.touchPos = {
            x: ((e.clientX - rect.left) / rect.width) * 640,
            y: ((e.clientY - rect.top) / rect.height) * 480
          };
        }}
        onPointerUp={() => {
          stateRef.current.touchPos = null;
        }}
      >
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-full object-cover"
        />

        {!isPlaying && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            {gameOver ? (
              <div className="space-y-4 max-w-sm">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-rose-500/20 text-rose-300 border border-rose-400/40">
                  VAISSEAU DÉTRUIT
                </span>
                <h3 className="text-2xl font-black text-white font-mono tracking-tight">MISSION ÉCHOUÉE</h3>
                <div className="p-4 rounded-2xl liquid-glass-card border border-white/10 space-y-1">
                  <div className="text-xs text-slate-400 font-mono">Score Défenseur</div>
                  <div className="text-3xl font-black text-cyan-300 font-mono">{score}</div>
                  <div className="text-xs text-yellow-400 font-mono pt-1">+{vcoinsCollected} V-Coins amassés</div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={startGame}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black font-mono text-xs uppercase cursor-pointer hover:from-emerald-400 hover:to-cyan-400 shadow-lg active:scale-95 transition-all"
                  >
                    Rejouer
                  </button>
                  {onExit && (
                    <button
                      onClick={onExit}
                      className="px-5 py-2.5 rounded-xl liquid-glass-pill text-slate-300 hover:text-white font-mono text-xs uppercase cursor-pointer"
                    >
                      Quitter
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-md">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  NOUVEAU JEU GRATUIT
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  COSMIC
                </h2>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Pilotez le chasseur stellaire quantique ! Repoussez les vagues d'envahisseurs et les boss titanesques, récupérez les boucliers et tirs triples pour battre le record !
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 py-2">
                  <div className="p-2 rounded-xl liquid-glass-pill">Flèches / WASD : Piloter</div>
                  <div className="p-2 rounded-xl liquid-glass-pill">Tactile : Glisser le doigt</div>
                  <div className="p-2 rounded-xl liquid-glass-pill">Tir automatique continu</div>
                  <div className="p-2 rounded-xl liquid-glass-pill">🟡 : +5 V-Coins</div>
                </div>

                <button
                  onClick={startGame}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider cursor-pointer hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] active:scale-95 transition-all flex items-center gap-2 mx-auto"
                >
                  <Play className="w-4 h-4 fill-current" /> Lancer la défense
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
