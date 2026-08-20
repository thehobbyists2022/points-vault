# PointsVault Phase 3 Detailed Design & Technical Implementation Specification

This document contains the complete, production-ready design specification and implementation codebase for **Phase 3** of **PointsVault**. It is structured for direct execution by **DeepSeek V4 Flash**.

---

## 🛠️ Project & Tech Stack Overview
- **Web App Directory**: `c:\Users\Matrixkuo\Desktop\Antigravity\APP Design\Points Mile`
- **Mobile App Directory**: `c:\Users\Matrixkuo\Desktop\Antigravity\APP Design\PointsVault-Mobile`
- **Tech Stack (Web)**: React 18 + TypeScript + Vite + Tailwind CSS v4 + Zustand (`zustand/middleware` persist) + Lucide React
- **Tech Stack (Mobile)**: React Native + Expo SDK (Expo Router `app/`) + NativeWind v4 + Zustand + TypeScript

---

## ⚡ Execution Order for DeepSeek V4 Flash

Execute features strictly in the following sequential order:

1. **FEATURE 3: NOTIFICATION SYSTEM**
   - Step 3.1: Create `src/lib/notifications.ts`
   - Step 3.2: Update `src/store/useAppStore.ts`
   - Step 3.3: Create `src/components/NotificationCenter.tsx`
   - Step 3.4: Update `src/components/Header.tsx`
   - Step 3.5: Update `src/App.tsx`
   - *Verification*: Run `npm run build` inside web directory.

2. **FEATURE 1: AFFILIATE REFERRAL ENGINE**
   - Step 1.1: Update `src/data/mockData.ts`
   - Step 1.2: Create `src/components/AffiliateTab.tsx`
   - Step 1.3: Update `src/components/Sidebar.tsx`
   - Step 1.4: Update `src/App.tsx`
   - *Verification*: Run `npm run build` inside web directory.

3. **FEATURE 2: CSV STATEMENT PARSER**
   - Step 2.1: Create `src/lib/csvParser.ts`
   - Step 2.2: Create `src/components/StatementUploaderModal.tsx`
   - Step 2.3: Update `src/components/CardsTab.tsx`
   - *Verification*: Run `npm run build` inside web directory.

4. **FEATURE 4: REACT NATIVE APP INITIALIZATION**
   - Step 4.1: Setup Expo mobile project structure at `c:\Users\Matrixkuo\Desktop\Antigravity\APP Design\PointsVault-Mobile`
   - Step 4.2: Create shared data models & Zustand store
   - Step 4.3: Build Tab screens (`index.tsx`, `cards.tsx`, `airlines.tsx`, `hotels.tsx`, `finder.tsx`)
   - Step 4.4: Create reusable mobile components (`PointsCard.tsx`, `StatBadge.tsx`)

---

# 📌 FEATURE 1: AFFILIATE REFERRAL ENGINE

## 1.1 Data Model Change
Modify `src/data/mockData.ts`:

Add optional fields to `CreditCard` interface:
```typescript
export interface CreditCard {
  id: string;
  name: string;
  issuer: 'Amex' | 'Chase' | 'Citi' | 'Capital One' | 'Bilt' | 'Discover' | 'Bank of America';
  network: 'Visa' | 'Mastercard' | 'Amex' | 'Discover';
  annualFee: number;
  colorGradient: string;
  pointsCurrency: string;
  currentBalance: number;
  cppValue: number;
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
```

Add referral properties to `MOCK_CARDS` items:
- `card-1` (Amex Platinum): `referralUrl: 'https://refer.amex.us/MPLATINUM', referralBonus: '75,000 MR', referralValue: 825`
- `card-2` (Amex Gold): `referralUrl: 'https://refer.amex.us/MGOLD', referralBonus: '30,000 MR', referralValue: 330`
- `card-3` (CSR): `referralUrl: 'https://www.referyourchasecard.com/sapphire/reserve', referralBonus: '30,000 UR', referralValue: 450`
- `card-5` (Venture X): `referralUrl: 'https://capital.one/3QlYCzx', referralBonus: '75,000 Miles', referralValue: 750`
- `card-6` (Hyatt): `referralUrl: 'https://www.referyourchasecard.com/hyatt', referralBonus: '30,000 Points', referralValue: 630`
- `card-7` (Bilt): `referralUrl: 'https://bilt.page/r/MATRIX', referralBonus: '10,000 Bilt Points', referralValue: 180`

