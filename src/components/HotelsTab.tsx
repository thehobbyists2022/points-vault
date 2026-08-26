import React, { useState } from 'react';
import { Building2, Award, Clock, Calendar, CheckCircle2, Pencil, Check, X, Copy, Edit2, ExternalLink, Ticket } from 'lucide-react';
import { HotelProgram, UserProfile, HOTEL_TIER_OPTIONS } from '../data/mockData';
import { PassesRadarSection } from './PassesRadarSection';
import { useAppStore } from '../store/useAppStore';

interface HotelsTabProps {
  hotels: HotelProgram[];
  profile: UserProfile;
  onUpdatePoints?: (id: string, balance: number) => void;
  onToggleFnc?: (hotelId: string, fncId: string) => void;
}

export const HotelsTab: React.FC<HotelsTabProps> = ({ hotels, profile, onUpdatePoints, onToggleFnc }) => {
  const setHotelMemberNumber = useAppStore((s) => s.setHotelMemberNumber);
  const setHotelStatusTier = useAppStore((s) => s.setHotelStatusTier);
  const language = useAppStore((s) => s.language);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberNumberInput, setMemberNumberInput] = useState('');
  const [copiedMemberId, setCopiedMemberId] = useState<string | null>(null);
  const [activeSubView, setActiveSubView] = useState<'programs' | 'radar'>('programs');

  const commitEdit = (id: string) => {
    const parsed = parseInt(editValue, 10);
    if (!isNaN(parsed) && parsed >= 0 && onUpdatePoints) {
      onUpdatePoints(id, parsed);
    }
    setEditingId(null);
    setEditValue('');
  };

  const commitMemberNumber = (id: string) => {
    setHotelMemberNumber(id, memberNumberInput.trim());
    setEditingMemberId(null);
    setMemberNumberInput('');
  };

  const handleCopyMemberNumber = (id: string, num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedMemberId(id);
    setTimeout(() => setCopiedMemberId(null), 2000);
  };

  const filteredHotels = hotels.filter(
    (h) => profile.activePlayer === 'All' || h.player === profile.activePlayer
  );

  return (
    <div className="space-y-6">
      {/* Sub-View Switcher */}
      <div className="flex flex-wrap items-center gap-3 glass-panel rounded-2xl p-2.5 border border-slate-800 bg-slate-950/80">
        <button
          onClick={() => setActiveSubView('programs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubView === 'programs'
              ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{language === 'en' ? 'Hotel Group Memberships & Points Assets' : '酒店集團會籍與點數資產'}</span>
        </button>

        <button
          onClick={() => setActiveSubView('radar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubView === 'radar'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>{language === 'en' ? '🎫 FNC & Companion Pass Expiration Radar' : '🎫 免房券 (FNC) & 伴飛券防過期雷達'}</span>
        </button>
      </div>

      {activeSubView === 'radar' && <PassesRadarSection />}

      {activeSubView === 'programs' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-sky-400" />
                <span>{language === 'en' ? 'Hotel Loyalty Programs & Free Night Certificates (FNC) Hub' : '酒店常旅客计划 & 免房券 (FNC) 中心'}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'en' ? 'Track elite status nights, points balances, and FNC expiration dates across Hyatt, Marriott Bonvoy, and Hilton Honors.' : '监控 Hyatt, Marriott Bonvoy, Hilton Honors 尊贵会籍房晚、积分储备与 FNC 过期日。'}
              </p>
            </div>

            <div className="flex items-center space-x-3 bg-sky-500/10 border border-sky-500/20 px-3.5 py-2 rounded-xl">
              <Award className="w-4 h-4 text-sky-400" />
              <span className="text-xs text-sky-300 font-semibold">
                {language === 'en' ? 'Elite Status Benefit Protection Active' : '高级会籍福利保护生效中'}
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
                      {language === 'en' ? `${hotel.player} Account` : `${hotel.player} 账户`}
                    </span>
                    <h3 className="text-base font-extrabold text-white mt-0.5">{hotel.name}</h3>
                    <div className="mt-1.5 flex items-center space-x-1">
                      <select
                        value={hotel.statusTier}
                        onChange={(e) => setHotelStatusTier(hotel.id, e.target.value)}
                        className="bg-black/50 hover:bg-black/70 text-amber-300 border border-amber-400/40 text-xs font-bold rounded-xl px-2 py-0.5 backdrop-blur-md cursor-pointer focus:outline-none focus:border-amber-300 transition-all"
                        title={language === 'en' ? 'Click to switch my real status tier' : '點擊切換我的真實會籍'}
                      >
                        {(HOTEL_TIER_OPTIONS[hotel.id] || [hotel.statusTier]).map((tier) => (
                          <option key={tier} value={tier} className="bg-slate-900 text-white font-normal">
                            👑 {tier}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-white/70 font-medium flex items-center justify-end space-x-1">
                      <span>{language === 'en' ? 'Points Balance' : '积分余额'}</span>
                      {onUpdatePoints && editingId !== hotel.id && (
                        <button
                          onClick={() => { setEditingId(hotel.id); setEditValue(String(hotel.pointsBalance)); }}
                          className="opacity-60 hover:opacity-100 transition-opacity"
                          title={language === 'en' ? 'Update points balance' : '更新积分余额'}
                        >
                          <Pencil className="w-3 h-3 text-sky-200" />
                        </button>
                      )}
                    </div>
                    {editingId === hotel.id ? (
                      <div className="flex items-center justify-end space-x-1 mt-0.5">
                        <input
                          autoFocus
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEdit(hotel.id);
                            if (e.key === 'Escape') { setEditingId(null); setEditValue(''); }
                          }}
                          className="w-24 bg-black/50 border border-white/25 rounded-lg px-2 py-1 text-right text-lg font-extrabold text-white focus:outline-none focus:border-sky-400"
                        />
                        <button onClick={() => commitEdit(hotel.id)} className="p-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { setEditingId(null); setEditValue(''); }} className="p-1 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-300">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-lg font-extrabold text-white">
                        {hotel.pointsBalance.toLocaleString()} <span className="text-xs font-normal text-sky-200">pts</span>
                      </div>
                    )}
                    <div className="text-xs text-emerald-300 font-semibold mt-0.5">
                      ~${pointsValue.toFixed(0)} ({hotel.cppValue}c/pt)
                    </div>
                  </div>
                </div>

                {/* Member ID & Official Portal Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
                  {/* Membership Number */}
                  <div className="flex items-center space-x-1.5 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl">
                    <span className="text-[11px] text-slate-400 font-medium">{language === 'en' ? 'Member Number:' : '会员卡号:'}</span>
                    {editingMemberId === hotel.id ? (
                      <div className="flex items-center space-x-1">
                        <input
                          autoFocus
                          type="text"
                          value={memberNumberInput}
                          onChange={(e) => setMemberNumberInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitMemberNumber(hotel.id);
                            if (e.key === 'Escape') setEditingMemberId(null);
                          }}
                          className="bg-slate-950 border border-slate-700 px-2 py-0.5 rounded text-white text-xs font-mono font-bold w-32 focus:outline-none focus:border-sky-400"
                        />
                        <button onClick={() => commitMemberNumber(hotel.id)} className="text-emerald-400 p-0.5"><Check className="w-3 h-3" /></button>
                        <button onClick={() => setEditingMemberId(null)} className="text-rose-400 p-0.5"><X className="w-3 h-3" /></button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono font-bold text-slate-200">{hotel.memberNumber || (language === 'en' ? 'Not set' : '未填写')}</span>
                        {hotel.memberNumber && (
                          <button
                            onClick={() => handleCopyMemberNumber(hotel.id, hotel.memberNumber!)}
                            title={language === 'en' ? 'Copy member number' : '复制会员卡号'}
                            className="text-slate-400 hover:text-sky-300 transition-colors p-0.5"
                          >
                            {copiedMemberId === hotel.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingMemberId(hotel.id);
                            setMemberNumberInput(hotel.memberNumber || '');
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
                  {hotel.portalUrl && (
                    <a
                      href={hotel.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all active:scale-95"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Log in to official portal' : '官網登入查點'}</span>
                    </a>
                  )}
                </div>

                {/* Night Progress Bar */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>{language === 'en' ? `Nights stayed this year: ${hotel.nightsThisYear}` : `今年已入住房晚: ${hotel.nightsThisYear} 晚`}</span>
                    <span>{language === 'en' ? `Nights to next tier: ${hotel.nightsToNextTier}` : `距离下一保级还差: ${hotel.nightsToNextTier} 晚`}</span>
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
                      <span>{language === 'en' ? 'Free Night Certificates' : '免房券证书 (Free Night Certificates)'}</span>
                    </span>
                    <span className="text-sky-300 font-semibold">{language === 'en' ? `${hotel.fncs.length} certificates` : `${hotel.fncs.length} 张`}</span>
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
                            <span>{language === 'en' ? `Expires: ${fnc.expirationDate}` : `到期日: ${fnc.expirationDate}`}</span>
                          </span>
                          {onToggleFnc ? (
                            <button
                              onClick={() => onToggleFnc(hotel.id, fnc.id)}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                                fnc.isUsed
                                  ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                              }`}
                            >
                              {fnc.isUsed ? (language === 'en' ? 'Restore to Available' : '恢复为可用') : (language === 'en' ? 'Mark as Used' : '标记已使用')}
                            </button>
                          ) : (
                            <span>{fnc.isUsed ? (language === 'en' ? 'Redeemed for a stay' : '已兑换住宿') : (language === 'en' ? 'Status: Active & Available' : '状态: 激活可用')}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Status Perks List */}
                <div className="space-y-1.5 border-t border-slate-800 pt-3">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'en' ? 'Core Elite Benefits' : '会籍核心尊享权益 (Elite Perks)'}
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
    )}
  </div>
  );
};
