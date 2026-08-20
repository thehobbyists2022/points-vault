export interface CreditCard {
  id: string;
  name: string;
  issuer: 'Amex' | 'Chase' | 'Citi' | 'Capital One' | 'Bilt' | 'Discover' | 'Bank of America';
  network: 'Visa' | 'Mastercard' | 'Amex' | 'Discover';
  annualFee: number;
  colorGradient: string;
  pointsCurrency: string;
  currentBalance: number;
  cppValue: number; // Cent Per Point valuation
  referralUrl?: string;      // e.g. 'https://refer.amex.us/platinum'
  referralBonus?: string;   // e.g. '75,000 MR Points'
  referralValue?: number;   // estimated USD value e.g. 825
  msr?: {
    requiredSpend: number;
    currentSpend: number;
    bonusPoints: number;
    deadlineDaysRemaining: number;
  };
  perks: {
    id: string;
    title: string;
    value: number;
    frequency: 'Monthly' | 'Quarterly' | 'Annual' | 'Membership Year';
    used: boolean;
    category: 'Travel' | 'Dining' | 'Entertainment' | 'Shopping' | 'Lounge';
  }[];
  multipliers: {
    category: string;
    rate: number;
    details?: string;
  }[];
  applicationDate?: string;
  is524Eligible: boolean;
  player: 'P1' | 'P2';
}

export interface AirlineProgram {
  id: string;
  name: string;
  code: string;
  alliance: 'Star Alliance' | 'Oneworld' | 'SkyTeam' | 'Independent';
  brandColor: string;
  statusTier: string;
  milesBalance: number;
  cppValue: number; // Authentic valuations (e.g. 1.35c, 1.55c)
  expirationPolicy: string;
  expirationDate?: string; // If applicable
  isExpirationWarning: boolean;
  companionPass?: {
    title: string;
    currentProgress: number;
    targetProgress: number;
    unit: string;
    expiryDate: string;
    isUnlocked: boolean;
  };
  perks: string[];
  player: 'P1' | 'P2';
}

export interface HotelProgram {
  id: string;
  name: string;
  brandColor: string;
  statusTier: string;
  pointsBalance: number;
  cppValue: number;
  nightsThisYear: number;
  nightsToNextTier: number;
  fncs: {
    id: string;
    title: string;
    categoryLimit: string;
    expirationDate: string;
    isUsed: boolean;
  }[];
  perks: string[];
  player: 'P1' | 'P2';
}

export interface CarRentalProgram {
  id: string;
  company: string;
  statusTier: string;
  pointsBalance: number;
  freeDays: number;
  statusMatchRoutes: {
    qualifyingCardOrStatus: string;
    targetTier: string;
    matchMethod: string;
    url: string;
  }[];
  cdwCoverage: {
    primaryCards: string[];
    secondaryCards: string[];
    notes: string;
  };
  player: 'P1' | 'P2';
}

export interface TransferPartner {
  bankCurrency: string;
  partnerName: string;
  partnerType: 'Airline' | 'Hotel';
  ratio: string;
  transferTime: string;
  currentBonus?: string;
  alliance?: 'Star Alliance' | 'Oneworld' | 'SkyTeam' | 'Independent';
}

export interface UserProfile {
  p1Name: string;
  p2Name: string;
  activePlayer: 'P1' | 'P2' | 'All';
  // Real 24-month rolling model: ISO dates (YYYY-MM-DD) each personal card was opened.
  chase524OpeningsP1: string[];
  chase524OpeningsP2: string[];
}

export const INITIAL_PROFILE: UserProfile = {
  p1Name: 'Matrix (P1)',
  p2Name: 'Alex (P2)',
  activePlayer: 'All',
  chase524OpeningsP1: ['2025-01-10', '2025-06-18', '2026-03-05'],
  chase524OpeningsP2: ['2025-09-22'],
};

