"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, Camera, Download, Grid, List } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MemberPhotoGallery() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Mock member data with photos
  const members = [
    {
      id: 1,
      name: "Akosua Mensah",
      department: "Choir",
      photo: "/placeholder.svg?height=120&width=120&text=AM",
      hasCustomPhoto: true,
      joinDate: "2022-03-15",
      attendanceRate: 95,
    },
    {
      id: 2,
      name: "Kwame Asante",
      department: "Ushering",
      photo: "/placeholder.svg?height=120&width=120&text=KA",
      hasCustomPhoto: true,
      joinDate: "2023-01-20",
      attendanceRate: 100,
    },
    {
      id: 3,
      name: "Ama Osei",
      department: "Children's Ministry",
      photo: "/placeholder.svg?height=120&width=120&text=AO",
      hasCustomPhoto: false,
      joinDate: "2021-11-08",
      attendanceRate: 88,
    },
    {
      id: 4,
      name: "Kofi Boateng",
      department: "Youth Ministry",
      photo: "/placeholder.svg?height=120&width=120&text=KB",
      hasCustomPhoto: true,
      joinDate: "2022-07-12",
      attendanceRate: 92,
    },
    {
      id: 5,
      name: "Efua Darko",
      department: "Prayer Team",
      photo: "/placeholder.svg?height=120&width=120&text=ED",
      hasCustomPhoto: false,
      joinDate: "2023-02-28",
      attendanceRate: 87,
    },
    {
      id: 6,
      name: "Yaw Mensah",
      department: "Media Team",
      photo: "/placeholder.svg?height=120&width=120&text=YM",
      hasCustomPhoto: true,
      joinDate: "2022-11-15",
      attendanceRate: 94,
    },
  ]

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment =
      selectedDepartment === "all" || member.department.toLowerCase().includes(selectedDepartment.toLowerCase())
    return matchesSearch && matchesDepartment
  })

  const membersWithPhotos = members.filter((m) => m.hasCustomPhoto).length
  const membersWithoutPhotos = members.length - membersWithPhotos

  const exportPhotoDirectory = () => {
    // In a real app, this would generate a PDF or document with all member photos
    alert("Photo directory export functionality would be implemented here")
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Member Photo Gallery</h2>
          <p className="text-gray-600">View and manage member photos</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
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
            <Users className="w-8 h-8 mx-auto mb-2 text-orange-200" />
            <div className="text-2xl font-bold">{membersWithoutPhotos}</div>
            <div className="text-sm text-orange-100">Need Photos</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search members by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="choir">Choir</SelectItem>
                <SelectItem value="ushering">Ushering</SelectItem>
                <SelectItem value="youth">Youth Ministry</SelectItem>
                <SelectItem value="children">Children's Ministry</SelectItem>
                <SelectItem value="prayer">Prayer Team</SelectItem>
                <SelectItem value="media">Media Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-blue-500 hover:bg-blue-600" : "bg-transparent"}
              >
                <Grid className="w-4 h-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-blue-500 hover:bg-blue-600" : "bg-transparent"}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
            </div>

            <Button
              onClick={exportPhotoDirectory}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Directory
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Member Gallery */}
      <Tabs value="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Members ({filteredMembers.length})</TabsTrigger>
          <TabsTrigger value="with-photos">
            With Photos ({filteredMembers.filter((m) => m.hasCustomPhoto).length})
          </TabsTrigger>
          <TabsTrigger value="need-photos">
            Need Photos ({filteredMembers.filter((m) => !m.hasCustomPhoto).length})
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
                        <AvatarImage src={member.photo || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-lg">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {!member.hasCustomPhoto && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <Camera className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">{member.name}</h3>
                      <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">{member.department}</Badge>
                    </div>

                    <div className="text-xs text-gray-500">{member.attendanceRate}% attendance</div>

                    {!member.hasCustomPhoto && (
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      >
                        <Camera className="w-3 h-3 mr-1" />
                        Add Photo
                      </Button>
                    )}
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
                          <AvatarImage src={member.photo || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {!member.hasCustomPhoto && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                            <Camera className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{member.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-blue-100 text-blue-800 text-xs">{member.department}</Badge>
                          {member.hasCustomPhoto ? (
                            <Badge className="bg-green-100 text-green-800 text-xs">Photo Added</Badge>
                          ) : (
                            <Badge className="bg-orange-100 text-orange-800 text-xs">Needs Photo</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Joined: {new Date(member.joinDate).toLocaleDateString()} • {member.attendanceRate}% attendance
                        </div>
                      </div>

                      {!member.hasCustomPhoto && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Add Photo
                        </Button>
                      )}
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
              .filter((m) => m.hasCustomPhoto)
              .map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center space-y-3">
                    <Avatar className="w-20 h-20 mx-auto">
                      <AvatarImage src={member.photo || "/placeholder.svg"} alt={member.name} />
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
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="need-photos">
          <div className="space-y-3">
            {filteredMembers
              .filter((m) => !m.hasCustomPhoto)
              .map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={member.photo || "/placeholder.svg"} alt={member.name} />
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
                          Joined: {new Date(member.joinDate).toLocaleDateString()}
                        </div>
                      </div>

                      <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
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
    </div>
  )
}
