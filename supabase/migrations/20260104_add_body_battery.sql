-- Add Body Battery columns to daily_metrics
alter table daily_metrics 
add column if not exists body_battery_min integer,
add column if not exists body_battery_max integer;
