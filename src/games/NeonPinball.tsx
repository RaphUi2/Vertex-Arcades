import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Trophy, RotateCcw, Zap, Sparkles, Shield, Disc } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

interface Bumper {
  x: number;
  y: number;
  r: number;
  color: string;
  points: number;
  hitTimer: number;
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

export default function NeonPinball({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [ballsLeft, setBallsLeft] = useState(3);
  const [multiplier, setMultiplier] = useState(1);

  const stateRef = useRef({
    isPlaying: false,
    score: 0,
    multiplier: 1,
    ballsLeft: 3,
    ball: {
      x: 340,
      y: 440,
      vx: 0,
      vy: 0,
      r: 8,
      inPlunger: true
    },
    leftFlipperAngle: 0.4, // radians
    rightFlipperAngle: -0.4,
    leftFlipperActive: false,
    rightFlipperActive: false,
    bumpers: [
      { x: 140, y: 150, r: 24, color: '#06b6d4', points: 150, hitTimer: 0 },
      { x: 260, y: 150, r: 24, color: '#ec4899', points: 150, hitTimer: 0 },
      { x: 200, y: 230, r: 28, color: '#eab308', points: 250, hitTimer: 0 },
      { x: 100, y: 280, r: 18, color: '#a855f7', points: 100, hitTimer: 0 },
      { x: 300, y: 280, r: 18, color: '#a855f7', points: 100, hitTimer: 0 }
    ] as Bumper[],
    particles: [] as Particle[]
  });

  const launchBall = () => {
    const st = stateRef.current;
    if (st.ball.inPlunger && st.isPlaying) {
      st.ball.inPlunger = false;
      st.ball.vy = -14 - Math.random() * 3;
      st.ball.vx = -1.5 + (Math.random() - 0.5) * 2;
      audio.playLaser();
    }
  };

  const startNewGame = () => {
    audio.playCoin();
    setScore(0);
    setBallsLeft(3);
    setMultiplier(1);
    setIsEnded(false);
    setIsPlaying(true);

    stateRef.current = {
      isPlaying: true,
      score: 0,
      multiplier: 1,
      ballsLeft: 3,
      ball: {
        x: 360,
        y: 440,
        vx: 0,
        vy: 0,
        r: 8,
        inPlunger: true
      },
      leftFlipperAngle: 0.4,
      rightFlipperAngle: -0.4,
      leftFlipperActive: false,
      rightFlipperActive: false,
      bumpers: [
        { x: 140, y: 150, r: 24, color: '#06b6d4', points: 150, hitTimer: 0 },
        { x: 260, y: 150, r: 24, color: '#ec4899', points: 150, hitTimer: 0 },
        { x: 200, y: 230, r: 28, color: '#eab308', points: 250, hitTimer: 0 },
        { x: 100, y: 280, r: 18, color: '#a855f7', points: 100, hitTimer: 0 },
        { x: 300, y: 280, r: 18, color: '#a855f7', points: 100, hitTimer: 0 }
      ],
      particles: []
    };
  };

  const triggerGameOver = () => {
    stateRef.current.isPlaying = false;
    setIsPlaying(false);
    setIsEnded(true);
    audio.playGameOver();
    onGameOver(stateRef.current.score);
  };

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const st = stateRef.current;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        st.leftFlipperActive = true;
        if (st.isPlaying) audio.playClick();
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        st.rightFlipperActive = true;
        if (st.isPlaying) audio.playClick();
      }
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        if (!st.isPlaying && !isEnded) {
          startNewGame();
        } else if (st.ball.inPlunger) {
          launchBall();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const st = stateRef.current;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        st.leftFlipperActive = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        st.rightFlipperActive = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isEnded]);

  // Main Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const gameLoop = () => {
      const st = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cyber Pinball Board Background
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Outer Neon Frame
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;

      // Board contour
      ctx.beginPath();
      ctx.moveTo(380, 500);
      ctx.lineTo(380, 100);
      ctx.arcTo(380, 20, 320, 20, 60);
      ctx.arcTo(20, 20, 20, 100, 60);
      ctx.lineTo(20, 420);
      ctx.lineTo(110, 480);
      ctx.lineTo(270, 480);
      ctx.lineTo(340, 420);
      ctx.lineTo(340, 500);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Plunger Lane Divider
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(340, 150);
      ctx.lineTo(340, 500);
      ctx.stroke();

