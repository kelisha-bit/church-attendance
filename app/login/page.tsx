"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import LoginForm from "@/components/login-form"

export default function LoginPage() {
	const { user } = useAuth()
	const router = useRouter()

	useEffect(() => {
		if (user) {
			router.replace("/")
		}
	}, [user, router])

	return <LoginForm />
}


