export function timeAgo(date: string | Date | undefined): string {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = now.getTime() - past.getTime();

  if (elapsed < msPerMinute) {
    return 'Just now';
  } else if (elapsed < msPerHour) {
    const minutes = Math.max(1, Math.round(elapsed / msPerMinute));
    return `${minutes}m ago`;
  } else if (elapsed < msPerDay) {
    const hours = Math.max(1, Math.round(elapsed / msPerHour));
    return `${hours}h ago`;
  } else if (elapsed < msPerMonth) {
    const days = Math.max(1, Math.round(elapsed / msPerDay));
    return days === 1 ? '1 day ago' : `${days} days ago`;
  } else if (elapsed < msPerYear) {
    const months = Math.max(1, Math.round(elapsed / msPerMonth));
    return months === 1 ? '1 month ago' : `${months} months ago`;
  } else {
    const years = Math.max(1, Math.round(elapsed / msPerYear));
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }
}
