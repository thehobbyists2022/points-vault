import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Wallet, Sparkles, Layers, Bell, Globe, Cloud, CloudOff, HardDrive } from 'lucide-react';
import type { UserProfile } from '../data/mockData';
import { BackupRestoreModal } from './BackupRestoreModal';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';

interface HeaderProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  totalValueDollars: number;
  totalPointsCount: number;
  unreadCount: number;
  onOpenNotifCenter: () => void;
  onOpenAuthModal: () => void;
  isSignedIn: boolean;
  userEmail?: string | null;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  setProfile,
  totalValueDollars,
  totalPointsCount,
  unreadCount,
  onOpenNotifCenter,
  onOpenAuthModal,
  isSignedIn,
  userEmail,
  onSignOut,
}) => {
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
      {/* Brand Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-amber-300 bg-clip-text text-transparent tracking-tight">
              PointsVault
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
              PRO All-in-One
            </span>
          </div>
          <p className="text-xs text-slate-400">{t(language, 'brandSubtitle')}</p>
        </div>
      </div>

      {/* Household / P1 / P2 Switcher & Stats */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Language Switcher Pill */}
        <div className="flex items-center bg-slate-950/80 border border-slate-800 p-1 rounded-xl">
          <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              language === 'en'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('zh')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              language === 'zh'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            中文
          </button>
        </div>

        {/* Total Net Worth Counter */}
        <div className="hidden sm:flex items-center space-x-3 bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-1.5">
          <div className="p-1.5 bg-indigo-500/10 rounded-lg">
            <Wallet className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">{t(language, 'totalNetWorth')}</div>
            <div className="text-sm font-bold text-emerald-400">
              ${totalValueDollars.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs text-slate-400 font-normal ml-1 cursor-pointer">
                ({(totalPointsCount / 1000).toFixed(0)}k {t(language, 'ptsCount')})
              </span>
            </div>
          </div>
        </div>

        {/* Backup & Restore Button */}
        <button
          onClick={() => setIsBackupModalOpen(true)}
          title={t(language, 'backupRestoreTitle')}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <HardDrive className="w-4 h-4 text-indigo-400" />
        </button>

        {/* Cloud Sync Button */}
        {typeof onOpenAuthModal === 'function' && (
          <button
            onClick={onOpenAuthModal}
            title={isSignedIn ? 'Cloud Sync Active' : 'Sign in to enable cloud sync'}
            className={`relative p-2 rounded-xl border transition-all ${
              isSignedIn
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:border-emerald-400'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {isSignedIn ? <Cloud className="w-4 h-4" /> : <CloudOff className="w-4 h-4" />}
          </button>
        )}

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifCenter}
          className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-slate-300" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Player Switcher Pill */}
        <div className="flex items-center bg-slate-950/80 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setProfile((p) => ({ ...p, activePlayer: 'All' }))}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              profile.activePlayer === 'All'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t(language, 'householdView')}</span>
          </button>
          <button
            onClick={() => setProfile((p) => ({ ...p, activePlayer: 'P1' }))}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              profile.activePlayer === 'P1'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-300" />
            <span>{profile.p1Name}</span>
          </button>
          <button
            onClick={() => setProfile((p) => ({ ...p, activePlayer: 'P2' }))}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              profile.activePlayer === 'P2'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-300" />
            <span>{profile.p2Name}</span>
          </button>
        </div>

        {/* Signed-in User Avatar / Email / Sign Out */}
        {userEmail && (
          <div className="hidden lg:flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
              {userEmail[0].toUpperCase()}
            </div>
            <span className="text-xs text-slate-300 max-w-[120px] truncate">{userEmail}</span>
            <button
              onClick={onSignOut}
              className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors font-semibold ml-1"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Privacy Badge */}
        <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t(language, 'privacyBadge')}</span>
        </div>
      </div>

      {/* Backup & Restore Modal */}
      <BackupRestoreModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />
    </header>
  );
};
