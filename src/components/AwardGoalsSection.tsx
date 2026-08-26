import React, { useState } from 'react';
import {
  Target,
  Plane,
  Building2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { MOCK_AWARD_GOALS, AwardGoal } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';

interface AwardGoalsSectionProps {
  className?: string;
}

export const AwardGoalsSection: React.FC<AwardGoalsSectionProps> = ({ className = '' }) => {
  const language = useAppStore((s) => s.language);
  const cards = useAppStore((s) => s.cards);
  const airlines = useAppStore((s) => s.airlines);
  const hotels = useAppStore((s) => s.hotels);
  const profile = useAppStore((s) => s.profile);

  const [selectedCabin, setSelectedCabin] = useState<string>('All');

  // Filter cards & loyalty by active player
  const activeCards = cards.filter(
    (c) => profile.activePlayer === 'All' || c.player === profile.activePlayer
  );
  const activeAirlines = airlines.filter(
    (a) => profile.activePlayer === 'All' || a.player === profile.activePlayer
  );
  const activeHotels = hotels.filter(
    (h) => profile.activePlayer === 'All' || h.player === profile.activePlayer
  );

  // Calculate Bank Balances
  const amexMrTotal = activeCards
    .filter((c) => c.pointsCurrency.includes('Membership Rewards'))
    .reduce((sum, c) => sum + c.currentBalance, 0);

  const chaseUrTotal = activeCards
    .filter((c) => c.pointsCurrency.includes('Ultimate Rewards'))
    .reduce((sum, c) => sum + c.currentBalance, 0);

  const capOneTotal = activeCards
    .filter((c) => c.pointsCurrency.includes('Venture') || c.issuer === 'Capital One')
    .reduce((sum, c) => sum + c.currentBalance, 0);

  const biltTotal = activeCards
    .filter((c) => c.issuer === 'Bilt')
    .reduce((sum, c) => sum + c.currentBalance, 0);

  // Helper to compute available eligible points for a given goal
  const calculateEligiblePoints = (goal: AwardGoal) => {
    let eligible = 0;
    if (goal.transferPartners.includes('Amex MR')) eligible += amexMrTotal;
    if (goal.transferPartners.includes('Chase UR')) eligible += chaseUrTotal;
    if (goal.transferPartners.includes('Capital One')) eligible += capOneTotal;
    if (goal.transferPartners.includes('Bilt') || goal.transferPartners.includes('Bilt Rewards')) eligible += biltTotal;

    // Check direct airline / hotel program balance
    const directAir = activeAirlines.find((a) =>
      goal.airlineOrHotel.toLowerCase().includes(a.name.toLowerCase()) ||
      a.name.toLowerCase().includes(goal.airlineOrHotel.toLowerCase())
    );
    if (directAir) eligible += directAir.milesBalance;

    const directHotel = activeHotels.find((h) =>
      goal.airlineOrHotel.toLowerCase().includes(h.name.toLowerCase()) ||
      h.name.toLowerCase().includes(goal.airlineOrHotel.toLowerCase())
    );
    if (directHotel) eligible += directHotel.pointsBalance;

    return eligible;
  };

  const filteredGoals = MOCK_AWARD_GOALS.filter((goal) => {
    if (selectedCabin === 'All') return true;
    if (selectedCabin === 'Hotel') return goal.cabinClass.includes('Hotel');
    return goal.cabinClass === selectedCabin;
  });

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-sky-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-gradient-to-tr from-indigo-500 to-sky-500 rounded-xl text-white shadow-lg shadow-sky-500/20">
              <Target className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-black text-white tracking-tight">
              {t(language, 'awardGoalsTitle')}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t(language, 'awardGoalsDesc')}
          </p>
        </div>

        {/* Available Bank Transfer Points Summary */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs">
          <div className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-300 font-semibold">
            Chase UR: <span className="font-bold text-white">{chaseUrTotal.toLocaleString()}</span>
          </div>
          <div className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 font-semibold">
            Amex MR: <span className="font-bold text-white">{amexMrTotal.toLocaleString()}</span>
          </div>
          <div className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300 font-semibold">
            CapOne: <span className="font-bold text-white">{capOneTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Cabin Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'All', label: language === 'en' ? 'All Sweet Spots' : '全部甜點目標' },
          { id: 'Business', label: language === 'en' ? 'Business Class (兩艙商務)' : '商務艙' },
          { id: 'First', label: language === 'en' ? 'First Class (奢華頭等)' : '頭等艙' },
          { id: 'Hotel', label: language === 'en' ? 'Luxury Hotels (頂級酒店)' : '奢華酒店' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCabin(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCabin === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredGoals.map((goal) => {
          const eligiblePts = calculateEligiblePoints(goal);
          const percent = Math.min(100, Math.round((eligiblePts / goal.pointsRequired) * 100));
          const isReady = eligiblePts >= goal.pointsRequired;
          const remainingPts = Math.max(0, goal.pointsRequired - eligiblePts);

          return (
            <div
              key={goal.id}
              className="glass-panel rounded-3xl p-6 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4 relative group bg-gradient-to-b from-slate-900/80 to-slate-950/90 shadow-xl"
            >
              {/* Top Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {goal.cabinClass}
                    </span>
                    {goal.tags.map((tg, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {tg}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                    {goal.sweetSpotRatioCpp}¢ / pt CPP
                  </span>
                </div>

                <h4 className="text-base font-bold text-white leading-snug pt-1">{goal.title}</h4>
                <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                  {goal.cabinClass.includes('Hotel') ? (
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  ) : (
                    <Plane className="w-3.5 h-3.5 text-sky-400" />
                  )}
                  <span>{goal.routeOrProperty}</span>
                </div>
              </div>

              {/* Required Points & Cash Value Comparison */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">{language === 'en' ? 'Required Points' : '所需點數 / 里程'}</span>
                  <span className="text-base font-black text-sky-300">
                    {goal.pointsRequired.toLocaleString()} <span className="text-xs font-normal">pts</span>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{language === 'en' ? 'Est. Cash Price' : '官方現金購票價格'}</span>
                  <span className="text-base font-black text-emerald-400">
                    ${goal.estimatedCashPriceUSD.toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300 flex items-center space-x-1">
                    <span>{language === 'en' ? 'Your Progress' : '當前點數達成進度'}</span>
                    <span className="text-slate-500 text-[10px]">({eligiblePts.toLocaleString()} / {goal.pointsRequired.toLocaleString()})</span>
                  </span>
                  <span className={isReady ? 'text-emerald-400 font-extrabold' : 'text-sky-400'}>
                    {percent}%
                  </span>
                </div>

                <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isReady
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-r from-sky-500 to-indigo-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  {isReady ? (
                    <div className="text-[11px] font-bold text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t(language, 'goalAchieved')}</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-amber-300 font-medium">
                      {language === 'en' ? `Need ${remainingPts.toLocaleString()} more points` : `還差 ${remainingPts.toLocaleString()} 點即可兌換`}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400">
                    {t(language, 'cashValueSaved')}: <strong className="text-emerald-400">${(goal.estimatedCashPriceUSD - (goal.pointsRequired * 0.01)).toFixed(0)}</strong>
                  </span>
                </div>
              </div>

              {/* Strategy & Transfer Route */}
              <div className="text-xs text-slate-400 space-y-1 bg-indigo-950/20 border border-indigo-500/20 p-3 rounded-2xl">
                <div className="flex items-center space-x-1 text-[11px] font-bold text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t(language, 'bestTransferRoute')}:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {goal.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {goal.transferPartners.map((partner, i) => (
                    <span key={i} className="px-2 py-0.5 text-[10px] font-semibold bg-slate-900 text-sky-300 rounded border border-slate-700">
                      {partner} ➔ {goal.programName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
