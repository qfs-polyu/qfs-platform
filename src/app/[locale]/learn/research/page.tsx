import {getTranslations, setRequestLocale} from 'next-intl/server';
import {RESEARCH_LAYERS} from '@/content/curriculum';
import TrackProgressBar from '@/components/tracks/TrackProgressBar';

export default async function ResearchPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('research');
  const tl = await getTranslations('learn');

  return (
    <div>
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-3xl text-sm text-navy/70">{t('subtitle')}</p>
      <div className="mt-8 space-y-4">
        {RESEARCH_LAYERS.map((layer) => (
          <div
            key={layer.n}
            className="flex gap-5 rounded-xl border border-navy/10 bg-white p-5 shadow-sm"
          >
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-navy text-white">
              <span className="text-[10px] leading-none opacity-70">
                {tl('layerLabel')}
              </span>
              <span className="text-lg font-bold leading-none">{layer.n}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-navy">{layer.title}</h2>
                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
                  {layer.level}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-navy/65">{layer.blurb}</p>
            </div>
          </div>
        ))}
      </div>
      <TrackProgressBar track="research" />
    </div>
  );
}
