import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  ExternalLink,
  Edit3,
  CreditCard as CardIcon,
  Plane,
  Building2,
  CheckCircle2,
  Circle,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Layers,
  Wrench,
  Gift,
  ArrowRight,
  Wifi,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { CreditCard, AirlineProgram, HotelProgram } from '../data/mockData';
import { EditBalanceModal } from './EditBalanceModal';
import { resolveCardCpp, resolveAirlineCpp, resolveHotelCpp } from '../lib/valuation';

interface UnifiedVaultTabProps {
  onOpenPresetModal: (category?: 'all' | 'cards' | 'airlines' | 'hotels') => void;
  onOpenToolsModal: (tool?: string) => void;
  onNavigateTab: (tab: any) => void;
  onOpenQuickGuide?: () => void;
}

// 1. Industry Standard Currency Abbreviation
function getCurrencyCode(currency: string, name?: string): string {
  const str = `${currency} ${name || ''}`.toLowerCase();
  if (str.includes('membership rewards') || str.includes('amex')) return 'MR';
  if (str.includes('ultimate rewards') || str.includes('sapphire') || str.includes('freedom') || str.includes('ink')) return 'UR';
  if (str.includes('capital one') || str.includes('venture')) return 'CapOne';
  if (str.includes('thankyou') || str.includes('citi') || str.includes('strata')) return 'TYP';
  if (str.includes('bilt')) return 'Bilt';
  if (str.includes('mile')) return 'Miles';
  if (str.includes('hyatt') || str.includes('marriott') || str.includes('hilton') || str.includes('point')) return 'pts';
  return 'pts';
}

// 2. Clean Perk Label (strips leading $200 so it doesn't render $200 $200)
function cleanPerkTitle(title: string): string {
  return title
    .replace(/^\$\d+\s*/, '')
    .replace(/\s*\([^)]*\)/, '')
    .trim();
}

// 3. Apple Wallet Physical Card Textures & Gradients
function getCardTheme(card: CreditCard) {
  const name = card.name.toLowerCase();
  const issuer = card.issuer.toLowerCase();

  if (name.includes('gold')) {
    return {
      bg: 'bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-600',
      text: 'text-amber-950',
      accent: 'text-amber-900',
      border: 'border-amber-200/60',
      chip: 'bg-amber-300/80 border-amber-600/40 text-amber-950',
      watermark: 'AMEX_CENTURION',
      subText: 'text-amber-900/80',
      tagBg: 'bg-amber-950/15 text-amber-950 border-amber-950/20',
      btnBg: 'bg-amber-950/15 hover:bg-amber-950/25 text-amber-950 border-amber-950/20',
      glow: 'shadow-amber-500/20',
      digits: '*1004',
    };
  }

  if (name.includes('platinum')) {
    return {
      bg: 'bg-gradient-to-br from-slate-200 via-zinc-300 to-slate-400',
      text: 'text-slate-900',
      accent: 'text-slate-950',
      border: 'border-white/80',
      chip: 'bg-slate-300/90 border-slate-500/40 text-slate-900',
      watermark: 'AMEX_CENTURION',
      subText: 'text-slate-700',
      tagBg: 'bg-slate-900/15 text-slate-900 border-slate-900/20',
      btnBg: 'bg-slate-900/15 hover:bg-slate-900/25 text-slate-900 border-slate-900/20',
      glow: 'shadow-slate-400/20',
      digits: '*3008',
    };
  }

  if (name.includes('sapphire') || name.includes('reserve') || name.includes('preferred')) {
    return {
      bg: 'bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950',
      text: 'text-white',
      accent: 'text-sky-300',
      border: 'border-blue-400/40',
      chip: 'bg-blue-900/80 border-blue-400/40 text-sky-200',
      watermark: 'SAPPHIRE',
      subText: 'text-slate-300',
      tagBg: 'bg-blue-500/20 text-sky-300 border-blue-400/30',
      btnBg: 'bg-blue-500/20 hover:bg-blue-500/30 text-sky-200 border-blue-400/40',
      glow: 'shadow-blue-600/30',
      digits: '*4289',
    };
  }

  if (name.includes('venture')) {
    return {
      bg: 'bg-gradient-to-br from-zinc-900 via-neutral-900 to-slate-900',
      text: 'text-white',
      accent: 'text-teal-300',
      border: 'border-slate-700/80',
      chip: 'bg-slate-800 border-slate-600 text-slate-200',
      watermark: 'VENTURE',
      subText: 'text-slate-400',
      tagBg: 'bg-slate-800/80 text-teal-300 border-slate-600',
      btnBg: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600',
      glow: 'shadow-teal-500/10',
      digits: '*8821',
    };
  }

  if (name.includes('bilt')) {
    return {
      bg: 'bg-gradient-to-br from-neutral-950 via-zinc-900 to-black',
      text: 'text-white',
      accent: 'text-neutral-300',
      border: 'border-neutral-700',
      chip: 'bg-neutral-800 border-neutral-600 text-neutral-200',
      watermark: 'BILT',
      subText: 'text-neutral-400',
      tagBg: 'bg-neutral-800 text-neutral-300 border-neutral-700',
      btnBg: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-600',
      glow: 'shadow-neutral-500/10',
      digits: '*5019',
    };
  }

  if (issuer.includes('chase')) {
    return {
      bg: 'bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950',
      text: 'text-white',
      accent: 'text-blue-300',
      border: 'border-blue-500/40',
      chip: 'bg-blue-900/60 border-blue-500/40 text-blue-200',
      watermark: 'CHASE',
      subText: 'text-slate-300',
      tagBg: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      btnBg: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border-blue-400/40',
      glow: 'shadow-blue-500/20',
      digits: '*6112',
    };
  }

  // Default Luxury Card
  return {
    bg: 'bg-gradient-to-br from-slate-900 via-slate-850 to-zinc-900',
    text: 'text-white',
    accent: 'text-indigo-300',
    border: 'border-slate-700',
    chip: 'bg-slate-800 border-slate-600 text-slate-200',
    watermark: 'NONE',
    subText: 'text-slate-400',
    tagBg: 'bg-slate-800 text-indigo-300 border-slate-700',
    btnBg: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600',
    glow: 'shadow-indigo-500/10',
    digits: '*7743',
  };
}

