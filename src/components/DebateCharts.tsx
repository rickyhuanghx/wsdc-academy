/* Server-rendered, dependency-free SVG charts in the varsity-editorial palette.
   No client JS: bars carry their own value labels, so nothing needs hover.
   Colors come from Tailwind fill/stroke utilities generated off the @theme
   tokens in globals.css (fill-navy-900, fill-signal-500, stroke-navy-100, ...). */

type Column = {
  label: string;
  value: number;
  sub?: string;
  highlight?: boolean; // scarlet bar (the lead figure)
  muted?: boolean; // grey bar (a baseline / benchmark)
};

/** Vertical column chart. Values label themselves above each bar; an optional
    dashed reference line marks a benchmark (e.g. the ~5% general rate). */
export function ColumnChart({
  data,
  max,
  unit = '%',
  baseline,
  baselineLabel,
  ariaLabel,
}: {
  data: Column[];
  max: number;
  unit?: string;
  baseline?: number;
  baselineLabel?: string;
  ariaLabel: string;
}) {
  const W = 720;
  const H = 300;
  const P = { l: 6, r: 6, t: 34, b: 58 };
  const plotW = W - P.l - P.r;
  const plotH = H - P.t - P.b;
  const y = (v: number) => P.t + plotH - (v / max) * plotH;
  const band = plotW / data.length;
  const bw = Math.min(94, band * 0.58);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      role="img"
      aria-label={ariaLabel}
      className="block h-auto w-full"
    >
      {/* bottom baseline */}
      <line x1={P.l} x2={W - P.r} y1={y(0)} y2={y(0)} className="stroke-navy-300" strokeWidth={1.5} />

      {/* benchmark reference line */}
      {baseline !== undefined && (
        <>
          <line
            x1={P.l}
            x2={W - P.r}
            y1={y(baseline)}
            y2={y(baseline)}
            className="stroke-signal-400"
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
          {baselineLabel && (
            <text
              x={W - P.r}
              y={y(baseline) - 7}
              textAnchor="end"
              className="fill-signal-500 font-sans"
              fontSize={12}
            >
              {baselineLabel}
            </text>
          )}
        </>
      )}

      {data.map((d, i) => {
        const cx = P.l + band * i + band / 2;
        const barTop = y(d.value);
        const barFill = d.highlight
          ? 'fill-signal-500'
          : d.muted
            ? 'fill-navy-300'
            : 'fill-navy-800';
        const valFill = d.highlight ? 'fill-signal-600' : 'fill-navy-900';
        return (
          <g key={d.label}>
            <rect
              x={cx - bw / 2}
              y={barTop}
              width={bw}
              height={Math.max(2, y(0) - barTop)}
              rx={4}
              className={barFill}
            />
            <text
              x={cx}
              y={barTop - 10}
              textAnchor="middle"
              className={`${valFill} font-display`}
              fontSize={21}
              fontWeight={600}
            >
              {d.value}
              {unit}
            </text>
            <text
              x={cx}
              y={H - 34}
              textAnchor="middle"
              className="fill-navy-900 font-sans"
              fontSize={14}
              fontWeight={600}
            >
              {d.label}
            </text>
            {d.sub && (
              <text x={cx} y={H - 16} textAnchor="middle" className="fill-navy-400 font-sans" fontSize={12}>
                {d.sub}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

type GroupPoint = { label: string; a: number; b: number };

/** Two-series grouped columns (e.g. debaters vs peers on the same metric). */
export function GroupedColumnChart({
  data,
  max,
  unit = '%',
  seriesA,
  seriesB,
  ariaLabel,
}: {
  data: GroupPoint[];
  max: number;
  unit?: string;
  seriesA: string;
  seriesB: string;
  ariaLabel: string;
}) {
  const W = 720;
  const H = 300;
  const P = { l: 6, r: 6, t: 34, b: 54 };
  const plotW = W - P.l - P.r;
  const plotH = H - P.t - P.b;
  const y = (v: number) => P.t + plotH - (v / max) * plotH;
  const band = plotW / data.length;
  const bw = Math.min(60, band * 0.3);
  const gap = 10;

  return (
    <figure className="m-0">
      <div className="mb-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs font-semibold text-navy-700">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-signal-500" />
          {seriesA}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-navy-300" />
          {seriesB}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={ariaLabel} className="block h-auto w-full">
        <line x1={P.l} x2={W - P.r} y1={y(0)} y2={y(0)} className="stroke-navy-300" strokeWidth={1.5} />
        {data.map((d, i) => {
          const cx = P.l + band * i + band / 2;
          const xA = cx - gap / 2 - bw;
          const xB = cx + gap / 2;
          return (
            <g key={d.label}>
              <rect x={xA} y={y(d.a)} width={bw} height={Math.max(2, y(0) - y(d.a))} rx={4} className="fill-signal-500" />
              <text x={xA + bw / 2} y={y(d.a) - 9} textAnchor="middle" className="fill-signal-600 font-display" fontSize={18} fontWeight={600}>
                {d.a}
                {unit}
              </text>
              <rect x={xB} y={y(d.b)} width={bw} height={Math.max(2, y(0) - y(d.b))} rx={4} className="fill-navy-300" />
              <text x={xB + bw / 2} y={y(d.b) - 9} textAnchor="middle" className="fill-navy-700 font-display" fontSize={18} fontWeight={600}>
                {d.b}
                {unit}
              </text>
              <text x={cx} y={H - 20} textAnchor="middle" className="fill-navy-900 font-sans" fontSize={14} fontWeight={600}>
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

type Bar = { label: string; value: number; elite?: boolean; note?: string; colorClass?: string };

/** Horizontal ranked bars. Each bar sets its own color (elite vs other, or an
    explicit colorClass for staged/funnel views). */
export function RankedBars({
  data,
  max,
  valueSuffix = '',
  ariaLabel,
}: {
  data: Bar[];
  max: number;
  valueSuffix?: string;
  ariaLabel: string;
}) {
  const W = 720;
  const labelW = 178;
  const rowH = 32;
  const barH = 19;
  const padR = 46;
  const H = data.length * rowH + 4;
  const x = (v: number) => labelW + (v / max) * (W - labelW - padR);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={ariaLabel} className="block h-auto w-full">
      {data.map((d, i) => {
        const yTop = i * rowH + 2;
        const color = d.colorClass ?? (d.elite ? 'fill-signal-500' : 'fill-navy-400');
        return (
          <g key={d.label}>
            <text x={labelW - 12} y={yTop + barH / 2 + 4} textAnchor="end" className="fill-navy-700 font-sans" fontSize={13.5}>
              {d.label}
            </text>
            <rect x={labelW} y={yTop} width={Math.max(3, x(d.value) - labelW)} height={barH} rx={4} className={color} />
            <text x={x(d.value) + 8} y={yTop + barH / 2 + 4} className="fill-navy-900 font-display" fontSize={15} fontWeight={600}>
              {d.value}
              {valueSuffix}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** 100-square waffle grid: fills the first `Math.round(pct)` cells. */
export function WaffleGrid({ pct, ariaLabel }: { pct: number; ariaLabel: string }) {
  const N = 10;
  const gap = 4;
  const size = 320;
  const cell = (size - gap * (N - 1)) / N;
  const filled = Math.round(pct);
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" role="img" aria-label={ariaLabel} className="block h-auto w-full">
      {Array.from({ length: 100 }, (_, i) => {
        const row = Math.floor(i / N);
        const c = i % N;
        return (
          <rect
            key={i}
            x={c * (cell + gap)}
            y={row * (cell + gap)}
            width={cell}
            height={cell}
            rx={3}
            className={i < filled ? 'fill-signal-500' : 'fill-navy-100'}
          />
        );
      })}
    </svg>
  );
}
