"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import DashboardHeader from "./dashboard-header"
import ProfileSection from "./profile-section"
import SettingsSection from "./settings-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Settings } from "lucide-react"
import { useLanguage } from "@/lib/LanguageContext"

export default function UserDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabParam === 'settings' ? 'settings' : 'profile')
  const { t } = useLanguage()

  // Update active tab when URL parameter changes
  useEffect(() => {
    const newTab = tabParam === 'settings' ? 'settings' : 'profile'
    if (newTab !== activeTab) {
      setActiveTab(newTab)
    }
  }, [tabParam, activeTab])

  const handleTabChange = (value) => {
    setActiveTab(value)
    router.push(`/dashboard/account?tab=${value}`)
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Account Dashboard</h1>

          <Tabs value={activeTab} className="w-full" onValueChange={handleTabChange}>
            <div className="relative border-b border-zinc-800">
              <TabsList className="relative z-10 bg-transparent h-auto p-0 w-full flex gap-8">
                <TabsTrigger
                  value="profile"
                  className="group relative px-1 py-3 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-none"
                >
                  <div className="flex items-center gap-2 text-zinc-400 group-data-[state=active]:text-white transition-colors duration-200">
                    <User className="h-4 w-4" />
                    {t('header.profile')}
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]" />
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="group relative px-1 py-3 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-none"
                >
                  <div className="flex items-center gap-2 text-zinc-400 group-data-[state=active]:text-white transition-colors duration-200">
                    <Settings className="h-4 w-4" />
                    {t('header.settings')}
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]" />
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent 
              value="profile" 
              className="mt-6 focus-visible:outline-none"
            >
              <ProfileSection />
            </TabsContent>

            <TabsContent 
              value="settings" 
              className="mt-6 focus-visible:outline-none"
            >
              <SettingsSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
