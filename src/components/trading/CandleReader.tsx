'use client';

import {useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  CrosshairMode,
  type IChartApi,
  type ISeriesApi,
  Time
} from 'lightweight-charts';
import data from '@/data/candles_0700.json';
import {CONCEPTS, QUIZ} from '@/content/candles-content';
import QuizSaveNotice from './QuizSaveNotice';
import {useQuizAttempt} from './useQuizAttempt';

type Bar = {t: string; o: number; h: number; l: number; c: number; v: number};
const bars = (data as {symbol: string; name: string; bars: Bar[]}).bars;

function ma20(upTo: number): number | null {
  if (upTo < 19) return null;
  let sum = 0;
  for (let i = upTo - 19; i <= upTo; i++) sum += bars[i].c;
  return sum / 20;
}

export default function CandleReader() {
  const t = useTranslations('candles');
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const maSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [showMA, setShowMA] = useState(false);
  const [openConcept, setOpenConcept] = useState<string | null>(null);
  const [quizPicks, setQuizPicks] = useState<Record<number, number>>({});
  const [quizChecked, setQuizChecked] = useState(false);
  const {saveState, recordAttempt} = useQuizAttempt('trading-candles');

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      autoSize: true,
      height: 380,
      layout: {background: {color: '#ffffff'}, textColor: '#1a2330'},
      grid: {
        vertLines: {color: 'rgba(26,35,48,0.06)'},
        horzLines: {color: 'rgba(26,35,48,0.06)'}
      },
      crosshair: {mode: CrosshairMode.Normal},
      timeScale: {borderColor: 'rgba(26,35,48,0.15)'}
    });
    chartRef.current = chart;

    const candles = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      borderVisible: false
    });
    candles.setData(
      bars.map((b) => ({
        time: b.t as Time,
        open: b.o,
        high: b.h,
        low: b.l,
        close: b.c
      }))
    );

    const volume = chart.addSeries(HistogramSeries, {
      priceScaleId: 'vol',
      priceFormat: {type: 'volume'}
    });
    volume.setData(
      bars.map((b) => ({
        time: b.t as Time,
        value: b.v,
        color: b.c >= b.o ? 'rgba(38,166,154,0.35)' : 'rgba(239,83,80,0.35)'
      }))
    );
    chart.priceScale('vol').applyOptions({
      scaleMargins: {top: 0.82, bottom: 0}
    });

    const maSeries = chart.addSeries(LineSeries, {
      color: '#d4875a',
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      visible: false
    });
    maSeries.setData(
      bars
        .map((b, i) => {
          const v = ma20(i);
          return v === null ? null : {time: b.t as Time, value: v};
        })
        .filter((x): x is {time: Time; value: number} => x !== null)
    );
    maSeriesRef.current = maSeries;

    chart.subscribeClick((param) => {
      if (param.logical === undefined || param.logical === null) return;
      const idx = param.logical as number;
      if (idx >= 0 && idx < bars.length) setSelected(idx);
    });

    return () => {
      chart.remove();
      chartRef.current = null;
      maSeriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    maSeriesRef.current?.applyOptions({visible: showMA});
  }, [showMA]);

  const bar = selected !== null ? bars[selected] : null;
  const prev = selected !== null && selected > 0 ? bars[selected - 1] : null;
  const changePct = bar && prev ? ((bar.c - prev.c) / prev.c) * 100 : null;
  const bullish = bar ? bar.c >= bar.o : false;
  const upperWick = bar ? bar.h - Math.max(bar.o, bar.c) : 0;
  const lowerWick = bar ? Math.min(bar.o, bar.c) - bar.l : 0;

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="rounded-xl border border-navy/10 bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between px-2">
          <span className="text-sm font-medium text-navy">
            {data.symbol} · {data.name} · Daily
          </span>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-navy/70">
            <input
              type="checkbox"
              checked={showMA}
              onChange={(e) => setShowMA(e.target.checked)}
              className="accent-[#d4875a]"
            />
            {t('maToggle')}
          </label>
        </div>
        <div ref={containerRef} className="h-[380px] w-full" />
        <p className="px-2 pt-1 text-xs text-navy/45">{t('clickHint')}</p>
      </div>

      {/* Selected bar detail */}
      <div className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm">
        {bar ? (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-navy">
                {t('selected')} · {bar.t}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setSelected(Math.max(0, (selected ?? 0) - 1))
                  }
                  className="rounded-full border border-navy/15 px-3 py-1 text-xs text-navy/60 hover:text-navy"
                >
                  {t('prevBar')}
                </button>
                <button
                  onClick={() =>
                    setSelected(Math.min(bars.length - 1, (selected ?? 0) + 1))
                  }
                  className="rounded-full border border-navy/15 px-3 py-1 text-xs text-navy/60 hover:text-navy"
                >
                  {t('nextBar')}
                </button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-3">
              <span className="text-navy/50">
                {t('open')}: <span className="text-navy">{bar.o.toFixed(1)}</span>
              </span>
              <span className="text-navy/50">
                {t('high')}: <span className="text-navy">{bar.h.toFixed(1)}</span>
              </span>
              <span className="text-navy/50">
                {t('low')}: <span className="text-navy">{bar.l.toFixed(1)}</span>
              </span>
              <span className="text-navy/50">
                {t('close')}: <span className="text-navy">{bar.c.toFixed(1)}</span>
              </span>
              <span className="text-navy/50">
                {t('change')}:{' '}
                <span
                  className={
                    (changePct ?? 0) >= 0 ? 'text-green-700' : 'text-red-600'
                  }
                >
                  {changePct === null ? '—' : `${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%`}
                </span>
              </span>
              <span className="text-navy/50">
                {t('bodyType')}:{' '}
                <span className={bullish ? 'text-green-700' : 'text-red-600'}>
                  {bullish ? t('bullish') : t('bearish')}
                </span>
              </span>
            </div>
            <div className="mt-3 space-y-1 border-t border-navy/10 pt-3 text-xs leading-relaxed text-navy/60">
              <p>
                <span className="font-medium text-navy/80">{t('upperWick')}</span>{' '}
                {upperWick.toFixed(1)} — {t('wickExplainU')}
              </p>
              <p>
                <span className="font-medium text-navy/80">{t('lowerWick')}</span>{' '}
                {lowerWick.toFixed(1)} — {t('wickExplainL')}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-navy/50">{t('clickHint')}</p>
        )}
      </div>

      {/* Concepts */}
      <div>
        <h3 className="font-semibold text-navy">{t('concepts')}</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {CONCEPTS.map((c) => (
            <button
              key={c.key}
              onClick={() => setOpenConcept(openConcept === c.key ? null : c.key)}
              className="rounded-xl border border-navy/10 bg-white p-4 text-left shadow-sm transition hover:border-accent/50"
            >
              <span className="font-medium text-navy">{c.title}</span>
              {openConcept === c.key && (
                <p className="mt-2 text-xs leading-relaxed text-navy/65">{c.desc}</p>
              )}
              <span className="mt-1 block text-xs text-accent">
                {openConcept === c.key ? '−' : '+'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quiz */}
      <div className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-navy">{t('quizTitle')}</h3>
        <div className="mt-4 space-y-5">
          {QUIZ.map((q, qi) => (
            <div key={qi}>
              <p className="text-sm font-medium text-navy/85">
                {qi + 1}. {q.q}
              </p>
              <div className="mt-2 space-y-1.5">
                {q.options.map((opt, oi) => {
                  const picked = quizPicks[qi] === oi;
                  const correct = quizChecked && oi === q.answer;
                  const wrong = quizChecked && picked && oi !== q.answer;
                  return (
                    <button
                      key={oi}
                      onClick={() => setQuizPicks({...quizPicks, [qi]: oi})}
                      className={`block w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                        correct
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : wrong
                            ? 'border-red-300 bg-red-50 text-red-700'
                            : picked
                              ? 'border-accent text-navy'
                              : 'border-navy/10 text-navy/75 hover:border-accent/40'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {quizChecked && (
                <p className="mt-1.5 text-xs text-navy/55">
                  {quizPicks[qi] === q.answer ? `✓ ${t('quizCorrect')} ` : `${t('quizWrong')} `}
                  {q.explain}
                </p>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            setQuizChecked(true);
            void recordAttempt(quizPicks);
          }}
          disabled={Object.keys(quizPicks).length < QUIZ.length}
          className="mt-5 rounded-full bg-navy px-5 py-2 text-sm font-medium text-white transition hover:bg-navy/90 disabled:opacity-40"
        >
          {t('quizCheck')}
        </button>
        <QuizSaveNotice state={saveState} />
      </div>
    </div>
  );
}
