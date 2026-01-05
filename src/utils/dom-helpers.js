/**
 * Updates text content of an element safely
 * @param {string} id
 * @param {string} value
 */
function updateText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

/**
 * Clears multiple input fields
 * @param {string[]} ids
 */
function clearInputs(ids) {
  ids.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.value = '';
      // Reset range inputs to default if needed, or handle specifically
      if (element.type === 'range') {
        // element.value = element.min || 0; // Optional behavior
      }
    }
  });
}

/**
 * Resets result displays to default '-'
 * @param {string[]} ids
 */
function resetResults(ids) {
  ids.forEach((id) => updateText(id, '-'));
}

/**
 * Adds a history entry to the container
 * @param {string} containerId
 * @param {string} htmlContent
 */
function addHistoryEntry(containerId, htmlContent) {
  const container = document.getElementById(containerId);
  if (container) {
    container.insertAdjacentHTML('afterbegin', htmlContent);
  }
}

/**
 * Shows a field-level error message and styles the input
 * @param {string} inputId
 * @param {string} message
 */
function showFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.classList.add('error');
  input.setAttribute('aria-invalid', 'true');
  const parent = input.parentElement;
  if (!parent) return;
  let msg = parent.querySelector('.error-message');
  if (!msg) {
    msg = document.createElement('div');
    msg.className = 'error-message';
    msg.id = inputId + '-error';
    parent.appendChild(msg);
  }
  msg.textContent = message;
  input.setAttribute('aria-describedby', msg.id);

  // Show subtle hint if available
  if (typeof FIELD_HINTS === 'object' && FIELD_HINTS[inputId]) {
    let hint = parent.querySelector('.hint-message');
    if (!hint) {
      hint = document.createElement('div');
      hint.className = 'hint-message';
      hint.id = inputId + '-hint';
      parent.appendChild(hint);
    }
    hint.textContent = FIELD_HINTS[inputId];
  }
}

/**
 * Clears a field-level error
 * @param {string} inputId
 */
function clearFieldError(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.classList.remove('error');
  input.removeAttribute('aria-invalid');
  input.removeAttribute('aria-describedby');
  const parent = input.parentElement;
  if (!parent) return;
  const msg = parent.querySelector('.error-message');
  if (msg) parent.removeChild(msg);
  const hint = parent.querySelector('.hint-message');
  if (hint) parent.removeChild(hint);
}

/**
 * Clears errors for a list of inputs
 * @param {string[]} ids
 */
function clearFieldErrors(ids) {
  ids.forEach((id) => clearFieldError(id));
}

/**
 * Focuses the first input among ids that currently has an error
 * @param {string[]} ids
 */
function focusFirstInvalid(ids) {
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el && el.classList.contains('error')) {
      el.focus();
      break;
    }
  }
}

/**
 * Debounce helper
 * @template {(...args: any[]) => any} T
 * @param {T} fn
 * @param {number} waitMs
 * @returns {(...args: Parameters<T>) => void}
 */
function debounce(fn, waitMs) {
  /** @type {number | undefined} */
  let timeoutId;
  return function debounced() {
    const args = arguments;
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => {
      timeoutId = undefined;
      fn.apply(null, args);
    }, waitMs);
  };
}

/**
 * Toggle a disabled visual state for a results section.
 * @param {string} sectionId
 * @param {boolean} disabled
 */
function setResultsDisabled(sectionId, disabled) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  if (disabled) {
    el.classList.add('results-section--disabled');
  } else {
    el.classList.remove('results-section--disabled');
  }
}
