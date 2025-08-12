"use client"

import { useState } from "react"
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

export default function Home() {
  const { user, loading } = useAuth()
  const [showSplash, setShowSplash] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

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
            <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9 gap-1">
              <TabsTrigger value="dashboard" className="text-xs">
                <TrendingUp className="h-4 w-4 mr-1" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="members" className="text-xs">
                <Users className="h-4 w-4 mr-1" />
                Members
              </TabsTrigger>
              <TabsTrigger value="attendance" className="text-xs">
                <Calendar className="h-4 w-4 mr-1" />
                Attendance
              </TabsTrigger>
              <TabsTrigger value="photos" className="text-xs">
                <Camera className="h-4 w-4 mr-1" />
                Photos
              </TabsTrigger>
              <TabsTrigger value="donations" className="text-xs">
                <DollarSign className="h-4 w-4 mr-1" />
                Donations
              </TabsTrigger>
              <TabsTrigger value="reports" className="text-xs">
                <FileText className="h-4 w-4 mr-1" />
                Reports
              </TabsTrigger>
              <TabsTrigger value="certificates" className="text-xs">
                <Award className="h-4 w-4 mr-1" />
                Certificates
              </TabsTrigger>
              <TabsTrigger value="signatures" className="text-xs">
                <PenTool className="h-4 w-4 mr-1" />
                Signatures
              </TabsTrigger>
              <TabsTrigger value="events" className="text-xs">
                <Bell className="h-4 w-4 mr-1" />
                Events
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">456</div>
                    <p className="text-xs text-muted-foreground">87% attendance rate</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Donations</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$12,345</div>
                    <p className="text-xs text-muted-foreground">+8% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Events</CardTitle>
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">3 this week</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates from your church</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New member registered</p>
                        <p className="text-xs text-gray-500">Sarah Johnson joined the church</p>
                      </div>
                      <Badge variant="secondary">2 min ago</Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Donation received</p>
                        <p className="text-xs text-gray-500">$500 from John Smith</p>
                      </div>
                      <Badge variant="secondary">15 min ago</Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Event created</p>
                        <p className="text-xs text-gray-500">Youth Bible Study scheduled</p>
                      </div>
                      <Badge variant="secondary">1 hour ago</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Don't miss these important dates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="text-lg font-bold text-purple-600">15</div>
                        <div className="text-xs text-gray-500">DEC</div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Christmas Service</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          10:00 AM
                          <MapPin className="h-3 w-3 ml-2 mr-1" />
                          Main Sanctuary
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="text-lg font-bold text-blue-600">18</div>
                        <div className="text-xs text-gray-500">DEC</div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Youth Meeting</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          7:00 PM
                          <MapPin className="h-3 w-3 ml-2 mr-1" />
                          Youth Hall
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="text-lg font-bold text-green-600">22</div>
                        <div className="text-xs text-gray-500">DEC</div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Community Outreach</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          9:00 AM
                          <MapPin className="h-3 w-3 ml-2 mr-1" />
                          Community Center
                        </div>
                      </div>
                    </div>
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
              <SignatureManagement />
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
