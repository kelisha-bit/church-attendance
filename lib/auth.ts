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

export const authService = {
  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      if (!isSupabaseAvailable() || !supabase) {
        return { user: null, error: "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." }
      }

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
          name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || "User",
          role: data.user.user_metadata?.role || "Member",
        }
        return { user, error: null }
      }

      return { user: null, error: "Invalid credentials" }
    } catch (error) {
      return { user: null, error: "Sign in failed. Please try again." }
    }
  },

  async signUp(email: string, password: string, name: string): Promise<{ user: User | null; error: string | null }> {
    try {
      if (!isSupabaseAvailable() || !supabase) {
        return { user: null, error: "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." }
      }

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

      return { user: null, error: "Sign up failed. Please try again." }
    } catch (error) {
      return { user: null, error: "Sign up failed. Please try again." }
    }
  },

  async signOut(): Promise<void> {
    try {
      if (!isSupabaseAvailable() || !supabase) return
      await supabase.auth.signOut()
    } catch (error) {
      // no-op
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      if (!isSupabaseAvailable() || !supabase) {
        return null;
      }
  
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return null;
      }
  
      // Get the user's profile with role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name, role')
        .eq('id', user.id)
        .single();
  
      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }
  
      return {
        id: user.id,
        email: user.email || '',
        name: profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        role: (profile?.role as 'Admin' | 'Pastor' | 'Member') || 'Member',
        avatar: user.user_metadata?.avatar_url
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
}
