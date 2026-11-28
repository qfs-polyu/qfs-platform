import {ASSIGNMENTS} from '../content/assignments';
import {LEVELS, levelUnits, type UnitRef} from '../content/curriculum';
import {TOTAL_LESSONS} from '../content/lessons';
import {
  QUIZ_REGISTRY,
  quizAnswerIsCorrect,
  quizAttemptIsCurrent,
  type QuizQuestion,
} from '../content/quizzes';
import type {AssignmentSubmissionRecord, QuizAttemptRecord} from './mistakes';

/**
 * Unified learning progress — the one calculation behind the home learning
 * map, the track progress bars and the "My" page.
 *
 * A unit lights up when it is finished: a coding lesson when all its steps
 * are completed, a quiz-based unit when every question has been answered
 * correctly at least once. A level is passed when its gate (plan v2.4 §2.1)
 * is met; gates that need an artefact the platform cannot judge yet only
 * report progress.
 */

export type LevelStatus = 'passed' | 'in_progress' | 'available' | 'locked' | 'upcoming';
export type UnitStatus = 'passed' | 'in_progress' | 'not_started' | 'unavailable';
export type PlacementLevel = 'L0' | 'L1' | 'L2' | 'L3';

export type ProgressInput = {
  /** lesson_id values from lesson_progress */
  completedLessons: number[];
  submissions: Pick<AssignmentSubmissionRecord, 'assignment_id' | 'passed'>[];
  quizAttempts: Pick<QuizAttemptRecord, 'quiz_id' | 'answers' | 'created_at'>[];
  /** Result of the placement assessment, when the learner has taken it. */
  placementLevel?: PlacementLevel | null;
};

export type GateProgress = {passed: boolean; done: number; total: number; automated: boolean};
export type UnitProgress = UnitRef & {
  key: string;
  status: UnitStatus;
  done: number;
  total: number;
};
export type LevelProgress = {
  id: string;
  status: LevelStatus;
  gate: GateProgress;
  units: UnitProgress[];
  /** The level whose gate unlocks this one; null unless the status is locked. */
  lockedBy: string | null;
};
export type TrackProgress = {done: number; total: number};
export type LearningProgress = {
  /** Every level in curriculum order. */
  levels: LevelProgress[];
  tracks: {trading: TrackProgress; research: TrackProgress; coding: TrackProgress};
  /** The level the learner should work on next; null once the automated gates are all passed. */
  currentLevelId: string | null;
};

/** The quizzes behind the L0 gate (Trading stage 1). */
const L0_QUIZZES = ['trading-foundations', 'trading-candles', 'trading-quotes'];
/** Plan v2.4 §2.1: "完成 L0 测验（≥80%）", counted across all L0 questions. */
const L0_PASS_RATIO = 0.8;
const RESEARCH_QUIZ_BY_LAYER: Record<number, string> = {
  1: 'research-1',
  2: 'research-math',
  3: 'research-3',
  4: 'research-4',
  5: 'research-5',
};
/**
 * Levels walked in order: each unlocks once the previous one is passed.
 * L2 is not open yet (M2); Research (L4–L5) is a parallel track and is never locked.
 */
const UNLOCK_CHAIN = ['L0', 'L1', 'L3'];
/** A placement result unlocks its own level and every level below it (plan §2.2: 有基础者可跳级). */
const PLACEMENT_ORDER: Record<string, number> = {L0: 0, L1: 1, L2: 2, L3: 3};

type Completion = Pick<UnitProgress, 'status' | 'done' | 'total'>;

/** Which questions of a quiz the learner has answered correctly at least once. */
function questionsEverCorrect(
  quizId: string,
  attempts: ProgressInput['quizAttempts'],
): boolean[] {
  const questions: QuizQuestion[] = QUIZ_REGISTRY[quizId]?.questions ?? [];
  return questions.map((question, index) =>
    attempts.some(
      (attempt) =>
        attempt.quiz_id === quizId &&
        attempt.answers.some(
          (answer) => answer.question === index && quizAnswerIsCorrect(question, answer.selected),
        ),
    ),
  );
}

function completion(everCorrect: boolean[]): Completion {
  const total = everCorrect.length;
  const done = everCorrect.filter(Boolean).length;
  return {
    done,
    total,
    status: total > 0 && done === total ? 'passed' : done > 0 ? 'in_progress' : 'not_started',
  };
}

