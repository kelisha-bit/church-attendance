import { createClient } from "@supabase/supabase-js"

// Get environment variables - these should be set in Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Debug logging (remove in production)
console.log("Supabase URL:", supabaseUrl ? "✓ Set" : "✗ Missing")
console.log("Supabase Anon Key:", supabaseAnonKey ? "✓ Set" : "✗ Missing")

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase environment variables are missing. Using mock mode.")
}

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
