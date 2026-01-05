# Production Readiness Checklist

Use this checklist to verify the Position Sizing Calculator is ready for production deployment.

## Code Quality

- [x] **Remove @ts-check directives** - Removed from all 12 JavaScript files
- [x] **Delete obsolete files** - Removed `calculator.js` from root
- [x] **Remove debug logging** - Removed `console.log` statements from production code
- [x] **Run Prettier formatting** - All files formatted consistently
- [x] **Run ESLint** - Linting passed (warnings are expected for global utility functions)
- [x] **Fix HTML syntax errors** - All HTML files pass validation

### Expected ESLint Warnings

The following warnings are **expected and acceptable**:

**Utility Functions (Global Scope):**
- `src/utils/calculators.js` - Functions used globally across all calculators
- `src/utils/clipboard.js` - `initClipboard()` called from calculator pages
- `src/utils/dom-helpers.js` - Functions used globally
- `src/utils/formatters.js` - Functions used globally
- `src/utils/sanitization.js` - `escapeHTML()` used globally
- `src/utils/validators.js` - Functions used globally

**Reason:** These are loaded via `<script>` tags and used across different files. ESLint sees them as unused in their definition files but they're called from calculator scripts.

**Unused Variables:**
- `resultContainer` in calculator files - Reserved for future enhancements
- `themeButtonLabel` in layout.js - Accessibility enhancement (may be used by assistive tech)
- `setRisk` in total-risk-calculator.js - Legacy function, safe to remove if confirmed unused

## Documentation

- [x] **README.md** - User-friendly overview for traders
- [x] **DEVELOPER.md** - Comprehensive developer documentation
- [x] **DEPLOYMENT.md** - Hosting and deployment guide
- [x] **DESIGN_SYSTEM.md** - Design patterns and component library
- [x] **CHANGELOG.md** - Version history in Keep a Changelog format
- [x] **Archive refactor docs** - Moved to `/docs/archive/2026_01__UI_refactor/`

## File Structure

- [x] **HTML files in root** - `total-risk-calculator.html`, `dollar-risk-calculator.html`, `position-percent-calculator.html`, `calculatorinstructions.html`
- [x] **Source organization** - `src/css/`, `src/js/`, `src/utils/`
- [x] **Public assets** - `public/media/`
- [x] **Tests** - `tests/` directory
- [x] **Documentation** - `/docs/` directory

## Browser Testing

Test the following in at least Chrome/Edge, Firefox, and Safari:

### All Three Calculators

- [ ] **Total Risk % Calculator** loads without errors
- [ ] **Dollar Risk Calculator** loads without errors
- [ ] **Position % Calculator** loads without errors
- [ ] **Instructions Page** loads and navigation works

### Core Functionality

- [ ] **Input validation** - Invalid values show error states
- [ ] **Auto-calculation** - Results update as you type (300ms debounce)
- [ ] **Position detection** - Long/Short positions correctly identified
- [ ] **Risk calculations** - Math is accurate (verify with test cases)
- [ ] **Clipboard copy** - Click blue values to copy
- [ ] **History tracking** - Calculations save to history
- [ ] **Clear button** - Resets form without saving to history
- [ ] **Submit button** - Calculates and saves to history

### Theme System

- [ ] **Light theme** - Displays correctly (default)
- [ ] **Dark theme** - Switches correctly and displays well
- [ ] **Grayscale theme** - Switches correctly and displays well
- [ ] **Theme persistence** - Reloading page maintains theme choice
- [ ] **Theme switcher** - All three buttons work

### Keyboard Navigation

- [ ] **Enter key** - Triggers calculation
- [ ] **Escape key** - Clears form
- [ ] **Tab navigation** - Can navigate through all inputs
- [ ] **Focus states** - Visible focus indicators on all interactive elements

### Responsive Design

Test at these breakpoints:

- [ ] **Mobile (320px)** - Layout works, no horizontal scroll
- [ ] **Mobile (375px)** - iPhone standard size
- [ ] **Tablet Portrait (768px)** - Single column layout
- [ ] **Desktop (900px)** - Two-column layout (inputs left, results right)
- [ ] **Large Desktop (1200px)** - Maximum width constraint

### Navigation & Links

- [ ] **Calculator nav** - All four pages accessible
- [ ] **Instructions links** - Method-specific links work
- [ ] **Back to top** links work
- [ ] **External links** - Reddit, Discord, support links open correctly
- [ ] **Footer** - Displays on all pages

## Accessibility

- [ ] **ARIA live regions** - Screen reader announces result updates
- [ ] **Keyboard shortcuts** work without mouse
- [ ] **Focus visible** - Clear focus indicators
- [ ] **Alt text** - Images have alt attributes
- [ ] **Semantic HTML** - Proper use of headings, labels, buttons
- [ ] **Color contrast** - Meets WCAG AA standards
- [ ] **Screen reader** - Test with NVDA/JAWS (Windows) or VoiceOver (Mac)

