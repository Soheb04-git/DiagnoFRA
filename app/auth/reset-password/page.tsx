"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCard } from "@/components/auth/auth-card"

export default function ResetPasswordPage() {
  const [show, setShow] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log("DiagnoFRA reset password submit")
  }

  return (
    <>
      <AuthCard title="Reset password" description="Choose a new password to secure your account." showSocial={false}>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="password">New password</Label>
            <Input id="password" type={show ? "text" : "password"} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type={show ? "text" : "password"} required />
          </div>
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="text-xs text-muted-foreground underline underline-offset-2"
          >
            {show ? "Hide" : "Show"} passwords
          </button>
          <Button type="submit" className="w-full">
            Update password
          </Button>
        </form>
      </AuthCard>
    </>
  )
}
