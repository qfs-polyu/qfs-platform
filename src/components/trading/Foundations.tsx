'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {
  INTRO_SECTIONS,
  MARKETS,
  WHY_STOCKS,
  QUIZ
} from '@/content/foundations-content';

export default function Foundations() {
  const t = useTranslations('foundations');
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);

  return (
    <div className="space-y-6">
      {/* What is quant */}
      {INTRO_SECTIONS.map((s) => (
        <div
          key={s.key}
          className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm"
        >
          <h2 className="font-semibold text-navy">{s.title}</h2>
          <div className="mt-3 space-y-3">
            {s.paras.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-navy/75">
                {p}
              </p>
            ))}
          </div>
        </div>
      ))}

      {/* Markets table */}
      <div className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-navy">{t('marketsTitle')}</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-navy text-white">
                <th className="px-3 py-2 font-medium">{t('colInstrument')}</th>
                <th className="px-3 py-2 font-medium">{t('colWhat')}</th>
                <th className="px-3 py-2 font-medium">{t('colExample')}</th>
              </tr>
            </thead>
            <tbody>
              {MARKETS.map((m) => (
                <tr key={m.name} className="border-t border-navy/10 even:bg-surface/60">
                  <td className="px-3 py-2.5 font-medium text-navy">{m.name}</td>
                  <td className="px-3 py-2.5 text-navy/70">{m.desc}</td>
                  <td className="px-3 py-2.5 text-xs text-navy/50">{m.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Why stocks */}
      <div className="rounded-xl border-2 border-accent/40 bg-accent-soft/50 p-6">
        <h2 className="font-semibold text-navy">{t('whyTitle')}</h2>
        <ul className="mt-3 space-y-2">
          {WHY_STOCKS.map((w, i) => (
            <li key={i} className="text-sm leading-relaxed text-navy/80">
              · {w}
            </li>
          ))}
        </ul>
      </div>

      {/* Quiz */}
      <div className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-navy">{t('quizTitle')}</h2>
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
          onClick={() => setChecked(true)}
          disabled={Object.keys(picks).length < QUIZ.length}
          className="mt-5 rounded-full bg-navy px-5 py-2 text-sm font-medium text-white transition hover:bg-navy/90 disabled:opacity-40"
        >
          {t('quizCheck')}
        </button>
      </div>
    </div>
  );
}
