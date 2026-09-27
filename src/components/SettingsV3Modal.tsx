import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Volume2, VolumeX, Music, Gamepad2, Eye, RotateCcw, Check, Sparkles, Moon, Sun, Palette, Play } from 'lucide-react';
import { audio, BGM_TRACKS, BGMTrack } from '../utils/audio';
import { AppSettings } from '../types';

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

  const handleTrackChange = (trackId: BGMTrack) => {
    audio.playClick();
    audio.switchTrack(trackId);
    onUpdateSettings({ ...settings, currentTrack: trackId });
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
                  <h2 className="text-lg font-black text-white font-mono tracking-tight">
                    PARAMÈTRES DU SYSTÈME
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    LIQUID GLASS
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Audio, Musique ambiante, Graphismes, Mode Noir & Blanc & Manette
                </p>
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
          <div className="flex-1 overflow-y-auto my-4 space-y-5 no-scrollbar">
            {/* Audio Section */}
            <div className="p-4 rounded-3xl liquid-glass-card border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <Volume2 className="w-4 h-4" /> Audio & Musiques de Fond :
              </h3>

              {/* SFX Volume */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-white">Effets Sonores (SFX) :</span>
                  <p className="text-[11px] text-slate-400">Sons de tir, sauts, pièces et clics</p>
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
                  {settings.sfxEnabled ? 'ACTIVÉ 🔊' : 'COUPÉ 🔇'}
                </button>
              </div>

              {/* Music BGM */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-white">Musique de Fond (BGM Synth) :</span>
                  <p className="text-[11px] text-slate-400">Boucles ambiantes procédurales rétro-cyber</p>
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
                  {settings.musicEnabled ? 'ACTIVÉE 🎶' : 'ÉTEINTE 🔇'}
                </button>
              </div>

              {/* Track Selector */}
              <div>
                <span className="block text-xs font-mono text-slate-300 mb-2">
                  Piste Musicale Active :
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

            {/* Controller / Gamepad Section */}
            <div className="p-4 rounded-3xl liquid-glass-card border border-white/10 space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" /> Support Manette / Contrôleur :
              </h3>

              <div className="flex items-center justify-between p-3 rounded-2xl liquid-glass-pill border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full ${gamepadConnected ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                  <span className="text-xs font-mono font-bold text-white">
                    {gamepadConnected ? `Connectée : ${gamepadName}` : 'Aucune manette détectée (Branchez ou allumez une manette Xbox/PS)'}
                  </span>
                </div>
              </div>

              {/* Keybindings mapping */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-300">
                <div className="p-2.5 rounded-xl liquid-glass-pill border-white/5">
                  <strong className="text-cyan-300">Bouton A (Croix) :</strong> Valider
                </div>
                <div className="p-2.5 rounded-xl liquid-glass-pill border-white/5">
                  <strong className="text-rose-300">Bouton B (Rond) :</strong> Retour
                </div>
                <div className="p-2.5 rounded-xl liquid-glass-pill border-white/5">
                  <strong className="text-yellow-300">Bouton X (Carré) :</strong> Cœur
                </div>
                <div className="p-2.5 rounded-xl liquid-glass-pill border-white/5">
                  <strong className="text-purple-300">Bouton Y (Triangle) :</strong> Profil
                </div>
              </div>
            </div>

            {/* Graphics, Black & White Mode & Data Reset */}
            <div className="p-4 rounded-3xl liquid-glass-card border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <Eye className="w-4 h-4" /> Graphismes & Affichage :
              </h3>

              {/* Thème de Couleur (Bleu Cyber, Noir Sombre, Blanc Clair) */}
              <div className="p-3.5 rounded-2xl liquid-glass-pill border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-cyan-300" /> Thème d'Interface :
                    </span>
                    <p className="text-[11px] text-slate-300">
                      Changez les accents bleus en noir obsidienne ou en blanc épuré sans altérer les couleurs des jeux !
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {/* Cyber Theme (Default Blue) */}
                  <button
                    onClick={() => {
                      audio.playClick();
                      onUpdateSettings({ ...settings, colorTheme: 'cyber', monochromeMode: false });
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      (settings.colorTheme === 'cyber' || (!settings.colorTheme && !settings.monochromeMode))
                        ? 'liquid-glass-pill-active border-cyan-400 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'liquid-glass-pill text-slate-300 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-mono font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Cyber Néon
                      </div>
                      <div className="text-[10px] text-slate-400">Bleu électrique original</div>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-cyan-400 border border-white shadow-sm" />
                  </button>

                  {/* Dark Theme */}
                  <button
                    onClick={() => {
                      audio.playClick();
                      onUpdateSettings({ ...settings, colorTheme: 'dark', monochromeMode: false });
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      settings.colorTheme === 'dark' || (settings.monochromeMode && settings.colorTheme !== 'light')
                        ? 'bg-zinc-900 border-zinc-200 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)] font-black'
                        : 'liquid-glass-pill text-slate-300 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-mono font-bold flex items-center gap-1.5">
                        <Moon className="w-3.5 h-3.5 text-zinc-300" /> Noir Sombre
                      </div>
                      <div className="text-[10px] text-slate-400">Accents noirs & platine</div>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-zinc-950 border border-white/80 shadow-sm" />
                  </button>

                  {/* Light Theme */}
                  <button
                    onClick={() => {
                      audio.playClick();
                      onUpdateSettings({ ...settings, colorTheme: 'light', monochromeMode: false });
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      settings.colorTheme === 'light'
                        ? 'bg-white text-slate-950 border-slate-900 shadow-[0_0_15px_rgba(255,255,255,0.6)] font-black'
                        : 'liquid-glass-pill text-slate-300 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-mono font-bold flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-500" /> Blanc Clair
                      </div>
                      <div className="text-[10px] text-slate-400">Fond blanc givré épuré</div>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-slate-100 border border-slate-700 shadow-sm" />
                  </button>
                </div>
              </div>

              {/* Couleur du Bouton Jouer */}
              <div className="p-3.5 rounded-2xl liquid-glass-pill border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                      <Play className="w-4 h-4 text-emerald-400" /> Couleur du Bouton "JOUER" :
                    </span>
                    <p className="text-[11px] text-slate-300">
                      Personnalisez la couleur de tous les boutons de lancement des jeux du catalogue
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {[
                    { id: 'emerald', label: 'Vert Émeraude', bg: 'bg-emerald-500', border: 'border-emerald-300' },
                    { id: 'cyan', label: 'Cyan Électrique', bg: 'bg-cyan-400', border: 'border-cyan-200' },
                    { id: 'purple', label: 'Violet Améthyste', bg: 'bg-purple-500', border: 'border-purple-300' },
                    { id: 'rose', label: 'Rouge Rubis', bg: 'bg-rose-500', border: 'border-rose-300' },
                    { id: 'amber', label: 'Or Solaire', bg: 'bg-amber-400', border: 'border-yellow-200' },
                    { id: 'zinc', label: 'Noir Obsidienne', bg: 'bg-zinc-900', border: 'border-white/50' },
                    { id: 'white', label: 'Blanc Pur', bg: 'bg-white', border: 'border-slate-400' }
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

              {/* Glow effects */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-white">Effets de Lueur / Bloom :</span>
                  <p className="text-[11px] text-slate-400">Halos néon autour des cartes et des boutons</p>
                </div>
                <button
                  onClick={() => onUpdateSettings({ ...settings, glowEffects: !settings.glowEffects })}
                  className={`px-4 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                    settings.glowEffects ? 'bg-purple-500 text-white font-bold' : 'liquid-glass-pill text-slate-400'
                  }`}
                >
                  {settings.glowEffects ? 'ACTIF ✨' : 'DÉSACTIVÉ'}
                </button>
              </div>

              {/* Data Reset */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-rose-400">Réinitialiser les données :</span>
                  <p className="text-[11px] text-slate-400">Efface la sauvegarde locale et remet l'arcade à neuf</p>
                </div>
                <button
                  onClick={() => {
                    audio.playHit();
                    onResetData();
                  }}
                  className="px-4 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-mono font-bold cursor-pointer transition-all active:scale-95"
                >
                  RÉINITIALISER
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Sauvegarde automatique immédiate de vos préférences</span>
            <span className="text-cyan-400 font-bold">Système v3.2</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
