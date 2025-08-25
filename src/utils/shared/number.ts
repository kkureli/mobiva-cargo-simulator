export function parseNumStrict(s: string): number {
  if (typeof s !== 'string') return NaN;
  if (s.trim() === '') return NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}
