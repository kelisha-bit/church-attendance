"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, Calendar, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CertificatesReports from "@/components/certificates-reports"

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedService, setSelectedService] = useState("all")

  // Mock attendance data
  const attendanceData = {
    week: {
      totalAttendance: 156,
      averageAttendance: 156,
      growthRate: 8.5,
      services: [{ name: "Sunday Service", attendance: 156, date: "2024-01-14" }],
    },
    month: {
      totalAttendance: 624,
      averageAttendance: 156,
      growthRate: 12.3,
      services: [
        { name: "Sunday Service", attendance: 156, date: "2024-01-14" },
        { name: "Sunday Service", attendance: 148, date: "2024-01-07" },
        { name: "Prayer Meeting", attendance: 89, date: "2024-01-10" },
        { name: "Bible Study", attendance: 67, date: "2024-01-12" },
        { name: "Youth Service", attendance: 164, date: "2024-01-13" },
      ],
    },
    year: {
      totalAttendance: 7488,
      averageAttendance: 144,
      growthRate: 15.7,
      services: [],
    },
  }

  const currentData = attendanceData[selectedPeriod as keyof typeof attendanceData]

  // Mock member statistics
  const memberStats = {
    totalMembers: 342,
    newMembers: 28,
    activeMembers: 298,
    visitors: 45,
    departments: [
      { name: "Choir", members: 45, attendance: 89 },
      { name: "Ushering", members: 32, attendance: 94 },
      { name: "Youth Ministry", members: 78, attendance: 85 },
      { name: "Children's Ministry", members: 56, attendance: 92 },
      { name: "Prayer Team", members: 34, attendance: 88 },
      { name: "Media Team", members: 18, attendance: 83 },
    ],
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
          <p className="text-gray-600">View attendance trends and member statistics</p>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Time Period</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Service Type</label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="sunday">Sunday Service</SelectItem>
                      <SelectItem value="prayer">Prayer Meeting</SelectItem>
                      <SelectItem value="bible-study">Bible Study</SelectItem>
                      <SelectItem value="youth">Youth Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Attendance</p>
                    <p className="text-2xl font-bold">{currentData.totalAttendance}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-200" />
                      <span className="text-xs text-green-200">+{currentData.growthRate}%</span>
                    </div>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Average Attendance</p>
                    <p className="text-2xl font-bold">{currentData.averageAttendance}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="w-3 h-3 text-green-200" />
                      <span className="text-xs text-green-200">Per service</span>
                    </div>
                  </div>
                  <Users className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">New Members</p>
                    <p className="text-2xl font-bold">{memberStats.newMembers}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3 text-purple-200" />
                      <span className="text-xs text-purple-200">This {selectedPeriod}</span>
                    </div>
                  </div>
                  <Users className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Visitors</p>
                    <p className="text-2xl font-bold">{memberStats.visitors}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-orange-200" />
                      <span className="text-xs text-orange-200">New faces</span>
                    </div>
                  </div>
                  <Users className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Services */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Services</CardTitle>
              <CardDescription>Attendance for recent church services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentData.services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 p-2 rounded-full">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{service.name}</h3>
                      <p className="text-sm text-gray-600">{new Date(service.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-800">{service.attendance}</div>
                    <div className="text-xs text-gray-500">attendees</div>
                  </div>
                </div>
              ))}

              {currentData.services.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No service data available for this period</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Department Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Department Statistics</CardTitle>
              <CardDescription>Member count and attendance by department</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {memberStats.departments.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-full">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{dept.name}</h3>
                      <p className="text-sm text-gray-600">{dept.members} members</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">{dept.attendance}% attendance</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Export Reports</CardTitle>
              <CardDescription>Download reports for external use</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Download Attendance Report (PDF)
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export Member List (Excel)
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export Visitor Data (CSV)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          {/* Add detailed reports content here */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Reports</CardTitle>
              <CardDescription>Generate comprehensive attendance reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Generate Monthly Report
              </Button>
              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <Download className="w-4 h-4 mr-2" />
                Generate Annual Report
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <CertificatesReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}
