'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {LEVELS, levelUnits, type UnitRef} from '@/content/curriculum';
import {
  TRACK_COLOR,
  LevelStatusPill,
  UnitStatusMark,
  UnitUnavailableTag,
  levelCircleClass,
} from '@/components/progress/LevelStatus';
import {useLearningProgress} from '@/components/progress/useLearningProgress';

const KIND_LABEL: Record<UnitRef['kind'], string> = {stage: 'Stage', layer: 'Layer', lesson: 'Lesson'};

/**
 * The L0–L5 learning map. Every level and unit stays open to read; a level
 * that is locked or not open yet is greyed, and levels light up as they are
 * passed (plan v2.4 §2.2).
 */
export default function LearningMap() {
  const t = useTranslations('home');
  const tp = useTranslations('progress');
  const {state, signedIn, progress} = useLearningProgress();

  return (
    <div>
      <p className="mb-6 text-xs text-navy/45">{t('mapLegend')}</p>
      {state === 'ready' && !signedIn && (
        <p className="mb-4 text-xs text-navy/60">
          {t('mapSignInHint')}{' '}
          <Link href="/auth" className="font-medium text-accent hover:underline">
            {t('mapSignInLink')}
          </Link>
        </p>
      )}
      <ol className="relative ml-4 space-y-7 border-l-2 border-navy/15 pl-10">
        {LEVELS.map((level) => {
          const item = progress?.levels.find((entry) => entry.id === level.id);
          const current = progress?.currentLevelId === level.id;
          const dimmed = item?.status === 'locked' || item?.status === 'upcoming';
          const units = levelUnits(level.id);
          return (
            <li key={level.id} className={`relative${dimmed ? ' opacity-60' : ''}`}>
              <span
                className={`absolute -left-[58px] top-0 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${levelCircleClass(item, level.track, current)}`}
              >
                {level.id}
              </span>
              {item?.status === 'passed' && (
                <span
                  role="img"
                  aria-label={tp('passed')}
                  className="absolute -left-[30px] -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-green-700 ring-1 ring-green-600"
                >
                  ✓
                </span>
              )}
              <details className="group">
                <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="font-semibold text-navy">{level.topic}</h3>
                    <span className="rounded-full bg-navy/5 px-2.5 py-0.5 text-xs font-medium text-navy/60">
                      {units.length} {t('unitLabel')}
                    </span>
                    {item && <LevelStatusPill level={item} />}
                    {current && (
                      <span className="text-xs font-medium text-accent">{t('currentHint')}</span>
                    )}
                    <span className="text-xs text-navy/35 group-open:hidden">▾</span>
                  </div>
                  <p className="mt-1 text-sm text-navy/60">
                    {t('gateLabel')}
                    {level.gate}
                    {item?.status === 'locked' && item.lockedBy && (
                      <span className="ml-2 text-xs text-navy/45">
                        {t('lockedHint', {level: item.lockedBy})}
                      </span>
                    )}
                  </p>
                </summary>
                <ul className="mt-3 space-y-1.5">
                  {units.map((unit, index) => {
                    // progress.levels[i].units follows this same order.
                    const status = item?.units[index];
                    return (
                      <li key={`${unit.track}-${unit.n}`} className="flex flex-wrap items-center gap-2 text-sm">
                        <span className={`w-1.5 self-stretch rounded ${TRACK_COLOR[unit.track]}`} />
                        {status ? (
                          <UnitStatusMark unit={status} />
                        ) : (
                          <span className="w-4 shrink-0" />
                        )}
                        <Link href={unit.href} className="text-navy/80 hover:text-accent hover:underline">
                          {KIND_LABEL[unit.kind]} {unit.n}: {unit.title}
                        </Link>
                        {unit.extension && (
                          <span className="rounded bg-navy/5 px-1.5 py-0.5 text-xs text-navy/50">ext</span>
                        )}
                        {unit.live && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Live
                          </span>
                        )}
                        {status?.status === 'unavailable' && <UnitUnavailableTag />}
                      </li>
                    );
                  })}
                </ul>
              </details>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
