import React from 'react';
import { Bell, X, CheckCheck, ChevronRight, Clock } from 'lucide-react';
import type { AppNotification } from '../lib/notifications';
import type { TabType } from './Sidebar';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';

interface NotificationCenterProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onNavigate: (tab: TabType) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkRead,
  onClearAll,
  onNavigate,
}) => {
  const language = useAppStore((s) => s.language);

  if (!isOpen) return null;

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  const getUrgencyBadge = (u: AppNotification['urgency']) => {
    if (u === 'high') return <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-md">{t(language, 'highPriority')}</span>;
    if (u === 'medium') return <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md">{t(language, 'medPriority')}</span>;
    return <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">{t(language, 'lowPriority')}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-slate-800 bg-[#090d16] p-6 flex flex-col justify-between shadow-2xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center space-x-2.5">
              <Bell className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">{t(language, 'notifTitle')}</h3>
              {unreadNotifs.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">
                  {unreadNotifs.length}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                <CheckCheck className="w-12 h-12 text-emerald-400" />
                <p className="text-sm font-bold text-slate-200">{t(language, 'allClear')}</p>
                <p className="text-xs text-slate-500">{t(language, 'notifNoAlerts')}</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    onMarkRead(n.id);
                    onNavigate(n.targetTab);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    n.isRead
                      ? 'bg-slate-950/40 border-slate-900 opacity-60'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {getUrgencyBadge(n.urgency)}
                    <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{t(language, 'notifInstant')}</span>
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{n.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.body}</p>
                  <div className="flex items-center justify-end text-[11px] font-semibold text-indigo-400 pt-1">
                    <span>{t(language, 'goToTab')}</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-slate-400 hover:text-white"
            >
              {t(language, 'markAllRead')}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
            >
              {t(language, 'cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
