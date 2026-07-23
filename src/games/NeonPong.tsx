import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Trophy, RotateCcw, Zap, Shield, PlayCircle } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

export default function NeonPong({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const stateRef = useRef({
    isPlaying: false,
    score: 0,
    lives: 3,
    playerX: 160,
    paddleWidth: 80,
    paddleHeight: 12,
    aiX: 160,
    ballX: 200,
    ballY: 200,
    ballVx: 3,
    ballVy: 4,
    ballSpeed: 5,
    particles: [] as Array<{ x: number; y: number; vx: number; vy: number; color: string; life: number }>
  });

  const requestRef = useRef<number | null>(null);

  const startNewGame = () => {
    audio.playCoin();
    setScore(0);
    setLives(3);
    setIsEnded(false);
    setIsPlaying(true);

    stateRef.current = {
      isPlaying: true,
      score: 0,
      lives: 3,
      playerX: 160,
      paddleWidth: 80,
      paddleHeight: 12,
      aiX: 160,
      ballX: 200,
      ballY: 150,
      ballVx: (Math.random() > 0.5 ? 1 : -1) * 3,
      ballVy: 4,
      ballSpeed: 5,
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current || !stateRef.current.isPlaying) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      stateRef.current.playerX = Math.max(
        stateRef.current.paddleWidth / 2,
        Math.min(rect.width - stateRef.current.paddleWidth / 2, relativeX)
      );
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!canvasRef.current || !stateRef.current.isPlaying || !e.touches[0]) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const relativeX = e.touches[0].clientX - rect.left;
      stateRef.current.playerX = Math.max(
        stateRef.current.paddleWidth / 2,
        Math.min(rect.width - stateRef.current.paddleWidth / 2, relativeX)
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const state = stateRef.current;

      // Clear
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background grid lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 20) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // Center dashed net line
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      if (state.isPlaying) {
        // AI movement
        const aiTarget = state.ballX;
        const aiSpeed = 3.5 + Math.min(3, state.score * 0.05);
        if (state.aiX < aiTarget) state.aiX += Math.min(aiSpeed, aiTarget - state.aiX);
        if (state.aiX > aiTarget) state.aiX -= Math.min(aiSpeed, state.aiX - aiTarget);

        // Ball movement
        state.ballX += state.ballVx;
        state.ballY += state.ballVy;

        // Bounce left & right walls
        if (state.ballX <= 10) {
          state.ballX = 10;
          state.ballVx *= -1;
          audio.playClick();
        } else if (state.ballX >= canvas.width - 10) {
          state.ballX = canvas.width - 10;
          state.ballVx *= -1;
          audio.playClick();
        }

        // Check bounce AI Paddle (Top)
        const aiPaddleY = 25;
        if (
          state.ballY - 8 <= aiPaddleY + state.paddleHeight &&
          state.ballY + 8 >= aiPaddleY &&
          Math.abs(state.ballX - state.aiX) <= state.paddleWidth / 2 + 5
        ) {
          state.ballVy = Math.abs(state.ballVy);
          audio.playClick();
        }

        // Check bounce Player Paddle (Bottom)
        const playerPaddleY = canvas.height - 35;
        if (
          state.ballY + 8 >= playerPaddleY &&
          state.ballY - 8 <= playerPaddleY + state.paddleHeight &&
          Math.abs(state.ballX - state.playerX) <= state.paddleWidth / 2 + 5
        ) {
          // Angle based on hit location
          const offset = (state.ballX - state.playerX) / (state.paddleWidth / 2);
          state.ballVy = -Math.abs(state.ballVy);
          state.ballVx = offset * 4.5;
          state.ballSpeed = Math.min(8.5, state.ballSpeed + 0.1);

          // Add score
          const added = 10;
          state.score += added;
          setScore(state.score);
          onScore(added);
          audio.playCoin();

          // Spawn spark particles
          for (let p = 0; p < 8; p++) {
            state.particles.push({
              x: state.ballX,
              y: playerPaddleY,
              vx: (Math.random() - 0.5) * 4,
              vy: -Math.random() * 4,
              color: '#06b6d4',
              life: 1
            });
          }
        }

        // Check Missed Ball (Bottom - Player loses life)
        if (state.ballY > canvas.height + 20) {
          audio.playHit();
          state.lives -= 1;
          setLives(state.lives);

          if (state.lives <= 0) {
            triggerGameOver();
          } else {
            // Reset ball position
            state.ballX = canvas.width / 2;
            state.ballY = canvas.height / 2;
            state.ballVy = -4;
            state.ballVx = (Math.random() > 0.5 ? 1 : -1) * 3;
          }
        }

        // Check Missed Ball (Top - AI missed)
        if (state.ballY < -20) {
          audio.playCoin();
          const added = 25;
          state.score += added;
          setScore(state.score);
          onScore(added);

          // Reset ball position
          state.ballX = canvas.width / 2;
          state.ballY = canvas.height / 2;
          state.ballVy = 4;
          state.ballVx = (Math.random() > 0.5 ? 1 : -1) * 3;
        }
      }

      // Update & Draw particles
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.04;
        if (p.life <= 0) {
          state.particles.splice(i, 1);
        } else {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
          ctx.globalAlpha = 1;
        }
      }

      // Draw AI Paddle (Fuchsia)
      ctx.fillStyle = '#d946ef';
      ctx.shadowColor = '#d946ef';
      ctx.shadowBlur = 15;
      ctx.fillRect(
        state.aiX - state.paddleWidth / 2,
        25,
        state.paddleWidth,
        state.paddleHeight
      );

      // Draw Player Paddle (Cyan)
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 15;
      ctx.fillRect(
        state.playerX - state.paddleWidth / 2,
        canvas.height - 35,
        state.paddleWidth,
        state.paddleHeight
      );

      // Draw Ball
      ctx.fillStyle = '#facc15';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-white relative overflow-hidden font-mono">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-200 transition-colors bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-800 cursor-pointer"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div className="flex items-center gap-2 text-yellow-400 text-xs">
          <Trophy size={16} />
          <span>Record: {highScore} PX</span>
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-xl font-bold uppercase tracking-widest text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
          NÉON PONG
        </h2>
        <p className="text-[10px] text-slate-400">DÉPLACE TA RAQUETTE ET RENVOIE LA BALLE ÉLECTRIQUE !</p>
      </div>

      {/* Info bar */}
      <div className="flex justify-around items-center bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 mb-4 text-xs">
        <div>
          <span className="text-[10px] text-slate-500 block uppercase">Score</span>
          <span className="font-extrabold text-cyan-400 text-sm">{score} PX</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 block uppercase">Vies</span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <Shield
                key={i}
                size={14}
                className={i < lives ? "fill-cyan-400 text-cyan-400 animate-pulse" : "text-slate-800"}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex justify-center relative my-2">
        <canvas
          ref={canvasRef}
          width={340}
          height={400}
          className="bg-slate-950 rounded-xl border-2 border-slate-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] cursor-none touch-none"
        />

        {/* Start / Game Over Overlay */}
        {(!isPlaying || isEnded) && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-6 text-center">
            {isEnded ? (
              <>
                <h3 className="text-2xl font-black text-rose-500 uppercase tracking-widest mb-1 animate-pulse">GAME OVER</h3>
                <p className="text-xs text-slate-400 mb-4">SCORE FINAL : <span className="text-yellow-400 font-bold">{score} PX</span></p>
              </>
            ) : (
              <>
                <Zap size={36} className="text-cyan-400 mb-2 animate-bounce" />
                <h3 className="text-lg font-black text-cyan-400 uppercase tracking-widest mb-1">DÉFI NÉON PONG</h3>
                <p className="text-[10px] text-slate-400 max-w-xs mb-4">
                  Déplace ton curseur ou ton doigt pour faire glisser ta raquette en bas et battre l'I.A. !
                </p>
              </>
            )}

            <button
              onClick={startNewGame}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all transform active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              <RotateCcw size={16} /> {isEnded ? 'REJOUER' : 'LANCER LA PARTIE'}
            </button>
          </div>
        )}
      </div>

      {/* On-screen controls for mobile */}
      <div className="flex justify-between gap-4 mt-4">
        <button
          onMouseDown={() => { stateRef.current.playerX = Math.max(40, stateRef.current.playerX - 25); }}
          onTouchStart={() => { stateRef.current.playerX = Math.max(40, stateRef.current.playerX - 25); }}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-cyan-400 font-bold py-3 rounded-xl border border-slate-800 text-xs active:bg-cyan-950 cursor-pointer select-none"
        >
          ◄ GAUCHE
        </button>
        <button
          onMouseDown={() => { stateRef.current.playerX = Math.min(300, stateRef.current.playerX + 25); }}
          onTouchStart={() => { stateRef.current.playerX = Math.min(300, stateRef.current.playerX + 25); }}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-cyan-400 font-bold py-3 rounded-xl border border-slate-800 text-xs active:bg-cyan-950 cursor-pointer select-none"
        >
          DROITE ►
        </button>
      </div>
    </div>
  );
}
