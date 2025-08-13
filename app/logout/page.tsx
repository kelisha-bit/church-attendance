"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function LogoutPage() {
  const { signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      try {
        await signOut()
      } finally {
        router.replace("/login")
      }
    })()
  }, [router, signOut])

  return null
}


