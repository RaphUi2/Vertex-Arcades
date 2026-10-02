import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Gamepad2, Radio, Globe, Sparkles, Trophy,
  ChevronRight, Volume2, VolumeX, Moon, Sun, Shield,
  Layers, ArrowRight, User, Settings, Flame, ShieldCheck,
  Disc, Headphones, Code, Cpu, Compass, Play, Zap
} from 'lucide-react';
import { audio } from '../utils/audio';
import { UserProfile, AppSettings } from '../types';
import { Language, getTranslation } from '../utils/i18n';

interface VertexPortalHubProps {
  profile: UserProfile;
  settings: AppSettings;
  totalTrophies: number;
  arcadePassLevel: number;
  language?: Language;
  onEnterGames: () => void;
  onOpenVibePreview: () => void;
  onOpenVwebPreview: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onToggleSound: () => void;
  onSelectTheme: (theme: 'halloween' | 'cyber' | 'dark' | 'light') => void;
  onSelectLanguage: (lang: Language) => void;
}

export function VertexPortalHub({
  profile,
  settings,
  totalTrophies,
  arcadePassLevel,
  language = 'fr',
  onEnterGames,
  onOpenVibePreview,
  onOpenVwebPreview,
  onOpenProfile,
  onOpenSettings,
  onToggleSound,
  onSelectTheme,
  onSelectLanguage
}: VertexPortalHubProps) {
  const t = getTranslation(language);
  const initialLetter = (profile.username.trim()[0] || 'V').toUpperCase();
  const currentTheme = settings.colorTheme || 'halloween';

  // Automatically start the Halloween ambient soundtrack on load
  useEffect(() => {
    if (settings.musicEnabled) {
      audio.startBGM(settings.currentTrack || 'halloween');
    }
    return () => {
      // Clean up when unmounting
    };
  }, [settings.musicEnabled, settings.currentTrack]);

  const socialStatusEmoji =
    profile.socialStatus === 'ready_for_duel' ? '⚔️ 1v1' :
    profile.socialStatus === 'looking_for_squad' ? '🚀 Escouade' :
    profile.socialStatus === 'tryhard' ? '🏆 Record' :
    profile.socialStatus === 'chill' ? '☕ Chill' :
    profile.socialStatus === 'grinding_achievements' ? '🎯 Succès' :
    profile.socialStatus === 'dnd' ? '⛔ Occupé' : '💤 Pause';

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-3 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      {/* 🌌 Dynamic Ambient Nebula Background with Cosmic Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-br from-cyan-500/12 via-fuchsia-500/10 to-indigo-500/12 rounded-full blur-[130px] animate-pulse pointer-events-none" style={{ animationDuration: '10s' }} />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-600/15 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[100px]" />
      </div>

      {/* 1. TOP PORTAL HEADER (NO MONEY/V-COINS DISPLAY - DEDICATED TO GAMES) */}
      <header className="liquid-glass-header w-full rounded-3xl px-4 sm:px-7 py-3 flex items-center justify-between relative z-20 shadow-2xl border border-white/10 mb-4 sm:mb-6">
        <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />

        {/* Left: Player Profile Capsule */}
        <div
          onClick={() => {
            audio.playClick();
            onOpenProfile();
          }}
          className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl liquid-glass-pill hover:border-cyan-400/60 transition-all cursor-pointer group shadow-sm active:scale-98"
          title={t.navProfileTitle}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center text-lg border border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.3)] bg-gradient-to-br from-cyan-900 to-blue-950">
              {profile.customAvatarUrl ? (
                <img src={profile.customAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-mono font-black text-white text-base">{initialLetter}</span>
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white font-mono group-hover:text-cyan-300 transition-colors">
                {profile.username}
              </span>
              <span className="px-1.5 py-0.2 rounded-md text-[9px] font-mono font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/30">
                {socialStatusEmoji}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
              <span className="text-yellow-400 font-bold flex items-center gap-1">
                <Trophy className="w-3 h-3 fill-current" /> {totalTrophies} 🏆
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-300 font-bold">Niv.{arcadePassLevel}</span>
            </div>
          </div>
        </div>

        {/* Center: Vertex Brand Logo */}
        <div className="hidden md:flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 text-sm font-black font-mono tracking-widest text-white uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>{t.portalTitle}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 tracking-wider">
            {t.portalDestinations}
          </span>
        </div>

        {/* Right: Sound, Theme, Language & Settings Controls (No Money) */}
        <div className="flex items-center gap-2">
          {/* Quick Theme Switcher */}
          <div className="hidden lg:flex items-center p-1 rounded-2xl liquid-glass-pill border border-orange-500/30 gap-1 text-[10px] font-mono">
            <button
              onClick={() => onSelectTheme('halloween')}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                currentTheme === 'halloween' ? 'bg-orange-500 text-slate-950 font-black shadow-[0_0_12px_#f97316]' : 'text-orange-300 hover:text-white'
              }`}
              title="Thème Halloween"
            >
              <span>🎃</span>
              <span>Halloween</span>
            </button>
            <button
              onClick={() => onSelectTheme('cyber')}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                currentTheme === 'cyber' ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-400/40' : 'text-slate-400 hover:text-white'
              }`}
              title="Cyber"
            >
              Cyber
            </button>
            <button
              onClick={() => onSelectTheme('dark')}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                currentTheme === 'dark' ? 'bg-zinc-800 text-white font-bold border border-white/30' : 'text-slate-400 hover:text-white'
              }`}
              title="Dark"
            >
              <Moon className="w-3 h-3" /> Noir
            </button>
            <button
              onClick={() => onSelectTheme('light')}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                currentTheme === 'light' ? 'bg-slate-200 text-slate-900 font-bold border border-slate-300' : 'text-slate-400 hover:text-white'
              }`}
              title="Light"
            >
              <Sun className="w-3 h-3" /> Blanc
            </button>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center p-0.5 rounded-xl liquid-glass-pill border border-white/10 text-[10px] font-mono font-bold">
            {(['fr', 'en', 'es'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => {
                  audio.playClick();
                  onSelectLanguage(lang);
                }}
                className={`px-2 py-1 rounded-lg uppercase transition-all cursor-pointer ${
                  language === lang
                    ? 'bg-cyan-500/40 text-cyan-200 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-2xl liquid-glass-pill text-slate-300 hover:text-white cursor-pointer shadow-sm transition-transform active:scale-95"
            title={settings.sfxEnabled ? t.soundOn : t.soundOff}
          >
            {settings.sfxEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              audio.playClick();
              onOpenSettings();
            }}
            className="p-2 rounded-2xl liquid-glass-pill text-slate-300 hover:text-white cursor-pointer shadow-sm transition-transform active:scale-95"
            title={t.settings}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. MAIN HERO & ORGANIC HOLOGRAPHIC DESTINATION GATEWAYS */}
      <main className="flex-1 flex flex-col justify-center items-center max-w-7xl mx-auto w-full my-auto py-2 z-10">
        {/* Futuristic Hero Header */}
        <div className="text-center space-y-2 mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-pill border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider mb-1 shadow-[0_0_20px_rgba(6,182,212,0.35)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '8s' }} />
            <span>{t.portalHeroBadge}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight text-white uppercase drop-shadow-2xl">
            {t.portalChooseDestination}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-sans">
            {t.portalSubtitle}
          </p>
        </div>

        {/* 3 Ultra-Futuristic Gateway Portals with Angled Glass Architecture & Hologram Orbs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 w-full px-1 sm:px-4">
          
          {/* GATEWAY 1: GAMES (ACTIVE & PLAYABLE) */}
          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative rounded-[32px] p-6 lg:p-7 flex flex-col justify-between border-2 border-orange-500/70 bg-gradient-to-b from-orange-950/40 via-slate-900/90 to-cyan-950/60 backdrop-blur-2xl shadow-[0_0_45px_rgba(249,115,22,0.35)] overflow-hidden group transition-all"
          >
            {/* Holographic Angular Accent Sheen with Pumpkin Glow */}
            <div className="absolute -right-16 -top-16 w-44 h-44 bg-orange-500/25 rounded-full blur-2xl group-hover:bg-orange-500/40 transition-all" />
            <div className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent pointer-events-none" />

            <div>
              {/* Header with Orb & Status */}
              <div className="flex items-center justify-between mb-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-orange-500 via-amber-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-[0_0_25px_rgba(249,115,22,0.6)] group-hover:rotate-6 transition-transform">
                    <Gamepad2 className="w-9 h-9 stroke-[2.2]" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-400 border-2 border-slate-950 flex items-center justify-center text-[10px] shadow-[0_0_10px_#f97316]">
                    🎃
                  </span>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="px-3.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.35)]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {t.portalAvailableOnline}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-400/40 animate-pulse">
                    🎃 HALLOWEEN EVENT
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl lg:text-3xl font-black font-mono text-white tracking-wider uppercase group-hover:text-orange-300 transition-colors flex items-center gap-2">
                <span>{t.destGamesTitle}</span>
                <span className="text-lg">🎃</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 font-sans leading-relaxed">
                {t.destGamesSub}
              </p>

              {/* Highlights Pill Badges */}
              <div className="grid grid-cols-2 gap-2 my-6 text-[11px] font-mono">
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 group-hover:border-orange-400/30 transition-colors">
                  <span className="text-orange-400 font-bold">🎮</span>
                  <span className="text-slate-200">{t.portalGamesHighlight1}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 group-hover:border-orange-400/30 transition-colors">
                  <span className="text-yellow-400 font-bold">🏆</span>
                  <span className="text-slate-200">{t.portalGamesHighlight2}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 group-hover:border-orange-400/30 transition-colors">
                  <span className="text-fuchsia-400 font-bold">👑</span>
                  <span className="text-slate-200">{t.portalGamesHighlight3}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 group-hover:border-orange-400/30 transition-colors">
                  <span className="text-amber-400 font-bold">📖</span>
                  <span className="text-slate-200">{t.portalGamesHighlight4}</span>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={() => {
                audio.playJump();
                onEnterGames();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-cyan-500 hover:from-orange-400 hover:to-cyan-400 text-slate-950 font-black font-mono text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(249,115,22,0.6)] cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>{t.enterDestination}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </motion.div>

          {/* GATEWAY 2: VIBE (COMING SOON) */}
          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative rounded-[32px] p-6 lg:p-7 flex flex-col justify-between border border-fuchsia-400/50 bg-gradient-to-b from-fuchsia-950/40 via-purple-950/70 to-slate-900/80 backdrop-blur-2xl shadow-[0_0_35px_rgba(217,70,239,0.25)] overflow-hidden group transition-all"
          >
            {/* Holographic Glowing Orb */}
            <div className="absolute -right-16 -top-16 w-44 h-44 bg-fuchsia-500/20 rounded-full blur-2xl group-hover:bg-fuchsia-500/35 transition-all" />
            <div className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent pointer-events-none" />

            {/* Corner Spiderweb */}
            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none z-10 opacity-70 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 50 50" className="w-full h-full text-purple-400/80 fill-none stroke-current stroke-[1.2]">
                <path d="M50,0 Q25,0 0,0 M50,0 Q50,25 50,50 M50,0 L0,50 M50,0 L18,50 M50,0 L50,18" />
                <path d="M40,0 Q35,15 50,20 M30,0 Q22,28 50,35 M20,0 Q12,38 50,45" />
              </svg>
            </div>

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_25px_rgba(217,70,239,0.5)] group-hover:rotate-6 transition-transform">
                    <Radio className="w-9 h-9 stroke-[2.2] animate-pulse" />
                  </div>
                  <span className="absolute -top-1 -right-1 text-sm animate-bounce" style={{ animationDuration: '1.8s' }}>
                    🦇
                  </span>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="px-3.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-fuchsia-500/25 text-fuchsia-300 border border-fuchsia-400/60 flex items-center gap-1.5 shadow-[0_0_15px_rgba(217,70,239,0.4)] animate-pulse">
                    <Sparkles className="w-2.5 h-2.5" />
                    {t.portalComingSoon}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black bg-purple-500/25 text-purple-300 border border-purple-400/40">
                    👻 SALON LO-FI
                  </span>
                </div>
              </div>

              <h2 className="text-2xl lg:text-3xl font-black font-mono text-white tracking-wider uppercase group-hover:text-fuchsia-300 transition-colors flex items-center gap-2">
                <span>{t.destVibeTitle}</span>
                <span className="text-lg">🕯️</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 font-sans leading-relaxed">
                {t.destVibeSub}
              </p>

              {/* Highlights Pill Badges */}
              <div className="grid grid-cols-2 gap-2 my-6 text-[11px] font-mono">
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 group-hover:border-fuchsia-400/30 transition-colors">
                  <Headphones className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span className="text-slate-200">{t.portalVibeHighlight1}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 group-hover:border-fuchsia-400/30 transition-colors">
                  <Disc className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-slate-200">{t.portalVibeHighlight2}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 group-hover:border-fuchsia-400/30 transition-colors">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-slate-200">{t.portalVibeHighlight3}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 group-hover:border-fuchsia-400/30 transition-colors">
                  <Radio className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-slate-200">{t.portalVibeHighlight4}</span>
                </div>
              </div>
            </div>

            {/* Preview Button */}
            <button
              onClick={() => {
                audio.playClick();
                onOpenVibePreview();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-black font-mono text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(217,70,239,0.5)] cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>{t.explorePreview}</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </motion.div>

          {/* GATEWAY 3: VWEB (COMING SOON) */}
          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative rounded-[32px] p-6 lg:p-7 flex flex-col justify-between border border-blue-400/50 bg-gradient-to-b from-blue-950/40 via-indigo-950/70 to-slate-900/80 backdrop-blur-2xl shadow-[0_0_35px_rgba(59,130,246,0.25)] overflow-hidden group transition-all"
          >
            {/* Holographic Glowing Orb */}
            <div className="absolute -right-16 -top-16 w-44 h-44 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/35 transition-all" />
            <div className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent pointer-events-none" />

            {/* Corner Spiderweb */}
            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none z-10 opacity-70 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 50 50" className="w-full h-full text-blue-400/80 fill-none stroke-current stroke-[1.2]">
                <path d="M50,0 Q25,0 0,0 M50,0 Q50,25 50,50 M50,0 L0,50 M50,0 L18,50 M50,0 L50,18" />
                <path d="M40,0 Q35,15 50,20 M30,0 Q22,28 50,35 M20,0 Q12,38 50,45" />
              </svg>
            </div>

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_25px_rgba(59,130,246,0.5)] group-hover:rotate-6 transition-transform">
                    <Globe className="w-9 h-9 stroke-[2.2] animate-pulse" />
                  </div>
                  <span className="absolute -top-1 -right-1 text-sm animate-bounce" style={{ animationDuration: '2.2s' }}>
                    🕸️
                  </span>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="px-3.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-blue-500/25 text-blue-300 border border-blue-400/60 flex items-center gap-1.5 shadow-[0_0_15px_rgba(59,130,246,0.4)] animate-pulse">
                    <Sparkles className="w-2.5 h-2.5" />
                    {t.portalComingSoon}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black bg-blue-500/25 text-blue-300 border border-blue-400/40">
                    🔮 MÉMETAVERSE
                  </span>
                </div>
              </div>

              <h2 className="text-2xl lg:text-3xl font-black font-mono text-white tracking-wider uppercase group-hover:text-blue-300 transition-colors flex items-center gap-2">
                <span>{t.destVwebTitle}</span>
                <span className="text-lg">🧙‍♂️</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 font-sans leading-relaxed">
                {t.destVwebSub}
              </p>

              {/* Highlights Pill Badges */}
              <div className="grid grid-cols-2 gap-2 my-6 text-[11px] font-mono">
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 group-hover:border-blue-400/30 transition-colors">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-slate-200">{t.portalVwebHighlight1}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 group-hover:border-blue-400/30 transition-colors">
                  <Code className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-200">{t.portalVwebHighlight2}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 group-hover:border-blue-400/30 transition-colors">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-slate-200">{t.portalVwebHighlight3}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 group-hover:border-blue-400/30 transition-colors">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-slate-200">{t.portalVwebHighlight4}</span>
                </div>
              </div>
            </div>

            {/* Preview Button */}
            <button
              onClick={() => {
                audio.playClick();
                onOpenVwebPreview();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black font-mono text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(59,130,246,0.5)] cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>{t.explorePreview}</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </motion.div>
        </div>
      </main>

      {/* 3. BOTTOM FOOTER & MULTIVERSE STATUS (NO MONEY) */}
      <footer className="w-full rounded-2xl liquid-glass-pill px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-400 relative z-20 border border-white/10 mt-4 sm:mt-6">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {t.portalServersOnline}
          </span>
          <span className="text-slate-600">•</span>
          <span>Ping : 12ms</span>
          <span className="hidden sm:inline-block text-slate-600">•</span>
          <span className="hidden sm:inline-block text-cyan-300 font-bold">
            {t.portalPlacesAvailable}
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span>{t.portalFriendCode} : <strong className="text-fuchsia-300 font-mono">{profile.friendCode || 'VERTEX#8492'}</strong></span>
          <span className="text-slate-600">•</span>
          <span>Vertex 2026</span>
        </div>
      </footer>
    </div>
  );
}
