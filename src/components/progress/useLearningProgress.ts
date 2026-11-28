'use client';

import {useEffect, useState} from 'react';
import {createClient} from '@/lib/supabase/browser';
import {PLACEMENT_STORAGE_KEY} from '@/content/assessment';
import {computeLearningProgress, type LearningProgress, type PlacementLevel, type ProgressInput} from '@/lib/progress';

const PLACEMENT_LEVELS: PlacementLevel[] = ['L0', 'L1', 'L2', 'L3'];

/** The placement result is kept in this browser only (see the assessment page). */
function readPlacementLevel(): PlacementLevel | null {
  try {
    const raw = window.localStorage.getItem(PLACEMENT_STORAGE_KEY);
    const level = raw ? (JSON.parse(raw) as {level?: string}).level : null;
    return PLACEMENT_LEVELS.find((item) => item === level) ?? null;
  } catch {
    return null;
  }
}

async function fetchProgress(signedIn: boolean): Promise<LearningProgress> {
  const input: ProgressInput = {
    completedLessons: [],
    submissions: [],
    quizAttempts: [],
    placementLevel: readPlacementLevel(),
  };
  if (!signedIn) return computeLearningProgress(input);

  const supabase = createClient();
  const [lessons, submissions, attempts] = await Promise.all([
    supabase.from('lesson_progress').select('lesson_id'),
    supabase.from('assignment_submissions').select('assignment_id, passed'),
    supabase.from('quiz_attempts').select('quiz_id, answers, created_at'),
  ]);
  // A failed read counts as "nothing recorded", so one unavailable table
  // never hides the rest of the map.
  input.completedLessons = (lessons.data ?? []).map((row) => row.lesson_id as number);
  input.submissions = (submissions.data ?? []) as ProgressInput['submissions'];
  input.quizAttempts = (attempts.data ?? []) as ProgressInput['quizAttempts'];
  return computeLearningProgress(input);
}

/** Learning progress for the current visitor; the same numbers feed the map, the track bars and "My". */
export function useLearningProgress() {
  const [state, setState] = useState<'loading' | 'ready'>('loading');
  const [signedIn, setSignedIn] = useState(false);
  const [progress, setProgress] = useState<LearningProgress | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    const load = async () => {
      let signedInNow = false;
      try {
        signedInNow = (await supabase.auth.getSession()).data.session !== null;
      } catch {
        // Storage can be unavailable in private browsing; show the open map.
      }
      if (cancelled) return;
      setSignedIn(signedInNow);
      const next = await fetchProgress(signedInNow);
      if (cancelled) return;
      setProgress(next);
      setState('ready');
    };

    void load();
    const {data: {subscription}} = supabase.auth.onAuthStateChange((event) => {
      if (event !== 'SIGNED_IN' && event !== 'SIGNED_OUT') return;
      setState('loading');
      // Let Supabase finish storing the session before it is read back.
      setTimeout(() => void load(), 0);
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return {state, signedIn, progress};
}
