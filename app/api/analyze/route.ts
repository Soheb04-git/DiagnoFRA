// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { name, data } = body;

//     // Simple mock analysis logic
//     let status = "Healthy";
//     let score = 95;
//     let summary = "The transformer appears to be in good condition.";

//     if (data && data.length > 0) {
//       // Example: calculate average magnitude
//       const avgMagnitude =
//         data.reduce((sum: number, p: any) => sum + p.magnitude, 0) / data.length;

//       if (avgMagnitude < 0.85) {
//         status = "Degraded";
//         score = 70;
//         summary =
//           "The FRA response indicates possible winding deformation or insulation issues.";
//       }

//       if (avgMagnitude < 0.8) {
//         status = "Faulty";
//         score = 40;
//         summary =
//           "Severe anomalies detected in the FRA curve. Transformer may have serious faults.";
//       }
//     }

//     return NextResponse.json({
//       file: name,
//       status,
//       score,
//       summary,
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || "Failed to analyze data" },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { name, data, baseline } = body;

//     // Simple mock analysis logic
//     let status = "Healthy";
//     let score = 95;
//     let summary = "The transformer appears to be in good condition.";

//     if (Array.isArray(data) && data.length > 0) {
//       // Example: calculate average magnitude
//       const avgMagnitude =
//         data.reduce((sum: number, p: any) => sum + (Number(p.magnitude) || 0), 0) / data.length;

//       if (avgMagnitude < 0.85) {
//         status = "Degraded";
//         score = 70;
//         summary = "The FRA response indicates possible winding deformation or insulation issues.";
//       }

//       if (avgMagnitude < 0.8) {
//         status = "Faulty";
//         score = 40;
//         summary = "Severe anomalies detected in the FRA curve. Transformer may have serious faults.";
//       }
//     }

//     // ✅ Baseline comparison (mock deviation calc)
//     let deviation: number | null = null;
//     if (baseline && Array.isArray(baseline) && baseline.length > 0) {
//       const n = Math.min(data.length, baseline.length);
//       if (n > 0) {
//         let diffSum = 0;
//         for (let i = 0; i < n; i++) {
//           diffSum += Math.abs((Number(data[i].magnitude) || 0) - (Number(baseline[i].magnitude) || 0));
//         }
//         deviation = diffSum / n;
//       }
//     }

//     return NextResponse.json({
//       file: name,
//       status,
//       score,
//       summary,
//       deviation,
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || "Failed to analyze data" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, data, baseline } = body;

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "No FRA data provided" },
        { status: 400 }
      );
    }

    // --- Feature extraction ---
    const magnitudes = data.map((d: any) => Number(d.magnitude) || 0);
    const phases = data.map((d: any) => Number(d.phase) || 0);
    const freqs = data.map((d: any) => Number(d.frequency) || 0);

    const avgMagnitude =
      magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;

    const peakMagnitude = Math.max(...magnitudes);
    const peakFrequency = freqs[magnitudes.indexOf(peakMagnitude)] || 0;

    const avgPhase =
      phases.reduce((a, b) => a + b, 0) / (phases.length || 1);
    const phaseVariance =
      phases.reduce((s, p) => s + Math.pow(p - avgPhase, 2), 0) /
      (phases.length || 1);

    // --- Fault classification ---
    let faultType = "Healthy";
    let score = 95;
    let explanation = "Transformer FRA response appears normal.";
    let recommendation = "No immediate action required.";

    if (avgMagnitude < 0.85) {
      faultType = "Axial Displacement";
      score = 70;
      explanation =
        "Average FRA magnitude is lower than expected, suggesting axial displacement.";
      recommendation = "Schedule inspection of winding alignment.";
    }

    if (avgMagnitude < 0.8 || phaseVariance > 200) {
      faultType = "Radial Deformation";
      score = 55;
      explanation =
        "Low magnitude response and high phase variance indicate possible radial deformation.";
      recommendation = "Perform detailed offline FRA test.";
    }

    if (peakMagnitude < 0.5) {
      faultType = "Core Grounding";
      score = 40;
      explanation =
        "Unusually low peak magnitude suggests possible unintended core grounding.";
      recommendation = "Check transformer core insulation and grounding.";
    }

    if (avgMagnitude < 0.75 && peakFrequency < 200) {
      faultType = "Insulation Degradation";
      score = 30;
      explanation =
        "Severely degraded FRA curve at low frequency indicates insulation deterioration.";
      recommendation =
        "Immediate insulation resistance testing recommended.";
    }

    // --- Baseline comparison (mock deviation calc) ---
    let deviation: number | null = null;
    if (baseline && Array.isArray(baseline) && baseline.length > 0) {
      const n = Math.min(data.length, baseline.length);
      if (n > 0) {
        let diffSum = 0;
        for (let i = 0; i < n; i++) {
          diffSum += Math.abs(
            (Number(data[i].magnitude) || 0) -
              (Number(baseline[i].magnitude) || 0)
          );
        }
        deviation = diffSum / n;
      }
    }

    return NextResponse.json({
      file: name,
      faultType,
      score,
      explanation,
      recommendation,
      summary: explanation,
      deviation,
      features: {
        avgMagnitude,
        peakMagnitude,
        peakFrequency,
        phaseVariance,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to analyze data" },
      { status: 500 }
    );
  }
}
