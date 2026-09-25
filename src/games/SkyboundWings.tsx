import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../utils/audio';
import { Play, RotateCcw, X, Feather, Wind, Sparkles } from 'lucide-react';

interface GameProps {
  onFinish: (score: number, bonusVC?: number) => void;
  onExit: () => void;
}

export function SkyboundWings({ onFinish, onExit }: GameProps) {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState(0);
  const [altitude, setAltitude] = useState(500);
  const [ringsPassed, setRingsPassed] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gliderRef = useRef({ x: 120, y: 200, vy: 0, pitch: 0 });
  const ringsRef = useRef<{ x: number; y: number; r: number; passed: boolean }[]>([]);
  const cloudsRef = useRef<{ x: number; y: number; speed: number }[]>([]);

  const keysRef = useRef<{ up: boolean; down: boolean }>({ up: false, down: false });

  const startGame = () => {
    audio.playStart();
    setGameState('playing');
    setScore(0);
    setAltitude(500);
    setRingsPassed(0);
    gliderRef.current = { x: 120, y: 200, vy: 0, pitch: 0 };
    ringsRef.current = [];
    cloudsRef.current = [
      { x: 100, y: 80, speed: 1.5 },
      { x: 450, y: 150, speed: 2 },
      { x: 700, y: 280, speed: 1.8 }
    ];
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent, isDown: boolean) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') keysRef.current.up = isDown;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') keysRef.current.down = isDown;
    };
    const down = (e: KeyboardEvent) => handleKey(e, true);
    const up = (e: KeyboardEvent) => handleKey(e, false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // Main Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let animId: number;
    let spawnTimer = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      const g = gliderRef.current;
      const k = keysRef.current;

      // Glide physics
      if (k.up) {
        g.vy -= 0.35;
        g.pitch = -0.3;
      } else if (k.down) {
        g.vy += 0.35;
        g.pitch = 0.3;
      } else {
        g.vy += 0.12; // Natural slow descent
        g.pitch = 0.05;
      }

      g.vy *= 0.94;
      g.y += g.vy;

      // Floor & ceiling crash
      if (g.y < 20 || g.y > canvas.height - 20) {
        audio.playOof();
        setGameState('gameover');
        onFinish(score + ringsPassed * 100, 25);
      }

      setAltitude(Math.max(0, Math.floor(600 - g.y)));

      // Spawn Rings
      spawnTimer++;
      if (spawnTimer % 65 === 0) {
        ringsRef.current.push({
          x: canvas.width + 30,
          y: Math.random() * (canvas.height - 140) + 70,
          r: 32,
          passed: false
        });
      }

      // Move Rings
      ringsRef.current.forEach(ring => {
        ring.x -= 4.5;

        // Check if glider passed through ring
        if (!ring.passed && Math.abs(g.x - ring.x) < 16) {
          if (Math.abs(g.y - ring.y) < ring.r) {
            ring.passed = true;
            audio.playCoin();
            setScore(s => s + 200);
            setRingsPassed(rp => rp + 1);
          }
        }
      });

      ringsRef.current = ringsRef.current.filter(r => r.x > -60);

      // Move Clouds
      cloudsRef.current.forEach(cl => {
        cl.x -= cl.speed;
        if (cl.x < -120) cl.x = canvas.width + 50;
      });

      // RENDER
      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#0284c7');
      skyGrad.addColorStop(1, '#bae6fd');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      cloudsRef.current.forEach(cl => {
        ctx.beginPath();
        ctx.arc(cl.x, cl.y, 45, 0, Math.PI * 2);
        ctx.arc(cl.x + 35, cl.y - 15, 35, 0, Math.PI * 2);
        ctx.arc(cl.x + 65, cl.y, 40, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Golden Rings
      ringsRef.current.forEach(ring => {
        ctx.strokeStyle = ring.passed ? '#22c55e' : '#f59e0b';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Draw Glider (Wings of Acaris)
      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(g.pitch);

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(-20, -18);
      ctx.lineTo(-8, 0);
      ctx.lineTo(-20, 18);
      ctx.closePath();
      ctx.fill();

      // Golden cockpit
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(2, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, score, ringsPassed, onFinish]);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[#081525] border-2 border-sky-400/50 rounded-3xl p-6 shadow-[0_0_40px_rgba(56,189,248,0.3)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-sky-400/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-400/20 border border-sky-400 flex items-center justify-center text-sky-300 font-bold text-lg">
            🪽
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">Skybound: Wings of Acaris</h2>
            <p className="text-xs text-sky-400 font-mono">Anneaux franchis: {ringsPassed} ⭕ • Altitude: {altitude}m</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-mono font-bold">
          <div className="text-yellow-400">Score: {score}</div>
          <button onClick={onExit} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-sky-900/60 bg-[#0284c7] flex justify-center">
        <canvas ref={canvasRef} width={800} height={380} className="w-full max-w-[800px] h-auto block" />

        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-300 font-mono mb-2">
              SKYBOUND WINGS
            </h3>
            <p className="text-slate-300 text-sm max-w-md mb-6">
              Déployez vos ailes mécaniques ! Utilisez <strong>Haut / W</strong> pour monter et <strong>Bas / S</strong> pour plonger à travers les anneaux dorés flottants.
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(56,189,248,0.5)] cursor-pointer flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" /> S'ÉLANCER DANS LE CIEL
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl mb-2">🪽💥</div>
            <h3 className="text-2xl font-black text-rose-500 font-mono mb-2">ATTERRISSAGE D'URGENCE</h3>
            <p className="text-slate-300 text-sm mb-4">Score final : <strong className="text-sky-300">{score} pts</strong></p>
            <div className="flex gap-3">
              <button onClick={startGame} className="px-6 py-2.5 rounded-xl bg-sky-400 text-slate-950 font-bold text-xs uppercase">
                Rejouer
              </button>
              <button onClick={onExit} className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs uppercase">
                Quitter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
