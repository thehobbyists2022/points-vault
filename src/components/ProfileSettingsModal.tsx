import React, { useState } from 'react';
import { X, User, LogOut, Trash2, AlertTriangle, Loader2, Users, Save } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { signOut } from '../lib/supabase';
import { t } from '../i18n/translations';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string | null;
  onSignOut: () => void;
}

const stripPlayerSuffix = (name: string, player: 'P1' | 'P2') => {
  const cleaned = name.replace(/\s*\(P\d+\)\s*$/i, '').trim();
  return cleaned || `${player}`;
};

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  onSignOut,
}) => {
  const language = useAppStore((s) => s.language);
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);
  const clearToFreshWallet = useAppStore((s) => s.clearToFreshWallet);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [p1Draft, setP1Draft] = useState<string | null>(null);
  const [p2Draft, setP2Draft] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  if (!isOpen) return null;

  const p1Value = p1Draft ?? stripPlayerSuffix(profile.p1Name, 'P1');
  const p2Value = p2Draft ?? stripPlayerSuffix(profile.p2Name, 'P2');

  const handleSaveNames = () => {
    setProfile((prev) => ({
      ...prev,
      p1Name: `${(p1Draft ?? stripPlayerSuffix(prev.p1Name, 'P1')).trim()} (P1)`,
      p2Name: `${(p2Draft ?? stripPlayerSuffix(prev.p2Name, 'P2')).trim()} (P2)`,
    }));
    setP1Draft(null);
    setP2Draft(null);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  };

  const namesDirty = p1Draft !== null || p2Draft !== null;

  const handleRequestDeletion = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 1. Attempt to sign out from backend (best effort, ignore if fails due to network)
      await signOut().catch(console.error);
    } finally {
      // 2. Always clear local data and UI state for security
      clearToFreshWallet();
      onSignOut();
      
      // 3. Open the dedicated public deletion page in a new tab
      const encodedEmail = encodeURIComponent(userEmail || '');
      window.open(`/delete-account.html?email=${encodedEmail}`, '_blank');
      
      // 4. Close modal and reset state
      setIsSubmitting(false);
      setShowConfirmDelete(false);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-settings-title"
    >
      <div className="w-full max-w-sm glass-panel rounded-3xl border border-slate-800 p-6 space-y-6 shadow-2xl bg-[#0b101d]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <User className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 id="profile-settings-title" className="text-lg font-bold text-white">
              {language === 'en' ? 'Account Settings' : '帳號設定'}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            aria-label="Close"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Household Members */}
          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-amber-400" />
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                  {t(language, 'householdModalTitle')}
                </p>
              </div>
              <p className="text-[10px] text-slate-500 leading-snug max-w-[200px] text-right">
                {t(language, 'householdModalDesc')}
              </p>
            </div>
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wide">{t(language, 'p1NameLabel')}</label>
                <input
                  type="text"
                  value={p1Value}
                  maxLength={20}
                  placeholder={t(language, 'p1NamePlaceholder')}
                  onChange={(e) => setP1Draft(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-purple-300 uppercase tracking-wide">{t(language, 'p2NameLabel')}</label>
                <input
                  type="text"
                  value={p2Value}
                  maxLength={20}
                  placeholder={t(language, 'p2NamePlaceholder')}
                  onChange={(e) => setP2Draft(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
            <button
              onClick={handleSaveNames}
              disabled={!namesDirty}
              className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                namesDirty
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 hover:brightness-110 cursor-pointer'
                  : 'bg-slate-800/60 text-slate-500 cursor-default'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>
                {savedFlash
                  ? (language === 'en' ? 'Saved!' : '已儲存！')
                  : namesDirty
                  ? (language === 'en' ? t(language, 'saveMemberChanges') : t(language, 'saveMemberChanges'))
                  : (language === 'en' ? 'No Changes' : '沒有變更')}
              </span>
            </button>
          </div>

          {/* User Info */}
          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
            <p className="text-xs text-slate-500 font-semibold mb-1">
              {language === 'en' ? 'Signed in as' : '登入身分'}
            </p>
            <p className="text-sm font-bold text-slate-200">
              {userEmail || (language === 'en' ? 'Unauthenticated User' : '未驗證使用者')}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => {
                onSignOut(); // Assuming onSignOut handles both local and backend signOut in the parent
                onClose();
              }}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              <span>{language === 'en' ? 'Sign Out' : '登出'}</span>
            </button>

            {userEmail && !showConfirmDelete && (
              <button
                onClick={() => setShowConfirmDelete(true)}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 text-sm font-semibold transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{language === 'en' ? 'Request Account Deletion' : '申請刪除帳號'}</span>
              </button>
            )}

            {showConfirmDelete && (
              <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-start space-x-3 text-rose-300">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed">
                    {language === 'en'
                      ? 'This will sign you out and clear this device immediately. You will be redirected to a webpage to submit your formal cloud deletion request.'
                      : '這將立即登出並清除本機資料。您將被導向至專屬網頁以提交正式的雲端資料刪除請求。'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    disabled={isSubmitting}
                    className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    {language === 'en' ? 'Cancel' : '取消'}
                  </button>
                  <button
                    onClick={handleRequestDeletion}
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-colors shadow-lg shadow-rose-900/20 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>{language === 'en' ? 'Proceed' : '繼續'}</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
