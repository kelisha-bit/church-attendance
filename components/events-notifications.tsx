"use client"

import { useState } from "react"
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

export default function EventsNotifications() {
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showNotificationDialog, setShowNotificationDialog] = useState(false)

  // Mock events data
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Sunday Service",
      date: "2024-01-21",
      time: "09:00 AM",
      location: "Main Sanctuary",
      description: "Weekly Sunday worship service",
      recurring: "Weekly",
      notificationSent: true,
    },
    {
      id: 2,
      title: "Prayer Meeting",
      date: "2024-01-17",
      time: "06:00 PM",
      location: "Prayer Hall",
      description: "Midweek prayer and intercession",
      recurring: "Weekly",
      notificationSent: true,
    },
    {
      id: 3,
      title: "Youth Conference",
      date: "2024-01-27",
      time: "10:00 AM",
      location: "Youth Center",
      description: "Annual youth conference with guest speakers",
      recurring: "None",
      notificationSent: false,
    },
  ])

  // Mock notifications data
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

  const sendNotification = (eventId: number) => {
    const event = events.find((e) => e.id === eventId)
    if (event) {
      const newNotification = {
        id: notifications.length + 1,
        title: `${event.title} Reminder`,
        message: `Reminder: ${event.title} on ${new Date(event.date).toLocaleDateString()} at ${event.time}. Location: ${event.location}`,
        recipients: "All Members",
        sentDate: new Date().toISOString().split("T")[0],
        sentTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        status: "Sent",
      }

      setNotifications([newNotification, ...notifications])
      setEvents(events.map((e) => (e.id === eventId ? { ...e, notificationSent: true } : e)))
    }
  }

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
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>Create a new church event</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="eventTitle">Event Title</Label>
                  <Input id="eventTitle" placeholder="Enter event title" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventDate">Date</Label>
                    <Input id="eventDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="eventTime">Time</Label>
                    <Input id="eventTime" type="time" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="eventLocation">Location</Label>
                  <Input id="eventLocation" placeholder="Event location" />
                </div>
                <div>
                  <Label htmlFor="eventDescription">Description</Label>
                  <Textarea id="eventDescription" placeholder="Event description" />
                </div>
                <div>
                  <Label htmlFor="recurring">Recurring</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowEventDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600"
                    onClick={() => setShowEventDialog(false)}
                  >
                    Create Event
                  </Button>
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
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {event.location}
                        </Badge>
                        {event.recurring !== "None" && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">{event.recurring}</Badge>
                        )}
                        {event.notificationSent && (
                          <Badge className="bg-green-100 text-green-800 text-xs">Notified</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {!event.notificationSent && (
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
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Send Notification</DialogTitle>
                <DialogDescription>Send a custom message to church members</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="notificationTitle">Title</Label>
                  <Input id="notificationTitle" placeholder="Notification title" />
                </div>
                <div>
                  <Label htmlFor="notificationMessage">Message</Label>
                  <Textarea id="notificationMessage" placeholder="Type your message here..." rows={4} />
                </div>
                <div>
                  <Label htmlFor="recipients">Recipients</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Members</SelectItem>
                      <SelectItem value="choir">Choir Members</SelectItem>
                      <SelectItem value="ushering">Ushering Team</SelectItem>
                      <SelectItem value="youth">Youth Ministry</SelectItem>
                      <SelectItem value="prayer">Prayer Team</SelectItem>
                      <SelectItem value="leaders">Church Leaders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setShowNotificationDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600"
                    onClick={() => setShowNotificationDialog(false)}
                  >
                    Send Now
                  </Button>
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
