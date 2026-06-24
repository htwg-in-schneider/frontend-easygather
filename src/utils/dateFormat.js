export function parseDateTime(value) {
  if (!value) {
    return null
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }
  if (Array.isArray(value)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value
    return new Date(year, month - 1, day, hour, minute, second)
  }
  if (typeof value === 'object') {
    const year = value.year ?? value.yearValue
    const month = (value.monthValue ?? value.month ?? 1) - 1
    const day = value.dayOfMonth ?? value.day ?? 1
    const hour = value.hour ?? 0
    const minute = value.minute ?? 0
    const second = value.second ?? 0
    if (year != null) {
      return new Date(year, month, day, hour, minute, second)
    }
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDateTime(value) {
  const date = parseDateTime(value)
  if (!date) {
    return '–'
  }
  return date.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
