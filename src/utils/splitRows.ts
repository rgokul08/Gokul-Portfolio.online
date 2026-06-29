/**
 * Dynamically split an array into two balanced rows.
 *
 * Rules:
 *  - 0 items  → both rows empty
 *  - 1 item   → row1 = [item], row2 = []
 *  - 2 items  → row1 = [first], row2 = [second]
 *  - N items  → row1 = first ceil(N/2), row2 = remaining floor(N/2)
 *
 * If total is odd the extra item goes into the first row.
 *
 * Examples:
 *   splitRows(20) → [0..9]  + [10..19]   (10 + 10)
 *   splitRows(7)  → [0..3]  + [4..6]     ( 4 +  3)
 *   splitRows(1)  → [0]     + []          ( 1 +  0)
 *   splitRows(50) → [0..24] + [25..49]   (25 + 25)
 */
export function splitRows<T>(items: T[]): [T[], T[]] {
  const total = items.length
  if (total === 0) return [[], []]
  const mid = Math.ceil(total / 2)
  return [items.slice(0, mid), items.slice(mid)]
}
