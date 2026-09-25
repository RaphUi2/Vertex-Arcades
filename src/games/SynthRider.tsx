import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../utils/audio';
import { Play, RotateCcw, X, Music, Flame, Zap } from 'lucide-react';

interface GameProps {
  onFinish: (score: number, bonusVC?: number) => void;
  onExit: () => void;
}

export function SynthRider({ onFinish, onExit }: GameProps) {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [fever, setFever] = useState(0); // 0 to 100
  const [lastRating, setLastRating] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const notesRef = useRef<{ id: number; lane: number; y: number; hit: boolean }[]>([]);
  const hitKeys = ['KeyD', 'KeyF', 'KeyJ', 'KeyK'];

  const startGame = () => {
    audio.playStart();
    setGameState('playing');
    setScore(0);
    setCombo(0);
    setFever(0);
    setLastRating(null);
    notesRef.current = [];
  };

  const hitLane = (laneIndex: number) => {
    if (gameState !== 'playing') return;

    // Target y line is around 320px
    const targetY = 320;
    const threshold = 40;

    let foundNote = false;
    notesRef.current.forEach(note => {
      if (!note.hit && note.lane === laneIndex) {
        const diff = Math.abs(note.y - targetY);
        if (diff < threshold) {
          note.hit = true;
          foundNote = true;

          const isPerfect = diff < 16;
          audio.playCoin();
          setScore(s => s + (isPerfect ? 150 : 80) * (combo > 10 ? 2 : 1));
          setCombo(c => c + 1);
          setFever(f => Math.min(100, f + 8));
          setLastRating(isPerfect ? 'PERFECT ! 🔥' : 'GOOD 👍');
        }
      }
    });

    if (!foundNote) {
      audio.playHit();
      setCombo(0);
      setLastRating('MISS ❌');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyD') hitLane(0);
      if (e.code === 'KeyF') hitLane(1);
      if (e.code === 'KeyJ') hitLane(2);
      if (e.code === 'KeyK') hitLane(3);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, combo]);

  // Main Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let animId: number;
    let spawnTimer = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      spawnTimer++;
      // Spawn note
      if (spawnTimer % 28 === 0) {
        notesRef.current.push({
          id: Math.random(),
          lane: Math.floor(Math.random() * 4),
          y: -20,
          hit: false
        });
      }

      // Move Notes
      notesRef.current.forEach(note => {
        note.y += 5.5;

        // Auto miss if passed bottom
        if (note.y > 360 && !note.hit) {
          note.hit = true;
          setCombo(0);
          setLastRating('MISS ❌');
        }
      });

      notesRef.current = notesRef.current.filter(n => n.y < 380);

      // RENDER
      ctx.fillStyle = '#110619';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const laneWidth = 100;
      const startX = (canvas.width - laneWidth * 4) / 2;

      // Draw 4 Lanes
      const laneColors = ['#06b6d4', '#ec4899', '#a855f7', '#f59e0b'];
      for (let i = 0; i < 4; i++) {
        const lx = startX + i * laneWidth;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(30, 15, 45, 0.5)' : 'rgba(20, 10, 35, 0.5)';
        ctx.fillRect(lx, 0, laneWidth, canvas.height);
        ctx.strokeStyle = 'rgba(217, 70, 239, 0.2)';
        ctx.strokeRect(lx, 0, laneWidth, canvas.height);

        // Key label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px monospace';
        ctx.fillText(['D', 'F', 'J', 'K'][i], lx + 42, 355);
      }

      // Hit Target Line (y = 320)
      ctx.strokeStyle = fever >= 100 ? '#f43f5e' : '#e879f9';
      ctx.lineWidth = fever >= 100 ? 5 : 3;
      ctx.beginPath();
      ctx.moveTo(startX, 320);
      ctx.lineTo(startX + laneWidth * 4, 320);
      ctx.stroke();

      // Draw Falling Notes
      notesRef.current.forEach(note => {
        if (!note.hit) {
          const nx = startX + note.lane * laneWidth + 10;
          ctx.fillStyle = laneColors[note.lane];
          ctx.fillRect(nx, note.y, laneWidth - 20, 18);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.strokeRect(nx, note.y, laneWidth - 20, 18);
        }
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, fever, onFinish]);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[#13071c] border-2 border-pink-500/50 rounded-3xl p-6 shadow-[0_0_40px_rgba(236,72,153,0.3)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-pink-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-400 flex items-center justify-center text-pink-300 font-bold text-lg">
            🎵
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">SynthRider: Neon Beat Drop</h2>
            <p className="text-xs text-pink-400 font-mono">Combo: x{combo} • Touches : D - F - J - K</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-mono font-bold">
          {lastRating && (
            <span className="text-yellow-300 font-black animate-bounce">{lastRating}</span>
          )}
          <div className="text-cyan-300">Score: {score}</div>
          <button
            onClick={() => {
              audio.playWin();
              onFinish(score, 30);
            }}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
          >
            Terminer
          </button>
          <button onClick={onExit} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-pink-900/60 bg-[#110619] flex justify-center">
        <canvas ref={canvasRef} width={800} height={380} className="w-full max-w-[800px] h-auto block" />

        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 font-mono mb-2">
              SYNTHRIDER BEAT DROP
            </h3>
            <p className="text-slate-300 text-sm max-w-md mb-6">
              Frappez les notes en rythme avec les touches <strong>D, F, J, K</strong> lorsqu'elles traversent la ligne de battement !
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(236,72,153,0.5)] cursor-pointer flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" /> LANCER LE RYTHME
            </button>
          </div>
        )}
      </div>

      {/* On-screen touch buttons for mobile/click */}
      <div className="grid grid-cols-4 gap-3 mt-4">
        {['D', 'F', 'J', 'K'].map((k, idx) => (
          <button
            key={k}
            onClick={() => hitLane(idx)}
            className="py-3.5 rounded-2xl bg-slate-900 border-2 border-pink-500/40 hover:bg-pink-500/20 active:scale-95 text-white font-black text-base font-mono cursor-pointer transition-all"
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
