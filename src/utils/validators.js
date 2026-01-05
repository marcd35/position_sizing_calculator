// @ts-check
/**
 * Validates that a value is a valid number
 * @param {number|string} value 
 * @returns {boolean}
 */
function isValidNumber(value) {
    return value !== '' && value !== null && !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Validates that a value is a positive number
 * @param {number|string} value 
 * @returns {boolean}
 */
function isPositiveNumber(value) {
    return isValidNumber(value) && parseFloat(value) > 0;
}

/**
 * Validates inputs for calculation
 * @param {Record<string, number>} inputs - Key-value pairs of inputs
 * @returns {boolean} - True if all valid
 */
function validateInputs(inputs) {
    for (const [key, value] of Object.entries(inputs)) {
        if (!isValidNumber(value)) {
            return false;
        }
    }
    return true;
}

/**
 * Validates entry and stop loss relationship
 * @param {number} entry 
 * @param {number} stop 
 * @returns {boolean}
 */
function validatePrices(entry, stop) {
    return parseFloat(entry) !== parseFloat(stop);
}
