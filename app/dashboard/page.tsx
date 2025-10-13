"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { UploadPage } from "@/components/upload-page"
import { DashboardPage } from "@/components/dashboard-page"
import { ComparePage } from "@/components/compare-page"
import { ReportsPage } from "@/components/reports-page"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster, toast } from "sonner"

// ----------------------------
export type Page = "upload" | "dashboard" | "compare" | "reports"

export interface UploadedFile {
  name: string
  data: any
  uploadTime: Date
  analysis?: any
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>("upload")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()

  // 🔹 Auth guard
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!loggedIn) {
      router.replace("/")
    } else {
      setAuthChecked(true)
    }
  }, [router])

  // Load persisted uploads
  useEffect(() => {
    try {
      const raw = localStorage.getItem("uploaded_files_v1")
      if (raw) {
        const parsed = JSON.parse(raw) as any[]
        if (Array.isArray(parsed)) {
          const restored: UploadedFile[] = parsed.map((f) => ({
            ...f,
            uploadTime: new Date(f.uploadTime),
          }))
          setUploadedFiles(restored)
        }
      }
    } catch (e) {
      console.warn("Failed to load persisted uploaded files", e)
    }
  }, [])

  // Persist uploads
  useEffect(() => {
    try {
      localStorage.setItem("uploaded_files_v1", JSON.stringify(uploadedFiles))
    } catch (e) {
      console.warn("Failed to persist uploaded files", e)
    }
  }, [uploadedFiles])

  const handleFileUploaded = (file: {
    name: string
    data: any
    uploadTime?: string | Date
    analysis?: any
  }) => {
    const uploadTime: Date =
      file.uploadTime instanceof Date
        ? file.uploadTime
        : typeof file.uploadTime === "string"
        ? new Date(file.uploadTime)
        : new Date()

    const newItem: UploadedFile = {
      name: file.name,
      data: file.data,
      uploadTime,
      analysis: file.analysis,
    }

    setUploadedFiles((prev) => [...prev, newItem])

    toast.success(`Processed ${file.name}`, { duration: 2000, position: "top-right" })
  }

  const handleClearHistory = () => {
    try {
      setUploadedFiles([]) // clears list globally
      localStorage.removeItem("uploaded_files_v1") // remove saved data
      toast.success("Upload history cleared", { duration: 2000, position: "top-right" })
    } catch (e) {
      console.warn("Failed to clear upload history", e)
      toast.error("Failed to clear upload history")
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case "upload":
        return <UploadPage onFileUploaded={handleFileUploaded} uploadedFiles={uploadedFiles} onClearHistory={handleClearHistory} />
      case "dashboard":
        return <DashboardPage files={uploadedFiles} hasFiles={uploadedFiles.length > 0} />
      case "compare":
        return <ComparePage files={uploadedFiles} hasFiles={uploadedFiles.length > 1} />
      case "reports":
        return <ReportsPage files={uploadedFiles} />
      default:
        return <UploadPage onFileUploaded={handleFileUploaded} uploadedFiles={uploadedFiles} />
    }
  }

  // 🔹 Show nothing until auth check is done
  if (!authChecked) return null

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <AppSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-transparent">
            {renderPage()}
          </div>
        </SidebarInset>
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  )
}
