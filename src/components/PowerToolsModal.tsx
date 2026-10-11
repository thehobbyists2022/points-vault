import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  ArrowRightLeft,
  Car,
  Landmark,
  Gift,
  FileSpreadsheet,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Chase524Tab } from './Chase524Tab';
import { TransferMatrixTab } from './TransferMatrixTab';
import { CarRentalTab } from './CarRentalTab';
import { BankBonusesTab } from './BankBonusesTab';
import { AffiliateTab } from './AffiliateTab';
import { StatementUploaderModal } from './StatementUploaderModal';

interface PowerToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTool?: 'overview' | 'rules524' | 'transfers' | 'cars' | 'bankBonuses' | 'affiliate';
}

type PowerToolId = 'overview' | 'rules524' | 'transfers' | 'cars' | 'bankBonuses' | 'affiliate';

export const PowerToolsModal: React.FC<PowerToolsModalProps> = ({
  isOpen,
  onClose,
  initialTool = 'overview',
}) => {
  const language = useAppStore((s) => s.language);
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);
  const cards = useAppStore((s) => s.cards);
  const cars = useAppStore((s) => s.cars);
  const addChase524Opening = useAppStore((s) => s.addChase524Opening);
  const removeChase524Opening = useAppStore((s) => s.removeChase524Opening);
  const recordMsrSpend = useAppStore((s) => s.recordMsrSpend);

  const [currentTool, setCurrentTool] = useState<PowerToolId>(initialTool);
  const [statementCardId, setStatementCardId] = useState<string | null>(null);

  if (!isOpen) return null;

  const toolsList = [
    {
      id: 'rules524' as PowerToolId,
      title: language === 'en' ? 'Chase 5/24 & Bank Rules' : 'Chase 5/24 與銀行開卡護欄',
      desc: language === 'en' ? '24-month rolling slot monitor, drop-off dates, Amex lifetime rules' : '24個月滾動槽位監控、出坑日期計算、Amex一生一次規則',
      icon: ShieldAlert,
      badge: '5/24 Radar',
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    },
    {
      id: 'transfers' as PowerToolId,
      title: language === 'en' ? 'Transfer Partner Matrix' : '轉點夥伴矩陣與加贈雷達',
      desc: language === 'en' ? 'Real-time transfer bonus alerts (+30%), 15+ airline/hotel exchange ratios' : '即時轉點加贈提醒（+30%）、15+航司與酒店夥伴兌換試算',
      icon: ArrowRightLeft,
      badge: '+30% Bonus',
      color: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30',
    },
    {
      id: 'cars' as PowerToolId,
      title: language === 'en' ? 'Car Rental Match & CDW' : '租車會籍匹配與 CDW 車險判定',
      desc: language === 'en' ? 'Hertz, National, Avis status match pathways and primary CDW coverage' : 'Hertz、National、Avis會籍匹配路線圖與信用卡Primary主險判定',
      icon: Car,
      badge: 'CDW Match',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'bankBonuses' as PowerToolId,
      title: language === 'en' ? 'Bank Account Bonuses' : '銀行開戶獎勵追蹤器',
      desc: language === 'en' ? '$4,850+ Checking/Savings direct deposit bonus timelines & milestones' : '追蹤各銀行支票/儲蓄帳戶開戶獎勵、薪資直存(DD)要求與解鎖進度',
      icon: Landmark,
      badge: '$4,850+ DD',
      color: 'from-indigo-500/20 to-blue-500/20 text-indigo-400 border-indigo-500/30',
    },
    {
      id: 'affiliate' as PowerToolId,
      title: language === 'en' ? 'Referral Engine' : '推薦返利引擎與年度上限',
      desc: language === 'en' ? 'Manage personal refer links and monitor annual referral reward caps' : '管理個人信用卡推薦連結、追蹤年度推薦獎勵上限與未領收益',
      icon: Gift,
      badge: 'Cash Back',
      color: 'from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-5xl glass-panel rounded-3xl border border-slate-800 p-4 sm:p-6 space-y-4 shadow-2xl bg-[#0b101d] text-white max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl">
              <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  {language === 'en' ? 'Power Tools Suite' : '進階專業工具箱'}
                </h3>
                {currentTool !== 'overview' && (
                  <button
                    onClick={() => setCurrentTool('overview')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
                  >
                    {language === 'en' ? '← Back to Menu' : '← 返回選單'}
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'en'
                  ? 'All 6 power tools preserved 100% without cluttering your daily dashboard.'
                  : '全部 6 大硬核專業工具 100% 保留，隨時呼叫，絕不佔用首頁空間。'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1">
          {currentTool === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {toolsList.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.id}
                      onClick={() => setCurrentTool(tool.id)}
                      className="group p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all cursor-pointer flex items-center justify-between shadow-md"
                    >
                      <div className="flex items-start space-x-3.5">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-br ${tool.color} border shadow-md`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                              {tool.title}
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                              {tool.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed pr-2">
                            {tool.desc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  );
                })}
              </div>

              {/* CSV Parser Fast Trigger Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {language === 'en' ? 'CSV Statement Parser' : 'CSV 銀行帳單自動解析'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {language === 'en'
                        ? 'Upload Chase / Amex / CapOne CSV to automatically track MSR progress without typing.'
                        : '上傳 Chase、Amex、Capital One 帳單 CSV，自動辨識開卡消費進度。'}
                    </p>
                  </div>
                </div>
                {cards.length > 0 && (
                  <button
                    onClick={() => setStatementCardId(cards[0].id)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shrink-0"
                  >
                    {language === 'en' ? 'Upload CSV' : '上傳帳單'}
                  </button>
                )}
              </div>
            </div>
          )}

          {currentTool === 'rules524' && (
            <div className="py-2">
              <Chase524Tab
                profile={profile}
                setProfile={setProfile}
                onAddOpening={addChase524Opening}
                onRemoveOpening={removeChase524Opening}
              />
            </div>
          )}

          {currentTool === 'transfers' && (
            <div className="py-2">
              <TransferMatrixTab />
            </div>
          )}

          {currentTool === 'cars' && (
            <div className="py-2">
              <CarRentalTab cars={cars} profile={profile} />
            </div>
          )}

          {currentTool === 'bankBonuses' && (
            <div className="py-2">
              <BankBonusesTab profile={profile} />
            </div>
          )}

          {currentTool === 'affiliate' && (
            <div className="py-2">
              <AffiliateTab cards={cards} profile={profile} />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>
            {language === 'en'
              ? '✨ Power Tools operate 100% locally with zero cloud leakage.'
              : '✨ 工具箱所有功能 100% 本地即時運算，隱私零外洩。'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
          >
            {language === 'en' ? 'Close' : '關閉'}
          </button>
        </div>
      </div>

      {/* CSV Parser Modal inside Tools */}
      {statementCardId && cards.find((c) => c.id === statementCardId) && (
        <StatementUploaderModal
          card={cards.find((c) => c.id === statementCardId)!}
          onClose={() => setStatementCardId(null)}
          onApplySpend={(amt) => recordMsrSpend(statementCardId, amt)}
        />
      )}
    </div>
  );
};
