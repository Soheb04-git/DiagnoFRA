import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function PricingCTA() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
      <div className="text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">Simple, transparent pricing</h2>
        <p className="mt-3 text-muted-foreground md:text-lg">Start free. Upgrade when you need more throughput.</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Free</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">$0</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• 3 projects</li>
              <li>• Basic diagnostics</li>
              <li>• Community support</li>
            </ul>
            <Button asChild className="mt-6 w-full">
              <Link href="/auth/register">Get Started</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Pro</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              $49<span className="text-base font-normal text-muted-foreground">/mo</span>
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Unlimited projects</li>
              <li>• Advanced diagnostics</li>
              <li>• Priority support</li>
            </ul>
            <Button asChild variant="secondary" className="mt-6 w-full">
              <Link href="/auth/register">Start Pro Trial</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
