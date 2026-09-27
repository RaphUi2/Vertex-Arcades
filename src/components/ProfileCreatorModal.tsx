import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Camera, Upload, Trash2, Check, Tag, Sparkles,
  Shield, Trophy, Coins, Search, Palette, Image as ImageIcon
} from 'lucide-react';
import { audio } from '../utils/audio';
import { UserProfile } from '../types';
import { PROFILE_TAGS_54 } from '../gamesData';

interface ProfileCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
  totalTrophies: number;
  rankPoints: number;
}

const AVATAR_OPTIONS = [
  { id: 'cyber_agent', name: 'Agent Cyber', emoji: '🧑‍🚀' },
  { id: 'cyber_ninja', name: 'Ninja Cyber', emoji: '🥷' },
  { id: 'cyber_knight', name: 'Chevalier Cyber', emoji: '🛡️' },
  { id: 'neon_kitty', name: 'Néon Kitty', emoji: '🐱' },
  { id: 'void_lord', name: 'Mage du Néant', emoji: '🧙‍♂️' },
  { id: 'apex_robot', name: 'Robot Titan', emoji: '🤖' }
];

const PRESET_COLORS = [
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f59e0b', '#10b981', '#14b8a6', '#6366f1', '#64748b'
];

export function ProfileCreatorModal({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  totalTrophies,
  rankPoints
}: ProfileCreatorModalProps) {
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || 'Passionné de jeux arcade & métaverse !');
  const [avatarModel, setAvatarModel] = useState(profile.avatarModel || 'cyber_agent');
  const [avatarColor, setAvatarColor] = useState(profile.avatarColor || '#06b6d4');
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | undefined>(profile.customAvatarUrl);
  const [selectedTags, setSelectedTags] = useState<string[]>(profile.selectedTags || ['Pro Gamer', 'Speedrunner', 'Trader']);
  const [tagSearch, setTagSearch] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize to 256x256 max for instant localStorage saving & high fidelity
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, startX, startY, size, size, 0, 0, 256, 256);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setCustomAvatarUrl(compressedDataUrl);
          audio.playWin();
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const removeCustomPhoto = () => {
    audio.playClick();
    setCustomAvatarUrl(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleTag = (tag: string) => {
    audio.playClick();
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      if (selectedTags.length >= 8) return;
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSave = () => {
    audio.playWin();
    onSaveProfile({
      ...profile,
      username: username.trim() || 'CYBER_HERO',
      bio,
      avatarModel,
      avatarColor,
      customAvatarUrl,
      selectedTags
    });
    onClose();
  };

  const filteredTags = PROFILE_TAGS_54.filter(t =>
    t.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="liquid-glass-container w-full max-w-4xl max-h-[92vh] rounded-3xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl relative border border-white/15"
        >
          {/* Top Glint */}
          <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white font-mono tracking-tight">
                    PROFIL JOUEUR LIQUID GLASS
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    v3.2
                  </span>
                </div>
                <p className="text-xs text-slate-300">Photo personnalisée, avatar, bio & badges communautaires</p>
              </div>
            </div>

            <button
              onClick={() => { audio.playClick(); onClose(); }}
              className="w-9 h-9 rounded-full liquid-glass-pill text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 my-4 overflow-y-auto space-y-6 no-scrollbar">
            {/* 1. Profile Photo & Identity Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 rounded-3xl liquid-glass-card border border-white/10">
              {/* Photo / Avatar Showcase & Upload Action */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative group">
                  <div
                    className="w-32 h-32 rounded-3xl border-2 border-cyan-400/70 overflow-hidden flex items-center justify-center text-6xl shadow-[0_0_25px_rgba(6,182,212,0.35)] relative"
                    style={{ backgroundColor: customAvatarUrl ? 'transparent' : avatarColor }}
                  >
                    {customAvatarUrl ? (
                      <img
                        src={customAvatarUrl}
                        alt="Photo de profil personnalisée"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      AVATAR_OPTIONS.find(a => a.id === avatarModel)?.emoji || '🧑‍🚀'
                    )}
                  </div>

                  {/* Camera overlay button on hover */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-3xl bg-slate-950/60 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer text-cyan-300"
                    title="Changer la photo"
                  >
                    <Camera className="w-6 h-6" />
                    <span className="text-[10px] font-mono font-bold">Modifier</span>
                  </button>
                </div>

                {/* Upload & Delete Controls */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl liquid-glass-pill text-[11px] font-mono font-bold text-cyan-300 hover:text-white flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{customAvatarUrl ? 'Remplacer photo' : 'Importer photo'}</span>
                  </button>

                  {customAvatarUrl && (
                    <button
                      onClick={removeCustomPhoto}
                      className="p-1.5 rounded-xl liquid-glass-pill text-rose-400 hover:text-rose-300 hover:border-rose-400/50 cursor-pointer shadow-sm"
                      title="Supprimer la photo personnalisée"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-center">
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider block">
                    {(profile.title || 'VÉTÉRAN VERTEX 3.2')
                      .replace(/roblox/gi, 'Vertex')
                      .replace(/3\.0/g, '3.2')}
                  </span>
                  <h3 className="text-base font-black text-white font-mono">{username}</h3>
                  <div className="mt-1 flex items-center justify-center gap-1 text-[9px] font-mono text-yellow-300 font-bold liquid-glass-vc px-2 py-0.5 rounded-md w-fit mx-auto shadow-sm">
                    <Coins className="w-2.5 h-2.5 fill-current text-yellow-400" />
                    <span>{(profile.totalVCoins ?? 0).toLocaleString()} VC</span>
                  </div>
                </div>
              </div>

              {/* Pseudo & Bio Form */}
              <div className="md:col-span-2 space-y-3.5">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                    Pseudonyme Joueur :
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={20}
                    className="w-full px-4 py-2.5 rounded-2xl liquid-glass-input text-white font-bold font-mono text-sm outline-none"
                    placeholder="Votre pseudo..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                    Bio & Citation du Profil :
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    maxLength={120}
                    className="w-full px-4 py-2.5 rounded-2xl liquid-glass-input text-white text-xs outline-none resize-none font-sans"
                    placeholder="Racontez votre parcours sur Vertex..."
                  />
                </div>

                {/* Selected Tags Showcase */}
                <div>
                  <label className="block text-xs font-mono font-bold text-cyan-300 mb-1.5">
                    Badges & Tags Actifs ({selectedTags.length}/8) :
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTags.map(tag => (
                      <span
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="px-2.5 py-1 rounded-full liquid-glass-pill border-cyan-400/40 text-cyan-200 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer hover:border-rose-400/60 hover:text-rose-300 transition-colors"
                      >
                        {tag} <X className="w-3 h-3" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Avatar Model & Background Tint */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Modèle d'Avatar (si aucune photo importée) :
                </h4>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {AVATAR_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { audio.playClick(); setAvatarModel(opt.id); }}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      avatarModel === opt.id && !customAvatarUrl
                        ? 'liquid-glass-pill-active'
                        : 'liquid-glass-pill'
                    }`}
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <span className="text-[10px] font-mono font-bold text-center text-slate-300 leading-tight">
                      {opt.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Tint Colors */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-cyan-400" /> Couleur d'Ambiance de l'Avatar :
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => { audio.playClick(); setAvatarColor(c); }}
                      className={`w-7 h-7 rounded-xl transition-all cursor-pointer border ${
                        avatarColor === c ? 'scale-125 border-white shadow-[0_0_10px_white]' : 'border-transparent hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 3. 50+ Description Tags with Search Filter */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-cyan-400" /> Catalogue des Étiquettes (+50 disponibles) :
                </h4>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    placeholder="Filtrer un tag..."
                    className="pl-8 pr-3 py-1 rounded-xl liquid-glass-input text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl liquid-glass-card border border-white/5 flex flex-wrap gap-2 max-h-48 overflow-y-auto no-scrollbar">
                {filteredTags.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-400 text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                          : 'liquid-glass-pill text-slate-300 hover:text-white'
                      }`}
                    >
                      {tag} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Footer with Save Action */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              onClick={() => { audio.playClick(); onClose(); }}
              className="px-5 py-2.5 rounded-2xl liquid-glass-pill text-slate-300 hover:text-white font-mono text-xs uppercase cursor-pointer"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-7 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black font-mono text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" /> ENREGISTRER LE PROFIL
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
