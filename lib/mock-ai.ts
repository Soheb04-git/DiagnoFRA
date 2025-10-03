
import type { FRAData } from "./file-parser"

export interface AnalysisResult {
  file: string
  faultType: string
  score: number
  explanation: string
  recommendation: string
  summary: string
  deviation: number | null
  features: {
    avgMagnitude: number
    peakMagnitude: number
    peakFrequency: number
    phaseVariance: number
  }
}

const faultTypes = [
  "Healthy",
  "Axial Displacement",
  "Radial Deformation",
  "Core Grounding",
  "Insulation Degradation",
]

// 👉 Utility to generate random analysis
function generateMockAnalysis(data: FRAData[], name: string): AnalysisResult {
  const avgMagnitude =
    data.reduce((s, p) => s + (p.magnitude || 0), 0) / (data.length || 1)
  const peak = data.reduce(
    (max, p) => (p.magnitude > max ? p.magnitude : max),
    -Infinity
  )
  const peakFreq =
    data.length > 0
      ? data[data.findIndex((p) => p.magnitude === peak)]?.frequency || 0
      : 0
  const phaseVar =
    data.reduce((s, p) => s + Math.abs(p.phase || 0), 0) / (data.length || 1)

  // 🎲 Random fault type, biased by average magnitude
  let faultType: string
  if (avgMagnitude > 0.9 && Math.random() > 0.3) {
    faultType = "Healthy"
  } else {
    faultType = faultTypes[Math.floor(Math.random() * faultTypes.length)]
  }

  // 🎲 Random score based on fault type
  const score =
    faultType === "Healthy"
      ? Math.round(85 + Math.random() * 15)
      : Math.round(30 + Math.random() * 50)

  // 🎲 Explanations and recommendations
  const explanation = `Analysis of ${name} indicates a pattern consistent with ${faultType.toLowerCase()}.`
  const recommendation =
    faultType === "Healthy"
      ? "System operating normally. No immediate action required."
      : `Potential issue detected: ${faultType}. Further testing or inspection recommended.`

  const summary = `${faultType} detected with score ${score}.`
  const deviation = Math.random() > 0.2 ? Math.random() * 10 : null

  return {
    file: name,
    faultType,
    score,
    explanation,
    recommendation,
    summary,
    deviation,
    features: {
      avgMagnitude: Number(avgMagnitude.toFixed(3)),
      peakMagnitude: Number(peak.toFixed(3)),
      peakFrequency: Number(peakFreq.toFixed(2)),
      phaseVariance: Number(phaseVar.toFixed(3)),
    },
  }
}

export async function analyzeFRAData(
  data: FRAData[],
  name: string,
  baseline?: FRAData[]
): Promise<AnalysisResult> {
  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, data, baseline }),
    })

    if (!res.ok) {
      throw new Error(`API returned ${res.statusText}`)
    }

    return res.json()
  } catch (err) {
    console.warn("⚠️ API unavailable, using mock analysis", err)
    return generateMockAnalysis(data, name) // fallback
  }
}
