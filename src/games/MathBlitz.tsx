import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ArrowLeft, RotateCcw, Zap, Check, X } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

interface Equation {
  text: string;
  isCorrect: boolean;
}

export default function MathBlitz({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [score, setScore] = useState(0);
  const [equation, setEquation] = useState<Equation | null>(null);
  const [timeLeft, setTimeLeft] = useState(3.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateEquation = (): Equation => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let num1 = 0, num2 = 0;

    if (op === '*') {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
    } else {
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
    }

    let actualResult = 0;
    if (op === '+') actualResult = num1 + num2;
    if (op === '-') actualResult = num1 - num2;
    if (op === '*') actualResult = num1 * num2;

    const showCorrect = Math.random() > 0.5;
    const offset = Math.floor(Math.random() * 5) + 1;
    const displayedResult = showCorrect ? actualResult : (Math.random() > 0.5 ? actualResult + offset : actualResult - offset);

    return {
      text: `${num1} ${op} ${num2} = ${displayedResult}`,
      isCorrect: displayedResult === actualResult
    };
  };

  // High resolution tick timer - Runs when a new equation is loaded
  useEffect(() => {
    if (isPlaying && !isEnded && equation) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0.1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleTimeOut();
            return 0;
          }
          return Math.round((prev - 0.1) * 10) / 10;
        });
      }, 1000 * 0.1);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isEnded, equation]);

  const handleTimeOut = () => {
    audio.playHit();
    setFeedback('wrong');
    setStreak(0);
    setTimeout(() => {
      endTheGame();
    }, 800);
  };

  const handleAnswer = (choice: boolean) => {
    if (feedback || !equation) return;

    if (timerRef.current) clearInterval(timerRef.current);

    if (choice === equation.isCorrect) {
      audio.playCoin();
      setFeedback('correct');
      const bonus = Math.min(40, streak * 3);
      const addedPoints = 10 + bonus;
      setScore((s) => s + addedPoints);
      onScore(addedPoints);
      setStreak((st) => st + 1);

      setTimeout(() => {
        setFeedback(null);
        setEquation(generateEquation());
        // Reduce timers progressively to raise difficulty
        setTimeLeft(Math.max(1.8, 3.0 - streak * 0.1));
      }, 500);
    } else {
      audio.playHit();
      setFeedback('wrong');
      setStreak(0);
      setTimeout(() => {
        endTheGame();
      }, 800);
    }
  };

  const endTheGame = () => {
    setIsPlaying(false);
    setIsEnded(true);
    audio.playGameOver();
    onGameOver(score);
  };

  const startGame = () => {
    audio.playCoin();
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setEquation(generateEquation());
    setTimeLeft(3.0);
    setIsEnded(false);
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-white relative overflow-hidden">
      {/* Background glowing particles */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-200 transition-colors bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800"
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-2 text-yellow-400">
          <Trophy size={18} />
          <span className="font-mono text-sm tracking-wide">Record: {highScore} PX</span>
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold font-sans tracking-widest text-emerald-400 uppercase drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
          Math Blitz
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          VRAI OU FAUX ? RÉPONDS EN MOINS DE 3 SECONDES !
        </p>
      </div>

      {/* Score, Timer & Streak */}
      <div className="grid grid-cols-3 gap-3 mb-4 font-mono text-center relative z-10">
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SCORE</p>
          <p className="text-lg font-bold text-emerald-400">{score} PX</p>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-center">
          <p className="text-[10px] text-slate-400">CHRONO</p>
          <p className={`text-lg font-bold ${timeLeft <= 1.0 ? 'text-red-500 animate-pulse' : 'text-slate-200'}`}>
            {timeLeft.toFixed(1)}s
          </p>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SÉRIE</p>
          <p className="text-lg font-bold text-yellow-400">x{streak}</p>
        </div>
      </div>

      {/* Blitz Formula Display Screen */}
      <div className="flex justify-center my-4 relative z-10">
        <div className="w-full max-w-xs h-32 bg-slate-950/90 rounded-xl border-2 border-slate-800 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
          {isPlaying && equation && !feedback && (
            <div className="text-center px-4">
              <span className="font-sans text-3xl font-extrabold tracking-wide text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                {equation.text}
              </span>
            </div>
          )}

          {feedback === 'correct' && (
            <div className="flex flex-col items-center text-emerald-400 animate-bounce">
              <Check size={36} />
              <span className="text-xs font-mono font-bold mt-1 uppercase">EXCELLENT !</span>
            </div>
          )}

          {feedback === 'wrong' && (
            <div className="flex flex-col items-center text-red-500 animate-pulse">
              <X size={36} />
              <span className="text-xs font-mono font-bold mt-1 uppercase">ERREUR !</span>
            </div>
          )}

          {!isPlaying && !isEnded && (
            <div className="text-center p-4">
              <button
                onClick={startGame}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold py-2 px-6 rounded-lg text-xs tracking-widest uppercase"
              >
                DÉBUTER LE BLITZ
              </button>
            </div>
          )}

          {isEnded && (
            <div className="text-center p-4 flex flex-col items-center">
              <p className="text-rose-500 font-mono font-bold tracking-widest mb-1 text-xs uppercase">TEMPS ÉCOULÉ / ERREUR</p>
              <button
                onClick={startGame}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold py-2 px-6 rounded-lg text-xs flex items-center gap-1.5"
              >
                <RotateCcw size={12} /> RECOMMENCER
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Split buttons choice */}
      <div className="grid grid-cols-2 gap-4 mt-4 relative z-10">
        <button
          onClick={() => handleAnswer(true)}
          disabled={!isPlaying || !!feedback}
          className={`font-mono font-bold py-4 px-4 rounded-xl text-center shadow transition-all duration-100 active:scale-95 text-sm tracking-wider uppercase ${
            isPlaying && !feedback
              ? 'bg-emerald-600/20 border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-600/30 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.2)]'
              : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          VRAI (TRUE)
        </button>

        <button
          onClick={() => handleAnswer(false)}
          disabled={!isPlaying || !!feedback}
          className={`font-mono font-bold py-4 px-4 rounded-xl text-center shadow transition-all duration-100 active:scale-95 text-sm tracking-wider uppercase ${
            isPlaying && !feedback
              ? 'bg-rose-600/20 border-2 border-rose-500 text-rose-400 hover:bg-rose-600/30 cursor-pointer shadow-[0_0_12px_rgba(244,63,94,0.2)]'
              : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          FAUX (FALSE)
        </button>
      </div>
    </div>
  );
}
