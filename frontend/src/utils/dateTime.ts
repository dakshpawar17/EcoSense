/** Builds a full activity timestamp using device locale and timezone */
export function buildActivityTimestamp() {
  const now = new Date();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return {
    date: now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: tz }),
    day: now.toLocaleDateString("en-US", { weekday: "long", timeZone: tz }),
    time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: tz }),
    month: now.toLocaleDateString("en-US", { month: "long", timeZone: tz }),
    year: now.getFullYear(),
    timeZone: tz,
    unixTimestamp: Math.floor(now.getTime() / 1000),
    iso: now.toISOString(),
  };
}

/** Formats a date string for grouping in the activity history */
export function formatGroupDate(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(d, today)) return "Today";
  if (isSameDay(d, yesterday)) return "Yesterday";

  return d.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Formats an ISO date string for inline display inside the history table */
export function formatActivityTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/** Returns "Last synced: Today, 10:42 AM" style string */
export function formatLastSynced(date: Date): string {
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return isToday ? `Today, ${time}` : date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + `, ${time}`;
}

/** Groups an array of entries by their calendar date */
export function groupEntriesByDate<T extends { createdAt: string }>(
  entries: T[]
): Array<{ label: string; entries: T[] }> {
  const groups: Record<string, T[]> = {};

  for (const entry of entries) {
    const d = new Date(entry.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
  }

  return Object.entries(groups).map(([, items]) => ({
    label: formatGroupDate(items[0].createdAt),
    entries: items,
  }));
}
