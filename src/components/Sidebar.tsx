import React from 'react';
import {
  LayoutDashboard,
  CreditCard,
  Plane,
  Building2,
  Car,
  ShoppingBag,
  ArrowRightLeft,
  ShieldAlert,
  Sparkles,
  Gift,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { t, type translations } from '../i18n/translations';

export type TabType =
  | 'dashboard'
  | 'cards'
  | 'airlines'
  | 'hotels'
  | 'cars'
  | 'merchant'
  | 'transfers'
  | 'rules524'
  | 'affiliate';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  unclaimedPerksCount: number;
  fncCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  unclaimedPerksCount,
  fncCount,
}) => {
  const language = useAppStore((s) => s.language);

  const menuItems: { id: TabType; translationKey: keyof typeof translations['en']; icon: React.ElementType; badge: string | null; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      translationKey: 'tabDashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'cards',
      translationKey: 'tabCards',
      icon: CreditCard,
      badge: unclaimedPerksCount > 0 ? `${unclaimedPerksCount} ${t(language, 'unclaimedPerks')}` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'airlines',
      translationKey: 'tabAirlines',
      icon: Plane,
      badge: 'Companion Pass',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    },
    {
      id: 'hotels',
      translationKey: 'tabHotels',
      icon: Building2,
      badge: fncCount > 0 ? `${fncCount} FNC` : null,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      id: 'cars',
      translationKey: 'tabCars',
      icon: Car,
      badge: 'CDW Match',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'merchant',
      translationKey: 'tabMerchant',
      icon: ShoppingBag,
      badge: 'Best Card',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'transfers',
      translationKey: 'tabTransfers',
      icon: ArrowRightLeft,
      badge: '+30% Bonus',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse',
    },
    {
      id: 'rules524',
      translationKey: 'tabRules524',
      icon: ShieldAlert,
      badge: 'Chase 5/24',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'affiliate',
      translationKey: 'tabAffiliate',
      icon: Gift,
      badge: 'Earn Rewards',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
  ];

  return (
    <aside className="w-full md:w-64 glass-panel border-r border-slate-800 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {language === 'en' ? 'Navigation Menu' : '功能導航菜單'}
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white font-semibold shadow-lg shadow-indigo-500/15 border border-indigo-400/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{t(language, item.translationKey)}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Pro Upgrade / App Info Footer Box */}
      <div className="mt-6 p-3.5 bg-gradient-to-b from-indigo-950/40 to-slate-900/80 border border-indigo-500/20 rounded-2xl">
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>PointsVault PRO</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
          {language === 'en' 
            ? 'Complete terminal for US credit cards, valuation, FNC certificates, and status match.'
            : '包含信用卡、真實飛行里程估值、酒店 FNC 免房券與租車會籍路線引擎。'}
        </p>
        <div className="text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-800/80 pt-2">
          <span>v3.0.0</span>
          <span className="text-emerald-400">{language === 'en' ? 'System Ready' : '系統就緒'}</span>
        </div>
      </div>
    </aside>
  );
};
