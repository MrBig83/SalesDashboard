export const formatNumber = (value: number | null | undefined) =>
  new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 1 }).format(value ?? 0)

export const formatCompactNumber = (value: number | null | undefined) =>
  new Intl.NumberFormat('sv-SE', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value ?? 0)

export const fromExcelSerialDate = (value: number) => {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30))
  excelEpoch.setUTCDate(excelEpoch.getUTCDate() + Math.floor(value))
  const fraction = value % 1
  const millisecondsPerDay = 24 * 60 * 60 * 1000

  return new Date(excelEpoch.getTime() + fraction * millisecondsPerDay).toISOString()
}

export const formatDate = (value: string | number | null | undefined): string => {
  if (typeof value === 'number') {
    return formatDate(fromExcelSerialDate(value))
  }

  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export const toSentenceCase = (value: string) =>
  value
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\w/, (char) => char.toUpperCase())
