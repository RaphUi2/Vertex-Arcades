import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Trophy, Zap, ShieldAlert, Sparkles } from 'lucide-react';

interface NeonAirHockeyProps {
  onGameOver: (score: number, pixelsEarned: number) => void;
  audioEnabled?: boolean;
}

export const NeonAirHockey: React.FC<NeonAirHockeyProps> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'player' | 'cpu' | null>(null);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    // Game state
    const tableWidth = canvas.width;
    const tableHeight = canvas.height;
    const goalWidth = 120;

    // Puck
    let puck = {
      x: tableWidth / 2,
      y: tableHeight / 2,
      vx: (Math.random() > 0.5 ? 1 : -1) * 3,
      vy: 4,
      radius: 12
    };

    // Player Paddle (bottom)
    let player = {
      x: tableWidth / 2,
      y: tableHeight - 50,
      radius: 22,
      color: '#06b6d4'
    };

    // CPU Paddle (top)
    let cpu = {
      x: tableWidth / 2,
      y: 50,
      radius: 22,
      color: '#f43f5e'
    };

    // Mouse / Touch listener on Canvas
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      let newX = clientX - rect.left;
      let newY = clientY - rect.top;

      // Restrict player to lower half
      player.x = Math.max(player.radius, Math.min(tableWidth - player.radius, newX));
      player.y = Math.max(tableHeight / 2 + player.radius, Math.min(tableHeight - player.radius, newY));
    };

    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('touchmove', handlePointerMove);

    let pScore = 0;
    let cScore = 0;

    const resetPuck = (towardsPlayer: boolean) => {
      puck.x = tableWidth / 2;
      puck.y = tableHeight / 2;
      puck.vx = (Math.random() - 0.5) * 4;
      puck.vy = towardsPlayer ? 4 : -4;
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, tableWidth, tableHeight);

      // Draw Table Surface
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, tableWidth, tableHeight);

      // Draw Center Line & Circle
      ctx.strokeStyle = '#38bdf844';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, tableHeight / 2);
      ctx.lineTo(tableWidth, tableHeight / 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(tableWidth / 2, tableHeight / 2, 45, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Goal Areas
      ctx.fillStyle = '#f43f5e22';
      ctx.fillRect((tableWidth - goalWidth) / 2, 0, goalWidth, 10);
      ctx.fillStyle = '#06b6d422';
      ctx.fillRect((tableWidth - goalWidth) / 2, tableHeight - 10, goalWidth, 10);

      ctx.strokeStyle = '#f43f5e';
      ctx.strokeRect((tableWidth - goalWidth) / 2, 0, goalWidth, 10);
      ctx.strokeStyle = '#06b6d4';
      ctx.strokeRect((tableWidth - goalWidth) / 2, tableHeight - 10, goalWidth, 10);

      // AI CPU Movement
      const cpuTargetX = puck.x;
      cpu.x += (cpuTargetX - cpu.x) * 0.08;
      // Keep CPU in top half
      cpu.y = Math.max(cpu.radius + 10, Math.min(tableHeight / 2 - cpu.radius - 10, cpu.y));

      // Physics Update Puck position
      puck.x += puck.vx;
      puck.y += puck.vy;

      // Friction
      puck.vx *= 0.992;
      puck.vy *= 0.992;

      // Wall Collisions
      if (puck.x - puck.radius <= 0 || puck.x + puck.radius >= tableWidth) {
        puck.vx *= -1;
        puck.x = puck.x - puck.radius <= 0 ? puck.radius : tableWidth - puck.radius;
      }

      // Top & Bottom Goal Check or Bounce
      const isGoalX = puck.x >= (tableWidth - goalWidth) / 2 && puck.x <= (tableWidth + goalWidth) / 2;

      if (puck.y - puck.radius <= 0) {
        if (isGoalX) {
          // PLAYER SCORES!
          pScore++;
          setPlayerScore(pScore);
          if (pScore >= 5) {
            setWinner('player');
            setGameOver(true);
            setIsPlaying(false);
            onGameOver(1000, 350);
            return;
          }
          resetPuck(false);
        } else {
          puck.vy *= -1;
          puck.y = puck.radius;
        }
      }

      if (puck.y + puck.radius >= tableHeight) {
        if (isGoalX) {
          // CPU SCORES!
          cScore++;
          setCpuScore(cScore);
          if (cScore >= 5) {
            setWinner('cpu');
            setGameOver(true);
            setIsPlaying(false);
            onGameOver(pScore * 100, pScore * 30);
            return;
          }
          resetPuck(true);
        } else {
          puck.vy *= -1;
          puck.y = tableHeight - puck.radius;
        }
      }

      // Paddle Collisions (Player)
      const dxP = puck.x - player.x;
      const dyP = puck.y - player.y;
      const distP = Math.sqrt(dxP * dxP + dyP * dyP);
      if (distP < puck.radius + player.radius) {
        const angle = Math.atan2(dyP, dxP);
        const speed = Math.sqrt(puck.vx * puck.vx + puck.vy * puck.vy) + 1.5;
        puck.vx = Math.cos(angle) * Math.min(speed, 12);
        puck.vy = Math.sin(angle) * Math.min(speed, 12);
      }

      // Paddle Collisions (CPU)
      const dxC = puck.x - cpu.x;
      const dyC = puck.y - cpu.y;
      const distC = Math.sqrt(dxC * dxC + dyC * dyC);
      if (distC < puck.radius + cpu.radius) {
        const angle = Math.atan2(dyC, dxC);
        const speed = Math.sqrt(puck.vx * puck.vx + puck.vy * puck.vy) + 1.5;
        puck.vx = Math.cos(angle) * Math.min(speed, 12);
        puck.vy = Math.sin(angle) * Math.min(speed, 12);
      }

      // Draw Puck with Neon Glow
      ctx.fillStyle = '#facc15';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(puck.x, puck.y, puck.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Player Paddle
      ctx.fillStyle = player.color;
      ctx.shadowColor = player.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw CPU Paddle
      ctx.fillStyle = cpu.color;
      ctx.shadowColor = cpu.color;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(cpu.x, cpu.y, cpu.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('touchmove', handlePointerMove);
    };
  }, [isPlaying, gameOver, onGameOver]);

  const startGame = () => {
    setPlayerScore(0);
    setCpuScore(0);
    setGameOver(false);
    setWinner(null);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4 bg-slate-950/90 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Title Bar */}
      <div className="w-full flex items-center justify-between mb-3 border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-wider">
            <Zap className="text-cyan-400" size={22} /> NEON AIR HOCKEY 1V1
          </h2>
          <p className="text-xs text-slate-400">Marquez 5 buts contre l'IA CPU-ALPHA !</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-xl text-center">
            <span className="text-[9px] uppercase text-cyan-400 font-bold block">Joueur</span>
            <span className="text-sm font-black text-cyan-300">{playerScore}</span>
          </div>
          <span className="text-slate-500 font-bold">:</span>
          <div className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-xl text-center">
            <span className="text-[9px] uppercase text-rose-400 font-bold block">CPU</span>
            <span className="text-sm font-black text-rose-300">{cpuScore}</span>
          </div>
        </div>
      </div>

      {!isPlaying ? (
        <div className="flex flex-col items-center justify-center my-12 text-center space-y-5">
          <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border-2 border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <Trophy size={40} />
          </div>
          <h3 className="text-xl font-extrabold text-white">Match d'Air Hockey Néon</h3>
          <p className="text-xs text-slate-400 max-w-xs">
            Glissez votre curseur ou votre doigt sur l'écran pour déplacer votre palais bleu.
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-slate-950 font-black text-sm uppercase rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.5)] transition cursor-pointer flex items-center gap-2"
          >
            <Play size={18} /> Engager le Palet
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <canvas
            ref={canvasRef}
            width={340}
            height={440}
            className="border-2 border-cyan-500/40 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.2)] bg-slate-950 touch-none cursor-crosshair"
          />
        </div>
      )}
    </div>
  );
};

export default NeonAirHockey;
