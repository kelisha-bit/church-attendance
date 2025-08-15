"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import LoginForm from "@/components/login-form"
import ProtectedRoute from "@/components/protected-route"
import AppHeader from "@/components/app-header"
import SplashScreen from "@/components/splash-screen"
import MemberManagement from "@/components/member-management"
import AttendanceTracker from "@/components/attendance-tracker"
import PhotoManagement from "@/components/photo-management"
import DonationManagement from "@/components/donation-management"
import Reports from "@/components/reports"
import CertificatesReports from "@/components/certificates-reports"
import SignatureManagement from "@/components/signature-management"
import EventsNotifications from "@/components/events-notifications"
import VisitorCheckin from "@/components/visitor-checkin"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  supabase,
  isSupabaseAvailable,
  mockMembers,
  mockAttendanceRecords,
  mockDonations,
  type Event,
} from "@/lib/supabase"
import {
  Users,
  Calendar,
  Camera,
  DollarSign,
  FileText,
  Award,
  PenTool,
  Bell,
  TrendingUp,
  Clock,
  MapPin,
} from "lucide-react"
import { Gift } from "lucide-react"

export default function Home() {
  const { user, loading } = useAuth()
  const [showSplash, setShowSplash] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [loadingDash, setLoadingDash] = useState(true)
  const [errorDash, setErrorDash] = useState<string | null>(null)
  const [stats, setStats] = useState({
    members: 0,
    todaysAttendance: 0,
    monthlyDonations: 0,
    activeEvents: 0,
  })
  const [recent, setRecent] = useState<
    Array<{ type: "Member" | "Donation" | "Event"; title: string; subtitle: string; created_at: string; color: string }>
  >([])
  const [upcoming, setUpcoming] = useState<Event[]>([])
  const [signature, setSignature] = useState<string | null>(null)
  const [birthdays, setBirthdays] = useState<Array<{ name: string; date_of_birth: string; nextDate: string; daysUntil: number }>>([])

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  // Helpers for dates
  const todayStr = new Date().toISOString().split("T")[0]
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]
  const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split("T")[0]

  // Load dashboard metrics
  useEffect(() => {
    let cancelled = false

    async function loadData() {
      setLoadingDash(true)
      setErrorDash(null)
      try {
        if (isSupabaseAvailable()) {
          // Members count
          const membersPromise = supabase!
            .from("members")
            .select("*", { count: "exact", head: true })

          // Today's attendance count
          const attendancePromise = supabase!
            .from("attendance_records")
            .select("*", { count: "exact", head: true })
            .eq("present", true)
            .eq("service_date", todayStr)

          // Monthly donations sum
          const donationsPromise = supabase!
            .from("donations")
            .select("amount, donation_date")
            .gte("donation_date", monthStart)
            .lte("donation_date", monthEnd)

          // Active events count and upcoming list
          const eventsCountPromise = supabase!
            .from("events")
            .select("*", { count: "exact", head: true })
            .gte("event_date", todayStr)

          const upcomingPromise = supabase!
            .from("events")
            .select("*")
            .gte("event_date", todayStr)
            .order("event_date", { ascending: true })
            .limit(3)

          // Recent items (members, donations, events)
          const recentMembersPromise = supabase!
            .from("members")
            .select("name, created_at")
            .order("created_at", { ascending: false })
            .limit(5)
          const recentDonationsPromise = supabase!
            .from("donations")
            .select("donor_name, amount, created_at")
            .order("created_at", { ascending: false })
            .limit(5)
          const recentEventsPromise = supabase!
            .from("events")
            .select("title, event_date, created_at")
            .order("created_at", { ascending: false })
            .limit(5)

          // Birthdays (requires members.date_of_birth column)
          const birthdaysPromise = supabase!
            .from("members")
            .select("name, date_of_birth")

          const [membersRes, attRes, donsRes, eventsCountRes, upcomingRes, rMembers, rDonations, rEvents, bdaysRes] =
            await Promise.all([
              membersPromise,
              attendancePromise,
              donationsPromise,
              eventsCountPromise,
              upcomingPromise,
              recentMembersPromise,
              recentDonationsPromise,
              recentEventsPromise,
              birthdaysPromise,
            ])

          if (membersRes.error) throw membersRes.error
          if (attRes.error) throw attRes.error
          if (donsRes.error) throw donsRes.error
          if (eventsCountRes.error) throw eventsCountRes.error
          if (upcomingRes.error) throw upcomingRes.error
          if (rMembers.error) throw rMembers.error
          if (rDonations.error) throw rDonations.error
          if (rEvents.error) throw rEvents.error
          // birthdays: if column missing, Supabase returns an error; swallow and fallback to empty
          type BirthdayRow = { name: string; date_of_birth: string | null }
          type BirthdayEntry = { name: string; date_of_birth: string; nextDate: string; daysUntil: number }
          const birthdayRows: BirthdayRow[] = bdaysRes.error ? [] : ((bdaysRes.data as BirthdayRow[] | null) ?? [])

          // Compute next birthdays within 30 days
          const computeNext = (dobStr: string) => {
            const dob = new Date(dobStr)
            if (isNaN(dob.getTime())) return null
            const now = new Date()
            const next = new Date(now.getFullYear(), dob.getMonth(), dob.getDate())
            if (next < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
              next.setFullYear(now.getFullYear() + 1)
            }
            const daysUntil = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            return { next, daysUntil }
          }

          const upcomingBirthdays: BirthdayEntry[] = birthdayRows
            .filter((r): r is { name: string; date_of_birth: string } => !!r.date_of_birth)
            .map((r): BirthdayEntry | null => {
              const calc = computeNext(r.date_of_birth)
              return calc
                ? { name: r.name, date_of_birth: r.date_of_birth, nextDate: calc.next.toISOString(), daysUntil: calc.daysUntil }
                : null
            })
            .filter((x): x is BirthdayEntry => x !== null)
            .filter((b) => b.daysUntil <= 30)
            .sort((a: BirthdayEntry, b: BirthdayEntry) => a.daysUntil - b.daysUntil)
            .slice(0, 5)

          const monthlyDonations = (donsRes.data || []).reduce(
            (sum: number, row: { amount: number }) => sum + (Number(row.amount) || 0),
            0,
          )

          const mergedRecent = [
            ...((rMembers.data || []).map((m: any) => ({
              type: "Member" as const,
              title: "New member registered",
              subtitle: m.name,
              created_at: m.created_at,
              color: "bg-green-500",
            })) || []),
            ...((rDonations.data || []).map((d: any) => ({
              type: "Donation" as const,
              title: "Donation received",
              subtitle: `${d.donor_name} - $${Number(d.amount).toFixed(2)}`,
              created_at: d.created_at,
              color: "bg-blue-500",
            })) || []),
            ...((rEvents.data || []).map((e: any) => ({
              type: "Event" as const,
              title: "Event created",
              subtitle: `${e.title} (${e.event_date})`,
              created_at: e.created_at,
              color: "bg-purple-500",
            })) || []),
          ]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 5)

          if (!cancelled) {
            setStats({
              members: membersRes.count || 0,
              todaysAttendance: attRes.count || 0,
              monthlyDonations,
              activeEvents: eventsCountRes.count || 0,
            })
            setUpcoming((upcomingRes.data as Event[]) || [])
            setRecent(mergedRecent)
            setBirthdays(upcomingBirthdays)
          }
        } else {
          // Mock fallback
          const monthDonations = mockDonations.filter((d) => d.donation_date >= monthStart && d.donation_date <= monthEnd)
          const sumMonth = monthDonations.reduce((s, d) => s + (Number(d.amount) || 0), 0)
          const todaysAtt = mockAttendanceRecords.filter((r) => r.present && r.service_date === todayStr).length

          if (!cancelled) {
            setStats({
              members: mockMembers.length,
              todaysAttendance: todaysAtt,
              monthlyDonations: sumMonth,
              activeEvents: 0,
            })
            setUpcoming([])
            const mergedRecent = [
              ...mockMembers.slice(0, 3).map((m) => ({
                type: "Member" as const,
                title: "New member registered",
                subtitle: m.name,
                created_at: m.created_at,
                color: "bg-green-500",
              })),
              ...mockDonations.slice(0, 3).map((d) => ({
                type: "Donation" as const,
                title: "Donation received",
                subtitle: `${d.donor_name} - $${Number(d.amount).toFixed(2)}`,
                created_at: d.created_at,
                color: "bg-blue-500",
              })),
            ]
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .slice(0, 5)
            setRecent(mergedRecent)
            // Provide a small mock sample for birthdays
            const now = new Date()
            const mk = (name: string, offsetDays: number) => {
              const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offsetDays)
              return { name, date_of_birth: new Date(now.getFullYear() - 30, next.getMonth(), next.getDate()).toISOString(), nextDate: next.toISOString(), daysUntil: offsetDays }
            }
            setBirthdays([mk("Akosua Mensah", 3), mk("Kwame Asante", 12), mk("Ama Osei", 27)])
          }
        }
      } catch (err: any) {
        if (!cancelled) setErrorDash(err.message || "Failed to load dashboard")
      } finally {
        if (!cancelled) setLoadingDash(false)
      }
    }

    loadData()
    return () => {
      cancelled = true
    }
  }, [todayStr, monthStart, monthEnd])

  // Load saved signature on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("pastor-signature")
        setSignature(saved)
      }
    } catch {}
  }, [])

  // Show splash screen on initial load
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm />
  }

  // Main dashboard for authenticated users
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AppHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Church Management Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-1 overflow-x-auto pb-2">
              <TabsTrigger value="dashboard" className="text-[10px] sm:text-xs flex flex-col items-center justify-center h-16 sm:h-auto sm:flex-row sm:justify-start">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1 mb-0.5 sm:mb-0" />
                <span className="mt-0.5 sm:mt-0">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="members" className="text-[10px] sm:text-xs flex flex-col items-center justify-center h-16 sm:h-auto sm:flex-row sm:justify-start">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1 mb-0.5 sm:mb-0" />
                <span className="mt-0.5 sm:mt-0">Members</span>
              </TabsTrigger>
              <TabsTrigger value="attendance" className="text-[10px] sm:text-xs flex flex-col items-center justify-center h-16 sm:h-auto sm:flex-row sm:justify-start">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1 mb-0.5 sm:mb-0" />
                <span className="mt-0.5 sm:mt-0">Attendance</span>
              </TabsTrigger>
              <TabsTrigger value="photos" className="text-[10px] sm:text-xs flex flex-col items-center justify-center h-16 sm:h-auto sm:flex-row sm:justify-start">
                <Camera className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1 mb-0.5 sm:mb-0" />
                <span className="mt-0.5 sm:mt-0">Photos</span>
              </TabsTrigger>
              <TabsTrigger value="donations" className="text-[10px] sm:text-xs flex flex-col items-center justify-center h-16 sm:h-auto sm:flex-row sm:justify-start">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1 mb-0.5 sm:mb-0" />
                <span className="mt-0.5 sm:mt-0">Donations</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="text-[10px] sm:text-xs flex flex-col items-center justify-center h-16 sm:h-auto sm:flex-row sm:justify-start">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1 mb-0.5 sm:mb-0" />
                <span className="mt-0.5 sm:mt-0">Reports</span>
              </TabsTrigger>
              <TabsTrigger value="certificates" className="text-[10px] sm:text-xs flex flex-col items-center justify-center h-16 sm:h-auto sm:flex-row sm:justify-start">
                <Award className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1 mb-0.5 sm:mb-0" />
                <span className="mt-0.5 sm:mt-0">Certificates</span>
              </TabsTrigger>
              <TabsTrigger value="signatures" className="text-[10px] sm:text-xs flex flex-col items-center justify-center h-16 sm:h-auto sm:flex-row sm:justify-start">
                <PenTool className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1 mb-0.5 sm:mb-0" />
                <span className="mt-0.5 sm:mt-0">Signatures</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="text-[10px] sm:text-xs flex flex-col items-center justify-center h-16 sm:h-auto sm:flex-row sm:justify-start">
                <Bell className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1 mb-0.5 sm:mb-0" />
                <span className="mt-0.5 sm:mt-0">Events</span>
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              {errorDash && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{errorDash}</div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Quick Stats */}
                <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white/90">Total Members</CardTitle>
                    <Users className="h-4 w-4 text-white/80" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loadingDash ? "…" : stats.members.toLocaleString()}
                    </div>
                    <p className="text-xs text-white/80">All registered members</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white/90">Today's Attendance</CardTitle>
                    <Calendar className="h-4 w-4 text-white/80" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loadingDash ? "…" : stats.todaysAttendance}</div>
                    <p className="text-xs text-white/80">Present today</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white/90">Monthly Donations</CardTitle>
                    <DollarSign className="h-4 w-4 text-white/80" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loadingDash ? "…" : `$${stats.monthlyDonations.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                    </div>
                    <p className="text-xs text-white/80">This month</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white/90">Active Events</CardTitle>
                    <Bell className="h-4 w-4 text-white/80" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{loadingDash ? "…" : stats.activeEvents}</div>
                    <p className="text-xs text-white/80">Upcoming</p>
                  </CardContent>
                </Card>
                
              </div>

              {/* Recent Activity / Upcoming Events / Birthdays */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates from your church</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loadingDash && <div className="text-sm text-muted-foreground">Loading…</div>}
                    {!loadingDash && recent.length === 0 && (
                      <div className="text-sm text-muted-foreground">No recent activity.</div>
                    )}
                    {!loadingDash &&
                      recent.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-4">
                          <div className={`w-2 h-2 ${item.color} rounded-full`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.subtitle}</p>
                          </div>
                          <Badge variant="secondary">{new Date(item.created_at).toLocaleString()}</Badge>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Don't miss these important dates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loadingDash && <div className="text-sm text-muted-foreground">Loading…</div>}
                    {!loadingDash && upcoming.length === 0 && (
                      <div className="text-sm text-muted-foreground">No upcoming events.</div>
                    )}
                    {!loadingDash &&
                      upcoming.map((e) => {
                        const d = new Date(e.event_date)
                        const day = d.getDate()
                        const mon = d.toLocaleString(undefined, { month: "short" }).toUpperCase()
                        return (
                          <div key={e.id} className="flex items-center space-x-4">
                            <div className="flex flex-col items-center">
                              <div className="text-lg font-bold text-purple-600">{day}</div>
                              <div className="text-xs text-gray-500">{mon}</div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{e.title}</p>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {e.event_time || ""}
                                {e.location && (
                                  <>
                                    <MapPin className="h-3 w-3 ml-2 mr-1" />
                                    {e.location}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Other Tabs */}
            <TabsContent value="members">
              <MemberManagement />
            </TabsContent>

            <TabsContent value="attendance">
              <AttendanceTracker />
            </TabsContent>

            <TabsContent value="photos">
              <PhotoManagement />
            </TabsContent>

            <TabsContent value="donations">
              <DonationManagement />
            </TabsContent>

            <TabsContent value="reports">
              <Reports />
            </TabsContent>

            <TabsContent value="certificates">
              <CertificatesReports />
            </TabsContent>

            <TabsContent value="signatures">
              <SignatureManagement currentSignature={signature} onSignatureUpdate={setSignature} />
            </TabsContent>

            <TabsContent value="events">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EventsNotifications />
                <VisitorCheckin />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}
