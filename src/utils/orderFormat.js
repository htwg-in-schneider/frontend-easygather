export function formatEuro(amount) {
  return `${Number(amount).toFixed(2).replace('.', ',')} €`
}

export function orderStatusLabel(status) {
  switch (status) {
    case 'BESTAETIGT':
      return 'Bestätigt'
    case 'ABGESCHLOSSEN':
      return 'Abgeschlossen'
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
