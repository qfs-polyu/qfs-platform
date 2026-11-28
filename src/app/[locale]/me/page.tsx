'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {createClient} from '@/lib/supabase/browser';
import {LEVELS} from '@/content/curriculum';
import {
  TRACK_COLOR,
  TRACK_HINT_KEY,
  LevelStatusPill,
  levelCircleClass,
  type Track,
} from '@/components/progress/LevelStatus';
import {useLearningProgress} from '@/components/progress/useLearningProgress';

const TRACKS: Track[] = ['trading', 'research', 'coding'];

export default function MePage() {
  const t = useTranslations('me');
  const tt = useTranslations('tracks');
  const ta = useTranslations('auth');
  const {state, signedIn, progress} = useLearningProgress();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const load = () => {
      void supabase.auth.getSession().then(({data}) => {
        setEmail(data.session?.user?.email ?? null);
        setLoading(false);
      });
    };
    load();
    const {
      data: {subscription}
    } = supabase.auth.onAuthStateChange(() => load());
    return () => subscription.unsubscribe();
  }, []);

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
        <div className="mt-4 space-y-6 rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
          {!loading && !signedIn && state === 'ready' && (
            <p className="text-sm text-navy/60">
              {t('loginPrompt')}{' '}
              <Link
                href="/auth"
                className="font-medium text-accent hover:underline"
              >
                {ta('loginSignup')}
              </Link>
            </p>
          )}

          {/* Levels */}
          <div>
            <h3 className="text-sm font-semibold text-navy/60">{t('levelsTitle')}</h3>
            {state === 'loading' && <div className="mt-3 h-4 w-40 animate-pulse rounded bg-navy/10" />}
            {state === 'ready' && progress && (
              <ol className="mt-3 space-y-3">
                {LEVELS.map((level) => {
                  const item = progress.levels.find((entry) => entry.id === level.id);
                  const current = progress.currentLevelId === level.id;
                  return (
                    <li key={level.id} className="flex flex-wrap items-center gap-2 text-sm">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${levelCircleClass(item, level.track, current)}`}
                      >
                        {level.id}
                      </span>
                      <span className="text-navy/85">{level.topic}</span>
                      {item && <LevelStatusPill level={item} />}
                      {current && (
                        <span className="text-xs font-medium text-accent">{t('currentHint')}</span>
                      )}
                      <span className="w-full pl-8 text-xs text-navy/45">
                        {t('gateLabel')}
                        {level.gate}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          {/* Tracks */}
          <div className="space-y-5">
            {TRACKS.map((track) => {
              const done = progress?.tracks[track].done ?? 0;
              const total = progress?.tracks[track].total ?? 0;
              const pct = total > 0 ? Math.min(100, (done / total) * 100) : 0;
              return (
                <div key={track}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-navy">
                      <span className={`h-2.5 w-2.5 rounded-full ${TRACK_COLOR[track]}`} />
                      {track === 'trading' ? 'Trading' : track === 'research' ? 'Research' : 'Coding'}
                    </span>
                    <span className="text-navy/60">
                      {done} / {total} {tt(track)}
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-navy/10">
                    <div
                      className={`h-full rounded-full transition-all ${TRACK_COLOR[track]}`}
                      style={{width: pct > 0 ? `${Math.max(2, pct)}%` : '0%'}}
                    />
                  </div>
                  <p className="mt-1 text-xs text-navy/40">{tt(TRACK_HINT_KEY[track])}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Account */}
      <section className="mt-8">
        <h2 className="font-semibold text-navy/80">{t('accountTitle')}</h2>
        <div className="mt-4 rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
          {loading ? (
            <div className="h-4 w-40 animate-pulse rounded bg-navy/10" />
          ) : email ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-navy/50">{t('signedInAs')}</p>
                <p className="truncate font-medium text-navy" title={email}>
                  {email}
                </p>
              </div>
              <button
                onClick={signOut}
                className="min-h-11 rounded-full border border-navy/20 px-4 py-1.5 text-sm text-navy/70 transition hover:border-navy/40 hover:text-navy"
              >
                {ta('logout')}
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-navy/60">{t('notSignedIn')}</p>
              <Link
                href="/auth"
                className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white transition hover:bg-accent/90"
              >
                {ta('loginSignup')}
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
