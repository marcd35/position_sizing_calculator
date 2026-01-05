// @ts-check
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const accountValueInput = document.getElementById('accountValue');
    const riskPercentageInput = document.getElementById('riskPercentage');
    const riskPercentageSlider = document.getElementById('riskPercentageSlider');
    const entryPriceInput = document.getElementById('entryPrice');
    const stopLossInput = document.getElementById('stopLoss');
    const tickerSymbolInput = document.getElementById('tickerSymbol');
    const calculateButton = document.getElementById('calculateButton');
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
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            if (riskPercentageInput && riskPercentageSlider) {
                riskPercentageInput.value = value;
                riskPercentageSlider.value = value;
            }
        });
    });

    // Calculate button
    if (calculateButton) {
        calculateButton.addEventListener('click', calculate);
    }

    // Clear button
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            // Clear all input fields
            accountValueInput.value = '';
            riskPercentageInput.value = '1';
            riskPercentageSlider.value = '1';
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
        });
    }

    // Clear field-level errors on input
    ['accountValue','riskPercentage','entryPrice','stopLoss'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => clearFieldError(id));
        }
    });

    // Keyboard shortcuts: Enter to calculate, Escape to clear
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            calculate();
        } else if (e.key === 'Escape') {
            if (clearButton) clearButton.click();
        }
    });

    // Init global clipboard handler
    if (typeof initClipboard === 'function') {
        initClipboard();
    }
});

function calculate() {
    /**
     * Position Percent calculator compute handler
     * @returns {void}
     */
    // Get input values
    const accountValue = parseFloat(document.getElementById('accountValue').value);
    const riskPercentage = parseFloat(document.getElementById('riskPercentage').value);
    const entryPrice = parseFloat(document.getElementById('entryPrice').value);
    const stopLoss = parseFloat(document.getElementById('stopLoss').value);
    const tickerSymbol = document.getElementById('tickerSymbol').value || "N/A";

    // Clear previous field errors
    clearFieldErrors(['accountValue','riskPercentage','entryPrice','stopLoss']);
    // Validate inputs
    if (!validateInputs({ accountValue, riskPercentage, entryPrice, stopLoss })) {
        if (!isValidNumber(accountValue)) showFieldError('accountValue', ERROR_MESSAGES.invalidNumber);
        if (!isValidNumber(riskPercentage)) showFieldError('riskPercentage', ERROR_MESSAGES.invalidPercentage);
        if (!isValidNumber(entryPrice)) showFieldError('entryPrice', ERROR_MESSAGES.invalidNumber);
        if (!isValidNumber(stopLoss)) showFieldError('stopLoss', ERROR_MESSAGES.invalidNumber);
        focusFirstInvalid(['accountValue','riskPercentage','entryPrice','stopLoss']);
        if (typeof notify === 'function') notify('error', ERROR_MESSAGES.fixFields);
        return;
    }

    if (riskPercentage < 0 || riskPercentage > 100) {
        showFieldError('riskPercentage', ERROR_MESSAGES.percentageRange);
        focusFirstInvalid(['riskPercentage']);
        if (typeof notify === 'function') notify('error', ERROR_MESSAGES.percentageRange);
        return;
    }

    // Determine if the position is Long or Short
    const positionIndicator = document.getElementById('position-indicator');
    const positionType = determinePositionType(entryPrice, stopLoss);
    if (positionType === 'Invalid') {
        updateText('position-indicator', 'Entry price and Stop are equal.');
        showFieldError('entryPrice', ERROR_MESSAGES.entryStopEqual);
        showFieldError('stopLoss', ERROR_MESSAGES.entryStopEqual);
        focusFirstInvalid(['entryPrice','stopLoss']);
        if (typeof notify === 'function') notify('error', ERROR_MESSAGES.entryStopEqual);
        return;
    }
    updateText('position-indicator', positionType);

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

    // Update history
    const timestamp = new Date().toLocaleString();
    const ariaLive = document.getElementById('aria-live');
    if (ariaLive) ariaLive.textContent = `Calculated: Max Shares ${maxShares.toFixed(4)}, Position Size $${positionSize.toFixed(2)}`;
    const resultContainer = document.getElementById('results-container');
    const safeTicker = escapeHTML(tickerSymbol);
    const historyHTML = `
        <div class="recent-result">
            <strong>Ticker Symbol:</strong> ${safeTicker}<br>
            <strong>Account Value:</strong> $${accountValue.toFixed(2)}<br>
            <strong>Position Risk %:</strong> ${riskPercentage}%<br>
            <strong>Entry Price:</strong> $${entryPrice.toFixed(2)}<br>
            <strong>Stop Loss:</strong> $${stopLoss.toFixed(2)}<br>
            <strong>Position Type:</strong> ${positionType}<br><br>
            <strong>Result:</strong><br>
            <strong>Max Shares:</strong> ${maxShares.toFixed(4)}<br>
            <strong>Position Size:</strong> $${positionSize.toFixed(2)}<br>
            <strong>Risk per Share:</strong> $${riskPerShare.toFixed(2)}<br>
            <strong>Trade Risk:</strong> ${percentRisked.toFixed(2)}%<br>
            <strong>Dollars Risked:</strong> $${dollarsRisked.toFixed(2)}<br>
            <strong>Timestamp:</strong> ${timestamp}
        </div>`;
    addHistoryEntry('results-container', historyHTML);

    // Success notification
    if (typeof notify === 'function') notify('success','Calculation complete.');
}
