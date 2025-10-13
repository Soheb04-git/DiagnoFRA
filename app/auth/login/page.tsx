
"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AuthCard } from "@/components/auth/auth-card"

export default function LoginPage() {
  const [show, setShow] = useState(false)
  const router = useRouter()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = form.get("email")
    const password = form.get("password")

    // ✅ Demo credentials
    if (email === "demo@fra.com" && password === "fra123") {
      localStorage.setItem("isLoggedIn", "true")
      router.push("/dashboard") // redirect to dashboard
      return
    }

    // ✅ Check registered users in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const found = users.find((u: any) => u.email === email && u.password === password)

    if (found) {
      localStorage.setItem("isLoggedIn", "true")
      router.push("/")
    } else {
      alert("Invalid credentials. Try demo: demo@fra.com / fra123")
    }
  }

  return (
    <AuthCard
      title="Sign in"
      description="Access your DiagnoFRA dashboard."
      footer={
        <>
          <span>
            New here?{" "}
            <Link href="/auth/register" className="text-foreground underline underline-offset-2">
              Create an account
            </Link>
          </span>
          <Link href="/auth/forgot-password" className="text-foreground underline underline-offset-2">
            Forgot password?
          </Link>
        </>
      }
    >
      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@company.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="text-xs text-muted-foreground underline underline-offset-2"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
          <Input id="password" name="password" type={show ? "text" : "password"} required />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox id="remember" />
            <span>Remember me</span>
          </label>
          <Link href="/auth/forgot-password" className="text-sm text-foreground underline underline-offset-2">
            Forgot?
          </Link>
        </div>
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>

      <div className="mt-6 p-4 border rounded-lg bg-muted/20 text-center">
        <h3 className="text-sm font-semibold text-foreground mb-2">Demo Credentials</h3>
        <p className="text-sm text-muted-foreground">
          <strong>Email:</strong> demo@fra.com
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Password:</strong> fra123
        </p>
        <p className="text-xs text-muted-foreground mt-2 italic">
          Use these to explore the dashboard without registration.
        </p>
      </div>

    </AuthCard>
  )
}
