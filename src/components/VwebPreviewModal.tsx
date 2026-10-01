import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, X, Sparkles, ArrowLeft, ArrowRight, RotateCw,
  Search, ShieldCheck, Code, Layers, Share2, Compass,
  Bell, BellRing, Check, ExternalLink, Cpu, Database
} from 'lucide-react';
import { audio } from '../utils/audio';
import { Language } from '../utils/i18n';

interface VwebPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  language?: Language;
}

export function VwebPreviewModal({
  isOpen,
  onClose,
  onShowToast,
  language = 'fr'
}: VwebPreviewModalProps) {
  const [currentUrl, setCurrentUrl] = useState('vertex://creators-hub');
  const [activeTab, setActiveTab] = useState<'creators' | 'apps' | 'dev'>('creators');
  const [notified, setNotified] = useState(false);

  if (!isOpen) return null;

  const handleNotify = () => {
    audio.playWin();
    const next = !notified;
    setNotified(next);
    if (next) {
      onShowToast(
        language === 'en'
          ? "🌐 You've joined the Vweb Developer & Beta Explorer program!"
          : language === 'es'
          ? "🌐 ¡Te has unido al programa de Desarrollador y Beta Explorer de Vweb!"
          : "🌐 Vous êtes inscrit au programme Développeur & Bêta Testeur de Vweb !"
      );
    }
  };

  const sampleSites = [
    { url: 'vertex://creators-hub', title: 'Vertex Creator Matrix', desc: 'Portail des créateurs de mini-mondes et d\'interfaces 3D.' },
    { url: 'vertex://arcade-market', title: 'V-Coins Bazaar', desc: 'Place de marché communautaire pour skins et mods de jeux.' },
    { url: 'vertex://dev-docs', title: 'Vertex Web SDK API', desc: 'Documentation officielle pour déployer vos apps sur Vweb.' }
  ];

  const features = [
    {
      icon: <Globe className="w-5 h-5 text-cyan-400" />,
      title: language === 'en' ? 'Metaverse Web Engine' : language === 'es' ? 'Navegador del Metaverso' : 'Navigateur Métaverse Décentralisé',
      desc:
        language === 'en'
          ? 'Browse community-hosted web spaces, interactive wikis and mini-apps inside Vertex.'
          : language === 'es'
          ? 'Navega por espacios web comunitarios, wikis y mini-aplicaciones dentro de Vertex.'
          : 'Naviguez directement dans les pages créées par les joueurs et studios sans jamais quitter l\'écosystème Vertex.'
    },
    {
      icon: <Code className="w-5 h-5 text-emerald-400" />,
      title: language === 'en' ? 'Creator Studios & Mini-Apps' : language === 'es' ? 'Estudios de Creadores' : 'Espaces Créateurs & Mini-Jeux',
      desc:
        language === 'en'
          ? 'Publish your own custom HTML5 games, tools and personal portfolio rooms.'
          : language === 'es'
          ? 'Publica tus propios juegos HTML5, herramientas y portafolios personalizados.'
          : 'Publiez et partagez vos propres mini-jeux, calculatrices de trophées et hubs de guilde personnalisés.'
    },
    {
      icon: <Database className="w-5 h-5 text-amber-400" />,
      title: language === 'en' ? 'V-Coins Integration' : language === 'es' ? 'Integración V-Coins' : 'Économie & Monétisation V-Coins',
      desc:
        language === 'en'
          ? 'Tip creators, purchase custom cosmetics and trade items directly in Vweb.'
          : language === 'es'
          ? 'Apoya creadores, compra cosméticos personalizados y comercia directamente en Vweb.'
          : 'Soutenez les meilleurs créateurs, débloquez des extensions et échangez avec vos V-Coins en toute sécurité.'
    },
    {
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
      title: language === 'en' ? 'Universal Web SDK' : language === 'es' ? 'SDK Web Universal' : 'SDK Développeur Ouvert',
      desc:
        language === 'en'
          ? 'Connect external websites to the Vertex player identity, achievements, and cloud saves.'
          : language === 'es'
          ? 'Conecta sitios externos con la identidad, logros y guardados en la nube de Vertex.'
          : 'Reliez vos sites web et applications externes aux succès et profils de joueur Vertex.'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-2xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="liquid-glass-container w-full max-w-3xl max-h-[92dvh] rounded-3xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl relative border border-cyan-400/30 text-slate-100"
        >
          {/* Top Sheen */}
          <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent pointer-events-none" />

          {/* Close button */}
          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full liquid-glass-pill text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shadow-lg transition-transform active:scale-90"
            title="Fermer (Échap)"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3.5 pb-4 border-b border-white/10 shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-black text-white font-mono tracking-tight uppercase">
                  VWEB
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black tracking-wider uppercase bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.5)] animate-pulse">
                  Coming Soon!
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {language === 'en'
                  ? 'The decentralized metaverse browser, creator spaces and web apps hub.'
                  : language === 'es'
                  ? 'El navegador metaverso descentralizado, espacios de creadores y aplicaciones web.'
                  : 'Le navigateur métaverse décentralisé, les espaces créateurs et les mini-applications de Vertex.'}
              </p>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto space-y-4 my-4 pr-1 no-scrollbar">
            {/* Interactive Browser Sandbox Mockup */}
            <div className="p-4 rounded-3xl liquid-glass-card border border-cyan-400/30 bg-gradient-to-br from-slate-900/80 to-blue-950/40 shadow-xl space-y-3">
              {/* Browser Toolbar */}
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>

                <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-white/10 text-xs font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-cyan-300 font-bold truncate">{currentUrl}</span>
                </div>

                <button
                  onClick={() => audio.playClick()}
                  className="p-1.5 rounded-lg liquid-glass-pill text-slate-400 hover:text-white"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sample Destination Links in Browser Mockup */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {sampleSites.map((site, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      audio.playClick();
                      setCurrentUrl(site.url);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      currentUrl === site.url
                        ? 'liquid-glass-pill-active border-cyan-400 text-cyan-200'
                        : 'liquid-glass-pill text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold text-white truncate">{site.title}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{site.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Features Grid */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-black uppercase tracking-wider text-slate-300 px-1">
                {language === 'en' ? 'Core Capabilities of Vweb :' : language === 'es' ? 'Capacidades de Vweb :' : 'Fonctionnalités au cœur de Vweb :'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl liquid-glass-card border border-white/10 hover:border-cyan-400/40 transition-colors flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      {f.icon}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white font-mono">{f.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-snug">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono shrink-0">
            <button
              onClick={handleNotify}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md ${
                notified
                  ? 'bg-emerald-400 text-slate-950 font-black'
                  : 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 hover:bg-cyan-500/35'
              }`}
            >
              {notified ? <Check className="w-4 h-4 stroke-[3]" /> : <Bell className="w-4 h-4" />}
              <span>{notified ? (language === 'en' ? 'Beta Access Registered' : 'Inscrit au Programme Bêta !') : (language === 'en' ? 'Request Beta Access' : 'Demander l\'Accès Bêta')}</span>
            </button>

            <button
              onClick={() => {
                audio.playClick();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-mono font-bold text-xs uppercase cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'en' ? 'Return to Portal' : language === 'es' ? 'Volver al Portal' : 'Retour au Portail'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
