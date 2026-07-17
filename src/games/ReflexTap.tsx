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
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // ms between changes

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

  // General Timer countdown - Only starts/stops on isPlaying state change
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
    
    // Choose random node 0-8 different from current active node if possible
    let nextNode = Math.floor(Math.random() * 9);
    while (nextNode === activeNode) {
      nextNode = Math.floor(Math.random() * 9);
    }

    setActiveNode(nextNode);

    // Node expiration timer (if they miss it, they lose a life)
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
        // Accelerate speed dynamically as score grows
        if (nextScore % 60 === 0) {
          setSpeed((s) => Math.max(400, s - 80));
        }
        return nextScore;
      });
      onScore(addedPoints);
      triggerNextNode();
    } else {
      // Mistake
      audio.playHit();
      setLives((prev) => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          handleGameOver();
        }
        return nextLives;
      });
    }
  };

  const startNewGame = () => {
    audio.playCoin();
    setScore(0);
    setLives(3);
    setTimeLeft(30);
    setSpeed(1000);
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] text-white relative overflow-hidden">
      {/* Background neon elements */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-rose-400 hover:text-rose-200 transition-colors bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-800"
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-2 text-yellow-400">
          <Trophy size={18} />
          <span className="font-mono text-sm tracking-wide">Record: {highScore} PX</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold font-sans tracking-widest text-rose-400 uppercase drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">
          Vitesse Réflexe
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          CLIQUE SUR LES NODES QUI S'ALLUMENT LE PLUS VITE POSSIBLE !
        </p>
      </div>

      {/* Info Panel */}
      <div className="grid grid-cols-3 gap-3 mb-6 font-mono text-center relative z-10">
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SCORE</p>
          <p className="text-lg font-bold text-rose-400">{score} PX</p>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
          <p className="text-[10px] text-slate-400">TEMPS</p>
          <p className="text-lg font-bold text-slate-200">{timeLeft}s</p>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
          <p className="text-[10px] text-slate-400">VIES</p>
          <div className="flex justify-center gap-0.5 mt-0.5">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                size={14}
                className={i < lives ? "fill-rose-500 text-rose-500 animate-pulse" : "text-slate-800"}
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
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 transition-all duration-75 relative overflow-hidden flex items-center justify-center ${
                  isActive
                    ? 'bg-rose-500 border-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.8)] scale-105 active:scale-95 cursor-pointer'
                    : 'bg-slate-950 border-slate-800 opacity-30 cursor-not-allowed'
                }`}
              >
                {isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                  >
                    <Zap size={24} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
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
            className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-mono font-bold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all transform active:scale-95 text-sm tracking-widest"
          >
            <RotateCcw size={16} /> {lives <= 0 || timeLeft === 0 ? 'REJOUER' : 'LANCER LA PARTIE'}
          </button>
        ) : (
          <div className="text-xs text-rose-400 font-mono flex items-center gap-1.5 bg-rose-950/20 py-2 px-4 rounded-lg border border-rose-900/40 animate-pulse">
            <Zap size={14} /> CADENCE : {(speed / 1000).toFixed(2)}s / node
          </div>
        )}
      </div>
    </div>
  );
}
