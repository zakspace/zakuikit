/**
 * ZAKUIKit — Chart runtime (Chart.js-shaped API, zero dependencies)
 *
 * `ZakChart.create(el | selector, config)` renders a Chart.js-style config into
 * the host as inline SVG using the builders in `lib/charts`. Nothing is baked at
 * build time: `<div data-zak-chart='{...}'></div>` hosts mount on load, on
 * `zak:refresh` and whenever new markup is injected into the document.
 *
 * config = {
 *   type: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'sparkline',
 *   data: { labels: string[], datasets: [{ label, data: number[], color }] },
 *   options: { width, height, grid, points, legend, center, centerSub, thickness, size }
 * }
 */
import {
  lineChart,
  areaChart,
  barChart,
  pieChart,
  donutChart,
  sparkline,
  legend,
  CHART_PALETTE,
  type Segment,
} from '../lib/charts';
import { setHtml } from './dom';

export interface ChartDataset {
  label?: string;
  data: number[];
  /** A token/hex, or one entry per point for bar and pie series. */
  color?: string | string[];
}

export interface ChartOptions {
  width?: number;
  height?: number;
  grid?: boolean;
  points?: boolean;
  legend?: boolean;
  center?: string;
  centerSub?: string;
  thickness?: number;
  size?: number;
}

export interface ChartConfig {
  type?: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'sparkline';
  data?: { labels?: string[]; datasets?: ChartDataset[] };
  options?: ChartOptions;
}

export interface ZakChartInstance {
  el: HTMLElement;
  readonly config: ChartConfig;
  update(config?: ChartConfig): void;
  destroy(): void;
}

const instances = new WeakMap<HTMLElement, ZakChartInstance>();
let gradientSeq = 0;

const paletteAt = (index: number): string => CHART_PALETTE[index % CHART_PALETTE.length];

function colorAt(color: string | string[] | undefined, index: number): string {
  /* Array slots may be blank, letting a series override one bar or slice only. */
  if (Array.isArray(color)) return color[index] || paletteAt(index);
  return color || paletteAt(index);
}

const datasetsOf = (config: ChartConfig): ChartDataset[] =>
  (config.data?.datasets ?? []).filter((set) => Array.isArray(set.data));

const labelsOf = (config: ChartConfig): string[] => config.data?.labels ?? [];

/** Build the SVG (plus optional legend) for a config. */
export function renderChart(config: ChartConfig): string {
  const type = config.type ?? 'line';
  const options = config.options ?? {};
  const sets = datasetsOf(config);
  const labels = labelsOf(config);
  const primary = sets[0];
  if (!primary || primary.data.length === 0) return '';

  const series = primary.data;
  const values = (set: ChartDataset): number[] => set.data;
  let svg = '';
  let tail = '';
  /** Legend rows are opt-in per type; explicit `options.legend` always wins. */
  const wantsLegend = (fallback: boolean): boolean => options.legend ?? fallback;

  if (type === 'bar') {
    svg = barChart(
      series.map((value, index) => ({
        label: labels[index] ?? String(index + 1),
        value,
        color: colorAt(primary.color, index),
      })),
      { width: options.width, height: options.height, grid: options.grid },
    );
    if (wantsLegend(false)) {
      tail = legend(
        series.map((value, index) => ({
          label: labels[index] ?? String(index + 1),
          value,
          color: colorAt(primary.color, index),
        })),
      );
    }
  } else if (type === 'pie' || type === 'donut') {
    const segments: Segment[] = series.map((value, index) => ({
      label: labels[index] ?? String(index + 1),
      value,
      color: colorAt(primary.color, index),
    }));
    const shared = { size: options.size ?? options.width };
    svg =
      type === 'pie'
        ? pieChart(segments, shared)
        : donutChart(segments, {
            ...shared,
            thickness: options.thickness,
            center: options.center,
            centerSub: options.centerSub,
          });
    if (wantsLegend(true)) tail = legend(segments);
  } else if (type === 'sparkline') {
    svg = sparkline(series, colorAt(primary.color, 0), options.width, options.height);
  } else if (type === 'area') {
    gradientSeq += 1;
    svg = areaChart(values(primary), {
      width: options.width,
      height: options.height,
      grid: options.grid,
      points: options.points,
      color: colorAt(primary.color, 0),
      labels,
      id: `zak-chart-area-${gradientSeq}`,
    });
    if (wantsLegend(sets.length > 1)) tail = legend(setNames(config));
  } else {
    const second = sets[1] ? values(sets[1]) : undefined;
    svg = lineChart(values(primary), {
      width: options.width,
      height: options.height,
      grid: options.grid,
      points: options.points,
      color: colorAt(primary.color, 0),
      labels,
      second,
    });
    if (wantsLegend(sets.length > 1)) tail = legend(setNames(config));
  }

  /* Cartesian charts fluid-fill their wrapper; pies and sparks keep pixel size. */
  const body = type === 'line' || type === 'area' || type === 'bar' ? `<div class="zak-chart">${svg}</div>` : svg;
  return body + tail;
}

function setNames(config: ChartConfig): Segment[] {
  const labels = labelsOf(config);
  return datasetsOf(config).map((set, index) => ({
    label: set.label ?? labels[index] ?? `Series ${index + 1}`,
    value: 0,
    color: colorAt(set.color, index),
  }));
}

/** Mount (or re-mount) a chart on a host element. */
export function createChart(target: HTMLElement | string, config: ChartConfig = {}): ZakChartInstance {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) throw new Error('ZakChart: host element not found');

  let current: ChartConfig = config;
  const instance: ZakChartInstance = {
    el,
    get config() {
      return current;
    },
    update(next?: ChartConfig) {
      if (next) current = next;
      setHtml(el, renderChart(current));
      el.setAttribute('data-zak-chart-type', current.type ?? 'line');
    },
    destroy() {
      instances.delete(el);
      el.removeAttribute('data-zak-chart-type');
      setHtml(el, '');
    },
  };
  instances.set(el, instance);
  instance.update();
  return instance;
}

export const getChart = (el: HTMLElement): ZakChartInstance | undefined => instances.get(el);

/** Declarative hosts: `<div data-zak-chart='{ "type": "bar", … }'></div>`. */
function parseHost(host: HTMLElement): ChartConfig | null {
  const raw = host.getAttribute('data-zak-chart') ?? '';
  if (!raw.trim()) return null;
  try {
    return JSON.parse(raw) as ChartConfig;
  } catch {
    return null;
  }
}

function mountHost(host: HTMLElement): void {
  /* Already-mounted hosts are left alone so our own writes do not re-trigger the observer. */
  if (instances.has(host)) return;
  const config = parseHost(host);
  if (config) createChart(host, config);
}

export function scanCharts(scope: ParentNode = document): void {
  Array.from(scope.querySelectorAll<HTMLElement>('[data-zak-chart]')).forEach(mountHost);
}

if (typeof document !== 'undefined') {
  const boot = (): void => scanCharts(document);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  document.addEventListener('zak:refresh', (event) => {
    const root = (event as CustomEvent<{ root?: HTMLElement }>).detail?.root;
    scanCharts(root ?? document);
  });

  /* Injected markup (playground re-renders, partials) mounts without an init call. */
  let settle = 0;
  new MutationObserver(() => {
    window.clearTimeout(settle);
    settle = window.setTimeout(boot, 120);
  }).observe(document.body, { childList: true, subtree: true });
}