/** Returns the number of openings falling within the rolling 24-month window ending today. */
export function countChase524Openings(openings: string[] | undefined): number {
  if (!openings) return 0;
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 2);
  return openings.filter((d) => new Date(`${d}T00:00:00`) >= cutoff).length;
}

export const MOCK_AIRLINE_PROGRAMS: AirlineProgram[] = [
  {
    id: 'air-1',
    name: 'United MileagePlus (美联航)',
    code: 'UA',
    alliance: 'Star Alliance',
    brandColor: 'from-blue-700 via-blue-900 to-slate-950',
    statusTier: 'Premier 1K',
    milesBalance: 145000,
    cppValue: 1.35,
    expirationPolicy: '永不过期 (Miles Never Expire)',
    isExpirationWarning: false,
    perks: [
      '2 张 United Club 休息室通行券',
      '订票即享受免费 Economy Plus 额外腿部空间',
      '免费预订 Star Alliance 伙伴机票零燃油附加费',
      '专属 1K 优先客服通道 & 免费升舱券 (PlusPoints)'
    ],
    player: 'P1'
  },
  {
    id: 'air-2',
    name: 'Delta SkyMiles (达美航空)',
    code: 'DL',
    alliance: 'SkyTeam',
    brandColor: 'from-rose-700 via-rose-900 to-slate-950',
    statusTier: 'Gold Medallion',
    milesBalance: 98000,
    cppValue: 1.15,
    expirationPolicy: '永不过期 (Miles Never Expire)',
    isExpirationWarning: false,
    companionPass: {
      title: 'Delta Companion Certificate (Main Cabin 伴飞券)',
      currentProgress: 1,
      targetProgress: 1,
      unit: '张可用',
      expiryDate: '2026-11-15',
      isUnlocked: true
    },
    perks: [
      '优先登机 (Zone 4 Premium)',
      '免费头等舱/Comfort+ 升舱资格',
      '免费托运 2 件 70 lbs 行李',
      'SkyTeam Elite Plus 国际贵宾室准入'
    ],
    player: 'P1'
  },
  {
    id: 'air-3',
    name: 'American Airlines AAdvantage (美航)',
    code: 'AA',
    alliance: 'Oneworld',
    brandColor: 'from-slate-700 via-blue-900 to-red-950',
    statusTier: 'Platinum Pro',
    milesBalance: 120000,
    cppValue: 1.45,
    expirationPolicy: '24 个月无变动过期 (持卡可自动保鲜)',
    expirationDate: '2026-11-20',
    isExpirationWarning: true,
    perks: [
      'Oneworld Emerald 尊贵绿宝石会籍',
      '无限次免费Main Extra 选座',
      'Systemwide Upgrades (SWU) 洲际平躺升舱券',
      '免费 2 件托运行李'
    ],
    player: 'P1'
  },
  {
    id: 'air-4',
    name: 'Southwest Rapid Rewards (美西南)',
    code: 'WN',
    alliance: 'Independent',
    brandColor: 'from-blue-600 via-amber-600 to-rose-700',
    statusTier: 'A-List Preferred',
    milesBalance: 85000,
    cppValue: 1.30,
    expirationPolicy: '永不过期 (Never Expire)',
    isExpirationWarning: false,
    companionPass: {
      title: 'Southwest Companion Pass (无限次买一送一伴飞神卡)',
      currentProgress: 92000,
      targetProgress: 135000,
      unit: 'pts',
      expiryDate: '2026-12-31',
      isUnlocked: false
    },
    perks: [
      '所有航班免费托运 2 件行李',
      'A1-A15 优先登机通道',
      '免费车载机上高速 Wi-Fi',
      '零退票/改签费'
    ],
    player: 'P2'
  },
  {
    id: 'air-5',
    name: 'Alaska Airlines Mileage Plan (阿拉斯加)',
    code: 'AS',
    alliance: 'Oneworld',
    brandColor: 'from-emerald-800 via-teal-900 to-slate-950',
    statusTier: 'MVP Gold 75K',
    milesBalance: 64000,
    cppValue: 1.55,
    expirationPolicy: '24 个月无变动过期',
    expirationDate: '2026-12-30',
    isExpirationWarning: false,
    companionPass: {
      title: 'Famous $99 Companion Certificate (年度 $99 伴飞券)',
      currentProgress: 1,
      targetProgress: 1,
      unit: '张可用',
      expiryDate: '2026-10-31',
      isUnlocked: true
    },
    perks: [
      '业界最强伙伴兑换榜 (日航/国泰/大韩)',
      '免费第一舱/特惠舱升舱',
      '4 张 Alaska Lounge 贵宾室通行券',
      '50k 专享里程赠送'
    ],
    player: 'P2'
  }
];

