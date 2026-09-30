import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Camera, Upload, Trash2, Check, Tag, Sparkles,
  Shield, Trophy, Coins, Search, Users, Swords, Gamepad2,
  Copy, ShieldCheck, Flame, MessageSquare, Mic, Smartphone,
  Keyboard, Crown, Star, Eye, Heart, Layers, Radio
} from 'lucide-react';
import { audio } from '../utils/audio';
import { UserProfile } from '../types';
import { PROFILE_TAGS_79, GAMES_LIST } from '../gamesData';
import { Language, getTranslation } from '../utils/i18n';
import { GameCardIllustration } from './GameCardIllustration';

interface ProfileCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
  totalTrophies: number;
  rankPoints: number;
  language?: Language;
  onShowToast?: (msg: string) => void;
}

export const SOCIAL_STATUSES = [
  {
    id: 'ready_for_duel' as const,
    labelFr: 'Prêt pour un duel 1v1',
    labelEn: 'Ready for 1v1 Duel',
    labelEs: 'Listo para Duelo 1v1',
    emoji: '⚔️',
    color: 'border-rose-400/60 text-rose-300 bg-rose-500/15 shadow-[0_0_12px_rgba(244,63,94,0.3)]',
    dot: 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
  },
  {
    id: 'looking_for_squad' as const,
    labelFr: 'Recherche une escouade',
    labelEn: 'Looking for Squad',
    labelEs: 'Buscando Escuadra',
    emoji: '🚀',
    color: 'border-cyan-400/60 text-cyan-300 bg-cyan-500/15 shadow-[0_0_12px_rgba(6,182,212,0.3)]',
    dot: 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
  },
  {
    id: 'tryhard' as const,
    labelFr: 'Mode Tryhard & Record',
    labelEn: 'Tryhard & High Score',
    labelEs: 'Modo Tryhard y Récords',
    emoji: '🏆',
    color: 'border-amber-400/60 text-amber-300 bg-amber-500/15 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
    dot: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
  },
  {
    id: 'chill' as const,
    labelFr: 'Chill & Détente',
    labelEn: 'Chill & Casual Gaming',
    labelEs: 'Chill y Relax',
    emoji: '☕',
    color: 'border-emerald-400/60 text-emerald-300 bg-emerald-500/15 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
    dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
  },
  {
    id: 'grinding_achievements' as const,
    labelFr: 'Chasseur de Succès',
    labelEn: 'Grinding Achievements',
    labelEs: 'Cazando Logros',
    emoji: '🎯',
    color: 'border-purple-400/60 text-purple-300 bg-purple-500/15 shadow-[0_0_12px_rgba(168,85,247,0.3)]',
    dot: 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]'
  },
  {
    id: 'dnd' as const,
    labelFr: 'Ne pas déranger (En session)',
    labelEn: 'Do Not Disturb',
    labelEs: 'No Molestar',
    emoji: '⛔',
    color: 'border-red-400/60 text-red-300 bg-red-500/15 shadow-[0_0_12px_rgba(239,68,68,0.3)]',
    dot: 'bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
  },
  {
    id: 'afk' as const,
    labelFr: 'Absent / Pause',
    labelEn: 'AFK / On Break',
    labelEs: 'Ausente / Pausa',
    emoji: '💤',
    color: 'border-slate-400/40 text-slate-300 bg-slate-500/15',
    dot: 'bg-slate-400'
  }
];

