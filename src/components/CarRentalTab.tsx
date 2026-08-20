import React, { useState } from 'react';
import { Car, ShieldCheck, ArrowRight, ExternalLink, Award, CheckCircle, Info } from 'lucide-react';
import { CarRentalProgram, UserProfile } from '../data/mockData';

interface CarRentalTabProps {
  cars: CarRentalProgram[];
  profile: UserProfile;
}

export const CarRentalTab: React.FC<CarRentalTabProps> = ({ cars, profile }) => {
  const [activeRentalCompany, setActiveRentalCompany] = useState<string>(cars[0]?.id || 'car-1');

  const filteredCars = cars.filter(
    (c) => profile.activePlayer === 'All' || c.player === profile.activePlayer
  );

  const selectedCar = cars.find((c) => c.id === activeRentalCompany) || cars[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Car className="w-5 h-5 text-emerald-400" />
            <span>租车会籍、Status Match 与 Primary CDW 车险助手</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            一键 Match 租车顶会（Hertz PC / National Exec / Avis PC），查询免费租车天数及信用卡主险 coverage。
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs text-emerald-300 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Status Match 会籍匹配路线已载入</span>
        </div>
      </div>

      {/* Grid of Rental Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <div
            key={car.id}
            onClick={() => setActiveRentalCompany(car.id)}
            className={`glass-panel rounded-3xl p-6 border transition-all cursor-pointer space-y-4 ${
              selectedCar?.id === car.id
                ? 'border-emerald-500/80 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-bold rounded-full">
                {car.player} 账户
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-full">
                👑 {car.statusTier}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white">{car.company}</h3>
              <div className="flex items-center space-x-4 mt-2 text-xs">
                <span className="text-slate-300">
                  点数余额: <strong className="text-emerald-400">{car.pointsBalance} pts</strong>
                </span>
                <span className="text-slate-300">
                  赠送天数: <strong className="text-amber-400">{car.freeDays} 天免费租车</strong>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Company Deep-Dive Details: Status Match Route & CDW Insurance */}
      {selectedCar && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Match Chain Interactive Guide */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {selectedCar.company} Status Match 会籍匹配路线
                </h3>
              </div>
              <span className="text-xs text-amber-300 font-semibold">互认免费升级</span>
            </div>

            <div className="space-y-4">
              {selectedCar.statusMatchRoutes.map((route, idx) => (
                <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">所需资格卡片 / 会籍</span>
                    <span className="text-amber-300 font-bold">{route.qualifyingCardOrStatus}</span>
                  </div>

                  <div className="flex items-center justify-center space-x-3 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-300 font-semibold">{route.qualifyingCardOrStatus.split('/')[0]}</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-emerald-300 font-bold">目标会籍: {route.targetTier}</span>
                  </div>

                  <div className="text-xs text-slate-300 leading-relaxed">
                    <strong>申请操作方法：</strong> {route.matchMethod}
                  </div>

                  <a
                    href={route.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-xl transition-all"
                  >
                    <span>直达官网匹配提交页面</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* CDW Auto Insurance Protection Guide */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">租车 Primary CDW 碰撞险保障卡</h3>
              </div>
              <span className="text-xs text-indigo-300 font-semibold">主险保护指南</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
                <div className="font-bold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>包含 Primary CDW (主险) 的信用卡</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedCar.cdwCoverage.primaryCards.map((card, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold rounded-lg"
                    >
                      {card}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="font-bold text-slate-300 flex items-center space-x-1">
                  <Info className="w-4 h-4 text-slate-400" />
                  <span>仅包含 Secondary CDW (次险) 的信用卡</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedCar.cdwCoverage.secondaryCards.map((card, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 font-medium rounded-lg"
                    >
                      {card}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-amber-300 text-[11px] leading-relaxed">
                <strong>理赔条款防坑提醒：</strong> {selectedCar.cdwCoverage.notes}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
