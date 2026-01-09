document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const accountValueInput = document.getElementById('accountValue');
  const riskPercentageInput = document.getElementById('riskPercentage');
  const riskPercentageSlider = document.getElementById('riskPercentageSlider');
  const entryPriceInput = document.getElementById('entryPrice');
  const stopLossInput = document.getElementById('stopLoss');
  const tickerSymbolInput = document.getElementById('tickerSymbol');
  const clearButton = document.getElementById('clearButton');

  // Sync slider with input field
  if (riskPercentageInput && riskPercentageSlider) {
    riskPercentageInput.addEventListener('input', () => {
      riskPercentageSlider.value = riskPercentageInput.value;
    });

    riskPercentageSlider.addEventListener('input', () => {
      riskPercentageInput.value = riskPercentageSlider.value;
    });
  }

  // Preset buttons
  const presetButtons = document.querySelectorAll('.preset-buttons button');
  presetButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.getAttribute('data-value');
      if (riskPercentageInput && riskPercentageSlider) {
        riskPercentageInput.value = value;
        riskPercentageSlider.value = value;
        riskPercentageInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  });

  // Clear button
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      // Clear all input fields - set to empty string to show blank instead of placeholder
      accountValueInput.value = '';
      riskPercentageInput.value = '';
      riskPercentageSlider.value = '';
      entryPriceInput.value = '';
      stopLossInput.value = '';
      tickerSymbolInput.value = '';

      // Clear results section
      document.getElementById('max-shares').textContent = '-';
      document.getElementById('position-size').textContent = '-';
      document.getElementById('risk-per-share').textContent = '-';
      document.getElementById('percent-risked').textContent = '-';
      document.getElementById('dollars-risked').textContent = '-';
      document.getElementById('position-indicator').textContent = '-';

      setResultsDisabled('result', true);
    });
  }

  // Submit button
  const submitButton = document.getElementById('submitButton');
  if (submitButton) {
    submitButton.addEventListener('click', () => {
      calculate({ source: 'manual' });
    });
  }

  // Clear field-level errors on input
  ['accountValue', 'riskPercentage', 'entryPrice', 'stopLoss'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => clearFieldError(id));
    }
  });

  // Keyboard shortcuts: Enter to calculate, Escape to clear
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      calculate({ source: 'manual' });
    } else if (e.key === 'Escape') {
      if (clearButton) clearButton.click();
    }
  });

  // Init global clipboard handler
  if (typeof initClipboard === 'function') {
    initClipboard();
  }
});

