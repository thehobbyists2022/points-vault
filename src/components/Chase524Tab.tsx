import React, { useState } from 'react';
import {
  ShieldAlert,
  Info,
  Plus,
  Trash2,
  Compass,
  Flame,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  CARD_APPLICATION_RULES,
  BEGINNER_ROADMAP_STAGES,
  UserProfile,
  countChase524Openings,
} from '../data/mockData';
import { OfferRadarSection } from './OfferRadarSection';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';

interface Chase524TabProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onAddOpening?: (player: 'P1' | 'P2', date: string) => void;
  onRemoveOpening?: (player: 'P1' | 'P2', date: string) => void;
}

const ROLLING_MONTHS = 24;

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

interface OpeningRow {
  date: string;
  dropOff: Date;
  daysLeft: number;
  active: boolean;
}

function buildRows(openings: string[] | undefined): OpeningRow[] {
  return (openings ?? []).map((d) => {
    const dropOff = addMonths(d, ROLLING_MONTHS);
    return {
      date: d,
      dropOff,
      daysLeft: daysUntil(dropOff),
      active: daysUntil(dropOff) >= 0,
    };
  });
}

interface PlayerPanelProps {
  playerName: string;
  openings: string[];
  onAdd: (date: string) => void;
  onRemove: (date: string) => void;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({ playerName, openings, onAdd, onRemove }) => {
  const language = useAppStore((s) => s.language);
  const [newDate, setNewDate] = useState('');
  const count = countChase524Openings(openings);
  const eligible = count < 5;
  const rows = buildRows(openings);
  const activeRows = rows.filter((r) => r.active);

  const handleAdd = () => {
    if (!newDate) return;
    const d = new Date(`${newDate}T00:00:00`);
    if (isNaN(d.getTime())) return;
    if (daysUntil(addMonths(newDate, ROLLING_MONTHS)) < 0) return;
    onAdd(newDate);
    setNewDate('');
  };

  const nextDropOff = activeRows.length > 0 ? Math.min(...activeRows.map((r) => r.daysLeft)) : null;

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-semibold">{playerName} {t(language, 'rulesAccount')}</span>
          <h3 className="text-xl font-extrabold text-white">{t(language, 'rules524Calculator')}</h3>
        </div>
        <span
          className={`px-3 py-1 text-xs font-extrabold rounded-full border ${
            eligible
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          }`}
        >
          {eligible ? t(language, 'rulesGreenLight') : t(language, 'rulesRedLight')}
        </span>
      </div>

      {/* Rolling window count */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span>
            {t(language, 'rulesOpenCount')} {ROLLING_MONTHS} {t(language, 'rulesMonths')}: <strong>{count} {language === 'en' ? 'Cards' : '張'}</strong>
          </span>
          <span>{t(language, 'rulesQuota')}: 5 {language === 'en' ? 'Cards' : '張'}</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((slot) => (
            <div
              key={slot}
              className={`h-4 rounded-lg transition-all ${
                slot <= count
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shadow-indigo-500/30'
                  : 'bg-slate-800 border border-slate-700'
              }`}
            />
          ))}
        </div>
        <div className="text-[11px] text-slate-400 pt-1">
          {t(language, 'rulesNextDropOff')}:{' '}
          {nextDropOff !== null && nextDropOff >= 0 ? (
            <strong className="text-emerald-400">{t(language, 'rulesDaysLeft')} {nextDropOff} {t(language, 'daysRemaining')}</strong>
          ) : (
            <strong className="text-slate-500">{t(language, 'rulesNoOpenings')}</strong>
          )}
        </div>
      </div>

      {/* Opening date list with real rolling drop-off */}
      {rows.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t(language, 'rulesOpenRecord')}
          </div>
          {rows.map((row) => (
            <div
              key={row.date}
              className={`flex items-center justify-between p-2 rounded-lg border text-[11px] ${
                row.active
                  ? 'bg-slate-900/70 border-slate-700/80 text-slate-200'
                  : 'bg-slate-950/40 border-slate-800 text-slate-600 line-through'
              }`}
            >
              <span className="font-semibold">📅 {t(language, 'rulesOpened')} {row.date}</span>
              <span className={row.active ? 'text-amber-300' : ''}>
                {row.active ? `${t(language, 'rulesDropOff')} ${formatDate(row.dropOff)} (${row.daysLeft} ${t(language, 'rulesDaysAfter')})` : t(language, 'rulesOutWindow')}
              </span>
              <button
                onClick={() => onRemove(row.date)}
                className="text-slate-500 hover:text-rose-400 transition-colors"
                aria-label={`${t(language, 'rulesRemove')} ${row.date}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add opening by real date */}
      <div className="flex items-center space-x-2 pt-2">
        <input
          type="date"
          value={newDate}
          max={formatDate(new Date())}
          onChange={(e) => setNewDate(e.target.value)}
          className="flex-1 min-w-0 bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={handleAdd}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t(language, 'rulesAddOpening')}</span>
        </button>
      </div>
      <p className="text-[10px] text-slate-500">{t(language, 'rulesAddHint')} {ROLLING_MONTHS} {t(language, 'rulesAddHint2')}</p>
    </div>
  );
};

export const Chase524Tab: React.FC<Chase524TabProps> = ({ profile, setProfile, onAddOpening, onRemoveOpening }) => {
  const language = useAppStore((s) => s.language);
  const [activeSubTab, setActiveSubTab] = useState<'monitor' | 'roadmap' | 'radar'>('monitor');

  const handleAdd = (player: 'P1' | 'P2') => (date: string) => {
    if (onAddOpening) {
      onAddOpening(player, date);
    } else {
      const key = player === 'P1' ? 'chase524OpeningsP1' : 'chase524OpeningsP2';
      const current = profile[key];
      if (current.includes(date)) return;
      const next = [...current, date].sort();
      setProfile((p) => ({ ...p, [key]: next }));
    }
  };

  const handleRemove = (player: 'P1' | 'P2') => (date: string) => {
    if (onRemoveOpening) {
      onRemoveOpening(player, date);
    } else {
      const key = player === 'P1' ? 'chase524OpeningsP1' : 'chase524OpeningsP2';
      const next = profile[key].filter((d) => d !== date);
      setProfile((p) => ({ ...p, [key]: next }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tab Switcher */}
      <div className="flex flex-wrap items-center gap-3 glass-panel rounded-2xl p-2.5 border border-slate-800 bg-slate-950/80">
        <button
          onClick={() => setActiveSubTab('monitor')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'monitor'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{language === 'en' ? '5/24 Monitor & Bank Rules' : '5/24 儀表盤 & 銀行規則'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('roadmap')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'roadmap'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{language === 'en' ? '🧭 Beginner Application Roadmap' : '🧭 新手申卡順序路線圖'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('radar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeSubTab === 'radar'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>{language === 'en' ? '🔥 ATH Welcome Bonus Radar' : '🔥 史高開卡禮雷達'}</span>
        </button>
      </div>

      {activeSubTab === 'radar' && <OfferRadarSection />}

      {activeSubTab === 'roadmap' && (
        <div className="space-y-6">
          {/* Roadmap Header */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/40 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-indigo-400">
                <Compass className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-lg font-black text-white">{t(language, 'roadmapTitle')}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{t(language, 'roadmapDesc')}</p>
              </div>
            </div>
          </div>

          {/* 4 Stages Tree */}
          <div className="space-y-4">
            {BEGINNER_ROADMAP_STAGES.map((stage) => (
              <div
                key={stage.stageNumber}
                className="glass-panel rounded-3xl p-6 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-4 relative bg-slate-950/70"
              >
                {/* Stage Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-indigo-500/30">
                      {stage.stageNumber}
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-white">{stage.title}</h4>
                      <span className="text-xs text-slate-400">{stage.subtitle}</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-slate-900 text-indigo-300 border border-indigo-500/20 text-xs font-semibold rounded-xl self-start sm:self-auto">
                    {t(language, 'stage')} {stage.stageNumber}
                  </span>
                </div>

                {/* Why this stage */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-300 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t(language, 'whyThisStage')}</span>
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed pl-4 border-l-2 border-indigo-500/30">
                    {stage.whyThisOrder}
                  </p>
                </div>

                {/* Recommended Target Cards */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-300">{t(language, 'recommendedCards')}:</span>
                  <div className="flex flex-wrap gap-2">
                    {stage.targetCards.map((cardName, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-slate-900 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl shadow-sm flex items-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{cardName}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pro Tips */}
                <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 text-xs text-amber-300 flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>{t(language, 'proTips')}:</strong> {stage.tips}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'monitor' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-purple-400" />
                <span>{t(language, 'rulesTitle')}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t(language, 'rulesDesc')}
              </p>
            </div>
          </div>

          {/* Chase 5/24 Rolling Window Panels for P1 & P2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PlayerPanel
              playerName={profile.p1Name}
              openings={profile.chase524OpeningsP1}
              onAdd={handleAdd('P1')}
              onRemove={handleRemove('P1')}
            />
            <PlayerPanel
              playerName={profile.p2Name}
              openings={profile.chase524OpeningsP2}
              onAdd={handleAdd('P2')}
              onRemove={handleRemove('P2')}
            />
          </div>

          {/* Bank Rules Reference Knowledge Base */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Info className="w-5 h-5 text-indigo-400" />
              <span>{t(language, 'rulesEncyclopedia')}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CARD_APPLICATION_RULES.map((rule, idx) => (
                <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold rounded-md">
                      {rule.bank}
                    </span>
                    <span className="text-xs font-bold text-white">{rule.ruleName}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{rule.description}</p>
                  <div className="p-2.5 bg-slate-950 rounded-xl text-[11px] text-amber-300 border border-slate-800">
                    💡 <strong>{t(language, 'rulesTips')}:</strong> {rule.tips}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
