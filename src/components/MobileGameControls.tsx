import React, { useState } from 'react';
import {
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  Zap, Swords, Flame, Sparkles, X, ChevronDown, ChevronUp
} from 'lucide-react';

interface MobileGameControlsProps {
  gameId: string;
  onExit?: () => void;
}

export function MobileGameControls({ gameId, onExit }: MobileGameControlsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const triggerKey = (key: string, code: string, isDown: boolean) => {
    const eventType = isDown ? 'keydown' : 'keyup';
    const event = new KeyboardEvent(eventType, {
      key,
      code,
      bubbles: true,
      cancelable: true
    });
    window.dispatchEvent(event);
  };

  const handlePressStart = (e: React.SyntheticEvent, code: string, key: string) => {
    e.preventDefault();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
    triggerKey(key, code, true);
  };

  const handlePressEnd = (e: React.SyntheticEvent, code: string, key: string) => {
    e.preventDefault();
    triggerKey(key, code, false);
  };

  if (isCollapsed) {
    return (
      <div className="w-full flex items-center justify-between px-3 py-1 bg-slate-950/90 border-t border-white/10 shrink-0">
        <button
          onClick={() => setIsCollapsed(false)}
          className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
        >
          <ChevronUp className="w-3.5 h-3.5" />
          <span>Afficher les Touches Tactiles</span>
        </button>

        {onExit && (
          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-400/40 text-xs font-mono font-bold flex items-center gap-1 shadow-md active:scale-95 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Quitter</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-950/95 border-t border-white/15 px-2 sm:px-4 py-2 flex flex-col gap-1.5 shrink-0 select-none shadow-[0_-10px_25px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      {/* Mini Bar with Title & Collapse */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
        <span className="text-cyan-400 font-bold flex items-center gap-1">
          🕹️ TOUCH GAMEPAD
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(true)}
            className="px-2 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white border border-white/10 text-[10px] flex items-center gap-1 cursor-pointer"
          >
            <ChevronDown className="w-3 h-3" />
            <span>Réduire</span>
          </button>
          {onExit && (
            <button
              onClick={onExit}
              className="px-2.5 py-0.5 rounded-lg bg-rose-600/30 text-rose-300 border border-rose-500/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Quitter</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. RUNNER CONTROLS */}
      {gameId === 'cyber_runner_2099' && (
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto w-full">
          {/* Directional Steer */}
          <div className="flex items-center gap-2">
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowLeft', 'ArrowLeft')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowLeft', 'ArrowLeft')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowLeft', 'ArrowLeft')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowLeft', 'ArrowLeft')}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyan-900/60 active:bg-cyan-500 border-2 border-cyan-400/80 flex items-center justify-center text-white active:text-slate-950 shadow-lg cursor-pointer active:scale-90 transition-transform"
              title="Gauche"
            >
              <ArrowLeft className="w-7 h-7" />
            </button>
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowRight', 'ArrowRight')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowRight', 'ArrowRight')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowRight', 'ArrowRight')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowRight', 'ArrowRight')}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyan-900/60 active:bg-cyan-500 border-2 border-cyan-400/80 flex items-center justify-center text-white active:text-slate-950 shadow-lg cursor-pointer active:scale-90 transition-transform"
              title="Droite"
            >
              <ArrowRight className="w-7 h-7" />
            </button>
          </div>

          {/* Action Jump Button */}
          <button
            onTouchStart={(e) => handlePressStart(e, 'Space', ' ')}
            onTouchEnd={(e) => handlePressEnd(e, 'Space', ' ')}
            onMouseDown={(e) => handlePressStart(e, 'Space', ' ')}
            onMouseUp={(e) => handlePressEnd(e, 'Space', ' ')}
            className="flex-1 max-w-[200px] h-14 sm:h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 active:from-cyan-400 active:to-blue-500 border-2 border-cyan-300 flex items-center justify-center text-slate-950 font-black font-mono text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.5)] active:scale-95 transition-transform cursor-pointer gap-2"
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>SAUTER</span>
          </button>
        </div>
      )}

      {/* 2. SPACE (ESPACE) CONTROLS */}
      {gameId === 'cosmic_defender' && (
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto w-full">
          {/* D-Pad Horizontal */}
          <div className="flex items-center gap-2">
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowLeft', 'ArrowLeft')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowLeft', 'ArrowLeft')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowLeft', 'ArrowLeft')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowLeft', 'ArrowLeft')}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-900/60 active:bg-blue-500 border-2 border-blue-400/80 flex items-center justify-center text-white active:text-slate-950 shadow-lg cursor-pointer active:scale-90 transition-transform"
            >
              <ArrowLeft className="w-7 h-7" />
            </button>
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowRight', 'ArrowRight')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowRight', 'ArrowRight')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowRight', 'ArrowRight')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowRight', 'ArrowRight')}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-900/60 active:bg-blue-500 border-2 border-blue-400/80 flex items-center justify-center text-white active:text-slate-950 shadow-lg cursor-pointer active:scale-90 transition-transform"
            >
              <ArrowRight className="w-7 h-7" />
            </button>
          </div>

          {/* Fire Plasma Button */}
          <button
            onTouchStart={(e) => handlePressStart(e, 'Space', ' ')}
            onTouchEnd={(e) => handlePressEnd(e, 'Space', ' ')}
            onMouseDown={(e) => handlePressStart(e, 'Space', ' ')}
            onMouseUp={(e) => handlePressEnd(e, 'Space', ' ')}
            className="flex-1 max-w-[200px] h-14 sm:h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 active:from-blue-400 active:to-indigo-500 border-2 border-sky-300 flex items-center justify-center text-white font-black font-mono text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(59,130,246,0.5)] active:scale-95 transition-transform cursor-pointer gap-2"
          >
            <Zap className="w-5 h-5 fill-current text-cyan-300" />
            <span>TIRER</span>
          </button>
        </div>
      )}

      {/* 3. DONJON CONTROLS */}
      {gameId === 'pixel_dungeon_quest' && (
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto w-full">
          {/* Mini 4-Directional D-Pad */}
          <div className="grid grid-cols-3 gap-1 w-32 sm:w-36">
            <div />
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowUp', 'ArrowUp')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowUp', 'ArrowUp')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowUp', 'ArrowUp')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowUp', 'ArrowUp')}
              className="h-10 rounded-xl bg-emerald-950/80 active:bg-emerald-500 border border-emerald-400/60 flex items-center justify-center text-white cursor-pointer active:scale-90"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <div />
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowLeft', 'ArrowLeft')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowLeft', 'ArrowLeft')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowLeft', 'ArrowLeft')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowLeft', 'ArrowLeft')}
              className="h-10 rounded-xl bg-emerald-950/80 active:bg-emerald-500 border border-emerald-400/60 flex items-center justify-center text-white cursor-pointer active:scale-90"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowDown', 'ArrowDown')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowDown', 'ArrowDown')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowDown', 'ArrowDown')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowDown', 'ArrowDown')}
              className="h-10 rounded-xl bg-emerald-950/80 active:bg-emerald-500 border border-emerald-400/60 flex items-center justify-center text-white cursor-pointer active:scale-90"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowRight', 'ArrowRight')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowRight', 'ArrowRight')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowRight', 'ArrowRight')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowRight', 'ArrowRight')}
              className="h-10 rounded-xl bg-emerald-950/80 active:bg-emerald-500 border border-emerald-400/60 flex items-center justify-center text-white cursor-pointer active:scale-90"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Action Buttons: Sword & Fireball */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              onTouchStart={(e) => handlePressStart(e, 'Space', ' ')}
              onTouchEnd={(e) => handlePressEnd(e, 'Space', ' ')}
              onMouseDown={(e) => handlePressStart(e, 'Space', ' ')}
              onMouseUp={(e) => handlePressEnd(e, 'Space', ' ')}
              className="w-16 h-14 sm:w-20 sm:h-16 rounded-2xl bg-emerald-600 active:bg-emerald-400 border-2 border-emerald-300 text-slate-950 font-black font-mono text-xs flex flex-col items-center justify-center shadow-lg active:scale-90 cursor-pointer"
            >
              <Swords className="w-6 h-6" />
              <span>ÉPÉE</span>
            </button>
            <button
              onTouchStart={(e) => handlePressStart(e, 'KeyF', 'f')}
              onTouchEnd={(e) => handlePressEnd(e, 'KeyF', 'f')}
              onMouseDown={(e) => handlePressStart(e, 'KeyF', 'f')}
              onMouseUp={(e) => handlePressEnd(e, 'KeyF', 'f')}
              className="w-16 h-14 sm:w-20 sm:h-16 rounded-2xl bg-amber-500 active:bg-amber-300 border-2 border-amber-300 text-slate-950 font-black font-mono text-xs flex flex-col items-center justify-center shadow-lg active:scale-90 cursor-pointer"
            >
              <Flame className="w-6 h-6 fill-current" />
              <span>FEU</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. FLIPPER CONTROLS */}
      {gameId === 'titan_pinball_titan' && (
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto w-full">
          {/* Left Flipper */}
          <button
            onTouchStart={(e) => handlePressStart(e, 'ArrowLeft', 'ArrowLeft')}
            onTouchEnd={(e) => handlePressEnd(e, 'ArrowLeft', 'ArrowLeft')}
            onMouseDown={(e) => handlePressStart(e, 'ArrowLeft', 'ArrowLeft')}
            onMouseUp={(e) => handlePressEnd(e, 'ArrowLeft', 'ArrowLeft')}
            className="flex-1 h-16 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-500 active:from-amber-400 active:to-orange-400 border-2 border-amber-300 text-slate-950 font-black font-mono text-sm uppercase flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>FLIP G</span>
          </button>

          {/* Launch ball */}
          <button
            onTouchStart={(e) => handlePressStart(e, 'Space', ' ')}
            onTouchEnd={(e) => handlePressEnd(e, 'Space', ' ')}
            onMouseDown={(e) => handlePressStart(e, 'Space', ' ')}
            onMouseUp={(e) => handlePressEnd(e, 'Space', ' ')}
            className="w-16 h-16 rounded-2xl bg-yellow-500 active:bg-yellow-300 border-2 border-yellow-200 text-slate-950 font-black font-mono text-[11px] flex flex-col items-center justify-center shadow-lg active:scale-90 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 fill-current" />
            <span>LANCER</span>
          </button>

          {/* Right Flipper */}
          <button
            onTouchStart={(e) => handlePressStart(e, 'ArrowRight', 'ArrowRight')}
            onTouchEnd={(e) => handlePressEnd(e, 'ArrowRight', 'ArrowRight')}
            onMouseDown={(e) => handlePressStart(e, 'ArrowRight', 'ArrowRight')}
            onMouseUp={(e) => handlePressEnd(e, 'ArrowRight', 'ArrowRight')}
            className="flex-1 h-16 rounded-2xl bg-gradient-to-l from-amber-600 to-orange-500 active:from-amber-400 active:to-orange-400 border-2 border-amber-300 text-slate-950 font-black font-mono text-sm uppercase flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer"
          >
            <span>FLIP D</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* 5. LASER CONTROLS */}
      {gameId === 'quantum_strike' && (
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto w-full">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 animate-pulse" />
            <span>Touchez l'écran pour viser</span>
          </div>

          <button
            onTouchStart={(e) => handlePressStart(e, 'Space', ' ')}
            onTouchEnd={(e) => handlePressEnd(e, 'Space', ' ')}
            onMouseDown={(e) => handlePressStart(e, 'Space', ' ')}
            onMouseUp={(e) => handlePressEnd(e, 'Space', ' ')}
            className="flex-1 max-w-[220px] h-14 sm:h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-500 active:from-purple-500 active:to-fuchsia-400 border-2 border-fuchsia-300 text-white font-black font-mono text-sm uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(217,70,239,0.5)] active:scale-95 cursor-pointer"
          >
            <Zap className="w-5 h-5 fill-current text-yellow-300" />
            <span>TIR LASER</span>
          </button>
        </div>
      )}
    </div>
  );
}
