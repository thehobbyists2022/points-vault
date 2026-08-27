import React, { useState } from 'react';
import {
  Crown,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  CreditCard,
  Users,
  FileSpreadsheet,
  BellRing,
  TrendingUp,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({ isOpen, onClose }) => {
  const language = useAppStore((s) => s.language);
  const isPro = useAppStore((s) => s.isPro);
  const proPlan = useAppStore((s) => s.proPlan);
  const proExpiresAt = useAppStore((s) => s.proExpiresAt);
  const upgradeToPro = useAppStore((s) => s.upgradeToPro);
  const cancelPro = useAppStore((s) => s.cancelPro);

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | 'lifetime'>('annual');
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    const validCodes = ['EARLYBIRD', 'VIP2026', 'PROPOINTS', 'DEEPSEEK', 'GOOGLEPLAY'];
    if (validCodes.includes(promoCode.trim().toUpperCase())) {
      upgradeToPro('lifetime', promoCode);
      setPromoMessage({
        type: 'success',
        text: t(language, 'proCodeSuccess'),
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setPromoMessage({
        type: 'error',
        text: t(language, 'proCodeInvalid'),
      });
    }
  };

  const handleSubscribe = () => {
    setIsProcessing(true);
    // Simulate instant secure processing
    setTimeout(() => {
      upgradeToPro(selectedPlan);
      setIsProcessing(false);
      onClose();
    }, 800);
  };

  const features = [
    { icon: CreditCard, text: t(language, 'proFeature1') },
    { icon: Users, text: t(language, 'proFeature2') },
    { icon: FileSpreadsheet, text: t(language, 'proFeature3') },
    { icon: BellRing, text: t(language, 'proFeature4') },
    { icon: TrendingUp, text: t(language, 'proFeature5') },
    { icon: Zap, text: t(language, 'proFeature6') },
    { icon: Sparkles, text: t(language, 'proFeature7') },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-[#090d16] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isPro ? (
          /* Active Pro Status View */
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Crown className="w-8 h-8 text-amber-400 fill-amber-400" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2">
                {t(language, 'proActiveTitle')}
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase">
                  {proPlan}
                </span>
              </h2>
              <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
                {t(language, 'proActiveDesc')}
              </p>
              {proExpiresAt && (
                <p className="text-xs text-slate-500 mt-1">
                  Next renewal: {new Date(proExpiresAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-left max-w-md mx-auto space-y-2.5">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{feat.text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-sm shadow-md hover:brightness-110 transition-all"
              >
                {language === 'en' ? 'Back to App' : '返回應用'}
              </button>
              <button
                onClick={cancelPro}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-colors"
              >
                {language === 'en' ? 'Cancel Pro (Test Reset)' : '重設為免費版 (測試)'}
              </button>
            </div>
          </div>
        ) : (
          /* Upgrade View */
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2 pt-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide uppercase">
                <Crown className="w-3.5 h-3.5 fill-amber-400" />
                <span>PointsVault Pro</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {t(language, 'proUpgradeTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                {t(language, 'proUpgradeSubtitle')}
              </p>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              {/* Monthly */}
              <div
                onClick={() => setSelectedPlan('monthly')}
                className={`relative rounded-2xl p-4 cursor-pointer transition-all border text-left flex flex-col justify-between ${
                  selectedPlan === 'monthly'
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t(language, 'proMonthly')}
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white">{t(language, 'proMonthlyPrice')}</span>
                    <span className="text-xs text-slate-400">{t(language, 'proMonthlyPeriod')}</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                  {language === 'en' ? 'Flexible cancel anytime' : '隨時可彈性取消'}
                </div>
              </div>

              {/* Annual (Best Value / Most Popular) */}
              <div
                onClick={() => setSelectedPlan('annual')}
                className={`relative rounded-2xl p-4 cursor-pointer transition-all border text-left flex flex-col justify-between ${
                  selectedPlan === 'annual'
                    ? 'bg-gradient-to-b from-amber-950/40 to-slate-900/90 border-amber-400 shadow-xl shadow-amber-500/15 ring-2 ring-amber-400'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-extrabold uppercase tracking-wide shadow-md whitespace-nowrap">
                  {t(language, 'proAnnualBadge')}
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {t(language, 'proAnnual')}
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white">{t(language, 'proAnnualPrice')}</span>
                    <span className="text-xs text-slate-400">{t(language, 'proAnnualPeriod')}</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-amber-500/20 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{language === 'en' ? '7-Day Free Trial included' : '含 7 天免費試用'}</span>
                </div>
              </div>

              {/* Lifetime Buyout */}
              <div
                onClick={() => setSelectedPlan('lifetime')}
                className={`relative rounded-2xl p-4 cursor-pointer transition-all border text-left flex flex-col justify-between ${
                  selectedPlan === 'lifetime'
                    ? 'bg-purple-950/40 border-purple-400 shadow-lg shadow-purple-500/10 ring-1 ring-purple-400'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[9px] font-bold uppercase tracking-wide">
                  {t(language, 'proLifetimeBadge')}
                </div>
                <div>
                  <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                    {t(language, 'proLifetime')}
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white">{t(language, 'proLifetimePrice')}</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-purple-300 font-medium">
                  {t(language, 'proLifetimePeriod')}
                </div>
              </div>
            </div>

            {/* Feature Comparison List */}
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-2.5">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                {language === 'en' ? 'Everything in Pro includes:' : 'Pro 尊享會員全套特權：'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 p-1.5 rounded-lg bg-slate-900/40">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300 leading-tight">{feat.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Code Box */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder={t(language, 'proPromoCodePlaceholder')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 uppercase tracking-wider"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors whitespace-nowrap"
                >
                  {t(language, 'proApplyCode')}
                </button>
              </div>
              {promoMessage && (
                <div
                  className={`text-xs px-3 py-1.5 rounded-lg ${
                    promoMessage.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {promoMessage.text}
                </div>
              )}
            </form>

            {/* Subscribe Action Button */}
            <div className="space-y-3 pt-1">
              <button
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wide shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span>{language === 'en' ? 'Activating Pro...' : '正在開通 Pro 會員...'}</span>
                ) : (
                  <>
                    <span>
                      {selectedPlan === 'lifetime'
                        ? `${language === 'en' ? 'Get Lifetime Access' : '獲取終身買斷'} ($79.99)`
                        : selectedPlan === 'annual'
                        ? `${language === 'en' ? 'Start 7-Day Free Trial' : '開始 7 天免費試用'} ($29.99/yr)`
                        : `${language === 'en' ? 'Start Monthly Plan' : '開通月度訂閱'} ($4.99/mo)`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-4 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'en' ? '100% Private Local-First' : '本地離線私密加密'}</span>
                </span>
                <span>•</span>
                <span>{language === 'en' ? 'Cancel anytime' : '隨時可退訂'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
