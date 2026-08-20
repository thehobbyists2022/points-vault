import { supabase, isSupabaseConfigured } from './supabase';
import { useAppStore } from '../store/useAppStore';
import { MOCK_CARDS } from '../data/mockData';
import type { Language } from '../i18n/translations';

// ── Push local state → Supabase ───────────────────────────────
export async function pushToCloud(userId: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { cards, profile, language } = useAppStore.getState();

  // Sync settings
  await supabase.from('user_settings').upsert({
    user_id: userId,
    language,
    active_player: profile.activePlayer,
    p1_name: profile.p1Name,
    p2_name: profile.p2Name,
    chase524_openings_p1: profile.chase524OpeningsP1,
    chase524_openings_p2: profile.chase524OpeningsP2,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });

  // Sync card states
  const cardStates = cards.map(card => ({
    user_id: userId,
    card_id: card.id,
    current_spend: card.msr?.currentSpend ?? 0,
    perks_used: Object.fromEntries(card.perks.map(p => [p.id, p.used])),
    updated_at: new Date().toISOString(),
  }));

  await supabase.from('user_card_states').upsert(cardStates, {
    onConflict: 'user_id,card_id',
  });
}

// ── Pull Supabase → local store ───────────────────────────────
export async function pullFromCloud(userId: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  const [settingsRes, cardStatesRes] = await Promise.all([
    supabase.from('user_settings').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('user_card_states').select('*').eq('user_id', userId),
  ]);

  const store = useAppStore.getState();

  if (settingsRes.data) {
    const s = settingsRes.data;
    store.setProfile({
      p1Name: s.p1_name ?? 'P1',
      p2Name: s.p2_name ?? 'P2',
      activePlayer: (s.active_player ?? 'All') as 'P1' | 'P2' | 'All',
      chase524OpeningsP1: s.chase524_openings_p1 ?? [],
      chase524OpeningsP2: s.chase524_openings_p2 ?? [],
    });
    store.setLanguage((s.language ?? 'en') as Language);
  }

  if (cardStatesRes.data && cardStatesRes.data.length > 0) {
    const remoteStates = cardStatesRes.data;
    const { cards } = store;
    const updatedCards = cards.map(card => {
      const remote = remoteStates.find(s => s.card_id === card.id);
      if (!remote) return card;
      return {
        ...card,
        msr: card.msr
          ? { ...card.msr, currentSpend: remote.current_spend ?? card.msr.currentSpend }
          : card.msr,
        perks: card.perks.map(p => ({
          ...p,
          used: (remote.perks_used as Record<string, boolean>)?.[p.id] ?? p.used,
        })),
      };
    });
    store.setCards(updatedCards);
  }
}

// ── Track referral click ──────────────────────────────────────
export async function trackReferralClick(
  cardId: string,
  cardName: string,
  referralUrl?: string,
  userId?: string
): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('referral_clicks').insert({
    user_id: userId ?? null,
    card_id: cardId,
    card_name: cardName,
    referral_url: referralUrl ?? null,
  });
}

// ── Fetch remote card rules ────────────────────────────────────
export async function fetchRemoteCardRules() {
  if (!isSupabaseConfigured) return MOCK_CARDS;

  const { data, error } = await supabase
    .from('card_rules')
    .select('*')
    .eq('is_active', true)
    .order('updated_at', { ascending: false });

  if (error || !data || data.length === 0) {
    console.warn('[PointsVault] Remote rules unavailable, using local data');
    return MOCK_CARDS;
  }

  return MOCK_CARDS.map(localCard => {
    const remote = data.find(r => r.id === localCard.id);
    if (!remote) return localCard;
    return {
      ...localCard,
      annualFee: remote.annual_fee ?? localCard.annualFee,
      cppValue: remote.cpp_value ?? localCard.cppValue,
      referralUrl: remote.referral_url ?? localCard.referralUrl,
      referralBonus: remote.referral_bonus ?? localCard.referralBonus,
      referralValue: remote.referral_value ?? localCard.referralValue,
    };
  });
}
