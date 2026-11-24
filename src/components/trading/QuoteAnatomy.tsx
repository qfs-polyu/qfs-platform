'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {HOTSPOTS, QUOTE, QUIZ} from '@/content/quotes-content';
import QuizSaveNotice from './QuizSaveNotice';
import {useQuizAttempt} from './useQuizAttempt';

type CellProps = {
  id: string;
  label: string;
  labelCn: string;
  value: string;
  selected: string;
  onSelect: (id: string) => void;
  emphasis?: boolean;
};

function Cell({id, label, labelCn, value, selected, onSelect, emphasis}: CellProps) {
  return (
    <button
      onClick={() => onSelect(id)}
      className={`group relative rounded-lg border p-2.5 text-left transition ${
        selected === id
          ? 'border-accent bg-accent-soft/60 ring-1 ring-accent'
          : 'border-navy/10 bg-white hover:border-accent/50'
      }`}
    >
      <span className="flex items-center gap-1 text-[11px] text-navy/50">
        {label} {labelCn}
        <span
          className={`ml-auto flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
            selected === id ? 'bg-accent text-white' : 'bg-navy/10 text-navy/60'
          }`}
        >
          {HOTSPOTS.findIndex((h) => h.id === id) + 1}
        </span>
      </span>
      <span
        className={`mt-0.5 block font-mono ${
          emphasis ? 'text-xl font-bold text-navy' : 'text-sm text-navy/85'
        }`}
      >
        {value}
      </span>
    </button>
  );
}

export default function QuoteAnatomy() {
  const t = useTranslations('quotes');
  const [selected, setSelected] = useState<string>('last');
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const {saveState, recordAttempt} = useQuizAttempt('trading-quotes');

  const spot = HOTSPOTS.find((h) => h.id === selected) ?? HOTSPOTS[0];

  return (
    <div className="space-y-6">
      {/* Mock quote panel */}
      <div className="rounded-xl border border-navy/15 bg-surface p-4 shadow-sm">
        <p className="mb-3 text-xs text-navy/45">{t('panelHint')}</p>
        <div className="space-y-2.5">
          {/* header row */}
          <div className="grid gap-2.5 sm:grid-cols-3">
            <Cell selected={selected} onSelect={setSelected} id="name" label="Name" labelCn="名称" value={`${QUOTE.nameCn} ${QUOTE.symbol}`} />
            <div className="sm:col-span-2">
              <Cell selected={selected} onSelect={setSelected} id="last" label="Last" labelCn="最新" value="383.6  +6.0  +1.59%" emphasis />
            </div>
          </div>
          {/* ohlc + volume */}
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Cell selected={selected} onSelect={setSelected} id="ohlc" label="O/H/L/Prev" labelCn="开高低收" value="376.4 / 387.6 / 375.2 / 377.6" />
            <Cell selected={selected} onSelect={setSelected} id="volume" label="Vol / Turnover" labelCn="量/额" value="22.27M / ≈HK$8.6B" />
          </div>
          {/* stats */}
          <div className="grid gap-2.5 sm:grid-cols-4">
            <Cell selected={selected} onSelect={setSelected} id="turnover-rate" label="Turnover" labelCn="换手率" value="0.24%" />
            <Cell selected={selected} onSelect={setSelected} id="vol-ratio" label="Vol Ratio" labelCn="量比" value="1.18" />
            <Cell selected={selected} onSelect={setSelected} id="mktcap" label="Mkt Cap" labelCn="市值" value="HK$3.5T" />
            <Cell selected={selected} onSelect={setSelected} id="pe" label="P/E" labelCn="市盈率" value="22x" />
          </div>
          {/* order book */}
          <Cell selected={selected} onSelect={setSelected} id="bidask" label="Order Book" labelCn="买卖五档" value="买 383.4×3 · 383.2×7 … 卖 383.8×2 · 384.0×5" />
          <Cell selected={selected} onSelect={setSelected} id="lot" label="Lot" labelCn="每手" value="100 shares" />
        </div>
      </div>

      {/* Detail */}
      <div className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-navy px-2.5 py-0.5 text-xs font-medium text-white">
            {HOTSPOTS.findIndex((h) => h.id === spot.id) + 1}. {spot.label}{' '}
            {spot.labelCn}
          </span>
          <span className="text-xs text-navy/45">{spot.where}</span>
        </div>
        <p className="mt-3 font-mono text-sm text-navy/80">{spot.value}</p>
        <div className="mt-4 space-y-3 text-sm leading-relaxed">
          <p className="text-navy/80">
            <span className="font-semibold text-navy">{t('whatLabel')} </span>
            {spot.what}
          </p>
          <div className="rounded-lg bg-[#1e2530] p-3 font-mono text-xs leading-relaxed text-white/85">
            {spot.how}
          </div>
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-navy/85">
            <span className="font-semibold">{t('signalLabel')} </span>
            {spot.signal}
          </p>
        </div>
      </div>

      {/* Quiz */}
      <div className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-navy">{t('quizTitle')}</h3>
        <div className="mt-4 space-y-5">
          {QUIZ.map((q, qi) => (
            <div key={qi}>
              <p className="text-sm font-medium text-navy/85">
                {qi + 1}. {q.q}
              </p>
              <div className="mt-2 space-y-1.5">
                {q.options.map((opt, oi) => {
                  const picked = picks[qi] === oi;
                  const correct = checked && oi === q.answer;
                  const wrong = checked && picked && oi !== q.answer;
                  return (
                    <button
                      key={oi}
                      onClick={() => setPicks({...picks, [qi]: oi})}
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
              {checked && (
                <p className="mt-1.5 text-xs text-navy/55">{q.explain}</p>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            setChecked(true);
            void recordAttempt(picks);
          }}
          disabled={Object.keys(picks).length < QUIZ.length}
          className="mt-5 rounded-full bg-navy px-5 py-2 text-sm font-medium text-white transition hover:bg-navy/90 disabled:opacity-40"
        >
          {t('quizCheck')}
        </button>
        <QuizSaveNotice state={saveState} />
      </div>
    </div>
  );
}