export const GAMER_ARCHETYPES = [
  {
    id: 'speedrunner' as const,
    labelFr: 'Speedrunner',
    labelEn: 'Speedrunner',
    labelEs: 'Speedrunner',
    emoji: '⚡',
    descFr: 'Réflexes éclairs & courses parfaites',
    descEn: 'Lightning reflexes & record times',
    descEs: 'Reflejos rápidos y récords'
  },
  {
    id: 'tryhard' as const,
    labelFr: 'Compétiteur / Pro',
    labelEn: 'Competitive / Pro',
    labelEs: 'Competitivo / Pro',
    emoji: '⚔️',
    descFr: 'Focus sur les victoires et la Ligue',
    descEn: 'Focus on victories & ladder ranks',
    descEs: 'Enfocado en victorias y rango'
  },
  {
    id: 'completionist' as const,
    labelFr: 'Complétionniste 100%',
    labelEn: '100% Completionist',
    labelEs: 'Completista 100%',
    emoji: '🎯',
    descFr: 'Débloque chaque succès et trophée',
    descEn: 'Unlocks every achievement & badge',
    descEs: 'Desbloquea cada logro y medalla'
  },
  {
    id: 'teamplayer' as const,
    labelFr: 'Coéquipier d\'Escouade',
    labelEn: 'Team Player / Duo',
    labelEs: 'Jugador de Equipo',
    emoji: '🤝',
    descFr: 'Loyal, solidaire et adepte du multi',
    descEn: 'Supportive, loyal & multiplayer fan',
    descEs: 'Apoyo constante y fan multijugador'
  },
  {
    id: 'collector' as const,
    labelFr: 'Collectionneur Cosmique',
    labelEn: 'Cosmic Collector',
    labelEs: 'Coleccionista Cósmico',
    emoji: '💎',
    descFr: 'Passionné de raretés, RNG & skins',
    descEn: 'Lover of rare items, RNG & cosmetics',
    descEs: 'Amante de rarezas, RNG y cosméticos'
  },
  {
    id: 'chill' as const,
    labelFr: 'Gamer Chill & Fun',
    labelEn: 'Chill & Casual Gamer',
    labelEs: 'Jugador Chill y Casual',
    emoji: '🧘',
    descFr: 'Joue pour le plaisir et l\'ambiance',
    descEn: 'Plays for good vibes & fun moments',
    descEs: 'Juega por diversión y buen ambiente'
  }
];

export const SOCIAL_CARD_THEMES = [
  { id: 'cyan' as const, name: 'Cyan Néon', bg: 'from-cyan-950/40 via-slate-900/60 to-blue-950/40', border: 'border-cyan-400/50', text: 'text-cyan-300', ring: 'ring-cyan-400' },
  { id: 'fuchsia' as const, name: 'Fuchsia Fluo', bg: 'from-fuchsia-950/40 via-purple-900/60 to-pink-950/40', border: 'border-fuchsia-400/50', text: 'text-fuchsia-300', ring: 'ring-fuchsia-400' },
  { id: 'emerald' as const, name: 'Émeraude Matrix', bg: 'from-emerald-950/40 via-teal-900/60 to-slate-950/40', border: 'border-emerald-400/50', text: 'text-emerald-300', ring: 'ring-emerald-400' },
  { id: 'amber' as const, name: 'Or Solaire', bg: 'from-amber-950/40 via-orange-900/60 to-yellow-950/40', border: 'border-amber-400/50', text: 'text-amber-300', ring: 'ring-amber-400' },
  { id: 'purple' as const, name: 'Obsidienne Violette', bg: 'from-purple-950/40 via-slate-950/80 to-indigo-950/40', border: 'border-purple-400/50', text: 'text-purple-300', ring: 'ring-purple-400' },
  { id: 'gold' as const, name: 'Titane Sombre', bg: 'from-zinc-900/60 via-slate-900/80 to-black/60', border: 'border-white/40', text: 'text-white', ring: 'ring-white' }
];

