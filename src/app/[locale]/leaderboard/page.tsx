import {getTranslations, setRequestLocale} from 'next-intl/server';

export default async function LeaderboardPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('leaderboard');
  const tc = await getTranslations('common');

  return (
    <div>
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-3xl text-sm text-navy/70">{t('subtitle')}</p>
      <div className="mt-8 rounded-xl border border-dashed border-navy/25 bg-surface p-10 text-center">
        <p className="text-sm text-navy/60">{t('m2Note')}</p>
        <span className="mt-3 inline-block rounded-full bg-navy/5 px-3 py-1 text-xs text-navy/50">
          {tc('comingM2')}
        </span>
      </div>
    </div>
  );
}
