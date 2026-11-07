type Comparable = Record<string, unknown>;

const isEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  if (a === null || b === null || a === undefined || b === undefined)
    return false;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  return String(a) === String(b);
};

/** Returns true when every provided field in `current` already matches `initial`. */
export const isUnchanged = (
  current: Comparable,
  initial: Comparable,
): boolean => {
  const entries = Object.entries(current).filter(
    ([, value]) => value !== undefined,
  );
  return (
    entries.length > 0 &&
    entries.every(([key, value]) => isEqual(initial[key], value))
  );
};

