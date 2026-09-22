import type { z } from "zod";
import type { Precision } from "./schema";

type PrecisionT = z.infer<typeof Precision>;

/** Inclusive bounds of a possibly imprecise date as ISO day strings. */
export function bounds(date: string, precision: PrecisionT = "day"): { earliest: string; latest: string } {
  const [y, m, d] = date.split("-");
  if (precision === "day" && d) return { earliest: date, latest: date };
  if (precision === "month" || (!d && m)) {
    const month = m ?? "01";
    const last = new Date(Date.UTC(Number(y), Number(month), 0)).getUTCDate();
    return { earliest: `${y}-${month}-01`, latest: `${y}-${month}-${String(last).padStart(2, "0")}` };
  }
  return { earliest: `${y}-01-01`, latest: `${y}-12-31` };
}

/** "before" | "within" | "after" placement of an anchor day against a date interval. */
export function relation(anchor: string, date: string, precision: PrecisionT = "day", uncertainty?: { earliest: string; latest: string } | null) {
  const b = uncertainty ?? bounds(date, precision);
  if (anchor < b.earliest) return "before" as const;
  // On the latest possible day the event has certainly happened.
  if (anchor >= b.latest) return "after" as const;
  return "within" as const;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function formatDate(date: string, precision: PrecisionT = "day"): string {
  const [y, m, d] = date.split("-");
  if (precision === "year" || !m) return y;
  const month = MONTHS[Number(m) - 1];
  if (precision === "month" || !d) return `${month} ${y}`;
  return `${Number(d)} ${month} ${y}`;
}

export function yearOf(date: string): string {
  return date.slice(0, 4);
}
