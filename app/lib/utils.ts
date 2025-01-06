export function formatCurrency(value?: number, locales: Intl.LocalesArgument = 'id-ID', options: Intl.NumberFormatOptions = { style: 'currency', currency: 'IDR' }) {
  return Intl.NumberFormat(locales, options).format(value || 0);
}
