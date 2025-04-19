import UserDashboard from "@/components/user-dashboard"
import { Suspense } from "react"

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#121212] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin"></div>
    </div>}>
      <UserDashboard />
    </Suspense>
  )
}
