import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ArrowLeft, RotateCcw, Clock } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

export default function WhackNode({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [activeNodes, setActiveNodes] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Spawning loop
  useEffect(() => {
    if (isPlaying && !isEnded) {
      spawnIntervalRef.current = setInterval(() => {
        // Spawn 1 to 2 random nodes
        const count = Math.random() > 0.7 ? 2 : 1;
        const newNodes: number[] = [];
        
        while (newNodes.length < count) {
          const idx = Math.floor(Math.random() * 9);
          if (!newNodes.includes(idx)) {
            newNodes.push(idx);
          }
        }

        setActiveNodes(newNodes);

        // Disappear after some time (based on score speed-up)
        const disappearTime = Math.max(600, 1200 - score * 4);
        setTimeout(() => {
          setActiveNodes([]);
        }, disappearTime);

      }, 1400);
    }

    return () => {
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    };
  }, [isPlaying, isEnded, score]);

  // General 30s countdown timer
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      gameTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(gameTimerRef.current!);
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, [isPlaying, timeLeft]);

  const handleTimeOut = () => {
    setIsPlaying(false);
    setIsEnded(true);
    audio.playGameOver();
    onGameOver(score);
  };

  const whackNode = (index: number) => {
    if (!isPlaying) return;

    if (activeNodes.includes(index)) {
      audio.playCoin();
      const addedPoints = 15;
      setScore(s => s + addedPoints);
      onScore(addedPoints);
      setActiveNodes(prev => prev.filter(n => n !== index));
    }
  };

  const startGame = () => {
    audio.playCoin();
    setScore(0);
    setTimeLeft(30);
    setIsEnded(false);
    setIsPlaying(true);
    setActiveNodes([]);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] text-white relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-yellow-500 hover:text-yellow-300 transition-colors bg-yellow-950/40 px-3 py-1.5 rounded-lg border border-yellow-850"
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-2 text-yellow-400">
          <Trophy size={18} />
          <span className="font-mono text-sm tracking-wide">Record: {highScore} PX</span>
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold font-sans tracking-widest text-yellow-500 uppercase drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
          Tape la Node !
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          CLIQUE SUR LES NODES QUI SURGISSENT DE LA GRILLE !
        </p>
      </div>

      {/* Score and Timer Panels */}
      <div className="grid grid-cols-2 gap-3 mb-6 font-mono text-center relative z-10">
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SCORE</p>
          <p className="text-lg font-bold text-yellow-500">{score} PX</p>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-center items-center">
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Clock size={10} /> TEMPS
          </div>
          <p className={`text-lg font-bold ${timeLeft <= 6 ? 'text-red-500 animate-pulse' : 'text-slate-200'}`}>{timeLeft}s</p>
        </div>
      </div>

      {/* Whack-a-node Board Arena */}
      <div className="flex justify-center items-center my-4 relative z-10">
        <div className="grid grid-cols-3 gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-inner">
          {Array(9).fill(null).map((_, index) => {
            const isActive = activeNodes.includes(index);
            
            return (
              <button
                key={index}
                onClick={() => whackNode(index)}
                disabled={!isPlaying}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 transition-all duration-100 flex items-center justify-center relative overflow-hidden ${
                  isActive
                    ? 'bg-yellow-500 border-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.8)] scale-105 active:scale-95 cursor-pointer'
                    : 'bg-slate-950 border-slate-800 opacity-40 cursor-not-allowed'
                }`}
              >
                {isActive && (
                  <div className="w-4 h-4 rounded-full bg-white animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Trigger */}
      <div className="flex justify-center mt-6 relative z-10">
        {!isPlaying && (
          <button
            onClick={startGame}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-mono font-bold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all transform active:scale-95 text-sm tracking-widest"
          >
            <RotateCcw size={16} /> {isEnded ? 'REJOUER' : 'LANCER LA PARTIE'}
          </button>
        )}
      </div>
    </div>
  );
}
