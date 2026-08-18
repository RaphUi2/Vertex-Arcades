import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy, Zap, Crosshair, Sparkles, Shield, Flame, Skull } from 'lucide-react';
import { audio } from '../utils/audio';

interface JurassicDinoHunterProps {
  onScore: (score: number) => void;
  onGameOver: (score: number) => void;
  onBack: () => void;
  highScore: number;
}

interface DinoTarget {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'raptor' | 'pterodactyl' | 'triceratops' | 'boss_spino';
  maxHp: number;
  hp: number;
  size: number;
  points: number;
  isHeadshotZone: (cx: number, cy: number) => boolean;
  hitTimer: number;
  attackTimer: number;
}

interface BulletImpact {
  x: number;
  y: number;
  color: string;
  size: number;
  isHeadshot: boolean;
  life: number;
}

export const JurassicDinoHunter: React.FC<JurassicDinoHunterProps> = ({
  onScore,
  onGameOver,
  onBack,
  highScore
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [ammo, setAmmo] = useState<number>(8);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [wave, setWave] = useState<number>(1);
  const [combo, setCombo] = useState<number>(0);
  const [isReloading, setIsReloading] = useState<boolean>(false);

  const crosshairRef = useRef({ x: 400, y: 200 });

  const stateRef = useRef({
    score: 0,
    ammo: 8,
    playerHp: 100,
    wave: 1,
    combo: 0,
    isReloading: false,
    dinos: [] as DinoTarget[],
    impacts: [] as BulletImpact[],
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; life: number }[],
    spawnTimer: 0,
    targetIdCounter: 1,
    isPlaying: false
  });

  const reloadAmmo = useCallback(() => {
    const s = stateRef.current;
    if (s.isReloading || s.ammo === 8) return;
    s.isReloading = true;
    setIsReloading(true);
    audio.playSwoosh();
    setTimeout(() => {
      s.ammo = 8;
      s.isReloading = false;
      setAmmo(8);
      setIsReloading(false);
      audio.playLaser();
    }, 700);
  }, []);

  const handleShoot = useCallback((x: number, y: number) => {
    const s = stateRef.current;
    if (!s.isPlaying || s.isReloading) return;

    if (s.ammo <= 0) {
      reloadAmmo();
      return;
    }

    s.ammo--;
    setAmmo(s.ammo);
    audio.playLaser();

    // Check target hits
    let hitSomething = false;
    for (let i = s.dinos.length - 1; i >= 0; i--) {
      const d = s.dinos[i];
      const dist = Math.hypot(x - d.x, y - d.y);

      if (dist < d.size) {
        hitSomething = true;
        const isHead = d.isHeadshotZone(x, y);
        const damage = isHead ? 2 : 1;
        d.hp -= damage;
        d.hitTimer = 10;

        // Visual Impact
        s.impacts.push({
          x,
          y,
          color: isHead ? '#facc15' : '#06b6d4',
          size: isHead ? 25 : 15,
          isHeadshot: isHead,
          life: 20
        });

        if (isHead) audio.playWin();

        // Blood / Spark Particles
        for (let p = 0; p < 8; p++) {
          s.particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            color: isHead ? '#facc15' : '#ef4444',
            life: 20
          });
        }

        if (d.hp <= 0) {
          // Dino Killed
          const basePts = d.points * (isHead ? 2 : 1);
          s.score += basePts + s.combo * 20;
          s.combo++;
          setScore(s.score);
          setCombo(s.combo);
          onScore(s.score);
          audio.playPixelScore();
          s.dinos.splice(i, 1);
        }
        break; // Only hit front target
      }
    }

    if (!hitSomething) {
      s.combo = 0;
      setCombo(0);
      s.impacts.push({
        x,
        y,
        color: '#64748b',
        size: 8,
        isHeadshot: false,
        life: 15
      });
    }

    if (s.ammo === 0) {
      reloadAmmo();
    }
  }, [onScore, reloadAmmo]);

  // Pointer Movement and Shooting
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 400 / rect.height;
    crosshairRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 400 / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;
    handleShoot(clickX, clickY);
  };

  // Keyboard R for Reload
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        reloadAmmo();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [reloadAmmo]);

  const startGame = () => {
    stateRef.current = {
      score: 0,
      ammo: 8,
      playerHp: 100,
      wave: 1,
      combo: 0,
      isReloading: false,
      dinos: [],
      impacts: [],
      particles: [],
      spawnTimer: 0,
      targetIdCounter: 1,
      isPlaying: true
    };

    setScore(0);
    setAmmo(8);
    setPlayerHp(100);
    setWave(1);
    setCombo(0);
    setIsReloading(false);
    setIsGameOver(false);
    setIsPlaying(true);
    audio.playStart();
  };

  // Main Animation Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const s = stateRef.current;

      if (s.isPlaying) {
        // Spawning logic
        s.spawnTimer--;
        if (s.spawnTimer <= 0) {
          s.spawnTimer = Math.max(40, 90 - s.wave * 8);

          const rnd = Math.random();
          const fromLeft = Math.random() > 0.5;
          const startX = fromLeft ? -40 : 840;
          const speed = (fromLeft ? 1 : -1) * (2.2 + Math.random() * 2 + s.wave * 0.3);

          if (s.score > 2000 && s.dinos.filter(d => d.type === 'boss_spino').length === 0 && Math.random() < 0.2) {
            // Mega Spinosaurus Boss
            s.dinos.push({
              id: s.targetIdCounter++,
              x: 400,
              y: 160,
              vx: speed * 0.5,
              vy: 0,
              type: 'boss_spino',
              maxHp: 12,
              hp: 12,
              size: 55,
              points: 1000,
              isHeadshotZone: (cx, cy) => Math.hypot(cx - 400, cy - 130) < 22,
              hitTimer: 0,
              attackTimer: 120
            });
          } else if (rnd < 0.4) {
            // Flying Pterodactyl
            s.dinos.push({
              id: s.targetIdCounter++,
              x: startX,
              y: 80 + Math.random() * 70,
              vx: speed * 1.3,
              vy: Math.sin(Date.now() / 200) * 0.8,
              type: 'pterodactyl',
              maxHp: 1,
              hp: 1,
              size: 28,
              points: 150,
              isHeadshotZone: (cx, cy) => cy < 110,
              hitTimer: 0,
              attackTimer: 180
            });
          } else if (rnd < 0.8) {
            // Fast Cyber Raptor
            s.dinos.push({
              id: s.targetIdCounter++,
              x: startX,
              y: 260 + Math.random() * 50,
              vx: speed * 1.5,
              vy: 0,
              type: 'raptor',
              maxHp: 2,
              hp: 2,
              size: 34,
              points: 200,
              isHeadshotZone: (cx, cy) => cy < 250,
              hitTimer: 0,
              attackTimer: 140
            });
          } else {
            // Armored Triceratops
            s.dinos.push({
              id: s.targetIdCounter++,
              x: startX,
              y: 280,
              vx: speed * 0.9,
              vy: 0,
              type: 'triceratops',
              maxHp: 4,
              hp: 4,
              size: 42,
              points: 350,
              isHeadshotZone: (cx, cy) => Math.abs(cx - startX) < 15,
              hitTimer: 0,
              attackTimer: 200
            });
          }
        }

        // Update dinos
        for (let i = s.dinos.length - 1; i >= 0; i--) {
          const d = s.dinos[i];
          d.x += d.vx;
          d.y += d.vy;
          if (d.hitTimer > 0) d.hitTimer--;

          // Attack countdown
          d.attackTimer--;
          if (d.attackTimer <= 0) {
            d.attackTimer = 150;
            s.playerHp -= d.type === 'boss_spino' ? 25 : 10;
            setPlayerHp(Math.max(0, s.playerHp));
            audio.playHit();

            if (s.playerHp <= 0) {
              s.isPlaying = false;
              setIsPlaying(false);
              setIsGameOver(true);
              audio.playGameOver();
              onGameOver(s.score);
              break;
            }
          }

          // Offscreen
          if (d.x < -70 || d.x > 870) {
            s.dinos.splice(i, 1);
          }
        }

        // Update impacts
        for (let i = s.impacts.length - 1; i >= 0; i--) {
          const imp = s.impacts[i];
          imp.life--;
          if (imp.life <= 0) s.impacts.splice(i, 1);
        }

        // Update particles
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const pt = s.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life--;
          if (pt.life <= 0) s.particles.splice(i, 1);
        }
      }

      // RENDER
      ctx.clearRect(0, 0, 800, 400);

      // 1. Jurassic Prehistoric Jungle Backdrop
      const jungleGrad = ctx.createLinearGradient(0, 0, 0, 400);
      jungleGrad.addColorStop(0, '#022c22');
      jungleGrad.addColorStop(0.5, '#064e3b');
      jungleGrad.addColorStop(1, '#020617');
      ctx.fillStyle = jungleGrad;
      ctx.fillRect(0, 0, 800, 400);

      // Neon Prehistoric Foliage & Canopy
      ctx.fillStyle = '#065f46';
      for (let tx = 0; tx < 800; tx += 90) {
        ctx.beginPath();
        ctx.arc(tx + 45, 0, 70, 0, Math.PI);
        ctx.fill();
      }

      // Volcanic Amber Horizon
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.moveTo(0, 240);
      ctx.lineTo(200, 180);
      ctx.lineTo(400, 230);
      ctx.lineTo(600, 170);
      ctx.lineTo(800, 240);
      ctx.lineTo(800, 400);
      ctx.lineTo(0, 400);
      ctx.fill();

      // Ground Fog
      ctx.fillStyle = 'rgba(6,182,212,0.1)';
      ctx.fillRect(0, 300, 800, 100);

      // 2. Draw Dinosaurs
      for (const d of s.dinos) {
        ctx.save();
        const isHit = d.hitTimer > 0;

        if (d.type === 'pterodactyl') {
          ctx.fillStyle = isHit ? '#ffffff' : '#38bdf8';
          ctx.shadowColor = '#0284c7';
          ctx.shadowBlur = 15;
          const wing = Math.sin(Date.now() / 80) * 14;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - 20, d.y - wing);
          ctx.lineTo(d.x + 25, d.y);
          ctx.lineTo(d.x - 20, d.y + wing);
          ctx.closePath();
          ctx.fill();
        } else if (d.type === 'raptor') {
          ctx.fillStyle = isHit ? '#ffffff' : '#f59e0b';
          ctx.shadowColor = '#d97706';
          ctx.shadowBlur = 15;
          // Body & Head
          ctx.fillRect(d.x - 20, d.y - 15, 40, 24);
          ctx.fillRect(d.x + (d.vx > 0 ? 12 : -24), d.y - 28, 22, 16);
          // Red visor
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(d.x + (d.vx > 0 ? 22 : -22), d.y - 25, 6, 4);
        } else if (d.type === 'triceratops') {
          ctx.fillStyle = isHit ? '#ffffff' : '#10b981';
          ctx.shadowColor = '#059669';
          ctx.shadowBlur = 15;
          // Heavy armored plate
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.size / 1.5, 0, Math.PI * 2);
          ctx.fill();
          // Horns
          ctx.fillStyle = '#facc15';
          ctx.fillRect(d.x + (d.vx > 0 ? 20 : -28), d.y - 18, 14, 6);
        } else {
          // Boss Spinosaurus
          ctx.fillStyle = isHit ? '#ffffff' : '#ec4899';
          ctx.shadowColor = '#db2777';
          ctx.shadowBlur = 25;
          // Massive Sail
          ctx.beginPath();
          ctx.arc(d.x, d.y - 15, 45, Math.PI, Math.PI * 2);
          ctx.fill();
          // Head & Jaws
          ctx.fillStyle = '#be185d';
          ctx.fillRect(d.x - 30, d.y, 60, 30);
          ctx.fillRect(d.x + 10, d.y - 25, 40, 25);
        }

        // HP bar above dino
        const barW = d.size * 1.2;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(d.x - barW / 2, d.y - d.size - 10, barW, 5);
        ctx.fillStyle = d.hp > d.maxHp / 2 ? '#22c55e' : '#ef4444';
        ctx.fillRect(d.x - barW / 2, d.y - d.size - 10, (d.hp / d.maxHp) * barW, 5);
        ctx.restore();
      }

      // 3. Draw Impacts
      for (const imp of s.impacts) {
        ctx.save();
        ctx.strokeStyle = imp.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = imp.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(imp.x, imp.y, imp.size, 0, Math.PI * 2);
        ctx.stroke();

        if (imp.isHeadshot) {
          ctx.fillStyle = '#facc15';
          ctx.font = 'bold 12px monospace';
          ctx.fillText('CRIT HEADSHOT!', imp.x - 35, imp.y - 15);
        }
        ctx.restore();
      }

      // 4. Draw Particles
      for (const pt of s.particles) {
        ctx.fillStyle = pt.color;
        ctx.fillRect(pt.x, pt.y, 3, 3);
      }

      // 5. Draw Crosshair
      const ch = crosshairRef.current;
      ctx.save();
      ctx.strokeStyle = s.isReloading ? '#ef4444' : '#06b6d4';
      ctx.lineWidth = 2;
      ctx.shadowColor = s.isReloading ? '#ef4444' : '#06b6d4';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(ch.x, ch.y, 16, 0, Math.PI * 2);
      ctx.moveTo(ch.x - 24, ch.y);
      ctx.lineTo(ch.x + 24, ch.y);
      ctx.moveTo(ch.x, ch.y - 24);
      ctx.lineTo(ch.x, ch.y + 24);
      ctx.stroke();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [onScore, onGameOver]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center select-none font-mono">
      {/* Top Header */}
      <div className="w-full flex justify-between items-center mb-3 px-2">
        <button
          onClick={() => { audio.playClick(); onBack(); }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
        >
          <ArrowLeft size={16} /> RETOUR
        </button>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded-xl text-amber-300 text-xs font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Trophy size={14} className="text-yellow-400" />
            <span>RECORD: {highScore}</span>
          </div>

          <div className="px-3 py-1 bg-rose-950 border border-rose-500/80 rounded-xl text-rose-300 text-xs font-black flex items-center gap-1.5">
            <span>PV: {playerHp}%</span>
          </div>
        </div>
      </div>

      {/* Screen Frame */}
      <div className="relative w-full aspect-[800/400] bg-slate-950 rounded-3xl border-2 border-amber-500/80 shadow-[0_0_50px_rgba(245,158,11,0.35)] overflow-hidden cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          className="w-full h-full block"
        />

        {/* Live In-Game HUD */}
        {isPlaying && (
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
            {/* Score */}
            <div className="bg-slate-950/80 backdrop-blur border border-amber-500/60 px-4 py-2 rounded-2xl">
              <span className="text-[9px] text-amber-400 font-black tracking-widest block uppercase">SCORE CHASSE</span>
              <span className="text-2xl font-black text-white">{score}</span>
              {combo > 1 && <span className="text-xs text-rose-400 font-black ml-2">COMBO x{combo}</span>}
            </div>

            {/* Laser Ammo Clip */}
            <div className="bg-slate-950/80 backdrop-blur border border-cyan-500/60 px-4 py-2 rounded-2xl flex flex-col items-end">
              <span className="text-[9px] text-cyan-400 font-black tracking-widest block uppercase">CHARGEUR LASER (R)</span>
              <div className="flex gap-1 mt-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-6 rounded-sm border ${
                      i < ammo
                        ? 'bg-cyan-400 border-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                        : 'bg-slate-800 border-slate-700'
                    }`}
                  />
                ))}
              </div>
              {isReloading && (
                <span className="text-[10px] text-yellow-400 font-black animate-pulse mt-1">RECHARGEMENT EN COURS...</span>
              )}
            </div>
          </div>
        )}

        {/* Overlay start/game over */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center max-w-md"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center text-rose-300 text-3xl mb-3 shadow-[0_0_30px_rgba(244,63,94,0.6)]">
                🎯
              </div>

              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-yellow-300 uppercase tracking-wider mb-1">
                {isGameOver ? 'MISSION ÉCHOUÉE !' : 'JURASSIC DINO HUNTER'}
              </h2>

              <p className="text-xs text-slate-300 font-sans mb-4">
                {isGameOver
                  ? `Vous avez éliminé les menaces cybernétiques avec un score de ${score} PTS !`
                  : 'Visez les Cyber-Dinos, effectuez des tirs critiques à la tête et rechargez avec R ou le bouton !'}
              </p>

              <button
                onClick={startGame}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.6)] transition transform hover:scale-105 cursor-pointer flex items-center gap-2"
              >
                <Zap size={18} /> {isGameOver ? 'REJOUER LE CHASSEUR' : 'COMMENCER LA CHASSE'}
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Manual Reload Button below screen */}
      <div className="w-full flex justify-between items-center mt-3">
        <span className="text-xs text-slate-400">
          💡 Visez avec la souris / l'écran tactile. Cliquez ou touchez pour faire feu.
        </span>

        <button
          onClick={reloadAmmo}
          disabled={ammo === 8 || isReloading}
          className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase flex items-center gap-1.5 transition cursor-pointer ${
            ammo < 8 && !isReloading
              ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          🔄 RECHARGER (R)
        </button>
      </div>
    </div>
  );
};

export default JurassicDinoHunter;
