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

    // Add copy functionality to all copyable elements
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('copyable')) {
            const textToCopy = e.target.textContent;
            if (textToCopy && textToCopy !== '-') {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    // Visual feedback
                    const originalColor = e.target.style.color;
                    e.target.style.color = 'green';
                    setTimeout(() => {
                        e.target.style.color = originalColor;
                    }, 300);
                });
            }
        }
    });
});

function calculate() {
    // Get input values
    const accountValue = parseFloat(document.getElementById('accountValue').value);
    const riskPercentage = parseFloat(document.getElementById('riskPercentage').value);
    const entryPrice = parseFloat(document.getElementById('entryPrice').value);
    const stopLoss = parseFloat(document.getElementById('stopLoss').value);
    const tickerSymbol = document.getElementById('tickerSymbol').value || "N/A";

    // Validate inputs
    if (isNaN(accountValue) || isNaN(riskPercentage) || isNaN(entryPrice) || isNaN(stopLoss)) {
        alert('Please fill in all required fields with valid values');
        return;
    }

    if (riskPercentage < 0 || riskPercentage > 100) {
        alert('Position Risk % must be between 0 and 100');
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
        alert('Entry price and Stop Loss cannot be equal');
        return;
    }

    // Calculate core variables
    const riskPerShare = Math.abs(entryPrice - stopLoss);
    const positionAllocation = (accountValue * riskPercentage) / 100;
    const maxShares = positionAllocation / entryPrice;
    const positionSize = maxShares * entryPrice;
    const dollarsRisked = maxShares * riskPerShare;
    const percentRisked = (dollarsRisked / accountValue) * 100;

    // Update DOM with formatted numbers
    document.getElementById('max-shares').textContent = maxShares.toFixed(4);
    document.getElementById('position-size').textContent = positionSize.toFixed(2);
    document.getElementById('risk-per-share').textContent = riskPerShare.toFixed(2);
    document.getElementById('percent-risked').textContent = percentRisked.toFixed(2);
    document.getElementById('dollars-risked').textContent = dollarsRisked.toFixed(2);

    // Update history
    const timestamp = new Date().toLocaleString();
    const resultContainer = document.getElementById('results-container');
    const historyHTML = `
        <div class="recent-result">
            <strong>Ticker Symbol:</strong> ${tickerSymbol}<br>
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
    resultContainer.insertAdjacentHTML('afterbegin', historyHTML);
}
