import React, { useState } from 'react';
import { FileText, CheckCircle2, X } from 'lucide-react';
import { parseCSV, type ParseResult } from '../lib/csvParser';
import type { CreditCard } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';

interface StatementUploaderModalProps {
  card: CreditCard;
  onClose: () => void;
  onApplySpend: (amount: number) => void;
}

export const StatementUploaderModal: React.FC<StatementUploaderModalProps> = ({
  card,
  onClose,
  onApplySpend,
}) => {
  const language = useAppStore((s) => s.language);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const result = parseCSV(text);
        setParseResult(result);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmApply = () => {
    if (parseResult && parseResult.totalSpend > 0) {
      onApplySpend(parseResult.totalSpend);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl glass-panel rounded-3xl border border-slate-800 p-6 space-y-6 shadow-2xl bg-[#0b101d]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t(language, 'csvTitle')}</h3>
              <p className="text-xs text-slate-400">{t(language, 'csvForCard')}: {card.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Drop Zone */}
        {!parseResult && (
          <div className="relative border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3 bg-slate-950/40 transition-all">
            <span className="text-indigo-400">
              <FileText className="w-10 h-10 animate-bounce" />
            </span>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-200">{t(language, 'csvDropHint')}</p>
              <p className="text-xs text-slate-500 mt-1">{t(language, 'csvSupported')}</p>
            </div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>
        )}

        {/* Parsed Result Preview */}
        {parseResult && (
          <div className="space-y-4">
            {/* Status Summary Banner */}
            <div className="flex flex-wrap items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 gap-4">
              <div>
                <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {t(language, 'csvDetected')}: {parseResult.issuer}
                </span>
                <p className="text-xs text-slate-400 mt-1.5">{t(language, 'csvFile')}: {fileName} ({parseResult.transactions.length} {t(language, 'csvValidTx')})</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium">{t(language, 'csvTotalAmount')}</div>
                <div className="text-xl font-black text-emerald-400">
                  ${parseResult.totalSpend.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Transactions Preview Table */}
            <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-800/80 bg-slate-950/60 p-2 space-y-1">
              {parseResult.transactions.map((tx, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-slate-900/80">
                  <div>
                    <div className="font-semibold text-slate-200 truncate max-w-xs">{tx.description}</div>
                    <div className="text-[10px] text-slate-500">{tx.date} {tx.category ? `• ${tx.category}` : ''}</div>
                  </div>
                  <div className="font-bold text-slate-100">${tx.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setParseResult(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                {t(language, 'csvReupload')}
              </button>
              <button
                onClick={handleConfirmApply}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t(language, 'csvApplyMsr')} (${parseResult.totalSpend.toFixed(2)})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
