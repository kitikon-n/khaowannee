/**
 * Date utility functions for formatting dates in dd/mm/yyyy format
 */

/**
 * Convert Date object or ISO string to dd/mm/yyyy format
 * @param {Date|string} date - Date object or ISO date string
 * @returns {string} Date in dd/mm/yyyy format
 */
export const formatDate = (date) => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Convert Date object or ISO string to yyyy-mm-dd format (for input[type="date"])
 * @param {Date|string} date - Date object or ISO date string
 * @returns {string} Date in yyyy-mm-dd format
 */
export const toInputDateFormat = (date) => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Convert dd/mm/yyyy string to Date object
 * @param {string} dateString - Date string in dd/mm/yyyy format
 * @returns {Date|null} Date object or null if invalid
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;

  const parts = dateString.split('/');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const date = new Date(year, month, day);
  if (isNaN(date.getTime())) return null;

  return date;
};

/**
 * Format date with time in dd/mm/yyyy HH:mm format
 * @param {Date|string} date - Date object or ISO date string
 * @returns {string} Date with time in dd/mm/yyyy HH:mm format
 */
export const formatDateTime = (date) => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Get today's date in yyyy-mm-dd format (for input[type="date"])
 * @returns {string} Today's date in yyyy-mm-dd format
 */
export const getTodayInputFormat = () => {
  return toInputDateFormat(new Date());
};

/**
 * Format relative date (e.g., "Today", "Yesterday", or dd/mm/yyyy)
 * @param {Date|string} date - Date object or ISO date string
 * @returns {string} Relative date string
 */
export const formatRelativeDate = (date) => {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const compareDate = new Date(d);
  compareDate.setHours(0, 0, 0, 0);

  const diffTime = today - compareDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays === -1) return 'Tomorrow';

  return formatDate(d);
};
