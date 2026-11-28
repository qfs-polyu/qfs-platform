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

const {computeLearningProgress, levelBadge} = require(path.join(root, 'src/lib/progress.ts'));
const {QUIZ_REGISTRY} = require(path.join(root, 'src/content/quizzes.ts'));

// ---- fixtures ---------------------------------------------------------------
const L0_QUIZZES = ['trading-foundations', 'trading-candles', 'trading-quotes'];
const answerOf = (quizId, question) => QUIZ_REGISTRY[quizId].questions[question].answer;
let counter = 0;
/** One saved quiz attempt; `delta` 0 marks a correct answer, 1 a wrong one. */
const attempt = (quizId, answers, created_at = '2026-12-01T09:00:00Z') => ({
  id: `attempt-${++counter}`,
  quiz_id: quizId,
  score: 0,
  total: answers.length,
  answers: answers.map(([question, delta]) => ({question, selected: answerOf(quizId, question) + delta})),
  created_at,
});
const correct = (quizId, questions, created_at) =>
  attempt(quizId, questions.map((question) => [question, 0]), created_at);
const wrong = (quizId, questions) => attempt(quizId, questions.map((question) => [question, 1]));
const submission = (assignment_id, passed, created_at = '2026-12-01T09:00:00Z') => ({
  id: `submission-${++counter}`,
  assignment_id,
  variant: 'v1',
  code: '',
  passed,
  test_results: [],
  created_at,
});
const empty = {completedLessons: [], submissions: [], quizAttempts: []};

// ---- helpers ----------------------------------------------------------------
const level = (progress, id) => progress.levels.find((item) => item.id === id);
const statuses = (progress) =>
  Object.fromEntries(progress.levels.map((item) => [item.id, item.status]));
const units = (progress, id) => level(progress, id).units.map((unit) => unit.status);
const gate = (progress, id) => {
  const {passed, done, total, automated} = level(progress, id).gate;
  return {passed, done, total, automated};
};
const only = (status, count) => Array(count).fill(status);

// ---- a learner who has not started ------------------------------------------
const fresh = computeLearningProgress(empty);
assert.deepEqual(statuses(fresh), {
  L0: 'available', L1: 'locked', L2: 'upcoming', L3: 'locked', L4: 'available', L5: 'available',
}, 'levels follow the unlock chain L0 -> L1 -> L3; Research is not gated');
assert.equal(fresh.currentLevelId, 'L0', 'a new learner starts at L0');
assert.deepEqual(fresh.tracks, {
  trading: {done: 0, total: 3}, research: {done: 0, total: 5}, coding: {done: 0, total: 8},
}, 'every track has a measurable total');
assert.deepEqual(gate(fresh, 'L0'), {passed: false, done: 0, total: 9, automated: true}, 'L0 counts the nine quiz questions');
assert.deepEqual(gate(fresh, 'L1'), {passed: false, done: 0, total: 5, automated: true}, 'L1 counts the five assignments');
assert.equal(gate(fresh, 'L2').automated, false, 'L2 has no automatic gate yet');
assert.deepEqual(units(fresh, 'L0'), ['not_started']);
assert.deepEqual(units(fresh, 'L1'), only('not_started', 5));
assert.deepEqual(units(fresh, 'L2'), only('unavailable', 3), 'Trading stages 2-4 are not built');
assert.deepEqual(units(fresh, 'L3'), [...only('not_started', 3), 'unavailable'], 'L3 holds lessons 6-8 plus the Trading stage 5 extension');
assert.deepEqual(units(fresh, 'L4'), only('not_started', 3));
assert.deepEqual(units(fresh, 'L5'), only('not_started', 2));
assert.equal(
  gate(computeLearningProgress({...empty, quizAttempts: [wrong('trading-foundations', [0, 1, 2])]}), 'L0').done,
  0,
  'wrong answers do not count',
);

// ---- L0: the three Trading quizzes, counted across all nine questions --------
const sevenOfNine = computeLearningProgress({
  ...empty,
  quizAttempts: [
    correct('trading-foundations', [0, 1, 2]),
    correct('trading-candles', [0, 1, 2]),
    correct('trading-quotes', [0]),
  ],
});
assert.deepEqual(gate(sevenOfNine, 'L0'), {passed: false, done: 7, total: 9, automated: true});
assert.equal(statuses(sevenOfNine).L0, 'in_progress', '7 of 9 is below the 80% line');
assert.equal(sevenOfNine.currentLevelId, 'L0');
assert.equal(statuses(sevenOfNine).L1, 'locked', 'L1 stays locked while L0 is unfinished');
assert.deepEqual(units(sevenOfNine, 'L0'), ['in_progress']);

