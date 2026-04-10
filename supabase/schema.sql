-- Run this in Supabase SQL Editor before using Step 3 features.

create extension if not exists pgcrypto;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  course_name text not null,
  course_code text not null,
  teacher_id uuid not null references auth.users(id) on delete cascade,
  semester text,
  created_at timestamptz not null default now()
);

create table if not exists public.course_files (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  file_type text not null,
  current_version integer not null default 1,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.file_versions (
  id uuid primary key default gen_random_uuid(),
  file_id uuid not null references public.course_files(id) on delete cascade,
  version_number integer not null,
  storage_path text not null,
  change_message text,
  uploaded_by uuid not null references auth.users(id) on delete cascade,
  uploaded_at timestamptz not null default now(),
  unique(file_id, version_number)
);

create index if not exists idx_courses_teacher_id on public.courses(teacher_id);
create index if not exists idx_course_files_course_id on public.course_files(course_id);
create index if not exists idx_file_versions_file_id on public.file_versions(file_id);

alter table public.courses enable row level security;
alter table public.course_files enable row level security;
alter table public.file_versions enable row level security;

drop policy if exists "authenticated can read courses" on public.courses;
create policy "authenticated can read courses"
  on public.courses for select
  to authenticated
  using (true);

drop policy if exists "teacher admin can insert courses" on public.courses;
create policy "teacher admin can insert courses"
  on public.courses for insert
  to authenticated
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('teacher', 'admin')
  );

drop policy if exists "authenticated can read files" on public.course_files;
create policy "authenticated can read files"
  on public.course_files for select
  to authenticated
  using (true);

drop policy if exists "teacher admin can insert files" on public.course_files;
create policy "teacher admin can insert files"
  on public.course_files for insert
  to authenticated
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('teacher', 'admin')
  );

drop policy if exists "teacher admin can update files" on public.course_files;
create policy "teacher admin can update files"
  on public.course_files for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('teacher', 'admin'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('teacher', 'admin'));

drop policy if exists "authenticated can read versions" on public.file_versions;
create policy "authenticated can read versions"
  on public.file_versions for select
  to authenticated
  using (true);

drop policy if exists "teacher admin can insert versions" on public.file_versions;
create policy "teacher admin can insert versions"
  on public.file_versions for insert
  to authenticated
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('teacher', 'admin')
  );

-- Storage setup:
-- 1) Create bucket: course-files (private)
-- 2) Add storage policies for authenticated read and teacher/admin write.

insert into storage.buckets (id, name, public)
values ('course-files', 'course-files', false)
on conflict (id) do nothing;

drop policy if exists "authenticated read course files" on storage.objects;
create policy "authenticated read course files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'course-files');

drop policy if exists "teacher admin write course files" on storage.objects;
create policy "teacher admin write course files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'course-files'
    and (auth.jwt() -> 'app_metadata' ->> 'role') in ('teacher', 'admin')
  );
