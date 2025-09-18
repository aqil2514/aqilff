import { formatInTimeZone } from "date-fns-tz";

export function formatDateToTimeZone(day: string | Date) {
  const nDay = new Date(day);
  return formatInTimeZone(nDay, "Asia/Jakarta", "yyyy-MM-dd'T'HH:mm:ss");
}
