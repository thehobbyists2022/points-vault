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
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';
import { EditBalanceModal } from './EditBalanceModal';
import { resolveCardCpp, resolveAirlineCpp, resolveHotelCpp } from '../lib/valuation';

interface UnifiedVaultTabProps {
  onOpenPresetModal: (category?: 'all' | 'cards' | 'airlines' | 'hotels') => void;
  onOpenToolsModal: (tool?: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const UnifiedVaultTab: React.FC<UnifiedVaultTabProps> = ({
  onOpenPresetModal,
  onOpenToolsModal,
  onNavigateTab,
}) => {
  const language = useAppStore((s) => s.language);
  const cards = useAppStore((s) => s.cards);
  const airlines = useAppStore((s) => s.airlines);
  const hotels = useAppStore((s) => s.hotels);
  const profile = useAppStore((s) => s.profile);
  const togglePerk = useAppStore((s) => s.togglePerk);
  const updateCardBalance = useAppStore((s) => s.updateCardBalance);
  const setAirlineMiles = useAppStore((s) => s.setAirlineMiles);
  const setHotelPoints = useAppStore((s) => s.setHotelPoints);

  const [activeFilter, setActiveFilter] = useState<'all' | 'cards' | 'airlines' | 'hotels'>('all');
  const [editingItem, setEditingItem] = useState<{
    id: string;
    type: 'card' | 'airline' | 'hotel';
    name: string;
    currentBalance: number;
    currencyName: string;
    cppValue: number;
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

      {/* 2. One-Tap Quick Intake Strip (As approved in mockup) */}
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
            { label: 'Delta', bg: 'from-blue-900 to-red-900', type: 'airlines' },
            { label: 'Amex Gold', bg: 'from-amber-600 to-yellow-600', type: 'cards' },
            { label: 'Chase CSP', bg: 'from-blue-700 to-indigo-900', type: 'cards' },
            { label: 'Hyatt', bg: 'from-teal-800 to-emerald-950', type: 'hotels' },
            { label: 'United', bg: 'from-blue-800 to-sky-950', type: 'airlines' },
            { label: 'Venture X', bg: 'from-slate-800 to-blue-950', type: 'cards' },
            { label: 'Marriott', bg: 'from-rose-900 to-neutral-900', type: 'hotels' },
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => onOpenPresetModal(preset.type as any)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all text-xs font-bold shrink-0 cursor-pointer shadow-sm"
            >
              <span className={`w-3.5 h-3.5 rounded-md bg-gradient-to-br ${preset.bg} shrink-0`} />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Filter Navigation Strip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-slate-950/90 border border-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'en' ? `All (${filteredCards.length + airlines.length + hotels.length})` : `全部 (${filteredCards.length + airlines.length + hotels.length})`}
          </button>
          <button
            onClick={() => setActiveFilter('cards')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'hotels'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{language === 'en' ? `Hotels (${hotels.length})` : `酒店 (${hotels.length})`}</span>
          </button>
        </div>

        <button
          onClick={() => onNavigateTab('merchant')}
          className="hidden sm:flex items-center space-x-1 text-xs text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
        >
          <span>{language === 'en' ? '⚡ Which card to swipe?' : '⚡ 刷哪張最賺？'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. Unified Wallet Stack (Cards + Airlines + Hotels) */}
      <div className="space-y-4">
        {/* Credit Cards Section */}
        {(activeFilter === 'all' || activeFilter === 'cards') &&
          filteredCards.map((card) => {
            const deep = getDeepLink(card.name, card.issuer);
            const estDollar = (card.currentBalance * resolveCardCpp(card)) / 100;
            return (
              <div
                key={card.id}
                className="group rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-5 transition-all shadow-xl space-y-4 relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`w-14 h-9 rounded-xl bg-gradient-to-br ${card.colorGradient} border border-white/10 shadow-lg flex items-center justify-center text-[10px] font-black text-white shrink-0`}
                    >
                      {card.issuer.toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {card.name}
                        </h3>
                        {card.player && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {card.player === 'P1' ? profile.p1Name || 'P1' : profile.p2Name || 'P2'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {card.issuer} • ${card.annualFee} AF • {card.pointsCurrency}
                      </p>
                    </div>
                  </div>

                  {/* Balance Display & 1-Tap Edit */}
                  <div className="flex items-center space-x-3 sm:justify-end">
                    <div className="text-right">
                      <div className="text-lg font-black text-white flex items-center gap-1.5 justify-end">
                        <span>{card.currentBalance.toLocaleString()}</span>
                        <span className="text-xs text-indigo-400 font-semibold">{card.pointsCurrency.slice(0, 8)}</span>
                      </div>
                      <div className="text-[11px] font-bold text-emerald-400">
                        ≈ ${estDollar.toFixed(0)} USD
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setEditingItem({
                          id: card.id,
                          type: 'card',
                          name: card.name,
                          currentBalance: card.currentBalance,
                          currencyName: card.pointsCurrency,
                          cppValue: resolveCardCpp(card),
                        })
                      }
                      title="Update Balance"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {deep && (
                      <a
                        href={deep.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition-all cursor-pointer"
                      >
                        <span>{deep.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Card Perks Quick Strip */}
                {card.perks && card.perks.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                      {language === 'en' ? 'Perks:' : '福利:'}
                    </span>
                    {card.perks.slice(0, 3).map((perk) => (
                      <button
                        key={perk.id}
                        onClick={() => togglePerk(card.id, perk.id)}
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          perk.used
                            ? 'bg-slate-800/80 text-slate-500 line-through'
                            : 'bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/40'
                        }`}
                      >
                        {perk.used ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Circle className="w-3 h-3" />}
                        <span>{perk.title.split(' ')[0]} ${perk.value}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

        {/* Airlines Section */}
        {(activeFilter === 'all' || activeFilter === 'airlines') &&
          airlines.map((air) => {
            const deep = getDeepLink(air.name);
            const estDollar = (air.milesBalance * resolveAirlineCpp(air)) / 100;
            return (
              <div
                key={air.id}
                className="group rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-5 transition-all shadow-xl space-y-3 relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-14 h-9 rounded-xl bg-gradient-to-br from-blue-900 via-sky-950 to-slate-900 border border-sky-500/20 shadow-lg flex items-center justify-center text-xs font-black text-white shrink-0">
                      {air.code}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {air.name}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30">
                          {air.statusTier}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {air.alliance} • {air.memberNumber ? `#${air.memberNumber}` : (language === 'en' ? 'No member #' : '未填會員號')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 sm:justify-end">
                    <div className="text-right">
                      <div className="text-lg font-black text-white flex items-center gap-1.5 justify-end">
                        <span>{air.milesBalance.toLocaleString()}</span>
                        <span className="text-xs text-sky-400 font-semibold">{language === 'en' ? 'Miles' : '哩程'}</span>
                      </div>
                      <div className="text-[11px] font-bold text-emerald-400">
                        ≈ ${estDollar.toFixed(0)} USD
                      </div>
                    </div>

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
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {deep && (
                      <a
                        href={deep.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-bold transition-all cursor-pointer"
                      >
                        <span>{deep.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        {/* Hotels Section */}
        {(activeFilter === 'all' || activeFilter === 'hotels') &&
          hotels.map((hotel) => {
            const deep = getDeepLink(hotel.name);
            const estDollar = (hotel.pointsBalance * resolveHotelCpp(hotel)) / 100;
            return (
              <div
                key={hotel.id}
                className="group rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-5 transition-all shadow-xl space-y-3 relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-14 h-9 rounded-xl bg-gradient-to-br from-teal-900 via-emerald-950 to-slate-900 border border-teal-500/20 shadow-lg flex items-center justify-center text-xs font-black text-white shrink-0">
                      <Building2 className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {hotel.name}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
                          {hotel.statusTier}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {hotel.nightsThisYear} {language === 'en' ? 'nights this year' : '晚房晚'} • {hotel.fncs?.length || 0} FNC
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 sm:justify-end">
                    <div className="text-right">
                      <div className="text-lg font-black text-white flex items-center gap-1.5 justify-end">
                        <span>{hotel.pointsBalance.toLocaleString()}</span>
                        <span className="text-xs text-teal-400 font-semibold">{language === 'en' ? 'Points' : '點數'}</span>
                      </div>
                      <div className="text-[11px] font-bold text-emerald-400">
                        ≈ ${estDollar.toFixed(0)} USD
                      </div>
                    </div>

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
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {deep && (
                      <a
                        href={deep.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold transition-all cursor-pointer"
                      >
                        <span>{deep.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* 5. Compact Monthly Perks Due Widget (Bottom checklist) */}
      {monthlyPerksDue.length > 0 && (
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gift className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-white">
                {language === 'en' ? 'Monthly Perks Due (Tap to Claim)' : '本月即期福利打卡（點擊銷帳）：'}
              </h4>
            </div>
            <button
              onClick={() => onNavigateTab('cards')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
            >
              {language === 'en' ? 'View all perks →' : '查看完整福利清單 →'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {monthlyPerksDue.map(({ card, perk }) => (
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
                    {perk.title}
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
            ))}
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
