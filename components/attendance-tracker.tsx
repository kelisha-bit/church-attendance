"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, Search, Clock, CheckCircle, XCircle, Save, AlertCircle, Loader2, TrendingUp } from "lucide-react"
import { supabase, isSupabaseAvailable, mockMembers, mockAttendanceRecords, type Member } from "@/lib/supabase"
import { toast } from "sonner"

interface AttendanceTrackerProps {
  onStatsUpdate?: () => void
}

export default function AttendanceTracker({ onStatsUpdate }: AttendanceTrackerProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [attendance, setAttendance] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedService, setSelectedService] = useState("Sunday Service")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [showBulkDialog, setShowBulkDialog] = useState(false)

  const services = [
    "Sunday Service",
    "Prayer Meeting",
    "Bible Study",
    "Youth Service",
    "Children's Service",
    "Special Event",
  ]

  // Load members and existing attendance
  const loadData = async () => {
    try {
      setLoading(true)

      if (!isSupabaseAvailable()) {
        // Use mock data
        setMembers(mockMembers)

        // Set mock attendance
        const mockAttendanceMap: Record<string, boolean> = {}
        mockAttendanceRecords.forEach((record) => {
          if (record.service_date === selectedDate && record.service_type === selectedService) {
            mockAttendanceMap[record.member_id] = record.present
          }
        })
        setAttendance(mockAttendanceMap)
        return
      }

      // Load members from Supabase
      const { data: membersData, error: membersError } = await supabase!
        .from("members")
        .select("*")
        .eq("status", "Active")
        .order("name")

      if (membersError) throw membersError

      // Load existing attendance for selected date and service
      const { data: attendanceData, error: attendanceError } = await supabase!
        .from("attendance_records")
        .select("*")
        .eq("service_date", selectedDate)
        .eq("service_type", selectedService)

      if (attendanceError) throw attendanceError

      setMembers(membersData || [])

      // Convert attendance data to map
      const attendanceMap: Record<string, boolean> = {}
      attendanceData?.forEach((record) => {
        attendanceMap[record.member_id] = record.present
      })
      setAttendance(attendanceMap)
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Failed to load attendance data")
      // Fallback to mock data
      setMembers(mockMembers)
      setAttendance({})
    } finally {
      setLoading(false)
    }
  }

  // Toggle attendance for a member
  const toggleAttendance = (memberId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }))
  }

  // Save attendance to database
  const saveAttendance = async () => {
    try {
      setSaving(true)

      if (!isSupabaseAvailable()) {
        toast.success("Attendance saved successfully! (Demo mode)")
        onStatsUpdate?.()
        return
      }

      // Delete existing attendance records for this date/service
      await supabase!
        .from("attendance_records")
        .delete()
        .eq("service_date", selectedDate)
        .eq("service_type", selectedService)

      // Insert new attendance records
      const attendanceRecords = Object.entries(attendance).map(([memberId, present]) => ({
        member_id: memberId,
        service_date: selectedDate,
        service_type: selectedService,
        present,
        check_in_time: present ? new Date().toTimeString().split(" ")[0] : null,
      }))

      if (attendanceRecords.length > 0) {
        const { error } = await supabase!.from("attendance_records").insert(attendanceRecords)

        if (error) throw error
      }

      toast.success("Attendance saved successfully!")
      onStatsUpdate?.()
    } catch (error) {
      console.error("Error saving attendance:", error)
      toast.error("Failed to save attendance")
    } finally {
      setSaving(false)
    }
  }

  // Mark all present/absent
  const markAllAttendance = (present: boolean) => {
    const newAttendance: Record<string, boolean> = {}
    filteredMembers.forEach((member) => {
      newAttendance[member.id] = present
    })
    setAttendance((prev) => ({ ...prev, ...newAttendance }))
  }

  useEffect(() => {
    loadData()
  }, [selectedDate, selectedService])

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const presentCount = Object.values(attendance).filter(Boolean).length
  const totalCount = filteredMembers.length
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Attendance Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600 mx-auto" />
              <p className="mt-2 text-gray-600">Loading attendance data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Demo Mode Alert */}
      {!isSupabaseAvailable() && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Demo mode: Add your Supabase environment variables to enable database functionality.
          </AlertDescription>
        </Alert>
      )}

      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Attendance Tracker
              </CardTitle>
              <CardDescription>Mark attendance for church services and events</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-lg px-3 py-1">
                {presentCount}/{totalCount} Present ({attendanceRate}%)
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Service Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="service">Service/Event</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 bg-white hover:bg-gray-50">
                    Bulk Actions
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white border-2 border-gray-200 shadow-2xl">
                  <div className="bg-white p-2 rounded-lg">
                    <DialogHeader className="bg-white">
                      <DialogTitle className="text-gray-900">Bulk Attendance Actions</DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Apply attendance to all filtered members
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 bg-white p-4 rounded-lg">
                      <Button
                        onClick={() => {
                          markAllAttendance(true)
                          setShowBulkDialog(false)
                          toast.success("Marked all members as present")
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark All Present
                      </Button>
                      <Button
                        onClick={() => {
                          markAllAttendance(false)
                          setShowBulkDialog(false)
                          toast.success("Marked all members as absent")
                        }}
                        variant="outline"
                        className="w-full bg-white hover:bg-gray-50 text-gray-700"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Mark All Absent
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button onClick={saveAttendance} disabled={saving} className="bg-amber-600 hover:bg-amber-700">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Attendance List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Member Attendance</CardTitle>
          <CardDescription>
            {filteredMembers.length} member{filteredMembers.length !== 1 ? "s" : ""} •{presentCount} present •{" "}
            {totalCount - presentCount} absent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No members found</p>
                <p className="text-sm text-gray-500">Try adjusting your search terms</p>
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    attendance[member.id] ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.photo_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-amber-100 text-amber-600">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-900">{member.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {member.department}
                        </Badge>
                        <span className="text-xs text-gray-500">{member.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {attendance[member.id] && (
                      <div className="flex items-center text-green-600 text-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Present</span>
                      </div>
                    )}
                    <Checkbox
                      checked={attendance[member.id] || false}
                      onCheckedChange={() => toggleAttendance(member.id)}
                      className="h-5 w-5"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Attendance Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{presentCount}</div>
              <div className="text-sm text-green-700">Present</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{totalCount - presentCount}</div>
              <div className="text-sm text-red-700">Absent</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
              <div className="text-sm text-blue-700">Total Members</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{attendanceRate}%</div>
              <div className="text-sm text-amber-700">Attendance Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
