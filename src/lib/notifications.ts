import type { CreditCard, AirlineProgram, HotelProgram, TransferPartner } from '../data/mockData';
import type { TabType } from '../components/Sidebar';

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
  transferPartners: TransferPartner[]
): AppNotification[] {
  const notifs: AppNotification[] = [];

  // Rule 1: MSR Deadline < 30 Days & Incomplete
  cards.forEach((card) => {
    if (card.msr && card.msr.currentSpend < card.msr.requiredSpend) {
      if (card.msr.deadlineDaysRemaining <= 30) {
        notifs.push({
          id: `msr-${card.id}`,
          type: 'msr_deadline',
          title: `⚠️ ${card.name} MSR 開卡獎勵截止倒計時`,
          body: `僅剩 ${card.msr.deadlineDaysRemaining} 天！尚需消費 $${(card.msr.requiredSpend - card.msr.currentSpend).toLocaleString()} 才能拿 ${card.msr.bonusPoints.toLocaleString()} 點數！`,
          urgency: card.msr.deadlineDaysRemaining <= 14 ? 'high' : 'medium',
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
          title: `✈️ ${air.name} 里程即將過期`,
          body: `${air.milesBalance.toLocaleString()} 里程將於 ${air.expirationDate} (${diffDays} 天後) 過期，請及時保鮮！`,
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
            title: `🏨 免房券 FNC 即將到期`,
            body: `${hotel.name} ${fnc.title} (${fnc.categoryLimit}) 倒計時 ${diffDays} 天到期！`,
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
        title: `🔥 限時轉点加贈: ${tp.bankCurrency} ➔ ${tp.partnerName}`,
        body: `特惠加贈 ${tp.currentBonus}，手慢無！`,
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
          title: `🎁 待領取高價值福利: ${card.name}`,
          body: `${p.title} ($${p.value} USD) 尚未打卡報銷。`,
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
