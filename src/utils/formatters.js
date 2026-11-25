const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 0,
});

/**
 * @param {number} amount
 * @returns {string}
 */
export function formatIDR(amount) {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  return idrFormatter.format(safe);
}

/**
 * @param {number} amount
 * @returns {string}
 */
export function formatCompactIDR(amount) {
  const safe = Number.isFinite(amount) ? amount : 0;
  if (safe >= 1_000_000_000) {
    return `Rp ${(safe / 1_000_000_000).toFixed(1).replace('.', ',')} M`;
  }
  if (safe >= 1_000_000) {
    return `Rp ${(safe / 1_000_000).toFixed(1).replace('.', ',')} Jt`;
  }
  if (safe >= 1_000) {
    return `Rp ${numberFormatter.format(Math.round(safe / 1_000))} Rb`;
  }
  return formatIDR(safe);
}

/**
 * @param {number} value
 * @returns {string}
 */
export function formatNumber(value) {
  const safe = Number.isFinite(value) ? Math.round(value) : 0;
  return numberFormatter.format(safe);
}
