import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  MOCK_CARDS,
  MOCK_AIRLINE_PROGRAMS,
  MOCK_HOTEL_PROGRAMS,
  MOCK_CAR_RENTALS,
  MOCK_TRANSFER_PARTNERS,
  MOCK_BANK_BONUSES,
  INITIAL_PROFILE,
  type CreditCard,
  type AirlineProgram,
  type HotelProgram,
  type CarRentalProgram,
  type BankBonus,
  type UserProfile,
} from '../data/mockData';
import type { TabType } from '../components/Sidebar';
import { generateNotifications, type AppNotification } from '../lib/notifications';
import type { Language } from '../i18n/translations';

import { DEFAULT_CPP_RATES } from '../lib/valuation';
export { DEFAULT_CPP_RATES };

interface AppState {
  language: Language;
  cards: CreditCard[];
  airlines: AirlineProgram[];
  hotels: HotelProgram[];
  cars: CarRentalProgram[];
  bankBonuses: BankBonus[];
  customCppRates: Record<string, number>;
  profile: UserProfile;
  activeTab: TabType;
  notifications: AppNotification[];
  userEmail: string | null;
  isDemoMode: boolean;

  setLanguage: (lang: Language) => void;
  setActiveTab: (tab: TabType) => void;
  setProfile: (updater: UserProfile | ((prev: UserProfile) => UserProfile)) => void;
  setUserEmail: (email: string | null) => void;
  setIsDemoMode: (isDemo: boolean) => void;
  updateCppRate: (currencyKey: string, cppValue: number) => void;
  resetCppRates: () => void;

  togglePerk: (cardId: string, perkId: string) => void;
  recordMsrSpend: (cardId: string, amount: number) => void;
  addCard: (card: CreditCard) => void;
  deleteCard: (cardId: string) => void;
  updateCardBalance: (cardId: string, balance: number) => void;
  setCardReferralUrl: (cardId: string, url: string) => void;
  setCards: (cards: CreditCard[]) => void;
  setAirlines: (airlines: AirlineProgram[]) => void;
  setHotels: (hotels: HotelProgram[]) => void;
  setCars: (cars: CarRentalProgram[]) => void;
  setAirlineMiles: (id: string, balance: number) => void;
  setAirlineMemberNumber: (id: string, memberNumber: string) => void;
  setAirlineStatusTier: (id: string, statusTier: string) => void;
  setHotelPoints: (id: string, balance: number) => void;
  setHotelMemberNumber: (id: string, memberNumber: string) => void;
  setHotelStatusTier: (id: string, statusTier: string) => void;
  toggleHotelFnc: (hotelId: string, fncId: string) => void;
  setCarMemberNumber: (id: string, memberNumber: string) => void;
  setCarPointsBalance: (id: string, points: number) => void;
  setCarFreeDays: (id: string, freeDays: number) => void;
  setCarStatusTier: (id: string, statusTier: string) => void;

  // Bank Bonuses actions
  addBankBonus: (bonus: BankBonus) => void;
  deleteBankBonus: (id: string) => void;
  updateBankBonusStatus: (id: string, status: BankBonus['status']) => void;
  updateBankBonus: (id: string, updates: Partial<BankBonus>) => void;
  setBankBonuses: (bankBonuses: BankBonus[]) => void;

  clearToFreshWallet: () => void;
  loadDemoData: () => void;
  completeOnboarding: (data: {
    cards: CreditCard[];
    airlines: AirlineProgram[];
    hotels: HotelProgram[];
    cars: CarRentalProgram[];
  }) => void;

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
      bankBonuses: MOCK_BANK_BONUSES,
      customCppRates: DEFAULT_CPP_RATES,
      profile: INITIAL_PROFILE,
      activeTab: 'dashboard',
      isDemoMode: true,
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
      setIsDemoMode: (isDemo) => set({ isDemoMode: isDemo }),

      updateCppRate: (currencyKey, cppValue) =>
        set((state) => ({
          customCppRates: {
            ...state.customCppRates,
            [currencyKey]: Math.max(0.1, parseFloat(cppValue.toFixed(2))),
          },
        })),

      resetCppRates: () => set({ customCppRates: DEFAULT_CPP_RATES }),

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

      addCard: (card) =>
        set((state) => ({
          cards: [card, ...state.cards],
        })),

      deleteCard: (cardId) =>
        set((state) => ({
          cards: state.cards.filter((card) => card.id !== cardId),
        })),

