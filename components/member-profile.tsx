"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Edit,
  Save,
  X,
  Camera,
  Download,
  TrendingUp,
  Heart,
  Award,
  Activity,
  ChevronLeft,
  UserCheck,
  UserX,
  Receipt,
  CalendarDays,
  Loader2,
} from "lucide-react"
import { supabase, isSupabaseAvailable, type Member, type AttendanceRecord, type Donation } from "@/lib/supabase"
import { toast } from "sonner"
import PhotoUpload from "@/components/photo-upload"

interface MemberProfileProps {
  memberId: string
  onBack: () => void
}

interface AttendanceStats {
  totalServices: number
  attendedServices: number
  attendanceRate: number
  lastAttendance: string | null
  streak: number
}

interface DonationStats {
  totalDonations: number
  totalAmount: number
  averageDonation: number
  lastDonation: string | null
  favoriteType: string
}

export default function MemberProfile({ memberId, onBack }: MemberProfileProps) {
  const [member, setMember] = useState<Member | null>(null)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [donationRecords, setDonationRecords] = useState<Donation[]>([])
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
    totalServices: 0,
    attendedServices: 0,
    attendanceRate: 0,
    lastAttendance: null,
    streak: 0,
  })
  const [donationStats, setDonationStats] = useState<DonationStats>({
    totalDonations: 0,
    totalAmount: 0,
    averageDonation: 0,
    lastDonation: null,
    favoriteType: "Tithe",
  })
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    department: "",
    status: "Active" as "Active" | "Inactive",
    notes: "",
  })

  const departments = [
    "Choir",
    "Ushering",
    "Children's Ministry",
    "Youth Ministry",
    "Prayer Team",
    "Media Team",
    "Evangelism",
    "Welfare",
  ]

  useEffect(() => {
    loadMemberProfile()
  }, [memberId])

  const loadMemberProfile = async () => {
    try {
      setLoading(true)

      if (isSupabaseAvailable() && supabase) {
        // Load member details
        const { data: memberData, error: memberError } = await supabase
          .from("members")
          .select("*")
          .eq("id", memberId)
          .single()

        if (memberError) throw memberError
        setMember(memberData)
        setEditForm({
          name: memberData.name,
          phone: memberData.phone,
          email: memberData.email || "",
          address: memberData.address || "",
          department: memberData.department,
          status: memberData.status,
          notes: memberData.notes || "",
        })

        // Load attendance records
        const { data: attendanceData, error: attendanceError } = await supabase
          .from("attendance_records")
          .select("*")
          .eq("member_id", memberId)
          .order("service_date", { ascending: false })

        if (attendanceError) throw attendanceError
        setAttendanceRecords(attendanceData || [])

        // Load donation records
        const { data: donationData, error: donationError } = await supabase
          .from("donations")
          .select("*")
          .eq("member_id", memberId)
          .order("donation_date", { ascending: false })

        if (donationError) throw donationError
        setDonationRecords(donationData || [])

        // Calculate stats
        calculateStats(attendanceData || [], donationData || [])
      } else {
        // Mock data for demo
        const mockMember: Member = {
          id: memberId,
          name: "Akosua Mensah",
          phone: "+233 24 123 4567",
          email: "akosua.mensah@email.com",
          address: "East Legon, Accra",
          department: "Choir",
          join_date: "2022-03-15",
          status: "Active",
          notes: "Active choir member, excellent attendance record",
          created_at: "2022-03-15T00:00:00Z",
          updated_at: "2022-03-15T00:00:00Z",
        }

        const mockAttendance: AttendanceRecord[] = [
          {
            id: "1",
            member_id: memberId,
            service_date: "2024-01-14",
            service_type: "Sunday Service",
            present: true,
            check_in_time: "09:15:00",
            created_at: "2024-01-14T09:15:00Z",
          },
          {
            id: "2",
            member_id: memberId,
            service_date: "2024-01-07",
            service_type: "Sunday Service",
            present: true,
            check_in_time: "09:20:00",
            created_at: "2024-01-07T09:20:00Z",
          },
          {
            id: "3",
            member_id: memberId,
            service_date: "2024-01-03",
            service_type: "Prayer Meeting",
            present: false,
            created_at: "2024-01-03T00:00:00Z",
          },
        ]

        const mockDonations: Donation[] = [
          {
            id: "1",
            member_id: memberId,
            donor_name: "Akosua Mensah",
            donor_phone: "+233 24 123 4567",
            donor_email: "akosua.mensah@email.com",
            amount: 500.0,
            donation_type: "Tithe",
            payment_method: "Mobile Money",
            donation_date: "2024-01-14",
            notes: "Monthly tithe",
            receipt_number: "RCP001",
            created_at: "2024-01-14T00:00:00Z",
          },
          {
            id: "2",
            member_id: memberId,
            donor_name: "Akosua Mensah",
            donor_phone: "+233 24 123 4567",
            amount: 200.0,
            donation_type: "Offering",
            payment_method: "Cash",
            donation_date: "2024-01-07",
            receipt_number: "RCP002",
            created_at: "2024-01-07T00:00:00Z",
          },
        ]

        setMember(mockMember)
        setAttendanceRecords(mockAttendance)
        setDonationRecords(mockDonations)
        setEditForm({
          name: mockMember.name,
          phone: mockMember.phone,
          email: mockMember.email || "",
          address: mockMember.address || "",
          department: mockMember.department,
          status: mockMember.status,
          notes: mockMember.notes || "",
        })

        calculateStats(mockAttendance, mockDonations)
      }
    } catch (error) {
      console.error("Error loading member profile:", error)
      toast.error("Failed to load member profile")
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (attendance: AttendanceRecord[], donations: Donation[]) => {
    // Calculate attendance stats
    const totalServices = attendance.length
    const attendedServices = attendance.filter((record) => record.present).length
    const attendanceRate = totalServices > 0 ? (attendedServices / totalServices) * 100 : 0
    const lastAttendance = attendance.find((record) => record.present)?.service_date || null

    // Calculate streak (consecutive attended services)
    let streak = 0
    for (const record of attendance) {
      if (record.present) {
        streak++
      } else {
        break
      }
    }

    setAttendanceStats({
      totalServices,
      attendedServices,
      attendanceRate,
      lastAttendance,
      streak,
    })

    // Calculate donation stats
    const totalDonations = donations.length
    const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0)
    const averageDonation = totalDonations > 0 ? totalAmount / totalDonations : 0
    const lastDonation = donations[0]?.donation_date || null

    // Find most common donation type
    const typeCount = donations.reduce(
      (acc, donation) => {
        acc[donation.donation_type] = (acc[donation.donation_type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    const favoriteType = Object.keys(typeCount).reduce((a, b) => (typeCount[a] > typeCount[b] ? a : b), "Tithe")

    setDonationStats({
      totalDonations,
      totalAmount,
      averageDonation,
      lastDonation,
      favoriteType,
    })
  }

  const handleSave = async () => {
    if (!member) return

    try {
      if (isSupabaseAvailable() && supabase) {
        const { error } = await supabase
          .from("members")
          .update({
            name: editForm.name,
            phone: editForm.phone,
            email: editForm.email,
            address: editForm.address,
            department: editForm.department,
            status: editForm.status,
            notes: editForm.notes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", memberId)

        if (error) throw error
        toast.success("Member profile updated successfully!")
      } else {
        toast.success("Member profile updated successfully! (Demo mode)")
      }

      setMember((prev) => (prev ? { ...prev, ...editForm } : null))
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating member:", error)
      toast.error("Failed to update member profile")
    }
  }

  const handlePhotoUpdate = (photoUrl: string) => {
    if (member) {
      setMember({ ...member, photo_url: photoUrl })
      toast.success("Photo updated successfully!")
    }
  }

  const handlePhotoRemove = () => {
    if (member) {
      setMember({ ...member, photo_url: undefined })
      toast.success("Photo removed successfully!")
    }
  }

  const exportMemberData = () => {
    if (!member) return

    const data = {
      member: member,
      attendance: attendanceRecords,
      donations: donationRecords,
      stats: { attendance: attendanceStats, donations: donationStats },
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${member.name.replace(/\s+/g, "_")}_profile.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Member data exported successfully!")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto" />
              <p className="mt-2 text-gray-600">Loading member profile...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-gray-600">Member not found</p>
            <Button onClick={onBack} className="mt-4">
              Back to Members
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20 p-2">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="relative">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-white">
                  <AvatarImage src={member.photo_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-white text-orange-600 text-2xl sm:text-3xl font-bold">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 w-10 h-10 sm:w-11 sm:h-11 p-0 rounded-full"
                  onClick={() => setPhotoDialogOpen(true)}
                >
                  <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{member.name}</h1>
                <div className="flex items-center space-x-4 mt-1">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {member.department}
                  </Badge>
                  <Badge
                    variant={member.status === "Active" ? "default" : "secondary"}
                    className={member.status === "Active" ? "bg-green-500 text-white" : "bg-gray-500 text-white"}
                  >
                    {member.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={exportMemberData}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full mb-6 flex gap-2 overflow-x-auto whitespace-nowrap sm:grid sm:grid-cols-5 sm:overflow-visible">
            <TabsTrigger value="overview" className="px-3 py-2 text-sm sm:text-base flex-shrink-0">Overview</TabsTrigger>
            <TabsTrigger value="attendance" className="px-3 py-2 text-sm sm:text-base flex-shrink-0">Attendance</TabsTrigger>
            <TabsTrigger value="donations" className="px-3 py-2 text-sm sm:text-base flex-shrink-0">Donations</TabsTrigger>
            <TabsTrigger value="details" className="px-3 py-2 text-sm sm:text-base flex-shrink-0">Details</TabsTrigger>
            <TabsTrigger value="notes" className="px-3 py-2 text-sm sm:text-base flex-shrink-0">Notes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <UserCheck className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{attendanceStats.attendanceRate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Attendance Rate</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{attendanceStats.streak}</div>
                  <div className="text-sm text-gray-600">Current Streak</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">GHS {donationStats.totalAmount.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Donations</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">
                    {Math.floor(
                      (new Date().getTime() - new Date(member.join_date).getTime()) / (1000 * 60 * 60 * 24 * 365),
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Years Member</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{member.phone}</span>
                  </div>
                  {member.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{member.email}</span>
                    </div>
                  )}
                  {member.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{member.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Joined {new Date(member.join_date).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {attendanceStats.lastAttendance && (
                    <div className="flex items-center gap-3">
                      <UserCheck className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        Last attended on {new Date(attendanceStats.lastAttendance).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {donationStats.lastDonation && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">
                        Last donation on {new Date(donationStats.lastDonation).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Favorite donation type: {donationStats.favoriteType}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <CalendarDays className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-xl font-bold">{attendanceStats.totalServices}</div>
                  <div className="text-sm text-gray-600">Total Services</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <UserCheck className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <div className="text-xl font-bold">{attendanceStats.attendedServices}</div>
                  <div className="text-sm text-gray-600">Attended</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <UserX className="h-6 w-6 text-red-500 mx-auto mb-2" />
                  <div className="text-xl font-bold">
                    {attendanceStats.totalServices - attendanceStats.attendedServices}
                  </div>
                  <div className="text-sm text-gray-600">Missed</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>Complete record of service attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {attendanceRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {record.present ? (
                          <UserCheck className="h-5 w-5 text-green-500" />
                        ) : (
                          <UserX className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <div className="font-medium">{record.service_type}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(record.service_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={record.present ? "default" : "secondary"}>
                          {record.present ? "Present" : "Absent"}
                        </Badge>
                        {record.check_in_time && (
                          <div className="text-xs text-gray-500 mt-1">Check-in: {record.check_in_time}</div>
                        )}
                      </div>
                    </div>
                  ))}
                  {attendanceRecords.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No attendance records found</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Receipt className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                  <div className="text-xl font-bold">{donationStats.totalDonations}</div>
                  <div className="text-sm text-gray-600">Total Donations</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <div className="text-xl font-bold">GHS {donationStats.totalAmount.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Total Amount</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-xl font-bold">GHS {donationStats.averageDonation.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Average Donation</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Donation History</CardTitle>
                <CardDescription>Complete record of all donations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {donationRecords.map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="font-medium">GHS {donation.amount.toFixed(2)}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(donation.donation_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{donation.donation_type}</Badge>
                        <div className="text-xs text-gray-500 mt-1">{donation.payment_method}</div>
                        <div className="text-xs text-gray-500">Receipt: {donation.receipt_number}</div>
                      </div>
                    </div>
                  ))}
                  {donationRecords.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No donation records found</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Member Details</CardTitle>
                <CardDescription>{isEditing ? "Edit member information" : "View member information"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Select
                          value={editForm.department}
                          onValueChange={(value) => setEditForm({ ...editForm, department: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={editForm.status}
                          onValueChange={(value: "Active" | "Inactive") => setEditForm({ ...editForm, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                        <p className="text-lg">{member.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                        <p className="text-lg">{member.phone}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Email Address</Label>
                        <p className="text-lg">{member.email || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Department</Label>
                        <p className="text-lg">{member.department}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Status</Label>
                        <p className="text-lg">{member.status}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Join Date</Label>
                        <p className="text-lg">{new Date(member.join_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {member.address && (
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium text-gray-500">Address</Label>
                        <p className="text-lg">{member.address}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Member Notes</CardTitle>
                <CardDescription>
                  {isEditing ? "Edit notes about this member" : "Notes about this member"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <Textarea
                      value={editForm.notes}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      placeholder="Add notes about this member..."
                      rows={6}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700">
                        <Save className="h-4 w-4 mr-2" />
                        Save Notes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {member.notes ? (
                      <p className="text-gray-700 whitespace-pre-wrap">{member.notes}</p>
                    ) : (
                      <p className="text-gray-500 italic">No notes available for this member.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Photo Upload Dialog */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="bg-white border-2 border-gray-200 shadow-2xl max-w-md">
          <div className="bg-white p-2 rounded-lg">
            <PhotoUpload
              currentPhoto={member.photo_url}
              memberName={member.name}
              onPhotoUpdate={handlePhotoUpdate}
              onPhotoRemove={handlePhotoRemove}
              onClose={() => setPhotoDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
