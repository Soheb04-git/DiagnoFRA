// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { FileText, Download, Calendar, Clock } from "lucide-react"
// import { generatePDFReport } from "@/lib/pdf-generator"
// import { analyzeFRAData } from "@/lib/mock-ai"
// import type { FRAData } from "@/lib/file-parser"
// import { toast } from "sonner"

// interface ReportsPageProps {
//   files: Array<{ name: string; data: FRAData[]; uploadTime: Date }>
// }

// interface GeneratedReport {
//   id: string
//   fileName: string
//   generatedAt: Date
//   faultType: string
//   confidence: number
// }

// export function ReportsPage({ files }: ReportsPageProps) {
//   const [selectedFile, setSelectedFile] = useState<string>("")
//   const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([])
//   const [isGenerating, setIsGenerating] = useState(false)

//   const handleGenerateReport = async () => {
//     if (!selectedFile) return

//     setIsGenerating(true)

//     try {
//       const file = files.find((f) => f.name === selectedFile)
//       if (!file) return

//       const analysis = analyzeFRAData(file.data, file.name)

//       // Generate PDF
//       await generatePDFReport({
//         fileName: file.name,
//         uploadTime: file.uploadTime,
//         analysis,
//         dataPoints: file.data.length,
//         frequencyRange: {
//           min: Math.min(...file.data.map((d) => d.frequency)),
//           max: Math.max(...file.data.map((d) => d.frequency)),
//         },
//       })

//       // Add to generated reports list
//       const newReport: GeneratedReport = {
//         id: Date.now().toString(),
//         fileName: file.name,
//         generatedAt: new Date(),
//         faultType: analysis.faultType,
//         confidence: analysis.confidence,
//       }

//       setGeneratedReports((prev) => [newReport, ...prev])
//       toast.success("Report generated successfully!")
//     } catch (error) {
//       toast.error("Failed to generate report")
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleDownloadReport = (report: GeneratedReport) => {
//     // In a real app, this would download the stored PDF
//     toast.info("Report download would start here")
//   }

//   if (files.length === 0) {
//     return (
//       <div className="container mx-auto p-6">
//         <div className="text-center py-12">
//           <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
//           <h2 className="text-2xl font-semibold mb-2">No Data Available</h2>
//           <p className="text-muted-foreground">Upload some FRA data files to generate reports</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Analysis Reports</h1>
//           <p className="text-muted-foreground">Generate and manage PDF reports for your FRA analyses</p>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Generate New Report</CardTitle>
//           <CardDescription>Select a file to generate a comprehensive PDF analysis report</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex items-center gap-4">
//             <Select value={selectedFile} onValueChange={setSelectedFile}>
//               <SelectTrigger className="flex-1">
//                 <SelectValue placeholder="Select a file to generate report" />
//               </SelectTrigger>
//               <SelectContent>
//                 {files.map((file) => (
//                   <SelectItem key={file.name} value={file.name}>
//                     {file.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Button onClick={handleGenerateReport} disabled={!selectedFile || isGenerating} className="min-w-32">
//               {isGenerating ? "Generating..." : "Generate Report"}
//             </Button>
//           </div>

//           {selectedFile && (
//             <div className="p-4 bg-muted rounded-lg">
//               <h4 className="font-medium mb-2">Report will include:</h4>
//               <ul className="text-sm text-muted-foreground space-y-1">
//                 <li>• Executive summary with fault detection results</li>
//                 <li>• Detailed frequency response analysis</li>
//                 <li>• AI-powered diagnostic explanations</li>
//                 <li>• Technical recommendations and next steps</li>
//                 <li>• Data visualization charts and graphs</li>
//               </ul>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {generatedReports.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Generated Reports</CardTitle>
//             <CardDescription>Previously generated analysis reports</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>File Name</TableHead>
//                   <TableHead>Generated</TableHead>
//                   <TableHead>Fault Type</TableHead>
//                   <TableHead>Confidence</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {generatedReports.map((report) => (
//                   <TableRow key={report.id}>
//                     <TableCell className="flex items-center gap-2">
//                       <FileText className="h-4 w-4" />
//                       {report.fileName}
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2 text-sm">
//                         <Calendar className="h-3 w-3" />
//                         {report.generatedAt.toLocaleDateString()}
//                         <Clock className="h-3 w-3 ml-2" />
//                         {report.generatedAt.toLocaleTimeString()}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant={report.faultType === "Healthy" ? "default" : "destructive"}>
//                         {report.faultType}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>{(report.confidence * 100).toFixed(1)}%</TableCell>
//                     <TableCell>
//                       <Button size="sm" variant="outline" onClick={() => handleDownloadReport(report)}>
//                         <Download className="h-3 w-3 mr-1" />
//                         Download
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       )}

