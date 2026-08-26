import React, { useState } from 'react';
import { Gift, ExternalLink, Copy, Check, Edit3, X, ShieldCheck } from 'lucide-react';
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
  const setCardReferralUrl = useAppStore((s) => s.setCardReferralUrl);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [urlInput, setUrlInput] = useState('');

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

  const resolveUrl = (url?: string) => {
    if (!url) return '';
    if (url.includes('the-platinum-card') || url.includes('refer.amex.us/MPLATINUM')) {
      return 'https://www.americanexpress.com/us/credit-cards/card/platinum/';
    }
    if (url.includes('the-amex-gold-card') || url.includes('refer.amex.us/MGOLD')) {
      return 'https://www.americanexpress.com/us/credit-cards/card/gold-card/';
    }
    return url;
  };

  const handleCopyLink = async (card: CreditCard) => {
    const validUrl = resolveUrl(card.referralUrl);
    if (!validUrl) return;
    navigator.clipboard.writeText(validUrl);
    setCopiedId(card.id);
    setTimeout(() => setCopiedId(null), 2000);
    const user = await getUser();
    trackReferralClick(card.id, card.name, validUrl, user?.id);
  };

  const handleOpenLink = async (card: CreditCard) => {
    const validUrl = resolveUrl(card.referralUrl);
    if (!validUrl) return;
    const user = await getUser();
    await trackReferralClick(card.id, card.name, validUrl, user?.id);
    window.open(validUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSaveReferralUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCard && urlInput.trim()) {
      setCardReferralUrl(editingCard.id, urlInput.trim());
      setEditingCard(null);
    }
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

        {/* Counter Badges */}
        <div className="flex flex-wrap gap-3">
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 shadow-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              {t(language, 'potentialEarnings')}
            </div>
            <div className="text-2xl font-black text-emerald-400 tracking-tight mt-0.5">
              ${totalPotentialEarnings.toLocaleString()} USD
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {t(language, 'referralBasedOn')} {referralCards.length} {t(language, 'referralCardsValued')}
            </div>
          </div>

          <div className="bg-slate-950/80 border border-indigo-500/30 rounded-2xl p-4 shadow-xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              {t(language, 'annualCap')}
            </div>
            <div className="text-2xl font-black text-indigo-300 tracking-tight mt-0.5">
              55,000 - 100,000 <span className="text-xs font-normal text-slate-400">pts/yr</span>
            </div>
            <div className="text-[10px] text-indigo-400 mt-1 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>{language === 'en' ? 'Amex $550 / Chase 100k cap' : 'Amex 5.5萬分 / Chase 10萬分封頂'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Referral Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {referralCards.map((card) => {
          const capTotal = card.annualReferralCap || (card.issuer === 'Amex' ? 55000 : 100000);
          const earned = card.annualReferralEarned || 0;
          const capPercent = Math.min(100, Math.round((earned / capTotal) * 100));

          return (
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
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingCard(card);
                          setUrlInput(card.referralUrl || '');
                        }}
                        title={language === 'en' ? 'Customize my referral link' : '自訂我的推薦連結'}
                        className="p-1 rounded-lg bg-black/40 hover:bg-black/70 text-white/70 hover:text-white transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white/40 tracking-wider">
                        {card.network}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white truncate drop-shadow">
                      {card.name}
                    </h3>
                  </div>
                </div>

                {/* Bonus Info Section */}
                <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">{t(language, 'referralBonus')}:</span>
                    <span className="font-extrabold text-amber-400">{card.referralBonus}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-t border-slate-800/80 pt-2">
                    <span className="text-slate-400 font-medium">{t(language, 'referralEstUsd')}:</span>
                    <span className="font-extrabold text-emerald-400">${card.referralValue} USD</span>
                  </div>

                  {/* Annual Referral Cap Progress Bar */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                      <span>{t(language, 'annualCap')}</span>
                      <span>{earned.toLocaleString()} / {capTotal.toLocaleString()} pts ({capPercent}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${capPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleCopyLink(card)}
                  className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl font-bold text-xs transition-all active:scale-95 border ${
                    copiedId === card.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                  }`}
                >
                  {copiedId === card.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t(language, 'copied')}</span>
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
                  className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                >
                  <span>{t(language, 'openLink')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Link Modal */}
      {editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-md rounded-3xl border border-slate-800 p-6 space-y-4 bg-slate-950 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-emerald-400" />
                <span>{language === 'en' ? 'Customize Referral Link' : '自訂專屬推薦連結'}</span>
              </h3>
              <button
                onClick={() => setEditingCard(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReferralUrl} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">{editingCard.name}</label>
                <input
                  type="url"
                  required
                  placeholder="https://refer.amex.us/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  {t(language, 'cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  {language === 'en' ? 'Save' : '儲存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
