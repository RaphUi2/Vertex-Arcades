import React, { useState, useEffect, useRef } from 'react';
import { Trophy, ArrowLeft, RotateCcw, Clock, Shield, Flame, Zap, Award, Crown, Cpu, Target, HelpCircle } from 'lucide-react';
import { audio } from '../utils/audio';

interface GameProps {
  onScore: (score: number) => void;
  onGameOver: (finalScore: number) => void;
  onBack: () => void;
  highScore: number;
}

interface Card {
  id: number;
  iconName: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ICONS_POOL = ['Zap', 'Flame', 'Shield', 'Award', 'Crown', 'Cpu', 'Target', 'Trophy'];

export default function MemoryPairs({ onScore, onGameOver, onBack, highScore }: GameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const stateRef = useRef({
    isPlaying: false,
    score: 0,
  });

  const highScoreRef = useRef(highScore);
  useEffect(() => {
    highScoreRef.current = highScore;
  }, [highScore]);

  const startGame = () => {
    audio.playCoin();
    setScore(0);
    setTimeLeft(45);
    setIsEnded(false);
    setIsPlaying(true);
    setSelectedIndices([]);

    stateRef.current = {
      isPlaying: true,
      score: 0,
    };

    // Generate shuffled pairs
    const chosenIcons = ICONS_POOL; // 8 pairs = 16 cards
    const cardPool: Card[] = [];
    
    chosenIcons.forEach((icon, index) => {
      cardPool.push({ id: index * 2, iconName: icon, isFlipped: false, isMatched: false });
      cardPool.push({ id: index * 2 + 1, iconName: icon, isFlipped: false, isMatched: false });
    });

    // Shuffle
    for (let i = cardPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardPool[i], cardPool[j]] = [cardPool[j], cardPool[i]];
    }

    setCards(cardPool);
  };

  const handleCardClick = (clickedIndex: number) => {
    if (!isPlaying || selectedIndices.length >= 2) return;
    
    const clickedCard = cards[clickedIndex];
    if (clickedCard.isFlipped || clickedCard.isMatched) return;

    audio.playClick();

    // Flip card
    const updatedCards = [...cards];
    updatedCards[clickedIndex].isFlipped = true;
    setCards(updatedCards);

    const nextSelected = [...selectedIndices, clickedIndex];
    setSelectedIndices(nextSelected);

    if (nextSelected.length === 2) {
      const [firstIdx, secondIdx] = nextSelected;
      const card1 = cards[firstIdx];
      const card2 = cards[secondIdx];

      if (card1.iconName === card2.iconName) {
        // Matched!
        setTimeout(() => {
          audio.playCoin();
          const newCards = [...cards];
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setCards(newCards);
          setSelectedIndices([]);

          stateRef.current.score += 40;
          setScore(stateRef.current.score);
          onScore(40);

          // Check if all matched
          if (newCards.every(c => c.isMatched)) {
            // Instant win / level complete bonus
            stateRef.current.score += 100;
            setScore(stateRef.current.score);
            onScore(100);
            triggerGameOver();
          }
        }, 400);
      } else {
        // Not matched
        setTimeout(() => {
          audio.playHit();
          const newCards = [...cards];
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards(newCards);
          setSelectedIndices([]);
          // penalize slightly to make it competitive
          stateRef.current.score = Math.max(0, stateRef.current.score - 5);
          setScore(stateRef.current.score);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
  }, [isPlaying]);

  // Countdown timer
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isPlaying) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            triggerGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isPlaying]);

  const triggerGameOver = () => {
    setIsPlaying(false);
    setIsEnded(true);
    audio.playGameOver();
    onGameOver(stateRef.current.score);
  };

  const renderCardIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'Shield': return <Shield className={className} />;
      case 'Award': return <Award className={className} />;
      case 'Crown': return <Crown className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Target': return <Target className={className} />;
      case 'Trophy': return <Trophy className={className} />;
      default: return <HelpCircle className={className} />;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-950 p-6 rounded-2xl border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] text-white relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

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

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold font-sans tracking-widest text-purple-400 uppercase drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
          Paires Néon
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          RETOURNEZ LES CARTES DE LA MATRICE ET ASSOCIEZ LES SYMBOLES IDENTIQUES !
        </p>
      </div>

      {/* Score Panel */}
      <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-center relative z-10">
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400">SCORE</p>
          <p className="text-lg font-bold text-purple-400">{score} PX</p>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-center items-center">
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Clock size={10} /> TEMPS
          </div>
          <p className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-200'}`}>{timeLeft}s</p>
        </div>
      </div>

      {/* Grid of cards */}
      <div className="flex justify-center items-center my-2 relative z-10">
        <div className="grid grid-cols-4 gap-2.5 bg-slate-900/40 p-4 rounded-2xl border border-slate-800 shadow-inner max-w-[320px] w-full">
          {isPlaying ? (
            cards.map((card, idx) => {
              const showContent = card.isFlipped || card.isMatched;
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className={`aspect-square rounded-xl border-2 font-bold text-xs flex items-center justify-center transition-all duration-300 relative transform active:scale-95 cursor-pointer ${
                    card.isMatched
                      ? 'bg-purple-950/40 border-purple-500/40 text-purple-400 opacity-60'
                      : showContent
                      ? 'bg-purple-950 border-purple-400 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                      : 'bg-slate-950 border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-500'
                  }`}
                >
                  {showContent ? (
                    renderCardIcon(card.iconName, "w-6 h-6 drop-shadow-[0_0_5px_currentColor]")
                  ) : (
                    <HelpCircle className="w-5 h-5 opacity-40" />
                  )}
                </button>
              );
            })
          ) : (
            Array(16).fill(null).map((_, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-xl border border-slate-850 bg-slate-950 flex items-center justify-center opacity-30"
              >
                <HelpCircle className="w-5 h-5 text-slate-700" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Trigger */}
      <div className="flex justify-center mt-4 relative z-10">
        {!isPlaying && (
          <button
            onClick={startGame}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all transform active:scale-95 text-xs tracking-widest"
          >
            <RotateCcw size={14} /> {isEnded ? 'REJOUER' : 'LANCER LA MATRICE'}
          </button>
        )}
      </div>
    </div>
  );
}
