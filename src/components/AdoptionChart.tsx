import { bounds, formatDate } from "@/content/dates";
import type { MetricSeries, MetricPoint } from "@/content/schema";
import EvidenceDrawer, { SourceList } from "./EvidenceDrawer";

/** The last published figure on or before a date, if any. */
export function pointAt(series: MetricSeries, date: string): MetricPoint | null {
  let hit: MetricPoint | null = null;
  for (const p of series.points) {
    if (bounds(p.date, p.precision).latest <= date) hit = p;
  }
  return hit;
}

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toLocaleString("en-US", { maximumFractionDigits: n % 1000 === 0 ? 0 : 1 })}k` : String(n);
}

const START = Date.UTC(2016, 0, 1);
const YEAR = 365.25 * 24 * 3600 * 1000;
const dayOf = (d: string) => Date.parse(bounds(d).latest + "T00:00:00Z");

/**
 * One published adoption series as it stood at the chapter's date: the time
 * axis runs from 2016 to that date and only figures published by then are
 * drawn, on a log scale (growth is tenfold every few years). Every point's
 * wording and source sit in the drawer.
 */
export default function AdoptionChart({ series, date }: { series: MetricSeries; date: string }) {
  const W = 600, H = 104, PL = 34, PR = 14, PT = 12, PB = 18;
  const known = series.points.filter((p) => bounds(p.date, p.precision).latest <= date);
  const current = known.at(-1) ?? null;
  // Time axis: 2016 up to the chapter date, never shorter than two years so early chapters keep a readable scale.
  const end = Math.max(dayOf(date), START + 2 * YEAR);
  const x = (d: string) => PL + ((dayOf(d) - START) / (end - START)) * (W - PL - PR);
  const values = known.map((p) => p.value);
  const lo = values.length ? Math.pow(10, Math.floor(Math.log10(Math.min(...values)))) : 100;
  const hi = values.length ? Math.max(Math.pow(10, Math.ceil(Math.log10(Math.max(...values)))), lo * 10) : 1000;
  const y = (v: number) => PT + (1 - (Math.log10(v) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo))) * (H - PT - PB);
  const path = known.map((p, i) => `${i ? "L" : "M"} ${x(p.date).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ");
  const ticks: number[] = [];
  for (let v = lo; v <= hi; v *= 10) ticks.push(v);
  const endYear = new Date(end).getUTCFullYear();
  const step = endYear - 2016 > 6 ? 2 : 1;
  const years: number[] = [];
  for (let yr = 2016; yr <= endYear; yr += step) years.push(yr);
  return (
    <figure className="flex min-h-0 flex-col rounded-lg border border-border bg-card px-3 pb-2 pt-2.5">
      <figcaption className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold">{series.title}</span>
        <span className="text-xs text-muted-foreground">
          {current ? (
            <>
              <span className="font-semibold text-foreground">{current.value.toLocaleString("en-US")}</span> · {formatDate(current.date, current.precision)}
            </>
          ) : (
            "no published figure yet"
          )}
        </span>
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="mt-1 max-h-[112px] w-full"
        role="img"
        aria-label={current ? `${series.title}: ${current.value.toLocaleString("en-US")} as of ${formatDate(current.date, current.precision)}, log scale from 2016` : `${series.title}: no published figure by ${formatDate(date)}`}
      >
        {ticks.map((v) => (
          <g key={v}>
            <line x1={PL} x2={W - PR} y1={y(v)} y2={y(v)} className="stroke-border" strokeWidth="1" />
            <text x={PL - 4} y={y(v) + 3} textAnchor="end" className="fill-muted-foreground" fontSize="9">
              {fmt(v)}
            </text>
          </g>
        ))}
        {years.map((yr) => (
          <text key={yr} x={x(`${yr}-01-01`)} y={H - 6} textAnchor="middle" className="fill-muted-foreground" fontSize="9">
            {yr}
          </text>
        ))}
        {known.length > 1 && <path d={path} fill="none" className="stroke-accent" strokeWidth="2" strokeLinejoin="round" />}
        {known.map((p) => (
          <circle key={p.date} cx={x(p.date)} cy={y(p.value)} r={p === current ? 5 : 3.5} className="fill-accent stroke-card" strokeWidth="2">
            <title>
              {formatDate(p.date, p.precision)}: {p.value.toLocaleString("en-US")} {series.unit}
              {p.confidence === "qualified" ? " (approximate)" : ""}
            </title>
          </circle>
        ))}
        {current && (
          <text x={Math.min(x(current.date), W - PR - 4)} y={Math.max(y(current.value) - 9, PT + 8)} textAnchor="end" className="fill-foreground" fontSize="10" fontWeight="600">
            {fmt(current.value)}
          </text>
        )}
        {!current && (
          <text x={(PL + W - PR) / 2} y={(PT + H - PB) / 2 + 4} textAnchor="middle" className="fill-muted-foreground" fontSize="10">
            no figure published by {formatDate(date)}
          </text>
        )}
      </svg>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>log scale · as published by dbt Labs</span>
        <EvidenceDrawer title={series.title} description={series.note?.trim()} trigger={<button type="button" className="underline-offset-2 hover:text-foreground hover:underline">Figures and sources</button>}>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-1 pr-2 font-medium">Date</th>
                <th className="py-1 pr-2 text-right font-medium">{series.unit}</th>
                <th className="py-1 font-medium">As stated</th>
              </tr>
            </thead>
            <tbody>
              {series.points.map((p) => (
                <tr key={p.date} className="border-t border-border align-top">
                  <td className="whitespace-nowrap py-1.5 pr-2">{formatDate(p.date, p.precision)}</td>
                  <td className="py-1.5 pr-2 text-right tabular-nums">{p.value.toLocaleString("en-US")}</td>
                  <td className="py-1.5">
                    {p.basis}
                    {p.confidence === "qualified" && <span className="text-muted-foreground"> (approximate)</span>}
                    <div className="mt-0.5">
                      <SourceList sources={[p.source]} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </EvidenceDrawer>
      </div>
    </figure>
  );
}
