-- StackItUp — Supabase auth setup
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Prereq: Authentication → Providers → Google is enabled with your Google Cloud
-- OAuth Client ID + Secret, and Authentication → URL Configuration lists your app
-- origins (e.g. http://localhost:3000 and your production URL) as redirect URLs.

-- 1. Profile row per user. Stores editable name + the two admin flags.
--    is_admin       → may open the /admin panel.
--    is_super_admin → may also grant/revoke admin (and super-admin) on others.
create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  first_name     text,
  last_name      text,
  avatar_url     text,
  avatar_emoji   text,
  is_admin       boolean not null default false,
  is_super_admin boolean not null default false,
  created_at     timestamptz not null default now()
);

-- If the table already existed from an earlier version, add the new columns:
alter table public.profiles
  add column if not exists is_super_admin boolean not null default false;
alter table public.profiles
  add column if not exists avatar_url text;
alter table public.profiles
  add column if not exists avatar_emoji text;

alter table public.profiles enable row level security;

-- 2. RLS: a user may read and update only their own row.
drop policy if exists "own profile read" on public.profiles;
create policy "own profile read"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "own profile update" on public.profiles;
create policy "own profile update"
  on public.profiles for update
  using (auth.uid() = id);

-- 3. Column-level privileges so users can NEVER set is_admin themselves,
--    even though RLS lets them update their own row.
revoke update on public.profiles from authenticated;
grant  update (first_name, last_name, avatar_url, avatar_emoji)
  on public.profiles to authenticated;

-- 4. Auto-create a profile from Google metadata on first login.
create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    new.raw_user_meta_data->>'given_name',
    new.raw_user_meta_data->>'family_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. Avatar storage. Users can upload a profile photo (or pick an emoji, which
--    needs no storage). Create a PUBLIC bucket named "avatars" so the public URL
--    we store in profiles.avatar_url is readable, then scope writes per user.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

-- Anyone may read avatar files (they are public profile images).
drop policy if exists "avatars public read" on storage.objects;
create policy "avatars public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- A user may write/replace/delete ONLY files under their own id/ folder.
-- The app uploads to "<user_id>/avatar", so the first path segment is the owner.
drop policy if exists "avatars owner write" on storage.objects;
create policy "avatars owner write"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars owner update" on storage.objects;
create policy "avatars owner update"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars owner delete" on storage.objects;
create policy "avatars owner delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- 6. Seed your account as SUPER admin — run AFTER your first Google login has
--    created the row. A super admin can open the panel AND grant admin/super-admin
--    to others from the in-app Admins page. Replace the email with yours.
-- update public.profiles set is_admin = true, is_super_admin = true
-- where id = (select id from auth.users where email = 'you@example.com');
