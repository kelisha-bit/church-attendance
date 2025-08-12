"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Users, Plus, Search, Trash2, Phone, Mail, MapPin, Calendar, Camera, Loader2, User } from "lucide-react"
import { supabase, isSupabaseAvailable, mockMembers, type Member } from "@/lib/supabase"
import { toast } from "sonner"
import PhotoUpload from "@/components/photo-upload"
import MemberProfile from "@/components/member-profile"

interface MemberManagementProps {
  onStatsUpdate?: () => void
}

export default function MemberManagement({ onStatsUpdate }: MemberManagementProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [newMember, setNewMember] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    department: "",
  })
  const [profileMemberId, setProfileMemberId] = useState<string | null>(null)

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
    loadMembers()
  }, [])

  const loadMembers = async () => {
    try {
      setLoading(true)

      if (isSupabaseAvailable() && supabase) {
        const { data, error } = await supabase.from("members").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setMembers(data || [])
      } else {
        // Use mock data
        setMembers(mockMembers)
      }
    } catch (error) {
      console.error("Error loading members:", error)
      toast.error("Failed to load members")
      setMembers(mockMembers) // Fallback to mock data
    } finally {
      setLoading(false)
    }
  }

  const addMember = async () => {
    if (!newMember.name || !newMember.phone || !newMember.department) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      if (isSupabaseAvailable() && supabase) {
        const { data, error } = await supabase
          .from("members")
          .insert([
            {
              ...newMember,
              join_date: new Date().toISOString().split("T")[0],
              status: "Active",
            },
          ])
          .select()

        if (error) throw error

        if (data) {
          setMembers((prev) => [data[0], ...prev])
          toast.success("Member added successfully!")
        }
      } else {
        // Mock mode - add to local state
        const mockMember: Member = {
          id: Date.now().toString(),
          ...newMember,
          join_date: new Date().toISOString().split("T")[0],
          status: "Active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setMembers((prev) => [mockMember, ...prev])
        toast.success("Member added successfully! (Demo mode)")
      }

      setNewMember({ name: "", phone: "", email: "", address: "", department: "" })
      setIsAddDialogOpen(false)
      onStatsUpdate?.()
    } catch (error) {
      console.error("Error adding member:", error)
      toast.error("Failed to add member")
    }
  }

  const deleteMember = async (id: string) => {
    try {
      if (isSupabaseAvailable() && supabase) {
        const { error } = await supabase.from("members").delete().eq("id", id)

        if (error) throw error
        toast.success("Member deleted successfully!")
      } else {
        toast.success("Member deleted successfully! (Demo mode)")
      }

      setMembers((prev) => prev.filter((member) => member.id !== id))
      onStatsUpdate?.()
    } catch (error) {
      console.error("Error deleting member:", error)
      toast.error("Failed to delete member")
    }
  }

  const handlePhotoUpdate = (memberId: string, photoUrl: string) => {
    setMembers((prev) => prev.map((member) => (member.id === memberId ? { ...member, photo_url: photoUrl } : member)))
    toast.success("Photo updated successfully!")
  }

  const handlePhotoRemove = (memberId: string) => {
    setMembers((prev) => prev.map((member) => (member.id === memberId ? { ...member, photo_url: undefined } : member)))
    toast.success("Photo removed successfully!")
  }

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm) ||
      (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesDepartment = selectedDepartment === "all" || member.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Member Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto" />
              <p className="mt-2 text-gray-600">Loading members...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Member Management
            </CardTitle>
            <CardDescription>Manage church members and their information</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-2 border-gray-200 shadow-2xl">
              <div className="bg-white p-2 rounded-lg">
                <DialogHeader className="bg-white">
                  <DialogTitle className="text-gray-900">Add New Member</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Enter the details of the new church member
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 bg-white p-4 rounded-lg">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={newMember.name}
                      onChange={(e) => setNewMember((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      className="bg-white border-gray-300 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      value={newMember.phone}
                      onChange={(e) => setNewMember((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+233 XX XXX XXXX"
                      className="bg-white border-gray-300 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="email@example.com"
                      className="bg-white border-gray-300 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-gray-700 font-medium">
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={newMember.address}
                      onChange={(e) => setNewMember((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter address"
                      className="bg-white border-gray-300 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department" className="text-gray-700 font-medium">
                      Department *
                    </Label>
                    <Select
                      value={newMember.department}
                      onValueChange={(value) => setNewMember((prev) => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger className="bg-white border-gray-300 focus:border-orange-500">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept} className="hover:bg-orange-50">
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={addMember} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    Add Member
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Members List */}
        <div className="space-y-4">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No members found</p>
              <p className="text-sm text-gray-500">Try adjusting your search or add a new member</p>
            </div>
          ) : (
            filteredMembers.map((member) => (
              <Card key={member.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.photo_url || "/placeholder.svg"} />
                          <AvatarFallback className="bg-orange-100 text-orange-600">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute -bottom-1 -right-1 w-6 h-6 p-0 rounded-full bg-white border-2 border-orange-200 hover:bg-orange-50"
                          onClick={() => {
                            setSelectedMember(member)
                            setPhotoDialogOpen(true)
                          }}
                        >
                          <Camera className="w-3 h-3 text-orange-600" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {member.phone}
                          </div>
                          {member.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {member.email}
                            </div>
                          )}
                        </div>
                        {member.address && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="h-3 w-3" />
                            {member.address}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            {member.department}
                          </Badge>
                          <Badge variant={member.status === "Active" ? "default" : "secondary"}>{member.status}</Badge>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            Joined {new Date(member.join_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setProfileMemberId(member.id)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                      >
                        <User className="h-4 w-4 mr-1" />
                        Profile
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white border-2 border-gray-200">
                          <AlertDialogHeader className="bg-white">
                            <AlertDialogTitle className="text-gray-900">Delete Member</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600">
                              Are you sure you want to delete {member.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="bg-white">
                            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMember(member.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>

      {/* Photo Upload Dialog */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="bg-white border-2 border-gray-200 shadow-2xl max-w-md">
          <div className="bg-white p-2 rounded-lg">
            {selectedMember && (
              <PhotoUpload
                currentPhoto={selectedMember.photo_url}
                memberName={selectedMember.name}
                onPhotoUpdate={(photoUrl) => handlePhotoUpdate(selectedMember.id, photoUrl)}
                onPhotoRemove={() => handlePhotoRemove(selectedMember.id)}
                onClose={() => setPhotoDialogOpen(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Member Profile Dialog */}
      {profileMemberId && <MemberProfile memberId={profileMemberId} onClose={() => setProfileMemberId(null)} />}
    </Card>
  )
}
