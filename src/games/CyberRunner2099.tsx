import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Volume2, Shield, Zap, Coins, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { audio } from '../utils/audio';

interface CyberRunnerProps {
  onScoreSubmit?: (score: number) => void;
  onVCoinsEarned?: (vcoins: number) => void;
  onExit?: () => void;
}

export function CyberRunner2099({ onScoreSubmit, onVCoinsEarned, onExit }: CyberRunnerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [vcoinsCollected, setVcoinsCollected] = useState(0);
  const [hasShield, setHasShield] = useState(false);
  const [speedLevel, setSpeedLevel] = useState(1);

  // Game internal state
  const stateRef = useRef({
    lane: 1, // 0: left, 1: center, 2: right
    targetX: 0,
    currentX: 0,
    playerY: 0,
    isJumping: false,
    jumpVelocity: 0,
    isSliding: false,
    slideTimer: 0,
    hasShield: false,
    speed: 7,
    distance: 0,
    score: 0,
    vcoins: 0,
    obstacles: [] as Array<{
      lane: number;
      z: number;
      type: 'barrier' | 'laser' | 'drone' | 'coin' | 'shield';
      collected?: boolean;
    }>,
    particles: [] as Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      life: number;
    }>,
    lastObstacleZ: 0
  });

  const startGame = () => {
    audio.playLaser();
    stateRef.current = {
      lane: 1,
      targetX: 0,
      currentX: 0,
      playerY: 0,
      isJumping: false,
      jumpVelocity: 0,
      isSliding: false,
      slideTimer: 0,
      hasShield: false,
      speed: 7,
      distance: 0,
      score: 0,
      vcoins: 0,
      obstacles: [],
      particles: [],
      lastObstacleZ: 300
    };
    setScore(0);
    setVcoinsCollected(0);
    setHasShield(false);
    setSpeedLevel(1);
    setGameOver(false);
    setIsPlaying(true);
  };

  const moveLane = (dir: -1 | 1) => {
    if (!isPlaying || gameOver) return;
    const nextLane = Math.max(0, Math.min(2, stateRef.current.lane + dir));
    if (nextLane !== stateRef.current.lane) {
      audio.playClick();
      stateRef.current.lane = nextLane;
    }
  };

  const jump = () => {
    if (!isPlaying || gameOver || stateRef.current.isJumping) return;
    audio.playLevelUp();
    stateRef.current.isJumping = true;
    stateRef.current.jumpVelocity = 14;
    stateRef.current.isSliding = false;
  };

  const slide = () => {
    if (!isPlaying || gameOver || stateRef.current.isSliding || stateRef.current.isJumping) return;
    audio.playClick();
    stateRef.current.isSliding = true;
    stateRef.current.slideTimer = 35;
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        moveLane(-1);
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        moveLane(1);
      } else if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) {
        e.preventDefault();
        jump();
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        slide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  // Main Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const lanePositions = (w: number) => [
      w * 0.28,
      w * 0.5,
      w * 0.72
    ];

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const lanes = lanePositions(w);
      const st = stateRef.current;

      // 1. Draw Neon Cyber Highway Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#030712');
      bgGrad.addColorStop(0.5, '#0f172a');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Distant Neon Grid & Horizon Sun
      const horizonY = h * 0.35;
      const sunGrad = ctx.createRadialGradient(w / 2, horizonY, 10, w / 2, horizonY, w * 0.4);
      sunGrad.addColorStop(0, 'rgba(236, 72, 153, 0.45)');
      sunGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.2)');
      sunGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, w, horizonY + 50);

      // Grid Perspective lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1.5;
      for (let x = -w; x <= w * 2; x += w * 0.15) {
        ctx.beginPath();
        ctx.moveTo(w / 2, horizonY);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Highway Surface
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.moveTo(w * 0.4, horizonY);
      ctx.lineTo(w * 0.6, horizonY);
      ctx.lineTo(w * 0.88, h);
      ctx.lineTo(w * 0.12, h);
      ctx.closePath();
      ctx.fill();

      // Highway Neon Edges
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(w * 0.4, horizonY);
      ctx.lineTo(w * 0.12, h);
      ctx.moveTo(w * 0.6, horizonY);
      ctx.lineTo(w * 0.88, h);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Lane divider lines
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(w * 0.46, horizonY);
      ctx.lineTo(w * 0.37, h);
      ctx.moveTo(w * 0.54, horizonY);
      ctx.lineTo(w * 0.63, h);
      ctx.stroke();
      ctx.setLineDash([]);

      if (isPlaying && !gameOver) {
        // Update player movement
        st.distance += st.speed;
        st.score = Math.floor(st.distance / 10);
        setScore(st.score);

        // Speed increment
        if (st.score > 500 && st.speed < 14) {
          st.speed = 7 + (st.score / 250);
          setSpeedLevel(Math.floor(st.speed / 3));
        }

        // Smooth lane interpolation
        const targetX = lanes[st.lane];
        st.currentX += (targetX - st.currentX) * 0.22;

        // Jump physics
        if (st.isJumping) {
          st.playerY += st.jumpVelocity;
          st.jumpVelocity -= 0.85; // Gravity
          if (st.playerY <= 0) {
            st.playerY = 0;
            st.isJumping = false;
          }
        }

        // Slide timer
        if (st.isSliding) {
          st.slideTimer--;
          if (st.slideTimer <= 0) {
            st.isSliding = false;
          }
        }

        // Spawn obstacles
        if (st.obstacles.length === 0 || st.obstacles[st.obstacles.length - 1].z < 900) {
          const spawnLane = Math.floor(Math.random() * 3);
          const rand = Math.random();
          let type: 'barrier' | 'laser' | 'drone' | 'coin' | 'shield' = 'barrier';

          if (rand < 0.35) type = 'coin';
          else if (rand < 0.55) type = 'barrier';
          else if (rand < 0.75) type = 'laser';
          else if (rand < 0.92) type = 'drone';
          else type = 'shield';

          const zSpawn = (st.obstacles.length > 0 ? st.obstacles[st.obstacles.length - 1].z : 400) + 180 + Math.random() * 80;
          st.obstacles.push({ lane: spawnLane, z: zSpawn, type });
        }

        // Move obstacles
        for (let i = st.obstacles.length - 1; i >= 0; i--) {
          const obs = st.obstacles[i];
          obs.z -= st.speed;

          // Check collisions with player
          // Player is at z ~ 120
          if (!obs.collected && obs.z > 70 && obs.z < 150 && obs.lane === st.lane) {
            if (obs.type === 'coin') {
              obs.collected = true;
              audio.playCoin();
              st.vcoins += 2;
              setVcoinsCollected(st.vcoins);
              if (onVCoinsEarned) onVCoinsEarned(2);
            } else if (obs.type === 'shield') {
              obs.collected = true;
              audio.playWin();
              st.hasShield = true;
              setHasShield(true);
            } else {
              // Hazards
              let dodged = false;
              if (obs.type === 'barrier' && st.isJumping && st.playerY > 30) {
                dodged = true;
              } else if (obs.type === 'drone' && st.isSliding) {
                dodged = true;
              }

              if (!dodged) {
                if (st.hasShield) {
                  audio.playHit();
                  st.hasShield = false;
                  setHasShield(false);
                  obs.collected = true;
                } else {
                  // Crash!
                  audio.playHit();
                  setGameOver(true);
                  setIsPlaying(false);
                  if (onScoreSubmit) onScoreSubmit(st.score);
                }
              }
            }
          }

          // Remove offscreen
          if (obs.z < 10) {
            st.obstacles.splice(i, 1);
          }
        }
      }

      // Draw Obstacles in perspective
      st.obstacles.forEach((obs) => {
        if (obs.collected) return;
        const progress = Math.max(0, Math.min(1, (1000 - obs.z) / 1000));
        const obsY = horizonY + (h - horizonY) * progress;
        const obsX = lanes[obs.lane];
        const scale = 0.3 + progress * 0.9;

        ctx.save();
        ctx.translate(obsX, obsY);
        ctx.scale(scale, scale);

        if (obs.type === 'coin') {
          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, -20, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#78350f';
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('VC', 0, -16);
        } else if (obs.type === 'shield') {
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.arc(0, -22, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#082f49';
          ctx.font = 'bold 14px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🛡️', 0, -17);
        } else if (obs.type === 'barrier') {
          // Low Barrier (Jump over)
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 12;
          ctx.fillRect(-35, -20, 70, 20);
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(-30, -16, 60, 6);
        } else if (obs.type === 'drone') {
          // Flying High Drone (Slide under)
          ctx.fillStyle = '#a855f7';
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 15;
          ctx.fillRect(-30, -75, 60, 22);
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(0, -64, 8, 0, Math.PI * 2);
          ctx.fill();
        } else if (obs.type === 'laser') {
          // Electric grid barrier
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 4;
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 14;
          ctx.strokeRect(-28, -50, 56, 50);
          ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
          ctx.fillRect(-28, -50, 56, 50);
        }
        ctx.restore();
      });

      // Draw Player Character
      const playerGroundY = h * 0.88;
      const playerActualY = playerGroundY - st.playerY;
      const pX = st.currentX || lanes[st.lane];

      ctx.save();
      ctx.translate(pX, playerActualY);

      // Player Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Shield Aura
      if (st.hasShield) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(0, -30, 42, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (st.isSliding) {
        // Sliding posture (low cylinder)
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 15;
        ctx.fillRect(-28, -16, 56, 16);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(-22, -12, 44, 6);
      } else {
        // Cyber Runner Avatar (glow armor)
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 12;
        // Torso
        ctx.fillRect(-14, -48, 28, 30);
        // Head / Visor
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(-10, -68, 20, 16);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(-6, -64, 12, 5); // Golden Visor
        // Legs
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-12, -18, 9, 18);
        ctx.fillRect(3, -18, 9, 18);
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, gameOver]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between bg-slate-950 p-2 sm:p-4 select-none">
      {/* Top HUD */}
      <div className="w-full max-w-2xl flex items-center justify-between p-3 rounded-2xl liquid-glass-pill border border-white/10 z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300">
            <Zap className="w-4 h-4" />
            <span>{score} PTS</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-yellow-300">
            <Coins className="w-4 h-4 fill-current text-yellow-400" />
            <span>+{vcoinsCollected} VC</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasShield && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-400/40 animate-pulse">
              <Shield className="w-3 h-3" /> BOUCLIER
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
            SPD {speedLevel}x
          </span>
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

        {/* Start / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            {gameOver ? (
              <div className="space-y-4 max-w-sm">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-rose-500/20 text-rose-300 border border-rose-400/40">
                  IMPACT SUR LA ROUTE
                </span>
                <h3 className="text-2xl font-black text-white font-mono tracking-tight">GAME OVER</h3>
                <div className="p-4 rounded-2xl liquid-glass-card border border-white/10 space-y-1">
                  <div className="text-xs text-slate-400 font-mono">Score Final</div>
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
                  RUNNER
                </h2>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Foncez à toute vitesse sur l'autoroute néon ! Changez de voie, sautez par-dessus les lasers et glissez sous les drones pour ramasser un maximum de V-Coins !
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 py-2">
                  <div className="p-2 rounded-xl liquid-glass-pill">← / → ou A / D : Voies</div>
                  <div className="p-2 rounded-xl liquid-glass-pill">↑ / Espace : Sauter</div>
                  <div className="p-2 rounded-xl liquid-glass-pill">↓ / S : Glisser</div>
                  <div className="p-2 rounded-xl liquid-glass-pill">🟡 : +2 V-Coins</div>
                </div>

                <button
                  onClick={startGame}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider cursor-pointer hover:from-cyan-300 hover:to-blue-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] active:scale-95 transition-all flex items-center gap-2 mx-auto"
                >
                  <Play className="w-4 h-4 fill-current" /> Lancer la course
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Touch Controls Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between gap-2 p-2">
        <div className="flex gap-2">
          <button
            onPointerDown={() => moveLane(-1)}
            className="w-14 h-12 rounded-2xl liquid-glass-pill flex items-center justify-center text-cyan-300 active:scale-90 transition-transform cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onPointerDown={() => moveLane(1)}
            className="w-14 h-12 rounded-2xl liquid-glass-pill flex items-center justify-center text-cyan-300 active:scale-90 transition-transform cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onPointerDown={jump}
            className="px-5 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono font-bold text-xs flex items-center gap-1 active:scale-90 transition-transform cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" /> SAUT
          </button>
          <button
            onPointerDown={slide}
            className="px-5 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 font-mono font-bold text-xs flex items-center gap-1 active:scale-90 transition-transform cursor-pointer"
          >
            <ArrowDown className="w-4 h-4" /> GLISSE
          </button>
        </div>
      </div>
    </div>
  );
}
