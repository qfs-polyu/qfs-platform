import {QUIZ as FOUNDATIONS_QUIZ} from './foundations-content';
import {QUIZ as CANDLES_QUIZ} from './candles-content';
import {QUIZ as QUOTES_QUIZ} from './quotes-content';

export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number;
  explain: string;
};

export type QuizDefinition = {
  title: string;
  reviewPath: string;
  questions: QuizQuestion[];
};

export const QUIZ_REGISTRY: Record<string, QuizDefinition> = {
  'trading-foundations': {
    title: 'Quant Foundations',
    reviewPath: '/learn/trading/foundations',
    questions: FOUNDATIONS_QUIZ
  },
  'trading-candles': {
    title: 'Candlestick Reader',
    reviewPath: '/learn/trading/candles',
    questions: CANDLES_QUIZ
  },
  'trading-quotes': {
    title: 'Quote Anatomy',
    reviewPath: '/learn/trading/quotes',
    questions: QUOTES_QUIZ
  }
};
