import React from 'react';
import {
  Zap, Crown, Gamepad2, Rocket, Headphones, Crosshair, Terminal, Ghost, Skull, Globe,
  Trophy, Sparkles, Flame, Shield, Sword, User
} from 'lucide-react';
import { AURA_COSMETICS, FRAME_BORDERS_SHOP } from '../gamesData';

interface UserProfileAvatarProps {
  avatarIcon?: string;
  avatarColor?: string;
  activeFrame?: string;
  activeAura?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

export const UserProfileAvatar: React.FC<UserProfileAvatarProps> = ({
  avatarIcon = 'Zap',
  avatarColor = '#06b6d4',
  activeFrame = 'none',
  activeAura = 'none',
  size = 'md',
  onClick
}) => {
  // Size dimensions
  const sizeMap = {
    sm: { container: 'w-8 h-8', iconSize: 14, framePad: 'p-0.5' },
    md: { container: 'w-11 h-11', iconSize: 20, framePad: 'p-1' },
    lg: { container: 'w-16 h-16', iconSize: 28, framePad: 'p-1.5' },
    xl: { container: 'w-24 h-24', iconSize: 42, framePad: 'p-2' },
  };

  const currentSize = sizeMap[size];

  // Lookup Aura
  const auraItem = AURA_COSMETICS.find(a => a.id === activeAura);
  const auraGlowClass = auraItem?.glowClass || '';

  // Frame Border Styling based on frame ID or index
  let frameBorderClass = 'border-2 border-slate-700';
  if (activeFrame && activeFrame !== 'none') {
    const frameIndex = parseInt(activeFrame.replace('frame_', ''), 10);
    if (!isNaN(frameIndex)) {
      if (frameIndex % 6 === 0) frameBorderClass = 'border-2 border-cyan-400 shadow-[0_0_15px_#06b6d4] ring-2 ring-cyan-400/50';
      else if (frameIndex % 6 === 1) frameBorderClass = 'border-2 border-amber-400 shadow-[0_0_15px_#facc15] ring-2 ring-amber-400/50';
      else if (frameIndex % 6 === 2) frameBorderClass = 'border-2 border-fuchsia-400 shadow-[0_0_15px_#d946ef] ring-2 ring-fuchsia-400/50';
      else if (frameIndex % 6 === 3) frameBorderClass = 'border-2 border-emerald-400 shadow-[0_0_15px_#34d399] ring-2 ring-emerald-400/50';
      else if (frameIndex % 6 === 4) frameBorderClass = 'border-2 border-rose-500 shadow-[0_0_15px_#f43f5e] ring-2 ring-rose-400/50';
      else frameBorderClass = 'border-2 border-purple-400 shadow-[0_0_15px_#a855f7] ring-2 ring-purple-400/50';
    } else {
      frameBorderClass = 'border-2 border-purple-500 shadow-[0_0_15px_#a855f7]';
    }
  }

  // Render Icon
  const renderIcon = () => {
    const iconProps = { size: currentSize.iconSize, className: 'text-white drop-shadow-md' };
    switch (avatarIcon) {
      case 'Zap': return <Zap {...iconProps} />;
      case 'Crown': return <Crown {...iconProps} />;
      case 'Gamepad2': return <Gamepad2 {...iconProps} />;
      case 'Rocket': return <Rocket {...iconProps} />;
      case 'Headphones': return <Headphones {...iconProps} />;
      case 'Crosshair': return <Crosshair {...iconProps} />;
      case 'Terminal': return <Terminal {...iconProps} />;
      case 'Ghost': return <Ghost {...iconProps} />;
      case 'Skull': return <Skull {...iconProps} />;
      case 'Globe': return <Globe {...iconProps} />;
      case 'Trophy': return <Trophy {...iconProps} />;
      case 'Sparkles': return <Sparkles {...iconProps} />;
      case 'Flame': return <Flame {...iconProps} />;
      case 'Shield': return <Shield {...iconProps} />;
      case 'Sword': return <Sword {...iconProps} />;
      default: return <User {...iconProps} />;
    }
  };

  // Convert color name or hex
  let bgStyleHex = avatarColor;
  if (avatarColor === 'cyan') bgStyleHex = '#06b6d4';
  if (avatarColor === 'purple') bgStyleHex = '#a855f7';
  if (avatarColor === 'emerald') bgStyleHex = '#10b981';
  if (avatarColor === 'yellow') bgStyleHex = '#eab308';
  if (avatarColor === 'rose') bgStyleHex = '#f43f5e';

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-2xl transition-transform hover:scale-105 ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Outer Aura Glow Ring */}
      <div className={`rounded-2xl ${currentSize.framePad} ${frameBorderClass} ${auraGlowClass} transition-all duration-300`}>
        {/* Inner Avatar Box */}
        <div
          className={`${currentSize.container} rounded-xl flex items-center justify-center shadow-inner relative overflow-hidden`}
          style={{ backgroundColor: bgStyleHex || '#06b6d4' }}
        >
          {/* Subtle Shine Reflection Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/20 pointer-events-none" />
          {renderIcon()}
        </div>
      </div>
    </div>
  );
};
