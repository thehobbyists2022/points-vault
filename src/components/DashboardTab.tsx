import {
  Building2,
  Gift,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plane,
  Ticket,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CreditCard, HotelProgram, CarRentalProgram, AirlineProgram, UserProfile } from '../data/mockData';
import { countChase524Openings } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';
import { loadHistory } from '../lib/portfolioHistory';

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

  // Math totals
  const cardPointsValue = filteredCards.reduce(
    (sum, c) => sum + (c.currentBalance * c.cppValue) / 100,
    0
  );
  const airlinePointsValue = filteredAirlines.reduce(
    (sum, a) => sum + (a.milesBalance * a.cppValue) / 100,
    0
  );
  const hotelPointsValue = filteredHotels.reduce(
    (sum, h) => sum + (h.pointsBalance * h.cppValue) / 100,
    0
  );
  const totalValue = cardPointsValue + airlinePointsValue + hotelPointsValue;

  const totalAnnualFees = filteredCards.reduce((sum, c) => sum + c.annualFee, 0);

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
              {t(language, 'dashWelcome')}，{profile.activePlayer === 'All' ? t(language, 'dashFamilyView') : profile.activePlayer}！
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              {t(language, 'dashManaging')} <span className="text-indigo-300 font-bold">{filteredCards.length} {t(language, 'dashCreditCards')}</span>、
              <span className="text-sky-300 font-bold">{filteredAirlines.length} {t(language, 'dashAirlinePrograms')}</span>、
              <span className="text-purple-300 font-bold">{filteredHotels.length} {t(language, 'dashHotelPrograms')}</span> 以及{' '}
              <span className="text-emerald-300 font-bold">{filteredCars.length} {t(language, 'dashCarMemberships')}</span>。
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('merchant')}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t(language, 'dashFindBestCard')}</span>
          </button>
        </div>
      </div>

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
                  : t(language, 'dash524Blocked')}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{t(language, 'dashAnnualFees')}: ${totalAnnualFees}</div>
          </div>
        </div>
      </div>

      {/* MSR Spend Tracker Widget */}
      {cardsWithMSR.length > 0 && (
        <div className="glass-panel rounded-2xl p-5 border border-amber-500/30 bg-amber-950/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">{t(language, 'dashMsrTracker')}</h3>
            </div>
            <button
              onClick={() => onNavigateTab('cards')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
            >
              <span>{t(language, 'dashManageCards')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cardsWithMSR.map((card) => {
              const msr = card.msr!;
              const progressPct = Math.min(100, Math.round((msr.currentSpend / msr.requiredSpend) * 100));
              const remainingSpend = msr.requiredSpend - msr.currentSpend;
              return (
                <div key={card.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{card.name}</h4>
                      <div className="text-xs text-amber-300 font-medium mt-0.5">
                        {t(language, 'dashBonus')}: +{msr.bonusPoints.toLocaleString()} {card.pointsCurrency}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-lg">
                      {msr.deadlineDaysRemaining} {t(language, 'dashDaysLeft')}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-300">
                      <span>{t(language, 'dashCompleted')} ${msr.currentSpend.toLocaleString()}</span>
                      <span>{t(language, 'dashTarget')} ${msr.requiredSpend.toLocaleString()} ({progressPct}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-400 text-right">
                      {t(language, 'dashNeedSpend')}: <span className="text-amber-400 font-bold">${remainingSpend.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Two Column Layout: Unclaimed Perks & Companion Pass/FNC */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unclaimed Card Perks Checklist */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">{t(language, 'dashPerksChecklist')}</h3>
            </div>
            <span className="text-xs text-slate-400">{unclaimedPerks.length} {t(language, 'dashItemsToUse')}</span>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {allPerks.map((perk) => (
              <div
                key={perk.id}
                onClick={() => onTogglePerk(perk.cardId, perk.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  perk.used
                    ? 'bg-slate-950/40 border-slate-800 text-slate-500 line-through opacity-70'
                    : 'bg-slate-900/80 border-slate-700/80 hover:border-amber-500/50 text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {perk.used ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                  )}
                  <div>
                    <div className="text-xs font-bold text-slate-100">{perk.title}</div>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                      <span>{perk.cardName}</span>
                      <span>•</span>
                      <span className="text-amber-300 font-medium">{t(language, 'dashResetCycle')}: {perk.frequency}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-emerald-400">${perk.value}</div>
                  <span className="text-[10px] text-slate-400">
                    {perk.used ? t(language, 'dashMarkedClaimed') : t(language, 'dashClickToMark')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Airline Companion Pass & Hotel FNC Alert */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Plane className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white">{t(language, 'dashCompanionAlerts')}</h3>
            </div>
            <button
              onClick={() => onNavigateTab('airlines')}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center space-x-1"
            >
              <span>{t(language, 'dashViewMiles')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Airline Companion Certificate */}
            {companionPasses.map((cp, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-sky-500/30 rounded-xl p-3.5 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold rounded">
                      {cp.airlineName.split(' ')[0]}
                    </span>
                    <span className="text-xs font-bold text-white">{cp.title}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {t(language, 'dashStatus')}: <span className="text-emerald-400 font-semibold">{cp.isUnlocked ? t(language, 'dashUnlocked') : t(language, 'dashAccumulating')}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-rose-400 flex items-center space-x-1 justify-end">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{cp.expiryDate} {t(language, 'dashExpiry')}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{t(language, 'dashSaveUsd')}$300-$800</div>
                </div>
              </div>
            ))}

            {/* Hotel FNC */}
            {activeFNCs.map((fnc) => (
              <div
                key={fnc.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold rounded">
                      {fnc.hotelName}
                    </span>
                    <span className="text-xs font-bold text-white">{fnc.title}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {t(language, 'dashCategoryLimit')}: <span className="text-slate-200 font-medium">{fnc.categoryLimit}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-rose-400 flex items-center space-x-1 justify-end">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{fnc.expirationDate} {t(language, 'dashExpiry')}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{t(language, 'dashEstValue')}$250-$500</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Value History Chart */}
      {loadHistory().length >= 2 && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              {t(language, 'portfolioHistory')}
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={loadHistory()} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                formatter={(value) => [`$${Number(value).toFixed(2)}`, '']}
              />
              <Line type="monotone" dataKey="totalValueUSD" stroke="#6366f1" strokeWidth={2} dot={false} name="Total" />
              <Line type="monotone" dataKey="cardValueUSD" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Cards" />
              <Line type="monotone" dataKey="airlineValueUSD" stroke="#38bdf8" strokeWidth={1.5} dot={false} name="Airlines" />
              <Line type="monotone" dataKey="hotelValueUSD" stroke="#a78bfa" strokeWidth={1.5} dot={false} name="Hotels" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
