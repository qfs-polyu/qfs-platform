import {getTranslations} from 'next-intl/server';
import {createClient} from '@/lib/supabase/server';
import {TOTAL_LESSONS} from '@/content/lessons';

/**
 * Real progress card for signed-in users (dynamic — reads the session).
 * Rendered inside <Suspense> so the rest of the home page stays static.
 */
export default async function ProgressCard() {
  const t = await getTranslations('home');
  const tc = await getTranslations('common');

  const supabase = await createClient();
  const {
    data: {user}
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-xl border border-dashed border-navy/25 bg-surface p-6">
        <h2 className="font-semibold">{t('progressTitle')}</h2>
        <div className="mt-3 flex items-center gap-2 text-sm text-navy/50">
          <span className="rounded bg-navy/5 px-2 py-0.5 text-xs">
            {tc('comingM1')}
          </span>
          {t('progressNote')}
        </div>
      </div>
    );
  }

  let completedLessons: number[] = [];
  try {
    const {data} = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id);
    completedLessons = (data ?? []).map((r) => r.lesson_id as number);
  } catch {
    // table not created yet — treat as no progress
  }

  return (
    <div className="rounded-xl border border-dashed border-navy/25 bg-surface p-6">
      <h2 className="font-semibold">{t('progressTitle')}</h2>
      <div className="mt-3 space-y-2">
        <p
          className="truncate text-xs text-navy/50"
          title={user.email ?? ''}
        >
          {user.email}
        </p>
        <div className="flex items-center justify-between text-sm text-navy/70">
          <span>{t('completedLessons')}</span>
          <span className="font-semibold text-navy">
            {completedLessons.length} / {TOTAL_LESSONS}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-navy/10">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{
              width: `${Math.min(100, (completedLessons.length / TOTAL_LESSONS) * 100)}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}
