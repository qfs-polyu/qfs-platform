import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {RESEARCH_LAYERS} from '@/content/curriculum';
import {getResearchElective} from '@/content/research-electives';
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
      <Link href="/learn" className="mt-2 inline-block text-sm text-accent hover:underline">
        ← {t('backToLearn')}
      </Link>
      <p className="mt-2 max-w-3xl text-sm text-navy/70">{t('subtitle')}</p>
      <div className="mt-8 space-y-4">
        {RESEARCH_LAYERS.map((layer) => {
          const zh = locale === 'zh';
          const elective = getResearchElective(layer.n);
          const title = layer.n === 2
            ? zh ? '数学与金融先修' : 'Math & Finance Prerequisites'
            : elective ? zh ? elective.title.zh : elective.title.en : layer.title;
          const blurb = layer.n === 2
            ? zh ? '通过手算与即时自测掌握收益、统计、相关、回归、Rank IC 与 ICIR。' : 'Hand calculations and self-checks for returns, statistics, correlation, regression, Rank IC and ICIR.'
            : elective ? zh ? elective.intro.zh : elective.intro.en : layer.blurb;
          return (
            <div
              key={layer.n}
              className="flex gap-4 rounded-xl border border-navy/10 bg-white p-5 shadow-sm sm:gap-5"
            >
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-navy text-white">
                <span className="text-[10px] leading-none opacity-70">{tl('layerLabel')}</span>
                <span className="text-lg font-bold leading-none">{layer.n}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-navy">{title}</h2>
                  <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">{layer.level}</span>
                </div>
                <p className="mt-1.5 max-w-[75ch] text-sm leading-6 text-navy/65">{blurb}</p>
                <Link
                  href={`/learn/research/${layer.n}`}
                  className="mt-3 inline-flex min-h-11 items-center rounded-full bg-accent px-4 py-2 text-xs font-medium text-white transition hover:bg-accent/90"
                >
                  {zh ? `开始第 ${layer.n} 层 →` : `Start Layer ${layer.n} →`}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      <TrackProgressBar track="research" />
    </div>
  );
}