export function computeLearningProgress(input: ProgressInput): LearningProgress {
  const {completedLessons, submissions} = input;
  // Attempts saved before a quiz's options were reordered cannot be judged.
  const quizAttempts = input.quizAttempts.filter(quizAttemptIsCurrent);
  const passedAssignments = new Set(
    submissions.filter((submission) => submission.passed).map((submission) => submission.assignment_id),
  );
  const quizCompletion = (quizId: string) =>
    completion(questionsEverCorrect(quizId, quizAttempts));
  const l0 = completion(L0_QUIZZES.flatMap((quizId) => questionsEverCorrect(quizId, quizAttempts)));
  const l0Passed = l0.done >= L0_PASS_RATIO * l0.total;
  const assignmentDone = ASSIGNMENTS.filter((assignment) => passedAssignments.has(assignment.id)).length;

  const unitProgress = (levelId: string, unit: UnitRef): UnitProgress => {
    const base = {...unit, key: `${unit.track}-${unit.n}`};
    if (unit.track === 'coding') {
      const passed = completedLessons.includes(unit.n);
      return {...base, status: passed ? 'passed' : 'not_started', done: passed ? 1 : 0, total: 1};
    }
    if (unit.track === 'research') {
      return {...base, ...quizCompletion(RESEARCH_QUIZ_BY_LAYER[unit.n])};
    }
    // Trading stage 1 carries the whole L0 gate, so it is passed with that
    // gate (8 of 9 questions is enough); stages 2–5 are not built.
    return levelId === 'L0'
      ? {...base, ...l0, status: l0Passed ? 'passed' : l0.status}
      : {...base, status: 'unavailable', done: 0, total: 0};
  };

  const built = LEVELS.map((level) => {
    const units = levelUnits(level.id).map((unit) => unitProgress(level.id, unit));
    const gates: Record<string, GateProgress> = {
      L0: {...l0, automated: true, passed: l0Passed},
      L1: {
        automated: true,
        done: assignmentDone,
        total: ASSIGNMENTS.length,
        passed: assignmentDone === ASSIGNMENTS.length,
      },
      L2: {automated: false, done: 0, total: 0, passed: false},
    };
    // Gates that need an artefact the platform cannot judge yet (L3–L5)
    // report how much of the existing content is finished.
    const open = units.filter((unit) => unit.status !== 'unavailable');
    const gate = gates[level.id] ?? {
      automated: false,
      done: open.filter((unit) => unit.status === 'passed').length,
      total: open.length,
      passed: false,
    };
    return {id: level.id, gate, units};
  });

  const placement = input.placementLevel ?? null;
  const startOrder = placement === null ? 0 : PLACEMENT_ORDER[placement];
  const coveredByPlacement = (levelId: string) =>
    placement !== null &&
    PLACEMENT_ORDER[levelId] !== undefined &&
    PLACEMENT_ORDER[placement] >= PLACEMENT_ORDER[levelId];

  const levels: LevelProgress[] = built.map((item) => {
    const started =
      item.gate.done > 0 ||
      item.units.some((unit) => unit.status === 'in_progress' || unit.status === 'passed');
    const chainIndex = UNLOCK_CHAIN.indexOf(item.id);
    const previous = built.find((candidate) => candidate.id === UNLOCK_CHAIN[chainIndex - 1]);
    let status: LevelStatus;
    if (item.id === 'L2') {
      status = 'upcoming';
    } else if (item.gate.passed) {
      status = 'passed';
    } else if (started) {
      status = 'in_progress';
    } else if (previous && !previous.gate.passed && !coveredByPlacement(item.id)) {
      status = 'locked';
    } else {
      status = 'available';
    }
    return {
      id: item.id,
      status,
      gate: item.gate,
      units: item.units,
      lockedBy: status === 'locked' ? (previous?.id ?? null) : null,
    };
  });

  const passedQuizzes = (quizIds: string[]) =>
    quizIds.filter((quizId) => quizCompletion(quizId).status === 'passed').length;
  const researchQuizzes = Object.values(RESEARCH_QUIZ_BY_LAYER);
  // A level is finished once its gate is passed or, when the gate cannot be
  // judged yet, all of its existing content is done.
  const finished = (level: LevelProgress) =>
    level.gate.passed || level.gate.done === level.gate.total;

  return {
    levels,
    tracks: {
      trading: {done: passedQuizzes(L0_QUIZZES), total: L0_QUIZZES.length},
      research: {done: passedQuizzes(researchQuizzes), total: researchQuizzes.length},
      coding: {
        done: completedLessons.filter((n) => n >= 1 && n <= TOTAL_LESSONS).length,
        total: TOTAL_LESSONS,
      },
    },
    // The learner works on the first unfinished level from the recommended start.
    currentLevelId:
      UNLOCK_CHAIN.filter((id) => PLACEMENT_ORDER[id] >= startOrder).find((id) => {
        const level = levels.find((item) => item.id === id);
        return level !== undefined && !finished(level);
      }) ?? null,
  };
}

export type LevelBadgeKey =
  | 'passed'
  | 'contentComplete'
  | 'inProgress'
  | 'available'
  | 'locked'
  | 'upcoming';

/** The label key and the numbers the learning map shows for a level. */
export function levelBadge(level: LevelProgress): {key: LevelBadgeKey; done: number; total: number} {
  const {gate} = level;
  let key: LevelBadgeKey;
  if (level.status === 'passed') {
    key = 'passed';
  } else if (!gate.automated && gate.total > 0 && gate.done === gate.total) {
    key = 'contentComplete';
  } else if (level.status === 'in_progress') {
    key = 'inProgress';
  } else {
    key = level.status;
  }
  return {key, done: gate.done, total: gate.total};
}
