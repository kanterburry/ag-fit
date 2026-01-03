-- Add studies column to protocols table
alter table protocols 
add column if not exists studies jsonb default '[]'::jsonb;

-- Add comment
comment on column protocols.studies is 'Array of research study URLs or DOIs supporting this protocol';
