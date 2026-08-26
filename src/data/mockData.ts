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
  annualReferralCap?: number; // e.g. 55000 points or $550/year
  annualReferralEarned?: number; // e.g. 15000
  isAllTimeHigh?: boolean;
  athBonus?: string;
  athDeadline?: string;
  msr?: {
    requiredSpend: number;
    currentSpend: number;
    bonusPoints: number;
    deadlineDaysRemaining: number;
    deadlineDate?: string; // YYYY-MM-DD authoritative MSR deadline (preferred source)
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

export interface BankBonus {
  id: string;
  bankName: string;
  accountType: 'Checking' | 'Savings' | 'Bundle';
  bonusAmount: number; // in USD
  depositRequirement: number; // min deposit or direct deposit amount
  directDepositRequired: boolean;
  lockupDays: number; // e.g. 90 days required to hold balance
  openDate: string; // YYYY-MM-DD
  status: 'in_progress' | 'bonus_received' | 'retention_passed' | 'closed';
  retentionMonths: number; // usually 6 months to avoid clawback
  notes: string;
  player: 'P1' | 'P2';
  applicationUrl?: string;
  bonusExpiryDate?: string;
}

export interface AwardGoal {
  id: string;
  title: string;
  airlineOrHotel: string;
  routeOrProperty: string;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First' | 'Hotel Standard' | 'Hotel Luxury';
  pointsRequired: number;
  estimatedCashPriceUSD: number;
  sweetSpotRatioCpp: number; // e.g. 3.5c
  transferPartners: string[]; // ['Amex MR', 'Chase UR', 'Citi', 'Bilt']
  programName: string; // e.g. 'Virgin Atlantic' or 'ANA Mileage Club'
  description: string;
  tags: string[];
}

export interface BuyPointsPromo {
  id: string;
  program: string;
  bonusOrDiscountText: string; // e.g. "150% Bonus (Max Promo)"
  standardPriceCpp: number; // e.g. 3.3c
  promotionalPriceCpp: number; // e.g. 1.32c
  expiryDate: string;
  minimumPurchase: number;
  directUrl: string;
  recommendedUse: string;
}

export interface AllTimeHighOffer {
  id: string;
  cardName: string;
  issuer: 'Chase' | 'Amex' | 'Citi' | 'Capital One' | 'Discover' | 'Bank of America';
  annualFee: number;
  bonusText: string; // e.g. "175,000 MR Points"
  bonusValueUSD: number; // e.g. $1,925
  spendRequired: number; // e.g. $8,000 in 6 months
  isATH: boolean;
  deadline?: string;
  chase524Sensitive: boolean;
  applyUrl: string;
  highlights: string[];
}

export interface RoadmapStage {
  stageNumber: number;
  title: string;
  subtitle: string;
  whyThisOrder: string;
  targetCards: string[];
  tips: string;
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
  memberNumber?: string;
  portalUrl?: string;
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
  memberNumber?: string;
  portalUrl?: string;
  fncs: {
    id: string;
    title: string;
    categoryLimit: string;
    expirationDate: string;
    isUsed: boolean;
    estimatedValueUSD?: number;
  }[];
  perks: string[];
  player: 'P1' | 'P2';
}

export interface CarRentalProgram {
  id: string;
  company: string;
  statusTier: string;
  memberNumber?: string;
  portalUrl?: string;
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

export const HOTEL_TIER_OPTIONS: Record<string, string[]> = {
  'hotel-1': ['Member', 'Discoverist', 'Explorist', 'Globalist'],
  'hotel-2': ['Member', 'Silver Elite', 'Gold Elite', 'Platinum Elite', 'Titanium Elite', 'Ambassador Elite'],
  'hotel-3': ['Member', 'Silver', 'Gold', 'Diamond'],
  'hotel-4': ['Club', 'Silver Elite', 'Gold Elite', 'Platinum Elite', 'Diamond Elite'],
  'hotel-5': ['Blue', 'Gold', 'Platinum', 'Diamond'],
};

export const AIRLINE_TIER_OPTIONS: Record<string, string[]> = {
  'air-1': ['General Member', 'Premier Silver', 'Premier Gold', 'Premier Platinum', 'Premier 1K', 'Global Services'],
  'air-2': ['General Member', 'Silver Medallion', 'Gold Medallion', 'Platinum Medallion', 'Diamond Medallion', '360'],
  'air-3': ['General Member', 'Gold', 'Platinum', 'Platinum Pro', 'Executive Platinum', 'ConciergeKey'],
  'air-4': ['Member', 'A-List', 'A-List Preferred'],
  'air-5': ['Member', 'MVP', 'MVP Gold', 'MVP Gold 75K', 'MVP Gold 100K'],
};

export const CAR_TIER_OPTIONS: Record<string, string[]> = {
  'car-1': ['Gold Plus Member', 'Five Star', "President's Circle"],
  'car-2': ['Club Member', 'Executive', 'Executive Elite'],
  'car-3': ['Avis Preferred', 'Avis Preferred Plus', "President's Club"],
  'car-4': ['Plus Member', 'Plus Silver', 'Plus Gold', 'Plus Platinum'],
  'car-5': ['Fastbreak Member', 'Fastbreak Choice'],
};

/** Returns the number of openings falling within the rolling 24-month window ending today. */
export function countChase524Openings(openings: string[] | undefined): number {
  if (!openings) return 0;
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 2);
  return openings.filter((d) => new Date(`${d}T00:00:00`) >= cutoff).length;
}

export const getChase524Count = countChase524Openings;

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
    memberNumber: 'UA-88392019',
    portalUrl: 'https://www.united.com/',
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
    memberNumber: 'DL-203948110',
    portalUrl: 'https://www.delta.com/',
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
    memberNumber: 'AA-K749201',
    portalUrl: 'https://www.aa.com/',
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
    memberNumber: 'WN-592018392',
    portalUrl: 'https://www.southwest.com/rapidrewards/',
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
    memberNumber: 'AS-10293848',
    portalUrl: 'https://www.alaskaair.com/',
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
    referralUrl: 'https://www.americanexpress.com/us/credit-cards/card/platinum/',
    referralBonus: '75,000 MR',
    referralValue: 825,
    msr: {
      requiredSpend: 8000,
      currentSpend: 6200,
      bonusPoints: 150000,
      deadlineDaysRemaining: 24,
      deadlineDate: '2026-09-19',
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
    applicationDate: '2026-03-19',
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
    referralUrl: 'https://www.americanexpress.com/us/credit-cards/card/gold-card/',
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
    name: 'World of Hyatt (凯悦)',
    brandColor: 'from-blue-600 to-sky-800',
    statusTier: 'Globalist',
    pointsBalance: 68500,
    cppValue: 2.1,
    nightsThisYear: 42,
    nightsToNextTier: 18,
    memberNumber: 'HY-672910398',
    portalUrl: 'https://world.hyatt.com/',
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
    name: 'Marriott Bonvoy (万豪旅享家)',
    brandColor: 'from-rose-800 to-amber-900',
    statusTier: 'Platinum Elite',
    pointsBalance: 210000,
    cppValue: 0.8,
    nightsThisYear: 52,
    nightsToNextTier: 23,
    memberNumber: 'MB-99201839',
    portalUrl: 'https://www.marriott.com/loyalty.mi',
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
    name: 'Hilton Honors (希尔顿荣誉客会)',
    brandColor: 'from-indigo-800 to-purple-900',
    statusTier: 'Diamond Status',
    pointsBalance: 340000,
    cppValue: 0.5,
    nightsThisYear: 30,
    nightsToNextTier: 30,
    memberNumber: 'HH-48201948',
    portalUrl: 'https://www.hilton.com/en/hilton-honors/',
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
  },
  {
    id: 'hotel-4',
    name: 'IHG One Rewards (洲际 / Holiday Inn)',
    brandColor: 'from-amber-700 via-orange-800 to-slate-950',
    statusTier: 'Platinum Elite',
    pointsBalance: 125000,
    cppValue: 0.55,
    nightsThisYear: 36,
    nightsToNextTier: 34,
    memberNumber: 'IHG-77492019',
    portalUrl: 'https://www.ihg.com/',
    fncs: [
      { id: 'fnc-6', title: 'Annual 40,000 Points Free Night (Chase IHG Premier)', categoryLimit: 'Up to 40k pts', expirationDate: '2026-12-31', isUsed: false }
    ],
    perks: [
      'Complimentary Room Upgrades (subject to availability)',
      'Guaranteed Room Availability with 72 hrs notice',
      'Early Check-in & Late 2 PM Check-out',
      '60% Bonus Points on Eligible Stays'
    ],
    player: 'P1'
  },
  {
    id: 'hotel-5',
    name: 'Wyndham Rewards (温德姆 / 华美达)',
    brandColor: 'from-blue-800 via-indigo-900 to-slate-950',
    statusTier: 'Diamond Status',
    pointsBalance: 45000,
    cppValue: 0.9,
    nightsThisYear: 24,
    nightsToNextTier: 16,
    memberNumber: 'WR-8920194',
    portalUrl: 'https://www.wyndhamhotels.com/',
    fncs: [],
    perks: [
      'Suite Upgrades at Check-in (including Award Stays)',
      'Welcome Amenity at Check-in (Snack/Drink or Points)',
      'Early Check-in & Late Check-out',
      '20% Bonus Points on Stays'
    ],
    player: 'P2'
  }
];