      if (st.isPlaying) {
        // Update Flippers physics angles
        const targetLeft = st.leftFlipperActive ? -0.4 : 0.4;
        st.leftFlipperAngle += (targetLeft - st.leftFlipperAngle) * 0.35;

        const targetRight = st.rightFlipperActive ? 0.4 : -0.4;
        st.rightFlipperAngle += (targetRight - st.rightFlipperAngle) * 0.35;

        // Ball Physics
        const ball = st.ball;
        if (!ball.inPlunger) {
          ball.vy += 0.28; // Gravity
          ball.x += ball.vx;
          ball.y += ball.vy;

          // Air friction
          ball.vx *= 0.995;
          ball.vy *= 0.995;

          // Side Walls Collision
          if (ball.x - ball.r < 22) {
            ball.x = 22 + ball.r;
            ball.vx = Math.abs(ball.vx) * 0.8;
            audio.playClick();
          }
          if (ball.x + ball.r > 338 && ball.y > 150) {
            ball.x = 338 - ball.r;
            ball.vx = -Math.abs(ball.vx) * 0.8;
            audio.playClick();
          } else if (ball.x + ball.r > 378 && ball.y <= 150) {
            ball.x = 378 - ball.r;
            ball.vx = -Math.abs(ball.vx) * 0.8;
            audio.playClick();
          }

          // Top Curve Collision
          if (ball.y - ball.r < 30) {
            ball.y = 30 + ball.r;
            ball.vy = Math.abs(ball.vy) * 0.8;
            audio.playClick();
          }

          // Bumper Collisions
          st.bumpers.forEach(bmp => {
            const dx = ball.x - bmp.x;
            const dy = ball.y - bmp.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < ball.r + bmp.r) {
              // Hit bumper!
              const angle = Math.atan2(dy, dx);
              const bounceForce = 9;
              ball.vx = Math.cos(angle) * bounceForce;
              ball.vy = Math.sin(angle) * bounceForce;

              bmp.hitTimer = 10;
              const pts = bmp.points * st.multiplier;
              st.score += pts;
              setScore(st.score);
              onScore(st.score);
              audio.playHit();

              // Spawn hit particles
              for (let i = 0; i < 10; i++) {
                st.particles.push({
                  x: bmp.x + Math.cos(angle) * bmp.r,
                  y: bmp.y + Math.sin(angle) * bmp.r,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  color: bmp.color,
                  size: Math.random() * 4 + 2,
                  life: 1.0
                });
              }
            }

            if (bmp.hitTimer > 0) bmp.hitTimer -= 1;
          });

          // Flippers Collision
          // Left Flipper Pivot (110, 470), Length 65
          const lPivotX = 110;
          const lPivotY = 470;
          const lEndX = lPivotX + Math.cos(st.leftFlipperAngle) * 60;
          const lEndY = lPivotY + Math.sin(st.leftFlipperAngle) * 60;

          // Check proximity to left flipper
          const lDx = ball.x - lPivotX;
          const lDy = ball.y - lPivotY;
          const lDist = Math.sqrt(lDx * lDx + lDy * lDy);
          if (lDist < 65 && ball.y > 450 && ball.y < 490 && ball.x < 180) {
            ball.vy = st.leftFlipperActive ? -13 : -6;
            ball.vx = 4 + Math.random() * 2;
            audio.playClick();
          }

          // Right Flipper Pivot (270, 470)
          const rPivotX = 270;
          const rPivotY = 470;
          const rDx = ball.x - rPivotX;
          const rDy = ball.y - rPivotY;
          const rDist = Math.sqrt(rDx * rDx + rDy * rDy);
          if (rDist < 65 && ball.y > 450 && ball.y < 490 && ball.x > 200) {
            ball.vy = st.rightFlipperActive ? -13 : -6;
            ball.vx = -4 - Math.random() * 2;
            audio.playClick();
          }

          // Drain Check (Ball dropped below flippers)
          if (ball.y > 510) {
            audio.playExplosion();
            st.ballsLeft -= 1;
            setBallsLeft(st.ballsLeft);

            if (st.ballsLeft <= 0) {
              triggerGameOver();
            } else {
              // Reset to plunger
              ball.x = 360;
              ball.y = 440;
              ball.vx = 0;
              ball.vy = 0;
              ball.inPlunger = true;
            }
          }
        }
      }

      // Draw Bumpers
      st.bumpers.forEach(bmp => {
        ctx.fillStyle = bmp.color;
        ctx.shadowColor = bmp.color;
        ctx.shadowBlur = bmp.hitTimer > 0 ? 25 : 12;

        ctx.beginPath();
        ctx.arc(bmp.x, bmp.y, bmp.r + (bmp.hitTimer > 0 ? 3 : 0), 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Bumper Center Symbol
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${bmp.points}`, bmp.x, bmp.y);

        ctx.shadowBlur = 0;
      });

      // Draw Flippers
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';

      // Left Flipper
      ctx.strokeStyle = st.leftFlipperActive ? '#ec4899' : '#06b6d4';
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(110, 470);
      ctx.lineTo(110 + Math.cos(st.leftFlipperAngle) * 60, 470 + Math.sin(st.leftFlipperAngle) * 60);
      ctx.stroke();

      // Right Flipper
      ctx.strokeStyle = st.rightFlipperActive ? '#ec4899' : '#06b6d4';
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(270, 470);
      ctx.lineTo(270 + Math.cos(st.rightFlipperAngle) * 60, 470 + Math.sin(st.rightFlipperAngle) * 60);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Particles
      for (let i = st.particles.length - 1; i >= 0; i--) {
        const p = st.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.04;

        if (p.life <= 0) {
          st.particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Draw Ball
      const ball = st.ball;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 font-mono">
      {/* Top Header */}
      <div className="w-full max-w-lg flex items-center justify-between mb-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs">
        <button
          onClick={() => { audio.playClick(); onBack(); }}
          className="flex items-center gap-1 text-slate-400 hover:text-white font-bold cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800"
        >
          <ArrowLeft size={14} /> QUITTER
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-rose-400 font-bold">
            <Disc size={14} /> BILLES: {ballsLeft}
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Trophy size={14} /> BEST: {highScore}
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400 font-black">
            <Zap size={14} /> {score}
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative border-2 border-cyan-500/80 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.3)] bg-slate-950">
        <canvas
          ref={canvasRef}
          width={400}
          height={520}
          className="block w-full max-w-[400px] h-auto touch-none"
        />

        {/* Flipper touch controls on mobile */}
        {isPlaying && (
          <div className="absolute bottom-2 inset-x-2 flex justify-between gap-4 pointer-events-auto">
            <button
              onMouseDown={() => { stateRef.current.leftFlipperActive = true; audio.playClick(); }}
              onMouseUp={() => { stateRef.current.leftFlipperActive = false; }}
              onTouchStart={(e) => { e.preventDefault(); stateRef.current.leftFlipperActive = true; audio.playClick(); }}
              onTouchEnd={(e) => { e.preventDefault(); stateRef.current.leftFlipperActive = false; }}
              className="flex-1 bg-cyan-950/80 hover:bg-cyan-800/80 border border-cyan-500/80 active:bg-pink-600 text-cyan-300 font-black py-4 rounded-xl text-xs uppercase tracking-wider select-none"
            >
              ◀ FLIPPER GAUCHE [A / ◄]
            </button>

            {stateRef.current.ball.inPlunger && (
              <button
                onClick={launchBall}
                className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black px-4 py-4 rounded-xl text-xs uppercase tracking-wider animate-pulse shadow-lg"
              >
                🚀 TIREUR
              </button>
            )}

            <button
              onMouseDown={() => { stateRef.current.rightFlipperActive = true; audio.playClick(); }}
              onMouseUp={() => { stateRef.current.rightFlipperActive = false; }}
              onTouchStart={(e) => { e.preventDefault(); stateRef.current.rightFlipperActive = true; audio.playClick(); }}
              onTouchEnd={(e) => { e.preventDefault(); stateRef.current.rightFlipperActive = false; }}
              className="flex-1 bg-cyan-950/80 hover:bg-cyan-800/80 border border-cyan-500/80 active:bg-pink-600 text-cyan-300 font-black py-4 rounded-xl text-xs uppercase tracking-wider select-none"
            >
              FLIPPER DROIT [D / ►] ▶
            </button>
          </div>
        )}

        {/* Start Overlay */}
        {!isPlaying && !isEnded && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="p-3 bg-cyan-950/60 rounded-full border border-cyan-500 mb-3 animate-bounce">
              <Disc size={32} className="text-cyan-400" />
            </div>
            <h3 className="text-2xl font-black text-cyan-400 uppercase tracking-widest mb-1">
              PINBALL NÉON ARCADE
            </h3>
            <p className="text-xs text-slate-300 max-w-xs mb-5">
              Propulsez la bille et touchez les bumpers lumineux ! Utilisez vos flippers pour garder la bille en jeu !
            </p>
            <button
              onClick={startNewGame}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3 px-8 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-lg animate-pulse"
            >
              LANCER LA BILLE ⚡
            </button>
            <p className="text-[10px] text-slate-400 mt-3">[FLECHES / TOUCHES A & D] pour contrôler les flippers</p>
          </div>
        )}

        {/* Game Over Overlay */}
        {isEnded && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-black text-rose-500 uppercase tracking-widest mb-1">
              FIN DE PARTIE
            </h3>
            <p className="text-sm text-slate-300 mb-4">
              Score Final : <span className="text-cyan-400 font-black">{score} pts</span>
            </p>
            <button
              onClick={startNewGame}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3 px-8 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-lg flex items-center gap-2 mb-2"
            >
              <RotateCcw size={16} /> REPLAY PINBALL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
