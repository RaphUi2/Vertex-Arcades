import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, ArrowLeft, ArrowRight, ArrowDown, RotateCw, Trophy } from 'lucide-react';
import { audio } from '../utils/audio';

interface TetrisMicroProps {
  onScoreUpdate: (score: number) => void;
  onGameOver: (score: number) => void;
  highScore: number;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 16;

const TETROMINOES: Record<string, { shape: number[][]; color: string }> = {
  I: { shape: [[1, 1, 1, 1]], color: '#06b6d4' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#3b82f6' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#f97316' },
  O: { shape: [[1, 1], [1, 1]], color: '#eab308' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#10b981' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#a855f7' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#ef4444' },
};

const SHAPES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

export default function TetrisMicro({ onScoreUpdate, onGameOver, highScore }: TetrisMicroProps) {
  const [board, setBoard] = useState<string[][]>(() =>
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(''))
  );
  const [currentPiece, setCurrentPiece] = useState<{
    shape: number[][];
    color: string;
    x: number;
    y: number;
  } | null>(null);
  const [score, setScore] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const spawnPiece = useCallback(() => {
    const randomType = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const { shape, color } = TETROMINOES[randomType];
    const newPiece = {
      shape,
      color,
      x: Math.floor((BOARD_WIDTH - shape[0].length) / 2),
      y: 0,
    };
    return newPiece;
  }, []);

  const checkCollision = useCallback((piece: typeof currentPiece, boardState: string[][], offsetX = 0, offsetY = 0) => {
    if (!piece) return false;
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c] !== 0) {
          const newX = piece.x + c + offsetX;
          const newY = piece.y + r + offsetY;
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) return true;
          if (newY >= 0 && boardState[newY][newX] !== '') return true;
        }
      }
    }
    return false;
  }, []);

  const startGame = () => {
    audio.playClick();
    const emptyBoard = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(''));
    setBoard(emptyBoard);
    setScore(0);
    setLinesCleared(0);
    setGameOver(false);
    setIsPlaying(true);
    const piece = spawnPiece();
    setCurrentPiece(piece);
  };

  const rotatePiece = () => {
    if (!isPlaying || !currentPiece) return;
    const shape = currentPiece.shape;
    const rotated = shape[0].map((_, index) => shape.map(row => row[index]).reverse());
    const newPiece = { ...currentPiece, shape: rotated };
    if (!checkCollision(newPiece, board)) {
      audio.playClick();
      setCurrentPiece(newPiece);
    }
  };

  const moveLeft = () => {
    if (!isPlaying || !currentPiece) return;
    if (!checkCollision(currentPiece, board, -1, 0)) {
      setCurrentPiece(prev => prev ? { ...prev, x: prev.x - 1 } : null);
    }
  };

  const moveRight = () => {
    if (!isPlaying || !currentPiece) return;
    if (!checkCollision(currentPiece, board, 1, 0)) {
      setCurrentPiece(prev => prev ? { ...prev, x: prev.x + 1 } : null);
    }
  };

  const dropPiece = useCallback(() => {
    if (!isPlaying || !currentPiece) return;

    if (!checkCollision(currentPiece, board, 0, 1)) {
      setCurrentPiece(prev => prev ? { ...prev, y: prev.y + 1 } : null);
    } else {
      // Lock piece on board
      const newBoard = board.map(row => [...row]);
      currentPiece.shape.forEach((row, r) => {
        row.forEach((value, c) => {
          if (value !== 0) {
            const boardY = currentPiece.y + r;
            const boardX = currentPiece.x + c;
            if (boardY >= 0 && boardY < BOARD_HEIGHT) {
              newBoard[boardY][boardX] = currentPiece.color;
            }
          }
        });
      });

      // Clear completed lines
      let cleared = 0;
      const finalBoard = newBoard.filter(row => {
        const isFull = row.every(cell => cell !== '');
        if (isFull) cleared++;
        return !isFull;
      });

      while (finalBoard.length < BOARD_HEIGHT) {
        finalBoard.unshift(Array(BOARD_WIDTH).fill(''));
      }

      setBoard(finalBoard);

      if (cleared > 0) {
        audio.playWin();
        const linePoints = [0, 100, 300, 500, 800][cleared] || cleared * 200;
        const newScore = score + linePoints;
        setScore(newScore);
        setLinesCleared(prev => prev + cleared);
        onScoreUpdate(newScore);
      }

      // Check spawn next piece
      const nextPiece = spawnPiece();
      if (checkCollision(nextPiece, finalBoard)) {
        setIsPlaying(false);
        setGameOver(true);
        onGameOver(score);
        audio.playLose();
      } else {
        setCurrentPiece(nextPiece);
      }
    }
  }, [isPlaying, currentPiece, board, score, spawnPiece, checkCollision, onScoreUpdate, onGameOver]);

  // Game Loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      dropPiece();
    }, Math.max(150, 600 - linesCleared * 20));
    return () => clearInterval(interval);
  }, [isPlaying, dropPiece, linesCleared]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowLeft') moveLeft();
      if (e.key === 'ArrowRight') moveRight();
      if (e.key === 'ArrowDown') dropPiece();
      if (e.key === 'ArrowUp' || e.key === ' ') rotatePiece();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, moveLeft, moveRight, dropPiece, rotatePiece]);

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto font-mono text-white">
      {/* Header */}
      <div className="w-full flex justify-between items-center bg-slate-900/80 p-3 rounded-xl border border-cyan-500/40 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
        <div>
          <span className="text-[10px] text-cyan-400 font-bold uppercase block">SCORE</span>
          <span className="text-xl font-black text-cyan-300">{score}</span>
        </div>
        <div className="text-center">
          <span className="text-[10px] text-fuchsia-400 font-bold uppercase block">LIGNES</span>
          <span className="text-lg font-bold text-fuchsia-300">{linesCleared}</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-yellow-400 font-bold uppercase block">RECORD</span>
          <span className="text-xl font-black text-yellow-300">{highScore}</span>
        </div>
      </div>

      {/* Board Display */}
      <div className="relative bg-slate-950 p-2 rounded-2xl border-2 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
        <div
          className="grid gap-1 bg-slate-900/60 p-2 rounded-xl border border-slate-800"
          style={{
            gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))`,
            width: '240px',
            height: '380px',
          }}
        >
          {board.map((row, rIdx) =>
            row.map((cellColor, cIdx) => {
              // Check if cell is occupied by active falling piece
              let activeColor = cellColor;
              if (currentPiece) {
                const pr = rIdx - currentPiece.y;
                const pc = cIdx - currentPiece.x;
                if (
                  pr >= 0 &&
                  pr < currentPiece.shape.length &&
                  pc >= 0 &&
                  pc < currentPiece.shape[0].length &&
                  currentPiece.shape[pr][pc] !== 0
                ) {
                  activeColor = currentPiece.color;
                }
              }

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className="rounded-sm border border-slate-900/50 transition-all duration-75"
                  style={{
                    backgroundColor: activeColor || '#0f172a',
                    boxShadow: activeColor ? `0 0 8px ${activeColor}` : 'none',
                  }}
                />
              );
            })
          )}
        </div>

        {/* Start / Game Over Overlay */}
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-4 text-center">
            {gameOver ? (
              <>
                <Trophy size={48} className="text-yellow-400 mb-2 animate-bounce" />
                <h3 className="text-2xl font-black text-rose-400 mb-1">FIN DE PARTIE</h3>
                <p className="text-xs text-slate-300 mb-4">SCORE FINAL : <span className="text-yellow-300 font-bold">{score} PTS</span></p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-400 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                  <Play size={24} className="text-cyan-400" />
                </div>
                <h3 className="text-xl font-black text-cyan-300 mb-1">TETRIS MICRO NÉON</h3>
                <p className="text-xs text-slate-400 mb-4 max-w-xs">Complétez des lignes horizontales avec les blocs tombants !</p>
              </>
            )}
            <button
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black rounded-xl cursor-pointer uppercase tracking-wider text-xs shadow-[0_0_20px_rgba(6,182,212,0.6)] flex items-center gap-2"
            >
              {gameOver ? <RotateCcw size={16} /> : <Play size={16} />}
              {gameOver ? 'RÉESSAYER' : 'LANCER LA PARTIE'}
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full max-w-xs mt-4 grid grid-cols-3 gap-2">
        <button
          onClick={moveLeft}
          className="p-3 bg-slate-900 border border-slate-700 hover:border-cyan-400 rounded-xl flex items-center justify-center text-cyan-300 cursor-pointer active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={rotatePiece}
          className="p-3 bg-cyan-950 border border-cyan-500 hover:border-cyan-300 rounded-xl flex items-center justify-center text-cyan-300 cursor-pointer active:scale-95 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
        >
          <RotateCw size={20} />
        </button>
        <button
          onClick={moveRight}
          className="p-3 bg-slate-900 border border-slate-700 hover:border-cyan-400 rounded-xl flex items-center justify-center text-cyan-300 cursor-pointer active:scale-95"
        >
          <ArrowRight size={20} />
        </button>
        <div className="col-span-3">
          <button
            onClick={dropPiece}
            className="w-full p-3 bg-slate-900 border border-cyan-800 hover:border-cyan-400 rounded-xl flex items-center justify-center text-cyan-400 font-bold text-xs gap-2 cursor-pointer active:scale-95 uppercase"
          >
            <ArrowDown size={18} /> ACCÉLÉRER CHUTE
          </button>
        </div>
      </div>
    </div>
  );
}
