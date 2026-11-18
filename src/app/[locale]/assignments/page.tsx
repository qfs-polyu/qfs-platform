import {getTranslations, setRequestLocale} from 'next-intl/server';

export default async function AssignmentsPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('assignments');
  const tc = await getTranslations('common');

  const columns = [
    {title: t('colSubmit'), desc: t('colSubmitDesc')},
    {title: t('colJudge'), desc: t('colJudgeDesc')},
    {title: t('colWrong'), desc: t('colWrongDesc')}
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-3xl text-sm text-navy/70">{t('subtitle')}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {columns.map((col) => (
          <div
            key={col.title}
            className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm"
          >
            <h2 className="font-semibold text-navy">{col.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy/65">
              {col.desc}
            </p>
            <span className="mt-4 inline-block rounded-full bg-navy/5 px-3 py-1 text-xs text-navy/50">
              {tc('comingM1')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
