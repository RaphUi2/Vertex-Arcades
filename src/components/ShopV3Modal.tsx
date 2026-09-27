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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="liquid-glass-container w-full max-w-4xl max-h-[92vh] rounded-3xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl relative border border-white/15 text-slate-100"
        >
          {/* Top Specular Glint */}
          <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-rose-300/40 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-400/50 flex items-center justify-center text-xl text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                🛍️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white font-mono tracking-tight">
                    BOUTIQUE LIQUID GLASS
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
                    EXCLUSIF
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Chapeaux, auras de particules, cadres néon et titres de prestige
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="liquid-glass-vc flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-yellow-300 text-[11px] font-mono font-bold shadow-sm">
                <Coins className="w-3 h-3 fill-current text-yellow-400" />
                <span>{userVCoins.toLocaleString()} VC</span>
              </div>
              <button
                onClick={() => { audio.playClick(); onClose(); }}
                className="w-9 h-9 rounded-full liquid-glass-pill text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shadow-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Categories Tab Strip */}
          <div className="pt-3 pb-3 border-b border-white/10 flex gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { audio.playClick(); setSelectedCategory(cat.id); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'liquid-glass-pill-active border-rose-400/80 text-white shadow-md'
                    : 'liquid-glass-pill text-slate-300 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="flex-1 overflow-y-auto my-3 p-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 no-scrollbar">
            {filteredItems.map(item => {
              const unlocked = isUnlocked(item);
              const equipped = isEquipped(item);
              const canAfford = userVCoins >= item.costVCoins;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-3xl liquid-glass-card border border-white/10 hover:border-rose-400/50 transition-all flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-13 h-13 rounded-2xl liquid-glass-pill border border-white/15 flex items-center justify-center text-3xl shadow-sm">
                        {item.preview}
                      </div>
                      <span className="text-xs font-mono font-bold text-yellow-300 liquid-glass-vc px-2.5 py-1 rounded-xl flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 fill-current text-yellow-400" /> {item.costVCoins.toLocaleString()} VC
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm font-mono mb-1">{item.name}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10">
                    {equipped ? (
                      <span className="w-full py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40 flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4 stroke-[3]" /> Équipé
                      </span>
                    ) : unlocked ? (
                      <button
                        onClick={() => {
                          audio.playClick();
                          onBuyAndEquip(item);
                        }}
                        className="w-full py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs uppercase font-mono cursor-pointer transition-all active:scale-95 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
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
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 disabled:opacity-40 text-white font-black text-xs uppercase font-mono cursor-pointer transition-all active:scale-95 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                      >
                        {canAfford ? 'Acheter & Équiper' : 'Fonds Insuffisants'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Cosmétiques persistants et sauvegardés instantanément</span>
            <span className="text-rose-400 font-bold">Boutique Liquid Glass</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
