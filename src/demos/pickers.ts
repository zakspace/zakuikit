/**
 * Demos — Pickers: calendar, color, date, time, range, week, month, year.
 * The eight input-based pickers ship as a single line of markup: a bare
 * `<input>` with one `data-zak-*picker` attribute. The runtime generates the
 * form-field chrome, the toggle button and the floating panel, and opens it
 * when the field receives focus. Calendar and Color Picker also work as
 * standalone generated containers.
 */
import { defineDemo, type DemoDef } from './types';

export const pickerDemos: Record<string, DemoDef> = {
  calendar: defineDemo({
    desc: 'A generated calendar surface in one container. Declaring `data-zak-calendar` is the only markup — the runtime builds the month grid, weekday row and day cells; the surrounding field and floating panel are the standard picker chrome. Choosing a day writes the formatted value back and closes the panel.',
    tpl: `<div class="zak-picker-field zak-field--outlined" style="width:19rem">
  <div class="zak-field">
    <label class="zak-label" for="cal-input">Delivery date</label>
    <div class="zak-input-wrap zak-input-wrap--suffix">
      <input class="zak-input" id="cal-input" value="18 Jun 2026" readonly data-zak-picker-value aria-haspopup="dialog" aria-expanded="false"/>
      <button class="zak-input-wrap__btn" type="button" aria-label="Open calendar" data-zak-picker-toggle aria-expanded="false"><svg class="zak-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></button>
    </div>
    <span class="zak-hint">Focus or click the field to open the calendar.</span>
  </div>
  <div class="zak-picker-anchor">
    <div class="zak-picker-panel" style="width:18rem" hidden>
      <div data-zak-calendar="2026-06-18" data-zak-cal-today="2026-06-17"></div>
      <div class="zak-picker-panel__foot">
        <span class="zak-hint" data-zak-picker-text>18 Jun 2026</span>
        <button class="zak-btn zak-btn--text zak-btn--sm" type="button" data-zak-picker-clear>Clear</button>
      </div>
    </div>
  </div>
</div>`,
    codeTpl: `<!-- Generated container: the grid is built from one attribute -->
<div data-zak-calendar="2026-06-18" data-zak-cal-today="2026-06-17"></div>

<!-- Inside a picker field: value writes back to the sink input -->
<div class="zak-picker-field zak-field--outlined">
  <div class="zak-field">
    <label class="zak-label" for="cal-input">Delivery date</label>
    <input class="zak-input" id="cal-input" readonly data-zak-picker-value/>
  </div>
  <div class="zak-picker-anchor">
    <div class="zak-picker-panel" hidden>
      <div data-zak-calendar="2026-06-18" data-zak-cal-today="2026-06-17"></div>
    </div>
  </div>
</div>

<!-- Range: two endpoints from one container -->
<div data-zak-calendar="2026-06-09..2026-06-24" data-zak-cal-select="range" data-zak-cal-months="2"></div>`,
    examples: [
      {
        title: 'Single month grid',
        desc: 'One attribute generates the header, weekday row and 42 day cells.',
        tpl: `<div data-zak-calendar="2026-06-18" data-zak-cal-today="2026-06-17"></div>`,
        code: `<div data-zak-calendar="2026-06-18" data-zak-cal-today="2026-06-17"></div>`,
      },
      {
        title: 'Range selection',
        desc: '`data-zak-cal-select="range"` turns the grid into a two-endpoint picker; `--months="2"` shows a span side by side.',
        tpl: `<div data-zak-calendar="2026-06-09..2026-06-24" data-zak-cal-select="range" data-zak-cal-months="2" data-zak-cal-today="2026-06-17"></div>`,
        code: `<div data-zak-calendar="2026-06-09..2026-06-24"
     data-zak-cal-select="range"
     data-zak-cal-months="2"
     data-zak-cal-today="2026-06-17"></div>`,
      },
      {
        title: 'Weeks view',
        desc: '`data-zak-cal-view="weeks"` lists ISO week rows instead of a day grid.',
        tpl: `<div data-zak-calendar="2026-06-15" data-zak-cal-view="weeks" data-zak-cal-weeks="6" data-zak-cal-today="2026-06-17"></div>`,
        code: `<div data-zak-calendar="2026-06-15"
     data-zak-cal-view="weeks"
     data-zak-cal-weeks="6"
     data-zak-cal-today="2026-06-17"></div>`,
      },
      {
        title: 'Min / max bounds',
        desc: 'Days outside the bounds render disabled and stay out of the tab order.',
        tpl: `<div data-zak-calendar="2026-06-18" data-zak-cal-min="2026-06-01" data-zak-cal-max="2026-06-30" data-zak-cal-today="2026-06-17"></div>`,
        code: `<div data-zak-calendar="2026-06-18"
     data-zak-cal-min="2026-06-01"
     data-zak-cal-max="2026-06-30"
     data-zak-cal-today="2026-06-17"></div>`,
      },
    ],
    props: [
      ['data-zak-calendar', 'string', '—', 'ISO seed date: "2026-06-18" or range "2026-06-09..2026-06-24".'],
      ['data-zak-cal-view', '"month" | "weeks" | "months" | "years"', 'month', 'Calendar view mode.'],
      ['data-zak-cal-select', '"single" | "range"', 'single', 'Selection mode: single date or date range.'],
      ['data-zak-cal-today', 'string', 'system date', 'Override "today" for deterministic docs.'],
      ['data-zak-cal-months', 'number', '1', 'Number of month grids side by side (1–2).'],
      ['data-zak-cal-weeks', 'number', '6', 'Row count for weeks view.'],
      ['data-zak-cal-min', 'string', '—', 'Minimum selectable date (ISO).'],
      ['data-zak-cal-max', 'string', '—', 'Maximum selectable date (ISO).'],
      ['data-zak-picker-value', 'attr', '—', 'Input sink — receives formatted selection.'],
      ['data-zak-picker-text', 'attr', '—', 'Text sink — receives human-readable selection.'],
      ['.zak-field--{variant}', 'modifier', 'outlined', 'Field surface: filled · outlined · underline · ghost.'],
    ],
    notes: [
      'Prefer the one-line field form: <input class="zak-input" data-zak-datepicker> generates all of this at runtime.',
      'Day cells keep `tabindex="-1"` — the grid implements a single roving tab stop; arrows move focus.',
      'Weekday headers are `aria-hidden`; each day cell carries its full date as the accessible name.',
    ],
  }),
  'color-picker': defineDemo({
    desc: 'A hex field wired to a palette generated at runtime from `data-zak-colors`. Focusing the field opens the floating palette; preview, RGB readout, field value and the trigger dot all follow the active swatch or the hue rail — no swatch markup in page code.',
    tpl: `<div class="zak-picker-field zak-field--outlined" style="width:16rem">
  <div class="zak-field">
    <label class="zak-label" for="cp-input">Brand color</label>
    <div class="zak-input-wrap zak-input-wrap--suffix">
      <input class="zak-input" id="cp-input" value="#6366F1" readonly data-zak-picker-value aria-haspopup="dialog" aria-expanded="false"/>
      <button class="zak-input-wrap__btn" type="button" aria-label="Open palette" data-zak-picker-toggle aria-expanded="false"><span class="zak-color-trigger" data-zak-color-trigger></span></button>
    </div>
    <span class="zak-hint">Focus the field to open the palette.</span>
  </div>
  <div class="zak-picker-anchor">
    <div class="zak-picker-panel" hidden>
      <div class="zak-colorpicker" data-zak-colorpicker data-zak-colors="#6366f1,#8b5cf6,#a855f7,#d946ef,#f43f5e,#f59e0b,#10b981,#06b6d4,#0ea5e9,#3b82f6,#64748b,#0f172a,#7c3aed,#14b8a6,#eab308,#f8fafc"></div>
    </div>
  </div>
</div>`,
    codeTpl: `<!-- Minimal: one input, palette + field + panel generated at runtime -->
<input type="text" class="zak-input" data-zak-colorpicker data-zak-colors="#6366f1,#8b5cf6,#10b981,#f59e0b" value="#6366F1">

<!-- Generated container form (panel demos): palette only -->
<div data-zak-colorpicker data-zak-colors="#6366f1,#8b5cf6,#10b981,#f59e0b,#ef4444"></div>`,
    examples: [
      {
        title: 'One-line input',
        desc: 'The runtime builds the field chrome, the trigger dot and the floating palette from the attribute list.',
        tpl: `<input type="text" class="zak-input" data-zak-colorpicker data-zak-picker-label="Accent color" data-zak-colors="#6366f1,#8b5cf6,#a855f7,#f43f5e,#f59e0b,#10b981,#0ea5e9,#64748b" value="#6366F1">`,
        code: `<input type="text" class="zak-input" data-zak-colorpicker
       data-zak-picker-label="Accent color"
       data-zak-colors="#6366f1,#8b5cf6,#a855f7,#f43f5e,#f59e0b,#10b981,#0ea5e9,#64748b"
       value="#6366F1">`,
      },
      {
        title: 'Default palette',
        desc: 'Omit `data-zak-colors` and the built-in ramp is used.',
        tpl: `<input type="text" class="zak-input" data-zak-colorpicker data-zak-picker-label="Tag color" placeholder="Pick a color">`,
        code: `<input type="text" class="zak-input" data-zak-colorpicker data-zak-picker-label="Tag color">`,
      },
      {
        title: 'Container only',
        desc: 'In a panel or popover, use the container form — swatch grid plus hue rail, no field wrapper.',
        tpl: `<div data-zak-colorpicker data-zak-colors="#6366f1,#8b5cf6,#10b981,#f59e0b,#ef4444"></div>`,
        code: `<div data-zak-colorpicker data-zak-colors="#6366f1,#8b5cf6,#10b981,#f59e0b,#ef4444"></div>`,
      },
    ],
    props: [
      ['data-zak-colorpicker', 'attr', '—', 'On an input: generates the picker field + floating palette.'],
      ['data-zak-colors', 'string', 'built-in ramp', 'Comma-separated palette; omit it and the generated swatch grid uses the default token ramp.'],
      ['data-zak-picker-label', 'string', '"Color"', 'Label text for the generated field.'],
      ['data-zak-hue', 'attr', '—', 'Hue rail paints the color at S 78% / L 55%.'],
      ['data-zak-picker-value', 'attr', '—', 'Input sink — receives uppercase hex value.'],
      ['.zak-swatch.is-active', 'class', '—', 'Brand outline marks the current value.'],
      ['.zak-field--{variant}', 'modifier', 'outlined', 'Field surface: filled · outlined · underline · ghost.'],
    ],
  }),
  'date-picker': defineDemo({
    desc: 'One line of markup: a bare input with `data-zak-datepicker`. The runtime generates the labeled form field, the calendar toggle button and the floating month panel; focusing the field opens it and picking a day writes the formatted value back.',
    tpl: `<input type="text" class="zak-input" data-zak-datepicker data-zak-picker-label="Start date" data-zak-cal-today="2026-06-17" data-zak-cal-min="2026-06-01" data-zak-cal-max="2026-12-31" value="2026-06-18">`,
    codeTpl: `<!-- Minimal usage — everything else is generated -->
<input type="text" class="zak-input" data-zak-datepicker>

<!-- Label, placeholder and value seed -->
<input type="text" class="zak-input" data-zak-datepicker data-zak-picker-label="Start date" placeholder="Pick a start date" value="2026-06-18">

<!-- Calendar bounds are passed through to the generated grid -->
<input type="text" class="zak-input" data-zak-datepicker data-zak-cal-min="2026-06-01" data-zak-cal-max="2026-12-31" data-zak-cal-today="2026-06-17">`,
    examples: [
      {
        title: 'Minimal',
        desc: 'One attribute; the field, toggle button and panel are generated and the panel opens on focus.',
        tpl: `<input type="text" class="zak-input" data-zak-datepicker data-zak-cal-today="2026-06-17">`,
        code: `<input type="text" class="zak-input" data-zak-datepicker>`,
      },
      {
        title: 'Label, placeholder and seed value',
        desc: 'The seed ISO date pre-selects the day; free text starts the grid at today.',
        tpl: `<input type="text" class="zak-input" data-zak-datepicker data-zak-picker-label="Start date" data-zak-picker-placeholder="Pick a start date" data-zak-cal-today="2026-06-17" value="2026-06-18">`,
        code: `<input type="text" class="zak-input" data-zak-datepicker
       data-zak-picker-label="Start date"
       data-zak-picker-placeholder="Pick a start date"
       value="2026-06-18">`,
      },
      {
        title: 'Selectable bounds',
        desc: 'Anything outside min/max is disabled in the generated grid.',
        tpl: `<input type="text" class="zak-input" data-zak-datepicker data-zak-picker-label="Delivery date" data-zak-cal-min="2026-06-01" data-zak-cal-max="2026-09-30" data-zak-cal-today="2026-06-17" value="2026-06-18">`,
        code: `<input type="text" class="zak-input" data-zak-datepicker
       data-zak-picker-label="Delivery date"
       data-zak-cal-min="2026-06-01"
       data-zak-cal-max="2026-09-30">`,
      },
    ],
    props: [
      ['data-zak-datepicker', 'attr', '—', 'Upgrades the input to a date picker field.'],
      ['value', 'attr', '—', 'ISO seed ("2026-06-18") pre-selects a day; free text starts at today.'],
      ['data-zak-picker-label', 'string', '"Date"', 'Label text for the generated field.'],
      ['data-zak-picker-placeholder', 'string', '"Select a date"', 'Placeholder shown while empty.'],
      ['readonly', 'attr', 'auto', 'The runtime makes the input read-only — the grid owns parsing.'],
      ['aria-haspopup="dialog"', 'attr', 'auto', 'Generated; aria-expanded tracks panel visibility.'],
      ['data-zak-cal-today', 'string', 'system date', 'Override "today" for deterministic docs.'],
      ['data-zak-cal-min', 'string', '—', 'Minimum selectable date (ISO).'],
      ['data-zak-cal-max', 'string', '—', 'Maximum selectable date (ISO).'],
      ['data-zak-picker-value', 'attr', 'auto', 'Sink attribute added to the input — receives formatted selection.'],
      ['.zak-picker-field', 'class', 'auto', 'Generated wrapper — the positioning context for the panel.'],
      ['.zak-picker-panel', 'class', 'auto', 'Generated floating panel, hidden until the field is focused.'],
    ],
    notes: [
      'The panel opens on focus and closes on Escape (focus returns), outside click, or commit.',
      'Keep the input read-only so the picker, not the keyboard, owns parsing and formatting.',
    ],
  }),
  'time-picker': defineDemo({
    desc: 'A bare input with `data-zak-timepicker`. Focusing it opens a floating panel of generated hour/minute selects; the Apply button commits the time back into the field.',
    tpl: `<input type="text" class="zak-input" data-zak-timepicker data-zak-picker-label="Schedule time" data-zak-time-step="5" value="14:15">`,
    codeTpl: `<!-- Minimal usage -->
<input type="text" class="zak-input" data-zak-timepicker>

<!-- Step the minute select; seed the value -->
<input type="text" class="zak-input" data-zak-timepicker data-zak-time-step="5" value="14:15">

<!-- Add a seconds select -->
<input type="text" class="zak-input" data-zak-timepicker data-zak-time-step="15" data-zak-time-seconds>`,
    examples: [
      {
        title: 'Minimal',
        desc: 'Hour and minute selects are generated — no `<option>` markup in page code.',
        tpl: `<input type="text" class="zak-input" data-zak-timepicker value="09:30">`,
        code: `<input type="text" class="zak-input" data-zak-timepicker>`,
      },
      {
        title: 'Minute step',
        desc: '`data-zak-time-step` quantises the generated minute select.',
        tpl: `<input type="text" class="zak-input" data-zak-timepicker data-zak-picker-label="Schedule time" data-zak-time-step="15" value="14:15">`,
        code: `<input type="text" class="zak-input" data-zak-timepicker
       data-zak-picker-label="Schedule time"
       data-zak-time-step="15"
       value="14:15">`,
      },
      {
        title: 'With seconds',
        desc: 'Adds a third select; the committed value becomes "HH:MM:SS".',
        tpl: `<input type="text" class="zak-input" data-zak-timepicker data-zak-picker-label="Exact time" data-zak-time-step="15" data-zak-time-seconds value="14:15:30">`,
        code: `<input type="text" class="zak-input" data-zak-timepicker
       data-zak-picker-label="Exact time"
       data-zak-time-step="15"
       data-zak-time-seconds
       value="14:15:30">`,
      },
    ],
    props: [
      ['data-zak-timepicker', 'attr', '—', 'Upgrades the input to a time picker field.'],
      ['value', 'attr', '—', 'Time seed ("14:15" or "14:15:30") pre-selects the selects.'],
      ['data-zak-picker-label', 'string', '"Time"', 'Label text for the generated field.'],
      ['data-zak-time-step', 'number', '1', 'Minute (and second) increment for the generated selects.'],
      ['data-zak-time-seconds', 'attr', '—', 'Adds a seconds select.'],
      ['data-zak-time-size', '"sm"', '—', 'Compacts the generated selects.'],
      ['data-zak-picker-value', 'attr', 'auto', 'Sink attribute added to the input — receives "HH:MM".'],
      ['.zak-picker-panel__foot', 'element', 'auto', 'Generated foot: live readout plus the Apply button that commits it.'],
      ['.zak-time-selects', 'class', 'auto', 'Generated hour/minute select row inside the panel.'],
    ],
    notes: ['Hour, minute (and seconds) selects are generated from the attributes — no option markup in page code.'],
  }),
  'date-and-time-picker': defineDemo({
    desc: 'One input generates a field whose panel composes the calendar with time selects — date on the left, time on the right. "Schedule" commits both readouts into the field as a single value.',
    tpl: `<input type="text" class="zak-input" data-zak-datetimepicker data-zak-picker-label="Schedule run" data-zak-cal-today="2026-06-17" data-zak-time-step="5" value="2026-06-18">`,
    codeTpl: `<!-- Minimal usage -->
<input type="text" class="zak-input" data-zak-datetimepicker>

<!-- Seeded date + minute step -->
<input type="text" class="zak-input" data-zak-datetimepicker data-zak-picker-label="Schedule run" data-zak-time-step="5" data-zak-cal-today="2026-06-17" value="2026-06-18">`,
    examples: [
      {
        title: 'Minimal',
        desc: 'Calendar on one side, time selects on the other — committed as one value by Apply.',
        tpl: `<input type="text" class="zak-input" data-zak-datetimepicker data-zak-cal-today="2026-06-17">`,
        code: `<input type="text" class="zak-input" data-zak-datetimepicker>`,
      },
      {
        title: 'Seeded date + minute step',
        desc: 'The panel stays open until Apply so both halves can be adjusted in one pass.',
        tpl: `<input type="text" class="zak-input" data-zak-datetimepicker data-zak-picker-label="Schedule run" data-zak-time-step="5" data-zak-cal-today="2026-06-17" value="2026-06-18">`,
        code: `<input type="text" class="zak-input" data-zak-datetimepicker
       data-zak-picker-label="Schedule run"
       data-zak-time-step="5"
       value="2026-06-18">`,
      },
      {
        title: 'With seconds',
        desc: 'Combine the time attributes with the date seed for a full timestamp.',
        tpl: `<input type="text" class="zak-input" data-zak-datetimepicker data-zak-picker-label="Cutover" data-zak-time-step="15" data-zak-time-seconds data-zak-cal-today="2026-06-17" value="2026-06-20">`,
        code: `<input type="text" class="zak-input" data-zak-datetimepicker
       data-zak-picker-label="Cutover"
       data-zak-time-step="15"
       data-zak-time-seconds>`,
      },
    ],
    props: [
      ['data-zak-datetimepicker', 'attr', '—', 'Upgrades the input to a combined date + time field.'],
      ['value', 'attr', '—', 'ISO date seed pre-selects the day; time starts at 00:00.'],
      ['data-zak-picker-label', 'string', '"Date & time"', 'Label text for the generated field.'],
      ['data-zak-time-step', 'number', '1', 'Minute increment for the generated selects.'],
      ['data-zak-cal-today', 'string', 'system date', 'Override "today" for deterministic docs.'],
      ['data-zak-picker-apply', 'attr', 'auto', 'Generated confirm button — commits "date · time" into the field.'],
      ['data-zak-picker-text', 'attr', 'auto', 'Generated date readout sink in the panel footer.'],
      ['data-zak-time-value', 'attr', 'auto', 'Generated time readout sink in the panel footer.'],
    ],
    notes: ['The panel stays open until Apply so both halves of the value can be adjusted in one pass.'],
  }),
  'date-range-picker': defineDemo({
    desc: 'One input generates a field with a dual-month range panel plus preset menu. Click a start and an end day — the range fills brand-subtle between rounded caps — then Apply commits the formatted span.',
    tpl: `<input type="text" class="zak-input" data-zak-daterangepicker data-zak-picker-label="Reporting period" data-zak-cal-today="2026-06-17" value="2026-06-09..2026-06-24">`,
    codeTpl: `<!-- Minimal usage -->
<input type="text" class="zak-input" data-zak-daterangepicker>

<!-- Label + seeded span (deterministic docs) -->
<input type="text" class="zak-input" data-zak-daterangepicker data-zak-picker-label="Reporting period" data-zak-cal-today="2026-06-17" value="2026-06-09..2026-06-24">`,
    examples: [
      {
        title: 'Minimal',
        desc: 'Dual-month range panel with a preset menu, generated from one attribute.',
        tpl: `<input type="text" class="zak-input" data-zak-daterangepicker data-zak-cal-today="2026-06-17">`,
        code: `<input type="text" class="zak-input" data-zak-daterangepicker>`,
      },
      {
        title: 'Seeded span',
        desc: '`"start..end"` in the value pre-selects both endpoints and fills the range styling.',
        tpl: `<input type="text" class="zak-input" data-zak-daterangepicker data-zak-picker-label="Reporting period" data-zak-cal-today="2026-06-17" value="2026-06-09..2026-06-24">`,
        code: `<input type="text" class="zak-input" data-zak-daterangepicker
       data-zak-picker-label="Reporting period"
       value="2026-06-09..2026-06-24">`,
      },
      {
        title: 'Bounded range',
        desc: 'Bounds clamp both endpoints; days outside them render disabled.',
        tpl: `<input type="text" class="zak-input" data-zak-daterangepicker data-zak-picker-label="Contract window" data-zak-cal-min="2026-06-01" data-zak-cal-max="2026-08-31" data-zak-cal-today="2026-06-17" value="2026-06-09..2026-06-24">`,
        code: `<input type="text" class="zak-input" data-zak-daterangepicker
       data-zak-picker-label="Contract window"
       data-zak-cal-min="2026-06-01"
       data-zak-cal-max="2026-08-31">`,
      },
    ],
    props: [
      ['data-zak-daterangepicker', 'attr', '—', 'Upgrades the input to a range picker field.'],
      ['value', 'attr', '—', 'Range seed "2026-06-09..2026-06-24" pre-selects the span.'],
      ['data-zak-picker-label', 'string', '"Date range"', 'Label text for the generated field.'],
      ['data-zak-cal-today', 'string', 'system date', 'Override "today"; presets compute from it.'],
      ['data-zak-cal-select="range"', 'attr', 'auto', 'Generated on the dual-month grid — two-endpoint mode.'],
      ['data-zak-cal-months="2"', 'attr', 'auto', 'Generated — two month grids side by side.'],
      ['data-zak-range-preset', 'attr', 'auto', 'Generated preset menu: today · last14 · month · quarter · ytd.'],
      ['data-zak-picker-apply', 'attr', 'auto', 'Generated "Apply range" button.'],
    ],
    notes: ['The panel keeps both endpoints editable until Apply — Clear resets the selection without committing.'],
  }),
  'week-picker': defineDemo({
    desc: 'A bare input with `data-zak-weekpicker`. The generated panel lists ISO week rows — each with its number and date span — from `data-zak-cal-view="weeks"`; clicking a row commits and closes.',
    tpl: `<input type="text" class="zak-input" data-zak-weekpicker data-zak-picker-label="Reporting week" data-zak-cal-today="2026-06-17" value="2026-06-15">`,
    codeTpl: `<!-- Minimal usage -->
<input type="text" class="zak-input" data-zak-weekpicker>

<!-- Seeded week + deterministic today -->
<input type="text" class="zak-input" data-zak-weekpicker data-zak-picker-label="Reporting week" data-zak-cal-today="2026-06-17" value="2026-06-15">`,
    examples: [
      {
        title: 'Minimal',
        desc: 'Panel lists ISO week rows with their number and date span.',
        tpl: `<input type="text" class="zak-input" data-zak-weekpicker data-zak-cal-today="2026-06-17">`,
        code: `<input type="text" class="zak-input" data-zak-weekpicker>`,
      },
      {
        title: 'Seeded week',
        desc: 'Any date inside the wanted week selects it (Monday-first).',
        tpl: `<input type="text" class="zak-input" data-zak-weekpicker data-zak-picker-label="Reporting week" data-zak-cal-today="2026-06-17" value="2026-06-15">`,
        code: `<input type="text" class="zak-input" data-zak-weekpicker
       data-zak-picker-label="Reporting week"
       value="2026-06-15">`,
      },
    ],
    props: [
      ['data-zak-weekpicker', 'attr', '—', 'Upgrades the input to a week picker field.'],
      ['value', 'attr', '—', 'ISO date seed — its week is pre-selected (Monday-first).'],
      ['data-zak-picker-label', 'string', '"Week"', 'Label text for the generated field.'],
      ['data-zak-cal-today', 'string', 'system date', 'Override "today" for deterministic docs.'],
      ['data-zak-cal-view="weeks"', 'attr', 'auto', 'Generated — renders ISO week rows instead of a day grid.'],
      ['data-zak-picker-text', 'attr', 'auto', 'Generated footer readout, e.g. "W25 · 15 – 21 Jun 2026".'],
    ],
    notes: ['Rows carry `role="option"` inside a `listbox`; the chosen week fills brand.'],
  }),
  'month-picker': defineDemo({
    desc: 'A bare input with `data-zak-monthpicker`. The generated panel is the 12-month matrix with a year stepper in the header; one click picks the month and closes the panel.',
    tpl: `<input type="text" class="zak-input" data-zak-monthpicker data-zak-picker-label="Billing month" data-zak-cal-today="2026-06-17" value="2026-06-01">`,
    codeTpl: `<!-- Minimal usage -->
<input type="text" class="zak-input" data-zak-monthpicker>

<!-- Seeded month + deterministic today -->
<input type="text" class="zak-input" data-zak-monthpicker data-zak-picker-label="Billing month" data-zak-cal-today="2026-06-17" value="2026-06-01">`,
    examples: [
      {
        title: 'Minimal',
        desc: '12-month matrix with a year stepper in the generated header.',
        tpl: `<input type="text" class="zak-input" data-zak-monthpicker data-zak-cal-today="2026-06-17">`,
        code: `<input type="text" class="zak-input" data-zak-monthpicker>`,
      },
      {
        title: 'Seeded month',
        desc: 'The month of the seed date is pre-selected; one click commits.',
        tpl: `<input type="text" class="zak-input" data-zak-monthpicker data-zak-picker-label="Billing month" data-zak-cal-today="2026-06-17" value="2026-06-01">`,
        code: `<input type="text" class="zak-input" data-zak-monthpicker
       data-zak-picker-label="Billing month"
       value="2026-06-01">`,
      },
    ],
    props: [
      ['data-zak-monthpicker', 'attr', '—', 'Upgrades the input to a month picker field.'],
      ['value', 'attr', '—', 'ISO date seed — its month of the year is pre-selected.'],
      ['data-zak-picker-label', 'string', '"Month"', 'Label text for the generated field.'],
      ['data-zak-cal-view="months"', 'attr', 'auto', 'Generated — renders the 12-month matrix.'],
      ['data-zak-cal-prev / -next', 'attr', 'auto', 'Generated header buttons — step the year.'],
      ['data-zak-picker-text', 'attr', 'auto', 'Generated footer readout, e.g. "June 2026".'],
    ],
  }),
  'year-picker': defineDemo({
    desc: 'A bare input with `data-zak-yearpicker`. The generated panel is a decade grid with a header that steps ±10 years; picking a year commits and closes.',
    tpl: `<input type="text" class="zak-input" data-zak-yearpicker data-zak-picker-label="Fiscal year" data-zak-cal-today="2026-06-17" value="2026-01-01">`,
    codeTpl: `<!-- Minimal usage -->
<input type="text" class="zak-input" data-zak-yearpicker>

<!-- Seeded year + deterministic today -->
<input type="text" class="zak-input" data-zak-yearpicker data-zak-picker-label="Fiscal year" data-zak-cal-today="2026-06-17" value="2026-01-01">`,
    examples: [
      {
        title: 'Minimal',
        desc: 'Decade grid; the generated header steps ±10 years.',
        tpl: `<input type="text" class="zak-input" data-zak-yearpicker data-zak-cal-today="2026-06-17">`,
        code: `<input type="text" class="zak-input" data-zak-yearpicker>`,
      },
      {
        title: 'Seeded year',
        desc: 'The seed year is highlighted inside its decade.',
        tpl: `<input type="text" class="zak-input" data-zak-yearpicker data-zak-picker-label="Fiscal year" data-zak-cal-today="2026-06-17" value="2026-01-01">`,
        code: `<input type="text" class="zak-input" data-zak-yearpicker
       data-zak-picker-label="Fiscal year"
       value="2026-01-01">`,
      },
    ],
    props: [
      ['data-zak-yearpicker', 'attr', '—', 'Upgrades the input to a year picker field.'],
      ['value', 'attr', '—', 'ISO date seed — its decade is shown and the year pre-selected.'],
      ['data-zak-picker-label', 'string', '"Year"', 'Label text for the generated field.'],
      ['data-zak-cal-view="years"', 'attr', 'auto', 'Generated — renders the decade matrix.'],
      ['data-zak-cal-prev / -next', 'attr', 'auto', 'Generated header buttons — ±10 years per step.'],
      ['data-zak-picker-text', 'attr', 'auto', 'Generated footer readout, e.g. "2026".'],
    ],
  }),
};
