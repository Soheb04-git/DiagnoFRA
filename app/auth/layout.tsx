import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { BackgroundGradient } from "@/components/background-gradient"
import { Card } from "@/components/ui/card"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh">
      <BackgroundGradient />
      <header className="mx-auto w-full max-w-6xl px-4 py-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image src="/placeholder-logo.svg" alt="DiagnoFRA" width={28} height={28} />
          <span className="font-medium">DiagnoFRA</span>
        </Link>
      </header>
      <div className="mx-auto flex w-full max-w-md flex-1 items-center px-4 pb-16">
        <Card className="w-full border bg-card/95 shadow-xl backdrop-blur-md">{children}</Card>
      </div>
      <footer className="pb-8 text-center text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} DiagnoFRA</span>
      </footer>
    </div>
  )
}
