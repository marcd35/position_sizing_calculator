# UI Refactor TODO (Jan 2026)

Scope: Refactor the UI/UX for the calculators to improve hierarchy, reduce cognitive load, modernize interaction (auto-recalc), and add a light-default / dark-optional theme toggle.

Constraints:
- Default theme: **Light**
- Progressive disclosure: use **native `<details>`** (no custom accordion)
- Avoid introducing new colors; reuse existing CSS variables/tokens
- Keep existing element `id`s where possible to avoid breaking JS

---

## Phase 1 — Theme Toggle (Light default)

### UI
- [ ] Add a Light/Dark toggle in the shared header (global)
- [ ] Persist choice in `localStorage` (e.g., `theme = 'light'|'dark'`)
- [ ] Default to **light** when unset

### CSS
- [ ] Add dark theme variable overrides in `src/css/variables.css` via `html[data-theme="dark"] { ... }`
- [ ] Replace hard-coded colors in shared UI with variable-based equivalents:
  - [ ] Replace `white` backgrounds used in layout sections with `var(...)`
  - [ ] Replace `.copyable { color: blue; }` with the primary theme token

Files
- `src/js/layout.js`
- `src/css/variables.css`
- `src/css/shared.css`

Acceptance criteria
- [ ] Toggle changes theme instantly
- [ ] Refresh preserves theme
- [ ] All pages remain readable in dark mode

---

## Phase 2 — Layout: Inputs vs Results (Desktop two-column)

Goal: Inputs and results should no longer visually compete.

- [ ] Add a stable wrapper structure to each calculator page:
  - [ ] `.calculator-grid`
  - [ ] `.calculator-inputs`
  - [ ] `.calculator-results`
- [ ] Implement responsive grid:
  - [ ] Mobile: stacked (inputs then results)
  - [ ] Tablet portrait: stacked (inputs then results), tighter spacing; results remain visually distinct
  - [ ] Tablet landscape: either stacked or two-column (choose breakpoint based on layout fit)
  - [ ] Desktop: two-column (inputs left, results right)

Responsive details
- [ ] Use a single DOM structure across all breakpoints (`.calculator-grid` -> inputs + results); CSS controls layout
- [ ] Pick a single breakpoint for two-column (recommended: start at `min-width: 900px`, adjust after testing)
- [ ] Ensure no horizontal scrolling on mobile/tablet
- [ ] Keep `Advanced (optional)` and `History` collapsed by default to reduce vertical scroll on small screens

Files
- `dollar-risk-calculator.html`
- `total-risk-calculator.html`
- `position-percent-calculator.html`
- `src/css/shared.css`

Acceptance criteria
- [ ] Desktop width shows two-column layout
- [ ] Mobile remains clean and scrollable
- [ ] Tablet portrait has no cramped side-by-side UI (still single column)
- [ ] Tablet landscape layout is readable (no overlap, no horizontal scroll)

---

## Phase 3 — Progressive Disclosure (Advanced)

Use native `<details>` for optional/secondary inputs and optional/secondary sections.

- [ ] Dollar Risk:
  - [ ] Move `Account Size (optional)` + `Ticker Symbol` into `Advanced (optional)`
- [ ] Total Risk %:
  - [ ] Move `Max Positions` + `Ticker Symbol` into `Advanced (optional)`
- [ ] Position %:
  - [ ] Move `Ticker Symbol` into `Advanced (optional)`

Optional (recommended)
- [ ] Collapse `History` behind `<details>` by default

Files
- Calculator HTML files above
- `src/css/shared.css` for `<details>/<summary>` styling

Acceptance criteria
- [ ] Default view shows only primary fields
- [ ] Advanced fields still work and validate

---

## Phase 4 — Results Hierarchy (Risk-dominant)

Goal: Results feel authoritative and non-editable.

- [ ] Make the primary metric visually dominant:
  - [ ] Total Risk %: **Max Loss ($)** is primary
  - [ ] Dollar Risk: **Dollars Risked / Max Loss ($)** is primary
  - [ ] Position %: primary should still communicate risk (where applicable)
- [ ] Styling rules:
  - [ ] Larger numeric value (>= ~18px) for primary
  - [ ] Muted labels (<= ~12px)
  - [ ] No input-like borders on results
  - [ ] Apply `font-variant-numeric: tabular-nums;` to results
- [ ] Demote secondary metrics (e.g., multiple R targets) visually

Files
- `src/css/shared.css`
- Calculator HTML files (to add semantic wrappers/classes if needed)

Acceptance criteria
- [ ] Primary metric is instantly scannable
- [ ] Results clearly look like output, not inputs

---

## Phase 5 — Interaction Modernization (Remove Calculate)

Goal: Recalculate instantly on input changes.

- [ ] Replace explicit Calculate flow with debounced recalculation:
  - [ ] Debounce: 150–300ms
  - [ ] Update results silently (avoid toasts on every keystroke)
- [ ] Keep:
  - [ ] `Clear` button
  - [ ] Enter = compute (optional convenience)
  - [ ] Escape = clear

Files
- `src/js/dollar-risk-calculator.js`
- `src/js/total-risk-calculator.js`
- `src/js/position-percent-calculator.js`

Acceptance criteria
- [ ] Typing updates results without pressing Calculate
- [ ] No excessive toast spam

---

## Phase 6 — Validation Edge Cases (Trust signals)

- [ ] Invalid stop rules:
  - [ ] Long: stop must be below entry
  - [ ] Short: stop must be above entry
- [ ] Disallow calculations when risk is zero/negative
- [ ] Add missing range validations (JS-level, not just HTML attributes)
- [ ] When invalid:
  - [ ] Gray/blank results area
  - [ ] Show a single clear inline error near the field

Files
- `src/js/utils/validators.js`
- `src/js/utils/dom-helpers.js`
- Per-calculator JS

Acceptance criteria
- [ ] Invalid inputs never produce believable-looking results
- [ ] Error messages are clear and located correctly

---

## Phase 7 — “Polish” (No new features)

- [ ] Remove duplicate “support appreciated” copy inside calculators; rely on global footer
- [ ] Ensure `.copyable` results are keyboard accessible (tab + Enter/Space)
- [ ] Ensure label `for` attributes match input `id`s (click targets + a11y)

Files
- Calculator HTML files
- `src/js/utils/clipboard.js`
- `src/css/shared.css`

Acceptance criteria
- [ ] Keyboard-only users can copy results
- [ ] No broken label associations

---

## Definition of Done
- [ ] Theme toggle works (light default)
- [ ] All calculators: two-column desktop layout, progressive disclosure, risk-dominant results
- [ ] Auto-recalc implemented (debounced) + Clear still works
- [ ] Validation edge cases handled; errors block results
- [ ] No visual regressions in mobile layout
- [ ] Tests still pass / outputs unchanged for valid inputs
