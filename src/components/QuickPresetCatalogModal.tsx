import React, { useState } from 'react';
import { X, Sparkles, Plus, Check, Plane, Building2, CreditCard, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';
import type { CreditCard as CardType } from '../data/mockData';

interface QuickPresetCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: 'all' | 'cards' | 'airlines' | 'hotels';
}

interface PresetItem {
  id: string;
  type: 'card' | 'airline' | 'hotel';
  name: string;
  categoryName: string;
  colorGradient: string;
  defaultCurrency: string;
  defaultCpp: number;
  logoText: string;
  cardData?: Partial<CardType>;
  programId?: string;
  deepLink?: string;
}

const PRESET_CATALOG: PresetItem[] = [
  // Top Cards
  {
    id: 'preset-amex-gold',
    type: 'card',
    name: 'Amex Gold Card',
    categoryName: 'American Express',
    colorGradient: 'from-amber-600 via-yellow-500 to-amber-700',
    defaultCurrency: 'Membership Rewards',
    defaultCpp: 1.2,
    logoText: 'AMEX',
    deepLink: 'https://www.americanexpress.com',
    cardData: {
      name: 'Amex Gold Card',
      issuer: 'Amex',
      network: 'Amex',
      annualFee: 325,
      pointsCurrency: 'Membership Rewards',
      colorGradient: 'from-amber-600 via-yellow-500 to-amber-700',
      cppValue: 1.2,
      multipliers: [
        { category: 'Dining & Restaurants', rate: 4 },
        { category: 'U.S. Supermarkets', rate: 4 },
        { category: 'Flights', rate: 3 },
        { category: 'All other', rate: 1 },
      ],
      perks: [
        { id: 'perk-gold-dining', title: '$10/mo Dining Credit (Grubhub/Cheesecake)', value: 120, frequency: 'Monthly', used: false, category: 'Dining' },
        { id: 'perk-gold-uber', title: '$10/mo Uber Cash', value: 120, frequency: 'Monthly', used: false, category: 'Dining' },
        { id: 'perk-gold-resy', title: '$50 Semi-annual Resy Credit', value: 100, frequency: 'Annual', used: false, category: 'Dining' },
        { id: 'perk-gold-dunkin', title: '$7/mo Dunkin Credit', value: 84, frequency: 'Monthly', used: false, category: 'Dining' },
      ],
      is524Eligible: true,
    },
  },
  {
    id: 'preset-amex-plat',
    type: 'card',
    name: 'Amex Platinum Card',
    categoryName: 'American Express',
    colorGradient: 'from-slate-300 via-slate-400 to-slate-600',
    defaultCurrency: 'Membership Rewards',
    defaultCpp: 1.2,
    logoText: 'AMEX',
    deepLink: 'https://www.americanexpress.com',
    cardData: {
      name: 'The Platinum Card',
      issuer: 'Amex',
      network: 'Amex',
      annualFee: 695,
      pointsCurrency: 'Membership Rewards',
      colorGradient: 'from-slate-300 via-slate-400 to-slate-600',
      cppValue: 1.2,
      multipliers: [
        { category: 'Flights direct/AmexTravel', rate: 5 },
        { category: 'Prepaid Hotels AmexTravel', rate: 5 },
        { category: 'All other', rate: 1 },
      ],
      perks: [
        { id: 'perk-plat-uber', title: '$15/mo Uber Cash ($35 in Dec)', value: 200, frequency: 'Monthly', used: false, category: 'Travel' },
        { id: 'perk-plat-hotel', title: '$200 Hotel Credit (FHR/THC)', value: 200, frequency: 'Annual', used: false, category: 'Travel' },
        { id: 'perk-plat-airline', title: '$200 Airline Incidental Fee Credit', value: 200, frequency: 'Annual', used: false, category: 'Travel' },
        { id: 'perk-plat-saks', title: '$50 Semi-annual Saks Credit', value: 100, frequency: 'Annual', used: false, category: 'Shopping' },
        { id: 'perk-plat-lounge', title: 'Centurion & Priority Pass Lounges', value: 400, frequency: 'Annual', used: false, category: 'Lounge' },
      ],
      is524Eligible: true,
    },
  },
  {
    id: 'preset-chase-csp',
    type: 'card',
    name: 'Chase Sapphire Preferred',
    categoryName: 'Chase',
    colorGradient: 'from-blue-700 via-indigo-800 to-slate-900',
    defaultCurrency: 'Ultimate Rewards',
    defaultCpp: 1.5,
    logoText: 'CHASE',
    deepLink: 'https://www.chase.com',
    cardData: {
      name: 'Chase Sapphire Preferred',
      issuer: 'Chase',
      network: 'Visa',
      annualFee: 95,
      pointsCurrency: 'Ultimate Rewards',
      colorGradient: 'from-blue-700 via-indigo-800 to-slate-900',
      cppValue: 1.5,
      multipliers: [
        { category: 'Dining & Takeout', rate: 3 },
        { category: 'Online Grocery', rate: 3 },
        { category: 'Select Streaming', rate: 3 },
        { category: 'Travel', rate: 2 },
        { category: 'All other', rate: 1 },
      ],
      perks: [
        { id: 'perk-csp-hotel', title: '$50 Annual Ultimate Rewards Hotel Credit', value: 50, frequency: 'Annual', used: false, category: 'Travel' },
        { id: 'perk-csp-dd', title: 'DoorDash DashPass Subscription', value: 120, frequency: 'Annual', used: false, category: 'Dining' },
      ],
      is524Eligible: true,
    },
  },
  {
    id: 'preset-chase-csr',
    type: 'card',
    name: 'Chase Sapphire Reserve',
    categoryName: 'Chase',
    colorGradient: 'from-slate-900 via-indigo-950 to-blue-900',
    defaultCurrency: 'Ultimate Rewards',
    defaultCpp: 1.5,
    logoText: 'CHASE',
    deepLink: 'https://www.chase.com',
    cardData: {
      name: 'Chase Sapphire Reserve',
      issuer: 'Chase',
      network: 'Visa',
      annualFee: 550,
      pointsCurrency: 'Ultimate Rewards',
      colorGradient: 'from-slate-900 via-indigo-950 to-blue-900',
      cppValue: 1.5,
      multipliers: [
        { category: 'Dining', rate: 3 },
        { category: 'Travel worldwide', rate: 3 },
        { category: 'Lyft Rides', rate: 10 },
        { category: 'All other', rate: 1 },
      ],
      perks: [
        { id: 'perk-csr-travel', title: '$300 Annual Travel Credit (Automatic)', value: 300, frequency: 'Annual', used: false, category: 'Travel' },
        { id: 'perk-csr-lounge', title: 'Priority Pass Select + Sapphire Lounge', value: 400, frequency: 'Annual', used: false, category: 'Lounge' },
      ],
      is524Eligible: true,
    },
  },
  {
    id: 'preset-capone-vx',
    type: 'card',
    name: 'Capital One Venture X',
    categoryName: 'Capital One',
    colorGradient: 'from-slate-800 via-blue-900 to-indigo-950',
    defaultCurrency: 'Venture Miles',
    defaultCpp: 1.6,
    logoText: 'CAP ONE',
    deepLink: 'https://www.capitalone.com',
    cardData: {
      name: 'Capital One Venture X',
      issuer: 'Capital One',
      network: 'Visa',
      annualFee: 395,
      pointsCurrency: 'Venture Miles',
      colorGradient: 'from-slate-800 via-blue-900 to-indigo-950',
      cppValue: 1.6,
      multipliers: [
        { category: 'Hotels & Rental Cars on Portal', rate: 10 },
        { category: 'Flights on Portal', rate: 5 },
        { category: 'All other purchases', rate: 2 },
      ],
      perks: [
        { id: 'perk-vx-travel', title: '$300 Annual Capital One Travel Portal Credit', value: 300, frequency: 'Annual', used: false, category: 'Travel' },
        { id: 'perk-vx-anniversary', title: '10,000 Anniversary Bonus Miles ($100+ value)', value: 160, frequency: 'Annual', used: false, category: 'Travel' },
      ],
      is524Eligible: true,
    },
  },
  {
    id: 'preset-bilt',
    type: 'card',
    name: 'Bilt World Elite Mastercard',
    categoryName: 'Bilt Rewards',
    colorGradient: 'from-neutral-900 via-zinc-800 to-neutral-950',
    defaultCurrency: 'Bilt Rewards',
    defaultCpp: 1.8,
    logoText: 'BILT',
    deepLink: 'https://www.biltrewards.com',
    cardData: {
      name: 'Bilt World Elite Mastercard',
      issuer: 'Bilt',
      network: 'Mastercard',
      annualFee: 0,
      pointsCurrency: 'Bilt Rewards',
      colorGradient: 'from-neutral-900 via-zinc-800 to-neutral-950',
      cppValue: 1.8,
      multipliers: [
        { category: 'Rent payments (no fee)', rate: 1 },
        { category: 'Dining', rate: 3 },
        { category: 'Travel', rate: 2 },
        { category: 'Rent Day (1st of month double)', rate: 6 },
      ],
      perks: [
        { id: 'perk-bilt-rent', title: 'Pay Rent with 0% Processing Fee', value: 360, frequency: 'Annual', used: false, category: 'Shopping' },
      ],
      is524Eligible: true,
    },
  },

  // Airlines
  {
    id: 'preset-delta',
    type: 'airline',
    programId: 'airline-delta',
    name: 'Delta SkyMiles',
    categoryName: 'Delta Air Lines',
    colorGradient: 'from-blue-900 via-slate-900 to-red-950',
    defaultCurrency: 'SkyMiles',
    defaultCpp: 1.15,
    logoText: 'DELTA',
    deepLink: 'https://www.delta.com',
  },
  {
    id: 'preset-united',
    type: 'airline',
    programId: 'airline-united',
    name: 'United MileagePlus',
    categoryName: 'United Airlines',
    colorGradient: 'from-blue-800 via-sky-900 to-blue-950',
    defaultCurrency: 'MileagePlus',
    defaultCpp: 1.35,
    logoText: 'UNITED',
    deepLink: 'https://www.united.com',
  },
  {
    id: 'preset-southwest',
    type: 'airline',
    programId: 'airline-southwest',
    name: 'Southwest Rapid Rewards',
    categoryName: 'Southwest Airlines',
    colorGradient: 'from-blue-700 via-yellow-600 to-red-600',
    defaultCurrency: 'Rapid Rewards',
    defaultCpp: 1.3,
    logoText: 'WN',
    deepLink: 'https://www.southwest.com',
  },
  {
    id: 'preset-aa',
    type: 'airline',
    programId: 'airline-aa',
    name: 'American Airlines AAdvantage',
    categoryName: 'American Airlines',
    colorGradient: 'from-slate-700 via-blue-900 to-red-900',
    defaultCurrency: 'AAdvantage Miles',
    defaultCpp: 1.45,
    logoText: 'AA',
    deepLink: 'https://www.aa.com',
  },
  {
    id: 'preset-eva',
    type: 'airline',
    programId: 'airline-eva',
    name: 'EVA Air Infinity MileageLands',
    categoryName: '長榮航空 EVA Air',
    colorGradient: 'from-emerald-900 via-teal-950 to-green-900',
    defaultCurrency: 'Infinity Miles',
    defaultCpp: 1.5,
    logoText: 'EVA',
    deepLink: 'https://www.evaair.com',
  },

  // Hotels
  {
    id: 'preset-hyatt',
    type: 'hotel',
    programId: 'hotel-hyatt',
    name: 'World of Hyatt',
    categoryName: 'Hyatt Hotels',
    colorGradient: 'from-teal-900 via-emerald-950 to-slate-900',
    defaultCurrency: 'Hyatt Points',
    defaultCpp: 2.1,
    logoText: 'HYATT',
    deepLink: 'https://www.hyatt.com',
  },
  {
    id: 'preset-marriott',
    type: 'hotel',
    programId: 'hotel-marriott',
    name: 'Marriott Bonvoy',
    categoryName: 'Marriott International',
    colorGradient: 'from-red-950 via-rose-900 to-neutral-900',
    defaultCurrency: 'Bonvoy Points',
    defaultCpp: 0.8,
    logoText: 'BONVOY',
    deepLink: 'https://www.marriott.com',
  },
  {
    id: 'preset-hilton',
    type: 'hotel',
    programId: 'hotel-hilton',
    name: 'Hilton Honors',
    categoryName: 'Hilton Hotels',
    colorGradient: 'from-blue-950 via-indigo-950 to-slate-900',
    defaultCurrency: 'Honors Points',
    defaultCpp: 0.5,
    logoText: 'HILTON',
    deepLink: 'https://www.hilton.com',
  },
];

