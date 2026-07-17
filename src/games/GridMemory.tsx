import React, { useState, useEffect } from 'react';
import { Trophy, ArrowLeft, RotateCcw } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

export default function GridMemory({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [pattern, setPattern] = useState<number[]>([]);
  const [userSelections, setUserSelections] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'player' | 'over'>('idle');
  const [statusText, setStatusText] = useState("Clique sur LANCER");

  const startLevel = (currentLevel: number) => {
    setGameState('showing');
    setStatusText("Retiens le motif !");
    setUserSelections([]);

    // Generate random distinct cells in a 4x4 grid (0 to 15)
    // Number of cells depends on level (e.g. 3 + level)
    const count = Math.min(10, 3 + currentLevel);
    const newPattern: number[] = [];
    while (newPattern.length < count) {
      const idx = Math.floor(Math.random() * 16);
      if (!newPattern.includes(idx)) {
        newPattern.push(idx);
      }
    }

    setPattern(newPattern);

    // After 2 seconds, hide the pattern and let player click
    setTimeout(() => {
      setGameState('player');
      setStatusText("Reconstitue le motif !");
    }, 1800);
  };

  const handleTileClick = (index: number) => {
    if (gameState !== 'player' || userSelections.includes(index)) return;

    audio.playClick();
    const nextSelections = [...userSelections, index];
    setUserSelections(nextSelections);

    // Did they click a tile that is NOT in the pattern?
    if (!pattern.includes(index)) {
      audio.playHit();
      setGameState('over');
      setStatusText("ERREUR ! MOTIF INCORRECT");
      onGameOver(score);
      return;
    }

    // Did they complete the pattern?
    if (nextSelections.length === pattern.length) {
      audio.playWin();
      const addedPoints = level * 30;
      setScore((s) => s + addedPoints);
      onScore(addedPoints);
      setStatusText("Niveau réussi ! +PX");

      setTimeout(() => {
        setLevel((l) => {
          const nextL = l + 1;
          startLevel(nextL);
          return nextL;
        });
      }, 1000);
    }
  };

  const startGame = () => {
    audio.playCoin();
    setScore(0);
    setLevel(1);
    setGameState('idle');
    startLevel(1);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] text-white relative overflow-hidden">
      {/* Background ambient neon glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

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
          Matrice Mémoire
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          RETIENS ET REPRODUIS LE MOTIF DE TUILES LUMINEUSES !
        </p>
      </div>

      {/* Score and level boards */}
      <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-center relative z-10">
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SCORE</p>
          <p className="text-lg font-bold text-purple-400">{score} PX</p>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">NIVEAU</p>
          <p className="text-lg font-bold text-slate-200">{level}</p>
        </div>
      </div>

      {/* Grid Canvas Arena */}
      <div className="flex flex-col items-center my-4 relative z-10">
        {/* Status notifier */}
        <p className="text-xs font-mono font-bold text-cyan-400 mb-4 tracking-wider text-center select-none uppercase">
          {statusText}
        </p>

        <div className="grid grid-cols-4 gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-inner">
          {Array(16).fill(null).map((_, index) => {
            const isShown = gameState === 'showing' && pattern.includes(index);
            const isClicked = userSelections.includes(index);
            
            return (
              <button
                key={index}
                onClick={() => handleTileClick(index)}
                disabled={gameState !== 'player'}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border transition-all duration-150 ${
                  isShown
                    ? 'bg-purple-500 border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.8)] scale-105'
                    : isClicked
                      ? 'bg-cyan-500 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.8)] scale-105'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 cursor-pointer'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Action triggers */}
      <div className="flex justify-center mt-4 relative z-10">
        {(gameState === 'idle' || gameState === 'over') && (
          <button
            onClick={startGame}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all transform active:scale-95 text-sm tracking-widest"
          >
            <RotateCcw size={16} /> {gameState === 'over' ? 'REESSAYER' : 'LANCER LA PARTIE'}
          </button>
        )}
      </div>
    </div>
  );
}
