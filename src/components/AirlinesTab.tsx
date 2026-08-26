import { useState } from 'react';
import { Plane, AlertTriangle, CheckCircle2, Ticket, Sparkles, Clock, ExternalLink, Pencil, Check, X, Copy, Edit2 } from 'lucide-react';
import { AirlineProgram, UserProfile, AIRLINE_TIER_OPTIONS } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';

interface AirlinesTabProps {
  airlines: AirlineProgram[];
  profile: UserProfile;
  onUpdateBalance?: (id: string, balance: number) => void;
}

export const AirlinesTab: React.FC<AirlinesTabProps> = ({ airlines, profile, onUpdateBalance }) => {
  const setAirlineMemberNumber = useAppStore((s) => s.setAirlineMemberNumber);
  const setAirlineStatusTier = useAppStore((s) => s.setAirlineStatusTier);
  const language = useAppStore((s) => s.language);
  const [selectedAlliance, setSelectedAlliance] = useState<string>('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberNumberInput, setMemberNumberInput] = useState('');
  const [copiedMemberId, setCopiedMemberId] = useState<string | null>(null);

  const commitEdit = (id: string) => {
    const parsed = parseInt(editValue, 10);
    if (!isNaN(parsed) && parsed >= 0 && onUpdateBalance) {
      onUpdateBalance(id, parsed);
    }
    setEditingId(null);
    setEditValue('');
  };

  const commitMemberNumber = (id: string) => {
    setAirlineMemberNumber(id, memberNumberInput.trim());
    setEditingMemberId(null);
    setMemberNumberInput('');
  };

  const handleCopyMemberNumber = (id: string, num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedMemberId(id);
    setTimeout(() => setCopiedMemberId(null), 2000);
  };

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
            <span>{language === 'en' ? 'Airline Miles & Companion Pass Hub' : '航空公司飞行里程 & 伴飞券 (Companion Pass) 中心'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'en' ? 'Real recognized valuations (CPP), Star Alliance / Oneworld / SkyTeam elite status, Buy-One-Get-One companion pass progress, and mileage expiration risk protection.' : '真实公认估值 (CPP)、星空/寰宇/天合联盟贵宾会籍、买一送一伴飞券进度与里程过期风险防范。'}
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
          <div className="text-right">
            <div className="text-[10px] text-slate-400">{language === 'en' ? 'Total Miles' : '里程总数'}</div>
            <div className="text-sm font-extrabold text-sky-300">
              {totalMiles.toLocaleString()} <span className="text-xs font-normal">Miles</span>
            </div>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-right">
            <div className="text-[10px] text-slate-400">{language === 'en' ? 'USD Value' : '折合美金价值'}</div>
            <div className="text-sm font-extrabold text-emerald-400">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Alliance Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel rounded-2xl p-4 border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 mr-2">{language === 'en' ? 'Alliances:' : '三大航空联盟:'}</span>
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
              {a === 'All' ? (language === 'en' ? 'All Alliances' : '全部联盟') : a}
            </button>
          ))}
        </div>

        <div className="text-xs text-amber-300 flex items-center space-x-1 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'Based on Frequent Miler / AwardWallet 2026 real valuations' : '采用 Frequent Miler / AwardWallet 2026 真实估值'}</span>
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
                        {language === 'en' ? `${air.code} • ${air.player} Account` : `${air.code} • ${air.player} 账户`}
                      </span>
                      <span className="px-2 py-0.5 bg-black/40 text-white/90 border border-white/10 text-[10px] font-semibold rounded">
                        {air.alliance}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-white mt-1">
                      {language === 'en' && air.nameEn ? air.nameEn : air.name}
                    </h3>
                    <div className="mt-1.5 flex items-center space-x-1">
                      <select
                        value={air.statusTier}
                        onChange={(e) => setAirlineStatusTier(air.id, e.target.value)}
                        className="bg-black/50 hover:bg-black/70 text-amber-300 border border-amber-400/40 text-xs font-bold rounded-xl px-2 py-0.5 backdrop-blur-md cursor-pointer focus:outline-none focus:border-sky-300 transition-all"
                        title={language === 'en' ? 'Click to switch my real flight status' : '點擊切換我的真實飛行會籍'}
                      >
                        {(AIRLINE_TIER_OPTIONS[air.id] || [air.statusTier]).map((tier) => (
                          <option key={tier} value={tier} className="bg-slate-900 text-white font-normal">
                            ✈️ {tier}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-white/70 font-medium flex items-center justify-end space-x-1">
                      <span>{language === 'en' ? 'Mileage Balance' : '里程余额'}</span>
                      {onUpdateBalance && editingId !== air.id && (
                        <button
                          onClick={() => { setEditingId(air.id); setEditValue(String(air.milesBalance)); }}
                          className="opacity-60 hover:opacity-100 transition-opacity"
                          title={language === 'en' ? 'Update mileage balance' : '更新里程余额'}
                        >
                          <Pencil className="w-3 h-3 text-sky-200" />
                        </button>
                      )}
                    </div>
                    {editingId === air.id ? (
                      <div className="flex items-center justify-end space-x-1 mt-0.5">
                        <input
                          autoFocus
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEdit(air.id);
                            if (e.key === 'Escape') { setEditingId(null); setEditValue(''); }
                          }}
                          className="w-28 bg-black/50 border border-white/25 rounded-lg px-2 py-1 text-right text-lg font-extrabold text-white focus:outline-none focus:border-sky-400"
                        />
                        <button onClick={() => commitEdit(air.id)} className="p-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { setEditingId(null); setEditValue(''); }} className="p-1 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-300">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-xl font-extrabold text-white">
                        {air.milesBalance.toLocaleString()} <span className="text-xs font-normal text-sky-200">miles</span>
                      </div>
                    )}
                    <div className="text-xs text-emerald-300 font-semibold mt-0.5">
                      ~${valueDollars.toFixed(0)} ({air.cppValue}c/mile)
                    </div>
                  </div>
                </div>

                {/* Member ID & Official Portal Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
                  {/* Membership Number */}
                  <div className="flex items-center space-x-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl">
                    <span className="text-[11px] text-slate-400 font-medium">{language === 'en' ? 'Member Number:' : '会员卡号:'}</span>
                    {editingMemberId === air.id ? (
                      <div className="flex items-center space-x-1">
                        <input
                          autoFocus
                          type="text"
                          value={memberNumberInput}
                          onChange={(e) => setMemberNumberInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitMemberNumber(air.id);
                            if (e.key === 'Escape') setEditingMemberId(null);
                          }}
                          className="bg-slate-950 border border-slate-700 px-2 py-0.5 rounded text-white text-xs font-mono font-bold w-32 focus:outline-none focus:border-sky-400"
                        />
                        <button onClick={() => commitMemberNumber(air.id)} className="text-emerald-400 p-0.5"><Check className="w-3 h-3" /></button>
                        <button onClick={() => setEditingMemberId(null)} className="text-rose-400 p-0.5"><X className="w-3 h-3" /></button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono font-bold text-slate-200">{air.memberNumber || (language === 'en' ? 'Not set' : '未填写')}</span>
                        {air.memberNumber && (
                          <button
                            onClick={() => handleCopyMemberNumber(air.id, air.memberNumber!)}
                            title={language === 'en' ? 'Copy member number' : '复制会员卡号'}
                            className="text-slate-400 hover:text-sky-300 transition-colors p-0.5"
                          >
                            {copiedMemberId === air.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingMemberId(air.id);
                            setMemberNumberInput(air.memberNumber || '');
                          }}
                          title={language === 'en' ? 'Edit member number' : '修改会员卡号'}
                          className="text-slate-500 hover:text-white transition-colors p-0.5"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Official Portal Link */}
                  {air.portalUrl && (
                    <a
                      href={air.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold transition-all active:scale-95"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Log in to official portal' : '官網登入查點'}</span>
                    </a>
                  )}
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
                    <span>{language === 'en' ? `Expiration Policy: ${air.expirationPolicyEn || air.expirationPolicy}` : `过期规则: ${air.expirationPolicy}`}</span>
                  </div>

                  {air.expirationDate && (
                    <span className="font-bold text-rose-400">{language === 'en' ? `${air.expirationDate} expiration risk` : `${air.expirationDate} 到期风险`}</span>
                  )}
                </div>

                {/* Companion Pass / Certificate Section if present */}
                {air.companionPass && (
                  <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-amber-300 flex items-center space-x-1">
                        <Ticket className="w-4 h-4 text-amber-400" />
                        <span>{language === 'en' && air.companionPass.titleEn ? air.companionPass.titleEn : air.companionPass.title}</span>
                      </span>
                      <span className="text-slate-300">{language === 'en' ? `Expires: ${air.companionPass.expiryDate}` : `到期日: ${air.companionPass.expiryDate}`}</span>
                    </div>

                    {!air.companionPass.isUnlocked && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-300">
                          <span>{language === 'en' ? `Accumulated ${air.companionPass.currentProgress.toLocaleString()} pts` : `已积累 ${air.companionPass.currentProgress.toLocaleString()} pts`}</span>
                          <span>{language === 'en' ? `Target ${air.companionPass.targetProgress.toLocaleString()} pts` : `目标 ${air.companionPass.targetProgress.toLocaleString()} pts`}</span>
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
                          {language === 'en' ? `Need ${(air.companionPass.targetProgress - air.companionPass.currentProgress).toLocaleString()} more points to lock in Buy-One-Get-One all year!` : `还需差 ${(air.companionPass.targetProgress - air.companionPass.currentProgress).toLocaleString()} 分锁定全年买一送一！`}
                        </div>
                      </div>
                    )}

                    {air.companionPass.isUnlocked && (
                      <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 font-bold flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{language === 'en' ? 'Companion Pass unlocked & active (enter your Companion Code when booking to bring a companion)' : '伴飞券已解锁生效中（预订时输入 Companion Code 即可自带伴飞）'}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Key Status Perks */}
                <div className="space-y-1.5 border-t border-slate-800 pt-3">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'en' ? 'Elite Member Status Benefits' : '会籍贵宾专属权益 (Status Benefits)'}
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {(language === 'en' && air.perksEn ? air.perksEn : air.perks).map((perk, idx) => (
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
