"use client"

import { useState, useEffect } from "react"
import { Menu, X, User, LogOut, History, Settings } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { getSession } from "@/lib/supabase"
import { useLanguage } from "@/lib/LanguageContext"

export default function DashboardHeader() {
  const { signOut, user, avatarUrl: contextAvatarUrl, updateAvatar } = useAuth()
  const { t } = useLanguage()
  const supabase = createClientComponentClient()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [displayName, setDisplayName] = useState("")

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single()

        if (error) throw error

        // Use profile username, fallback to user metadata username, then email
        setDisplayName(
          profile?.username || 
          user.user_metadata?.username || 
          user.email?.split('@')[0] || 
          'User'
        )
      } catch (error) {
        console.error('Error fetching profile:', error)
        // Fallback to user metadata or email
        setDisplayName(
          user.user_metadata?.username || 
          user.email?.split('@')[0] || 
          'User'
        )
      }
    }

    fetchUserProfile()
  }, [user])

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const session = await getSession()
        if (!session) return

        // First try to get the profile from the database
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          // Fall back to Google avatar if available
          if (session.user.user_metadata?.avatar_url) {
            updateAvatar(session.user.user_metadata.avatar_url)
          } else {
            updateAvatar('/images/default-avatar.svg')
          }
          return
        }

        if (profile?.avatar_url) {
          try {
            // Check if the file exists in storage first
            const { data: fileExists } = await supabase
              .storage
              .from('avatars')
              .list('', {
                search: profile.avatar_url
              })

            if (!fileExists?.length) {
              // File doesn't exist in storage, fall back to Google avatar
              if (session.user.user_metadata?.avatar_url) {
                updateAvatar(session.user.user_metadata.avatar_url)
              } else {
                updateAvatar('/images/default-avatar.svg')
              }
              return
            }

            // Get the signed URL for the avatar
            const { data: signedUrlData, error: signedUrlError } = await supabase
              .storage
              .from('avatars')
              .createSignedUrl(profile.avatar_url, 3600)
            
            if (signedUrlError) {
              console.error('Error getting signed URL:', signedUrlError)
              // Fall back to Google avatar if available
              if (session.user.user_metadata?.avatar_url) {
                updateAvatar(session.user.user_metadata.avatar_url)
              } else {
                updateAvatar('/images/default-avatar.svg')
              }
              return
            }

            if (signedUrlData?.signedUrl) {
              updateAvatar(signedUrlData.signedUrl)
            } else {
              throw new Error('No signed URL in response data')
            }
          } catch (urlError) {
            console.error('Error in avatar URL processing:', urlError)
            // Fall back to Google avatar if available
            if (session.user.user_metadata?.avatar_url) {
              updateAvatar(session.user.user_metadata.avatar_url)
            } else {
              updateAvatar('/images/default-avatar.svg')
            }
          }
        } else if (session.user.user_metadata?.avatar_url) {
          // If no profile avatar but Google avatar exists
          updateAvatar(session.user.user_metadata.avatar_url)
        } else {
          // Set a default avatar if no avatar is available
          updateAvatar('/images/default-avatar.svg')
        }
      } catch (error) {
        console.error('Error in fetchAvatar:', error)
        // Set a default avatar in case of any error
        updateAvatar('/images/default-avatar.svg')
      }
    }

    fetchAvatar()
  }, [user])

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      router.push("/")
    }
  }

  const isActive = (path) => pathname.includes(path)

  return (
    <header className="bg-[#0a0a0a] border-b border-zinc-800">
      <div className="w-full">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center ml-4">
            <Link href={user ? "/dashboard" : "/"} className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
              <img src="/images/icon.png" alt="Thumbify icon" className="h-7 w-7" />
              <span>Thumbify</span>
            </Link>
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-2 mr-4">
            <Link 
              href="/dashboard/history" 
              className={`text-xs px-3 py-1.5 rounded-md transition-colors duration-200 ${
                isActive('/history') 
                  ? 'bg-zinc-800 text-white' 
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              {t('header.history')}
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-800 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-zinc-700 rounded-full overflow-hidden flex items-center justify-center text-white">
                  {contextAvatarUrl ? (
                    <img src={contextAvatarUrl} alt="User avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <span className="text-sm text-white">{displayName}</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-md shadow-lg py-1 z-50">
                  <Link
                    href="/dashboard/account?tab=profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    {t('header.profile')}
                  </Link>
                  <Link
                    href="/dashboard/account?tab=settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    {t('header.settings')}
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('header.signOut')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-b border-zinc-800 py-4 px-6 space-y-4">
          <Link
            href="/dashboard/history"
            className="flex items-center gap-2 py-2 text-zinc-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <History className="h-5 w-5" />
            {t('header.history')}
          </Link>
          <Link
            href="/dashboard/account?tab=profile"
            className="flex items-center gap-2 py-2 text-zinc-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <User className="h-5 w-5" />
            {t('header.profile')}
          </Link>
          <Link
            href="/dashboard/account?tab=settings"
            className="flex items-center gap-2 py-2 text-zinc-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Settings className="h-5 w-5" />
            {t('header.settings')}
          </Link>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 py-2 text-zinc-400 hover:text-white w-full text-left"
          >
            <LogOut className="h-5 w-5" />
            {t('header.signOut')}
          </button>
          <div className="flex items-center gap-2 py-2 text-zinc-400">
            <User className="h-5 w-5" />
            <span>{displayName}</span>
          </div>
        </div>
      )}
    </header>
  )
}
