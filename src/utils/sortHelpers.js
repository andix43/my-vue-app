export function compareValues(a, b, direction = 'asc') {
  const modifier = direction === 'asc' ? 1 : -1
  
  // Handle NA/undefined/null values (treat as smallest possible)
  if (a === undefined || a === null || a === 'NA') return -1 * modifier
  if (b === undefined || b === null || b === 'NA') return 1 * modifier

  // Try numeric comparison first
  const numA = Number(a)
  const numB = Number(b)
  
  if (!isNaN(numA) && !isNaN(numB)) {
    return (numA - numB) * modifier
  }
  
  // Fallback to string comparison
  return String(a).localeCompare(String(b)) * modifier
}