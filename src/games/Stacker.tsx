import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ArrowLeft, RotateCcw, Zap } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

const GRID_COLS = 10;
const GRID_ROWS = 12;

export default function Stacker({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Empile les blocs !");
  
  // Stacker core engine parameters
  const [grid, setGrid] = useState<boolean[][]>(
    Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(false))
  );
  const [currentRow, setCurrentRow] = useState(GRID_ROWS - 1);
  const [blockSize, setBlockSize] = useState(3);
  const [blockLeft, setBlockLeft] = useState(3); // Column where block starts
  const [direction, setDirection] = useState<'LEFT' | 'RIGHT'>('RIGHT');
  const [tickSpeed, setTickSpeed] = useState(300);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Block sliding loop
  useEffect(() => {
    if (isPlaying && !isEnded) {
      timerRef.current = setInterval(() => {
        setBlockLeft((left) => {
          let nextLeft = left;
          let nextDir = direction;

          if (direction === 'RIGHT') {
            if (left + blockSize >= GRID_COLS) {
              nextDir = 'LEFT';
              nextLeft = left - 1;
            } else {
              nextLeft = left + 1;
            }
          } else {
            if (left <= 0) {
              nextDir = 'RIGHT';
              nextLeft = left + 1;
            } else {
              nextLeft = left - 1;
            }
          }

          setDirection(nextDir);
          return nextLeft;
        });
      }, tickSpeed);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isEnded, blockSize, direction, tickSpeed]);

  const placeBlock = () => {
    if (!isPlaying || isEnded) return;

    audio.playClick();
    const row = currentRow;
    const left = blockLeft;
    const currentSize = blockSize;

    // Calculate overlap with previous row
    let newLeft = left;
    let newSize = currentSize;

    if (row < GRID_ROWS - 1) {
      const prevRow = row + 1;
      const prevLeft = grid[prevRow].indexOf(true);
      const prevRight = grid[prevRow].lastIndexOf(true);

      const currentRight = left + currentSize - 1;

      // Overlap bounds
      const overlapLeft = Math.max(left, prevLeft);
      const overlapRight = Math.min(currentRight, prevRight);

      if (overlapLeft > overlapRight) {
        // Complete miss! Game Over
        handleGameOver(false);
        return;
      }

      newLeft = overlapLeft;
      newSize = overlapRight - overlapLeft + 1;
    }

    // Set stable blocks on current grid row
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r, rIdx) => {
        if (rIdx === row) {
          const newR = Array(GRID_COLS).fill(false);
          for (let i = 0; i < newSize; i++) {
            newR[newLeft + i] = true;
          }
          return newR;
        }
        return r;
      });
      return newGrid;
    });

    const addedPoints = (row === 0) ? 200 : 25;
    setScore((s) => s + addedPoints);
    onScore(addedPoints);

    // Stacking to the ultimate top?
    if (row === 0) {
      handleGameOver(true);
      return;
    }

    // Prepare next row
    audio.playCoin();
    setCurrentRow(row - 1);
    setBlockSize(newSize);
    setBlockLeft(newLeft);
    setTickSpeed((s) => Math.max(100, s - 18));
  };

  const handleGameOver = (win: boolean) => {
    setIsEnded(true);
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (win) {
      audio.playWin();
      setStatusMessage("PARFAIT ! TOUR TERMINÉE");
    } else {
      audio.playGameOver();
      setStatusMessage("S'EST EFFONDRÉ ! GAME OVER");
    }

    onGameOver(score);
  };

  const startNewGame = () => {
    audio.playCoin();
    setGrid(Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(false)));
    setCurrentRow(GRID_ROWS - 1);
    setBlockSize(3);
    setBlockLeft(3);
    setScore(0);
    setTickSpeed(300);
    setDirection('RIGHT');
    setStatusMessage("Empile les blocs !");
    setIsEnded(false);
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] text-white relative overflow-hidden">
      {/* Background glowing rings */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-200 transition-colors bg-purple-950/40 px-3 py-1.5 rounded-lg border border-purple-800"
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-2 text-yellow-400">
          <Trophy size={18} />
          <span className="font-mono text-sm tracking-wide">Record: {highScore} PX</span>
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold font-sans tracking-widest text-purple-400 uppercase drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
          Stacker Arcade
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          EMPILE LES BLOCS GLISSANTS PARFAITEMENT POUR MONTER JUSQU'AU SOMMET !
        </p>
      </div>

      {/* Score and level board */}
      <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-center relative z-10">
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SCORE</p>
          <p className="text-lg font-bold text-purple-400">{score} PX</p>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-center">
          <p className="text-[10px] text-slate-400">NIVEAU EN COURS</p>
          <p className="text-lg font-bold text-slate-200">{GRID_ROWS - currentRow}/{GRID_ROWS}</p>
        </div>
      </div>

      {/* Stacker Grid Canvas */}
      <div className="flex justify-center items-center my-3 relative z-10">
        <div className="relative w-56 bg-slate-900 p-2 rounded-xl border-4 border-slate-800 overflow-hidden shadow-inner flex flex-col gap-[2px]">
          {/* Render matrix rows */}
          {Array(GRID_ROWS).fill(null).map((_, rIdx) => {
            const isRowCurrent = rIdx === currentRow && isPlaying;
            
            return (
              <div key={rIdx} className="flex h-5 gap-[2px] w-full">
                {Array(GRID_COLS).fill(null).map((_, cIdx) => {
                  // Determine if segment is filled
                  let isFilled = grid[rIdx][cIdx];
                  if (isRowCurrent) {
                    isFilled = cIdx >= blockLeft && cIdx < blockLeft + blockSize;
                  }

                  return (
                    <div
                      key={cIdx}
                      className={`w-full h-full rounded-sm transition-all duration-75 ${
                        isFilled
                          ? isRowCurrent
                            ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                            : 'bg-purple-600/90 shadow-[0_0_4px_rgba(168,85,247,0.4)]'
                          : 'bg-slate-950/40 border border-slate-950/20'
                      }`}
                    />
                  );
                })}
              </div>
            );
          })}

          {/* Overlays */}
          {!isPlaying && !isEnded && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col justify-center items-center p-4 text-center">
              <p className="text-xs font-mono text-purple-400 mb-4 font-bold tracking-widest uppercase">Prêt à empiler ?</p>
              <button
                onClick={startNewGame}
                className="bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold py-2.5 px-6 rounded-lg text-xs tracking-widest"
              >
                DÉMARRER
              </button>
            </div>
          )}

          {isEnded && (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col justify-center items-center p-4 text-center">
              <p className={`font-mono font-bold tracking-widest mb-1 text-xs uppercase ${statusMessage.includes('PARFAIT') ? 'text-emerald-400' : 'text-rose-500'}`}>
                {statusMessage}
              </p>
              <p className="text-slate-400 text-xs font-mono mb-4">Score final : {score} PX</p>
              <button
                onClick={startNewGame}
                className="bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold py-2 px-6 rounded-lg text-xs flex items-center gap-1"
              >
                <RotateCcw size={12} /> REESSAYER
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Stack Button */}
      <div className="flex justify-center mt-4 relative z-10">
        <button
          onClick={placeBlock}
          disabled={!isPlaying || isEnded}
          className={`w-full max-w-xs flex items-center justify-center gap-2 font-mono font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95 text-sm tracking-widest uppercase ${
            isPlaying && !isEnded
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer'
              : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Zap size={16} /> EMPILE ! (ESPACE)
        </button>
      </div>
    </div>
  );
}
