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

interface RngUniverseModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: Record<string, number>;
  onInventoryUpdate: (newInventory: Record<string, number>, earnedVC: number) => void;
  tradeRequests: TradeRequest[];
  onAcceptTrade: (tradeId: string) => void;
  totalRolls: number;
  userVCoins: number;
}

export function RngUniverseModal({
  isOpen,
  onClose,
  inventory,
  onInventoryUpdate,
  tradeRequests,
  onAcceptTrade,
  totalRolls,
  userVCoins
}: RngUniverseModalProps) {
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
    // Base weight formula: Weight = 100,000 / (chanceDenominator^0.8)
    // High rarity items get boosted by luck multiplier
    const itemsWithWeights = RNG_UNIVERSE_ITEMS.map(item => {
      let weight = 100000 / Math.pow(item.chanceDenominator, 0.85);

      // Apply luck boost to rare/epic/legendary/mythic
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

    const rollDuration = instant ? 120 : fastRoll ? 300 : 750;
    audio.playRngTick();

    // Horizontal reel simulation
    let stepCount = 0;
    const maxSteps = instant ? 2 : fastRoll ? 5 : 12;
    const intervalMs = Math.floor(rollDuration / maxSteps);

    reelAnimRef.current = setInterval(() => {
      const randomPreview = RNG_UNIVERSE_ITEMS[Math.floor(Math.random() * RNG_UNIVERSE_ITEMS.length)];
      setReelPreviewItem(randomPreview);
      audio.playRngTick();
      stepCount++;
      if (stepCount >= maxSteps) {
        clearInterval(reelAnimRef.current);
        reelAnimRef.current = null;
      }
    }, intervalMs);

    setTimeout(() => {
      if (reelAnimRef.current) clearInterval(reelAnimRef.current);

      const nextPity = pityCounter + 1;
      const chosen = calculateFairRoll(currentLuckMultiplier, nextPity);

      // Decrement luck charges if active
      if (luckCharges.remainingRolls > 0) {
        setLuckCharges(prev => ({
          ...prev,
          remainingRolls: Math.max(0, prev.remainingRolls - 1)
        }));
      }

      // Reset or increment pity
      if (chosen.chanceDenominator >= 500) {
        setPityCounter(0);
      } else {
        setPityCounter(nextPity >= 25 ? 0 : nextPity);
      }

      setIsRolling(false);
      setLastRolledItem(chosen);
      setReelPreviewItem(null);
      setRollHistory(prev => [chosen, ...prev.slice(0, 7)]);

      if (chosen.chanceDenominator >= 5000) {
        audio.playMythicReveal();
        setAutoRoll(false);
      } else if (chosen.chanceDenominator >= 500) {
        audio.playWin();
      } else {
        audio.playCoin();
      }

      // Update Inventory & VC
      const nextInv = { ...inventory, [chosen.id]: (inventory[chosen.id] || 0) + 1 };
      onInventoryUpdate(nextInv, chosen.vcoinWorth);
    }, rollDuration);
  };

  // Auto-roll handler
  useEffect(() => {
    if (autoRoll) {
      autoRollIntervalRef.current = setInterval(() => {
        performRoll(true);
      }, 500);
    } else {
      if (autoRollIntervalRef.current) {
        clearInterval(autoRollIntervalRef.current);
        autoRollIntervalRef.current = null;
      }
    }
    return () => {
      if (autoRollIntervalRef.current) clearInterval(autoRollIntervalRef.current);
      if (reelAnimRef.current) clearInterval(reelAnimRef.current);
    };
  }, [autoRoll, currentLuckMultiplier, inventory, pityCounter]);

  // Buy Luck Potion
  const handleBuyPotion = (multiplier: number, rolls: number, cost: number, name: string) => {
    if (userVCoins < cost) {
      notify('❌ V-Coins insuffisants !');
      return;
    }
    audio.playWin();
    setLuckCharges({ multiplier, remainingRolls: rolls });
    onInventoryUpdate(inventory, -cost);
    notify(`🧪 ${name} activée : ${multiplier}x Chance pendant ${rolls} tirages !`);
  };

  // Sell duplicate items
  const handleSellItem = (itemId: string) => {
    const count = inventory[itemId] || 0;
    if (count <= 0) return;
    const item = RNG_UNIVERSE_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    const refund = Math.max(10, Math.floor(item.vcoinWorth * 0.7));
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900/90 border border-white/10 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.35)] flex flex-col overflow-hidden text-slate-100 backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 border border-cyan-300 flex items-center justify-center text-slate-950 text-2xl shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                🎲
              </div>
              <div>
                <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-300 font-mono">
                  SANCTUAIRE RNG STELLAIRE
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Tirages de reliques, probabilités équilibrées & alchimie de chance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Active Luck Capsule */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
                <span>
                  {currentLuckMultiplier > 1
                    ? `${currentLuckMultiplier}x Chance (${luckCharges.remainingRolls} restants)`
                    : '1x Chance Normale'}
                </span>
              </div>

              {/* V-Coins Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/80 border border-amber-500 text-yellow-300 font-mono text-xs font-bold">
                <Coins className="w-3.5 h-3.5 text-yellow-400" />
                <span>{userVCoins.toLocaleString()} VC</span>
              </div>

              <button
                onClick={() => {
                  audio.playClick();
                  onClose();
                }}
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Toast */}
          {toastMessage && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-5 py-2 rounded-full bg-cyan-600 text-white font-mono text-xs font-bold shadow-xl border border-cyan-300">
              {toastMessage}
            </div>
          )}

          {/* iOS Segmented Navigation Bar */}
          <div className="px-6 pt-4 pb-2 border-b border-white/5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/70 border border-white/5">
              {[
                { id: 'roll', label: '🎲 Tirage & Roulette' },
                { id: 'inventory', label: `🎒 Inventaire (${Object.keys(inventory).length})` },
                { id: 'potions', label: '🧪 Potions de Chance' },
                { id: 'trades', label: `🤝 Marché PNJ (${tradeRequests.length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    audio.playClick();
                    setActiveTab(tab.id as any);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Pity Counter Tag */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Pitié Épique :</span>
              <strong className="text-cyan-300 font-bold">{pityCounter} / 25</strong>
            </div>
          </div>

          {/* Tab 1: ROLL & ROULETTE */}
          {activeTab === 'roll' && (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-between space-y-6">
              {/* Animated Reel Display */}
              <div className="w-full max-w-xl h-56 rounded-3xl bg-slate-950/90 border-2 border-cyan-500/40 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                {/* Background Glow */}
                <div
                  className="absolute inset-0 opacity-20 filter blur-3xl transition-all"
                  style={{
                    backgroundColor:
                      reelPreviewItem?.accentColor || lastRolledItem?.accentColor || '#06b6d4'
                  }}
                />

                {isRolling ? (
                  <div className="flex flex-col items-center space-y-3 z-10 animate-pulse">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl border-2 shadow-2xl"
                      style={{
                        backgroundColor: `${reelPreviewItem?.accentColor || '#06b6d4'}20`,
                        borderColor: reelPreviewItem?.accentColor || '#06b6d4'
                      }}
                    >
                      🎲
                    </div>
                    <span className="text-base font-black text-cyan-300 font-mono">
                      {reelPreviewItem?.name || 'TIRAGE EN COURS...'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Probabilité : 1 sur {reelPreviewItem?.chanceDenominator.toLocaleString() || '...'}
                    </span>
                  </div>
                ) : lastRolledItem ? (
                  <div className="flex flex-col items-center space-y-2 z-10 text-center">
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase font-mono tracking-wider"
                      style={{
                        backgroundColor: `${lastRolledItem.accentColor}25`,
                        color: lastRolledItem.accentColor,
                        border: `1px solid ${lastRolledItem.accentColor}`
                      }}
                    >
                      {lastRolledItem.rarity} • 1 SUR {lastRolledItem.chanceDenominator.toLocaleString()}
                    </span>
                    <h3 className="text-xl font-black text-white font-mono">
                      {lastRolledItem.name}
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md line-clamp-2">
                      {lastRolledItem.description}
                    </p>
                    <div className="flex items-center gap-3 pt-2 text-xs font-mono">
                      <span className="text-yellow-400 font-bold">+{lastRolledItem.vcoinWorth} VC Récoltés</span>
                      <span className="text-slate-400">Univers : {lastRolledItem.universe}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2 z-10">
                    <div className="text-4xl">✨</div>
                    <h3 className="text-base font-bold text-white font-mono">Prêt pour le Tirage</h3>
                    <p className="text-xs text-slate-400">
                      Lancez la roulette pour découvrir des reliques mythiques !
                    </p>
                  </div>
                )}
              </div>

              {/* Roll Controls */}
              <div className="w-full max-w-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setFastRoll(!fastRoll)}
                    className={`flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      fastRoll
                        ? 'bg-amber-500/20 text-yellow-300 border-amber-400'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    ⚡ Rapide {fastRoll ? 'Activé' : 'Désactivé'}
                  </button>

                  <button
                    onClick={() => setAutoRoll(!autoRoll)}
                    className={`flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      autoRoll
                        ? 'bg-rose-500/20 text-rose-300 border-rose-400'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    🔄 Auto {autoRoll ? 'En cours' : 'Désactivé'}
                  </button>
                </div>

                <button
                  onClick={() => performRoll()}
                  disabled={isRolling}
                  className="w-full sm:w-auto flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-blue-400 active:scale-98 text-slate-950 font-black text-sm uppercase tracking-wider font-mono shadow-[0_0_25px_rgba(6,182,212,0.6)] cursor-pointer disabled:opacity-50"
                >
                  🎲 TIRER UNE RELIQUE
                </button>
              </div>

              {/* Live Odds & Drop Table Preview */}
              <div className="w-full max-w-xl p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                <h4 className="text-xs font-bold text-slate-300 font-mono mb-2 flex items-center justify-between">
                  <span>Table des Probabilités Actuelles ({currentLuckMultiplier}x Chance) :</span>
                  <span className="text-[10px] text-cyan-300">Tirages Totaux : {totalRolls}</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
                    Commun : <strong>~52%</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-blue-300">
                    Rare : <strong>~26%</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-purple-300">
                    Épique : <strong>~14%</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-yellow-300">
                    Mythique : <strong>~4.5%</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-mono">
                  Objets Découverts ({Object.keys(inventory).length} uniques)
                </h3>
                <p className="text-xs text-slate-400">
                  Vendez vos doublons pour récupérer instantanément des V-Coins !
                </p>
              </div>

              {Object.keys(inventory).length === 0 ? (
                <div className="text-center py-16 text-slate-500 font-mono text-sm">
                  Votre inventaire est vide. Lancez vos premiers tirages dans l'onglet Tirage !
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(inventory).map(([itemId, count]) => {
                    const item = RNG_UNIVERSE_ITEMS.find(i => i.id === itemId);
                    if (!item || count <= 0) return null;

                    return (
                      <div
                        key={itemId}
                        className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 shadow-md"
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
                            <span className="text-[10px] text-slate-400 font-mono">
                              x{count}
                            </span>
                          </div>
                          <h4 className="font-bold text-white text-xs font-mono">{item.name}</h4>
                          <span className="text-[10px] text-yellow-400 font-mono">
                            Valeur : {item.vcoinWorth} VC
                          </span>
                        </div>

                        <button
                          onClick={() => handleSellItem(itemId)}
                          className="px-3 py-1.5 rounded-xl bg-red-950/70 hover:bg-red-900 border border-red-500 text-red-300 text-[10px] font-mono font-bold cursor-pointer transition-colors"
                        >
                          Vendre ({Math.floor(item.vcoinWorth * 0.7)} VC)
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
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white font-mono">Laboratoire d'Alchimie</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Achetez des élixirs pour démultiplier vos chances d'obtenir des reliques légendaires et mythiques !
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Potion 1 */}
                <div className="p-5 rounded-3xl bg-slate-950/80 border border-emerald-500/40 flex flex-col justify-between space-y-4 shadow-lg">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-2xl mb-3">
                      🍀
                    </div>
                    <h4 className="font-bold text-white text-sm font-mono">Élixir Trèfle</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Augmente vos chances de <strong>+50% (1.5x)</strong> pendant 15 tirages consécutifs.
                    </p>
                  </div>
                  <button
                    onClick={() => handleBuyPotion(1.5, 15, 75, 'Élixir Trèfle')}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs font-mono uppercase cursor-pointer"
                  >
                    Acheter (75 VC)
                  </button>
                </div>

                {/* Potion 2 */}
                <div className="p-5 rounded-3xl bg-slate-950/80 border border-cyan-500/40 flex flex-col justify-between space-y-4 shadow-lg">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-2xl mb-3">
                      ⚡
                    </div>
                    <h4 className="font-bold text-white text-sm font-mono">Potion Stellaire</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Multiplie vos chances par <strong>2.5x</strong> pendant 25 tirages consécutifs.
                    </p>
                  </div>
                  <button
                    onClick={() => handleBuyPotion(2.5, 25, 180, 'Potion Stellaire')}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs font-mono uppercase cursor-pointer"
                  >
                    Acheter (180 VC)
                  </button>
                </div>

                {/* Potion 3 */}
                <div className="p-5 rounded-3xl bg-slate-950/80 border border-purple-500/40 flex flex-col justify-between space-y-4 shadow-lg">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-2xl mb-3">
                      🌌
                    </div>
                    <h4 className="font-bold text-white text-sm font-mono">Essence Céleste</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Multiplie vos chances par <strong>4x</strong> pendant 40 tirages consécutifs !
                    </p>
                  </div>
                  <button
                    onClick={() => handleBuyPotion(4, 40, 350, 'Essence Céleste')}
                    className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-xs font-mono uppercase cursor-pointer"
                  >
                    Acheter (350 VC)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: TRADES */}
          {activeTab === 'trades' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white font-mono">Offres des PNJ et Collectionneurs</h3>
                <p className="text-xs text-slate-300">
                  Acceptez leurs offres d'échange pour gagner des V-Coins supplémentaires !
                </p>
              </div>

              <div className="space-y-3">
                {tradeRequests.map((trade) => (
                  <div
                    key={trade.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-xs font-mono">{trade.traderName}</span>
                        <span className="text-[10px] text-cyan-300 font-mono">({trade.traderTitle})</span>
                      </div>
                      <p className="text-xs text-slate-300 italic">"{trade.message}"</p>
                      <div className="text-[11px] text-yellow-400 font-mono mt-1 font-bold">
                        Offre : +{trade.offeredVCoins} V-Coins
                      </div>
                    </div>

                    <button
                      onClick={() => onAcceptTrade(trade.id)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs font-mono uppercase cursor-pointer transition-all"
                    >
                      Accepter (+{trade.offeredVCoins} VC)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
