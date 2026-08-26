import React, { useState } from 'react';
import {
  Sparkles,
  CreditCard as CardIcon,
  Hotel,
  Plane,
  Check,
  ArrowRight,
  ArrowLeft,
  X,
  ShieldCheck,
} from 'lucide-react';
import {
  MOCK_CARDS,
  MOCK_HOTEL_PROGRAMS,
  MOCK_AIRLINE_PROGRAMS,
  MOCK_CAR_RENTALS,
  HOTEL_TIER_OPTIONS,
  AIRLINE_TIER_OPTIONS,
} from '../data/mockData';
import { useAppStore } from '../store/useAppStore';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({ isOpen, onClose }) => {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const language = useAppStore((s) => s.language);

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Selected Cards
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([
    'card-1', // Amex Plat
    'card-3', // CSR
    'card-6', // Hyatt
  ]);

  // Step 2: Hotel & Airline & Car selections with custom tiers
  const [hotelTiers, setHotelTiers] = useState<Record<string, string>>({
    'hotel-1': 'Discoverist',
    'hotel-2': 'Gold Elite',
    'hotel-3': 'Gold',
    'hotel-4': 'Platinum Elite',
    'hotel-5': 'Gold',
  });

  const [airlineTiers, setAirlineTiers] = useState<Record<string, string>>({
    'air-1': 'General Member',
    'air-2': 'General Member',
    'air-3': 'General Member',
    'air-4': 'Member',
    'air-5': 'Member',
  });

  const [carTiers] = useState<Record<string, string>>({
    'car-1': "President's Circle",
    'car-2': 'Executive Elite',
    'car-3': "President's Club",
    'car-4': 'Plus Silver',
    'car-5': 'Fastbreak Member',
  });

  if (!isOpen) return null;

  const toggleCard = (id: string) => {
    setSelectedCardIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    const finalCards = MOCK_CARDS.filter((c) => selectedCardIds.includes(c.id)).map((c) => ({
      ...c,
      currentBalance: 0, // Fresh balance
    }));

    const finalHotels = MOCK_HOTEL_PROGRAMS.map((h) => ({
      ...h,
      statusTier: hotelTiers[h.id] || h.statusTier,
      pointsBalance: 0,
      nightsThisYear: 0,
      fncs: [],
    }));

    const finalAirlines = MOCK_AIRLINE_PROGRAMS.map((a) => ({
      ...a,
      statusTier: airlineTiers[a.id] || a.statusTier,
      milesBalance: 0,
    }));

    const finalCars = MOCK_CAR_RENTALS.map((c) => ({
      ...c,
      statusTier: carTiers[c.id] || c.statusTier,
      pointsBalance: 0,
      freeDays: 0,
    }));

    completeOnboarding({
      cards: finalCards,
      hotels: finalHotels,
      airlines: finalAirlines,
      cars: finalCars,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-panel rounded-3xl border border-slate-800 shadow-2xl bg-[#090d16] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header with Step Progress */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">{language === 'en' ? 'Build My Real Wallet (Wallet Setup)' : '建立我的真實錢包 (Wallet Setup)'}</h2>
              <p className="text-xs text-slate-400">{language === 'en' ? 'It only takes 30 seconds to pick the real cards and memberships you own.' : '只需 30 秒，挑選您擁有的真實卡片與會籍'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 border-b border-slate-800 text-xs text-center font-semibold">
          <div
            className={`py-2.5 flex items-center justify-center space-x-1.5 border-b-2 transition-all ${
              step === 1 ? 'border-amber-400 text-amber-300 bg-amber-500/5' : 'border-transparent text-slate-500'
            }`}
          >
            <CardIcon className="w-3.5 h-3.5" />
            <span>{language === 'en' ? '1. Select Credit Cards' : '1. 勾選信用卡'}</span>
          </div>
          <div
            className={`py-2.5 flex items-center justify-center space-x-1.5 border-b-2 transition-all ${
              step === 2 ? 'border-amber-400 text-amber-300 bg-amber-500/5' : 'border-transparent text-slate-500'
            }`}
          >
            <Hotel className="w-3.5 h-3.5" />
            <span>{language === 'en' ? '2. Hotel/Airline Tiers' : '2. 酒店/航司等級'}</span>
          </div>
          <div
            className={`py-2.5 flex items-center justify-center space-x-1.5 border-b-2 transition-all ${
              step === 3 ? 'border-amber-400 text-amber-300 bg-amber-500/5' : 'border-transparent text-slate-500'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{language === 'en' ? '3. Finish Setup' : '3. 完成啟用'}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: Select Cards */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  {language === 'en' ? `Tap to select the cards in your wallet (${selectedCardIds.length} selected):` : `點擊勾選您目前皮夾中擁有的卡片（已選 ${selectedCardIds.length} 張）：`}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCardIds([])}
                  className="text-xs text-slate-500 hover:text-amber-400"
                >
                  {language === 'en' ? 'Deselect All (Start with an Empty Wallet)' : '全不選 (從空錢包開始)'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MOCK_CARDS.map((card) => {
                  const isSelected = selectedCardIds.includes(card.id);
                  return (
                    <div
                      key={card.id}
                      onClick={() => toggleCard(card.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/5'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] uppercase font-bold text-slate-400">
                            {card.issuer}
                          </span>
                          <span className="text-[10px] text-slate-500">• ${card.annualFee}/yr</span>
                        </div>
                        <div className="text-xs font-bold text-white truncate max-w-[200px]">
                          {card.name}
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-amber-400 border-amber-400 text-slate-950'
                            : 'border-slate-700 bg-slate-950'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Hotel & Airline Tiers */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Hotels */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-white">
                  <Hotel className="w-4 h-4 text-purple-400" />
                  <span>{language === 'en' ? 'Hotel Loyalty Programs (Set Your Real Status Tiers)' : '酒店常旅客計畫 (自訂真實會籍等級)'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MOCK_HOTEL_PROGRAMS.map((hotel) => (
                    <div key={hotel.id} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
                      <div className="text-xs font-bold text-white truncate">{hotel.name}</div>
                      <select
                        value={hotelTiers[hotel.id] || hotel.statusTier}
                        onChange={(e) =>
                          setHotelTiers({ ...hotelTiers, [hotel.id]: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-400"
                      >
                        {(HOTEL_TIER_OPTIONS[hotel.id] || [hotel.statusTier]).map((tier) => (
                          <option key={tier} value={tier}>
                            👑 {tier}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Airlines */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-white">
                  <Plane className="w-4 h-4 text-sky-400" />
                  <span>{language === 'en' ? 'Airline Loyalty Programs (Frequent Flyer Status)' : '航空公司常旅客計畫 (飛行會籍)'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MOCK_AIRLINE_PROGRAMS.map((air) => (
                    <div key={air.id} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
                      <div className="text-xs font-bold text-white truncate">{air.name}</div>
                      <select
                        value={airlineTiers[air.id] || air.statusTier}
                        onChange={(e) =>
                          setAirlineTiers({ ...airlineTiers, [air.id]: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-sky-300 font-semibold focus:outline-none focus:border-sky-400"
                      >
                        {(AIRLINE_TIER_OPTIONS[air.id] || [air.statusTier]).map((tier) => (
                          <option key={tier} value={tier}>
                            ✈️ {tier}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-extrabold text-white">{language === 'en' ? 'Your Personal Wallet Is Almost Ready!' : '您的個人專屬錢包即將生成！'}</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {language === 'en' ? `All demo data will be cleared, and the ${selectedCardIds.length} real cards you selected plus your specified hotel/airline tiers will be loaded.` : `所有示範虛擬數據將被清除，並直接載入您剛才勾選的 ${selectedCardIds.length} 張真實卡片與指定的酒店/航司會籍等級。`}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-2 text-xs max-w-md mx-auto">
                <div className="flex justify-between text-slate-300">
                  <span>{language === 'en' ? 'Selected Cards:' : '已選卡片數量:'}</span>
                  <strong className="text-white">{language === 'en' ? `${selectedCardIds.length} credit cards` : `${selectedCardIds.length} 張信用卡`}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{language === 'en' ? 'Initial Points & Miles Status:' : '點數與里程初始狀態:'}</span>
                  <strong className="text-emerald-400">{language === 'en' ? 'Clean Slate (Edit Anytime with ✏️)' : '乾淨空白 (隨時可點 ✏️ 更新)'}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{language === 'en' ? 'Membership & Benefits Calculation:' : '會籍與福利計算:'}</span>
                  <strong className="text-amber-300">{language === 'en' ? 'Automatically Matched from the Tiers You Selected' : '依真實勾選會籍自動匹配'}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as 1 | 2)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Back' : '上一步'}</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as 2 | 3)}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
            >
              <span>{language === 'en' ? 'Next' : '下一步'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{language === 'en' ? '🚀 Generate My Wallet' : '🚀 生成我的專屬錢包'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
