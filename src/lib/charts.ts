/**
 * ZAKUIKit Docs — tiny SVG chart builders.
 * Pure string builders executed at build time to generate the Data
 * Visualization demos without any charting dependency.
 */
import { nf } from './strings';

export interface SeriesBox {
  width?: number;
  height?: number;
  color?: string;
  grid?: boolean;
  labels?: string[];
}

const PALETTE = [
  'var(--zak-chart-1)',
  'var(--zak-chart-2)',
  'var(--zak-chart-3)',
  'var(--zak-chart-4)',
  'var(--zak-chart-5)',
  'var(--zak-chart-6)',
  'var(--zak-chart-7)',
];

function niceMax(values: number[]): number {
  const max = Math.max(...values, 1);
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  const unit = max / pow;
  const step = unit <= 1.2 ? 1.2 : unit <= 2 ? 2 : unit <= 2.5 ? 2.5 : unit <= 5 ? 5 : 10;
  return step * pow;
}

function pointsFor(values: number[], x0: number, x1: number, y0: number, y1: number, max: number) {
  const step = values.length > 1 ? (x1 - x0) / (values.length - 1) : 0;
  return values.map((v, i) => [x0 + step * i, y1 - (v / max) * (y1 - y0)] as const);
}

function polyline(pts: readonly (readonly [number, number])[]): string {
  return pts.map(([x, y]) => `${nf(x)},${nf(y)}`).join(' ');
}

function axes(box: Required<Pick<SeriesBox, 'width' | 'height' | 'grid'>> & { max: number; labels?: string[] }) {
  const pad = { t: 14, r: 14, b: 26, l: 42 };
  const x0 = pad.l;
  const x1 = box.width - pad.r;
  const y0 = pad.t;
  const y1 = box.height - pad.b;
  let out = '';
  const ticks = 4;
  for (let i = 0; i <= ticks; i++) {
    const y = y0 + ((y1 - y0) / ticks) * i;
    const value = box.max - (box.max / ticks) * i;
    if (box.grid) out += `<line class="zak-chart__grid-line" x1="${x0}" y1="${nf(y)}" x2="${x1}" y2="${nf(y)}"/>`;
    out += `<text class="zak-chart__axis-label" x="${x0 - 8}" y="${nf(y + 3)}" text-anchor="end">${nf(Math.round(value))}</text>`;
  }
  if (box.labels) {
    const step = box.labels.length > 1 ? (x1 - x0) / (box.labels.length - 1) : 0;
    box.labels.forEach((label, i) => {
      out += `<text class="zak-chart__axis-label" x="${nf(x0 + step * i)}" y="${box.height - 8}" text-anchor="middle">${label}</text>`;
    });
  }
  return { markup: out, x0, x1, y0, y1 };
}

