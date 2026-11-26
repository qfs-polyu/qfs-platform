import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import ResearchElectiveCourse from '@/components/research/ResearchElectiveCourse';
import {getResearchElective, RESEARCH_ELECTIVES} from '@/content/research-electives';

export function generateStaticParams() {
  return RESEARCH_ELECTIVES.map((course) => ({n: String(course.n)}));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string; n: string}>;
}): Promise<Metadata> {
  const {locale, n} = await params;
  const course = getResearchElective(Number(n));
  if (!course) return {};
  return {title: locale === 'zh' ? course.title.zh : course.title.en};
}

export default async function ResearchElectivePage({
  params,
}: {
  params: Promise<{locale: string; n: string}>;
}) {
  const {locale, n} = await params;
  setRequestLocale(locale);
  const course = getResearchElective(Number(n));
  if (!course) notFound();
  const zh = locale === 'zh';

  return (
    <div>
      <Link href="/learn/research" className="inline-flex min-h-11 items-center text-sm text-accent hover:underline">
        ← {zh ? '返回 Research 子版块' : 'Back to Research Track'}
      </Link>
      <div className="mt-4 max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          {zh ? `第 ${course.n} 层 · ${course.level}` : `Layer ${course.n} · ${course.level}`}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-navy">{zh ? course.title.zh : course.title.en}</h1>
        <p className="mt-3 max-w-[75ch] text-sm leading-7 text-navy/70 sm:text-base">
          {zh ? course.intro.zh : course.intro.en}
        </p>
      </div>
      <ResearchElectiveCourse key={locale} course={course} />
    </div>
  );
}
