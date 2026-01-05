/**
 * Determines position type (Long or Short)
 * @param {number} entry
 * @param {number} stop
 * @returns {string} "Long Position" | "Short Position" | "Invalid"
 */
function determinePositionType(entry, stop) {
  entry = parseFloat(entry);
  stop = parseFloat(stop);

  if (entry > stop) return 'Long Position';
  if (stop > entry) return 'Short Position';
  return 'Invalid';
}

/**
 * Calculates risk per share
 * @param {number} entry
 * @param {number} stop
 * @returns {number}
 */
function calculateRiskPerShare(entry, stop) {
  return Math.abs(parseFloat(entry) - parseFloat(stop));
}

/**
 * Calculates target prices (1R, 2R, 3R)
 * @param {('Long Position'|'Short Position')} positionType
 * @param {number} entry
 * @param {number} riskPerShare
 * @returns {Object} { oneR, twoR, threeR }
 */
function calculateTargets(positionType, entry, riskPerShare) {
  entry = parseFloat(entry);
  riskPerShare = parseFloat(riskPerShare);

  let multiplier = positionType === 'Long Position' ? 1 : -1;

  return {
    oneR: entry + riskPerShare * 1 * multiplier,
    twoR: entry + riskPerShare * 2 * multiplier,
    threeR: entry + riskPerShare * 3 * multiplier,
  };
}
