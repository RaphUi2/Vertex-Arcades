import React, { useState, useEffect, useRef } from 'react';
import { Shield, Trophy, RotateCcw, Zap, Sparkles, Skull, Crosshair, Award } from 'lucide-react';
import { audio } from '../utils/audio';

interface PixelSurvivorsProps {
  onScoreSubmit: (score: number) => void;
  onVCoinsEarned: (coins: number) => void;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  emoji: string;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Gem {
  id: number;
  x: number;
  y: number;
  xp: number;
}

export function PixelSurvivors({ onScoreSubmit, onVCoinsEarned }: PixelSurvivorsProps) {
  const [playerX, setPlayerX] = useState(300);
  const [playerY, setPlayerY] = useState(200);
  const [hp, setHp] = useState(100);
  const [maxHp, setMaxHp] = useState(100);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [xpNeeded, setXpNeeded] = useState(50);
  const [score, setScore] = useState(0);
  const [kills, setKills] = useState(0);
  const [timeSurvived, setTimeSurvived] = useState(0);
  const [weaponDamage, setWeaponDamage] = useState(25);
  const [fireRate, setFireRate] = useState(400); // ms between shots
  const [moveSpeed, setMoveSpeed] = useState(3.5);
  const [isLevelUp, setIsLevelUp] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const enemiesRef = useRef<Enemy[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const gemsRef = useRef<Gem[]>([]);
  const nextIdRef = useRef(1);
  const lastShotRef = useRef(0);
  const playerPosRef = useRef({ x: 300, y: 200 });

  // Sync ref
  playerPosRef.current = { x: playerX, y: playerY };

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let spawnTimer = 0;
    let secondTimer = 0;

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      if (!gameOver && !isLevelUp) {
        secondTimer += dt;
        if (secondTimer >= 1) {
          setTimeSurvived(t => t + 1);
          setScore(s => s + 20);
          secondTimer = 0;
        }

        // Movement
        let dx = 0;
        let dy = 0;
        if (keysRef.current['arrowleft'] || keysRef.current['a'] || keysRef.current['q']) dx -= 1;
        if (keysRef.current['arrowright'] || keysRef.current['d']) dx += 1;
        if (keysRef.current['arrowup'] || keysRef.current['w'] || keysRef.current['z']) dy -= 1;
        if (keysRef.current['arrowdown'] || keysRef.current['s']) dy += 1;

        if (dx !== 0 && dy !== 0) {
          dx *= 0.7071;
          dy *= 0.7071;
        }

        const newX = Math.max(20, Math.min(580, playerPosRef.current.x + dx * moveSpeed * 60 * dt));
        const newY = Math.max(20, Math.min(380, playerPosRef.current.y + dy * moveSpeed * 60 * dt));
        setPlayerX(newX);
        setPlayerY(newY);

        // Auto Shooting closest enemy
        if (currentTime - lastShotRef.current > fireRate) {
          lastShotRef.current = currentTime;
          let closestEnemy: Enemy | null = null;
          let minDist = 300; // max range

          for (const en of enemiesRef.current) {
            const dist = Math.hypot(en.x - newX, en.y - newY);
            if (dist < minDist) {
              minDist = dist;
              closestEnemy = en;
            }
          }

          if (closestEnemy) {
            const angle = Math.atan2(closestEnemy.y - newY, closestEnemy.x - newX);
            bulletsRef.current.push({
              id: nextIdRef.current++,
              x: newX,
              y: newY,
              vx: Math.cos(angle) * 360,
              vy: Math.sin(angle) * 360
            });
            audio.playLaser();
          }
        }

        // Update Bullets
        bulletsRef.current = bulletsRef.current
          .map(b => ({ ...b, x: b.x + b.vx * dt, y: b.y + b.vy * dt }))
          .filter(b => b.x >= 0 && b.x <= 600 && b.y >= 0 && b.y <= 400);

        // Spawn Enemies
        spawnTimer += dt;
        if (spawnTimer >= Math.max(0.4, 1.4 - level * 0.1)) {
          spawnTimer = 0;
          const side = Math.floor(Math.random() * 4);
          let ex = 0;
          let ey = 0;
          if (side === 0) { ex = Math.random() * 600; ey = -15; }
          else if (side === 1) { ex = 615; ey = Math.random() * 400; }
          else if (side === 2) { ex = Math.random() * 600; ey = 415; }
          else { ex = -15; ey = Math.random() * 400; }

          const isBoss = Math.random() < 0.15;
          enemiesRef.current.push({
            id: nextIdRef.current++,
            x: ex,
            y: ey,
            hp: isBoss ? 60 + level * 20 : 20 + level * 5,
            maxHp: isBoss ? 60 + level * 20 : 20 + level * 5,
            speed: isBoss ? 45 : 70 + Math.random() * 30,
            emoji: isBoss ? '👾' : Math.random() > 0.5 ? '🦇' : '🕷️'
          });
        }

        // Move Enemies towards player & bullet collision
        const updatedEnemies: Enemy[] = [];
        for (const en of enemiesRef.current) {
          const angle = Math.atan2(newY - en.y, newX - en.x);
          const ex = en.x + Math.cos(angle) * en.speed * dt;
          const ey = en.y + Math.sin(angle) * en.speed * dt;

          // Check collision with bullets
          let enemyHp = en.hp;
          for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
            const b = bulletsRef.current[i];
            if (Math.hypot(b.x - ex, b.y - ey) < 18) {
              enemyHp -= weaponDamage;
              bulletsRef.current.splice(i, 1);
              audio.playClick();
              if (enemyHp <= 0) break;
            }
          }

          // Check collision with player
          if (Math.hypot(ex - newX, ey - newY) < 20) {
            audio.playDamage();
            setHp(prev => {
              const next = prev - 15 * dt * 2.5;
              if (next <= 0) {
                setGameOver(true);
                audio.playGameOver();
              }
              return Math.max(0, next);
            });
          }

          if (enemyHp > 0) {
            updatedEnemies.push({ ...en, x: ex, y: ey, hp: enemyHp });
          } else {
            // Drop XP Gem
            gemsRef.current.push({
              id: nextIdRef.current++,
              x: ex,
              y: ey,
              xp: 15
            });
            setKills(k => k + 1);
            setScore(s => s + 50);
            onVCoinsEarned(1);
          }
        }
        enemiesRef.current = updatedEnemies;

        // Gem collection
        gemsRef.current = gemsRef.current.filter(gem => {
          const dist = Math.hypot(gem.x - newX, gem.y - newY);
          if (dist < 40) {
            audio.playWin();
            setXp(cur => {
              const nextXp = cur + gem.xp;
              if (nextXp >= xpNeeded) {
                setIsLevelUp(true);
                audio.playLevelUp();
                setLevel(l => l + 1);
                setXpNeeded(needed => Math.round(needed * 1.4));
                return 0;
              }
              return nextXp;
            });
            return false;
          }
          return true;
        });

        // Render to Canvas
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 600, 400);

          // Grid background
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.lineWidth = 1;
          for (let x = 0; x < 600; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 400);
            ctx.stroke();
          }
          for (let y = 0; y < 400; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(600, y);
            ctx.stroke();
          }

