import type { DataTable } from '~~/types/table';

export function formatCurrency(value?: number, locales: Intl.LocalesArgument = 'id-ID', options: Intl.NumberFormatOptions = { style: 'currency', currency: 'IDR' }) {
  return Intl.NumberFormat(locales, options).format(value || 0);
}

export function isString(data: unknown): data is string {
  return typeof data === 'string';
}

export function isDatatable(data: unknown): data is DataTable {
  return typeof data === 'object' && data !== null
    && ('columns' in data && Array.isArray(data.columns))
    && ('rows' in data && Array.isArray(data.rows));
}
