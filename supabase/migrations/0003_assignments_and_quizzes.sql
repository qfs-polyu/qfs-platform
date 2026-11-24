-- M1 assignment submissions and concept-quiz attempts.
-- Run after 0001_lesson_progress.sql and 0002_admin.sql.

create table if not exists public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assignment_id text not null,
  variant text not null,
  code text not null,
  passed boolean not null,
  test_results jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists assignment_submissions_user_created_idx
  on public.assignment_submissions (user_id, created_at desc);

alter table public.assignment_submissions enable row level security;

drop policy if exists "assignment_submissions_select_own" on public.assignment_submissions;
create policy "assignment_submissions_select_own"
  on public.assignment_submissions for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "assignment_submissions_insert_own" on public.assignment_submissions;
create policy "assignment_submissions_insert_own"
  on public.assignment_submissions for insert
  to authenticated
  with check (auth.uid() = user_id);

revoke all on public.assignment_submissions from anon;
grant select, insert on public.assignment_submissions to authenticated;

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id text not null,
  score integer not null check (score >= 0),
  total integer not null check (total > 0),
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  check (score <= total)
);

create index if not exists quiz_attempts_user_created_idx
  on public.quiz_attempts (user_id, created_at desc);

alter table public.quiz_attempts enable row level security;

drop policy if exists "quiz_attempts_select_own" on public.quiz_attempts;
create policy "quiz_attempts_select_own"
  on public.quiz_attempts for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "quiz_attempts_insert_own" on public.quiz_attempts;
create policy "quiz_attempts_insert_own"
  on public.quiz_attempts for insert
  to authenticated
  with check (auth.uid() = user_id);

revoke all on public.quiz_attempts from anon;
grant select, insert on public.quiz_attempts to authenticated;
