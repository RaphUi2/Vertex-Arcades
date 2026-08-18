import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Crown, Edit2, Check, ShoppingBag, Trophy, Flame, Shield, Award } from 'lucide-react';
import { UserProfile } from '../types';
import { UserProfileAvatar } from './UserProfileAvatar';
import { TITLE_BANNERS, FRAME_BORDERS_SHOP, AURA_COSMETICS, VICTORY_FX_SHOP } from '../gamesData';

interface UserProfileCardProps {
  profile: UserProfile;
  rankPoints?: number;
  unlockedAchievementsCount?: number;
  onUpdateUsername: (newUsername: string) => void;
  onOpenShop: () => void;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  profile,
  rankPoints = 0,
  unlockedAchievementsCount = 0,
  onUpdateUsername,
  onOpenShop
}) => {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(profile.username);

  // Find banner gradient
  const bannerItem = TITLE_BANNERS.find(b => b.id === profile.activeBanner);
  const bannerBg = bannerItem?.gradient || 'bg-gradient-to-r from-purple-900 via-slate-900 to-cyan-900';

  // Find frame name
  const frameItem = FRAME_BORDERS_SHOP.find(f => f.id === profile.activeFrame);

  // Find aura name
  const auraItem = AURA_COSMETICS.find(a => a.id === profile.activeAura);

  // Find victory FX
  const fxItem = VICTORY_FX_SHOP.find(fx => fx.id === profile.activeFx);

  const handleSaveUsername = () => {
    if (usernameInput.trim().length > 0) {
      onUpdateUsername(usernameInput.trim());
    }
    setIsEditingUsername(false);
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/90 shadow-2xl mb-6 relative group">
      {/* Background Banner Header */}
      <div className={`h-28 sm:h-36 w-full ${bannerBg} relative border-b border-slate-800/80 p-4 flex items-end justify-between overflow-hidden`}>
        {/* Banner Decorative Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
        <div className="absolute top-2 right-3 text-[10px] font-black uppercase text-white/50 tracking-widest bg-slate-950/60 px-2 py-0.5 rounded border border-white/10">
          BANNIÈRE ÉQUIPÉE : {bannerItem?.name || 'Cyber Néon'}
        </div>
      </div>

      {/* Main Profile Info Row */}
      <div className="px-5 pb-5 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 sm:-mt-14">
        {/* Avatar + Name & Title */}
        <div className="flex items-end gap-4">
          <UserProfileAvatar
            avatarIcon={profile.avatarIcon || 'Zap'}
            avatarColor={profile.avatarColor || '#06b6d4'}
            activeFrame={profile.activeFrame || 'none'}
            activeAura={profile.activeAura || 'none'}
            size="xl"
            onClick={onOpenShop}
          />

          <div className="mb-1 space-y-1">
            {/* Username + Edit Button */}
            <div className="flex items-center gap-2">
              {isEditingUsername ? (
                <div className="flex items-center gap-1.5 bg-slate-900 border border-cyan-400 rounded-xl p-1">
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="bg-transparent text-white font-black text-sm px-2 focus:outline-none w-36"
                    autoFocus
                    maxLength={18}
                  />
                  <button
                    onClick={handleSaveUsername}
                    className="p-1.5 bg-cyan-500 text-slate-950 rounded-lg font-black cursor-pointer hover:bg-cyan-400"
                  >
                    <Check size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-wider drop-shadow">
                    {profile.username}
                  </h2>
                  <button
                    onClick={() => { setUsernameInput(profile.username); setIsEditingUsername(true); }}
                    className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                    title="Changer de pseudonyme"
                  >
                    <Edit2 size={15} />
                  </button>
                </div>
              )}

              {/* Prestige Badge */}
              {(profile.prestigeLevel || 0) > 0 && (
                <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/50 text-amber-300 font-black text-[10px] rounded-lg flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                  <Crown size={12} /> PRESTIGE {profile.prestigeLevel}
                </span>
              )}
            </div>

            {/* Equipped Title & Cosmetic Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400 text-purple-300 font-black text-xs uppercase tracking-wider shadow-[0_0_12px_rgba(168,85,247,0.3)] flex items-center gap-1">
                <Crown size={12} /> {profile.title || 'PILOTE'}
              </span>

              {frameItem && frameItem.id !== 'none' && (
                <span className="text-[10px] bg-slate-900 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-md font-bold">
                  🖼️ {frameItem.name}
                </span>
              )}

              {auraItem && auraItem.id !== 'none' && (
                <span className="text-[10px] bg-slate-900 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-md font-bold">
                  ✨ {auraItem.name}
                </span>
              )}

              {fxItem && (
                <span className="text-[10px] bg-slate-900 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-md font-bold">
                  💥 FX: {fxItem.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Stats & Shop Customize Shortcut */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-slate-900/90 border border-yellow-500/40 rounded-xl text-yellow-400 font-black text-xs flex flex-col items-center">
              <span className="text-[9px] text-slate-400 font-bold uppercase">Solde Pixels</span>
              <span className="text-sm flex items-center gap-1"><Sparkles size={13} /> {profile.totalPixels} PX</span>
            </div>

            <div className="px-3 py-1.5 bg-slate-900/90 border border-rose-500/40 rounded-xl text-rose-300 font-black text-xs flex flex-col items-center">
              <span className="text-[9px] text-slate-400 font-bold uppercase">Duels 1v1</span>
              <span className="text-sm font-black flex items-center gap-1 text-emerald-400">
                {profile.duelWins || 0}V <span className="text-slate-500">/</span> <span className="text-rose-400">{profile.duelLosses || 0}D</span>
              </span>
            </div>

            <div className="px-3 py-1.5 bg-slate-900/90 border border-purple-500/40 rounded-xl text-purple-300 font-black text-xs flex flex-col items-center">
              <span className="text-[9px] text-slate-400 font-bold uppercase">Succès</span>
              <span className="text-sm flex items-center gap-1"><Trophy size={13} /> {unlockedAchievementsCount}</span>
            </div>
          </div>

          <button
            onClick={onOpenShop}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-black text-xs uppercase rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] transition cursor-pointer flex items-center gap-2"
          >
            <ShoppingBag size={16} /> Changer Cosmétiques
          </button>
        </div>
      </div>
    </div>
  );
};
