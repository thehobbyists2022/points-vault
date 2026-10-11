import React from 'react';
import { X, Sparkles, PlusCircle, Edit3, Users, Wrench, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';

interface QuickGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickGuideModal: React.FC<QuickGuideModalProps> = ({ isOpen, onClose }) => {
  const language = useAppStore((s) => s.language);

  if (!isOpen) return null;

  const steps = [
    {
      step: '1',
      icon: PlusCircle,
      title: t(language, 'step1Title'),
      desc: t(language, 'step1Desc'),
      color: 'from-blue-500/20 to-indigo-500/20 text-indigo-400 border-indigo-500/30',
      badge: language === 'en' ? '0 Typing' : '免打字',
    },
    {
      step: '2',
      icon: Edit3,
      title: t(language, 'step2Title'),
      desc: t(language, 'step2Desc'),
      color: 'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30',
      badge: language === 'en' ? 'Live Valuation' : '即時估值',
    },
    {
      step: '3',
      icon: Users,
      title: t(language, 'step3Title'),
      desc: t(language, 'step3Desc'),
      color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
      badge: language === 'en' ? '1-Tap Toggle' : '一秒切換',
    },
    {
      step: '4',
      icon: Wrench,
      title: t(language, 'step4Title'),
      desc: t(language, 'step4Desc'),
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
      badge: language === 'en' ? '6 Core Tools' : '6大工具',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-[#090d16] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between relative z-10 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{language === 'en' ? 'Quick Start Guide' : '新手極簡速成'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t(language, 'quickGuideTitle')}
            </h3>
            <p className="text-xs text-slate-400">
              {t(language, 'quickGuideSubtitle')}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Step Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 relative z-10">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color} border flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pro Tip */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex items-center space-x-3 text-xs text-slate-300 relative z-10">
          <div className="w-7 h-7 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300 shrink-0 font-bold">
            💡
          </div>
          <p className="leading-relaxed text-[11px] sm:text-xs">
            {language === 'en'
              ? 'Pro Tip: Tap any card in the Apple Wallet deck to expand full details, multipliers, and perks checklist!'
              : '提示：在 Apple Wallet 卡牌堆疊中，點擊任意一張卡面即可抽展詳細權益、刷卡回饋倍數與福利打卡清單！'}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2 relative z-10">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-500/25 transition-all active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{t(language, 'quickGuideGotIt')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