export const MOCK_CARDS: CreditCard[] = [
  {
    id: 'card-1',
    name: 'The Platinum Card®',
    issuer: 'Amex',
    network: 'Amex',
    annualFee: 695,
    colorGradient: 'from-slate-700 via-slate-800 to-zinc-950 border-slate-400',
    pointsCurrency: 'Amex Membership Rewards',
    currentBalance: 145000,
    cppValue: 1.1,
    referralUrl: 'https://www.americanexpress.com/us/credit-cards/the-platinum-card/',
    referralBonus: '75,000 MR',
    referralValue: 825,
    msr: {
      requiredSpend: 8000,
      currentSpend: 6200,
      bonusPoints: 150000,
      deadlineDaysRemaining: 24,
    },
    perks: [
      { id: 'p1', title: '$200 Hotel Credit (FHR/HC)', value: 200, frequency: 'Annual', used: false, category: 'Travel' },
      { id: 'p2', title: '$200 Airline Incidental Fee Credit', value: 200, frequency: 'Annual', used: true, category: 'Travel' },
      { id: 'p3', title: '$200 Uber Cash ($15/mo)', value: 200, frequency: 'Monthly', used: true, category: 'Dining' },
      { id: 'p4', title: '$240 Digital Entertainment Credit ($20/mo)', value: 240, frequency: 'Monthly', used: false, category: 'Entertainment' },
      { id: 'p5', title: 'Centurion & Priority Pass Lounge Access', value: 350, frequency: 'Annual', used: true, category: 'Lounge' },
    ],
    multipliers: [
      { category: 'Flights (Direct / Amex Travel)', rate: 5 },
      { category: 'Prepaid Hotels (Amex Travel)', rate: 5 },
      { category: 'Other Purchases', rate: 1 },
    ],
    applicationDate: '2025-11-10',
    is524Eligible: true,
    player: 'P1',
  },
  {
    id: 'card-2',
    name: 'American Express® Gold Card',
    issuer: 'Amex',
    network: 'Amex',
    annualFee: 325,
    colorGradient: 'from-amber-600 via-yellow-600 to-amber-900 border-amber-400',
    pointsCurrency: 'Amex Membership Rewards',
    currentBalance: 88000,
    cppValue: 1.1,
    referralUrl: 'https://www.americanexpress.com/us/credit-cards/the-amex-gold-card/',
    referralBonus: '30,000 MR',
    referralValue: 330,
    perks: [
      { id: 'p6', title: '$120 Dining Credit ($10/mo)', value: 120, frequency: 'Monthly', used: true, category: 'Dining' },
      { id: 'p7', title: '$120 Uber Cash ($10/mo)', value: 120, frequency: 'Monthly', used: false, category: 'Dining' },
      { id: 'p8', title: '$100 Resy Credit ($50 bi-annually)', value: 100, frequency: 'Quarterly', used: false, category: 'Dining' },
    ],
    multipliers: [
      { category: 'Restaurants Worldwide', rate: 4 },
      { category: 'US Supermarkets (up to $25k/yr)', rate: 4 },
      { category: 'Flights Booked Direct', rate: 3 },
      { category: 'Other Purchases', rate: 1 },
    ],
    applicationDate: '2024-06-15',
    is524Eligible: true,
    player: 'P1',
  },
  {
    id: 'card-3',
    name: 'Chase Sapphire Reserve®',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 550,
    colorGradient: 'from-blue-900 via-indigo-950 to-slate-900 border-blue-500',
    pointsCurrency: 'Chase Ultimate Rewards',
    currentBalance: 112000,
    cppValue: 1.5,
    referralUrl: 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve',
    referralBonus: '30,000 UR',
    referralValue: 450,
    perks: [
      { id: 'p9', title: '$300 Annual Travel Credit', value: 300, frequency: 'Annual', used: true, category: 'Travel' },
      { id: 'p10', title: 'Priority Pass Select Lounge Access', value: 300, frequency: 'Annual', used: true, category: 'Lounge' },
      { id: 'p11', title: '$60 DoorDash Credit & DashPass', value: 60, frequency: 'Annual', used: false, category: 'Dining' },
    ],
    multipliers: [
      { category: 'Hotels & Rental Cars (Chase Travel)', rate: 10 },
      { category: 'Flights (Chase Travel)', rate: 5 },
      { category: 'Travel Purchases Worldwide', rate: 3 },
      { category: 'Dining Worldwide', rate: 3 },
    ],
    applicationDate: '2024-03-20',
    is524Eligible: true,
    player: 'P1',
  },
  {
    id: 'card-4',
    name: 'Chase Freedom Flex℠',
    issuer: 'Chase',
    network: 'Mastercard',
    annualFee: 0,
    colorGradient: 'from-cyan-700 via-teal-800 to-slate-900 border-cyan-400',
    pointsCurrency: 'Chase Ultimate Rewards',
    currentBalance: 34000,
    cppValue: 1.5,
    perks: [
      { id: 'p12', title: '5% Rotating Quarterly Category (Grocery/Gas)', value: 75, frequency: 'Quarterly', used: false, category: 'Shopping' },
    ],
    multipliers: [
      { category: '5% Rotating Bonus Categories', rate: 5, details: 'Up to $1,500/quarter' },
      { category: 'Dining & Drugstores', rate: 3 },
      { category: 'Travel via Chase', rate: 5 },
    ],
    applicationDate: '2025-01-05',
    is524Eligible: true,
    player: 'P2',
  },
  {
    id: 'card-5',
    name: 'Capital One Venture X',
    issuer: 'Capital One',
    network: 'Visa',
    annualFee: 395,
    colorGradient: 'from-slate-800 via-blue-900 to-indigo-950 border-cyan-300',
    pointsCurrency: 'Capital One Miles',
    currentBalance: 95000,
    cppValue: 1.0,
    referralUrl: 'https://www.capitalone.com/credit-cards/venture-x/',
    referralBonus: '75,000 Miles',
    referralValue: 750,
    perks: [
      { id: 'p13', title: '$300 Annual Capital One Travel Credit', value: 300, frequency: 'Annual', used: true, category: 'Travel' },
      { id: 'p14', title: '10,000 Anniversary Bonus Miles', value: 100, frequency: 'Annual', used: true, category: 'Travel' },
      { id: 'p15', title: 'Capital One Lounge & Plaza Premium Access', value: 250, frequency: 'Annual', used: true, category: 'Lounge' },
    ],
    multipliers: [
      { category: 'Hotels & Rental Cars (CapOne Travel)', rate: 10 },
      { category: 'Flights (CapOne Travel)', rate: 5 },
      { category: 'All Other Everyday Purchases', rate: 2 },
    ],
    applicationDate: '2024-09-12',
    is524Eligible: true,
    player: 'P2',
  },
  {
    id: 'card-6',
    name: 'World of Hyatt Credit Card',
    issuer: 'Chase',
    network: 'Visa',
    annualFee: 95,
    colorGradient: 'from-sky-700 via-blue-900 to-slate-900 border-sky-400',
    pointsCurrency: 'World of Hyatt Points',
    currentBalance: 42000,
    cppValue: 2.1,
    referralUrl: 'https://creditcards.chase.com/travel-credit-cards/world-of-hyatt',
    referralBonus: '30,000 Points',
    referralValue: 630,
    perks: [
      { id: 'p16', title: '1 Free Night Certificate (Cat 1-4)', value: 250, frequency: 'Annual', used: false, category: 'Travel' },
      { id: 'p17', title: '5 Qualifying Night Credits toward Status', value: 100, frequency: 'Annual', used: true, category: 'Travel' },
    ],
    multipliers: [
      { category: 'Hyatt Hotels & Resorts', rate: 4 },
      { category: 'Dining, Airlines, Transit, Gyms', rate: 2 },
    ],
    applicationDate: '2023-08-01',
    is524Eligible: true,
    player: 'P1',
  },
  {
    id: 'card-7',
    name: 'Bilt Mastercard®',
    issuer: 'Bilt',
    network: 'Mastercard',
    annualFee: 0,
    colorGradient: 'from-neutral-800 via-zinc-900 to-black border-neutral-500',
    pointsCurrency: 'Bilt Rewards Points',
    currentBalance: 52000,
    cppValue: 1.8,
    referralUrl: 'https://www.bilt.com/card',
    referralBonus: '10,000 Bilt Points',
    referralValue: 180,
    perks: [
      { id: 'p18', title: 'Pay Rent with No Transaction Fee', value: 300, frequency: 'Monthly', used: true, category: 'Shopping' },
      { id: 'p19', title: 'Bilt Rent Day Double Points (1st of month)', value: 100, frequency: 'Monthly', used: false, category: 'Dining' },
    ],
    multipliers: [
      { category: 'Rent (up to 100k pts/yr)', rate: 1 },
      { category: 'Dining', rate: 3 },
      { category: 'Travel', rate: 2 },
    ],
    applicationDate: '2024-02-14',
    is524Eligible: true,
    player: 'P1',
  }
];

