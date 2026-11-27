'use client';

import {useEffect, useMemo, useState} from 'react';
import {useLocale} from 'next-intl';
import {MathText, TeX} from './MathText';
import SupportCard from '../SupportCard';
import QuizSaveNotice from '../trading/QuizSaveNotice';
import {useQuizAttempt} from '../trading/useQuizAttempt';
import {researchQuizIndex} from '@/content/quizzes';
import {
  RESEARCH_MATH_SECTIONS,
  RESEARCH_MATH_SOURCES,
  type LocalText,
  type ResearchQuestion,
} from '@/content/research-math';

const text = (value: LocalText, locale: string) =>
  locale === 'zh' ? value.zh : value.en;

function answerIsCorrect(question: ResearchQuestion, raw: string | undefined) {
  if (raw === undefined || raw.trim() === '') return false;
  if (question.kind === 'choice') return Number(raw) === question.answer;
  const value = Number(raw);
  return Number.isFinite(value) &&
    Math.abs(value - question.answer) <= (question.tolerance ?? 0.0001);
}

function CorrelationVisual({locale}: {locale: string}) {
  const panels = [
    {title: locale === 'zh' ? '完美正相关：+1' : 'Perfect positive: +1', points: [[1, 2], [2, 4], [3, 6]]},
    {title: locale === 'zh' ? '完美负相关：−1' : 'Perfect negative: −1', points: [[1, 6], [2, 4], [3, 2]]},
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {panels.map((panel) => (
        <figure key={panel.title} className="rounded-lg bg-surface p-3">
          <svg viewBox="0 0 220 130" className="h-32 w-full" role="img" aria-label={panel.title}>
            <line x1="28" y1="105" x2="205" y2="105" stroke="currentColor" className="text-navy/25" />
            <line x1="28" y1="15" x2="28" y2="105" stroke="currentColor" className="text-navy/25" />
            {panel.points.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={35 + x * 48} cy={105 - y * 13} r="6" className="fill-accent" />
            ))}
          </svg>
          <figcaption className="text-center text-xs font-medium text-navy/65">{panel.title}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function RankVisual({locale}: {locale: string}) {
  const labels = locale === 'zh'
    ? ['信号降序排名', '未来收益降序排名']
    : ['Signal ranks (descending)', 'Forward-return ranks (descending)'];
  return (
    <div className="rounded-lg bg-surface p-4">
      <div className="grid grid-cols-[1.4fr_repeat(4,1fr)] gap-2 text-center text-xs sm:text-sm">
        <span />
        {['A', 'B', 'C', 'D'].map((stock) => <strong key={stock} className="text-navy">{stock}</strong>)}
        <span className="text-left text-navy/60">{labels[0]}</span>
        {[1, 2, 3, 4].map((rank) => <span key={rank} className="rounded bg-navy py-1 font-semibold text-white">{rank}</span>)}
        <span className="text-left text-navy/60">{labels[1]}</span>
        {[1, 2, 3, 4].map((rank) => <span key={rank} className="rounded bg-accent py-1 font-semibold text-white">{rank}</span>)}
      </div>
      <p className="mt-3 text-center text-xs text-navy/60">
        <MathText text={locale === 'zh'
          ? String.raw`两组排名完全一致 → $\mathrm{IC}=+1$`
          : String.raw`Identical rank vectors → $\mathrm{IC}=+1$`}
        />
      </p>
    </div>
  );
}

export default function ResearchMathCourse() {
  const locale = useLocale();
  const zh = locale === 'zh';
  const [active, setActive] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const section = RESEARCH_MATH_SECTIONS[active];
  const allQuestions = useMemo(
    () => RESEARCH_MATH_SECTIONS.flatMap((item) => item.questions),
    [],
  );
  const correctCount = allQuestions.filter((question) =>
    answerIsCorrect(question, answers[question.id]),
  ).length;
  const sectionCorrect = section.questions.every((question) =>
    answerIsCorrect(question, answers[question.id]),
  );
  const sectionAnswered = section.questions.every(
    (question) => (answers[question.id] ?? '').trim() !== '',
  );
  const isChecked = checked[section.id] ?? false;
  const quizId = 'research-math';
  const {saveState, recordAttempt, questionStates} = useQuizAttempt(quizId);
  const sectionNeedsSupport = section.questions.some((question) => {
    const index = researchQuizIndex(quizId, question.id);
    const state = questionStates.find(
      (item) => item.quizId === quizId && item.questionIndex === index,
    );
    return Boolean(state && !state.mastered && state.failureCount >= 3);
  });

  useEffect(() => {
    const openLinkedSection = () => {
      const id = window.location.hash.slice(1);
      const index = RESEARCH_MATH_SECTIONS.findIndex((item) => item.id === id);
      if (index >= 0) setActive(index);
    };
    openLinkedSection();
    window.addEventListener('hashchange', openLinkedSection);
    return () => window.removeEventListener('hashchange', openLinkedSection);
  }, []);

  const checkSection = () => {
    const picks: Record<number, string> = {};
    for (const question of section.questions) {
      const index = researchQuizIndex(quizId, question.id);
      if (index >= 0) picks[index] = answers[question.id] ?? '';
    }
    setChecked((previous) => ({...previous, [section.id]: true}));
    void recordAttempt(picks);
  };

  const updateAnswer = (id: string, value: string) => {
    setAnswers((previous) => ({...previous, [id]: value}));
    setChecked((previous) => ({...previous, [section.id]: false}));
  };

  const reset = () => {
    setAnswers({});
    setChecked({});
    setActive(0);
  };

  return (
    <div className="mt-6 space-y-5">
      <div className="rounded-xl border border-navy/10 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              {zh ? '即时自测' : 'Instant self-checks'}
            </p>
            <p className="mt-1 text-sm text-navy/65">
              {zh ? '答对' : 'Correct'} {correctCount} / {allQuestions.length}
              {' · '}{zh ? '共 7 个小节，最后为综合挑战' : '7 sections, ending in an integrated challenge'}
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-navy/15 px-4 py-1.5 text-xs font-medium text-navy/65 hover:border-accent hover:text-accent"
          >
            {zh ? '重置答案' : 'Reset answers'}
          </button>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-navy/10">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{width: `${(correctCount / allQuestions.length) * 100}%`}}
          />
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label={zh ? '课程小节' : 'Course sections'}>
          {RESEARCH_MATH_SECTIONS.map((item, index) => {
            const complete = item.questions.every((question) =>
              answerIsCorrect(question, answers[question.id]),
            );
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setActive(index)}
                aria-current={index === active ? 'step' : undefined}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  index === active
                    ? 'bg-accent text-white'
                    : complete
                      ? 'bg-green-100 text-green-800'
                      : 'bg-navy/5 text-navy/60 hover:bg-navy/10'
                }`}
              >
                {complete ? '✓ ' : ''}{index + 1}. {text(item.title, locale)}
              </button>
            );
          })}
        </div>
      </div>

      <article id={section.id} className="scroll-mt-24 overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm">
        <header className="border-b border-navy/10 bg-navy px-5 py-5 text-white sm:px-7">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
            {text(section.eyebrow, locale)}
          </p>
          <h2 className="mt-1 text-xl font-bold">{text(section.title, locale)}</h2>
        </header>
        <div className="space-y-5 p-5 sm:p-7">
          <div className="space-y-3">
            {section.body.map((paragraph, index) => (
              <p key={index} className="text-sm leading-7 text-navy/75">
                <MathText text={text(paragraph, locale)} />
              </p>
            ))}
          </div>

          <div className="overflow-x-auto rounded-lg border border-accent/20 bg-accent-soft/60 px-4 py-3 text-sm text-navy">
            <TeX tex={section.formula} display />
          </div>

          <div className="rounded-lg border border-navy/10 bg-surface p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-navy/50">
              {section.id === 'challenge'
                ? zh ? '挑战说明' : 'Challenge instructions'
                : zh ? '手算示例' : 'Worked example'}
            </h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-navy/75">
              {section.worked.map((line, index) => (
                <li key={index}><MathText text={text(line, locale)} /></li>
              ))}
            </ul>
          </div>

          {section.visual === 'correlation' && <CorrelationVisual locale={locale} />}
          {section.visual === 'ic' && <RankVisual locale={locale} />}

          {section.table && (
            <div className="overflow-x-auto rounded-lg border border-navy/10">
              <table className="w-full min-w-96 text-left text-sm">
                <thead className="bg-navy/5 text-navy/65">
                  <tr>{section.table.headers.map((header, index) => <th key={index} className="px-4 py-2 font-medium">{text(header, locale)}</th>)}</tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row) => (
                    <tr key={row[0]} className="border-t border-navy/10">
                      {row.map((cell, index) => <td key={index} className="px-4 py-2 font-mono text-navy/80">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="space-y-4 border-t border-navy/10 pt-5">
            <h3 className="font-semibold text-navy">{zh ? '轮到你了' : 'Your turn'}</h3>
            {section.questions.map((question) => {
              const correct = answerIsCorrect(question, answers[question.id]);
              return (
                <fieldset key={question.id} className="rounded-lg border border-navy/10 p-4">
                  <legend className="px-1 text-sm font-medium text-navy">
                    <MathText text={text(question.prompt, locale)} />
                  </legend>
                  {question.kind === 'number' ? (
                    <label className="mt-2 block text-xs text-navy/55">
                      {zh ? '输入小数答案' : 'Enter a decimal answer'}
                      <input
                        type="number"
                        step="any"
                        inputMode="decimal"
                        value={answers[question.id] ?? ''}
                        onChange={(event) => updateAnswer(question.id, event.target.value)}
                        className="mt-1.5 w-full max-w-xs rounded-md border border-navy/20 bg-white px-3 py-2 font-mono text-sm text-navy outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
                      />
                    </label>
                  ) : (
                    <div className="mt-2 space-y-2">
                      {question.options?.map((option, index) => (
                        <label key={index} className="flex cursor-pointer items-start gap-2.5 rounded-md p-2 text-sm text-navy/75 hover:bg-surface">
                          <input
                            type="radio"
                            name={question.id}
                            value={index}
                            checked={answers[question.id] === String(index)}
                            onChange={(event) => updateAnswer(question.id, event.target.value)}
                            className="mt-1 accent-[#e8873a]"
                          />
                          <span><MathText text={text(option, locale)} /></span>
                        </label>
                      ))}
                    </div>
                  )}
                  {isChecked && (
                    <div className={`mt-3 rounded-md p-3 text-sm leading-6 ${correct ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-900'}`}>
                      <strong>{correct ? zh ? '✓ 正确。' : '✓ Correct. ' : zh ? '再试一次。' : 'Try again. '}</strong>
                      <MathText text={text(question.explanation, locale)} />
                    </div>
                  )}
                </fieldset>
              );
            })}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={!sectionAnswered}
                onClick={checkSection}
                className="min-h-11 cursor-pointer rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                {zh ? '检查本节答案' : 'Check this section'}
              </button>
              {isChecked && sectionCorrect && (
                <span className="text-sm font-medium text-green-700">
                  {zh ? '本节全部通过' : 'Section complete'}
                </span>
              )}
              {isChecked && <QuizSaveNotice state={saveState} />}
            </div>
            {isChecked && sectionNeedsSupport && <SupportCard topic={text(section.title, locale)} />}
          </div>
        </div>
        <footer className="flex items-center justify-between border-t border-navy/10 px-5 py-4 sm:px-7">
          <button
            type="button"
            disabled={active === 0}
            onClick={() => setActive((index) => Math.max(0, index - 1))}
            className="rounded-full border border-navy/15 px-4 py-2 text-sm text-navy disabled:opacity-30"
          >
            ← {zh ? '上一节' : 'Previous'}
          </button>
          <button
            type="button"
            disabled={active === RESEARCH_MATH_SECTIONS.length - 1}
            onClick={() => setActive((index) => Math.min(RESEARCH_MATH_SECTIONS.length - 1, index + 1))}
            className="rounded-full bg-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-30"
          >
            {zh ? '下一节' : 'Next'} →
          </button>
        </footer>
      </article>

      {correctCount === allQuestions.length && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-green-900" role="status">
          <h2 className="font-bold">{zh ? '数学与金融先修课完成！' : 'Math & finance prerequisites complete!'}</h2>
          <p className="mt-1 text-sm leading-6">
            {zh
              ? '你已经完成收益、多空、样本统计、相关、回归、Rank IC 与 ICIR 的全部自测。下一步仍要用更多日期、未见数据和真实成本检验研究结论。'
              : 'You passed every check on returns, long–short, sample statistics, correlation, regression, rank IC and ICIR. The next research step is still more dates, unseen data and realistic costs.'}
          </p>
        </div>
      )}

      <aside className="rounded-xl border border-navy/10 bg-white p-5 text-sm shadow-sm">
        <h2 className="font-semibold text-navy">{zh ? '教学依据与延伸阅读' : 'Teaching references & further reading'}</h2>
        <ul className="mt-3 space-y-2">
          {RESEARCH_MATH_SOURCES.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                {source.label} ↗
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-5 text-navy/50">
          {zh
            ? '课程用小样本手算建立直觉；指标定义与计算顺序参考上述官方文档及专业平台教学资料。QuantConnect 论坛文章属于平台教学内容，并非同行评审论文。'
            : 'Small hand-calculated samples build intuition. Definitions and calculation order follow the official documentation and professional-platform teaching materials above. The QuantConnect forum article is platform education, not a peer-reviewed paper.'}
        </p>
      </aside>
    </div>
  );
}
