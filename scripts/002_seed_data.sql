-- Insert sample members
INSERT INTO members (name, phone, email, address, department, join_date, status) VALUES
('Akosua Mensah', '+233 24 123 4567', 'akosua.mensah@email.com', 'East Legon, Accra', 'Choir', '2022-03-15', 'Active'),
('Kwame Asante', '+233 20 987 6543', 'kwame.asante@email.com', 'Tema, Greater Accra', 'Ushering', '2023-01-20', 'Active'),
('Ama Osei', '+233 26 555 7890', 'ama.osei@email.com', 'Kumasi, Ashanti', 'Children''s Ministry', '2021-11-08', 'Active'),
('Kofi Boateng', '+233 54 321 9876', 'kofi.boateng@email.com', 'Adenta, Accra', 'Youth Ministry', '2023-06-12', 'Active'),
('Efua Darko', '+233 27 654 3210', 'efua.darko@email.com', 'Spintex, Accra', 'Prayer Team', '2022-09-03', 'Active'),
('Yaw Mensah', '+233 55 111 2222', 'yaw.mensah@email.com', 'Madina, Accra', 'Media Team', '2023-02-14', 'Active'),
('Abena Asante', '+233 24 333 4444', 'abena.asante@email.com', 'Kasoa, Central', 'Choir', '2022-12-01', 'Active'),
('Kojo Osei', '+233 20 555 6666', 'kojo.osei@email.com', 'Teshie, Accra', 'Ushering', '2023-04-18', 'Active');

-- Insert sample visitors
INSERT INTO visitors (name, phone, email, address, visit_date, visit_time, service, first_time, follow_up_needed) VALUES
('Sarah Johnson', '+233 55 123 4567', 'sarah.j@email.com', 'Osu, Accra', CURRENT_DATE, '09:30:00', 'Sunday Service', true, true),
('Michael Owusu', '+233 24 987 6543', 'm.owusu@email.com', 'Dansoman, Accra', CURRENT_DATE, '09:45:00', 'Sunday Service', false, false),
('Grace Adjei', '+233 26 777 8888', 'grace.adjei@email.com', 'Achimota, Accra', CURRENT_DATE - INTERVAL '1 day', '10:00:00', 'Prayer Meeting', true, true);

-- Insert sample attendance records for today
INSERT INTO attendance_records (member_id, service_date, service_type, present, check_in_time)
SELECT 
    m.id,
    CURRENT_DATE,
    'Sunday Service',
    CASE WHEN random() > 0.3 THEN true ELSE false END,
    CASE WHEN random() > 0.3 THEN (TIME '09:00:00' + (random() * INTERVAL '2 hours')) ELSE NULL END
FROM members m;

-- Insert sample events
INSERT INTO events (title, description, event_date, event_time, location) VALUES
('Prayer Meeting', 'Weekly prayer and intercession meeting', CURRENT_DATE + INTERVAL '3 days', '18:00:00', 'Main Sanctuary'),
('Youth Service', 'Special service for young people', CURRENT_DATE + INTERVAL '5 days', '16:00:00', 'Youth Hall'),
('Bible Study', 'Weekly Bible study and discussion', CURRENT_DATE + INTERVAL '7 days', '19:00:00', 'Conference Room'),
('Church Picnic', 'Annual church family picnic', CURRENT_DATE + INTERVAL '14 days', '10:00:00', 'Aburi Gardens');

-- Insert sample signature
INSERT INTO signatures (name, title, signature_url, is_active) VALUES
('Pastor John Mensah', 'Senior Pastor', '/placeholder.svg?height=100&width=200&text=Pastor+Signature', true);
