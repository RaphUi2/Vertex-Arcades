import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Trophy, RotateCcw, Zap, Sparkles, Music } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

interface Note {
  id: number;
  lane: number; // 0, 1, 2, 3
  y: number;
  hit: boolean;
  color: string;
}

const LANES = [
  { key: 'D', label: 'D', color: '#06b6d4' },
  { key: 'F', label: 'F', color: '#ec4899' },
  { key: 'J', label: 'J', color: '#eab308' },
  { key: 'K', label: 'K', color: '#a855f7' }
];

export default function CyberRhythm({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [health, setHealth] = useState(100);
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);

  const stateRef = useRef({
    isPlaying: false,
    score: 0,
    combo: 0,
    maxCombo: 0,
    health: 100,
    notes: [] as Note[],
    nextNoteId: 1,
    laneActive: [false, false, false, false],
    speed: 4.5
  });

  const triggerFeedback = (text: string, color: string) => {
    setFeedback({ text, color });
    setTimeout(() => setFeedback(null), 600);
  };

  const startNewGame = () => {
    audio.playCoin();
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHealth(100);
    setIsEnded(false);
    setIsPlaying(true);

    stateRef.current = {
      isPlaying: true,
      score: 0,
      combo: 0,
      maxCombo: 0,
      health: 100,
      notes: [],
      nextNoteId: 1,
      laneActive: [false, false, false, false],
      speed: 4.5
    };
  };

  const triggerGameOver = () => {
    stateRef.current.isPlaying = false;
    setIsPlaying(false);
    setIsEnded(true);
    audio.playGameOver();
    onGameOver(stateRef.current.score);
  };

  const hitLane = (laneIndex: number) => {
    const st = stateRef.current;
    if (!st.isPlaying) return;

    st.laneActive[laneIndex] = true;
    setTimeout(() => { st.laneActive[laneIndex] = false; }, 150);

    // Target Y region around y = 380 to 440 (hit zone at 410)
    const hitZoneY = 410;
    let closestNote: Note | null = null;
    let minDistance = 999;

    st.notes.forEach((n) => {
      if (n.lane === laneIndex && !n.hit) {
        const dist = Math.abs(n.y - hitZoneY);
        if (dist < minDistance) {
          minDistance = dist;
          closestNote = n;
        }
      }
    });

    if (closestNote && minDistance < 50) {
      (closestNote as Note).hit = true;
      let points = 50;
      let evalText = 'GOOD';
      let evalColor = 'text-yellow-400';

      if (minDistance < 20) {
        points = 100;
        evalText = 'PERFECT ⚡';
        evalColor = 'text-cyan-400';
      }

      st.combo += 1;
      if (st.combo > st.maxCombo) st.maxCombo = st.combo;
      const multiplier = Math.min(4, 1 + Math.floor(st.combo / 5) * 0.5);
      const totalGain = Math.round(points * multiplier);

      st.score += totalGain;
      st.health = Math.min(100, st.health + 2);

      setScore(st.score);
      setCombo(st.combo);
      setMaxCombo(st.maxCombo);
      setHealth(st.health);
      onScore(st.score);
      triggerFeedback(evalText, evalColor);
      audio.playHit();
    } else {
      // Missed hit press
      st.combo = 0;
      st.health = Math.max(0, st.health - 6);
      setCombo(0);
      setHealth(st.health);
      triggerFeedback('MISS ❌', 'text-rose-500');
      audio.playClick();

      if (st.health <= 0) triggerGameOver();
    }
  };

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === 'd' || e.key === 'D') hitLane(0);
      if (e.key === 'f' || e.key === 'F') hitLane(1);
      if (e.key === 'j' || e.key === 'J') hitLane(2);
      if (e.key === 'k' || e.key === 'K') hitLane(3);
      if ((e.key === ' ' || e.key === 'Enter') && !stateRef.current.isPlaying) {
        startNewGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Rhythm Game Spawner & Animator
  useEffect(() => {
    let animId: number;
    let spawnTimer = 0;

    const loop = () => {
      const st = stateRef.current;
      if (st.isPlaying) {
        spawnTimer++;
        // Spawn notes at intervals
        if (spawnTimer > 28 - Math.min(18, Math.floor(st.score / 300))) {
          spawnTimer = 0;
          const lane = Math.floor(Math.random() * 4);
          st.notes.push({
            id: st.nextNoteId++,
            lane,
            y: 0,
            hit: false,
            color: LANES[lane].color
          });
        }

        // Move notes
        for (let i = st.notes.length - 1; i >= 0; i--) {
          const n = st.notes[i];
          n.y += st.speed + Math.min(3, st.score / 800);

          // Note missed when falling past bottom (y > 470)
          if (n.y > 470 && !n.hit) {
            st.notes.splice(i, 1);
            st.combo = 0;
            st.health = Math.max(0, st.health - 8);
            setCombo(0);
            setHealth(st.health);
            triggerFeedback('RATÉ 💔', 'text-rose-500');

            if (st.health <= 0) {
              triggerGameOver();
              break;
            }
          } else if (n.hit && n.y > 430) {
            st.notes.splice(i, 1);
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 font-mono">
      {/* Top Bar */}
      <div className="w-full max-w-lg flex items-center justify-between mb-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs">
        <button
          onClick={() => { audio.playClick(); onBack(); }}
          className="flex items-center gap-1 text-slate-400 hover:text-white font-bold cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800"
        >
          <ArrowLeft size={14} /> QUITTER
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-purple-400 font-bold">
            <Music size={14} /> COMBO: x{combo}
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Trophy size={14} /> BEST: {highScore}
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400 font-black">
            <Zap size={14} /> {score}
          </div>
        </div>
      </div>

      {/* Main Game Frame */}
      <div className="relative w-full max-w-[400px] h-[500px] bg-slate-950 border-2 border-cyan-500/80 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.3)] flex flex-col justify-between">
        {/* Health Bar */}
        <div className="w-full bg-slate-900 h-2">
          <div
            className={`h-full transition-all ${health > 40 ? 'bg-cyan-400' : 'bg-rose-500 animate-pulse'}`}
            style={{ width: `${health}%` }}
          />
        </div>

        {/* Feedback Popup Overlay */}
        {feedback && (
          <div className="absolute top-16 inset-x-0 text-center pointer-events-none z-20 animate-ping">
            <span className={`text-xl font-black ${feedback.color} uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]`}>
              {feedback.text}
            </span>
          </div>
        )}

        {/* 4 Rhythm Lanes Container */}
        <div className="flex-1 relative flex justify-between px-2 bg-gradient-to-b from-slate-950 via-slate-900/60 to-cyan-950/40">
          {LANES.map((lane, index) => (
            <div
              key={lane.key}
              className={`flex-1 mx-1 h-full border-x border-slate-800/80 relative flex flex-col justify-end pb-12 transition-all ${
                stateRef.current.laneActive[index] ? 'bg-cyan-500/20' : ''
              }`}
            >
              {/* Lane Divider Lines */}
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-slate-800/40" />

              {/* Render Falling Notes for this lane */}
              {stateRef.current.notes
                .filter((n) => n.lane === index && !n.hit)
                .map((n) => (
                  <div
                    key={n.id}
                    className="absolute left-1 right-1 h-8 rounded-lg shadow-lg flex items-center justify-center border-2"
                    style={{
                      top: `${n.y}px`,
                      backgroundColor: n.color,
                      borderColor: '#ffffff',
                      boxShadow: `0 0 15px ${n.color}`
                    }}
                  >
                    <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                  </div>
                ))}

              {/* Target Hit Zone Line */}
              <div
                className="absolute left-0 right-0 h-10 border-2 rounded-xl flex items-center justify-center shadow-md transition-all"
                style={{
                  top: '390px',
                  borderColor: lane.color,
                  backgroundColor: stateRef.current.laneActive[index] ? lane.color : 'rgba(15, 23, 42, 0.7)'
                }}
              >
                <span className="text-white font-black text-xs">{lane.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Touch / Click Buttons for Mobile */}
        <div className="p-2 bg-slate-900 border-t border-slate-800 grid grid-cols-4 gap-2 z-10">
          {LANES.map((lane, index) => (
            <button
              key={lane.key}
              onClick={() => hitLane(index)}
              className="py-3.5 rounded-xl font-black text-sm text-slate-950 uppercase cursor-pointer active:scale-95 transition-all shadow-md"
              style={{ backgroundColor: lane.color }}
            >
              {lane.label}
            </button>
          ))}
        </div>

        {/* Start Overlay */}
        {!isPlaying && !isEnded && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="p-3 bg-cyan-950/60 rounded-full border border-cyan-500 mb-3 animate-bounce">
              <Music size={32} className="text-cyan-400" />
            </div>
            <h3 className="text-2xl font-black text-cyan-400 uppercase tracking-widest mb-1">
              CYBER RHYTHM NÉON
            </h3>
            <p className="text-xs text-slate-300 max-w-xs mb-5">
              Appuyez sur les touches [D, F, J, K] ou les boutons tactiles en rythme au moment où les notes traversent la ligne de cible !
            </p>
            <button
              onClick={startNewGame}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3 px-8 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-lg animate-pulse"
            >
              LANCER LE RYTHME ⚡
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {isEnded && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
            <h3 className="text-2xl font-black text-rose-500 uppercase tracking-widest mb-1">
              FIN DU CONCERT
            </h3>
            <p className="text-sm text-slate-300 mb-1">
              Score Final : <span className="text-cyan-400 font-black">{score} pts</span>
            </p>
            <p className="text-xs text-purple-400 font-bold mb-4">
              Meilleur Combo : {maxCombo}x
            </p>
            <button
              onClick={startNewGame}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3 px-8 rounded-xl text-xs uppercase tracking-wider cursor-pointer shadow-lg flex items-center gap-2 mb-2"
            >
              <RotateCcw size={16} /> REPLAY RYTHME
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