## 1.2 Component Creation: `src/components/AffiliateTab.tsx`
Create `src/components/AffiliateTab.tsx`:
```tsx
import React, { useState } from 'react';
import { Gift, ExternalLink, Copy, Check, Sparkles, DollarSign, Share2 } from 'lucide-react';
import type { CreditCard, UserProfile } from '../data/mockData';

interface AffiliateTabProps {
  cards: CreditCard[];
  profile: UserProfile;
}

export const AffiliateTab: React.FC<AffiliateTabProps> = ({ cards, profile }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter cards that have referralUrl and match current active player
  const referralCards = cards
    .filter((card) => Boolean(card.referralUrl))
    .filter(
      (card) => profile.activePlayer === 'All' || card.player === profile.activePlayer
    )
    .sort((a, b) => (b.referralValue ?? 0) - (a.referralValue ?? 0));

  const totalPotentialEarnings = referralCards.reduce(
    (sum, card) => sum + (card.referralValue ?? 0),
    0
  );

  const handleCopyLink = (cardId: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(cardId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Gift className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-white">推荐返利引擎 (Affiliate Referral Engine)</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            分享您的专属信用卡 Refer 链接。好友成功开卡后，您可获得丰厚推荐点数奖励。
          </p>
        </div>

        {/* Counter Badge */}
        <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 flex items-center space-x-4 shadow-xl">
          <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              潜在推荐总收益 (Total Potential Value)
            </div>
            <div className="text-2xl font-black text-emerald-400 tracking-tight">
              ${totalPotentialEarnings.toLocaleString()} USD
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              基于 {referralCards.length} 张可用推荐卡片估值
            </div>
          </div>
        </div>
      </div>

      {/* Cards Referral Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {referralCards.map((card) => (
          <div
            key={card.id}
            className="glass-panel rounded-3xl p-5 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
          >
            <div>
              {/* Mini Header Card Banner */}
              <div
                className={`w-full h-28 rounded-2xl bg-gradient-to-br ${card.colorGradient} p-4 border border-white/10 flex flex-col justify-between relative overflow-hidden shadow-lg mb-4`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-black/50 text-white/90 text-[10px] font-bold rounded-full border border-white/10 backdrop-blur-md">
                    {card.issuer} • {card.player}
                  </span>
                  <span className="text-xs font-bold text-white/40 tracking-wider">
                    {card.network}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white truncate drop-shadow">
                    {card.name}
                  </h3>
                </div>
              </div>

              {/* Bonus Info Section */}
              <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">推荐奖励 (Referral Bonus):</span>
                  <span className="font-extrabold text-amber-400">{card.referralBonus}</span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-slate-800/80 pt-2">
                  <span className="text-slate-400 font-medium">预估价值 (Est. USD):</span>
                  <span className="font-extrabold text-emerald-400">${card.referralValue} USD</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => card.referralUrl && handleCopyLink(card.id, card.referralUrl)}
                className="flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
              >
                {copiedId === card.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">已复制!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>复制链接</span>
                  </>
                )}
              </button>

              <a
                href={card.referralUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>打开链接</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 1.3 Sidebar Update: `src/components/Sidebar.tsx`
1. Update `TabType` union:
```typescript
export type TabType =
  | 'dashboard'
  | 'cards'
  | 'airlines'
  | 'hotels'
  | 'cars'
  | 'merchant'
  | 'transfers'
  | 'rules524'
  | 'affiliate'; // ← NEW
