"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Upload, Trash2, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface PhotoUploadProps {
  currentPhoto?: string
  memberName?: string
  onPhotoUpdate?: (photoUrl: string) => void
  onPhotoRemove?: () => void
  onClose?: () => void
}

export default function PhotoUpload({
  currentPhoto,
  memberName,
  onPhotoUpdate,
  onPhotoRemove,
  onClose,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhoto || null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB")
      return
    }

    try {
      setUploading(true)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreviewUrl(result)
      }
      reader.readAsDataURL(file)

      // In a real app, you would upload to Supabase Storage here
      // For demo purposes, we'll use the data URL
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      })

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onPhotoUpdate?.(dataUrl)
      toast.success("Photo uploaded successfully!")
    } catch (error) {
      console.error("Error uploading photo:", error)
      toast.error("Failed to upload photo")
    } finally {
      setUploading(false)
    }
  }

  const handleRemovePhoto = () => {
    setPreviewUrl(null)
    onPhotoRemove?.()
    toast.success("Photo removed successfully!")
  }

  return (
    <div className="bg-white p-4 rounded-lg">
      <Card className="w-full max-w-md mx-auto bg-white border-gray-200">
        <CardHeader className="bg-white">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Camera className="h-5 w-5" />
            {memberName ? `Photo for ${memberName}` : "Upload Photo"}
          </CardTitle>
          <CardDescription className="text-gray-600">
            Upload a profile photo. Supported formats: JPG, PNG, GIF (max 5MB)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 bg-white">
          {/* Demo Mode Alert */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              Demo mode: Photos are stored locally and will be lost on page refresh.
            </AlertDescription>
          </Alert>

          {/* Photo Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage src={previewUrl || "/placeholder.svg"} alt="Profile photo" />
                <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-4xl">
                  {memberName
                    ? memberName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "?"}
                </AvatarFallback>
              </Avatar>
              {previewUrl && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                  onClick={handleRemovePhoto}
                  disabled={uploading}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Upload Controls */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="photo-upload" className="text-gray-700 font-medium">
                Select Photo
              </Label>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="cursor-pointer bg-white border-gray-300 focus:border-amber-500"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={onClose}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                disabled={uploading || !previewUrl}
                onClick={() => {
                  if (previewUrl) {
                    onPhotoUpdate?.(previewUrl)
                  }
                  onClose?.()
                }}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Save Photo
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Upload Tips */}
          <div className="text-sm text-gray-600 space-y-1 bg-gray-50 p-3 rounded-lg">
            <p>
              <strong>Tips for best results:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Use a clear, well-lit photo</li>
              <li>Face should be clearly visible</li>
              <li>Square aspect ratio works best</li>
              <li>Keep file size under 5MB</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
