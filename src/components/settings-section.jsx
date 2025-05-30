"use client"

import { useState } from "react"
import { AlertCircle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DeleteAccountDialog from "./delete-account-dialog"
import { useLanguage } from "@/lib/LanguageContext"

export default function SettingsSection() {
  const { language, setLanguage, t } = useLanguage()
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Experimental features (disabled)
  const [experimentalFeatures, setExperimentalFeatures] = useState({
    animatedThumbnails: false,
    autoKeywords: false,
  })

  return (
    <div className="space-y-8">
      {/* Language Settings */}
      <div className="bg-[#1a1a1a] border border-zinc-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {t('settings.language')}
        </h3>

        <div className="max-w-xs">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="russian">Русский</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Email Notifications */}
      <div className="bg-[#1a1a1a] border border-zinc-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {t('settings.emailNotifications')}
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-white font-medium">
                {t('settings.productUpdates')}
              </h4>
              <p className="text-sm text-zinc-400">
                {t('settings.productUpdatesDesc')}
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
              className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-zinc-700"
            />
          </div>
        </div>
      </div>

      {/* Experimental Features */}
      <div className="bg-[#1a1a1a] border border-zinc-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-white">
            {t('settings.experimentalFeatures')}
          </h3>
          <span className="px-2 py-0.5 text-xs bg-purple-900/50 text-purple-400 border border-purple-800/50 rounded-full">
            {t('settings.beta')}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-white font-medium">
                {t('settings.animatedThumbnails')}
              </h4>
              <p className="text-sm text-zinc-400">
                {t('settings.animatedThumbnailsDesc')}
              </p>
            </div>
            <Switch
              checked={experimentalFeatures.animatedThumbnails}
              onCheckedChange={(checked) =>
                setExperimentalFeatures(prev => ({
                  ...prev,
                  animatedThumbnails: checked
                }))
              }
              className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-zinc-700"
              disabled
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-white font-medium">
                {t('settings.autoKeywords')}
              </h4>
              <p className="text-sm text-zinc-400">
                {t('settings.autoKeywordsDesc')}
              </p>
            </div>
            <Switch
              checked={experimentalFeatures.autoKeywords}
              onCheckedChange={(checked) =>
                setExperimentalFeatures(prev => ({
                  ...prev,
                  autoKeywords: checked
                }))
              }
              className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-zinc-700"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="bg-[#1a1a1a] border border-zinc-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {t('settings.dataPrivacy')}
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="px-4 py-2 bg-red-900/20 text-red-500 border border-red-900/30 rounded-md hover:bg-red-900/30 transition-colors text-sm font-medium w-fit flex items-center"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              {t('settings.deleteAccount')}
            </button>
            <p className="text-xs text-zinc-500">
              {t('settings.deleteAccountDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <DeleteAccountDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
    </div>
  )
}
