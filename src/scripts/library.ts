/**
 * ZAKUIKit — standalone library entry for the distributable bundle.
 *
 * Imports only the public component runtimes. The docs-shell modules
 * (theme switcher, docs UX, playground) are intentionally excluded so the
 * bundle can be dropped into any page. Every module below is self-
 * initialising; the controllers layer adds the named-export API
 * (`import { ZakButton, ZakModal } from 'zakuikit'`) plus `ZakUI.init()`.
 */
import './overlays';
import './behaviors';
import './calendar';
import './pickers';
import './media';
import './ai';
import './charts';
import './grid';
import './controllers';

export { snackbar, toast } from './behaviors';
export { createChart, renderChart, scanCharts } from './charts';
export type { ChartConfig, ChartDataset, ChartOptions, ZakChartInstance } from './charts';
export { ZakCarousel } from './media';
export type { ZakCarouselOptions } from './media';
export * from './controllers';
