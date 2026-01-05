# Position Sizing Calculator

A suite of three position sizing calculators designed for swing traders to manage risk and optimize trade sizing.

## Overview

This tool provides three different calculation methods to help traders determine appropriate position sizes based on their risk management strategy:

1. **Total Account Risk %** - Calculate position size based on the percentage of your total account you're willing to risk
2. **Dollar Risk** - Calculate position size based on a fixed dollar amount you're willing to risk
3. **Position Percent** - Calculate position size based on the percentage of your portfolio you want to allocate to a position

## Features

- **Three Calculation Methods**: Choose the method that best fits your trading strategy
- **Long & Short Positions**: Automatically detects and handles both long and short positions
- **Risk Metrics**: Displays risk per share, dollars risked, and position size as % of account
- **Calculation History**: Keeps track of your recent calculations with timestamps
- **Copy to Clipboard**: Click any blue result to copy it to your clipboard
- **Clean Interface**: Simple, user-friendly design focused on essential calculations

## Calculation Methods

### Method 1: Total Account Risk %
Determine your position size based on what percentage of your total account you're willing to risk on a single trade.

**Inputs:**
- Account Value
- Risk Percentage (% of account to risk)
- Entry Price
- Stop Loss
- Max Positions (optional - for portfolio allocation)
- Ticker Symbol (optional)

**Outputs:**
- Maximum Shares
- Position Size
- Risk per Share
- Percent Risked per Trade
- Dollars Risked
- Target Profit Prices (1R, 2R, 3R)
- Position Allotment (if max positions specified)

### Method 2: Dollar Risk
Determine your position size based on a fixed dollar amount you're willing to risk.

**Inputs:**
- Dollar Risk Amount
- Entry Price
- Stop Loss
- Account Value (optional - for % calculation)
- Ticker Symbol (optional)

**Outputs:**
- Maximum Shares
- Position Size
- Risk per Share
- Dollars Risked
- Position Size as % of Account (if account value provided)

### Method 3: Position Percent
Determine your position size based on what percentage of your portfolio you want to allocate to a position.

**Inputs:**
- Account Value
- Position Risk % (% of account to allocate)
- Entry Price
- Stop Loss
- Ticker Symbol (optional)

**Outputs:**
- Maximum Shares
- Position Size
- Risk per Share
- Percent Risked
- Dollars Risked

## Usage

1. Choose the calculator that matches your risk management approach
2. Fill in the required fields
3. Click "Calculate" to see your results
4. Click any blue result value to copy it to your clipboard
5. View your calculation history below the results

## Technology

- Pure HTML, CSS, and JavaScript
- No dependencies or frameworks
- Works offline
- Mobile-friendly responsive design

## Testing

Basic browser tests are available for the core calculation utilities.

- Tests location: [tests/calculators.test.html](tests/calculators.test.html)
- How to run:
	1. Open the HTML file in a browser
	2. Review pass/fail results rendered on the page

These tests cover:
- `determinePositionType()` for Long/Short/Invalid detection
- `calculateRiskPerShare()` for numeric differences
- `calculateTargets()` for 1R/2R/3R computations on Long and Short positions

## About

This calculator was developed and maintained by [r/swingtrading](https://www.reddit.com/r/swingtrading/) moderator [Cheungster](https://www.reddit.com/user/cheungster/) in collaboration with ChatGPT.

At r/swingtrading, the mission is to provide evidence-based education and empower traders to make smarter trading decisions by prioritizing [risk management protocols](https://www.investopedia.com/terms/r/riskmanagement.asp).

## Community

- **Subreddit**: [r/swingtrading](https://www.reddit.com/r/swingtrading/)
- **Discord**: [Join our Discord server](https://discord.gg/yWFavAVQpm)

## Disclaimer

This calculator is for educational purposes only and does not constitute financial advice. Trading involves risk, and you should consult with a qualified financial professional before making any trading decisions. By using this calculator, you acknowledge that you assume all responsibility for your trades and the results thereof.

## Support

Domain and hosting costs are independently supported by generous community members. If you find this calculator valuable, please consider [supporting the project](https://buymeacoffee.com/rswingtrading).

## License

This project is maintained as a free educational resource for the swing trading community.
