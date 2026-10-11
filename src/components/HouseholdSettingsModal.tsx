import React, { useState, useEffect } from 'react';
import { X, Users, User, CreditCard, Sparkles, Check, UserCheck } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';

interface HouseholdSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HouseholdSettingsModal: React.FC<HouseholdSettingsModalProps> = ({ isOpen, onClose }) => {
  const language = useAppStore((s) => s.language);
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);
  const cards = useAppStore((s) => s.cards);

  const [p1Name, setP1Name] = useState(profile.p1Name);
  const [p2Name, setP2Name] = useState(profile.p2Name);
  const [hasP2, setHasP2] = useState<boolean>(profile.hasP2 ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setP1Name(profile.p1Name);
      setP2Name(profile.p2Name);
      setHasP2(profile.hasP2 ?? true);
      setSavedSuccess(false);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const p1Cards = cards.filter((c) => c.player === 'P1');
  const p2Cards = cards.filter((c) => c.player === 'P2');
  const p1TotalBalance = p1Cards.reduce((sum, c) => sum + (c.currentBalance || 0), 0);
  const p2TotalBalance = p2Cards.reduce((sum, c) => sum + (c.currentBalance || 0), 0);

  const handleSave = () => {
    const finalP1 = p1Name.trim() || 'P1';
    const finalP2 = p2Name.trim() || 'P2';

    setProfile((prev) => {
      let nextActive = prev.activePlayer;
      // If user disabled P2 and was currently viewing P2, switch to P1
      if (!hasP2 && nextActive === 'P2') {
        nextActive = 'P1';
      }
      return {
        ...prev,
        p1Name: finalP1,
        p2Name: finalP2,
        hasP2: hasP2,
        activePlayer: nextActive,
      };
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="household-settings-title"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="w-full max-w-lg glass-panel rounded-3xl border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl bg-[#0b101d] text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 id="household-settings-title" className="text-lg font-bold text-white flex items-center gap-2">
                <span>{t(language, 'householdModalTitle')}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  P1 / P2
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t(language, 'householdModalDesc')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle: Single Player vs Dual Player */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-0.5 pr-4">
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t(language, 'enableP2Toggle')}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {hasP2 ? t(language, 'enableP2Desc') : t(language, 'singlePlayerNote')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setHasP2(!hasP2)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              hasP2 ? 'bg-indigo-600' : 'bg-slate-700'
            }`}
            role="switch"
            aria-checked={hasP2}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                hasP2 ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
          {/* Members Cards Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Player 1 Card */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/20 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-300" />
                  </div>
                  <span className="text-xs font-bold text-indigo-300">
                    {t(language, 'p1NameLabel')}
                  </span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                  P1 Primary
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">
                  {language === 'en' ? 'Display Name' : '顯示名稱'}
                </label>
                <input
                  type="text"
                  value={p1Name}
                  onChange={(e) => setP1Name(e.target.value)}
                  placeholder={t(language, 'p1NamePlaceholder')}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-slate-500" />
                  <span>{p1Cards.length} {language === 'en' ? 'cards' : '張卡'}</span>
                </span>
                <span className="text-slate-300 font-semibold">
                  {(p1TotalBalance / 1000).toFixed(0)}k pts
                </span>
              </div>
            </div>

            {/* Player 2 Card */}
            <div
              className={`p-4 rounded-2xl border space-y-3 relative overflow-hidden transition-all ${
                hasP2
                  ? 'bg-slate-900/60 border-purple-500/20 opacity-100'
                  : 'bg-slate-950/40 border-slate-800/50 opacity-40 grayscale pointer-events-none'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-purple-300" />
                  </div>
                  <span className="text-xs font-bold text-purple-300">
                    {t(language, 'p2NameLabel')}
                  </span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                  P2 Partner
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">
                  {language === 'en' ? 'Display Name' : '顯示名稱'}
                </label>
                <input
                  type="text"
                  disabled={!hasP2}
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                  placeholder={t(language, 'p2NamePlaceholder')}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
                />
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-slate-500" />
                  <span>{p2Cards.length} {language === 'en' ? 'cards' : '張卡'}</span>
                </span>
                <span className="text-slate-300 font-semibold">
                  {(p2TotalBalance / 1000).toFixed(0)}k pts
                </span>
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl flex items-start space-x-2.5 text-xs text-indigo-300">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {language === 'en'
                ? '💡 You can assign cards to either member when adding cards. Switching views at the top filters your dashboard, 5/24 status, and perks between individual partners or combined household.'
                : '💡 在添加信用卡時，可將卡片指定給特定成員。在頂部切換檢視時，儀表板、5/24 狀態與福利將會隨之篩選，方便單獨或合併管理。'}
            </p>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              {t(language, 'cancel')}
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>{language === 'en' ? 'Saved!' : '已保存！'}</span>
                </>
              ) : (
                <span>{t(language, 'saveMemberChanges')}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
