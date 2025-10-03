

"use client"

import { useCallback, useMemo, useRef, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import * as XLSX from "xlsx"

import { parseCSV, parseXML, type FRAData } from "@/lib/file-parser"
import { toast } from "sonner"

interface UploadedFileFromParent {
  name: string
  data: FRAData[]
  uploadTime: string
  analysis?: any
}

interface UploadPageProps {
  onFileUploaded: (file: {
    name: string
    data: FRAData[]
    uploadTime?: Date | string
    analysis?: any
  }) => void
  uploadedFiles: UploadedFileFromParent[]
}

type InFlightItem = {
  id: string
  name: string
  status: "processing" | "error"
  data?: FRAData[]
  analysis?: any
  error?: string
}

export function UploadPage({ onFileUploaded, uploadedFiles }: UploadPageProps) {
  const [inFlight, setInFlight] = useState<InFlightItem[]>([])
  const [selectedDisplayId, setSelectedDisplayId] = useState<string | null>(null)
  const dialogReportRef = useRef<HTMLDivElement | null>(null)

  // On mount remove any stray toasts (keeps UI tidy)
  useEffect(() => {
    toast.dismiss()
  }, [])

  // build display list - inflight first, then persisted (dedupe by name)
  const displayList = useMemo(() => {
    const inflightNames = new Set(inFlight.map((i) => i.name))
    const persisted = uploadedFiles.filter((f) => !inflightNames.has(f.name))
    const persistedWithId = persisted.map((p, idx) => ({
      id: `persist-${idx}-${p.name}`,
      ...p,
      __persist: true as const,
    }))
    return [...inFlight.map((i) => ({ ...i, __persist: false as const })), ...persistedWithId]
  }, [inFlight, uploadedFiles])

  // helper: clone node and inline computed styles (for html2canvas/pdf)
  const cloneNodeWithInlineStyles = (node: HTMLElement) => {
    const clone = node.cloneNode(true) as HTMLElement
    const originals = [node, ...Array.from(node.querySelectorAll<HTMLElement>("*"))]
    const clones = [clone, ...Array.from(clone.querySelectorAll<HTMLElement>("*"))]

    originals.forEach((origEl, idx) => {
      const cloneEl = clones[idx]
      if (!cloneEl) return
      const cs = window.getComputedStyle(origEl)
      let cssText = ""
      for (let i = 0; i < cs.length; i++) {
        const prop = cs[i]
        const val = cs.getPropertyValue(prop)
        if (!val) continue
        cssText += `${prop}:${val};`
      }
      if (!cssText.includes("background")) {
        const bg = cs.getPropertyValue("background-color") || "#ffffff"
        cssText += `background-color:${bg};`
      }
      cloneEl.setAttribute("style", cssText)
    })

    return clone
  }

  // Drop handler (parses file, calls /api/analyze, notifies parent)
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newInFlight: InFlightItem[] = acceptedFiles.map((file) => ({
        id: `${file.name}-${Date.now()}`,
        name: file.name,
        status: "processing",
      }))
      setInFlight((prev) => [...newInFlight, ...prev])

      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i]
        const id = newInFlight[i].id
        try {
          const text = await file.text()
          let data: FRAData[] = []
          if (file.name.toLowerCase().endsWith(".csv")) {
            data = parseCSV(text)
          } else if (file.name.toLowerCase().endsWith(".xml")) {
            data = parseXML(text)
          } else {
            throw new Error("Unsupported format")
          }

          // call analyze API
          const res = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: file.name, data }),
          })
          const analysis = await res.json()

          // notify parent (parent persists and shows success toast)
          onFileUploaded({
            name: file.name,
            data,
            uploadTime: new Date().toISOString(),
            analysis,
          })

          // remove inflight
          setInFlight((prev) => prev.filter((x) => x.id !== id))

          // NOTE: do NOT show success toast here — parent does that to avoid duplicates.
        } catch (err) {
          const m = err instanceof Error ? err.message : "Unknown error"
          setInFlight((prev) =>
            prev.map((it) => (it.id === id ? { ...it, status: "error", error: m } : it))
          )
          toast.error(`Failed ${file.name}: ${m}`, {
            duration: 3000,
            position: "top-right",
          })
        }
      }
    },
    [onFileUploaded],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"], "application/xml": [".xml"], "text/xml": [".xml"] },
    multiple: true,
  })

  const getSelectedData = () => {
    if (!selectedDisplayId) return null
    const found = displayList.find((d) => d.id === selectedDisplayId)
    if (!found) return null
    if ((found as any).__persist) {
      const p = found as UploadedFileFromParent & { id: string }
      return { id: p.id, name: p.name, data: p.data, analysis: p.analysis, uploadTime: p.uploadTime }
    } else {
      const inf = found as InFlightItem & { id: string }
      return { id: inf.id, name: inf.name, data: inf.data ?? [], analysis: inf.analysis, error: inf.error }
    }
  }

  // Export helpers (CSV / Excel / PDF)
  const exportCSV = () => {
    const sel = getSelectedData()
    if (!sel || !sel.data) return toast.error("No data to export")
    const rows = [["frequency", "magnitude", "phase"]]
    sel.data.forEach((d: FRAData) => rows.push([String(d.frequency), String(d.magnitude), String(d.phase)]))
    const csv = rows.map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${sel.name}.csv`
    link.click()
  }

  const exportExcel = () => {
    const sel = getSelectedData()
    if (!sel || !sel.data) return toast.error("No data to export")
    const sheetData = sel.data.map((d: FRAData) => ({ frequency: d.frequency, magnitude: d.magnitude, phase: d.phase }))
    const worksheet = XLSX.utils.json_to_sheet(sheetData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "FRA Data")
    XLSX.writeFile(workbook, `${sel.name}.xlsx`)
  }

  const exportPDF = async () => {
    const sel = getSelectedData()
    if (!sel) return toast.error("No content to export")
    if (!dialogReportRef.current) return toast.error("No content to export")

    try {
      const cloned = cloneNodeWithInlineStyles(dialogReportRef.current)
      const offscreen = document.createElement("div")
      offscreen.style.position = "fixed"
      offscreen.style.left = "-9999px"
      offscreen.style.top = "0"
      offscreen.appendChild(cloned)
      document.body.appendChild(offscreen)

      const canvas = await html2canvas(cloned, {
        useCORS: true,
        backgroundColor: "#ffffff",
        scale: Math.min(2, window.devicePixelRatio || 1),
      })
      document.body.removeChild(offscreen)

      const img = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const imgH = (canvas.height * pageW) / canvas.width

      let y = 0
      while (y < imgH) {
        pdf.addImage(img, "PNG", 0, -y, pageW, imgH)
        y += pageH
        if (y < imgH) pdf.addPage()
      }

      pdf.save(`${sel.name}-report.pdf`)
    } catch (err) {
      console.error("PDF export error:", err)
      toast.error("Failed to export PDF")
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 -z-10 animate-gradient
          bg-[linear-gradient(270deg,#e0f2fe,#dbeafe,#eef2ff,#e0f2fe)]
          dark:bg-[linear-gradient(270deg,#0f172a,#1e293b,#312e81,#0f172a)]
          bg-[length:200%_200%]"
      />

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Upload FRA Data</h1>
          <p className="text-muted-foreground">Upload CSV or XML files for transformer frequency response analysis</p>
        </div>

        {/* Upload Zone */}
        <Card className="shadow-md hover:shadow-xl transition rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur">
          <CardHeader>
            <CardTitle>File Upload</CardTitle>
            <CardDescription>Drag and drop FRA data files here, or click to browse</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all transform ${
                isDragActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950 scale-105"
                  : "border-muted-foreground/25 hover:border-blue-400 hover:bg-muted/10"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              {isDragActive ? (
                <p className="text-lg font-medium text-blue-600">Drop the files here...</p>
              ) : (
                <div>
                  <p className="text-lg font-semibold mb-1">Drag & drop files</p>
                  <p className="text-sm text-muted-foreground">CSV & XML supported</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Uploaded files */}
        {displayList.length > 0 && (
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-xl">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Uploaded Files</CardTitle>
                <CardDescription>Processing status of your uploaded files</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto w-full">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data Points</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayList.map((item) => {
                      const isPersist = (item as any).__persist
                      const dataLength = isPersist
                        ? (item as any).data?.length ?? "-"
                        : (item as InFlightItem).data?.length ?? "-"
                      const status =
                        isPersist ? "success" : (item as InFlightItem).status === "processing" ? "processing" : "error"
                      return (
                        <TableRow key={(item as any).id} className="hover:bg-muted/30 transition">
                          <TableCell className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {(item as any).name}
                          </TableCell>
                          <TableCell>
                            {status === "processing" && <Badge variant="secondary">Processing</Badge>}
                            {status === "success" && (
                              <Badge variant="default" className="bg-green-500 text-white">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Success
                              </Badge>
                            )}
                            {status === "error" && (
                              <Badge variant="destructive">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Error
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{dataLength}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => setSelectedDisplayId((item as any).id)}>
                              View Data
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal */}
        <Dialog open={!!selectedDisplayId} onOpenChange={() => setSelectedDisplayId(null)}>
          <DialogContent className="sm:max-w-full w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{getSelectedData()?.name ?? "Details"}</DialogTitle>
            </DialogHeader>

            {getSelectedData() && (
              <div ref={dialogReportRef} className="space-y-4 p-2">
                <p><strong>Data Points:</strong> {(getSelectedData()!.data?.length ?? 0)}</p>
                <p><strong>Status:</strong> {(getSelectedData()!.analysis?.status ?? "-")}</p>
                <p><strong>Score:</strong> {(getSelectedData()!.analysis?.score ?? "-")}</p>

                <div className="p-3 border rounded bg-muted/30">
                  <strong>AI Summary:</strong>
                  <p className="mt-2">{getSelectedData()!.analysis?.summary ?? "No summary"}</p>
                </div>

                {getSelectedData()!.data && getSelectedData()!.data.length > 0 && (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getSelectedData()!.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="frequency" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="magnitude" stroke="#2563eb" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" onClick={exportCSV}>Export CSV</Button>
                  <Button size="sm" onClick={exportExcel}>Export Excel</Button>
                  <Button size="sm" onClick={exportPDF}>Export PDF</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
