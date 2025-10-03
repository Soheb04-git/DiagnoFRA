// "use client"

// import { Upload, BarChart3, GitCompare, FileText, Activity } from "lucide-react"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"

// const items = [
//   {
//     title: "Upload Data",
//     url: "upload",
//     icon: Upload,
//   },
//   {
//     title: "Dashboard",
//     url: "dashboard",
//     icon: BarChart3,
//   },
//   {
//     title: "Compare",
//     url: "compare",
//     icon: GitCompare,
//   },
//   {
//     title: "Reports",
//     url: "reports",
//     icon: FileText,
//   },
// ]

// interface AppSidebarProps {
//   currentPage: string
//   onPageChange: (page: string) => void
// }

// export function AppSidebar({ currentPage, onPageChange }: AppSidebarProps) {
//   return (
//     <Sidebar>
//       <SidebarHeader className="border-b border-sidebar-border">
//         <div className="flex items-center gap-2 px-4 py-2">
//           <Activity className="h-6 w-6 text-blue-600" />
//           <div>
//             <h1 className="font-semibold text-sidebar-foreground">FRA Dashboard</h1>
//             <p className="text-xs text-sidebar-foreground/70">Transformer Diagnostics</p>
//           </div>
//         </div>
//       </SidebarHeader>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>Navigation</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {items.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton onClick={() => onPageChange(item.url)} isActive={currentPage === item.url}>
//                     <item.icon />
//                     <span>{item.title}</span>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   )
// }

"use client"

import { Upload, BarChart3, GitCompare, FileText, Activity, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Upload Data",
    url: "upload",
    icon: Upload,
  },
  {
    title: "Dashboard",
    url: "dashboard",
    icon: BarChart3,
  },
  {
    title: "Compare",
    url: "compare",
    icon: GitCompare,
  },
  {
    title: "Reports",
    url: "reports",
    icon: FileText,
  },
]

interface AppSidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export function AppSidebar({ currentPage, onPageChange }: AppSidebarProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/landing")
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-4 py-2">
            {/* Replace icon with logo */}
            <Image
              src="/placeholder.png"
              alt="DiagnoFRA Logo"
              width={100}
              height={32}
              className="rounded-sm"
              priority
            />
            <div>
              <h1 className="font-semibold text-sidebar-foreground">DiagnoFRA</h1>
              <p className="text-xs text-sidebar-foreground/70">Transformer Diagnostics</p>
            </div>
          </div>
        </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between h-full">
        <div>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton onClick={() => onPageChange(item.url)} isActive={currentPage === item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
        {/* 🚪 Logout at bottom */}
        <div className="p-4 border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
