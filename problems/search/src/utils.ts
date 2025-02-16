export const compareValues = (aVal: any, bVal: any, direction: 'asc' | 'desc' | null) => {
  // Handle null/undefined values
  if (aVal == null) return direction === 'asc' ? -1 : 1;
  if (bVal == null) return direction === 'asc' ? 1 : -1;

  // Detect value type and compare accordingly
  if (typeof aVal === 'string' && typeof bVal === 'string') {
    return direction === 'asc'
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  }

  // Handle numbers
  if (typeof aVal === 'number' && typeof bVal === 'number') {
    return direction === 'asc' ? aVal - bVal : bVal - aVal;
  }

  // Handle dates
  if (aVal instanceof Date && bVal instanceof Date) {
    return direction === 'asc'
      ? aVal.getTime() - bVal.getTime()
      : bVal.getTime() - aVal.getTime();
  }

  // Default comparison
  return direction === 'asc'
    ? String(aVal).localeCompare(String(bVal))
    : String(bVal).localeCompare(String(aVal));
}

