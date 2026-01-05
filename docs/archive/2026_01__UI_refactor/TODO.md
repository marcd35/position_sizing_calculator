# Position Sizing Calculator - Refactoring TODO

## Project Overview
Refactor position sizing calculator from basic HTML/CSS/JS to industry-standard code with proper structure, naming conventions, and type safety while keeping it simple and maintainable.

---

## PHASE 1: Critical Fixes & Setup ⚠️ ✅ COMPLETE
**Goal:** Fix broken functionality and establish foundation

- [x] 1.1 Create missing `dollarcalculator.js` file
- [x] 1.2 Remove WB_wombat wrapper code from calculator.js (lines 1-10)
- [x] 1.3 Test all three calculators to ensure functionality
- [x] 1.4 Create `.gitignore` file
- [x] 1.5 Create `README.md` with project description

---

## PHASE 2: File Organization & Naming Standards ✅ COMPLETE
**Goal:** Establish consistent naming conventions and folder structure

- [x] 2.1 Create proper folder structure:
  ```
  src/
    js/
    css/
    utils/
  public/
    media/
  ```

- [x] 2.2 Rename HTML files to kebab-case:
  - `index.html` → `total-risk-calculator.html`
  - `dollarcalculator.html` → `dollar-risk-calculator.html`
  - `positionpercentcalculator.html` → `position-percent-calculator.html`

- [x] 2.3 Rename JavaScript files to match:
  - `calculator.js` → `total-risk-calculator.js`
  - `dollarcalculator.js` → `dollar-risk-calculator.js`
  - `positionpercentcalculator.js` → `position-percent-calculator.js`

- [x] 2.4 Move files to new structure:
  - JS files → `src/js/`
  - CSS files → `src/css/`
  - HTML files → root (or `public/`)
  - Update all file references in HTML

---

## PHASE 3: CSS Consolidation ✅ COMPLETE
**Goal:** Eliminate 95% CSS duplication

- [x] 3.1 Create `src/css/shared.css` with common styles
- [x] 3.2 Create `src/css/variables.css` for CSS custom properties
- [x] 3.3 Create minimal page-specific CSS files only for unique styles
- [x] 3.4 Update HTML files to reference new CSS structure
- [x] 3.5 Delete old redundant CSS files
- [x] 3.6 Test all pages for visual consistency

---

## PHASE 4: JavaScript Utilities & Code Reuse ✅ COMPLETE
**Goal:** Eliminate ~300 lines of duplicated code

- [x] 4.1 Create `src/utils/clipboard.js`:
  - `copyToClipboard(text, element)` function
  - Shared copy animation logic

- [x] 4.2 Create `src/utils/validators.js`:
  - `validateNumericInput(value, fieldName)` 
  - `validateAllInputs(inputs)`
  - `validatePercentage(value, min, max)`

- [x] 4.3 Create `src/utils/calculators.js`:
  - `determinePositionType(entryPrice, stopLoss)`
  - `calculateRiskPerShare(entryPrice, stopLoss)`
  - Shared calculation helpers

- [x] 4.4 Create `src/utils/formatters.js`:
  - `formatCurrency(value, decimals = 2)`
  - `formatShares(value)`
  - `formatPercentage(value)`

- [x] 4.5 Create `src/utils/dom-helpers.js`:
  - `createHistoryEntry(data, template)`
  - `clearResultFields(fieldIds)`
  - `updateResultFields(results)`

- [x] 4.6 Refactor all three calculator JS files to use utilities
- [x] 4.7 Remove duplicated code from calculators
- [x] 4.8 Test all calculators with new utilities

---

## PHASE 5: Type Safety & Documentation
**Goal:** Add basic type checking without full TypeScript complexity

