import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ArrowLeft, RotateCcw, Heart, Shuffle, ArrowLeft as LeftIcon, ArrowRight as RightIcon } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

interface Orb {
  id: number;
  x: number;
  y: number;
  colorIdx: number; // Index of colors array
  speed: number;
}

const COLORS = [
  { name: 'cyan', hex: '#06b6d4', glow: 'shadow-[0_0_10px_rgba(6,182,212,0.8)]' },
  { name: 'yellow', hex: '#eab308', glow: 'shadow-[0_0_10px_rgba(234,179,8,0.8)]' },
  { name: 'rose', hex: '#f43f5e', glow: 'shadow-[0_0_10px_rgba(244,63,94,0.8)]' }
];

const STAGE_WIDTH = 300;
const STAGE_HEIGHT = 280;
const BASKET_WIDTH = 50;
const BASKET_HEIGHT = 10;

export default function ColorCatch({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  
  // Basket states
  const [basketX, setBasketX] = useState((STAGE_WIDTH - BASKET_WIDTH) / 2);
  const [basketColorIdx, setBasketColorIdx] = useState(0);

  // Orbs state
  const [orbs, setOrbs] = useState<Orb[]>([]);

  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const orbSpawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const stateRef = useRef({
    basketX: (STAGE_WIDTH - BASKET_WIDTH) / 2,
    basketColorIdx: 0,
    score: 0,
    lives: 3,
    orbs: [] as Orb[],
    leftPressed: false,
    rightPressed: false
  });

  // Keep state sync
  useEffect(() => {
    stateRef.current.basketX = basketX;
  }, [basketX]);

  useEffect(() => {
    stateRef.current.basketColorIdx = basketColorIdx;
  }, [basketColorIdx]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') stateRef.current.leftPressed = true;
      if (e.key === 'ArrowRight') stateRef.current.rightPressed = true;
      if (e.key === ' ') {
        e.preventDefault();
        shiftColor();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') stateRef.current.leftPressed = false;
      if (e.key === 'ArrowRight') stateRef.current.rightPressed = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main tick loop
  useEffect(() => {
    if (isPlaying && !isEnded) {
      gameTimerRef.current = setInterval(() => {
        // 1. Move Basket
        const state = stateRef.current;
        if (state.leftPressed) {
          setBasketX(prev => Math.max(0, prev - 6));
        }
        if (state.rightPressed) {
          setBasketX(prev => Math.min(STAGE_WIDTH - BASKET_WIDTH, prev + 6));
        }

        // 2. Move Orbs and handle Collisions
        setOrbs(prevOrbs => {
          const nextOrbs: Orb[] = [];
          
          for (let i = 0; i < prevOrbs.length; i++) {
            const orb = prevOrbs[i];
            const nextY = orb.y + orb.speed;

            // Collision with bottom/basket
            if (nextY >= STAGE_HEIGHT - BASKET_HEIGHT - 12 && nextY <= STAGE_HEIGHT - 4) {
              const insideX = orb.x >= state.basketX - 6 && orb.x <= state.basketX + BASKET_WIDTH + 6;

              if (insideX) {
                // Caught! Color matches?
                if (orb.colorIdx === state.basketColorIdx) {
                  audio.playCoin();
                  const addedPoints = 15;
                  state.score += addedPoints;
                  setScore(state.score);
                  onScore(addedPoints);
                } else {
                  // Catch wrong color
                  audio.playHit();
                  state.lives -= 1;
                  setLives(state.lives);
                  if (state.lives <= 0) {
                    handleGameOver();
                  }
                }
                continue; // Remove orb from list
              }
            }

            // Fall past bottom bounds
            if (nextY >= STAGE_HEIGHT) {
              // Missed correct orb?
              if (orb.colorIdx === state.basketColorIdx) {
                audio.playHit();
                state.lives -= 1;
                setLives(state.lives);
                if (state.lives <= 0) {
                  handleGameOver();
                }
              }
              continue; // Remove orb from list
            }

            nextOrbs.push({ ...orb, y: nextY });
          }

          state.orbs = nextOrbs;
          return nextOrbs;
        });
      }, 30);
    }

    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, [isPlaying, isEnded]);

  // Orb spawning loop
  useEffect(() => {
    if (isPlaying && !isEnded) {
      const spawnRate = Math.max(800, 2000 - score * 5);
      orbSpawnTimerRef.current = setInterval(() => {
        setOrbs(prev => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            x: Math.random() * (STAGE_WIDTH - 20) + 10,
            y: 0,
            colorIdx: Math.floor(Math.random() * COLORS.length),
            speed: Math.min(6, 2.5 + score * 0.01)
          }
        ]);
      }, spawnRate);
    }

    return () => {
      if (orbSpawnTimerRef.current) clearInterval(orbSpawnTimerRef.current);
    };
  }, [isPlaying, isEnded, score]);

  const shiftColor = () => {
    audio.playClick();
    setBasketColorIdx(prev => (prev + 1) % COLORS.length);
  };

  const handleGameOver = () => {
    setIsPlaying(false);
    setIsEnded(true);
    audio.playGameOver();
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (orbSpawnTimerRef.current) clearInterval(orbSpawnTimerRef.current);
    onGameOver(stateRef.current.score);
  };

  const startNewGame = () => {
    audio.playCoin();
    stateRef.current = {
      basketX: (STAGE_WIDTH - BASKET_WIDTH) / 2,
      basketColorIdx: 0,
      score: 0,
      lives: 3,
      orbs: [],
      leftPressed: false,
      rightPressed: false
    };
    setBasketX((STAGE_WIDTH - BASKET_WIDTH) / 2);
    setBasketColorIdx(0);
    setOrbs([]);
    setScore(0);
    setLives(3);
    setIsEnded(false);
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] text-white relative overflow-hidden">
      {/* Background neon lights */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

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
          Color Catch
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          ATTRAPE LES SPHÈRES EN HARMONISANT LA COULEUR DE TON RÉCEPTACLE !
        </p>
      </div>

      {/* Stats Panel */}
      <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-center relative z-10">
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SCORE</p>
          <p className="text-lg font-bold text-yellow-500">{score} PX</p>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
          <p className="text-[10px] text-slate-400">VIES</p>
          <div className="flex justify-center gap-1 mt-0.5">
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

      {/* Falling Stage Arena */}
      <div className="flex justify-center items-center my-3 relative z-10">
        <div className="relative w-[300px] h-[280px] bg-slate-900 rounded-xl border-4 border-slate-800 shadow-inner overflow-hidden">
          {/* Render Orbs */}
          {orbs.map(orb => (
            <div
              key={orb.id}
              className="absolute w-4 h-4 rounded-full animate-bounce-slow"
              style={{
                left: orb.x - 8,
                top: orb.y,
                backgroundColor: COLORS[orb.colorIdx].hex,
                boxShadow: `0 0 12px ${COLORS[orb.colorIdx].hex}`
              }}
            />
          ))}

          {/* Render Basket */}
          <div
            className="absolute transition-all duration-75 rounded"
            style={{
              left: basketX,
              bottom: 10,
              width: BASKET_WIDTH,
              height: BASKET_HEIGHT,
              backgroundColor: COLORS[basketColorIdx].hex,
              boxShadow: `0 0 15px ${COLORS[basketColorIdx].hex}`,
              borderTop: '2px solid white'
            }}
          />

          {/* Overlays */}
          {!isPlaying && !isEnded && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col justify-center items-center p-4 text-center">
              <p className="text-xs font-mono text-yellow-400 mb-4 font-bold tracking-widest uppercase">Prêt à attraper ?</p>
              <button
                onClick={startNewGame}
                className="bg-yellow-600 hover:bg-yellow-500 text-white font-mono font-bold py-2.5 px-6 rounded-lg text-xs tracking-widest"
              >
                DÉMARRER
              </button>
            </div>
          )}

          {isEnded && (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col justify-center items-center p-4 text-center">
              <p className="text-rose-500 font-mono font-bold tracking-widest mb-1 text-sm uppercase">GAME OVER</p>
              <p className="text-slate-400 text-xs font-mono mb-4">Score final : {score} PX</p>
              <button
                onClick={startNewGame}
                className="bg-yellow-600 hover:bg-yellow-500 text-white font-mono font-bold py-2 px-6 rounded-lg text-xs flex items-center gap-1.5"
              >
                <RotateCcw size={12} /> REESSAYER
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Multi-tier controller buttons */}
      <div className="flex items-center justify-between gap-4 mt-4 relative z-10">
        {/* Left move */}
        <button
          onTouchStart={() => { stateRef.current.leftPressed = true; }}
          onTouchEnd={() => { stateRef.current.leftPressed = false; }}
          onMouseDown={() => { stateRef.current.leftPressed = true; }}
          onMouseUp={() => { stateRef.current.leftPressed = false; }}
          onMouseLeave={() => { stateRef.current.leftPressed = false; }}
          className="w-14 h-12 rounded-xl bg-slate-900 border border-slate-700 active:bg-slate-800 flex items-center justify-center cursor-pointer select-none"
        >
          <LeftIcon size={20} className="text-yellow-500" />
        </button>

        {/* Color Shifter */}
        <button
          onClick={shiftColor}
          disabled={!isPlaying || isEnded}
          className="flex-1 h-12 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 active:scale-95 flex items-center justify-center gap-1.5 font-mono text-xs font-bold text-slate-300 select-none shadow-[0_0_10px_rgba(255,255,255,0.05)] cursor-pointer"
        >
          <Shuffle size={14} className="text-yellow-500" /> MUTATION COLORÉE
        </button>

        {/* Right move */}
        <button
          onTouchStart={() => { stateRef.current.rightPressed = true; }}
          onTouchEnd={() => { stateRef.current.rightPressed = false; }}
          onMouseDown={() => { stateRef.current.rightPressed = true; }}
          onMouseUp={() => { stateRef.current.rightPressed = false; }}
          onMouseLeave={() => { stateRef.current.rightPressed = false; }}
          className="w-14 h-12 rounded-xl bg-slate-900 border border-slate-700 active:bg-slate-800 flex items-center justify-center cursor-pointer select-none"
        >
          <RightIcon size={20} className="text-yellow-500" />
        </button>
      </div>
    </div>
  );
}