const eightOfNine = computeLearningProgress({
  ...empty,
  quizAttempts: [
    correct('trading-foundations', [0, 1, 2]),
    correct('trading-candles', [0, 1, 2]),
    correct('trading-quotes', [0, 1]),
  ],
});
assert.deepEqual(gate(eightOfNine, 'L0'), {passed: true, done: 8, total: 9, automated: true}, '8 of 9 clears 80%');
assert.equal(statuses(eightOfNine).L0, 'passed');
assert.equal(statuses(eightOfNine).L1, 'available', 'passing L0 unlocks L1');
assert.equal(statuses(eightOfNine).L3, 'locked', 'L3 still waits for L1');
assert.equal(eightOfNine.currentLevelId, 'L1', 'the learner moves on to L1');
assert.deepEqual(units(eightOfNine, 'L0'), ['passed']);
assert.equal(eightOfNine.tracks.trading.done, 2, 'the Trading bar counts quizzes with every question right');

const everRight = computeLearningProgress({
  ...empty,
  quizAttempts: [
    correct('trading-foundations', [0]),
    attempt('trading-foundations', [[0, 1]], '2026-12-02T09:00:00Z'),
  ],
});
assert.equal(gate(everRight, 'L0').done, 1, 'a question counts once it has ever been answered correctly');

const stale = computeLearningProgress({
  ...empty,
  quizAttempts: [correct('trading-foundations', [0, 1, 2], '2026-11-20T09:00:00Z')],
});
assert.equal(gate(stale, 'L0').done, 0, 'attempts recorded before the options were reordered do not count');

// ---- placement: the assessment lets a learner start higher ------------------
const placed = (placementLevel, extra = {}) => computeLearningProgress({...empty, ...extra, placementLevel});
assert.equal(statuses(placed('L1')).L1, 'available', 'a placement result unlocks its level');
assert.equal(placed('L1').currentLevelId, 'L1', 'the map points the learner at the recommended level');
assert.equal(statuses(placed('L1')).L0, 'available', 'levels before the placement stay open, not passed');
assert.equal(statuses(placed('L3')).L1, 'available', 'everything before the recommended level is unlocked too');
assert.equal(statuses(placed('L3')).L3, 'available');
assert.equal(placed('L3').currentLevelId, 'L3');
assert.equal(statuses(placed('L2')).L3, 'locked', 'a placement below L3 does not unlock it');

// ---- L1: lessons 1-5 light up, five assignments open the gate ---------------
const {ASSIGNMENTS} = require(path.join(root, 'src/content/assignments.ts'));
const l0Attempts = L0_QUIZZES.flatMap((quizId) => [correct(quizId, [0, 1, 2])]);
const oneLesson = computeLearningProgress({...empty, completedLessons: [1]});
assert.deepEqual(units(oneLesson, 'L1'), ['passed', ...only('not_started', 4)]);
assert.equal(statuses(oneLesson).L1, 'in_progress', 'own progress keeps a level open even when the level before it is not passed');
assert.equal(oneLesson.tracks.coding.done, 1);

const fourAssignments = computeLearningProgress({
  ...empty,
  submissions: ASSIGNMENTS.slice(0, 4).map((assignment) => submission(assignment.id, true)),
});
assert.deepEqual(gate(fourAssignments, 'L1'), {passed: false, done: 4, total: 5, automated: true});
assert.equal(statuses(fourAssignments).L1, 'in_progress');

const passedSubmissions = ASSIGNMENTS.map((assignment) => submission(assignment.id, true));
const allAssignments = computeLearningProgress({
  ...empty,
  quizAttempts: l0Attempts,
  submissions: [...passedSubmissions, submission(ASSIGNMENTS[0].id, false, '2026-12-03T09:00:00Z')],
});
assert.deepEqual(gate(allAssignments, 'L1'), {passed: true, done: 5, total: 5, automated: true}, 'an assignment stays passed once it has passed');
assert.equal(statuses(allAssignments).L1, 'passed');
assert.equal(statuses(allAssignments).L3, 'available', 'passing L1 unlocks L3');
assert.equal(allAssignments.currentLevelId, 'L3');

// ---- L3: lessons 6-8 report progress, but the gate has no assignment yet ---
const backtest = computeLearningProgress({
  ...empty,
  completedLessons: [5, 6, 8],
  quizAttempts: l0Attempts,
  submissions: passedSubmissions,
});
assert.deepEqual(units(backtest, 'L3'), ['passed', 'not_started', 'passed', 'unavailable']);
assert.deepEqual(gate(backtest, 'L3'), {passed: false, done: 2, total: 3, automated: false}, 'only units that exist are counted');
assert.equal(statuses(backtest).L3, 'in_progress');
assert.equal(backtest.currentLevelId, 'L3');
assert.equal(backtest.tracks.coding.done, 3);

// ---- every automated gate cleared -------------------------------------------
const everything = computeLearningProgress({
  ...empty,
  completedLessons: [1, 2, 3, 4, 5, 6, 7, 8],
  submissions: passedSubmissions,
  quizAttempts: L0_QUIZZES.flatMap((quizId) => [correct(quizId, [0, 1, 2])]),
});
assert.equal(statuses(everything).L0, 'passed');
assert.equal(statuses(everything).L1, 'passed');
assert.equal(everything.currentLevelId, null, 'a level whose content is complete does not hold the pointer even though its gate is not automated');
assert.deepEqual(everything.tracks, {trading: {done: 3, total: 3}, research: {done: 0, total: 5}, coding: {done: 8, total: 8}});

