/**
 * ZAKUIKit Docs — demo definition types & shared defaults.
 *
 * Every catalogue component maps to exactly one DemoDef. The `tpl` string is a
 * mustache-lite template rendered at build time (static HTML) and re-rendered
 * in the browser by the playground when controls change.
 */
import { templateVars } from '../lib/template';

export type ControlType = 'select' | 'toggle' | 'text' | 'color' | 'range';
export type ControlValue = string | number | boolean;

export interface ControlDef {
  name: string;
  type: ControlType;
  label?: string;
  options?: string[];
  default: ControlValue;
  min?: number;
  max?: number;
  step?: number;
}

export type PropRow = [name: string, type: string, def: string, desc: string];
export type KeyRow = [keys: string, behavior: string];

/**
 * One documented variant of a component: a live preview plus its copy-ready
 * markup. Rendered by `ExampleBlock.astro` as its own card in the Examples
 * section, so every prop/variant row in the API table can be seen and copied
 * in isolation instead of inside the single combined playground.
 */
export interface ExampleDef {
  /** Variant name shown as the card heading. */
  title: string;
  /** One-line explanation under the heading. */
  desc?: string;
  /** Live preview markup (static HTML, no placeholders). */
  tpl: string;
  /** Copy-ready markup; falls back to `tpl` when omitted. */
  code?: string;
  /** Optional JS tab shown next to the HTML tab. */
  js?: string;
  /** Preview alignment; defaults to `start` (left, top-aligned). */
  stage?: 'center' | 'start' | 'stretch';
}

export interface DemoDef {
  /** Longer page description; falls back to the catalogue description. */
  desc?: string;
  /** Extra implementation notes rendered after the playground. */
  notes?: string[];
  /** Preview / HTML snippet template. */
  tpl: string;
  /** Snippet template when it should differ from the preview template. */
  codeTpl?: string;
  /**
   * Component-based usage snippet — the concise "copy-paste this" example
   * showing minimal declarative HTML + JS controller init. Displayed as the
   * primary "Usage" tab before the full HTML markup tab.
   */
  usage?: string;
  /** Optional CSS tab content. */
  css?: string;
  /** Optional JavaScript tab content. */
  js?: string;
  /**
   * Per-variant preview + code cards rendered between the main demo and the
   * Props API. Optional: components without it keep the single-demo layout.
   */
  examples?: ExampleDef[];
  /** Explicit controls. Missing common ones are inferred from the template. */
  controls?: ControlDef[];
  props?: PropRow[];
  /**
   * Render the derived "Design tokens" table under Props API. Only meaningful
   * on design-token surfaces (colour, type, spacing, radius, shadow, responsive)
   * — ordinary components omit it so their pages stay focused.
   */
  showTokens?: boolean;
  a11y?: { keys?: KeyRow[]; aria?: KeyRow[] };
  /** Stage presentation. */
  stage?: 'center' | 'start' | 'stretch' | 'grid';
  /** Min track width for `grid` stages. */
  stageMin?: number;
  /** Disable the interactive playground shell (static demo card instead). */
  playground?: boolean;
}

export function defineDemo(def: DemoDef): DemoDef {
  return def;
}

/* ---------------------------------------------------------------------------
   Control inference — common placeholders come with ready-made controls.
   --------------------------------------------------------------------------- */
