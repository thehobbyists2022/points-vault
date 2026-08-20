import React, { useState } from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { CreditCard, UserProfile } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';

interface MerchantFinderTabProps {
  cards: CreditCard[];
  profile: UserProfile;
}

interface CategoryOption {
  id: string;
  name: string;
  icon: string;
  exampleMerchants: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'dining', name: '餐厅与外卖 (Dining & Restaurants)', icon: '🍽️', exampleMerchants: 'UberEats, DoorDash, Starbucks, Local Restaurants' },
  { id: 'grocery', name: '超市采购 (US Supermarkets)', icon: '🛒', exampleMerchants: 'Whole Foods, Trader Joe\'s, Instacart, Kroger' },
  { id: 'flights', name: '机票预订 (Flights Direct/Amex)', icon: '✈️', exampleMerchants: 'United, Delta, American Airlines, Amex Travel' },
  { id: 'hotels', name: '酒店住宿 (Prepaid Hotels)', icon: '🏨', exampleMerchants: 'Hyatt, Marriott, Hilton, Travel Portals' },
  { id: 'rent', name: '房屋租金 (Rent Payments)', icon: '🏠', exampleMerchants: 'Bilt Rent, Property Management Portals' },
  { id: 'gas', name: '加油站 (Gas Stations)', icon: '⛽', exampleMerchants: 'Shell, Chevron, Exxon Mobil' },
  { id: 'transit', name: '打车与公交 (Transit & Rideshare)', icon: '🚖', exampleMerchants: 'Uber, Lyft, Subways, Tolls' },
  { id: 'general', name: '日常无类别消费 (Everyday Shopping)', icon: '📦', exampleMerchants: 'Amazon, Target, Utility Bills' },
];

// Word-boundary keywords per category so "Travel" never matches "Transit"
// (e.g. "Hotels & Rental Cars (Chase Travel)" is not a transit multiplier).
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  dining: ['restaurant', 'dining'],
  grocery: ['supermarket', 'grocery'],
  flights: ['flight', 'airline', 'airfare'],
  hotels: ['hotel'],
  rent: ['rent'],
  gas: ['gas'],
  transit: ['transit', 'rideshare', 'uber', 'lyft', 'subway', 'commuter', 'toll', 'metro', 'rail', 'bus', 'transportation'],
  general: ['all other', 'everyday', 'other purchase'],
};

const GENERAL_KEYWORDS = ['all other', 'everyday', 'other purchase'];

