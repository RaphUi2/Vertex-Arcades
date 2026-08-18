import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Flame, ShieldAlert, Award, Zap, Compass } from 'lucide-react';

interface CyberDriftProps {
  onGameOver: (score: number, pixelsEarned: number) => void;
  audioEnabled?: boolean;
}

export const CyberDrift: React.FC<CyberDriftProps> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [speed, setSpeed] = useState(6);
  const [gameOver, setGameOver] = useState(false);

  // Input states
  const steeringRef = useRef<number>(0); // -1 = left, 1 = right, 0 = straight

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frameCount = 0;
    let currentScore = 0;
    let currentLives = 3;
    let carX = canvas.width / 2;
    const carY = canvas.height - 90;
    let carAngle = 0; // angle of car
    let speedVal = 6;

    // Obstacles and Battery Collectibles
    interface Item {
      x: number;
      y: number;
      type: 'battery' | 'oil' | 'barrier';
      size: number;
    }
    let items: Item[] = [];

    // Keyboard handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) steeringRef.current = -1;
      if (['ArrowRight', 'KeyD'].includes(e.code)) steeringRef.current = 1;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA', 'ArrowRight', 'KeyD'].includes(e.code)) {
        steeringRef.current = 0;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Track curvature parameters
    let trackOffset = 0;
    let trackCurve = 0;

    const gameLoop = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update Track curve dynamically
      if (frameCount % 180 === 0) {
        trackCurve = (Math.random() - 0.5) * 3;
      }
      trackOffset += trackCurve;

      // Draw Horizon & Grid Background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Retro Horizon Grid lines
      ctx.strokeStyle = '#3b82f633';
      ctx.lineWidth = 1;
      const roadTop = 100;
      const roadBottom = canvas.height;
      const roadWidthTop = 120;
      const roadWidthBottom = 340;

      // Road background polygon
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - roadWidthTop / 2 + trackCurve * 10, roadTop);
      ctx.lineTo(canvas.width / 2 + roadWidthTop / 2 + trackCurve * 10, roadTop);
      ctx.lineTo(canvas.width / 2 + roadWidthBottom / 2, roadBottom);
      ctx.lineTo(canvas.width / 2 - roadWidthBottom / 2, roadBottom);
      ctx.closePath();
      ctx.fill();

      // Road borders
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - roadWidthTop / 2 + trackCurve * 10, roadTop);
      ctx.lineTo(canvas.width / 2 - roadWidthBottom / 2, roadBottom);
      ctx.moveTo(canvas.width / 2 + roadWidthTop / 2 + trackCurve * 10, roadTop);
      ctx.lineTo(canvas.width / 2 + roadWidthBottom / 2, roadBottom);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Moving center dashed lines
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.setLineDash([20, 20]);
      ctx.lineDashOffset = -frameCount * speedVal;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 + trackCurve * 5, roadTop);
      ctx.lineTo(canvas.width / 2, roadBottom);
      ctx.stroke();
      ctx.setLineDash([]);

      // Spawn Items
      if (frameCount % 45 === 0) {
        const itemTypeRnd = Math.random();
        let type: 'battery' | 'oil' | 'barrier' = 'battery';
        if (itemTypeRnd > 0.5) type = 'oil';
        if (itemTypeRnd > 0.8) type = 'barrier';

        const roadLeftAtTop = canvas.width / 2 - roadWidthTop / 2;
        items.push({
          x: roadLeftAtTop + 20 + Math.random() * (roadWidthTop - 40),
          y: roadTop,
          type,
          size: 10
        });
      }

      // Update & Render Items
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += speedVal;
        // Expand item as it approaches bottom (perspective)
        const progress = (item.y - roadTop) / (roadBottom - roadTop);
        item.size = 12 + progress * 24;

        // Render Item
        if (item.type === 'battery') {
          ctx.fillStyle = '#22c55e';
          ctx.shadowColor = '#22c55e';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (item.type === 'oil') {
          ctx.fillStyle = '#a855f7';
          ctx.beginPath();
          ctx.ellipse(item.x, item.y, item.size, item.size / 2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 12;
          ctx.fillRect(item.x - item.size / 2, item.y - item.size / 2, item.size, item.size);
          ctx.shadowBlur = 0;
        }

        // Collision Check with Car
        const dx = item.x - carX;
        const dy = item.y - carY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < item.size + 18) {
          if (item.type === 'battery') {
            currentScore += 150;
            setScore(currentScore);
            items.splice(i, 1);
          } else if (item.type === 'oil') {
            // Spin out delay
            carAngle = (Math.random() - 0.5) * 1.5;
            items.splice(i, 1);
          } else if (item.type === 'barrier') {
            currentLives--;
            setLives(currentLives);
            items.splice(i, 1);

            if (currentLives <= 0) {
              setGameOver(true);
              setIsPlaying(false);
              const px = Math.floor(currentScore / 3);
              onGameOver(currentScore, px);
              return;
            }
          }
        } else if (item.y > canvas.height + 20) {
          items.splice(i, 1);
        }
      }

      // Steering & Car Movement
      carX += steeringRef.current * 7;
      // Clamp car within road bounds
      const minX = canvas.width / 2 - roadWidthBottom / 2 + 30;
      const maxX = canvas.width / 2 + roadWidthBottom / 2 - 30;
      if (carX < minX) carX = minX;
      if (carX > maxX) carX = maxX;

      // Car Angle rotation smoothing
      carAngle = carAngle * 0.8 + (steeringRef.current * 0.3) * 0.2;

      // Draw Cyber Neon Race Car
      ctx.save();
      ctx.translate(carX, carY);
      ctx.rotate(carAngle);

      // Neon Drift Glow Trails
      if (steeringRef.current !== 0) {
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(-15, 20);
        ctx.lineTo(-20, 40);
        ctx.moveTo(15, 20);
        ctx.lineTo(20, 40);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Car Body
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 15;
      ctx.fillRect(-18, -25, 36, 50);

      // Windshield
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-12, -10, 24, 18);

      // Tail Lights
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 10;
      ctx.fillRect(-16, 22, 10, 4);
      ctx.fillRect(6, 22, 10, 4);

      ctx.restore();

      // Distance score accumulation
      if (frameCount % 10 === 0) {
        currentScore += 10;
        setScore(currentScore);
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, gameOver, onGameOver]);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setSpeed(6);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4 bg-slate-950/90 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Title Bar */}
      <div className="w-full flex items-center justify-between mb-3 border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-wider">
            <Flame className="text-rose-500" size={22} /> CYBER DRIFT RACER
          </h2>
          <p className="text-xs text-slate-400">Esquivez les pièges, capturez les orbes verte & pilotez !</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-xl text-center">
            <span className="text-[9px] uppercase text-slate-400 font-bold block">Score</span>
            <span className="text-sm font-black text-cyan-400">{score}</span>
          </div>
          <div className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-xl text-center">
            <span className="text-[9px] uppercase text-slate-400 font-bold block">Vies</span>
            <span className="text-sm font-black text-rose-400">{'❤️'.repeat(lives)}</span>
          </div>
        </div>
      </div>

      {!isPlaying ? (
        <div className="flex flex-col items-center justify-center my-12 text-center space-y-5">
          <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border-2 border-rose-500/50 flex items-center justify-center text-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
            <Compass size={40} />
          </div>
          <h3 className="text-xl font-extrabold text-white">Course de Drift Cybernétique</h3>
          <p className="text-xs text-slate-400 max-w-xs">
            Utilisez les flèches GAUCHE / DROITE ou les boutons tactiles ci-dessous pour diriger votre voiture.
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white font-black text-sm uppercase rounded-2xl shadow-[0_0_20px_rgba(244,63,94,0.5)] transition cursor-pointer flex items-center gap-2"
          >
            <Play size={18} /> Démarrer la Course
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full space-y-3">
          <canvas
            ref={canvasRef}
            width={360}
            height={420}
            className="border-2 border-cyan-500/40 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.2)] bg-slate-950"
          />

          {/* Touch Steering Buttons */}
          <div className="flex items-center justify-between w-full max-w-xs px-4 pt-1">
            <button
              onMouseDown={() => (steeringRef.current = -1)}
              onMouseUp={() => (steeringRef.current = 0)}
              onTouchStart={() => (steeringRef.current = -1)}
              onTouchEnd={() => (steeringRef.current = 0)}
              className="px-6 py-3 bg-slate-900 border border-cyan-500/50 active:bg-cyan-500 text-cyan-400 font-black rounded-2xl shadow cursor-pointer text-sm uppercase tracking-wider"
            >
              ⬅️ GAUCHE
            </button>
            <button
              onMouseDown={() => (steeringRef.current = 1)}
              onMouseUp={() => (steeringRef.current = 0)}
              onTouchStart={() => (steeringRef.current = 1)}
              onTouchEnd={() => (steeringRef.current = 0)}
              className="px-6 py-3 bg-slate-900 border border-cyan-500/50 active:bg-cyan-500 text-cyan-400 font-black rounded-2xl shadow cursor-pointer text-sm uppercase tracking-wider"
            >
              DROITE ➡️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CyberDrift;
