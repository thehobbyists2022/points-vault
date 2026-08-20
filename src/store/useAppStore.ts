import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  MOCK_CARDS,
  MOCK_AIRLINE_PROGRAMS,
  MOCK_HOTEL_PROGRAMS,
  MOCK_CAR_RENTALS,
  MOCK_TRANSFER_PARTNERS,
  INITIAL_PROFILE,
  type CreditCard,
  type AirlineProgram,
  type HotelProgram,
  type CarRentalProgram,
  type UserProfile,
} from '../data/mockData';
import type { TabType } from '../components/Sidebar';
import { generateNotifications, type AppNotification } from '../lib/notifications';
import type { Language } from '../i18n/translations';

interface AppState {
  language: Language;
  cards: CreditCard[];
  airlines: AirlineProgram[];
  hotels: HotelProgram[];
  cars: CarRentalProgram[];
  profile: UserProfile;
  activeTab: TabType;
  notifications: AppNotification[];
  userEmail: string | null;

  setLanguage: (lang: Language) => void;
  setActiveTab: (tab: TabType) => void;
  setProfile: (updater: UserProfile | ((prev: UserProfile) => UserProfile)) => void;
  setUserEmail: (email: string | null) => void;

  togglePerk: (cardId: string, perkId: string) => void;
  recordMsrSpend: (cardId: string, amount: number) => void;
  setCards: (cards: CreditCard[]) => void;

  addChase524Opening: (player: 'P1' | 'P2', date: string) => void;
  removeChase524Opening: (player: 'P1' | 'P2', date: string) => void;

  regenerateNotifs: () => void;
  markNotifRead: (id: string) => void;
  clearAllNotifs: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'en',
      cards: MOCK_CARDS,
      airlines: MOCK_AIRLINE_PROGRAMS,
      hotels: MOCK_HOTEL_PROGRAMS,
      cars: MOCK_CAR_RENTALS,
      profile: INITIAL_PROFILE,
      activeTab: 'dashboard',
      notifications: generateNotifications(
        MOCK_CARDS,
        MOCK_AIRLINE_PROGRAMS,
        MOCK_HOTEL_PROGRAMS,
        MOCK_TRANSFER_PARTNERS
      ),
      userEmail: null,

      setLanguage: (lang) => set({ language: lang }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setUserEmail: (email) => set({ userEmail: email }),

      setProfile: (updater) =>
        set((state) => ({
          profile:
            typeof updater === 'function'
              ? (updater as (prev: UserProfile) => UserProfile)(state.profile)
              : updater,
        })),

      togglePerk: (cardId, perkId) =>
        set((state) => ({
          cards: state.cards.map((card) => {
            if (card.id === cardId) {
              return {
                ...card,
                perks: card.perks.map((perk) =>
                  perk.id === perkId ? { ...perk, used: !perk.used } : perk
                ),
              };
            }
            return card;
          }),
        })),

      recordMsrSpend: (cardId, amount) =>
        set((state) => ({
          cards: state.cards.map((card) => {
            if (card.id === cardId && card.msr) {
              const newCurrent = Math.min(card.msr.requiredSpend, card.msr.currentSpend + amount);
              return {
                ...card,
                msr: {
                  ...card.msr,
                  currentSpend: newCurrent,
                },
              };
            }
            return card;
          }),
        })),

      setCards: (cards) => set({ cards }),

      addChase524Opening: (player, date) =>
        set((state) => {
          const key = player === 'P1' ? 'chase524OpeningsP1' : 'chase524OpeningsP2';
          const current = state.profile[key];
          if (current.includes(date)) return state;
          const next = [...current, date].sort();
          return {
            profile: { ...state.profile, [key]: next },
          };
        }),

      removeChase524Opening: (player, date) =>
        set((state) => {
          const key = player === 'P1' ? 'chase524OpeningsP1' : 'chase524OpeningsP2';
          const next = state.profile[key].filter((d) => d !== date);
          return {
            profile: { ...state.profile, [key]: next },
          };
        }),

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
    }),
    {
      name: 'points-vault-storage',
      version: 3,
      partialize: (state) => ({
        language: state.language,
        cards: state.cards,
        profile: state.profile,
        activeTab: state.activeTab,
      }),
      migrate: (persistedState, version) => {
        const state = persistedState as Partial<AppState> | undefined;
        const profile = state?.profile;

        // Refresh static referral link fields from latest MOCK_CARDS so users
        // never see broken/outdated referral URLs (fixes dead amex/capital.one links).
        const refreshedCards = (state?.cards ?? MOCK_CARDS).map((card) => {
          const fresh = MOCK_CARDS.find((c) => c.id === card.id);
          if (!fresh) return card;
          return {
            ...card,
            referralUrl: fresh.referralUrl ?? card.referralUrl,
            referralBonus: fresh.referralBonus ?? card.referralBonus,
            referralValue: fresh.referralValue ?? card.referralValue,
          };
        });

        const base = {
          language: (state?.language ?? 'en') as Language,
          cards: refreshedCards,
          activeTab: (state?.activeTab ?? 'dashboard') as TabType,
        };
        if (version < 2 && profile) {
          // Upgrade legacy counter-based model (chase524CountP1/P2) to date-window model.
          const toDates = (count?: number, anchorDaysAgo = 365) => {
            const dates: string[] = [];
            const countNum = Math.max(0, count ?? 0);
            for (let i = 0; i < countNum; i++) {
              const d = new Date();
              d.setDate(d.getDate() - (anchorDaysAgo + i * 240));
              dates.push(d.toISOString().slice(0, 10));
            }
            return dates.sort();
          };
          const legacy = profile as unknown as { chase524CountP1?: number; chase524CountP2?: number };
          return {
            ...base,
            profile: {
              ...profile,
              chase524OpeningsP1: toDates(legacy.chase524CountP1),
              chase524OpeningsP2: toDates(legacy.chase524CountP2),
            },
          };
        }
        return {
          ...base,
          profile: profile ?? INITIAL_PROFILE,
        };
      },
    }
  )
);
