import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ArrowLeft, RotateCcw, Key } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

export default function CyberLock({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  const stateRef = useRef({
    isPlaying: false,
    score: 0,
    level: 1,
    angle: 0,
    spinSpeed: 0.05,
    spinDirection: 1, // 1 = clockwise, -1 = counter
    targetAngleStart: 1.0, // radians
    targetAngleEnd: 1.6, // radians
    lives: 3,
  });

  const highScoreRef = useRef(highScore);
  useEffect(() => {
    highScoreRef.current = highScore;
  }, [highScore]);

  const startGame = () => {
    audio.playCoin();
    setScore(0);
    setLevel(1);
    setIsEnded(false);
    setIsPlaying(true);

    stateRef.current = {
      isPlaying: true,
      score: 0,
      level: 1,
      angle: 0,
      spinSpeed: 0.04,
      spinDirection: 1,
      lives: 3,
      ...generateTarget(1, 0),
    };
  };

  const generateTarget = (lvl: number, currentAngle: number) => {
    // Generate a target arc away from current angle to be fair
    const size = Math.max(0.2, 0.9 - lvl * 0.03); // getting smaller
    const minDiff = 1.5; // radians away from current angle
    let targetStart = Math.random() * Math.PI * 2;
    
    // Make sure target is not overlapping the spinner's start position
    while (Math.abs(targetStart - currentAngle) < minDiff) {
      targetStart = Math.random() * Math.PI * 2;
    }

    return {
      targetAngleStart: targetStart,
      targetAngleEnd: targetStart + size,
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

    // Check if current angle is within target bounds
    // Normalize current angle to [0, 2PI]
    const normAngle = ((state.angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const start = state.targetAngleStart;
    const end = state.targetAngleEnd;

    let success = false;
    if (start < end) {
      success = normAngle >= start && normAngle <= end;
    } else {
      // Wraps around 2PI
      success = normAngle >= start || normAngle <= end;
    }

    if (success) {
      audio.playCoin();
      const points = 30 + state.level * 5;
      state.score += points;
      state.level += 1;
      setScore(state.score);
      setLevel(state.level);
      onScore(points);

      // reverse speed, increase it, make a new target
      state.spinDirection *= -1;
      state.spinSpeed = Math.min(0.09, 0.045 + state.level * 0.003);
      
      const newTarget = generateTarget(state.level, normAngle);
      state.targetAngleStart = newTarget.targetAngleStart;
      state.targetAngleEnd = newTarget.targetAngleEnd;
    } else {
      audio.playHit();
      state.lives--;
      if (state.lives <= 0) {
        triggerGameOver();
      } else {
        // Shorter fail animation or screen flash, but keep going
        state.spinDirection *= -1;
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

      // Rotate pointer
      state.angle = (state.angle + state.spinSpeed * state.spinDirection) % (Math.PI * 2);

      draw(ctx, canvas);
      animId = requestAnimationFrame(update);
    };

    const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const state = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep celestial black bg
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = 100;

      // Draw beautiful mechanical glowing outer golden ring
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#fbbf24';
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.15)';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      if (state.isPlaying) {
        // Draw target zone (Glowing golden/orange arc)
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#f59e0b';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 16;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, state.targetAngleStart, state.targetAngleEnd, false);
        ctx.stroke();

        // Draw indicator points/runes inside the circle to feel magical
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
        for (let i = 0; i < 8; i++) {
          const rAngle = (i * Math.PI) / 4;
          const rx = cx + Math.cos(rAngle) * (radius - 24);
          const ry = cy + Math.sin(rAngle) * (radius - 24);
          ctx.beginPath();
          ctx.arc(rx, ry, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw pointer (Laser scanner)
        const px = cx + Math.cos(state.angle) * radius;
        const py = cy + Math.sin(state.angle) * radius;

        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffffff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(px, py);
        ctx.stroke();

        // Glowing center node
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#f59e0b';
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();

        // Center white core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Show static golden logo lock
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#eab308';
        ctx.fillStyle = 'rgba(234, 179, 8, 0.05)';
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, radius - 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#eab308';
        ctx.shadowBlur = 10;
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText("SYSTÈME SÉCURISÉ", cx, cy - 20);
        ctx.fillText("DIVIN V.9", cx, cy + 30);
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
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, isEnded]);

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-4 border-yellow-400 shadow-[0_0_35px_rgba(234,179,8,0.6)] text-white relative overflow-hidden">
      {/* Absolute top badge for DIVIN rarity */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-amber-600 border-b-2 border-x-2 border-yellow-300 px-4 py-0.5 rounded-b-xl shadow-[0_0_15px_rgba(234,179,8,0.6)] text-[9px] font-black tracking-widest text-white uppercase animate-pulse">
        ⭐ JEU DIVIN ⭐
      </div>

      <div className="absolute -top-24 -left-24 w-48 h-48 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 mt-2 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-yellow-400 hover:text-yellow-200 transition-colors bg-yellow-950/40 px-3 py-1.5 rounded-lg border border-yellow-800"
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-2 text-yellow-400 font-mono">
          <Trophy size={18} />
          <span className="text-sm tracking-wide">Record: {highScore} PX</span>
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-2xl font-black font-sans tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 uppercase drop-shadow-[0_0_12px_rgba(234,179,8,0.8)]">
          Hacker de Verrou
        </h2>
        <p className="text-xs text-slate-300 mt-1 font-mono">
          CLIQUEZ PILE AU MOMENT OÙ LE LASER EST DANS LA ZONE LUMINEUSE !
        </p>
      </div>

      {/* Score Panel */}
      <div className="grid grid-cols-3 gap-3 mb-4 font-mono text-center relative z-10">
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SCORE</p>
          <p className="text-base font-bold text-yellow-400">{score} PX</p>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">NIVEAU</p>
          <p className="text-base font-bold text-amber-400">LVL {level}</p>
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
        <div className="relative border-4 border-yellow-500/40 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(234,179,8,0.2)]">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            onClick={handleAction}
            className="w-full max-w-[300px] aspect-square bg-slate-950 cursor-pointer block"
          />

          {/* Overlays */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col justify-center items-center p-6 text-center font-mono">
              {!isEnded ? (
                <>
                  <p className="text-xs text-yellow-400 mb-6 font-bold uppercase tracking-widest animate-pulse max-w-[200px] leading-relaxed">
                    FORCE LE SYSTÈME DE SÉCURITÉ CRYPTÉ DE L'EMPEREUR DE L'ARCADE !
                  </p>
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 via-amber-600 to-yellow-500 hover:from-yellow-400 hover:to-amber-500 text-white font-mono font-black py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.6)] transition-all transform active:scale-95 text-xs tracking-widest border border-yellow-300"
                  >
                    HACKER LE VERROU
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-red-500 mb-2 font-bold uppercase tracking-widest">
                    PIRATAGE ÉCHOUÉ !
                  </p>
                  <p className="text-xs text-slate-400 mb-6"> Score Final : {score} PX </p>
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 via-amber-600 to-yellow-500 hover:from-yellow-400 hover:to-amber-500 text-white font-mono font-bold py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.6)] transition-all transform active:scale-95 text-xs tracking-widest border border-yellow-300"
                  >
                    <RotateCcw size={14} /> RÉESSAYER
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
            className="w-full max-w-[300px] mt-4 py-3.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-mono font-extrabold text-sm shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.6)] active:scale-95 transition-all cursor-pointer tracking-widest border border-yellow-300/30"
          >
            🔥 CLIQUE / TOURNE !
          </button>
        )}
      </div>
    </div>
  );
}
