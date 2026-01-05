# Changelog

All notable changes to the Position Sizing Calculator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-01-05

Major UI/UX overhaul with modern design system, theme support, and enhanced user experience.

### Added

- **Theme System**: Three theme modes (Light, Dark, Grayscale) with persistent localStorage-based switching
- **Auto-Calculation**: Real-time results update as you type (300ms debounce)
- **Progressive Disclosure**: Advanced/optional inputs collapsed by default using native `<details>` elements
- **Responsive Two-Column Layout**: Desktop users see inputs and results side-by-side (900px+ breakpoint)
- **Keyboard Shortcuts**: Enter to calculate, Escape to clear
- **Position Type Indicator**: Visual badge showing LONG/SHORT with color coding
- **Calculation History**: Timestamped history with expandable details
- **Copy to Clipboard**: Click any blue result value to copy
- **Toast Notifications**: Non-intrusive feedback for user actions
- **CSS Custom Properties**: Comprehensive design token system for consistent theming
- **Accessibility Enhancements**: 
  - ARIA live regions for screen reader announcements
  - Improved keyboard navigation
  - High contrast support
  - Focus visible indicators
- **Mobile Optimization**: Responsive from 320px to 4K displays
- **Target Price Calculations**: 1R, 2R, 3R profit targets for position planning

### Changed

- **UI Design**: Modern, professional financial interface with card-based layouts
- **Typography**: Switched to Inter font for UI, JetBrains Mono for numeric values
- **Color System**: Refined color palette with semantic tokens
- **Button Styling**: Pill-shaped buttons with gradient backgrounds and hover effects
- **Input Fields**: Larger, more accessible input fields with focus states
- **Results Display**: Clearer hierarchy emphasizing risk metrics
- **Navigation**: Shared header/footer system across all pages
- **Code Organization**: 
  - Consolidated CSS (eliminated 95% duplication)
  - Extracted shared utilities to reusable modules
  - Separated concerns (calculators, validators, formatters, DOM helpers)
- **File Structure**: Organized into logical directories (src/css, src/js, src/utils)

### Fixed

- Validation logic for long vs short positions (stop must be below entry for long, above for short)
- Edge cases where risk per share could be zero or negative
- Mobile menu scrolling and touch interaction
- Theme persistence across page navigation
- Input validation error messages now more descriptive

### Documentation

- New [DEVELOPER.md](docs/DEVELOPER.md): Comprehensive developer documentation
- New [DEPLOYMENT.md](docs/DEPLOYMENT.md): Hosting and deployment guide
- New [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md): Design patterns and component library
- Updated [README.md](README.md): User-friendly overview for traders
- Archived UI refactor documentation to [docs/archive/](docs/archive/)

### Technical Improvements

- Removed TypeScript `@ts-check` directives (caused false positive errors)
- Deleted obsolete `calculator.js` from root
- Updated ESLint configuration for cleaner linting
- Removed debug `console.log` statements
- Improved debounce implementation for auto-calculation
- Enhanced XSS prevention with comprehensive HTML sanitization
- Better error handling for clipboard operations

### Performance

- Reduced CSS file size through consolidation
- Optimized DOM manipulation with cached element references
- Debounced calculation prevents unnecessary recomputation
- Lightweight vanilla JavaScript (no frameworks)

---

## [1.0.0] - 2024-12-01

Initial release of the Position Sizing Calculator.

### Added

- **Three Calculator Methods**:
  1. Total Account Risk % - Risk a percentage of your account
  2. Dollar Risk - Risk a fixed dollar amount
  3. Position % - Allocate a percentage of capital
- **Core Calculations**:
  - Maximum shares to buy
  - Position size in dollars
  - Risk per share
  - Dollars risked
  - Position size as % of account
- **Position Type Detection**: Automatic Long/Short detection based on entry vs stop
- **Basic Validation**: Input validation for numeric values
- **Calculation History**: Simple history tracking
- **Mobile Responsive**: Basic responsive design
- **Browser Testing**: Simple HTML-based unit tests
- **Documentation**: 
  - README with usage instructions
  - Inline calculator instructions
  - Code comments

### Technical Stack

- Pure HTML, CSS, and JavaScript
- No build process required
- No external dependencies
- Works offline after initial load
- Client-side only (no backend)

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible changes
- **MINOR** version for backwards-compatible new features
- **PATCH** version for backwards-compatible bug fixes

## Links

- [Repository](https://github.com/marcd35/position_sizing_calculator)
- [Live Site](https://marcd35.github.io/position_sizing_calculator/)
- [r/swingtrading Community](https://www.reddit.com/r/swingtrading/)
- [Discord](https://discord.gg/yWFavAVQpm)
- [Support](https://buymeacoffee.com/rswingtrading)
