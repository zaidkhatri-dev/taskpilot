type Comparable = Record<string, unknown>;

const isEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  if (a === null || b === null || a === undefined || b === undefined) return false;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  return String(a) === String(b);
};

/** true if there is something to compare AND every provided field already matches data */
export const isUnchanged = (input: Comparable, data: Comparable): boolean => {
  const entries = Object.entries(input).filter(([, value]) => value !== undefined);
  return entries.length > 0 && entries.every(([key, value]) => isEqual(data[key], value));
};