          // Draw Gems
          for (const gem of gemsRef.current) {
            ctx.fillStyle = '#06b6d4';
            ctx.shadowColor = '#22d3ee';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(gem.x, gem.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          // Draw Bullets
          for (const b of bulletsRef.current) {
            ctx.fillStyle = '#f43f5e';
            ctx.shadowColor = '#fb7185';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          // Draw Enemies
          ctx.font = '18px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          for (const en of enemiesRef.current) {
            ctx.fillText(en.emoji, en.x, en.y);
            // Mini HP bar above enemy
            const barW = 20;
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(en.x - barW / 2, en.y - 14, barW, 3);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(en.x - barW / 2, en.y - 14, (en.hp / en.maxHp) * barW, 3);
          }

          // Draw Player
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 16;
          ctx.font = '24px sans-serif';
          ctx.fillText('🧙‍♂️', newX, newY);
          ctx.shadowBlur = 0;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameOver, isLevelUp, level, xpNeeded, weaponDamage, fireRate, moveSpeed]);

  useEffect(() => {
    if (gameOver) {
      onScoreSubmit(score);
    }
  }, [gameOver]);

  const selectUpgrade = (type: 'damage' | 'speed' | 'heal' | 'rate') => {
    if (type === 'damage') setWeaponDamage(d => d + 15);
    if (type === 'speed') setMoveSpeed(s => s + 0.6);
    if (type === 'heal') setHp(maxHp);
    if (type === 'rate') setFireRate(r => Math.max(150, r - 50));
    setIsLevelUp(false);
  };

