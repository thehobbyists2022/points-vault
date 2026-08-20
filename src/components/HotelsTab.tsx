import React from 'react';
import { Building2, Award, Clock, Calendar, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { HotelProgram, UserProfile } from '../data/mockData';

interface HotelsTabProps {
  hotels: HotelProgram[];
  profile: UserProfile;
}

export const HotelsTab: React.FC<HotelsTabProps> = ({ hotels, profile }) => {
  const filteredHotels = hotels.filter(
    (h) => profile.activePlayer === 'All' || h.player === profile.activePlayer
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-sky-400" />
            <span>酒店常旅客计划 & 免房券 (FNC) 中心</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            监控 Hyatt, Marriott Bonvoy, Hilton Honors 尊贵会籍房晚、积分储备与 FNC 过期日。
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-sky-500/10 border border-sky-500/20 px-3.5 py-2 rounded-xl">
          <Award className="w-4 h-4 text-sky-400" />
          <span className="text-xs text-sky-300 font-semibold">
            高级会籍福利保护生效中
          </span>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => {
          const pointsValue = (hotel.pointsBalance * hotel.cppValue) / 100;
          return (
            <div
              key={hotel.id}
              className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-5 flex flex-col justify-between"
            >
              {/* Top Program Badge Banner */}
              <div className="space-y-4">
                <div
                  className={`w-full p-4 rounded-2xl bg-gradient-to-r ${hotel.brandColor} shadow-lg border border-white/10 flex items-center justify-between`}
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/70 tracking-wider">
                      {hotel.player} 账户
                    </span>
                    <h3 className="text-lg font-extrabold text-white">{hotel.name}</h3>
                    <div className="inline-block mt-1 px-2.5 py-0.5 bg-black/40 text-amber-300 border border-amber-400/30 text-xs font-bold rounded-full backdrop-blur-md">
                      👑 {hotel.statusTier}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-white/70 font-medium">积分余额</div>
                    <div className="text-lg font-extrabold text-white">
                      {hotel.pointsBalance.toLocaleString()} <span className="text-xs font-normal text-sky-200">pts</span>
                    </div>
                    <div className="text-xs text-emerald-300 font-semibold mt-0.5">
                      ~${pointsValue.toFixed(0)} ({hotel.cppValue}c/pt)
                    </div>
                  </div>
                </div>

                {/* Night Progress Bar */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>今年已入住房晚: {hotel.nightsThisYear} 晚</span>
                    <span>距离下一保级还差: {hotel.nightsToNextTier} 晚</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-400 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((hotel.nightsThisYear / (hotel.nightsThisYear + hotel.nightsToNextTier)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Free Night Certificates (FNC) Section */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-sky-400" />
                      <span>免房券证书 (Free Night Certificates)</span>
                    </span>
                    <span className="text-sky-300 font-semibold">{hotel.fncs.length} 张</span>
                  </div>

                  <div className="space-y-2">
                    {hotel.fncs.map((fnc) => (
                      <div
                        key={fnc.id}
                        className={`p-3 rounded-xl border text-xs space-y-1 ${
                          fnc.isUsed
                            ? 'bg-slate-950/40 border-slate-800 text-slate-500 line-through'
                            : 'bg-slate-900/90 border-slate-700/80 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{fnc.title}</span>
                          <span className="px-2 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-semibold rounded">
                            {fnc.categoryLimit}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                          <span className="flex items-center space-x-1 text-rose-400 font-semibold">
                            <Clock className="w-3 h-3" />
                            <span>到期日: {fnc.expirationDate}</span>
                          </span>
                          <span>{fnc.isUsed ? '已兑换住宿' : '状态: 激活可用'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Status Perks List */}
                <div className="space-y-1.5 border-t border-slate-800 pt-3">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    会籍核心尊享权益 (Elite Perks)
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {hotel.perks.map((perk, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
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
