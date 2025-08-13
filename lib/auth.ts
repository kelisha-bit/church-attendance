import { supabase, isSupabaseAvailable } from "./supabase"

// Utilities to safely access localStorage in browser-only contexts
const isBrowser = typeof window !== "undefined"

function safeLocalStorageGet(key: string): string | null {
  if (!isBrowser) return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeLocalStorageSet(key: string, value: string): void {
  if (!isBrowser) return
  try {
    localStorage.setItem(key, value)
  } catch {}
}

function safeLocalStorageRemove(key: string): void {
  if (!isBrowser) return
  try {
    localStorage.removeItem(key)
  } catch {}
}

export interface User {
  id: string
  email: string
  name: string
  role: "Admin" | "Pastor" | "Member"
  avatar?: string
}

// Demo users for testing
const demoUsers: User[] = [
  {
    id: "demo-admin",
    email: "admin@church.com",
    name: "Church Administrator",
    role: "Admin",
  },
  {
    id: "demo-pastor",
    email: "pastor@church.com",
    name: "Pastor John",
    role: "Pastor",
  },
  {
    id: "demo-member",
    email: "member@church.com",
    name: "Mary Johnson",
    role: "Member",
  },
]

export const authService = {
  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      // First try demo mode authentication
      const demoUser = demoUsers.find((user) => user.email === email)
      if (demoUser && (password === "admin123" || password === "pastor123" || password === "member123")) {
        // Store demo user in localStorage (browser only)
        safeLocalStorageSet("demo_user", JSON.stringify(demoUser))
        safeLocalStorageSet("auth_mode", "demo")
        return { user: demoUser, error: null }
      }

      // Try Supabase authentication if available
      if (isSupabaseAvailable() && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          // Fallback to demo mode if Supabase fails
          if (demoUser) {
            safeLocalStorageSet("demo_user", JSON.stringify(demoUser))
            safeLocalStorageSet("auth_mode", "demo")
            return { user: demoUser, error: null }
          }
          return { user: null, error: error.message }
        }

        if (data.user) {
          const user: User = {
            id: data.user.id,
            email: data.user.email || "",
            name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || "User",
            role: data.user.user_metadata?.role || "Member",
          }
          safeLocalStorageSet("auth_mode", "supabase")
          return { user, error: null }
        }
      }

      // If no demo user found and Supabase not available
      return {
        user: null,
        error:
          "Invalid credentials. Try: admin@church.com/admin123, pastor@church.com/pastor123, or member@church.com/member123",
      }
    } catch (error) {
      // Final fallback to demo mode
      const demoUser = demoUsers.find((user) => user.email === email)
      if (demoUser && (password === "admin123" || password === "pastor123" || password === "member123")) {
        safeLocalStorageSet("demo_user", JSON.stringify(demoUser))
        safeLocalStorageSet("auth_mode", "demo")
        return { user: demoUser, error: null }
      }

      return {
        user: null,
        error: "Authentication failed. Using demo mode - try admin@church.com/admin123",
      }
    }
  },

  async signUp(email: string, password: string, name: string): Promise<{ user: User | null; error: string | null }> {
    try {
      if (isSupabaseAvailable() && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role: "Member",
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
            role: "Member",
          }
          return { user, error: null }
        }
      }

      // Demo mode signup
      const newUser: User = {
        id: `demo-${Date.now()}`,
        email,
        name,
        role: "Member",
      }
      safeLocalStorageSet("demo_user", JSON.stringify(newUser))
      safeLocalStorageSet("auth_mode", "demo")
      return { user: newUser, error: null }
    } catch (error) {
      return { user: null, error: "Sign up failed. Demo mode active." }
    }
  },

  async signOut(): Promise<void> {
    try {
      if (isSupabaseAvailable() && supabase) {
        await supabase.auth.signOut()
      }
      safeLocalStorageRemove("demo_user")
      safeLocalStorageRemove("auth_mode")
    } catch (error) {
      // Always clear local storage even if Supabase fails
      safeLocalStorageRemove("demo_user")
      safeLocalStorageRemove("auth_mode")
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      // Check demo mode first
      const authMode = safeLocalStorageGet("auth_mode")
      if (authMode === "demo") {
        const demoUser = safeLocalStorageGet("demo_user")
        if (demoUser) {
          return JSON.parse(demoUser)
        }
      }

      // Check Supabase
      if (isSupabaseAvailable() && supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          return {
            id: user.id,
            email: user.email || "",
            name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
            role: user.user_metadata?.role || "Member",
          }
        }
      }

      return null
    } catch (error) {
      return null
    }
  },

  getDemoUsers(): User[] {
    return demoUsers
  },

  isDemo(): boolean {
    return safeLocalStorageGet("auth_mode") === "demo"
  },
}
