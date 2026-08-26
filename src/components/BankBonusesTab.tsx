import React, { useState } from 'react';
import {
  Landmark,
  Plus,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Trash2,
  Clock,
  ShieldCheck,
  Edit2,
  X,
  Search,
} from 'lucide-react';
import { BankBonus, UserProfile } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';

interface BankBonusesTabProps {
  profile: UserProfile;
}

function addMonths(dateStr: string, months: number): Date {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setMonth(d.getMonth() + months);
  return d;
}

function daysUntil(target: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const BankBonusesTab: React.FC<BankBonusesTabProps> = ({ profile }) => {
  const language = useAppStore((s) => s.language);
  const bankBonuses = useAppStore((s) => s.bankBonuses || []);
  const addBankBonus = useAppStore((s) => s.addBankBonus);
  const deleteBankBonus = useAppStore((s) => s.deleteBankBonus);
  const updateBankBonusStatus = useAppStore((s) => s.updateBankBonusStatus);
  const updateBankBonus = useAppStore((s) => s.updateBankBonus);

  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBonus, setEditingBonus] = useState<BankBonus | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<BankBonus>>({
    bankName: '',
    accountType: 'Checking',
    bonusAmount: 300,
    depositRequirement: 500,
    directDepositRequired: true,
    lockupDays: 90,
    openDate: new Date().toISOString().slice(0, 10),
    status: 'in_progress',
    retentionMonths: 6,
    notes: '',
    player: 'P1',
    applicationUrl: '',
  });

  const filteredBonuses = bankBonuses.filter((bonus) => {
    const matchesPlayer =
      profile.activePlayer === 'All' || bonus.player === profile.activePlayer;
    const matchesStatus =
      selectedStatus === 'All' || bonus.status === selectedStatus;
    const matchesSearch =
      bonus.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bonus.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlayer && matchesStatus && matchesSearch;
  });

  // Metrics
  const totalReceived = bankBonuses
    .filter((b) => profile.activePlayer === 'All' || b.player === profile.activePlayer)
    .filter((b) => b.status === 'bonus_received' || b.status === 'retention_passed' || b.status === 'closed')
    .reduce((sum, b) => sum + b.bonusAmount, 0);

  const totalInProgress = bankBonuses
    .filter((b) => profile.activePlayer === 'All' || b.player === profile.activePlayer)
    .filter((b) => b.status === 'in_progress')
    .reduce((sum, b) => sum + b.bonusAmount, 0);

  const handleOpenAdd = () => {
    setFormData({
      bankName: '',
      accountType: 'Checking',
      bonusAmount: 300,
      depositRequirement: 500,
      directDepositRequired: true,
      lockupDays: 90,
      openDate: new Date().toISOString().slice(0, 10),
      status: 'in_progress',
      retentionMonths: 6,
      notes: '',
      player: profile.activePlayer === 'P2' ? 'P2' : 'P1',
      applicationUrl: '',
    });
    setEditingBonus(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (bonus: BankBonus) => {
    setFormData(bonus);
    setEditingBonus(bonus);
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bankName || !formData.bonusAmount) return;

    if (editingBonus) {
      updateBankBonus(editingBonus.id, formData);
    } else {
      const newBonus: BankBonus = {
        id: `bank-${Date.now()}`,
        bankName: formData.bankName,
        accountType: formData.accountType || 'Checking',
        bonusAmount: Number(formData.bonusAmount) || 0,
        depositRequirement: Number(formData.depositRequirement) || 0,
        directDepositRequired: Boolean(formData.directDepositRequired),
        lockupDays: Number(formData.lockupDays) || 90,
        openDate: formData.openDate || new Date().toISOString().slice(0, 10),
        status: formData.status || 'in_progress',
        retentionMonths: Number(formData.retentionMonths) || 6,
        notes: formData.notes || '',
        player: formData.player || 'P1',
        applicationUrl: formData.applicationUrl,
      };
      addBankBonus(newBonus);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
              <Landmark className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-white">{t(language, 'bankBonusesTitle')}</h2>
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                Direct Deposit & Clawback Radar
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t(language, 'bankBonusesDesc')}
          </p>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 shadow-xl">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {t(language, 'totalBankEarnings')}
            </div>
            <div className="text-2xl font-black text-emerald-400 tracking-tight mt-0.5">
              ${totalReceived.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-500/80 flex items-center space-x-1 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{language === 'en' ? 'Claimed & Protected' : '已成功入帳'}</span>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 shadow-xl">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {t(language, 'inProgressBankBonuses')}
            </div>
            <div className="text-2xl font-black text-amber-300 tracking-tight mt-0.5">
              ${totalInProgress.toLocaleString()}
            </div>
            <div className="text-[10px] text-amber-400/80 flex items-center space-x-1 mt-1">
              <Clock className="w-3 h-3" />
              <span>{language === 'en' ? 'Pending Requirement' : '達標進行中'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel rounded-2xl p-4 border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter Pills */}
          <div className="flex flex-wrap items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            {[
              { id: 'All', label: language === 'en' ? 'All' : '全部狀態' },
              { id: 'in_progress', label: t(language, 'statusInProgress') },
              { id: 'bonus_received', label: language === 'en' ? 'Bonus Received' : '獎勵已入帳' },
              { id: 'retention_passed', label: t(language, 'statusSafeToClose') },
              { id: 'closed', label: t(language, 'statusClosed') },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedStatus === st.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={language === 'en' ? 'Search bank name or notes...' : '搜尋銀行或備註...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 w-48"
            />
          </div>
        </div>

        {/* Add Bank Bonus Button */}
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center space-x-1.5 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t(language, 'addBankBonusBtn')}</span>
        </button>
      </div>

      {/* Bonus Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredBonuses.map((bonus) => {
          const safeDate = addMonths(bonus.openDate, bonus.retentionMonths);
          const daysLeftToSafe = daysUntil(safeDate);
          const isPassedSafeDate = daysLeftToSafe <= 0;

          return (
            <div
              key={bonus.id}
              className="glass-panel rounded-3xl p-6 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 relative group"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {bonus.accountType}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {bonus.player}
                    </span>
                    {bonus.directDepositRequired ? (
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20">
                        {t(language, 'ddRequired')}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {t(language, 'noDdRequired')}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white leading-tight">{bonus.bankName}</h3>
                </div>

                {/* Bonus Amount Display */}
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-400">
                    +${bonus.bonusAmount}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Bonus Cash</span>
                </div>
              </div>

              {/* Requirement & Key Details */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">{t(language, 'depositAmount')}</span>
                  <span className="font-bold text-slate-200">
                    {bonus.depositRequirement > 0 ? `$${bonus.depositRequirement.toLocaleString()}` : 'None'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{t(language, 'lockupDuration')}</span>
                  <span className="font-bold text-slate-200">{bonus.lockupDays} {language === 'en' ? 'Days' : '天'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{t(language, 'openDateLabel')}</span>
                  <span className="font-semibold text-slate-300 flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{bonus.openDate}</span>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{t(language, 'safeCloseDateLabel')}</span>
                  <span className={`font-semibold flex items-center space-x-1 ${isPassedSafeDate ? 'text-emerald-400' : 'text-amber-400'}`}>
                    <ShieldCheck className="w-3 h-3" />
                    <span>{formatDate(safeDate)}</span>
                  </span>
                </div>
              </div>

              {/* Notes */}
              {bonus.notes && (
                <p className="text-xs text-slate-400 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/50 italic">
                  💡 {bonus.notes}
                </p>
              )}

              {/* Clawback Status Banner */}
              <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                bonus.status === 'closed'
                  ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                  : isPassedSafeDate
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
              }`}>
                <div className="flex items-center space-x-2">
                  {isPassedSafeDate ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                  <span>
                    {isPassedSafeDate
                      ? (language === 'en' ? '✅ Safe to Close: 6+ Months Passed (No Clawback Risk)' : '✅ 已滿 6 個月保護期，可安全關戶或轉出資金')
                      : (language === 'en' ? `⚠️ Clawback Hold: ${daysLeftToSafe} days until safe to close` : `⚠️ 距離 6 個月免罰關戶期還剩 ${daysLeftToSafe} 天`)}
                  </span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
                {/* Status Switcher */}
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-500 font-semibold">{t(language, 'updateStatusLabel')}:</span>
                  <select
                    value={bonus.status}
                    onChange={(e) => updateBankBonusStatus(bonus.id, e.target.value as BankBonus['status'])}
                    className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="in_progress">{t(language, 'statusInProgress')}</option>
                    <option value="bonus_received">{t(language, 'statusBonusReceived')}</option>
                    <option value="retention_passed">{t(language, 'statusSafeToClose')}</option>
                    <option value="closed">{t(language, 'statusClosed')}</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  {bonus.applicationUrl && (
                    <a
                      href={bonus.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center space-x-1"
                      title="Open Bank Portal"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => handleOpenEdit(bonus)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs"
                    title="Edit Bonus"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`${language === 'en' ? 'Delete bank bonus' : '確認刪除'} (${bonus.bankName})?`)) {
                        deleteBankBonus(bonus.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all text-xs"
                    title="Delete Bonus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBonuses.length === 0 && (
        <div className="text-center py-16 glass-panel rounded-3xl border border-slate-800">
          <Landmark className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-300">
            {language === 'en' ? 'No Bank Bonuses Found' : '暫無符合條件的銀行開戶紀錄'}
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {language === 'en'
              ? 'Click "+ Add Bank Bonus" to record your checking/savings bonus tasks and track retention dates.'
              : '點擊「+ 新增開戶獎勵」記錄您的銀行開戶任務，及時掌握工資直存與關戶保護期。'}
          </p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-800 p-6 space-y-5 bg-slate-950 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Landmark className="w-5 h-5 text-emerald-400" />
                <span>{editingBonus ? (language === 'en' ? 'Edit Bank Bonus' : '修改開戶獎勵') : t(language, 'addBankBonusBtn')}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">{t(language, 'bankNameLabel')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chase Total Checking, US Bank Smartly..."
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">{t(language, 'bonusAmountLabel')}</label>
                  <input
                    type="number"
                    required
                    value={formData.bonusAmount}
                    onChange={(e) => setFormData({ ...formData, bonusAmount: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">{t(language, 'depositAmount')} ($)</label>
                  <input
                    type="number"
                    value={formData.depositRequirement}
                    onChange={(e) => setFormData({ ...formData, depositRequirement: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Account Type</label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value as BankBonus['accountType'] })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Checking">Checking</option>
                    <option value="Savings">Savings</option>
                    <option value="Bundle">Bundle</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">{t(language, 'playerLabel')}</label>
                  <select
                    value={formData.player}
                    onChange={(e) => setFormData({ ...formData, player: e.target.value as 'P1' | 'P2' })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="P1">P1</option>
                    <option value="P2">P2</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">{t(language, 'lockupDuration')} (Days)</label>
                  <input
                    type="number"
                    value={formData.lockupDays}
                    onChange={(e) => setFormData({ ...formData, lockupDays: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">{t(language, 'openDateLabel')}</label>
                  <input
                    type="date"
                    required
                    value={formData.openDate}
                    onChange={(e) => setFormData({ ...formData, openDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Retention Months</label>
                  <input
                    type="number"
                    value={formData.retentionMonths}
                    onChange={(e) => setFormData({ ...formData, retentionMonths: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="ddReq"
                  checked={formData.directDepositRequired}
                  onChange={(e) => setFormData({ ...formData, directDepositRequired: e.target.checked })}
                  className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 h-4 w-4 bg-slate-900"
                />
                <label htmlFor="ddReq" className="text-xs text-slate-300 font-medium">
                  {t(language, 'ddRequired')} (e.g. Payroll / Direct Deposit)
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Notes & Requirements</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 2 direct deposits of $4,000+ within 90 days. Keep open 180 days."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                >
                  {t(language, 'cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  {editingBonus ? (language === 'en' ? 'Save Changes' : '儲存變更') : (language === 'en' ? 'Add Bonus' : '確認新增')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
