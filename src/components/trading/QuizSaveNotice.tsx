'use client';

import {useTranslations} from 'next-intl';
import type {QuizSaveState} from './useQuizAttempt';

export default function QuizSaveNotice({state}: {state: QuizSaveState}) {
  const t = useTranslations('assignmentCenter');
  if (state === 'idle') return null;
  return (
    <p className={`mt-3 text-xs ${state === 'error' ? 'text-red-600' : 'text-navy/55'}`} role="status">
      {state === 'saved' ? t('quizSaved') : state === 'anon' ? t('saveAnon') : t('saveError')}
    </p>
  );
}
