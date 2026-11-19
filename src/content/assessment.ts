/**
 * Placement assessment — 13 single-choice questions (content in English per
 * plan §4.6). Scores map to a recommended starting level on the learning map.
 * Draft content: to be refined by the content leads (三原则 applies).
 */

export type Area = 'finance' | 'programming' | 'quant' | 'profile';

export type Question = {
  id: number;
  area: Area;
  q: string;
  options: string[];
  /** score awarded per option; profile questions carry meta instead */
  scores?: number[];
  meta?: string[]; // for profile answers: english level or track tag
};

export const QUESTIONS: Question[] = [
  // Finance basics (4)
  {
    id: 1,
    area: 'finance',
    q: 'In market language, "bullish" means you expect prices to…',
    options: ['Rise', 'Fall', 'Stay flat', 'Stop trading'],
    scores: [1, 0, 0, 0]
  },
  {
    id: 2,
    area: 'finance',
    q: 'You buy one share at $100 and sell it at $110. Your return is closest to…',
    options: ['1%', '10%', '110%', '$110'],
    scores: [0, 1, 0, 0]
  },
  {
    id: 3,
    area: 'finance',
    q: 'Diversification — holding many different assets — mainly aims to…',
    options: [
      'Guarantee profit',
      'Reduce risk by not betting on one thing',
      'Increase trading fees',
      'Avoid paying tax'
    ],
    scores: [0, 1, 0, 0]
  },
  {
    id: 4,
    area: 'finance',
    q: 'A stock\'s "volume" on a day measures…',
    options: [
      'The company\'s profit',
      'How many shares changed hands',
      'The dividend paid',
      'The number of employees'
    ],
    scores: [0, 1, 0, 0]
  },
  // Programming basics (4)
  {
    id: 5,
    area: 'programming',
    q: 'In Python, print("hello") will…',
    options: [
      'Store "hello" in a file',
      'Show "hello" in the console',
      'Draw "hello" on a chart',
      'Delete "hello" from memory'
    ],
    scores: [0, 1, 0, 0]
  },
  {
    id: 6,
    area: 'programming',
    q: 'Which line stores the number 5 in a variable named price?',
    options: ['price = 5', 'price: 5', '5 = price', 'int price 5'],
    scores: [1, 0, 0, 0]
  },
  {
    id: 7,
    area: 'programming',
    q: 'A for loop is used to…',
    options: [
      'Repeat steps over a sequence',
      'Define a function',
      'Install a library',
      'Stop the program'
    ],
    scores: [1, 0, 0, 0]
  },
  {
    id: 8,
    area: 'programming',
    q: 'The pandas library is mainly used for…',
    options: [
      'Building websites',
      'Working with tables and time series',
      'Editing photos',
      'Sending emails'
    ],
    scores: [0, 1, 0, 0]
  },
  // Quant concepts (3)
  {
    id: 9,
    area: 'quant',
    q: 'A "backtest" means…',
    options: [
      'Testing a strategy on historical data',
      'Trading with real money',
      'Reading the company\'s annual report',
      'Stress-testing a server'
    ],
    scores: [1, 0, 0, 0]
  },
  {
    id: 10,
    area: 'quant',
    q: 'In quantitative investing, a "factor" is…',
    options: [
      'A fee charged by the broker',
      'A measurable signal that may explain returns',
      'The color of a candlestick',
      'A type of bank account'
    ],
    scores: [0, 1, 0, 0]
  },
  {
    id: 11,
    area: 'quant',
    q: 'Simulated ("paper") trading differs from real trading because…',
    options: [
      'No real money is at risk',
      'Profits are guaranteed',
      'Prices move faster',
      'There are no prices at all'
    ],
    scores: [1, 0, 0, 0]
  },
  // Profile (2)
  {
    id: 12,
    area: 'profile',
    q: 'How comfortable are you learning from English materials?',
    options: ['Very comfortable', 'Okay with some dictionary help', 'Quite difficult'],
    meta: ['en-high', 'en-mid', 'en-low']
  },
  {
    id: 13,
    area: 'profile',
    q: 'Which track interests you most right now?',
    options: [
      'Trading — markets, charts, simulation',
      'Research — factors, papers, backtests',
      'Coding — Python and data skills',
      'All of them equally'
    ],
    meta: ['trading', 'research', 'coding', 'all']
  }
];

export type PlacementResult = {
  level: 'L0' | 'L1' | 'L2' | 'L3';
  reasonKey: string;
  track: 'trading' | 'research' | 'coding' | 'all';
  english: 'en-high' | 'en-mid' | 'en-low';
  scores: {finance: number; programming: number; quant: number};
};

export function scorePlacement(answers: Record<number, number>): PlacementResult {
  let finance = 0;
  let programming = 0;
  let quant = 0;
  let track: PlacementResult['track'] = 'all';
  let english: PlacementResult['english'] = 'en-mid';
  for (const question of QUESTIONS) {
    const pick = answers[question.id];
    if (pick === undefined) continue;
    if (question.area === 'finance') finance += question.scores?.[pick] ?? 0;
    if (question.area === 'programming') programming += question.scores?.[pick] ?? 0;
    if (question.area === 'quant') quant += question.scores?.[pick] ?? 0;
    if (question.id === 12) english = (question.meta?.[pick] as PlacementResult['english']) ?? 'en-mid';
    if (question.id === 13) track = (question.meta?.[pick] as PlacementResult['track']) ?? 'all';
  }

  let level: PlacementResult['level'];
  let reasonKey: string;
  if (programming >= 3 && quant >= 2) {
    level = 'L3';
    reasonKey = 'reasonL3';
  } else if (programming >= 3) {
    level = 'L2';
    reasonKey = 'reasonL2';
  } else if (finance >= 2) {
    level = 'L1';
    reasonKey = 'reasonL1';
  } else {
    level = 'L0';
    reasonKey = 'reasonL0';
  }

  return {level, reasonKey, track, english, scores: {finance, programming, quant}};
}
