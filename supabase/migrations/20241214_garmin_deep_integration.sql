-- Garmin Deep Integration Schema Migration
-- This migration adds comprehensive health and performance tracking tables

-- 1. Respiration Tracking
CREATE TABLE IF NOT EXISTS garmin_respiration (
    date DATE PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    avg_waking_breaths_per_minute FLOAT,
    avg_sleeping_breaths_per_minute FLOAT,
    highest_breaths_per_minute FLOAT,
    lowest_breaths_per_minute FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SpO2 (Blood Oxygen) Tracking
CREATE TABLE IF NOT EXISTS garmin_spo2 (
    date DATE PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    avg_spo2_percentage FLOAT,
    lowest_spo2_percentage FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Comprehensive Wellness Data
CREATE TABLE IF NOT EXISTS garmin_wellness (
    date DATE PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    hydration_liters FLOAT,
    hydration_goal_liters FLOAT,
    blood_pressure_systolic INT,
    blood_pressure_diastolic INT,
    blood_pressure_pulse INT,
    menstrual_cycle_json JSONB,
    pregnancy_json JSONB,
    jet_lag_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Challenges & Gamification
CREATE TABLE IF NOT EXISTS garmin_challenges (
    challenge_id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT, -- 'badge', 'adhoc', 'virtual'
    status TEXT, -- 'active', 'completed', 'available'
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    progress_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Goals Tracking
CREATE TABLE IF NOT EXISTS garmin_goals (
    goal_id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT, -- 'steps', 'distance', 'activeMinutes', etc.
    target_value INT,
    current_value INT,
    start_date DATE,
    end_date DATE,
    status TEXT, -- 'active', 'future', 'past'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Race Predictions
CREATE TABLE IF NOT EXISTS garmin_races (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    race_name TEXT NOT NULL, -- '5K', '10K', 'Half Marathon', 'Marathon'
    predicted_time_seconds INT,
    distance_meters FLOAT,
    confidence_score FLOAT,
    calculated_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Training Status Table
CREATE TABLE IF NOT EXISTS garmin_training_status (
    date DATE PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT,
    load_balance_json JSONB,
    fitness_age FLOAT,
    lactate_threshold_bpm INT,
    lactate_threshold_speed FLOAT,
    vo2_max_running FLOAT,
    vo2_max_cycling FLOAT,
    endurance_score INT,
    heat_acclimation FLOAT,
    altitude_acclimation FLOAT,
    training_load_balance_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Training Readiness Table
CREATE TABLE IF NOT EXISTS garmin_training_readiness (
    date DATE PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score INT,
    rating TEXT,
    recovery_time_hours INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Enhance garmin_devices table (create if doesn't exist first)
CREATE TABLE IF NOT EXISTS garmin_devices (
    device_id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    part_number TEXT,
    software_version TEXT,
    battery_status TEXT,
    solar_data_json JSONB,
    last_sync TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_garmin_respiration_user_date ON garmin_respiration(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_garmin_spo2_user_date ON garmin_spo2(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_garmin_wellness_user_date ON garmin_wellness(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_garmin_challenges_user_status ON garmin_challenges(user_id, status);
CREATE INDEX IF NOT EXISTS idx_garmin_goals_user_status ON garmin_goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_garmin_races_user_date ON garmin_races(user_id, calculated_date DESC);
CREATE INDEX IF NOT EXISTS idx_garmin_training_status_user_date ON garmin_training_status(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_garmin_training_readiness_user_date ON garmin_training_readiness(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_garmin_devices_user ON garmin_devices(user_id);

-- Enable Row Level Security
ALTER TABLE garmin_respiration ENABLE ROW LEVEL SECURITY;
ALTER TABLE garmin_spo2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE garmin_wellness ENABLE ROW LEVEL SECURITY;
ALTER TABLE garmin_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE garmin_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE garmin_races ENABLE ROW LEVEL SECURITY;
ALTER TABLE garmin_training_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE garmin_training_readiness ENABLE ROW LEVEL SECURITY;
ALTER TABLE garmin_devices ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can view own respiration data" ON garmin_respiration FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own respiration data" ON garmin_respiration FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own respiration data" ON garmin_respiration FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own spo2 data" ON garmin_spo2 FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own spo2 data" ON garmin_spo2 FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own spo2 data" ON garmin_spo2 FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own wellness data" ON garmin_wellness FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wellness data" ON garmin_wellness FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wellness data" ON garmin_wellness FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own challenges" ON garmin_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own challenges" ON garmin_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own challenges" ON garmin_challenges FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own goals" ON garmin_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON garmin_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON garmin_goals FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own races" ON garmin_races FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own races" ON garmin_races FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own races" ON garmin_races FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own training status" ON garmin_training_status FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own training status" ON garmin_training_status FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own training status" ON garmin_training_status FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own training readiness" ON garmin_training_readiness FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own training readiness" ON garmin_training_readiness FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own training readiness" ON garmin_training_readiness FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own devices" ON garmin_devices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own devices" ON garmin_devices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own devices" ON garmin_devices FOR UPDATE USING (auth.uid() = user_id);
