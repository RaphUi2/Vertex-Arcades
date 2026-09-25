import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../utils/audio';
import { Play, RotateCcw, X, Shield, Lock, Unlock, Key, Coins } from 'lucide-react';

interface GameProps {
  onFinish: (score: number, bonusVC?: number) => void;
  onExit: () => void;
}

export function CyberHeist({ onFinish, onExit }: GameProps) {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover' | 'escaped'>('ready');
  const [score, setScore] = useState(0);
  const [hackedTerminals, setHackedTerminals] = useState<number[]>([]);
  const [lootBag, setLootBag] = useState(0);
  const [alarmLevel, setAlarmLevel] = useState(0); // 0 to 100

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef({ x: 60, y: 320, vx: 0, vy: 0, speed: 4.2 });

  const lasersRef = useRef<{ y: number; minX: number; maxX: number; dir: number; active: boolean }[]>([
    { y: 120, minX: 100, maxX: 400, dir: 2, active: true },
    { y: 200, minX: 300, maxX: 680, dir: -2.5, active: true },
    { y: 280, minX: 150, maxX: 550, dir: 3, active: true }
  ]);

  const terminalsRef = useRef<{ id: number; x: number; y: number; hacked: boolean }[]>([
    { id: 1, x: 180, y: 70, hacked: false },
    { id: 2, x: 650, y: 140, hacked: false },
    { id: 3, x: 420, y: 320, hacked: false }
  ]);

  const keysRef = useRef<{ w: boolean; s: boolean; a: boolean; d: boolean }>({ w: false, s: false, a: false, d: false });

  const startGame = () => {
    audio.playStart();
    setGameState('playing');
    setScore(0);
    setHackedTerminals([]);
    setLootBag(0);
    setAlarmLevel(0);
    playerRef.current.x = 60;
    playerRef.current.y = 320;
    terminalsRef.current.forEach(t => { t.hacked = false; });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent, pressed: boolean) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') keysRef.current.w = pressed;
      if (e.code === 'KeyS' || e.code === 'ArrowDown') keysRef.current.s = pressed;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') keysRef.current.a = pressed;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') keysRef.current.d = pressed;
    };
    const down = (e: KeyboardEvent) => onKey(e, true);
    const up = (e: KeyboardEvent) => onKey(e, false);
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      const p = playerRef.current;
      const k = keysRef.current;

      p.vx = (k.d ? 1 : 0) - (k.a ? 1 : 0);
      p.vy = (k.s ? 1 : 0) - (k.w ? 1 : 0);

      // Normalize speed
      const len = Math.hypot(p.vx, p.vy);
      if (len > 0) {
        p.x += (p.vx / len) * p.speed;
        p.y += (p.vy / len) * p.speed;
      }

      // Constrain inside room
      p.x = Math.max(30, Math.min(canvas.width - 30, p.x));
      p.y = Math.max(30, Math.min(canvas.height - 30, p.y));

      // Move Lasers
      lasersRef.current.forEach(laser => {
        laser.minX += laser.dir;
        laser.maxX += laser.dir;
        if (laser.minX < 50 || laser.maxX > canvas.width - 50) {
          laser.dir *= -1;
        }

        // Check laser collision with player
        if (Math.abs(p.y - laser.y) < 14 && p.x >= laser.minX && p.x <= laser.maxX) {
          audio.playHit();
          setAlarmLevel(prev => {
            const next = prev + 1.8;
            if (next >= 100) {
              audio.playOof();
              setGameState('gameover');
              onFinish(score + lootBag, 20);
              return 100;
            }
            return next;
          });
        }
      });

      // Terminal Proximity / Hack
      terminalsRef.current.forEach(t => {
        if (!t.hacked && Math.hypot(p.x - t.x, p.y - t.y) < 30) {
          t.hacked = true;
          audio.playCoin();
          setHackedTerminals(prev => [...prev, t.id]);
          setLootBag(lb => lb + 400);
          setScore(s => s + 500);
        }
      });

      // Vault Extraction Zone (Top Right Green Pad)
      const allHacked = terminalsRef.current.every(t => t.hacked);
      if (allHacked && p.x > canvas.width - 80 && p.y < 80) {
        audio.playWin();
        setGameState('escaped');
        onFinish(score + lootBag + 1000, 200);
        return;
      }

      // RENDER
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floor tiles
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Extraction Zone
      if (allHacked) {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
        ctx.fillRect(canvas.width - 90, 15, 75, 75);
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.strokeRect(canvas.width - 90, 15, 75, 75);
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('SORTIE VIP', canvas.width - 85, 55);
      }

      // Draw Lasers
      lasersRef.current.forEach(laser => {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(laser.minX, laser.y);
        ctx.lineTo(laser.maxX, laser.y);
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(laser.minX, laser.y, 6, 0, Math.PI * 2);
        ctx.arc(laser.maxX, laser.y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Terminals
      terminalsRef.current.forEach(t => {
        ctx.fillStyle = t.hacked ? '#22c55e' : '#f59e0b';
        ctx.fillRect(t.x - 14, t.y - 14, 28, 28);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(t.x - 14, t.y - 14, 28, 28);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(t.hacked ? 'HACK' : 'CODE', t.x - 12, t.y + 4);
      });

      // Draw Player Spy
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
      ctx.fill();

      // Stealth sunglasses
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(p.x - 8, p.y - 4, 16, 6);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, score, lootBag, onFinish]);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[#0a0d1a] border-2 border-amber-500/50 rounded-3xl p-6 shadow-[0_0_40px_rgba(245,158,11,0.3)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 font-bold text-lg">
            💰
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">CyberHeist: Vault 99 (VIP)</h2>
            <p className="text-xs text-amber-400 font-mono">Terminaux: {hackedTerminals.length}/3 • Butin: {lootBag} VC</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-mono font-bold">
          <div className={alarmLevel > 60 ? 'text-rose-500 animate-pulse' : 'text-amber-400'}>
            Alarme: {Math.round(alarmLevel)}%
          </div>
          <div className="text-white">Score: {score}</div>
          <button onClick={onExit} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-amber-900/60 bg-[#060913] flex justify-center">
        <canvas ref={canvasRef} width={800} height={380} className="w-full max-w-[800px] h-auto block" />

        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 font-mono mb-2">
              CYBER HEIST VAULT 99
            </h3>
            <p className="text-slate-300 text-sm max-w-md mb-6">
              Infiltrez la chambre forte VIP ! Déplacez-vous avec <strong>Z-Q-S-D / Flèches</strong>, esquivez les lasers de sécurité et piratez les 3 terminaux avant de filer par l'extraction.
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.5)] cursor-pointer flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" /> DÉBUT DU CASSE
            </button>
          </div>
        )}

        {gameState === 'escaped' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl mb-2">💎💰</div>
            <h3 className="text-2xl font-black text-amber-400 font-mono mb-2">EXTRACTION RÉUSSIE !</h3>
            <p className="text-slate-300 text-sm mb-4">Le casse du siècle rapporte <strong className="text-yellow-300">+{lootBag + 1000} V-Coins</strong> !</p>
            <div className="flex gap-3">
              <button onClick={startGame} className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase">
                Rejouer
              </button>
              <button onClick={onExit} className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs uppercase">
                Quitter
              </button>
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl mb-2">🚨</div>
            <h3 className="text-2xl font-black text-rose-500 font-mono mb-2">ALARME DÉCLENCHÉE - ARRÊT</h3>
            <p className="text-slate-300 text-sm mb-4">Score récupéré : <strong className="text-amber-400">{score} pts</strong></p>
            <div className="flex gap-3">
              <button onClick={startGame} className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase">
                Réessayer
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