//       <Card>
//         <CardHeader>
//           <CardTitle>Report Templates</CardTitle>
//           <CardDescription>Available report formats and customization options</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="p-4 border rounded-lg">
//               <h4 className="font-medium mb-2">Standard Report</h4>
//               <p className="text-sm text-muted-foreground mb-3">Comprehensive analysis with all diagnostic details</p>
//               <Badge variant="outline">Default</Badge>
//             </div>
//             <div className="p-4 border rounded-lg opacity-50">
//               <h4 className="font-medium mb-2">Executive Summary</h4>
//               <p className="text-sm text-muted-foreground mb-3">High-level overview for management review</p>
//               <Badge variant="secondary">Coming Soon</Badge>
//             </div>
//             <div className="p-4 border rounded-lg opacity-50">
//               <h4 className="font-medium mb-2">Technical Deep Dive</h4>
//               <p className="text-sm text-muted-foreground mb-3">Detailed technical analysis for engineers</p>
//               <Badge variant="secondary">Coming Soon</Badge>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download, Calendar, Clock } from "lucide-react"
import { generatePDFReport } from "@/lib/pdf-generator"
import type { FRAData } from "@/lib/file-parser"
import { toast } from "sonner"

interface ReportsPageProps {
  files: Array<{ name: string; data: FRAData[]; uploadTime: Date; analysis?: any }>
}

interface GeneratedReport {
  id: string
  fileName: string
  generatedAt: Date
  status: string
  score: number
  summary: string
  template: "standard" | "executive" | "technical"
}

export function ReportsPage({ files }: ReportsPageProps) {
  const [selectedFile, setSelectedFile] = useState<string>("")
  const [selectedTemplate, setSelectedTemplate] = useState<"standard" | "executive" | "technical">("standard")
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = async () => {
    if (!selectedFile) return
    setIsGenerating(true)

    try {
      const file = files.find((f) => f.name === selectedFile)
      if (!file) return
      if (!file.analysis) {
        toast.error("No analysis available for this file")
        return
      }

      // Generate PDF with template
      await generatePDFReport({
        fileName: file.name,
        uploadTime: file.uploadTime,
        analysis: file.analysis,
        dataPoints: file.data.length,
        frequencyRange: {
          min: Math.min(...file.data.map((d) => d.frequency)),
          max: Math.max(...file.data.map((d) => d.frequency)),
        },
        template: selectedTemplate,
      })

      // Add to generated reports list
      const newReport: GeneratedReport = {
        id: Date.now().toString(),
        fileName: file.name,
        generatedAt: new Date(),
        status: file.analysis.status,
        score: file.analysis.score,
        summary: file.analysis.summary,
        template: selectedTemplate,
      }

      setGeneratedReports((prev) => [newReport, ...prev])
      toast.success(`Report (${selectedTemplate}) generated successfully!`)
    } catch (error) {
      console.error(error)
      toast.error("Failed to generate report")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadReport = (report: GeneratedReport) => {
    // In a real app, this would download the stored PDF
    toast.info(`Report download for ${report.fileName} (${report.template}) would start here`)
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy":
        return <Badge className="bg-green-500">{status}</Badge>
      case "degraded":
        return <Badge className="bg-yellow-500 text-black">{status}</Badge>
      case "faulty":
        return <Badge className="bg-red-500">{status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (files.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Data Available</h2>
          <p className="text-muted-foreground">Upload some FRA data files to generate reports</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analysis Reports</h1>
          <p className="text-muted-foreground">Generate and manage PDF reports for your FRA analyses</p>
        </div>
      </div>

      {/* Generate New Report */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
          <CardDescription>Select a file and template to generate a PDF analysis report</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Select value={selectedFile} onValueChange={setSelectedFile}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a file to generate report" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md">
                {files.map((file) => (
                  <SelectItem
                    key={file.name}
                    value={file.name}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {file.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleGenerateReport} disabled={!selectedFile || isGenerating} className="min-w-32">
              {isGenerating ? "Generating..." : "Generate Report"}
            </Button>
          </div>

          {selectedFile && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Report will include:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Executive summary with status and score</li>
                <li>• Detailed frequency response analysis</li>
                <li>• AI-powered diagnostic explanation</li>
                <li>• Technical recommendations and next steps</li>
                <li>• Data visualization charts and graphs</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Reports List */}
      {generatedReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
            <CardDescription>Previously generated analysis reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {generatedReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {report.fileName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3" />
                        {report.generatedAt.toLocaleDateString()}
                        <Clock className="h-3 w-3 ml-2" />
                        {report.generatedAt.toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>{report.score}%</TableCell>
                    <TableCell className="max-w-xs truncate" title={report.summary}>
                      {report.summary}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{report.template}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleDownloadReport(report)}>
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>Choose a template before generating</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div
              onClick={() => setSelectedTemplate("standard")}
              className={`p-4 border rounded-lg cursor-pointer transition ${
                selectedTemplate === "standard" ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <h4 className="font-medium mb-2">Standard Report</h4>
              <p className="text-sm text-muted-foreground mb-3">Comprehensive analysis with all diagnostic details</p>
              <Badge variant="outline">Default</Badge>
            </div>

            <div
              onClick={() => setSelectedTemplate("executive")}
              className={`p-4 border rounded-lg cursor-pointer transition ${
                selectedTemplate === "executive" ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <h4 className="font-medium mb-2">Executive Summary</h4>
              <p className="text-sm text-muted-foreground mb-3">High-level overview for management review</p>
              <Badge variant="secondary">Available</Badge>
            </div>

            <div
              onClick={() => setSelectedTemplate("technical")}
              className={`p-4 border rounded-lg cursor-pointer transition ${
                selectedTemplate === "technical" ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <h4 className="font-medium mb-2">Technical Deep Dive</h4>
              <p className="text-sm text-muted-foreground mb-3">Detailed technical analysis for engineers</p>
              <Badge variant="secondary">Available</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
