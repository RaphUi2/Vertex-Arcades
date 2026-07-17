import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ArrowLeft, RotateCcw, ArrowUp, ArrowDown, ArrowLeft as ArrowLeftIcon, ArrowRight } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 15;
const INITIAL_SPEED = 180; // ms

export default function RetroSnake({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [snake, setSnake] = useState<Point[]>([
    { x: 7, y: 7 },
    { x: 7, y: 8 },
    { x: 7, y: 9 }
  ]);
  const [food, setFood] = useState<Point>({ x: 3, y: 3 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const directionRef = useRef<Direction>('UP');
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Sync ref to prevent rapid double turns causing self-collision
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (directionRef.current !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (directionRef.current !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (directionRef.current !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Game Loop
  useEffect(() => {
    if (isPlaying) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, snake, direction, speed]);

  const generateFood = (currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOnSnake = true;
    while (isOnSnake) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      isOnSnake = currentSnake.some(part => part.x === newFood.x && part.y === newFood.y);
    }
    return newFood!;
  };

  const moveSnake = () => {
    const head = { ...snake[0] };
    const currentDir = directionRef.current;

    switch (currentDir) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
    }

    // Boundary checking
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      handleCrash();
      return;
    }

    // Self collision checking
    if (snake.some(part => part.x === head.x && part.y === head.y)) {
      handleCrash();
      return;
    }

    const newSnake = [head, ...snake];

    // Food collision checking
    if (head.x === food.x && head.y === food.y) {
      audio.playCoin();
      const addedPoints = 10;
      setScore(s => s + addedPoints);
      onScore(addedPoints);
      setFood(generateFood(newSnake));
      // Increase speed slightly
      setSpeed(s => Math.max(80, s - 5));
    } else {
      newSnake.pop(); // Remove tail
    }

    setSnake(newSnake);
  };

  const handleCrash = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    audio.playHit();
    audio.playGameOver();
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    onGameOver(score);
  };

  const startGame = () => {
    audio.playCoin();
    setSnake([
      { x: 7, y: 7 },
      { x: 7, y: 8 },
      { x: 7, y: 9 }
    ]);
    setDirection('UP');
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsGameOver(false);
    setIsPlaying(true);
    setFood({ x: 3, y: 3 });
  };

  const changeDirection = (newDir: Direction) => {
    const opposites = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT'
    };
    if (opposites[newDir] !== directionRef.current) {
      audio.playClick();
      setDirection(newDir);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-white relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

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

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold font-sans tracking-widest text-emerald-400 uppercase drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
          Néon Snake
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          MANIE LE SERPENT AVEC LES FLÈCHES DU CLAVIER OU DE L'ÉCRAN !
        </p>
      </div>

      {/* Score Panel */}
      <div className="grid grid-cols-2 gap-3 mb-6 font-mono text-center relative z-10">
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SCORE</p>
          <p className="text-xl font-bold text-emerald-400">{score} PX</p>
        </div>
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">VITESSE</p>
          <p className="text-xl font-bold text-slate-200">{Math.round(1000 / speed)}/s</p>
        </div>
      </div>

      {/* Snake Game Board */}
      <div className="flex justify-center items-center my-4 relative z-10">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-slate-900 rounded-xl border-4 border-slate-800 p-1 flex flex-col justify-between overflow-hidden shadow-inner">
          {/* Grid visual lines */}
          <div className="absolute inset-0 grid grid-cols-15 gap-0 pointer-events-none opacity-5">
            {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => (
              <div key={i} className="border border-white/10" />
            ))}
          </div>

          {/* Snake segments and Food render */}
          {[...Array(GRID_SIZE)].map((_, y) => (
            <div key={y} className="flex h-full w-full">
              {[...Array(GRID_SIZE)].map((_, x) => {
                const isHead = snake[0].x === x && snake[0].y === y;
                const isBody = snake.slice(1).some(part => part.x === x && part.y === y);
                const isFood = food.x === x && food.y === y;

                return (
                  <div
                    key={x}
                    className="w-full h-full p-[1px] transition-all duration-75"
                  >
                    {isHead ? (
                      <div className="w-full h-full rounded bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,1)]" />
                    ) : isBody ? (
                      <div className="w-full h-full rounded bg-emerald-500/80" />
                    ) : isFood ? (
                      <div className="w-full h-full rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,1)]" />
                    ) : (
                      <div className="w-full h-full bg-transparent" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* overlay states */}
          {(!isPlaying && !isGameOver) && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col justify-center items-center p-4 text-center">
              <p className="text-xs font-mono text-emerald-400 mb-4 font-bold tracking-widest uppercase">Prêt à ramper ?</p>
              <button
                onClick={startGame}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold py-2 px-6 rounded-lg text-xs"
              >
                DÉMARRER
              </button>
            </div>
          )}

          {isGameOver && (
            <div className="absolute inset-0 bg-slate-950/95 flex flex-col justify-center items-center p-4 text-center">
              <p className="text-red-500 font-mono font-bold tracking-widest mb-1 text-sm uppercase">GAME OVER</p>
              <p className="text-slate-400 text-xs font-mono mb-4">Score final : {score} PX</p>
              <button
                onClick={startGame}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold py-2 px-6 rounded-lg text-xs flex items-center gap-1"
              >
                <RotateCcw size={12} /> REESSAYER
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Screen D-pad / controls for mobile */}
      <div className="flex flex-col items-center gap-2 mt-4 relative z-10">
        <button
          onClick={() => changeDirection('UP')}
          disabled={!isPlaying}
          className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowUp size={20} className="text-emerald-400" />
        </button>
        <div className="flex gap-10">
          <button
            onClick={() => changeDirection('LEFT')}
            disabled={!isPlaying}
            className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeftIcon size={20} className="text-emerald-400" />
          </button>
          <button
            onClick={() => changeDirection('RIGHT')}
            disabled={!isPlaying}
            className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowRight size={20} className="text-emerald-400" />
          </button>
        </div>
        <button
          onClick={() => changeDirection('DOWN')}
          disabled={!isPlaying}
          className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowDown size={20} className="text-emerald-400" />
        </button>
      </div>
    </div>
  );
}
