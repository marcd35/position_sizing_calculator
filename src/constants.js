// @ts-check
/**
 * Shared constants
 */
window.RISK_MULTIPLES = { ONE_R: 1, TWO_R: 2, THREE_R: 3 };

/**
 * Standardized error messages for calculators
 */
window.ERROR_MESSAGES = {
	invalidNumber: 'Please enter a valid number.',
	invalidPercentage: 'Please enter a valid percentage.',
	percentageRange: 'Position risk must be between 0 and 100.',
	entryStopEqual: 'Entry price and stop loss cannot be equal.',
	dollarRiskPositive: 'Dollar risk must be greater than 0.',
	fixFields: 'Please correct the highlighted fields.'
};

/**
 * Subtle hint text to show under inputs when invalid
 */
window.FIELD_HINTS = {
	// Total Risk
	accountValue: 'Enter account value in dollars (e.g., 10000).',
	riskPercentage: 'Allowed range: 0–100.',
	entryPrice: 'Positive price (e.g., 100.50).',
	stopLoss: 'Positive price (e.g., 95.00).',
	maxPositions: 'Optional: integer greater than 0.',
	// Dollar Risk
	dollarRisk: 'Positive dollars (e.g., 100).',
	entryPriceDollar: 'Positive price (e.g., 100.50).',
	stopLossDollar: 'Positive price (e.g., 95.00).',
	accountSizeDollar: 'Optional: account value in dollars.',
	// Position Percent
	tickerSymbol: 'Optional reference only; affects history display.'
};