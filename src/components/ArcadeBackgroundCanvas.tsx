import React, { useEffect, useRef } from 'react';

export const ArcadeBackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Stars
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.55),
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.8 + 0.2
    }));

    // Floating Embers
    const embers = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedY: -(Math.random() * 0.8 + 0.3),
      speedX: (Math.random() - 0.5) * 0.4,
      color: ['#06b6d4', '#a855f7', '#f43f5e', '#facc15'][Math.floor(Math.random() * 4)],
      alpha: Math.random() * 0.7 + 0.3
    }));

    let gridOffset = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep arcade dark gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, '#030712'); // Slate 950
      bgGradient.addColorStop(0.5, '#090d16');
      bgGradient.addColorStop(0.85, '#020617');
      bgGradient.addColorStop(1, '#050212');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // --- Stars in upper sky ---
      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > height * 0.55) {
          star.y = 0;
          star.x = Math.random() * width;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- Retro Horizon Glow & Neon Sun Line ---
      const horizonY = height * 0.52;

      // Horizon glow
      const horizonGlow = ctx.createRadialGradient(
        width / 2, horizonY, 10,
        width / 2, horizonY, width * 0.6
      );
      horizonGlow.addColorStop(0, 'rgba(168, 85, 247, 0.35)'); // Purple glow
      horizonGlow.addColorStop(0.5, 'rgba(6, 182, 212, 0.2)'); // Cyan glow
      horizonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, horizonY - 150, width, 300);

      // Neon Horizon Line
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow

      // --- 3D Moving Synthwave Perspective Grid ---
      gridOffset = (gridOffset + 0.8) % 40;

      const vanishingX = width / 2;
      const vanishingY = horizonY;

      ctx.save();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1;

      // Perspective Lines vanishing into horizon
      const numPerspectiveLines = 28;
      for (let i = -numPerspectiveLines / 2; i <= numPerspectiveLines / 2; i++) {
        const bottomX = vanishingX + i * (width / 12);
        ctx.beginPath();
        ctx.moveTo(vanishingX, vanishingY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }

      // Horizontal moving grid lines with perspective scaling
      for (let y = horizonY; y < height; y += (y - horizonY) * 0.12 + 2) {
        const lineY = y + (gridOffset * (y - horizonY)) / 400;
        if (lineY > horizonY && lineY < height) {
          const progress = (lineY - horizonY) / (height - horizonY);
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.1 + progress * 0.4})`;
          ctx.beginPath();
          ctx.moveTo(0, lineY);
          ctx.lineTo(width, lineY);
          ctx.stroke();
        }
      }
      ctx.restore();

      // --- Floating Arcade Embers ---
      embers.forEach((ember) => {
        ember.y += ember.speedY;
        ember.x += ember.speedX;

        if (ember.y < 0) {
          ember.y = height;
          ember.x = Math.random() * width;
        }

        ctx.save();
        ctx.fillStyle = ember.color;
        ctx.globalAlpha = ember.alpha;
        ctx.shadowColor = ember.color;
        ctx.shadowBlur = 8;
        ctx.fillRect(ember.x, ember.y, ember.size, ember.size);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};
