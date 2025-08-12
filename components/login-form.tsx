"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, AlertCircle, CheckCircle, User, Shield, Crown, Loader2 } from "lucide-react"
import Image from "next/image"

export default function LoginForm() {
  const { signIn, loading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const result = await signIn(email, password)
      if (result.success) {
        setSuccess("Login successful! Redirecting...")
      } else {
        setError(result.error || "Login failed. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    }
  }

  const handleDemoLogin = async (role: "admin" | "pastor" | "member") => {
    setError("")
    setSuccess("")

    const credentials = {
      admin: { email: "admin@church.com", password: "admin123" },
      pastor: { email: "pastor@church.com", password: "pastor123" },
      member: { email: "member@church.com", password: "member123" },
    }

    const { email: demoEmail, password: demoPassword } = credentials[role]
    setEmail(demoEmail)
    setPassword(demoPassword)

    try {
      const result = await signIn(demoEmail, demoPassword)
      if (result.success) {
        setSuccess(`Successfully logged in as ${role}!`)
      } else {
        setError(result.error || "Demo login failed. Please try again.")
      }
    } catch (err) {
      setError("Demo login failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-red-600 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Image
              src="/church-logo.png"
              alt="GreaterWorks City Church Logo"
              width={80}
              height={80}
              className="rounded-lg shadow-lg"
              priority
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to GreaterWorks City Church Management System
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Success Message */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Demo Mode Notice */}
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Demo Mode Active:</strong> Use the quick login buttons below or any credentials to access the
              system.
            </AlertDescription>
          </Alert>

          {/* Quick Demo Login Buttons */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 text-center">Quick Demo Access:</p>
            <div className="grid grid-cols-1 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin("admin")}
                disabled={loading}
                className="flex items-center justify-between p-3 h-auto hover:bg-red-50"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  <span>Admin Access</span>
                </div>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Full Access
                </Badge>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin("pastor")}
                disabled={loading}
                className="flex items-center justify-between p-3 h-auto hover:bg-purple-50"
              >
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-purple-600" />
                  <span>Pastor Access</span>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Leadership
                </Badge>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin("member")}
                disabled={loading}
                className="flex items-center justify-between p-3 h-auto hover:bg-blue-50"
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span>Member Access</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Standard
                </Badge>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pr-10 transition-all duration-200"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600 space-y-1">
            <p>Demo credentials work with any email/password combination</p>
            <p className="text-xs">Try: admin@church.com / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
