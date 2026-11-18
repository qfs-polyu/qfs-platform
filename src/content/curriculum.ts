/**
 * Curriculum structure — single source of truth.
 * Per platform decision (plan v2.4 §4.6): learning CONTENT is English-only;
 * the UI chrome is bilingual (zh/en) via next-intl.
 */

export type Level = {
  id: string;
  topic: string;
  track: 'trading' | 'research' | 'coding';
  gate: string;
};

export const LEVELS: Level[] = [
  {
    id: 'L0',
    topic: 'Know Quant & Markets',
    track: 'trading',
    gate: 'L0 quiz ≥ 80%'
  },
  {
    id: 'L1',
    topic: 'Python & pandas Up and Running',
    track: 'coding',
    gate: '5 auto-graded assignments passed'
  },
  {
    id: 'L2',
    topic: 'Read the Market & Trade',
    track: 'trading',
    gate: 'First-month trading report (generated in-site)'
  },
  {
    id: 'L3',
    topic: 'Your First Backtest',
    track: 'coding',
    gate: 'MA-crossover backtest report'
  },
  {
    id: 'L4',
    topic: 'Factor Mining Introduction',
    track: 'research',
    gate: 'Momentum factor group-backtest assignment'
  },
  {
    id: 'L5',
    topic: 'Replication & Competition',
    track: 'research',
    gate: 'Replication notes + entry contest team'
  }
];

export type Stage = {
  n: number;
  title: string;
  blurb: string;
  level: string;
};

export const TRADING_STAGES: Stage[] = [
  {
    n: 1,
    title: 'Reading the Market',
    blurb: 'Interactive candlestick reader, annotated quote pages, concept cards.',
    level: 'L0–L2'
  },
  {
    n: 2,
    title: 'Trading Apps & Orders',
    blurb: 'Teaching-order interface, order lifecycle, reading trade records.',
    level: 'L2'
  },
  {
    n: 3,
    title: 'How Trades Happen',
    blurb: 'Order-book simulator: place limit/market orders, watch matching.',
    level: 'L2'
  },
  {
    n: 4,
    title: 'Simulated Trading & Strategy Tuning',
    blurb: 'Historical replay trading, journals, strategy-adjustment experiments, parameter lab.',
    level: 'L2–L3'
  },
  {
    n: 5,
    title: 'Automated & High-Frequency Trading (Extension)',
    blurb: 'System architecture, strategy-to-system demo, HFT concepts — replay & demo only.',
    level: 'L3+'
  }
];

export const RESEARCH_LAYERS: Stage[] = [
  {
    n: 1,
    title: 'What Is Factor Mining',
    blurb: 'Interactive scatterplot first lesson; the full research pipeline.',
    level: 'L4 entry'
  },
  {
    n: 2,
    title: 'Math & Finance Prerequisites',
    blurb: 'Mean/variance/correlation/regression tools with self-checks; return, long-short, IC/IR.',
    level: 'L4'
  },
  {
    n: 3,
    title: 'A Classic Factor, End to End',
    blurb: 'Momentum in 6 guided steps: data → factor → groups → returns → metrics → discussion.',
    level: 'L4'
  },
  {
    n: 4,
    title: 'Reading Papers & Reports',
    blurb: 'How-to-read template, graded reading list with guide cards, replication assignment.',
    level: 'L5'
  },
  {
    n: 5,
    title: 'Exits: Competitions & Platforms',
    blurb: 'WorldQuant BRAIN, Kaggle write-ups, the society entry contest.',
    level: 'L5+'
  }
];

export type Lesson = {
  n: number;
  title: string;
  assignment: string;
};

export const CODE_LESSONS: Lesson[] = [
  { n: 1, title: 'Variables, Printing & Reading Errors', assignment: 'A percentage-return function' },
  { n: 2, title: 'Lists & Loops: Price Series', assignment: 'Maximum drawdown of a price series' },
  { n: 3, title: 'Functions & Conditionals', assignment: 'Bull/bear regime classifier' },
  { n: 4, title: 'NumPy: Vectorized Thinking', assignment: 'Vectorized daily returns' },
  { n: 5, title: 'pandas I: Series, DataFrame, CSV', assignment: 'Annualized volatility of a stock' },
  { n: 6, title: 'pandas II: Indexing, Slicing, Rolling', assignment: 'MA20 golden/death cross signals' },
  { n: 7, title: 'pandas III: groupby, merge, Plotting', assignment: 'Monthly market-return statistics' },
  { n: 8, title: 'Capstone: pandas + backtesting.py', assignment: 'MA-crossover backtest report (L3 gate)' }
];
