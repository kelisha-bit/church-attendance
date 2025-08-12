"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, UserPlus, Calendar, TrendingUp, Clock, AlertCircle, Loader2 } from "lucide-react"
import MemberManagement from "@/components/member-management"
import VisitorCheckin from "@/components/visitor-checkin"
import AttendanceTracker from "@/components/attendance-tracker"
import EventsNotifications from "@/components/events-notifications"
import Reports from "@/components/reports"
import CertificatesReports from "@/components/certificates-reports"
import SignatureManagement from "@/components/signature-management"
import PhotoManagement from "@/components/photo-management"
import { supabase, isSupabaseAvailable, mockMembers, mockVisitors } from "@/lib/supabase"
import DonationManagement from "@/components/donation-management"

export default function ChurchAttendanceApp() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [stats, setStats] = useState({
    totalMembers: 0,
    todayAttendance: 0,
    todayVisitors: 0,
    upcomingEvents: 0,
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      setLoading(true)

      if (!isSupabaseAvailable()) {
        // Use mock data when Supabase is not available
        setStats({
          totalMembers: mockMembers.length,
          todayAttendance: Math.floor(mockMembers.length * 0.75), // 75% attendance
          todayVisitors: mockVisitors.length,
          upcomingEvents: 4,
        })

        setRecentActivity([
          {
            id: 1,
            type: "visitor",
            name: "Sarah Johnson",
            action: "checked in",
            time: "2 hours ago",
            service: "Sunday Service",
          },
          {
            id: 2,
            type: "member",
            name: "Akosua Mensah",
            action: "marked present",
            time: "3 hours ago",
            service: "Sunday Service",
          },
          {
            id: 3,
            type: "event",
            name: "Prayer Meeting",
            action: "scheduled",
            time: "1 day ago",
            service: "Prayer Meeting",
          },
        ])
        return
      }

      // Fetch real data from Supabase
      const today = new Date().toISOString().split("T")[0]

      const [membersResult, visitorsResult, attendanceResult, eventsResult] = await Promise.all([
        supabase!.from("members").select("id").eq("status", "Active"),
        supabase!.from("visitors").select("id").eq("visit_date", today),
        supabase!.from("attendance_records").select("id").eq("service_date", today).eq("present", true),
        supabase!.from("events").select("id").gte("event_date", today),
      ])

      setStats({
        totalMembers: membersResult.data?.length || 0,
        todayAttendance: attendanceResult.data?.length || 0,
        todayVisitors: visitorsResult.data?.length || 0,
        upcomingEvents: eventsResult.data?.length || 0,
      })

      // Fetch recent activity
      const { data: recentVisitors } = await supabase!
        .from("visitors")
        .select("name, service, created_at")
        .order("created_at", { ascending: false })
        .limit(5)

      const activity = (recentVisitors || []).map((visitor, index) => ({
        id: index + 1,
        type: "visitor",
        name: visitor.name,
        action: "checked in",
        time: new Date(visitor.created_at).toLocaleString(),
        service: visitor.service,
      }))

      setRecentActivity(activity)
    } catch (error) {
      console.error("Error fetching stats:", error)
      // Fallback to mock data on error
      setStats({
        totalMembers: mockMembers.length,
        todayAttendance: Math.floor(mockMembers.length * 0.75),
        todayVisitors: mockVisitors.length,
        upcomingEvents: 4,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const StatCard = ({ title, value, icon: Icon, description, trend }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-amber-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-800">
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : value}
        </div>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-xs text-green-500">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">GreaterWorks City Church</h1>
          <p className="text-gray-600 text-lg">Attendance & Community Management System</p>
          <p className="text-sm text-gray-500 mt-2">Accra, Ghana</p>
        </div>

        {/* Demo Mode Alert */}
        {!isSupabaseAvailable() && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Demo mode: Add your Supabase environment variables to enable full database functionality.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-10 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="text-xs">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="members" className="text-xs">
              Members
            </TabsTrigger>
            <TabsTrigger value="visitors" className="text-xs">
              Visitors
            </TabsTrigger>
            <TabsTrigger value="attendance" className="text-xs">
              Attendance
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs">
              Events
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-xs">
              Reports
            </TabsTrigger>
            <TabsTrigger value="certificates" className="text-xs">
              Certificates
            </TabsTrigger>
            <TabsTrigger value="signatures" className="text-xs">
              Signatures
            </TabsTrigger>
            <TabsTrigger value="photos" className="text-xs">
              Photos
            </TabsTrigger>
            <TabsTrigger value="donations" className="text-xs">
              Donations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Members"
                value={stats.totalMembers}
                icon={Users}
                description="Active church members"
                trend="+12% from last month"
              />
              <StatCard
                title="Today's Attendance"
                value={stats.todayAttendance}
                icon={Calendar}
                description="Present in today's service"
                trend="+5% from last week"
              />
              <StatCard
                title="Today's Visitors"
                value={stats.todayVisitors}
                icon={UserPlus}
                description="New visitors today"
                trend="+2 from yesterday"
              />
              <StatCard
                title="Upcoming Events"
                value={stats.upcomingEvents}
                icon={Clock}
                description="Scheduled this month"
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                  <CardDescription>Latest updates from your church community</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          <span className="font-semibold">{activity.name}</span> {activity.action}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {activity.service}
                          </Badge>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {recentActivity.length === 0 && <p className="text-center text-gray-500 py-4">No recent activity</p>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => setActiveTab("visitors")}
                    className="w-full justify-start bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Check-in New Visitor
                  </Button>
                  <Button
                    onClick={() => setActiveTab("attendance")}
                    className="w-full justify-start bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Mark Attendance
                  </Button>
                  <Button
                    onClick={() => setActiveTab("members")}
                    className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage Members
                  </Button>
                  <Button
                    onClick={() => setActiveTab("reports")}
                    className="w-full justify-start bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <MemberManagement />
          </TabsContent>

          <TabsContent value="visitors">
            <VisitorCheckin />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceTracker />
          </TabsContent>

          <TabsContent value="events">
            <EventsNotifications />
          </TabsContent>

          <TabsContent value="reports">
            <Reports />
          </TabsContent>

          <TabsContent value="certificates">
            <CertificatesReports />
          </TabsContent>

          <TabsContent value="signatures">
            <SignatureManagement />
          </TabsContent>

          <TabsContent value="photos">
            <PhotoManagement />
          </TabsContent>

          <TabsContent value="donations">
            <DonationManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
