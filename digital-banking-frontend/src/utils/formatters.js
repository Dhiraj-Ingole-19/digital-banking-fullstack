// src/utils/formatters.js

/**
 * Formats a number into Indian Rupee (INR) currency.
 * e.g., 1000 -> ₹1,000.00
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

/**
 * Formats a timestamp into a readable date and time.
 * e.g., "2025-11-02T14:30:00" -> "02 Nov 2025, 2:30 PM"
 */
export const formatDateTime = (isoString) => {
  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  return new Intl.DateTimeFormat('en-IN', options).format(new Date(isoString));
};

/**
 * --- NEW FUNCTION ---
 * Formats a timestamp into a readable date only.
 * e.g., "2025-11-02T14:30:00" -> "02 Nov 2025"
 */
export const formatDate = (isoString) => {
  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };
  return new Intl.DateTimeFormat('en-IN', options).format(new Date(isoString));
};