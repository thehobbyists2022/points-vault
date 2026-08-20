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
import { AffiliateTab } from './components/AffiliateTab';
import { NotificationCenter } from './components/NotificationCenter';
import { AuthModal } from './components/AuthModal';
import { useState, useEffect } from 'react';
import { onAuthStateChange, isSupabaseConfigured, supabase, signOut } from './lib/supabase';
import { pushToCloud } from './lib/sync';
import { saveSnapshot } from './lib/portfolioHistory';

import { useAppStore } from './store/useAppStore';

export function App() {
  const [notifCenterOpen, setNotifCenterOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Watch Supabase auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const { data: { subscription } } = onAuthStateChange(async (uid) => {
      setUserId(uid);
      if (uid) {
        const { data } = await supabase.auth.getUser();
        useAppStore.getState().setUserEmail(data.user?.email ?? null);
        // Auto-push local changes when user is authenticated
        pushToCloud(uid).catch(console.error);
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
  const addChase524Opening = useAppStore((s) => s.addChase524Opening);
  const removeChase524Opening = useAppStore((s) => s.removeChase524Opening);
  const markNotifRead = useAppStore((s) => s.markNotifRead);
  const clearAllNotifs = useAppStore((s) => s.clearAllNotifs);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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

  // Math Metrics
  const filteredCards = cards.filter(
    (c) => profile.activePlayer === 'All' || c.player === profile.activePlayer
  );
  const filteredAirlines = airlines.filter(
    (a) => profile.activePlayer === 'All' || a.player === profile.activePlayer
  );
  const filteredHotels = hotels.filter(
    (h) => profile.activePlayer === 'All' || h.player === profile.activePlayer
  );

  const cardValue = filteredCards.reduce(
    (sum, c) => sum + (c.currentBalance * c.cppValue) / 100,
    0
  );
  const airlineValue = filteredAirlines.reduce(
    (sum, a) => sum + (a.milesBalance * a.cppValue) / 100,
    0
  );
  const hotelValue = filteredHotels.reduce(
    (sum, h) => sum + (h.pointsBalance * h.cppValue) / 100,
    0
  );
  const totalValueDollars = cardValue + airlineValue + hotelValue;

  const totalCardPoints = filteredCards.reduce((sum, c) => sum + c.currentBalance, 0);
  const totalAirlineMiles = filteredAirlines.reduce((sum, a) => sum + a.milesBalance, 0);
  const totalHotelPoints = filteredHotels.reduce((sum, h) => sum + h.pointsBalance, 0);
  const totalPointsCount = totalCardPoints + totalAirlineMiles + totalHotelPoints;

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
            <AirlinesTab airlines={airlines} profile={profile} />
          )}

          {activeTab === 'hotels' && (
            <HotelsTab hotels={hotels} profile={profile} />
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
    </div>
  );
}

export default App;
