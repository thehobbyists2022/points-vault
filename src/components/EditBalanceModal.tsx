import React, { useState } from 'react';
import { X, Edit3, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';

interface EditBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  currentBalance: number;
  currencyName: string;
  cppValue: number;
  onSave: (newBalance: number) => void;
}

export const EditBalanceModal: React.FC<EditBalanceModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  currentBalance,
  currencyName,
  cppValue,
  onSave,
}) => {
  const language = useAppStore((s) => s.language);
  const [balanceInput, setBalanceInput] = useState<string>(currentBalance.toString());

  if (!isOpen) return null;

  const numVal = parseFloat(balanceInput) || 0;
  const estimatedUsd = (numVal * cppValue) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(Math.max(0, numVal));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-md glass-panel rounded-3xl border border-slate-800 shadow-2xl bg-[#090d16] p-6 space-y-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
              <Edit3 className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t(language, 'editBalance')}</h3>
              <p className="text-xs text-slate-400 truncate max-w-[240px]">{subtitle || title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current State Info */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">{t(language, 'currentBalanceLabel')}</span>
            <span className="text-lg font-black text-white">{currentBalance.toLocaleString()} {currencyName}</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-500 font-semibold block">{t(language, 'cppValuation')}</span>
            <span className="text-xs font-bold text-indigo-400">~ {cppValue} c/pt</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              {t(language, 'newBalanceLabel')} ({currencyName})
            </label>
            <input
              type="number"
              min="0"
              required
              value={balanceInput}
              onChange={(e) => setBalanceInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-lg font-bold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Live USD Est */}
          <div className="flex items-center justify-between px-1 text-xs text-slate-400">
            <span>{t(language, 'dashEstValue')}</span>
            <span className="font-bold text-emerald-400 text-sm">
              ${estimatedUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              {t(language, 'cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-98 flex items-center justify-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{t(language, 'saveBalance')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
