-- Create daily_metrics table for automated wearable data
create table daily_metrics (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  date date not null,
  sleep_score integer,
  hrv integer,
  rhr integer,
  steps integer,
  stress_level integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

-- Enable RLS
alter table daily_metrics enable row level security;

-- Policies
create policy "Users can view their own metrics"
  on daily_metrics for select
  using (auth.uid() = user_id);

create policy "Users can insert their own metrics"
  on daily_metrics for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own metrics"
  on daily_metrics for update
  using (auth.uid() = user_id);
