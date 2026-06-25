export function formatEuro(amount) {
  return `${Number(amount).toFixed(2).replace('.', ',')} €`
}

export function displayOrderNumber(order) {
  if (order?.orderNumber) {
    return order.orderNumber
  }
  if (order?.id != null) {
    return `EG-${String(order.id).padStart(4, '0')}`
  }
  return ''
}

export function orderStatusLabel(status) {
  switch (status) {
    case 'BESTAETIGT':
      return 'Bestätigt'
    case 'UNTERWEGS':
      return 'Unterwegs'
    case 'ABGESCHLOSSEN':
      return 'Zugestellt'
    default:
      return status
  }
}

export function paymentMethodLabel(method) {
  switch (method) {
    case 'KARTE':
      return 'Kreditkarte'
    case 'PAYPAL':
      return 'PayPal'
    case 'RECHNUNG':
      return 'Rechnung'
    default:
      return method
  }
}

export function deliveryStatusLabel(status) {
  switch (status) {
    case 'EINGEGANGEN':
      return 'Eingegangen'
    case 'ANGENOMMEN':
      return 'Angenommen'
    case 'UNTERWEGS':
      return 'Unterwegs'
    case 'GELIEFERT':
      return 'Geliefert'
    default:
      return status
  }
}