const KNOWN_CONTROLS: Record<string, ControlDef> = {
  variant: {
    name: 'variant',
    type: 'select',
    options: ['filled', 'outlined', 'text', 'soft', 'link'],
    default: 'filled',
  },
  size: { name: 'size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
  disabled: { name: 'disabled', type: 'toggle', label: 'Disabled', default: false },
  loading: { name: 'loading', type: 'toggle', label: 'Loading', default: false },
  label: { name: 'label', type: 'text', label: 'Label', default: 'Save changes' },
  placeholder: { name: 'placeholder', type: 'text', label: 'Placeholder', default: 'Search…' },
  text: { name: 'text', type: 'text', label: 'Text', default: 'Preview text' },
  title: { name: 'title', type: 'text', label: 'Title', default: 'Panel title' },
};

export function inferControls(tpl: string, provided?: ControlDef[]): ControlDef[] {
  if (provided && provided.length) return provided;
  const vars = templateVars(tpl);
  const controls: ControlDef[] = [];
  for (const name of vars) {
    if (KNOWN_CONTROLS[name]) controls.push({ ...KNOWN_CONTROLS[name] });
  }
  return controls;
}

export function defaultVars(controls: ControlDef[]): Record<string, ControlValue> {
  const vars: Record<string, ControlValue> = {};
  for (const control of controls) vars[control.name] = control.default;
  return vars;
}

/* ---------------------------------------------------------------------------
   Fallback API tables per category — used when a demo omits explicit props.
   --------------------------------------------------------------------------- */
const FALLBACK_PROPS: Record<string, PropRow[]> = {
  utilities: [
    ['class', 'string', '—', 'One-shot helper classes appended to any element.'],
    ['data-theme', '"light" | "dark"', 'inherited', 'Forces a theme scope for the subtree.'],
  ],
  layout: [
    ['class', 'string', '—', 'Layout classes controlling structure and spacing.'],
    ['gap', 'token', 'var(--zak-space-4)', 'Space between children via `--gap` / `--zak-row-gap`.'],
    ['as', 'tag', 'div', 'Polymorphic root element (section, main, nav…).'],
  ],
  buttons: [
    ['variant', 'enum', 'filled', 'Visual style: filled · outlined · text · soft · link.'],
    ['size', 'enum', 'md', 'Control height: sm · md · lg · xl.'],
    ['disabled', 'boolean', 'false', 'Blocks interaction and dims the control.'],
    ['type', 'enum', 'button', 'Native button type: button · submit · reset.'],
  ],
  forms: [
    ['value', 'string', '—', 'Current field value (bound by the host framework).'],
    ['name', 'string', '—', 'Form field name for submission.'],
    ['required', 'boolean', 'false', 'Marks the field as mandatory.'],
    ['disabled', 'boolean', 'false', 'Disables interaction.'],
  ],
  pickers: [
    ['value', 'Date | string', '—', 'Selected value in ISO format.'],
    ['min', 'Date', '—', 'Earliest selectable value.'],
    ['max', 'Date', '—', 'Latest selectable value.'],
    ['open', 'boolean', 'false', 'Controls panel visibility.'],
  ],
  'data-display': [
    ['variant', 'enum', 'default', 'Tone or shape variant for the display element.'],
    ['size', 'enum', 'md', 'Density of the presentation.'],
  ],
  tables: [
    ['columns', 'Column[]', '—', 'Column definitions: key, header, sortable, align.'],
    ['rows', 'Row[]', '—', 'Tabular data rendered in table order.'],
    ['dense', 'boolean', 'false', 'Reduces row padding for dense screens.'],
    ['striped', 'boolean', 'false', 'Alternating row backgrounds.'],
  ],
  'data-grid': [
    ['data', 'Row[]', '—', 'Dataset rendered by the grid.'],
    ['pageSize', 'number', '10', 'Rows per page; 0 disables pagination.'],
    ['selectable', 'boolean', 'true', 'Enables row selection checkboxes.'],
    ['sortable', 'boolean', 'true', 'Enables click-to-sort headers.'],
    ['filterable', 'boolean', 'true', 'Enables the toolbar search + filters.'],
    ['expandable', 'boolean', 'false', 'Enables drill-down detail rows.'],
  ],
  navigation: [
    ['active', 'string', '—', 'Slug of the currently active item.'],
    ['items', 'Item[]', '—', 'Navigation entries: id, label, href, icon, badge.'],
    ['orientation', 'enum', 'horizontal', 'horizontal · vertical layout.'],
  ],
  feedback: [
    ['tone', 'enum', 'info', 'info · success · warning · danger semantics.'],
    ['dismissible', 'boolean', 'false', 'Renders a close affordance.'],
    ['duration', 'number', '4000', 'Auto-dismiss delay in ms (0 = manual).'],
  ],
  overlays: [
    ['open', 'boolean', 'false', 'Whether the overlay is visible.'],
    ['dismissible', 'boolean', 'true', 'Allows Esc / backdrop dismissal.'],
    ['placement', 'enum', 'center', 'Anchor placement: center · top · end · bottom.'],
    ['labelledby', 'string', '—', 'ID of the labelling element.'],
  ],
  disclosure: [
    ['open', 'boolean', 'false', 'Expanded state of the region.'],
    ['summary', 'string', '—', 'Trigger label text.'],
    ['easing', 'enum', 'standard', 'Motion curve used while expanding.'],
  ],
  media: [
    ['src', 'string', '—', 'Media source URL.'],
    ['alt', 'string', '—', 'Alternative text (required for images).'],
    ['ratio', 'enum', '16/9', 'Aspect ratio: 16/9 · 4/3 · 1/1.'],
    ['controls', 'boolean', 'true', 'Shows native transport controls.'],
  ],
  'data-visualization': [
    ['series', 'number[]', '—', 'Values plotted left to right.'],
    ['color', 'token', 'var(--zak-chart-1)', 'Series color from the chart palette.'],
    ['label', 'string', '—', 'Accessible summary of the chart.'],
    ['tooltips', 'boolean', 'true', 'Native hover tooltips per data point.'],
  ],
  ai: [
    ['state', 'enum', 'idle', 'idle · thinking · streaming · done.'],
    ['onSend', 'function', '—', 'Callback fired with the prompt payload.'],
    ['streaming', 'boolean', 'false', 'Renders incoming tokens with a caret.'],
    ['model', 'string', 'zak-1-mini', 'Model identifier shown in metadata.'],
  ],
};

export function fallbackProps(category: string): PropRow[] {
  return FALLBACK_PROPS[category] ?? FALLBACK_PROPS.layout;
}

/* ---------------------------------------------------------------------------
   Fallback accessibility guidance per category.
   --------------------------------------------------------------------------- */
interface A11yFallback {
  keys: KeyRow[];
  aria: KeyRow[];
}

const FALLBACK_A11Y: Record<string, A11yFallback> = {
  utilities: {
    keys: [['—', 'Presentational helper classes; no interactive behaviour.']],
    aria: [['—', 'Keep colour contrast ≥ 4.5:1 and never hide meaningful content with display utilities from screen readers.']],
  },
  layout: {
    keys: [['Tab', 'Moves focus through interactive children only.']],
    aria: [['—', 'Layout primitives are presentational; use semantic landmarks via `as`.']],
  },
  buttons: {
    keys: [
      ['Enter / Space', 'Activates the focused button.'],
      ['Tab', 'Moves focus to the next focusable control.'],
    ],
    aria: [
      ['aria-disabled', 'Preferred over the `disabled` attribute when focus must remain.'],
      ['aria-pressed', 'Reflects pressed state for toggle-style buttons.'],
      ['aria-busy', 'Set while a loading button is working.'],
    ],
  },
  forms: {
    keys: [
      ['Tab', 'Moves between fields in DOM order.'],
      ['Space', 'Toggles checkbox / switch states.'],
      ['Arrow keys', 'Moves within radio groups and selects.'],
    ],
    aria: [
      ['aria-invalid', 'Marks the control when validation fails.'],
      ['aria-describedby', 'Links the field to its hint and error message.'],
      ['aria-required', 'Conveys mandatory fields to assistive tech.'],
    ],
  },
  pickers: {
    keys: [
      ['Esc', 'Closes the picker panel and returns focus to the trigger.'],
      ['Arrow keys', 'Moves the focused day / option.'],
      ['Enter', 'Selects the focused value.'],
    ],
    aria: [
      ['aria-expanded', 'Reflects panel visibility on the trigger.'],
      ['aria-haspopup="dialog"', 'Announces the popup panel type.'],
      ['aria-selected', 'Marks the chosen day or option.'],
    ],
  },
  'data-display': {
    keys: [['Tab', 'Focuses interactive elements (links, removable chips).']],
    aria: [
      ['—', 'Use semantic lists and headings for screen-reader structure.'],
      ['aria-label', 'Provides text alternatives for visual-only elements (rating, avatars).'],
    ],
  },
  tables: {
    keys: [
      ['Enter / Space', 'Toggles row selection and expandable rows.'],
      ['Tab', 'Moves focus between toolbar, rows and pagination.'],
    ],
    aria: [
      ['scope="col" / "row"', 'Associates header cells with data cells.'],
      ['aria-sort', 'Announces current sort direction on sortable headers.'],
      ['aria-selected', 'Marks selected rows in selectable tables.'],
    ],
  },
  'data-grid': {
    keys: [
      ['Enter / Space', 'Toggles row selection; Space toggles the focused checkbox.'],
      ['Arrow keys', 'Moves focus between headers and cells in grid mode.'],
      ['Esc', 'Closes open column menus and editors.'],
    ],
    aria: [
      ['role="grid"', 'Exposes the composite widget with row/column semantics.'],
      ['aria-sort', 'Reflects sort direction on the active column.'],
      ['aria-multiselectable', 'Declares multi-row selection capability.'],
      ['aria-busy', 'Set while server-side/virtual data is loading.'],
    ],
  },
  navigation: {
    keys: [
      ['Enter', 'Activates the focused link or menu item.'],
      ['Arrow keys', 'Moves between menu items and tabs.'],
      ['Esc', 'Closes an open menu and returns focus to the trigger.'],
    ],
    aria: [
      ['aria-current="page"', 'Marks the active page link.'],
      ['aria-expanded', 'Reflects disclosure state of menus and groups.'],
      ['role="tablist" / "tab"', 'Required structure for custom tab widgets.'],
    ],
  },
  feedback: {
    keys: [
      ['Esc', 'Dismisses toast and snackbar messages.'],
      ['Enter / Space', 'Activates the inline action of a notification.'],
    ],
    aria: [
      ['aria-live="polite"', 'Announces status changes without interrupting.'],
      ['role="alert"', 'Used for urgent, assertive messages.'],
      ['aria-busy', 'Marks regions during loading states.'],
    ],
  },
  overlays: {
    keys: [
      ['Esc', 'Closes the overlay unless marked non-dismissible.'],
      ['Tab / Shift+Tab', 'Cycles focus within the overlay (focus trap).'],
      ['Enter', 'Confirms the default action in a dialog.'],
    ],
    aria: [
      ['aria-modal="true"', 'Declares modal semantics on the dialog.'],
      ['aria-labelledby', 'Points at the dialog title element.'],
      ['aria-describedby', 'Associates supporting description text.'],
    ],
  },
  disclosure: {
    keys: [
      ['Enter / Space', 'Toggles the expanded region.'],
      ['Tab', 'Moves focus between triggers.'],
    ],
    aria: [
      ['aria-expanded', 'Reflects the disclosure state on the trigger.'],
      ['aria-controls', 'References the controlled panel id.'],
      ['hidden', 'Removes collapsed content from the accessibility tree.'],
    ],
  },
  media: {
    keys: [
      ['Space', 'Plays or pauses media.'],
      ['Arrow keys', 'Seeks within the player timeline.'],
      ['Arrow keys (carousel)', 'Moves between slides.'],
    ],
    aria: [
      ['alt', 'Required text alternative for every meaningful image.'],
      ['aria-label', 'Labels carousel controls and icon-only buttons.'],
      ['aria-roledescription="carousel"', 'Announces carousel semantics.'],
    ],
  },
  'data-visualization': {
    keys: [['Tab', 'Focuses interactive data points and legends.']],
    aria: [
      ['role="img"', 'With an aria-label summarizing the data story.'],
      ['<title>', 'Per-point tooltips are announced on hover / focus.'],
      ['—', 'Provide an adjacent data table alternative for complex charts.'],
    ],
  },
  ai: {
    keys: [
      ['Enter', 'Submits the prompt; Shift+Enter inserts a newline.'],
      ['Esc', 'Stops a streaming response and restores the composer.'],
      ['Arrow keys', 'Navigates prompt suggestions and command menus.'],
    ],
    aria: [
      ['aria-live="polite"', 'Streams assistant output without interrupting speech.'],
      ['aria-busy', 'Set on the thread while a response is generating.'],
      ['aria-label', 'Describes the assistant orb and streaming status.'],
    ],
  },
};

export function fallbackA11y(category: string): A11yFallback {
  return FALLBACK_A11Y[category] ?? FALLBACK_A11Y.layout;
}
