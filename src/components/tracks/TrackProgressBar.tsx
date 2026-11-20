'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {createClient} from '@/lib/supabase/browser';
import {TOTAL_LESSONS} from '@/content/lessons';
import {TRADING_STAGES, RESEARCH_LAYERS} from '@/content/curriculum';

type Track = 'trading' | 'research' | 'coding';

/** In-track progress bar shown at the bottom of each track page. */
export default function TrackProgressBar({track}: {track: Track}) {
  const t = useTranslations('tracks');
  const tm = useTranslations('me');
  const [done, setDone] = useState<number | null>(null);

  useEffect(() => {
    if (track !== 'coding') return;
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const {
          data: {session}
        } = await supabase.auth.getSession();
        if (!session) {
          if (!cancelled) setDone(0);
          return;
        }
        const {data} = await supabase
          .from('lesson_progress')
          .select('lesson_id');
        const n = (data ?? []).filter(
          (r) =>
            (r.lesson_id as number) >= 1 && (r.lesson_id as number) <= TOTAL_LESSONS
        ).length;
        if (!cancelled) setDone(n);
      } catch {
        if (!cancelled) setDone(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [track]);

  const total =
    track === 'trading'
      ? TRADING_STAGES.length
      : track === 'research'
        ? RESEARCH_LAYERS.length
        : TOTAL_LESSONS;
  const unit =
    track === 'trading'
      ? tm('unitStages')
      : track === 'research'
        ? tm('unitLayers')
        : tm('unitLessons');
  const n = track === 'coding' ? (done ?? 0) : 0;
  const pct = Math.min(100, (n / total) * 100);

  return (
    <div className="mt-10 rounded-xl border border-navy/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-medium text-navy">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              track === 'trading'
                ? 'bg-navy'
                : track === 'research'
                  ? 'bg-track-research'
                  : 'bg-accent'
            }`}
          />
          {t('progressTitle')}
        </span>
        <span className="text-navy/60">
          {n} / {total} {unit}
        </span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-navy/10">
        <div
          className={`h-full rounded-full transition-all ${
            track === 'trading'
              ? 'bg-navy'
              : track === 'research'
                ? 'bg-track-research'
                : 'bg-accent'
          }`}
          style={{width: pct > 0 ? `${Math.max(2, pct)}%` : '0%'}}
        />
      </div>
      {track !== 'coding' && (
        <p className="mt-1 text-xs text-navy/40">{tm('notRecordedYet')}</p>
      )}
      {track === 'coding' && done === 0 && (
        <p className="mt-1 text-xs text-navy/40">{tm('startFirstLesson')}</p>
      )}
    </div>
  );
}
