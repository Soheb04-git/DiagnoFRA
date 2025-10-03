import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { BackgroundGradient } from "@/components/background-gradient"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <BackgroundGradient />
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-20 text-center md:pt-28">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              DiagnoFRA – AI-Powered Transformer Diagnostics
            </h1>
            <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
              Accurately monitor and diagnose transformer health with advanced FRA analysis, explainable AI insights, 
              and clear performance metrics for reliable decision-making.
            </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild className="px-6">
              <Link href="/auth/register">Get Started</Link>
            </Button>
            <Button asChild variant="secondary" className="px-6">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-xl border bg-card shadow-sm">
            <Image
              src="/Dashboard.png"
              alt="FRA Diagnostics dashboard preview"
              width={1280}
              height={720}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
