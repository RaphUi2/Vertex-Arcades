import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../utils/audio';
import { Play, RotateCcw, X, Gauge, Zap, Flame } from 'lucide-react';

interface GameProps {
  onFinish: (score: number, bonusVC?: number) => void;
  onExit: () => void;
}

export function HyperDrift({ onFinish, onExit }: GameProps) {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState(0);
  const [nitro, setNitro] = useState(100);
  const [speed, setSpeed] = useState(120);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const carRef = useRef({ x: 400, y: 310, vx: 0, isDrifting: false });
  const trafficRef = useRef<{ x: number; y: number; speed: number; color: string }[]>([]);
  const tireMarksRef = useRef<{ x: number; y: number; life: number }[]>([]);

  const keysRef = useRef<{ left: boolean; right: boolean; drift: boolean; boost: boolean }>({
    left: false, right: false, drift: false, boost: false
  });

  const startGame = () => {
    audio.playStart();
    setGameState('playing');
    setScore(0);
    setNitro(100);
    setSpeed(120);
    carRef.current = { x: 400, y: 310, vx: 0, isDrifting: false };
    trafficRef.current = [];
    tireMarksRef.current = [];
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent, isDown: boolean) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = isDown;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = isDown;
      if (e.code === 'Space' || e.code === 'ShiftLeft') keysRef.current.drift = isDown;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keysRef.current.boost = isDown;
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
      const c = carRef.current;
      const k = keysRef.current;

      // Drift & Steering
      const steerPower = k.drift ? 7.5 : 4.5;
      if (k.left) c.vx -= steerPower * 0.15;
      if (k.right) c.vx += steerPower * 0.15;
      c.vx *= 0.88;
      c.x += c.vx;

      // Road bounds
      c.x = Math.max(160, Math.min(canvas.width - 160, c.x));

      // Nitro boost
      let currentSpeed = 120;
      if (k.boost && nitro > 0) {
        currentSpeed = 220;
        setNitro(n => Math.max(0, n - 0.7));
      } else {
        setNitro(n => Math.min(100, n + 0.2));
      }
      setSpeed(currentSpeed);
      setScore(s => s + Math.floor(currentSpeed * 0.05));

      // Tire marks if drifting
      if (k.drift && Math.abs(c.vx) > 1.5) {
        tireMarksRef.current.push({ x: c.x - 8, y: c.y + 12, life: 30 });
        tireMarksRef.current.push({ x: c.x + 8, y: c.y + 12, life: 30 });
      }

      // Spawn Traffic
      spawnTimer++;
      if (spawnTimer % 35 === 0) {
        const laneX = [220, 320, 420, 520][Math.floor(Math.random() * 4)];
        trafficRef.current.push({
          x: laneX,
          y: -40,
          speed: 4 + Math.random() * 2,
          color: Math.random() > 0.4 ? '#38bdf8' : '#ef4444'
        });
      }

      // Update Traffic
      trafficRef.current.forEach(t => {
        t.y += t.speed + (currentSpeed > 150 ? 4 : 0);

        // Crash check
        if (Math.abs(c.x - t.x) < 26 && Math.abs(c.y - t.y) < 36) {
          audio.playExplosion();
          audio.playOof();
          setGameState('gameover');
          onFinish(score, 40);
        }
      });

      trafficRef.current = trafficRef.current.filter(t => t.y < canvas.height + 50);

      // Update Tire marks
      tireMarksRef.current.forEach(tm => { tm.y += 6; tm.life--; });
      tireMarksRef.current = tireMarksRef.current.filter(tm => tm.life > 0);

      // RENDER
      ctx.fillStyle = '#060714';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Highway Neon Asphalt
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(140, 0, canvas.width - 280, canvas.height);

      // Road side borders
      ctx.strokeStyle = '#d946ef';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(140, 0); ctx.lineTo(140, canvas.height);
      ctx.moveTo(canvas.width - 140, 0); ctx.lineTo(canvas.width - 140, canvas.height);
      ctx.stroke();

      // Tire marks
      ctx.fillStyle = 'rgba(217, 70, 239, 0.4)';
      tireMarksRef.current.forEach(tm => {
        ctx.fillRect(tm.x, tm.y, 4, 8);
      });

      // Draw Traffic Cars
      trafficRef.current.forEach(t => {
        ctx.fillStyle = t.color;
        ctx.fillRect(t.x - 12, t.y - 20, 24, 40);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(t.x - 10, t.y + 16, 6, 3);
        ctx.fillRect(t.x + 4, t.y + 16, 6, 3);
      });

      // Draw Player Drift Supercar
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.vx * 0.05);

      // Neon Underglow
      ctx.fillStyle = 'rgba(217, 70, 239, 0.5)';
      ctx.fillRect(-18, -26, 36, 52);

      // Car body
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(-14, -22, 28, 44);

      // Windshield
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-10, -10, 20, 14);

      // Tail lights
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-12, 18, 8, 4);
      ctx.fillRect(4, 18, 8, 4);

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, score, nitro, onFinish]);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[#120817] border-2 border-fuchsia-500/50 rounded-3xl p-6 shadow-[0_0_40px_rgba(217,70,239,0.3)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-fuchsia-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 border border-fuchsia-400 flex items-center justify-center text-fuchsia-300 font-bold text-lg">
            🏎️
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">HyperDrift: Neo Tokyo 2099 (VIP)</h2>
            <p className="text-xs text-fuchsia-400 font-mono">Vitesse : {speed} km/h • Nitro : {Math.round(nitro)}%</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-mono font-bold">
          <div className="text-cyan-300">Score: {score}</div>
          <button onClick={onExit} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-fuchsia-900/60 bg-[#060714] flex justify-center">
        <canvas ref={canvasRef} width={800} height={380} className="w-full max-w-[800px] h-auto block" />

        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400 font-mono mb-2">
              HYPERDRIFT NEO TOKYO
            </h3>
            <p className="text-slate-300 text-sm max-w-md mb-6">
              Dérivez sur l'autoroute cyberpunk VIP ! <strong>Flèches Gauche / Droite</strong> pour tourner, <strong>Espace / Shift</strong> pour déraper et <strong>Haut / W</strong> pour la Nitro !
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(217,70,239,0.5)] cursor-pointer flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" /> ALLUMER LE MOTEUR
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl mb-2">💥🏎️</div>
            <h3 className="text-2xl font-black text-rose-500 font-mono mb-2">CRASH À HAUTE VITESSE</h3>
            <p className="text-slate-300 text-sm mb-4">Score de drift : <strong className="text-fuchsia-400">{score} pts</strong></p>
            <div className="flex gap-3">
              <button onClick={startGame} className="px-6 py-2.5 rounded-xl bg-fuchsia-500 text-slate-950 font-bold text-xs uppercase">
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
