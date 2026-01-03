-- Add sleep tracking columns to daily_metrics
alter table daily_metrics 
add column if not exists bedtime timestamp with time zone,
add column if not exists wakeup_time timestamp with time zone,
add column if not exists sleep_duration_seconds integer,
add column if not exists deep_sleep_seconds integer,
add column if not exists rem_sleep_seconds integer,
add column if not exists light_sleep_seconds integer;
