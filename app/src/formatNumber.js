// Format a number with thousands separator based on digit grouping preference
// digitGrouping: 'space' | 'comma'
// Examples:
//   formatNumber(1234.56, 'space') => '1 234.56'
//   formatNumber(1234.56, 'comma') => '1,234.56'
export function formatNumber(value, digitGrouping) {
  if (typeof value !== 'number' || isNaN(value)) return '0'
  
  const separator = digitGrouping === 'comma' ? ',' : ' '
  
  // Split into integer and decimal parts
  const [integerPart, decimalPart] = value.toFixed(2).split('.')
  
  // Add thousands separator to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  
  // Reconstruct with decimal part
  return decimalPart ? formattedInteger + '.' + decimalPart : formattedInteger
}
