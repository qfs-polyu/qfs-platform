import {Suspense} from 'react';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {LEVELS, levelUnits} from '@/content/curriculum';
import L1Badge from '@/components/home/L1Badge';

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
          <Link
            href="/assessment"
            className="rounded-full border border-white/30 px-5 py-2 text-sm font-medium text-white transition hover:border-white/60"
          >
            {t('ctaAssess')}
          </Link>
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
          <p className="mt-1 text-xs text-navy/45">{t('mapLegend')}</p>
        </div>
        <ol className="relative ml-4 space-y-7 border-l-2 border-navy/15 pl-10">
          {LEVELS.map((level) => {
            const units = levelUnits(level.id);
            return (
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
                <details className="group">
                  <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="font-semibold text-navy">{level.topic}</h3>
                      <span className="rounded-full bg-navy/5 px-2.5 py-0.5 text-xs font-medium text-navy/60">
                        {units.length} {t('unitLabel')}
                      </span>
                      <span className="text-xs text-navy/35 group-open:hidden">▾</span>
                    </div>
                    <p className="mt-1 text-sm text-navy/60">
                      {t('gateLabel')}
                      {level.gate}
                      {level.id === 'L1' && (
                        <Suspense fallback={null}>
                          <L1Badge />
                        </Suspense>
                      )}
                    </p>
                  </summary>
                  <ul className="mt-3 space-y-1.5">
                    {units.map((u) => (
                      <li key={`${u.track}-${u.n}`} className="flex flex-wrap items-center gap-2 text-sm">
                        <span
                          className={`w-1.5 self-stretch rounded ${u.track === 'trading' ? 'bg-navy' : u.track === 'coding' ? 'bg-accent' : 'bg-track-research'}`}
                        />
                        <Link href={u.href} className="text-navy/80 hover:text-accent hover:underline">
                          {u.kind === 'stage' ? 'Stage' : u.kind === 'layer' ? 'Layer' : 'Lesson'}{' '}
                          {u.n}: {u.title}
                        </Link>
                        {u.extension && (
                          <span className="rounded bg-navy/5 px-1.5 py-0.5 text-xs text-navy/50">
                            ext
                          </span>
                        )}
                        {u.live && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Live
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Assessment */}
      <section>
        <div className="rounded-xl border border-dashed border-navy/25 bg-surface p-6 md:max-w-xl">
          <h2 className="font-semibold">{t('assessTitle')}</h2>
          <p className="mt-3 text-sm text-navy/60">{t('assessBody')}</p>
          <Link
            href="/assessment"
            className="mt-3 inline-block rounded-full bg-navy px-4 py-1.5 text-sm font-medium text-white transition hover:bg-navy/90"
          >
            {t('assessCta')}
          </Link>
        </div>
      </section>
    </div>
  );
}