export const MOCK_CAR_RENTALS: CarRentalProgram[] = [
  {
    id: 'car-1',
    company: 'Hertz Gold Plus Rewards (赫兹租车)',
    statusTier: 'President\'s Circle',
    memberNumber: 'HZ-8849201',
    portalUrl: 'https://www.hertz.com/',
    pointsBalance: 4200,
    freeDays: 3,
    statusMatchRoutes: [
      {
        qualifyingCardOrStatus: 'Amex Platinum / Capital One Venture X',
        targetTier: 'Hertz President\'s Circle',
        matchMethod: 'Instant Auto-Enrolment via Amex / CapOne Benefits Portal',
        url: 'https://www.hertz.com/'
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
    company: 'National Emerald Club (国家租车 / 翡翠俱乐部)',
    statusTier: 'Executive Elite',
    memberNumber: 'EC-4492018',
    portalUrl: 'https://www.nationalcar.com/',
    pointsBalance: 3200,
    freeDays: 4,
    statusMatchRoutes: [
      {
        qualifyingCardOrStatus: 'Match from Hertz President\'s Circle / CSR',
        targetTier: 'National Executive Elite',
        matchMethod: 'Upload Hertz status screenshot at statusmatch.emeraldclub.com',
        url: 'https://statusmatch.emeraldclub.com/'
      }
    ],
    cdwCoverage: {
      primaryCards: ['Chase Sapphire Reserve', 'Capital One Venture X'],
      secondaryCards: ['Amex Platinum', 'Citi Premier'],
      notes: 'Executive Aisle selection lets you pick any vehicle (Luxury/SUV) at Midsize price without stopping at counter.'
    },
    player: 'P1'
  },
  {
    id: 'car-3',
    company: 'Avis Preferred (安飞士租车)',
    statusTier: 'President\'s Club',
    memberNumber: 'AV-9920184',
    portalUrl: 'https://www.avis.com/',
    pointsBalance: 1200,
    freeDays: 1,
    statusMatchRoutes: [
      {
        qualifyingCardOrStatus: 'Match from National Executive Elite or Hertz PC',
        targetTier: 'Avis President\'s Club',
        matchMethod: 'Email statusmatch@avis.com or link via United MileagePlus 1K / Platinum',
        url: 'https://www.avis.com/'
      }
    ],
    cdwCoverage: {
      primaryCards: ['Chase Sapphire Reserve', 'United Explorer Card'],
      secondaryCards: ['Amex Gold'],
      notes: 'Guaranteed double upgrade upon availability & bypass counter service.'
    },
    player: 'P1'
  },
  {
    id: 'car-4',
    company: 'Enterprise Plus (企业租车)',
    statusTier: 'Plus Silver',
    memberNumber: 'EP-1039284',
    portalUrl: 'https://www.enterprise.com/',
    pointsBalance: 850,
    freeDays: 0,
    statusMatchRoutes: [
      {
        qualifyingCardOrStatus: 'Match from National Emerald Club',
        targetTier: 'Enterprise Plus Silver / Gold',
        matchMethod: 'National & Enterprise are sister companies (Enterprise Holdings) sharing tier recognition',
        url: 'https://www.enterprise.com/'
      }
    ],
    cdwCoverage: {
      primaryCards: ['Chase Sapphire Reserve', 'Chase Sapphire Preferred', 'Capital One Venture X'],
      secondaryCards: ['Amex Platinum'],
      notes: 'Largest network of neighborhood rental locations across North America.'
    },
    player: 'P2'
  },
  {
    id: 'car-5',
    company: 'Budget Fastbreak (百捷租车)',
    statusTier: 'Fastbreak Member',
    memberNumber: 'BG-5520192',
    portalUrl: 'https://www.budget.com/',
    pointsBalance: 0,
    freeDays: 0,
    statusMatchRoutes: [
      {
        qualifyingCardOrStatus: 'Avis Budget Group Sister Tier',
        targetTier: 'Fastbreak Choice Member',
        matchMethod: 'Bypass the line at major airports directly to Fastbreak lot',
        url: 'https://www.budget.com/'
      }
    ],
    cdwCoverage: {
      primaryCards: ['Chase Sapphire Reserve', 'Capital One Venture X'],
      secondaryCards: ['Amex Gold'],
      notes: 'Budget brand shares Avis vehicle fleet at budget-friendly pricing.'
    },
    player: 'P2'
  }
];

export const MOCK_TRANSFER_PARTNERS: TransferPartner[] = [
  { bankCurrency: 'Chase UR', partnerName: 'World of Hyatt', partnerType: 'Hotel', ratio: '1:1', transferTime: 'Instant', alliance: 'Independent' },
  { bankCurrency: 'Chase UR', partnerName: 'United MileagePlus', partnerType: 'Airline', ratio: '1:1', transferTime: 'Instant', alliance: 'Star Alliance' },
  { bankCurrency: 'Chase UR', partnerName: 'Air Canada Aeroplan', partnerType: 'Airline', ratio: '1:1', transferTime: 'Instant', alliance: 'Star Alliance' },
  { bankCurrency: 'Chase UR', partnerName: 'British Airways Executive Club', partnerType: 'Airline', ratio: '1:1', transferTime: 'Instant', alliance: 'Oneworld' },
  { bankCurrency: 'Amex MR', partnerName: 'Virgin Atlantic Flying Club', partnerType: 'Airline', ratio: '1:1', transferTime: 'Instant', currentBonus: '+30% Bonus (Exp Oct 31, 2026)', alliance: 'SkyTeam' },
  { bankCurrency: 'Amex MR', partnerName: 'ANA Frequent Flyer', partnerType: 'Airline', ratio: '1:1', transferTime: '48 Hours', alliance: 'Star Alliance' },
  { bankCurrency: 'Amex MR', partnerName: 'Cathay Pacific Asia Miles', partnerType: 'Airline', ratio: '1:1', transferTime: 'Instant', alliance: 'Oneworld' },
  { bankCurrency: 'Amex MR', partnerName: 'Hilton Honors', partnerType: 'Hotel', ratio: '1:2', transferTime: 'Instant', alliance: 'Independent' },
  { bankCurrency: 'Capital One', partnerName: 'Avianca LifeMiles', partnerType: 'Airline', ratio: '1:1', transferTime: 'Instant', currentBonus: '+15% Bonus (Exp Sep 30, 2026)', alliance: 'Star Alliance' },
  { bankCurrency: 'Capital One', partnerName: 'Turkish Airlines Miles&Smiles', partnerType: 'Airline', ratio: '1:1', transferTime: 'Instant', alliance: 'Star Alliance' },
  { bankCurrency: 'Citi TYP', partnerName: 'Avianca LifeMiles', partnerType: 'Airline', ratio: '1:1', transferTime: 'Instant', alliance: 'Star Alliance' },
  { bankCurrency: 'Citi TYP', partnerName: 'EVA Air Infinity MileageLands', partnerType: 'Airline', ratio: '1:1', transferTime: '24-48h', alliance: 'Star Alliance' },
  { bankCurrency: 'Citi TYP', partnerName: 'Virgin Atlantic Flying Club', partnerType: 'Airline', ratio: '1:1', transferTime: 'Instant', currentBonus: '+30% Bonus (Exp Oct 31, 2026)', alliance: 'SkyTeam' },
  { bankCurrency: 'Citi TYP', partnerName: 'Turkish Airlines Miles&Smiles', partnerType: 'Airline', ratio: '1:1', transferTime: 'Instant', alliance: 'Star Alliance' },
  { bankCurrency: 'Citi TYP', partnerName: 'Choice Privileges', partnerType: 'Hotel', ratio: '1:2', transferTime: 'Instant', alliance: 'Independent' },
  { bankCurrency: 'Citi TYP', partnerName: 'Wyndham Rewards', partnerType: 'Hotel', ratio: '1:1', transferTime: 'Instant', alliance: 'Independent' },
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

export const MOCK_BANK_BONUSES: BankBonus[] = [
  {
    id: 'bank-1',
    bankName: 'Chase Total Checking + Savings',
    accountType: 'Bundle',
    bonusAmount: 900,
    depositRequirement: 15000,
    directDepositRequired: true,
    lockupDays: 90,
    openDate: '2026-01-10',
    status: 'in_progress',
    retentionMonths: 6,
    notes: '$300 for checking with direct deposit + $200 for savings ($15k deposit for 90 days) + $400 bundle bonus.',
    player: 'P1',
    applicationUrl: 'https://account.chase.com/consumer/banking/checking-savings',
    bonusExpiryDate: '2026-10-18'
  },
  {
    id: 'bank-2',
    bankName: 'U.S. Bank Smartly® Checking',
    accountType: 'Checking',
    bonusAmount: 450,
    depositRequirement: 8000,
    directDepositRequired: true,
    lockupDays: 90,
    openDate: '2026-04-05',
    status: 'bonus_received',
    retentionMonths: 6,
    notes: 'Direct deposit 2 or more totalling $8,000+ within 90 days. Bonus received, holding account until month 6 to avoid early close fee.',
    player: 'P1',
    applicationUrl: 'https://www.usbank.com/bank-accounts/checking-accounts.html'
  },
  {
    id: 'bank-3',
    bankName: 'Citi Priority Checking Account',
    accountType: 'Checking',
    bonusAmount: 1500,
    depositRequirement: 50000,
    directDepositRequired: false,
    lockupDays: 60,
    openDate: '2026-02-15',
    status: 'retention_passed',
    retentionMonths: 6,
    notes: 'Deposited $50,000 within 20 days and held for 60 days. Account is over 6 months old and eligible for closure without clawback.',
    player: 'P2',
    applicationUrl: 'https://banking.citi.com/'
  },
  {
    id: 'bank-4',
    bankName: 'HSBC Premier Checking',
    accountType: 'Checking',
    bonusAmount: 3000,
    depositRequirement: 100000,
    directDepositRequired: false,
    lockupDays: 90,
    openDate: '2026-05-01',
    status: 'in_progress',
    retentionMonths: 6,
    notes: 'Maintain $100k+ balance for international fee-free wires & global credit portability.',
    player: 'P2',
    applicationUrl: 'https://www.us.hsbc.com/'
  }
];

export const MOCK_AWARD_GOALS: AwardGoal[] = [
  {
    id: 'goal-1',
    title: '全日空 ANA 美日商务舱往返 (The Room)',
    airlineOrHotel: 'ANA (全日空)',
    routeOrProperty: 'US West (SFO/LAX) ⇄ Tokyo (HND/NRT)',
    cabinClass: 'Business',
    pointsRequired: 88000,
    estimatedCashPriceUSD: 5200,
    sweetSpotRatioCpp: 5.9,
    transferPartners: ['Amex MR'],
    programName: 'ANA Mileage Club',
    description: '通过 Amex MR 1:1 转点至 ANA 里程俱乐部，仅需 88,000 里程即可兑换中美/美日顶级 The Room 商务舱往返。',
    tags: ['史诗级甜点', '两舱奢华', 'Star Alliance']
  },
  {
    id: 'goal-2',
    title: '维珍航空 Virgin 兑换全日空头等舱 (The Suite)',
    airlineOrHotel: 'Virgin Atlantic (维珍航空)',
    routeOrProperty: 'US West Coast ⇄ Tokyo (单程)',
    cabinClass: 'First',
    pointsRequired: 55000,
    estimatedCashPriceUSD: 8500,
    sweetSpotRatioCpp: 15.4,
    transferPartners: ['Amex MR', 'Chase UR', 'Citi', 'Capital One', 'Bilt'],
    programName: 'Virgin Atlantic Flying Club',
    description: '可搭配 Amex/Chase 转 Virgin Atlantic 限时 +30% Bonus，实际仅需约 42,000 银行点数即可兑换单程顶级头等舱！',
    tags: ['转点加赠神器', 'SkyTeam', '头等舱']
  },
  {
    id: 'goal-3',
    title: '法荷航 Flying Blue Promo Rewards 美欧单程商务舱',
    airlineOrHotel: 'Air France / KLM',
    routeOrProperty: 'US East Coast (JFK/BOS) ⇄ Paris/Amsterdam',
    cabinClass: 'Business',
    pointsRequired: 50000,
    estimatedCashPriceUSD: 3100,
    sweetSpotRatioCpp: 6.2,
    transferPartners: ['Amex MR', 'Chase UR', 'Capital One', 'Citi', 'Bilt'],
    programName: 'Flying Blue',
    description: '每月 1 号 Flying Blue Promo 轮换折扣，常有 50,000 里程直飞欧洲商务舱，五大银行点数均可即时转入。',
    tags: ['五大行通转', '欧洲直飞', 'SkyTeam']
  },
  {
    id: 'goal-4',
    title: '凯悦东京柏悦 / 巴黎柏悦奢华免房',
    airlineOrHotel: 'World of Hyatt (凯悦天地)',
    routeOrProperty: 'Park Hyatt Paris-Vendôme / Park Hyatt Tokyo',
    cabinClass: 'Hotel Luxury',
    pointsRequired: 35000,
    estimatedCashPriceUSD: 1150,
    sweetSpotRatioCpp: 3.3,
    transferPartners: ['Chase UR', 'Bilt Rewards'],
    programName: 'World of Hyatt',
    description: 'Chase UR 1:1 转点至 Hyatt 是公认最保值的兑换方式，兑换 Cat 7-8 顶级柏悦酒店常年可达 3.0¢ 以上 CPP。',
    tags: ['酒店天花板', 'Chase UR 首选']
  },
  {
    id: 'goal-5',
    title: '卡塔尔航空 Qsuite 空中套房商务舱',
    airlineOrHotel: 'Qatar Airways (卡塔尔航空)',
    routeOrProperty: 'US ⇄ Doha ⇄ Asia / Maldives',
    cabinClass: 'Business',
    pointsRequired: 70000,
    estimatedCashPriceUSD: 4600,
    sweetSpotRatioCpp: 6.5,
    transferPartners: ['Amex MR', 'Chase UR', 'Citi', 'Capital One', 'Bilt'],
    programName: 'Qatar Avios / British Airways Avios',
    description: '通过 Avios 体系互通，70,000 Avios 兑换世界最佳商务舱 Qsuite，带滑动隐私门与双人床。',
    tags: ['世界第一商务舱', 'Avios 通用', 'Oneworld']
  }
];

export const MOCK_BUY_POINTS_PROMOS: BuyPointsPromo[] = [
  {
    id: 'promo-1',
    program: 'World of Hyatt (凯悦)',
    bonusOrDiscountText: '25% Off 优惠折算',
    standardPriceCpp: 2.40,
    promotionalPriceCpp: 1.80,
    expiryDate: '2026-10-15',
    minimumPurchase: 5000,
    directUrl: 'https://storefront.points.com/world-of-hyatt/en-US/buy',
    recommendedUse: '适合兑换 Cat 1-4 纯积分房或补足全包度假村积分差额'
  },
  {
    id: 'promo-2',
    program: 'Avianca LifeMiles (哥伦比亚航空)',
    bonusOrDiscountText: '150% Bonus 限时闪购',
    standardPriceCpp: 3.30,
    promotionalPriceCpp: 1.32,
    expiryDate: '2026-09-30',
    minimumPurchase: 1000,
    directUrl: 'https://www.lifemiles.com/',
    recommendedUse: '兑换星空联盟跨洋商务舱神器（美欧单程 63k，成本仅 ~$830）'
  },
  {
    id: 'promo-3',
    program: 'IHG One Rewards (洲际酒店)',
    bonusOrDiscountText: '100% Bonus 买一送一',
    standardPriceCpp: 1.00,
    promotionalPriceCpp: 0.50,
    expiryDate: '2026-10-05',
    minimumPurchase: 5000,
    directUrl: 'https://storefront.points.com/ihg-rewards-club/en-US/buy',
    recommendedUse: '搭配 Chase IHG Premier 联名卡「住三送一」使用，折合每晚超低价'
  },
  {
    id: 'promo-4',
    program: 'Alaska Airlines Mileage Plan (阿拉斯加航空)',
    bonusOrDiscountText: '60% Bonus 加赠',
    standardPriceCpp: 2.95,
    promotionalPriceCpp: 1.85,
    expiryDate: '2026-09-20',
    minimumPurchase: 3000,
    directUrl: 'https://storefront.points.com/alaska-airlines/en-US/buy',
    recommendedUse: '兑换日航 JAL 商务舱/星宇航空 Starlux 亚洲航线'
  }
];

export const MOCK_ATH_OFFERS: AllTimeHighOffer[] = [
  {
    id: 'ath-1',
    cardName: 'Amex The Platinum Card®',
    issuer: 'Amex',
    annualFee: 695,
    bonusText: '175,000 MR Points 史高奖励',
    bonusValueUSD: 1925,
    spendRequired: 8000,
    isATH: true,
    deadline: '2026-10-31',
    chase524Sensitive: false,
    applyUrl: 'https://www.americanexpress.com/us/credit-cards/card/platinum/',
    highlights: ['史高 175k MR 估值超 $1,900', '每年 $1,500+ 报销大礼包', '百夫长/Delta/Priority Pass 机场贵宾厅']
  },
  {
    id: 'ath-2',
    cardName: 'Chase Sapphire Preferred® (CSP)',
    issuer: 'Chase',
    annualFee: 95,
    bonusText: '100,000 UR 史高神卡回归',
    bonusValueUSD: 1500,
    spendRequired: 4000,
    isATH: true,
    deadline: '2026-09-30',
    chase524Sensitive: true,
    applyUrl: 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred',
    highlights: ['5/24 核心必办 #1 推荐', 'UR 点数 1:1 转 Hyatt / United', '自带 Primary 租车主险']
  },
  {
    id: 'ath-3',
    cardName: 'Citi Strata Premier℠',
    issuer: 'Citi',
    annualFee: 95,
    bonusText: '80,000 TYP 历史新高',
    bonusValueUSD: 1040,
    spendRequired: 4000,
    isATH: true,
    deadline: '2026-11-15',
    chase524Sensitive: false,
    applyUrl: 'https://www.citi.com/credit-cards/citi-strata-premier-credit-card',
    highlights: ['超市、加油、餐饮、酒店、机票全面 3x 返点', 'TYP 可转长荣、维珍、土耳其航空', '每年 $100 酒店折抵']
  },
  {
    id: 'ath-4',
    cardName: 'Marriott Bonvoy Brilliant® Amex',
    issuer: 'Amex',
    annualFee: 650,
    bonusText: '185,000 Marriott Points 史高',
    bonusValueUSD: 1480,
    spendRequired: 6000,
    isATH: true,
    deadline: '2026-10-16',
    chase524Sensitive: false,
    applyUrl: 'https://www.americanexpress.com/us/credit-cards/card/marriott-bonvoy-brilliant/',
    highlights: ['直接赠送万豪白金会籍 (免费早餐+行政酒廊)', '每年送 85,000 分免房券 (FNC)', '每年 $300 全球餐饮报销 ($25/月)']
  },
  {
    id: 'ath-5',
    cardName: 'Southwest Rapid Rewards® Priority',
    issuer: 'Chase',
    annualFee: 149,
    bonusText: '100,000 Miles + 助攻伴飞卡',
    bonusValueUSD: 1300,
    spendRequired: 4000,
    isATH: true,
    deadline: '2026-10-01',
    chase524Sensitive: true,
    applyUrl: 'https://creditcards.chase.com/travel-credit-cards/southwest/priority',
    highlights: ['直接斩获 100k 积分，伴飞卡进度达 74%', '每年 $75 西南航空报销 + 7,500 周年赠分', '4 次 A1-A15 登机免费升级']
  }
];

export const BEGINNER_ROADMAP_STAGES: RoadmapStage[] = [
  {
    stageNumber: 1,
    title: '信用基石建立期 (0~6 个月)',
    subtitle: '建立美国信用历史，拿下免年费入门神卡',
    whyThisOrder: '没有信用记录时切勿盲目申请高端卡。先办无 SSN 友好或入门卡，按时全额还款 6 个月积累 FICO 分数。',
    targetCards: ['Discover it® Cash Back', 'Chase Freedom Rise®', 'Chase Freedom Unlimited®'],
    tips: '维持信用使用率低于 10%，绝不逾期。'
  },
  {
    stageNumber: 2,
    title: 'Chase 5/24 黄金收割期 (6~18 个月)',
    subtitle: '用满 5/24 槽位，锁定最高价值的 Chase 生态卡',
    whyThisOrder: '因为 Chase 严格执行 24 个月内超 5 张卡即拒签的铁律，必须把前 5 个名额全部留给 Chase 顶级卡。',
    targetCards: ['Chase Sapphire Preferred (CSP)', 'World of Hyatt Card', 'Southwest Priority', 'Chase Freedom Flex'],
    tips: '先开 CSP 激活 UR 转点能力，再办酒店/航空联名卡。'
  },
  {
    stageNumber: 3,
    title: '全景进阶与跨行收割期 (18~24 个月)',
    subtitle: '突破 5/24 后，拿下 Amex、CapOne 与 Citi 顶级神卡',
    whyThisOrder: '出 5/24 后转向对开卡总数较宽松的 Amex 和 Citi，收割史高 175k 大白金与日常 4x 买菜金卡。',
    targetCards: ['Amex Gold Card (4x 餐饮买菜)', 'Capital One Venture X (负年费神卡)', 'Amex Platinum (175k 史高)', 'Citi Strata Premier'],
    tips: '注意 Amex 一生一次开卡礼规则，非史高不上车。'
  },
  {
    stageNumber: 4,
    title: '双人组队与商业卡无痛流 (长期进阶)',
    subtitle: 'P1+P2 互相推荐，利用商业卡不计入 5/24 维持无限续航',
    whyThisOrder: 'Chase 商业卡（Ink Cash / Ink Unlimited）审批不计入个人 5/24 槽位，可实现无限循环攒点与 Referral 返利。',
    targetCards: ['Chase Ink Business Cash', 'Chase Ink Business Unlimited', 'Amex Business Gold'],
    tips: '夫妻之间 P1 推荐 P2 办卡，每次额外赚取 10k-30k 推荐分。'
  }
];
