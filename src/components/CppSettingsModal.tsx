import React from 'react';
import {
  X,
  Settings2,
  RotateCcw,
  Info,
} from 'lucide-react';
import { useAppStore, DEFAULT_CPP_RATES } from '../store/useAppStore';

interface CppSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CppSettingsModal: React.FC<CppSettingsModalProps> = ({ isOpen, onClose }) => {
  const language = useAppStore((s) => s.language);
  const customCppRates = useAppStore((s) => s.customCppRates);
  const updateCppRate = useAppStore((s) => s.updateCppRate);
  const resetCppRates = useAppStore((s) => s.resetCppRates);

  if (!isOpen) return null;

  const currencyGroups = [
    {
      groupName: language === 'en' ? 'Flexible Bank Points' : '四大銀行靈活點數體系',
      keys: ['Chase UR', 'Amex MR', 'Capital One', 'Citi TYP', 'Bilt Rewards'],
    },
    {
      groupName: language === 'en' ? 'Hotel Loyalty Points' : '酒店集團積分體系',
      keys: ['World of Hyatt', 'Marriott Bonvoy', 'Hilton Honors', 'IHG One Rewards'],
    },
    {
      groupName: language === 'en' ? 'Airline Miles' : '主流航空公司哩程體系',
      keys: ['Delta SkyMiles', 'United MileagePlus', 'American Airlines', 'Air France Flying Blue', 'British Airways Avios'],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-xl rounded-3xl border border-slate-800 p-6 space-y-5 bg-slate-950 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Settings2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-black text-white">
                {language === 'en' ? 'Custom Point Valuations (CPP Settings)' : '⚙️ 自訂點數估值 (CPP 估值參數調節器)'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'en'
                  ? 'Set your conservative or aggressive value per point (¢/pt) for portfolio calculation'
                  : '自訂每種點數折算為美分的預期單價 (¢/pt)，資產看板總值完全符合您的個人標準'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tip Box */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 flex items-start space-x-2">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            {language === 'en'
              ? 'CPP = Cents Per Point. For example, 1.8¢ means 100,000 points = $1,800 USD. If you prefer conservative estimates, set UR/MR to 1.2¢ - 1.5¢.'
              : 'CPP (Cents Per Point) 代表每點折算美分。例如 1.8¢ 代表 100,000 點等值 $1,800 USD。若您追求保守預算，可將 UR/MR 調至 1.2¢ ~ 1.5¢。'}
          </p>
        </div>

        {/* Currency Inputs Grouped */}
        <div className="space-y-4">
          {currencyGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {group.groupName}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {group.keys.map((key) => {
                  const currentRate = customCppRates[key] ?? DEFAULT_CPP_RATES[key] ?? 1.5;
                  const defaultRate = DEFAULT_CPP_RATES[key] ?? 1.5;

                  return (
                    <div
                      key={key}
                      className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-white block">{key}</span>
                        <span className="text-[10px] text-slate-500">
                          {language === 'en' ? 'Default' : '官方默認'}: {defaultRate}¢
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="5.0"
                          value={currentRate}
                          onChange={(e) => updateCppRate(key, parseFloat(e.target.value) || defaultRate)}
                          className="w-16 bg-slate-950 border border-slate-700 text-amber-300 font-black text-xs rounded-xl px-2 py-1.5 text-center focus:outline-none focus:border-indigo-500"
                        />
                        <span className="text-xs text-slate-400 font-bold">¢</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={resetCppRates}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center space-x-1.5 border border-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Reset to Defaults' : '恢復官方預設'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            {language === 'en' ? 'Save & Apply' : '儲存並套用'}
          </button>
        </div>
      </div>
    </div>
  );
};
