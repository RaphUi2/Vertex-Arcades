import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../utils/audio';
import { Play, RotateCcw, X, Clock, Zap } from 'lucide-react';

interface GameProps {
  onFinish: (score: number, bonusVC?: number) => void;
  onExit: () => void;
}

export function ChronoShift({ onFinish, onExit }: GameProps) {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState(0);
  const [rewindsLeft, setRewindsLeft] = useState(3);
  const [isRewinding, setIsRewinding] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef({ x: 80, y: 280, vy: 0, isGrounded: false });
  const obstaclesRef = useRef<{ x: number; y: number; w: number; h: number; type: 'spike' | 'cube' }[]>([]);
  const historyRef = useRef<{ playerY: number; obstacles: any[]; score: number }[]>([]);

  const startGame = () => {
    audio.playStart();
    setGameState('playing');
    setScore(0);
    setRewindsLeft(3);
    setIsRewinding(false);
    playerRef.current = { x: 80, y: 280, vy: 0, isGrounded: true };
    obstaclesRef.current = [];
    historyRef.current = [];
  };

  const handleJump = () => {
    if (gameState !== 'playing' || isRewinding) return;
    if (playerRef.current.isGrounded) {
      playerRef.current.vy = -12;
      playerRef.current.isGrounded = false;
      audio.playJump();
    }
  };

  const handleRewind = () => {
    if (gameState !== 'playing' || rewindsLeft <= 0 || isRewinding) return;
    audio.playPowerup();
    setIsRewinding(true);
    setRewindsLeft(r => r - 1);

    let framesToRewind = Math.min(120, historyRef.current.length);
    const interval = setInterval(() => {
      if (historyRef.current.length > 0 && framesToRewind > 0) {
        const snap = historyRef.current.pop();
        if (snap) {
          playerRef.current.y = snap.playerY;
          obstaclesRef.current = snap.obstacles;
          setScore(snap.score);
        }
        framesToRewind -= 4;
      } else {
        clearInterval(interval);
        setIsRewinding(false);
      }
    }, 16);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') handleJump();
      if (e.code === 'ShiftLeft' || e.code === 'KeyR') handleRewind();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, rewindsLeft, isRewinding]);

  // Main Loop
  useEffect(() => {
    if (gameState !== 'playing' || isRewinding) return;

    let animId: number;
    let spawnTimer = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      const p = playerRef.current;

      // Physics
      p.vy += 0.65;
      p.y += p.vy;

      if (p.y >= 280) {
        p.y = 280;
        p.vy = 0;
        p.isGrounded = true;
      }

      // Record History Snapshot for Rewind
      historyRef.current.push({
        playerY: p.y,
        obstacles: obstaclesRef.current.map(o => ({ ...o })),
        score
      });
      if (historyRef.current.length > 200) historyRef.current.shift();

      // Spawn Obstacles
      spawnTimer++;
      if (spawnTimer % 65 === 0) {
        obstaclesRef.current.push({
          x: canvas.width + 20,
          y: 280 - (Math.random() > 0.4 ? 20 : 45),
          w: 24,
          h: 30,
          type: Math.random() > 0.5 ? 'spike' : 'cube'
        });
      }

      // Move Obstacles
      obstaclesRef.current.forEach(obs => {
        obs.x -= 6.5;

        // Collision Check
        if (
          p.x + 20 > obs.x &&
          p.x < obs.x + obs.w &&
          p.y + 30 > obs.y &&
          p.y < obs.y + obs.h
        ) {
          // If rewinds left, auto prompt or game over
          audio.playOof();
          setGameState('gameover');
          onFinish(score, 30);
        }
      });

      obstaclesRef.current = obstaclesRef.current.filter(o => o.x > -50);
      setScore(s => s + 1);

      // RENDER
      ctx.fillStyle = '#061311';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Neon Floor
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 310);
      ctx.lineTo(canvas.width, 310);
      ctx.stroke();

      // Draw Obstacles
      obstaclesRef.current.forEach(obs => {
        ctx.fillStyle = obs.type === 'spike' ? '#f43f5e' : '#eab308';
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      });

      // Draw Player
      ctx.fillStyle = '#10b981';
      ctx.fillRect(p.x, p.y, 22, 30);

      // Time visor
      ctx.fillStyle = '#6ee7b7';
      ctx.fillRect(p.x + 8, p.y + 6, 12, 6);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, isRewinding, score, onFinish]);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[#081514] border-2 border-emerald-500/50 rounded-3xl p-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-emerald-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 font-bold text-lg">
            ⏳
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">Chrono Shift: Temporal Runner</h2>
            <p className="text-xs text-emerald-400 font-mono">Rembobinages : {rewindsLeft}x (Shift)</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-mono font-bold">
          <div className="text-cyan-300">Distance: {score}m</div>
          <button onClick={onExit} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-900/60 bg-[#061311] flex justify-center">
        <canvas ref={canvasRef} width={800} height={380} className="w-full max-w-[800px] h-auto block" />

        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-mono mb-2">
              CHRONO SHIFT RUNNER
            </h3>
            <p className="text-slate-300 text-sm max-w-md mb-6">
              Sautez avec <strong>Espace / W</strong> par-dessus les blocs corrompus. Utilisez <strong>Shift / R</strong> pour remonter le temps de 3 secondes avant une chute fatale !
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.5)] cursor-pointer flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" /> COMMENCER LA COURSE
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl mb-2">⏳💥</div>
            <h3 className="text-2xl font-black text-rose-500 font-mono mb-2">PARADOXE TEMPOREL</h3>
            <p className="text-slate-300 text-sm mb-4">Distance parcourue : <strong className="text-emerald-400">{score} mètres</strong></p>
            <div className="flex gap-3">
              <button onClick={startGame} className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase">
                Rejouer
              </button>
              <button onClick={onExit} className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs uppercase">
                Quitter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
