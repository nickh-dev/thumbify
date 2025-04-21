"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, Check, Edit2, AlertCircle, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useAuth } from "@/lib/AuthContext"
import { createClient } from "@/lib/supabase"
import { useLanguage } from "@/lib/LanguageContext"

export default function ProfileSection() {
  const { user, updateUser, updateUserMetadata, updateAvatar } = useAuth()
  const { t } = useLanguage()
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
  const avatarImageRef = useRef(null)
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(true)

  // Move sessionStorage operations to useEffect
  useEffect(() => {
    if (typeof window !== 'undefined' && user?.id && avatarUrl) {
      sessionStorage.setItem(`avatar_${user.id}`, avatarUrl);
    }
  }, [user?.id, avatarUrl]);

  // Preload avatar image
  useEffect(() => {
    if (typeof window !== 'undefined' && avatarUrl) {
      const img = new Image();
      img.src = avatarUrl;
      avatarImageRef.current = img;
    }
  }, [avatarUrl]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        setIsLoadingAvatar(true);
        const cachedProfile = sessionStorage.getItem(`profile_${user.id}`);
        if (cachedProfile) {
          const profile = JSON.parse(cachedProfile);
          setUserData(profile);
          setUsername(profile.username || user.email?.split('@')[0] || 'user');
          setTempUsername(profile.username || user.email?.split('@')[0] || 'user');
          
          // Check if we need to refresh the signed URL
          if (profile.avatar_url) {
            const { data: avatarData } = await supabase
              .storage
              .from('avatars')
              .createSignedUrl(profile.avatar_url, 3600);
            
            if (avatarData?.signedUrl) {
              setAvatarUrl(avatarData.signedUrl);
              sessionStorage.setItem(`avatar_${user.id}`, avatarData.signedUrl);
            }
          } else {
            // Only use Google avatar if no custom avatar exists
            setAvatarUrl(user.user_metadata?.avatar_url || null);
          }
          setIsLoadingAvatar(false);
          return;
        }

        // Fetch profile data in parallel with session check
        const [sessionResult, profileResult] = await Promise.all([
          supabase.auth.getSession(),
          supabase.from('profiles').select('*').eq('id', user.id).single()
        ]);

        if (sessionResult.error || !sessionResult.data.session) return;
        const session = sessionResult.data.session;

        if (profileResult.error && profileResult.error.code === 'PGRST116') {
          const newProfile = {
            id: session.user.id,
            username: session.user.email?.split('@')[0] || 'user',
            avatar_url: null
          };

          const { data } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();

          if (data) {
            setUserData(data);
            setUsername(data.username);
            setTempUsername(data.username);
            sessionStorage.setItem(`profile_${user.id}`, JSON.stringify(data));
          }
        } else if (profileResult.data) {
          const profile = profileResult.data;
          setUserData(profile);
          setUsername(profile.username || session.user.email?.split('@')[0] || 'user');
          setTempUsername(profile.username || session.user.email?.split('@')[0] || 'user');
          sessionStorage.setItem(`profile_${user.id}`, JSON.stringify(profile));

          if (profile.avatar_url) {
            const { data: avatarData } = await supabase
              .storage
              .from('avatars')
              .createSignedUrl(profile.avatar_url, 3600);
            
            if (avatarData?.signedUrl) {
              setAvatarUrl(avatarData.signedUrl);
              sessionStorage.setItem(`avatar_${user.id}`, avatarData.signedUrl);
            }
          } else {
            // Only use Google avatar if no custom avatar exists
            setAvatarUrl(user.user_metadata?.avatar_url || null);
          }
        }
        setIsLoadingAvatar(false);
      } catch (error) {
        console.error('Error in fetchUserData:', error);
        setIsLoadingAvatar(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Update cache when avatar changes
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      if (!user) throw new Error("You must be logged in to upload an avatar");
      if (!file.type.startsWith("image/")) throw new Error("Please upload an image file");
      if (file.size > 5 * 1024 * 1024) throw new Error("File size must be less than 5MB");

      // Create preview and preload it
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target.result);
        const img = new Image();
        img.src = event.target.result;
        avatarImageRef.current = img;
      };
      reader.readAsDataURL(file);

      const filePath = `${user.id}/${file.name}`;

      if (userData?.avatar_url) {
        await supabase.storage.from('avatars').remove([userData.avatar_url]);
      }

      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = await supabase
        .storage
        .from('avatars')
        .createSignedUrl(filePath, 3600);

      if (urlData?.signedUrl) {
        setAvatarUrl(urlData.signedUrl);
        setAvatarPreview(null);
        updateAvatar(urlData.signedUrl);
        
        // Update caches
        sessionStorage.setItem(`avatar_${user.id}`, urlData.signedUrl);
        const updatedProfile = { ...userData, avatar_url: filePath };
        sessionStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedProfile));
        setUserData(updatedProfile);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setUploadError(error.message || 'An unknown error occurred');
      setAvatarPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

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
              {isLoadingAvatar ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : avatarPreview || avatarUrl ? (
                <img
                  ref={avatarImageRef}
                  src={avatarPreview || avatarUrl}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="sync"
                  onError={(e) => {
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
                    title={t('profile.editUsername')}
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
                  <span className="px-2 py-0.5 bg-green-900/30 text-green-500 text-xs rounded-full">{t('profile.verifiedWithGoogle')}</span>
                ) : user?.email_confirmed_at ? (
                  <span className="px-2 py-0.5 bg-green-900/30 text-green-500 text-xs rounded-full">{t('profile.verified')}</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-yellow-900/30 text-yellow-500 text-xs rounded-full">{t('profile.unverified')}</span>
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
                          <span>{t('profile.sending')}</span>
                        </div>
                      ) : (
                        t('profile.resendConfirmation')
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
              {t('profile.memberSince')} {format(new Date(user?.created_at || new Date()), "MMMM d, yyyy")}
            </div>
          </div>
        </div>
      </div>

      {/* Plan Information */}
      <div className="bg-[#1a1a1a] border border-zinc-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{t('profile.planInformation')}</h3>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-white font-medium">{userData?.plan || 'Free'}</span>
              <span className="text-zinc-400"> – {userData?.thumbnails_limit || 50} {t('profile.thumbnailsMonth')}</span>
            </div>
            <button className="px-4 py-1.5 bg-white text-black font-medium rounded-md hover:bg-zinc-200 transition-colors">
              {t('profile.upgradePlan')}
            </button>
          </div>

          <div className="mb-1 flex justify-between text-sm">
            <span className="text-zinc-400">{t('profile.usage')}</span>
            <span className="text-zinc-400">
              {userData?.thumbnails_used || 0} / {userData?.thumbnails_limit || 50} {t('profile.thumbnailsUsed')}
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
            {t('profile.nextBillingDate')}: {format(new Date(userData.next_billing_date), "MMMM d, yyyy")}
          </div>
        )}
      </div>
    </div>
  )
}
