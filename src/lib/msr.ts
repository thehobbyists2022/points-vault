import type { CreditCard } from '../data/mockData';

const DAY_MS = 24 * 3600 * 1000;

export function getMsrDaysRemaining(card: CreditCard): number {
  const msr = card.msr;
  if (!msr) return 0;
  if (msr.deadlineDate) {
    const diff = Math.ceil((new Date(`${msr.deadlineDate}T00:00:00`).getTime() - Date.now()) / DAY_MS);
    return Math.max(0, diff);
  }
  return Math.max(0, msr.deadlineDaysRemaining);
}

export function getMsrDeadlineDate(card: CreditCard): Date {
  const msr = card.msr;
  if (!msr) return new Date();
  if (msr.deadlineDate) return new Date(`${msr.deadlineDate}T00:00:00`);
  return new Date(Date.now() + msr.deadlineDaysRemaining * DAY_MS);
}

export function isMsrCompleted(card: CreditCard): boolean {
  return !!card.msr && card.msr.currentSpend >= card.msr.requiredSpend;
}