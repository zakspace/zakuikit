/**
 * Demos — Data Visualization: line, bar, area, pie and donut charts,
 * sparklines, KPI cards and the dashboard widget grid.
 *
 * Charts are no longer baked at build time: every preview is a `data-zak-chart`
 * host that the runtime (`scripts/charts.ts`) mounts with a Chart.js-shaped
 * config object. The same object is accepted by `ZakChart.create()`.
 */
import { defineDemo, type DemoDef } from './types';
import { svgIcon } from '../data/icons';
import { series } from '../data/people';

const arrowUpI = svgIcon('arrow-up', 'zak-icon', 12);
const arrowDownI = svgIcon('arrow-down', 'zak-icon', 12);
const refreshI = svgIcon('refresh', 'zak-icon', 14);
const externalI = svgIcon('external', 'zak-icon', 13);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const latency = series(3, 12, 58, 20);
const baseline = series(8, 12, 26, 9);
const requests = series(11, 24, 55, 38);

type Cfg = Record<string, unknown>;

/** Serialise a config for a single-quoted HTML attribute. */
const attr = (cfg: Cfg): string => JSON.stringify(cfg).replace(/'/g, '&#39;');
const host = (cfg: Cfg, style = 'width:100%'): string =>
  `<div style="${style}" data-zak-chart='${attr(cfg)}'></div>`;

const lineConfig: Cfg = {
  type: 'line',
  data: {
    labels: months,
    datasets: [
      { label: 'p95 · this year', data: latency, color: 'var(--zak-chart-1)' },
      { label: 'p95 · last year (dashed)', data: baseline, color: 'var(--zak-chart-2)' },
    ],
  },
  options: { grid: true, points: true, legend: true },
};

const barConfig: Cfg = {
  type: 'bar',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Deploys',
        data: [14, 22, 18, 26, 31, 9, 6],
        color: ['', '', '', '', 'var(--zak-chart-3)', '', ''],
      },
    ],
  },
  options: { legend: false },
};

const areaConfig: Cfg = {
  type: 'area',
  data: {
    labels: ['00', '04', '08', '12', '16', '20'],
    datasets: [{ label: 'Requests / min', data: requests, color: 'var(--zak-chart-1)' }],
  },
  options: { grid: true, points: true, legend: false },
};

const pieConfig: Cfg = {
  type: 'pie',
  data: {
    labels: ['Organic search', 'Paid campaigns', 'Referral', 'Direct'],
    datasets: [{ data: [44, 26, 18, 12] }],
  },
  options: { size: 200, legend: true },
};

const donutConfig: Cfg = {
  type: 'donut',
  data: {
    labels: ['Documents · 680 GB', 'Media · 440 GB', 'Backups · 240 GB', 'Free · 640 GB'],
    datasets: [
      {
        data: [34, 22, 12, 32],
        color: ['var(--zak-chart-1)', 'var(--zak-chart-2)', 'var(--zak-chart-3)', 'var(--zak-bg-active)'],
      },
    ],
  },
  options: { size: 200, thickness: 24, center: '68%', centerSub: 'of 2 TB used', legend: true },
};

const spark = (seed: number, base: number, wave: number, color: string): Cfg => ({
  type: 'sparkline',
  data: { datasets: [{ data: series(seed, 16, base, wave), color }] },
});

