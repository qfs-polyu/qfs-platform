import {useTranslations} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {LEVELS} from '@/content/curriculum';

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tc = await getTranslations('common');

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="rounded-2xl bg-navy px-6 py-12 text-white md:px-10 md:py-16">
        <p className="mb-3 text-sm font-medium tracking-wide text-accent">
          {t('heroTag')}
        </p>
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">
          {t('heroTitle')}
        </h1>
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/60">
            {t('ctaAssess')} · {tc('comingM1')}
          </span>
          <Link
            href="/learn"
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent/90"
          >
            {t('ctaMap')}
          </Link>
        </div>
      </section>

      {/* Learning map */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{t('mapTitle')}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LEVELS.map((level) => (
            <div
              key={level.id}
              className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm transition hover:border-accent/60 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-accent-soft px-3 py-1 text-sm font-bold text-accent">
                  {level.id}
                </span>
                <span className="text-xs text-navy/40">{tc('skeleton')}</span>
              </div>
              <h3 className="mt-3 font-semibold text-navy">{level.topic}</h3>
              <dl className="mt-3 space-y-1.5 text-xs text-navy/60">
                <div className="flex gap-2">
                  <dt className="shrink-0 font-medium text-navy/75">
                    {t('carrierLabel')}:
                  </dt>
                  <dd>{level.carrier}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="shrink-0 font-medium text-navy/75">
                    {t('gateLabel')}:
                  </dt>
                  <dd>{level.gate}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* Progress + assessment placeholders */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-dashed border-navy/25 bg-surface p-6">
          <h2 className="font-semibold">{t('progressTitle')}</h2>
          <div className="mt-3 flex items-center gap-2 text-sm text-navy/50">
            <span className="rounded bg-navy/5 px-2 py-0.5 text-xs">
              {tc('comingM1')}
            </span>
            {t('progressNote')}
          </div>
        </div>
        <div className="rounded-xl border border-dashed border-navy/25 bg-surface p-6">
          <h2 className="font-semibold">{t('assessTitle')}</h2>
          <p className="mt-3 text-sm text-navy/60">{t('assessBody')}</p>
          <span className="mt-3 inline-block rounded-full bg-navy/5 px-3 py-1 text-xs text-navy/50">
            {t('assessCta')}
          </span>
        </div>
      </section>
    </div>
  );
}
