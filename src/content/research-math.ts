export type LocalText = {en: string; zh: string};

export type ResearchQuestion = {
  id: string;
  prompt: LocalText;
  kind: 'choice' | 'number';
  options?: LocalText[];
  answer: number;
  tolerance?: number;
  explanation: LocalText;
};

export type ResearchSection = {
  id: string;
  title: LocalText;
  eyebrow: LocalText;
  body: LocalText[];
  formula: string;
  worked: LocalText[];
  table?: {headers: LocalText[]; rows: string[][]};
  visual?: 'correlation' | 'ic';
  questions: ResearchQuestion[];
};

export const RESEARCH_MATH_SECTIONS: ResearchSection[] = [
  {
    id: 'returns',
    eyebrow: {en: 'Finance tool 1', zh: '金融工具 1'},
    title: {en: 'Simple returns & long–short portfolios', zh: '简单收益率与多空组合'},
    body: [
      {
        en: 'A simple return scales the price change by the starting price. Use decimals in calculations: 0.08 means 8%. Prices must be consistent — adjusted with adjusted, raw with raw.',
        zh: '简单收益率用起始价格衡量价格变化。计算统一使用小数：0.08 表示 8%。价格口径必须一致——复权价配复权价，原始价配原始价。',
      },
      {
        en: 'A dollar-neutral long–short teaching portfolio buys the high-signal group and shorts the low-signal group. Its return is the average long return minus the average short return. Shorting has borrowing, margin and loss risks; this arithmetic does not imply that every student can or should short in a real account.',
        zh: '教学中资金中性多空组合买入高信号组、卖空低信号组，其收益等于多头组平均收益减空头组平均收益。卖空涉及借券、保证金和亏损风险；这里的算术不表示每位学生都能在真实账户中卖空，也不构成交易建议。',
      },
    ],
    formula: 'r = P₁ / P₀ − 1     |     long–short = mean(top group) − mean(bottom group)',
    worked: [
      {en: '100 → 108 gives r = 108 / 100 − 1 = 0.08.', zh: '100 → 108，因此 r = 108 / 100 − 1 = 0.08。'},
      {en: 'If the top two earn 8% and 3%, while the bottom two earn −2% and −4%, long–short = 5.5% − (−3%) = 8.5% before costs.', zh: '若前两名收益为 8%、3%，后两名为 −2%、−4%，成本前多空收益 = 5.5% − (−3%) = 8.5%。'},
    ],
    questions: [
      {
        id: 'return-80-86',
        prompt: {en: 'A price rises from 80 to 86. What is its decimal return?', zh: '价格从 80 涨到 86，小数收益率是多少？'},
        kind: 'number',
        answer: 0.075,
        tolerance: 0.000001,
        explanation: {en: '(86 − 80) / 80 = 6 / 80 = 0.075, which means 7.5%.', zh: '(86 − 80) / 80 = 6 / 80 = 0.075，即 7.5%。'},
      },
    ],
  },
  {
    id: 'spread',
    eyebrow: {en: 'Math tool 1', zh: '数学工具 1'},
    title: {en: 'Mean, sample variance & standard deviation', zh: '均值、样本方差与标准差'},
    body: [
      {
        en: 'The mean describes the centre; variance describes squared spread around that centre. Standard deviation is the square root of variance, returning to the original return units.',
        zh: '均值描述数据中心；方差描述数据相对中心的平方离散程度。标准差是方差的平方根，因此回到原来的收益率单位。',
      },
      {
        en: 'For a sample we divide squared deviations by n−1 (Bessel’s correction), not n. This course uses sample standard deviation consistently. With only a handful of observations, every statistic is unstable.',
        zh: '样本方差把偏差平方和除以 n−1（贝塞尔校正），不是 n。本课程统一使用样本标准差。只有少量观测时，任何统计量都很不稳定。',
      },
    ],
    formula: 'mean = Σrᵢ / n     |     s² = Σ(rᵢ − mean)² / (n−1)     |     s = √s²',
    worked: [
      {en: 'For [0.02, −0.01, 0.03], mean = 0.013333…; sample variance ≈ 0.0004333 and sample standard deviation ≈ 0.0208.', zh: '对 [0.02, −0.01, 0.03]，均值 = 0.013333…；样本方差约 0.0004333，样本标准差约 0.0208。'},
    ],
    questions: [
      {
        id: 'sample-denominator',
        prompt: {en: 'You have 5 sample observations. Which denominator gives the sample variance?', zh: '有 5 个样本观测，样本方差应除以什么？'},
        kind: 'choice',
        options: [{en: '5', zh: '5'}, {en: '4', zh: '4'}, {en: '6', zh: '6'}],
        answer: 1,
        explanation: {en: 'Sample variance divides by n−1 = 4. Dividing by n=5 gives the population-form variance instead.', zh: '样本方差除以 n−1 = 4。若除以 n=5，得到的是总体形式方差。'},
      },
    ],
  },
  {
    id: 'correlation',
    eyebrow: {en: 'Math tool 2', zh: '数学工具 2'},
    title: {en: 'Correlation: co-movement, not causation', zh: '相关性：共同变化，不等于因果'},
    body: [
      {
        en: 'Pearson correlation standardizes covariance into [−1, 1]. +1 is a perfect upward straight-line relationship, −1 a perfect downward one, and 0 means no LINEAR relationship — a curved relationship can still exist.',
        zh: '皮尔逊相关把协方差标准化到 [−1, 1]。+1 是完美向上的直线关系，−1 是完美向下的直线关系；0 只表示没有线性关系，曲线关系仍可能存在。',
      },
      {
        en: 'Two series can move together because one drives the other, both respond to a third variable, or by chance. A research claim needs an economic mechanism and out-of-sample evidence, not correlation alone.',
        zh: '两条序列共同变化，可能是一个驱动另一个、两者共同受第三个变量影响，也可能只是巧合。研究结论需要经济机制和样本外证据，不能只靠相关性。',
      },
    ],
    formula: 'corr(x,y) = cov(x,y) / (sₓ sᵧ)     |     −1 ≤ corr ≤ 1',
    worked: [
      {en: 'x=[1,2,3], y=[2,4,6] gives +1. x=[1,2,3], y=[6,4,2] gives −1.', zh: 'x=[1,2,3]、y=[2,4,6] 时相关为 +1；若 y=[6,4,2]，相关为 −1。'},
    ],
    visual: 'correlation',
    questions: [
      {
        id: 'negative-correlation',
        prompt: {en: 'x=[1,2,3] and y=[6,4,2]. What is their Pearson correlation?', zh: 'x=[1,2,3]，y=[6,4,2]，皮尔逊相关系数是多少？'},
        kind: 'choice',
        options: [{en: '+1', zh: '+1'}, {en: '0', zh: '0'}, {en: '−1', zh: '−1'}],
        answer: 2,
        explanation: {en: 'Every one-unit increase in x accompanies an exact two-unit decrease in y: a perfect negative linear relationship.', zh: 'x 每增加 1，y 都精确减少 2，因此是完美负线性关系。'},
      },
    ],
  },
  {
    id: 'regression',
    eyebrow: {en: 'Math tool 3', zh: '数学工具 3'},
    title: {en: 'Regression: slope, intercept & residuals', zh: '回归：斜率、截距与残差'},
    body: [
      {
        en: 'A simple linear regression fits y = a + bx. Slope b says how much y changes per one-unit increase in x in the fitted sample; intercept a is the fitted y when x=0. Residual = actual y − fitted y.',
        zh: '一元线性回归拟合 y = a + bx。斜率 b 表示样本中 x 每增加 1 单位，拟合的 y 改变多少；截距 a 是 x=0 时的拟合值。残差 = 实际 y − 拟合 y。',
      },
      {
        en: 'Slope and correlation are related but not interchangeable: correlation is unitless; slope keeps y/x units. A fitted line describes association and does not by itself prove prediction or causality.',
        zh: '斜率与相关性有关，但不能互换：相关系数没有单位，斜率保留 y/x 的单位。拟合直线描述关联，本身不证明预测能力或因果。',
      },
    ],
    formula: 'b = Σ(xᵢ−x̄)(yᵢ−ȳ) / Σ(xᵢ−x̄)²     |     a = ȳ − b x̄',
    worked: [
      {en: 'For x=[0,1,2], y=[1,3,5], the slope is 2 and intercept is 1: fitted y = 1 + 2x.', zh: '对 x=[0,1,2]、y=[1,3,5]，斜率为 2、截距为 1：拟合 y = 1 + 2x。'},
    ],
    questions: [
      {
        id: 'regression-slope',
        prompt: {en: 'For x=[0,1,2], y=[2,2,4], calculate the least-squares slope.', zh: '对 x=[0,1,2]、y=[2,2,4]，计算最小二乘斜率。'},
        kind: 'number',
        answer: 1,
        tolerance: 0.000001,
        explanation: {en: 'x̄=1 and ȳ=8/3. Numerator = 2 and denominator = 2, so slope = 1. The intercept would be 5/3.', zh: 'x̄=1，ȳ=8/3。分子为 2，分母为 2，所以斜率 = 1；截距为 5/3。'},
      },
    ],
  },
  {
    id: 'rank-ic',
    eyebrow: {en: 'Research metric 1', zh: '研究指标 1'},
    title: {en: 'Rank IC: did the signal order future returns?', zh: 'Rank IC：信号是否排对了未来收益？'},
    body: [
      {
        en: 'At each date, rank the cross-section of signals known at that time and rank their SUBSEQUENT returns over a declared horizon. Spearman rank IC is the Pearson correlation of those two rank vectors. No ties: rank 1,2,3…; with ties, use average ranks.',
        zh: '在每个日期，对当时已知的横截面信号排序，再对声明期限内的随后收益排序。Spearman Rank IC 就是两组排名的皮尔逊相关。没有并列时排名为 1、2、3…；有并列时使用平均排名。',
      },
      {
        en: 'IC near +1 means higher signals tended to precede higher returns; near −1 means the ordering reversed; near 0 means little monotonic ranking relationship. Using same-period instead of forward returns can introduce look-ahead bias.',
        zh: 'IC 接近 +1 表示高信号倾向对应更高未来收益；接近 −1 表示顺序反转；接近 0 表示单调排序关系很弱。若误用同期收益而非未来收益，可能引入前视偏差。',
      },
    ],
    formula: 'ICₜ = SpearmanCorr(rank(signalₜ), rank(returnₜ→ₜ₊ₕ))',
    worked: [
      {en: 'Signals [4,3,2,1] and forward returns [0.04,0.02,−0.01,−0.03] have identical descending ranks, so IC = +1.', zh: '信号 [4,3,2,1] 与未来收益 [0.04,0.02,−0.01,−0.03] 的降序排名完全相同，因此 IC = +1。'},
    ],
    visual: 'ic',
    questions: [
      {
        id: 'reverse-ic',
        prompt: {en: 'If the forward-return order is exactly reversed while the signal order stays unchanged, what is the rank IC?', zh: '若信号顺序不变，而未来收益顺序完全反转，Rank IC 是多少？'},
        kind: 'choice',
        options: [{en: '+1', zh: '+1'}, {en: '0', zh: '0'}, {en: '−1', zh: '−1'}],
        answer: 2,
        explanation: {en: 'Perfectly opposite ranks give Spearman correlation −1. That may still be informative — the sign tells you the direction.', zh: '完全相反的排名使 Spearman 相关为 −1。这也可能有信息——符号告诉你方向。'},
      },
    ],
  },
  {
    id: 'icir',
    eyebrow: {en: 'Research metric 2', zh: '研究指标 2'},
    title: {en: 'ICIR: average ranking skill relative to instability', zh: 'ICIR：平均排序能力相对不稳定性'},
    body: [
      {
        en: 'Compute one IC per date, then summarize that TIME SERIES. Here ICIR means mean(IC) divided by SAMPLE standard deviation of IC. It is not the same as a portfolio’s active-return information ratio.',
        zh: '先逐日期计算 IC，再汇总这条时间序列。本课 ICIR 指 IC 均值除以 IC 的样本标准差。它与组合主动收益的信息比率不是同一个指标。',
      },
      {
        en: 'A higher positive ICIR suggests more consistent positive ranking skill in the observed sample. It does not include transaction costs, capacity, turnover or portfolio construction. Do not annualize this teaching ICIR unless the report explicitly defines an annualization convention.',
        zh: '观测样本中更高的正 ICIR 表示正向排序能力更稳定，但它不包含交易成本、容量、换手率或组合构建。除非报告明确给出年化约定，否则不要对本课 ICIR 年化。',
      },
    ],
    formula: 'ICIR = mean(ICₜ) / sample_std(ICₜ)     |     sample_std uses n−1',
    worked: [
      {en: 'For IC=[0.10,0.05,−0.05], mean=0.033333…, sample std≈0.076376, so ICIR≈0.4364.', zh: '对 IC=[0.10,0.05,−0.05]，均值=0.033333…，样本标准差约 0.076376，因此 ICIR 约 0.4364。'},
    ],
    questions: [
      {
        id: 'icir-one',
        prompt: {en: 'For IC=[0.08,0.04,0.00], calculate ICIR using sample standard deviation.', zh: '对 IC=[0.08,0.04,0.00]，用样本标准差计算 ICIR。'},
        kind: 'number',
        answer: 1,
        tolerance: 0.000001,
        explanation: {en: 'Mean = 0.04 and sample standard deviation = 0.04, so ICIR = 1. Three observations are only a teaching example, not strong evidence.', zh: '均值为 0.04，样本标准差也为 0.04，所以 ICIR = 1。三个观测只是教学示例，不是强证据。'},
      },
    ],
  },
  {
    id: 'challenge',
    eyebrow: {en: 'Integrated challenge', zh: '综合挑战'},
    title: {en: 'One signal: rank IC, long–short & honest interpretation', zh: '一个信号：Rank IC、多空收益与严谨解释'},
    body: [
      {
        en: 'Four stocks have the signal and NEXT-period returns below. For rank IC, use descending ranks: largest value gets rank 1. There are no ties. For the long–short calculation, buy the top two signals and short the bottom two, equally weighted within each side.',
        zh: '下表是四只股票的信号与下一期收益。Rank IC 使用降序排名：最大值排名 1，没有并列。多空计算中，等权买入信号最高两只、卖空最低两只。',
      },
      {
        en: 'Work with paper first. Your tasks are rank IC (decimal), long–short return (decimal), and the strongest conclusion supported by this one tiny cross-section.',
        zh: '建议先在纸上计算。需要回答 Rank IC（小数）、多空收益（小数），以及这一份极小横截面真正支持什么结论。',
      },
    ],
    formula: 'rank IC = corr(signal ranks, forward-return ranks)     |     L–S = mean(top 2) − mean(bottom 2)',
    worked: [
      {en: 'No worked numeric answer here — this is your integrated check. The check button gives line-by-line feedback.', zh: '这里不提前给出数值答案——这是你的综合验收。点击检查后会出现逐项解析。'},
    ],
    table: {
      headers: [{en: 'Stock', zh: '股票'}, {en: 'Signal', zh: '信号'}, {en: 'Forward return', zh: '未来收益'}],
      rows: [['A', '4', '0.05'], ['B', '3', '0.01'], ['C', '2', '0.02'], ['D', '1', '−0.03']],
    },
    questions: [
      {
        id: 'challenge-ic',
        prompt: {en: '1. Calculate Spearman rank IC.', zh: '1. 计算 Spearman Rank IC。'},
        kind: 'number',
        answer: 0.8,
        tolerance: 0.000001,
        explanation: {en: 'Descending signal ranks are [1,2,3,4]; return ranks are [1,3,2,4]. Their Pearson correlation is 0.8.', zh: '信号的降序排名为 [1,2,3,4]；收益排名为 [1,3,2,4]。两者的皮尔逊相关为 0.8。'},
      },
      {
        id: 'challenge-ls',
        prompt: {en: '2. Calculate the equal-weight top-two-minus-bottom-two return before costs.', zh: '2. 计算成本前、组内等权的“前两名减后两名”收益。'},
        kind: 'number',
        answer: 0.035,
        tolerance: 0.000001,
        explanation: {en: 'Long mean = (0.05+0.01)/2 = 0.03. Short-side mean = (0.02−0.03)/2 = −0.005. Long–short = 0.03−(−0.005)=0.035.', zh: '多头均值 = (0.05+0.01)/2 = 0.03；空头侧均值 = (0.02−0.03)/2 = −0.005。多空 = 0.03−(−0.005)=0.035。'},
      },
      {
        id: 'challenge-interpretation',
        prompt: {en: '3. Which interpretation is justified?', zh: '3. 哪种解释是成立的？'},
        kind: 'choice',
        options: [
          {en: 'IC=0.8 guarantees an 8% future portfolio return.', zh: 'IC=0.8 保证未来组合收益为 8%。'},
          {en: 'This sample shows positive ranking alignment, but robustness, costs and out-of-sample performance remain unproven.', zh: '本样本显示正向排序一致性，但稳健性、成本和样本外表现仍未得到证明。'},
          {en: 'Positive long–short return proves the signal causes returns.', zh: '正的多空收益证明该信号导致收益。'},
        ],
        answer: 1,
        explanation: {en: 'One cross-section cannot establish stability, causality or investability. The result is a hypothesis to test on more dates and unseen data, with costs included.', zh: '一个横截面不能证明稳定性、因果或可投资性。它只是待检验假设：需要更多日期、未见过数据，并计入成本。'},
      },
    ],
  },
];

export const RESEARCH_MATH_SOURCES = [
  {
    label: 'pandas User Guide — indexing, groupby, rolling and merge',
    url: 'https://pandas.pydata.org/pandas-docs/stable/user_guide/index.html',
  },
  {
    label: 'backtesting.py — Quick Start User Guide',
    url: 'https://kernc.github.io/backtesting.py/doc/examples/Quick%20Start%20User%20Guide.html',
  },
  {
    label: 'QuantConnect — Live Trading Reconciliation (look-ahead bias)',
    url: 'https://www.quantconnect.com/docs/v2/writing-algorithms/live-trading/reconciliation',
  },
  {
    label: 'QuantConnect — Factor Investing (rank IC and long–short teaching example)',
    url: 'https://www.quantconnect.com/forum/discussion/9768/factor-investing-in-quantconnect-research-notebook-amp-backtesting-algorithm/',
  },
];
