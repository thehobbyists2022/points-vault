import React, { useState } from 'react';
import {
  Tag,
  Calculator,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { MOCK_BUY_POINTS_PROMOS } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';

interface BuyPointsCalculatorProps {
  className?: string;
}

export const BuyPointsCalculator: React.FC<BuyPointsCalculatorProps> = ({ className = '' }) => {
  const language = useAppStore((s) => s.language);
  const [selectedPromoId, setSelectedPromoId] = useState<string>(MOCK_BUY_POINTS_PROMOS[0]?.id || '');
  const [pointsNeeded, setPointsNeeded] = useState<number>(50000);
  const [cashPrice, setCashPrice] = useState<number>(1100);

  const selectedPromo = MOCK_BUY_POINTS_PROMOS.find((p) => p.id === selectedPromoId) || MOCK_BUY_POINTS_PROMOS[0];

  // Calculation Math
  const costToBuyUSD = selectedPromo ? (pointsNeeded * selectedPromo.promotionalPriceCpp) / 100 : 0;
  const standardCostUSD = selectedPromo ? (pointsNeeded * selectedPromo.standardPriceCpp) / 100 : 0;
  const netSavingsUSD = cashPrice - costToBuyUSD;
  const savingsPct = cashPrice > 0 ? Math.round((netSavingsUSD / cashPrice) * 100) : 0;
  const isWorthBuying = netSavingsUSD > 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 bg-gradient-to-r from-teal-950/40 via-slate-900 to-emerald-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-gradient-to-tr from-teal-500 to-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/20">
              <Tag className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-black text-white tracking-tight">
              {t(language, 'buyPointsTitle')}
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t(language, 'buyPointsDesc')}
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-2xl text-xs text-emerald-300 font-bold">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{language === 'en' ? 'Live Promos Tracked: 4 Deals' : '4 項進行中官方特惠買分'}</span>
        </div>
      </div>

      {/* Main Interactive Calculator Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Inputs (2 Columns) */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 border border-slate-800 space-y-5 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">
              {language === 'en' ? 'Interactive Buy Points vs Cash Comparator' : '買分兌換 vs 現金購票即時比價'}
            </h4>
          </div>

          {/* Program Select */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400">
              {language === 'en' ? 'Select Loyalty Program & Flash Promo' : '選擇特惠促銷計畫'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MOCK_BUY_POINTS_PROMOS.map((promo) => (
                <button
                  key={promo.id}
                  onClick={() => setSelectedPromoId(promo.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-1 ${
                    selectedPromoId === promo.id
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{promo.program}</span>
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {promo.bonusOrDiscountText}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>
                      {language === 'en' ? 'Cost' : '特惠成本'}: <strong className="text-white">{promo.promotionalPriceCpp}¢</strong>/pt
                    </span>
                    <span className="line-through text-slate-500">{promo.standardPriceCpp}¢</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
                <span>{t(language, 'ptsToBuy')}</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  value={pointsNeeded}
                  onChange={(e) => setPointsNeeded(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-950 border border-slate-700 text-white font-black text-base rounded-2xl px-4 py-2.5 focus:outline-none focus:border-emerald-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-semibold">
                  pts / miles
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1">
                <span>{t(language, 'cashCost')}</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={cashPrice}
                  onChange={(e) => setCashPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-950 border border-slate-700 text-white font-black text-base rounded-2xl pl-8 pr-4 py-2.5 focus:outline-none focus:border-emerald-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-semibold">
                  USD
                </span>
              </div>
            </div>
          </div>

          {/* Promo Context Tip */}
          {selectedPromo && (
            <div className="text-xs text-slate-400 bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-300 block">{language === 'en' ? 'Recommended Use Case' : '推薦使用時機'}:</span>
                <span>{selectedPromo.recommendedUse}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Result Card (1 Column) */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between space-y-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl">
          <div className="space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {language === 'en' ? 'Comparison Results' : '對比計算結論'}
            </span>

            {/* Total Buy Cost */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">{t(language, 'buyCost')}</span>
              <div className="text-2xl font-black text-white mt-0.5">
                ${costToBuyUSD.toFixed(2)} <span className="text-xs text-slate-500 font-normal">USD</span>
              </div>
              <div className="text-[10px] text-slate-500 line-through">
                Standard Price: ${standardCostUSD.toFixed(2)}
              </div>
            </div>

            {/* Net Savings Widget */}
            <div className={`p-4 rounded-2xl border ${
              isWorthBuying
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  {t(language, 'netSavings')}
                </span>
                <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-black/40">
                  {savingsPct > 0 ? `+${savingsPct}% ROI` : `${savingsPct}%`}
                </span>
              </div>

              <div className="text-3xl font-black mt-1">
                {isWorthBuying ? `+$${netSavingsUSD.toFixed(2)}` : `-$${Math.abs(netSavingsUSD).toFixed(2)}`}
              </div>

              <div className="flex items-center space-x-1 text-xs font-bold mt-2">
                {isWorthBuying ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{t(language, 'worthBuying')}</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>{t(language, 'notWorthBuying')}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Direct Buy Link */}
          {selectedPromo && (
            <a
              href={selectedPromo.directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all active:scale-98"
            >
              <span>{language === 'en' ? 'Go to Official Storefront' : '直達官網特惠買分頁面'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
