/**
 * ZAKUIKit — component catalog.
 * Single source of truth for navigation, routing, search and category pages.
 */
import { slugify } from '../lib/strings';

export type ComponentStatus = 'stable' | 'beta' | 'experimental';
export type ComponentBadge = 'new' | 'ai' | 'updated';

export interface ComponentEntry {
  slug: string;
  name: string;
  desc: string;
  status: ComponentStatus;
  badge?: ComponentBadge;
  since: string;
  keywords: string;
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  blurb: string;
  components: ComponentEntry[];
}

interface RawComponent {
  name: string;
  desc: string;
  status?: ComponentStatus;
  badge?: ComponentBadge;
  since?: string;
  keywords?: string;
}

function c(name: string, desc: string, opts: Partial<RawComponent> = {}): RawComponent {
  return { name, desc, ...opts };
}

const rawCatalog: Array<{ name: string; icon: string; blurb: string; components: RawComponent[] }> = [
  {
    name: 'Utilities',
    icon: 'zap',
    blurb: 'Design tokens and one-shot helper classes: color, type, spacing, borders, layout and more.',
    components: [
      c('Colors', 'Semantic and palette color ramps for both light and dark themes.', { since: '1.0' }),
      c('Typography', 'Type scale, weights and line-heights tuned for dense enterprise UI.', { since: '1.0' }),
      c('Font Weight', 'Normal, medium, semibold and bold helpers.', { since: '1.0' }),
      c('Text Alignment', 'Logical start, center and end alignment utilities.', { since: '1.0' }),
      c('Decoration', 'Underline, strike and text-transform case helpers.', { since: '1.0' }),
      c('Icons', 'A 24px stroke icon set with consistent optical weight.', { since: '1.0' }),
      c('Spacing', 'A 4px-based spacing scale driving every layout decision.', { since: '1.0' }),
      c('Margin', 'Margin utilities across the spacing scale, per side and axis.', { since: '1.0' }),
      c('Padding', 'Padding utilities across the spacing scale, per side and axis.', { since: '1.0' }),
      c('Borders', 'Border widths and hairline color utilities.', { since: '1.0' }),
      c('Radius', 'Corner-radius utilities from crisp to full pill.', { since: '1.0' }),
      c('Shadows', 'Layered elevation tokens from subtle to floating.', { since: '1.0' }),
      c('Responsive', 'Breakpoints, fluid layout and container-query recipes.', { since: '1.2', badge: 'updated' }),
      c('Sizing', 'Width, height and max-width utilities aligned to the breakpoints.', { since: '1.0' }),
      c('Display', 'One-shot display switching and visibility helpers.', { since: '1.0' }),
      c('Flexbox', 'Direction, alignment, justification and growth utilities.', { since: '1.0' }),
      c('Position', 'Placement and logical edge-offset utilities.', { since: '1.1' }),
      c('Overflow', 'Clip and scroll helpers, per axis.', { since: '1.1' }),
      c('Cursor', 'Pointer affordance utilities.', { since: '1.1' }),
    ],
  },
  {
    name: 'Layout',
    icon: 'layout',
    blurb: 'Structural primitives that compose into any page or panel.',
    components: [
      c('Container', 'Centered, max-width constrained page wrapper.', { since: '1.0' }),
      c('Row', '12-column grid row with configurable gap.', { since: '1.0' }),
      c('Columns', 'Column spans with responsive overrides.', { since: '1.0' }),
      c('Grid', 'Auto-fit layout grid driven by a minimum track size.', { since: '1.0' }),
      c('Flex', 'One-dimensional alignment utilities.', { since: '1.0' }),
      c('Stack', 'Vertical rhythm for form and content stacks.', { since: '1.0' }),
      c('Box', 'Surface primitive with padding, radius and variant styles.', { since: '1.0' }),
      c('Aspect Ratio', 'CSS aspect-ratio wrapper for media and embeds.', { since: '1.1' }),
    ],
  },
  {
    name: 'Buttons',
    icon: 'mouse-pointer',
    blurb: 'Actions for every context, size and state.',
    components: [
      c('Button', 'The core action element in five variants and five sizes.', { since: '1.0' }),
      c('Icon Button', 'Square, label-free buttons for dense toolbars.', { since: '1.0' }),
      c('Button Group', 'Segmented selection from adjacent buttons.', { since: '1.0' }),
      c('Button Toolbar', 'Grouped controls with separators and active states.', { since: '1.2' }),
      c('Loading Button', 'In-flight action feedback with an inline spinner.', { since: '1.0' }),
      c('Floating Action Button', 'Prominent, anchored primary action.', { since: '1.0' }),
      c('Button Toggle', 'Pressed-state toggle button for toolbars and filters.', { since: '1.1' }),
    ],
  },
  {
    name: 'Forms',
    icon: 'sliders',
    blurb: 'Input controls, validation and multi-step form composition.',
    components: [
      c('Forms', 'Form scaffolding, grids, rows and fieldsets.', { since: '1.0' }),
      c('Form Field', 'Label + control + hint + error wrapper.', { since: '1.0' }),
      c('Label', 'Accessible labels with required and optional markers.', { since: '1.0' }),
      c('Input', 'Single-line text input in three sizes.', { since: '1.0' }),
      c('Input Group', 'Inputs combined with addons, prefixes and suffixes.', { since: '1.0' }),
      c('Textarea', 'Multi-line input with auto-resize guidance.', { since: '1.0' }),
      c('Select', 'Native select styled with a custom indicator.', { since: '1.0' }),
      c('Multi Select', 'Multi-value selection with removable tags.', { since: '1.3', badge: 'new' }),
      c('Checkbox', 'Checkbox with checked, indeterminate and disabled states.', { since: '1.0' }),
      c('Radio', 'Single-choice radio with card presentation option.', { since: '1.0' }),
      c('Radio Group', 'Grouped radio controls with horizontal/vertical layout.', { since: '1.0' }),
      c('Switch', 'Binary toggle for immediate settings.', { since: '1.0' }),
      c('Range', 'Slider input for numeric values.', { since: '1.0' }),
      c('File Upload', 'Drag-and-drop file selection with file list.', { since: '1.1' }),
      c('Search Input', 'Pill search field with keyboard hint.', { since: '1.0' }),
      c('Password Input', 'Masked input with reveal affordance.', { since: '1.0' }),
      c('OTP Input', 'One-time passcode entry with auto-advance.', { since: '1.2', badge: 'new' }),
      c('Autocomplete', 'Text input with filtered suggestion list.', { since: '1.1' }),
      c('Combobox', 'Single-value picker with search and keyboard nav.', { since: '1.3', badge: 'new' }),
      c('Tags Input', 'Free-form label entry with chip management.', { since: '1.3', badge: 'new' }),
      c('Form Wizard', 'Multi-step flows with progress indication.', { since: '1.2' }),
      c('Dynamic Field', 'Repeatable field groups users can add, remove and reorder.', { since: '1.2' }),
      c('Validation', 'Error, success and hint messaging patterns.', { since: '1.0' }),
    ],
  },
  {
    name: 'Pickers',
    icon: 'calendar',
    blurb: 'Date, time and color selection surfaces.',
    components: [
      c('Calendar', 'Month grid with single-date selection.', { since: '1.0' }),
      c('Color Picker', 'Swatch grid, hue slider and value readout.', { since: '1.1' }),
      c('Date Picker', 'Text field anchored to a calendar panel.', { since: '1.0' }),
      c('Time Picker', 'Hour, minute and second dropdown selects.', { since: '1.0' }),
      c('Date & Time Picker', 'Combined calendar and time selection.', { since: '1.1' }),
      c('Date Range Picker', 'Two-endpoint selection with range highlighting.', { since: '1.1' }),
      c('Week Picker', 'Whole-week selection row.', { since: '1.2' }),
      c('Month Picker', 'Month-of-year grid selection.', { since: '1.2' }),
      c('Year Picker', 'Decade grid for fast year navigation.', { since: '1.2' }),
    ],
  },
  {
    name: 'Data Display',
    icon: 'grid',
    blurb: 'Presentational elements for content, people and status.',
    components: [
      c('Card', 'Flexible content container with media, header and footer slots.', { since: '1.0' }),
      c('Badge', 'Compact status and count labels.', { since: '1.0' }),
      c('Chip', 'Removable or selectable compact tokens.', { since: '1.0' }),
      c('Avatar', 'Identity image or initials with status ring.', { since: '1.0' }),
      c('Avatar Group', 'Overlapping stack with overflow count.', { since: '1.0' }),
      c('List', 'Simple vertical content lists.', { since: '1.0' }),
      c('List Group', 'Bordered list with headers and custom rows.', { since: '1.0' }),
      c('Timeline', 'Chronological activity with completion states.', { since: '1.1' }),
      c('Tree', 'Expandable hierarchical navigation.', { since: '1.1' }),
      c('Description List', 'Key-value pairs in grid or card layouts.', { since: '1.1' }),
      c('Stat', 'Headline metric with label and trend delta.', { since: '1.0' }),
      c('Rating', 'Star rating input and read-only display.', { since: '1.1' }),
      c('Activity Feed', 'Stream of recent events with actor and time.', { since: '1.2' }),
    ],
  },
  {
    name: 'Tables',
    icon: 'table',
    blurb: 'Semantic table patterns from simple lists to rich datasets.',
    components: [
      c('Table', 'The base data table styling.', { since: '1.0' }),
      c('Data Table', 'Full table with toolbar, pagination and row actions.', { since: '1.0' }),
      c('Sortable Table', 'Click-to-sort headers with direction indicators.', { since: '1.0' }),
      c('Responsive Table', 'Horizontally scrollable table on small viewports.', { since: '1.0' }),
      c('Striped Table', 'Zebra-striped rows for dense scanning.', { since: '1.0' }),
      c('Bordered Table', 'Bordered grid presentation.', { since: '1.0' }),
      c('Compact Table', 'Reduced padding for information-dense screens.', { since: '1.0' }),
      c('Expandable Table', 'Rows that expand into detail panels.', { since: '1.2' }),
      c('Tree Table', 'Hierarchical rows with indent guides.', { since: '1.2' }),
      c('Sticky Header Table', 'Header pinned while rows scroll.', { since: '1.1' }),
      c('Table with Pagination', 'Page navigation bound to table content.', { since: '1.0' }),
      c('Table with Selection', 'Checkbox selection with select-all header.', { since: '1.0' }),
      c('Table with Actions', 'Per-row action clusters.', { since: '1.0' }),
      c('Table with Filters', 'Filter controls bound to table results.', { since: '1.1' }),
      c('Table with Bulk Actions', 'Contextual actions for multi-selected rows.', { since: '1.1' }),
    ],
  },
  {
    name: 'Data Grid',
    icon: 'database',
    blurb: 'The enterprise data grid: everything the table does, at scale.',
    components: [
      c('Data Grid', 'Full-featured grid with sorting, filtering and paging.', { since: '1.0' }),
      c('Advanced Data Grid', 'Multi-filter, column management and bulk workflows.', { since: '1.2' }),
      c('Server-side Data Grid', 'Manual loading with request lifecycle states.', { since: '1.3', badge: 'new' }),
      c('Virtual Data Grid', 'Windowed rendering for very large datasets.', { since: '1.3', badge: 'new' }),
      c('Editable Data Grid', 'In-cell editing with validation affordances.', { since: '1.2' }),
      c('Tree Data Grid', 'Parent-child rows with expandable hierarchy.', { since: '1.2' }),
      c('Grouped Data Grid', 'Rows grouped by a column with aggregates.', { since: '1.2' }),
      c('Column Selector', 'Show/hide columns from a checklist popover.', { since: '1.2' }),
      c('Column Reordering', 'Drag headers to rearrange columns.', { since: '1.3', badge: 'new' }),
      c('Column Resizing', 'Drag handles to resize column widths.', { since: '1.2' }),
      c('Row Selection', 'Single and multi-row selection states.', { since: '1.0' }),
      c('Row Expansion', 'Drill-down detail rows.', { since: '1.2' }),
      c('Data Grid Toolbar', 'Search, filters and actions above the grid.', { since: '1.0' }),
      c('Data Grid Filter', 'Column-scoped filter controls.', { since: '1.0' }),
      c('Filter Builder', 'Composable AND/OR filter rows.', { since: '1.3', badge: 'new' }),
      c('Query Builder', 'Nested filter groups for advanced queries.', { since: '1.3', badge: 'new' }),
      c('Saved Filters', 'Persisted filter presets as chips.', { since: '1.3', badge: 'new' }),
    ],
  },
  {
    name: 'Navigation',
    icon: 'compass',
    blurb: 'Wayfinding across products, pages and sections.',
    components: [
      c('Navbar', 'Top-level application bar.', { since: '1.0' }),
      c('Sidebar', 'Persistent vertical navigation with groups.', { since: '1.0' }),
      c('Navigation Menu', 'Menu bar composition for primary navigation.', { since: '1.0' }),
      c('Menu', 'Vertical or horizontal command list.', { since: '1.0' }),
      c('Dropdown', 'Trigger-anchored panel — menu items with shortcuts, or rich content.', { since: '1.0' }),
      c('Breadcrumb', 'Hierarchical location trail.', { since: '1.0' }),
      c('Tabs', 'Underline and pill tab sets with panels.', { since: '1.0' }),
      c('Pagination', 'Page navigation control.', { since: '1.0' }),
      c('Stepper', 'Ordered progress through steps.', { since: '1.1' }),
      c('Vertical Navigation', 'Grouped rail navigation for settings-like pages.', { since: '1.1' }),
      c('Anchor Navigation', 'In-page section rail with scroll-spy.', { since: '1.2' }),
    ],
  },
  {
    name: 'Feedback',
    icon: 'bell',
    blurb: 'Communicating status, progress and outcomes.',
    components: [
      c('Alert', 'Inline contextual messages in four tones.', { since: '1.0' }),
      c('Banner', 'Full-width announcements above content.', { since: '1.0' }),
      c('Toast', 'Transient notifications with auto-dismiss.', { since: '1.0' }),
      c('Snackbar', 'Bottom-anchored message with a single action.', { since: '1.1' }),
      c('Notification', 'Rich notification card with unread state.', { since: '1.1' }),
      c('Progress', 'Determinate and indeterminate progress bars.', { since: '1.0' }),
      c('Progress Circle', 'Radial progress for compact spaces.', { since: '1.1' }),
      c('Spinner', 'Loading indicators in ring and dot styles.', { since: '1.0' }),
      c('Skeleton', 'Content placeholders with shimmer.', { since: '1.0' }),
      c('Loading', 'Overlay loading states for regions and pages.', { since: '1.0' }),
      c('Empty State', 'Friendly zero-data guidance.', { since: '1.1' }),
      c('Result', 'Outcome pages for success, warning and error.', { since: '1.1' }),
      c('Status Indicator', 'Availability dots with optional pulse.', { since: '1.1' }),
    ],
  },
  {
    name: 'Overlays',
    icon: 'window',
    blurb: 'Layered surfaces that demand attention or add context.',
    components: [
      c('Modal', 'Native dialog for focused tasks.', { since: '1.0' }),
      c('Dialog', 'Compact alert dialog for confirmations.', { since: '1.0' }),
      c('Drawer', 'Side sheet for forms and details.', { since: '1.0' }),
      c('Offcanvas', 'Edge-anchored panel for mobile navigation.', { since: '1.1' }),
      c('Popover', 'Anchored rich content using the native popover API.', { since: '1.2', badge: 'updated' }),
      c('Tooltip', 'Hover/focus hints with arrow.', { since: '1.0' }),
      c('Context Menu', 'Right-click menu positioned at the pointer.', { since: '1.2' }),
    ],
  },
  {
    name: 'Disclosure & Expansion',
    icon: 'chevrons-up-down',
    blurb: 'Progressive disclosure patterns that keep UIs scannable.',
    components: [
      c('Accordion', 'Stacked expand/collapse panels.', { since: '1.0' }),
      c('Collapse', 'Animated show/hide region.', { since: '1.0' }),
      c('Expandable Panel', 'Card that reveals secondary content.', { since: '1.1' }),
      c('Details', 'Native details/summary disclosure.', { since: '1.0' }),
      c('Show More / Show Less', 'Clamped text with expand control.', { since: '1.1' }),
    ],
  },
  {
    name: 'Media',
    icon: 'image',
    blurb: 'Images, galleries, carousels and rich media objects.',
    components: [
      c('Image', 'Responsive imagery with shapes, borders and zoom.', { since: '1.0' }),
      c('Image Gallery', 'Responsive thumbnail grid with lightbox triggers.', { since: '1.1' }),
      c('Image Preview', 'Full-screen lightbox dialog.', { since: '1.1' }),
      c('Carousel', 'Scroll-snap slides with arrows and dots.', { since: '1.1' }),
      c('Video', 'Video surface with poster overlay.', { since: '1.0' }),
      c('Audio', 'Compact audio player card.', { since: '1.0' }),
      c('Media Object', 'Figure + body composition.', { since: '1.0' }),
    ],
  },
  {
    name: 'Data Visualization',
    icon: 'pie',
    blurb: 'Charts and dashboard primitives rendered as inline SVG.',
    components: [
      c('Line Chart', 'Trend lines with grid, points and tooltips.', { since: '1.0' }),
      c('Bar Chart', 'Category comparison with hover states.', { since: '1.0' }),
      c('Area Chart', 'Volume trends with gradient fills.', { since: '1.0' }),
      c('Pie Chart', 'Share-of-total with arc segments.', { since: '1.0' }),
      c('Donut Chart', 'Ring chart with centered metric.', { since: '1.0' }),
      c('Sparkline', 'Tiny inline trend for tables and KPIs.', { since: '1.0' }),
      c('KPI Card', 'Metric card with delta and sparkline.', { since: '1.1' }),
      c('Dashboard Widget', 'Composable container for dashboard tiles.', { since: '1.1' }),
    ],
  },
  {
    name: 'AI Components',
    icon: 'sparkles',
    blurb: 'Interfaces for assistants, prompts and streaming responses.',
    components: [
      c('AI Button', 'Gradient action that signals AI capability.', { status: 'beta', badge: 'ai', since: '2.0' }),
      c('AI Input', 'Input with inline AI affordance.', { status: 'beta', badge: 'ai', since: '2.0' }),
      c('AI Prompt Input', 'Auto-growing prompt composer with tools.', { status: 'beta', badge: 'ai', since: '2.0' }),
      c('Prompt Suggestions', 'One-tap starter prompts.', { status: 'beta', badge: 'ai', since: '2.0' }),
      c('Chat', 'Threaded assistant conversation shell.', { status: 'beta', badge: 'ai', since: '2.0' }),
      c('Chat Message', 'User, assistant and system message bubbles.', { status: 'beta', badge: 'ai', since: '2.0' }),
      c('Conversation', 'Conversation list with active state.', { status: 'beta', badge: 'ai', since: '2.1' }),
      c('AI Response', 'Rich response block with code and lists.', { status: 'beta', badge: 'ai', since: '2.0' }),
      c('Streaming Response', 'Token-by-token rendering with caret.', { status: 'beta', badge: 'ai', since: '2.0' }),
      c('Thinking Indicator', 'Reasoning states and step progress.', { status: 'beta', badge: 'ai', since: '2.0' }),
      c('AI Avatar', 'Animated assistant identity orb.', { status: 'beta', badge: 'ai', since: '2.0' }),
      c('Token Usage', 'Context window consumption meter.', { status: 'beta', badge: 'ai', since: '2.1' }),
      c('Citation', 'Inline source references with footnote list.', { status: 'beta', badge: 'ai', since: '2.1' }),
      c('AI Command Menu', 'Slash-command palette for AI actions.', { status: 'beta', badge: 'ai', since: '2.1' }),
    ],
  },
];