export const QuickPresetCatalogModal: React.FC<QuickPresetCatalogModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'all',
}) => {
  const language = useAppStore((s) => s.language);
  const profile = useAppStore((s) => s.profile);
  const cards = useAppStore((s) => s.cards);
  const airlines = useAppStore((s) => s.airlines);
  const hotels = useAppStore((s) => s.hotels);
  const addCard = useAppStore((s) => s.addCard);
  const setAirlineMiles = useAppStore((s) => s.setAirlineMiles);
  const setHotelPoints = useAppStore((s) => s.setHotelPoints);

  const [filterType, setFilterType] = useState<'all' | 'cards' | 'airlines' | 'hotels'>(defaultCategory);
  const [selectedPreset, setSelectedPreset] = useState<PresetItem | null>(null);
  const [pointsInput, setPointsInput] = useState<string>('');
  const [accountNumberInput, setAccountNumberInput] = useState<string>('');
  const [playerInput, setPlayerInput] = useState<'P1' | 'P2'>('P1');
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen) return null;

  const filteredItems = PRESET_CATALOG.filter((item) => {
    if (filterType === 'all') return true;
    if (filterType === 'cards') return item.type === 'card';
    if (filterType === 'airlines') return item.type === 'airline';
    if (filterType === 'hotels') return item.type === 'hotel';
    return true;
  });

  const handleSelectPreset = (item: PresetItem) => {
    setSelectedPreset(item);
    setPointsInput('');
    setAccountNumberInput('');
    setPlayerInput(profile.activePlayer === 'P2' ? 'P2' : 'P1');
  };

  const handleConfirmAdd = () => {
    if (!selectedPreset) return;

    const balanceNum = parseFloat(pointsInput.replace(/,/g, '')) || 0;

    if (selectedPreset.type === 'card') {
      const newCard: CardType = {
        id: `card-${Date.now()}`,
        name: selectedPreset.name,
        issuer: selectedPreset.cardData?.issuer || 'Amex',
        network: selectedPreset.cardData?.network || 'Visa',
        annualFee: selectedPreset.cardData?.annualFee || 0,
        colorGradient: selectedPreset.colorGradient,
        pointsCurrency: selectedPreset.defaultCurrency,
        currentBalance: balanceNum,
        cppValue: selectedPreset.defaultCpp,
        player: playerInput,
        is524Eligible: selectedPreset.cardData?.is524Eligible ?? true,
        perks: selectedPreset.cardData?.perks || [],
        multipliers: selectedPreset.cardData?.multipliers || [],
      };
      addCard(newCard);
    } else if (selectedPreset.type === 'airline') {
      const existing = airlines.find((a) => a.id === selectedPreset.programId || a.name.includes(selectedPreset.name));
      if (existing) {
        setAirlineMiles(existing.id, balanceNum);
      }
    } else if (selectedPreset.type === 'hotel') {
      const existing = hotels.find((h) => h.id === selectedPreset.programId || h.name.includes(selectedPreset.name));
      if (existing) {
        setHotelPoints(existing.id, balanceNum);
      }
    }

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setSelectedPreset(null);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl glass-panel rounded-3xl border border-slate-800 p-5 sm:p-7 space-y-5 shadow-2xl bg-[#0b101d] text-white max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-amber-500/20 border border-indigo-500/30 rounded-2xl">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{language === 'en' ? 'One-Tap Catalog' : '一鍵預載卡包與航司'}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {language === 'en' ? '0 Typing' : '免打字'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'en'
                  ? 'Select popular cards or loyalty programs to instantly preload logos, rules, and multipliers.'
                  : '點擊熱門美卡、航司或酒店，自動載入官方標誌、福利與倍率，零打字輕鬆入庫。'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 shrink-0 overflow-x-auto pb-1">
          <button
            onClick={() => { setFilterType('all'); setSelectedPreset(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {language === 'en' ? 'All Programs' : '全部計畫'}
          </button>
          <button
            onClick={() => { setFilterType('cards'); setSelectedPreset(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'cards'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Credit Cards' : '熱門美卡'}</span>
          </button>
          <button
            onClick={() => { setFilterType('airlines'); setSelectedPreset(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'airlines'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Airlines' : '飛行常客'}</span>
          </button>
          <button
            onClick={() => { setFilterType('hotels'); setSelectedPreset(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'hotels'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Hotels' : '酒店常客'}</span>
          </button>
        </div>

        {/* Catalog Grid View */}
        {!selectedPreset ? (
          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectPreset(item)}
                className="group p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all cursor-pointer flex flex-col justify-between space-y-3 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.colorGradient} flex items-center justify-center shadow-lg text-[10px] font-black text-white tracking-wider`}
                  >
                    {item.logoText}
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700/80 text-slate-400 font-semibold uppercase">
                    {item.type}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">{item.categoryName}</p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{item.defaultCurrency}</span>
                  <span className="text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    {language === 'en' ? 'Add' : '加入'} <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Step 2: Instant Fill Form (Only Balance & Last 4 digits) */
          <div className="flex-1 overflow-y-auto space-y-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedPreset.colorGradient} flex items-center justify-center shadow-xl text-xs font-black text-white`}
                >
                  {selectedPreset.logoText}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{selectedPreset.name}</h4>
                  <p className="text-xs text-slate-400">
                    {selectedPreset.categoryName} • {selectedPreset.defaultCurrency}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPreset(null)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                {language === 'en' ? '← Choose another' : '← 換選其他'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {language === 'en' ? 'Current Points / Miles Balance' : '當前點數 / 里程餘額'}
                </label>
                <input
                  type="text"
                  value={pointsInput}
                  onChange={(e) => setPointsInput(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
                <p className="text-[10px] text-slate-500">
                  {language === 'en' ? 'Optional. Can be updated anytime later.' : '可選填，隨時可於卡片上點擊更新。'}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {language === 'en' ? 'Account Number / Last 4' : '會員號 / 末四碼（選填）'}
                </label>
                <input
                  type="text"
                  value={accountNumberInput}
                  onChange={(e) => setAccountNumberInput(e.target.value)}
                  placeholder="e.g. *1004"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[10px] text-emerald-400">
                  {language === 'en' ? '🔒 Encrypted on this device only. 0 cloud risk.' : '🔒 僅加密儲存於手機本機，絕不上傳。'}
                </p>
              </div>
            </div>

            {/* Household Member Selector if P2 is enabled */}
            {profile.hasP2 !== false && selectedPreset.type === 'card' && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <label className="text-xs font-semibold text-slate-300">
                  {language === 'en' ? 'Cardholder Member' : '指定持卡人'}
                </label>
                <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 max-w-xs">
                  <button
                    type="button"
                    onClick={() => setPlayerInput('P1')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      playerInput === 'P1' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {profile.p1Name || 'P1'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlayerInput('P2')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      playerInput === 'P2' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {profile.p2Name || 'P2'}
                  </button>
                </div>
              </div>
            )}

            {/* Auto-Loaded Perks Preview */}
            {selectedPreset.cardData?.perks && selectedPreset.cardData.perks.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'en' ? '✨ Preloaded Official Perks Included:' : '✨ 自動預載的官方福利（免手動設定）：'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPreset.cardData.perks.map((p) => (
                    <span
                      key={p.id}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px]"
                    >
                      {p.title} (${p.value})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 shrink-0">
          <p className="text-[11px] text-slate-500">
            {language === 'en'
              ? 'Zero passwords required. Completely safe.'
              : '零密碼、零網銀風險、純本地加密存儲。'}
          </p>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              {t(language, 'cancel')}
            </button>
            {selectedPreset && (
              <button
                onClick={handleConfirmAdd}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>{language === 'en' ? 'Added!' : '已加入卡夾！'}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>{language === 'en' ? 'Add to Vault' : '確認加入卡夾'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
