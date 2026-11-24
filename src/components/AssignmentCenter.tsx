'use client';

import dynamic from 'next/dynamic';
import {useEffect, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {createClient} from '@/lib/supabase/browser';
import {
  ASSIGNMENTS,
  getAssignment,
  type Assignment,
  type AssignmentTest
} from '@/content/assignments';
import {QUIZ_REGISTRY} from '@/content/quizzes';
import {usePyodide} from './pyodide/usePyodide';

const CodeEditor = dynamic(() => import('./CodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-56 w-full bg-[#1e2530] p-4 font-mono text-sm text-white/50">
      Loading editor…
    </div>
  )
});

type View = 'practice' | 'history' | 'mistakes';
type SaveState = 'idle' | 'saved' | 'anon' | 'error';

type TestResult = {
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
};

type Submission = {
  id: string;
  assignment_id: string;
  variant: string;
  code: string;
  passed: boolean;
  test_results: TestResult[];
  created_at: string;
};

type QuizAnswer = {
  question: number;
  selected: number;
};

type QuizAttempt = {
  id: string;
  quiz_id: string;
  score: number;
  total: number;
  answers: QuizAnswer[];
  created_at: string;
};

function stableHash(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function isolatedTestProgram(studentCode: string, test: AssignmentTest): string {
  return `import numpy as np
import pandas as pd
__qfs_namespace = {"np": np, "pd": pd}
exec(${JSON.stringify(studentCode)}, __qfs_namespace, __qfs_namespace)
exec(${JSON.stringify(test.code)}, __qfs_namespace, __qfs_namespace)
`;
}

function conciseError(error: string): string {
  const lines = error
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.at(-1) ?? 'Python execution error';
}

function formatDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-HK' : 'en-HK', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

export default function AssignmentCenter() {
  const locale = useLocale();
  const t = useTranslations('assignmentCenter');
  const {state, run} = usePyodide();
  const [view, setView] = useState<View>('practice');
  const [selectedId, setSelectedId] = useState(ASSIGNMENTS[0].id);
  const [codes, setCodes] = useState<Record<string, string>>(() =>
    Object.fromEntries(ASSIGNMENTS.map((assignment) => [assignment.id, assignment.starter]))
  );
  const [sessionSeed, setSessionSeed] = useState('anonymous');
  const [userId, setUserId] = useState<string | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [judged, setJudged] = useState(false);
  const [running, setRunning] = useState(false);
  const [failures, setFailures] = useState<Record<string, number>>({});
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [recordsError, setRecordsError] = useState(false);

  const selected = getAssignment(selectedId) ?? ASSIGNMENTS[0];
  const variantIndex =
    stableHash(`${userId ?? sessionSeed}:${selected.id}`) % selected.variants.length;
  const variant = selected.variants[variantIndex];
  const allPassed = judged && results.length > 0 && results.every((result) => result.passed);
  const passedCount = results.filter((result) => result.passed).length;

  useEffect(() => {
    let seed = `anonymous-${Date.now()}`;
    try {
      const key = 'qfs_assignment_session';
      const existing = window.sessionStorage.getItem(key);
      if (existing) {
        seed = existing;
      } else {
        seed = window.crypto.randomUUID();
        window.sessionStorage.setItem(key, seed);
      }
    } catch {
      // Storage can be unavailable in private browsing; this tab still works.
    }
    const timer = window.setTimeout(() => setSessionSeed(seed), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const loadRecords = async (uid: string | null) => {
      setUserId(uid);
      setRecordsError(false);
      if (!uid) {
        setSubmissions([]);
        setQuizAttempts([]);
        return;
      }
      const [submissionResponse, quizResponse] = await Promise.all([
        supabase
          .from('assignment_submissions')
          .select('id, assignment_id, variant, code, passed, test_results, created_at')
          .eq('user_id', uid)
          .order('created_at', {ascending: false})
          .limit(100),
        supabase
          .from('quiz_attempts')
          .select('id, quiz_id, score, total, answers, created_at')
          .eq('user_id', uid)
          .order('created_at', {ascending: false})
          .limit(100)
      ]);
      if (cancelled) return;
      if (submissionResponse.error || quizResponse.error) {
        setRecordsError(true);
        return;
      }
      setSubmissions((submissionResponse.data ?? []) as Submission[]);
      setQuizAttempts((quizResponse.data ?? []) as QuizAttempt[]);
    };

    void supabase.auth.getSession().then(({data}) => {
      if (!cancelled) void loadRecords(data.session?.user.id ?? null);
    });
    const {
      data: {subscription}
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user.id ?? null;
      setTimeout(() => {
        if (!cancelled) void loadRecords(uid);
      }, 0);
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const saveSubmission = async (
    assignment: Assignment,
    variantId: string,
    code: string,
    testResults: TestResult[],
    passed: boolean
  ) => {
    if (!userId) {
      setSaveState('anon');
      return;
    }
    try {
      const supabase = createClient();
      const row = {
        user_id: userId,
        assignment_id: assignment.id,
        variant: variantId,
        code,
        passed,
        test_results: testResults
      };
      const {data, error} = await supabase
        .from('assignment_submissions')
        .insert(row)
        .select('id, assignment_id, variant, code, passed, test_results, created_at')
        .single();
      if (error) throw error;
      setSubmissions((previous) => [data as Submission, ...previous]);
      setSaveState('saved');
    } catch {
      setSaveState('error');
    }
  };

  const judge = async () => {
    if (state !== 'ready' || running) return;
    setRunning(true);
    setJudged(false);
    setResults([]);
    setSaveState('idle');
    const code = codes[selected.id];
    const nextResults: TestResult[] = [];

    for (const test of variant.tests) {
      const response = await run(isolatedTestProgram(code, test));
      const actual = response.error
        ? conciseError(response.error)
        : response.stdout.trim().split('\n').at(-1)?.trim() || '(no output)';
      nextResults.push({
        name: test.name,
        passed: !response.error && actual === test.expected,
        expected: test.expected,
        actual
      });
      setResults([...nextResults]);
    }

    const passed = nextResults.every((result) => result.passed);
    setJudged(true);
    setRunning(false);
    if (!passed) {
      setFailures((previous) => ({
        ...previous,
        [selected.id]: (previous[selected.id] ?? 0) + 1
      }));
    }
    await saveSubmission(selected, variant.id, code, nextResults, passed);
  };

  const selectAssignment = (assignment: Assignment) => {
    if (running) return;
    setSelectedId(assignment.id);
    setResults([]);
    setJudged(false);
    setSaveState('idle');
  };

  const editCode = (value: string) => {
    setCodes((previous) => ({...previous, [selected.id]: value}));
    setResults([]);
    setJudged(false);
    setSaveState('idle');
  };

  const mistakeSubmissions = submissions.filter((submission) => !submission.passed);
  const mistakeQuizzes = quizAttempts.filter((attempt) => attempt.score < attempt.total);
  const tabs: {id: View; label: string; count?: number}[] = [
    {id: 'practice', label: t('tabPractice')},
    {id: 'history', label: t('tabHistory'), count: submissions.length + quizAttempts.length},
    {id: 'mistakes', label: t('tabMistakes'), count: mistakeSubmissions.length + mistakeQuizzes.length}
  ];

  const recordsPrompt = (
    <div className="rounded-xl border border-accent/30 bg-accent-soft/40 p-6 text-center">
      <h3 className="font-semibold text-navy">{t('anonymousTitle')}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-navy/65">
        {t('anonymousBody')}
      </p>
      <Link
        href="/auth"
        className="mt-4 inline-block rounded-full bg-navy px-5 py-2 text-sm font-medium text-white hover:bg-navy/90"
      >
        {t('login')}
      </Link>
    </div>
  );

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2 rounded-xl border border-navy/10 bg-white p-2 shadow-sm" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={view === tab.id}
            onClick={() => setView(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              view === tab.id ? 'bg-navy text-white' : 'text-navy/65 hover:bg-navy/5'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && userId && (
              <span className={`ml-2 text-xs ${view === tab.id ? 'text-white/70' : 'text-navy/40'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {view === 'practice' && (
        <div className="mt-5 grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-2">
            {ASSIGNMENTS.map((assignment) => (
              <button
                key={assignment.id}
                onClick={() => selectAssignment(assignment)}
                disabled={running}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selected.id === assignment.id
                    ? 'border-accent bg-accent-soft/40 shadow-sm'
                    : 'border-navy/10 bg-white hover:border-accent/40'
                }`}
              >
                <span className="text-xs font-medium text-accent">L1 · Lesson {assignment.lesson}</span>
                <span className="mt-1 block font-semibold text-navy">{assignment.title}</span>
                <span className="mt-1 block text-xs leading-relaxed text-navy/55">
                  {assignment.summary}
                </span>
              </button>
            ))}
          </div>

          <section className="min-w-0 rounded-xl border border-navy/10 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-navy">{selected.title}</h2>
                <p className="mt-1 text-sm text-navy/60">{variant.description}</p>
              </div>
              <Link href={selected.reviewPath} className="text-sm font-medium text-accent hover:underline">
                {t('reviewLesson')} →
              </Link>
            </div>

            <div className="mt-5 rounded-lg bg-surface p-4">
              <h3 className="text-sm font-semibold text-navy">{t('instructions')}</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-navy/70">
                {selected.instructions.map((instruction) => (
                  <li key={instruction}>{instruction}</li>
                ))}
              </ol>
              <p className="mt-3 font-mono text-xs text-accent">{selected.functionSignature}</p>
            </div>

            <div className="mt-5 overflow-hidden rounded-lg border border-navy/10">
              <CodeEditor value={codes[selected.id]} onChange={editCode} />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => void judge()}
                disabled={state !== 'ready' || running}
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {running ? t('judging') : judged ? t('retry') : t('judge')}
              </button>
              <span className="text-xs text-navy/45">{t('unlimitedRetries')}</span>
            </div>
            {state === 'loading' && <p className="mt-3 text-sm text-navy/55">{t('runtimeLoading')}</p>}
            {state === 'error' && <p className="mt-3 text-sm text-red-600">{t('runtimeError')}</p>}

            {(results.length > 0 || judged) && (
              <div className="mt-5 border-t border-navy/10 pt-5">
                {judged && (
                  <div className={`rounded-lg px-4 py-3 text-sm font-medium ${allPassed ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-900'}`}>
                    {allPassed
                      ? t('allPassed')
                      : t('notPassed', {passed: passedCount, total: variant.tests.length})}
                  </div>
                )}
                <div className="mt-3 space-y-2">
                  {results.map((result, index) => (
                    <div key={`${index}-${result.name}`} className="rounded-lg border border-navy/10 p-3">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium text-navy">{result.name}</span>
                        <span className={result.passed ? 'text-green-700' : 'text-red-600'}>
                          {result.passed ? `✓ ${t('passed')}` : `✕ ${t('failed')}`}
                        </span>
                      </div>
                      {!result.passed && (
                        <div className="mt-2 grid gap-2 font-mono text-xs sm:grid-cols-2">
                          <p className="rounded bg-green-50 px-3 py-2 text-green-900">
                            {t('expected')}: {result.expected}
                          </p>
                          <p className="break-words rounded bg-red-50 px-3 py-2 text-red-800">
                            {t('actual')}: {result.actual}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {saveState !== 'idle' && (
              <p className={`mt-3 text-xs ${saveState === 'error' ? 'text-red-600' : 'text-navy/55'}`}>
                {saveState === 'saved' ? t('saveSaved') : saveState === 'anon' ? t('saveAnon') : t('saveError')}
              </p>
            )}
            {(failures[selected.id] ?? 0) >= 3 && (
              <div className="mt-4 rounded-lg border border-accent/30 bg-accent-soft/40 p-4">
                <h3 className="text-sm font-semibold text-navy">{t('supportTitle')}</h3>
                <p className="mt-1 text-sm leading-relaxed text-navy/65">{t('supportBody')}</p>
              </div>
            )}
          </section>
        </div>
      )}

      {view !== 'practice' && !userId && <div className="mt-5">{recordsPrompt}</div>}

      {view !== 'practice' && userId && recordsError && (
        <p className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">{t('loadError')}</p>
      )}

      {view === 'history' && userId && !recordsError && (
        <div className="mt-5 space-y-5">
          <section className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-navy">{t('codeSubmissions')}</h2>
            {submissions.length === 0 ? (
              <p className="mt-3 text-sm text-navy/50">{t('noHistory')}</p>
            ) : (
              <div className="mt-3 space-y-3">
                {submissions.map((submission) => (
                  <div key={submission.id} className="rounded-lg border border-navy/10 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium text-navy">
                        {getAssignment(submission.assignment_id)?.title ?? submission.assignment_id}
                      </span>
                      <span className={`text-sm font-medium ${submission.passed ? 'text-green-700' : 'text-red-600'}`}>
                        {submission.passed ? t('passed') : t('failed')}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-navy/45">
                      {formatDate(submission.created_at, locale)} · {t('variantLabel')}: {submission.variant}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-navy">{t('quizAttempts')}</h2>
            {quizAttempts.length === 0 ? (
              <p className="mt-3 text-sm text-navy/50">{t('noHistory')}</p>
            ) : (
              <div className="mt-3 space-y-3">
                {quizAttempts.map((attempt) => (
                  <div key={attempt.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-navy/10 p-4">
                    <div>
                      <p className="font-medium text-navy">
                        {QUIZ_REGISTRY[attempt.quiz_id]?.title ?? attempt.quiz_id}
                      </p>
                      <p className="mt-1 text-xs text-navy/45">{formatDate(attempt.created_at, locale)}</p>
                    </div>
                    <span className="font-mono text-sm text-navy">{attempt.score} / {attempt.total}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {view === 'mistakes' && userId && !recordsError && (
        <div className="mt-5 space-y-5">
          {mistakeSubmissions.length === 0 && mistakeQuizzes.length === 0 && (
            <div className="rounded-xl border border-navy/10 bg-white p-8 text-center shadow-sm">
              <h2 className="font-semibold text-navy">{t('noMistakesTitle')}</h2>
              <p className="mt-2 text-sm text-navy/55">{t('noMistakesBody')}</p>
            </div>
          )}

          {mistakeSubmissions.map((submission) => {
            const assignment = getAssignment(submission.assignment_id);
            return (
              <section key={submission.id} className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-semibold text-navy">{assignment?.title ?? submission.assignment_id}</h2>
                  {assignment && <Link href={assignment.reviewPath} className="text-sm text-accent hover:underline">{t('review')} →</Link>}
                </div>
                <p className="mt-1 text-xs text-navy/45">{formatDate(submission.created_at, locale)}</p>
                <div className="mt-3 space-y-2">
                  {submission.test_results.filter((result) => !result.passed).map((result, index) => (
                    <div key={`${index}-${result.name}`} className="rounded-lg bg-red-50 p-3 text-xs">
                      <p className="font-medium text-red-900">{result.name}</p>
                      <p className="mt-1 font-mono text-red-800">{t('expected')}: {result.expected} · {t('actual')}: {result.actual}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          {mistakeQuizzes.map((attempt) => {
            const quiz = QUIZ_REGISTRY[attempt.quiz_id];
            if (!quiz) return null;
            return (
              <section key={attempt.id} className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-semibold text-navy">{quiz.title}</h2>
                  <Link href={quiz.reviewPath} className="text-sm text-accent hover:underline">{t('review')} →</Link>
                </div>
                <p className="mt-1 text-xs text-navy/45">
                  {formatDate(attempt.created_at, locale)} · {t('score')}: {attempt.score}/{attempt.total}
                </p>
                <div className="mt-4 space-y-4">
                  {attempt.answers.filter((answer) => quiz.questions[answer.question]?.answer !== answer.selected).map((answer) => {
                    const question = quiz.questions[answer.question];
                    if (!question) return null;
                    return (
                      <div key={answer.question} className="rounded-lg border border-navy/10 p-4">
                        <p className="text-sm font-medium text-navy">{answer.question + 1}. {question.q}</p>
                        <p className="mt-2 text-sm text-red-700">{t('yourAnswer')}: {question.options[answer.selected] ?? '—'}</p>
                        <p className="mt-1 text-sm text-green-700">{t('correctAnswer')}: {question.options[question.answer]}</p>
                        <p className="mt-2 text-xs leading-relaxed text-navy/55">{t('explanation')}: {question.explain}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
