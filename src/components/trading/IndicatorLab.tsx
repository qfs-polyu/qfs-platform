'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  CrosshairMode,
  type IChartApi,
  type ISeriesApi,
  type IPriceLine,
  Time
} from 'lightweight-charts';
import data from '@/data/candles_0700.json';
import {INDICATORS, type IndicatorKey} from '@/content/indicators-content';

type Bar = {t: string; o: number; h: number; l: number; c: number; v: number};
const bars = (data as {bars: Bar[]}).bars;

/* ---------- indicator math (taught values, computed from real data) ---------- */

const closes = bars.map((b) => b.c);

function smaArr(n: number): (number | null)[] {
  return closes.map((_, i) => {
    if (i < n - 1) return null;
    let s = 0;
    for (let j = i - n + 1; j <= i; j++) s += closes[j];
    return s / n;
  });
}
const ma5 = smaArr(5);
const ma20 = smaArr(20);

const bollUpper: (number | null)[] = ma20.map((m, i) => {
  if (m === null) return null;
  let s = 0;
  for (let j = i - 19; j <= i; j++) s += (closes[j] - m) ** 2;
  return m + 2 * Math.sqrt(s / 20);
});
const bollLower: (number | null)[] = ma20.map((m, i) => {
  if (m === null) return null;
  let s = 0;
  for (let j = i - 19; j <= i; j++) s += (closes[j] - m) ** 2;
  return m - 2 * Math.sqrt(s / 20);
});

function emaArr(values: number[], n: number): number[] {
  const k = 2 / (n + 1);
  const out: number[] = [values[0]];
  for (let i = 1; i < values.length; i++) out.push(values[i] * k + out[i - 1] * (1 - k));
  return out;
}
const ema12 = emaArr(closes, 12);
const ema26 = emaArr(closes, 26);
const dif = closes.map((_, i) => ema12[i] - ema26[i]);
const dea = emaArr(dif, 9);
const hist = dif.map((d, i) => 2 * (d - dea[i]));

const kdj = (() => {
  const K: (number | null)[] = [];
  const D: (number | null)[] = [];
  const J: (number | null)[] = [];
  let pk = 50;
  let pd = 50;
  for (let i = 0; i < bars.length; i++) {
    if (i < 8) {
      K.push(null);
      D.push(null);
      J.push(null);
      continue;
    }
    let hh = -Infinity;
    let ll = Infinity;
    for (let j = i - 8; j <= i; j++) {
      hh = Math.max(hh, bars[j].h);
      ll = Math.min(ll, bars[j].l);
    }
    const rsv = hh === ll ? 50 : ((bars[i].c - ll) / (hh - ll)) * 100;
    const k = (2 / 3) * pk + (1 / 3) * rsv;
    const d = (2 / 3) * pd + (1 / 3) * k;
    pk = k;
    pd = d;
    K.push(k);
    D.push(d);
    J.push(3 * k - 2 * d);
  }
  return {K, D, J};
})();

const f2 = (x: number) => x.toFixed(2);

/* ---------- worked examples at the latest bar ---------- */

const LAST = bars.length - 1;