export const MOCK_HOTEL_PROGRAMS: HotelProgram[] = [
  {
    id: 'hotel-1',
    name: 'World of Hyatt',
    brandColor: 'from-blue-600 to-sky-800',
    statusTier: 'Globalist',
    pointsBalance: 68500,
    cppValue: 2.1,
    nightsThisYear: 42,
    nightsToNextTier: 18,
    fncs: [
      { id: 'fnc-1', title: 'Category 1-4 Free Night (Anniversary)', categoryLimit: 'Cat 1-4', expirationDate: '2026-11-30', isUsed: false },
      { id: 'fnc-2', title: 'Category 1-7 Free Night (Milestone 60k)', categoryLimit: 'Cat 1-7', expirationDate: '2026-12-15', isUsed: false }
    ],
    perks: [
      'Free Club Lounge Access or Breakfast for 2',
      'Room Upgrade up to Standard Suite at check-in',
      '4 PM Late Check-out Guaranteed',
      'Waived Resort Fees on Award & Paid Stays'
    ],
    player: 'P1'
  },
  {
    id: 'hotel-2',
    name: 'Marriott Bonvoy',
    brandColor: 'from-rose-800 to-amber-900',
    statusTier: 'Platinum Elite',
    pointsBalance: 210000,
    cppValue: 0.8,
    nightsThisYear: 52,
    nightsToNextTier: 23,
    fncs: [
      { id: 'fnc-3', title: '85,000 Points Free Night (Amex Brilliant)', categoryLimit: 'Up to 85k pts', expirationDate: '2026-09-30', isUsed: false },
      { id: 'fnc-4', title: '35,000 Points Free Night (Chase Boundless)', categoryLimit: 'Up to 35k pts', expirationDate: '2026-10-15', isUsed: true }
    ],
    perks: [
      'Lounge Access & Daily Free Breakfast',
      '4 PM Late Check-out',
      'Enhanced Room Upgrade (including suites)',
      '50% Bonus Points on Stays'
    ],
    player: 'P1'
  },
  {
    id: 'hotel-3',
    name: 'Hilton Honors',
    brandColor: 'from-indigo-800 to-purple-900',
    statusTier: 'Diamond Status',
    pointsBalance: 340000,
    cppValue: 0.5,
    nightsThisYear: 30,
    nightsToNextTier: 30,
    fncs: [
      { id: 'fnc-5', title: 'Free Weekend Night Reward (Amex Aspire)', categoryLimit: 'Any Uncapped Standard Room', expirationDate: '2027-01-20', isUsed: false }
    ],
    perks: [
      'Daily Food & Beverage Credit or Continental Breakfast',
      'Executive Lounge Access Guaranteed',
      'Space-Available Room Upgrades',
      '100% Bonus Points on Paid Stays'
    ],
    player: 'P2'
  }
];

