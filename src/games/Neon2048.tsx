import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Award, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles, Zap, ShieldAlert } from 'lucide-react';

interface Neon2048Props {
  onGameOver: (score: number, pixelsEarned: number) => void;
  audioEnabled?: boolean;
}

type Grid = number[][];

export const Neon2048: React.FC<Neon2048Props> = ({ onGameOver }) => {
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [undoGrid, setUndoGrid] = useState<{ grid: Grid; score: number } | null>(null);

  function createEmptyGrid(): Grid {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
  }

  const addRandomTile = (currentGrid: Grid): Grid => {
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentGrid[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }
    if (emptyCells.length === 0) return currentGrid;
    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = currentGrid.map(row => [...row]);
    newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  };

  const startNewGame = () => {
    let newG = createEmptyGrid();
    newG = addRandomTile(newG);
    newG = addRandomTile(newG);
    setGrid(newG);
    setScore(0);
    setGameOver(false);
    setHasWon(false);
    setGameStarted(true);
    setUndoGrid(null);
  };

  const isGameOver = (g: Grid): boolean => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (g[r][c] === 0) return false;
        if (c < 3 && g[r][c] === g[r][c + 1]) return false;
        if (r < 3 && g[r][c] === g[r + 1][c]) return false;
      }
    }
    return true;
  };

  const slideAndMerge = (row: number[], addedScoreRef: { value: number }): number[] => {
    let filtered = row.filter(val => val !== 0);
    let result: number[] = [];
    for (let i = 0; i < filtered.length; i++) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        const mergedVal = filtered[i] * 2;
        result.push(mergedVal);
        addedScoreRef.value += mergedVal;
        if (mergedVal === 2048) setHasWon(true);
        i++; // skip next tile
      } else {
        result.push(filtered[i]);
      }
    }
    while (result.length < 4) {
      result.push(0);
    }
    return result;
  };

  const moveLeft = (g: Grid, scoreRef: { value: number }): Grid => {
    return g.map(row => slideAndMerge(row, scoreRef));
  };

  const rotateGrid = (g: Grid): Grid => {
    const rotated = createEmptyGrid();
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        rotated[c][3 - r] = g[r][c];
      }
    }
    return rotated;
  };

  const handleMove = useCallback((direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (!gameStarted || gameOver) return;

    let tempGrid = grid.map(row => [...row]);
    let rotations = 0;

    if (direction === 'UP') rotations = 3;
    else if (direction === 'RIGHT') rotations = 2;
    else if (direction === 'DOWN') rotations = 1;

    for (let i = 0; i < rotations; i++) {
      tempGrid = rotateGrid(tempGrid);
    }

    const scoreRef = { value: 0 };
    const movedGrid = moveLeft(tempGrid, scoreRef);

    let unrotated = movedGrid.map(row => [...row]);
    const reverseRotations = (4 - rotations) % 4;
    for (let i = 0; i < reverseRotations; i++) {
      unrotated = rotateGrid(unrotated);
    }

    // Check if moved
    const hasChanged = JSON.stringify(grid) !== JSON.stringify(unrotated);

    if (hasChanged) {
      setUndoGrid({ grid, score });
      const newGridWithTile = addRandomTile(unrotated);
      const newScore = score + scoreRef.value;
      setGrid(newGridWithTile);
      setScore(newScore);
      if (newScore > bestScore) setBestScore(newScore);

      if (isGameOver(newGridWithTile)) {
        setGameOver(true);
        const pixelsEarned = Math.floor(newScore / 4);
        onGameOver(newScore, pixelsEarned);
      }
    }
  }, [grid, score, bestScore, gameStarted, gameOver, onGameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) { e.preventDefault(); handleMove('UP'); }
      if (['ArrowDown', 'KeyS'].includes(e.code)) { e.preventDefault(); handleMove('DOWN'); }
      if (['ArrowLeft', 'KeyA'].includes(e.code)) { e.preventDefault(); handleMove('LEFT'); }
      if (['ArrowRight', 'KeyD'].includes(e.code)) { e.preventDefault(); handleMove('RIGHT'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  const handleUndo = () => {
    if (undoGrid) {
      setGrid(undoGrid.grid);
      setScore(undoGrid.score);
      setUndoGrid(null);
      setGameOver(false);
    }
  };

  const getTileColor = (val: number): string => {
    switch (val) {
      case 2: return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]';
      case 4: return 'bg-sky-950/80 text-sky-300 border-sky-500/50 shadow-[0_0_12px_rgba(14,165,233,0.4)]';
      case 8: return 'bg-blue-950/80 text-blue-300 border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.5)]';
      case 16: return 'bg-indigo-950/80 text-indigo-300 border-indigo-500/60 shadow-[0_0_15px_rgba(99,102,241,0.5)]';
      case 32: return 'bg-purple-950/80 text-purple-300 border-purple-500/70 shadow-[0_0_18px_rgba(168,85,247,0.6)]';
      case 64: return 'bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-500/70 shadow-[0_0_18px_rgba(217,70,239,0.6)]';
      case 128: return 'bg-pink-950/80 text-pink-300 border-pink-500/80 shadow-[0_0_20px_rgba(236,72,153,0.7)] font-black';
      case 256: return 'bg-rose-950/80 text-rose-300 border-rose-500/80 shadow-[0_0_22px_rgba(244,63,94,0.8)] font-black';
      case 512: return 'bg-amber-950/80 text-amber-300 border-amber-500/90 shadow-[0_0_25px_rgba(245,158,11,0.8)] font-black';
      case 1024: return 'bg-yellow-950/80 text-yellow-300 border-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.9)] font-black animate-pulse';
      case 2048: return 'bg-emerald-950/90 text-emerald-300 border-emerald-400 shadow-[0_0_35px_rgba(52,211,153,1)] font-black ring-2 ring-emerald-400';
      default: return 'bg-slate-950 text-white border-yellow-300 shadow-[0_0_40px_rgba(253,224,71,1)] font-black';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-lg mx-auto p-4 bg-slate-950/90 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Title Bar */}
      <div className="w-full flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 tracking-wider">
            <Zap className="text-cyan-400" size={22} /> NEON 2048 FUSION
          </h2>
          <p className="text-xs text-slate-400">Fusionnez les cellules pour créer le noyau 2048 !</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-xl text-center">
            <span className="text-[9px] uppercase text-slate-400 font-bold block">Score</span>
            <span className="text-sm font-black text-cyan-400">{score}</span>
          </div>
          <div className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-xl text-center">
            <span className="text-[9px] uppercase text-slate-400 font-bold block">Record</span>
            <span className="text-sm font-black text-amber-400">{bestScore}</span>
          </div>
        </div>
      </div>

      {!gameStarted ? (
        <div className="flex flex-col items-center justify-center my-12 text-center space-y-5">
          <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border-2 border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <Sparkles size={40} />
          </div>
          <h3 className="text-xl font-extrabold text-white">Prêt pour le défi 2048 ?</h3>
          <p className="text-xs text-slate-400 max-w-xs">
            Utilisez les flèches du clavier ou les boutons tactiles pour combiner les nombres identiques.
          </p>
          <button
            onClick={startNewGame}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm uppercase rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.5)] transition cursor-pointer flex items-center gap-2"
          >
            <Play size={18} /> Lancer la Partie
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full space-y-4">
          {/* Controls Bar */}
          <div className="flex items-center justify-between w-full max-w-xs px-2">
            <button
              onClick={startNewGame}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={14} /> Recommencer
            </button>
            {undoGrid && (
              <button
                onClick={handleUndo}
                className="px-3 py-1.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.3)]"
              >
                ↩️ Annuler coup
              </button>
            )}
          </div>

          {/* 4x4 Grid Board */}
          <div className="relative p-3 bg-slate-900/90 border-2 border-slate-800 rounded-2xl grid grid-cols-4 gap-2.5 w-72 h-72 sm:w-80 sm:h-80 shadow-inner">
            {grid.map((row, rIdx) =>
              row.map((val, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`rounded-xl flex items-center justify-center font-black transition-all duration-150 border text-lg sm:text-2xl ${
                    val === 0 ? 'bg-slate-950/60 border-slate-800/40 text-transparent' : getTileColor(val)
                  }`}
                >
                  {val > 0 ? val : ''}
                </div>
              ))
            )}

            {/* Game Over / Victory Overlay */}
            <AnimatePresence>
              {gameOver && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-950/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-4 text-center z-20 space-y-3"
                >
                  <ShieldAlert size={48} className="text-rose-500 animate-bounce" />
                  <h3 className="text-2xl font-black text-white">PLUS DE COUPS !</h3>
                  <p className="text-xs text-slate-300">
                    Score Final : <span className="text-cyan-400 font-bold">{score}</span> | Pixels : <span className="text-yellow-400 font-bold">+{Math.floor(score / 4)} PX</span>
                  </p>
                  <button
                    onClick={startNewGame}
                    className="px-6 py-2.5 bg-cyan-500 text-slate-950 font-black text-xs uppercase rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:bg-cyan-400 cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw size={16} /> Rejouer Une Partie
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* On-Screen D-Pad Touch Controls */}
          <div className="flex flex-col items-center gap-1 pt-2">
            <button
              onClick={() => handleMove('UP')}
              className="w-12 h-10 bg-slate-900 border border-slate-700 active:bg-cyan-500 active:text-slate-950 text-cyan-400 rounded-xl flex items-center justify-center cursor-pointer shadow"
            >
              <ArrowUp size={20} />
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleMove('LEFT')}
                className="w-12 h-10 bg-slate-900 border border-slate-700 active:bg-cyan-500 active:text-slate-950 text-cyan-400 rounded-xl flex items-center justify-center cursor-pointer shadow"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={() => handleMove('DOWN')}
                className="w-12 h-10 bg-slate-900 border border-slate-700 active:bg-cyan-500 active:text-slate-950 text-cyan-400 rounded-xl flex items-center justify-center cursor-pointer shadow"
              >
                <ArrowDown size={20} />
              </button>
              <button
                onClick={() => handleMove('RIGHT')}
                className="w-12 h-10 bg-slate-900 border border-slate-700 active:bg-cyan-500 active:text-slate-950 text-cyan-400 rounded-xl flex items-center justify-center cursor-pointer shadow"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Neon2048;
