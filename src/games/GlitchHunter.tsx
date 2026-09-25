import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../utils/audio';
import { Play, RotateCcw, X, ShieldAlert, Cpu, Zap, Bug } from 'lucide-react';

interface GameProps {
  onFinish: (score: number, bonusVC?: number) => void;
  onExit: () => void;
}

export function GlitchHunter({ onFinish, onExit }: GameProps) {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [score, setScore] = useState(0);
  const [cpuIntegrity, setCpuIntegrity] = useState(100);
  const [empCharges, setEmpCharges] = useState(2);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const virusesRef = useRef<{ id: number; x: number; y: number; r: number; hp: number; type: 'trojan' | 'worm' | 'glitch' }[]>([]);

  const startGame = () => {
    audio.playStart();
    setGameState('playing');
    setScore(0);
    setCpuIntegrity(100);
    setEmpCharges(2);
    virusesRef.current = [];
  };

  const fireEmp = () => {
    if (gameState !== 'playing' || empCharges <= 0) return;
    audio.playExplosion();
    audio.playPowerup();
    setEmpCharges(e => e - 1);

    const count = virusesRef.current.length;
    virusesRef.current = [];
    setScore(s => s + count * 150 + 300);
  };

  const handlePurgeAt = (clientX: number, clientY: number) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;

    audio.playLaser();

    let hit = false;
    virusesRef.current.forEach(v => {
      if (Math.hypot(mx - v.x, my - v.y) < v.r + 14) {
        v.hp -= 35;
        hit = true;
        audio.playHit();
        if (v.hp <= 0) {
          audio.playPowerup();
          setScore(s => s + (v.type === 'trojan' ? 250 : 100));
        }
      }
    });

    virusesRef.current = virusesRef.current.filter(v => v.hp > 0);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handlePurgeAt(e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'KeyE') fireEmp();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState, empCharges]);

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
      spawnTimer++;
      // Spawn bugs towards CPU core center (400, 190)
      if (spawnTimer % 35 === 0) {
        const ang = Math.random() * Math.PI * 2;
        const isTrojan = Math.random() > 0.7;
        virusesRef.current.push({
          id: Math.random(),
          x: 400 + Math.cos(ang) * 380,
          y: 190 + Math.sin(ang) * 380,
          r: isTrojan ? 20 : 14,
          hp: isTrojan ? 60 : 30,
          type: isTrojan ? 'trojan' : 'worm'
        });
      }

      // Move bugs
      virusesRef.current.forEach(v => {
        const ang = Math.atan2(190 - v.y, 400 - v.x);
        v.x += Math.cos(ang) * (v.type === 'trojan' ? 1.4 : 2.2);
        v.y += Math.sin(ang) * (v.type === 'trojan' ? 1.4 : 2.2);

        // Core damage check
        if (Math.hypot(400 - v.x, 190 - v.y) < 32) {
          audio.playHit();
          v.hp = 0;
          setCpuIntegrity(prev => {
            const next = prev - 15;
            if (next <= 0) {
              audio.playOof();
              setGameState('gameover');
              onFinish(score, 35);
              return 0;
            }
            return next;
          });
        }
      });

      virusesRef.current = virusesRef.current.filter(v => v.hp > 0);

      // RENDER (Cyber Matrix Grid)
      ctx.fillStyle = '#04130b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Matrix lines
      ctx.strokeStyle = '#065f46';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw Central CPU Core
      ctx.fillStyle = '#10b981';
      ctx.fillRect(370, 160, 60, 60);
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 3;
      ctx.strokeRect(370, 160, 60, 60);
      ctx.fillStyle = '#064e3b';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('CPU', 388, 195);

      // Draw Viruses
      virusesRef.current.forEach(v => {
        ctx.fillStyle = v.type === 'trojan' ? '#ef4444' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, score, onFinish]);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[#07160c] border-2 border-emerald-500/50 rounded-3xl p-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-emerald-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 font-bold text-lg">
            👾
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">Glitch Hunter: Matrix Purge (VIP)</h2>
            <p className="text-xs text-emerald-400 font-mono">Intégrité CPU : {cpuIntegrity}% • IEM : {empCharges}x (Espace)</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-mono font-bold">
          <div className="text-yellow-400">Score: {score}</div>
          {empCharges > 0 && (
            <button
              onClick={fireEmp}
              className="px-3 py-1 bg-emerald-500 text-slate-950 font-black rounded-lg text-xs uppercase cursor-pointer"
            >
              DÉCLENCHER IEM (Espace)
            </button>
          )}
          <button onClick={onExit} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-900/60 bg-[#04130b] flex justify-center cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={800}
          height={380}
          onClick={handleCanvasClick}
          onTouchStart={(e) => {
            e.preventDefault();
            if (e.touches && e.touches[0]) {
              handlePurgeAt(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          className="w-full max-w-[800px] h-auto block touch-none"
        />

        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300 font-mono mb-2">
              GLITCH HUNTER PURGE
            </h3>
            <p className="text-slate-300 text-sm max-w-md mb-6">
              Défense du processeur central VIP ! Cliquez sur les virus et trojans corrompus pour les éliminer avant qu'ils n'atteignent le cœur. Appuyez sur <strong>Espace</strong> pour une IEM globale !
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.5)] cursor-pointer flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" /> PURGER LES GLITCHS
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="text-5xl mb-2">👾💥</div>
            <h3 className="text-2xl font-black text-rose-500 font-mono mb-2">PROCESSEUR CORROMPU</h3>
            <p className="text-slate-300 text-sm mb-4">Score final : <strong className="text-emerald-400">{score} pts</strong></p>
            <div className="flex gap-3">
              <button onClick={startGame} className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase">
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
