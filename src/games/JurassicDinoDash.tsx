import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Flame, Shield, Zap, Sparkles, ArrowLeft, RotateCcw, Volume2, Trophy, HelpCircle } from 'lucide-react';
import { audio } from '../utils/audio';

interface JurassicDinoDashProps {
  onScore: (score: number) => void;
  onGameOver: (score: number) => void;
  onBack: () => void;
  highScore: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'cactus' | 'volcano' | 'pterodactyl' | 'meteor';
  speed: number;
  color: string;
}

interface AmberItem {
  x: number;
  y: number;
  collected: boolean;
  pulse: number;
}

export const JurassicDinoDash: React.FC<JurassicDinoDashProps> = ({
  onScore,
  onGameOver,
  onBack,
  highScore
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [amberCount, setAmberCount] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [hasShield, setHasShield] = useState<boolean>(false);
  const [isDashing, setIsDashing] = useState<boolean>(false);
  const [dashFuel, setDashFuel] = useState<number>(100);

  // Player state
  const playerRef = useRef({
    x: 80,
    y: 260,
    width: 44,
    height: 48,
    vy: 0,
    isGrounded: true,
    isDucking: false,
    jumpForce: -13.5,
    gravity: 0.65,
    runningFrame: 0,
    invincibleTimer: 0
  });

  const stateRef = useRef({
    score: 0,
    amberCount: 0,
    multiplier: 1,
    hasShield: false,
    isDashing: false,
    dashFuel: 100,
    gameSpeed: 6.5,
    obstacles: [] as Obstacle[],
    ambers: [] as AmberItem[],
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; size: number; life: number }[],
    groundOffset: 0,
    volcanoActive: false,
    volcanoTimer: 0,
    nextSpawn: 80,
    isPlaying: false
  });

  // Controls
  const handleJump = useCallback(() => {
    const p = playerRef.current;
    if (p.isGrounded) {
      p.vy = p.jumpForce;
      p.isGrounded = false;
      audio.playLaser();
      // Particles on jump
      for (let i = 0; i < 8; i++) {
        stateRef.current.particles.push({
          x: p.x + 20,
          y: p.y + p.height,
          vx: (Math.random() - 0.5) * 4 - 2,
          vy: Math.random() * 3,
          color: '#f59e0b',
          size: Math.random() * 4 + 2,
          life: 20
        });
      }
    }
  }, []);

  const handleDuck = useCallback((ducking: boolean) => {
    const p = playerRef.current;
    p.isDucking = ducking;
    if (ducking) {
      p.height = 26;
      if (p.isGrounded) p.y = 282;
    } else {
      p.height = 48;
      if (p.isGrounded) p.y = 260;
    }
  }, []);

  const handleDash = useCallback(() => {
    if (stateRef.current.dashFuel >= 25 && !stateRef.current.isDashing) {
      stateRef.current.isDashing = true;
      setIsDashing(true);
      stateRef.current.dashFuel -= 25;
      setDashFuel(stateRef.current.dashFuel);
      audio.playSwoosh();
      setTimeout(() => {
        stateRef.current.isDashing = false;
        setIsDashing(false);
      }, 1500);
    }
  }, []);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        handleJump();
      } else if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleDuck(true);
      } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleDash();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        handleDuck(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, handleJump, handleDuck, handleDash]);

  const startGame = () => {
    const p = playerRef.current;
    p.y = 260;
    p.vy = 0;
    p.isGrounded = true;
    p.isDucking = false;
    p.height = 48;
    p.invincibleTimer = 60;

    stateRef.current = {
      score: 0,
      amberCount: 0,
      multiplier: 1,
      hasShield: false,
      isDashing: false,
      dashFuel: 100,
      gameSpeed: 6.5,
      obstacles: [],
      ambers: [],
      particles: [],
      groundOffset: 0,
      volcanoActive: false,
      volcanoTimer: 0,
      nextSpawn: 60,
      isPlaying: true
    };

    setScore(0);
    setAmberCount(0);
    setMultiplier(1);
    setHasShield(false);
    setIsDashing(false);
    setDashFuel(100);
    setIsGameOver(false);
    setIsPlaying(true);
    audio.playStart();
  };

  // Main Game Loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const s = stateRef.current;
      const p = playerRef.current;

      // Update if active
      if (s.isPlaying) {
        // Increment Score
        s.score += Math.floor(1 * (s.isDashing ? 3 : 1) * s.multiplier);
        setScore(s.score);
        onScore(s.score);

        // Speed ramp up
        s.gameSpeed = 6.5 + Math.min(8, s.score / 500);

        // Fuel regen
        if (s.dashFuel < 100) {
          s.dashFuel = Math.min(100, s.dashFuel + 0.1);
          setDashFuel(Math.floor(s.dashFuel));
        }

        // Physics
        p.vy += p.gravity;
        p.y += p.vy;

        const groundY = p.isDucking ? 282 : 260;
        if (p.y >= groundY) {
          p.y = groundY;
          p.vy = 0;
          p.isGrounded = true;
        }

        if (p.invincibleTimer > 0) p.invincibleTimer--;

        // Ground scroll
        s.groundOffset = (s.groundOffset + (s.isDashing ? s.gameSpeed * 1.8 : s.gameSpeed)) % 40;

        // Obstacles spawn
        s.nextSpawn--;
        if (s.nextSpawn <= 0) {
          s.nextSpawn = Math.floor(Math.random() * 40 + 55 - Math.min(25, s.score / 600));
          const rnd = Math.random();
          if (rnd < 0.4) {
            // Lava vent / Cyber cactus
            s.obstacles.push({
              x: 800,
              y: 265,
              width: 32,
              height: 44,
              type: 'cactus',
              speed: s.gameSpeed,
              color: '#ef4444'
            });
          } else if (rnd < 0.7) {
            // Flying Pterodactyl
            const highFly = Math.random() > 0.5;
            s.obstacles.push({
              x: 800,
              y: highFly ? 210 : 255, // Low requires ducking, high requires staying low
              width: 42,
              height: 28,
              type: 'pterodactyl',
              speed: s.gameSpeed * 1.15,
              color: '#38bdf8'
            });
          } else {
            // Volcano Rock / Meteor
            s.obstacles.push({
              x: 800,
              y: 270,
              width: 36,
              height: 38,
              type: 'volcano',
              speed: s.gameSpeed,
              color: '#f97316'
            });
          }

          // Random Amber fossil spawn
          if (Math.random() < 0.6) {
            s.ambers.push({
              x: 850 + Math.random() * 100,
              y: Math.random() > 0.5 ? 200 : 250,
              collected: false,
              pulse: 0
            });
          }
        }

        // Update Obstacles
        const actualSpeed = s.isDashing ? s.gameSpeed * 1.8 : s.gameSpeed;
        for (let i = s.obstacles.length - 1; i >= 0; i--) {
          const obs = s.obstacles[i];
          obs.x -= actualSpeed;

          // Check Collision
          if (!s.isDashing && p.invincibleTimer <= 0) {
            const pad = 6;
            if (
              p.x + p.width - pad > obs.x &&
              p.x + pad < obs.x + obs.width &&
              p.y + p.height - pad > obs.y &&
              p.y + pad < obs.y + obs.height
            ) {
              if (s.hasShield) {
                // Shield break
                s.hasShield = false;
                setHasShield(false);
                p.invincibleTimer = 45;
                audio.playHit();
                s.obstacles.splice(i, 1);
                continue;
              } else {
                // Game Over!
                s.isPlaying = false;
                setIsPlaying(false);
                setIsGameOver(true);
                audio.playGameOver();
                onGameOver(s.score);
                break;
              }
            }
          }

          // Off screen
          if (obs.x + obs.width < -50) {
            s.obstacles.splice(i, 1);
          }
        }

        // Update Ambers
        for (let i = s.ambers.length - 1; i >= 0; i--) {
          const amb = s.ambers[i];
          amb.x -= actualSpeed;
          amb.pulse += 0.1;

          // Collection check
          if (!amb.collected &&
            p.x + p.width > amb.x - 12 &&
            p.x < amb.x + 12 &&
            p.y + p.height > amb.y - 12 &&
            p.y < amb.y + 12
          ) {
            amb.collected = true;
            s.amberCount += 1;
            s.score += 50 * s.multiplier;
            setAmberCount(s.amberCount);
            audio.playPixelScore();

            // Amber combo multiplier
            if (s.amberCount % 5 === 0) {
              s.multiplier = Math.min(5, s.multiplier + 1);
              setMultiplier(s.multiplier);
              audio.playWin();
            }

            // Amber collect particles
            for (let k = 0; k < 6; k++) {
              s.particles.push({
                x: amb.x,
                y: amb.y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: '#facc15',
                size: 3,
                life: 25
              });
            }
          }

          if (amb.x < -30 || amb.collected) {
            s.ambers.splice(i, 1);
          }
        }

        // Update Particles
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const pt = s.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life--;
          if (pt.life <= 0) s.particles.splice(i, 1);
        }
      }

      // DRAW CANVAS
      ctx.clearRect(0, 0, 800, 350);

      // 1. Cyber Jurassic Prehistoric Sky & Mountains Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 350);
      skyGrad.addColorStop(0, '#1c0528');
      skyGrad.addColorStop(0.5, '#450a0a');
      skyGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 800, 350);

      // Distant Volcanic Mountains
      ctx.fillStyle = '#27081e';
      ctx.beginPath();
      ctx.moveTo(0, 300);
      ctx.lineTo(120, 160);
      ctx.lineTo(240, 300);
      ctx.lineTo(380, 140);
      ctx.lineTo(520, 300);
      ctx.lineTo(680, 170);
      ctx.lineTo(800, 300);
      ctx.lineTo(800, 350);
      ctx.lineTo(0, 350);
      ctx.fill();

      // Volcano Lava Peaks Glowing
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(380, 140, 8, 0, Math.PI * 2);
      ctx.arc(120, 160, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Neon Prehistoric Sun / Meteor Moon
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(700, 70, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 2. Prehistoric Ground Matrix
      const groundGrad = ctx.createLinearGradient(0, 300, 0, 350);
      groundGrad.addColorStop(0, '#f97316');
      groundGrad.addColorStop(0.2, '#7c2d12');
      groundGrad.addColorStop(1, '#09090b');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, 300, 800, 50);

      // Neon ground grid lines
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 300);
      ctx.lineTo(800, 300);
      ctx.stroke();

      for (let gx = -s.groundOffset; gx < 800; gx += 40) {
        ctx.strokeStyle = 'rgba(251,146,60,0.3)';
        ctx.beginPath();
        ctx.moveTo(gx, 300);
        ctx.lineTo(gx - 25, 350);
        ctx.stroke();
      }

      // 3. Draw Ambers
      for (const amb of s.ambers) {
        ctx.save();
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#fbbf24';
        const pulseSize = 10 + Math.sin(amb.pulse) * 2;
        ctx.beginPath();
        // Diamond fossil shape
        ctx.moveTo(amb.x, amb.y - pulseSize);
        ctx.lineTo(amb.x + pulseSize, amb.y);
        ctx.lineTo(amb.x, amb.y + pulseSize);
        ctx.lineTo(amb.x - pulseSize, amb.y);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#78350f';
        ctx.font = '10px monospace';
        ctx.fillText('⚡', amb.x - 5, amb.y + 4);
        ctx.restore();
      }

      // 4. Draw Obstacles
      for (const obs of s.obstacles) {
        ctx.save();
        if (obs.type === 'cactus') {
          // Cyber Spiky Plant
          ctx.fillStyle = '#22c55e';
          ctx.shadowColor = '#4ade80';
          ctx.shadowBlur = 10;
          ctx.fillRect(obs.x + 10, obs.y, 12, obs.height);
          ctx.fillRect(obs.x, obs.y + 12, 10, 10);
          ctx.fillRect(obs.x + 22, obs.y + 8, 10, 10);
        } else if (obs.type === 'pterodactyl') {
          // Flying Cyber Dino
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#0ea5e9';
          ctx.shadowBlur = 12;
          const wingFlap = Math.sin(Date.now() / 80) * 12;
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y + 10);
          ctx.lineTo(obs.x + 20, obs.y + 10 - wingFlap);
          ctx.lineTo(obs.x + 35, obs.y + 10);
          ctx.lineTo(obs.x + 42, obs.y + 5);
          ctx.lineTo(obs.x + 35, obs.y + 16);
          ctx.lineTo(obs.x + 20, obs.y + 10 + wingFlap);
          ctx.closePath();
          ctx.fill();
          // Eye
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(obs.x + 38, obs.y + 6, 3, 3);
        } else {
          // Volcano Magma Rock
          ctx.fillStyle = '#ea580c';
          ctx.shadowColor = '#f97316';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(obs.x + 10, obs.y + 8, 8, 8);
        }
        ctx.restore();
      }

      // 5. Draw Player (Cyber T-Rex / Raptor)
      ctx.save();
      const isBlinking = p.invincibleTimer > 0 && Math.floor(p.invincibleTimer / 4) % 2 === 0;
      if (!isBlinking) {
        if (s.isDashing) {
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 25;
          // Dash speed lines behind player
          ctx.strokeStyle = 'rgba(6,182,212,0.8)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(p.x - 30, p.y + 15);
          ctx.lineTo(p.x - 5, p.y + 15);
          ctx.moveTo(p.x - 45, p.y + 30);
          ctx.lineTo(p.x - 10, p.y + 30);
          ctx.stroke();
        }

        // T-Rex Body
        ctx.fillStyle = s.isDashing ? '#38bdf8' : '#f59e0b';
        ctx.shadowColor = s.isDashing ? '#0284c7' : '#d97706';
        ctx.shadowBlur = 12;

        if (p.isDucking) {
          // Low Raptor Stance
          ctx.fillRect(p.x, p.y + 8, 40, 16);
          // Head
          ctx.fillRect(p.x + 30, p.y + 4, 16, 14);
          // Eye
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(p.x + 40, p.y + 6, 4, 4);
          // Legs
          ctx.fillStyle = '#b45309';
          ctx.fillRect(p.x + 8, p.y + 20, 8, 6);
          ctx.fillRect(p.x + 24, p.y + 20, 8, 6);
        } else {
          // Upright Running T-Rex
          // Body
          ctx.fillRect(p.x + 8, p.y + 14, 26, 22);
          // Tail
          ctx.beginPath();
          ctx.moveTo(p.x + 8, p.y + 24);
          ctx.lineTo(p.x - 16, p.y + 18);
          ctx.lineTo(p.x + 8, p.y + 30);
          ctx.fill();
          // Neck & Head
          ctx.fillRect(p.x + 24, p.y, 22, 18);
          // Jaw
          ctx.fillRect(p.x + 30, p.y + 12, 18, 8);
          // Cyber Visor Eye
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(p.x + 36, p.y + 4, 8, 4);
          // Arms
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(p.x + 32, p.y + 20, 6, 4);
          // Running legs
          const legPhase = Math.sin(Date.now() / 70);
          ctx.fillStyle = '#b45309';
          ctx.fillRect(p.x + 12, p.y + 36, 6, 12 + legPhase * 4);
          ctx.fillRect(p.x + 24, p.y + 36, 6, 12 - legPhase * 4);
        }

        // Shield Bubble
        if (s.hasShield) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(p.x + p.width / 2, p.y + p.height / 2, 32, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.restore();

      // 6. Draw Particles
      for (const pt of s.particles) {
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [onScore, onGameOver]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center select-none font-mono">
      {/* Top Bar Header */}
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

          <div className="px-3 py-1 bg-amber-950 border border-amber-500/80 rounded-xl text-amber-400 text-xs font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
            <span>⚡ AMBRE: {amberCount}</span>
            {multiplier > 1 && <span className="text-rose-400 font-black">x{multiplier}</span>}
          </div>
        </div>
      </div>

      {/* Main Canvas Container with Arcade Screen Styling */}
      <div className="relative w-full aspect-[800/350] bg-slate-950 rounded-3xl border-2 border-amber-500/80 shadow-[0_0_50px_rgba(245,158,11,0.35)] overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={350}
          className="w-full h-full block"
        />

        {/* Live HUD In Game */}
        {isPlaying && (
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
            {/* Score Display */}
            <div className="bg-slate-950/80 backdrop-blur border border-amber-500/60 px-4 py-2 rounded-2xl">
              <span className="text-[10px] text-amber-400 font-black tracking-widest block uppercase">SCORE JURASSIQUE</span>
              <span className="text-2xl font-black text-white">{score}</span>
            </div>

            {/* Dash Turbo Gauge */}
            <div className="bg-slate-950/80 backdrop-blur border border-cyan-500/60 px-4 py-2 rounded-2xl flex flex-col items-end">
              <span className="text-[10px] text-cyan-400 font-black tracking-widest block uppercase">TURBO BOOST (SHIFT / D)</span>
              <div className="w-28 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/40 mt-1">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all"
                  style={{ width: `${dashFuel}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Start / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center max-w-md"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 text-3xl mb-3 shadow-[0_0_30px_rgba(245,158,11,0.6)]">
                🦖
              </div>

              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-yellow-300 uppercase tracking-wider mb-1">
                {isGameOver ? 'IMPACT EXTINCTION !' : 'JURASSIC DINO DASH'}
              </h2>

              <p className="text-xs text-slate-300 font-sans mb-4">
                {isGameOver
                  ? `Vous avez survécu avec un score de ${score} PTS et ${amberCount} Fossiles d'Ambre !`
                  : 'Foncez avec votre T-Rex Cybernétique, sautez les pièges de lave et attrapez les fossiles d\'ambre !'}
              </p>

              {isGameOver && (
                <div className="flex gap-4 mb-4">
                  <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl">
                    <span className="text-[10px] text-slate-400 block uppercase">SCORE OBTENU</span>
                    <span className="text-lg font-black text-amber-400">{score}</span>
                  </div>
                  <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl">
                    <span className="text-[10px] text-slate-400 block uppercase">FOSSILES D'AMBRE</span>
                    <span className="text-lg font-black text-yellow-300">+{amberCount * 10} PX</span>
                  </div>
                </div>
              )}

              <button
                onClick={startGame}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.6)] transition transform hover:scale-105 cursor-pointer flex items-center gap-2"
              >
                <Zap size={18} /> {isGameOver ? 'REJOUER LE RUN' : 'LANCER LA COURSE'}
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* On-Screen Touch Controls for Mobile / Instant Click */}
      <div className="w-full flex justify-between items-center mt-3 gap-3">
        <div className="flex items-center gap-2">
          <button
            onPointerDown={() => handleDuck(true)}
            onPointerUp={() => handleDuck(false)}
            onPointerLeave={() => handleDuck(false)}
            className="px-5 py-3 bg-slate-900 border border-slate-700 active:border-amber-400 active:bg-amber-950 text-slate-200 rounded-2xl font-black text-xs uppercase flex items-center gap-1.5 transition cursor-pointer shadow-lg select-none"
          >
            ⬇️ BAISSER (S)
          </button>

          <button
            onClick={handleDash}
            className={`px-5 py-3 border rounded-2xl font-black text-xs uppercase flex items-center gap-1.5 transition cursor-pointer shadow-lg select-none ${
              dashFuel >= 25
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 active:scale-95'
                : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            ⚡ DASH (D)
          </button>
        </div>

        <button
          onClick={handleJump}
          className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 border-2 border-yellow-300 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.5)] active:scale-95 select-none"
        >
          ⬆️ SAUTER (ESPACE)
        </button>
      </div>
    </div>
  );
};

export default JurassicDinoDash;
