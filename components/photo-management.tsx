"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Users,
  Camera,
  Download,
  Grid,
  List,
  Upload,
  Trash2,
  Edit,
  AlertCircle,
  Loader2,
  ImageIcon,
  FileImage,
} from "lucide-react"
import { supabase, isSupabaseAvailable, mockMembers, type Member } from "@/lib/supabase"
import { toast } from "sonner"
import PhotoUpload from "@/components/photo-upload"

export default function PhotoManagement() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false)

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

  // Load members
  const loadMembers = async () => {
    try {
      setLoading(true)

      if (isSupabaseAvailable() && supabase) {
        const { data, error } = await supabase.from("members").select("*").order("name")

        if (error) throw error
        setMembers(data || [])
      } else {
        // Use mock data with some photos
        const membersWithPhotos = mockMembers.map((member, index) => ({
          ...member,
          photo_url:
            index % 3 === 0
              ? `/placeholder.svg?height=120&width=120&text=${member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}`
              : undefined,
        }))
        setMembers(membersWithPhotos)
      }
    } catch (error) {
      console.error("Error loading members:", error)
      toast.error("Failed to load members")
      setMembers(mockMembers)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
  }, [])

  // Handle photo update
  const handlePhotoUpdate = async (memberId: string, photoUrl: string) => {
    try {
      if (isSupabaseAvailable() && supabase) {
        const { error } = await supabase.from("members").update({ photo_url: photoUrl }).eq("id", memberId)

        if (error) throw error
      }

      setMembers((prev) => prev.map((member) => (member.id === memberId ? { ...member, photo_url: photoUrl } : member)))
      toast.success("Photo updated successfully!")
    } catch (error) {
      console.error("Error updating photo:", error)
      toast.error("Failed to update photo")
    }
  }

  // Handle photo removal
  const handlePhotoRemove = async (memberId: string) => {
    try {
      if (isSupabaseAvailable() && supabase) {
        const { error } = await supabase.from("members").update({ photo_url: null }).eq("id", memberId)

        if (error) throw error
      }

      setMembers((prev) =>
        prev.map((member) => (member.id === memberId ? { ...member, photo_url: undefined } : member)),
      )
      toast.success("Photo removed successfully!")
    } catch (error) {
      console.error("Error removing photo:", error)
      toast.error("Failed to remove photo")
    }
  }

  // Bulk photo upload handler
  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        if (!file.type.startsWith("image/")) return null

        // Create data URL for demo
        return new Promise<{ name: string; url: string }>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            resolve({
              name: file.name.split(".")[0], // Use filename as member name hint
              url: e.target?.result as string,
            })
          }
          reader.readAsDataURL(file)
        })
      })

      const results = await Promise.all(uploadPromises)
      const validResults = results.filter(Boolean) as { name: string; url: string }[]

      toast.success(`Uploaded ${validResults.length} photos successfully! (Demo mode)`)
      setBulkUploadOpen(false)
    } catch (error) {
      console.error("Error uploading photos:", error)
      toast.error("Failed to upload photos")
    }
  }

  // Export photo directory
  const exportPhotoDirectory = () => {
    const membersWithPhotos = filteredMembers.filter((m) => m.photo_url)

    const directoryContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>GreaterWorks City Church - Photo Directory</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { color: #d97706; font-size: 24px; font-weight: bold; }
            .member-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
            .member-card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; text-align: center; }
            .member-photo { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin: 0 auto 10px; }
            .member-name { font-weight: bold; margin-bottom: 5px; }
            .member-dept { color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">⛪ GreaterWorks City Church</div>
            <h1>Member Photo Directory</h1>
            <p>Generated: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="member-grid">
            ${membersWithPhotos
              .map(
                (member) => `
              <div class="member-card">
                <img src="${member.photo_url}" alt="${member.name}" class="member-photo" />
                <div class="member-name">${member.name}</div>
                <div class="member-dept">${member.department}</div>
              </div>
            `,
              )
              .join("")}
          </div>
        </body>
      </html>
    `

    const blob = new Blob([directoryContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `photo-directory-${new Date().toISOString().split("T")[0]}.html`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Photo directory exported successfully!")
  }

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || member.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const membersWithPhotos = members.filter((m) => m.photo_url).length
  const membersWithoutPhotos = members.length - membersWithPhotos

  if (loading) {
    return (
      <div className="p-4 space-y-4 pb-20">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Photo Management</h2>
          <p className="text-gray-600">Manage member photos and create directories</p>
        </div>
      </div>

      {/* Demo Mode Alert */}
      {!isSupabaseAvailable() && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Demo mode: Photos are stored locally and will be lost on page refresh.</AlertDescription>
        </Alert>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-200" />
            <div className="text-2xl font-bold">{members.length}</div>
            <div className="text-sm text-blue-100">Total Members</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-4 text-center">
            <Camera className="w-8 h-8 mx-auto mb-2 text-green-200" />
            <div className="text-2xl font-bold">{membersWithPhotos}</div>
            <div className="text-sm text-green-100">With Photos</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
          <CardContent className="p-4 text-center">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-orange-200" />
            <div className="text-2xl font-bold">{membersWithoutPhotos}</div>
            <div className="text-sm text-orange-100">Need Photos</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-4 text-center">
            <FileImage className="w-8 h-8 mx-auto mb-2 text-purple-200" />
            <div className="text-2xl font-bold">{Math.round((membersWithPhotos / members.length) * 100)}%</div>
            <div className="text-sm text-purple-100">Completion</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search members by name or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full md:w-48">
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

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-blue-500 hover:bg-blue-600" : "bg-white hover:bg-gray-50"}
              >
                <Grid className="w-4 h-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-blue-500 hover:bg-blue-600" : "bg-white hover:bg-gray-50"}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
            </div>

            <div className="flex gap-2">
              <Dialog open={bulkUploadOpen} onOpenChange={setBulkUploadOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Bulk Upload
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white border-2 border-gray-200 shadow-2xl">
                  <div className="bg-white p-2 rounded-lg">
                    <DialogHeader className="bg-white">
                      <DialogTitle className="text-gray-900">Bulk Photo Upload</DialogTitle>
                      <DialogDescription className="text-gray-600">Upload multiple photos at once</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 bg-white p-4 rounded-lg">
                      <div>
                        <Label htmlFor="bulk-upload" className="text-gray-700 font-medium">
                          Select Multiple Photos
                        </Label>
                        <Input
                          id="bulk-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleBulkUpload}
                          className="bg-white border-gray-300 focus:border-purple-500"
                        />
                      </div>
                      <Alert className="bg-blue-50 border-blue-200">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-700">
                          Name your photo files with member names for easier matching (e.g., "john-doe.jpg")
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                onClick={exportPhotoDirectory}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Directory
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo Gallery */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Members ({filteredMembers.length})</TabsTrigger>
          <TabsTrigger value="with-photos">
            With Photos ({filteredMembers.filter((m) => m.photo_url).length})
          </TabsTrigger>
          <TabsTrigger value="need-photos">
            Need Photos ({filteredMembers.filter((m) => !m.photo_url).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center space-y-3">
                    <div className="relative">
                      <Avatar className="w-20 h-20 mx-auto">
                        <AvatarImage src={member.photo_url || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-lg">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {!member.photo_url && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <Camera className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">{member.name}</h3>
                      <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">{member.department}</Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedMember(member)
                          setPhotoDialogOpen(true)
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      >
                        <Camera className="w-3 h-3 mr-1" />
                        {member.photo_url ? "Edit" : "Add"}
                      </Button>
                      {member.photo_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePhotoRemove(member.id)}
                          className="bg-white hover:bg-red-50 text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={member.photo_url || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {!member.photo_url && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                            <Camera className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{member.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-blue-100 text-blue-800 text-xs">{member.department}</Badge>
                          {member.photo_url ? (
                            <Badge className="bg-green-100 text-green-800 text-xs">Photo Added</Badge>
                          ) : (
                            <Badge className="bg-orange-100 text-orange-800 text-xs">Needs Photo</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Joined: {new Date(member.join_date).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedMember(member)
                            setPhotoDialogOpen(true)
                          }}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          {member.photo_url ? "Edit Photo" : "Add Photo"}
                        </Button>
                        {member.photo_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePhotoRemove(member.id)}
                            className="bg-white hover:bg-red-50 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="with-photos">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMembers
              .filter((m) => m.photo_url)
              .map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center space-y-3">
                    <Avatar className="w-20 h-20 mx-auto">
                      <AvatarImage src={member.photo_url || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-lg">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">{member.name}</h3>
                      <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">{member.department}</Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedMember(member)
                          setPhotoDialogOpen(true)
                        }}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePhotoRemove(member.id)}
                        className="bg-white hover:bg-red-50 text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="need-photos">
          <div className="space-y-3">
            {filteredMembers
              .filter((m) => !m.photo_url)
              .map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={member.photo_url || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{member.name}</h3>
                        <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">{member.department}</Badge>
                        <div className="text-sm text-gray-600 mt-1">
                          Joined: {new Date(member.join_date).toLocaleDateString()}
                        </div>
                      </div>

                      <Button
                        onClick={() => {
                          setSelectedMember(member)
                          setPhotoDialogOpen(true)
                        }}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Add Photo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredMembers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No members found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters.</p>
          </CardContent>
        </Card>
      )}

      {/* Photo Upload Dialog */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="bg-white border-2 border-gray-200 shadow-2xl max-w-md max-h-[90vh] overflow-y-auto">
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
    </div>
  )
}
