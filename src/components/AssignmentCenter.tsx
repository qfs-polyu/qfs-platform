'use client';

import dynamic from 'next/dynamic';
import {useEffect, useMemo, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {createClient} from '@/lib/supabase/browser';
import {
  ASSIGNMENTS,
  getAssignment,
  type Assignment,
  type AssignmentTest,
} from '@/content/assignments';
import {
  QUIZ_REGISTRY,
  quizAnswerIsCorrect,
  quizAttemptIsCurrent,
  quizText,
  type QuizQuestion,
} from '@/content/quizzes';
import {
  assignmentSupportNeeded,
  buildAssignmentStates,
  buildQuizQuestionStates,
  type AssignmentSubmissionRecord,
  type QuizAttemptRecord,
} from '@/lib/mistakes';
import {MathText} from './research/MathText';
import SupportCard from './SupportCard';
import {usePyodide} from './pyodide/usePyodide';

const CodeEditor = dynamic(() => import('./CodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-56 w-full bg-[#1e2530] p-4 font-mono text-sm text-white/50">
      Loading editor…
    </div>
  ),
});

type View = 'practice' | 'history' | 'mistakes';
type MistakeFilter = 'open' | 'mastered';
type SaveState = 'idle' | 'saved' | 'anon' | 'error';
type Submission = AssignmentSubmissionRecord;
type QuizAttempt = QuizAttemptRecord;

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
    timeStyle: 'short',
  }).format(new Date(value));
}

function selectedText(question: QuizQuestion, raw: number | string | undefined, locale: string): string {
  if (raw === undefined) return '—';
  if (question.kind === 'number') return String(raw);
  return question.options?.[Number(raw)] ? quizText(question.options[Number(raw)], locale) : '—';
}

