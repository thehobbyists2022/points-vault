// Feature flag: controls whether paid "Pro" upgrade UI (subscription/lifetime
// paywall, promo codes) is shown. Must stay disabled on iOS until real
// StoreKit IAP is wired up (Apple Guideline 3.1.1). Android/Google Play may
// enable it via VITE_ENABLE_PAYWALL=true.
export const ENABLE_PAYWALL: boolean =
  (import.meta.env.VITE_ENABLE_PAYWALL ?? 'false').toString().toLowerCase() === 'true';
