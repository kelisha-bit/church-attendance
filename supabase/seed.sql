-- Church Attendance App - Seed Data
-- Run AFTER executing schema.sql

-- Ensure extensions exist
create extension if not exists "uuid-ossp";

-- Optional: create a helper function to upsert by natural keys
create or replace function public.upsert_member(_name text, _phone text, _email text, _address text, _department text, _date_of_birth date, _join_date date, _status member_status, _photo_url text, _notes text)
returns uuid language plpgsql as $$
declare _id uuid;
begin
  select id into _id from public.members where name=_name and phone=_phone limit 1;
  if _id is null then
    insert into public.members(name, phone, email, address, department, date_of_birth, join_date, status, photo_url, notes)
    values(_name, _phone, _email, _address, _department, _date_of_birth, coalesce(_join_date, current_date), coalesce(_status, 'Active'), _photo_url, _notes)
    returning id into _id;
  end if;
  return _id;
end;
$$;

-- Seed Members
select public.upsert_member('Akosua Mensah', '+233 24 123 4567', 'akosua.mensah@email.com', 'East Legon, Accra', 'Choir', '1994-05-12', '2022-03-15', 'Active', null, 'Member since childhood');
select public.upsert_member('Kwame Asante', '+233 20 987 6543', 'kwame.asante@email.com', 'Tema, Greater Accra', 'Ushering', '1990-09-03', '2023-01-20', 'Active', null, 'Very active in community service');
select public.upsert_member('Ama Osei', '+233 26 555 7890', 'ama.osei@email.com', 'Kumasi, Ashanti', 'Children''s Ministry', '1996-11-08', '2021-11-08', 'Active', null, 'Loves working with kids');
select public.upsert_member('Kofi Boateng', '+233 54 321 9876', 'kofi.boateng@email.com', 'Adenta, Accra', 'Youth Ministry', '1992-02-18', '2023-06-12', 'Active', null, 'Youth leader for over 5 years');
select public.upsert_member('Efua Darko', '+233 27 654 3210', 'efua.darko@email.com', 'Spintex, Accra', 'Prayer Team', '1995-07-27', '2022-09-03', 'Active', null, 'Regular attendee of prayer meetings');

-- Get some member ids for FK references
with m as (select id, name from public.members)
select * from m limit 5;

-- Seed Attendance (for today)
insert into public.attendance_records(member_id, service_date, service_type, present, check_in_time)
select id, current_date, 'Sunday Service', true, '09:15:00' from public.members where name='Akosua Mensah'
on conflict do nothing;

insert into public.attendance_records(member_id, service_date, service_type, present, check_in_time)
select id, current_date, 'Sunday Service', true, '09:20:00' from public.members where name='Kwame Asante'
on conflict do nothing;

insert into public.attendance_records(member_id, service_date, service_type, present)
select id, current_date, 'Sunday Service', false from public.members where name='Ama Osei'
on conflict do nothing;

-- Seed Donations (receipt_number must be unique)
insert into public.donations(member_id, donor_name, donor_phone, donor_email, amount, donation_type, payment_method, donation_date, notes, receipt_number)
select id, 'Akosua Mensah', '+233 24 123 4567', 'akosua.mensah@email.com', 500.00, 'Tithe', 'Mobile Money', current_date, 'Monthly tithe', 'RCP001'
from public.members where name='Akosua Mensah'
on conflict (receipt_number) do nothing;

insert into public.donations(member_id, donor_name, donor_phone, amount, donation_type, payment_method, donation_date, receipt_number)
select id, 'Kwame Asante', '+233 20 987 6543', 200.00, 'Offering', 'Cash', current_date, 'RCP002'
from public.members where name='Kwame Asante'
on conflict (receipt_number) do nothing;

insert into public.donations(donor_name, donor_phone, amount, donation_type, payment_method, donation_date, notes, receipt_number)
values('Anonymous Donor', '+233 26 555 0000', 1000.00, 'Building Fund', 'Bank Transfer', current_date - interval '1 day', 'For new sanctuary construction', 'RCP003')
on conflict (receipt_number) do nothing;

-- Seed Events
insert into public.events(title, description, event_date, event_time, location, recurring_frequency, notification_sent)
values
('Sunday Service', 'Weekly Sunday worship service', current_date, '09:00', 'Main Sanctuary', 'weekly', true),
('Prayer Meeting', 'Midweek prayer and intercession', current_date + interval '1 day', '18:00', 'Prayer Hall', 'weekly', true)
on conflict do nothing;

-- Seed Visitors
insert into public.visitors(name, phone, email, address, visit_date, visit_time, service, first_time, follow_up_needed, notes)
values
('Sarah Johnson', '+233 55 123 4567', 'sarah.j@email.com', 'Osu, Accra', current_date, '09:30:00', 'Sunday Service', true, true, null),
('Michael Owusu', '+233 24 987 6543', 'm.owusu@email.com', 'Dansoman, Accra', current_date, '09:45:00', 'Sunday Service', false, false, null),
('Grace Adjei', '+233 26 777 8888', 'grace.adjei@email.com', 'Achimota, Accra', current_date - interval '1 day', '10:00:00', 'Prayer Meeting', true, true, null)
on conflict do nothing;

-- Optional: create or upsert an admin profile (replace the UUID with an existing auth user id after signup)
-- insert into public.profiles(id, name, role) values('00000000-0000-0000-0000-000000000000', 'Admin User', 'Admin')
-- on conflict (id) do update set name=excluded.name, role=excluded.role;

-- Cleanup helper
drop function if exists public.upsert_member(text, text, text, text, text, date, date, member_status, text, text);
