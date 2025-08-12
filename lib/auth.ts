import { supabase, isSupabaseAvailable } from "./supabase"

export interface User {
  id: string
  email: string
  name?: string
  role?: "admin" | "member" | "visitor"
  created_at: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

// Mock users for demo mode
const mockUsers = [
  {
    id: "1",
    email: "admin@church.com",
    password: "admin123",
    name: "Church Administrator",
    role: "admin" as const,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    email: "pastor@church.com",
    password: "pastor123",
    name: "Pastor John",
    role: "admin" as const,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    email: "member@church.com",
    password: "member123",
    name: "Church Member",
    role: "member" as const,
    created_at: new Date().toISOString(),
  },
]

// Authentication functions
export const authService = {
  // Sign in with email and password
  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    if (isSupabaseAvailable() && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          return { user: null, error: error.message }
        }

        if (data.user) {
          const user: User = {
            id: data.user.id,
            email: data.user.email || "",
            name: data.user.user_metadata?.name || data.user.email?.split("@")[0],
            role: data.user.user_metadata?.role || "member",
            created_at: data.user.created_at || new Date().toISOString(),
          }
          return { user, error: null }
        }

        return { user: null, error: "Authentication failed" }
      } catch (error) {
        return { user: null, error: "Network error occurred" }
      }
    } else {
      // Mock authentication for demo mode
      const mockUser = mockUsers.find((u) => u.email === email && u.password === password)
      if (mockUser) {
        const user: User = {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
          created_at: mockUser.created_at,
        }
        // Store in localStorage for demo mode
        localStorage.setItem("demo_user", JSON.stringify(user))
        return { user, error: null }
      } else {
        return { user: null, error: "Invalid email or password" }
      }
    }
  },

  // Sign up new user
  async signUp(email: string, password: string, name: string): Promise<{ user: User | null; error: string | null }> {
    if (isSupabaseAvailable() && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role: "member",
            },
          },
        })

        if (error) {
          return { user: null, error: error.message }
        }

        if (data.user) {
          const user: User = {
            id: data.user.id,
            email: data.user.email || "",
            name: name,
            role: "member",
            created_at: data.user.created_at || new Date().toISOString(),
          }
          return { user, error: null }
        }

        return { user: null, error: "Registration failed" }
      } catch (error) {
        return { user: null, error: "Network error occurred" }
      }
    } else {
      // Mock registration for demo mode
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: "member",
        created_at: new Date().toISOString(),
      }
      localStorage.setItem("demo_user", JSON.stringify(newUser))
      return { user: newUser, error: null }
    }
  },

  // Sign out
  async signOut(): Promise<{ error: string | null }> {
    if (isSupabaseAvailable() && supabase) {
      try {
        const { error } = await supabase.auth.signOut()
        return { error: error?.message || null }
      } catch (error) {
        return { error: "Sign out failed" }
      }
    } else {
      // Clear demo mode storage
      localStorage.removeItem("demo_user")
      return { error: null }
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    if (isSupabaseAvailable() && supabase) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          return {
            id: user.id,
            email: user.email || "",
            name: user.user_metadata?.name || user.email?.split("@")[0],
            role: user.user_metadata?.role || "member",
            created_at: user.created_at || new Date().toISOString(),
          }
        }
        return null
      } catch (error) {
        return null
      }
    } else {
      // Get from localStorage for demo mode
      const storedUser = localStorage.getItem("demo_user")
      return storedUser ? JSON.parse(storedUser) : null
    }
  },

  // Listen to auth changes
  onAuthStateChange(callback: (user: User | null) => void) {
    if (isSupabaseAvailable() && supabase) {
      return supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          const user: User = {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || session.user.email?.split("@")[0],
            role: session.user.user_metadata?.role || "member",
            created_at: session.user.created_at || new Date().toISOString(),
          }
          callback(user)
        } else {
          callback(null)
        }
      })
    } else {
      // For demo mode, we'll check localStorage periodically
      const checkAuth = () => {
        const storedUser = localStorage.getItem("demo_user")
        callback(storedUser ? JSON.parse(storedUser) : null)
      }

      // Initial check
      checkAuth()

      // Return a cleanup function
      return {
        data: { subscription: { unsubscribe: () => {} } },
      }
    }
  },
}

// Demo credentials for easy testing
export const demoCredentials = {
  admin: { email: "admin@church.com", password: "admin123" },
  pastor: { email: "pastor@church.com", password: "pastor123" },
  member: { email: "member@church.com", password: "member123" },
}
