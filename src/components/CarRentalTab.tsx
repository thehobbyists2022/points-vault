import React, { useState } from 'react';
import { Car, ShieldCheck, ArrowRight, ExternalLink, Award, CheckCircle, Info, Copy, Edit2, Check, X, Pencil } from 'lucide-react';
import { CarRentalProgram, UserProfile, CAR_TIER_OPTIONS } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';

interface CarRentalTabProps {
  cars: CarRentalProgram[];
  profile: UserProfile;
}

export const CarRentalTab: React.FC<CarRentalTabProps> = ({ cars, profile }) => {
  const setCarMemberNumber = useAppStore((s) => s.setCarMemberNumber);
  const setCarPointsBalance = useAppStore((s) => s.setCarPointsBalance);
  const setCarFreeDays = useAppStore((s) => s.setCarFreeDays);
  const setCarStatusTier = useAppStore((s) => s.setCarStatusTier);
  const language = useAppStore((s) => s.language);

  const [activeRentalCompany, setActiveRentalCompany] = useState<string>(cars[0]?.id || 'car-1');
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberInput, setMemberInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [editingBalanceId, setEditingBalanceId] = useState<string | null>(null);
  const [balanceInput, setBalanceInput] = useState('');
  const [daysInput, setDaysInput] = useState('');

  // Deduplicate cars by id to prevent any duplicate rendering
  const dedupedCars = Array.from(new Map(cars.map((c) => [c.id, c])).values());

  const filteredCars = dedupedCars.filter(
    (c) => profile.activePlayer === 'All' || c.player === profile.activePlayer
  );

  const selectedCar = dedupedCars.find((c) => c.id === activeRentalCompany) || dedupedCars[0];

  const handleCopy = (id: string, num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveMember = (id: string) => {
    setCarMemberNumber(id, memberInput.trim());
    setEditingMemberId(null);
  };

  const handleSaveBalance = (id: string) => {
    const pts = parseInt(balanceInput, 10);
    const days = parseInt(daysInput, 10);
    if (!isNaN(pts)) setCarPointsBalance(id, pts);
    if (!isNaN(days)) setCarFreeDays(id, days);
    setEditingBalanceId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Car className="w-5 h-5 text-emerald-400" />
            <span>{language === 'en' ? 'Rental Status, Status Match & Primary CDW Insurance Assistant' : '租车会籍、Status Match 与 Primary CDW 车险助手'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'en' ? 'One-click Match rental top status (Hertz PC / National Exec / Avis PC / Enterprise / Budget), manage member card numbers and free rental days.' : '一键 Match 租车顶会（Hertz PC / National Exec / Avis PC / Enterprise / Budget），管理会员卡号与免费租车天数。'}
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs text-emerald-300 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>{language === 'en' ? 'All 5 Major US Rental Memberships Connected' : '全美 5 大租车会员已连接'}</span>
        </div>
      </div>

      {/* Grid of Rental Companies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <div
            key={car.id}
            onClick={() => setActiveRentalCompany(car.id)}
            className={`glass-panel rounded-3xl p-5 border transition-all cursor-pointer space-y-4 flex flex-col justify-between ${
              selectedCar?.id === car.id
                ? 'border-emerald-500/80 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-bold rounded-full">
                  {car.player} {language === 'en' ? 'account' : '账户'}
                </span>
                <select
                  value={car.statusTier}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setCarStatusTier(car.id, e.target.value)}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-xl px-2 py-0.5 cursor-pointer focus:outline-none focus:border-emerald-400 transition-all"
                  title={language === 'en' ? 'Click to switch my actual rental status' : '點擊切換我的真實租車會籍'}
                >
                  {(CAR_TIER_OPTIONS[car.id] || [car.statusTier]).map((tier) => (
                    <option key={tier} value={tier} className="bg-slate-900 text-white font-normal">
                      👑 {tier}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white">
                  {language === 'en' && car.companyEn ? car.companyEn : car.company}
                </h3>
                
                {/* Member ID display */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400 font-medium">{language === 'en' ? 'Member card #:' : '会员卡号:'}</span>
                  {editingMemberId === car.id ? (
                    <div className="flex items-center space-x-1">
                      <input
                        autoFocus
                        type="text"
                        value={memberInput}
                        onChange={(e) => setMemberInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveMember(car.id);
                          if (e.key === 'Escape') setEditingMemberId(null);
                        }}
                        className="bg-slate-950 border border-slate-700 px-2 py-0.5 rounded text-white text-xs font-mono font-bold w-28 focus:outline-none focus:border-emerald-400"
                      />
                      <button onClick={() => handleSaveMember(car.id)} className="text-emerald-400 p-0.5"><Check className="w-3 h-3" /></button>
                      <button onClick={() => setEditingMemberId(null)} className="text-rose-400 p-0.5"><X className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5">
                      <span className="font-mono font-bold text-slate-200">{car.memberNumber || (language === 'en' ? 'Not set' : '未填')}</span>
                      {car.memberNumber && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(car.id, car.memberNumber!);
                          }}
                          title={language === 'en' ? 'Copy card number' : '复制卡号'}
                          className="text-slate-400 hover:text-emerald-300 p-0.5"
                        >
                          {copiedId === car.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingMemberId(car.id);
                          setMemberInput(car.memberNumber || '');
                        }}
                        title={language === 'en' ? 'Edit card number' : '修改卡号'}
                        className="text-slate-500 hover:text-white p-0.5"
                      >
                        <Edit2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Points and Free Days */}
                <div className="flex items-center justify-between mt-1 text-xs">
                  <span className="text-slate-400">{language === 'en' ? 'Points / Days:' : '点数 / 天数:'}</span>
                  {editingBalanceId === car.id ? (
                    <div className="flex items-center space-x-1.5">
                      <input
                        autoFocus
                        type="number"
                        min="0"
                        value={balanceInput}
                        onChange={(e) => setBalanceInput(e.target.value)}
                        placeholder="pts"
                        className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-0.5 text-emerald-400 font-bold text-xs focus:outline-none focus:border-emerald-500"
                      />
                      <input
                        type="number"
                        min="0"
                        value={daysInput}
                        onChange={(e) => setDaysInput(e.target.value)}
                        placeholder="days"
                        className="w-14 bg-slate-950 border border-slate-700 rounded-lg px-2 py-0.5 text-amber-300 font-bold text-xs focus:outline-none focus:border-amber-500"
                      />
                      <button onClick={() => handleSaveBalance(car.id)} className="text-emerald-400 p-0.5 hover:text-emerald-300" title={language === 'en' ? 'Save' : '保存'}>
                        <Check className="w-3 h-3" />
                      </button>
                      <button onClick={() => setEditingBalanceId(null)} className="text-rose-400 p-0.5 hover:text-rose-300" title={language === 'en' ? 'Cancel' : '取消'}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-emerald-400 font-bold">{car.pointsBalance} pts</span>
                      <span className="text-slate-600">|</span>
                      <span className="text-amber-300 font-bold">{car.freeDays} {language === 'en' ? 'days free' : '天免费'}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingBalanceId(car.id);
                          setBalanceInput(String(car.pointsBalance));
                          setDaysInput(String(car.freeDays));
                        }}
                        className="text-slate-500 hover:text-white p-0.5"
                        title={language === 'en' ? 'Edit points & bonus days' : '修改点数与赠送天数'}
                      >
                        <Pencil className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Portal Link */}
            {car.portalUrl && (
              <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                <a
                  href={car.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Login & check points' : '官網登入查點'}</span>
                </a>
              </div>
            )}
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
                  {language === 'en' && selectedCar.companyEn ? selectedCar.companyEn : selectedCar.company} {language === 'en' ? 'Status Match Route' : 'Status Match 会籍匹配路线'}
                </h3>
              </div>
              <span className="text-xs text-amber-300 font-semibold">{language === 'en' ? 'Reciprocal Free Upgrade' : '互认免费升级'}</span>
            </div>

            <div className="space-y-4">
              {selectedCar.statusMatchRoutes.map((route, idx) => (
                <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{language === 'en' ? 'Required Qualifying Card / Status' : '所需资格卡片 / 会籍'}</span>
                    <span className="text-amber-300 font-bold">{route.qualifyingCardOrStatus}</span>
                  </div>

                  <div className="flex items-center justify-center space-x-3 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-300 font-semibold">{route.qualifyingCardOrStatus.split('/')[0]}</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-emerald-300 font-bold">{language === 'en' ? 'Target tier:' : '目标会籍:'} {route.targetTier}</span>
                  </div>

                  <div className="text-xs text-slate-300 leading-relaxed">
                    <strong>{language === 'en' ? 'How to apply:' : '申请操作方法：'}</strong> {route.matchMethod}
                  </div>

                  <a
                    href={route.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-xl transition-all"
                  >
                    <span>{language === 'en' ? 'Go to official match submission page' : '直达官网匹配提交页面'}</span>
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
                <h3 className="text-base font-bold text-white">{language === 'en' ? 'Rental Primary CDW Collision Coverage Card' : '租车 Primary CDW 碰撞险保障卡'}</h3>
              </div>
              <span className="text-xs text-indigo-300 font-semibold">{language === 'en' ? 'Primary Insurance Protection Guide' : '主险保护指南'}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
                <div className="font-bold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>{language === 'en' ? 'Cards with Primary CDW coverage' : '包含 Primary CDW (主险) 的信用卡'}</span>
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
                  <span>{language === 'en' ? 'Cards with Secondary CDW coverage only' : '仅包含 Secondary CDW (次险) 的信用卡'}</span>
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
                <strong>{language === 'en' ? 'Claims pitfalls to watch:' : '理赔条款防坑提醒：'}</strong> {selectedCar.cdwCoverage.notes}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
