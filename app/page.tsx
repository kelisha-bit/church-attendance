"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, UserCheck, Calendar, DollarSign, Camera, FileText, Bell, TrendingUp, Clock, MapPin } from "lucide-react"

import MemberManagement from "@/components/member-management"
import AttendanceTracker from "@/components/attendance-tracker"
import VisitorCheckin from "@/components/visitor-checkin"
import EventsNotifications from "@/components/events-notifications"
import PhotoManagement from "@/components/photo-management"
import Reports from "@/components/reports"
import DonationManagement from "@/components/donation-management"
import ProtectedRoute from "@/components/protected-route"
import AppHeader from "@/components/app-header"
import { useAuth } from "@/contexts/auth-context"

export default function ChurchAttendanceApp() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")

  // Mock data for dashboard
  const stats = {
    totalMembers: 245,
    presentToday: 189,
    visitors: 12,
    totalDonations: 15420.5,
    upcomingEvents: 3,
    photosUploaded: 156,
  }

  const recentActivity = [
    { type: "member", message: "New member Akosua Mensah joined", time: "2 hours ago" },
    { type: "attendance", message: "189 members checked in for Sunday Service", time: "3 hours ago" },
    { type: "donation", message: "GHS 500 donation received from Kwame Asante", time: "5 hours ago" },
    { type: "event", message: "Youth Meeting scheduled for Friday", time: "1 day ago" },
  ]

  const upcomingEvents = [
    { title: "Youth Meeting", date: "2024-01-19", time: "18:00", location: "Youth Hall" },
    { title: "Prayer Meeting", date: "2024-01-21", time: "06:00", location: "Main Sanctuary" },
    { title: "Bible Study", date: "2024-01-24", time: "19:00", location: "Conference Room" },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AppHeader />

        <div className="container mx-auto p-4 space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || "User"}! 👋</h1>
            <p className="text-blue-100">Here's what's happening in your church community today.</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto p-1">
              <TabsTrigger value="dashboard" className="flex flex-col items-center gap-1 p-3">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="members" className="flex flex-col items-center gap-1 p-3">
                <Users className="h-4 w-4" />
                <span className="text-xs">Members</span>
              </TabsTrigger>
              <TabsTrigger value="attendance" className="flex flex-col items-center gap-1 p-3">
                <UserCheck className="h-4 w-4" />
                <span className="text-xs">Attendance</span>
              </TabsTrigger>
              <TabsTrigger value="visitors" className="flex flex-col items-center gap-1 p-3">
                <Users className="h-4 w-4" />
                <span className="text-xs">Visitors</span>
              </TabsTrigger>
              <TabsTrigger value="donations" className="flex flex-col items-center gap-1 p-3">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs">Donations</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex flex-col items-center gap-1 p-3">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Events</span>
              </TabsTrigger>
              <TabsTrigger value="photos" className="flex flex-col items-center gap-1 p-3">
                <Camera className="h-4 w-4" />
                <span className="text-xs">Photos</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex flex-col items-center gap-1 p-3">
                <FileText className="h-4 w-4" />
                <span className="text-xs">Reports</span>
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalMembers}</div>
                    <p className="text-xs text-muted-foreground">+12 from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.presentToday}</div>
                    <p className="text-xs text-muted-foreground">77% attendance rate</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Visitors Today</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.visitors}</div>
                    <p className="text-xs text-muted-foreground">8 first-time visitors</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">GHS {stats.totalDonations.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+15% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
                    <p className="text-xs text-muted-foreground">This week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Photos Uploaded</CardTitle>
                    <Camera className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.photosUploaded}</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Latest updates from your church community</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {activity.type === "member" && <Users className="h-4 w-4 text-blue-500" />}
                          {activity.type === "attendance" && <UserCheck className="h-4 w-4 text-green-500" />}
                          {activity.type === "donation" && <DollarSign className="h-4 w-4 text-yellow-500" />}
                          {activity.type === "event" && <Calendar className="h-4 w-4 text-purple-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Events
                    </CardTitle>
                    <CardDescription>Don't miss these important gatherings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingEvents.map((event, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <Badge variant="outline">{event.date}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks you might want to perform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto flex-col gap-2 p-4 bg-transparent"
                      onClick={() => setActiveTab("members")}
                    >
                      <Users className="h-6 w-6" />
                      Add Member
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex-col gap-2 p-4 bg-transparent"
                      onClick={() => setActiveTab("attendance")}
                    >
                      <UserCheck className="h-6 w-6" />
                      Take Attendance
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex-col gap-2 p-4 bg-transparent"
                      onClick={() => setActiveTab("donations")}
                    >
                      <DollarSign className="h-6 w-6" />
                      Record Donation
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex-col gap-2 p-4 bg-transparent"
                      onClick={() => setActiveTab("events")}
                    >
                      <Calendar className="h-6 w-6" />
                      Create Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other Tabs */}
            <TabsContent value="members">
              <MemberManagement />
            </TabsContent>

            <TabsContent value="attendance">
              <AttendanceTracker />
            </TabsContent>

            <TabsContent value="visitors">
              <VisitorCheckin />
            </TabsContent>

            <TabsContent value="donations">
              <DonationManagement />
            </TabsContent>

            <TabsContent value="events">
              <EventsNotifications />
            </TabsContent>

            <TabsContent value="photos">
              <PhotoManagement />
            </TabsContent>

            <TabsContent value="reports">
              <Reports />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
