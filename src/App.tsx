import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardTab } from './components/DashboardTab';
import { CardsTab } from './components/CardsTab';
import { AirlinesTab } from './components/AirlinesTab';
import { HotelsTab } from './components/HotelsTab';
import { CarRentalTab } from './components/CarRentalTab';
import { MerchantFinderTab } from './components/MerchantFinderTab';
import { TransferMatrixTab } from './components/TransferMatrixTab';
import { Chase524Tab } from './components/Chase524Tab';
import { BankBonusesTab } from './components/BankBonusesTab';
import { AffiliateTab } from './components/AffiliateTab';
import { NotificationCenter } from './components/NotificationCenter';
import { AuthModal } from './components/AuthModal';
import { DemoBanner } from './components/DemoBanner';
import { OnboardingWizardModal } from './components/OnboardingWizardModal';
import { useState, useEffect } from 'react';
import { onAuthStateChange, isSupabaseConfigured, supabase, signOut } from './lib/supabase';
import { pushToCloud, pullFromCloud } from './lib/sync';
import { saveSnapshot } from './lib/portfolioHistory';
import { calculatePortfolioBreakdown } from './lib/valuation';

import { useAppStore } from './store/useAppStore';

export function App() {
  const [notifCenterOpen, setNotifCenterOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Watch Supabase auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const { data: { subscription } } = onAuthStateChange(async (event, uid) => {
      setUserId(uid);
      if (uid) {
        const { data } = await supabase.auth.getUser();
        useAppStore.getState().setUserEmail(data.user?.email ?? null);
        // Cloud-first sync on reload/sign-in: refresh local from remote
        // BEFORE pushing, so a stale local copy can't overwrite newer cloud data.
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
          await pullFromCloud(uid).catch(console.error);
          pushToCloud(uid).catch(console.error);
        }
      } else {
        useAppStore.getState().setUserEmail(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const cards = useAppStore((s) => s.cards);
  const airlines = useAppStore((s) => s.airlines);
  const hotels = useAppStore((s) => s.hotels);
  const cars = useAppStore((s) => s.cars);
  const profile = useAppStore((s) => s.profile);
  const activeTab = useAppStore((s) => s.activeTab);
  const notifications = useAppStore((s) => s.notifications);
  const userEmail = useAppStore((s) => s.userEmail);

  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const setProfile = useAppStore((s) => s.setProfile);
  const togglePerk = useAppStore((s) => s.togglePerk);
  const recordMsrSpend = useAppStore((s) => s.recordMsrSpend);
  const setAirlineMiles = useAppStore((s) => s.setAirlineMiles);
  const setHotelPoints = useAppStore((s) => s.setHotelPoints);
  const toggleHotelFnc = useAppStore((s) => s.toggleHotelFnc);
  const addChase524Opening = useAppStore((s) => s.addChase524Opening);
  const removeChase524Opening = useAppStore((s) => s.removeChase524Opening);
  const markNotifRead = useAppStore((s) => s.markNotifRead);
  const clearAllNotifs = useAppStore((s) => s.clearAllNotifs);
  const regenerateNotifs = useAppStore((s) => s.regenerateNotifs);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Keep alerts accurate whenever underlying data changes (perk claims, MSR
  // progress, cloud pulls, balance edits, FNC usage) instead of only at load.
  useEffect(() => {
    regenerateNotifs();
  }, [cards, airlines, hotels, regenerateNotifs]);

  const handleSignOut = async () => {
    await signOut();
    setUserId(null);
    useAppStore.getState().setUserEmail(null);
  };

  // Auto-sync to Supabase when local state changes (debounced 4 seconds)
  useEffect(() => {
    if (!userId || !isSupabaseConfigured) return;
    const timer = setTimeout(() => {
      pushToCloud(userId).catch(console.error);
    }, 4000);
    return () => clearTimeout(timer);
  }, [cards, profile, userId]);

  const customCppRates = useAppStore((s) => s.customCppRates);

  // Math Metrics using Unified Valuation Engine
  const {
    cardValueUSD: cardValue,
    airlineValueUSD: airlineValue,
    hotelValueUSD: hotelValue,
    totalValueUSD: totalValueDollars,
    totalPointsCount,
  } = calculatePortfolioBreakdown(cards, airlines, hotels, customCppRates, profile.activePlayer);

  const filteredCards = cards.filter(
    (c) => profile.activePlayer === 'All' || c.player === profile.activePlayer
  );
  const filteredHotels = hotels.filter(
    (h) => profile.activePlayer === 'All' || h.player === profile.activePlayer
  );

  const unclaimedPerksCount = filteredCards
    .flatMap((c) => c.perks)
    .filter((p) => !p.used).length;

  const fncCount = filteredHotels
    .flatMap((h) => h.fncs)
    .filter((f) => !f.isUsed).length;

  // Save a daily portfolio snapshot whenever the total value changes
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
  }, [totalValueDollars, cardValue, airlineValue, hotelValue]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navigation */}
      <Header
        profile={profile}
        setProfile={setProfile}
        totalValueDollars={totalValueDollars}
        totalPointsCount={totalPointsCount}
        unreadCount={unreadCount}
        onOpenNotifCenter={() => setNotifCenterOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        isSignedIn={Boolean(userId)}
        userEmail={userEmail}
        onSignOut={handleSignOut}
      />

      {/* Demo Mode / Custom Wallet Mode Banner */}
      <DemoBanner onOpenWizard={() => setWizardOpen(true)} />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-[1600px] mx-auto p-4 md:p-6 gap-6">
        {/* Left Sidebar Menu */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unclaimedPerksCount={unclaimedPerksCount}
          fncCount={fncCount}
        />

        {/* Tab Content Display Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardTab
              cards={cards}
              airlines={airlines}
              hotels={hotels}
              cars={cars}
              profile={profile}
              onTogglePerk={togglePerk}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'cards' && (
            <CardsTab
              cards={cards}
              profile={profile}
              onTogglePerk={togglePerk}
              onRecordMsrSpend={recordMsrSpend}
            />
          )}

          {activeTab === 'airlines' && (
            <AirlinesTab
              airlines={airlines}
              profile={profile}
              onUpdateBalance={setAirlineMiles}
            />
          )}

          {activeTab === 'hotels' && (
            <HotelsTab
              hotels={hotels}
              profile={profile}
              onUpdatePoints={setHotelPoints}
              onToggleFnc={toggleHotelFnc}
            />
          )}

          {activeTab === 'cars' && (
            <CarRentalTab cars={cars} profile={profile} />
          )}

          {activeTab === 'merchant' && (
            <MerchantFinderTab cards={cards} profile={profile} />
          )}

          {activeTab === 'transfers' && <TransferMatrixTab />}

          {activeTab === 'rules524' && (
            <Chase524Tab
              profile={profile}
              setProfile={setProfile}
              onAddOpening={addChase524Opening}
              onRemoveOpening={removeChase524Opening}
            />
          )}

          {activeTab === 'bankBonuses' && (
            <BankBonusesTab profile={profile} />
          )}

          {activeTab === 'affiliate' && (
            <AffiliateTab cards={cards} profile={profile} />
          )}
        </main>
      </div>

      {/* Notification Center Drawer */}
      <NotificationCenter
        notifications={notifications}
        isOpen={notifCenterOpen}
        onClose={() => setNotifCenterOpen(false)}
        onMarkRead={markNotifRead}
        onClearAll={clearAllNotifs}
        onNavigate={setActiveTab}
      />

      {/* Auth / Cloud Sync Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(uid) => { setUserId(uid); setAuthModalOpen(false); }}
      />

      {/* 30-Second Quick Onboarding Setup Wizard */}
      <OnboardingWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />
    </div>
  );
}

export default App;
