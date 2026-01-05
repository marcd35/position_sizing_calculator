document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const accountValueInput = document.getElementById('accountValue');
    const riskPercentageInput = document.getElementById('riskPercentage');
    const entryPriceInput = document.getElementById('entryPrice');
    const stopLossInput = document.getElementById('stopLoss');
    const maxPositionsInput = document.getElementById('maxPositions');
    const tickerSymbolInput = document.getElementById('tickerSymbol');
    const clearButton = document.getElementById('clearButton');

    // Event listener for the Clear button
    clearButton.addEventListener('click', () => {
        // Clear all input fields
        accountValueInput.value = '';
        riskPercentageInput.value = '';
        entryPriceInput.value = '';
        stopLossInput.value = '';
        maxPositionsInput.value = '';
        tickerSymbolInput.value = '';

        // Clear results section
        document.getElementById('max-shares').textContent = '-';
        document.getElementById('position-size').textContent = '-';
        document.getElementById('risk-per-share').textContent = '-';
        document.getElementById('percent-risked').textContent = '-';
        document.getElementById('dollars-risked').textContent = '-';
        document.getElementById('one-r').textContent = '-';
        document.getElementById('two-r').textContent = '-';
        document.getElementById('three-r').textContent = '-';
        document.getElementById('max-positions').textContent = '-';
        document.getElementById('position-allotment').textContent = '-';
        document.getElementById('position-indicator').textContent = '-';
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
    // Get input values
    const accountValue = parseFloat(document.getElementById('accountValue').value);
    const riskPercentage = parseFloat(document.getElementById('riskPercentage').value);
    const entryPrice = parseFloat(document.getElementById('entryPrice').value);
    const stopLoss = parseFloat(document.getElementById('stopLoss').value);
    const maxPositionsInput = document.getElementById('maxPositions').value;
    const tickerSymbol = document.getElementById('tickerSymbol').value || "N/A";

    // Validate inputs
    if (isNaN(accountValue) || isNaN(riskPercentage) || isNaN(entryPrice) || isNaN(stopLoss)) {
        alert('Please fill in all required fields with valid values');
        return;
    }

    // Determine if the position is Long or Short
    const positionIndicator = document.getElementById('position-indicator');
    let positionType;
    if (entryPrice > stopLoss) {
        positionType = "Long Position";
        positionIndicator.textContent = positionType;
    } else if (stopLoss > entryPrice) {
        positionType = "Short Position";
        positionIndicator.textContent = positionType;
    } else {
        positionIndicator.textContent = "Entry price and Stop are equal.";
        return;
    }

    // Calculate core variables
    const riskPerShare = Math.abs(entryPrice - stopLoss);
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
    let oneR, twoR, threeR;
    if (positionType === "Long Position") {
        oneR = entryPrice + riskPerShare;
        twoR = entryPrice + (riskPerShare * 2);
        threeR = entryPrice + (riskPerShare * 3);
    } else if (positionType === "Short Position") {
        oneR = entryPrice - riskPerShare;
        twoR = entryPrice - (riskPerShare * 2);
        threeR = entryPrice - (riskPerShare * 3);
    }

    // Update DOM with formatted numbers
    document.getElementById('max-shares').textContent = maxShares.toFixed(4);
    document.getElementById('position-size').textContent = positionSize.toFixed(2);
    document.getElementById('risk-per-share').textContent = riskPerShare.toFixed(2);
    document.getElementById('percent-risked').textContent = ((riskPerShare / entryPrice) * 100).toFixed(1);
    document.getElementById('dollars-risked').textContent = dollarsRisked.toFixed(2);
    document.getElementById('one-r').textContent = oneR.toFixed(2);
    document.getElementById('two-r').textContent = twoR.toFixed(2);
    document.getElementById('three-r').textContent = threeR.toFixed(2);

    if (maxPositionsInput && !isNaN(maxPositionsInput) && parseInt(maxPositionsInput, 10) > 0) {
        document.getElementById('max-positions').textContent = maxPositionsInput;
        document.getElementById('position-allotment').textContent = positionAllotment.toFixed(2);
    } else {
        document.getElementById('max-positions').textContent = 'N/A';
        document.getElementById('position-allotment').textContent = 'N/A';
    }

    // Update history
    const timestamp = new Date().toLocaleString();
    const resultContainer = document.getElementById('results-container');
    const historyHTML = `
        <div class="recent-result">
            <strong>Ticker Symbol:</strong> ${tickerSymbol}<br>
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
    resultContainer.insertAdjacentHTML('afterbegin', historyHTML);
}
