// Geographic zoning for Mahalle's compressed, fictionalised 1923 Karaköy-Pera map.
//
// IMPORTANT: Relocate properties by stable ID. Never delete, reorder, renumber
// or clone an owned property: multiplayer ownership and saves are keyed by ID.
// Galata quay ends at x=25.5; building frontages belong landward at x<=24.6.
export const WATERFRONT_RELOCATIONS = Object.freeze({
  // The shipyard is NOT an ordinary backstreet business frontage.
  41: { x: -28.0, z: -16.0, rotation: 0.02, zone: 'inner', reason: 'Buharlı kuru temizleme iç ticaret sokağına taşındı.' },
  56: { x: 16.5, z: 27.2, rotation: -0.04, zone: 'hotel', reason: 'Otel iskele dolgu alanı yerine ana ticaret caddesine taşındı.' },
  58: { x: -28.0, z: -28.5, rotation: 0.06, zone: 'entertainment', reason: 'Musiki salonu yapılaşmış iç sokağa taşındı.' },
  60: { x: -28.0, z: 20.0, rotation: -0.02, zone: 'residential', reason: 'Hamam iç mahalleye taşındı.' },
  62: { x: -28.0, z: 8.0, rotation: 0.03, zone: 'evening', reason: 'Arka Sokak Meyhanesi daha sakin ara sokağa taşındı.' }
});

// New venues are real, buyable properties that use the game's current property
// data, shop economy and ownership model. They sit on the dry quay (x<25.5).
export const WATERFRONT_NEW_VENUES = Object.freeze({
  63: { x: 22.8, z: -11.5, rotation: -0.02, zone: 'pier', reason: 'Yolcular için iskele kahvesi.' },
  64: { x: 23.4, z: -22.2, rotation: 0.02, zone: 'pier', reason: 'Gazete ve tütün bayii.' },
  65: { x: 23.4, z: -28.4, rotation: -0.04, zone: 'pier', reason: 'Halat ve tekne levazımatı.' },
  66: { x: 23.3, z: 27.2, rotation: 0.03, zone: 'pier', reason: 'Rıhtım emanet ve yük ambarı.' }
});

// Deliberately keep Haliç Gazinosu (35) and urban businesses (34,36) on
// the land side of the promenade. The new waterfront footprint has separate
// pier facilities and open loading areas.
export const WATERFRONT_ZONES = Object.freeze({
  quay: { landMinX: 20.0, landMaxX: 25.5, northZ: 35, southZ: -35 },
  piers: [{ x: 27.2, z: -17, title: 'Galata İskelesi' }, { x: 27.2, z: 16, title: 'Haliç İskelesi' }],
  market: { x: 3.8, z: -10.5 },
  backstreets: { x: -28, z: 8 }
});

export function applyWaterfrontZoning(properties) {
  if (!Array.isArray(properties)) return properties;
  for (const property of properties) {
    const placement = WATERFRONT_RELOCATIONS[property.id] || WATERFRONT_NEW_VENUES[property.id];
    if (!placement) continue;
    property.x = placement.x;
    property.z = placement.z;
    property.rotation = placement.rotation;
    property.districtZone = placement.zone;
  }
  return properties;
}

export function validateWaterfrontPlacement(properties) {
  const errors = [];
  const ids = new Set();
  for (const property of properties) {
    if (ids.has(property.id)) errors.push('Duplicate ID '+property.id);
    ids.add(property.id);
    if (!Number.isFinite(property.x) || !Number.isFinite(property.z)) errors.push('No position '+property.id);
    if (Number(property.x) > 25.5 && Number(property.x) < 55.9 && Math.abs(Number(property.z)) < 36) {
      errors.push(property.id+' is a building in open Haliç water');
    }
  }
  for (const [id, placement] of Object.entries({...WATERFRONT_RELOCATIONS,...WATERFRONT_NEW_VENUES})) {
    const property=properties.find(item=>item.id===Number(id));
    if (!property) continue;
    if (Math.abs(property.x-placement.x)>0.01 || Math.abs(property.z-placement.z)>0.01) errors.push('Relocation ignored for '+id);
  }
  return errors;
}
