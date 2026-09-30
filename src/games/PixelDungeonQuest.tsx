import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Swords, Flame, Heart, Coins, Shield, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { audio } from '../utils/audio';

interface PixelDungeonProps {
  onScoreSubmit?: (score: number) => void;
  onVCoinsEarned?: (vcoins: number) => void;
  onExit?: () => void;
}

export function PixelDungeonQuest({ onScoreSubmit, onVCoinsEarned, onExit }: PixelDungeonProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [score, setScore] = useState(0);
  const [floor, setFloor] = useState(1);
  const [health, setHealth] = useState(100);
  const [vcoinsEarned, setVcoinsEarned] = useState(0);

  const stateRef = useRef({
    hero: {
      x: 320,
      y: 240,
      hp: 100,
      maxHp: 100,
      speed: 4,
      facing: 'down' as 'up' | 'down' | 'left' | 'right',
      attackCooldown: 0,
      mana: 100,
      maxMana: 100
    },
    monsters: [] as Array<{
      id: number;
      x: number;
      y: number;
      hp: number;
      maxHp: number;
      type: 'slime' | 'skeleton' | 'boss';
      speed: number;
      color: string;
      radius: number;
    }>,
    chests: [] as Array<{ x: number; y: number; opened: boolean; vcoins: number }>,
    stairs: { x: 560, y: 80, active: true },
    fireballs: [] as Array<{ x: number; y: number; vx: number; vy: number; life: number }>,
    slashes: [] as Array<{ x: number; y: number; dir: string; life: number }>,
    particles: [] as Array<{ x: number; y: number; vx: number; vy: number; color: string; life: number }>,
    keys: {} as Record<string, boolean>,
    score: 0,
    vcoins: 0,
    floor: 1
  });

  const generateFloor = (floorNum: number) => {
    const st = stateRef.current;
    st.floor = floorNum;
    setFloor(floorNum);
    st.hero.x = 80;
    st.hero.y = 400;

    st.monsters = [];
    st.chests = [];
    st.stairs = { x: 560, y: 80, active: true };

    // Spawn Chests
    for (let i = 0; i < 3; i++) {
      st.chests.push({
        x: 180 + Math.random() * 300,
        y: 120 + Math.random() * 260,
        opened: false,
        vcoins: 10 + floorNum * 5
      });
    }

    // Spawn Monsters
    const count = 5 + floorNum * 3;
    for (let i = 0; i < count; i++) {
      const isSkel = Math.random() > 0.4;
      st.monsters.push({
        id: Math.random(),
        x: 200 + Math.random() * 380,
        y: 80 + Math.random() * 320,
        hp: isSkel ? 50 : 30,
        maxHp: isSkel ? 50 : 30,
        type: isSkel ? 'skeleton' : 'slime',
        speed: isSkel ? 1.8 : 1.2,
        color: isSkel ? '#e2e8f0' : '#10b981',
        radius: isSkel ? 16 : 14
      });
    }

    // Floor 3 is the Boss Floor!
    if (floorNum === 3) {
      st.monsters.push({
        id: 999,
        x: 480,
        y: 140,
        hp: 350,
        maxHp: 350,
        type: 'boss',
        speed: 1.5,
        color: '#f43f5e',
        radius: 32
      });
    }
  };

  const startGame = () => {
    audio.playLevelUp();
    stateRef.current.score = 0;
    stateRef.current.vcoins = 0;
    stateRef.current.hero.hp = 100;
    stateRef.current.hero.mana = 100;
    setScore(0);
    setVcoinsEarned(0);
    setHealth(100);
    setGameOver(false);
    setIsVictory(false);
    generateFloor(1);
    setIsPlaying(true);
  };

  const attackSword = () => {
    const st = stateRef.current;
    if (st.hero.attackCooldown > 0) return;
    audio.playLaser();
    st.hero.attackCooldown = 15;

    let sx = st.hero.x;
    let sy = st.hero.y;
    if (st.hero.facing === 'right') sx += 28;
    else if (st.hero.facing === 'left') sx -= 28;
    else if (st.hero.facing === 'up') sy -= 28;
    else sy += 28;

    st.slashes.push({ x: sx, y: sy, dir: st.hero.facing, life: 10 });

    // Check hit monsters
    st.monsters.forEach(m => {
      const dist = Math.hypot(m.x - sx, m.y - sy);
      if (dist < m.radius + 28) {
        audio.playHit();
        m.hp -= 35;
        // Blood/hit sparks
        for (let p = 0; p < 6; p++) {
          st.particles.push({
            x: m.x,
            y: m.y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            color: m.color,
            life: 15
          });
        }
      }
    });
  };

  const castFireball = () => {
    const st = stateRef.current;
    if (st.hero.mana < 25) return;
    audio.playWin();
    st.hero.mana -= 25;

    let vx = 0;
    let vy = 0;
    if (st.hero.facing === 'right') vx = 9;
    else if (st.hero.facing === 'left') vx = -9;
    else if (st.hero.facing === 'up') vy = -9;
    else vy = 9;

    st.fireballs.push({ x: st.hero.x, y: st.hero.y, vx, vy, life: 60 });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      stateRef.current.keys[e.code] = true;
      if (e.code === 'Space') {
        e.preventDefault();
        attackSword();
      } else if (e.code === 'KeyF' || e.code === 'KeyE') {
        e.preventDefault();
        castFireball();
      }
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

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const st = stateRef.current;
      const hro = st.hero;

      // 1. Draw Ancient Stone Dungeon Floor & Walls
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Floor tiles
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 32; x < w - 32; x += 32) {
        for (let y = 32; y < h - 32; y += 32) {
          ctx.strokeRect(x, y, 32, 32);
        }
      }

      // Dungeon Outer Walls
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, w, 32);
      ctx.fillRect(0, h - 32, w, 32);
      ctx.fillRect(0, 0, 32, h);
      ctx.fillRect(w - 32, 0, 32, h);

      // Neon Wall Trim
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(32, 32, w - 64, h - 64);

      if (isPlaying && !gameOver && !isVictory) {
        // Hero Movement
        const keys = st.keys;
        let dx = 0;
        let dy = 0;
        if (keys['ArrowLeft'] || keys['KeyA']) { dx -= 1; hro.facing = 'left'; }
        if (keys['ArrowRight'] || keys['KeyD']) { dx += 1; hro.facing = 'right'; }
        if (keys['ArrowUp'] || keys['KeyW']) { dy -= 1; hro.facing = 'up'; }
        if (keys['ArrowDown'] || keys['KeyS']) { dy += 1; hro.facing = 'down'; }

        if (dx !== 0 && dy !== 0) {
          dx *= 0.707;
          dy *= 0.707;
        }

        hro.x += dx * hro.speed;
        hro.y += dy * hro.speed;

        // Keep inside dungeon room bounds
        hro.x = Math.max(50, Math.min(w - 50, hro.x));
        hro.y = Math.max(50, Math.min(h - 50, hro.y));

        if (hro.attackCooldown > 0) hro.attackCooldown--;
        if (hro.mana < hro.maxMana) hro.mana = Math.min(hro.maxMana, hro.mana + 0.15);

        // Update Fireballs
        for (let i = st.fireballs.length - 1; i >= 0; i--) {
          const fb = st.fireballs[i];
          fb.x += fb.vx;
          fb.y += fb.vy;
          fb.life--;

          // Check monster hit
          for (let m = st.monsters.length - 1; m >= 0; m--) {
            const mon = st.monsters[m];
            if (Math.hypot(mon.x - fb.x, mon.y - fb.y) < mon.radius + 10) {
              audio.playHit();
              mon.hp -= 60;
              fb.life = 0;
              break;
            }
          }

          if (fb.life <= 0 || fb.x < 32 || fb.x > w - 32 || fb.y < 32 || fb.y > h - 32) {
            st.fireballs.splice(i, 1);
          }
        }

        // Update Slashes
        for (let i = st.slashes.length - 1; i >= 0; i--) {
          st.slashes[i].life--;
          if (st.slashes[i].life <= 0) st.slashes.splice(i, 1);
        }

        // Update Monsters
        for (let i = st.monsters.length - 1; i >= 0; i--) {
          const mon = st.monsters[i];

          // Monster AI: Hunt hero
          const angle = Math.atan2(hro.y - mon.y, hro.x - mon.x);
          mon.x += Math.cos(angle) * mon.speed;
          mon.y += Math.sin(angle) * mon.speed;

          // Attack hero on contact
          const distToHero = Math.hypot(mon.x - hro.x, mon.y - hro.y);
          if (distToHero < mon.radius + 15) {
            hro.hp -= mon.type === 'boss' ? 0.8 : 0.4;
            setHealth(Math.max(0, Math.floor(hro.hp)));
            if (hro.hp <= 0) {
              audio.playHit();
              setGameOver(true);
              setIsPlaying(false);
              if (onScoreSubmit) onScoreSubmit(st.score);
            }
          }

          // Monster Death
          if (mon.hp <= 0) {
            audio.playCoin();
            st.score += mon.type === 'boss' ? 1000 : 100;
            setScore(st.score);

            if (mon.type === 'boss') {
              // VICTORY!
              audio.playWin();
              setIsVictory(true);
              setIsPlaying(false);
              if (onScoreSubmit) onScoreSubmit(st.score + 2000);
              if (onVCoinsEarned) onVCoinsEarned(50);
            }

            st.monsters.splice(i, 1);
          }
        }

        // Check Chests
        st.chests.forEach(ch => {
          if (!ch.opened && Math.hypot(ch.x - hro.x, ch.y - hro.y) < 28) {
            ch.opened = true;
            audio.playWin();
            st.vcoins += ch.vcoins;
            st.score += 200;
            setScore(st.score);
            setVcoinsEarned(st.vcoins);
            if (onVCoinsEarned) onVCoinsEarned(ch.vcoins);
            hro.hp = Math.min(hro.maxHp, hro.hp + 25);
            setHealth(Math.floor(hro.hp));
          }
        });

        // Check Stairs to next floor
        if (Math.hypot(st.stairs.x - hro.x, st.stairs.y - hro.y) < 32 && st.monsters.length === 0) {
          audio.playLevelUp();
          if (st.floor < 3) {
            generateFloor(st.floor + 1);
          } else {
            setIsVictory(true);
            setIsPlaying(false);
            if (onScoreSubmit) onScoreSubmit(st.score + 1500);
          }
        }
      }

      // Draw Stairs
      ctx.fillStyle = st.monsters.length === 0 ? '#38bdf8' : '#475569';
      ctx.shadowColor = st.monsters.length === 0 ? '#38bdf8' : 'transparent';
      ctx.shadowBlur = 10;
      ctx.fillRect(st.stairs.x - 18, st.stairs.y - 18, 36, 36);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(st.stairs.x - 12, st.stairs.y - 12, 24, 24);
      ctx.shadowBlur = 0;

      // Draw Chests
      st.chests.forEach(ch => {
        ctx.fillStyle = ch.opened ? '#475569' : '#eab308';
        ctx.shadowColor = ch.opened ? 'transparent' : '#eab308';
        ctx.shadowBlur = ch.opened ? 0 : 10;
        ctx.fillRect(ch.x - 12, ch.y - 10, 24, 20);
        ctx.shadowBlur = 0;
      });

      // Draw Fireballs
      st.fireballs.forEach(fb => {
        ctx.fillStyle = '#f97316';
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(fb.x, fb.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Sword Slashes
      st.slashes.forEach(sl => {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(sl.x, sl.y, 22, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw Monsters
      st.monsters.forEach(mon => {
        ctx.fillStyle = mon.color;
        ctx.shadowColor = mon.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(mon.x, mon.y, mon.radius, 0, Math.PI * 2);
        ctx.fill();

        // Monster Health Bar
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(mon.x - 16, mon.y - mon.radius - 8, 32, 4);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(mon.x - 16, mon.y - mon.radius - 8, 32 * (mon.hp / mon.maxHp), 4);
        ctx.shadowBlur = 0;
      });

      // Draw Hero
      ctx.save();
      ctx.translate(hro.x, hro.y);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.fillRect(-4, -4, 8, 8); // Golden shield emblem
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, gameOver, isVictory]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between bg-slate-950 p-2 sm:p-4 select-none">
      {/* Top HUD */}
      <div className="w-full max-w-2xl flex items-center justify-between p-3 rounded-2xl liquid-glass-pill border border-white/10 z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
            ÉTAGE {floor} / 3
          </span>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-yellow-300">
            <Coins className="w-4 h-4 fill-current text-yellow-400" />
            <span>+{vcoinsEarned} VC</span>
          </div>
        </div>

        {/* Health Indicator */}
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          <div className="w-24 sm:w-28 h-2.5 rounded-full bg-slate-800 overflow-hidden border border-white/10">
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

      {/* Canvas Viewport */}
      <div className="relative w-full max-w-2xl flex-1 flex items-center justify-center my-2 rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-black">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-full object-cover"
        />

        {!isPlaying && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            {isVictory ? (
              <div className="space-y-4 max-w-sm">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  DONJON PURIFIÉ !
                </span>
                <h3 className="text-2xl font-black text-white font-mono tracking-tight">VICTOIRE GLORIEUSE</h3>
                <p className="text-xs text-slate-300">
                  Le Maître du Donjon a été terrassé et tous les trésors ont été pillés !
                </p>
                <div className="p-4 rounded-2xl liquid-glass-card border border-white/10 space-y-1">
                  <div className="text-xs text-slate-400 font-mono">Score Final</div>
                  <div className="text-3xl font-black text-yellow-300 font-mono">{score}</div>
                  <div className="text-xs text-yellow-400 font-mono pt-1">+{vcoinsEarned} V-Coins empochés</div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={startGame}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black font-mono text-xs uppercase cursor-pointer hover:from-emerald-400 hover:to-cyan-400 shadow-lg active:scale-95 transition-all"
                  >
                    Nouvelle Partie
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
            ) : gameOver ? (
              <div className="space-y-4 max-w-sm">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-rose-500/20 text-rose-300 border border-rose-400/40">
                  HÉROS DÉFAIT
                </span>
                <h3 className="text-2xl font-black text-white font-mono tracking-tight">GAME OVER</h3>
                <div className="p-4 rounded-2xl liquid-glass-card border border-white/10 space-y-1">
                  <div className="text-xs text-slate-400 font-mono">Score Atteint</div>
                  <div className="text-3xl font-black text-rose-400 font-mono">{score}</div>
                  <div className="text-xs text-yellow-400 font-mono pt-1">+{vcoinsEarned} V-Coins amassés</div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={startGame}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black font-mono text-xs uppercase cursor-pointer hover:from-emerald-400 hover:to-cyan-400 shadow-lg active:scale-95 transition-all"
                  >
                    Réessayer
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
                  DUNGEON
                </h2>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Explorez les 3 étages de donjons antiques, terrassez les monstres au corps à corps ou à distance avec vos boules de feu, pillez les coffres au trésor et terrasez le Boss !
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 py-2">
                  <div className="p-2 rounded-xl liquid-glass-pill">WASD / Flèches : Se déplacer</div>
                  <div className="p-2 rounded-xl liquid-glass-pill">Espace : Épée</div>
                  <div className="p-2 rounded-xl liquid-glass-pill">F ou E : Boule de Feu</div>
                  <div className="p-2 rounded-xl liquid-glass-pill">Coffres : Soin + V-Coins</div>
                </div>

                <button
                  onClick={startGame}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider cursor-pointer hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] active:scale-95 transition-all flex items-center gap-2 mx-auto"
                >
                  <Play className="w-4 h-4 fill-current" /> Entrer dans le donjon
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons & Mobile D-Pad */}
      <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-3 p-2">
        {/* Mobile Touch D-Pad */}
        <div className="flex items-center gap-1.5 sm:hidden">
          <button
            onPointerDown={(e) => { e.preventDefault(); stateRef.current.keys['ArrowLeft'] = true; }}
            onPointerUp={(e) => { e.preventDefault(); stateRef.current.keys['ArrowLeft'] = false; }}
            onPointerCancel={() => { stateRef.current.keys['ArrowLeft'] = false; }}
            className="w-11 h-11 rounded-xl liquid-glass-pill flex items-center justify-center text-cyan-300 active:scale-90 select-none shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col gap-1.5">
            <button
              onPointerDown={(e) => { e.preventDefault(); stateRef.current.keys['ArrowUp'] = true; }}
              onPointerUp={(e) => { e.preventDefault(); stateRef.current.keys['ArrowUp'] = false; }}
              onPointerCancel={() => { stateRef.current.keys['ArrowUp'] = false; }}
              className="w-11 h-11 rounded-xl liquid-glass-pill flex items-center justify-center text-cyan-300 active:scale-90 select-none shadow-md"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <button
              onPointerDown={(e) => { e.preventDefault(); stateRef.current.keys['ArrowDown'] = true; }}
              onPointerUp={(e) => { e.preventDefault(); stateRef.current.keys['ArrowDown'] = false; }}
              onPointerCancel={() => { stateRef.current.keys['ArrowDown'] = false; }}
              className="w-11 h-11 rounded-xl liquid-glass-pill flex items-center justify-center text-cyan-300 active:scale-90 select-none shadow-md"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>
          <button
            onPointerDown={(e) => { e.preventDefault(); stateRef.current.keys['ArrowRight'] = true; }}
            onPointerUp={(e) => { e.preventDefault(); stateRef.current.keys['ArrowRight'] = false; }}
            onPointerCancel={() => { stateRef.current.keys['ArrowRight'] = false; }}
            className="w-11 h-11 rounded-xl liquid-glass-pill flex items-center justify-center text-cyan-300 active:scale-90 select-none shadow-md"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400 hidden sm:block">
          Direction : WASD / Flèches
        </div>

        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={attackSword}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-md select-none"
          >
            <Swords className="w-4 h-4" /> ÉPÉE
          </button>
          <button
            onClick={castFireball}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-md select-none"
          >
            <Flame className="w-4 h-4" /> FEU
          </button>
        </div>
      </div>
    </div>
  );
}
