import type { CreditCard, AirlineProgram, HotelProgram } from '../data/mockData';

export const DEFAULT_CPP_RATES: Record<string, number> = {
  'Chase UR': 1.5,
  'Amex MR': 1.2,
  'Capital One': 1.6,
  'Citi TYP': 1.4,
  'Bilt Rewards': 1.8,
  'World of Hyatt': 2.1,
  'Marriott Bonvoy': 0.8,
  'Hilton Honors': 0.5,
  'IHG One Rewards': 0.55,
  'Wyndham Rewards': 0.9,
  'Delta SkyMiles': 1.15,
  'United MileagePlus': 1.35,
  'American Airlines': 1.45,
  'Southwest Rapid Rewards': 1.30,
  'Alaska Airlines': 1.55,
  'Air France Flying Blue': 1.4,
  'British Airways Avios': 1.4,
};

export function resolveCardCpp(card: CreditCard, rates?: Record<string, number>): number {
  const custom = rates ?? DEFAULT_CPP_RATES;
  if (card.pointsCurrency.includes('Ultimate Rewards')) return custom['Chase UR'] ?? card.cppValue;
  if (card.pointsCurrency.includes('Membership Rewards')) return custom['Amex MR'] ?? card.cppValue;
  if (card.issuer === 'Capital One') return custom['Capital One'] ?? card.cppValue;
  if (card.issuer === 'Citi') return custom['Citi TYP'] ?? card.cppValue;
  if (card.issuer === 'Bilt') return custom['Bilt Rewards'] ?? card.cppValue;
  if (card.name.includes('Hyatt')) return custom['World of Hyatt'] ?? card.cppValue;
  if (card.name.includes('Marriott')) return custom['Marriott Bonvoy'] ?? card.cppValue;
  if (card.name.includes('Hilton')) return custom['Hilton Honors'] ?? card.cppValue;
  if (card.name.includes('IHG')) return custom['IHG One Rewards'] ?? card.cppValue;
  return card.cppValue;
}

export function resolveAirlineCpp(airline: AirlineProgram, rates?: Record<string, number>): number {
  const custom = rates ?? DEFAULT_CPP_RATES;
  if (airline.code === 'UA') return custom['United MileagePlus'] ?? airline.cppValue;
  if (airline.code === 'DL') return custom['Delta SkyMiles'] ?? airline.cppValue;
  if (airline.code === 'AA') return custom['American Airlines'] ?? airline.cppValue;
  if (airline.code === 'WN') return custom['Southwest Rapid Rewards'] ?? airline.cppValue;
  if (airline.code === 'AS') return custom['Alaska Airlines'] ?? airline.cppValue;
  return airline.cppValue;
}

export function resolveHotelCpp(hotel: HotelProgram, rates?: Record<string, number>): number {
  const custom = rates ?? DEFAULT_CPP_RATES;
  if (hotel.name.includes('Hyatt')) return custom['World of Hyatt'] ?? hotel.cppValue;
  if (hotel.name.includes('Marriott')) return custom['Marriott Bonvoy'] ?? hotel.cppValue;
  if (hotel.name.includes('Hilton')) return custom['Hilton Honors'] ?? hotel.cppValue;
  if (hotel.name.includes('IHG')) return custom['IHG One Rewards'] ?? hotel.cppValue;
  if (hotel.name.includes('Wyndham')) return custom['Wyndham Rewards'] ?? hotel.cppValue;
  return hotel.cppValue;
}

export function calculatePortfolioBreakdown(
  cards: CreditCard[],
  airlines: AirlineProgram[],
  hotels: HotelProgram[],
  rates?: Record<string, number>,
  activePlayer: 'P1' | 'P2' | 'All' = 'All'
) {
  const filteredCards = cards.filter(
    (c) => activePlayer === 'All' || c.player === activePlayer
  );
  const filteredAirlines = airlines.filter(
    (a) => activePlayer === 'All' || a.player === activePlayer
  );
  const filteredHotels = hotels.filter(
    (h) => activePlayer === 'All' || h.player === activePlayer
  );

  const cardValueUSD = filteredCards.reduce(
    (acc, card) => acc + (card.currentBalance * resolveCardCpp(card, rates)) / 100,
    0
  );
  const airlineValueUSD = filteredAirlines.reduce(
    (acc, air) => acc + (air.milesBalance * resolveAirlineCpp(air, rates)) / 100,
    0
  );
  const hotelValueUSD = filteredHotels.reduce(
    (acc, hotel) => acc + (hotel.pointsBalance * resolveHotelCpp(hotel, rates)) / 100,
    0
  );

  const totalValueUSD = cardValueUSD + airlineValueUSD + hotelValueUSD;

  const totalPointsCount =
    filteredCards.reduce((acc, c) => acc + c.currentBalance, 0) +
    filteredAirlines.reduce((acc, a) => acc + a.milesBalance, 0) +
    filteredHotels.reduce((acc, h) => acc + h.pointsBalance, 0);

  return {
    cardValueUSD,
    airlineValueUSD,
    hotelValueUSD,
    totalValueUSD,
    totalPointsCount,
  };
}
