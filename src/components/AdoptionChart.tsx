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

const X0 = Date.UTC(2016, 0, 1);
const X1 = Date.UTC(2026, 9, 1);
const dayOf = (d: string) => Date.parse(bounds(d).latest + "T00:00:00Z");

/**
 * One published adoption series over 2016–2026 on a log scale (growth is
 * tenfold every few years). The stretch up to the chapter's date is solid; what
 * came later is faint. The last figure known at that date is labelled. Every
 * point's wording and source sit in the drawer.
 */
export default function AdoptionChart({ series, date }: { series: MetricSeries; date: string }) {
  const W = 600, H = 104, PL = 34, PR = 10, PT = 10, PB = 18;
  const values = series.points.map((p) => p.value);
  const lo = Math.pow(10, Math.floor(Math.log10(Math.min(...values))));
  const hi = Math.pow(10, Math.ceil(Math.log10(Math.max(...values))));
  const x = (d: string) => PL + ((dayOf(d) - X0) / (X1 - X0)) * (W - PL - PR);
  const y = (v: number) => PT + (1 - (Math.log10(v) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo))) * (H - PT - PB);
  const current = pointAt(series, date);
  const cutoffX = x(date);
  const path = series.points.map((p, i) => `${i ? "L" : "M"} ${x(p.date).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ");
  const ticks: number[] = [];
  for (let v = lo; v <= hi; v *= 10) ticks.push(v);
  const years = [2016, 2018, 2020, 2022, 2024, 2026];
  const gradId = `fade-${series.id}`;
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
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="mt-1 max-h-[112px] w-full" role="img" aria-label={`${series.title}, ${series.points[0].value} in ${formatDate(series.points[0].date, series.points[0].precision)} to ${series.points.at(-1)!.value} in ${formatDate(series.points.at(-1)!.date, series.points.at(-1)!.precision)}, log scale`}>
        <defs>
          <clipPath id={`${gradId}-past`}>
            <rect x="0" y="0" width={Math.max(cutoffX, PL)} height={H} />
          </clipPath>
          <clipPath id={`${gradId}-future`}>
            <rect x={Math.max(cutoffX, PL)} y="0" width={W} height={H} />
          </clipPath>
        </defs>
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
        <path d={path} fill="none" className="stroke-muted-foreground/40" strokeWidth="2" strokeDasharray="3 3" clipPath={`url(#${gradId}-future)`} />
        <path d={path} fill="none" className="stroke-accent" strokeWidth="2" strokeLinejoin="round" clipPath={`url(#${gradId}-past)`} />
        {series.points.map((p) => {
          const past = bounds(p.date, p.precision).latest <= date;
          const isCurrent = current === p;
          return (
            <circle key={p.date} cx={x(p.date)} cy={y(p.value)} r={isCurrent ? 5 : 3.5} className={past ? "fill-accent stroke-card" : "fill-muted-foreground/40 stroke-card"} strokeWidth="2">
              <title>
                {formatDate(p.date, p.precision)}: {p.value.toLocaleString("en-US")} {series.unit}
                {p.confidence === "qualified" ? " (approximate)" : ""}
              </title>
            </circle>
          );
        })}
        {current && (
          <text x={Math.min(x(current.date) + 7, W - PR - 40)} y={Math.max(y(current.value) - 7, PT + 8)} className="fill-foreground" fontSize="10" fontWeight="600">
            {fmt(current.value)}
          </text>
        )}
        <line x1={cutoffX} x2={cutoffX} y1={PT} y2={H - PB} className="stroke-accent/40" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>log scale · dotted: published later</span>
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
