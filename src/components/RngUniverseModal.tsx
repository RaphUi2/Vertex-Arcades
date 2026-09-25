import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, RefreshCw, Dice5, Shield, Check, Flame, Trophy, Coins, ArrowRightLeft, Play, Pause, Zap, Award, Trash2 } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'roll' | 'inventory' | 'trades'>('roll');
  const [selectedUniverse, setSelectedUniverse] = useState<string>('all');
  const [isRolling, setIsRolling] = useState(false);
  const [lastRolledItem, setLastRolledItem] = useState<RngUniverseItem | null>(null);
  const [luckMultiplier, setLuckMultiplier] = useState(1);
  const [rollHistory, setRollHistory] = useState<RngUniverseItem[]>([]);
  const [fastRoll, setFastRoll] = useState(false);
  const [autoRoll, setAutoRoll] = useState(false);
  const [pityCounter, setPityCounter] = useState(0);
  const [reelPreviewItem, setReelPreviewItem] = useState<RngUniverseItem | null>(null);
  const [tradeMessage, setTradeMessage] = useState<string | null>(null);

  const autoRollIntervalRef = useRef<any>(null);
  const reelAnimRef = useRef<any>(null);

  // Perform clean, bug-free probabilistic RNG roll
  const performRoll = (instant = false) => {
    if (isRolling && !instant) return;
    setIsRolling(true);

    const rollDuration = instant ? 100 : (fastRoll ? 250 : 650);

    // Audio feedback
    audio.playRngTick();

    // Animated fast cycling reel preview
    let stepCount = 0;
    const maxSteps = instant ? 2 : (fastRoll ? 4 : 10);
    const intervalMs = Math.floor(rollDuration / maxSteps);

    reelAnimRef.current = setInterval(() => {
      const randomItem = RNG_UNIVERSE_ITEMS[Math.floor(Math.random() * RNG_UNIVERSE_ITEMS.length)];
      setReelPreviewItem(randomItem);
      audio.playRngTick();
      stepCount++;
      if (stepCount >= maxSteps) {
        clearInterval(reelAnimRef.current);
        reelAnimRef.current = null;
      }
    }, intervalMs);

    setTimeout(() => {
      if (reelAnimRef.current) clearInterval(reelAnimRef.current);

      let chosen: RngUniverseItem | null = null;
      const currentPity = pityCounter + 1;

      // Pity Rule: At 30 rolls, guarantee Epic or better!
      if (currentPity >= 30) {
        const epicOrHigher = RNG_UNIVERSE_ITEMS.filter(i => i.chanceDenominator >= 800);
        chosen = epicOrHigher[Math.floor(Math.random() * epicOrHigher.length)];
        setPityCounter(0);
      } else {
        // Sort items by rarity (rarest first)
        const sortedRarest = [...RNG_UNIVERSE_ITEMS].sort((a, b) => b.chanceDenominator - a.chanceDenominator);

        for (const item of sortedRarest) {
          // Effective probability threshold
          const effectiveChance = (1 / item.chanceDenominator) * luckMultiplier;
          if (Math.random() < effectiveChance) {
            chosen = item;
            break;
          }
        }

        // If no rare item won, select fairly among common and uncommon items
        if (!chosen) {
          const commonItems = RNG_UNIVERSE_ITEMS.filter(i => i.chanceDenominator <= 50);
          chosen = commonItems[Math.floor(Math.random() * commonItems.length)];
          setPityCounter(currentPity);
        } else {
          // Reset pity if player hit rare/legendary/mythic
          if (chosen.chanceDenominator >= 800) {
            setPityCounter(0);
          } else {
            setPityCounter(currentPity);
          }
        }
      }

      setIsRolling(false);
      setLastRolledItem(chosen);
      setReelPreviewItem(null);
      setRollHistory(prev => [chosen!, ...prev.slice(0, 9)]);

      if (chosen.chanceDenominator >= 5000) {
        audio.playMythicReveal();
        // Pause auto-roll on rare drop to allow player to celebrate
        setAutoRoll(false);
      } else {
        audio.playCoin();
      }

      // Update inventory and add V-Coins directly
      const nextInv = { ...inventory, [chosen.id]: (inventory[chosen.id] || 0) + 1 };
      onInventoryUpdate(nextInv, chosen.vcoinWorth);
    }, rollDuration);
  };

  // Auto-roll handler
  useEffect(() => {
    if (autoRoll) {
      autoRollIntervalRef.current = setInterval(() => {
        performRoll(true);
      }, 550);
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
  }, [autoRoll, luckMultiplier, inventory, pityCounter]);

  // Dismantle an item for 60% of its V-Coin worth
  const handleDismantle = (itemId: string) => {
    const count = inventory[itemId] || 0;
    if (count <= 0) return;
    const item = RNG_UNIVERSE_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    const refund = Math.floor(item.vcoinWorth * 0.6);
    const nextInv = { ...inventory };
    if (count === 1) {
      delete nextInv[itemId];
    } else {
      nextInv[itemId] = count - 1;
    }
    audio.playCoin();
    onInventoryUpdate(nextInv, refund);
  };

  // Trade handler with inventory verification
  const handleExecuteTrade = (trade: TradeRequest) => {
    // Check if player has all requested items
    const missing = trade.requestedItemIds.find(id => (inventory[id] || 0) <= 0);
    if (missing) {
      const item = RNG_UNIVERSE_ITEMS.find(i => i.id === missing);
      setTradeMessage(`Il vous manque l'objet requis : ${item ? item.name : missing}`);
      setTimeout(() => setTradeMessage(null), 3500);
      return;
    }

    // Process trade: deduct requested items, add offered items and offered V-Coins
    const nextInv = { ...inventory };
    for (const reqId of trade.requestedItemIds) {
      if (nextInv[reqId] > 1) {
        nextInv[reqId] -= 1;
      } else {
        delete nextInv[reqId];
      }
    }
    for (const offId of trade.offeredItemIds) {
      nextInv[offId] = (nextInv[offId] || 0) + 1;
    }

    audio.playWin();
    onInventoryUpdate(nextInv, trade.offeredVCoins);
    onAcceptTrade(trade.id);
    setTradeMessage(`Échange réussi avec ${trade.traderName} ! +${trade.offeredVCoins} VC`);
    setTimeout(() => setTradeMessage(null), 3500);
  };

  if (!isOpen) return null;

  const filteredItems = selectedUniverse === 'all'
    ? RNG_UNIVERSE_ITEMS
    : RNG_UNIVERSE_ITEMS.filter(i => i.universe === selectedUniverse);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-[#0c1020] border-2 border-cyan-500/60 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.4)] flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/30 bg-[#080d1a]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 border border-cyan-300 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                🎲
              </div>
              <div>
                <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 font-mono">
                  SANCTUAIRE RNG VERTEX
                </h2>
                <p className="text-xs text-cyan-400 font-mono">
                  Système probabiliste de reliques cosmiques & marché d'échange
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500 text-cyan-300 text-xs font-mono font-bold">
                Tirages : {totalRolls} 🎲
              </div>
              <button
                onClick={() => {
                  audio.playClick();
                  setAutoRoll(false);
                  onClose();
                }}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-[#080d1a]/80">
            <button
              onClick={() => { audio.playClick(); setActiveTab('roll'); }}
              className={`px-5 py-2.5 rounded-t-2xl font-bold text-xs uppercase transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'roll'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Dice5 className="w-4 h-4" /> Tirage RNG
            </button>
            <button
              onClick={() => { audio.playClick(); setActiveTab('inventory'); }}
              className={`px-5 py-2.5 rounded-t-2xl font-bold text-xs uppercase transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'inventory'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" /> Ma Collection ({Object.values(inventory).reduce((a, b) => a + b, 0)})
            </button>
            <button
              onClick={() => { audio.playClick(); setActiveTab('trades'); }}
              className={`px-5 py-2.5 rounded-t-2xl font-bold text-xs uppercase transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'trades'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" /> Marché d'Échange ({tradeRequests.length})
            </button>
          </div>

          {/* Toast Notification in Modal */}
          {tradeMessage && (
            <div className="bg-cyan-950 border-b border-cyan-500 text-cyan-200 px-6 py-2 text-xs font-mono text-center font-bold">
              {tradeMessage}
            </div>
          )}

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: ROLL RNG */}
            {activeTab === 'roll' && (
              <div className="flex flex-col items-center justify-center space-y-6 py-2">
                {/* Control bar: Luck, Speed, Pity */}
                <div className="flex flex-wrap items-center justify-center gap-3 bg-slate-900/90 px-5 py-2.5 rounded-2xl border border-cyan-500/30">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-300 font-bold">🍀 Potion de Chance :</span>
                    {[1, 2, 5].map(mult => (
                      <button
                        key={mult}
                        onClick={() => { audio.playClick(); setLuckMultiplier(mult); }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                          luckMultiplier === mult
                            ? 'bg-emerald-500 text-slate-950 font-black shadow-[0_0_12px_rgba(34,197,94,0.6)]'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {mult}x Chance
                      </button>
                    ))}
                  </div>

                  <div className="w-px h-5 bg-slate-700 hidden sm:block" />

                  {/* Pity Counter Display */}
                  <div className="flex items-center gap-1.5 text-xs font-mono text-purple-300 bg-purple-950/60 px-3 py-1 rounded-xl border border-purple-500/40">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Pitié Épique : {pityCounter}/30</span>
                  </div>

                  {/* Fast roll toggle */}
                  <button
                    onClick={() => {
                      audio.playClick();
                      setFastRoll(!fastRoll);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      fastRoll
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    ⚡ Rapide : {fastRoll ? 'OUI' : 'NON'}
                  </button>

                  {/* Auto-roll toggle */}
                  <button
                    onClick={() => {
                      audio.playClick();
                      setAutoRoll(!autoRoll);
                    }}
                    className={`px-3.5 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      autoRoll
                        ? 'bg-rose-500 text-white font-black animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.7)]'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {autoRoll ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>Auto-Tirage</span>
                  </button>
                </div>

                {/* The Big Rolling Wheel / Altar */}
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-4 border-cyan-400/50 bg-gradient-to-b from-slate-900 to-[#080d1a] shadow-[0_0_50px_rgba(6,182,212,0.3)] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                  {isRolling ? (
                    <div className="flex flex-col items-center space-y-3">
                      <div className="text-6xl animate-bounce">
                        {reelPreviewItem ? (reelPreviewItem.universe === 'Fortnite' ? '⚡' : reelPreviewItem.universe === 'Minecraft' ? '🗡️' : '🔮') : '🌀'}
                      </div>
                      <p className="text-sm font-mono text-cyan-300 font-bold animate-pulse">
                        {reelPreviewItem ? reelPreviewItem.name : 'Invocation Stellaire...'}
                      </p>
                      {reelPreviewItem && (
                        <span className="text-xs text-yellow-400 font-mono">
                          1 sur {reelPreviewItem.chanceDenominator.toLocaleString()}
                        </span>
                      )}
                    </div>
                  ) : lastRolledItem ? (
                    <motion.div
                      key={lastRolledItem.id + Math.random()}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center space-y-2"
                    >
                      <div className="text-6xl mb-1 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]">
                        {lastRolledItem.universe === 'Fortnite' ? '⚡' : lastRolledItem.universe === 'Minecraft' ? '🗡️' : '🔮'}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400">
                        {lastRolledItem.universe} • 1 sur {lastRolledItem.chanceDenominator.toLocaleString()}
                      </span>
                      <h3 className="text-lg font-black text-white font-mono leading-tight">
                        {lastRolledItem.name}
                      </h3>
                      <p className="text-[11px] text-slate-300 line-clamp-2 max-w-[220px]">
                        {lastRolledItem.description}
                      </p>
                      <span className="text-xs font-mono font-bold text-yellow-300">
                        +{lastRolledItem.vcoinWorth} VC
                      </span>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-6xl text-cyan-400 animate-pulse">✨</div>
                      <p className="text-sm font-mono text-slate-300 font-bold">
                        Appuyez pour déclencher l'onde RNG
                      </p>
                      <span className="text-xs text-cyan-400 font-mono">
                        Pitié garantie à 30 tirages
                      </span>
                    </div>
                  )}
                </div>

                {/* Big Roll Button */}
                <button
                  disabled={isRolling}
                  onClick={() => performRoll(false)}
                  className="px-10 py-4 rounded-3xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 disabled:opacity-50 text-slate-950 font-black text-base uppercase tracking-wider shadow-[0_0_35px_rgba(6,182,212,0.6)] cursor-pointer flex items-center gap-3 transition-all font-mono"
                >
                  <Dice5 className="w-6 h-6 fill-current animate-bounce" />
                  {isRolling ? 'TIRAGE EN COURS...' : 'LANCER LE TIRAGE RNG'}
                </button>

                {/* Recent Roll Strip */}
                {rollHistory.length > 0 && (
                  <div className="w-full max-w-lg">
                    <p className="text-xs text-slate-400 font-mono mb-2">Historique récent :</p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {rollHistory.map((item, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <span className="text-cyan-400 font-bold">{item.name}</span>
                          <span className="text-slate-500 text-[10px]">({item.universe})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: INVENTORY SHOWCASE */}
            {activeTab === 'inventory' && (
              <div className="space-y-4">
                {/* Universe Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {['all', 'Metaverse', 'Fortnite', 'Minecraft'].map(u => (
                    <button
                      key={u}
                      onClick={() => { audio.playClick(); setSelectedUniverse(u); }}
                      className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                        selectedUniverse === u
                          ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {u === 'all' ? 'Toutes les Reliques' : u}
                    </button>
                  ))}
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredItems.map(item => {
                    const ownedCount = inventory[item.id] || 0;
                    const isOwned = ownedCount > 0;

                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isOwned
                            ? 'bg-[#0f172a] border-cyan-500/50 shadow-lg'
                            : 'bg-slate-950/40 border-slate-800 opacity-60'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase font-mono bg-cyan-500/20 text-cyan-300">
                              {item.universe}
                            </span>
                            <span className="text-xs font-mono font-bold text-amber-400">
                              {isOwned ? `x${ownedCount}` : 'Non possédé'}
                            </span>
                          </div>

                          <h4 className="font-bold text-white text-sm mb-1">{item.name}</h4>
                          <p className="text-xs text-slate-400 mb-3 leading-relaxed">{item.description}</p>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono border-t border-slate-800 pt-2 mt-2">
                          <span className="text-slate-400">1/{item.chanceDenominator.toLocaleString()}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-400 font-bold">{item.vcoinWorth} VC</span>
                            {isOwned && ownedCount > 1 && (
                              <button
                                onClick={() => handleDismantle(item.id)}
                                title="Recycler un doublon pour des V-Coins"
                                className="p-1 rounded bg-rose-950/80 hover:bg-rose-800 text-rose-300 border border-rose-600/40 text-[10px] flex items-center gap-0.5"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>+{Math.floor(item.vcoinWorth * 0.6)} VC</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: TRADING HUB */}
            {activeTab === 'trades' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  Des négociateurs et collectionneurs du Métaverse proposent des offres d'échange équitables :
                </p>

                <div className="space-y-4">
                  {tradeRequests.map(trade => {
                    const hasRequired = trade.requestedItemIds.every(id => (inventory[id] || 0) > 0);

                    return (
                      <div
                        key={trade.id}
                        className="p-5 rounded-2xl bg-[#0f172a] border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{trade.traderName}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                              {trade.traderTitle}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 italic">"{trade.message}"</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-mono text-cyan-400 pt-1">
                            <span className="text-emerald-400 font-bold">
                              Il donne : {trade.offeredItemIds.join(', ')} (+{trade.offeredVCoins} VC)
                            </span>
                            <span className="text-slate-500">•</span>
                            <span className={hasRequired ? 'text-cyan-300' : 'text-rose-400 font-bold'}>
                              Il demande : {trade.requestedItemIds.join(', ')} {hasRequired ? '✅' : '❌ (Manquant)'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleExecuteTrade(trade)}
                          disabled={!hasRequired}
                          className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase cursor-pointer transition-all whitespace-nowrap ${
                            hasRequired
                              ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                          }`}
                        >
                          Accepter l'Échange
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