```

2. Add icon import: `Gift` from `'lucide-react'`

3. Add menu item after `rules524`:
```typescript
    {
      id: 'affiliate',
      label: '推荐返利引擎 (Referral Engine)',
      icon: Gift,
      badge: 'Earn Rewards',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
```

## 1.4 App.tsx Integration
Import `AffiliateTab` and add rendering block:
```tsx
{activeTab === 'affiliate' && (
  <AffiliateTab cards={cards} profile={profile} />
)}
```

---

# 📌 FEATURE 2: CSV STATEMENT PARSER

## 2.1 Parser Utility Creation: `src/lib/csvParser.ts`

Create `src/lib/csvParser.ts`:
```typescript
export interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  category?: string;
}

export interface ParseResult {
  issuer: 'Chase' | 'Amex' | 'CapitalOne' | 'Citi' | 'Generic';
  transactions: ParsedTransaction[];
  totalSpend: number;
  errors: string[];
}

function parseCSVLines(csvText: string): string[][] {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  return lines.map((line) => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^"+|"+$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^"+|"+$/g, ''));
    return result;
  });
}

export function parseCSV(csvText: string): ParseResult {
  const rows = parseCSVLines(csvText);
  if (rows.length < 2) {
    return { issuer: 'Generic', transactions: [], totalSpend: 0, errors: ['CSV file is empty or missing headers.'] };
  }

  const header = rows[0].map((h) => h.toLowerCase());
  const dataRows = rows.slice(1);
  const transactions: ParsedTransaction[] = [];
  let issuer: ParseResult['issuer'] = 'Generic';

  // Detect Issuer Strategy
  if (header.includes('transaction date') && header.includes('post date') && header.includes('type')) {
    issuer = 'Chase';
  } else if (header.includes('appears on your statement as') || header.includes('extended details')) {
    issuer = 'Amex';
  } else if (header.includes('card no.') && header.includes('debit')) {
    issuer = 'CapitalOne';
  } else if (header.includes('status') && header.includes('debit') && header.includes('credit')) {
    issuer = 'Citi';
  }

  dataRows.forEach((row) => {
    if (row.length < 3) return;

    if (issuer === 'Chase') {
      // Chase: Transaction Date, Post Date, Description, Category, Type, Amount, Memo
      const date = row[0] || '';
      const desc = row[2] || '';
      const cat = row[3] || '';
      const amtStr = row[5] || '0';
      const rawAmt = parseFloat(amtStr.replace(/[^0-9.-]+/g, ''));
      // Chase charges are negative numbers, payments positive
      if (!isNaN(rawAmt) && rawAmt < 0) {
        const spend = Math.abs(rawAmt);
        transactions.push({ date, description: desc, amount: spend, category: cat });
      }
    } else if (issuer === 'Amex') {
      // Amex: Date, Description, Amount, Extended Details...
      const date = row[0] || '';
      const desc = row[1] || '';
      const amtStr = row[2] || '0';
      const rawAmt = parseFloat(amtStr.replace(/[^0-9.-]+/g, ''));
      // Amex charges are positive numbers
      if (!isNaN(rawAmt) && rawAmt > 0) {
        transactions.push({ date, description: desc, amount: rawAmt });
      }
    } else if (issuer === 'CapitalOne') {
      // CapOne: Transaction Date, Posted Date, Card No., Description, Category, Debit, Credit
      const date = row[0] || '';
      const desc = row[3] || '';
      const cat = row[4] || '';
      const debitStr = row[5] || '';
      const debitAmt = parseFloat(debitStr.replace(/[^0-9.-]+/g, ''));
      if (!isNaN(debitAmt) && debitAmt > 0) {
        transactions.push({ date, description: desc, amount: debitAmt, category: cat });
      }
    } else {
      // GenericFallback
      const date = row[0] || '';
      const desc = row[1] || '';
      const amtStr = row[2] || '0';
      const amt = Math.abs(parseFloat(amtStr.replace(/[^0-9.-]+/g, '')));
      if (!isNaN(amt) && amt > 0) {
        transactions.push({ date, description: desc, amount: amt });
      }
    }
  });

  const totalSpend = transactions.reduce((sum, t) => sum + t.amount, 0);

  return {
    issuer,
    transactions,
    totalSpend,
    errors: transactions.length === 0 ? ['No valid spend transactions detected.'] : [],
  };
}
```

## 2.2 Upload Modal Component: `src/components/StatementUploaderModal.tsx`

Create `src/components/StatementUploaderModal.tsx`:
```tsx
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, ArrowRight, DollarSign } from 'lucide-react';
import { parseCSV, type ParseResult } from '../lib/csvParser';
import type { CreditCard } from '../data/mockData';

