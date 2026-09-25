import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Check, Sparkles, Coins, Shirt, Tag } from 'lucide-react';
import { audio } from '../utils/audio';
import { NEW_COSMETICS_SHOP, ShopCosmetic } from '../gamesData';
import { UserProfile } from '../types';

interface ShopV3ModalProps {
  isOpen: boolean;
  onClose: () => void;
  userVCoins: number;
  profile: UserProfile;
  onBuyAndEquip: (item: ShopCosmetic) => void;
}

export function ShopV3Modal({
  isOpen,
  onClose,
  userVCoins,
  profile,
  onBuyAndEquip
}: ShopV3ModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Tout le Catalogue' },
    { id: 'hat', label: 'Chapeaux & Casques' },
    { id: 'aura', label: 'Auras de Particules' },
    { id: 'title', label: 'Titres Exclusifs' },
    { id: 'frame', label: 'Cadres Néon' },
    { id: 'banner', label: 'Bannières' },
    { id: 'sound', label: 'Packs de Sons' }
  ];

  const filteredItems = selectedCategory === 'all'
    ? NEW_COSMETICS_SHOP
    : NEW_COSMETICS_SHOP.filter(i => i.category === selectedCategory);

  const isEquipped = (item: ShopCosmetic) => {
    if (item.category === 'hat') return profile.activeHat === item.id;
    if (item.category === 'aura') return profile.activeAura === item.id;
    if (item.category === 'title') return profile.title === item.name;
    if (item.category === 'frame') return profile.activeFrame === item.id;
    if (item.category === 'banner') return profile.activeBanner === item.id;
    return false;
  };

  const isUnlocked = (item: ShopCosmetic) => {
    if (item.category === 'hat') return profile.unlockedHats?.includes(item.id);
    if (item.category === 'aura') return profile.unlockedAuras?.includes(item.id);
    if (item.category === 'title') return profile.unlockedTitles?.includes(item.name);
    if (item.category === 'frame') return profile.unlockedFrames?.includes(item.id);
    if (item.category === 'banner') return profile.unlockedBanners?.includes(item.id);
    return false;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-[#100d1c] border-2 border-rose-500/60 rounded-3xl shadow-[0_0_60px_rgba(244,63,94,0.4)] flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-rose-500/30 bg-[#090712]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 border border-rose-400 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(244,63,94,0.5)]">
                🛍️
              </div>
              <div>
                <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-orange-300 font-mono">
                  BOUTIQUE CYBER VERTEX v3.0
                </h2>
                <p className="text-xs text-rose-400 font-mono">
                  Nouveaux Chapeaux, Auras, Titres et Effets Sonores exclusifs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-950/80 border border-amber-500 text-yellow-300 font-mono font-bold text-xs">
                <Coins className="w-4 h-4 fill-current text-yellow-400" />
                <span>{userVCoins.toLocaleString()} VC</span>
              </div>
              <button
                onClick={() => { audio.playClick(); onClose(); }}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Categories Tab Strip */}
          <div className="p-4 border-b border-slate-800 bg-[#090712]/80 flex gap-2 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { audio.playClick(); setSelectedCategory(cat.id); }}
                className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-rose-500 text-white font-black shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => {
              const unlocked = isUnlocked(item);
              const equipped = isEquipped(item);
              const canAfford = userVCoins >= item.costVCoins;

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-[#161224] border border-slate-800 hover:border-rose-400/60 transition-all flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl shadow-inner">
                        {item.preview}
                      </div>
                      <span className="text-xs font-mono font-bold text-yellow-400 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 fill-current" /> {item.costVCoins.toLocaleString()} VC
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base font-mono mb-1">{item.name}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800">
                    {equipped ? (
                      <span className="w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40 flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4" /> Équipé
                      </span>
                    ) : unlocked ? (
                      <button
                        onClick={() => {
                          audio.playClick();
                          onBuyAndEquip(item);
                        }}
                        className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase cursor-pointer transition-all"
                      >
                        Équiper
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (canAfford) {
                            audio.playWin();
                            onBuyAndEquip(item);
                          }
                        }}
                        disabled={!canAfford}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 disabled:opacity-40 text-white font-black text-xs uppercase cursor-pointer transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                      >
                        {canAfford ? 'Acheter & Équiper' : 'V-Coins Insuffisants'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
