import React, { useState } from 'react';
import { ArrowRightLeft, Sparkles, Zap, Calculator, Plane, Building2, Search } from 'lucide-react';
import { TransferPartner, MOCK_TRANSFER_PARTNERS } from '../data/mockData';

export const TransferMatrixTab: React.FC = () => {
  const [selectedBank, setSelectedBank] = useState<string>('All');
  const [selectedAlliance, setSelectedAlliance] = useState<string>('All');
  const [inputAmount, setInputAmount] = useState<number>(50000);

  const banks = ['All', 'Chase UR', 'Amex MR', 'Capital One', 'Bilt Rewards'];
  const alliances = ['All', 'Star Alliance', 'Oneworld', 'SkyTeam', 'Hotel'];

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
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <ArrowRightLeft className="w-5 h-5 text-rose-400" />
            <span>四大银行点数转点伙伴矩阵 & Transfer Bonus 加赠监控</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            查询 Chase UR, Amex MR, Citi, CapOne 及 Bilt 转接航空公司与酒店的比例、到账速度与限时加赠。
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl text-xs text-rose-300 font-bold animate-pulse">
          <Zap className="w-4 h-4 text-rose-400" />
          <span>当前有 2 个限时 Bonus 转点加赠！</span>
        </div>
      </div>

      {/* Interactive Transfer Calculator Bar */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
        <div className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">转点数量换算计算器 (Transfer Calculator)</h3>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-1/3 space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">准备转出的银行点数 (Bank Points)</label>
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
              <div className="text-[10px] text-slate-400">转接 Hyatt / United (1:1)</div>
              <div className="text-base font-extrabold text-sky-300 mt-0.5">
                {inputAmount.toLocaleString()} <span className="text-xs font-normal">里程/积分</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-rose-500/30">
              <div className="text-[10px] text-rose-300 font-semibold">转 Virgin Atlantic (+30% Bonus)</div>
              <div className="text-base font-extrabold text-rose-400 mt-0.5">
                {Math.round(inputAmount * 1.3).toLocaleString()} <span className="text-xs font-normal">里程</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel rounded-2xl p-4 border border-slate-800">
        {/* Bank Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 mr-2">银行体系:</span>
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
          <span className="text-xs font-bold text-slate-400 mr-2">航空联盟/酒店:</span>
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
                  标准转点比例: <strong className="text-white">{partner.ratio}</strong>
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
                <span>到账速度: {partner.transferTime}</span>
                <span>比例 1:1</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
