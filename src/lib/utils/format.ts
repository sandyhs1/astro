/**
 * Formats a date string (YYYY-MM-DD) to DD-MM-YYYY for frontend display.
 */
export function formatDate(dob: string | undefined | null): string {
  if (!dob) return '';
  if (dob.includes('-')) {
    const parts = dob.split('-');
    if (parts[0].length === 4) {
      // YYYY-MM-DD -> DD-MM-YYYY
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }
  return dob;
}

/**
 * Ensures time is in 24h HH:mm:ss format.
 */
export function formatTime(tob: string | undefined | null): string {
  if (!tob) return '';
  // If already contains seconds, return as is or trim if needed
  if (tob.split(':').length === 3) return tob;
  // If HH:mm, add :00
  if (tob.split(':').length === 2) return `${tob}:00`;
  return tob;
}
