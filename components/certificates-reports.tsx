"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Award, Download, Printer, Users, Church, Star, FileText, BarChart3, TrendingUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SignatureManagement from "@/components/signature-management"

export default function CertificatesReports() {
  const [selectedMember, setSelectedMember] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [showCertificatePreview, setShowCertificatePreview] = useState(false)
  const [certificateData, setCertificateData] = useState<any>(null)
  const printRef = useRef<HTMLDivElement>(null)
  const [currentSignature, setCurrentSignature] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("pastor-signature") : null,
  )

  // Mock member data with attendance records
  const members = [
    {
      id: 1,
      name: "Akosua Mensah",
      department: "Choir",
      attendanceRate: 95,
      totalServices: 20,
      servicesAttended: 19,
      perfectAttendance: false,
      joinDate: "2022-03-15",
    },
    {
      id: 2,
      name: "Kwame Asante",
      department: "Ushering",
      attendanceRate: 100,
      totalServices: 16,
      servicesAttended: 16,
      perfectAttendance: true,
      joinDate: "2023-01-20",
    },
    {
      id: 3,
      name: "Ama Osei",
      department: "Children's Ministry",
      attendanceRate: 88,
      totalServices: 18,
      servicesAttended: 16,
      perfectAttendance: false,
      joinDate: "2021-11-08",
    },
  ]

  // Mock report data
  const reportData = {
    month: {
      totalServices: 8,
      totalAttendance: 1248,
      averageAttendance: 156,
      highestAttendance: 178,
      lowestAttendance: 134,
      growthRate: 12.3,
      perfectAttendanceMembers: 45,
    },
    quarter: {
      totalServices: 24,
      totalAttendance: 3744,
      averageAttendance: 156,
      highestAttendance: 189,
      lowestAttendance: 123,
      growthRate: 15.7,
      perfectAttendanceMembers: 32,
    },
    year: {
      totalServices: 96,
      totalAttendance: 14976,
      averageAttendance: 156,
      highestAttendance: 198,
      lowestAttendance: 98,
      growthRate: 18.2,
      perfectAttendanceMembers: 28,
    },
  }

  const generateCertificate = (memberId: string) => {
    const member = members.find((m) => m.id.toString() === memberId)
    if (member) {
      setCertificateData({
        ...member,
        period: selectedPeriod,
        issueDate: new Date().toLocaleDateString(),
        reportData: reportData[selectedPeriod as keyof typeof reportData],
      })
      setShowCertificatePreview(true)
    }
  }

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML
      const originalContent = document.body.innerHTML
      document.body.innerHTML = printContent
      window.print()
      document.body.innerHTML = originalContent
      window.location.reload()
    }
  }

  const downloadPDF = () => {
    // In a real app, you would use a library like jsPDF or Puppeteer
    alert("PDF download functionality would be implemented here using libraries like jsPDF")
  }

  const generateReport = (type: string) => {
    // Mock report generation
    const reportContent = generateReportContent(type)
    const blob = new Blob([reportContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${type}-report-${new Date().toISOString().split("T")[0]}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const generateReportContent = (type: string) => {
    const data = reportData[selectedPeriod as keyof typeof reportData]
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>GreaterWorks City Church - ${type} Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { color: #d97706; font-size: 24px; font-weight: bold; }
            .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
            .stat-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
            .stat-value { font-size: 32px; font-weight: bold; color: #1f2937; }
            .stat-label { color: #6b7280; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f9fafb; }
            .footer { margin-top: 40px; text-align: center; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">⛪ GreaterWorks City Church</div>
            <h1>${type.charAt(0).toUpperCase() + type.slice(1)} Attendance Report</h1>
            <p>Period: ${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} | Generated: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="stats">
            <div class="stat-card">
              <div class="stat-value">${data.totalServices}</div>
              <div class="stat-label">Total Services</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${data.totalAttendance}</div>
              <div class="stat-label">Total Attendance</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${data.averageAttendance}</div>
              <div class="stat-label">Average Attendance</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${data.growthRate}%</div>
              <div class="stat-label">Growth Rate</div>
            </div>
          </div>

          <h2>Member Statistics</h2>
          <table>
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Department</th>
                <th>Attendance Rate</th>
                <th>Services Attended</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${members
                .map(
                  (member) => `
                <tr>
                  <td>${member.name}</td>
                  <td>${member.department}</td>
                  <td>${member.attendanceRate}%</td>
                  <td>${member.servicesAttended}/${member.totalServices}</td>
                  <td>${member.perfectAttendance ? "Perfect Attendance" : "Regular"}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>Generated by GreaterWorks City Church Attendance System</p>
            <p>Building God's Kingdom Together</p>
          </div>
        </body>
      </html>
    `
  }

  return (
    <div className="space-y-4">
      {/* Certificate Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            Attendance Certificates
          </CardTitle>
          <CardDescription>Generate certificates for members with good attendance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Generate Certificate</TabsTrigger>
              <TabsTrigger value="signature">Manage Signature</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="member">Select Member</Label>
                  <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id.toString()}>
                          {member.name} - {member.attendanceRate}% attendance
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="period">Certificate Period</Label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Monthly</SelectItem>
                      <SelectItem value="quarter">Quarterly</SelectItem>
                      <SelectItem value="year">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={() => generateCertificate(selectedMember)}
                disabled={!selectedMember}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              >
                <Award className="w-4 h-4 mr-2" />
                Generate Certificate
              </Button>
            </TabsContent>

            <TabsContent value="signature">
              <SignatureManagement currentSignature={currentSignature} onSignatureUpdate={setCurrentSignature} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Outstanding Members */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Outstanding Attendance
          </CardTitle>
          <CardDescription>Members eligible for recognition certificates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {members
            .filter((member) => member.attendanceRate >= 90)
            .map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-800">{member.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800 text-xs">{member.department}</Badge>
                      {member.perfectAttendance && (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">Perfect</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-amber-600">{member.attendanceRate}%</div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedMember(member.id.toString())
                      generateCertificate(member.id.toString())
                    }}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-xs"
                  >
                    <Award className="w-3 h-3 mr-1" />
                    Certificate
                  </Button>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Printable Reports
          </CardTitle>
          <CardDescription>Generate comprehensive attendance reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="reportPeriod">Report Period</Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Monthly Report</SelectItem>
                <SelectItem value="quarter">Quarterly Report</SelectItem>
                <SelectItem value="year">Annual Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="department">Department Filter</Label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="choir">Choir</SelectItem>
                <SelectItem value="ushering">Ushering</SelectItem>
                <SelectItem value="youth">Youth Ministry</SelectItem>
                <SelectItem value="children">Children's Ministry</SelectItem>
                <SelectItem value="prayer">Prayer Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={() => generateReport("attendance")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Attendance Report
            </Button>

            <Button
              onClick={() => generateReport("member")}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <Users className="w-4 h-4 mr-2" />
              Generate Member Report
            </Button>

            <Button
              onClick={() => generateReport("growth")}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Generate Growth Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats for Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Report Summary</CardTitle>
          <CardDescription>Current period statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {reportData[selectedPeriod as keyof typeof reportData].totalServices}
              </div>
              <div className="text-sm text-gray-600">Total Services</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {reportData[selectedPeriod as keyof typeof reportData].averageAttendance}
              </div>
              <div className="text-sm text-gray-600">Avg Attendance</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {reportData[selectedPeriod as keyof typeof reportData].perfectAttendanceMembers}
              </div>
              <div className="text-sm text-gray-600">Perfect Attendance</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {reportData[selectedPeriod as keyof typeof reportData].growthRate}%
              </div>
              <div className="text-sm text-gray-600">Growth Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificate Preview Dialog */}
      <Dialog open={showCertificatePreview} onOpenChange={setShowCertificatePreview}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Attendance Certificate Preview</DialogTitle>
            <DialogDescription>Preview and print the attendance certificate</DialogDescription>
          </DialogHeader>

          {certificateData && (
            <div className="space-y-4">
              {/* Certificate Preview */}
              <div
                ref={printRef}
                className="bg-white p-8 border-2 border-amber-200 rounded-lg"
                style={{
                  background: "linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)",
                  fontFamily: "serif",
                }}
              >
                <div className="text-center space-y-6">
                  {/* Header */}
                  <div className="border-b-2 border-amber-600 pb-4">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Church className="w-8 h-8 text-amber-700" />
                      <h1 className="text-2xl font-bold text-amber-800">GreaterWorks City Church</h1>
                    </div>
                    <p className="text-amber-700 text-sm">Accra, Ghana</p>
                    <p className="text-amber-600 text-xs italic">Building God's Kingdom Together</p>
                  </div>

                  {/* Certificate Title */}
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-amber-800">Certificate of Attendance</h2>
                    <div className="flex items-center justify-center gap-2">
                      <Award className="w-6 h-6 text-amber-600" />
                      <span className="text-lg text-amber-700">Excellence in Worship</span>
                      <Award className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="space-y-4 py-6">
                    <p className="text-lg text-gray-700">This is to certify that</p>

                    <div className="border-b-2 border-amber-600 pb-2 mb-4">
                      <h3 className="text-3xl font-bold text-amber-800">{certificateData.name}</h3>
                    </div>

                    <p className="text-lg text-gray-700 leading-relaxed">
                      has demonstrated exceptional commitment to worship and fellowship by maintaining an outstanding
                      attendance record of
                    </p>

                    <div className="bg-white/50 rounded-lg p-4 border border-amber-300">
                      <div className="text-4xl font-bold text-amber-700 mb-2">{certificateData.attendanceRate}%</div>
                      <p className="text-gray-700">
                        Attending {certificateData.servicesAttended} out of {certificateData.totalServices} services
                      </p>
                      {certificateData.perfectAttendance && (
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <span className="text-amber-700 font-semibold">Perfect Attendance</span>
                          <Star className="w-5 h-5 text-yellow-500" />
                        </div>
                      )}
                    </div>

                    <p className="text-lg text-gray-700">
                      during the {certificateData.period} period as a faithful member of the{" "}
                      <span className="font-semibold text-amber-700">{certificateData.department}</span> department.
                    </p>

                    <div className="pt-4">
                      <p className="text-gray-600 italic">
                        "Let us not neglect our meeting together, as some people do, but encourage one another"
                      </p>
                      <p className="text-sm text-gray-500">- Hebrews 10:25</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t-2 border-amber-600 pt-6 grid grid-cols-2 gap-8">
                    <div>
                      <div className="border-b border-gray-400 mb-2 pb-1 h-16 flex items-end justify-center">
                        {currentSignature ? (
                          <img
                            src={currentSignature || "/placeholder.svg"}
                            alt="Pastor's Signature"
                            className="max-h-12 max-w-32 object-contain"
                          />
                        ) : (
                          <div className="h-8 w-32 border-b border-gray-400"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Pastor's Signature</p>
                    </div>
                    <div>
                      <div className="border-b border-gray-400 mb-2 pb-1">
                        <p className="text-sm font-semibold">{certificateData.issueDate}</p>
                      </div>
                      <p className="text-sm text-gray-600">Date Issued</p>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="flex justify-between items-center pt-4">
                    <div className="w-16 h-16 border-2 border-amber-400 rounded-full flex items-center justify-center">
                      <Church className="w-8 h-8 text-amber-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        Certificate ID: GWCC-{certificateData.id}-{new Date().getFullYear()}
                      </p>
                    </div>
                    <div className="w-16 h-16 border-2 border-amber-400 rounded-full flex items-center justify-center">
                      <Award className="w-8 h-8 text-amber-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handlePrint}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Certificate
                </Button>
                <Button
                  onClick={downloadPDF}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
