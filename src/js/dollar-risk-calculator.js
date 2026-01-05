// @ts-check
document.addEventListener('DOMContentLoaded', () => {
    // Init clipboard
    if (typeof initClipboard === 'function') {
        initClipboard();
    }

    const clearButton = document.getElementById('clearButton');

    // Event listener for the Clear button
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            clearInputs(['dollarRisk','entryPriceDollar','stopLossDollar','accountSizeDollar','tickerSymbol']);
            resetResults(['position-indicator','max-shares-dollar','position-size-dollar','risk-per-share-dollar','dollars-risked-dollar','position-percent-account']);
        });
    }

    // Clear field-level errors on input
    ['dollarRisk','entryPriceDollar','stopLossDollar'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => clearFieldError(id));
        }
    });

    // Keyboard shortcuts: Enter to calculate, Escape to clear
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            dollarCalculator();
        } else if (e.key === 'Escape') {
            if (clearButton) clearButton.click();
        }
    });
});

function dollarCalculator() {
    /**
     * Dollar Risk calculator compute handler
     * @returns {void}
     */
    // Get input values
    const dollarRisk = parseFloat(document.getElementById('dollarRisk').value);
    const entryPrice = parseFloat(document.getElementById('entryPriceDollar').value);
    const stopLoss = parseFloat(document.getElementById('stopLossDollar').value);
    const accountSize = parseFloat(document.getElementById('accountSizeDollar').value);
    const tickerSymbol = document.getElementById('tickerSymbol').value || "N/A";

    // Clear previous field errors
    clearFieldErrors(['dollarRisk','entryPriceDollar','stopLossDollar']);
    // Validate inputs with field-level feedback
    const inputMap = { dollarRisk, entryPrice, stopLoss };
    if (!validateInputs(inputMap)) {
        if (!isValidNumber(dollarRisk)) showFieldError('dollarRisk', ERROR_MESSAGES.invalidNumber);
        if (!isValidNumber(entryPrice)) showFieldError('entryPriceDollar', ERROR_MESSAGES.invalidNumber);
        if (!isValidNumber(stopLoss)) showFieldError('stopLossDollar', ERROR_MESSAGES.invalidNumber);
        focusFirstInvalid(['dollarRisk','entryPriceDollar','stopLossDollar']);
        if (typeof notify === 'function') notify('error', ERROR_MESSAGES.fixFields);
        return;
    }

    if (dollarRisk <= 0) {
        showFieldError('dollarRisk', ERROR_MESSAGES.dollarRiskPositive);
        focusFirstInvalid(['dollarRisk']);
        if (typeof notify === 'function') notify('error', ERROR_MESSAGES.dollarRiskPositive);
        return;
    }

    // Determine if the position is Long or Short
    const positionIndicator = document.getElementById('position-indicator');
    const positionType = determinePositionType(entryPrice, stopLoss);
    if (positionType === 'Invalid') {
        updateText('position-indicator', 'Entry price and Stop are equal.');
        showFieldError('entryPriceDollar', ERROR_MESSAGES.entryStopEqual);
        showFieldError('stopLossDollar', ERROR_MESSAGES.entryStopEqual);
        focusFirstInvalid(['entryPriceDollar','stopLossDollar']);
        if (typeof notify === 'function') notify('error', ERROR_MESSAGES.entryStopEqual);
        return;
    }
    updateText('position-indicator', positionType);

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

    // Update history
    const timestamp = new Date().toLocaleString();
    const ariaLive = document.getElementById('aria-live');
    if (ariaLive) ariaLive.textContent = `Calculated: Max Shares ${maxShares.toFixed(4)}, Position Size $${positionSize.toFixed(2)}`;
    const resultContainer = document.getElementById('results-container');
    const safeTicker = escapeHTML(tickerSymbol);
    const historyHTML = `
        <div class="recent-result">
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
            <strong>Timestamp:</strong> ${timestamp}
        </div>`;
    addHistoryEntry('results-container', historyHTML);

    // Success notification
    if (typeof notify === 'function') notify('success','Calculation complete.');
}
