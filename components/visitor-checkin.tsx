"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, Phone, Mail, MapPin, Calendar, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export default function VisitorCheckin() {
  const [visitors, setVisitors] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      phone: "+233 55 123 4567",
      email: "sarah.j@email.com",
      address: "Osu, Accra",
      visitDate: "2024-01-14",
      visitTime: "09:30 AM",
      service: "Sunday Service",
      firstTime: true,
      followUpNeeded: true,
      photo: null,
    },
    {
      id: 2,
      name: "Michael Owusu",
      phone: "+233 24 987 6543",
      email: "m.owusu@email.com",
      address: "Dansoman, Accra",
      visitDate: "2024-01-14",
      visitTime: "09:45 AM",
      service: "Sunday Service",
      firstTime: false,
      followUpNeeded: false,
      photo: null,
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    service: "",
    firstTime: false,
    followUpNeeded: false,
    notes: "",
    photo: null,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newVisitor = {
      id: visitors.length + 1,
      name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      visitDate: new Date().toISOString().split("T")[0],
      visitTime: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      service: formData.service,
      firstTime: formData.firstTime,
      followUpNeeded: formData.followUpNeeded,
      photo: formData.photo,
    }

    setVisitors([newVisitor, ...visitors])
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      service: "",
      firstTime: false,
      followUpNeeded: false,
      notes: "",
      photo: null,
    })
    setShowForm(false)
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Visitor Check-in</h2>
          <p className="text-gray-600">Register and welcome new visitors</p>
        </div>
      </div>

      {/* Quick Check-in Button */}
      <Button
        onClick={() => setShowForm(!showForm)}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 h-14"
      >
        <UserPlus className="w-5 h-5 mr-2" />
        {showForm ? "Cancel Check-in" : "Check-in New Visitor"}
      </Button>

      {/* Visitor Registration Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Visitor Information</CardTitle>
            <CardDescription>Please fill in the visitor's details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+233 XX XXX XXXX"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="visitor@email.com"
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter address"
                />
              </div>

              <div>
                <Label htmlFor="service">Service/Event *</Label>
                <Select
                  value={formData.service}
                  onValueChange={(value) => setFormData({ ...formData, service: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
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

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="firstTime"
                    checked={formData.firstTime}
                    onCheckedChange={(checked) => setFormData({ ...formData, firstTime: checked as boolean })}
                  />
                  <Label htmlFor="firstTime">First time visitor</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="followUp"
                    checked={formData.followUpNeeded}
                    onCheckedChange={(checked) => setFormData({ ...formData, followUpNeeded: checked as boolean })}
                  />
                  <Label htmlFor="followUp">Needs follow-up contact</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any special notes about the visitor..."
                />
              </div>

              <div>
                <Label htmlFor="photo">Photo</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0]
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setFormData({ ...formData, photo: reader.result as string })
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-green-600">
                  Check-in Visitor
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Today's Visitors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today's Visitors</CardTitle>
          <CardDescription>
            {visitors.length} visitor{visitors.length !== 1 ? "s" : ""} checked in today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {visitors.map((visitor) => (
            <div key={visitor.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={
                      visitor.photo ||
                      `/placeholder.svg?height=48&width=48&text=${visitor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}`
                    }
                    alt={visitor.name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white">
                    {visitor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{visitor.name}</h3>
                      <div className="flex gap-2 mt-1">
                        {visitor.firstTime && <Badge className="bg-green-100 text-green-800 text-xs">First Time</Badge>}
                        {visitor.followUpNeeded && (
                          <Badge className="bg-orange-100 text-orange-800 text-xs">Follow-up Needed</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(visitor.visitDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {visitor.visitTime}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      <span>{visitor.phone}</span>
                    </div>
                    {visitor.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        <span>{visitor.email}</span>
                      </div>
                    )}
                    {visitor.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <span>{visitor.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {visitor.service}
                    </Badge>
                    {visitor.followUpNeeded && (
                      <Button size="sm" variant="outline" className="text-xs bg-transparent">
                        Contact Visitor
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {visitors.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No visitors checked in today</p>
              <p className="text-sm">Use the button above to register new visitors</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
