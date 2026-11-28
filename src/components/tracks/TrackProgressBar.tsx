'use client';

import {useTranslations} from 'next-intl';
import {TRACK_COLOR, TRACK_HINT_KEY, type Track} from '@/components/progress/LevelStatus';
import {useLearningProgress} from '@/components/progress/useLearningProgress';

/** In-track progress bar shown at the bottom of each track page. */
export default function TrackProgressBar({track}: {track: Track}) {
  const t = useTranslations('tracks');
  const {state, progress} = useLearningProgress();
  const {done, total} = progress?.tracks[track] ?? {done: 0, total: 0};
  const pct = total > 0 ? Math.min(100, (done / total) * 100) : 0;

  return (
    <div className="mt-10 rounded-xl border border-navy/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-medium text-navy">
          <span className={`h-2.5 w-2.5 rounded-full ${TRACK_COLOR[track]}`} />
          {t('progressTitle')}
        </span>
        {state === 'ready' && (
          <span className="text-navy/60">
            {done} / {total} {t(track)}
          </span>
        )}
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-navy/10">
        <div
          className={`h-full rounded-full transition-all ${TRACK_COLOR[track]}`}
          style={{width: pct > 0 ? `${Math.max(2, pct)}%` : '0%'}}
        />
      </div>
      {state === 'ready' && (
        <p className="mt-1 text-xs text-navy/40">{t(TRACK_HINT_KEY[track])}</p>
      )}
    </div>
  );
}
