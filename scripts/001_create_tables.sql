-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Members table
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    department VARCHAR(100) NOT NULL,
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visitors table
CREATE TABLE visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    visit_time TIME NOT NULL,
    service VARCHAR(100) NOT NULL,
    first_time BOOLEAN NOT NULL DEFAULT true,
    follow_up_needed BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance records table
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    service_date DATE NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    present BOOLEAN NOT NULL DEFAULT false,
    check_in_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(member_id, service_date, service_type)
);

-- Events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Signatures table for certificates
CREATE TABLE signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    signature_url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations table
CREATE TABLE donations (
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
CREATE INDEX idx_members_department ON members(department);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_visitors_visit_date ON visitors(visit_date);
CREATE INDEX idx_attendance_service_date ON attendance_records(service_date);
CREATE INDEX idx_attendance_member_id ON attendance_records(member_id);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_donations_member_id ON donations(member_id);
CREATE INDEX idx_donations_date ON donations(donation_date);
CREATE INDEX idx_donations_type ON donations(donation_type);
CREATE INDEX idx_donations_receipt ON donations(receipt_number);

-- Create updated_at trigger for members table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
