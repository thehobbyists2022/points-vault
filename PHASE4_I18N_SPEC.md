# PointsVault Phase 4 i18n (Internationalization) Technical Specification

This specification adds full **English / Chinese (EN/ZH)** dual-language switching to **PointsVault**, with **English as the primary default language**.

Structured for direct execution by **DeepSeek V4 Flash**.

---

## 🛠️ Tech Stack & Architecture Overview
- **Default Language**: `'en'` (English)
- **Supported Languages**: `'en'` (English), `'zh'` (Chinese)
- **Storage**: Persisted in Zustand store (`useAppStore.ts`) -> `localStorage`
- **Translation File**: `src/i18n/translations.ts` (Type-safe dictionary helper)

---

## ⚡ Execution Order for DeepSeek V4 Flash

1. **Step 1**: Create `src/i18n/translations.ts`
2. **Step 2**: Update `src/store/useAppStore.ts` (Add `language` state & `setLanguage` action)
3. **Step 3**: Update `src/components/Header.tsx` (Add `EN | 中文` switcher pill)
4. **Step 4**: Update `src/components/Sidebar.tsx` (Use translations for tab labels)
5. **Step 5**: Update Tab Components (`CardsTab`, `DashboardTab`, `MerchantFinderTab`, `Chase524Tab`, `AffiliateTab`, `NotificationCenter`)
6. **Step 6**: Run `npm run build` inside web directory to verify 0 errors.

---

# 📌 1. Translation Dictionary: `src/i18n/translations.ts`

Create `src/i18n/translations.ts`:
```typescript
export type Language = 'en' | 'zh';

export const translations = {
  en: {
    // Header
    brandSubtitle: "US Credit Cards, Hotels & Miles Portfolio Terminal",
    totalNetWorth: "Total Portfolio Value",
    ptsCount: "pts / miles",
    householdView: "Household",
    privacyBadge: "Local Encrypted / Safe",
    
    // Sidebar Tabs
    tabDashboard: "Dashboard",
    tabCards: "Cards & Perks",
    tabAirlines: "Airline Miles",
    tabHotels: "Hotels & FNC",
    tabCars: "Car Rental & CDW",
    tabMerchant: "Best Card Finder",
    tabTransfers: "Transfer Matrix",
    tabRules524: "Bank Rules & 5/24",
    tabAffiliate: "Referral Engine",
    
    // Cards Tab
    cardsTitle: "Credit Card Wallet & Perks Hub",
    cardsDesc: "Manage MSR welcome bonus progress, annual/monthly perk claims, and reward multipliers.",
    issuerAll: "All",
    unclaimedPerks: "Claimable Perks",
    msrDeadline: "MSR Bonus Progress",
    daysRemaining: "days remaining",
    uploadStatementBtn: "📄 Upload CSV Statement",
    recordSpendBtn: "+ Spend",
    applySpend: "Record Spend",
    cancel: "Cancel",
    annualFee: "Annual Fee",
    
    // Merchant Finder Tab
    finderTitle: "Best Card Finder",
    finderDesc: "Select spending category and amount to find the optimal card for max return.",
    category: "Category",
    purchaseAmount: "Purchase Amount",
    optimalCard: "TOP RECOMMENDATION",
    effectiveReturn: "Effective Return",
    ptsEarned: "Points Earned",
    
    // 5/24 Tab
    rulesTitle: "Bank Application Rules & 5/24 Monitor",
    rulesDesc: "Track personal cards opened in 24 months to avoid 5/24, Amex lifetime, and Citi 8/65 rejections.",
    statusGood: "Status Good",
    statusOver: "5/24 Limit Reached",
    addOpeningDate: "Add Opening Date",
    
    // Referral Tab
    referralTitle: "Affiliate Referral Engine",
    referralDesc: "Share your referral links and earn bonus points when friends get approved.",
    potentialEarnings: "Total Potential Earnings",
    copyLink: "Copy Link",
    copied: "Copied!",
    openLink: "Open Link",
    
    // Notifications
    notifTitle: "Notifications",
    highPriority: "🔴 High Priority",
    medPriority: "🟡 Medium Priority",
    lowPriority: "🟢 Info / Reminder",
    markAllRead: "Mark All as Read",
    allClear: "All notifications cleared!",
    goToTab: "View Details",
  },
  zh: {
    // Header
    brandSubtitle: "美國信用卡、酒店與租車點數權益終端",
    totalNetWorth: "賬戶總估值",
    ptsCount: "積分 / 里程",
    householdView: "家庭總覽",
    privacyBadge: "本地加密 / 無網銀密碼風險",
    
    // Sidebar Tabs
    tabDashboard: "總覽概覽",
    tabCards: "信用卡與福利",
    tabAirlines: "飛行里程與伴飛券",
    tabHotels: "酒店與 FNC 房券",
    tabCars: "租車會籍與 CDW",
    tabMerchant: "刷卡神器",
    tabTransfers: "轉點夥伴矩陣",
    tabRules524: "5/24 規則與開卡槽",
    tabAffiliate: "推薦返利引擎",
    
    // Cards Tab
    cardsTitle: "我的信用卡錢包與專屬福利庫",
    cardsDesc: "全量管理開卡禮進度 (MSR)、每年年度/月度報銷額度打卡及返點倍率。",
    issuerAll: "全部發卡行",
    unclaimedPerks: "個可報銷",
    msrDeadline: "MSR 開卡獎勵進度",
    daysRemaining: "天剩餘",
    uploadStatementBtn: "📄 上傳 CSV 賬單自動計入",
    recordSpendBtn: "+ 記帳",
    applySpend: "確認計入",
    cancel: "取消",
    annualFee: "年費",
    
    // Merchant Finder Tab
    finderTitle: "刷卡神器",
    finderDesc: "選擇消費類別與金額，智能推薦回報率最高的信用卡。",
    category: "消費類別",
    purchaseAmount: "消費金額",
    optimalCard: "最佳刷卡選擇",
    effectiveReturn: "有效回報率",
    ptsEarned: "預估賺取點數",
    
    // 5/24 Tab
    rulesTitle: "銀行開卡規則護欄 & Chase 5/24 動態監控",
    rulesDesc: "計算 24 個月內新卡開立數量，避免因超出 5/24 限制、Amex 一生一次規則或 Citi 8/65 導致申卡被拒。",
    statusGood: "狀態良好",
    statusOver: "已超出 5/24 限制",
    addOpeningDate: "新增開卡日期",
    
    // Referral Tab
    referralTitle: "推薦返利引擎",
    referralDesc: "分享您的專屬信用卡 Refer 鏈接。好友成功開卡後，您可獲得豐厚推薦點數獎勵。",
    potentialEarnings: "潛在推薦總收益",
    copyLink: "複製鏈接",
    copied: "已複製!",
    openLink: "打開鏈接",
    
    // Notifications
    notifTitle: "通知中心",
    highPriority: "🔴 高優先級",
    medPriority: "🟡 中優先級",
    lowPriority: "🟢 溫馨提醒",
    markAllRead: "全部標記為已讀",
    allClear: "所有提醒已處理完畢！",
    goToTab: "立即前往查看",
  }
};

export function t(lang: Language, key: keyof typeof translations['en']): string {
  return translations[lang]?.[key] || translations['en'][key] || key;
}
```

