"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, Calendar, Bell, BarChart3, Church, Heart, Camera } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MemberManagement from "@/components/member-management"
import VisitorCheckin from "@/components/visitor-checkin"
import AttendanceTracker from "@/components/attendance-tracker"
import EventsNotifications from "@/components/events-notifications"
import Reports from "@/components/reports"
import MemberPhotoGallery from "@/components/member-photo-gallery"

export default function ChurchApp() {
  const [activeTab, setActiveTab] = useState("dashboard")

  // Mock data for dashboard
  const todayAttendance = 156
  const totalMembers = 342
  const newVisitors = 8
  const upcomingEvents = 3

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2 rounded-full">
            <Church className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">GreaterWorks City Church</h1>
            <p className="text-amber-100 text-sm">Attendance & Community Management</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Heart className="w-4 h-4 text-red-200" />
          <span className="text-amber-100">Building God's Kingdom Together</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="dashboard" className="p-4 space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Today's Attendance</p>
                    <p className="text-2xl font-bold">{todayAttendance}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total Members</p>
                    <p className="text-2xl font-bold">{totalMembers}</p>
                  </div>
                  <Heart className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">New Visitors</p>
                    <p className="text-2xl font-bold">{newVisitors}</p>
                  </div>
                  <UserPlus className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Upcoming Events</p>
                    <p className="text-2xl font-bold">{upcomingEvents}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Quick Actions</CardTitle>
              <CardDescription>Common tasks for church leaders</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setActiveTab("attendance")}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 h-16 flex-col gap-2"
              >
                <Users className="w-5 h-5" />
                <span className="text-sm">Mark Attendance</span>
              </Button>

              <Button
                onClick={() => setActiveTab("visitors")}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 h-16 flex-col gap-2"
              >
                <UserPlus className="w-5 h-5" />
                <span className="text-sm">Register Visitor</span>
              </Button>

              <Button
                onClick={() => setActiveTab("events")}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 h-16 flex-col gap-2"
              >
                <Bell className="w-5 h-5" />
                <span className="text-sm">Send Notification</span>
              </Button>

              <Button
                onClick={() => setActiveTab("reports")}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 h-16 flex-col gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="text-sm">View Reports</span>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="bg-blue-500 p-2 rounded-full">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Sunday Service Attendance</p>
                  <p className="text-sm text-gray-600">156 members attended • 2 hours ago</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="bg-green-500 p-2 rounded-full">
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">New Visitor Registration</p>
                  <p className="text-sm text-gray-600">Kwame Asante joined • 3 hours ago</p>
                </div>
                <Badge className="bg-green-100 text-green-800">New</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="bg-purple-500 p-2 rounded-full">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">Prayer Meeting Reminder</p>
                  <p className="text-sm text-gray-600">Sent to 298 members • 1 day ago</p>
                </div>
                <Badge className="bg-purple-100 text-purple-800">Sent</Badge>
              </div>
            </CardContent>
          </Card>
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

        <TabsContent value="photos">
          <MemberPhotoGallery />
        </TabsContent>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <TabsList className="grid w-full grid-cols-7 bg-transparent h-16">
            <TabsTrigger
              value="dashboard"
              className="flex-col gap-1 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-xs">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="flex-col gap-1 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700"
            >
              <Users className="w-4 h-4" />
              <span className="text-xs">Members</span>
            </TabsTrigger>
            <TabsTrigger
              value="visitors"
              className="flex-col gap-1 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700"
            >
              <UserPlus className="w-4 h-4" />
              <span className="text-xs">Visitors</span>
            </TabsTrigger>
            <TabsTrigger
              value="attendance"
              className="flex-col gap-1 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700"
            >
              <Heart className="w-4 h-4" />
              <span className="text-xs">Attendance</span>
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="flex-col gap-1 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700"
            >
              <Bell className="w-4 h-4" />
              <span className="text-xs">Events</span>
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="flex-col gap-1 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-xs">Reports</span>
            </TabsTrigger>
            <TabsTrigger
              value="photos"
              className="flex-col gap-1 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700"
            >
              <Camera className="w-4 h-4" />
              <span className="text-xs">Photos</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  )
}
