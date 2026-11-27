'use client';

import {useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {useLocale} from 'next-intl';
import {MathText, TeX} from './MathText';
import SupportCard from '../SupportCard';
import QuizSaveNotice from '../trading/QuizSaveNotice';
import {useQuizAttempt} from '../trading/useQuizAttempt';
import {researchQuizIndex} from '@/content/quizzes';
import {usePyodide} from '../pyodide/usePyodide';
import type {LocalText, ResearchQuestion} from '@/content/research-math';
import type {
  ResearchCodeStep,
  ResearchElectiveCourse as Course,
  ResearchElectiveSection,
} from '@/content/research-electives';

const CodeEditor = dynamic(() => import('../CodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex h-56 items-center justify-center bg-[#1e2530] p-4 font-mono text-sm text-white/60">
      Loading editor…
    </div>
  ),
});

const text = (value: LocalText, locale: string) => locale === 'zh' ? value.zh : value.en;

function answerIsCorrect(question: ResearchQuestion, raw: string | undefined) {
  if (raw === undefined || raw.trim() === '') return false;
  if (question.kind === 'choice') return Number(raw) === question.answer;
  const value = Number(raw);
  return Number.isFinite(value) &&
    Math.abs(value - question.answer) <= (question.tolerance ?? 0.0001);
}

const NUM_RE = /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/;
const tokEq = (a: string, b: string) => {
  if (a === b) return true;
  return NUM_RE.test(a) && NUM_RE.test(b)
    ? Math.abs(Number(a) - Number(b)) <=
      1e-3 * Math.max(1, Math.abs(Number(a)), Math.abs(Number(b)))
    : false;
};
const toLines = (value: string) => value.replace(/\r/g, '').split('\n')
  .map((line) => line.trim()).filter(Boolean);
const lineEq = (a: string, b: string) => {
  const left = a.trim().split(/\s+/);
  const right = b.trim().split(/\s+/);
  return left.length === right.length && left.every((token, index) => tokEq(token, right[index]));
};

/** Accept equivalent numeric formatting and additional explanatory output. */
export function outputsMatch(expected: string, actual: string) {
  const wanted = toLines(expected);
  const received = toLines(actual);
  if (!wanted.length || received.length < wanted.length) return false;
  for (let start = 0; start + wanted.length <= received.length; start += 1) {
    if (wanted.every((line, offset) => lineEq(line, received[start + offset]))) return true;
  }
  return false;
}

const STOCKS = [
  {name: 'A', momentum: 0.2, forward: 0.1},
  {name: 'B', momentum: 0.1, forward: 0.05},
  {name: 'C', momentum: 0.05, forward: -0.01},
  {name: 'D', momentum: 0, forward: 0.01},
  {name: 'E', momentum: -0.1, forward: 0.04},
  {name: 'F', momentum: -0.2, forward: -0.05},
];
const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
const decimal = (value: number) => String(Number(value.toFixed(4)));

