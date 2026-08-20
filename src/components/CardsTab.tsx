import React, { useState } from 'react';
import { CreditCard as CardIcon, Check, Plus, ShieldAlert, Sparkles, FileText } from 'lucide-react';
import { CreditCard, UserProfile } from '../data/mockData';
import { StatementUploaderModal } from './StatementUploaderModal';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';

interface CardsTabProps {
  cards: CreditCard[];
  profile: UserProfile;
  onTogglePerk: (cardId: string, perkId: string) => void;
  onRecordMsrSpend: (cardId: string, amount: number) => void;
}

export const CardsTab: React.FC<CardsTabProps> = ({
  cards,
  profile,
  onTogglePerk,
  onRecordMsrSpend,
}) => {
  const language = useAppStore((s) => s.language);
  const [selectedIssuer, setSelectedIssuer] = useState<string>('All');
  const [spendInputCardId, setSpendInputCardId] = useState<string | null>(null);
  const [spendAmount, setSpendAmount] = useState<string>('');
  const [uploadingCardId, setUploadingCardId] = useState<string | null>(null);

  const issuers = ['All', 'Amex', 'Chase', 'Capital One', 'Bilt'];
  const issuerAllLabel = t(language, 'issuerAll');

  const filteredCards = cards.filter((card) => {
    const matchesPlayer =
      profile.activePlayer === 'All' || card.player === profile.activePlayer;
    const matchesIssuer =
      selectedIssuer === 'All' || card.issuer === selectedIssuer;
    return matchesPlayer && matchesIssuer;
  });

  const handleAddSpend = (cardId: string) => {
    const val = parseFloat(spendAmount);
    if (!isNaN(val) && val > 0) {
      onRecordMsrSpend(cardId, val);
      setSpendAmount('');
      setSpendInputCardId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Issuer Filter Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel rounded-2xl p-4 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <CardIcon className="w-5 h-5 text-indigo-400" />
            <span>{t(language, 'cardsTitle')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t(language, 'cardsDesc')}
          </p>
        </div>

        {/* Issuer Filter Pills */}
        <div className="flex flex-wrap items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          {issuers.map((issuer) => (
            <button
              key={issuer}
              onClick={() => setSelectedIssuer(issuer)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedIssuer === issuer
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {issuer === 'All' ? issuerAllLabel : issuer}
            </button>
          ))}
        </div>
      </div>

      {/* Credit Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCards.map((card) => {
          const cardValue = (card.currentBalance * card.cppValue) / 100;
          return (
            <div
              key={card.id}
              className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              {/* Card Realistic Header Box */}
              <div className="space-y-4">
                <div
                  className={`w-full h-44 rounded-2xl bg-gradient-to-br ${card.colorGradient} p-5 border shadow-xl flex flex-col justify-between relative overflow-hidden`}
                >
                  <div className="absolute right-4 top-4 text-xs font-bold text-white/30 tracking-widest uppercase">
                    {card.network}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 bg-black/40 text-white/90 border border-white/10 text-[10px] font-bold rounded-full backdrop-blur-md">
                        {card.issuer} • {card.player} {t(language, 'cardHolder')}
                      </span>
                      <h3 className="text-lg font-extrabold text-white mt-1 tracking-tight drop-shadow-md">
                        {card.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-end justify-between border-t border-white/10 pt-3">
                    <div>
                      <div className="text-[10px] text-white/60 font-medium">{t(language, 'cardCurrentPoints')}</div>
                      <div className="text-lg font-extrabold text-white tracking-wide">
                        {card.currentBalance.toLocaleString()} <span className="text-xs font-normal text-amber-300">pts</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-white/60 font-medium">{t(language, 'cardPointValue')}{card.cppValue}{t(language, 'cardPerPt')}</div>
                      <div className="text-base font-bold text-emerald-300">
                        ${cardValue.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Fee & Application Info Bar */}
                <div className="flex items-center justify-between px-2 text-xs">
                  <span className="text-slate-400">
                    {t(language, 'annualFee')}: <span className="text-slate-200 font-bold">${card.annualFee} {t(language, 'cardFeePerYear')}</span>
                  </span>
                  <span className="text-slate-400">
                    {t(language, 'cardOpenedDate')}: <span className="text-slate-300 font-medium">{card.applicationDate || t(language, 'cardNotRecorded')}</span>
                  </span>
                </div>

                {/* MSR Sign-up bonus Section if present */}
                {card.msr && (
                  <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-amber-300 flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t(language, 'msrDeadline')} (+{card.msr.bonusPoints.toLocaleString()} {card.pointsCurrency.split(' ')[0]})</span>
                      </span>
                      <span className="text-slate-300">{card.msr.deadlineDaysRemaining} {t(language, 'daysRemaining')}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round((card.msr.currentSpend / card.msr.requiredSpend) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>{t(language, 'cardSpent')} ${card.msr.currentSpend} / ${card.msr.requiredSpend}</span>
                        <span>{t(language, 'cardRemaining')} ${(card.msr.requiredSpend - card.msr.currentSpend).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Quick Add Spend Interactive button */}
                    {spendInputCardId === card.id ? (
                      <div className="flex items-center space-x-2 pt-1">
                        <input
                          type="number"
                          placeholder={t(language, 'cardEnterSpend')}
                          value={spendAmount}
                          onChange={(e) => setSpendAmount(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                        <button
                          onClick={() => handleAddSpend(card.id)}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shrink-0"
                        >
                          {t(language, 'cardConfirm')}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSpendInputCardId(card.id)}
                        className="text-[11px] font-semibold text-amber-400 hover:underline flex items-center space-x-1 pt-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{t(language, 'cardQuickAdd')}</span>
                      </button>
                    )}

                    {/* Upload CSV Statement Button */}
                    <button
                      onClick={() => setUploadingCardId(card.id)}
                      className="flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{t(language, 'uploadStatementBtn')}</span>
                    </button>
                  </div>
                )}

                {/* Multipliers Badge Bar */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t(language, 'cardMultipliers')}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {card.multipliers.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-medium rounded-lg"
                      >
                        <strong className="text-amber-400 font-bold">{m.rate}x</strong> {m.category}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Perks Checklist */}
                <div className="space-y-2 border-t border-slate-800 pt-3">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>{t(language, 'cardPerksList')}</span>
                    <span className="text-slate-500 font-normal">{t(language, 'cardClickToCheck')}</span>
                  </div>
                  <div className="space-y-2">
                    {card.perks.map((perk) => (
                      <div
                        key={perk.id}
                        onClick={() => onTogglePerk(card.id, perk.id)}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                          perk.used
                            ? 'bg-slate-950/40 border-slate-800 text-slate-500 line-through'
                            : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-indigo-500/50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border ${
                              perk.used
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                : 'border-slate-600'
                            }`}
                          >
                            {perk.used && <Check className="w-3 h-3" />}
                          </div>
                          <span className="font-semibold">{perk.title}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-emerald-400 font-bold ml-2">${perk.value}</span>
                          <span className="text-[10px] text-slate-400 block font-normal">{perk.frequency}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CSV Statement Upload Modal */}
      {uploadingCardId && (
        <StatementUploaderModal
          card={cards.find((c) => c.id === uploadingCardId)!}
          onClose={() => setUploadingCardId(null)}
          onApplySpend={(amt) => onRecordMsrSpend(uploadingCardId, amt)}
        />
      )}
    </div>
  );
};
