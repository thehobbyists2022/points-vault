import React, { useState, useRef } from 'react';
import { X, Download, Upload, ShieldCheck, CheckCircle2, AlertTriangle, FileJson, HardDrive, RefreshCw } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';
import type { CreditCard, AirlineProgram, HotelProgram, CarRentalProgram, UserProfile } from '../data/mockData';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BackupPayload {
  version: number;
  exportedAt: string;
  app: string;
  data: {
    cards: CreditCard[];
    airlines: AirlineProgram[];
    hotels: HotelProgram[];
    cars: CarRentalProgram[];
    profile: UserProfile;
  };
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({ isOpen, onClose }) => {
  const language = useAppStore((s) => s.language);
  const cards = useAppStore((s) => s.cards);
  const airlines = useAppStore((s) => s.airlines);
  const hotels = useAppStore((s) => s.hotels);
  const cars = useAppStore((s) => s.cars);
  const profile = useAppStore((s) => s.profile);

  const setCards = useAppStore((s) => s.setCards);
  const setAirlines = useAppStore((s) => s.setAirlines);
  const setHotels = useAppStore((s) => s.setHotels);
  const setProfile = useAppStore((s) => s.setProfile);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importedData, setImportedData] = useState<BackupPayload | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const backup: BackupPayload = {
      version: 3,
      exportedAt: new Date().toISOString(),
      app: 'PointsVault',
      data: {
        cards,
        airlines,
        hotels,
        cars,
        profile,
      },
    };

    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pointsvault-backup-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        // Validation
        if (!parsed.data || !Array.isArray(parsed.data.cards)) {
          throw new Error(t(language, 'importError'));
        }

        setImportedData(parsed as BackupPayload);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : t(language, 'importError'));
        setImportedData(null);
      }
    };
    reader.readAsText(file);
  };

  const handleApplyRestore = () => {
    if (!importedData || !importedData.data) return;

    try {
      if (importedData.data.cards) setCards(importedData.data.cards);
      if (importedData.data.airlines) setAirlines(importedData.data.airlines);
      if (importedData.data.hotels) setHotels(importedData.data.hotels);
      if (importedData.data.profile) setProfile(importedData.data.profile);

      setSuccessMsg(t(language, 'importSuccess'));
      setImportedData(null);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch {
      setErrorMsg(t(language, 'importError'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-slate-800 shadow-2xl bg-[#090d16] p-6 space-y-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
              <HardDrive className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t(language, 'backupRestoreTitle')}</h3>
              <p className="text-xs text-slate-400">{t(language, 'backupRestoreSubtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export Box */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
                <Download className="w-4 h-4" />
                <span>{t(language, 'exportBtn')}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t(language, 'exportDesc')}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-[11px] text-slate-500">
                {t(language, 'backupIncludes')}: <strong className="text-slate-300">{cards.length} Cards, {airlines.length} Airlines, {hotels.length} Hotels</strong>
              </div>
              <button
                onClick={handleExport}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>{t(language, 'exportBtn')}</span>
              </button>
            </div>
          </div>

          {/* Import Box */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                <Upload className="w-4 h-4" />
                <span>{t(language, 'importBtn')}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t(language, 'importDesc')}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <FileJson className="w-4 h-4 text-emerald-400" />
                <span>{t(language, 'importBtn')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Validation Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Pending Import Preview Modal */}
        {importedData && !successMsg && (
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Ready to Restore</span>
              </span>
              <span className="text-[10px] text-slate-400">
                Exported: {new Date(importedData.exportedAt).toLocaleDateString()}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="font-bold text-white">{importedData.data.cards?.length || 0}</div>
                <div className="text-[10px] text-slate-400">Cards</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="font-bold text-sky-400">{importedData.data.airlines?.length || 0}</div>
                <div className="text-[10px] text-slate-400">Airlines</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="font-bold text-purple-400">{importedData.data.hotels?.length || 0}</div>
                <div className="text-[10px] text-slate-400">Hotels</div>
              </div>
            </div>

            <div className="flex space-x-2 pt-1">
              <button
                onClick={() => setImportedData(null)}
                className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold hover:text-white"
              >
                {t(language, 'cancel')}
              </button>
              <button
                onClick={handleApplyRestore}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Apply Restore</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
