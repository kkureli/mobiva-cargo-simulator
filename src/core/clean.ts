import { CleanCargo, RawCargo, Status } from '../domain/types';
import { CATEGORIES, STATUSES } from '../domain/constants';

const catSet = new Set(CATEGORIES);
const statusSet = new Set(STATUSES);
const uuidV4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function clean(rows: RawCargo[]) {
  const out: CleanCargo[] = [];
  const t0 = Date.now();
  let removed = 0;

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];

    if (!r.status || !statusSet.has(r.status as Status)) {
      removed++;
      continue;
    }
    if (!catSet.has(r.category)) {
      removed++;
      continue;
    }
    if (r.price < 0) {
      removed++;
      continue;
    }
    if (r.kg == null) {
      removed++;
      continue;
    }
    if (!uuidV4.test(r.id)) {
      removed++;
      continue;
    }

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