interface StatementUploaderModalProps {
  card: CreditCard;
  onClose: () => void;
  onApplySpend: (amount: number) => void;
}

export const StatementUploaderModal: React.FC<StatementUploaderModalProps> = ({
  card,
  onClose,
  onApplySpend,
}) => {
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const result = parseCSV(text);
        setParseResult(result);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmApply = () => {
    if (parseResult && parseResult.totalSpend > 0) {
      onApplySpend(parseResult.totalSpend);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl glass-panel rounded-3xl border border-slate-800 p-6 space-y-6 shadow-2xl bg-[#0b101d]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">上傳賬單解析 (Statement CSV Parser)</h3>
              <p className="text-xs text-slate-400">針對卡片: {card.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Drop Zone */}
        {!parseResult && (
          <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3 bg-slate-950/40 transition-all">
            <Upload className="w-10 h-10 text-indigo-400 animate-bounce" />
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-200">點擊選擇或拖拽 CSV 賬單文件</p>
              <p className="text-xs text-slate-500 mt-1">支持 Chase, Amex, Capital One, Citi 官方導出格式</p>
            </div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="absolute opacity-0 cursor-pointer w-full h-40"
            />
          </div>
        )}

        {/* Parsed Result Preview */}
        {parseResult && (
          <div className="space-y-4">
            {/* Status Summary Banner */}
            <div className="flex flex-wrap items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 gap-4">
              <div>
                <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  檢測發卡行: {parseResult.issuer}
                </span>
                <p className="text-xs text-slate-400 mt-1.5">文件: {fileName} ({parseResult.transactions.length} 筆有效消費)</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium">識別總有效金額</div>
                <div className="text-xl font-black text-emerald-400">
                  ${parseResult.totalSpend.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Transactions Preview Table */}
            <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-800/80 bg-slate-950/60 p-2 space-y-1">
              {parseResult.transactions.map((tx, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-slate-900/80">
                  <div>
                    <div className="font-semibold text-slate-200 truncate max-w-xs">{tx.description}</div>
                    <div className="text-[10px] text-slate-500">{tx.date} {tx.category ? `• ${tx.category}` : ''}</div>
                  </div>
                  <div className="font-bold text-slate-100">${tx.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setParseResult(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                重新上傳
              </button>
              <button
                onClick={handleConfirmApply}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>一鍵計入 MSR 開卡進度 (${parseResult.totalSpend.toFixed(2)})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

## 2.3 Integration in `src/components/CardsTab.tsx`

1. Add state:
```typescript
const [uploadingCardId, setUploadingCardId] = useState<string | null>(null);
```

2. Render Upload Button on MSR Cards:
```tsx
{card.msr && (
  <button
    onClick={() => setUploadingCardId(card.id)}
    className="flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg transition-all"
  >
    <FileText className="w-3.5 h-3.5" />
    <span>📄 上傳 CSV 賬單自動計入</span>
  </button>
)}
```

3. Render Modal:
```tsx
{uploadingCardId && (
  <StatementUploaderModal
    card={cards.find((c) => c.id === uploadingCardId)!}
    onClose={() => setUploadingCardId(null)}
    onApplySpend={(amt) => onRecordMsrSpend(uploadingCardId, amt)}
  />
)}
```

---

# 📌 FEATURE 3: NOTIFICATION SYSTEM

## 3.1 Rules & Engine: `src/lib/notifications.ts`

Create `src/lib/notifications.ts`:
```typescript
import type { CreditCard, AirlineProgram, HotelProgram, TransferPartner } from '../data/mockData';
import type { TabType } from '../components/Sidebar';

export type UrgencyLevel = 'high' | 'medium' | 'low';

export interface AppNotification {
  id: string;
  type: 'msr_deadline' | 'miles_expiry' | 'fnc_expiry' | 'transfer_bonus' | 'unclaimed_perk';
  title: string;
  body: string;
  urgency: UrgencyLevel;
  targetTab: TabType;
  createdAt: string;
  isRead: boolean;
}

export function generateNotifications(
  cards: CreditCard[],
  airlines: AirlineProgram[],
  hotels: HotelProgram[],
  transferPartners: TransferPartner[]
): AppNotification[] {
  const notifs: AppNotification[] = [];

  // Rule 1: MSR Deadline < 30 Days & Incomplete
  cards.forEach((card) => {
    if (card.msr && card.msr.currentSpend < card.msr.requiredSpend) {
      if (card.msr.deadlineDaysRemaining <= 30) {
        notifs.push({
          id: `msr-${card.id}`,
          type: 'msr_deadline',
          title: `⚠️ ${card.name} MSR 開卡獎勵截止倒計時`,
          body: `僅剩 ${card.msr.deadlineDaysRemaining} 天！尚需消費 $${(card.msr.requiredSpend - card.msr.currentSpend).toLocaleString()} 才能拿 ${card.msr.bonusPoints.toLocaleString()} 點數！`,
          urgency: card.msr.deadlineDaysRemaining <= 14 ? 'high' : 'medium',
          targetTab: 'cards',
          createdAt: new Date().toISOString(),
          isRead: false,
        });
      }
    }
  });

  // Rule 2: Airline Miles Expiry < 90 Days
  airlines.forEach((air) => {
    if (air.isExpirationWarning && air.expirationDate) {
      const exp = new Date(air.expirationDate);
      const diffDays = Math.ceil((exp.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      if (diffDays <= 90) {
        notifs.push({
          id: `air-${air.id}`,
          type: 'miles_expiry',
          title: `✈️ ${air.name} 里程即將過期`,
          body: `${air.milesBalance.toLocaleString()} 里程將於 ${air.expirationDate} (${diffDays} 天後) 過期，請及時保鮮！`,
          urgency: diffDays <= 30 ? 'high' : 'medium',
          targetTab: 'airlines',
          createdAt: new Date().toISOString(),
          isRead: false,
        });
      }
    }
  });

  // Rule 3: Hotel FNC Expiry < 90 Days & Unused
  hotels.forEach((hotel) => {
    hotel.fncs.forEach((fnc) => {
      if (!fnc.isUsed) {
        const exp = new Date(fnc.expirationDate);
        const diffDays = Math.ceil((exp.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        if (diffDays <= 90) {
          notifs.push({
            id: `fnc-${fnc.id}`,
            type: 'fnc_expiry',
            title: `🏨 免房券 FNC 即將到期`,
            body: `${hotel.name} ${fnc.title} (${fnc.categoryLimit}) 倒計時 ${diffDays} 天到期！`,
            urgency: diffDays <= 30 ? 'high' : 'medium',
            targetTab: 'hotels',
            createdAt: new Date().toISOString(),
            isRead: false,
          });
        }
      }
    });
  });

  // Rule 4: Transfer Bonus Active
  transferPartners.forEach((tp) => {
    if (tp.currentBonus) {
      notifs.push({
        id: `tp-${tp.bankCurrency}-${tp.partnerName}`,
        type: 'transfer_bonus',
        title: `🔥 限時轉点加贈: ${tp.bankCurrency} ➔ ${tp.partnerName}`,
        body: `特惠加贈 ${tp.currentBonus}，手慢無！`,
        urgency: 'medium',
        targetTab: 'transfers',
        createdAt: new Date().toISOString(),
        isRead: false,
      });
    }
  });

  // Rule 5: High Value Unclaimed Perks (> $100)
  cards.forEach((card) => {
    card.perks.forEach((p) => {
      if (!p.used && p.value >= 100) {
        notifs.push({
          id: `perk-${p.id}`,
          type: 'unclaimed_perk',
          title: `🎁 待領取高價值福利: ${card.name}`,
          body: `${p.title} ($${p.value} USD) 尚未打卡報銷。`,
          urgency: 'low',
          targetTab: 'cards',
          createdAt: new Date().toISOString(),
          isRead: false,
        });
      }
    });
  });

  return notifs;
}
```

## 3.2 Update Store: `src/store/useAppStore.ts`
Add notification state and actions:
```typescript
  notifications: AppNotification[];
  markNotifRead: (id: string) => void;
  clearAllNotifs: () => void;
  regenerateNotifs: () => void;
```

Implementation inside Zustand store:
```typescript
      notifications: [],
      regenerateNotifs: () =>
        set((state) => ({
          notifications: generateNotifications(
            state.cards,
            state.airlines,
            state.hotels,
            MOCK_TRANSFER_PARTNERS
          ),
        })),
      markNotifRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        })),
      clearAllNotifs: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        })),
```

## 3.3 Notification Center Component: `src/components/NotificationCenter.tsx`

Create `src/components/NotificationCenter.tsx`:
```tsx
import React from 'react';
import { Bell, X, CheckCheck, ChevronRight, AlertTriangle, Info, Clock } from 'lucide-react';
import type { AppNotification } from '../lib/notifications';
import type { TabType } from './Sidebar';

interface NotificationCenterProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onNavigate: (tab: TabType) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkRead,
  onClearAll,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  const getUrgencyBadge = (u: AppNotification['urgency']) => {
    if (u === 'high') return <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-md">🔴 高優先級</span>;
    if (u === 'medium') return <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md">🟡 中優先級</span>;
    return <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">🟢 溫馨提醒</span>;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-slate-800 bg-[#090d16] p-6 flex flex-col justify-between shadow-2xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center space-x-2.5">
              <Bell className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">通知中心 (Notifications)</h3>
              {unreadNotifs.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">
                  {unreadNotifs.length}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                <CheckCheck className="w-12 h-12 text-emerald-400" />
                <p className="text-sm font-bold text-slate-200">所有提醒已處理完畢！</p>
                <p className="text-xs text-slate-500">目前沒有即將過期的點數或權益</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    onMarkRead(n.id);
                    onNavigate(n.targetTab);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    n.isRead
                      ? 'bg-slate-950/40 border-slate-900 opacity-60'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {getUrgencyBadge(n.urgency)}
                    <span className="text-[10px] text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>即時</span>
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{n.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.body}</p>
                  <div className="flex items-center justify-end text-[11px] font-semibold text-indigo-400 pt-1">
                    <span>立即前往查看</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-slate-400 hover:text-white"
            >
              全部標記為已讀
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## 3.4 Header Integration: `src/components/Header.tsx`
Add Bell Button with badge:
```tsx
<button
  onClick={onOpenNotifCenter}
  className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all"
>
  <Bell className="w-4 h-4 text-slate-300" />
  {unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
      {unreadCount}
    </span>
  )}
</button>
```

---

# 📌 FEATURE 4: REACT NATIVE APP INITIALIZATION

## Setup Instructions for Expo App

Directory: `c:\Users\Matrixkuo\Desktop\Antigravity\APP Design\PointsVault-Mobile`

Initialize project:
```bash
npx create-expo-app@latest PointsVault-Mobile --template default
cd PointsVault-Mobile
npm install nativewind zustand lucide-react-native expo-router react-native-safe-area-context
```

### Mobile Layout File: `PointsVault-Mobile/app/(tabs)/_layout.tsx`
```tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#090d16',
          borderTopColor: '#1e293b',
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#64748b',
      }}
    >
      <Tabs.Screen name="index" options={{ title: '總覽' }} />
      <Tabs.Screen name="cards" options={{ title: '卡片' }} />
      <Tabs.Screen name="airlines" options={{ title: '里程' }} />
      <Tabs.Screen name="hotels" options={{ title: '酒店' }} />
      <Tabs.Screen name="finder" options={{ title: '刷卡' }} />
    </Tabs>
  );
}
```

### Mobile Dashboard Screen: `PointsVault-Mobile/app/(tabs)/index.tsx`
```tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useAppStore } from '../../shared/store/useAppStore';
import { StatBadge } from '../../components/StatBadge';

export default function DashboardScreen() {
  const cards = useAppStore((s) => s.cards);
  const airlines = useAppStore((s) => s.airlines);
  const hotels = useAppStore((s) => s.hotels);

  const totalValue =
    cards.reduce((sum, c) => sum + (c.currentBalance * c.cppValue) / 100, 0) +
    airlines.reduce((sum, a) => sum + (a.milesBalance * a.cppValue) / 100, 0) +
    hotels.reduce((sum, h) => sum + (h.pointsBalance * h.cppValue) / 100, 0);

  return (
    <ScrollView className="flex-1 bg-[#090d16] p-6 space-y-6">
      <View className="space-y-1">
        <Text className="text-xs text-slate-400 font-semibold">PointsVault Mobile</Text>
        <Text className="text-2xl font-black text-white">資產總估值</Text>
        <Text className="text-3xl font-extrabold text-emerald-400 mt-2">
          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
        </Text>
      </View>

      {/* Grid Badges */}
      <View className="flex-row flex-wrap justify-between gap-3">
        <StatBadge title="信用卡張數" value={`${cards.length} 張`} color="text-indigo-400" />
        <StatBadge title="飛行航司" value={`${airlines.length} 個`} color="text-sky-400" />
        <StatBadge title="酒店會籍" value={`${hotels.length} 個`} color="text-purple-400" />
        <StatBadge title="租車公司" value="3 家" color="text-emerald-400" />
      </View>
    </ScrollView>
  );
}
```

### Mobile Component: `PointsVault-Mobile/components/StatBadge.tsx`
```tsx
import React from 'react';
import { View, Text } from 'react-native';

interface StatBadgeProps {
  title: string;
  value: string;
  color: string;
}

export const StatBadge: React.FC<StatBadgeProps> = ({ title, value, color }) => {
  return (
    <View className="w-[48%] p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
      <Text className="text-[11px] text-slate-400 font-medium">{title}</Text>
      <Text className={`text-lg font-bold ${color}`}>{value}</Text>
    </View>
  );
};
```

### Mobile Component: `PointsVault-Mobile/components/PointsCard.tsx`
```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { CreditCard } from '../shared/data/mockData';

interface PointsCardProps {
  card: CreditCard;
}

export const PointsCard: React.FC<PointsCardProps> = ({ card }) => {
  const value = (card.currentBalance * card.cppValue) / 100;
  return (
    <View className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs text-slate-400 font-semibold">{card.issuer} • {card.player}</Text>
        <Text className="text-xs font-bold text-emerald-400">${value.toFixed(2)}</Text>
      </View>
      <Text className="text-base font-bold text-white">{card.name}</Text>
      <Text className="text-xs text-amber-400 font-semibold">
        {card.currentBalance.toLocaleString()} {card.pointsCurrency}
      </Text>
    </View>
  );
};
```

---

## ✅ Quality Control & Verification Checklist
1. Execute `npm run build` after each web feature modification.
2. Confirm zero TypeScript errors and zero missing module imports.
3. Validate mobile Expo configuration and structure.
