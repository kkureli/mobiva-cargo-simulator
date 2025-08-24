import { CleanCargo, RawCargo } from '../domain/types';
import { CATEGORIES, Status, STATUSES } from '../domain/constants';

const catSet = new Set(CATEGORIES);
const statusSet = new Set(STATUSES);
const uuidV4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type CleanResult = {
  rows: CleanCargo[];
  removedCount: number;
  remainingCount: number;
  cleanDurationMs: number;
};

export function clean(
  rows: RawCargo[],
  opts?: { timeoutMs?: number },
): CleanResult {
  const out: CleanCargo[] = [];
  const t0 = Date.now();
  const timeout = opts?.timeoutMs ?? 2000;
  let removed = 0;
  const seenIds = new Set<string>();

  for (let i = 0; i < rows.length; i++) {
    if (Date.now() - t0 > timeout) {
      throw new Error('TIMEOUT: clean exceeded time budget');
    }

    const r = rows[i];

    if (!r.status || !statusSet.has(r.status as Status)) {
      removed++;
      continue;
    }
    if (!catSet.has(r.category)) {
      removed++;
      continue;
    }
    if (!Number.isFinite(r.price) || r.price < 0) {
      removed++;
      continue;
    }
    if (r.kg == null || !Number.isFinite(r.kg)) {
      removed++;
      continue;
    }
    if (!uuidV4.test(r.id) || seenIds.has(r.id)) {
      removed++;
      continue;
    }

    seenIds.add(r.id);

    out.push({
      id: r.id,
      name: r.name,
      category: r.category,
      price: r.price,
      status: r.status as Status,
      kg: r.kg as number,
      createdAt: r.createdAt,
    });
  }

  const t1 = Date.now();
  return {
    rows: out,
    removedCount: removed,
    remainingCount: out.length,
    cleanDurationMs: t1 - t0,
  };
}
