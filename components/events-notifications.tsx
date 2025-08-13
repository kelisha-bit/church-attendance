"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, Clock, Users, Send, Plus, Edit, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase, isSupabaseAvailable, type Event } from "@/lib/supabase"
import { toast } from "sonner"

export default function EventsNotifications() {
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showNotificationDialog, setShowNotificationDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<Event[]>([])
  const [form, setForm] = useState({
    title: "",
    event_date: "",
    event_time: "",
    location: "",
    description: "",
    recurring_frequency: "none" as Event["recurring_frequency"],
  })

  // Mock notifications data (UI-only for now)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Sunday Service Reminder",
      message: "Join us tomorrow for Sunday worship service at 9:00 AM. God bless!",
      recipients: "All Members",
      sentDate: "2024-01-20",
      sentTime: "07:00 PM",
      status: "Sent",
    },
    {
      id: 2,
      title: "Prayer Meeting Tonight",
      message: "Don't forget our prayer meeting tonight at 6:00 PM. See you there!",
      recipients: "Prayer Team",
      sentDate: "2024-01-17",
      sentTime: "04:00 PM",
      status: "Sent",
    },
  ])

  const sendNotification = (eventId: string) => {
    const event = events.find((e) => e.id === eventId)
    if (event) {
      const newNotification = {
        id: notifications.length + 1,
        title: `${event.title} Reminder`,
        message: `Reminder: ${event.title} on ${new Date(event.event_date).toLocaleDateString()} at ${event.event_time}. Location: ${event.location || "TBA"}`,
        recipients: "All Members",
        sentDate: new Date().toISOString().split("T")[0],
        sentTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        status: "Sent",
      }

      setNotifications([newNotification, ...notifications])
      setEvents(events.map((e) => (e.id === eventId ? { ...e, notification_sent: true } : e)))
    }
  }

  const fetchEvents = async () => {
    try {
      setLoading(true)
      if (!isSupabaseAvailable()) {
        // Demo/mock events
        setEvents([
          {
            id: "1",
            title: "Sunday Service",
            description: "Weekly Sunday worship service",
            event_date: new Date().toISOString().split("T")[0],
            event_time: "09:00",
            location: "Main Sanctuary",
            recurring_frequency: "weekly",
            notification_sent: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Prayer Meeting",
            description: "Midweek prayer and intercession",
            event_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
            event_time: "18:00",
            location: "Prayer Hall",
            recurring_frequency: "weekly",
            notification_sent: true,
            created_at: new Date().toISOString(),
          },
        ])
        return
      }

      const { data, error } = await supabase!
        .from("events")
        .select("id, title, description, event_date, event_time, location, recurring_frequency, notification_sent, created_at")
        .order("event_date", { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (err) {
      console.error(err)
      toast.error("Failed to load events; using demo data")
    } finally {
      setLoading(false)
    }
  }

  const createEvent = async () => {
    if (!form.title || !form.event_date || !form.event_time) {
      toast.error("Please fill in title, date and time")
      return
    }
    try {
      if (!isSupabaseAvailable()) {
        const mock: Event = {
          id: Date.now().toString(),
          title: form.title,
          description: form.description || undefined,
          event_date: form.event_date,
          event_time: form.event_time,
          location: form.location || undefined,
          recurring_frequency: form.recurring_frequency,
          notification_sent: false,
          created_at: new Date().toISOString(),
        }
        setEvents((prev) => [mock, ...prev])
        setShowEventDialog(false)
        setForm({ title: "", event_date: "", event_time: "", location: "", description: "", recurring_frequency: "none" })
        toast.success("Event created (demo mode)")
        return
      }

      const { data, error } = await supabase!
        .from("events")
        .insert([
          {
            title: form.title,
            description: form.description || null,
            event_date: form.event_date,
            event_time: form.event_time,
            location: form.location || null,
            recurring_frequency: form.recurring_frequency,
            notification_sent: false,
          },
        ])
        .select()

      if (error) throw error
      toast.success("Event created")
      setShowEventDialog(false)
      setForm({ title: "", event_date: "", event_time: "", location: "", description: "", recurring_frequency: "none" })
      fetchEvents()
    } catch (err) {
      console.error(err)
      toast.error("Failed to create event")
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      if (!isSupabaseAvailable()) {
        setEvents((prev) => prev.filter((e) => e.id !== id))
        toast.success("Event deleted (demo mode)")
        return
      }
      const { error } = await supabase!.from("events").delete().eq("id", id)
      if (error) throw error
      toast.success("Event deleted")
      setEvents((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete event")
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Events & Notifications</h2>
          <p className="text-gray-600">Manage church events and send notifications</p>
        </div>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          {/* Add Event Button */}
           <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-2 border-gray-200 shadow-2xl max-w-md">
              <div className="bg-white p-2 rounded-lg">
                <DialogHeader className="bg-white">
                  <DialogTitle className="text-gray-900">Add New Event</DialogTitle>
                  <DialogDescription className="text-gray-600">Create a new church event</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 bg-white p-4 rounded-lg">
                  <div>
                    <Label htmlFor="eventTitle" className="text-gray-700 font-medium">
                      Event Title
                    </Label>
                    <Input
                      id="eventTitle"
                      placeholder="Enter event title"
                      className="bg-white border-gray-300 focus:border-blue-500"
                       value={form.title}
                       onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eventDate" className="text-gray-700 font-medium">
                        Date
                      </Label>
                       <Input id="eventDate" type="date" className="bg-white border-gray-300 focus:border-blue-500" value={form.event_date} onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))} />
                    </div>
                    <div>
                      <Label htmlFor="eventTime" className="text-gray-700 font-medium">
                        Time
                      </Label>
                       <Input id="eventTime" type="time" className="bg-white border-gray-300 focus:border-blue-500" value={form.event_time} onChange={(e) => setForm((f) => ({ ...f, event_time: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="eventLocation" className="text-gray-700 font-medium">
                      Location
                    </Label>
                    <Input
                      id="eventLocation"
                      placeholder="Event location"
                      className="bg-white border-gray-300 focus:border-blue-500"
                       value={form.location}
                       onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventDescription" className="text-gray-700 font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="eventDescription"
                      placeholder="Event description"
                      className="bg-white border-gray-300 focus:border-blue-500"
                       value={form.description}
                       onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="recurring" className="text-gray-700 font-medium">
                      Recurring
                    </Label>
                     <Select value={form.recurring_frequency} onValueChange={(v) => setForm((f) => ({ ...f, recurring_frequency: v as Event["recurring_frequency"] }))}>
                       <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500">
                         <SelectValue placeholder="Select frequency" />
                       </SelectTrigger>
                       <SelectContent className="bg-white border-gray-200">
                         <SelectItem value="none" className="hover:bg-blue-50">
                           None
                         </SelectItem>
                         <SelectItem value="weekly" className="hover:bg-blue-50">
                           Weekly
                         </SelectItem>
                         <SelectItem value="monthly" className="hover:bg-blue-50">
                           Monthly
                         </SelectItem>
                         <SelectItem value="yearly" className="hover:bg-blue-50">
                           Yearly
                         </SelectItem>
                       </SelectContent>
                     </Select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                      onClick={() => setShowEventDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                       onClick={createEvent}
                    >
                      Create Event
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Events List */}
          <div className="space-y-3">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>

                      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.event_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.event_time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {event.location}
                        </Badge>
                        {event.recurring_frequency && event.recurring_frequency !== "none" && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">{event.recurring_frequency}</Badge>
                        )}
                        {event.notification_sent && (
                          <Badge className="bg-green-100 text-green-800 text-xs">Notified</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-red-600 bg-white hover:bg-red-50" onClick={() => deleteEvent(event.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {!event.notification_sent && (
                    <Button
                      onClick={() => sendNotification(event.id)}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      size="sm"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Reminder
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          {/* Send Custom Notification */}
          <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <Send className="w-4 h-4 mr-2" />
                Send Custom Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-2 border-gray-200 shadow-2xl max-w-md">
              <div className="bg-white p-2 rounded-lg">
                <DialogHeader className="bg-white">
                  <DialogTitle className="text-gray-900">Send Notification</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Send a custom message to church members
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 bg-white p-4 rounded-lg">
                  <div>
                    <Label htmlFor="notificationTitle" className="text-gray-700 font-medium">
                      Title
                    </Label>
                    <Input
                      id="notificationTitle"
                      placeholder="Notification title"
                      className="bg-white border-gray-300 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notificationMessage" className="text-gray-700 font-medium">
                      Message
                    </Label>
                    <Textarea
                      id="notificationMessage"
                      placeholder="Type your message here..."
                      rows={4}
                      className="bg-white border-gray-300 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="recipients" className="text-gray-700 font-medium">
                      Recipients
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-white border-gray-300 focus:border-green-500">
                        <SelectValue placeholder="Select recipients" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="all" className="hover:bg-green-50">
                          All Members
                        </SelectItem>
                        <SelectItem value="choir" className="hover:bg-green-50">
                          Choir Members
                        </SelectItem>
                        <SelectItem value="ushering" className="hover:bg-green-50">
                          Ushering Team
                        </SelectItem>
                        <SelectItem value="youth" className="hover:bg-green-50">
                          Youth Ministry
                        </SelectItem>
                        <SelectItem value="prayer" className="hover:bg-green-50">
                          Prayer Team
                        </SelectItem>
                        <SelectItem value="leaders" className="hover:bg-green-50">
                          Church Leaders
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                      onClick={() => setShowNotificationDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white"
                      onClick={() => setShowNotificationDialog(false)}
                    >
                      Send Now
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Notifications History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notification History</CardTitle>
              <CardDescription>Recent notifications sent to members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{notification.status}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mt-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{notification.recipients}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(notification.sentDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{notification.sentTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {notifications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No notifications sent yet</p>
                  <p className="text-sm">Use the button above to send your first notification</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
