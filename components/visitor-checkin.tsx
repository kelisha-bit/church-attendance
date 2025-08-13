"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Phone, Mail, MapPin, Clock, Calendar, User, Loader2, AlertCircle } from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase, isSupabaseAvailable, mockVisitors, type Visitor } from "@/lib/supabase"
import { toast } from "sonner"

export default function VisitorCheckin() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    service: "",
    firstTime: true,
    followUpNeeded: false,
    notes: "",
  })

  // Fetch visitors from Supabase or use mock data
  const fetchVisitors = async () => {
    try {
      setLoading(true)

      if (!isSupabaseAvailable()) {
        // Use mock data when Supabase is not available
        console.log("Using mock visitor data")
        setVisitors(mockVisitors)
        return
      }

      const { data, error } = await supabase!
        .from("visitors")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) throw error
      setVisitors(data || [])
    } catch (error) {
      console.error("Error fetching visitors:", error)
      // Fallback to mock data on error
      setVisitors(mockVisitors)
      toast.error("Failed to load visitors from database, using demo data")
    } finally {
      setLoading(false)
    }
  }

  // Add new visitor
  const handleAddVisitor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.service) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setSubmitting(true)
      const now = new Date()
      const newVisitor: Visitor = {
        id: Date.now().toString(), // Simple ID for demo
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        address: formData.address || undefined,
        visit_date: now.toISOString().split("T")[0],
        visit_time: now.toTimeString().split(" ")[0],
        service: formData.service,
        first_time: formData.firstTime,
        follow_up_needed: formData.followUpNeeded,
        notes: formData.notes || undefined,
        created_at: now.toISOString(),
      }

      if (isSupabaseAvailable()) {
        const { data, error } = await supabase!
          .from("visitors")
          .insert([
            {
              name: newVisitor.name,
              phone: newVisitor.phone,
              email: newVisitor.email || null,
              address: newVisitor.address || null,
              visit_date: newVisitor.visit_date,
              visit_time: newVisitor.visit_time,
              service: newVisitor.service,
              first_time: newVisitor.first_time,
              follow_up_needed: newVisitor.follow_up_needed,
              notes: newVisitor.notes || null,
            },
          ])
          .select()

        if (error) throw error
        toast.success("Visitor registered successfully!")
      } else {
        // Add to mock data for demo
        setVisitors((prev) => [newVisitor, ...prev])
        toast.success("Visitor registered successfully! (Demo mode)")
      }

      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        service: "",
        firstTime: true,
        followUpNeeded: false,
        notes: "",
      })
      setShowAddDialog(false)

      if (isSupabaseAvailable()) {
        fetchVisitors() // Refresh the list
      }
    } catch (error) {
      console.error("Error adding visitor:", error)
      toast.error("Failed to register visitor")
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    fetchVisitors()
  }, [])

  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.service.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
          <h2 className="text-2xl font-bold text-gray-800">Visitor Check-in</h2>
          <p className="text-gray-600">Register and manage church visitors</p>
        </div>
      </div>

      {/* Demo Mode Alert */}
      {!isSupabaseAvailable() && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Demo mode: Add your Supabase environment variables to enable database functionality.
          </AlertDescription>
        </Alert>
      )}

      {/* Search and Add */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search visitors by name or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Visitor
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-2 border-gray-200 shadow-2xl max-w-md max-h-[90vh] overflow-y-auto">
            <div className="bg-white p-2 rounded-lg">
              <DialogHeader className="bg-white">
                <DialogTitle className="text-gray-900">Register New Visitor</DialogTitle>
                <DialogDescription className="text-gray-600">Welcome a new visitor to our church</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddVisitor} className="space-y-4 bg-white p-4 rounded-lg">
                <div>
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    required
                    className="bg-white border-gray-300 focus:border-purple-500"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+233 XX XXX XXXX"
                    required
                    className="bg-white border-gray-300 focus:border-purple-500"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="visitor@email.com"
                    className="bg-white border-gray-300 focus:border-purple-500"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-gray-700 font-medium">
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter address"
                    className="bg-white border-gray-300 focus:border-purple-500"
                  />
                </div>
                <div>
                  <Label htmlFor="service" className="text-gray-700 font-medium">
                    Service/Event *
                  </Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => setFormData({ ...formData, service: value })}
                  >
                    <SelectTrigger className="bg-white border-gray-300 focus:border-purple-500">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="Sunday Service" className="hover:bg-purple-50">
                        Sunday Service
                      </SelectItem>
                      <SelectItem value="Prayer Meeting" className="hover:bg-purple-50">
                        Prayer Meeting
                      </SelectItem>
                      <SelectItem value="Bible Study" className="hover:bg-purple-50">
                        Bible Study
                      </SelectItem>
                      <SelectItem value="Youth Service" className="hover:bg-purple-50">
                        Youth Service
                      </SelectItem>
                      <SelectItem value="Special Event" className="hover:bg-purple-50">
                        Special Event
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="firstTime"
                      checked={formData.firstTime}
                      onCheckedChange={(checked) => setFormData({ ...formData, firstTime: checked as boolean })}
                    />
                    <Label htmlFor="firstTime" className="text-gray-700">
                      First time visitor
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="followUp"
                      checked={formData.followUpNeeded}
                      onCheckedChange={(checked) => setFormData({ ...formData, followUpNeeded: checked as boolean })}
                    />
                    <Label htmlFor="followUp" className="text-gray-700">
                      Needs follow-up
                    </Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes" className="text-gray-700 font-medium">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional notes..."
                    className="bg-white border-gray-300 focus:border-purple-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                    onClick={() => setShowAddDialog(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Register Visitor"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Visitors List */}
      <div className="space-y-3">
        {filteredVisitors.map((visitor) => (
          <Card key={visitor.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={visitor.photo_url || "/placeholder.svg"} alt={visitor.name} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white text-lg">
                    {visitor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{visitor.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-purple-100 text-purple-800 text-xs">{visitor.service}</Badge>
                        {visitor.first_time && (
                          <Badge className="bg-green-100 text-green-800 text-xs">First Time</Badge>
                        )}
                        {visitor.follow_up_needed && (
                          <Badge className="bg-orange-100 text-orange-800 text-xs">Follow Up</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="flex-1 min-w-0 truncate">{visitor.phone}</span>
                    </div>
                    {visitor.email && (
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="flex-1 min-w-0 break-all">{visitor.email}</span>
                      </div>
                    )}
                    {visitor.address && (
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="flex-1 min-w-0 break-words">{visitor.address}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="flex-1 min-w-0 truncate">{new Date(visitor.visit_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="flex-1 min-w-0 truncate">{visitor.visit_time}</span>
                    </div>
                  </div>

                  {visitor.notes && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
                      <strong>Notes:</strong> {visitor.notes}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVisitors.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <User className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No visitors found</h3>
            <p className="text-gray-600">Try adjusting your search terms or register a new visitor.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
