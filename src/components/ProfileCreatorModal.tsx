import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Camera, Upload, Trash2, Check, Tag, Sparkles,
  Shield, Trophy, Coins, Search, Image as ImageIcon
} from 'lucide-react';
import { audio } from '../utils/audio';
import { UserProfile } from '../types';
import { PROFILE_TAGS_79 } from '../gamesData';
import { Language, getTranslation } from '../utils/i18n';

interface ProfileCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
  totalTrophies: number;
  rankPoints: number;
  language?: Language;
}

export function ProfileCreatorModal({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  totalTrophies,
  rankPoints,
  language = 'en'
}: ProfileCreatorModalProps) {
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || 'Passionné de jeux arcade & métaverse !');
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | undefined>(profile.customAvatarUrl);
  const [selectedTags, setSelectedTags] = useState<string[]>(profile.selectedTags || ['Pro Gamer', 'Speedrunner', 'Trader']);
  const [tagSearch, setTagSearch] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const t = getTranslation(language);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
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
      customAvatarUrl,
      selectedTags
    });
    onClose();
  };

  const filteredTags = PROFILE_TAGS_79.filter(tag =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const initialLetter = (username.trim()[0] || 'V').toUpperCase();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="liquid-glass-container w-full max-w-4xl max-h-[92vh] rounded-3xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl relative border border-white/15 text-slate-100"
        >
          {/* Top Glint */}
          <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent pointer-events-none" />

          {/* Modal Header without 'Liquid Glass' phrase and without version badge */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white font-mono tracking-tight uppercase">
                  {t.playerProfile}
                </h2>
                <p className="text-xs text-slate-300">{t.profileSubtitle}</p>
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
                    className="w-32 h-32 rounded-3xl border-2 border-cyan-400/70 overflow-hidden flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.35)] relative bg-gradient-to-br from-cyan-950 via-slate-900 to-indigo-950"
                  >
                    {customAvatarUrl ? (
                      <img
                        src={customAvatarUrl}
                        alt="Photo de profil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      /* Display first letter of username when no photo uploaded */
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 font-mono font-black text-white text-5xl select-none shadow-inner">
                        {initialLetter}
                      </div>
                    )}
                  </div>

                  {/* Camera overlay button on hover */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-3xl bg-slate-950/60 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer text-cyan-300"
                    title={customAvatarUrl ? t.replacePhoto : t.uploadPhoto}
                  >
                    <Camera className="w-6 h-6" />
                    <span className="text-[10px] font-mono font-bold">{t.uploadPhoto}</span>
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
                    <span>{customAvatarUrl ? t.replacePhoto : t.uploadPhoto}</span>
                  </button>

                  {customAvatarUrl && (
                    <button
                      onClick={removeCustomPhoto}
                      className="p-1.5 rounded-xl liquid-glass-pill text-rose-400 hover:text-rose-300 hover:border-rose-400/50 cursor-pointer shadow-sm"
                      title={t.deletePhoto}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-center">
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider block">
                    {profile.title || 'VÉTÉRAN VERTEX'}
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
                    {t.username} :
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={20}
                    className="w-full px-4 py-2.5 rounded-2xl liquid-glass-input text-white font-bold font-mono text-sm outline-none"
                    placeholder={language === 'en' ? 'Your username...' : language === 'es' ? 'Tu nombre de usuario...' : 'Votre pseudo...'}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                    {t.bio} :
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    maxLength={120}
                    className="w-full px-4 py-2.5 rounded-2xl liquid-glass-input text-white text-xs outline-none resize-none font-sans"
                    placeholder={t.bioPlaceholder}
                  />
                </div>

                {/* Selected Tags Showcase */}
                <div>
                  <label className="block text-xs font-mono font-bold text-cyan-300 mb-1.5">
                    {t.activeBadges} ({selectedTags.length}/8) :
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

            {/* 2. 75+ Description Tags (+25 New) with Search Filter */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-cyan-400" /> {t.tagsCatalog} ({PROFILE_TAGS_79.length}) :
                </h4>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    placeholder={t.filterTags}
                    className="pl-8 pr-3 py-1 rounded-xl liquid-glass-input text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl liquid-glass-card border border-white/5 flex flex-wrap gap-2 max-h-56 overflow-y-auto no-scrollbar">
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
              {t.cancel}
            </button>
            <button
              onClick={handleSave}
              className="px-7 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black font-mono text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" /> {t.saveProfile}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
