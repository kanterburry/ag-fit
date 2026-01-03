-- Add Body Battery table
CREATE TABLE IF NOT EXISTS garmin_body_battery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    body_battery_min INTEGER,
    body_battery_max INTEGER,
    body_battery_charged INTEGER,
    body_battery_drained INTEGER,
    body_battery_readings_json JSONB,
    synced_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE garmin_body_battery ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can view own body battery data"
    ON garmin_body_battery
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own body battery data"
    ON garmin_body_battery
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own body battery data"
    ON garmin_body_battery
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create index
CREATE INDEX idx_garmin_body_battery_user_date ON garmin_body_battery(user_id, date DESC);
