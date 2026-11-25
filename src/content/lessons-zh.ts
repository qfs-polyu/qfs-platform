/**
 * Chinese translations for L1 lesson content (lessons 1-5).
 * Keyed by lesson number -> step index (0-based). Falls back to English
 * for any missing field. Code stays identical; only text is localized.
 */

export type ZhStep = {
  title?: string;
  explain: string;
  /** starter with Chinese task comment (code lines unchanged) */
  starter?: string;
  hint?: string;
  /** translated example annotations keyed by line index */
  exampleNotes?: Record<number, string>;
};

export type ZhLesson = { title?: string; steps: ZhStep[] };

export const LESSONS_ZH: Record<number, ZhLesson> = {
  1: {
    title: '变量、打印与读懂报错',
    steps: [
      {
        explain: 'print() 是你与世界的出口：括号里的内容会被写到控制台——即编辑器下方的输出面板。文本（字符串）必须用引号包裹，Python 才把它当作文字而不是变量名。括号 () 表示"调用"：你在命令 Python 立刻执行 print 这个动作。判题器会比较你的控制台输出与期望输出，所以文本要完全一致——大小写和标点都算。',
        starter: '# 任务：让程序打印这句问候语：Hello, QFS!\n',
        hint: '判题期望输出是 "Hello, QFS!"——检查前请确保输出与它一致。',
        exampleNotes: { 0: 'print() 显示括号里的内容；文本必须用引号包裹', 1: '第二个 print() 会自动另起一行' },
      },
      {
        explain: '变量是指向值的名字——像一个贴了标签的盒子：price = 12.5 把 12.5 放进标签为 price 的盒子，之后使用 price 这个名字，Python 就交出这个值。Python 支持日常算术：+ - * / 与数学一致，* 优先于 +。表达式中每个变量都先被替换成它的值，再进行运算。用文字描述的任务：计算这个持仓的总价值并打印。',
        starter: 'price = 12.5      # 每股价格（美元）\nquantity = 200    # 股数\n\n# 任务：打印这 200 股总共值多少美元\n',
        hint: '哪种算术运算把"每股价格"和"股数"结合在一起？',
        exampleNotes: { 0: '创建变量 apples；整数是 int', 1: '带小数点的值是 float', 2: '* 将两个变量相乘；print() 显示结果：7.5' },
      },
      {
        explain: '= 不表示"等于"——它表示"存入"。Python 先执行右边，再把结果存进左边的名字。这就是 price = price + 5 合法且强大的原因：读取旧值、加 5、把结果覆盖回 price。这个更新模式（读旧值、计算、覆盖）是本课程所有"累计值"的引擎。任务：执行一次这个操作。',
        starter: 'price = 100.0\n\n# 任务：把 price 提高 5 美元，然后打印新价格\n',
        hint: '新值会覆盖旧值——更新之后 price 就是 105.0。',
        exampleNotes: { 0: '创建 score 为 90', 1: '右边先执行：读旧 score、加 10、存回 score', 2: 'score 现在是 100——赋值覆盖了旧值' },
      },
      {
        explain: '每个值都有类型：股票代码是 str（文本），200 是 int（整数），12.5 是 float（小数）。类型很重要，因为运算行为不同：两个字符串相加是拼接，字符串加数字会报 TypeError。新语法：type(x) 返回 x 的类型，是一个可以打印的值；print(a, b, c) 用逗号分隔可以在一行打印多个值，以空格分隔。一次 print 调用，按顺序打印三个类型。',
        starter: 'ticker = "0700.HK"\nshares = 200\nprice = 12.5\n\n# 任务：按顺序，用一次 print 调用打印这三个值的类型\n',
        hint: 'print(type(a), type(b), type(c))——逗号让结果同行显示、空格分隔。',
        exampleNotes: { 0: 'type() 揭示值的类型；逗号让三个结果同行、空格分隔' },
      },
      {
        explain: '收益率衡量价格相对于起点的变化——本课程最重要的数字。逻辑：先算涨幅（新 − 旧），再除以起始价格，因为同样涨 5 美元，100 美元的股票和 1000 美元的股票意义完全不同。平台约定：小数形式 0.075 表示 7.5%，百分数形式 7.5 同样表示 7.5%——先算小数，再乘 100。注意运算顺序：不加括号的话除法只会作用于 new_price。两次 print 输出两行。',
        starter: 'old_price = 100.0\nnew_price = 107.5\n\n# 任务：创建 return_decimal 和 return_percent，然后逐行打印\n',
        hint: '先算相对涨幅（注意括号！），再乘 100 得到百分数。',
        exampleNotes: { 0: '买入价', 1: '卖出价', 2: '涨幅除以起始价——括号保证先做减法：这就是小数收益率', 3: '0.25——小数形式（即 25%）', 4: '乘以 100 得到百分数形式：25.0' },
      },
      {
        explain: '报错是信息，不是失败——专业人士天天在读报错。阅读顺序：最后一行是错误类型，上面几行显示位置（行号）。示例里的 word + 1 试图把文本和数字相加，因此产生 TypeError；你的任务则是另一种错误：程序定义了 price 却写成 prcie，产生 NameError。修正拼写，让程序打印 100.0。习惯：不要猜——让报错告诉你哪个名字、哪一行。',
        starter: 'price = 100.0\nprint(prcie)\n',
        hint: '报错会指出未定义的名字；把两处拼写改得完全一致。',
        exampleNotes: { 0: '字符串变量：文字要放在引号里', 1: 'Python 不能把字符串和数字直接相加，因此会报错；先读报错最后一行的 TypeError' },
      },
      {
        explain: '本课所有内容合在一起：变量保存买卖价格；涨幅相对买入价计算；先小数后百分数。这正是一份每日 P&L（损益）报告对每个持仓做的计算。没有新语法——从给出的两个价格开始，自己组织计算和打印。',
        starter: 'cost = 60.0\nprice = 90.0\n\n# 任务：先打印小数收益率，再打印百分数收益率\n',
        hint: '和之前一样的两行：先相对涨幅，再乘 100。',
        exampleNotes: { 0: '买入价（与题目数字不同）', 1: '卖出价', 2: '小数收益率：相对买入价的涨幅——这里是 0.25', 3: '0.25——小数形式（即 25%）', 4: '25.0——百分数形式' },
      },
      {
        explain: '同样的收益率逻辑用在真实价格上，外加一个展示新工具：round(x, 4) 返回 x 保留 4 位小数的副本（x 本身不变）。报告为人服务——0.0940 比 0.09400094 好读。Python 会省略末尾的 0，所以保留 4 位后也可能显示为 0.094，而不是 0.0940。用变量计算；只在打印时取整；先小数行，再百分数行。',
        starter: 'old = 423.4   # 真实收盘价 2026-10-14\nnew = 383.6   # 真实收盘价 2026-10-30\n\n# 任务：打印真实持有期收益率——先小数后百分数，都保留 4 位小数\n',
        hint: '和第 1 课挑战一样的两行——只是数字是真实的，且打印时要 round。',
        exampleNotes: { 0: '腾讯 2026-09-30 的真实收盘价', 1: '2026-10-16 的真实收盘价', 2: '这两个真实价格之间的持有期收益率', 3: '小数形式，保留 4 位：约 -0.0306', 4: '百分数形式：约 -3.0626' },
      },
    ],
  },
  2: {
    title: '列表与循环：价格序列',
    steps: [
      {
        explain: '列表是 Python 的有序容器：方括号、逗号分隔元素。顺序不是装饰——位置 0 是最早的一天；序列本身就是数据，第 2–5 课的所有技术（循环、切片、数组、Series）都从这个结构出发。print(prices) 会连括号一起显示所有元素。',
        starter: 'prices = [100, 110, 99, 108.9]\n\n# 任务：打印整个序列\n',
        hint: 'print(prices) 会带括号打印整个列表。',
        exampleNotes: { 0: '方括号创建列表；逗号按顺序分隔元素——顺序就是数据' },
      },
      {
        explain: '每个元素都有一个索引——它的位置编号——Python 从零开始计数：prices[0] 是第一天，prices[1] 第二天，prices[2] 第三天。"差一"习惯一开始会绊倒所有人：第三个元素的索引是 2。负索引从末尾数起：prices[-1] 是最新价格。列表名后跟方括号完成选择；print() 里用逗号可以同行显示。',
        starter: 'prices = [100, 110, 99, 108.9]\n\n# 任务：把第一个、第三个和最新的价格放在一行打印\n',
        hint: '第三天是索引 2，不是 3——计数从零开始。',
        exampleNotes: { 1: '索引 0 = 第一个元素；-1 = 最后一个。计数从零开始，所以第三天是索引 2' },
      },
      {
        explain: '两个日常工具。len(x) 返回元素个数。list.append(value) 在同一个列表末尾添加一个元素——注意点语法：动作属于列表本身（这个点模式在 pandas 里到处都是）。append 那行已给出；执行后序列有五个收盘价。你的任务：数一数。',
        starter: 'prices = [100, 110, 99, 108.9]\nprices.append(120.0)   # 新收盘价到了\n\n# 任务：打印序列现在有几个元素\n',
        hint: '一个函数调用就能给出元素数量。',
        exampleNotes: { 0: '两个元素的列表', 1: 'append() 在同一列表末尾添加一个元素——点语法', 2: 'len() 数元素：现在是 3' },
      },
      {
        explain: 'for 循环 = 对每个元素做同一件事。结构：头部 for price in prices: 逐个取出元素，每轮命名为 price；冒号开启循环体；循环体有缩进（4 个空格），按顺序对每个元素执行一次。缩进不是装饰——它就是 Python 的代码块结构。每次 print(price) 输出一行，四个元素就是四行。',
        starter: 'prices = [100, 110, 99, 108.9]\n\n# 任务：打印每个价格，每行一个\n',
        hint: '循环行以冒号结尾；循环体要缩进。',
        exampleNotes: { 0: '循环头部：逐个取元素，每轮命名为 n。冒号+缩进开启循环体', 1: '缩进的循环体对每个元素执行一次：1、2、3' },
      },
      {
        explain: '累计器——数据代码里最常用的模式。逻辑：在循环之前创建 total = 0（必须先存在才有人往里加）；循环内部 total = total + price 每轮执行一次第 1 课的更新模式。顺序就是全部要领：外面初始化、里面更新——顺序反了每轮都会清零进度。平均值用最终的 total 除以个数（len 帮忙），显示时取整。',
        starter: 'prices = [100, 110, 99, 108.9]\n\n# 任务：打印所有价格的总和，然后是保留 4 位小数的平均值\n',
        hint: '外面初始化，里面更新——顺序就是全部要领。',
        exampleNotes: { 0: '数据', 1: '循环之前初始化累计器——必须从零开始', 2: '遍历列表', 3: '循环内部：把当前元素加进 total，每轮覆盖', 4: '循环结束后：所有元素的总和' },
      },
      {
        explain: '"滚动值"只能使用当前和过去的数据——绝不向前偷看（这条规则让回测保持诚实）。逻辑：峰值从第一个价格开始；每天问"今天是否破纪录"。新语法：max(a, b) 返回两个值中较大的那个，所以 peak = max(peak, price) 表示"今天价格破纪录就更新，否则保持纪录"。循环前初始化、循环内更新、循环后打印。',
        starter: 'prices = [100, 110, 99, 108.9]\n\n# 任务：追踪滚动峰值，最后打印峰值\n',
        hint: 'max(peak, price)：谁大留谁——至今最高价。',
        exampleNotes: { 0: '数据', 1: '滚动峰值从第一个价格开始——只能用当前和过去的数据', 2: '按时间向前走', 3: 'max(peak, v)：谁大留谁——至今最高价', 4: '9：结束时见过的最高价' },
      },
      {
        explain: '回撤 = 当前价格低于滚动峰值的幅度，用分数表示：1 - price / peak（0 表示正好在峰值）。两个滚动值一起走——峰值只升不降，回撤只深不浅——循环内顺序很重要：先更新峰值，再衡量今天的跌幅。到结束时最深的那次跌幅就是最大回撤，每个基金每天报告的风险数字。',
        starter: 'prices = [100, 110, 99, 108.9]\n\n# 任务：打印这段走势的最大回撤，保留 4 位小数\n',
        hint: '两个滚动值并行：至今最高价，和相对它的最深跌幅。',
        exampleNotes: { 0: '数据', 1: '滚动峰值，同上一步', 2: '第二个滚动值：至今最深跌幅，从零开始', 3: '按时间向前走', 4: '先更新至今最高价', 5: '当前价格低于滚动峰值的幅度，用分数表示（0 = 在峰值）', 6: '保留两次跌幅中更深的那个', 7: 'round(..., 4) 打印干净：5 比 9 低 4/9，约 0.4444' },
      },
      {
        explain: '一条有故事的走势：涨到 120、跌到 90、回升、再深跌到 80、冲上 130。陷阱：谷值（80）必须对照它**之前**的峰值（120）衡量——不是对照起点（100），也不是对照之后的任何价格。只要滚动峰值循环的顺序正确，时间顺序会自动处理好。跟上一步同样的代码——只是数字更新了。',
        starter: 'prices = [100, 120, 90, 110, 80, 130]\n\n# 任务：打印这段走势的最大回撤，保留 4 位小数\n',
        hint: '答案是 1 - 80/120：80 比之前的峰值 120 低了多少？',
        exampleNotes: { 0: '示例数据：从 50 涨到 100，跌到 40，再回升到 80（与题目数字不同）', 1: '滚动峰值从第一个价格开始', 2: '至今最深跌幅，从零开始', 3: '按时间向前走', 4: '在跌到 40 之前，峰值先升到 100', 5: '跌到 40 时：1 - 40/100 = 0.6——谷值对照的是**之前的**峰值', 6: '0.6 就是这段示例走势的最大回撤', 7: '干净打印：0.6' },
      },
      {
        explain: '十二个腾讯真实每日收盘价，记录了一个走势较差的半月。第 2 课那个一模一样的滚动峰值循环，现在跑在真实行情上：只升不降的峰值、每日回撤分数、最深跌幅。最后那个数字（约 11%）就是风险系统每晚为每个持仓重新计算的数字。同样的代码——数字变成真的了。',
        starter: 'prices = [423.4, 417.8, 417.8, 410.4, 393.8, 382.4, 386.0, 386.4, 385.2, 387.6, 377.6, 383.6]  # 真实收盘价 2026-10-14..10-30\n\n# 任务：打印这个真实半月的最大回撤，保留 4 位小数\n',
        hint: '使用与挑战题完全相同的循环，只是这次换成真实价格。',
        exampleNotes: { 0: '2026 年 9 月末的三个真实收盘价', 1: '滚动峰值从第一个真实价格开始', 2: '至今最深跌幅从零开始', 3: '按时间顺序遍历真实交易日', 4: '保留至今最高的价格', 5: '记录相对该峰值的最深跌幅', 6: '这段真实走势的最大回撤——约 0.0227' },
      },
    ],
  },
  3: {
    title: '函数与条件',
    steps: [
      {
        explain: '函数是命名的、可复用的规则：定义一次，之后可重复使用。两半：定义已给出（def square(x): 命名并开启函数体）；示例调用 square(3) 时以 x=3 执行函数体。新语法：return 把值交回调用方——调用处 square(3) 就"变成"9，你可以打印它、存它、或继续传递。你的任务使用同一个定义，但要调用 square(4)。',
        starter: 'def square(x):\n    return x * x\n\n# 任务：用 4 调用 square 并打印返回结果\n',
        hint: '用括号加参数调用函数。',
        exampleNotes: { 0: 'def 定义函数：名字 square、输入槽 x、冒号开启函数体', 1: 'return 把结果交回调用方', 2: '用 3 调用：函数体执行，9 交回来并显示' },
      },
      {
        explain: '现在由你写两半。定义的解剖：def 行（关键字 def、简短小写名字、括号里的参数槽、冒号），然后缩进的函数体——这里是一行计算答案的 return。示例定义并调用 triple(7)；你的任务则用同样结构定义 double(x)，再调用 double(21)。这里没有新语法——都是你用过的部件，只是第一次由你组装。',
        starter: '# 任务：定义函数 double(x) 返回两倍的 x，然后打印 double(21)\n',
        hint: '三个部件：带冒号的 def 行、缩进的 return 行、调用行。',
        exampleNotes: { 0: '你自己的函数：命名 triple，一个参数 x', 1: '函数体：一行计算要交回的结果', 2: '调用：7 进去，21 出来' },
      },
      {
        explain: '最深的初学者困惑，一次说清。print() 只向人**显示**值——显示完值就没了。return 把值**交回**调用方：调用处 give(9) 变成 10，而 10 可以被存储、复用、组合。所以 y = give(9) 把返回的 10 存进 y，之后 y 一直可用。只打印忘记 return 的函数，调用方什么也拿不到（Python 悄悄返回 None）——记住这一点，后面的分类函数会用到。',
        starter: 'def give(x):\n    return x + 1\n\n# 任务：把 give(9) 的返回值存进变量 y，然后打印 y\n',
        hint: '调用方用赋值捕获返回值。',
        exampleNotes: { 0: '一个使用 return 而不是 print 的小函数', 1: 'return 把值交回调用方——它自己不显示任何东西', 2: '调用方可以捕获返回值存进变量——这就是 return 的力量', 3: '13——保存之后可以反复使用' },
      },
      {
        explain: '比较是在"提问"，答案是布尔值：True 或 False——一种独立的值类型。运算符：> < >= <= 比较；== 测试相等（两个等号！）。一个 = 是赋值，两个 == 是提问——搞混是经典 bug。细节：5 == 5.0 是 True，因为相等比较的是**值**而不是类型（int 5 和 float 5.0 装着同一个数）。布尔值是下一步 if 语句的燃料。',
        starter: '# 任务：一行打印三个判断——5 是否大于 3、5 是否小于 3、5 是否等于 5.0\n',
        hint: '5 和 5.0 的值相等，即使类型不同。',
        exampleNotes: { 0: '比较产生 True/False；== 是比较（一个 = 是赋值）；示例中 10 == 10.0 为 True，题目里的 5 == 5.0 同理——比较的是值，不是类型' },
      },
      {
        explain: '分支：根据条件执行不同代码。执行逻辑：条件从上到下测试；第一个为真的分支执行，其余全部跳过。结构与循环一致——冒号结尾的头部、缩进的体。elif（否则如果）只在上面全部为假时到达；else 兜底。三个 print 恰好只会执行一个——这正是分类器的意义。',
        starter: 'r = 0.075\n\n# 任务：r 大于零打印 "Positive"，小于零打印 "Negative"，正好为零打印 "Flat"\n',
        hint: '三个分支覆盖所有情况；只有一个会打印。',
        exampleNotes: { 1: '条件从上到下测试；第一个为真的分支执行，其余跳过', 3: 'elif = "否则如果"——只有上面的 if 为假才到达', 5: 'else 兜住前面所有没接住的' },
      },
      {
        explain: '边界决定分类器的生死：>= 把边界本身包含进来（正好 10 通过），> 则排除。专业习惯：先写边界表——10 进、9.999 出、0 出——再写代码，再逐行验证。两个分支都 return 字符串（函数做决定，调用方打印）；一次 print 里的两次调用把两个判定同行显示、空格分隔。',
        starter: '# 任务：写函数 check(x)：x 达到 10 返回 "pass"，否则返回 "fail"；一行打印 check(10) 和 check(9.99)\n',
        hint: '用 >= 让正好 10 也算通过；9.999 差一点不算。',
        exampleNotes: { 0: '示例函数使用 50 作为分数线，与题目的 10 不同', 1: '>= 包含边界本身：正好 50 通过', 6: '一次 print 两次调用：credit no credit 同行、空格分隔' },
      },
      {
        explain: '行业惯例（教学版）：宽基市场指数在两个月或更长时间里变动 20% 或更多才叫牛/熊——阈值 0.20 和 -0.20，边界包含，输入是小数收益率（0.25 就是 25%；不要再乘 100）。重要的告诫：这个惯例说的是宽基指数——单只股票涨 20% 不叫牛市。每个分支都 return；函数内部不打印。',
        starter: '# 任务：写 classify_regime(index_return)：达到 +0.20 返回 "Bull"，达到 -0.20 返回 "Bear"，否则 "Neutral"；一行打印它对 0.25、-0.10 和 0.0 的判定\n',
        hint: '在函数里返回字符串，不要直接打印；由调用函数的 print 输出结果。',
        exampleNotes: { 0: '示例分类器使用 0.5/-0.5，与题目的 0.20/-0.20 不同', 1: '边界包含：0.5 本身算 Strong', 7: 'Strong Mid——0.5 过线，0.3 留在线内' },
      },
      {
        explain: '你的分类器遇上真实历史：腾讯 2024 年春天两个月真实上涨 48.02%，2026 年秋天真实下跌 17.05%。为避免刷新后丢失上一步的函数，本步骤已经给出完整定义；你只需调用它并打印两个判定。连那次凶猛的真实下跌都停在 -0.20 线之上——规则故意定得这么严，所以 2024 年的大涨是唯一的 Bull。一次 print、两次调用、两个真实判定。',
        starter: 'def classify_regime(index_return):\n    if index_return >= 0.20:\n        return "Bull"\n    elif index_return <= -0.20:\n        return "Bear"\n    else:\n        return "Neutral"\n\n# 任务：使用上面已给出的 classify_regime，处理腾讯两个真实的两个月走势：\n# +0.4802（2024-03-05 -> 2024-05-16）和 -0.1705（2026-08-28 -> 2026-10-29）\n# 一行打印两个判定\n',
        hint: '只有 2024 年的大涨跨过 +20% 线；2026 年的下跌仍高于 -20% 线。',
        exampleNotes: { 0: '与题目相同的分类器和阈值；先演示，再在下方起始代码中给出完整定义', 2: '第一个分支返回 Bull', 4: '第二个分支返回 Bear', 6: '位于两条阈值之间时返回 Neutral', 7: 'Bull Neutral——另外两个真实区间，输入与题目不同' },
      },
    ],
  },
  4: {
    title: 'NumPy：向量化思维',
    steps: [
      {
        explain: 'NumPy 是数值计算引擎：数组长得像列表，但能对所有元素同时做算术。新语法，每个数值脚本开头都有：import numpy as np 加载库并起通用昵名 np；np.array(list) 把列表转换成数组。import 已给出——你的任务是转换并打印数组类型（ndarray 证明转换成功）。',
        starter: 'import numpy as np\n\nprices_list = [100.0, 110.0, 99.0, 108.9]\n\n# 任务：把 prices_list 转换成 NumPy 数组并打印数组类型\n',
        hint: 'np.array(list) 生成数组；type() 揭示它的类型。',
        exampleNotes: { 0: '以通用昵名 np 加载 NumPy', 2: 'np.array() 把列表转换成数组', 3: '类型是 ndarray——n 维数组' },
      },
      {
        explain: '数组自带工具箱——append 的点模式回归，而且更大：prices.mean() 一次调用返回所有元素的平均值，在优化过的机器码里算，不用写任何 Python 循环。这种"数据.方法()"的风格正是 pandas 的用法，现在就内化它。数组作为环境已给出；你的任务是一次方法调用。',
        starter: 'import numpy as np\n\nprices = np.array([100.0, 110.0, 99.0, 108.9])\n\n# 任务：一次调用打印所有元素的平均值，不许写循环\n',
        hint: '数组自带方法：mean() 对所有元素求平均。',
        exampleNotes: { 2: '一个价格数组，数字与题目不同', 3: '.mean() 一次调用求所有元素平均——不用写循环' },
      },
      {
        explain: '切片取连续片段：prices[1:] 从索引 1 取到末尾（丢掉第一个）；prices[:-1] 取到但**不包含**最后一个（丢掉最新一个）——缺省数字默认到边界。为什么恰好是这两个：每个收益率需要"今天"配"它的昨天"，所以"今天们"排除第一天（窗口内它没有昨天），"昨天们"排除最后一天。N 个价格产生 N-1 对——用 len() 对每个切片验证。',
        starter: 'import numpy as np\n\nprices = np.array([100.0, 110.0, 99.0, 108.9])\n\n# 任务：构建 today = 去掉第一个，yesterday = 去掉最后一个；一行打印两者的长度\n',
        hint: '四个价格意味着三对今天/昨天。',
        exampleNotes: { 2: '四个价格：N = 4', 3: 'x[1:] = 从第 2 个到末尾——丢掉第一个（今天的集合）', 4: 'x[:-1] = 除最后一个之外的全部——丢掉最新一个（昨天的集合）', 5: '两个长度都是 N-1 = 3：四个价格给三对今天/昨天' },
      },
      {
        explain: '新语法：zip(a, b) 让两个序列**并排**走，每轮交给你一对；for t, y in zip(today, yesterday) 把每一对解包成 t 和 y。zip 在较短的序列处停止（这里构造上等长）。脑中要建立的对应逻辑：110 配 100、99 配 110、108.9 配 99——每个收益率的分子旁边是它自己的分母。',
        starter: 'import numpy as np\n\nprices = np.array([100.0, 110.0, 99.0, 108.9])\n\n# 任务：每行打印一对（今天, 昨天），今天在前\n',
        hint: 'zip() 让两个序列并排走。',
        exampleNotes: { 3: 'zip() 并排走两个切片：(20,10)、(30,20)', 4: '每轮拿到今天 t 和它的昨天 y' },
      },
      {
        explain: '本课的收获：today / yesterday - 1 用数组一次性完成所有除法——一行代码、三次除法、零循环；那一行就是向量化。显示卫生：浮点噪声是真实存在的（负百分之十可能是 0.099999…），所以打印时对每个值 round(float(r), 4)——float() 把 NumPy 标量转成普通 Python 数，round 处理起来干净。先向量化，最后取整。',
        starter: 'import numpy as np\n\nprices = np.array([100.0, 110.0, 99.0, 108.9])\n\n# 任务：用一行向量化代码算出所有日收益率，然后逐个保留 4 位小数打印\n',
        hint: '取整能藏住浮点噪声（比如 0.099999…），让输出干净可读。',
        exampleNotes: { 2: '数据', 3: '向量化的一行：每一对今天/昨天同时相除——没有循环', 4: '循环只是为了干净地打印', 5: 'float() 把 NumPy 标量转成普通数；round 消掉浮点噪声' },
      },
      {
        explain: '会咬人的记账问题：4 个价格产生 3 个收益率，而第一个收益率属于第二个日期——星期一在窗口内没有前一天，所以收益率对齐的是 dates[1:]。日期对齐搞错（差一）会悄悄污染回测——这就是它独占一步的原因。新语法：print(*list)——星号把列表**解包**，每个元素以空格分隔打印在一行，而不是显示 Python 的列表括号。不加星号你会得到 [\'Tue\', \'Wed\', \'Thu\']；加了你得到 Tue Wed Thu。',
        starter: 'dates = ["Mon", "Tue", "Wed", "Thu"]\n\n# 任务：按顺序一行打印拥有收益率的那些日期\n',
        hint: '跳过第一个日期——它在窗口内没有昨天。print(*dates[1:]) 用星号解包。',
        exampleNotes: { 0: 'N=3 个日期但只有 N-1=2 个收益率——收益率属于 days[1:] 往后', 1: '* 解包切片：print(*days[1:]) 每个元素空格分隔打印在一行——不是带括号的列表' },
      },
      {
        explain: '两种世界观，互相验证。循环路线已给出（第 2 课的思路），其中两个新东西已解释：range(1, len(prices)) 生成 1、2、…在 len 之前停——每个"今天"的索引；+= 表示"加到我自己身上"。你的任务是向量化路线：切片、相除、减一，并记住数组自带 .sum() 对元素求和。两条路线打印同一个数字是数据工作里最便宜的验证——常用它。',
        starter: 'import numpy as np\n\nprices = np.array([10, 20, 30])\nloop_total = 0.0\nfor i in range(1, len(prices)):\n    loop_total += prices[i] / prices[i - 1] - 1\n\n# 任务：用向量化方式算出同样的总和，然后一行打印两个总和（都保留 4 位）\n',
        hint: '两条不同的路线，同一个终点。',
        exampleNotes: { 2: '示例价格与题目不同', 3: '路线 1：先初始化累计器，第 2 课的思路', 4: '每个 i 是"今天"的索引；range 在 len(prices) 之前停止', 5: '把每个收益率加进总和', 6: '路线 2：一行向量化版本，然后 .sum()', 7: '数字完全一致——两条路线，一个终点' },
      },
      {
        explain: '2026 年 10 月最后一周的五个真实收盘价。一行向量化代码（切片、相除、减一）产出四个真实市场收益率；打印时各保留 4 位小数。注意真实数据与课堂数字的不同：-2.58% 和 +1.59% 的日子并排出现——每个量化数据集都从这个粒度开始。',
        starter: 'import numpy as np\n\nprices = np.array([386.4, 385.2, 387.6, 377.6, 383.6])  # 真实收盘价 2026-10-26..30\n\n# 任务：向量化计算全部四个真实日收益率，逐个保留 4 位小数打印\n',
        hint: '一行切片计算，再用一个循环逐个打印；真实价格也使用课堂上学过的相同写法。',
        exampleNotes: { 2: '2026 年 10 月中旬的五个真实收盘价（与题目区间不同）', 3: '对真实价格使用向量化计算', 4: '循环只用于逐个打印保留 4 位小数后的值', 5: '每个真实日收益率，保留 4 位小数' },
      },
    ],
  },
  5: {
    title: 'pandas I：Series、DataFrame 与真实数据',
    steps: [
      {
        explain: 'pandas 从这里开始。新语法：pd.Series(values, index=labels) 创建一个一维列，元素带**标签**而不是光秃秃的位置——index= 可省略（默认 0,1,2…）；标签让读取自描述。选择：s["Tue"] 按**标签**取值，引号必须有（它是字符串）。标签正是 pandas 统治时间序列的原因：日期成为索引，对齐按日期自动发生。',
        starter: 'import pandas as pd\n\n# 任务：构建一个 Series，值为 [100.0, 110.0, 99.0, 108.9]，标签为 Mon/Tue/Wed/Thu，然后打印周二的值\n',
        hint: '方括号里可以直接用标签，不一定只用数字。',
        exampleNotes: { 0: '以昵名 pd 加载 pandas', 2: '带标签 a、b 的 Series——替代了 0、1', 3: '方括号直接接受标签：b 处存的值' },
      },
      {
        explain: 'dict 字面量（作为环境给出）把每个列**名**映射到它的值列表——花括号、键: 值对；这是手工建表的标准配方。新语法：pd.DataFrame(data) 把这个 dict 包成真正的表——列保留键名，行共享一个索引。它的 .shape 返回 (行数, 列数)：对任何新表的第一个体检（3×3 与你敲的一致吗？）。',
        starter: 'import pandas as pd\n\ndata = {\n    "Date": ["Wed", "Mon", "Thu"],\n    "Close": [99.0, 100.0, 108.9],\n    "Adj Close": [99.0, 100.0, 108.9],\n}\n\n# 任务：把 data 变成 DataFrame 并打印它的形状\n',
        hint: 'shape 是 (行, 列)。',
        exampleNotes: { 2: 'dict 把列名映射到值列表，再交给 DataFrame 建表', 3: 'shape = (行, 列)：这里是 2 行、2 列' },
      },
      {
        explain: '选择一列：df["Adj Close"] 把该列作为 Series 返回——方括号加**精确**的列名（引号里），大小写也算数。我们刻意追踪**复权**收盘价：拆股和分红会让原始价格机械跳变，复权价格让收益率保持诚实（一拆五不是 80% 的暴跌）。新语法：.tolist() 把 Series 转成普通 Python 列表——从 pandas 回到第 1–3 课世界的桥。',
        starter: 'import pandas as pd\n\ndata = {"Date": ["Wed", "Mon", "Thu"], "Adj Close": [99.0, 100.0, 108.9]}\ndf = pd.DataFrame(data)\n\n# 任务：把 Adj Close 列打印成普通 Python 列表\n',
        hint: '.tolist() 把 Series 变成普通 Python 列表。',
        exampleNotes: { 3: 'df["A"] 选出一列（一个 Series）；.tolist() 变成普通 Python 列表' },
      },
      {
        explain: '专业习惯第一条：在任何计算之前先审问表格。真实工作常用的检查工具包括 df.head()（看前几行）、df.info()（列、类型和缺失情况）和 df.dtypes（每列类型）；本示例没有演示这三个方法，而是用 len(df) 和列的 .max() 做两项快速检查。任务把这两个事实合进一次逗号分隔的打印——与 NumPy 的 mean 同一个点模式，一套工具到处用。',
        starter: 'import pandas as pd\n\ndata = {"Date": ["Wed", "Mon", "Thu"], "Adj Close": [99.0, 100.0, 108.9]}\ndf = pd.DataFrame(data)\n\n# 任务：一行打印行数和最高复权价\n',
        hint: '一个给出表的高度，另一个给出列最大值。',
        exampleNotes: { 2: '一个小表', 3: '先体检：几行、列最大值——之后才敢做计算' },
      },
      {
        explain: '收益率只有在**时间顺序**下才有意义——而这张表故意是乱的。新语法：df.sort_values("Date") 返回一张按给定列重排行序的**新表**（它不改动原表——你要重新赋值，示例就是这么做的）。故意埋的教学陷阱：这些日期是普通**字符串**，所以按**字母序**排（Mon < Thu < Wed），不是按日历——真实管线用真正的日期类型解决。在你打印的列表里亲眼验证顺序。',
        starter: 'import pandas as pd\n\ndata = {"Date": ["Wed", "Mon", "Thu"], "Adj Close": [99.0, 100.0, 108.9]}\ndf = pd.DataFrame(data)\n\n# 任务：按 Date 排序，把排序后表格的复权价列打印成列表\n',
        hint: '三个星期几的字母序决定了行序——先动手排一遍。',
        exampleNotes: { 2: '故意乱序的行', 3: 'sort_values 按 D 列重排行——普通字符串按字母序排（a, b, c）', 4: 'V 现在跟着排好的顺序走：[1, 2, 3]' },
      },
      {
        explain: 'pct_change() 替你完成第 4 课整套切片流程：每个值除以前一个、减一，以小数给出。关键细节：**第一个**元素没有前值，所以变成 NaN——pandas 拼写"未知"的方式。NaN 不是零：零声称那天持平，NaN 诚实地说没有信息。新语法：r.isna() 逐项测试（NaN 处为 True）；r.iloc[1] 按**位置**选择——第一个真实收益率。',
        starter: 'import pandas as pd\n\nadj = pd.Series([100.0, 110.0, 99.0, 108.9])\n\n# 任务：用 pct_change 计算收益率；先打印 NaN 模式，再打印第一个真实收益率（保留 4 位）\n',
        hint: 'isna() 标出缺失的第一项；iloc[1] 是第一个真实收益率。',
        exampleNotes: { 2: '两个示例价格', 3: 'pct_change = 每个值 ÷ 前一个 − 1，小数形式', 4: 'isna() 标出缺失的第一项——是"未知"，不是零', 5: 'iloc[1] 按位置取——第一个真实收益率：3.0/2.0 − 1 = 0.5' },
      },
      {
        explain: '波动率从离散度开始：日收益率的标准差。跨库陷阱：pandas 的 .std() 默认 ddof=1——**样本**公式，除以 N-1（从样本出发的诚实度量）；NumPy 的 np.std() 默认 ddof=0——总体公式。同样数据、略不同的数字；量化工作中你必须**知道**自己算的是哪种（本课程统一用样本）。环境里给了一个新工具：.dropna() 移除 NaN 项——永远不要把 NaN 喂给统计量。',
        starter: 'import pandas as pd\n\nadj = pd.Series([100.0, 110.0, 99.0, 108.9])\nr = adj.pct_change().dropna()\n\n# 任务：打印收益率的样本标准差，保留 4 位\n',
        hint: '先 dropna()——NaN 会毒化计算。',
        exampleNotes: { 2: '一个收益率序列', 3: '.std() 默认是样本标准差（ddof=1，除以 N−1）——NumPy 的 np.std() 默认 ddof=0，必须声明用哪种' },
      },
      {
        explain: '由你组装的完整管线，从给出的 Series 出发：pct_change() 得小数收益率；dropna() 清掉未知的第一个；.std()（样本，ddof=1）得日离散度；再乘 √252 拉伸到全年——新语法 np.sqrt(x)，NumPy 的平方根（252 ≈ 每年交易日数）。这个惯例假设日波动大致独立；把结果当作**估计值**，不是自然常数。把四个阶段链成一个表达式。',
        starter: 'import numpy as np\nimport pandas as pd\n\nadj = pd.Series([100.0, 110.0, 99.0, 108.9])\n\n# 任务：打印年化波动率（保留 4 位）——pct_change 得收益率、样本标准差、乘 sqrt(252)\n',
        hint: '日离散度（约 0.1155）乘上 sqrt(252) ≈ 15.87。',
        exampleNotes: { 0: '加载 NumPy（为了 sqrt）和 pandas', 3: '一个日收益率序列', 4: '日离散度拉伸到全年：× √252（252 个交易日）。是约定，不是定律' },
      },
      {
        explain: '真实数据上的毕业题：21 个真实交易日，完整管线亲手写——pd.Series(closes)（普通列表可以直接转换）、pct_change()、dropna()、样本标准差、× np.sqrt(252)。最后一个数字：2026 年 10 月市场给腾讯定价的真实年化波动率（约 28%——很高；那个月很颠）。财经文章说 vol 时，背后就是这么算的。',
        starter: 'import numpy as np\nimport pandas as pd\n\ncloses = [431.0, 421.2, 423.0, 428.2, 420.6, 411.4, 424.8, 425.8, 425.2, 423.4, 417.8, 417.8, 410.4, 393.8, 382.4, 386.0, 386.4, 385.2, 387.6, 377.6, 383.6]  # 真实收盘价 2026-09-30..10-30\n\n# 任务：用 closes 构建 Series，然后打印 2026 年 10 月的年化波动率（保留 4 位）\n',
        hint: '把第 6–8 步串起来：pct_change → 样本标准差 std（ddof=1）→ sqrt(252)，没有新语法。',
        exampleNotes: { 5: '把日离散度拉伸到全年：× √252（252 个交易日）。这是约定，不是定律' },
      },
    ],
  },
  6: {
    title: 'pandas II：索引、滚动窗口与均线交叉',
    steps: [
      {
        title: '真正的日历索引',
        explain: '第 5 课故意暴露了星期字符串的问题，现在修复它：pd.to_datetime(list) 把 ISO 日期文本（YYYY-MM-DD）转换成时间戳，再用 index=dates 附加到 Series。此后排序与切片都遵循日历。新的显示链 .index.strftime("%Y-%m-%d").tolist() 把时间戳标签变回易读日期字符串，只用于打印，不参与计算。先构建带日期的 Series，再打印全部标签。',
        starter: 'import pandas as pd\n\ndates = pd.to_datetime(["2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05"])\nprices = [100.0, 102.0, 101.0, 104.0]\n\n# 任务：用 prices 和 dates 构建带日期索引的 close Series，再以 YYYY-MM-DD 格式打印全部日期标签\n',
        hint: '组合 pd.Series(prices, index=dates) 与示例的 index.strftime(...).tolist() 显示链。',
        exampleNotes: {2: 'to_datetime 把文本转换成真正时间戳，而不是星期字符串', 4: 'strftime 格式化每个索引标签；tolist 转成普通列表'},
      },
      {
        title: 'loc——按日期标签选择',
        explain: '.loc 表示“标签位置”。close.loc["2024-01-04"] 查询某个日期，不是第 2024 或第 1 行。标签切片 close.loc[start:end] 同时包含起点和终点——这与 Python、iloc 排除终点的规则不同，因此日历窗口读起来很自然。.loc[rows, columns] 的逗号形式也适用于 DataFrame；这里 Series 只需要行。float() 把选出的 pandas 标量转成普通数值便于打印，.tolist() 输出整个窗口。',
        starter: 'import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 104.0, 103.0], index=pd.to_datetime(["2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-08"]))\n\n# 任务：打印 2024-01-04 的收盘价，再打印 2024-01-03 至 2024-01-05（含两端）的收盘价\n',
        hint: '使用两次 loc：一次是精确标签，一次是 start:end 标签切片。切片两端都会保留。',
        exampleNotes: {3: 'loc[一个标签] 取得该日期对应的值', 4: 'loc 日期切片包含两个端点：这里有三行'},
      },
      {
        title: 'iloc——按位置选择',
        explain: '.iloc 表示“整数位置”：从零开始，与 NumPy 一致。close.iloc[0] 是第一行，close.iloc[-1] 是最新一行。切片 close.iloc[1:4] 包含位置 1、2、3，排除 4。要有意识地选择：loc 回答“在这个日期”；iloc 回答“在这个行位置”。混淆两者可能悄悄选错数据。任务：选择最新收盘价，再把位置 1 至 3 打印成列表。',
        starter: 'import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 104.0, 103.0], index=pd.to_datetime(["2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-08"]))\n\n# 任务：用 iloc 打印最新收盘价，再把位置 1、2、3 打印成列表\n',
        hint: '最新位置是 -1。要包含位置 3，iloc 切片的终点必须写 4。',
        exampleNotes: {3: 'iloc[-1] 表示最后一个位置，与日期无关', 4: '包含位置 1 和 2，排除位置 3'},
      },
      {
        title: '布尔筛选——保留符合条件的日期',
        explain: '对整个 Series 做比较会生成布尔掩码——每个日期对应一个 True/False。把掩码交给 .loc，只保留 True 的行，并保留日期顺序和标签。这就是声明式筛选：写一次规则，无需循环。close.loc[close > 103] 读作“close 中大于 103 的部分”。任务：保留严格大于 103 的收盘价，先打印日期，再打印值。严格大于意味着 103 本身不入选。',
        starter: 'import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 104.0, 103.0, 106.0], index=pd.to_datetime(["2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-08", "2024-01-09"]))\n\n# 任务：保留大于 103 的收盘价；以 YYYY-MM-DD 格式打印日期，再打印对应值\n',
        hint: '先写 selected = close.loc[close > 103]，再用示例的方法打印 selected.index 和 selected。',
        exampleNotes: {3: 'close > 11 生成 True/False 掩码；loc 只保留 True 行', 4: '保留下来的日期仍与值一一对应'},
      },
      {
        title: 'rolling——向前行走的窗口',
        explain: 'rolling(n).mean() 用当前行和之前 n-1 行计算移动平均。窗口为 3 时，位置 0 和 1 是 NaN，因为还没有完整的三个价格；NaN 不是卖出信号，也不是零。窗口每次向前移动一行，绝不使用未来价格。任务：计算三日移动平均，打印哪些项缺失，再打印最后一个移动平均值，保留四位小数。',
        starter: 'import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 104.0, 103.0, 106.0])\n\n# 任务：计算 ma3 = 3 行滚动均值；打印 NaN 模式，再打印最后一个值（保留 4 位）\n',
        hint: '最后一个完整窗口包含 104、103、106。rolling(3).mean() 会计算所有窗口。',
        exampleNotes: {3: 'rolling(3).mean() 对当前行和之前两行求平均', 4: '前两个窗口不完整，所以值为 NaN', 5: '最后均值是 (12 + 14 + 16) / 3 = 14'},
      },
      {
        title: '快慢均线变成目标仓位',
        explain: '快均线反应迅速，慢均线保留更长记忆。本课规则是 fast > slow 时目标持有，否则空仓。比较产生 True/False，.astype(int) 把它们转换成 1/0——这是目标仓位，还不是交易。含早期 NaN 的比较结果为 False，因此热身行安全地从零开始。任务：构建 2 行和 3 行均值，把 fast > slow 转成 target，并打印完整列表。',
        starter: 'import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\n\n# 任务：创建 fast（2 行）、slow（3 行），再令 fast > slow 时 target=1，否则为 0；打印 target\n',
        hint: '依次使用 .rolling(2).mean()、.rolling(3).mean()，再对比较结果调用 .astype(int)。',
        exampleNotes: {3: 'fast 对两个价格反应；slow 代表更长的三个价格记忆', 5: 'fast > slow 产生布尔值；astype(int) 把 True 映射为 1、False 为 0', 6: '1 表示目标持有，0 表示目标空仓；早期 NaN 比较为 False'},
      },
      {
        title: '交叉必须同时看昨天和今天',
        explain: '连续五天位于慢均线上方是一个状态，不是五个新买入信号。交叉是一次“转变”：金叉是昨天 0、今天 1；死叉是昨天 1、今天 0。shift(1) 把昨天的目标放到今天旁边。新语法：& 连接两个布尔 Series，每个比较都必须单独加括号。最后 close.index[golden] 保留事件掩码为 True 的日期。任务：依次打印金叉日期和死叉日期。',
        starter: 'import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0], index=pd.to_datetime(["2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-08", "2024-01-09", "2024-01-10", "2024-01-11"]))\nfast = close.rolling(2).mean()\nslow = close.rolling(3).mean()\ntoday = (fast > slow).astype(int)\nyesterday = today.shift(1)\n\n# 任务：创建 golden 和 death 事件掩码，再以 YYYY-MM-DD 格式打印日期，先金叉后死叉\n',
        hint: 'golden = (today == 1) & (yesterday == 0)。反转状态得到 death，再用 close.index[mask].strftime(...).tolist()。',
        exampleNotes: {5: 'today 是当前 0/1 状态，不是事件', 6: 'shift(1) 把值向后移动一行：今天可以看到之前的状态', 7: '金叉是 0 → 1；每个比较必须加括号', 8: '死叉是 1 → 0；& 连接两个布尔 Series'},
      },
      {
        title: '小挑战——MA5 / MA20 交叉信号',
        explain: '现在在 30 个工作日的路径上运行完整事件管线：5 行快均线、20 行慢均线、当前目标、前一期目标，再得到两个转变掩码。慢速 MA20 需要二十个观测，因此早期行不能产生有效信号。数据是合成的，并刻意保持可手工审计的规模；真实报告还要记录数据来源、执行时点和成本。先打印金叉日期，再打印死叉日期。不要直接打印答案日期——必须从价格推导。',
        starter: 'import pandas as pd\n\nclose = pd.Series([120, 118, 116, 114, 112, 110, 108, 106, 104, 102, 100, 98, 96, 94, 92, 90, 92, 94, 96, 98, 100, 102, 104, 102, 100, 98, 96, 94, 92, 90], index=pd.date_range("2024-01-02", periods=30, freq="B"))\n\n# 任务：计算 MA5 和 MA20，再以 YYYY-MM-DD 格式打印金叉日期与死叉日期\n',
        hint: '完整复用上一步，只把滚动窗口改成 5 和 20。每个掩码都比较 today 与 today.shift(1)。',
        exampleNotes: {2: 'pd.date_range(..., freq="B") 生成工作日标签，但不处理节假日', 3: '示例使用更短窗口和不同价格路径', 6: '只标记状态转变，不标记每个高于慢均线的日子'},
      },
    ],
  },
  7: {
    title: 'pandas III：分组、合并与可视化摘要',
    steps: [
      {
        title: '从时间戳到月份标签',
        explain: '月度分析先给每个日度行分配月份键。对真正的日期时间列，.dt.to_period("M") 把时间戳转换成日历月份；.astype(str) 显示成 YYYY-MM。df["Month"] = ... 添加新列，不改变原始日期。相比按字符位置切文本，这种方法让 pandas 真正理解日期。任务：给三行表格添加 Month，并按原行顺序打印。',
        starter: 'import pandas as pd\n\ndf = pd.DataFrame({"Date": pd.to_datetime(["2024-01-30", "2024-01-31", "2024-02-01"]), "Return": [0.01, 0.03, -0.02]})\n\n# 任务：添加 YYYY-MM 形式的 Month 列，再把 Month 列打印成列表\n',
        hint: '完整复制示例的 .dt.to_period("M").astype(str) 链，并赋值给 df["Month"]。',
        exampleNotes: {3: '.dt 打开日期时间工具；to_period("M") 把每个时间戳归入日历月份', 4: 'astype(str) 生成可读标签，准备分组'},
      },
      {
        title: 'groupby——拆分、计算、合并',
        explain: 'groupby 包含三个思想：按键拆分（SPLIT）行、在每组内计算（APPLY）、合并（COMBINE）答案。df.groupby("Month")["Return"].mean() 因此得到每月一个均值，而不是全表一个均值。方括号先选择 Return，再计算。这里组按 Month 键排序，Series.round(4) 统一保留显示位数。任务：计算每月日收益率均值，以列表打印四位小数结果。',
        starter: 'import pandas as pd\n\ndf = pd.DataFrame({"Month": ["2024-01", "2024-01", "2024-01", "2024-02", "2024-02", "2024-02"], "Return": [0.01, 0.03, -0.02, 0.04, 0.01, 0.0]})\n\n# 任务：按 Month 计算 Return 均值，并把保留 4 位的结果打印成列表\n',
        hint: '依次链接 groupby("Month")、["Return"]、.mean()，再 round 和 tolist。',
        exampleNotes: {3: '按 Month 拆分行、选择 Return、对每组求 mean，再合并结果', 4: 'Series.round(4) 为显示统一取整；组按键排序出现'},
      },
      {
        title: '一份摘要，多个统计量',
        explain: '报告常同时需要数量、均值和波动率。命名聚合在 .agg(...) 中写成 输出名=("Return", "统计方法")：Days 计数，Mean 求均值，Vol 计算样本标准差（pandas ddof=1）。组键成为索引。新的显示语法：summary.itertuples() 每次产生一行；row.Index、row.Days、row.Mean 读取字段。任务：按 Month 构建 Days、Mean、Vol，逐行打印 Month、Days、Mean、Vol，两个统计值保留四位小数。',
        starter: 'import pandas as pd\n\ndf = pd.DataFrame({"Month": ["2024-01", "2024-01", "2024-01", "2024-02", "2024-02", "2024-02"], "Return": [0.01, 0.03, -0.02, 0.04, 0.01, 0.0]})\n\n# 任务：按 Month 聚合 Return 的 Days=count、Mean=mean、Vol=样本 std\n# 每月打印一行：Month Days Mean Vol，Mean 和 Vol 保留 4 位\n',
        hint: '按示例写三个命名聚合，再用 itertuples()；月份字段是 row.Index。',
        exampleNotes: {3: '命名聚合：输出名 = (输入列, 计算方法)；std 是样本标准差', 4: 'itertuples 每次访问一行结果；Index 是组键', 5: 'row.Mean 读取命名结果列；每月打印一行'},
      },
      {
        title: '月收益要复利，不能直接相加',
        explain: '日收益会复利：经历 a、b 两段收益后，1 元变成 (1+a)(1+b)，直接相加忽略了每天本金基数变化。我们创建 Growth = 1 + Return，用 .prod() 乘起每月增长因子，最后减 1。乘法本身不依赖顺序，但原始日度行仍必须代表有效的连续收益。任务：计算每月复合收益，保留四位小数并打印成列表。',
        starter: 'import pandas as pd\n\ndf = pd.DataFrame({"Month": ["2024-01", "2024-01", "2024-01", "2024-02", "2024-02", "2024-02"], "Return": [0.01, 0.03, -0.02, 0.04, 0.01, 0.0]})\n\n# 任务：用增长因子在每个月内复合日收益，再打印保留 4 位的月收益\n',
        hint: '创建 Growth = 1 + Return，按 Month 分组，调用 prod()，减 1，再取整。',
        exampleNotes: {3: '收益 r 让 1 元变成 1+r 元，这就是增长因子', 4: 'prod 在每月内乘起因子；减 1 转回小数收益', 5: '一月是 1.1 × 1.2 − 1 = 0.32，不是 0.30'},
      },
      {
        title: 'merge——按键对齐两张表',
        explain: 'merge 通过共享“键”对齐行，而不是祈祷两张表恰好同序。on="Month" 指定键；how="left" 保留左侧 stock 的每一行并附加匹配行情；validate="one_to_one" 在任一侧键重复时主动报错。之后总要检查 .shape：重复键可能让行数膨胀，inner join 又可能悄悄丢行。任务：左合并两张表，打印结果形状，再打印 Market 的缺失模式。',
        starter: 'import pandas as pd\n\nstock = pd.DataFrame({"Month": ["2024-01", "2024-02", "2024-03"], "Stock": [0.02, 0.05, -0.01]})\nmarket = pd.DataFrame({"Month": ["2024-01", "2024-03"], "Market": [0.01, 0.02]})\n\n# 任务：按 Month 把 market 左合并到 stock，并做 one_to_one 校验；打印 shape，再打印 Market 的 NaN 模式\n',
        hint: '二月没有市场行，所以保留的股票行会得到 NaN。使用 merged["Market"].isna().tolist()。',
        exampleNotes: {4: 'on="Month" 匹配相同键；left 保留所有股票行；validate 检查两侧键唯一', 5: 'shape 确认合并没有意外复制或丢失行'},
      },
      {
        title: '主动收益——策略减基准',
        explain: '主动收益衡量相对基准的表现：同一月份 Active = Stock − Market。股票收益为正，仍可能因市场涨得更多而主动收益为负。合并后，对齐列让这步成为一次向量化减法。pandas 的 .mean() 默认跳过 NaN，这很方便，但不代表可以忽略缺失——上一步的缺失掩码也是报告的一部分。任务：创建 Active，打印缺失模式，再打印可用月份均值（四位小数）。',
        starter: 'import pandas as pd\n\nmerged = pd.DataFrame({"Month": ["2024-01", "2024-02", "2024-03"], "Stock": [0.02, 0.05, -0.01], "Market": [0.01, float("nan"), 0.02]})\n\n# 任务：创建 Active = Stock - Market；打印 NaN 模式，再打印可用值的均值（保留 4 位）\n',
        hint: '一月主动收益 +0.01，三月 −0.03。可用均值是 −0.01；二月仍是未知。',
        exampleNotes: {3: '对齐列逐行相减：主动收益相对基准衡量', 5: '均值使用可用观测；缺失值要另外检查'},
      },
      {
        title: '无隐藏依赖的可视化摘要',
        explain: '图表应该回答问题，而不只是装饰。这里每个 █ 代表一个百分点，+/− 表示方向，条形长度让月份比较一眼可见。新语法：abs(x) 是绝对值，"█" * n 重复 n 次，int() 转成整数，index=False 去掉额外行号字段。文本图是刻意设计：本浏览器课程不会假装安装了 matplotlib。同样的标签和尺度可交给配置好桌面环境的 df.plot()。任务：按每个百分点一个块，画出三个月收益。',
        starter: 'import pandas as pd\n\nsummary = pd.DataFrame({"Month": ["Jan", "Feb", "Mar"], "Return": [0.03, -0.02, 0.01]})\n\n# 任务：逐行打印 Month、方向（+/-），并按每个百分点一个 █ 画出条形\n',
        hint: '复用示例循环。abs(Return) × 100 就是百分点块数。',
        exampleNotes: {3: 'itertuples(index=False) 只提供命名数据列', 4: '一个块代表一个百分点；abs 用幅度决定条长', 5: '符号表示方向；重复字符串画出文本条', 6: '无需额外依赖，可在本浏览器运行时直接执行'},
      },
      {
        title: '小挑战——月度市场收益报告',
        explain: '组装完整报告。给定日表已经完成合并。用 pct_change 计算 StockReturn 和 MarketReturn，删除首个未知行，再添加 Month。分别为两列收益创建增长因子，按 Month 分组，用 prod() 相乘并减 1，再用 pd.concat([stock_monthly, market_monthly], axis=1) 并排合并。新语法：axis=1 表示作为列并排；.columns=["Stock", "Market"] 命名。最后 Active = Stock − Market。打印 Month、Stock、Market、Active，数值保留四位小数。',
        starter: 'import pandas as pd\n\nprices = pd.DataFrame({"Date": pd.to_datetime(["2024-01-30", "2024-01-31", "2024-02-01", "2024-02-02", "2024-02-05", "2024-02-06"]), "Stock": [100.0, 102.0, 101.0, 100.0, 101.0, 103.0], "Market": [200.0, 202.0, 201.0, 200.0, 202.0, 204.0]})\n\n# 任务：从日价格构建复合月收益 Stock 和 Market，再计算 Active = Stock - Market\n# 每月打印 Month Stock Market Active，数值保留 4 位\n',
        hint: '先算两列 pct_change，再 dropna。分别分组 GrowthStock 和 GrowthMarket，用 axis=1 拼接、重命名，再加 Active。',
        exampleNotes: {4: 'pct_change 创建日收益；首个未知行不能变成零', 5: 'dropna 删除未知行；copy 创建独立表', 7: '示例使用增长因子列，与任务采用同一套已学方法'},
      },
    ],
  },
  8: {
    title: '毕业项目：透明的 pandas 回测',
    steps: [
      {
        title: '信号是目标，下一根 bar 才执行',
        explain: '最重要的反前视规则：由今天收盘计算的信号，不能赚今天收盘到收盘的收益。本课采用“收盘到下一收盘”模型：在 bar t 计算 target，再通过 target.shift(1) 成为 bar t+1 的 held。fillna(0) 明确令首个 held 为零；astype(int) 恢复整齐的 0/1 列表。这模拟下一 bar 执行，不承诺任何特定订单类型。任务：用 MA2 > MA3 计算 target，延迟一根 bar，并依次打印 target、held。',
        starter: 'import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\n\n# 任务：MA2 > MA3 时 target=1；held 为延迟一根 bar 的 target，首个值为 0；打印两个列表\n',
        hint: 'held = target.shift(1).fillna(0).astype(int)。注意 target 的第一个 1 到下一行才进入 held。',
        exampleNotes: {3: 'target 只使用当前收盘时已知的信息', 4: 'shift(1) 延迟一根 bar；fillna(0) 从无仓位开始', 5: 'target 是想持有什么；held 才赚取下一根 bar'},
      },
      {
        title: '仓位 × 市场收益 = 毛策略收益',
        explain: '时点对齐后，毛日策略收益就是 held × asset_return。空仓在成本前收益为零；持仓则获得该 bar 的市场收益。这里把首个市场收益填成零，只因为初始 held 也是零，且报告之前没有交易——一般情况下绝不能悄悄把未知收益写成零。任务：沿用第 1 步 held，计算市场与毛收益，打印 held，再打印毛收益之和（四位小数）。这个和只是诊断，还不是复合业绩。',
        starter: 'import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\ntarget = (close.rolling(2).mean() > close.rolling(3).mean()).astype(int)\n\n# 任务：把 target 延迟成 held；计算 asset_return 和 gross_return\n# 打印 held，再打印 gross_return 之和（保留 4 位）\n',
        hint: '只有 held=1 的那一行有贡献：103 / 101 − 1 ≈ 0.0198。',
        exampleNotes: {5: '首个市场收益未知；本报告初始空仓，所以明确设为零', 6: 'held=1 获得该 bar 收益；held=0 在成本前为零'},
      },
      {
        title: '换手率只统计真实变化',
        explain: '一直持有不是新交易。换手率衡量仓位变化：held.diff().abs() 对 0→1 或 1→0 给出 1，不变时为 0。首个 diff 没有前值，因此 fillna(held.abs()) 把初始持仓计为入场。int(turnover.sum()) 统计简化多头/空仓模型中的仓位变化次数。任务：从给定 held 路径推导 turnover 和 trades，打印换手率列表，再打印交易事件数。',
        starter: 'import pandas as pd\n\nheld = pd.Series([0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0])\n\n# 任务：用绝对仓位变化计算 turnover，首行使用 abs(初始 held)\n# 打印 turnover，再打印 int(turnover.sum())\n',
        hint: '这里有一次入场和一次出场。diff().abs() 能找到两者；初始仓位为零。',
        exampleNotes: {2: 'diff 比较当前与前一 bar；abs 对称统计入场和出场', 3: '首个 diff 未知，因此改用初始仓位绝对值', 4: '本教学模型中 0→1 和 1→0 各算一次交易事件'},
      },
      {
        title: '成本把毛收益变成净收益',
        explain: '忽略交易成本的回测会美化频繁策略。本教学模型在每次仓位变化时收取 cost_rate × turnover，并从该 bar 毛收益扣除。真实执行还可能有点差、滑点、税费和市场冲击；单一费率是需要披露的假设，不是普遍真理。任务：用 0.001 成本率计算 net_return，依次打印总成本和净收益之和，均保留四位小数。',
        starter: 'import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\ntarget = (close.rolling(2).mean() > close.rolling(3).mean()).astype(int)\nheld = target.shift(1).fillna(0).astype(int)\ngross_return = held * close.pct_change().fillna(0)\nturnover = held.diff().abs().fillna(held.abs())\ncost_rate = 0.001\n\n# 任务：扣除比例成本得到 net_return；打印总成本，再打印 net_return.sum()，保留 4 位\n',
        hint: '两次仓位变化 × 0.001，总成本为 0.002。从 gross_return 减去 turnover × cost_rate。',
        exampleNotes: {4: '简化比例成本模型中，每次 0/1 仓位变化支付 0.1%', 5: '只在换手时扣成本；毛收益与净收益是不同报告'},
      },
      {
        title: '权益曲线与总收益',
        explain: '净日收益必须复合成权益曲线。cumprod() 按时间顺序乘起每个 1 + net_return，再乘初始资金 10000，得到每根 bar 后的账户价值。总收益是期末权益 / 期初权益 − 1，不是日收益的简单相加。任务：用上一步净收益构建权益曲线，打印期末权益（两位小数），再打印总收益（四位小数）。',
        starter: 'import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\ntarget = (close.rolling(2).mean() > close.rolling(3).mean()).astype(int)\nheld = target.shift(1).fillna(0).astype(int)\ngross_return = held * close.pct_change().fillna(0)\nturnover = held.diff().abs().fillna(held.abs())\nnet_return = gross_return - turnover * 0.001\n\n# 任务：从 10000 开始，把净收益复合成 equity；打印期末 equity（2 位），再打印总收益（4 位）\n',
        hint: 'equity = 10000 * (1 + net_return).cumprod()。用 equity.iloc[-1] 读取期末值。',
        exampleNotes: {2: 'cumprod 按时间顺序复合每个日增长因子', 3: 'equity 从初始资金 10000 出发，随净收益变化', 4: '期末权益除以初始权益再减 1，就是总收益'},
      },
      {
        title: '从权益曲线计算最大回撤',
        explain: '最大回撤应该作用于包含成本的权益曲线——除非明确说明衡量的是原始价格基准。cummax() 记录滚动峰值；1 − equity / peak 计算每次下降；.max() 找最深值。这是回看历史路径的风险，不是未来最大可能亏损。任务：复用净收益管线，构建权益，打印最大回撤（四位小数）。',
        starter: 'import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\ntarget = (close.rolling(2).mean() > close.rolling(3).mean()).astype(int)\nheld = target.shift(1).fillna(0).astype(int)\ngross_return = held * close.pct_change().fillna(0)\nturnover = held.diff().abs().fillna(held.abs())\nnet_return = gross_return - turnover * 0.001\nequity = 10000 * (1 + net_return).cumprod()\n\n# 任务：计算滚动峰值和回撤；打印最大回撤（保留 4 位）\n',
        hint: 'peak = equity.cummax()；drawdown = 1 - equity / peak。这里只有出场成本造成下降。',
        exampleNotes: {2: 'cummax 是截至每根 bar 见过的最高权益', 3: '回撤把每个权益值与它自己的早期峰值比较', 4: '观测到的最深下降就是最大回撤'},
      },
      {
        title: '可复用的回测报告',
        explain: '现在把完整管线封装起来，改参数时不必重写逻辑。report 返回总收益、最大回撤和交易事件。这个透明的 pandas 引擎与 backtesting.py 的分工相呼应：在 init() 准备指标，在 next() 逐 bar 推进。这里刻意不导入 backtesting.py，因为浏览器运行时没有加载它；pandas 计算才是可执行参考。任务：完成相同 report 函数，并用 MA2/MA3、0.001 成本调用它。',
        starter: 'import pandas as pd\n\nclose = pd.Series([100.0, 102.0, 101.0, 103.0, 99.0, 98.0, 100.0, 103.0])\n\ndef report(close, fast_n, slow_n, cost_rate):\n    # 任务：用上述管线返回 total_return、max_drawdown、trade_events\n    pass\n\nr, dd, trades = report(close, 2, 3, 0.001)\nprint(round(r, 4), round(dd, 4), trades)\n',
        hint: '函数内依次计算 target、held、turnover、net、equity、drawdown，按指定顺序返回三个结果。',
        exampleNotes: {3: '一个函数封装时点、收益、成本、权益和风险假设', 11: '返回三个值；元组解包赋予独立名字', 12: '按固定顺序打印总收益、最大回撤和交易事件'},
      },
      {
        title: '最终挑战——比较之后，还要质疑结果',
        explain: 'L3 最终验收：用 report 跑三组参数 (3,10)、(5,20)、(8,20)，成本均为 0.001。每组打印 fast/slow 总收益 最大回撤 交易事件，再打印 BuyHold 总收益 最大回撤。基准方法见示例。参数标签使用新的显示语法 f"{fast_n}/{slow_n}"，把两个变量填进 3/10 这样的文本。可以比较 3/10 与其他参数，但不能称它为未来赢家：在同一条 30 日路径上挑最好参数是样本内选择，可能过拟合。严肃下一步应是在之后的未见过数据上验证。所有价格均为合成数据；目标是可审计报告，不是收益承诺。',
        starter: 'import pandas as pd\n\nclose = pd.Series([120, 118, 116, 114, 112, 110, 108, 106, 104, 102, 100, 98, 96, 94, 92, 90, 92, 94, 96, 98, 100, 102, 104, 102, 100, 98, 96, 94, 92, 90])\n\ndef report(close, fast_n, slow_n, cost_rate):\n    target = (close.rolling(fast_n).mean() > close.rolling(slow_n).mean()).astype(int)\n    held = target.shift(1).fillna(0).astype(int)\n    turnover = held.diff().abs().fillna(held.abs())\n    net = held * close.pct_change().fillna(0) - turnover * cost_rate\n    equity = 10000 * (1 + net).cumprod()\n    drawdown = 1 - equity / equity.cummax()\n    return float(equity.iloc[-1] / 10000 - 1), float(drawdown.max()), int(turnover.sum())\n\n# 任务：分别对 (3,10)、(5,20)、(8,20) 运行 report(close, fast, slow, 0.001)\n# 每组打印 fast/slow r dd trades；再打印同路径 BuyHold 总收益和最大回撤，数值均保留 4 位\n',
        hint: '遍历 configurations = [(3, 10), (5, 20), (8, 20)]。BuyHold 收益是末值/首值 − 1；权益是 10000 × close/首个收盘价。',
        exampleNotes: {3: '示例基准使用不同价格路径', 4: '买入持有从首个收盘价开始，到最后一个结束', 5: '权益跟随同一条归一化价格路径', 7: '策略报告与简单基准并排会更有信息量'},
      },
    ],
  },
};
