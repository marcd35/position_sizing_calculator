# Developer Documentation

This document provides technical information for developers who want to understand, maintain, or contribute to the Position Sizing Calculator project.

## Table of Contents

- [Project Architecture](#project-architecture)
- [File Structure](#file-structure)
- [Development Setup](#development-setup)
- [Code Organization](#code-organization)
- [Testing](#testing)
- [Console Errors](#console-errors)
- [Build & Deploy](#build--deploy)
- [Contributing](#contributing)

## Project Architecture

The Position Sizing Calculator is built as a **pure client-side application** with no backend dependencies. It uses vanilla JavaScript, CSS, and HTML with a modular architecture.

### Design Principles

1. **No Build Step Required** - Works directly in browsers without compilation
2. **Progressive Enhancement** - Core functionality works without JavaScript, enhanced with JS
3. **Shared Utilities** - Common functions extracted to utility modules
4. **Theme System** - CSS custom properties enable dynamic theming
5. **Accessibility First** - ARIA labels, keyboard navigation, screen reader support

### Key Technologies

- **HTML5** - Semantic markup with accessibility attributes
- **CSS3** - Custom properties (CSS variables), Grid, Flexbox
- **Vanilla JavaScript** - ES5/ES6 features, no frameworks
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting

## File Structure

```
positionsizingcalculator/
├── index.html                          # Landing page (redirect to calculator)
├── total-risk-calculator.html          # Method 1: Total Risk %
├── dollar-risk-calculator.html         # Method 2: Dollar Risk
├── position-percent-calculator.html    # Method 3: Position %
├── calculatorinstructions.html         # User documentation / FAQ
├── README.md                           # User-facing documentation
├── CHANGELOG.md                        # Version history
├── package.json                        # NPM dependencies and scripts
├── eslint.config.js                    # ESLint configuration
├──  .prettierrc                        # Prettier formatting rules
│
├── src/
│   ├── constants.js                    # Global constants (RISK_MULTIPLES)
│   ├── types.js                        # JSDoc type definitions
│   │
│   ├── css/
│   │   ├── variables.css               # CSS custom properties (theme tokens)
│   │   ├── shared.css                  # Shared styles for all calculators
│   │   ├── shared-modern.css           # Modern enhancements (unused)
│   │   └── position-percent-specific.css  # Slider styles for Method 3
│   │
│   ├── js/
│   │   ├── layout.js                   # Shared header/footer/theme system
│   │   ├── dollar-risk-calculator.js   # Method 2 logic
│   │   ├── total-risk-calculator.js    # Method 1 logic
│   │   └── position-percent-calculator.js  # Method 3 logic
│   │
│   └── utils/
│       ├── calculators.js              # Core calculation functions
│       ├── validators.js               # Input validation
│       ├── formatters.js               # Number/currency formatting
│       ├── sanitization.js             # XSS prevention
│       ├── dom-helpers.js              # DOM manipulation utilities
│       ├── clipboard.js                # Copy-to-clipboard functionality
│       └── notifications.js            # Toast notification system
│
├── public/
│   └── media/
│       └── rswingtrading_icon.jpg      # Favicon and branding
│
├── tests/
│   ├── calculators.test.html           # Browser-based unit tests
│   └── calculators.test.js             # Test assertions
│
└── docs/
    ├── DEVELOPER.md                    # This file
    ├── DEPLOYMENT.md                   # Hosting and deployment guide
    ├── DESIGN_SYSTEM.md                # Design system and patterns
    ├── PRODUCTION_CHECKLIST.md         # Pre-production validation
    │
    └── archive/
        └── 2026_01__UI_refactor/       # Historical refactor documentation
```

## Development Setup

### Prerequisites

- **Node.js** (v14+ recommended)
- **npm** (comes with Node.js)
- A modern web browser
- A code editor (VS Code recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/marcd35/position_sizing_calculator.git
cd positionsizingcalculator

# Install development dependencies
npm install
```

### Development Workflow

```bash
# Format all code with Prettier
npm run format

# Lint JavaScript files
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Run tests (open in browser)
# Open tests/calculators.test.html in your browser
```

### Live Development

Since this is a static site with no build step:

1. Open any HTML file directly in your browser
2. Or use a simple local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (if you have http-server installed)
npx http-server -p 8000
```

Then visit `http://localhost:8000`

## Code Organization

### Global Utilities

All utility functions are loaded globally via `<script>` tags in HTML files. This allows them to be shared across calculators without a module bundler.

**Example from `total-risk-calculator.html`:**
```html
<script src="src/constants.js"></script>
<script src="src/utils/validators.js"></script>
<script src="src/utils/formatters.js"></script>
<script src="src/utils/sanitization.js"></script>
<script src="src/utils/calculators.js"></script>
<script src="src/utils/dom-helpers.js"></script>
<script src="src/utils/clipboard.js"></script>
<script src="src/utils/notifications.js"></script>
<script src="src/js/total-risk-calculator.js"></script>
```

### Utility Modules

| Module | Purpose | Key Functions |
|--------|---------|---------------|
| `calculators.js` | Core position sizing math | `determinePositionType()`, `calculateRiskPerShare()`, `calculateTargets()` |
| `validators.js` | Input validation | `isValidNumber()`, `validateRiskInputs()` |
| `formatters.js` | Display formatting | `formatCurrency()`, `formatNumber()` |
| `sanitization.js` | XSS prevention | `escapeHTML()` |
| `dom-helpers.js` | DOM manipulation | `updateElement()`, `updateDisplay()`, `clearResults()` |
| `clipboard.js` | Copy functionality | `initClipboard()` |
| `notifications.js` | Toast messages | `notify()` |

### Calculator Page Structure

Each calculator follows this pattern:

1. **DOM Ready Event** - Wait for page load
2. **Element References** - Cache DOM elements
3. **Event Listeners** - Input changes, button clicks, keyboard shortcuts
4. **Debounced Calculation** - Auto-recalculate on input (300ms debounce)
5. **Validation** - Check inputs before calculation
6. **Calculation** - Compute results using utility functions
7. **Display Update** - Render results to DOM
8. **History Management** - Add to calculation history

### Theme System

Themes are managed via CSS custom properties and HTML data attributes.

**Implementation:** `src/js/layout.js`

```javascript
// Theme is stored in localStorage
const theme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', theme);
```

**CSS Variables:** `src/css/variables.css`

```css
:root {
  --primary-color: #3b82f6;
  --background-color: #f8fafc;
  /* ... */
}

html[data-theme="dark"] {
  --primary-color: #3b82f6;
  --background-color: #0a0e1a;
  /* ... */
}
```

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for complete theme documentation.

## Testing

### Browser-Based Unit Tests

The project uses a simple browser-based testing approach without external frameworks.

**Location:** `tests/calculators.test.html`

**Run Tests:**
1. Open `tests/calculators.test.html` in a browser
2. View pass/fail results in the page
3. Check browser console for detailed output

**Test Coverage:**
- ✅ `determinePositionType()` - Long/Short/Invalid detection
- ✅ `calculateRiskPerShare()` - Risk calculation accuracy
- ✅ `calculateTargets()` - 1R/2R/3R target prices for long and short

**Why Browser Tests?**
- No test runner dependencies
- Tests the actual browser environment
- Easy to debug with DevTools
- Matches production environment exactly

### Manual Testing Checklist

Before deploying changes, test:

- [ ] All three calculator pages load without errors
- [ ] Input validation works (invalid numbers, stop > entry for long, etc.)
- [ ] Results calculate correctly for sample inputs
- [ ] Clipboard copy works on all blue result values
- [ ] Theme switcher persists across page reloads
- [ ] Keyboard shortcuts work (Enter = calculate, Escape = clear)
- [ ] Mobile responsive layout displays correctly
- [ ] Calculation history saves and displays
- [ ] Navigation menu works on all pages

## Console Errors

### Expected Console Output

Some console errors are **expected and acceptable** in production:

#### ✅ Clipboard Error Logging

**File:** `src/utils/clipboard.js`

```javascript
// Line 49 - Expected error when clipboard API fails
console.error('Failed to copy: ', err);

// Line 81 - Expected error when fallback copy fails
console.error('Fallback: Oops, unable to copy', err);
```

**Why acceptable:** These errors only appear when:
1. User denies clipboard permissions
2. Browser doesn't support clipboard API
3. Copy operation is blocked by security policy

The app handles these gracefully with user notifications.

### Debugging Console Errors

If you see unexpected console errors:

1. **Check browser DevTools** - Network tab, Console tab, Sources tab
2. **Verify script load order** - Utilities must load before calculator scripts
3. **Check for typos** - Function names, variable names, DOM IDs
4. **Use ESLint** - Run `npm run lint` to catch common issues

## Build & Deploy

### No Build Step Required

This project has **no build step**. All files are production-ready as-is.

### Pre-Deployment Checklist

See [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) for the complete checklist.

**Quick Checklist:**
```bash
# 1. Lint and format code
npm run lint:fix
npm run format

# 2. Verify no ESLint errors
npm run lint

# 3. Test in browser
# Open each calculator page and test functionality

# 4. Check for console errors
# Open DevTools console on each page

# 5. Test on mobile
# Use browser DevTools device emulation
```

### Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for hosting configuration and deployment instructions.

## Contributing

### Code Style

- **JavaScript:** Follow ESLint rules in `eslint.config.js`
- **Formatting:** Use Prettier (run `npm run format`)
- **Naming:** 
  - Functions: `camelCase` (e.g., `calculateRiskPerShare`)
  - Constants: `UPPER_SNAKE_CASE` (e.g., `ERROR_MESSAGES`)
  - CSS classes: `kebab-case` (e.g., `copyable`, `result-item`)
  - CSS variables: `--kebab-case` (e.g., `--primary-color`)

### JSDoc Comments

All functions should have JSDoc comments:

```javascript
/**
 * Calculates risk per share based on entry and stop prices
 * @param {number} entry - Entry price
 * @param {number} stop - Stop loss price
 * @returns {number} Risk per share (absolute value)
 */
function calculateRiskPerShare(entry, stop) {
    return Math.abs(entry - stop);
}
```

### Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test thoroughly
3. Run linting and formatting: `npm run lint:fix && npm run format`
4. Commit with descriptive messages
5. Push and create a pull request

### Adding New Features

When adding features:

1. **Extract reusable code** to utility modules
2. **Update all three calculators** if the feature is global
3. **Add tests** to `tests/calculators.test.js`
4. **Update documentation** in relevant MD files
5. **Test accessibility** (keyboard navigation, screen readers)
6. **Test themes** (light, dark, grayscale)
7. **Test mobile** responsiveness

## Support

For questions or issues:

- **GitHub Issues:** [Report bugs or request features](https://github.com/marcd35/position_sizing_calculator/issues)
- **Reddit:** [r/swingtrading](https://www.reddit.com/r/swingtrading/)
- **Discord:** [Join the community](https://discord.gg/yWFavAVQpm)

## Additional Resources

- [DEPLOYMENT.md](DEPLOYMENT.md) - Hosting and deployment guide
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) - Design patterns and component library
- [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) - Pre-deployment validation
- [CHANGELOG.md](../CHANGELOG.md) - Version history and release notes
