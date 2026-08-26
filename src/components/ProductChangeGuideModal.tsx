import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  AlertCircle,
  Clock,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface ProductChangeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DowngradePath {
  sourceCard: string;
  sourceIssuer: string;
  currentAnnualFee: number;
  targetCards: {
    name: string;
    annualFee: number;
    pointsPreserved: string;
    benefits: string;
  }[];
  timingRule: string;
  phoneScript: string;
  warningNote?: string;
}

const EN_TRANSLATIONS: Record<string, string> = {
  '100% 保留全部 UR 點數，永不過期': '100% of your Ultimate Rewards points are preserved and never expire',
  '100% 保留全部 UR 點數': '100% of your Ultimate Rewards points are preserved',
  '100% 保留 UR 點數': '100% of your Ultimate Rewards points preserved',
  '所有消費保底 1.5% 返點，免年費': 'Flat 1.5% points on all purchases, no annual fee',
  '季度 5% 輪換類別，免年費': 'Rotating 5% quarterly bonus categories, no annual fee',
  'Visa 通道（可在 Costco 刷季度 5% 輪換）': 'Visa network — works at Costco with quarterly 5% rotating categories',
  '共享同一個 MR 積分池，點數永久安全': 'Shares the same MR points pool — your points stay safe forever',
  '所有商業/個人消費前 $50k 2x MR 返點，永久免年費': '2x MR on the first $50k of business & personal spend, permanently no annual fee',
  '個人免年費保留 MR 點數池': 'No-fee personal card keeps your MR points pool intact',
  '超市 2.4x MR 返點，免年費': '2.4x MR at supermarkets, no annual fee',
  '100% 保留 ThankYou Points (TYP)': '100% of your ThankYou Points (TYP) are preserved',
  '每月最高消費類別自動享 5% 返點（上限 $500/月）': 'Auto 5% on your top spend category each month (up to $500/month)',
  '100% 保留 TYP 點數': '100% of your TYP points are preserved',
  '全類別 2% 返現/返點，免年費神卡': 'Flat 2% cash back / points on everything — the no-fee legend',
  '100% 保留 Venture 里程與轉點夥伴功能': '100% of your Venture miles & transfer partner access are preserved',
  '所有消費 1.25x 里程，免年費': '1.25x miles on all purchases, no annual fee',
  '里程可轉換為返現': 'Miles can be converted to cash back',
  '1.5% 返現': '1.5% cash back',
  '年費出現在月結單後 30 天內致電客服，年費 100% 全額原路退回！': 'Call customer service within 30 days of the annual fee posting to your statement for a 100% full refund!',
  'Amex 簽帳卡（Charge Card）無法直接降級為免年費信用卡。請在關卡前確認名下已持有 BBP 或 Everyday！': 'Amex Charge Cards can\'t be downgraded to a no-fee credit card. Make sure you already hold a BBP or Everyday before closing!',
  '年費入賬後 37 天內致電客服完成轉卡 (Product Change)，年費全額退還。': 'Call within 37 days of the fee posting to complete the Product Change and receive a full refund.',
  '年費出賬後 30 天內致電或在 App 內「Special Offers」中自行點選轉卡。': 'Within 30 days of the fee posting, call or complete the change yourself under "Special Offers" in the app.',
  '降級為免年費 Freedom 後無法直接轉點至凱悅/美聯航；未來需要轉點時，只需重新升級或持有另一張商業 Ink Preferred 即可恢復 1:1 轉點功能。': 'After downgrading to the no-fee Freedom, you can\'t transfer points directly to Hyatt/United. When you need to transfer later, just upgrade again or hold a business Ink Preferred to restore 1:1 transfers.',
  '注意：務必在持卡滿整整 365 天且年費入賬後再關卡，否則會觸發 Amex 开卡奖励扣回 (Clawback) 惩罚！': 'Important: only close the card after holding it a full 365 days with the fee posted, or you\'ll trigger an Amex sign-up bonus clawback penalty!',
};

