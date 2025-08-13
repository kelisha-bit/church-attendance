-- Create visitors table used by VisitorCheckin
-- Ensures UUID generation is available (Supabase/Postgres)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(255),
  address TEXT,
  visit_date DATE NOT NULL,
  visit_time TIME NOT NULL,
  service VARCHAR(100) NOT NULL,
  first_time BOOLEAN NOT NULL DEFAULT true,
  follow_up_needed BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helpful indexes for common queries
CREATE INDEX IF NOT EXISTS idx_visitors_created_at ON visitors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_visit_date ON visitors(visit_date);
CREATE INDEX IF NOT EXISTS idx_visitors_service ON visitors(service);
CREATE INDEX IF NOT EXISTS idx_visitors_name ON visitors(name);
CREATE INDEX IF NOT EXISTS idx_visitors_phone ON visitors(phone);

-- If using Row Level Security (RLS) in Supabase, you can enable and set policies like below:
-- ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read for all" ON visitors FOR SELECT USING (true);
-- CREATE POLICY "Enable insert for authenticated" ON visitors FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Enable update for authenticated" ON visitors FOR UPDATE USING (auth.role() = 'authenticated');
-- CREATE POLICY "Enable delete for authenticated" ON visitors FOR DELETE USING (auth.role() = 'authenticated');


