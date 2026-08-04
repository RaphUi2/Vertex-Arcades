import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Trophy, RotateCcw, Zap, Sparkles, Compass, Shield } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

export default function NeonMaze({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [level, setLevel] = useState(1);

  const stateRef = useRef({
    isPlaying: false,
    score: 0,
    timeLeft: 45,
    level: 1,
    px: 1,
    py: 1,
    mazeSize: 11, // 11x11 grid
    grid: [] as number[][], // 1 = wall, 0 = path, 2 = node, 3 = exit
    nodesLeft: 0
  });

  // Simple maze generator
  const generateMaze = (size: number) => {
    const grid = Array.from({ length: size }, () => Array(size).fill(1));

    // Simple carving
    for (let r = 1; r < size - 1; r++) {
      for (let c = 1; c < size - 1; c++) {
        if (r % 2 === 1 || c % 2 === 1) {
          if (Math.random() > 0.25) grid[r][c] = 0;
        }
      }
    }
    grid[1][1] = 0; // player start

    let nodes = 0;
    for (let r = 1; r < size - 1; r++) {
      for (let c = 1; c < size - 1; c++) {
        if (grid[r][c] === 0 && !(r === 1 && c === 1) && Math.random() < 0.3) {
          grid[r][c] = 2; // Data node
          nodes++;
        }
      }
    }

    grid[size - 2][size - 2] = 3; // Portal Exit
    return { grid, nodes };
  };

  const startNewGame = () => {
    audio.playCoin();
    setScore(0);
    setTimeLeft(45);
    setLevel(1);
    setIsEnded(false);
    setIsPlaying(true);

    const { grid, nodes } = generateMaze(11);
    stateRef.current = {
      isPlaying: true,
      score: 0,
      timeLeft: 45,
      level: 1,
      px: 1,
      py: 1,
      mazeSize: 11,
      grid,
      nodesLeft: nodes
    };
  };

  const movePlayer = (dx: number, dy: number) => {
    const st = stateRef.current;
    if (!st.isPlaying) return;

    const nx = st.px + dx;
    const ny = st.py + dy;

    if (nx >= 0 && nx < st.mazeSize && ny >= 0 && ny < st.mazeSize) {
      if (st.grid[ny][nx] !== 1) {
        st.px = nx;
        st.py = ny;

        // Collect node
        if (st.grid[ny][nx] === 2) {
          st.grid[ny][nx] = 0;
          st.nodesLeft--;
          st.score += 50;
          setScore(st.score);
          onScore(st.score);
          audio.playHit();
        }

        // Reach Portal Exit
        if (st.grid[ny][nx] === 3) {
          audio.playPowerup();
          st.score += 200 + st.timeLeft * 10;
          st.level += 1;
          st.timeLeft += 15;
          setLevel(st.level);
          setScore(st.score);
          onScore(st.score);

          // Generate next maze
          const { grid, nodes } = generateMaze(11);
          st.grid = grid;
          st.nodesLeft = nodes;
          st.px = 1;
          st.py = 1;
        }
      }
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!stateRef.current.isPlaying) return;
      if (e.key === 'ArrowUp' || e.key === 'z' || e.key === 'w') movePlayer(0, -1);
      if (e.key === 'ArrowDown' || e.key === 's') movePlayer(0, 1);
      if (e.key === 'ArrowLeft' || e.key === 'q' || e.key === 'a') movePlayer(-1, 0);
      if (e.key === 'ArrowRight' || e.key === 'd') movePlayer(1, 0);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Timer loop
  useEffect(() => {
    const timer = setInterval(() => {
      const st = stateRef.current;
      if (st.isPlaying) {
        st.timeLeft -= 1;
        setTimeLeft(st.timeLeft);

        if (st.timeLeft <= 0) {
          st.isPlaying = false;
          setIsPlaying(false);
          setIsEnded(true);
          audio.playGameOver();
          onGameOver(st.score);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const grid = stateRef.current.grid;
  const size = stateRef.current.mazeSize;

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 font-mono">
      {/* Top Bar */}
      <div className="w-full max-w-lg flex items-center justify-between mb-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs">
        <button
          onClick={() => { audio.playClick(); onBack(); }}
          className="flex items-center gap-1 text-slate-400 hover:text-white font-bold cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800"
        >
          <ArrowLeft size={14} /> QUITTER
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-emerald-400 font-bold">
            <Compass size={14} /> NIV. {level}
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Trophy size={14} /> BEST: {highScore}
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400 font-black">
            <Zap size={14} /> {score}
          </div>
        </div>
      </div>

      {/* Main Game Frame */}
      <div className="relative w-full max-w-[400px] bg-slate-950 border-2 border-emerald-500/80 rounded-2xl p-4 overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.3)] flex flex-col items-center">
        {/* Timer Bar */}
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full transition-all ${timeLeft > 10 ? 'bg-emerald-400' : 'bg-rose-500 animate-pulse'}`}
            style={{ width: `${(timeLeft / 60) * 100}%` }}
          />
        </div>

        {/* Maze Grid */}
        <div
          className="grid gap-1 bg-slate-900 p-2 rounded-xl border border-slate-800 shadow-inner"
          style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isPlayer = stateRef.current.px === c && stateRef.current.py === r;
              let bg = 'bg-slate-950';
              if (cell === 1) bg = 'bg-slate-800 border border-slate-700'; // Wall
              if (cell === 2) bg = 'bg-amber-500/30 border border-amber-400 animate-pulse'; // Data node
              if (cell === 3) bg = 'bg-emerald-500/40 border-2 border-emerald-400 animate-bounce'; // Exit

              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all ${bg}`}
                >
                  {isPlayer && (
                    <div className="w-5 h-5 bg-cyan-400 rounded-full border-2 border-white shadow-[0_0_10px_#06b6d4] animate-ping" />
                  )}
                  {!isPlayer && cell === 2 && '⚡'}
                  {!isPlayer && cell === 3 && '🌀'}
                </div>
              );
            })
          )}
        </div>

        {/* Directional Touch Controls */}
        <div className="mt-4 grid grid-cols-3 gap-2 w-48">
          <div />
          <button
            onClick={() => movePlayer(0, -1)}
            className="py-2.5 bg-emerald-950/80 hover:bg-emerald-800 border border-emerald-500/80 text-emerald-300 font-black rounded-xl cursor-pointer"
          >
            ▲
          </button>
          <div />
          <button
            onClick={() => movePlayer(-1, 0)}
            className="py-2.5 bg-emerald-950/80 hover:bg-emerald-800 border border-emerald-500/80 text-emerald-300 font-black rounded-xl cursor-pointer"
          >
            ◄
          </button>
          <button
            onClick={() => movePlayer(0, 1)}
            className="py-2.5 bg-emerald-950/80 hover:bg-emerald-800 border border-emerald-500/80 text-emerald-300 font-black rounded-xl cursor-pointer"
          >
            ▼
          </button>
          <button
            onClick={() => movePlayer(1, 0)}
            className="py-2.5 bg-emerald-950/80 hover:bg-emerald-800 border border-emerald-500/80 text-emerald-300 font-black rounded-xl cursor-pointer"
          >
            ►
          </button>
        </div>

        {/* Start Overlay */}
        {!isPlaying && !isEnded && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="p-3 bg-emerald-950/60 rounded-full border border-emerald-500 mb-3 animate-bounce">
              <Compass size={32} className="text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black text-emerald-400 uppercase tracking-widest mb-1">
              CYBER LABYRINTHE
            </h3>
            <p className="text-xs text-slate-300 max-w-xs mb-5">
              Collectez les puces [⚡] et atteignez le portail [🌀] avant que le temps ne s'écoule !
            </p>
            <button
              onClick={startNewGame}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3 px-8 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-lg animate-pulse"
            >
              ENTRER DANS LE LABYRINTHE ⚡
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {isEnded && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
            <h3 className="text-2xl font-black text-rose-500 uppercase tracking-widest mb-1">
              TEMPS ÉCOULÉ
            </h3>
            <p className="text-sm text-slate-300 mb-4">
              Score Final : <span className="text-emerald-400 font-black">{score} pts</span> (Niveau {level})
            </p>
            <button
              onClick={startNewGame}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3 px-8 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-lg flex items-center gap-2 mb-2"
            >
              <RotateCcw size={16} /> REPLAY LABYRINTHE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
