import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Settings, Volume2, VolumeX, Music, Gamepad2, Eye, RotateCcw,
  Check, Sparkles, Moon, Sun, Palette, Play, Globe
} from 'lucide-react';
import { audio, BGM_TRACKS, BGMTrack } from '../utils/audio';
import { AppSettings } from '../types';
import { Language, getTranslation } from '../utils/i18n';

interface SettingsV3ModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  gamepadConnected: boolean;
  gamepadName: string;
  onResetData: () => void;
}

export function SettingsV3Modal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  gamepadConnected,
  gamepadName,
  onResetData
}: SettingsV3ModalProps) {
  if (!isOpen) return null;

  const currentLang: Language = settings.language || 'en';
  const t = getTranslation(currentLang);

  const handleTrackChange = (trackId: BGMTrack) => {
    audio.playClick();
    audio.switchTrack(trackId);
    onUpdateSettings({ ...settings, currentTrack: trackId });
  };

  const handleLanguageChange = (lang: Language) => {
    audio.playClick();
    onUpdateSettings({ ...settings, language: lang });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="liquid-glass-container w-full max-w-3xl max-h-[92vh] rounded-3xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl relative border border-white/15 text-slate-100"
        >
          {/* Top Specular Glint */}
          <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 text-xl shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                ⚙️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white font-mono tracking-tight uppercase">
                    {t.settings}
                  </h2>
                </div>
                <p className="text-xs text-slate-300">{t.settingsSubtitle}</p>
              </div>
            </div>

            <button
              onClick={() => { audio.playClick(); onClose(); }}
              className="w-9 h-9 rounded-full liquid-glass-pill text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shadow-sm transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto my-4 space-y-4 no-scrollbar">
            {/* 1. Language System: English (Default), French, Spanish */}
            <div className="p-4 rounded-3xl liquid-glass-card border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Globe className="w-4 h-4" /> {t.language} :
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {currentLang === 'en'
                      ? 'English by default • Switch anytime between English, Français, and Español'
                      : currentLang === 'es'
                      ? 'Inglés por defecto • Cambia en cualquier momento entre English, Français y Español'
                      : 'Anglais par défaut • Basculez à tout moment entre Anglais, Français et Espagnol'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {[
                  { id: 'en', label: 'English', flag: '🇬🇧', desc: currentLang === 'en' ? 'Default Language' : currentLang === 'es' ? 'Idioma por defecto' : 'Langue par défaut' },
                  { id: 'fr', label: 'Français', flag: '🇫🇷', desc: currentLang === 'en' ? 'Full French' : currentLang === 'es' ? 'Francés completo' : 'Français complet' },
                  { id: 'es', label: 'Español', flag: '🇪🇸', desc: currentLang === 'en' ? 'Full Spanish' : currentLang === 'es' ? 'Español completo' : 'Espagnol complet' }
                ].map(l => {
                  const isSelected = currentLang === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => handleLanguageChange(l.id as Language)}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                        isSelected
                          ? 'liquid-glass-pill-active border-cyan-400 text-white shadow-lg font-bold'
                          : 'liquid-glass-pill text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className="text-2xl">{l.flag}</span>
                      <span className="text-xs font-mono font-bold">{l.label}</span>
                      <span className="text-[9px] text-slate-400 font-sans">{l.desc}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Audio Section */}
            <div className="p-4 rounded-3xl liquid-glass-card border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <Volume2 className="w-4 h-4" /> {t.audioSettings} :
              </h3>

              {/* SFX Volume */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-white">{t.sfx} :</span>
                  <p className="text-[11px] text-slate-400">{t.sfxDescription}</p>
                </div>
                <button
                  onClick={() => {
                    const next = !settings.sfxEnabled;
                    audio.setSfxEnabled(next);
                    onUpdateSettings({ ...settings, sfxEnabled: next });
                  }}
                  className={`px-4 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                    settings.sfxEnabled
                      ? 'bg-cyan-400 text-slate-950 font-black shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                      : 'liquid-glass-pill text-slate-400'
                  }`}
                >
                  {settings.sfxEnabled ? t.soundOn : t.soundOff}
                </button>
              </div>

              {/* Music BGM */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-white">{t.music} :</span>
                  <p className="text-[11px] text-slate-400">{t.musicDescription}</p>
                </div>
                <button
                  onClick={() => {
                    const next = !settings.musicEnabled;
                    audio.setMusicEnabled(next);
                    onUpdateSettings({ ...settings, musicEnabled: next });
                  }}
                  className={`px-4 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                    settings.musicEnabled
                      ? 'bg-emerald-400 text-slate-950 font-black shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                      : 'liquid-glass-pill text-slate-400'
                  }`}
                >
                  {settings.musicEnabled ? t.soundOn : t.soundOff}
                </button>
              </div>

              {/* Track Selector */}
              <div>
                <span className="block text-xs font-mono text-slate-300 mb-2">
                  {t.activeTrack} :
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BGM_TRACKS.map(track => (
                    <button
                      key={track.id}
                      onClick={() => handleTrackChange(track.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        settings.currentTrack === track.id
                          ? 'liquid-glass-pill-active border-cyan-400/80 text-cyan-200 shadow-md'
                          : 'liquid-glass-pill text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-xs truncate">{track.name}</div>
                      <div className="text-[10px] text-slate-400">{track.genre}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Controller / Gamepad Section */}
            <div className="p-4 rounded-3xl liquid-glass-card border border-white/10 space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" /> {t.gamepad} :
              </h3>

              <div className="flex items-center justify-between p-3 rounded-2xl liquid-glass-pill border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full ${gamepadConnected ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                  <span className="text-xs font-mono font-bold text-white">
                    {gamepadConnected ? `${t.gamepadConnected} : ${gamepadName}` : t.gamepadDisconnected}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Thèmes d'Interface : Cyber, Noir Obsidienne, Blanc Pur */}
            <div className="p-4 rounded-3xl liquid-glass-card border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Palette className="w-4 h-4 text-cyan-400" /> {t.themeTitle} :
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold uppercase">
                  {settings.colorTheme === 'dark' ? t.themeDark : settings.colorTheme === 'light' ? t.themeLight : t.themeCyber}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {t.themeSubtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {[
                  {
                    id: 'cyber' as const,
                    name: t.themeCyber,
                    desc: currentLang === 'en' ? 'Neon Matrix & Cyan' : currentLang === 'es' ? 'Neón Matrix y Cian' : 'Néon Matrix & Cyan',
                    icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
                    previewBg: 'bg-[#080b14] border-cyan-400/50',
                    dot: 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                  },
                  {
                    id: 'dark' as const,
                    name: t.themeDark,
                    desc: currentLang === 'en' ? 'Deep Obsidian Black' : currentLang === 'es' ? 'Negro Obsidiana Puro' : 'Noir Profond & Verre Fumé',
                    icon: <Moon className="w-4 h-4 text-slate-300" />,
                    previewBg: 'bg-[#050608] border-white/40',
                    dot: 'bg-zinc-100 shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                  },
                  {
                    id: 'light' as const,
                    name: t.themeLight,
                    desc: currentLang === 'en' ? 'Pure White Ceramic' : currentLang === 'es' ? 'Blanco Puro Cerámica' : 'Blanc Céramique Épuré',
                    icon: <Sun className="w-4 h-4 text-amber-500" />,
                    previewBg: 'bg-[#eef1f5] border-slate-300',
                    dot: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                  }
                ].map(themeItem => {
                  const isSelected = (settings.colorTheme || 'cyber') === themeItem.id;
                  return (
                    <button
                      key={themeItem.id}
                      onClick={() => {
                        audio.playClick();
                        onUpdateSettings({ ...settings, colorTheme: themeItem.id });
                      }}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer relative group ${
                        isSelected
                          ? 'liquid-glass-pill-active border-cyan-400 shadow-lg scale-[1.02]'
                          : 'liquid-glass-pill text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-xl ${themeItem.previewBg} border flex items-center justify-center shadow-inner`}>
                            {themeItem.icon}
                          </div>
                          <span className="font-mono font-bold text-xs text-white">{themeItem.name}</span>
                        </div>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans">
                        <span>{themeItem.desc}</span>
                        <span className={`w-2.5 h-2.5 rounded-full ${themeItem.dot}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Play Button Customization Color */}
            <div className="p-4 rounded-3xl liquid-glass-card border border-white/10 space-y-3">
              <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-400" /> {t.playBtnColor} :
              </h3>
              <p className="text-[11px] text-slate-300">
                {t.playBtnColorDesc}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {[
                  {
                    id: 'emerald',
                    label: currentLang === 'en' ? 'Emerald Green' : currentLang === 'es' ? 'Verde Esmeralda' : 'Vert Émeraude',
                    bg: 'bg-emerald-500',
                    border: 'border-emerald-300'
                  },
                  {
                    id: 'cyan',
                    label: currentLang === 'en' ? 'Electric Cyan' : currentLang === 'es' ? 'Cian Eléctrico' : 'Cyan Électrique',
                    bg: 'bg-cyan-400',
                    border: 'border-cyan-200'
                  },
                  {
                    id: 'purple',
                    label: currentLang === 'en' ? 'Amethyst Purple' : currentLang === 'es' ? 'Violeta Amatista' : 'Violet Améthyste',
                    bg: 'bg-purple-500',
                    border: 'border-purple-300'
                  },
                  {
                    id: 'rose',
                    label: currentLang === 'en' ? 'Ruby Red' : currentLang === 'es' ? 'Rojo Rubí' : 'Rouge Rubis',
                    bg: 'bg-rose-500',
                    border: 'border-rose-300'
                  },
                  {
                    id: 'amber',
                    label: currentLang === 'en' ? 'Solar Gold' : currentLang === 'es' ? 'Oro Solar' : 'Or Solaire',
                    bg: 'bg-amber-400',
                    border: 'border-yellow-200'
                  },
                  {
                    id: 'zinc',
                    label: currentLang === 'en' ? 'Obsidian Black' : currentLang === 'es' ? 'Negro Obsidiana' : 'Noir Obsidienne',
                    bg: 'bg-zinc-900',
                    border: 'border-white/50'
                  },
                  {
                    id: 'white',
                    label: currentLang === 'en' ? 'Pure White' : currentLang === 'es' ? 'Blanco Puro' : 'Blanc Pur',
                    bg: 'bg-white',
                    border: 'border-slate-400'
                  }
                ].map(c => {
                  const isSelected = (settings.playButtonColor || 'emerald') === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        audio.playClick();
                        onUpdateSettings({ ...settings, playButtonColor: c.id as any });
                      }}
                      className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'liquid-glass-pill-active border-white shadow-md font-bold'
                          : 'liquid-glass-pill text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${c.bg} border ${c.border} shadow-sm shrink-0`} />
                      <span className="text-[11px] font-mono truncate">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Data Reset */}
            <div className="p-4 rounded-3xl liquid-glass-card border border-rose-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-rose-400">{t.resetData} :</span>
                <p className="text-[11px] text-slate-400">{t.resetPrompt}</p>
              </div>
              <button
                onClick={() => {
                  audio.playHit();
                  onResetData();
                }}
                className="px-4 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-mono font-bold cursor-pointer transition-all active:scale-95"
              >
                RESET
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>{t.autoSaveNotice}</span>
            <span className="text-cyan-400 font-bold">Vertex Arcades</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