export const catalog: Category[] = rawCatalog.map((cat) => ({
  slug: slugify(cat.name),
  name: cat.name,
  icon: cat.icon,
  blurb: cat.blurb,
  components: cat.components.map((entry) => ({
    slug: slugify(entry.name),
    name: entry.name,
    desc: entry.desc,
    status: entry.status ?? 'stable',
    badge: entry.badge,
    since: entry.since ?? '1.0',
    keywords: entry.keywords ?? '',
  })),
}));

/** Build-time guard: slugs must be unique per category. */
{
  const seen = new Set<string>();
  for (const cat of catalog) {
    for (const comp of cat.components) {
      const key = `${cat.slug}/${comp.slug}`;
      if (seen.has(key)) throw new Error(`Duplicate component slug: ${key}`);
      seen.add(key);
    }
  }
}

export interface CatalogComponent extends ComponentEntry {
  category: string;
  categoryName: string;
  categoryIcon: string;
}

export const allComponents: CatalogComponent[] = catalog.flatMap((cat) =>
  cat.components.map((comp) => ({
    ...comp,
    category: cat.slug,
    categoryName: cat.name,
    categoryIcon: cat.icon,
  })),
);

export const totalComponentCount = allComponents.length;

export function findCategory(categorySlug: string): Category | undefined {
  return catalog.find((cat) => cat.slug === categorySlug);
}

export function findComponent(
  categorySlug: string,
  componentSlug: string,
): { category: Category; component: ComponentEntry } | undefined {
  const category = findCategory(categorySlug);
  if (!category) return undefined;
  const component = category.components.find((entry) => entry.slug === componentSlug);
  return component ? { category, component } : undefined;
}

export function findComponentAnywhere(
  componentSlug: string,
): { category: Category; component: ComponentEntry } | undefined {
  for (const category of catalog) {
    const component = category.components.find((entry) => entry.slug === componentSlug);
    if (component) return { category, component };
  }
  return undefined;
}