export function ProfileCreatorModal({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  totalTrophies,
  rankPoints,
  language = 'fr',
  onShowToast
}: ProfileCreatorModalProps) {
  const [activeTab, setActiveTab] = useState<'identity' | 'social' | 'tags' | 'preview'>('identity');
  const [username, setUsername] = useState(profile.username || 'CYBER_HERO');
  const [bio, setBio] = useState(profile.bio || 'Passionné de jeux arcade & métaverse !');
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | undefined>(profile.customAvatarUrl);
  const [selectedTags, setSelectedTags] = useState<string[]>(profile.selectedTags || ['Pro Gamer', 'Speedrunner', 'Trader']);
  const [tagSearch, setTagSearch] = useState('');

  // Social & Multiplayer fields
  const [socialStatus, setSocialStatus] = useState<UserProfile['socialStatus']>(profile.socialStatus || 'ready_for_duel');
  const [socialCustomStatus, setSocialCustomStatus] = useState(profile.socialCustomStatus || 'Prêt pour défier mes amis sur le Hub !');
  const [gamerPlaystyle, setGamerPlaystyle] = useState<UserProfile['gamerPlaystyle']>(profile.gamerPlaystyle || 'speedrunner');
  const [favoriteGameId, setFavoriteGameId] = useState(profile.favoriteGameId || 'cyber_runner_2099');
  const [preferredControl, setPreferredControl] = useState<UserProfile['preferredControl']>(profile.preferredControl || 'gamepad');
  const [voiceChatPreference, setVoiceChatPreference] = useState<UserProfile['voiceChatPreference']>(profile.voiceChatPreference || 'open');
  const [socialCardTheme, setSocialCardTheme] = useState<UserProfile['socialCardTheme']>(profile.socialCardTheme || 'cyan');
  const [copiedCode, setCopiedCode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const t = getTranslation(language);

  // Deterministic Friend Code
  const friendCode = profile.friendCode || `VERTEX#${Math.abs(
    (username || 'HERO').split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0) % 9000 + 1000
  )}`;

  if (!isOpen) return null;

  const handleCopyFriendCode = () => {
    audio.playClick();
    navigator.clipboard?.writeText(friendCode);
    setCopiedCode(true);
    if (onShowToast) {
      onShowToast(`Code ami ${friendCode} copié ! Prêt à être partagé.`);
    }
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
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
      selectedTags,
      socialStatus,
      socialCustomStatus,
      gamerPlaystyle,
      favoriteGameId,
      preferredControl,
      voiceChatPreference,
      socialCardTheme,
      friendCode
    });
    onClose();
  };

  const filteredTags = PROFILE_TAGS_79.filter(tag =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const initialLetter = (username.trim()[0] || 'V').toUpperCase();
  const currentStatusObj = SOCIAL_STATUSES.find(s => s.id === socialStatus) || SOCIAL_STATUSES[0];
  const currentArchetypeObj = GAMER_ARCHETYPES.find(a => a.id === gamerPlaystyle) || GAMER_ARCHETYPES[0];
  const currentThemeObj = SOCIAL_CARD_THEMES.find(th => th.id === socialCardTheme) || SOCIAL_CARD_THEMES[0];
  const favoriteGameObj = GAMES_LIST.find(g => g.id === favoriteGameId) || GAMES_LIST[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/85 backdrop-blur-2xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="liquid-glass-container w-full max-w-4xl max-h-[94dvh] rounded-3xl p-4 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl relative border border-white/15 text-slate-100"
        >
          {/* Top Glint Sheen */}
          <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/25 to-blue-600/25 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white font-mono tracking-tight uppercase">
                    {language === 'en' ? 'Player Profile & Social Pass' : language === 'es' ? 'Perfil de Jugador y Pase Social' : 'Profil Joueur & Carte Sociale'}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/40 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Multi-Amis
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {language === 'en'
                    ? 'Customize your gamer identity, signature game, and status for your friends.'
                    : language === 'es'
                    ? 'Personaliza tu identidad gamer, juego favorito y estado para tus amigos.'
                    : 'Personnalisez votre identité gamer, votre jeu fétiche et votre statut pour vos futurs amis.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => { audio.playClick(); onClose(); }}
              className="w-9 h-9 rounded-full liquid-glass-pill text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shadow-sm transition-transform active:scale-90"
              title="Fermer (Échap)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl liquid-glass-pill border border-white/10 my-3 shrink-0 overflow-x-auto no-scrollbar">
            {[
              { id: 'identity' as const, label: language === 'en' ? 'Identity & Mood' : language === 'es' ? 'Identidad y Estado' : 'Identité & Statut', icon: <User className="w-3.5 h-3.5" /> },
              { id: 'social' as const, label: language === 'en' ? 'Gamer & Social Style' : language === 'es' ? 'Estilo Gamer y Social' : 'Style Gamer & Multi', icon: <Swords className="w-3.5 h-3.5" /> },
              { id: 'tags' as const, label: `${language === 'en' ? 'Badges & Tags' : 'Badges & Tags'} (${selectedTags.length}/8)`, icon: <Tag className="w-3.5 h-3.5" /> },
              { id: 'preview' as const, label: language === 'en' ? 'Friend Card Preview' : language === 'es' ? 'Vista Previa Tarjeta' : 'Aperçu Carte Ami 🪪', icon: <Eye className="w-3.5 h-3.5" /> }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { audio.playClick(); setActiveTab(tab.id); }}
                  className={`flex-1 min-w-fit px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    isActive
                      ? 'liquid-glass-pill-active text-cyan-300 border-cyan-400 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Modal Tab Contents */}
          <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar pr-1">
            {/* TAB 1: IDENTITY & MOOD */}
            {activeTab === 'identity' && (
              <div className="space-y-4">
                {/* Photo & Basic Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-4 rounded-3xl liquid-glass-card border border-white/10">
                  {/* Photo Upload Box */}
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="relative group">
                      <div
                        className={`w-28 h-28 rounded-3xl border-2 ${currentThemeObj.border} overflow-hidden flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.35)] relative bg-gradient-to-br from-slate-900 to-indigo-950`}
                      >
                        {customAvatarUrl ? (
                          <img
                            src={customAvatarUrl}
                            alt="Photo de profil"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 font-mono font-black text-white text-4xl select-none shadow-inner">
                            {initialLetter}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 rounded-3xl bg-slate-950/60 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer text-cyan-300"
                        title={customAvatarUrl ? t.replacePhoto : t.uploadPhoto}
                      >
                        <Camera className="w-6 h-6" />
                        <span className="text-[10px] font-mono font-bold">{t.uploadPhoto}</span>
                      </button>
                    </div>

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
                  </div>

                  {/* Fields: Pseudo, Bio, Friend Code */}
                  <div className="md:col-span-2 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                          {t.username} :
                        </label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          maxLength={20}
                          className="w-full px-3.5 py-2 rounded-xl liquid-glass-input text-white font-bold font-mono text-sm outline-none"
                          placeholder="Votre pseudo..."
                        />
                      </div>

                      {/* Official Friend Code */}
                      <div>
                        <label className="block text-xs font-mono font-bold text-fuchsia-300 mb-1 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Code Ami Personnel :
                        </label>
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 px-3 py-2 rounded-xl bg-fuchsia-950/30 border border-fuchsia-400/40 text-white font-mono font-bold text-xs tracking-wider">
                            {friendCode}
                          </div>
                          <button
                            onClick={handleCopyFriendCode}
                            className={`p-2 rounded-xl transition-all cursor-pointer ${
                              copiedCode ? 'bg-emerald-500 text-slate-950' : 'liquid-glass-pill text-fuchsia-300 hover:text-white'
                            }`}
                            title="Copier le code ami"
                          >
                            {copiedCode ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
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
                        className="w-full px-3.5 py-2 rounded-xl liquid-glass-input text-white text-xs outline-none resize-none font-sans"
                        placeholder="Présentez-vous à la communauté et à vos amis..."
                      />
                    </div>
                  </div>
                </div>

                {/* Social Mood & Availability Status */}
                <div className="p-4 rounded-3xl liquid-glass-card border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-cyan-400" /> Statut & Disponibilité pour les Amis :
                    </label>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border flex items-center gap-1.5 ${currentStatusObj.color}`}>
                      <span>{currentStatusObj.emoji}</span>
                      <span>{currentStatusObj.labelFr}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {SOCIAL_STATUSES.map(st => {
                      const isSelected = socialStatus === st.id;
                      return (
                        <button
                          key={st.id}
                          onClick={() => { audio.playClick(); setSocialStatus(st.id); }}
                          className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 cursor-pointer transition-all ${
                            isSelected
                              ? `${st.color} font-bold scale-[1.02]`
                              : 'liquid-glass-pill text-slate-300 hover:text-white'
                          }`}
                        >
                          <span className="text-base">{st.emoji}</span>
                          <span className="text-xs font-mono truncate">{st.labelFr}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom mood phrase */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-mono font-bold text-slate-400 mb-1 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> Message d'humeur personnalisé (affiché aux amis) :
                    </label>
                    <input
                      type="text"
                      value={socialCustomStatus}
                      onChange={(e) => setSocialCustomStatus(e.target.value)}
                      maxLength={60}
                      className="w-full px-3.5 py-2 rounded-xl liquid-glass-input text-white text-xs outline-none font-sans"
                      placeholder="Ex: Toujours prêt pour un 1v1 sur Runner !"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GAMER & SOCIAL STYLE */}
            {activeTab === 'social' && (
              <div className="space-y-4">
                {/* Gamer Playstyle Archetype */}
                <div className="p-4 rounded-3xl liquid-glass-card border border-white/10 space-y-3">
                  <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Swords className="w-4 h-4 text-cyan-400" /> Archétype de Joueur :
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {GAMER_ARCHETYPES.map(arch => {
                      const isSelected = gamerPlaystyle === arch.id;
                      return (
                        <button
                          key={arch.id}
                          onClick={() => { audio.playClick(); setGamerPlaystyle(arch.id); }}
                          className={`p-3 rounded-2xl border text-left flex flex-col justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'liquid-glass-pill-active border-cyan-400 text-cyan-200 shadow-lg scale-[1.02]'
                              : 'liquid-glass-pill text-slate-300 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{arch.emoji}</span>
                            <span className="font-mono font-bold text-xs text-white">{arch.labelFr}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-sans">{arch.descFr}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Signature Game & Preferred Control */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Signature Game */}
                  <div className="p-4 rounded-3xl liquid-glass-card border border-white/10 space-y-3">
                    <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Crown className="w-4 h-4 text-amber-400" /> Jeu Fétiche / Signature :
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {GAMES_LIST.map(game => {
                        const isSelected = favoriteGameId === game.id;
                        return (
                          <button
                            key={game.id}
                            onClick={() => { audio.playClick(); setFavoriteGameId(game.id); }}
                            className={`p-2.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                              isSelected
                                ? 'liquid-glass-pill-active border-amber-400 text-amber-300 shadow-md scale-105'
                                : 'liquid-glass-pill text-slate-400 hover:text-white'
                            }`}
                          >
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/15">
                              <GameCardIllustration gameId={game.id} className="w-full h-full" />
                            </div>
                            <span className="font-mono font-black text-xs text-white uppercase">{game.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preferred Control & Voice Chat */}
                  <div className="p-4 rounded-3xl liquid-glass-card border border-white/10 space-y-3">
                    <div>
                      <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-1.5 mb-2">
                        <Gamepad2 className="w-4 h-4 text-cyan-400" /> Contrôle Préféré :
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'gamepad' as const, label: 'Manette / Pad', icon: <Gamepad2 className="w-3.5 h-3.5" /> },
                          { id: 'keyboard' as const, label: 'Clavier & Souris', icon: <Keyboard className="w-3.5 h-3.5" /> },
                          { id: 'touch' as const, label: 'Tactile (Mobile)', icon: <Smartphone className="w-3.5 h-3.5" /> },
                          { id: 'all' as const, label: 'Tous Supports', icon: <Layers className="w-3.5 h-3.5" /> }
                        ].map(ctrl => {
                          const isSelected = preferredControl === ctrl.id;
                          return (
                            <button
                              key={ctrl.id}
                              onClick={() => { audio.playClick(); setPreferredControl(ctrl.id); }}
                              className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                                isSelected
                                  ? 'liquid-glass-pill-active border-cyan-400 text-cyan-300'
                                  : 'liquid-glass-pill text-slate-400 hover:text-white'
                              }`}
                            >
                              {ctrl.icon}
                              <span>{ctrl.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-1.5 mb-2">
                        <Mic className="w-4 h-4 text-fuchsia-400" /> Préférence Vocale :
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'open' as const, label: 'Micro Ouvert 🎙️' },
                          { id: 'push_to_talk' as const, label: 'Push-To-Talk 🔘' },
                          { id: 'listening_only' as const, label: 'Écoute Seule 🎧' },
                          { id: 'no_mic' as const, label: 'Pas de Vocal 🔇' }
                        ].map(vc => {
                          const isSelected = voiceChatPreference === vc.id;
                          return (
                            <button
                              key={vc.id}
                              onClick={() => { audio.playClick(); setVoiceChatPreference(vc.id); }}
                              className={`p-2 rounded-xl border text-[11px] font-mono font-bold text-center cursor-pointer transition-all ${
                                isSelected
                                  ? 'liquid-glass-pill-active border-fuchsia-400 text-fuchsia-300'
                                  : 'liquid-glass-pill text-slate-400 hover:text-white'
                              }`}
                            >
                              {vc.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Card Glow Theme */}
                <div className="p-4 rounded-3xl liquid-glass-card border border-white/10 space-y-2">
                  <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" /> Thème Lumineux de la Carte Profil :
                  </h3>
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {SOCIAL_CARD_THEMES.map(th => {
                      const isSelected = socialCardTheme === th.id;
                      return (
                        <button
                          key={th.id}
                          onClick={() => { audio.playClick(); setSocialCardTheme(th.id); }}
                          className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap ${
                            isSelected
                              ? 'liquid-glass-pill-active border-white text-white scale-105 shadow-md'
                              : 'liquid-glass-pill text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className={`w-3 h-3 rounded-full ${th.bg} border ${th.border}`} />
                          <span>{th.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: BADGES & TAGS */}
            {activeTab === 'tags' && (
              <div className="space-y-4">
                {/* Active Badges */}
                <div className="p-4 rounded-3xl liquid-glass-card border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-bold text-cyan-300">
                      {t.activeBadges} ({selectedTags.length}/8) :
                    </label>
                    <span className="text-[10px] font-mono text-slate-400">
                      Cliquez pour retirer
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 min-h-[36px]">
                    {selectedTags.map(tag => (
                      <span
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="px-2.5 py-1 rounded-full liquid-glass-pill border-cyan-400/40 text-cyan-200 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer hover:border-rose-400/60 hover:text-rose-300 transition-colors"
                      >
                        {tag} <X className="w-3 h-3" />
                      </span>
                    ))}
                    {selectedTags.length === 0 && (
                      <span className="text-xs font-mono text-slate-500 italic py-1">
                        Aucun badge sélectionné. Choisissez jusqu'à 8 badges ci-dessous !
                      </span>
                    )}
                  </div>
                </div>

                {/* Catalog with Search */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
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

                  <div className="p-4 rounded-2xl liquid-glass-card border border-white/5 flex flex-wrap gap-2 max-h-64 overflow-y-auto no-scrollbar">
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
            )}

            {/* TAB 4: LIVE FRIEND CARD PREVIEW */}
            {activeTab === 'preview' && (
              <div className="flex flex-col items-center justify-center p-2 sm:p-4 space-y-4">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-cyan-400" /> Aperçu en direct de votre Carte Ami telle qu'elle apparaîtra dans le Hub :
                </span>

                {/* The 3D Friend Card */}
                <div
                  className={`w-full max-w-lg rounded-3xl p-6 bg-gradient-to-br ${currentThemeObj.bg} border-2 ${currentThemeObj.border} shadow-[0_0_40px_rgba(6,182,212,0.25)] relative overflow-hidden text-slate-100 space-y-4`}
                >
                  {/* Glowing Aura Effect */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Card Header: Avatar, Name, Title, Friend Code */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <div className={`w-16 h-16 rounded-2xl border-2 ${currentThemeObj.border} overflow-hidden flex items-center justify-center shadow-lg bg-slate-950`}>
                          {customAvatarUrl ? (
                            <img src={customAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 font-mono font-black text-white text-2xl">
                              {initialLetter}
                            </div>
                          )}
                        </div>
                        {/* Live Online Status */}
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-950 ${currentStatusObj.dot} animate-pulse`} />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-white font-mono tracking-wider">{username}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white/10 text-cyan-300 border border-white/20">
                            Niv.{profile.totalVCoins ? Math.floor(profile.totalVCoins / 500) + 1 : 1}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-cyan-300 uppercase block tracking-wider mt-0.5">
                          {profile.title || 'VÉTÉRAN VERTEX'}
                        </span>
                        <div className="text-[10px] font-mono text-fuchsia-300 mt-1 flex items-center gap-1 font-bold">
                          <ShieldCheck className="w-3 h-3" /> {friendCode}
                        </div>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold border flex items-center gap-1.5 ${currentStatusObj.color}`}>
                      <span>{currentStatusObj.emoji}</span>
                      <span className="hidden sm:inline">{currentStatusObj.labelFr}</span>
                    </div>
                  </div>

                  {/* Custom Mood Message */}
                  {socialCustomStatus && (
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-sans text-slate-200 italic flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>"{socialCustomStatus}"</span>
                    </div>
                  )}

                  {/* Bio */}
                  {bio && (
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {bio}
                    </p>
                  )}

                  {/* Social Stats & Preferences Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-[10px] font-mono text-slate-400">Archétype</div>
                      <div className="text-xs font-mono font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                        <span>{currentArchetypeObj.emoji}</span>
                        <span className="truncate">{currentArchetypeObj.labelFr}</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-[10px] font-mono text-slate-400">Jeu Fétiche</div>
                      <div className="text-xs font-mono font-black text-amber-300 uppercase mt-0.5">
                        {favoriteGameObj.name}
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-[10px] font-mono text-slate-400">Contrôle</div>
                      <div className="text-xs font-mono font-bold text-cyan-300 mt-0.5">
                        {preferredControl === 'gamepad' ? '🎮 Manette' : preferredControl === 'keyboard' ? '⌨️ Clavier' : preferredControl === 'touch' ? '📱 Tactile' : '🌟 Tous'}
                      </div>
                    </div>
                  </div>

                  {/* Badges Showcase */}
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedTags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-lg bg-white/10 border border-white/15 text-[10px] font-mono font-bold text-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Card Footer: V-Coins & Trophies */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-yellow-400 font-bold flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 fill-current" /> {totalTrophies} Trophées
                    </span>
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 fill-current" /> {(profile.totalVCoins ?? 0).toLocaleString()} VC
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer with Action Buttons */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
            <button
              onClick={handleCopyFriendCode}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                copiedCode ? 'bg-emerald-500 text-slate-950 font-black' : 'liquid-glass-pill text-fuchsia-300 hover:text-white'
              }`}
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copié !' : 'Partager Code Ami'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { audio.playClick(); onClose(); }}
                className="px-4 py-2 rounded-xl liquid-glass-pill text-slate-300 hover:text-white font-mono text-xs uppercase cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black font-mono text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer flex items-center gap-2 active:scale-95 transition-all"
              >
                <Check className="w-4 h-4 stroke-[3]" /> {t.saveProfile}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
