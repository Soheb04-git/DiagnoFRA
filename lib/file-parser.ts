
// export interface FRAData {
//   frequency: number
//   magnitude: number
//   phase: number | null
// }

// export function parseCSV(csvText: string): FRAData[] {
//   const lines = csvText.trim().split(/\r?\n/)
//   const data: FRAData[] = []
//   const startIndex = lines[0].toLowerCase().includes("frequency") ? 1 : 0

//   for (let i = startIndex; i < lines.length; i++) {
//     const line = lines[i].trim()
//     if (!line) continue
//     const values = line.split(",").map((v) => v.trim())
//     if (values.length >= 2) {
//       const frequency = parseFloat(values[0])
//       const magnitude = parseFloat(values[1])
//       // optional phase (third column)
//       const rawPhase = values[2] ?? ""
//       const phase = rawPhase ? parseFloat(rawPhase.replace(/[^\d.-]/g, "")) : null

//       if (!isNaN(frequency) && !isNaN(magnitude)) {
//         data.push({ frequency, magnitude, phase: phase !== null && !isNaN(phase) ? phase : null })
//       }
//     }
//   }
//   return data
// }

// export function parseXML(xmlText: string): FRAData[] {
//   const data: FRAData[] = []
//   try {
//     const parser = new DOMParser()
//     const xmlDoc = parser.parseFromString(xmlText, "text/xml")
//     const measurements = xmlDoc.querySelectorAll("measurement, datapoint, point, Point, FRAData > Point, FRAData Point")

//     // fallback: any element with frequency attribute
//     if (measurements.length === 0) {
//       const attrNodes = Array.from(xmlDoc.querySelectorAll("*")).filter((el) => el.hasAttribute && (el as Element).hasAttribute("frequency"))
//       attrNodes.forEach((el) => {
//         const frequency = parseFloat((el as Element).getAttribute("frequency") || "0")
//         const magnitudeAttr = (el as Element).getAttribute("magnitude") || (el as Element).getAttribute("response") || "0"
//         const magnitude = parseFloat(magnitudeAttr)
//         const rawPhase =
//         e.getAttribute("phase") ||
//         e.querySelector("phase")?.textContent ||
//         e.querySelector("angle")?.textContent || // support alt tag
//         ""

//       const phase = rawPhase ? parseFloat(rawPhase.replace(/[^\d.-]/g, "")) : null

//       if (!isNaN(frequency) && !isNaN(magnitude)) {
//         data.push({ frequency, magnitude, phase: phase !== null && !isNaN(phase) ? phase : null })
//       }
//       })
//       return data
//     }

//     measurements.forEach((m) => {
//       const el = m as Element
//       const freqAttr = el.getAttribute("frequency") || el.querySelector("frequency")?.textContent || ""
//       const magAttr = el.getAttribute("magnitude") || el.getAttribute("response") || el.querySelector("magnitude")?.textContent || el.querySelector("response")?.textContent || ""
//       const phaseAttr = el.getAttribute("phase") || el.querySelector("phase")?.textContent || "0"

//       const frequency = parseFloat(freqAttr || "0")
//       const magnitude = parseFloat(magAttr || "0")
//       const phase = parseFloat(phaseAttr || "0")

//       if (!isNaN(frequency) && !isNaN(magnitude)) {
//         data.push({ frequency, magnitude, phase: isNaN(phase) ? 0 : phase })
//       }
//     })
//   } catch (e) {
//     throw new Error("Invalid XML")
//   }
//   return data
// }

export interface FRAData {
  frequency: number
  magnitude: number
  phase: number | null
}

export function parseCSV(csvText: string): FRAData[] {
  const lines = csvText.trim().split(/\r?\n/)
  const data: FRAData[] = []
  const startIndex = lines[0].toLowerCase().includes("frequency") ? 1 : 0

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const values = line.split(",").map((v) => v.trim())
    if (values.length >= 2) {
      const frequency = parseFloat(values[0])
      const magnitude = parseFloat(values[1])
      const phase = values.length >= 3 ? parseFloat(values[2]) : 0

      
      const noisyMagnitude = magnitude * (0.98 + Math.random() * 0.04)
      const noisyPhase = (isNaN(phase) ? 0 : phase) + (Math.random() * 10 - 5)

      if (!isNaN(frequency) && !isNaN(magnitude)) {
        
        data.push({ frequency, magnitude: noisyMagnitude, phase: noisyPhase })
      }
    }
  }
  return data
}


export function parseXML(xmlText: string): FRAData[] {
  const data: FRAData[] = []
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, "text/xml")
    const measurements = xmlDoc.querySelectorAll("measurement, datapoint, point, Point, FRAData > Point, FRAData Point")

    if (measurements.length === 0) {
      const attrNodes = Array.from(xmlDoc.querySelectorAll("*")).filter(
        (el) => el.hasAttribute && (el as Element).hasAttribute("frequency")
      )
      attrNodes.forEach((el) => {
        const frequency = parseFloat((el as Element).getAttribute("frequency") || "0")
        const magnitudeAttr =
          (el as Element).getAttribute("magnitude") || (el as Element).getAttribute("response") || "0"
        const magnitude = parseFloat(magnitudeAttr)
        const phaseAttr = (el as Element).getAttribute("phase") || "0"
        const phase = parseFloat(phaseAttr)

        // 🟢 Add noise here too
        const noisyMagnitude = magnitude * (0.98 + Math.random() * 0.04)
        const noisyPhase = (isNaN(phase) ? 0 : phase) + (Math.random() * 10 - 5)

        if (!isNaN(frequency) && !isNaN(magnitude)) {
          data.push({ frequency, magnitude: noisyMagnitude, phase: noisyPhase }) // 🟢 Use noisy values
        }
      })
      return data
    }

    measurements.forEach((m) => {
      const el = m as Element
      const freqAttr = el.getAttribute("frequency") || el.querySelector("frequency")?.textContent || ""
      const magAttr =
        el.getAttribute("magnitude") ||
        el.getAttribute("response") ||
        el.querySelector("magnitude")?.textContent ||
        el.querySelector("response")?.textContent ||
        ""
      const phaseAttr = el.getAttribute("phase") || el.querySelector("phase")?.textContent || "0"

      const frequency = parseFloat(freqAttr || "0")
      const magnitude = parseFloat(magAttr || "0")
      const phase = parseFloat(phaseAttr || "0")

      // 🟢 Add noise here too
      const noisyMagnitude = magnitude * (0.98 + Math.random() * 0.04)
      const noisyPhase = (isNaN(phase) ? 0 : phase) + (Math.random() * 10 - 5)

      if (!isNaN(frequency) && !isNaN(magnitude)) {
        data.push({ frequency, magnitude: noisyMagnitude, phase: noisyPhase }) // 🟢 Use noisy values
      }
    })
  } catch (e) {
    throw new Error("Invalid XML")
  }
  return data
}
