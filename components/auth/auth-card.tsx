// import { CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"
// import type { ReactNode } from "react"
// import { SocialButtons } from "./social-buttons"

// export function AuthCard({
//   title,
//   description,
//   children,
//   footer,
//   showSocial = true,
// }: {
//   title: string
//   description?: string
//   children: ReactNode
//   footer?: ReactNode
//   showSocial?: boolean
// }) {
//   return (
//     <>
//       <CardHeader className="space-y-1">
//         <CardTitle className="text-2xl">{title}</CardTitle>
//         {description ? <CardDescription>{description}</CardDescription> : null}
//       </CardHeader>
//       <CardContent className="grid gap-6">
//         {showSocial ? (
//           <>
//             <SocialButtons />
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <span className="w-full border-t" />
//               </div>
//               <div className="relative flex justify-center text-xs uppercase">
//                 <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
//               </div>
//             </div>
//           </>
//         ) : null}
//         {children}
//       </CardContent>
//       {footer ? <CardFooter className="justify-between text-sm text-muted-foreground">{footer}</CardFooter> : null}
//     </>
//   )
// }
"use client"

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import type { ReactNode } from "react"
import { SocialButtons } from "./social-buttons"

export function AuthCard({
  title,
  description,
  children,
  footer,
  showSocial = true,
}: {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  showSocial?: boolean
}) {
  return (
    <Card className="w-full max-w-md mx-auto rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="grid gap-6">
        {showSocial ? (
          <>
            <SocialButtons />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-neutral-900 px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
          </>
        ) : null}
        {children}
      </CardContent>
      {footer ? (
        <CardFooter className="justify-between text-sm text-muted-foreground">
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  )
}
