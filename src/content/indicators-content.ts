/**
 * Indicator lab teaching content — English (content language per plan §4.6).
 * Worked-example numbers are computed at runtime from the real 0700.HK bars.
 */

export type IndicatorKey = 'ma' | 'boll' | 'macd' | 'kdj' | 'volume';

export const INDICATORS: {
  key: IndicatorKey;
  title: string;
  type: string;
  measures: string;
  formula: string[];
  signals: string[];
  caveat: string;
}[] = [
  {
    key: 'ma',
    title: 'Moving Averages — MA5 / MA20 (均线)',
    type: 'Trend-following (lags price)',
    measures:
      'The average closing price over the last N days. MA5 tracks the short-term mood; MA20 the medium-term trend.',
    formula: [
      'MA_N = (C1 + C2 + … + CN) / N   (C = daily close)'
    ],
    signals: [
      'Golden cross: short MA crosses ABOVE long MA — recent buyers are gaining strength (bullish hint).',
      'Death cross: short MA crosses BELOW long MA — the opposite (bearish hint).',
      'Price riding above MA20 = uptrend discipline; breaking below it = trend warning.'
    ],
    caveat:
      'MAs are backward-looking: they confirm a trend after it started, and whip you around in sideways markets.'
  },
  {
    key: 'boll',
    title: 'Bollinger Bands — BOLL (布林带)',
    type: 'Volatility envelope (mean-reversion)',
    measures:
      'A channel around MA20: the bands widen when the market is volatile and squeeze when it goes quiet.',
    formula: [
      'Middle band = MA20',
      'Upper band = MA20 + 2 × σ   (σ = std dev of the last 20 closes)',
      'Lower band = MA20 − 2 × σ'
    ],
    signals: [
      'Touching the upper band: stretched on the upside — not a sell button, but momentum is hot.',
      'Touching the lower band: stretched downside.',
      'Band squeeze (bands narrowing): a big move is often brewing — direction unknown until the break.'
    ],
    caveat:
      'Bands tell you "unusual", not "reversal": in strong trends price can walk along the band for weeks.'
  },
  {
    key: 'macd',
    title: 'MACD (指数平滑异同均线)',
    type: 'Momentum & trend confirmation',
    measures:
      'The gap between a fast and a slow exponential moving average — whether recent momentum agrees with the longer trend.',
    formula: [
      'DIF = EMA12 − EMA26   (EMA smooths recent prices more heavily)',
      'DEA = EMA9 of DIF',
      'Histogram = 2 × (DIF − DEA)   (scaling is cosmetic; the sign is what matters)'
    ],
    signals: [
      'DIF crosses above DEA (histogram turns positive): bullish momentum shift.',
      'DIF crosses below DEA: bearish shift.',
      'Histogram growing taller: the move is accelerating; shrinking toward zero: momentum fading.',
      'Price makes a new high but MACD does not ("divergence"): the trend may be running out of fuel.'
    ],
    caveat:
      'MACD is slow by design — great for confirmation, late for entry. Use with faster tools in a range market, it flips often.'
  },
  {
    key: 'kdj',
    title: 'KDJ (随机指标)',
    type: 'Oscillator (overbought / oversold)',
    measures:
      'Where the current close sits inside the recent high–low range — how stretched the short-term move is.',
    formula: [
      'RSV = (C − LowestLow9) / (HighestHigh9 − LowestLow9) × 100',
      'K = 2/3 × K(prev) + 1/3 × RSV',
      'D = 2/3 × D(prev) + 1/3 × K',
      'J = 3K − 2D   (the fastest, most volatile line)'
    ],
    signals: [
      'K/D above 80: overbought zone — rally is stretched, watch for cooling.',
      'K/D below 20: oversold zone.',
      'K crossing above D from low levels: a classic rebound hint.',
      'J hitting 0 or 100: short-term extremes.'
    ],
    caveat:
      'In a strong trend KDJ can stay overbought/oversold for a long time — "overbought" is not "sell".'
  },
  {
    key: 'volume',
    title: 'Volume (成交量)',
    type: 'Confirmation (says "how much", never "which way")',
    measures:
      'How many shares changed hands. Volume is the conviction behind a price move.',
    formula: ['No formula — just the share count of the session.'],
    signals: [
      'Move up on heavy volume: many participants agree — more trustworthy.',
      'Move up on thin volume: fewer believers — treat with suspicion.',
      'Sudden volume spike after a quiet stretch (see the chart!): something changed — news, or big money.'
    ],
    caveat:
      'Volume alone carries no direction. It is a lie detector for price, not a compass.'
  }
];