// 4. Airline Card Theme
function getAirlineCardTheme(air: AirlineProgram) {
  const name = air.name.toLowerCase();
  if (name.includes('delta')) {
    return {
      bg: 'bg-gradient-to-br from-slate-950 via-blue-950 to-sky-950',
      text: 'text-white',
      border: 'border-sky-500/40',
      accent: 'text-sky-300',
      subText: 'text-slate-300',
      tagBg: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
      btnBg: 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border-sky-400/40',
      glow: 'shadow-sky-500/20',
    };
  }
  if (name.includes('united')) {
    return {
      bg: 'bg-gradient-to-br from-blue-950 via-slate-950 to-cyan-950',
      text: 'text-white',
      border: 'border-cyan-500/40',
      accent: 'text-cyan-300',
      subText: 'text-slate-300',
      tagBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
      btnBg: 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border-cyan-400/40',
      glow: 'shadow-cyan-500/20',
    };
  }
  return {
    bg: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950',
    text: 'text-white',
    border: 'border-indigo-500/40',
    accent: 'text-indigo-300',
    subText: 'text-slate-300',
    tagBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
    btnBg: 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border-indigo-400/40',
    glow: 'shadow-indigo-500/20',
  };
}

// 5. Hotel Card Theme
function getHotelCardTheme(hotel: HotelProgram) {
  const name = hotel.name.toLowerCase();
  if (name.includes('hyatt')) {
    return {
      bg: 'bg-gradient-to-br from-teal-950 via-slate-900 to-emerald-950',
      text: 'text-white',
      border: 'border-teal-400/40',
      accent: 'text-teal-300',
      subText: 'text-teal-200/80',
      tagBg: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
      btnBg: 'bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border-teal-400/40',
      glow: 'shadow-teal-500/20',
    };
  }
  if (name.includes('marriott')) {
    return {
      bg: 'bg-gradient-to-br from-rose-950 via-slate-900 to-stone-950',
      text: 'text-white',
      border: 'border-rose-400/40',
      accent: 'text-rose-300',
      subText: 'text-rose-200/80',
      tagBg: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
      btnBg: 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border-rose-400/40',
      glow: 'shadow-rose-500/20',
    };
  }
  return {
    bg: 'bg-gradient-to-br from-slate-900 via-amber-950 to-slate-950',
    text: 'text-white',
    border: 'border-amber-400/40',
    accent: 'text-amber-300',
    subText: 'text-amber-200/80',
    tagBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    btnBg: 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-400/40',
    glow: 'shadow-amber-500/20',
  };
}