const EXAMPLES: Record<IndicatorKey, string[]> = {
  ma: [
    `MA5 (${bars[LAST].t}) = (${closes.slice(LAST - 4, LAST + 1).map(f2).join(' + ')}) / 5 = ${f2(ma5[LAST]!)}`,
    `MA20 (${bars[LAST].t}) = sum of the last 20 closes / 20 = ${f2(ma20[LAST]!)}`
  ],
  boll: (() => {
    const m = ma20[LAST]!;
    const sd = Math.sqrt(
      closes.slice(LAST - 19, LAST + 1).reduce((s, c) => s + (c - m) ** 2, 0) / 20
    );
    return [
      `Middle = MA20 = ${f2(m)}`,
      `σ(20d) = ${f2(sd)}`,
      `Upper = ${f2(m)} + 2×${f2(sd)} = ${f2(bollUpper[LAST]!)}`,
      `Lower = ${f2(m)} − 2×${f2(sd)} = ${f2(bollLower[LAST]!)}`
    ];
  })(),
  macd: [
    `EMA12 = ${f2(ema12[LAST])},  EMA26 = ${f2(ema26[LAST])}`,
    `DIF = ${f2(ema12[LAST])} − ${f2(ema26[LAST])} = ${f2(dif[LAST])}`,
    `DEA (EMA9 of DIF) = ${f2(dea[LAST])}`,
    `Histogram = 2 × (${f2(dif[LAST])} − ${f2(dea[LAST])}) = ${f2(hist[LAST])}`
  ],
  kdj: (() => {
    let hh = -Infinity;
    let ll = Infinity;
    for (let j = LAST - 8; j <= LAST; j++) {
      hh = Math.max(hh, bars[j].h);
      ll = Math.min(ll, bars[j].l);
    }
    const rsv = ((bars[LAST].c - ll) / (hh - ll)) * 100;
    return [
      `9-day high = ${f2(hh)}, 9-day low = ${f2(ll)}, close = ${f2(bars[LAST].c)}`,
      `RSV = (${f2(bars[LAST].c)} − ${f2(ll)}) / (${f2(hh)} − ${f2(ll)}) × 100 = ${f2(rsv)}`,
      `K = ${f2(kdj.K[LAST]!)}, D = ${f2(kdj.D[LAST]!)}, J = 3×${f2(kdj.K[LAST]!)} − 2×${f2(kdj.D[LAST]!)} = ${f2(kdj.J[LAST]!)}`
    ];
  })(),
  volume: [
    `On ${bars[LAST].t}, ${bars[LAST].v.toLocaleString()} shares of ${data.symbol} changed hands.`,
    `Compare with the average day: ${f2(
      bars.slice(LAST - 19, LAST + 1).reduce((s, b) => s + b.v, 0) / 20
    )} shares over the last 20 sessions.`
  ]
};

/* ---------- component ---------- */

type Toggle = Exclude<IndicatorKey, 'volume'>;

