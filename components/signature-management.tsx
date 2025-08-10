"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Upload, Trash2, Edit3, Save, RotateCcw, Download, Eye, EyeOff, Pen, ImageIcon, FileText } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SignatureManagementProps {
  currentSignature: string | null
  onSignatureUpdate: (signature: string | null) => void
}

export default function SignatureManagement({ currentSignature, onSignatureUpdate }: SignatureManagementProps) {
  const [isDrawing, setIsDrawing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [pastorName, setPastorName] = useState(
    typeof window !== "undefined" ? localStorage.getItem("pastor-name") || "" : "",
  )
  const [pastorTitle, setPastorTitle] = useState(
    typeof window !== "undefined" ? localStorage.getItem("pastor-title") || "Senior Pastor" : "Senior Pastor",
  )
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.strokeStyle = "#1f2937"
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        // Set white background
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
  }, [])

  // Drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const rect = canvas.getBoundingClientRect()
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
        const x = clientX - rect.left
        const y = clientY - rect.top
        ctx.beginPath()
        ctx.moveTo(x, y)
      }
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    e.preventDefault()

    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const rect = canvas.getBoundingClientRect()
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
        const x = clientX - rect.left
        const y = clientY - rect.top
        ctx.lineTo(x, y)
        ctx.stroke()
      }
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const signatureData = canvas.toDataURL("image/png")
      localStorage.setItem("pastor-signature", signatureData)
      localStorage.setItem("pastor-name", pastorName)
      localStorage.setItem("pastor-title", pastorTitle)
      onSignatureUpdate(signatureData)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = canvasRef.current
          if (canvas) {
            const ctx = canvas.getContext("2d")
            if (ctx) {
              // Clear canvas
              ctx.fillStyle = "#ffffff"
              ctx.fillRect(0, 0, canvas.width, canvas.height)

              // Calculate scaling to fit signature in canvas
              const scale = Math.min(canvas.width / img.width, canvas.height / img.height, 1)
              const x = (canvas.width - img.width * scale) / 2
              const y = (canvas.height - img.height * scale) / 2

              ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
            }
          }
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const removeSignature = () => {
    localStorage.removeItem("pastor-signature")
    onSignatureUpdate(null)
    clearCanvas()
  }

  const downloadSignature = () => {
    if (currentSignature) {
      const link = document.createElement("a")
      link.download = `signature-${pastorName.replace(/\s+/g, "-")}.png`
      link.href = currentSignature
      link.click()
    }
  }

  return (
    <div className="space-y-6">
      {/* Pastor Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Pastor Information
          </CardTitle>
          <CardDescription>Update pastor details for certificate signing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pastorName">Pastor Name</Label>
            <Input
              id="pastorName"
              value={pastorName}
              onChange={(e) => setPastorName(e.target.value)}
              placeholder="Enter pastor's full name"
            />
          </div>
          <div>
            <Label htmlFor="pastorTitle">Title</Label>
            <Input
              id="pastorTitle"
              value={pastorTitle}
              onChange={(e) => setPastorTitle(e.target.value)}
              placeholder="e.g., Senior Pastor, Lead Pastor"
            />
          </div>
          <Button
            onClick={() => {
              localStorage.setItem("pastor-name", pastorName)
              localStorage.setItem("pastor-title", pastorTitle)
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Pastor Information
          </Button>
        </CardContent>
      </Card>

      {/* Current Signature Preview */}
      {currentSignature && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-600" />
              Current Signature
            </CardTitle>
            <CardDescription>Your active signature for certificates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center space-y-4">
                <img
                  src={currentSignature || "/placeholder.svg"}
                  alt="Current Signature"
                  className="max-h-24 max-w-full mx-auto object-contain"
                />
                <div className="space-y-1">
                  <p className="font-semibold text-gray-800">{pastorName || "Pastor Name"}</p>
                  <p className="text-sm text-gray-600">{pastorTitle}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setShowPreview(!showPreview)} variant="outline" className="flex-1 bg-transparent">
                {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPreview ? "Hide" : "Preview"} on Certificate
              </Button>
              <Button onClick={downloadSignature} variant="outline" className="flex-1 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={removeSignature}
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certificate Preview with Signature */}
      {showPreview && currentSignature && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Certificate Preview</CardTitle>
            <CardDescription>How your signature will appear on certificates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border-2 border-amber-200">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold text-amber-800">Sample Certificate</h3>
                <p className="text-gray-700">
                  This certificate is awarded to [Member Name] for outstanding attendance...
                </p>

                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-amber-300">
                  <div>
                    <div className="border-b border-gray-400 mb-2 pb-1 h-16 flex items-end justify-center">
                      <img
                        src={currentSignature || "/placeholder.svg"}
                        alt="Pastor's Signature"
                        className="max-h-12 max-w-32 object-contain"
                      />
                    </div>
                    <p className="text-sm text-gray-600 font-semibold">{pastorName}</p>
                    <p className="text-xs text-gray-500">{pastorTitle}</p>
                  </div>
                  <div>
                    <div className="border-b border-gray-400 mb-2 pb-1 h-16 flex items-end justify-center">
                      <p className="text-sm font-semibold">{new Date().toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm text-gray-600">Date Issued</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Signature Creation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-purple-600" />
            Create New Signature
          </CardTitle>
          <CardDescription>Draw your signature or upload an image</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="draw" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="draw">Draw Signature</TabsTrigger>
              <TabsTrigger value="upload">Upload Image</TabsTrigger>
            </TabsList>

            <TabsContent value="draw" className="space-y-4">
              <Alert>
                <Pen className="h-4 w-4" />
                <AlertDescription>
                  Use your finger on mobile or mouse on desktop to draw your signature below.
                </AlertDescription>
              </Alert>

              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4">
                <canvas
                  ref={canvasRef}
                  width={350}
                  height={150}
                  className="w-full max-w-full border border-gray-200 rounded cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  style={{ touchAction: "none" }}
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={clearCanvas} variant="outline" className="flex-1 bg-transparent">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
                <Button
                  onClick={saveSignature}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Signature
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <Alert>
                <ImageIcon className="h-4 w-4" />
                <AlertDescription>
                  Upload a clear image of your signature. Supported formats: PNG, JPG, JPEG. Maximum size: 2MB.
                </AlertDescription>
              </Alert>

              <div
                className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">Upload Signature Image</p>
                <p className="text-sm text-gray-500">Click here to select a file from your device</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={clearCanvas} variant="outline" className="flex-1 bg-transparent">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
                <Button
                  onClick={saveSignature}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Signature
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Signature Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Signature Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Badge className="bg-blue-500 text-white text-xs">TIP</Badge>
              <div>
                <p className="font-medium text-blue-800">Keep it Simple</p>
                <p className="text-blue-700">A clear, legible signature works best on certificates</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <Badge className="bg-green-500 text-white text-xs">BEST</Badge>
              <div>
                <p className="font-medium text-green-800">Use Dark Ink</p>
                <p className="text-green-700">Black or dark blue signatures show up clearly when printed</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <Badge className="bg-orange-500 text-white text-xs">NOTE</Badge>
              <div>
                <p className="font-medium text-orange-800">Size Matters</p>
                <p className="text-orange-700">The signature will be automatically resized to fit certificate format</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
