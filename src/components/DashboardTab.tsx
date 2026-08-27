import React, { useState } from 'react';
import {
  Gift,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Ticket,
  Smartphone,
  Calendar,
  Settings2,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { CreditCard, HotelProgram, CarRentalProgram, AirlineProgram, UserProfile } from '../data/mockData';
import { countChase524Openings } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';
import { loadHistory } from '../lib/portfolioHistory';
import { generatePerksCalendarICS, downloadCalendarICS } from '../lib/calendarExport';
import { getMsrDaysRemaining } from '../lib/msr';
import { calculatePortfolioBreakdown } from '../lib/valuation';
import { PassesRadarSection } from './PassesRadarSection';
import { P2CheatSheetModal } from './P2CheatSheetModal';
import { ProductChangeGuideModal } from './ProductChangeGuideModal';
import { CppSettingsModal } from './CppSettingsModal';

interface DashboardTabProps {
  cards: CreditCard[];
  airlines: AirlineProgram[];
  hotels: HotelProgram[];
  cars: CarRentalProgram[];
  profile: UserProfile;
  onTogglePerk: (cardId: string, perkId: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  cards,
  airlines,
  hotels,
  cars,
  profile,
  onTogglePerk,
  onNavigateTab,
}) => {
  const language = useAppStore((s) => s.language);
  const customCppRates = useAppStore((s) => s.customCppRates);

  const [isP2ModalOpen, setIsP2ModalOpen] = useState(false);
  const [isProductChangeModalOpen, setIsProductChangeModalOpen] = useState(false);
  const [isCppModalOpen, setIsCppModalOpen] = useState(false);
  const [showPassesRadar, setShowPassesRadar] = useState(false);
  const [calDownloaded, setCalDownloaded] = useState(false);

  // Filter by active player
  const filteredCards = cards.filter(
    (c) => profile.activePlayer === 'All' || c.player === profile.activePlayer
  );
  const filteredAirlines = airlines.filter(
    (a) => profile.activePlayer === 'All' || a.player === profile.activePlayer
  );
  const filteredHotels = hotels.filter(
    (h) => profile.activePlayer === 'All' || h.player === profile.activePlayer
  );
  const filteredCars = cars.filter(
    (c) => profile.activePlayer === 'All' || c.player === profile.activePlayer
  );

  // Unified Math totals with custom CPP
  const {
    cardValueUSD: cardPointsValue,
    airlineValueUSD: airlinePointsValue,
    hotelValueUSD: hotelPointsValue,
    totalValueUSD: totalValue,
  } = calculatePortfolioBreakdown(cards, airlines, hotels, customCppRates, profile.activePlayer);

  // Perks math
  const allPerks = filteredCards.flatMap((c) =>
    c.perks.map((p) => ({ ...p, cardName: c.name, cardId: c.id }))
  );
  const unclaimedPerks = allPerks.filter((p) => !p.used);
  const unclaimedValue = unclaimedPerks.reduce((sum, p) => sum + p.value, 0);

  // MSR spend active
  const cardsWithMSR = filteredCards.filter((c) => c.msr);

  // Active FNCs
  const allFNCs = filteredHotels.flatMap((h) =>
    h.fncs.map((f) => ({ ...f, hotelName: h.name }))
  );
  const activeFNCs = allFNCs.filter((f) => !f.isUsed);

  // Active Companion Passes
  const companionPasses = filteredAirlines
    .filter((a) => a.companionPass)
    .map((a) => ({ ...a.companionPass!, airlineName: a.name }));

  // Asset allocation dataset for PieChart
  const allocationData = [
    { name: t(language, 'assetCards'), value: Math.round(cardPointsValue), color: '#f59e0b' },
    { name: t(language, 'assetAirlines'), value: Math.round(airlinePointsValue), color: '#38bdf8' },
    { name: t(language, 'assetHotels'), value: Math.round(hotelPointsValue), color: '#a78bfa' },
    ...(unclaimedValue > 0 ? [{ name: t(language, 'assetPerks'), value: Math.round(unclaimedValue), color: '#10b981' }] : []),
  ].filter((d) => d.value > 0);

  const handleExportCalendar = () => {
    const ics = generatePerksCalendarICS(cards, hotels, profile.p1Name, language);
    downloadCalendarICS(ics, `PointsVault_Perks_${profile.p1Name}.ics`);
    setCalDownloaded(true);
    setTimeout(() => setCalDownloaded(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-slate-900 border border-indigo-500/20 p-6">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>{t(language, 'dashControlPanel')}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {t(language, 'dashWelcome')}{language === 'en' ? ', ' : '，'}{profile.activePlayer === 'All' ? t(language, 'dashFamilyView') : profile.activePlayer}{language === 'en' ? '!' : '！'}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              {t(language, 'dashManaging')} <span className="text-indigo-300 font-bold">{filteredCards.length} {t(language, 'dashCreditCards')}</span>{language === 'en' ? ', ' : '、'}
              <span className="text-sky-300 font-bold">{filteredAirlines.length} {t(language, 'dashAirlinePrograms')}</span>{language === 'en' ? ', ' : '、'}
              <span className="text-purple-300 font-bold">{filteredHotels.length} {t(language, 'dashHotelPrograms')}</span>{language === 'en' ? ' and ' : ' 以及 '}
              <span className="text-emerald-300 font-bold">{filteredCars.length} {t(language, 'dashCarMemberships')}</span>{language === 'en' ? '.' : '。'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateTab('merchant')}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
            >
              <TrendingUp className="w-4 h-4" />
              <span>{t(language, 'dashFindBestCard')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Strategy Bar (P2 Cheat Sheet, Downgrade Guide, CPP Adjuster, Calendar) */}
      <div className="flex flex-wrap items-center gap-2.5 glass-panel rounded-2xl p-3 border border-slate-800 bg-slate-950/80">
        <button
          onClick={() => setShowPassesRadar(!showPassesRadar)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 active:scale-95 border ${
            showPassesRadar
              ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-500/30'
              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}
        >
          <Ticket className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'en' ? '🎫 FNC & Passes Radar' : '🎫 房券與伴飛券雷達'}</span>
        </button>

        <button
          onClick={() => setIsP2ModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center space-x-1.5 active:scale-95 transition-all"
        >
          <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
          <span>{language === 'en' ? `📱 ${profile.p2Name} Wallet Memo` : `📱 ${profile.p2Name} 專屬刷卡便簽`}</span>
        </button>

        <button
          onClick={() => setIsProductChangeModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1.5 active:scale-95 transition-all"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'en' ? '🛡️ Safe Downgrade Guide' : '🛡️ 安全降級保點向導'}</span>
        </button>

        <button
          onClick={() => setIsCppModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center space-x-1.5 active:scale-95 transition-all"
        >
          <Settings2 className="w-3.5 h-3.5 text-purple-400" />
          <span>{language === 'en' ? '⚙️ Custom CPP Valuation' : '⚙️ 自訂 CPP 估值'}</span>
        </button>

        <button
          onClick={handleExportCalendar}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center space-x-1.5 active:scale-95 transition-all ml-auto"
        >
          {calDownloaded ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'en' ? 'Exported!' : '已導出日曆！'}</span>
            </>
          ) : (
            <>
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>{language === 'en' ? '📅 Sync to Calendar (.ics)' : '📅 導出福利日曆 (.ics)'}</span>
            </>
          )}
        </button>
      </div>

      {/* Render Passes Radar if toggled */}
      {showPassesRadar && <PassesRadarSection />}

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">{t(language, 'dashPortfolioValue')}</span>
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-400">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>{t(language, 'dashCards')}: ${(cardPointsValue).toFixed(0)}</span>
              <span>{t(language, 'dashFlights')}: ${(airlinePointsValue).toFixed(0)}</span>
              <span>{t(language, 'dashHotels')}: ${(hotelPointsValue).toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">{t(language, 'dashUnclaimed')}</span>
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <Gift className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-400">
              ${unclaimedValue}
              <span className="text-xs text-slate-400 font-normal ml-1 cursor-pointer">
                ({unclaimedPerks.length} {t(language, 'dashItemsUnclaimed')})
              </span>
            </div>
            <div className="text-[11px] text-amber-300/80 mt-1">{t(language, 'dashIncludesUber')}</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">{t(language, 'dashCompanionFNC')}</span>
            <div className="p-2 bg-sky-500/10 rounded-xl">
              <Ticket className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-sky-400">
              {companionPasses.length + activeFNCs.length} {t(language, 'dashAvailable')}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {t(language, 'dashFNCIncluded')}
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">{t(language, 'dash524Status')}</span>
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-purple-300">
                {profile.activePlayer === 'P2' ? countChase524Openings(profile.chase524OpeningsP2) : countChase524Openings(profile.chase524OpeningsP1)} / 5
              </span>
              <span className="text-xs text-emerald-400 font-semibold ml-1">
                {(profile.activePlayer === 'P2' ? countChase524Openings(profile.chase524OpeningsP2) : countChase524Openings(profile.chase524OpeningsP1)) < 5
                  ? t(language, 'dashCanApply')
                  : t(language, 'dashNeedWait')}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {t(language, 'dashRollingWindow')}
            </div>
          </div>
        </div>
      </div>

      {/* MSR Active Spend Targets Alert */}
      {cardsWithMSR.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                {t(language, 'dashMSRTargets')} ({cardsWithMSR.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('cards')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 font-semibold"
            >
              <span>{t(language, 'dashManageCards')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cardsWithMSR.map((card) => {
              const msr = card.msr!;
              const percent = Math.min(100, Math.round((msr.currentSpend / msr.requiredSpend) * 100));
              const isCompleted = msr.currentSpend >= msr.requiredSpend;

              return (
                <div
                  key={card.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {card.player}
                      </span>
                      <span className="text-sm font-bold text-white truncate">{card.name}</span>
                    </div>
                    <span className="text-xs font-black text-amber-400">
                      +{msr.bonusPoints.toLocaleString()} {card.pointsCurrency.split(' ')[0]}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>${msr.currentSpend.toLocaleString()} / ${msr.requiredSpend.toLocaleString()}</span>
                      <span className={isCompleted ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                        {isCompleted ? t(language, 'dashCompleted') : `${t(language, 'dashRemaining')} ${getMsrDaysRemaining(card)} ${t(language, 'daysRemaining')}`}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-indigo-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Unclaimed Monthly Perks Section */}
      {unclaimedPerks.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">
                {t(language, 'dashMonthlyPerks')}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {t(language, 'dashTickToSave')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {unclaimedPerks.map((perk) => (
              <div
                key={`${perk.cardId}-${perk.id}`}
                onClick={() => onTogglePerk(perk.cardId, perk.id)}
                className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="space-y-0.5 min-w-0 pr-2">
                  <div className="text-[10px] text-slate-400 truncate">{perk.cardName}</div>
                  <div className="text-xs font-bold text-white truncate">{perk.title}</div>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-xs font-black text-emerald-400">${perk.value}</span>
                  <div className="w-5 h-5 rounded-lg border border-slate-700 group-hover:border-indigo-500 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-transparent group-hover:text-slate-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio Analytics: Asset Allocation Breakdown & 90-Day History Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation Donut / Pie Chart */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <PieChartIcon className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                {t(language, 'portfolioBreakdown')}
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-400">
              ${totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-1">
            <div className="w-full sm:w-1/2 h-[180px] relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#0b101d', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '11px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [`$${Number(value).toLocaleString('en-US')} (${totalValue > 0 ? Math.round((Number(value) / totalValue) * 100) : 0}%)`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total</span>
                <span className="text-sm font-black text-white">${(totalValue / 1000).toFixed(1)}k</span>
              </div>
            </div>

            {/* Custom Interactive Breakdown Legend */}
            <div className="w-full sm:w-1/2 space-y-2 text-xs">
              {allocationData.map((item, idx) => {
                const pct = totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0;
                return (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300 font-medium truncate">{item.name}</span>
                    </div>
                    <div className="text-right flex items-center space-x-2 shrink-0">
                      <span className="font-bold text-white">${item.value.toLocaleString('en-US')}</span>
                      <span className="text-[10px] text-slate-400 w-8 text-right font-mono">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Portfolio Value History Line Chart */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">
                {t(language, 'portfolioHistory')}
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">90 Days</span>
          </div>

          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={loadHistory()} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ background: '#0b101d', border: '1px solid #1e293b', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '11px' }}
                  formatter={(value) => [`$${Number(value).toFixed(0)}`, '']}
                />
                <Line type="monotone" dataKey="totalValueUSD" stroke="#6366f1" strokeWidth={2} dot={false} name="Total" />
                <Line type="monotone" dataKey="cardValueUSD" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Cards" />
                <Line type="monotone" dataKey="airlineValueUSD" stroke="#38bdf8" strokeWidth={1.5} dot={false} name="Airlines" />
                <Line type="monotone" dataKey="hotelValueUSD" stroke="#a78bfa" strokeWidth={1.5} dot={false} name="Hotels" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Modals */}
      <P2CheatSheetModal
        isOpen={isP2ModalOpen}
        onClose={() => setIsP2ModalOpen(false)}
      />

      <ProductChangeGuideModal
        isOpen={isProductChangeModalOpen}
        onClose={() => setIsProductChangeModalOpen(false)}
      />

      <CppSettingsModal
        isOpen={isCppModalOpen}
        onClose={() => setIsCppModalOpen(false)}
      />
    </div>
  );
};
