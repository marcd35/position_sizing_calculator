// @ts-check
document.addEventListener('DOMContentLoaded', () => {
    // Init global clipboard handler
    if (typeof initClipboard === 'function') {
        initClipboard();
    }

    const clearButton = document.getElementById('clearButton');
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            // Clear inputs
            clearInputs(['accountValue','riskPercentage','entryPrice','stopLoss','maxPositions','tickerSymbol']);
            // Reset results
            resetResults(['max-shares','position-size','risk-per-share','percent-risked','dollars-risked','one-r','two-r','three-r','max-positions','position-allotment','position-indicator']);
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
});

function setRisk(value) {
    const riskPercentageInput = document.getElementById('riskPercentage');
    if (riskPercentageInput) {
        riskPercentageInput.value = value;
    } else {
        console.error("Risk Percentage input field not found.");
    }
}
function calculate() {
    /**
     * Total Risk calculator compute handler
     * @returns {void}
     */
    // Get input values
    const accountValue = parseFloat(document.getElementById('accountValue').value);
    const riskPercentage = parseFloat(document.getElementById('riskPercentage').value);
    const entryPrice = parseFloat(document.getElementById('entryPrice').value);
    const stopLoss = parseFloat(document.getElementById('stopLoss').value);
    const maxPositionsInput = document.getElementById('maxPositions').value;
    const tickerSymbol = document.getElementById('tickerSymbol').value || "N/A";

    // Clear previous field errors
    clearFieldErrors(['accountValue','riskPercentage','entryPrice','stopLoss']);
    // Validate inputs with field-level feedback
    const inputsMap = { accountValue, riskPercentage, entryPrice, stopLoss };
    if (!validateInputs(inputsMap)) {
        if (!isValidNumber(accountValue)) showFieldError('accountValue', ERROR_MESSAGES.invalidNumber);
        if (!isValidNumber(riskPercentage)) showFieldError('riskPercentage', ERROR_MESSAGES.invalidPercentage);
        if (!isValidNumber(entryPrice)) showFieldError('entryPrice', ERROR_MESSAGES.invalidNumber);
        if (!isValidNumber(stopLoss)) showFieldError('stopLoss', ERROR_MESSAGES.invalidNumber);
        focusFirstInvalid(['accountValue','riskPercentage','entryPrice','stopLoss']);
        if (typeof notify === 'function') notify('error', ERROR_MESSAGES.fixFields);
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
    const dollarsRisked = (accountValue * riskPercentage) / 100;

    let maxShares;
    let positionAllotment = "N/A";

    if (maxPositionsInput && !isNaN(maxPositionsInput) && parseInt(maxPositionsInput, 10) > 0) {
        const maxPositions = parseInt(maxPositionsInput, 10);
        positionAllotment = accountValue / maxPositions;

        const maxSharesByRisk = dollarsRisked / riskPerShare;
        const maxSharesByAllotment = positionAllotment / entryPrice;

        maxShares = Math.min(maxSharesByRisk, maxSharesByAllotment);
    } else {
        maxShares = dollarsRisked / riskPerShare;
    }

    if (maxShares * riskPerShare > dollarsRisked) {
        maxShares = dollarsRisked / riskPerShare;
    }

    const positionSize = maxShares * entryPrice;

    // Calculate target profit prices based on position type
    const { oneR, twoR, threeR } = calculateTargets(positionType, entryPrice, riskPerShare);

    // Update DOM with formatted numbers
    updateText('max-shares', formatShares(maxShares));
    updateText('position-size', formatCurrency(positionSize));
    updateText('risk-per-share', formatCurrency(riskPerShare));
    updateText('percent-risked', ( (riskPerShare / entryPrice) * 100 ).toFixed(1));
    updateText('dollars-risked', formatCurrency(dollarsRisked));
    updateText('one-r', formatCurrency(oneR));
    updateText('two-r', formatCurrency(twoR));
    updateText('three-r', formatCurrency(threeR));

    if (maxPositionsInput && !isNaN(maxPositionsInput) && parseInt(maxPositionsInput, 10) > 0) {
        updateText('max-positions', String(maxPositionsInput));
        updateText('position-allotment', formatCurrency(positionAllotment));
    } else {
        updateText('max-positions', 'N/A');
        updateText('position-allotment', 'N/A');
    }

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
            <strong>Total Account Risk:</strong> ${riskPercentage}%<br>
            <strong>Entry Price:</strong> $${entryPrice.toFixed(2)}<br>
            <strong>Stop Loss:</strong> $${stopLoss.toFixed(2)}<br>
            <strong>Position Type:</strong> ${positionType}<br>
            <strong>Max Positions Allowed:</strong> ${maxPositionsInput || 'N/A'}<br><br>
            <strong>Result:</strong><br>
            <strong>Max Shares:</strong> ${maxShares.toFixed(4)}<br>
            <strong>Position Size:</strong> $${positionSize.toFixed(2)}<br>
            <strong>Risk per Share:</strong> $${riskPerShare.toFixed(2)}<br>
            <strong>Trade Risk:</strong> ${((riskPerShare / entryPrice) * 100).toFixed(1)}%<br>
            <strong>Dollars Risked:</strong> $${dollarsRisked.toFixed(2)}<br>
            <strong>1R:</strong> $${oneR.toFixed(2)}<br>
            <strong>2R:</strong> $${twoR.toFixed(2)}<br>
            <strong>3R:</strong> $${threeR.toFixed(2)}<br>
            <strong>Max Positions:</strong> ${maxPositionsInput || 'N/A'}<br>
            <strong>Position Allotment:</strong> ${positionAllotment !== "N/A" ? `$${positionAllotment.toFixed(4)}` : 'N/A'}<br>
            <strong>Timestamp:</strong> ${timestamp}
        </div>`;
    addHistoryEntry('results-container', historyHTML);

    // Success notification
    if (typeof notify === 'function') notify('success','Calculation complete.');
}
