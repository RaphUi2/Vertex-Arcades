import React, { useEffect, useRef } from 'react';

interface ArcadeBackgroundCanvasProps {
  themeType?: string;
  activeTheme?: string;
  particleDensity?: string;
  glowIntensity?: string;
}

export const ArcadeBackgroundCanvas: React.FC<ArcadeBackgroundCanvasProps> = ({
  themeType,
  activeTheme = 'cyber_matrix',
  particleDensity = 'high',
  glowIntensity = 'strong'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentTheme = themeType || activeTheme || 'cyber_matrix';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic particles for background animation
    const particles = Array.from({ length: 110 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.8 + 1,
      speedY: (Math.random() - 0.5) * 1.6,
      speedX: (Math.random() - 0.5) * 1.6,
      char: String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96)),
      opacity: Math.random() * 0.8 + 0.2,
      pulse: Math.random() * Math.PI
    }));

    // Shooting stars
    const meteors = Array.from({ length: 3 }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.4),
      length: Math.random() * 80 + 40,
      speed: Math.random() * 8 + 6,
      opacity: 0,
      active: false,
      timer: Math.random() * 300
    }));

    let gridOffset = 0;
    let waveOffset = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      gridOffset = (gridOffset + 0.9) % 50;
      waveOffset += 0.02;

      const isMatrix = currentTheme.includes('matrix');
      const isLava = currentTheme.includes('lava') || currentTheme.includes('magma');
      const isSupernova = currentTheme.includes('supernova') || currentTheme.includes('solar');
      const isGlacier = currentTheme.includes('glacier');
      const isGold = currentTheme.includes('gold') || currentTheme.includes('obsidian');
      const isPlasma = currentTheme.includes('plasma') || currentTheme.includes('toxic');
      const isSynthwave = currentTheme.includes('vapor') || currentTheme.includes('synthwave') || currentTheme.includes('sunset');

      if (isMatrix) {
        // Deep Matrix Rain
        ctx.fillStyle = 'rgba(2, 6, 12, 0.92)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = '13px monospace';
        particles.forEach((p) => {
          ctx.fillStyle = `rgba(34, 197, 94, ${p.opacity})`;
          ctx.fillText(p.char, p.x, p.y);
          p.y += 2.5 + p.size;
          if (p.y > height) {
            p.y = 0;
            p.x = Math.random() * width;
          }
        });
      } else if (isLava) {
        // Crimson Abyss / Magma
        const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width * 0.9);
        bgGrad.addColorStop(0, '#38040e');
        bgGrad.addColorStop(0.7, '#1a0208');
        bgGrad.addColorStop(1, '#050002');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p) => {
          ctx.fillStyle = '#f43f5e';
          ctx.globalAlpha = p.opacity * 0.75;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.4, 0, Math.PI * 2);
          ctx.fill();

          p.y -= 1.2;
          p.x += Math.sin(p.y * 0.02 + waveOffset);
          if (p.y < 0) p.y = height;
        });
        ctx.globalAlpha = 1;
      } else if (isSupernova) {
        // Solar Supernova
        const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 60, width / 2, height / 2, width * 0.85);
        bgGrad.addColorStop(0, '#451a03');
        bgGrad.addColorStop(0.6, '#1c0a02');
        bgGrad.addColorStop(1, '#050201');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p) => {
          ctx.fillStyle = '#f59e0b';
          ctx.globalAlpha = p.opacity * 0.8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.6, 0, Math.PI * 2);
          ctx.fill();

          p.y -= 1.4;
          p.x += Math.cos(p.y * 0.02 + waveOffset) * 0.8;
          if (p.y < 0) p.y = height;
        });
        ctx.globalAlpha = 1;
      } else if (isGlacier) {
        // Glacier Éternel
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#031b29');
        bgGrad.addColorStop(0.5, '#021019');
        bgGrad.addColorStop(1, '#01050a');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p) => {
          ctx.fillStyle = '#38bdf8';
          ctx.globalAlpha = p.opacity * 0.7;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.y += 0.7;
          p.x += Math.cos(p.y * 0.015) * 0.4;
          if (p.y > height) p.y = 0;
        });
        ctx.globalAlpha = 1;
      } else if (isGold) {
        // Royal Obsidian Gold
        const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width * 0.8);
        bgGrad.addColorStop(0, '#281c03');
        bgGrad.addColorStop(0.6, '#120d01');
        bgGrad.addColorStop(1, '#030200');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p) => {
          ctx.fillStyle = '#facc15';
          ctx.globalAlpha = p.opacity * 0.85;
          ctx.fillRect(p.x, p.y, p.size * 1.8, p.size * 1.8);

          p.y -= 0.8;
          if (p.y < 0) p.y = height;
        });
        ctx.globalAlpha = 1;
      } else if (isPlasma) {
        // Toxic Plasma
        const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width);
        bgGrad.addColorStop(0, '#192e03');
        bgGrad.addColorStop(0.6, '#0b1401');
        bgGrad.addColorStop(1, '#020500');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p) => {
          ctx.fillStyle = '#a3e635';
          ctx.globalAlpha = p.opacity * 0.8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
          ctx.fill();

          p.y -= 1.1;
          p.x += Math.sin(p.y * 0.03 + waveOffset);
          if (p.y < 0) p.y = height;
        });
        ctx.globalAlpha = 1;
      } else if (isSynthwave) {
        // Synthwave Sunset / Vaporwave
        ctx.fillStyle = '#0a0314';
        ctx.fillRect(0, 0, width, height);

        const horizonY = height * 0.54;

        // Giant Retro Sun
        const sunRadius = Math.min(width, height) * 0.18;
        const sunY = horizonY - sunRadius * 0.25;
        const sunGrad = ctx.createLinearGradient(0, sunY - sunRadius, 0, sunY + sunRadius);
        sunGrad.addColorStop(0, '#facc15');
        sunGrad.addColorStop(0.5, '#f43f5e');
        sunGrad.addColorStop(1, '#831843');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(width / 2, sunY, sunRadius, 0, Math.PI * 2);
        ctx.fill();

        // Horizontal sun cuts
        for (let cut = 0; cut < 6; cut++) {
          const cutY = sunY + cut * (sunRadius / 4.5);
          const cutHeight = 2 + cut * 2;
          ctx.fillStyle = '#0a0314';
          ctx.fillRect(width / 2 - sunRadius - 10, cutY, (sunRadius + 10) * 2, cutHeight);
        }

        // Horizon Glow
        const glow = ctx.createRadialGradient(width / 2, horizonY, 20, width / 2, horizonY, width * 0.65);
        glow.addColorStop(0, 'rgba(236, 72, 153, 0.4)');
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, horizonY - 120, width, 240);

        // Perspective Grid Lines
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.35)';
        ctx.lineWidth = 1.2;
        const vanishingX = width / 2;

        for (let i = -16; i <= 16; i++) {
          ctx.beginPath();
          ctx.moveTo(vanishingX, horizonY);
          ctx.lineTo(vanishingX + i * (width / 14), height);
          ctx.stroke();
        }

        for (let y = horizonY; y < height; y += (y - horizonY) * 0.13 + 2.5) {
          const lineY = y + (gridOffset * (y - horizonY)) / 380;
          if (lineY > horizonY && lineY < height) {
            ctx.beginPath();
            ctx.moveTo(0, lineY);
            ctx.lineTo(width, lineY);
            ctx.stroke();
          }
        }

        particles.forEach((p) => {
          ctx.fillStyle = '#ec4899';
          ctx.globalAlpha = p.opacity * 0.8;
          ctx.fillRect(p.x, p.y, p.size, p.size);
          p.y -= 0.6;
          if (p.y < 0) p.y = height;
        });
        ctx.globalAlpha = 1;
      } else {
        // Cyber Neon 2099 / Quantum Void Default
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, width, height);

        const horizonY = height * 0.55;

        // Ambient Horizon Glow
        const glow = ctx.createRadialGradient(width / 2, horizonY, 20, width / 2, horizonY, width * 0.6);
        glow.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, horizonY - 140, width, 280);

        // Cyber Grid Lines
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.28)';
        ctx.lineWidth = 1;
        const vanishingX = width / 2;

        for (let i = -16; i <= 16; i++) {
          ctx.beginPath();
          ctx.moveTo(vanishingX, horizonY);
          ctx.lineTo(vanishingX + i * (width / 14), height);
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

        // Animated Cyber Floating Particles & Stars
        particles.forEach((p) => {
          p.pulse += 0.03;
          const currentSize = p.size + Math.sin(p.pulse) * 0.5;
          ctx.fillStyle = p.size > 2 ? '#38bdf8' : '#06b6d4';
          ctx.globalAlpha = p.opacity * (0.6 + Math.sin(p.pulse) * 0.3);
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.5, currentSize), 0, Math.PI * 2);
          ctx.fill();

          p.y -= 0.5;
          if (p.y < 0) p.y = height;
        });
        ctx.globalAlpha = 1;

        // Occasional Shooting Star
        meteors.forEach((m) => {
          m.timer--;
          if (m.timer <= 0 && !m.active) {
            m.active = true;
            m.x = Math.random() * (width * 0.8);
            m.y = Math.random() * (height * 0.35);
            m.opacity = 1;
          }

          if (m.active) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${m.opacity})`;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(m.x, m.y);
            ctx.lineTo(m.x + m.length, m.y + m.length * 0.4);
            ctx.stroke();

            m.x += m.speed;
            m.y += m.speed * 0.4;
            m.opacity -= 0.02;

            if (m.opacity <= 0 || m.x > width || m.y > height) {
              m.active = false;
              m.timer = Math.random() * 400 + 200;
            }
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentTheme, particleDensity, glowIntensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};
