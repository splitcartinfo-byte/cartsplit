export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km} km`;
}

export function formatTimeLeft(hours: number): string {
  if (hours < 1) return 'Ends soon';
  if (hours < 24) return `Ends in ${hours}h`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (remainingHours === 0) return `Ends in ${days}d`;
  return `Ends in ${days}d ${remainingHours}h`;
}
