document.addEventListener('DOMContentLoaded', () => {
  // Init clipboard
  if (typeof initClipboard === 'function') {
    initClipboard();
  }

  const clearButton = document.getElementById('clearButton');
  const submitButton = document.getElementById('submitButton');

  // Event listener for the Submit button
  if (submitButton) {
    submitButton.addEventListener('click', () => {
      dollarCalculator({ source: 'manual' });
    });
  }

  // Event listener for the Clear button
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      clearInputs([
        'dollarRisk',
        'entryPriceDollar',
        'stopLossDollar',
        'accountSizeDollar',
        'tickerSymbol',
      ]);
      resetResults([
        'position-indicator',
        'max-shares-dollar',
        'position-size-dollar',
        'risk-per-share-dollar',
        'dollars-risked-dollar',
        'position-percent-account',
      ]);
      setResultsDisabled('result-dollar', true);
    });
  }

  // Clear field-level errors on input
  const inputIds = [
    'dollarRisk',
    'entryPriceDollar',
    'stopLossDollar',
    'accountSizeDollar',
    'tickerSymbol',
  ];
  inputIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => clearFieldError(id));
    }
  });

  const scheduleAutoCalc =
    typeof debounce === 'function'
      ? debounce(() => dollarCalculator({ source: 'auto' }), 250)
      : () => dollarCalculator({ source: 'auto' });

  inputIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => scheduleAutoCalc());
      el.addEventListener('change', () => scheduleAutoCalc());
    }
  });

  // Keyboard shortcuts: Enter to calculate, Escape to clear
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      dollarCalculator({ source: 'manual' });
    } else if (e.key === 'Escape') {
      if (clearButton) clearButton.click();
    }
  });

  // Initial calculation with defaults (silent)
  scheduleAutoCalc();
});

