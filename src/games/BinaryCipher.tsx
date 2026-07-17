import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ArrowLeft, RotateCcw, Zap, Check, X } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

interface Question {
  binary: string;
  decimal: number;
  options: number[];
}

export default function BinaryCipher({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [timeLeft, setTimeLeft] = useState(6);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate binary question (4 bits)
  const generateQuestion = (): Question => {
    const decimal = Math.floor(Math.random() * 16); // 0 to 15
    const binary = decimal.toString(2).padStart(4, '0');

    // Create 4 distinct options including the correct decimal
    const optsSet = new Set<number>([decimal]);
    while (optsSet.size < 4) {
      optsSet.add(Math.floor(Math.random() * 16));
    }
    const options = Array.from(optsSet).sort((a, b) => a - b);

    return { binary, decimal, options };
  };

  // Timer loop per question
  useEffect(() => {
    if (isPlaying && !isEnded && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isEnded, timeLeft]);

  const handleTimeOut = () => {
    audio.playHit();
    setFeedback('wrong');
    setStreak(0);
    setTimeout(() => {
      endTheGame();
    }, 800);
  };

  const handleAnswer = (selected: number) => {
    if (feedback || !question) return;

    if (timerRef.current) clearInterval(timerRef.current);

    if (selected === question.decimal) {
      audio.playCoin();
      setFeedback('correct');
      const bonus = Math.min(50, streak * 5);
      const addedPoints = 20 + bonus;
      setScore((s) => s + addedPoints);
      onScore(addedPoints);
      setStreak((st) => st + 1);

      // Next question
      setTimeout(() => {
        setFeedback(null);
        setQuestion(generateQuestion());
        setTimeLeft(6);
      }, 600);
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
    setQuestion(generateQuestion());
    setTimeLeft(6);
    setIsEnded(false);
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-white relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-200 transition-colors bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-800"
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-2 text-yellow-400">
          <Trophy size={18} />
          <span className="font-mono text-sm tracking-wide">Record: {highScore} PX</span>
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold font-sans tracking-widest text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
          Déchiffreur Binaire
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          CONVERTIS LE NOMBRE BINAIRE EN DÉCIMAL AVANT LA FIN DU COMPTE À REBOURS !
        </p>
      </div>

      {/* Score / Streak board */}
      <div className="grid grid-cols-3 gap-3 mb-4 font-mono text-center relative z-10">
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SCORE</p>
          <p className="text-lg font-bold text-cyan-400">{score} PX</p>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-center">
          <p className="text-[10px] text-slate-400">TEMPS RESTANT</p>
          <p className={`text-lg font-bold ${timeLeft <= 2 ? 'text-red-500 animate-pulse' : 'text-slate-200'}`}>{timeLeft}s</p>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SÉRIE (STREAK)</p>
          <p className="text-lg font-bold text-yellow-400">x{streak}</p>
        </div>
      </div>

      {/* Cyberpunk display matrix */}
      <div className="flex justify-center my-4 relative z-10">
        <div className="w-full max-w-xs h-36 bg-slate-950/90 rounded-xl border-2 border-slate-800 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
          {/* Grid lines layout */}
          <div className="absolute inset-0 bg-slate-950/20 pointer-events-none flex flex-col justify-between p-2">
            <span className="text-[8px] font-mono text-cyan-500 opacity-60">CPU_DECODER_RUNNING...</span>
            <span className="text-[8px] font-mono text-cyan-500 opacity-60 text-right">MATRIX_v1.09</span>
          </div>

          {isPlaying && question && !feedback && (
            <div className="text-center">
              <span className="font-mono text-4xl font-extrabold tracking-widest text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                {question.binary}
              </span>
              <p className="text-[9px] font-mono text-slate-500 mt-2">DÉCODE LES 4 BITS CI-DESSUS</p>
            </div>
          )}

          {feedback === 'correct' && (
            <div className="flex flex-col items-center text-emerald-400 animate-bounce">
              <Check size={36} />
              <span className="text-xs font-mono font-bold mt-1 uppercase">CODE VALIDE !</span>
            </div>
          )}

          {feedback === 'wrong' && (
            <div className="flex flex-col items-center text-red-500 animate-pulse">
              <X size={36} />
              <span className="text-xs font-mono font-bold mt-1 uppercase">CODE FAUX !</span>
            </div>
          )}

          {!isPlaying && !isEnded && (
            <div className="text-center p-4">
              <button
                onClick={startGame}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold py-2 px-6 rounded-lg text-xs tracking-widest uppercase"
              >
                DÉMARRER LE DÉCODAGE
              </button>
            </div>
          )}

          {isEnded && (
            <div className="text-center p-4 flex flex-col items-center">
              <p className="text-rose-500 font-mono font-bold tracking-widest mb-1 text-xs uppercase">SYSTÈME CRASHÉ</p>
              <button
                onClick={startGame}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold py-2 px-6 rounded-lg text-xs flex items-center gap-1.5"
              >
                <RotateCcw size={12} /> REDÉMARRER
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Multiple choice button rows */}
      <div className="grid grid-cols-2 gap-3 mt-4 relative z-10">
        {isPlaying && question && question.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={!!feedback}
            className="bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-200 font-mono font-bold py-3 px-4 rounded-xl text-center shadow transition-all duration-100 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
