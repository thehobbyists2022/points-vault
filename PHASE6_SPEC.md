# PointsVault Phase 6 — DeepSeek V4 Flash Execution Spec

**Project**: `c:\Users\Matrixkuo\Desktop\Antigravity\APP Design\Points Mile` (Web)
**Mobile**: `c:\Users\Matrixkuo\Desktop\Antigravity\APP Design\PointsVault-Mobile`
**Stack**: React 18 + TypeScript + Vite + Tailwind v4 + Zustand + Supabase

Run `npm run build` after each Feature to verify 0 TypeScript errors.

---

## ⚡ Execution Order

1. Feature A — Complete Supabase Wiring (Web) ← MOST URGENT
2. Feature B — Auth User Header UI (Web)
3. Feature C — Portfolio History Chart (Web Dashboard)
4. Feature D — Mobile Supabase Integration

---

# FEATURE A: Complete Supabase Integration Wiring (Web)

## A.1 — Wire Affiliate Click Tracking in `src/components/AffiliateTab.tsx`

The `trackReferralClick()` function exists in `src/lib/sync.ts` but is NOT yet called anywhere. Wire it in.

Import at top:
```typescript
import { trackReferralClick } from '../lib/sync';
import { getUser } from '../lib/supabase';
```

Replace the existing `handleCopyLink` function and add a new `handleOpenLink`:
```typescript
const handleCopyLink = async (card: CreditCard) => {
  if (!card.referralUrl) return;
  navigator.clipboard.writeText(card.referralUrl);
  setCopiedId(card.id);
  setTimeout(() => setCopiedId(null), 2000);
  // Track copy as a click event too
  const user = await getUser();
  trackReferralClick(card.id, card.name, card.referralUrl, user?.id);
};

const handleOpenLink = async (card: CreditCard) => {
  if (!card.referralUrl) return;
  const user = await getUser();
  await trackReferralClick(card.id, card.name, card.referralUrl, user?.id);
  window.open(card.referralUrl, '_blank', 'noopener,noreferrer');
};
```

Update both buttons to call the new handlers:
- Copy button: `onClick={() => handleCopyLink(card)}`
- Open Link `<a>` tag: change to `<button>` with `onClick={() => handleOpenLink(card)}`

## A.2 — Auto-Sync Debounce in `src/App.tsx`

Add a debounced `useEffect` that auto-pushes to Supabase whenever `cards` or `profile` changes (only when signed in). Add after the existing auth `useEffect`:

```typescript
// Auto-sync to Supabase when local state changes (debounced 4 seconds)
useEffect(() => {
  if (!userId || !isSupabaseConfigured) return;
  const timer = setTimeout(() => {
    pushToCloud(userId).catch(console.error);
  }, 4000);
  return () => clearTimeout(timer);
}, [cards, profile, userId]);
```

---

# FEATURE B: Auth User Header UI (Web)

## B.1 — Update `src/store/useAppStore.ts`

Add to AppState interface:
```typescript
userEmail: string | null;
setUserEmail: (email: string | null) => void;
```

Add to store body:
```typescript
userEmail: null,
setUserEmail: (email) => set({ userEmail: email }),
```

Do NOT persist `userEmail` (remove from partialize — it comes from Supabase auth session).

## B.2 — Update `src/App.tsx`

After `setUserId(uid)` in the auth state change handler, also set the email:
```typescript
import { supabase } from './lib/supabase';

// Inside onAuthStateChange callback:
setUserId(uid);
if (uid) {
  const { data } = await supabase.auth.getUser();
  useAppStore.getState().setUserEmail(data.user?.email ?? null);
  pushToCloud(uid).catch(console.error);
} else {
  useAppStore.getState().setUserEmail(null);
}
```

Pass `userEmail` from store to `Header`:
```typescript
const userEmail = useAppStore((s) => s.userEmail);
// Pass: <Header ... userEmail={userEmail} onSignOut={handleSignOut} />
```

Add `handleSignOut` function:
```typescript
const handleSignOut = async () => {
  await signOut();
  setUserId(null);
  useAppStore.getState().setUserEmail(null);
};
```

Import `signOut` from `'./lib/supabase'`.

## B.3 — Update `src/components/Header.tsx`

Add new props:
```typescript
userEmail?: string | null;
onSignOut?: () => void;
```

Add user avatar / email display + logout button next to the cloud icon:
```tsx
{userEmail && (
  <div className="hidden lg:flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
      {userEmail[0].toUpperCase()}
    </div>
    <span className="text-xs text-slate-300 max-w-[120px] truncate">{userEmail}</span>
    <button
      onClick={onSignOut}
      className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors font-semibold ml-1"
    >
      Sign Out
    </button>
  </div>
)}
```

Place this block immediately before the Privacy Badge div.

---

# FEATURE C: Portfolio History Chart (Web Dashboard)

## C.1 — Install Recharts

```bash
npm install recharts
npm install @types/recharts --save-dev
```

## C.2 — Create `src/lib/portfolioHistory.ts`

