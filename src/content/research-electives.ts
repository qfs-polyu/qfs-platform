import type {LocalText, ResearchQuestion} from './research-math';

export type ResearchCodeStep = {
  task: LocalText;
  starter: string;
  solution: string;
  expected: string;
  hint: LocalText;
};

export type ResearchElectiveSection = {
  id: string;
  title: LocalText;
  body: LocalText[];
  formula?: string;
  bullets?: LocalText[];
  visual?: 'scatter' | 'pipeline';
  code?: ResearchCodeStep;
  question: ResearchQuestion;
};

export type ResearchElectiveCourse = {
  n: number;
  level: string;
  title: LocalText;
  intro: LocalText;
  outcome: LocalText;
  sections: ResearchElectiveSection[];
  sources: {label: string; url: string}[];
};

const choice = (
  id: string,
  prompt: LocalText,
  options: LocalText[],
  answer: number,
  explanation: LocalText,
): ResearchQuestion => ({id, prompt, kind: 'choice', options, answer, explanation});

const number = (
  id: string,
  prompt: LocalText,
  answer: number,
  explanation: LocalText,
  tolerance = 0.0001,
): ResearchQuestion => ({id, prompt, kind: 'number', answer, tolerance, explanation});

const MOMENTUM_PRICES = `prices = {
    "A": (100, 120, 132),
    "B": (100, 110, 115.5),
    "C": (100, 105, 103.95),
    "D": (100, 100, 101),
    "E": (100, 90, 93.6),
    "F": (100, 80, 76),
}`;

