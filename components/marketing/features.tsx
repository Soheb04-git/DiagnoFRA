import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const FEATURES = [
{
  title: "Real-time Health Monitoring",
  desc: "Continuously monitor transformer frequency response to detect deviations from baseline and ensure reliable operation.",
},
{
  title: "Root-cause Diagnostics",
  desc: "Identify potential faults such as winding deformation, insulation degradation, or core issues with explainable AI insights.",
},
{
  title: "Anomaly Detection",
  desc: "Automatically detect unusual patterns in magnitude and phase response, highlighting early signs of transformer failures.",
},
{
  title: "Seamless Integration",
  desc: "Easily upload test data, generate diagnostic reports, and integrate results into existing maintenance workflows.",
},

]

export function Features() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
      <div className="text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">Platform features</h2>
        <p className="mt-3 text-muted-foreground md:text-lg">Designed for reliability, visibility, and speed.</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <Card key={f.title} className="bg-card">
            <CardHeader>
              <CardTitle className="text-base">{f.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-16" />

      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <img
            src="/hiw.png"
            alt="Attention heatmap visualization"
            className="h-auto w-full rounded-md"
          />
        </div>
        <div>
          <h3 className="text-2xl font-semibold">How it works</h3>
          <ol className="mt-4 space-y-4">
            <li className="rounded-md border bg-muted/30 p-4">
              <span className="font-medium">1) Upload test data</span>
              <p className="text-sm text-muted-foreground">
                Import FRA measurement files (CSV or XML) directly from your testing equipment.
              </p>
            </li>
            <li className="rounded-md border bg-muted/30 p-4">
              <span className="font-medium">2) Run diagnostics</span>
              <p className="text-sm text-muted-foreground">
                Our AI engine analyzes magnitude and phase response to detect winding deformation, insulation degradation, and other anomalies.
              </p>
            </li>
            <li className="rounded-md border bg-muted/30 p-4">
              <span className="font-medium">3) Get actionable insights</span>
              <p className="text-sm text-muted-foreground">
                Review clear reports with fault type, severity scores, and maintenance recommendations.
              </p>
            </li>
          </ol>

        </div>
      </div>
    </section>
  )
}
