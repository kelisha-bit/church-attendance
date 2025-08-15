# Supabase Database Setup

This app uses Supabase (Postgres) and the SQL here provisions all required tables used across the codebase.

## Tables
- `profiles` (user profile + role, linked to `auth.users`)
- `members`
- `attendance_records`
- `donations`
- `events`
- `visitors`

## Columns referenced in code
- Members: `id, name, phone, email, address, department, date_of_birth, join_date, status, photo_url, notes, created_at, updated_at`
- Attendance: `id, member_id, service_date, service_type, present, check_in_time, created_at`
- Donations: `id, member_id, donor_name, donor_phone, donor_email, amount, donation_type, payment_method, donation_date, notes, receipt_number, created_at`
- Events: `id, title, description, event_date, event_time, location, recurring_frequency, notification_sent, created_at`
- Visitors: `id, name, phone, email, address, visit_date, visit_time, service, first_time, follow_up_needed, notes, photo_url, created_at`
- Profiles: `id, name, role`

## How to initialize (Supabase SQL Editor)
1. Open Supabase project -> SQL Editor.
2. Paste and run `schema.sql`.
3. Paste and run `seed.sql` (optional demo data).

## Auth integration notes
- `lib/auth.ts` fetches profile via `profiles` with `id = auth.uid()` and reads `name, role`.
- Ensure you sign up at least one user and then insert a row in `profiles` with that user id and desired role (e.g. `Admin`).

## RLS Policies
- Simplified policies allow any authenticated user to read/write all tables. Tighten as needed for production.

## Environment
Set in `.env.local` or Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Migrations
If you want versioned migrations, copy these SQL files into a migrations workflow (e.g., Supabase CLI) later. For now, running in SQL Editor is sufficient.
