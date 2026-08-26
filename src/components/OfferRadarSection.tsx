import React, { useState } from 'react';
import {
  Flame,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Zap,
  Clock,
} from 'lucide-react';
import { MOCK_ATH_OFFERS, countChase524Openings } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';

interface OfferRadarSectionProps {
  className?: string;
}

export const OfferRadarSection: React.FC<OfferRadarSectionProps> = ({ className = '' }) => {
  const language = useAppStore((s) => s.language);
  const profile = useAppStore((s) => s.profile);
  const [filterIssuer, setFilterIssuer] = useState<string>('All');

  // Check 5/24 status for active player
  const openings =
    profile.activePlayer === 'P2'
      ? profile.chase524OpeningsP2
      : profile.chase524OpeningsP1;
  const count524 = countChase524Openings(openings);
  const is524Under = count524 < 5;

  const filteredOffers = MOCK_ATH_OFFERS.filter((offer) => {
    if (filterIssuer === 'All') return true;
    if (filterIssuer === '524Eligible') {
      return !offer.chase524Sensitive || is524Under;
    }
    return offer.issuer === filterIssuer;
  });

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Radar Section Header */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 bg-gradient-to-r from-amber-950/30 via-slate-900 to-rose-950/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-xl text-white shadow-lg shadow-rose-500/20 animate-pulse">
              <Flame className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-black text-white tracking-tight">
              {t(language, 'offerRadarTitle')}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t(language, 'offerRadarDesc')}
          </p>
        </div>

        {/* 5/24 Quick Status Indicator */}
        <div className="flex items-center space-x-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">
              {profile.activePlayer === 'P2' ? profile.p2Name : profile.p1Name} 5/24
            </span>
            <span className="text-sm font-extrabold text-white">
              {count524} / 5 <span className="text-xs font-normal text-slate-400">Cards</span>
            </span>
          </div>
          <span
            className={`p-2 rounded-xl text-xs font-bold ${
              is524Under
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}
          >
            {is524Under ? `${5 - count524} Slots Open` : '5/24 Blocked'}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'All', label: language === 'en' ? 'All ATH Offers' : '全部史高好卡' },
          { id: '524Eligible', label: language === 'en' ? '✅ 5/24 Eligible For You' : '✅ 當前符合申卡資格' },
          { id: 'Chase', label: 'Chase' },
          { id: 'Amex', label: 'Amex' },
          { id: 'Citi', label: 'Citi' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterIssuer(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterIssuer === tab.id
                ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-md shadow-rose-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOffers.map((offer) => {
          const isEligible = !offer.chase524Sensitive || is524Under;

          return (
            <div
              key={offer.id}
              className="glass-panel rounded-3xl p-5 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 relative group bg-gradient-to-b from-slate-900/90 to-slate-950/90 shadow-xl"
            >
              {/* Card Top */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-rose-500/30 flex items-center space-x-1">
                    <Flame className="w-3 h-3" />
                    <span>{t(language, 'athBadge')}</span>
                  </span>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md border flex items-center space-x-1 ${
                      isEligible
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {isEligible ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{t(language, 'eligibleToApply')}</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3" />
                        <span>{t(language, 'blockedBy524')}</span>
                      </>
                    )}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white pt-1">{offer.cardName}</h4>
                <div className="text-xs text-slate-400 flex items-center space-x-2">
                  <span>{offer.issuer}</span>
                  <span>•</span>
                  <span>{t(language, 'annualFee')}: ${offer.annualFee}</span>
                </div>
              </div>

              {/* Bonus Highlight Box */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-amber-500/20 space-y-1">
                <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block">
                  {language === 'en' ? 'Limited-Time Welcome Offer' : '限時最高開卡禮'}
                </span>
                <div className="text-lg font-black text-white tracking-tight">
                  {language === 'en' && offer.bonusTextEn ? offer.bonusTextEn : offer.bonusText}
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400">{t(language, 'estBonusVal')}:</span>
                  <span className="font-extrabold text-emerald-400">~${offer.bonusValueUSD} USD</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{t(language, 'spendRequiredLabel')}:</span>
                  <span className="font-semibold text-slate-300">${offer.spendRequired.toLocaleString()}</span>
                </div>
                {offer.deadline && (
                  <div className="flex items-center space-x-1 text-[10px] text-rose-400 font-semibold pt-1">
                    <Clock className="w-3 h-3" />
                    <span>{language === 'en' ? `Expires: ${offer.deadline}` : `截止日期：${offer.deadline}`}</span>
                  </div>
                )}
              </div>

              {/* Key Bullet Highlights */}
              <ul className="space-y-1.5 text-xs text-slate-300">
                {(language === 'en' && offer.highlightsEn ? offer.highlightsEn : offer.highlights).map((h, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-tight">{h}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-800/80">
                <a
                  href={offer.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-rose-500/20 flex items-center justify-center space-x-2 transition-all active:scale-98"
                >
                  <span>{t(language, 'applyNow')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
