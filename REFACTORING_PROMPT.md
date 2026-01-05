# Position Sizing Calculator - Refactoring Context

**Use this prompt when starting a new context window to continue refactoring work.**

---

## Project Summary

This is a position sizing calculator for swing traders with three calculation methods:
1. **Total Risk Calculator** (`index.html`) - Calculate position size based on account risk percentage
2. **Dollar Risk Calculator** (`dollarcalculator.html`) - Calculate position size based on fixed dollar risk
3. **Position Percent Calculator** (`positionpercentcalculator.html`) - Calculate position size based on portfolio allocation percentage

**Current State:** Basic HTML/CSS/JavaScript application with significant code duplication and inconsistent structure.

**Refactoring Goal:** Modernize to industry standards while keeping it simple - shared utilities, consistent naming, type safety via JSDoc, no duplication.

---

## Current File Structure

```
positionsizingcalculator/
├── index.html                        # Calculator 1: Total Account Risk %
├── dollarcalculator.html            # Calculator 2: Dollar Risk (MISSING .js file)
├── positionpercentcalculator.html   # Calculator 3: Position %
├── calculator.js                     # For index.html (has WB_wombat wrapper to remove)
├── positionpercentcalculator.js     # For positionpercentcalculator.html
├── calculator.css                    # Shared CSS (95% duplicated with below)
├── positionpercentcalculator.css    # CSS for position percent (95% duplicate)
├── media/                           # Images and icons
├── TODO.md                          # Phase-by-phase refactoring plan
└── REFACTORING_PROMPT.md           # This file
```

---

## Key Issues Identified

### Critical Issues ⚠️
1. **Missing File:** `dollarcalculator.js` doesn't exist (calculator is broken)
2. **Code Pollution:** Lines 1-10 of `calculator.js` contain Wayback Machine wrapper code that must be removed
3. **No Type Safety:** Plain JavaScript with no type checking

### Major Issues 🔴
4. **~300 Lines of Duplicated Code:**
   - Copy-to-clipboard logic duplicated in 3 places (inline scripts in all HTML files)
   - Position type detection logic duplicated in 2 JS files
   - Validation logic duplicated in 2 JS files
   - History HTML generation duplicated in 2 JS files
   - Number formatting logic duplicated throughout

5. **95% CSS Duplication:**
   - `calculator.css` and `positionpercentcalculator.css` are nearly identical
   - Only difference is ~58 lines for slider-specific styles

6. **Inconsistent Naming:**
   - HTML: lowercase, no separators (`positionpercentcalculator.html`)
   - JS: Mixed patterns (`calculator.js` vs `positionpercentcalculator.js`)
   - No standard convention followed

### Medium Issues 🟡
7. **No Module System:** All code in global scope
8. **Mixed Event Handling:** Some use `onclick` attributes, others use event listeners
9. **Hardcoded HTML in JS:** Template strings for history generation
10. **Magic Numbers:** No constants file (e.g., `2` and `3` for R-multiples)
11. **Weak Error Handling:** Generic `alert()` messages, no try-catch blocks
12. **No Input Sanitization:** XSS vulnerability with ticker symbol display

---

## Target Architecture (Keep Simple)

```
positionsizingcalculator/
├── src/
│   ├── js/
│   │   ├── total-risk-calculator.js
│   │   ├── dollar-risk-calculator.js
│   │   └── position-percent-calculator.js
│   ├── css/
│   │   ├── variables.css          # CSS custom properties
│   │   ├── shared.css              # Common styles
│   │   └── components.css          # Specific overrides
│   ├── utils/
│   │   ├── clipboard.js            # Copy-to-clipboard logic
│   │   ├── validators.js           # Input validation
│   │   ├── calculators.js          # Shared calculation logic
│   │   ├── formatters.js           # Number formatting
│   │   ├── dom-helpers.js          # DOM manipulation utilities
│   │   └── notifications.js        # Toast notifications (replace alert)
│   ├── types.js                    # JSDoc typedef declarations
│   └── constants.js                # Magic numbers and config
├── public/
│   └── media/                      # Images and icons
├── total-risk-calculator.html
├── dollar-risk-calculator.html
├── position-percent-calculator.html
├── README.md
├── .gitignore
└── TODO.md
```

---

## Refactoring Phases (See TODO.md)

**Phase 1:** Critical Fixes (create missing file, remove wrapper, test)
**Phase 2:** File Organization & Naming Standards (rename files, create folders)
**Phase 3:** CSS Consolidation (merge duplicate CSS)
**Phase 4:** JavaScript Utilities & Code Reuse (extract shared logic)
**Phase 5:** Type Safety & Documentation (JSDoc annotations, @ts-check)
**Phase 6:** Code Quality & Polish (notifications, sanitization, constants)
**Phase 7:** Optional Enhancements (ESLint, Prettier, tests)

