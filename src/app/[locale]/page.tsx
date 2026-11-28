import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import LearningMap from '@/components/home/LearningMap';

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

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
        <h2 className="text-2xl font-bold">{t('mapTitle')}</h2>
        <div className="mt-6">
          <LearningMap />
        </div>
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
