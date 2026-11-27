import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = fileURLToPath(new URL('..', import.meta.url));

require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const {outputText} = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

const {
  assignmentSupportNeeded,
  buildAssignmentStates,
  buildQuizQuestionStates,
} = require(path.join(root, 'src/lib/mistakes.ts'));
const {
  QUIZ_REGISTRY,
  quizAnswerIsCorrect,
  quizText,
  researchQuizIndex,
} = require(path.join(root, 'src/content/quizzes.ts'));

const submission = (id, passed, created_at, assignment_id = 'returns-list') => ({
  id,
  assignment_id,
  variant: 'v1',
  code: 'student code',
  passed,
  test_results: passed ? [] : [{name: 'normal', passed: false, expected: '1', actual: '0'}],
  created_at,
});
const attempt = (id, answers, created_at, quiz_id = 'trading-foundations') => ({
  id,
  quiz_id,
  score: answers.filter((answer) => answer.selected === 0).length,
  total: answers.length,
  answers,
  created_at,
});

// Input order must not matter: history may arrive from another device or session.
const assignmentHistory = [
  submission('pass', true, '2026-11-03T09:00:00Z'),
  submission('fail-1', false, '2026-11-01T09:00:00Z'),
  submission('fail-2', false, '2026-11-02T09:00:00Z'),
];
let states = buildAssignmentStates(assignmentHistory);
assert.equal(states.length, 1);
assert.equal(states[0].attemptCount, 3);
assert.equal(states[0].failureCount, 2);
assert.equal(states[0].mastered, true, 'A latest pass marks the assignment mastered');
assert.equal(states[0].lastFailedSubmission.id, 'fail-2', 'The latest wrong solution remains reviewable');
assert.equal(assignmentSupportNeeded(assignmentHistory, 'returns-list'), false);

const reopenedHistory = [submission('fail-3', false, '2026-11-04T09:00:00Z'), ...assignmentHistory];
states = buildAssignmentStates(reopenedHistory);
assert.equal(states[0].mastered, false, 'A later wrong answer reopens a mastered assignment');
assert.equal(states[0].failureCount, 3);
assert.equal(assignmentSupportNeeded(reopenedHistory, 'returns-list'), true);
assert.equal(assignmentSupportNeeded(reopenedHistory, 'another-assignment'), false);
assert.equal(buildAssignmentStates([submission('clean', true, '2026-11-01T09:00:00Z')])[0].failureCount, 0);

const quizHistory = [
  attempt('quiz-pass', [{question: 0, selected: 0}], '2026-11-03T09:00:00Z'),
  attempt('quiz-fail-1', [{question: 0, selected: 1}], '2026-11-01T09:00:00Z'),
  attempt('quiz-fail-2', [{question: 0, selected: 2}], '2026-11-02T09:00:00Z'),
  attempt('other-question', [{question: 1, selected: 1}], '2026-11-02T10:00:00Z'),
];
const correctness = (quizId, questionIndex, selected) =>
  quizAnswerIsCorrect(QUIZ_REGISTRY[quizId].questions[questionIndex], selected);
let quizStates = buildQuizQuestionStates(quizHistory, correctness);
let question = quizStates.find((item) => item.questionIndex === 0);
assert.equal(question.failureCount, 2);
assert.equal(question.attemptCount, 3);
assert.equal(question.mastered, true);
assert.equal(question.lastFailedAnswer.selected, 2);
assert.equal(quizStates.find((item) => item.questionIndex === 1).mastered, false);

quizStates = buildQuizQuestionStates([
  attempt('quiz-reopened', [{question: 0, selected: 1}], '2026-11-04T09:00:00Z'),
  ...quizHistory,
], correctness);
question = quizStates.find((item) => item.questionIndex === 0);
assert.equal(question.failureCount, 3);
assert.equal(question.mastered, false, 'Quiz mastery follows the latest answer, not any historical pass');

const cleanQuiz = buildQuizQuestionStates([
  attempt('clean-quiz', [{question: 0, selected: 0}], '2026-11-01T09:00:00Z'),
], correctness);
assert.equal(cleanQuiz[0].failureCount, 0, 'A question answered correctly once is not a mistake');

const expectedQuizzes = [
  'trading-foundations', 'trading-candles', 'trading-quotes',
  'research-math', 'research-1', 'research-3', 'research-4', 'research-5',
];
assert.deepEqual(Object.keys(QUIZ_REGISTRY).sort(), expectedQuizzes.sort());
for (const [quizId, quiz] of Object.entries(QUIZ_REGISTRY)) {
  assert.ok(quiz.questions.length > 0, `${quizId}: questions required`);
  if (quizId.startsWith('research-')) {
    const ids = quiz.questions.map((item) => item.id);
    assert.equal(new Set(ids).size, ids.length, `${quizId}: stable unique question IDs`);
    for (const [index, item] of quiz.questions.entries()) {
      assert.ok(item.id, `${quizId}[${index}]: research question ID required`);
      assert.match(item.reviewPath, /^\/learn\/research\/\d+#.+$/, `${item.id}: exact section anchor`);
      assert.equal(researchQuizIndex(quizId, item.id), index);
      assert.equal(quizAnswerIsCorrect(item, item.answer), true, `${item.id}: correct answer accepted`);
      assert.equal(quizAnswerIsCorrect(item, ''), false, `${item.id}: blank answer rejected`);
      if (item.kind === 'choice') {
        const wrong = item.answer === 0 ? 1 : 0;
        assert.equal(quizAnswerIsCorrect(item, wrong), false, `${item.id}: wrong choice rejected`);
      }
    }
  }
}
const numericQuestion = Object.values(QUIZ_REGISTRY)
  .flatMap((quiz) => quiz.questions)
  .find((item) => item.kind === 'number');
assert.ok(numericQuestion, 'Research numeric questions are registered');
assert.equal(quizAnswerIsCorrect(numericQuestion, numericQuestion.answer + numericQuestion.tolerance / 2), true);
assert.equal(quizAnswerIsCorrect(numericQuestion, numericQuestion.answer + numericQuestion.tolerance * 10), false);
assert.equal(quizText({en: 'Factor', zh: '因子'}, 'zh'), '因子');
assert.equal(quizText({en: 'Factor', zh: '因子'}, 'en'), 'Factor');

console.log('Validated assignment and per-question mistake grouping, mastery, reopening and support thresholds');
console.log(`Audited ${Object.keys(QUIZ_REGISTRY).length} persisted quizzes and all Research answer mappings`);
