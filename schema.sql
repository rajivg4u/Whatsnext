-- TaskFlow initial schema (Supabase / PostgreSQL)
-- Run this in Supabase Dashboard > SQL Editor.
create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  colour text not null default '#4778e8',
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  start_date date,
  due_date date not null,
  priority text not null default 'Medium'
    check (priority in ('Low', 'Medium', 'High')),
  status text not null default 'Pending'
    check (status in ('Pending', 'In Progress', 'Completed')),
  progress integer not null default 0 check (progress between 0 and 100),
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.subtasks (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  title text not null,
  is_completed boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.task_history (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  old_status text,
  new_status text,
  changed_at timestamptz not null default now()
);

create index if not exists tasks_user_due_date_idx on public.tasks(user_id, due_date);
create index if not exists tasks_user_status_idx on public.tasks(user_id, status);
create index if not exists subtasks_task_id_idx on public.subtasks(task_id);

alter table public.categories enable row level security;
alter table public.tasks enable row level security;
alter table public.subtasks enable row level security;
alter table public.task_history enable row level security;

create policy "Users manage their own categories"
on public.categories for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage their own tasks"
on public.tasks for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage subtasks of their own tasks"
on public.subtasks for all
using (
  exists (select 1 from public.tasks t where t.id = task_id and t.user_id = auth.uid())
)
with check (
  exists (select 1 from public.tasks t where t.id = task_id and t.user_id = auth.uid())
);

create policy "Users view and add their own task history"
on public.task_history for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