function calculate(options) {
  /**
   * Position Percent calculator compute handler
   * @returns {void}
   */
  const source = options && options.source ? options.source : 'manual';
  const isAuto = source === 'auto';

  // Get input values
  const accountValue = parseFloat(document.getElementById('accountValue').value);
  const riskPercentage = parseFloat(document.getElementById('riskPercentage').value);
  const entryPrice = parseFloat(document.getElementById('entryPrice').value);
  const stopLoss = parseFloat(document.getElementById('stopLoss').value);
  const tickerSymbol = document.getElementById('tickerSymbol').value || 'N/A';

  // Clear previous field errors
  clearFieldErrors(['accountValue', 'riskPercentage', 'entryPrice', 'stopLoss']);
  // Validate inputs
  if (!validateInputs({ accountValue, riskPercentage, entryPrice, stopLoss })) {
    setResultsDisabled('result', true);
    if (!isValidNumber(accountValue)) showFieldError('accountValue', ERROR_MESSAGES.invalidNumber);
    if (!isValidNumber(riskPercentage))
      showFieldError('riskPercentage', ERROR_MESSAGES.invalidPercentage);
    if (!isValidNumber(entryPrice)) showFieldError('entryPrice', ERROR_MESSAGES.invalidNumber);
    if (!isValidNumber(stopLoss)) showFieldError('stopLoss', ERROR_MESSAGES.invalidNumber);
    if (!isAuto) {
      focusFirstInvalid(['accountValue', 'riskPercentage', 'entryPrice', 'stopLoss']);
      if (typeof notify === 'function') notify('error', ERROR_MESSAGES.fixFields);
    }
    resetResults([
      'max-shares',
      'position-size',
      'risk-per-share',
      'percent-risked',
      'dollars-risked',
      'position-indicator',
    ]);
    return;
  }

  if (riskPercentage < 0 || riskPercentage > 100) {
    setResultsDisabled('result', true);
    showFieldError('riskPercentage', ERROR_MESSAGES.percentageRange);
    resetResults([
      'max-shares',
      'position-size',
      'risk-per-share',
      'percent-risked',
      'dollars-risked',
      'position-indicator',
    ]);
    if (!isAuto) {
      focusFirstInvalid(['riskPercentage']);
      if (typeof notify === 'function') notify('error', ERROR_MESSAGES.percentageRange);
    }
    return;
  }

  if (!isPositiveNumber(accountValue)) {
    setResultsDisabled('result', true);
    showFieldError('accountValue', ERROR_MESSAGES.positiveNumber);
    resetResults([
      'max-shares',
      'position-size',
      'risk-per-share',
      'percent-risked',
      'dollars-risked',
      'position-indicator',
    ]);
    if (!isAuto) {
      focusFirstInvalid(['accountValue']);
      if (typeof notify === 'function') notify('error', ERROR_MESSAGES.fixFields);
    }
    return;
  }

  if (!isPositiveNumber(entryPrice)) {
    setResultsDisabled('result', true);
    showFieldError('entryPrice', ERROR_MESSAGES.positiveNumber);
    resetResults([
      'max-shares',
      'position-size',
      'risk-per-share',
      'percent-risked',
      'dollars-risked',
      'position-indicator',
    ]);
    if (!isAuto) {
      focusFirstInvalid(['entryPrice']);
      if (typeof notify === 'function') notify('error', ERROR_MESSAGES.fixFields);
    }
    return;
  }

  if (!isPositiveNumber(stopLoss)) {
    setResultsDisabled('result', true);
    showFieldError('stopLoss', ERROR_MESSAGES.positiveNumber);
    resetResults([
      'max-shares',
      'position-size',
      'risk-per-share',
      'percent-risked',
      'dollars-risked',
      'position-indicator',
    ]);
    if (!isAuto) {
      focusFirstInvalid(['stopLoss']);
      if (typeof notify === 'function') notify('error', ERROR_MESSAGES.fixFields);
    }
    return;
  }

  // Determine if the position is Long or Short
  const positionIndicator = document.getElementById('position-indicator');
  const positionIndicatorDiv = document.querySelector('.position-indicator');
  const positionType = determinePositionType(entryPrice, stopLoss);
  if (positionType === 'Invalid') {
    setResultsDisabled('result', true);
    const indicator = document.getElementById('position-indicator');
    if (indicator) indicator.innerHTML = '&#x2195;';
    if (positionIndicator) positionIndicator.removeAttribute('data-position');
    if (positionIndicatorDiv) positionIndicatorDiv.removeAttribute('data-position');
    showFieldError('entryPrice', ERROR_MESSAGES.entryStopEqual);
    showFieldError('stopLoss', ERROR_MESSAGES.entryStopEqual);
    resetResults([
      'max-shares',
      'position-size',
      'risk-per-share',
      'percent-risked',
      'dollars-risked',
    ]);
    if (!isAuto) {
      focusFirstInvalid(['entryPrice', 'stopLoss']);
      if (typeof notify === 'function') notify('error', ERROR_MESSAGES.entryStopEqual);
    }
    return;
  }

  setResultsDisabled('result', false);

  // Set arrow symbol based on position type
  const arrowSymbol = positionType === 'Long Position' ? '&#x2191;' : '&#x2193;';
  const indicator = document.getElementById('position-indicator');
  if (indicator) indicator.innerHTML = arrowSymbol;

  // Set data attribute for styling (long = blue, short = orange)
  const positionValue = positionType.toLowerCase().split(' ')[0];
  if (positionIndicator) {
    positionIndicator.setAttribute('data-position', positionValue);
  }
  if (positionIndicatorDiv && positionIndicatorDiv !== positionIndicator) {
    positionIndicatorDiv.setAttribute('data-position', positionValue);
  }

  // Calculate core variables
  const riskPerShare = calculateRiskPerShare(entryPrice, stopLoss);
  const positionAllocation = (accountValue * riskPercentage) / 100;
  const maxShares = positionAllocation / entryPrice;
  const positionSize = maxShares * entryPrice;
  const dollarsRisked = maxShares * riskPerShare;
  const percentRisked = (dollarsRisked / accountValue) * 100;

  // Update DOM with formatted numbers
  updateText('max-shares', formatShares(maxShares));
  updateText('position-size', formatCurrency(positionSize));
  updateText('risk-per-share', formatCurrency(riskPerShare));
  updateText('percent-risked', formatPercentage(percentRisked));
  updateText('dollars-risked', formatCurrency(dollarsRisked));

  // Update history (only on manual submit)
  const timestamp = new Date().toLocaleString();
  const ariaLive = document.getElementById('aria-live');
  if (ariaLive && !isAuto)
    ariaLive.textContent = `Calculated: Max Shares ${maxShares.toFixed(4)}, Position Size $${positionSize.toFixed(2)}`;

  if (!isAuto) {
    const resultContainer = document.getElementById('results-container');
    const safeTicker = escapeHTML(tickerSymbol);
    const historyHTML = `
            <div class="recent-result">
                ${timestamp}<br>
                <strong>Ticker Symbol:</strong> ${safeTicker}<br>
                <strong>Account Value:</strong> ${accountValue.toFixed(2)}<br>
                <strong>Position Risk %:</strong> ${riskPercentage}%<br>
                <strong>Entry Price:</strong> ${entryPrice.toFixed(2)}<br>
                <strong>Stop Loss:</strong> ${stopLoss.toFixed(2)}<br>
                <strong>Position Type:</strong> ${positionType}<br><br>
                <strong>Result:</strong><br>
                <strong>Max Shares:</strong> ${maxShares.toFixed(4)}<br>
                <strong>Position Size:</strong> ${positionSize.toFixed(2)}<br>
                <strong>Risk per Share:</strong> ${riskPerShare.toFixed(2)}<br>
                <strong>Trade Risk:</strong> ${percentRisked.toFixed(2)}%<br>
                <strong>Dollars Risked:</strong> ${dollarsRisked.toFixed(2)}<br>
                <div class="copy-all-row">
                    <span class="copy-all-label">COPY ALL:</span>
                    <span class="copy-all-btn copyable" aria-label="Copy all values">📋</span>
                </div>
            </div>`;
    addHistoryEntry('results-container', historyHTML);
  }

  // Success notification and glow effect
  if (!isAuto) {
    if (typeof notify === 'function') notify('success', 'Calculation complete.');
    triggerHistoryGlow();
  }
}

function triggerHistoryGlow() {
  const historyDetails = document.getElementById('history-details');
  if (historyDetails) {
    historyDetails.classList.remove('glow-effect');
    void historyDetails.offsetWidth;
    historyDetails.classList.add('glow-effect');
    setTimeout(() => {
      historyDetails.classList.remove('glow-effect');
    }, 1000);
  }
}
