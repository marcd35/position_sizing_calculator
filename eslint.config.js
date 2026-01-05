const js = require('@eslint/js');

module.exports = [
  {
    ignores: ['public/media/**', 'calculator.js']
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: {
        window: 'readonly',
        document: 'readonly',
        notify: 'readonly',
        ERROR_MESSAGES: 'readonly',
        console: 'readonly',
        navigator: 'readonly',
        HTMLElement: 'readonly',
        requestAnimationFrame: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly'
      }
    },
    rules: {
      eqeqeq: 'warn',
      'no-unused-vars': ['warn', { args: 'none', varsIgnorePattern: '^_' }],
      'no-alert': 'error',
      'no-undef': 'off'
    }
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        determinePositionType: 'readonly',
        calculateRiskPerShare: 'readonly',
        calculateTargets: 'readonly'
      }
    }
  }
];
