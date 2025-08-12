-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  donor_name VARCHAR(255) NOT NULL,
  donor_phone VARCHAR(20),
  donor_email VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  donation_type VARCHAR(100) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  donation_date DATE NOT NULL,
  notes TEXT,
  receipt_number VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donations_member_id ON donations(member_id);
CREATE INDEX IF NOT EXISTS idx_donations_date ON donations(donation_date);
CREATE INDEX IF NOT EXISTS idx_donations_type ON donations(donation_type);
CREATE INDEX IF NOT EXISTS idx_donations_receipt ON donations(receipt_number);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);

-- Insert sample donation data
INSERT INTO donations (member_id, donor_name, donor_phone, donor_email, amount, donation_type, payment_method, donation_date, notes, receipt_number) VALUES
  ((SELECT id FROM members WHERE name = 'John Doe' LIMIT 1), 'John Doe', '+233 24 123 4567', 'john.doe@email.com', 500.00, 'Tithe', 'Mobile Money', '2024-01-15', 'Monthly tithe contribution', 'RCP001001'),
  ((SELECT id FROM members WHERE name = 'Jane Smith' LIMIT 1), 'Jane Smith', '+233 20 987 6543', 'jane.smith@email.com', 200.00, 'Offering', 'Cash', '2024-01-15', 'Sunday service offering', 'RCP001002'),
  (NULL, 'Anonymous Donor', NULL, NULL, 1000.00, 'Building Fund', 'Bank Transfer', '2024-01-14', 'Building project donation', 'RCP001003'),
  ((SELECT id FROM members WHERE name = 'Michael Johnson' LIMIT 1), 'Michael Johnson', '+233 26 555 0123', 'michael.j@email.com', 300.00, 'Missions', 'Card Payment', '2024-01-13', 'Missions support', 'RCP001004'),
  ((SELECT id FROM members WHERE name = 'Sarah Wilson' LIMIT 1), 'Sarah Wilson', '+233 24 777 8888', 'sarah.w@email.com', 150.00, 'Special Offering', 'Mobile Money', '2024-01-12', 'Special thanksgiving offering', 'RCP001005'),
  (NULL, 'Guest Visitor', '+233 20 111 2222', NULL, 50.00, 'Offering', 'Cash', '2024-01-11', 'First time visitor offering', 'RCP001006'),
  ((SELECT id FROM members WHERE name = 'David Brown' LIMIT 1), 'David Brown', '+233 24 333 4444', 'david.b@email.com', 750.00, 'Tithe', 'Bank Transfer', '2024-01-10', 'Quarterly tithe payment', 'RCP001007'),
  ((SELECT id FROM members WHERE name = 'Emily Davis' LIMIT 1), 'Emily Davis', '+233 26 666 7777', 'emily.d@email.com', 100.00, 'Thanksgiving', 'Cash', '2024-01-09', 'Thanksgiving service offering', 'RCP001008'),
  (NULL, 'Corporate Sponsor', '+233 30 888 9999', 'sponsor@company.com', 2000.00, 'Building Fund', 'Cheque', '2024-01-08', 'Corporate sponsorship for building project', 'RCP001009'),
  ((SELECT id FROM members WHERE name = 'Robert Miller' LIMIT 1), 'Robert Miller', '+233 24 444 5555', 'robert.m@email.com', 400.00, 'Seed Offering', 'Mobile Money', '2024-01-07', 'Seed offering for new year', 'RCP001010')
ON CONFLICT (receipt_number) DO NOTHING;

-- Add some recent donations for better demo
INSERT INTO donations (member_id, donor_name, donor_phone, donor_email, amount, donation_type, payment_method, donation_date, notes, receipt_number) VALUES
  ((SELECT id FROM members WHERE name = 'John Doe' LIMIT 1), 'John Doe', '+233 24 123 4567', 'john.doe@email.com', 500.00, 'Tithe', 'Mobile Money', CURRENT_DATE, 'Current month tithe', 'RCP' || EXTRACT(EPOCH FROM NOW())::bigint::text),
  ((SELECT id FROM members WHERE name = 'Jane Smith' LIMIT 1), 'Jane Smith', '+233 20 987 6543', 'jane.smith@email.com', 250.00, 'Offering', 'Cash', CURRENT_DATE, 'Sunday service offering', 'RCP' || (EXTRACT(EPOCH FROM NOW())::bigint + 1)::text),
  (NULL, 'Walk-in Donor', '+233 55 123 4567', NULL, 100.00, 'Special Offering', 'Cash', CURRENT_DATE, 'Special donation', 'RCP' || (EXTRACT(EPOCH FROM NOW())::bigint + 2)::text)
ON CONFLICT (receipt_number) DO NOTHING;

-- Grant necessary permissions (if using RLS)
-- ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read access for all users" ON donations FOR SELECT USING (true);
-- CREATE POLICY "Enable insert for authenticated users only" ON donations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Enable update for authenticated users only" ON donations FOR UPDATE USING (auth.role() = 'authenticated');
-- CREATE POLICY "Enable delete for authenticated users only" ON donations FOR DELETE USING (auth.role() = 'authenticated');
