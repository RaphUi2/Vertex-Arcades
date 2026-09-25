import React from 'react';

interface IllustrationProps {
  gameId: string;
  className?: string;
}

export function GameCardIllustration({ gameId, className = 'w-full h-44' }: IllustrationProps) {
  switch (gameId) {
    case 'quantum_obby':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900 via-slate-900 to-blue-950 flex items-center justify-center ${className}`}>
          {/* Laser platforms vector art */}
          <svg className="w-full h-full" viewBox="0 0 300 160" fill="none" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="q_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            {/* Grid floor */}
            <path d="M0 160 L120 90 L180 90 L300 160 Z" fill="#0f172a" opacity="0.8" />
            {/* Neon Platforms */}
            <rect x="30" y="110" width="60" height="12" rx="4" fill="#06b6d4" filter="drop-shadow(0 0 8px #06b6d4)" />
            <rect x="120" y="85" width="70" height="12" rx="4" fill="#3b82f6" filter="drop-shadow(0 0 8px #3b82f6)" />
            <rect x="210" y="60" width="65" height="12" rx="4" fill="#06b6d4" filter="drop-shadow(0 0 8px #06b6d4)" />
            {/* Red Laser Beams */}
            <line x1="100" y1="20" x2="100" y2="140" stroke="#ef4444" strokeWidth="3" filter="drop-shadow(0 0 6px #ef4444)" />
            {/* Cyber Runner silhouette jumping */}
            <rect x="145" y="55" width="14" height="20" rx="3" fill="#fde047" />
            <circle cx="152" cy="46" r="6" fill="#fde047" />
            {/* Checkpoint portal */}
            <ellipse cx="250" cy="45" rx="14" ry="24" fill="#8b5cf6" opacity="0.6" filter="drop-shadow(0 0 10px #8b5cf6)" />
          </svg>
          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-cyan-500/80 backdrop-blur-md text-[10px] font-black text-slate-950 font-mono">
            OBBY SPEED
          </div>
        </div>
      );

    case 'aetheria_void':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 300 160" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Dark Void Portal */}
            <circle cx="150" cy="80" r="55" fill="#581c87" opacity="0.6" filter="drop-shadow(0 0 20px #a855f7)" />
            {/* Katana Slash Light Wave */}
            <path d="M40 140 Q 150 20 270 90" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" filter="drop-shadow(0 0 12px #38bdf8)" />
            <path d="M60 150 Q 150 50 250 110" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            {/* Ninja Silhouette with Glowing Katana */}
            <circle cx="130" cy="75" r="9" fill="#0f172a" />
            <path d="M122 84 L138 84 L142 120 L118 120 Z" fill="#0f172a" />
            <line x1="135" y1="80" x2="200" y2="40" stroke="#e879f9" strokeWidth="4" filter="drop-shadow(0 0 8px #e879f9)" />
          </svg>
          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-purple-500/80 backdrop-blur-md text-[10px] font-black text-white font-mono">
            REFLEX SLASH
          </div>
        </div>
      );

    case 'titan_core':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-950 via-slate-900 to-orange-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 300 160" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Colossal Mech Chassis */}
            <rect x="110" y="45" width="80" height="75" rx="12" fill="#e11d48" stroke="#fca5a5" strokeWidth="3" />
            <circle cx="150" cy="72" r="14" fill="#38bdf8" filter="drop-shadow(0 0 12px #38bdf8)" />
            {/* Dual Gatling Cannons */}
            <rect x="75" y="60" width="35" height="12" rx="4" fill="#475569" />
            <rect x="190" y="60" width="35" height="12" rx="4" fill="#475569" />
            {/* Muzzle flash lasers */}
            <line x1="60" y1="66" x2="10" y2="66" stroke="#fbbf24" strokeWidth="4" filter="drop-shadow(0 0 8px #fbbf24)" />
            <line x1="230" y1="66" x2="280" y2="66" stroke="#fbbf24" strokeWidth="4" filter="drop-shadow(0 0 8px #fbbf24)" />
          </svg>
          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-red-500/80 backdrop-blur-md text-[10px] font-black text-white font-mono">
            CLASSÉ APEX 🏆
          </div>
        </div>
      );

    case 'cyber_heist':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950 via-slate-900 to-yellow-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 300 160" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Vault Door */}
            <circle cx="150" cy="80" r="50" fill="#1e293b" stroke="#f59e0b" strokeWidth="6" />
            <circle cx="150" cy="80" r="30" fill="#0f172a" stroke="#fbbf24" strokeWidth="3" />
            {/* Rotating Red Security Lasers */}
            <line x1="30" y1="40" x2="270" y2="120" stroke="#ef4444" strokeWidth="3" filter="drop-shadow(0 0 8px #ef4444)" />
            <line x1="30" y1="120" x2="270" y2="40" stroke="#ef4444" strokeWidth="3" filter="drop-shadow(0 0 8px #ef4444)" />
            {/* Golden V-Coins Sacks */}
            <circle cx="140" cy="80" r="8" fill="#eab308" />
            <circle cx="160" cy="80" r="8" fill="#facc15" />
          </svg>
          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-amber-500/90 backdrop-blur-md text-[10px] font-black text-slate-950 font-mono">
            VIP 150 VC 💎
          </div>
        </div>
      );

    case 'hyper_drift':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-950 via-slate-900 to-pink-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 300 160" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Neon Highway Lines */}
            <path d="M50 160 L120 40 L180 40 L250 160 Z" fill="#0f172a" />
            <line x1="150" y1="40" x2="150" y2="160" stroke="#e879f9" strokeWidth="3" strokeDasharray="12 12" />
            {/* Drift Car Sideways with Smoke */}
            <rect x="120" y="85" width="60" height="32" rx="6" fill="#ec4899" transform="rotate(-15 150 100)" stroke="#f472b6" strokeWidth="2" />
            <circle cx="105" cy="115" r="14" fill="#d946ef" opacity="0.6" filter="drop-shadow(0 0 10px #d946ef)" />
            <circle cx="185" cy="118" r="16" fill="#d946ef" opacity="0.6" filter="drop-shadow(0 0 10px #d946ef)" />
          </svg>
          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-pink-500/90 backdrop-blur-md text-[10px] font-black text-white font-mono">
            VIP 250 VC 💎
          </div>
        </div>
      );

    case 'robo_tycoon':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-950 via-slate-900 to-amber-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 300 160" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Conveyor Belt & Dropper */}
            <rect x="30" y="90" width="240" height="24" rx="6" fill="#334155" stroke="#f97316" strokeWidth="2" />
            <rect x="40" y="25" width="50" height="50" rx="8" fill="#ea580c" />
            {/* Golden Mineral cubes */}
            <rect x="110" y="80" width="16" height="16" rx="4" fill="#fbbf24" filter="drop-shadow(0 0 6px #fbbf24)" />
            <rect x="170" y="80" width="16" height="16" rx="4" fill="#fbbf24" filter="drop-shadow(0 0 6px #fbbf24)" />
            {/* Plasma Smelter */}
            <rect x="220" y="35" width="50" height="70" rx="8" fill="#c2410c" />
            <circle cx="245" cy="65" r="12" fill="#fde047" filter="drop-shadow(0 0 8px #fde047)" />
          </svg>
          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-orange-500/90 backdrop-blur-md text-[10px] font-black text-slate-950 font-mono">
            TYCOON 🏭
          </div>
        </div>
      );

    default:
      // Generic high-detail retro-cyber scene
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 300 160" fill="none" preserveAspectRatio="xMidYMid slice">
            <circle cx="150" cy="80" r="50" fill="#06b6d4" opacity="0.25" filter="drop-shadow(0 0 20px #06b6d4)" />
            <polygon points="150,30 200,120 100,120" stroke="#38bdf8" strokeWidth="3" fill="none" />
            <circle cx="150" cy="80" r="10" fill="#facc15" />
          </svg>
          <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-cyan-500/80 backdrop-blur-md text-[10px] font-black text-slate-950 font-mono">
            ARCADE 3.0
          </div>
        </div>
      );
  }
}