export const MOCK_CAR_RENTALS: CarRentalProgram[] = [
  {
    id: 'car-1',
    company: 'Hertz Gold Plus Rewards',
    statusTier: 'President\'s Circle',
    pointsBalance: 4200,
    freeDays: 3,
    statusMatchRoutes: [
      {
        qualifyingCardOrStatus: 'Amex Platinum / Capital One Venture X',
        targetTier: 'Hertz President\'s Circle',
        matchMethod: 'Instant Auto-Enrolment via Amex / CapOne Benefits Portal',
        url: 'https://www.americanexpress.com/us/credit-cards/platinum-card-benefits/'
      }
    ],
    cdwCoverage: {
      primaryCards: ['Chase Sapphire Reserve', 'Chase Sapphire Preferred', 'Capital One Venture X'],
      secondaryCards: ['Amex Platinum', 'Amex Gold'],
      notes: 'Must decline car rental company CDW/LDW and charge total rental to a primary coverage card.'
    },
    player: 'P1'
  },
  {
    id: 'car-2',
    company: 'National Emerald Club',
    statusTier: 'Executive Elite',
    pointsBalance: 18,
    freeDays: 4,
    statusMatchRoutes: [
      {
        qualifyingCardOrStatus: 'Match from Hertz President\'s Circle',
        targetTier: 'National Executive Elite',
        matchMethod: 'Upload Hertz status screenshot at statusmatch.emeraldclub.com',
        url: 'https://statusmatch.emeraldclub.com/'
      }
    ],
    cdwCoverage: {
      primaryCards: ['Chase Sapphire Reserve', 'Capital One Venture X'],
      secondaryCards: ['Amex Platinum', 'Citi Premier'],
      notes: 'Executive Aisle selection lets you pick any vehicle (Luxury/SUV) at Midsize price.'
    },
    player: 'P1'
  },
  {
    id: 'car-3',
    company: 'Avis Preferred',
    statusTier: 'President\'s Club',
    pointsBalance: 1200,
    freeDays: 1,
    statusMatchRoutes: [
      {
        qualifyingCardOrStatus: 'Match from National Executive Elite or Hertz PC',
        targetTier: 'Avis President\'s Club',
        matchMethod: 'Email statusmatch@avis.com with proof of competitor status',
        url: 'https://www.avis.com/en/avis-preferred'
      }
    ],
    cdwCoverage: {
      primaryCards: ['Chase Sapphire Reserve', 'United Explorer Card'],
      secondaryCards: ['Amex Gold'],
      notes: 'Guaranteed double upgrade upon availability.'
    },
    player: 'P2'
  }
];

