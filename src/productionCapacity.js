// Shared finished-goods capacity accounting for every business.
 // Old saves may contain orphaned production jobs (for example, jobs without
 // readyAt). The production timer cannot complete those jobs, so they must be
 // repaired on load rather than reserving warehouse space forever.
export function normalizePendingProductions(value, now = Date.now()) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const normalized = {};
  for (const [key, raw] of Object.entries(value)) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
    const [keyPropertyId, ...keyProductParts] = String(key).split(':');
    const propertyId = Number(raw.propertyId ?? keyPropertyId);
    const productId = String(raw.productId ?? keyProductParts.join(':') ?? '').trim();
    const units = Math.floor(Number(raw.units) || 0);
    if (!Number.isSafeInteger(propertyId) || propertyId <= 0 || !productId || units <= 0) continue;
    const duration = Math.max(500, Number(raw.duration) || 2500);
    const suppliedReadyAt = Number(raw.readyAt);
    const readyAt = Number.isFinite(suppliedReadyAt) && suppliedReadyAt > 0
      ? suppliedReadyAt
      : now + duration;
    const suppliedFinishAt = Number(raw.finishAt);
    const finishAt = Number.isFinite(suppliedFinishAt) && suppliedFinishAt >= readyAt
      ? suppliedFinishAt
      : readyAt + duration * Math.max(0, units - 1);
    const normalizedKey = propertyId + ':' + productId;
    const previous = normalized[normalizedKey];
    if (!previous) {
      normalized[normalizedKey] = {
        ...raw, propertyId, productId, units, duration, readyAt, finishAt,
        name: raw.name || productId
      };
    } else {
      previous.units += units;
      previous.readyAt = Math.min(previous.readyAt, readyAt);
      previous.finishAt = Math.max(previous.finishAt, finishAt);
      previous.duration = Math.max(previous.duration, duration);
    }
  }
  return normalized;
}

export function countPendingProductionUnits(pending, propertyId) {
  const targetId = Number(propertyId);
  if (!pending || typeof pending !== 'object' || !Number.isFinite(targetId)) return 0;
  return Object.entries(pending).reduce((total, [key, job]) => {
    if (!job || typeof job !== 'object') return total;
    const [keyPropertyId, ...keyProductParts] = String(key).split(':');
    const id = Number(job.propertyId ?? keyPropertyId);
    const productId = String(job.productId ?? keyProductParts.join(':') ?? '').trim();
    const units = Number(job.units);
    const readyAt = Number(job.readyAt);
    if (id !== targetId || !productId || !Number.isFinite(units) || units <= 0 ||
        !Number.isFinite(readyAt) || readyAt <= 0) return total;
    return total + Math.floor(units);
  }, 0);
}
