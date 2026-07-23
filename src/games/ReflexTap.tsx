import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, ArrowLeft, RotateCcw, Heart, Zap } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

export default function ReflexTap({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(10);
  const [timeLeft, setTimeLeft] = useState(60);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3000); // 3000ms per node -> 200x easier!

  const nodeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Core game loop
  useEffect(() => {
    if (isPlaying) {
      triggerNextNode();
    }
    return () => {
      if (nodeTimerRef.current) clearTimeout(nodeTimerRef.current);
    };
  }, [isPlaying, activeNode, speed]);

  // General Timer countdown
  useEffect(() => {
    if (isPlaying) {
      gameTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (gameTimerRef.current) clearInterval(gameTimerRef.current);
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, [isPlaying]);

  const triggerNextNode = () => {
    if (nodeTimerRef.current) clearTimeout(nodeTimerRef.current);
    
    // Choose random node 0-8 different from current
    let nextNode = Math.floor(Math.random() * 9);
    while (nextNode === activeNode) {
      nextNode = Math.floor(Math.random() * 9);
    }

    setActiveNode(nextNode);

    // Node expiration timer (generous 3s)
    nodeTimerRef.current = setTimeout(() => {
      if (isPlaying) {
        setLives((prev) => {
          const nextLives = prev - 1;
          audio.playHit();
          if (nextLives <= 0) {
            handleGameOver();
          }
          return nextLives;
        });
        triggerNextNode();
      }
    }, speed);
  };

  const handleGameOver = () => {
    setIsPlaying(false);
    setActiveNode(null);
    if (nodeTimerRef.current) clearTimeout(nodeTimerRef.current);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    audio.playGameOver();
    onGameOver(score);
  };

  const handleNodeClick = (index: number) => {
    if (!isPlaying) return;

    if (index === activeNode) {
      audio.playClick();
      const addedPoints = 15;
      setScore((prev) => {
        const nextScore = prev + addedPoints;
        return nextScore;
      });
      onScore(addedPoints);
      triggerNextNode();
    }
  };

  const startNewGame = () => {
    audio.playCoin();
    setScore(0);
    setLives(10);
    setTimeLeft(60);
    setSpeed(3000);
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-white relative overflow-hidden font-mono">
      {/* Background neon elements */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-200 transition-colors bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800 cursor-pointer"
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-2 text-yellow-400">
          <Trophy size={18} />
          <span className="text-sm tracking-wide">Record: {highScore} PX</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 bg-emerald-900/60 text-emerald-300 text-[10px] font-bold rounded-full uppercase tracking-wider mb-2 border border-emerald-700">
          NIVEAU : FACILE (MODE ULTRA DÉTENTE x200)
        </span>
        <h2 className="text-2xl font-bold tracking-widest text-emerald-400 uppercase drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
          Vitesse Réflexe
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          CLIQUE SUR LES NODES VERTES GÉANTES SANS STRESS (3 SECONDES DERNIÈRES PAR NODE) !
        </p>
      </div>

      {/* Info Panel */}
      <div className="grid grid-cols-3 gap-3 mb-6 text-center relative z-10">
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SCORE</p>
          <p className="text-lg font-bold text-emerald-400">{score} PX</p>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
          <p className="text-[10px] text-slate-400">TEMPS</p>
          <p className="text-lg font-bold text-slate-200">{timeLeft}s</p>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
          <p className="text-[10px] text-slate-400">VIES</p>
          <div className="flex justify-center flex-wrap gap-0.5 mt-1 max-w-[80px]">
            {[...Array(10)].map((_, i) => (
              <Heart
                key={i}
                size={10}
                className={i < lives ? "fill-emerald-400 text-emerald-400 animate-pulse" : "text-slate-800"}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="flex justify-center my-4 relative z-10">
        <div className="grid grid-cols-3 gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
          {[...Array(9)].map((_, index) => {
            const isActive = index === activeNode;
            return (
              <button
                key={index}
                onClick={() => handleNodeClick(index)}
                disabled={!isPlaying}
                className={`w-18 h-18 sm:w-22 sm:h-22 rounded-2xl border-2 transition-all duration-150 relative overflow-hidden flex items-center justify-center cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 border-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.9)] scale-105 active:scale-95'
                    : 'bg-slate-950 border-slate-800 opacity-25'
                }`}
              >
                {isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Zap size={28} className="text-slate-950 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Action */}
      <div className="flex justify-center mt-6 relative z-10">
        {!isPlaying ? (
          <button
            onClick={startNewGame}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all transform active:scale-95 text-sm tracking-widest cursor-pointer uppercase"
          >
            <RotateCcw size={16} /> {lives <= 0 || timeLeft === 0 ? 'REJOUER' : 'LANCER LA PARTIE'}
          </button>
        ) : (
          <div className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-950/20 py-2 px-4 rounded-lg border border-emerald-900/40 animate-pulse">
            <Zap size={14} /> CADENCE ULTRA PACIFIQUE : 3.0s par node !
          </div>
        )}
      </div>
    </div>
  );
}
