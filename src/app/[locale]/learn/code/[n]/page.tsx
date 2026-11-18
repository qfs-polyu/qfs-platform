import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {getLesson, TOTAL_LESSONS} from '@/content/lessons';
import StepCourse from '@/components/StepCourse';

export function generateStaticParams() {
  return Array.from({length: TOTAL_LESSONS}, (_, i) => ({n: String(i + 1)}));
}

export default async function LessonPage({
  params
}: {
  params: Promise<{locale: string; n: string}>;
}) {
  const {locale, n} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('lesson');
  const tc = await getTranslations('code');
  const num = Number(n);
  const lesson = getLesson(num);

  return (
    <div>
      <Link
        href="/learn/code"
        className="text-sm text-accent hover:underline"
      >
        ← {tc('title')}
      </Link>
      <h1 className="mt-3 text-2xl font-bold">
        {tc('lesson')} {num}: {lesson ? lesson.title : t('comingSoonTitle')}
      </h1>

      {lesson ? (
        <div className="mt-8">
          <StepCourse lesson={lesson} />
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-navy/25 bg-surface p-10 text-center">
          <p className="text-sm text-navy/60">{t('comingSoonBody')}</p>
          <span className="mt-3 inline-block rounded-full bg-navy/5 px-3 py-1 text-xs text-navy/50">
            {t('comingM1')}
          </span>
        </div>
      )}
    </div>
  );
}
