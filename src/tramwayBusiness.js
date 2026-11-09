// Game-balanced Beyoglu electric tramway operator, inspired by the 1920s network.
export const TRAMWAY_LICENSE_PRICE = 180;
export const TRAMWAY_UPGRADES = Object.freeze([
  { id: 'secondCar', name: 'İkinci Tramvay Vagonu', price: 95, detail: 'Hat kapasitesini ve yoğun saatlerde taşınan yolcu sayısını artırır.' },
  { id: 'extendedRoute', name: 'Uzatılmış Hat İmtiyazı', price: 130, detail: 'Yeni duraklar ve daha uzun yolculuklardan ek bilet geliri.' },
  { id: 'nightService', name: 'Akşam Seferleri', price: 75, detail: 'Tiyatro ve sinema çıkışlarında ek yolcu taşır.' },
  { id: 'workshop', name: 'Bakım Atölyesi', price: 65, detail: 'Arıza ve bakım giderlerini düşürür.' }
]);
const round = value => Math.round((Number(value) || 0) * 100) / 100;
export const DEFAULT_TRAMWAY_BUSINESS = Object.freeze({
  owned: false, upgrades: {}, daysOperated: 0, totalNet: 0,
  lastNet: 0, lastGross: 0, lastCost: 0, lastPassengers: 0, lastSettledKey: ''
});
export function normaliseTramwayBusiness(raw) {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_TRAMWAY_BUSINESS, upgrades: {} };
  return {
    owned: raw.owned === true,
    upgrades: Object.fromEntries(TRAMWAY_UPGRADES.map(item => [item.id, raw.owned === true && raw.upgrades?.[item.id] === true])),
    daysOperated: Math.max(0, Math.floor(Number(raw.daysOperated) || 0)),
    totalNet: round(raw.totalNet), lastNet: round(raw.lastNet),
    lastGross: round(raw.lastGross), lastCost: round(raw.lastCost),
    lastPassengers: Math.max(0, Math.floor(Number(raw.lastPassengers) || 0)),
    lastSettledKey: String(raw.lastSettledKey || '').slice(0, 40)
  };
}
const dateKey = ({year,month,day}) => [year,month,day].join('-');
export function calculateTramwayDay(raw, {year,month,day}) {
  const state = normaliseTramwayBusiness(raw);
  const key = dateKey({year,month,day});
  if (!state.owned || state.lastSettledKey === key) return {key,passengers:0,gross:0,cost:0,net:0,skipped:true,weather:'—'};
  const cycle = Math.abs(Math.floor(year * 17 + month * 5 + day * 9)) % 11;
  const weather = cycle === 2 || cycle === 7 ? 'Yağmurlu' : 'Açık';
  const eventDay = day >= 8 && day <= 14;
  const rush = day % 5 === 0;
  const upgrades = state.upgrades;
  const base = 58 + (day * 5 + month * 3) % 24 + (eventDay ? 15 : 0) + (rush ? 12 : 0);
  const passengers = Math.round((base + (upgrades.secondCar ? 35 : 0) + (upgrades.extendedRoute ? 24 : 0) + (upgrades.nightService ? 17 : 0)) * (weather === 'Yağmurlu' ? .88 : 1));
  const fares = passengers * (upgrades.extendedRoute ? 1.65 : 1.35);
  const extras = upgrades.extendedRoute ? 16 : 0;
  const gross = round(fares + extras);
  const baseCost = 27 + (upgrades.secondCar ? 13 : 0) + (upgrades.extendedRoute ? 9 : 0) + (upgrades.nightService ? 7 : 0) + (weather === 'Yağmurlu' ? 5 : 0);
  const cost = round(upgrades.workshop ? baseCost * .68 : baseCost);
  return {key,passengers,gross,cost,net:round(gross-cost),skipped:false,weather};
}
export function applyTramwaySettlement(raw, settlement) {
  const state = normaliseTramwayBusiness(raw);
  if (!state.owned || settlement?.skipped || !settlement?.key || state.lastSettledKey === settlement.key) return state;
  return {
    ...state, daysOperated: state.daysOperated + 1,
    totalNet: round(state.totalNet + settlement.net), lastNet: settlement.net,
    lastGross: settlement.gross, lastCost: settlement.cost,
    lastPassengers: settlement.passengers, lastSettledKey: settlement.key
  };
}
