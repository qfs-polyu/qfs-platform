'use client';

import {useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {QUESTIONS, scorePlacement, type PlacementResult} from '@/content/assessment';

const STORAGE_KEY = 'qfs_placement_v1';

export default function AssessmentPage() {
  const t = useTranslations('assessment');
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [history, setHistory] = useState<PlacementResult | null>(null);

  useMemo(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw) as PlacementResult);
    } catch {
      // ignore
    }
  }, []);

  const question = QUESTIONS[index];
  const total = QUESTIONS.length;

  const pick = (optionIndex: number) => {
    const next = {...answers, [question.id]: optionIndex};
    setAnswers(next);
    setTimeout(() => {
      if (index + 1 < total) {
        setIndex(index + 1);
      } else {
        const r = scorePlacement(next);
        setResult(r);
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(r));
        } catch {
          // ignore
        }
      }
    }, 250);
  };

  const restart = () => {
    setStarted(true);
    setIndex(0);
    setAnswers({});
    setResult(null);
  };

  /* ---------- Intro ---------- */
  if (!started && !result) {
    return (
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="mt-3 text-sm leading-relaxed text-navy/70">{t('intro')}</p>
        <ul className="mt-4 space-y-1 text-sm text-navy/60">
          <li>· {t('introPoints1')}</li>
          <li>· {t('introPoints2')}</li>
          <li>· {t('introPoints3')}</li>
        </ul>
        {history && (
          <div className="mt-5 rounded-xl border border-accent/30 bg-accent-soft/60 p-4 text-sm">
            <p className="font-medium text-navy">
              {t('lastResult')}: <span className="text-accent">{history.level}</span>
            </p>
          </div>
        )}
        <button
          onClick={restart}
          className="mt-6 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition hover:bg-accent/90"
        >
          {history ? t('retake') : t('start')}
        </button>
      </div>
    );
  }

  /* ---------- Result ---------- */
  if (result) {
    const trackName =
      result.track === 'trading'
        ? 'Trading'
        : result.track === 'research'
          ? 'Research'
          : result.track === 'coding'
            ? 'Coding'
            : 'All';
    return (
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-bold">{t('resultTitle')}</h1>
        <div className="mt-6 rounded-2xl bg-navy p-8 text-center text-white">
          <p className="text-sm text-white/60">{t('recommendedStart')}</p>
          <div className="mt-2 text-5xl font-bold text-accent">{result.level}</div>
          <p className="mt-3 text-sm text-white/75">{t(result.reasonKey)}</p>
        </div>
        <div className="mt-4 rounded-xl border border-navy/10 bg-white p-5 text-sm shadow-sm">
          <p className="text-navy/70">
            {t('trackInterest')}: <span className="font-medium text-navy">{trackName}</span>
          </p>
          {result.english === 'en-low' && (
            <p className="mt-2 text-navy/60">{t('englishNote')}</p>
          )}
          <p className="mt-3 text-xs text-navy/45">
            {t('scoresNote')} F {result.scores.finance}/4 · P {result.scores.programming}/4 · Q{' '}
            {result.scores.quant}/3
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/learn/code/1"
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent/90"
          >
            {t('goLesson1')} →
          </Link>
          <Link
            href="/#learning-map"
            className="rounded-full border border-navy/20 px-5 py-2 text-sm text-navy/70 hover:border-navy/40 hover:text-navy"
          >
            {t('viewMap')}
          </Link>
          <button
            onClick={restart}
            className="rounded-full px-4 py-2 text-sm text-navy/50 underline underline-offset-2 hover:text-navy"
          >
            {t('retake')}
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Questions ---------- */
  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-center justify-between text-sm text-navy/60">
        <span className="font-medium text-navy">{t('title')}</span>
        <span>
          {index + 1} / {total}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy/10">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{width: `${((index + 1) / total) * 100}%`}}
        />
      </div>

      <h2 className="mt-6 text-lg font-semibold leading-relaxed text-navy">
        {question.q}
      </h2>
      <div className="mt-5 space-y-2.5">
        {question.options.map((option, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            className="w-full rounded-xl border border-navy/12 bg-white px-4 py-3 text-left text-sm text-navy/85 shadow-sm transition hover:border-accent hover:text-navy"
          >
            {option}
          </button>
        ))}
      </div>
      {index > 0 && (
        <button
          onClick={() => setIndex(index - 1)}
          className="mt-4 text-sm text-navy/50 hover:text-navy"
        >
          ← {t('back')}
        </button>
      )}
    </div>
  );
}
