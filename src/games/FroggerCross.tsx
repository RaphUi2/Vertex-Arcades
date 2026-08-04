import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Trophy } from 'lucide-react';
import { audio } from '../utils/audio';

interface FroggerCrossProps {
  onScoreUpdate: (score: number) => void;
  onGameOver: (score: number) => void;
  highScore: number;
}

const LANES = 8; // 0 = start, 1-6 = road/river lanes, 7 = finish goal
const COLS = 7;

export default function FroggerCross({ onScoreUpdate, onGameOver, highScore }: FroggerCrossProps) {
  const [player, setPlayer] = useState({ x: 3, y: 7 }); // Start at bottom (y=7)
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Cars / Obstacles on lanes
  const [obstacles, setObstacles] = useState<Array<{ id: number; lane: number; x: number; speed: number; dir: number; color: string }>>([]);

  const requestRef = useRef<number | null>(null);

  const initGame = () => {
    audio.playClick();
    setPlayer({ x: 3, y: 7 });
    setScore(0);
    setLives(3);
    setGameOver(false);
    setIsPlaying(true);

    // Initial lane obstacles
    const obs = [
      { id: 1, lane: 6, x: 0, speed: 0.05, dir: 1, color: '#f43f5e' },
      { id: 2, lane: 6, x: 4, speed: 0.05, dir: 1, color: '#f43f5e' },
      { id: 3, lane: 5, x: 2, speed: 0.08, dir: -1, color: '#06b6d4' },
      { id: 4, lane: 5, x: 6, speed: 0.08, dir: -1, color: '#06b6d4' },
      { id: 5, lane: 4, x: 1, speed: 0.06, dir: 1, color: '#eab308' },
      { id: 6, lane: 3, x: 3, speed: 0.09, dir: -1, color: '#a855f7' },
      { id: 7, lane: 2, x: 0, speed: 0.07, dir: 1, color: '#10b981' },
      { id: 8, lane: 1, x: 5, speed: 0.10, dir: -1, color: '#ec4899' },
    ];
    setObstacles(obs);
  };

  // Move player
  const move = (dx: number, dy: number) => {
    if (!isPlaying) return;
    audio.playClick();
    setPlayer(prev => {
      const newX = Math.max(0, Math.min(COLS - 1, prev.x + dx));
      const newY = Math.max(0, Math.min(LANES - 1, prev.y + dy));

      // Reached top (Goal)
      if (newY === 0) {
        audio.playWin();
        const nextScore = score + 100;
        setScore(nextScore);
        onScoreUpdate(nextScore);
        return { x: 3, y: 7 }; // Reset to start for next crossing
      }

      return { x: newX, y: newY };
    });
  };

  // Game Loop - Move obstacles and check collisions
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setObstacles(prev =>
        prev.map(o => {
          let nextX = o.x + o.speed * o.dir;
          if (nextX > COLS) nextX = -1;
          if (nextX < -1) nextX = COLS;
          return { ...o, x: nextX };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Collision Check
  useEffect(() => {
    if (!isPlaying) return;

    for (const obs of obstacles) {
      if (obs.lane === player.y) {
        // Check overlap
        if (Math.abs(obs.x - player.x) < 0.7) {
          audio.playLose();
          if (lives > 1) {
            setLives(prev => prev - 1);
            setPlayer({ x: 3, y: 7 }); // Respawn
          } else {
            setIsPlaying(false);
            setGameOver(true);
            onGameOver(score);
          }
          break;
        }
      }
    }
  }, [obstacles, player, isPlaying, lives, score, onGameOver]);

  // Key Bindings
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowUp' || e.key === 'w') move(0, -1);
      if (e.key === 'ArrowDown' || e.key === 's') move(0, 1);
      if (e.key === 'ArrowLeft' || e.key === 'a') move(-1, 0);
      if (e.key === 'ArrowRight' || e.key === 'd') move(1, 0);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto font-mono text-white">
      {/* Header */}
      <div className="w-full flex justify-between items-center bg-slate-900/80 p-3 rounded-xl border border-emerald-500/40 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
        <div>
          <span className="text-[10px] text-emerald-400 font-bold uppercase block">SCORE</span>
          <span className="text-xl font-black text-emerald-300">{score}</span>
        </div>
        <div className="text-center">
          <span className="text-[10px] text-rose-400 font-bold uppercase block">VIES</span>
          <span className="text-lg font-bold text-rose-300">{'❤️'.repeat(lives)}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-yellow-400 font-bold uppercase block">RECORD</span>
          <span className="text-xl font-black text-yellow-300">{highScore}</span>
        </div>
      </div>

      {/* Grid */}
      <div className="relative bg-slate-950 p-2 rounded-2xl border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
        <div className="grid gap-1 bg-slate-900/80 p-2 rounded-xl border border-slate-800 w-[280px]">
          {Array.from({ length: LANES }).map((_, r) => {
            const isGoal = r === 0;
            const isStart = r === 7;

            return (
              <div
                key={r}
                className={`flex gap-1 h-9 rounded items-center justify-center relative overflow-hidden ${
                  isGoal
                    ? 'bg-emerald-950/80 border border-emerald-500/50'
                    : isStart
                    ? 'bg-cyan-950/80 border border-cyan-500/50'
                    : 'bg-slate-900/60 border-t border-b border-slate-800'
                }`}
              >
                {/* Lane label */}
                <span className="absolute left-1 text-[8px] font-bold text-slate-600">
                  {isGoal ? 'GOAL' : isStart ? 'START' : `LANE ${r}`}
                </span>

                {/* Render Obstacles on lane */}
                {obstacles
                  .filter(o => o.lane === r)
                  .map(o => (
                    <div
                      key={o.id}
                      className="absolute top-1 bottom-1 w-8 rounded-lg shadow-md border border-white/20 flex items-center justify-center text-[10px] font-bold animate-pulse transition-all duration-75"
                      style={{
                        left: `${(o.x / COLS) * 100}%`,
                        backgroundColor: o.color,
                        boxShadow: `0 0 10px ${o.color}`,
                      }}
                    >
                      🏎️
                    </div>
                  ))}

                {/* Render Player Frog */}
                {player.y === r && (
                  <div
                    className="absolute top-1 bottom-1 w-8 rounded-lg bg-yellow-400 border border-yellow-200 text-slate-950 font-black flex items-center justify-center text-xs shadow-[0_0_15px_#facc15] transition-all duration-100 z-10"
                    style={{ left: `${(player.x / COLS) * 100}%` }}
                  >
                    🐸
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Start / Game Over Overlay */}
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-4 text-center z-20">
            {gameOver ? (
              <>
                <Trophy size={48} className="text-yellow-400 mb-2 animate-bounce" />
                <h3 className="text-2xl font-black text-rose-400 mb-1">ACCIDENT CYBER!</h3>
                <p className="text-xs text-slate-300 mb-4">SCORE FINAL : <span className="text-yellow-300 font-bold">{score} PTS</span></p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-400 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                  <Play size={24} className="text-emerald-400" />
                </div>
                <h3 className="text-xl font-black text-emerald-300 mb-1">CYBER HIGHWAY CROSS</h3>
                <p className="text-xs text-slate-400 mb-4 max-w-xs">Traversez l'autoroute néon sans percuter les hovercars !</p>
              </>
            )}
            <button
              onClick={initGame}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl cursor-pointer uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(16,185,129,0.6)] flex items-center gap-2"
            >
              {gameOver ? <RotateCcw size={16} /> : <Play size={16} />}
              {gameOver ? 'RÉESSAYER' : 'LANCER LA PARTIE'}
            </button>
          </div>
        )}
      </div>

      {/* D-Pad Controls */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <button
          onClick={() => move(0, -1)}
          className="p-3 bg-emerald-950 border border-emerald-500 hover:border-emerald-300 rounded-xl text-emerald-300 cursor-pointer active:scale-95 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
        >
          <ArrowUp size={22} />
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => move(-1, 0)}
            className="p-3 bg-slate-900 border border-slate-700 hover:border-emerald-400 rounded-xl text-emerald-300 cursor-pointer active:scale-95"
          >
            <ArrowLeft size={22} />
          </button>
          <button
            onClick={() => move(0, 1)}
            className="p-3 bg-slate-900 border border-slate-700 hover:border-emerald-400 rounded-xl text-emerald-300 cursor-pointer active:scale-95"
          >
            <ArrowDown size={22} />
          </button>
          <button
            onClick={() => move(1, 0)}
            className="p-3 bg-slate-900 border border-slate-700 hover:border-emerald-400 rounded-xl text-emerald-300 cursor-pointer active:scale-95"
          >
            <ArrowRight size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