function dollarCalculator(options) {
  /**
   * Dollar Risk calculator compute handler
   * @returns {void}
   */
  const source = options && options.source ? options.source : 'manual';
  const isAuto = source === 'auto';

  // Get input values
  const dollarRisk = parseFloat(document.getElementById('dollarRisk').value);
  const entryPrice = parseFloat(document.getElementById('entryPriceDollar').value);
  const stopLoss = parseFloat(document.getElementById('stopLossDollar').value);
  const accountSize = parseFloat(document.getElementById('accountSizeDollar').value);
  const tickerSymbol = document.getElementById('tickerSymbol').value || 'N/A';

  // Clear previous field errors
  clearFieldErrors(['dollarRisk', 'entryPriceDollar', 'stopLossDollar']);
  // Validate inputs with field-level feedback
  const inputMap = { dollarRisk, entryPrice, stopLoss };
  if (!validateInputs(inputMap)) {
    setResultsDisabled('result-dollar', true);
    if (!isValidNumber(dollarRisk)) showFieldError('dollarRisk', ERROR_MESSAGES.invalidNumber);
    if (!isValidNumber(entryPrice))
      showFieldError('entryPriceDollar', ERROR_MESSAGES.invalidNumber);
    if (!isValidNumber(stopLoss)) showFieldError('stopLossDollar', ERROR_MESSAGES.invalidNumber);
    if (!isAuto) {
      focusFirstInvalid(['dollarRisk', 'entryPriceDollar', 'stopLossDollar']);
      if (typeof notify === 'function') notify('error', ERROR_MESSAGES.fixFields);
    }
    resetResults([
      'position-indicator',
      'max-shares-dollar',
      'position-size-dollar',
      'risk-per-share-dollar',
      'dollars-risked-dollar',
      'position-percent-account',
    ]);
    return;
  }

  if (dollarRisk <= 0) {
    setResultsDisabled('result-dollar', true);
    showFieldError('dollarRisk', ERROR_MESSAGES.dollarRiskPositive);
    resetResults([
      'position-indicator',
      'max-shares-dollar',
      'position-size-dollar',
      'risk-per-share-dollar',
      'dollars-risked-dollar',
      'position-percent-account',
    ]);
    if (!isAuto) {
      focusFirstInvalid(['dollarRisk']);
      if (typeof notify === 'function') notify('error', ERROR_MESSAGES.dollarRiskPositive);
    }
    return;
  }

  if (!isPositiveNumber(entryPrice)) {
    setResultsDisabled('result-dollar', true);
    showFieldError('entryPriceDollar', ERROR_MESSAGES.positiveNumber);
    resetResults([
      'position-indicator',
      'max-shares-dollar',
      'position-size-dollar',
      'risk-per-share-dollar',
      'dollars-risked-dollar',
      'position-percent-account',
    ]);
    if (!isAuto) {
      focusFirstInvalid(['entryPriceDollar']);
      if (typeof notify === 'function') notify('error', ERROR_MESSAGES.fixFields);
    }
    return;
  }

  if (!isPositiveNumber(stopLoss)) {
    setResultsDisabled('result-dollar', true);
    showFieldError('stopLossDollar', ERROR_MESSAGES.positiveNumber);
    resetResults([
      'position-indicator',
      'max-shares-dollar',
      'position-size-dollar',
      'risk-per-share-dollar',
      'dollars-risked-dollar',
      'position-percent-account',
    ]);
    if (!isAuto) {
      focusFirstInvalid(['stopLossDollar']);
      if (typeof notify === 'function') notify('error', ERROR_MESSAGES.fixFields);
    }
    return;
  }

  // Determine if the position is Long or Short
  const positionIndicatorSpan = document.getElementById('position-indicator');
  const positionIndicatorDiv = document.querySelector('.position-indicator');
  const positionType = determinePositionType(entryPrice, stopLoss);
  if (positionType === 'Invalid') {
    setResultsDisabled('result-dollar', true);
    updateText('position-indicator', 'Entry price and Stop are equal.');
    if (positionIndicatorSpan) positionIndicatorSpan.removeAttribute('data-position');
    if (positionIndicatorDiv) positionIndicatorDiv.removeAttribute('data-position');
    showFieldError('entryPriceDollar', ERROR_MESSAGES.entryStopEqual);
    showFieldError('stopLossDollar', ERROR_MESSAGES.entryStopEqual);
    resetResults([
      'max-shares-dollar',
      'position-size-dollar',
      'risk-per-share-dollar',
      'dollars-risked-dollar',
      'position-percent-account',
    ]);
    if (!isAuto) {
      focusFirstInvalid(['entryPriceDollar', 'stopLossDollar']);
      if (typeof notify === 'function') notify('error', ERROR_MESSAGES.entryStopEqual);
    }
    return;
  }

  setResultsDisabled('result-dollar', false);
  updateText('position-indicator', positionType);

  // Set data attribute for styling (long = blue, short = orange)
  // Extract just "long" or "short" from "Long Position" or "Short Position"
  const positionValue = positionType.toLowerCase().split(' ')[0];
  if (positionIndicatorSpan) {
    positionIndicatorSpan.setAttribute('data-position', positionValue);
  }
  if (positionIndicatorDiv) {
    positionIndicatorDiv.setAttribute('data-position', positionValue);
  }

  // Calculate core variables
  const riskPerShare = calculateRiskPerShare(entryPrice, stopLoss);
  const maxShares = dollarRisk / riskPerShare;
  const positionSize = maxShares * entryPrice;
  const dollarsRisked = maxShares * riskPerShare;

  // Calculate position size as percentage of account (if account size is provided)
  let positionPercentAccount = 'N/A';
  if (!isNaN(accountSize) && accountSize > 0) {
    positionPercentAccount = ((positionSize / accountSize) * 100).toFixed(2);
  }

  // Update DOM with formatted numbers
  updateText('max-shares-dollar', formatShares(maxShares));
  updateText('position-size-dollar', formatCurrency(positionSize));
  updateText('risk-per-share-dollar', formatCurrency(riskPerShare));
  updateText('dollars-risked-dollar', formatCurrency(dollarsRisked));
  updateText('position-percent-account', positionPercentAccount);

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
                strong>Timestamp:</strong> ${timestamp}<br>
                <strong>Ticker Symbol:</strong> ${safeTicker}<br>
                <strong>Dollar Risk:</strong> $${dollarRisk.toFixed(2)}<br>
                <strong>Entry Price:</strong> $${entryPrice.toFixed(2)}<br>
                <strong>Stop Loss:</strong> $${stopLoss.toFixed(2)}<br>
                <strong>Account Size:</strong> ${!isNaN(accountSize) && accountSize > 0 ? `$${accountSize.toFixed(2)}` : 'N/A'}<br>
                <strong>Position Type:</strong> ${positionType}<br><br>
                <strong>Result:</strong><br>
                <strong>Max Shares:</strong> ${maxShares.toFixed(4)}<br>
                <strong>Position Size:</strong> $${positionSize.toFixed(2)}<br>
                <strong>Risk per Share:</strong> $${riskPerShare.toFixed(2)}<br>
                <strong>Dollars Risked:</strong> $${dollarsRisked.toFixed(2)}<br>
                <strong>Position Size as % of Account:</strong> ${positionPercentAccount !== 'N/A' ? `${positionPercentAccount}%` : 'N/A'}<br>
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
