import {QUIZ as FOUNDATIONS_QUIZ} from './foundations-content';
import {QUIZ as CANDLES_QUIZ} from './candles-content';
import {QUIZ as QUOTES_QUIZ} from './quotes-content';
import {RESEARCH_MATH_SECTIONS, type LocalText, type ResearchQuestion} from './research-math';
import {RESEARCH_ELECTIVES} from './research-electives';

export type QuizText = string | LocalText;

export type QuizQuestion = {
  id?: string;
  q: QuizText;
  options?: QuizText[];
  answer: number;
  explain: QuizText;
  kind?: 'choice' | 'number';
  tolerance?: number;
  reviewPath?: string;
};

export type QuizDefinition = {
  title: QuizText;
  reviewPath: string;
  questions: QuizQuestion[];
};

export function quizText(value: QuizText, locale: string): string {
  return typeof value === 'string' ? value : locale === 'zh' ? value.zh : value.en;
}

export function quizAnswerIsCorrect(
  question: QuizQuestion,
  raw: number | string | undefined,
): boolean {
  if (raw === undefined || String(raw).trim() === '') return false;
  if (question.kind !== 'number') return Number(raw) === question.answer;
  const value = Number(raw);
  return Number.isFinite(value) &&
    Math.abs(value - question.answer) <= (question.tolerance ?? 0.0001);
}

function fromResearch(question: ResearchQuestion, reviewPath: string): QuizQuestion {
  return {
    id: question.id,
    q: question.prompt,
    options: question.options,
    answer: question.answer,
    explain: question.explanation,
    kind: question.kind,
    tolerance: question.tolerance,
    reviewPath,
  };
}

const RESEARCH_MATH_QUIZ: QuizDefinition = {
  title: {en: 'Research Math & Finance', zh: '量化研究数学与金融基础'},
  reviewPath: '/learn/research/2',
  questions: RESEARCH_MATH_SECTIONS.flatMap((section) =>
    section.questions.map((question) =>
      fromResearch(question, `/learn/research/2#${section.id}`),
    ),
  ),
};

const ELECTIVE_QUIZZES = Object.fromEntries(
  RESEARCH_ELECTIVES.map((course) => [
    `research-${course.n}`,
    {
      title: course.title,
      reviewPath: `/learn/research/${course.n}`,
      questions: course.sections.map((section) =>
        fromResearch(section.question, `/learn/research/${course.n}#${section.id}`),
      ),
    } satisfies QuizDefinition,
  ]),
) as Record<string, QuizDefinition>;

export const QUIZ_REGISTRY: Record<string, QuizDefinition> = {
  'trading-foundations': {
    title: 'Quant Foundations',
    reviewPath: '/learn/trading/foundations#quiz',
    questions: FOUNDATIONS_QUIZ,
  },
  'trading-candles': {
    title: 'Candlestick Reader',
    reviewPath: '/learn/trading/candles#quiz',
    questions: CANDLES_QUIZ,
  },
  'trading-quotes': {
    title: 'Quote Anatomy',
    reviewPath: '/learn/trading/quotes#quiz',
    questions: QUOTES_QUIZ,
  },
  'research-math': RESEARCH_MATH_QUIZ,
  ...ELECTIVE_QUIZZES,
};

export function researchQuizIndex(quizId: string, questionId: string): number {
  return QUIZ_REGISTRY[quizId]?.questions.findIndex((question) => question.id === questionId) ?? -1;
}

/**
 * Option order of these quizzes changed on `at`. Attempts recorded earlier
 * picked positions from the old order, so they must not be judged against the
 * current answer keys; the mistake notebook and the level gates both skip them.
 */
export const QUIZ_OPTION_ORDER_CHANGED = {
  at: '2026-11-28T10:19:00Z',
  quizIds: ['trading-foundations', 'trading-candles', 'trading-quotes', 'research-1'],
} as const;

/** False for attempts recorded before their quiz's options were reordered. */
export function quizAttemptIsCurrent(attempt: {quiz_id: string; created_at: string}): boolean {
  if (!(QUIZ_OPTION_ORDER_CHANGED.quizIds as readonly string[]).includes(attempt.quiz_id)) return true;
  return Date.parse(attempt.created_at) >= Date.parse(QUIZ_OPTION_ORDER_CHANGED.at);
}
