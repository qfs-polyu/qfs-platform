import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const katex = require('katex');
const ts = require('typescript');
const root = fileURLToPath(new URL('..', import.meta.url));
const filename = path.join(root, 'src/content/research-electives.ts');
const source = fs.readFileSync(filename, 'utf8');
const {outputText} = ts.transpileModule(source, {
  compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020},
});
const commonJsModule = {exports: {}};
vm.runInNewContext(outputText, {module: commonJsModule, exports: commonJsModule.exports}, {filename});
const courses = commonJsModule.exports.RESEARCH_ELECTIVES;
const sections = courses.flatMap((course) => course.sections);
const questions = sections.map((section) => section.question);
const codeSteps = sections.filter((section) => section.code);

assert.deepEqual(Array.from(courses, (course) => course.n), [1, 3, 4, 5]);
assert.equal(courses.length, 4, 'Four elective course layers are required');
assert.equal(sections.length, 17, 'Electives must contain seventeen guided sections');
assert.equal(questions.length, 17, 'Every section needs one self-check');
assert.equal(codeSteps.length, 6, 'Momentum must contain six Python steps');
assert.equal(new Set(courses.map((course) => course.n)).size, courses.length);
assert.equal(new Set(sections.map((section) => section.id)).size, sections.length);
assert.equal(new Set(questions.map((question) => question.id)).size, questions.length);

for (const course of courses) {
  assert.ok(course.title.en.trim() && course.title.zh.trim(), `Layer ${course.n}: bilingual title`);
  assert.ok(course.intro.en.trim() && course.intro.zh.trim(), `Layer ${course.n}: bilingual introduction`);
  assert.ok(course.outcome.en.trim() && course.outcome.zh.trim(), `Layer ${course.n}: bilingual outcome`);
  assert.ok(course.sources.length >= 3, `Layer ${course.n}: authoritative sources`);
  for (const source of course.sources) {
    assert.ok(source.label.trim(), `Layer ${course.n}: source label`);
    assert.match(source.url, /^https:\/\//, `Layer ${course.n}: HTTPS source`);
  }
}
for (const section of sections) {
  assert.ok(section.title.en.trim() && section.title.zh.trim(), `${section.id}: bilingual title`);
  assert.ok(section.body.length >= 1, `${section.id}: explanation is required`);
  for (const paragraph of section.body) {
    assert.ok(paragraph.en.trim() && paragraph.zh.trim(), `${section.id}: bilingual explanation`);
  }
  for (const bullet of section.bullets ?? []) {
    assert.ok(bullet.en.trim() && bullet.zh.trim(), `${section.id}: bilingual checklist`);
  }
  if (section.code) {
    assert.ok(section.code.task.en.trim() && section.code.task.zh.trim(), `${section.id}: bilingual code task`);
    assert.ok(section.code.hint.en.trim() && section.code.hint.zh.trim(), `${section.id}: bilingual code hint`);
    assert.match(section.code.starter, /TODO/, `${section.id}: starter has a learner task`);
    assert.doesNotMatch(section.code.solution, /TODO/, `${section.id}: solution is complete`);
    assert.ok(section.code.expected.trim(), `${section.id}: expected output`);
  }
}
for (const question of questions) {
  assert.ok(question.prompt.en.trim() && question.prompt.zh.trim(), `${question.id}: bilingual prompt`);
  assert.ok(question.explanation.en.trim() && question.explanation.zh.trim(), `${question.id}: bilingual feedback`);
  assert.ok(Number.isFinite(question.answer), `${question.id}: finite answer`);
  if (question.kind === 'choice') {
    assert.ok(question.options?.length >= 2, `${question.id}: choices are required`);
    assert.ok(question.answer >= 0 && question.answer < question.options.length, `${question.id}: valid correct option`);
    for (const option of question.options) {
      assert.ok(option.en.trim() && option.zh.trim(), `${question.id}: bilingual option`);
    }
  } else {
    assert.ok((question.tolerance ?? 0) > 0, `${question.id}: numeric tolerance`);
  }
}

let renderedFormulas = 0;
const renderFormula = (tex, displayMode, location) => {
  try {
    katex.renderToString(tex, {displayMode, output: 'htmlAndMathml', throwOnError: true});
    renderedFormulas += 1;
  } catch (error) {
    assert.fail(`${location}: invalid TeX — ${error.message}`);
  }
};
const auditMath = (value, location, displayMode = false) => {
  if (typeof value === 'string') {
    if (displayMode) renderFormula(value, true, location);
    const inline = [...value.matchAll(/\$([^$]+)\$/g)];
    const dollarCount = value.match(/\$/g)?.length ?? 0;
    assert.equal(dollarCount, inline.length * 2, `${location}: unmatched or empty $...$ delimiter`);
    for (const match of inline) renderFormula(match[1], false, location);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => auditMath(item, `${location}[${index}]`));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      auditMath(item, `${location}.${key}`, key === 'formula');
    }
  }
};
courses.forEach((course) => auditMath(course, `Layer ${course.n}`));
assert.ok(renderedFormulas >= 50, 'Display and inline formulas must both be covered');
console.log(`Validated KaTeX rendering for ${renderedFormulas} elective formulas`);

