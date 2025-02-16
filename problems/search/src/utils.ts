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

  return function(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

// Simulate network delay and potential failures
export async function searchItems(
  items: TableRow[], 
  query: string, 
  delay: number = 300
): Promise<TableRow[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, delay));

  // Simulate random network error (1 in 20 chance)
  if (Math.random() < 0.05) {
    throw new Error('Network error');
  }

  // Case insensitive search across multiple fields
  return items.filter(item => {
    const searchStr = query.toLowerCase();
    return (
      item.name?.toLowerCase().includes(searchStr) ||
      item.price?.toString().includes(searchStr) ||
      item.date?.toLocaleDateString().includes(searchStr)
    );
  });
}