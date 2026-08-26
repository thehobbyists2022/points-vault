import React, { useState } from 'react';
import { X, Sparkles, Plus, Search, ShieldCheck, Layers } from 'lucide-react';
import type { CreditCard } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';

const isoDaysFromNow = (days: number): string =>
  new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: CreditCard) => void;
}

// Popular US credit card presets
const PRESET_CARDS: Omit<CreditCard, 'id' | 'player'>[] = [
  {
    name: "Chase Sapphire Preferred",
    issuer: "Chase",
    network: "Visa",
    annualFee: 95,
    colorGradient: "from-blue-900 via-indigo-900 to-slate-900",
    pointsCurrency: "Chase UR",
    currentBalance: 0,
    cppValue: 1.5,
    referralUrl: "https://www.referyourchasecard.com/sapphire/preferred",
    referralBonus: "60,000 UR Points",
    referralValue: 900,
    msr: {
      requiredSpend: 4000,
      currentSpend: 0,
      bonusPoints: 60000,
      deadlineDaysRemaining: 90,
      deadlineDate: isoDaysFromNow(90),
    },
    perks: [
      { id: "csp-hotel-credit", title: "$50 Annual Chase Travel Hotel Credit", value: 50, frequency: "Annual", used: false, category: "Travel" },
      { id: "csp-dashpass", title: "Complimentary DoorDash DashPass", value: 120, frequency: "Annual", used: false, category: "Dining" },
    ],
    multipliers: [
      { category: "Chase Travel", rate: 5, details: "5x on travel purchased through Chase Travel" },
      { category: "Dining", rate: 3, details: "3x on dining, takeout & eligible delivery services" },
      { category: "Online Grocery", rate: 3, details: "3x on online grocery purchases (excl. Target/Walmart)" },
      { category: "Streaming", rate: 3, details: "3x on select streaming services" },
      { category: "Travel", rate: 2, details: "2x on all other travel purchases worldwide" },
    ],
    applicationDate: new Date().toISOString().slice(0, 10),
    is524Eligible: true,
  },
  {
    name: "Chase Freedom Flex",
    issuer: "Chase",
    network: "Mastercard",
    annualFee: 0,
    colorGradient: "from-cyan-900 via-blue-950 to-slate-900",
    pointsCurrency: "Chase UR",
    currentBalance: 0,
    cppValue: 1.5,
    referralUrl: "https://www.referyourchasecard.com/freedom/flex",
    referralBonus: "20,000 UR Points",
    referralValue: 300,
    msr: {
      requiredSpend: 500,
      currentSpend: 0,
      bonusPoints: 20000,
      deadlineDaysRemaining: 90,
      deadlineDate: isoDaysFromNow(90),
    },
    perks: [
      { id: "cff-cellphone-protection", title: "$800 Cell Phone Protection ($50 deductible)", value: 100, frequency: "Annual", used: false, category: "Shopping" },
    ],
    multipliers: [
      { category: "Rotating Categories", rate: 5, details: "5x on up to $1,500 in combined purchases in quarterly categories" },
      { category: "Chase Travel", rate: 5, details: "5x on travel purchased through Chase Travel" },
      { category: "Dining", rate: 3, details: "3x on dining at restaurants, takeout & delivery" },
      { category: "Drugstores", rate: 3, details: "3x on drugstore purchases" },
    ],
    applicationDate: new Date().toISOString().slice(0, 10),
    is524Eligible: true,
  },
  {
    name: "Chase Freedom Unlimited",
    issuer: "Chase",
    network: "Visa",
    annualFee: 0,
    colorGradient: "from-slate-800 via-slate-900 to-indigo-950",
    pointsCurrency: "Chase UR",
    currentBalance: 0,
    cppValue: 1.5,
    referralUrl: "https://www.referyourchasecard.com/freedom/unlimited",
    referralBonus: "20,000 UR Points",
    referralValue: 300,
    msr: {
      requiredSpend: 500,
      currentSpend: 0,
      bonusPoints: 20000,
      deadlineDaysRemaining: 90,
      deadlineDate: isoDaysFromNow(90),
    },
    perks: [],
    multipliers: [
      { category: "Chase Travel", rate: 5, details: "5x on travel booked through Chase Travel" },
      { category: "Dining", rate: 3, details: "3x on dining and takeout" },
      { category: "Drugstores", rate: 3, details: "3x on drugstores" },
      { category: "All Purchases", rate: 1.5, details: "1.5% cash back / 1.5x UR on all other purchases" },
    ],
    applicationDate: new Date().toISOString().slice(0, 10),
    is524Eligible: true,
  },
  {
    name: "American Express Green Card",
    issuer: "Amex",
    network: "Amex",
    annualFee: 150,
    colorGradient: "from-emerald-900 via-teal-950 to-slate-900",
    pointsCurrency: "Amex MR",
    currentBalance: 0,
    cppValue: 1.9,
    referralUrl: "https://refer.amex.us/green",
    referralBonus: "40,000 MR Points",
    referralValue: 760,
    msr: {
      requiredSpend: 3000,
      currentSpend: 0,
      bonusPoints: 40000,
      deadlineDaysRemaining: 180,
      deadlineDate: isoDaysFromNow(180),
    },
    perks: [
      { id: "amex-green-clear", title: "$189 Annual CLEAR Plus Credit", value: 189, frequency: "Annual", used: false, category: "Travel" },
      { id: "amex-green-lounge", title: "$100 Annual LoungeBuddy Credit", value: 100, frequency: "Annual", used: false, category: "Lounge" },
    ],
    multipliers: [
      { category: "Travel", rate: 3, details: "3x on travel (flights, hotels, transit, rideshares, tolls)" },
      { category: "Transit", rate: 3, details: "3x on subways, trains, buses, ferries, parking" },
      { category: "Dining", rate: 3, details: "3x on restaurants worldwide and takeout" },
    ],
    applicationDate: new Date().toISOString().slice(0, 10),
    is524Eligible: true,
  },
  {
    name: "Citi Strata Premier",
    issuer: "Citi",
    network: "Mastercard",
    annualFee: 95,
    colorGradient: "from-blue-950 via-slate-900 to-indigo-950",
    pointsCurrency: "Citi ThankYou",
    currentBalance: 0,
    cppValue: 1.6,
    msr: {
      requiredSpend: 4000,
      currentSpend: 0,
      bonusPoints: 75000,
      deadlineDaysRemaining: 90,
      deadlineDate: isoDaysFromNow(90),
    },
    perks: [
      { id: "citi-premier-hotel", title: "$100 Annual Hotel Savings Benefit ($500+ stay)", value: 100, frequency: "Annual", used: false, category: "Travel" },
    ],
    multipliers: [
      { category: "Citi Travel", rate: 10, details: "10x on hotels, car rentals, and attractions on cititravel.com" },
      { category: "Flights & Hotels", rate: 3, details: "3x on air travel and other hotel bookings" },
      { category: "Dining", rate: 3, details: "3x on restaurants" },
      { category: "Supermarkets", rate: 3, details: "3x on supermarkets" },
      { category: "Gas & EV Charging", rate: 3, details: "3x on gas stations and EV charging" },
    ],
    applicationDate: new Date().toISOString().slice(0, 10),
    is524Eligible: true,
  },
  {
    name: "Capital One Savor",
    issuer: "Capital One",
    network: "Mastercard",
    annualFee: 0,
    colorGradient: "from-amber-950 via-slate-900 to-rose-950",
    pointsCurrency: "Cash Back",
    currentBalance: 0,
    cppValue: 1.0,
    msr: {
      requiredSpend: 500,
      currentSpend: 0,
      bonusPoints: 25000,
      deadlineDaysRemaining: 90,
      deadlineDate: isoDaysFromNow(90),
    },
    perks: [],
    multipliers: [
      { category: "Dining", rate: 3, details: "3% cash back on dining" },
      { category: "Entertainment", rate: 3, details: "3% cash back on entertainment" },
      { category: "Popular Streaming", rate: 3, details: "3% cash back on popular streaming services" },
      { category: "Grocery Stores", rate: 3, details: "3% cash back at grocery stores" },
    ],
    applicationDate: new Date().toISOString().slice(0, 10),
    is524Eligible: true,
  },
  {
    name: "World of Hyatt Credit Card",
    issuer: "Chase",
    network: "Visa",
    annualFee: 95,
    colorGradient: "from-emerald-950 via-slate-900 to-teal-950",
    pointsCurrency: "World of Hyatt",
    currentBalance: 0,
    cppValue: 2.1,
    msr: {
      requiredSpend: 3000,
      currentSpend: 0,
      bonusPoints: 30000,
      deadlineDaysRemaining: 90,
      deadlineDate: isoDaysFromNow(90),
    },
    perks: [
      { id: "hyatt-fnc-annual", title: "Annual Category 1-4 Free Night Award", value: 250, frequency: "Annual", used: false, category: "Travel" },
      { id: "hyatt-discoverist", title: "Automatic Hyatt Discoverist Status", value: 150, frequency: "Annual", used: false, category: "Travel" },
    ],
    multipliers: [
      { category: "Hyatt Hotels", rate: 9, details: "Up to 9x total points per $1 spent at Hyatt (4x card + 5x member)" },
      { category: "Dining", rate: 2, details: "2x on restaurants & takeout" },
      { category: "Flights", rate: 2, details: "2x on airline tickets purchased directly with the airline" },
      { category: "Transit", rate: 2, details: "2x on local transit and commuting" },
      { category: "Fitness", rate: 2, details: "2x on fitness club and gym memberships" },
    ],
    applicationDate: new Date().toISOString().slice(0, 10),
    is524Eligible: true,
  },
  {
    name: "Marriott Bonvoy Boundless",
    issuer: "Chase",
    network: "Visa",
    annualFee: 95,
    colorGradient: "from-rose-950 via-slate-900 to-indigo-950",
    pointsCurrency: "Marriott Bonvoy",
    currentBalance: 0,
    cppValue: 0.84,
    msr: {
      requiredSpend: 3000,
      currentSpend: 0,
      bonusPoints: 105000,
      deadlineDaysRemaining: 90,
      deadlineDate: isoDaysFromNow(90),
    },
    perks: [
      { id: "marriott-fnc-annual", title: "Annual Free Night Award (up to 35,000 points)", value: 200, frequency: "Annual", used: false, category: "Travel" },
      { id: "marriott-silver", title: "Automatic Silver Elite Status & 15 Elite Night Credits", value: 100, frequency: "Annual", used: false, category: "Travel" },
    ],
    multipliers: [
      { category: "Marriott Hotels", rate: 17, details: "Up to 17x total points at hotels participating in Marriott Bonvoy" },
      { category: "Grocery / Dining / Gas", rate: 3, details: "3x on up to $6k total per year in grocery, dining, and gas" },
      { category: "All Purchases", rate: 2, details: "2x on all other purchases" },
    ],
    applicationDate: new Date().toISOString().slice(0, 10),
    is524Eligible: true,
  },
  {
    name: "Hilton Honors Surpass Card",
    issuer: "Amex",
    network: "Amex",
    annualFee: 150,
    colorGradient: "from-indigo-950 via-slate-900 to-blue-950",
    pointsCurrency: "Hilton Honors",
    currentBalance: 0,
    cppValue: 0.6,
    msr: {
      requiredSpend: 3000,
      currentSpend: 0,
      bonusPoints: 130000,
      deadlineDaysRemaining: 180,
      deadlineDate: isoDaysFromNow(180),
    },
    perks: [
      { id: "hilton-credit-quarterly", title: "$50 Quarterly Hilton Statement Credit ($200/yr)", value: 200, frequency: "Quarterly", used: false, category: "Travel" },
      { id: "hilton-gold", title: "Automatic Hilton Honors Gold Status (Free Breakfast/Credits)", value: 200, frequency: "Annual", used: false, category: "Travel" },
    ],
    multipliers: [
      { category: "Hilton Hotels", rate: 12, details: "12x on eligible purchases at Hilton hotels & resorts" },
      { category: "Dining", rate: 6, details: "6x on US restaurants, takeout & delivery" },
      { category: "Supermarkets", rate: 6, details: "6x at US supermarkets" },
      { category: "Gas Stations", rate: 6, details: "6x at US gas stations" },
      { category: "Online Retail", rate: 4, details: "4x on US online retail purchases" },
    ],
    applicationDate: new Date().toISOString().slice(0, 10),
    is524Eligible: true,
  },
];

