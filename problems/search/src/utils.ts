import { TableRow } from "./types";

export const compareValues = (aVal: TableRow[keyof TableRow], bVal: TableRow[keyof TableRow], direction: 'asc' | 'desc' | null) => {
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


export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
    // Clear the existing timeout
    clearTimeout(timeoutId);

    // Set a new timeout
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
