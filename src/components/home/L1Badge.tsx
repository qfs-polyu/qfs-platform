import {createClient} from '@/lib/supabase/server';

/**
 * L1 progress badge on the learning map (dynamic — reads the session).
 * Shows "n/5" next to the L1 gate line for signed-in users.
 */
export default async function L1Badge() {
  const supabase = await createClient();
  const {
    data: {user}
  } = await supabase.auth.getUser();
  if (!user) return null;

  let done = 0;
  try {
    const {data} = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id);
    done = (data ?? []).filter(
      (r) => (r.lesson_id as number) >= 1 && (r.lesson_id as number) <= 5
    ).length;
  } catch {
    return null;
  }

  return (
    <span className="ml-2 rounded bg-accent-soft px-1.5 py-0.5 text-xs font-medium text-accent">
      {done}/5
    </span>
  );
}
