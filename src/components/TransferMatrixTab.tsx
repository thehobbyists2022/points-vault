import React, { useState } from 'react';
import { ArrowRightLeft, Sparkles, Zap, Calculator, Plane, Building2, Target, Tag } from 'lucide-react';
import { MOCK_TRANSFER_PARTNERS } from '../data/mockData';
import { AwardGoalsSection } from './AwardGoalsSection';
import { BuyPointsCalculator } from './BuyPointsCalculator';
import { useAppStore } from '../store/useAppStore';

export const TransferMatrixTab: React.FC = () => {
  const language = useAppStore((s) => s.language);
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'goals' | 'buypoints'>('matrix');
  const [selectedBank, setSelectedBank] = useState<string>('All');
  const [selectedAlliance, setSelectedAlliance] = useState<string>('All');
  const [inputAmount, setInputAmount] = useState<number>(50000);

  const banks = ['All', 'Chase UR', 'Amex MR', 'Capital One', 'Citi TYP', 'Bilt Rewards'];
  const alliances = ['All', 'Star Alliance', 'Oneworld', 'SkyTeam', 'Hotel'];

  const activeBonusCount = MOCK_TRANSFER_PARTNERS.filter((p) => Boolean(p.currentBonus)).length;

  const filteredPartners = MOCK_TRANSFER_PARTNERS.filter((partner) => {
    const matchesBank = selectedBank === 'All' || partner.bankCurrency === selectedBank;
    const matchesAlliance =
      selectedAlliance === 'All'
        ? true
        : selectedAlliance === 'Hotel'
        ? partner.partnerType === 'Hotel'
        : partner.alliance === selectedAlliance;
    return matchesBank && matchesAlliance;
  });

  return (
    <div className="space-y-6">
      {/* Sub-Tab Navigation Switcher */}
      <div className="flex flex-wrap items-center gap-3 glass-panel rounded-2xl p-2.5 border border-slate-800 bg-slate-950/80">
        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'matrix'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>{language === 'en' ? 'Transfer Partners Matrix' : '轉點夥伴矩陣 & 加贈'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('goals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'goals'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>{language === 'en' ? '🎯 Award Sweet Spot Goals' : '🎯 甜點兌換目標達成器'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('buypoints')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'buypoints'
              ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>{language === 'en' ? '🏷️ Buy Points Promotions' : '🏷️ 官方特惠買分計算器'}</span>
        </button>
      </div>

      {activeSubTab === 'goals' && <AwardGoalsSection />}
      {activeSubTab === 'buypoints' && <BuyPointsCalculator />}

      {activeSubTab === 'matrix' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <ArrowRightLeft className="w-5 h-5 text-rose-400" />
                <span>{language === 'en' ? 'Transfer Partners Matrix & Transfer Bonus Tracker' : '四大銀行點數轉點夥伴矩陣 & Transfer Bonus 加贈監控'}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'en' ? 'Compare transfer ratios, instant speeds, and active promotional bonuses for Chase UR, Amex MR, Capital One, Citi TYP, and Bilt.' : '查詢 Chase UR, Amex MR, Citi, CapOne 及 Bilt 轉接航空公司與酒店的比例、到賬速度與限時加贈。'}
              </p>
            </div>

            {activeBonusCount > 0 && (
              <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl text-xs text-rose-300 font-bold animate-pulse">
                <Zap className="w-4 h-4 text-rose-400" />
                <span>{language === 'en' ? `${activeBonusCount} Active Transfer Bonuses Available!` : `當前有 ${activeBonusCount} 個限時 Bonus 轉點加贈！`}</span>
              </div>
            )}
          </div>

          {/* Interactive Transfer Calculator Bar */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">{language === 'en' ? 'Transfer Points Calculator' : '轉點數量換算計算器 (Transfer Calculator)'}</h3>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-1/3 space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">{language === 'en' ? 'Bank Points to Transfer' : '準備轉出的銀行點數 (Bank Points)'}</label>
                <input
                  type="number"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-950 border border-slate-700 text-white font-bold text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="hidden sm:flex items-center justify-center pt-5 text-slate-500">
                <ArrowRightLeft className="w-5 h-5" />
              </div>

              <div className="w-full sm:w-2/3 grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">{language === 'en' ? 'Transfer to Hyatt / United (1:1)' : '轉接 Hyatt / United (1:1)'}</div>
                  <div className="text-base font-extrabold text-sky-300 mt-0.5">
                    {inputAmount.toLocaleString()} <span className="text-xs font-normal">{language === 'en' ? 'miles/points' : '哩程/積分'}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-rose-500/30">
                  <div className="text-[10px] text-rose-300 font-semibold">{language === 'en' ? 'Transfer to Virgin Atlantic (+30% Bonus)' : '轉 Virgin Atlantic (+30% Bonus)'}</div>
                  <div className="text-base font-extrabold text-rose-400 mt-0.5">
                    {Math.round(inputAmount * 1.3).toLocaleString()} <span className="text-xs font-normal">{language === 'en' ? 'miles' : '哩程'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 glass-panel rounded-2xl p-4 border border-slate-800">
            {/* Bank Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 mr-2">{language === 'en' ? 'Bank System:' : '銀行體系:'}</span>
              {banks.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBank(b)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedBank === b
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            {/* Alliance Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 mr-2">{language === 'en' ? 'Airline Alliance / Hotel:' : '航空聯盟/酒店:'}</span>
              {alliances.map((a) => (
                <button
                  key={a}
                  onClick={() => setSelectedAlliance(a)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedAlliance === a
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Transfer Partners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPartners.map((partner, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3 hover:border-rose-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-bold rounded">
                      {partner.bankCurrency}
                    </span>
                    {partner.alliance && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        {partner.alliance}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white flex items-center space-x-1.5">
                      {partner.partnerType === 'Airline' ? (
                        <Plane className="w-4 h-4 text-sky-400 shrink-0" />
                      ) : (
                        <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span>{partner.partnerName}</span>
                    </h4>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {language === 'en' ? 'Standard transfer ratio:' : '標準轉點比例:'} <strong className="text-white">{partner.ratio}</strong>
                    </div>
                  </div>
                </div>

                {/* Bonus Alert Badge */}
                {partner.currentBonus ? (
                  <div className="p-2.5 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300 font-bold flex items-center space-x-1.5 animate-pulse">
                    <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{partner.currentBonus}</span>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-800">
                    <span>{language === 'en' ? 'Transfer speed:' : '到賬速度:'} {partner.transferTime}</span>
                    <span>{language === 'en' ? 'Ratio 1:1' : '比例 1:1'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
