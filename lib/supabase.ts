import { createClient } from "@supabase/supabase-js"

// Get environment variables - these should be set in Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Debug logging in development only, and only once
const isDev = process.env.NODE_ENV !== "production"
const isBrowser = typeof window !== "undefined"
const globalAny = globalThis as unknown as { __LOG_ONCE_FLAGS__?: Record<string, boolean> }

function logOnce(flag: string, callback: () => void) {
  if (!globalAny.__LOG_ONCE_FLAGS__) globalAny.__LOG_ONCE_FLAGS__ = {}
  if (globalAny.__LOG_ONCE_FLAGS__[flag]) return
  globalAny.__LOG_ONCE_FLAGS__[flag] = true
  callback()
}

if (isDev && isBrowser) {
  logOnce("supabase-debug", () => {
    // Basic status logs
    console.log("Supabase URL:", supabaseUrl ? "✓ Set" : "✗ Missing")
    console.log("Supabase Anon Key:", supabaseAnonKey ? "✓ Set" : "✗ Missing")
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase environment variables are missing. Using mock mode.")
    }
  })
}

// Note: Warning is handled above (browser dev only) to reduce noise in server logs

// Create Supabase client only if we have the required variables
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => {
  return supabase !== null && supabaseUrl && supabaseAnonKey
}

// Database types
export interface Member {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  department: string
  join_date: string
  status: "Active" | "Inactive"
  photo_url?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Visitor {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
  visit_date: string
  visit_time: string
  service: string
  first_time: boolean
  follow_up_needed: boolean
  notes?: string
  photo_url?: string
  created_at: string
}

export interface AttendanceRecord {
  id: string
  member_id: string
  service_date: string
  service_type: string
  present: boolean
  check_in_time?: string
  created_at: string
}

export interface Event {
  id: string
  title: string
  description?: string
  event_date: string
  event_time: string
  location?: string
  created_at: string
}

export interface Signature {
  id: string
  name: string
  title: string
  signature_url: string
  is_active: boolean
  created_at: string
}

export interface Donation {
  id: string
  member_id?: string
  donor_name: string
  donor_phone?: string
  donor_email?: string
  amount: number
  donation_type: string
  payment_method: string
  donation_date: string
  notes?: string
  receipt_number: string
  created_at: string
}

export interface DonationSummary {
  total_amount: number
  donation_count: number
  average_donation: number
  top_donor: string
  most_common_type: string
}

// Mock data for when Supabase is not available
export const mockMembers: Member[] = [
  {
    id: "1",
    name: "Akosua Mensah",
    phone: "+233 24 123 4567",
    email: "akosua.mensah@email.com",
    address: "East Legon, Accra",
    department: "Choir",
    join_date: "2022-03-15",
    status: "Active",
    created_at: "2022-03-15T00:00:00Z",
    updated_at: "2022-03-15T00:00:00Z",
    notes: "Member since childhood",
  },
  {
    id: "2",
    name: "Kwame Asante",
    phone: "+233 20 987 6543",
    email: "kwame.asante@email.com",
    address: "Tema, Greater Accra",
    department: "Ushering",
    join_date: "2023-01-20",
    status: "Active",
    created_at: "2023-01-20T00:00:00Z",
    updated_at: "2023-01-20T00:00:00Z",
    notes: "Very active in community service",
  },
  {
    id: "3",
    name: "Ama Osei",
    phone: "+233 26 555 7890",
    email: "ama.osei@email.com",
    address: "Kumasi, Ashanti",
    department: "Children's Ministry",
    join_date: "2021-11-08",
    status: "Active",
    created_at: "2021-11-08T00:00:00Z",
    updated_at: "2021-11-08T00:00:00Z",
    notes: "Loves working with kids",
  },
  {
    id: "4",
    name: "Kofi Boateng",
    phone: "+233 54 321 9876",
    email: "kofi.boateng@email.com",
    address: "Adenta, Accra",
    department: "Youth Ministry",
    join_date: "2023-06-12",
    status: "Active",
    created_at: "2023-06-12T00:00:00Z",
    updated_at: "2023-06-12T00:00:00Z",
    notes: "Youth leader for over 5 years",
  },
  {
    id: "5",
    name: "Efua Darko",
    phone: "+233 27 654 3210",
    email: "efua.darko@email.com",
    address: "Spintex, Accra",
    department: "Prayer Team",
    join_date: "2022-09-03",
    status: "Active",
    created_at: "2022-09-03T00:00:00Z",
    updated_at: "2022-09-03T00:00:00Z",
    notes: "Regular attendee of prayer meetings",
  },
]

export const mockVisitors: Visitor[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    phone: "+233 55 123 4567",
    email: "sarah.j@email.com",
    address: "Osu, Accra",
    visit_date: new Date().toISOString().split("T")[0],
    visit_time: "09:30:00",
    service: "Sunday Service",
    first_time: true,
    follow_up_needed: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Michael Owusu",
    phone: "+233 24 987 6543",
    email: "m.owusu@email.com",
    address: "Dansoman, Accra",
    visit_date: new Date().toISOString().split("T")[0],
    visit_time: "09:45:00",
    service: "Sunday Service",
    first_time: false,
    follow_up_needed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Grace Adjei",
    phone: "+233 26 777 8888",
    email: "grace.adjei@email.com",
    address: "Achimota, Accra",
    visit_date: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday
    visit_time: "10:00:00",
    service: "Prayer Meeting",
    first_time: true,
    follow_up_needed: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: "1",
    member_id: "1",
    service_date: new Date().toISOString().split("T")[0],
    service_type: "Sunday Service",
    present: true,
    check_in_time: "09:15:00",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    member_id: "2",
    service_date: new Date().toISOString().split("T")[0],
    service_type: "Sunday Service",
    present: true,
    check_in_time: "09:20:00",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    member_id: "3",
    service_date: new Date().toISOString().split("T")[0],
    service_type: "Sunday Service",
    present: false,
    created_at: new Date().toISOString(),
  },
]

export const mockDonations: Donation[] = [
  {
    id: "1",
    member_id: "1",
    donor_name: "Akosua Mensah",
    donor_phone: "+233 24 123 4567",
    donor_email: "akosua.mensah@email.com",
    amount: 500.0,
    donation_type: "Tithe",
    payment_method: "Mobile Money",
    donation_date: new Date().toISOString().split("T")[0],
    notes: "Monthly tithe",
    receipt_number: "RCP001",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    member_id: "2",
    donor_name: "Kwame Asante",
    donor_phone: "+233 20 987 6543",
    amount: 200.0,
    donation_type: "Offering",
    payment_method: "Cash",
    donation_date: new Date().toISOString().split("T")[0],
    receipt_number: "RCP002",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    donor_name: "Anonymous Donor",
    donor_phone: "+233 26 555 0000",
    amount: 1000.0,
    donation_type: "Building Fund",
    payment_method: "Bank Transfer",
    donation_date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    notes: "For new sanctuary construction",
    receipt_number: "RCP003",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "4",
    member_id: "3",
    donor_name: "Ama Osei",
    donor_phone: "+233 26 555 7890",
    amount: 150.0,
    donation_type: "Special Offering",
    payment_method: "Mobile Money",
    donation_date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
    notes: "Missions support",
    receipt_number: "RCP004",
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "5",
    member_id: "4",
    donor_name: "Kofi Boateng",
    donor_phone: "+233 54 321 9876",
    amount: 300.0,
    donation_type: "Tithe",
    payment_method: "Cash",
    donation_date: new Date(Date.now() - 259200000).toISOString().split("T")[0],
    receipt_number: "RCP005",
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
]