export default function AssignmentCenter() {
  const locale = useLocale();
  const t = useTranslations('assignmentCenter');
  const {state, run} = usePyodide();
  const [view, setView] = useState<View>('practice');
  const [mistakeFilter, setMistakeFilter] = useState<MistakeFilter>('open');
  const [selectedId, setSelectedId] = useState(ASSIGNMENTS[0].id);
  const [codes, setCodes] = useState<Record<string, string>>(() =>
    Object.fromEntries(ASSIGNMENTS.map((assignment) => [assignment.id, assignment.starter])),
  );
  const [sessionSeed, setSessionSeed] = useState('anonymous');
  const [userId, setUserId] = useState<string | null>(null);
  const [results, setResults] = useState<{name: string; passed: boolean; expected: string; actual: string}[]>([]);
  const [judged, setJudged] = useState(false);
  const [running, setRunning] = useState(false);
  const [sessionFailures, setSessionFailures] = useState<Record<string, number>>({});
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [recordsError, setRecordsError] = useState(false);

  const selected = getAssignment(selectedId) ?? ASSIGNMENTS[0];
  const variantIndex = stableHash(`${userId ?? sessionSeed}:${selected.id}`) % selected.variants.length;
  const variant = selected.variants[variantIndex];
  const allPassed = judged && results.length > 0 && results.every((result) => result.passed);
  const passedCount = results.filter((result) => result.passed).length;

  const assignmentStates = useMemo(() => buildAssignmentStates(submissions), [submissions]);
  const quizStates = useMemo(
    () => buildQuizQuestionStates(quizAttempts, (quizId, questionIndex, answer) => {
      const question = QUIZ_REGISTRY[quizId]?.questions[questionIndex];
      return question ? quizAnswerIsCorrect(question, answer) : false;
    }),
    [quizAttempts],
  );
  const assignmentMistakes = useMemo(
    () => assignmentStates.filter((item) => item.failureCount > 0),
    [assignmentStates],
  );
  const quizMistakes = useMemo(
    () => quizStates.filter((item) => item.failureCount > 0 && QUIZ_REGISTRY[item.quizId]),
    [quizStates],
  );
  const visibleAssignments = assignmentMistakes.filter(
    (item) => item.mastered === (mistakeFilter === 'mastered'),
  );
  const visibleQuizzes = quizMistakes.filter(
    (item) => item.mastered === (mistakeFilter === 'mastered'),
  );
  const openCount = [...assignmentMistakes, ...quizMistakes].filter((item) => !item.mastered).length;
  const masteredCount = assignmentMistakes.length + quizMistakes.length - openCount;
  const selectedSupport = assignmentSupportNeeded(submissions, selected.id) ||
    (!allPassed && (sessionFailures[selected.id] ?? 0) >= 3);

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
          .order('created_at', {ascending: false}),
        supabase
          .from('quiz_attempts')
          .select('id, quiz_id, score, total, answers, created_at')
          .eq('user_id', uid)
          .order('created_at', {ascending: false}),
      ]);
      if (cancelled) return;
      if (submissionResponse.error || quizResponse.error) {
        setRecordsError(true);
        return;
      }
      setSubmissions((submissionResponse.data ?? []) as Submission[]);
      setQuizAttempts(
        ((quizResponse.data ?? []) as QuizAttempt[]).filter(quizAttemptIsCurrent),
      );
    };

    void supabase.auth.getSession().then(({data}) => {
      if (!cancelled) void loadRecords(data.session?.user.id ?? null);
    });
    const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
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
    testResults: {name: string; passed: boolean; expected: string; actual: string}[],
    passed: boolean,
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
        test_results: testResults,
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
    const nextResults: {name: string; passed: boolean; expected: string; actual: string}[] = [];

    for (const test of variant.tests) {
      const response = await run(isolatedTestProgram(code, test));
      const actual = response.error
        ? conciseError(response.error)
        : response.stdout.trim().split('\n').at(-1)?.trim() || '(no output)';
      nextResults.push({
        name: test.name,
        passed: !response.error && actual === test.expected,
        expected: test.expected,
        actual,
      });
      setResults([...nextResults]);
    }

    const passed = nextResults.every((result) => result.passed);
    setJudged(true);
    setRunning(false);
    setSessionFailures((previous) => ({
      ...previous,
      [selected.id]: passed ? 0 : (previous[selected.id] ?? 0) + 1,
    }));
    await saveSubmission(selected, variant.id, code, nextResults, passed);
  };

  const selectAssignment = (assignment: Assignment) => {
    if (running) return;
    setSelectedId(assignment.id);
    setResults([]);
    setJudged(false);
    setSaveState('idle');
  };

  const practiceAgain = (assignmentId: string) => {
    const assignment = getAssignment(assignmentId);
    if (!assignment) return;
    selectAssignment(assignment);
    setView('practice');
  };

  const editCode = (value: string) => {
    setCodes((previous) => ({...previous, [selected.id]: value}));
    setResults([]);
    setJudged(false);
    setSaveState('idle');
  };

  const tabs: {id: View; label: string; count?: number}[] = [
    {id: 'practice', label: t('tabPractice')},
    {id: 'history', label: t('tabHistory'), count: submissions.length + quizAttempts.length},
    {id: 'mistakes', label: t('tabMistakes'), count: assignmentMistakes.length + quizMistakes.length},
  ];

  const recordsPrompt = (
    <div className="rounded-xl border border-accent/30 bg-accent-soft/40 p-6 text-center">
      <h3 className="font-semibold text-navy">{t('anonymousTitle')}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-navy/65">{t('anonymousBody')}</p>
      <Link href="/auth" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-navy px-5 py-2 text-sm font-medium text-white hover:bg-navy/90">
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
            type="button"
            role="tab"
            aria-selected={view === tab.id}
            onClick={() => setView(tab.id)}
            className={`min-h-11 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${view === tab.id ? 'bg-navy text-white' : 'text-navy/65 hover:bg-navy/5'}`}
          >
            {tab.label}
            {tab.count !== undefined && userId && (
              <span className={`ml-2 text-xs ${view === tab.id ? 'text-white/70' : 'text-navy/40'}`}>{tab.count}</span>
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
                type="button"
                onClick={() => selectAssignment(assignment)}
                disabled={running}
                className={`min-h-11 w-full cursor-pointer rounded-xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed ${selected.id === assignment.id ? 'border-accent bg-accent-soft/40 shadow-sm' : 'border-navy/10 bg-white hover:border-accent/40'}`}
              >
                <span className="text-xs font-medium text-accent">L1 · Lesson {assignment.lesson}</span>
                <span className="mt-1 block font-semibold text-navy">{assignment.title}</span>
                <span className="mt-1 block text-xs leading-relaxed text-navy/55">{assignment.summary}</span>
              </button>
            ))}
          </div>

          <section className="min-w-0 rounded-xl border border-navy/10 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-navy">{selected.title}</h2>
                <p className="mt-1 text-sm text-navy/60">{variant.description}</p>
              </div>
              <Link href={selected.reviewPath} className="inline-flex min-h-11 items-center text-sm font-medium text-accent hover:underline">
                {t('reviewLesson')} →
              </Link>
            </div>

            <div className="mt-5 rounded-lg bg-surface p-4">
              <h3 className="text-sm font-semibold text-navy">{t('instructions')}</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-navy/70">
                {selected.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}
              </ol>
              <p className="mt-3 font-mono text-xs text-accent">{selected.functionSignature}</p>
            </div>

            <div className="mt-5 overflow-hidden rounded-lg border border-navy/10">
              <CodeEditor value={codes[selected.id]} onChange={editCode} />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void judge()}
                disabled={state !== 'ready' || running}
                className="min-h-11 cursor-pointer rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-45"
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
                    {allPassed ? t('allPassed') : t('notPassed', {passed: passedCount, total: variant.tests.length})}
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
                          <p className="rounded bg-green-50 px-3 py-2 text-green-900">{t('expected')}: {result.expected}</p>
                          <p className="break-words rounded bg-red-50 px-3 py-2 text-red-800">{t('actual')}: {result.actual}</p>
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
            {selectedSupport && <SupportCard topic={`${selected.title} (${selected.id})`} />}
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
            {submissions.length === 0 ? <p className="mt-3 text-sm text-navy/50">{t('noHistory')}</p> : (
              <div className="mt-3 space-y-3">
                {submissions.map((submission) => (
                  <div key={submission.id} className="rounded-lg border border-navy/10 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium text-navy">{getAssignment(submission.assignment_id)?.title ?? submission.assignment_id}</span>
                      <span className={`text-sm font-medium ${submission.passed ? 'text-green-700' : 'text-red-600'}`}>
                        {submission.passed ? t('passed') : t('failed')}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-navy/45">{formatDate(submission.created_at, locale)} · {t('variantLabel')}: {submission.variant}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-navy">{t('quizAttempts')}</h2>
            {quizAttempts.length === 0 ? <p className="mt-3 text-sm text-navy/50">{t('noHistory')}</p> : (
              <div className="mt-3 space-y-3">
                {quizAttempts.map((attempt) => (
                  <div key={attempt.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-navy/10 p-4">
                    <div>
                      <p className="font-medium text-navy">{QUIZ_REGISTRY[attempt.quiz_id] ? quizText(QUIZ_REGISTRY[attempt.quiz_id].title, locale) : attempt.quiz_id}</p>
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
        <div className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy/10 bg-white p-4 shadow-sm">
            <p className="text-sm text-navy/65">{t('mistakeSummary', {open: openCount, mastered: masteredCount})}</p>
            <div className="flex rounded-full bg-navy/5 p-1" aria-label={t('tabMistakes')}>
              {(['open', 'mastered'] as MistakeFilter[]).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setMistakeFilter(filter)}
                  aria-pressed={mistakeFilter === filter}
                  className={`min-h-11 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition ${mistakeFilter === filter ? 'bg-navy text-white' : 'text-navy/65 hover:bg-navy/10'}`}
                >
                  {filter === 'open' ? t('filterOpen', {count: openCount}) : t('filterMastered', {count: masteredCount})}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-5">
            {visibleAssignments.length === 0 && visibleQuizzes.length === 0 && (
              <div className="rounded-xl border border-navy/10 bg-white p-8 text-center shadow-sm">
                <h2 className="font-semibold text-navy">{mistakeFilter === 'open' ? t('noMistakesTitle') : t('noMasteredTitle')}</h2>
                <p className="mt-2 text-sm text-navy/55">{mistakeFilter === 'open' ? t('noMistakesBody') : t('noMasteredBody')}</p>
              </div>
            )}

            {visibleAssignments.map((mistake) => {
              const assignment = getAssignment(mistake.assignmentId);
              const failed = mistake.lastFailedSubmission;
              if (!assignment || !failed) return null;
              return (
                <section key={mistake.assignmentId} className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${mistake.mastered ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'}`}>
                        {mistake.mastered ? t('mastered') : t('needsReview')}
                      </span>
                      <h2 className="mt-2 font-semibold text-navy">{assignment.title}</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button type="button" onClick={() => practiceAgain(assignment.id)} className="min-h-11 cursor-pointer rounded-full border border-navy/15 px-4 py-2 text-sm text-navy hover:border-accent hover:text-accent">
                        {t('practiceAgain')}
                      </button>
                      <Link href={assignment.reviewPath} className="inline-flex min-h-11 items-center text-sm text-accent hover:underline">{t('review')} →</Link>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-navy/50">
                    {t('attemptSummary', {attempts: mistake.attemptCount, failures: mistake.failureCount})} · {formatDate(failed.created_at, locale)}
                  </p>
                  <div className="mt-3 space-y-2">
                    {failed.test_results.filter((result) => !result.passed).map((result, index) => (
                      <div key={`${index}-${result.name}`} className="rounded-lg bg-red-50 p-3 text-xs">
                        <p className="font-medium text-red-900">{result.name}</p>
                        <p className="mt-1 font-mono text-red-800">{t('expected')}: {result.expected} · {t('actual')}: {result.actual}</p>
                      </div>
                    ))}
                  </div>
                  {!mistake.mastered && mistake.failureCount >= 3 && <SupportCard topic={`${assignment.title} (${assignment.id})`} />}
                </section>
              );
            })}

            {visibleQuizzes.map((mistake) => {
              const quiz = QUIZ_REGISTRY[mistake.quizId];
              const question = quiz.questions[mistake.questionIndex];
              const answer = mistake.lastFailedAnswer;
              if (!question || !answer || !mistake.lastFailedAttempt) return null;
              const title = quizText(quiz.title, locale);
              const prompt = quizText(question.q, locale);
              return (
                <section key={`${mistake.quizId}:${mistake.questionIndex}`} className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${mistake.mastered ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'}`}>
                        {mistake.mastered ? t('mastered') : t('needsReview')}
                      </span>
                      <h2 className="mt-2 font-semibold text-navy">{title}</h2>
                    </div>
                    <Link href={question.reviewPath ?? quiz.reviewPath} className="inline-flex min-h-11 items-center text-sm text-accent hover:underline">{t('review')} →</Link>
                  </div>
                  <p className="mt-2 text-xs text-navy/50">
                    {t('attemptSummary', {attempts: mistake.attemptCount, failures: mistake.failureCount})} · {formatDate(mistake.lastFailedAttempt.created_at, locale)}
                  </p>
                  <div className="mt-4 rounded-lg border border-navy/10 p-4">
                    <div className="text-sm font-medium text-navy"><MathText text={`${mistake.questionIndex + 1}. ${prompt}`} /></div>
                    <p className="mt-2 text-sm text-red-700">{t('yourAnswer')}: {selectedText(question, answer.selected, locale)}</p>
                    <p className="mt-1 text-sm text-green-700">{t('correctAnswer')}: {selectedText(question, question.answer, locale)}</p>
                    <div className="mt-2 text-xs leading-6 text-navy/60"><MathText text={`${t('explanation')}: ${quizText(question.explain, locale)}`} /></div>
                  </div>
                  {!mistake.mastered && mistake.failureCount >= 3 && <SupportCard topic={`${title} — ${prompt}`} />}
                </section>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