  const restart = () => {
    setPlayerX(300);
    setPlayerY(200);
    setHp(100);
    setLevel(1);
    setXp(0);
    setXpNeeded(50);
    setScore(0);
    setKills(0);
    setTimeSurvived(0);
    setWeaponDamage(25);
    setFireRate(400);
    setMoveSpeed(3.5);
    enemiesRef.current = [];
    bulletsRef.current = [];
    gemsRef.current = [];
    setGameOver(false);
    setIsLevelUp(false);
    audio.playStart();
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 bg-slate-950 text-white select-none overflow-hidden font-mono">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between z-20 px-4 py-2 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">SURVIE</span>
            <strong className="text-cyan-300 text-lg font-black">{timeSurvived}s</strong>
          </div>
          <div className="border-l border-white/10 pl-4">
            <span className="text-slate-400 block text-[10px]">MONSTRES VAINCUS</span>
            <strong className="text-rose-400 text-lg font-black">{kills} 💀</strong>
          </div>
          <div className="border-l border-white/10 pl-4">
            <span className="text-slate-400 block text-[10px]">SCORE</span>
            <strong className="text-yellow-400 text-lg font-black">{score.toLocaleString()}</strong>
          </div>
        </div>

        {/* Level & XP bar */}
        <div className="flex items-center gap-3">
          <div className="w-36">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-purple-300 font-bold">NIVEAU {level}</span>
              <span>{Math.round((xp / xpNeeded) * 100)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-200"
                style={{ width: `${(xp / xpNeeded) * 100}%` }}
              />
            </div>
          </div>

          <div className="w-28">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-emerald-400 font-bold">SANTÉ</span>
              <span>{Math.round(hp)} HP</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-200"
                style={{ width: `${(hp / maxHp) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="relative w-full flex-1 my-3 flex items-center justify-center rounded-3xl overflow-hidden border border-purple-500/30 bg-slate-900 shadow-[inset_0_0_80px_rgba(168,85,247,0.2)]">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full h-full max-w-[800px] max-h-[500px] object-contain"
        />

        {/* Level Up Selection Modal */}
        {isLevelUp && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xl flex flex-col items-center justify-center p-6 z-50 animate-fade-in">
            <Sparkles className="w-12 h-12 text-yellow-400 mb-2 animate-bounce" />
            <h3 className="text-xl font-black text-white font-mono mb-1">MONTÉE DE NIVEAU ! (Niv. {level})</h3>
            <p className="text-xs text-slate-300 mb-4">Choisissez un artefact d'amélioration :</p>

            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              <button
                onClick={() => selectUpgrade('damage')}
                className="p-3 rounded-2xl bg-purple-500/20 hover:bg-purple-500/40 border border-purple-400/50 flex flex-col items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <Zap className="w-6 h-6 text-purple-300" />
                <span className="text-xs font-black text-white">+ Dégâts Laser</span>
                <span className="text-[10px] text-slate-400">+15 puissance de tir</span>
              </button>

              <button
                onClick={() => selectUpgrade('rate')}
                className="p-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/40 border border-rose-400/50 flex flex-col items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <Crosshair className="w-6 h-6 text-rose-300" />
                <span className="text-xs font-black text-white">Cadence de Tir</span>
                <span className="text-[10px] text-slate-400">-50ms délai</span>
              </button>

              <button
                onClick={() => selectUpgrade('speed')}
                className="p-3 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/50 flex flex-col items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <Award className="w-6 h-6 text-cyan-300" />
                <span className="text-xs font-black text-white">Vitesse de Course</span>
                <span className="text-[10px] text-slate-400">+18% vélocité</span>
              </button>

              <button
                onClick={() => selectUpgrade('heal')}
                className="p-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-400/50 flex flex-col items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <Shield className="w-6 h-6 text-emerald-300" />
                <span className="text-xs font-black text-white">Soin Intégral</span>
                <span className="text-[10px] text-slate-400">Restaure 100% HP</span>
              </button>
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 z-50 text-center animate-fade-in">
            <Skull className="w-16 h-16 text-rose-500 mb-2 animate-bounce" />
            <h2 className="text-2xl font-black text-white font-mono tracking-wider">SUBMERGÉ PAR LA HORDE !</h2>
            <p className="text-slate-300 text-sm mt-1 mb-4">Votre mage a combattu jusqu'au dernier souffle.</p>
            
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 mb-6 w-full max-w-xs space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Temps de survie</span>
                <strong className="text-cyan-300">{timeSurvived} secondes</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Monstres éliminés</span>
                <strong className="text-rose-400">{kills}</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Score total</span>
                <strong className="text-yellow-400">{score.toLocaleString()}</strong>
              </div>
            </div>

            <button
              onClick={restart}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-rose-600 text-white font-black font-mono flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_25px_rgba(244,63,94,0.6)] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> RETENTER LA SURVIE
            </button>
          </div>
        )}
      </div>

      {/* Movement info */}
      <div className="w-full text-center text-xs text-slate-400 z-20">
        Déplacement : Touches Fléchées ou ZQSD • Tir Automatique sur les cibles proches
      </div>
    </div>
  );
}
