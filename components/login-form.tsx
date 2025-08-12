"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { Eye, EyeOff, Church, Mail, Lock, User, AlertCircle, Info } from "lucide-react"
import { demoCredentials } from "@/lib/auth"

export default function LoginForm() {
  const { signIn, signUp, loading, error } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")

  // Sign in form state
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  })

  // Sign up form state
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const validateSignIn = () => {
    const errors: Record<string, string> = {}

    if (!signInData.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(signInData.email)) {
      errors.email = "Please enter a valid email"
    }

    if (!signInData.password) {
      errors.password = "Password is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateSignUp = () => {
    const errors: Record<string, string> = {}

    if (!signUpData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!signUpData.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(signUpData.email)) {
      errors.email = "Please enter a valid email"
    }

    if (!signUpData.password) {
      errors.password = "Password is required"
    } else if (signUpData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateSignIn()) return

    const result = await signIn(signInData.email, signInData.password)
    if (!result.success) {
      console.error("Sign in failed:", result.error)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateSignUp()) return

    const result = await signUp(signUpData.email, signUpData.password, signUpData.name)
    if (!result.success) {
      console.error("Sign up failed:", result.error)
    }
  }

  const handleDemoLogin = async (role: "admin" | "pastor" | "member") => {
    const credentials = demoCredentials[role]
    setSignInData(credentials)
    await signIn(credentials.email, credentials.password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <Church className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Church Management</h1>
          <p className="text-gray-600">Welcome to your church community platform</p>
        </div>

        {/* Demo Credentials Info */}
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Demo Credentials:</strong>
            <div className="mt-2 space-y-1 text-sm">
              <div>Admin: admin@church.com / admin123</div>
              <div>Pastor: pastor@church.com / pastor123</div>
              <div>Member: member@church.com / member123</div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Quick Demo Login Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin("admin")}
            disabled={loading}
            className="text-xs"
          >
            Admin Demo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin("pastor")}
            disabled={loading}
            className="text-xs"
          >
            Pastor Demo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin("member")}
            disabled={loading}
            className="text-xs"
          >
            Member Demo
          </Button>
        </div>

        {/* Auth Forms */}
        <Card className="shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader className="pb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>

            {/* Error Display */}
            {error && (
              <CardContent className="pt-0">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </CardContent>
            )}

            {/* Sign In Tab */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                    {formErrors.email && <p className="text-sm text-red-600">{formErrors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        className="pl-10 pr-10"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {formErrors.password && <p className="text-sm text-red-600">{formErrors.password}</p>}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={signUpData.name}
                        onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                    {formErrors.name && <p className="text-sm text-red-600">{formErrors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                    {formErrors.email && <p className="text-sm text-red-600">{formErrors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        className="pl-10 pr-10"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {formErrors.password && <p className="text-sm text-red-600">{formErrors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                    {formErrors.confirmPassword && <p className="text-sm text-red-600">{formErrors.confirmPassword}</p>}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>© 2024 Church Management System</p>
          <p>Secure • Reliable • Community-Focused</p>
        </div>
      </div>
    </div>
  )
}
