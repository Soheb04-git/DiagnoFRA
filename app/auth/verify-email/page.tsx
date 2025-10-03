import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AuthCard } from "@/components/auth/auth-card"

export default function VerifyEmailPage() {
  return (
    <>
      <AuthCard
        title="Check your email"
        description="We sent a verification link to your inbox."
        showSocial={false}
        footer={
          <Link href="/auth/login" className="text-foreground underline underline-offset-2">
            Return to sign in
          </Link>
        }
      >
        <div className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            Click the link in the email to verify your account. This helps keep your data safe.
          </p>
          <Button asChild className="w-full">
            <Link href="/auth/login">Back to Sign In</Link>
          </Button>
        </div>
      </AuthCard>
    </>
  )
}
