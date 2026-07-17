import React, { useState } from 'react';
import { Trophy, ArrowLeft, RotateCcw, HelpCircle } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

type BoardValue = 'X' | 'O' | null;

export default function TicTacToe({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [board, setBoard] = useState<BoardValue[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<'X' | 'O' | 'Draw' | null>(null);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'expert'>('medium');

  const checkWinner = (grid: BoardValue[]): 'X' | 'O' | 'Draw' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
        return grid[a] as 'X' | 'O';
      }
    }

    if (grid.every(cell => cell !== null)) {
      return 'Draw';
    }

    return null;
  };

  const minimax = (grid: BoardValue[], depth: number, isMax: boolean): number => {
    const scoreVal = checkWinner(grid);
    if (scoreVal === 'O') return 10 - depth;
    if (scoreVal === 'X') return depth - 10;
    if (scoreVal === 'Draw') return 0;

    if (isMax) {
      let best = -1000;
      for (let i = 0; i < 9; i++) {
        if (grid[i] === null) {
          grid[i] = 'O';
          best = Math.max(best, minimax(grid, depth + 1, false));
          grid[i] = null;
        }
      }
      return best;
    } else {
      let best = 1000;
      for (let i = 0; i < 9; i++) {
        if (grid[i] === null) {
          grid[i] = 'X';
          best = Math.min(best, minimax(grid, depth + 1, true));
          grid[i] = null;
        }
      }
      return best;
    }
  };

  const getBestMove = (grid: BoardValue[]): number => {
    let bestVal = -1000;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
      if (grid[i] === null) {
        grid[i] = 'O';
        let moveVal = minimax(grid, 0, false);
        grid[i] = null;

        if (moveVal > bestVal) {
          bestMove = i;
          bestVal = moveVal;
        }
      }
    }
    return bestMove;
  };

  const makeMove = (index: number) => {
    if (board[index] || !isPlayerTurn || winner) return;

    audio.playClick();
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      handleGameEnd(gameWinner, newBoard);
      return;
    }

    // AI's Turn
    setIsPlayerTurn(false);
    setTimeout(() => {
      // Determine if AI plays a random move based on difficulty
      let bestIdx = -1;
      const emptyCells: number[] = [];
      newBoard.forEach((cell, idx) => {
        if (cell === null) emptyCells.push(idx);
      });

      let playRandom = false;
      const randVal = Math.random();
      if (difficulty === 'easy') {
        playRandom = randVal < 0.70; // 70% chance of random play
      } else if (difficulty === 'medium') {
        playRandom = randVal < 0.35; // 35% chance of random play
      }

      if (playRandom && emptyCells.length > 0) {
        bestIdx = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      } else {
        bestIdx = getBestMove(newBoard);
      }

      if (bestIdx !== -1) {
        newBoard[bestIdx] = 'O';
        setBoard(newBoard);
        audio.playClick();

        const postAiWinner = checkWinner(newBoard);
        if (postAiWinner) {
          handleGameEnd(postAiWinner, newBoard);
        } else {
          setIsPlayerTurn(true);
        }
      }
    }, 400);
  };

  const handleGameEnd = (endState: 'X' | 'O' | 'Draw', finalGrid: BoardValue[]) => {
    setWinner(endState);
    if (endState === 'X') {
      audio.playWin();
      const earned = 50;
      setScore(earned);
      onScore(earned);
      onGameOver(earned);
    } else if (endState === 'Draw') {
      audio.playCoin();
      const earned = 15;
      setScore(earned);
      onScore(earned);
      onGameOver(earned);
    } else {
      audio.playGameOver();
      onGameOver(0);
    }
  };

  const resetGame = () => {
    audio.playCoin();
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setScore(0);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.3)] text-white relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-fuchsia-400 hover:text-fuchsia-200 transition-colors bg-fuchsia-950/40 px-3 py-1.5 rounded-lg border border-fuchsia-800"
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-2 text-yellow-400">
          <Trophy size={18} />
          <span className="font-mono text-sm tracking-wide">Record: {highScore} PX</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold font-sans tracking-widest text-fuchsia-400 uppercase drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]">
          Tic-Tac-Toe Néon
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          AFFRONTE L'I.A. "VERTEX-9000" EN DUEL STRATÉGIQUE !
        </p>
      </div>

      {/* Difficulty Selector */}
      <div className="flex justify-center gap-2 mb-4 relative z-10 font-mono text-[10px]">
        {(['easy', 'medium', 'expert'] as const).map((diff) => (
          <button
            key={diff}
            disabled={!isPlayerTurn || !!winner}
            onClick={() => { audio.playClick(); setDifficulty(diff); }}
            className={`px-3 py-1.5 rounded-lg border uppercase font-bold transition-all ${
              !!winner || !isPlayerTurn ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } ${
              difficulty === diff
                ? 'bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-300 shadow-[0_0_8px_rgba(217,70,239,0.2)]'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            {diff === 'easy' && 'Facile'}
            {diff === 'medium' && 'Normal'}
            {diff === 'expert' && 'Expert (9000)'}
          </button>
        ))}
      </div>

      {/* Turn state notifier */}
      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono text-center mb-6 relative z-10">
        {!winner ? (
          <p className="text-xs">
            Tour : <span className={isPlayerTurn ? "text-cyan-400 font-bold" : "text-fuchsia-400 font-bold"}>
              {isPlayerTurn ? "TOI (X)" : "VERTEX-9000 (O)"}
            </span>
          </p>
        ) : (
          <p className="text-sm font-bold uppercase tracking-wider">
            {winner === 'X' && <span className="text-emerald-400">VICTOIRE ! +50 PX</span>}
            {winner === 'O' && <span className="text-rose-500">DÉFAITE DU DUEL !</span>}
            {winner === 'Draw' && <span className="text-yellow-400">MATCH NUL ! +15 PX</span>}
          </p>
        )}
      </div>

      {/* 3x3 Board */}
      <div className="flex justify-center items-center my-4 relative z-10">
        <div className="grid grid-cols-3 gap-3 w-64 h-64 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-inner">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => makeMove(index)}
              disabled={!!winner || cell !== null || !isPlayerTurn}
              className={`w-full h-full rounded-xl border-2 font-sans font-black text-2xl flex items-center justify-center transition-all duration-75 ${
                cell === null
                  ? 'bg-slate-950/60 border-slate-800 hover:border-cyan-500 hover:bg-slate-900 cursor-pointer'
                  : cell === 'X'
                    ? 'bg-cyan-950/20 border-cyan-500 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                    : 'bg-fuchsia-950/20 border-fuchsia-500 text-fuchsia-400 shadow-[0_0_12px_rgba(217,70,239,0.4)]'
              }`}
            >
              {cell}
            </button>
          ))}
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex justify-center mt-6 relative z-10">
        {winner && (
          <button
            onClick={resetGame}
            className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-mono font-bold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(217,70,239,0.4)] transition-all transform active:scale-95 text-sm tracking-widest"
          >
            <RotateCcw size={16} /> REJOUER
          </button>
        )}
      </div>
    </div>
  );
}
