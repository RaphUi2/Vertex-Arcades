import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ArrowLeft, RotateCcw, ArrowLeftRight } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

interface Obstacle {
  id: number;
  lane: number; // 0, 1, 2
  y: number;
  color: string;
  speed: number;
}

export default function CyberHighway({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [score, setScore] = useState(0);

  const stateRef = useRef({
    isPlaying: false,
    score: 0,
    playerLane: 1, // 0 = Left, 1 = Center, 2 = Right
    obstacles: [] as Obstacle[],
    frameCount: 0,
    speedMultiplier: 1.0,
    roadOffset: 0,
  });

  const highScoreRef = useRef(highScore);
  useEffect(() => {
    highScoreRef.current = highScore;
  }, [highScore]);

  const startGame = () => {
    audio.playCoin();
    setScore(0);
    setIsEnded(false);
    setIsPlaying(true);

    stateRef.current = {
      isPlaying: true,
      score: 0,
      playerLane: 1,
      obstacles: [],
      frameCount: 0,
      speedMultiplier: 1.0,
      roadOffset: 0,
    };
  };

  const spawnObstacle = () => {
    const lane = Math.floor(Math.random() * 3);
    const colors = ['#f43f5e', '#d946ef', '#a855f7'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const speed = 4 + Math.random() * 2;

    stateRef.current.obstacles.push({
      id: Date.now() + Math.random(),
      lane,
      y: -60,
      color,
      speed,
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!stateRef.current.isPlaying) return;
    if (e.key === 'ArrowLeft' || e.key === 'q' || e.key === 'Q') {
      moveLeft();
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      moveRight();
    }
  };

  const moveLeft = () => {
    if (stateRef.current.playerLane > 0) {
      stateRef.current.playerLane--;
      audio.playClick();
    }
  };

  const moveRight = () => {
    if (stateRef.current.playerLane < 2) {
      stateRef.current.playerLane++;
      audio.playClick();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
  }, [isPlaying]);

  // Game Loop
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

      state.frameCount++;
      state.roadOffset = (state.roadOffset + 5 * state.speedMultiplier) % 40;

      // Slowly increase speed over time
      state.speedMultiplier = 1.0 + (state.frameCount / 2500);

      // Spawn obstacles periodically
      const spawnRate = Math.max(25, 60 - Math.floor(state.frameCount / 150));
      if (state.frameCount % spawnRate === 0) {
        spawnObstacle();
      }

      // Update obstacles
      state.obstacles.forEach((obs) => {
        obs.y += obs.speed * state.speedMultiplier;
      });

      // Score points for passed obstacles
      state.obstacles.forEach((obs) => {
        if (obs.y > 400) {
          state.score += 15;
          setScore(state.score);
          onScore(15);
          audio.playCoin();
        }
      });

      // Clear offscreen obstacles
      state.obstacles = state.obstacles.filter((obs) => obs.y <= 400);

      // Collision Check
      // Player is at y = 310, height = 50, width = 40
      const playerY = 310;
      const playerHeight = 55;
      const playerWidth = 40;

      for (let i = 0; i < state.obstacles.length; i++) {
        const obs = state.obstacles[i];
        
        // Match lanes
        if (obs.lane === state.playerLane) {
          const obsHeight = 45;
          // Check box collision
          if (obs.y + obsHeight > playerY && obs.y < playerY + playerHeight) {
            triggerGameOver();
            return;
          }
        }
      }

      draw(ctx, canvas);
      animId = requestAnimationFrame(update);
    };

    const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const state = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cyber bg
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Lanes coords
      const laneWidth = canvas.width / 3;

      // Draw road lines (moving)
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.lineWidth = 2;
      for (let x = laneWidth; x < canvas.width; x += laneWidth) {
        ctx.beginPath();
        ctx.setLineDash([20, 20]);
        ctx.lineDashOffset = -state.roadOffset;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]); // Reset
      }

      // Draw left & right boundary walls with pink neon glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#f43f5e';
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(5, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(canvas.width - 5, 0);
      ctx.lineTo(canvas.width - 5, canvas.height);
      ctx.stroke();

      // Draw obstacles
      state.obstacles.forEach((obs) => {
        const oX = obs.lane * laneWidth + (laneWidth - 36) / 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = obs.color;
        ctx.fillStyle = obs.color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;

        // Draw obstacle car/barrier as a spiked triangle or hexagon block
        ctx.beginPath();
        ctx.roundRect(oX, obs.y, 36, 45, 6);
        ctx.fill();
        ctx.stroke();

        // Draw warning lights
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(oX + 10, obs.y + 10, 3, 0, Math.PI * 2);
        ctx.arc(oX + 26, obs.y + 10, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Player cyber-car (cyan glow)
      const pX = state.playerLane * laneWidth + (laneWidth - 40) / 2;
      const pY = 310;

      ctx.shadowBlur = 20;
      ctx.shadowColor = '#22d3ee';
      ctx.fillStyle = '#0891b2';
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 3;

      // Draw sleek spaceship/car body
      ctx.beginPath();
      ctx.moveTo(pX + 20, pY); // Nose
      ctx.lineTo(pX + 40, pY + 40); // Right wing back
      ctx.lineTo(pX + 30, pY + 55); // Inner right
      ctx.lineTo(pX + 10, pY + 55); // Inner left
      ctx.lineTo(pX, pY + 40); // Left wing back
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Jet thruster fire (Orange pulsing)
      const firePulse = 10 + Math.sin(state.frameCount * 0.4) * 5;
      ctx.shadowColor = '#f97316';
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(pX + 15, pY + 55);
      ctx.lineTo(pX + 20, pY + 55 + firePulse);
      ctx.lineTo(pX + 25, pY + 55);
      ctx.closePath();
      ctx.fill();

      // Reset shadow
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
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] text-white relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-rose-400 hover:text-rose-200 transition-colors bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-800"
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-2 text-yellow-400">
          <Trophy size={18} />
          <span className="font-mono text-sm tracking-wide">Record: {highScore} PX</span>
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold font-sans tracking-widest text-rose-400 uppercase drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">
          Cyber Highway
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          DODGE LES BARRIERES EN DESSOUS DES DEGATS EN UTILISANT GAUCHE/DROITE !
        </p>
      </div>

      {/* Score Panel */}
      <div className="grid grid-cols-1 mb-4 font-mono text-center relative z-10">
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SCORE</p>
          <p className="text-lg font-bold text-rose-400">{score} PX</p>
        </div>
      </div>

      {/* Stage */}
      <div className="flex flex-col justify-center items-center my-2 relative z-10">
        <div className="relative border-4 border-slate-800 rounded-2xl overflow-hidden shadow-inner">
          <canvas
            ref={canvasRef}
            width={300}
            height={400}
            className="w-full max-w-[300px] aspect-[3/4] bg-slate-950 block"
          />

          {/* Overlays */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-slate-950/85 flex flex-col justify-center items-center p-6 text-center font-mono">
              {!isEnded ? (
                <>
                  <p className="text-sm text-rose-400 mb-6 font-bold uppercase tracking-widest animate-pulse">
                    MOTEURS PRÊTS... ACCÉLÈRE !
                  </p>
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-mono font-bold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all transform active:scale-95 text-xs tracking-widest"
                  >
                    DÉMARRER
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-red-500 mb-2 font-bold uppercase tracking-widest">
                    CRASH TERMINAL !
                  </p>
                  <p className="text-xs text-slate-400 mb-6"> Score Final : {score} PX </p>
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-mono font-bold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all transform active:scale-95 text-xs tracking-widest"
                  >
                    <RotateCcw size={14} /> REJOUER
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Tactile/Mobile Controls */}
        <div className="flex gap-4 w-full mt-4 justify-center">
          <button
            onClick={moveLeft}
            disabled={!isPlaying}
            className="flex-1 max-w-[120px] p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold active:scale-95 transition-all text-xs flex justify-center items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            ← GAUCHE
          </button>
          <button
            onClick={moveRight}
            disabled={!isPlaying}
            className="flex-1 max-w-[120px] p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold active:scale-95 transition-all text-xs flex justify-center items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            DROITE →
          </button>
        </div>
      </div>
    </div>
  );
}
