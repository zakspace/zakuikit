# ZAKUIKit

A modern, lightweight UI toolkit built with HTML, CSS and JavaScript.

## Features

- **Lightweight** - Full CSS ships at ~30KB gzipped. No build step, no CDN required.
- **No Dependencies** - Pure vanilla HTML, CSS and JavaScript.
- **Dark Mode** - Built-in light/dark/system theme support via the `data-theme` attribute.
- **Responsive** - Mobile-first with 5 breakpoints (sm, md, lg, xl, 2xl).
- **140 Components** - Across 15 categories, including foundations and layout.
- **Accessible** - Keyboard navigation and ARIA support.
- **Customizable** - CSS custom properties for easy theming.

## Quick Start

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App</title>
    <link rel="stylesheet" href="dist/css/zak.css">
    <link rel="stylesheet" href="dist/icons/icons.css">
</head>
<body>
    <button class="zak-btn zak-btn-primary">Hello World</button>
    <script src="dist/js/zak.js"></script>
</body>
</html>
```

For production, swap `dist/css/zak.css` for `dist/css/zak.min.css`.

## Project Structure

```
zak-uikit/
+-- dist/
ï¿½   +-- css/zak.css, zak.min.css      # Framework styles (min + unminified)
ï¿½   +-- js/zak.js                     # Framework behaviors
ï¿½   +-- js/zak.min.js                 # Framework behaviors (minified)
ï¿½   +-- icons/zak-icons.svg, icons.css
ï¿½   +-- data/zak-components.json      # Single source of truth (140 components, 15 categories)
ï¿½   +-- components/                   # 140 registry-driven documentation pages
ï¿½       +-- ai/                               # AI Avatar, AI Button, AI Command Menu, etc.
ï¿½       +-- buttons/                          # Button, Button Group, Button Toolbar, etc.
ï¿½       +-- data-display/                     # Activity Feed, Avatar, Avatar Group, etc.
ï¿½       +-- data-grid/                        # Column Selector, File Manager, Query Builder, etc.
ï¿½       +-- data-visualization/               # Charts, Dashboard Widget, Filter Panel, etc.
ï¿½       +-- disclosure-expansion/             # Accordion, Collapse, Details, etc.
ï¿½       +-- feedback/                         # Alert, Banner, Empty State, etc.
ï¿½       +-- forms/                            # Autocomplete, Checkbox, Combobox, etc.
ï¿½       +-- foundations/                      # Borders, Colors, Icons, etc.
ï¿½       +-- layout/                           # Aspect Ratio, Box, Columns, etc.
ï¿½       +-- media/                            # Audio, Carousel, Image, etc.
ï¿½       +-- navigation/                       # Breadcrumb, Dropdown Menu, Nav Menu, etc.
ï¿½       +-- overlays/                         # Context Menu, Drawer, Dropdown, Modal, etc.
ï¿½       +-- pickers/                          # Calendar, Cascader, Color Picker, etc.
ï¿½       +-- tables/                           # Advanced Data Grid, Data Grid, Data Table, etc.
+-- css/                              # Documentation site CSS
+-- js/                               # Documentation site scripts (docs.js, registry-driven sidebar)
+-- img/                              # Logos and favicons
+-- index.html                        # Landing page
+-- getting-started.html              # Getting started guide
+-- utilities.html                    # Utility classes reference
+-- templates.html                    # Template gallery
+-- icons.html                        # Icon reference
+-- components.html                  # Component gallery
+-- README.md
```

## Component Categories

| Category | Components | Description |
|----------|-----------|-------------|
| AI | 14 | AI Avatar, AI Button, AI Command Menu, AI Input, etc. |
| Buttons | 6 | Button, Button Group, Button Toolbar, Floating Action Button, etc. |
| Data Display | 13 | Activity Feed, Avatar, Avatar Group, Badge, etc. |
| Data Grid | 4 | Column Selector, File Manager, Query Builder, Transfer |
| Data Visualization | 4 | Charts, Dashboard Widget, Filter Panel, KPI Card |
| Disclosure Expansion | 5 | Accordion, Collapse, Details, Expandable Panel, etc. |
| Feedback | 17 | Alert, Banner, Empty State, Error State, etc. |
| Forms | 22 | Autocomplete, Checkbox, Combobox, File Upload, etc. |
| Foundations | 7 | Borders, Colors, Icons, Responsive, etc. |
| Layout | 8 | Aspect Ratio, Box, Columns, Container, etc. |
| Media | 8 | Audio, Carousel, Image, Image Gallery, etc. |
| Navigation | 8 | Breadcrumb, Dropdown Menu, Nav Menu, Navbar, etc. |
| Overlays | 7 | Context Menu, Drawer, Dropdown, Modal, etc. |
| Pickers | 9 | Calendar, Cascader, Color Picker, Date Picker, etc. |
| Tables | 6 | Advanced Data Grid, Data Grid, Data Table, Search Filter, etc. |

**Total: 138 component pages across 15 categories**

## Sizes

| File | Raw | Gzipped |
|------|------|---------|
| `dist/css/zak.css` | 376 KB | 52 KB |
| `dist/css/zak.min.css` | 319 KB | 43 KB |
| `dist/js/zak.js` | 196 KB | 33 KB |
| `dist/js/zak.min.js` | 121 KB | 25 KB |
| `js/docs.js` (docs site only) | 49 KB | 10 KB |
| `dist/icons/icons.css` | 131 KB | 8 KB |

## Theming

ZAKUIKit supports light, dark, and system themes:

```html
<html data-theme="light">
<html data-theme="dark">
```

```javascript
zak.theme.set('dark');
zak.theme.toggle();
zak.theme.get(); // 'light' | 'dark' | 'system'
```

## Browser Support

- Chrome 80+
- Firefox 78+
- Safari 14+
- Edge 80+
- Opera 67+

## License

MIT
