"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, Check, Edit2, AlertCircle, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useAuth } from "@/lib/AuthContext"
import { createClient } from "@/lib/supabase"

export default function ProfileSection() {
  const { user, updateUser, updateUserMetadata } = useAuth()
  const supabase = createClient()
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [username, setUsername] = useState("")
  const [tempUsername, setTempUsername] = useState("")
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [userData, setUserData] = useState(null)
  const [uploadError, setUploadError] = useState(null)
  const fileInputRef = useRef(null)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [resendEmailStatus, setResendEmailStatus] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        console.log('No user found in AuthContext, skipping profile fetch')
        return
      }

      try {
        console.log('Starting fetchUserData with user:', {
          id: user.id,
          email: user.email,
          isAuthenticated: !!user
        })
        
        // Get fresh Supabase client for each request
        const supabase = createClient()
        
        // First verify the session is active
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          console.error('Session error:', sessionError)
          return
        }
        
        if (!session) {
          console.error('No active session found')
          return
        }
        
        console.log('Active session found for user:', session.user.id)
        
        // Fetch profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', {
            code: error.code,
            message: error.message,
            details: error.details
          })
          
          // If no profile exists yet, create one
          if (error.code === 'PGRST116') {
            console.log('No profile found, creating new profile for user:', session.user.id)
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([
                { 
                  id: session.user.id, 
                  username: session.user.email?.split('@')[0] || 'user',
                  avatar_url: null
                }
              ])
              .select()
              .single()
            
            if (createError) {
              console.error('Error creating profile:', {
                code: createError.code,
                message: createError.message,
                details: createError.details
              })
              throw createError
            }
            
            if (newProfile) {
              console.log('New profile created successfully:', newProfile)
              setUserData(newProfile)
              setUsername(newProfile.username)
              setTempUsername(newProfile.username)
            }
          } else {
            throw error
          }
        } else if (data) {
          console.log('Profile found:', data)
          setUserData(data)
          setUsername(data.username || session.user.email?.split('@')[0] || 'user')
          setTempUsername(data.username || session.user.email?.split('@')[0] || 'user')
          
          // If user has a custom avatar, get it from storage
          if (data.avatar_url) {
            try {
              // First check if the file exists in storage
              const { data: fileExists } = await supabase
                .storage
                .from('avatars')
                .list('', {
                  search: data.avatar_url
                })

              if (!fileExists?.length) {
                console.log('Avatar file not found in storage, falling back to default')
                // Clear the avatar_url from the profile since the file doesn't exist
                const { error: updateError } = await supabase
                  .from('profiles')
                  .update({ avatar_url: null })
                  .eq('id', session.user.id)
                
                if (updateError) {
                  console.error('Error clearing invalid avatar_url:', updateError)
                }
                
                // Fall back to Google avatar if available
                if (session.user.user_metadata?.avatar_url) {
                  setAvatarUrl(session.user.user_metadata.avatar_url)
                }
                return
              }

              console.log('Fetching signed URL for avatar:', data.avatar_url)
              const { data: avatarData, error: urlError } = await supabase
                .storage
                .from('avatars')
                .createSignedUrl(data.avatar_url, 3600)
              
              if (urlError) {
                console.error('Error getting signed URL:', urlError)
                // Fall back to Google avatar if available
                if (session.user.user_metadata?.avatar_url) {
                  setAvatarUrl(session.user.user_metadata.avatar_url)
                }
                return
              }
              
              if (avatarData?.signedUrl) {
                console.log('Setting avatar URL from storage:', avatarData.signedUrl)
                setAvatarUrl(avatarData.signedUrl)
              }
            } catch (urlError) {
              console.error('Error in avatar URL processing:', urlError)
              // Fall back to Google avatar if available
              if (session.user.user_metadata?.avatar_url) {
                setAvatarUrl(session.user.user_metadata.avatar_url)
              }
            }
          } else if (session.user.user_metadata?.avatar_url) {
            // If no profile avatar but Google avatar exists
            setAvatarUrl(session.user.user_metadata.avatar_url)
          }
        }
      } catch (error) {
        console.error('Error in fetchUserData:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          details: error.details
        })
      }
    }

    fetchUserData()
  }, [user])

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)
    setUploadError(null)

    try {
      if (!user) {
        throw new Error("You must be logged in to upload an avatar")
      }

      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload an image file")
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size must be less than 5MB")
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatarPreview(event.target.result)
      }
      reader.readAsDataURL(file)

      // Get fresh Supabase client
      const supabase = createClient()
      
      // Use a more structured file path
      const filePath = `${user.id}/${file.name}`

      console.log('Preparing to upload avatar:', {
        filePath,
        fileSize: file.size,
        fileType: file.type,
        userId: user.id
      })

      // Delete old avatar if exists
      if (userData?.avatar_url) {
        try {
          console.log('Attempting to remove old avatar:', userData.avatar_url)
          const { error: removeError } = await supabase
            .storage
            .from('avatars')
            .remove([userData.avatar_url])
          
          if (removeError) {
            console.error('Error removing old avatar:', removeError)
          } else {
            console.log('Successfully removed old avatar')
          }
        } catch (removeError) {
          console.error('Error in remove operation:', removeError)
        }
      }

      // Upload new avatar
      console.log('Uploading avatar to path:', filePath)
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          metadata: {
            owner: user.id,
            mimetype: file.type
          }
        })

      if (uploadError) {
        console.error('Upload error details:', uploadError)
        throw new Error(`Upload failed: ${uploadError.message || 'Unknown error'}`)
      }

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', user.id)

      if (updateError) {
        console.error('Profile update error:', updateError)
        throw new Error(`Failed to update profile: ${updateError.message}`)
      }

      // Get signed URL for immediate display
      const { data: urlData, error: urlError } = await supabase
        .storage
        .from('avatars')
        .createSignedUrl(filePath, 3600)

      if (urlError) {
        console.error('Signed URL error:', urlError)
        throw new Error(`Failed to get signed URL: ${urlError.message}`)
      }

      if (urlData?.signedUrl) {
        console.log('Setting avatar URL:', urlData.signedUrl)
        setAvatarUrl(urlData.signedUrl)
        setAvatarPreview(null)
        
        // Update local userData
        setUserData(prev => ({
          ...prev,
          avatar_url: filePath
        }))
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      setUploadError(error.message || 'An unknown error occurred')
      setAvatarPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleUsernameEdit = () => {
    setIsEditingUsername(true)
    setTempUsername(username)
  }

  const handleUsernameSave = async () => {
    if (tempUsername.trim()) {
      try {
        // Update profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ username: tempUsername })
          .eq('id', user.id)

        if (profileError) throw profileError

        // Update user metadata using AuthContext
        const { error: metadataError } = await updateUserMetadata({
          username: tempUsername
        })

        if (metadataError) throw metadataError

        setUsername(tempUsername)
      } catch (error) {
        console.error('Error updating username:', error)
      }
    }
    setIsEditingUsername(false)
  }

  const handleUsernameCancel = () => {
    setTempUsername(username)
    setIsEditingUsername(false)
  }

  const handleResendConfirmation = async () => {
    if (!user?.email) return
    
    setIsResendingEmail(true)
    setResendEmailStatus(null)
    
    try {
      console.log('Attempting to resend confirmation email to:', user.email)
      
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      console.log('Resend response:', { data, error })

      if (error) {
        throw error
      }

      setResendEmailStatus({
        type: 'success',
        message: 'Confirmation email sent! Please check your inbox and spam folder. It may take a few minutes to arrive. If you still don\'t receive it, please check your Supabase email settings.'
      })
    } catch (error) {
      console.error('Error resending confirmation:', error)
      setResendEmailStatus({
        type: 'error',
        message: `Failed to send confirmation email: ${error.message}. Please ensure your Supabase project has email service configured.`
      })
    } finally {
      setIsResendingEmail(false)
    }
  }

  const usagePercentage = userData?.thumbnails_used 
    ? (userData.thumbnails_used / (userData.thumbnails_limit || 50)) * 100 
    : 0

  return (
    <div className="space-y-8">
      {/* User Info Card */}
      <div className="bg-[#1a1a1a] border border-zinc-800 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center">
              {avatarPreview || avatarUrl ? (
                <img
                  src={avatarPreview || avatarUrl}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Error loading avatar image:', e);
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<span class="text-4xl text-zinc-400">${username?.charAt(0).toUpperCase()}</span>`;
                  }}
                />
              ) : (
                <span className="text-4xl text-zinc-400">{username?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div
              className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-6 w-6 text-white" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              className="hidden" 
              accept="image/*"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="flex-grow">
            {/* Username */}
            <div className="mb-4">
              {isEditingUsername ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1 text-white focus:outline-none focus:border-zinc-500"
                    autoFocus
                  />
                  <button
                    onClick={handleUsernameSave}
                    className="p-1.5 bg-green-600/20 text-green-500 rounded-full hover:bg-green-600/30 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleUsernameCancel}
                    className="p-1.5 bg-red-600/20 text-red-500 rounded-full hover:bg-red-600/30 transition-colors"
                  >
                    <AlertCircle className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{username}</h2>
                  <button
                    onClick={handleUsernameEdit}
                    className="p-1.5 bg-zinc-800 text-zinc-400 rounded-full hover:bg-zinc-700 hover:text-white transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Email with verification badge */}
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">{user?.email}</span>
                {user?.app_metadata?.provider === 'google' ? (
                  <span className="px-2 py-0.5 bg-green-900/30 text-green-500 text-xs rounded-full">Verified with Google</span>
                ) : user?.email_confirmed_at ? (
                  <span className="px-2 py-0.5 bg-green-900/30 text-green-500 text-xs rounded-full">Verified</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-yellow-900/30 text-yellow-500 text-xs rounded-full">Unverified</span>
                    <button
                      onClick={handleResendConfirmation}
                      disabled={isResendingEmail}
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-md transition-colors",
                        isResendingEmail
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                      )}
                    >
                      {isResendingEmail ? (
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        "Resend confirmation"
                      )}
                    </button>
                  </div>
                )}
              </div>
              
              {resendEmailStatus && (
                <div className={cn(
                  "text-sm px-3 py-2 rounded-md",
                  resendEmailStatus.type === 'success' 
                    ? "bg-green-900/30 text-green-500 border border-green-800/50" 
                    : "bg-red-900/30 text-red-500 border border-red-800/50"
                )}>
                  {resendEmailStatus.message}
                </div>
              )}
            </div>

            {/* Registration date */}
            <div className="text-sm text-zinc-500">
              Member since {format(new Date(user?.created_at || new Date()), "MMMM d, yyyy")}
            </div>
          </div>
        </div>
      </div>

      {/* Plan Information */}
      <div className="bg-[#1a1a1a] border border-zinc-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Plan Information</h3>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-white font-medium">{userData?.plan || 'Free'}</span>
              <span className="text-zinc-400"> – {userData?.thumbnails_limit || 50} thumbnails/month</span>
            </div>
            <button className="px-4 py-1.5 bg-white text-black font-medium rounded-md hover:bg-zinc-200 transition-colors">
              Upgrade Plan
            </button>
          </div>

          <div className="mb-1 flex justify-between text-sm">
            <span className="text-zinc-400">Usage</span>
            <span className="text-zinc-400">
              {userData?.thumbnails_used || 0} / {userData?.thumbnails_limit || 50} thumbnails used
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full",
                usagePercentage > 90 ? "bg-red-500" : usagePercentage > 75 ? "bg-yellow-500" : "bg-green-500",
              )}
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
        </div>

        {userData?.next_billing_date && (
          <div className="text-sm text-zinc-400">
            Next billing date: {format(new Date(userData.next_billing_date), "MMMM d, yyyy")}
          </div>
        )}
      </div>
    </div>
  )
}