export const UnifiedVaultTab: React.FC<UnifiedVaultTabProps> = ({
  onOpenPresetModal,
  onOpenToolsModal,
  onNavigateTab,
  onOpenQuickGuide,
}) => {
  const language = useAppStore((s) => s.language);
  const cards = useAppStore((s) => s.cards);
  const airlines = useAppStore((s) => s.airlines);
  const hotels = useAppStore((s) => s.hotels);
  const profile = useAppStore((s) => s.profile);
  const togglePerk = useAppStore((s) => s.togglePerk);
  const updateCardBalance = useAppStore((s) => s.updateCardBalance);
  const setCardPlayer = useAppStore((s) => s.setCardPlayer);
  const setAirlineMiles = useAppStore((s) => s.setAirlineMiles);
  const setHotelPoints = useAppStore((s) => s.setHotelPoints);

  const [activeFilter, setActiveFilter] = useState<'all' | 'cards' | 'airlines' | 'hotels'>('all');
  const [displayMode, setDisplayMode] = useState<'stack' | 'list'>('stack');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [showGuideBanner, setShowGuideBanner] = useState<boolean>(() => {
    return localStorage.getItem('pointsvault_hide_quick_guide') !== 'true';
  });

  const handleDismissGuide = () => {
    localStorage.setItem('pointsvault_hide_quick_guide', 'true');
    setShowGuideBanner(false);
  };

  const [editingItem, setEditingItem] = useState<{
    id: string;
    type: 'card' | 'airline' | 'hotel';
    name: string;
    currentBalance: number;
    currencyName: string;
    cppValue: number;
    player?: 'P1' | 'P2';
  } | null>(null);

  // Filter cards by active household player
  const filteredCards = cards.filter((c) =>
    profile.activePlayer === 'All' ? true : c.player === profile.activePlayer
  );

  // Calculate totals
  const totalCardsBalance = filteredCards.reduce((acc, c) => acc + (c.currentBalance || 0), 0);
  const totalAirlinesMiles = airlines.reduce((acc, a) => acc + (a.milesBalance || 0), 0);
  const totalHotelsPoints = hotels.reduce((acc, h) => acc + (h.pointsBalance || 0), 0);
  const totalCombinedPoints = totalCardsBalance + totalAirlinesMiles + totalHotelsPoints;

  const cardsValueUsd = filteredCards.reduce((acc, c) => acc + (c.currentBalance * resolveCardCpp(c)) / 100, 0);
  const airlinesValueUsd = airlines.reduce((acc, a) => acc + (a.milesBalance * resolveAirlineCpp(a)) / 100, 0);
  const hotelsValueUsd = hotels.reduce((acc, h) => acc + (h.pointsBalance * resolveHotelCpp(h)) / 100, 0);
  const totalValueUsd = cardsValueUsd + airlinesValueUsd + hotelsValueUsd;

  // Unclaimed monthly perks for the due checklist
  const monthlyPerksDue = filteredCards
    .flatMap((c) =>
      c.perks
        .filter((p) => p.frequency === 'Monthly' || p.frequency === 'Quarterly')
        .map((p) => ({ card: c, perk: p }))
    )
    .slice(0, 4);

  // App deep links mapping
  const getDeepLink = (name: string, issuer?: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('delta')) return { label: 'Delta App', url: 'https://www.delta.com' };
    if (lower.includes('united')) return { label: 'United App', url: 'https://www.united.com' };
    if (lower.includes('southwest')) return { label: 'Southwest App', url: 'https://www.southwest.com' };
    if (lower.includes('hyatt')) return { label: 'Hyatt App', url: 'https://www.hyatt.com' };
    if (lower.includes('marriott')) return { label: 'Bonvoy App', url: 'https://www.marriott.com' };
    if (lower.includes('hilton')) return { label: 'Hilton App', url: 'https://www.hilton.com' };
    if (issuer === 'Amex') return { label: 'Amex App', url: 'https://www.americanexpress.com' };
    if (issuer === 'Chase') return { label: 'Chase App', url: 'https://www.chase.com' };
    if (issuer === 'Capital One') return { label: 'CapOne App', url: 'https://www.capitalone.com' };
    return null;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* 1. Header Hero Card: Portfolio Value */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900/90 to-slate-950 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{language === 'en' ? 'Unified Portfolio Net Worth' : '全景資產總值'}</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px]">
                {profile.activePlayer === 'All' ? 'Household' : profile.activePlayer}
              </span>
            </div>
            <div className="flex items-baseline space-x-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                ${totalValueUsd.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </h2>
              <span className="text-base sm:text-lg font-bold text-amber-400">
                • {(totalCombinedPoints / 1000).toFixed(0)}k {language === 'en' ? 'pts / miles' : '點 / 哩'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'en'
                ? `${filteredCards.length} Cards • ${airlines.length} Airlines • ${hotels.length} Hotel Programs active`
                : `收納 ${filteredCards.length} 張美卡 • ${airlines.length} 家航司 • ${hotels.length} 家酒店會籍`}
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={() => onOpenToolsModal()}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-indigo-400 text-slate-200 hover:text-white transition-all text-xs font-bold shadow-md cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5 text-indigo-400" />
              <span>{language === 'en' ? 'Tools ⚙️' : '進階工具箱 ⚙️'}</span>
            </button>
            <button
              onClick={() => onOpenPresetModal('all')}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 hover:brightness-110 text-white transition-all text-xs font-bold shadow-lg shadow-indigo-500/20 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'en' ? 'Add Item' : '一鍵收納'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 30-Second Quick Start Guide Banner (Dismissible) */}
      {showGuideBanner && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-purple-950/60 border border-indigo-500/30 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-xs font-black text-amber-400 tracking-wide uppercase">
                {language === 'en' ? '💡 30-Second Quick Start Guide' : '💡 30 秒新手速成指南'}
              </span>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              {onOpenQuickGuide && (
                <button
                  onClick={onOpenQuickGuide}
                  className="text-xs text-indigo-300 hover:text-white font-semibold underline underline-offset-4 cursor-pointer"
                >
                  {language === 'en' ? 'Detailed Tour →' : '圖解詳解 →'}
                </button>
              )}
              <button
                onClick={handleDismissGuide}
                title={language === 'en' ? 'Dismiss guide' : '不再顯示導覽'}
                className="px-2 py-0.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
              >
                <span>✕ {language === 'en' ? 'Dismiss' : '關閉'}</span>
              </button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px] font-black">1</span>
                <span>{language === 'en' ? 'One-Tap Intake' : '一秒免打字收納'}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {language === 'en' ? 'Click preset tags below (Amex, Delta, CSP) to add instantly.' : '點擊下方預設標籤（Delta、Amex、Hyatt），0 打字一秒加入。'}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-black">2</span>
                <span>{language === 'en' ? 'Update & App Jump' : '點 ✏️ 改數字 / 跳官方 App'}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {language === 'en' ? 'Tap ✏️ to update balances; tap ↗ to open official bank apps.' : '點卡片 ✏️ 更新點數；點 ↗ 直跳 Amex / Chase / Delta 查帳。'}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
              <div className="font-bold text-slate-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px] font-black">3</span>
                <span>{language === 'en' ? 'Assign P1/P2 & Perks' : '指派成員與福利打卡'}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                {language === 'en' ? 'Tap [P1/P2] badge to reassign card. Check off perks below.' : '點卡面 [P1/P2] 徽章一秒換人；底部隨時勾選福利銷帳。'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. One-Tap Quick Intake Strip (0 Typing) */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>{language === 'en' ? 'One-Tap Quick Catalog (0 Typing):' : '一秒加入熱門卡片/航司（免打字）：'}</span>
          </span>
          <button
            onClick={() => onOpenPresetModal('all')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            {language === 'en' ? 'Browse all' : '查看全部'} <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { label: 'Delta', bg: 'from-blue-900 to-red-900', type: 'airlines', icon: '✈️' },
            { label: 'Amex Gold', bg: 'from-amber-600 to-yellow-600', type: 'cards', icon: '💳' },
            { label: 'Chase CSP', bg: 'from-blue-700 to-indigo-900', type: 'cards', icon: '💎' },
            { label: 'Hyatt', bg: 'from-teal-800 to-emerald-950', type: 'hotels', icon: '🏨' },
            { label: 'United', bg: 'from-blue-800 to-sky-950', type: 'airlines', icon: '✈️' },
            { label: 'Venture X', bg: 'from-slate-800 to-blue-950', type: 'cards', icon: '💳' },
            { label: 'Marriott', bg: 'from-rose-900 to-neutral-900', type: 'hotels', icon: '🏨' },
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => onOpenPresetModal(preset.type as any)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all text-xs font-bold shrink-0 cursor-pointer shadow-sm active:scale-95"
            >
              <span className={`w-4 h-4 rounded-md bg-gradient-to-br ${preset.bg} flex items-center justify-center text-[9px] shrink-0`}>
                {preset.icon}
              </span>
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Filter Navigation & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 bg-slate-950/90 border border-slate-800 p-1 rounded-2xl overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'en' ? `All (${filteredCards.length + airlines.length + hotels.length})` : `全部 (${filteredCards.length + airlines.length + hotels.length})`}
          </button>
          <button
            onClick={() => setActiveFilter('cards')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'cards'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CardIcon className="w-3.5 h-3.5" />
            <span>{language === 'en' ? `Cards (${filteredCards.length})` : `美卡 (${filteredCards.length})`}</span>
          </button>
          <button
            onClick={() => setActiveFilter('airlines')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'airlines'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>{language === 'en' ? `Airlines (${airlines.length})` : `航司 (${airlines.length})`}</span>
          </button>
          <button
            onClick={() => setActiveFilter('hotels')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === 'hotels'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{language === 'en' ? `Hotels (${hotels.length})` : `酒店 (${hotels.length})`}</span>
          </button>
        </div>

        {/* View Mode & Merchant Assistant */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          {/* Apple Wallet Stack vs List Toggle */}
          <div className="flex items-center bg-slate-950/90 border border-slate-800 p-0.5 rounded-xl">
            <button
              onClick={() => setDisplayMode('stack')}
              title={language === 'en' ? 'Apple Wallet Stack' : 'Apple Wallet 錢包堆疊'}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                displayMode === 'stack'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{language === 'en' ? 'Wallet' : '卡牌堆疊'}</span>
            </button>
            <button
              onClick={() => setDisplayMode('list')}
              title={language === 'en' ? 'Expanded List View' : '平鋪清單視圖'}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                displayMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CardIcon className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{language === 'en' ? 'List' : '平鋪清單'}</span>
            </button>
          </div>

          <button
            onClick={() => onNavigateTab('merchant')}
            className="flex items-center space-x-1 text-xs text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
          >
            <span>{language === 'en' ? '⚡ Which card?' : '⚡ 刷哪張最賺？'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Apple Wallet Stack (Cards + Airlines + Hotels) */}
      <div className={`relative ${displayMode === 'stack' ? 'pt-2 pb-16' : 'space-y-4'}`}>
        {/* Credit Cards */}
        {(activeFilter === 'all' || activeFilter === 'cards') &&
          filteredCards.map((card, idx) => {
            const theme = getCardTheme(card);
            const deep = getDeepLink(card.name, card.issuer);
            const estDollar = (card.currentBalance * resolveCardCpp(card)) / 100;
            const currencyCode = getCurrencyCode(card.pointsCurrency, card.name);
            const isExpanded = displayMode === 'list' || expandedCardId === card.id;

            return (
              <div
                key={card.id}
                style={{
                  zIndex: isExpanded ? 40 : idx + 1,
                }}
                onClick={() => {
                  if (displayMode === 'stack') {
                    setExpandedCardId(expandedCardId === card.id ? null : card.id);
                  }
                }}
                className={`w-full rounded-3xl ${theme.bg} ${theme.border} border ${theme.text} shadow-2xl relative overflow-hidden transition-all duration-300 cursor-pointer ${
                  displayMode === 'stack'
                    ? idx > 0 && !isExpanded
                      ? '-mt-24 sm:-mt-28 hover:-translate-y-6 hover:shadow-indigo-500/20'
                      : 'hover:scale-[1.01]'
                    : 'hover:scale-[1.01]'
                } ${isExpanded && displayMode === 'stack' ? 'ring-2 ring-indigo-400 scale-[1.01] my-4' : ''}`}
              >
                {/* Visual Watermarks & Textures */}
                {theme.watermark === 'AMEX_CENTURION' && (
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 w-44 h-44 rounded-full border-4 border-current opacity-10 pointer-events-none flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-2 border-current flex items-center justify-center">
                      <span className="text-4xl font-serif font-black tracking-widest opacity-40">AMEX</span>
                    </div>
                  </div>
                )}
                {theme.watermark === 'SAPPHIRE' && (
                  <div className="absolute -right-8 -top-8 w-60 h-60 bg-gradient-to-br from-blue-400/20 via-indigo-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
                )}

                <div className="p-6 sm:p-7 relative z-10 flex flex-col justify-between min-h-[175px] sm:min-h-[195px]">
                  {/* Top Bar: Issuer Header & Member/Player info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      {/* Realistic EMV Chip */}
                      <div className={`w-8 h-6 rounded-md ${theme.chip} border flex items-center justify-center shadow-inner`}>
                        <div className="w-5 h-3.5 border-t border-b border-current opacity-60" />
                      </div>
                      <Wifi className="w-4 h-4 opacity-70 rotate-90" />
                      <span className="text-[11px] sm:text-xs font-black tracking-[0.2em] uppercase opacity-90">
                        {card.issuer.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {card.player && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (profile.hasP2) {
                              setCardPlayer(card.id, card.player === 'P1' ? 'P2' : 'P1');
                            }
                          }}
                          title={
                            profile.hasP2
                              ? language === 'en'
                                ? `Assigned to ${card.player === 'P1' ? profile.p1Name || 'P1' : profile.p2Name || 'P2'}. Click to toggle P1/P2`
                                : `目前持卡人：${card.player === 'P1' ? profile.p1Name || 'P1' : profile.p2Name || 'P2'}。點擊一鍵切換 P1/P2`
                              : undefined
                          }
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${theme.tagBg} ${
                            profile.hasP2 ? 'hover:scale-105 cursor-pointer ring-1 ring-white/20 active:scale-95' : ''
                          } transition-all`}
                        >
                          {card.player === 'P1' ? profile.p1Name || 'P1' : profile.p2Name || 'P2'}
                        </button>
                      )}
                      <span className="text-xs font-mono font-bold tracking-wider opacity-80">
                        {theme.digits}
                      </span>
                      {displayMode === 'stack' && (
                        <span className="opacity-60 text-xs ml-1">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Center Card Title */}
                  <div className="py-2">
                    <h3 className="text-lg sm:text-xl font-black tracking-tight drop-shadow-sm">
                      {card.name}
                    </h3>
                    <p className={`text-xs ${theme.subText} font-medium`}>
                      ${card.annualFee} AF • {card.pointsCurrency}
                    </p>
                  </div>

                  {/* Bottom Row: Balance & Action Shortcuts */}
                  <div className="flex items-end justify-between pt-1">
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md">
                          {card.currentBalance.toLocaleString()}
                        </span>
                        <span className="text-sm sm:text-base font-extrabold tracking-wide uppercase opacity-95">
                          {currencyCode}
                        </span>
                      </div>
                      <span className={`text-xs font-bold ${theme.accent}`}>
                        ≈ ${estDollar.toFixed(0)} USD
                      </span>
                    </div>

                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() =>
                          setEditingItem({
                            id: card.id,
                            type: 'card',
                            name: card.name,
                            currentBalance: card.currentBalance,
                            currencyName: card.pointsCurrency,
                            cppValue: resolveCardCpp(card),
                            player: card.player,
                          })
                        }
                        title="Update Balance & Cardholder"
                        className={`p-2 rounded-xl ${theme.btnBg} transition-all cursor-pointer shadow-sm`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {deep && (
                        <a
                          href={deep.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl ${theme.btnBg} text-xs font-bold transition-all cursor-pointer shadow-sm`}
                        >
                          <span>{deep.label}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details: Perks Checklist (Fixed bug: no duplicated $200 $200) */}
                {isExpanded && card.perks && card.perks.length > 0 && (
                  <div
                    className="p-5 sm:p-6 bg-slate-950/70 backdrop-blur-md border-t border-white/10 space-y-3 cursor-default"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-amber-400" />
                        <span>{language === 'en' ? 'Active Perks Checklist' : '卡片專屬福利打卡'}</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        {language === 'en' ? 'Tap to mark claimed' : '點擊標記已使用'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {card.perks.map((perk) => {
                        const cleanTitle = cleanPerkTitle(perk.title);
                        return (
                          <button
                            key={perk.id}
                            onClick={() => togglePerk(card.id, perk.id)}
                            className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                              perk.used
                                ? 'bg-slate-900/60 border-slate-800 text-slate-500 line-through'
                                : 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:border-indigo-400 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center space-x-2 truncate pr-2">
                              {perk.used ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              )}
                              <span className="truncate">{cleanTitle}</span>
                            </div>
                            <span className="text-amber-400 font-black shrink-0">${perk.value}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        {/* Airlines Stack */}
        {(activeFilter === 'all' || activeFilter === 'airlines') &&
          airlines.map((air, idx) => {
            const theme = getAirlineCardTheme(air);
            const deep = getDeepLink(air.name);
            const estDollar = (air.milesBalance * resolveAirlineCpp(air)) / 100;
            const isExpanded = displayMode === 'list' || expandedCardId === air.id;

            return (
              <div
                key={air.id}
                style={{
                  zIndex: isExpanded ? 40 : idx + 10,
                }}
                onClick={() => {
                  if (displayMode === 'stack') {
                    setExpandedCardId(expandedCardId === air.id ? null : air.id);
                  }
                }}
                className={`w-full rounded-3xl ${theme.bg} ${theme.border} border ${theme.text} shadow-2xl relative overflow-hidden transition-all duration-300 cursor-pointer ${
                  displayMode === 'stack'
                    ? idx > 0 && !isExpanded
                      ? '-mt-24 sm:-mt-28 hover:-translate-y-6 hover:shadow-sky-500/20'
                      : 'hover:scale-[1.01]'
                    : 'hover:scale-[1.01]'
                } ${isExpanded && displayMode === 'stack' ? 'ring-2 ring-sky-400 scale-[1.01] my-4' : ''}`}
              >
                <div className="p-6 sm:p-7 relative z-10 flex flex-col justify-between min-h-[175px] sm:min-h-[195px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-xs font-black text-sky-300">
                        ✈️
                      </div>
                      <span className="text-xs font-black tracking-widest uppercase">
                        {air.alliance}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.tagBg}`}>
                        {air.statusTier}
                      </span>
                      {air.memberNumber && (
                        <span className="text-xs font-mono font-bold tracking-wider opacity-80">
                          #{air.memberNumber}
                        </span>
                      )}
                      {displayMode === 'stack' && (
                        <span className="opacity-60 text-xs ml-1">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-2">
                    <h3 className="text-lg sm:text-xl font-black tracking-tight">
                      {air.name}
                    </h3>
                    <p className={`text-xs ${theme.subText} font-medium`}>
                      {air.expirationPolicy || 'Miles never expire with active account'}
                    </p>
                  </div>

                  <div className="flex items-end justify-between pt-1">
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md">
                          {air.milesBalance.toLocaleString()}
                        </span>
                        <span className="text-sm sm:text-base font-extrabold tracking-wide uppercase opacity-95">
                          {language === 'en' ? 'Miles' : '哩程'}
                        </span>
                      </div>
                      <span className={`text-xs font-bold ${theme.accent}`}>
                        ≈ ${estDollar.toFixed(0)} USD
                      </span>
                    </div>

                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() =>
                          setEditingItem({
                            id: air.id,
                            type: 'airline',
                            name: air.name,
                            currentBalance: air.milesBalance,
                            currencyName: 'Miles',
                            cppValue: resolveAirlineCpp(air),
                          })
                        }
                        title="Update Miles"
                        className={`p-2 rounded-xl ${theme.btnBg} transition-all cursor-pointer shadow-sm`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {deep && (
                        <a
                          href={deep.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl ${theme.btnBg} text-xs font-bold transition-all cursor-pointer shadow-sm`}
                        >
                          <span>{deep.label}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        {/* Hotels Stack */}
        {(activeFilter === 'all' || activeFilter === 'hotels') &&
          hotels.map((hotel, idx) => {
            const theme = getHotelCardTheme(hotel);
            const deep = getDeepLink(hotel.name);
            const estDollar = (hotel.pointsBalance * resolveHotelCpp(hotel)) / 100;
            const isExpanded = displayMode === 'list' || expandedCardId === hotel.id;

            return (
              <div
                key={hotel.id}
                style={{
                  zIndex: isExpanded ? 40 : idx + 20,
                }}
                onClick={() => {
                  if (displayMode === 'stack') {
                    setExpandedCardId(expandedCardId === hotel.id ? null : hotel.id);
                  }
                }}
                className={`w-full rounded-3xl ${theme.bg} ${theme.border} border ${theme.text} shadow-2xl relative overflow-hidden transition-all duration-300 cursor-pointer ${
                  displayMode === 'stack'
                    ? idx > 0 && !isExpanded
                      ? '-mt-24 sm:-mt-28 hover:-translate-y-6 hover:shadow-teal-500/20'
                      : 'hover:scale-[1.01]'
                    : 'hover:scale-[1.01]'
                } ${isExpanded && displayMode === 'stack' ? 'ring-2 ring-teal-400 scale-[1.01] my-4' : ''}`}
              >
                <div className="p-6 sm:p-7 relative z-10 flex flex-col justify-between min-h-[175px] sm:min-h-[195px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-xs font-black text-teal-300">
                        🏨
                      </div>
                      <span className="text-xs font-black tracking-widest uppercase">
                        HOTEL REWARDS
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.tagBg}`}>
                        {hotel.statusTier}
                      </span>
                      {displayMode === 'stack' && (
                        <span className="opacity-60 text-xs ml-1">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-2">
                    <h3 className="text-lg sm:text-xl font-black tracking-tight">
                      {hotel.name}
                    </h3>
                    <p className={`text-xs ${theme.subText} font-medium`}>
                      {hotel.nightsThisYear} {language === 'en' ? 'nights this year' : '晚房晚'} • {hotel.fncs?.length || 0} FNC 房券
                    </p>
                  </div>

                  <div className="flex items-end justify-between pt-1">
                    <div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md">
                          {hotel.pointsBalance.toLocaleString()}
                        </span>
                        <span className="text-sm sm:text-base font-extrabold tracking-wide uppercase opacity-95">
                          {language === 'en' ? 'Points' : '點數'}
                        </span>
                      </div>
                      <span className={`text-xs font-bold ${theme.accent}`}>
                        ≈ ${estDollar.toFixed(0)} USD
                      </span>
                    </div>

                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() =>
                          setEditingItem({
                            id: hotel.id,
                            type: 'hotel',
                            name: hotel.name,
                            currentBalance: hotel.pointsBalance,
                            currencyName: 'Points',
                            cppValue: resolveHotelCpp(hotel),
                          })
                        }
                        title="Update Points"
                        className={`p-2 rounded-xl ${theme.btnBg} transition-all cursor-pointer shadow-sm`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {deep && (
                        <a
                          href={deep.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl ${theme.btnBg} text-xs font-bold transition-all cursor-pointer shadow-sm`}
                        >
                          <span>{deep.label}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* 5. Frosted Glass "Monthly Perks Due" Bottom Sheet (Exactly matching Image 2 mockup) */}
      {monthlyPerksDue.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 shadow-2xl space-y-3.5">
          {/* Subtle pull handle line for wallet sheet feel */}
          <div className="w-10 h-1 bg-slate-700/80 rounded-full mx-auto -mt-1 mb-2" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gift className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-white tracking-wide">
                {language === 'en' ? 'Monthly Perks Due (Tap to Claim)' : '本月即期福利打卡（點擊銷帳）：'}
              </h4>
            </div>
            <button
              onClick={() => onNavigateTab('cards')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer flex items-center gap-1"
            >
              <span>{language === 'en' ? 'View all' : '查看完整清單'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {monthlyPerksDue.map(({ card, perk }) => {
              const cleanTitle = cleanPerkTitle(perk.title);
              return (
                <button
                  key={perk.id}
                  onClick={() => togglePerk(card.id, perk.id)}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer text-left ${
                    perk.used
                      ? 'bg-slate-950/60 border-slate-800/80 text-slate-500'
                      : 'bg-indigo-950/20 border-indigo-500/30 text-slate-200 hover:bg-indigo-950/40'
                  }`}
                >
                  <div className="space-y-0.5 pr-2">
                    <p className={`text-xs font-bold ${perk.used ? 'line-through text-slate-500' : 'text-white'}`}>
                      {cleanTitle} ({card.issuer})
                    </p>
                    <p className="text-[10px] text-slate-400">{card.name}</p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-xs font-black text-amber-400">${perk.value}</span>
                    {perk.used ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Balance Modal */}
      {editingItem && (
        <EditBalanceModal
          isOpen={Boolean(editingItem)}
          onClose={() => setEditingItem(null)}
          title={editingItem.name}
          currentBalance={editingItem.currentBalance}
          currencyName={editingItem.currencyName}
          cppValue={editingItem.cppValue}
          currentPlayer={editingItem.player}
          onSavePlayer={(newPlayer) => {
            if (editingItem.type === 'card') {
              setCardPlayer(editingItem.id, newPlayer);
            }
          }}
          onSave={(newBal) => {
            if (editingItem.type === 'card') {
              updateCardBalance(editingItem.id, newBal);
            } else if (editingItem.type === 'airline') {
              setAirlineMiles(editingItem.id, newBal);
            } else if (editingItem.type === 'hotel') {
              setHotelPoints(editingItem.id, newBal);
            }
          }}
        />
      )}
    </div>
  );
};
