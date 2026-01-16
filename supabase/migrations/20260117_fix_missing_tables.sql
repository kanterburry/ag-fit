-- Migration to fix missing tables identified in logs
-- Tables: garmin_daily_metrics, garmin_body_battery, daily_metrics

-- 1. Garmin Daily Metrics (Raw data from Garmin)
CREATE TABLE IF NOT EXISTS public.garmin_daily_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Matching string ID from Garmin/Auth
    date DATE NOT NULL,
    
    total_steps INT,
    total_distance_meters NUMERIC,
    floors_climbed INT,
    calories_active INT,
    calories_consumed INT,
    resting_hr INT,
    max_hr INT,
    stress_avg INT,
    body_battery_min INT,
    body_battery_max INT,
    
    sleep_score INT,
    sleep_seconds INT,
    rem_sleep_seconds INT,
    deep_sleep_seconds INT,
    light_sleep_seconds INT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, date)
);

-- 2. Garmin Body Battery (Detailed)
CREATE TABLE IF NOT EXISTS public.garmin_body_battery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    date DATE NOT NULL,
    
    body_battery_min INT,
    body_battery_max INT,
    body_battery_charged INT,
    body_battery_drained INT,
    body_battery_readings_json JSONB, -- Full array of readings
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, date)
);

-- 3. Unified Daily Metrics (The "Hub" for Protocol Analysis)
CREATE TABLE IF NOT EXISTS public.daily_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    date DATE NOT NULL,
    
    -- Core Bio-Auditor Metrics
    sleep_score INT,
    resting_hr INT,
    stress_avg INT,
    hrv_avg_ms INT,
    body_battery_max INT,
    sleep_duration_seconds INT,
    
    bedtime TIMESTAMP WITH TIME ZONE,
    wakeup_time TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, date)
);

-- RLS Policies
ALTER TABLE public.garmin_daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garmin_body_battery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own garmin metrics" ON public.garmin_daily_metrics;
CREATE POLICY "Users can manage their own garmin metrics" ON public.garmin_daily_metrics
    USING (auth.uid()::text = user_id::text)
    WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Service Role can manage garmin metrics" ON public.garmin_daily_metrics;
CREATE POLICY "Service Role can manage garmin metrics" ON public.garmin_daily_metrics
    TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage their own body battery" ON public.garmin_body_battery;
CREATE POLICY "Users can manage their own body battery" ON public.garmin_body_battery
    USING (auth.uid()::text = user_id::text)
    WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Service Role can manage body battery" ON public.garmin_body_battery;
CREATE POLICY "Service Role can manage body battery" ON public.garmin_body_battery
    TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage their own daily metrics" ON public.daily_metrics;
CREATE POLICY "Users can manage their own daily metrics" ON public.daily_metrics
    USING (auth.uid()::text = user_id::text)
    WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Service Role can manage daily metrics" ON public.daily_metrics;
CREATE POLICY "Service Role can manage daily metrics" ON public.daily_metrics
    TO service_role USING (true) WITH CHECK (true);
