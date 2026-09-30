import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Sparkles, RefreshCw, Dice5, Shield, Check, Flame, Trophy,
  Coins, ArrowRightLeft, Play, Pause, Zap, Award, Trash2, Beaker,
  TrendingUp, Star, Filter, Heart
} from 'lucide-react';
import { audio } from '../utils/audio';
import { RngUniverseItem, TradeRequest } from '../types';
import { RNG_UNIVERSE_ITEMS } from '../gamesData';
import { Language, getTranslation } from '../utils/i18n';

interface RngUniverseModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Record<string, number>;
  onInventoryUpdate: (newInventory: Record<string, number>, earnedVC: number) => void;
  tradeRequests: TradeRequest[];
  onAcceptTrade: (tradeId: string) => void;
  totalRolls: number;
  userVCoins: number;
  language?: Language;
}

export function RngUniverseModal({
  isOpen,
  onClose,
  inventory,
  onInventoryUpdate,
  tradeRequests,
  onAcceptTrade,
  totalRolls,
  userVCoins,
  language = 'en'
}: RngUniverseModalProps) {
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<'roll' | 'inventory' | 'potions' | 'trades'>('roll');
  const [selectedUniverse, setSelectedUniverse] = useState<string>('all');
  const [isRolling, setIsRolling] = useState(false);
  const [lastRolledItem, setLastRolledItem] = useState<RngUniverseItem | null>(null);
  const [luckCharges, setLuckCharges] = useState<{ multiplier: number; remainingRolls: number }>({
    multiplier: 1,
    remainingRolls: 0
  });
  const [rollHistory, setRollHistory] = useState<RngUniverseItem[]>([]);
  const [fastRoll, setFastRoll] = useState(false);
  const [autoRoll, setAutoRoll] = useState(false);
  const [pityCounter, setPityCounter] = useState(0);
  const [reelPreviewItem, setReelPreviewItem] = useState<RngUniverseItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const autoRollIntervalRef = useRef<any>(null);
  const reelAnimRef = useRef<any>(null);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Current effective luck
  const currentLuckMultiplier = luckCharges.remainingRolls > 0 ? luckCharges.multiplier : 1;

  // True Fair Weighted Probability Selection Algorithm
  const calculateFairRoll = (luck: number, currentPity: number): RngUniverseItem => {
    // 1. Pity Rule: At 25 rolls, guarantee Epic or higher!
    if (currentPity >= 25) {
      const epicOrHigher = RNG_UNIVERSE_ITEMS.filter(i => i.chanceDenominator >= 500);
      return epicOrHigher[Math.floor(Math.random() * epicOrHigher.length)];
    }

    // 2. Cumulative Weighted Distribution
    const itemsWithWeights = RNG_UNIVERSE_ITEMS.map(item => {
      let weight = 100000 / Math.pow(item.chanceDenominator, 0.85);

      if (item.chanceDenominator >= 200) {
        weight *= luck;
      } else if (item.chanceDenominator >= 50) {
        weight *= Math.sqrt(luck);
      }

      return { item, weight };
    });

    const totalWeight = itemsWithWeights.reduce((acc, curr) => acc + curr.weight, 0);
    const randomPick = Math.random() * totalWeight;

    let cumulative = 0;
    for (const entry of itemsWithWeights) {
      cumulative += entry.weight;
      if (randomPick <= cumulative) {
        return entry.item;
      }
    }

    return RNG_UNIVERSE_ITEMS[0];
  };

  // Perform Roll
  const performRoll = (instant = false) => {
    if (isRolling && !instant) return;
    setIsRolling(true);
    audio.playClick();

    // Consume 1 luck charge if active
    let activeLuck = 1;
    if (luckCharges.remainingRolls > 0) {
      activeLuck = luckCharges.multiplier;
      setLuckCharges(prev => ({
        ...prev,
        remainingRolls: Math.max(0, prev.remainingRolls - 1)
      }));
    }

    // Determine the rolled item
    const picked = calculateFairRoll(activeLuck, pityCounter);

    // Update Pity counter
    if (picked.chanceDenominator >= 500) {
      setPityCounter(0);
    } else {
      setPityCounter(p => p + 1);
    }

    if (instant || fastRoll) {
      // Instant roll
      finishRoll(picked);
    } else {
      // Animated Reel Spin (cycles rapidly through 12 random items before landing)
      let step = 0;
      const totalSteps = 14;
      const interval = setInterval(() => {
        const randomItem = RNG_UNIVERSE_ITEMS[Math.floor(Math.random() * RNG_UNIVERSE_ITEMS.length)];
        setReelPreviewItem(randomItem);
        audio.playClick();
        step++;
        if (step >= totalSteps) {
          clearInterval(interval);
          finishRoll(picked);
        }
      }, 70);
      reelAnimRef.current = interval;
    }
  };

  const performMultiRoll = (count: number) => {
    if (isRolling) return;
    audio.playLevelUp();
    setIsRolling(true);

    let nextInv = { ...inventory };
    let totalEarnedVC = 0;
    const rolledItems: RngUniverseItem[] = [];
    let currentPity = pityCounter;
    let rollsRemaining = luckCharges.remainingRolls;
    const currentMultiplier = luckCharges.multiplier;

    for (let i = 0; i < count; i++) {
      const activeLuck = rollsRemaining > 0 ? currentMultiplier : 1;
      if (rollsRemaining > 0) rollsRemaining--;

      const item = calculateFairRoll(activeLuck, currentPity);
      rolledItems.push(item);
      totalEarnedVC += item.vcoinWorth;
      nextInv[item.id] = (nextInv[item.id] || 0) + 1;

      if (item.chanceDenominator >= 500) {
        currentPity = 0;
      } else {
        currentPity++;
      }
    }

    setPityCounter(currentPity);
    setLuckCharges(prev => ({ ...prev, remainingRolls: rollsRemaining }));
    setLastRolledItem(rolledItems[rolledItems.length - 1]);
    setRollHistory(prev => [...rolledItems, ...prev].slice(0, 25));
    onInventoryUpdate(nextInv, totalEarnedVC);
    setIsRolling(false);

    const highest = rolledItems.reduce((max, curr) => curr.chanceDenominator > max.chanceDenominator ? curr : max, rolledItems[0]);
    notify(`🎲 Multi-Tirage V2 (${count}x) terminé ! Meilleure relique : ${highest.name} (+${totalEarnedVC} VC)`);
  };

  const finishRoll = (item: RngUniverseItem) => {
    setIsRolling(false);
    setLastRolledItem(item);
    setReelPreviewItem(null);

    // Audio cue based on rarity
    if (item.chanceDenominator >= 1000) {
      audio.playWin();
      notify(`🌟 TIRAGE DIVIN : ${item.name} (1 sur ${item.chanceDenominator.toLocaleString()}) !`);
    } else if (item.chanceDenominator >= 200) {
      audio.playLevelUp();
      notify(`✨ Relique Rare : ${item.name} !`);
    } else {
      audio.playWin();
    }

    // Add to inventory
    const nextInv = { ...inventory, [item.id]: (inventory[item.id] || 0) + 1 };
    onInventoryUpdate(nextInv, item.vcoinWorth);

    // Update history
    setRollHistory(prev => [item, ...prev.slice(0, 19)]);
  };

  // Auto Roll management
  useEffect(() => {
    if (autoRoll) {
      autoRollIntervalRef.current = setInterval(() => {
        performRoll(true);
      }, fastRoll ? 400 : 900);
    } else {
      if (autoRollIntervalRef.current) clearInterval(autoRollIntervalRef.current);
    }
    return () => {
      if (autoRollIntervalRef.current) clearInterval(autoRollIntervalRef.current);
      if (reelAnimRef.current) clearInterval(reelAnimRef.current);
    };
  }, [autoRoll, fastRoll, pityCounter, luckCharges]);

  // Buy potion
  const handleBuyPotion = (multiplier: number, rolls: number, cost: number, name: string) => {
    if (userVCoins < cost) {
      audio.playDamage();
      notify(`Fonds insuffisants ! Il vous faut ${cost} V-Coins.`);
      return;
    }
    audio.playLevelUp();
    onInventoryUpdate(inventory, -cost);
    setLuckCharges({ multiplier, remainingRolls: rolls });
    notify(`Potion activée : ${name} ! ${multiplier}x Chance pendant ${rolls} tirages.`);
  };

  // Sell Item for 70% refund
  const handleSellItem = (itemId: string) => {
    const item = RNG_UNIVERSE_ITEMS.find(i => i.id === itemId);
    const count = inventory[itemId] || 0;
    if (!item || count <= 0) return;

    const refund = Math.floor(item.vcoinWorth * 0.7);
    const nextInv = { ...inventory };
    if (count === 1) {
      delete nextInv[itemId];
    } else {
      nextInv[itemId] = count - 1;
    }
    audio.playCoin();
    onInventoryUpdate(nextInv, refund);
    notify(`Vendu : 1x ${item.name} pour +${refund} VC !`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="liquid-glass-container w-full max-w-4xl max-h-[92vh] rounded-3xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl relative border border-white/15 text-slate-100"
        >
          {/* Specular Top Glint */}
          <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] text-xl">
                🎲
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white font-mono tracking-tight uppercase">
                    {t.rngSanctuary}
                  </h2>
                </div>
                <p className="text-xs text-slate-300">
                  {t.rngSubtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Active Luck Capsule */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-pill text-cyan-300 font-mono text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
                <span>
                  {currentLuckMultiplier > 1
                    ? `${currentLuckMultiplier}x ${t.luckBooster} (${luckCharges.remainingRolls})`
                    : language === 'en' ? '1x Standard Luck' : language === 'es' ? '1x Suerte Normal' : '1x Chance Normale'}
                </span>
              </div>

              {/* V-Coins Pill */}
              <div className="liquid-glass-vc flex items-center gap-1.5 px-3 py-1 rounded-xl text-yellow-300 text-xs font-mono font-bold shadow-sm">
                <Coins className="w-3.5 h-3.5 fill-current text-yellow-400" />
                <span>{userVCoins.toLocaleString()} VC</span>
              </div>

              <button
                onClick={() => {
                  audio.playClick();
                  onClose();
                }}
                className="w-9 h-9 rounded-full liquid-glass-pill text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shadow-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-5 py-2 rounded-full bg-cyan-500 text-slate-950 font-mono text-xs font-black shadow-xl border border-cyan-300 animate-fade-in">
              {toastMessage}
            </div>
          )}

          {/* Liquid Glass Segmented Navigation Bar */}
          <div className="pt-3 pb-2 flex items-center justify-between gap-2 border-b border-white/10">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl liquid-glass-pill border-white/10">
              {[
                { id: 'roll', label: language === 'en' ? '🎲 Wheel & Rolls' : language === 'es' ? '🎲 Tiradas' : '🎲 Tirage & Roulette' },
                { id: 'inventory', label: `${language === 'en' ? '🎒 Inventory' : language === 'es' ? '🎒 Inventario' : '🎒 Inventaire'} (${Object.keys(inventory).length})` },
                { id: 'potions', label: language === 'en' ? '🧪 Luck Potions' : language === 'es' ? '🧪 Pociones' : '🧪 Potions de Chance' },
                { id: 'trades', label: `${language === 'en' ? '🤝 NPC Market' : language === 'es' ? '🤝 Mercado' : '🤝 Marché PNJ'} (${tradeRequests.length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    audio.playClick();
                    setActiveTab(tab.id as any);
                  }}
                  className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-cyan-400 text-slate-950 shadow-md font-black'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Pity Counter Tag */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl liquid-glass-pill text-xs font-mono text-slate-300">
              <span className="text-slate-400">
                {language === 'en' ? 'Epic Pity:' : language === 'es' ? 'Piedad Épica:' : 'Pitié Épique :'}
              </span>
              <strong className="text-cyan-300 font-bold">{pityCounter} / 25</strong>
            </div>
          </div>

          {/* Tab 1: ROLL & ROULETTE */}
          {activeTab === 'roll' && (
            <div className="flex-1 overflow-y-auto my-3 flex flex-col items-center justify-between space-y-4 no-scrollbar">
              {/* Animated Liquid Glass Reel Display */}
              <div className="w-full max-w-xl h-56 rounded-3xl liquid-glass-card border border-white/20 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                {/* Background Dynamic Ambient Aura */}
                <div
                  className="absolute inset-0 opacity-25 filter blur-3xl transition-all duration-500 pointer-events-none"
                  style={{
                    backgroundColor:
                      reelPreviewItem?.accentColor || lastRolledItem?.accentColor || '#06b6d4'
                  }}
                />

                {/* Top Inner Specular Highlight */}
                <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

                {isRolling ? (
                  <div className="flex flex-col items-center space-y-3 z-10 animate-pulse">
                    <div
                      className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl border-2 shadow-2xl backdrop-blur-md"
                      style={{
                        backgroundColor: `${reelPreviewItem?.accentColor || '#06b6d4'}25`,
                        borderColor: reelPreviewItem?.accentColor || '#06b6d4'
                      }}
                    >
                      🎲
                    </div>
                    <span className="text-base font-black text-cyan-300 font-mono">
                      {reelPreviewItem?.name || 'TIRAGE EN COURS...'}
                    </span>
                    <span className="text-xs text-slate-300 font-mono">
                      Probabilité : 1 sur {reelPreviewItem?.chanceDenominator.toLocaleString() || '...'}
                    </span>
                  </div>
                ) : lastRolledItem ? (
                  <div className="flex flex-col items-center space-y-2 z-10 text-center animate-fade-in">
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-black uppercase font-mono tracking-wider backdrop-blur-md"
                      style={{
                        backgroundColor: `${lastRolledItem.accentColor}25`,
                        color: lastRolledItem.accentColor,
                        border: `1px solid ${lastRolledItem.accentColor}`
                      }}
                    >
                      {lastRolledItem.rarity} • 1 SUR {lastRolledItem.chanceDenominator.toLocaleString()}
                    </span>
                    <h3 className="text-xl font-black text-white font-mono tracking-tight">
                      {lastRolledItem.name}
                    </h3>
                    <p className="text-xs text-slate-200 max-w-md line-clamp-2">
                      {lastRolledItem.description}
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-xs font-mono">
                      <span className="text-yellow-400 font-bold">+{lastRolledItem.vcoinWorth} VC Récoltés</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-cyan-300">Univers : {lastRolledItem.universe}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2 z-10">
                    <div className="text-4xl animate-bounce">✨</div>
                    <h3 className="text-base font-bold text-white font-mono">Prêt pour le Tirage Cosmique</h3>
                    <p className="text-xs text-slate-300">
                      Lancez la roulette pour découvrir des reliques mythiques et légendaires !
                    </p>
                  </div>
                )}
              </div>

              {/* Roll Controls V2 */}
              <div className="w-full max-w-xl flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2.5 w-full">
                  <button
                    onClick={() => setFastRoll(!fastRoll)}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      fastRoll
                        ? 'bg-amber-500/25 text-yellow-300 border border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                        : 'liquid-glass-pill text-slate-300 hover:text-white'
                    }`}
                  >
                    ⚡ {language === 'en' ? 'Fast' : language === 'es' ? 'Rápido' : 'Rapide'} {fastRoll ? 'ON' : 'OFF'}
                  </button>

                  <button
                    onClick={() => setAutoRoll(!autoRoll)}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      autoRoll
                        ? 'bg-rose-500/25 text-rose-300 border border-rose-400/60 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                        : 'liquid-glass-pill text-slate-300 hover:text-white'
                    }`}
                  >
                    🔄 Auto {autoRoll ? 'ON' : 'OFF'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => performMultiRoll(5)}
                      disabled={isRolling}
                      className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/35 border border-purple-400/50 text-purple-300 font-mono text-xs font-bold cursor-pointer disabled:opacity-40 transition-all active:scale-95"
                    >
                      🎲 5x
                    </button>
                    <button
                      onClick={() => performMultiRoll(10)}
                      disabled={isRolling}
                      className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/50 text-amber-300 font-mono text-xs font-black cursor-pointer disabled:opacity-40 transition-all active:scale-95"
                    >
                      🌟 10x
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => performRoll()}
                  disabled={isRolling}
                  className="w-full py-3.5 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 active:scale-95 text-slate-950 font-black text-sm uppercase tracking-wider font-mono shadow-[0_0_25px_rgba(6,182,212,0.6)] cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Dice5 className="w-4 h-4 stroke-[2.5]" /> {language === 'en' ? 'SUMMON 1x RELIC' : language === 'es' ? 'TIRADA 1x RELIQUIA' : 'TIRAGE 1x RELIQUE'}
                </button>
              </div>

              {/* Live Odds & Drop Table Preview */}
              <div className="w-full max-w-xl p-3.5 rounded-2xl liquid-glass-card border border-white/10">
                <h4 className="text-xs font-bold text-slate-300 font-mono mb-2 flex items-center justify-between">
                  <span>
                    {language === 'en' ? `Current Probability Table (${currentLuckMultiplier}x Luck):` :
                     language === 'es' ? `Tabla de Probabilidades (${currentLuckMultiplier}x Suerte):` :
                     `Table des Probabilités Actuelles (${currentLuckMultiplier}x Chance) :`}
                  </span>
                  <span className="text-[10px] text-cyan-300">
                    {language === 'en' ? `Total Rolls: ${totalRolls}` :
                     language === 'es' ? `Tiradas Totales: ${totalRolls}` :
                     `Tirages Totaux : ${totalRolls}`}
                  </span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-xl liquid-glass-pill text-slate-300 text-center">
                    {language === 'en' ? 'Common:' : language === 'es' ? 'Común:' : 'Commun :'} <strong className="text-white">~52%</strong>
                  </div>
                  <div className="p-2 rounded-xl liquid-glass-pill text-blue-300 text-center">
                    {language === 'en' ? 'Rare:' : language === 'es' ? 'Raro:' : 'Rare :'} <strong className="text-white">~26%</strong>
                  </div>
                  <div className="p-2 rounded-xl liquid-glass-pill text-purple-300 text-center">
                    {language === 'en' ? 'Epic:' : language === 'es' ? 'Épico:' : 'Épique :'} <strong className="text-white">~14%</strong>
                  </div>
                  <div className="p-2 rounded-xl liquid-glass-pill text-yellow-300 text-center">
                    {language === 'en' ? 'Mythic:' : language === 'es' ? 'Mítico:' : 'Mythique :'} <strong className="text-white">~4.5%</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="flex-1 overflow-y-auto my-3 space-y-4 no-scrollbar">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  {language === 'en' ? `Discovered Relics (${Object.keys(inventory).length} unique)` :
                   language === 'es' ? `Reliquias Descubiertas (${Object.keys(inventory).length} únicas)` :
                   `Objets Découverts (${Object.keys(inventory).length} uniques)`}
                </h3>
                <p className="text-xs text-slate-300">
                  {language === 'en' ? 'Sell duplicates to instantly get V-Coins!' :
                   language === 'es' ? '¡Vende tus duplicados para obtener V-Coins al instante!' :
                   'Vendez vos doublons pour récupérer instantanément des V-Coins !'}
                </p>
              </div>

              {Object.keys(inventory).length === 0 ? (
                <div className="text-center py-16 text-slate-400 font-mono text-xs">
                  {language === 'en' ? 'Your inventory is empty. Start rolling in the Rolls tab!' :
                   language === 'es' ? 'Tu inventario está vacío. ¡Haz tus primeras tiradas en la pestaña Tiradas!' :
                   'Votre inventaire est vide. Lancez vos premiers tirages dans l\'onglet Tirage !'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(inventory).map(([itemId, count]) => {
                    const item = RNG_UNIVERSE_ITEMS.find(i => i.id === itemId);
                    if (!item || count <= 0) return null;

                    return (
                      <div
                        key={itemId}
                        className="p-3.5 rounded-2xl liquid-glass-card border border-white/10 flex items-center justify-between gap-3 shadow-md hover:border-cyan-400/40 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="px-2 py-0.5 rounded text-[9px] font-black uppercase font-mono"
                              style={{
                                backgroundColor: `${item.accentColor}25`,
                                color: item.accentColor
                              }}
                            >
                              {item.rarity}
                            </span>
                            <span className="text-[10px] text-slate-300 font-mono">
                              x{count}
                            </span>
                          </div>
                          <h4 className="font-bold text-white text-xs font-mono">{item.name}</h4>
                          <span className="text-[10px] text-yellow-400 font-mono">
                            {language === 'en' ? 'Value' : language === 'es' ? 'Valor' : 'Valeur'} : {item.vcoinWorth} VC
                          </span>
                        </div>

                        <button
                          onClick={() => handleSellItem(itemId)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/35 border border-rose-400/50 text-rose-300 text-[10px] font-mono font-bold cursor-pointer transition-colors active:scale-95"
                        >
                          {language === 'en' ? 'Sell' : language === 'es' ? 'Vender' : 'Vendre'} ({Math.floor(item.vcoinWorth * 0.7)} VC)
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: POTIONS & LUCK ALCHEMY */}
          {activeTab === 'potions' && (
            <div className="flex-1 overflow-y-auto my-3 space-y-4 no-scrollbar">
              <div>
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  {language === 'en' ? 'Alchemy Laboratory' : language === 'es' ? 'Laboratorio de Alquimia' : 'Laboratoire d\'Alchimie'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {language === 'en' ? 'Buy elixirs to multiply your chances of getting legendary and mythic relics!' :
                   language === 'es' ? '¡Compra elixires para multiplicar tus posibilidades de conseguir reliquias legendarias y míticas!' :
                   'Achetez des élixirs pour démultiplier vos chances d\'obtenir des reliques légendaires et mythiques !'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Potion 1 */}
                <div className="p-5 rounded-3xl liquid-glass-card border border-emerald-400/40 flex flex-col justify-between space-y-4 shadow-lg hover:border-emerald-400/70 transition-all">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-2xl mb-3 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      🍀
                    </div>
                    <h4 className="font-bold text-white text-sm font-mono">
                      {language === 'en' ? 'Clover Elixir' : language === 'es' ? 'Elixir de Trébol' : 'Élixir Trèfle'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      {language === 'en' ? 'Increases luck by +50% (1.5x) for 15 consecutive rolls.' :
                       language === 'es' ? 'Aumenta tu suerte un +50% (1.5x) durante 15 tiradas consecutivas.' :
                       'Augmente vos chances de +50% (1.5x) pendant 15 tirages consécutifs.'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleBuyPotion(1.5, 15, 75, 'Élixir Trèfle')}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs font-mono uppercase cursor-pointer active:scale-95 transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  >
                    {language === 'en' ? 'Buy' : language === 'es' ? 'Comprar' : 'Acheter'} (75 VC)
                  </button>
                </div>

                {/* Potion 2 */}
                <div className="p-5 rounded-3xl liquid-glass-card border border-cyan-400/40 flex flex-col justify-between space-y-4 shadow-lg hover:border-cyan-400/70 transition-all">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center text-2xl mb-3 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                      ⚡
                    </div>
                    <h4 className="font-bold text-white text-sm font-mono">
                      {language === 'en' ? 'Stellar Potion' : language === 'es' ? 'Poción Estelar' : 'Potion Stellaire'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      {language === 'en' ? 'Multiplies your luck by 2.5x for 25 consecutive rolls.' :
                       language === 'es' ? 'Multiplica tu suerte por 2.5x durante 25 tiradas consecutivas.' :
                       'Multiplie vos chances par 2.5x pendant 25 tirages consécutifs.'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleBuyPotion(2.5, 25, 180, 'Potion Stellaire')}
                    className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs font-mono uppercase cursor-pointer active:scale-95 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  >
                    {language === 'en' ? 'Buy' : language === 'es' ? 'Comprar' : 'Acheter'} (180 VC)
                  </button>
                </div>

                {/* Potion 3 */}
                <div className="p-5 rounded-3xl liquid-glass-card border border-purple-400/40 flex flex-col justify-between space-y-4 shadow-lg hover:border-purple-400/70 transition-all">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/60 flex items-center justify-center text-2xl mb-3 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                      🌌
                    </div>
                    <h4 className="font-bold text-white text-sm font-mono">
                      {language === 'en' ? 'Celestial Essence' : language === 'es' ? 'Esencia Celestial' : 'Essence Céleste'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      {language === 'en' ? 'Multiplies your luck by 4x for 40 consecutive rolls!' :
                       language === 'es' ? '¡Multiplica tu suerte por 4x durante 40 tiradas consecutivas!' :
                       'Multiplie vos chances par 4x pendant 40 tirages consécutifs !'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleBuyPotion(4, 40, 350, 'Essence Céleste')}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-black text-xs font-mono uppercase cursor-pointer active:scale-95 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  >
                    {language === 'en' ? 'Buy' : language === 'es' ? 'Comprar' : 'Acheter'} (350 VC)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: TRADES */}
          {activeTab === 'trades' && (
            <div className="flex-1 overflow-y-auto my-3 space-y-4 no-scrollbar">
              <div>
                <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  {language === 'en' ? 'NPC & Collector Market Offers' :
                   language === 'es' ? 'Ofertas del Mercado de PNJs' :
                   'Offres des PNJ et Collectionneurs'}
                </h3>
                <p className="text-xs text-slate-300">
                  {language === 'en' ? 'Accept their trade requests to earn bonus V-Coins!' :
                   language === 'es' ? '¡Acepta sus ofertas de intercambio para ganar V-Coins extra!' :
                   'Acceptez leurs offres d\'échange pour gagner des V-Coins supplémentaires !'}
                </p>
              </div>

              <div className="space-y-3">
                {tradeRequests.map((trade) => (
                  <div
                    key={trade.id}
                    className="p-4 rounded-2xl liquid-glass-card border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-cyan-400/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-xs font-mono">{trade.traderName}</span>
                        <span className="text-[10px] text-cyan-300 font-mono">({trade.traderTitle})</span>
                      </div>
                      <p className="text-xs text-slate-300 italic">"{trade.message}"</p>
                      <div className="text-[11px] text-yellow-400 font-mono mt-1 font-bold">
                        {language === 'en' ? 'Offer' : language === 'es' ? 'Oferta' : 'Offre'} : +{trade.offeredVCoins} V-Coins
                      </div>
                    </div>

                    <button
                      onClick={() => onAcceptTrade(trade.id)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs font-mono uppercase cursor-pointer transition-all active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.35)]"
                    >
                      {language === 'en' ? 'Accept' : language === 'es' ? 'Aceptar' : 'Accepter'} (+{trade.offeredVCoins} VC)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer Info */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>
              {language === 'en' ? 'Certified fair odds • Guaranteed pity at 25 rolls' :
               language === 'es' ? 'Probabilidades certificadas justas • Piedad garantizada a las 25 tiradas' :
               'Probabilités certifiées équitables • Pitié garantie à 25 tirages'}
            </span>
            <span className="text-cyan-400 font-bold">Vertex Arcades</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
