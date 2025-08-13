-- Create events table used by Events & Notifications
-- Ensures UUID generation is available (Supabase/Postgres)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location VARCHAR(255),
  -- Recurrence: none | weekly | monthly | yearly
  recurring_frequency VARCHAR(20) NOT NULL DEFAULT 'none',
  -- Whether a reminder/notification has been sent for this event
  notification_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helpful indexes for common queries
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_recurring ON events(recurring_frequency);

-- Optional RLS setup (uncomment if using Supabase RLS)
-- ALTER TABLE events ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read for all" ON events FOR SELECT USING (true);
-- CREATE POLICY "Enable insert for authenticated" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Enable update for authenticated" ON events FOR UPDATE USING (auth.role() = 'authenticated');
-- CREATE POLICY "Enable delete for authenticated" ON events FOR DELETE USING (auth.role() = 'authenticated');


