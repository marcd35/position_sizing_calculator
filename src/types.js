/**
 * Global JSDoc typedefs for calculator app
 */

/**
 * @typedef {('Long Position'|'Short Position'|'Invalid')} PositionType
 */

/**
 * @typedef {Object} CalculationInput
 * @property {number} accountValue
 * @property {number} riskPercentage
 * @property {number} entryPrice
 * @property {number} stopLoss
 * @property {string} [tickerSymbol]
 * @property {number} [maxPositions]
 */

/**
 * @typedef {Object} DollarCalculationInput
 * @property {number} dollarRisk
 * @property {number} entryPrice
 * @property {number} stopLoss
 * @property {number} [accountSize]
 * @property {string} [tickerSymbol]
 */

/**
 * @typedef {Object} CalculationResult
 * @property {number} maxShares
 * @property {number} positionSize
 * @property {number} riskPerShare
 * @property {number} dollarsRisked
 * @property {number} [percentRisked]
 * @property {number} [positionPercentAccount]
 * @property {PositionType} positionType
 * @property {number} [oneR]
 * @property {number} [twoR]
 * @property {number} [threeR]
 */

/**
 * @typedef {Object} HistoryEntry
 * @property {string} tickerSymbol
 * @property {string} timestamp
 * @property {CalculationResult} result
 */
