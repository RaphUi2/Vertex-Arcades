import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../utils/audio';
import { Play, RotateCcw, X, Shield, Zap, Flame, Trophy } from 'lucide-react';

interface GameProps {
  onFinish: (score: number, bonusVC?: number) => void;
  onExit: () => void;
}

export function QuantumObby({ onFinish, onExit }: GameProps) {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover' | 'won'>('ready');
  const [score, setScore] = useState(0);
  const [stage, setStage] = useState(1);
  const [checkpoints, setCheckpoints] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(45);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player physics
  const playerRef = useRef({
    x: 50,
    y: 200,
    vx: 0,
    vy: 0,
    width: 24,
    height: 32,
    isGrounded: false,
    color: '#06b6d4'
  });

  const obstaclesRef = useRef<{ x: number; y: number; width: number; height: number; type: 'laser' | 'spikes' | 'crusher' | 'portal'; vy?: number }[]>([]);
  const platformsRef = useRef<{ x: number; y: number; width: number; height: number; moving?: boolean; vx?: number }[]>([]);
  const keysRef = useRef<{ left: boolean; right: boolean; jump: boolean; slide: boolean }>({
    left: false,
    right: false,
    jump: false,
    slide: false
  });

  const initStage = (currentStage: number) => {
    playerRef.current.x = 40;
    playerRef.current.y = 180;
    playerRef.current.vx = 0;
    playerRef.current.vy = 0;

    // Build platforms for stage
    const baseP: any[] = [
      { x: 0, y: 320, width: 140, height: 40 },
      { x: 190, y: 280, width: 100, height: 20, moving: true, vx: 1.5 },
      { x: 340, y: 240, width: 110, height: 20 },
      { x: 500, y: 210, width: 100, height: 20, moving: true, vx: -1.2 },
      { x: 650, y: 170, width: 140, height: 40 }
    ];

    const baseObs: any[] = [
      { x: 150, y: 340, width: 30, height: 20, type: 'spikes' },
      { x: 300, y: 150, width: 16, height: 90, type: 'laser', vy: 1.5 },
      { x: 460, y: 340, width: 30, height: 20, type: 'spikes' },
      { x: 740, y: 110, width: 35, height: 55, type: 'portal' }
    ];

    if (currentStage > 1) {
      baseP[1].width = 80;
      baseP[3].width = 80;
      baseObs.push({ x: 390, y: 180, width: 16, height: 60, type: 'laser', vy: -2 });
    }

    platformsRef.current = baseP;
    obstaclesRef.current = baseObs;
  };

  const startGame = () => {
    audio.playStart();
    setGameState('playing');
    setScore(0);
    setStage(1);
    setCheckpoints(0);
    setLives(3);
    setTimeLeft(45);
    initStage(1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = true;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        if (!keysRef.current.jump) {
          keysRef.current.jump = true;
          if (playerRef.current.isGrounded) {
            playerRef.current.vy = -10.5;
            playerRef.current.isGrounded = false;
            audio.playJump();
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = false;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') keysRef.current.jump = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          audio.playOof();
          setGameState('gameover');
          onFinish(score, 25);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState, score, onFinish]);

  // Main game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      const p = playerRef.current;

      // Horizontal movement
      if (keysRef.current.left) p.vx = -4.5;
      else if (keysRef.current.right) p.vx = 4.5;
      else p.vx *= 0.78;

      // Gravity
      p.vy += 0.45;
      p.x += p.vx;
      p.y += p.vy;

      // Boundary check
      if (p.x < 0) p.x = 0;
      if (p.x > canvas.width - p.width) p.x = canvas.width - p.width;

      p.isGrounded = false;

      // Platforms collision
      platformsRef.current.forEach(plat => {
        if (plat.moving && plat.vx) {
          plat.x += plat.vx;
          if (plat.x < 120 || plat.x > 540) plat.vx *= -1;
        }

        // Top land
        if (
          p.x + p.width > plat.x &&
          p.x < plat.x + plat.width &&
          p.y + p.height >= plat.y &&
          p.y + p.height <= plat.y + 14 &&
          p.vy >= 0
        ) {
          p.y = plat.y - p.height;
          p.vy = 0;
          p.isGrounded = true;
          if (plat.moving && plat.vx) p.x += plat.vx;
        }
      });

      // Death by falling
      if (p.y > canvas.height + 50) {
        handleDeath();
      }

      // Obstacles collision & logic
      obstaclesRef.current.forEach(obs => {
        if (obs.type === 'laser' && obs.vy) {
          obs.y += obs.vy;
          if (obs.y < 120 || obs.y > 280) obs.vy *= -1;
        }

        // AABB Collision
        if (
          p.x < obs.x + obs.width &&
          p.x + p.width > obs.x &&
          p.y < obs.y + obs.height &&
          p.y + p.height > obs.y
        ) {
          if (obs.type === 'portal') {
            // Stage Complete!
            audio.playWin();
            setScore(s => s + 350 + timeLeft * 10);
            setCheckpoints(c => c + 1);
            if (stage >= 3) {
              setGameState('won');
              onFinish(score + 1000, 150);
            } else {
              setStage(st => st + 1);
              initStage(stage + 1);
            }
          } else {
            handleDeath();
          }
        }
      });

      // RENDER
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background Retro-Futuristic Cyber Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Platforms
      platformsRef.current.forEach(plat => {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);

        // Neon Top Highlight
        ctx.fillStyle = '#22d3ee';
        ctx.fillRect(plat.x, plat.y, plat.width, 3);
      });

      // Draw Obstacles
      obstaclesRef.current.forEach(obs => {
        if (obs.type === 'laser') {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
          ctx.fillRect(obs.x - 4, obs.y, obs.width + 8, obs.height);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 10;
        } else if (obs.type === 'spikes') {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y + obs.height);
          ctx.lineTo(obs.x + obs.width / 2, obs.y);
          ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
          ctx.fill();
        } else if (obs.type === 'portal') {
          ctx.fillStyle = '#8b5cf6';
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.strokeStyle = '#d946ef';
          ctx.lineWidth = 3;
          ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
          ctx.shadowColor = '#d946ef';
          ctx.shadowBlur = 15;
        }
        ctx.shadowBlur = 0;
      });

      // Draw Player (Cyber Runner Avatar Silhouette)
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.width, p.height);

      // Cyber Visor Head
      ctx.fillStyle = '#fde047';
      ctx.fillRect(p.x + 3, p.y - 12, 18, 12);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(p.x + 6, p.y - 8, 3, 3);
      ctx.fillRect(p.x + 13, p.y - 8, 3, 3);

      animId = requestAnimationFrame(loop);
    };

    const handleDeath = () => {
      audio.playOof();
      setLives(l => {
        if (l <= 1) {
          setGameState('gameover');
          onFinish(score, 20);
          return 0;
        }
        playerRef.current.x = 40;
        playerRef.current.y = 180;
        playerRef.current.vx = 0;
        playerRef.current.vy = 0;
        return l - 1;
      });
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, stage, timeLeft, score, onFinish]);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[#0a0f1d] border-2 border-cyan-500/50 rounded-3xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.3)]">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-bold text-lg">
            🏃
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">Quantum Velocity: Neon Obby</h2>
            <p className="text-xs text-cyan-400 font-mono">Stage {stage}/3 • Checkpoints: {checkpoints}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-mono font-bold">
          <div className="flex items-center gap-1.5 text-rose-400">
            <span>Vies:</span>
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i}>{i < lives ? '❤️' : '🖤'}</span>
            ))}
          </div>
          <div className="text-yellow-400">Chrono: {timeLeft}s</div>
          <div className="text-cyan-300">Score: {score}</div>
          <button
            onClick={onExit}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-[#060913] flex justify-center">
        <canvas ref={canvasRef} width={800} height={380} className="w-full max-w-[800px] h-auto block" />

        {/* Overlay Modals */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-mono mb-2">
              QUANTUM OBBY 3.0
            </h3>
            <p className="text-slate-300 text-sm max-w-md mb-6">
              Traversez les plateformes mouvantes, esquivez les lasers et passez les 3 portails avant la fin du chronomètre !
            </p>
            <div className="text-xs text-slate-400 font-mono mb-6 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-700">
              Contrôles : <strong>Flèches / Q-D</strong> pour courir • <strong>Espace / W</strong> pour sauter
            </div>
            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all cursor-pointer flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" /> DÉMARRER L'OBBY
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl mb-2">💥</div>
            <h3 className="text-2xl font-black text-rose-500 font-mono mb-2">ÉCHEC DE LA RUN</h3>
            <p className="text-slate-300 text-sm mb-4">Score final : <strong className="text-cyan-300">{score} pts</strong></p>
            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase"
              >
                Recommencer
              </button>
              <button
                onClick={onExit}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase"
              >
                Quitter
              </button>
            </div>
          </div>
        )}

        {gameState === 'won' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl mb-2">🏆</div>
            <h3 className="text-2xl font-black text-yellow-400 font-mono mb-2">OBBY COMPLÉTÉ !</h3>
            <p className="text-slate-300 text-sm mb-4">Victoire royale : <strong className="text-yellow-300">{score} pts</strong> • +150 V-Coins bonus !</p>
            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-bold text-xs uppercase"
              >
                Rejouer
              </button>
              <button
                onClick={onExit}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase"
              >
                Quitter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
