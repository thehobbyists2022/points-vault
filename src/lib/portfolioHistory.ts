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