function FactorScatter({locale}: {locale: string}) {
  const zh = locale === 'zh';
  const [groupSize, setGroupSize] = useState(2);
  const high = STOCKS.slice(0, groupSize);
  const low = STOCKS.slice(-groupSize);
  const highMean = mean(high.map((stock) => stock.forward));
  const lowMean = mean(low.map((stock) => stock.forward));
  const spread = highMean - lowMean;
  const groupOf = (index: number) => index < groupSize ? 'high' : index >= STOCKS.length - groupSize ? 'low' : 'middle';
  const groupLabel = (group: string) => group === 'high'
    ? zh ? '高信号组' : 'High signal'
    : group === 'low'
      ? zh ? '低信号组' : 'Low signal'
      : zh ? '未分组' : 'Not grouped';

  return (
    <section className="rounded-lg border border-navy/10 bg-surface p-4" aria-label={zh ? '因子分组互动实验' : 'Interactive factor grouping lab'}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-navy">{zh ? '动手改变分组规则' : 'Change the grouping rule'}</h3>
          <p className="mt-1 text-xs leading-5 text-navy/60">
            {zh ? '信号用于分组；未来收益只用于事后评价。' : 'The signal forms groups; forward returns evaluate them afterwards.'}
          </p>
        </div>
        <label htmlFor="factor-group-size" className="text-sm font-medium text-navy">
          {zh ? '每组股票数' : 'Stocks per group'}：<output>{groupSize}</output>
        </label>
      </div>
      <input
        id="factor-group-size"
        type="range"
        min="1"
        max="3"
        step="1"
        value={groupSize}
        onChange={(event) => setGroupSize(Number(event.target.value))}
        className="mt-3 min-h-11 w-full cursor-pointer accent-[#e8873a]"
      />
      <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm" aria-live="polite">
        <div className="rounded-md bg-accent-soft px-2 py-2 text-navy">
          <span className="block text-navy/60">{zh ? '高组均值' : 'High mean'}</span>
          <strong className="font-mono">{decimal(highMean)}</strong>
        </div>
        <div className="rounded-md bg-navy/10 px-2 py-2 text-navy">
          <span className="block text-navy/60">{zh ? '低组均值' : 'Low mean'}</span>
          <strong className="font-mono">{decimal(lowMean)}</strong>
        </div>
        <div className="rounded-md bg-navy px-2 py-2 text-white">
          <span className="block text-white/70">{zh ? '多空差' : 'Long–short'}</span>
          <strong className="font-mono">{decimal(spread)}</strong>
        </div>
      </div>
      <figure className="mt-3 rounded-lg bg-white p-2">
        <svg
          viewBox="0 0 680 350"
          className="h-auto w-full"
          role="img"
          aria-label={zh
            ? `六只股票的动量与未来收益散点图。每组 ${groupSize} 只，多空收益 ${decimal(spread)}。`
            : `Momentum and forward returns for six stocks. ${groupSize} per group; long–short return ${decimal(spread)}.`}
        >
          <line x1="72" y1="290" x2="630" y2="290" stroke="currentColor" className="text-navy/35" />
          <line x1="72" y1="25" x2="72" y2="290" stroke="currentColor" className="text-navy/35" />
          <line x1="351" y1="25" x2="351" y2="290" stroke="currentColor" strokeDasharray="5 5" className="text-navy/15" />
          <line x1="72" y1="210" x2="630" y2="210" stroke="currentColor" strokeDasharray="5 5" className="text-navy/15" />
          {[-0.2, -0.1, 0, 0.1, 0.2].map((tick) => {
            const x = 72 + ((tick + 0.2) / 0.4) * 558;
            return <text key={tick} x={x} y="312" textAnchor="middle" className="fill-navy/60 font-mono text-[12px]">{tick.toFixed(1)}</text>;
          })}
          {[-0.05, 0, 0.05, 0.1].map((tick) => {
            const y = 290 - ((tick + 0.05) / 0.15) * 265;
            return <text key={tick} x="62" y={y + 4} textAnchor="end" className="fill-navy/60 font-mono text-[12px]">{tick.toFixed(2)}</text>;
          })}
          <text x="351" y="338" textAnchor="middle" className="fill-navy/70 text-[13px]">{zh ? '过去收益（动量信号）' : 'Past return (momentum signal)'}</text>
          <text x="18" y="158" textAnchor="middle" transform="rotate(-90 18 158)" className="fill-navy/70 text-[13px]">{zh ? '未来收益' : 'Forward return'}</text>
          {STOCKS.map((stock, index) => {
            const group = groupOf(index);
            const x = 72 + ((stock.momentum + 0.2) / 0.4) * 558;
            const y = 290 - ((stock.forward + 0.05) / 0.15) * 265;
            return (
              <g key={stock.name}>
                <title>{`${stock.name}: ${zh ? '动量' : 'momentum'} ${decimal(stock.momentum)}, ${zh ? '未来收益' : 'forward'} ${decimal(stock.forward)}, ${groupLabel(group)}`}</title>
                <circle cx={x} cy={y} r="10" className={group === 'high' ? 'fill-accent' : group === 'low' ? 'fill-navy' : 'fill-navy/25'} stroke="white" strokeWidth="3" />
                <text x={x} y={y - 16} textAnchor="middle" className="fill-navy text-[13px] font-bold">{stock.name}</text>
              </g>
            );
          })}
        </svg>
        <figcaption className="flex flex-wrap justify-center gap-4 pb-2 text-xs text-navy/65">
          <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-accent" />{zh ? '高信号组' : 'High signal'}</span>
          <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-navy" />{zh ? '低信号组' : 'Low signal'}</span>
          <span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-navy/25" />{zh ? '未分组' : 'Not grouped'}</span>
        </figcaption>
      </figure>
      <div className="mt-3 overflow-x-auto rounded-lg border border-navy/10 bg-white">
        <table className="w-full min-w-[330px] text-left text-xs sm:text-sm">
          <thead className="bg-navy/5 text-navy/60">
            <tr>
              <th className="px-3 py-2 font-medium">{zh ? '股票' : 'Stock'}</th>
              <th className="px-3 py-2 font-medium">{zh ? '动量' : 'Momentum'}</th>
              <th className="px-3 py-2 font-medium">{zh ? '未来收益' : 'Forward'}</th>
              <th className="px-3 py-2 font-medium">{zh ? '当前分组' : 'Group'}</th>
            </tr>
          </thead>
          <tbody>
            {STOCKS.map((stock, index) => (
              <tr key={stock.name} className="border-t border-navy/10">
                <td className="px-3 py-2 font-bold text-navy">{stock.name}</td>
                <td className="px-3 py-2 font-mono text-navy/75">{decimal(stock.momentum)}</td>
                <td className="px-3 py-2 font-mono text-navy/75">{decimal(stock.forward)}</td>
                <td className="px-3 py-2 text-navy/75">{groupLabel(groupOf(index))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PipelineVisual({locale}: {locale: string}) {
  const steps = locale === 'zh'
    ? [['假设', '可证伪的预测'], ['数据', '当时已知的信息'], ['信号', '透明的计算规则'], ['检验', '收益、风险与成本'], ['决策', '验证、复现与局限']]
    : [['Hypothesis', 'Falsifiable prediction'], ['Data', 'Point-in-time inputs'], ['Signal', 'Transparent calculation'], ['Test', 'Return, risk and costs'], ['Decision', 'Validate and document']];
  return (
    <ol className="grid gap-2 sm:grid-cols-5" aria-label={locale === 'zh' ? '量化研究流程' : 'Quantitative research pipeline'}>
      {steps.map(([title, detail], index) => (
        <li key={title} className="relative rounded-lg border border-navy/10 bg-surface p-3 sm:text-center">
          <span className="text-xs font-semibold text-accent">{index + 1}</span>
          <strong className="ml-2 text-sm text-navy sm:ml-0 sm:block">{title}</strong>
          <span className="mt-1 block text-xs leading-5 text-navy/60">{detail}</span>
          {index < steps.length - 1 && <span aria-hidden="true" className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 text-navy/35 sm:block">→</span>}
        </li>
      ))}
    </ol>
  );
}

type MomentumCodeStepProps = {
  sectionId: string;
  step: ResearchCodeStep;
  code: string;
  locale: string;
  onCodeChange: (value: string) => void;
  onPassChange: (passed: boolean) => void;
};

function MomentumCodeStep({sectionId, step, code, locale, onCodeChange, onPassChange}: MomentumCodeStepProps) {
  const zh = locale === 'zh';
  const {state, run} = usePyodide();
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);
  const [runChecked, setRunChecked] = useState(false);
  const [passed, setPassed] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const updateCode = (value: string) => {
    onCodeChange(value);
    onPassChange(false);
    setPassed(false);
    setRunChecked(false);
    setOutput('');
    setError('');
  };

  const runAndCheck = async () => {
    if (state !== 'ready' || running) return;
    setRunning(true);
    setRunChecked(false);
    setPassed(false);
    onPassChange(false);
    setOutput('');
    setError('');
    try {
      const result = await run(code);
      const ok = !result.error && outputsMatch(step.expected, result.stdout);
      setOutput(result.stdout);
      setError(result.error ?? '');
      setPassed(ok);
      onPassChange(ok);
      setRunChecked(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
      setRunChecked(true);
    } finally {
      setRunning(false);
    }
  };

  const reset = () => {
    updateCode(step.starter);
    setShowHint(false);
  };

  return (
    <section className="space-y-4 rounded-lg border border-navy/10 bg-surface p-4" aria-label={zh ? 'Python 实作' : 'Python practice'}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Python · {zh ? '浏览器实作' : 'In-browser practice'}</p>
        <h3 className="mt-1 font-semibold text-navy"><MathText text={text(step.task, locale)} /></h3>
        <p className="mt-1 text-xs leading-5 text-navy/55">
          {zh ? '首次加载运行环境约 20 MB；代码只在此浏览器标签页中执行。' : 'The first runtime download is about 20 MB; code executes only in this browser tab.'}
        </p>
      </div>
      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <div className="min-w-0 overflow-hidden rounded-lg border border-navy/10">
          <div className="flex items-center justify-between gap-2 bg-navy px-4 py-2 text-xs text-white/75">
            <span className="font-mono">research_{sectionId}.py</span>
            <span>{state === 'ready' ? 'Python 3' : state === 'error' ? zh ? '加载失败' : 'Load failed' : '…'}</span>
          </div>
          <CodeEditor value={code} onChange={updateCode} />
        </div>
        <div className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-navy/10 bg-white">
          <div className="bg-navy/5 px-4 py-2 text-xs font-medium text-navy/60">{zh ? '运行输出' : 'Output'}</div>
          <pre className="min-h-40 flex-1 overflow-auto whitespace-pre-wrap p-4 font-mono text-sm text-navy/80">
            {state === 'loading' ? zh ? '正在加载 Python…' : 'Loading Python…' : output || (error ? '' : '—')}
          </pre>
          {error && <pre className="max-h-48 overflow-auto whitespace-pre-wrap border-t border-red-100 bg-red-50 p-3 font-mono text-xs text-red-700">{error}</pre>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={runAndCheck}
          disabled={state !== 'ready' || running}
          className="min-h-11 cursor-pointer rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {running ? zh ? '运行中…' : 'Running…' : `▶ ${zh ? '运行并检查' : 'Run & check'}`}
        </button>
        <button type="button" onClick={reset} className="min-h-11 cursor-pointer rounded-full border border-navy/15 px-4 py-2 text-sm text-navy transition hover:border-accent hover:text-accent">
          {zh ? '重置代码' : 'Reset code'}
        </button>
        <button type="button" onClick={() => setShowHint((value) => !value)} aria-expanded={showHint} className="min-h-11 cursor-pointer rounded-full px-4 py-2 text-sm text-navy/60 underline underline-offset-4 hover:text-navy">
          {zh ? '提示' : 'Hint'}
        </button>
        {runChecked && (
          <span role="status" className={`rounded-full px-3 py-1.5 text-xs font-medium ${passed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'}`}>
            {passed ? zh ? '✓ 代码通过' : '✓ Code passed' : zh ? '输出还不匹配，请对照任务检查' : 'Output does not match yet; revisit the task'}
          </span>
        )}
      </div>
      {state === 'error' && <p role="alert" className="text-sm text-red-700">{zh ? 'Python 运行环境加载失败。请检查网络后刷新页面重试。' : 'The Python runtime could not load. Check your connection and refresh to retry.'}</p>}
      {showHint && <p className="rounded-md bg-amber-50 p-3 text-sm leading-6 text-amber-900"><MathText text={text(step.hint, locale)} /></p>}
      <details className="rounded-md border border-navy/10 bg-white px-4 py-3 text-sm">
        <summary className="min-h-6 cursor-pointer font-medium text-navy/70">{zh ? '参考解答（先自己尝试）' : 'Reference solution (try first)'}</summary>
        <pre className="mt-3 overflow-x-auto rounded bg-[#1e2530] p-4 font-mono text-xs leading-5 text-white/90">{step.solution}</pre>
      </details>
    </section>
  );
}

function starterCodes(course: Course) {
  return Object.fromEntries(course.sections.filter((section) => section.code).map((section) => [section.id, section.code!.starter]));
}

export default function ResearchElectiveCourse({course}: {course: Course}) {
  const locale = useLocale();
  const zh = locale === 'zh';
  const [active, setActive] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [codes, setCodes] = useState<Record<string, string>>(() => starterCodes(course));
  const [codePassed, setCodePassed] = useState<Record<string, boolean>>({});
  const [resetVersion, setResetVersion] = useState(0);
  const section = course.sections[active];
  const question = section.question;
  const sectionComplete = (item: ResearchElectiveSection) =>
    answerIsCorrect(item.question, answers[item.question.id]) && (!item.code || codePassed[item.id] === true);
  const completeCount = course.sections.filter(sectionComplete).length;
  const correct = answerIsCorrect(question, answers[question.id]);
  const answered = (answers[question.id] ?? '').trim() !== '';
  const canCheck = answered && (!section.code || codePassed[section.id] === true);
  const isChecked = checked[section.id] === true;
  const quizId = `research-${course.n}`;
  const {saveState, recordAttempt, questionStates} = useQuizAttempt(quizId);
  const questionIndex = researchQuizIndex(quizId, question.id);
  const questionState = questionStates.find(
    (item) => item.quizId === quizId && item.questionIndex === questionIndex,
  );
  const sectionNeedsSupport = Boolean(
    questionState && !questionState.mastered && questionState.failureCount >= 3,
  );

  useEffect(() => {
    const openLinkedSection = () => {
      const id = window.location.hash.slice(1);
      const index = course.sections.findIndex((item) => item.id === id);
      if (index >= 0) setActive(index);
    };
    openLinkedSection();
    window.addEventListener('hashchange', openLinkedSection);
    return () => window.removeEventListener('hashchange', openLinkedSection);
  }, [course.sections]);

  const checkSection = () => {
    setChecked((previous) => ({...previous, [section.id]: true}));
    if (questionIndex >= 0) {
      void recordAttempt({[questionIndex]: answers[question.id] ?? ''});
    }
  };

  const updateAnswer = (value: string) => {
    setAnswers((previous) => ({...previous, [question.id]: value}));
    setChecked((previous) => ({...previous, [section.id]: false}));
  };
  const updateCodePassed = (passed: boolean) => {
    setCodePassed((previous) => ({...previous, [section.id]: passed}));
    setChecked((previous) => ({...previous, [section.id]: false}));
  };
  const reset = () => {
    setAnswers({});
    setChecked({});
    setCodePassed({});
    setCodes(starterCodes(course));
    setResetVersion((version) => version + 1);
    setActive(0);
  };

  return (
    <div className="mt-6 space-y-5">
      <div className="rounded-xl border border-navy/10 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">{zh ? '学习与自测进度' : 'Learning & self-check progress'}</p>
            <p className="mt-1 text-sm text-navy/65" aria-live="polite">
              {zh ? '完成' : 'Complete'} {completeCount} / {course.sections.length} · {text(course.outcome, locale)}
            </p>
          </div>
          <button type="button" onClick={reset} className="min-h-11 cursor-pointer rounded-full border border-navy/15 px-4 py-2 text-xs font-medium text-navy/65 transition hover:border-accent hover:text-accent">
            {zh ? '重置本课' : 'Reset course'}
          </button>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-navy/10" aria-hidden="true">
          <div className="h-full rounded-full bg-accent transition-all" style={{width: `${(completeCount / course.sections.length) * 100}%`}} />
        </div>
        <nav className="mt-4 flex gap-2 overflow-x-auto pb-2" aria-label={zh ? '课程小节' : 'Course sections'}>
          {course.sections.map((item, index) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setActive(index)}
              aria-current={index === active ? 'step' : undefined}
              className={`min-h-11 shrink-0 cursor-pointer rounded-full px-4 py-2 text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${index === active ? 'bg-accent text-white' : sectionComplete(item) ? 'bg-green-100 text-green-800' : 'bg-navy/5 text-navy/65 hover:bg-navy/10'}`}
            >
              {sectionComplete(item) ? '✓ ' : ''}{index + 1}. {text(item.title, locale)}
            </button>
          ))}
        </nav>
      </div>

      <article id={section.id} className="scroll-mt-24 overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm">
        <header className="border-b border-navy/10 bg-navy px-5 py-5 text-white sm:px-7">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/65">{zh ? `第 ${course.n} 层 · ${course.level}` : `Layer ${course.n} · ${course.level}`}</p>
          <h2 className="mt-1 text-xl font-bold">{text(section.title, locale)}</h2>
        </header>
        <div className="space-y-5 p-5 sm:p-7">
          <div className="max-w-[75ch] space-y-3">
            {section.body.map((paragraph, index) => (
              <p key={index} className="text-sm leading-7 text-navy/75 sm:text-base"><MathText text={text(paragraph, locale)} /></p>
            ))}
          </div>
          {section.formula && (
            <div className="max-w-full overflow-x-auto rounded-lg border border-accent/20 bg-accent-soft/60 px-4 py-3 text-sm text-navy">
              <TeX tex={section.formula} display />
            </div>
          )}
          {section.bullets && (
            <div className="rounded-lg border border-navy/10 bg-surface p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-navy/50">{zh ? '操作清单' : 'Action checklist'}</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-navy/75">
                {section.bullets.map((bullet, index) => <li key={index}><MathText text={text(bullet, locale)} /></li>)}
              </ul>
            </div>
          )}
          {section.visual === 'scatter' && <FactorScatter locale={locale} />}
          {section.visual === 'pipeline' && <PipelineVisual locale={locale} />}
          {section.code && (
            <MomentumCodeStep
              key={`${section.id}-${resetVersion}`}
              sectionId={section.id}
              step={section.code}
              code={codes[section.id] ?? section.code.starter}
              locale={locale}
              onCodeChange={(value) => {
                setCodes((previous) => ({...previous, [section.id]: value}));
                setChecked((previous) => ({...previous, [section.id]: false}));
              }}
              onPassChange={updateCodePassed}
            />
          )}

          <div className="space-y-4 border-t border-navy/10 pt-5">
            <h3 className="font-semibold text-navy">{zh ? '本节自测' : 'Section self-check'}</h3>
            <fieldset className="rounded-lg border border-navy/10 p-4">
              <legend className="px-1 text-sm font-medium text-navy"><MathText text={text(question.prompt, locale)} /></legend>
              {question.kind === 'number' ? (
                <label className="mt-2 block text-xs text-navy/55">
                  {zh ? '输入小数答案' : 'Enter a decimal answer'}
                  <input
                    type="number"
                    step="any"
                    inputMode="decimal"
                    value={answers[question.id] ?? ''}
                    onChange={(event) => updateAnswer(event.target.value)}
                    className="mt-1.5 block min-h-11 w-full max-w-xs rounded-md border border-navy/20 bg-white px-3 py-2 font-mono text-sm text-navy outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
                  />
                </label>
              ) : (
                <div className="mt-2 space-y-2">
                  {question.options?.map((option, index) => (
                    <label key={index} className="flex min-h-11 cursor-pointer items-start gap-2.5 rounded-md p-2 text-sm leading-6 text-navy/75 hover:bg-surface">
                      <input
                        type="radio"
                        name={question.id}
                        value={index}
                        checked={answers[question.id] === String(index)}
                        onChange={(event) => updateAnswer(event.target.value)}
                        className="mt-1.5 accent-[#e8873a]"
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
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={!canCheck}
                onClick={checkSection}
                className="min-h-11 cursor-pointer rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                {zh ? '检查本节答案' : 'Check this section'}
              </button>
              {section.code && !codePassed[section.id] && <span className="text-xs text-navy/55">{zh ? '先运行并通过本节的 Python 实作。' : 'Run and pass this section’s Python practice first.'}</span>}
              {isChecked && sectionComplete(section) && <span role="status" className="text-sm font-medium text-green-700">{zh ? '本节全部通过' : 'Section complete'}</span>}
              {isChecked && <QuizSaveNotice state={saveState} />}
            </div>
            {isChecked && sectionNeedsSupport && <SupportCard topic={`${text(course.title, locale)} — ${text(section.title, locale)}`} />}
          </div>
        </div>
        <footer className="flex items-center justify-between gap-3 border-t border-navy/10 px-5 py-4 sm:px-7">
          <button type="button" disabled={active === 0} onClick={() => setActive((index) => Math.max(0, index - 1))} className="min-h-11 cursor-pointer rounded-full border border-navy/15 px-4 py-2 text-sm text-navy transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-30">
            ← {zh ? '上一节' : 'Previous'}
          </button>
          <span className="text-xs text-navy/50">{active + 1} / {course.sections.length}</span>
          <button type="button" disabled={active === course.sections.length - 1} onClick={() => setActive((index) => Math.min(course.sections.length - 1, index + 1))} className="min-h-11 cursor-pointer rounded-full bg-navy px-4 py-2 text-sm font-medium text-white transition hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-30">
            {zh ? '下一节' : 'Next'} →
          </button>
        </footer>
      </article>

      {completeCount === course.sections.length && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-green-900" role="status">
          <h2 className="font-bold">{zh ? '本层课程完成！' : 'Course layer complete!'}</h2>
          <p className="mt-1 text-sm leading-6">{zh ? '你已完成全部讲解、实作与自测。继续保留研究记录，并用新样本检验结论。' : 'You completed every lesson, practical step and self-check. Keep your research record and test conclusions on new samples.'}</p>
        </div>
      )}

      <aside className="rounded-xl border border-navy/10 bg-white p-5 text-sm shadow-sm">
        <h2 className="font-semibold text-navy">{zh ? '教学依据与延伸阅读' : 'Teaching references & further reading'}</h2>
        <ul className="mt-3 space-y-2">
          {course.sources.map((source) => (
            <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="inline-flex min-h-8 items-center text-accent hover:underline">{source.label} ↗</a></li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-5 text-navy/50">{zh ? '课程中的微型数据用于方法教学，不构成投资建议或可交易结论。外部平台规则与资料可能更新，请以官方最新说明为准。' : 'Tiny datasets are for methodological education, not investment advice or tradable conclusions. External platform rules and materials may change; consult the latest official guidance.'}</p>
      </aside>
    </div>
  );
}
