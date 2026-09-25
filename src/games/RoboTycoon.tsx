import React, { useState, useEffect } from 'react';
import { audio } from '../utils/audio';
import { Play, RotateCcw, X, Coins, Sparkles, Zap, ArrowUpCircle } from 'lucide-react';

interface GameProps {
  onFinish: (score: number, bonusVC?: number) => void;
  onExit: () => void;
}

export function RoboTycoon({ onFinish, onExit }: GameProps) {
  const [cash, setCash] = useState(50);
  const [dropperLevel, setDropperLevel] = useState(1);
  const [conveyorSpeed, setConveyorSpeed] = useState(1);
  const [furnaceMult, setFurnaceMult] = useState(1);
  const [autoBots, setAutoBots] = useState(0);
  const [ores, setOres] = useState<{ id: number; val: number; progress: number }[]>([]);
  const [totalProduced, setTotalProduced] = useState(0);

  // Spawning ores based on dropper level
  useEffect(() => {
    const interval = setInterval(() => {
      setOres(prev => [
        ...prev,
        { id: Math.random(), val: 10 * dropperLevel, progress: 0 }
      ]);
    }, Math.max(600, 1800 - dropperLevel * 150));
    return () => clearInterval(interval);
  }, [dropperLevel]);

  // Moving ores along conveyor & selling at furnace
  useEffect(() => {
    const loop = setInterval(() => {
      setOres(prev => {
        const next: any[] = [];
        let earned = 0;

        prev.forEach(ore => {
          const nextProg = ore.progress + 2 * conveyorSpeed;
          if (nextProg >= 100) {
            // Sold at furnace!
            earned += ore.val * furnaceMult;
          } else {
            next.push({ ...ore, progress: nextProg });
          }
        });

        if (earned > 0) {
          audio.playCoin();
          setCash(c => c + earned);
          setTotalProduced(t => t + earned);
        }
        return next;
      });
    }, 50);

    return () => clearInterval(loop);
  }, [conveyorSpeed, furnaceMult]);

  // Passive Auto-Bots
  useEffect(() => {
    if (autoBots <= 0) return;
    const interval = setInterval(() => {
      const passive = autoBots * 25 * furnaceMult;
      setCash(c => c + passive);
      setTotalProduced(t => t + passive);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoBots, furnaceMult]);

  const buyDropper = () => {
    const cost = dropperLevel * 120;
    if (cash >= cost) {
      audio.playPowerup();
      setCash(c => c - cost);
      setDropperLevel(d => d + 1);
    }
  };

  const buyConveyor = () => {
    const cost = conveyorSpeed * 150;
    if (cash >= cost) {
      audio.playPowerup();
      setCash(c => c - cost);
      setConveyorSpeed(s => s + 1);
    }
  };

  const buyFurnace = () => {
    const cost = furnaceMult * 300;
    if (cash >= cost) {
      audio.playPowerup();
      setCash(c => c - cost);
      setFurnaceMult(m => m + 1);
    }
  };

  const buyAutoBot = () => {
    const cost = (autoBots + 1) * 450;
    if (cash >= cost) {
      audio.playPowerup();
      setCash(c => c - cost);
      setAutoBots(b => b + 1);
    }
  };

  const handleCashout = () => {
    audio.playWin();
    const bonus = Math.floor(totalProduced * 0.1);
    onFinish(totalProduced, bonus);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-[#130f08] border-2 border-amber-500/50 rounded-3xl p-6 shadow-[0_0_40px_rgba(245,158,11,0.3)]">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 font-bold text-lg">
            🏭
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">RoboTycoon: Nanotech Factory</h2>
            <p className="text-xs text-amber-400 font-mono">Usine Automatisée • Production totale : {totalProduced} VC</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-mono font-bold">
          <div className="px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500 text-yellow-300">
            Trésorerie: {cash.toLocaleString()} $
          </div>
          <button
            onClick={handleCashout}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 font-black text-xs uppercase cursor-pointer"
          >
            ENCAISSER & QUITTER
          </button>
          <button onClick={onExit} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tycoon Visualizer */}
      <div className="relative rounded-2xl overflow-hidden border border-amber-900/60 bg-[#1c140a] p-6 mb-6">
        <div className="flex items-center justify-between text-xs text-amber-300 font-mono mb-2">
          <span>DROPPER NIV. {dropperLevel}</span>
          <span>TAPIS ROULANT ({conveyorSpeed}x)</span>
          <span>FOUR PLASMA ({furnaceMult}x)</span>
        </div>

        {/* Conveyor Belt Graphics */}
        <div className="relative h-16 w-full bg-slate-900 rounded-2xl border-2 border-slate-700 flex items-center overflow-hidden px-4">
          <div className="absolute left-2 text-2xl animate-bounce">📦</div>
          {ores.map(ore => (
            <div
              key={ore.id}
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-400 to-yellow-300 border border-white shadow-[0_0_10px_rgba(250,204,21,0.8)] flex items-center justify-center text-[10px] font-bold text-slate-900"
              style={{ left: `calc(${ore.progress}% - 12px)` }}
            >
              $
            </div>
          ))}
          <div className="absolute right-2 text-2xl animate-pulse">🔥</div>
        </div>
      </div>

      {/* Upgrades Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Dropper */}
        <div className="p-4 rounded-2xl bg-[#1c150c] border border-amber-700/60 flex flex-col justify-between">
          <div>
            <div className="text-2xl mb-1">🤖</div>
            <h4 className="font-bold text-white text-sm">Dropper Quantique</h4>
            <p className="text-xs text-slate-400 mt-1">Génère des minerais plus fréquents et plus riches.</p>
          </div>
          <button
            onClick={buyDropper}
            disabled={cash < dropperLevel * 120}
            className="mt-4 w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs uppercase cursor-pointer"
          >
            Améliorer ({dropperLevel * 120} $)
          </button>
        </div>

        {/* Conveyor */}
        <div className="p-4 rounded-2xl bg-[#1c150c] border border-amber-700/60 flex flex-col justify-between">
          <div>
            <div className="text-2xl mb-1">⚡</div>
            <h4 className="font-bold text-white text-sm">Vitesse du Tapis</h4>
            <p className="text-xs text-slate-400 mt-1">Accélère l'acheminement des minerais vers le four.</p>
          </div>
          <button
            onClick={buyConveyor}
            disabled={cash < conveyorSpeed * 150}
            className="mt-4 w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs uppercase cursor-pointer"
          >
            Améliorer ({conveyorSpeed * 150} $)
          </button>
        </div>

        {/* Furnace */}
        <div className="p-4 rounded-2xl bg-[#1c150c] border border-amber-700/60 flex flex-col justify-between">
          <div>
            <div className="text-2xl mb-1">🔥</div>
            <h4 className="font-bold text-white text-sm">Four Plasma Multiplicateur</h4>
            <p className="text-xs text-slate-400 mt-1">Multiplie la valeur de revente de chaque minerai.</p>
          </div>
          <button
            onClick={buyFurnace}
            disabled={cash < furnaceMult * 300}
            className="mt-4 w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs uppercase cursor-pointer"
          >
            Améliorer ({furnaceMult * 300} $)
          </button>
        </div>

        {/* Auto Bot */}
        <div className="p-4 rounded-2xl bg-[#1c150c] border border-amber-700/60 flex flex-col justify-between">
          <div>
            <div className="text-2xl mb-1">🦾</div>
            <h4 className="font-bold text-white text-sm">Drones Mineurs Automates</h4>
            <p className="text-xs text-slate-400 mt-1">Revenus passifs constants ({autoBots} actifs).</p>
          </div>
          <button
            onClick={buyAutoBot}
            disabled={cash < (autoBots + 1) * 450}
            className="mt-4 w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs uppercase cursor-pointer"
          >
            Acheter Drone ({(autoBots + 1) * 450} $)
          </button>
        </div>
      </div>
    </div>
  );
}