## Edge Cases & Validation

- [ ] **Stop < Entry (Long)** - Shows error or prevents calculation
- [ ] **Stop > Entry (Short)** - Shows error or prevents calculation
- [ ] **Zero values** - Handled gracefully
- [ ] **Negative values** - Rejected or handled
- [ ] **Very large numbers** - No crashes or display issues
- [ ] **Decimal precision** - Results display correctly (2 decimal places for currency)
- [ ] **Empty fields** - Validation requires necessary inputs

## Performance

- [ ] **Page load time** - < 2 seconds on 3G
- [ ] **No console errors** - Check DevTools console on all pages
- [ ] **No 404 errors** - Check Network tab for missing resources
- [ ] **Responsive to input** - Auto-calc feels smooth, not laggy
- [ ] **Memory usage** - No leaks (test extended use)

## Security

- [ ] **XSS prevention** - HTML sanitization works (test with `<script>` in inputs)
- [ ] **HTTPS** - Site is served over HTTPS
- [ ] **CSP headers** - Content Security Policy configured (optional but recommended)
- [ ] **No credentials** - No API keys or secrets in client code

## Analytics & Monitoring

- [ ] **Google Analytics** - Tracking ID configured and working
- [ ] **Page views** - Verify tracking in GA dashboard
- [ ] **No PII** - No personal information tracked

## Pre-Deployment

- [ ] **Config files updated** - `package.json`, `eslint.config.js`, `.prettierrc`
- [ ] **Version bumped** - Update version in package.json if needed
- [ ] **Git commit** - All changes committed with descriptive messages
- [ ] **Git tag** - Tag release (e.g., `v2.0.0`)
- [ ] **Backup** - Backup current production version

## Deployment

- [ ] **Files uploaded** - All necessary files deployed to hosting
- [ ] **Excluded files** - `node_modules/`, `tests/`, `/docs/` not deployed
- [ ] **File permissions** - Correct permissions set (644 for files, 755 for directories)
- [ ] **HTTPS enabled** - SSL certificate active
- [ ] **Caching headers** - Set appropriate cache headers
- [ ] **Gzip compression** - Enabled for text files

## Post-Deployment

- [ ] **Smoke test** - Visit each calculator page in production
- [ ] **Test core flow** - Enter values, calculate, verify results
- [ ] **Test themes** - Switch between light/dark/grayscale
- [ ] **Test on mobile** - Use actual mobile device (not just DevTools)
- [ ] **Check analytics** - Confirm tracking is working
- [ ] **Monitor errors** - Check for any console errors in production
- [ ] **Test clipboard** - Verify copy functionality works over HTTPS

## Known Issues / Accepted Limitations

### Acceptable Console Errors

The following console errors are **expected and acceptable**:

**Clipboard API Errors** (`src/utils/clipboard.js`):
```
Failed to copy: [error details]
Fallback: Oops, unable to copy [error details]
```

**Reason:** These only occur when:
- User denies clipboard permissions
- Browser doesn't support Clipboard API
- HTTP (non-HTTPS) context
- Security restrictions block clipboard access

The app handles these gracefully with fallback behavior and user notifications.

### ESLint Warnings

- 25 warnings for "unused" global utility functions (expected - they're used across files via script tags)
- Can be safely ignored or suppressed with `/* exported functionName */` comments

## Rollback Plan

If issues arise after deployment:

1. **Revert to previous version** - Restore backup files
2. **Clear CDN cache** - If using a CDN
3. **Notify users** - If the site has downtime
4. **Document issue** - Create issue in GitHub for tracking
5. **Test fix locally** - Before redeploying

## Version History

- **v2.0.0** (2026-01-05) - Major UI overhaul, theme system, auto-calculation
- **v1.0.0** (2024-12-01) - Initial release

## Sign-Off

Before deploying to production, confirm:

- [ ] All code quality checks passed
- [ ] All documentation complete
- [ ] All browser testing completed
- [ ] All accessibility requirements met
- [ ] All edge cases handled
- [ ] Performance is acceptable
- [ ] Security measures in place
- [ ] Analytics working
- [ ] Backup created
- [ ] Rollback plan documented

**Deployed by:** _________________  
**Date:** _________________  
**Version:** _________________  
**Notes:** _________________  

---

## Quick Test Commands

```bash
# Format code
npm run format

# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Run browser tests
# Open tests/calculators.test.html in browser

# Local server for testing
python -m http.server 8000
# or
npx http-server -p 8000
```

## Support

If issues arise during deployment:

- Review [DEPLOYMENT.md](DEPLOYMENT.md)
- Check [DEVELOPER.md](DEVELOPER.md) for troubleshooting
- Search existing GitHub issues
- Create new issue with details
- Contact community on [r/swingtrading](https://www.reddit.com/r/swingtrading/) or [Discord](https://discord.gg/yWFavAVQpm)
