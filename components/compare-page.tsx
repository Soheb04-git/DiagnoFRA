
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { GitCompare, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import type { FRAData } from "@/lib/file-parser"

interface ComparePageProps {
  files: Array<{ name: string; data: FRAData[]; uploadTime: Date; analysis?: any }>
  hasFiles?: boolean
}

export function ComparePage({ files }: ComparePageProps) {
  const [baselineFile, setBaselineFile] = useState<string>("")
  const [testFile, setTestFile] = useState<string>("")

  const baseline = files.find((f) => f.name === baselineFile)
  const test = files.find((f) => f.name === testFile)

  const analysis1 = baseline?.analysis || null
  const analysis2 = test?.analysis || null

  // Combined overlay data
  const combinedData =
    baseline && test
      ? baseline.data.map((point, index) => {
          const point2 = test.data[index] || { frequency: point.frequency, magnitude: 0, phase: 0 }
          return {
            frequency: point.frequency,
            magnitude1: point.magnitude,
            phase1: point.phase,
            magnitude2: point2.magnitude,
            phase2: point2.phase,
          }
        })
      : []

  // Simple deviation calc
  const deviation =
    combinedData.length > 0
      ? (
          combinedData.reduce(
            (sum, p) => sum + Math.abs((p.magnitude1 || 0) - (p.magnitude2 || 0)),
            0
          ) / combinedData.length
        ).toFixed(2)
      : null

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "healthy":
        return "bg-green-500"
      case "degraded":
        return "bg-yellow-500"
      case "faulty":
        return "bg-red-500"
      default:
        return "bg-blue-500"
    }
  }

  if (files.length < 2) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <GitCompare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Need More Files</h2>
          <p className="text-muted-foreground">Upload at least 2 files to compare their frequency responses</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Baseline Comparison</h1>
          <p className="text-muted-foreground">Select a baseline file and a test file to detect deviations</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Baseline File Selector */}
          <Select value={baselineFile} onValueChange={setBaselineFile}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Baseline" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md">
              {files.map((file) => (
                <SelectItem key={file.name} value={file.name} disabled={file.name === testFile}>
                  {file.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-muted-foreground">vs</span>

          {/* Test File Selector */}
          <Select value={testFile} onValueChange={setTestFile}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Test File" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md">
              {files.map((file) => (
                <SelectItem key={file.name} value={file.name} disabled={file.name === baselineFile}>
                  {file.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {analysis1 && analysis2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Baseline Analysis Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`w-3 h-3 ${getStatusColor(analysis1.status)} rounded-full`} />
                {baselineFile}
              </CardTitle>
              <CardDescription>Analysis Results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge className={getStatusColor(analysis1.status)}>{analysis1.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Score:</span>
                <span>{analysis1.score}</span>
              </div>
              <div>
                <span className="font-medium">Summary:</span>
                <p className="text-sm text-muted-foreground">{analysis1.summary}</p>
              </div>
            </CardContent>
          </Card>

          {/* Test Analysis Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`w-3 h-3 ${getStatusColor(analysis2.status)} rounded-full`} />
                {testFile}
              </CardTitle>
              <CardDescription>Analysis Results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge className={getStatusColor(analysis2.status)}>{analysis2.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Score:</span>
                <span>{analysis2.score}</span>
              </div>
              <div>
                <span className="font-medium">Summary:</span>
                <p className="text-sm text-muted-foreground">{analysis2.summary}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {combinedData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Magnitude Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Magnitude Comparison</CardTitle>
              <CardDescription>Overlay of magnitude responses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="frequency" scale="log" domain={["dataMin", "dataMax"]} />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => `Frequency: ${value} Hz`}
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(2)} dB`,
                      name === "magnitude1" ? baselineFile : testFile,
                    ]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="magnitude1" stroke="#2563eb" strokeWidth={2} dot={false} name={baselineFile} />
                  <Line type="monotone" dataKey="magnitude2" stroke="#dc2626" strokeWidth={2} dot={false} name={testFile} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Phase Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Phase Comparison</CardTitle>
              <CardDescription>Overlay of phase responses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="frequency" scale="log" domain={["dataMin", "dataMax"]} />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => `Frequency: ${value} Hz`}
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(2)}°`,
                      name === "phase1" ? baselineFile : testFile,
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="phase1"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                    name={baselineFile}
                    connectNulls={false}       
                    isAnimationActive={false}  
                  />
                  <Line
                    type="monotone"
                    dataKey="phase2"
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={false}
                    name={testFile}
                    connectNulls={false}      
                    isAnimationActive={false}  
                  />

                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {analysis1 && analysis2 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparison Summary</CardTitle>
            <CardDescription>Deviation and key analysis differences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Deviation */}
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">Deviation</span>
                </div>
                <div className="text-2xl font-bold">{deviation ? `${deviation} dB avg` : "-"}</div>
                <div className="text-xs text-muted-foreground">Avg. magnitude difference</div>
              </div>

              {/* Status Difference */}
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <GitCompare className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Status</span>
                </div>
                <div className="text-sm font-medium">
                  {analysis1.status === analysis2.status ? "Same" : "Different"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {analysis1.status} vs {analysis2.status}
                </div>
              </div>

              {/* Score Difference */}
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {analysis1.score > analysis2.score ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium">Score Difference</span>
                </div>
                <div className="text-2xl font-bold">
                  {Math.abs(analysis1.score - analysis2.score).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {analysis1.score > analysis2.score ? `${baselineFile} higher` : `${testFile} higher`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