```typescript
export interface PortfolioSnapshot {
  date: string; // ISO date (YYYY-MM-DD)
  totalValueUSD: number;
  cardValueUSD: number;
  airlineValueUSD: number;
  hotelValueUSD: number;
}

const STORAGE_KEY = 'points-vault-portfolio-history';

export function saveSnapshot(snapshot: PortfolioSnapshot): void {
  const existing = loadHistory();
  const today = new Date().toISOString().slice(0, 10);
  // One snapshot per day only
  const filtered = existing.filter(s => s.date !== today);
  const updated = [...filtered, snapshot].slice(-90); // Keep 90 days max
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function loadHistory(): PortfolioSnapshot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
```

## C.3 — Update `src/App.tsx`

Add a `useEffect` that saves a daily portfolio snapshot whenever the total value changes:

```typescript
import { saveSnapshot } from './lib/portfolioHistory';

// After the existing useEffects:
useEffect(() => {
  if (totalValueDollars > 0) {
    saveSnapshot({
      date: new Date().toISOString().slice(0, 10),
      totalValueUSD: totalValueDollars,
      cardValueUSD: cardValue,
      airlineValueUSD: airlineValue,
      hotelValueUSD: hotelValue,
    });
  }
}, [totalValueDollars]);
```

## C.4 — Update `src/components/DashboardTab.tsx`

Add a portfolio chart panel at the bottom of the Dashboard page.

Import:
```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { loadHistory } from '../lib/portfolioHistory';
```

Add chart component inside DashboardTab:
```tsx
const history = loadHistory();

{history.length >= 2 && (
  <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
    <div className="flex items-center space-x-2">
      <TrendingUp className="w-5 h-5 text-indigo-400" />
      <h3 className="text-base font-bold text-white">
        {t(language, 'portfolioHistory')}
      </h3>
    </div>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={history} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#64748b', fontSize: 10 }}
          tickFormatter={(v) => v.slice(5)} // Show MM-DD only
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: 10 }}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{ background: '#0b101d', border: '1px solid #1e293b', borderRadius: '12px' }}
          labelStyle={{ color: '#94a3b8', fontSize: '11px' }}
          formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
        />
        <Line type="monotone" dataKey="totalValueUSD" stroke="#6366f1" strokeWidth={2} dot={false} name="Total" />
        <Line type="monotone" dataKey="cardValueUSD" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Cards" />
        <Line type="monotone" dataKey="airlineValueUSD" stroke="#38bdf8" strokeWidth={1.5} dot={false} name="Airlines" />
        <Line type="monotone" dataKey="hotelValueUSD" stroke="#a78bfa" strokeWidth={1.5} dot={false} name="Hotels" />
      </LineChart>
    </ResponsiveContainer>
  </div>
)}
```

Add to `src/i18n/translations.ts`:
- EN: `portfolioHistory: 'Portfolio Value History (90 Days)'`
- ZH: `portfolioHistory: '資產估值歷史走勢 (90 天)'`

---

# FEATURE D: Mobile App Supabase Integration

## D.1 — Install Supabase in Mobile App

```bash
cd "c:\Users\Matrixkuo\Desktop\Antigravity\APP Design\PointsVault-Mobile"
npx expo install @supabase/supabase-js expo-secure-store
```

## D.2 — Create `PointsVault-Mobile/shared/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const SUPABASE_URL = 'https://tgnedqojhbszgqoiloqe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_J1wJMg0KvGYguKk_09pPRg_7nrYFPGy';

// Use expo-secure-store for session persistence on mobile
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}
```

## D.3 — Create `PointsVault-Mobile/app/(tabs)/profile.tsx`

New tab screen for sign-in + account management:
```tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { supabase, signIn, signOut, getUser } from '../../shared/lib/supabase';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUser().then(setUser);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) Alert.alert('Sign In Error', error.message);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <ScrollView className="flex-1 bg-[#090d16] p-6">
      {user ? (
        <View className="space-y-4">
          <Text className="text-xl font-bold text-white">Cloud Sync Active ☁️</Text>
          <Text className="text-sm text-slate-400">{user.email}</Text>
          <TouchableOpacity
            onPress={handleSignOut}
            className="p-4 bg-rose-600 rounded-2xl items-center"
          >
            <Text className="text-white font-bold">Sign Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="space-y-4">
          <Text className="text-xl font-bold text-white">Sign In to Sync</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#475569"
            keyboardType="email-address"
            autoCapitalize="none"
            className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white"
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#475569"
            secureTextEntry
            className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white"
          />
          <TouchableOpacity
            onPress={handleSignIn}
            disabled={loading}
            className="p-4 bg-indigo-600 rounded-2xl items-center"
          >
            <Text className="text-white font-bold">
              {loading ? 'Signing In...' : 'Sign In & Sync'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
```

Update `PointsVault-Mobile/app/(tabs)/_layout.tsx` to add Profile tab:
```tsx
<Tabs.Screen name="profile" options={{ title: 'Account' }} />
```

---

## ✅ Quality Control Checklist

After completing ALL features:
1. `npm run build` in web project — must be 0 TypeScript errors.
2. Verify in browser:
   - Sign in → user avatar + email appears in Header ✓
   - Open Referral tab → click "Open Link" → Supabase `referral_clicks` table receives new row ✓
   - MSR spend recorded → wait 4 seconds → Supabase `user_card_states` row auto-updates ✓
   - Dashboard shows portfolio chart after 2+ day snapshots (or mock 2 rows in localStorage for test) ✓
3. `tsc --noEmit` in mobile project — must be 0 errors.
