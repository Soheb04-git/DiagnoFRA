// "use client"

// import type React from "react"
// import Link from "next/link"
// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
// import { AuthCard } from "@/components/auth/auth-card"

// export default function RegisterPage() {
//   const [show, setShow] = useState(false)
//   const router = useRouter()

//   function onSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault()
//     const form = new FormData(e.currentTarget)
//     const name = form.get("name")
//     const email = form.get("email")
//     const password = form.get("password")

//     const users = JSON.parse(localStorage.getItem("users") || "[]")
//     users.push({ name, email, password })
//     localStorage.setItem("users", JSON.stringify(users))

//     router.push("/auth/login") // redirect after register
//   }

//   return (
//     <AuthCard
//       title="Create your account"
//       description="Start diagnosing your Transformer models."
//       footer={
//         <span>
//           Have an account?{" "}
//           <Link href="/auth/login" className="text-foreground underline underline-offset-2">
//             Sign in
//           </Link>
//         </span>
//       }
//     >
//       <form className="grid gap-4" onSubmit={onSubmit}>
//         <div className="grid gap-2">
//           <Label htmlFor="name">Full name</Label>
//           <Input id="name" name="name" type="text" placeholder="Ada Lovelace" required />
//         </div>
//         <div className="grid gap-2">
//           <Label htmlFor="email">Email</Label>
//           <Input id="email" name="email" type="email" placeholder="you@company.com" required />
//         </div>
//         <div className="grid gap-2">
//           <Label htmlFor="password">Password</Label>
//           <Input id="password" name="password" type={show ? "text" : "password"} required />
//         </div>
//         <div className="grid gap-2">
//           <Label htmlFor="confirm">Confirm password</Label>
//           <Input id="confirm" type={show ? "text" : "password"} required />
//         </div>
//         <div className="flex items-center gap-2 text-sm">
//           <Checkbox id="terms" required />
//           <label htmlFor="terms" className="select-none">
//             I agree to the{" "}
//             <Link href="#" className="underline underline-offset-2">
//               Terms
//             </Link>{" "}
//             and{" "}
//             <Link href="#" className="underline underline-offset-2">
//               Privacy
//             </Link>
//           </label>
//           <button
//             type="button"
//             onClick={() => setShow((s) => !s)}
//             className="ml-auto text-xs text-muted-foreground underline underline-offset-2"
//           >
//             {show ? "Hide" : "Show"} passwords
//           </button>
//         </div>
//         <Button type="submit" className="w-full">
//           Create account
//         </Button>
//       </form>
//     </AuthCard>
//   )
// }

"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AuthCard } from "@/components/auth/auth-card"

export default function RegisterPage() {
  const [show, setShow] = useState(false)
  const router = useRouter()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = form.get("name")
    const email = form.get("email")
    const password = form.get("password")

    // Save user
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    users.push({ name, email, password })
    localStorage.setItem("users", JSON.stringify(users))

    // Auto-login
    localStorage.setItem("isLoggedIn", "true")

    // Redirect straight to dashboard
    router.push("/dashboard")
  }

  return (
    <AuthCard
      title="Create your account"
      description="Start diagnosing your Transformer models."
      footer={
        <span>
          Have an account?{" "}
          <Link href="/auth/login" className="text-foreground underline underline-offset-2">
            Sign in
          </Link>
        </span>
      }
    >
      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" type="text" placeholder="Ada Lovelace" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@company.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type={show ? "text" : "password"} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" type={show ? "text" : "password"} required />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Checkbox id="terms" required />
          <label htmlFor="terms" className="select-none">
            I agree to the{" "}
            <Link href="#" className="underline underline-offset-2">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline underline-offset-2">
              Privacy
            </Link>
          </label>
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="ml-auto text-xs text-muted-foreground underline underline-offset-2"
          >
            {show ? "Hide" : "Show"} passwords
          </button>
        </div>
        <Button type="submit" className="w-full">
          Create account
        </Button>
      </form>
    </AuthCard>
  )
}
