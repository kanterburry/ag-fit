-- Profiles (Optional, if we want to store extra user data)
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY, -- Matches NextAuth user ID (sub)
  email TEXT NOT NULL,
  streak_count INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE
);

-- Workouts
CREATE TABLE IF NOT EXISTS workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL, -- References profiles(id)
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('strength', 'bft', 'cardio')),
  source TEXT NOT NULL CHECK (source IN ('manual', 'gcal', 'garmin')),
  status TEXT NOT NULL CHECK (status IN ('planned', 'completed', 'missed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Exercises
CREATE TABLE IF NOT EXISTS exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sets JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {reps, weight, rpe}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Benchmarks
CREATE TABLE IF NOT EXISTS benchmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  target_value NUMERIC,
  current_value NUMERIC,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_exercises_workout_id ON exercises(workout_id);

-- Push Subscriptions (For Nudge Engine)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, endpoint)
);

-- Add notification flag to workouts if it doesn't exist
-- Note: User must run this manually or we use a migration tool. 
-- For schema.sql reference:
-- ALTER TABLE workouts ADD COLUMN IF NOT EXISTS notification_sent BOOLEAN DEFAULT FALSE;