/** Sparkline — inline mini chart, no axes. */
export function sparkline(
  values: number[],
  color = PALETTE[0],
  width = 110,
  height = 34,
): string {
  const max = niceMax(values);
  const min = Math.min(0, ...values);
  const pts = pointsFor(values, 2, width - 2, 3, height - 3, Math.max(max, min + 1));
  const line = polyline(pts);
  const area = `${pts[0][0]},${height - 1} ${line} ${pts[pts.length - 1][0]},${height - 1}`;
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Sparkline trend">
    <polygon class="spark-area" fill="${color}" points="${area}"/>
    <polyline class="spark-line" stroke="${color}" points="${line}"/>
  </svg>`;
}

/** Line chart with grid, axis labels and interactive points. */
export function lineChart(values: number[], opts: SeriesBox & { points?: boolean; second?: number[] } = {}): string {
  const width = opts.width ?? 620;
  const height = opts.height ?? 240;
  const color = opts.color ?? PALETTE[0];
  const max = niceMax([...values, ...(opts.second ?? [])]);
  const grid = opts.grid !== false;
  const { markup, x0, x1, y0, y1 } = axes({ width, height, grid, max, labels: opts.labels });
  const pts = pointsFor(values, x0, x1, y0, y1, max);
  let dots = '';
  if (opts.points !== false) {
    dots = pts
      .map(([x, y], i) => `<circle class="zak-chart__point" cx="${nf(x)}" cy="${nf(y)}" r="4" fill="${color}"><title>${opts.labels?.[i] ?? 'Point ' + (i + 1)}: ${values[i]}</title></circle>`)
      .join('');
  }
  let second = '';
  if (opts.second) {
    second = `<polyline class="zak-chart__line" stroke="${PALETTE[1]}" stroke-dasharray="5 5" points="${polyline(pointsFor(opts.second, x0, x1, y0, y1, max))}"/>`;
  }
  return `<svg class="zak-chart__svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Line chart">${markup}
    <polyline class="zak-chart__line" stroke="${color}" points="${polyline(pts)}"/>${second}${dots}</svg>`;
}

/** Area chart — line chart plus a translucent fill. */
export function areaChart(values: number[], opts: SeriesBox & { points?: boolean; id?: string } = {}): string {
  const width = opts.width ?? 620;
  const height = opts.height ?? 240;
  const color = opts.color ?? PALETTE[0];
  const id = opts.id ?? 'areagrad';
  const max = niceMax(values);
  const { markup, x0, x1, y0, y1 } = axes({ width, height, grid: opts.grid !== false, max, labels: opts.labels });
  const pts = pointsFor(values, x0, x1, y0, y1, max);
  const line = polyline(pts);
  const area = `${x0},${y1} ${line} ${x1},${y1}`;
  const dots = opts.points
    ? pts.map(([x, y], i) => `<circle class="zak-chart__point" cx="${nf(x)}" cy="${nf(y)}" r="3.5" fill="${color}"><title>${opts.labels?.[i] ?? ''}: ${values[i]}</title></circle>`).join('')
    : '';
  return `<svg class="zak-chart__svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Area chart">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${color}" stop-opacity="0.45"/>
      <stop offset="1" stop-color="${color}" stop-opacity="0.02"/>
    </linearGradient></defs>${markup}
    <polygon class="zak-chart__area" fill="url(#${id})" points="${area}"/>
    <polyline class="zak-chart__line" stroke="${color}" points="${line}"/>${dots}</svg>`;
}

/** Vertical bar chart. */
export function barChart(items: Array<{ label: string; value: number; color?: string }>, opts: SeriesBox = {}): string {
  const width = opts.width ?? 620;
  const height = opts.height ?? 240;
  const max = niceMax(items.map((i) => i.value));
  const { markup, x0, x1, y0, y1 } = axes({ width, height, grid: opts.grid !== false, max, labels: items.map((i) => i.label) });
  const slot = (x1 - x0) / items.length;
  const barW = Math.min(38, slot * 0.58);
  const bars = items
    .map((item, i) => {
      const x = x0 + slot * i + slot / 2 - barW / 2;
      const h = (item.value / max) * (y1 - y0);
      const y = y1 - h;
      return `<rect class="zak-chart__bar" x="${nf(x)}" y="${nf(y)}" width="${nf(barW)}" height="${nf(h)}" fill="${item.color ?? PALETTE[0]}"><title>${item.label}: ${item.value}</title></rect>`;
    })
    .join('');
  return `<svg class="zak-chart__svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Bar chart">${markup}${bars}</svg>`;
}

export interface Segment {
  label: string;
  value: number;
  color?: string;
}

/** Donut chart built from stroked circle segments. */
export function donutChart(segments: Segment[], opts: { size?: number; thickness?: number; center?: string; centerSub?: string } = {}): string {
  const size = opts.size ?? 220;
  const thickness = opts.thickness ?? 26;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  let offset = 0;
  const arcs = segments
    .map((seg, i) => {
      const len = (seg.value / total) * c;
      const markup = `<circle class="zak-chart__donut" cx="${cx}" cy="${cy}" r="${nf(r)}" fill="none" stroke="${seg.color ?? PALETTE[i % PALETTE.length]}" stroke-width="${thickness}" stroke-dasharray="${nf(len)} ${nf(c - len)}" stroke-dashoffset="${nf(-offset)}" stroke-linecap="butt"><title>${seg.label}: ${seg.value}%</title></circle>`;
      offset += len;
      return markup;
    })
    .join('');
  const center = opts.center
    ? `<text x="${cx}" y="${cy + 4}" text-anchor="middle" style="font: 700 1.5rem var(--zak-font-sans); fill: var(--zak-text-primary)">${opts.center}</text>
       ${opts.centerSub ? `<text x="${cx}" y="${cy + 24}" text-anchor="middle" style="font: 500 0.7rem var(--zak-font-sans); fill: var(--zak-text-tertiary)">${opts.centerSub}</text>` : ''}`
    : '';
  return `<svg class="zak-chart__svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Donut chart" style="max-width:${size}px">
    <g transform="rotate(-90 ${cx} ${cy})">${arcs}</g>${center}</svg>`;
}

/** Pie chart built from arc paths. */
export function pieChart(segments: Segment[], opts: { size?: number } = {}): string {
  const size = opts.size ?? 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let angle = -Math.PI / 2;
  const arcs = segments
    .map((seg, i) => {
      const sweep = (seg.value / total) * Math.PI * 2;
      const a0 = angle;
      const a1 = angle + sweep;
      angle = a1;
      const x0 = cx + r * Math.cos(a0);
      const y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);
      const large = sweep > Math.PI ? 1 : 0;
      const d = `M ${nf(cx)} ${nf(cy)} L ${nf(x0)} ${nf(y0)} A ${r} ${r} 0 ${large} 1 ${nf(x1)} ${nf(y1)} Z`;
      return `<path class="zak-chart__donut" d="${d}" fill="${seg.color ?? PALETTE[i % PALETTE.length]}" stroke="var(--zak-bg-surface)" stroke-width="2"><title>${seg.label}: ${seg.value}%</title></path>`;
    })
    .join('');
  return `<svg class="zak-chart__svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Pie chart" style="max-width:${size}px">${arcs}</svg>`;
}

/** Legend markup helper. */
export function legend(segments: Segment[]): string {
  return `<ul class="zak-legend">${segments
    .map(
      (seg, i) =>
        `<li><i class="zak-legend__swatch" style="background:${seg.color ?? PALETTE[i % PALETTE.length]}"></i>${seg.label}</li>`,
    )
    .join('')}</ul>`;
}

export { PALETTE as CHART_PALETTE };
