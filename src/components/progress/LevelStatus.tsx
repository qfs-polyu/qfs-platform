'use client';

import {useTranslations} from 'next-intl';
import type {UnitRef} from '@/content/curriculum';
import {levelBadge, type LevelBadgeKey, type LevelProgress, type UnitProgress} from '@/lib/progress';

export type Track = UnitRef['track'];
type UnitStatus = UnitProgress['status'];

/** Brand colour of each track, shared by the level markers and the unit bars. */
export const TRACK_COLOR: Record<Track, string> = {
  trading: 'bg-navy',
  coding: 'bg-accent',
  research: 'bg-track-research',
};

/** Message key (namespace `tracks`) explaining what counts as one unit in each track. */
export const TRACK_HINT_KEY: Record<Track, string> = {
  trading: 'hintTrading',
  research: 'hintResearch',
  coding: 'hintCoding',
};

const PILL_CLASS: Record<LevelBadgeKey, string> = {
  passed: 'bg-green-100 text-green-700',
  contentComplete: 'border border-green-200 bg-green-50 text-green-700',
  inProgress: 'bg-accent-soft text-accent',
  available: 'bg-navy/5 text-navy/60',
  locked: 'bg-navy/5 text-navy/45',
  upcoming: 'bg-navy/5 text-navy/45',
};

const MARK: Record<UnitStatus, string> = {
  passed: '✓',
  in_progress: '◐',
  not_started: '○',
  unavailable: '—',
};

const MARK_COLOR: Record<UnitStatus, string> = {
  passed: 'text-green-700',
  in_progress: 'text-amber-600',
  not_started: 'text-navy/35',
  unavailable: 'text-navy/25',
};

const UNIT_LABEL_KEY: Record<UnitStatus, string> = {
  passed: 'unitPassed',
  in_progress: 'unitInProgress',
  not_started: 'unitNotStarted',
  unavailable: 'unitUnavailable',
};

/** Background of a level's round marker: green once passed, grey when locked or not open. */
export function levelCircleClass(level: LevelProgress | undefined, track: Track, current = false) {
  if (!level) return TRACK_COLOR[track];
  if (level.status === 'passed') return 'bg-green-600';
  if (level.status === 'locked' || level.status === 'upcoming') return 'bg-navy/35';
  return `${TRACK_COLOR[track]}${current ? ' ring-4 ring-accent/40' : ''}`;
}

/** Status label of a level, with its gate numbers when they exist. */
export function LevelStatusPill({level}: {level: LevelProgress}) {
  const t = useTranslations('progress');
  const {key, done, total} = levelBadge(level);
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PILL_CLASS[key]}`}>
      {t(key, {done, total})}
    </span>
  );
}

/** Marker in front of a unit: finished, partly finished, not started, not built. */
export function UnitStatusMark({unit}: {unit: UnitProgress}) {
  const t = useTranslations('progress');
  const label =
    unit.status === 'in_progress'
      ? t('unitInProgress', {done: unit.done, total: unit.total})
      : t(UNIT_LABEL_KEY[unit.status]);
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`w-4 shrink-0 text-center font-semibold ${MARK_COLOR[unit.status]}`}
    >
      {MARK[unit.status]}
    </span>
  );
}

/** "Not built yet" tag for units without content. */
export function UnitUnavailableTag() {
  const t = useTranslations('progress');
  return (
    <span className="rounded bg-navy/5 px-1.5 py-0.5 text-xs text-navy/50">
      {t('unitUnavailable')}
    </span>
  );
}