export const RESEARCH_ELECTIVES: ResearchElectiveCourse[] = [
  {
    n: 1,
    level: 'L4 entry',
    title: {en: 'What Is Factor Mining?', zh: '因子挖掘是什么？'},
    intro: {
      en: 'Start with a picture, not a formula. Sort stocks by a signal that is known today, compare what happens next, and turn the pattern into a research question that can be tested rather than a story that merely sounds plausible.',
      zh: '先从图形而不是公式开始。用今天已知的信号给股票排序，比较随后发生的收益，再把看到的模式变成可检验的研究问题，而不是只讲一个听起来合理的故事。',
    },
    outcome: {
      en: 'Outcome: explain a factor, form groups without look-ahead, and describe the full research pipeline.',
      zh: '学习产出：能解释因子、避免用未来数据分组，并说清楚完整的量化研究流程。',
    },
    sections: [
      {
        id: 'factor-picture',
        title: {en: 'A factor is an input, not a guaranteed answer', zh: '因子是输入，不是保证正确的答案'},
        body: [
          {
            en: String.raw`A factor is a measurable characteristic used to compare assets. Here the characteristic is past return, also called momentum. The horizontal axis is known at formation time $t_1$; the vertical axis is the return earned only afterwards, from $t_1$ to $t_2$.`,
            zh: String.raw`因子是用来比较资产的可测量特征。这里的特征是过去收益，也称动量。横轴是在组合形成时 $t_1$ 已经知道的信息；纵轴是之后从 $t_1$ 到 $t_2$ 才获得的收益。`,
          },
          {
            en: 'Move the group-size slider. The orange stocks are the high-signal group, the navy stocks are the low-signal group, and the grey stocks are left out. Changing the grouping changes the evidence: there is no universal “best” group size.',
            zh: '移动分组人数滑块。橙色是高信号组，深蓝色是低信号组，灰色股票不进入多空组合。改变分组方式也会改变证据，因此不存在脱离样本与规则的“最佳”组宽。',
          },
        ],
        formula: String.raw`R_{LS}=\overline{R}_{\text{high}}-\overline{R}_{\text{low}}`,
        visual: 'scatter',
        question: number(
          'factor-picture-spread',
          {
            en: 'With two stocks in each group, what is the high-minus-low forward return? Enter a decimal.',
            zh: '每组选择两只股票时，高信号组减低信号组的未来收益是多少？请输入小数。',
          },
          0.08,
          {
            en: String.raw`The high group has $(0.10+0.05)/2=0.075$; the low group has $(0.04-0.05)/2=-0.005$. The spread is $0.075-(-0.005)=0.08$.`,
            zh: String.raw`高信号组平均收益为 $(0.10+0.05)/2=0.075$，低信号组为 $(0.04-0.05)/2=-0.005$，差值为 $0.075-(-0.005)=0.08$。`,
          },
        ),
      },
      {
        id: 'hypothesis',
        title: {en: 'Turn a pattern into a falsifiable hypothesis', zh: '把图形模式变成可证伪的假设'},
        body: [
          {
            en: '“Momentum works” is too vague to test. Specify the economic intuition, universe, signal window, formation time, holding period, portfolio rule and what result would count against the idea.',
            zh: '“动量有效”太笼统，无法直接检验。需要写清经济直觉、股票池、信号窗口、组合形成时间、持有期、组合规则，以及什么结果会反对这个想法。',
          },
          {
            en: String.raw`A testable teaching hypothesis is: among these six stocks, stocks with higher returns from $t_0$ to $t_1$ will have higher returns from $t_1$ to $t_2$. A negative or unstable spread would challenge the hypothesis; it would not be permission to silently change the rules until the chart looks attractive.`,
            zh: String.raw`一个可检验的教学假设是：在这六只股票中，$t_0$ 到 $t_1$ 收益越高的股票，$t_1$ 到 $t_2$ 的收益也越高。若差值为负或很不稳定，就会挑战这个假设；不能为了图形好看而悄悄修改规则。`,
          },
        ],
        visual: 'pipeline',
        question: choice(
          'factor-hypothesis',
          {en: 'Which statement is a falsifiable research hypothesis?', zh: '哪一句是可证伪的研究假设？'},
          [
            {en: 'Good stocks always go up.', zh: '好股票总会上涨。'},
            {en: 'In this defined sample, higher prior returns are associated with higher next-period returns.', zh: '在这个明确样本中，较高的过去收益与较高的下一期收益相关。'},
            {en: 'The best factor is whichever factor made the most money yesterday.', zh: '昨天最赚钱的因子就是最好的因子。'},
          ],
          1,
          {
            en: 'The second statement names the variables, sample and relationship. It can be supported or rejected by evidence.',
            zh: '第二句明确了变量、样本和关系，因此能够被数据支持或反驳。',
          },
        ),
      },
      {
        id: 'evidence',
        title: {en: 'Evidence is more than one attractive scatterplot', zh: '证据不只是一张好看的散点图'},
        body: [
          {
            en: String.raw`A group return describes a simple portfolio. Rank IC measures whether the ordering is informative: $\operatorname{IC}_t=\operatorname{corr}(\operatorname{rank}(f_{i,t}),\operatorname{rank}(r_{i,t+1}))$. They answer different questions, so a high IC does not automatically mean a profitable portfolio after costs.`,
            zh: String.raw`分组收益描述的是一个简单组合；Rank IC 衡量排序是否包含信息：$\operatorname{IC}_t=\operatorname{corr}(\operatorname{rank}(f_{i,t}),\operatorname{rank}(r_{i,t+1}))$。两者回答的问题不同，因此高 IC 不自动等于扣费后仍可盈利的组合。`,
          },
          {
            en: 'Before believing the pattern, add more dates, an untouched out-of-sample period, transaction costs, missing-data rules and a sensible universe. Record decisions before seeing the final result.',
            zh: '相信这个模式之前，还要加入更多日期、未参与调参的样本外区间、交易成本、缺失值规则和合理的股票池，并在看到最终结果前记录这些决定。',
          },
        ],
        formula: String.raw`R_{\text{net}}=R_{\text{gross}}-\text{turnover}\times\text{cost per unit traded}`,
        question: choice(
          'factor-evidence-bias',
          {
            en: 'A student ranks stocks using returns from $t_1$ to $t_2$, then claims the same stocks could have been bought at $t_1$. What is the main problem?',
            zh: '学生用 $t_1$ 到 $t_2$ 的收益给股票排序，却声称能在 $t_1$ 按同样名单买入。主要问题是什么？',
          },
          [
            {en: 'The sample has too few decimal places.', zh: '样本的小数位数太少。'},
            {en: 'Look-ahead bias: the formation rule uses information unavailable at $t_1$.', zh: '前视偏差：分组规则使用了 $t_1$ 时尚不可知的信息。'},
            {en: 'The returns should always be integers.', zh: '收益率应该始终取整数。'},
          ],
          1,
          {
            en: String.raw`At $t_1$, only information available at or before $t_1$ may determine the portfolio. The later return is the outcome, not an input.`,
            zh: String.raw`在 $t_1$ 时，只能用当时或更早可知的信息决定组合。之后的收益是待检验结果，不是输入。`,
          },
        ),
      },
      {
        id: 'pipeline',
        title: {en: 'The complete research pipeline', zh: '完整的量化研究流程'},
        body: [
          {
            en: 'A disciplined workflow makes a negative result useful too. Keep the hypothesis, data decisions, code, metrics and conclusion connected so another student can reproduce the work.',
            zh: '严谨流程能让负面结果也有价值。把假设、数据处理决定、代码、指标和结论连在一起，让另一位同学能够复现。',
          },
        ],
        bullets: [
          {en: '1. Hypothesis: economic intuition and a falsifiable prediction.', zh: '1. 假设：经济直觉与可证伪的预测。'},
          {en: '2. Data: point-in-time inputs, a defined universe and explicit cleaning rules.', zh: '2. 数据：符合时间点的输入、明确的股票池和清洗规则。'},
          {en: '3. Signal: compute the factor using only information available then.', zh: '3. 信号：只用当时已知的信息计算因子。'},
          {en: '4. Test: groups, IC, returns, risk and realistic costs.', zh: '4. 检验：分组、IC、收益、风险与真实成本。'},
          {en: '5. Decision: validate out of sample, discuss limitations, then reject, revise or continue.', zh: '5. 决策：样本外验证并讨论局限，再决定否定、修改或继续研究。'},
        ],
        question: choice(
          'factor-pipeline-order',
          {en: 'Which sequence is methodologically sound?', zh: '哪一套顺序在研究方法上是合理的？'},
          [
            {en: 'Choose the best chart → invent a story → hide failed variations.', zh: '挑最好看的图 → 编故事 → 隐藏失败版本。'},
            {en: 'Define the hypothesis and rules → test → examine robustness and costs → conclude with limitations.', zh: '定义假设与规则 → 检验 → 检查稳健性与成本 → 带局限地下结论。'},
            {en: 'Trade first → collect whatever data agrees → report only the profit.', zh: '先交易 → 收集支持观点的数据 → 只报告盈利。'},
          ],
          1,
          {
            en: 'Pre-specified rules and transparent validation reduce cherry-picking. A conclusion should include evidence that does not support the idea.',
            zh: '预先明确规则并透明验证可以减少挑结果；结论也应呈现不支持想法的证据。',
          },
        ),
      },
    ],
    sources: [
      {label: 'QuantConnect — Research deployment and look-ahead bias', url: 'https://www.quantconnect.com/docs/v2/cloud-platform/research/deployment'},
      {label: 'Kenneth R. French — Data Library', url: 'https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html'},
      {label: 'WorldQuant — What is an alpha? (IQC overview)', url: 'https://www.worldquant.com/brain/iqc/'},
    ],
  },
  {
    n: 3,
    level: 'L4',
    title: {en: 'A Classic Factor, End to End', zh: '经典因子的完整研究流程'},
    intro: {
      en: 'Build a momentum study in six guided steps. The six-stock dataset is deliberately small enough to verify by hand; the Python editor runs in your browser. This is a methodological lesson, not evidence that a six-stock strategy is investable.',
      zh: '用六个步骤完成一项动量研究。六只股票的小数据集便于手算核对，Python 编辑器直接在浏览器运行。本课训练研究方法，不代表六只股票策略具有可投资性。',
    },
    outcome: {
      en: 'Outcome: a reproducible mini report covering data, signal, groups, forward returns, Rank IC, drawdown, costs and out-of-sample interpretation.',
      zh: '学习产出：一份可复现的小型报告，覆盖数据、信号、分组、未来收益、Rank IC、回撤、成本和样本外解释。',
    },
    sections: [
      {
        id: 'momentum-data',
        title: {en: '1. Data and the time frontier', zh: '1. 数据与时间边界'},
        body: [
          {
            en: String.raw`Each stock has three adjusted teaching prices: $(P_0,P_1,P_2)$. At $t_1$ we may use $P_0$ and $P_1$ to form the signal. The later price $P_2$ is reserved for evaluating the decision. Adjusted prices must be used consistently.`,
            zh: String.raw`每只股票有三个教学用复权价格 $(P_0,P_1,P_2)$。在 $t_1$ 时，可以用 $P_0$ 和 $P_1$ 构造信号；$P_2$ 留作检验决策的结果。复权价格口径必须保持一致。`,
          },
        ],
        formula: String.raw`\text{Information at }t_1:\{P_0,P_1\}\qquad\text{Outcome after }t_1:P_2`,
        code: {
          task: {en: 'Print stock A’s latest price that is known at $t_1$.', zh: '输出股票 A 在 $t_1$ 时已知的最新价格。'},
          starter: String.raw`${MOMENTUM_PRICES}

stock = "A"
latest_known = # TODO: select the price known at t1
print(stock, latest_known)`,
          solution: String.raw`${MOMENTUM_PRICES}

stock = "A"
latest_known = prices[stock][1]
print(stock, latest_known)`,
          expected: 'A 120',
          hint: {en: 'The tuple order is $(P_0,P_1,P_2)$; Python indexes start at zero.', zh: '元组顺序是 $(P_0,P_1,P_2)$，Python 索引从零开始。'},
        },
        question: choice(
          'momentum-time-frontier',
          {en: 'Which value must not determine the portfolio formed at $t_1$?', zh: '在 $t_1$ 形成组合时，哪个值不能作为分组依据？'},
          [
            {en: '$P_0$', zh: '$P_0$'},
            {en: '$P_1$', zh: '$P_1$'},
            {en: '$P_2$', zh: '$P_2$'},
          ],
          2,
          {en: String.raw`$P_2$ belongs to the future evaluation window. Using it as an input creates look-ahead bias.`, zh: String.raw`$P_2$ 属于未来的检验窗口，把它作为输入会造成前视偏差。`},
        ),
      },
      {
        id: 'momentum-signal',
        title: {en: '2. Compute the momentum signal', zh: '2. 计算动量信号'},
        body: [
          {
            en: String.raw`For this compact lesson, momentum is the return from $t_0$ to $t_1$: $f_i=P_{i,1}/P_{i,0}-1$. Academic and production definitions often use longer formation windows and may skip the most recent month; always write down the exact convention.`,
            zh: String.raw`本课为便于手算，把动量定义为 $t_0$ 到 $t_1$ 的收益：$f_i=P_{i,1}/P_{i,0}-1$。学术和实际研究通常使用更长的形成期，并可能跳过最近一个月；必须写清采用的具体定义。`,
          },
        ],
        formula: String.raw`f_i=\frac{P_{i,1}}{P_{i,0}}-1`,
        code: {
          task: {en: 'Complete the momentum calculation and print all six stocks from strongest to weakest.', zh: '补全动量计算，并按动量从强到弱输出六只股票。'},
          starter: String.raw`${MOMENTUM_PRICES}

momentum = {}
for stock, (p0, p1, p2) in prices.items():
    momentum[stock] = # TODO: past return known at t1
for stock in sorted(momentum, key=momentum.get, reverse=True):
    print(stock, round(momentum[stock], 2))`,
          solution: String.raw`${MOMENTUM_PRICES}

momentum = {}
for stock, (p0, p1, p2) in prices.items():
    momentum[stock] = p1 / p0 - 1
for stock in sorted(momentum, key=momentum.get, reverse=True):
    print(stock, round(momentum[stock], 2))`,
          expected: 'A 0.2\nB 0.1\nC 0.05\nD 0\nE -0.1\nF -0.2',
          hint: {en: String.raw`Use $p_1/p_0-1$, not the future price $p_2$.`, zh: String.raw`使用 $p_1/p_0-1$，不要使用未来价格 $p_2$。`},
        },
        question: number(
          'momentum-a-signal',
          {en: 'What is stock A’s momentum? Enter a decimal.', zh: '股票 A 的动量是多少？请输入小数。'},
          0.2,
          {en: String.raw`$f_A=120/100-1=0.20$.`, zh: String.raw`$f_A=120/100-1=0.20$。`},
        ),
      },
      {
        id: 'momentum-forward',
        title: {en: '3. Keep forward returns separate', zh: '3. 独立计算未来收益'},
        body: [
          {
            en: String.raw`The evaluation return starts only after the signal is formed: $r_{i,t_1\to t_2}=P_{i,2}/P_{i,1}-1$. Keeping separate variables for the signal and outcome makes accidental reuse of future information easier to spot.`,
            zh: String.raw`检验收益从信号形成之后才开始：$r_{i,t_1\to t_2}=P_{i,2}/P_{i,1}-1$。把信号和结果放在不同变量中，更容易发现误用未来信息。`,
          },
        ],
        formula: String.raw`r_{i,t_1\to t_2}=\frac{P_{i,2}}{P_{i,1}}-1`,
        code: {
          task: {en: 'Compute and print every stock’s forward return in alphabetical order.', zh: '计算所有股票的未来收益，并按股票字母顺序输出。'},
          starter: String.raw`${MOMENTUM_PRICES}

forward = {}
for stock, (p0, p1, p2) in prices.items():
    forward[stock] = # TODO: return after portfolio formation
for stock in sorted(forward):
    print(stock, round(forward[stock], 2))`,
          solution: String.raw`${MOMENTUM_PRICES}

forward = {}
for stock, (p0, p1, p2) in prices.items():
    forward[stock] = p2 / p1 - 1
for stock in sorted(forward):
    print(stock, round(forward[stock], 2))`,
          expected: 'A 0.1\nB 0.05\nC -0.01\nD 0.01\nE 0.04\nF -0.05',
          hint: {en: 'This window starts at $t_1$ and ends at $t_2$.', zh: '这个收益窗口从 $t_1$ 开始，到 $t_2$ 结束。'},
        },
        question: number(
          'momentum-c-forward',
          {en: 'What is stock C’s forward return? Enter a decimal.', zh: '股票 C 的未来收益是多少？请输入小数。'},
          -0.01,
          {en: String.raw`$103.95/105-1=-0.01$. A stock can have positive past momentum but a negative later return.`, zh: String.raw`$103.95/105-1=-0.01$。过去动量为正，不代表之后收益一定为正。`},
        ),
      },
      {
        id: 'momentum-groups',
        title: {en: '4. Form groups and a long–short portfolio', zh: '4. 分组并构建多空组合'},
        body: [
          {
            en: 'Sort by the signal, not by the outcome. This teaching portfolio buys the top two and shorts the bottom two with equal weights. Real research also needs liquidity, borrow, market-impact and position-limit rules.',
            zh: '必须按信号而不是结果排序。本教学组合等权买入前两名、卖空后两名。真实研究还需考虑流动性、借券、市场冲击和仓位限制。',
          },
        ],
        formula: String.raw`R_{LS}=\frac{1}{2}(r_A+r_B)-\frac{1}{2}(r_E+r_F)`,
        code: {
          task: {en: 'Calculate the top-two mean, bottom-two mean and high-minus-low return.', zh: '计算前两名平均收益、后两名平均收益和多空收益。'},
          starter: String.raw`${MOMENTUM_PRICES}

momentum = {s: p1 / p0 - 1 for s, (p0, p1, p2) in prices.items()}
forward = {s: p2 / p1 - 1 for s, (p0, p1, p2) in prices.items()}
ranked = sorted(prices, key=momentum.get, reverse=True)
top = ranked[:2]
bottom = ranked[-2:]
mean = lambda values: sum(values) / len(values)
top_return = mean([forward[s] for s in top])
bottom_return = mean([forward[s] for s in bottom])
long_short = # TODO: high group minus low group
print("Top", round(top_return, 3))
print("Bottom", round(bottom_return, 3))
print("Long-short", round(long_short, 3))`,
          solution: String.raw`${MOMENTUM_PRICES}

momentum = {s: p1 / p0 - 1 for s, (p0, p1, p2) in prices.items()}
forward = {s: p2 / p1 - 1 for s, (p0, p1, p2) in prices.items()}
ranked = sorted(prices, key=momentum.get, reverse=True)
top = ranked[:2]
bottom = ranked[-2:]
mean = lambda values: sum(values) / len(values)
top_return = mean([forward[s] for s in top])
bottom_return = mean([forward[s] for s in bottom])
long_short = top_return - bottom_return
print("Top", round(top_return, 3))
print("Bottom", round(bottom_return, 3))
print("Long-short", round(long_short, 3))`,
          expected: 'Top 0.075\nBottom -0.005\nLong-short 0.08',
          hint: {en: 'A short position loses when its asset rises, so the portfolio subtracts the bottom group’s return.', zh: '空头在资产上涨时会亏损，因此组合收益要减去低信号组收益。'},
        },
        question: number(
          'momentum-group-return',
          {en: 'What is the gross long–short return? Enter a decimal.', zh: '成本前多空收益是多少？请输入小数。'},
          0.08,
          {en: String.raw`$0.075-(-0.005)=0.08$. This is gross of all costs and based on one tiny cross-section.`, zh: String.raw`$0.075-(-0.005)=0.08$。这是未扣成本、仅基于一个极小截面的结果。`},
        ),
      },
      {
        id: 'momentum-metrics',
        title: {en: '5. Diagnose ranking and drawdown', zh: '5. 诊断排序能力与最大回撤'},
        body: [
          {
            en: String.raw`With no ties, Spearman Rank IC is $\rho=1-\frac{6\sum_i d_i^2}{n(n^2-1)}$, where $d_i$ is the difference between signal and return ranks. Maximum drawdown measures the worst decline from a prior equity peak.`,
            zh: String.raw`没有并列名次时，Spearman Rank IC 为 $\rho=1-\frac{6\sum_i d_i^2}{n(n^2-1)}$，其中 $d_i$ 是信号排名与收益排名之差。最大回撤衡量净值相对此前高点的最大跌幅。`,
          },
          {
            en: String.raw`For the illustrated long–short series $[0.08,-0.04,0.02]$, the second period gives the maximum drawdown of $4\%$. One series of three observations is only a coding check, not a stable performance estimate.`,
            zh: String.raw`示例多空收益序列 $[0.08,-0.04,0.02]$ 在第二期出现 $4\%$ 的最大回撤。三期数据只能用于检查代码，不能形成稳定的表现估计。`,
          },
        ],
        formula: String.raw`V_t=V_{t-1}(1+R_t)\qquad MDD=\max_t\left(1-\frac{V_t}{\max_{u\le t}V_u}\right)`,
        code: {
          task: {en: 'Complete Spearman Rank IC and retain the drawdown calculation.', zh: '补全 Spearman Rank IC，并运行已有的最大回撤计算。'},
          starter: String.raw`${MOMENTUM_PRICES}

momentum = {s: p1 / p0 - 1 for s, (p0, p1, p2) in prices.items()}
forward = {s: p2 / p1 - 1 for s, (p0, p1, p2) in prices.items()}
stocks = sorted(prices)
mom_order = sorted(stocks, key=momentum.get)
ret_order = sorted(stocks, key=forward.get)
mom_rank = {s: i + 1 for i, s in enumerate(mom_order)}
ret_rank = {s: i + 1 for i, s in enumerate(ret_order)}
n = len(stocks)
d_squared = sum((mom_rank[s] - ret_rank[s]) ** 2 for s in stocks)
rank_ic = # TODO: Spearman correlation without ties

equity = 1.0
peak = 1.0
max_drawdown = 0.0
for r in [0.08, -0.04, 0.02]:
    equity *= 1 + r
    peak = max(peak, equity)
    max_drawdown = max(max_drawdown, 1 - equity / peak)
print("Rank IC", round(rank_ic, 4))
print("Max drawdown", round(max_drawdown, 4))`,
          solution: String.raw`${MOMENTUM_PRICES}

momentum = {s: p1 / p0 - 1 for s, (p0, p1, p2) in prices.items()}
forward = {s: p2 / p1 - 1 for s, (p0, p1, p2) in prices.items()}
stocks = sorted(prices)
mom_order = sorted(stocks, key=momentum.get)
ret_order = sorted(stocks, key=forward.get)
mom_rank = {s: i + 1 for i, s in enumerate(mom_order)}
ret_rank = {s: i + 1 for i, s in enumerate(ret_order)}
n = len(stocks)
d_squared = sum((mom_rank[s] - ret_rank[s]) ** 2 for s in stocks)
rank_ic = 1 - 6 * d_squared / (n * (n ** 2 - 1))

equity = 1.0
peak = 1.0
max_drawdown = 0.0
for r in [0.08, -0.04, 0.02]:
    equity *= 1 + r
    peak = max(peak, equity)
    max_drawdown = max(max_drawdown, 1 - equity / peak)
print("Rank IC", round(rank_ic, 4))
print("Max drawdown", round(max_drawdown, 4))`,
          expected: 'Rank IC 0.7714\nMax drawdown 0.04',
          hint: {en: String.raw`Use $\rho=1-6\sum d_i^2/[n(n^2-1)]$; here $\sum d_i^2=8$ and $n=6$.`, zh: String.raw`使用 $\rho=1-6\sum d_i^2/[n(n^2-1)]$；这里 $\sum d_i^2=8$，$n=6$。`},
        },
        question: number(
          'momentum-rank-ic',
          {en: 'What is the Rank IC, rounded to four decimals?', zh: 'Rank IC 是多少？请保留四位小数。'},
          0.7714,
          {en: String.raw`The squared rank differences sum to $8$, so $\rho=1-48/210=0.771428\ldots\approx0.7714$.`, zh: String.raw`排名差平方和为 $8$，因此 $\rho=1-48/210=0.771428\ldots\approx0.7714$。`},
        ),
      },
      {
        id: 'momentum-discussion',
        title: {en: '6. Costs, out-of-sample evidence and an honest conclusion', zh: '6. 成本、样本外证据与诚实结论'},
        body: [
          {
            en: String.raw`If trading costs total $1\%$ for the rebalance, the teaching net return is $8\%-1\%=7\%$ before any more detailed cost model. Suppose an untouched later sample produces $-2\%$. The correct conclusion is not “the factor works”; it is that the initial observation needs much broader validation.`,
            zh: String.raw`若本次调仓总成本为 $1\%$，教学示例的扣费后收益为 $8\%-1\%=7\%$，这还未包含更细致的成本模型。假设未参与调参的后续样本结果为 $-2\%$，正确结论不是“因子有效”，而是最初观察仍需更广泛验证。`,
          },
        ],
        formula: String.raw`R_{\text{net}}=R_{\text{gross}}-C_{\text{trading}}`,
        code: {
          task: {en: 'Calculate net return and print it beside the gross and out-of-sample results.', zh: '计算扣费后收益，并与成本前及样本外结果一起输出。'},
          starter: String.raw`gross = 0.08
trading_cost = 0.01
out_of_sample = -0.02
net = # TODO: subtract trading costs
print("Gross", gross)
print("Net", round(net, 2))
print("OOS", out_of_sample)`,
          solution: String.raw`gross = 0.08
trading_cost = 0.01
out_of_sample = -0.02
net = gross - trading_cost
print("Gross", gross)
print("Net", round(net, 2))
print("OOS", out_of_sample)`,
          expected: 'Gross 0.08\nNet 0.07\nOOS -0.02',
          hint: {en: 'Net performance equals gross performance minus the costs incurred.', zh: '扣费后表现等于成本前表现减去实际发生的成本。'},
        },
        question: choice(
          'momentum-honest-conclusion',
          {en: 'Which conclusion best matches all the evidence?', zh: '哪项结论最符合全部证据？'},
          [
            {en: 'The factor is guaranteed to earn 7% in the future.', zh: '该因子未来保证能赚 7%。'},
            {en: 'The first sample is encouraging, but costs and the negative out-of-sample result require caution and further testing.', zh: '首个样本有积极迹象，但成本与样本外负结果要求保持谨慎并继续检验。'},
            {en: 'The out-of-sample result should be deleted because it disagrees.', zh: '样本外结果不一致，所以应该删除。'},
          ],
          1,
          {en: 'Research conclusions must include costs, uncertainty and evidence outside the tuning sample.', zh: '研究结论必须包含成本、不确定性，以及调参样本之外的证据。'},
        ),
      },
    ],
    sources: [
      {label: 'Jegadeesh & Titman (1993) — Returns to Buying Winners and Selling Losers', url: 'https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1540-6261.1993.tb04702.x'},
      {label: 'Kenneth R. French — Monthly Momentum Factor construction', url: 'https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library/det_mom_factor.html'},
      {label: 'pandas — pct_change documentation', url: 'https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.pct_change.html'},
      {label: 'QuantConnect — Look-ahead bias in research', url: 'https://www.quantconnect.com/docs/v2/cloud-platform/research/deployment'},
    ],
  },
  {
    n: 4,
    level: 'L5',
    title: {en: 'Reading Papers & Reports', zh: '论文与研报研读'},
    intro: {
      en: 'Learn to extract a claim, evidence map and replication plan from a quantitative-finance paper. The goal is not to finish a PDF quickly; it is to discover exactly what was tested, what was assumed and what remains uncertain.',
      zh: '学习从量化金融论文中提取观点、证据地图与复现计划。目标不是快速读完 PDF，而是准确弄清作者检验了什么、假设了什么，以及仍有哪些不确定性。',
    },
    outcome: {
      en: 'Outcome: a one-page reading card and a replication notebook plan that separates reproduction from extension.',
      zh: '学习产出：一页论文导读卡，以及把忠实复现与扩展研究分开的 notebook 计划。',
    },
    sections: [
      {
        id: 'reading-three-passes',
        title: {en: 'Use three passes instead of reading linearly', zh: '用三遍阅读法，不要从头硬读到尾'},
        body: [
          {en: 'First pass: title, abstract, figures and conclusion. Write the research question and decide whether the paper is relevant. Second pass: data, variable definitions, methodology and tables. Third pass: derivations, robustness checks, references and limitations.', zh: '第一遍读标题、摘要、图表和结论，写下研究问题并判断是否相关。第二遍读数据、变量定义、方法和表格。第三遍再读推导、稳健性检验、参考文献和局限。'},
          {en: 'Do not treat a broker report, blog and peer-reviewed paper as equivalent evidence. Identify who produced the material, the incentives, the data and whether the analysis can be independently checked.', zh: '不要把券商研报、博客和同行评审论文视为同等证据。要识别作者、发布动机、数据来源，以及分析能否被独立核查。'},
        ],
        bullets: [
          {en: 'Claim: the precise relationship the authors propose.', zh: '观点：作者提出的准确关系。'},
          {en: 'Evidence: sample, variables, method and main tables.', zh: '证据：样本、变量、方法和核心表格。'},
          {en: 'Caveat: what the evidence does not establish.', zh: '局限：证据不能证明什么。'},
        ],
        question: choice(
          'reading-first-pass',
          {en: 'What should your first useful note contain?', zh: '第一条有效阅读笔记应该写什么？'},
          [
            {en: 'A list of every equation without context.', zh: '不带背景地抄下所有公式。'},
            {en: 'The research question, the claimed finding and why the paper matters to your project.', zh: '研究问题、作者声称的发现，以及它与你的项目为何相关。'},
            {en: 'Only the journal impact factor.', zh: '只记录期刊影响因子。'},
          ],
          1,
          {en: 'A question–claim–relevance note gives the rest of the reading a purpose.', zh: '“问题—观点—相关性”笔记能为后续阅读提供明确目标。'},
        ),
      },
      {
        id: 'reading-evidence-map',
        title: {en: 'Build an evidence map', zh: '建立证据地图'},
        body: [
          {en: String.raw`Translate the paper into inputs and outputs. For a return-prediction study, record the formation date, publication lag, signal $f_{i,t}$, evaluation window $t\to t+h$, portfolio weights and whether returns are gross or net.`, zh: String.raw`把论文拆成输入和输出。对收益预测研究，要记录形成日、发布滞后、信号 $f_{i,t}$、评价窗口 $t\to t+h$、组合权重，以及收益是否扣除成本。`},
          {en: 'Separate in-sample fit, validation used for model choices, and genuinely untouched tests. A table labelled “out of sample” is not enough: reconstruct which decisions were made before that period was examined.', zh: '区分样本内拟合、用于模型选择的验证集和真正未触碰的测试集。表格写着“样本外”还不够，需要还原作者在查看该区间前做过哪些决定。'},
        ],
        formula: String.raw`r_{i,t+1}=\alpha+\beta f_{i,t}+\varepsilon_{i,t+1}`,
        question: choice(
          'reading-validation',
          {en: 'A researcher tries 50 settings on period B, picks the best, and reports period B as “out of sample”. Why is that misleading?', zh: '研究者在 B 区间尝试 50 组参数，选出最好的一组，再把 B 称为“样本外”。为什么会误导？'},
          [
            {en: 'Period B was used for model selection, so it is validation data rather than an untouched final test.', zh: 'B 区间已用于模型选择，因此是验证数据，不是未触碰的最终测试集。'},
            {en: 'Fifty settings are always better than one.', zh: '50 组参数总比一组好。'},
            {en: 'Only daily data can be out of sample.', zh: '只有日频数据才能做样本外测试。'},
          ],
          0,
          {en: 'Once results influence the chosen model, that period has participated in the research process and needs a new independent test.', zh: '一旦结果影响模型选择，该区间就参与了研究过程，需要新的独立检验。'},
        ),
      },
      {
        id: 'reading-classics',
        title: {en: 'A graded reading path with guide cards', zh: '分级阅读路径与导读卡'},
        body: [
          {en: 'Start with official documentation and a short methodological guide. Then read Jegadeesh–Titman for the original momentum evidence, Fama–French for common risk factors, and the Ken French Data Library for exact, downloadable factor construction details.', zh: '先读官方文档和简短方法指南，再读 Jegadeesh–Titman 的原始动量证据、Fama–French 的共同风险因子研究，并通过 Ken French 数据库查看可下载因子的精确构造细节。'},
          {en: 'For each item, make a guide card: background, question, data, method, key figure or table, reproducible detail, limitation and one question for discussion. A paper’s historical importance does not remove the need for modern out-of-sample and cost analysis.', zh: '每篇材料制作导读卡：背景、问题、数据、方法、关键图表、可复现细节、局限，以及一个讨论问题。论文具有历史地位，也不等于可以省略现代样本外与成本分析。'},
        ],
        bullets: [
          {en: 'Foundation: QuantConnect research guide and official data documentation.', zh: '入门：QuantConnect 研究指南与官方数据文档。'},
          {en: 'Classic: Jegadeesh & Titman (1993); Fama & French (1993).', zh: '经典：Jegadeesh & Titman（1993）；Fama & French（1993）。'},
          {en: 'Replication data: Ken French Data Library and its construction notes.', zh: '复现数据：Ken French 数据库及构造说明。'},
        ],
        question: choice(
          'reading-source-match',
          {en: 'You need the exact breakpoints and portfolio construction for a momentum dataset. Which source is most directly useful?', zh: '你需要动量数据集的确切分组点与组合构造方法，哪个来源最直接？'},
          [
            {en: 'An anonymous social-media post.', zh: '匿名社交媒体帖子。'},
            {en: 'The Ken French Data Library’s momentum construction note.', zh: 'Ken French 数据库的动量构造说明。'},
            {en: 'A chart without a methods section.', zh: '没有方法说明的图片。'},
          ],
          1,
          {en: 'The official construction note documents the sample, prior-return window, breakpoints and portfolio rule.', zh: '官方构造说明记录了样本、过去收益窗口、分组点和组合规则。'},
        ),
      },
      {
        id: 'reading-replication',
        title: {en: 'Reproduce before you extend', zh: '先忠实复现，再做扩展'},
        body: [
          {en: 'A credible replication starts by matching the original universe, sample dates, lag, variable definitions and portfolio rule. Compare intermediate tables, not only the final return. Differences should lead to a debugging log, not silent adjustments.', zh: '可信复现首先要匹配原始股票池、样本日期、滞后、变量定义和组合规则。要比较中间表格，而不只是最终收益。出现差异时写调试记录，不能悄悄调整到“看起来一致”。'},
          {en: 'Only after the baseline is understood should you change the market, period, costs or signal. Label these as extensions. Your notebook should include a data dictionary, reproducible environment, seeded random choices where relevant, and a conclusion that separates replicated findings from your own.', zh: '理解基线后，才能改变市场、时期、成本或信号，并明确标记为扩展。Notebook 应包含数据字典、可复现环境、必要时的随机种子，以及区分原文复现结果与自己扩展结果的结论。'},
        ],
        bullets: [
          {en: 'Cell 1: research question and original specification.', zh: '单元 1：研究问题与原始设定。'},
          {en: 'Cell 2: data provenance, cleaning and point-in-time checks.', zh: '单元 2：数据来源、清洗与时间点检查。'},
          {en: 'Cell 3: baseline reproduction with intermediate checks.', zh: '单元 3：基线复现与中间结果核对。'},
          {en: 'Cell 4: clearly labelled extensions, costs and limitations.', zh: '单元 4：明确标记的扩展、成本与局限。'},
        ],
        question: choice(
          'reading-replication-order',
          {en: 'Your baseline differs from the paper’s Table 2. What should you do first?', zh: '你的基线结果与论文表 2 不同，第一步应该做什么？'},
          [
            {en: 'Change the sample until the result matches.', zh: '不断修改样本直到结果一致。'},
            {en: 'Trace data, lags, definitions and intermediate calculations, and document each discrepancy.', zh: '追查数据、滞后、定义与中间计算，并记录每处差异。'},
            {en: 'Delete Table 2 from the reading card.', zh: '从导读卡中删除表 2。'},
          ],
          1,
          {en: 'Replication discrepancies are diagnostic evidence. Transparent tracing is more valuable than a forced match.', zh: '复现差异本身是诊断证据，透明追查比强行凑出一致结果更有价值。'},
        ),
      },
    ],
    sources: [
      {label: 'Fama & French (1993) — Common risk factors in stocks and bonds', url: 'https://www.sciencedirect.com/science/article/abs/pii/0304405X93900235'},
      {label: 'Jegadeesh & Titman (1993) — Momentum paper', url: 'https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1540-6261.1993.tb04702.x'},
      {label: 'Ken French — Fama/French benchmark factor definitions', url: 'https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/Data_Library/f-f_bench_factor.html'},
      {label: 'Ken French — Momentum factor construction', url: 'https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library/det_mom_factor.html'},
    ],
  },
  {
    n: 5,
    level: 'L5+',
    title: {en: 'Exits: Competitions & Platforms', zh: '进阶出口：竞赛与外部平台'},
    intro: {
      en: 'Move from a guided course to external research environments without losing methodological discipline. Bring a documented baseline, a validation plan and a replication notebook; do not begin by chasing a leaderboard.',
      zh: '从引导课程进入外部研究环境时，仍要保持方法纪律。带上文档化的基线、验证计划和复现笔记，不要一开始就只追排行榜。',
    },
    outcome: {
      en: 'Outcome: a platform-ready research checklist and a small team plan with roles, eligibility checks and reproducible submission records.',
      zh: '学习产出：一份外部平台研究清单，以及包含分工、资格核查和可复现提交记录的小组计划。',
    },
    sections: [
      {
        id: 'brain-bridge',
        title: {en: 'Bridge a factor notebook to WorldQuant BRAIN', zh: '把因子 notebook 桥接到 WorldQuant BRAIN'},
        body: [
          {en: String.raw`A simple past-return signal $f=P_1/P_0-1$ can be expressed conceptually as a delayed price ratio followed by cross-sectional ranking. On BRAIN, an educational starting expression is \`rank(close / delay(close, 20) - 1)\`; its meaning depends on the available data, settings and operator definitions.`, zh: String.raw`简单的过去收益信号 $f=P_1/P_0-1$，可以理解为先计算滞后价格比率，再做截面排名。在 BRAIN 上，教学起始表达式可写为 \`rank(close / delay(close, 20) - 1)\`，其含义取决于可用数据、回测设置和算子定义。`},
          {en: 'The expression is a bridge, not a finished alpha. Check universe, delay, neutralisation, decay, truncation, turnover and transaction-cost settings. Read the platform’s current Learn materials and test whether the simulation implements the same timing as your notebook.', zh: '这个表达式只是桥接起点，不是完成的 Alpha。需要检查股票池、滞后、中性化、衰减、截断、换手和交易成本设置，并阅读平台当前 Learn 资料，核对模拟的时间口径是否与 notebook 一致。'},
        ],
        formula: String.raw`f_{i,t}=\frac{P_{i,t}}{P_{i,t-20}}-1\qquad s_{i,t}=\operatorname{rank}_i(f_{i,t})`,
        bullets: [
          {en: 'Record expression, simulation settings, date and resulting metrics together.', zh: '把表达式、模拟设置、日期和结果指标一起记录。'},
          {en: 'Compare correlated signals and diversification, not only standalone Sharpe.', zh: '比较信号相关性与分散化，不只看单个 Sharpe。'},
          {en: 'Treat platform results as simulations, not return promises.', zh: '平台结果属于模拟，不是收益承诺。'},
        ],
        question: choice(
          'brain-time-check',
          {en: 'Your notebook skips the most recent month, but the platform expression does not. What must you do before comparing results?', zh: '你的 notebook 跳过最近一个月，但平台表达式没有跳过。比较结果前应该怎么做？'},
          [
            {en: 'Ignore the difference if the Sharpe is positive.', zh: '只要 Sharpe 为正就忽略差异。'},
            {en: 'Align the signal timing and simulation settings, then rerun the comparison.', zh: '统一信号时间与模拟设置，再重新比较。'},
            {en: 'Use whichever result is higher.', zh: '采用更高的那个结果。'},
          ],
          1,
          {en: 'Different signal timing defines a different strategy. Align specifications before drawing conclusions.', zh: '信号时间不同就意味着策略定义不同，必须先统一设定再下结论。'},
        ),
      },
      {
        id: 'kaggle-solutions',
        title: {en: 'Read Kaggle solutions for validation, not just models', zh: '读 Kaggle 方案，重点看验证而不只是模型'},
        body: [
          {en: 'Completed competitions such as Jane Street Real-Time Market Data Forecasting and Optiver – Trading at the Close provide real datasets, public notebooks and final leaderboards. A strong solution write-up explains feature timing, validation splits, metric alignment and reproducibility.', zh: 'Jane Street Real-Time Market Data Forecasting、Optiver – Trading at the Close 等已结束竞赛提供真实数据集、公开 notebook 和最终排行榜。优秀方案复盘不仅讲模型，还会解释特征时间、验证切分、指标一致性和复现方法。'},
          {en: 'Financial observations are ordered in time and may share regimes. Randomly mixing rows can leak information. Study how the competition hides future data, what the public leaderboard measures, and whether many submissions indirectly tuned the public score.', zh: '金融观测具有时间顺序，并可能共享市场状态，随机打散容易造成信息泄漏。要研究竞赛如何隐藏未来数据、公开排行榜衡量什么，以及多次提交是否间接对公开分数过拟合。'},
        ],
        bullets: [
          {en: 'First reproduce the data split and baseline metric.', zh: '先复现数据切分与基线指标。'},
          {en: 'Then inspect feature availability and leakage controls.', zh: '再检查特征可用时间与泄漏控制。'},
          {en: 'Only afterwards compare models, ensembling and compute cost.', zh: '最后再比较模型、集成方法与计算成本。'},
        ],
        question: choice(
          'kaggle-public-leaderboard',
          {en: 'Why can repeated tuning on a public leaderboard be dangerous?', zh: '为什么反复根据公开排行榜调参可能很危险？'},
          [
            {en: 'The public subset can become validation data, so the visible score may overstate unseen performance.', zh: '公开子集会变成验证数据，因此可见分数可能高估未见数据上的表现。'},
            {en: 'Public leaderboards never contain numbers.', zh: '公开排行榜没有数值。'},
            {en: 'It eliminates the need for validation.', zh: '它让验证变得不再必要。'},
          ],
          0,
          {en: 'Leaderboard feedback can influence model choices just like any other validation signal.', zh: '排行榜反馈和其他验证信号一样，会影响模型选择。'},
        ),
      },
      {
        id: 'competition-team',
        title: {en: 'Turn a competition into a reproducible team project', zh: '把竞赛变成可复现的团队项目'},
        body: [
          {en: 'For the 2026 International Quant Championship, the official rules allowed teams of one to four members associated with the same university, and the season has now concluded. Treat this as a historical example only: future dates, eligibility, scoring and team rules must be checked against the next season’s official guidelines.', zh: '以 2026 International Quant Championship 为例，官方当时允许同校 1–4 人组队，而该赛季现已结束。这只是历史示例：未来赛季的日期、资格、评分和组队规则都必须以下一届官方说明为准。'},
          {en: 'Before external submission, prepare a society-level rehearsal: each member explains one assumption, one validation check and one failure. Keep a shared experiment register so the team can reconstruct exactly which code and settings produced a selected result.', zh: '外部提交前，先做一次社团内部演练：每位成员解释一个假设、一项验证检查和一个失败案例。共享实验登记表，确保团队能还原选中结果对应的代码与设置。'},
        ],
        bullets: [
          {en: 'Roles: data/timing owner, research owner, validation owner and reproducibility reviewer.', zh: '分工：数据与时间口径、因子研究、验证、复现审查。'},
          {en: 'Gate: no submission without a baseline, cost discussion and independent rerun.', zh: '门槛：没有基线、成本讨论和独立重跑，就不提交。'},
          {en: 'Archive: notebook, expression or model, settings, metric, date, author and known limitations.', zh: '归档：notebook、表达式或模型、设置、指标、日期、作者与已知局限。'},
        ],
        question: choice(
          'competition-current-rules',
          {en: 'A new competition season is announced. What is the correct first step?', zh: '新一届竞赛公布后，正确的第一步是什么？'},
          [
            {en: 'Reuse last year’s eligibility and deadlines without checking.', zh: '不核查，直接沿用上届资格与截止日期。'},
            {en: 'Read the current official guidelines, confirm eligibility and assign a reproducibility process before experimenting.', zh: '阅读当季官方规则，确认资格，并在实验前确定复现流程。'},
            {en: 'Submit as many untracked variations as possible.', zh: '尽可能提交大量未记录的变体。'},
          ],
          1,
          {en: 'Rules and schedules change. Current official guidance and a traceable team workflow come first.', zh: '规则和日程会变化，应优先核查当季官方说明，并建立可追踪的团队流程。'},
        ),
      },
    ],
    sources: [
      {label: 'WorldQuant — International Quant Championship overview', url: 'https://www.worldquant.com/brain/iqc/'},
      {label: 'WorldQuant — Official IQC guidelines', url: 'https://www.worldquant.com/brain/iqc-guidelines/'},
      {label: 'WorldQuant — 2026 IQC winners and season conclusion', url: 'https://www.worldquant.com/ideas/worldquant-announces-winners-of-the-2026-international-quant-championship/'},
      {label: 'Kaggle — Jane Street Real-Time Market Data Forecasting', url: 'https://www.kaggle.com/competitions/jane-street-real-time-market-data-forecasting'},
      {label: 'Kaggle — Optiver: Trading at the Close', url: 'https://www.kaggle.com/competitions/optiver-trading-at-the-close/overview'},
    ],
  },
];

export function getResearchElective(n: number) {
  return RESEARCH_ELECTIVES.find((course) => course.n === n);
}
