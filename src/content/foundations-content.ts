/**
 * Foundations: what quantitative finance is, what markets quants trade,
 * and why this platform teaches with stocks. English content per plan §4.6.
 */

export const INTRO_SECTIONS = [
  {
    key: 'whatis',
    title: 'What is quantitative finance?',
    paras: [
      'Quantitative finance ("quant") means making investment decisions with data, models and code — instead of gut feeling, news headlines, or a star manager\'s instinct.',
      'The practical test: can the decision rule be written down and tested on history? "Buy when price is 10% above its 20-day average" is a quant rule — you can backtest it. "This CEO sounds trustworthy" is not.',
      'What quants actually do forms a pipeline: find signals that may explain returns (factors) → combine signals into a portfolio → execute trades efficiently → measure and control risk. Every lesson on this platform maps to one of these stages.'
    ]
  },
  {
    key: 'vs',
    title: 'Quant vs. discretionary — same market, different method',
    paras: [
      'Discretionary traders study companies, news and charts, then decide case by case. Quant researchers turn the same ideas into explicit rules and let data judge them.',
      'Neither is "better". The quant way has one superpower for learners: every claim can be checked — you will spend most of your time here proving (or disproving) ideas with real data, not trusting anyone\'s story.'
    ]
  }
];

export const MARKETS = [
  {
    name: 'Stocks',
    desc: 'A share of ownership in a company. Prices move with earnings, sentiment and flows. No expiry, no leverage unless you borrow.',
    example: 'Tencent (0700.HK), Apple (AAPL)'
  },
  {
    name: 'ETFs',
    desc: 'A basket (of stocks, bonds, commodities…) that trades like a single stock.',
    example: 'Tracker Fund of Hong Kong (2800.HK)'
  },
  {
    name: 'Futures',
    desc: 'Contracts to buy/sell at a fixed price on a future date. Built-in leverage and expiry — bigger gains, bigger holes.',
    example: 'Hang Seng Index futures'
  },
  {
    name: 'FX (currencies)',
    desc: 'Exchanging one currency for another; the largest market by volume, open 24/5.',
    example: 'USD/HKD, EUR/USD'
  },
  {
    name: 'Options',
    desc: 'The right (not obligation) to buy or sell at a fixed price — asymmetric payoff, more math.',
    example: 'AAPL calls'
  },
  {
    name: 'Crypto',
    desc: 'Digital assets trading 24/7; very volatile, very young market.',
    example: 'Bitcoin, Ether'
  }
];

export const WHY_STOCKS = [
  'Free, clean, daily data — you can pull real history and test ideas from day one.',
  'No leverage or expiry to worry about while learning the basics.',
  'Every core skill — returns, risk, backtesting, factors — transfers directly to other instruments later.'
];

export const QUIZ = [
  {
    q: 'Which rule is the most "quantitative"?',
    options: [
      'Buy when price closes above its 20-day average for 5 straight days',
      'Buy because the founder seemed confident in the interview',
      'Sell because a friend heard something at dinner',
      'Hold because the chart "feels right"'
    ],
    answer: 0,
    explain: 'Only the first rule is explicit and testable on historical data — that is the quant test.'
  },
  {
    q: 'Compared with stocks, futures contracts typically add…',
    options: [
      'Leverage and an expiry date',
      'Ownership of the company',
      'Dividend payments',
      'Lower price volatility always'
    ],
    answer: 0,
    explain: 'Futures are leveraged contracts with delivery dates — risk management matters even more there.'
  },
  {
    q: 'This platform teaches quant with stocks mainly because…',
    options: [
      'Stock data is free and clean, and the skills transfer to other instruments',
      'Stocks always go up',
      'Other instruments are illegal',
      'Stocks have no risk'
    ],
    answer: 0,
    explain: 'Free real data lets you test ideas from day one; returns, risk and backtesting concepts carry over.'
  }
];
