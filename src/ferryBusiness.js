// Ferry operator game-economy model (1923-inspired, game-balanced, not historical fares).
export const FERRY_LICENSE_PRICE = 200;
export const FERRY_UPGRADES = Object.freeze([
  { id: 'ticketOffice', name: 'İskele Bilet Gişesi', price: 35, detail: 'Bekleme alanı ve bilet kontrolü; daha fazla yolcu.' },
  { id: 'secondFerry', name: 'İkinci Vapur', price: 90, detail: 'Ek sefer kapasitesi; ikinci vapur haritada görünür.' },
  { id: 'nightService', name: 'Akşam Seferi', price: 60, detail: 'Fenerlerle aydınlatılan akşam hattı.' },
  { id: 'cargoHold', name: 'Rıhtım Yük Taşımacılığı', price: 75, detail: 'Çuvallar, sandıklar ve küçük yükleme hizmeti.' }
]);
const round = value => Math.round((Number(value) || 0) * 100) / 100;
export const DEFAULT_FERRY_BUSINESS = Object.freeze({
  owned: false,
  upgrades: {},
  daysOperated: 0,
  totalNet: 0,
  lastNet: 0,
  lastGross: 0,
  lastCost: 0,
  lastPassengers: 0,
  lastSettledKey: ''
});

export function normaliseFerryBusiness(raw) {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_FERRY_BUSINESS, upgrades: {} };
  const upgrades = Object.fromEntries(
    FERRY_UPGRADES.map(item => [item.id, raw.owned === true && raw.upgrades?.[item.id] === true])
  );
  return {
    owned: raw.owned === true, upgrades,
    daysOperated: Math.max(0,Math.floor(Number(raw.daysOperated)||0)),
    totalNet: round(raw.totalNet),
    lastNet: round(raw.lastNet),
    lastGross: round(raw.lastGross),
    lastCost: round(raw.lastCost),
    lastPassengers: Math.max(0,Math.floor(Number(raw.lastPassengers)||0)),
    lastSettledKey: String(raw.lastSettledKey||'').slice(0,40)
  };
}

export const ferryDateKey = ({year, month, day}) => [year,month,day].join('-');

export function calculateFerryDay(raw, {year,month,day}) {
  const state=normaliseFerryBusiness(raw);
  const key=ferryDateKey({year,month,day});
  if(!state.owned || state.lastSettledKey===key) {
    return {key,passengers:0,gross:0,cost:0,net:0,skipped:true,weather:'—'};
  }
  // Deterministic demand means re-renders cannot re-roll ticket income.
  const cycle=(Math.abs(Math.floor(year*13+month*7+day*11))%13);
  const weather = cycle===2 || cycle===6 || cycle===10 ? 'Yağmurlu' : 'Açık';
  const festival = day>=8 && day<=14;
  const busy = day%6===0;
  const upgrades=state.upgrades;
  const basePassengers=76+(day*7+month)%23+(festival?26:0)+(busy?13:0);
  const weatherPenalty=weather==='Yağmurlu'?0.83:1;
  const passengers=Math.round((basePassengers+(upgrades.ticketOffice?24:0)+(upgrades.secondFerry?49:0)+(upgrades.nightService?18:0))*weatherPenalty);
  const fares=passengers*1.45;
  const cargo=upgrades.cargoHold ? 26 + (day%4)*4.5 : 0;
  const gross=round(fares+cargo);
  const cost=round(21.5+(upgrades.secondFerry?17:0)+(upgrades.nightService?6.5:0)+(upgrades.cargoHold?8:0)+(weather==='Yağmurlu'?4:0));
  return {key,passengers,gross,cost,net:round(gross-cost),skipped:false,weather};
}

export function applyFerrySettlement(raw, settlement) {
  const state=normaliseFerryBusiness(raw);
  if(!state.owned || settlement?.skipped || !settlement?.key || state.lastSettledKey===settlement.key) return state;
  return {
    ...state,
    daysOperated: state.daysOperated+1,
    totalNet:round(state.totalNet+settlement.net),
    lastNet:settlement.net,
    lastGross:settlement.gross,
    lastCost:settlement.cost,
    lastPassengers:settlement.passengers,
    lastSettledKey:settlement.key
  };
}