export const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose, onAddCard }) => {
  const language = useAppStore((s) => s.language);
  const activePlayer = useAppStore((s) => s.profile.activePlayer);
  const defaultPlayer = activePlayer === 'P2' ? 'P2' : 'P1';

  const [activeMode, setActiveMode] = useState<'presets' | 'custom'>('presets');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(null);
  const [presetPlayer, setPresetPlayer] = useState<'P1' | 'P2'>(defaultPlayer);
  const presetInitialBalance = '0';

  // Custom card form state
  const [customName, setCustomName] = useState('');
  const [customIssuer, setCustomIssuer] = useState<CreditCard['issuer']>('Chase');
  const [customAnnualFee, setCustomAnnualFee] = useState('95');
  const [customCurrency, setCustomCurrency] = useState('Points');
  const [customCpp, setCustomCpp] = useState('1.5');
  const [customBalance, setCustomBalance] = useState('0');
  const [customPlayer, setCustomPlayer] = useState<'P1' | 'P2'>(defaultPlayer);
  const [hasMsr, setHasMsr] = useState(true);
  const [msrRequired, setMsrRequired] = useState('4000');
  const [msrBonus, setMsrBonus] = useState('60000');
  const [msrDays, setMsrDays] = useState('90');

  if (!isOpen) return null;

  const filteredPresets = PRESET_CARDS.filter((preset) => {
    const q = searchQuery.toLowerCase();
    return preset.name.toLowerCase().includes(q) || preset.issuer.toLowerCase().includes(q) || preset.pointsCurrency.toLowerCase().includes(q);
  });

  const handleAddPreset = (preset: typeof PRESET_CARDS[0]) => {
    const newCard: CreditCard = {
      ...preset,
      id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      player: presetPlayer,
      currentBalance: parseFloat(presetInitialBalance) || 0,
      applicationDate: new Date().toISOString().slice(0, 10),
    };
    onAddCard(newCard);
    onClose();
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const gradients: Record<string, string> = {
      Chase: "from-blue-950 via-slate-900 to-indigo-950",
      Amex: "from-slate-800 via-cyan-950 to-slate-900",
      Citi: "from-sky-950 via-slate-900 to-blue-950",
      "Capital One": "from-red-950 via-slate-900 to-indigo-950",
      Bilt: "from-zinc-900 via-neutral-900 to-black",
      Discover: "from-orange-950 via-slate-900 to-amber-950",
      "Bank of America": "from-rose-950 via-slate-900 to-red-950",
    };

    const newCard: CreditCard = {
      id: `card-custom-${Date.now()}`,
      name: customName.trim(),
      issuer: customIssuer,
      network: customIssuer === 'Amex' ? 'Amex' : customIssuer === 'Discover' ? 'Discover' : 'Visa',
      annualFee: parseFloat(customAnnualFee) || 0,
      colorGradient: gradients[customIssuer] || "from-slate-900 via-indigo-950 to-slate-900",
      pointsCurrency: customCurrency.trim() || 'Points',
      currentBalance: parseFloat(customBalance) || 0,
      cppValue: parseFloat(customCpp) || 1.0,
      player: customPlayer,
      applicationDate: new Date().toISOString().slice(0, 10),
      is524Eligible: true,
      perks: [],
      multipliers: [{ category: "All Purchases", rate: 1, details: "1x on all general spend" }],
      msr: hasMsr
        ? {
            requiredSpend: parseFloat(msrRequired) || 0,
            currentSpend: 0,
            bonusPoints: parseFloat(msrBonus) || 0,
            deadlineDaysRemaining: parseInt(msrDays, 10) || 90,
            deadlineDate: isoDaysFromNow(parseInt(msrDays, 10) || 90),
          }
        : undefined,
    };

    onAddCard(newCard);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-2xl max-h-[90vh] glass-panel rounded-3xl border border-slate-800 shadow-2xl bg-[#090d16] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t(language, 'addCardModalTitle')}</h3>
              <p className="text-xs text-slate-400">{t(language, 'addCardModalSubtitle')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Mode Buttons */}
        <div className="px-6 pt-4 pb-2 flex space-x-3 shrink-0 bg-slate-950/30">
          <button
            onClick={() => setActiveMode('presets')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 border ${
              activeMode === 'presets'
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t(language, 'tabPresets')}</span>
          </button>
          <button
            onClick={() => setActiveMode('custom')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 border ${
              activeMode === 'custom'
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{t(language, 'tabCustom')}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeMode === 'presets' ? (
            <>
              {/* Search & Config Header */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t(language, 'searchPresets')}
                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-xs text-slate-400 font-semibold">{t(language, 'playerLabel')}:</span>
                  <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setPresetPlayer('P1')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        presetPlayer === 'P1' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      P1
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresetPlayer('P2')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        presetPlayer === 'P2' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      P2
                    </button>
                  </div>
                </div>
              </div>

              {/* Preset Cards Grid */}
              <div className="space-y-3">
                {filteredPresets.map((preset, index) => {
                  const isSelected = selectedPresetIndex === index;
                  return (
                    <div
                      key={preset.name}
                      onClick={() => setSelectedPresetIndex(index)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-indigo-300 border border-slate-700">
                            {preset.issuer}
                          </span>
                          <span className="text-sm font-bold text-white">{preset.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 pt-0.5">
                          <span>{t(language, 'annualFeeLabel')}: <strong className="text-slate-200">${preset.annualFee}</strong></span>
                          <span>{t(language, 'pointsCurrency')}: <strong className="text-indigo-300">{preset.pointsCurrency}</strong></span>
                          {preset.msr && (
                            <span>{t(language, 'msrBonus')}: <strong className="text-emerald-400">+{preset.msr.bonusPoints.toLocaleString()}</strong></span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddPreset(preset);
                          }}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t(language, 'createCardBtn')}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Custom Card Form */
            <form onSubmit={handleAddCustom} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">{t(language, 'cardName')} *</label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. US Bank Altitude Reserve"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">{t(language, 'issuer')}</label>
                  <select
                    value={customIssuer}
                    onChange={(e) => setCustomIssuer(e.target.value as CreditCard['issuer'])}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Chase">Chase</option>
                    <option value="Amex">Amex</option>
                    <option value="Citi">Citi</option>
                    <option value="Capital One">Capital One</option>
                    <option value="Bilt">Bilt</option>
                    <option value="Discover">Discover</option>
                    <option value="Bank of America">Bank of America</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">{t(language, 'annualFeeLabel')}</label>
                  <input
                    type="number"
                    min="0"
                    value={customAnnualFee}
                    onChange={(e) => setCustomAnnualFee(e.target.value)}
                    placeholder="95"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">{t(language, 'pointsCurrency')}</label>
                  <input
                    type="text"
                    value={customCurrency}
                    onChange={(e) => setCustomCurrency(e.target.value)}
                    placeholder="e.g. US Bank Points"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">{t(language, 'cppValuation')}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={customCpp}
                    onChange={(e) => setCustomCpp(e.target.value)}
                    placeholder="1.5"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">{t(language, 'currentBalanceLabel')}</label>
                  <input
                    type="number"
                    min="0"
                    value={customBalance}
                    onChange={(e) => setCustomBalance(e.target.value)}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">{t(language, 'playerLabel')}</label>
                  <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setCustomPlayer('P1')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        customPlayer === 'P1' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      P1
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomPlayer('P2')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        customPlayer === 'P2' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      P2
                    </button>
                  </div>
                </div>
              </div>

              {/* MSR Toggle & Fields */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{t(language, 'msrDeadline')}</span>
                  </label>
                  <input
                    type="checkbox"
                    checked={hasMsr}
                    onChange={(e) => setHasMsr(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
                  />
                </div>

                {hasMsr && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">{t(language, 'msrRequired')}</label>
                      <input
                        type="number"
                        min="0"
                        value={msrRequired}
                        onChange={(e) => setMsrRequired(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">{t(language, 'msrBonus')}</label>
                      <input
                        type="number"
                        min="0"
                        value={msrBonus}
                        onChange={(e) => setMsrBonus(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">{t(language, 'msrDays')}</label>
                      <input
                        type="number"
                        min="1"
                        value={msrDays}
                        onChange={(e) => setMsrDays(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {t(language, 'cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-98 flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t(language, 'createCardBtn')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
