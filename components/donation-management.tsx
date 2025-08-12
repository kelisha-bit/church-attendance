"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  DollarSign,
  TrendingUp,
  Users,
  Download,
  Receipt,
  Edit,
  Trash2,
  AlertCircle,
  Loader2,
  CreditCard,
  Banknote,
  Smartphone,
  Building,
  FileText,
  Database,
} from "lucide-react"
import { supabase, isSupabaseAvailable, mockMembers, mockDonations, type Member, type Donation } from "@/lib/supabase"
import { toast } from "sonner"

export default function DonationManagement() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedMethod, setSelectedMethod] = useState("all")
  const [dateRange, setDateRange] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null)
  const [databaseError, setDatabaseError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    member_id: "none",
    donor_name: "",
    donor_phone: "",
    donor_email: "",
    amount: "",
    donation_type: "",
    payment_method: "",
    donation_date: new Date().toISOString().split("T")[0],
    notes: "",
  })

  const donationTypes = [
    "Tithe",
    "Offering",
    "Building Fund",
    "Missions",
    "Special Offering",
    "Thanksgiving",
    "Seed Offering",
    "First Fruit",
    "Other",
  ]

  const paymentMethods = ["Cash", "Mobile Money", "Bank Transfer", "Cheque", "Card Payment", "Online Transfer"]

  // Load data with better error handling
  const loadData = async () => {
    try {
      setLoading(true)
      setDatabaseError(null)

      if (!isSupabaseAvailable()) {
        console.log("Supabase not available, using mock data")
        setDonations(mockDonations)
        setMembers(mockMembers)
        return
      }

      // First try to load members (this table should exist)
      try {
        const { data: membersData, error: membersError } = await supabase!
          .from("members")
          .select("*")
          .eq("status", "Active")
          .order("name")

        if (membersError) {
          console.warn("Members table error:", membersError)
          setMembers(mockMembers)
        } else {
          setMembers(membersData || [])
        }
      } catch (membersErr) {
        console.warn("Error loading members:", membersErr)
        setMembers(mockMembers)
      }

      // Try to load donations with better error handling
      try {
        const { data: donationsData, error: donationsError } = await supabase!
          .from("donations")
          .select("*")
          .order("created_at", { ascending: false })

        if (donationsError) {
          console.warn("Donations table error:", donationsError)

          // Check if it's a table not found error
          if (
            donationsError.message?.includes("does not exist") ||
            donationsError.message?.includes("not found") ||
            donationsError.code === "42P01"
          ) {
            setDatabaseError("donations_table_missing")
          } else {
            setDatabaseError("donations_query_error")
          }

          setDonations(mockDonations)
        } else {
          setDonations(donationsData || [])
        }
      } catch (donationsErr: any) {
        console.warn("Error loading donations:", donationsErr)

        if (donationsErr.message?.includes("does not exist") || donationsErr.message?.includes("not found")) {
          setDatabaseError("donations_table_missing")
        } else {
          setDatabaseError("donations_query_error")
        }

        setDonations(mockDonations)
      }
    } catch (error) {
      console.error("General error loading data:", error)
      setDonations(mockDonations)
      setMembers(mockMembers)
      setDatabaseError("general_error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Generate receipt number
  const generateReceiptNumber = () => {
    const prefix = "RCP"
    const timestamp = Date.now().toString().slice(-6)
    return `${prefix}${timestamp}`
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.donor_name || !formData.amount || !formData.donation_type || !formData.payment_method) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setSaving(true)
      const receiptNumber = editingDonation?.receipt_number || generateReceiptNumber()

      const donationData = {
        member_id: formData.member_id === "none" ? null : formData.member_id,
        donor_name: formData.donor_name,
        donor_phone: formData.donor_phone || null,
        donor_email: formData.donor_email || null,
        amount: Number.parseFloat(formData.amount),
        donation_type: formData.donation_type,
        payment_method: formData.payment_method,
        donation_date: formData.donation_date,
        notes: formData.notes || null,
        receipt_number: receiptNumber,
      }

      if (isSupabaseAvailable() && supabase && !databaseError) {
        try {
          if (editingDonation) {
            const { error } = await supabase.from("donations").update(donationData).eq("id", editingDonation.id)

            if (error) throw error
            toast.success("Donation updated successfully!")
          } else {
            const { data, error } = await supabase.from("donations").insert([donationData]).select()

            if (error) throw error
            toast.success("Donation recorded successfully!")
          }
        } catch (dbError: any) {
          console.warn("Database error, falling back to demo mode:", dbError)
          // Fall back to demo mode
          handleDemoModeSubmit(donationData, receiptNumber)
        }
      } else {
        // Demo mode
        handleDemoModeSubmit(donationData, receiptNumber)
      }

      resetForm()
      setShowAddDialog(false)
      setEditingDonation(null)

      if (isSupabaseAvailable() && !databaseError) {
        loadData()
      }
    } catch (error) {
      console.error("Error saving donation:", error)
      toast.error("Failed to save donation")
    } finally {
      setSaving(false)
    }
  }

  // Handle demo mode submission
  const handleDemoModeSubmit = (donationData: any, receiptNumber: string) => {
    const newDonation: Donation = {
      id: Date.now().toString(),
      ...donationData,
      created_at: new Date().toISOString(),
    }

    if (editingDonation) {
      setDonations((prev) =>
        prev.map((d) => (d.id === editingDonation.id ? { ...newDonation, id: editingDonation.id } : d)),
      )
      toast.success("Donation updated successfully! (Demo mode)")
    } else {
      setDonations((prev) => [newDonation, ...prev])
      toast.success("Donation recorded successfully! (Demo mode)")
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      member_id: "none",
      donor_name: "",
      donor_phone: "",
      donor_email: "",
      amount: "",
      donation_type: "",
      payment_method: "",
      donation_date: new Date().toISOString().split("T")[0],
      notes: "",
    })
  }

  // Handle edit
  const handleEdit = (donation: Donation) => {
    setFormData({
      member_id: donation.member_id || "none",
      donor_name: donation.donor_name,
      donor_phone: donation.donor_phone || "",
      donor_email: donation.donor_email || "",
      amount: donation.amount.toString(),
      donation_type: donation.donation_type,
      payment_method: donation.payment_method,
      donation_date: donation.donation_date,
      notes: donation.notes || "",
    })
    setEditingDonation(donation)
    setShowAddDialog(true)
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      if (isSupabaseAvailable() && supabase && !databaseError) {
        const { error } = await supabase.from("donations").delete().eq("id", id)
        if (error) {
          console.warn("Database delete error, using demo mode:", error)
          setDonations((prev) => prev.filter((d) => d.id !== id))
          toast.success("Donation deleted successfully! (Demo mode)")
        } else {
          toast.success("Donation deleted successfully!")
        }
      } else {
        setDonations((prev) => prev.filter((d) => d.id !== id))
        toast.success("Donation deleted successfully! (Demo mode)")
      }

      if (isSupabaseAvailable() && !databaseError) {
        loadData()
      }
    } catch (error) {
      console.error("Error deleting donation:", error)
      toast.error("Failed to delete donation")
    }
  }

  // Handle member selection
  const handleMemberSelect = (memberId: string) => {
    if (memberId === "none") {
      setFormData((prev) => ({
        ...prev,
        member_id: "",
        donor_name: "",
        donor_phone: "",
        donor_email: "",
      }))
    } else {
      const member = members.find((m) => m.id === memberId)
      if (member) {
        setFormData((prev) => ({
          ...prev,
          member_id: memberId,
          donor_name: member.name,
          donor_phone: member.phone,
          donor_email: member.email || "",
        }))
      }
    }
  }

  // Create donations table
  const createDonationsTable = async () => {
    if (!isSupabaseAvailable() || !supabase) {
      toast.error("Supabase is not configured")
      return
    }

    try {
      setLoading(true)

      // Execute the SQL to create the donations table
      const { error } = await supabase.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS donations (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            member_id UUID REFERENCES members(id) ON DELETE SET NULL,
            donor_name VARCHAR(255) NOT NULL,
            donor_phone VARCHAR(20),
            donor_email VARCHAR(255),
            amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
            donation_type VARCHAR(100) NOT NULL,
            payment_method VARCHAR(50) NOT NULL,
            donation_date DATE NOT NULL,
            notes TEXT,
            receipt_number VARCHAR(50) NOT NULL UNIQUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          CREATE INDEX IF NOT EXISTS idx_donations_member_id ON donations(member_id);
          CREATE INDEX IF NOT EXISTS idx_donations_date ON donations(donation_date);
          CREATE INDEX IF NOT EXISTS idx_donations_type ON donations(donation_type);
          CREATE INDEX IF NOT EXISTS idx_donations_receipt ON donations(receipt_number);
        `,
      })

      if (error) {
        console.error("Error creating table:", error)
        toast.error("Failed to create donations table. Please run the SQL script manually.")
      } else {
        toast.success("Donations table created successfully!")
        setDatabaseError(null)
        loadData()
      }
    } catch (error) {
      console.error("Error creating donations table:", error)
      toast.error("Failed to create donations table")
    } finally {
      setLoading(false)
    }
  }

  // Filter donations
  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      donation.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.receipt_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donation_type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedType === "all" || donation.donation_type === selectedType
    const matchesMethod = selectedMethod === "all" || donation.payment_method === selectedMethod

    let matchesDate = true
    if (dateRange !== "all") {
      const donationDate = new Date(donation.donation_date)
      const today = new Date()

      switch (dateRange) {
        case "today":
          matchesDate = donationDate.toDateString() === today.toDateString()
          break
        case "week":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = donationDate >= weekAgo
          break
        case "month":
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = donationDate >= monthAgo
          break
      }
    }

    return matchesSearch && matchesType && matchesMethod && matchesDate
  })

  // Calculate statistics
  const totalAmount = filteredDonations.reduce((sum, d) => sum + d.amount, 0)
  const averageDonation = filteredDonations.length > 0 ? totalAmount / filteredDonations.length : 0
  const donationCount = filteredDonations.length

  // Get top donation types
  const typeStats = donationTypes
    .map((type) => ({
      type,
      count: filteredDonations.filter((d) => d.donation_type === type).length,
      amount: filteredDonations.filter((d) => d.donation_type === type).reduce((sum, d) => sum + d.amount, 0),
    }))
    .filter((stat) => stat.count > 0)
    .sort((a, b) => b.amount - a.amount)

  // Export donations
  const exportDonations = () => {
    const csvContent = [
      ["Receipt Number", "Donor Name", "Amount (GHS)", "Type", "Payment Method", "Date", "Notes"],
      ...filteredDonations.map((d) => [
        d.receipt_number,
        d.donor_name,
        d.amount.toFixed(2),
        d.donation_type,
        d.payment_method,
        new Date(d.donation_date).toLocaleDateString(),
        d.notes || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `donations-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Donations exported successfully!")
  }

  // Generate receipt
  const generateReceipt = (donation: Donation) => {
    const receiptContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Donation Receipt - ${donation.receipt_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #d97706; padding-bottom: 20px; }
            .logo { color: #d97706; font-size: 24px; font-weight: bold; }
            .receipt-details { margin: 20px 0; }
            .amount { font-size: 24px; font-weight: bold; color: #d97706; }
            .footer { margin-top: 40px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">⛪ GreaterWorks City Church</div>
            <h1>Donation Receipt</h1>
            <p>Accra, Ghana</p>
          </div>
          
          <div class="receipt-details">
            <p><strong>Receipt Number:</strong> ${donation.receipt_number}</p>
            <p><strong>Date:</strong> ${new Date(donation.donation_date).toLocaleDateString()}</p>
            <p><strong>Donor:</strong> ${donation.donor_name}</p>
            ${donation.donor_phone ? `<p><strong>Phone:</strong> ${donation.donor_phone}</p>` : ""}
            <p><strong>Donation Type:</strong> ${donation.donation_type}</p>
            <p><strong>Payment Method:</strong> ${donation.payment_method}</p>
            <p><strong>Amount:</strong> <span class="amount">GHS ${donation.amount.toFixed(2)}</span></p>
            ${donation.notes ? `<p><strong>Notes:</strong> ${donation.notes}</p>` : ""}
          </div>

          <div class="footer">
            <p>Thank you for your generous donation!</p>
            <p>"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7</p>
            <p>This receipt was generated on ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `

    const blob = new Blob([receiptContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `receipt-${donation.receipt_number}.html`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Receipt generated successfully!")
  }

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
          <h2 className="text-2xl font-bold text-gray-800">Donation Management</h2>
          <p className="text-gray-600">Track and manage church donations and offerings</p>
        </div>
      </div>

      {/* Database Error Alert */}
      {databaseError === "donations_table_missing" && (
        <Alert className="border-orange-200 bg-orange-50">
          <Database className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="space-y-2">
              <p>The donations table doesn't exist in your database yet.</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    toast.info(
                      "Please run the SQL script in scripts/003_create_donations_table.sql in your Supabase dashboard",
                    )
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Database className="w-4 h-4 mr-2" />
                  View Setup Instructions
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDatabaseError(null)}
                  className="bg-white hover:bg-gray-50"
                >
                  Continue in Demo Mode
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Demo Mode Alert */}
      {(!isSupabaseAvailable() || databaseError) && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {!isSupabaseAvailable()
              ? "Demo mode: Add your Supabase environment variables to enable database functionality."
              : "Running in demo mode due to database configuration issues. Data will not be persisted."}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-200" />
            <div className="text-2xl font-bold">GHS {totalAmount.toFixed(2)}</div>
            <div className="text-sm text-green-100">Total Donations</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4 text-center">
            <Receipt className="w-8 h-8 mx-auto mb-2 text-blue-200" />
            <div className="text-2xl font-bold">{donationCount}</div>
            <div className="text-sm text-blue-100">Total Records</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-200" />
            <div className="text-2xl font-bold">GHS {averageDonation.toFixed(2)}</div>
            <div className="text-sm text-purple-100">Average Donation</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-orange-200" />
            <div className="text-2xl font-bold">{new Set(filteredDonations.map((d) => d.donor_name)).size}</div>
            <div className="text-sm text-orange-100">Unique Donors</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="donations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="donations" className="space-y-4">
          {/* Controls */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by donor name, receipt number, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {donationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <Dialog
                  open={showAddDialog}
                  onOpenChange={(open) => {
                    setShowAddDialog(open)
                    if (!open) {
                      setEditingDonation(null)
                      resetForm()
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Record Donation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white border-2 border-gray-200 shadow-2xl max-w-md max-h-[90vh] overflow-y-auto">
                    <div className="bg-white p-2 rounded-lg">
                      <DialogHeader className="bg-white">
                        <DialogTitle className="text-gray-900">
                          {editingDonation ? "Edit Donation" : "Record New Donation"}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600">
                          {editingDonation ? "Update donation details" : "Enter donation information"}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg">
                        <div>
                          <Label htmlFor="member" className="text-gray-700 font-medium">
                            Select Member (Optional)
                          </Label>
                          <Select value={formData.member_id} onValueChange={handleMemberSelect}>
                            <SelectTrigger className="bg-white border-gray-300 focus:border-green-500">
                              <SelectValue placeholder="Choose a member or leave blank for non-member" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200">
                              <SelectItem value="none" className="hover:bg-green-50">
                                Non-member / Anonymous
                              </SelectItem>
                              {members.map((member) => (
                                <SelectItem key={member.id} value={member.id} className="hover:bg-green-50">
                                  {member.name} - {member.department}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="donor_name" className="text-gray-700 font-medium">
                            Donor Name *
                          </Label>
                          <Input
                            id="donor_name"
                            value={formData.donor_name}
                            onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                            placeholder="Enter donor name"
                            required
                            className="bg-white border-gray-300 focus:border-green-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="donor_phone" className="text-gray-700 font-medium">
                              Phone Number
                            </Label>
                            <Input
                              id="donor_phone"
                              value={formData.donor_phone}
                              onChange={(e) => setFormData({ ...formData, donor_phone: e.target.value })}
                              placeholder="+233 XX XXX XXXX"
                              className="bg-white border-gray-300 focus:border-green-500"
                            />
                          </div>
                          <div>
                            <Label htmlFor="donor_email" className="text-gray-700 font-medium">
                              Email Address
                            </Label>
                            <Input
                              id="donor_email"
                              type="email"
                              value={formData.donor_email}
                              onChange={(e) => setFormData({ ...formData, donor_email: e.target.value })}
                              placeholder="email@example.com"
                              className="bg-white border-gray-300 focus:border-green-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="amount" className="text-gray-700 font-medium">
                              Amount (GHS) *
                            </Label>
                            <Input
                              id="amount"
                              type="number"
                              step="0.01"
                              min="0"
                              value={formData.amount}
                              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                              placeholder="0.00"
                              required
                              className="bg-white border-gray-300 focus:border-green-500"
                            />
                          </div>
                          <div>
                            <Label htmlFor="donation_date" className="text-gray-700 font-medium">
                              Date *
                            </Label>
                            <Input
                              id="donation_date"
                              type="date"
                              value={formData.donation_date}
                              onChange={(e) => setFormData({ ...formData, donation_date: e.target.value })}
                              required
                              className="bg-white border-gray-300 focus:border-green-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="donation_type" className="text-gray-700 font-medium">
                              Donation Type *
                            </Label>
                            <Select
                              value={formData.donation_type}
                              onValueChange={(value) => setFormData({ ...formData, donation_type: value })}
                            >
                              <SelectTrigger className="bg-white border-gray-300 focus:border-green-500">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-200">
                                {donationTypes.map((type) => (
                                  <SelectItem key={type} value={type} className="hover:bg-green-50">
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="payment_method" className="text-gray-700 font-medium">
                              Payment Method *
                            </Label>
                            <Select
                              value={formData.payment_method}
                              onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                            >
                              <SelectTrigger className="bg-white border-gray-300 focus:border-green-500">
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-200">
                                {paymentMethods.map((method) => (
                                  <SelectItem key={method} value={method} className="hover:bg-green-50">
                                    {method}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                            placeholder="Additional notes..."
                            className="bg-white border-gray-300 focus:border-green-500"
                          />
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                            onClick={() => setShowAddDialog(false)}
                            disabled={saving}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white"
                            disabled={saving}
                          >
                            {saving ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                {editingDonation ? "Updating..." : "Recording..."}
                              </>
                            ) : editingDonation ? (
                              "Update Donation"
                            ) : (
                              "Record Donation"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={exportDonations}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Donations List */}
          <div className="space-y-3">
            {filteredDonations.map((donation) => (
              <Card key={donation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-800">{donation.donor_name}</h3>
                            <p className="text-sm text-gray-600">Receipt: {donation.receipt_number}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600">GHS {donation.amount.toFixed(2)}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(donation.donation_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className="bg-blue-100 text-blue-800 text-xs">{donation.donation_type}</Badge>
                          <Badge variant="outline" className="text-xs">
                            {donation.payment_method === "Cash" && <Banknote className="w-3 h-3 mr-1" />}
                            {donation.payment_method === "Mobile Money" && <Smartphone className="w-3 h-3 mr-1" />}
                            {donation.payment_method === "Bank Transfer" && <Building className="w-3 h-3 mr-1" />}
                            {donation.payment_method === "Card Payment" && <CreditCard className="w-3 h-3 mr-1" />}
                            {donation.payment_method}
                          </Badge>
                        </div>

                        {donation.donor_phone && <p className="text-sm text-gray-600">📞 {donation.donor_phone}</p>}

                        {donation.notes && <p className="text-sm text-gray-600 mt-2 italic">"{donation.notes}"</p>}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateReceipt(donation)}
                        className="bg-white hover:bg-blue-50 text-blue-600"
                      >
                        <Receipt className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(donation)}
                        className="bg-white hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="bg-white hover:bg-red-50 text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white border-2 border-gray-200">
                          <AlertDialogHeader className="bg-white">
                            <AlertDialogTitle className="text-gray-900">Delete Donation</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600">
                              Are you sure you want to delete this donation record? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="bg-white">
                            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(donation.id)}
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
            ))}

            {filteredDonations.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <DollarSign className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No donations found</h3>
                  <p className="text-gray-600">Try adjusting your search terms or filters.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Donation Types Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Donation Types Analysis</CardTitle>
              <CardDescription>Breakdown by donation categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {typeStats.map((stat, index) => (
                <div key={stat.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{stat.type}</h3>
                      <p className="text-sm text-gray-600">{stat.count} donations</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">GHS {stat.amount.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      {totalAmount > 0 ? ((stat.amount / totalAmount) * 100).toFixed(1) : 0}% of total
                    </div>
                  </div>
                </div>
              ))}
              {typeStats.length === 0 && <p className="text-center text-gray-500 py-4">No donation data available</p>}
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Methods</CardTitle>
              <CardDescription>How donations are received</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {paymentMethods.map((method) => {
                const methodDonations = filteredDonations.filter((d) => d.payment_method === method)
                const methodAmount = methodDonations.reduce((sum, d) => sum + d.amount, 0)
                const methodCount = methodDonations.length

                if (methodCount === 0) return null

                return (
                  <div key={method} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {method === "Cash" && <Banknote className="w-5 h-5 text-green-600" />}
                      {method === "Mobile Money" && <Smartphone className="w-5 h-5 text-blue-600" />}
                      {method === "Bank Transfer" && <Building className="w-5 h-5 text-purple-600" />}
                      {method === "Card Payment" && <CreditCard className="w-5 h-5 text-orange-600" />}
                      {!["Cash", "Mobile Money", "Bank Transfer", "Card Payment"].includes(method) && (
                        <DollarSign className="w-5 h-5 text-gray-600" />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-800">{method}</h3>
                        <p className="text-sm text-gray-600">{methodCount} transactions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">GHS {methodAmount.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">
                        {totalAmount > 0 ? ((methodAmount / totalAmount) * 100).toFixed(1) : 0}% of total
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generate Reports</CardTitle>
              <CardDescription>Create detailed donation reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={exportDonations}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Donation Summary Report
              </Button>

              <Button
                onClick={() => {
                  const memberDonations = filteredDonations.filter((d) => d.member_id)
                  const csvContent = [
                    ["Member Name", "Total Donations", "Number of Donations", "Average Donation"],
                    ...Object.entries(
                      memberDonations.reduce(
                        (acc, d) => {
                          if (!acc[d.donor_name]) {
                            acc[d.donor_name] = { total: 0, count: 0 }
                          }
                          acc[d.donor_name].total += d.amount
                          acc[d.donor_name].count += 1
                          return acc
                        },
                        {} as Record<string, { total: number; count: number }>,
                      ),
                    ).map(([name, stats]) => [
                      name,
                      stats.total.toFixed(2),
                      stats.count.toString(),
                      (stats.total / stats.count).toFixed(2),
                    ]),
                  ]
                    .map((row) => row.join(","))
                    .join("\n")

                  const blob = new Blob([csvContent], { type: "text/csv" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = `member-donations-${new Date().toISOString().split("T")[0]}.csv`
                  a.click()
                  URL.revokeObjectURL(url)
                  toast.success("Member donations report exported!")
                }}
                variant="outline"
                className="w-full bg-white hover:bg-gray-50"
              >
                <Users className="w-4 h-4 mr-2" />
                Generate Member Donations Report
              </Button>

              <Button
                onClick={() => {
                  const typeReport = typeStats.map((stat) => [
                    stat.type,
                    stat.amount.toFixed(2),
                    stat.count.toString(),
                    totalAmount > 0 ? ((stat.amount / totalAmount) * 100).toFixed(1) + "%" : "0%",
                  ])

                  const csvContent = [
                    ["Donation Type", "Total Amount", "Number of Donations", "Percentage of Total"],
                    ...typeReport,
                  ]
                    .map((row) => row.join(","))
                    .join("\n")

                  const blob = new Blob([csvContent], { type: "text/csv" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = `donation-types-${new Date().toISOString().split("T")[0]}.csv`
                  a.click()
                  URL.revokeObjectURL(url)
                  toast.success("Donation types report exported!")
                }}
                variant="outline"
                className="w-full bg-white hover:bg-gray-50"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Generate Donation Types Report
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
