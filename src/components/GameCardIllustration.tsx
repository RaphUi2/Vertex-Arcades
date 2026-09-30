import React, { useId } from 'react';

interface IllustrationProps {
  gameId: string;
  aspect?: '1:1' | '16:9';
  className?: string;
}

export function GameCardIllustration({ gameId, aspect = '1:1', className = 'w-full h-full' }: IllustrationProps) {
  const isWide = aspect === '16:9';
  const viewBox = isWide ? '0 0 640 360' : '0 0 320 320';
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');

  switch (gameId) {
    // -------------------------------------------------------------------------
    // 1. RUNNER (Cyber Runner)
    // -------------------------------------------------------------------------
    case 'cyber_runner_2099':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-b from-slate-950 via-cyan-950/40 to-slate-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full object-cover select-none" viewBox={viewBox} fill="none" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id={`${uid}_cr_sky`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#030712" />
                <stop offset="60%" stopColor="#083344" />
                <stop offset="100%" stopColor="#0e7490" />
              </linearGradient>
              <radialGradient id={`${uid}_cr_sun`} cx="50%" cy="40%" r="40%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <linearGradient id={`${uid}_cr_road`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0e7490" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#082f49" />
              </linearGradient>
            </defs>

            {/* Cyber sky & glowing neon sun */}
            <rect width="100%" height="100%" fill={`url(#${uid}_cr_sky)`} />
            <circle cx={isWide ? 320 : 160} cy={isWide ? 130 : 110} r={isWide ? 90 : 65} fill={`url(#${uid}_cr_sun)`} />

            {/* Distant Cyber City Skyline */}
            {isWide ? (
              <path
                d="M0,210 L30,210 L30,160 L60,160 L60,190 L100,190 L100,140 L130,140 L130,200 L180,200 L180,150 L210,150 L210,185 L260,185 L260,130 L290,130 L290,205 L350,205 L350,135 L380,135 L380,180 L430,180 L430,145 L460,145 L460,195 L510,195 L510,155 L550,155 L550,185 L590,185 L590,140 L640,140 L640,210 Z"
                fill="#041b29"
                opacity="0.8"
              />
            ) : (
              <path
                d="M0,190 L20,190 L20,145 L40,145 L40,170 L70,170 L70,130 L95,130 L95,180 L130,180 L130,140 L150,140 L150,175 L180,175 L180,125 L205,125 L205,185 L245,185 L245,135 L270,135 L270,175 L320,175 L320,190 Z"
                fill="#041b29"
                opacity="0.8"
              />
            )}

            {/* 3D Perspective Road */}
            {isWide ? (
              <>
                <polygon points="260,200 380,200 640,360 0,360" fill={`url(#${uid}_cr_road)`} />
                <line x1="260" y1="200" x2="0" y2="360" stroke="#06b6d4" strokeWidth="2.5" />
                <line x1="380" y1="200" x2="640" y2="360" stroke="#06b6d4" strokeWidth="2.5" />
                <line x1="300" y1="200" x2="210" y2="360" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="10,8" />
                <line x1="340" y1="200" x2="430" y2="360" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="10,8" />
                <line x1="320" y1="200" x2="320" y2="360" stroke="#22d3ee" strokeWidth="2" strokeDasharray="16,10" />
                <line x1="240" y1="225" x2="400" y2="225" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
                <line x1="200" y1="260" x2="440" y2="260" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" />
                <line x1="140" y1="305" x2="500" y2="305" stroke="#06b6d4" strokeWidth="2" opacity="0.8" />
              </>
            ) : (
              <>
                <polygon points="120,180 200,180 320,320 0,320" fill={`url(#${uid}_cr_road)`} />
                <line x1="120" y1="180" x2="0" y2="320" stroke="#06b6d4" strokeWidth="2" />
                <line x1="200" y1="180" x2="320" y2="320" stroke="#06b6d4" strokeWidth="2" />
                <line x1="145" y1="180" x2="105" y2="320" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="8,6" />
                <line x1="175" y1="180" x2="215" y2="320" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="8,6" />
                <line x1="160" y1="180" x2="160" y2="320" stroke="#22d3ee" strokeWidth="2" strokeDasharray="12,8" />
                <line x1="100" y1="205" x2="220" y2="205" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
                <line x1="75" y1="240" x2="245" y2="240" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" />
                <line x1="40" y1="280" x2="280" y2="280" stroke="#06b6d4" strokeWidth="2" opacity="0.8" />
              </>
            )}

            {/* Runner Silhouette in Mid-air Leap */}
            {isWide ? (
              <g transform="translate(305, 175)">
                <path d="M-40,25 Q-10,22 15,18" stroke="#38bdf8" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
                <path d="M-55,35 Q-20,30 10,28" stroke="#06b6d4" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
                <path d="M-30,45 Q0,40 25,35" stroke="#22d3ee" strokeWidth="2.5" opacity="0.7" strokeLinecap="round" />
                <circle cx="15" cy="5" r="7" fill="#22d3ee" />
                <rect x="18" y="4" width="6" height="3" rx="1.5" fill="#fde047" />
                <path d="M12,12 L22,17 L16,35 L8,30 Z" fill="#06b6d4" />
                <path d="M16,35 L28,45 L36,43" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
                <path d="M10,32 L-2,44 L-12,42" stroke="#0891b2" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M14,16 L-2,12 L-10,20" stroke="#0891b2" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M20,18 L32,22 L40,16" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" />
              </g>
            ) : (
              <g transform="translate(145, 160)">
                <path d="M-30,25 Q-5,22 15,18" stroke="#38bdf8" strokeWidth="3" opacity="0.8" strokeLinecap="round" />
                <path d="M-45,35 Q-15,30 10,28" stroke="#06b6d4" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
                <circle cx="15" cy="5" r="7" fill="#22d3ee" />
                <rect x="18" y="4" width="6" height="3" rx="1.5" fill="#fde047" />
                <path d="M12,12 L22,17 L16,35 L8,30 Z" fill="#06b6d4" />
                <path d="M16,35 L28,45 L36,43" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
                <path d="M10,32 L-2,44 L-12,42" stroke="#0891b2" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M14,16 L-2,12 L-10,20" stroke="#0891b2" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M20,18 L32,22 L40,16" stroke="#22d3ee" strokeWidth="3.5" strokeLinecap="round" />
              </g>
            )}

            {/* Cyber speed orbs */}
            <circle cx={isWide ? 220 : 70} cy={isWide ? 270 : 250} r="6" fill="#fde047" opacity="0.9" />
            <circle cx={isWide ? 420 : 250} cy={isWide ? 260 : 235} r="7" fill="#22d3ee" opacity="0.9" />
            <circle cx={isWide ? 380 : 200} cy={isWide ? 290 : 275} r="5" fill="#a855f7" opacity="0.9" />
          </svg>
        </div>
      );

    // -------------------------------------------------------------------------
    // 2. COSMIC
    // -------------------------------------------------------------------------
    case 'cosmic_defender':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950/50 to-slate-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full object-cover select-none" viewBox={viewBox} fill="none" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id={`${uid}_cd_space`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#020617" />
                <stop offset="50%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
              <radialGradient id={`${uid}_cd_nebula`} cx="70%" cy="30%" r="50%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                <stop offset="60%" stopColor="#4f46e5" stopOpacity="0.15" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <linearGradient id={`${uid}_cd_ship_body`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>

            {/* Deep Space & Nebula */}
            <rect width="100%" height="100%" fill={`url(#${uid}_cd_space)`} />
            <circle cx={isWide ? 440 : 220} cy={isWide ? 100 : 90} r={isWide ? 140 : 95} fill={`url(#${uid}_cd_nebula)`} />

            {/* Distant stars */}
            <g fill="#ffffff">
              <circle cx={isWide ? 80 : 35} cy="45" r="1.5" opacity="0.8" />
              <circle cx={isWide ? 150 : 80} cy="120" r="1" opacity="0.6" />
              <circle cx={isWide ? 220 : 130} cy="60" r="1.2" opacity="0.9" />
              <circle cx={isWide ? 380 : 190} cy="40" r="1" opacity="0.7" />
              <circle cx={isWide ? 510 : 250} cy="140" r="1.8" opacity="0.9" />
              <circle cx={isWide ? 580 : 290} cy="75" r="1.2" opacity="0.5" />
              <circle cx={isWide ? 110 : 50} cy="220" r="1.5" opacity="0.6" />
              <circle cx={isWide ? 550 : 270} cy="260" r="1" opacity="0.8" />
              <circle cx={isWide ? 290 : 160} cy="300" r="1.4" opacity="0.7" />
            </g>

            {isWide && (
              <circle cx="580" cy="380" r="160" fill="#1e1b4b" stroke="#4338ca" strokeWidth="2" opacity="0.7" />
            )}

            {/* Enemy Alien Swarm */}
            <g transform={isWide ? 'translate(320, 60)' : 'translate(160, 50)'}>
              <polygon points="0,0 -16,-20 0,-14 16,-20" fill="#f43f5e" stroke="#fda4af" strokeWidth="1.5" />
              <circle cx="0" cy="-10" r="3" fill="#fde047" />
              <polygon points="-40,15 -52,-2 -40,3 -28,-2" fill="#e11d48" stroke="#f43f5e" strokeWidth="1" />
              <polygon points="-75,32 -85,18 -75,22 -65,18" fill="#be123c" stroke="#e11d48" strokeWidth="1" />
              <polygon points="40,15 28,-2 40,3 52,-2" fill="#e11d48" stroke="#f43f5e" strokeWidth="1" />
              <polygon points="75,32 65,18 75,22 85,18" fill="#be123c" stroke="#e11d48" strokeWidth="1" />
            </g>

            {/* Plasma Laser Cannons & Starfighter */}
            <g transform={isWide ? 'translate(320, 200)' : 'translate(160, 185)'}>
              <line x1="-22" y1="10" x2="-22" y2="-90" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="-22" y1="10" x2="-22" y2="-90" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="22" y1="10" x2="22" y2="-90" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="22" y1="10" x2="22" y2="-90" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

              <polygon points="-12,70 0,110 12,70" fill="#06b6d4" opacity="0.85" />
              <polygon points="-6,70 0,95 6,70" fill="#ffffff" />

              <polygon points="0,0 -48,60 -24,65 0,35 24,65 48,60" fill={`url(#${uid}_cd_ship_body)`} stroke="#7dd3fc" strokeWidth="1.5" />
              <polygon points="0,-25 -14,40 0,50 14,40" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
              <ellipse cx="0" cy="15" rx="5" ry="12" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
              <rect x="-49" y="42" width="4" height="18" rx="2" fill="#fde047" />
              <rect x="45" y="42" width="4" height="18" rx="2" fill="#fde047" />
            </g>
          </svg>
        </div>
      );

    // -------------------------------------------------------------------------
    // 3. DUNGEON
    // -------------------------------------------------------------------------
    case 'pixel_dungeon_quest':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-b from-stone-950 via-emerald-950/40 to-stone-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full object-cover select-none" viewBox={viewBox} fill="none" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id={`${uid}_pd_wall`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0c1214" />
                <stop offset="100%" stopColor="#06221c" />
              </linearGradient>
              <radialGradient id={`${uid}_pd_torch`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#d97706" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <linearGradient id={`${uid}_pd_blade`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a7f3d0" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>

            {/* Subterranean chamber background */}
            <rect width="100%" height="100%" fill={`url(#${uid}_pd_wall)`} />

            {/* Brick Stone Wall Texture */}
            {isWide ? (
              <g stroke="#0f2b23" strokeWidth="1" opacity="0.6">
                <line x1="0" y1="60" x2="640" y2="60" />
                <line x1="0" y1="120" x2="640" y2="120" />
                <line x1="0" y1="180" x2="640" y2="180" />
                <line x1="0" y1="240" x2="640" y2="240" />
                <line x1="80" y1="0" x2="80" y2="60" />
                <line x1="200" y1="0" x2="200" y2="60" />
                <line x1="360" y1="0" x2="360" y2="60" />
                <line x1="500" y1="0" x2="500" y2="60" />
                <line x1="140" y1="60" x2="140" y2="120" />
                <line x1="280" y1="60" x2="280" y2="120" />
                <line x1="440" y1="60" x2="440" y2="120" />
                <line x1="580" y1="60" x2="580" y2="120" />
                <line x1="90" y1="120" x2="90" y2="180" />
                <line x1="220" y1="120" x2="220" y2="180" />
                <line x1="380" y1="120" x2="380" y2="180" />
                <line x1="520" y1="120" x2="520" y2="180" />
              </g>
            ) : (
              <g stroke="#0f2b23" strokeWidth="1" opacity="0.6">
                <line x1="0" y1="50" x2="320" y2="50" />
                <line x1="0" y1="100" x2="320" y2="100" />
                <line x1="0" y1="150" x2="320" y2="150" />
                <line x1="0" y1="200" x2="320" y2="200" />
                <line x1="50" y1="0" x2="50" y2="50" />
                <line x1="150" y1="0" x2="150" y2="50" />
                <line x1="250" y1="0" x2="250" y2="50" />
                <line x1="100" y1="50" x2="100" y2="100" />
                <line x1="200" y1="50" x2="200" y2="100" />
                <line x1="300" y1="50" x2="300" y2="100" />
              </g>
            )}

            {/* Glowing Gothic Archway in Center */}
            <path
              d={isWide ? "M230,360 L230,170 Q320,80 410,170 L410,360 Z" : "M95,320 L95,150 Q160,70 225,150 L225,320 Z"}
              fill="#03110d"
              stroke="#10b981"
              strokeWidth="2.5"
            />
            <path
              d={isWide ? "M245,360 L245,180 Q320,105 395,180 L395,360 Z" : "M108,320 L108,160 Q160,90 212,160 L212,320 Z"}
              fill="#064e3b"
              opacity="0.8"
            />

            {/* Torch Light Left & Right */}
            {isWide ? (
              <>
                <circle cx="150" cy="140" r="45" fill={`url(#${uid}_pd_torch)`} />
                <rect x="146" y="145" width="8" height="24" fill="#78350f" rx="2" />
                <path d="M145,145 Q150,125 155,145 Z" fill="#f59e0b" />

                <circle cx="490" cy="140" r="45" fill={`url(#${uid}_pd_torch)`} />
                <rect x="486" y="145" width="8" height="24" fill="#78350f" rx="2" />
                <path d="M485,145 Q490,125 495,145 Z" fill="#f59e0b" />
              </>
            ) : (
              <>
                <circle cx="55" cy="120" r="35" fill={`url(#${uid}_pd_torch)`} />
                <rect x="52" y="125" width="6" height="20" fill="#78350f" rx="2" />
                <path d="M51,125 Q55,108 59,125 Z" fill="#f59e0b" />

                <circle cx="265" cy="120" r="35" fill={`url(#${uid}_pd_torch)`} />
                <rect x="262" y="125" width="6" height="20" fill="#78350f" rx="2" />
                <path d="M261,125 Q265,108 269,125 Z" fill="#f59e0b" />
              </>
            )}

            {/* Heroic Runic Broadsword & Golden Relic */}
            <g transform={isWide ? 'translate(320, 230)' : 'translate(160, 210)'}>
              <circle cx="0" cy="0" r="42" fill="#10b981" opacity="0.15" />
              <circle cx="0" cy="0" r="36" stroke="#34d399" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.7" />

              <g transform="rotate(-30)">
                <polygon points="-6,-60 0,-75 6,-60 5,10 -5,10" fill={`url(#${uid}_pd_blade)`} stroke="#a7f3d0" strokeWidth="1.5" />
                <rect x="-18" y="10" width="36" height="7" rx="3" fill="#d97706" stroke="#fbbf24" strokeWidth="1" />
                <rect x="-4" y="17" width="8" height="15" rx="1" fill="#78350f" />
                <circle cx="0" cy="35" r="5" fill="#f59e0b" stroke="#fde68a" strokeWidth="1" />
              </g>

              <g transform="translate(18, 30)">
                <rect x="-24" y="-8" width="48" height="26" rx="4" fill="#92400e" stroke="#f59e0b" strokeWidth="2" />
                <rect x="-26" y="-14" width="52" height="10" rx="3" fill="#b45309" stroke="#fbbf24" strokeWidth="2" />
                <circle cx="0" cy="3" r="4" fill="#fde047" stroke="#78350f" strokeWidth="1.5" />
              </g>
            </g>
          </svg>
        </div>
      );

    // -------------------------------------------------------------------------
    // 4. PINBALL
    // -------------------------------------------------------------------------
    case 'titan_pinball_titan':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-b from-slate-950 via-amber-950/40 to-slate-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full object-cover select-none" viewBox={viewBox} fill="none" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id={`${uid}_tp_table`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#180c04" />
                <stop offset="60%" stopColor="#291508" />
                <stop offset="100%" stopColor="#0f0702" />
              </linearGradient>
              <linearGradient id={`${uid}_tp_ball`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>

            {/* Playfield Base */}
            <rect width="100%" height="100%" fill={`url(#${uid}_tp_table)`} />

            {/* Table Neon Borders */}
            {isWide ? (
              <path
                d="M120,360 L120,80 Q320,10 520,80 L520,360"
                stroke="#f59e0b"
                strokeWidth="4"
                fill="none"
                opacity="0.85"
              />
            ) : (
              <path
                d="M40,320 L40,60 Q160,10 280,60 L280,320"
                stroke="#f59e0b"
                strokeWidth="3.5"
                fill="none"
                opacity="0.85"
              />
            )}

            {/* Radiant Bumper Rings */}
            <g transform={isWide ? 'translate(320, 140)' : 'translate(160, 120)'}>
              <circle cx="0" cy="-45" r="22" fill="#7c2d12" stroke="#f97316" strokeWidth="3" />
              <circle cx="0" cy="-45" r="14" fill="#ea580c" stroke="#fde047" strokeWidth="2" />
              <circle cx="0" cy="-45" r="6" fill="#fde047" />

              <circle cx="-55" cy="20" r="20" fill="#7c2d12" stroke="#f97316" strokeWidth="3" />
              <circle cx="-55" cy="20" r="12" fill="#ea580c" stroke="#fde047" strokeWidth="2" />
              <circle cx="-55" cy="20" r="5" fill="#fde047" />

              <circle cx="55" cy="20" r="20" fill="#7c2d12" stroke="#f97316" strokeWidth="3" />
              <circle cx="55" cy="20" r="12" fill="#ea580c" stroke="#fde047" strokeWidth="2" />
              <circle cx="55" cy="20" r="5" fill="#fde047" />

              <polygon points="0,-15 -8,0 8,0" fill="#fde047" opacity="0.9" />
              <polygon points="-30,30 -38,42 -22,42" fill="#38bdf8" opacity="0.9" />
              <polygon points="30,30 22,42 38,42" fill="#38bdf8" opacity="0.9" />
            </g>

            {/* Neon Wireform Ball Ramp Tracks */}
            {isWide ? (
              <>
                <path d="M160,300 C180,180 220,100 320,90" stroke="#38bdf8" strokeWidth="2.5" fill="none" opacity="0.7" />
                <path d="M480,300 C460,180 420,100 320,90" stroke="#38bdf8" strokeWidth="2.5" fill="none" opacity="0.7" />
              </>
            ) : (
              <>
                <path d="M70,270 C85,160 110,85 160,80" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.7" />
                <path d="M250,270 C235,160 210,85 160,80" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.7" />
              </>
            )}

            {/* Chrome Pinball with Streak */}
            <g transform={isWide ? 'translate(370, 200)' : 'translate(195, 175)'}>
              <path d="M-40,40 Q-20,20 0,0" stroke="#fbbf24" strokeWidth="7" strokeLinecap="round" opacity="0.7" />
              <path d="M-30,30 Q-15,15 0,0" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
              <circle cx="0" cy="0" r="14" fill={`url(#${uid}_tp_ball)`} stroke="#ffffff" strokeWidth="2" />
              <circle cx="-4" cy="-4" r="4" fill="#ffffff" />
            </g>

            {/* Flippers */}
            <g transform={isWide ? 'translate(320, 310)' : 'translate(160, 280)'}>
              <g transform="rotate(-15, -45, 0)">
                <polygon points="-45,-6 10, -2 8, 8 -45, 6" fill="#ea580c" stroke="#fde047" strokeWidth="2" />
                <circle cx="-45" cy="0" r="6" fill="#fde047" />
              </g>
              <g transform="rotate(15, 45, 0)">
                <polygon points="45,-6 -10, -2 -8, 8 45, 6" fill="#ea580c" stroke="#fde047" strokeWidth="2" />
                <circle cx="45" cy="0" r="6" fill="#fde047" />
              </g>
            </g>
          </svg>
        </div>
      );

    // -------------------------------------------------------------------------
    // 5. LASER
    // -------------------------------------------------------------------------
    case 'quantum_strike':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-b from-slate-950 via-purple-950/40 to-slate-950 flex items-center justify-center ${className}`}>
          <svg className="w-full h-full object-cover select-none" viewBox={viewBox} fill="none" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id={`${uid}_qs_hud_bg`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#090514" />
                <stop offset="60%" stopColor="#1e0b36" />
                <stop offset="100%" stopColor="#090514" />
              </linearGradient>
              <radialGradient id={`${uid}_qs_core_glow`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#9333ea" stopOpacity="0.4" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <linearGradient id={`${uid}_qs_beam`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#e879f9" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>

            {/* Tactical grid background */}
            <rect width="100%" height="100%" fill={`url(#${uid}_qs_hud_bg)`} />

            {/* Coordinate Grid lines */}
            <g stroke="#7c3aed" strokeWidth="0.8" opacity="0.35">
              {isWide ? (
                <>
                  <line x1="80" y1="0" x2="80" y2="360" />
                  <line x1="160" y1="0" x2="160" y2="360" />
                  <line x1="240" y1="0" x2="240" y2="360" />
                  <line x1="320" y1="0" x2="320" y2="360" stroke="#a855f7" strokeWidth="1.5" />
                  <line x1="400" y1="0" x2="400" y2="360" />
                  <line x1="480" y1="0" x2="480" y2="360" />
                  <line x1="560" y1="0" x2="560" y2="360" />

                  <line x1="0" y1="60" x2="640" y2="60" />
                  <line x1="0" y1="120" x2="640" y2="120" />
                  <line x1="0" y1="180" x2="640" y2="180" stroke="#a855f7" strokeWidth="1.5" />
                  <line x1="0" y1="240" x2="640" y2="240" />
                  <line x1="0" y1="300" x2="640" y2="300" />
                </>
              ) : (
                <>
                  <line x1="80" y1="0" x2="80" y2="320" />
                  <line x1="160" y1="0" x2="160" y2="320" stroke="#a855f7" strokeWidth="1.5" />
                  <line x1="240" y1="0" x2="240" y2="320" />

                  <line x1="0" y1="80" x2="320" y2="80" />
                  <line x1="0" y1="160" x2="320" y2="160" stroke="#a855f7" strokeWidth="1.5" />
                  <line x1="0" y1="240" x2="320" y2="240" />
                </>
              )}
            </g>

            {/* Concentric HUD Reticle in center */}
            <g transform={isWide ? 'translate(320, 180)' : 'translate(160, 160)'}>
              <circle cx="0" cy="0" r={isWide ? 100 : 85} stroke="#c084fc" strokeWidth="1.5" strokeDasharray="14,8" opacity="0.6" />
              <circle cx="0" cy="0" r={isWide ? 75 : 62} stroke="#a855f7" strokeWidth="2" strokeDasharray="30,12" opacity="0.8" />
              <circle cx="0" cy="0" r={isWide ? 45 : 38} stroke="#e879f9" strokeWidth="2.5" />

              {/* Laser Core */}
              <circle cx="0" cy="0" r="24" fill={`url(#${uid}_qs_core_glow)`} />
              <circle cx="0" cy="0" r="10" fill="#ffffff" />

              {/* Precision Bracket Tick Marks */}
              <path d="M-60,-20 L-60,-60 L-20,-60" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
              <path d="M60,-20 L60,-60 L20,-60" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
              <path d="M-60,20 L-60,60 L-20,60" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
              <path d="M60,20 L60,60 L20,60" stroke="#38bdf8" strokeWidth="2.5" fill="none" />

              {/* Laser crosshair arms */}
              <line x1="-120" y1="0" x2="-55" y2="0" stroke="#e879f9" strokeWidth="2" />
              <line x1="55" y1="0" x2="120" y2="0" stroke="#e879f9" strokeWidth="2" />
              <line x1="0" y1="-100" x2="0" y2="-50" stroke="#e879f9" strokeWidth="2" />
              <line x1="0" y1="50" x2="0" y2="100" stroke="#e879f9" strokeWidth="2" />

              {/* High-voltage Beam */}
              <line x1="-140" y1="120" x2="140" y2="-120" stroke={`url(#${uid}_qs_beam)`} strokeWidth="4" strokeLinecap="round" />
              <line x1="-140" y1="120" x2="140" y2="-120" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

              {/* Hit Spark Particles */}
              <circle cx="20" cy="-20" r="3" fill="#fde047" />
              <circle cx="-15" cy="18" r="2.5" fill="#38bdf8" />
              <circle cx="35" cy="-30" r="2" fill="#f43f5e" />
            </g>

            {/* Target telemetry stats */}
            <g fill="#c084fc" opacity="0.85" className="font-mono text-[9px] font-bold">
              <text x={isWide ? 40 : 15} y={isWide ? 45 : 30}>LOCK: 99.8%</text>
              <text x={isWide ? 40 : 15} y={isWide ? 62 : 45}>FREQ: 432 THz</text>
              <text x={isWide ? 530 : 220} y={isWide ? 45 : 30}>CRIT: x10</text>
            </g>
          </svg>
        </div>
      );

    default:
      return (
        <div className={`relative overflow-hidden bg-slate-900 flex items-center justify-center ${className}`}>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-mono text-cyan-400">
            🎮
          </div>
        </div>
      );
  }
}