const prices = {
  A: [100, 120, 132],
  B: [100, 110, 115.5],
  C: [100, 105, 103.95],
  D: [100, 100, 101],
  E: [100, 90, 93.6],
  F: [100, 80, 76],
};
const stocks = Object.keys(prices);
const momentum = Object.fromEntries(stocks.map((stock) => {
  const [p0, p1] = prices[stock];
  return [stock, p1 / p0 - 1];
}));
const forward = Object.fromEntries(stocks.map((stock) => {
  const [, p1, p2] = prices[stock];
  return [stock, p2 / p1 - 1];
}));
const ranked = [...stocks].sort((a, b) => momentum[b] - momentum[a]);
const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const topReturn = mean(ranked.slice(0, 2).map((stock) => forward[stock]));
const bottomReturn = mean(ranked.slice(-2).map((stock) => forward[stock]));
const longShort = topReturn - bottomReturn;
const momOrder = [...stocks].sort((a, b) => momentum[a] - momentum[b]);
const retOrder = [...stocks].sort((a, b) => forward[a] - forward[b]);
const momRank = Object.fromEntries(momOrder.map((stock, index) => [stock, index + 1]));
const retRank = Object.fromEntries(retOrder.map((stock, index) => [stock, index + 1]));
const dSquared = stocks.reduce((sum, stock) => sum + (momRank[stock] - retRank[stock]) ** 2, 0);
const rankIC = 1 - 6 * dSquared / (stocks.length * (stocks.length ** 2 - 1));
let equity = 1;
let peak = 1;
let maxDrawdown = 0;
for (const value of [0.08, -0.04, 0.02]) {
  equity *= 1 + value;
  peak = Math.max(peak, equity);
  maxDrawdown = Math.max(maxDrawdown, 1 - equity / peak);
}
const near = (actual, expected, tolerance = 1e-10) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);
};
const answer = (id) => questions.find((question) => question.id === id)?.answer;
const expectedOutput = (id) => sections.find((section) => section.id === id)?.code.expected;

near(momentum.A, answer('momentum-a-signal'));
near(forward.C, answer('momentum-c-forward'));
near(topReturn, 0.075);
near(bottomReturn, -0.005);
near(longShort, answer('momentum-group-return'));
near(rankIC, answer('momentum-rank-ic'), 0.00005);
near(maxDrawdown, 0.04);
near(longShort - 0.01, 0.07);
assert.equal(expectedOutput('momentum-data'), 'A 120');
assert.equal(expectedOutput('momentum-groups'), 'Top 0.075\nBottom -0.005\nLong-short 0.08');
assert.equal(expectedOutput('momentum-metrics'), 'Rank IC 0.7714\nMax drawdown 0.04');
assert.equal(expectedOutput('momentum-discussion'), 'Gross 0.08\nNet 0.07\nOOS -0.02');
near(answer('factor-picture-spread'), longShort);

console.log(`Audited ${courses.length} elective courses, ${sections.length} sections and ${questions.length} self-checks`);
console.log('Verified momentum, forward returns, group spreads, Rank IC, drawdown and trading costs');