// ---- Research: a layer lights up when every self-check question is right ----
// Research attempts are saved per section, so correctness is per question.
const layer1 = computeLearningProgress({
  ...empty,
  quizAttempts: [correct('research-1', [0, 1, 2]), attempt('research-1', [[3, 1]])],
});
assert.deepEqual(units(layer1, 'L4'), ['in_progress', 'not_started', 'not_started']);
assert.equal(statuses(layer1).L4, 'in_progress');
assert.deepEqual(gate(layer1, 'L4'), {passed: false, done: 0, total: 3, automated: false});
assert.equal(layer1.tracks.research.done, 0);

const layer1Done = computeLearningProgress({
  ...empty,
  quizAttempts: [correct('research-1', [0, 1, 2]), correct('research-1', [3])],
});
assert.deepEqual(units(layer1Done, 'L4'), ['passed', 'not_started', 'not_started']);
assert.equal(layer1Done.tracks.research.done, 1, 'the Research bar counts finished layers');
assert.equal(statuses(layer1Done).L5, 'available', 'L5 is not held back by L4, L3 or L2');

const math = computeLearningProgress({
  ...empty,
  quizAttempts: [
    correct('research-math', [0, 1]),
    correct('research-math', [2, 3], '2026-12-02T09:00:00Z'),
  ],
});
assert.equal(level(math, 'L4').units[1].status, 'in_progress', 'Layer 2 is the math course');
assert.equal(level(math, 'L4').units[1].done, 4);

const reading = computeLearningProgress({
  ...empty,
  quizAttempts: [correct('research-4', [0, 1, 2, 3]), correct('research-5', [0, 1, 2])],
});
assert.deepEqual(units(reading, 'L5'), ['passed', 'passed']);
assert.deepEqual(gate(reading, 'L5'), {passed: false, done: 2, total: 2, automated: false}, 'L5 content can be finished while its gate stays manual');
assert.equal(statuses(reading).L5, 'in_progress');
assert.equal(reading.tracks.research.done, 2);

const allResearch = computeLearningProgress({
  ...empty,
  quizAttempts: [
    correct('research-1', [0, 1, 2, 3]),
    correct('research-math', [0, 1, 2, 3, 4, 5, 6, 7, 8]),
    correct('research-3', [0, 1, 2, 3, 4, 5]),
    correct('research-4', [0, 1, 2, 3]),
    correct('research-5', [0, 1, 2]),
  ],
});
assert.equal(allResearch.tracks.research.done, 5, 'all five layers can light up');
assert.equal(statuses(allResearch).L4, 'in_progress', 'a manual gate is never reported as passed');
assert.equal(allResearch.currentLevelId, 'L0', 'Research does not move the pointer along the L0-L1-L3 chain');

const staleResearch = computeLearningProgress({
  ...empty,
  quizAttempts: [correct('research-1', [0, 1, 2, 3], '2026-11-20T09:00:00Z')],
});
assert.deepEqual(units(staleResearch, 'L4'), only('not_started', 3), 'research attempts from before the reorder do not count');

const unknownQuiz = {...correct('trading-foundations', [0, 1, 2]), quiz_id: 'no-such-quiz'};
assert.deepEqual(computeLearningProgress({...empty, quizAttempts: [unknownQuiz]}).tracks, fresh.tracks, 'unknown quiz ids are ignored');

assert.equal(level(fresh, 'L1').lockedBy, 'L0', 'a locked level names the level that unlocks it');
assert.equal(level(fresh, 'L3').lockedBy, 'L1');
assert.equal(level(placed('L1'), 'L1').lockedBy, null, 'an unlocked level locks onto nothing');
assert.equal(level(sevenOfNine, 'L0').lockedBy, null);
assert.equal(level(fresh, 'L2').lockedBy, null, 'an upcoming level is not locked by anything');

// ---- what the map calls each level ------------------------------------------
assert.equal(typeof levelBadge, 'function', 'levelBadge is exported');
const badge = (progress, id) => {
  const {key, done, total} = levelBadge(level(progress, id));
  return {key, done, total};
};
assert.deepEqual(badge(fresh, 'L0'), {key: 'available', done: 0, total: 9});
assert.deepEqual(badge(sevenOfNine, 'L0'), {key: 'inProgress', done: 7, total: 9});
assert.deepEqual(badge(eightOfNine, 'L0'), {key: 'passed', done: 8, total: 9});
assert.deepEqual(badge(fresh, 'L1'), {key: 'locked', done: 0, total: 5});
assert.deepEqual(badge(fresh, 'L2'), {key: 'upcoming', done: 0, total: 0});
assert.deepEqual(badge(backtest, 'L3'), {key: 'inProgress', done: 2, total: 3});
assert.deepEqual(badge(reading, 'L5'), {key: 'contentComplete', done: 2, total: 2}, 'finished content behind a manual gate gets its own label');

console.log('Audited learning progress: new learner, L0 quizzes, L1 assignments, L3 lessons, Research layers');
console.log('Validated the unlock chain, placement skip, stale-attempt cutoff and track totals');
