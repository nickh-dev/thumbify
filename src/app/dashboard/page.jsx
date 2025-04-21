"use client"

import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ThumbnailGenerator from "@/components/thumbnail-generator"
import DashboardHeader from "@/components/dashboard-header"
import { useLanguage } from "@/lib/LanguageContext"
import { createClient } from "@/lib/supabase"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [displayName, setDisplayName] = useState("")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        // Try to get username from sessionStorage first
        const cachedProfile = sessionStorage.getItem(`profile_${user.id}`)
        if (cachedProfile) {
          const profile = JSON.parse(cachedProfile)
          setDisplayName(profile.username || user.email?.split('@')[0] || 'user')
          return
        }

        // If no cached profile, fetch from database
        const supabase = createClient()
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single()

        if (profile?.username) {
          setDisplayName(profile.username)
        } else {
          setDisplayName(user.email?.split('@')[0] || 'user')
        }
      }
    }

    fetchUserProfile()
  }, [user])

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
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-8">
            <div className="flex items-baseline gap-2 mb-1">
              <p className="text-zinc-400 text-lg">{t('dashboard.welcome')}</p>
              <p className="text-zinc-400 text-lg">{displayName}</p>
              <span className="text-yellow-400 text-2xl">👋</span>
            </div>
            <p className="text-zinc-400">{t('dashboard.createManage')}</p>
          </div>
          <ThumbnailGenerator />
        </div>
      </main>
    </div>
  )
} 