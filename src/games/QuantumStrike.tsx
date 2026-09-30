import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Target, Zap, Shield, Coins, Crosshair } from 'lucide-react';
import { audio } from '../utils/audio';

interface QuantumStrikeProps {
  onScoreSubmit?: (score: number) => void;
  onVCoinsEarned?: (vcoins: number) => void;
  onExit?: () => void;
}

interface TargetEntity {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  type: 'core' | 'rapid' | 'gold' | 'hazard' | 'boss';
  points: number;
  vcoins: number;
  hp: number;
  maxHp: number;
  life: number;
  maxLife: number;
  pulseSpeed: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  life: number;
}

export function QuantumStrike({ onScoreSubmit, onVCoinsEarned, onExit }: QuantumStrikeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [vcoinsEarned, setVcoinsEarned] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [combo, setCombo] = useState(1);
  const [wave, setWave] = useState(1);

  const stateRef = useRef({
    crosshair: { x: 320, y: 240 },
    targets: [] as TargetEntity[],
    particles: [] as Particle[],
    beams: [] as Array<{ x1: number; y1: number; x2: number; y2: number; life: number; color: string }>,
    score: 0,
    vcoins: 0,
    energy: 100,
    combo: 1,
    comboTimer: 0,
    wave: 1,
    targetCounter: 0,
    nextSpawn: 0,
    waveTimer: 0,
    keys: {} as Record<string, boolean>
  });

  const startGame = () => {
    audio.playLevelUp();
    stateRef.current.crosshair = { x: 320, y: 240 };
    stateRef.current.targets = [];
    stateRef.current.particles = [];
    stateRef.current.beams = [];
    stateRef.current.score = 0;
    stateRef.current.vcoins = 0;
    stateRef.current.energy = 100;
    stateRef.current.combo = 1;
    stateRef.current.comboTimer = 0;
    stateRef.current.wave = 1;
    stateRef.current.targetCounter = 0;
    stateRef.current.nextSpawn = 20;
    stateRef.current.waveTimer = 0;

    setScore(0);
    setVcoinsEarned(0);
    setEnergy(100);
    setCombo(1);
    setWave(1);
    setGameOver(false);
    setIsPlaying(true);
  };

  const fireBeam = (targetX: number, targetY: number) => {
    if (!isPlaying) return;
    const st = stateRef.current;
    if (st.energy < 8) return; // Not enough energy

    audio.playLaser();
    st.energy = Math.max(0, st.energy - 6);
    setEnergy(Math.round(st.energy));

    // Beam effect from bottom center to crosshair
    st.beams.push({
      x1: 320,
      y1: 470,
      x2: targetX,
      y2: targetY,
      life: 8,
      color: '#06b6d4'
    });

    let hit = false;
    for (let i = st.targets.length - 1; i >= 0; i--) {
      const tgt = st.targets[i];
      const dist = Math.hypot(tgt.x - targetX, tgt.y - targetY);
      if (dist <= tgt.radius + 14) {
        hit = true;
        tgt.hp -= 1;
        // Hit particles
        for (let p = 0; p < 8; p++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 2 + Math.random() * 4;
          st.particles.push({
            x: tgt.x,
            y: tgt.y,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            color: tgt.color,
            radius: 2 + Math.random() * 2,
            life: 20
          });
        }

        if (tgt.hp <= 0) {
          // Destroyed!
          if (tgt.type === 'hazard') {
            audio.playDamage();
            st.energy = Math.max(0, st.energy - 25);
            setEnergy(Math.round(st.energy));
            st.combo = 1;
            setCombo(1);
          } else {
            audio.playClick();
            const earnedPoints = tgt.points * st.combo;
            st.score += earnedPoints;
            setScore(st.score);

            if (tgt.vcoins > 0) {
              audio.playWin();
              st.vcoins += tgt.vcoins;
              setVcoinsEarned(st.vcoins);
              if (onVCoinsEarned) onVCoinsEarned(tgt.vcoins);
            }

            st.comboTimer = 180;
            st.combo = Math.min(10, st.combo + 1);
            setCombo(st.combo);
            st.energy = Math.min(100, st.energy + 8);
            setEnergy(Math.round(st.energy));
          }

          // Big explosion
          for (let p = 0; p < 18; p++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = 2 + Math.random() * 6;
            st.particles.push({
              x: tgt.x,
              y: tgt.y,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd,
              color: tgt.color,
              radius: 3 + Math.random() * 3,
              life: 30
            });
          }

          st.targets.splice(i, 1);
        }
        break;
      }
    }

    if (!hit) {
      st.combo = 1;
      setCombo(1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      stateRef.current.keys[e.code] = true;
      if (e.code === 'Space') {
        e.preventDefault();
        fireBeam(stateRef.current.crosshair.x, stateRef.current.crosshair.y);
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
  }, [isPlaying]);

  useEffect(() => {
    let animId: number;

    const gameLoop = () => {
      const cvs = canvasRef.current;
      if (!cvs) return;
      const ctx = cvs.getContext('2d');
      if (!ctx) return;

      const st = stateRef.current;

      if (isPlaying && !gameOver) {
        // Keyboard movement for crosshair
        const spd = 6;
        if (st.keys['ArrowLeft'] || st.keys['KeyA']) st.crosshair.x = Math.max(20, st.crosshair.x - spd);
        if (st.keys['ArrowRight'] || st.keys['KeyD']) st.crosshair.x = Math.min(620, st.crosshair.x + spd);
        if (st.keys['ArrowUp'] || st.keys['KeyW']) st.crosshair.y = Math.max(20, st.crosshair.y - spd);
        if (st.keys['ArrowDown'] || st.keys['KeyS']) st.crosshair.y = Math.min(440, st.crosshair.y + spd);

        // Energy passive recharge
        st.energy = Math.min(100, st.energy + 0.12);
        setEnergy(Math.round(st.energy));

        // Combo timer
        if (st.comboTimer > 0) {
          st.comboTimer--;
          if (st.comboTimer <= 0) {
            st.combo = 1;
            setCombo(1);
          }
        }

        // Spawn targets
        st.nextSpawn--;
        st.waveTimer++;
        if (st.waveTimer > 900) {
          st.waveTimer = 0;
          st.wave++;
          setWave(st.wave);
          audio.playLevelUp();
        }

        if (st.nextSpawn <= 0) {
          st.nextSpawn = Math.max(25, 60 - st.wave * 4);
          st.targetCounter++;

          const rand = Math.random();
          let type: TargetEntity['type'] = 'core';
          let color = '#38bdf8';
          let pts = 100;
          let vc = 0;
          let rad = 28;
          let hp = 1;
          let maxLife = 200;

          if (rand < 0.15) {
            type = 'gold';
            color = '#fbbf24';
            pts = 350;
            vc = 5;
            rad = 22;
            maxLife = 140;
          } else if (rand < 0.35) {
            type = 'rapid';
            color = '#a855f7';
            pts = 200;
            rad = 20;
            maxLife = 160;
          } else if (rand < 0.5) {
            type = 'hazard';
            color = '#f43f5e';
            pts = 0;
            rad = 26;
            maxLife = 220;
          } else if (st.targetCounter % 15 === 0) {
            type = 'boss';
            color = '#ec4899';
            pts = 1000;
            vc = 15;
            rad = 45;
            hp = 5;
            maxLife = 300;
          }

          st.targets.push({
            id: Date.now() + Math.random(),
            x: 60 + Math.random() * 520,
            y: 50 + Math.random() * 320,
            radius: rad,
            maxRadius: rad,
            type,
            points: pts,
            vcoins: vc,
            hp,
            maxHp: hp,
            life: maxLife,
            maxLife,
            pulseSpeed: 0.05 + Math.random() * 0.05,
            color
          });
        }

        // Update targets
        for (let i = st.targets.length - 1; i >= 0; i--) {
          const tgt = st.targets[i];
          tgt.life--;
          if (tgt.life <= 0) {
            // Target expired without being hit
            if (tgt.type !== 'hazard') {
              st.energy = Math.max(0, st.energy - 12);
              setEnergy(Math.round(st.energy));
              if (st.energy <= 0) {
                audio.playGameOver();
                setGameOver(true);
                setIsPlaying(false);
                if (onScoreSubmit) onScoreSubmit(st.score);
              }
            }
            st.targets.splice(i, 1);
          }
        }

        // Update beams
        for (let i = st.beams.length - 1; i >= 0; i--) {
          st.beams[i].life--;
          if (st.beams[i].life <= 0) {
            st.beams.splice(i, 1);
          }
        }

        // Update particles
        for (let i = st.particles.length - 1; i >= 0; i--) {
          const p = st.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.95;
          p.vy *= 0.95;
          p.life--;
          if (p.life <= 0) {
            st.particles.splice(i, 1);
          }
        }
      }

      // RENDER
      // Background Grid
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, 640, 480);

      // Cyber Grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 640; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 480);
        ctx.stroke();
      }
      for (let y = 0; y < 480; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(640, y);
        ctx.stroke();
      }

      // Draw Beams
      for (const b of st.beams) {
        ctx.strokeStyle = b.color;
        ctx.lineWidth = b.life;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(b.x1, b.y1);
        ctx.lineTo(b.x2, b.y2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw Targets
      for (const tgt of st.targets) {
        const lifeRatio = tgt.life / tgt.maxLife;
        const currentRad = tgt.radius * (0.85 + Math.sin(Date.now() * tgt.pulseSpeed) * 0.15);

        ctx.shadowColor = tgt.color;
        ctx.shadowBlur = 15;

        // Outer expiration ring
        ctx.strokeStyle = `${tgt.color}55`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(tgt.x, tgt.y, currentRad + 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * lifeRatio);
        ctx.stroke();

        // Main body
        ctx.fillStyle = tgt.color;
        ctx.beginPath();
        ctx.arc(tgt.x, tgt.y, currentRad, 0, Math.PI * 2);
        ctx.fill();

        // Inner core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(tgt.x, tgt.y, currentRad * 0.45, 0, Math.PI * 2);
        ctx.fill();

        // Boss / Multi-hp indicator
        if (tgt.maxHp > 1) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`HP: ${tgt.hp}`, tgt.x, tgt.y - currentRad - 12);
        }

        ctx.shadowBlur = 0;
      }

      // Draw Particles
      for (const p of st.particles) {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, p.radius * (p.life / 30)), 0, Math.PI * 2);
        ctx.fill();
      }

      // Player Cannon base
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(320, 480, 45, Math.PI, 0);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(320, 460, 12, 0, Math.PI * 2);
      ctx.fill();

      // Crosshair
      const ch = st.crosshair;
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.arc(ch.x, ch.y, 18, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(ch.x - 24, ch.y);
      ctx.lineTo(ch.x - 6, ch.y);
      ctx.moveTo(ch.x + 6, ch.y);
      ctx.lineTo(ch.x + 24, ch.y);
      ctx.moveTo(ch.x, ch.y - 24);
      ctx.lineTo(ch.x, ch.y - 6);
      ctx.moveTo(ch.x, ch.y + 6);
      ctx.lineTo(ch.x, ch.y + 24);
      ctx.stroke();

      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, gameOver]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-2 sm:p-4 select-none">
      {/* Top HUD */}
      <div className="w-full max-w-2xl flex items-center justify-between p-3 rounded-2xl liquid-glass-pill border border-white/10 z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300">
            <Target className="w-4 h-4" />
            <span>{score} PTS</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-yellow-300">
            <Coins className="w-4 h-4 fill-current text-yellow-400" />
            <span>+{vcoinsEarned} VC</span>
          </div>
          <div className="px-2 py-0.5 rounded-full text-[11px] font-mono font-black bg-purple-500/20 text-purple-300 border border-purple-400/30">
            x{combo} COMBO
          </div>
        </div>

        {/* Energy Bar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-300">
            <Zap className="w-3.5 h-3.5" /> ÉNERGIE
          </div>
          <div className="w-24 sm:w-32 h-2.5 rounded-full bg-slate-800 overflow-hidden border border-white/10">
            <div
              className={`h-full transition-all duration-150 ${
                energy > 40 ? 'bg-cyan-400' : 'bg-rose-500'
              }`}
              style={{ width: `${energy}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-white">{energy}%</span>
        </div>
      </div>

      {/* Viewport Canvas */}
      <div
        className="relative w-full max-w-2xl flex-1 flex items-center justify-center my-2 rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-black touch-none cursor-crosshair"
        onPointerDown={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const targetX = ((e.clientX - rect.left) / rect.width) * 640;
          const targetY = ((e.clientY - rect.top) / rect.height) * 480;
          stateRef.current.crosshair = { x: targetX, y: targetY };
          fireBeam(targetX, targetY);
        }}
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const targetX = ((e.clientX - rect.left) / rect.width) * 640;
          const targetY = ((e.clientY - rect.top) / rect.height) * 480;
          stateRef.current.crosshair = { x: targetX, y: targetY };
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
                  RÉSEAU QUANTIQUE SURCHARGÉ
                </span>
                <h3 className="text-2xl font-black text-white font-mono tracking-tight">SESSION TERMINÉE</h3>
                <div className="p-4 rounded-2xl liquid-glass-card border border-white/10 space-y-1">
                  <div className="text-xs text-slate-400 font-mono">Score de Précision</div>
                  <div className="text-3xl font-black text-cyan-300 font-mono">{score}</div>
                  <div className="text-xs text-yellow-400 font-mono pt-1">+{vcoinsEarned} V-Coins empochés</div>
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
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  JEU VIP EXCLUSIF • 250 VC
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  LASER
                </h2>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Verrouillez et désintégrez les cibles d'énergie quantique ! Réagissez au quart de seconde, maintenez votre combo x10 et évitez les orbes rouges corrompus.
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 py-2">
                  <div className="p-2 rounded-xl liquid-glass-pill">Clic / Tap : Tirer laser</div>
                  <div className="p-2 rounded-xl liquid-glass-pill">Espace / Clavier : Viser & Feu</div>
                  <div className="p-2 rounded-xl liquid-glass-pill">🟡 Orbes or : +5 V-Coins</div>
                  <div className="p-2 rounded-xl liquid-glass-pill">🔴 Orbes rouges : Dégâts énergie</div>
                </div>

                <button
                  onClick={startGame}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider cursor-pointer hover:from-amber-300 hover:to-yellow-400 shadow-[0_0_20px_rgba(245,158,11,0.6)] active:scale-95 transition-all flex items-center gap-2 mx-auto"
                >
                  <Play className="w-4 h-4 fill-current" /> Démarrer la frappe
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
