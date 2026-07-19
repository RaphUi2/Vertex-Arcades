import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ArrowLeft, RotateCcw, Target } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

export default function NeonTarget({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  const stateRef = useRef({
    isPlaying: false,
    score: 0,
    combo: 0,
    cursorX: 150,
    cursorDir: 1, // 1 = right, -1 = left
    cursorSpeed: 4.5,
    lives: 3,
    targetWidth: 50, // critical zone width in center (total 300)
    superCriticalWidth: 15, // bullseye width
  });

  const highScoreRef = useRef(highScore);
  useEffect(() => {
    highScoreRef.current = highScore;
  }, [highScore]);

  const startGame = () => {
    audio.playCoin();
    setScore(0);
    setCombo(0);
    setIsEnded(false);
    setIsPlaying(true);

    stateRef.current = {
      isPlaying: true,
      score: 0,
      combo: 0,
      cursorX: 10,
      cursorDir: 1,
      cursorSpeed: 4.5,
      lives: 3,
      targetWidth: 50,
      superCriticalWidth: 15,
    };
  };

  const triggerGameOver = () => {
    setIsPlaying(false);
    setIsEnded(true);
    stateRef.current.isPlaying = false;
    onGameOver(stateRef.current.score);
  };

  const handleAction = () => {
    const state = stateRef.current;
    if (!state.isPlaying) {
      if (!isEnded) startGame();
      return;
    }

    const center = 150;
    const offset = Math.abs(state.cursorX - center);

    if (offset <= state.superCriticalWidth / 2) {
      // BULLSEYE! PERFECT!
      audio.playWin();
      state.combo++;
      setCombo(state.combo);

      const points = 50 + state.combo * 10;
      state.score += points;
      setScore(state.score);
      onScore(points);

      // Speed up slightly
      state.cursorSpeed = Math.min(10, state.cursorSpeed + 0.4);
    } else if (offset <= state.targetWidth / 2) {
      // Good hit
      audio.playCoin();
      state.combo = 0;
      setCombo(0);

      const points = 20;
      state.score += points;
      setScore(state.score);
      onScore(points);

      state.cursorSpeed = Math.min(10, state.cursorSpeed + 0.2);
    } else {
      // MISS!
      audio.playHit();
      state.combo = 0;
      setCombo(0);

      state.lives--;
      if (state.lives <= 0) {
        triggerGameOver();
      }
    }
  };

  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
  }, [isPlaying]);

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const update = () => {
      const state = stateRef.current;
      if (!state.isPlaying) {
        draw(ctx, canvas);
        animId = requestAnimationFrame(update);
        return;
      }

      // Move cursor
      state.cursorX += state.cursorSpeed * state.cursorDir;

      // Bounce at boundaries
      if (state.cursorX >= 290) {
        state.cursorX = 290;
        state.cursorDir = -1;
      } else if (state.cursorX <= 10) {
        state.cursorX = 10;
        state.cursorDir = 1;
      }

      draw(ctx, canvas);
      animId = requestAnimationFrame(update);
    };

    const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const state = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark futuristic slate bg
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const center = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw gauge bar track
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(10, cy - 15, canvas.width - 20, 30, 8);
      ctx.fill();

      // Draw normal zone (greenish-emerald glow)
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#10b981';
      ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
      const normWidth = state.targetWidth;
      ctx.fillRect(center - normWidth / 2, cy - 15, normWidth, 30);

      // Draw critical zone (perfect center - yellow/orange glow)
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#fbbf24';
      ctx.fillStyle = '#f59e0b';
      const critWidth = state.superCriticalWidth;
      ctx.fillRect(center - critWidth / 2, cy - 15, critWidth, 30);

      // Center line
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(center, cy - 18);
      ctx.lineTo(center, cy + 18);
      ctx.stroke();

      if (state.isPlaying) {
        // Draw moving pointer cursor (Glowing cyan line/triangle pointer)
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#22d3ee';
        ctx.strokeStyle = '#22d3ee';
        ctx.fillStyle = '#22d3ee';
        ctx.lineWidth = 4;

        // Vertical indicator line
        ctx.beginPath();
        ctx.moveTo(state.cursorX, cy - 25);
        ctx.lineTo(state.cursorX, cy + 25);
        ctx.stroke();

        // Arrow shape top and bottom
        ctx.beginPath();
        ctx.moveTo(state.cursorX - 6, cy - 30);
        ctx.lineTo(state.cursorX + 6, cy - 30);
        ctx.lineTo(state.cursorX, cy - 23);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(state.cursorX - 6, cy + 30);
        ctx.lineTo(state.cursorX + 6, cy + 30);
        ctx.lineTo(state.cursorX, cy + 23);
        ctx.closePath();
        ctx.fill();
      }

      ctx.shadowBlur = 0;
    };

    const triggerGameOver = () => {
      setIsPlaying(false);
      setIsEnded(true);
      audio.playGameOver();
      onGameOver(stateRef.current.score);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isEnded]);

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-white relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-200 transition-colors bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800"
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-2 text-yellow-400">
          <Trophy size={18} />
          <span className="font-mono text-sm tracking-wide">Record: {highScore} PX</span>
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold font-sans tracking-widest text-emerald-400 uppercase drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
          Cible Néon
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          TAPPEZ PILE QUAND LE POINTEUR DE SÉCURITÉ PASSE SUR LE BULLEYE AU CENTRE !
        </p>
      </div>

      {/* Score Panel */}
      <div className="grid grid-cols-3 gap-3 mb-4 font-mono text-center relative z-10">
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SCORE</p>
          <p className="text-base font-bold text-emerald-400">{score} PX</p>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">COMBO</p>
          <p className="text-base font-bold text-amber-400">🔥 x{combo}</p>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">VIES</p>
          <p className="text-base font-bold text-red-400">
            {isPlaying ? '❤️'.repeat(stateRef.current.lives) : '3/3'}
          </p>
        </div>
      </div>

      {/* Stage */}
      <div className="flex flex-col justify-center items-center my-2 relative z-10">
        <div className="relative border-4 border-slate-800 rounded-2xl overflow-hidden shadow-inner w-full max-w-[300px]">
          <canvas
            ref={canvasRef}
            width={300}
            height={150}
            onClick={handleAction}
            className="w-full bg-slate-950 cursor-pointer block"
          />

          {/* Overlays */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-slate-950/85 flex flex-col justify-center items-center p-6 text-center font-mono">
              {!isEnded ? (
                <>
                  <p className="text-xs text-emerald-400 mb-6 font-bold uppercase tracking-widest animate-pulse">
                    SYNCHRONISATION DU LASER...
                  </p>
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-mono font-bold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all transform active:scale-95 text-xs tracking-widest"
                  >
                    DÉMARRER
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-red-500 mb-2 font-bold uppercase tracking-widest">
                    LASER PERDU !
                  </p>
                  <p className="text-xs text-slate-400 mb-6"> Score Final : {score} PX </p>
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-mono font-bold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all transform active:scale-95 text-xs tracking-widest"
                  >
                    <RotateCcw size={14} /> REJOUER
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Button for Mobile/Clicks */}
        {isPlaying && (
          <button
            onClick={handleAction}
            className="w-full max-w-[300px] mt-4 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-mono font-extrabold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] active:scale-95 transition-all cursor-pointer tracking-widest border border-emerald-300/30"
          >
            🎯 FEU ! (CLIQUEZ)
          </button>
        )}
      </div>
    </div>
  );
}
