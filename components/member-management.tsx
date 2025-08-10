"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Phone, Mail, MapPin, Edit, Trash2, Camera } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import PhotoUpload from "@/components/photo-upload"

export default function MemberManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showPhotoDialog, setShowPhotoDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null)

  // Mock member data with photos
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Akosua Mensah",
      phone: "+233 24 123 4567",
      email: "akosua.mensah@email.com",
      address: "East Legon, Accra",
      department: "Choir",
      joinDate: "2022-03-15",
      status: "Active",
      photo: "/placeholder.svg?height=80&width=80&text=AM",
      hasCustomPhoto: false,
    },
    {
      id: 2,
      name: "Kwame Asante",
      phone: "+233 20 987 6543",
      email: "kwame.asante@email.com",
      address: "Tema, Greater Accra",
      department: "Ushering",
      joinDate: "2023-01-20",
      status: "Active",
      photo: "/placeholder.svg?height=80&width=80&text=KA",
      hasCustomPhoto: false,
    },
    {
      id: 3,
      name: "Ama Osei",
      phone: "+233 26 555 7890",
      email: "ama.osei@email.com",
      address: "Kumasi, Ashanti",
      department: "Children's Ministry",
      joinDate: "2021-11-08",
      status: "Active",
      photo: "/placeholder.svg?height=80&width=80&text=AO",
      hasCustomPhoto: false,
    },
  ])

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handlePhotoUpdate = (memberId: number, photoUrl: string) => {
    setMembers(
      members.map((member) => (member.id === memberId ? { ...member, photo: photoUrl, hasCustomPhoto: true } : member)),
    )
    setShowPhotoDialog(false)
  }

  const handlePhotoRemove = (memberId: number) => {
    const member = members.find((m) => m.id === memberId)
    if (member) {
      const initials = member.name
        .split(" ")
        .map((n) => n[0])
        .join("")
      const defaultPhoto = `/placeholder.svg?height=80&width=80&text=${initials}`
      setMembers(members.map((m) => (m.id === memberId ? { ...m, photo: defaultPhoto, hasCustomPhoto: false } : m)))
    }
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Member Management</h2>
          <p className="text-gray-600">Manage church members and their information</p>
        </div>
      </div>

      {/* Search and Add */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search members by name or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
              <DialogDescription>Register a new church member with their details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Photo Upload Section */}
              <div className="text-center space-y-3">
                <div className="relative inline-block">
                  <Avatar className="w-20 h-20 mx-auto">
                    <AvatarImage src="/placeholder.svg?height=80&width=80&text=+" alt="Member Photo" />
                    <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-2xl">
                      +
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">Click camera icon to add photo</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Enter first name" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Enter last name" />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+233 XX XXX XXXX" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="member@email.com" />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Enter full address" />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="choir">Choir</SelectItem>
                    <SelectItem value="ushering">Ushering</SelectItem>
                    <SelectItem value="children">Children's Ministry</SelectItem>
                    <SelectItem value="youth">Youth Ministry</SelectItem>
                    <SelectItem value="prayer">Prayer Team</SelectItem>
                    <SelectItem value="media">Media Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600"
                  onClick={() => setShowAddDialog(false)}
                >
                  Add Member
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Members List */}
      <div className="space-y-3">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={member.photo || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-lg">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedMember(member)
                      setShowPhotoDialog(true)
                    }}
                    className="absolute -bottom-1 -right-1 rounded-full w-6 h-6 p-0 bg-blue-500 hover:bg-blue-600"
                  >
                    <Camera className="w-3 h-3" />
                  </Button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{member.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-blue-100 text-blue-800 text-xs">{member.department}</Badge>
                        {member.hasCustomPhoto && (
                          <Badge className="bg-green-100 text-green-800 text-xs">Photo Added</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{member.address}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Joined: {new Date(member.joinDate).toLocaleDateString()}
                    </span>
                    <Badge className="bg-green-100 text-green-800">{member.status}</Badge>
                  </div>
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
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No members found</h3>
            <p className="text-gray-600">Try adjusting your search terms or add a new member.</p>
          </CardContent>
        </Card>
      )}

      {/* Photo Management Dialog */}
      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Member Photo</DialogTitle>
            <DialogDescription>Update photo for {selectedMember?.name}</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <PhotoUpload
              currentPhoto={selectedMember.photo}
              memberName={selectedMember.name}
              onPhotoUpdate={(photoUrl) => handlePhotoUpdate(selectedMember.id, photoUrl)}
              onPhotoRemove={() => handlePhotoRemove(selectedMember.id)}
              onClose={() => setShowPhotoDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
