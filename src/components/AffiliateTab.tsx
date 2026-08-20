import React, { useState } from 'react';
import { Gift, ExternalLink, Copy, Check, DollarSign } from 'lucide-react';
import type { CreditCard, UserProfile } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';
import { trackReferralClick } from '../lib/sync';
import { getUser } from '../lib/supabase';

interface AffiliateTabProps {
  cards: CreditCard[];
  profile: UserProfile;
}

export const AffiliateTab: React.FC<AffiliateTabProps> = ({ cards, profile }) => {
  const language = useAppStore((s) => s.language);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter cards that have referralUrl and match current active player
  const referralCards = cards
    .filter((card) => Boolean(card.referralUrl))
    .filter(
      (card) => profile.activePlayer === 'All' || card.player === profile.activePlayer
    )
    .sort((a, b) => (b.referralValue ?? 0) - (a.referralValue ?? 0));

  const totalPotentialEarnings = referralCards.reduce(
    (sum, card) => sum + (card.referralValue ?? 0),
    0
  );

  const handleCopyLink = async (card: CreditCard) => {
    if (!card.referralUrl) return;
    navigator.clipboard.writeText(card.referralUrl);
    setCopiedId(card.id);
    setTimeout(() => setCopiedId(null), 2000);
    // Track copy as a click event too
    const user = await getUser();
    trackReferralClick(card.id, card.name, card.referralUrl, user?.id);
  };

  const handleOpenLink = async (card: CreditCard) => {
    if (!card.referralUrl) return;
    const user = await getUser();
    await trackReferralClick(card.id, card.name, card.referralUrl, user?.id);
    window.open(card.referralUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Gift className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white">{t(language, 'referralTitle')}</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t(language, 'referralDesc')}
          </p>
        </div>

        {/* Counter Badge */}
        <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 flex items-center space-x-4 shadow-xl">
          <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              {t(language, 'potentialEarnings')}
            </div>
            <div className="text-2xl font-black text-emerald-400 tracking-tight">
              ${totalPotentialEarnings.toLocaleString()} USD
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {t(language, 'referralBasedOn')} {referralCards.length} {t(language, 'referralCardsValued')}
            </div>
          </div>
        </div>
      </div>

      {/* Cards Referral Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {referralCards.map((card) => (
          <div
            key={card.id}
            className="glass-panel rounded-3xl p-5 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
          >
            <div>
              {/* Mini Header Card Banner */}
              <div
                className={`w-full h-28 rounded-2xl bg-gradient-to-br ${card.colorGradient} p-4 border border-white/10 flex flex-col justify-between relative overflow-hidden shadow-lg mb-4`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-black/50 text-white/90 text-[10px] font-bold rounded-full border border-white/10 backdrop-blur-md">
                    {card.issuer} • {card.player}
                  </span>
                  <span className="text-xs font-bold text-white/40 tracking-wider">
                    {card.network}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white truncate drop-shadow">
                    {card.name}
                  </h3>
                </div>
              </div>

              {/* Bonus Info Section */}
              <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{t(language, 'referralBonus')}:</span>
                  <span className="font-extrabold text-amber-400">{card.referralBonus}</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400 font-medium">{t(language, 'referralEstUsd')}:</span>
                  <span className="font-extrabold text-emerald-400">${card.referralValue} USD</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleCopyLink(card)}
                className="flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
              >
                {copiedId === card.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{t(language, 'copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t(language, 'copyLink')}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleOpenLink(card)}
                className="flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t(language, 'openLink')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
