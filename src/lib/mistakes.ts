export type AssignmentSubmissionRecord = {
  id: string;
  assignment_id: string;
  variant: string;
  code: string;
  passed: boolean;
  test_results: {name: string; passed: boolean; expected: string; actual: string}[];
  created_at: string;
};

export type QuizAnswerRecord = {
  question: number;
  selected: number | string;
};

export type QuizAttemptRecord = {
  id: string;
  quiz_id: string;
  score: number;
  total: number;
  answers: QuizAnswerRecord[];
  created_at: string;
};

export type AssignmentMistakeState = {
  assignmentId: string;
  attemptCount: number;
  failureCount: number;
  mastered: boolean;
  lastAttemptAt: string;
  lastFailedAt: string | null;
  lastFailedSubmission: AssignmentSubmissionRecord | null;
};

export type QuizQuestionState = {
  quizId: string;
  questionIndex: number;
  attemptCount: number;
  failureCount: number;
  mastered: boolean;
  lastAttemptAt: string;
  lastFailedAt: string | null;
  lastFailedAttempt: QuizAttemptRecord | null;
  lastFailedAnswer: QuizAnswerRecord | null;
};

const time = (value: string) => Date.parse(value) || 0;
const newestFirst = <T extends {created_at: string}>(items: T[]) =>
  [...items].sort((a, b) => time(b.created_at) - time(a.created_at));

/**
 * Derive durable learning state from the append-only submission history.
 * A later pass marks an assignment mastered; a later failure reopens it.
 */
export function buildAssignmentStates(
  submissions: AssignmentSubmissionRecord[],
): AssignmentMistakeState[] {
  const groups = new Map<string, AssignmentSubmissionRecord[]>();
  for (const submission of submissions) {
    const group = groups.get(submission.assignment_id) ?? [];
    group.push(submission);
    groups.set(submission.assignment_id, group);
  }

  return [...groups.entries()].map(([assignmentId, records]) => {
    const ordered = newestFirst(records);
    const failures = ordered.filter((submission) => !submission.passed);
    return {
      assignmentId,
      attemptCount: ordered.length,
      failureCount: failures.length,
      mastered: ordered[0]?.passed ?? false,
      lastAttemptAt: ordered[0]?.created_at ?? '',
      lastFailedAt: failures[0]?.created_at ?? null,
      lastFailedSubmission: failures[0] ?? null,
    };
  });
}

/** Build one durable state per quiz question, including section-only attempts. */
export function buildQuizQuestionStates(
  attempts: QuizAttemptRecord[],
  isCorrect: (quizId: string, questionIndex: number, selected: number | string) => boolean,
): QuizQuestionState[] {
  type Entry = {
    attempt: QuizAttemptRecord;
    answer: QuizAnswerRecord;
    correct: boolean;
  };
  const groups = new Map<string, Entry[]>();

  for (const attempt of attempts) {
    for (const answer of attempt.answers) {
      const key = `${attempt.quiz_id}:${answer.question}`;
      const entry = {
        attempt,
        answer,
        correct: isCorrect(attempt.quiz_id, answer.question, answer.selected),
      };
      const group = groups.get(key) ?? [];
      group.push(entry);
      groups.set(key, group);
    }
  }

  return [...groups.values()].map((records) => {
    const ordered = [...records].sort(
      (a, b) => time(b.attempt.created_at) - time(a.attempt.created_at),
    );
    const failures = ordered.filter((entry) => !entry.correct);
    const latest = ordered[0];
    return {
      quizId: latest.attempt.quiz_id,
      questionIndex: latest.answer.question,
      attemptCount: ordered.length,
      failureCount: failures.length,
      mastered: latest.correct,
      lastAttemptAt: latest.attempt.created_at,
      lastFailedAt: failures[0]?.attempt.created_at ?? null,
      lastFailedAttempt: failures[0]?.attempt ?? null,
      lastFailedAnswer: failures[0]?.answer ?? null,
    };
  });
}

export function assignmentSupportNeeded(
  submissions: AssignmentSubmissionRecord[],
  assignmentId: string,
): boolean {
  const state = buildAssignmentStates(submissions).find(
    (item) => item.assignmentId === assignmentId,
  );
  return Boolean(state && !state.mastered && state.failureCount >= 3);
}
