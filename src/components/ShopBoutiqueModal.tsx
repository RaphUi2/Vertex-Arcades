import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Search, Sparkles, Check, Lock, Palette, Crown, Shield, X, Flame,
  Zap, Gamepad2, Rocket, Headphones, Crosshair, Terminal, Ghost, Skull, Globe, Trophy,
  Sword, Award, Eye, RotateCcw
} from 'lucide-react';
import {
  CABINET_SKINS, AURA_COSMETICS, TITLE_BANNERS, SHOP_TITLES,
  AVATAR_ICONS_SHOP, AVATAR_COLORS_SHOP, FRAME_BORDERS_SHOP, VICTORY_FX_SHOP
} from '../gamesData';
import { UserProfile, CosmeticRarity } from '../types';
import { Avatar3DViewer } from './Avatar3DViewer';

interface ShopBoutiqueModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onBuySkin: (skinId: string, cost: number) => void;
  onEquipSkin: (skinId: string) => void;
  onBuyAura: (auraId: string, cost: number) => void;
  onEquipAura: (auraId: string) => void;
  onBuyBanner: (bannerId: string, cost: number) => void;
  onEquipBanner: (bannerId: string) => void;
  onBuyTitle: (title: string, cost: number) => void;
  onEquipTitle: (title: string) => void;
  onBuyAvatarIcon: (iconName: string, cost: number) => void;
  onEquipAvatarIcon: (iconName: string) => void;
  onBuyAvatarColor: (colorHex: string, cost: number) => void;
  onEquipAvatarColor: (colorHex: string) => void;
  onBuyFrame: (frameId: string, cost: number) => void;
  onEquipFrame: (frameId: string) => void;
  onBuyFx: (fxId: string, cost: number) => void;
  onEquipFx: (fxId: string) => void;
}

