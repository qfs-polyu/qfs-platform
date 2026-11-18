import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

export default async function LearnPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('learn');

  const tracks = [
    {
      href: '/learn/trading',
      title: 'Trading',
      desc: t('tradingDesc'),
      badge: '5 stages'
    },
    {
      href: '/learn/research',
      title: 'Research',
      desc: t('researchDesc'),
      badge: '5 layers'
    },
    {
      href: '/learn/code',
      title: 'Coding',
      desc: t('codeDesc'),
      badge: '8 lessons'
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-3xl text-sm text-navy/70">{t('subtitle')}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {tracks.map((track) => (
          <Link
            key={track.href}
            href={track.href}
            className="group rounded-xl border border-navy/10 bg-white p-6 shadow-sm transition hover:border-accent/60 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy group-hover:text-accent">
                {track.title}
              </h2>
              <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
                {track.badge}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-navy/65">
              {track.desc}
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-accent">
              {t('open')} →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
