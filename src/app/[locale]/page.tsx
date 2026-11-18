import {useTranslations} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
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
          <a
            href="#learning-map"
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-accent/90"
          >
            {t('ctaMap')}
          </a>
        </div>
      </section>

      {/* Learning map — a single L0→L5 path across the three tracks */}
      <section id="learning-map" className="scroll-mt-20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{t('mapTitle')}</h2>
        </div>
        <ol className="relative ml-4 space-y-7 border-l-2 border-navy/15 pl-10">
          {LEVELS.map((level) => (
            <li key={level.id} className="relative">
              <span
                className={`absolute -left-[58px] top-0 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${
                  level.track === 'trading'
                    ? 'bg-navy'
                    : level.track === 'coding'
                      ? 'bg-accent'
                      : 'bg-track-research'
                }`}
              >
                {level.id}
              </span>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="font-semibold text-navy">{level.topic}</h3>
                <span className="rounded-full bg-navy/5 px-2.5 py-0.5 text-xs font-medium text-navy/60">
                  {level.track === 'trading'
                    ? 'Trading'
                    : level.track === 'coding'
                      ? 'Coding'
                      : 'Research'}
                </span>
              </div>
              <p className="mt-1 text-sm text-navy/60">
                {t('gateLabel')}：{level.gate}
              </p>
            </li>
          ))}
        </ol>
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