      updateCardBalance: (cardId, balance) =>
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === cardId ? { ...card, currentBalance: Math.max(0, balance) } : card
          ),
        })),

      setCardReferralUrl: (cardId, url) =>
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === cardId ? { ...card, referralUrl: url } : card
          ),
        })),

      setCards: (cards) => set({ cards }),

      setAirlines: (airlines) => set({ airlines }),

      setHotels: (hotels) => set({ hotels }),

      setAirlineMiles: (id, balance) =>
        set((state) => ({
          airlines: state.airlines.map((air) =>
            air.id === id ? { ...air, milesBalance: Math.max(0, balance) } : air
          ),
        })),

      setAirlineMemberNumber: (id, memberNumber) =>
        set((state) => ({
          airlines: state.airlines.map((air) =>
            air.id === id ? { ...air, memberNumber } : air
          ),
        })),

      setAirlineStatusTier: (id, statusTier) =>
        set((state) => ({
          airlines: state.airlines.map((air) =>
            air.id === id ? { ...air, statusTier } : air
          ),
        })),

      setHotelPoints: (id, balance) =>
        set((state) => ({
          hotels: state.hotels.map((hotel) =>
            hotel.id === id ? { ...hotel, pointsBalance: Math.max(0, balance) } : hotel
          ),
        })),

      setHotelMemberNumber: (id, memberNumber) =>
        set((state) => ({
          hotels: state.hotels.map((hotel) =>
            hotel.id === id ? { ...hotel, memberNumber } : hotel
          ),
        })),

      setHotelStatusTier: (id, statusTier) =>
        set((state) => ({
          hotels: state.hotels.map((hotel) =>
            hotel.id === id ? { ...hotel, statusTier } : hotel
          ),
        })),

      setCars: (cars) => set({ cars }),

      setCarMemberNumber: (id, memberNumber) =>
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === id ? { ...car, memberNumber } : car
          ),
        })),

      setCarPointsBalance: (id, points) =>
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === id ? { ...car, pointsBalance: Math.max(0, points) } : car
          ),
        })),

      setCarFreeDays: (id, freeDays) =>
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === id ? { ...car, freeDays: Math.max(0, freeDays) } : car
          ),
        })),

      setCarStatusTier: (id, statusTier) =>
        set((state) => ({
          cars: state.cars.map((car) =>
            car.id === id ? { ...car, statusTier } : car
          ),
        })),

      addBankBonus: (bonus) =>
        set((state) => ({
          bankBonuses: [bonus, ...state.bankBonuses],
        })),

      deleteBankBonus: (id) =>
        set((state) => ({
          bankBonuses: state.bankBonuses.filter((b) => b.id !== id),
        })),

      updateBankBonusStatus: (id, status) =>
        set((state) => ({
          bankBonuses: state.bankBonuses.map((b) =>
            b.id === id ? { ...b, status } : b
          ),
        })),

      updateBankBonus: (id, updates) =>
        set((state) => ({
          bankBonuses: state.bankBonuses.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        })),

      setBankBonuses: (bankBonuses) => set({ bankBonuses }),

      clearToFreshWallet: () =>
        set((state) => ({
          cards: [],
          airlines: state.airlines.map((a) => ({ ...a, milesBalance: 0, memberNumber: '' })),
          hotels: state.hotels.map((h) => ({ ...h, pointsBalance: 0, memberNumber: '', nightsThisYear: 0, fncs: [] })),
          cars: state.cars.map((c) => ({ ...c, pointsBalance: 0, freeDays: 0, memberNumber: '' })),
          bankBonuses: [],
          isDemoMode: false,
          notifications: [],
        })),

      loadDemoData: () =>
        set((state) => ({
          cards: MOCK_CARDS,
          airlines: MOCK_AIRLINE_PROGRAMS,
          hotels: MOCK_HOTEL_PROGRAMS,
          cars: MOCK_CAR_RENTALS,
          bankBonuses: MOCK_BANK_BONUSES,
          profile: INITIAL_PROFILE,
          isDemoMode: true,
          notifications: generateNotifications(
            MOCK_CARDS,
            MOCK_AIRLINE_PROGRAMS,
            MOCK_HOTEL_PROGRAMS,
            MOCK_TRANSFER_PARTNERS,
            state.language
          ),
        })),

      completeOnboarding: ({ cards, airlines, hotels, cars }) =>
        set({
          cards,
          airlines,
          hotels,
          cars,
          isDemoMode: false,
        }),

      toggleHotelFnc: (hotelId, fncId) =>
        set((state) => ({
          hotels: state.hotels.map((hotel) => {
            if (hotel.id !== hotelId) return hotel;
            return {
              ...hotel,
              fncs: hotel.fncs.map((fnc) =>
                fnc.id === fncId ? { ...fnc, isUsed: !fnc.isUsed } : fnc
              ),
            };
          }),
        })),

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
        set((state) => {
          const previouslyRead = new Set(
            state.notifications.filter((n) => n.isRead).map((n) => n.id)
          );
          return {
            notifications: generateNotifications(
              state.cards,
              state.airlines,
              state.hotels,
              MOCK_TRANSFER_PARTNERS,
              state.language
            ).map((n) => ({ ...n, isRead: previouslyRead.has(n.id) })),
          };
        }),

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
      version: 6,
      partialize: (state) => ({
        language: state.language,
        cards: state.cards,
        airlines: state.airlines,
        hotels: state.hotels,
        cars: state.cars,
        bankBonuses: state.bankBonuses,
        customCppRates: state.customCppRates,
        profile: state.profile,
        activeTab: state.activeTab,
      }),
      migrate: (persistedState, version) => {
        const state = persistedState as Partial<AppState> | undefined;
        const profile = state?.profile;

        const dedupeById = <T extends { id: string }>(items: T[]): T[] => {
          const map = new Map<string, T>();
          for (const item of items) {
            if (item && item.id && !map.has(item.id)) {
              map.set(item.id, item);
            }
          }
          return Array.from(map.values());
        };

        // Clean & sanitize any legacy broken URLs (e.g. old Amex /the-platinum-card/ paths)
        const sanitizeUrl = (url?: string) => {
          if (!url) return url;
          if (url.includes('the-platinum-card') || url.includes('refer.amex.us/MPLATINUM')) {
            return 'https://www.americanexpress.com/us/credit-cards/card/platinum/';
          }
          if (url.includes('the-amex-gold-card') || url.includes('refer.amex.us/MGOLD')) {
            return 'https://www.americanexpress.com/us/credit-cards/card/gold-card/';
          }
          return url;
        };

        // Refresh static referral link fields from latest MOCK_CARDS
        const rawCards = state?.cards && state.cards.length > 0 ? state.cards : MOCK_CARDS;
        const refreshedCards = dedupeById(
          rawCards.map((card) => {
            const fresh = MOCK_CARDS.find((c) => c.id === card.id);
            if (!fresh) {
              return { ...card, referralUrl: sanitizeUrl(card.referralUrl) };
            }
            return {
              ...card,
              referralUrl: sanitizeUrl(card.referralUrl) ?? fresh.referralUrl,
              referralBonus: card.referralBonus ?? fresh.referralBonus,
              referralValue: card.referralValue ?? fresh.referralValue,
            };
          })
        );

        // Ensure all default airlines, hotels, and cars are present without duplicates
        const baseAirlines = state?.airlines && state.airlines.length > 0 ? state.airlines : MOCK_AIRLINE_PROGRAMS;
        const existingAirlineIds = new Set(baseAirlines.map((a) => a.id));
        const missingAirlines = MOCK_AIRLINE_PROGRAMS.filter((a) => !existingAirlineIds.has(a.id));
        const mergedAirlines = dedupeById(
          [...baseAirlines, ...missingAirlines].map((air) => {
            const fresh = MOCK_AIRLINE_PROGRAMS.find((a) => a.id === air.id);
            return {
              ...air,
              portalUrl: fresh?.portalUrl ?? air.portalUrl,
              memberNumber: air.memberNumber ?? fresh?.memberNumber,
            };
          })
        );

        const baseHotels = state?.hotels && state.hotels.length > 0 ? state.hotels : MOCK_HOTEL_PROGRAMS;
        const existingHotelIds = new Set(baseHotels.map((h) => h.id));
        const missingHotels = MOCK_HOTEL_PROGRAMS.filter((h) => !existingHotelIds.has(h.id));
        const mergedHotels = dedupeById(
          [...baseHotels, ...missingHotels].map((hotel) => {
            const fresh = MOCK_HOTEL_PROGRAMS.find((h) => h.id === hotel.id);
            return {
              ...hotel,
              portalUrl: fresh?.portalUrl ?? hotel.portalUrl,
              memberNumber: hotel.memberNumber ?? fresh?.memberNumber,
            };
          })
        );

        const baseCars = state?.cars && state.cars.length > 0 ? state.cars : MOCK_CAR_RENTALS;
        const existingCarIds = new Set(baseCars.map((c) => c.id));
        const missingCars = MOCK_CAR_RENTALS.filter((c) => !existingCarIds.has(c.id));
        const mergedCars = dedupeById(
          [...baseCars, ...missingCars].map((car) => {
            const fresh = MOCK_CAR_RENTALS.find((c) => c.id === car.id);
            return {
              ...car,
              portalUrl: fresh?.portalUrl ?? car.portalUrl,
              memberNumber: car.memberNumber ?? fresh?.memberNumber,
              statusMatchRoutes: fresh?.statusMatchRoutes ?? car.statusMatchRoutes,
              cdwCoverage: fresh?.cdwCoverage ?? car.cdwCoverage,
            };
          })
        );

        const base = {
          language: (state?.language ?? 'en') as Language,
          cards: refreshedCards,
          airlines: mergedAirlines,
          hotels: mergedHotels,
          cars: mergedCars,
          bankBonuses: dedupeById(state?.bankBonuses ?? MOCK_BANK_BONUSES),
          customCppRates: state?.customCppRates ?? DEFAULT_CPP_RATES,
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