export default function IndicatorLab() {
  const t = useTranslations('indicators');
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const groups = useRef<Record<Toggle, ISeriesApi<'Line' | 'Histogram'>[]>>({ma: [], boll: [], macd: [], kdj: []});
  const [toggle, setToggle] = useState<Record<Toggle, boolean>>({
    ma: true,
    boll: true,
    macd: true,
    kdj: true
  });
  const [openCard, setOpenCard] = useState<IndicatorKey | null>('ma');

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      autoSize: true,
      height: 640,
      layout: {background: {color: '#ffffff'}, textColor: '#1a2330'},
      grid: {
        vertLines: {color: 'rgba(26,35,48,0.05)'},
        horzLines: {color: 'rgba(26,35,48,0.05)'}
      },
      crosshair: {mode: CrosshairMode.Normal}
    });
    chartRef.current = chart;

    const line = (arr: (number | null)[], color: string, pane = 0, width: 1 | 2 = 1, dashed = false) => {
      const s = chart.addSeries(
        LineSeries,
        {
          color,
          lineWidth: width,
          lineStyle: dashed ? 2 : 0,
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: false
        },
        pane
      );
      s.setData(
        arr
          .map((v, i) => (v === null ? null : {time: bars[i].t as Time, value: v}))
          .filter((x): x is {time: Time; value: number} => x !== null)
      );
      return s;
    };

    // pane 0: candles + MA + BOLL
    const candles = chart.addSeries(
      CandlestickSeries,
      {
        upColor: '#26a69a',
        downColor: '#ef5350',
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        borderVisible: false
      },
      0
    );
    candles.setData(
      bars.map((b) => ({time: b.t as Time, open: b.o, high: b.h, low: b.l, close: b.c}))
    );
    groups.current.ma = [line(ma5, '#e6b800', 0, 2), line(ma20, '#d64550', 0, 2)];
    groups.current.boll = [
      line(bollUpper, 'rgba(124,77,255,0.7)', 0, 1, true),
      line(ma20, 'rgba(124,77,255,0.45)', 0, 1, true),
      line(bollLower, 'rgba(124,77,255,0.7)', 0, 1, true)
    ];

    // pane 1: volume
    const vol = chart.addSeries(
      HistogramSeries,
      {priceFormat: {type: 'volume'}},
      1
    );
    vol.setData(
      bars.map((b) => ({
        time: b.t as Time,
        value: b.v,
        color: b.c >= b.o ? 'rgba(38,166,154,0.45)' : 'rgba(239,83,80,0.45)'
      }))
    );

    // pane 2: MACD
    const macdHist = chart.addSeries(HistogramSeries, {}, 2);
    macdHist.setData(
      hist.map((v, i) => ({
        time: bars[i].t as Time,
        value: v,
        color: v >= 0 ? 'rgba(38,166,154,0.6)' : 'rgba(239,83,80,0.6)'
      }))
    );
    const difLine = line(dif, '#e6b800', 2, 2);
    const deaLine = line(dea, '#4d79ff', 2, 1);
    groups.current.macd = [macdHist, difLine, deaLine];

    // pane 3: KDJ + 20/80 guides
    const k = line(kdj.K, '#e6b800', 3, 2);
    const d = line(kdj.D, '#4d79ff', 3, 1);
    const j = line(kdj.J, '#d64550', 3, 1);
    groups.current.kdj = [k, d, j];
    const guides: IPriceLine[] = [];
    [20, 80].forEach((lvl) => {
      guides.push(k.createPriceLine({price: lvl, color: 'rgba(26,35,48,0.25)', lineWidth: 1, lineStyle: 3, axisLabelVisible: true, title: String(lvl)}));
    });

    // pane stretch: price bigger
    try {
      const panes = chart.panes();
      panes[0]?.setStretchFactor(2.6);
      panes[1]?.setStretchFactor(0.8);
      panes[2]?.setStretchFactor(1);
      panes[3]?.setStretchFactor(1);
    } catch {
      // older build: default panes fine
    }

    chart.timeScale().setVisibleLogicalRange({from: bars.length - 160, to: bars.length + 3});

    return () => {
      chart.remove();
      chartRef.current = null;
      groups.current = {ma: [], boll: [], macd: [], kdj: []};
    };
  }, []);

  useEffect(() => {
    (Object.keys(toggle) as Toggle[]).forEach((key) => {
      groups.current[key]?.forEach((s) => s.applyOptions({visible: toggle[key]}));
    });
  }, [toggle]);

  const toggleLabels: Record<Toggle, string> = {
    ma: t('tMA'),
    boll: t('tBOLL'),
    macd: t('tMACD'),
    kdj: t('tKDJ')
  };

  return (
    <div className="space-y-6">
      {/* chart */}
      <div className="rounded-xl border border-navy/10 bg-white p-3 shadow-sm">
        <div className="mb-2 flex flex-wrap items-center gap-4 px-2">
          <span className="text-sm font-medium text-navy">
            {data.symbol} · {data.name} · Daily
          </span>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(toggleLabels) as Toggle[]).map((key) => (
              <label key={key} className="flex cursor-pointer items-center gap-1.5 text-sm text-navy/70">
                <input
                  type="checkbox"
                  checked={toggle[key]}
                  onChange={(e) => setToggle({...toggle, [key]: e.target.checked})}
                  className="accent-[#d4875a]"
                />
                {toggleLabels[key]}
              </label>
            ))}
          </div>
        </div>
        <div ref={containerRef} className="h-[640px] w-full" />
      </div>

      {/* knowledge cards */}
      <div className="space-y-3">
        {INDICATORS.map((ind) => {
          const open = openCard === ind.key;
          return (
            <div
              key={ind.key}
              className="rounded-xl border border-navy/10 bg-white shadow-sm"
            >
              <button
                onClick={() => setOpenCard(open ? null : ind.key)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-semibold text-navy">{ind.title}</span>
                <span className="rounded-full bg-navy/5 px-2.5 py-1 text-xs text-navy/60">
                  {ind.type}
                </span>
              </button>
              {open && (
                <div className="space-y-4 border-t border-navy/10 px-5 py-4">
                  <p className="text-sm leading-relaxed text-navy/75">{ind.measures}</p>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-navy/50">
                      {t('formulaLabel')}
                    </p>
                    <div className="mt-1.5 space-y-1 rounded-lg bg-[#1e2530] p-3 font-mono text-xs leading-relaxed text-white/85">
                      {ind.formula.map((f, i) => (
                        <p key={i}>{f}</p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-navy/50">
                      {t('exampleLabel')} · {bars[LAST].t}
                    </p>
                    <div className="mt-1.5 space-y-1 rounded-lg bg-accent-soft/70 p-3 font-mono text-xs leading-relaxed text-navy/85">
                      {EXAMPLES[ind.key].map((e, i) => (
                        <p key={i}>{e}</p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-navy/50">
                      {t('signalsLabel')}
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {ind.signals.map((s, i) => (
                        <li key={i} className="text-sm leading-relaxed text-navy/75">
                          · {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm leading-relaxed text-amber-900">
                    ⚠ {ind.caveat}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
