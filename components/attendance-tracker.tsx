"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Check, X, Users, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function AttendanceTracker() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedService, setSelectedService] = useState("sunday-service")
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0])

  // Mock member data with attendance status
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Akosua Mensah",
      department: "Choir",
      phone: "+233 24 123 4567",
      present: true,
      checkedInTime: "09:15 AM",
      avatar: "/placeholder.svg?height=48&width=48&text=AM",
    },
    {
      id: 2,
      name: "Kwame Asante",
      department: "Ushering",
      phone: "+233 20 987 6543",
      present: true,
      checkedInTime: "09:30 AM",
      avatar: "/placeholder.svg?height=48&width=48&text=KA",
    },
    {
      id: 3,
      name: "Ama Osei",
      department: "Children's Ministry",
      phone: "+233 26 555 7890",
      present: false,
      checkedInTime: null,
      avatar: "/placeholder.svg?height=48&width=48&text=AO",
    },
    {
      id: 4,
      name: "Kofi Boateng",
      department: "Youth Ministry",
      phone: "+233 54 321 9876",
      present: true,
      checkedInTime: "09:45 AM",
      avatar: "/placeholder.svg?height=48&width=48&text=KB",
    },
    {
      id: 5,
      name: "Efua Darko",
      department: "Prayer Team",
      phone: "+233 27 654 3210",
      present: false,
      checkedInTime: null,
      avatar: "/placeholder.svg?height=48&width=48&text=ED",
    },
  ])

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const presentCount = members.filter((m) => m.present).length
  const totalMembers = members.length
  const attendanceRate = Math.round((presentCount / totalMembers) * 100)

  const toggleAttendance = (memberId: number) => {
    setMembers(
      members.map((member) => {
        if (member.id === memberId) {
          const newPresent = !member.present
          return {
            ...member,
            present: newPresent,
            checkedInTime: newPresent
              ? new Date().toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : null,
          }
        }
        return member
      }),
    )
  }

  const markAllPresent = () => {
    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
    setMembers(
      members.map((member) => ({
        ...member,
        present: true,
        checkedInTime: member.present ? member.checkedInTime : currentTime,
      })),
    )
  }

  const markAllAbsent = () => {
    setMembers(
      members.map((member) => ({
        ...member,
        present: false,
        checkedInTime: null,
      })),
    )
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Attendance Tracker</h2>
          <p className="text-gray-600">Mark member attendance for services</p>
        </div>
      </div>

      {/* Service Selection */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Service/Event</label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunday-service">Sunday Service</SelectItem>
                  <SelectItem value="prayer-meeting">Prayer Meeting</SelectItem>
                  <SelectItem value="bible-study">Bible Study</SelectItem>
                  <SelectItem value="youth-service">Youth Service</SelectItem>
                  <SelectItem value="special-event">Special Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Date</label>
              <Input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{presentCount}</div>
              <div className="text-sm text-gray-600">Present</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{totalMembers - presentCount}</div>
              <div className="text-sm text-gray-600">Absent</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{attendanceRate}%</div>
              <div className="text-sm text-gray-600">Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button
          onClick={markAllPresent}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          <Check className="w-4 h-4 mr-2" />
          Mark All Present
        </Button>
        <Button
          onClick={markAllAbsent}
          variant="outline"
          className="flex-1 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
        >
          <X className="w-4 h-4 mr-2" />
          Mark All Absent
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search members by name or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Members List */}
      <div className="space-y-3">
        {filteredMembers.map((member) => (
          <Card
            key={member.id}
            className={`hover:shadow-md transition-all ${
              member.present ? "border-green-200 bg-green-50" : "border-gray-200"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={member.present}
                    onCheckedChange={() => toggleAttendance(member.id)}
                    className="w-5 h-5"
                  />
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{member.name}</h3>
                      <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">{member.department}</Badge>
                    </div>

                    <div className="text-right">
                      {member.present ? (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800">Present</Badge>
                          {member.checkedInTime && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {member.checkedInTime}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Badge variant="outline" className="border-red-200 text-red-600">
                          Absent
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-gray-600">{member.phone}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Users className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No members found</h3>
            <p className="text-gray-600">Try adjusting your search terms.</p>
          </CardContent>
        </Card>
      )}

      {/* Save Attendance Button */}
      <div className="fixed bottom-20 left-4 right-4">
        <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 h-12 shadow-lg">
          <Check className="w-5 h-5 mr-2" />
          Save Attendance Record
        </Button>
      </div>
    </div>
  )
}
