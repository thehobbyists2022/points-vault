import React, { useState } from 'react';
import { CreditCard as CardIcon, Check, Plus, Sparkles, FileText, Edit2, Trash2, Target, Flame, ShieldCheck } from 'lucide-react';
import { CreditCard, UserProfile } from '../data/mockData';
import { StatementUploaderModal } from './StatementUploaderModal';
import { AddCardModal } from './AddCardModal';
import { EditBalanceModal } from './EditBalanceModal';
import { RetentionHelperModal } from './RetentionHelperModal';
import { ProductChangeGuideModal } from './ProductChangeGuideModal';
import { OfferRadarSection } from './OfferRadarSection';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';
import { getMsrDaysRemaining } from '../lib/msr';

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
  const addCard = useAppStore((s) => s.addCard);
  const deleteCard = useAppStore((s) => s.deleteCard);
  const updateCardBalance = useAppStore((s) => s.updateCardBalance);

  const [selectedIssuer, setSelectedIssuer] = useState<string>('All');
  const [spendInputCardId, setSpendInputCardId] = useState<string | null>(null);
  const [spendAmount, setSpendAmount] = useState<string>('');
  const [uploadingCardId, setUploadingCardId] = useState<string | null>(null);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isRetentionOpen, setIsRetentionOpen] = useState(false);
  const [isProductChangeOpen, setIsProductChangeOpen] = useState(false);
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);

  const issuers = ['All', 'Amex', 'Chase', 'Capital One', 'Citi', 'Bilt'];
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

  const handleDeleteCard = (card: CreditCard) => {
    if (window.confirm(`${t(language, 'cardDeleteConfirm')} (${card.name})`)) {
      deleteCard(card.id);
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

        <div className="flex flex-wrap items-center gap-3">
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

          {/* ATH Radar Toggle Button */}
          <button
            onClick={() => setIsRadarOpen(!isRadarOpen)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 active:scale-95 border ${
              isRadarOpen
                ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white border-rose-500 shadow-md shadow-rose-500/30'
                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>{language === 'en' ? 'ATH Radar' : '🔥 史高雷達'}</span>
          </button>

          {/* Safe Downgrade Guide Button */}
          <button
            onClick={() => setIsProductChangeOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold shadow-md shadow-emerald-500/10 flex items-center space-x-1.5 active:scale-95 transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'en' ? 'Downgrade Guide' : '🛡️ 降級保點向導'}</span>
          </button>

          {/* Retention Helper Button */}
          <button
            onClick={() => setIsRetentionOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold shadow-md shadow-amber-500/10 flex items-center space-x-1.5 active:scale-95 transition-all"
          >
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span>{t(language, 'retentionBtn')}</span>
          </button>

          {/* Add Card Button */}
          <button
            onClick={() => setIsAddCardOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t(language, 'addCardBtn')}</span>
          </button>
        </div>
      </div>

      {/* Render Offer Radar if toggled */}
      {isRadarOpen && <OfferRadarSection />}

      {/* Empty State */}
      {filteredCards.length === 0 && (
        <div className="glass-panel rounded-3xl p-12 border border-slate-800 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/30 rounded-3xl flex items-center justify-center mx-auto text-indigo-400">
            <Plus className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">{language === 'en' ? 'Your Card Wallet Is Currently Empty' : '您的卡包目前是空的'}</h3>
            <p className="text-xs text-slate-400">
              {language === 'en' ? 'Click the button below to add your first credit card, or load demo data to explore all the calculations.' : '點擊下方按鈕新增您持有的第一張信用卡，或載入示範數據體驗所有計算功能。'}
            </p>
          </div>
          <div className="flex justify-center space-x-3 pt-2">
            <button
              onClick={() => setIsAddCardOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'en' ? '+ Add Your First Card' : '+ 新增第一張卡片'}</span>
            </button>
          </div>
        </div>
      )}

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
                  className={`w-full h-48 rounded-2xl bg-gradient-to-br ${card.colorGradient} p-5 border shadow-xl flex flex-col justify-between relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-black/40 text-white/90 border border-white/10 text-[10px] font-bold rounded-full backdrop-blur-md">
                      {card.issuer} • {card.player} {t(language, 'cardHolder')}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white/40 tracking-widest uppercase">
                        {card.network}
                      </span>
                      <button
                        onClick={() => handleDeleteCard(card)}
                        title={t(language, 'deleteCard')}
                        className="p-1.5 rounded-lg bg-black/30 hover:bg-rose-500/80 text-white/60 hover:text-white transition-all backdrop-blur-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-extrabold text-white tracking-tight drop-shadow-md">
                    {card.name}
                  </h3>

                  <div className="flex items-end justify-between border-t border-white/10 pt-3">
                    <div className="flex items-center space-x-2">
                      <div>
                        <div className="text-[10px] text-white/60 font-medium">{t(language, 'cardCurrentPoints')}</div>
                        <div className="text-lg font-extrabold text-white tracking-wide">
                          {card.currentBalance.toLocaleString()} <span className="text-xs font-normal text-amber-300">{card.pointsCurrency || 'pts'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingCard(card)}
                        title={t(language, 'editBalance')}
                        className="p-1.5 rounded-lg bg-black/30 hover:bg-indigo-600 text-white/80 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
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
                      <span className="text-slate-300">{getMsrDaysRemaining(card)} {t(language, 'daysRemaining')}</span>
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

      {/* Add Card Modal */}
      <AddCardModal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        onAddCard={(newCard) => addCard(newCard)}
      />

      {/* Edit Balance Modal */}
      {editingCard && (
        <EditBalanceModal
          isOpen={Boolean(editingCard)}
          onClose={() => setEditingCard(null)}
          title={editingCard.name}
          subtitle={`${editingCard.issuer} • ${editingCard.player}`}
          currentBalance={editingCard.currentBalance}
          currencyName={editingCard.pointsCurrency || 'Points'}
          cppValue={editingCard.cppValue}
          onSave={(newBal) => updateCardBalance(editingCard.id, newBal)}
        />
      )}

      {/* Retention Helper Modal */}
      <RetentionHelperModal
        isOpen={isRetentionOpen}
        onClose={() => setIsRetentionOpen(false)}
      />

      {/* Product Change & Downgrade Guide Modal */}
      <ProductChangeGuideModal
        isOpen={isProductChangeOpen}
        onClose={() => setIsProductChangeOpen(false)}
      />
    </div>
  );
};
