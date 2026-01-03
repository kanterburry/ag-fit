-- Create protocols table
create table if not exists protocols (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  hypothesis text,
  status text check (status in ('draft', 'active', 'completed', 'paused')) default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create protocol_phases table
create table if not exists protocol_phases (
  id uuid default gen_random_uuid() primary key,
  protocol_id uuid references protocols(id) on delete cascade not null,
  name text not null,
  type text check (type in ('baseline', 'intervention', 'washout')) not null,
  description text,
  duration_days integer not null default 1,
  order_index integer not null
);

-- Create daily_logs table
create table if not exists daily_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  protocol_id uuid references protocols(id) on delete cascade not null,
  phase_id uuid references protocol_phases(id) on delete set null,
  date date not null,
  data jsonb default '{}'::jsonb,
  completed boolean default false,
  created_at timestamptz default now(),
  unique(user_id, protocol_id, date)
);

-- Enable Row Level Security (RLS)
alter table protocols enable row level security;
alter table protocol_phases enable row level security;
alter table daily_logs enable row level security;

-- Create policies
create policy "Users can view their own protocols"
  on protocols for select
  using (auth.uid() = user_id);

create policy "Users can insert their own protocols"
  on protocols for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own protocols"
  on protocols for update
  using (auth.uid() = user_id);

create policy "Users can delete their own protocols"
  on protocols for delete
  using (auth.uid() = user_id);

-- Protocol Phases policies (inherit access via protocol ownership ideally, but for simplicity assuming direct access check or cascade)
-- Since phases are child of protocol, checking protocol ownership is best.
-- Note: Subqueries in RLS can be expensive, but typical for this structure.

create policy "Users can view phases of their protocols"
  on protocol_phases for select
  using (
    exists (
      select 1 from protocols
      where protocols.id = protocol_phases.protocol_id
      and protocols.user_id = auth.uid()
    )
  );

create policy "Users can insert phases to their protocols"
  on protocol_phases for insert
  with check (
    exists (
      select 1 from protocols
      where protocols.id = protocol_phases.protocol_id
      and protocols.user_id = auth.uid()
    )
  );

create policy "Users can update phases of their protocols"
  on protocol_phases for update
  using (
    exists (
      select 1 from protocols
      where protocols.id = protocol_phases.protocol_id
      and protocols.user_id = auth.uid()
    )
  );

create policy "Users can delete phases of their protocols"
  on protocol_phases for delete
  using (
    exists (
      select 1 from protocols
      where protocols.id = protocol_phases.protocol_id
      and protocols.user_id = auth.uid()
    )
  );

-- Daily Logs policies
create policy "Users can view their own logs"
  on daily_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own logs"
  on daily_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own logs"
  on daily_logs for update
  using (auth.uid() = user_id);

create policy "Users can delete their own logs"
  on daily_logs for delete
  using (auth.uid() = user_id);
