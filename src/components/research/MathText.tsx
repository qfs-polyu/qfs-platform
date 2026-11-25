'use client';

import {useMemo} from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export function TeX({tex, display = false}: {tex: string; display?: boolean}) {
  const html = useMemo(
    () => katex.renderToString(tex, {
      displayMode: display,
      output: 'htmlAndMathml',
      throwOnError: false,
    }),
    [display, tex],
  );

  return (
    <span
      className={display ? 'block min-w-0 overflow-x-auto py-1 [&_.katex-display]:my-0' : undefined}
      dangerouslySetInnerHTML={{__html: html}}
    />
  );
}

/** Render $...$ segments as TeX while preserving ordinary bilingual prose. */
export function MathText({text}: {text: string}) {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) =>
    /^\$[^$]+\$$/.test(part)
      ? <TeX key={index} tex={part.slice(1, -1)} />
      : <span key={index}>{part}</span>
  );
}
