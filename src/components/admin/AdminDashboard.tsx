'use client';

import {useEffect, useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {createClient} from '@/lib/supabase/browser';
import {TOTAL_LESSONS} from '@/content/lessons';

type Overview = {
  email: string;
  created_at: string;
  lessons_done: number;
  last_activity: string | null;
};
type LessonStat = {lesson_id: number; completions: number};

export default function AdminDashboard() {
  const t = useTranslations('admin');
  const [state, setState] = useState<
    'loading' | 'anon' | 'forbidden' | 'error' | 'ready'
  >('loading');
  const [overview, setOverview] = useState<Overview[]>([]);
  const [lessonStats, setLessonStats] = useState<LessonStat[]>([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const {
          data: {session}
        } = await supabase.auth.getSession();
        if (!session) {
          if (!cancelled) setState('anon');
          return;
        }
        if (session.user.app_metadata?.role !== 'admin') {
          if (!cancelled) setState('forbidden');
          return;
        }
        const [{data: ov, error: e1}, {data: ls, error: e2}] = await Promise.all([
          supabase.rpc('admin_overview'),
          supabase.rpc('admin_lesson_stats')
        ]);
        if (e1 || e2) {
          if (!cancelled) setState('error');
          return;
        }
        if (!cancelled) {
          setOverview((ov ?? []) as Overview[]);
          setLessonStats((ls ?? []) as LessonStat[]);
          setState('ready');
        }
      } catch {
        if (!cancelled) setState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const summary = useMemo(() => {
    const registered = overview.length;
    const active = overview.filter((r) => r.lessons_done > 0).length;
    const totalDone = overview.reduce((s, r) => s + r.lessons_done, 0);
    return {registered, active, totalDone};
  }, [overview]);

  const byLesson = useMemo(() => {
    const m = new Map<number, number>();
    for (const l of lessonStats) m.set(l.lesson_id, l.completions);
    return m;
  }, [lessonStats]);

  const exportCsv = async () => {
    setExporting(true);
    try {
      const header = 'email,signup_date,lessons_done,last_activity\n';
      const rows = overview
        .map(
          (r) =>
            `${r.email},${new Date(r.created_at).toISOString().slice(0, 10)},${
              r.lessons_done
            },${r.last_activity ? new Date(r.last_activity).toISOString().slice(0, 10) : ''}`
        )
        .join('\n');
      const blob = new Blob([header + rows], {type: 'text/csv;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qfs-progress-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  if (state === 'loading') {
    return <div className="h-8 w-40 animate-pulse rounded bg-navy/10" />;
  }
  if (state === 'anon') {
    return (
      <div className="rounded-xl border border-navy/10 bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-navy/70">{t('needLogin')}</p>
        <Link
          href="/auth"
          className="mt-3 inline-block rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent/90"
        >
          {t('loginLink')}
        </Link>
      </div>
    );
  }
  if (state === 'forbidden') {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-sm text-amber-900">
        {t('notAdmin')}
      </div>
    );
  }
  if (state === 'error') {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-sm text-red-700">
        {t('loadError')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {label: t('registered'), value: summary.registered},
          {label: t('activeLearners'), value: summary.active},
          {label: t('totalCompletions'), value: summary.totalDone}
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm"
          >
            <p className="text-xs text-navy/50">{c.label}</p>
            <p className="mt-1 text-3xl font-bold text-navy">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Per-lesson completion */}
      <div className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-navy">{t('perLessonTitle')}</h2>
        <div className="mt-3 space-y-2">
          {Array.from({length: TOTAL_LESSONS}, (_, i) => i + 1).map((n) => {
            const done = byLesson.get(n) ?? 0;
            const pct = summary.active
              ? Math.min(100, (done / Math.max(1, summary.active)) * 100)
              : 0;
            return (
              <div key={n} className="flex items-center gap-3 text-sm">
                <span className="w-14 shrink-0 text-navy/60">
                  {t('lessonLabel')} {n}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-navy/10">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{width: `${pct}%`}}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-navy/60">
                  {done}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-navy/40">{t('perLessonNote')}</p>
      </div>

      {/* Member table */}
      <div className="rounded-xl border border-navy/10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="font-semibold text-navy">{t('membersTitle')}</h2>
          <button
            onClick={exportCsv}
            disabled={exporting}
            className="rounded-full border border-navy/20 px-4 py-1.5 text-sm text-navy/70 transition hover:border-navy/40 hover:text-navy disabled:opacity-40"
          >
            {exporting ? '…' : `⬇ ${t('exportCsv')}`}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-navy text-white">
                <th className="px-4 py-2.5 font-medium">{t('colEmail')}</th>
                <th className="px-4 py-2.5 font-medium">{t('colSignup')}</th>
                <th className="px-4 py-2.5 font-medium">{t('colLessons')}</th>
                <th className="px-4 py-2.5 font-medium">{t('colLastActive')}</th>
              </tr>
            </thead>
            <tbody>
              {overview.map((r, i) => (
                <tr
                  key={r.email}
                  className={`border-t border-navy/10 ${i % 2 ? 'bg-surface/60' : ''}`}
                >
                  <td className="px-4 py-2.5 text-navy/85">{r.email}</td>
                  <td className="px-4 py-2.5 text-navy/60">
                    {new Date(r.created_at).toISOString().slice(0, 10)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={
                        r.lessons_done > 0
                          ? 'font-semibold text-accent'
                          : 'text-navy/40'
                      }
                    >
                      {r.lessons_done} / {TOTAL_LESSONS}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-navy/60">
                    {r.last_activity
                      ? new Date(r.last_activity).toISOString().slice(0, 10)
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
