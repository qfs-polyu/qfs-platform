/**
 * Quote-page anatomy content — a mock HK quote panel with clickable hotspots.
 * Price fields use REAL Tencent (0700.HK) values from 2026-10-30 (our cached
 * data); intraday-derived stats (量比) and valuation multiples (PE) are clearly
 * marked illustrative. English content per plan §4.6.
 */

export type Hotspot = {
  id: string;
  label: string; // EN name shown on the panel
  labelCn: string; // CN name shown on the panel (quote pages are bilingual)
  value: string;
  where: string; // short location description
  what: string;
  how: string;
  signal: string;
};

export const QUOTE: {symbol: string; name: string; nameCn: string} = {
  symbol: '0700.HK',
  name: 'TENCENT',
  nameCn: '腾讯控股'
};

export const HOTSPOTS: Hotspot[] = [
  {
    id: 'name',
    label: 'Name / Code',
    labelCn: '名称 / 代码',
    value: '腾讯控股 TENCENT · 0700',
    where: 'top-left of the panel',
    what: 'The stock’s identity: company name plus its exchange code. 0700 means it trades on the Hong Kong Stock Exchange (HKEX) main board.',
    how: 'Assigned by the exchange at listing. The .HK suffix is how data vendors mark HK-listed names.',
    signal: 'Identity, not a signal — but check you are trading the RIGHT share class (some firms list multiple classes).'
  },
  {
    id: 'last',
    label: 'Last / Change %',
    labelCn: '最新价 / 涨跌幅',
    value: '383.6  +6.0  +1.59%',
    where: 'top of the panel, largest font',
    what: 'The latest traded price, and its change versus the PREVIOUS CLOSE (377.6 on 2026-10-29) in money and percent.',
    how: 'Change% = (Last − PrevClose) / PrevClose. Here: (383.6 − 377.6) / 377.6 = +1.59%.',
    signal: 'Direction of the day so far. Red/green conventions differ by market — on this platform green = up.'
  },
  {
    id: 'ohlc',
    label: 'Open / High / Low / Prev Close',
    labelCn: '今开 / 最高 / 最低 / 昨收',
    value: '376.4 / 387.6 / 375.2 / 377.6',
    where: 'the four-cell row under the last price',
    what: 'Today’s opening, intraday high, intraday low, and yesterday’s closing price. Real values from 2026-10-30.',
    how: 'Recorded by the exchange as trading happens. High/Low frame the day’s range; Open vs Prev Close shows the overnight gap.',
    signal: 'A close near the High = buyers in control all day; a close near the Low = the opposite. Big gaps vs Prev Close often follow news.'
  },
  {
    id: 'volume',
    label: 'Volume / Turnover',
    labelCn: '成交量 / 成交额',
    value: '22.27M shares / ≈ HK$8.6B',
    where: 'the pair under the OHLC row',
    what: 'Volume = how many shares changed hands today (real: 22,269,954). Turnover = the money value of those shares.',
    how: 'Turnover ≈ volume × average traded price. Volume counts shares; turnover counts dollars.',
    signal: 'Volume is the conviction behind the move (see the Indicator Lab). Price moves on heavy volume carry more information.'
  },
  {
    id: 'turnover-rate',
    label: 'Turnover Rate',
    labelCn: '换手率',
    value: '≈ 0.24%',
    where: 'stats column (illustrative scale)',
    what: 'What fraction of the company’s freely tradable shares changed hands today.',
    how: 'Turnover rate = today’s volume ÷ free-float shares. Tencent has ≈ 9.2bn shares, so 22.27M ÷ 9,200M ≈ 0.24%.',
    signal: 'Activity meter. A sudden jump in turnover rate = unusual attention — news, results, or big money repositioning.'
  },
  {
    id: 'vol-ratio',
    label: 'Volume Ratio (量比)',
    labelCn: '量比',
    value: '≈ 1.18 (illustrative)',
    where: 'stats column — intraday stat, illustrative here',
    what: 'Today’s pace of trading versus the recent average pace.',
    how: '量比 = (today’s volume ÷ minutes elapsed) ÷ (past 5 days’ volume ÷ full day minutes). 1.0 = normal pace; >1.5 = heating up; <0.7 = quiet.',
    signal: 'Early-day volume spikes often lead price moves. Needs intraday data, so this demo value is illustrative.'
  },
  {
    id: 'mktcap',
    label: 'Market Cap',
    labelCn: '市值',
    value: '≈ HK$3.5T',
    where: 'stats column',
    what: 'The market’s total price tag for the whole company.',
    how: 'Market cap = last price × total shares outstanding ≈ 383.6 × 9.2bn ≈ HK$3.5 trillion.',
    signal: 'Size class (mega/large/mid/small), not a buy/sell signal. Sizing matters for how much a fund can even hold.'
  },
  {
    id: 'pe',
    label: 'P/E',
    labelCn: '市盈率',
    value: '≈ 22x (illustrative)',
    where: 'stats column — valuation multiple',
    what: 'Price-to-earnings: how many dollars of price per dollar of yearly profit.',
    how: 'P/E = price ÷ earnings per share (trailing 12 months). Value marked illustrative — it updates with each earnings report.',
    signal: 'A valuation yardstick, never a timing signal. Compare within the same industry only.'
  },
  {
    id: 'bidask',
    label: 'Bid / Ask (5 levels)',
    labelCn: '买一–买五 / 卖一–卖五',
    value: 'bid 383.4×3 … ask 383.8×2',
    where: 'the two columns mid-panel',
    what: 'The order book snapshot: best 5 buy prices (bid, left) and best 5 sell prices (ask, right), each with queued volume.',
    how: 'Exchanges publish the best queued orders. Bid1 is the highest price buyers offer; Ask1 the lowest sellers accept. The Ask1−Bid1 gap is the SPREAD.',
    signal: 'A tight spread = liquid, cheap to trade. A deep, lopsided book hints at short-term pressure — never a guarantee.'
  },
  {
    id: 'lot',
    label: 'Lot Size',
    labelCn: '每手股数',
    value: '100 shares',
    where: 'bottom of the panel',
    what: 'HK stocks trade in board lots — multiples of a fixed packet. Tencent’s lot is 100 shares.',
    how: 'Exchange rule per stock. Orders must be in multiples of the lot: 100, 200, 300… shares of 0700.',
    signal: 'A practical constraint: with a ≈HK$38,360 lot value, position sizing starts at one lot.'
  }
];

