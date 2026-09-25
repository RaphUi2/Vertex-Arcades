import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  Zap, Flame, Shield, Crosshair, Sparkles, Clock, Hammer,
  Eye, Swords, Play, Key, Radio, Music
} from 'lucide-react';

interface MobileGameControlsProps {
  gameId: string;
  onExit?: () => void;
}

export function MobileGameControls({ gameId }: MobileGameControlsProps) {
  const [isVisible, setIsVisible] = useState(true);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    // Detect mobile / touch environment
    if (typeof window !== 'undefined') {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024;
      isTouchDevice.current = hasTouch;
      setIsVisible(hasTouch);
    }
  }, []);

  const triggerHaptic = (ms = 15) => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(ms);
      }
    } catch (e) {
      // Haptic fallback
    }
  };

  const dispatchKey = (code: string, key: string, type: 'keydown' | 'keyup') => {
    const event = new KeyboardEvent(type, {
      code,
      key,
      bubbles: true,
      cancelable: true,
      composed: true,
      view: window
    });
    window.dispatchEvent(event);
  };

  const handlePressStart = (e: React.TouchEvent | React.MouseEvent, code: string, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    triggerHaptic(20);
    dispatchKey(code, key, 'keydown');
  };

  const handlePressEnd = (e: React.TouchEvent | React.MouseEvent, code: string, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    dispatchKey(code, key, 'keyup');
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-2 right-2 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="px-3 py-1.5 rounded-full bg-cyan-600/90 text-white font-mono text-xs font-bold shadow-lg border border-cyan-400"
        >
          📱 Afficher Manette Mobile
        </button>
      </div>
    );
  }

  // Render game-specific control layouts
  return (
    <div className="w-full mt-3 select-none touch-none bg-slate-950/90 border border-cyan-500/40 rounded-2xl p-3 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300 pb-2 mb-2 border-b border-cyan-500/20">
        <span className="font-bold flex items-center gap-1.5">
          📱 <span>Manette Tactile Mobile</span>
        </span>
        <button
          onClick={() => setIsVisible(false)}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
        >
          Masquer
        </button>
      </div>

      {/* GAME 1: QUANTUM OBBY */}
      {gameId === 'quantum_obby' && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowLeft', 'ArrowLeft')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowLeft', 'ArrowLeft')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowLeft', 'ArrowLeft')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowLeft', 'ArrowLeft')}
              className="w-16 h-16 rounded-2xl bg-cyan-900/60 active:bg-cyan-500 border-2 border-cyan-400 flex items-center justify-center text-white active:text-slate-950 shadow-lg text-lg font-bold"
            >
              <ArrowLeft className="w-8 h-8" />
            </button>
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowRight', 'ArrowRight')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowRight', 'ArrowRight')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowRight', 'ArrowRight')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowRight', 'ArrowRight')}
              className="w-16 h-16 rounded-2xl bg-cyan-900/60 active:bg-cyan-500 border-2 border-cyan-400 flex items-center justify-center text-white active:text-slate-950 shadow-lg text-lg font-bold"
            >
              <ArrowRight className="w-8 h-8" />
            </button>
          </div>

          <button
            onTouchStart={(e) => handlePressStart(e, 'Space', ' ')}
            onTouchEnd={(e) => handlePressEnd(e, 'Space', ' ')}
            onMouseDown={(e) => handlePressStart(e, 'Space', ' ')}
            onMouseUp={(e) => handlePressEnd(e, 'Space', ' ')}
            className="flex-1 max-w-[200px] h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 active:from-cyan-400 active:to-blue-400 border-2 border-cyan-300 flex items-center justify-center text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.5)]"
          >
            🚀 SAUTER
          </button>
        </div>
      )}

      {/* GAME 2: AETHERIA VOID */}
      {gameId === 'aetheria_void' && (
        <div className="flex items-center justify-around gap-4">
          <button
            onTouchStart={(e) => handlePressStart(e, 'Space', ' ')}
            onTouchEnd={(e) => handlePressEnd(e, 'Space', ' ')}
            onMouseDown={(e) => handlePressStart(e, 'Space', ' ')}
            onMouseUp={(e) => handlePressEnd(e, 'Space', ' ')}
            className="flex-1 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 active:from-purple-400 active:to-indigo-400 border-2 border-purple-400 flex items-center justify-center text-white font-black text-sm uppercase tracking-wider shadow-lg gap-2"
          >
            <Swords className="w-6 h-6" /> TRANCHER (ESPACE)
          </button>

          <button
            onTouchStart={(e) => handlePressStart(e, 'KeyE', 'e')}
            onTouchEnd={(e) => handlePressEnd(e, 'KeyE', 'e')}
            onMouseDown={(e) => handlePressStart(e, 'KeyE', 'e')}
            onMouseUp={(e) => handlePressEnd(e, 'KeyE', 'e')}
            className="flex-1 h-16 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-pink-600 active:from-pink-400 active:to-fuchsia-400 border-2 border-fuchsia-300 flex items-center justify-center text-white font-black text-sm uppercase tracking-wider shadow-lg gap-2"
          >
            <Zap className="w-6 h-6" /> FURIE ULTIME (E)
          </button>
        </div>
      )}

      {/* GAME 3: TITAN CORE */}
      {gameId === 'titan_core' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <button
                onTouchStart={(e) => handlePressStart(e, 'ArrowLeft', 'ArrowLeft')}
                onTouchEnd={(e) => handlePressEnd(e, 'ArrowLeft', 'ArrowLeft')}
                onMouseDown={(e) => handlePressStart(e, 'ArrowLeft', 'ArrowLeft')}
                onMouseUp={(e) => handlePressEnd(e, 'ArrowLeft', 'ArrowLeft')}
                className="w-14 h-14 rounded-2xl bg-slate-800 active:bg-orange-500 border border-orange-500/50 flex items-center justify-center text-white"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button
                onTouchStart={(e) => handlePressStart(e, 'ArrowRight', 'ArrowRight')}
                onTouchEnd={(e) => handlePressEnd(e, 'ArrowRight', 'ArrowRight')}
                onMouseDown={(e) => handlePressStart(e, 'ArrowRight', 'ArrowRight')}
                onMouseUp={(e) => handlePressEnd(e, 'ArrowRight', 'ArrowRight')}
                className="w-14 h-14 rounded-2xl bg-slate-800 active:bg-orange-500 border border-orange-500/50 flex items-center justify-center text-white"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>

            <div className="flex gap-2 flex-1 justify-end">
              <button
                onTouchStart={(e) => handlePressStart(e, 'KeyE', 'e')}
                onTouchEnd={(e) => handlePressEnd(e, 'KeyE', 'e')}
                onMouseDown={(e) => handlePressStart(e, 'KeyE', 'e')}
                onMouseUp={(e) => handlePressEnd(e, 'KeyE', 'e')}
                className="px-4 h-14 rounded-2xl bg-red-600 active:bg-red-400 border border-red-300 text-white font-bold text-xs flex items-center gap-1"
              >
                <Flame className="w-4 h-4" /> MISSILES
              </button>
              <button
                onTouchStart={(e) => handlePressStart(e, 'Space', ' ')}
                onTouchEnd={(e) => handlePressEnd(e, 'Space', ' ')}
                onMouseDown={(e) => handlePressStart(e, 'Space', ' ')}
                onMouseUp={(e) => handlePressEnd(e, 'Space', ' ')}
                className="px-6 h-14 rounded-2xl bg-orange-500 active:bg-orange-300 border border-orange-200 text-slate-950 font-black text-xs flex items-center gap-1.5"
              >
                <Crosshair className="w-5 h-5" /> TIRER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAME 4: CYBER HEIST */}
      {gameId === 'cyber_heist' && (
        <div className="flex items-center justify-between gap-3">
          <div className="grid grid-cols-3 gap-1.5 w-36">
            <div />
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowUp', 'ArrowUp')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowUp', 'ArrowUp')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowUp', 'ArrowUp')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowUp', 'ArrowUp')}
              className="w-11 h-11 rounded-xl bg-amber-950/80 active:bg-amber-500 border border-amber-500 flex items-center justify-center text-white"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <div />
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowLeft', 'ArrowLeft')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowLeft', 'ArrowLeft')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowLeft', 'ArrowLeft')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowLeft', 'ArrowLeft')}
              className="w-11 h-11 rounded-xl bg-amber-950/80 active:bg-amber-500 border border-amber-500 flex items-center justify-center text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowDown', 'ArrowDown')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowDown', 'ArrowDown')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowDown', 'ArrowDown')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowDown', 'ArrowDown')}
              className="w-11 h-11 rounded-xl bg-amber-950/80 active:bg-amber-500 border border-amber-500 flex items-center justify-center text-white"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowRight', 'ArrowRight')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowRight', 'ArrowRight')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowRight', 'ArrowRight')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowRight', 'ArrowRight')}
              className="w-11 h-11 rounded-xl bg-amber-950/80 active:bg-amber-500 border border-amber-500 flex items-center justify-center text-white"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onTouchStart={(e) => handlePressStart(e, 'KeyE', 'e')}
            onTouchEnd={(e) => handlePressEnd(e, 'KeyE', 'e')}
            onMouseDown={(e) => handlePressStart(e, 'KeyE', 'e')}
            onMouseUp={(e) => handlePressEnd(e, 'KeyE', 'e')}
            className="flex-1 max-w-[200px] h-14 rounded-2xl bg-amber-500 active:bg-amber-300 border border-amber-300 text-slate-950 font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg"
          >
            <Key className="w-5 h-5" /> PIRATER (E)
          </button>
        </div>
      )}

      {/* GAME 5: HYPER DRIFT */}
      {gameId === 'hyper_drift' && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowLeft', 'ArrowLeft')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowLeft', 'ArrowLeft')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowLeft', 'ArrowLeft')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowLeft', 'ArrowLeft')}
              className="w-16 h-16 rounded-2xl bg-pink-950/80 active:bg-pink-500 border-2 border-pink-500 flex items-center justify-center text-white"
            >
              <ArrowLeft className="w-8 h-8" />
            </button>
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowRight', 'ArrowRight')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowRight', 'ArrowRight')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowRight', 'ArrowRight')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowRight', 'ArrowRight')}
              className="w-16 h-16 rounded-2xl bg-pink-950/80 active:bg-pink-500 border-2 border-pink-500 flex items-center justify-center text-white"
            >
              <ArrowRight className="w-8 h-8" />
            </button>
          </div>

          <div className="flex gap-2 flex-1 justify-end">
            <button
              onTouchStart={(e) => handlePressStart(e, 'Space', ' ')}
              onTouchEnd={(e) => handlePressEnd(e, 'Space', ' ')}
              onMouseDown={(e) => handlePressStart(e, 'Space', ' ')}
              onMouseUp={(e) => handlePressEnd(e, 'Space', ' ')}
              className="flex-1 max-w-[140px] h-16 rounded-2xl bg-purple-600 active:bg-purple-400 border border-purple-300 text-white font-black text-xs uppercase"
            >
              🔄 DÉRAPER
            </button>
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowUp', 'ArrowUp')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowUp', 'ArrowUp')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowUp', 'ArrowUp')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowUp', 'ArrowUp')}
              className="flex-1 max-w-[140px] h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 active:from-pink-400 active:to-rose-400 text-white font-black text-xs uppercase flex items-center justify-center gap-1 shadow-[0_0_15px_rgba(244,63,94,0.6)]"
            >
              <Flame className="w-5 h-5" /> NITRO
            </button>
          </div>
        </div>
      )}

      {/* GAME 6: NEBULA STRIKE */}
      {gameId === 'nebula_strike' && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowLeft', 'ArrowLeft')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowLeft', 'ArrowLeft')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowLeft', 'ArrowLeft')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowLeft', 'ArrowLeft')}
              className="w-16 h-16 rounded-2xl bg-sky-950/80 active:bg-sky-500 border-2 border-sky-400 flex items-center justify-center text-white"
            >
              <ArrowLeft className="w-8 h-8" />
            </button>
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowRight', 'ArrowRight')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowRight', 'ArrowRight')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowRight', 'ArrowRight')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowRight', 'ArrowRight')}
              className="w-16 h-16 rounded-2xl bg-sky-950/80 active:bg-sky-500 border-2 border-sky-400 flex items-center justify-center text-white"
            >
              <ArrowRight className="w-8 h-8" />
            </button>
          </div>

          <div className="flex gap-2 flex-1 justify-end">
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowUp', 'ArrowUp')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowUp', 'ArrowUp')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowUp', 'ArrowUp')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowUp', 'ArrowUp')}
              className="flex-1 max-w-[130px] h-16 rounded-2xl bg-indigo-600 active:bg-indigo-400 text-white font-bold text-xs uppercase"
            >
              🚀 BOOST
            </button>
            <button
              onTouchStart={(e) => handlePressStart(e, 'Space', ' ')}
              onTouchEnd={(e) => handlePressEnd(e, 'Space', ' ')}
              onMouseDown={(e) => handlePressStart(e, 'Space', ' ')}
              onMouseUp={(e) => handlePressEnd(e, 'Space', ' ')}
              className="flex-1 max-w-[130px] h-16 rounded-2xl bg-cyan-500 active:bg-cyan-300 text-slate-950 font-black text-xs uppercase shadow-[0_0_15px_rgba(6,182,212,0.6)]"
            >
              ⚡ LASER
            </button>
          </div>
        </div>
      )}

      {/* GAME 7: CHRONO SHIFT */}
      {gameId === 'chrono_shift' && (
        <div className="flex items-center justify-around gap-4">
          <button
            onTouchStart={(e) => handlePressStart(e, 'Space', ' ')}
            onTouchEnd={(e) => handlePressEnd(e, 'Space', ' ')}
            onMouseDown={(e) => handlePressStart(e, 'Space', ' ')}
            onMouseUp={(e) => handlePressEnd(e, 'Space', ' ')}
            className="flex-1 h-16 rounded-2xl bg-emerald-500 active:bg-emerald-300 border-2 border-emerald-300 text-slate-950 font-black text-sm uppercase shadow-lg"
          >
            🏃‍♂️ SAUTER
          </button>
          <button
            onTouchStart={(e) => handlePressStart(e, 'KeyR', 'r')}
            onTouchEnd={(e) => handlePressEnd(e, 'KeyR', 'r')}
            onMouseDown={(e) => handlePressStart(e, 'KeyR', 'r')}
            onMouseUp={(e) => handlePressEnd(e, 'KeyR', 'r')}
            className="flex-1 h-16 rounded-2xl bg-teal-600 active:bg-teal-400 border-2 border-teal-300 text-white font-black text-sm uppercase flex items-center justify-center gap-2 shadow-lg"
          >
            <Clock className="w-6 h-6" /> REMBOBINER (R)
          </button>
        </div>
      )}

      {/* GAME 8: SHADOW DUNGEON */}
      {gameId === 'shadow_dungeon' && (
        <div className="flex items-center justify-between gap-3">
          <div className="grid grid-cols-3 gap-1.5 w-36">
            <div />
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowUp', 'ArrowUp')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowUp', 'ArrowUp')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowUp', 'ArrowUp')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowUp', 'ArrowUp')}
              className="w-11 h-11 rounded-xl bg-slate-800 active:bg-rose-600 border border-slate-700 flex items-center justify-center text-white"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
            <div />
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowLeft', 'ArrowLeft')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowLeft', 'ArrowLeft')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowLeft', 'ArrowLeft')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowLeft', 'ArrowLeft')}
              className="w-11 h-11 rounded-xl bg-slate-800 active:bg-rose-600 border border-slate-700 flex items-center justify-center text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowDown', 'ArrowDown')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowDown', 'ArrowDown')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowDown', 'ArrowDown')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowDown', 'ArrowDown')}
              className="w-11 h-11 rounded-xl bg-slate-800 active:bg-rose-600 border border-slate-700 flex items-center justify-center text-white"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowRight', 'ArrowRight')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowRight', 'ArrowRight')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowRight', 'ArrowRight')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowRight', 'ArrowRight')}
              className="w-11 h-11 rounded-xl bg-slate-800 active:bg-rose-600 border border-slate-700 flex items-center justify-center text-white"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 flex-1 justify-end">
            <button
              onTouchStart={(e) => handlePressStart(e, 'Space', ' ')}
              onTouchEnd={(e) => handlePressEnd(e, 'Space', ' ')}
              onMouseDown={(e) => handlePressStart(e, 'Space', ' ')}
              onMouseUp={(e) => handlePressEnd(e, 'Space', ' ')}
              className="flex-1 max-w-[150px] h-14 rounded-2xl bg-rose-600 active:bg-rose-400 border border-rose-300 text-white font-black text-xs uppercase flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Swords className="w-5 h-5" /> ATTAQUE
            </button>
          </div>
        </div>
      )}

      {/* GAME 9: PIXEL FORGE */}
      {gameId === 'pixelforge_craft' && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onTouchStart={(e) => handlePressStart(e, 'KeyA', 'a')}
              onTouchEnd={(e) => handlePressEnd(e, 'KeyA', 'a')}
              onMouseDown={(e) => handlePressStart(e, 'KeyA', 'a')}
              onMouseUp={(e) => handlePressEnd(e, 'KeyA', 'a')}
              className="w-14 h-14 rounded-2xl bg-lime-950/80 active:bg-lime-500 border border-lime-500 flex items-center justify-center text-white"
            >
              <ArrowLeft className="w-7 h-7" />
            </button>
            <button
              onTouchStart={(e) => handlePressStart(e, 'KeyD', 'd')}
              onTouchEnd={(e) => handlePressEnd(e, 'KeyD', 'd')}
              onMouseDown={(e) => handlePressStart(e, 'KeyD', 'd')}
              onMouseUp={(e) => handlePressEnd(e, 'KeyD', 'd')}
              className="w-14 h-14 rounded-2xl bg-lime-950/80 active:bg-lime-500 border border-lime-500 flex items-center justify-center text-white"
            >
              <ArrowRight className="w-7 h-7" />
            </button>
          </div>

          <div className="flex gap-2 flex-1 justify-end">
            <button
              onTouchStart={(e) => handlePressStart(e, 'Space', ' ')}
              onTouchEnd={(e) => handlePressEnd(e, 'Space', ' ')}
              onMouseDown={(e) => handlePressStart(e, 'Space', ' ')}
              onMouseUp={(e) => handlePressEnd(e, 'Space', ' ')}
              className="w-14 h-14 rounded-2xl bg-lime-500 active:bg-lime-300 text-slate-950 font-black text-xs"
            >
              SAUT
            </button>
            <button
              onTouchStart={(e) => handlePressStart(e, 'KeyQ', 'q')}
              onTouchEnd={(e) => handlePressEnd(e, 'KeyQ', 'q')}
              onMouseDown={(e) => handlePressStart(e, 'KeyQ', 'q')}
              onMouseUp={(e) => handlePressEnd(e, 'KeyQ', 'q')}
              className="w-14 h-14 rounded-2xl bg-emerald-600 active:bg-emerald-400 text-white font-bold text-xs"
            >
              MINER
            </button>
            <button
              onTouchStart={(e) => handlePressStart(e, 'KeyE', 'e')}
              onTouchEnd={(e) => handlePressEnd(e, 'KeyE', 'e')}
              onMouseDown={(e) => handlePressStart(e, 'KeyE', 'e')}
              onMouseUp={(e) => handlePressEnd(e, 'KeyE', 'e')}
              className="w-14 h-14 rounded-2xl bg-green-700 active:bg-green-500 text-white font-bold text-xs"
            >
              POSER
            </button>
          </div>
        </div>
      )}

      {/* GAME 10: GRAVITY SURGE */}
      {gameId === 'gravity_surge' && (
        <div className="flex items-center justify-center">
          <button
            onTouchStart={(e) => handlePressStart(e, 'Space', ' ')}
            onTouchEnd={(e) => handlePressEnd(e, 'Space', ' ')}
            onMouseDown={(e) => handlePressStart(e, 'Space', ' ')}
            onMouseUp={(e) => handlePressEnd(e, 'Space', ' ')}
            className="w-full max-w-sm h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 active:from-violet-400 active:to-purple-400 border-2 border-violet-300 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2"
          >
            🪐 CHANGER D'ORBITE (ESPACE)
          </button>
        </div>
      )}

      {/* GAME 11: SYNTH RIDER */}
      {gameId === 'synth_rider' && (
        <div className="grid grid-cols-4 gap-2">
          {[
            { code: 'KeyD', key: 'd', label: 'PISTE 1 (D)', color: 'bg-rose-600 active:bg-rose-400 border-rose-400' },
            { code: 'KeyF', key: 'f', label: 'PISTE 2 (F)', color: 'bg-amber-600 active:bg-amber-400 border-amber-400' },
            { code: 'KeyJ', key: 'j', label: 'PISTE 3 (J)', color: 'bg-cyan-600 active:bg-cyan-400 border-cyan-400' },
            { code: 'KeyK', key: 'k', label: 'PISTE 4 (K)', color: 'bg-fuchsia-600 active:bg-fuchsia-400 border-fuchsia-400' }
          ].map(track => (
            <button
              key={track.code}
              onTouchStart={(e) => handlePressStart(e, track.code, track.key)}
              onTouchEnd={(e) => handlePressEnd(e, track.code, track.key)}
              onMouseDown={(e) => handlePressStart(e, track.code, track.key)}
              onMouseUp={(e) => handlePressEnd(e, track.code, track.key)}
              className={`h-16 rounded-2xl ${track.color} border-2 text-white font-black text-[11px] sm:text-xs flex items-center justify-center shadow-lg transition-transform active:scale-95`}
            >
              {track.label}
            </button>
          ))}
        </div>
      )}

      {/* GAME 12: BIOHAZARD DEFENSE */}
      {gameId === 'biohazard_defense' && (
        <div className="flex items-center justify-between gap-3">
          <button
            onTouchStart={(e) => handlePressStart(e, 'Space', ' ')}
            onTouchEnd={(e) => handlePressEnd(e, 'Space', ' ')}
            onMouseDown={(e) => handlePressStart(e, 'Space', ' ')}
            onMouseUp={(e) => handlePressEnd(e, 'Space', ' ')}
            className="flex-1 h-14 rounded-2xl bg-amber-500 active:bg-amber-300 text-slate-950 font-black text-xs uppercase"
          >
            🎯 TIRER
          </button>
          <button
            onTouchStart={(e) => handlePressStart(e, 'KeyR', 'r')}
            onTouchEnd={(e) => handlePressEnd(e, 'KeyR', 'r')}
            onMouseDown={(e) => handlePressStart(e, 'KeyR', 'r')}
            onMouseUp={(e) => handlePressEnd(e, 'KeyR', 'r')}
            className="flex-1 h-14 rounded-2xl bg-slate-700 active:bg-slate-500 text-white font-bold text-xs uppercase"
          >
            🔄 RECHARGER
          </button>
          <button
            onTouchStart={(e) => handlePressStart(e, 'KeyT', 't')}
            onTouchEnd={(e) => handlePressEnd(e, 'KeyT', 't')}
            onMouseDown={(e) => handlePressStart(e, 'KeyT', 't')}
            onMouseUp={(e) => handlePressEnd(e, 'KeyT', 't')}
            className="flex-1 h-14 rounded-2xl bg-red-600 active:bg-red-400 text-white font-bold text-xs uppercase"
          >
            🛡️ TOURELLE
          </button>
        </div>
      )}

      {/* GAME 13: SKYBOUND WINGS */}
      {gameId === 'skybound_wings' && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowUp', 'ArrowUp')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowUp', 'ArrowUp')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowUp', 'ArrowUp')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowUp', 'ArrowUp')}
              className="w-16 h-16 rounded-2xl bg-sky-950/80 active:bg-sky-500 border border-sky-400 flex items-center justify-center text-white"
            >
              <ArrowUp className="w-8 h-8" />
            </button>
            <button
              onTouchStart={(e) => handlePressStart(e, 'ArrowDown', 'ArrowDown')}
              onTouchEnd={(e) => handlePressEnd(e, 'ArrowDown', 'ArrowDown')}
              onMouseDown={(e) => handlePressStart(e, 'ArrowDown', 'ArrowDown')}
              onMouseUp={(e) => handlePressEnd(e, 'ArrowDown', 'ArrowDown')}
              className="w-16 h-16 rounded-2xl bg-sky-950/80 active:bg-sky-500 border border-sky-400 flex items-center justify-center text-white"
            >
              <ArrowDown className="w-8 h-8" />
            </button>
          </div>

          <button
            onTouchStart={(e) => handlePressStart(e, 'Space', ' ')}
            onTouchEnd={(e) => handlePressEnd(e, 'Space', ' ')}
            onMouseDown={(e) => handlePressStart(e, 'Space', ' ')}
            onMouseUp={(e) => handlePressEnd(e, 'Space', ' ')}
            className="flex-1 max-w-[200px] h-16 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-600 active:from-sky-300 active:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5"
          >
            <Zap className="w-5 h-5" /> TURBO BOOST
          </button>
        </div>
      )}

      {/* GAME 14: GLITCH HUNTER */}
      {gameId === 'glitch_hunter' && (
        <div className="flex items-center justify-around gap-4">
          <button
            onTouchStart={(e) => handlePressStart(e, 'Space', ' ')}
            onTouchEnd={(e) => handlePressEnd(e, 'Space', ' ')}
            onMouseDown={(e) => handlePressStart(e, 'Space', ' ')}
            onMouseUp={(e) => handlePressEnd(e, 'Space', ' ')}
            className="flex-1 h-16 rounded-2xl bg-emerald-500 active:bg-emerald-300 text-slate-950 font-black text-xs uppercase"
          >
            👾 PURGER VIRUS (ESPACE)
          </button>
          <button
            onTouchStart={(e) => handlePressStart(e, 'KeyE', 'e')}
            onTouchEnd={(e) => handlePressEnd(e, 'KeyE', 'e')}
            onMouseDown={(e) => handlePressStart(e, 'KeyE', 'e')}
            onMouseUp={(e) => handlePressEnd(e, 'KeyE', 'e')}
            className="flex-1 h-16 rounded-2xl bg-green-700 active:bg-green-500 text-white font-black text-xs uppercase"
          >
            💥 ONDE IEM (E)
          </button>
        </div>
      )}

      {/* GAME 15: ROBO TYCOON (Touch click already works on canvas, provide handy auto-clicker) */}
      {gameId === 'robo_tycoon' && (
        <div className="text-center py-1 font-mono text-xs text-amber-300 font-bold">
          👆 Touchez directement les stations et générateurs sur l'écran pour miner et moderniser votre usine !
        </div>
      )}
    </div>
  );
}
