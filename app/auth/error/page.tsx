import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AuthCard } from "@/components/auth/auth-card"

export default function AuthErrorPage() {
  return (
    <>
      <AuthCard
        title="Something went wrong"
        description="An unexpected error occurred. Please try again."
        showSocial={false}
        footer={
          <Link href="/auth/login" className="text-foreground underline underline-offset-2">
            Back to sign in
          </Link>
        }
      >
        <div className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            If the issue persists, contact support or check the status page.
          </p>
          <Button asChild className="w-full">
            <Link href="/auth/login">Try Again</Link>
          </Button>
        </div>
      </AuthCard>
    </>
  )
}
