import { RawCargo } from '../domain/types';
import { CATEGORIES, Status, STATUSES } from '../domain/constants';

const catSet = new Set(CATEGORIES);
const statusSet = new Set(STATUSES);
const uuidV4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isRawDirty(r: RawCargo): boolean {
  if (!r.status || !statusSet.has(r.status as Status)) return true;
  if (!catSet.has(r.category)) return true;
  if (r.price < 0) return true;
  if (r.kg == null) return true;
  if (!uuidV4.test(r.id)) return true;
  return false;
}
