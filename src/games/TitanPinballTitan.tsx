import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Volume2, Coins, Zap, Trophy } from 'lucide-react';
import { audio } from '../utils/audio';

interface TitanPinballProps {
  onScoreSubmit?: (score: number) => void;
  onVCoinsEarned?: (vcoins: number) => void;
  onExit?: () => void;
}

export function TitanPinballTitan({ onScoreSubmit, onVCoinsEarned, onExit }: TitanPinballProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [ballsLeft, setBallsLeft] = useState(3);
  const [vcoinsEarned, setVcoinsEarned] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  const stateRef = useRef({
    ball: {
      x: 370,
      y: 420,
      vx: 0,
      vy: 0,
      radius: 9,
      inPlay: false
    },
    leftFlipper: {
      angle: 0.35,
      restAngle: 0.35,
      upAngle: -0.45,
      isUp: false,
      length: 65,
      x: 140,
      y: 450
    },
    rightFlipper: {
      angle: Math.PI - 0.35,
      restAngle: Math.PI - 0.35,
      upAngle: Math.PI + 0.45,
      isUp: false,
      length: 65,
      x: 260,
      y: 450
    },
    bumpers: [
      { x: 150, y: 150, radius: 24, score: 250, color: '#ec4899', hitTimer: 0 },
      { x: 250, y: 150, radius: 24, score: 250, color: '#06b6d4', hitTimer: 0 },
      { x: 200, y: 220, radius: 28, score: 500, color: '#eab308', hitTimer: 0 }
    ],
    targets: [
      { x: 80, y: 180, width: 14, height: 35, hit: false, score: 300 },
      { x: 80, y: 230, width: 14, height: 35, hit: false, score: 300 },
      { x: 320, y: 180, width: 14, height: 35, hit: false, score: 300 },
      { x: 320, y: 230, width: 14, height: 35, hit: false, score: 300 }
    ],
    particles: [] as Array<{ x: number; y: number; vx: number; vy: number; color: string; life: number }>,
    score: 0,
    multiplier: 1,
    ballsLeft: 3,
    vcoins: 0
  });

  const launchBall = () => {
    const st = stateRef.current;
    if (st.ball.inPlay) return;
    audio.playLevelUp();
    st.ball.x = 368;
    st.ball.y = 420;
    st.ball.vx = -1;
    st.ball.vy = -16.5; // Strong launch impulse
    st.ball.inPlay = true;
  };

  const startGame = () => {
    audio.playLaser();
    stateRef.current.score = 0;
    stateRef.current.multiplier = 1;
    stateRef.current.ballsLeft = 3;
    stateRef.current.vcoins = 0;
    stateRef.current.ball.inPlay = false;
    stateRef.current.targets.forEach(t => t.hit = false);

    setScore(0);
    setMultiplier(1);
    setBallsLeft(3);
    setVcoinsEarned(0);
    setGameOver(false);
    setIsPlaying(true);

    setTimeout(() => {
      launchBall();
    }, 400);
  };

  const setFlipperState = (side: 'left' | 'right', isUp: boolean) => {
    const flipper = side === 'left' ? stateRef.current.leftFlipper : stateRef.current.rightFlipper;
    if (flipper.isUp !== isUp) {
      if (isUp) audio.playClick();
      flipper.isUp = isUp;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        setFlipperState('left', true);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        setFlipperState('right', true);
      } else if (e.code === 'Space' || e.code === 'ArrowDown') {
        e.preventDefault();
        launchBall();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        setFlipperState('left', false);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        setFlipperState('right', false);
      }
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
      const b = st.ball;

      // 1. Draw Cyber Pinball Table
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, w, h);

      // Table Boundary Walls
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      // Outer curve at top
      ctx.moveTo(40, 160);
      ctx.lineTo(40, 420);
      ctx.lineTo(120, 480);
      ctx.moveTo(350, 420);
      ctx.lineTo(350, 160);
      ctx.arc(200, 160, 160, 0, Math.PI, true);
      ctx.stroke();

      // Launch Lane Plunger separator
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(350, 180);
      ctx.lineTo(350, 480);
      ctx.stroke();

      // Neon Table Circuit Decorations
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(200, 200, 80, 0, Math.PI * 2);
      ctx.moveTo(200, 50); ctx.lineTo(200, 120);
      ctx.stroke();

      if (isPlaying && !gameOver) {
        // Update Flippers Rotation
        const lf = st.leftFlipper;
        const rf = st.rightFlipper;

        if (lf.isUp) lf.angle = Math.max(lf.upAngle, lf.angle - 0.25);
        else lf.angle = Math.min(lf.restAngle, lf.angle + 0.18);

        if (rf.isUp) rf.angle = Math.min(rf.upAngle, rf.angle + 0.25);
        else rf.angle = Math.max(rf.restAngle, rf.angle - 0.18);

        if (b.inPlay) {
          // Physics
          b.vy += 0.28; // Gravity
          b.vx *= 0.995;
          b.vy *= 0.995;

          b.x += b.vx;
          b.y += b.vy;

          // Wall Collisions
          // Left Wall
          if (b.x < 48) {
            b.x = 48;
            b.vx = Math.abs(b.vx) * 0.85;
            audio.playClick();
          }
          // Right Launcher Wall
          if (b.x > 380) {
            b.x = 380;
            b.vx = -Math.abs(b.vx) * 0.85;
            audio.playClick();
          }
          // Top Arc
          const distToTopCenter = Math.hypot(b.x - 200, b.y - 160);
          if (b.y < 160 && distToTopCenter > 150) {
            const angle = Math.atan2(b.y - 160, b.x - 200);
            b.x = 200 + Math.cos(angle) * 150;
            b.y = 160 + Math.sin(angle) * 150;
            // Reflect velocity
            const normalX = -Math.cos(angle);
            const normalY = -Math.sin(angle);
            const dot = b.vx * normalX + b.vy * normalY;
            b.vx = (b.vx - 2 * dot * normalX) * 0.85;
            b.vy = (b.vy - 2 * dot * normalY) * 0.85;
            audio.playClick();
          }

          // Bumpers Collision
          st.bumpers.forEach(bmp => {
            if (bmp.hitTimer > 0) bmp.hitTimer--;
            const dist = Math.hypot(b.x - bmp.x, b.y - bmp.y);
            if (dist < bmp.radius + b.radius) {
              audio.playWin();
              bmp.hitTimer = 10;
              const angle = Math.atan2(b.y - bmp.y, b.x - bmp.x);
              b.vx = Math.cos(angle) * 11;
              b.vy = Math.sin(angle) * 11;

              st.score += bmp.score * st.multiplier;
              setScore(st.score);

              // Spawn particles
              for (let p = 0; p < 8; p++) {
                st.particles.push({
                  x: bmp.x + Math.cos(angle) * bmp.radius,
                  y: bmp.y + Math.sin(angle) * bmp.radius,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  color: bmp.color,
                  life: 15
                });
              }
            }
          });

          // Targets Collision
          st.targets.forEach(tgt => {
            if (!tgt.hit && b.x > tgt.x && b.x < tgt.x + tgt.width && b.y > tgt.y && b.y < tgt.y + tgt.height) {
              audio.playCoin();
              tgt.hit = true;
              b.vx *= -1;
              st.score += tgt.score * st.multiplier;
              st.vcoins += 2;
              setScore(st.score);
              setVcoinsEarned(st.vcoins);
              if (onVCoinsEarned) onVCoinsEarned(2);

              // Check all hit for multiplier
              if (st.targets.every(t => t.hit)) {
                audio.playLevelUp();
                st.multiplier = Math.min(5, st.multiplier + 1);
                setMultiplier(st.multiplier);
                st.targets.forEach(t => t.hit = false);
              }
            }
          });

          // Flippers Collision
          const checkFlipperCollision = (flp: typeof lf, isRight: boolean) => {
            const tipX = flp.x + Math.cos(flp.angle) * flp.length;
            const tipY = flp.y + Math.sin(flp.angle) * flp.length;

            // Line segment distance
            const l2 = flp.length * flp.length;
            const t = Math.max(0, Math.min(1, ((b.x - flp.x) * (tipX - flp.x) + (b.y - flp.y) * (tipY - flp.y)) / l2));
            const projX = flp.x + t * (tipX - flp.x);
            const projY = flp.y + t * (tipY - flp.y);

            const dist = Math.hypot(b.x - projX, b.y - projY);
            if (dist < b.radius + 6) {
              audio.playHit();
              const normalAngle = flp.angle - (isRight ? Math.PI / 2 : -Math.PI / 2);
              const flipperSpeed = flp.isUp ? 14 : 4;
              b.vx = Math.cos(normalAngle) * flipperSpeed + (isRight ? -2 : 2);
              b.vy = Math.sin(normalAngle) * flipperSpeed - 4;
              b.y = projY - 10;
            }
          };

          checkFlipperCollision(lf, false);
          checkFlipperCollision(rf, true);

          // Drain (Ball falls into the bottom hole)
          if (b.y > h + 30) {
            audio.playHit();
            b.inPlay = false;
            st.ballsLeft--;
            setBallsLeft(st.ballsLeft);

            if (st.ballsLeft <= 0) {
              setGameOver(true);
              setIsPlaying(false);
              if (onScoreSubmit) onScoreSubmit(st.score);
            } else {
              setTimeout(() => launchBall(), 800);
            }
          }
        }

        // Update Particles
        for (let i = st.particles.length - 1; i >= 0; i--) {
          const p = st.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
          if (p.life <= 0) st.particles.splice(i, 1);
        }
      }

      // Draw Targets
      st.targets.forEach(tgt => {
        ctx.fillStyle = tgt.hit ? '#475569' : '#06b6d4';
        ctx.shadowColor = tgt.hit ? 'transparent' : '#06b6d4';
        ctx.shadowBlur = tgt.hit ? 0 : 10;
        ctx.fillRect(tgt.x, tgt.y, tgt.width, tgt.height);
        ctx.shadowBlur = 0;
      });

      // Draw Bumpers
      st.bumpers.forEach(bmp => {
        ctx.fillStyle = bmp.color;
        ctx.shadowColor = bmp.color;
        ctx.shadowBlur = bmp.hitTimer > 0 ? 25 : 12;
        ctx.beginPath();
        ctx.arc(bmp.x, bmp.y, bmp.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(bmp.x, bmp.y, bmp.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Flippers
      const drawFlipper = (flp: typeof st.leftFlipper, isRight: boolean) => {
        const tipX = flp.x + Math.cos(flp.angle) * flp.length;
        const tipY = flp.y + Math.sin(flp.angle) * flp.length;

        ctx.strokeStyle = isRight ? '#a855f7' : '#06b6d4';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(flp.x, flp.y);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();
        ctx.shadowBlur = 0;
      };

      drawFlipper(st.leftFlipper, false);
      drawFlipper(st.rightFlipper, true);

      // Draw Particles
      st.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
      });

      // Draw Chrome Ball with reflection
      if (b.inPlay || !isPlaying) {
        ctx.save();
        ctx.translate(b.x, b.y);

        // Chrome sphere
        const ballGrad = ctx.createRadialGradient(-3, -3, 1, 0, 0, b.radius);
        ballGrad.addColorStop(0, '#ffffff');
        ballGrad.addColorStop(0.4, '#e2e8f0');
        ballGrad.addColorStop(0.8, '#64748b');
        ballGrad.addColorStop(1, '#0f172a');

        ctx.fillStyle = ballGrad;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, gameOver]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between bg-slate-950 p-2 sm:p-4 select-none">
      {/* Top HUD */}
      <div className="w-full max-w-md flex items-center justify-between p-3 rounded-2xl liquid-glass-pill border border-white/10 z-10 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-yellow-300">
            <Trophy className="w-4 h-4 fill-current text-yellow-400" />
            <span>{score.toLocaleString()} PTS</span>
          </div>
          <span className="px-1.5 py-0.2 rounded-md bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold border border-purple-400/30">
            {multiplier}x
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-300">
            <Coins className="w-3.5 h-3.5 fill-current text-yellow-400" />
            <span>+{vcoinsEarned} VC</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-300">
            <span>BILLES :</span>
            <div className="flex gap-1">
              {[1, 2, 3].map(n => (
                <div
                  key={n}
                  className={`w-2.5 h-2.5 rounded-full ${
                    n <= ballsLeft ? 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pinball Table Viewport */}
      <div className="relative w-full max-w-md flex-1 flex items-center justify-center my-2 rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-black">
        <canvas
          ref={canvasRef}
          width={400}
          height={540}
          className="w-full h-full object-cover"
        />

        {!isPlaying && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            {gameOver ? (
              <div className="space-y-4 max-w-sm">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-rose-500/20 text-rose-300 border border-rose-400/40">
                  PARTIE TERMINÉE
                </span>
                <h3 className="text-2xl font-black text-white font-mono tracking-tight">GAME OVER</h3>
                <div className="p-4 rounded-2xl liquid-glass-card border border-white/10 space-y-1">
                  <div className="text-xs text-slate-400 font-mono">Score Pinball</div>
                  <div className="text-3xl font-black text-yellow-300 font-mono">{score.toLocaleString()}</div>
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
                  JEU VIP PAYANT (600 VC)
                </span>
                <h2 className="text-2xl font-black text-white font-mono tracking-tight">
                  PINBALL
                </h2>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Flipper arcade cyberpunk ultra-réaliste ! Touchez les bumpers cinétiques, déclenchez les cibles multiplicatrices et battez les records de points !
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 py-2">
                  <div className="p-2 rounded-xl liquid-glass-pill">A / ← : Flipper Gauche</div>
                  <div className="p-2 rounded-xl liquid-glass-pill">D / → : Flipper Droit</div>
                  <div className="p-2 rounded-xl liquid-glass-pill">Espace : Propulser Bille</div>
                  <div className="p-2 rounded-xl liquid-glass-pill">Tactile : Écran G / D</div>
                </div>

                <button
                  onClick={startGame}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider cursor-pointer hover:from-yellow-300 hover:to-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)] active:scale-95 transition-all flex items-center gap-2 mx-auto"
                >
                  <Play className="w-4 h-4 fill-current" /> Lancer la bille
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dual Touch Controls for Left & Right Flippers */}
      <div className="w-full max-w-md flex items-center justify-between gap-4 p-2">
        <button
          onPointerDown={() => setFlipperState('left', true)}
          onPointerUp={() => setFlipperState('left', false)}
          className="flex-1 py-4 rounded-2xl bg-cyan-500/20 active:bg-cyan-500/40 border border-cyan-400/50 text-cyan-300 font-mono font-bold text-xs uppercase cursor-pointer select-none active:scale-95 transition-all shadow-md text-center"
        >
          FLIPPER GAUCHE (A)
        </button>
        <button
          onPointerDown={() => setFlipperState('right', true)}
          onPointerUp={() => setFlipperState('right', false)}
          className="flex-1 py-4 rounded-2xl bg-purple-500/20 active:bg-purple-500/40 border border-purple-400/50 text-purple-300 font-mono font-bold text-xs uppercase cursor-pointer select-none active:scale-95 transition-all shadow-md text-center"
        >
          FLIPPER DROIT (D)
        </button>
      </div>
    </div>
  );
}
