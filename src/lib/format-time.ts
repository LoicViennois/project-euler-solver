/** Formats a duration such as `1m 4s 210ms`, or `<1ms` for instant results. */
export function formatDuration(milliseconds: number): string {
  const ms = Math.floor(milliseconds % 1000);
  const totalSecs = Math.floor(milliseconds / 1000);
  const secs = totalSecs % 60;
  const mins = Math.floor(totalSecs / 60);

  const parts = [];
  if (mins) {
    parts.push(`${mins}m`);
  }
  if (secs) {
    parts.push(`${secs}s`);
  }
  if (ms || parts.length === 0) {
    parts.push(ms ? `${ms}ms` : '<1ms');
  }
  return parts.join(' ');
}