function matchesKeywords(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`).test(lower);
  });
}

function matchesGeneral(text: string): boolean {
  return matchesKeywords(text, GENERAL_KEYWORDS);
}

export const MerchantFinderTab: React.FC<MerchantFinderTabProps> = ({ cards, profile }) => {
  const language = useAppStore((s) => s.language);
  const [selectedCategory, setSelectedCategory] = useState<string>('dining');
  const [purchaseAmount, setPurchaseAmount] = useState<number>(100);

  const filteredCards = cards.filter(
    (c) => profile.activePlayer === 'All' || c.player === profile.activePlayer
  );

  // Compute best card calculation
  const rankedCards = filteredCards
    .map((card) => {
      // Find multiplier match (category-specific first, then everyday fallback)
      let matchedMultiplier = 1;
      let hasCategoryMatch = false;

      card.multipliers.forEach((m) => {
        const categoryMatches =
          selectedCategory === 'general'
            ? matchesGeneral(m.category)
            : matchesKeywords(m.category, CATEGORY_KEYWORDS[selectedCategory] ?? []);

        if (categoryMatches) {
          matchedMultiplier = Math.max(matchedMultiplier, m.rate);
          hasCategoryMatch = true;
        }
      });

      // Fallback: use the card's everyday rate only when no category matched
      if (!hasCategoryMatch && selectedCategory !== 'general') {
        card.multipliers.forEach((m) => {
          if (matchesGeneral(m.category)) {
            matchedMultiplier = Math.max(matchedMultiplier, m.rate);
          }
        });
      }

      const totalPointsEarned = purchaseAmount * matchedMultiplier;
      const dollarValueEarned = (totalPointsEarned * card.cppValue) / 100;
      const effectiveReturnPct = (dollarValueEarned / purchaseAmount) * 100;

      return {
        card,
        matchedMultiplier,
        totalPointsEarned,
        dollarValueEarned,
        effectiveReturnPct,
      };
    })
    .sort((a, b) => b.dollarValueEarned - a.dollarValueEarned);

  const bestOption = rankedCards[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
            <span>{t(language, 'finderTitle')} ({t(language, 'finderBestCardEngine')})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t(language, 'finderDesc')}
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-2 rounded-xl">
          <span className="text-xs text-slate-400">{t(language, 'finderAmountLabel')}:</span>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-amber-400 font-bold">$</span>
            <input
              type="number"
              value={purchaseAmount}
              onChange={(e) => setPurchaseAmount(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-20 bg-slate-950 border border-slate-700 text-white font-bold text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Category Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="text-2xl mb-1">{cat.icon}</div>
            <div>
              <div className="text-xs font-bold">{cat.name.split(' ')[0]}</div>
              <div className="text-[10px] text-slate-400 line-clamp-1">{cat.exampleMerchants}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Best Recommendation Highlight Box */}
      {bestOption && (
        <div className="glass-panel rounded-3xl p-6 border border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-slate-900 to-indigo-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                {t(language, 'optimalCard')} (#1 {t(language, 'finderRecommendLabel')})
              </span>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-full">
              {t(language, 'finderEffectiveReturn')} ~{bestOption.effectiveReturnPct.toFixed(1)}%
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-slate-800 pt-4">
            <div className="space-y-1">
              <div className="text-xs text-slate-400">{t(language, 'finderUseThisCard')}:</div>
              <h3 className="text-2xl font-extrabold text-white">{bestOption.card.name}</h3>
              <div className="text-xs text-indigo-300 font-medium">
                {t(language, 'finderCardholder')}: {bestOption.card.player} • {t(language, 'finderBaseRate')}: {bestOption.card.pointsCurrency}
              </div>
            </div>

            <div className="flex items-center space-x-6 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              <div className="text-center">
                <div className="text-[11px] text-slate-400">{t(language, 'finderMultiplier')}</div>
                <div className="text-xl font-extrabold text-amber-400">{bestOption.matchedMultiplier}x</div>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-center">
                <div className="text-[11px] text-slate-400">{t(language, 'finderPtsEarned')}</div>
                <div className="text-xl font-extrabold text-white">{bestOption.totalPointsEarned.toLocaleString()} {t(language, 'finderPoints')}</div>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-center">
                <div className="text-[11px] text-slate-400">{t(language, 'finderUsdValue')}</div>
                <div className="text-xl font-extrabold text-emerald-400">${bestOption.dollarValueEarned.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Ranked Cards Table */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white">{t(language, 'finderRankedList')}</h3>
        <div className="space-y-2">
          {rankedCards.map((item, index) => (
            <div
              key={item.card.id}
              className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs"
            >
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-[11px]">
                  #{index + 1}
                </span>
                <div>
                  <div className="font-bold text-white">{item.card.name}</div>
                  <div className="text-[11px] text-slate-400">{item.card.issuer} ({item.card.player})</div>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-right">
                <div>
                  <div className="font-bold text-amber-400">{item.matchedMultiplier}x {t(language, 'finderMultiplier')}</div>
                  <div className="text-[10px] text-slate-400">+{item.totalPointsEarned} {t(language, 'finderPoints')}</div>
                </div>
                <div>
                  <div className="font-bold text-emerald-400">${item.dollarValueEarned.toFixed(2)}</div>
                  <div className="text-[10px] text-slate-400">~{item.effectiveReturnPct.toFixed(1)}% {t(language, 'finderReturn')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