- [x] 5.1 Add JSDoc comments to all utility functions:
- [x] 5.2 Add JSDoc type annotations to calculator functions
- [x] 5.3 Add `// @ts-check` at top of JS files for VS Code type checking
- [x] 5.4 Create `types.js` with JSDoc typedef comments for complex objects:
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted currency string
   */
  ```

- [x] 5.2 Add JSDoc type annotations to calculator functions
- [x] 5.3 Add `// @ts-check` at top of JS files for VS Code type checking
- [x] 5.4 Create `types.js` with JSDoc typedef comments for complex objects:
  ```javascript
  /**
   * @typedef {Object} CalculationInput
   * @property {number} accountValue
   * @property {number} riskPercentage
   * @property {number} entryPrice
   * @property {number} stopLoss
   * @property {string} [tickerSymbol]
   */
  ```

---

## PHASE 6: Code Quality & Polish
**Goal:** Improve error handling and user experience

- [x] 6.1 Replace `alert()` with custom notification system:
  - Create `src/utils/notifications.js`
  - Build simple toast notification component

- [x] 6.2 Add input sanitization for XSS prevention:
  - Sanitize ticker symbol input before display
  - Use `textContent` instead of `innerHTML` where possible

- [x] 6.3 Extract magic numbers to constants:
  - Create `src/constants.js`
  - Define `RISK_MULTIPLES = { ONE_R: 1, TWO_R: 2, THREE_R: 3 }`

- [x] 6.4 Improve error messages:
  - Replace generic alerts with specific, helpful messages
  - Add field-level validation feedback
  - Focus first invalid field to guide corrections
  - Standardize error copy across calculators
  - Add ARIA attributes (aria-invalid, aria-describedby)
  - Add subtle field hints shown only when invalid

- [x] 6.5 Add keyboard shortcuts:
  - Enter key submits calculation
  - Escape clears form

- [x] 6.6 Improve accessibility:
  - Add ARIA labels to dynamic content
  - Announce calculation results to screen readers

---

## PHASE 7: Optional Enhancements (If Desired)
**Goal:** Modern tooling without overcomplicating

- [x] 7.1 Add `package.json` for dependency management
- [x] 7.2 Add ESLint configuration for code quality
- [x] 7.3 Add Prettier for consistent formatting
- [ ] 7.4 Consider lightweight build tool (optional) — Skipped (keep simple, no bundler):
  - Vite for bundling
  - OR keep it simple with no build step

- [x] 7.5 Add basic unit tests for calculation functions
- [ ] 7.6 Add browser compatibility polyfills if needed

---

## Success Criteria

### Must Have ✅
- All three calculators work correctly
- Zero duplicated code across files
- Consistent naming conventions
- JSDoc type annotations on all functions
- Shared utility modules
- Clean, organized file structure

### Nice to Have 🎯
- TypeScript migration (or JSDoc with `@ts-check`)
- Custom notification system
- Unit tests for calculations
- Build tooling
- ESLint/Prettier setup

---

## Estimated Time per Phase
- Phase 1: 30 minutes
- Phase 2: 45 minutes
- Phase 3: 45 minutes
- Phase 4: 90 minutes
- Phase 5: 45 minutes
- Phase 6: 60 minutes
- Phase 7: 60 minutes (optional)

**Total Core Work: ~4-5 hours**

---

## Skipped Decisions
- Build tooling: Skip Vite or any bundler; keep static HTML/CSS/JS for simplicity.
- TypeScript migration: Keep lightweight JSDoc with `@ts-check` rather than full TS.
- Polyfills: Defer unless a specific browser compatibility issue is reported.

---

## Current Status
- [x] Phases 1–5 complete
- [x] Phase 6 core: notifications, sanitization, constants, shortcuts, a11y
- [x] Field-level validation implemented across calculators
- [x] Focus management added (first invalid field)
- [x] Error messages standardized and ARIA attributes added
- [x] Success toasts added post-calculation
- [ ] Future: refine error copy wording and microcopy tone

## Next Steps
- Refine error copy wording and microcopy tone
- Optional: add browser compatibility polyfills if needed
- Verify pages manually and push changes
