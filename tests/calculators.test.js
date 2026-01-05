// Simple browser test harness for calculators.js
(function(){
  function approxEqual(a, b, epsilon = 1e-9) {
    return Math.abs(a - b) <= epsilon;
  }

  function assertEqual(actual, expected, name) {
    const pass = actual === expected;
    window.__TESTS__.push({ name, pass, details: pass ? '' : `Expected ${expected}, got ${actual}` });
  }

  function assertApprox(actual, expected, name, epsilon = 1e-6) {
    const pass = approxEqual(actual, expected, epsilon);
    window.__TESTS__.push({ name, pass, details: pass ? '' : `Expected ~${expected}, got ${actual}` });
  }

  function render() {
    const container = document.getElementById('test-results');
    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.padding = '0';

    let passed = 0;
    window.__TESTS__.forEach(t => {
      const li = document.createElement('li');
      li.style.margin = '6px 0';
      li.textContent = `${t.pass ? '✅' : '❌'} ${t.name}${t.details ? ' — ' + t.details : ''}`;
      if (t.pass) passed++;
      list.appendChild(li);
    });

    const summary = document.createElement('div');
    summary.style.marginTop = '10px';
    summary.style.fontWeight = 'bold';
    summary.textContent = `Passed ${passed} / ${window.__TESTS__.length} tests`;

    container.innerHTML = '';
    container.appendChild(list);
    container.appendChild(summary);
  }

  function runTests(){
    window.__TESTS__ = [];

    // determinePositionType
    assertEqual(determinePositionType(100, 90), 'Long Position', 'Position type: Long when entry>stop');
    assertEqual(determinePositionType(90, 100), 'Short Position', 'Position type: Short when stop>entry');
    assertEqual(determinePositionType(100, 100), 'Invalid', 'Position type: Invalid when equal');

    // calculateRiskPerShare
    assertApprox(calculateRiskPerShare(100, 90), 10, 'Risk per share: long');
    assertApprox(calculateRiskPerShare(90, 100), 10, 'Risk per share: short');
    assertApprox(calculateRiskPerShare(100.55, 99.25), 1.3, 'Risk per share: decimals');

    // calculateTargets
    const longTargets = calculateTargets('Long Position', 100, 10);
    assertApprox(longTargets.oneR, 110, 'Long 1R');
    assertApprox(longTargets.twoR, 120, 'Long 2R');
    assertApprox(longTargets.threeR, 130, 'Long 3R');

    const shortTargets = calculateTargets('Short Position', 100, 10);
    assertApprox(shortTargets.oneR, 90, 'Short 1R');
    assertApprox(shortTargets.twoR, 80, 'Short 2R');
    assertApprox(shortTargets.threeR, 70, 'Short 3R');

    render();
  }

  window.addEventListener('DOMContentLoaded', runTests);
})();
