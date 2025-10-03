"use client"

import type React from "react"

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { AuthCard } from "@/components/auth/auth-card"

export default function TwoFactorPage() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log("[v0] 2FA submit")
  }

  return (
    <>
      <AuthCard
        title="Two-factor authentication"
        description="Enter the 6-digit code from your authenticator app."
        showSocial={false}
      >
        <form className="grid gap-6" onSubmit={onSubmit}>
          <InputOTP maxLength={6} aria-label="One-time passcode">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button type="submit" className="w-full">
            Verify
          </Button>
        </form>
      </AuthCard>
    </>
  )
}
