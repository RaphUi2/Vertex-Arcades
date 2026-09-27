import React from 'react';

interface IllustrationProps {
  gameId: string;
  className?: string;
}

export function GameCardIllustration({ gameId, className = 'w-full h-44' }: IllustrationProps) {
  switch (gameId) {
    case 'quantum_obby':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-950 via-slate-950 to-blue-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="q_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <radialGradient id="q_sun" cx="50%" cy="30%" r="50%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <rect width="320" height="180" fill="url(#q_sun)" />
            {/* Horizon Grid */}
            <path d="M0 180 L130 90 L190 90 L320 180 Z" fill="#091122" opacity="0.9" />
            <line x1="0" y1="180" x2="130" y2="90" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" />
            <line x1="320" y1="180" x2="190" y2="90" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" />
            {/* Floating Neon Platforms */}
            <rect x="25" y="125" width="70" height="14" rx="4" fill="#06b6d4" filter="drop-shadow(0 0 12px #06b6d4)" />
            <rect x="125" y="95" width="80" height="14" rx="4" fill="#3b82f6" filter="drop-shadow(0 0 12px #3b82f6)" />
            <rect x="225" y="65" width="70" height="14" rx="4" fill="#06b6d4" filter="drop-shadow(0 0 12px #06b6d4)" />
            {/* Vertical Laser Hazards */}
            <line x1="105" y1="20" x2="105" y2="155" stroke="#ef4444" strokeWidth="3.5" filter="drop-shadow(0 0 10px #ef4444)" />
            <line x1="215" y1="10" x2="215" y2="140" stroke="#ef4444" strokeWidth="3.5" filter="drop-shadow(0 0 10px #ef4444)" />
            {/* Cyber Jumper in Action */}
            <circle cx="160" cy="52" r="7" fill="#fde047" filter="drop-shadow(0 0 8px #fde047)" />
            <rect x="153" y="62" width="14" height="22" rx="3" fill="#fde047" />
            <path d="M150 84 L144 98 M170 84 L176 98" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
            {/* Portal Gate */}
            <ellipse cx="265" cy="50" rx="16" ry="28" fill="#8b5cf6" opacity="0.75" filter="drop-shadow(0 0 16px #8b5cf6)" />
          </svg>
        </div>
      );

    case 'aetheria_void':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-950 via-slate-950 to-indigo-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            <circle cx="160" cy="90" r="65" fill="#581c87" opacity="0.5" filter="drop-shadow(0 0 30px #a855f7)" />
            {/* Crescent Moon */}
            <path d="M250 30 A 30 30 0 0 0 230 80 A 35 35 0 0 1 250 30 Z" fill="#e879f9" opacity="0.8" filter="drop-shadow(0 0 15px #e879f9)" />
            {/* Dual Katana Neon Arc Slashes */}
            <path d="M30 150 Q 160 15 290 95" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" filter="drop-shadow(0 0 16px #38bdf8)" />
            <path d="M50 165 Q 160 45 270 120" stroke="#c084fc" strokeWidth="4" strokeLinecap="round" opacity="0.85" filter="drop-shadow(0 0 12px #c084fc)" />
            {/* Ninja Silhouette with Scarf */}
            <circle cx="140" cy="85" r="10" fill="#0f172a" />
            <path d="M132 95 L148 95 L152 135 L128 135 Z" fill="#0f172a" />
            <path d="M145 92 Q 185 85 205 105" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" filter="drop-shadow(0 0 8px #f43f5e)" />
            <line x1="145" y1="90" x2="220" y2="40" stroke="#e879f9" strokeWidth="5" strokeLinecap="round" filter="drop-shadow(0 0 12px #e879f9)" />
          </svg>
        </div>
      );

    case 'titan_core':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-950 via-slate-950 to-orange-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Colossal Mech Chassis */}
            <rect x="115" y="45" width="90" height="85" rx="14" fill="#e11d48" stroke="#fca5a5" strokeWidth="3" filter="drop-shadow(0 0 20px rgba(225,29,72,0.6))" />
            <circle cx="160" cy="78" r="18" fill="#38bdf8" filter="drop-shadow(0 0 18px #38bdf8)" />
            {/* Gatling Cannons & Lasers */}
            <rect x="75" y="65" width="40" height="15" rx="5" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="205" y="65" width="40" height="15" rx="5" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="75" y1="72" x2="10" y2="72" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" filter="drop-shadow(0 0 10px #fbbf24)" />
            <line x1="245" y1="72" x2="310" y2="72" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" filter="drop-shadow(0 0 10px #fbbf24)" />
            {/* Heavy Shoulders */}
            <polygon points="105,45 80,75 115,75" fill="#be123c" />
            <polygon points="215,45 240,75 205,75" fill="#be123c" />
          </svg>
        </div>
      );

    case 'cyber_heist':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950 via-slate-950 to-yellow-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Vault Door Inset */}
            <circle cx="160" cy="90" r="60" fill="#1e293b" stroke="#f59e0b" strokeWidth="7" filter="drop-shadow(0 0 20px rgba(245,158,11,0.5))" />
            <circle cx="160" cy="90" r="35" fill="#0f172a" stroke="#fbbf24" strokeWidth="4" />
            <rect x="154" y="65" width="12" height="50" rx="3" fill="#f59e0b" />
            <rect x="135" y="84" width="50" height="12" rx="3" fill="#f59e0b" />
            {/* Laser Tripwires */}
            <line x1="20" y1="35" x2="300" y2="145" stroke="#ef4444" strokeWidth="3" filter="drop-shadow(0 0 10px #ef4444)" />
            <line x1="20" y1="145" x2="300" y2="35" stroke="#ef4444" strokeWidth="3" filter="drop-shadow(0 0 10px #ef4444)" />
            {/* Sparkles */}
            <circle cx="140" cy="85" r="9" fill="#facc15" filter="drop-shadow(0 0 10px #facc15)" />
            <circle cx="180" cy="95" r="9" fill="#facc15" filter="drop-shadow(0 0 10px #facc15)" />
          </svg>
        </div>
      );

    case 'nebula_strike':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-950 to-cyan-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Alien Mothership */}
            <polygon points="160,25 210,55 110,55" fill="#06b6d4" stroke="#22d3ee" strokeWidth="2" filter="drop-shadow(0 0 15px #06b6d4)" />
            <circle cx="160" cy="45" r="8" fill="#f43f5e" />
            {/* Alien Swarm */}
            <rect x="60" y="70" width="24" height="16" rx="4" fill="#a855f7" filter="drop-shadow(0 0 8px #a855f7)" />
            <rect x="110" y="70" width="24" height="16" rx="4" fill="#a855f7" filter="drop-shadow(0 0 8px #a855f7)" />
            <rect x="186" y="70" width="24" height="16" rx="4" fill="#a855f7" filter="drop-shadow(0 0 8px #a855f7)" />
            <rect x="236" y="70" width="24" height="16" rx="4" fill="#a855f7" filter="drop-shadow(0 0 8px #a855f7)" />
            {/* Player Defender Spacecraft */}
            <polygon points="160,125 180,165 140,165" fill="#38bdf8" stroke="#7dd3fc" strokeWidth="2" filter="drop-shadow(0 0 15px #38bdf8)" />
            {/* Dual Missiles */}
            <line x1="150" y1="120" x2="150" y2="85" stroke="#facc15" strokeWidth="3.5" strokeLinecap="round" filter="drop-shadow(0 0 8px #facc15)" />
            <line x1="170" y1="120" x2="170" y2="85" stroke="#facc15" strokeWidth="3.5" strokeLinecap="round" filter="drop-shadow(0 0 8px #facc15)" />
          </svg>
        </div>
      );

    case 'chrono_shift':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Quantum Clockwork Gears */}
            <circle cx="160" cy="90" r="55" stroke="#14b8a6" strokeWidth="5" strokeDasharray="12 8" fill="none" filter="drop-shadow(0 0 15px #14b8a6)" />
            <circle cx="160" cy="90" r="35" stroke="#2dd4bf" strokeWidth="3" fill="none" />
            <circle cx="160" cy="90" r="8" fill="#5eead4" />
            {/* Clock Hands */}
            <line x1="160" y1="90" x2="160" y2="48" stroke="#fde047" strokeWidth="4" strokeLinecap="round" filter="drop-shadow(0 0 8px #fde047)" />
            <line x1="160" y1="90" x2="195" y2="105" stroke="#fde047" strokeWidth="3.5" strokeLinecap="round" />
            {/* Hourglass Aura */}
            <path d="M120 40 L200 40 L160 90 L200 140 L120 140 L160 90 Z" stroke="#0d9488" strokeWidth="2" fill="none" opacity="0.4" />
          </svg>
        </div>
      );

    case 'robo_tycoon':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-950 via-slate-950 to-amber-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Conveyor Belt System */}
            <rect x="25" y="105" width="270" height="26" rx="6" fill="#334155" stroke="#f97316" strokeWidth="2.5" />
            <line x1="40" y1="118" x2="280" y2="118" stroke="#fbbf24" strokeWidth="3" strokeDasharray="8 8" />
            {/* Dropper Extractor */}
            <rect x="45" y="30" width="55" height="55" rx="10" fill="#ea580c" stroke="#fed7aa" strokeWidth="2" />
            {/* Golden Mineral Cubes */}
            <rect x="125" y="93" width="18" height="18" rx="4" fill="#fbbf24" filter="drop-shadow(0 0 8px #fbbf24)" />
            <rect x="190" y="93" width="18" height="18" rx="4" fill="#fbbf24" filter="drop-shadow(0 0 8px #fbbf24)" />
            {/* Plasma Smelter Furnace */}
            <rect x="235" y="40" width="60" height="80" rx="10" fill="#c2410c" stroke="#f97316" strokeWidth="2" />
            <circle cx="265" cy="75" r="14" fill="#fde047" filter="drop-shadow(0 0 12px #fde047)" />
          </svg>
        </div>
      );

    case 'shadow_dungeon':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-950 via-slate-950 to-stone-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Dungeon Archway */}
            <path d="M70 180 L70 90 Q 160 20 250 90 L250 180 Z" fill="#1c1917" stroke="#78716c" strokeWidth="3" />
            {/* Torch Flames */}
            <circle cx="85" cy="95" r="7" fill="#f97316" filter="drop-shadow(0 0 10px #f97316)" />
            <circle cx="235" cy="95" r="7" fill="#f97316" filter="drop-shadow(0 0 10px #f97316)" />
            {/* Glowing Red Eyes in Darkness */}
            <circle cx="150" cy="110" r="4" fill="#ef4444" filter="drop-shadow(0 0 6px #ef4444)" />
            <circle cx="170" cy="110" r="4" fill="#ef4444" filter="drop-shadow(0 0 6px #ef4444)" />
            {/* Loot Chest */}
            <rect x="135" y="140" width="50" height="30" rx="4" fill="#d97706" stroke="#fde047" strokeWidth="2" />
            <circle cx="160" cy="155" r="4" fill="#fde047" />
          </svg>
        </div>
      );

    case 'hyper_drift':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-950 via-slate-950 to-pink-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Neon Synthwave Grid Floor */}
            <path d="M40 180 L130 50 L190 50 L280 180 Z" fill="#090616" />
            <line x1="160" y1="50" x2="160" y2="180" stroke="#e879f9" strokeWidth="3.5" strokeDasharray="14 14" />
            {/* Drift Car Angled with Tire Smoke */}
            <rect x="125" y="95" width="70" height="36" rx="8" fill="#ec4899" transform="rotate(-14 160 110)" stroke="#f472b6" strokeWidth="2.5" />
            <circle cx="110" cy="130" r="16" fill="#d946ef" opacity="0.6" filter="drop-shadow(0 0 12px #d946ef)" />
            <circle cx="205" cy="132" r="18" fill="#d946ef" opacity="0.6" filter="drop-shadow(0 0 12px #d946ef)" />
            {/* Headlights beams */}
            <polygon points="120,95 20,80 40,140" fill="#fde047" opacity="0.35" filter="drop-shadow(0 0 15px #fde047)" />
          </svg>
        </div>
      );

    case 'pixel_forge':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-950 to-lime-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Floating Island with Voxel Blocks */}
            <rect x="60" y="110" width="200" height="40" rx="6" fill="#65a30d" stroke="#a3e635" strokeWidth="2" />
            <rect x="80" y="80" width="30" height="30" fill="#84cc16" stroke="#bef264" strokeWidth="2" />
            <rect x="110" y="70" width="30" height="40" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
            <rect x="140" y="55" width="40" height="55" fill="#e11d48" stroke="#f43f5e" strokeWidth="2" />
            <rect x="180" y="75" width="35" height="35" fill="#f59e0b" stroke="#fde047" strokeWidth="2" />
            {/* Golden Pickaxe */}
            <line x1="220" y1="40" x2="250" y2="85" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
            <polygon points="210,35 240,30 230,55" fill="#fbbf24" stroke="#fde047" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'gravity_surge':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-950 via-slate-950 to-indigo-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Ceiling and Floor Spikes */}
            <polygon points="40,0 60,30 80,0 100,30 120,0 140,30 160,0 180,30 200,0 220,30 240,0 260,30 280,0" fill="#38bdf8" filter="drop-shadow(0 0 10px #38bdf8)" />
            <polygon points="40,180 60,150 80,180 100,150 120,180 140,150 160,180 180,150 200,180 220,150 240,180 260,150 280,180" fill="#38bdf8" filter="drop-shadow(0 0 10px #38bdf8)" />
            {/* Gravity Inversion Cube */}
            <rect x="145" y="75" width="30" height="30" rx="6" fill="#0284c7" stroke="#38bdf8" strokeWidth="3" filter="drop-shadow(0 0 15px #38bdf8)" />
            <polygon points="160,82 152,95 168,95" fill="#facc15" />
          </svg>
        </div>
      );

    case 'synth_rider':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-950 via-slate-950 to-rose-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Beat Highway Rails */}
            <line x1="30" y1="180" x2="160" y2="30" stroke="#f43f5e" strokeWidth="4" />
            <line x1="290" y1="180" x2="160" y2="30" stroke="#06b6d4" strokeWidth="4" />
            {/* Rhythm Target Orbs */}
            <circle cx="105" cy="115" r="16" fill="#f43f5e" filter="drop-shadow(0 0 15px #f43f5e)" />
            <circle cx="215" cy="115" r="16" fill="#06b6d4" filter="drop-shadow(0 0 15px #06b6d4)" />
            <circle cx="160" cy="70" r="12" fill="#fbbf24" filter="drop-shadow(0 0 12px #fbbf24)" />
          </svg>
        </div>
      );

    case 'biohazard_defense':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-950 via-slate-950 to-emerald-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Biohazard Symbol Glow */}
            <circle cx="160" cy="90" r="45" stroke="#22c55e" strokeWidth="4" fill="none" filter="drop-shadow(0 0 15px #22c55e)" />
            <polygon points="160,50 175,80 145,80" fill="#22c55e" />
            <circle cx="160" cy="90" r="12" fill="#86efac" />
            {/* Plasma Defensive Turret */}
            <rect x="60" y="130" width="40" height="30" rx="6" fill="#15803d" />
            <line x1="100" y1="140" x2="150" y2="120" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" filter="drop-shadow(0 0 8px #4ade80)" />
          </svg>
        </div>
      );

    case 'skybound_wings':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-950 via-slate-950 to-blue-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Clouds */}
            <ellipse cx="80" cy="130" rx="50" ry="20" fill="#38bdf8" opacity="0.3" />
            <ellipse cx="240" cy="140" rx="60" ry="25" fill="#38bdf8" opacity="0.3" />
            {/* Jet Glider Wings */}
            <polygon points="160,50 240,110 180,105 160,95 140,105 80,110" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" filter="drop-shadow(0 0 15px #38bdf8)" />
            <circle cx="160" cy="75" r="8" fill="#fde047" />
          </svg>
        </div>
      );

    case 'glitch_hunter':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-950 via-slate-950 to-cyan-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Glitch Shift Blocks */}
            <rect x="70" y="50" width="80" height="30" fill="#14b8a6" opacity="0.8" filter="drop-shadow(-4 0 0 #f43f5e)" />
            <rect x="170" y="80" width="80" height="30" fill="#06b6d4" opacity="0.8" filter="drop-shadow(4 0 0 #3b82f6)" />
            <text x="160" y="100" fill="#ffffff" fontFamily="monospace" fontWeight="900" fontSize="24" textAnchor="middle">
              0101_GLITCH
            </text>
          </svg>
        </div>
      );

    case 'cosmic_miner':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-950 via-slate-950 to-blue-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Asteroid Surface */}
            <circle cx="160" cy="210" r="140" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="3" />
            {/* Drill Laser Miner Rig */}
            <rect x="140" y="45" width="40" height="55" rx="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="3" filter="drop-shadow(0 0 15px #38bdf8)" />
            <polygon points="160,120 148,100 172,100" fill="#f59e0b" filter="drop-shadow(0 0 10px #f59e0b)" />
            {/* Extracted Crystals */}
            <rect x="70" y="75" width="26" height="26" rx="4" fill="#fbbf24" filter="drop-shadow(0 0 10px #fbbf24)" />
            <rect x="220" y="55" width="30" height="30" rx="6" fill="#38bdf8" filter="drop-shadow(0 0 12px #38bdf8)" />
          </svg>
        </div>
      );

    case 'shadow_shinobi':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-950 via-slate-950 to-pink-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Rooftop Pagoda & Blood Moon */}
            <rect x="0" y="120" width="320" height="60" fill="#0f172a" />
            <line x1="0" y1="120" x2="320" y2="120" stroke="#c084fc" strokeWidth="3.5" />
            <circle cx="160" cy="55" r="40" fill="#f43f5e" opacity="0.45" filter="drop-shadow(0 0 30px #f43f5e)" />
            {/* Shuriken Swarm */}
            <path d="M100 105 Q 160 40 230 85" stroke="#e879f9" strokeWidth="5" strokeLinecap="round" filter="drop-shadow(0 0 12px #e879f9)" />
            <polygon points="80,50 85,60 95,60 87,68 90,78 80,72 70,78 73,68 65,60 75,60" fill="#c084fc" />
            <polygon points="240,40 245,50 255,50 247,58 250,68 240,62 230,68 233,58 225,50 235,50" fill="#c084fc" />
          </svg>
        </div>
      );

    case 'speed_runners_2099':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-950 via-slate-950 to-indigo-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Magnetic Track */}
            <polygon points="160,40 20,180 300,180" fill="#0c4a6e" opacity="0.7" />
            <line x1="160" y1="40" x2="160" y2="180" stroke="#38bdf8" strokeWidth="4" strokeDasharray="8 8" />
            {/* Speedrunner Silhouette */}
            <polygon points="160,115 138,150 182,150" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" />
            <circle cx="160" cy="160" r="10" fill="#f43f5e" filter="drop-shadow(0 0 16px #f43f5e)" />
          </svg>
        </div>
      );

    case 'block_craft_arena':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            <rect x="40" y="115" width="240" height="35" fill="#22c55e" rx="4" />
            {/* Diamond Sword in Center */}
            <polygon points="160,45 175,75 160,105 145,75" fill="#38bdf8" filter="drop-shadow(0 0 16px #38bdf8)" />
            <rect x="70" y="85" width="26" height="26" fill="#b45309" stroke="#f59e0b" strokeWidth="2" />
            <rect x="220" y="85" width="26" height="26" fill="#b45309" stroke="#f59e0b" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'neon_cyber_pong':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-950 via-slate-950 to-rose-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            <line x1="160" y1="0" x2="160" y2="180" stroke="#334155" strokeWidth="3" strokeDasharray="8 8" />
            {/* Left Paddle */}
            <rect x="30" y="60" width="12" height="55" rx="5" fill="#06b6d4" filter="drop-shadow(0 0 12px #06b6d4)" />
            {/* Right Paddle */}
            <rect x="278" y="50" width="12" height="55" rx="5" fill="#f43f5e" filter="drop-shadow(0 0 12px #f43f5e)" />
            {/* Glowing Ball with Trail */}
            <circle cx="175" cy="85" r="9" fill="#facc15" filter="drop-shadow(0 0 16px #facc15)" />
            <line x1="120" y1="75" x2="175" y2="85" stroke="#fde047" strokeWidth="3" strokeDasharray="4 4" opacity="0.6" />
          </svg>
        </div>
      );

    case 'solar_overdrive':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-950 via-slate-950 to-rose-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Giant Glowing Sun */}
            <circle cx="160" cy="60" r="45" fill="#f97316" filter="drop-shadow(0 0 35px #f97316)" />
            <circle cx="160" cy="60" r="30" fill="#fde047" />
            {/* Speed Tunnel Track */}
            <polygon points="160,80 30,180 290,180" fill="#0f172a" opacity="0.85" />
            <line x1="160" y1="80" x2="160" y2="180" stroke="#f59e0b" strokeWidth="3" strokeDasharray="10 10" />
            {/* F-Zero Style Super Ship */}
            <polygon points="160,110 185,155 160,145 135,155" fill="#06b6d4" stroke="#22d3ee" strokeWidth="2.5" filter="drop-shadow(0 0 18px #06b6d4)" />
            {/* Nitro Fire Trail */}
            <line x1="160" y1="150" x2="160" y2="178" stroke="#f43f5e" strokeWidth="6" strokeLinecap="round" filter="drop-shadow(0 0 12px #f43f5e)" />
          </svg>
        </div>
      );

    case 'pixel_survivors':
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-950 via-slate-950 to-rose-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            {/* Dark Vampire Realm */}
            <circle cx="160" cy="90" r="70" fill="#3b0764" opacity="0.5" filter="drop-shadow(0 0 30px #a855f7)" />
            {/* Magic Wand / Plasma Orb Ring */}
            <circle cx="160" cy="90" r="45" stroke="#ec4899" strokeWidth="2" strokeDasharray="6 6" fill="none" />
            {/* Hero Wizard */}
            <circle cx="160" cy="85" r="10" fill="#f59e0b" />
            <polygon points="160,65 175,85 145,85" fill="#8b5cf6" filter="drop-shadow(0 0 8px #8b5cf6)" />
            {/* Swarm of Bats & Skulls closing in */}
            <text x="80" y="60" fontSize="18" fill="#f43f5e">🦇</text>
            <text x="230" y="60" fontSize="18" fill="#f43f5e">🦇</text>
            <text x="70" y="140" fontSize="18" fill="#e11d48">💀</text>
            <text x="240" y="140" fontSize="18" fill="#e11d48">💀</text>
            <text x="160" y="155" fontSize="18" fill="#a855f7">👾</text>
            {/* Magic Explosion Wave */}
            <circle cx="160" cy="90" r="25" stroke="#38bdf8" strokeWidth="3" fill="none" filter="drop-shadow(0 0 12px #38bdf8)" />
          </svg>
        </div>
      );

    default:
      return (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full" viewBox="0 0 320 180" fill="none" preserveAspectRatio="xMidYMid slice">
            <circle cx="160" cy="90" r="50" fill="#06b6d4" opacity="0.25" filter="drop-shadow(0 0 20px #06b6d4)" />
            <polygon points="160,40 210,130 110,130" stroke="#38bdf8" strokeWidth="3" fill="none" />
            <circle cx="160" cy="90" r="12" fill="#facc15" />
          </svg>
        </div>
      );
  }
}
