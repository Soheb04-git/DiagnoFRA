import { Hero } from "@/components/marketing/hero"
import { Features } from "@/components/marketing/features"
import { PricingCTA } from "@/components/marketing/pricing-cta"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main>
      <Hero />
      <Features />
      <PricingCTA />
      <SiteFooter />
    </main>
  )
}
