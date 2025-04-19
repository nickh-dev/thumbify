"use client"

import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import ThumbnailGenerator from "@/components/thumbnail-generator"
import DashboardHeader from "@/components/dashboard-header"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome, {user?.email}</h1>
            <p className="text-zinc-400">Create and manage your thumbnails</p>
          </div>
          <ThumbnailGenerator />
        </div>
      </main>
    </div>
  )
} 