import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';

export default async function MarketBasicsPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('basics');
  const tt = await getTranslations('trading');

  const items = [
    {href: '/learn/trading/foundations', label: tt('openFoundations'), desc: t('descFoundations')},
    {href: '/learn/trading/candles', label: tt('openCandles'), desc: t('descCandles')},
    {href: '/learn/trading/indicators', label: tt('openIndicators'), desc: t('descIndicators')},
    {href: '/learn/trading/quotes', label: tt('openQuotes'), desc: t('descQuotes')}
  ];

  return (
    <div>
      <Link href="/learn/trading" className="text-sm text-accent hover:underline">
        ← {tt('title')}
      </Link>
      <h1 className="mt-3 text-2xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-3xl text-sm text-navy/70">{t('subtitle')}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((it, i) => (
          <Link
            key={it.href}
            href={it.href}
            className="group rounded-xl border border-navy/10 bg-white p-6 shadow-sm transition hover:border-accent/60 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                {i + 1}
              </span>
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                Live
              </span>
            </div>
            <h2 className="mt-3 text-lg font-bold text-navy group-hover:text-accent">
              {it.label}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-navy/65">{it.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
