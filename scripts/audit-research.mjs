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
const filename = path.join(root, 'src/content/research-math.ts');
const source = fs.readFileSync(filename, 'utf8');
const {outputText} = ts.transpileModule(source, {
  compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020},
});
const commonJsModule = {exports: {}};
vm.runInNewContext(outputText, {module: commonJsModule, exports: commonJsModule.exports}, {filename});
const sections = commonJsModule.exports.RESEARCH_MATH_SECTIONS;
const questions = sections.flatMap((section) => section.questions);

assert.equal(sections.length, 7, 'Layer 2 must contain seven guided sections');
assert.equal(questions.length, 9, 'Layer 2 must contain nine checked answers');
assert.equal(new Set(sections.map((section) => section.id)).size, sections.length);
assert.equal(new Set(questions.map((question) => question.id)).size, questions.length);

for (const section of sections) {
  assert.ok(section.title.en.trim() && section.title.zh.trim(), `${section.id}: bilingual title`);
  assert.ok(section.body.length >= 1, `${section.id}: explanation is required`);
  assert.ok(section.formula.trim(), `${section.id}: formula is required`);
  assert.ok(section.questions.length >= 1, `${section.id}: self-check is required`);
}
for (const question of questions) {
  assert.ok(question.prompt.en.trim() && question.prompt.zh.trim(), `${question.id}: bilingual prompt`);
  assert.ok(question.explanation.en.trim() && question.explanation.zh.trim(), `${question.id}: bilingual feedback`);
  assert.ok(Number.isFinite(question.answer), `${question.id}: finite answer`);
  if (question.kind === 'choice') {
    assert.ok(question.options?.length >= 2, `${question.id}: choices are required`);
    assert.ok(question.answer >= 0 && question.answer < question.options.length, `${question.id}: valid correct option`);
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
sections.forEach((section) => auditMath(section, section.id));
assert.ok(renderedFormulas > sections.length, 'Inline formulas must be covered by the audit');
console.log(`Validated KaTeX rendering for ${renderedFormulas} display and inline formulas`);

const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const sampleStd = (values) => {
  const average = mean(values);
  return Math.sqrt(values.reduce((sum, value) => sum + (value - average) ** 2, 0) / (values.length - 1));
};
const correlation = (x, y) => {
  const mx = mean(x);
  const my = mean(y);
  const numerator = x.reduce((sum, value, index) => sum + (value - mx) * (y[index] - my), 0);
  const denominator = Math.sqrt(
    x.reduce((sum, value) => sum + (value - mx) ** 2, 0) *
    y.reduce((sum, value) => sum + (value - my) ** 2, 0),
  );
  return numerator / denominator;
};
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} != ${expected}`);
const answer = (id) => questions.find((question) => question.id === id)?.answer;

near(86 / 80 - 1, answer('return-80-86'));
const x = [0, 1, 2];
const y = [2, 2, 4];
const mx = mean(x);
const my = mean(y);
const slope = x.reduce((sum, value, index) => sum + (value - mx) * (y[index] - my), 0) /
  x.reduce((sum, value) => sum + (value - mx) ** 2, 0);
near(slope, answer('regression-slope'));
near(correlation([1, 2, 3], [6, 4, 2]), -1);
near(mean([0.08, 0.04, 0]) / sampleStd([0.08, 0.04, 0]), answer('icir-one'));
near(correlation([1, 2, 3, 4], [1, 3, 2, 4]), answer('challenge-ic'));
near(mean([0.05, 0.01]) - mean([0.02, -0.03]), answer('challenge-ls'));
near(sampleStd([0.02, -0.01, 0.03]) ** 2, 0.00043333333333333346);

console.log(`Audited ${sections.length} research sections and ${questions.length} self-check answers`);
console.log('Verified return, sample variance, regression, rank IC, ICIR and long–short calculations');
