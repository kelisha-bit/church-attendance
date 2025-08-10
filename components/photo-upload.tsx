"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Upload, Trash2, RotateCcw, Save, X, ImageIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PhotoUploadProps {
  currentPhoto: string
  memberName: string
  onPhotoUpdate: (photoUrl: string) => void
  onPhotoRemove: () => void
  onClose: () => void
}

export default function PhotoUpload({
  currentPhoto,
  memberName,
  onPhotoUpdate,
  onPhotoRemove,
  onClose,
}: PhotoUploadProps) {
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size must be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setPreviewPhoto(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsCapturing(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Unable to access camera. Please check permissions or use file upload instead.")
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0)

        const photoUrl = canvas.toDataURL("image/jpeg", 0.8)
        setPreviewPhoto(photoUrl)
        stopCamera()
      }
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsCapturing(false)
  }

  const savePhoto = () => {
    if (previewPhoto) {
      // In a real app, you would upload to a server or cloud storage
      // For now, we'll use the data URL directly
      onPhotoUpdate(previewPhoto)
    }
  }

  const resetPreview = () => {
    setPreviewPhoto(null)
    stopCamera()
  }

  const removePhoto = () => {
    onPhotoRemove()
    onClose()
  }

  return (
    <div className="space-y-6">
      {/* Current Photo Display */}
      <div className="text-center space-y-3">
        <Avatar className="w-24 h-24 mx-auto">
          <AvatarImage src={previewPhoto || currentPhoto} alt={memberName} />
          <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-2xl">
            {memberName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-800">{memberName}</h3>
          <p className="text-sm text-gray-600">{previewPhoto ? "New photo preview" : "Current photo"}</p>
        </div>
      </div>

      {/* Photo Upload Options */}
      {!previewPhoto && !isCapturing && (
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="camera">Take Photo</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <Alert>
              <ImageIcon className="h-4 w-4" />
              <AlertDescription>
                Upload a clear photo of the member. Supported formats: JPG, PNG. Maximum size: 5MB.
              </AlertDescription>
            </Alert>

            <div
              className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">Upload Photo</p>
              <p className="text-sm text-gray-500">Click here to select a file from your device</p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </div>
          </TabsContent>

          <TabsContent value="camera" className="space-y-4">
            <Alert>
              <Camera className="h-4 w-4" />
              <AlertDescription>
                Take a photo using your device's camera. Make sure the member is well-lit and centered.
              </AlertDescription>
            </Alert>

            <div className="text-center">
              <Button
                onClick={startCamera}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Camera className="w-4 h-4 mr-2" />
                Start Camera
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Camera View */}
      {isCapturing && (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
            <div className="absolute inset-0 border-2 border-white/30 rounded-lg pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white rounded-full"></div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={stopCamera} variant="outline" className="flex-1 bg-transparent">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={capturePhoto}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <Camera className="w-4 h-4 mr-2" />
              Capture
            </Button>
          </div>
        </div>
      )}

      {/* Photo Preview Actions */}
      {previewPhoto && (
        <div className="space-y-4">
          <Alert>
            <ImageIcon className="h-4 w-4" />
            <AlertDescription>
              Preview your new photo above. Click "Save Photo" to update the member's profile.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button onClick={resetPreview} variant="outline" className="flex-1 bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={savePhoto}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Photo
            </Button>
          </div>
        </div>
      )}

      {/* Remove Photo Option */}
      {!previewPhoto && !isCapturing && currentPhoto && !currentPhoto.includes("placeholder") && (
        <div className="border-t pt-4">
          <Button
            onClick={removePhoto}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remove Current Photo
          </Button>
        </div>
      )}

      {/* Close Button */}
      <div className="border-t pt-4">
        <Button onClick={onClose} variant="outline" className="w-full bg-transparent">
          Close
        </Button>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