export const MOCK_TRANSFER_PARTNERS: TransferPartner[] = [
  { bankCurrency: 'Chase UR', partnerName: 'World of Hyatt', partnerType: 'Hotel', ratio: '1:1', transferTime: 'Instant', alliance: 'Independent' },
  { bankCurrency: 'Chase UR', partnerName: 'United MileagePlus', partnerType: 'Airline', ratio: '1:1', transferTime: 'Instant', alliance: 'Star Alliance' },
  { bankCurrency: 'Chase UR', partnerName: 'Air Canada Aeroplan', partnerType: 'Airline', ratio: '1:1', transferTime: 'Instant', alliance: 'Star Alliance' },
  { bankCurrency: 'Chase UR', partnerName: 'British Airways Executive Club', partnerType: 'Airline', ratio: '1:1', transferTime: 'Instant', alliance: 'Oneworld' },
  { bankCurrency: 'Amex MR', partnerName: 'Virgin Atlantic Flying Club', partnerType: 'Airline', ratio: '1:1', transferTime: 'Instant', currentBonus: '+30% Bonus (Exp Sep 30)', alliance: 'SkyTeam' },
  { bankCurrency: 'Amex MR', partnerName: 'ANA Frequent Flyer', partnerType: 'Airline', ratio: '1:1', transferTime: '48 Hours', alliance: 'Star Alliance' },
  { bankCurrency: 'Amex MR', partnerName: 'Cathay Pacific Asia Miles', partnerType: 'Airline', ratio: '1:1', transferTime: 'Instant', alliance: 'Oneworld' },
  { bankCurrency: 'Amex MR', partnerName: 'Hilton Honors', partnerType: 'Hotel', ratio: '1:2', transferTime: 'Instant', alliance: 'Independent' },
  { bankCurrency: 'Capital One', partnerName: 'Avianca LifeMiles', partnerType: 'Airline', ratio: '1:1', transferTime: 'Instant', currentBonus: '+15% Bonus', alliance: 'Star Alliance' },
  { bankCurrency: 'Capital One', partnerName: 'Turkish Airlines Miles&Smiles', partnerType: 'Airline', ratio: '1:1', transferTime: 'Instant', alliance: 'Star Alliance' },
  { bankCurrency: 'Bilt Rewards', partnerName: 'Alaska Airlines Mileage Plan', partnerType: 'Airline', ratio: '1:1', transferTime: 'Instant', alliance: 'Oneworld' },
  { bankCurrency: 'Bilt Rewards', partnerName: 'World of Hyatt', partnerType: 'Hotel', ratio: '1:1', transferTime: 'Instant', alliance: 'Independent' }
];

