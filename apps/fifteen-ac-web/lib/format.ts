export function formatMoney(value: string | number, currencyCode = 'COP'): string {
  const amount = typeof value === 'string' ? Number(value) : value;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: currencyCode === 'COP' ? 0 : 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}
