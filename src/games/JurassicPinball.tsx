import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trophy, Zap, Sparkles, Volume2, Shield, Flame } from 'lucide-react';
import { audio } from '../utils/audio';

interface JurassicPinballProps {
  onScore: (score: number) => void;
  onGameOver: (score: number) => void;
  onBack: () => void;
  highScore: number;
}

interface Bumper {
  x: number;
  y: number;
  radius: number;
  points: number;
  color: string;
  glow: string;
  hitTimer: number;
  label: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

export const JurassicPinball: React.FC<JurassicPinballProps> = ({
  onScore,
  onGameOver,
  onBack,
  highScore
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [ballsLeft, setBallsLeft] = useState<number>(3);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [jackpotReady, setJackpotReady] = useState<boolean>(false);

  // Table & Ball state
  const stateRef = useRef({
    ball: {
      x: 395,
      y: 450,
      vx: 0,
      vy: 0,
      radius: 8.5,
      inPlunger: true
    },
    leftFlipper: {
      x: 140,
      y: 530,
      length: 65,
      angle: 0.35,
      restAngle: 0.35,
      upAngle: -0.55,
      isUp: false
    },
    rightFlipper: {
      x: 270,
      y: 530,
      length: 65,
      angle: Math.PI - 0.35,
      restAngle: Math.PI - 0.35,
      upAngle: Math.PI + 0.55,
      isUp: false
    },
    bumpers: [
      { x: 150, y: 150, radius: 24, points: 100, color: '#f59e0b', glow: '#fbbf24', hitTimer: 0, label: 'AMBRE' },
      { x: 260, y: 150, radius: 24, points: 100, color: '#ef4444', glow: '#f87171', hitTimer: 0, label: 'LAVE' },
      { x: 205, y: 230, radius: 28, points: 250, color: '#06b6d4', glow: '#67e8f9', hitTimer: 0, label: 'T-REX' },
      { x: 120, y: 320, radius: 18, points: 50, color: '#10b981', glow: '#34d399', hitTimer: 0, label: 'RAPTOR' },
      { x: 290, y: 320, radius: 18, points: 50, color: '#8b5cf6', glow: '#a78bfa', hitTimer: 0, label: 'VOLT' }
    ] as Bumper[],
    particles: [] as Particle[],
    score: 0,
    ballsLeft: 3,
    multiplier: 1,
    isPlaying: false,
    comboCount: 0,
    lastHitTime: 0
  });

  const launchBall = useCallback(() => {
    const s = stateRef.current;
    if (s.ball.inPlunger && s.isPlaying) {
      s.ball.inPlunger = false;
      s.ball.vy = -17 - Math.random() * 3;
      s.ball.vx = -1.5;
      audio.playLaser();
    }
  }, []);

  const triggerLeftFlipper = useCallback((isUp: boolean) => {
    stateRef.current.leftFlipper.isUp = isUp;
    if (isUp) audio.playClick();
  }, []);

  const triggerRightFlipper = useCallback((isUp: boolean) => {
    stateRef.current.rightFlipper.isUp = isUp;
    if (isUp) audio.playClick();
  }, []);

  // Keyboard bindings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A' || e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        triggerLeftFlipper(true);
      }
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        triggerRightFlipper(true);
      }
      if (e.code === 'Space' || e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        launchBall();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A' || e.key === 'q' || e.key === 'Q') {
        triggerLeftFlipper(false);
      }
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        triggerRightFlipper(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerLeftFlipper, triggerRightFlipper, launchBall]);

  const startGame = () => {
    stateRef.current = {
      ball: {
        x: 395,
        y: 450,
        vx: 0,
        vy: 0,
        radius: 8.5,
        inPlunger: true
      },
      leftFlipper: {
        x: 140,
        y: 530,
        length: 65,
        angle: 0.35,
        restAngle: 0.35,
        upAngle: -0.55,
        isUp: false
      },
      rightFlipper: {
        x: 270,
        y: 530,
        length: 65,
        angle: Math.PI - 0.35,
        restAngle: Math.PI - 0.35,
        upAngle: Math.PI + 0.55,
        isUp: false
      },
      bumpers: [
        { x: 150, y: 150, radius: 24, points: 100, color: '#f59e0b', glow: '#fbbf24', hitTimer: 0, label: 'AMBRE' },
        { x: 260, y: 150, radius: 24, points: 100, color: '#ef4444', glow: '#f87171', hitTimer: 0, label: 'LAVE' },
        { x: 205, y: 230, radius: 28, points: 250, color: '#06b6d4', glow: '#67e8f9', hitTimer: 0, label: 'T-REX' },
        { x: 120, y: 320, radius: 18, points: 50, color: '#10b981', glow: '#34d399', hitTimer: 0, label: 'RAPTOR' },
        { x: 290, y: 320, radius: 18, points: 50, color: '#8b5cf6', glow: '#a78bfa', hitTimer: 0, label: 'VOLT' }
      ],
      particles: [],
      score: 0,
      ballsLeft: 3,
      multiplier: 1,
      isPlaying: true,
      comboCount: 0,
      lastHitTime: 0
    };

    setScore(0);
    setBallsLeft(3);
    setMultiplier(1);
    setIsGameOver(false);
    setIsPlaying(true);
    audio.playStart();
  };

  // Main Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateAndDraw = () => {
      const s = stateRef.current;

      if (s.isPlaying) {
        // Update Flippers Smoothly
        const lf = s.leftFlipper;
        const targetLAngle = lf.isUp ? lf.upAngle : lf.restAngle;
        lf.angle += (targetLAngle - lf.angle) * 0.45;

        const rf = s.rightFlipper;
        const targetRAngle = rf.isUp ? rf.upAngle : rf.restAngle;
        rf.angle += (targetRAngle - rf.angle) * 0.45;

        // Ball Physics
        const b = s.ball;
        if (!b.inPlunger) {
          // Gravity
          b.vy += 0.28;
          b.vx *= 0.995;
          b.vy *= 0.995;

          b.x += b.vx;
          b.y += b.vy;

          // Wall Collisions
          // Left Wall
          if (b.x - b.radius < 30) {
            b.x = 30 + b.radius;
            b.vx = Math.abs(b.vx) * 0.75;
            audio.playLaser();
          }
          // Top Curved Arch
          if (b.y - b.radius < 40) {
            b.y = 40 + b.radius;
            b.vy = Math.abs(b.vy) * 0.75;
            audio.playLaser();
          }
          // Right Divider Wall (between playfield and plunger lane)
          if (b.x + b.radius > 375 && b.y > 100) {
            b.x = 375 - b.radius;
            b.vx = -Math.abs(b.vx) * 0.75;
            audio.playLaser();
          }
          // Plunger outer right wall
          if (b.x + b.radius > 410) {
            b.x = 410 - b.radius;
            b.vx = -Math.abs(b.vx) * 0.75;
          }

          // Collisions with Bumpers
          for (const bmp of s.bumpers) {
            if (bmp.hitTimer > 0) bmp.hitTimer--;

            const dx = b.x - bmp.x;
            const dy = b.y - bmp.y;
            const dist = Math.hypot(dx, dy);

            if (dist < b.radius + bmp.radius) {
              // Bounce angle
              const angle = Math.atan2(dy, dx);
              const speed = Math.max(9, Math.hypot(b.vx, b.vy) * 1.25);
              b.vx = Math.cos(angle) * speed;
              b.vy = Math.sin(angle) * speed;

              // Register points & combo
              bmp.hitTimer = 15;
              const pts = bmp.points * s.multiplier;
              s.score += pts;
              s.comboCount++;
              setScore(s.score);
              onScore(s.score);

              audio.playPixelScore();

              if (s.comboCount % 4 === 0) {
                s.multiplier = Math.min(6, s.multiplier + 1);
                setMultiplier(s.multiplier);
              }

              // Spark particles
              for (let k = 0; k < 10; k++) {
                s.particles.push({
                  x: bmp.x + Math.cos(angle) * bmp.radius,
                  y: bmp.y + Math.sin(angle) * bmp.radius,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  color: bmp.color,
                  size: Math.random() * 4 + 2,
                  life: 25
                });
              }
            }
          }

          // Collision with Left Flipper (Segment test)
          const lEndX = lf.x + Math.cos(lf.angle) * lf.length;
          const lEndY = lf.y + Math.sin(lf.angle) * lf.length;
          const distToLF = distToSegment(b.x, b.y, lf.x, lf.y, lEndX, lEndY);
          if (distToLF < b.radius + 6) {
            b.y -= 4;
            const flipPower = lf.isUp ? -14 : -7;
            b.vy = flipPower;
            b.vx = (b.x - lf.x) * 0.15;
            audio.playHit();
          }

          // Collision with Right Flipper (Segment test)
          const rEndX = rf.x + Math.cos(rf.angle) * rf.length;
          const rEndY = rf.y + Math.sin(rf.angle) * rf.length;
          const distToRF = distToSegment(b.x, b.y, rf.x, rf.y, rEndX, rEndY);
          if (distToRF < b.radius + 6) {
            b.y -= 4;
            const flipPower = rf.isUp ? -14 : -7;
            b.vy = flipPower;
            b.vx = -(rf.x - b.x) * 0.15;
            audio.playHit();
          }

          // Slingshots (Angled bumpers near flippers)
          // Left Slingshot
          if (b.x > 60 && b.x < 110 && b.y > 420 && b.y < 480) {
            b.vx = 8;
            b.vy = -8;
            s.score += 75 * s.multiplier;
            setScore(s.score);
            audio.playPixelScore();
          }
          // Right Slingshot
          if (b.x > 295 && b.x < 345 && b.y > 420 && b.y < 480) {
            b.vx = -8;
            b.vy = -8;
            s.score += 75 * s.multiplier;
            setScore(s.score);
            audio.playPixelScore();
          }

          // Ball Out (Drain)
          if (b.y > 600) {
            s.ballsLeft--;
            setBallsLeft(s.ballsLeft);
            audio.playGameOver();

            if (s.ballsLeft <= 0) {
              s.isPlaying = false;
              setIsPlaying(false);
              setIsGameOver(true);
              onGameOver(s.score);
            } else {
              // Reset Ball in plunger
              b.x = 395;
              b.y = 450;
              b.vx = 0;
              b.vy = 0;
              b.inPlunger = true;
            }
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

      // RENDER CANVAS
      ctx.clearRect(0, 0, 420, 600);

      // 1. Table Background (Jurassic Prehistoric Cyber Table)
      const bgGrad = ctx.createLinearGradient(0, 0, 420, 600);
      bgGrad.addColorStop(0, '#110519');
      bgGrad.addColorStop(0.5, '#2e0a0a');
      bgGrad.addColorStop(1, '#090514');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 420, 600);

      // Top Arch Visual
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.arc(205, 120, 180, Math.PI, Math.PI * 2);
      ctx.fill();

      // Ambient Cyber Grid on Table
      ctx.strokeStyle = 'rgba(245,158,11,0.12)';
      ctx.lineWidth = 1;
      for (let x = 30; x < 380; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 40);
        ctx.lineTo(x, 560);
        ctx.stroke();
      }
      for (let y = 40; y < 560; y += 30) {
        ctx.beginPath();
        ctx.moveTo(30, y);
        ctx.lineTo(380, y);
        ctx.stroke();
      }

      // Outer Metal Rails
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#d97706';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(30, 560);
      ctx.lineTo(30, 140);
      ctx.arc(205, 140, 175, Math.PI, Math.PI * 2);
      ctx.lineTo(380, 560);
      ctx.stroke();

      // Plunger Lane Divider
      ctx.strokeStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(375, 140);
      ctx.lineTo(375, 560);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Slingshots
      // Left Slingshot
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(40, 420);
      ctx.lineTo(95, 470);
      ctx.lineTo(40, 490);
      ctx.closePath();
      ctx.fill();

      // Right Slingshot
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(365, 420);
      ctx.lineTo(310, 470);
      ctx.lineTo(365, 490);
      ctx.closePath();
      ctx.fill();

      // 2. Draw Bumpers
      for (const bmp of s.bumpers) {
        ctx.save();
        const isHit = bmp.hitTimer > 0;
        ctx.shadowColor = bmp.glow;
        ctx.shadowBlur = isHit ? 30 : 15;
        ctx.fillStyle = isHit ? '#ffffff' : bmp.color;
        ctx.beginPath();
        ctx.arc(bmp.x, bmp.y, bmp.radius + (isHit ? 3 : 0), 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#000000';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(bmp.label, bmp.x, bmp.y + 3);
        ctx.restore();
      }

      // 3. Draw Flippers
      // Left Flipper
      ctx.save();
      const lf = s.leftFlipper;
      ctx.translate(lf.x, lf.y);
      ctx.rotate(lf.angle);
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 15;
      ctx.fillRect(0, -6, lf.length, 12);
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.arc(lf.length, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Right Flipper
      ctx.save();
      const rf = s.rightFlipper;
      ctx.translate(rf.x, rf.y);
      ctx.rotate(rf.angle);
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 15;
      ctx.fillRect(0, -6, rf.length, 12);
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.arc(rf.length, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 4. Draw Ball
      const b = s.ball;
      ctx.save();
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 20;
      const ballGrad = ctx.createRadialGradient(b.x - 2, b.y - 2, 1, b.x, b.y, b.radius);
      ballGrad.addColorStop(0, '#ffffff');
      ballGrad.addColorStop(0.5, '#7dd3fc');
      ballGrad.addColorStop(1, '#0284c7');
      ctx.fillStyle = ballGrad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 5. Draw Particles
      for (const pt of s.particles) {
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(updateAndDraw);
    };

    animId = requestAnimationFrame(updateAndDraw);
    return () => cancelAnimationFrame(animId);
  }, [onScore, onGameOver]);

  // Distance helper from point to line segment
  function distToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
    const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center select-none font-mono">
      {/* Header */}
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

          <div className="px-3 py-1 bg-amber-950 border border-amber-500/80 rounded-xl text-amber-400 text-xs font-black flex items-center gap-1.5">
            <span>BILLES: {'⚡'.repeat(ballsLeft)}</span>
            {multiplier > 1 && <span className="text-rose-400 font-black">x{multiplier}</span>}
          </div>
        </div>
      </div>

      {/* Pinball Cabinet Screen */}
      <div className="relative w-[420px] h-[600px] bg-slate-950 rounded-3xl border-4 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.4)] overflow-hidden">
        <canvas
          ref={canvasRef}
          width={420}
          height={600}
          className="w-full h-full block"
        />

        {/* Live Score Display */}
        {isPlaying && (
          <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur border border-amber-500/60 px-4 py-2 rounded-2xl pointer-events-none">
            <span className="text-[9px] text-amber-400 font-black tracking-widest block uppercase">SCORE PINBALL</span>
            <span className="text-2xl font-black text-white">{score}</span>
          </div>
        )}

        {/* Plunger Prompt */}
        {isPlaying && stateRef.current.ball.inPlunger && (
          <div className="absolute bottom-6 right-6 animate-bounce pointer-events-none">
            <div className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-black text-xs rounded-xl shadow-lg">
              ESPACE POUR LANCER ! 🚀
            </div>
          </div>
        )}

        {/* Overlay start/game over */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center max-w-sm"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 text-3xl mb-3 shadow-[0_0_30px_rgba(245,158,11,0.6)]">
                🦕
              </div>

              <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-yellow-300 uppercase tracking-wider mb-1">
                {isGameOver ? 'PARTIE TERMINÉE' : 'JURASSIC CYBER PINBALL'}
              </h2>

              <p className="text-xs text-slate-300 font-sans mb-4">
                {isGameOver
                  ? `Score final : ${score} PTS !`
                  : 'Activez les flippers, déclenchez les bumpers T-Rex et maintenez la bille dans la zone de jackpot !'}
              </p>

              <button
                onClick={startGame}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.6)] transition transform hover:scale-105 cursor-pointer flex items-center gap-2"
              >
                <Zap size={18} /> {isGameOver ? 'REJOUER LE FLIPPER' : 'LANCER LA PARTIE'}
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Touch Flipper Buttons */}
      <div className="w-[420px] flex justify-between items-center mt-3 gap-3">
        <button
          onPointerDown={() => triggerLeftFlipper(true)}
          onPointerUp={() => triggerLeftFlipper(false)}
          onPointerLeave={() => triggerLeftFlipper(false)}
          className="flex-1 py-4 bg-gradient-to-t from-slate-900 to-slate-800 border-2 border-amber-500/70 active:bg-amber-500 active:text-slate-950 text-amber-400 font-black text-sm uppercase rounded-2xl transition cursor-pointer shadow-lg active:scale-95"
        >
          ⬅️ FLIPPER GAUCHE (Q/A)
        </button>

        <button
          onClick={launchBall}
          className="px-4 py-4 bg-cyan-950 border-2 border-cyan-500 text-cyan-300 font-black text-xs uppercase rounded-2xl active:scale-95 transition cursor-pointer"
          title="Lancer la bille"
        >
          🚀 LANCER
        </button>

        <button
          onPointerDown={() => triggerRightFlipper(true)}
          onPointerUp={() => triggerRightFlipper(false)}
          onPointerLeave={() => triggerRightFlipper(false)}
          className="flex-1 py-4 bg-gradient-to-t from-slate-900 to-slate-800 border-2 border-amber-500/70 active:bg-amber-500 active:text-slate-950 text-amber-400 font-black text-sm uppercase rounded-2xl transition cursor-pointer shadow-lg active:scale-95"
        >
          FLIPPER DROIT (D) ➡️
        </button>
      </div>
    </div>
  );
};

export default JurassicPinball;
