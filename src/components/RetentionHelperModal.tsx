import React, { useState } from 'react';
import { X, Target, DollarSign, PhoneCall, Copy, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';

interface RetentionHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BankPlaybook {
  bank: string;
  phone?: string;
  channel: string;
  script: string;
  tips: string;
  downgradeRoutes: { from: string; to: string; note: string }[];
}

const BANK_PLAYBOOKS: BankPlaybook[] = [
  {
    bank: "American Express",
    channel: "Amex Mobile App / Website Online Live Chat",
    script: "Hi! I am reviewing my annual card expenses and noticed my annual fee of $CARD_FEE is coming due on my $CARD_NAME. Given my recent travel and spending patterns, I'm considering closing or downgrading this card. Are there any retention offers, bonus point promotions, or statement credits available on my account to help offset the annual fee and keep the card open?",
    tips: "Amex has the easiest retention process via Online Chat. You can ask every 13 months per card. If offered points (e.g. 45k MR for $3k spend), you must keep the card open for at least 12 months to avoid clawback.",
    downgradeRoutes: [
      { from: "Amex Platinum ($695)", to: "Amex Gold ($325) or Green ($150)", note: "Charge cards cannot downgrade to free credit cards. Open Blue Business Plus (BBP) to preserve MR points with $0 annual fee!" },
      { from: "Amex Gold ($325)", to: "Amex Green Card ($150)", note: "Can downgrade to Green to lower fee while keeping card history." },
      { from: "Hilton Aspire ($550)", to: "Hilton Surpass ($150) or Hilton Honors ($0)", note: "Can downgrade to $0 Hilton card with zero impact on credit history." },
    ],
  },
  {
    bank: "Chase",
    phone: "1-800-436-7927",
    channel: "Direct Retention Line / Customer Service",
    script: "Hello, I'm reviewing my accounts as my annual fee of $CARD_FEE on my $CARD_NAME recently posted. Before making a decision to product change or close the account, I'd like to check if there are any retention offers, statement credits, or bonus point incentives available on my profile?",
    tips: "Chase gives a 100% full refund of the annual fee if you cancel or downgrade within 30 days of the fee posting date. Chase retention offers are relatively rare ($100-$150 statement credit), but downgrade paths are exceptionally generous.",
    downgradeRoutes: [
      { from: "Sapphire Reserve ($550)", to: "Sapphire Preferred ($95) or Freedom Flex ($0)", note: "Downgrade to OG Freedom (Visa with 5x rotating) or Freedom Flex to keep your credit limit and credit history intact with $0 fee!" },
      { from: "Sapphire Preferred ($95)", to: "Chase Freedom Unlimited ($0) or Freedom Flex ($0)", note: "Your Ultimate Rewards points will stay completely safe in your Freedom account." },
      { from: "United Quest / Club", to: "United Gateway ($0)", note: "Maintains United mileage pooling with no annual fee." },
    ],
  },
  {
    bank: "Citi",
    phone: "1-800-950-5114",
    channel: "Customer Service & Retention Specialists",
    script: "Hi, I am calling about my $CARD_NAME with annual fee $CARD_FEE. I want to see if there are any promotional spending credits or retention bonus offers on my account before I consider product changing to another card.",
    tips: "Citi often offers spending bonuses (e.g. spend $1,000 get $95 credit, or 1,000 bonus points per month for 7 months). Citi allows product changing to almost any card in their lineup, including multiple Citi Custom Cash cards!",
    downgradeRoutes: [
      { from: "Citi Strata Premier ($95)", to: "Citi Custom Cash ($0) or Double Cash ($0)", note: "Citi Custom Cash gives 5% back on your top eligible spending category each billing cycle up to $500." },
      { from: "Citi / AAdvantage Platinum", to: "American Airlines MileUp ($0)", note: "Keeps AA account active with no annual fee." },
    ],
  },
  {
    bank: "Capital One",
    phone: "1-800-227-4825",
    channel: "Account Specialist Line",
    script: "Hello, I am reviewing my card portfolio and wanted to check if there are any account retention offers or annual fee waivers available on my $CARD_NAME?",
    tips: "Capital One rarely gives retention offers, but Venture X ($395) gives $300 travel credit + 10k anniversary miles ($100 value), which mathematically makes it a +$5 net profit card every single year without asking!",
    downgradeRoutes: [
      { from: "Venture X ($395)", to: "VentureOne Rewards ($0) or Savor ($0)", note: "Downgrade to VentureOne to keep all your CapOne miles alive with zero annual fee." },
    ],
  },
];

export const RetentionHelperModal: React.FC<RetentionHelperModalProps> = ({ isOpen, onClose }) => {
  const language = useAppStore((s) => s.language);
  const cards = useAppStore((s) => s.cards);
  const profile = useAppStore((s) => s.profile);

  const [selectedBankTab, setSelectedBankTab] = useState<string>("American Express");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  if (!isOpen) return null;

  const relevantCards = cards.filter(
    (c) => profile.activePlayer === 'All' || c.player === profile.activePlayer
  );

  const totalFees = relevantCards.reduce((sum, c) => sum + c.annualFee, 0);
  const totalPerks = relevantCards.reduce(
    (sum, c) => sum + c.perks.reduce((pSum, p) => pSum + p.value, 0),
    0
  );
  const netRoi = totalPerks - totalFees;

  const currentPlaybook = BANK_PLAYBOOKS.find((b) => b.bank === selectedBankTab) || BANK_PLAYBOOKS[0];

  const targetCard = cards.find((c) => c.id === selectedCardId) || relevantCards.find((c) => c.annualFee > 0) || relevantCards[0];

  const customizedScript = currentPlaybook.script
    .replace('$CARD_NAME', targetCard?.name || 'card')
    .replace('$CARD_FEE', targetCard?.annualFee ? `$${targetCard.annualFee}` : '$95');

  const handleCopyScript = () => {
    navigator.clipboard.writeText(customizedScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-3xl max-h-[90vh] glass-panel rounded-3xl border border-slate-800 shadow-2xl bg-[#090d16] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <Target className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t(language, 'retentionTitle')}</h3>
              <p className="text-xs text-slate-400">{t(language, 'retentionSubtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold">{t(language, 'totalAnnualFees')}</span>
              <div className="text-xl font-black text-rose-400">${totalFees.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ yr</span></div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold">{t(language, 'totalPerksValue')}</span>
              <div className="text-xl font-black text-emerald-400">${totalPerks.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ yr</span></div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 font-semibold">{t(language, 'overallNetRoi')}</span>
              <div className={`text-xl font-black ${netRoi >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
                {netRoi >= 0 ? `+$${netRoi.toLocaleString()}` : `-$${Math.abs(netRoi).toLocaleString()}`}
              </div>
            </div>
          </div>

          {/* Cards Fee ROI Breakdown Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-indigo-400" />
                <span>{t(language, 'annualFeeSummary')}</span>
              </span>
            </div>

            <div className="divide-y divide-slate-800/60 max-h-56 overflow-y-auto">
              {relevantCards
                .filter((c) => c.annualFee > 0)
                .sort((a, b) => b.annualFee - a.annualFee)
                .map((card) => {
                  const cardPerksTotal = card.perks.reduce((sum, p) => sum + p.value, 0);
                  const net = cardPerksTotal - card.annualFee;
                  const isKeep = net >= 0;

                  return (
                    <div
                      key={card.id}
                      onClick={() => setSelectedCardId(card.id)}
                      className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs cursor-pointer transition-colors ${
                        selectedCardId === card.id ? 'bg-indigo-950/40' : 'hover:bg-slate-900/50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-white flex items-center space-x-2">
                          <span>{card.name}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                            {card.player}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {card.applicationDate ? `${t(language, 'cardOpenedDate')}: ${card.applicationDate}` : card.issuer}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 shrink-0">
                        <div className="text-right">
                          <span className="text-rose-400 font-semibold">${card.annualFee} Fee</span>
                          <span className="text-slate-500 mx-1.5">vs</span>
                          <span className="text-emerald-400 font-semibold">${cardPerksTotal} Perks</span>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                            isKeep
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {isKeep ? t(language, 'keepVerdict') : t(language, 'negotiateVerdict')}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Bank Retention Playbook Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>{t(language, 'retentionPlaybook')}</span>
            </h4>

            {/* Bank Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {BANK_PLAYBOOKS.map((pb) => (
                <button
                  key={pb.bank}
                  onClick={() => setSelectedBankTab(pb.bank)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedBankTab === pb.bank
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {pb.bank}
                </button>
              ))}
            </div>

            {/* Playbook Details */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              {/* Channel & Contact info */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                <div className="text-xs">
                  <span className="text-slate-500 font-semibold">Channel: </span>
                  <span className="text-slate-200 font-bold">{currentPlaybook.channel}</span>
                </div>
                {currentPlaybook.phone && (
                  <div className="text-xs flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-mono font-bold">{currentPlaybook.phone}</span>
                  </div>
                )}
              </div>

              {/* Script Box with One-Click Copy */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Negotiation Script (Word-for-Word):</span>
                  <button
                    onClick={handleCopyScript}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
                  >
                    {copiedScript ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedScript ? t(language, 'scriptCopied') : t(language, 'copyScript')}</span>
                  </button>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed select-all">
                  "{customizedScript}"
                </div>
              </div>

              {/* Pro Tips */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start space-x-2.5">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span className="leading-relaxed">{currentPlaybook.tips}</span>
              </div>

              {/* Downgrade Routes */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <span className="text-xs font-bold text-slate-300">{t(language, 'downgradeRoutes')}:</span>
                <div className="space-y-2">
                  {currentPlaybook.downgradeRoutes.map((route, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center space-x-2 font-bold text-white">
                        <span className="text-rose-400">{route.from}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-emerald-400">{route.to}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">{route.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