export const QUIZ = [
  {
    q: 'The stock closed at 383.6 with prev close 377.6. The +1.59% shown on the panel is calculated as…',
    options: [
      '(383.6 − 377.6) / 377.6',
      '(383.6 − 376.4) / 376.4 — versus the open',
      '383.6 / 377.6, without subtracting',
      'it cannot be calculated from prices'
    ],
    answer: 0,
    explain: 'Change% always compares the LAST price with the PREVIOUS CLOSE, not the open.'
  },
  {
    q: 'Bid1 = 383.4 and Ask1 = 383.8. A small spread between them most likely means…',
    options: [
      'The stock is liquid and cheap to trade',
      'The stock is about to rise',
      'Volume is zero',
      'The exchange made an error'
    ],
    answer: 0,
    explain: 'Tight spreads come from many competing orders — high liquidity, low trading cost. It says nothing about direction.'
  },
  {
    q: 'A stock trades 4% of its float in one day (turnover rate 4%). Compared with Tencent’s typical 0.2–0.5%, this suggests…',
    options: [
      'Unusual attention — worth checking the news',
      'The stock is guaranteed to rise',
      'A data error, always',
      'Nothing can ever be inferred'
    ],
    answer: 0,
    explain: 'Turnover rate is an activity meter: a spike means many owners changed hands — investigate why, don’t assume direction.'
  }
];
