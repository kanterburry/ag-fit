alter table garmin_training_status 
add column if not exists endurance_score integer,
add column if not exists hill_score integer,
add column if not exists vo2_max_running integer,
add column if not exists vo2_max_cycling integer,
add column if not exists lactose_threshold_bpm integer,
add column if not exists lactose_threshold_speed float,
add column if not exists fitness_age float,
add column if not exists heat_acclimation float,
add column if not exists altitude_acclimation float,
add column if not exists training_load_balance_json jsonb;
