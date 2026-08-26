import React from 'react';
import { Sparkles, Trash2, RotateCcw, AlertCircle, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface DemoBannerProps {
  onOpenWizard: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onOpenWizard }) => {
  const isDemoMode = useAppStore((s) => s.isDemoMode);
  const clearToFreshWallet = useAppStore((s) => s.clearToFreshWallet);
  const loadDemoData = useAppStore((s) => s.loadDemoData);
  const language = useAppStore((s) => s.language);

  if (!isDemoMode) {
    return (
      <div className="bg-slate-900/60 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>
            {language === 'en' ? (
              <>🛡️ <strong>Custom Wallet Mode</strong>: Your personal cards and points have been loaded.</>
            ) : (
              <>🛡️ <strong>真實錢包模式 (Custom Wallet)</strong>：已載入您個人的專屬卡片與點數。</>
            )}
          </span>
        </div>
        <button
          onClick={loadDemoData}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-[11px] font-semibold border border-slate-700"
        >
          <RotateCcw className="w-3 h-3 text-amber-400" />
          <span>{language === 'en' ? 'Reload Demo Data' : '重新載入示範數據 (Load Demo)'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/70 via-amber-900/40 to-slate-900/90 border-b border-amber-500/30 px-4 py-2.5 shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 text-xs text-amber-200">
          <div className="p-1 bg-amber-500/20 rounded-md border border-amber-500/40">
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="font-bold text-amber-300">{language === 'en' ? 'Demo Sample Data Mode:' : '示範範本數據模式 (Demo Mode)：'}</span>
            <span className="text-slate-300 ml-1">
              {language === 'en' ? 'You are viewing the default demo cards and estimated values. Feel free to explore, or build your own real wallet with one click!' : '當前顯示的是預設示範卡片與估值。您可以自由體驗，或一鍵建立專屬您的真實錢包！'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={clearToFreshWallet}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 transition-all text-xs font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Clear Demo Data' : '一鍵清空示範數據'}</span>
          </button>

          <button
            onClick={onOpenWizard}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>{language === 'en' ? 'Build My Real Wallet in 30 Seconds' : '30 秒建立我的真實錢包'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
