import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Edit3, Check, Tag, Sparkles, Shield, Trophy, Coins, Search } from 'lucide-react';
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
  { id: 'cyber_agent', name: 'Agent Cybernétique', emoji: '🧑‍🚀' },
  { id: 'cyber_ninja', name: 'Ninja Cybernétique', emoji: '🥷' },
  { id: 'blocky_knight', name: 'Chevalier Voxel', emoji: '🛡️' },
  { id: 'neon_kitty', name: 'Néon Kitty VIP', emoji: '🐱' },
  { id: 'void_lord', name: 'Seigneur du Néant', emoji: '🧙‍♂️' },
  { id: 'apex_robot', name: 'Titan Robot Apex', emoji: '🤖' }
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
  const [selectedTags, setSelectedTags] = useState<string[]>(profile.selectedTags || ['Pro Gamer', 'Obby King', 'Trader']);
  const [tagSearch, setTagSearch] = useState('');

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    audio.playClick();
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      if (selectedTags.length >= 8) return; // Max 8 tags active
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
      selectedTags
    });
    onClose();
  };

  const filteredTags = PROFILE_TAGS_54.filter(t =>
    t.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-[#0c1224] border-2 border-cyan-500/60 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.4)] flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/30 bg-[#080d1a]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 border border-cyan-300 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                👤
              </div>
              <div>
                <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 font-mono">
                  CRÉATEUR DE PROFIL VERTEX 3.0
                </h2>
                <p className="text-xs text-cyan-400 font-mono">
                  Personnalisez votre avatar, pseudonyme, bio et vos étiquettes (+50 disponibles)
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
            {/* Top Row: Live Avatar Preview & Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl bg-[#080d1a] border border-cyan-500/30">
              {/* Avatar Preview */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <div
                  className="w-28 h-28 rounded-3xl border-4 border-cyan-400 flex items-center justify-center text-6xl shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                  style={{ backgroundColor: avatarColor }}
                >
                  {AVATAR_OPTIONS.find(a => a.id === avatarModel)?.emoji || '🧑‍🚀'}
                </div>
                <div className="text-center">
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                    {profile.title || 'JOUEUR APEX'}
                  </span>
                  <h3 className="text-lg font-black text-white font-mono mt-0.5">{username}</h3>
                </div>
              </div>

              {/* Form Fields: Pseudo & Bio */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                    Pseudonyme Joueur :
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={20}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white font-bold font-mono text-sm outline-none"
                    placeholder="Votre pseudo..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                    Description & Bio du Profil :
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    maxLength={120}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 focus:border-cyan-400 text-white text-xs outline-none resize-none"
                    placeholder="Racontez votre histoire..."
                  />
                </div>

                {/* Selected Tags Showcase */}
                <div>
                  <label className="block text-xs font-mono font-bold text-cyan-300 mb-1.5">
                    Étiquettes Actives ({selectedTags.length}/8) :
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTags.map(tag => (
                      <span
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-200 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer hover:bg-rose-500/20 hover:border-rose-400 hover:text-rose-300 transition-colors"
                      >
                        {tag} <X className="w-3 h-3" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Avatar Selection */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
                Choisissez votre Avatar :
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {AVATAR_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { audio.playClick(); setAvatarModel(opt.id); }}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                      avatarModel === opt.id
                        ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'bg-[#080d1a] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <span className="text-[11px] font-bold text-center text-slate-300 leading-tight">
                      {opt.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 50+ Description Tags Selection with Search */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Tag className="w-4 h-4 text-cyan-400" /> Étiquettes de Description (+50 disponibles) :
                </h4>
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    placeholder="Filtrer les étiquettes..."
                    className="pl-8 pr-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Tags Grid */}
              <div className="p-4 rounded-2xl bg-[#080d1a] border border-slate-800 flex flex-wrap gap-2 max-h-56 overflow-y-auto">
                {filteredTags.map(tag => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
                      }`}
                    >
                      {tag} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer with Save Button */}
          <div className="px-6 py-4 border-t border-cyan-500/30 bg-[#080d1a] flex items-center justify-end gap-3">
            <button
              onClick={() => { audio.playClick(); onClose(); }}
              className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase cursor-pointer"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" /> ENREGISTRER LE PROFIL
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
