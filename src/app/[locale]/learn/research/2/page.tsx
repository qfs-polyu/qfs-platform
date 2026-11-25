import {setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import ResearchMathCourse from '@/components/research/ResearchMathCourse';

export default async function ResearchMathPage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const zh = locale === 'zh';

  return (
    <div>
      <Link href="/learn/research" className="text-sm text-accent hover:underline">
        ← {zh ? '返回 Research 子版块' : 'Back to Research Track'}
      </Link>
      <div className="mt-4 max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">
          {zh ? '第二层 · L4' : 'Layer 2 · L4'}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-navy">
          {zh ? '数学与金融先修：从手算到因子诊断' : 'Math & Finance Prerequisites: From Hand Calculation to Factor Diagnostics'}
        </h1>
        <p className="mt-3 text-sm leading-7 text-navy/70">
          {zh
            ? '承接代码课的收益率与样本标准差，用可手算的小数据建立统计直觉，再进入 Rank IC、ICIR 与多空组合。每个小节都有即时反馈；最后的四股票挑战要求你同时计算、解释并质疑结果。'
            : 'Build on the coding lessons’ returns and sample standard deviation. Hand-sized datasets develop statistical intuition before rank IC, ICIR and long–short portfolios. Every section gives immediate feedback; the final four-stock challenge asks you to calculate, interpret and question the result.'}
        </p>
      </div>
      <ResearchMathCourse />
    </div>
  );
}