export const datavizDemos: Record<string, DemoDef> = {
  'line-chart': defineDemo({
    desc: 'The workhorse trend chart. The preview is an empty host — the runtime reads its `data-zak-chart` config and paints the SVG, grid, points and legend.',
    stage: 'stretch',
    tpl: `<figure class="zak-widget" style="margin:0;width:100%;max-width:44rem">
    <div class="zak-widget__head">
      <span class="zak-widget__title">API latency</span>
      <span class="zak-badge zak-badge--counter">p95</span>
      <div class="zak-widget__actions">
        <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button" style="background:var(--zak-bg-active)">12M</button>
        <button class="zak-btn zak-btn--ghost zak-btn--sm" type="button">30D</button>
        <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Open in explorer">${externalI}</button>
      </div>
    </div>
    <div class="zak-widget__body">
      ${host(lineConfig)}
    </div>
  </figure>`,
    codeTpl: `<!-- Minimal markup: one host, one config. The runtime mounts every [data-zak-chart] it finds -->
<div data-zak-chart='{"type":"line","data":{"labels":["Jan","Feb","Mar"],"datasets":[{"label":"p95","data":[58,44,51]}]}}'></div>

<!-- The same config through the public API -->
<script>
  const chart = ZakChart.create('#latency', {
    // type: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'sparkline'
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [
        { label: 'p95 · this year', data: [58, 44, 51], color: 'var(--zak-chart-1)' },
        // A second dataset is drawn as the dashed comparison line
        { label: 'p95 · last year', data: [70, 66, 62], color: 'var(--zak-chart-2)' },
      ],
    },
    options: { width: 620, height: 240, grid: true, points: true, legend: true },
  });

  // Re-render with new data, or remove the chart from the host
  chart.update({ type: 'line', data: { datasets: [{ data: [30, 28, 24] }] } });
  chart.destroy();
</script>`,
    props: [
      ['type', "'line'", '—', 'Chart family; the SVG is generated from the config.'],
      ['data.labels', 'string[]', '—', 'X-axis ticks, distributed evenly across the plot.'],
      ['data.datasets', '{ label, data, color }[]', '—', 'Series list; index 0 is primary, index 1 is dashed.'],
      ['options.points', 'boolean', 'true', 'Hoverable points with native <title> tooltips.'],
      ['options.grid', 'boolean', 'true', 'Horizontal grid lines and y-axis value labels.'],
      ['options.legend', 'boolean', 'auto', 'Legend row built from the dataset labels.'],
      ['options.width / height', 'number', '620 / 240', 'SVG viewBox; the host scales it fluidly.'],
    ],
    a11y: {
      aria: [
        ['role="img" + aria-label', 'Summarise the story: "p95 latency trending down 18%".'],
        ['<title> per point', 'Native tooltips are also announced by screen readers.'],
        ['data table fallback', 'Pair each chart with a visually hidden table for tabular readers.'],
      ],
    },
  }),
  'bar-chart': defineDemo({
    desc: 'Discrete comparisons on a shared scale. A per-index colour in the dataset pulls the eye to the release day without a second series.',
    stage: 'stretch',
    tpl: `<figure class="zak-widget" style="margin:0;width:100%;max-width:44rem">
    <div class="zak-widget__head">
      <span class="zak-widget__title">Deploys per day</span>
      <span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>+18% this week</span>
      <div class="zak-widget__actions">
        <span class="zak-badge">Avg 18/day</span>
      </div>
    </div>
    <div class="zak-widget__body">
      ${host(barConfig)}
    </div>
  </figure>`,
    codeTpl: `<div data-zak-chart='{"type":"bar","data":{"labels":["Mon","Tue","Fri"],"datasets":[{"data":[14,22,31]}]}}'></div>

<script>
ZakChart.create('#deploys', {
  type: 'bar',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Deploys',
        data: [14, 22, 18, 26, 31, 9, 6],
        // color may be one token, or one entry per bar — empty slots fall back to the palette
        color: ['', '', '', '', 'var(--zak-chart-3)', '', ''],
      },
    ],
  },
  options: { legend: false, grid: true },
});
</script>

<!-- Bars dim to 0.78 opacity on hover; each rect keeps a <title> tooltip -->`,
    props: [
      ['type', "'bar'", '—', 'Vertical bars; one rect per label/value pair.'],
      ['data.labels', 'string[]', '—', 'Category captions under each bar slot.'],
      ['data.datasets[].data', 'number[]', '—', 'Bar heights; y-max snaps to a nice step.'],
      ['data.datasets[].color', 'string | string[]', 'palette', 'One token, or a per-bar colour array for emphasis.'],
      ['options.legend', 'boolean', 'false', 'Bar charts label their axis instead of repeating a legend.'],
    ],
  }),
  'area-chart': defineDemo({
    desc: 'A line with a translucent gradient fill — for volumes where the magnitude under the curve matters as much as the trend. Gradient ids are generated per host.',
    stage: 'stretch',
    tpl: `<figure class="zak-widget" style="margin:0;width:100%;max-width:44rem">
    <div class="zak-widget__head">
      <span class="zak-widget__title">Requests per minute</span>
      <div class="zak-widget__actions">
        <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Refresh chart">${refreshI}</button>
      </div>
    </div>
    <div class="zak-widget__body">
      ${host(areaConfig)}
    </div>
  </figure>`,
    codeTpl: `<script>
ZakChart.create('#rpm', {
  type: 'area',
  data: {
    labels: ['00', '04', '08', '12', '16', '20'],
    datasets: [{ label: 'Requests / min', data: [55, 62, 48, 71, 66, 84], color: 'var(--zak-chart-1)' }],
  },
  // options.points adds dots; the fill gradient (45% crest → 2% baseline) is automatic
  options: { points: true, grid: true, legend: false },
});
</script>

<!-- Declarative equivalent -->
<div data-zak-chart='{"type":"area","data":{"labels":["00","04","08"],"datasets":[{"data":[55,62,48]}]},"options":{"points":true}}'></div>

<!-- Area fills suggest accumulated volume — never stack more than two translucent areas -->`,
    props: [
      ['type', "'area'", '—', 'Line plus a generated gradient fill.'],
      ['data.datasets[].data', 'number[]', '—', 'Values plotted left to right.'],
      ['data.datasets[].color', 'token', 'var(--zak-chart-1)', 'Drives both the stroke and the gradient stops.'],
      ['options.points', 'boolean', 'false', 'Optional dots for sparse series.'],
      ['options.grid', 'boolean', 'true', 'Grid lines and axis labels.'],
    ],
    notes: ['Area fills suggest accumulated volume — never stack more than two translucent areas without explicit stacking math.'],
  }),
  'pie-chart': defineDemo({
    desc: 'Whole-to-part at a glance for five slices or fewer. Slice colours come from the palette unless the dataset overrides them; the legend is generated with the chart.',
    stage: 'stretch',
    tpl: `<figure class="zak-widget" style="margin:0;width:100%;max-width:40rem">
    <div class="zak-widget__head">
      <span class="zak-widget__title">Traffic sources</span>
      <span class="zak-badge">Last 30 days</span>
    </div>
    <div class="zak-widget__body">
      <div style="display:flex;align-items:center;gap:var(--zak-space-6);flex-wrap:wrap">
        ${host(pieConfig, 'flex:0 0 auto')}
      </div>
    </div>
  </figure>`,
    codeTpl: `<script>
ZakChart.create('#sources', {
  type: 'pie',
  data: {
    // labels name the slices; the legend is built from them
    labels: ['Organic search', 'Paid campaigns', 'Referral', 'Direct'],
    datasets: [{ data: [44, 26, 18, 12] }],
  },
  options: { size: 200, legend: true },
});
</script>

<!-- Declarative equivalent, colours explicit -->
<div data-zak-chart='{"type":"pie","data":{"labels":["A","B"],"datasets":[{"data":[70,30],"color":["var(--zak-chart-1)","var(--zak-chart-2)"]}]},"options":{"size":180}}'></div>

<!-- Beyond five slices, switch to a bar chart — it compares better -->`,
    props: [
      ['type', "'pie'", '—', 'Arc paths normalised to the dataset total.'],
      ['data.labels', 'string[]', '—', 'Slice names, used for tooltips and the legend.'],
      ['data.datasets[].data', 'number[]', '—', 'Values normalise to 100% — raw counts work too.'],
      ['options.size', 'number', '220', 'Viewport size in px; the legend flexes beside it.'],
      ['options.legend', 'boolean', 'true', 'Generated `.zak-legend` list with a swatch per slice.'],
    ],
    notes: ['Beyond five slices, switch to a bar chart — it compares better and never hides a tiny wedge.'],
  }),
  'donut-chart': defineDemo({
    desc: 'The pie with a centre stage: `options.center` and `centerSub` render a headline metric inside the ring. Segments hover-grow for a tactile scrub.',
    stage: 'stretch',
    tpl: `<figure class="zak-widget" style="margin:0;width:100%;max-width:40rem">
    <div class="zak-widget__head">
      <span class="zak-widget__title">Storage usage</span>
      <span class="zak-badge zak-badge--warning">72% of plan</span>
    </div>
    <div class="zak-widget__body">
      <div style="display:flex;align-items:center;gap:var(--zak-space-6);flex-wrap:wrap">
        ${host(donutConfig, 'flex:0 0 auto')}
      </div>
    </div>
  </figure>`,
    codeTpl: `<script>
ZakChart.create('#storage', {
  type: 'donut',
  data: {
    labels: ['Documents · 680 GB', 'Media · 440 GB', 'Backups · 240 GB', 'Free · 640 GB'],
    datasets: [
      {
        data: [34, 22, 12, 32],
        color: ['var(--zak-chart-1)', 'var(--zak-chart-2)', 'var(--zak-chart-3)', 'var(--zak-bg-active)'],
      },
    ],
  },
  options: {
    size: 200,
    thickness: 24,      // ring stroke width
    center: '68%',      // headline inside the ring
    centerSub: 'of 2 TB used',
    legend: true,
  },
});
</script>

<!-- Declarative equivalent -->
<div data-zak-chart='{"type":"donut","data":{"labels":["Used","Free"],"datasets":[{"data":[68,32]}]},"options":{"center":"68%","thickness":24}}'></div>`,
    props: [
      ['type', "'donut'", '—', 'Stroked-circle segments rotated −90° from the top.'],
      ['options.center / centerSub', 'string', '—', 'Headline value and caption rendered inside the ring.'],
      ['options.thickness', 'number', '26', 'Ring stroke width; radius derives from size − thickness.'],
      ['options.size', 'number', '220', 'Diameter in px.'],
      ['data.datasets[].color', 'string[]', 'palette', 'One entry per segment.'],
    ],
  }),
  sparkline: defineDemo({
    desc: 'Inline micro-charts for tables and lists: no axes, no labels, just the shape of the last N values. Each host is a `<span class="zak-sparkline">`.',
    stage: 'stretch',
    tpl: `<div style="width:100%;max-width:42rem;border:1px solid var(--zak-border-subtle);border-radius:var(--zak-radius-lg);background:var(--zak-bg-surface);overflow:hidden">
    <div style="display:flex;align-items:center;gap:var(--zak-space-4);padding:var(--zak-space-3) var(--zak-space-4);border-block-end:1px solid var(--zak-border-subtle)">
      <span style="flex:1;font-size:var(--zak-text-sm);font-weight:var(--zak-weight-medium)">API gateway</span>
      <span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Healthy</span>
      <span style="font-size:var(--zak-text-xs);color:var(--zak-text-tertiary);font-variant-numeric:tabular-nums;width:4rem;text-align:right">42 ms</span>
      <span class="zak-sparkline" data-zak-chart='${attr(spark(2, 42, 22, 'var(--zak-chart-2)'))}'></span>
    </div>
    <div style="display:flex;align-items:center;gap:var(--zak-space-4);padding:var(--zak-space-3) var(--zak-space-4);border-block-end:1px solid var(--zak-border-subtle)">
      <span style="flex:1;font-size:var(--zak-text-sm);font-weight:var(--zak-weight-medium)">Grid runtime</span>
      <span class="zak-badge zak-badge--warning"><span class="zak-badge__dot"></span>Degraded</span>
      <span style="font-size:var(--zak-text-xs);color:var(--zak-text-tertiary);font-variant-numeric:tabular-nums;width:4rem;text-align:right">186 ms</span>
      <span class="zak-sparkline" data-zak-chart='${attr(spark(6, 90, 55, 'var(--zak-chart-6)'))}'></span>
    </div>
    <div style="display:flex;align-items:center;gap:var(--zak-space-4);padding:var(--zak-space-3) var(--zak-space-4);border-block-end:1px solid var(--zak-border-subtle)">
      <span style="flex:1;font-size:var(--zak-text-sm);font-weight:var(--zak-weight-medium)">AI streaming</span>
      <span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Healthy</span>
      <span style="font-size:var(--zak-text-xs);color:var(--zak-text-tertiary);font-variant-numeric:tabular-nums;width:4rem;text-align:right">64 ms</span>
      <span class="zak-sparkline" data-zak-chart='${attr(spark(4, 50, 18, 'var(--zak-chart-3)'))}'></span>
    </div>
    <div style="display:flex;align-items:center;gap:var(--zak-space-4);padding:var(--zak-space-3) var(--zak-space-4)">
      <span style="flex:1;font-size:var(--zak-text-sm);font-weight:var(--zak-weight-medium)">Search index</span>
      <span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Healthy</span>
      <span style="font-size:var(--zak-text-xs);color:var(--zak-text-tertiary);font-variant-numeric:tabular-nums;width:4rem;text-align:right">28 ms</span>
      <span class="zak-sparkline" data-zak-chart='${attr(spark(1, 32, 12, 'var(--zak-chart-1)'))}'></span>
    </div>
  </div>`,
    codeTpl: `<!-- Inline host: .zak-sparkline fixes the 110 × 34 box, the svg stretches to fill it -->
<span class="zak-sparkline" data-zak-chart='{"type":"sparkline","data":{"datasets":[{"data":[38,42,36,51,47,58,54,62]}]}}'></span>

<script>
ZakChart.create('#service-spark', {
  type: 'sparkline',
  data: { datasets: [{ data: [38, 42, 36, 51, 47, 58], color: 'var(--zak-chart-2)' }] },
  options: { width: 110, height: 34 },
});
</script>

<!-- Trend direction: the 0.16-opacity area keeps the line dominant at small sizes -->`,
    props: [
      ['type', "'sparkline'", '—', 'Polyline plus translucent area, no axes.'],
      ['data.datasets[].data', 'number[]', '—', 'Last N values, plotted left to right.'],
      ['data.datasets[].color', 'token', 'var(--zak-chart-1)', 'Stroke and area fill.'],
      ['options.width / height', 'number', '110 / 34', 'Intrinsic size; `.zak-sparkline` scales it.'],
      ['.zak-sparkline', 'class', '110×34', 'Inline wrapper host.'],
    ],
    notes: ['Sparklines show shape, never values — always print the latest number next to one.'],
  }),
  'kpi-card': defineDemo({
    desc: 'The metric tile: uppercase label with an inline spark, a large tabular value and a coloured delta. The spark is a chart host like any other.',
    stage: 'stretch',
    tpl: `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(13rem,1fr));gap:var(--zak-space-4);width:100%;max-width:46rem">
    <div class="zak-kpi">
      <div class="zak-kpi__head">MRR <span class="zak-kpi__spark"><span class="zak-sparkline" data-zak-chart='${attr(spark(5, 60, 24, 'var(--zak-chart-1)'))}'></span></span></div>
      <div class="zak-kpi__value">$48.2k</div>
      <div class="zak-kpi__delta zak-kpi__delta--up">${arrowUpI} +12.4% vs last month</div>
    </div>
    <div class="zak-kpi">
      <div class="zak-kpi__head">Active seats <span class="zak-kpi__spark"><span class="zak-sparkline" data-zak-chart='${attr(spark(9, 45, 20, 'var(--zak-chart-2)'))}'></span></span></div>
      <div class="zak-kpi__value">1,284</div>
      <div class="zak-kpi__delta zak-kpi__delta--up">${arrowUpI} +3.1% this week</div>
    </div>
    <div class="zak-kpi">
      <div class="zak-kpi__head">Error rate <span class="zak-kpi__spark"><span class="zak-sparkline" data-zak-chart='${attr(spark(7, 38, 30, 'var(--zak-chart-6)'))}'></span></span></div>
      <div class="zak-kpi__value">0.42%</div>
      <div class="zak-kpi__delta zak-kpi__delta--up">${arrowDownI} −0.08 pts after the patch</div>
    </div>
  </div>`,
    codeTpl: `<div class="zak-kpi">
  <!-- Head: uppercase micro-label; the spark host pins to the trailing edge -->
  <div class="zak-kpi__head">MRR
    <span class="zak-kpi__spark">
      <span class="zak-sparkline" data-zak-chart='{"type":"sparkline","data":{"datasets":[{"data":[40,44,42,49,52,58]}]}}'></span>
    </span>
  </div>

  <!-- Value: 3xl tabular numerals so KPI columns align vertically -->
  <div class="zak-kpi__value">$48.2k</div>

  <!-- Delta variants: up and down use semantic colour, always paired with an arrow -->
  <div class="zak-kpi__delta zak-kpi__delta--up">▲ +12.4% vs last month</div>
  <div class="zak-kpi__delta zak-kpi__delta--down">▼ -0.08 pts after the patch</div>
</div>

<!-- Hover lift: translateY(-2px) plus shadow-md, an affordance not decoration -->`,
    props: [
      ['.zak-kpi__head', 'class', '—', 'Uppercase micro-label; the spark pins to the trailing edge.'],
      ['.zak-kpi__value', 'class', '—', '3xl tabular numerals — columns of KPIs align vertically.'],
      ['.zak-kpi__delta--up / --down', 'modifier', '—', 'Semantic colour for direction; pair with an arrow icon.'],
      ['data-zak-chart', 'attr', '—', 'The inline spark uses the same chart config as every other host.'],
    ],
    notes: ['Colour the delta by goodness, not math: a falling error rate is green even though the arrow points down.'],
  }),
  'dashboard-widget': defineDemo({
    desc: 'The composition layer: a 12-column dash grid where widgets span 3/4/6/8/12 columns. Every chart inside is a declarative host mounted by the runtime.',
    stage: 'stretch',
    tpl: `<div class="zak-dash" style="width:100%">
    <div class="zak-widget span-8">
      <div class="zak-widget__head">
        <span class="zak-widget__title">Requests per minute</span>
        <span class="zak-badge zak-badge--success"><span class="zak-badge__dot"></span>Live</span>
        <div class="zak-widget__actions">
          <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Refresh">${refreshI}</button>
        </div>
      </div>
      <div class="zak-widget__body">${host(areaConfig)}</div>
    </div>

    <div class="zak-widget span-4">
      <div class="zak-widget__head"><span class="zak-widget__title">Sessions by device</span></div>
      <div class="zak-widget__body" style="display:flex;flex-direction:column;align-items:center;gap:var(--zak-space-3)">
        ${host({
          type: 'donut',
          data: {
            labels: ['Desktop · 52%', 'Mobile · 34%', 'Tablet · 14%'],
            datasets: [{ data: [52, 34, 14] }],
          },
          options: { size: 156, thickness: 20, center: '52%', centerSub: 'desktop', legend: true },
        }, 'width:100%;max-width:10rem')}
      </div>
    </div>

    <div class="zak-widget span-6">
      <div class="zak-widget__head"><span class="zak-widget__title">Top pages</span><span class="zak-badge">7 days</span></div>
      <div class="zak-widget__body">
        <div class="zak-stack zak-stack--md">
          <div>
            <div class="zak-flex" style="font-size:var(--zak-text-sm);margin-block-end:var(--zak-space-1)"><span>/docs/data-grid</span><span style="margin-inline-start:auto;color:var(--zak-text-tertiary);font-variant-numeric:tabular-nums">18.4k</span></div>
            <span class="zak-progress zak-progress--sm"><span class="zak-progress__bar" style="--value:92%"></span></span>
          </div>
          <div>
            <div class="zak-flex" style="font-size:var(--zak-text-sm);margin-block-end:var(--zak-space-1)"><span>/docs/ai/prompt-input</span><span style="margin-inline-start:auto;color:var(--zak-text-tertiary);font-variant-numeric:tabular-nums">14.1k</span></div>
            <span class="zak-progress zak-progress--sm"><span class="zak-progress__bar" style="--value:71%"></span></span>
          </div>
          <div>
            <div class="zak-flex" style="font-size:var(--zak-text-sm);margin-block-end:var(--zak-space-1)"><span>/docs/tokens</span><span style="margin-inline-start:auto;color:var(--zak-text-tertiary);font-variant-numeric:tabular-nums">9.6k</span></div>
            <span class="zak-progress zak-progress--sm"><span class="zak-progress__bar" style="--value:48%"></span></span>
          </div>
          <div>
            <div class="zak-flex" style="font-size:var(--zak-text-sm);margin-block-end:var(--zak-space-1)"><span>/docs/overlays/modal</span><span style="margin-inline-start:auto;color:var(--zak-text-tertiary);font-variant-numeric:tabular-nums">7.2k</span></div>
            <span class="zak-progress zak-progress--sm"><span class="zak-progress__bar" style="--value:36%"></span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="zak-widget span-6">
      <div class="zak-widget__head"><span class="zak-widget__title">Deploys per day</span><span class="zak-badge">This week</span></div>
      <div class="zak-widget__body">
        ${host({
          type: 'bar',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [{ label: 'Deploys', data: [14, 22, 18, 26, 31], color: ['', '', '', '', 'var(--zak-chart-3)'] }],
          },
          options: { height: 190, grid: true, legend: false },
        })}
      </div>
    </div>
  </div>`,
    codeTpl: `<!-- .zak-dash: 12-column grid, 1rem gaps, auto-collapses under 900px -->
<div class="zak-dash">
  <!-- Span utilities: direct children span 3 / 4 / 6 / 8 / 12 columns -->
  <div class="zak-widget span-8">
    <!-- Widget head and body: fixed head with an actions slot; fluid padded body -->
    <div class="zak-widget__head">
      <span class="zak-widget__title">Requests per minute</span>
      <div class="zak-widget__actions">
        <button class="zak-btn zak-btn--ghost zak-btn--icon zak-btn--sm" type="button" aria-label="Refresh">⟳</button>
      </div>
    </div>
    <div class="zak-widget__body">
      <!-- Charts are hosts; the runtime paints them after the grid is in the DOM -->
      <div data-zak-chart='{"type":"area","data":{"labels":["00","04","08"],"datasets":[{"data":[55,62,48]}]}}'></div>
    </div>
  </div>

  <div class="zak-widget span-4">
    <div class="zak-widget__head"><span class="zak-widget__title">Sessions by device</span></div>
    <div class="zak-widget__body">…</div>
  </div>
</div>

<!-- Glass variant: .zak-widget--glass for surfaces floating over media -->`,
    props: [
      ['.zak-dash', 'class', '—', '12-column grid, 1rem gaps, auto-collapses under 900px.'],
      ['.span-3 / .span-4 / .span-6 / .span-8 / .span-12', 'utility', '—', 'Direct children span the dashboard columns.'],
      ['.zak-widget__head + __body', 'element', '—', 'Fixed head with actions slot; fluid padded body.'],
      ['.zak-widget--glass', 'modifier', '—', 'Translucent variant for widgets floating over media.'],
      ['data-zak-chart', 'attr', '—', 'Each widget body holds a declarative chart host.'],
    ],
    notes: ['Dashboards mix chart types deliberately: area for flow, donut for composition, bars for comparison, lists for ranking — never three line charts in a row.'],
  }),
};