const DOWNGRADE_PATHS: DowngradePath[] = [
  {
    sourceCard: 'Chase Sapphire Reserve / Preferred',
    sourceIssuer: 'Chase',
    currentAnnualFee: 550,
    targetCards: [
      {
        name: 'Chase Freedom Unlimited (CFU)',
        annualFee: 0,
        pointsPreserved: '100% 保留全部 UR 點數，永不過期',
        benefits: '所有消費保底 1.5% 返點，免年費',
      },
      {
        name: 'Chase Freedom Flex (CFF)',
        annualFee: 0,
        pointsPreserved: '100% 保留全部 UR 點數',
        benefits: '季度 5% 輪換類別，免年費',
      },
      {
        name: 'Chase Freedom (Classic Visa)',
        annualFee: 0,
        pointsPreserved: '100% 保留 UR 點數',
        benefits: 'Visa 通道（可在 Costco 刷季度 5% 輪換）',
      },
    ],
    timingRule: '年費出現在月結單後 30 天內致電客服，年費 100% 全額原路退回！',
    phoneScript: '“Hi, my annual fee just posted on my Sapphire card. I would like to product change / downgrade this account to a Chase Freedom Unlimited to keep my credit line open.”',
    warningNote: '降級為免年費 Freedom 後無法直接轉點至凱悅/美聯航；未來需要轉點時，只需重新升級或持有另一張商業 Ink Preferred 即可恢復 1:1 轉點功能。',
  },
  {
    sourceCard: 'Amex Platinum / Gold / Green',
    sourceIssuer: 'Amex',
    currentAnnualFee: 695,
    targetCards: [
      {
        name: 'Amex Blue Business Plus (BBP)',
        annualFee: 0,
        pointsPreserved: '共享同一個 MR 積分池，點數永久安全',
        benefits: '所有商業/個人消費前 $50k 2x MR 返點，永久免年費',
      },
      {
        name: 'Amex Everyday Credit Card',
        annualFee: 0,
        pointsPreserved: '個人免年費保留 MR 點數池',
        benefits: '超市 2.4x MR 返點，免年費',
      },
    ],
    timingRule: 'Amex 簽帳卡（Charge Card）無法直接降級為免年費信用卡。請在關卡前確認名下已持有 BBP 或 Everyday！',
    phoneScript: '“I would like to cancel my Platinum Card to avoid the $695 annual fee. I already have another MR-earning card on my profile to retain my points.”',
    warningNote: '注意：務必在持卡滿整整 365 天且年費入賬後再關卡，否則會觸發 Amex 开卡奖励扣回 (Clawback) 惩罚！',
  },
  {
    sourceCard: 'Citi Strata Premier',
    sourceIssuer: 'Citi',
    currentAnnualFee: 95,
    targetCards: [
      {
        name: 'Citi Custom Cash',
        annualFee: 0,
        pointsPreserved: '100% 保留 ThankYou Points (TYP)',
        benefits: '每月最高消費類別自動享 5% 返點（上限 $500/月）',
      },
      {
        name: 'Citi Double Cash',
        annualFee: 0,
        pointsPreserved: '100% 保留 TYP 點數',
        benefits: '全類別 2% 返現/返點，免年費神卡',
      },
    ],
    timingRule: '年費入賬後 37 天內致電客服完成轉卡 (Product Change)，年費全額退還。',
    phoneScript: '“Hello, I would like to convert my Citi Premier card into a Citi Custom Cash card.”',
  },
  {
    sourceCard: 'Capital One Venture X',
    sourceIssuer: 'Capital One',
    currentAnnualFee: 395,
    targetCards: [
      {
        name: 'Capital One VentureOne',
        annualFee: 0,
        pointsPreserved: '100% 保留 Venture 里程與轉點夥伴功能',
        benefits: '所有消費 1.25x 里程，免年費',
      },
      {
        name: 'Capital One Quicksilver',
        annualFee: 0,
        pointsPreserved: '里程可轉換為返現',
        benefits: '1.5% 返現',
      },
    ],
    timingRule: '年費出賬後 30 天內致電或在 App 內「Special Offers」中自行點選轉卡。',
    phoneScript: '“I want to explore product change options for my Venture X to a zero-annual-fee card.”',
  },
];

export const ProductChangeGuideModal: React.FC<ProductChangeGuideModalProps> = ({ isOpen, onClose }) => {
  const language = useAppStore((s) => s.language);
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (!isOpen) return null;

  const currentPath = DOWNGRADE_PATHS[selectedIdx];
  const localize = (zh: string) => (language === 'en' ? EN_TRANSLATIONS[zh] ?? zh : zh);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-800 p-6 space-y-5 bg-slate-950 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-black text-white">
                {language === 'en' ? 'Safe Card Downgrade & Points Retention Guide' : '🛡️ 信用卡安全降級與保點轉卡向導'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'en'
                  ? 'Avoid annual fees without losing accumulated UR, MR, or TYP points'
                  : '免交昂貴年費，同時 100% 保全數十萬累積點數的無痛轉卡路線'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {DOWNGRADE_PATHS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedIdx === idx
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {item.sourceCard.split('/')[0]} (${item.currentAnnualFee})
            </button>
          ))}
        </div>

        {/* Selected Downgrade Details */}
        <div className="space-y-4">
          {/* Target Cards Box */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300">
              {language === 'en' ? 'Recommended Zero-Fee Target Cards (可降級目標卡片)' : '推薦免年費降級目標卡片'}:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentPath.targetCards.map((target, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white">{target.name}</h5>
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      ${target.annualFee}/yr
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-300 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{localize(target.pointsPreserved)}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{localize(target.benefits)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Golden Timing Rule */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs space-y-1 text-slate-300">
            <div className="flex items-center space-x-1.5 font-bold text-indigo-300">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>{language === 'en' ? 'Golden Timing Rule' : '黃金操作時機'}:</span>
            </div>
            <p className="text-[11px] leading-relaxed pl-5">{localize(currentPath.timingRule)}</p>
          </div>

          {/* Phone Script */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1 text-slate-300">
            <div className="flex items-center space-x-1.5 font-bold text-amber-300">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>{language === 'en' ? 'Customer Service Phone / Chat Script' : '致電/線上客服談判話術'}:</span>
            </div>
            <p className="text-[11px] italic font-mono text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
              {currentPath.phoneScript}
            </p>
          </div>

          {/* Warning Note */}
          {currentPath.warningNote && (
            <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-300 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{localize(currentPath.warningNote)}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20"
          >
            {language === 'en' ? 'Understood' : '我已瞭解'}
          </button>
        </div>
      </div>
    </div>
  );
};
