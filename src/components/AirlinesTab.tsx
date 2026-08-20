import { useState } from 'react';
import { Plane, AlertTriangle, CheckCircle2, Ticket, Sparkles, Clock, ExternalLink } from 'lucide-react';
import type { AirlineProgram, UserProfile } from '../data/mockData';

interface AirlinesTabProps {
  airlines: AirlineProgram[];
  profile: UserProfile;
}

export const AirlinesTab: React.FC<AirlinesTabProps> = ({ airlines, profile }) => {
  const [selectedAlliance, setSelectedAlliance] = useState<string>('All');

  const filteredAirlines = airlines.filter((air) => {
    const matchesPlayer = profile.activePlayer === 'All' || air.player === profile.activePlayer;
    const matchesAlliance = selectedAlliance === 'All' || air.alliance === selectedAlliance;
    return matchesPlayer && matchesAlliance;
  });

  const totalMiles = filteredAirlines.reduce((sum, a) => sum + a.milesBalance, 0);
  const totalValue = filteredAirlines.reduce((sum, a) => sum + (a.milesBalance * a.cppValue) / 100, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Plane className="w-5 h-5 text-sky-400" />
            <span>航空公司飞行里程 & 伴飞券 (Companion Pass) 中心</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            真实公认估值 (CPP)、星空/寰宇/天合联盟贵宾会籍、买一送一伴飞券进度与里程过期风险防范。
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
          <div className="text-right">
            <div className="text-[10px] text-slate-400">里程总数</div>
            <div className="text-sm font-extrabold text-sky-300">
              {totalMiles.toLocaleString()} <span className="text-xs font-normal">Miles</span>
            </div>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-right">
            <div className="text-[10px] text-slate-400">折合美金价值</div>
            <div className="text-sm font-extrabold text-emerald-400">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Alliance Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel rounded-2xl p-4 border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 mr-2">三大航空联盟:</span>
          {['All', 'Star Alliance', 'Oneworld', 'SkyTeam', 'Independent'].map((a) => (
            <button
              key={a}
              onClick={() => setSelectedAlliance(a)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedAlliance === a
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {a === 'All' ? '全部联盟' : a}
            </button>
          ))}
        </div>

        <div className="text-xs text-amber-300 flex items-center space-x-1 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>采用 Frequent Miler / AwardWallet 2026 真实估值</span>
        </div>
      </div>

      {/* Airlines Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAirlines.map((air) => {
          const valueDollars = (air.milesBalance * air.cppValue) / 100;
          return (
            <div
              key={air.id}
              className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5 flex flex-col justify-between"
            >
              {/* Airline Card Banner */}
              <div className="space-y-4">
                <div
                  className={`w-full p-4 rounded-2xl bg-gradient-to-r ${air.brandColor} border border-white/10 shadow-lg flex items-center justify-between`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] uppercase font-bold text-white/70 tracking-wider">
                        {air.code} • {air.player} 账户
                      </span>
                      <span className="px-2 py-0.5 bg-black/40 text-white/90 border border-white/10 text-[10px] font-semibold rounded">
                        {air.alliance}
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-white mt-1">{air.name}</h3>
                    <div className="inline-block mt-1 px-2.5 py-0.5 bg-black/40 text-amber-300 border border-amber-400/30 text-xs font-bold rounded-full backdrop-blur-md">
                      ✈️ {air.statusTier}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-white/70 font-medium">里程余额</div>
                    <div className="text-xl font-extrabold text-white">
                      {air.milesBalance.toLocaleString()} <span className="text-xs font-normal text-sky-200">miles</span>
                    </div>
                    <div className="text-xs text-emerald-300 font-semibold mt-0.5">
                      ~${valueDollars.toFixed(0)} ({air.cppValue}c/mile)
                    </div>
                  </div>
                </div>

                {/* Mileage Expiration Warning Engine */}
                <div
                  className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between ${
                    air.isExpirationWarning
                      ? 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {air.isExpirationWarning ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                    )}
                    <span>过期规则: {air.expirationPolicy}</span>
                  </div>

                  {air.expirationDate && (
                    <span className="font-bold text-rose-400">{air.expirationDate} 到期风险</span>
                  )}
                </div>

                {/* Companion Pass / Certificate Section if present */}
                {air.companionPass && (
                  <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-amber-300 flex items-center space-x-1">
                        <Ticket className="w-4 h-4 text-amber-400" />
                        <span>{air.companionPass.title}</span>
                      </span>
                      <span className="text-slate-300">到期日: {air.companionPass.expiryDate}</span>
                    </div>

                    {!air.companionPass.isUnlocked && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-300">
                          <span>已积累 {air.companionPass.currentProgress.toLocaleString()} pts</span>
                          <span>目标 {air.companionPass.targetProgress.toLocaleString()} pts</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round((air.companionPass.currentProgress / air.companionPass.targetProgress) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                        <div className="text-[10px] text-amber-300 text-right">
                          还需差 {(air.companionPass.targetProgress - air.companionPass.currentProgress).toLocaleString()} 分锁定全年买一送一！
                        </div>
                      </div>
                    )}

                    {air.companionPass.isUnlocked && (
                      <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 font-bold flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>伴飞券已解锁生效中（预订时输入 Companion Code 即可自带伴飞）</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Key Status Perks */}
                <div className="space-y-1.5 border-t border-slate-800 pt-3">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    会籍贵宾专属权益 (Status Benefits)
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {air.perks.map((perk, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
