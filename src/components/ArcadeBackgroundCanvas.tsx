import React, { useEffect, useRef } from 'react';

interface ArcadeBackgroundCanvasProps {
  themeType?: string;
}

export const ArcadeBackgroundCanvas: React.FC<ArcadeBackgroundCanvasProps> = ({ themeType = 'grid' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle seeds
    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedY: (Math.random() - 0.5) * 1.5,
      speedX: (Math.random() - 0.5) * 1.5,
      char: String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96)),
      opacity: Math.random() * 0.8 + 0.2
    }));

    let gridOffset = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render based on themeType
      if (themeType === 'matrix') {
        // Matrix Rain Canvas
        ctx.fillStyle = 'rgba(3, 10, 5, 0.9)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = '14px monospace';
        particles.forEach((p) => {
          ctx.fillStyle = `rgba(34, 197, 94, ${p.opacity})`;
          ctx.fillText(p.char, p.x, p.y);
          p.y += 3 + p.size;
          if (p.y > height) {
            p.y = 0;
            p.x = Math.random() * width;
          }
        });
      } else if (themeType === 'lava' || themeType === 'supernova') {
        // Lava / Sunfire / Supernova Pulse
        const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width);
        bgGrad.addColorStop(0, themeType === 'supernova' ? '#450a0a' : '#291000');
        bgGrad.addColorStop(1, '#050101');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p) => {
          ctx.fillStyle = themeType === 'supernova' ? '#ef4444' : '#f97316';
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
          ctx.fill();

          p.y -= 1.2;
          p.x += Math.sin(p.y * 0.02);
          if (p.y < 0) p.y = height;
        });
        ctx.globalAlpha = 1;
      } else if (themeType === 'glacier') {
        // Glacier Ice Pulse
        ctx.fillStyle = '#02131e';
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p) => {
          ctx.fillStyle = '#38bdf8';
          ctx.globalAlpha = p.opacity * 0.7;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.y += 0.8;
          p.x += Math.cos(p.y * 0.01) * 0.5;
          if (p.y > height) p.y = 0;
        });
        ctx.globalAlpha = 1;
      } else if (themeType === 'gold') {
        // Gold Emperor Sparkles
        ctx.fillStyle = '#171202';
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p) => {
          ctx.fillStyle = '#facc15';
          ctx.globalAlpha = p.opacity;
          ctx.fillRect(p.x, p.y, p.size * 2, p.size * 2);

          p.y -= 0.9;
          if (p.y < 0) p.y = height;
        });
        ctx.globalAlpha = 1;
      } else if (themeType === 'quantum' || themeType === 'nebula') {
        // Quantum Void / Nebula
        const grad = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, width * 0.8);
        grad.addColorStop(0, '#1e1b4b');
        grad.addColorStop(0.5, '#0f172a');
        grad.addColorStop(1, '#030712');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p) => {
          ctx.fillStyle = p.size > 2 ? '#a855f7' : '#ec4899';
          ctx.globalAlpha = p.opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.speedX;
          p.y += p.speedY;
          if (p.x < 0 || p.x > width) p.speedX *= -1;
          if (p.y < 0 || p.y > height) p.speedY *= -1;
        });
        ctx.globalAlpha = 1;
      } else {
        // Standard / Synthwave Grid
        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, width, height);

        const horizonY = height * 0.55;

        // Horizon glow
        const horizonGlow = ctx.createRadialGradient(width / 2, horizonY, 10, width / 2, horizonY, width * 0.6);
        horizonGlow.addColorStop(0, themeType === 'synthwave' ? 'rgba(236, 72, 153, 0.4)' : 'rgba(6, 182, 212, 0.3)');
        horizonGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = horizonGlow;
        ctx.fillRect(0, horizonY - 150, width, 300);

        // Grid lines
        gridOffset = (gridOffset + 0.8) % 40;
        const vanishingX = width / 2;
        ctx.strokeStyle = themeType === 'synthwave' ? 'rgba(236, 72, 153, 0.25)' : 'rgba(6, 182, 212, 0.25)';
        ctx.lineWidth = 1;

        for (let i = -14; i <= 14; i++) {
          ctx.beginPath();
          ctx.moveTo(vanishingX, horizonY);
          ctx.lineTo(vanishingX + i * (width / 12), height);
          ctx.stroke();
        }

        for (let y = horizonY; y < height; y += (y - horizonY) * 0.12 + 2) {
          const lineY = y + (gridOffset * (y - horizonY)) / 400;
          if (lineY > horizonY && lineY < height) {
            ctx.beginPath();
            ctx.moveTo(0, lineY);
            ctx.lineTo(width, lineY);
            ctx.stroke();
          }
        }

        particles.forEach((p) => {
          ctx.fillStyle = themeType === 'synthwave' ? '#f43f5e' : '#06b6d4';
          ctx.globalAlpha = p.opacity * 0.8;
          ctx.fillRect(p.x, p.y, p.size, p.size);
          p.y -= 0.5;
          if (p.y < 0) p.y = height;
        });
        ctx.globalAlpha = 1;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [themeType]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-90"
    />
  );
};
