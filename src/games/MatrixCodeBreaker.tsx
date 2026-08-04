import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, RotateCcw, Zap, Key, ShieldCheck, Cpu } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

const COLORS = [
  { id: 1, name: 'Cyan', bg: 'bg-cyan-500', hex: '#06b6d4' },
  { id: 2, name: 'Rose', bg: 'bg-rose-500', hex: '#f43f5e' },
  { id: 3, name: 'Jaune', bg: 'bg-yellow-400', hex: '#facc15' },
  { id: 4, name: 'Vert', bg: 'bg-emerald-500', hex: '#10b981' },
  { id: 5, name: 'Violet', bg: 'bg-purple-500', hex: '#a855f7' },
  { id: 6, name: 'Orange', bg: 'bg-orange-500', hex: '#f97316' }
];

interface Guess {
  code: number[];
  exact: number;
  partial: number;
}

export default function MatrixCodeBreaker({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(8);
  const [secretCode, setSecretCode] = useState<number[]>([]);
  const [currentGuess, setCurrentGuess] = useState<number[]>([]);
  const [history, setHistory] = useState<Guess[]>([]);
  const [hasWon, setHasWon] = useState(false);

  const startNewGame = () => {
    audio.playCoin();
    // Generate secret 4 digit code
    const code = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
    setSecretCode(code);
    setCurrentGuess([]);
    setHistory([]);
    setAttemptsLeft(8);
    setScore(0);
    setHasWon(false);
    setIsEnded(false);
    setIsPlaying(true);
  };

  const addColorToGuess = (colorId: number) => {
    if (!isPlaying || currentGuess.length >= 4) return;
    audio.playClick();
    setCurrentGuess([...currentGuess, colorId]);
  };

  const removeLastColor = () => {
    if (!isPlaying || currentGuess.length === 0) return;
    audio.playClick();
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  const submitGuess = () => {
    if (currentGuess.length !== 4 || !isPlaying) return;

    let exact = 0;
    let partial = 0;
    const secretCopy = [...secretCode];
    const guessCopy = [...currentGuess];

    // Check exact matches
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] === secretCopy[i]) {
        exact++;
        secretCopy[i] = -1;
        guessCopy[i] = -2;
      }
    }

    // Check partial matches
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] > 0) {
        const index = secretCopy.indexOf(guessCopy[i]);
        if (index !== -1) {
          partial++;
          secretCopy[index] = -1;
        }
      }
    }

    const newHistory = [{ code: currentGuess, exact, partial }, ...history];
    setHistory(newHistory);
    setCurrentGuess([]);

    if (exact === 4) {
      // Won round!
      audio.playWin();
      const earnedScore = 500 + attemptsLeft * 100;
      setScore(earnedScore);
      onScore(earnedScore);
      setHasWon(true);
      setIsPlaying(false);
      setIsEnded(true);
      onGameOver(earnedScore);
    } else {
      const remaining = attemptsLeft - 1;
      setAttemptsLeft(remaining);
      audio.playHit();

      if (remaining <= 0) {
        // Lost
        audio.playGameOver();
        setIsPlaying(false);
        setIsEnded(true);
        onGameOver(score);
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 font-mono">
      {/* Top Header */}
      <div className="w-full max-w-lg flex items-center justify-between mb-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs">
        <button
          onClick={() => { audio.playClick(); onBack(); }}
          className="flex items-center gap-1 text-slate-400 hover:text-white font-bold cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800"
        >
          <ArrowLeft size={14} /> QUITTER
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-rose-400 font-bold">
            <Cpu size={14} /> ESSAIS: {attemptsLeft}
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Trophy size={14} /> BEST: {highScore}
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400 font-black">
            <Zap size={14} /> {score}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-[400px] bg-slate-950 border-2 border-green-500/80 rounded-2xl p-4 shadow-[0_0_30px_rgba(34,197,94,0.3)] flex flex-col items-center">
        {/* Title */}
        <div className="flex items-center gap-2 text-green-400 font-black text-sm uppercase tracking-wider mb-3">
          <Key size={16} /> PIRATAGE DE CODE QUANTIQUE
        </div>

        {/* Current Guess Slot */}
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 w-full flex items-center justify-between mb-3">
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((idx) => {
              const val = currentGuess[idx];
              const colorObj = COLORS.find((c) => c.id === val);
              return (
                <div
                  key={idx}
                  className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold text-xs transition-all ${
                    colorObj ? `${colorObj.bg} border-white text-slate-950 shadow-md` : 'bg-slate-950 border-slate-700 text-slate-600'
                  }`}
                >
                  {colorObj ? colorObj.id : '?'}
                </div>
              );
            })}
          </div>

          <div className="flex gap-1">
            <button
              onClick={removeLastColor}
              disabled={currentGuess.length === 0}
              className="px-2 py-2 bg-rose-950 text-rose-300 border border-rose-800 rounded-lg text-xs font-bold disabled:opacity-30 cursor-pointer"
            >
              ⌫
            </button>
            <button
              onClick={submitGuess}
              disabled={currentGuess.length !== 4}
              className="px-3 py-2 bg-green-500 hover:bg-green-400 text-slate-950 font-black rounded-lg text-xs uppercase disabled:opacity-30 cursor-pointer shadow-md"
            >
              TESTER ⚡
            </button>
          </div>
        </div>

        {/* Color Palette Buttons */}
        <div className="grid grid-cols-6 gap-2 w-full mb-4">
          {COLORS.map((c) => (
            <button
              key={c.id}
              onClick={() => addColorToGuess(c.id)}
              className={`${c.bg} h-10 rounded-lg border-2 border-white/60 text-slate-950 font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer`}
            >
              {c.id}
            </button>
          ))}
        </div>

        {/* History Log */}
        <div className="w-full bg-slate-900/90 rounded-xl border border-slate-800 p-3 h-48 overflow-y-auto space-y-2">
          {history.length === 0 ? (
            <div className="text-center text-slate-500 text-xs py-10 font-bold">
              Sélectionnez 4 chiffres et testez votre combinaison !
            </div>
          ) : (
            history.map((g, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800 text-xs">
                <div className="flex gap-1.5">
                  {g.code.map((val, i) => {
                    const colorObj = COLORS.find((c) => c.id === val);
                    return (
                      <div key={i} className={`w-6 h-6 rounded ${colorObj?.bg} text-slate-950 font-bold text-[10px] flex items-center justify-center`}>
                        {val}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">🟢 {g.exact} Exact</span>
                  <span className="text-yellow-400 font-bold">🟡 {g.partial} Mal placé</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Start Overlay */}
        {!isPlaying && !isEnded && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="p-3 bg-green-950/60 rounded-full border border-green-500 mb-3 animate-bounce">
              <ShieldCheck size={32} className="text-green-400" />
            </div>
            <h3 className="text-2xl font-black text-green-400 uppercase tracking-widest mb-1">
              MATRIX CODE BREAKER
            </h3>
            <p className="text-xs text-slate-300 max-w-xs mb-5">
              Décodez la combinaison secrète de 4 chiffres en 8 essais maximum grâce aux indices couleur !
            </p>
            <button
              onClick={startNewGame}
              className="bg-green-500 hover:bg-green-400 text-slate-950 font-extrabold py-3 px-8 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-lg animate-pulse"
            >
              DÉMARRER LE PIRATAGE ⚡
            </button>
          </div>
        )}

        {/* Game Over / Win Overlay */}
        {isEnded && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
            <h3 className={`text-2xl font-black uppercase tracking-widest mb-1 ${hasWon ? 'text-emerald-400' : 'text-rose-500'}`}>
              {hasWon ? 'CODE PIRATÉ ! 🔓' : 'ACCÈS REFUSÉ ! 🔒'}
            </h3>
            <p className="text-xs text-slate-300 mb-2">
              Combinaison secrète :
            </p>
            <div className="flex gap-2 mb-4">
              {secretCode.map((val, i) => {
                const colorObj = COLORS.find((c) => c.id === val);
                return (
                  <div key={i} className={`w-8 h-8 rounded-lg ${colorObj?.bg} text-slate-950 font-black flex items-center justify-center text-xs shadow-md`}>
                    {val}
                  </div>
                );
              })}
            </div>
            <button
              onClick={startNewGame}
              className="bg-green-500 hover:bg-green-400 text-slate-950 font-extrabold py-3 px-8 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-lg flex items-center gap-2 mb-2"
            >
              <RotateCcw size={16} /> REPLAY CODE BREAKER
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