---

# 📌 2. Update Zustand Store: `src/store/useAppStore.ts`

Add `language` state & `setLanguage` action:
```typescript
import type { Language } from '../i18n/translations';

interface AppState {
  language: Language; // Default 'en'
  setLanguage: (lang: Language) => void;
  // ... existing fields
}

// Inside store definition:
language: 'en',
setLanguage: (lang) => set({ language: lang }),
```

---

# 📌 3. Update Header: `src/components/Header.tsx`

Add language switcher pill:
```tsx
import { useAppStore } from '../store/useAppStore';
import { t } from '../i18n/translations';

// Inside Header Component:
const language = useAppStore((s) => s.language);
const setLanguage = useAppStore((s) => s.setLanguage);

// In JSX (Next to profile buttons):
<div className="flex items-center bg-slate-950/80 border border-slate-800 p-0.5 rounded-xl">
  <button
    onClick={() => setLanguage('en')}
    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
      language === 'en'
        ? 'bg-indigo-600 text-white shadow-md'
        : 'text-slate-400 hover:text-white'
    }`}
  >
    EN
  </button>
  <button
    onClick={() => setLanguage('zh')}
    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
      language === 'zh'
        ? 'bg-indigo-600 text-white shadow-md'
        : 'text-slate-400 hover:text-white'
    }`}
  >
    中文
  </button>
</div>
```

---

## ✅ Quality Control Checklist
1. Build verification: `npm run build` returns 0 errors.
2. Default language on clean state is **English (`en`)**.
3. Clicking `EN` / `中文` instantly updates UI labels.
4. Language preference persists across page reloads.
