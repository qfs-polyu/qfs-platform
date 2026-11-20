-- M1 admin dashboard (paste into Supabase SQL Editor and Run)
-- 1) mark admins via Authentication -> Users -> your user -> app_metadata: {"role":"admin"}
-- 2) two RPC functions below serve the /admin dashboard, admin-only.

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as
$$
  select coalesce(
    (select (raw_app_meta_data ->> 'role') = 'admin'
       from auth.users where id = auth.uid()),
    false);
$$;

-- Per-member overview: email, signup date, lessons done, last activity.
create or replace function public.admin_overview()
returns table (
  email text,
  created_at timestamptz,
  lessons_done bigint,
  last_activity timestamptz
)
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'admin only';
  end if;
  return query
  select u.email::text, u.created_at,
         count(lp.lesson_id),
         max(lp.completed_at)
  from auth.users u
  left join public.lesson_progress lp on lp.user_id = u.id
  group by u.id, u.email, u.created_at
  order by u.created_at;
end $$;

-- Per-lesson completion counts.
create or replace function public.admin_lesson_stats()
returns table (lesson_id int, completions bigint)
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'admin only';
  end if;
  return query
  select lp.lesson_id, count(*)
  from public.lesson_progress lp
  group by lp.lesson_id
  order by lp.lesson_id;
end $$;

grant execute on function public.admin_overview() to authenticated;
grant execute on function public.admin_lesson_stats() to authenticated;
