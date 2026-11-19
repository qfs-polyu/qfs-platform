'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {createClient} from '@/lib/supabase/browser';
import {TRADING_STAGES, RESEARCH_LAYERS} from '@/content/curriculum';
import {TOTAL_LESSONS} from '@/content/lessons';

type Track = {
  key: 'trading' | 'research' | 'coding';
  bar: string;
  dot: string;
  total: number;
  unit: string;
  measurable: boolean;
};

export default function MePage() {
  const t = useTranslations('me');
  const ta = useTranslations('auth');
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [codingDone, setCodingDone] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    const load = async () => {
      const {
        data: {session}
      } = await supabase.auth.getSession();
      setEmail(session?.user?.email ?? null);
      if (session) {
        try {
          const {data} = await supabase
            .from('lesson_progress')
            .select('lesson_id');
          setCodingDone(
            (data ?? []).filter(
              (r) => (r.lesson_id as number) >= 1 && (r.lesson_id as number) <= TOTAL_LESSONS
            ).length
          );
        } catch {
          // table/grant not ready — show 0
        }
      }
      setLoading(false);
    };
    load();
    const {
      data: {subscription}
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const tracks: Track[] = [
    {
      key: 'trading',
      bar: 'bg-navy',
      dot: 'bg-navy',
      total: TRADING_STAGES.length,
      unit: t('unitStages'),
      measurable: false
    },
    {
      key: 'research',
      bar: 'bg-track-research',
      dot: 'bg-track-research',
      total: RESEARCH_LAYERS.length,
      unit: t('unitLayers'),
      measurable: false
    },
    {
      key: 'coding',
      bar: 'bg-accent',
      dot: 'bg-accent',
      total: TOTAL_LESSONS,
      unit: t('unitLessons'),
      measurable: true
    }
  ];

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">{t('title')}</h1>

      {/* Progress */}
      <section className="mt-8">
        <h2 className="font-semibold text-navy/80">{t('progressTitle')}</h2>
        <div className="mt-4 space-y-5 rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
          {loading ? (
            <div className="h-4 w-40 animate-pulse rounded bg-navy/10" />
          ) : !email ? (
            <p className="text-sm text-navy/60">
              {t('loginPrompt')}{' '}
              <Link
                href="/auth"
                className="font-medium text-accent hover:underline"
              >
                {ta('loginSignup')}
              </Link>
            </p>
          ) : null}
          {tracks.map((track) => {
            const done = track.measurable && email ? codingDone : 0;
            const pct = Math.min(100, (done / track.total) * 100);
            return (
              <div key={track.key}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-navy">
                    <span className={`h-2.5 w-2.5 rounded-full ${track.dot}`} />
                    {track.key === 'trading'
                      ? 'Trading'
                      : track.key === 'research'
                        ? 'Research'
                        : 'Coding'}
                  </span>
                  <span className="text-navy/60">
                    {done} / {track.total} {track.unit}
                  </span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-navy/10">
                  <div
                    className={`h-full rounded-full transition-all ${track.bar}`}
                    style={{width: pct > 0 ? `${Math.max(2, pct)}%` : '0%'}}
                  />
                </div>
                {!track.measurable && (
                  <p className="mt-1 text-xs text-navy/40">
                    {t('notRecordedYet')}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Account */}
      <section className="mt-8">
        <h2 className="font-semibold text-navy/80">{t('accountTitle')}</h2>
        <div className="mt-4 rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
          {!loading && email ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-navy/50">{t('signedInAs')}</p>
                <p className="truncate font-medium text-navy" title={email}>
                  {email}
                </p>
              </div>
              <button
                onClick={signOut}
                className="rounded-full border border-navy/20 px-4 py-1.5 text-sm text-navy/70 transition hover:border-navy/40 hover:text-navy"
              >
                {ta('logout')}
              </button>
            </div>
          ) : !loading ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-navy/60">{t('notSignedIn')}</p>
              <Link
                href="/auth"
                className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white transition hover:bg-accent/90"
              >
                {ta('loginSignup')}
              </Link>
            </div>
          ) : (
            <div className="h-4 w-40 animate-pulse rounded bg-navy/10" />
          )}
        </div>
      </section>
    </div>
  );
}