export const CARD_APPLICATION_RULES = [
  {
    bank: 'Chase',
    ruleName: '5/24 Rule',
    description: 'Chase will automatically deny applications for most cards if you have opened 5 or more personal credit cards with ANY bank in the last 24 months.',
    tips: 'Apply for Chase cards FIRST in your travel hacking journey. Business cards generally do not count toward 5/24 if approved.'
  },
  {
    bank: 'American Express',
    ruleName: 'Once Per Lifetime Welcome Offer',
    description: 'Amex restricts welcome bonuses to once per card product per lifetime (defined usually as 7 years). Look out for Pop-up Warnings during application.',
    tips: 'Watch out for Amex "Family Rules" (e.g. getting Gold bonus first may make you ineligible for Platinum bonus).'
  },
  {
    bank: 'Citi',
    ruleName: '8/65 Rule',
    description: 'Citi allows max 1 credit card application every 8 days, and max 2 applications within a rolling 65-day window.',
    tips: 'Wait at least 9 days between Citi card applications.'
  },
  {
    bank: 'Capital One',
    ruleName: '1 Card per 6 Months & Triple Pull',
    description: 'Capital One enforces a 1 card per 6 months application cap and pulls credit reports from all 3 bureaus (Experian, TransUnion, Equifax).',
    tips: 'Freeze TransUnion or Equifax prior to application if allowed.'
  }
];