export const ShopBoutiqueModal: React.FC<ShopBoutiqueModalProps> = ({
  isOpen,
  onClose,
  profile,
  onBuySkin,
  onEquipSkin,
  onBuyAura,
  onEquipAura,
  onBuyBanner,
  onEquipBanner,
  onBuyTitle,
  onEquipTitle,
  onBuyAvatarIcon,
  onEquipAvatarIcon,
  onBuyAvatarColor,
  onEquipAvatarColor,
  onBuyFrame,
  onEquipFrame,
  onBuyFx,
  onEquipFx
}) => {
  const [activeCategory, setActiveCategory] = useState<'themes' | 'auras' | 'banners' | 'titles' | 'icons' | 'colors' | 'frames' | 'fx'>('themes');
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string>('all');

  if (!isOpen) return null;

  const rarityBadgeColors: Record<CosmeticRarity, string> = {
    commun: 'bg-slate-800 text-slate-300 border-slate-700',
    rare: 'bg-cyan-950 text-cyan-300 border-cyan-700',
    epique: 'bg-purple-950 text-purple-300 border-purple-700',
    legendaire: 'bg-amber-950 text-amber-300 border-amber-700',
    mythique: 'bg-fuchsia-950 text-fuchsia-300 border-fuchsia-700',
    divin: 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse'
  };

  const renderIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap size={20} />;
      case 'Crown': return <Crown size={20} />;
      case 'Gamepad2': return <Gamepad2 size={20} />;
      case 'Rocket': return <Rocket size={20} />;
      case 'Headphones': return <Headphones size={20} />;
      case 'Crosshair': return <Crosshair size={20} />;
      case 'Terminal': return <Terminal size={20} />;
      case 'Ghost': return <Ghost size={20} />;
      case 'Skull': return <Skull size={20} />;
      case 'Globe': return <Globe size={20} />;
      case 'Trophy': return <Trophy size={20} />;
      case 'Sparkles': return <Sparkles size={20} />;
      case 'Flame': return <Flame size={20} />;
      case 'Shield': return <Shield size={20} />;
      case 'Sword': return <Sword size={20} />;
      default: return <Zap size={20} />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-6xl bg-slate-900/95 border border-purple-500/40 rounded-2xl shadow-[0_0_60px_rgba(168,85,247,0.3)] overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/90 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-500/20 border border-purple-500/50 rounded-xl text-purple-400">
                <ShoppingBag size={26} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-wider flex items-center gap-2">
                  BOUTIQUE DE COSMÉTIQUES <span className="text-xs bg-gradient-to-r from-purple-500 to-amber-500 text-white font-bold px-2.5 py-0.5 rounded-full">+400 ARTICLES V2.2 JURASSIQUE</span>
                </h2>
                <p className="text-xs text-slate-400">Personnalisez votre profil, thèmes animés, auras préhistoriques & avatar 3D !</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-slate-950 border border-yellow-500/40 rounded-xl text-yellow-400 font-black text-sm flex items-center gap-1.5 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                <Sparkles size={16} /> {profile.totalPixels} PX
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Search & Category Tabs */}
          <div className="p-4 bg-slate-950/50 border-b border-slate-800 space-y-3">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'themes', label: '🎨 Thèmes & Fonds' },
                { id: 'auras', label: '✨ Auras Néon' },
                { id: 'banners', label: '🖼️ Bannières' },
                { id: 'titles', label: '👑 Titres VIP' },
                { id: 'icons', label: '🎮 Avatars' },
                { id: 'colors', label: '🌈 Couleurs' },
                { id: 'frames', label: '🖼️ Cadres Profil' },
                { id: 'fx', label: '💥 Effets Victoire' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase cursor-pointer border transition ${
                    activeCategory === cat.id
                      ? 'bg-purple-500 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher une cosmétique..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-1.5">
                {['all', 'commun', 'rare', 'epique', 'legendaire', 'mythique', 'divin'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRarityFilter(r)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase cursor-pointer transition border ${
                      rarityFilter === r
                        ? 'bg-purple-600 text-white border-purple-400'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Body: 3D Preview Sidebar + Cosmetics Grid */}
          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
            {/* 3D Avatar Interactive Live Preview Sidebar */}
            <div className="w-full lg:w-72 bg-slate-950/90 p-4 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col items-center justify-center shrink-0">
              <h3 className="text-xs font-black text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles size={14} className="text-purple-400" /> APERÇU LIVE AVATAR 3D
              </h3>
              <div className="w-52 h-52 rounded-2xl overflow-hidden border border-purple-500/30 bg-slate-900 shadow-inner flex items-center justify-center relative">
                <Avatar3DViewer
                  avatarColor={profile.avatarColor}
                  avatarIcon={profile.avatarIcon || 'Crown'}
                  activeAura={profile.activeAura || 'none'}
                  username={profile.username}
                />
              </div>
              <div className="mt-3 text-center space-y-0.5">
                <p className="text-xs font-black text-white">{profile.username}</p>
                <p className="text-[11px] text-purple-300 font-bold">{profile.title || 'PILOTE'}</p>
              </div>
            </div>

            {/* Cosmetics Grid */}
            <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Category: Themes */}
              {activeCategory === 'themes' &&
                CABINET_SKINS.filter(s =>
                  s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                  (rarityFilter === 'all' || s.rarity === rarityFilter)
                ).map((skin) => {
                  const isUnlocked = profile.unlockedSkins?.includes(skin.id) || skin.cost === 0;
                  const isActive = profile.activeSkin === skin.id;

                  return (
                    <div
                      key={skin.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between transition ${skin.cardBg} ${
                        isActive ? 'ring-2 ring-purple-400' : ''
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${rarityBadgeColors[skin.rarity]}`}>
                            {skin.rarity}
                          </span>
                          <div
                            className="w-5 h-5 rounded-full border border-white/20 shadow-inner"
                            style={{ backgroundColor: skin.colorPreview }}
                          />
                        </div>
                        <h4 className="font-extrabold text-sm text-white mb-1">{skin.name}</h4>
                        <p className="text-[11px] text-slate-400 mb-3">Fond animé unique ({skin.bgType})</p>
                      </div>

                      <div>
                        {isActive ? (
                          <span className="w-full py-2 bg-purple-500/20 text-purple-300 font-extrabold text-xs rounded-lg uppercase flex items-center justify-center gap-1 border border-purple-500/40">
                            <Check size={14} /> ÉQUIPÉ
                          </span>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => onEquipSkin(skin.id)}
                            className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-lg uppercase cursor-pointer transition shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                          >
                            Équiper
                          </button>
                        ) : (
                          <button
                            onClick={() => onBuySkin(skin.id, skin.cost)}
                            disabled={profile.totalPixels < skin.cost}
                            className={`w-full py-2 font-extrabold text-xs rounded-lg uppercase cursor-pointer transition flex items-center justify-center gap-1 ${
                              profile.totalPixels >= skin.cost
                                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <span>Acheter ({skin.cost} PX)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

              {/* Category: Auras */}
              {activeCategory === 'auras' &&
                AURA_COSMETICS.filter(a =>
                  a.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                  (rarityFilter === 'all' || a.rarity === rarityFilter)
                ).map((aura) => {
                  const isUnlocked = profile.unlockedAuras?.includes(aura.id) || aura.cost === 0;
                  const isActive = profile.activeAura === aura.id;

                  return (
                    <div key={aura.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${rarityBadgeColors[aura.rarity]}`}>
                            {aura.rarity}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-white mb-1">{aura.name}</h4>
                        <p className="text-[11px] text-slate-400 mb-3">{aura.desc}</p>
                      </div>

                      {isActive ? (
                        <span className="w-full py-2 bg-purple-500/20 text-purple-300 font-extrabold text-xs rounded-lg uppercase flex items-center justify-center gap-1 border border-purple-500/40">
                          <Check size={14} /> ÉQUIPÉ
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => onEquipAura(aura.id)}
                          className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-lg uppercase cursor-pointer transition"
                        >
                          Équiper
                        </button>
                      ) : (
                        <button
                          onClick={() => onBuyAura(aura.id, aura.cost)}
                          disabled={profile.totalPixels < aura.cost}
                          className={`w-full py-2 font-extrabold text-xs rounded-lg uppercase cursor-pointer transition ${
                            profile.totalPixels >= aura.cost ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          Acheter ({aura.cost} PX)
                        </button>
                      )}
                    </div>
                  );
                })}

              {/* Category: Banners */}
              {activeCategory === 'banners' &&
                TITLE_BANNERS.filter(b =>
                  b.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                  (rarityFilter === 'all' || b.rarity === rarityFilter)
                ).map((banner) => {
                  const isUnlocked = profile.unlockedBanners?.includes(banner.id) || banner.cost === 0;
                  const isActive = profile.activeBanner === banner.id;

                  return (
                    <div key={banner.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${rarityBadgeColors[banner.rarity]}`}>
                            {banner.rarity}
                          </span>
                        </div>
                        <div className={`h-12 w-full rounded-lg mb-2 ${banner.gradient || 'bg-cyan-900'} border border-white/20 flex items-center justify-center shadow-inner`}>
                          <span className="text-[10px] font-black text-white/80 uppercase">BANNIÈRE PROFIL</span>
                        </div>
                        <h4 className="font-extrabold text-sm text-white mb-1">{banner.name}</h4>
                        <p className="text-[11px] text-slate-400 mb-3">{banner.desc}</p>
                      </div>

                      {isActive ? (
                        <span className="w-full py-2 bg-purple-500/20 text-purple-300 font-extrabold text-xs rounded-lg uppercase flex items-center justify-center gap-1 border border-purple-500/40">
                          <Check size={14} /> ÉQUIPÉ
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => onEquipBanner(banner.id)}
                          className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-lg uppercase cursor-pointer transition"
                        >
                          Équiper
                        </button>
                      ) : (
                        <button
                          onClick={() => onBuyBanner(banner.id, banner.cost)}
                          disabled={profile.totalPixels < banner.cost}
                          className={`w-full py-2 font-extrabold text-xs rounded-lg uppercase cursor-pointer transition ${
                            profile.totalPixels >= banner.cost ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          Acheter ({banner.cost} PX)
                        </button>
                      )}
                    </div>
                  );
                })}

              {/* Category: Titles */}
              {activeCategory === 'titles' &&
                SHOP_TITLES.filter(t =>
                  (t.name || t.previewVal).toLowerCase().includes(searchQuery.toLowerCase()) &&
                  (rarityFilter === 'all' || t.rarity === rarityFilter)
                ).map((item) => {
                  const titleName = item.name || item.previewVal;
                  const isUnlocked = profile.unlockedTitles?.includes(titleName) || item.cost === 0;
                  const isActive = profile.title === titleName;

                  return (
                    <div key={item.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${rarityBadgeColors[item.rarity]}`}>
                            {item.rarity}
                          </span>
                        </div>
                        <div className="p-2 bg-purple-950/40 border border-purple-500/30 rounded-lg text-center mb-2">
                          <span className="text-xs font-black text-purple-300 tracking-wider uppercase">{titleName}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mb-3">{item.desc || 'Titre prestigieux pour profil.'}</p>
                      </div>

                      {isActive ? (
                        <span className="w-full py-2 bg-purple-500/20 text-purple-300 font-extrabold text-xs rounded-lg uppercase flex items-center justify-center gap-1 border border-purple-500/40">
                          <Check size={14} /> ÉQUIPÉ
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => onEquipTitle(titleName)}
                          className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-lg uppercase cursor-pointer transition"
                        >
                          Équiper
                        </button>
                      ) : (
                        <button
                          onClick={() => onBuyTitle(titleName, item.cost)}
                          disabled={profile.totalPixels < item.cost}
                          className={`w-full py-2 font-extrabold text-xs rounded-lg uppercase cursor-pointer transition ${
                            profile.totalPixels >= item.cost ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          Acheter ({item.cost} PX)
                        </button>
                      )}
                    </div>
                  );
                })}

              {/* Category: Icons */}
              {activeCategory === 'icons' &&
                AVATAR_ICONS_SHOP.filter(icon =>
                  icon.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                  (rarityFilter === 'all' || icon.rarity === rarityFilter)
                ).map((icon) => {
                  const iconKey = icon.iconName || icon.id;
                  const isUnlocked = profile.unlockedAvatarIcons?.includes(iconKey) || icon.cost === 0;
                  const isActive = profile.avatarIcon === iconKey;

                  return (
                    <div key={icon.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${rarityBadgeColors[icon.rarity]}`}>
                            {icon.rarity}
                          </span>
                        </div>
                        <div className="w-12 h-12 mx-auto rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-2">
                          {renderIconComponent(iconKey)}
                        </div>
                        <h4 className="font-extrabold text-sm text-center text-white mb-3">{icon.name}</h4>
                      </div>

                      {isActive ? (
                        <span className="w-full py-2 bg-purple-500/20 text-purple-300 font-extrabold text-xs rounded-lg uppercase flex items-center justify-center gap-1 border border-purple-500/40">
                          <Check size={14} /> ÉQUIPÉ
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => onEquipAvatarIcon(iconKey)}
                          className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-lg uppercase cursor-pointer transition"
                        >
                          Équiper
                        </button>
                      ) : (
                        <button
                          onClick={() => onBuyAvatarIcon(iconKey, icon.cost)}
                          disabled={profile.totalPixels < icon.cost}
                          className={`w-full py-2 font-extrabold text-xs rounded-lg uppercase cursor-pointer transition ${
                            profile.totalPixels >= icon.cost ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          Acheter ({icon.cost} PX)
                        </button>
                      )}
                    </div>
                  );
                })}

              {/* Category: Colors */}
              {activeCategory === 'colors' &&
                AVATAR_COLORS_SHOP.filter(c =>
                  c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                  (rarityFilter === 'all' || c.rarity === rarityFilter)
                ).map((col) => {
                  const isUnlocked = profile.unlockedColors?.includes(col.id) || profile.unlockedColors?.includes(col.colorHex) || col.cost === 0;
                  const isActive = profile.avatarColor === col.id || profile.avatarColor === col.colorHex;

                  return (
                    <div key={col.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${rarityBadgeColors[col.rarity]}`}>
                            {col.rarity}
                          </span>
                        </div>
                        <div
                          className="w-12 h-12 mx-auto rounded-full border-2 border-white/30 shadow-lg mb-2"
                          style={{ backgroundColor: col.colorHex }}
                        />
                        <h4 className="font-extrabold text-sm text-center text-white mb-3">{col.name}</h4>
                      </div>

                      {isActive ? (
                        <span className="w-full py-2 bg-purple-500/20 text-purple-300 font-extrabold text-xs rounded-lg uppercase flex items-center justify-center gap-1 border border-purple-500/40">
                          <Check size={14} /> ÉQUIPÉ
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => onEquipAvatarColor(col.id)}
                          className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-lg uppercase cursor-pointer transition"
                        >
                          Équiper
                        </button>
                      ) : (
                        <button
                          onClick={() => onBuyAvatarColor(col.id, col.cost)}
                          disabled={profile.totalPixels < col.cost}
                          className={`w-full py-2 font-extrabold text-xs rounded-lg uppercase cursor-pointer transition ${
                            profile.totalPixels >= col.cost ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          Acheter ({col.cost} PX)
                        </button>
                      )}
                    </div>
                  );
                })}

              {/* Category: Frames */}
              {activeCategory === 'frames' &&
                FRAME_BORDERS_SHOP.filter(f =>
                  f.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                  (rarityFilter === 'all' || f.rarity === rarityFilter)
                ).map((frame) => {
                  const isUnlocked = profile.unlockedFrames?.includes(frame.id) || frame.cost === 0;
                  const isActive = profile.activeFrame === frame.id;

                  return (
                    <div key={frame.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${rarityBadgeColors[frame.rarity]}`}>
                            {frame.rarity}
                          </span>
                        </div>
                        <div className="w-14 h-14 mx-auto rounded-xl p-1 border-2 border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.5)] flex items-center justify-center bg-slate-900 mb-2">
                          <Crown size={22} className="text-purple-300" />
                        </div>
                        <h4 className="font-extrabold text-sm text-center text-white mb-1">{frame.name}</h4>
                        <p className="text-[11px] text-slate-400 text-center mb-3">{frame.desc || 'Cadre profil.'}</p>
                      </div>

                      {isActive ? (
                        <span className="w-full py-2 bg-purple-500/20 text-purple-300 font-extrabold text-xs rounded-lg uppercase flex items-center justify-center gap-1 border border-purple-500/40">
                          <Check size={14} /> ÉQUIPÉ
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => onEquipFrame(frame.id)}
                          className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-lg uppercase cursor-pointer transition"
                        >
                          Équiper
                        </button>
                      ) : (
                        <button
                          onClick={() => onBuyFrame(frame.id, frame.cost)}
                          disabled={profile.totalPixels < frame.cost}
                          className={`w-full py-2 font-extrabold text-xs rounded-lg uppercase cursor-pointer transition ${
                            profile.totalPixels >= frame.cost ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          Acheter ({frame.cost} PX)
                        </button>
                      )}
                    </div>
                  );
                })}

              {/* Category: FX */}
              {activeCategory === 'fx' &&
                VICTORY_FX_SHOP.filter(fx =>
                  fx.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                  (rarityFilter === 'all' || fx.rarity === rarityFilter)
                ).map((fx) => {
                  const isUnlocked = profile.unlockedFx?.includes(fx.id) || fx.cost === 0;
                  const isActive = profile.activeFx === fx.id;

                  return (
                    <div key={fx.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${rarityBadgeColors[fx.rarity]}`}>
                            {fx.rarity}
                          </span>
                        </div>
                        <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 mb-2">
                          <Sparkles size={22} className="animate-pulse" />
                        </div>
                        <h4 className="font-extrabold text-sm text-center text-white mb-1">{fx.name}</h4>
                        <p className="text-[11px] text-slate-400 text-center mb-3">{fx.desc}</p>
                      </div>

                      {isActive ? (
                        <span className="w-full py-2 bg-purple-500/20 text-purple-300 font-extrabold text-xs rounded-lg uppercase flex items-center justify-center gap-1 border border-purple-500/40">
                          <Check size={14} /> ÉQUIPÉ
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => onEquipFx(fx.id)}
                          className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-lg uppercase cursor-pointer transition"
                        >
                          Équiper
                        </button>
                      ) : (
                        <button
                          onClick={() => onBuyFx(fx.id, fx.cost)}
                          disabled={profile.totalPixels < fx.cost}
                          className={`w-full py-2 font-extrabold text-xs rounded-lg uppercase cursor-pointer transition ${
                            profile.totalPixels >= fx.cost ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          Acheter ({fx.cost} PX)
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
