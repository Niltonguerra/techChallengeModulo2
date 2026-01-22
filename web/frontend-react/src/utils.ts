// gets a string/Date and returns a Date object
export function toDate(value: Date | string | number): Date {
  return value instanceof Date ? value : new Date(value);
}

// returns a Date object set to the start of the day (00:00:00) of the given date
export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// checks if two dates fall on the same calendar day
export function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// formats the date into a text whatsapp style (hoje, ontem, weekday, dd/mm/yyyy)
export function formatDayLabel(date: Date, now: Date) {
  const today = startOfDay(now);
  const target = startOfDay(date);
  const diffDays = Math.round(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";

  if (diffDays > 1 && diffDays < 7) {
    return new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(date);
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}