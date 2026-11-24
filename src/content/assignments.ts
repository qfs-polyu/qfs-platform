export type AssignmentTest = {
  name: string;
  code: string;
  expected: string;
};

export type AssignmentVariant = {
  id: string;
  description: string;
  tests: AssignmentTest[];
};

export type Assignment = {
  id: string;
  lesson: number;
  title: string;
  summary: string;
  instructions: string[];
  functionSignature: string;
  starter: string;
  reference: string;
  reviewPath: string;
  variants: AssignmentVariant[];
};

/**
 * L1 coding assignments. Learning content is English per plan §4.6.
 * Every test calls the student's function inside an isolated namespace;
 * numerical results are rounded to six decimals before comparison.
 */
export const ASSIGNMENTS: Assignment[] = [
  {
    id: 'l1-percentage-return',
    lesson: 1,
    title: 'A1 · Percentage return',
    summary: 'Turn an old and a new price into a percentage return.',
    instructions: [
      'Define percentage_return(old_price, new_price).',
      'Return (new_price - old_price) / old_price * 100.',
      'Return a number, not a string with a % sign. Do not round inside the function.'
    ],
    functionSignature: 'percentage_return(old_price, new_price)',
    starter: `def percentage_return(old_price, new_price):
    # Write your calculation below
    pass
`,
    reference: `def percentage_return(old_price, new_price):
    return (new_price - old_price) / old_price * 100
`,
    reviewPath: '/learn/code/1',
    variants: [
      {
        id: 'everyday-moves',
        description: 'Variant 1 · positive and negative price moves',
        tests: [
          {name: 'Test 1', code: 'print(round(percentage_return(100, 110), 6))', expected: '10.0'},
          {name: 'Test 2', code: 'print(round(percentage_return(50, 45), 6))', expected: '-10.0'}
        ]
      },
      {
        id: 'small-and-flat',
        description: 'Variant 2 · small moves and an unchanged price',
        tests: [
          {name: 'Test 1', code: 'print(round(percentage_return(80, 82), 6))', expected: '2.5'},
          {name: 'Test 2', code: 'print(round(percentage_return(200, 200), 6))', expected: '0.0'}
        ]
      },
      {
        id: 'decimal-prices',
        description: 'Variant 3 · decimal prices',
        tests: [
          {name: 'Test 1', code: 'print(round(percentage_return(42.5, 44.625), 6))', expected: '5.0'},
          {name: 'Test 2', code: 'print(round(percentage_return(60, 57), 6))', expected: '-5.0'}
        ]
      }
    ]
  },
  {
    id: 'l1-max-drawdown',
    lesson: 2,
    title: 'A2 · Maximum drawdown',
    summary: 'Measure the worst peak-to-trough decline in a price series.',
    instructions: [
      'Define max_drawdown(prices), where prices is a list of positive numbers.',
      'Track the highest price seen so far and each drawdown: (peak - price) / peak.',
      'Return the largest drawdown as a decimal: 20% is 0.20, not 20.'
    ],
    functionSignature: 'max_drawdown(prices)',
    starter: `def max_drawdown(prices):
    peak = prices[0]
    worst = 0
    # Loop through prices and update peak and worst
    pass
`,
    reference: `def max_drawdown(prices):
    peak = prices[0]
    worst = 0
    for price in prices:
        peak = max(peak, price)
        drawdown = (peak - price) / peak
        worst = max(worst, drawdown)
    return worst
`,
    reviewPath: '/learn/code/2',
    variants: [
      {
        id: 'recovery',
        description: 'Variant 1 · a fall followed by recovery',
        tests: [
          {name: 'Test 1', code: 'print(round(max_drawdown([100, 120, 90, 110]), 6))', expected: '0.25'},
          {name: 'Test 2', code: 'print(round(max_drawdown([50, 40, 50]), 6))', expected: '0.2'}
        ]
      },
      {
        id: 'new-peak',
        description: 'Variant 2 · the worst fall starts at a later peak',
        tests: [
          {name: 'Test 1', code: 'print(round(max_drawdown([100, 95, 102, 96]), 6))', expected: '0.058824'},
          {name: 'Test 2', code: 'print(round(max_drawdown([20, 25, 20, 18]), 6))', expected: '0.28'}
        ]
      },
      {
        id: 'monotonic',
        description: 'Variant 3 · rising and steadily falling series',
        tests: [
          {name: 'Test 1', code: 'print(round(max_drawdown([10, 11, 12]), 6))', expected: '0'},
          {name: 'Test 2', code: 'print(round(max_drawdown([80, 72, 60]), 6))', expected: '0.25'}
        ]
      }
    ]
  },
  {
    id: 'l1-classify-regime',
    lesson: 3,
    title: 'A3 · Classify a market regime',
    summary: 'Use inclusive thresholds to label an index return.',
    instructions: [
      'Define classify_regime(index_return). The input is a decimal return.',
      'Return "Bull" when index_return >= 0.20 and "Bear" when index_return <= -0.20.',
      'Otherwise return "Neutral". The boundary values +0.20 and -0.20 are included.'
    ],
    functionSignature: 'classify_regime(index_return)',
    starter: `def classify_regime(index_return):
    # Use if / elif / else and the inclusive boundaries
    pass
`,
    reference: `def classify_regime(index_return):
    if index_return >= 0.20:
        return "Bull"
    elif index_return <= -0.20:
        return "Bear"
    else:
        return "Neutral"
`,
    reviewPath: '/learn/code/3',
    variants: [
      {
        id: 'boundaries',
        description: 'Variant 1 · exact boundary values',
        tests: [
          {name: 'Test 1', code: 'print(classify_regime(0.20))', expected: 'Bull'},
          {name: 'Test 2', code: 'print(classify_regime(-0.20))', expected: 'Bear'}
        ]
      },
      {
        id: 'inside-range',
        description: 'Variant 2 · returns inside and outside the neutral range',
        tests: [
          {name: 'Test 1', code: 'print(classify_regime(0.05))', expected: 'Neutral'},
          {name: 'Test 2', code: 'print(classify_regime(0.35))', expected: 'Bull'}
        ]
      },
      {
        id: 'near-boundaries',
        description: 'Variant 3 · values just inside the boundaries',
        tests: [
          {name: 'Test 1', code: 'print(classify_regime(0.1999))', expected: 'Neutral'},
          {name: 'Test 2', code: 'print(classify_regime(-0.2001))', expected: 'Bear'}
        ]
      }
    ]
  },
  {
    id: 'l1-daily-returns',
    lesson: 4,
    title: 'A4 · Vectorised daily returns',
    summary: 'Calculate every adjacent daily return with NumPy.',
    instructions: [
      'Define daily_returns(prices). Convert the input to a NumPy array of floats.',
      'Use array slicing and division, not a Python for loop: prices[1:] / prices[:-1] - 1.',
      'Return the NumPy array. Its length must be one less than the input length.'
    ],
    functionSignature: 'daily_returns(prices)',
    starter: `import numpy as np

def daily_returns(prices):
    prices = np.asarray(prices, dtype=float)
    # Use two slices of prices to calculate all returns at once
    pass
`,
    reference: `import numpy as np

def daily_returns(prices):
    prices = np.asarray(prices, dtype=float)
    return prices[1:] / prices[:-1] - 1
`,
    reviewPath: '/learn/code/4',
    variants: [
      {
        id: 'basic-series',
        description: 'Variant 1 · basic price series',
        tests: [
          {name: 'Test 1', code: 'print(np.round(daily_returns([100, 105, 94.5]), 6).tolist())', expected: '[0.05, -0.1]'},
          {name: 'Test 2', code: 'print(np.round(daily_returns([50, 55, 44]), 6).tolist())', expected: '[0.1, -0.2]'}
        ]
      },
      {
        id: 'zero-and-positive',
        description: 'Variant 2 · unchanged and rising prices',
        tests: [
          {name: 'Test 1', code: 'print(np.round(daily_returns([10, 10, 12]), 6).tolist())', expected: '[0.0, 0.2]'},
          {name: 'Test 2', code: 'print(np.round(daily_returns([20, 22, 24.2]), 6).tolist())', expected: '[0.1, 0.1]'}
        ]
      },
      {
        id: 'decimal-series',
        description: 'Variant 3 · decimal prices and a decline',
        tests: [
          {name: 'Test 1', code: 'print(np.round(daily_returns([80, 88, 70.4]), 6).tolist())', expected: '[0.1, -0.2]'},
          {name: 'Test 2', code: 'print(np.round(daily_returns([100, 102, 103.02]), 6).tolist())', expected: '[0.02, 0.01]'}
        ]
      }
    ]
  },
  {
    id: 'l1-annualized-volatility',
    lesson: 5,
    title: 'A5 · Annualised volatility',
    summary: 'Combine daily returns, sample standard deviation and annualisation.',
    instructions: [
      'Define annualized_volatility(prices). Use pandas and at least three prices.',
      'Calculate percentage changes with pd.Series(prices).pct_change().dropna().',
      'Return the sample standard deviation (ddof=1) multiplied by 252 ** 0.5.'
    ],
    functionSignature: 'annualized_volatility(prices)',
    starter: `import pandas as pd

def annualized_volatility(prices):
    returns = pd.Series(prices).pct_change().dropna()
    # Annualise the sample standard deviation of returns
    pass
`,
    reference: `import pandas as pd

def annualized_volatility(prices):
    returns = pd.Series(prices).pct_change().dropna()
    return returns.std() * 252 ** 0.5
`,
    reviewPath: '/learn/code/5',
    variants: [
      {
        id: 'symmetric-ten',
        description: 'Variant 1 · symmetric 10% daily moves',
        tests: [
          {name: 'Test 1', code: 'print(round(annualized_volatility([100, 110, 99]), 6))', expected: '2.244994'},
          {name: 'Test 2', code: 'print(round(annualized_volatility([100, 90, 99]), 6))', expected: '2.244994'}
        ]
      },
      {
        id: 'mixed-moves',
        description: 'Variant 2 · mixed 5% and 10% moves',
        tests: [
          {name: 'Test 1', code: 'print(round(annualized_volatility([100, 105, 94.5, 103.95]), 6))', expected: '1.652271'},
          {name: 'Test 2', code: 'print(round(annualized_volatility([100, 95, 104.5, 94.05]), 6))', expected: '1.652271'}
        ]
      },
      {
        id: 'repeated-moves',
        description: 'Variant 3 · repeated rises followed by a fall',
        tests: [
          {name: 'Test 1', code: 'print(round(annualized_volatility([100, 110, 121, 108.9]), 6))', expected: '1.83303'},
          {name: 'Test 2', code: 'print(round(annualized_volatility([100, 90, 81, 89.1]), 6))', expected: '1.83303'}
        ]
      }
    ]
  }
];

export function getAssignment(id: string): Assignment | undefined {
  return ASSIGNMENTS.find((assignment) => assignment.id === id);
}