---

## Code Patterns to Extract

### 1. Copy-to-Clipboard (Currently duplicated 3x in inline scripts)
```javascript
// Target utility function
export function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(() => {
        showCopyFeedback(element);
    });
}
```

### 2. Position Type Detection (Currently duplicated 2x)
```javascript
// Target utility function
/**
 * @param {number} entryPrice
 * @param {number} stopLoss
 * @returns {'Long'|'Short'|'Invalid'}
 */
export function determinePositionType(entryPrice, stopLoss) {
    if (entryPrice > stopLoss) return 'Long';
    if (stopLoss > entryPrice) return 'Short';
    return 'Invalid';
}
```

### 3. Validation (Currently duplicated 2x)
```javascript
// Target utility function
/**
 * @param {Object.<string, number>} inputs
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validateInputs(inputs) {
    const errors = [];
    for (const [field, value] of Object.entries(inputs)) {
        if (isNaN(value) || value === null) {
            errors.push(`${field} must be a valid number`);
        }
    }
    return { valid: errors.length === 0, errors };
}
```

### 4. Number Formatting (Currently inconsistent)
```javascript
// Target utility functions
export const formatCurrency = (value, decimals = 2) => value.toFixed(decimals);
export const formatShares = (value) => value.toFixed(4);
export const formatPercentage = (value, decimals = 2) => value.toFixed(decimals);
```

---

## JSDoc Type Definitions to Create

```javascript
/**
 * @typedef {Object} CalculationInput
 * @property {number} accountValue
 * @property {number} riskPercentage
 * @property {number} entryPrice
 * @property {number} stopLoss
 * @property {number} [maxPositions]
 * @property {string} [tickerSymbol]
 */

/**
 * @typedef {Object} CalculationResult
 * @property {number} maxShares
 * @property {number} positionSize
 * @property {number} riskPerShare
 * @property {number} percentRisked
 * @property {number} dollarsRisked
 * @property {'Long'|'Short'} positionType
 */

/**
 * @typedef {Object} RiskMultiples
 * @property {number} oneR
 * @property {number} twoR
 * @property {number} threeR
 */
```

---

## Critical Code to Remove

### From calculator.js (Lines 1-10):
```javascript
// DELETE THIS ENTIRE BLOCK - It's Wayback Machine wrapper code
var _____WB$wombat$assign$function_____=function(name){return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name))||self[name];};
if(!self.__WB_pmw){self.__WB_pmw=function(obj){this.__WB_source=obj;return this;}}{
let window = _____WB$wombat$assign$function_____("window");
let self = _____WB$wombat$assign$function_____("self");
let document = _____WB$wombat$assign$function_____("document");
let location = _____WB$wombat$assign$function_____("location");
let top = _____WB$wombat$assign$function_____("top");
let parent = _____WB$wombat$assign$function_____("parent");
let frames = _____WB$wombat$assign$function_____("frames");
let opens = _____WB$wombat$assign$function_____("opens");
```

Also remove the closing `}` at the very end of the file.

---

## Development Approach

1. **Keep It Simple:** No unnecessary complexity or over-engineering
2. **No Build Step Required:** Use vanilla JS with ES6 modules (or simple script tags)
3. **Type Safety via JSDoc:** Add `// @ts-check` at top of files for VS Code checking
4. **Progressive Enhancement:** Each phase should leave code in working state
5. **Test After Each Phase:** Verify all three calculators work before proceeding

---

## What To Work On Next

Check `TODO.md` for current phase and unchecked items. Start with Phase 1 if just beginning.

### Quick Start Commands

```bash
# See current progress
cat TODO.md

# Check current file structure
ls -R

# Test if calculators work
# Open each HTML file in browser and test calculations
```

---

## Questions for User Before Starting

1. **Scope:** Which phase should we focus on first? (Recommend starting with Phase 1)
2. **Tooling:** Keep it simple with no build tools, or add npm/Vite? (Recommend keeping simple)
3. **TypeScript:** Full TS migration or just JSDoc? (Recommend JSDoc only - simpler)
4. **Deployment:** Are these static files deployed as-is or through a build process?

---

## Success Metrics

- ✅ All three calculators functional
- ✅ Zero code duplication
- ✅ Consistent kebab-case naming
- ✅ All functions have JSDoc type annotations
- ✅ Shared utility modules for common logic
- ✅ Clean, organized folder structure
- ✅ No global scope pollution
- ✅ Input sanitization for security
- ✅ User-friendly error messages

**Current Score: 3/10 → Target Score: 9/10**
