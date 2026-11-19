'use client';

import {useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {createClient} from '@/lib/supabase/browser';
import type {Lesson} from '@/content/lessons';
import {usePyodide} from './pyodide/usePyodide';

/* Lenient answer matching: "correct answer passes".
   1) Extra printed lines around the expected block are fine (containment).
   2) Numbers compare by VALUE (2500 == 2500.0) with 1e-3 relative tolerance
      (float noise / un-rounded full precision pass; genuinely different
      numbers still fail).
   3) Words and booleans stay strict (True ≠ False, Bull ≠ Bear). */

const NUM_RE = /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/;
const tokEq = (a: string, b: string): boolean => {
  if (a === b) return true;
  return NUM_RE.test(a) && NUM_RE.test(b)
    ? Math.abs(Number(a) - Number(b)) <=
      1e-3 * Math.max(1, Math.abs(Number(a)), Math.abs(Number(b)))
    : false;
};
const lineEq = (a: string, b: string): boolean => {
  const at = a.trim().split(/\s+/);
  const bt = b.trim().split(/\s+/);
  return at.length === bt.length && at.every((t, i) => tokEq(t, bt[i]));
};
const toLines = (s: string) =>
  s
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
const outputsMatch = (expected: string, actual: string): boolean => {
  const e = toLines(expected);
  const a = toLines(actual);
  if (e.length === 0 || a.length < e.length) return false;
  for (let i = 0; i + e.length <= a.length; i++) {
    if (e.every((el, j) => lineEq(el, a[i + j]))) return true;
  }
  return false;
};

export default function StepCourse({lesson}: {lesson: Lesson}) {
  const t = useTranslations('lesson');
  const {state, run} = usePyodide();
  const [stepIndex, setStepIndex] = useState(0);
  const [codes, setCodes] = useState<string[]>(lesson.steps.map((s) => s.starter));
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [passed, setPassed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [running, setRunning] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'anon' | 'error'>(
    'idle'
  );

  const step = lesson.steps[stepIndex];
  const isLast = stepIndex === lesson.steps.length - 1;
  const [done, setDone] = useState(false);

  const code = codes[stepIndex];
  const setCode = (v: string) => {
    const next = [...codes];
    next[stepIndex] = v;
    setCodes(next);
    setChecked(false);
    setPassed(false);
  };

  const onRun = async () => {
    if (state !== 'ready' || running) return;
    setRunning(true);
    setError('');
    setOutput('');
    const result = await run(code);
    setOutput(result.stdout);
    setError(result.error ?? '');
    setChecked(false);
    setPassed(false);
    setRunning(false);
  };

  const onCheck = () => {
    const ok = !error && outputsMatch(step.expected, output);
    setChecked(true);
    setPassed(ok);
  };

  const onNext = async () => {
    if (isLast) {
      setDone(true);
      // Persist completion for signed-in users.
      try {
        const supabase = createClient();
        const {
          data: {session}
        } = await supabase.auth.getSession();
        if (!session) {
          setSaveState('anon');
          return;
        }
        const {error} = await supabase.from('lesson_progress').upsert({
          user_id: session.user.id,
          lesson_id: lesson.n
        });
        setSaveState(error ? 'error' : 'saved');
      } catch {
        setSaveState('error');
      }
    } else {
      setStepIndex(stepIndex + 1);
      setOutput('');
      setError('');
      setChecked(false);
      setPassed(false);
      setShowHint(false);
    }
  };

  const progress = useMemo(
    () => `${stepIndex + 1} / ${lesson.steps.length}`,
    [stepIndex, lesson.steps.length]
  );

  if (done) {
    return (
      <div className="rounded-xl border border-navy/10 bg-white p-8 text-center shadow-sm">
        <div className="text-3xl">🎉</div>
        <h2 className="mt-3 text-lg font-bold text-navy">{t('completed')}</h2>
        <p className="mt-1 text-sm text-navy/60">{lesson.title}</p>
        {saveState === 'saved' && (
          <p className="mt-3 text-xs text-green-700">✓ {t('progressSaved')}</p>
        )}
        {saveState === 'anon' && (
          <p className="mt-3 text-xs text-navy/60">
            {t('loginToSave')}{' '}
            <Link href="/auth" className="font-medium text-accent hover:underline">
              {t('loginLink')}
            </Link>
          </p>
        )}
        {saveState === 'error' && (
          <p className="mt-3 text-xs text-navy/50">{t('saveError')}</p>
        )}
        <button
          onClick={() => {
            setDone(false);
            setStepIndex(0);
            setCodes(lesson.steps.map((s) => s.starter));
            setOutput('');
            setError('');
            setChecked(false);
            setPassed(false);
          }}
          className="mt-5 rounded-full bg-navy px-5 py-2 text-sm font-medium text-white hover:bg-navy/90"
        >
          {t('restart')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Step tabs */}
      <div className="flex items-center gap-2">
        {lesson.steps.map((s, i) => (
          <button
            key={i}
            disabled={i > stepIndex}
            onClick={() => {
              if (i < stepIndex) {
                setStepIndex(i);
                setOutput('');
                setError('');
                setChecked(false);
                setPassed(false);
                setShowHint(false);
              }
            }}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              i === stepIndex
                ? 'bg-accent text-white'
                : i < stepIndex
                  ? 'bg-accent-soft text-accent'
                  : 'bg-navy/5 text-navy/40'
            }`}
          >
            {i < stepIndex ? '✓ ' : ''}
            {i + 1}
          </button>
        ))}
        <span className="ml-auto text-xs text-navy/50">{progress}</span>
      </div>

      {/* Explanation */}
      <div className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-navy">
          {stepIndex + 1}. {step.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-navy/70">{step.explain}</p>
      </div>

      {/* Code editor + output */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-navy/10 shadow-sm">
          <div className="flex items-center justify-between bg-navy px-4 py-2 text-xs text-white/80">
            <span>lesson_{lesson.n}_step_{stepIndex + 1}.py</span>
            <span>{state === 'ready' ? 'Python 3 (in-browser)' : '…'}</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="h-56 w-full resize-none bg-[#1e2530] p-4 font-mono text-sm text-white/90 outline-none"
          />
        </div>
        <div className="flex flex-col overflow-hidden rounded-xl border border-navy/10 shadow-sm">
          <div className="bg-navy/5 px-4 py-2 text-xs font-medium text-navy/60">
            {t('output')}
          </div>
          <pre className="h-40 flex-1 overflow-auto bg-white p-4 font-mono text-sm text-navy/80">
            {state === 'loading' ? t('loadingRuntime') : output || (error ? '' : '—')}
          </pre>
          {error && (
            <pre className="max-h-28 overflow-auto border-t border-red-100 bg-red-50 p-3 font-mono text-xs whitespace-pre-wrap text-red-700">
              {error}
            </pre>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onRun}
          disabled={state !== 'ready' || running}
          className="rounded-full bg-navy px-5 py-2 text-sm font-medium text-white transition hover:bg-navy/90 disabled:opacity-40"
        >
          {running ? '…' : `▶ ${t('run')}`}
        </button>
        <button
          onClick={onCheck}
          disabled={state !== 'ready' || running || (!output && !error)}
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent/90 disabled:opacity-40"
        >
          {t('check')}
        </button>
        {checked && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {passed ? `✓ ${t('passed')}` : `✗ ${t('failed')}`}
          </span>
        )}
        {passed && !isLast && (
          <button
            onClick={onNext}
            className="ml-auto rounded-full bg-green-700 px-5 py-2 text-sm font-medium text-white hover:bg-green-800"
          >
            {t('next')} →
          </button>
        )}
        {passed && isLast && (
          <button
            onClick={onNext}
            className="ml-auto rounded-full bg-green-700 px-5 py-2 text-sm font-medium text-white hover:bg-green-800"
          >
            {t('finish')} 🎉
          </button>
        )}
      </div>

      {/* Hint + status line */}
      <div className="flex items-center gap-3 text-xs text-navy/50">
        {!passed && !checked && step.hint && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="underline underline-offset-2 hover:text-navy"
          >
            {t('hint')}
          </button>
        )}
        {showHint && step.hint && <span className="text-navy/70">💡 {step.hint}</span>}
        {state === 'error' && <span className="text-red-600">{t('runtimeError')}</span>}
      </div>
    </div>
  );
}
