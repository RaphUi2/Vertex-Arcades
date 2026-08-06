import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Volume2, VolumeX, Monitor, Sparkles, Download, Upload, RotateCcw, X, User, Check } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  username?: string;
  onUpdateUsername?: (newUsername: string) => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetData: () => void;
  onExportData: () => void;
  onImportData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  username = 'Pilote_Pixel',
  onUpdateUsername,
  onUpdateSettings,
  onResetData,
  onExportData,
  onImportData
}) => {
  const [pseudoInput, setPseudoInput] = useState(username);
  const [pseudoSaved, setPseudoSaved] = useState(false);

  if (!isOpen) return null;

  const handleSavePseudo = () => {
    if (pseudoInput.trim().length > 0 && onUpdateUsername) {
      onUpdateUsername(pseudoInput.trim());
      setPseudoSaved(true);
      setTimeout(() => setPseudoSaved(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900/90 border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-cyan-400">
                <Settings size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2">
                  PARAMÈTRES D'ARCADE <span className="text-xs bg-cyan-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">V2.0</span>
                </h2>
                <p className="text-xs text-slate-400">Personnalisez votre expérience visuelle et audio</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Settings Options */}
          <div className="p-5 space-y-5 overflow-y-auto flex-1">
            {/* Pseudonym Edit */}
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-3">
                <User size={20} className="text-cyan-400" />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-100">Changer de Pseudonyme</h4>
                  <p className="text-xs text-slate-400">Nom affiché sur les classements et le profil</p>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={pseudoInput}
                  onChange={(e) => setPseudoInput(e.target.value)}
                  placeholder="Votre pseudo..."
                  maxLength={18}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={handleSavePseudo}
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase rounded-xl transition cursor-pointer flex items-center gap-1 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                >
                  {pseudoSaved ? <Check size={14} /> : 'Enregistrer'}
                </button>
              </div>
              {pseudoSaved && <p className="text-[10px] text-emerald-400 font-bold">✓ Pseudonyme mis à jour !</p>}
            </div>

            {/* Audio SFX */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                {settings.sfxEnabled ? <Volume2 size={20} className="text-cyan-400" /> : <VolumeX size={20} className="text-slate-500" />}
                <div>
                  <h4 className="font-extrabold text-sm text-slate-100">Effets Sonores SFX</h4>
                  <p className="text-xs text-slate-400">Sons de clics, victoires et bruits d'arcade</p>
                </div>
              </div>
              <button
                onClick={() => onUpdateSettings({ sfxEnabled: !settings.sfxEnabled })}
                className={`w-12 h-6 rounded-full transition-colors cursor-pointer p-1 relative ${
                  settings.sfxEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-slate-950 rounded-full transition-transform ${
                    settings.sfxEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* CRT Scanline Filter */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <Monitor size={20} className="text-purple-400" />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-100">Filtre Écran CRT Rétro</h4>
                  <p className="text-xs text-slate-400">Lignes de balayage cathodique rétro</p>
                </div>
              </div>
              <button
                onClick={() => onUpdateSettings({ crtFilter: !settings.crtFilter })}
                className={`w-12 h-6 rounded-full transition-colors cursor-pointer p-1 relative ${
                  settings.crtFilter ? 'bg-purple-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-slate-950 rounded-full transition-transform ${
                    settings.crtFilter ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Particle Density */}
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="text-amber-400" />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-100">Densité de Particules</h4>
                  <p className="text-xs text-slate-400">Intensité des effets d'arrière-plan</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                {(['faible', 'normal', 'extreme'] as const).map((density) => (
                  <button
                    key={density}
                    onClick={() => onUpdateSettings({ particleDensity: density })}
                    className={`py-1.5 rounded-lg text-xs font-extrabold uppercase cursor-pointer border transition ${
                      settings.particleDensity === density
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {density}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Management */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Sauvegarde & Profil</h4>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onExportData}
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs cursor-pointer border border-slate-700 transition"
                >
                  <Download size={14} /> Exporter Sauvegarde
                </button>
                <button
                  onClick={onImportData}
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs cursor-pointer border border-slate-700 transition"
                >
                  <Upload size={14} /> Importer Sauvegarde
                </button>
              </div>

              <button
                onClick={onResetData}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded-xl font-black text-xs uppercase cursor-pointer transition"
              >
                <RotateCcw size={14} /> Réinitialiser Profil & Progression
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
