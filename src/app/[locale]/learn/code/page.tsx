import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {CODE_LESSONS} from '@/content/curriculum';

export default async function CodePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('code');

  return (
    <div>
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-3xl text-sm text-navy/70">{t('subtitle')}</p>
      <div className="mt-8 overflow-hidden rounded-xl border border-navy/10 shadow-sm">
        <table className="w-full bg-white text-left text-sm">
          <thead>
            <tr className="bg-navy text-white">
              <th className="w-16 px-4 py-3 font-medium">{t('lesson')}</th>
              <th className="px-4 py-3 font-medium">Topic</th>
              <th className="px-4 py-3 font-medium">{t('assignmentLabel')}</th>
            </tr>
          </thead>
          <tbody>
            {CODE_LESSONS.map((lesson) => (
              <tr
                key={lesson.n}
                className="border-t border-navy/10 even:bg-surface/60"
              >
                <td className="px-4 py-3 font-bold text-accent">{lesson.n}</td>
                <td className="px-4 py-3 font-medium text-navy">
                  <Link
                    href={`/learn/code/${lesson.n}`}
                    className="hover:text-accent hover:underline"
                  >
                    {lesson.title}
                  </Link>
                  {lesson.n === 1 && (
                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      {t('live')}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-navy/65">{lesson.assignment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
