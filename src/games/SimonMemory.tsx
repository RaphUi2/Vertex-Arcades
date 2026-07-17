import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Trophy, ArrowLeft, RotateCcw, Volume2 } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

const PAD_CONFIGS = [
  { id: 0, color: 'bg-cyan-500 border-cyan-400', glow: 'shadow-[0_0_25px_rgba(6,182,212,0.8)]', soundFreq: 261.63, hover: 'hover:bg-cyan-400' }, // C4
  { id: 1, color: 'bg-rose-500 border-rose-400', glow: 'shadow-[0_0_25px_rgba(244,63,94,0.8)]', soundFreq: 329.63, hover: 'hover:bg-rose-400' },  // E4
  { id: 2, color: 'bg-yellow-500 border-yellow-400', glow: 'shadow-[0_0_25px_rgba(234,179,8,0.8)]', soundFreq: 392.00, hover: 'hover:bg-yellow-400' }, // G4
  { id: 3, color: 'bg-emerald-500 border-emerald-400', glow: 'shadow-[0_0_25px_rgba(16,185,129,0.8)]', soundFreq: 523.25, hover: 'hover:bg-emerald-400' } // C5
];

export default function SimonMemory({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [score, setScore] = useState(0);
  const [statusText, setStatusText] = useState("Clique sur COMMENCER");
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'user' | 'over'>('idle');

  const playSequence = async (seq: number[]) => {
    setIsPlayingSeq(true);
    setGameState('showing');
    setStatusText("Observe la séquence...");
    
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const padId = seq[i];
      setActivePad(padId);
      playPadSound(padId);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setActivePad(null);
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
    setIsPlayingSeq(false);
    setGameState('user');
    setStatusText("À ton tour !");
  };

  const playPadSound = (padId: number) => {
    if (!audio.isSoundEnabled()) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(PAD_CONFIGS[padId].soundFreq, ctx.currentTime);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  };

  const startNewGame = () => {
    audio.playCoin();
    const firstPad = Math.floor(Math.random() * 4);
    const newSeq = [firstPad];
    setSequence(newSeq);
    setUserSequence([]);
    setScore(0);
    playSequence(newSeq);
  };

  const handlePadClick = (padId: number) => {
    if (isPlayingSeq || gameState !== 'user') return;
    
    playPadSound(padId);
    setActivePad(padId);
    setTimeout(() => setActivePad(null), 150);

    const nextUserSeq = [...userSequence, padId];
    setUserSequence(nextUserSeq);

    // Verify user correctness
    const currentIdx = nextUserSeq.length - 1;
    if (nextUserSeq[currentIdx] !== sequence[currentIdx]) {
      // Game Over!
      audio.playGameOver();
      setGameState('over');
      setStatusText("SÉQUENCE INCORRECTE !");
      onGameOver(score);
      return;
    }

    // Complete sequence?
    if (nextUserSeq.length === sequence.length) {
      const addedPoints = sequence.length * 10;
      setScore(prev => prev + addedPoints);
      onScore(addedPoints);
      setStatusText("Bien joué ! +PX");
      audio.playWin();

      // Append new pad to sequence
      setTimeout(() => {
        const nextPad = Math.floor(Math.random() * 4);
        const nextSeq = [...sequence, nextPad];
        setSequence(nextSeq);
        setUserSequence([]);
        playSequence(nextSeq);
      }, 1000);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] text-white relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-200 transition-colors bg-purple-950/40 px-3 py-1.5 rounded-lg border border-purple-800"
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="flex items-center gap-2 text-yellow-400">
          <Trophy size={18} />
          <span className="font-mono text-sm tracking-wide">Record: {highScore} PX</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold font-sans tracking-widest text-purple-400 uppercase drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
          Simon Mémorisation
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          REPRODUIS LA SÉQUENCE LUMINEUSE ET SONORE
        </p>
      </div>

      {/* Score Dashboard */}
      <div className="grid grid-cols-2 gap-3 mb-6 font-mono text-center relative z-10">
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SCORE</p>
          <p className="text-xl font-bold text-purple-400">{score} PX</p>
        </div>
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">LONGUEUR</p>
          <p className="text-xl font-bold text-slate-200">{sequence.length}</p>
        </div>
      </div>

      {/* Game pad grid */}
      <div className="flex justify-center items-center my-6">
        <div className="grid grid-cols-2 gap-4 w-64 h-64 relative bg-slate-900 p-4 rounded-full border-4 border-slate-800 shadow-inner">
          {/* Inner core display */}
          <div className="absolute inset-[33%] bg-slate-950 rounded-full border-4 border-slate-800 flex flex-col justify-center items-center z-20 text-center p-1">
            <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase">Status</span>
            <span className="text-[10px] font-mono font-bold text-cyan-400 leading-tight select-none">
              {statusText}
            </span>
          </div>

          {PAD_CONFIGS.map((pad) => (
            <button
              id={`simon-pad-${pad.id}`}
              key={pad.id}
              onClick={() => handlePadClick(pad.id)}
              disabled={isPlayingSeq || gameState === 'idle' || gameState === 'over'}
              className={`w-full h-full rounded-2xl border-4 border-slate-950 cursor-pointer transition-all duration-100 ${
                activePad === pad.id ? `${pad.color} ${pad.glow}` : 'bg-slate-800 opacity-60'
              } ${gameState === 'user' && !isPlayingSeq ? pad.hover + ' hover:opacity-100' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center mt-6 relative z-10">
        {gameState === 'idle' || gameState === 'over' ? (
          <button
            onClick={startNewGame}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-mono font-bold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all transform active:scale-95 text-sm tracking-widest"
          >
            <RotateCcw size={16} /> {gameState === 'over' ? 'REJOUER' : 'LANCER LA PARTIE'}
          </button>
        ) : (
          <div className="text-center font-mono text-xs text-slate-500 py-3">
            Séquence en cours de progression...
          </div>
        )}
      </div>
    </div>
  );
}
