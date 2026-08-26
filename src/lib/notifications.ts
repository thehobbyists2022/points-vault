import type { CreditCard, AirlineProgram, HotelProgram, TransferPartner } from '../data/mockData';
import type { TabType } from '../components/Sidebar';
import type { Language } from '../i18n/translations';
import { getMsrDaysRemaining } from './msr';

export type UrgencyLevel = 'high' | 'medium' | 'low';

export interface AppNotification {
  id: string;
  type: 'msr_deadline' | 'miles_expiry' | 'fnc_expiry' | 'transfer_bonus' | 'unclaimed_perk';
  title: string;
  body: string;
  urgency: UrgencyLevel;
  targetTab: TabType;
  createdAt: string;
  isRead: boolean;
}

export function generateNotifications(
  cards: CreditCard[],
  airlines: AirlineProgram[],
  hotels: HotelProgram[],
  transferPartners: TransferPartner[],
  language: Language = 'en'
): AppNotification[] {
  const notifs: AppNotification[] = [];

  // Rule 1: MSR Deadline < 30 Days & Incomplete
  cards.forEach((card) => {
    if (card.msr && card.msr.currentSpend < card.msr.requiredSpend) {
      const daysLeft = getMsrDaysRemaining(card);
      if (daysLeft <= 30) {
        notifs.push({
          id: `msr-${card.id}`,
          type: 'msr_deadline',
          title:
            language === 'en'
              ? `⚠️ ${card.name} MSR Bonus Deadline Countdown`
              : `⚠️ ${card.name} MSR 開卡獎勵截止倒計時`,
          body:
            language === 'en'
              ? `Only ${daysLeft} days left! Spend $${(card.msr.requiredSpend - card.msr.currentSpend).toLocaleString()} more to earn ${card.msr.bonusPoints.toLocaleString()} points!`
              : `僅剩 ${daysLeft} 天！尚需消費 $${(card.msr.requiredSpend - card.msr.currentSpend).toLocaleString()} 才能拿 ${card.msr.bonusPoints.toLocaleString()} 點數！`,
          urgency: daysLeft <= 14 ? 'high' : 'medium',
          targetTab: 'cards',
          createdAt: new Date().toISOString(),
          isRead: false,
        });
      }
    }
  });

  // Rule 2: Airline Miles Expiry < 90 Days
  airlines.forEach((air) => {
    if (air.isExpirationWarning && air.expirationDate) {
      const exp = new Date(air.expirationDate);
      const diffDays = Math.ceil((exp.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      if (diffDays <= 90) {
        notifs.push({
          id: `air-${air.id}`,
          type: 'miles_expiry',
          title:
            language === 'en'
              ? `✈️ ${air.name} Miles Expiring Soon`
              : `✈️ ${air.name} 里程即將過期`,
          body:
            language === 'en'
              ? `${air.milesBalance.toLocaleString()} miles expire on ${air.expirationDate} (in ${diffDays} days). Keep them active!`
              : `${air.milesBalance.toLocaleString()} 里程將於 ${air.expirationDate} (${diffDays} 天後) 過期，請及時保鮮！`,
          urgency: diffDays <= 30 ? 'high' : 'medium',
          targetTab: 'airlines',
          createdAt: new Date().toISOString(),
          isRead: false,
        });
      }
    }
  });

  // Rule 3: Hotel FNC Expiry < 90 Days & Unused
  hotels.forEach((hotel) => {
    hotel.fncs.forEach((fnc) => {
      if (!fnc.isUsed) {
        const exp = new Date(fnc.expirationDate);
        const diffDays = Math.ceil((exp.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        if (diffDays <= 90) {
          notifs.push({
            id: `fnc-${fnc.id}`,
            type: 'fnc_expiry',
            title:
              language === 'en'
                ? `🏨 Free Night Certificate Expiring Soon`
                : `🏨 免房券 FNC 即將到期`,
            body:
              language === 'en'
                ? `${hotel.name} ${fnc.title} (${fnc.categoryLimit}) expires in ${diffDays} days!`
                : `${hotel.name} ${fnc.title} (${fnc.categoryLimit}) 倒計時 ${diffDays} 天到期！`,
            urgency: diffDays <= 30 ? 'high' : 'medium',
            targetTab: 'hotels',
            createdAt: new Date().toISOString(),
            isRead: false,
          });
        }
      }
    });
  });

  // Rule 4: Transfer Bonus Active
  transferPartners.forEach((tp) => {
    if (tp.currentBonus) {
      notifs.push({
        id: `tp-${tp.bankCurrency}-${tp.partnerName}`,
        type: 'transfer_bonus',
        title:
          language === 'en'
            ? `🔥 Limited-Time Transfer Bonus: ${tp.bankCurrency} ➔ ${tp.partnerName}`
            : `🔥 限時轉点加贈: ${tp.bankCurrency} ➔ ${tp.partnerName}`,
        body:
          language === 'en'
            ? `Bonus: ${tp.currentBonus}. Don't miss out!`
            : `特惠加贈 ${tp.currentBonus}，手慢無！`,
        urgency: 'medium',
        targetTab: 'transfers',
        createdAt: new Date().toISOString(),
        isRead: false,
      });
    }
  });

  // Rule 5: High Value Unclaimed Perks (> $100)
  cards.forEach((card) => {
    card.perks.forEach((p) => {
      if (!p.used && p.value >= 100) {
        notifs.push({
          id: `perk-${p.id}`,
          type: 'unclaimed_perk',
          title:
            language === 'en'
              ? `🎁 High-Value Perk Waiting: ${card.name}`
              : `🎁 待領取高價值福利: ${card.name}`,
          body:
            language === 'en'
              ? `${p.title} ($${p.value} USD) hasn't been claimed yet.`
              : `${p.title} ($${p.value} USD) 尚未打卡報銷。`,
          urgency: 'low',
          targetTab: 'cards',
          createdAt: new Date().toISOString(),
          isRead: false,
        });
      }
    });
  });

  return notifs;
}
