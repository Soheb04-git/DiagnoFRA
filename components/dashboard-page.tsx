

"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Activity, AlertTriangle, CheckCircle, TrendingUp, Zap, Filter, SortAsc } from "lucide-react"
import { analyzeFRAData, type AnalysisResult } from "@/lib/mock-ai"
import type { FRAData } from "@/lib/file-parser"

interface UploadedFileWithAnalysis {
  name: string
  data: FRAData[]
  uploadTime: Date | string
  analysis?: any
}

interface DashboardPageProps {
  files: UploadedFileWithAnalysis[]
}

// default thresholds
const DEFAULT_WARNING_THRESHOLD = 70
const DEFAULT_CRITICAL_THRESHOLD = 50

export function DashboardPage({ files }: DashboardPageProps) {
  const [selectedFile, setSelectedFile] = useState<string>("")
  const [showBaseline, setShowBaseline] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | (any & { score?: number }) | null>(null)

  const [filter, setFilter] = useState<"all" | "healthy" | "warning" | "critical">("all")
  const [sort, setSort] = useState<"newest" | "oldest" | "highest" | "lowest">("newest")

  // user-configurable thresholds (persisted)
  const [warningThreshold, setWarningThreshold] = useState<number>(DEFAULT_WARNING_THRESHOLD)
  const [criticalThreshold, setCriticalThreshold] = useState<number>(DEFAULT_CRITICAL_THRESHOLD)
  const [thresholdsOpen, setThresholdsOpen] = useState<boolean>(false)

  // alert sound toggle (persisted)
  const [alertSoundEnabled, setAlertSoundEnabled] = useState<boolean>(false)

  const currentFile = files.find((f) => f.name === selectedFile)

  // load persisted thresholds & sound preference on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("fra_thresholds_v1")
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed.warning === "number" && typeof parsed.critical === "number") {
          // ensure critical < warning
          const critical = Math.min(parsed.critical, parsed.warning - 1)
          const warning = Math.max(parsed.warning, critical + 1)
          setWarningThreshold(warning)
          setCriticalThreshold(critical)
        }
      }
    } catch (e) {
      // ignore parse errors
    }

    try {
      const s = localStorage.getItem("fra_alert_sound_v1")
      if (s !== null) setAlertSoundEnabled(s === "1")
    } catch (e) {
      // ignore
    }
  }, [])

  // persist thresholds when changed
  useEffect(() => {
    try {
      localStorage.setItem(
        "fra_thresholds_v1",
        JSON.stringify({ warning: warningThreshold, critical: criticalThreshold })
      )
    } catch (e) {
      // ignore
    }
  }, [warningThreshold, criticalThreshold])

  // persist alert sound toggle
  useEffect(() => {
    try {
      localStorage.setItem("fra_alert_sound_v1", alertSoundEnabled ? "1" : "0")
    } catch (e) {
      // ignore
    }
  }, [alertSoundEnabled])

  // Utility: ensure numeric score in analysis (prefer server, then confidence, then fallback)
  const normalizeAnalysisWithScore = (file: UploadedFileWithAnalysis, a: any) => {
    const copy = { ...(a || {}) }
    // If server returned a score use it
    if (typeof copy.score === "number") return copy

    // If we have a confidence (0..1) map to 0..100
    if (typeof copy.confidence === "number") {
      copy.score = Math.round(copy.confidence * 100)
      return copy
    }

    // Fallback: approximate using avgMagnitude (similar to API mock thresholds)
    const avgMagnitude =
      (file?.data?.reduce((s: number, p: FRAData) => s + (Number(p.magnitude) || 0), 0) || 0) /
      (file?.data?.length || 1)

    // Use approximate mapping similar to analyze API
    let fallbackScore = 95
    if (avgMagnitude < 0.85) fallbackScore = 70
    if (avgMagnitude < 0.8) fallbackScore = 40
    copy.score = fallbackScore
    return copy
  }

  // play a short beep using WebAudio API
  const playBeep = (freq = 520, duration = 180, volume = 0.03) => {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = "sine"
      o.frequency.value = freq
      g.gain.value = volume
      o.connect(g)
      g.connect(ctx.destination)
      o.start()
      setTimeout(() => {
        o.stop()
        // close context after small delay
        try {
          ctx.close()
        } catch (e) {
          // ignore
        }
      }, duration)
    } catch (e) {
      // ignore audio errors (browsers may block audio)
    }
  }

  // When user selects a file -> compute analysis and trigger alert sound if needed
  const handleFileSelect = (fileName: string) => {
    setSelectedFile(fileName)
    const file = files.find((f) => f.name === fileName)
    if (file) {
      // Prefer server-provided analysis if present; otherwise fallback to mock-ai
      const serverAnalysis = file.analysis ?? null
      const baseAnalysis = serverAnalysis ?? analyzeFRAData(file.data, fileName)
      const withScore = normalizeAnalysisWithScore(file, baseAnalysis)
      setAnalysis(withScore)

      // If sound is enabled and score is below thresholds, play beep (short)
      const scoreNum = typeof withScore.score === "number" ? withScore.score : Number(withScore.score)
      if (alertSoundEnabled && !isNaN(scoreNum)) {
        if (scoreNum <= criticalThreshold) {
          playBeep(240, 300, 0.06) // lower more urgent beep
        } else if (scoreNum <= warningThreshold) {
          playBeep(520, 180, 0.035)
        }
      }
    } else {
      setAnalysis(null)
    }
  }

  const getFaultIcon = (faultType: string) => {
    switch ((faultType || "").toLowerCase()) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "axial displacement":
      case "radial deformation":
        return <TrendingUp className="h-4 w-4 text-orange-500" />
      case "core grounding":
        return <Zap className="h-4 w-4 text-red-500" />
      case "insulation degradation":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  const getFaultColor = (faultType: string | undefined) => {
    switch ((faultType || "").toLowerCase()) {
      case "healthy":
        return "bg-green-500"
      case "axial displacement":
      case "radial deformation":
        return "bg-orange-500"
      case "core grounding":
      case "insulation degradation":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  // Generate baseline variation for visualization
  const baselineData = currentFile?.data.map((point) => {
  const hasPhase = point.phase !== 0 && !isNaN(point.phase);

  return {
    ...point,
    baselineMagnitude: point.magnitude * (0.95 + Math.random() * 0.1),
    baselinePhase: hasPhase
      ? point.phase * (0.98 + Math.random() * 0.04)
      : Math.random() * 10 - 5, // random between -5 and +5 degrees
  };
});


  // Trend/History dataset (raw)
  const rawTrendData = useMemo(() => {
    return files.map((f) => {
      const avgMag = f.data.reduce((sum, p) => sum + (Number(p.magnitude) || 0), 0) / (f.data.length || 1)
      const rawAnalysis = f.analysis ?? analyzeFRAData(f.data, f.name)
      const normalized = normalizeAnalysisWithScore(f, rawAnalysis)
      return {
        file: f.name,
        time: new Date(f.uploadTime).toLocaleString(),
        uploadDate: new Date(f.uploadTime),
        avgMagnitude: avgMag,
        analysis: normalized,
      }
    })
  }, [files])

  // Apply filter + sorting using dynamic thresholds
  const filteredTrendData = useMemo(() => {
    let data = [...rawTrendData]

    if (filter !== "all") {
      data = data.filter((row) => {
        const sc = row.analysis?.score ?? 100
        if (filter === "critical") return sc <= criticalThreshold
        if (filter === "warning") return sc <= warningThreshold && sc > criticalThreshold
        if (filter === "healthy") return sc > warningThreshold
        return true
      })
    }

    switch (sort) {
      case "newest":
        data.sort((a, b) => (b.uploadDate as Date).getTime() - (a.uploadDate as Date).getTime())
        break
      case "oldest":
        data.sort((a, b) => (a.uploadDate as Date).getTime() - (b.uploadDate as Date).getTime())
        break
      case "highest":
        data.sort((a, b) => (b.analysis?.score ?? 0) - (a.analysis?.score ?? 0))
        break
      case "lowest":
        data.sort((a, b) => (a.analysis?.score ?? 0) - (b.analysis?.score ?? 0))
        break
    }

    return data
  }, [rawTrendData, filter, sort, warningThreshold, criticalThreshold])

  // Render the animated status pill for the selected file
  const StatusPill = ({ score }: { score: number | undefined | null }) => {
    if (typeof score !== "number") return null
    const sc = score
    if (sc <= criticalThreshold) {
      return (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-sm font-medium shadow-sm"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
          Critical&nbsp;<span className="ml-2 font-semibold">{sc}</span>
        </motion.div>
      )
    }
    if (sc <= warningThreshold) {
      return (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400 text-black text-sm font-medium shadow-sm"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-black/80" />
          Warning&nbsp;<span className="ml-2 font-semibold">{sc}</span>
        </motion.div>
      )
    }
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500 text-white text-sm font-medium shadow-sm"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-white" />
        Healthy&nbsp;<span className="ml-2 font-semibold">{sc}</span>
      </motion.div>
    )
  }

  // Reset thresholds to defaults
  const resetThresholds = () => {
    setWarningThreshold(DEFAULT_WARNING_THRESHOLD)
    setCriticalThreshold(DEFAULT_CRITICAL_THRESHOLD)
  }

  if (files.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Data Available</h2>
          <p className="text-muted-foreground mb-4">Upload some FRA data files to start analyzing</p>
          <Button onClick={() => window.location.reload()}>Go to Upload</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analysis Dashboard</h1>
          <p className="text-muted-foreground">AI-powered frequency response analysis results</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Status pill for selected file */}
          <div>{analysis ? <StatusPill score={analysis.score} /> : null}</div>

          <div className="flex items-center space-x-2">
            <Switch id="baseline" checked={showBaseline} onCheckedChange={setShowBaseline} />
            <Label htmlFor="baseline">Show Baseline</Label>
          </div>

          <Select value={selectedFile} onValueChange={handleFileSelect}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a file to analyze" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 shadow-md rounded-md">
              {files.map((file) => (
                <SelectItem key={file.name} value={file.name}>
                  {file.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Thresholds toggle */}
          <div className="relative">
            <Button variant="outline" size="sm" onClick={() => setThresholdsOpen((s) => !s)}>
              Thresholds
            </Button>

            <AnimatePresence>
              {thresholdsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="absolute right-0 mt-2 w-[320px] bg-white dark:bg-gray-900 border rounded-lg shadow-lg p-3 z-30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Alert Settings</div>
                    <button
                      onClick={() => setThresholdsOpen(false)}
                      aria-label="Close"
                      className="text-sm text-muted-foreground"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium">Warning Threshold: {warningThreshold}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={1}
                          max={99}
                          value={warningThreshold}
                          onChange={(e) => {
                            const val = Number(e.target.value)
                            setWarningThreshold(Math.max(val, criticalThreshold + 1))
                          }}
                          className="flex-1"
                        />
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={warningThreshold}
                          onChange={(e) => {
                            const v = Number(e.target.value || 0)
                            setWarningThreshold(Math.max(v, criticalThreshold + 1))
                          }}
                          className="w-16 p-1 border rounded text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium">Critical Threshold: {criticalThreshold}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={1}
                          max={98}
                          value={criticalThreshold}
                          onChange={(e) => {
                            const val = Number(e.target.value)
                            setCriticalThreshold(Math.min(val, warningThreshold - 1))
                          }}
                          className="flex-1"
                        />
                        <input
                          type="number"
                          min={1}
                          max={98}
                          value={criticalThreshold}
                          onChange={(e) => {
                            const v = Number(e.target.value || 0)
                            setCriticalThreshold(Math.min(v, warningThreshold - 1))
                          }}
                          className="w-16 p-1 border rounded text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          id="alert-sound"
                          type="checkbox"
                          checked={alertSoundEnabled}
                          onChange={(e) => setAlertSoundEnabled(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <label htmlFor="alert-sound" className="text-sm">Play sound on alerts</label>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={resetThresholds}
                          className="px-3 py-1 rounded border text-sm hover:bg-muted"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Health banner */}
      <AnimatePresence>
        {analysis && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {(() => {
              const sc = analysis.score
              if (sc <= criticalThreshold) {
                return (
                  <div className="rounded-md bg-red-50 border border-red-200 p-3 text-red-800 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 mt-0.5 text-red-600" />
                      <div>
                        <div className="font-semibold">Critical alert</div>
                        <div className="text-sm">Score {sc} ≤ {criticalThreshold}. Immediate inspection recommended.</div>
                      </div>
                    </div>
                  </div>
                )
              }
              if (sc <= warningThreshold) {
                return (
                  <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 text-yellow-800 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 mt-0.5 text-yellow-600" />
                      <div>
                        <div className="font-semibold">Warning</div>
                        <div className="text-sm">Score {sc} ≤ {warningThreshold}. Consider reviewing maintenance actions.</div>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary cards */}
      {analysis && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.32 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fault Detection</CardTitle>
              {getFaultIcon(analysis.faultType)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analysis.faultType}</div>
              <Badge className={`mt-2 ${getFaultColor(analysis.faultType)}`}>
                {(analysis.confidence ? (analysis.confidence * 100).toFixed(1) : (analysis.score ?? "-"))}% Confidence
              </Badge>
              <div className="mt-2 text-sm text-muted-foreground">Score: <span className="font-medium">{analysis.score}</span></div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Points</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentFile?.data.length}</div>
              <p className="text-xs text-muted-foreground">
                Frequency range: {Math.min(...currentFile!.data.map((d) => d.frequency)).toFixed(1)} -{" "}
                {Math.max(...currentFile!.data.map((d) => d.frequency)).toFixed(1)} Hz
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analysis Time</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.8s</div>
              <p className="text-xs text-muted-foreground">Processed at {new Date().toLocaleTimeString()}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Charts */}
      {currentFile && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.32 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>Magnitude Response</CardTitle>
              <CardDescription>Frequency vs Magnitude (dB)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={baselineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="frequency" scale="log" domain={["dataMin", "dataMax"]} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="magnitude" stroke="#2563eb" strokeWidth={2} dot={false} name="Measured" />
                  {showBaseline && (
                    <Line type="monotone" dataKey="baselineMagnitude" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Baseline" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>Phase Response</CardTitle>
              <CardDescription>Frequency vs Phase (degrees)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={baselineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="frequency" scale="log" domain={["dataMin", "dataMax"]} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="phase"
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={false}
                    name="Measured"
                    connectNulls={false}       
                    isAnimationActive={false}  
                  />
                  {showBaseline && (
                    <Line
                      type="monotone"
                      dataKey="baselinePhase"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Baseline"
                      connectNulls={false}       
                      isAnimationActive={false}  
                    />
                  )}

                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* AI Analysis */}
      {analysis && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.32 }}>
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis Results</CardTitle>
              <CardDescription>Detailed diagnostic information and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Explanation</h4>
                <p className="text-muted-foreground">{analysis.explanation}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Recommendation</h4>
                <p className="text-muted-foreground">{analysis.recommendation}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Key Features</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analysis.features || {}).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold">{typeof value === "number" ? Number(value).toFixed(3) : String(value)}</div>
                      <div className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Trend & History */}
      {files.length > 1 && (
        <div className="space-y-6">
          {/* Filter + Sort controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filter} onValueChange={(val: any) => setFilter(val)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-muted-foreground" />
              <Select value={sort} onValueChange={(val: any) => setSort(val)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Score</SelectItem>
                  <SelectItem value="lowest">Lowest Score</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>Trend Over Time</CardTitle>
                <CardDescription>Average magnitude across uploads</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={filteredTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgMagnitude" stroke="#6366f1" strokeWidth={2} dot name="Avg Magnitude" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>Upload History</CardTitle>
                <CardDescription>Past uploads with analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  {/* Compact responsive table */}
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="p-2 text-xs uppercase tracking-wide">File</th>
                        <th className="p-2 text-xs uppercase tracking-wide hidden sm:table-cell">Time</th>
                        <th className="p-2 text-xs uppercase tracking-wide">Fault</th>
                        <th className="p-2 text-xs uppercase tracking-wide">Confidence</th>
                        <th className="p-2 text-xs uppercase tracking-wide">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTrendData.map((row, idx) => {
                        const sc = row.analysis?.score ?? 100
                        const statusLabel = sc <= criticalThreshold ? "Critical" : sc <= warningThreshold ? "Warning" : "Healthy"
                        const statusColor = sc <= criticalThreshold ? "bg-red-500 text-white" : sc <= warningThreshold ? "bg-yellow-400 text-black" : "bg-green-500 text-white"
                        return (
                          <tr
                            key={idx}
                            className="border-b last:border-0 hover:bg-muted/30 transition"
                            onClick={() => handleFileSelect(row.file)}
                            style={{ cursor: "pointer" }}
                          >
                            <td className="p-2">
                              <div className="font-medium truncate max-w-[14rem]">{row.file}</div>
                              <div className="text-xs text-muted-foreground sm:hidden">{row.time}</div>
                            </td>
                            <td className="p-2 hidden sm:table-cell">{row.time}</td>
                            <td className="p-2">{row.analysis?.faultType ?? "-"}</td>
                            <td className="p-2">
                              {row.analysis?.confidence ? `${(row.analysis.confidence * 100).toFixed(1)}%` : `${row.analysis?.score ?? "-"}`}
                            </td>
                            <td className="p-2">
                              <span className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-medium ${statusColor}`}>
                                {statusLabel}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
