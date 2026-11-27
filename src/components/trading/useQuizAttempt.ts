'use client';

import {useEffect, useMemo, useState} from 'react';
import {createClient} from '@/lib/supabase/browser';
import {QUIZ_REGISTRY, quizAnswerIsCorrect} from '@/content/quizzes';
import {buildQuizQuestionStates, type QuizAttemptRecord} from '@/lib/mistakes';

export type QuizSaveState = 'idle' | 'saved' | 'anon' | 'error';

export function useQuizAttempt(quizId: string) {
  const [saveState, setSaveState] = useState<QuizSaveState>('idle');
  const [attempts, setAttempts] = useState<QuizAttemptRecord[]>([]);
  const quiz = QUIZ_REGISTRY[quizId];

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const supabase = createClient();
        const {data: {session}} = await supabase.auth.getSession();
        if (!session) return;
        const {data, error} = await supabase
          .from('quiz_attempts')
          .select('id, quiz_id, score, total, answers, created_at')
          .eq('user_id', session.user.id)
          .eq('quiz_id', quizId)
          .order('created_at', {ascending: false})
          .limit(100);
        if (!cancelled && !error) setAttempts((data ?? []) as QuizAttemptRecord[]);
      } catch {
        // Recording remains available; the notebook will surface save failures.
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [quizId]);

  const questionStates = useMemo(
    () => buildQuizQuestionStates(attempts, (id, questionIndex, selected) => {
      const question = QUIZ_REGISTRY[id]?.questions[questionIndex];
      return question ? quizAnswerIsCorrect(question, selected) : false;
    }),
    [attempts],
  );

  const recordAttempt = async (picks: Record<number, number | string>) => {
    if (!quiz) return;
    setSaveState('idle');
    const answers = Object.entries(picks)
      .map(([question, selected]) => ({question: Number(question), selected}))
      .filter((answer) => quiz.questions[answer.question]);
    if (!answers.length) return;
    const score = answers.reduce(
      (total, answer) => total + (
        quizAnswerIsCorrect(quiz.questions[answer.question], answer.selected) ? 1 : 0
      ),
      0,
    );
    const localAttempt: QuizAttemptRecord = {
      id: `local-${Date.now()}`,
      quiz_id: quizId,
      score,
      total: answers.length,
      answers,
      created_at: new Date().toISOString(),
    };
    setAttempts((previous) => [localAttempt, ...previous]);

    try {
      const supabase = createClient();
      const {data: {session}} = await supabase.auth.getSession();
      if (!session) {
        setSaveState('anon');
        return;
      }
      const {error} = await supabase.from('quiz_attempts').insert({
        user_id: session.user.id,
        quiz_id: quizId,
        score,
        total: answers.length,
        answers,
      });
      if (error) throw error;
      setSaveState('saved');
    } catch {
      setSaveState('error');
    }
  };

  return {saveState, recordAttempt, questionStates};
}
