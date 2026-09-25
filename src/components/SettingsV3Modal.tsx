import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Volume2, VolumeX, Music, Gamepad2, Eye, RotateCcw, Check } from 'lucide-react';
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[92vh] bg-[#0d1222] border-2 border-slate-700 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#080d1a]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-300 text-2xl shadow-inner">
                ⚙️
              </div>
              <div>
                <h2 className="text-xl font-black text-white font-mono">
                  PARAMÈTRES DU SYSTÈME
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Configuration Audio, Musique de fond, Graphismes et Support Manette
                </p>
              </div>
            </div>

            <button
              onClick={() => { audio.playClick(); onClose(); }}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Audio Section */}
            <div className="p-5 rounded-3xl bg-[#12182c] border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-2">
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
                    settings.sfxEnabled ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {settings.sfxEnabled ? 'ACTIVÉ 🔊' : 'COUPE 🔇'}
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
                    settings.musicEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
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
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-xs truncate">{track.name}</div>
                      <div className="text-[10px] text-slate-500">{track.genre}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Controller / Gamepad Section */}
            <div className="p-5 rounded-3xl bg-[#12182c] border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" /> Support Manette / Contrôleur :
              </h3>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full ${gamepadConnected ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                  <span className="text-xs font-mono font-bold text-white">
                    {gamepadConnected ? `Connectée : ${gamepadName}` : 'Aucune manette détectée (Branchez ou allumez une manette Xbox/PS)'}
                  </span>
                </div>
              </div>

              {/* Keybindings mapping */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-300">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <strong className="text-cyan-300">Bouton A (Croix) :</strong> Valider / Jouer
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <strong className="text-rose-300">Bouton B (Rond) :</strong> Fermer / Retour
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <strong className="text-yellow-300">Bouton X (Carré) :</strong> Favori (Cœur)
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <strong className="text-purple-300">Bouton Y (Triangle) :</strong> Profil
                </div>
              </div>
            </div>

            {/* Graphics & Data Reset */}
            <div className="p-5 rounded-3xl bg-[#12182c] border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <Eye className="w-4 h-4" /> Graphismes & Données :
              </h3>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-white">Effets de Lueur / Bloom :</span>
                  <p className="text-[11px] text-slate-400">Halos néon autour des cartes et des boutons</p>
                </div>
                <button
                  onClick={() => onUpdateSettings({ ...settings, glowEffects: !settings.glowEffects })}
                  className={`px-4 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                    settings.glowEffects ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {settings.glowEffects ? 'ACTIF ✨' : 'DÉSACTIVÉ'}
                </button>
              </div>

              {/* Data Reset */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-rose-400">Réinitialiser les données :</span>
                  <p className="text-[11px] text-slate-500">Efface la sauvegarde locale et remet l'arcade à neuf</p>
                </div>
                <button
                  onClick={() => {
                    audio.playHit();
                    onResetData();
                  }}
                  className="px-4 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-mono font-bold cursor-pointer transition-all"
                >
                  RÉINITIALISER
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
