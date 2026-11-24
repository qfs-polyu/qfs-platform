'use client';

import {useState} from 'react';
import {createClient} from '@/lib/supabase/browser';
import {QUIZ_REGISTRY} from '@/content/quizzes';

export type QuizSaveState = 'idle' | 'saved' | 'anon' | 'error';

export function useQuizAttempt(quizId: string) {
  const [saveState, setSaveState] = useState<QuizSaveState>('idle');
  const quiz = QUIZ_REGISTRY[quizId];

  const recordAttempt = async (picks: Record<number, number>) => {
    if (!quiz) return;
    setSaveState('idle');
    const answers = quiz.questions.map((question, questionIndex) => ({
      question: questionIndex,
      selected: picks[questionIndex]
    }));
    const score = answers.reduce(
      (total, answer) =>
        total + (quiz.questions[answer.question].answer === answer.selected ? 1 : 0),
      0
    );

    try {
      const supabase = createClient();
      const {
        data: {session}
      } = await supabase.auth.getSession();
      if (!session) {
        setSaveState('anon');
        return;
      }
      const {error} = await supabase.from('quiz_attempts').insert({
        user_id: session.user.id,
        quiz_id: quizId,
        score,
        total: quiz.questions.length,
        answers
      });
      if (error) throw error;
      setSaveState('saved');
    } catch {
      setSaveState('error');
    }
  };

  return {saveState, recordAttempt};
}
