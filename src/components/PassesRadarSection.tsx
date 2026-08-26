import React, { useState } from 'react';
import {
  Ticket,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Building2,
  Plane,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { generatePerksCalendarICS, downloadCalendarICS } from '../lib/calendarExport';

interface PassesRadarSectionProps {
  className?: string;
  onOpenCalendarModal?: () => void;
}

export const PassesRadarSection: React.FC<PassesRadarSectionProps> = ({ className = '' }) => {
  const language = useAppStore((s) => s.language);
  const hotels = useAppStore((s) => s.hotels);
  const cards = useAppStore((s) => s.cards);
  const profile = useAppStore((s) => s.profile);
  const toggleHotelFnc = useAppStore((s) => s.toggleHotelFnc);

  const [filterType, setFilterType] = useState<'All' | 'FNC' | 'Passes'>('All');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Filter hotel FNCs by active player
  const activeHotels = hotels.filter(
    (h) => profile.activePlayer === 'All' || h.player === profile.activePlayer
  );

  // Flatten all FNC items
  const allFncs = activeHotels.flatMap((hotel) =>
    hotel.fncs.map((fnc) => {
      const expDate = new Date(`${fnc.expirationDate}T00:00:00`);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const daysLeft = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

      let recommendations: string[] = [];
      let enRecommendations: string[] = [];
      if (fnc.categoryLimit.includes('85,000') || fnc.title.includes('85k')) {
        recommendations = ['京都麗思卡爾頓 (Ritz-Carlton Kyoto)', '夏威夷 Mauna Kea 傲途格', '阿斯彭瑞吉度假村 (St. Regis Aspen)'];
        enRecommendations = ['Ritz-Carlton Kyoto', 'Mauna Kea Autograph Collection, Hawaii', 'St. Regis Aspen Resort'];
      } else if (fnc.categoryLimit.includes('50,000') || fnc.title.includes('50k')) {
        recommendations = ['紐約時代廣場 EDITION', '東京威斯汀酒店 (Westin Tokyo)', '巴黎萬豪香榭麗舍'];
        enRecommendations = ['Times Square EDITION, New York', 'Westin Tokyo', 'Marriott Paris Champs-Élysées'];
      } else if (fnc.categoryLimit.includes('Category 1-4')) {
        recommendations = ['薩凡納安達仕 (Andaz Savannah)', '柏林君悅 (Grand Hyatt Berlin)', '東京灣凱悅酒店'];
        enRecommendations = ['Andaz Savannah', 'Grand Hyatt Berlin', 'Hyatt Regency Tokyo Bay'];
      } else if (fnc.categoryLimit.includes('Category 1-7')) {
        recommendations = ['京都柏悅 (Park Hyatt Kyoto)', '巴黎旺多姆柏悅', '馬爾代夫柏悅度假村'];
        enRecommendations = ['Park Hyatt Kyoto', 'Park Hyatt Paris-Vendôme', 'Park Hyatt Maldives Hadahaa'];
      } else {
        recommendations = ['熱門度假村與首府高端奢華物業'];
        enRecommendations = ['Top resorts and premium luxury properties in capital cities'];
      }

      const estValue =
        fnc.estimatedValueUSD ??
        (fnc.categoryLimit.includes('85,000') || fnc.title.includes('85k')
          ? 800
          : fnc.categoryLimit.includes('50,000') || fnc.title.includes('50k')
          ? 450
          : fnc.categoryLimit.includes('Category 1-7')
          ? 700
          : 300);

      return {
        ...fnc,
        estimatedValueUSD: estValue,
        hotelId: hotel.id,
        hotelName: hotel.name,
        player: hotel.player,
        daysLeft,
        recommendations,
        enRecommendations,
        enTitle: fnc.title,
        isPass: false,
      };
    })
  );

  // Companion passes mock/derived from premium cards
  const companionPasses = [
    {
      id: 'pass-delta-reserve',
      title: '達美航空頭等/頭等艙同行機票 (Companion Certificate)',
      enTitle: 'Delta First / Comfort+ Companion Certificate',
      categoryLimit: 'First / Comfort+ / Main Cabin',
      expirationDate: '2026-11-30',
      estimatedValueUSD: 650,
      isUsed: false,
      hotelId: 'delta',
      hotelName: 'Delta Air Lines',
      player: 'P1',
      daysLeft: 96,
      recommendations: ['紐約 JFK ⇄ 舊金山 SFO 跨陸頭等艙', '西雅圖 ⇄ 夏威夷火奴魯魯雙人往返'],
      enRecommendations: ['JFK ⇄ SFO transcontinental First Class', 'Seattle ⇄ Honolulu roundtrip for two'],
      isPass: true,
    },
    {
      id: 'pass-southwest-135k',
      title: '西南航空無限次伴飛卡 (Southwest Companion Pass)',
      enTitle: 'Southwest Unlimited Companion Pass',
      categoryLimit: 'Unlimited Flights for P2',
      expirationDate: '2026-12-31',
      estimatedValueUSD: 1200,
      isUsed: false,
      hotelId: 'southwest',
      hotelName: 'Southwest Airlines',
      player: 'P1',
      daysLeft: 127,
      recommendations: ['全年任意航線 P2 免費同行（僅需付 $5.60 稅費）'],
      enRecommendations: ['P2 flies free on any route all year (just pay the $5.60 tax)'],
      isPass: true,
    },
  ];

  const combinedItems = [
    ...(filterType === 'Passes' ? [] : allFncs),
    ...(filterType === 'FNC' ? [] : companionPasses),
  ].sort((a, b) => {
    if (a.isUsed !== b.isUsed) return a.isUsed ? 1 : -1;
    return a.daysLeft - b.daysLeft;
  });

  const totalValueUSD = combinedItems
    .filter((i) => !i.isUsed)
    .reduce((sum, i) => sum + i.estimatedValueUSD, 0);

  const expiringSoonCount = combinedItems.filter(
    (i) => !i.isUsed && i.daysLeft <= 60
  ).length;

  const handleExportICS = () => {
    const ics = generatePerksCalendarICS(cards, hotels, profile.p1Name, language);
    downloadCalendarICS(ics, `PointsVault_Perks_FNC_${profile.p1Name}.ics`);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="p-2.5 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-2xl text-white shadow-lg shadow-amber-500/20">
              <Ticket className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-white">
                {language === 'en' ? 'Free Night Certificates (FNC) & Companion Passes Vault' : '🎫 免房券 (FNC) & 伴飛券防過期避坑雷達'}
              </h2>
              <span className="text-xs text-slate-400">
                {language === 'en'
                  ? 'Real-time countdown, high-value sweet spots, and calendar synchronization'
                  : '即時到期倒計時、高價值甜點酒店/航線推薦與日曆提醒同步'}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {language === 'en'
              ? 'Never let an $800 Ritz-Carlton or Hyatt certificate expire silently. Track your family free nights and companion passes in one central dashboard.'
              : '告別 $800+ 萬豪 85k 或凱悅免房券靜默過期的慘劇。集中統籌全家免房晚與伴飛機票，鎖定最高價值兌換。'}
          </p>
        </div>

        {/* Counter Summary & ICS Export Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 shadow-xl min-w-[160px]">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              {language === 'en' ? 'Active Passes Value' : '待使用房券總值'}
            </div>
            <div className="text-2xl font-black text-amber-400 tracking-tight mt-0.5">
              ${totalValueUSD.toLocaleString()} <span className="text-xs text-slate-500 font-normal">USD</span>
            </div>
            <div className="text-[10px] text-rose-400 mt-1 font-semibold flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>{expiringSoonCount} {language === 'en' ? 'passes expiring soon (<60d)' : '張即將在 60 天內到期'}</span>
            </div>
          </div>

          <button
            onClick={handleExportICS}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 transition-all active:scale-95 border border-indigo-400/30"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{language === 'en' ? 'Downloaded .ics File!' : '已成功下載日曆檔！'}</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 text-indigo-200" />
                <span>{language === 'en' ? 'Export .ics Calendar' : '📅 導出日曆提醒 (.ics)'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'All', label: language === 'en' ? 'All Certificates & Passes' : '全部房券與伴飛卡' },
          { id: 'FNC', label: language === 'en' ? 'Hotel Free Night Certificates (FNC)' : '🏨 酒店免房券 (FNC)' },
          { id: 'Passes', label: language === 'en' ? 'Airline Companion Passes' : '✈️ 航司伴飛券 (Passes)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === tab.id
                ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Passes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {combinedItems.map((item) => {
          const isUrgent = !item.isUsed && item.daysLeft <= 30;
          const isWarning = !item.isUsed && item.daysLeft > 30 && item.daysLeft <= 90;

          return (
            <div
              key={item.id}
              className={`glass-panel rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-4 relative ${
                item.isUsed
                  ? 'border-slate-800/60 opacity-60 bg-slate-950/40'
                  : isUrgent
                  ? 'border-rose-500/50 bg-gradient-to-b from-rose-950/20 to-slate-950 shadow-xl shadow-rose-500/5'
                  : 'border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950'
              }`}
            >
              {/* Header Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {item.player}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center space-x-1">
                      {item.isPass ? <Plane className="w-3 h-3 text-sky-400" /> : <Building2 className="w-3 h-3 text-amber-400" />}
                      <span>{item.hotelName}</span>
                    </span>
                  </div>

                  {item.isUsed ? (
                    <span className="text-[10px] font-extrabold text-slate-500 bg-slate-900 px-2 py-0.5 rounded-md">
                      {language === 'en' ? 'Redeemed' : '已兌換'}
                    </span>
                  ) : (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        isUrgent
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : isWarning
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {item.daysLeft <= 0
                        ? language === 'en' ? 'Expired' : '已過期'
                        : language === 'en' ? `${item.daysLeft} days left` : `倒計時 ${item.daysLeft} 天`}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-bold text-white leading-snug">{language === 'en' ? item.enTitle : item.title}</h4>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {language === 'en' ? 'Tier / Value limit' : '兌換上限'}: <strong className="text-slate-200">{item.categoryLimit}</strong>
                  </div>
                </div>
              </div>

              {/* Expiry & USD Value Box */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">{language === 'en' ? 'Valid Until' : '有效截止日期'}</span>
                  <span className="font-bold text-white text-xs">{item.expirationDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{language === 'en' ? 'Est. Value' : '預估市場價值'}</span>
                  <span className="font-black text-emerald-400 text-sm">${item.estimatedValueUSD} USD</span>
                </div>
              </div>

              {/* Recommended Sweet Spots */}
              <div className="text-xs bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-300 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{language === 'en' ? 'Top Redemption Recommendations' : '推薦高性價比兌換目標'}:</span>
                </span>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  {item.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start space-x-1 leading-tight">
                      <ChevronRight className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
                      <span>{language === 'en' ? item.enRecommendations[idx] : rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Toggle Action */}
              {!item.isPass && (
                <button
                  onClick={() => toggleHotelFnc(item.hotelId, item.id)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    item.isUsed
                      ? 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-700'
                      : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.isUsed ? (language === 'en' ? 'Mark as Unused' : '標記為未兌換') : (language === 'en' ? 'Mark as Redeemed' : '標記為已使用')}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
